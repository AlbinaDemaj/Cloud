import CompanyLayout from '@/Layouts/CompanyLayout';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    Download,
    Eye,
    EyeOff,
    Folder,
    Image,
    Trash2,
    UploadCloud,
    Video,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function Show({ guest, folders = [] }) {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(null);
    const [selected, setSelected] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState('');
    const [filterFolderId, setFilterFolderId] = useState('all');

    useEffect(() => {
        fetchMedia();
    }, []);

    const getFileUrl = (item) => {
        if (!item) return '';

        if (item.file_url) return item.file_url;
        if (item.url) return item.url;

        if (item.file_path) {
            return item.file_path.startsWith('/storage')
                ? item.file_path
                : `/storage/${item.file_path}`;
        }

        return '';
    };

    const filteredMedia = useMemo(() => {
        if (filterFolderId === 'all') return media;

        if (filterFolderId === 'no-folder') {
            return media.filter((item) => !item.folder_id);
        }

        return media.filter(
            (item) => String(item.folder_id) === String(filterFolderId),
        );
    }, [media, filterFolderId]);

    const photosCount = media.filter((item) => item.file_type === 'photo').length;
    const videosCount = media.filter((item) => item.file_type === 'video').length;

    const fetchMedia = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`/api/media/guest/${guest.id}`);

            setMedia(response.data.media ?? response.data);
        } catch (error) {
            console.error(error);
            alert('Media could not be loaded.');
        } finally {
            setLoading(false);
        }
    };

    const uploadFiles = async (files) => {
        const selectedFiles = Array.from(files || []);

        if (!selectedFiles.length) return;

        const formData = new FormData();

        formData.append('guest_id', guest.id);

        if (selectedFolderId) {
            formData.append('folder_id', selectedFolderId);
        }

        selectedFiles.forEach((file) => {
            formData.append('files[]', file);
        });

        try {
            setUploading(true);
            setProgress(0);

            await axios.post('/api/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (event) => {
                    const percent = Math.round(
                        (event.loaded * 100) / event.total,
                    );

                    setProgress(percent);
                },
            });

            await fetchMedia();
        } catch (error) {
            console.error(error);
            alert('Upload failed.');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const deleteMedia = async (id) => {
        if (!confirm('A je e sigurt që do ta fshish këtë media?')) return;

        try {
            await axios.delete(`/api/media/${id}`);

            setMedia((prev) => prev.filter((item) => item.id !== id));
            setSelected((prev) => prev.filter((itemId) => itemId !== id));
        } catch (error) {
            console.error(error);
            alert('Delete failed.');
        }
    };

    const toggleVisibility = async (item) => {
        try {
            await axios.patch(`/api/media/${item.id}/visibility`, {
                is_visible: !item.is_visible,
            });

            setMedia((prev) =>
                prev.map((mediaItem) =>
                    mediaItem.id === item.id
                        ? { ...mediaItem, is_visible: !mediaItem.is_visible }
                        : mediaItem,
                ),
            );
        } catch (error) {
            console.error(error);
            alert('Visibility update failed.');
        }
    };

    const deleteSelected = async () => {
        if (!selected.length) return;

        if (!confirm(`A je e sigurt që do t'i fshish ${selected.length} media?`)) {
            return;
        }

        try {
            await Promise.all(selected.map((id) => axios.delete(`/api/media/${id}`)));

            setMedia((prev) => prev.filter((item) => !selected.includes(item.id)));
            setSelected([]);
        } catch (error) {
            console.error(error);
            alert('Multi delete failed.');
        }
    };

    const downloadMedia = (id) => {
        window.open(`/api/media/${id}/download`, '_blank');
    };

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id],
        );
    };

    const getFolderName = (folderId) => {
        const folder = folders.find(
            (item) => String(item.id) === String(folderId),
        );

        return folder?.name || 'No folder';
    };

    return (
        <CompanyLayout title={`${guest.name} Media`}>
            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#07101F] p-8 text-white shadow-2xl">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <Link
                                href={route('company.guests.index')}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/15"
                            >
                                <ArrowLeft size={16} />
                                Back to guests
                            </Link>

                            <h1 className="mt-6 text-4xl font-black md:text-5xl">
                                {guest.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-slate-300">
                                Upload photos and videos for this guest. You can also assign uploads to folders.
                            </p>
                        </div>

                        {selected.length > 0 && (
                            <button
                                type="button"
                                onClick={deleteSelected}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-6 py-4 text-sm font-black text-white transition hover:bg-rose-400"
                            >
                                <Trash2 size={18} />
                                Delete Selected ({selected.length})
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    {[
                        ['Total Media', media.length],
                        ['Photos', photosCount],
                        ['Videos', videosCount],
                        ['Folders', folders.length],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm font-bold text-slate-500">
                                {label}
                            </p>

                            <h2 className="mt-3 text-4xl font-black text-slate-950">
                                {value}
                            </h2>
                        </div>
                    ))}
                </div>

                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        uploadFiles(e.dataTransfer.files);
                    }}
                    className="overflow-hidden rounded-[34px] border border-dashed border-blue-300 bg-white shadow-sm"
                >
                    <div className="grid gap-6 p-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                        <div className="flex items-start gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                                <UploadCloud size={30} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-slate-950">
                                    Upload Media
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Drag & drop photos/videos here or select files manually. Choose a folder before upload if needed.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-black text-slate-700">
                                    Upload to folder
                                </label>

                                <select
                                    value={selectedFolderId}
                                    onChange={(e) =>
                                        setSelectedFolderId(e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
                                >
                                    <option value="">No folder</option>

                                    {folders.map((folder) => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800">
                                <UploadCloud size={18} />
                                Select Files

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={(e) => uploadFiles(e.target.files)}
                                />
                            </label>
                        </div>
                    </div>

                    {uploading && (
                        <div className="border-t border-slate-100 px-7 py-5">
                            <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-950">
                            Media Gallery
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Filter media by folder and manage visibility.
                        </p>
                    </div>

                    <select
                        value={filterFolderId}
                        onChange={(e) => setFilterFolderId(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-400"
                    >
                        <option value="all">All folders</option>
                        <option value="no-folder">No folder</option>

                        {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                                {folder.name}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
                        Loading media...
                    </div>
                ) : filteredMedia.length === 0 ? (
                    <div className="rounded-[30px] border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <Folder className="mx-auto text-slate-300" size={54} />

                        <h3 className="mt-4 text-2xl font-black text-slate-950">
                            No media found
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Upload media or choose another folder filter.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredMedia.map((item) => (
                            <div
                                key={item.id}
                                className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(item.id)}
                                        onChange={() => toggleSelect(item.id)}
                                        className="absolute left-4 top-4 z-10 h-5 w-5 cursor-pointer accent-blue-600"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility(item)}
                                        className={`absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-black ${
                                            item.is_visible
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-800 text-white'
                                        }`}
                                    >
                                        {item.is_visible ? (
                                            <Eye size={14} />
                                        ) : (
                                            <EyeOff size={14} />
                                        )}

                                        {item.is_visible ? 'Visible' : 'Hidden'}
                                    </button>

                                    {item.file_type === 'photo' ? (
                                        <img
                                            src={getFileUrl(item)}
                                            alt={item.original_name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <video
                                            src={getFileUrl(item)}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                                            {item.file_type === 'photo' ? (
                                                <Image size={13} />
                                            ) : (
                                                <Video size={13} />
                                            )}

                                            {item.file_type}
                                        </span>

                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                            <Folder size={13} />
                                            {getFolderName(item.folder_id)}
                                        </span>
                                    </div>

                                    <h3 className="truncate font-black text-slate-950">
                                        {item.original_name}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.is_visible
                                            ? 'Guest can view this media'
                                            : 'Private media'}
                                    </p>

                                    <div className="mt-5 grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPreview(item)}
                                            className="rounded-xl bg-blue-50 px-3 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-100"
                                        >
                                            Preview
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => downloadMedia(item.id)}
                                            className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-3 py-3 text-slate-700 transition hover:bg-slate-200"
                                        >
                                            <Download size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteMedia(item.id)}
                                            className="inline-flex items-center justify-center rounded-xl bg-rose-50 px-3 py-3 text-rose-700 transition hover:bg-rose-100"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {preview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
                        <div className="relative w-full max-w-6xl rounded-[30px] bg-white p-4 shadow-2xl">
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
                                    {preview.file_type} · {getFolderName(preview.folder_id)}
                                </p>
                            </div>

                            {preview.file_type === 'video' ? (
                                <video
                                    src={getFileUrl(preview)}
                                    controls
                                    autoPlay
                                    className="max-h-[75vh] w-full rounded-2xl object-contain"
                                />
                            ) : (
                                <img
                                    src={getFileUrl(preview)}
                                    alt={preview.original_name}
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