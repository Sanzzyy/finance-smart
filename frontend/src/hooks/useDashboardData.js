import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosInstance";

export const useDashboardData = (userData) => {
  const [rawPemasukan, setRawPemasukan] = useState([]);
  const [rawPengeluaran, setRawPengeluaran] = useState([]);
  const [filterWaktu, setFilterWaktu] = useState("bulan_ini");
  
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [riwayatTransaksi, setRiwayatTransaksi] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi Filter
  const filterByDate = (data, filter) => {
    if (filter === "semua") return data;
    const now = new Date();

    return data.filter((item) => {
      const itemDate = new Date(item.tanggal);

      if (filter === "hari_ini") {
        return itemDate.toDateString() === now.toDateString();
      }
      if (filter === "minggu_ini") {
        const currentDay = now.getDay();
        const distance = currentDay === 0 ? 6 : currentDay - 1; 
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - distance);
        startOfWeek.setHours(0, 0, 0, 0);
        return itemDate >= startOfWeek;
      }
      if (filter === "bulan_ini") {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  };

  // Fungsi Tarik Data dari API
  const fetchSemuaData = useCallback(async (userId) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const [resPeng, resPem] = await Promise.all([
        api.get(`/api/pengeluaran/${userId}`),
        api.get(`/api/pemasukan/${userId}`),
      ]);
      const dataPeng = resPeng.data.data.map((i) => ({
        ...i,
        tipe: "pengeluaran",
        judul: i.toko,
        nominal: i.total,
      }));
      const dataPem = resPem.data.data.map((i) => ({
        ...i,
        tipe: "pemasukan",
        judul: i.sumber,
        nominal: i.jumlah,
      }));

      setRawPengeluaran(dataPeng);
      setRawPemasukan(dataPem);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efek Tarik Data Saat userData Siap
  useEffect(() => {
    if (userData?.id) {
      fetchSemuaData(userData.id);
    }
  }, [userData, fetchSemuaData]);

  // Efek Kalkulasi Total & Filter Saat Data/Waktu Berubah
  useEffect(() => {
    const filteredPengeluaran = filterByDate(rawPengeluaran, filterWaktu);
    const filteredPemasukan = filterByDate(rawPemasukan, filterWaktu);

    setTotalPengeluaran(
      filteredPengeluaran.reduce((sum, item) => sum + item.nominal, 0),
    );
    setTotalPemasukan(
      filteredPemasukan.reduce((sum, item) => sum + item.nominal, 0),
    );

    const gabungan = [...filteredPengeluaran, ...filteredPemasukan].sort(
      (a, b) => new Date(b.tanggal) - new Date(a.tanggal),
    );

    setRiwayatTransaksi(gabungan);
  }, [rawPengeluaran, rawPemasukan, filterWaktu]);

  return {
    rawPemasukan,
    rawPengeluaran,
    filterWaktu,
    setFilterWaktu,
    totalPemasukan,
    totalPengeluaran,
    riwayatTransaksi,
    fetchSemuaData,
    isLoading
  };
};
