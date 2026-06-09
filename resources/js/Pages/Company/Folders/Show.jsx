import CompanyLayout from "@/Layouts/CompanyLayout";
import { Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Folder,
    User,
    Image,
    Video,
} from "lucide-react";

export default function Show({ folder, media = [] }) {
    const deleteFolder = () => {
        if (confirm("A je e sigurt që dëshiron ta fshish këtë folder?")) {
            router.delete(route("company.folders.destroy", folder.id));
        }
    };

    return (
        <CompanyLayout title="Folder Details">
            <div className="space-y-8">
                <Link
                    href={route("company.folders.index")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#7B61FF]"
                >
                    <ArrowLeft size={17} />
                    Back to folders
                </Link>

                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7B61FF]/10 text-[#7B61FF]">
                                <Folder size={30} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-[#7B61FF]">
                                    Folder Details
                                </p>

                                <h1 className="mt-1 text-4xl font-black text-slate-950">
                                    {folder.name}
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Folder i lidhur me guest dhe media files.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={route("company.folders.edit", folder.id)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                            >
                                <Pencil size={17} />
                                Edit
                            </Link>

                            <button
                                onClick={deleteFolder}
                                className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-bold text-white hover:bg-rose-600"
                            >
                                <Trash2 size={17} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Guest
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                            <User size={18} className="text-[#7B61FF]" />
                            <h2 className="text-xl font-black text-slate-950">
                                {folder.guest?.name || "—"}
                            </h2>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Photos
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-blue-600">
                            {
                                media.filter(
                                    (item) => item.file_type === "photo"
                                ).length
                            }
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Videos
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-purple-600">
                            {
                                media.filter(
                                    (item) => item.file_type === "video"
                                ).length
                            }
                        </h2>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-950">
                                Media Files
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Media të lidhura me këtë folder.
                            </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                            {media.length} files
                        </span>
                    </div>

                    {media.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                                >
                                    <div className="aspect-video bg-slate-200">
                                        {item.file_type === "video" ? (
                                            <video
                                                src={item.file_url}
                                                controls
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={item.file_url}
                                                alt={item.original_name}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <p className="truncate text-sm font-bold text-slate-800">
                                            {item.original_name}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                                                {item.file_type === "video" ? (
                                                    <Video size={13} />
                                                ) : (
                                                    <Image size={13} />
                                                )}
                                                {item.file_type}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                    item.is_visible
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-rose-100 text-rose-700"
                                                }`}
                                            >
                                                {item.is_visible
                                                    ? "Visible"
                                                    : "Hidden"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl bg-slate-50 p-10 text-center">
                            <p className="text-sm font-semibold text-slate-500">
                                Ende nuk ka media në këtë folder.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </CompanyLayout>
    );
}