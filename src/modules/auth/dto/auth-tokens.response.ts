import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthTokensResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
