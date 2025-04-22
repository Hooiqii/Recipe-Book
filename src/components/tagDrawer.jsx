import { FiX } from "react-icons/fi";
import { useEffect } from "react";

export default function TagDrawer({
  isOpen,
  tags,
  selectedTags,
  allRecipes,
  onClose,
  onToggleTag,
  onReset,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-72 max-w-[90%] bg-white z-50 shadow-xl rounded-l-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#f8fafc] rounded-tl-2xl">
          <h2 className="text-lg font-semibold text-gray-800">Filter by Tag</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-all text-xl font-bold"
            aria-label="Close drawer"
          >
            &times;
          </button>
        </div>

        {/* Tag List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-normal text-sm text-gray-800">
          {tags.map((t) => {
            // const count = allRecipes.filter((r) =>
            //   r.tags?.map((tag) => tag.toLowerCase()).includes(t.toLowerCase())
            // ).length;

            return (
              <button
                key={t}
                onClick={() => onToggleTag(t)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedTags.includes(t)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <span className="capitalize">{t}</span>
                {/* Tag Count */}
                {/* <span
                  className={`text-xs ${
                    selectedTags.includes(t)
                      ? "text-white/80"
                      : "text-gray-500"
                  }`}
                >
                  {count}
                </span> */}
              </button>
            );
          })}
        </div>

        {/* Reset Button */}
        {selectedTags.length > 0 && (
          <div className="p-4 border-t bg-[#f9fafb] rounded-bl-2xl">
            <button
              onClick={onReset}
              className="w-full text-sm px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-all font-medium"
            >
              <FiX className="inline mr-1 mb-0.5" />
              Clear All Filters
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
