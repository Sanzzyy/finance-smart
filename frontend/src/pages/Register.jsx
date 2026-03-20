import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://finance-smart-nine.vercel.app/api/register",
        formData,
      );
      await Swal.fire({ icon: 'success', title: 'Berhasil!', text: "Keren! " + response.data.message, confirmButtonColor: '#1a73e8' });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: error.response.data.message, confirmButtonColor: '#1a73e8' });
      } else {
        Swal.fire({ icon: 'error', title: 'Koneksi Gagal', text: "Waduh, servernya error atau belum nyala.", confirmButtonColor: '#1a73e8' });
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
    // Background utama putih keabu-abuan yang sangat bersih (Light Mode)
    <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Aksen gradasi biru lembut di bagian atas layar */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#e8f0fe] to-transparent"></div>

      <div
        ref={formRef}
        // Card berwarna putih murni dengan shadow yang lembut
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative z-10"
      >
        <div className="text-center mb-8">
          {/* Ikon dengan background biru muda khas Google */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-[#e8f0fe] shadow-inner">
            <Sparkles className="text-[#1a73e8] w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold text-[#1f2937] mb-2">Register</h1>
          <p className="text-gray-500 text-sm">
            Mulai perjalanan finansial pintarmu sekarang.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              required
              // Input field abu-abu super muda dengan highlight border biru
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8] transition-all"
              placeholder="Contoh: Muhammad Sajid"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8] transition-all"
              placeholder="sajid@email.com"
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

          {/* Tombol Biru solid (Primary Blue Google) */}
          <button
            type="submit"
            className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/login"
            className="text-gray-500 text-sm hover:text-[#1a73e8] flex items-center justify-center gap-2 transition-colors font-medium"
          >
            <ArrowLeft size={16} /> Sudah punya akun? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
