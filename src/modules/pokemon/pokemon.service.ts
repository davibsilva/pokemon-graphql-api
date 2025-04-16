import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pokemon, Prisma } from '@prisma/client';
import { UpdatePokemonInput } from './dto/update-pokemon.input';
import axios from 'axios';

@Injectable()
export class PokemonService {
  constructor(private prisma: PrismaService) {}

  async getOne(id: number): Promise<Pokemon> {
    const pokemon = await this.prisma.pokemon.findUnique({ where: { id } });
    if (!pokemon) {
      throw new NotFoundException(`Pokémon com ID ${id} não encontrado.`);
    }
    return pokemon;
  }

  async getAll(
    offset: number,
    limit: number,
    type?: string,
    name?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Pokemon[]> {
    const filters: any = {};
    if (type) {
      filters.type = type.toUpperCase();
    }
    if (name) {
      filters.name = { contains: name };
    }

    return this.prisma.pokemon.findMany({
      skip: offset,
      take: limit,
      where: filters,
      orderBy: {
        created_at:
          sortOrder === 'ASC' ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
      },
      include: {
        types: {
          include: {
            type: true,
          },
        },
      },
    });
  }

  async create(data: { name: string; types: string[] }): Promise<Pokemon> {
    try {
      const typeRecords = await Promise.all(
        data.types.map((name) =>
          this.prisma.type.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        ),
      );

      const newPokemon = await this.prisma.pokemon.create({
        data: {
          name: data.name,
          types: {
            create: typeRecords.map((type) => ({
              type: { connect: { id: type.id } },
            })),
          },
        },
        include: {
          types: {
            include: {
              type: true,
            },
          },
        },
      });

      return newPokemon;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Pokemon with this name already exists');
      }
      throw error;
    }
  }

  async update(id: number, data: UpdatePokemonInput): Promise<Pokemon> {
    try {
      await this.getOne(id);
      let types = null;

      if (data.types) {
        types = await Promise.all(
          data.types.map((name) =>
            this.prisma.type.upsert({
              where: { name },
              update: {},
              create: { name },
            }),
          ),
        );
      }

      const updated = await this.prisma.pokemon.update({
        where: { id },
        data: {
          name: data.name,
          types: {
            deleteMany: {},
            create: types.map((type) => ({
              type: { connect: { id: type.id } },
            })),
          },
        },
      });

      return updated;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Pokemon with this name already exists');
      }
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    await this.getOne(id);
    await this.prisma.pokemon.delete({ where: { id } });
    return true;
  }

  async importFromPokeApi(id: number): Promise<Pokemon> {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const { name, types } = response.data;

    const existing = await this.prisma.pokemon.findUnique({ where: { id } });
    const typeNames = types.map((t) => t.type.name.toUpperCase());

    const typeRecords = await Promise.all(
      typeNames.map((name) =>
        this.prisma.type.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );

    const typesData = {
      deleteMany: {},
      create: typeRecords.map((type) => ({
        type: { connect: { id: type.id } },
      })),
    };

    if (existing) {
      await this.prisma.pokemon.update({
        where: { id },
        data: { name, types: typesData },
      });
    } else {
      delete typesData.deleteMany;
      await this.prisma.pokemon.create({
        data: { id, name, types: typesData },
      });
    }

    return this.prisma.pokemon.findUnique({
      where: { id },
      include: { types: { include: { type: true } } },
    });
  }
}
