import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useClientStore } from "@/stores/clientStore";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const clientSchema = z.object({
  cnpj: z.string().min(14, "CNPJ inválido"),
  razao_social: z.string().min(3, "Razão social é obrigatória"),
  nome_fantasia: z.string().optional(),
  tipo_empresa: z.string().min(1, "Tipo de empresa é obrigatório"),
  quadro_societario: z.string().optional(),
  cargo: z.string().optional(),
  telefone_contato: z.string().min(10, "Telefone é obrigatório"),
  email_contato: z.string().email("Email inválido"),
  responsavel_financeiro: z.string().optional(),
  telefone_comercial: z.string().optional(),
  email_comercial: z.string().optional(),
  site: z.string().optional(),
  cnae: z.string().optional(),
  regime_tributario: z.string().optional(),
  recuperacao_judicial: z.boolean().default(false),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  cep: z.string().optional(),
  atividades: z.string().optional(),
  anotacoes_anteriores: z.string().optional(),
  nova_anotacao: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Client | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const { createClient, updateClient } = useClientStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {
      recuperacao_judicial: false,
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (client) {
        await updateClient(client.id, data);
        toast({
          title: "Cliente atualizado",
          description: "As informações do cliente foram atualizadas com sucesso.",
        });
      } else {
        await createClient(data);
        toast({
          title: "Cliente criado",
          description: "O cliente foi cadastrado com sucesso.",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o cliente.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                {...register("cnpj")}
                placeholder="00.000.000/0000-00"
                className={errors.cnpj ? "border-destructive" : ""}
              />
              {errors.cnpj && (
                <p className="text-sm text-destructive">{errors.cnpj.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_empresa">Tipo de Empresa *</Label>
              <Select onValueChange={(value) => setValue("tipo_empresa", value)}>
                <SelectTrigger className={errors.tipo_empresa ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEI">MEI</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                  <SelectItem value="EPP">EPP</SelectItem>
                  <SelectItem value="LTDA">LTDA</SelectItem>
                  <SelectItem value="SA">SA</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_empresa && (
                <p className="text-sm text-destructive">{errors.tipo_empresa.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razao_social">Razão Social *</Label>
            <Input
              id="razao_social"
              {...register("razao_social")}
              className={errors.razao_social ? "border-destructive" : ""}
            />
            {errors.razao_social && (
              <p className="text-sm text-destructive">{errors.razao_social.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
            <Input id="nome_fantasia" {...register("nome_fantasia")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnae">CNAE</Label>
              <Input id="cnae" {...register("cnae")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regime_tributario">Regime Tributário</Label>
              <Select onValueChange={(value) => setValue("regime_tributario", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIMPLES">Simples Nacional</SelectItem>
                  <SelectItem value="LUCRO_PRESUMIDO">Lucro Presumido</SelectItem>
                  <SelectItem value="LUCRO_REAL">Lucro Real</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recuperacao_judicial"
              checked={watch("recuperacao_judicial")}
              onCheckedChange={(checked) => setValue("recuperacao_judicial", checked)}
            />
            <Label htmlFor="recuperacao_judicial">Em recuperação judicial</Label>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email_contato">Email de Contato *</Label>
              <Input
                id="email_contato"
                type="email"
                {...register("email_contato")}
                className={errors.email_contato ? "border-destructive" : ""}
              />
              {errors.email_contato && (
                <p className="text-sm text-destructive">{errors.email_contato.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone_contato">Telefone de Contato *</Label>
              <Input
                id="telefone_contato"
                {...register("telefone_contato")}
                className={errors.telefone_contato ? "border-destructive" : ""}
              />
              {errors.telefone_contato && (
                <p className="text-sm text-destructive">{errors.telefone_contato.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel_financeiro">Responsável Financeiro</Label>
            <Input id="responsavel_financeiro" {...register("responsavel_financeiro")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email_comercial">Email Comercial</Label>
              <Input id="email_comercial" type="email" {...register("email_comercial")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone_comercial">Telefone Comercial</Label>
              <Input id="telefone_comercial" {...register("telefone_comercial")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Input id="site" type="url" {...register("site")} placeholder="https://" />
          </div>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" {...register("cep")} placeholder="00000-000" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input id="logradouro" {...register("logradouro")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" {...register("numero")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input id="complemento" {...register("complemento")} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" {...register("bairro")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipio">Município</Label>
              <Input id="municipio" {...register("municipio")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">UF</Label>
              <Select onValueChange={(value) => setValue("uf", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">SP</SelectItem>
                  <SelectItem value="RJ">RJ</SelectItem>
                  <SelectItem value="MG">MG</SelectItem>
                  <SelectItem value="ES">ES</SelectItem>
                  {/* Add more states as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="atividades">Atividades</Label>
            <Textarea id="atividades" {...register("atividades")} rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="anotacoes_anteriores">Anotações Anteriores</Label>
            <Textarea id="anotacoes_anteriores" {...register("anotacoes_anteriores")} rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nova_anotacao">Nova Anotação</Label>
            <Textarea id="nova_anotacao" {...register("nova_anotacao")} rows={4} />
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
          {isSubmitting ? "Salvando..." : client ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}