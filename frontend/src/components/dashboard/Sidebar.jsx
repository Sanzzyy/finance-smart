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
  setIsSidebarCollapsed, // Props baru
}) => {
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
          ${isSidebarCollapsed ? "w-[280px] lg:w-[100px]" : "w-[280px]"}
          
          bg-gradient-to-tr from-[#0a46b5] via-[#1a73e8] to-[#4285f4] text-white border-r border-blue-600
        `}
      >
        {/* --- TOMBOL TOGGLE (Hanya Desktop) --- */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-10 bg-white text-blue-600 p-1.5 rounded-full shadow-lg border border-blue-100 hover:scale-110 transition-transform z-[60]"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={18} strokeWidth={3} />
          ) : (
            <ChevronLeft size={18} strokeWidth={3} />
          )}
        </button>

        {/* --- HEADER LOGO --- */}
        <div
          className={`h-20 px-6 flex items-center shrink-0 border-b border-white/10 ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : "justify-between"}`}
        >
          {isSidebarCollapsed ? (
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

        {/* --- PROFIL USER --- */}
        <div
          className={`py-6 shrink-0 ${isSidebarCollapsed ? "px-3" : "px-5"}`}
        >
          <div
            className={`bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl flex items-center transition-all cursor-default ${isSidebarCollapsed ? "p-3 justify-center" : "p-4 gap-4"}`}
          >
            <div className="w-12 h-12 bg-white text-[#1a73e8] font-black text-lg rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              {userData?.namaLengkap?.charAt(0).toUpperCase() || "U"}
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-white truncate drop-shadow-sm">
                  {userData?.namaLengkap || "User"}
                </p>
                <p className="text-[11px] text-blue-100 truncate font-medium uppercase tracking-widest mt-0.5 opacity-80">
                  {userData?.email.split("@")[0] || "user"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- MENU NAVIGASI --- */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {!isSidebarCollapsed ? (
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
              ${isSidebarCollapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
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
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("statistik");
              setIsMobileMenuOpen(false);
            }}
            title="Statistik & Kategori"
            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all group
              ${isSidebarCollapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
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
            {!isSidebarCollapsed && <span>Statistik & Kategori</span>}
          </button>

          {/* --- AKSI CEPAT --- */}
          {!isSidebarCollapsed ? (
            <p className="px-3 text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-3 mt-8 opacity-80">
              Aksi Cepat
            </p>
          ) : (
            <div className="h-[1px] w-8 bg-white/20 mx-auto mb-3 mt-8"></div>
          )}

          <button
            onClick={() => {
              handleCameraClick();
              setIsMobileMenuOpen(false);
            }}
            title="Scan Struk"
            className={`w-full flex items-center rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all group border border-transparent hover:border-white/10
              ${isSidebarCollapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
            `}
          >
            <div className="bg-purple-400/20 text-purple-300 p-2 rounded-lg group-hover:bg-purple-400/30 transition-colors shrink-0">
              <Camera size={16} strokeWidth={2.5} />
            </div>
            {!isSidebarCollapsed && <span>Scan Struk</span>}
          </button>

          <button
            onClick={handleVoiceRecord}
            title="Catat via Suara"
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all group border
              ${isSidebarCollapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
              ${isListening ? "bg-red-500/20 border-red-500/50 text-red-200 animate-pulse" : "border-transparent text-white hover:bg-white/10 hover:border-white/10"}
            `}
          >
            <div
              className={`p-2 rounded-lg transition-colors shrink-0 ${isListening ? "bg-red-500 text-white" : "bg-orange-400/20 text-orange-300 group-hover:bg-orange-400/30"}`}
            >
              <Mic size={16} strokeWidth={2.5} />
            </div>
            {!isSidebarCollapsed && (
              <span>{isListening ? "Mendengarkan..." : "Catat via Suara"}</span>
            )}
          </button>
        </nav>

        {/* --- FOOTER (LOGOUT) --- */}
        <div
          className={`p-5 shrink-0 border-t border-white/10 ${isSidebarCollapsed ? "flex justify-center" : ""}`}
        >
          <button
            onClick={handleLogout}
            title="Keluar Aplikasi"
            className={`flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-blue-100 hover:bg-red-500/80 hover:text-white hover:border-red-500/30 border border-transparent transition-all duration-300
              ${isSidebarCollapsed ? "p-3.5 w-auto" : "w-full px-4 py-4"}
            `}
          >
            <LogOut size={18} strokeWidth={2.5} className="shrink-0" />
            {!isSidebarCollapsed && <span>Keluar Aplikasi</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
