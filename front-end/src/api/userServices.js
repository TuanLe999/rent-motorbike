import * as request from '~/utils/request';

export const updateProfile = async ({
    user_id,
    fullname,
    dob,
    card_id,
    phone_number,
    address,
    gender,
}) => {
    try {
        const res = await request.post(
            'updateProfileUser',
            {
                user_id,
                fullname,
                dob,
                card_id,
                phone_number,
                address,
                gender,
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const updateAvatar = async (formData) => {
    try {
        const res = await request.post('updateAvatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const lockAccount = async ({ user_id, userLock, status }) => {
    try {
        const res = await request.post('lockAccount', {
            user_id,
            userLock,
            status,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const changePassword = async ({ token, password }) => {
    try {
        const res = await request.post(`change-password`, {
            password,
            token,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const getAllUser = async ({ role = '', q = '', page = '' }) => {
    try {
        const res = await request.post('getAllUser', {
            role,
            q,
            page,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const thongKeUser = async () => {
    try {
        const res = await request.get('statisticUser');
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const rentMoto = async ({ maTaiKhoan, ngayBD, ngayKT, listMoto }) => {
    try {
        const res = await request.post('addOrder', {
            maKH: maTaiKhoan,
            ngayBD,
            ngayKT,
            listMoto,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};
