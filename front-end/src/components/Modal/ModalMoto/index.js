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
    const [imageUrl, setImageUrl] = useState(data?.images ?? []);
    const [imageFile, setImageFile] = useState([]);
    const [previewImage, setPreviewImage] = useState([]);
    const formDataRef = useRef(new FormData());

    useEffect(() => {
        setIdMoto(data?.moto_id ?? '');
        setNameMoto(data?.moto_name ?? '');
        setAutoMaker(data?.brand ?? '');
        setPrice(data?.rent_cost ?? '');
        setType(data?.moto_type ?? '');
        setLicensePlates(data?.moto_license_plates ?? '');
        setStatus(data?.status ?? '');
        setDescription(data?.description ?? '');
        setSlug(data?.slug ?? '');
        setImageUrl(data?.images ?? []);
    }, [data]);

    const changeMultipleFiles = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            console.log(filesArray);
            console.log(e.target.files);
            const imageArray = filesArray.map((file) =>
                URL.createObjectURL(file)
            );
            // add image to call api
            filesArray.forEach((file) => {
                setImageFile((prevFiles) => [...prevFiles, file]);
            });
            // preview image
            setPreviewImage((prevImages) => prevImages.concat(imageArray));
        }
    };

    const removeImageFile = (index) => {
        setImageFile((prevImages) => prevImages.filter((_, i) => i !== index));
        setPreviewImage((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        );
    };

    const removeImageUrl = (index) => {
        setImageUrl((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    console.log(imageFile);
    console.log(imageUrl);

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
            for (let i = 0; i < imageUrl.length; i++) {
                formDataRef.current.append('imagesUrl[]', imageUrl[i]);
            }
            for (let i = 0; i < imageFile.length; i++) {
                formDataRef.current.append('imagesFile[]', imageFile[i]);
            }
        } else {
            for (let i = 0; i < imageFile.length; i++) {
                formDataRef.current.append('images[]', imageFile[i]);
            }
        }

        formDataRef.current.append('moto_name', nameMoto);
        formDataRef.current.append('brand', autoMaker);
        formDataRef.current.append('moto_license_plates', licensePlates);
        formDataRef.current.append('moto_type', type);
        formDataRef.current.append('rent_cost', price);
        formDataRef.current.append('status', status);
        formDataRef.current.append('description', description);
        formDataRef.current.append('slug', slug);

        console.log(formDataToJSON(formDataRef.current));
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
            } else {
                const result = await motoServices.updateXe(
                    formDataRef.current,
                    idMoto
                );
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
                                    {imageUrl?.map((image, index) => {
                                        return (
                                            <div className={cx('item-image')}>
                                                <img
                                                    className={cx('image')}
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
                                                        removeImageUrl(index)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faClose}
                                                    />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                    {previewImage?.map((image, index) => {
                                        return (
                                            <div className={cx('item-image')}>
                                                <img
                                                    className={cx('image')}
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
                                                        removeImageFile(index)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faClose}
                                                    />
                                                </Button>
                                            </div>
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
