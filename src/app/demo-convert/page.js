"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function DemoConvertContent() {
  const searchParams = useSearchParams();
  const linkId = searchParams.get("linkId") || "demo-link-1";
  const [status, setStatus] = useState("idle");

  const handleConvert = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <h2>Demo Conversion Simulation</h2>
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          background: "#f0f0f0",
          borderRadius: 4,
        }}
      >
        <p>
          Link ID: <strong>{linkId}</strong>
        </p>
        <p style={{ fontSize: "14px", color: "#666" }}>
          A click has been logged for this link. Now simulate a conversion:
        </p>
      </div>
      <button
        onClick={handleConvert}
        disabled={status === "loading"}
        style={{
          padding: 12,
          background: status === "loading" ? "#ccc" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          fontSize: "16px",
        }}
      >
        {status === "loading" ? "Processing..." : "Simulate Conversion"}
      </button>
      {status === "success" && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: 4,
            color: "#155724",
          }}
        >
          ✅ Conversion logged successfully!
        </div>
      )}
      {status === "error" && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: 4,
            color: "#721c24",
          }}
        >
          ❌ Error logging conversion. Check console and Supabase tables.
        </div>
      )}
    </div>
  );
}

export default function DemoConvert() {
  return (
    <Suspense fallback={<div>Loading conversion demo...</div>}>
      <DemoConvertContent />
    </Suspense>
  );
}
