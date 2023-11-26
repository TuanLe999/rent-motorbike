import classNames from 'classnames/bind';
import styles from './AcceptMoto.module.scss';
import {
    MDBBadge,
    MDBBtn,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
} from 'mdb-react-ui-kit';
import { useState, useEffect, useContext, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPen,
    faCheckCircle,
    faDatabase,
    faExclamation,
    faMoneyBill,
    faAngleLeft,
    faAngleRight,
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import useDebounce from '~/hooks/useDebounce';
import { AppContext } from '~/Context/AppContext';
import ModalHandleRentMoto from '~/components/Modal/ModalHandleRentMoto';
import Policy from '~/components/Policy';
import Toast from '~/components/Toast';
import * as adminServices from '~/api/adminServices';

const cx = classNames.bind(styles);
const PAGE = 1;

function AcceptMoto() {
    const {
        isModalRentVisible,
        setIsModalRentVisible,
        setTypeModal,
        setData,
        dataRentMoto,
        setDataRentMoto,
        isToastVisible,
    } = useContext(AppContext);
    const [totalPage, setTotalPage] = useState();
    const [pageNumber, setPageNumber] = useState(PAGE);
    const [dash, setDash] = useState();
    const [selectedOption, setSelectedOption] = useState('DF');

    // Search
    const inputRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);

    const debouncedValue = useDebounce(searchValue, 500);
    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
    };

    const handleChangeInput = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const fetchData = async (debouncedValue = '') => {
        const result = await adminServices.getAllOrder({
            q: debouncedValue,
            page: pageNumber,
        });
        setDataRentMoto(result.data);
        setTotalPage(result.soTrang);
    };

    useEffect(() => {
        const thongKe = async () => {
            const result = await adminServices.thongKeRent();
            setDash(result.order);
        };
        thongKe();

        if (!debouncedValue.trim()) {
            fetchData();
        }
        // call API
        const fetch = async () => {
            setLoading(true);
            fetchData(debouncedValue);
            setLoading(false);
        };
        fetch();
    }, [pageNumber, isModalRentVisible, debouncedValue]);

    const handleTotalOneRent = (item) => {
        if (item?.detail) {
            return item.detail.reduce((total, item) => {
                return total + parseFloat(item.rent_cost);
            }, 0);
        }
        return 0;
    };

    return (
        <div className={cx('wrapper')}>
            <ModalHandleRentMoto />
            <h1 className={cx('header')}>
                <FontAwesomeIcon
                    icon={faCheckCircle}
                    className={cx('header-icon')}
                />
                Duyệt đăng kí thuê xe
            </h1>
            <div className={cx('wrapper-policy')}>
                <Policy
                    icon={<FontAwesomeIcon icon={faDatabase} />}
                    name={'Tổng đơn đăng kí'}
                    value={dash?.totalOrder}
                />
                <Policy
                    icon={<FontAwesomeIcon icon={faCheckCircle} />}
                    name={'Số đơn đã duyệt'}
                    value={dash?.totalOrderConfirmed}
                />
                <Policy
                    icon={<FontAwesomeIcon icon={faExclamation} />}
                    name={'Số đơn chưa duyệt'}
                    value={dash?.totalOrderReturned}
                />
                <Policy
                    icon={<FontAwesomeIcon icon={faMoneyBill} />}
                    name={'Tổng tiền'}
                    value={`${dash?.totalMoney}.000 VND`}
                />
            </div>
            <div className={cx('action-table')}>
                {/* <Search /> */}
                <div>
                    <div className={cx('search')}>
                        <input
                            value={searchValue}
                            placeholder='Tìm kiếm'
                            type='text'
                            spellCheck={false}
                            onChange={handleChangeInput}
                        />
                        {!!searchValue && !loading && (
                            <button
                                className={cx('clear')}
                                onClick={handleClear}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                        )}
                        {loading && (
                            <FontAwesomeIcon
                                className={cx('loading')}
                                icon={faSpinner}
                            />
                        )}
                        <button
                            className={cx('search-btn')}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} on />
                        </button>
                    </div>
                </div>
            </div>
            <MDBTable align='middle' className={cx('table')}>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Mã đơn thuê</th>
                        <th scope='col'>Tên khách hàng</th>
                        <th scope='col'>Ngày bắt đầu</th>
                        <th scope='col'>Ngày kết thúc</th>
                        <th scope='col'>Trạng thái</th>
                        <th scope='col'>Nhân viên duyệt</th>
                        <th scope='col'>Giá thuê</th>
                        <th scope='col'>Actions</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {dataRentMoto?.map((item, index) => {
                        return (
                            <tr
                                style={{ cursor: 'pointer' }}
                                key={index}
                                onClick={() => {
                                    setIsModalRentVisible(true);
                                    setTypeModal('ACCEPT');
                                    setData(item);
                                }}
                            >
                                <td>
                                    <p className='fw-bold mb-1'>
                                        {item.rental_id}
                                    </p>
                                </td>
                                <td>
                                    <div className='ms-3'>
                                        <p className='fw-bold mb-1'>
                                            {item.name_customer}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <p className='fw-normal mb-1'>
                                        {item.start_date}
                                    </p>
                                </td>
                                <td>
                                    <p className='fw-bold mb-1'>
                                        {item.end_date}
                                    </p>
                                </td>
                                <td>
                                    {item.status === 'Đã duyệt' ? (
                                        <MDBBadge
                                            color='success'
                                            pill
                                            className='fw-bold mb-1'
                                        >
                                            {item.status}
                                        </MDBBadge>
                                    ) : (
                                        <MDBBadge
                                            color='danger'
                                            pill
                                            className='fw-bold mb-1'
                                        >
                                            {item.status}
                                        </MDBBadge>
                                    )}
                                </td>
                                <td>
                                    <p className='fw-bold mb-1'>
                                        {item.name_censor}
                                    </p>
                                </td>
                                <td>
                                    <p className='fw-bold mb-1'>
                                        {handleTotalOneRent(item)}.000
                                    </p>
                                </td>
                                <td>
                                    <MDBBtn
                                        color='link'
                                        rounded
                                        size='sm'
                                        className='fw-bold mb-1'
                                    >
                                        <FontAwesomeIcon
                                            icon={faPen}
                                            className={cx('actions-btn')}
                                            onClick={() => {
                                                setIsModalRentVisible(true);
                                                setTypeModal('ACCEPT');
                                                setData(item);
                                            }}
                                        />
                                    </MDBBtn>
                                </td>
                            </tr>
                        );
                    })}
                </MDBTableBody>
            </MDBTable>
            <nav aria-label='...' className={cx('page_navigation')}>
                <button
                    className={cx('btn-nav', 'left-btn')}
                    onClick={() => {
                        if (pageNumber > 1) setPageNumber((prev) => prev - 1);
                    }}
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <div className={cx('page-numbers')}>
                    {Array.from({ length: totalPage }, (_, i) => i + 1).map(
                        (page) => (
                            <button
                                className={cx(
                                    'btn-page',
                                    pageNumber === page ? 'btn-selected' : ''
                                )}
                                onClick={() => setPageNumber(page)}
                                key={page}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
                <button
                    className={cx('btn-nav', 'right-btn')}
                    onClick={() => {
                        if (pageNumber < totalPage) {
                            setPageNumber((prev) => prev + 1);
                        } else {
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </nav>
            <Toast
                type={isToastVisible?.type}
                message={isToastVisible?.message}
                title={isToastVisible?.title}
            />
        </div>
    );
}

export default AcceptMoto;
