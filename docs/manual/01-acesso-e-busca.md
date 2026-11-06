# Acesso e busca de caronas

Este guia cobre a instalação, criação e confirmação da conta, recuperação de senha e busca de caronas no UniRide.

> As capturas de tela deste fluxo devem ser feitas no simulador ou em um aparelho com a fonte Manrope carregada e salvas em `docs/manual/img/`. Este checkout não tem capturas de aparelho; os espaços abaixo indicam onde adicioná-las depois da validação visual.

## 1. Instalar o app

1. Instale o Node.js e as dependências do projeto com `npm install`.
2. Inicie o Expo com `npx expo start`.
3. Abra o app no Expo Go na mesma rede ou em um simulador iOS/Android.

![Tela de boas-vindas do UniRide](img/01-entrada.png)

## 2. Criar uma conta

1. Na tela inicial, escolha **Sou passageiro** ou **Sou motorista**.
2. Na tela de entrada, toque em **Criar conta**.
3. Preencha nome, e-mail institucional, matrícula, curso, período, telefone e senha. Confirme a senha e aceite as regras de segurança.
4. Toque em **Criar conta**. O app envia um link de confirmação para o e-mail.

![Formulário de criação da conta](img/02-cadastro.png)

## 3. Confirmar o e-mail

1. Abra a mensagem recebida e toque no link de confirmação. Confira também a pasta de spam.
2. Volte ao UniRide e toque em **Já confirmei**.
3. Se a confirmação ainda não tiver sido atualizada, abra o link e tente novamente. Para receber outra mensagem, toque em **Reenviar e-mail** e aguarde o contador de 60 segundos.

![Confirmação do e-mail](img/03-verificar-email.png)

## 4. Entrar ou recuperar a senha

1. Na tela inicial, selecione seu papel e informe e-mail e senha. O botão de olho alterna a visualização da senha.
2. Se não lembrar a senha, escolha **Esqueci minha senha**, informe seu e-mail e toque em **Enviar link**.
3. Confira a caixa de entrada e o spam. Use o link recebido para criar outra senha e volte à tela de login.

![Tela de login](img/04-login.png)

## 5. Buscar e filtrar caronas

1. Entre como passageiro e abra a aba **Buscar**.
2. Digite um bairro ou rua de origem.
3. Escolha um campus, um turno (manhã, tarde ou noite) e, se quiser, informe o preço máximo em reais. Os filtros são aplicados juntos.
4. Puxe a lista para baixo para atualizar. Caronas sem lugares aparecem como **Lotada**.
5. Toque em uma opção para abrir os detalhes. Se nenhum resultado aparecer, toque em **Limpar filtros** ou ajuste os critérios.

![Busca de caronas em lista](img/05-busca-lista.png)

## 6. Usar o mapa

1. Na busca, toque em **Mapa**.
2. Toque em um ponto para ver o resumo da carona selecionada.
3. Toque em **Ver detalhes** para abrir a carona. O mapa precisa de conexão com a internet para carregar o fundo cartográfico.

![Busca de caronas no mapa](img/06-busca-mapa.png)

## Contas de demonstração

Use as contas fornecidas pela equipe para navegar sem cadastrar outro usuário. A senha de ambas é `uniride2026`.

| Papel | E-mail |
| --- | --- |
| Motorista | `motorista@uniride.app` |
| Passageiro | `passageiro@uniride.app` |

Para comparar os dois lados, entre como motorista em um aparelho e passageiro em outro. Se as caronas de demonstração expirarem, peça à equipe para executar o seed novamente. Não altere a senha das contas de teste.
