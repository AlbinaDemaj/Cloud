import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

const Icon = ({ children }) => (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
        {children}
    </div>
);

export default function Dashboard({
    totalCompanies = 0,
    activeCompanies = 0,
    totalGuests = 0,
    totalMedia = 0,
}) {
    const stats = [
        {
            label: 'Companies',
            value: totalCompanies,
            href: '/admin/companies',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M6 21V7l6-3 6 3v14M9 10h.01M12 10h.01M15 10h.01M9 14h.01M12 14h.01M15 14h.01" />
                </svg>
            ),
        },
        {
            label: 'Active Companies',
            value: activeCompanies,
            href: '/admin/companies',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" />
                </svg>
            ),
        },
        {
            label: 'Guests',
            value: totalGuests,
            href: '/admin/guests',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 21a8 8 0 0116 0" />
                </svg>
            ),
        },
        {
            label: 'Media Files',
            value: totalMedia,
            href: '/admin/media',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7zM8 15l2.5-3 3 3.5L15 14l3 4H6l2-3z" />
                </svg>
            ),
        },
    ];

    return (
        <AdminLayout title="Admin Dashboard">
            <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="group rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    {item.label}
                                </p>

                                <h3 className="mt-3 text-5xl font-black text-slate-950">
                                    {item.value}
                                </h3>
                            </div>

                            <Icon>{item.icon}</Icon>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm xl:col-span-2">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                                Overview
                            </p>

                            <h3 className="mt-3 text-3xl font-black text-slate-950">
                                MediaVault Control Center
                            </h3>

                            <p className="mt-4 max-w-2xl leading-7 text-slate-500">
                                Manage companies, guests, media files and access
                                permissions from one clean admin panel.
                            </p>
                        </div>

                        <img
                            src="/images/MediaValut.png"
                            alt="MediaVault"
                            className="hidden h-24 w-auto object-contain md:block"
                        />
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {[
                            ['Companies', '/admin/companies'],
                            ['Guests', '/admin/guests'],
                            ['Media Files', '/admin/media'],
                        ].map(([label, href]) => (
                            <Link
                                key={label}
                                href={href}
                                className="rounded-3xl bg-[#F6F8FC] p-5 transition hover:bg-slate-100"
                            >
                                <p className="text-sm font-semibold text-slate-500">
                                    Manage
                                </p>
                                <h4 className="mt-2 text-lg font-black text-slate-950">
                                    {label}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                        Quick Actions
                    </p>

                    <div className="mt-6 space-y-3">
                        {[
                            ['Add New Company', '/admin/companies/create'],
                            ['Add New Guest', '/admin/guests/create'],
                            ['View Media Files', '/admin/media'],
                            ['Open Settings', '/admin/settings'],
                        ].map(([label, href]) => (
                            <Link
                                key={label}
                                href={href}
                                className="block rounded-2xl bg-[#F6F8FC] px-5 py-4 font-bold text-slate-800 transition hover:bg-slate-100"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}