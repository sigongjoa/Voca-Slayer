import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';

export default function ActionInputScreen({ onSubmit }) {
    const [action, setAction] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (action.trim()) {
            onSubmit(action);
            setAction('');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <div className="inline-block p-3 rounded-full bg-green-500/20 mb-2">
                    <Compass className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                    What will you do next?
                </h1>
                <p className="text-slate-400">Your choice will shape the next chapter...</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                Your Action
                            </label>
                            <Input
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                placeholder="예: 블랙홀로 돌진한다, 마법 주문을 외운다..."
                                className="text-lg"
                            />
                        </div>

                        <Button type="submit" disabled={!action.trim()} className="w-full" size="lg">
                            Continue Adventure! 🚀
                        </Button>
                    </form>
                </Card>
            </motion.div>

            {/* Suggested Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
            >
                <p className="text-xs text-slate-500 text-center">Suggested actions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {['탐험을 계속한다', '숨겨진 방을 찾는다', '적과 싸운다', '아이템을 사용한다'].map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => setAction(suggestion)}
                            className="px-3 py-1 text-xs rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-all"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
