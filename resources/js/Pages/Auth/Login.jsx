import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-[#07101F] text-white">
                <div className="flex min-h-screen items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <img
                                src="/images/MediaValut.png"
                                alt="MediaVault"
                                className="mx-auto h-28 w-auto object-contain drop-shadow-[0_0_35px_rgba(59,130,246,0.45)]"
                            />

                            <h1 className="mt-4 text-3xl font-black">
                                Welcome Back
                            </h1>

                            <p className="mt-2 text-sm text-slate-400">
                                Login to access your Cloud panel
                            </p>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur">
                            {status && (
                                <div className="mb-5 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-200"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="email"
                                        autoFocus
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="block w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                        placeholder="Enter your email"
                                    />

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-slate-200"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="block w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                        placeholder="Enter your password"
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    'remember',
                                                    e.target.checked,
                                                )
                                            }
                                        />

                                        <span className="ms-2 text-sm text-slate-400">
                                            Remember me
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 font-black text-white shadow-xl transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Logging in...' : 'Log in'}
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                href="/"
                                className="text-sm font-semibold text-slate-400 hover:text-white"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}