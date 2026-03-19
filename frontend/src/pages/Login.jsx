import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Sparkles, ArrowRight } from "lucide-react"; // Ikon Coffee diganti jadi Sparkles
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("Selamat datang kembali, " + response.data.user.namaLengkap + "!");

      if (!response.data.user.isBiometricActive) {
        const setujuiBiometric = window.confirm(
          "Ingin mengaktifkan Sidik Jari/Face ID untuk login berikutnya?",
        );
        if (setujuiBiometric) {
          localStorage.setItem("biometric_active", "true");
        }
      }

      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Waduh, servernya error atau belum nyala.");
      }
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
    // Background sama persis dengan halaman Register
    <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Aksen gradasi biru lembut */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#e8f0fe] to-transparent"></div>

      <div
        ref={formRef}
        // Card putih bersih dengan shadow
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative z-10"
      >
        <div className="text-center mb-10">
          {/* Ikon Sparkles dengan background biru Google */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-[#e8f0fe] shadow-inner">
            <Sparkles className="text-[#1a73e8] w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#1f2937] mb-2">Login</h1>
          <p className="text-gray-500 text-sm">
            Masuk untuk atur keuanganmu lebih pintar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Username / Email
            </label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8] transition-all"
              placeholder="Masukkan email kamu"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            Masuk Sekarang <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm font-medium">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-[#1a73e8] font-bold hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
