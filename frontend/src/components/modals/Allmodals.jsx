import React from "react";
import { Sparkles, X, Bot, Mic, Loader2, Send } from "lucide-react";

export const PemasukanModal = ({ show, onClose, form, setForm, onSubmit }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 transition-colors">
      <form
        onSubmit={onSubmit}
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 transition-colors"
      >
        <h2 className="text-slate-800 dark:text-white text-2xl font-black mb-6">
          Catat Pemasukan
        </h2>

        <div className="space-y-5 mb-8">
          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Sumber Dana
            </label>
            <input
              required
              type="text"
              value={form.sumber}
              onChange={(e) => setForm({ ...form, sumber: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium text-slate-700 dark:text-white"
              placeholder="Contoh: Gaji bulanan, Freelance..."
            />
          </div>

          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
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
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-black text-xl text-emerald-600 dark:text-emerald-400"
              placeholder="Nominal"
            />
          </div>

          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium text-slate-700 dark:text-white cursor-pointer appearance-none"
            >
              <option value="Gaji" className="dark:bg-slate-800">
                Gaji 💰
              </option>
              <option value="Bonus" className="dark:bg-slate-800">
                Bonus 🎁
              </option>
              <option value="Jajan" className="dark:bg-slate-800">
                Jajan ☕
              </option>
              <option value="Darurat" className="dark:bg-slate-800">
                Darurat 🛡️
              </option>
              <option value="Lainnya" className="dark:bg-slate-800">
                Lainnya ❓
              </option>
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
    <div className="fixed inset-0 z-[100] bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 transition-colors">
      <form
        onSubmit={onSubmit}
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 transition-colors"
      >
        <h2 className="text-slate-800 dark:text-white text-2xl font-black mb-6">
          Catat Pengeluaran
        </h2>
        <div className="space-y-5 mb-8">
          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Nama Toko / Keperluan
            </label>
            <input
              required
              type="text"
              value={form.toko}
              onChange={(e) => setForm({ ...form, toko: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-slate-700 dark:text-white"
              placeholder="Contoh: Indomaret, Bakso, Bensin..."
            />
          </div>
          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
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
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-black text-xl text-rose-600 dark:text-rose-400"
              placeholder="Nominal"
            />
          </div>
          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-slate-700 dark:text-white cursor-pointer appearance-none"
            >
              <option value="Makan" className="dark:bg-slate-800">
                Makan 🍽️
              </option>
              <option value="Transportasi" className="dark:bg-slate-800">
                Transportasi 🚗
              </option>
              <option value="Belanja" className="dark:bg-slate-800">
                Belanja 🛍️
              </option>
              <option value="Tagihan" className="dark:bg-slate-800">
                Tagihan 📄
              </option>
              <option value="Jajan" className="dark:bg-slate-800">
                Jajan ☕
              </option>
              <option value="Lainnya" className="dark:bg-slate-800">
                Lainnya ❓
              </option>
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
    <div className="fixed inset-0 z-[100] bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 transition-colors">
      <form
        onSubmit={onSubmit}
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 transition-colors"
      >
        <h2 className="text-slate-800 dark:text-white text-2xl font-black mb-6">
          Ubah Transaksi
        </h2>

        <div className="space-y-5 mb-8">
          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Keterangan
            </label>
            <input
              required
              type="text"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className={`w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 transition-all font-medium text-slate-700 dark:text-white ${isPemasukan ? "focus:ring-emerald-500/30 focus:border-emerald-500" : "focus:ring-rose-500/30 focus:border-rose-500"}`}
              placeholder="Keterangan transaksi"
            />
          </div>

          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
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
              className={`w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 transition-all font-black text-xl ${isPemasukan ? "text-emerald-600 dark:text-emerald-400 focus:ring-emerald-500/30 focus:border-emerald-500" : "text-rose-600 dark:text-rose-400 focus:ring-rose-500/30 focus:border-rose-500"}`}
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-slate-500 dark:text-slate-400 text-[10px] font-black mb-2 block uppercase tracking-widest">
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className={`w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-4 focus:ring-2 transition-all font-medium text-slate-700 dark:text-white cursor-pointer appearance-none ${isPemasukan ? "focus:ring-emerald-500/30 focus:border-emerald-500" : "focus:ring-rose-500/30 focus:border-rose-500"}`}
            >
              {kategoriOptions.map((opt) => (
                <option
                  key={opt.val}
                  value={opt.val}
                  className="dark:bg-slate-800"
                >
                  {opt.label}
                </option>
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
            className={`flex-[2] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all ${isPemasukan ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"}`}
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
    <div className="fixed inset-0 z-[100] bg-gray-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col max-h-[85vh] transition-colors">
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-3 rounded-full">
            <Sparkles size={24} />
          </div>
          <h2 className="text-gray-800 dark:text-white text-2xl font-bold">
            Hasil Scan Detail
          </h2>
        </div>

        {/* AREA SCROLLABLE UNTUK RINCIAN BARANG */}
        <div className="flex-1 overflow-y-auto pr-2 mb-6 custom-scrollbar">
          <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-600/50 mb-4">
            <p className="text-gray-400 dark:text-slate-400 text-[10px] font-black uppercase mb-1">
              Toko
            </p>
            <p className="font-bold text-gray-800 dark:text-white text-lg">
              {data.toko || data.judul}
            </p>
          </div>

          <p className="text-gray-400 dark:text-slate-400 text-[10px] font-black uppercase mb-3 ml-1">
            Rincian Belanja
          </p>
          <div className="space-y-2">
            {data.items &&
              data.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600/50 rounded-xl shadow-sm"
                >
                  <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">
                    {item.nama}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">
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

export const KemampuanBeliModal = ({
  show,
  onClose,
  userId,
  saldo,
  rataPengeluaran,
}) => {
  const [text, setText] = React.useState("");
  const [isListening, setIsListening] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState(null); // { status: "bisa" | "tidak", pesan: "..." }

  React.useEffect(() => {
    if (result && result.status?.toLowerCase() === "tidak") {
      const audio = new Audio("/audio/dame_yo.mp3");
      audio.play().catch((e) => console.log("Audio error:", e));
    }
  }, [result]);

  if (!show) return null;

  const handleVoiceRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser kamu belum mendukung fitur rekam suara.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { default: api } = await import("../../api/axiosInstance.js");
      const res = await api.post("/api/kemampuan-beli", {
        userId,
        text,
        saldo,
        rataPengeluaran,
      });
      setResult(res.data.data);
    } catch (error) {
      console.error(error);
      setResult({
        status: "tidak",
        pesan: "Maaf, Asisten AI sedang sibuk atau ada masalah jaringan.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <X size={24} className="text-slate-400" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
            <Bot size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Cek Kemampuan Beli
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              AI Financial Planner
            </p>
          </div>
        </div>

        {/* INFO SALDO CURRENT */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6 gap-2">
          <div className="flex flex-col w-1/2">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">
              Saldo Saat Ini
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
              Rp {saldo?.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex flex-col text-right w-1/2">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">
              Rata Pengeluaran
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
              Rp {rataPengeluaran?.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tanya AI: 'Gua mau beli RAM 700ribu bulan depan bisa gak?'"
            className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 pb-14 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium text-slate-700 dark:text-white resize-none"
            rows="3"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`p-2.5 rounded-xl transition-all ${isListening ? "bg-red-100 text-red-500 animate-pulse" : "bg-white dark:bg-slate-600 text-slate-400 hover:text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-500"}`}
              title="Rekam Suara"
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="p-2.5 bg-indigo-500 text-white rounded-xl shadow-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>

        {/* HASIL / JAWABAN AI */}
        {result && (
          <div
            className={`p-4 rounded-2xl border animate-in slide-in-from-bottom-4 duration-300 ${result.status?.toLowerCase() === "bisa" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30" : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30"}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${result.status?.toLowerCase() === "bisa" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"}`}
              >
                {result.status?.toUpperCase() || "INFO"}
              </span>
            </div>
            {/* Scroll HANYA disini */}
            <div className="max-h-[160px] overflow-y-auto custom-scrollbar pr-2 pb-1">
              <div className="text-[13px] font-medium leading-relaxed dark:text-slate-200 text-slate-700 whitespace-pre-wrap">
                {result.pesan}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
