# Auth and User Ownership Plan

## Decision Needed

Choose an auth provider before beta. Candidate paths:

- Auth.js / NextAuth for app-integrated auth.
- Clerk for faster SaaS auth.
- Cognito if AWS-first infra is preferred.

## Ownership Rules

- Every learner profile belongs to an authenticated user.
- Progress, preferences, responses, evaluations, weak areas, and revision queue must be scoped by user ID.
- Fixed local user IDs are allowed only in local/mock mode.
- Beta mode must reject unauthenticated writes.

## Required Before Beta

- Real auth provider.
- Session user lookup.
- User-owned repository filters.
- Access-control tests.
- Data export/delete policy.
