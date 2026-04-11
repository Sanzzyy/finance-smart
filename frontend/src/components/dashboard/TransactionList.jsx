import React, { useState, useEffect } from "react";
import {
  Wallet,
  Pencil,
  Trash2,
  HelpCircle,
  Plus,
  Minus,
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
  Shield,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
} from "lucide-react";

const TransactionList = ({
  riwayatTransaksi,
  isLoading,
  handleBukaEdit,
  handleHapusTransaksi,
  onTambahPemasukan,
  onTambahPengeluaran,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const itemsPerPage = 5;

  const daftarKategori = [
    { id: "semua", label: "Semua", emoji: "⭐" },
    { id: "makan", label: "Makan", emoji: "🍽️" },
    { id: "transportasi", label: "Transportasi", emoji: "🚗" },
    { id: "belanja", label: "Belanja", emoji: "🛍️" },
    { id: "tagihan", label: "Tagihan", emoji: "📄" },
    { id: "hiburan", label: "Hiburan", emoji: "🎮" },
    { id: "gaji", label: "Gaji", emoji: "💰" },
    { id: "jajan", label: "Jajan", emoji: "☕" },
    { id: "kesehatan", label: "Kesehatan", emoji: "🏥" },
    { id: "darurat", label: "Darurat", emoji: "🛡️" },
  ];

  // Efek Pencarian: Filter data secara real-time berdasarkan kategori terpilih
  const filteredData = riwayatTransaksi.filter((item) => {
    if (selectedCategory === "semua") return true;
    return item.kategori?.toLowerCase() === selectedCategory;
  });

  // Reset page ke 1 kalau data transaksi berubah (misal ganti filter atau pilih kategori)
  useEffect(() => {
    setCurrentPage(1);
  }, [riwayatTransaksi.length, selectedCategory]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

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

  // Komponen Loading Skeleton (Shimmer Effect)
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(itemsPerPage)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-slate-700 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
              <div className="w-20 h-3 bg-gray-100 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
          <div className="w-24 h-5 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="dash-card bg-white dark:bg-slate-800 p-5 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
      {/* --- HEADER TRANSAKSI & CATEGORY PILLS --- */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-8 border-b border-slate-50 dark:border-slate-700 pb-8">
        <div className="w-full xl:w-auto">
          <h3 className="text-slate-800 dark:text-white font-black text-2xl tracking-tight">
            Riwayat Transaksi
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 font-medium pb-4 xl:pb-0">
            Daftar aktivitas keuangan terbarumu
          </p>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto shrink-0">
          {/* --- SELECTOR KATEGORI (DROPDOWN) --- */}
          <div className="relative group w-full xl:flex-1 max-w-xs">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <ChevronDown
                size={18}
                className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors"
                strokeWidth={3}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 px-5 py-3.5 pr-12 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all focus:ring-0 text-sm font-bold text-slate-700 dark:text-white outline-none cursor-pointer appearance-none hover:border-blue-400 dark:hover:border-blue-500"
            >
              {daftarKategori.map((kat) => (
                <option
                  key={kat.id}
                  value={kat.id}
                  className="dark:bg-slate-800"
                >
                  {kat.emoji} {kat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Pemasukan */}
          <button
            onClick={onTambahPemasukan}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 border border-emerald-100 dark:border-emerald-500/20 hover:border-emerald-500 group shadow-sm active:scale-95"
          >
            <Plus
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              strokeWidth={3}
            />
            <span>Pemasukan</span>
          </button>

          {/* Tombol Pengeluaran */}
          <button
            onClick={onTambahPengeluaran}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 border border-rose-100 dark:border-rose-500/20 hover:border-rose-500 group shadow-sm active:scale-95"
          >
            <Minus
              className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300"
              strokeWidth={3}
            />
            <span>Pengeluaran</span>
          </button>
        </div>
      </div>

      <div className="mt-2 min-h-[460px]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20 border-t border-gray-50 dark:border-slate-700 mt-4 h-full flex flex-col items-center justify-center">
            <div className="bg-slate-50 dark:bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110">
              <Wallet
                size={32}
                className="text-slate-300 dark:text-slate-500"
              />
            </div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-lg">
              {selectedCategory !== "semua"
                ? `Tidak ada transaksi di kategori ${selectedCategory}`
                : "Belum ada transaksi"}
            </p>
            {selectedCategory !== "semua" && (
              <button
                onClick={() => setSelectedCategory("semua")}
                className="mt-4 text-blue-500 dark:text-blue-400 font-bold text-sm hover:underline"
              >
                Tampilkan semua kategori
              </button>
            )}
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col sm:flex-row sm:justify-between sm:items-center py-5 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-all px-3 rounded-2xl gap-3 sm:gap-0"
            >
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                <div
                  className={`p-4 rounded-full shrink-0 transition-transform group-hover:scale-110 ${item.tipe === "pemasukan" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"}`}
                >
                  {ikonKategori[item.kategori?.toLowerCase()] || (
                    <HelpCircle size={20} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-slate-800 dark:text-white text-base capitalize tracking-tight">
                      {item.judul}
                    </p>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider transition-colors ${item.tipe === "pemasukan" ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" : "bg-rose-50 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-500/30"}`}
                    >
                      {item.tipe}
                    </span>
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-medium">
                    {new Date(item.tanggal).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-[4.5rem] sm:pl-0">
                <p
                  className={`font-black text-lg tracking-tight ${item.tipe === "pemasukan" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                  {item.tipe === "pemasukan" ? "+" : "-"} Rp{" "}
                  {item.nominal.toLocaleString("id-ID")}
                </p>
                <div className="flex opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all gap-1 translate-x-2 group-hover:translate-x-0">
                  <button
                    onClick={() => handleBukaEdit(item)}
                    title="Ubah Transaksi"
                    className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all active:scale-90"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleHapusTransaksi(item.id, item.tipe)}
                    title="Hapus Transaksi"
                    className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* --- PAGINATION CONTROLS --- */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-10 pt-6 border-t border-slate-50 dark:border-slate-700 gap-5">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
              Data Ke{" "}
              <span className="text-slate-800 dark:text-slate-200">
                {startIndex + 1} - {Math.min(endIndex, filteredData.length)}
              </span>{" "}
              Dari{" "}
              <span className="text-slate-800 dark:text-slate-200">
                {filteredData.length}
              </span>{" "}
              Trx
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>

              <div className="flex items-center gap-1.5 mx-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-2xl text-xs font-black transition-all transform ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                        : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
