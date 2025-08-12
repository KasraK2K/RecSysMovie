import type Movie from "@/common/types/movie";
import { Geist, Geist_Mono } from "next/font/google";
import { FormEvent, useRef, useState } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [moviePlots, setMoviePlots] = useState<Movie[]>([]);
  const searchInput = useRef<HTMLInputElement>(null);

  function search(event: FormEvent) {
    event.preventDefault();
    const enteredSearch = searchInput.current?.value || "";
    fetch("/api/recommendations", {
      method: "POST",
      body: JSON.stringify({
        search: enteredSearch,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMoviePlots(data);
      });
  }

  return (
    <main className={`${geistSans.variable} ${geistMono.variable}`}>
      <form onSubmit={search}>
        <input
          type="search"
          id="default-search"
          ref={searchInput}
          autoComplete="off"
          placeholder="Type what do you want to watch about"
          required
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {moviePlots.map((item) => (
          <div key={item.title}>
            {item.director}
            {item.year}
            {item.title}
            {item.wiki}
          </div>
        ))}
      </div>
    </main>
  );
}
