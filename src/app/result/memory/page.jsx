"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowLeft, Download, Repeat, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import { useGameStore } from "../../../lib/useGameStore";

export default function MemoryResultPage() {
  const router = useRouter();
  const { results, getResultsFromStorage, resetGame } = useGameStore();
  const [data, setData] = useState(null);
  const confettiRef = useRef(null);
  const ctxRef = useRef(null);
  const particlesRef = useRef([]);
  const scoreRef = useRef(null);
  const statsRef = useRef(null);
  const actionRef = useRef(null);
  const recommendationsRef = useRef(null);

  useEffect(() => {
    // try store first, then localStorage fallback
    const fromStore = results ?? getResultsFromStorage();
    if (!fromStore) {
      router.push("/game/memory");
      return;
    }
    setData(fromStore);

    // [AUDIO ADD] play sfx once
    const audio = new Audio("/sounds/complete.mp3");
    audio.volume = 0.8; // biar ga terlalu keras
    audio.play().catch((e) => console.warn("Autoplay blocked:", e));

    // small delay to allow rendering then play animations
    setTimeout(() => initAnimations(fromStore), 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GSAP timeline animations
  function initAnimations(res) {
    const tl = gsap.timeline();
    tl.fromTo(
      ".back-btn",
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
    tl.fromTo(
      scoreRef.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
      "-=0.2"
    );
    tl.to(
      scoreRef.current.querySelector(".score-number"),
      {
        innerText: res.points,
        duration: 1.4,
        snap: { innerText: 1 },
        ease: "power2.out",
        onStart: startConfetti,
      },
      "-=0.4"
    );
    tl.fromTo(
      statsRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.6"
    );
    tl.fromTo(
      ".result-item",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.35 },
      "-=0.4"
    );
    tl.fromTo(
      actionRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.35"
    );
    tl.fromTo(
      recommendationsRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    );
  }

  // confetti canvas setup
  useEffect(() => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext("2d");
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleResize() {
    const canvas = confettiRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function startConfetti() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    particlesRef.current = [];
    for (let i = 0; i < 90; i++) {
      particlesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: -10 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: ["#ff6b9d", "#feca57", "#48cae4", "#f38ba8", "#a8dadc", "#457b9d"][
          Math.floor(Math.random() * 6)
        ],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
      });
    }
    animateConfetti();
  }

  function animateConfetti() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, confettiRef.current.width, confettiRef.current.height);
    particlesRef.current.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rot += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
      if (p.y > window.innerHeight + 50) {
        particlesRef.current.splice(idx, 1);
      }
    });
    if (particlesRef.current.length > 0) {
      requestAnimationFrame(animateConfetti);
    }
  }

  // download achievement (html2canvas)
  async function downloadAchievement() {
    const el = document.getElementById("result-card");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const link = document.createElement("a");
    link.download = `achievement-memory-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function shareResults() {
    const shareText = `Aku baru saja main Memory RISA — skor ${data.points} 🎯, ${data.moves} gerakan, ${data.time}s. Coba deh!`;
    if (navigator.share) {
      navigator
        .share({
          title: "Memory RISA",
          text: shareText,
          url: window.location.href,
        })
        .catch((e) => console.warn(e));
    } else {
      navigator.clipboard
        .writeText(`${shareText} ${window.location.href}`)
        .then(() => {
          const fb = document.createElement("div");
          fb.className = "fixed top-4 right-4 bg-pink-600 text-white px-4 py-2 rounded-lg z-50";
          fb.textContent = "Tautan disalin ke clipboard";
          document.body.appendChild(fb);
          gsap.fromTo(fb, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 });
          setTimeout(() => {
            gsap.to(fb, { y: -20, opacity: 0, duration: 0.25, onComplete: () => fb.remove() });
          }, 2000);
        });
    }
  }

  function formatDuration(sec) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  if (!data) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <canvas ref={confettiRef} className="fixed inset-0 pointer-events-none z-50"></canvas>

      <div className="flex items-center gap-3 mb-6">
        <button
          className="back-btn p-2 rounded-full bg-white/60 hover:bg-white shadow-sm"
          onClick={() => {
            resetGame();
            router.push("/");
          }}
        >
          <ArrowLeft className="w-5 h-5 text-pink-600" />
        </button>
        <h2 className="text-2xl font-extrabold text-pink-600">Hasil Game — Memory</h2>
      </div>


      <div
        id="result-card"
        className="max-w-4xl mx-auto text-center p-6 rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md"
      >
        {/* ✨ Score Circle */}
        <div
          ref={scoreRef}
          className="relative mx-auto w-56 h-56 rounded-full flex flex-col items-center justify-center 
          bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-2xl 
          ring-4 ring-pink-200 animate-[pulse_2.5s_infinite]"
        >
          <span className="text-sm opacity-80">Score</span>
          <span className="score-number text-6xl font-extrabold drop-shadow-lg">{data.points}</span>
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl animate-pulse"></div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="flex justify-center gap-8 mt-10">
          {/* Matched */}
          <div className="text-center hover:scale-105 transition">
            <div className="w-14 h-14 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
              ✅
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Matched</div>
            <div className="text-2xl font-bold text-gray-800">
              {data.matchedCount}/{data.totalPairs ?? data.matchedCount}
            </div>
          </div>

          {/* Moves */}
          <div className="text-center hover:scale-105 transition">
            <div className="w-14 h-14 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center shadow-inner">
              🎯
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Moves</div>
            <div className="text-2xl font-bold text-gray-800">{data.moves}</div>
          </div>

          {/* Durasi */}
          <div className="text-center hover:scale-105 transition">
            <div className="w-14 h-14 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
              ⏱️
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Durasi</div>
            <div className="text-2xl font-bold text-gray-800">{formatDuration(data.time)}</div>
          </div>
        </div>
      

        {/* Actions */}
        <div ref={actionRef} className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
          <button
            onClick={() => {
              resetGame();
              router.push("/game/memory");
            }}
            className="px-4 py-2 rounded-lg bg-white border hover:shadow-md flex items-center gap-2"
          >
            <Repeat className="w-4 h-4 text-pink-600" /> <span>Main Lagi</span>
          </button>

          <button
            onClick={downloadAchievement}
            className="px-4 py-2 rounded-lg bg-white border hover:shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-pink-600" /> <span>Download</span>
          </button>

          <button
            onClick={shareResults}
            className="px-4 py-2 rounded-lg bg-white border hover:shadow-md flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-pink-600" /> <span>Bagikan</span>
          </button>
        </div>

        {/* Recommendations */}
        <div ref={recommendationsRef} className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Baca juga biar makin pinter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a className="group block hover:scale-[1.03] transition shadow-lg rounded-lg overflow-hidden">
              <div className="h-44 bg-[linear-gradient(180deg,#ffedf2,#fff1f6)] flex items-end p-4">
                <h4 className="font-semibold text-gray-800 group-hover:text-pink-600">HIV? Gak Usah Panik, Yuk Kenalan Dulu!</h4>
              </div>
            </a>
            <a className="group block hover:scale-[1.03] transition shadow-lg rounded-lg overflow-hidden">
              <div className="h-44 bg-[linear-gradient(180deg,#eef2ff,#f5f7ff)] flex items-end p-4">
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600">Seks Itu Apa Sih? Biar Gak Salah Paham</h4>
              </div>
            </a>
            <a className="group block hover:scale-[1.03] transition shadow-lg rounded-lg overflow-hidden">
              <div className="h-44 bg-[linear-gradient(180deg,#fff0f6,#fff7fa)] flex items-end p-4">
                <h4 className="font-semibold text-gray-800 group-hover:text-red-600">Menstruasi Pertama: Kenapa dan Gak Usah Takut</h4>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
