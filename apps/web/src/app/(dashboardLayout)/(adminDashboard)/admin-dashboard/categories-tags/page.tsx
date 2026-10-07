"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Tabs,
  Tab,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from "@heroui/react";
import EmptyState from "@/components/ui/EmptyState";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
  Folder,
  Check,
  X,
  Eye,
  Hash,
  Link,
} from "lucide-react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import { getPosts } from "@/services/PostService";
import { formatDistanceToNow } from "date-fns";
import { TPost } from "@/types/TPost";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
  isSystem: boolean;
  createdAt: string;
}

interface Tag {
  id: string;
  name: string;
  postCount: number;
  isTrending: boolean;
}

const CATEGORIES_KEY = "tech-tips-categories";
const TAGS_KEY = "tech-tips-tags";

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Web Development",
    slug: "web-development",
    description: "Frontend, backend, and full-stack development",
    postCount: 0,
    color: "#3b82f6",
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mobile Development",
    slug: "mobile-development",
    description: "iOS, Android, and cross-platform mobile apps",
    postCount: 0,
    color: "#8b5cf6",
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "DevOps & Cloud",
    slug: "devops-cloud",
    description: "CI/CD, infrastructure, and cloud platforms",
    postCount: 0,
    color: "#06b6d4",
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Data & AI",
    slug: "data-ai",
    description: "Data science, machine learning, and analytics",
    postCount: 0,
    color: "#f59e0b",
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Security",
    slug: "security",
    description: "Application security, cryptography, and best practices",
    postCount: 0,
    color: "#ef4444",
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Career & Productivity",
    slug: "career-productivity",
    description: "Career growth, productivity tips, and soft skills",
    postCount: 0,
    color: "#22c55e",
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
];

const readCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  } catch {
    return defaultCategories;
  }
};

const writeCategories = (cats: Category[]) => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  } catch {}
};

const readTags = (): Tag[] => {
  try {
    const raw = localStorage.getItem(TAGS_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  } catch {
    return [];
  }
};

const writeTags = (tags: Tag[]) => {
  try {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  } catch {}
};

const buildCategoriesFromPosts = (posts: TPost[], existing: Category[]): Category[] => {
  const counts = new Map<string, number>();
  posts.forEach((p) => {
    if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  });
  const map = new Map(existing.map((c) => [c.slug, c]));
  counts.forEach((count, name) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (!map.has(slug)) {
      map.set(slug, {
        id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        slug,
        description: "",
        postCount: count,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        isSystem: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      map.get(slug)!.postCount = count;
    }
  });
  return Array.from(map.values()).sort((a, b) => b.postCount - a.postCount);
};

const buildTagsFromPosts = (posts: TPost[], existing: Tag[]): Tag[] => {
  const counts = new Map<string, number>();
  posts.forEach((p) => {
    (p.tags ?? []).forEach((t: string) => {
      const norm = t.startsWith("#") ? t.slice(1) : t;
      counts.set(norm.toLowerCase(), (counts.get(norm.toLowerCase()) ?? 0) + 1);
    });
  });
  const map = new Map(existing.map((t) => [t.name.toLowerCase(), t]));
  counts.forEach((count, name) => {
    if (!map.has(name.toLowerCase())) {
      map.set(name.toLowerCase(), {
        id: `tag-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        postCount: count,
        isTrending: count >= 5,
      });
    } else {
      map.get(name.toLowerCase())!.postCount = count;
      map.get(name.toLowerCase())!.isTrending = count >= 5;
    }
  });
  return Array.from(map.values()).sort((a, b) => b.postCount - a.postCount);
};

export default function CategoriesTagsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [catPage, setCatPage] = useState(1);
  const [tagPage, setTagPage] = useState(1);
  const [activeTab, setActiveTab] = useState("categories");
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newCatForm, setNewCatForm] = useState({ name: "", description: "", color: "#3b82f6" });
  const [newTagForm, setNewTagForm] = useState({ name: "" });
  const itemsPerPage = 15;

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const postsRes = await getPosts(1, 200);
        const posts = postsRes?.data?.data || [];
        if (!cancelled) {
          setCategories(buildCategoriesFromPosts(posts, readCategories()));
          setTags(buildTagsFromPosts(posts, readTags()));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCats = categories.filter(
    (c) =>
      !catSearch.trim() ||
      c.name.toLowerCase().includes(catSearch.trim().toLowerCase()) ||
      c.description.toLowerCase().includes(catSearch.trim().toLowerCase()),
  );
  const filteredTags = tags.filter(
    (t) => !tagSearch.trim() || t.name.toLowerCase().includes(tagSearch.trim().toLowerCase()),
  );

  const catTotalPages = Math.ceil(filteredCats.length / itemsPerPage);
  const tagTotalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const paginatedCats = filteredCats.slice((catPage - 1) * itemsPerPage, catPage * itemsPerPage);
  const paginatedTags = filteredTags.slice((tagPage - 1) * itemsPerPage, tagPage * itemsPerPage);

  const handleSaveCategory = () => {
    if (!newCatForm.name.trim()) return;
    const slug = newCatForm.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatForm.name.trim(),
      slug,
      description: newCatForm.description.trim(),
      postCount: 0,
      color: newCatForm.color,
      isSystem: false,
      createdAt: new Date().toISOString(),
    };
    setCategories((prev) => {
      writeCategories([cat, ...prev]);
      return [cat, ...prev];
    });
    setNewCatForm({ name: "", description: "", color: "#3b82f6" });
    setEditingCat(null);
  };

  const handleUpdateCategory = () => {
    if (!editingCat || !newCatForm.name.trim()) return;
    setCategories((prev) => {
      const updated = prev.map((c) =>
        c.id === editingCat.id
          ? {
              ...c,
              name: newCatForm.name.trim(),
              description: newCatForm.description.trim(),
              color: newCatForm.color,
            }
          : c,
      );
      writeCategories(updated);
      return updated;
    });
    setEditingCat(null);
    setNewCatForm({ name: "", description: "", color: "#3b82f6" });
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm("Delete this category? Posts using it will become uncategorized.")) return;
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      writeCategories(next);
      return next;
    });
  };

  const handleSaveTag = () => {
    if (!newTagForm.name.trim()) return;
    const name = newTagForm.name.trim().replace(/^#/, "");
    const tag: Tag = { id: `tag-${Date.now()}`, name, postCount: 0, isTrending: false };
    setTags((prev) => {
      writeTags([tag, ...prev]);
      return [tag, ...prev];
    });
    setNewTagForm({ name: "" });
    setEditingTag(null);
  };

  const handleUpdateTag = () => {
    if (!editingTag || !newTagForm.name.trim()) return;
    const name = newTagForm.name.trim().replace(/^#/, "");
    setTags((prev) => {
      const updated = prev.map((t) => (t.id === editingTag.id ? { ...t, name } : t));
      writeTags(updated);
      return updated;
    });
    setEditingTag(null);
    setNewTagForm({ name: "" });
  };

  const handleDeleteTag = (id: string) => {
    if (!confirm("Delete this tag? It will be removed from all posts.")) return;
    setTags((prev) => {
      const next = prev.filter((t) => t.id !== id);
      writeTags(next);
      return next;
    });
  };

  const openEditCat = (c: Category) => {
    setEditingCat(c);
    setNewCatForm({ name: c.name, description: c.description, color: c.color });
  };
  const openEditTag = (t: Tag) => {
    setEditingTag(t);
    setNewTagForm({ name: t.name });
  };

  if (loading) {
    return (
      <div className="p-6" role="status" aria-label="Loading...">
        <PageTitle title="Categories & Tags" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6">
        <PageTitle title="Categories & Tags" />
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="custom"
            title="Couldn't load data"
            actionLabel="Retry"
            onAction={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageTitle title="Categories & Tags" />
      <p className="text-sm text-default-500 mb-6 -mt-2">
        Manage post categories and tags. Categories are broad topics; tags are specific keywords.
      </p>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(k) => setActiveTab(k as string)}
        color="primary"
        variant="underlined"
        className="mb-6"
      >
        <Tab
          key="categories"
          title={
            <span className="flex items-center gap-1.5">
              <Folder size={15} /> Categories
            </span>
          }
        />
        <Tab
          key="tags"
          title={
            <span className="flex items-center gap-1.5">
              <Hash size={15} /> Tags
            </span>
          }
        />
      </Tabs>

      {activeTab === "categories" && (
        <>
          <Card className="mb-6">
            <CardBody className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search categories..."
                  value={catSearch}
                  onChange={(e) => {
                    setCatSearch(e.target.value);
                    setCatPage(1);
                  }}
                  startContent={<Search size={18} className="text-default-600" />}
                  className="flex-1"
                />
                <Button
                  color="primary"
                  startContent={<Plus size={14} />}
                  onPress={() => {
                    setEditingCat(null);
                    setNewCatForm({ name: "", description: "", color: "#3b82f6" });
                  }}
                >
                  Add Category
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-0">
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>DESCRIPTION</TableColumn>
                  <TableColumn>POSTS</TableColumn>
                  <TableColumn>TYPE</TableColumn>
                  <TableColumn>CREATED</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No categories yet">
                  {paginatedCats.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-default-600 line-clamp-1 max-w-[200px]">
                          {c.description || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color="primary">
                          {c.postCount} posts
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color={c.isSystem ? "secondary" : "default"}>
                          {c.isSystem ? "System" : "Custom"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-default-500">
                          {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button isIconOnly variant="ghost" size="sm">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="edit"
                              onClick={() => openEditCat(c)}
                              startContent={<Edit size={14} />}
                            >
                              Edit
                            </DropdownItem>
                            {!c.isSystem ? (
                              <DropdownItem
                                key="delete"
                                color="danger"
                                onClick={() => handleDeleteCategory(c.id)}
                                startContent={<Trash2 size={14} />}
                              >
                                Delete
                              </DropdownItem>
                            ) : null}
                            <DropdownItem
                              key="view"
                              as={Link}
                              href={`/posts?category=${c.slug}`}
                              startContent={<Eye size={14} />}
                            >
                              View Posts
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {catTotalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={catPage}
                total={catTotalPages}
                onChange={setCatPage}
              />
            </div>
          )}

          {/* Add/Edit Category Modal */}
          {(editingCat || newCatForm.name || newCatForm.description) && (
            <Modal
              isOpen={true}
              onOpenChange={() => {
                setEditingCat(null);
                setNewCatForm({ name: "", description: "", color: "#3b82f6" });
              }}
              placement="center"
              backdrop="blur"
            >
              <ModalContent>
                <ModalHeader>{editingCat ? "Edit Category" : "New Category"}</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        value={newCatForm.name}
                        onChange={(e) => setNewCatForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Web Development"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Input
                        value={newCatForm.description}
                        onChange={(e) =>
                          setNewCatForm((p) => ({ ...p, description: e.target.value }))
                        }
                        placeholder="Optional description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Color</label>
                      <Input
                        type="color"
                        value={newCatForm.color}
                        onChange={(e) => setNewCatForm((p) => ({ ...p, color: e.target.value }))}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    color="default"
                    onPress={() => {
                      setEditingCat(null);
                      setNewCatForm({ name: "", description: "", color: "#3b82f6" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={editingCat ? handleUpdateCategory : handleSaveCategory}
                    isLoading={false}
                  >
                    {editingCat ? "Save Changes" : "Create Category"}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </>
      )}

      {activeTab === "tags" && (
        <>
          <Card className="mb-6">
            <CardBody className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search tags..."
                  value={tagSearch}
                  onChange={(e) => {
                    setTagSearch(e.target.value);
                    setTagPage(1);
                  }}
                  startContent={<Search size={18} className="text-default-600" />}
                  className="flex-1"
                />
                <Button
                  color="primary"
                  startContent={<Plus size={14} />}
                  onPress={() => {
                    setEditingTag(null);
                    setNewTagForm({ name: "" });
                  }}
                >
                  Add Tag
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-0">
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn>TAG</TableColumn>
                  <TableColumn>POSTS</TableColumn>
                  <TableColumn>TRENDING</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No tags yet">
                  {paginatedTags.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Chip size="sm" variant="flat" color="primary">
                          #{t.name}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color="default">
                          {t.postCount} posts
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {t.isTrending ? (
                          <Chip
                            size="sm"
                            variant="flat"
                            color="warning"
                            startContent={<span className="text-warning">🔥</span>}
                          >
                            Trending
                          </Chip>
                        ) : (
                          <Chip size="sm" variant="flat" color="default">
                            Normal
                          </Chip>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button isIconOnly variant="ghost" size="sm">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="edit"
                              onClick={() => openEditTag(t)}
                              startContent={<Edit size={14} />}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              color="danger"
                              onClick={() => handleDeleteTag(t.id)}
                              startContent={<Trash2 size={14} />}
                            >
                              Delete
                            </DropdownItem>
                            <DropdownItem
                              key="view"
                              as={Link}
                              href={`/posts?query=${encodeURIComponent(t.name)}`}
                              startContent={<Eye size={14} />}
                            >
                              View Posts
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {tagTotalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={tagPage}
                total={tagTotalPages}
                onChange={setTagPage}
              />
            </div>
          )}

          {(editingTag || newTagForm.name) && (
            <Modal
              isOpen={true}
              onOpenChange={() => {
                setEditingTag(null);
                setNewTagForm({ name: "" });
              }}
              placement="center"
              backdrop="blur"
            >
              <ModalContent>
                <ModalHeader>{editingTag ? "Edit Tag" : "New Tag"}</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tag Name (without #)</label>
                      <Input
                        value={newTagForm.name}
                        onChange={(e) =>
                          setNewTagForm((p) => ({ ...p, name: e.target.value.replace(/^#/, "") }))
                        }
                        placeholder="e.g. react, typescript"
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    color="default"
                    onPress={() => {
                      setEditingTag(null);
                      setNewTagForm({ name: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" onPress={editingTag ? handleUpdateTag : handleSaveTag}>
                    {editingTag ? "Save Changes" : "Create Tag"}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
