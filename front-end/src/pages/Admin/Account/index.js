import ModalAccount from '~/components/Modal/ModalAccount';
import classNames from 'classnames/bind';
import styles from './Account.module.scss';
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
    faLock,
    faUsers,
    faPlus,
    faAngleLeft,
    faAngleRight,
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
    faUsersRectangle,
    faUserTie,
    faUser,
    faLockOpen,
    faUserAstronaut,
} from '@fortawesome/free-solid-svg-icons';

import useDebounce from '~/hooks/useDebounce';
import Policy from '~/components/Policy';
import { AppContext } from '~/Context/AppContext';
import * as userServices from '~/api/userServices';
import Image from '~/components/Image';
import Toast from '~/components/Toast';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);
const PAGE = 1;

function Account() {
    const { auth } = useSelector((state) => state.auth);
    const [accountData, setAccountData] = useState();
    const {
        setIsModalAccountVisible,
        setData,
        setIsToastVisible,
        isToastVisible,
    } = useContext(AppContext);
    const [dash, setDash] = useState();
    const [totalPage, setTotalPage] = useState();
    const [pageNumber, setPageNumber] = useState(PAGE);
    const [selectedOption, setSelectedOption] = useState('');

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

    const fetchData = async (debouncedValue = '', selectedOption) => {
        const result = await userServices.getAllUser({
            role: selectedOption,
            q: debouncedValue,
            page: pageNumber,
        });
        setAccountData(result.data.data);
        setTotalPage(result.total_pages);
    };

    useEffect(() => {
        const thongKe = async () => {
            const result = await userServices.thongKeUser();
            setDash(result.user);
        };
        thongKe();

        if (!debouncedValue.trim()) {
            if (selectedOption === '') {
                fetchData();
            } else if (selectedOption === 'Khách hàng') {
                fetchData(selectedOption);
            } else if (selectedOption === 'Nhân viên') {
                fetchData(selectedOption);
            }
        }

        // call API search
        if (selectedOption === '') {
            const fetch = async () => {
                setLoading(true);
                fetchData(debouncedValue);
                setLoading(false);
            };
            fetch();
        } else if (selectedOption === 'Khách hàng') {
            const fetch = async () => {
                setLoading(true);
                fetchData(debouncedValue, selectedOption);
                setLoading(false);
            };
            fetch();
        } else {
            const fetch = async () => {
                setLoading(true);
                fetchData(debouncedValue, selectedOption);
                setLoading(false);
            };
            fetch();
        }
    }, [pageNumber, selectedOption, isToastVisible, debouncedValue]);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);

        // Gọi API tương ứng với giá trị đã chọn
        if (selectedOption === '') {
            fetchData();
        } else if (selectedOption === 'Khách hàng') {
            fetchData(selectedOption);
        } else if (selectedOption === 'Nhân viên') {
            fetchData(selectedOption);
        }
    };

    const handleLockAccount = async (user_id, userLock, status) => {
        const result = await userServices.lockAccount({
            user_id: user_id,
            userLock: userLock,
            status: status,
        });
        if (result.type === 'success') {
            setIsToastVisible({
                type: 'success',
                message: 'Thay đổi trạng thái tài khoản thành công',
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
    };

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('header')}>
                <FontAwesomeIcon icon={faUsers} className={cx('header-icon')} />
                Quản lí tài khoản
            </h1>
            <ModalAccount />
            <div className={cx('wrapper-policy')}>
                <Policy
                    icon={<FontAwesomeIcon icon={faUsersRectangle} />}
                    name={'Tổng người dùng'}
                    value={dash?.totalUser}
                />
                <Policy
                    icon={<FontAwesomeIcon icon={faUserAstronaut} />}
                    name={'Sô tài khoản đã xác thực'}
                    value={dash?.totalUserVerify}
                />
                <Policy
                    icon={<FontAwesomeIcon icon={faUserTie} />}
                    name={'Số nhân viên'}
                    value={dash?.totalEmployee}
                />
                <Policy
                    icon={<FontAwesomeIcon icon={faUser} />}
                    name={'Số khách hàng'}
                    value={dash?.totalCustomer}
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
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </div>
                <div className={cx('right-action')}>
                    <MDBBtn
                        onClick={() => {
                            setIsModalAccountVisible(true);
                            setData(undefined);
                        }}
                        className={cx('button_showModal')}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </MDBBtn>
                    <div>
                        <select
                            className={cx('select')}
                            onChange={handleChange}
                        >
                            <option value=''>Mặc định</option>
                            <option value='Nhân viên'>Nhân viên</option>
                            <option value='Khách hàng'>Khách hàng</option>
                        </select>
                    </div>
                </div>
            </div>
            <MDBTable align='middle' className={cx('table')}>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Tên</th>
                        <th scope='col'>Ngày sinh</th>
                        <th scope='col'>Role</th>
                        <th scope='col'>Actions</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {accountData?.map((item) => {
                        return (
                            <tr
                                key={item.user_id}
                                className={cx(
                                    item.status === 'Khoá' ? 'lock' : ''
                                )}
                            >
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <Image
                                            src={item?.avatar}
                                            alt=''
                                            style={{
                                                width: '45px',
                                                height: '45px',
                                            }}
                                            className='rounded-circle'
                                        />
                                        <div className='ms-3'>
                                            <p className='fw-bold mb-1'>
                                                {item.fullname}
                                            </p>
                                            <p className='text-muted mb-0'>
                                                {item.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p className='fw-normal mb-1'>{item.dob}</p>
                                </td>
                                <td>
                                    {item.role === 'Admin' ? (
                                        <MDBBadge
                                            color='success'
                                            pill
                                            className='fw-normal mb-1'
                                        >
                                            {item.role}
                                        </MDBBadge>
                                    ) : (
                                        <MDBBadge
                                            color='warning'
                                            pill
                                            className='fw-normal mb-1'
                                        >
                                            {item.role}
                                        </MDBBadge>
                                    )}
                                </td>
                                <td>
                                    {item.status === 'Hoạt động' ? (
                                        <MDBBtn
                                            color='link'
                                            rounded
                                            size='sm'
                                            onClick={() =>
                                                handleLockAccount(
                                                    auth.user_id,
                                                    item.user_id,
                                                    'Khoá'
                                                )
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faLock}
                                                className={cx('actions-btn')}
                                            />
                                        </MDBBtn>
                                    ) : (
                                        <MDBBtn
                                            color='link'
                                            rounded
                                            size='sm'
                                            onClick={() =>
                                                handleLockAccount(
                                                    auth.user_id,
                                                    item.user_id,
                                                    'Hoạt động'
                                                )
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faLockOpen}
                                                className={cx('actions-btn')}
                                            />
                                        </MDBBtn>
                                    )}
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

export default Account;
