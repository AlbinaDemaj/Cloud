import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#07101F]">
            <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <Link href="/">
                            <img
                                src="/images/MediaValut.png"
                                alt="Cloud"
                                className="mx-auto h-20 w-auto sm:h-24"
                            />
                        </Link>

                        <h1 className="mt-4 text-3xl font-black text-white">
                            Cloud
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Secure Media Management Platform
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}