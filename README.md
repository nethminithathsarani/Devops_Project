# BlogHub

BlogHub is a small blog admin app with a React frontend, an Express/MongoDB backend, Docker support, and Nginx for production serving.

## Project Layout

- [frontend](frontend) contains the React client.
- [backend](backend) contains the API, auth, and MongoDB models.
- [docker-compose.yaml](docker-compose.yaml) runs the stack locally with MongoDB.
- [terraform](terraform) contains infrastructure files and state, which should stay local.

## Before You Push

Make sure you do the following before publishing the repository:

1. Keep secrets out of git. Use [backend/.env.example](backend/.env.example) as the template for a local [backend/.env](backend/.env) file.
2. Set the frontend API URL through `REACT_APP_API_URL` when the frontend is not served from the same origin as the backend.
3. Avoid committing build output, Terraform state, or local environment files.
4. Rotate any secret values that were already committed or shared.

## Environment Variables

Backend variables:

- `PORT` - backend port, defaults to `5000`
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `ADMIN_USERNAME` - admin login username
- `ADMIN_PASSWORD_HASH` - bcrypt hash for the admin password
- `ADMIN_DISPLAY_NAME` - optional display name for created posts

Frontend variables:

- `REACT_APP_API_URL` - API base URL, for example `http://localhost:5000`

## Local Development

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm start
```

If you run the frontend and backend separately, point the frontend at the backend API with `REACT_APP_API_URL`.

## Docker

For the full stack, use Docker Compose from the repository root:

```bash
docker compose up --build
```

The stack expects the backend to be reachable on port `5000` and the frontend to be served behind Nginx on port `80`.

## Production Checklist

Before publishing or deploying, verify that:

- `npm run build` succeeds for the frontend.
- Login works with the configured admin credentials.
- Create, edit, and delete post flows work.
- MongoDB credentials and JWT secrets are stored outside the repository.
- The repository does not include generated assets or Terraform state.

## Notes

The starter Create React App documentation was replaced with repo-specific setup guidance so the repository is safe to publish and easier to onboard.
