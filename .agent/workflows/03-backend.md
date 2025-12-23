---
description: The Layered Logic Protocol - Backend architecture and API design rules
---

# ⚙️ The Layered Logic Protocol

Ensures a **modular**, **testable**, and **robust** backend architecture.

---

## Three-Layer Enforcement

> [!CAUTION]
> Every backend feature MUST follow this architecture. Violations create untestable, tightly-coupled code.

```
┌─────────────────────────────────────────────────────────────┐
│  API LAYER (routes/)                                        │
│  ✅ HTTP codes, request parsing, response formatting        │
│  ❌ Business logic, database queries                        │
├─────────────────────────────────────────────────────────────┤
│  SERVICE LAYER (services/)                                  │
│  ✅ Business logic, orchestration, data transformation      │
│  ❌ HTTP concerns, direct DB access                         │
├─────────────────────────────────────────────────────────────┤
│  DOMAIN/MODEL LAYER (types/)                                │
│  ✅ Data contracts, validation, type definitions            │
│  ❌ Business logic, side effects                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1: API Layer

Handles **only** request/response mapping and HTTP concerns.

### Example (Next.js)

```typescript
// app/api/drivers/route.ts
import { DriverService } from "@/services/DriverService";
import { ValidationError, NotFoundError } from "@/exceptions";

export async function GET(request: NextRequest) {
  try {
    const params = {
      season: request.nextUrl.searchParams.get("season"),
    };
    const drivers = await DriverService.getDrivers(params);
    return NextResponse.json({ success: true, data: drivers });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

---

## Layer 2: Service Layer

The **only** place where business logic lives.

### Responsibilities

- Business logic and rules
- Coordinate between data sources
- Transform data between layers
- Handle caching strategies

### Example

```typescript
// services/DriverService.ts
import { CacheService } from "@/services/CacheService";
import { DriverRepository } from "@/repositories/DriverRepository";

export class DriverService {
  static async getDrivers(params: GetDriversParams): Promise<Driver[]> {
    const cacheKey = `drivers:${JSON.stringify(params)}`;

    // Check cache
    const cached = await CacheService.get<Driver[]>(cacheKey);
    if (cached) return cached;

    // Fetch and apply business rules
    let drivers = await DriverRepository.findAll(params);
    drivers = drivers.filter((d) => d.hasValidContract);
    drivers.sort((a, b) => b.points - a.points);

    await CacheService.set(cacheKey, drivers, 300);
    return drivers;
  }

  static async getDriverWithStats(id: string): Promise<DriverWithStats> {
    const driver = await DriverRepository.findById(id);
    if (!driver) throw new NotFoundError(`Driver ${id} not found`);

    const [team, stats] = await Promise.all([
      TeamRepository.findById(driver.teamId),
      this.calculateStats(id),
    ]);

    return { ...driver, team, stats };
  }
}
```

---

## Layer 3: Domain/Model Layer

Defines the **contract** using strictly typed models. Every endpoint MUST have a typed response.

### Example

```typescript
// types/models/Driver.ts
export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  teamId: string;
  points: number;
  hasValidContract: boolean;
}

export interface DriverWithStats extends Driver {
  team: Team;
  stats: DriverStatistics;
}

// types/api/drivers.ts
export interface DriverResponse {
  success: boolean;
  data: Driver;
  error?: string;
}
```

---

## Resilience: Error Handling

> [!IMPORTANT]
> Use Custom Exceptions for standardized error handling.

```typescript
// exceptions/index.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code = "INTERNAL_ERROR"
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized", 401, "UNAUTHORIZED");
  }
}
```

---

## Resilience: Caching Strategy

> [!NOTE]
> Cache any data that is static or frequently accessed.

| Data Type           | TTL     | Strategy      |
| ------------------- | ------- | ------------- |
| Static reference    | 24h     | Refresh daily |
| Frequently accessed | 5-15min | Cache-aside   |
| Real-time           | 10-60s  | Short TTL     |
| User-specific       | Session | Per-user keys |

```typescript
// services/CacheService.ts
class CacheService {
  private cache = new Map<string, { data: unknown; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) return null;
    return entry.data as T;
  }

  async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    this.cache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}
```

---

## Backend Checklist

- [ ] Logic in correct layer?
- [ ] API route only handles HTTP concerns?
- [ ] Business logic in service layer?
- [ ] All models/types properly defined?
- [ ] Typed `response_model` for every endpoint?
- [ ] Custom exceptions for error handling?
- [ ] Caching for static/frequent data?
