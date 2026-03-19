import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Activity } from "lucide-react";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#64748b",
];

const StatistikView = ({ riwayatTransaksi, filterWaktu, setFilterWaktu }) => {
  // 1. LOGIKA UNTUK PIE CHART (Kategori Pengeluaran)
  const dataPengeluaran = riwayatTransaksi.filter(
    (t) => t.tipe === "pengeluaran",
  );

  const statistikKategori = dataPengeluaran.reduce((acc, curr) => {
    acc[curr.kategori] = (acc[curr.kategori] || 0) + curr.nominal;
    return acc;
  }, {});

  const dataStatistik = Object.keys(statistikKategori)
    .map((key) => ({ name: key, value: statistikKategori[key] }))
    .sort((a, b) => b.value - a.value);

  const totalPengeluaran = dataStatistik.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  // 2. LOGIKA UNTUK AREA CHART (Tren Harian)
  const prepareTrendData = () => {
    const grouped = {};

    // Kelompokkan pengeluaran berdasarkan tanggal
    dataPengeluaran.forEach((item) => {
      const dateObj = new Date(item.tanggal);
      // Format tanggal: "12 Mar"
      const dateStr = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });

      if (!grouped[dateStr]) {
        grouped[dateStr] = { tanggalAsli: dateObj, tanggal: dateStr, total: 0 };
      }
      grouped[dateStr].total += item.nominal;
    });

    // Ubah jadi array dan urutkan dari tanggal terlama ke terbaru (kiri ke kanan)
    return Object.values(grouped).sort((a, b) => a.tanggalAsli - b.tanggalAsli);
  };

  const trendData = prepareTrendData();

  // --- CUSTOM TOOLTIP UNTUK AREA CHART ---
  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
            {label}
          </p>
          <p className="text-rose-600 font-black text-lg">
            Rp {payload[0].value.toLocaleString("id-ID")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- HEADER --- */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Analisis Pengeluaran
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Ringkasan alokasi dana dan tren belanjamu.
          </p>
        </div>

        {/* --- DROPDOWN FILTER WAKTU (Persis seperti di Dashboard) --- */}
        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors shrink-0">
          <select
            value={filterWaktu}
            onChange={(e) => setFilterWaktu(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-4"
          >
            <option value="hari_ini">Hari Ini</option>
            <option value="minggu_ini">Minggu Ini</option>
            <option value="bulan_ini">Bulan Ini</option>
            <option value="semua">Semua Waktu</option>
          </select>
        </div>
      </div>

      {/* --- BARIS 1: KARTU RINGKASAN --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
            Total Pos Kategori
          </p>
          <p className="text-3xl font-black text-blue-600 flex items-baseline gap-2">
            {dataStatistik.length}{" "}
            <span className="text-sm text-slate-400 font-bold">Pos</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
            Pengeluaran Terbesar
          </p>
          <p className="text-3xl font-black text-rose-500 truncate">
            {dataStatistik[0]?.name || "-"}
          </p>
        </div>
      </div>

      {/* --- BARIS 2: DONUT CHART & RINCIAN (Yang sudah kamu buat) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Donut Chart */}
        <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[350px]">
          <h3 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-blue-500" /> Persentase Alokasi
          </h3>
          {dataStatistik.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
              Belum ada data pengeluaran.
            </div>
          ) : (
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataStatistik}
                    innerRadius="60%"
                    outerRadius="90%"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {dataStatistik.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Total
                </span>
                <span className="text-slate-800 font-black text-xl">
                  Rp {(totalPengeluaran / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Rincian Pos */}
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] max-h-[350px] flex flex-col">
          <h3 className="text-slate-800 font-bold text-lg mb-6">Rincian Pos</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
            {dataStatistik.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-bold text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-800">
                    Rp {item.value.toLocaleString("id-ID")}
                  </span>
                </div>
                {/* Progress Bar Kecil */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.value / totalPengeluaran) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- BARIS 3: AREA CHART (TREN HARIAN FULL WIDTH) --- */}
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 text-rose-500 p-2.5 rounded-xl">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-slate-800 font-black text-xl tracking-tight">
                Tren Pengeluaran Harian
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                Pantau lonjakan belanjamu dari waktu ke waktu.
              </p>
            </div>
          </div>
        </div>

        {trendData.length === 0 ? (
          <div className="h-[300px] w-full flex items-center justify-center text-slate-400 font-medium bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            Data tren belum tersedia.
          </div>
        ) : (
          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* Gradien Warna untuk grafik area */}
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                {/* Garis bantu horizontal */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                {/* Sumbu X (Tanggal) */}
                <XAxis
                  dataKey="tanggal"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                  dy={10}
                  minTickGap={20}
                />
                {/* Sumbu Y (Nominal) - Disingkat jadi 'k' atau 'jt' agar tidak kepanjangan */}
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                  tickFormatter={(val) => {
                    if (val >= 1000000)
                      return `Rp${(val / 1000000).toFixed(1)}jt`;
                    if (val >= 1000) return `Rp${val / 1000}k`;
                    return val;
                  }}
                />
                <RechartsTooltip content={<CustomTrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#f43f5e"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#f43f5e" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatistikView;
