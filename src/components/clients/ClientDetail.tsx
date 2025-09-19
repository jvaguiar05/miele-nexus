import { useEffect, useState } from "react";
import { ArrowLeft, Edit, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientStore } from "@/stores/clientStore";
import { usePerdCompStore } from "@/stores/perdcompStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
  onEdit: () => void;
  onAddPerdComp: () => void;
}

export default function ClientDetail({ clientId, onBack, onEdit, onAddPerdComp }: ClientDetailProps) {
  const { selectedClient, fetchClientById } = useClientStore();
  const { fetchPerdCompsByClient, clientPerdComps } = usePerdCompStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchClientById(clientId);
        await fetchPerdCompsByClient(clientId);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [clientId]);

  if (loading || !selectedClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{selectedClient.razao_social}</h2>
        </div>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="perdcomps">PER/DCOMPs</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Empresariais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">CNPJ</p>
                  <p className="font-mono">{formatCNPJ(selectedClient.cnpj)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nome Fantasia</p>
                  <p>{selectedClient.nome_fantasia || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Empresa</p>
                  <Badge variant="outline">{selectedClient.tipo_empresa}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Regime Tributário</p>
                  <p>{selectedClient.regime_tributario || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CNAE</p>
                  <p>{selectedClient.cnae || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedClient.recuperacao_judicial ? "destructive" : "default"}>
                    {selectedClient.recuperacao_judicial ? "Recuperação Judicial" : "Ativo"}
                  </Badge>
                </div>
              </div>
              
              {selectedClient.atividades && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Atividades</p>
                    <p className="text-sm">{selectedClient.atividades}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{selectedClient.logradouro || ""} {selectedClient.numero || ""}</p>
                {selectedClient.complemento && <p>{selectedClient.complemento}</p>}
                <p>{selectedClient.bairro || ""} - {selectedClient.municipio || ""}/{selectedClient.uf || ""}</p>
                {selectedClient.cep && <p>CEP: {selectedClient.cep}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email de Contato</p>
                  <p>{selectedClient.email_contato || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone de Contato</p>
                  <p>{selectedClient.telefone_contato || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Comercial</p>
                  <p>{selectedClient.email_comercial || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone Comercial</p>
                  <p>{selectedClient.telefone_comercial || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Site</p>
                  {selectedClient.site ? (
                    <a href={selectedClient.site} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {selectedClient.site}
                    </a>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Responsável Financeiro</p>
                  <p>{selectedClient.responsavel_financeiro || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quadro Societário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{selectedClient.quadro_societario || "Não informado"}</p>
                {selectedClient.cargo && (
                  <p className="text-sm text-muted-foreground">Cargo: {selectedClient.cargo}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perdcomps" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">PER/DCOMPs do Cliente</h3>
            <Button onClick={onAddPerdComp}>
              <Plus className="mr-2 h-4 w-4" />
              Novo PER/DCOMP
            </Button>
          </div>

          {clientPerdComps.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhum PER/DCOMP encontrado para este cliente</p>
                <Button className="mt-4" onClick={onAddPerdComp}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro PER/DCOMP
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {clientPerdComps.map((perdcomp) => (
                <Card key={perdcomp.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{perdcomp.numero}</span>
                          <Badge variant="outline">{perdcomp.imposto}</Badge>
                          <Badge 
                            variant={
                              perdcomp.status === "Aprovado" ? "default" :
                              perdcomp.status === "Recusado" ? "destructive" :
                              "secondary"
                            }
                          >
                            {perdcomp.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Competência: {perdcomp.competencia} | 
                          Transmissão: {perdcomp.data_transmissao ? formatDate(perdcomp.data_transmissao) : "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Solicitado</p>
                        <p className="font-semibold">{formatCurrency(perdcomp.valor_solicitado)}</p>
                        {perdcomp.valor_recebido > 0 && (
                          <>
                            <p className="text-sm text-muted-foreground mt-1">Recebido</p>
                            <p className="font-semibold text-success">{formatCurrency(perdcomp.valor_recebido)}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}