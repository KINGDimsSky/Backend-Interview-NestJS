import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LaundryService } from './laundry.service';
import { CreateLaundryDto } from './dto/create-laundry.dto';
import { UpdateLaundryDto } from './dto/update-laundry.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // RELATIVE PATH!

@ApiTags('Laundry Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // MENGUNCI MODUL TRANSAKSI DENGAN JWT
@Controller('laundry')
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat transaksi laundry baru' })
  create(@Body() createLaundryDto: CreateLaundryDto) {
    return this.laundryService.create(createLaundryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Mendapatkan seluruh riwayat transaksi' })
  findAll() {
    return this.laundryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan detail satu transaksi beserta data pelanggan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.laundryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui status transaksi (PENDING, WASHING, DONE)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLaundryDto: UpdateLaundryDto) {
    return this.laundryService.update(id, updateLaundryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus data transaksi' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.laundryService.remove(id);
  }
}