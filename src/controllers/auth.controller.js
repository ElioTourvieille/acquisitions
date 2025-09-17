import logger from '#config/logger.js';
import { signUpSchema, signInSchema } from '#validations/auth.validation.js';
import { formatValidationErrors } from '#utils/format.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signUp = async (req, res, next) => {
    try {
        const validationResult = signUpSchema.safeParse(req.body);

        if(!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details:  formatValidationErrors(validationResult.error) 
            });
        }

        const { name, email, password, role } = validationResult.data;

        const user = await createUser({ name, email, password, role });

        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

        cookies.set(res, 'token', token);

        logger.info(`User ${name} registered with email ${email} and role ${role}`);
        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        logger.error('Error signing up', error);

        if(error.message === 'User with this email already exists') {
            return res.status(409).json({ error: 'Email already exists' });
        }

        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const validationResult = signInSchema.safeParse(req.body);

        if(!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(validationResult.error)
            });
        }

        const { email, password } = validationResult.data;

        const user = await authenticateUser({ email, password });

        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

        cookies.set(res, 'token', token);

        logger.info(`User ${user.name} signed in with email ${user.email}`);
        res.status(200).json({
            message: 'User signed in successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        logger.error('Error signing in', error);

        if(error.message === 'Invalid credentials') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        cookies.clear(res, 'token');

        logger.info('User signed out successfully');
        res.status(200).json({
            message: 'User signed out successfully'
        });

    } catch (error) {
        logger.error('Error signing out', error);
        next(error);
    }
}
