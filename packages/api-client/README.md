# @notes/api-client

Typed client for the Learning Notes API, generated with [orval](https://orval.dev) from the API's OpenAPI contract.

| Import | Contents |
|--------|----------|
| `@notes/api-client` | Typed functions (`authLogin`, `authMe`, …), models (`UserDto`, …), Zod schemas (`schemas.authLoginBody`, …), `ApiRequestError`, `configureApiClient` |
| `@notes/api-client/react` | TanStack Query hooks (`useAuthLogin`, `useAuthMe`, …) |

## Regenerate after an API change

With the API running (`npm run dev` from the repository root):

```bash
npm run generate -w @notes/api-client
```

This downloads the contract from `API_CONTRACT_URL` (default `http://localhost:4000/api/docs-json`) into `openapi.json`, then regenerates `src/generated/`. Commit both with the API change. To regenerate from the saved snapshot without the API, use `generate:offline`.

Never edit `openapi.json` or `src/generated/` by hand.
