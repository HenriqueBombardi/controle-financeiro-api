import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { Transacao } from './schemas/transacao.schema';
import {
  calcularMetricas,
  MetricasFinanceiras,
} from './utils/calcular-metricas';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<Transacao>,
  ) {}

  /** Cadastra uma nova receita ou despesa */
  async criar(dto: CreateTransacaoDto) {
    const transacao = new this.transacaoModel(dto);
    return transacao.save();
  }

  /** Retorna o histórico completo + as métricas processadas no back-end */
  async listar(): Promise<{
    historico: Transacao[];
    metricas: MetricasFinanceiras;
  }> {
    // Mais recentes primeiro
    const historico = await this.transacaoModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const metricas = calcularMetricas(historico);

    return { historico, metricas };
  }
}
