import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from './type.model';

@ObjectType()
export class PokemonType {
  @Field(() => Type)
  type: Type;
}
