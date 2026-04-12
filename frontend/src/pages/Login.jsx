import React, { useEffect, useRef, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import { gsap } from "gsap";
import { Sparkles, ArrowRight, Loader2, Sun, Moon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import Swal from "sweetalert2";
import { useLanguage } from "../context/LanguageContext";

const Login = () => {
  const { t } = useLanguage();
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post(`/api/login`, formData);

      const userData = response.data.user;
      const initialToken = response.data.token;

      if (userData.hasBiometric) {
        // ==========================================
        // KONDISI 1: USER SUDAH PUNYA SIDIK JARI (2FA)
        // ==========================================
        try {
          // 1. Minta tantangan Login
          const optResp = await api.post(`/api/webauthn/login-options`, {
            email: formData.identifier,
          });

          // 2. Munculkan pop-up sidik jari untuk MASUK
          const authResp = await startAuthentication(optResp.data);

          // 3. Verifikasi ke backend
          const verifyResp = await api.post(`/api/webauthn/login-verify`, {
            email: formData.identifier,
            data: authResp,
          });

          if (verifyResp.data.verified) {
            await Swal.fire({
              icon: "success",
              title: "Akses Diberikan",
              text: "Verifikasi Sidik Jari Sukses! Meluncur ke Dashboard 🚀",
              confirmButtonColor: "#1a73e8",
              timer: 2000,
              showConfirmButton: false,
            });
            localStorage.setItem("token", verifyResp.data.token);
            localStorage.setItem("user", JSON.stringify(verifyResp.data.user));
            // navigate akan dijalankan di bawah
          }
        } catch (error) {
          console.error("Gagal verifikasi sidik jari:", error);
          Swal.fire({
            icon: "warning",
            title: "Akses Ditolak",
            text: "Sidik jari tidak dikenali atau dibatalkan.",
            confirmButtonColor: "#ef4444",
          });
          return; // Hentikan proses, jangan masuk dashboard!
        }
      } else {
        // ==========================================
        // KONDISI 2: USER BELUM PUNYA SIDIK JARI
        // ==========================================
        const konfirmasi = await Swal.fire({
          title: "Aktifkan Sidik Jari?",
          text: "Login perdana sukses! Ingin mengaktifkan Sidik Jari untuk keamanan ekstra? (Sangat disarankan)",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#1a73e8",
          cancelButtonColor: "#94a3b8",
          confirmButtonText: "Ya, Aktifkan!",
          cancelButtonText: "Lewati Dulu",
        });

        if (konfirmasi.isConfirmed) {
          try {
            const optionsResp = await api.post(
              `/api/webauthn/register-options`,
              { email: formData.identifier },
            );
            const attResp = await startRegistration(optionsResp.data);
            const verifyResp = await api.post(`/api/webauthn/register-verify`, {
              email: formData.identifier,
              data: attResp,
            });

            if (verifyResp.data.verified) {
              await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Yeay! Sidik Jari berhasil diamankan! 🎉",
                confirmButtonColor: "#1a73e8",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          } catch (error) {
            console.error("Gagal daftar biometrik:", error);
            Swal.fire({
              icon: "info",
              title: "Dilewati",
              text: "Pendaftaran sidik jari dilewati. Kamu bisa setup nanti.",
              confirmButtonColor: "#1a73e8",
            });
          }
        }

        // Simpan data login biasa karena user tidak punya biometrik untuk step ini
        localStorage.setItem("token", initialToken);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      navigate("/dashboard");
    } catch (error) {
      if (error?.response) {
        Swal.fire({
          icon: "error",
          title: "Gagal Login",
          text: error.response.data.message,
          confirmButtonColor: "#1a73e8",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Koneksi Gagal",
          text: "Waduh, servernya error atau belum nyala.",
          confirmButtonColor: "#1a73e8",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-500">
      {/* Tombol Toggle Theme Floating */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-lg text-slate-800 dark:text-yellow-300 hover:scale-110 transition-all z-50 group"
      >
        {isDarkMode ? (
          <Sun
            size={24}
            className="drop-shadow-md transition-transform group-hover:rotate-90"
          />
        ) : (
          <Moon
            size={24}
            className="text-indigo-600 drop-shadow-md transition-transform group-hover:-rotate-12"
          />
        )}
      </button>

      {/* Aksen gradasi ambient modern */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-indigo-400/30 dark:bg-indigo-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>

      <div
        ref={formRef}
        // Premium Glassmorphism Card
        className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/60 dark:border-slate-800 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-slate-800 dark:to-slate-700 shadow-inner border border-white/50 dark:border-slate-600/50 transform rotate-3">
            <Sparkles className="text-[#1a73e8] dark:text-blue-400 w-8 h-8 -rotate-3" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
            {t("auth.welcome")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {t("auth.subtitle_login")}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold ml-1">
              {t("auth.username_email")}
            </label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={t("auth.placeholder_email")}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold ml-1">
              {t("auth.password")}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-blue-500/30 dark:shadow-blue-500/20 mt-8 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 active:scale-[0.98]"}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> {t("auth.processing")}
              </>
            ) : (
              <>
                {t("auth.btn_login")} <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-500 dark:text-slate-400 text-sm font-medium">
          {t("auth.new_user")}{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4"
          >
            {t("auth.register_here")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
