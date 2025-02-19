'use client'

import { useEffect, useState } from "react";
import { SelectCriteria } from "src/db/schema";
import { getCriteria, submitCriteria } from "../actions/data";


export default function GenreForm() {
    const [genres, setGenres] = useState<SelectCriteria[]>([]);
    const [formData, setFormData] = useState({
        category: '',
        nuance: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        async function loadGenres() {
            try {
                const fetchedGenres = await getCriteria();
                setGenres(fetchedGenres);
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                setLoading(false);
            }
        }
        loadGenres();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitStatus('loading');
        try {
            const newCriteria = await submitCriteria({
                category: formData.category.toLocaleLowerCase(),
                nuance: formData.nuance.toLocaleLowerCase() || null
            });
            setSubmitStatus('success');
            setGenres(prev => [...prev, newCriteria]);
            setFormData({ category: '', nuance: '' });
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Category*
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter category"
                    />
                    {errors.category && (
                        <p className="text-sm text-red-600">{errors.category}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Nuance
                    </label>
                    <input
                        type="text"
                        name="nuance"
                        value={formData.nuance}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter nuance"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className={`w-full py-2 px-4 ${submitStatus === 'loading'
                        ? 'bg-gray-400'
                        : submitStatus === 'success'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white font-medium rounded-md shadow-sm transition-colors duration-200`}
                >
                    {submitStatus === 'loading'
                        ? 'Submitting...'
                        : submitStatus === 'success'
                            ? 'Submitted!'
                            : 'Submit'}
                </button>

                {submitStatus === 'error' && (
                    <p className="text-sm text-red-600 text-center">
                        Error submitting form. Please try again.
                    </p>
                )}
            </form>

            <div className="flex justify-start gap-8 items-start mt-6">
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Genres:</h3>
                    <ul className="space-y-1">
                        {genres.map(genre => (
                            <li key={genre.category} className="text-sm text-gray-600">
                                {genre.category}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Nuances:</h3>
                    <ul className="space-y-1">
                        {genres.map(genre => {
                            if (!genre.nuance) return null;
                            return (
                                <li key={genre.nuance} className="text-sm text-gray-600">
                                    {genre.nuance}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}