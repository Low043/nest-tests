import { CreateUserSchema } from '../schemas/create-user.schema';
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}