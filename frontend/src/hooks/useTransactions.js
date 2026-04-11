import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/axiosInstance";

export const useTransactions = (userData, fetchSemuaData) => {
  // States Modals Pemasukan
  const [showPemasukanModal, setShowPemasukanModal] = useState(false);
  const [formPemasukan, setFormPemasukan] = useState({
    sumber: "",
    jumlah: "",
    kategori: "Gaji",
  });

  // States Modals Pengeluaran
  const [showPengeluaranModal, setShowPengeluaranModal] = useState(false);
  const [formPengeluaran, setFormPengeluaran] = useState({
    toko: "",
    total: "",
    kategori: "Makan",
  });

  // States Modals Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [formEdit, setFormEdit] = useState({
    id: "",
    tipe: "",
    judul: "",
    nominal: "",
    kategori: "",
  });

  const handleSimpanPemasukan = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/pemasukan`, {
        userId: userData.id,
        sumber: formPemasukan.sumber,
        jumlah: parseInt(formPemasukan.jumlah.replace(/\./g, "")),
        kategori: formPemasukan.kategori,
      });
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Pemasukan berhasil ditambah!",
        confirmButtonColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowPemasukanModal(false);
      setFormPemasukan({ sumber: "", jumlah: "", kategori: "Gaji" });
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Gagal menyimpan pemasukan.",
        confirmButtonColor: "#10b981",
      });
    }
  };

  const handleSimpanPengeluaranManual = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/pengeluaran`, {
        userId: userData.id,
        toko: formPengeluaran.toko,
        total: parseInt(formPengeluaran.total.replace(/\./g, "")),
        kategori: formPengeluaran.kategori,
        items: [],
      });
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Sip! Pengeluaran berhasil dicatat.",
        confirmButtonColor: "#f43f5e",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowPengeluaranModal(false);
      setFormPengeluaran({ toko: "", total: "", kategori: "Makan" });
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Gagal menyimpan pengeluaran.",
        confirmButtonColor: "#f43f5e",
      });
    }
  };

  const handleHapusTransaksi = async (id, tipe) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Transaksi?",
      text: "Data transaksi ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });
    if (!konfirmasi.isConfirmed) return;

    try {
      const endpoint = tipe === "pemasukan" ? "pemasukan" : "pengeluaran";
      await api.delete(`/api/${endpoint}/${id}`);

      await Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Transaksi berhasil dihapus!",
        confirmButtonColor: "#3b82f6",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error("Gagal menghapus:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Waduh, gagal menghapus transaksi.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  const handleSimpanEdit = async (e) => {
    e.preventDefault();
    try {
      const angkaBersih = parseInt(
        formEdit.nominal.toString().replace(/\./g, ""),
      );
      const endpoint =
        formEdit.tipe === "pemasukan" ? "pemasukan" : "pengeluaran";

      const payload =
        formEdit.tipe === "pemasukan"
          ? {
              sumber: formEdit.judul,
              jumlah: angkaBersih,
              kategori: formEdit.kategori,
            }
          : {
              toko: formEdit.judul,
              total: angkaBersih,
              kategori: formEdit.kategori,
            };

      await api.put(`/api/${endpoint}/${formEdit.id}`, payload);

      await Swal.fire({
        icon: "success",
        title: "Diperbarui!",
        text: "Transaksi berhasil diperbarui!",
        confirmButtonColor:
          formEdit.tipe === "pemasukan" ? "#10b981" : "#f43f5e",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowEditModal(false);
      fetchSemuaData(userData.id);
    } catch (error) {
      console.error("Gagal mengubah:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Maaf, gagal memperbarui transaksi.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  return {
    showPemasukanModal,
    setShowPemasukanModal,
    formPemasukan,
    setFormPemasukan,
    handleSimpanPemasukan,
    showPengeluaranModal,
    setShowPengeluaranModal,
    formPengeluaran,
    setFormPengeluaran,
    handleSimpanPengeluaranManual,
    showEditModal,
    setShowEditModal,
    formEdit,
    setFormEdit,
    handleSimpanEdit,
    handleHapusTransaksi,
  };
};
