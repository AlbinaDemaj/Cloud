import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function Index({ admin }) {
    const profileForm = useForm({
        name: admin?.name || '',
        username: admin?.username || '',
        email: admin?.email || '',
    });

    const securityForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('admin.settings.profile'), {
            preserveScroll: true,
        });
    };

    const updateSecurity = (e) => {
        e.preventDefault();
        securityForm.patch(route('admin.settings.security'), {
            preserveScroll: true,
            onSuccess: () => securityForm.reset(),
        });
    };

    const inputClass =
        'mt-2 w-full rounded-2xl border border-slate-200 bg-[#F6F8FC] px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white';

    const labelClass = 'text-sm font-bold text-slate-700';

    return (
        <AdminLayout title="Settings">
            <div className="space-y-8">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                        Admin Settings
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-slate-950">
                        Settings
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage your profile, password and MediaVault account settings.
                    </p>
                </div>

                <div className="grid gap-8 xl:grid-cols-2">
                    <form
                        onSubmit={updateProfile}
                        className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm"
                    >
                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white">
                                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-slate-950">
                                    Profile Information
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Update your admin account details.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <input
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) =>
                                        profileForm.setData('name', e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {profileForm.errors.name && (
                                    <p className="mt-2 text-sm font-semibold text-rose-600">
                                        {profileForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Username</label>
                                <input
                                    type="text"
                                    value={profileForm.data.username}
                                    onChange={(e) =>
                                        profileForm.setData('username', e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {profileForm.errors.username && (
                                    <p className="mt-2 text-sm font-semibold text-rose-600">
                                        {profileForm.errors.username}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) =>
                                        profileForm.setData('email', e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {profileForm.errors.email && (
                                    <p className="mt-2 text-sm font-semibold text-rose-600">
                                        {profileForm.errors.email}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="mt-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                            >
                                {profileForm.processing ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>

                    <form
                        onSubmit={updateSecurity}
                        className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm"
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-950">
                                Security Settings
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Change your admin password securely.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Current Password</label>
                                <input
                                    type="password"
                                    value={securityForm.data.current_password}
                                    onChange={(e) =>
                                        securityForm.setData(
                                            'current_password',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                                {securityForm.errors.current_password && (
                                    <p className="mt-2 text-sm font-semibold text-rose-600">
                                        {securityForm.errors.current_password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>New Password</label>
                                <input
                                    type="password"
                                    value={securityForm.data.password}
                                    onChange={(e) =>
                                        securityForm.setData('password', e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {securityForm.errors.password && (
                                    <p className="mt-2 text-sm font-semibold text-rose-600">
                                        {securityForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Confirm Password</label>
                                <input
                                    type="password"
                                    value={securityForm.data.password_confirmation}
                                    onChange={(e) =>
                                        securityForm.setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={securityForm.processing}
                                className="mt-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                            >
                                {securityForm.processing
                                    ? 'Updating...'
                                    : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                                System Overview
                            </p>

                            <h2 className="mt-3 text-2xl font-black text-slate-950">
                                MediaVault System
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Basic platform information and admin status.
                            </p>
                        </div>

                        <img
                            src="/images/MediaValut.png"
                            alt="MediaVault"
                            className="hidden h-20 w-auto object-contain md:block"
                        />
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-3xl bg-[#F6F8FC] p-5">
                            <p className="text-sm font-bold text-slate-500">
                                App Name
                            </p>
                            <p className="mt-2 text-xl font-black text-slate-950">
                                MediaVault
                            </p>
                        </div>

                        <div className="rounded-3xl bg-[#F6F8FC] p-5">
                            <p className="text-sm font-bold text-slate-500">
                                Admin Role
                            </p>
                            <p className="mt-2 text-xl font-black capitalize text-slate-950">
                                {admin?.role || 'admin'}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-emerald-50 p-5">
                            <p className="text-sm font-bold text-emerald-700">
                                Status
                            </p>
                            <p className="mt-2 text-xl font-black text-emerald-700">
                                Active
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}