import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customers.dto';
import { UpdateCustomerDto } from './dto/update-customers.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({
        data: createCustomerDto,
      });
    } catch (error: any) {
      // Edge Case: Prisma Error Code P2002 berarti ada pelanggaran Unique Constraint
      if (error.code === 'P2002') {
        throw new ConflictException('Nomor telepon ini sudah terdaftar.');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) throw new NotFoundException(`Pelanggan dengan ID ${id} tidak ditemukan.`);
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    // Validasi eksistensi dulu
    await this.findOne(id);
    
    try {
      return await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Nomor telepon ini sudah digunakan pelanggan lain.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.customer.delete({
      where: { id },
    });
  }
}