import {
  Home,
  LayoutDashboard,
  Trophy,
  Bug,
  Sparkles,
  Hash,
  Percent,
  Table2,
  Share2,
  GitBranch,
  Layers,
  Coins,
  Triangle,
  BookOpen,
  Star,
  Clock,
  Settings,
  Info,
  Search
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
}

export const sidebarItems: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Contest Utilities", href: "/contest-utilities", icon: Trophy },
  { title: "Debug Tools", href: "/debug", icon: Bug },
  { title: "Test Generator", href: "/generator", icon: Sparkles },
  { title: "Strings", href: "/strings", icon: Hash },
  { title: "Number Theory", href: "/number-theory", icon: Percent },
  { title: "Matrix", href: "/matrix", icon: Table2 },
  { title: "Graph", href: "/graph", icon: Share2 },
  { title: "Tree", href: "/tree", icon: GitBranch },
  { title: "Dynamic Programming", href: "/dp", icon: Layers },
  { title: "Greedy", href: "/greedy", icon: Coins },
  { title: "Geometry", href: "/geometry", icon: Triangle },
  { title: "Search", href: "/search", icon: Search },
  { title: "Quick Reference", href: "/quick-reference", icon: BookOpen },
  { title: "Favorites", href: "/favorites", icon: Star },
  { title: "Recent", href: "/recent", icon: Clock },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "About", href: "/about", icon: Info },
];
