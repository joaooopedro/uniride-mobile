# Manual 04: chat e reservas

Responsável: Jonathan Delmonte. Telas desta parte: Minhas reservas, Conversas e Conversa.

Os prints ficam em `docs/manual/img/`. Cada seção indica o nome do arquivo esperado.

## 1. Acompanhar suas reservas

No modo passageiro, toque na aba **Reservas**. O topo mostra quantas reservas você tem para os próximos dias.

A tela tem duas partes:

- **Próximas**: pedidos que esperam resposta do motorista e vagas já aceitas, da saída mais próxima para a mais distante.
- **Histórico**: viagens concluídas, canceladas e pedidos recusados, da mais recente para a mais antiga.

Cada reserva mostra o horário de saída em destaque, a data, o valor, o bairro e o ponto de encontro, o campus de destino, o motorista e o carro.

Puxe a lista para baixo para atualizar.

Print: `04-reservas.png`

### Se a lista estiver vazia ou der erro

- Sem nenhuma reserva, aparece "Você ainda não reservou carona" com o botão **Buscar caronas**, que leva para a aba Buscar.
- Se faltar internet ou o banco não responder, aparece a mensagem do erro e o botão **Tentar de novo**.

Print: `04-reservas-vazio.png`

## 2. Entender os status

O status aparece ao lado do valor, com ícone e cor.

| Status | Ícone | O que quer dizer |
|---|---|---|
| Solicitada | relógio âmbar | Você pediu a vaga e o motorista ainda não respondeu. |
| Aceita | check verde | A vaga é sua. A conversa da carona já está liberada. |
| Em andamento | seta verde-petróleo | O motorista iniciou a viagem. |
| Concluída | bandeira cinza | A viagem terminou. Se ainda não avaliou, aparece o botão Avaliar. |
| Recusada | x vermelho | O motorista não aceitou o pedido. Busque outra carona. |
| Cancelada | x vermelho | Você ou o motorista cancelou. |

## 3. Ações em cada reserva

Os botões mudam conforme o status:

- **Detalhes**: sempre aparece. Abre a carona com mapa, clima e contato.
- **Conversa**: só em reserva aceita. Abre o chat da carona.
- **Avaliar**: só em viagem concluída que você ainda não avaliou.

Print: `04-reservas-acoes.png`

## 4. Ver suas conversas

Toque na aba **Conversas** (passageiro ou motorista). Existe uma conversa por carona, com:

- o motorista (ou "Passageiros da sua carona", quando você é o motorista);
- o trajeto e o horário da carona;
- a última mensagem e a hora em que chegou;
- uma bolinha verde-petróleo com o número de mensagens não lidas.

O número na aba Conversas soma as não lidas de todas as caronas.

A conversa aparece quando você tem uma reserva aceita ou, como motorista, uma carona publicada.

Print: `04-conversas.png`

## 5. Conversar com o motorista ou com os passageiros

Toque numa conversa para abrir o chat.

1. No topo ficam o trajeto, o horário e o botão **Detalhes**, que abre a carona.
2. Suas mensagens ficam à direita, em azul. As dos outros ficam à esquerda, com o nome. O motorista aparece como "Nome, motorista".
3. As mensagens são separadas por dia: Hoje, Ontem ou a data.
4. Escreva no campo de baixo (até 500 caracteres) e toque no botão redondo de enviar. A mensagem aparece na hora, um pouco apagada até o envio terminar.
5. O botão de enviar fica desligado com o campo vazio ou enquanto uma mensagem está saindo.
6. Se o envio falhar, o texto volta para o campo e aparece o motivo logo acima. Toque em enviar de novo.

O chat rola sozinho para a última mensagem ao abrir e quando chega mensagem nova. Com o teclado aberto, o campo continua visível.

Ao abrir a conversa, as mensagens contam como lidas e a bolinha de não lidas some.

Print: `04-conversa.png`

## 6. Usar os avisos rápidos

Acima do campo de mensagem há uma linha de atalhos. Deslize para o lado para ver todos:

- Cheguei no ponto de encontro
- Atraso de 5 minutos, aguardem
- Estou saindo agora
- Trânsito pesado no caminho
- Chegamos na portaria do campus

Um toque envia o aviso para todos da carona, sem digitar. O aviso aparece no chat como um cartão verde-claro com ícone, diferente das mensagens comuns, para ninguém perder.

Print: `04-avisos-rapidos.png`
