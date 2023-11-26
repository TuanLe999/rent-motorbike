import * as request from '~/utils/request';

export const getAllOrder = async ({ page, q = '' }) => {
    try {
        const res = await request.get('getAllOrder', {
            params: {
                page,
                q,
            },
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const thongKeRent = async () => {
    try {
        const res = await request.get('statisticOrder');
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const accpetRentOrder = async ({ censor_id, rental_id }) => {
    try {
        const res = await request.post('confirmOrder', {
            censor_id,
            rental_id,
            status: 'Đã duyệt',
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const getOrderByID = async (user_id) => {
    try {
        const res = await request.get(`GetOrderByIdUser/${user_id}`);
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const payOrder = async (user_id, rental_id, listMoto) => {
    try {
        const res = await request.post('payOrder', {
            rental_id,
            received_staff_id: user_id,
            listMoto,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const addViolation = async (
    rental_detail_id,
    moto_id,
    violation_type_id,
    note,
    cost
) => {
    try {
        const res = await request.post('addViolation', {
            rental_detail_id,
            moto_id,
            violation_type_id,
            note,
            cost,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const getAllViolation = async ({ q = '' }) => {
    try {
        const res = await request.get('getAllViolation', {
            params: {
                q,
            },
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};
