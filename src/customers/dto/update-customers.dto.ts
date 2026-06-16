import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customers.dto';

// Secara otomatis menjadikan semua properti CreateCustomerDto sebagai opsional
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}