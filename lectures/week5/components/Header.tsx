'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/map', label: 'マップ' },
  { href: '/my-map', label: 'マイマップ' },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md h-[48px] flex items-center">
      <div className="mx-auto w-full flex items-center justify-between px-4">
        {/* 左ロゴ: クリックでトップページへ */}
        <Link href="/" className="flex items-center gap-1.5 hover:opacity-85 transition-opacity">
          <span className="text-amber-500 font-mono text-base font-bold">◎</span>
          <span className="font-semibold text-stone-900 tracking-wider text-xs">滞在地図</span>
        </Link>
        
        {/* 右ナビ: マップとマイマップのみ */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                pathname === item.href
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
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
