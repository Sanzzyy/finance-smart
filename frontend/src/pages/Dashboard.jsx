import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Loader2, Menu, Wallet, Calendar, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

// Komponen Tampilan
import Sidebar from "../components/dashboard/Sidebar";
import BalanceCard from "../components/dashboard/BalanceCard";
import TransactionList from "../components/dashboard/TransactionList";
import StatistikView from "../components/dashboard/StatistikView";
import {
  PemasukanModal,
  PengeluaranModal,
  EditModal,
  ScanResultModal,
  KemampuanBeliModal,
} from "../components/modals/Allmodals";

// Hooks
import { useDashboardData } from "../hooks/useDashboardData";
import { useTransactions } from "../hooks/useTransactions";
import { useSmartFeatures } from "../hooks/useSmartFeatures";
import { useLanguage } from "../context/LanguageContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  // Layout & UI States
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [showKemampuanModal, setShowKemampuanModal] = useState(false);

  // Efek Dark Mode Setting
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Efek Autentikasi Pengguna
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/login");
    setUserData(JSON.parse(user));
  }, [navigate]);

  // Efek Intercept Tombol Back (Kembali) di Browser / HP
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return; // Jangan trap jika memang belum login

    // Menyuntikkan history palsu (dummy state)
    // agar tombol back tidak langsung membuang user dari halaman.
    window.history.pushState(null, null, window.location.pathname);

    const handlePopState = async () => {
      const konfirmasi = await Swal.fire({
        title: t("dashboard.logout_confirm_title"),
        text: t("dashboard.logout_confirm_text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#94a3b8",
        confirmButtonText: t("dashboard.btn_yes_logout"),
        cancelButtonText: t("dashboard.btn_cancel"),
      });

      if (konfirmasi.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      } else {
        // Jika batal keluar, suntikkan lagi state palsu agar jebakan back-nya aktif lagi
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, t]);

  // Ekstraksi Logika Bisnis Lewat Custom Hooks
  const {
    rawPemasukan,
    rawPengeluaran,
    filterWaktu,
    setFilterWaktu,
    totalPemasukan,
    totalPengeluaran,
    riwayatTransaksi,
    fetchSemuaData,
    isLoading,
  } = useDashboardData(userData);

  const {
    showPemasukanModal,
    setShowPemasukanModal,
    formPemasukan,
    setFormPemasukan,
    handleSimpanPemasukan,
    showPengeluaranModal,
    setShowPengeluaranModal,
    formPengeluaran,
    setFormPengeluaran,
    handleSimpanPengeluaranManual,
    showEditModal,
    setShowEditModal,
    formEdit,
    setFormEdit,
    handleSimpanEdit,
    handleHapusTransaksi,
  } = useTransactions(userData, fetchSemuaData);

  const {
    isScanning,
    scannedData,
    setScannedData,
    isListening,
    handleFileChange,
    handleSimpanPengeluaranScan,
    handleVoiceRecord,
  } = useSmartFeatures(userData, fetchSemuaData);

  // === UI Helpers ===
  const handleLogout = async () => {
    const konfirmasi = await Swal.fire({
      title: t("dashboard.logout_confirm_title"),
      text: t("dashboard.logout_confirm_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("dashboard.btn_yes_logout"),
      cancelButtonText: t("dashboard.btn_cancel"),
    });

    if (konfirmasi.isConfirmed) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.good_morning");
    if (hour < 15) return t("dashboard.good_afternoon");
    if (hour < 18) return t("dashboard.good_evening");
    return t("dashboard.good_night");
  };

  const getFilterLabel = () => {
    switch (filterWaktu) {
      case "hari_ini":
        return t("dashboard.today");
      case "minggu_ini":
        return t("dashboard.this_week");
      case "bulan_ini":
        return t("dashboard.this_month");
      case "tahun_ini":
        return t("dashboard.this_year");
      default:
        return t("dashboard.this_month");
    }
  };

  const getFilterDateText = () => {
    const now = new Date();
    if (filterWaktu === "hari_ini") {
      return now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }
    if (filterWaktu === "minggu_ini") {
      const currentDay = now.getDay();
      const distance = currentDay === 0 ? 6 : currentDay - 1;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - distance);
      return `${startOfWeek.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - ${now.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`;
    }
    if (filterWaktu === "bulan_ini") {
      return now.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    }
    return t("dashboard.all_history");
  };

  if (!userData) return null;

  return (
    <div className="flex h-screen bg-[#f4f7fc] dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      {/* HEADER KHUSUS MOBILE */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 z-40 px-6 flex justify-between items-center transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-[#1a73e8] text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Wallet size={20} />
          </div>
          <h1 className="text-lg font-black text-[#1a73e8] dark:text-blue-400">
            Finance Smart
          </h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* OVERLAY LOADING AI SCANNER */}
      {isScanning && (
        <div className="fixed inset-0 z-[110] bg-white/80 dark:bg-slate-900/80 backdrop-blur flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 dark:text-blue-400 w-12 h-12" />
          <p className="font-bold text-blue-600 dark:text-blue-400 mt-4">
            AI sedang memproses...
          </p>
        </div>
      )}

      {/* INPUT FILE CAMERA TERSEMBUNYI */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* KOMPONEN SIDEBAR */}
      <Sidebar
        userData={userData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleLogout={handleLogout}
        onTambahPemasukan={() => setShowPemasukanModal(true)}
        onTambahPengeluaran={() => setShowPengeluaranModal(true)}
        handleCameraClick={() => fileInputRef.current.click()}
        handleVoiceRecord={handleVoiceRecord}
        isListening={isListening}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenKemampuan={() => setShowKemampuanModal(true)}
      />

      {/* KONTEN UTAMA */}
      <main className="flex-1 overflow-y-auto relative pt-24 lg:pt-0 custom-scrollbar">
        <div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto">
          {activeTab === "dashboard" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* HEADER WAKTU & SAPAAN */}
              <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3 transition-colors duration-300">
                    {getGreeting()},{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
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
                  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium flex items-center gap-2.5 w-fit bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200/60 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <span className="text-sm">
                      {t("dashboard.summary_title")}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <div className="relative group w-full sm:w-auto">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <ChevronDown
                        size={18}
                        className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors"
                        strokeWidth={3}
                      />
                    </div>
                    <select
                      value={filterWaktu}
                      onChange={(e) => setFilterWaktu(e.target.value)}
                      className="w-full sm:w-auto bg-white dark:bg-slate-800 px-5 py-3.5 pr-12 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all focus:ring-0 text-sm font-bold text-slate-700 dark:text-white outline-none cursor-pointer appearance-none"
                    >
                      <option value="hari_ini">{t("dashboard.today")}</option>
                      <option value="minggu_ini">{t("dashboard.this_week")}</option>
                      <option value="bulan_ini">{t("dashboard.this_month")}</option>
                      <option value="semua">{t("dashboard.all_time")}</option>
                    </select>
                  </div>

                  <div className="hidden lg:flex items-center gap-4 bg-white dark:bg-slate-800 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-default group">
                    <div className="bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-100 text-blue-600 dark:text-blue-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                      <Calendar size={20} strokeWidth={2.5} />
                    </div>
                    <div className="text-right transition-colors duration-300">
                      <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em] mb-0.5">
                        {getFilterLabel()}
                      </p>
                      <p className="text-sm font-bold text-slate-700 dark:text-white transition-colors">
                        {getFilterDateText()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD RINGKASAN */}
              <BalanceCard
                totalPemasukan={totalPemasukan}
                totalPengeluaran={totalPengeluaran}
              />

              {/* LIST TRANSAKSI */}
              <TransactionList
                riwayatTransaksi={riwayatTransaksi}
                isLoading={isLoading}
                handleHapusTransaksi={handleHapusTransaksi}
                onTambahPemasukan={() => setShowPemasukanModal(true)}
                onTambahPengeluaran={() => setShowPengeluaranModal(true)}
                handleBukaEdit={(transaksi) => {
                  setFormEdit({
                    id: transaksi.id,
                    tipe: transaksi.tipe,
                    judul: transaksi.judul || transaksi.toko,
                    nominal: transaksi.nominal || transaksi.total,
                    kategori: transaksi.kategori || "Lainnya",
                  });
                  setShowEditModal(true);
                }}
              />
            </div>
          ) : (
            <StatistikView
              riwayatTransaksi={riwayatTransaksi}
              filterWaktu={filterWaktu}
              setFilterWaktu={setFilterWaktu}
            />
          )}

          {/* WATERMARK FOOTER */}
          <div className="mt-12 mb-6 text-center">
            <p className="text-sm font-bold text-slate-400 dark:text-slate-600">
              Finance Smart © 2026
            </p>
          </div>
        </div>
      </main>

      {/* SEMUA MODALS */}
      <PemasukanModal
        show={showPemasukanModal}
        onClose={() => setShowPemasukanModal(false)}
        form={formPemasukan}
        setForm={setFormPemasukan}
        onSubmit={handleSimpanPemasukan}
      />
      <PengeluaranModal
        show={showPengeluaranModal}
        onClose={() => setShowPengeluaranModal(false)}
        form={formPengeluaran}
        setForm={setFormPengeluaran}
        onSubmit={handleSimpanPengeluaranManual}
      />
      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        form={formEdit}
        setForm={setFormEdit}
        onSubmit={handleSimpanEdit}
      />
      <ScanResultModal
        data={scannedData}
        onClose={() => setScannedData(null)}
        onSave={handleSimpanPengeluaranScan}
      />
      <KemampuanBeliModal
        show={showKemampuanModal}
        onClose={() => setShowKemampuanModal(false)}
        userId={userData?.id}
        saldo={totalPemasukan - totalPengeluaran}
        rataPengeluaran={totalPengeluaran}
      />
    </div>
  );
};

export default Dashboard;
