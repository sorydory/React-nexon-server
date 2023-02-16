import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin, setLogout } from '../modules/logincheck';


const Header = () => {
    const isLogin = useSelector(state=>state.logincheck.isLogin);
    return (
        <header>
            <div className='menu'>
                <h1><a href='/'><img src='images/main_logo.png' alt='' /></a></h1>
                <ul className='main_menu'>
                   <li><Link to='/SubNexonGames'>넥슨게임즈</Link></li>
                    <li><a href=''>게임</a></li>
                    <li><a href=''>인재채용</a></li>
                    <li><a href=''>투자정보</a></li>
                    <li><Link to='/media'>미디어</Link></li>
                </ul>
                <div className='member'>
                    <ul className='membermenu'>
                    { isLogin ? <><li onClick={logoutClick}>로그아웃</li>
                        <li><Link to="/join">회원정보</Link></li></> :
                        <><li><Link to="/login">로그인</Link></li>
                        <li><Link to="/join">회원가입</Link></li></>
                    } 
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;