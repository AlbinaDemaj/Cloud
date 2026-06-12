import CompanyLayout from '@/Layouts/CompanyLayout';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    Folder,
    FolderOpen,
    FolderPlus,
    UploadCloud,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Show({ guest, folders = [] }) {
    const [localFolders, setLocalFolders] = useState(folders || []);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [draggingFolder, setDraggingFolder] = useState(false);
    const [uploadingFolder, setUploadingFolder] = useState(false);
    const [uploadText, setUploadText] = useState('');

    useEffect(() => {
        setLocalFolders(folders || []);
    }, [folders]);

    const createFolderByName = async (name) => {
        const cleanName = name?.trim();

        if (!cleanName) return null;

        const response = await axios.post(
            route('company.guests.folders.store', guest.id),
            { name: cleanName },
            { headers: { Accept: 'application/json' } },
        );

        const newFolder = response.data?.folder;

        if (newFolder?.id) {
            setLocalFolders((prev) => {
                if (prev.some((folder) => folder.id === newFolder.id)) {
                    return prev;
                }

                return [newFolder, ...prev];
            });

            return newFolder;
        }

        return null;
    };

    const createFolder = async (e) => {
        e.preventDefault();

        if (!folderName.trim() || creatingFolder) return;

        try {
            setCreatingFolder(true);

            await createFolderByName(folderName);

            setFolderName('');
            setShowFolderModal(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Folder could not be created.');
        } finally {
            setCreatingFolder(false);
        }
    };

    const readAllFilesFromDirectory = async (directoryEntry) => {
        const files = [];

        const readDirectory = async (dirEntry) => {
            const reader = dirEntry.createReader();

            const readBatch = async () => {
                const entries = await new Promise((resolve, reject) => {
                    reader.readEntries(resolve, reject);
                });

                if (!entries.length) return;

                for (const entry of entries) {
                    if (entry.isFile) {
                        const file = await new Promise((resolve, reject) => {
                            entry.file(resolve, reject);
                        });

                        files.push(file);
                    }

                    if (entry.isDirectory) {
                        await readDirectory(entry);
                    }
                }

                await readBatch();
            };

            await readBatch();
        };

        await readDirectory(directoryEntry);

        return files;
    };

    const uploadFilesToFolder = async (folderId, files) => {
        const selectedFiles = Array.from(files || []);

        if (!folderId || selectedFiles.length === 0) return;

        const chunkSize = 20;

        for (let i = 0; i < selectedFiles.length; i += chunkSize) {
            const chunk = selectedFiles.slice(i, i + chunkSize);

            setUploadText(
                `Uploading ${Math.min(i + chunk.length, selectedFiles.length)} / ${selectedFiles.length} files...`,
            );

            const formData = new FormData();

            formData.append('guest_id', guest.id);
            formData.append('folder_id', folderId);

            chunk.forEach((file) => {
                formData.append('files[]', file);
            });

           await axios.post(route('company.media.upload'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                },
            });
        }
    };

    const uploadWholeFolder = async (folderNameToCreate, files) => {
        if (!folderNameToCreate || !files.length) return;

        setUploadingFolder(true);
        setUploadText(`Creating folder ${folderNameToCreate}...`);

        const createdFolder = await createFolderByName(folderNameToCreate);

        if (!createdFolder?.id) {
            throw new Error('Folder could not be created.');
        }

        await uploadFilesToFolder(createdFolder.id, files);

        setUploadText('Upload complete.');

        router.visit(
            route('company.guests.folders.show', [guest.id, createdFolder.id]),
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    const handleFolderDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDraggingFolder(false);

        const items = Array.from(e.dataTransfer?.items || []);

        const folderEntry = items
            .map((item) => item.webkitGetAsEntry?.())
            .find((entry) => entry?.isDirectory);

        if (!folderEntry) {
            alert('Vendose një folder komplet, jo vetëm file.');
            return;
        }

        try {
            setUploadingFolder(true);
            setUploadText(`Reading ${folderEntry.name}...`);

            const files = await readAllFilesFromDirectory(folderEntry);

            if (!files.length) {
                alert('Ky folder nuk ka file brenda.');
                return;
            }

            await uploadWholeFolder(folderEntry.name, files);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    error.message ||
                    'Folder upload failed.',
            );
        } finally {
            setTimeout(() => {
                setUploadingFolder(false);
                setUploadText('');
            }, 800);
        }
    };

    const handleFolderInput = async (e) => {
        const files = Array.from(e.target.files || []);

        if (!files.length) return;

        const folderNameFromInput = files[0].webkitRelativePath
            ? files[0].webkitRelativePath.split('/')[0]
            : 'New Folder';

        try {
            await uploadWholeFolder(folderNameFromInput, files);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    error.message ||
                    'Folder upload failed.',
            );
        } finally {
            e.target.value = '';

            setTimeout(() => {
                setUploadingFolder(false);
                setUploadText('');
            }, 800);
        }
    };

    const openFolder = (folder) => {
        router.visit(route('company.guests.folders.show', [guest.id, folder.id]));
    };

    return (
        <CompanyLayout title={`${guest.name} Folders`}>
            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-[34px] bg-[#07101F] p-8 text-white shadow-2xl">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <Link
                                href={route('company.guests.index')}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/15"
                            >
                                <ArrowLeft size={16} />
                                Back to guests
                            </Link>

                            <h1 className="mt-6 text-4xl font-black md:text-5xl">
                                {guest.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-slate-300">
                                Drag a folder here and all files inside it will be uploaded.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFolderModal(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 hover:bg-slate-100"
                        >
                            <FolderPlus size={18} />
                            Create Folder
                        </button>
                    </div>
                </div>

                <div
                    onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDraggingFolder(true);
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDraggingFolder(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (e.currentTarget.contains(e.relatedTarget)) return;

                        setDraggingFolder(false);
                    }}
                    onDrop={handleFolderDrop}
                    className={`rounded-[34px] border border-dashed p-8 text-center shadow-sm transition ${
                        draggingFolder
                            ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100'
                            : uploadingFolder
                              ? 'border-blue-400 bg-blue-50 ring-4 ring-blue-100'
                              : 'border-blue-300 bg-white'
                    }`}
                >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-blue-50 text-blue-600">
                        <UploadCloud size={38} />
                    </div>

                    <h2 className="mt-5 text-2xl font-black text-slate-950">
                        Drag & Drop Folder Here
                    </h2>

                    {uploadingFolder && (
                        <p className="mt-4 text-sm font-black text-blue-700">
                            {uploadText}
                        </p>
                    )}

                    <label
                        className={`mx-auto mt-6 inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-sm font-black text-white ${
                            uploadingFolder
                                ? 'cursor-not-allowed bg-slate-400'
                                : 'cursor-pointer bg-slate-950 hover:bg-slate-800'
                        }`}
                    >
                        <FolderPlus size={18} />
                        Select Folder

                        <input
                            type="file"
                            className="hidden"
                            webkitdirectory=""
                            directory=""
                            multiple
                            disabled={uploadingFolder}
                            onChange={handleFolderInput}
                        />
                    </label>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">Guest</p>
                        <h2 className="mt-3 truncate text-3xl font-black text-slate-950">
                            {guest.name}
                        </h2>
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">Folders</p>
                        <h2 className="mt-3 text-4xl font-black text-slate-950">
                            {localFolders.length}
                        </h2>
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">Total Files</p>
                        <h2 className="mt-3 text-4xl font-black text-slate-950">
                            {localFolders.reduce(
                                (total, folder) =>
                                    total + Number(folder.media_count || 0),
                                0,
                            )}
                        </h2>
                    </div>
                </div>

                <div className="rounded-[34px] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-950">
                                Guest Folders
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Click a folder to open it and upload files inside.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFolderModal(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
                        >
                            <FolderPlus size={17} />
                            New Folder
                        </button>
                    </div>

                    {localFolders.length === 0 ? (
                        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                            <Folder className="mx-auto text-slate-300" size={64} />

                            <h3 className="mt-4 text-2xl font-black text-slate-950">
                                No folders yet
                            </h3>

                            <p className="mt-2 text-slate-500">
                                Drag a folder above or create the first folder manually.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {localFolders.map((folder) => (
                                <button
                                    key={folder.id}
                                    type="button"
                                    onClick={() => openFolder(folder)}
                                    className="group rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg">
                                            <FolderOpen size={30} />
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                            {folder.media_count || 0} files
                                        </span>
                                    </div>

                                    <h3 className="mt-5 truncate text-xl font-black text-slate-950">
                                        {folder.name}
                                    </h3>

                                    <p className="mt-2 text-sm font-semibold text-slate-500">
                                        Open folder
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {showFolderModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
                        <form
                            onSubmit={createFolder}
                            className="w-full max-w-md rounded-[30px] bg-white p-7 shadow-2xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-950">
                                    Create Folder
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => setShowFolderModal(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <label className="mb-2 block text-sm font-black text-slate-700">
                                Folder name
                            </label>

                            <input
                                type="text"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder="Example: Wedding Photos"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                                autoFocus
                            />

                            <button
                                type="submit"
                                disabled={creatingFolder}
                                className="mt-5 w-full rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {creatingFolder ? 'Creating...' : 'Create Folder'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </CompanyLayout>
    );
}