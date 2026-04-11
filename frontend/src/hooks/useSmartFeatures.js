import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/axiosInstance";

export const useSmartFeatures = (userData, fetchSemuaData) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // 1. Fungsi Upload OCR Struk
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      setIsScanning(true);
      const response = await api.post(`/api/scan`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setScannedData(response.data.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal OCR",
        text: "Gagal membaca struk. Pastikan gambarnya jelas ya!",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsScanning(false);
      e.target.value = null;
    }
  };

  // 2. Transaksi Hasil OCR
  const handleSimpanPengeluaranScan = async () => {
    if (!scannedData) return;
    try {
      const payload = {
        userId: userData.id,
        toko: scannedData.judul || scannedData.toko || "Toko Umum",
        total: parseInt(scannedData.nominal || scannedData.total || 0),
        kategori: scannedData.kategori || "Lainnya",
        items: scannedData.items || [],
      };

      await api.post(`/api/pengeluaran`, payload);

      await Swal.fire({
        icon: "success",
        title: "Tersimpan!",
        text: "Sip! Pengeluaran dari struk berhasil dicatat.",
        confirmButtonColor: "#3b82f6",
        timer: 1500,
        showConfirmButton: false,
      });
      setScannedData(null);
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Gagal menyimpan data scan.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  // 3. Fitur Voice Record AI
  const handleVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Browsermu belum mendukung fitur rekam suara.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);

      const konfirmasi = await Swal.fire({
        title: "Konfirmasi Suara",
        html: `Apakah teks ini sesuai?<br/><br/><strong style="font-size: 1.2em;">"${transcript}"</strong>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Ya, Sesuai",
        cancelButtonText: "Tidak, Ulangi",
      });

      if (!konfirmasi.isConfirmed) return;

      setIsScanning(true);
      try {
        const res = await api.post(`/api/voice`, {
          userId: userData.id,
          text: transcript,
        });

        const tercatatList = res.data.tercatat;
        const totalTrx = tercatatList.length;

        const summaryText = tercatatList
          .map((t) => `- ${t.judul} (${t.tipe === "pemasukan" ? "Pemasukan" : "Pengeluaran"})`)
          .join("<br/>");

        await Swal.fire({
          icon: "success",
          title: "Multi-Transaksi Tersimpan!",
          html: `Sip! <b>${totalTrx} transaksi</b> berhasil dicatat:<br/><br/><div style="text-align:left; font-size: 0.9em; padding-left: 20px;">${summaryText}</div>`,
          confirmButtonColor: "#3b82f6",
          timer: 5000,
          showConfirmButton: false,
        });
        fetchSemuaData(userData.id);
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal memproses suara.",
          confirmButtonColor: "#3b82f6",
        });
      } finally {
        setIsScanning(false);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return {
    isScanning,
    scannedData,
    setScannedData,
    isListening,
    handleFileChange,
    handleSimpanPengeluaranScan,
    handleVoiceRecord,
  };
};
