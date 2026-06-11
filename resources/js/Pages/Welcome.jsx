import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth = {} } = usePage().props;
    const user = auth?.user;

    const dashboardHref =
        user?.role === 'admin'
            ? '/admin/dashboard'
            : user?.role === 'company'
              ? '/company/dashboard'
              : user?.role === 'guest'
                ? '/guest/dashboard'
                : '/login';

    return (
        <>
            <Head title="Cloud" />

            <div className="min-h-screen overflow-hidden bg-[#07101F] text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-between gap-4 py-5 sm:py-6">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <img
                                src="/images/MediaValut.png"
                                alt="MediaVault"
                                className="h-12 w-auto object-contain sm:h-14"
                            />

                            <div className="min-w-0">
                                <h1 className="text-xl font-black tracking-wide sm:text-2xl">
                                    Cloud
                                </h1>
                                <p className="truncate text-[11px] text-slate-400 sm:text-xs">
                                    Secure Media Platform
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            {user ? (
                                <Link
                                    href={dashboardHref}
                                    className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:scale-105 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="hidden rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:scale-105 sm:block sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    <section className="grid min-h-[calc(100vh-96px)] items-center gap-10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-10">
                        <div className="text-center lg:text-left">
                            <div className="mb-5 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300 sm:text-sm">
                                MediaVault Platform
                            </div>

                            <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
                                Your
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent">
                                    {' '}Media Cloud
                                </span>
                            </h2>

                            <p className="mt-4 text-lg font-semibold text-slate-200 sm:text-2xl">
                                Upload • Organize • Share
                            </p>

                            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                                A simple and secure platform where companies can
                                upload photos and videos, manage guests, and
                                share media files in one place.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start">
                                <Link
                                    href="/login"
                                    className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 text-center font-black text-white shadow-xl transition hover:scale-105"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-2xl border border-white/10 px-8 py-4 text-center font-black text-white transition hover:bg-white/10 sm:hidden lg:inline-block"
                                >
                                    Create Account
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center justify-center pb-8 lg:pb-0">
                            <div className="relative w-full max-w-[260px] sm:max-w-md">
                                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[90px] sm:blur-[120px]" />

                                <img
                                    src="/images/MediaValut.png"
                                    alt="MediaVault Logo"
                                    className="relative w-full drop-shadow-[0_0_60px_rgba(59,130,246,0.4)]"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}