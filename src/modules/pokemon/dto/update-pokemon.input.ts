import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

@InputType()
export class UpdatePokemonInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  name?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]+$/, {
    message: 'type must be uppercase only',
  })
  types?: string[];
}
