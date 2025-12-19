export type Tip = {
    id: string;
    text: string;
};

export type Step = {
    number: number;
    instruction: string;
    duration?: string;
};

export type Recipe = {
    title: string;
    description: string;
    prepTime: string;
    cookTime: string;
    servings: number;
    tips: Tip[];
    steps: Step[];
};
