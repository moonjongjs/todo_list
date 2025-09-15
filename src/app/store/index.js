import { configureStore } from '@reduxjs/toolkit';
import confirmModal from './confirmModal';

export const store = configureStore({
  reducer : {
    confirmModal   
  }
}); 
