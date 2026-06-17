import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // RELATIVE PATH!
import { CreateLaundryDto } from './dto/create-laundry.dto';
import { UpdateLaundryDto } from './dto/update-laundry.dto';

@Injectable()
export class LaundryService {
  private readonly PRICE_PER_KG = 8000;

  constructor(private prisma: PrismaService) {}

  async create(createLaundryDto: CreateLaundryDto) {
    const { weight, customerId } = createLaundryDto;

    const calculatedPrice = weight * this.PRICE_PER_KG;

    try {
      return await this.prisma.transaction.create({
        data: {
          weight,
          price: calculatedPrice,
          customerId,
        },
        include: {
          customer: true, 
        },
      });
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new BadRequestException(`Gagal membuat transaksi. Customer dengan ID ${customerId} tidak ditemukan di sistem.`);
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.transaction.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { customer: true },
    });
    
    if (!transaction) throw new NotFoundException(`Transaksi dengan ID ${id} tidak ditemukan.`);
    return transaction;
  }

  async update(id: number, updateLaundryDto: UpdateLaundryDto) {
    await this.findOne(id); // Validasi eksistensi

    return await this.prisma.transaction.update({
      where: { id },
      data: updateLaundryDto,
      include: { customer: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id); 

    return await this.prisma.transaction.delete({
      where: { id },
    });
  }
}