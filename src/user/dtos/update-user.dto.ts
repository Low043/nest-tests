import { UpdateUserSchema } from '../schemas/update-user.schema';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}