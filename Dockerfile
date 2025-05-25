FROM node:18

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .
COPY frontend/ .

EXPOSE 2375

# Run the application
CMD ["node", "./src/app.js"]
