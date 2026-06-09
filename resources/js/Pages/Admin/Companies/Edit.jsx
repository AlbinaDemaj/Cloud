import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ company }) {
    const { data, setData, processing, errors } = useForm({
        name: company?.name || '',
        username: company?.username || '',
        email: company?.email || '',
        password: '',
        is_active: Boolean(company?.is_active),
    });

    const submit = (e) => {
        e.preventDefault();

        if (!company?.id) {
            alert('Company ID mungon.');
            return;
        }

        router.post(`/admin/companies/${company.id}`, {
            ...data,
            _method: 'put',
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Edit Company">
            <Head title="Edit Company" />

            <div className="mx-auto max-w-3xl">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-black text-slate-900">
                        Edit Company
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Company ID: {company?.id}
                    </p>

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700">
                                Username
                            </label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Leave empty to keep old password"
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-slate-300"
                            />
                            <span className="text-sm font-bold text-slate-700">
                                Active company account
                            </span>
                        </label>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href="/admin/companies"
                                className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-2xl bg-[#071437] px-6 py-3 text-sm font-bold text-white hover:bg-[#0B1D4D] disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Company'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}