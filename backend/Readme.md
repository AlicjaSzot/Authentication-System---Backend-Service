## Start local project (LocalStack + Docker)

1. Start infrastructure (in main folder: aws-repo-project):
   `docker compose up -d`
2. Build AWS in LocalStack (in /infra folder)
   `cd infra`
   `cdklocal bootstrap` (only for first time)
   `cdklocal deploy`
3. Synchronize database:
   `cd backend`
   `npx prisma db push`
4. Start backend:
   `npm run dev`
