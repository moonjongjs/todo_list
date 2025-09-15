"use client";
import React, {useState, useEffect, useRef}  from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import './scss/TodoListComponent.scss';
import { useDispatch, useSelector } from 'react-redux';
import { confirmModalAction } from '@/app/store/confirmModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function TodoListComponent() {

    const dispatch = useDispatch();
    const confirmModal = useSelector((state)=>state.confirmModal);

    const [todo, setTodo] =useState('');                // 할일 입력 상자 상태변수
    const [todoList, setTodoList] = useState([]);       // 할일 전체 목록 상태변수
    const [expires, setExpires] = useState('');         // 날짜 입력 상자 상태변수
    const [update, setUpdate] = useState({});           // 수정할 객체 내용 상태변수
    const [checkUpdate, setCheckUpdate] = useState({}); // 수정할 체크박스 객체내용 상태변수
    const [crud, setCrud] = useState('');               // CRUD 알림메시지 상태변수
    const [del, setDel] = useState('');                 // 삭제 번호 저장 상태변수
    const delNum = useRef(null);


    // [3] 리액트 쿼리 구현
    /////////////////////////////////////////////////////////////////////////
    // [3] R : Read => 할일 목록 함수 구현 todoListAxiosApi()
    /////////////////////////////////////////////////////////////////////////

    // React Query: 목록 GET
    // eslint-disable-next-line no-unused-vars
    const qc = useQueryClient();
    
    // eslint-disable-next-line no-unused-vars
    const { data: fetched, isLoading, isError } = useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const res = await axios.get('/todo_list/todo_crud_rest_full.php');
            if(res.status !== 200) throw new Error('목록 로드 실패');
            // 서버 응답을 기존 형태와 동일하게 보정
            const resData = res.data.map(item => ({
                ...item,
                번호: Number(item.번호),
                완료: Number(item.완료)
            }));
            return resData;
        },
        // // 필요시 옵션 예시:
        // staleTime: 5000,
        // refetchOnWindowFocus: false,
        // retry: 1
    });

    // 서버 목록을 기존 todoList 상태로 반영 (현재 구조 최소 변경)
    useEffect(()=>{   
        
        if (fetched) {    
            console.log( fetched );        
            setTodoList(fetched)
        };
    }, [fetched]);




    /////////////////////////////////////////////////////////////////////////
    // [0] 기한 날짜 시간 입력 상자
    /////////////////////////////////////////////////////////////////////////     
    const onChangeTodoDate=(e)=>{
        setExpires(e.target.value);         // 날짜 입력 상태        
        if(Object.keys(update).length > 0){ // 날짜 수정 상태       
           let 할일 = update;
            할일 = {
                ...할일,
                기한: e.target.value
            }
           setUpdate(할일); // 날짜 수정
           setCrud('UPDATE');
        }
    }

    // 날짜 수정 상태
    const onMouseLeaveDatetimeEvent=(e)=>{
        if(Object.keys(update).length > 0){
            setCrud('UPDATE');
        }
    }

    // 수정 버튼 클릭 이벤트
    const onClickUpdateOk=(e)=>{
        e.preventDefault();
        setCrud('UPDATE_OK');
    }

    // 수정 취소 버튼 클릭 이벤트
    const onClickUpdateCancle=(e)=>{
        e.preventDefault();
        setCrud('UPDATE_CANCLE');
    }


    /////////////////////////////////////////////////////////////////////////
    // [1] 할일 입력 상자
    /////////////////////////////////////////////////////////////////////////      
    const onChangeTodoInput=(e)=>{
   
        if(Object.keys(update).length > 0){   
           let 할일 = update;
            할일 = {
                ...할일,
                할일: e.target.value
            }
            // console.log( 할일 );
            setUpdate(할일); // 날짜 수정
            setCrud('UPDATE');
        }
        setTodo( e.target.value );
    }

    
    /////////////////////////////////////////////////////////////////////////
    // [2] 할일 입력 상자, 날자 시간 달력 입력 상자 엔터키, 마우스 + 클릭 이벤트
    /////////////////////////////////////////////////////////////////////////  
    const onKeyDownTodoInputSave=(e)=>{
        if(e.key==='Enter' || e.type==='click'){ // 키보드 엔터키 또는 마우스클릭
            if(todo.trim()==='') { // 공백제거하고 공백이면
                // alert('할일을 입력하세요');
                dispatch(confirmModalAction({
                    메시지: '할일을 입력하세요',
                    isOpen: true,
                    isYesNo: false,
                }))
                return;
            }
            if(expires==='') {
                // alert('기한 날짜를 입력 선택하세요');
                dispatch(confirmModalAction({
                    메시지: '기한 날짜를 입력 선택하세요',
                    isOpen: true,
                    isYesNo: false,
                }))
                return;
            }
            
            // 수정           
            if(Object.keys(update).length > 0){ // ['번호', '할일', '완료', '기한']                
                setCrud('UPDATE');                        
            }
            else{ 
                setCrud('INSERT');       
            }            

        }
    }



    /////////////////////////////////////////////////////////////////////////
    // [4] U : Update 체크박스 => 할일 완료
    /////////////////////////////////////////////////////////////////////////
    const onChangeCheckbox=(e, 할일)=>{
        e.stopPropagation();  // 부모 이벤트에게 전파를 차단
       
        할일['완료'] = 할일.완료===0?1:0; // 완료 수정은 1회만       
        setCheckUpdate(할일); // DB에 전달하기 위해서 체크박스 업데이트 내용 담는다.

        setCrud('UPDATE_CHK');
    }

    /////////////////////////////////////////////////////////////////////////
    // [5] U : Update 할일, 기한 수정
    /////////////////////////////////////////////////////////////////////////
    const onClickTodoUpdate=(할일)=>{ // LI 태그클릭     
        if(update.번호===할일.번호) return; 
        setCrud('');    
        // 현재 할일 선택
        setUpdate( 할일 );    // {...}  상태변수에 저장        
        setTodo(할일.할일)    // 입력상자에 수정내용 할일 입력
        setExpires(할일.기한) // 날짜시간 입력상자에 기한 입력
    }


    /////////////////////////////////////////////////////////////////////////
    // [6] D : Delete => 할일 삭제
    /////////////////////////////////////////////////////////////////////////    
    const onClickDelBtn=(e, 번호)=>{
        e.stopPropagation();  // 스톱프로파게이션 : li 부모의 click 이벤트 전파를 차단
        
        delNum.current = 번호;  // 삭제 임시 번호 초기화
        // const res = window.confirm("정말로 삭제 하시겠습니까?");
        dispatch(confirmModalAction(
            {
                메시지: '정말로 삭제 하시겠습니까?',
                isOpen: true,
                isYesNo: true,
            }
        ))
    }

    useEffect(()=>{
        if(confirmModal.isDeleteYes){           
            const obj = {
                메시지: '',
                isOpen: false,
                isYesNo: false
            }
            dispatch(confirmModalAction(obj)) // store 초기화
            setDel(delNum.current);  // 번호
            delNum.current = null;   // 삭제 임시 번호 초기화
            setCrud('DELETE');           
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmModal])



    /////////////////////////////////////////////////////////////////////////
    // [7] CRUD WATCHERS 감시자
    ///////////////////////////////////////////////////////////////////////// 
    useEffect(()=>{

        // 리액트 쿼리로 교체
        // React Query 캐시 조작을 위해 필요
        // (컴포넌트 상단에 const qc = useQueryClient(); 선언되어 있어야 합니다)
        const crudAxiosApi = async (url, method, formData, action) => {
            if (!url || !method || formData == null) return;

            // 1) 낙관적 업데이트 (옵션)
            // 실패하면 rollback()으로 되돌립니다.
            let rollback;
            if (action === 'DELETE') {
                const prev = qc.getQueryData(['todos']);
                qc.setQueryData(['todos'], (old = []) => old.filter(item => item.번호 !== del));
                rollback = () => qc.setQueryData(['todos'], prev);
            }
            else if (action === 'UPDATE_CHK') {
                const prev = qc.getQueryData(['todos']);
                const { 번호, 완료 } = checkUpdate;
                qc.setQueryData(['todos'], (old = []) =>
                    old.map(item => (item.번호 === 번호 ? { ...item, 완료 } : item))
                );
                rollback = () => qc.setQueryData(['todos'], prev);
            }
            else if (action === 'UPDATE_OK') {
                const prev = qc.getQueryData(['todos']);
                const id = update.번호;
                const { w_todo, w_expires } = formData;
                qc.setQueryData(['todos'], (old = []) =>
                    old.map(item => (item.번호 === id ? { ...item, 할일: w_todo, 기한: w_expires } : item))
                );
                rollback = () => qc.setQueryData(['todos'], prev);
            }
            // INSERT는 목록에 새 항목 구조가 확정적이지 않다면 낙관적 추가를 생략하고 invalidate만으로 충분

            try {
                const res = await axios({
                    url: `/todo_list/${url}`,   // PROXY 사용중
                    method,
                    data: formData,
                    headers: { 'Content-Type': 'application/json' }
                });

                if (res.status === 200 && res.data === 1) {
                    // 2) 성공 공통 처리
                    setDel('');
                    setCrud('');

                    // 성공 후 최신화( fresh 남아 있어도 강제 stale → 재조회 )
                    qc.invalidateQueries({ queryKey: ['todos'] });
                }
                else {
                    // 서버가 1이 아니면 실패 취급 → 롤백
                    rollback?.();
                }
            } catch (err) {
                console.log('AXIOS 실패!', err);
                // 네트워크/서버 에러 → 롤백
                rollback?.();
                // 필요시 에러 모달:
                // dispatch(confirmModalAction({ 메시지:'요청 실패', isOpen:true, isYesNo:false }));
            }
        };


        let url = '';
        let method = '';
        let formData = null;
        const action = crud; // 낙관적 업데이트에서 어떤 액션인지 알아야 하므로 보관        

        if(crud==='INSERT'){                // 입력
            url = 'todo_crud_rest_full.php';
            method = 'POST';
            formData = {
                w_todo: todo.trim(),
                w_completed: 0,
                w_expires: expires
            }            
            setExpires('');
            setTodo('');
            setCrud('');
        }
        else if(crud==='UPDATE_CHK'){       // 수정 체크박스 완료 여부(TRUE / FALSE)
            url = 'todo_crud_rest_full.php';
            method = 'PUT';
            formData = {
                flag: 'PUT1',
                w_no: checkUpdate.번호,
                w_completed: checkUpdate.완료                
            }   
            setCrud('');               
        }
        else if(crud==='UPDATE_CANCLE'){    // 수정 취소
            setUpdate('');
            setExpires('');
            setTodo('');
            setCrud('');            
        }
        else if(crud==='UPDATE_OK'){        // 수정 요청
            
            url = 'todo_crud_rest_full.php';
            method = 'PUT';      
            formData = {
                flag: 'PUT2',
                w_no: update.번호,
                w_todo: todo.trim(),
                w_expires: expires
            }
            setUpdate('');
            setExpires('');
            setTodo('');
            setCrud('');   
        }
        else if(crud==='DELETE'){           // 삭제
            url = 'todo_crud_rest_full.php';
            method = 'DELETE';
            formData = {
                w_no: del
            };
            setCrud('');
        }

        // crudAxiosApi(url, method, formData);      리액트 쿼리 action 아규먼트 변수 추가  
        crudAxiosApi(url, method, formData, action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[crud])

    return (
        <section id="todoSection">
            <div className="container">
                <div className="input-box">
                    <div className="input-container">
                        <input 
                            type="datetime-local" 
                            name='date'
                            id='date'
                            onChange={onChangeTodoDate}                            
                            value={expires}
                            onMouseLeave={onMouseLeaveDatetimeEvent}
                        />
                        <input 
                            type="text" 
                            name="todoInput" 
                            id="todoInput" 
                            placeholder="+ 할 일 추가"
                            onChange={onChangeTodoInput}
                            onKeyDown={onKeyDownTodoInputSave}
                            value={todo}
                        />
                        {/* + 버튼 */}
                        <button className="add-btn" onClick={onKeyDownTodoInputSave}>
                            <img src="./img/add_2_50dp_5F6368_FILL0_wght300_GRAD0_opsz48.svg" alt="" />
                        </button>
                    </div>
                </div>
                <div className="list-box">
                    <div className="list-container">

                        <hr />
                        <div className="title title1">
                            <h3>
                                <strong>할일</strong>
                                <span className="todo-count">&nbsp;({todoList.filter((item)=>item.완료===0).length})</span>
                            </h3>
                        </div>
                        <div className="todo-list-box">
                            <ul id="todoListBox">                                
                               
                                {   isLoading && <li style={{padding:'2rem'}}>로딩…</li>    }
                                {   isError   && <li style={{padding:'2rem'}}>목록 로드 실패</li>   }

                                    
                                {   // eslint-disable-next-line array-callback-return                                 
                                    todoList.map((item)=>{
                                        if(item.완료===0){
                                            return(
                                               <li key={item.번호} data-id={item.번호} className={`${item.완료?'completed':''} ${(crud==='UPDATE' && (update.번호===item.번호)) ? ' on':''}`}>
                                                   <div>
                                                        <div className="left-box">
                                                            <input 
                                                                type="checkbox" 
                                                                data-id={item.번호} 
                                                                name={`chk${item.번호}`} 
                                                                id={`chk${item.번호}`}
                                                                className='chk'
                                                                value={item.할일}
                                                                checked={item.완료}
                                                                onChange={(e)=>onChangeCheckbox(e, item)}
                                                            />

                                                            <p onClick={()=>onClickTodoUpdate(item)}>
                                                                <span>{format(item.기한, 'yyyy-MM-dd HH:mm')}</span> 
                                                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>{item.할일}</strong>
                                                            </p>
                                                        </div>
                                                        <span className='right-box'>                                                            
                                                            
                                                            {
                                                            (crud==='UPDATE' && (update.번호===item.번호)) && 
                                                            <span className='update-box'>
                                                                <button  onClick={onClickUpdateOk}>수정</button>
                                                                <button  onClick={onClickUpdateCancle}>취소</button>
                                                            </span>
                                                            }   
                                                            <button
                                                                className="del-btn"
                                                                value={item.번호}
                                                                data-id={item.번호}
                                                                onClick={(e)=>onClickDelBtn(e,item.번호)}
                                                            />                                                 
                                                        </span>
                                                   </div>
                                               </li> 
                                            )
                                        }
                                    })     
                               }
                            </ul>
                        </div>

                        <hr />
                        <div className="title title2">
                            <h3>
                                <strong>완료</strong>
                                <span className="check-count">&nbsp;({todoList.filter((item)=>item.완료===1).length})</span>
                            </h3>
                        </div>
                        <div className="check-list-box">                            
                            <ul id="checkListBox">

                            {
                                // eslint-disable-next-line array-callback-return
                                todoList.map((item)=>{
                                    if(item.완료===1){
                                        return(
                                            <li key={item.번호} data-id={item.번호} className={`${item.완료?'completed':''} ${(crud==='UPDATE' && (update.번호===item.번호)) ? ' on':''}`}>
                                                <div>
                                                    <div className="left-box">
                                                        <input 
                                                            type="checkbox" 
                                                            data-id={item.번호} 
                                                            name={`chk${item.번호}`} 
                                                            id={`chk${item.번호}`}
                                                            className='chk'
                                                            value={item.할일}
                                                            checked={item.완료}
                                                            onChange={(e)=>onChangeCheckbox(e, item)}
                                                        />

                                                        <p onClick={()=>onClickTodoUpdate(item)}>
                                                            <span>{format(item.기한, 'yyyy-MM-dd HH:mm')}</span> 
                                                            &nbsp;&nbsp;&nbsp;&nbsp;<strong>{item.할일}</strong>
                                                        </p>
                                                    </div>
                                                    <span className='right-box'>                                                            
                                                        
                                                        {
                                                        (crud==='UPDATE' && (update.번호===item.번호)) && 
                                                        <span className='update-box'>
                                                            <button  onClick={onClickUpdateOk}>수정</button>
                                                            <button  onClick={onClickUpdateCancle}>취소</button>
                                                        </span>
                                                        }   
                                                        <button
                                                            className="del-btn"
                                                            value={item.번호}
                                                            data-id={item.번호}
                                                            onClick={(e)=>onClickDelBtn(e,item.번호)}
                                                        />                                                 
                                                    </span>
                                                </div>
                                            </li> 
                                        )
                                    }
                                })     
                            }

                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}