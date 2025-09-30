
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGameStore } from "../../lib/useGameStore";
import {
  ArrowLeft, Gift,

  Sparkles,

  Timer,

  Target,

  Repeat,

  RotateCcw
} from "lucide-react";


// Data terms
const termsAndDefs = [
  { id: 1, term: "Ovulasi", definition: "Pelepasan sel telur dari ovarium" },
  { id: 2, term: "Menstruasi", definition: "Perdarahan bulanan dari rahim" },
  { id: 3, term: "Fertilitas", definition: "Kemampuan untuk menghasilkan keturunan" },
  { id: 4, term: "Kontrasepsi", definition: "Metode untuk mencegah kehamilan" },
  { id: 5, term: "Spermatogenesis", definition: "Proses pembentukan sperma" },
];

function shuffleArray(arr) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

export default function MemoryGamePage() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    audioRef.current = new Audio("/sounds/memo-backsound.mp3");
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.loop = true;

      audioRef.current.play().catch((e) => {
        console.log("Autoplay failed:", e);
      }
      );
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {  
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const router = useRouter();
  const { setResults, setPoints, setMoves, setTime, addMatched, resetGame } =
    useGameStore();
  const totalPairs = termsAndDefs.length;

  // State
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // cards flipped
  const [matched, setMatched] = useState([]); // pair ids
  const [moves, localSetMoves] = useState(0);
  const [points, localSetPoints] = useState(0);
  const [time, localSetTime] = useState(30);
  const [running, setRunning] = useState(true);

  const timerRef = useRef(null);
  const cardRefs = useRef({}); // ref ke wrapper animasi (cardInner)

  // init cards
  useEffect(() => {
    const generated = [];
    termsAndDefs.forEach((item) => {
      generated.push({
        id: `${item.id}-term`,
        value: item.term,
        pair: item.id,
        type: "term",
      });
      generated.push({
        id: `${item.id}-def`,
        value: item.definition,
        pair: item.id,
        type: "definition",
      });
    });
    setCards(shuffleArray(generated));
    resetGame();
  }, [resetGame]);

  // timer jalan
useEffect(() => {
  if (running) {
    timerRef.current = setInterval(() => {
      localSetTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          // simpan hasil akhir saat waktu habis
          const final = {
            points,
            moves,
            time: 0,
            matchedCount: matched.length,
            totalPairs,
            answers: matched.map((m) => m),
          };
          setResults(final);
          setTimeout(() => {
            router.push("/result/memory");
          }, 800);
          return 0;
        }
        setTime(t - 1);
        return t - 1;
      });
    }, 1000);
  }
  return () => clearInterval(timerRef.current);
}, [running, setTime, matched, moves, points, router, setResults, totalPairs]);

  // sync ke store
  useEffect(() => {
    setMoves(moves);
    setPoints(points);
    setTime(time);
  }, [moves, points, time, setMoves, setPoints, setTime]);

  // check game end
  useEffect(() => {
    if (matched.length === totalPairs && totalPairs > 0) {
      setRunning(false);
      const final = {
        points,
        moves,
        time,
        matchedCount: matched.length,
        totalPairs,
        answers: matched.map((m) => m),
      };
      setResults(final);
      setTimeout(() => {
        router.push("/result/memory");
      }, 900);
    }
  }, [matched, points, moves, time, totalPairs, router, setResults]);

  // flip
  const flipCard = (card) => {
    if (
      flipped.find((c) => c.id === card.id) ||
      matched.includes(card.pair) ||
      flipped.length === 2
    )
      return;

    const el = cardRefs.current[card.id];
    if (el) {
      gsap.to(el, {
        rotateY: 180,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => {
          setFlipped((f) => [...f, card]);
        },
      });
    }
  };

  // check pair
  useEffect(() => {
    if (flipped.length === 2) {
      localSetMoves((m) => m + 1);
      const [a, b] = flipped;
      if (a.pair === b.pair && a.type !== b.type) {
        // match
        localSetPoints((p) => p + 20);
        setMatched((m) => {
          addMatched(a.pair);
          return [...m, a.pair];
        });
        setTimeout(() => setFlipped([]), 300);
      } else {
        // not match
        setTimeout(() => {
          flipped.forEach((c) => {
            const el = cardRefs.current[c.id];
            if (el) {
              gsap.to(el, {
                rotateY: 0,
                duration: 0.45,
                ease: "power2.out",
              });
            }
          });
          setFlipped([]);
        }, 900);
      }
    }
  }, [flipped, addMatched]);


   return (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-white to-pink-50">
    {/* Background Decorative Elements */}
    <div className="absolute inset-0 -z-10">
      {/* Glow bubbles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,182,193,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,182,193,0.2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
    </div>

    {/* Content */}
    <div className="p-6 max-w-6xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white/60 hover:bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-pink-600" />
        </button>
        <button>
         
          <div
            onClick={toggleAudio}
            className="p-2 rounded-full bg-white/60 hover:bg-white shadow-sm"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 9v6m4-6v6m5 5h2a2 2 0 002-2v-3a7 7 0 00-7-7h-1.5M14 7V5a3 3 0 00-3-3l-1.35.27a48.4 48.4 0 00-7.6 3.18A3 3 0 002 8v3m19 9l-4-4m0 0l-4-4m4 4H9"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-600"
                fill="none"

                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 8a3 3 0 013 3v1m4 0a7 7 0 01-7 7h-1.5M14 7V5a3 3 0 00-3-3l-1.35.27a48.4 48.4 0 00-7.6 3.18A3 3 0 002 8v3m19 9l-4-4m0 0l-4-4m4 4H9"
                />
              </svg>
            )}
          </div>
        </button>
        <h1 className="text-2xl font-extrabold text-pink-600 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-pink-500" />
          Memory Game Kesehatan
        </h1>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-2 bg-pink-50/80 backdrop-blur px-3 py-2 rounded-full text-sm font-medium shadow">
          <Timer className="w-4 h-4 text-pink-500" />
          {time}s
        </div>
        <div className="flex items-center gap-2 bg-pink-50/80 backdrop-blur px-3 py-2 rounded-full text-sm font-medium shadow">
          <Target className="w-4 h-4 text-pink-500" />
          {points} poin
        </div>
        <div className="flex items-center gap-2 bg-pink-50/80 backdrop-blur px-3 py-2 rounded-full text-sm font-medium shadow">
          <Repeat className="w-4 h-4 text-pink-500" />
          {moves} gerakan
        </div>
       
      </div>

      {/* Cards */}
      <div
        className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-2"
        style={{ perspective: 1200 }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => flipCard(card)}
          >
            <div
              ref={(el) => (cardRefs.current[card.id] = el)}
              className="relative w-full h-full rounded-2xl shadow-lg"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(0deg)",
              }}
            >
              {/* Back */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl backface-hidden border border-pink-200 shadow-inner"
                style={{
                  background: "linear-gradient(135deg,#ff7aa6,#ff5680 60%)",
                }}
              >
                <Gift className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              {/* Front */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/95 border-2 border-pink-300 text-pink-700 font-semibold text-sm px-3 text-center backface-hidden"
                style={{ transform: "rotateY(180deg)" }}
              >
                <div className="leading-snug">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center my-8">
         <button
          onClick={() => {
            Object.values(cardRefs.current).forEach((c) =>
              gsap.to(c, { rotateY: 0, duration: 0.35 })
            );
            setCards(shuffleArray(cards));
            setMatched([]);
            setFlipped([]);
            localSetMoves(0);
            localSetPoints(0);
            localSetTime(30);
            resetGame();
            setRunning(true);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur hover:shadow-lg transition font-medium"
        >
          <RotateCcw className="w-4 h-4 text-pink-600" />
          Reset
        </button>
        <p className="text-sm text-pink-400 flex items-center gap-2 justify-center">
          <Sparkles className="w-4 h-4 text-pink-400" />
          Match semua pasangan untuk melihat hasilmu.
        </p>
      </div>
    </div>
  </div>
);

  

}
