'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';

export default function Home() {
  const [dish, setDish] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // Using any for simplicity in this MVP, ideally a type
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish || !country) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dish, country }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs for aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-2xl text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mb-6 drop-shadow-sm">
          Culinary AI
        </h1>
        <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto">
          Discover authentic recipes from around the world, grounded in real-world data.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full">
          <input
            type="text"
            placeholder="Dish Name (e.g. Sushi)"
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-white/30"
          />
          <input
            type="text"
            placeholder="Country (e.g. Japan)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={loading || !dish || !country}
            className="bg-white text-slate-900 rounded-xl px-8 py-4 font-semibold hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
            <span>Search</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200">
            {error}
          </div>
        )}
      </div>

      {result && (
        <RecipeCard
          content={result.text}
          groundingMetadata={result.groundingMetadata}
        />
      )}
    </main>
  );
}
