import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

// Setup adapter native Postgres
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Konfigurasi WebAuthn
const rpName = "FinanceSmart";
const rpID = "finance-smart-web.vercel.app"; // Saat rilis ke Vercel nanti, ini harus diganti jadi domain Vercel-mu
const origin = `https://finance-smart-web.vercel.app`;

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Setup Multer untuk menyimpan gambar sementara di memory (RAM) server
const upload = multer({ storage: multer.memoryStorage() });

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.OPENROUTER_API_KEY);

app.get("/", (req, res) => {
  res.send("Server API FinanceSmart Berjalan Lancar! 🚀");
});

const JWT_SECRET = "syzen";

// 1. RUTE REGISTER (Daftar Akun Baru)
app.post("/api/register", async (req, res) => {
  try {
    const { namaLengkap, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email sudah digunakan!" });
    }

    // Acak/Hash password (Bcrypt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: {
        namaLengkap,
        email,
        password: hashedPassword, // Simpan password yang sudah diacak
      },
    });

    res.status(201).json({ message: "Registrasi berhasil!", data: newUser });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// --- API 1: Meminta Tantangan Biometrik ---
app.post("/api/webauthn/register-options", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan!" });

    // Cek apakah user sudah punya passkey sebelumnya
    const userPasskeys = await prisma.passkey.findMany({
      where: { userId: user.id },
    });

    // Buat opsi gembok baru
    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new Uint8Array(Buffer.from(user.id)),
      userName: user.email,
      // Mencegah HP mendaftarkan sidik jari yang sama 2 kali
      excludeCredentials: userPasskeys.map((key) => ({
        id: key.credentialID,
        type: "public-key",
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform", // Memaksa HP pakai sensor bawaan (Sidik Jari/FaceID)
      },
    });

    // Simpan tantangannya ke brankas sementara kita
    await prisma.user.update({
      where: { id: user.id },
      data: { currentChallenge: options.challenge },
    });

    res.json(options);
  } catch (error) {
    console.error("Error Generate Options:", error);
    res.status(500).json({ message: "Gagal membuat opsi biometrik" });
  }
});

// --- API 2: Memverifikasi Hasil Scan Sidik Jari ---
app.post("/api/webauthn/register-verify", async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Ambil tantangan yang tadi kita simpan
    const expectedChallenge = user.currentChallenge;

    // Cocokkan data dari Frontend dengan ekspektasi Backend
    const verification = await verifyRegistrationResponse({
      response: data,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified) {
      const { registrationInfo } = verification;

      // 1. KITA SADAP DATANYA! (Nanti akan muncul di Logs Vercel)
      console.log(
        "🕵️‍♂️ WUJUD ASLI REGISTRATION INFO:",
        JSON.stringify(registrationInfo, null, 2),
      );

      // 2. JARING PENGAMAN (Mencari di semua kemungkinan tempat, baik versi baru maupun lama)
      const credentialID =
        registrationInfo?.credential?.id || registrationInfo?.credentialID;
      const credentialPK =
        registrationInfo?.credential?.publicKey ||
        registrationInfo?.credentialPublicKey;

      // Di library versi terbaru, counter kadang pindah ke luar
      const counter =
        registrationInfo?.credential?.counter || registrationInfo?.counter || 0;

      // 3. PENCEGAH CRASH: Kalau masih undefined, kita stop sebelum kena Buffer.from
      if (!credentialID || !credentialPK) {
        return res.status(500).json({
          message: "Gagal ekstrak Gembok! Cek Logs Vercel untuk wujud aslinya.",
        });
      }

      // 4. SIMPAN KE DATABASE (Aman dari tipe string maupun array biner)
      await prisma.passkey.create({
        data: {
          userId: user.id,
          // Kalau bentuknya teks (Base64URL) kita ubah jadi biner. Kalau sudah biner, langsung bungkus.
          credentialID:
            typeof credentialID === "string"
              ? Buffer.from(credentialID, "base64url")
              : Buffer.from(credentialID),
          credentialPK: Buffer.from(credentialPK),
          counter: BigInt(counter),
        },
      });

      // Hapus tantangan karena sudah sukses terpakai
      await prisma.user.update({
        where: { id: user.id },
        data: { currentChallenge: null },
      });

      res.json({ verified: true, message: "Sidik jari berhasil diamankan!" });
    } else {
      res.status(400).json({ verified: false, message: "Verifikasi gagal." });
    }
  } catch (error) {
    console.error("Error Verify Registration:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. RUTE LOGIN (Masuk Akun)
app.post("/api/login", async (req, res) => {
  try {
    console.log("Data yang masuk ke Login:", req.body);

    // 1. Tangkap 'identifier' juga dari req.body
    const { email, identifier, password } = req.body;

    // 2. Gabungkan logika: Kalau 'email' kosong, pakai 'identifier'
    const emailYangMasuk = email || identifier;

    // 3. Ubah satpamnya untuk mengecek 'emailYangMasuk'
    if (!emailYangMasuk || !password) {
      return res
        .status(400)
        .json({ message: "Ups! Email dan Password wajib diisi." });
    }

    // 4. Cari user di database menggunakan 'emailYangMasuk'
    const user = await prisma.user.findUnique({
      where: { email: emailYangMasuk },
    });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan!" });
    }

    // Cocokkan password yang diketik dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah!" });
    }

    // Buat Tiket Masuk (Token JWT)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d", // Token berlaku 7 hari
    });

    // 1. CEK APAKAH USER INI SUDAH PUNYA SIDIK JARI
    const userPasskeys = await prisma.passkey.findMany({
      where: { userId: user.id },
    });
    const hasBiometric = userPasskeys.length > 0; // true kalau sudah ada, false kalau belum

    // Kirim token dan data user (kecuali password) ke frontend
    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        namaLengkap: user.namaLengkap,
        email: user.email,
        hasBiometric: hasBiometric,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// =========================================================
// API 3: Meminta Tantangan untuk LOGIN Biometrik
// =========================================================
app.post("/api/webauthn/login-options", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const userPasskeys = await prisma.passkey.findMany({
      where: { userId: user.id },
    });
    if (userPasskeys.length === 0) {
      return res.status(400).json({ message: "Belum ada sidik jari." });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: userPasskeys.map((key) => ({
        // BUNGKUS AMAN MENGHINDARI ERROR ANGKA KOMA:
        id: Buffer.from(key.credentialID).toString("base64url"),
        type: "public-key",
      })),
      userVerification: "preferred",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { currentChallenge: options.challenge },
    });

    res.json(options);
  } catch (error) {
    console.error("Error Login Options:", error);
    res.status(500).json({ message: "Gagal menyiapkan login biometrik" });
  }
});

// =========================================================
// API 4: Verifikasi Sidik Jari untuk LOGIN
// =========================================================
app.post("/api/webauthn/login-verify", async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    const expectedChallenge = user.currentChallenge;

    const userPasskeys = await prisma.passkey.findMany({
      where: { userId: user.id },
    });

    const passkey = userPasskeys.find((pk) => {
      const dbId = Buffer.from(pk.credentialID).toString("base64url");
      return dbId === data.id;
    });

    if (!passkey)
      return res
        .status(400)
        .json({ message: "Sidik jari tidak dikenali di sistem kami." });

    const verification = await verifyAuthenticationResponse({
      response: data,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        publicKey: new Uint8Array(passkey.credentialPK), // <--- BERUBAH JADI 'publicKey'
        id: Buffer.from(passkey.credentialID).toString("base64url"), // <--- BERUBAH JADI 'id'
        counter: Number(passkey.counter),
      },
    });

    if (verification.verified) {
      await prisma.passkey.update({
        where: { id: passkey.id },
        data: { counter: BigInt(verification.authenticationInfo.newCounter) },
      });
      await prisma.user.update({
        where: { id: user.id },
        data: { currentChallenge: null },
      });

      const jwt = await import("jsonwebtoken");
      const token = jwt.default.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" },
      );

      res.json({
        verified: true,
        message: "Login sidik jari berhasil!",
        token,
        user: {
          id: user.id,
          namaLengkap: user.namaLengkap,
          email: user.email,
          hasBiometric: true,
        },
      });
    } else {
      res
        .status(400)
        .json({ verified: false, message: "Sidik jari tidak cocok." });
    }
  } catch (error) {
    console.error("Error Verify Login:", error);
    res.status(500).json({ message: error.message });
  }
});

// upload.single('receipt') artinya kita menerima 1 file gambar dengan nama field 'receipt'
// --- ENDPOINT: SCAN STRUK DENGAN GEMINI ---
app.post("/api/scan", upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Gambarnya mana?" });

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const daftarKategori =
      "Makan, Transportasi, Belanja, Hiburan, Tagihan, Kesehatan, Pendidikan, Jajan, Gaji, Bonus, Darurat, Lainnya";

    const prompt = `
      Kamu adalah kasir pintar. Ekstrak data dari struk ini secara mendetail.
      PENTING: List semua barang yang dibeli.
      Kembalikan hanya dalam format JSON:
      {
        "toko": "nama toko",
        "total": 100000,
        "kategori": "Belanja/Makan/dll",
        "items": [
          { "nama": "Nama Barang 1", "harga": 50000 },
          { "nama": "Nama Barang 2", "harga": 50000 }
        ]
      }
    `;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // Wajib ada untuk OpenRouter
          "X-Title": "Finance Smart", // Wajib ada untuk OpenRouter
        },
        body: JSON.stringify({
          model: "google/gemma-3-27b-it",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: { url: `data:${mimeType};base64,${base64Image}` },
                },
              ],
            },
          ],
        }),
      },
    );

    const dataAI = await response.json();

    // TANGKAP ERROR DARI OPENROUTER
    if (dataAI.error) {
      console.error("OpenRouter Error (Scan):", dataAI.error);
      return res
        .status(500)
        .json({ message: `OpenRouter menolak: ${dataAI.error.message}` });
    }

    const responseText = dataAI.choices[0].message.content;

    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const data = JSON.parse(cleanJson);

    res.status(200).json({ data: data });
  } catch (error) {
    console.error("Error scan:", error);
    res.status(500).json({ message: "Gagal membaca struk." });
  }
});

// --- ENDPOINT: SIMPAN PENGELUARAN ---
app.post("/api/pengeluaran", async (req, res) => {
  try {
    const { userId, toko, total, items, kategori } = req.body;

    const pengeluaranBaru = await prisma.pengeluaran.create({
      data: {
        userId: userId,
        toko: toko || "Toko Tidak Diketahui",
        total: total || 0,
        items: typeof items === "string" ? items : JSON.stringify(items || []),
        kategori: kategori ? kategori.trim() : "Lainnya",
      },
    });

    res
      .status(201)
      .json({ message: "Data berhasil disimpan!", data: pengeluaranBaru });
  } catch (error) {
    console.error("Error simpan data:", error);
    res.status(500).json({ message: "Gagal menyimpan pengeluaran." });
  }
});

// --- ENDPOINT: AMBIL DATA PENGELUARAN BERDASARKAN USER ---
app.get("/api/pengeluaran/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Cari semua pengeluaran milik user ini, urutkan dari yang terbaru
    const riwayatPengeluaran = await prisma.pengeluaran.findMany({
      where: { userId: userId },
      orderBy: { tanggal: "desc" },
    });

    res.status(200).json({ data: riwayatPengeluaran });
  } catch (error) {
    console.error("Error ambil data:", error);
    res.status(500).json({ message: "Gagal mengambil data pengeluaran." });
  }
});

// --- ENDPOINT: SIMPAN PEMASUKAN ---
app.post("/api/pemasukan", async (req, res) => {
  try {
    const { userId, sumber, jumlah, kategori } = req.body;
    const pemasukanBaru = await prisma.pemasukan.create({
      data: {
        userId: userId,
        sumber: sumber || "Pemasukan",
        jumlah: parseInt(jumlah) || 0, // Pastikan jadi angka
        kategori: kategori ? kategori.trim() : "Lainnya",
      },
    });
    res
      .status(201)
      .json({ message: "Pemasukan dicatat!", data: pemasukanBaru });
  } catch (error) {
    console.error("Error simpan pemasukan:", error);
    res.status(500).json({ message: "Gagal menyimpan pemasukan." });
  }
});

// --- ENDPOINT: AMBIL DATA PEMASUKAN ---
app.get("/api/pemasukan/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const riwayatPemasukan = await prisma.pemasukan.findMany({
      where: { userId: userId },
    });
    res.status(200).json({ data: riwayatPemasukan });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pemasukan." });
  }
});

// --- ENDPOINT: HAPUS PEMASUKAN ---
app.delete("/api/pemasukan/:id", async (req, res) => {
  try {
    await prisma.pemasukan.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Pemasukan berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data." });
  }
});

// --- ENDPOINT: HAPUS PENGELUARAN ---
app.delete("/api/pengeluaran/:id", async (req, res) => {
  try {
    await prisma.pengeluaran.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Pengeluaran berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data." });
  }
});

// --- ENDPOINT: UBAH PEMASUKAN ---
app.put("/api/pemasukan/:id", async (req, res) => {
  try {
    const { sumber, jumlah, kategori } = req.body;
    await prisma.pemasukan.update({
      where: { id: req.params.id },
      data: {
        sumber: sumber,
        jumlah: parseInt(jumlah),
        ...(kategori && { kategori: kategori }),
      },
    });
    res.status(200).json({ message: "Pemasukan berhasil diubah!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengubah data pemasukan." });
  }
});

// --- ENDPOINT: UBAH PENGELUARAN ---
app.put("/api/pengeluaran/:id", async (req, res) => {
  try {
    const { toko, total, kategori } = req.body;
    await prisma.pengeluaran.update({
      where: { id: req.params.id },
      data: {
        toko: toko,
        total: parseInt(total),
        ...(kategori && { kategori: kategori }),
      },
    });
    res.status(200).json({ message: "Pengeluaran berhasil diubah!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengubah data pengeluaran." });
  }
});

// --- ENDPOINT: VOICE COMMAND DENGAN GEMINI ---
app.post("/api/voice", async (req, res) => {
  try {
    const { userId, text } = req.body;
    const daftarKategori =
      "Makan, Transportasi, Belanja, Hiburan, Tagihan, Kesehatan, Pendidikan, Jajan, Gaji, Bonus, Darurat, Lainnya";

    const prompt = `
      Penting: Ekstrak SEMUA transaksi keuangan dari teks ini secara teliti: "${text}"
      Daftar kategori yang boleh digunakan: ${daftarKategori}
      
      Tugas untuk *setiap* item/transaksi yang kamu temukan:
      1. Tentukan 'tipe' ("pemasukan" atau "pengeluaran").
      2. Tentukan 'judul' (nama barang/sumber).
      3. Tentukan 'nominal' (angka murni).
      
     Kembalikan HANYA dalam format Array JSON seperti ini:
      [
        {
          "judul": "nama transaksi",
          "nominal": 10000,
          "tipe": "pemasukan/pengeluaran",
          "kategori": "Pilih salah satu dari daftar kategori di atas"
        }
      ]
    `;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Finance Smart",
        },
        body: JSON.stringify({
          model: "google/gemma-3-27b-it",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    const dataAI = await response.json();

    if (dataAI.error) {
      console.error("OpenRouter Error (Voice):", dataAI.error);
      return res.status(500).json({ message: "OpenRouter Error" });
    }

    const responseText = dataAI.choices[0].message.content;
    // PERBAIKAN: Cari karakter '[' pertama dan ']' terakhir untuk memotong teks sampah dari AI
    const firstBracket = responseText.indexOf("[");
    const lastBracket = responseText.lastIndexOf("]");

    if (firstBracket === -1 || lastBracket === -1) {
      throw new Error("AI tidak memberikan format JSON yang valid");
    }

    const cleanJson = responseText.substring(firstBracket, lastBracket + 1);
    const data = JSON.parse(cleanJson);

    // Amankan bentuk data apakah JSON Object atau Array
    const transactions = Array.isArray(data) ? data : [data];
    const savedTrx = [];

    // Lakukan loop penyimpanan
    for (const trx of transactions) {
      // Mencegah AI mengembalikan spasi berlebih atau string kotor
      const kategoriBersih = trx.kategori ? trx.kategori.trim() : "Lainnya";

      if (trx.tipe === "pemasukan") {
        await prisma.pemasukan.create({
          data: {
            userId: userId,
            sumber: trx.judul,
            jumlah: trx.nominal,
            kategori: kategoriBersih,
          },
        });
      } else {
        await prisma.pengeluaran.create({
          data: {
            userId: userId,
            toko: trx.judul,
            total: trx.nominal,
            kategori: kategoriBersih,
            items: JSON.stringify([{ nama: trx.judul, harga: trx.nominal }]),
          },
        });
      }
      savedTrx.push(trx);
    }

    res.status(200).json({
      message: "Berhasil dicatat!",
      tercatat: savedTrx,
    });
  } catch (error) {
    console.error("Error voice command:", error);
    res.status(500).json({ message: "Gagal memproses suara." });
  }
});

// --- ENDPOINT: CEK KEMAMPUAN BELI (ASISTEN AI) ---
app.post("/api/kemampuan-beli", async (req, res) => {
  try {
    const { userId, text, saldo, rataPengeluaran } = req.body;

    const prompt = `
      Saya adalah pengguna yang ingin membeli atau melakukan pengeluaran untuk sesuatu.
      Mata uang: Rupiah (Rp).
      Kondisi keuangan saya saat ini:
      - Saldo Tersisa: Rp ${saldo}
      - Rata-rata Pengeluaran Bulanan: Rp ${rataPengeluaran}
      
      Pertanyaan / Keinginan saya: "${text}"
      
      Tugas kamu sebagai Asisten Perencana Keuangan yang pintar, realistis, namun tetap memotivasi:
      1. Berikan analisa finansial, apakah dengan sisa saldo saya saat ini, keputusan tersebut masuk akal/rasional atau uangnya kurang?
      2. Berikan saran atau motivasi (misal: "Lebih baik ditabung dulu bulan ini" atau "Wah asik, saldomu cukup kok!").
      
      Kembalikan HANYA format JSON (tanpa markdown backticks, tanpa kata pembuka). Harus persis format ini:
      {
        "status": "bisa", // hanya isi dengan teks "bisa" atau "tidak" (karena akan dipakai untuk warna UI hijau/merah)
        "pesan": "analisa dan saran kamu sepanjang 2-3 kalimat yang ramah dan memotivasi di sini"
      }
    `;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Finance Smart",
        },
        body: JSON.stringify({
          model: "google/gemma-3-27b-it", // Bisa juga pakai model fallback jika ini gagal
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    const dataAI = await response.json();

    if (dataAI.error) {
      console.error("OpenRouter Error (Kemampuan Beli):", dataAI.error);
      return res.status(500).json({ message: "OpenRouter Error", detail: dataAI.error });
    }

    const responseText = dataAI.choices[0].message.content;
    const firstBracket = responseText.indexOf("{");
    const lastBracket = responseText.lastIndexOf("}");

    if (firstBracket === -1 || lastBracket === -1) {
      throw new Error("AI tidak memberikan format JSON yang valid");
    }

    const cleanJson = responseText.substring(firstBracket, lastBracket + 1);
    const result = JSON.parse(cleanJson);

    res.status(200).json({
      message: "Analisa berhasil didapatkan",
      data: result,
    });
  } catch (error) {
    console.error("Error cek kemampuan beli:", error);
    res.status(500).json({ message: "Gagal memproses analisa Asisten AI." });
  }
});

// Kalau di laptop, pakai app.listen. Kalau di Vercel, di-export!
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
  });
}

export default app;
