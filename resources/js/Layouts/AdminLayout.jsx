import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menu = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Companies', href: '/admin/companies' },
        { label: 'Guests', href: '/admin/guests' },
        { label: 'Folders', href: '/admin/folders' },
        { label: 'Media Files', href: '/admin/media' },
        { label: 'Settings', href: '/admin/settings' },
    ];

    const userInitial = auth?.user?.name?.charAt(0)?.toUpperCase() || 'A';

    return (
        <div className="min-h-screen bg-[#F6F8FC]">
            {sidebarOpen && (
                <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    aria-label="Close sidebar overlay"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col bg-[#07101F] p-6 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="mb-8 flex items-center justify-between lg:block lg:text-center">
                    <div>
                        <img
                            src="/images/MediaValut.png"
                            alt="MediaVault"
                            className="mx-auto h-16 w-auto object-contain lg:h-20"
                        />

                        <h1 className="mt-3 text-xl font-black tracking-tight lg:text-2xl">
                            Cloud
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Admin Dashboard
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {menu.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center rounded-2xl px-5 py-4 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <span className="mr-4 h-2 w-2 rounded-full bg-blue-400 opacity-0 transition group-hover:opacity-100" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-black text-white">
                            {userInitial}
                        </div>

                        <div>
                            <p className="text-sm font-bold">
                                {auth?.user?.name || 'Admin User'}
                            </p>

                            <p className="text-xs capitalize text-slate-400">
                                {auth?.user?.role || 'admin'}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                    >
                        Logout
                    </Link>
                </div>
            </aside>

            <main className="min-h-screen lg:ml-[290px]">
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10 lg:py-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white lg:hidden"
                        >
                            ☰
                        </button>

                        <div>
                            <h2 className="text-xl font-black text-slate-950 sm:text-2xl lg:text-3xl">
                                {title}
                            </h2>

                            <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                                Manage companies, guests, folders, media files and settings.
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">
                                {auth?.user?.name || 'Admin User'}
                            </p>

                            <p className="text-xs capitalize text-slate-500">
                                {auth?.user?.role || 'admin'}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                            {userInitial}
                        </div>
                    </div>
                </header>

                <section className="p-4 sm:p-6 lg:p-8">{children}</section>
            </main>
        </div>
    );
}