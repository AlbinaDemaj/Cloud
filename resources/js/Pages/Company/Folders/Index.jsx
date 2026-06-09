import CompanyLayout from "@/Layouts/CompanyLayout";
import { Link, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Eye, Folder, User } from "lucide-react";

export default function Index({ folders = [] }) {
    const deleteFolder = (id) => {
        if (confirm("A je e sigurt që dëshiron ta fshish këtë folder?")) {
            router.delete(route("company.folders.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <CompanyLayout title="Folders">
            <div className="space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-bold text-[#7B61FF]">
                            Folder Management
                        </p>

                        <h1 className="mt-1 text-4xl font-black text-slate-950">
                            Folders
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Menaxho folders për guests dhe media files.
                        </p>
                    </div>

                    <Link
                        href={route("company.folders.create")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7B61FF] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#7B61FF]/25 transition hover:bg-[#6A4DFF]"
                    >
                        <Plus size={18} />
                        Create Folder
                    </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Total Folders
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-slate-950">
                            {folders.length}
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            With Guests
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-[#7B61FF]">
                            {folders.filter((folder) => folder.guest).length}
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Media Files
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-emerald-600">
                            {folders.reduce(
                                (total, folder) =>
                                    total + Number(folder.media_count || 0),
                                0
                            )}
                        </h2>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5">
                        <h2 className="text-lg font-black text-slate-950">
                            Folders List
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Folder</th>
                                    <th className="px-6 py-4">Guest</th>
                                    <th className="px-6 py-4">Media</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {folders.length > 0 ? (
                                    folders.map((folder) => (
                                        <tr
                                            key={folder.id}
                                            className="transition hover:bg-slate-50/80"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7B61FF]/10 text-[#7B61FF]">
                                                        <Folder size={20} />
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-slate-950">
                                                            {folder.name}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            ID: #{folder.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                {folder.guest ? (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <User size={15} />
                                                        {folder.guest.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                    {folder.media_count || 0} files
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-500">
                                                {folder.created_at
                                                    ? new Date(
                                                          folder.created_at
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            "company.folders.show",
                                                            folder.id
                                                        )}
                                                        className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                                                        title="View Folder"
                                                    >
                                                        <Eye size={17} />
                                                    </Link>

                                                    <Link
                                                        href={route(
                                                            "company.folders.edit",
                                                            folder.id
                                                        )}
                                                        className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                                                        title="Edit Folder"
                                                    >
                                                        <Pencil size={17} />
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            deleteFolder(folder.id)
                                                        }
                                                        className="rounded-xl border border-rose-100 p-2 text-rose-600 hover:bg-rose-50"
                                                        title="Delete Folder"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center text-sm text-slate-500"
                                        >
                                            Ende nuk ka folders të krijuar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
}