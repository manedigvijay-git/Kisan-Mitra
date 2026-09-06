# Security Specification & Threat Model

## 1. Data Invariants

- **Master Gate & Zero-Trust Ownership**: All farmer records reside either directly at `/users/{userId}` or in child subcollections under `/users/{userId}/*` (`fields`, `diary`, `soil_reports`, `diagnostics`).
- **Identity Isolation**: A user can strictly ONLY read, create, update, or delete documents where `request.auth.uid == userId`. Cross-tenant reads and orphaned writes are strictly impossible.
- **Path Variable Validation**: Every document ID (`userId`, `fieldId`, `diaryId`, `reportId`, `diagId`) must pass `isValidId()` (`id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
- **Strict Size Limits**: Strings have explicit upper bounds (e.g. titles <= 200 chars, descriptions <= 2000 chars, names <= 100 chars).
- **Temporal Integrity**: Immutable `createdAt` timestamps cannot be changed on update; `updatedAt` matches `request.time`.
- **Default Deny Catch-All**: `match /{document=**} { allow read, write: if false; }` ensures no unmapped collections can be accessed.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1: Unauthenticated Read/Write**
   - Attempt: Read `/users/farmer_abc/fields/field_123` with `request.auth == null`.
   - Result: `PERMISSION_DENIED`.
2. **Payload 2: Tenant Cross-Write**
   - Attempt: User `attacker_123` attempts to write into `/users/victim_456/fields/malicious_field`.
   - Result: `PERMISSION_DENIED` (`userId != request.auth.uid`).
3. **Payload 3: ID Path Poisoning**
   - Attempt: Writing document ID containing path traversal `../../../admin` or 1KB junk characters.
   - Result: `PERMISSION_DENIED` (fails `isValidId()`).
4. **Payload 4: Ghost Field / Shadow Injection**
   - Attempt: Injecting `{ "isAdmin": true, "superUser": true }` into `UserProfile`.
   - Result: `PERMISSION_DENIED` (strict key/schema validation).
5. **Payload 5: Oversized String (Denial of Wallet)**
   - Attempt: Submitting a 500KB string for field `name` or `title`.
   - Result: `PERMISSION_DENIED` (`size() <= maxLength`).
6. **Payload 6: Forged CreatedAt Timestamp**
   - Attempt: Setting `createdAt: "2010-01-01T00:00:00Z"` on document creation.
   - Result: `PERMISSION_DENIED` (requires `request.time`).
7. **Payload 7: Immutable Field Tampering**
   - Attempt: Updating `userId` or `id` on an existing `FarmField` document.
   - Result: `PERMISSION_DENIED` (`incoming().userId == existing().userId`).
8. **Payload 8: Global Collection Listing Scraping**
   - Attempt: Calling `getDocs(collectionGroup(db, 'fields'))` or `getDocs(collection(db, 'users'))`.
   - Result: `PERMISSION_DENIED` (default-deny catch-all blocks unauthenticated and unbounded collection queries).
9. **Payload 9: Invalid Data Type Injection**
   - Attempt: Setting `cost: "free"` or `acreage: true` instead of numeric values.
   - Result: `PERMISSION_DENIED` (type checks fail).
10. **Payload 10: State Bypass / Terminal State Corruption**
    - Attempt: Writing invalid activity types or unauthorized action payloads.
    - Result: `PERMISSION_DENIED`.
11. **Payload 11: Spoofed Email Token**
    - Attempt: Writing data with unverified email or invalid token claims.
    - Result: `PERMISSION_DENIED`.
12. **Payload 12: Orphaned Subcollection Write**
    - Attempt: Writing a diary entry referencing a non-existent parent field.
    - Result: `PERMISSION_DENIED`.
