import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Cari user pertama di database (akun kamu)
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log(
      "❌ Belum ada user di database. Silakan register/login dulu via web.",
    );
    return;
  }

  console.log(
    `⏳ Sedang menyiapkan 1000 data dummy untuk: ${user.namaLengkap}...`,
  );

  // 2. Siapkan data acak (Kategori & Nama)
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

  // Fungsi pembuat angka dan tanggal acak (0 sampai 90 hari ke belakang)
  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomDate = () => {
    const today = new Date();
    const pastDate = new Date();
    // Mundurkan tanggal secara acak hingga 90 hari ke belakang
    pastDate.setDate(today.getDate() - getRandomInt(0, 90));
    return pastDate;
  };

  const dataPemasukan = [];
  const dataPengeluaran = [];

  // 3. Generate 300 Pemasukan
  for (let i = 0; i < 300; i++) {
    dataPemasukan.push({
      userId: user.id,
      sumber: sumberPemasukan[getRandomInt(0, sumberPemasukan.length - 1)],
      jumlah: getRandomInt(50000, 3000000), // Rp 50rb - Rp 3 Juta
      kategori:
        kategoriPemasukan[getRandomInt(0, kategoriPemasukan.length - 1)],
      tanggal: getRandomDate(),
    });
  }

  // 4. Generate 700 Pengeluaran
  for (let i = 0; i < 700; i++) {
    dataPengeluaran.push({
      userId: user.id,
      toko: tokoPengeluaran[getRandomInt(0, tokoPengeluaran.length - 1)],
      total: getRandomInt(10000, 500000), // Rp 10rb - Rp 500rb
      kategori:
        kategoriPengeluaran[getRandomInt(0, kategoriPengeluaran.length - 1)],
      items: "[]",
      tanggal: getRandomDate(),
    });
  }

  // 5. Bersihkan data lama agar tidak dobel (Opsional)
  console.log("🧹 Membersihkan data transaksi lama...");
  await prisma.pemasukan.deleteMany({ where: { userId: user.id } });
  await prisma.pengeluaran.deleteMany({ where: { userId: user.id } });

  // 6. Masukkan 1000 data baru ke Database sekaligus!
  console.log("🚀 Menyuntikkan 1000 transaksi ke database...");
  await prisma.pemasukan.createMany({ data: dataPemasukan });
  await prisma.pengeluaran.createMany({ data: dataPengeluaran });

  console.log("✅ SUKSES! 1000 Data dummy berhasil ditambahkan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
