import React from "react";
import { Sparkles } from "lucide-react";

export const PemasukanModal = ({ show, onClose, form, setForm, onSubmit }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
      >
        <h2 className="text-slate-800 text-2xl font-black mb-6">
          Catat Pemasukan
        </h2>

        <div className="space-y-5 mb-8">
          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Sumber Dana
            </label>
            <input
              required
              type="text"
              value={form.sumber}
              onChange={(e) => setForm({ ...form, sumber: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium text-slate-700"
              placeholder="Contoh: Gaji bulanan, Freelance..."
            />
          </div>

          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Jumlah (Rp)
            </label>
            <input
              required
              type="text"
              value={form.jumlah}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setForm({
                  ...form,
                  jumlah: val ? parseInt(val).toLocaleString("id-ID") : "",
                });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-black text-xl text-emerald-600"
              placeholder="Nominal"
            />
          </div>

          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium text-slate-700 cursor-pointer appearance-none"
            >
              <option value="Gaji">Gaji 💰</option>
              <option value="Bonus">Bonus 🎁</option>
              <option value="Jajan">Jajan ☕</option>
              <option value="Darurat">Darurat 🛡️</option>
              <option value="Lainnya">Lainnya ❓</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Simpan Pemasukan
          </button>
        </div>
      </form>
    </div>
  );
};

export const PengeluaranModal = ({
  show,
  onClose,
  form,
  setForm,
  onSubmit,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
      >
        <h2 className="text-slate-800 text-2xl font-black mb-6">
          Catat Pengeluaran
        </h2>
        <div className="space-y-5 mb-8">
          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Nama Toko / Keperluan
            </label>
            <input
              required
              type="text"
              value={form.toko}
              onChange={(e) => setForm({ ...form, toko: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-slate-700"
              placeholder="Contoh: Indomaret, Bakso, Bensin..."
            />
          </div>
          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Total (Rp)
            </label>
            <input
              required
              type="text"
              value={form.total}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setForm({
                  ...form,
                  total: val ? parseInt(val).toLocaleString("id-ID") : "",
                });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-black text-xl text-rose-600"
              placeholder="Nominal"
            />
          </div>
          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-slate-700 cursor-pointer appearance-none"
            >
              <option value="Makan">Makan 🍽️</option>
              <option value="Transportasi">Transportasi 🚗</option>
              <option value="Belanja">Belanja 🛍️</option>
              <option value="Tagihan">Tagihan 📄</option>
              <option value="Jajan">Jajan ☕</option>
              <option value="Lainnya">Lainnya ❓</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-[2] bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
          >
            Simpan Pengeluaran
          </button>
        </div>
      </form>
    </div>
  );
};

export const EditModal = ({ show, onClose, form, setForm, onSubmit }) => {
  if (!show) return null;

  const isPemasukan = form.tipe === "pemasukan";
  
  const kategoriPemasukan = [
    { val: "Gaji", label: "Gaji 💰" },
    { val: "Bonus", label: "Bonus 🎁" },
    { val: "Jajan", label: "Jajan ☕" },
    { val: "Darurat", label: "Darurat 🛡️" },
    { val: "Lainnya", label: "Lainnya ❓" },
  ];
  
  const kategoriPengeluaran = [
    { val: "Makan", label: "Makan 🍽️" },
    { val: "Transportasi", label: "Transportasi 🚗" },
    { val: "Belanja", label: "Belanja 🛍️" },
    { val: "Tagihan", label: "Tagihan 📄" },
    { val: "Jajan", label: "Jajan ☕" },
    { val: "Lainnya", label: "Lainnya ❓" },
  ];

  const kategoriOptions = isPemasukan ? kategoriPemasukan : kategoriPengeluaran;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
      >
        <h2 className="text-slate-800 text-2xl font-black mb-6">
          Ubah Transaksi
        </h2>
        
        <div className="space-y-5 mb-8">
          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Keterangan
            </label>
            <input
              required
              type="text"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 transition-all font-medium text-slate-700 ${isPemasukan ? 'focus:ring-emerald-500/30 focus:border-emerald-500' : 'focus:ring-rose-500/30 focus:border-rose-500'}`}
              placeholder="Keterangan transaksi"
            />
          </div>

          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Nominal (Rp)
            </label>
            <input
              required
              type="text"
              value={form.nominal}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setForm({
                  ...form,
                  nominal: val ? parseInt(val).toLocaleString("id-ID") : "",
                });
              }}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 transition-all font-black text-xl ${isPemasukan ? 'text-emerald-600 focus:ring-emerald-500/30 focus:border-emerald-500' : 'text-rose-600 focus:ring-rose-500/30 focus:border-rose-500'}`}
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 transition-all font-medium text-slate-700 cursor-pointer appearance-none ${isPemasukan ? 'focus:ring-emerald-500/30 focus:border-emerald-500' : 'focus:ring-rose-500/30 focus:border-rose-500'}`}
            >
              {kategoriOptions.map(opt => (
                <option key={opt.val} value={opt.val}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            className={`flex-[2] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all ${isPemasukan ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}`}
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

// Di dalam Allmodals.jsx bagian ScanResultModal
export const ScanResultModal = ({ data, onClose, onSave }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col max-h-[85vh]">
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <Sparkles size={24} />
          </div>
          <h2 className="text-gray-800 text-2xl font-bold">
            Hasil Scan Detail
          </h2>
        </div>

        {/* AREA SCROLLABLE UNTUK RINCIAN BARANG */}
        <div className="flex-1 overflow-y-auto pr-2 mb-6 custom-scrollbar">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-4">
            <p className="text-gray-400 text-[10px] font-black uppercase mb-1">
              Toko
            </p>
            <p className="font-bold text-gray-800 text-lg">
              {data.toko || data.judul}
            </p>
          </div>

          <p className="text-gray-400 text-[10px] font-black uppercase mb-3 ml-1">
            Rincian Belanja
          </p>
          <div className="space-y-2">
            {data.items &&
              data.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm"
                >
                  <span className="text-sm text-gray-600 font-medium">
                    {item.nama}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    Rp {item.harga?.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* TOTAL TETAP DI BAWAH (STICKY) */}
        <div className="bg-blue-600 p-6 rounded-3xl flex justify-between items-center shadow-lg shadow-blue-500/30 mb-6 shrink-0">
          <p className="text-blue-100 font-bold">Total Akhir</p>
          <p className="text-white font-black text-2xl">
            Rp {(data.total || data.nominal)?.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(data)}
            className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20"
          >
            Simpan & Catat
          </button>
        </div>
      </div>
    </div>
  );
};
