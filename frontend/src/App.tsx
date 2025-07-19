import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Index";
import Notes from "@/pages/Notes";
import Bookmarks from "@/pages/Bookmarks";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
