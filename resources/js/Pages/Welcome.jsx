import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth = {} } = usePage().props;
    const user = auth?.user;

    return (
        <>
            <Head title="Cloud" />

            <div className="min-h-screen bg-[#07101F] text-white">
                <div className="mx-auto max-w-7xl px-6">
                    <nav className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/MediaValut.png"
                                alt="MediaVault"
                                className="h-14 w-auto object-contain"
                            />

                            <div>
                                <h1 className="text-2xl font-black tracking-wide">
                                    Cloud
                                </h1>
                                <p className="text-xs text-slate-400">
                                    Secure Media Platform
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    <section className="grid min-h-[80vh] items-center gap-14 py-10 lg:grid-cols-2">
                        <div>
                            <div className="mb-5 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
                                MediaVault Platform
                            </div>

                            <h2 className="text-5xl font-black leading-tight lg:text-7xl">
                                Your
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent">
                                    {' '}Media Cloud
                                </span>
                            </h2>

                            <p className="mt-4 text-2xl font-semibold text-slate-200">
                                Upload • Organize • Share
                            </p>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                                A simple and secure platform where companies can
                                upload photos and videos, manage guests, and
                                share media files in one place.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <Link
                                    href="/login"
                                    className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 font-black text-white shadow-xl transition hover:scale-105"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-2xl border border-white/10 px-8 py-4 font-black text-white transition hover:bg-white/10"
                                >
                                    Create Account
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[120px]" />

                                <img
                                    src="/images/MediaValut.png"
                                    alt="MediaVault Logo"
                                    className="relative w-full max-w-md drop-shadow-[0_0_60px_rgba(59,130,246,0.4)]"
                                />
                            </div>
                        </div>
                    </section>

                    
                </div>
            </div>
        </>
    );
}