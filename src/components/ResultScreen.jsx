import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Skull, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export default function ResultScreen({ isVictory, turn, onRestart }) {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-4"
            >
                <div className={`inline-block p-6 rounded-full mb-4 ${isVictory ? 'bg-yellow-500/20' : 'bg-red-500/20'
                    }`}>
                    {isVictory ? (
                        <Trophy className="w-32 h-32 text-yellow-400" />
                    ) : (
                        <Skull className="w-32 h-32 text-red-400" />
                    )}
                </div>

                <h1 className={`text-4xl font-bold ${isVictory ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                    {isVictory ? '🎉 Victory!' : '💀 Game Over'}
                </h1>

                <p className="text-xl text-slate-300">
                    {isVictory
                        ? 'You conquered the dungeon!'
                        : 'You ran out of HP...'}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="space-y-4">
                    <h2 className="text-xl font-bold text-white text-center">
                        Adventure Summary
                    </h2>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 rounded-lg bg-slate-800/50">
                            <div className="text-3xl font-bold text-blue-400">{turn}</div>
                            <div className="text-sm text-slate-400">Chapters Completed</div>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-800/50">
                            <div className="text-3xl font-bold text-purple-400">
                                {isVictory ? 'S' : 'F'}
                            </div>
                            <div className="text-sm text-slate-400">Grade</div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Button onClick={onRestart} className="w-full" size="lg">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Start New Adventure
                </Button>
            </motion.div>
        </div>
    );
}
