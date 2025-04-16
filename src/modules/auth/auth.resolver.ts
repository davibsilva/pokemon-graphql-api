import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthService } from './auth.service';
import { AuthTokensResponse } from './dto/auth-tokens.response';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthTokensResponse)
  signup(@Args('data') data: SignupInput) {
    return this.authService.signup(data.email, data.password);
  }

  @Mutation(() => AuthTokensResponse)
  login(@Args('data') data: LoginInput) {
    return this.authService.login(data.email, data.password);
  }

  @Mutation(() => String)
  refreshToken(@Args('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  logout(@CurrentUser() user: { userId: number }) {
    return this.authService.logout(user.userId);
  }
}
