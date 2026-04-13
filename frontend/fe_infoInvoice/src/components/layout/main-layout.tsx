import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';

export default function MainLayout() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column">
                <Header />
                <main className="p-4 bg-light" style={{ minHeight: 'calc(100vh - 56px)' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};