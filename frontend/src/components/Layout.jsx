import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
    const location = useLocation();
    const isSimulator = location.pathname === '/simulator';

    return (
        <div className="flex h-screen bg-background font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-full">
                <div className={cn(
                    isSimulator ? "h-full" : "max-w-7xl mx-auto py-8 px-6"
                )}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
