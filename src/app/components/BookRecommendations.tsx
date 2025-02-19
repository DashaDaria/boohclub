'use client';

import { useEffect, useState } from "react";
import { BookRecommendation } from "../api/recommendations/route";
import RandomizeButton from "./RandomizeButton";
import { getCriteria } from "../actions/data";
import { SelectCriteria } from "src/db/schema";

export default function BookRecommendations() {
    const [genres, setGenres] = useState<SelectCriteria[]>([]);
    const [recommendations, setRecommendations] = useState<BookRecommendation[] | null>(null);
    const [aiLoading, setAiLoading] = useState(false);


    useEffect(() => {
        async function loadGenres() {
            try {
                const fetchedGenres = await getCriteria();
                setGenres(fetchedGenres);
            } catch (error) {
                console.error('Error loading users:', error);
            }
        }
        loadGenres();
    }, []);

    const getBookRecommendations = async (genreNuance: string) => {
        setAiLoading(true);
        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genreNuance }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data = await response.json();
            setRecommendations(data);
        } catch (error) {
            console.error('Error getting recommendations:', error);
        } finally {
            setAiLoading(false);
        }
    };


    return (
        <div className=" bg-white rounded-lg shadow p-6">
            <RandomizeButton genres={genres} onRandomize={getBookRecommendations} disabled={aiLoading} />
            {recommendations && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Book Recommendations</h3>
                    {recommendations.map((book, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 shadow">
                            <h4 className="text-lg font-semibold text-gray-900">{book.title}</h4>
                            <div className="flex items-start gap-2 mt-2">
                                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                                <p className="text-sm text-gray-600 mb-2 font-semibold">{book.averageRating}</p>
                            </div>
                            <p className="text-gray-700 mb-3">{book.description}</p>
                            <a
                                href={book.goodreadsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                View on Goodreads →
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
