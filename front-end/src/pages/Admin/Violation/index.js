import classNames from 'classnames/bind';
import styles from './Violation.module.scss';
import {
    MDBBadge,
    MDBBtn,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
} from 'mdb-react-ui-kit';
import { useState, useEffect, useRef } from 'react';

import * as adminServices from '~/api/adminServices';
import useDebounce from '~/hooks/useDebounce';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTriangleExclamation,
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function Violation() {
    const [violation, setViolation] = useState([]);

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

    useEffect(() => {
        fetch(debouncedValue);

        if (!debouncedValue.trim()) {
            setLoading(true);
            fetch(debouncedValue);
            setLoading(false);
        }
    }, [debouncedValue]);

    const fetch = async (debouncedValue = '') => {
        const result = await adminServices.getAllViolation({
            q: debouncedValue,
        });
        setViolation(result);
    };

    console.log(violation);

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('header')}>
                <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className={cx('header-icon')}
                />
                Danh sách lỗi vi phạm
            </h1>
            <div className={cx('action-table')}>
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
            </div>
            <MDBTable align='middle' className={cx('table')}>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Số thứ tự</th>
                        <th scope='col'>Mã chi tiết đơn thuê</th>
                        <th scope='col'>Loại lỗi</th>
                        <th scope='col'>Tên xe</th>
                        <th scope='col'>Ghi chú</th>
                        <th scope='col'>Tiền phạt</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {violation.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <p className='fw-bold mb-1'>
                                    {item.violation_id}
                                </p>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>
                                    {item.rental_detail_id}
                                </p>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>
                                    {item.violation_content}
                                </p>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{item.moto_name}</p>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{item.note}</p>
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>
                                    {item.violation_cost}0
                                </p>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </div>
    );
}

export default Violation;
