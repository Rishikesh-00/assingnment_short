import { useEffect, useState } from "react";
import { getAllLinks, deleteLink } from "../api";
import {
    Copy,
    Trash2,
    ExternalLink,
    BarChart2,
    Globe,
    LineChart,
} from "lucide-react";
import AnalyticsModal from "./AnalyticsModal";

const API_BASE_URL = "http://localhost:5000";

export default function LinksTable() {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLinkCode, setSelectedLinkCode] = useState(null);

    // Fetch all links from the API
    const loadLinks = async () => {
        try {
            const { data } = await getAllLinks();
            setLinks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error while fetching links:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (code) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this link?"
        );
        if (!confirmed) return;

        try {
            await deleteLink(code);
            // Optimistic update so it feels snappier
            setLinks((prev) => prev.filter((item) => item.code !== code));
        } catch (error) {
            console.error("Failed to delete link:", error);
            window.alert("Failed to delete link. Please try again.");
        }
    };

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            window.alert("Copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            window.alert("Could not copy. Please try again.");
        }
    };

    useEffect(() => {
        // initial fetch
        loadLinks();

        // refresh list whenever a new link is created elsewhere in the app
        const handleCreated = () => {
            loadLinks();
        };

        window.addEventListener("link-created", handleCreated);

        return () => {
            window.removeEventListener("link-created", handleCreated);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-12 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-slate-200 rounded-full" />
                    <div className="h-4 w-48 bg-slate-200 rounded" />
                </div>
            </div>
        );
    }

    if (links.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-12 text-center">
                <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Globe className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                    No links created yet
                </h3>
                <p className="mt-2 text-slate-500 max-w-sm mx-auto">
                    Get started by creating your first short link using the form above.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                        2
                    </span>
                    Your Links
                </h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {links.length} {links.length === 1 ? "Link" : "Links"}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Short Link</th>
                            <th className="px-6 py-4">Original Destination</th>
                            <th className="px-6 py-4 text-center">Clicks</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {links.map((link) => {
                            const shortUrl = `${API_BASE_URL}/${link.code}`;

                            return (
                                <tr
                                    key={link.code}
                                    className="hover:bg-slate-50/80 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <a
                                                    href={shortUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline block"
                                                >
                                                    /{link.code}
                                                </a>
                                                <span className="text-xs text-slate-400">
                                                    localhost:5000
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div
                                            className="max-w-xs truncate text-slate-600 text-sm font-medium"
                                            title={link.url}
                                        >
                                            {link.url}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5 text-slate-600 font-medium bg-slate-100 py-1 px-2.5 rounded-md w-fit mx-auto">
                                            <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                                            {link.clicks}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedLinkCode(link.code)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="View Analytics"
                                            >
                                                <LineChart className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleCopy(shortUrl)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Copy Link"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(link.code)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete Link"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <AnalyticsModal
                isOpen={!!selectedLinkCode}
                linkCode={selectedLinkCode}
                onClose={() => setSelectedLinkCode(null)}
            />
        </div>
    );
}
