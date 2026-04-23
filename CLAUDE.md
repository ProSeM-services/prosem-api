# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run start:dev      # Development with watch mode (NODE_ENV=development)
npm run build          # Compile TypeScript
npm run start          # Production mode
npm run lint           # ESLint with auto-fix
npm run format         # Prettier formatting
```

## Testing

```bash
npm test               # Run unit tests (Jest)
npm run test:watch     # Watch mode
npm run test:cov       # Coverage report
npm run test:e2e       # End-to-end tests
```

## Architecture Overview

**Multi-tenant SaaS** with hierarchy: Enterprise > Company > User

**API Base Path:** `/api`
**Swagger Docs:** `/api/docs`

### Module Structure

Each feature module follows this pattern:
```
module/
├── [module].module.ts      # Module definition
├── [module].controller.ts  # HTTP routes
├── [module].service.ts     # Business logic
├── [module].provider.ts    # DI providers (Sequelize models)
├── schema/                 # Database models
└── dto/                    # Request/response DTOs
```

### Core Infrastructure (`src/core/`)

- `database/` - Sequelize setup with PostgreSQL
- `config/` - Environment validation (Zod) and MercadoPago config
- `constants/` - Repository tokens, CORS config, decorators
- `types/` - Roles, permissions, account types

### Database

**ORM:** Sequelize with TypeScript (`sequelize-typescript`)
**Database:** PostgreSQL

All models extend `BaseModel<T>` which provides UUID primary key and optional `tenantName` for multi-tenancy.

**Repository Pattern:** Models injected via providers:
```typescript
@Inject(USER_REPOSITORY) private readonly userModel: typeof User
```

**Relationships configured in:** `src/core/database/database.provider.ts`

### Authentication

JWT-based with role and permission guards.

**Guards** (`src/auth/guards/`):
- `AuthGuard` - JWT validation
- `RolesGuard` - Multi-role check
- `PermissionsGuard` - Fine-grained permissions

**Decorators:**
- `@PublicAccess()` - Skip authentication
- `@Roles('ADMIN', 'OWNER')` - Require roles
- `@Role('OWNER')` - Single role

**Roles:** `BASIC | ADMIN | OWNER | MASTER`

**Token extraction in services:**
```typescript
this.authService.getDataFromToken(req)  // Get authenticated user
this.authService.getTenantFromHeaders(req)  // Get tenant info
```

### External Integrations

- **Email:** Nodemailer with Handlebars templates (`src/mailer/templates/`)
- **Payments:** MercadoPago SDK
- **File Storage:** AWS S3
- **Geocoding:** Google Maps API
- **WebSockets:** Socket.io for notifications

## Environment Variables

Required in `.env` (see `.env.example`):

- `DB_URL` - PostgreSQL connection string
- `JWTKEY`, `TOKEN_EXPIRATION`, `BEARER`, `HASH_SALT` - Auth config
- `PORT`, `NODE_ENV`
- `EMAIL_HOST`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`
- `AWS_S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`
- `GOOGLE_MAPS_APIKEY`
- `MP_ACCESS_TOKEN` - MercadoPago
- `WEB_CLIENT_URL`, `WEB_BACKOFFICE_URL`

## Key Data Models

```
Enterprise (root tenant)
├── Company (1:N)
│   └── User (1:N)
├── User (1:N) ──belongsToMany── Service (M:N)
├── Customer (1:N)
├── Appointment (1:N)
├── Service (1:N)
├── Payment (1:N)
└── Subscription (1:1) → PaymentPlan
```
