# MTCaptcha Node.js sample API

Sample Express backend that verifies an MTCaptcha token on the server after the client widget solves the challenge. The [mtcaptcha](https://github.com/mtcaptcha-public/mtcaptcha-nodejs-sdk) package calls MTCaptcha’s CheckToken API over HTTPS.

## Prerequisites

- **Node.js** 24.x (see `engines` in `package.json`)
- An MTCaptcha account with a **private key** for your site ([MTCaptcha admin console](https://admin.mtcaptcha.com/login))

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables. Copy the example file and edit values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |----------|-------------|
   | `MTCAPTCHA_PRIVATE_KEY` | Your server-side private key from the MTCaptcha admin site (required for `/api/login`). |
   | `PORT` | HTTP port (default in example: `5000`). |

3. Run the server (restarts automatically when files change):

   ```bash
   npm run dev
   ```

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/login` | Demo login with captcha verification. Expects JSON body: `username`, `password`, `verifiedtoken` (the token from the client widget). |
| `GET` | `/api/secret-route` | Example protected route. Send `Authorization: Bearer <JWT>` from a successful login. |

Demo credentials are hardcoded as `test` / `test` for illustration only.

## Example requests

Replace `VERIFIED_TOKEN` with a real token from your frontend, and `JWT_TOKEN` with the `token` field from a successful login response.

```bash
curl -X POST http://localhost:5000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"test","password":"test","verifiedtoken":"VERIFIED_TOKEN"}'
```

```bash
curl http://localhost:5000/api/secret-route \
  -H 'Authorization: Bearer JWT_TOKEN'
```

## Troubleshooting

- **`getaddrinfo ENOTFOUND service.mtcaptcha.com`**: The server cannot resolve or reach MTCaptcha’s API host. Check DNS, firewall, and outbound HTTPS access. For environments that must allowlist IPs, see the SDK option `explicitAcl` in the [mtcaptcha Node.js SDK README](https://github.com/mtcaptcha-public/mtcaptcha-nodejs-sdk).

## References

- [MTCaptcha Node.js SDK](https://github.com/mtcaptcha-public/mtcaptcha-nodejs-sdk)
- [MTCaptcha documentation](https://docs.mtcaptcha.com/dev-guide-quickstart)
