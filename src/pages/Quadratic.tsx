import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const Quadratic = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(-4);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate roots using quadratic formula
  const calculateRoots = () => {
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return { type: "complex", roots: [] };
    } else if (discriminant === 0) {
      return { type: "single", roots: [-b / (2 * a)] };
    } else {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return { type: "two", roots: [root1, root2] };
    }
  };

  // Draw parabola on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30;

    // Clear canvas
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(width, centerY + i * scale);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw parabola
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const xStart = -width / (2 * scale);
    const xEnd = width / (2 * scale);
    let firstPoint = true;

    for (let x = xStart; x <= xEnd; x += 0.1) {
      const y = a * x * x + b * x + c;
      const canvasX = centerX + x * scale;
      const canvasY = centerY - y * scale;

      if (firstPoint) {
        ctx.moveTo(canvasX, canvasY);
        firstPoint = false;
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Draw roots
    const rootData = calculateRoots();
    if (rootData.type !== "complex") {
      ctx.fillStyle = "#dc2626";
      rootData.roots.forEach((root) => {
        const canvasX = centerX + root * scale;
        const canvasY = centerY;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [a, b, c]);

  const rootData = calculateRoots();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            The Quadratic Formula
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Theory Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">The Quadratic Equation</h3>
                    <p className="text-muted-foreground">
                      A quadratic equation has the general form:
                    </p>
                    <div className="bg-secondary p-4 rounded-lg my-3 text-center font-mono">
                      ax² + bx + c = 0
                    </div>
                    <p className="text-muted-foreground">
                      where a ≠ 0, and a, b, c are real numbers.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">The Quadratic Formula</h3>
                    <p className="text-muted-foreground mb-3">
                      The solutions (roots) can be found using:
                    </p>
                    <div className="bg-secondary p-4 rounded-lg text-center font-mono">
                      x = (-b ± √(b² - 4ac)) / (2a)
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">The Discriminant</h3>
                    <p className="text-muted-foreground">
                      The discriminant Δ = b² - 4ac determines the nature of roots:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-muted-foreground">
                      <li>If Δ &gt; 0: Two distinct real roots</li>
                      <li>If Δ = 0: One repeated real root</li>
                      <li>If Δ &lt; 0: Two complex conjugate roots</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Equation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary p-4 rounded-lg text-center font-mono text-lg mb-4">
                    {a !== 1 && a !== -1 && a}
                    {a === -1 && "-"}
                    x² {b >= 0 ? "+" : ""} {b !== 0 && b}
                    {b !== 0 && "x"} {c >= 0 ? "+" : ""} {c !== 0 && c} = 0
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Discriminant: <span className="font-mono">{(b * b - 4 * a * c).toFixed(2)}</span>
                    </p>
                    {rootData.type === "complex" && (
                      <p className="text-sm text-destructive">
                        Complex roots (no real solutions)
                      </p>
                    )}
                    {rootData.type === "single" && (
                      <p className="text-sm text-primary">
                        Root: x = {rootData.roots[0].toFixed(3)}
                      </p>
                    )}
                    {rootData.type === "two" && (
                      <div className="text-sm text-primary space-y-1">
                        <p>Root 1: x = {rootData.roots[0].toFixed(3)}</p>
                        <p>Root 2: x = {rootData.roots[1].toFixed(3)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Visualization</CardTitle>
                  <CardDescription>
                    Adjust the coefficients to see how the parabola changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-[400px] border border-border rounded-lg"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Coefficients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>a = {a}</Label>
                    </div>
                    <Slider
                      value={[a]}
                      onValueChange={(value) => setA(value[0])}
                      min={-5}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>b = {b}</Label>
                    </div>
                    <Slider
                      value={[b]}
                      onValueChange={(value) => setB(value[0])}
                      min={-10}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>c = {c}</Label>
                    </div>
                    <Slider
                      value={[c]}
                      onValueChange={(value) => setC(value[0])}
                      min={-10}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Quadratic;
