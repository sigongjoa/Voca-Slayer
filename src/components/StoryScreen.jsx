import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export default function StoryScreen({ story, onNext }) {
    if (!story) return null;

    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
            {/* Chapter Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <div className="inline-block p-3 rounded-full bg-purple-500/20 mb-2">
                    <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {story.title}
                </h1>
            </motion.div>

            {/* Story Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="space-y-4">
                    <div
                        className="text-slate-200 leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ __html: story.content }}
                    />
                </Card>
            </motion.div>

            {/* Image Prompt Display (for debugging) */}
            {story.image_prompt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-slate-400">Scene: {story.image_prompt}</span>
                    </div>
                </motion.div>
            )}

            {/* Next Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Button onClick={onNext} className="w-full" size="lg">
                    Challenge the Boss! ⚔️
                </Button>
            </motion.div>
        </div>
    );
}
