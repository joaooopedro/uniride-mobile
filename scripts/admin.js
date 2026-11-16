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
  { email: "jonathan@uniride.app", nome: "Jonathan Delmonte", curso: "Ciência da Computação", periodo: 5, veiculo: { marca: "Fiat", modelo: "Argo", cor: "Prata", placa: "QPX4F21" }, lugares: 4 },
  { email: "gabriel@uniride.app", nome: "Gabriel Caputo Morais", curso: "Ciência da Computação", periodo: 5, veiculo: { marca: "Volkswagen", modelo: "Gol", cor: "Branco", placa: "HMT2389" }, lugares: 3 },
  { email: "joao.motorista@uniride.app", nome: "João Pedro Silva de Almeida", curso: "Ciência da Computação", periodo: 5, veiculo: { marca: "Hyundai", modelo: "HB20", cor: "Azul", placa: "RVB7C04" }, lugares: 4 },
];
// Passageiros: pedir vaga, chat e avaliação.
const PASSAGEIROS = [
  { email: "caio@uniride.app", nome: "Caio Soranço Castilho", curso: "Ciência da Computação", periodo: 5 },
  { email: "nicolas@uniride.app", nome: "Nicolas Isaac Pinto de Jesus", curso: "Ciência da Computação", periodo: 5 },
  { email: "joao.passageiro@uniride.app", nome: "João Pedro Silva de Almeida", curso: "Ciência da Computação", periodo: 5 },
];

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
