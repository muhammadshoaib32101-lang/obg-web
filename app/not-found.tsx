"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  useEffect(() => { router.replace("/"); }, [router]);
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdf6f0 0%, #fef0f5 40%, #f5f0fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#c9608c', fontFamily: "'Jost', sans-serif", fontSize: '1.1rem', fontWeight: 300 }}>Redirecting…</div>
    </div>
  );
}
