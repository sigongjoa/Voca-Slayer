import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1',
        secondary: 'bg-slate-700 text-white hover:bg-slate-600 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1',
        outline: 'border-2 border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white',
        ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/50',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 border-b-4 border-red-800 active:border-b-0 active:translate-y-1',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base font-bold',
        lg: 'px-8 py-4 text-lg font-bold',
        icon: 'p-2',
    };

    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'rounded-xl transition-all duration-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
});

Button.displayName = 'Button';

export { Button };
