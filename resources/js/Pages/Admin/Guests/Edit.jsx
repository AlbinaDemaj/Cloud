import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Edit({ guest, companies = [] }) {
    const { data, setData, processing, errors } = useForm({
        company_id: guest?.company_id || '',
        name: guest?.name || '',
        email: guest?.email || '',
        password: '',
        is_active: Boolean(guest?.is_active),
    });

    const submit = (e) => {
        e.preventDefault();

        if (!guest?.id) {
            alert('Guest ID mungon.');
            return;
        }

        router.post(
            `/admin/guests/${guest.id}`,
            {
                ...data,
                _method: 'put',
            },
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AdminLayout title="Edit Guest">
            <Head title="Edit Guest" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-900">
                        Edit Guest
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Update guest account information and company assignment.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700">
                                Company
                            </label>

                            <select
                                value={data.company_id}
                                onChange={(e) => setData('company_id', e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            >
                                <option value="">Select company</option>

                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name} ({company.email})
                                    </option>
                                ))}
                            </select>

                            {errors.company_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.company_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700">
                                Guest Name
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
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
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
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
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
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
                                Active guest account
                            </span>
                        </label>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href="/admin/guests"
                                className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-2xl bg-[#071437] px-6 py-3 text-sm font-bold text-white hover:bg-[#0B1D4D] disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Guest'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}