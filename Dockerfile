FROM node:23-alpine3.20


WORKDIR /app


COPY package*.json turbo.json ./
COPY apps ./apps
COPY packages ./packages


ARG NEXT_PUBLIC_BACKEND
ARG PORT

ENV NEXT_PUBLIC_BACKEND=$NEXT_PUBLIC_BACKEND
ENV PORT=$PORT

RUN echo "NEXT_PUBLIC_BACKEND=$NEXT_PUBLIC_BACKEND" > /app/apps/frontend/.env && \
    echo "PORT=$PORT" > /app/apps/backend/.env

RUN npm install
RUN npm run build


EXPOSE 3000
EXPOSE 3001
EXPOSE $PORT


CMD ["npm", "run", "start"]
