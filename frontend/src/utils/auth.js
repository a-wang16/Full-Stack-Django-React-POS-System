/**
 * Function to check if the user is authenticated
 */
import axiosInstance from './axiosInstance';
export const isAuthenticated = async () => {
    try {
        const response = await axiosInstance.get('/verifyToken');

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error('Authentication verification failed', error);
        return false;
    }
};
