import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Show({ folder, media = [] }) {
    return (
        <GuestLayout title={folder.name}>
            <Head title={folder.name} />

            <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/guest/folders"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            ← Back to folders
                        </Link>

                        <h1 className="mt-2 text-2xl font-bold text-slate-900">
                            {folder.name}
                        </h1>

                        {folder.parent && (
                            <p className="mt-1 text-sm text-slate-500">
                                Parent folder: {folder.parent.name}
                            </p>
                        )}
                    </div>

                    <a
                        href={`/guest/folders/${folder.id}/download`}
                        className="inline-flex items-center justify-center rounded-xl bg-[#07101F] px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Download This Folder
                    </a>
                </div>

                {folder.children?.length > 0 && (
                    <div>
                        <h2 className="mb-3 text-lg font-bold text-slate-900">
                            Subfolders
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {folder.children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/guest/folders/${child.id}`}
                                    className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="text-3xl">📁</div>
                                    <h3 className="mt-3 font-bold text-slate-900">
                                        {child.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="mb-3 text-lg font-bold text-slate-900">
                        Media Files
                    </h2>

                    {media.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                            <p className="text-slate-500">
                                No media files in this folder yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-sm"
                                >
                                    {item.file_type === 'video' ? (
                                        <video
                                            controls
                                            src={item.file_url}
                                            className="h-64 w-full bg-black object-contain"
                                        />
                                    ) : (
                                        <img
                                            src={item.file_url}
                                            alt={item.original_name}
                                            className="h-64 w-full object-cover"
                                        />
                                    )}

                                    <div className="p-4">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {item.original_name}
                                        </p>

                                        <a
                                            href={item.file_url}
                                            download
                                            className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}