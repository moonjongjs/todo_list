import { createSlice } from "@reduxjs/toolkit";

const confirmModal = createSlice({
    name:'컨펌 모달',
    initialState: {
        메시지: '',
        isOpen: false,  // 모달 열기, 닫기
        isYesNo: false, // false 이면 OK(확인) 버튼 기본 || true이면 YES(예) / NO(아니오)        
        isDeleteYes: false    // false 아니오, true 예
    },
    reducers: {
        confirmModalAction(state, action){
            state.메시지 = action.payload.메시지; 
            state.isOpen = action.payload.isOpen;
            state.isYesNo = action.payload.isYesNo;
            state.isDeleteYes = false;
        },
        confirmModalYesAction(state, action){
            state.메시지 = '';
            state.isOpen = false;
            state.isYesNo = false;
            state.isDeleteYes = true  // true 예 버튼 구현
        },
        confirmModalNoAction(state, action){
            state.메시지 = '';
            state.isOpen = false;
            state.isYesNo = false;
            state.isDeleteYes = false  // false 아니오
        } 
    }
})

export default confirmModal.reducer;
export const {confirmModalAction, confirmModalYesAction, confirmModalNoAction} = confirmModal.actions;