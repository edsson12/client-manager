import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateAccountDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    return this.prisma.account.create({
      data: {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      notes: dto.notes,
      clientId: clientId,
      },
    });
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
