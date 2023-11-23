// ForgotPassword.jsx
import React, { useState } from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

const SendToken = ({ setTokenSent }) => {
    const handleSendToken = () => {
        // Gửi yêu cầu và xử lý khi thành công
        // ...

        // Đặt trạng thái đã gửi token thành công
        setTokenSent(true);
    };

    return (
        <div>
            <h2>Send Token</h2>
            <button onClick={handleSendToken}>Send Token</button>
        </div>
    );
};

const ChangePassword = ({ setTokenSent }) => {
    const handleBack = () => {
        // Đặt trạng thái đã gửi token thành công về false khi quay lại
        setTokenSent(false);
    };

    return (
        <div>
            <h2>Change Password</h2>
            <button onClick={handleBack}>Back</button>
        </div>
    );
};

const ForgotPassword = () => {
    const [tokenSent, setTokenSent] = useState(false);

    return (
        <div>
            <h1>Forgot Password</h1>
            <ul>
                <li>
                    <Link to='/'>Send Token</Link>
                </li>
                <li>
                    <Link to='/change-password'>Change Password</Link>
                </li>
            </ul>

            <hr />

            <SendToken setTokenSent={setTokenSent} />
            <ChangePassword setTokenSent={setTokenSent} />
        </div>
    );
};

export default ForgotPassword;
