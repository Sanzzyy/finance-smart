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
import {
  TrendingUp,
  Activity,
  LayoutGrid,
  PieChart as PieChartIcon,
  FileSpreadsheet,
  FileText,
  Wallet 
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLanguage } from "../../context/LanguageContext";

const COLORS = [
  "#3b82f6", // Blue
  "#f97316", // Orange
  "#22c55e", // Green
  "#ef4444", // Rose
  "#a855f7", // Purple
  "#eab308", // Yellow
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#64748b", // Slate
  "#8b5cf6", // Violet
];

const StatistikView = ({ riwayatTransaksi, filterWaktu, setFilterWaktu }) => {
  const { t } = useLanguage();
  // 1. LOGIKA UNTUK PIE CHART & KATEGORI
  const dataPengeluaran = riwayatTransaksi.filter(
    (t) => t.tipe === "pengeluaran",
  );

  const statistikKategori = dataPengeluaran.reduce((acc, curr) => {
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

  // --- FITUR EXPORT ---
  const exportToExcel = () => {
    const exportData = riwayatTransaksi.map((item, index) => ({
      No: index + 1,
      Tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      Tipe: item.tipe.toUpperCase(),
      Kategori: item.kategori || "-",
      Keterangan: item.judul || item.toko || "-",
      Nominal: item.nominal || item.total || item.jumlah || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat");

    worksheet["!cols"] = [ { wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 15 } ];
    XLSX.writeFile(workbook, "Laporan_FinanceSmart.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("Laporan Keuangan - Finance Smart", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    const periodeMap = {
      hari_ini: "Hari Ini", minggu_ini: "Minggu Ini", bulan_ini: "Bulan Ini", semua: "Semua Waktu"
    };
    doc.text(`Periode: ${periodeMap[filterWaktu] || "Semua Waktu"}`, 14, 30);

    const tableRows = riwayatTransaksi.map((item, index) => [
      index + 1,
      new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      item.tipe.toUpperCase(),
      item.kategori || "-",
      item.judul || item.toko || "-",
      `Rp ${Number(item.nominal || item.total || item.jumlah || 0).toLocaleString("id-ID")}`,
    ]);

    autoTable(doc, {
      head: [["No", "Tanggal", "Tipe", "Kategori", "Keterangan", "Nominal"]],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 5: { halign: 'right' } }
    });

    doc.save("Laporan_FinanceSmart.pdf");
  };

  // --- CUSTOM TOOLTIPS ---
  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            {label}
          </p>
          <p className="text-rose-600 dark:text-rose-400 font-black text-lg">
            Rp {payload[0].value.toLocaleString("id-ID")}
          </p>
        </div>
      );
    }
    return null;
  };
  
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">
              {payload[0].payload.name}
            </p>
          </div>
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
      
      {/* ========================================================
          1. HEADER & DROPDOWN FILTER & AKSIS
      ======================================================== */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3 transition-colors duration-300">
            {t("stats.expense_title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t("stats.expense_desc")}
          </p>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 xl:shrink-0 w-full xl:w-auto">
          
          {/* Segmented Filter Control */}
          <div className="flex w-full sm:w-auto bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-inner">
            {["hari_ini", "minggu_ini", "bulan_ini", "semua"].map((fk) => {
              const labels = { hari_ini: "Hari Ini", minggu_ini: "Minggu Ini", bulan_ini: "Bulan Ini", semua: "Semua Waktu" };
              return (
                <button
                  key={fk}
                  onClick={() => setFilterWaktu(fk)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-[13px] font-extrabold transition-all duration-300 ${
                    filterWaktu === fk
                      ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-200 shadow-sm border border-slate-200/50 dark:border-slate-500/50"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {labels[fk]}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={exportToExcel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white dark:hover:text-white px-4 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 transition-all font-bold text-sm shadow-sm group">
              <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={exportToPDF} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white dark:hover:text-white px-4 py-3 rounded-2xl border border-rose-200 dark:border-rose-500/20 transition-all font-bold text-sm shadow-sm group">
              <FileText size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. SUMMARY CARDS
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {/* Card 1: Total Pengeluaran */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300 hover:border-rose-100 dark:hover:border-rose-500/30">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5 line-clamp-1">
              Total Pengeluaran
            </p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 flex items-baseline gap-1">
              Rp {totalPengeluaran.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-gradient-to-tr from-rose-100 to-red-50 dark:from-rose-500/10 dark:to-red-500/10 text-rose-500 dark:text-rose-400 p-4 rounded-2xl shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform shrink-0">
            <Wallet size={26} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 2: Pengeluaran Terbesar */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300 hover:border-orange-100 dark:hover:border-orange-500/30">
          <div className="overflow-hidden">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5 line-clamp-1">
              Top Kategori
            </p>
            <p className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-400 truncate pr-2">
              {dataStatistik[0]?.name || "Belum Ada"}
            </p>
          </div>
          <div className="bg-gradient-to-tr from-orange-100 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 text-orange-500 dark:text-orange-400 p-4 rounded-2xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
            <TrendingUp size={26} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 3: Total Pos */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1 hover:border-blue-100 dark:hover:border-blue-500/30">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5 line-clamp-1">
              Pos Kategori
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white flex items-baseline gap-2">
              {dataStatistik.length}
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold ml-0.5">Item</span>
            </p>
          </div>
          <div className="bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 text-blue-600 dark:text-blue-400 p-4 rounded-2xl shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform shrink-0">
            <LayoutGrid size={26} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* ========================================================
          3. AREA CHART TREN HARIAN
      ======================================================== */}
      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm mb-8 group hover:shadow-md transition-shadow duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 p-3 rounded-2xl">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-slate-800 dark:text-white font-black text-xl tracking-tight">
                Tren Pengeluaran Harian
              </h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-1">
                Polanya membantu melihat kapan kamu sering "khilaf".
              </p>
            </div>
          </div>
        </div>

        {trendData.length === 0 ? (
          <div className="h-[250px] w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-700/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-600">
             <Activity size={32} className="text-slate-300 dark:text-slate-500 mb-2" />
             <p className="font-bold text-sm">Data tren belum tersedia.</p>
          </div>
        ) : (
          <div className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} dy={10} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} tickFormatter={(val) => {
                    if (val >= 1000000) return `Rp${(val / 1000000).toFixed(1)}jt`;
                    if (val >= 1000) return `Rp${val / 1000}k`;
                    return val;
                  }} />
                <RechartsTooltip content={<CustomTrendTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="total" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" activeDot={{ r: 6, strokeWidth: 4, stroke: "#fff", fill: "#f43f5e" }} animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ========================================================
          4. PROPORSI (PIE) & LIST KATEGORI
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Kolom 1: Donut Chart Proporsi */}
        <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center transition-colors duration-300">
          <div className="w-full flex items-center justify-between xl:mb-2">
            <div>
              <h3 className="text-slate-800 dark:text-white font-black text-xl tracking-tight mb-1">
                Distribusi Porsi
              </h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Beban pengeluaran.</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 p-2.5 rounded-xl shrink-0">
              <PieChartIcon size={20} strokeWidth={2.5} />
            </div>
          </div>

          {dataStatistik.length === 0 ? (
            <div className="flex-1 w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-700/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-600 mt-6 py-16">
              <PieChartIcon size={32} className="text-slate-300 dark:text-slate-500 mb-2" />
              <p className="font-bold text-sm">Tidak ada data proporsi.</p>
            </div>
          ) : (
            <div className="w-full h-[300px] mt-6 relative flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={dataStatistik}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {dataStatistik.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Teks Total di tengah Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold tracking-widest uppercase">Total</span>
                <span className="text-[14px] px-1 overflow-hidden font-black text-slate-800 dark:text-white mt-0.5 w-[110px] truncate text-center">
                  Rp{totalPengeluaran > 1000000 ? (totalPengeluaran/1000000).toFixed(1) + 'Jt' : totalPengeluaran.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Kolom 2: Daftar Detail */}
        <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full max-h-[460px] transition-colors duration-300">
          <h3 className="text-slate-800 dark:text-white font-black text-xl tracking-tight mb-2">
            Rincian Prioritas
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-6">
            Daftar akurat dari persentase pie chart di sebelah kiri.
          </p>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
            {dataStatistik.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium text-center mt-10">Data tidak tersedia.</p>
            ) : (
              dataStatistik.map((item, index) => {
                const persentase = ((item.value / totalPengeluaran) * 100).toFixed(1);
                return (
                  <div key={index} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform border border-white/20"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="min-w-0 pr-2">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize leading-none truncate block">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500">
                              {persentase}% MURNI
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800 dark:text-white whitespace-nowrap">
                        Rp {item.value.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {/* Progress Bar Label */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
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
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StatistikView;
