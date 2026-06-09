import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Create({ companies = [] }) {
    const { data, setData, processing, errors } = useForm({
        company_id: '',
        name: '',
        username: '',
        email: '',
        password: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();

        router.post('/admin/guests', data, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Create Guest">
            <Head title="Create Guest" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-900">
                        Create Guest
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Add a new guest account and assign it to a company.
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
                                        {company.name} ({company.username})
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
                                placeholder="Example: Ronila Guest"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
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
                                placeholder="example_guest"
                            />

                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.username}
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
                                placeholder="guest@example.com"
                            />

                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                                placeholder="Minimum 6 characters"
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
                                {processing ? 'Creating...' : 'Create Guest'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}