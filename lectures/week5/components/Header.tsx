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
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-amber-500 font-mono text-base font-bold">◎</span>
          <span className="font-medium text-stone-900 tracking-wider text-sm">滞在地図</span>
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-1 text-xs font-medium transition-all ${
                pathname === item.href
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
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
