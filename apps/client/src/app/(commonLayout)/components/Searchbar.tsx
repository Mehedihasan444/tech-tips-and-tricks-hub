"use client";
import useDebounce from "@/hooks/debounce.hook";
import { useSearchPosts } from "@/hooks/search.hook";
import { TPost } from "@/types/TPost";
import { Button, Chip, Spinner } from "@nextui-org/react";
import { Search, X, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Searchbar = () => {
  const { mutate: handleSearch, data, isSuccess, isPending } = useSearchPosts();
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TPost[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchTerm = useDebounce(search);

  const handleSeeAll = (query: string) => {
    const queryString = query.trim().split(" ").join("+");
    router.push(`/posts?query=${queryString}`);
    setSearch("");
    setSearchResults([]);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    if (isSuccess && data && searchTerm) {
      setSearchResults(data?.data || []);
    }
  }, [isSuccess, data, searchTerm]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-default-400 pointer-events-none" 
          size={20} 
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search tech tips, tutorials, guides..."
          className="w-full pl-12 pr-12 py-3 bg-default-100 border-2 border-transparent rounded-xl 
                     focus:outline-none focus:border-primary focus:bg-background
                     transition-all duration-200 text-sm placeholder:text-default-400"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-default-400 
                       hover:text-default-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        {isPending && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Spinner size="sm" color="primary" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {(searchResults.length > 0 || (isFocused && search)) && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-background border-2 border-divider shadow-2xl z-50 overflow-hidden">
          {searchResults.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="px-4 py-3 bg-default-50 border-b border-divider">
                <p className="text-xs font-semibold text-default-600 uppercase tracking-wide">
                  Search Results ({searchResults.length})
                </p>
              </div>

              {/* Results List */}
              <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
                <div className="p-2 space-y-1">
                  {searchResults?.map((post: TPost) => (
                    <Link
                      key={post._id}
                      href={`/posts/${post._id}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-default-100 
                                 transition-all duration-200 group border border-transparent 
                                 hover:border-default-200"
                      onClick={() => {
                        setSearch("");
                        setSearchResults([]);
                      }}
                    >
                      {/* Post Image */}
                      <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          alt={post.title}
                          className="h-20 w-20 object-cover group-hover:scale-105 transition-transform duration-200"
                          height={80}
                          width={80}
                          src={post.images[0]}
                        />
                      </div>

                      {/* Post Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1 
                                       group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <Chip 
                            size="sm" 
                            variant="flat" 
                            color="secondary"
                            className="text-xs"
                          >
                            {post.category}
                          </Chip>
                        </div>
                        {post?.tags && post.tags.length > 0 && (
                          <div className="mt-2 flex gap-1 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span 
                                key={tag} 
                                className="text-xs text-primary font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-default-400">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* See All Footer */}
              <div className="px-4 py-3 bg-default-50 border-t border-divider">
                <Button
                  variant="flat"
                  color="primary"
                  className="w-full font-semibold"
                  endContent={<TrendingUp size={16} />}
                  onClick={() => handleSeeAll(searchTerm)}
                >
                  See All Results
                </Button>
              </div>
            </>
          ) : (
            search && !isPending && (
              <div className="px-4 py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-default-100 mb-3">
                  <Search className="text-default-400" size={24} />
                </div>
                <p className="text-sm font-medium text-default-700">No results found</p>
                <p className="text-xs text-default-400 mt-1">
                  Try adjusting your search terms
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--nextui-default-300));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--nextui-default-400));
        }
      `}</style>
    </div>
  );
};

export default Searchbar;