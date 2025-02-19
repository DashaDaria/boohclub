import BookRecommendations from "./components/BookRecommendations";
import GenreForm from "./components/GenreForm";

export default function Home() {
  return (
    <div className="container mx-auto my-8">
      <div className="flex flex-col gap-8">
        <BookRecommendations />
        <GenreForm />
      </div>
    </div>

  )
}
