import { Link } from "@tanstack/react-router";
import { Heart, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/60 pt-12 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 pb-10 sm:grid-cols-2 lg:grid-cols-4 border-b border-border/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-display text-xl font-bold tracking-tight">
              Hissa<span className="brand-text">Club</span>
            </span>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Pakistan's dedicated group expense and milestone pooling platform. Collect
              contributions seamlessly with zero signup, instant verification, and direct WhatsApp
              reminders.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Privacy-First Architecture
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="transition-colors hover:text-foreground">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/my-pools" className="transition-colors hover:text-foreground">
                  My Pools
                </Link>
              </li>
              <li>
                <Link to="/create" className="transition-colors hover:text-foreground">
                  Start a Pool
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Credit & Portfolio */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Creator</h4>
            <p className="text-xs text-muted-foreground">
              Designed & developed by Website developer Sana Javed.
            </p>
            <a
              href="https://sanajaved-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground shadow-sm"
            >
              <span>Sana Javed Portfolio</span>
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5">
            Built in Pakistan with <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> by{" "}
            <a
              href="https://sanajaved-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-primary"
            >
              Sana Javed
            </a>
          </p>
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} HissaClub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
