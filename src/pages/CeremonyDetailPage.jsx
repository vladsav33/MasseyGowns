import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchCeremonyContentById } from "../api/CeremonyApi";

export default function CeremonyDetailPage() {
  const { id } = useParams();
  const [ceremony, setCeremony] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCeremonyContentById(id);

        if (!cancelled) {
          setCeremony(data);
        }
      } catch (e) {
        console.error("Failed to load ceremony content:", e);
        if (!cancelled) {
          setError("Failed to load ceremony content.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="mx-auto w-full max-w-4xl px-6 pt-10 pb-12">
        <div className="mb-6">
          <Link
            to="/faqs"
            className="text-sky-700 text-sm font-medium hover:underline"
          >
            ← Back to FAQ
          </Link>
        </div>

        {loading && (
          <div className="text-slate-500">Loading ceremony content...</div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && ceremony && (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {ceremony.name}
            </h1>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div
                className="prose max-w-none prose-slate"
                dangerouslySetInnerHTML={{ __html: ceremony.content || "" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
