import type Movie from "@/common/types/movie";
import { Geist, Geist_Mono } from "next/font/google";
import { FormEvent, useMemo, useRef, useState } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function SkeletonCard() {
  return (
    <div className="skeleton p-8 w-full">
      <div className="h-4 w-24 bg-white/10 rounded mb-2" />
      <div className="h-3 w-20 bg-white/10 rounded mb-4" />
      <div className="h-6 w-2/3 bg-white/10 rounded mb-4" />
      <div className="h-4 w-full bg-white/10 rounded mb-2" />
      <div className="h-4 w-11/12 bg-white/10 rounded mb-2" />
      <div className="h-4 w-10/12 bg-white/10 rounded" />
    </div>
  );
}

export default function Home() {
  const [moviePlots, setMoviePlots] = useState<Movie[]>([]);
  const [isLoading, setLoading] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  async function search(event: FormEvent) {
    event.preventDefault();
    const q = searchInput.current?.value?.trim() ?? "";
    if (!q) return;

    setLoading(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: q }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as Movie[];
      setMoviePlots(data ?? []);
    } catch (err) {
      console.error(err);
      setMoviePlots([]);
    } finally {
      setLoading(false);
    }
  }

  const empty = useMemo(
    () => !isLoading && moviePlots.length === 0,
    [isLoading, moviePlots.length],
  );

  return (
    <main
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen text-slate-100`}
    >
      {/* Hero */}
      <header className="container-prose pt-12 sm:pt-20">
        <div className="flex items-center gap-2 mb-4">
          <span className="badge">AI Movie Finder</span>
        </div>
        <h1 className="h1">
          Find movies by <span className="text-blue-400">theme</span>,{" "}
          <span className="text-blue-400">vibe</span>, or{" "}
          <span className="text-blue-400">plot</span>.
        </h1>
        <p className="lead mt-3">
          Describe what you’re in the mood for. We’ll recommend films and show a
          short plot.
        </p>

        {/* Search */}
        <section id="search" className="mt-8">
          <form onSubmit={search} className="card p-2 flex items-center gap-2">
            <div className="flex items-center flex-grow gap-2">
              <svg
                className="w-5 h-5 text-slate-400 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="default-search"
                ref={searchInput}
                type="search"
                autoComplete="off"
                placeholder="e.g. mind-bending sci-fi with unreliable narrators"
                className="input flex-grow"
                required
                aria-label="Search movies by description"
              />
            </div>
            <button
              type="submit"
              className="btn-primary h-10 px-4"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Searching…" : "Search"}
            </button>
          </form>
        </section>
      </header>

      {/* Results */}
      <section className="container-prose mt-10 mb-24">
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {empty && (
          <div className="card p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-white/10 grid place-items-center mb-4">
              <span className="text-2xl">🍿</span>
            </div>
            <p className="text-sm text-slate-300">
              Try prompts like{" "}
              <span className="text-white/80">
                “slow-burn thriller in snowy landscapes”
              </span>{" "}
              or{" "}
              <span className="text-white/80">
                “animated films about found family”
              </span>
              .
            </p>
          </div>
        )}

        {!isLoading && moviePlots.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {moviePlots.map((item) => (
              <article
                key={`${item.title}-${item.year}`}
                className="card p-8 relative overflow-hidden wrap-anywhere"
              >
                <div className="absolute top-4 right-4 text-5xl opacity-80 select-none">
                  🍿
                </div>
                <header className="mb-3">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {item.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                    <span>From {item.director}</span>
                    <span>•</span>
                    <span>Year {item.year}</span>
                  </div>
                </header>
                <p className="text-slate-100/90 italic leading-relaxed">
                  {item.plot.length > 256
                    ? item.plot.slice(0, 256) + "..."
                    : item.plot}
                </p>
                <footer className="mt-5">
                  <a
                    href={item.wiki}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 underline decoration-transparent hover:decoration-inherit transition text-blue-300 hover:text-blue-200"
                  >
                    Read more on Wikipedia
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12.5 3H17v4.5a1 1 0 1 0 2 0V2a1 1 0 0 0-1-1h-5.5a1 1 0 1 0 0 2ZM18.7 1.3l-9.9 9.9a1 1 0 1 0 1.4 1.4l9.9-9.9a1 1 0 0 0-1.4-1.4ZM3 6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-5a1 1 0 1 0-2 0v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h5a1 1 0 1 0 0-2H3Z" />
                    </svg>
                  </a>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
