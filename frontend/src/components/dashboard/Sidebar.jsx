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
  Globe,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

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
  const { t, language, setLanguage } = useLanguage();
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

        {/* --- PROFIL USER & UTILITIES --- */}
        <div
          className={`py-5 shrink-0 flex flex-col gap-2 ${collapsed ? "px-3" : "px-5"}`}
        >
          {/* Kotak Profil */}
          <div
            className={`bg-white/10 border border-white/20 backdrop-blur-sm flex transition-all cursor-default ${collapsed ? "p-2 justify-center rounded-2xl" : "p-3 pl-4 items-center gap-3 rounded-2xl"}`}
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
          </div>

          {/* Kotak Utilities (Tema & Bahasa) */}
          <div className={`flex items-center gap-2 ${collapsed ? "flex-col" : "flex-row w-full"}`}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? t("sidebar.mode_light") : t("sidebar.mode_dark")}
              className={`flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all shadow-sm ${collapsed ? "p-2 w-full" : "p-2 text-white"}`}
            >
              {isDarkMode ? (
                <Sun size={15} className="text-yellow-300 shrink-0" strokeWidth={2.5} />
              ) : (
                <Moon size={15} className="text-indigo-200 shrink-0" strokeWidth={2.5} />
              )}
              {!collapsed && <span className="text-xs font-bold">{isDarkMode ? t("sidebar.mode_light") : t("sidebar.mode_dark")}</span>}
            </button>

            <button
              onClick={() => setLanguage(language === "ID" ? "EN" : "ID")}
              title="Change Language"
              className={`flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all shadow-sm ${collapsed ? "p-2 w-full" : "p-2 text-white"}`}
            >
              <Globe size={15} className="text-sky-200 shrink-0" strokeWidth={2.5} />
              {!collapsed && <span className="text-xs font-bold">{language}</span>}
            </button>
          </div>
        </div>

        {/* --- MENU NAVIGASI --- */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1.5 mt-2">
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 px-3 
            ${collapsed ? "text-center hidden lg:block text-[8px]" : ""}`}
          >
            {t("sidebar.main")}
          </p>
          <button
            onClick={() => {
              setActiveTab("dashboard");
              if (!isDesktop) setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all relative group
              ${collapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
              ${activeTab === "dashboard" ? "bg-white text-[#1a73e8] shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"}
            `}
          >
            <LayoutDashboard
              size={20}
              strokeWidth={activeTab === "dashboard" ? 3 : 2}
              className={collapsed ? "" : "shrink-0"}
            />
            {!collapsed && <span>{t("sidebar.dashboard")}</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("statistik");
              if (!isDesktop) setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all relative group
              ${collapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
              ${activeTab === "statistik" ? "bg-white text-[#1a73e8] shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"}
            `}
          >
            <PieChartIcon
              size={20}
              strokeWidth={activeTab === "statistik" ? 3 : 2}
              className={collapsed ? "" : "shrink-0"}
            />
            {!collapsed && <span>{t("sidebar.stats_category")}</span>}
          </button>

          <p
            className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-8 mb-3 px-3
             ${collapsed ? "text-center hidden lg:block text-[8px]" : ""}`}
          >
            {t("sidebar.quick_action")}
          </p>

          <button
            onClick={onOpenKemampuan}
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all relative group
              ${collapsed ? "justify-center p-3.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/30" : "gap-3 px-4 py-3.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 hover:border-indigo-400/40 text-blue-50"}
            `}
          >
            <Bot size={20} className="text-purple-300" strokeWidth={2.5} />
            {!collapsed && <span>{t("sidebar.affordability_check")}</span>}
            {!collapsed && (
              <span className="absolute right-3 w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={handleCameraClick}
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all group
              ${collapsed ? "justify-center p-3.5" : "gap-3 px-4 py-3.5"}
              text-white hover:bg-white/10
            `}
          >
            <div className="p-1.5 bg-blue-400/20 rounded-lg text-blue-200 group-hover:bg-blue-400/30 transition-colors shrink-0">
              <Camera size={16} strokeWidth={2.5} />
            </div>
            {!collapsed && <span>{t("sidebar.scan_receipt")}</span>}
          </button>

          <button
            onClick={handleVoiceRecord}
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
              <span>{isListening ? t("sidebar.listening") : t("sidebar.voice_note")}</span>
            )}
          </button>
        </nav>

        {/* --- FOOTER (LOGOUT) --- */}
        <div
          className={`p-5 shrink-0 border-t border-white/10 ${collapsed ? "flex justify-center" : ""}`}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-blue-100 hover:bg-red-500/80 hover:text-white hover:border-red-500/30 border border-transparent transition-all duration-300
              ${collapsed ? "p-3.5 w-auto" : "w-full px-4 py-4"}
            `}
          >
            <LogOut size={18} strokeWidth={2.5} className="shrink-0" />
            {!collapsed && <span>{t("sidebar.logout")}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
