import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import styles from './SendToken.module.scss';

import * as authServices from '~/api/authServices';

const cx = classNames.bind(styles);
function SendToken() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState({
        status: false,
        text: '',
    });

    const submit = async (e) => {
        const res = await authServices.sendToken(email);
        if (res.type === 'error') {
            setErrorMessage({
                status: true,
                text: 'Email không hợp lệ',
            });
        } else {
            navigate('/forgotPassword');
        }
    };
    return (
        <div>
            <MDBContainer fluid className='vh-100'>
                <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                    <MDBCol col='12'>
                        <MDBCard
                            className='bg-dark text-white my-5 mx-auto'
                            style={{ borderRadius: '1rem', maxWidth: '400px' }}
                        >
                            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                                <h2 className='fw-bold mb-2 text-uppercase text-white'>
                                    Nhập địa chỉ Email
                                </h2>
                                <p
                                    className='fw-bold mb-5 mt-2 fz-2rem'
                                    style={{ color: '#ff3d13' }}
                                >
                                    Forgot Password!
                                </p>

                                <MDBInput
                                    wrapperClass='mb-5 mx-10 w-100 p-2'
                                    labelClass='text-white'
                                    label='Email'
                                    type='email'
                                    className={cx('input')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    style={{
                                        color: '#ff3d13',
                                        fontSize: '16px',
                                    }}
                                    onClick={submit}
                                >
                                    Xác thực
                                </MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}

export default SendToken;
