"use client";
import React from 'react';
import './scss/ConfirmModalComponent.scss';
import { useDispatch, useSelector } from 'react-redux';
import { confirmModalAction, confirmModalYesAction, confirmModalNoAction } from '@/app/store/confirmModal';

export default function ConfirmModalComponent() {

    const confirm = useSelector((state)=>state.confirmModal);
    const dispatch = useDispatch();

    const onClickConfirmModalClose=(e)=>{
        e.preventDefault();
        const obj = {
            메시지: '',
            isOpen: false,
            isYesNo: false
        }
        dispatch(confirmModalAction(obj));
    }

    // 예 클릭 이벤트
    const onClickYes=(e)=>{
        e.preventDefault()        
        dispatch(confirmModalYesAction())      
    }

    // 아니오 클릭 이벤트
    const onClickNo=(e)=>{
        e.preventDefault()
        dispatch(confirmModalNoAction())
    }

    return (
        <div id='confirmModal'>
            <div className="container">
                <div className="content">
                    <div className="message-box">
                        <p>{confirm.메시지}</p>
                    </div>
                    <div className="button-box">
                    {
                       confirm.isYesNo===false ? 
                        <div className="btn1">
                            <button onClick={onClickConfirmModalClose}>확인</button>
                        </div>
                        :
                        <div className="btn2">
                            <button onClick={onClickYes}>예</button>
                            <button onClick={onClickNo}>아니오</button>
                        </div> 
                    }                                               
                    </div>
                </div>
            </div>
        </div>
    );
}
