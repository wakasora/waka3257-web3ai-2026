'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '滞在地図' },
  { href: '/map', label: 'マップ' },
  { href: '/my-map', label: 'マイマップ' },
  { href: '/area', label: '街スコア' },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-amber-400 font-mono text-sm tracking-widest">◎</span>
          <span className="font-semibold text-stone-100 tracking-wide">滞在地図</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
