import classNames from 'classnames/bind';
import styles from './ModalAddError.module.scss';
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
import * as adminServices from '~/api/adminServices';

const VIOLATION_TYPE_ID = {
    VIOLATION_MATXE: 1,
    VIOLATION_TREHEN: 2,
    VIOLATION_HUPHUTUNG: 3,
    VIOLATION_TRAYXUOC: 4,
    VIOLATION_KHAC: 5,
};
const cx = classNames.bind(styles);
function ModalAddError() {
    const {
        isModalAddErrorVisible,
        setIsModalAddErrorVisible,
        setIsToastVisible,
        violation,
    } = useContext(AppContext);
    const [note, setNote] = useState();
    const [cost, setCost] = useState();
    const [violationID, setViolationID] = useState();

    const handleSave = async () => {
        const result = await adminServices.addViolation(
            violation.rental_detail_id,
            violation.moto_id,
            violationID,
            note,
            cost
        );
        if (result.status === 'success') {
            setIsToastVisible({
                type: 'success',
                message: result.mess,
                title: 'Thành công',
                open: true,
            });
            setIsModalAddErrorVisible(false);
        } else {
            setIsToastVisible({
                type: 'error',
                message: result.mess,
                title: 'Thất bại',
                open: true,
            });
            setIsModalAddErrorVisible(false);
        }
    };
    return (
        <div className={cx('wrapper-modal')}>
            <MDBModal show={isModalAddErrorVisible} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Thêm lỗi phạt</MDBModalTitle>
                            <MDBBtn
                                className='btn-close'
                                color='none'
                                onClick={() => setIsModalAddErrorVisible(false)}
                            ></MDBBtn>
                        </MDBModalHeader>

                        <MDBModalBody>
                            <MDBInput
                                className={cx('input')}
                                label={'Ghi chú nội dung lỗi'}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                type='text'
                            />

                            <MDBInput
                                className={cx('input')}
                                label={'Tiền phạt'}
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                type='text'
                            />
                            <div className={cx('wrapper-dropdown')}>
                                <MDBDropdown className={cx('dropdown')}>
                                    <MDBDropdownToggle>
                                        Nội dung lỗi
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem
                                            link
                                            onClick={() =>
                                                setViolationID(
                                                    VIOLATION_TYPE_ID.VIOLATION_MATXE
                                                )
                                            }
                                        >
                                            Mất xe
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() =>
                                                setViolationID(
                                                    VIOLATION_TYPE_ID.VIOLATION_TREHEN
                                                )
                                            }
                                        >
                                            Trả trễ hẹn
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() =>
                                                setViolationID(
                                                    VIOLATION_TYPE_ID.VIOLATION_TRAYXUOC
                                                )
                                            }
                                        >
                                            Trầy xước xe
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() =>
                                                setViolationID(
                                                    VIOLATION_TYPE_ID.VIOLATION_HUPHUTUNG
                                                )
                                            }
                                        >
                                            Hư hỏng phụ tùng
                                        </MDBDropdownItem>
                                        <MDBDropdownItem
                                            link
                                            onClick={() =>
                                                setViolationID(
                                                    VIOLATION_TYPE_ID.VIOLATION_KHAC
                                                )
                                            }
                                        >
                                            Khác
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                <div className={cx('value_dropdown')}>
                                    {violationID}
                                </div>
                            </div>
                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn
                                className={cx('button_save')}
                                color='secondary'
                                onClick={() => setIsModalAddErrorVisible(false)}
                            >
                                Huỷ
                            </MDBBtn>
                            <MDBBtn
                                className={cx('button_save')}
                                onClick={handleSave}
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

export default memo(ModalAddError);
