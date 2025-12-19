import React from 'react';
import { Step } from '@/types/recipe';

interface StepListProps {
    steps: Step[];
}

export default function StepList({ steps }: StepListProps) {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6 lg:px-12 text-neutral-900">
            <h2 className="text-2xl font-light text-neutral-900 mb-10 font-serif">Instructions</h2>
            <div className="space-y-12">
                {steps.map((step) => (
                    <div key={step.number} className="group">
                        <div className="flex items-baseline gap-6">
                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 text-neutral-400 text-sm font-medium group-hover:border-neutral-900 group-hover:text-neutral-900 transition-colors duration-300">
                                {step.number}
                            </span>
                            <p className="text-lg text-neutral-800 font-light leading-8">
                                {step.instruction}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
