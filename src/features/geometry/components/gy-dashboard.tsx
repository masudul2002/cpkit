"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Search,
  Star,
  ArrowRight,
  TrendingUp,
  Sliders,
  Activity,
  Layers,
  Scissors,
  Calculator,
  Compass,
  Cpu
} from "lucide-react";

interface GyToolItem {
  id: string;
  title: string;
  description: string;
  category: "Point & Vector Properties" | "Polygons & Triangles" | "Line Intersections";
  difficulty: "Easy" | "Medium" | "Hard";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  timeComplexity: string;
}

const GY_TOOLS: GyToolItem[] = [
  {
    id: "point",
    title: "Point Distance",
    description: "Euclidean 2D/3D, Manhattan, and Chebyshev distance queries.",
    category: "Point & Vector Properties",
    difficulty: "Easy",
    href: "/geometry/point",
    icon: Activity,
    timeComplexity: "O(1)",
  },
  {
    id: "orientation",
    title: "Orientation Test",
    description: "Verify Clockwise, CCW, or Collinear state of three points.",
    category: "Point & Vector Properties",
    difficulty: "Easy",
    href: "/geometry/orientation",
    icon: Layers,
    timeComplexity: "O(1)",
  },
  {
    id: "cross-product",
    title: "Vector Cross Product",
    description: "Compute signed area magnitude spanned by 2D vectors.",
    category: "Point & Vector Properties",
    difficulty: "Easy",
    href: "/geometry/cross-product",
    icon: Sliders,
    timeComplexity: "O(1)",
  },
  {
    id: "dot-product",
    title: "Vector Dot Product",
    description: "Evaluate projections and angles between vectors.",
    category: "Point & Vector Properties",
    difficulty: "Easy",
    href: "/geometry/dot-product",
    icon: Sliders,
    timeComplexity: "O(1)",
  },
  {
    id: "line-intersection",
    title: "Line Intersection",
    description: "Check slope intersections coordinates of segments and infinite lines.",
    category: "Line Intersections",
    difficulty: "Medium",
    href: "/geometry/line-intersection",
    icon: Compass,
    timeComplexity: "O(1)",
  },
  {
    id: "convex-hull",
    title: "Convex Hull",
    description: "Compute enclosing boundary using Graham Scan algorithm.",
    category: "Polygons & Triangles",
    difficulty: "Hard",
    href: "/geometry/convex-hull",
    icon: Scissors,
    timeComplexity: "O(N log N)",
  },
  {
    id: "polygon",
    title: "Polygon Properties",
    description: "Shoelace Area, perimeter length, and convexity scans.",
    category: "Polygons & Triangles",
    difficulty: "Medium",
    href: "/geometry/polygon",
    icon: Calculator,
    timeComplexity: "O(N)",
  },
  {
    id: "circle",
    title: "Circle Properties",
    description: "Point inside circle tests, circumferences, and areas.",
    category: "Polygons & Triangles",
    difficulty: "Easy",
    href: "/geometry/circle",
    icon: Calculator,
    timeComplexity: "O(1)",
  },
  {
    id: "triangle",
    title: "Triangle Properties",
    description: "Centroid coordinates, areas, perimeters, and side type structures.",
    category: "Polygons & Triangles",
    difficulty: "Easy",
    href: "/geometry/triangle",
    icon: Calculator,
    timeComplexity: "O(1)",
  },
  {
    id: "point-in-polygon",
    title: "Point in Polygon",
    description: "Verify point containment using horizontal Ray Casting checks.",
    category: "Polygons & Triangles",
    difficulty: "Hard",
    href: "/geometry/point-in-polygon",
    icon: Scissors,
    timeComplexity: "O(N)",
  },
  {
    id: "closest-pair",
    title: "Closest Pair of Points",
    description: "Sweep-line strip check placeholders (coming soon).",
    category: "Point & Vector Properties",
    difficulty: "Hard",
    href: "/geometry/closest-pair",
    icon: Compass,
    timeComplexity: "O(N log N)",
  },
  {
    id: "coordinate-transform",
    title: "Coordinate Transform",
    description: "Translate, rotate, and reflect coordinates on linear matrices.",
    category: "Point & Vector Properties",
    difficulty: "Easy",
    href: "/geometry/coordinate-transform",
    icon: Cpu,
    timeComplexity: "O(1)",
  },
];

export function GyDashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isFav = favorites.includes(id);
    if (isFav) {
      setFavorites(favorites.filter((favId) => favId !== id));
      toast({
        title: "Removed Favorite",
        description: "Removed from your bookmarks list.",
        variant: "info",
      });
    } else {
      setFavorites([...favorites, id]);
      toast({
        title: "Added Favorite",
        description: "Pinned to your favorites bookmarks.",
        variant: "success",
      });
    }
  };

  const filteredTools = GY_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search geometry tools, orientation, convex hull..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Point & Vector Properties", "Polygons & Triangles", "Line Intersections"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                selectedCategory === cat
                  ? "bg-primary border-primary text-primary-foreground font-extrabold shadow-sm"
                  : "bg-background border-border/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          const isFav = favorites.includes(tool.id);

          return (
            <Link key={tool.id} href={tool.href} className="group">
              <Card className="h-full border-border/40 hover:border-primary/50 bg-card/65 hover:bg-card/90 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer relative">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 border border-border/30 rounded-xl bg-muted/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <button
                      onClick={(e) => handleFavoriteToggle(tool.id, e)}
                      className="text-muted-foreground/45 hover:text-amber-500 transition-colors p-1"
                    >
                      <Star className={`h-4.5 w-4.5 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>
                  </div>

                  <CardTitle className="text-sm font-bold text-foreground mt-4 flex items-center gap-1 group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 border-t border-border/5 bg-muted/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[9px] font-mono px-1.5">{tool.timeComplexity}</Badge>
                    <Badge variant={tool.difficulty === "Easy" ? "success" : tool.difficulty === "Medium" ? "warning" : "primary"} className="text-[8px]">
                      {tool.difficulty}
                    </Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Educational Section & Quick Resources */}
      <div className="grid gap-6 md:grid-cols-2 pt-6">
        <Card className="border-border/40 bg-card/65 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Formula Center (KaTeX format references)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              Computational geometry is highly dependent on cross products and orientations:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Cross Product 2D</strong>: $u \times v = u_x v_y - u_y v_x$ representing signed parallelogram areas.</li>
              <li><strong className="text-foreground">Shoelace Formula</strong>: {"$Area = \\frac{1}{2} | \\sum (x_i y_{i+1} - x_{i+1} y_i) |$ for polygon areas."}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/65 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Competitive Programming Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/80">
            <p>
              To prevent floating point precision bugs when writing geometry code:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Use Integer Types</strong>: Whenever possible, keep coordinates and cross product calculations in `long long` integers.</li>
              <li><strong className="text-foreground">Epsilon Tolerances</strong>: When floats are mandatory, use `const double eps = 1e-9` for inequality checks.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
