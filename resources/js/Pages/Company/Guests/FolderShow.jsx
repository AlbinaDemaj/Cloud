import CompanyLayout from '@/Layouts/CompanyLayout';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    Eye,
    FileImage,
    FolderOpen,
    Image,
    Trash2,
    UploadCloud,
    Video,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function FolderShow({ guest, folder, media: initialMedia = [] }) {
    const [media, setMedia] = useState(initialMedia || []);
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        setMedia(initialMedia || []);
    }, [initialMedia]);

    const getFileUrl = (item) => {
        if (!item) return '';

        if (item.file_url) return item.file_url;

        if (item.file_path) {
            const cleanPath = item.file_path
                .replace(/^public\//, '')
                .replace(/^storage\//, '')
                .replace(/^\/+/, '');

            if (cleanPath.startsWith('uploads/')) {
                return `/${cleanPath}`;
            }

            return `/storage/${cleanPath}`;
        }

        return '';
    };

    const isVideo = (item) => {
        return item?.file_type === 'video' || item?.mime_type?.startsWith('video/');
    };

    const photosCount = useMemo(
        () => media.filter((item) => !isVideo(item)).length,
        [media],
    );

    const videosCount = useMemo(
        () => media.filter((item) => isVideo(item)).length,
        [media],
    );

    const uploadFiles = async (files) => {
        const selectedFiles = Array.from(files || []);

        if (!selectedFiles.length || uploading) return;

        const formData = new FormData();

        formData.append('guest_id', guest.id);
        formData.append('folder_id', folder.id);

        selectedFiles.forEach((file) => {
            formData.append('files[]', file);
        });

        try {
            setUploading(true);
            setProgress(0);

            const response = await axios.post(
                route('company.media.upload'),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: 'application/json',
                    },
                    onUploadProgress: (event) => {
                        if (!event.total) return;

                        setProgress(Math.round((event.loaded * 100) / event.total));
                    },
                },
            );

            const uploadedMedia = response.data?.media || [];

            if (uploadedMedia.length > 0) {
                setMedia((prev) => [...uploadedMedia, ...prev]);
            } else {
                router.reload({ only: ['media'] });
            }
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    'Upload failed. Kontrollo file-in ose backend-in.',
            );
        } finally {
            setTimeout(() => {
                setUploading(false);
                setDragging(false);
                setProgress(0);
            }, 700);
        }
    };

    const deleteMedia = async (id) => {
        if (!confirm('A je e sigurt që do ta fshish këtë file?')) return;

        try {
            await axios.delete(route('company.media.destroy', id));

            setMedia((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
            alert('File nuk u fshi.');
        }
    };

    const toggleVisibility = async (item) => {
        try {
            const response = await axios.patch(
                route('company.media.visibility', item.id),
            );

            setMedia((prev) =>
                prev.map((mediaItem) =>
                    mediaItem.id === item.id
                        ? response.data.media || {
                              ...mediaItem,
                              is_visible: !mediaItem.is_visible,
                          }
                        : mediaItem,
                ),
            );
        } catch (error) {
            console.error(error);
            alert('Visibility nuk u ndryshua.');
        }
    };

    return (
        <CompanyLayout title={`${folder.name} Folder`}>
            <div className="space-y-8">
                <div className="rounded-[32px] bg-[#07101F] p-8 text-white shadow-xl">
                    <Link
                        href={route('company.guests.show', guest.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/15"
                    >
                        <ArrowLeft size={16} />
                        Back to folders
                    </Link>

                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950">
                            <FolderOpen size={32} />
                        </div>

                        <div>
                            <h1 className="text-4xl font-black">
                                {folder.name}
                            </h1>

                            <p className="mt-2 text-slate-300">
                                Guest: {guest.name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">
                            Total Files
                        </p>
                        <h2 className="mt-2 text-4xl font-black text-slate-950">
                            {media.length}
                        </h2>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">
                            Photos
                        </p>
                        <h2 className="mt-2 text-4xl font-black text-slate-950">
                            {photosCount}
                        </h2>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">
                            Videos
                        </p>
                        <h2 className="mt-2 text-4xl font-black text-slate-950">
                            {videosCount}
                        </h2>
                    </div>
                </div>

                <div
                    onDragEnter={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setDragging(false);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        uploadFiles(e.dataTransfer.files);
                    }}
                    className={`rounded-[32px] border border-dashed bg-white p-8 text-center shadow-sm transition ${
                        dragging
                            ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100'
                            : 'border-blue-300'
                    }`}
                >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-blue-50 text-blue-600">
                        <UploadCloud size={38} />
                    </div>

                    <h2 className="mt-5 text-2xl font-black text-slate-950">
                        Upload Files
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Drag files here or select photos/videos manually.
                    </p>

                    <label
                        className={`mx-auto mt-6 inline-flex cursor-pointer items-center gap-3 rounded-2xl px-8 py-4 text-sm font-black text-white ${
                            uploading
                                ? 'bg-slate-400'
                                : 'bg-slate-950 hover:bg-slate-800'
                        }`}
                    >
                        <UploadCloud size={18} />
                        {uploading ? `Uploading ${progress}%` : 'Select Files'}

                        <input
                            type="file"
                            multiple
                            disabled={uploading}
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                                uploadFiles(e.target.files);
                                e.target.value = '';
                            }}
                        />
                    </label>

                    {uploading && (
                        <div className="mx-auto mt-6 max-w-xl">
                            <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {media.length === 0 ? (
                    <div className="rounded-[30px] border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <FileImage className="mx-auto text-slate-300" size={54} />

                        <h3 className="mt-4 text-2xl font-black text-slate-950">
                            This folder is empty
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Upload files above and they will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {media.map((item) => (
                            <div
                                key={item.id}
                                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="relative aspect-[4/3] bg-slate-950">
                                    {isVideo(item) ? (
                                        <video
                                            src={getFileUrl(item)}
                                            className="h-full w-full object-cover"
                                            muted
                                        />
                                    ) : (
                                        <img
                                            src={getFileUrl(item)}
                                            alt={item.original_name}
                                            className="h-full w-full object-cover"
                                        />
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility(item)}
                                        className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-black ${
                                            item.is_visible
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-800 text-white'
                                        }`}
                                    >
                                        <Eye size={14} />
                                        {item.is_visible ? 'Visible' : 'Hidden'}
                                    </button>
                                </div>

                                <div className="p-5">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                                        {isVideo(item) ? (
                                            <Video size={13} />
                                        ) : (
                                            <Image size={13} />
                                        )}

                                        {isVideo(item) ? 'video' : 'photo'}
                                    </span>

                                    <h3 className="mt-3 truncate font-black text-slate-950">
                                        {item.original_name}
                                    </h3>

                                    <div className="mt-5 grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPreview(item)}
                                            className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700 hover:bg-blue-100"
                                        >
                                            Preview
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteMedia(item.id)}
                                            className="inline-flex items-center justify-center rounded-xl bg-rose-50 px-4 py-3 text-rose-700 hover:bg-rose-100"
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
                        <div className="relative w-full max-w-5xl rounded-[30px] bg-white p-5 shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setPreview(null)}
                                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="mb-4 truncate pr-14 text-xl font-black text-slate-950">
                                {preview.original_name}
                            </h2>

                            {isVideo(preview) ? (
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