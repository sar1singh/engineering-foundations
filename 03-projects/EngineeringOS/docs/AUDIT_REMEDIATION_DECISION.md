# EngineeringOS Audit Remediation Decision

## Phase

Phase 21 - Audit Remediation Decision + Release Checklist.

## Current Decision

Do not apply automatic audit fixes in this phase.

Reason:

- The current findings are moderate severity.
- The app is local-first and not deployed.
- No production database, auth, billing, OpenAI, Supabase, or public deployment exists.
- The suggested remediation for `next` points to a semver-major downgrade to `next@9.3.3`, which is not compatible with the current App Router direction.
- Dependency rewrites should be handled in a separate, explicit dependency maintenance phase.

## Audit Findings

### DOMPurify

- Severity: moderate.
- Path: transitive through `monaco-editor`.
- Risk area: HTML sanitization / XSS.
- Current use: Monaco is installed for the Practice Lab roadmap, but EngineeringOS does not currently expose a rich HTML sanitization workflow or production user-generated content surface.
- Decision: defer automatic fix. Re-check after Monaco is actively used in an editor workflow.

### Monaco Editor

- Severity: moderate through `dompurify`.
- Path: direct dependency `@monaco-editor/react` -> `monaco-editor` -> `dompurify`.
- Decision: keep dependency unchanged for now. Future remediation can pin Monaco to a safe version or defer Monaco loading until the Practice Lab editor is fully implemented.

### Next

- Severity: moderate through bundled `postcss`.
- Path: direct dependency `next`.
- Current audit fix suggestion: `next@9.3.3`, a semver-major downgrade.
- Decision: do not apply. Downgrading would break the current App Router architecture and is not an acceptable remediation.

### PostCSS

- Severity: moderate.
- Path: transitive through `next`.
- Decision: wait for a compatible Next release or an approved dependency maintenance phase.

## Approved Boundaries

- Keep `dataSource` default as `mock`.
- Keep Prisma opt-in only.
- Do not add Supabase.
- Do not add auth.
- Do not add OpenAI.
- Do not add billing.
- Do not deploy.
- Do not run destructive DB commands.
- Do not change dependency versions without explicit approval.

## Future Remediation Options

1. Re-run `npm audit` in a dedicated dependency phase.
2. Check whether a compatible Next release resolves the bundled PostCSS issue.
3. Check whether a compatible Monaco release resolves the DOMPurify issue.
4. If Monaco remains unused, consider removing it until the Practice Lab editor needs it.
5. If Monaco is needed, pin a known-safe compatible version after local validation.
6. Validate with:

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm run smoke:mock
npm run smoke:prisma
```

## Current Status

Audit remediation is deferred by design. The findings are documented, and no dependency versions were changed in Phase 21.
