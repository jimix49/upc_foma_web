const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} Pau Jiménez Sánchez. Academic Portfolio.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
