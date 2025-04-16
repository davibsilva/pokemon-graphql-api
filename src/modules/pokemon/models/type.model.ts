import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Type {
  @Field()
  id: number;

  @Field()
  name: string;
}
