import classNames from 'classnames/bind';
import styles from './MotoItem.module.scss';
import { Link } from 'react-router-dom';

import Image from '../../../../components/Image';
const cx = classNames.bind(styles);
function CarItem({ data }) {
    return (
        <Link to={`/moto/${data.slug}`} className={cx('wrapper')}>
            <Image src={''} alt={data.moto_name} className={cx('avatar')} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{data.moto_name}</span>
                </h4>
                <span className={cx('price')}>
                    {data.rent_cost}0 VNĐ / 1 ngày
                </span>
            </div>
        </Link>
    );
}

export default CarItem;
