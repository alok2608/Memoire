import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Bookmark,
  Star,
  Edit,
  Trash2,
  Tag,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API = import.meta.env.VITE_API_URL as string;

interface BookmarkItem {
  _id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Bookmarks() {
  /* ───────── state ───────── */
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BookmarkItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
  });

  /* ───────── fetch all ───────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/bookmarks`);
        setBookmarks(await res.json());
      } catch {
        toast({
          title: "Error",
          description: "Failed to load bookmarks",
          variant: "destructive",
        });
      }
    })();
  }, []);

  /* ───────── helpers ───────── */
  const resetForm = () => {
    setForm({ title: "", url: "", description: "", tags: "" });
    setEditing(null);
  };

  const isValidUrl = (u: string) => {
    try {
      new URL(u);
      return true;
    } catch {
      return false;
    }
  };

  /* ───────── create / update ───────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.url || !isValidUrl(form.url)) {
      toast({ title: "Error", description: "Enter a valid URL", variant: "destructive" });
      return;
    }
    if (!form.title.trim()) {
      toast({ title: "Error", description: "Title required", variant: "destructive" });
      return;
    }

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const endpoint = editing ? `${API}/bookmarks/${editing._id}` : `${API}/bookmarks`;
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          url: form.url,
          description: form.description,
          tags,
        }),
      });
      const saved = await res.json();

      setBookmarks((prev) =>
        editing ? prev.map((b) => (b._id === editing._id ? saved : b)) : [saved, ...prev]
      );

      toast({
        title: editing ? "Bookmark updated" : "Bookmark saved",
        description: saved.title,
      });

      setDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: "Error", description: "Could not save bookmark", variant: "destructive" });
    }
  };

  /* ───────── delete ───────── */
  const deleteBookmark = async (_id: string) => {
    try {
      await fetch(`${API}/bookmarks/${_id}`, { method: "DELETE" });
      setBookmarks((prev) => prev.filter((b) => b._id !== _id));
    } catch {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  /* ───────── toggle favorite ───────── */
  const toggleFavorite = async (_id: string) => {
    const bm = bookmarks.find((b) => b._id === _id);
    if (!bm) return;

    try {
      const res = await fetch(`${API}/bookmarks/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bm, favorite: !bm.favorite }),
      });
      const updated = await res.json();
      setBookmarks((prev) => prev.map((b) => (b._id === _id ? updated : b)));
    } catch {
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    }
  };

  /* ───────── filter helpers ───────── */
  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));
  const filtered = bookmarks.filter((b) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(s) ||
      b.description.toLowerCase().includes(s) ||
      b.url.toLowerCase().includes(s) ||
      b.tags.some((t) => t.toLowerCase().includes(s));
    const matchesTag = !selectedTag || b.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  /* ───────── edit dialog helper ───────── */
  const openEdit = (bm: BookmarkItem) => {
    setEditing(bm);
    setForm({
      title: bm.title,
      url: bm.url,
      description: bm.description,
      tags: bm.tags.join(", "),
    });
    setDialogOpen(true);
  };

  /* ───────── auto‑title bonus (client‑side) ───────── */
  const fetchTitleFromUrl = async (url: string) => {
    if (!form.title && isValidUrl(url)) {
      const domain = new URL(url).hostname.replace("www.", "");
      setForm((prev) => ({ ...prev, title: `${domain} - Bookmark` }));
    }
  };

  /* ───────── UI ───────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" className="text-white hover:text-purple-300">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-white">My Bookmarks</h1>
            </div>

            {/* new / edit dialog */}
            <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" /> New Bookmark
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-600">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editing ? "Edit Bookmark" : "Save New Bookmark"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="url" className="text-white">URL</Label>
                    <Input
                      id="url"
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      onBlur={(e) => fetchTitleFromUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Bookmark title"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags" className="text-white">Tags (comma‑separated)</Label>
                    <Input
                      id="tags"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="web, design…"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      {editing ? "Update Bookmark" : "Save Bookmark"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => { setDialogOpen(false); resetForm(); }}
                      className="text-gray-300 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* search & tag filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search bookmarks…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
              />
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedTag ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTag("")}
                  className={!selectedTag ? "bg-purple-600 hover:bg-purple-700" : "text-gray-300 hover:text-white"}
                >
                  All Tags
                </Button>
                {allTags.slice(0, 5).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                    className={selectedTag === tag ? "bg-purple-600 hover:bg-purple-700" : "text-gray-300 hover:text-white"}
                  >
                    <Tag className="w-3 h-3 mr-1" /> {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* main grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filtered.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((bm) => (
              <Card key={bm._id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white line-clamp-2 flex-1 mr-2">
                      {bm.title}
                    </CardTitle>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(bm._id)}
                        className="p-1 h-auto hover:bg-white/20"
                      >
                        <Star className={cn("w-4 h-4", bm.favorite ? "text-yellow-400 fill-current" : "text-gray-400")} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(bm)} className="p-1 h-auto hover:bg-white/20">
                        <Edit className="w-4 h-4 text-purple-400" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteBookmark(bm._id)} className="p-1 h-auto hover:bg-white/20">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-3">
                    <a
                      href={bm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" /> {bm.url}
                    </a>
                  </div>

                  {bm.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {bm.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {bm.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400">
                    Saved {new Date(bm.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || selectedTag ? "No bookmarks found" : "No bookmarks yet"}
              </h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || selectedTag
                  ? "Try adjusting your search or filter criteria"
                  : "Save your first bookmark to start your collection"}
              </p>
              <Button onClick={() => setDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" /> Save Your First Bookmark
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
