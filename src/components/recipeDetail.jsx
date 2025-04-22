import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { FaStar, FaFireAlt, FaTools } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true);
      try {
        const res = await fetch(`https://dummyjson.com/recipes/${id}`);
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!recipe) return <div className="p-6 text-center">Recipe not found.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-6">
            <div className="flex items-center gap-1 text-yellow-500">
              <FaStar />
              <span>{recipe.rating.toFixed(1)} ({recipe.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500">
              <FaTools />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <FaFireAlt />
              <span>{recipe.caloriesPerServing} kcal/serving</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🍽️ {recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏱️ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins total</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🌍 {recipe.cuisine}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">🧂 Ingredients</h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1 pl-2">
              {recipe.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">📝 Instructions</h2>
            <ol className="list-decimal list-inside text-gray-800 space-y-2 pl-2">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {recipe.tags.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">🏷️ Tags</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Back to Home Button */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
