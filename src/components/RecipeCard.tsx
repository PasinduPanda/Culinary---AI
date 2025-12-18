import { ExternalLink } from "lucide-react";
import ReactMarkdown from 'react-markdown'; // We don't have this, I need to check if I should install it or just render text. 
// Plan didn't specify react-markdown, but API returns markdown. I'll use simple whitespace params or install react-markdown. 
// Let's stick to simple implementation first or just install it quickly?
// Efficient path: Just use whitespace-pre-wrap for now.

interface RecipeCardProps {
    content: string;
    groundingMetadata?: {
        searchEntryPoint?: {
            renderedContent: string;
        };
        groundingChunks?: {
            web?: {
                uri: string;
                title: string;
            };
        }[];
        webSearchQuery?: string[];
    };
}

export default function RecipeCard({ content, groundingMetadata }: RecipeCardProps) {
    return (
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl text-white mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap font-sans leading-relaxed text-lg">
                    {/* Basic markdown-like rendering or just text */}
                    {content}
                </div>
            </div>

            {groundingMetadata?.groundingChunks && (
                <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                        Sources & Grounding
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {groundingMetadata.groundingChunks.map((chunk, idx) => {
                            if (chunk.web) {
                                return (
                                    <a
                                        key={idx}
                                        href={chunk.web.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs text-blue-200 hover:text-blue-100"
                                    >
                                        <span>{chunk.web.title}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                );
                            }
                            return null;
                        })}
                    </div>
                    {groundingMetadata.searchEntryPoint && (
                        <div className="mt-4" dangerouslySetInnerHTML={{ __html: groundingMetadata.searchEntryPoint.renderedContent }} />
                    )}
                </div>
            )}
        </div>
    );
}
