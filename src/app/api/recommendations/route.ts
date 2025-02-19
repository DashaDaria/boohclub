import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export interface BookRecommendation {
    title: string;
    author: string;
    description: string;
    goodreadsUrl: string;
    averageRating: string
}

interface OpenAIResponse {
    recommendations: BookRecommendation[];
}

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY
});

export async function POST(request: Request) {
    if (!OPEN_AI_API_KEY) {
        return NextResponse.json(
            { error: 'OpenAI API key is not configured' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();

        if (!body.genreNuance) {
            return NextResponse.json(
                { error: 'Genre and nuance combination is required' },
                { status: 400 }
            );
        }

        const { genreNuance } = body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a knowledgeable book recommender. For the given genre and style combination, recommend 3 highly-rated, well-known books that best match the criteria. 

                    Return a JSON object with a "recommendations" array containing exactly 3 book recommendations. Each book should have:
                    - title: The book's full title
                    - author: The author's full name
                    - description: A 2-3 sentence compelling description highlighting why it matches the genre/style
                    - goodreadsUrl: The Goodreads URL in format "https://www.goodreads.com/book/show/[book-id]/[book-name]"
                    - averageRating: An average rating of the book on a scale of 1-5 with decimal points allowed

                    Example format:
                    {
                    "recommendations": [
                        {
                        "title": "Book Title",
                        "author": "Author Name",
                        "description": "Book description here",
                        "goodreadsUrl": "https://www.goodreads.com/book/show/123.Book_Title",
                        "averageRating": "4.5"
                        }
                    ]
                    }`
                },
                {
                    role: "user",
                    content: `Suggest 3 books that match this genre and style: ${genreNuance}`
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content in OpenAI response');
        }

        const parsedResponse = JSON.parse(content) as OpenAIResponse;

        // Validate the response has the required format
        if (!Array.isArray(parsedResponse.recommendations) || parsedResponse.recommendations.length !== 3) {
            throw new Error('Invalid response format from OpenAI');
        }

        // Validate each book has required fields
        parsedResponse.recommendations.forEach((book, index) => {
            if (!book.title || !book.author || !book.description || !book.goodreadsUrl) {
                throw new Error(`Missing required fields in book recommendation ${index + 1}`);
            }
        });

        return NextResponse.json(parsedResponse.recommendations);

    } catch (error) {
        console.error('Error in API route:', error);

        if (error instanceof OpenAI.APIError) {
            return NextResponse.json(
                { error: 'OpenAI API error: ' + error.message },
                { status: error.status || 500 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to get recommendations' },
            { status: 500 }
        );
    }
}
