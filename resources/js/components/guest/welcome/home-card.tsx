import React from 'react';

export const HomeCard = ({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) => (
    <div className={`rounded-lg border ${className}`} {...props}>
        {children}
    </div>
);

export const CardHeader = ({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) => (
    <div className={`p-4 ${className}`} {...props}>
        {children}
    </div>
);

export const HomeCardTitle = ({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) => (
    <h3 className={`font-semibold ${className}`} {...props}>
        {children}
    </h3>
);

export const HomeCardDescription = ({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) => (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>
        {children}
    </p>
);
