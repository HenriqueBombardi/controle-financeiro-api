import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { TransacoesService } from './transacoes.service';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  // POST /transacoes
  @Post()
  criar(@Body() dto: CreateTransacaoDto) {
    return this.transacoesService.criar(dto);
  }

  // GET /transacoes
  @Get()
  listar() {
    return this.transacoesService.listar();
  }
}
