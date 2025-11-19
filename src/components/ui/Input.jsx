import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                'flex h-12 w-full rounded-xl border-2 border-slate-700 bg-slate-900/50 px-4 py-2 text-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
                className
            )}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export { Input };
