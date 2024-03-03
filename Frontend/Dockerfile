FROM node:latest

WORKDIR /Frontend

COPY package.json .

RUN npm install --force

EXPOSE 5173

COPY . .

CMD ["npm", "run", "dev" ,"--", "--host"]