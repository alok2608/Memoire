const API = import.meta.env.VITE_API_URL;

// NOTE APIs
export const fetchNotes = async () => {
  const res = await fetch(`${API}/notes`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

export const createNote = async (note: {
  title: string;
  content: string;
  tags?: string[];
}) => {
  const res = await fetch(`${API}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
};

// BOOKMARK APIs
export const fetchBookmarks = async () => {
  const res = await fetch(`${API}/bookmarks`);
  if (!res.ok) throw new Error("Failed to fetch bookmarks");
  return res.json();
};

export const createBookmark = async (bookmark: {
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
}) => {
  const res = await fetch(`${API}/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookmark),
  });
  if (!res.ok) throw new Error("Failed to create bookmark");
  return res.json();
};
