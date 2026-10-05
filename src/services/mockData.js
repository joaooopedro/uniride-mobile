const minutosAtras = (minutos) => new Date(Date.now() - minutos * 60 * 1000);

export const TIPOS_MENSAGEM = {
  texto: 'texto',
  aviso: 'aviso',
};

export const CATEGORIAS_AVISO = {
  transito: 'transito',
  campus: 'campus',
  seguranca: 'seguranca',
  reserva: 'reserva',
  rota: 'rota',
  cancelamento: 'cancelamento',
};

export const AVISOS_RAPIDOS = [
  {
    id: 'cheguei-ponto',
    texto: 'Cheguei no ponto de encontro',
    icone: 'location-outline',
    resposta: 'Beleza, chego em 3 minutos.',
  },
  {
    id: 'atraso',
    texto: 'Atraso de 5 minutos, aguardem',
    icone: 'time-outline',
    resposta: 'Sem problema, te espero no ponto.',
  },
  {
    id: 'semaforo',
    texto: 'Carro parado no semáforo',
    icone: 'car-outline',
    resposta: 'Tranquilo, obrigado por avisar.',
  },
  {
    id: 'cheguei-portaria',
    texto: 'Já cheguei na portaria da faculdade',
    icone: 'school-outline',
    resposta: 'Boa aula! Na volta a gente combina por aqui.',
  },
];

const textoAvisoRapido = (avisoId) => AVISOS_RAPIDOS.find((aviso) => aviso.id === avisoId).texto;

export const mensagensChatIniciais = [
  {
    id: 'mensagem-1',
    caronaId: 'carona-002',
    autor: 'Rafael Mendes',
    texto: 'Boa noite, pessoal! Hoje saio às 18:20 da Praça do São Mateus, em frente à igreja.',
    tipo: TIPOS_MENSAGEM.texto,
    enviadaEm: minutosAtras(34),
    lida: true,
  },
  {
    id: 'mensagem-2',
    caronaId: 'carona-002',
    autor: 'Bianca Reis',
    texto: 'Combinado! Chego uns minutos antes.',
    tipo: TIPOS_MENSAGEM.texto,
    enviadaEm: minutosAtras(31),
    lida: true,
  },
  {
    id: 'mensagem-3',
    caronaId: 'carona-002',
    autor: 'Lucas Alves',
    texto: 'Vou direto da aula, chego em cima da hora.',
    tipo: TIPOS_MENSAGEM.texto,
    enviadaEm: minutosAtras(27),
    lida: true,
  },
  {
    id: 'mensagem-4',
    caronaId: 'carona-002',
    autor: 'Rafael Mendes',
    texto: 'Tranquilo, espero até 18:25.',
    tipo: TIPOS_MENSAGEM.texto,
    enviadaEm: minutosAtras(25),
    lida: true,
  },
  {
    id: 'mensagem-5',
    caronaId: 'carona-002',
    autor: 'Rafael Mendes',
    texto: textoAvisoRapido('atraso'),
    tipo: TIPOS_MENSAGEM.aviso,
    enviadaEm: minutosAtras(14),
    lida: true,
  },
  {
    id: 'mensagem-6',
    caronaId: 'carona-002',
    autor: 'Bianca Reis',
    texto: textoAvisoRapido('cheguei-ponto'),
    tipo: TIPOS_MENSAGEM.aviso,
    enviadaEm: minutosAtras(11),
    lida: false,
  },
  {
    id: 'mensagem-7',
    caronaId: 'carona-002',
    autor: 'João Pedro Silva',
    texto: textoAvisoRapido('cheguei-ponto'),
    tipo: TIPOS_MENSAGEM.aviso,
    enviadaEm: minutosAtras(9),
    lida: true,
  },
  {
    id: 'mensagem-8',
    caronaId: 'carona-002',
    autor: 'Rafael Mendes',
    texto: textoAvisoRapido('semaforo'),
    tipo: TIPOS_MENSAGEM.aviso,
    enviadaEm: minutosAtras(3),
    lida: false,
  },
];

export const avisosIniciais = [
  {
    id: 'aviso-transito-itamar-franco',
    categoria: CATEGORIAS_AVISO.transito,
    titulo: 'Trânsito intenso na Av. Presidente Itamar Franco',
    descricao: 'Lentidão no sentido Centro entre 18h e 19h. Combine a saída com 10 minutos de antecedência.',
    criadoEm: minutosAtras(12),
    lido: false,
  },
  {
    id: 'aviso-portaria-estrela-sul',
    categoria: CATEGORIAS_AVISO.campus,
    titulo: 'Entrada do Estrela Sul liberada',
    descricao: 'A portaria principal voltou a funcionar normalmente depois da manutenção.',
    criadoEm: minutosAtras(47),
    lido: false,
  },
  {
    id: 'aviso-ponto-iluminado-centro',
    categoria: CATEGORIAS_AVISO.seguranca,
    titulo: 'Ponto de encontro iluminado no Centro',
    descricao: 'Para embarques à noite, prefira o Parque Halfeld, lado da Av. Rio Branco, que tem iluminação e câmeras.',
    criadoEm: minutosAtras(3 * 60),
    lido: true,
  },
  {
    id: 'aviso-semana-academica',
    categoria: CATEGORIAS_AVISO.campus,
    titulo: 'Semana acadêmica no Campus Academia',
    descricao: 'Na quinta-feira, embarque e desembarque apenas pela portaria principal.',
    criadoEm: minutosAtras(26 * 60),
    lido: true,
  },
];
