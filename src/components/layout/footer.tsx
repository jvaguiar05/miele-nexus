export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex h-14 items-center justify-between px-4">
        <p className="text-sm text-muted-foreground">
          © 2024 Miele. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacidade
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Termos
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Suporte
          </a>
        </div>
      </div>
    </footer>
  );
}