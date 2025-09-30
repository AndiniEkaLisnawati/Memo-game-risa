"use client"

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import  Herogame from "../../public/image/Illustration_hero_gamification.png"
import Trophy from "../../public/image/piala.png"
import CustomButton from "../components/ui/CustomButton";
import Link from "next/link";
import { Card, CardContent } from "../components/ui/card";
import { Star, Timer, TrophyIcon, Users } from "lucide-react";
import GameCard from "@/components/GameCard";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const fadeSlideRef = useRef([]);
  const scaleInRef = useRef([]);
  const fadeSlideUpRef = useRef([]);
  const trophyRef = useRef(null);

  // supaya nggak duplicate
  fadeSlideRef.current = [];
  scaleInRef.current = [];
  fadeSlideUpRef.current = [];

  const addFadeSlide = (el) => {
    if (el && !fadeSlideRef.current.includes(el)) fadeSlideRef.current.push(el);
  };
  const addScaleIn = (el) => {
    if (el && !scaleInRef.current.includes(el)) scaleInRef.current.push(el);
  };
  const addFadeSlideUp = (el) => {
    if (el && !fadeSlideUpRef.current.includes(el))
      fadeSlideUpRef.current.push(el);
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // fade slide
      fadeSlideRef.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.2,
          ease: "back.out(1.7)",
        });
      });

      // scale in
      scaleInRef.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.5 + i * 0.2,
          ease: "elastic.out(1, 0.6)",
        });
      });

      // fade slide up
      fadeSlideUpRef.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 1 + i * 0.1,
          ease: "power2.out",
        });
      });

      // trophy + confetti
      if (trophyRef.current) {
        gsap.fromTo(
          trophyRef.current,
          { opacity: 0, scale: 0, rotation: 0 },
          {
            opacity: 1,
            scale: 1,
            rotation: 360,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: trophyRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
              onEnter: () => {
                confetti({
                  particleCount: 500,
                  spread: 90,
                  origin: { y: 0.6 },
                });
              },
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-gradient-to-br from-pink-100 via-white to-yellow-100">
   

      {/* HERO */}
      <section className="w-full py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between bg-pink-100/90">
        <div className="md:w-1/2 space-y-6">
          <h1 ref={addFadeSlide} className="text-4xl md:text-6xl font-bold text-pink-600">
            Yuk, Main & Jadi Juara!
          </h1>
          <p ref={addFadeSlide} className="text-gray-700 text-lg">
            Kumpulin poin, seru-seruan, dan lihat siapa yang juara di leaderboard!
          </p>
          <div ref={addFadeSlide} className="flex gap-4">
            <Link href="/memoryGames">
              <CustomButton title="Mainkan Sekarang!" className="button-11 text-nowrap px-4 py-2 md:px-6 md:py-4 animate-pulse-slow" />
            </Link>
            <Link href="#leaderboard">
              <CustomButton title="Leaderboard" className="button-10 px-4 py-2 md:px-6 md:py-4  animate-pulse-slow" />
            </Link>
          </div>
        </div>
        <div ref={addScaleIn} className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <Image
            src={Herogame}
            alt="Hero Illustration"
            width={400}
            height={400}
            className="max-h-80 drop-shadow-xl"
          />
        </div>
      </section>


   {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="gradient-card shadow-card">
          <CardContent className="p-4 text-center">
            <TrophyIcon className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Games Selesai</div>
          </CardContent>
        </Card>
        <Card className="gradient-card shadow-card">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">2,456</div>
            <div className="text-sm text-muted-foreground">Total Poin</div>
          </CardContent>
        </Card>
        <Card className="gradient-card shadow-card">
          <CardContent className="p-4 text-center">
            <Timer className="h-8 w-8 text-info mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">87%</div>
            <div className="text-sm text-muted-foreground">Rata-rata Skor</div>
          </CardContent>
        </Card>
        <Card className="gradient-card shadow-card">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">#4</div>
            <div className="text-sm text-muted-foreground">Ranking Minggu Ini</div>
          </CardContent>
        </Card>
      </div> */}
      <main className="max-w-screen mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-16">
        <section className="w-full py-10 px-6 md:px-16 flex flex-col items-center">
          <h2 ref={addFadeSlide} className="text-3xl font-extrabold text-pink-700 mb-3">
            🎮 Pilih Game Kamu
          </h2>
          <p className="text-gray-600 text-lg text-center">Belajar sambil bermain! Kumpulan mini games seru untuk menguji dan meningkatkan pengetahuanmu tentang kesehatan reproduksi.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-16 items-center mt-8">
            <GameCard
              title="Memory Cards"
              description="Uji pengetahuanmu dengan mencocokkan pasangan kartu seputar kesehatan reproduksi."
              points={100}
              timeEstimate="5 menit"
              difficulty="Mudah"
              completedBy={50}
              onPlay={() => console.log("Playing Memory Cards")}
            />
          </div>
        </section>

        <section className="py-10 px-6 md:px-16 text-center">
          <div className="mb-2 flex flex-col justify-center items-center">
            <svg viewBox="0 0 400 350" className="w-[400px] h-[180px]" ref={addFadeSlide}>
              <defs>
                <path id="curveSelamat" d="M 0,300 A 300,200 0 0 1 400,300" />
              </defs>
              <text fill="black" fontSize="80" fontWeight="bold" textAnchor="middle">
                <textPath startOffset="50%" href="#curveSelamat">Selamat</textPath>
              </text>
            </svg>
            <Image
              ref={trophyRef}
              src={Trophy}
              alt="Trophy"
              width={200}
              height={200}
              className="relative mt-6"
            />
            <p className="mt-4 text-lg font-semibold text-black bg-pink-300 px-4 py-1 border-2 border-black shadow-md">
              Kamu mendapatkan peringkat ke-1 minggu ini
            </p>
          </div>
        </section>

        {/* LEADERBOARD */}
        <section id="leaderboard" className="py-10 px-6 md:px-16">
          <h2 ref={addFadeSlide} className="text-3xl font-bold text-pink-600 mb-6">
            🏆 Leaderboard
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-pink-200 text-gray-900">
                <tr>
                  <th className="py-3 px-4 text-left">Rank</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100">
                {[
                  ["🥇", "Rachel Green", "1023"],
                  ["🥈", "Robert Thomson", "985"],
                  ["🥉", "Monica Geller", "882"],
                ].map(([rank, name, points], i) => (
                  <tr key={i} ref={addFadeSlideUp}>
                    <td className="py-3 px-4">{rank}</td>
                    <td className="py-3 px-4">{name}</td>
                    <td className="py-3 px-4">{points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>


    </div>
  );
}
