import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  BookOpen,
  Star,
  Edit,
  Trash2,
  Tag,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const API = import.meta.env.VITE_API_URL as string; // e.g. http://localhost:5000/api

export default function NotesPage() {
  /* ───────── state ───────── */
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });

  /* ───────── helpers ───────── */
  const resetForm = () => {
    setForm({ title: "", content: "", tags: "" });
    setEditing(null);
  };

  /* ───────── fetch all ───────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/notes`);
        setNotes(await res.json());
      } catch {
        toast({
          title: "Error",
          description: "Failed to load notes from server",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ───────── create / update ───────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title.",
        variant: "destructive",
      });
      return;
    }

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const endpoint = editing ? `${API}/notes/${editing._id}` : `${API}/notes`;
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, content: form.content, tags }),
      });
      const saved = await res.json();

      setNotes((prev) =>
        editing ? prev.map((n) => (n._id === editing._id ? saved : n)) : [saved, ...prev]
      );

      toast({
        title: editing ? "Note updated" : "Note created",
        description: saved.title,
      });

      setDialogOpen(false);
      resetForm();
    } catch {
      toast({
        title: "Error",
        description: "Could not save note",
        variant: "destructive",
      });
    }
  };

  /* ───────── delete ───────── */
  const deleteNote = async (id: string) => {
    try {
      await fetch(`${API}/notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  /* ───────── favorite ───────── */
  const toggleFavorite = async (id: string) => {
    const note = notes.find((n) => n._id === id);
    if (!note) return;

    try {
      const res = await fetch(`${API}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...note, favorite: !note.favorite }),
      });
      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch {
      toast({
        title: "Error",
        description: "Update failed",
        variant: "destructive",
      });
    }
  };

  /* ───────── editing helper ───────── */
  const openEdit = (n: Note) => {
    setEditing(n);
    setForm({
      title: n.title,
      content: n.content,
      tags: n.tags.join(", "),
    });
    setDialogOpen(true);
  };

  /* ───────── filtering ───────── */
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const filtered = notes.filter((n) => {
    const s = search.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(s) ||
      n.content.toLowerCase().includes(s) ||
      n.tags.some((t) => t.toLowerCase().includes(s));
    const matchesTag = !selectedTag || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  /* ───────── UI ───────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" className="text-white hover:text-blue-300">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-white">My Notes</h1>
            </div>

            <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> New Note
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-600">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editing ? "Edit Note" : "Create New Note"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white">Content</Label>
                    <Textarea
                      id="content"
                      rows={6}
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags" className="text-white">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editing ? "Update Note" : "Create Note"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-300 hover:text-white"
                      onClick={() => { setDialogOpen(false); resetForm(); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* search + tag filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
              />
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <TagFilterBtn tag="" current={selectedTag} setTag={setSelectedTag} />
                {allTags.slice(0, 5).map((t) => (
                  <TagFilterBtn key={t} tag={t} current={selectedTag} setTag={setSelectedTag} />
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* main grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
          </div>
        ) : filtered.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((note) => (
              <Card
                key={note._id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white line-clamp-2 flex-1 mr-2">
                      {note.title}
                    </CardTitle>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconBtn onClick={() => toggleFavorite(note._id)}>
                        <Star className={cn("w-4 h-4", note.favorite ? "text-yellow-400 fill-current" : "text-gray-400")} />
                      </IconBtn>
                      <IconBtn onClick={() => openEdit(note)}>
                        <Edit className="w-4 h-4 text-blue-400" />
                      </IconBtn>
                      <IconBtn onClick={() => deleteNote(note._id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </IconBtn>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {note.content && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{note.content}</p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 cursor-pointer"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {search || selectedTag ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-gray-300 mb-6">
                {search || selectedTag
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first note to get started"}
              </p>
              <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Create Your First Note
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

/* ───────── smaller components ───────── */

const TagFilterBtn = ({
  tag,
  current,
  setTag,
}: {
  tag: string;
  current: string;
  setTag: (t: string) => void;
}) => {
  const selected = current === tag || (tag === "" && current === "");
  return (
    <Button
      variant={selected ? "default" : "ghost"}
      size="sm"
      onClick={() => setTag(tag === current ? "" : tag)}
      className={selected ? "bg-blue-600 hover:bg-blue-700" : "text-gray-300 hover:text-white"}
    >
      {tag ? (
        <>
          <Tag className="w-3 h-3 mr-1" /> {tag}
        </>
      ) : (
        "All Tags"
      )}
    </Button>
  );
};

const IconBtn = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Button size="sm" variant="ghost" onClick={onClick} className="p-1 h-auto hover:bg-white/20">
    {children}
  </Button>
);
