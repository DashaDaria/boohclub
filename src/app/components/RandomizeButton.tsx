'use client'

import { useState } from 'react';
import { SelectCriteria } from 'src/db/schema';

interface RandomCombinationProps {
    genres: SelectCriteria[];
    onRandomize?: (genreNuance: string) => Promise<void>;
    disabled: boolean;
}

interface RandomResult {
    category: string;
    nuance: string | null;
}

export default function RandomizeButton({ genres, onRandomize, disabled }: RandomCombinationProps) {
    const [randomResult, setRandomResult] = useState<RandomResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRandomize = async () => {
        if (genres.length === 0) return;
        setIsLoading(true);

        try {
            const availableCategories = genres.map(g => g.category);
            const availableNuances = genres
                .filter(g => g.nuance)
                .map(g => g.nuance as string);

            const randomCategory = availableCategories[
                Math.floor(Math.random() * availableCategories.length)
            ];

            const randomNuance = availableNuances.length > 0
                ? availableNuances[Math.floor(Math.random() * availableNuances.length)]
                : null;

            const newResult = {
                category: randomCategory,
                nuance: randomNuance
            };
            setRandomResult(newResult);

            // Call OpenAI with the random combination if onRandomize is provided
            if (onRandomize) {
                const genreNuance = `${newResult.category} ${newResult.nuance || ''}`.trim();
                await onRandomize(genreNuance);
            }
        } catch (error) {
            console.error('Error in randomization:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">А что читать то будем?</h3>
                <button
                    onClick={handleRandomize}
                    type="button"
                    className={`px-4 py-2 ${isLoading
                        ? 'bg-gray-400'
                        : 'bg-purple-600 hover:bg-purple-700'
                        } text-white font-medium rounded-md shadow-sm transition-colors duration-200`}
                    disabled={genres.length === 0 || isLoading || disabled}
                >
                    {genres.length === 0
                        ? 'No genres available'
                        : isLoading
                            ? 'Getting recommendations...'
                            : 'Подскажи'}
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