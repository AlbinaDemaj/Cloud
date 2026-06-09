import CompanyLayout from '@/Layouts/CompanyLayout';
import { Link } from '@inertiajs/react';

export default function Dashboard({
    guests = [],
    mediaCount = 0,
    photosCount = 0,
    videosCount = 0,
}) {
    const stats = [
        {
            label: 'Guests',
            value: guests.length,
            href: '/company/guests',
        },
        {
            label: 'Media Files',
            value: mediaCount,
            href: '/company/media',
        },
        {
            label: 'Photos',
            value: photosCount,
            href: '/company/media',
        },
        {
            label: 'Videos',
            value: videosCount,
            href: '/company/media',
        },
    ];

    return (
        <CompanyLayout title="Company Dashboard">
            <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <p className="text-sm font-semibold text-slate-500">
                                {item.label}
                            </p>

                            <h3 className="mt-3 text-5xl font-black text-slate-950">
                                {item.value}
                            </h3>

                            <div className="mt-6 h-2 rounded-full bg-slate-100">
                                <div className="h-2 w-2/3 rounded-full bg-slate-900" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm xl:col-span-2">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                                    Company Overview
                                </p>

                                <h2 className="mt-3 text-3xl font-black text-slate-950">
                                    Welcome to MediaVault
                                </h2>

                                <p className="mt-4 max-w-2xl leading-7 text-slate-500">
                                    Manage your guests, upload photos and videos,
                                    control visibility and organize your media
                                    library from one modern dashboard.
                                </p>
                            </div>

                            <img
                                src="/images/MediaValut.png"
                                alt="MediaVault"
                                className="hidden h-24 w-auto object-contain md:block"
                            />
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <div className="rounded-3xl bg-[#F6F8FC] p-5">
                                <p className="text-sm font-semibold text-slate-500">
                                    Guests
                                </p>

                                <h4 className="mt-2 text-3xl font-black text-slate-950">
                                    {guests.length}
                                </h4>
                            </div>

                            <div className="rounded-3xl bg-[#F6F8FC] p-5">
                                <p className="text-sm font-semibold text-slate-500">
                                    Photos
                                </p>

                                <h4 className="mt-2 text-3xl font-black text-slate-950">
                                    {photosCount}
                                </h4>
                            </div>

                            <div className="rounded-3xl bg-[#F6F8FC] p-5">
                                <p className="text-sm font-semibold text-slate-500">
                                    Videos
                                </p>

                                <h4 className="mt-2 text-3xl font-black text-slate-950">
                                    {videosCount}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                            Quick Actions
                        </p>

                        <div className="mt-6 space-y-3">
                            <Link
                                href="/company/guests"
                                className="block rounded-2xl bg-[#F6F8FC] px-5 py-4 font-bold text-slate-800 transition hover:bg-slate-100"
                            >
                                Manage Guests
                            </Link>

                            <Link
                                href="/company/media"
                                className="block rounded-2xl bg-[#F6F8FC] px-5 py-4 font-bold text-slate-800 transition hover:bg-slate-100"
                            >
                                Media Library
                            </Link>

                            <Link
                                href="/company/media"
                                className="block rounded-2xl bg-[#F6F8FC] px-5 py-4 font-bold text-slate-800 transition hover:bg-slate-100"
                            >
                                Upload Media
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
}