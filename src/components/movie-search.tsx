"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";

type MovieDetails = {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  Released: string;
};

export default function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMovieDetails(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      setMovieDetails(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: 'url("https://i.pinimg.com/736x/3b/61/77/3b617705598ac712d665f8e1e70f1849.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-lg p-6 bg-transparent rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-1 text-center">Movie Search</h1>
        <p className="mb-6 text-center">Search for any movies and display details.</p>
        <div className="flex items-center mb-6">
          <Input
            type="text"
            placeholder="Enter a movie title"
            value={searchTerm}
            onChange={handleChange}
            className="flex-1 mr-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-950"
          >
            Search
          </Button>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <ClipLoader className="w-6 h-6 text-blue-500" />
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}. Please try searching for another movie.
          </div>
        )}
        {movieDetails && (
          <div className="flex flex-col items-center">
            <div className="w-full mb-4">
              <Image
                src={movieDetails.Poster !== "N/A" ? movieDetails.Poster : "/placeholder.svg"}
                alt={movieDetails.Title}
                width={200}
                height={300}
                className="rounded-md shadow-md mx-auto"
              />
            </div>
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold mb-2">{movieDetails.Title}</h2>
              <p className="text-gray-600 mb-4 italic">{movieDetails.Plot}</p>
              <div className="flex justify-center items-center text-gray-800 mb-2">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span className="mr-4">{movieDetails.Year}</span>
                <StarIcon className="w-4 h-4 mr-1 fill-yellow-500" />
                <span>{movieDetails.imdbRating}</span>
              </div>
              <div className="flex justify-center items-center text-gray-800 mb-2">
                <span className="mr-4">
                  <strong>Genre:</strong> {movieDetails.Genre}
                </span>
              </div>
              <div className="flex justify-center items-center text-gray-800 mb-2">
                <span className="mr-4">
                  <strong>Director:</strong> {movieDetails.Director}
                </span>
              </div>
              <div className="flex justify-center items-center text-gray-800 mb-2">
                <span className="mr-4">
                  <strong>Actors:</strong> {movieDetails.Actors}
                </span>
              </div>
              <div className="flex justify-center items-center text-gray-800 mb-2">
                <span className="mr-4">
                  <strong>Runtime:</strong> {movieDetails.Runtime}
                </span>
              </div>
              <div className="flex justify-center items-center text-gray-800 mb-2">
                <span className="mr-4">
                  <strong>Released:</strong> {movieDetails.Released}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
