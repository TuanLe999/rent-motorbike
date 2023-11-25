import * as request from '~/utils/request';

export const search = async (q) => {
    try {
        const res = await request.post('moto', {
            q,
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
