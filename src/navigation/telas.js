import {
  TelaCadastroProvisoria,
  TelaEntradaProvisoria,
  TelaEsqueciSenhaProvisoria,
  TelaLoginProvisoria,
  TelaVerificarEmailProvisoria,
} from "../screens/provisorias/TelasAcesso";
import TelaBuscarCaronas from "../screens/TelaBuscarCaronas";
import TelaAvaliacoesSeguranca from "../screens/TelaAvaliacoesSeguranca";
import TelaAvaliarViagem from "../screens/TelaAvaliarViagem";
import TelaDetalhesCarona from "../screens/TelaDetalhesCarona";
import TelaPerfilUniversitario from "../screens/TelaPerfilUniversitario";
import TelaPagamento from "../screens/TelaPagamento";
import TelaCadastroMotorista from "../screens/motorista/TelaCadastroMotorista";
import TelaOferecerCarona from "../screens/motorista/TelaOferecerCarona";
import TelaMinhasRotas from "../screens/motorista/TelaMinhasRotas";
import TelaSolicitacoes from "../screens/motorista/TelaSolicitacoes";
import TelaCobranca from "../screens/motorista/TelaCobranca";
import TelaCombinar from "../screens/motorista/TelaCombinar";
import TelaPedirCarona from "../screens/TelaPedirCarona";
import TelaConversa from "../screens/comunicacao/TelaConversa";
import TelaConversas from "../screens/comunicacao/TelaConversas";
import TelaMinhasReservas from "../screens/comunicacao/TelaMinhasReservas";

// Mapa rota -> tela. Cada integrante troca a linha da sua tela quando ela ficar pronta.

export const TELAS = {
  // Acesso (issue #29, Caio)
  Entrada: TelaEntradaProvisoria,
  Login: TelaLoginProvisoria,
  Cadastro: TelaCadastroProvisoria,
  EsqueciSenha: TelaEsqueciSenhaProvisoria,
  VerificarEmail: TelaVerificarEmailProvisoria,
  // Motorista (issue #30, Gabriel)
  CadastroMotorista: TelaCadastroMotorista,
  Oferecer: TelaOferecerCarona,
  Rotas: TelaMinhasRotas,
  Solicitacoes: TelaSolicitacoes,
  Cobranca: TelaCobranca,
  Combinar: TelaCombinar,
  PedirCarona: TelaPedirCarona,
  // Passageiro (issue #29, Caio)
  Buscar: TelaBuscarCaronas,
  // Detalhes, avaliação e perfil (issue #31, Nicolas)
  DetalhesCarona: TelaDetalhesCarona,
  AvaliarViagem: TelaAvaliarViagem,
  Pagamento: TelaPagamento,
  Avaliacoes: TelaAvaliacoesSeguranca,
  Perfil: TelaPerfilUniversitario,
  // Comunicação (issue #32, Jonathan)
  Reservas: TelaMinhasReservas,
  Conversas: TelaConversas,
  Conversa: TelaConversa,
};
