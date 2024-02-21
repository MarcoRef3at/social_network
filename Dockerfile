# Use a Node.js base image
FROM node:lts-alpine as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Build your NestJS application
RUN npm run build

# Production image, copy all the files and run next
FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/main"]
