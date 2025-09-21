// Login page with carousel
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { LogIn, Users, FileText, BarChart3, Shield, Clock, Database, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const loginSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const carouselFeatures = [
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Controle completo de informações de clientes com histórico detalhado e relatórios personalizados",
    stats: "500+ clientes ativos"
  },
  {
    icon: FileText,
    title: "PER/DCOMP Automatizado",
    description: "Geração e controle automatizado de documentos fiscais com validação em tempo real",
    stats: "1000+ documentos processados"
  },
  {
    icon: BarChart3,
    title: "Relatórios Inteligentes",
    description: "Dashboards interativos com análises avançadas e insights em tempo real",
    stats: "50+ tipos de relatórios"
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Proteção de dados com criptografia de ponta e autenticação em duas etapas",
    stats: "100% conformidade LGPD"
  },
  {
    icon: Clock,
    title: "Suporte 24/7",
    description: "Equipe especializada disponível para auxiliar em todas as suas necessidades",
    stats: "< 2h tempo de resposta"
  },
  {
    icon: Database,
    title: "Backup Automático",
    description: "Seus dados sempre seguros com backups automáticos diários em múltiplas localizações",
    stats: "99.9% uptime garantido"
  }
];

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isLoading } = useAuthStore();
  const [rememberMe, setRememberMe] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        username: data.username,
        password: data.password
      });
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Miele.",
      });
      navigate("/home");
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.response?.data?.detail || "Credenciais inválidas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <ThemeToggle variant="auth" />
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4 shadow-lg">
              <span className="text-3xl font-bold text-primary-foreground">M</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo de volta</h2>
            <p className="text-muted-foreground mt-2">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu.usuario"
                  {...register("username")}
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Lembrar-me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Novo por aqui?{" "}
              <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Criar uma conta
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Feature Carousel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          <Carousel 
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {carouselFeatures.map((feature, index) => (
                <CarouselItem key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-1"
                  >
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-xl"></div>
                        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-xl">
                          <feature.icon className="w-10 h-10 text-primary-foreground" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                        <p className="text-base text-muted-foreground leading-relaxed px-4">
                          {feature.description}
                        </p>
                        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-sm font-semibold text-primary">{feature.stats}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <div className="w-12 h-1 rounded-full bg-primary/20"></div>
                        <div className="w-12 h-1 rounded-full bg-primary/20"></div>
                        <div className="w-12 h-1 rounded-full bg-primary/20"></div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center items-center gap-2 mt-8">
              <CarouselPrevious className="static translate-x-0 translate-y-0 bg-background/80 hover:bg-background border-border" />
              <div className="flex gap-1.5">
                {carouselFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      current === index 
                        ? "w-6 bg-primary" 
                        : "bg-primary/30 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <CarouselNext className="static translate-x-0 translate-y-0 bg-background/80 hover:bg-background border-border" />
            </div>
            
            <div className="text-center mt-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Miele
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Sistema de Gestão Empresarial
              </p>
            </div>
          </Carousel>
        </motion.div>
      </div>
    </div>
  );
}