import { criarTelaPendente } from "../screens/provisorias/TelaPendente";
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
import TelaCadastroMotorista from "../screens/motorista/TelaCadastroMotorista";
import TelaOferecerCarona from "../screens/motorista/TelaOferecerCarona";
import TelaMinhasRotas from "../screens/motorista/TelaMinhasRotas";
import TelaSolicitacoes from "../screens/motorista/TelaSolicitacoes";

// Mapa rota -> tela. Cada integrante troca a linha da sua tela quando ela ficar pronta.
const pendente = (titulo, issue, responsavel, descricao) =>
  criarTelaPendente({ titulo, issue, responsavel, descricao });

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
  // Passageiro (issue #29, Caio)
  Buscar: TelaBuscarCaronas,
  // Detalhes, avaliação e perfil (issue #31, Nicolas)
  DetalhesCarona: TelaDetalhesCarona,
  AvaliarViagem: TelaAvaliarViagem,
  Avaliacoes: TelaAvaliacoesSeguranca,
  Perfil: TelaPerfilUniversitario,
  // Comunicação (issue #32, Jonathan)
  Reservas: pendente("Minhas reservas", 32, "Jonathan", "Próximas e histórico, com status e ações."),
  Conversas: pendente("Conversas", 32, "Jonathan", "Uma conversa por carona, com mensagens não lidas."),
  Conversa: pendente("Conversa", 32, "Jonathan", "Chat da carona com avisos rápidos."),
};
