import { Edit, Trash2, Eye, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePerdCompStore } from "@/stores/perdcompStore";
import { PerdComp } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PerdCompTableProps {
  perdcomps: PerdComp[];
  onEdit: (perdcomp: PerdComp) => void;
}

export default function PerdCompTable({ perdcomps, onEdit }: PerdCompTableProps) {
  const { deletePerdComp } = usePerdCompStore();

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este PER/DCOMP?")) {
      await deletePerdComp(id);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tributo</TableHead>
            <TableHead>Competência</TableHead>
            <TableHead>Valor Pedido</TableHead>
            <TableHead>Valor Recebido</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transmissão</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perdcomps.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Nenhum PER/DCOMP encontrado
              </TableCell>
            </TableRow>
          ) : (
            perdcomps.map((perdcomp) => (
              <TableRow key={perdcomp.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm">
                  {perdcomp.nr_perdcomp}
                </TableCell>
                <TableCell className="font-medium">
                  {perdcomp.nome}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{perdcomp.tributo_pedido}</Badge>
                </TableCell>
                <TableCell>{perdcomp.competencia}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(perdcomp.valor_pedido)}
                </TableCell>
                <TableCell>
                  {formatCurrency(perdcomp.valor_recebido)}
                </TableCell>
                <TableCell>
                  {perdcomp.recebido ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Recebido
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <XCircle className="w-3 h-3 mr-1" />
                      Pendente
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(perdcomp.data_transmissao)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(perdcomp)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(perdcomp)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(perdcomp.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}