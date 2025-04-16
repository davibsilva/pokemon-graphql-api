# Candidate Interview Project

## Project Overview

Welcome to the interview project! This project is designed to assess your skills in building a backend API using Node.js and GraphQL.

### Goals

- Understand your proficiency with Node.js and GraphQL.
- Evaluate your ability to design and implement a scalable API.
- Analyze your coding practices and problem-solving approach.

---

## 🚀 Features Implemented

### ✅ GraphQL API (code-first)
- Built using `@nestjs/graphql` with `ApolloDriver`.
- Modularized resolvers and input/output types.

---

### ✅ Prisma ORM + SQLite
- Manages database schema with type-safety and migrations.
- Replaces raw SQL with a scalable and maintainable structure.

---

### ✅ Many-to-Many `type` relationship for Pokémons
- **Before**: `Pokemon { name: string, type: string }`
- **After**: A Pokémon can have multiple types (e.g., FIRE, ELECTRIC, WATER).

Implemented using:
- `Pokemon`, `Type`, and `PokemonType` models with relational mapping.

**Reason**:  
To reflect realistic data structure based on the official [PokeAPI](https://pokeapi.co/) and allow for better queryability and normalization.

---

### ✅ `importPokemonById` Mutation
- Fetches a Pokémon from the [PokeAPI](https://pokeapi.co/) based on its ID.
- If it already exists in the database, it updates the record and associated types.
- Otherwise, it creates a new record.

**Reason**:  
Demonstrates integration with third-party APIs and idempotent resource creation.

---

### ✅ Input Validation using `class-validator`
- Enforces business rules in DTOs:
  - `name` must be at least 3 characters.
  - `types` must be uppercase strings.

**Reason**:  
Ensures data consistency and prevents invalid inserts.

---

### ✅ Custom Error Formatting with `GraphQLExceptionFilter`
- Clean, user-friendly error responses with HTTP status codes:
```json
{
  "message": "name must be longer than or equal to 3 characters",
  "extensions": {
    "code": "BAD_USER_INPUT",
    "status": 400
  }
}
```

### ✅ Unit Tests with Jest

- Fully covered `PokemonResolver` with mocked services.
- All guards and interceptors (rate-limiting, cache) are mocked for isolation.

**Reason:**  
Allows confident refactoring and verifies expected behavior independently of infrastructure.

---

### ✅ Request Caching

- Caches the result of `getAllPokemons` for 120 seconds using a custom `GqlCacheInterceptor`.

**Reason:**  
Boosts performance for frequently accessed queries.

---

### ✅ Rate Limiting

- Uses `@nestjs/throttler` to apply request limits.
- Guards GraphQL operations through `GqlThrottlerGuard`.

**Reason:**  
Protects against abuse and ensures stability under high traffic.

---

### ✅ Modular Project Architecture

Each domain has its own:

- `Module`
- `DTOs`
- `GraphQL` models
- `Services` and `Resolvers`

**Reason:**  
Enhances scalability, testability, and maintainability.

---

## 🛠 Installation

```bash
npm install
# or
yarn

🧬 Prisma Setup
npx prisma generate
npx prisma migrate dev --name init

To reset the database:
npx prisma migrate reset

🧪 Running Tests
npm run test
# or
yarn test

With coverage:
yarn test --coverage

🚀 Running the Application
npm run start:dev
# or
yarn start:dev
```

---

GraphQL Playground available at:
http://localhost:4000/graphql

---

🔍 Useful Queries

📌 Query: Get all Pokémons
graphql
```json
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

📌 Mutation: Import a Pokémon from PokeAPI
graphql
```json
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

👨‍💻 Author
Project proudly developed and enhanced by Davi Silva,
with ❤️, technical precision, and high coding standards