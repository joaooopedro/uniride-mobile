import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import {
  mascararPlaca,
  mascararTelefone,
  validarCnhValidade,
  validarEmail,
  validarMatricula,
  validarNome,
  validarPlaca,
  validarSenha,
  validarTelefone,
  validarTextoObrigatorio,
} from "../../utils";
import { Botao, Campo, Mensagem, Pagina, styles } from "./comum";

// Telas provisórias e funcionais de acesso. As definitivas são da issue #29 (Caio) e #30 (Gabriel).
const AVISO = "Tela provisória para testes. A versão final é da issue #29.";

export function TelaEntradaProvisoria({ navigation }) {
  return (
    <Pagina titulo="UniRide" aviso={AVISO}>
      <Text style={styles.texto}>Carona entre alunos da UniAcademia.</Text>
      <Botao titulo="Sou passageiro" onPress={() => navigation.navigate("Login", { modo: "passageiro" })} />
      <Botao titulo="Sou motorista" secundario onPress={() => navigation.navigate("Login", { modo: "motorista" })} />
    </Pagina>
  );
}

export function TelaLoginProvisoria({ navigation, route }) {
  const modo = route.params?.modo || "passageiro";
  const { entrar, definirModo, entrarComGoogle, googleDisponivel } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(acao) {
    setErro(null);
    setEnviando(true);
    try {
      await definirModo(modo);
      await acao();
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Pagina titulo={modo === "motorista" ? "Entrar como motorista" : "Entrar como passageiro"} aviso={AVISO}>
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="username" autoComplete="email" />
      <Campo rotulo="Senha" value={senha} onChangeText={setSenha} secureTextEntry textContentType="password" autoComplete="current-password" />
      <Mensagem texto={erro} />
      <Botao
        titulo="Entrar"
        carregando={enviando}
        onPress={() => {
          const invalido = validarEmail(email) || (!senha && "Informe a senha.");
          if (invalido) return setErro(invalido);
          return enviar(() => entrar({ email: email.trim(), senha }));
        }}
      />
      {googleDisponivel && <Botao titulo="Entrar com Google" secundario carregando={enviando} onPress={() => enviar(entrarComGoogle)} />}
      <Botao titulo="Criar conta" secundario onPress={() => navigation.navigate("Cadastro", { modo })} />
      <Botao titulo="Esqueci minha senha" secundario onPress={() => navigation.navigate("EsqueciSenha")} />
    </Pagina>
  );
}

export function TelaCadastroProvisoria({ route }) {
  const modo = route.params?.modo || "passageiro";
  const completar = !!route.params?.completar;
  const { usuario, cadastrar, completarPerfil, definirModo, sair } = useAuth();
  const [dados, setDados] = useState({ nome: "", email: usuario?.email || "", matricula: "", curso: "", periodo: "1", telefone: "", senha: "" });
  const [erros, setErros] = useState({});
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const mudar = (campo) => (valor) => setDados((atual) => ({ ...atual, [campo]: valor }));

  async function enviar() {
    const novos = {
      nome: validarNome(dados.nome),
      email: completar ? null : validarEmail(dados.email),
      matricula: validarMatricula(dados.matricula),
      curso: validarTextoObrigatorio(dados.curso, "Curso", 60),
      telefone: validarTelefone(dados.telefone),
      senha: completar ? null : validarSenha(dados.senha),
    };
    setErros(novos);
    if (Object.values(novos).some(Boolean)) return;
    setErro(null);
    setEnviando(true);
    try {
      await definirModo(modo || "passageiro");
      const periodo = Number(dados.periodo) || 1;
      if (completar) await completarPerfil({ ...dados, periodo });
      else await cadastrar({ ...dados, email: dados.email.trim(), periodo });
    } catch (falha) {
      setErro(falha.message);
      setEnviando(false);
    }
  }

  return (
    <Pagina titulo={completar ? "Complete seu cadastro" : "Criar conta"} aviso={AVISO}>
      <Campo rotulo="Nome completo" value={dados.nome} onChangeText={mudar("nome")} erro={erros.nome} textContentType="name" />
      {!completar && (
        <Campo rotulo="E-mail" value={dados.email} onChangeText={mudar("email")} erro={erros.email} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" />
      )}
      <Campo rotulo="Matrícula" value={dados.matricula} onChangeText={mudar("matricula")} erro={erros.matricula} keyboardType="number-pad" />
      <Campo rotulo="Curso" value={dados.curso} onChangeText={mudar("curso")} erro={erros.curso} />
      <Campo rotulo="Período" value={dados.periodo} onChangeText={mudar("periodo")} keyboardType="number-pad" />
      <Campo rotulo="Celular" value={dados.telefone} onChangeText={(v) => mudar("telefone")(mascararTelefone(v))} erro={erros.telefone} keyboardType="phone-pad" />
      {!completar && (
        <Campo rotulo="Senha" value={dados.senha} onChangeText={mudar("senha")} erro={erros.senha} secureTextEntry textContentType="newPassword" />
      )}
      <Mensagem texto={erro} />
      <Botao titulo={completar ? "Salvar e continuar" : "Criar conta"} carregando={enviando} onPress={enviar} />
      {completar && <Botao titulo="Sair" secundario onPress={sair} />}
    </Pagina>
  );
}

export function TelaEsqueciSenhaProvisoria() {
  const { redefinirSenha } = useAuth();
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState({});
  return (
    <Pagina titulo="Recuperar senha" aviso={AVISO}>
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Mensagem texto={estado.erro} />
      <Mensagem texto={estado.ok} tipo="sucesso" />
      <Botao
        titulo="Enviar link"
        carregando={estado.enviando}
        onPress={async () => {
          const invalido = validarEmail(email);
          if (invalido) return setEstado({ erro: invalido });
          setEstado({ enviando: true });
          try {
            await redefinirSenha(email.trim());
            setEstado({ ok: "Se o e-mail estiver cadastrado, o link chega em instantes. Confira também o spam." });
          } catch (falha) {
            setEstado({ erro: falha.message });
          }
          return undefined;
        }}
      />
    </Pagina>
  );
}

export function TelaVerificarEmailProvisoria() {
  const { usuario, reenviarVerificacao, atualizarVerificacao, sair } = useAuth();
  const [estado, setEstado] = useState({});
  const [espera, setEspera] = useState(0);

  useEffect(() => {
    if (!espera) return undefined;
    const id = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [espera]);

  return (
    <Pagina titulo="Confirme seu e-mail" aviso={AVISO}>
      <Text style={styles.texto}>Enviamos um link para {usuario?.email}. Abra o link e volte aqui.</Text>
      <Mensagem texto={estado.erro} />
      <Mensagem texto={estado.ok} tipo="sucesso" />
      <Botao
        titulo="Já confirmei"
        carregando={estado.enviando}
        onPress={async () => {
          setEstado({ enviando: true });
          try {
            const ok = await atualizarVerificacao();
            setEstado(ok ? {} : { erro: "Ainda não recebemos a confirmação. Abra o link do e-mail." });
          } catch (falha) {
            setEstado({ erro: falha.message });
          }
        }}
      />
      <Botao
        titulo={espera ? `Reenviar em ${espera} s` : "Reenviar e-mail"}
        secundario
        disabled={!!espera}
        onPress={async () => {
          try {
            await reenviarVerificacao();
            setEspera(60);
            setEstado({ ok: "E-mail reenviado." });
          } catch (falha) {
            setEstado({ erro: falha.message });
          }
        }}
      />
      <Botao titulo="Sair" secundario onPress={sair} />
    </Pagina>
  );
}

export function TelaCadastroMotoristaProvisoria() {
  const { salvarMotorista, definirModo } = useAuth();
  const [dados, setDados] = useState({ marca: "", modelo: "", cor: "", placa: "", lugares: "3", cnhValidade: "", chavePix: "" });
  const [erros, setErros] = useState({});
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const mudar = (campo) => (valor) => setDados((atual) => ({ ...atual, [campo]: valor }));

  async function enviar() {
    const [dia, mes, ano] = dados.cnhValidade.split("/").map(Number);
    const validade = ano ? new Date(ano, mes - 1, dia) : null;
    const novos = {
      marca: validarTextoObrigatorio(dados.marca, "Marca", 30),
      modelo: validarTextoObrigatorio(dados.modelo, "Modelo", 30),
      cor: validarTextoObrigatorio(dados.cor, "Cor", 20),
      placa: validarPlaca(dados.placa),
      cnhValidade: validarCnhValidade(validade),
      chavePix: validarTextoObrigatorio(dados.chavePix, "Chave PIX", 80),
    };
    setErros(novos);
    if (Object.values(novos).some(Boolean)) return;
    setEnviando(true);
    setErro(null);
    try {
      await salvarMotorista({
        veiculo: { marca: dados.marca.trim(), modelo: dados.modelo.trim(), cor: dados.cor.trim(), placa: dados.placa.replace(/[^A-Z0-9]/gi, "").toUpperCase() },
        lugares: Math.min(6, Math.max(1, Number(dados.lugares) || 1)),
        cnhValidade: validade.toISOString().slice(0, 10),
        chavePix: dados.chavePix.trim(),
      });
    } catch (falha) {
      setErro(falha.message);
      setEnviando(false);
    }
  }

  return (
    <Pagina titulo="Dados do motorista" aviso="Tela provisória para testes. A versão final é da issue #30.">
      <Text style={styles.texto}>Os passageiros veem o carro e a placa antes de embarcar.</Text>
      <View style={{ gap: 12 }}>
        <Campo rotulo="Marca" value={dados.marca} onChangeText={mudar("marca")} erro={erros.marca} />
        <Campo rotulo="Modelo" value={dados.modelo} onChangeText={mudar("modelo")} erro={erros.modelo} />
        <Campo rotulo="Cor" value={dados.cor} onChangeText={mudar("cor")} erro={erros.cor} />
        <Campo rotulo="Placa" value={dados.placa} onChangeText={(v) => mudar("placa")(mascararPlaca(v))} erro={erros.placa} autoCapitalize="characters" />
        <Campo rotulo="Lugares para passageiros" value={dados.lugares} onChangeText={mudar("lugares")} keyboardType="number-pad" />
        <Campo rotulo="Validade da CNH (dd/mm/aaaa)" value={dados.cnhValidade} onChangeText={mudar("cnhValidade")} erro={erros.cnhValidade} keyboardType="numbers-and-punctuation" />
        <Campo rotulo="Chave PIX" value={dados.chavePix} onChangeText={mudar("chavePix")} erro={erros.chavePix} autoCapitalize="none" />
      </View>
      <Mensagem texto={erro} />
      <Botao titulo="Salvar e continuar" carregando={enviando} onPress={enviar} />
      <Botao titulo="Entrar como passageiro" secundario onPress={() => definirModo("passageiro")} />
    </Pagina>
  );
}
