import { Module } from '@nestjs/common';
import { LaundryService } from './laundry.service';
import { LaundryController } from './laundry.controller';

@Module({
  providers: [LaundryService],
  controllers: [LaundryController]
})
export class LaundryModule {}
