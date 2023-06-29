import React, { useState,useEffect } from 'react'
import loginBg from './static/login-bg.png'
import logo from './static/favicon.svg'
import book from "./static/ic_firebase.png"
import { Divider,Alert } from 'antd';
import LoginForm from "./components/loginForm"
import {
        WechatOutlined,
        QqOutlined,
        WeiboOutlined
      } from '@ant-design/icons';
import "./style/login.less"
export default function(){
        return (
                <div className="login-content">
                        <div className="login-header">
                                <a href="/"><img src={logo} className="App-logo" alt="logo" /></a>
                        </div>
                        <div className="login-bg">
                                <h3>Hi, Welcome Back</h3>
                                <img src={loginBg} />
                        </div>
                        <div className="login-form">
                                <div className="login-form-content">
                                        <div className="title">
                                                <p>Enter your credentials to continue</p>
                                                <img src={book} aria-label="Firebase"/>
                                        </div>
                                        
                                        <div className="sign-icon">
                                                <a className="circle qq"><QqOutlined /></a>
                                                <a className="circle wx"><WechatOutlined /></a>
                                                <a className="circle wb"><WeiboOutlined /></a>
                                        </div>
                                        <Divider>OR</Divider>
                                        <Alert message="Use email : lileilei@ewell.cc / password : 123456" type="info" showIcon  style={{marginBottom:"24px"}}/>
                                        <LoginForm />

                                </div>
                        </div>
                        
                </div>
                
        )
}