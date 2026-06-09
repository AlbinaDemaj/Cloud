import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ companies = [] }) {
    const deleteCompany = (company) => {
        if (!company?.id) {
            alert('Company ID mungon.');
            return;
        }

        if (confirm(`A je e sigurt që do ta fshish kompaninë "${company.name}"?`)) {
            router.post(
                `/admin/companies/${company.id}`,
                { _method: 'delete' },
                { preserveScroll: true },
            );
        }
    };

    return (
        <AdminLayout title="Companies">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                        Company Management
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-slate-950">
                        Companies
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage company accounts, status, guests and access.
                    </p>
                </div>

                <Link
                    href="/admin/companies/create"
                    className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                    Add Company
                </Link>
            </div>

            {companies.length === 0 ? (
                <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
                    <img
                        src="/images/MediaValut.png"
                        alt="MediaVault"
                        className="mx-auto h-20 w-auto object-contain"
                    />

                    <h3 className="mt-6 text-2xl font-black text-slate-950">
                        No companies yet
                    </h3>

                    <p className="mt-3 text-slate-500">
                        Create your first company to start managing guests and media.
                    </p>

                    <Link
                        href="/admin/companies/create"
                        className="mt-6 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white"
                    >
                        Create Company
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {companies.map((company) => {
                        const initial = company.name?.charAt(0)?.toUpperCase() || 'C';

                        return (
                            <div
                                key={company.id}
                                className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-black text-white">
                                            {initial}
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-black text-slate-950">
                                                {company.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {company.user?.email || company.email || 'No email'}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`rounded-full px-4 py-2 text-xs font-bold ${
                                            company.is_active
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-rose-50 text-rose-700'
                                        }`}
                                    >
                                        {company.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="rounded-3xl bg-[#F6F8FC] p-5">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            Username
                                        </p>

                                        <h4 className="mt-2 truncate font-black text-slate-950">
                                            {company.user?.username || company.username || '-'}
                                        </h4>
                                    </div>

                                    <div className="rounded-3xl bg-[#F6F8FC] p-5">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            Guests
                                        </p>

                                        <h4 className="mt-2 text-2xl font-black text-slate-950">
                                            {company.guests_count || 0}
                                        </h4>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <Link
                                        href={`/admin/companies/${company.id}/edit`}
                                        className="flex-1 rounded-2xl bg-[#F6F8FC] px-4 py-3 text-center text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => deleteCompany(company)}
                                        className="flex-1 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
}