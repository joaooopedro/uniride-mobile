// Traduz códigos do Firebase para mensagens prontas para a tela.
const MENSAGENS = {
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/email-already-in-use": "Já existe uma conta com este e-mail. Entre ou recupere a senha.",
  "auth/weak-password": "Senha fraca. Use pelo menos 8 caracteres com letras e números.",
  "auth/too-many-requests": "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.",
  "auth/network-request-failed": "Sem conexão com a internet. Confira a rede e tente de novo.",
  "auth/user-disabled": "Esta conta foi desativada.",
  "auth/requires-recent-login": "Por segurança, entre de novo para fazer isso.",
  "auth/missing-email": "Informe o e-mail.",
  "auth/account-exists-with-different-credential": "Este e-mail já usa outra forma de entrada. Entre com e-mail e senha.",
  "permission-denied": "Você não tem permissão para fazer isso.",
  unavailable: "Sem conexão com o servidor. Tente de novo em instantes.",
  "deadline-exceeded": "O servidor demorou para responder. Tente de novo.",
  "not-found": "Registro não encontrado.",
  "failed-precondition": "Operação não permitida no estado atual.",
  "resource-exhausted": "Limite de uso atingido. Tente mais tarde.",
};

export function erroAmigavel(falha, padrao = "Algo deu errado. Tente de novo.") {
  if (!falha) return new Error(padrao);
  if (falha.amigavel) return falha;
  const codigo = String(falha.code || "").replace(/^firestore\//, "");
  const erro = new Error(MENSAGENS[codigo] || MENSAGENS[falha.code] || padrao);
  erro.code = falha.code;
  erro.amigavel = true;
  return erro;
}

// Erro de regra de negócio, já com texto para a tela.
export function erroNegocio(mensagem) {
  const erro = new Error(mensagem);
  erro.amigavel = true;
  return erro;
}
