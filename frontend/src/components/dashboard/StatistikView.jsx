import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Activity, LayoutGrid, BarChart3 } from "lucide-react";

const COLORS = [
  "#ef4444", // Rose
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#64748b", // Slate
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#8b5cf6", // Violet
];

const StatistikView = ({ riwayatTransaksi, filterWaktu, setFilterWaktu }) => {
  // 1. LOGIKA UNTUK BAR CHART (Kategori Pengeluaran)
  const dataPengeluaran = riwayatTransaksi.filter(
    (t) => t.tipe === "pengeluaran",
  );

  const statistikKategori = dataPengeluaran.reduce((acc, curr) => {
    // Normalisasi nama kategori
    const kategori = curr.kategori || "Lainnya";
    acc[kategori] = (acc[kategori] || 0) + curr.nominal;
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

    dataPengeluaran.forEach((item) => {
      const dateObj = new Date(item.tanggal);
      const dateStr = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });

      if (!grouped[dateStr]) {
        grouped[dateStr] = { tanggalAsli: dateObj, tanggal: dateStr, total: 0 };
      }
      grouped[dateStr].total += item.nominal;
    });

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
  
  // --- CUSTOM TOOLTIP UNTUK BAR CHART ---
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-700/50">
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-white font-bold text-sm">
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

        {/* --- DROPDOWN FILTER WAKTU --- */}
        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all shrink-0">
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
        {/* Card 1: Total Pos */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md hover:border-blue-100 transition-all">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5 line-clamp-1">
              Total Pos Kategori
            </p>
            <p className="text-3xl font-black text-slate-800 flex items-baseline gap-2">
              {dataStatistik.length}
              <span className="text-sm text-slate-400 font-bold ml-1">Kategori</span>
            </p>
          </div>
          <div className="bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-600 p-4 rounded-2xl shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform">
            <LayoutGrid size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 2: Pengeluaran Terbesar */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md hover:border-rose-100 transition-all">
          <div className="overflow-hidden">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5 line-clamp-1">
              Pengeluaran Terbesar
            </p>
            <p className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500 truncate pr-4">
              {dataStatistik[0]?.name || "Belum Ada"}
            </p>
          </div>
          <div className="bg-gradient-to-tr from-rose-100 to-orange-50 text-rose-500 p-4 rounded-2xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
            <TrendingUp size={28} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* --- BARIS 2: BAR CHART & RINCIAN --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Horizontal Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-slate-800 font-black text-xl tracking-tight mb-2 flex items-center gap-3">
            <div className="bg-blue-50 text-blue-500 p-2 rounded-lg">
              <BarChart3 size={20} strokeWidth={2.5} />
            </div>
            Distribusi Pengeluaran
          </h3>
          <p className="text-slate-400 text-xs font-medium mb-8">
            Visualisasi pos pengeluaranmu dari yang tertinggi ke terendah.
          </p>

          {dataStatistik.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <LayoutGrid size={40} className="text-slate-300 mb-3" />
              <p className="font-bold">Belum ada data pengeluaran.</p>
            </div>
          ) : (
            <div className="flex-1 w-full relative min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataStatistik.slice(0, 8)} // Top 8 max
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                  barSize={20}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }}
                    width={90}
                    interval={0}
                  />
                  <RechartsTooltip cursor={{ fill: "#f1f5f9" }} content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="value"
                    radius={[0, 6, 6, 0]}
                    animationDuration={1500}
                  >
                    {dataStatistik.slice(0, 8).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Rincian Pos (Tabel Cepat) */}
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm max-h-[400px] flex flex-col">
          <h3 className="text-slate-800 font-black text-xl tracking-tight mb-2">
            Rincian Pos
          </h3>
          <p className="text-slate-400 text-xs font-medium mb-6">
            Daftar lengkap porsi belanjamu.
          </p>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
            {dataStatistik.length === 0 && (
              <p className="text-sm text-slate-400 font-medium text-center mt-10">Data kosong.</p>
            )}
            {dataStatistik.map((item, index) => {
              const persentase = ((item.value / totalPengeluaran) * 100).toFixed(1);
              return (
                <div key={index} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shadow-sm group-hover:scale-125 transition-transform"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div>
                        <span className="text-sm font-bold text-slate-700 capitalize leading-none">
                          {item.name}
                        </span>
                        <p className="text-[10px] font-black text-slate-400 mt-0.5">
                          {persentase}% MURNI
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-800">
                      Rp {item.value.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {/* Progress Bar Kecil */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${persentase}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- BARIS 3: AREA CHART (TREN HARIAN FULL WIDTH) --- */}
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-10 group hover:shadow-md transition-all duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-rose-100 to-orange-50 text-rose-500 p-3 rounded-2xl shadow-inner">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-slate-800 font-black text-xl tracking-tight">
                Tren Pengeluaran Harian
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-1">
                Pantau total belanjamu dari hari ke hari.
              </p>
            </div>
          </div>
        </div>

        {trendData.length === 0 ? (
          <div className="h-[300px] w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
             <Activity size={40} className="text-slate-300 mb-3" />
             <p className="font-bold">Data tren belum tersedia.</p>
          </div>
        ) : (
          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="tanggal"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                  dy={10}
                  minTickGap={20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                  tickFormatter={(val) => {
                    if (val >= 1000000)
                      return `Rp${(val / 1000000).toFixed(1)}jt`;
                    if (val >= 1000) return `Rp${val / 1000}k`;
                    return val;
                  }}
                />
                <RechartsTooltip content={<CustomTrendTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#f43f5e"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  activeDot={{ r: 6, strokeWidth: 4, stroke: "#fff", fill: "#f43f5e" }}
                  animationDuration={1500}
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
