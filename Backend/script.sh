#!/bin/bash

# Run Prisma migration without prompting for user input

npx prisma generate

npx prisma migrate dev --name init

npm run start:dev