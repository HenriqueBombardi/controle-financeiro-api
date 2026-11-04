import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TipoTransacao } from '../enums/tipo-transacao.enum';

export class CreateTransacaoDto {
  @IsString({ message: 'descricao deve ser um texto' })
  @IsNotEmpty({ message: 'descricao é obrigatória' })
  descricao: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'valor deve ser um número com no máximo 2 casas decimais' },
  )
  @IsPositive({ message: 'valor deve ser maior que zero' })
  valor: number;

  @IsEnum(TipoTransacao, { message: 'tipo deve ser "receita" ou "despesa"' })
  tipo: TipoTransacao;

  @IsString({ message: 'categoria deve ser um texto' })
  @IsNotEmpty({ message: 'categoria é obrigatória' })
  categoria: string;

  // Opcional. Se não for enviado, assume true (gasto consciente).
  @IsOptional()
  @IsBoolean({ message: 'consumoConsciente deve ser true ou false' })
  consumoConsciente?: boolean;
}
