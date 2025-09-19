import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useClientStore } from "@/stores/clientStore";
import { useEffect, useState } from "react";

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

interface PerdCompTableProps {
  perdcomps: PerdComp[];
  onEdit: (perdcomp: PerdComp) => void;
  onView: (perdcomp: PerdComp) => void;
}

export default function PerdCompTable({ perdcomps, onEdit, onView }: PerdCompTableProps) {
  const { deletePerdComp } = usePerdCompStore();
  const { clients, fetchClients } = useClientStore();
  const [clientMap, setClientMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (clients.length === 0) {
      fetchClients();
    }
  }, []);

  useEffect(() => {
    const map: Record<string, string> = {};
    clients.forEach(client => {
      map[client.id] = client.razao_social;
    });
    setClientMap(map);
  }, [clients]);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este PER/DCOMP?")) {
      await deletePerdComp(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado": return "default";
      case "Recusado": return "destructive";
      case "Em Análise": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Imposto</TableHead>
            <TableHead>Competência</TableHead>
            <TableHead>Valor Solicitado</TableHead>
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
              <TableRow 
                key={perdcomp.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onView(perdcomp)}
              >
                <TableCell className="font-mono text-sm">
                  {perdcomp.numero}
                </TableCell>
                <TableCell className="font-medium">
                  {clientMap[perdcomp.client_id] || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{perdcomp.imposto}</Badge>
                </TableCell>
                <TableCell>{perdcomp.competencia}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(perdcomp.valor_solicitado)}
                </TableCell>
                <TableCell>
                  {formatCurrency(perdcomp.valor_recebido)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(perdcomp.status)}>
                    {perdcomp.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {perdcomp.data_transmissao ? formatDate(perdcomp.data_transmissao) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onView(perdcomp);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit(perdcomp);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(perdcomp.id);
                        }}
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