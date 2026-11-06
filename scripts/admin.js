// Acesso de administrador para os scripts de seed e limpeza.
// Usa o login do firebase-tools (npx firebase-tools login), sem chave de serviço no repositório.
const { readFileSync } = require("node:fs");
const { homedir } = require("node:os");
const { execSync } = require("node:child_process");

const PROJETO = "uniride-uniacademia";
const CONFIG = {
  apiKey: "AIzaSyDze0q8oRr3XE0s2RdEF2tN456HMliXsW0",
  authDomain: `${PROJETO}.firebaseapp.com`,
  projectId: PROJETO,
};
const IDENTIDADE = `https://identitytoolkit.googleapis.com/v1/projects/${PROJETO}`;

// Contas de exemplo. Senha comum para a apresentação.
const SENHA = process.env.SEED_SENHA || "uniride2026";
const MOTORISTAS = [
  { email: "motorista@uniride.app", nome: "Ana Ribeiro", curso: "Engenharia Civil", periodo: 7, veiculo: { marca: "Fiat", modelo: "Argo", cor: "Prata", placa: "QPX4F21" }, lugares: 4 },
  { email: "bruno.seed@uniride.app", nome: "Bruno Almeida", curso: "Direito", periodo: 5, veiculo: { marca: "Volkswagen", modelo: "Gol", cor: "Branco", placa: "HMT2389" }, lugares: 3 },
  { email: "carla.seed@uniride.app", nome: "Carla Menezes", curso: "Psicologia", periodo: 3, veiculo: { marca: "Hyundai", modelo: "HB20", cor: "Azul", placa: "RVB7C04" }, lugares: 4 },
];
// Passageiros para testar o outro lado: pedir vaga, chat e avaliação.
const PASSAGEIROS = [{ email: "passageiro@uniride.app", nome: "Paulo Teixeira", curso: "Ciência da Computação", periodo: 4 }];

let token;
function tokenAdmin() {
  if (token) return token;
  // Qualquer comando do firebase-tools renova o token salvo.
  execSync(`npx -y firebase-tools@latest projects:list --json`, { stdio: "ignore", cwd: homedir() });
  const salvo = JSON.parse(readFileSync(`${homedir()}/.config/configstore/firebase-tools.json`, "utf8"));
  token = salvo.tokens.access_token;
  return token;
}

async function admin(url, metodo = "POST", corpo) {
  const resposta = await fetch(url, {
    method: metodo,
    headers: { Authorization: `Bearer ${tokenAdmin()}`, "x-goog-user-project": PROJETO, "Content-Type": "application/json" },
    body: corpo && JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(`${metodo} ${url}: ${resposta.status} ${await resposta.text()}`);
  return resposta.json();
}

async function uidPorEmail(email) {
  const { users } = await admin(`${IDENTIDADE}/accounts:lookup`, "POST", { email: [email] });
  return users?.[0]?.localId || null;
}

module.exports = { PROJETO, CONFIG, IDENTIDADE, SENHA, MOTORISTAS, PASSAGEIROS, admin, uidPorEmail };
