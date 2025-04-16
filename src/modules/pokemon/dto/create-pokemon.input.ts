import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsString, Length } from 'class-validator';

@InputType()
export class CreatePokemonInput {
  @Field()
  @IsString()
  @Length(3, 20)
  name: string;

  @Field(() => [String])
  @IsArray()
  types: string[];
}
