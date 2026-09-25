import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun, Wallet, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <span className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-lift">
            <Wallet className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Hissa<span className="brand-text">Club</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex lg:gap-3">
          <Link
            to="/"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/how-it-works"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            to="/my-pools"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            My Pools
          </Link>
          <Link to="/create" className="btn-primary text-xs lg:text-sm py-2 px-4">
            Start a pool
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch colour theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch colour theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-b border-border bg-card/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              onClick={closeMenu}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              to="/my-pools"
              onClick={closeMenu}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              My Pools
            </Link>
            <Link
              to="/create"
              onClick={closeMenu}
              className="btn-primary mt-2 w-full justify-center text-center"
            >
              Start a pool
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
