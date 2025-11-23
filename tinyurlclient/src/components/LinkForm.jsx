import { useState } from "react";
import { createShortUrl } from "../api";
import {
    Link,
    Type,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

export default function LinkForm({ onCreated }) {
    const [destinationUrl, setDestinationUrl] = useState("");
    const [customCode, setCustomCode] = useState("");
    const [feedback, setFeedback] = useState({ type: "", msg: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // quick client-side sanity check
        if (!destinationUrl.trim()) {
            setFeedback({
                type: "error",
                msg: "Please enter a valid destination URL.",
            });
            return;
        }

        setIsSubmitting(true);
        setFeedback({ type: "", msg: "" });

        try {
            const payload = {
                url: destinationUrl.trim(),
                code: customCode.trim() || undefined,
            };

            const { data } = await createShortUrl(payload);

            setFeedback({
                type: "success",
                msg: "Short link created successfully!",
            });

            // let parent know something was created
            if (typeof onCreated === "function") {
                onCreated(data);
            }

            // reset form
            setDestinationUrl("");
            setCustomCode("");
        } catch (err) {
            console.error("Error creating short URL:", err);
            const message =
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setFeedback({ type: "error", msg: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                        1
                    </span>
                    Create a New Link
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">
                            Destination URL
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Link className="h-5 w-5" />
                            </div>
                            <input
                                required
                                type="url"
                                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                placeholder="https://example.com/very-long-url-that-needs-shortening"
                                value={destinationUrl}
                                onChange={(e) => setDestinationUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">
                            Custom Alias{" "}
                            <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Type className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                placeholder="my-custom-link"
                                value={customCode}
                                onChange={(e) => setCustomCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Creating...
                            </>
                        ) : (
                            <>
                                Shorten URL
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </button>

                    {feedback.msg && (
                        <div
                            className={`rounded-xl p-4 flex items-start gap-3 ${feedback.type === "error"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-green-50 text-green-700"
                                }`}
                        >
                            {feedback.type === "error" ? (
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm font-medium">{feedback.msg}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
