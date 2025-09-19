import { getAllUsers } from '#services/user.service.js';
import logger from '#config/logger.js';

export const fetchAllUsers = async (req, res, next) => {
    try {
        logger.info('Fetching all users');

        const allUsers = await getAllUsers();
        
        res.json({ 
            message: 'Users fetched successfully', 
            users: allUsers, 
            count: allUsers.length 
        });
    } catch (error) {
        logger.error('Error getting all users', error);
        next(error);
    }
}