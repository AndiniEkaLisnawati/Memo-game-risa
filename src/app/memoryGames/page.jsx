// pages/game/memory.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGameStore } from "../../lib/useGameStore";
import { ArrowLeft } from "lucide-react";

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
  const [time, localSetTime] = useState(0);
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
          setTime(t + 1);
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, setTime]);

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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white/60 hover:bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-pink-600" />
        </button>
        <h1 className="text-2xl font-extrabold text-pink-600">
          🎀 Memory Game Kesehatan
        </h1>
      </div>

      {/* stats */}
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <div className="bg-pink-50 px-3 py-2 rounded-full text-sm font-medium">
          ⏱️ {time}s
        </div>
        <div className="bg-pink-50 px-3 py-2 rounded-full text-sm font-medium">
          🎯 {points} poin
        </div>
        <div className="bg-pink-50 px-3 py-2 rounded-full text-sm font-medium">
          🔄 {moves} gerakan
        </div>
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
            localSetTime(0);
            resetGame();
            setRunning(true);
          }}
          className="px-3 py-2 rounded-lg bg-white/80 hover:shadow transition"
        >
          Reset
        </button>
      </div>

      {/* cards */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-2"
        style={{ perspective: 1200 }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 cursor-pointer"
            onClick={() => flipCard(card)}
          >
            <div
              ref={(el) => (cardRefs.current[card.id] = el)}
              className="relative w-full h-full rounded-2xl shadow-md"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(0deg)",
              }}
            >
              {/* back */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl backface-hidden border border-pink-200"
                style={{
                  background: "linear-gradient(135deg,#ff7aa6,#ff5680 60%)",
                }}
              >
                <div className="text-4xl">🎀</div>
              </div>
              {/* front */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/90 border-2 border-pink-300 text-pink-700 font-semibold text-sm px-3 text-center backface-hidden"
                style={{ transform: "rotateY(180deg)" }}
              >
                <div className="leading-snug">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-pink-400">
          Match semua pasangan untuk melihat hasilmu.
        </p>
      </div>
    </div>
  );
}
