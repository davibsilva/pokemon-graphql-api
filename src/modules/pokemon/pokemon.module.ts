import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PokemonService } from './pokemon.service';
import { PokemonResolver } from './pokemon.resolver';

@Module({
  providers: [PokemonResolver, PokemonService, PrismaService],
})
export class PokemonModule {}
