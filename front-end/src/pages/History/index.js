import classNames from 'classnames/bind';
import Image from '~/components/Image';
import styles from './History.module.scss';

import image from '~/assets/image';
import Button from '~/components/Button';
import { useState, useEffect } from 'react';
import * as adminServices from '~/api/adminServices';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);
function History() {
    const [history, setHistory] = useState([]);
    const { auth } = useSelector((state) => state.auth);
    useEffect(() => {
        const fetchData = async () => {
            const result = await adminServices.getOrderByID(auth.user_id);
            setHistory(result.data);
        };
        fetchData();
    }, [auth.user_id]);

    console.log(history);
    const handleCancelRent = () => {};

    return (
        <div className={cx('purchase-history')}>
            <h2>Lịch sử đăng kí thuê xe</h2>
            <div className={cx('purchase-items')}>
                {history?.map((purchase) => (
                    <div
                        key={purchase.rental_id}
                        className={cx('purchase-item')}
                    >
                        <div className={cx('purchase-item__image')}>
                            <Image src={image.logo} alt='Product' />
                        </div>
                        <div className={cx('purchase-item__details')}>
                            <div className={cx('purchase-item__date')}>
                                <p>Ngày bắt đầu: {purchase.start_date}</p>
                            </div>
                            <div className={cx('purchase-item__date')}>
                                <p>Ngày kết thúc: {purchase.end_date}</p>
                            </div>
                            <div className={cx('purchase-item__product')}>
                                {/* <p>Số lượng xe : {purchase.quantity}</p> */}
                            </div>
                            <div className={cx('purchase-item__status')}>
                                <p>Trạng thái: {purchase.status}</p>
                            </div>
                            <div className={cx('purchase-item__price')}>
                                {/* <p>Tổng tiền: {purchase.price}</p> */}
                            </div>
                        </div>
                        <div className={cx('purchase-footer')}>
                            {purchase.status == 'Đã duyệt' ? (
                                ''
                            ) : (
                                <Button onClick={handleCancelRent}>HUỶ</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;
