import { UserSchema } from './user.schema';

export const CreateUserSchema = UserSchema.omit({ id: true });
