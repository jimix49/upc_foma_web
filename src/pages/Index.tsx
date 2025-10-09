import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  const projects = [
    {
      title: "Quadratic Formula",
      description: "Interactive visualization of the quadratic formula and parabola roots",
      path: "/quadratic",
      topics: ["Algebra", "Calculus", "Visualization"]
    },
    {
      title: "Modular Arithmetic Cipher",
      description: "Encryption and decryption using modular arithmetic",
      path: "/cipher",
      topics: ["Number Theory", "Cryptography", "Algebra"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Pau Jiménez Sánchez
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Mathematics & Computer Science Student
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Welcome to my academic portfolio. Here you'll find interactive demonstrations 
              of mathematical concepts and computational projects from my university coursework.
            </p>
          </section>

          {/* Projects Grid */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Link key={project.path} to={project.path}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border">
                    <CardHeader>
                      <CardTitle className="text-primary">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* About Section */}
          <section className="mt-16 p-8 bg-card border border-border rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">About This Portfolio</h2>
            <p className="text-muted-foreground leading-relaxed">
              This portfolio showcases interactive demonstrations of mathematical and computational 
              concepts I've studied. Each project includes theoretical explanations alongside 
              practical, interactive visualizations to help understand the underlying principles. 
              The site is built as a static web application and hosted on GitHub Pages.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
