import { useState, useEffect } from "react";
import { FileText, Plus, Search, Filter, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import PerdCompTable from "@/components/perdcomps/PerdCompTable";
import PerdCompForm from "@/components/perdcomps/PerdCompForm";
import { usePerdCompStore } from "@/stores/perdcompStore";
import { useClientStore } from "@/stores/clientStore";
import { PerdComp } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

export default function PerdCompsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPerdComp, setSelectedPerdComp] = useState<PerdComp | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterClient, setFilterClient] = useState<string>("all");
  
  const { perdcomps, fetchPerdComps, isLoading } = usePerdCompStore();
  const { clients, fetchClients } = useClientStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchPerdComps();
    fetchClients();
  }, [fetchPerdComps, fetchClients]);

  const handleEdit = (perdcomp: PerdComp) => {
    setSelectedPerdComp(perdcomp);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedPerdComp(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedPerdComp(null);
    fetchPerdComps();
  };

  const handleExportExcel = () => {
    toast({
      title: "Exportando dados",
      description: "O arquivo Excel será baixado em breve.",
    });
  };

  const handleImportExcel = () => {
    toast({
      title: "Importar Excel",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  const filteredPerdComps = perdcomps.filter(pc => {
    const matchesSearch = searchQuery === "" || 
      pc.nr_perdcomp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pc.nome.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "received" && pc.recebido) ||
      (filterStatus === "pending" && !pc.recebido);
    
    const matchesClient = filterClient === "all" || 
      pc.client === parseInt(filterClient);
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  return (
    <div className="min-h-full p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                PER/DCOMPs
              </h1>
              <p className="text-sm text-muted-foreground">
                Gerencie pedidos de restituição e compensação
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleImportExcel}
              variant="outline"
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Importar
            </Button>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-gradient-to-r from-primary to-primary/80 gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo PER/DCOMP
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/50 backdrop-blur border-primary/10">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{perdcomps.length}</p>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur border-primary/10">
            <p className="text-sm text-muted-foreground">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {perdcomps.filter(p => !p.recebido).length}
            </p>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur border-primary/10">
            <p className="text-sm text-muted-foreground">Recebidos</p>
            <p className="text-2xl font-bold text-green-600">
              {perdcomps.filter(p => p.recebido).length}
            </p>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur border-primary/10">
            <p className="text-sm text-muted-foreground">Valor Total</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(perdcomps.reduce((acc, p) => acc + p.valor_pedido, 0))}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 bg-card/50 backdrop-blur">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por número ou nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="received">Recebidos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterClient} onValueChange={setFilterClient}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.nome_fantasia || client.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-card/50 backdrop-blur overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <PerdCompTable 
              perdcomps={filteredPerdComps}
              onEdit={handleEdit}
            />
          )}
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPerdComp ? "Editar PER/DCOMP" : "Novo PER/DCOMP"}
            </DialogTitle>
          </DialogHeader>
          <PerdCompForm
            perdcomp={selectedPerdComp}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}