import Footer from "./Footer";
import Navbar from "./Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip">
      <Navbar />
      <main className="min-w-0 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
