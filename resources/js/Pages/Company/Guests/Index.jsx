import CompanyLayout from '@/Layouts/CompanyLayout';
import { Link } from '@inertiajs/react';
import { Eye, Image, Video, X } from 'lucide-react';
import { useState } from 'react';

export default function Index({ guests = [] }) {
    const [preview, setPreview] = useState(null);

    const activeGuests = guests.filter((guest) => guest.is_active).length;
    const inactiveGuests = guests.filter((guest) => !guest.is_active).length;

    const getMediaUrl = (item) => {
        if (!item) return '';

        if (item.file_url) return item.file_url;
        if (item.url) return item.url;

        if (item.file_path) {
            const cleanPath = item.file_path
                .replace(/^public\//, '')
                .replace(/^storage\//, '')
                .replace(/^\/+/, '');

            return `/storage/${cleanPath}`;
        }

        return '';
    };

    const isVideo = (item) => {
        return item?.file_type === 'video' || item?.mime_type?.startsWith('video/');
    };

    return (
        <CompanyLayout title="Guests">
            <div className="space-y-8">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                        Guest Access
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-slate-950">
                        Guests
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Guests are created by the admin. You can view them,
                        upload media and preview uploaded photos/videos.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        ['Total Guests', guests.length],
                        ['Active Guests', activeGuests],
                        ['Inactive Guests', inactiveGuests],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm font-semibold text-slate-500">
                                {label}
                            </p>

                            <h2 className="mt-3 text-4xl font-black text-slate-950">
                                {value}
                            </h2>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6">
                    {guests.length > 0 ? (
                        guests.map((guest) => {
                            const initial =
                                guest.name?.charAt(0)?.toUpperCase() || 'G';

                            const guestMedia = guest.media || [];

                            return (
                                <div
                                    key={guest.id}
                                    className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm"
                                >
                                    <div className="flex flex-col gap-5 border-b border-slate-100 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white">
                                                {initial}
                                            </div>

                                            <div>
                                                <h2 className="text-xl font-black text-slate-950">
                                                    {guest.name}
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {guest.username || 'No username'} ·{' '}
                                                    {guest.email || 'No email'}
                                                </p>

                                                <span
                                                    className={`mt-3 inline-flex rounded-full px-4 py-2 text-xs font-black ${
                                                        guest.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-rose-50 text-rose-700'
                                                    }`}
                                                >
                                                    {guest.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            href={route('company.guests.show', guest.id)}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
                                        >
                                            <Eye size={17} />
                                            View / Upload
                                        </Link>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                                                Uploaded Media
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-400">
                                                {guestMedia.length} files uploaded
                                            </p>
                                        </div>

                                        {guestMedia.length > 0 ? (
                                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                                                {guestMedia.map((item) => {
                                                    const mediaUrl = getMediaUrl(item);

                                                    return (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() => setPreview(item)}
                                                            className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 text-left transition hover:-translate-y-1 hover:shadow-lg"
                                                        >
                                                            <div className="relative aspect-square overflow-hidden bg-slate-900">
                                                                {isVideo(item) ? (
                                                                    <video
                                                                        src={mediaUrl}
                                                                        muted
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={mediaUrl}
                                                                        alt={item.original_name || 'Media file'}
                                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                                    />
                                                                )}

                                                                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-black text-white backdrop-blur">
                                                                    {isVideo(item) ? (
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <Video size={13} />
                                                                            Video
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <Image size={13} />
                                                                            Photo
                                                                        </span>
                                                                    )}
                                                                </span>

                                                                <span
                                                                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-black ${
                                                                        item.is_visible
                                                                            ? 'bg-emerald-500 text-white'
                                                                            : 'bg-slate-700 text-white'
                                                                    }`}
                                                                >
                                                                    {item.is_visible ? 'Visible' : 'Hidden'}
                                                                </span>
                                                            </div>

                                                            <div className="p-4">
                                                                <p className="truncate text-sm font-black text-slate-950">
                                                                    {item.original_name}
                                                                </p>

                                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                                    {item.folder?.name || 'No folder'}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                                <p className="text-sm font-bold text-slate-500">
                                                    No media uploaded yet for this guest.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <h3 className="text-xl font-black text-slate-950">
                                No guests assigned yet
                            </h3>

                            <p className="mt-2 text-slate-500">
                                Guests will appear here after the admin assigns them to your company.
                            </p>
                        </div>
                    )}
                </div>

                {preview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
                        <div className="relative w-full max-w-6xl rounded-[30px] bg-white p-5 shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setPreview(null)}
                                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-4 pr-16">
                                <h2 className="truncate text-xl font-black text-slate-950">
                                    {preview.original_name}
                                </h2>

                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                    {preview.file_type} · {preview.folder?.name || 'No folder'}
                                </p>
                            </div>

                            {isVideo(preview) ? (
                                <video
                                    src={getMediaUrl(preview)}
                                    controls
                                    autoPlay
                                    className="max-h-[75vh] w-full rounded-2xl object-contain"
                                />
                            ) : (
                                <img
                                    src={getMediaUrl(preview)}
                                    alt={preview.original_name || 'Media file'}
                                    className="max-h-[75vh] w-full rounded-2xl object-contain"
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </CompanyLayout>
    );
}