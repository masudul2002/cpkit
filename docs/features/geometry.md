# Geometry Laboratory (GY) Feature Documentation

CPKit Geometry Laboratory (GY) provides interactive visualizers for 2D/3D coordinate geometry, orientation turns, vector skew cross/dot products, line intersection coordinates checks, Ray Casting crossings, Graham Scan convex hulls, and coordinate reflection transformation matrices.

---

## 🛠️ Implemented Tools

### 1. Point & Vector Properties
- **Point Distance**: Euclidean 2D/3D, Manhattan, and Chebyshev distance queries.
  - **Route**: `/geometry/point`
  - **Time**: $O(1)$ | **Space**: $O(1)$
- **Orientation Test**: Verify Clockwise, CCW, or Collinear state of three points.
  - **Route**: `/geometry/orientation`
  - **Time**: $O(1)$ | **Space**: $O(1)$
- **Vector Cross Product**: Skew products, signed parallelogram areas, and vector CW orientation checks.
  - **Route**: `/geometry/cross-product`
  - **Time**: $O(1)$ | **Space**: $O(1)$
- **Vector Dot Product**: Compute projection lines and cosine theta angle splits.
  - **Route**: `/geometry/dot-product`
  - **Time**: $O(1)$ | **Space**: $O(1)$
- **Coordinate Transform**: Perform coordinate translation, rotation matrices, scaling, and reflections.
  - **Route**: `/geometry/coordinate-transform`
  - **Time**: $O(1)$ | **Space**: $O(1)$
- **Closest Pair of Points**: Sweep-line architecture-ready placeholder.
  - **Route**: `/geometry/closest-pair`
  - **Time**: $O(N \log N)$ | **Space**: $O(N)$

### 2. Polygons & Triangles
- **Convex Hull**: Animate Graham Scan polar sorting sweeps and stack pops step-by-step.
  - **Route**: `/geometry/convex-hull`
  - **Time**: $O(N \log N)$ | **Space**: $O(N)$
- **Polygon Properties**: Shoelace area calculations, perimeter lengths, and convexity turns checks.
  - **Route**: `/geometry/polygon`
  - **Time**: $O(N)$ | **Space**: $O(1)$
- **Circle Properties**: Point inside circle tests, circumferences, and areas.
  - **Route**: `/geometry/circle`
  - **Time**: $O(1)$ | **Space**: $O(1)$
- **Triangle Properties**: Centroid calculations, Heron area, perimeters, and Equilateral/Isosceles/Scalene detection.
  - **Route**: `/geometry/triangle`
  - **Time**: $O(1)$ | **Space**: $O(1)$
- **Point in Polygon**: Ray Casting crossings check with crossing logs.
  - **Route**: `/geometry/point-in-polygon`
  - **Time**: $O(N)$ | **Space**: $O(1)$

### 3. Line Intersections
- **Line Intersection**: Find meet points of segments and infinite lines, detecting parallel states.
  - **Route**: `/geometry/line-intersection`
  - **Time**: $O(1)$ | **Space**: $O(1)$
