import CompanyLayout from '@/Layouts/CompanyLayout';
import { Link } from '@inertiajs/react';
import { Eye, Users } from 'lucide-react';

export default function Index({ guests = [] }) {
    return (
        <CompanyLayout title="Guests">
            <div className="space-y-8">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                        Guest Access
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-slate-950">
                        Guests
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Select a guest to open their folders and upload media.
                    </p>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-950">
                                Assigned Guests
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {guests.length} guests assigned to your company
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <Users size={22} />
                        </div>
                    </div>

                    {guests.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {guests.map((guest) => {
                                const initial =
                                    guest.name?.charAt(0)?.toUpperCase() || 'G';

                                return (
                                    <div
                                        key={guest.id}
                                        className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white">
                                                {initial}
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-black text-slate-950">
                                                    {guest.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {guest.username || 'No username'} ·{' '}
                                                    {guest.email || 'No email'}
                                                </p>

                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${
                                                        guest.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-rose-50 text-rose-700'
                                                    }`}
                                                >
                                                    {guest.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            href={route('company.guests.show', guest.id)}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                                        >
                                            <Eye size={17} />
                                            View / Upload
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                            <Users className="mx-auto text-slate-300" size={56} />

                            <h3 className="mt-4 text-xl font-black text-slate-950">
                                No guests assigned yet
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Guests will appear here after the admin assigns them to your company.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </CompanyLayout>
    );
}