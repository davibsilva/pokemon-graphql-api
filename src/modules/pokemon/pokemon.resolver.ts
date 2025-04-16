import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PokemonService } from './pokemon.service';
import { Pokemon } from '@prisma/client';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from '@nestjs/cache-manager';
import { GqlCacheInterceptor } from 'src/interceptors/gql-cache.interceptor';
import { CreatePokemonInput } from './dto/create-pokemon.input';
import { UpdatePokemonInput } from './dto/update-pokemon.input';
import { GqlThrottlerGuard } from 'src/guards/gql-throttler.guard';

@Resolver('Pokemon')
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query('getOnePokemon')
  async getOnePokemon(@Args('id') id: number): Promise<Pokemon> {
    return this.pokemonService.getOne(id);
  }

  @Query('getAllPokemons')
  @UseGuards(GqlThrottlerGuard)
  @UseInterceptors(GqlCacheInterceptor)
  @CacheTTL(120)
  async getAllPokemons(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('type') type?: string,
    @Args('name') name?: string,
    @Args('sortByCreatedAt') sort?: 'ASC' | 'DESC',
  ): Promise<{ results: Pokemon[] }> {
    const results = await this.pokemonService.getAll(
      offset,
      limit,
      type,
      name,
      sort,
    );
    return { results };
  }

  @Mutation('createOnePokemon')
  async createOnePokemon(
    @Args('data') data: CreatePokemonInput,
  ): Promise<Pokemon> {
    return this.pokemonService.create(data);
  }

  @Mutation('updateOnePokemon')
  async updateOnePokemon(
    @Args('id') id: number,
    @Args('data') data: UpdatePokemonInput,
  ): Promise<Pokemon> {
    return this.pokemonService.update(id, data);
  }

  @Mutation('deleteOnePokemon')
  async deleteOnePokemon(@Args('id') id: number): Promise<boolean> {
    return this.pokemonService.delete(id);
  }

  @Mutation('importPokemonById')
  async importPokemonById(@Args('id', { type: () => Int }) id: number) {
    return this.pokemonService.importFromPokeApi(id);
  }
}
