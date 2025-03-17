import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma.service';
import { CustomException } from 'src/common/exception/custom.exception';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateClientDto) {
    try {
      return await this.prisma.client.create({
        data: {
          name: dto.name,
          userId: userId,
        },
      });
    } catch (error) {
      throw new CustomException('Error creating client', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(userId: string) {
    try {
      return await this.prisma.client.findMany({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw new CustomException('Error fetching clients', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(userId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(userId: string, id: string, updateClientDto: UpdateClientDto) {
    const client = await this.prisma.client.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    try {
      return await this.prisma.client.update({
        where: { id: id },
        data: updateClientDto,
      });
    } catch (error) {
      throw new CustomException('Error updating client', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(userId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    try {
      return await this.prisma.client.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new CustomException('Error deleting client', HttpStatus.BAD_REQUEST);
    }
  }
}