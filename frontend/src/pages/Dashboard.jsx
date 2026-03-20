import React, { useEffect, useState, useRef } from "react";
// Import Komponen Modular
import Sidebar from "../components/dashboard/Sidebar";
import BalanceCard from "../components/dashboard/BalanceCard";
import TransactionList from "../components/dashboard/TransactionList";
import StatistikView from "../components/dashboard/StatistikView";
import {
  PemasukanModal,
  PengeluaranModal,
  EditModal,
  ScanResultModal,
} from "../components/modals/Allmodals";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { gsap } from "gsap";
import {
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  FileText,
  HeartPulse,
  GraduationCap,
  Coffee,
  Banknote,
  Gift,
  HelpCircle,
  Shield,
  Loader2,
  Menu,
  Wallet,
  Calendar,
  ChevronDown,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [riwayatTransaksi, setRiwayatTransaksi] = useState([]);

  const [rawPemasukan, setRawPemasukan] = useState([]);
  const [rawPengeluaran, setRawPengeluaran] = useState([]);
  const [filterWaktu, setFilterWaktu] = useState("bulan_ini");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [showPemasukanModal, setShowPemasukanModal] = useState(false);
  const [formPemasukan, setFormPemasukan] = useState({
    sumber: "",
    jumlah: "",
    kategori: "Gaji",
  });

  const [showPengeluaranModal, setShowPengeluaranModal] = useState(false);
  const [formPengeluaran, setFormPengeluaran] = useState({
    toko: "",
    total: "",
    kategori: "Makan",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [formEdit, setFormEdit] = useState({
    id: "",
    tipe: "",
    judul: "",
    nominal: "",
  });

  // Fungsi untuk menentukan sapaan berdasarkan jam
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const ikonKategori = {
    makan: <Utensils size={20} />,
    transportasi: <Car size={20} />,
    belanja: <ShoppingBag size={20} />,
    hiburan: <Gamepad2 size={20} />,
    tagihan: <FileText size={20} />,
    kesehatan: <HeartPulse size={20} />,
    pendidikan: <GraduationCap size={20} />,
    jajan: <Coffee size={20} />,
    gaji: <Banknote size={20} />,
    bonus: <Gift size={20} />,
    darurat: <Shield size={20} />,
    lainnya: <HelpCircle size={20} />,
  };

  // Logika Fetch & Handlers (Tetap di Induk karena mengelola data Global)

  const filterByDate = (data, filter) => {
    if (filter === "semua") return data;
    const now = new Date();

    return data.filter((item) => {
      const itemDate = new Date(item.tanggal);

      if (filter === "hari_ini") {
        return itemDate.toDateString() === now.toDateString();
      }
      if (filter === "minggu_ini") {
        const currentDay = now.getDay();
        const distance = currentDay === 0 ? 6 : currentDay - 1; // Mulai dari Senin
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - distance);
        startOfWeek.setHours(0, 0, 0, 0);
        return itemDate >= startOfWeek;
      }
      if (filter === "bulan_ini") {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  };

  const fetchSemuaData = async (userId) => {
    try {
      const [resPeng, resPem] = await Promise.all([
        axios.get(
          `https://finance-smart-nine.vercel.app/api/pengeluaran/${userId}`,
        ),
        axios.get(
          `https://finance-smart-nine.vercel.app/api/pemasukan/${userId}`,
        ),
      ]);
      const dataPeng = resPeng.data.data.map((i) => ({
        ...i,
        tipe: "pengeluaran",
        judul: i.toko,
        nominal: i.total,
      }));
      const dataPem = resPem.data.data.map((i) => ({
        ...i,
        tipe: "pemasukan",
        judul: i.sumber,
        nominal: i.jumlah,
      }));

      // Simpan data mentahnya
      setRawPengeluaran(dataPeng);
      setRawPemasukan(dataPem);
    } catch (e) {
      console.error(e);
    }
  };

  // Efek ini otomatis berjalan kalau data mentah ATAU filterWaktu berubah
  useEffect(() => {
    const filteredPengeluaran = filterByDate(rawPengeluaran, filterWaktu);
    const filteredPemasukan = filterByDate(rawPemasukan, filterWaktu);

    setTotalPengeluaran(
      filteredPengeluaran.reduce((sum, item) => sum + item.nominal, 0),
    );
    setTotalPemasukan(
      filteredPemasukan.reduce((sum, item) => sum + item.nominal, 0),
    );

    const gabungan = [...filteredPengeluaran, ...filteredPemasukan].sort(
      (a, b) => new Date(b.tanggal) - new Date(a.tanggal),
    );

    setRiwayatTransaksi(gabungan);
  }, [rawPengeluaran, rawPemasukan, filterWaktu]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/login");
    const parsed = JSON.parse(user);
    setUserData(parsed);
    fetchSemuaData(parsed.id);
  }, [navigate]);

  // Handlers (Simpan, Hapus, Edit, dsb...) - Gunakan logika yang sudah kamu punya sebelumnya
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 1. Fungsi untuk menangani upload file (Scan Struk)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      setIsScanning(true);
      const response = await axios.post(
        "https://finance-smart-nine.vercel.app/api/scan",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setScannedData(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Gagal membaca struk. Pastikan gambarnya jelas ya!");
    } finally {
      setIsScanning(false);
      e.target.value = null;
    }
  };

  // 2. Fungsi untuk menyimpan data Pemasukan Baru (Manual)
  const handleSimpanPemasukan = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://finance-smart-nine.vercel.app/api/pemasukan", {
        userId: userData.id,
        sumber: formPemasukan.sumber,
        jumlah: parseInt(formPemasukan.jumlah.replace(/\./g, "")),
        kategori: formPemasukan.kategori,
      });
      alert("Pemasukan berhasil ditambah!");
      setShowPemasukanModal(false);
      setFormPemasukan({ sumber: "", jumlah: "", kategori: "Gaji" });
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan pemasukan.");
    }
  };

  const handleSimpanPengeluaranManual = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://finance-smart-nine.vercel.app/api/pengeluaran",
        {
          userId: userData.id,
          toko: formPengeluaran.toko,
          total: parseInt(formPengeluaran.total.replace(/\./g, "")),
          kategori: formPengeluaran.kategori,
          items: [], // Kosongkan karena ini input manual, bukan dari struk
        },
      );
      alert("Sip! Pengeluaran berhasil dicatat.");
      setShowPengeluaranModal(false);
      setFormPengeluaran({ toko: "", total: "", kategori: "Makan" });
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan pengeluaran.");
    }
  };

  // 3. Fungsi untuk menyimpan data Pengeluaran hasil Scan
  const handleSimpanPengeluaran = async () => {
    try {
      // Ambil data dari state scannedData
      const payload = {
        userId: userData.id,
        toko: scannedData.judul || scannedData.toko || "Toko Umum",
        total: parseInt(scannedData.nominal || scannedData.total || 0),
        kategori: scannedData.kategori || "Lainnya",
        items: scannedData.items || [],
      };

      await axios.post(
        "https://finance-smart-nine.vercel.app/api/pengeluaran",
        payload,
      );

      alert("Sip! Pengeluaran dari struk berhasil dicatat.");
      setScannedData(null);
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data scan.");
    }
  };

  // 4. Fungsi untuk Voice Record
  const handleVoiceRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browsermu belum mendukung fitur rekam suara.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setIsScanning(true);
      try {
        const res = await axios.post(
          "https://finance-smart-nine.vercel.app/api/voice",
          {
            userId: userData.id,
            text: transcript,
          },
        );
        alert(`Sip! ${res.data.tercatat.judul} berhasil dicatat!`);
        fetchSemuaData(userData.id);
      } catch (e) {
        console.error(e);
        alert("Gagal memproses suara.");
      } finally {
        setIsScanning(false);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const handleHapusTransaksi = async (id, tipe) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus transaksi ini?");
    if (!konfirmasi) return;

    try {
      // Tentukan endpoint berdasarkan tipe
      const endpoint = tipe === "pemasukan" ? "pemasukan" : "pengeluaran";

      await axios.delete(
        `https://finance-smart-nine.vercel.app/api/${endpoint}/${id}`,
      );

      alert("Transaksi berhasil dihapus!");
      // Panggil fetchSemuaData agar saldo dan list langsung update
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Waduh, gagal menghapus transaksi.");
    }
  };

  const handleSimpanEdit = async (e) => {
    e.preventDefault();
    try {
      // Bersihkan titik dari nominal (contoh: 10.000 jadi 10000)
      const angkaBersih = parseInt(
        formEdit.nominal.toString().replace(/\./g, ""),
      );
      const endpoint =
        formEdit.tipe === "pemasukan" ? "pemasukan" : "pengeluaran";

      // Sesuaikan payload dengan field di database kamu
      const payload =
        formEdit.tipe === "pemasukan"
          ? { sumber: formEdit.judul, jumlah: angkaBersih }
          : { toko: formEdit.judul, total: angkaBersih };

      await axios.put(
        `https://finance-smart-nine.vercel.app/api/${endpoint}/${formEdit.id}`,
        payload,
      );

      alert("Transaksi berhasil diperbarui!");
      setShowEditModal(false);
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error("Gagal mengubah:", error);
      alert("Maaf, gagal memperbarui transaksi.");
    }
  };

  if (!userData) return null;

  return (
    <div className="flex h-screen bg-[#f4f7fc] overflow-hidden">
      {/* 1. HEADER KHUSUS MOBILE (Fix di atas) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 ">
          <div className="bg-[#1a73e8] text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Wallet size={20} />
          </div>
          <h1 className="text-lg font-black text-[#1a73e8]">Finance Smart</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2.5 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Loading Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[110] bg-white/80 backdrop-blur flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
          <p className="font-bold text-blue-600">AI sedang memproses...</p>
        </div>
      )}

      {/* Input File Tersembunyi */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Sidebar */}
      <Sidebar
        userData={userData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleLogout={handleLogout}
        setShowPemasukanModal={setShowPemasukanModal}
        handleCameraClick={() => fileInputRef.current.click()}
        handleVoiceRecord={handleVoiceRecord}
        isListening={isListening}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* 3. KONTEN UTAMA */}
      {/* pt-20 di mobile untuk memberi jarak agar tidak tertutup header mobile */}
      <main className="flex-1 overflow-y-auto relative pt-24 lg:pt-0 custom-scrollbar">
        <div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto ">
          {activeTab === "dashboard" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* --- HEADER SAPAAN & TANGGAL --- */}
              <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                {/* Bagian Kiri: Teks Sapaan */}
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    Halo,{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      {
                        (
                          userData?.namaLengkap ||
                          userData?.name ||
                          "User"
                        ).split(" ")[0]
                      }
                    </span>
                    !
                    <span className="hover:rotate-12 hover:scale-110 transition-transform origin-bottom-right cursor-default inline-block">
                      👋
                    </span>
                  </h2>
                  <p className="text-slate-500 mt-3 font-medium flex items-center gap-2.5 w-fit bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
                    <span className="text-sm">
                      {getGreeting()}, ini ringkasan keuanganmu.
                    </span>
                  </p>
                </div>

                {/* Bagian Kanan: Filter Waktu & Badge Tanggal */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  {/* --- DROPDOWN FILTER WAKTU --- */}
                  <div className="relative group w-full sm:w-auto">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <ChevronDown
                        size={18}
                        className="text-slate-400 group-hover:text-blue-500 transition-colors"
                        strokeWidth={3}
                      />
                    </div>
                    <select
                      value={filterWaktu}
                      onChange={(e) => setFilterWaktu(e.target.value)}
                      className="w-full sm:w-auto bg-white hover:bg-slate-50 px-5 py-3.5 pr-12 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none"
                    >
                      <option value="hari_ini">Hari Ini</option>
                      <option value="minggu_ini">Minggu Ini</option>
                      <option value="bulan_ini">Bulan Ini</option>
                      <option value="semua">Semua Waktu</option>
                    </select>
                  </div>

                  {/* Badge Tanggal */}
                  <div className="hidden lg:flex items-center gap-4 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-default group">
                    <div className="bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-600 p-2.5 rounded-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
                      <Calendar size={20} strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">
                        Hari Ini
                      </p>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                        {new Date().toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <BalanceCard
                totalPemasukan={totalPemasukan}
                totalPengeluaran={totalPengeluaran}
              />

              <div className="mt-12">
                <TransactionList
                  riwayatTransaksi={riwayatTransaksi}
                  ikonKategori={ikonKategori}
                  handleBukaEdit={(i) => {
                    setFormEdit({
                      id: i.id,
                      tipe: i.tipe,
                      judul: i.judul,
                      nominal: i.nominal.toLocaleString("id-ID"),
                    });
                    setShowEditModal(true);
                  }}
                  handleHapusTransaksi={handleHapusTransaksi}
                  onTambahPemasukan={() => setShowPemasukanModal(true)}
                  onTambahPengeluaran={() => setShowPengeluaranModal(true)}
                />
              </div>
            </div>
          ) : (
            <StatistikView
              riwayatTransaksi={riwayatTransaksi}
              filterWaktu={filterWaktu}
              setFilterWaktu={setFilterWaktu}
            />
          )}
        </div>
      </main>

      {/* --- KUMPULAN MODAL (Taruh di sini satu-satu, jangan duplikat) --- */}
      {/* 1. Modal Tambah Pemasukan */}
      <PemasukanModal
        show={showPemasukanModal}
        onClose={() => setShowPemasukanModal(false)}
        form={formPemasukan}
        setForm={setFormPemasukan}
        onSubmit={handleSimpanPemasukan} // <-- Pastikan pakai handleSimpanPemasukan
      />

      <PengeluaranModal
        show={showPengeluaranModal}
        onClose={() => setShowPengeluaranModal(false)}
        form={formPengeluaran}
        setForm={setFormPengeluaran}
        onSubmit={handleSimpanPengeluaranManual}
      />

      {/* 2. Modal Edit Transaksi */}
      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        form={formEdit}
        setForm={setFormEdit}
        onSubmit={handleSimpanEdit} // <-- Ini yang akan memproses update
      />

      {/* 3. Modal Hasil Scan */}
      <ScanResultModal
        data={scannedData}
        onClose={() => setScannedData(null)}
        onSave={handleSimpanPengeluaran} // <-- Tambahkan ini agar struk bisa disimpan
      />
    </div>
  );
};

export default Dashboard;
