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
  Search,
  Calculator,
  RefreshCw,
  Binary,
  FileCode2,
  Cpu
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  children?: NavItem[];
}

export const sidebarItems: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Contest Utilities",
    href: "/contest-utilities",
    icon: Trophy,
    children: [
      { title: "Calculator", href: "/contest-utilities/calculator", icon: Calculator },
      { title: "Base Converter", href: "/contest-utilities/base-converter", icon: RefreshCw },
      { title: "Binary Calculator", href: "/contest-utilities/binary-calculator", icon: Binary },
      { title: "ASCII Table", href: "/contest-utilities/ascii-table", icon: Hash },
      { title: "Roman Converter", href: "/contest-utilities/roman-converter", icon: BookOpen },
      { title: "Expression Evaluator", href: "/contest-utilities/expression-evaluator", icon: FileCode2 },
      { title: "BigInt Calculator", href: "/contest-utilities/bigint-calculator", icon: Layers },
      { title: "Overflow Checker", href: "/contest-utilities/overflow-checker", icon: Cpu },
    ],
  },
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
