import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Create({
    companies = [],
    guests = [],
}) {
    const { data, setData, processing, errors } = useForm({
        company_id: '',
        guest_id: '',
        name: '',
        is_visible: true,
    });

    const submit = (e) => {
        e.preventDefault();

        router.post('/admin/folders', data, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Create Folder">
            <Head title="Create Folder" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-900">
                        Create Folder
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create a folder and assign it to a company or guest.
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
                                onChange={(e) =>
                                    setData('company_id', e.target.value)
                                }
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            >
                                <option value="">
                                    Select company
                                </option>

                                {companies.map((company) => (
                                    <option
                                        key={company.id}
                                        value={company.id}
                                    >
                                        {company.name}
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
                                Guest (Optional)
                            </label>

                            <select
                                value={data.guest_id}
                                onChange={(e) =>
                                    setData('guest_id', e.target.value)
                                }
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            >
                                <option value="">
                                    No guest selected
                                </option>

                                {guests.map((guest) => (
                                    <option
                                        key={guest.id}
                                        value={guest.id}
                                    >
                                        {guest.name}
                                    </option>
                                ))}
                            </select>

                            {errors.guest_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.guest_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700">
                                Folder Name
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Example: Wedding Photos"
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                            <input
                                type="checkbox"
                                checked={data.is_visible}
                                onChange={(e) =>
                                    setData('is_visible', e.target.checked)
                                }
                                className="rounded border-slate-300"
                            />

                            <span className="text-sm font-bold text-slate-700">
                                Visible to guest
                            </span>
                        </label>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href="/admin/folders"
                                className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-2xl bg-[#071437] px-6 py-3 text-sm font-bold text-white hover:bg-[#0B1D4D] disabled:opacity-50"
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Folder'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}