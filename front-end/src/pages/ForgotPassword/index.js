import React, { useState, useEffect } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
} from 'mdb-react-ui-kit';
import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as userServices from '~/api/userServices';

const cx = classNames.bind(styles);
function ForgotPassword() {
    const [token, setToken] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [errorMessage, setErrorMessage] = useState({
        status: false,
        text: '',
    });
    const navigate = useNavigate();

    const checkPassword = () => {
        return confirmPassword === password;
    };

    const submit = async (e) => {
        if (checkPassword()) {
            e.preventDefault();
            const res = await userServices.changePassword({ token, password });
            if (res.type === 'success') {
                navigate('/login');
            } else {
                setErrorMessage({
                    status: true,
                    text: 'Token không hợp lệ',
                });
            }
        } else {
            setErrorMessage({
                status: true,
                text: 'Mật khẩu không trùng khớp',
            });
        }
    };
    return (
        <MDBContainer fluid className='vh-100'>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>
                    <MDBCard
                        className='bg-dark text-white my-5 mx-auto'
                        style={{ borderRadius: '1rem', maxWidth: '400px' }}
                    >
                        <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                            <h2 className='fw-bold mb-2 text-uppercase text-white'>
                                Forgot Password
                            </h2>

                            <MDBInput
                                wrapperClass='mb-5 mx-10 w-100 p-2'
                                labelClass='text-white'
                                label='Token'
                                type='text'
                                className={cx('input')}
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                size='lg'
                            />
                            <MDBInput
                                wrapperClass='mb-5 mx-10 w-100 p-2'
                                labelClass='text-white'
                                label='Mật khẩu'
                                type='password'
                                className={cx('input')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                size='lg'
                            />
                            <MDBInput
                                wrapperClass='mb-5 mx-10 w-100 p-2'
                                labelClass='text-white'
                                label='Xác nhận mật khẩu'
                                type='password'
                                className={cx('input')}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                size='lg'
                            />
                            {errorMessage.status && (
                                <span className={cx('error')}>
                                    {errorMessage.text}
                                </span>
                            )}
                            <MDBBtn
                                outline
                                className='mx-2 px-5 mb-5 fw-bold'
                                color='white'
                                size='lg'
                                style={{ color: '#ff3d13', fontSize: '16px' }}
                                onClick={submit}
                            >
                                Thay đổi mật khẩu
                            </MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default ForgotPassword;
