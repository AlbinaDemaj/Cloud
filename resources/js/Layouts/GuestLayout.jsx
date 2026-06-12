import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children, title = 'Guest Dashboard' }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const menu = [
        {
            label: 'Dashboard',
            href: '/guest/dashboard',
        },
        {
            label: 'Folders',
            href: '/guest/folders',
        },
    ];

    const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'G';

    return (
        <div className="min-h-screen bg-[#F6F8FC]">
            <aside className="fixed left-0 top-0 hidden h-screen w-[290px] flex-col bg-[#07101F] p-6 text-white shadow-2xl lg:flex">
                <Link href="/" className="mb-10 flex items-center gap-4">
                    <img
                        src="/images/MediaValut.png"
                        alt="Cloud"
                        className="h-14 w-auto object-contain"
                    />

                    <div>
                        <h1 className="text-2xl font-black tracking-wide">
                            Cloud
                        </h1>
                        <p className="text-xs text-slate-400">
                            Guest Panel
                        </p>
                    </div>
                </Link>

                <nav className="space-y-2">
                    {menu.map((item) => {
                        const active = window.location.pathname.startsWith(
                            item.href,
                        );

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                    active
                                        ? 'bg-white text-[#07101F]'
                                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto rounded-2xl bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-[#07101F]">
                            {userInitial}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                                {user?.name || 'Guest'}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-[290px]">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">
                                {title}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Welcome back, {user?.name || 'Guest'}
                            </p>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded-xl bg-[#07101F] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Logout
                        </Link>
                    </div>

                    <div className="mt-4 flex gap-2 lg:hidden">
                        {menu.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </header>

                <main className="p-5 lg:p-8">{children}</main>
            </div>
        </div>
    );
}