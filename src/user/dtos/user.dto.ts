import { UserSchema } from '../schemas/user.schema';
import { createZodDto } from 'nestjs-zod';

export class UserDto extends createZodDto(UserSchema) {}