import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const { isAuthenticated } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <div className="dashboard-layout">
            <Header />

            <div className="dashboard-wrapper">
                {/* Mobile Sidebar Toggle (Floating if needed, but Header handles menu) */}
                {/* 
                   Note: The main Header has a hamburger menu that usually toggles the mobile nav 
                   for the main site. For dashboard, we might want to repurpose it or add a 
                   secondary toggle. 
                   
                   Based on UI Guideline, the Header handles mobile menu. 
                   But for Dashboard, we have a Sidebar. 
                   Let's add a sidebar toggle button specific for dashboard on mobile/tablet 
                   if the main header doesn't cover it.
                   
                   However, let's stick to the plan: Sidebar is fixed on desktop, hidden on mobile.
                   We need a way to open it on mobile. 
                   We'll add a small toggle bar on mobile if sidebar is hidden.
                */}
                <button
                    className="dashboard-sidebar-toggle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <Menu size={20} />
                    <span>選單</span>
                </button>

                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
