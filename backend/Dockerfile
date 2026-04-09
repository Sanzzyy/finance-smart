# 1. Gunakan Node 20
FROM node:20

# 2. Set folder kerja
WORKDIR /app

# 3. COPY package.json (INI YANG TADI HILANG)
COPY package*.json ./

# 4. COPY folder prisma (supaya 'prisma generate' saat install tidak error)
COPY prisma ./prisma/

# 5. Baru jalankan instalasi library
RUN npm install

# 6. Copy semua file codingan lainnya
COPY . .

# 7. Expose port 5000 (sesuai codingan Express kamu)
EXPOSE 5000

# 8. Jalankan app
CMD ["npm", "run", "dev"]