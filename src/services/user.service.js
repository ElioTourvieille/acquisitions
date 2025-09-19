import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import logger from '#config/logger.js';

export const getAllUsers = async () => {
    try {
        return await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        }).from(users);

    } catch (error) {
        logger.error('Error getting all users', error);
        throw new Error('Error getting all users');
    }
}