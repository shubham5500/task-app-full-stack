'use client'
import React, { useEffect, useState } from 'react';
import { LoginForm } from './(components)/login-form';
import { RegisterForm } from './(components)/register-form';
console.log('/////////////////////////');
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState('');

    useEffect(() => {
        setIsLogin('LOGIN')
console.log('/////////////////////////');

    }, [])

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setIsLogin('LOGIN')}
                        className={`px-4 py-2 ${isLogin === 'LOGIN' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin("REGISTER")}
                        className={`px-4 py-2 ${isLogin === 'REGISTER' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Register
                    </button>
                </div>
                {isLogin === 'LOGIN' && (
                    <LoginForm />
                )}
                {(isLogin === 'REGISTER' && <RegisterForm setIsLogin={setIsLogin} />)}
            </div>
        </div>
    );
};


export default AuthPage;
