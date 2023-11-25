import classNames from 'classnames/bind';
import styles from './ModalMoto.module.scss';
import React, { useState, useEffect, useContext, useRef, memo } from 'react';
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { AppContext } from '~/Context/AppContext';
import Button from '~/components/Button';
import * as motoServices from '~/api/motoServices';

const cx = classNames.bind(styles);

function ModalMoto() {
    const {
        isModalMotoVisible,
        data,
        typeModal,
        setIsModalMotoVisible,
        setIsToastVisible,
    } = useContext(AppContext);
    const [idMoto, setIdMoto] = useState(data?.moto_id ?? '');
    const [nameMoto, setNameMoto] = useState(data?.moto_name ?? '');
    const [autoMaker, setAutoMaker] = useState(data?.brand ?? '');
    const [price, setPrice] = useState(data?.rent_cost ?? '');
    const [type, setType] = useState(data?.moto_type ?? '');
    const [licensePlates, setLicensePlates] = useState(
        data?.moto_license_plates ?? ''
    );
    const [status, setStatus] = useState(data?.status ?? '');
    const [description, setDescription] = useState(data?.description ?? '');
    const [slug, setSlug] = useState(data?.slug ?? '');
    const [hinhAnh, setHinhAnh] = useState(data?.images ?? []);
    const [multipleImages, setMultipleImages] = useState(data?.images ?? []);
    const formDataRef = useRef(new FormData());

    useEffect(() => {
        setIdMoto(data?.moto_id ?? '');
        setNameMoto(data?.moto_name ?? '');
        setAutoMaker(data?.brand ?? '');
        setPrice(data?.rent_cost ?? '');
        setType(data?.moto_type ?? '');
        setLicensePlates(data?.moto_license_plates ?? '');
        setHinhAnh(data?.images ?? '');
        setStatus(data?.status ?? '');
        setDescription(data?.description ?? '');
        setSlug(data?.slug ?? '');
        setMultipleImages(data?.images ?? []);
    }, [data]);

    const changeMultipleFiles = (e) => {
        if (e.target.files) {
            const file = e.target.files;
            const filesArray = Array.from(e.target.files);
            const imageArray = filesArray.map((file) =>
                URL.createObjectURL(file)
            );
            // add image to call api
            setHinhAnh(file);

            // preview image
            setMultipleImages((prevImages) => prevImages.concat(imageArray));
        }
    };

    const removeImage = (index) => {
        setMultipleImages((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        );
    };

    function formDataToJSON(formData) {
        const json = {};
        for (const [key, value] of formData.entries()) {
            json[key] = value;
        }
        return json;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (typeModal !== 'ADD') {
            formDataRef.current.append('moto_id', data?.moto_id);
        }

        formDataRef.current.append('moto_name', nameMoto);
        formDataRef.current.append('brand', autoMaker);
        formDataRef.current.append('moto_license_plates', licensePlates);
        formDataRef.current.append('moto_type', type);
        formDataRef.current.append('rent_cost', price);
        formDataRef.current.append('status', status);
        formDataRef.current.append('description', description);
        formDataRef.current.append('slug', slug);
        console.log(hinhAnh);
        for (let i = 0; i < hinhAnh.length; i++) {
            formDataRef.current.append('images[]', hinhAnh[i]);
            console.log(i);
        }

        const fetchData = async () => {
            if (typeModal === 'ADD') {
                const result = await motoServices.addXe(formDataRef.current);
                if (result.status === 'success') {
                    setIsToastVisible({
                        type: 'success',
                        message: result.mess,
                        title: 'Thành công',
                        open: true,
                    });
                    setIsModalMotoVisible(false);
                } else {
                    setIsToastVisible({
                        type: 'error',
                        message: 'Có lỗi xảy ra. Vui lòng thử lại sau',
                        title: 'Thất bại',
                        open: true,
                    });
                }
                console.log(result);
            } else {
                const result = await motoServices.updateXe(formDataRef.current);
                console.log(result);
                if (result.status === 'success') {
                    setIsToastVisible({
                        type: 'success',
                        message: result.mess,
                        title: 'Thành công',
                        open: true,
                    });
                    setIsModalMotoVisible(false);
                } else {
                    setIsToastVisible({
                        type: 'error',
                        message: 'Có lỗi xảy ra. Vui lòng thử lại sau',
                        title: 'Thất bại',
                        open: true,
                    });
                }
            }
        };

        console.log(formDataToJSON(formDataRef.current));

        fetchData();
    };

    return (
        <div className={cx('wrapper-modal')}>
            <MDBModal show={isModalMotoVisible} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>
                                {typeModal == 'ADD'
                                    ? 'Thêm xe'
                                    : 'Sửa thông tin xe'}
                            </MDBModalTitle>
                            <MDBBtn
                                className='btn-close'
                                color='none'
                                onClick={() => setIsModalMotoVisible(false)}
                            ></MDBBtn>
                        </MDBModalHeader>

                        <MDBModalBody>
                            <MDBInput
                                className={cx('input')}
                                label={'Tên xe'}
                                value={nameMoto}
                                onChange={(e) => setNameMoto(e.target.value)}
                                type='text'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Hãng xe'}
                                value={autoMaker}
                                onChange={(e) => setAutoMaker(e.target.value)}
                                type='text'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Giá xe'}
                                value={`${price}`}
                                onChange={(e) => setPrice(e.target.value)}
                                type='text'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Biển số xe'}
                                value={licensePlates}
                                onChange={(e) =>
                                    setLicensePlates(e.target.value)
                                }
                                type='text'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Mô tả'}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                type='text'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Slug'}
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                type='text'
                            />
                            <div className={cx('wrapper-dropdown')}>
                                <MDBDropdown className={cx('dropdown')}>
                                    <MDBDropdownToggle>
                                        Loại xe
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem
                                            link
                                            onClick={() => {
                                                setType('Xe côn tay');
                                            }}
                                        >
                                            Xe côn tay
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() => {
                                                setType('Xe ga');
                                            }}
                                        >
                                            Xe ga
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() => {
                                                setType('Xe số');
                                            }}
                                        >
                                            Xe số
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                <div className={cx('value_dropdown')}>
                                    {type}
                                </div>
                            </div>
                            <div className={cx('wrapper-dropdown')}>
                                <MDBDropdown className={cx('dropdown')}>
                                    <MDBDropdownToggle>
                                        Trạng thái
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem
                                            link
                                            onClick={() => {
                                                setStatus('Hoạt động');
                                            }}
                                        >
                                            Hoạt động
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() => {
                                                setStatus('Ngưng hoạt động');
                                            }}
                                        >
                                            Ngưng hoạt độn
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() => {
                                                setStatus('Đã mất');
                                            }}
                                        >
                                            Đã mất
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                <div className={cx('value_dropdown')}>
                                    {status}
                                </div>
                            </div>
                            <div className={cx('wrapper_image')}>
                                <input
                                    type='file'
                                    multiple
                                    onChange={changeMultipleFiles}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        marginTop: '10px',
                                        alignItems: 'center',
                                    }}
                                >
                                    {multipleImages?.map((image, index) => {
                                        return (
                                            <>
                                                {image.includes('localhost') ? (
                                                    <div
                                                        className={cx(
                                                            'item-image'
                                                        )}
                                                    >
                                                        <img
                                                            className={cx(
                                                                'image'
                                                            )}
                                                            src={image}
                                                            alt=''
                                                            key={image}
                                                            width='200'
                                                            height='200'
                                                        />
                                                        <Button
                                                            className={cx(
                                                                'delete-image'
                                                            )}
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faClose}
                                                            />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={cx(
                                                            'item-image'
                                                        )}
                                                    >
                                                        <img
                                                            className={cx(
                                                                'image'
                                                            )}
                                                            src={image}
                                                            alt=''
                                                            key={image}
                                                            width='200'
                                                            height='200'
                                                        />
                                                        <Button
                                                            className={cx(
                                                                'delete-image'
                                                            )}
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faClose}
                                                            />
                                                        </Button>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </MDBModalBody>

                        <MDBModalFooter>
                            {typeModal === 'ADD' ? (
                                <Button
                                    primary
                                    onClick={handleSubmit}
                                    style={{ marginTop: '20px' }}
                                >
                                    Thêm
                                </Button>
                            ) : (
                                <Button
                                    primary
                                    onClick={handleSubmit}
                                    style={{ marginTop: '20px' }}
                                >
                                    Sửa
                                </Button>
                            )}
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    );
}

export default memo(ModalMoto);
