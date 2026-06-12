import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Dashboard({ auth, media = [] }) {
    const allVisibleMedia = media.filter((item) => item.is_visible);

    const folders = useMemo(() => {
        const groups = {};

        allVisibleMedia.forEach((item) => {
            if (!item.folder_id) return;

            const folderId = item.folder_id;
            const folderName = item.folder_name || 'Folder';

            if (!groups[folderId]) {
                groups[folderId] = {
                    id: folderId,
                    name: folderName,
                    files: [],
                };
            }

            groups[folderId].files.push(item);
        });

        return Object.values(groups);
    }, [allVisibleMedia]);

    const photos = allVisibleMedia.filter((item) => item.file_type === 'photo');
    const videos = allVisibleMedia.filter((item) => item.file_type === 'video');

    return (
        <GuestLayout title="Guest Dashboard">
            <Head title="Guest Dashboard" />

            <div className="space-y-6">
                <section className="rounded-[2rem] bg-gradient-to-br from-[#07101F] via-[#0B1B34] to-[#123C78] p-6 text-white shadow-xl sm:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                                Guest Panel
                            </p>

                            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                Welcome back, {auth?.user?.name || 'Guest'}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Open your folders to view and download your shared photos and videos.
                            </p>
                        </div>

                        {folders.length > 0 && (
                            <a
                                href="/guest/folders/download-all"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#07101F] transition hover:bg-slate-100"
                            >
                                <DownloadIcon />
                                Download All Folders
                            </a>
                        )}
                    </div>
                </section>

                <section className="grid gap-5 md:grid-cols-3">
                    <StatCard
                        icon={<FolderIcon />}
                        title="Folders"
                        value={folders.length}
                        subtitle="Shared folders"
                    />

                    <StatCard
                        icon={<ImageIcon />}
                        title="Photos"
                        value={photos.length}
                        subtitle="Shared photos"
                    />

                    <StatCard
                        icon={<VideoIcon />}
                        title="Videos"
                        value={videos.length}
                        subtitle="Shared videos"
                    />
                </section>

                <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                Your Folders
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Click a folder to open its media files.
                            </p>
                        </div>

                        <Link
                            href="/guest/folders"
                            className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
                        >
                            View All Folders
                        </Link>
                    </div>

                    {folders.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                <FolderIcon />
                            </div>

                            <h3 className="text-xl font-black text-slate-900">
                                No folders found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                No shared folders are available yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {folders.map((folder) => (
                                <div
                                    key={folder.id}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                                >
                                    <Link href={`/guest/folders/${folder.id}`}>
                                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                            <FolderIcon />
                                        </div>

                                        <h3 className="truncate text-xl font-black text-slate-900">
                                            {folder.name}
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-500">
                                            {folder.files.length} files
                                        </p>
                                    </Link>

                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <Link
                                            href={`/guest/folders/${folder.id}`}
                                            className="inline-flex items-center justify-center rounded-xl bg-[#07101F] px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
                                        >
                                            Open
                                        </Link>

                                        <a
                                            href={`/guest/folders/${folder.id}/download`}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                                        >
                                            <DownloadIcon />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </GuestLayout>
    );
}

function StatCard({ icon, title, value, subtitle }) {
    return (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#07101F] text-white shadow-lg">
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-bold text-slate-500">{title}</p>
                    <p className="text-4xl font-black text-slate-900">
                        {value}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

function Icon({ children }) {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {children}
        </svg>
    );
}

function FolderIcon() {
    return (
        <Icon>
            <path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </Icon>
    );
}

function ImageIcon() {
    return (
        <Icon>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8" cy="10" r="1.5" />
            <path d="M21 15l-5-5L5 19" />
        </Icon>
    );
}

function VideoIcon() {
    return (
        <Icon>
            <path d="M15 10l5-3v10l-5-3z" />
            <rect x="3" y="6" width="12" height="12" rx="2" />
        </Icon>
    );
}

function DownloadIcon() {
    return (
        <Icon>
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 21h14" />
        </Icon>
    );
}