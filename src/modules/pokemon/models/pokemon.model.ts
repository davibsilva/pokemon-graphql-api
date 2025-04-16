import { Field, ObjectType } from '@nestjs/graphql';
import { PokemonType } from './pokemon-type.model';

@ObjectType()
export class Pokemon {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => [PokemonType])
  types: PokemonType[];
}
