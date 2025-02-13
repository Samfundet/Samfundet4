import { z } from 'zod';
import { PASSWORD_LENGTH_MAX, PASSWORD_LENGTH_MIN, USERNAME_LENGTH_MAX, USERNAME_LENGTH_MIN } from '~/constants';

export const USERNAME = z.string().min(USERNAME_LENGTH_MIN).max(USERNAME_LENGTH_MAX);

export const PASSWORD = z.string().min(PASSWORD_LENGTH_MIN).max(PASSWORD_LENGTH_MAX);
