import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Dashboard({ auth, media = [] }) {
    const [preview, setPreview] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);

    const allVisibleMedia = media.filter((item) => item.is_visible);

    const visibleMedia = useMemo(() => {
        return allVisibleMedia.filter((item) => {
            const name = item.original_name || '';
            const folderName = item.folder_name || '';
            const searchText = `${name} ${folderName}`.toLowerCase();

            const matchesSearch = searchText.includes(search.toLowerCase());
            const matchesFilter = filter === 'all' || item.file_type === filter;

            return matchesSearch && matchesFilter;
        });
    }, [media, search, filter]);

    const groupedFolders = useMemo(() => {
        return visibleMedia.reduce((groups, item) => {
            const folderName = item.folder_name || 'Pa folder';

            if (!groups[folderName]) {
                groups[folderName] = [];
            }

            groups[folderName].push(item);

            return groups;
        }, {});
    }, [visibleMedia]);

    const photos = allVisibleMedia.filter((item) => item.file_type === 'photo');
    const videos = allVisibleMedia.filter((item) => item.file_type === 'video');

    const getFileUrl = (item) => item.file_url || item.url;

    const toggleSelect = (id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id],
        );
    };

    const selectAllVisible = () => {
        setSelectedIds(visibleMedia.map((item) => item.id));
    };

    const clearSelection = () => {
        setSelectedIds([]);
    };

    const selectedDownloadUrl =
        selectedIds.length > 0
            ? `/guest/media/download-selected?ids=${selectedIds.join(',')}`
            : '#';

    return (
        <div className="min-h-screen bg-[#07101F] text-white">
            <div className="mx-auto max-w-[1500px] px-6 py-8">
                <section className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0D172A] via-[#101A35] to-[#102F68] p-8 shadow-2xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-xl">
                                <UserIcon />
                            </div>

                            <div>
                                <h1 className="text-4xl font-black tracking-tight">
                                    Welcome back, {auth?.user?.name}
                                </h1>

                                <p className="mt-2 max-w-xl text-slate-300">
                                    View, preview and download the media shared
                                    with you.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-slate-200"
                        >
                            <LogoutIcon />
                            Logout
                        </Link>
                    </div>
                </section>

                <section className="mb-6 grid gap-5 md:grid-cols-3">
                    <StatCard icon={<FolderIcon />} title="Total Media" value={allVisibleMedia.length} subtitle="All your shared files" />
                    <StatCard icon={<ImageIcon />} title="Photos" value={photos.length} subtitle="Your shared photos" />
                    <StatCard icon={<VideoIcon />} title="Videos" value={videos.length} subtitle="Your shared videos" />
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#0D1628] p-7 shadow-2xl shadow-black/20">
                    <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-3xl font-black">Your Folders</h2>

                            <p className="mt-2 text-slate-400">
                                Media files are grouped by folders shared with you.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:justify-end">
                            {allVisibleMedia.length > 0 && (
                                <a
                                    href="/guest/media/download-all"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 font-black text-white shadow-lg shadow-blue-950/40 transition hover:scale-[1.02]"
                                >
                                    <DownloadIcon />
                                    Download All ZIP
                                </a>
                            )}

                            {selectedIds.length > 0 && (
                                <a
                                    href={selectedDownloadUrl}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-600"
                                >
                                    <DownloadIcon />
                                    Download Selected ({selectedIds.length})
                                </a>
                            )}

                            {visibleMedia.length > 0 && (
                                <button
                                    onClick={
                                        selectedIds.length === visibleMedia.length
                                            ? clearSelection
                                            : selectAllVisible
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-black text-slate-200 transition hover:bg-white/10"
                                >
                                    <CheckIcon />
                                    {selectedIds.length === visibleMedia.length
                                        ? 'Clear Selection'
                                        : 'Select All'}
                                </button>
                            )}

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <SearchIcon />
                                </span>

                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search media or folder..."
                                    className="w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-12 pr-5 text-white outline-none placeholder:text-slate-500 focus:border-blue-400 lg:w-80"
                                />
                            </div>

                            <div className="flex gap-2">
                                <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} icon={<GridIcon />} label="All" />
                                <FilterButton active={filter === 'photo'} onClick={() => setFilter('photo')} icon={<ImageIcon />} label="Photos" />
                                <FilterButton active={filter === 'video'} onClick={() => setFilter('video')} icon={<VideoIcon />} label="Videos" />
                            </div>
                        </div>
                    </div>

                    {visibleMedia.length === 0 ? (
                        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-14 text-center">
                            <h3 className="text-2xl font-black">No media found</h3>

                            <p className="mt-3 text-slate-400">
                                There are no shared files matching your search or filter.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(groupedFolders).map(([folderName, items]) => (
                                <div
                                    key={folderName}
                                    className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5"
                                >
                                    <div className="mb-5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                                                <FolderIcon />
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black">
                                                    {folderName}
                                                </h3>

                                                <p className="text-sm text-slate-400">
                                                    {items.length} files
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {items.map((item) => (
                                            <MediaCard
                                                key={item.id}
                                                item={item}
                                                fileUrl={getFileUrl(item)}
                                                onOpen={() => setPreview(item)}
                                                selected={selectedIds.includes(item.id)}
                                                onSelect={() => toggleSelect(item.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {preview && (
                    <PreviewModal
                        item={preview}
                        fileUrl={getFileUrl(preview)}
                        onClose={() => setPreview(null)}
                    />
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, subtitle }) {
    return (
        <div className="rounded-[2rem] border border-white/10 bg-[#0D1628] p-7 shadow-xl shadow-black/20">
            <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-950/30">
                    {icon}
                </div>

                <div>
                    <p className="font-bold text-white">{title}</p>
                    <p className="text-4xl font-black">{value}</p>
                    <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
                active
                    ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-950/30'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

function MediaCard({ item, fileUrl, onOpen, selected, onSelect }) {
    return (
        <div
            className={`overflow-hidden rounded-[1.6rem] border bg-[#0A1222] shadow-xl shadow-black/30 transition hover:-translate-y-1 ${
                selected
                    ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'border-white/10 hover:border-blue-400/40'
            }`}
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <button
                    onClick={onSelect}
                    className={`absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition ${
                        selected
                            ? 'bg-emerald-400 text-black'
                            : 'bg-black/60 text-white backdrop-blur hover:bg-white hover:text-black'
                    }`}
                >
                    <CheckIcon />
                    {selected ? 'Selected' : 'Select'}
                </button>

                {item.file_type === 'photo' ? (
                    <img
                        src={fileUrl}
                        alt={item.original_name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <video
                        src={fileUrl}
                        controls
                        muted
                        preload="metadata"
                        playsInline
                        className="h-full w-full object-cover"
                    />
                )}

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl bg-black/60 px-3 py-1 text-xs font-black uppercase backdrop-blur">
                    {item.file_type === 'photo' ? <ImageIcon /> : <VideoIcon />}
                    {item.file_type}
                </div>

                <button
                    onClick={onOpen}
                    className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition hover:bg-black/30 hover:opacity-100"
                >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl">
                        <EyeIcon />
                    </span>
                </button>
            </div>

            <div className="p-4">
                <h3 className="truncate text-lg font-black">{item.original_name}</h3>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                        onClick={onOpen}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-black text-blue-300 transition hover:bg-blue-500/20"
                    >
                        <EyeIcon />
                        Preview
                    </button>

                    <a
                        href={fileUrl}
                        download={item.original_name}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:scale-[1.02]"
                    >
                        <DownloadIcon />
                        Download
                    </a>
                </div>
            </div>
        </div>
    );
}

function PreviewModal({ item, fileUrl, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1120] shadow-2xl">
                <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="max-w-[70vw] truncate text-xl font-black">
                            {item.original_name}
                        </h2>

                        <p className="mt-1 text-sm capitalize text-slate-400">
                            {item.file_type}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href={fileUrl}
                            download={item.original_name}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 font-black text-white transition hover:scale-[1.02]"
                        >
                            <DownloadIcon />
                            Download
                        </a>

                        <button
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-black transition hover:bg-slate-200"
                        >
                            <CloseIcon />
                            Close
                        </button>
                    </div>
                </div>

                <div className="bg-black p-4">
                    {item.file_type === 'video' ? (
                        <video
                            src={fileUrl}
                            controls
                            autoPlay
                            playsInline
                            className="max-h-[78vh] w-full rounded-2xl object-contain"
                        />
                    ) : (
                        <img
                            src={fileUrl}
                            alt={item.original_name}
                            className="max-h-[78vh] w-full rounded-2xl object-contain"
                        />
                    )}
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

function UserIcon() {
    return <Icon><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></Icon>;
}

function FolderIcon() {
    return <Icon><path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></Icon>;
}

function ImageIcon() {
    return <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="10" r="1.5" /><path d="M21 15l-5-5L5 19" /></Icon>;
}

function VideoIcon() {
    return <Icon><path d="M15 10l5-3v10l-5-3z" /><rect x="3" y="6" width="12" height="12" rx="2" /></Icon>;
}

function DownloadIcon() {
    return <Icon><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></Icon>;
}

function EyeIcon() {
    return <Icon><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icon>;
}

function SearchIcon() {
    return <Icon><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Icon>;
}

function GridIcon() {
    return <Icon><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>;
}

function LogoutIcon() {
    return <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></Icon>;
}

function CloseIcon() {
    return <Icon><path d="M18 6L6 18" /><path d="M6 6l12 12" /></Icon>;
}

function CheckIcon() {
    return <Icon><path d="M20 6L9 17l-5-5" /></Icon>;
}