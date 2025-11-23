import LinkForm from "./components/LinkForm";
import LinksTable from "./components/LinksTable";
import { Link2 } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <Link2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
            TinyLink <span className="text-blue-600">Shortener</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform long, ugly links into short, shareable URLs in seconds. Track clicks and manage your links with ease.
          </p>
        </div>

        <div className="space-y-8">
          <LinkForm onCreated={() => window.dispatchEvent(new Event('link-created'))} />
          <LinksTable />
        </div>

        <footer className="mt-16 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} TinyLink. Built for speed and simplicity.
        </footer>
      </div>
    </div>
  );
}
