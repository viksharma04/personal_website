import Link from 'next/link';
import "../app/globals.css";

// drop-shadow-[0_0_2px_#000000]
export default function Navbar() {
  return (
    <nav className="flex justify-center items-baseline bg-white px-2 py-5">
      <Link href="/" className="transition-transform duration-200 hover:scale-110">
        <span className="font-monospace text-5xl font-bold text-black tracking-widest">
          Vik-Sharma.com
        </span>
      </Link>
    </nav>
  );
}