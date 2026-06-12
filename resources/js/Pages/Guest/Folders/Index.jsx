import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Index({ folders = [] }) {
    return (
        <GuestLayout title="My Folders">
            <Head title="My Folders" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            My Folders
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Open a folder to view your photos and videos.
                        </p>
                    </div>

                    <a
                        href="/guest/folders/download-all"
                        className="inline-flex items-center justify-center rounded-xl bg-[#07101F] px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Download All Folders
                    </a>
                </div>

                {folders.length === 0 ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <p className="text-slate-500">
                            No folders available yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <Link href={`/guest/folders/${folder.id}`}>
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                                        📁
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        {folder.name}
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        {folder.media_count || 0} media files
                                    </p>

                                    {folder.children_count > 0 && (
                                        <p className="mt-1 text-xs text-slate-400">
                                            {folder.children_count} subfolders
                                        </p>
                                    )}
                                </Link>

                                <a
                                    href={`/guest/folders/${folder.id}/download`}
                                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                                >
                                    Download Folder
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}