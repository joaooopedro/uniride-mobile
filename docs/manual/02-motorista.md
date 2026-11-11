# Motorista

Este guia mostra como cadastrar o veículo, oferecer carona, responder pedidos de vaga e acompanhar suas rotas no UniRide.

> As capturas de tela deste fluxo devem ser feitas no simulador ou em um aparelho com a fonte Manrope carregada e salvas em `docs/manual/img/`. Os espaços abaixo indicam onde adicioná-las depois da validação visual.

## 1. Virar motorista

1. Na tela inicial, escolha **Sou motorista** e entre com sua conta.
2. Na primeira vez, o app pede os dados do carro. Os passageiros veem o carro e a placa antes de embarcar.
3. Em **Veículo**, digite a placa. Ela aparece desenhada como placa Mercosul enquanto você digita. Aceita `ABC-1234` e `ABC1D23`.
4. Preencha marca, modelo e cor.
5. Em **Lugares para passageiros**, toque em um número de 1 a 6.
6. Em **Documento**, digite a validade da CNH no formato dd/mm/aaaa. CNH vencida não é aceita.
7. Em **Pagamento**, informe sua chave PIX.
8. Toque em **Salvar veículo**. Se algum campo estiver errado, a mensagem aparece logo abaixo dele.

Se quiser só pegar carona, toque em **Entrar como passageiro**.

![Cadastro do motorista com prévia da placa](img/02-cadastro-motorista.png)

## 2. Oferecer carona

Abra a aba **Oferecer**. O formulário tem 4 etapas. A barra no topo acende cada etapa quando ela está completa.

### 2.1 Ponto de encontro pelo CEP

1. Digite o CEP. Com os 8 números, o app preenche rua e bairro.
2. Confira e corrija rua e bairro se precisar. Os campos continuam editáveis.
3. Informe o número e uma referência, como "em frente à padaria".
4. Se o CEP não existir ou faltar internet, a mensagem aparece no campo. Digite o endereço à mão e continue.

![CEP preenchendo rua e bairro](img/02-oferecer-cep.png)

### 2.2 Ajustar o ponto no mapa

1. Depois do endereço, o mapa mostra o ponto de encontro.
2. Toque no mapa para mover o ponto para o lugar exato onde você vai esperar.
3. Se o endereço não for achado, a mensagem aparece abaixo do mapa. Marque o ponto tocando no mapa.

![Mapa com o ponto de encontro](img/02-oferecer-mapa.png)

### 2.3 Destino

Toque em **Campus Academia (Centro)** ou **Campus Estrela Sul**. O campus aparece no mapa.

### 2.4 Quando e feriado

1. Toque no dia da saída. A lista mostra os próximos 14 dias.
2. Digite o horário no formato HH:MM. A saída precisa ser daqui a pelo menos 5 minutos.
3. Se o dia for feriado, aparece uma faixa âmbar, como "15/11 é feriado (Proclamação da República). Pode não haver aula." O aviso não impede a publicação.

![Aviso de feriado](img/02-oferecer-feriado.png)

### 2.5 Rota e valor

1. Com o ponto marcado e o campus escolhido, o app traça a rota no mapa e mostra distância e tempo.
2. O valor sugerido aparece em destaque. Ele divide o custo da gasolina entre você e os passageiros.
3. Use os botões de menos e mais para ajustar de R$ 0,50 em R$ 0,50. O valor vai de R$ 0,00 a R$ 50,00.
4. Se você mudar o ponto ou o campus, a rota e a sugestão são recalculadas. Toque em **Usar sugestão** para voltar ao valor sugerido.

![Rota, distância e valor sugerido](img/02-oferecer-valor.png)

### 2.6 Vagas

Toque nos assentos para escolher quantas vagas oferecer. O máximo é o número de lugares do seu carro.

### 2.7 Publicar

1. O botão **Publicar carona** só acende com tudo preenchido e depois que o app termina de buscar o CEP, o endereço e a rota. Acima dele aparece o que ainda falta.
2. Toque em **Publicar carona**. O app confirma com "Carona publicada" e abre a aba **Rotas**.

## 3. Rascunho

1. O formulário é salvo no aparelho enquanto você preenche. O rascunho é só da sua conta. Se outra pessoa entrar no mesmo aparelho, ele é apagado.
2. Se fechar o app no meio, ao abrir a aba **Oferecer** de novo os dados voltam e aparece a faixa **Rascunho restaurado**.
3. Para começar do zero, toque em **Descartar rascunho**.

![Rascunho restaurado](img/02-rascunho.png)

## 4. Aceitar e recusar pedidos

1. Abra a aba **Pedidos**. A bolinha na aba mostra quantos pedidos esperam resposta.
2. Cada pedido mostra foto ou iniciais, nome, curso, nota como passageiro e a carona com dia e horário.
3. Toque em **Aceitar** para confirmar a vaga. O pedido sai da lista.
4. Toque em **Recusar** e confirme. O pedido sai da lista.
5. Se a carona já estiver lotada, o app recusa o pedido, avisa no topo e tira o pedido da lista.

![Pedidos de vaga](img/02-solicitacoes.png)

## 5. Minhas rotas

Abra a aba **Rotas**. As caronas ficam em **Próximas** e **Anteriores**. Cada cartão mostra horário, trajeto, vagas ocupadas, status e os passageiros aceitos. Puxe a lista para baixo para atualizar.

![Minhas rotas](img/02-rotas.png)

### 5.1 Iniciar e concluir

1. Na hora de sair, toque em **Iniciar viagem** e confirme. Os pedidos sem resposta são recusados e o status muda para **Em Andamento**.
2. Ao chegar, toque em **Concluir viagem** e confirme. Não dá para desfazer. O status muda para **Concluída** e a carona vai para **Anteriores**.
3. Toque em **Conversa** para falar com os passageiros.

### 5.2 Cancelar

1. Toque em **Cancelar** no cartão da carona.
2. Confirme em **Cancelar carona**. Os passageiros aceitos serão avisados.

![Confirmação de cancelamento](img/02-rota-cancelar.png)
