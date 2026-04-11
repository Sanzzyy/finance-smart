import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

async function main() {
  // Ambil user pertama yang ada di database
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error("❌ Tidak ada user di database. Silakan register akun dulu di website sebelum seeding!");
    process.exit(1);
  }

  console.log(`Peringatan: Membuat data dummy untuk user: ${user.namaLengkap} (${user.email})`);

  // Target Waktu Dummy
  const now = new Date();
  
  // Data Hari Ini
  const hariIni = new Date(now);

  // Data Minggu Ini (misal 3 hari lalu)
  const mingguIni = new Date(now);
  mingguIni.setDate(now.getDate() - 3);

  // Data Bulan Ini (misal 15 hari lalu)
  const bulanIni = new Date(now);
  bulanIni.setDate(now.getDate() - 15);

  // Data Bulan Lalu (misal 40 hari lalu)
  const bulanLalu = new Date(now);
  bulanLalu.setDate(now.getDate() - 40);

  const pengeluaranTujuan = [
    { toko: "Indomaret", kategori: "Belanja", baseTotal: 50000 },
    { toko: "Restoran Sederhana", kategori: "Makan", baseTotal: 120000 },
    { toko: "SPBU Pertamina", kategori: "Transportasi", baseTotal: 250000 },
    { toko: "Kopi Kenangan", kategori: "Jajan", baseTotal: 30000 },
    { toko: "Tagihan Listrik", kategori: "Tagihan", baseTotal: 500000 },
  ];

  const waktuDummy = [
    { nama: "Hari Ini", tanggal: hariIni },
    { nama: "Minggu Ini", tanggal: mingguIni },
    { nama: "Bulan Ini", tanggal: bulanIni },
    { nama: "Dulu Sekali", tanggal: bulanLalu },
  ];

  console.log("Menambahkan data dummy PENGELUARAN...");
  for (const waktu of waktuDummy) {
    // 2 pengeluaran tiap periode
    for(let i=0; i<2; i++) {
        const item = pengeluaranTujuan[Math.floor(Math.random() * pengeluaranTujuan.length)];
        const total = item.baseTotal + Math.floor(Math.random() * 20000);
        
        await prisma.pengeluaran.create({
            data: {
              userId: user.id,
              toko: item.toko + " (" + waktu.nama + ")",
              total: total,
              kategori: item.kategori,
              items: JSON.stringify([{ nama: item.toko, harga: total }]),
              tanggal: waktu.tanggal,
            }
        });
    }
  }

  console.log("Menambahkan data dummy PEMASUKAN...");
  for (const waktu of waktuDummy) {
      await prisma.pemasukan.create({
          data: {
              userId: user.id,
              sumber: "Gaji / Freelance (" + waktu.nama + ")",
              jumlah: 3000000 + Math.floor(Math.random() * 2000000),
              kategori: "Gaji",
              tanggal: waktu.tanggal
          }
      });
  }

  console.log("✅ Proses Seeding Selesai! Silakan refresh halaman Dashboard untuk melihat datanya.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
