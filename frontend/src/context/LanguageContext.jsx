import React, { createContext, useContext, useEffect, useState } from "react";

const translations = {
  ID: {
    // === AUTH (Login & Register) ===
    auth: {
      welcome: "Selamat Datang",
      subtitle_login: "Masuk untuk mendominasi keuanganmu.",
      username_email: "Username / Email",
      password: "Password",
      placeholder_email: "Masukkan email kamu",
      placeholder_fullname: "Contoh: Muhammad Sajid",
      btn_login: "Masuk Sekarang",
      btn_register: "Daftar Sekarang",
      processing: "Memproses Otorisasi...",
      processing_register: "Memproses Pendaftaran...",
      new_user: "Pengguna baru?",
      register_here: "Daftar di sini",
      have_account: "Sudah punya akun? Login",
      start_journey: "Mulai Perjalanan",
      subtitle_register: "Buat akun dan atur keuangan yang lebih cerdas.",
      fullname: "Nama Lengkap"
    },
    
    // === SIDEBAR ===
    sidebar: {
      main: "UTAMA",
      dashboard: "Dashboard",
      stats_category: "Statistik & Kategori",
      quick_action: "AKSI CEPAT",
      affordability_check: "Cek Kemampuan Beli",
      scan_receipt: "Scan Struk",
      voice_note: "Catat via Suara",
      listening: "Mendengarkan...",
      logout: "Keluar Aplikasi",
      mode_light: "Terang",
      mode_dark: "Gelap"
    },

    // === DASHBOARD (Main) ===
    dashboard: {
      good_morning: "Selamat Pagi",
      good_afternoon: "Selamat Siang",
      good_evening: "Selamat Sore",
      good_night: "Selamat Malam",
      today: "Hari Ini",
      this_week: "Ahad Ini",
      this_month: "Bulan Ini",
      this_year: "Tahun Ini",
      logout_confirm_title: "Yakin ingin keluar?",
      logout_confirm_text: "Sesi kamu saat ini akan diakhiri.",
      btn_yes_logout: "Ya, Keluar!",
      btn_cancel: "Batal",
      summary_title: "Ringkasan Finansial Anda"
    },

    // === BALANCE CARD ===
    balance: {
      total_balance: "Total Saldo Anda",
      income: "Uang Masuk",
      expense: "Uang Keluar",
      month_suffix: "bulan ini"
    },

    // === TRANSACTION LIST ===
    transactions: {
      history: "Riwayat Transaksi",
      history_desc: "Daftar aktivitas keuangan terbarumu",
      btn_income: "Pemasukan",
      btn_expense: "Pengeluaran",
      no_transaction: "Belum ada transaksi",
      no_transaction_cat: "Tidak ada transaksi di kategori {cat}",
      show_all: "Tampilkan semua kategori"
    },

    // === STATISTIK VIEW ===
    stats: {
      expense_title: "Statistik Pengeluaran",
      expense_desc: "Kelola anggaran dan pantau pengeluaran.",
      cashflow_title: "Arus Kas Bulanan",
      income_vs_expense: "Pemasukan vs Pengeluaran"
    },

    // === MODALS ===
    modals: {
      add_income: "Catat Pemasukan",
      add_expense: "Catat Pengeluaran",
      edit_transaction: "Edit Transaksi",
      amount_label: "Jumlah Rupiah",
      amount_placeholder: "Contoh: 50000",
      category_label: "Kategori",
      select_category: "Pilih Kategori...",
      note_label: "Catatan (Opsional)",
      note_placeholder: "Beli kopi, Gaji masuk, dll",
      date_placeholder: "Pilih tanggal (ops. hari ini)",
      btn_save: "Simpan Catatan",
      btn_update: "Simpan Perubahan",
      btn_delete: "Hapus",
      scan_result_title: "Hasil Scan Struk",
      scan_result_desc: "Verifikasi data sebelum menyimpan",
      affordability_title: "Cek Kemampuan Beli",
      ai_planner: "AI Financial Planner",
      current_balance: "Saldo Saat Ini",
      avg_expense: "Rata Pengeluaran",
      ask_ai: "Tanya AI: 'Gua mau beli RAM 700ribu bulan depan bisa gak?'",
      record_voice: "Rekam Suara"
    }
  },
  
  EN: {
    // === AUTH ===
    auth: {
      welcome: "Welcome Back",
      subtitle_login: "Sign in to dominate your finances.",
      username_email: "Username / Email",
      password: "Password",
      placeholder_email: "Enter your email",
      placeholder_fullname: "E.g: John Doe",
      btn_login: "Sign In",
      btn_register: "Create Account",
      processing: "Authorizing...",
      processing_register: "Registering...",
      new_user: "New user?",
      register_here: "Register here",
      have_account: "Already have an account? Sign In",
      start_journey: "Start Your Journey",
      subtitle_register: "Create an account for smarter finances.",
      fullname: "Full Name"
    },

    // === SIDEBAR ===
    sidebar: {
      main: "MAIN MENU",
      dashboard: "Dashboard",
      stats_category: "Stats & Categories",
      quick_action: "QUICK ACTIONS",
      affordability_check: "Affordability Check",
      scan_receipt: "Scan Receipt",
      voice_note: "Voice Record",
      listening: "Listening...",
      logout: "Sign Out",
      mode_light: "Light",
      mode_dark: "Dark"
    },

    // === DASHBOARD (Main) ===
    dashboard: {
      good_morning: "Good Morning",
      good_afternoon: "Good Afternoon",
      good_evening: "Good Evening",
      good_night: "Good Night",
      today: "Today",
      this_week: "This Week",
      this_month: "This Month",
      this_year: "This Year",
      logout_confirm_title: "Are you sure?",
      logout_confirm_text: "Your current session will end.",
      btn_yes_logout: "Yes, Sign Out!",
      btn_cancel: "Cancel",
      summary_title: "Your Financial Summary"
    },

    // === BALANCE CARD ===
    balance: {
      total_balance: "Total Balance",
      income: "Total Income",
      expense: "Total Expense",
      month_suffix: "this month"
    },

    // === TRANSACTION LIST ===
    transactions: {
      history: "Transaction History",
      history_desc: "Your latest financial activities",
      btn_income: "Add Income",
      btn_expense: "Add Expense",
      no_transaction: "No transactions yet",
      no_transaction_cat: "No transactions in {cat} category",
      show_all: "Show all categories"
    },

    // === STATISTIK VIEW ===
    stats: {
      expense_title: "Expense Statistics",
      expense_desc: "Manage budget & track expenses.",
      cashflow_title: "Monthly Cashflow",
      income_vs_expense: "Income vs Expense"
    },

    // === MODALS ===
    modals: {
      add_income: "Record Income",
      add_expense: "Record Expense",
      edit_transaction: "Edit Transaction",
      amount_label: "Amount",
      amount_placeholder: "e.g. 50000",
      category_label: "Category",
      select_category: "Select Category...",
      note_label: "Note (Optional)",
      note_placeholder: "Coffee, Salary, etc",
      date_placeholder: "Date (defaults to today)",
      btn_save: "Save Record",
      btn_update: "Save Changes",
      btn_delete: "Delete",
      scan_result_title: "Scan Results",
      scan_result_desc: "Verify data before saving",
      affordability_title: "Affordability Check",
      ai_planner: "AI Financial Planner",
      current_balance: "Current Balance",
      avg_expense: "Avg Expense",
      ask_ai: "Ask AI: 'Can I buy a $50 RAM next month?'",
      record_voice: "Record Voice"
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("language") || "ID";
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Helper method: t("sidebar.dashboard")
  const t = (key, params = {}) => {
    const keys = key.split(".");
    let value = translations[language];
    for (let k of keys) {
      if (value[k] === undefined) {
        return key; // return key as fallback if not found
      }
      value = value[k];
    }
    
    if (typeof value !== "string") return key;

    // String interpolation for params like {cat}
    Object.keys(params).forEach(p => {
      value = value.replace(new RegExp(`{${p}}`, "g"), params[p]);
    });

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
