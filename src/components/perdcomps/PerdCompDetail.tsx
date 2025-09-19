import { useEffect, useState } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePerdCompStore } from "@/stores/perdcompStore";
import { useClientStore } from "@/stores/clientStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PerdCompDetailProps {
  perdcompId: string;
  onBack: () => void;
  onEdit: () => void;
}

export default function PerdCompDetail({ perdcompId, onBack, onEdit }: PerdCompDetailProps) {
  const { selectedPerdComp, fetchPerdCompById } = usePerdCompStore();
  const { fetchClientById } = useClientStore();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const perdcomp = await fetchPerdCompById(perdcompId);
        if (perdcomp?.client_id) {
          const clientData = await fetchClientById(perdcomp.client_id);
          setClient(clientData);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [perdcompId]);

  if (loading || !selectedPerdComp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado": return "default";
      case "Recusado": return "destructive";
      case "Em Análise": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedPerdComp.numero}</h2>
            <p className="text-muted-foreground">
              {client && `${client.razao_social} - CNPJ: ${client.cnpj}`}
            </p>
          </div>
        </div>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Número</p>
                <p className="font-semibold">{selectedPerdComp.numero}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusColor(selectedPerdComp.status)}>
                  {selectedPerdComp.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Imposto</p>
                <Badge variant="outline">{selectedPerdComp.imposto}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Competência</p>
                <p>{selectedPerdComp.competencia}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Transmissão</p>
                <p>{selectedPerdComp.data_transmissao ? formatDate(selectedPerdComp.data_transmissao) : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criado em</p>
                <p>{selectedPerdComp.created_at ? formatDate(selectedPerdComp.created_at) : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor Solicitado</span>
                <span className="text-lg font-semibold">{formatCurrency(selectedPerdComp.valor_solicitado)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor Recebido</span>
                <span className="text-lg font-semibold text-success">
                  {formatCurrency(selectedPerdComp.valor_recebido)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Saldo Pendente</span>
                <span className="text-lg font-semibold">
                  {formatCurrency(selectedPerdComp.valor_solicitado - selectedPerdComp.valor_recebido)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedPerdComp.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{selectedPerdComp.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {client && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Razão Social</p>
                <p className="font-medium">{client.razao_social}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CNPJ</p>
                <p className="font-mono">{client.cnpj}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{client.email_contato || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p>{client.telefone_contato || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}