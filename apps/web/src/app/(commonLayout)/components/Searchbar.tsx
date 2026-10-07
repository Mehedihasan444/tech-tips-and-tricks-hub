"use client";
import useDebounce from "@/hooks/debounce.hook";
import { useSearchPosts } from "@/hooks/search.hook";
import { TPost } from "@/types/TPost";
import { Button, Chip, Spinner } from "@heroui/react";
import { Search, X, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Searchbar = () => {
  const { mutate: handleSearch, data, isSuccess, isPending } = useSearchPosts();
  const [search, setSearch] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const searchTerm = useDebounce(search);

  // Derived, not mirrored into state: a local `searchResults` copy had to be
  // re-synced from the mutation result by an effect and could drift.
  const searchResults: TPost[] = isSuccess && searchTerm ? (data?.data ?? []) : [];
  const isVisible = isOpen && search.trim().length > 0;

  const handleSeeAll = (query: string) => {
    const params = new URLSearchParams({ query: query.trim() });
    setIsOpen(false);
    setSearch("");
    router.push(`/posts?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");
    setActiveIndex(-1);
    setIsOpen(false);
  };

  useEffect(() => {
    const query = searchTerm.trim();
    if (query) {
      handleSearch(query);
    }
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchResults.length]);

  // Keep the active option scrolled into view for keyboard navigation.
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    listRef.current.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      clearSearch();
      e.currentTarget.blur();
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (searchResults.length === 0) return;
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => {
        const delta = e.key === "ArrowDown" ? 1 : -1;
        return (prev + delta + searchResults.length + 1) % (searchResults.length + 1);
      });
      return;
    }

    if (e.key === "Enter" && activeIndex >= 0 && searchResults[activeIndex]) {
      e.preventDefault();
      const { _id } = searchResults[activeIndex];
      setIsOpen(false);
      router.push(`/posts/${_id}`);
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none transition-colors duration-200 peer-focus:text-primary-fg"
          size={19}
        />
        <input
          id="navbar-search"
          type="search"
          role="combobox"
          value={search}
          aria-label="Search tech tips, tutorials, and guides"
          aria-autocomplete="list"
          aria-expanded={isVisible && searchResults.length > 0}
          aria-controls="navbar-search-results"
          aria-activedescendant={
            isVisible && activeIndex >= 0 ? `navbar-search-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          // pointerdown (not mousedown) so the dropdown survives taps on touch
          // devices, where mousedown is not dispatched reliably.
          onBlur={(e) => {
            if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
              setIsOpen(false);
            }
          }}
          onKeyDown={onKeyDown}
          placeholder="Search tech tips, tutorials, guides..."
          className="peer w-full pl-12 pr-12 py-3 bg-default-100/80 border border-transparent rounded-full focus:outline-none focus:bg-background focus:border-primary/40 focus:shadow-glow-primary transition-all duration-200 text-sm placeholder:text-default-500 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0"
        />
        {search && !isPending && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-default-500 hover:text-default-700 transition-colors rounded-md p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
      {isVisible && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass-strong shadow-pop animate-fade-up overflow-hidden">
          {searchResults.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="px-4 py-3 border-b border-divider/70">
                <p
                  aria-live="polite"
                  className="text-xs font-semibold text-default-600 uppercase tracking-wider"
                >
                  Search Results ({searchResults.length})
                </p>
              </div>

              {/* Results List */}
              <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
                <ul
                  ref={listRef}
                  className="p-2 space-y-1 list-none"
                  role="listbox"
                  id="navbar-search-listbox"
                >
                  {searchResults.map((post: TPost, index: number) => (
                    <li
                      key={post._id}
                      role="option"
                      id={`navbar-search-option-${index}`}
                      aria-selected={index === activeIndex}
                    >
                      <Link
                        href={`/posts/${post._id}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group border ${
                          index === activeIndex
                            ? "bg-default-200/60 border-default-300"
                            : "border-transparent"
                        }`}
                        onClick={() => {
                          setSearch("");
                          setIsOpen(false);
                        }}
                      >
                        {/* Post Image */}
                        <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                          {post.images?.[0] ? (
                            <Image
                              alt=""
                              className="h-20 w-20 object-cover group-hover:scale-105 transition-transform duration-300 motion-reduce:group-hover:scale-100"
                              height={80}
                              width={80}
                              sizes="80px"
                              src={post.images[0]}
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="flex h-20 w-20 items-center justify-center bg-gradient-to-br from-primary-500/10 to-secondary-500/10 text-lg font-bold text-default-500"
                            >
                              {post.title?.charAt(0) ?? "?"}
                            </span>
                          )}
                        </div>

                        {/* Post Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary-fg transition-colors duration-200">
                            {post.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Chip size="sm" variant="flat" color="secondary" className="text-xs">
                              {post.category}
                            </Chip>
                          </div>
                          {post?.tags && post.tags.length > 0 && (
                            <div className="mt-2 flex gap-1 flex-wrap">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-xs text-primary-fg font-medium">
                                  #{tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-xs text-default-500">
                                  +{post.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* See All Footer */}
              <div className="px-4 py-3 border-t border-divider/70">
                <Button
                  variant="flat"
                  color="primary"
                  radius="full"
                  className="w-full font-semibold"
                  endContent={<TrendingUp size={16} />}
                  onPress={() => handleSeeAll(searchTerm)}
                >
                  See All Results
                </Button>
              </div>
            </>
          ) : (
            !isPending && (
              <div className="px-4 py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-default-200/70 mb-3">
                  <Search className="text-default-500" size={24} aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-default-700">No results found</p>
                <p className="text-xs text-default-500 mt-1">Try adjusting your search terms</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
