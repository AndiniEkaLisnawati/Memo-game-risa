"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { EnhancedButton } from "./EnchancedButton";
import { Badge } from "./ui/badge";
import { Clock, Target, Trophy, Users } from "lucide-react";

const GameCard = ({
  title,
  description,
  points,
  timeEstimate,
  difficulty,
  completedBy,
  onPlay,
  isCompleted = false,
}) => {
  const difficultyColors = {
    Mudah: "bg-green-100 text-green-700 border-green-200",
    Sedang: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Sulit: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <Card className="group relative max-w-screen md:min-w-md overflow-hidden backdrop-blur-md bg-white/70 hover:bg-white/90 border border-pink-200 shadow-md rounded-xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      {/* Gradient background floating effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-transparent to-pink-200 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
            {title}
          </CardTitle>
          {isCompleted && (
            <Trophy className="h-6 w-6 text-yellow-500 animate-bounce" />
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        <p className="text-gray-600 leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge className={difficultyColors[difficulty]}>
            <Target className="h-3 w-3 mr-1" />
            {difficulty}
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            {timeEstimate}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-yellow-600">{points} poin</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{completedBy.toLocaleString("id-ID")} player</span>
          </div>
        </div>

        <EnhancedButton
          onClick={onPlay}
          disabled={isCompleted}
          variant={isCompleted ? "ghost" : "default"}
          size="lg"
          className="w-full mt-4"
          animation="hover"
        >
          {isCompleted ? (
            <>
              <Trophy className="h-4 w-4" />
              Sudah Selesai
            </>
          ) : (
            "Mulai Main"
          )}
        </EnhancedButton>
      </CardContent>
    </Card>
  );
};

export default GameCard;
