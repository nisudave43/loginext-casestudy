import getAxiosInstance from '../apis/getAxiosInstance';

// API call for zip code search
const getStatistics = async () => {

    const instance = getAxiosInstance();

    return instance.get('/statistics');
};

export default getStatistics;
