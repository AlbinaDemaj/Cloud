import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ folders = [] }) {
    const [search, setSearch] = useState('');

    const filteredFolders = folders.filter((folder) => {
        const keyword = search.toLowerCase();

        return (
            folder.name?.toLowerCase().includes(keyword) ||
            folder.description?.toLowerCase().includes(keyword) ||
            folder.company?.name?.toLowerCase().includes(keyword) ||
            folder.guest?.name?.toLowerCase().includes(keyword)
        );
    });

    const deleteFolder = (folder) => {
        if (
            confirm(
                `A je e sigurt që do ta fshish folderin "${folder.name}"?`,
            )
        ) {
            router.delete(`/admin/folders/${folder.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout title="Folders">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900">
                        Folders
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage all folders across companies and guests.
                    </p>
                </div>

                <Link
                    href="/admin/folders/create"
                    className="rounded-2xl bg-[#071437] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#0B1D4D]"
                >
                    + Create Folder
                </Link>
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <input
                        type="text"
                        placeholder="Search by folder, company, guest..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#071437] focus:ring-4 focus:ring-slate-200"
                    />
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Total Folders
                    </p>

                    <h2 className="mt-2 text-4xl font-black text-slate-900">
                        {folders.length}
                    </h2>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                                    Folder Name
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                                    Description
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                                    Company
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                                    Guest
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-right text-sm font-black text-slate-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredFolders.map((folder) => (
                                <tr
                                    key={folder.id}
                                    className="border-t border-slate-100 transition hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4">
                                        <p className="font-black text-slate-900">
                                            {folder.name}
                                        </p>
                                    </td>

                                    <td className="max-w-xs px-6 py-4 text-sm text-slate-500">
                                        {folder.description || '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                        {folder.company?.name || '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {folder.guest?.name || '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-4 py-2 text-xs font-black ${
                                                folder.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {folder.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/folders/${folder.id}/edit`}
                                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteFolder(folder)
                                                }
                                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredFolders.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        No folders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}