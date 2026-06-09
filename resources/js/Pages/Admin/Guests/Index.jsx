import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ guests = [] }) {
    const [search, setSearch] = useState('');

    const filteredGuests = guests.filter((guest) => {
        const keyword = search.toLowerCase();

        return (
            guest.name?.toLowerCase().includes(keyword) ||
            guest.email?.toLowerCase().includes(keyword) ||
            guest.username?.toLowerCase().includes(keyword)
        );
    });

    const deleteGuest = (guest) => {
        if (confirm(`A je e sigurt që do ta fshish guest "${guest.name}"?`)) {
            router.post(
                `/admin/guests/${guest.id}`,
                { _method: 'delete' },
                { preserveScroll: true },
            );
        }
    };

    const toggleStatus = (guest) => {
        router.patch(`/admin/guests/${guest.id}/toggle-status`, {}, {
            preserveScroll: true,
        });
    };

    const totalGuests = guests.length;
    const activeGuests = guests.filter((guest) => guest.is_active).length;
    const inactiveGuests = guests.filter((guest) => !guest.is_active).length;

    return (
        <AdminLayout title="Guests">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                        Guest Management
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-slate-950">
                        Guests
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage guest accounts, access status and login details.
                    </p>
                </div>

                <Link
                    href="/admin/guests/create"
                    className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                    Add Guest
                </Link>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-3">
                {[
                    ['Total Guests', totalGuests],
                    ['Active Guests', activeGuests],
                    ['Inactive Guests', inactiveGuests],
                ].map(([label, value]) => (
                    <div
                        key={label}
                        className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <p className="text-sm font-semibold text-slate-500">
                            {label}
                        </p>

                        <h2 className="mt-3 text-4xl font-black text-slate-950">
                            {value}
                        </h2>
                    </div>
                ))}
            </div>

            <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
                <input
                    type="text"
                    placeholder="Search by name, email or username..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-[#F6F8FC] px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                />
            </div>

            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 bg-[#F6F8FC]">
                            <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                                Guest
                            </th>
                            <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                                Username
                            </th>
                            <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                                Email
                            </th>
                            <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                                Status
                            </th>
                            <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredGuests.map((guest) => {
                            const initial =
                                guest.name?.charAt(0)?.toUpperCase() || 'G';

                            return (
                                <tr
                                    key={guest.id}
                                    className="border-b border-slate-100 transition hover:bg-[#F8FAFC]"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                                                {initial}
                                            </div>

                                            <div>
                                                <p className="font-black text-slate-950">
                                                    {guest.name}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Guest account
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                                        {guest.username || '-'}
                                    </td>

                                    <td className="px-6 py-5 text-sm text-slate-500">
                                        {guest.email || '-'}
                                    </td>

                                    <td className="px-6 py-5">
                                        <button
                                            type="button"
                                            onClick={() => toggleStatus(guest)}
                                            className={`rounded-full px-4 py-2 text-xs font-black transition ${
                                                guest.is_active
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                            }`}
                                        >
                                            {guest.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/guests/${guest.id}/edit`}
                                                className="rounded-2xl bg-[#F6F8FC] px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => deleteGuest(guest)}
                                                className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredGuests.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center">
                                    <h3 className="text-xl font-black text-slate-950">
                                        No guests found
                                    </h3>

                                    <p className="mt-2 text-slate-500">
                                        Try another search keyword or create a new guest.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}