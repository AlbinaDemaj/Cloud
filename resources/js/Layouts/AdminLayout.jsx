import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;

    const menu = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Companies', href: '/admin/companies' },
        { label: 'Guests', href: '/admin/guests' },
        { label: 'Folders', href: '/admin/folders' },
        { label: 'Media Files', href: '/admin/media' },
        { label: 'Settings', href: '/admin/settings' },
    ];

    const userInitial = auth?.user?.name?.charAt(0) || 'A';

    return (
        <div className="min-h-screen bg-[#F6F8FC]">
            <aside className="fixed left-0 top-0 flex h-screen w-[290px] flex-col bg-[#07101F] p-6 text-white shadow-2xl">
                <div className="mb-10 text-center">
                    <img
                        src="/images/MediaValut.png"
                        alt="MediaVault"
                        className="mx-auto h-20 w-auto object-contain"
                    />

                    <h1 className="mt-4 text-2xl font-black tracking-tight">
                        Cloud
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Admin Dashboard
                    </p>
                </div>

                <nav className="flex-1 space-y-2">
                    {menu.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
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

            <main className="ml-[290px] min-h-screen">
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-10 py-6 backdrop-blur-xl">
                    <div>
                        <h2 className="text-3xl font-black text-slate-950">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage companies, guests, folders, media files and
                            settings.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
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

                <section className="p-8">{children}</section>
            </main>
        </div>
    );
}