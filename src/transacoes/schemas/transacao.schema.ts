import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TipoTransacao } from '../enums/tipo-transacao.enum';

export type TransacaoDocument = HydratedDocument<Transacao>;

@Schema({ timestamps: true, collection: 'transacoes' })
export class Transacao {
  /** Ex.: "Conta de Luz", "Compra de Roupas" */
  @Prop({ type: String, required: true, trim: true })
  descricao: string;

  /** Valor monetário da transação (sempre positivo; o "tipo" define se entra ou sai) */
  @Prop({ type: Number, required: true, min: 0.01 })
  valor: number;

  /** Aceita apenas "receita" ou "despesa" */
  @Prop({
    type: String,
    required: true,
    enum: Object.values(TipoTransacao),
  })
  tipo: TipoTransacao;

  /** Ex.: "Moradia", "Alimentação", "Lazer", "Educação" */
  @Prop({ type: String, required: true, trim: true })
  categoria: string;

  /**
   * Marcador de consumo consciente (ODS 12):
   * true  = gasto essencial / planejado
   * false = gasto por impulso
   */
  @Prop({ type: Boolean, default: true })
  consumoConsciente: boolean;

  // Preenchidos automaticamente pelo Mongoose (timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

export const TransacaoSchema = SchemaFactory.createForClass(Transacao);
