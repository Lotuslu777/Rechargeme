'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: '首页', path: '/' },
    { name: '探索', path: '/explore' },
    { name: '我的', path: '/profile' },
  ];

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            RechargeMe
          </Link>
          <nav className="ml-6 hidden md:block">
            <ul className="flex space-x-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      pathname === item.path
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          {session ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-muted-foreground md:inline-block">
                {session.user?.name || session.user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                退出
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => signIn()}>
              登录
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 