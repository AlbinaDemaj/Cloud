import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        profile: '',
        username: '',
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post('/admin/companies');
    };

    return (
        <AdminLayout title="Create Company">
            <Head title="Create Company" />

            <div className="max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Add Company
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Create a new company account and login credentials.
                        </p>
                    </div>

                    <Link
                        href="/admin/companies"
                        className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                    >
                        Back
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel value="Company Name" />

                        <TextInput
                            type="text"
                            value={data.name}
                            className="mt-2 block w-full"
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                        />

                        <InputError
                            message={errors.name}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel value="Company Profile" />

                        <textarea
                            value={data.profile}
                            onChange={(e) =>
                                setData('profile', e.target.value)
                            }
                            className="mt-2 w-full rounded-2xl border border-slate-300 p-4 focus:border-slate-900 focus:ring-slate-900"
                            rows="5"
                        />

                        <InputError
                            message={errors.profile}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <InputLabel value="Username" />

                            <TextInput
                                type="text"
                                value={data.username}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                            />

                            <InputError
                                message={errors.username}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Email" />

                            <TextInput
                                type="email"
                                value={data.email}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Password" />

                        <TextInput
                            type="password"
                            value={data.password}
                            className="mt-2 block w-full"
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex justify-end">
                        <PrimaryButton disabled={processing}>
                            Create Company
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}