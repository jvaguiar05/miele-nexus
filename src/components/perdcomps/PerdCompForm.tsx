import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePerdCompStore } from "@/stores/perdcompStore";
import { useClientStore } from "@/stores/clientStore";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

const perdcompSchema = z.object({
  client_id: z.string().min(1, "Cliente é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  imposto: z.string().min(1, "Imposto é obrigatório"),
  competencia: z.string().min(1, "Competência é obrigatória"),
  valor_solicitado: z.number().min(0, "Valor deve ser positivo"),
  valor_recebido: z.number().min(0, "Valor deve ser positivo"),
  status: z.string(),
  data_transmissao: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
});

type PerdCompFormData = z.infer<typeof perdcompSchema>;

interface PerdComp {
  id: string;
  client_id: string;
  numero: string;
  imposto: string;
  competencia: string;
  valor_solicitado: number;
  valor_recebido: number;
  status: string;
  data_transmissao?: string;
  observacoes?: string;
}

interface PerdCompFormProps {
  perdcomp?: PerdComp | null;
  clientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PerdCompForm({ perdcomp, clientId, onSuccess, onCancel }: PerdCompFormProps) {
  const { createPerdComp, updatePerdComp } = usePerdCompStore();
  const { clients, fetchClients } = useClientStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<PerdCompFormData>({
    resolver: zodResolver(perdcompSchema),
    defaultValues: perdcomp || {
      client_id: clientId || "",
      status: "Pendente",
      valor_solicitado: 0,
      valor_recebido: 0,
    },
  });

  const onSubmit = async (data: PerdCompFormData) => {
    try {
      if (perdcomp) {
        await updatePerdComp(perdcomp.id, data);
        toast({
          title: "PER/DCOMP atualizado",
          description: "As informações foram atualizadas com sucesso.",
        });
      } else {
        await createPerdComp(data);
        toast({
          title: "PER/DCOMP criado",
          description: "O PER/DCOMP foi cadastrado com sucesso.",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o PER/DCOMP.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="values">Valores</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client_id">Cliente *</Label>
            <Select 
              onValueChange={(value) => setValue("client_id", value)}
              defaultValue={perdcomp?.client_id || clientId}
            >
              <SelectTrigger className={errors.client_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nome_fantasia || client.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && (
              <p className="text-sm text-destructive">{errors.client_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                {...register("numero")}
                className={errors.numero ? "border-destructive" : ""}
              />
              {errors.numero && (
                <p className="text-sm text-destructive">{errors.numero.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imposto">Imposto *</Label>
              <Select 
                onValueChange={(value) => setValue("imposto", value)}
                defaultValue={perdcomp?.imposto}
              >
                <SelectTrigger className={errors.imposto ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o imposto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IRPJ">IRPJ</SelectItem>
                  <SelectItem value="CSLL">CSLL</SelectItem>
                  <SelectItem value="PIS">PIS</SelectItem>
                  <SelectItem value="COFINS">COFINS</SelectItem>
                  <SelectItem value="PIS/COFINS">PIS/COFINS</SelectItem>
                  <SelectItem value="IPI">IPI</SelectItem>
                  <SelectItem value="ICMS">ICMS</SelectItem>
                </SelectContent>
              </Select>
              {errors.imposto && (
                <p className="text-sm text-destructive">{errors.imposto.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="competencia">Competência *</Label>
              <Input
                id="competencia"
                {...register("competencia")}
                placeholder="Ex: 2023, 01/2023"
                className={errors.competencia ? "border-destructive" : ""}
              />
              {errors.competencia && (
                <p className="text-sm text-destructive">{errors.competencia.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => setValue("status", value)}
                defaultValue={perdcomp?.status || "Pendente"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Recusado">Recusado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_transmissao">Data de Transmissão</Label>
            <Input
              id="data_transmissao"
              type="date"
              {...register("data_transmissao")}
            />
          </div>
        </TabsContent>

        <TabsContent value="values" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_solicitado">Valor Solicitado *</Label>
              <Input
                id="valor_solicitado"
                type="number"
                step="0.01"
                {...register("valor_solicitado", { valueAsNumber: true })}
                className={errors.valor_solicitado ? "border-destructive" : ""}
              />
              {errors.valor_solicitado && (
                <p className="text-sm text-destructive">{errors.valor_solicitado.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_recebido">Valor Recebido</Label>
              <Input
                id="valor_recebido"
                type="number"
                step="0.01"
                {...register("valor_recebido", { valueAsNumber: true })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea 
              id="observacoes" 
              {...register("observacoes")} 
              rows={6}
              placeholder="Adicione observações sobre este PER/DCOMP..."
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-primary to-primary/80"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : perdcomp ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}