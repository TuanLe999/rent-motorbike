import * as request from '~/utils/request';

export const getAllXe = async (q) => {
    try {
        const res = await request.post('moto', {
            q,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const getAllXeAdmin = async ({ q = null, page = '', type = '' }) => {
    try {
        const res = await request.post('moto', {
            q,
            page,
            type,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const thongKeXe = async () => {
    try {
        const res = await request.get('statisticMoto');
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const addXe = async (formData) => {
    try {
        const res = await request.post('admin/addMotorbike', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const updateXe = async (formData, moto_id) => {
    try {
        const res = await request.post(
            `admin/updateMotorbike/${moto_id}`,
            formData,
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

export const getMotoBySlug = async (slug = '') => {
    try {
        const res = await request.get(`admin/getMotorBySlug/${slug}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
