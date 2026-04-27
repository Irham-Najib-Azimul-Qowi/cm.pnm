## Summary

- What changed?
- Why was it needed?

## Checks

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Go handlers compile via the CI isolation check
- [ ] Vercel Preview Deployment has been opened and reviewed
- [ ] No production environment variable changes are required, or they are documented

## Deployment Notes

- Vercel project root directory: `/`
- Production branch: `main`
- Required env vars: `POSTGRES_URL`, `JWT_SECRET`
