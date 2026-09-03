FROM node:24-alpine AS base
WORKDIR /app

FROM base AS development
COPY package*.json ./
RUN npm install
RUN npm cache clean --force
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY public /var/www/public
COPY --from=build /app/public/build /var/www/public/build
WORKDIR /var/www
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
