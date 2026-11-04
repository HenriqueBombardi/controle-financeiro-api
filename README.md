# 💰 Controle Financeiro Pessoal — API

API RESTful construída com **NestJS** e **MongoDB (Atlas)** para registrar receitas e despesas e devolver métricas que ajudam a pessoa a entender para onde o dinheiro está indo.

O projeto tem viés social e extensionista e pode ser usado como apoio em oficinas comunitárias de letramento financeiro, alinhado aos:

- **ODS 1** — Erradicação da pobreza
- **ODS 12** — Consumo e produção responsáveis (o campo `consumoConsciente` ajuda a identificar gastos por impulso)

## Tecnologias

- [NestJS 11](https://nestjs.com/) + TypeScript
- [MongoDB Atlas](https://www.mongodb.com/atlas) com [`@nestjs/mongoose`](https://docs.nestjs.com/techniques/mongodb)
- `class-validator` / `class-transformer` para validação dos dados
- `@nestjs/config` para variáveis de ambiente

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior (`node -v`)
- Uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

## Configurando o MongoDB Atlas

1. Crie um cluster gratuito (**M0**).
2. Em **Database Access**, crie um usuário e uma senha para o banco.
3. Em **Network Access**, clique em **Add IP Address** e libere o seu IP (ou `0.0.0.0/0` apenas para testes).
4. Em **Database → Connect → Drivers**, copie a *connection string*.

> Se a senha tiver caracteres especiais (`@`, `:`, `/`, `#`...), eles precisam estar codificados na URL (ex.: `@` vira `%40`).

## Instalação e execução

```bash
# 1. Instale as dependências
npm install

# 2. Crie o arquivo de ambiente a partir do exemplo
cp .env.example .env        # Windows (cmd): copy .env.example .env

# 3. Edite o .env e cole a sua string de conexão em MONGODB_URI
#    Ex.: mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/controle-financeiro?retryWrites=true&w=majority

# 4. Rode em modo desenvolvimento (recarrega ao salvar)
npm run start:dev
```

A API sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

Para gerar e rodar a versão de produção:

```bash
npm run build
npm run start:prod
```

## Endpoints

### `POST /transacoes` — cadastrar receita ou despesa

**Corpo (JSON):**

| Campo               | Tipo    | Obrigatório | Descrição                                                         |
| ------------------- | ------- | ----------- | ----------------------------------------------------------------- |
| `descricao`         | string  | sim         | Ex.: "Conta de Luz"                                               |
| `valor`             | number  | sim         | Maior que zero, até 2 casas decimais                              |
| `tipo`              | string  | sim         | Somente `"receita"` ou `"despesa"`                                |
| `categoria`         | string  | sim         | Ex.: "Moradia", "Alimentação", "Lazer", "Educação"                |
| `consumoConsciente` | boolean | não         | `true` = essencial/planejado, `false` = impulso. Padrão: `true`   |

**Exemplo:**

```json
{
  "descricao": "Pedido de delivery",
  "valor": 65.9,
  "tipo": "despesa",
  "categoria": "Alimentação",
  "consumoConsciente": false
}
```

**Resposta `201 Created`:** a transação salva (com `_id`, `createdAt` e `updatedAt`).

Dados inválidos retornam `400 Bad Request` com a lista de erros, por exemplo quando `tipo` não é `"receita"` nem `"despesa"`.

### `GET /transacoes` — histórico + métricas

Retorna o histórico (mais recentes primeiro) e as métricas calculadas no back-end:

```json
{
  "historico": [
    {
      "_id": "6650f1c2a1b2c3d4e5f60004",
      "descricao": "Supermercado",
      "valor": 420,
      "tipo": "despesa",
      "categoria": "Alimentação",
      "consumoConsciente": true,
      "createdAt": "2026-11-03T14:10:00.000Z",
      "updatedAt": "2026-11-03T14:10:00.000Z"
    }
  ],
  "metricas": {
    "saldoTotal": 1833.6,
    "totalDespesas": 666.4,
    "totalGastoImpulso": 65.9
  }
}
```

| Métrica             | Como é calculada                                                |
| ------------------- | --------------------------------------------------------------- |
| `saldoTotal`        | soma das receitas − soma das despesas                           |
| `totalDespesas`     | soma de todas as transações do tipo `"despesa"`                 |
| `totalGastoImpulso` | soma das despesas em que `consumoConsciente` é `false`          |

> O exemplo acima considera: receita de R$ 2.500,00 e despesas de R$ 180,50 (luz), R$ 65,90 (delivery, impulso) e R$ 420,00 (supermercado).

## Testando a API

Use o **Postman**, **Insomnia** ou a extensão **Thunder Client** (VS Code), ou o `curl` (Linux, macOS ou Git Bash):

```bash
# Cadastrar uma receita
curl -X POST http://localhost:3000/transacoes \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Salário","valor":2500,"tipo":"receita","categoria":"Trabalho"}'

# Cadastrar uma despesa essencial
curl -X POST http://localhost:3000/transacoes \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Conta de Luz","valor":180.50,"tipo":"despesa","categoria":"Moradia","consumoConsciente":true}'

# Cadastrar uma despesa por impulso
curl -X POST http://localhost:3000/transacoes \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Pedido de delivery","valor":65.90,"tipo":"despesa","categoria":"Alimentação","consumoConsciente":false}'

# Consultar histórico e métricas
curl http://localhost:3000/transacoes
```

## Estrutura do projeto

```
controle-financeiro-api/
├── src/
│   ├── main.ts                          # Inicialização (ValidationPipe, CORS, porta)
│   ├── app.module.ts                    # Módulo raiz + conexão com o MongoDB
│   └── transacoes/
│       ├── transacoes.module.ts
│       ├── transacoes.controller.ts     # Rotas POST e GET /transacoes
│       ├── transacoes.service.ts        # Regras de negócio e acesso ao banco
│       ├── dto/create-transacao.dto.ts  # Validação do corpo da requisição
│       ├── enums/tipo-transacao.enum.ts # "receita" | "despesa"
│       ├── schemas/transacao.schema.ts  # Schema Mongoose "Transacao"
│       └── utils/calcular-metricas.ts   # Cálculo de saldoTotal, totalDespesas, totalGastoImpulso
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## 🔒 Segurança

O arquivo `.env` contém a senha do seu banco e **nunca** deve ser enviado ao GitHub — ele já está listado no `.gitignore`. Compartilhe apenas o `.env.example`, que não tem dados reais.
