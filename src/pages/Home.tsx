import { motion } from "framer-motion";
import { Users, FileText, BarChart3, Settings, TrendingUp, Clock, DollarSign, FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ActivityTable } from "@/components/activity/ActivityTable";

const navigationCards = [
  {
    title: "Clientes",
    description: "Gerencie seus clientes e informações",
    icon: Users,
    href: "/clients",
    color: "from-blue-500 to-blue-600",
    stats: "128 ativos"
  },
  {
    title: "PER/DCOMP",
    description: "Controle de pedidos e compensações",
    icon: FileText,
    href: "/perdcomps",
    color: "from-purple-500 to-purple-600",
    stats: "45 em aberto"
  },
  {
    title: "Relatórios",
    description: "Visualize relatórios e análises",
    icon: BarChart3,
    href: "/reports",
    color: "from-green-500 to-green-600",
    stats: "12 disponíveis"
  },
  {
    title: "Configurações",
    description: "Ajuste as configurações do sistema",
    icon: Settings,
    href: "/configuration",
    color: "from-orange-500 to-orange-600",
    stats: "Personalizar"
  }
];

const quickStats = [
  {
    title: "Receita Total",
    value: "R$ 450.280,00",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up"
  },
  {
    title: "Novos Clientes",
    value: "24",
    change: "+8.3%",
    icon: Users,
    trend: "up"
  },
  {
    title: "Pendências",
    value: "7",
    change: "-25%",
    icon: Clock,
    trend: "down"
  },
  {
    title: "Processos Ativos",
    value: "156",
    change: "+5.2%",
    icon: FolderOpen,
    trend: "up"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Olá, {user?.first_name || 'Usuário'}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Bem-vindo ao painel de controle do Miele
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-primary/10`}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </Card>
            );
          })}
        </motion.div>

        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {navigationCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur"
                  onClick={() => navigate(card.href)}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${card.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">{card.stats}</span>
                    <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <ActivityTable />
        </motion.div>
      </div>
    </div>
  );
}