import { useEffect, useState } from "react";
import { getLinkStats } from "../api";
import {
    X,
    Calendar,
    MousePointer2,
    Link as LinkIcon,
    Clock,
} from "lucide-react";

function formatIST(value) {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });
}

export default function AnalyticsModal({ isOpen, onClose, linkCode }) {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // If modal isn't open or there's no code, reset and skip fetch
        if (!isOpen || !linkCode) {
            setStats(null);
            return;
        }

        const fetchStats = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const response = await getLinkStats(linkCode);
                setStats(response.data);
            } catch (err) {
                console.error("Failed to load link analytics:", err);
                setErrorMessage("Failed to load analytics");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [isOpen, linkCode]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                        Link Analytics
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                            <p className="text-slate-500 text-sm">Loading stats...</p>
                        </div>
                    ) : errorMessage ? (
                        <div className="text-center py-8 text-red-500">
                            <p>{errorMessage}</p>
                        </div>
                    ) : stats ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-blue-600 font-medium mb-1">
                                    Total Clicks
                                </p>
                                <div className="text-4xl font-bold text-blue-700 flex items-center justify-center gap-2">
                                    <MousePointer2 className="w-6 h-6 opacity-50" />
                                    {stats.clicks}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <LinkIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-500">
                                            Original URL
                                        </p>
                                        <a
                                            href={stats.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-blue-600 hover:underline truncate block"
                                        >
                                            {stats.url}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Created At
                                        </p>
                                        <p className="text-sm text-slate-900">
                                            {formatIST(stats.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Last Clicked
                                        </p>
                                        <p className="text-sm text-slate-900">
                                            {stats.last_clicked
                                                ? formatIST(stats.last_clicked)
                                                : "Never clicked"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
