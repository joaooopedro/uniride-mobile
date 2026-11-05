import { soDigitos } from "./formato";

// Cada função devolve null quando o valor é válido ou a mensagem de erro pronta para a tela.

export function validarEmail(email = "") {
  const valor = email.trim();
  if (!valor) return "Informe o e-mail.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return "E-mail inválido.";
  return null;
}

export function validarSenha(senha = "") {
  if (!senha) return "Informe a senha.";
  if (senha.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
  if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha))
    return "Use letras e números na senha.";
  return null;
}

export function validarNome(nome = "") {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "Informe o nome.";
  if (partes.length < 2) return "Informe nome e sobrenome.";
  if (nome.trim().length > 80) return "Nome muito longo.";
  return null;
}

export function validarMatricula(matricula = "") {
  const digitos = soDigitos(matricula);
  if (!digitos) return "Informe a matrícula.";
  if (digitos.length < 6 || digitos.length > 12)
    return "A matrícula tem entre 6 e 12 números.";
  return null;
}

export function validarTelefone(telefone = "") {
  const digitos = soDigitos(telefone);
  if (!digitos) return "Informe o telefone.";
  if (digitos.length !== 11 || digitos[2] !== "9")
    return "Use um celular com DDD, como (32) 99999-9999.";
  return null;
}

export function validarCep(cep = "") {
  const digitos = soDigitos(cep);
  if (!digitos) return "Informe o CEP.";
  if (digitos.length !== 8) return "O CEP tem 8 números.";
  return null;
}

export function validarPlaca(placa = "") {
  const limpo = String(placa).toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!limpo) return "Informe a placa.";
  if (!/^[A-Z]{3}\d{4}$/.test(limpo) && !/^[A-Z]{3}\d[A-Z]\d{2}$/.test(limpo))
    return "Placa inválida. Use ABC-1234 ou ABC1D23.";
  return null;
}

export function validarCnhValidade(data) {
  if (!data) return "Informe a validade da CNH.";
  const validade = data instanceof Date ? data : new Date(data);
  if (Number.isNaN(validade.getTime())) return "Data inválida.";
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (validade < hoje) return "A CNH está vencida.";
  return null;
}

export function validarTextoObrigatorio(texto = "", rotulo = "Campo", maximo = 120) {
  const valor = String(texto).trim();
  if (!valor) return `${rotulo} é obrigatório.`;
  if (valor.length > maximo) return `${rotulo} pode ter até ${maximo} caracteres.`;
  return null;
}

export function validarSaida(data) {
  if (!data) return "Informe data e hora de saída.";
  if (data.getTime() < Date.now() + 5 * 60 * 1000)
    return "A saída precisa ser daqui a pelo menos 5 minutos.";
  if (data.getTime() > Date.now() + 60 * 24 * 60 * 60 * 1000)
    return "Ofereça caronas com até 60 dias de antecedência.";
  return null;
}
