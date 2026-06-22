# Security Specification & Adversarial Verification Spec

This document details the security principles, data invariants, and adversarial test scenarios ("The Dirty Dozen Payloads") governing our Zero-Trust Firestore Security architecture.

## 1. Data Invariants & Access Controls

- **Identity Isolation (PII Safe)**: A user's profile (`/users/{uid}`) contains sensitive PII (emails, names, phones). Reads and writes are only permitted if `request.auth.uid == uid` (self ownership).
- **Exam Attempt Locking**: Users can create, update, and read their own attempts (`/attempts/{id}`) where `attempt.userId == request.auth.uid`.
- **Terminal State Lock**: Once an attempt's status is updated to `'submitted'`, further client-side modifications are locked.
- **Strict Size Guard**: No string fields can accept unbounded strings to prevent "Denial of Wallet" resource extraction. All IDs must adhere to standard length and character filters.
- **Event Logs (Append Only)**: Logs `/events/{eventId}` are strictly append-only by authenticated users (`create` only). No updates or deletions are permitted.

---

## 2. The "Dirty Dozen" Penetration-Test Payloads

These 12 scenarios test state-shortcutting, privilege-escalation, identity-spoofing, and validation integrity.

1. **Privilege Escalation (User Role Inject)**:
   - *Payload*: `doc("users", "hacker123").set({ isAdmin: true, nome: "Hacker" })`
   - *Result*: **PERMISSION_DENIED** (only admins can exist in admin lookup; profile writes block RBAC manipulation).

2. **Email Spoofing (Veracity Bypass)**:
   - *Payload*: User attempts writing profile under another user's email or setting `email_verified = true` without actual provider confirmation.
   - *Result*: **PERMISSION_DENIED** (the system gates identity).

3. **Ghost Profile Mutate (Modify other's profile)**:
   - *Payload*: `auth.uid="hacker"`; tries `doc("users", "victim456").update({ phone: "999" })`
   - *Result*: **PERMISSION_DENIED** (strict `isOwner(userId)` verification).

4. **Attempt Spoof (Submit for another student)**:
   - *Payload*: `doc("attempts", "some_id").set({ userId: "victim123", status: "started" })`
   - *Result*: **PERMISSION_DENIED** (`ownerId` verification matching `request.auth.uid`).

5. **Terminal State Hijack (Re-edit completed exam)**:
   - *Payload*: Tries updating questions or score on an already `submitted` attempt.
   - *Result*: **PERMISSION_DENIED** (terminal state checks forbid write after submission).

6. **Score Forgery (Self-Award 100%)**:
   - *Payload*: User alters a `submitted` attempt's score without completing the answers sheet.
   - *Result*: **PERMISSION_DENIED** (the submission fields are gated).

7. **Bypass Schema Key (Shadow field insertion)**:
   - *Payload*: `doc("users", "myUid").set({ unknownField: "maliciousVal", extraPayload: true })`
   - *Result*: **PERMISSION_DENIED** (strict schema count and `.keys().size()` lock).

8. **Resource Poisoning (Junk character in Document ID)**:
   - *Payload*: Attempting to create an attempt with documentId as a 20KB emoji/junk string.
   - *Result*: **PERMISSION_DENIED** (ID syntax filtering via `isValidId()`).

9. **Denial of Wallet (Overflowing string sizes)**:
   - *Payload*: Submitting answers object where value is a huge 5MB string.
   - *Result*: **PERMISSION_DENIED** (element-wise and structure size controls).

10. **Admin Area Scraping (Direct blanket read)**:
    - *Payload*: `getDocs(collection("users"))` by a standard student to retrieve emails.
    - *Result*: **PERMISSION_DENIED** (all listing operations explicitly deny bulk scraping; query enforcer restricts list).

11. **Event Modification (Delete track log)**:
    - *Payload*: `deleteDoc(doc("events", "log789"))` by standard user.
    - *Result*: **PERMISSION_DENIED** (Logs are strictly write-only, never delete or update).

12. **Orphaned Writes (Dangling attempts)**:
    - *Payload*: Create attempt where `userId` doesn't exist or is mocked.
    - *Result*: **PERMISSION_DENIED** (requires consistent connection validation).
