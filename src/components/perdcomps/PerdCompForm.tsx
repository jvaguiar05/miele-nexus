import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePerdCompStore } from "@/stores/perdcompStore";
import { useClientStore } from "@/stores/clientStore";
import { useToast } from "@/hooks/use-toast";
import { PerdComp } from "@/types/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const perdcompSchema = z.object({
  client: z.number().min(1, "Cliente é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  nr_perdcomp: z.string().min(1, "Número PER/DCOMP é obrigatório"),
  data_transmissao: z.string().min(1, "Data de transmissão é obrigatória"),
  data_vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  tributo_pedido: z.string().min(1, "Tributo é obrigatório"),
  competencia: z.string().min(1, "Competência é obrigatória"),
  valor_pedido: z.number().min(0, "Valor deve ser positivo"),
  valor_compensado: z.number().min(0, "Valor deve ser positivo"),
  valor_recebido: z.number().min(0, "Valor deve ser positivo"),
  valor_saldo: z.number().min(0, "Valor deve ser positivo"),
  valor_selic: z.number().min(0, "Valor deve ser positivo"),
  recebido: z.boolean(),
  data_recebimento: z.string().optional().nullable(),
  anotacoes: z.string().optional().nullable(),
});

type PerdCompFormData = z.infer<typeof perdcompSchema>;

interface PerdCompFormProps {
  perdcomp?: PerdComp | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PerdCompForm({ perdcomp, onSuccess, onCancel }: PerdCompFormProps) {
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
      recebido: false,
      valor_pedido: 0,
      valor_compensado: 0,
      valor_recebido: 0,
      valor_saldo: 0,
      valor_selic: 0,
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
            <Label htmlFor="client">Cliente *</Label>
            <Select 
              onValueChange={(value) => setValue("client", parseInt(value))}
              defaultValue={perdcomp?.client?.toString()}
            >
              <SelectTrigger className={errors.client ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.nome_fantasia || client.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client && (
              <p className="text-sm text-destructive">{errors.client.message}</p>
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
              <Label htmlFor="nr_perdcomp">Nº PER/DCOMP *</Label>
              <Input
                id="nr_perdcomp"
                {...register("nr_perdcomp")}
                className={errors.nr_perdcomp ? "border-destructive" : ""}
              />
              {errors.nr_perdcomp && (
                <p className="text-sm text-destructive">{errors.nr_perdcomp.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome/Descrição *</Label>
            <Input
              id="nome"
              {...register("nome")}
              className={errors.nome ? "border-destructive" : ""}
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tributo_pedido">Tributo *</Label>
              <Select onValueChange={(value) => setValue("tributo_pedido", value)}>
                <SelectTrigger className={errors.tributo_pedido ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o tributo" />
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
              {errors.tributo_pedido && (
                <p className="text-sm text-destructive">{errors.tributo_pedido.message}</p>
              )}
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_transmissao">Data de Transmissão *</Label>
              <Input
                id="data_transmissao"
                type="date"
                {...register("data_transmissao")}
                className={errors.data_transmissao ? "border-destructive" : ""}
              />
              {errors.data_transmissao && (
                <p className="text-sm text-destructive">{errors.data_transmissao.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
              <Input
                id="data_vencimento"
                type="date"
                {...register("data_vencimento")}
                className={errors.data_vencimento ? "border-destructive" : ""}
              />
              {errors.data_vencimento && (
                <p className="text-sm text-destructive">{errors.data_vencimento.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recebido"
              checked={watch("recebido")}
              onCheckedChange={(checked) => setValue("recebido", checked)}
            />
            <Label htmlFor="recebido">Recebido</Label>
          </div>

          {watch("recebido") && (
            <div className="space-y-2">
              <Label htmlFor="data_recebimento">Data de Recebimento</Label>
              <Input
                id="data_recebimento"
                type="date"
                {...register("data_recebimento")}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="values" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_pedido">Valor Pedido *</Label>
              <Input
                id="valor_pedido"
                type="number"
                step="0.01"
                {...register("valor_pedido", { valueAsNumber: true })}
                className={errors.valor_pedido ? "border-destructive" : ""}
              />
              {errors.valor_pedido && (
                <p className="text-sm text-destructive">{errors.valor_pedido.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_compensado">Valor Compensado</Label>
              <Input
                id="valor_compensado"
                type="number"
                step="0.01"
                {...register("valor_compensado", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_recebido">Valor Recebido</Label>
              <Input
                id="valor_recebido"
                type="number"
                step="0.01"
                {...register("valor_recebido", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_saldo">Valor Saldo</Label>
              <Input
                id="valor_saldo"
                type="number"
                step="0.01"
                {...register("valor_saldo", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_selic">Valor SELIC</Label>
            <Input
              id="valor_selic"
              type="number"
              step="0.01"
              {...register("valor_selic", { valueAsNumber: true })}
            />
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="anotacoes">Anotações</Label>
            <Textarea 
              id="anotacoes" 
              {...register("anotacoes")} 
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