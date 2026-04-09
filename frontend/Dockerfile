FROM node:20

WORKDIR /app

COPY package*.json ./
# Tambahkan bendera --legacy-peer-deps agar dia mengabaikan bentrok versi Vite
RUN npm install --legacy-peer-deps

COPY . .

# Port standar Vite adalah 5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]