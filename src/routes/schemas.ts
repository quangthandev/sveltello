import { z } from 'zod';

export const EmailSchema = z.string().email({ message: 'Please enter a valid email address.' });
export const PasswordSchema = z
	.string()
	.min(8, { message: 'Password must be at least 8 characters long.' });
