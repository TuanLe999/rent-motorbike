import classNames from 'classnames/bind';
import styles from './MotoView.module.scss';
import { useState, useEffect } from 'react';
import { DatePicker, Row, Col } from 'antd';
import moment from 'moment/moment';

import Button from '../Button';
import { useContext } from 'react';
import { CartContext } from '~/Context/CartContext';
import Toast from '../Toast';
import { AppContext } from '~/Context/AppContext';

const { RangePicker } = DatePicker;

const cx = classNames.bind(styles);
function MotoView({ item }) {
    const [product, setProduct] = useState({});
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [previewImage, setPreviewImage] = useState('');
    const [dateMoto, setDateMoto] = useState([]);
    const { addCartItem } = useContext(CartContext);
    const { isToastVisible, isOpen } = useContext(AppContext);

    useEffect(() => {
        setProduct(item);
        if (item?.images?.length > 0) {
            setPreviewImage(item.images[0]);
        }
        setDateMoto(item?.calendar);
    }, [item, isOpen]);

    const isDateDisabled = (current) => {
        const today = moment().startOf('day');
        const date = current.startOf('day');

        if (date < today) {
            return true;
        }

        for (let i = 0; i < dateMoto.length; i++) {
            const ngayBD = moment(dateMoto[i].start_date, 'YYYY-MM-DD');
            const ngayKT = moment(dateMoto[i].end_date, 'YYYY-MM-DD');

            if (date >= ngayBD && date <= ngayKT) {
                return true;
            }
        }

        return false;
    };

    // const handleRangeChange = (dates) => {
    //     setSelectedRange(dates);
    // };

    const handleRangePickerChange = (dates) => {
        const startDate = dates[0].format('DD-MM-YYYY');
        const endDate = dates[1].format('DD-MM-YYYY');
        setStartDate(startDate);
        setEndDate(endDate);
    };

    return (
        <>
            <div>
                <div className={cx('product')}>
                    <div className={cx('product__images')}>
                        <div className={cx('product__images__list')}>
                            {product?.images?.map((img, index) => {
                                return (
                                    <div
                                        className={cx(
                                            'product__images__list__item'
                                        )}
                                        onClick={() => {
                                            setPreviewImage(img);
                                        }}
                                        key={index}
                                    >
                                        <img src={img} alt='' />
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cx('product__images__main')}>
                            {previewImage && <img src={previewImage} alt='' />}
                        </div>
                    </div>
                    <div className={cx('product__info')}>
                        <h1 className={cx('product__info__title')}>
                            {product?.moto_name}
                        </h1>

                        <div className={cx('product__info__item')}>
                            <div className={cx('product__info__item__title')}>
                                Loại xe: {product?.moto_type}
                            </div>
                        </div>
                        <div className={cx('product__info__item')}>
                            <div className={cx('product__info__item__title')}>
                                Hãng xe: {product?.brand}
                            </div>
                        </div>
                        <div className={cx('product__info__item')}>
                            <div className={cx('product__info__item__title')}>
                                Trạng thái: {product?.status}
                            </div>
                        </div>
                        <div className={cx('product__info__item')}>
                            <span className={cx('product__info__item__price')}>
                                Giá: {product?.rent_cost}0 VNĐ / 1 ngày
                            </span>
                        </div>
                        <div className={cx('wrapper-date-picker')}>
                            <Row className='main-row'>
                                <Col lg={20} sm={24} className={cx('col')}>
                                    <RangePicker
                                        className={cx(
                                            'RangePicker',
                                            'range-picker'
                                        )}
                                        onChange={handleRangePickerChange}
                                        disabledDate={isDateDisabled}
                                        format='DD MMM yyyy'
                                        style={{
                                            height: '3.5rem',
                                            width: '37rem',
                                        }}
                                        placeholder={[
                                            'Ngày bắt đầu',
                                            'Ngày kết thúc',
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <div className={cx('product__info__item')}>
                            <Button
                                primary
                                onClick={() =>
                                    addCartItem({
                                        id: product.moto_id,
                                        image: product.images[0],
                                        name: product.moto_name,
                                        price: product.rent_cost,
                                        slug: product.slug,
                                        startDate: startDate,
                                        endDate: endDate,
                                    })
                                }
                            >
                                Đăng kí thuê xe
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={cx('product-description')}>
                    <div className={cx('product-description__title')}>
                        Thủ tục khi thuê xe
                    </div>
                    <div className={cx('product-description__content')}>
                        <ul>
                            <li>
                                Cần 1 trong các loại giấy sau: Chứng minh nhân
                                dân, Hộ chiếu, Passport, Hộ khẩu hoặc giấy tờ
                                tuỳ thân có hình khác.
                            </li>
                            <li>Bằng lái xe bắt buộc</li>
                            <li>Không cần đặt cọc</li>
                            <li>Thanh toán khi trả xe</li>
                        </ul>
                        <div className={cx('product-description__description')}>
                            <p>
                                Có giao nhận xe tận nơi miễn phí tại sân bay,
                                bến xe, bến tàu và các quận huyện nội thành Đà
                                Nẵng. Thời gian thuê được tính 1 ngày là 24
                                tiếng, quá thời gian 6 tiếng sẽ tính thêm 1
                                ngày(được trể 1 tiếng). Khi thuê xe sẽ làm hợp
                                đồng có 2 bản , mỗi bên giữ 1 bản có ký tên đóng
                                dấu công ty. Thời gian giao nhận xe: từ 7h00 -
                                19h30 hàng ngày, tất cả các ngày lễ tết vv…
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Toast
                type={isToastVisible?.type}
                message={isToastVisible?.message}
                title={isToastVisible?.title}
            />
        </>
    );
}

export default MotoView;
