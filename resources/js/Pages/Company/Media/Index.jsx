import CompanyLayout from "@/Layouts/CompanyLayout";
import { router, useForm } from "@inertiajs/react";
import {
    Upload,
    Trash2,
    Eye,
    EyeOff,
    Image,
    Video,
    Filter,
    X,
} from "lucide-react";
import { useState } from "react";

export default function Index({
    media = [],
    guests = [],
    folders = [],
    filters = {},
}) {
    const [preview, setPreview] = useState(null);

    const uploadForm = useForm({
        guest_id: "",
        folder_id: "",
        files: [],
    });

    const filterForm = useForm({
        guest_id: filters.guest_id || "",
        folder_id: filters.folder_id || "",
        type: filters.type || "",
    });

    const filteredFolders = folders.filter((folder) => {
        if (!uploadForm.data.guest_id) return true;
        return Number(folder.guest_id) === Number(uploadForm.data.guest_id);
    });

    const applyFilters = (e) => {
        e.preventDefault();

        filterForm.get(route("company.media.index"), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        router.get(route("company.media.index"));
    };

    const uploadMedia = (e) => {
        e.preventDefault();

        uploadForm.post(route("company.media.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                uploadForm.reset("files", "folder_id");
            },
        });
    };

    const toggleVisibility = (id) => {
        router.patch(
            route("company.media.visibility", id),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const deleteMedia = (id) => {
        if (confirm("A je e sigurt që dëshiron ta fshish këtë media?")) {
            router.delete(route("company.media.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    const fileUrl = (item) => item.file_url || `/storage/${item.file_path}`;

    return (
        <CompanyLayout title="Media Files">
            <div className="space-y-8">
                <div>
                    <p className="text-sm font-bold text-[#7B61FF]">
                        Media Management
                    </p>

                    <h1 className="mt-1 text-4xl font-black text-slate-950">
                        Media Files
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Upload, preview, hide/show dhe fshi foto ose video për guests.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Total Media
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-slate-950">
                            {media.length}
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Photos
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-blue-600">
                            {media.filter((item) => item.file_type === "photo").length}
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Videos
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-purple-600">
                            {media.filter((item) => item.file_type === "video").length}
                        </h2>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                    <form
                        onSubmit={uploadMedia}
                        className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-black text-slate-950">
                                Upload Media
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Zgjidh guest, folder dhe upload foto/video.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Guest
                                </label>

                                <select
                                    value={uploadForm.data.guest_id}
                                    onChange={(e) => {
                                        uploadForm.setData("guest_id", e.target.value);
                                        uploadForm.setData("folder_id", "");
                                    }}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10"
                                >
                                    <option value="">Choose guest</option>
                                    {guests.map((guest) => (
                                        <option key={guest.id} value={guest.id}>
                                            {guest.name}{" "}
                                            {guest.username ? `(${guest.username})` : ""}
                                        </option>
                                    ))}
                                </select>

                                {uploadForm.errors.guest_id && (
                                    <p className="mt-1 text-sm text-rose-500">
                                        {uploadForm.errors.guest_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Folder
                                </label>

                                <select
                                    value={uploadForm.data.folder_id}
                                    onChange={(e) =>
                                        uploadForm.setData("folder_id", e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10"
                                >
                                    <option value="">No folder</option>
                                    {filteredFolders.map((folder) => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>

                                {uploadForm.errors.folder_id && (
                                    <p className="mt-1 text-sm text-rose-500">
                                        {uploadForm.errors.folder_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Files
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-[#7B61FF] hover:bg-[#7B61FF]/5">
                                    <Upload
                                        size={34}
                                        className="mb-3 text-[#7B61FF]"
                                    />

                                    <span className="text-sm font-bold text-slate-800">
                                        Click to select files
                                    </span>

                                    <span className="mt-1 text-xs text-slate-500">
                                        JPG, PNG, WEBP, MP4, MOV, AVI up to 20MB
                                    </span>

                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            uploadForm.setData(
                                                "files",
                                                Array.from(e.target.files)
                                            )
                                        }
                                    />
                                </label>

                                {uploadForm.data.files?.length > 0 && (
                                    <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                                        {uploadForm.data.files.length} file selected
                                    </div>
                                )}

                                {uploadForm.errors.files && (
                                    <p className="mt-1 text-sm text-rose-500">
                                        {uploadForm.errors.files}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={uploadForm.processing}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7B61FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#7B61FF]/25 transition hover:bg-[#6A4DFF] disabled:opacity-60"
                            >
                                <Upload size={18} />
                                {uploadForm.processing ? "Uploading..." : "Upload Media"}
                            </button>
                        </div>
                    </form>

                    <div className="space-y-6">
                        <form
                            onSubmit={applyFilters}
                            className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="mb-5 flex items-center gap-2">
                                <Filter size={18} className="text-[#7B61FF]" />
                                <h2 className="text-lg font-black text-slate-950">
                                    Filters
                                </h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-4">
                                <select
                                    value={filterForm.data.guest_id}
                                    onChange={(e) =>
                                        filterForm.setData("guest_id", e.target.value)
                                    }
                                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                                >
                                    <option value="">All guests</option>
                                    {guests.map((guest) => (
                                        <option key={guest.id} value={guest.id}>
                                            {guest.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filterForm.data.folder_id}
                                    onChange={(e) =>
                                        filterForm.setData("folder_id", e.target.value)
                                    }
                                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                                >
                                    <option value="">All folders</option>
                                    {folders.map((folder) => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filterForm.data.type}
                                    onChange={(e) =>
                                        filterForm.setData("type", e.target.value)
                                    }
                                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                                >
                                    <option value="">All types</option>
                                    <option value="photo">Photos</option>
                                    <option value="video">Videos</option>
                                </select>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-700"
                                    >
                                        Filter
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </form>

                        {media.length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                                {media.map((item) => (
                                    <div
                                        key={item.id}
                                        className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                                    >
                                        <div className="relative aspect-video bg-slate-100">
                                            {item.file_type === "video" ? (
                                                <video
                                                    src={fileUrl(item)}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={fileUrl(item)}
                                                    alt={item.original_name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}

                                            <span
                                                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                                                    item.is_visible
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-rose-100 text-rose-700"
                                                }`}
                                            >
                                                {item.is_visible ? "Visible" : "Hidden"}
                                            </span>
                                        </div>

                                        <div className="space-y-4 p-5">
                                            <div>
                                                <p className="truncate text-sm font-black text-slate-950">
                                                    {item.original_name}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Guest: {item.guest?.name || "—"}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Folder: {item.folder?.name || "No folder"}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                    {item.file_type === "video" ? (
                                                        <Video size={13} />
                                                    ) : (
                                                        <Image size={13} />
                                                    )}
                                                    {item.file_type}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        toggleVisibility(item.id)
                                                    }
                                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200"
                                                >
                                                    {item.is_visible ? (
                                                        <span className="inline-flex items-center gap-1">
                                                            <EyeOff size={13} />
                                                            Hide
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Eye size={13} />
                                                            Show
                                                        </span>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setPreview(item)}
                                                    className="rounded-2xl bg-[#7B61FF] px-4 py-3 text-sm font-bold text-white hover:bg-[#6A4DFF]"
                                                >
                                                    Preview
                                                </button>

                                                <button
                                                    onClick={() => deleteMedia(item.id)}
                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
                                <p className="text-sm font-bold text-slate-500">
                                    Ende nuk ka media të uploaduara.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {preview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
                        <div className="relative w-full max-w-5xl rounded-3xl bg-white p-5 shadow-2xl">
                            <button
                                onClick={() => setPreview(null)}
                                className="absolute right-4 top-4 z-10 rounded-full bg-slate-900 p-2 text-white"
                            >
                                <X size={18} />
                            </button>

                            <div className="mb-4 pr-12">
                                <h2 className="truncate text-xl font-black text-slate-950">
                                    {preview.original_name}
                                </h2>

                                <p className="text-sm text-slate-500">
                                    {preview.file_type}
                                </p>
                            </div>

                            {preview.file_type === "video" ? (
                                <video
                                    src={fileUrl(preview)}
                                    controls
                                    autoPlay
                                    className="max-h-[75vh] w-full rounded-2xl object-contain"
                                />
                            ) : (
                                <img
                                    src={fileUrl(preview)}
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