"use client";
import React from 'react';

import FooterComponent from './wrap/FooterComponent';
import ConfirmModalComponent from './wrap/ConfirmModalComponent';
import { useSelector } from 'react-redux';
import HeaderComponent from './wrap/HeaderComponent';

export default function WrapComponent({children}) {

    const isOpen = useSelector((state)=>state.confirmModal.isOpen)

    return (
        <div id="wrap">            
            <HeaderComponent />
            <main id="main">
                {children}
            </main>
            <FooterComponent />
        {
            isOpen && 
            <ConfirmModalComponent />
        }
        </div>
    );
}