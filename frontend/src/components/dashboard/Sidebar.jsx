import React from "react";
import {
  Wallet,
  LayoutDashboard,
  PieChart as PieChartIcon,
  Camera,
  Mic,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bot,
} from "lucide-react";

const Sidebar = ({
  userData,
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLogout,
  handleCameraClick,
  handleVoiceRecord,
  isListening,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isDarkMode,
  setIsDarkMode,
  onOpenKemampuan,
}) => {
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const collapsed = isSidebarCollapsed && isDesktop;

  return (
    <>
      {/* 1. OVERLAY (Mobile) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-[45] lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* 2. SIDEBAR PANEL */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full flex flex-col z-[50] 
          transition-all duration-300 ease-in-out lg:shadow-none
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          
          /* --- LOGIKA LEBAR DINAMIS --- */
          /* Jika ditutup lebarnya 100px, jika dibuka 280px */
          ${collapsed ? "w-[280px] lg:w-[100px]" : "w-[280px]"}
          
          bg-gradient-to-tr from-[#0a46b5] via-[#1a73e8] to-[#4285f4] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white border-r border-blue-600 dark:border-slate-800
        `}
      >
        {/* --- TOMBOL TOGGLE (Hanya Desktop) --- */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-10 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 p-1.5 rounded-full shadow-lg border border-blue-100 dark:border-slate-700 hover:scale-110 transition-transform z-[60]"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={18} strokeWidth={3} />
          ) : (
            <ChevronLeft size={18} strokeWidth={3} />
          )}
        </button>

        {/* --- HEADER LOGO --- */}
        <div
          className={`h-20 px-6 flex items-center shrink-0 border-b border-white/10 ${collapsed ? "lg:justify-center lg:px-0" : "justify-between"}`}
        >
          {collapsed ? (
            <div className="hidden lg:flex bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-inner border border-white/20">
              <Wallet size={22} strokeWidth={2.5} className="text-white" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-inner border border-white/20">
                <Wallet size={22} strokeWidth={2.5} className="text-white" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tight drop-shadow-sm">
                Finance<span className="text-blue-200">Smart</span>
              </h1>
            </div>
          )}
          {/* Tombol Close Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* --- PROFIL USER & TEMA --- */}
        <div
          className={`py-6 shrink-0 ${collapsed ? "px-3" : "px-5"}`}
        >
          <div
            className={`bg-white/10 border border-white/20 backdrop-blur-sm flex transition-all cursor-default ${collapsed ? "p-2.5 flex-col items-center gap-3 rounded-[1.25rem]" : "p-3 pl-4 items-center justify-between rounded-2xl"}`}
          >
            <div className={`flex items-center min-w-0 ${collapsed ? "justify-center" : "gap-3 w-full"}`}>
              <div className="w-10 h-10 bg-white text-[#1a73e8] font-black text-base rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                {userData?.namaLengkap?.charAt(0).toUpperCase() || "U"}
              </div>
              {!collapsed && (
                <div className="overflow-hidden flex-1">
                  <p className="font-bold text-sm text-white truncate drop-shadow-sm">
                    {userData?.namaLengkap || "User"}
                  </p>
                  <p className="text-[10px] text-blue-100 truncate font-medium uppercase tracking-widest mt-0.5 opacity-80">
                    {userData?.email.split("@")[0] || "user"}
                  </p>
                </div>
              )}
            </div>

            {/* Tombol Tema Simple */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={
                isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"
              }
              className={`flex items-center justify-center rounded-xl transition-all border border-transparent hover:bg-white/20 shrink-0
                ${collapsed ? "w-10 h-10 bg-white/5 hover:bg-white/10" : "w-10 h-10 ml-2"}
              `}
            >
              {isDarkMode ? (
                <Sun
                  size={18}
                  className="text-yellow-300 drop-shadow-md transition-transform hover:rotate-90"
                />
              ) : (
                <Moon
                  size={18}
                  className="text-indigo-200 drop-shadow-md transition-transform hover:-rotate-12"
                />
              )}
            </button>
          </div>
        </div>

        {/* --- MENU NAVIGASI --- */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {!collapsed ? (
            <p className="px-3 text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-3 mt-2 opacity-80">
              Utama
            </p>
          ) : (
            <div className="h-[1px] w-8 bg-white/20 mx-auto mb-3 mt-4"></div>
          )}

          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsMobileMenuOpen(false);
            }}
            title="Dashboard"
            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all group
              ${collapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
              ${activeTab === "dashboard" ? "bg-white/20 text-white shadow-sm border border-white/10" : "text-blue-100 hover:bg-white/10 hover:text-white"}
            `}
          >
            <LayoutDashboard
              size={20}
              className={
                activeTab === "dashboard"
                  ? "text-white"
                  : "text-blue-200 group-hover:text-white shrink-0"
              }
            />
            {!collapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("statistik");
              setIsMobileMenuOpen(false);
            }}
            title="Statistik & Kategori"
            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all group
              ${collapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
              ${activeTab === "statistik" ? "bg-white/20 text-white shadow-sm border border-white/10" : "text-blue-100 hover:bg-white/10 hover:text-white"}
            `}
          >
            <PieChartIcon
              size={20}
              className={
                activeTab === "statistik"
                  ? "text-white"
                  : "text-blue-200 group-hover:text-white shrink-0"
              }
            />
            {!collapsed && <span>Statistik & Kategori</span>}
          </button>

          {/* --- AKSI CEPAT --- */}
          {!collapsed ? (
            <p className="px-3 text-[10px] font-black text-blue-200 dark:text-slate-400 uppercase tracking-[0.2em] mb-3 mt-8 opacity-80">
              Aksi Cepat
            </p>
          ) : (
            <div className="h-[1px] w-8 bg-white/20 mx-auto mb-3 mt-8"></div>
          )}

          <button
            onClick={() => {
              onOpenKemampuan();
              setIsMobileMenuOpen(false);
            }}
            title="Cek Kemampuan Beli (AI)"
            className={`w-full flex items-center rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all group border border-transparent hover:border-white/10
              ${collapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
            `}
          >
            <div className="bg-indigo-400/20 text-indigo-300 p-2 rounded-lg group-hover:bg-indigo-400/30 transition-colors shrink-0">
              <Bot size={16} strokeWidth={2.5} />
            </div>
            {!collapsed && <span>Cek Kemampuan Beli</span>}
          </button>

          <button
            onClick={() => {
              handleCameraClick();
              setIsMobileMenuOpen(false);
            }}
            title="Scan Struk"
            className={`w-full flex items-center rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all group border border-transparent hover:border-white/10
              ${collapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
            `}
          >
            <div className="bg-purple-400/20 text-purple-300 p-2 rounded-lg group-hover:bg-purple-400/30 transition-colors shrink-0">
              <Camera size={16} strokeWidth={2.5} />
            </div>
            {!collapsed && <span>Scan Struk</span>}
          </button>

          <button
            onClick={handleVoiceRecord}
            title="Catat via Suara"
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all group border
              ${collapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
              ${isListening ? "bg-red-500/20 border-red-500/50 text-red-200 animate-pulse" : "border-transparent text-white hover:bg-white/10 hover:border-white/10"}
            `}
          >
            <div
              className={`p-2 rounded-lg transition-colors shrink-0 ${isListening ? "bg-red-500 text-white" : "bg-orange-400/20 text-orange-300 group-hover:bg-orange-400/30"}`}
            >
              <Mic size={16} strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span>{isListening ? "Mendengarkan..." : "Catat via Suara"}</span>
            )}
          </button>
        </nav>

        {/* --- FOOTER (LOGOUT) --- */}
        <div
          className={`p-5 shrink-0 border-t border-white/10 ${collapsed ? "flex justify-center" : ""}`}
        >
          <button
            onClick={handleLogout}
            title="Keluar Aplikasi"
            className={`flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-blue-100 hover:bg-red-500/80 hover:text-white hover:border-red-500/30 border border-transparent transition-all duration-300
              ${collapsed ? "p-3.5 w-auto" : "w-full px-4 py-4"}
            `}
          >
            <LogOut size={18} strokeWidth={2.5} className="shrink-0" />
            {!collapsed && <span>Keluar Aplikasi</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
