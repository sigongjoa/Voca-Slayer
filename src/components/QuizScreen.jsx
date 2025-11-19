import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Skull, Heart } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export default function QuizScreen({ quiz, hp, maxHp, onAnswer }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    if (!quiz) return null;

    const handleSubmit = () => {
        const isCorrect = selectedAnswer === quiz.answer;
        setShowResult(true);

        setTimeout(() => {
            onAnswer(isCorrect);
            setShowResult(false);
            setSelectedAnswer(null);
        }, 1500);
    };

    const isCorrect = selectedAnswer === quiz.answer;

    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
            {/* HP Display */}
            <div className="flex items-center justify-center gap-2">
                {Array.from({ length: maxHp }).map((_, i) => (
                    <Heart
                        key={i}
                        className={`w-8 h-8 ${i < hp ? 'text-red-500 fill-red-500' : 'text-slate-700'
                            }`}
                    />
                ))}
            </div>

            {/* Boss Monster */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: showResult && !isCorrect ? [1, 1.1, 1] : 1,
                    opacity: 1
                }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <div className="inline-block p-6 rounded-full bg-red-500/20 mb-4">
                    <Skull className="w-24 h-24 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-red-400">Boss Monster</h2>
            </motion.div>

            {/* Quiz Question */}
            <Card className="space-y-6">
                <h3 className="text-xl font-bold text-white text-center">
                    {quiz.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                    {quiz.options.map((option, index) => (
                        <motion.button
                            key={index}
                            onClick={() => !showResult && setSelectedAnswer(option)}
                            disabled={showResult}
                            whileHover={{ scale: showResult ? 1 : 1.02 }}
                            whileTap={{ scale: showResult ? 1 : 0.98 }}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${showResult && option === quiz.answer
                                    ? 'border-green-500 bg-green-500/20 text-green-400'
                                    : showResult && option === selectedAnswer
                                        ? 'border-red-500 bg-red-500/20 text-red-400'
                                        : selectedAnswer === option
                                            ? 'border-blue-500 bg-blue-500/20 text-white'
                                            : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            {option}
                        </motion.button>
                    ))}
                </div>

                {/* Submit Button */}
                {!showResult && (
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer}
                        className="w-full"
                        size="lg"
                    >
                        Attack! ⚔️
                    </Button>
                )}

                {/* Result Message */}
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`text-center text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'
                            }`}
                    >
                        {isCorrect ? '🎉 Correct! Boss defeated!' : '❌ Wrong! You took damage!'}
                    </motion.div>
                )}
            </Card>
        </div>
    );
}
