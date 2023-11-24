import classNames from 'classnames/bind';
import styles from './ModalAccount.module.scss';
import React, { useState, useContext, memo } from 'react';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInput,
    MDBDropdown,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBDropdownItem,
} from 'mdb-react-ui-kit';

import { AppContext } from '~/Context/AppContext';
import * as authServices from '~/api/authServices';

const cx = classNames.bind(styles);
function ModalAccount() {
    const { isModalAccountVisible, data, typeModal, setIsModalAccountVisible } =
        useContext(AppContext);
    const [email, setEmail] = useState();
    const [fullname, setFullname] = useState();
    const [passwordField, setPasswordField] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [role, setRole] = useState();
    const [error, setError] = useState({
        isError: false,
        message: '',
    });

    const handleAddAccount = async (fullname, email, password, role) => {
        if (passwordField === confirmPassword) {
            const result = await authServices.addAccount({
                fullname: fullname,
                email: email,
                password: password,
                role: role,
            });
            console.log(result);
            if (result.type === 'success') {
                setIsModalAccountVisible(false);
            } else {
                setError({
                    isError: true,
                    message: result.mess,
                });
            }
        } else {
            setError({
                isError: true,
                message: 'Mật khẩu không trùng khớp',
            });
            console.log('Mật khẩu không trùng khớp');
        }
    };

    return (
        <div className={cx('wrapper-modal')}>
            <MDBModal show={isModalAccountVisible} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Thêm tài khoản</MDBModalTitle>
                            <MDBBtn
                                className='btn-close'
                                color='none'
                                onClick={() => setIsModalAccountVisible(false)}
                            ></MDBBtn>
                        </MDBModalHeader>

                        <MDBModalBody>
                            <MDBInput
                                className={cx('input')}
                                label={'Họ và tên'}
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                type='text'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Email'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type='email'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Mật khẩu'}
                                value={passwordField}
                                onChange={(e) =>
                                    setPasswordField(e.target.value)
                                }
                                type='password'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Xác nhận mật khẩu'}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                type='password'
                            />

                            <div className={cx('wrapper-dropdown')}>
                                <MDBDropdown className={cx('dropdown')}>
                                    <MDBDropdownToggle>
                                        Vai trò
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem
                                            link
                                            onClick={() => setRole('Admin')}
                                        >
                                            Admin
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() => setRole('Nhân viên')}
                                        >
                                            Nhân viên
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() =>
                                                setRole('Khách hàng')
                                            }
                                        >
                                            Khách hàng
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                <div className={cx('value_dropdown')}>
                                    {role}
                                </div>
                            </div>
                            <p className={cx('error-message')}>
                                {error.message}
                            </p>
                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn
                                className={cx('button_save')}
                                color='secondary'
                                onClick={() => setIsModalAccountVisible(false)}
                            >
                                Huỷ
                            </MDBBtn>
                            <MDBBtn
                                className={cx('button_save')}
                                onClick={() => {
                                    handleAddAccount(
                                        fullname,
                                        email,
                                        passwordField,
                                        role
                                    );
                                }}
                            >
                                Lưu
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    );
}

export default memo(ModalAccount);
