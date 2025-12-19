'use client';

import { useState } from 'react';
import { Search, Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import Sidebar from '@/components/Dashboard/Sidebar';
import StepList from '@/components/Dashboard/StepList';
import { Recipe } from '@/types/recipe';

export default function Home() {
  const [dish, setDish] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ recipe: Recipe; groundingMetadata: any } | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish || !country) return;

    setLoading(true);
    setError('');
    // We don't clear the result immediately to allow for a smoother transition if desired, 
    // but for now, let's clear it to show the loader clearly.
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

  if (result) {
    const { recipe } = result;
    return (
      <main className="min-h-screen flex flex-col lg:flex-row bg-white text-neutral-900 animate-in fade-in duration-700">
        {/* Back Button / Search Again (Minimalist) */}
        <button
          onClick={() => { setResult(null); setDish(''); setCountry(''); }}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur border border-neutral-100 shadow-sm hover:bg-neutral-50 transition-colors"
          title="Search Again"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
        </button>

        {/* Mobile Header */}
        <div className="lg:hidden p-8 bg-neutral-50 border-b border-neutral-100">
          <h1 className="text-3xl font-serif font-light mb-2">{recipe.title}</h1>
          <p className="text-neutral-500 text-sm">{recipe.description}</p>
          <div className="flex gap-4 mt-6 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            <div>Prep: {recipe.prepTime}</div>
            <div>Cook: {recipe.cookTime}</div>
            <div>Serves: {recipe.servings}</div>
          </div>
        </div>

        {/* Sidebar (Tips) */}
        <Sidebar tips={recipe.tips} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Desktop Header */}
          <header className="hidden lg:block px-12 py-16 max-w-4xl mx-auto border-b border-neutral-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-serif font-light mb-6 text-neutral-900 leading-tight">
                  {recipe.title}
                </h1>
                <p className="text-lg text-neutral-500 max-w-lg leading-relaxed">
                  {recipe.description}
                </p>
              </div>
              <div className="text-right space-y-2 text-sm font-medium tracking-wide text-neutral-400 uppercase">
                <div className="px-4 py-2 bg-neutral-50 rounded-full">Prep: {recipe.prepTime}</div>
                <div className="px-4 py-2 bg-neutral-50 rounded-full">Cook: {recipe.cookTime}</div>
                <div className="px-4 py-2 bg-neutral-50 rounded-full">Serves: {recipe.servings}</div>
              </div>
            </div>
          </header>

          {/* Steps */}
          <StepList steps={recipe.steps} />

          {/* Grounding Attribution & Sources */}
          {(result.groundingMetadata?.searchEntryPoint || result.groundingMetadata?.groundingChunks) && (
            <div className="px-12 py-12 max-w-4xl mx-auto border-t border-neutral-100">
              {result.groundingMetadata.groundingChunks && (
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
                    Sources & Citations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.groundingMetadata.groundingChunks.map((chunk: any, idx: number) => {
                      if (chunk.web) {
                        return (
                          <a
                            key={idx}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 transition-all text-xs text-neutral-500 hover:text-neutral-900"
                          >
                            <span>{chunk.web.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {result.groundingMetadata.searchEntryPoint && (
                <div className="opacity-50 contrast-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                  <div dangerouslySetInnerHTML={{ __html: result.groundingMetadata.searchEntryPoint.renderedContent }} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-neutral-900">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-6xl font-serif font-light mb-4 tracking-tight">
          Culinary AI
        </h1>
        <p className="text-neutral-400 mb-12 font-light tracking-wide italic">
          Authentic Nordic-inspired recipes from the world over.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Dish Name"
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              className="flex-1 border-b border-neutral-200 py-4 outline-none focus:border-neutral-900 transition-colors bg-transparent placeholder:text-neutral-300 font-light text-lg text-center"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex-1 border-b border-neutral-200 py-4 outline-none focus:border-neutral-900 transition-colors bg-transparent placeholder:text-neutral-300 font-light text-lg text-center"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !dish || !country}
            className="w-full mt-8 border border-neutral-900 text-neutral-900 py-4 px-8 font-medium hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
          >
            {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "Discover Recipe"}
          </button>
        </form>

        {error && (
          <div className="mt-8 text-sm text-red-400 font-light">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
