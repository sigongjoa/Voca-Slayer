import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Scroll, Ghost, Rocket, Castle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { GENRES, DEFAULT_HERO_NAME } from '../lib/constants';
import { cn } from '../lib/utils';

export default function InputScreen({ onStart }) {
    const [heroName, setHeroName] = useState(DEFAULT_HERO_NAME);
    const [targetWords, setTargetWords] = useState(['', '', '']);
    const [selectedGenre, setSelectedGenre] = useState(GENRES[0].id);
    const [error, setError] = useState('');

    const handleWordChange = (index, value) => {
        const newWords = [...targetWords];
        newWords[index] = value;
        setTargetWords(newWords);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!heroName.trim()) {
            setError('Please enter a hero name!');
            return;
        }
        if (targetWords.some(w => !w.trim())) {
            setError('Please enter all 3 magic words!');
            return;
        }

        onStart({
            heroName,
            targetWords,
            genre: selectedGenre
        });
    };

    const getGenreIcon = (id) => {
        switch (id) {
            case 'fantasy': return <Castle className="w-6 h-6" />;
            case 'sf': return <Rocket className="w-6 h-6" />;
            case 'horror': return <Ghost className="w-6 h-6" />;
            default: return <Scroll className="w-6 h-6" />;
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 space-y-6">
            <div className="text-center space-y-2">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block p-3 rounded-full bg-blue-500/20 mb-2"
                >
                    <Sword className="w-12 h-12 text-blue-400" />
                </motion.div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Word Master
                </h1>
                <p className="text-slate-400">Prepare for your adventure!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Hero Name</label>
                        <Input
                            value={heroName}
                            onChange={(e) => setHeroName(e.target.value)}
                            placeholder="Enter your name..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Magic Words (Target Vocabulary)</label>
                        {targetWords.map((word, i) => (
                            <Input
                                key={i}
                                value={word}
                                onChange={(e) => handleWordChange(i, e.target.value)}
                                placeholder={`Magic Word #${i + 1}`}
                            />
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Select Genre</label>
                        <div className="grid grid-cols-3 gap-2">
                            {GENRES.map((genre) => (
                                <button
                                    key={genre.id}
                                    type="button"
                                    onClick={() => setSelectedGenre(genre.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2",
                                        selectedGenre === genre.id
                                            ? "border-blue-500 bg-blue-500/20 text-white"
                                            : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                                    )}
                                >
                                    {getGenreIcon(genre.id)}
                                    <span className="text-xs font-bold">{genre.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-center text-sm font-bold"
                    >
                        {error}
                    </motion.p>
                )}

                <Button type="submit" className="w-full" size="lg">
                    Start Adventure
                </Button>
            </form>
        </div>
    );
}
