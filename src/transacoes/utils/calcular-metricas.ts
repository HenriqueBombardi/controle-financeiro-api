import { TipoTransacao } from '../enums/tipo-transacao.enum';

export interface MetricasFinanceiras {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}

interface TransacaoParaCalculo {
  valor: number;
  tipo: string;
  consumoConsciente?: boolean;
}

// Evita resultados como 0.1 + 0.2 = 0.30000000000000004
const arredondar = (valor: number): number =>
  Math.round((valor + Number.EPSILON) * 100) / 100;

/**
 * Processa o histórico e devolve as métricas consolidadas:
 * - saldoTotal:        soma das receitas - soma das despesas
 * - totalDespesas:     soma de todas as despesas
 * - totalGastoImpulso: soma das despesas com consumoConsciente === false
 */
export function calcularMetricas(
  transacoes: TransacaoParaCalculo[],
): MetricasFinanceiras {
  let totalReceitas = 0;
  let totalDespesas = 0;
  let totalGastoImpulso = 0;

  for (const transacao of transacoes) {
    if (transacao.tipo === TipoTransacao.RECEITA) {
      totalReceitas += transacao.valor;
    } else if (transacao.tipo === TipoTransacao.DESPESA) {
      totalDespesas += transacao.valor;

      if (transacao.consumoConsciente === false) {
        totalGastoImpulso += transacao.valor;
      }
    }
  }

  return {
    saldoTotal: arredondar(totalReceitas - totalDespesas),
    totalDespesas: arredondar(totalDespesas),
    totalGastoImpulso: arredondar(totalGastoImpulso),
  };
}
