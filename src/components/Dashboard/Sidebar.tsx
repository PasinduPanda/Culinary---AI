import React from 'react';
import { Tip } from '@/types/recipe';

interface SidebarProps {
    tips: Tip[];
}

export default function Sidebar({ tips }: SidebarProps) {
    return (
        <aside className="w-full lg:w-80 lg:flex-shrink-0 bg-neutral-50 p-8 lg:min-h-screen border-r border-neutral-100">
            <div className="lg:sticky lg:top-8 text-neutral-900">
                <h2 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase mb-6">Chef&apos;s Tips</h2>
                <ul className="space-y-6">
                    {tips.map((tip) => (
                        <li key={tip.id} className="text-neutral-800 text-sm leading-relaxed border-l-2 border-neutral-200 pl-4">
                            {tip.text}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
