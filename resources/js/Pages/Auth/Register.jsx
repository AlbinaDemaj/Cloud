import { Head, Link } from '@inertiajs/react';

export default function Register() {
    const whatsappUrl =
        'https://wa.me/38348568568?text=Pershendetje,%20dua%20te%20regjistrohem%20ne%20MediaVault';

    return (
        <>
            <Head title="Register" />

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
                                Contact Us on WhatsApp
                            </h1>

                            <p className="mt-2 text-sm text-slate-400">
                                To create an account, contact us directly on
                                WhatsApp.
                            </p>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-lg font-black text-white shadow-xl transition hover:scale-[1.02]"
                            >
                                Open WhatsApp
                            </a>
                        </div>

                        <div className="mt-6 text-center">
                            <span className="text-slate-400">
                                Already have an account?
                            </span>

                            <Link
                                href={route('login')}
                                className="ml-2 font-semibold text-blue-400 hover:text-blue-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}