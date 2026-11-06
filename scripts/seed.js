// Cria motoristas de exemplo e caronas nos próximos dias em Juiz de Fora.
// Uso: node scripts/seed.js   (rode scripts/limpar.js antes para recomeçar do zero)
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const { getFirestore, doc, collection, writeBatch, serverTimestamp, Timestamp, terminate } = require("firebase/firestore");
const { CONFIG, IDENTIDADE, SENHA, MOTORISTAS, PASSAGEIROS, admin, uidPorEmail } = require("./admin");

const CAMPI = {
  academia: { nome: "Campus Academia (Centro)", lat: -21.7612, lng: -43.3496 },
  estrela: { nome: "Campus Estrela Sul", lat: -21.7774, lng: -43.3711 },
};

// Pontos de encontro reais em bairros de Juiz de Fora.
const ORIGENS = [
  { cep: "36026-000", rua: "Avenida Presidente Itamar Franco", bairro: "São Mateus", ponto: "Em frente à padaria da esquina com a Rua São Mateus", lat: -21.7709, lng: -43.3567, campus: "estrela", hora: 7, valor: 500 },
  { cep: "36036-000", rua: "Avenida Barão do Rio Branco", bairro: "Alto dos Passos", ponto: "Ponto de ônibus do Hospital Monte Sinai", lat: -21.7738, lng: -43.3461, campus: "academia", hora: 18, valor: 400 },
  { cep: "36083-000", rua: "Avenida Juiz de Fora", bairro: "Granbery", ponto: "Portão do Colégio Granbery", lat: -21.7680, lng: -43.3530, campus: "estrela", hora: 13, valor: 450 },
  { cep: "36047-000", rua: "Avenida Deusdedith Salgado", bairro: "Salvaterra", ponto: "Entrada do condomínio Spina Ville", lat: -21.8038, lng: -43.3655, campus: "estrela", hora: 7, valor: 600 },
  { cep: "36015-000", rua: "Avenida Rio Branco", bairro: "Centro", ponto: "Parque Halfeld, lado da Rua Halfeld", lat: -21.7600, lng: -43.3470, campus: "estrela", hora: 18, valor: 500 },
  { cep: "36033-000", rua: "Rua Benjamin Constant", bairro: "Santa Helena", ponto: "Praça da Igreja de Santa Helena", lat: -21.7524, lng: -43.3610, campus: "academia", hora: 18, valor: 400 },
];

function saidaEm(diasAFrente, hora) {
  const data = new Date();
  data.setDate(data.getDate() + diasAFrente);
  data.setHours(hora, hora === 7 ? 10 : 20, 0, 0);
  return data;
}

async function contaVerificada(auth, m) {
  let uid = await uidPorEmail(m.email);
  if (!uid) uid = (await createUserWithEmailAndPassword(auth, m.email, SENHA)).user.uid;
  await admin(`${IDENTIDADE}/accounts:update`, "POST", { localId: uid, emailVerified: true });
  await signOut(auth);
  const { user } = await signInWithEmailAndPassword(auth, m.email, SENHA);
  await user.getIdToken(true);
  return uid;
}

async function main() {
  for (const [i, m] of MOTORISTAS.entries()) {
    const app = initializeApp(CONFIG, `seed-${i}`);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const uid = await contaVerificada(auth, m);

    const perfil = writeBatch(db);
    perfil.set(doc(db, "usuarios", uid), {
      nome: m.nome, curso: m.curso, periodo: m.periodo, fotoBase64: null, ehMotorista: false, motorista: null,
      notaMotorista: { soma: 0, total: 0 }, notaPassageiro: { soma: 0, total: 0 }, viagens: 0,
      criadoEm: serverTimestamp(), atualizadoEm: serverTimestamp(),
    });
    perfil.set(doc(db, "usuarios", uid, "privado", "dados"), {
      email: m.email, matricula: `2024${String(i + 1).padStart(4, "0")}`, telefone: `(32) 9988${i}-12${i}${i}`,
      chavePix: m.email, atualizadoEm: serverTimestamp(),
    });
    await perfil.commit().catch(() => {}); // perfil já existe: segue
    const motorista = writeBatch(db);
    motorista.update(doc(db, "usuarios", uid), {
      ehMotorista: true, motorista: { veiculo: m.veiculo, lugares: m.lugares, cnhValidade: "2030-12-31" }, atualizadoEm: serverTimestamp(),
    });
    await motorista.commit();

    // Duas caronas por motorista, nos próximos três dias.
    for (const [j, o] of ORIGENS.slice(i * 2, i * 2 + 2).entries()) {
      const campus = CAMPI[o.campus];
      const ref = doc(collection(db, "caronas"));
      const lote = writeBatch(db);
      lote.set(ref, {
        motoristaId: uid,
        motorista: { nome: m.nome, curso: `${m.curso}, ${m.periodo}º período`, nota: 0, fotoBase64: null, veiculo: m.veiculo },
        origem: { cep: o.cep, rua: o.rua, numero: "", bairro: o.bairro, ponto: o.ponto, lat: o.lat, lng: o.lng },
        campusDestino: campus.nome,
        destino: { lat: campus.lat, lng: campus.lng },
        saidaEm: Timestamp.fromDate(saidaEm(j + 1 + (i % 2), o.hora)),
        vagasTotais: m.lugares - 1,
        vagasRestantes: m.lugares - 1,
        valorCentavos: o.valor,
        rota: null,
        participantes: [uid],
        passageirosAceitos: [],
        status: "aberta",
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      });
      lote.set(doc(db, "caronas", ref.id, "privado", "contato"), {
        motoristaId: uid, telefone: `(32) 9988${i}-12${i}${i}`, chavePix: m.email,
      });
      await lote.commit();
    }
    console.log(`${m.nome} (${m.email}): perfil de motorista e 2 caronas`);
    await terminate(db);
  }
  for (const [i, p] of PASSAGEIROS.entries()) {
    const app = initializeApp(CONFIG, `seed-p${i}`);
    const db = getFirestore(app);
    const uid = await contaVerificada(getAuth(app), p);
    const perfil = writeBatch(db);
    perfil.set(doc(db, "usuarios", uid), {
      nome: p.nome, curso: p.curso, periodo: p.periodo, fotoBase64: null, ehMotorista: false, motorista: null,
      notaMotorista: { soma: 0, total: 0 }, notaPassageiro: { soma: 0, total: 0 }, viagens: 0,
      criadoEm: serverTimestamp(), atualizadoEm: serverTimestamp(),
    });
    perfil.set(doc(db, "usuarios", uid, "privado", "dados"), {
      email: p.email, matricula: `2025${String(i + 1).padStart(4, "0")}`, telefone: `(32) 9977${i}-34${i}${i}`,
      chavePix: null, atualizadoEm: serverTimestamp(),
    });
    await perfil.commit().catch(() => {}); // perfil já existe: segue
    console.log(`${p.nome} (${p.email}): passageiro`);
    await terminate(db);
  }
  console.log(`\nSenha das contas de exemplo: ${SENHA}`);
  process.exit(0);
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
