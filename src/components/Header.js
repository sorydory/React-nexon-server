import React from 'react';
import './Header.css';
import { BiChevronsUp, BiChevronsDown } from "react-icons/bi";

const Header = () => {
    return (
        <header>
            <div className='menu'>
                <h1><img src='images/main_logo.png' alt='' /></h1>
                <ul>
                    <li><a href=''>넥슨게임즈</a> </li>
                    <li><a href=''>게임</a></li>
                    <li><a href=''>인재채용</a></li>
                    <li><a href=''>투자정보</a></li>
                    <li><a href=''>미디어</a></li>
                </ul>
                <div className='icon'>
                <BiChevronsUp/>
                <BiChevronsDown/>
            </div>
            </div>
            <div className='hidden'>
                <ul>
                    <li><a href='/'>넥슨게임즈</a></li>
                </ul>
                <ul>
                    <li><a href='/'>히트2</a></li>
                    <li><a href='/'>베일드 엑스퍼트</a></li>
                    <li><a href='/'>블루 아카이브</a></li>
                    <li><a href='/'>V4</a></li>
                </ul>
                <ul>
                    <li><a href='/'>기업문화</a></li>
                    <li><a href='/'>피플&컬쳐</a></li>
                    <li><a href='/'>복지</a></li>
                    <li><a href='/'>채용</a></li>
                 </ul>
                <ul>
                    <li><a href='/'>기업지배구조</a></li>
                    <li><a href='/'>주가정보</a></li>
                    <li><a href='/'>재무정보</a></li>
                    <li><a href='/'>공시/공고</a></li>
                </ul>
                <ul>
                    <li><a href='/'>뉴스</a></li>
                    <li><a href='/'>보도자료</a></li>
                    <li><a href='/'>멀티미디어</a></li>
                </ul>
             </div>
        </header>
    );
};

export default Header;