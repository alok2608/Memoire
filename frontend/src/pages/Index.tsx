import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Bookmark,
  Star,
  Tag as TagIcon,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = import.meta.env.VITE_API_URL as string;

interface Stats {
  totalNotes: number;
  totalBookmarks: number;
  favorites: number;
  totalTags: number;
}

interface ItemPreview {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [latestNotes, setLatestNotes] = useState<ItemPreview[]>([]);
  const [latestBookmarks, setLatestBookmarks] = useState<ItemPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // stats
        const s = await fetch(`${API}/stats`).then((r) => r.json());
        // latest notes & bookmarks
        const [n, b] = await Promise.all([
          fetch(`${API}/notes?limit=5&sort=-updatedAt`).then((r) => r.json()),
          fetch(`${API}/bookmarks?limit=5&sort=-updatedAt`).then((r) => r.json()),
        ]);

        setStats(s);
        setLatestNotes(n);
        setLatestBookmarks(b);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  if (!stats) return null; // error handled elsewhere

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
    <h1 className="text-4xl font-bold text-white mb-8 max-w-6xl mx-auto">
  Memoire
</h1>



      {/* stats */}
      <div className="grid gap-6 md:grid-cols-4 max-w-6xl mx-auto">
        <StatCard title="Total Notes" value={stats.totalNotes} icon={<BookOpen />} color="blue" />
        <StatCard title="Total Bookmarks" value={stats.totalBookmarks} icon={<Bookmark />} color="purple" />
        <StatCard title="Favorites" value={stats.favorites} icon={<Star />} color="yellow" />
        <StatCard title="Total Tags" value={stats.totalTags} icon={<TagIcon />} color="green" />
      </div>

      {/* recent panels */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-12">
        <RecentPanel
          title="Recent Notes"
          items={latestNotes}
          emptyText="No notes yet."
          link="/notes"
          color="blue"
        />
        <RecentPanel
          title="Recent Bookmarks"
          items={latestBookmarks}
          emptyText="No bookmarks yet."
          link="/bookmarks"
          color="purple"
        />
      </div>
    </div>
  );
}

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "purple" | "yellow" | "green";
}) => (
  <Card className="bg-white/10 backdrop-blur-md border-white/20">
    <CardHeader className="flex justify-between items-center">
      <CardTitle className="text-white">{title}</CardTitle>
      <div className={`text-2xl text-${color}-400`}>{icon}</div>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold text-white">{value}</p>
    </CardContent>
  </Card>
);

const RecentPanel = ({
  title,
  items,
  emptyText,
  link,
  color,
}: {
  title: string;
  items: ItemPreview[];
  emptyText: string;
  link: string;
  color: "blue" | "purple";
}) => (
  <Card className="bg-white/10 backdrop-blur-md border-white/20">
    <CardHeader className="flex justify-between">
      <CardTitle className="text-white">{title}</CardTitle>
      <Button asChild variant="link" className={`p-0 text-${color}-400`}>
        <Link to={link}>View All →</Link>
      </Button>
    </CardHeader>
    <CardContent>
      {items.length ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item._id} className="flex justify-between text-white/90">
              <span className="truncate">{item.title || "(untitled)"}</span>
              <span className="text-xs text-white/50">
                {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/70">{emptyText}</p>
      )}
    </CardContent>
  </Card>
);
