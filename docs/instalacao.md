# Instalação nos celulares do grupo

O app é instalado direto do Mac, sem loja. iPhone pelo Xcode com conta Apple gratuita; Android por APK.

## Antes de tudo (no Mac)

1. Clonar o repositório **fora do iCloud Drive** (por exemplo em `~/Developer/uniride-mobile`). O iCloud duplica arquivos dentro de `node_modules` e `ios/` (`arquivo 2.js`) e quebra o build.
2. `npm ci`
3. Conferir que `npm test` passa.

## iPhone

Feito uma vez por aparelho, com o iPhone no cabo.

1. No Mac: `npx expo prebuild -p ios --clean` e abrir `ios/UniRide.xcworkspace` no Xcode.
2. Xcode > Settings > Accounts: entrar com o Apple ID do João (conta gratuita aparece como **Personal Team**).
3. No alvo **UniRide**, aba **Signing & Capabilities**: marcar *Automatically manage signing*, escolher o Personal Team. Se o Xcode reclamar do bundle id, trocar `com.joaooopedro.uniride` por um único, como `br.uniacademia.uniride.joao` (e repetir a troca no `app.json` para o próximo prebuild).
4. Product > Scheme > Edit Scheme > Run > **Build Configuration: Release**. Assim o JavaScript vai dentro do app e ele abre sem o Mac ligado.
5. No iPhone: Ajustes > Privacidade e Segurança > **Modo de Desenvolvedor** > ligar e reiniciar quando pedir.
6. Escolher o iPhone como destino no Xcode e apertar Run (Cmd+R).
7. Na primeira abertura o iPhone bloqueia: Ajustes > Geral > **VPN e Gerenciamento de Dispositivos** > o Apple ID do João > **Confiar**.
8. Abrir o UniRide, aceitar os avisos e fazer login.

Limites da conta gratuita:
- **O app vence 7 dias depois de instalado.** Reinstalar todos os iPhones em **17/11**, para valer até 24/11 e cobrir as apresentações de 18 e 19/11. Reinstalar é só repetir o passo 6 com o cabo.
- No máximo 3 apps de desenvolvedor por iPhone.
- Sem push remoto: os avisos do app são notificações locais, disparadas enquanto ele está aberto ou recém minimizado.

## Android

1. No Mac (precisa do Android SDK e de um JDK): `npx expo prebuild -p android --clean`
2. `cd android && ./gradlew assembleRelease`
3. O APK sai em `android/app/build/outputs/apk/release/app-release.apk`. Mandar o arquivo para o colega (Drive ou WhatsApp como documento).
4. No Android: abrir o arquivo, permitir **instalar apps desconhecidos** para o app que abriu o APK e instalar. Não expira.

O APK é assinado com a chave de depuração gerada pelo prebuild. A impressão SHA-1 dela (`5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`) já está cadastrada no app Android do Firebase, o que libera o "Entrar com Google". Se a chave mudar, pegar a nova com:

```bash
keytool -list -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey | grep SHA1
```

e cadastrar no console do Firebase (Configurações do projeto > Seus apps > UniRide Android > Adicionar impressão digital).

## Conferência depois de instalar

- Ícone e nome UniRide na tela inicial; splash com o logo ao abrir.
- Login com e-mail e senha funciona; fechar e abrir mantém a sessão.
- Anotar a data de instalação de cada iPhone.
