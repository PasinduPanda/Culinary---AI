import { ExternalLink } from "lucide-react";
import ReactMarkdown from 'react-markdown';


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
        <div className="w-full max-w-3xl bg-white border border-neutral-100 shadow-sm p-12 text-neutral-900 mt-12 animate-in fade-in duration-700">
            <div className="prose prose-neutral max-w-none">
                <div className="font-sans leading-relaxed text-lg space-y-6 text-neutral-800 font-light">
                    <ReactMarkdown components={{
                        h1: ({ children }) => <h1 className="text-4xl font-serif font-light mb-8 text-neutral-900">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-light mt-12 mb-6 text-neutral-900">{children}</h2>,
                        li: ({ children }) => <li className="mb-4 list-none border-l-2 border-neutral-100 pl-6">{children}</li>,
                    }}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>

            {groundingMetadata?.groundingChunks && (
                <div className="mt-16 pt-8 border-t border-neutral-50">
                    <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
                        Sources & Citations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {groundingMetadata.groundingChunks.map((chunk, idx) => {
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
                    {groundingMetadata.searchEntryPoint && (
                        <div className="mt-6 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0" dangerouslySetInnerHTML={{ __html: groundingMetadata.searchEntryPoint.renderedContent }} />
                    )}
                </div>
            )}
        </div>
    );
}
