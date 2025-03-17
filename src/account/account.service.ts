import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { CustomException } from 'src/common/exception/custom.exception';


@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateAccountDto) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

      return await this.prisma.account.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          notes: dto.notes,
          clientId: clientId,
        },
      });
    } catch (error) {
      throw new CustomException('Error creating account', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(clientId: string) {
    try {
      return await this.prisma.account.findMany({
        where: {
          clientId: clientId,
        },
      });
    } catch (error) {
      throw new CustomException('Error fetching accounts', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(clientId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: {
        id: id,
        clientId: clientId,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  async update(clientId: string, id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.prisma.account.findFirst({
      where: {
        id: id,
        clientId: clientId,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    try {
      return await this.prisma.account.update({
        where: { id: id },
        data: updateAccountDto,
      });
    } catch (error) {
      throw new CustomException('Error updating account', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(clientId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: {
        id: id,
        clientId: clientId,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    try {
      return await this.prisma.account.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new CustomException('Error deleting account', HttpStatus.BAD_REQUEST);
    }
  }
}