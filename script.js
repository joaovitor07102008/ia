// Seleciona os elementos do DOM
const caixaPerguntas = document.querySelector(".caixa-perguntas");
const caixaAlternativas = document.querySelector(".caixa-alternativas");
const textoResultado = document.querySelector(".texto-resultado");

// Cria e adiciona botões de navegação
const botoesDiv = document.createElement("div");
botoesDiv.className = "botoes-navegacao";
caixaAlternativas.after(botoesDiv);

const botaoVoltar = document.createElement("button");
botaoVoltar.textContent = "Voltar";
botaoVoltar.className = "botao-voltar";
botaoVoltar.style.display = "none";

const botaoAvancar = document.createElement("button");
botaoAvancar.textContent = "Avançar";
botaoAvancar.className = "botao-avancar";

const botaoReiniciar = document.createElement("button");
botaoReiniciar.textContent = "Tentar Novamente";
botaoReiniciar.className = "botao-reiniciar";
botaoReiniciar.style.display = "none";

botoesDiv.append(botaoVoltar, botaoAvancar, botaoReiniciar);

// Cria barra de progresso
const barraProgresso = document.createElement("div");
barraProgresso.className = "barra-progresso";
const progressoAtual = document.createElement("div");
progressoAtual.className = "progresso-atual";
barraProgresso.appendChild(progressoAtual);
caixaAlternativas.before(barraProgresso);

// Perguntas do quiz (5 perguntas)
const perguntas = [
  {
    enunciado: "Assim que saiu da escola você se depara com uma nova tecnologia...",
    alternativas: [
      { texto: "Isso é assustador!", afirmacao: "No início ficou com medo do que essa tecnologia pode fazer." },
      { texto: "Isso é maravilhoso!", afirmacao: "Quis saber como usar IA no seu dia a dia." }
    ]
  },
  {
    enunciado: "Com a descoberta desta tecnologia, uma professora propõe um trabalho...",
    alternativas: [
      { texto: "Utiliza IA para encontrar informações e facilitar entendimento.", afirmacao: "Conseguiu utilizar a IA para buscar informações úteis." },
      { texto: "Faz o trabalho com base em pesquisas próprias.", afirmacao: "Sentiu mais facilidade em utilizar seus próprios recursos." }
    ]
  },
  {
    enunciado: "Durante um debate sobre IA e o futuro do trabalho, qual seu posicionamento?",
    alternativas: [
      { texto: "Defende IA como geradora de novas oportunidades.", afirmacao: "Vem impulsionando a inovação e novos caminhos profissionais com IA." },
      { texto: "Preocupado com a perda de empregos para máquinas.", afirmacao: "Criou um grupo para discutir ética na IA." }
    ]
  },
  {
    enunciado: "Como criar uma imagem que represente sua visão de IA?",
    alternativas: [
      { texto: "Usar Paint ou outro editor tradicional.", afirmacao: "Compartilhou conhecimento com quem usa ferramentas tradicionais." },
      { texto: "Utilizar um gerador de imagem com IA.", afirmacao: "Acelerou criações e ajudou quem tem dificuldade em desenhar." }
    ]
  },
  {
    enunciado: "Um colega usou IA para copiar todo o trabalho. O que você faz?",
    alternativas: [
      { texto: "Aceita o texto inteiro como contribuição válida.", afirmacao: "Agora depende da IA para tudo." },
      { texto: "Revê o trabalho e contribui com sua própria perspectiva.", afirmacao: "Entendeu que IA é ferramenta e não produto final." }
    ]
  }
];

let perguntaAtual = 0;
let respostas = [];
let historiaFinal = "";

function atualizaProgresso() {
  const progresso = ((perguntaAtual) / perguntas.length) * 100;
  progressoAtual.style.width = `${progresso}%`;
}

function mostraPergunta() {
  if (perguntaAtual >= perguntas.length) {
    mostraResultado();
    return;
  }

  const pergunta = perguntas[perguntaAtual];
  caixaPerguntas.textContent = pergunta.enunciado;
  caixaAlternativas.innerHTML = "";

  pergunta.alternativas.forEach((alternativa, index) => {
    const botao = document.createElement("button");
    botao.className = "botao-alternativa";
    botao.textContent = alternativa.texto;
    
    if (respostas[perguntaAtual] === index) {
      botao.classList.add("selecionado");
    }

    botao.addEventListener("click", () => {
      respostas[perguntaAtual] = index;
      document.querySelectorAll(".botao-alternativa").forEach(b => {
        b.classList.remove("selecionado");
      });
      botao.classList.add("selecionado");
    });

    caixaAlternativas.appendChild(botao);
  });

  botaoVoltar.style.display = perguntaAtual > 0 ? "block" : "none";
  botaoReiniciar.style.display = "none";
  atualizaProgresso();
}

function avancar() {
  if (respostas[perguntaAtual] === undefined) {
    alert("Por favor, selecione uma alternativa antes de avançar.");
    return;
  }
  
  const alternativaSelecionada = perguntas[perguntaAtual].alternativas[respostas[perguntaAtual]];
  historiaFinal += alternativaSelecionada.afirmacao + " ";
  
  perguntaAtual++;
  mostraPergunta();
}

function voltar() {
  if (perguntaAtual > 0) {
    perguntaAtual--;
    const respostaAnterior = respostas[perguntaAtual];
    if (respostaAnterior !== undefined) {
      const altAnterior = perguntas[perguntaAtual].alternativas[respostaAnterior];
      historiaFinal = historiaFinal.replace(altAnterior.afirmacao + " ", "");
    }
    mostraPergunta();
  }
}

function mostraResultado() {
  caixaPerguntas.textContent = "Em 2049...";
  caixaAlternativas.innerHTML = "";
  
  const frases = respostas.map((respostaIdx, i) => {
    return perguntas[i].alternativas[respostaIdx].afirmacao;
  }).join(". ") + ".";
  
  // Avaliação baseada nas respostas
  const positivas = [
    "Quis saber como usar IA no seu dia a dia.",
    "Conseguiu utilizar a IA para buscar informações úteis.",
    "Vem impulsionando a inovação e novos caminhos profissionais com IA.",
    "Acelerou criações e ajudou quem tem dificuldade em desenhar.",
    "Entendeu que IA é ferramenta e não produto final."
  ];

  const score = respostas.filter((resposta, i) => {
    return positivas.includes(perguntas[i].alternativas[resposta].afirmacao);
  }).length;

  let avaliacao = "";
  if (score >= 4) {
    avaliacao = "Você é um entusiasta da IA e enxerga nela um caminho para transformar positivamente o mundo.";
  } else if (score >= 2) {
    avaliacao = "Você utiliza a IA de forma equilibrada, avaliando seus limites e possibilidades.";
  } else {
    avaliacao = "Você encara a IA com cautela, priorizando sempre o julgamento humano e ético.";
  }

  textoResultado.innerHTML = `
    <p>${frases}</p>
    <div class="avaliacao">${avaliacao}</div>
  `;

  botaoVoltar.style.display = "none";
  botaoAvancar.style.display = "none";
  botaoReiniciar.style.display = "block";
  progressoAtual.style.width = "100%";
}

function reiniciar() {
  perguntaAtual = 0;
  respostas = [];
  historiaFinal = "";
  textoResultado.textContent = "";
  mostraPergunta();
}

// Event listeners
botaoAvancar.addEventListener("click", avancar);
botaoVoltar.addEventListener("click", voltar);
botaoReiniciar.addEventListener("click", reiniciar);

// Inicia o quiz
mostraPergunta();