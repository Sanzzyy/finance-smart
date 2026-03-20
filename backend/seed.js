import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Bawaan Node.js untuk bikin UUID

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("⏳ Sedang menyiapkan Bumbu Rahasia (Hashing Password)...");

  // 1. Hash password "123" SEKALI SAJA untuk semua user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("123", salt);

  console.log(
    "🚀 Merakit 1000 User beserta transaksinya (Ini butuh beberapa detik)...",
  );

  const dataUsers = [];
  const dataPemasukan = [];
  const dataPengeluaran = [];

  const kategoriPemasukan = ["Gaji", "Bonus", "Jajan", "Darurat", "Lainnya"];
  const kategoriPengeluaran = [
    "Makan",
    "Transportasi",
    "Belanja",
    "Tagihan",
    "Jajan",
    "Lainnya",
  ];
  const sumberPemasukan = [
    "Gaji Bulanan",
    "Project Freelance Web",
    "Dikasih Kakak",
    "Bonus Proyek",
    "Jual Barang Bekas",
  ];
  const tokoPengeluaran = [
    "Indomaret",
    "Warung Nasi",
    "SPBU Pertamina",
    "Tokopedia",
    "Shopee",
    "Kopi Kenangan",
    "PLN",
    "Netflix",
  ];

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomDate = () => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - getRandomInt(0, 90));
    return pastDate;
  };

  // 2. Looping bikin 1000 User
  for (let i = 1; i <= 1000; i++) {
    const userId = crypto.randomUUID(); // Bikin ID User duluan

    dataUsers.push({
      id: userId,
      namaLengkap: `User Dummy ${i}`,
      email: `user${i}@finance.com`,
      password: hashedPassword,
    });

    // Bikin jumlah transaksi yang BERBEDA untuk setiap user
    const jumlahPemasukan = getRandomInt(1, 5); // Tiap user punya 1-5 pemasukan
    const jumlahPengeluaran = getRandomInt(5, 15); // Tiap user punya 5-15 pengeluaran

    for (let j = 0; j < jumlahPemasukan; j++) {
      dataPemasukan.push({
        userId: userId, // Sambungkan ke ID User di atas
        sumber: sumberPemasukan[getRandomInt(0, sumberPemasukan.length - 1)],
        jumlah: getRandomInt(50000, 3000000),
        kategori:
          kategoriPemasukan[getRandomInt(0, kategoriPemasukan.length - 1)],
        tanggal: getRandomDate(),
      });
    }

    for (let k = 0; k < jumlahPengeluaran; k++) {
      dataPengeluaran.push({
        userId: userId, // Sambungkan ke ID User di atas
        toko: tokoPengeluaran[getRandomInt(0, tokoPengeluaran.length - 1)],
        total: getRandomInt(10000, 500000),
        kategori:
          kategoriPengeluaran[getRandomInt(0, kategoriPengeluaran.length - 1)],
        items: "[]",
        tanggal: getRandomDate(),
      });
    }
  }

  // 3. (Opsional) Hapus data dummy lama agar email tidak bentrok
  console.log("🧹 Membersihkan data dummy lama (jika ada)...");
  await prisma.user.deleteMany({
    where: { email: { endsWith: "@finance.com" } },
  });

  // 4. Tembakkan ke Database sekaligus pakai createMany!
  console.log(`💉 Menyuntikkan 1000 User ke Database...`);
  await prisma.user.createMany({ data: dataUsers });

  console.log(`💸 Menyuntikkan ${dataPemasukan.length} Pemasukan...`);
  await prisma.pemasukan.createMany({ data: dataPemasukan });

  console.log(`🛒 Menyuntikkan ${dataPengeluaran.length} Pengeluaran...`);
  await prisma.pengeluaran.createMany({ data: dataPengeluaran });

  console.log("✅ SUKSES BESAR! Data siap digunakan untuk stress testing.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
