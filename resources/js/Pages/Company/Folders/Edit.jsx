import CompanyLayout from "@/Layouts/CompanyLayout";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

export default function Edit({ folder, guests = [], parentFolders = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: folder?.name || "",
        guest_id: folder?.guest_id || "",
        parent_id: folder?.parent_id || "",
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("company.folders.update", folder.id), {
            preserveScroll: true,
        });
    };

    const filteredParentFolders = parentFolders.filter(
        (item) =>
            data.guest_id &&
            String(item.guest_id) === String(data.guest_id) &&
            String(item.id) !== String(folder.id),
    );

    return (
        <CompanyLayout title="Edit Folder">
            <div className="mx-auto max-w-3xl space-y-6">
                <Link
                    href={route("company.folders.index")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#7B61FF]"
                >
                    <ArrowLeft size={17} />
                    Back to folders
                </Link>

                <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8">
                        <p className="text-sm font-bold text-[#7B61FF]">
                            Folder Management
                        </p>

                        <h1 className="mt-1 text-3xl font-black text-slate-950">
                            Edit Folder
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Përditëso folderin ose lidhe si subfolder me një
                            folder tjetër.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Folder Name
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10"
                                placeholder="Example: Wedding Photos"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-rose-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Select Guest
                            </label>

                            <select
                                value={data.guest_id}
                                onChange={(e) => {
                                    setData("guest_id", e.target.value);
                                    setData("parent_id", "");
                                }}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10"
                            >
                                <option value="">Choose guest</option>

                                {guests.map((guest) => (
                                    <option key={guest.id} value={guest.id}>
                                        {guest.name}{" "}
                                        {guest.username
                                            ? `(${guest.username})`
                                            : ""}
                                    </option>
                                ))}
                            </select>

                            {errors.guest_id && (
                                <p className="mt-1 text-sm text-rose-500">
                                    {errors.guest_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Parent Folder
                            </label>

                            <select
                                value={data.parent_id}
                                onChange={(e) =>
                                    setData("parent_id", e.target.value)
                                }
                                disabled={!data.guest_id}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10 disabled:bg-slate-100 disabled:text-slate-400"
                            >
                                <option value="">No Parent Folder</option>

                                {filteredParentFolders.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-2 text-xs text-slate-500">
                                Lëre bosh për folder kryesor. Zgjidh një folder
                                nëse dëshiron ta bësh subfolder.
                            </p>

                            {errors.parent_id && (
                                <p className="mt-1 text-sm text-rose-500">
                                    {errors.parent_id}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                            <Link
                                href={route("company.folders.index")}
                                className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7B61FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#7B61FF]/25 transition hover:bg-[#6A4DFF] disabled:opacity-60"
                            >
                                <Save size={18} />
                                Save Folder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CompanyLayout>
    );
}