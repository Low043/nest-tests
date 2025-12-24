import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(1),
});
