import React, { useState, useContext, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
} from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPen } from '@fortawesome/free-solid-svg-icons';

import Image from '~/components/Image';
import * as userServices from '~/api/userServices';
import Toast from '~/components/Toast';
import { AppContext } from '~/Context/AppContext';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Avatar() {
    const { auth } = useSelector((state) => state.auth);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(auth.avatar || '');
    const { setIsToastVisible } = useContext(AppContext);
    const formDataRef = useRef(new FormData());

    useEffect(() => {
        return () => {
            previewImage && URL.revokeObjectURL(previewImage);
        };
    }, [previewImage]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        formDataRef.current.append('avatar', file);
        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
        setIsEditing(true);
        e.target.value = null;
    };

    const handleCancel = () => {
        setSelectedImage(null);
        setIsEditing(false);
        setPreviewImage('');
    };

    function formDataToJSON(formData) {
        const json = {};
        for (const [key, value] of formData.entries()) {
            json[key] = value;
        }
        return json;
    }

    const handleSave = async () => {
        // Call your API to save the selected image
        // ...
        formDataRef.current.append('user_id', auth.user_id);
        console.log(formDataToJSON(formDataRef.current));
        try {
            const result = await userServices.updateAvatar(formDataRef.current);
            // Cập nhật dữ liệu mới vào localStorage
            localStorage.setItem('auth', JSON.stringify(result));
            if (result.type === 'success') {
                setAvatarUrl(result.data.avatar);
                setIsToastVisible({
                    type: 'success',
                    message: 'Đã cập nhật thông tin thành công',
                    title: 'Thành công',
                    open: true,
                });
            } else {
                setIsToastVisible({
                    type: 'error',
                    message: 'Có lỗi xảy ra. Vui lòng thử lại sau',
                    title: 'Thất bại',
                    open: true,
                });
            }
        } catch (error) {
            // Xử lý lỗi nếu cần
            setIsToastVisible({
                type: 'error',
                message: 'Có lỗi xảy ra. Vui lòng thử lại sau',
                title: 'Thất bại',
                open: true,
            });
        }

        setIsEditing(false);
    };

    return (
        <MDBCard className={cx('mb-4', 'card')}>
            <MDBCardBody className={cx('text-center', 'card__body')}>
                <Image
                    src={isEditing ? previewImage : avatarUrl}
                    alt='avatar'
                    className='rounded-circle'
                    style={{ width: '150px', height: '150px' }}
                    fluid
                />
                <div
                    className={cx(
                        'd-flex',
                        'justify-content-center',
                        'mb-2',
                        'mt-5',
                        'card__body--icon'
                    )}
                >
                    <label className={cx('label')} htmlFor='avatar'>
                        {!isEditing ? <FontAwesomeIcon icon={faCamera} /> : ''}
                    </label>
                    <input
                        type='file'
                        id='avatar'
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                {isEditing && (
                    <div style={{ marginTop: '10px' }}>
                        <Button
                            primary
                            style={{ padding: '5px', marginLeft: '10px' }}
                            onClick={handleCancel}
                        >
                            Huỷ
                        </Button>
                        <Button
                            primary
                            style={{ padding: '5px', marginLeft: '10px' }}
                            onClick={handleSave}
                        >
                            Lưu
                        </Button>
                    </div>
                )}
            </MDBCardBody>
        </MDBCard>
    );
}

function ProfileField({ label, value, editing, onEdit, onChange }) {
    const isEmailField = label.toLowerCase() === 'email';
    return (
        <MDBRow>
            <MDBCol sm='3'>
                <MDBCardText>{label}</MDBCardText>
            </MDBCol>
            <MDBCol sm='8'>
                {editing ? (
                    <input
                        type='text'
                        className={cx('form-control')}
                        value={value}
                        onChange={onChange}
                    />
                ) : (
                    <p className='text-muted mb-0'>{value}</p>
                )}
            </MDBCol>
            <MDBCol sm='1'>
                {!isEmailField && !editing && (
                    <FontAwesomeIcon icon={faPen} onClick={onEdit} />
                )}
            </MDBCol>
        </MDBRow>
    );
}

function Profile() {
    const { auth } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState({
        fullname: auth?.fullname,
        email: auth?.email,
        dob: auth?.dob,
        gender: auth?.gender,
        phone_number: auth?.phone_number,
        card_id: auth?.card_id,
        address: auth?.address,
    });

    const { isToastVisible, setIsToastVisible } = useContext(AppContext);

    const [editingField, setEditingField] = useState('');

    const handleEditClick = (field) => {
        setEditingField(field);
    };

    const handleInputChange = (event) => {
        // handleInputChange sẽ được gọi khi giá trị trong input thay đổi
        // và cập nhật giá trị mới cho trường tương ứng trong state
        // ở đây tôi giả sử "hoTen" là trường tương ứng
        const { value } = event.target;
        setProfile({ ...profile, [editingField]: value });
    };

    const handleSaveClick = async (
        user_id,
        fullname,
        dob,
        card_id,
        phone_number,
        address,
        gender
    ) => {
        // Thực hiện lưu các thay đổi vào cơ sở dữ liệu hoặc nơi lưu trữ phù hợp
        try {
            const result = await userServices.updateProfile({
                user_id,
                fullname,
                dob,
                card_id,
                phone_number,
                address,
                gender,
            });
            // Cập nhật dữ liệu mới vào localStorage
            localStorage.setItem('auth', JSON.stringify(result));
            if (result.type === 'success') {
                setIsToastVisible({
                    type: 'success',
                    message: 'Đã cập nhật thông tin thành công',
                    title: 'Thành công',
                    open: true,
                });
            } else {
                setIsToastVisible({
                    type: 'error',
                    message: 'Có lỗi xảy ra. Vui lòng thử lại sau',
                    title: 'Thất bại',
                    open: true,
                });
            }
        } catch (error) {
            // Xử lý lỗi nếu cần
            setIsToastVisible({
                type: 'error',
                message: 'Có lỗi xảy ra. Vui lòng thử lại sau',
                title: 'Thất bại',
                open: true,
            });
        }

        setEditingField('');
    };

    const onChangeDate = (date, dateString) => {
        setProfile({ ...profile, dob: dateString });
    };

    const handleGenderChange = (e) => {
        setProfile({ ...profile, dob: e.target.value });
    };

    return (
        <section
            style={{
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                width: '100vw',
                marginTop: '10vh',
            }}
            className={cx('wrapper')}
        >
            <MDBContainer className='py-5'>
                <MDBRow
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <MDBCol lg='8'>
                        <Avatar />
                    </MDBCol>

                    <MDBCol lg='8'>
                        <MDBCard
                            className='mb-4'
                            style={{ borderRadius: '15px' }}
                        >
                            <MDBCardBody>
                                <ProfileField
                                    label='Họ và tên'
                                    value={profile?.fullname}
                                    editing={editingField === 'fullname'}
                                    onEdit={() => handleEditClick('fullname')}
                                    onChange={handleInputChange}
                                />
                                <hr />
                                <ProfileField
                                    label='Email'
                                    value={profile?.email}
                                    onChange={handleInputChange}
                                />
                                <hr />

                                <MDBRow>
                                    <MDBCol sm='3'>
                                        <MDBCardText>Ngày sinh</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm='8'>
                                        <DatePicker
                                            className={cx('input')}
                                            defaultValue={moment(profile?.dob)}
                                            format={'YYYY/MM/DD'}
                                            onChange={onChangeDate}
                                            disabled={editingField !== 'dob'}
                                        />
                                    </MDBCol>
                                    <MDBCol sm='1'>
                                        {editingField !== 'dob' && (
                                            <FontAwesomeIcon
                                                icon={faPen}
                                                onClick={() =>
                                                    handleEditClick('dob')
                                                }
                                            />
                                        )}
                                    </MDBCol>
                                </MDBRow>

                                <hr />

                                <MDBRow>
                                    <MDBCol sm='3'>
                                        <MDBCardText>Giới tính</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm='8'>
                                        <select
                                            defaultValue={profile?.gender}
                                            onChange={handleGenderChange}
                                            disabled={editingField !== 'gender'}
                                        >
                                            <option value='M'>Nam</option>
                                            <option value='W'>Nữ</option>
                                            <option value='O'>Khác</option>
                                        </select>
                                    </MDBCol>
                                    <MDBCol sm='1'>
                                        {editingField !== 'gender' && (
                                            <FontAwesomeIcon
                                                icon={faPen}
                                                onClick={() =>
                                                    handleEditClick('gender')
                                                }
                                            />
                                        )}
                                    </MDBCol>
                                </MDBRow>

                                <hr />

                                <ProfileField
                                    label='Số điện thoại'
                                    value={profile?.phone_number}
                                    editing={editingField === 'phone_number'}
                                    onEdit={() =>
                                        handleEditClick('phone_number')
                                    }
                                    onChange={handleInputChange}
                                />
                                <hr />
                                <ProfileField
                                    label='CCCD'
                                    value={profile?.card_id}
                                    editing={editingField === 'card_id'}
                                    onEdit={() => handleEditClick('card_id')}
                                    onChange={handleInputChange}
                                />
                                <hr />
                                <ProfileField
                                    label='Địa chỉ'
                                    value={profile?.address}
                                    editing={editingField === 'address'}
                                    onEdit={() => handleEditClick('address')}
                                    onChange={handleInputChange}
                                />
                                <hr />
                            </MDBCardBody>
                            {editingField && (
                                <MDBCardBody>
                                    <Button
                                        primary
                                        onClick={() =>
                                            handleSaveClick(
                                                auth.user_id,
                                                profile.fullname,
                                                profile.dob,
                                                profile.card_id,
                                                profile.phone_number,
                                                profile.address,
                                                profile.gender
                                            )
                                        }
                                    >
                                        Lưu
                                    </Button>
                                </MDBCardBody>
                            )}
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            <Toast
                type={isToastVisible?.type}
                message={isToastVisible?.message}
                title={isToastVisible?.title}
            />
        </section>
    );
}

export default Profile;
