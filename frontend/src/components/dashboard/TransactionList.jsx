import React from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Pencil,
  Trash2,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";

const TransactionList = ({
  riwayatTransaksi,
  ikonKategori,
  handleBukaEdit,
  handleHapusTransaksi,
  onTambahPemasukan,
  onTambahPengeluaran,
}) => {
  return (
    <div className="dash-card bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
      {/* --- HEADER TRANSAKSI & TOMBOL MANUAL --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5 border-b border-slate-50 pb-6">
        <div>
          <h3 className="text-slate-800 font-black text-2xl tracking-tight">
            Riwayat Transaksi
          </h3>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Daftar aktivitas keuangan terbarumu
          </p>
        </div>

        {/* Tombol Input Manual Contextual */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onTambahPemasukan}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-5 py-3 rounded-2xl font-bold transition-all duration-300 border border-emerald-100 hover:border-emerald-500 group shadow-sm"
          >
            <Plus
              size={18}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Pemasukan
          </button>
          <button
            onClick={onTambahPengeluaran}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-5 py-3 rounded-2xl font-bold transition-all duration-300 border border-rose-100 hover:border-rose-500 group shadow-sm"
          >
            <Minus
              size={18}
              strokeWidth={3}
              className="group-hover:-rotate-90 transition-transform duration-300"
            />
            Pengeluaran
          </button>
        </div>
      </div>

      <div className="mt-2">
        {riwayatTransaksi.length === 0 ? (
          <div className="text-center py-12 border-t border-gray-50 mt-4">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wallet size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Belum ada transaksi</p>
          </div>
        ) : (
          riwayatTransaksi.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2 gap-3 sm:gap-0"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-5">
                <div
                  className={`p-4 rounded-full shrink-0 ${item.tipe === "pemasukan" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {ikonKategori[item.kategori?.toLowerCase()] || (
                    <HelpCircle size={20} />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-[#1f2937] text-base capitalize">
                      {item.judul}
                    </p>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${item.tipe === "pemasukan" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-500 border border-red-100"}`}
                    >
                      {item.tipe}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(item.tanggal).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-[3.25rem] sm:pl-0">
                <p
                  className={`font-bold text-base ${item.tipe === "pemasukan" ? "text-green-600" : "text-red-500"}`}
                >
                  {item.tipe === "pemasukan" ? "+" : "-"} Rp{" "}
                  {item.nominal.toLocaleString("id-ID")}
                </p>
                <div className="flex opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity gap-1 shrink-0">
                  <button
                    onClick={() => handleBukaEdit(item)}
                    className="p-2 text-gray-400 hover:text-[#1a73e8] hover:bg-blue-100 rounded-xl transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleHapusTransaksi(item.id, item.tipe)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
