## Summary
<!-- One sentence: what does this PR do and why? -->

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📝 Documentation
- [ ] 🗄️ New Flyway migration (V67 or higher)
- [ ] ♻️ Refactor (no behavior change)

## Related Issue
Closes #

## What Changed
<!-- Which files, which services, why? -->

## How to Test
1. 
2. 
3. 

## Backend Checklist
- [ ] Used `timeService.getCurrentUtc()` — not `Instant.now()` or `LocalDateTime.now()` in service methods
- [ ] Soft-deletable entities use `setDeletedAtUtc()` — no `repository.delete()` calls
- [ ] JPQL queries on soft-deletable entities include `AND entity.deletedAtUtc IS NULL`
- [ ] Concurrency-sensitive seat writes use `resolveOccurrenceWithLock()` (pessimistic lock)
- [ ] Ownership validated from authenticated user email — not trusted from path ID alone
- [ ] Pricing computed via `PricingService` — no hardcoded numbers
- [ ] All new thresholds/percentages come from `LoyaltyProperties` (not hardcoded)

## Database Checklist (if migration included)
- [ ] Migration version is V67 or higher (check existing migrations first)
- [ ] Uses `TIMESTAMPTZ` — not `TIMESTAMP`
- [ ] Uses `IF NOT EXISTS` guards on CREATE TABLE / CREATE INDEX
- [ ] Soft-delete column has a matching partial index
- [ ] Scheduler query columns have a matching partial index
- [ ] Tested: Flyway applies cleanly on fresh DB + app starts with `spring.jpa.hibernate.ddl-auto=validate`

## Frontend Checklist (if applicable)
- [ ] API calls go through `src/lib/api/<domain>.ts` — no raw Axios instances created
- [ ] WebSocket uses `useChatSocket` or `useNotificationSocket` hooks — no new STOMP clients
- [ ] New colors use existing Tailwind design system tokens from `tailwind.config.ts`
