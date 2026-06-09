import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';

export default function Index({ media, companies = [], guests = [], filters = {} }) {
    const { data, setData, get } = useForm({
        company_id: filters.company_id || '',
        guest_id: filters.guest_id || '',
        type: filters.type || '',
    });

    const applyFilters = (e) => {
        e.preventDefault();

        get(route('admin.media.index'), {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        router.get(route('admin.media.index'));
    };

    const toggleVisibility = (id) => {
        router.patch(route('admin.media.visibility', id), {}, {
            preserveScroll: true,
        });
    };

    const deleteMedia = (id) => {
        if (confirm('Are you sure you want to delete this media?')) {
            router.delete(route('admin.media.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const totalFiles = media?.data?.length || 0;

    return (
        <AdminLayout title="Media Files">
            <div className="space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                            Media Library
                        </p>

                        <h1 className="mt-2 text-4xl font-black text-slate-950">
                            Media Files
                        </h1>

                        <p className="mt-2 text-slate-500">
                            View, filter, hide or delete uploaded photos and videos.
                        </p>
                    </div>

                    <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">
                        {totalFiles} files shown
                    </div>
                </div>

                <form
                    onSubmit={applyFilters}
                    className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        <select
                            value={data.company_id}
                            onChange={(e) => setData('company_id', e.target.value)}
                            className="rounded-2xl border border-slate-200 bg-[#F6F8FC] px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                        >
                            <option value="">All companies</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={data.guest_id}
                            onChange={(e) => setData('guest_id', e.target.value)}
                            className="rounded-2xl border border-slate-200 bg-[#F6F8FC] px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                        >
                            <option value="">All guests</option>
                            {guests.map((guest) => (
                                <option key={guest.id} value={guest.id}>
                                    {guest.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="rounded-2xl border border-slate-200 bg-[#F6F8FC] px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                        >
                            <option value="">All types</option>
                            <option value="photo">Photos</option>
                            <option value="video">Videos</option>
                        </select>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                            >
                                Filter
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded-2xl bg-[#F6F8FC] px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {media?.data?.length > 0 ? (
                        media.data.map((item) => (
                            <div
                                key={item.id}
                                className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative aspect-video overflow-hidden bg-slate-100">
                                    {item.file_type === 'video' ? (
                                        <video
                                            src={item.file_url}
                                            controls
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={item.file_url}
                                            alt={item.original_name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    )}

                                    <div className="absolute left-4 top-4 flex gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-black capitalize backdrop-blur ${
                                                item.file_type === 'video'
                                                    ? 'bg-violet-50/90 text-violet-700'
                                                    : 'bg-blue-50/90 text-blue-700'
                                            }`}
                                        >
                                            {item.file_type}
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-black backdrop-blur ${
                                                item.is_visible
                                                    ? 'bg-emerald-50/90 text-emerald-700'
                                                    : 'bg-rose-50/90 text-rose-700'
                                            }`}
                                        >
                                            {item.is_visible ? 'Visible' : 'Hidden'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-5 p-6">
                                    <div>
                                        <h3 className="truncate text-lg font-black text-slate-950">
                                            {item.original_name}
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Company: {item.company?.name || 'N/A'}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            Guest: {item.guest?.name || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleVisibility(item.id)}
                                            className="rounded-2xl bg-[#F6F8FC] px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                                        >
                                            {item.is_visible ? 'Hide' : 'Show'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteMedia(item.id)}
                                            className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full rounded-[32px] border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
                            <img
                                src="/images/MediaValut.png"
                                alt="MediaVault"
                                className="mx-auto h-20 w-auto object-contain"
                            />

                            <h3 className="mt-6 text-2xl font-black text-slate-950">
                                No media files found
                            </h3>

                            <p className="mt-3 text-slate-500">
                                Try changing filters or upload media from company panel.
                            </p>
                        </div>
                    )}
                </div>

                {media?.links && (
                    <div className="flex flex-wrap gap-2">
                        {media.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-2xl px-4 py-2 text-sm font-bold ${
                                    link.active
                                        ? 'bg-slate-950 text-white'
                                        : 'bg-white text-slate-600'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}