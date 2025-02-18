'use client'

import { useState } from 'react';
import { SelectCriteria } from 'src/db/schema';

interface RandomCombinationProps {
    genres: SelectCriteria[];
}

interface RandomResult {
    category: string;
    nuance: string | null;
}

export default function RandomizeButton({ genres }: RandomCombinationProps) {
    const [randomResult, setRandomResult] = useState<RandomResult | null>(null);

    const handleRandomize = () => {
        if (genres.length === 0) return;

        // Filter out genres with categories and nuances
        const availableCategories = genres.map(g => g.category);
        const availableNuances = genres
            .filter(g => g.nuance)
            .map(g => g.nuance as string);

        // Get random category
        const randomCategory = availableCategories[
            Math.floor(Math.random() * availableCategories.length)
        ];

        // Get random nuance (can be null if no nuances available)
        const randomNuance = availableNuances.length > 0
            ? availableNuances[Math.floor(Math.random() * availableNuances.length)]
            : null;

        setRandomResult({
            category: randomCategory,
            nuance: randomNuance
        });
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">Random Combination</h3>
                <button
                    onClick={handleRandomize}
                    type="button"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200"
                    disabled={genres.length === 0}
                >
                    {genres.length === 0 ? 'No genres available' : 'Randomize'}
                </button>
            </div>
            {randomResult && (
                <div className="space-y-2">
                    <p className="text-lg">
                        <span className="font-medium">Genre:</span>{' '}
                        <span className="text-purple-600">{randomResult.category}</span>
                    </p>
                    {randomResult.nuance && (
                        <p className="text-lg">
                            <span className="font-medium">Nuance:</span>{' '}
                            <span className="text-purple-600">{randomResult.nuance}</span>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}