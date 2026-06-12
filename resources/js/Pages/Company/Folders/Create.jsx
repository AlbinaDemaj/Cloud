import CompanyLayout from "@/Layouts/CompanyLayout";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, FolderPlus, UploadCloud, X } from "lucide-react";

export default function Create({ guests = [], parentFolders = [] }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        name: "",
        guest_id: "",
        parent_id: "",
        files: [],
    });

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
    ];

    const formatBytes = (bytes) => {
        if (!bytes) return "0 MB";
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    const totalSize = data.files.reduce((sum, file) => sum + file.size, 0);

    const readEntry = (entry) => {
        return new Promise((resolve) => {
            if (entry.isFile) {
                entry.file((file) => resolve([file]));
                return;
            }

            if (entry.isDirectory) {
                const reader = entry.createReader();
                let allFiles = [];

                const readAll = () => {
                    reader.readEntries(async (entries) => {
                        if (!entries.length) {
                            resolve(allFiles);
                            return;
                        }

                        const nested = await Promise.all(
                            entries.map((item) => readEntry(item))
                        );

                        allFiles = allFiles.concat(nested.flat());
                        readAll();
                    });
                };

                readAll();
                return;
            }

            resolve([]);
        });
    };

    const setSelectedFiles = (files) => {
        const validFiles = files.filter((file) =>
            allowedTypes.includes(file.type)
        );

        if (!validFiles.length) return;

        setData("files", validFiles);

        if (!data.name) {
            const firstPath = validFiles[0].webkitRelativePath || "";
            const folderName = firstPath
                ? firstPath.split("/")[0]
                : "Uploaded Folder";

            setData("name", folderName);
        }
    };

    const handleInputFiles = (fileList) => {
        setSelectedFiles(Array.from(fileList || []));
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (processing) return;

        const items = Array.from(e.dataTransfer?.items || []);

        if (items.length) {
            const entries = items
                .map((item) => item.webkitGetAsEntry?.())
                .filter(Boolean);

            const files = await Promise.all(entries.map((entry) => readEntry(entry)));

            setSelectedFiles(files.flat());
            return;
        }

        handleInputFiles(e.dataTransfer.files);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("company.folders.store"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const removeFiles = () => {
        if (processing) return;
        setData("files", []);
    };

    const filteredParentFolders = parentFolders.filter(
        (folder) =>
            data.guest_id && String(folder.guest_id) === String(data.guest_id)
    );

    return (
        <CompanyLayout title="Create Folder">
            <div className="mx-auto max-w-4xl space-y-6">
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
                            Folder Upload
                        </p>

                        <h1 className="mt-1 text-3xl font-black text-slate-950">
                            Create Folder for Guest
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Zgjedh guest-in, pastaj tërhiq folderin ose kliko për ta zgjedhur.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Select Guest
                            </label>

                            <select
                                value={data.guest_id}
                                disabled={processing}
                                onChange={(e) => {
                                    setData("guest_id", e.target.value);
                                    setData("parent_id", "");
                                }}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10 disabled:bg-slate-100"
                            >
                                <option value="">Choose guest</option>

                                {guests.map((guest) => (
                                    <option key={guest.id} value={guest.id}>
                                        {guest.name}{" "}
                                        {guest.username ? `(${guest.username})` : ""}
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
                                Folder Name
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                disabled={processing}
                                onChange={(e) => setData("name", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10 disabled:bg-slate-100"
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
                                Parent Folder
                            </label>

                            <select
                                value={data.parent_id}
                                disabled={!data.guest_id || processing}
                                onChange={(e) => setData("parent_id", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10 disabled:bg-slate-100 disabled:text-slate-400"
                            >
                                <option value="">No Parent Folder</option>

                                {filteredParentFolders.map((folder) => (
                                    <option key={folder.id} value={folder.id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Upload Folder from Laptop
                            </label>

                            <label
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDrop={handleDrop}
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-6 py-12 text-center transition ${
                                    processing
                                        ? "pointer-events-none border-slate-200 bg-slate-100 opacity-70"
                                        : "border-slate-300 bg-slate-50 hover:border-[#7B61FF] hover:bg-[#7B61FF]/5"
                                }`}
                            >
                                <UploadCloud size={42} className="mb-4 text-[#7B61FF]" />

                                <p className="text-lg font-black text-slate-900">
                                    Drag folder here or click to choose
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    Pranon foto dhe video nga folderi.
                                </p>

                                <input
                                    type="file"
                                    multiple
                                    webkitdirectory="true"
                                    directory="true"
                                    disabled={processing}
                                    onChange={(e) => handleInputFiles(e.target.files)}
                                    className="hidden"
                                />
                            </label>

                            {data.files.length > 0 && (
                                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold text-slate-900">
                                                {data.files.length} files selected
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                Folder name: {data.name}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                Total size: {formatBytes(totalSize)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={removeFiles}
                                            className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                                        >
                                            <X size={16} />
                                            Remove
                                        </button>
                                    </div>

                                    {progress && (
                                        <div className="mt-5">
                                            <div className="mb-2 flex justify-between text-sm font-bold text-slate-700">
                                                <span>Uploading files...</span>
                                                <span>{progress.percentage}%</span>
                                            </div>

                                            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className="h-full rounded-full bg-[#7B61FF] transition-all"
                                                    style={{
                                                        width: `${progress.percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {errors.files && (
                                <p className="mt-1 text-sm text-rose-500">
                                    {errors.files}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                            <Link
                                href={route("company.folders.index")}
                                className={`rounded-2xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 ${
                                    processing ? "pointer-events-none opacity-50" : ""
                                }`}
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    !data.guest_id ||
                                    !data.name ||
                                    data.files.length === 0
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7B61FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#7B61FF]/25 transition hover:bg-[#6A4DFF] disabled:opacity-60"
                            >
                                <FolderPlus size={18} />
                                {processing
                                    ? progress
                                        ? `Uploading ${progress.percentage}%`
                                        : "Preparing upload..."
                                    : "Create Folder & Upload"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CompanyLayout>
    );
}