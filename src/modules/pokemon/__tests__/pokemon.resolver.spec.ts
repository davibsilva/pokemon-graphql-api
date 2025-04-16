import { Test, TestingModule } from '@nestjs/testing';
import { PokemonResolver } from '../pokemon.resolver';
import { PokemonService } from '../pokemon.service';
import { CreatePokemonInput } from '../dto/create-pokemon.input';
import { UpdatePokemonInput } from '../dto/update-pokemon.input';
import { GqlThrottlerGuard } from '../../../guards/gql-throttler.guard';
import { GqlCacheInterceptor } from '../../../interceptors/gql-cache.interceptor';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

jest.mock('../../../guards/gql-throttler.guard', () => ({
  GqlThrottlerGuard: jest.fn(() => ({
    canActivate: () => true,
  })),
}));

describe('PokemonResolver', () => {
  let resolver: PokemonResolver;
  let service: PokemonService;

  const mockPokemon = {
    id: 1,
    name: 'Pikachu',
    types: [],
    created_at: new Date().toISOString(),
  };

  const mockService = {
    getOne: jest.fn().mockResolvedValue(mockPokemon),
    getAll: jest.fn().mockResolvedValue([mockPokemon]),
    create: jest.fn().mockResolvedValue(mockPokemon),
    update: jest.fn().mockResolvedValue({ ...mockPokemon, name: 'Raichu' }),
    delete: jest.fn().mockResolvedValue(true),
    importFromPokeApi: jest.fn().mockResolvedValue(mockPokemon),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonResolver,
        {
          provide: PokemonService,
          useValue: mockService,
        },
        {
          provide: GqlThrottlerGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: APP_GUARD,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: GqlCacheInterceptor,
          useValue: {
            intercept: jest.fn().mockImplementation((_, next) => next.handle()),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PokemonResolver>(PokemonResolver);
    service = module.get<PokemonService>(PokemonService);
  });

  it('should get one pokemon by ID', async () => {
    const result = await resolver.getOnePokemon(1);
    expect(result.name).toBe('Pikachu');
    expect(service.getOne).toHaveBeenCalledWith(1);
  });

  it('should get all pokemons', async () => {
    const result = await resolver.getAllPokemons(
      0,
      10,
      'ELECTRIC',
      'Pikachu',
      'DESC',
    );
    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe('Pikachu');
    expect(service.getAll).toHaveBeenCalledWith(
      0,
      10,
      'ELECTRIC',
      'Pikachu',
      'DESC',
    );
  });

  it('should create a new pokemon', async () => {
    const input: CreatePokemonInput = {
      name: 'Pikachu',
      types: ['ELECTRIC'],
    };
    const result = await resolver.createOnePokemon(input, {
      userId: 1,
      email: 'ash.s@gmail.com',
    });
    expect(result.name).toBe('Pikachu');
    expect(service.create).toHaveBeenCalledWith(input, 1);
  });

  it('should update a pokemon', async () => {
    const input: UpdatePokemonInput = { name: 'Raichu' };
    const result = await resolver.updateOnePokemon(1, input);
    expect(result.name).toBe('Raichu');
    expect(service.update).toHaveBeenCalledWith(1, input);
  });

  it('should delete a pokemon', async () => {
    const result = await resolver.deleteOnePokemon(1);
    expect(result).toBe(true);
    expect(service.delete).toHaveBeenCalledWith(1);
  });

  it('should import a pokemon from the PokeAPI', async () => {
    const result = await resolver.importPokemonById(25);
    expect(result.name).toBe('Pikachu');
    expect(service.importFromPokeApi).toHaveBeenCalledWith(25);
  });
});
