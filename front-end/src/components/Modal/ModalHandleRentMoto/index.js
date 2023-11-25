import classNames from 'classnames/bind';
import styles from './ModalHandleSignMoto.module.scss';
import {
    MDBBtn,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
} from 'mdb-react-ui-kit';
import { useState, useEffect, useContext, memo } from 'react';
import { useSelector } from 'react-redux';

import { AppContext } from '~/Context/AppContext';
import Button from '~/components/Button';
import ModalAddError from '../ModalAddError';
import * as adminServices from '~/api/adminServices';

const cx = classNames.bind(styles);
function ModalHandleRentMoto() {
    const { auth } = useSelector((state) => state.auth);
    const {
        isModalRentVisible,
        data,
        typeModal,
        setIsModalRentVisible,
        setIsModalAddErrorVisible,
        setIsToastVisible,
    } = useContext(AppContext);
    const [checkAll, setCheckAll] = useState(false);
    const [dataModal, setDataModal] = useState(data ?? []);

    // Confirm Order
    const handleAcceptRent = async () => {
        const result = await adminServices.accpetRentOrder({
            censor_id: auth.user_id,
            rental_id: dataModal.rental_id,
        });
        if (result.status === 'success') {
            setIsToastVisible({
                type: 'success',
                message: result.mess,
                title: 'Thành công',
                open: true,
            });
            setIsModalRentVisible(false);
        } else {
            setIsToastVisible({
                type: 'error',
                message: result.mess,
                title: 'Thất bại',
                open: true,
            });
            setIsModalRentVisible(false);
        }
    };

    // Pay Order
    const handleAccept = async () => {
        const selectedXe = dataModal?.detail.filter((xe) => xe.checked);
        const result = await adminServices.payOrder(
            auth.user_id,
            dataModal.rental_id,
            selectedXe
        );
        if (result.status === 'success') {
            setIsToastVisible({
                type: 'success',
                message: result.mess,
                title: 'Thành công',
                open: true,
            });
            setIsModalRentVisible(false);
        } else {
            setIsToastVisible({
                type: 'error',
                message: result.mess,
                title: 'Thất bại',
                open: true,
            });
            setIsModalRentVisible(false);
        }
    };

    const handleCheckAll = () => {
        const updatedCheckboxes = dataModal?.detail.map((checkbox) => ({
            ...checkbox,
            checked: !checkAll,
        }));
        setCheckAll(!checkAll);
        setDataModal((prevDataModal) => ({
            ...prevDataModal,
            detail: updatedCheckboxes,
        }));
    };

    const handleCheckboxChange = (checkboxId) => {
        const updatedCheckboxes = dataModal?.detail.map((checkbox) =>
            checkbox.moto_id === checkboxId
                ? { ...checkbox, checked: !checkbox.checked }
                : checkbox
        );
        setDataModal((prevDataModal) => ({
            ...prevDataModal,
            detail: updatedCheckboxes,
        }));

        const isAllChecked = updatedCheckboxes.every(
            (checkbox) => checkbox.checked
        );
        setCheckAll(isAllChecked);
    };

    const totalAmount = dataModal?.detail?.reduce((total, item) => {
        if (item.checked) {
            return total + item.rent_cost;
        }
        return total;
    }, 0);

    useEffect(() => {
        setDataModal(data ?? []);
    }, [data]);

    return (
        <div className={cx('wrapper')}>
            <MDBModal show={isModalRentVisible} tabIndex='-1'>
                <MDBModalDialog className={cx('modal_dialog')}>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>
                                {typeModal == 'ACCEPT'
                                    ? 'Duyệt đăng kí thuê xe'
                                    : 'Xác nhận trả xe'}
                            </MDBModalTitle>
                            <MDBBtn
                                className='btn-close'
                                color='none'
                                onClick={() => setIsModalRentVisible(false)}
                            ></MDBBtn>
                        </MDBModalHeader>

                        <MDBModalBody className={cx('modal_body')}>
                            <MDBTable align='middle' className={cx('table')}>
                                <MDBTableHead>
                                    <tr>
                                        {typeModal !== 'ACCEPT' ? (
                                            <th scope='col'>
                                                <input
                                                    type='checkbox'
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    checked={checkAll}
                                                    onChange={handleCheckAll}
                                                />
                                            </th>
                                        ) : (
                                            ''
                                        )}
                                        <th scope='col'>ID xe</th>
                                        <th scope='col'>Tên xe</th>
                                        <th scope='col'>Hãng xe</th>
                                        <th scope='col'>Loại xe</th>
                                        <th scope='col'>Biển số xe</th>
                                        {typeModal !== 'ACCEPT' ? (
                                            <th scope='col'>
                                                Mã nhân viên nhận xe
                                            </th>
                                        ) : (
                                            ''
                                        )}
                                        {/* <th scope='col'>Lỗi</th> */}
                                        <th scope='col'>Giá thuê</th>
                                        {typeModal !== 'ACCEPT' ? (
                                            <th scope='col'>Actions</th>
                                        ) : (
                                            ''
                                        )}
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {dataModal?.detail?.map((item) => {
                                        return (
                                            <tr key={item?.rental_id}>
                                                {typeModal !== 'ACCEPT' ? (
                                                    <td>
                                                        {item?.return_date !=
                                                        null ? (
                                                            ''
                                                        ) : (
                                                            <input
                                                                type='checkbox'
                                                                className='fw-bold mb-1'
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                                checked={
                                                                    item.checked
                                                                }
                                                                onChange={() =>
                                                                    handleCheckboxChange(
                                                                        item.moto_id
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </td>
                                                ) : (
                                                    ''
                                                )}
                                                <td>
                                                    <p className='fw-bold mb-1'>
                                                        {item?.moto_id}
                                                    </p>
                                                </td>
                                                <td>
                                                    <div className='ms-3'>
                                                        <p className='fw-bold mb-1'>
                                                            {item?.moto_name}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p className='fw-normal mb-1'>
                                                        {item?.brand}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className='fw-normal mb-1'>
                                                        {item?.moto_type}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className='fw-normal mb-1'>
                                                        {
                                                            item?.moto_license_plates
                                                        }
                                                    </p>
                                                </td>
                                                {typeModal !== 'ACCEPT' ? (
                                                    <td>
                                                        <p className='fw-normal mb-1'>
                                                            {
                                                                item?.received_staff_id
                                                            }
                                                        </p>
                                                    </td>
                                                ) : (
                                                    ''
                                                )}
                                                <td>
                                                    <p className='fw-normal mb-1'>
                                                        {item?.rent_cost}0
                                                    </p>
                                                </td>
                                                <td>
                                                    {typeModal !== 'ACCEPT' && (
                                                        <>
                                                            {item.return_date ===
                                                            null ? (
                                                                <Button
                                                                    color='link'
                                                                    size='sm'
                                                                    small={true}
                                                                    className={cx(
                                                                        'fw-normal',
                                                                        'mb-1',
                                                                        'btn'
                                                                    )}
                                                                    onClick={() =>
                                                                        setIsModalAddErrorVisible(
                                                                            true
                                                                        )
                                                                    }
                                                                >
                                                                    THÊM LỖI
                                                                </Button>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </MDBTableBody>
                                {typeModal === 'ACCEPT' ? (
                                    <>
                                        {dataModal?.status !== 'Đã duyệt' ? (
                                            <tfoot>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <Button
                                                            size='sm'
                                                            primary
                                                            className={cx(
                                                                'fw-normal'
                                                            )}
                                                            onClick={
                                                                handleAcceptRent
                                                            }
                                                        >
                                                            Duyệt
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        ) : (
                                            ''
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {dataModal?.status === 'Đã duyệt' ? (
                                            <tfoot>
                                                <tr>
                                                    <td className='fw-bold mb-1'>
                                                        Tổng tiền:
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    {typeModal !== 'ACCEPT' ? (
                                                        <td></td>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <td></td>
                                                    <td>{totalAmount}0</td>
                                                    <td>
                                                        <Button
                                                            color='link'
                                                            size='sm'
                                                            small={true}
                                                            className={cx(
                                                                'fw-normal',
                                                                'mb-1',
                                                                'btn'
                                                            )}
                                                            onClick={
                                                                handleAccept
                                                            }
                                                        >
                                                            XÁC NHẬN
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        ) : (
                                            ''
                                        )}
                                    </>
                                )}
                            </MDBTable>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            <ModalAddError />
        </div>
    );
}

export default memo(ModalHandleRentMoto);
