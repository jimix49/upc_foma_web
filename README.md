# Pau Jiménez Sánchez - Academic Portfolio

An interactive academic portfolio showcasing mathematical and computational projects with live demonstrations.

## 🌐 Live Site

Visit: [https://upc.paujimenezsanchez.online](https://upc.paujimenezsanchez.online)

## 📚 Projects

### 1. Quadratic Formula Visualization
- Interactive parabola graphing
- Real-time root calculation
- Adjustable coefficients (a, b, c)
- Visual demonstration of the discriminant

### 2. Modular Arithmetic Cipher
- Caesar cipher encryption/decryption
- Modular arithmetic demonstration
- Educational cryptography tool

## 🚀 Deployment to GitHub Pages

### Prerequisites
- Node.js and npm installed
- Git installed
- A GitHub account

### Steps

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with your static files.

4. **Deploy to GitHub Pages**

   Option A: Using gh-pages package
   ```bash
   npm install --save-dev gh-pages
   ```
   
   Add to package.json scripts:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
   
   Then run:
   ```bash
   npm run deploy
   ```

   Option B: Manual deployment
   - Push the `dist` folder contents to a `gh-pages` branch
   - Enable GitHub Pages in repository settings, selecting the `gh-pages` branch

5. **Configure GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages section
   - Select source branch (usually `gh-pages`)
   - Save settings

### 🌍 Connecting Your Custom Domain

1. **In GitHub Repository Settings:**
   - Go to Settings → Pages
   - Under "Custom domain", enter: `upc.paujimenezsanchez.online`
   - Save

2. **In Your Domain Provider (DNS Settings):**
   
   Add the following DNS records:
   
   **A Records** (for root domain):
   ```
   Type: A
   Name: @ (or leave blank)
   Value: 185.158.133.1
   ```

   **CNAME Record** (for www subdomain):
   ```
   Type: CNAME
   Name: www
   Value: <your-github-username>.github.io
   ```

   **CNAME Record** (for upc subdomain):
   ```
   Type: CNAME
   Name: upc
   Value: <your-github-username>.github.io
   ```

3. **Wait for DNS propagation** (can take 24-48 hours)

4. **Enable HTTPS** in GitHub Pages settings (automatic after domain verification)

## 📝 Adding New Projects

To add a new project page:

1. **Create a new page component** in `src/pages/`:
   ```tsx
   // src/pages/NewProject.tsx
   import Navigation from "@/components/Navigation";
   import Footer from "@/components/Footer";

   const NewProject = () => {
     return (
       <div className="min-h-screen flex flex-col bg-background">
         <Navigation />
         <main className="flex-1 container mx-auto px-4 py-12">
           {/* Your project content */}
         </main>
         <Footer />
       </div>
     );
   };

   export default NewProject;
   ```

2. **Add the route** in `src/App.tsx`:
   ```tsx
   import NewProject from "./pages/NewProject";
   
   // In the Routes section:
   <Route path="/new-project" element={<NewProject />} />
   ```

3. **Update the navigation** in `src/components/Navigation.tsx`:
   ```tsx
   const navItems = [
     { path: "/", label: "Home" },
     { path: "/quadratic", label: "Quadratic Formula" },
     { path: "/cipher", label: "Modular Cipher" },
     { path: "/new-project", label: "New Project" }, // Add this
   ];
   ```

4. **Add project card** on homepage (`src/pages/Index.tsx`):
   ```tsx
   const projects = [
     // ... existing projects
     {
       title: "New Project",
       description: "Description of your new project",
       path: "/new-project",
       topics: ["Topic1", "Topic2"]
     }
   ];
   ```

## 🛠️ Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:8080`

## 📦 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navigation.tsx    # Site navigation bar
│   │   ├── Footer.tsx        # Site footer
│   │   └── ui/               # Reusable UI components
│   ├── pages/
│   │   ├── Index.tsx         # Homepage
│   │   ├── Quadratic.tsx     # Quadratic formula project
│   │   ├── Cipher.tsx        # Cipher project
│   │   └── NotFound.tsx      # 404 page
│   ├── index.css             # Global styles & design system
│   └── App.tsx               # Main app & routing
├── public/                   # Static assets
└── index.html               # HTML template
```

## 🎨 Customization

### Updating Colors
Edit `src/index.css` to change the color scheme:
```css
:root {
  --primary: 210 85% 45%;        /* Main blue */
  --academic-blue: 210 85% 45%;
  /* Add more custom colors */
}
```

### Updating Content
- Homepage: Edit `src/pages/Index.tsx`
- Projects: Edit respective files in `src/pages/`
- Footer: Edit `src/components/Footer.tsx`

## 📄 License

This portfolio is for academic purposes.

## 👤 Author

**Pau Jiménez Sánchez**  
Mathematics & Computer Science Student

---

For questions or issues with deployment, please refer to:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
