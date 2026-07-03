'use client'

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient("https://eleeyfgwstgliorqfssm.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZWV5Zmd3c3RnbGlvcnFmc3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjUxMDMsImV4cCI6MjA1MDAwMTEwM30.6oVB4ia790Y0O6_pIpOuit_n6BwLhtUa4ncbqXA5PK0");

const styles = {
  wrapper: {
    fontFamily: '"Poppins", "sans-serif"',
    display: "center",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  },
  cardContainer: {
    display: "flex",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    marginLeft:"10%",
    gap: "1rem",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#1c8c6c",
  },
  cardPrice: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ff7f50",
  },
  cardDescription: {
    fontSize: "1rem",
    color: "#555",
  },
};

export default function CardPaket() {
  const [paketData, setPaketData] = useState([]);

  useEffect(() => {
    // Fetch data from Supabase
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("paket")
        .select("namaPaket, hargaPaket, deskripsiPaket");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setPaketData(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.wrapper}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Daftar Paket</h1>
      <div style={styles.cardContainer}>
        {paketData.map((paket, index) => (
          <div key={index} style={styles.card}>
            <img src={paket.gambar} alt={paket.namaPaket} className="w-16 h-16 rounded-full" />
            <h3 style={styles.cardTitle}>{paket.namaPaket}</h3>
            <p style={styles.cardPrice}>Rp {paket.hargaPaket}</p>
            <p style={styles.cardDescription}>{paket.deskripsiPaket}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
}
