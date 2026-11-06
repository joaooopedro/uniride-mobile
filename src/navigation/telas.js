import { criarTelaPendente } from "../screens/provisorias/TelaPendente";
import {
  TelaCadastroMotoristaProvisoria,
  TelaCadastroProvisoria,
  TelaEntradaProvisoria,
  TelaEsqueciSenhaProvisoria,
  TelaLoginProvisoria,
  TelaVerificarEmailProvisoria,
} from "../screens/provisorias/TelasAcesso";
import TelaBuscarCaronas from "../screens/TelaBuscarCaronas";
import TelaAvaliacoesSeguranca from "../screens/TelaAvaliacoesSeguranca";

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
  CadastroMotorista: TelaCadastroMotoristaProvisoria,
  Oferecer: pendente("Oferecer carona", 30, "Gabriel", "Formulário com CEP, mapa, feriado, rota e valor sugerido."),
  Rotas: pendente("Minhas rotas", 30, "Gabriel", "Próximas e anteriores, com iniciar, concluir e cancelar."),
  Solicitacoes: pendente("Solicitações", 30, "Gabriel", "Pedidos de vaga para aceitar ou recusar."),
  // Passageiro (issue #29, Caio)
  Buscar: TelaBuscarCaronas,
  // Detalhes, avaliação e perfil (issue #31, Nicolas)
  DetalhesCarona: pendente("Detalhes da carona", 31, "Nicolas", "Mapa, rota, clima, motorista e ações da reserva."),
  AvaliarViagem: pendente("Avaliar viagem", 31, "Nicolas", "Estrelas e comentário depois da viagem concluída."),
  Avaliacoes: TelaAvaliacoesSeguranca,
  Perfil: pendente("Perfil", 31, "Nicolas", "Dados pessoais e veículo editáveis."),
  // Comunicação (issue #32, Jonathan)
  Reservas: pendente("Minhas reservas", 32, "Jonathan", "Próximas e histórico, com status e ações."),
  Conversas: pendente("Conversas", 32, "Jonathan", "Uma conversa por carona, com mensagens não lidas."),
  Conversa: pendente("Conversa", 32, "Jonathan", "Chat da carona com avisos rápidos."),
};
