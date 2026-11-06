# UniRide - Carona Universitária Solidária

Aplicativo móvel desenvolvido em **React Native / Expo** para a disciplina de **Desenvolvimento Móvel (2026-2)** no **UniAcademia**.

---

## Informações do Projeto
- **Instituição**: Centro Universitário Academia (UniAcademia)
- **Disciplina**: Desenvolvimento Móvel
- **Professor**: Romualdo Monteiro de Resende Costa
- **Etapa 1 (Telas e Componentes)**: Entrega em 08/10/2026 (20 Pontos) | Apresentações em 06 e 07/10/2026

---

## Proposta e Escopo

### Problema
Estudantes universitários enfrentam dificuldades diárias de locomoção em Juiz de Fora, dependendo de linhas de ônibus escassas em horários noturnos ou de transporte individual com alto custo de combustível.

### Solução
O **UniRide** conecta universitários que fazem rotas semelhantes até os campi da UniAcademia (Campus Academia / Centro e Campus Estrela Sul), permitindo combinar caronas solidárias, dividir custos de combustível de maneira justa e criar uma rede segura entre alunos verificados da mesma instituição.


## Dados de exemplo (seed)

Precisa do login do Firebase no computador (`npx firebase-tools login`, conta com acesso ao projeto `uniride-uniacademia`).

```bash
node scripts/limpar.js   # apaga as contas de exemplo e tudo que elas criaram
node scripts/seed.js     # cria 3 motoristas verificados e 6 caronas nos próximos dias em Juiz de Fora
```

Contas criadas: `ana.seed@uniride.app`, `bruno.seed@uniride.app`, `carla.seed@uniride.app`, senha `uniride2026` (troque com `SEED_SENHA=... node scripts/seed.js`). As caronas vencem em poucos dias: rode os dois comandos de novo no dia da apresentação.
