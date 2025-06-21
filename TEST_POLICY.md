# Test Policy Documentation

## Security Header Policies

### X-Frame-Options: SAMEORIGIN vs DENY
- **Current**: SAMEORIGIN
- **Reason**: Allows embedding in same-origin contexts (needed for portal iframe features)
- **Decision**: PERMANENT - Required for invoice preview functionality

### X-XSS-Protection: 0 vs 1; mode=block
- **Current**: 0
- **Reason**: Modern browsers recommend disabling XSS auditor (can introduce vulnerabilities)
- **Decision**: PERMANENT - Following OWASP recommendations

### HTTP Methods
- **Current**: HEAD requests return 405 on some endpoints
- **Reason**: Vercel serverless functions handle HEAD differently
- **Decision**: TEMPORARY - Will add HEAD support in next iteration

### CORS Headers
- **Current**: Access-Control-Allow-Credentials: true (no origin on same-origin requests)
- **Reason**: Security best practice - origin header only sent on cross-origin
- **Decision**: PERMANENT - Correct behavior

## API Response Format
- **Current**: Prisma models use camelCase (createdAt) vs snake_case (created_at)
- **Decision**: PERMANENT - Following JavaScript conventions

## Test Coverage Goals
- Unit tests: 80% coverage
- Integration tests: All critical paths
- Smoke tests: 100% pass rate before deployment