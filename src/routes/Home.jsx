import { useLoaderData, useNavigate, useSearchParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { FaStar, FaTools, FaFireAlt } from "react-icons/fa";
import { FiSearch, FiX } from "react-icons/fi";
import Pagination from "../components/Pagination";
import TagDrawer from "../components/tagDrawer";
import Sort from "../components/sort";

export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const selectedTags = url.searchParams.getAll("tag");

  const res = await fetch("https://dummyjson.com/recipes?limit=100&skip=0");
  const data = await res.json();
  const allRecipes = data.recipes || [];

  const tagsRes = await fetch("https://dummyjson.com/recipes/tags");
  const tags = await tagsRes.json();

  return {
    allRecipes,
    query,
    selectedTags,
    tags,
  };
}

export default function Home() {
  const { allRecipes, query, selectedTags, tags } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [searchTerm, setSearchTerm] = useState(query || "");
  const [limit, setLimit] = useState(12);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const updateLimitAndPage = () => {
      const width = window.innerWidth;
      const newLimit = width >= 1024 ? 12 : width >= 640 ? 8 : 6;

      setLimit((prevLimit) => {
        if (prevLimit !== newLimit) {
          const newTotalPages = Math.ceil(totalCount / newLimit);
          if (currentPage > newTotalPages) {
            navigate(`?page=1`);
          }
        }
        return newLimit;
      });
    };

    updateLimitAndPage();
    window.addEventListener("resize", updateLimitAndPage);
    return () => window.removeEventListener("resize", updateLimitAndPage);
  }, [currentPage, navigate]);

  const normalizedTags = selectedTags.map((t) => t.toLowerCase());

  let filtered = allRecipes.filter((recipe) =>
    normalizedTags.length > 0
      ? recipe.tags?.some((tag) => normalizedTags.includes(tag.toLowerCase()))
      : true
  );

  if (query) {
    filtered = filtered.filter((recipe) =>
      recipe.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (sortOption) {
    filtered.sort((a, b) => {
      let valA = a[sortOption];
      let valB = b[sortOption];

      if (sortOption === "difficulty") {
        const levels = { Easy: 1, Medium: 2, Hard: 3 };
        valA = levels[valA] || 0;
        valB = levels[valB] || 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedRecipes = filtered.slice(startIndex, startIndex + limit);

  const handlePageChange = (pageNumber) => {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set("q", searchTerm);
      params.set("page", 1);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const handleTagToggle = (tag) => {
    const params = new URLSearchParams(searchParams);
    const currentTags = params.getAll("tag");

    if (currentTags.includes(tag)) {
      params.delete("tag");
      currentTags
        .filter((t) => t !== tag)
        .forEach((t) => params.append("tag", t));
    } else {
      params.append("tag", tag);
    }

    params.set("page", 1);
    setSearchParams(params);
    setIsDrawerOpen(false);
  };

  const resetTags = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("tag");
    params.set("page", 1);
    setSearchParams(params);
  };

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👩🏻‍🍳 Recipe Book</h1>

      {/* Search + Filter + Sort */}
      <form onSubmit={handleSearch} className="mb-6 w-full">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  const params = new URLSearchParams(searchParams);
                  params.delete("q");
                  params.set("page", 1);
                  setSearchParams(params);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                aria-label="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Filter by Tag
          </button>

          {/* Sort */}
          <Sort
            sortOption={sortOption}
            sortOrder={sortOrder}
            onSortChange={(option) => {
              setSortOption(option);
              searchParams.set("page", 1);
              setSearchParams(searchParams);
            }}
            onSortOrderToggle={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          />
        </div>
      </form>

      {/* Tags display */}
      {selectedTags.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 bg-[#ebf2fc] p-2 rounded-md">
          <span className="text-sm text-gray-600">
            Showing recipes tagged with:
          </span>
          {selectedTags.map((t) => (
            <button
              key={t}
              onClick={() => handleTagToggle(t)}
              className="px-3 py-1 text-xs bg-white text-gray-600 rounded-full border border-gray-300 flex items-center justify-center font-medium hover:bg-red-100 hover:text-red-600 transition-all"
              title={`Remove "${t}" tag`}
            >
              {t} <FiX className="ml-1" />
            </button>
          ))}
          {selectedTags.length > 1 && (
            <button
              onClick={resetTags}
              className="ml-2 text-xs text-red-600 hover:text-red-700 flex items-center space-x-1 font-medium transition-all duration-200"
            >
              <FiX className="inline" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      )}

      {/* No Results */}
      {paginatedRecipes.length === 0 ? (
        <p className="text-center text-gray-600 py-8">
          No recipes found. Try again later.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRecipes.map((recipe) => (
              <Link
                to={`/recipes/${recipe.id}`}
                key={recipe.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition block"
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-50 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
                  <div className="flex items-center gap-x-4 text-sm text-gray-700 mb-3">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar />
                      <span className="text-gray-800">
                        {recipe.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <FaTools />
                      <span className="text-gray-800">{recipe.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                      <FaFireAlt />
                      <span className="text-gray-800">
                        {recipe.caloriesPerServing} kcal
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {recipe.instructions}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <TagDrawer
        isOpen={isDrawerOpen}
        tags={tags}
        selectedTags={selectedTags}
        allRecipes={allRecipes}
        onClose={() => setIsDrawerOpen(false)}
        onToggleTag={handleTagToggle}
        onReset={resetTags}
      />
    </main>
  );
}
