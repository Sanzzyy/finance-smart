import React, { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Sun,
  CloudSun,
  Moon,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const BalanceCard = ({ totalPemasukan, totalPengeluaran }) => {
  const saldo = totalPemasukan - totalPengeluaran;
  const { t } = useLanguage();

  // --- LOGIKA WAKTU DINAMIS (Tambahkan ini) ---
  const [currentTime, setCurrentTime] = useState(new Date());

  // Efek untuk mengupdate waktu setiap menit (60000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Membersihkan timer saat komponen dimatikan
    return () => clearInterval(timer);
  }, []);

  const getWaktuInfo = () => {
    const hour = currentTime.getHours();
    // Format waktu HH:mm (contoh: 09:15)
    const formattedTime = currentTime.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Tentukan Ikon dan Label berdasarkan Jam
    let timeIcon;
    let timeLabel;

    if (hour >= 5 && hour < 11) {
      // 05:00 - 10:59
      timeIcon = "🌤️"; // Kuning Pagi
      timeLabel = "Pagi Hari";
    } else if (hour >= 11 && hour < 15) {
      // 11:00 - 14:59
      timeIcon = "☀️"; // Jingga Siang
      timeLabel = "Siang Hari";
    } else if (hour >= 15 && hour < 18) {
      // 15:00 - 17:59
      timeIcon = "⛅"; // Halus Sore
      timeLabel = "Sore Hari";
    } else {
      // 18:00 - 04:59
      timeIcon = "🌙"; // Biru Terang Malam
      timeLabel = "Malam Hari";
    }

    return { formattedTime, timeIcon, timeLabel };
  };

  // Ambil data waktu hasil kalkulasi
  const { formattedTime, timeIcon, timeLabel } = getWaktuInfo();
  // ------------------------------------------

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="dash-card bg-gradient-to-tr from-[#0a46b5] via-[#1a73e8] to-[#4285f4] p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-blue-500/30 text-white relative overflow-hidden flex flex-col justify-between min-h-[280px] sm:min-h-[320px]">
        {/* Ornamen Latar Belakang */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-between flex-1">
          {/* --- BAGIAN ATAS: Judul, Saldo & WAKTU (Diedit di sini) --- */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
                <h3 className="text-blue-100 font-semibold mb-1 lg:mb-2 text-sm lg:text-base flex items-center gap-2 drop-shadow-sm truncate">
                  <Wallet size={18} className="opacity-80" strokeWidth={2.5} />
                  {t("balance.total_balance")}
                </h3>
              </div>
              <h2 className="text-4xl px-2 sm:text-5xl lg:text-[5.5rem] font-black tracking-tighter drop-shadow-md truncate">
                Rp {saldo.toLocaleString("id-ID")}
              </h2>
            </div>

            {/* --- SEKTOR WAKTU BARU (Ganti bagian Wallet lama) --- */}
            {/* Hanya muncul di desktop/MD */}
            <div className="hidden md:flex flex-col gap-2.5 items-end group">
              {/* Ikon Waktu Dinamis (Glass Box) */}
              <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center">
                {/* Bungkus timeIcon dengan span dan beri ukuran text-4xl atau 5xl */}
                <span className="text-4xl lg:text-5xl leading-none drop-shadow-md">
                  {timeIcon}
                </span>
              </div>

              {/* Label Jam & Teks (HH:mm | Pagi Hari) */}
              <div className="flex items-center gap-2 text-white/70">
                <Clock size={16} />
                <span className="text-lg font-extrabold tracking-tight text-white">
                  {formattedTime}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-50 opacity-80">
                  {timeLabel}
                </span>
              </div>
            </div>
          </div>

          {/* --- BAGIAN BAWAH: Panel Pemasukan & Pengeluaran --- */}
          <div className="mt-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-1.5 flex items-center justify-between shadow-lg">
            {/* Sektor Pemasukan */}
            <div className="flex-1 p-2 sm:p-3 lg:px-6 flex items-center gap-2 sm:gap-4 group cursor-default min-w-0">
              <div className="bg-green-400/20 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl text-green-300 group-hover:scale-110 group-hover:bg-green-400/30 transition-all duration-300 shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-blue-100 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-0.5 opacity-80 truncate">
                  {t("balance.income")}
                </p>
                <p className="font-bold text-sm sm:text-lg lg:text-2xl text-white truncate drop-shadow-sm">
                  Rp {totalPemasukan.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Garis Pemisah Vertikal Halus */}
            <div className="w-[1px] h-10 sm:h-12 bg-white/20 rounded-full shrink-0"></div>

            {/* Sektor Pengeluaran */}
            <div className="flex-1 p-2 sm:p-3 lg:px-6 flex items-center gap-2 sm:gap-4 group cursor-default min-w-0">
              <div className="bg-red-400/20 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl text-red-300 group-hover:scale-110 group-hover:bg-red-400/30 transition-all duration-300 shrink-0">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-blue-100 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-0.5 opacity-80 truncate">
                  {t("balance.expense")}
                </p>
                <p className="font-bold text-sm sm:text-lg lg:text-2xl text-white truncate drop-shadow-sm">
                  Rp {totalPengeluaran.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
