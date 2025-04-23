## 🛠 Installation

```bash
npm install
# or
yarn
```

---

## 🧬 Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

To reset the database:

```bash
npx prisma migrate reset
```

---

## 🧪 Running Tests

```bash
npm run test
# or
yarn test
```

With coverage:

```bash
yarn test --coverage
```

---

## 🚀 Running the Application

```bash
npm run start:dev
# or
yarn start:dev
```

GraphQL Playground available at:  
[`http://localhost:3000/graphql`](http://localhost:3000/graphql)

---

## 🔍 Useful Queries

### 📌 Query: Get all Pokémons

```graphql
query {
  getAllPokemons(offset: 0, limit: 10) {
    results {
      id
      name
      types {
        type {
          name
        }
      }
    }
  }
}
```

---

### 📌 Mutation: Import a Pokémon from PokeAPI

```graphql
mutation {
  importPokemonById(id: 25) {
    id
    name
    types {
      type {
        name
      }
    }
  }
}
```

---

### 🔑 Authentication Examples

#### 🚪 Logout (Requires Auth)

```graphql
mutation {
  logout
}
```

> ⚠️ Must be called with an access token in the headers:

```json
{
  "Authorization": "Bearer <access_token_here>"
}
```



#### 📥 Login

```graphql
mutation {
  login(data: { email: "ash@kanto.com", password: "pikachu123" }) {
    accessToken
    refreshToken
  }
}
```

#### 🔁 Refresh Token

```graphql
mutation {
  refreshToken(token: "your_refresh_token_here")
}
```

> ⚠️ Use the access token in your GraphQL Playground HTTP Headers:

```json
{
  "Authorization": "Bearer <access_token_here>"
}
```

---

# 🧾 Project Structure & Features

This project has been refactored and enhanced to follow scalable, modular architecture using modern tooling like Prisma, PostgreSQL, Docker, GraphQL and NestJS.

## 🔍 Key Features & Justifications

### ✅ PostgreSQL with Docker
- Replaces SQLite with a containerized PostgreSQL database.
- **Justification**: Better suited for production, supports scalability, and enables real relational modeling (e.g. many-to-many).

### ✅ Prisma ORM
- Type-safe database access with PostgreSQL support.
- Located in `prisma/schema.prisma` and integrated via `PrismaService`.
- **Justification**: Improves development velocity and reduces errors with auto-generated types.

### ✅ Seed System
- Located at `prisma/seed.ts` and runs automatically after migrations.
- Populates initial Pokémon and types.
- **Justification**: Ensures testable data right after setup.

### ✅ GraphQL API with NestJS
- Located in `src/modules/pokemon` and `hello`.
- Includes Queries and Mutations for creating, updating, deleting and importing Pokémon.
- **Justification**: GraphQL provides flexible data querying with strong typing.

### ✅ Many-to-Many Relationship for Pokémon Types
- Implemented via Prisma relation tables between `Pokemon`, `Type`, and `PokemonType`.
- **Justification**: Reflects real-world data from PokeAPI where a Pokémon can have multiple types.

### ✅ Auth with JWT (Access & Refresh Tokens)
- Users can `signup`, `login`, and `refreshToken`.
- `refreshToken` is hashed and stored securely in the DB.
- **Justification**: Enables secure session management and token refresh strategy.

### ✅ Authentication Guard + Current User
- `GqlAuthGuard` protects sensitive mutations.
- Uses custom decorator `@CurrentUser()` to access authenticated user.
- **Justification**: Ensures only authorized users access or modify resources.

### ✅ User-Pokemon Ownership
- Pokémons are linked to the user who created them via `createdBy`.
- Only the owner can update or delete their pokémons.
- **Justification**: Adds per-user resource isolation and accountability.

### ✅ Input Validation with class-validator
- Enforced in `create-pokemon.input.ts` and `update-pokemon.input.ts`.
- **Justification**: Prevents invalid data input and enforces business rules at the boundary.

### ✅ Custom GraphQL Error Handling
- Implemented via `GraphQLExceptionFilter`.
- **Justification**: Provides clean and standardized error feedback to frontend clients.

### ✅ Request Caching via Custom Interceptor
- Located in `interceptors/gql-cache.interceptor.ts`.
- **Justification**: Improves performance for frequent queries like `getAllPokemons`.

### ✅ Rate Limiting with Throttler
- `GqlThrottlerGuard` limits abusive requests using `@nestjs/throttler`.
- **Justification**: Protects the API from abuse and DDoS.

### ✅ Fully Unit Tested Resolvers
- Resolver: `pokemon.resolver.spec.ts` with all operations covered.
- **Justification**: Ensures logic correctness and allows fearless refactoring.

### ✅ Makefile for Local Development
- Targets: `make dev`, `make seed`, `make reset-db`, `make stop`.
- **Justification**: Simplifies local setup and onboarding for developers.

### ✅ Environment Configuration
- Managed via `.env` and supports switching environments easily.

---

## 👨‍💻 Author

Project proudly developed and enhanced by **Davi Silva**,  
with ❤️, technical precision, and high coding standards.
