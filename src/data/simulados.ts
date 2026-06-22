export interface Question {
  id: number;
  subject: string;
  reference: string;
  enunciado: string;
  alternatives: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correctAlternative: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  level: 'fácil' | 'médio' | 'difícil';
}

export const SIMULADO_QUESTIONS: Question[] = [
  // 10 LÍNGUA PORTUGUESA (1-10)
  {
    id: 1,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No que se refere ao uso dos pronomes demonstrativos e à coesão textual, assinale a alternativa em que a palavra destacada foi empregada de acordo com a norma-padrão da língua de modo anafórico.",
    alternatives: {
      A: "A meta do Banco do Brasil para o próximo trimestre é esta: captar 15 mil novos clientes digitais.",
      B: "Naquela reunião realizada há dez anos, decidimos as diretrizes que até hoje regulam nossas agências.",
      C: "O gerente de TI e o diretor de marketing apresentaram o novo portal; este com foco em dados e aquele focado em usabilidade.",
      D: "Esse relatório que tenho em minhas mãos agora detalha as fraudes digitais do semestre anterior.",
      E: "Espero sinceramente isto de você: dedicação absoluta e respeito às normas de proteção ao sigilo bancário."
    },
    correctAlternative: "C",
    explanation: "O pronome 'este' retoma o elemento mais próximo (marketing) e 'aquele' retoma o mais distante (gerente de TI), demonstrando coesão anafórica correta.",
    level: "médio"
  },
  {
    id: 2,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "A concordância verbal está inteiramente de acordo com as normas da língua padrão na seguinte sentença:",
    alternatives: {
      A: "Devem fazer aproximadamente cinco anos que o banco iniciou sua transformação digital de ponta.",
      B: "Mais de um correntista reclamou formalmente do tempo de espera nos canais de atendimento telefônico.",
      C: "Fomos nós que efetuou as transferências de custódia das ações no primeiro pregão do mês.",
      D: "Alugou-se vários escritórios na região central para abrigar a nova superintendência de varejo.",
      E: "Grande parte dos analistas de investimentos preferiram manter a cautela diante da oscilação do mercado."
    },
    correctAlternative: "B",
    explanation: "Com a expressão 'mais de um', o verbo concorda no singular. Em 'Devem fazer', o verbo de tempo decorrido é impessoal (deve fazer). 'Fomos nós que' exige concordância com 'nós' (fomos nós que efetuamos) ou 'quem efetuou'. 'Alugou-se vários' deve ser plural (Alugaram-se). No caso de expressões partitivas ('Grande parte dos analistas...'), pode-se usar singular ou plural, porém o uso em B é indubitavelmente correto.",
    level: "médio"
  },
  {
    id: 3,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Assinale a frase em que o sinal indicativo de crase está empregado em estrita consonância com a norma-padrão da língua portuguesa.",
    alternatives: {
      A: "O superintendente de vendas se dirigiu à toda a equipe para parabenizar pelos resultados obtidos.",
      B: "O novo funcionário começou à demonstrar grande aptidão para a comercialização de consórcios.",
      C: "Os clientes que preferem atendimento personalizado devem ir à agência central a partir das dez horas.",
      D: "A diretoria do Banco do Brasil respondeu de forma gentil à ela, sanando as dúvidas sobre o fundo ESG.",
      E: "As operações de crédito foram liberadas mediante pagamento à prazo, conforme acordado no contrato acadêmico."
    },
    correctAlternative: "C",
    explanation: "Quem vai, vai 'a'. Agência admite o artigo 'a'. Portanto, à agência está correto. 'À toda' e 'à ela' não admitem crase. 'À demonstrar' é antes de verbo. 'À prazo' é antes de palavra masculina.",
    level: "fácil"
  },
  {
    id: 4,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Assinale a opção em que a regência nominal está correta e de acordo com a norma gramatical vigente.",
    alternatives: {
      A: "A decisão do comitê de crédito foi incompatível com as novas exigências da circular do Banco Central.",
      B: "Os novos investidores mostraram-se muito ansiosos em assinar o termo de adesão ao fundo de investimento.",
      C: "O assistente administrativo é muito apto em resolver conflitos operacionais de forma rápida.",
      D: "Sua postura ética é estritamente favorável em manter o sigilo absoluto das transações ativas.",
      E: "Eles estavam sedentos por obter informações privilegiadas, o que contraria as normas internas de conduta."
    },
    correctAlternative: "A",
    explanation: "O adjetivo 'incompatível' rege a preposição 'com' (incompatível com), sendo o emprego estritamente padrão.",
    level: "médio"
  },
  {
    id: 5,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No trecho 'Embora a Inteligência Artificial traga maior eficiência ao atendimento bancário, nada substitui a empatia do elemento humano', a oração sublinhada expressa a ideia de:",
    alternatives: {
      A: "Concessão, apresentando um obstáculo que não impede o fato expresso na oração principal.",
      B: "Condição, determinando a circunstância indispensável para que o fato principal ocorra.",
      C: "Causa, explicando a razão de ser do fato retratado na oração subsequente.",
      D: "Consequência, evidenciando o resultado inerente do processo relatado pelo gerente.",
      E: "Proporção, demonstrando simultaneidade e desenvolvimento gradual no tempo."
    },
    correctAlternative: "A",
    explanation: "A conjunção 'Embora' introduz uma oração subordinada adverbial concessiva, que indica um contraste ou barreira que não impede a ação principal.",
    level: "fácil"
  },
  {
    id: 6,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Considere a frase: 'O cliente comprou o produto financeiro. Ele achou o rendimento excelente'. Empregando a colocação pronominal padrão e unindo as orações, obtém-se o seguinte resultado grammatical correto:",
    alternatives: {
      A: "O cliente comprou o produto financeiro que achou-lhe excelente no balanço final.",
      B: "O cliente comprou o produto financeiro, cujo rendimento considerou-o excelente e promissor.",
      C: "O cliente comprou o produto financeiro cujo rendimento ele o achou excelente ao final do ano.",
      D: "O cliente comprou o produto financeiro cujo rendimento achou excelente.",
      E: "O cliente comprou o produto financeiro o qual achou-lhe com excelente rendimento anual."
    },
    correctAlternative: "D",
    explanation: "A junção com o pronome relativo 'cujo' estabelece a relação de posse correta ('rendimento do produto financeiro') sem redundância de pronomes oblíquos.",
    level: "difícil"
  },
  {
    id: 7,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Assinale a alternativa que apresenta desvio de concordância nominal de acordo com a norma-padrão.",
    alternatives: {
      A: "É necessário cautela ao realizar empréstimos sem as garantias reais adequadas.",
      B: "Seguem inclusos os relatórios de ouvidoria referentes às reclamações do Pix.",
      C: "A gerente informou que, para a contratação do seguro de vida, bastavam poucas cópias anexas.",
      D: "As carteiras de investimento do banco azul e ouro estão o mais organizadas possíveis.",
      E: "Meio assustada com as taxas elevadas, a cliente preferiu colocar o dinheiro na poupança clássica."
    },
    correctAlternative: "D",
    explanation: "O correto é 'o mais organizadas possível' (concordando com o artigo singular 'o'). Se fosse 'as mais organizadas possíveis', estaria certo.",
    level: "difícil"
  },
  {
    id: 8,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Aponte o enunciado que está devidamente pontuado, respeitando as regras de pontuação da norma culta administrativa.",
    alternatives: {
      A: "Os agentes comerciais, que baterem as metas semestrais de captação de recursos, ganharão um bônus.",
      B: "O Banco do Brasil, fundado em 1808 reestruturou seu modelo para focar na transformação mobile.",
      C: "Embora o mercado financeiro apresentasse instabilidade extrema, o fundo imobiliário manteve os dividendos pactuados.",
      D: "Os correntistas do banco estatal preferem, o aplicativo móvel, por causa da rapidez logística de dados.",
      E: "Desejando atrair novos investidores o gerente de conta, realizou uma palestra explicativa sobre tesouro direto."
    },
    correctAlternative: "C",
    explanation: "Na alternativa C, a oração subordinada adverbial concessiva anteposta está devidamente isolada pela vírgula. Nas outras há separação incorreta de sujeito e predicado ou explicações intercaladas incompletas.",
    level: "médio"
  },
  {
    id: 9,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Em qual palavra a acentuação gráfica se justifica pelo mesmo motivo que a palavra 'bancário'?",
    alternatives: {
      A: "Próximo",
      B: "Relatório",
      C: "Baú",
      D: "Pará",
      E: "Fluido"
    },
    correctAlternative: "B",
    explanation: "'Bancário' e 'Relatório' são acentuadas porque são palavras paroxítonas terminadas em ditongo crescente.",
    level: "fácil"
  },
  {
    id: 10,
    subject: "Língua Portuguesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Identifique o sinônimo adequado e em conformidade contextual para o vocábulo 'idôneo', comumente utilizado nas diretrizes éticas do Banco do Brasil.",
    alternatives: {
      A: "Insolvente",
      B: "Integro e confiável",
      C: "Arredio",
      D: "Prescritivo",
      E: "Negligente"
    },
    correctAlternative: "B",
    explanation: "Uma conduta ou pessoa idônea refere-se a alguém íntegro, honesto, em quem se pode depositar plena confiança.",
    level: "fácil"
  },

  // 5 LÍNGUA INGLESA (11-15)
  {
    id: 11,
    subject: "Língua Inglesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Choose the alternative that correctly completes the sentence: 'If the bank ______ its customer service protocol last year, it ______ so many digital accounts during the system integration.'",
    alternatives: {
      A: "had updated / wouldn't have lost",
      B: "updates / wouldn't lose",
      C: "would update / hadn't lost",
      D: "has updated / didn't lose",
      E: "updated / will not lose"
    },
    correctAlternative: "A",
    explanation: "This is a third conditional sentence, used to talk about hypothetical past events: 'If + past perfect / would have + past participle'.",
    level: "difícil"
  },
  {
    id: 12,
    subject: "Língua Inglesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "In the sentence 'Digital banks are highly appealing to younger generations because they offer seamless registration', what does the pronoun 'they' refer to?",
    alternatives: {
      A: "Younger generations",
      B: "Registration guidelines",
      C: "Digital banks",
      D: "Classic accounts",
      E: "Physical agencies"
    },
    correctAlternative: "C",
    explanation: "'They' refers back to 'Digital banks', which is the subject performing the action of offering seamless registration.",
    level: "fácil"
  },
  {
    id: 13,
    subject: "Língua Inglesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "The connector 'Furthermore' in the sentence: 'The application is extremely fast. Furthermore, it encrypts all personal user data to prevent credit frauds' conveys the meaning of:",
    alternatives: {
      A: "Contrast",
      B: "Addition",
      C: "Result",
      D: "Concession",
      E: "Time sequence"
    },
    correctAlternative: "B",
    explanation: "'Furthermore' is an additive adverbial conjunction used to introduce additional supporting evidence or arguments.",
    level: "médio"
  },
  {
    id: 14,
    subject: "Língua Inglesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Read the excerpt: 'Artificial intelligence is reshaping the banking sector, forcing traditional entities to adapt rapidly.' The word 'reshaping' is closest in meaning to:",
    alternatives: {
      A: "Destroying",
      B: "Conserving",
      C: "Transforming",
      D: "Postponing",
      E: "Imitating"
    },
    correctAlternative: "C",
    explanation: "'Reshaping' means changing the form or character of something. In this context, it is closest to 'Transforming'.",
    level: "médio"
  },
  {
    id: 15,
    subject: "Língua Inglesa",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Identify the correct verb tense used in: 'Banco do Brasil has been expanding its green loans portfolio over the last few years.'",
    alternatives: {
      A: "Present perfect continuous",
      B: "Past perfect simple",
      C: "Present continuous simple",
      D: "Future continuous perfect",
      E: "Present simple perfect"
    },
    correctAlternative: "A",
    explanation: "The structure 'has been + verb-ing' represents the Present Perfect Continuous tense, emphasizing an ongoing action starting in the past.",
    level: "fácil"
  },

  // 5 MATEMÁTICA (16-20)
  {
    id: 16,
    subject: "Matemática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um banco tem duas agências na mesma região. Na agência A, trabalham 12 funcionários, dos quais 4 são especialistas em crédito rural. Na agência B, trabalham 15 funcionários, dos quais 5 são especialistas em crédito rural. Se um funcionário de cada agência for escolhido aleatoriamente, qual a probabilidade de que os dois funcionários escolhidos sejam especialistas em crédito rural?",
    alternatives: {
      A: "1/9",
      B: "4/45",
      C: "3/20",
      D: "1/5",
      E: "8/15"
    },
    correctAlternative: "A",
    explanation: "Probabilidade do especialista de A = 4/12 = 1/3. Probabilidade do especialista de B = 5/15 = 1/3. Como os eventos são independentes, a probabilidade conjunta é (1/3) * (1/3) = 1/9.",
    level: "médio"
  },
  {
    id: 17,
    subject: "Matemática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Uma progressão aritmética (PA) possui o primeiro termo igual a 150 e o vigésimo termo igual a 530. Qual é a razão dessa progressão aritmética?",
    alternatives: {
      A: "20",
      B: "18",
      C: "19",
      D: "22",
      E: "25"
    },
    correctAlternative: "A",
    explanation: "Fórmula do termo geral da PA: An = A1 + (n-1)*r. Substituindo: 530 = 150 + (20-1)*r => 380 = 19r => r = 20.",
    level: "fácil"
  },
  {
    id: 18,
    subject: "Matemática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Para organizar as senhas de atendimento, um programador utiliza anagramas criados a partir das letras da palavra 'BANCO'. Quantos anagramas contendo todas as letras dessa palavra começam com uma consoante?",
    alternatives: {
      A: "72",
      B: "120",
      C: "48",
      D: "96",
      E: "36"
    },
    correctAlternative: "A",
    explanation: "A palavra 'BANCO' tem 5 letras (B, A, N, C, O), sendo 3 consoantes (B, N, C) e 2 vogais (A, O). Para começar com consoante, temos 3 opções para a primeira letra. As demais 4 letras podem ser organizadas de qualquer forma (P4 = 4! = 24). Total = 3 * 24 = 72 anagramas.",
    level: "médio"
  },
  {
    id: 19,
    subject: "Matemática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Em uma agência bancária, um grupo de 12 funcionários deve ser dividido em comissões de transação ética contendo 3 membros cada. De quantas maneiras distintas essa comissão de 3 pessoas pode ser formada?",
    alternatives: {
      A: "220",
      B: "1320",
      C: "660",
      D: "120",
      E: "440"
    },
    correctAlternative: "A",
    explanation: "Trata-se de uma combinação simples de 12 elementos tomados de 3 em 3. C(12, 3) = 12! / (3! * 9!) = (12 * 11 * 10) / (3 * 2 * 1) = 220.",
    level: "fácil"
  },
  {
    id: 20,
    subject: "Matemática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um correntista do Banco do Brasil deparou-se com duas opções de investimento que seguem leis de crescimento exponencial. A primeira opção dobra o capital investido a cada 4 anos. A segunda opção triplica o capital investido a cada 6 anos. Considerando um capital inicial investido identicamente em ambas, qual das opções terá maior rendimento acumulado após exatos 12 anos?",
    alternatives: {
      A: "A primeira opção, resultando em 9 vezes o valor inicial.",
      B: "A segunda opção, resultando em 9 vezes o valor inicial.",
      C: "Ambas terão o mesmo rendimento de 8 vezes o valor inicial.",
      D: "A segunda opção, resultando em 8 vezes o valor inicial.",
      E: "A primeira opção, resultando em 8 vezes o valor inicial."
    },
    correctAlternative: "B",
    explanation: "Em 12 anos: na primeira opção, serão 3 ciclos de 4 anos (2^3 = 8 vezes o capital). Na segunda opção, serão 2 ciclos de 6 anos (3^2 = 9 vezes o capital). Logo, a segunda opção rende mais, atingindo 9 vezes o valor inicial.",
    level: "difícil"
  },

  // 5 ATUALIDADES DO MERCADO FINANCEIRO (21-25)
  {
    id: 21,
    subject: "Atualidades do Mercado Financeiro",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "O ecossistema do Open Finance no Brasil, regulado pelo Banco Central, trouxe uma mudança expressiva no compartilhamento de dados financeiros. Qual é o pilar estrutural que define legalmente esse conceito no país?",
    alternatives: {
      A: "O monopólio das agências físicas tradicionais para controlar as tarifas e produtos bancários de forma centralizada.",
      B: "O consentimento explícito e revogável do cliente, que é dono de seus próprios dados financeiros pessoais e cadastrais.",
      C: "A proibição de que as fintechs acessem os históricos de cartões de crédito gerados pelos grandes bancos comerciais.",
      D: "A transferência compulsória e confidencial de saldos bancários para contas unificadas geridas pelo Tesouro Nacional.",
      E: "O repasse irrestrito de informações financeiras a terceiras corporações sem necessidade de validação digital do consumidor."
    },
    correctAlternative: "B",
    explanation: "O pilar do Open Finance é que o cliente possui a titularidade dos seus dados e tem o direito de autorizar o compartilhamento (de forma explícita e revogável) entre as instituições habilitadas.",
    level: "fácil"
  },
  {
    id: 22,
    subject: "Atualidades do Mercado Financeiro",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Uma das novidades mais discutidas no cenário monetário é o Drex. Sobre esse instrumento, assinale a afirmação correta:",
    alternatives: {
      A: "Uma criptomoeda desregulada emitida por uma rede autônoma de mineradores para combater o papel moeda regular.",
      B: "O nome oficial da plataforma de investimento internacional focada no agronegócio exportador do Banco do Brasil.",
      C: "A moeda digital oficial emitida pelo Banco Central do Brasil (CBDC), sendo uma representação digital do Real.",
      D: "Um aplicativo de pagamentos instantâneos que pretende substituir por completo o Pix a partir de 2027.",
      E: "Uma taxa interbancária flutuante de juros pós-fixados cobrada estritamente nas operações com fundos mútuos."
    },
    correctAlternative: "C",
    explanation: "O Drex é de fato a representação digital do Real (CBDC - Central Bank Digital Currency), operado em rede blockchain autorizada e regulada pelo Banco Central.",
    level: "fácil"
  },
  {
    id: 23,
    subject: "Atualidades do Mercado Financeiro",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "As metas e práticas ESG (Environmental, Social and Governance) têm norteado a governança das principais instituições financeiras. Sobre as práticas ESG aplicadas ao crédito no Banco do Brasil, conclui-se que:",
    alternatives: {
      A: "Empresas com alto índice de desmatamento ilegal têm incentivos fiscais adicionais para fomento agropecuário imediato.",
      B: "O banco foca exclusivamente em retorno de capitais tradicionais, sem considerar parâmetros ecológicos no conselho gestor.",
      C: "As decisões de investimento e concessão de fomento financeiro consideram riscos climáticos e impactos socioambientais.",
      D: "Apenas agências localizadas na região Norte do Brasil são obrigadas a reportar relatórios de pegada de carbono do setor corporativo.",
      E: "Os títulos de mineração predatória recebem garantias estatais ilimitadas por meio de debêntures incentivadas de luxo."
    },
    correctAlternative: "C",
    explanation: "Na governança ESG, as instituições integram a análise de riscos climáticos, direitos humanos e regras de compliance ecológico em suas diretrizes de crédito.",
    level: "fácil"
  },
  {
    id: 24,
    subject: "Atualidades do Mercado Financeiro",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Fintechs e Big Techs entraram de modo agressivo na oferta de serviços financeiros no país. O principal mecanismo regulatório do Banco Central para enquadrar essas empresas assegurando concorrência leal é a criação de:",
    alternatives: {
      A: "Sociedades de Crédito Direto (SCD) e Sociedades de Empréstimo entre Pessoas (SEP), com escopos operacionais delimitados.",
      B: "Cartórios virtuais unificados que detêm todos os dados biométricos nacionais e impedem abertura de contas remotas.",
      C: "Impostos adicionais alfandegários sobre todo tráfego de dados de aplicativos de chat que realizem transferências financeiras.",
      D: "Um teto fixo de 2% para taxa de juros de empréstimos, exclusivo para novos bancos com menos de cinco anos de mercado.",
      E: "Banimento global de plataformas de e-commerce que implementem pagamentos integrados sem autorização do Ministério da Defesa."
    },
    correctAlternative: "A",
    explanation: "O Banco Central do Brasil regulou as fintechs criando categorias com regras simplificadas e focadas, como as SCDs de capital próprio e as SEPs de empréstimo peer-to-peer.",
    level: "difícil"
  },
  {
    id: 25,
    subject: "Atualidades do Mercado Financeiro",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "O mercado de capitais brasileiro registrou um desenvolvimento significativo nos últimos anos com a consolidação dos FIDCs. Qual é o foco prioritário deste tipo de fundo de investimento?",
    alternatives: {
      A: "Direcionar recursos exclusivamente em criptoativos esportivos.",
      B: "Investir na aquisição e securitização de direitos creditórios a receber de empresas de diversos setores da economia.",
      C: "Manter todo o patrimônio alocado em ouro físico custodiado em cofres do Banco Mundial.",
      D: "Garantir a devolução integral de prejuízos em ações por meio do Fundo Garantidor de Crédito (FGC).",
      E: "Efetuar empréstimos de alto risco sem juros a prefeituras estaduais inadimplentes."
    },
    correctAlternative: "B",
    explanation: "FIDCs são Fundos de Investimento em Direitos Creditórios, cujo patrimônio se destina à aquisição de direitos creditórios de empresas comerciais, industriais ou financeiras.",
    level: "médio"
  },

  // 5 MATEMÁTICA FINANCEIRA (26-30)
  {
    id: 26,
    subject: "Matemática Financeira",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um correntista do Banco do Brasil obteve um empréstimo de R$ 20.000,00 no regime de juros simples, a uma taxa de juros de 2% ao mês. Se o montante total pago ao final do período foi de R$ 24.800,00, qual foi o tempo de duração desse empréstimo?",
    alternatives: {
      A: "12 meses",
      B: "10 meses",
      C: "15 meses",
      D: "8 meses",
      E: "18 meses"
    },
    correctAlternative: "A",
    explanation: "Juros cobrados = Montante - Capital = 24.800 - 20.000 = R$ 4.800. Fórmula J = C * i * t. Substituindo: 4.800 = 20.000 * 0,02 * t => 4.800 = 400 * t => t = 12 meses.",
    level: "fácil"
  },
  {
    id: 27,
    subject: "Matemática Financeira",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um capital de R$ 10.000,00 é aplicado a uma taxa de juros compostos de 10% ao ano, capitalizados anualmente. Ao final de um período de 3 anos, o montante aproximado gerado por essa aplicação e o valor de juros acumulados serão, respectivamente:",
    alternatives: {
      A: "R$ 13.000,00 e R$ 3.000,00",
      B: "R$ 13.310,00 e R$ 3.310,00",
      C: "R$ 12.100,00 e R$ 2.100,00",
      D: "R$ 13.500,00 e R$ 3.500,00",
      E: "R$ 14.100,00 e R$ 4.100,00"
    },
    correctAlternative: "B",
    explanation: "Fórmula Juros Compostos: M = C * (1 + i)^t. M = 10.000 * (1.1)^3 = 10.000 * 1.331 = R$ 13.310,00. Juros = M - C = R$ 3.310,00.",
    level: "fácil"
  },
  {
    id: 28,
    subject: "Matemática Financeira",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Uma taxa nominal de 12% ao ano com capitalização mensal equivale a qual taxa efetiva anual de juros?",
    alternatives: {
      A: "12,00%",
      B: "12,68%",
      C: "13,10%",
      D: "12,36%",
      E: "12,55%"
    },
    correctAlternative: "B",
    explanation: "Taxa mensal = 12% / 12 = 1% ao mês. Taxa efetiva anual = (1 + 0,01)^12 - 1 = (1,01)^12 - 1 ≈ 12,6825% ao ano.",
    level: "difícil"
  },
  {
    id: 29,
    subject: "Matemática Financeira",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um cliente deseja quitar uma duplicata com valor nominal de R$ 5.000,00 dois meses antes do seu vencimento. Se a taxa de desconto comercial simples (por fora) cobrada pela instituição financeira é de 4% ao mês, qual será o valor de desconto e o valor líquido pago pelo cliente?",
    alternatives: {
      A: "Desconto de R$ 400,00 e valor líquido de R$ 4.600,00",
      B: "Desconto de R$ 416,67 e valor líquido de R$ 4.583,33",
      C: "Desconto de R$ 360,00 e valor líquido de R$ 4.640,00",
      D: "Desconto de R$ 500,00 e valor líquido de R$ 4.500,00",
      E: "Desconto de R$ 800,00 e valor líquido de R$ 4.200,00"
    },
    correctAlternative: "A",
    explanation: "Desconto Comercial Simples: D = N * i * t. Substituindo: D = 5.000 * 0,04 * 2 = R$ 400,00. Valor Líquido = N - D = 5.000 - 400 = R$ 4.600,00.",
    level: "médio"
  },
  {
    id: 30,
    subject: "Matemática Financeira",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No sistema de amortização constante (SAC), um cliente faz um financiamento habitacional de R$ 120.000,00 com prazo de 120 meses. Sabendo que os juros são de 1% ao mês, qual será o valor da primeira prestação mensual?",
    alternatives: {
      A: "R$ 1.000,00",
      B: "R$ 2.200,00",
      C: "R$ 1.200,00",
      D: "R$ 2.000,00",
      E: "R$ 1.500,00"
    },
    correctAlternative: "B",
    explanation: "Amortização constante (A) = Principal / Meses = 120.000 / 120 = R$ 1.000,00 ao mês. Juros do 1º mês (J) = Saldo Devedor * Taxa = 120.000 * 0,01 = R$ 1.200,00. Primeira Prestação = A + J = 1.000 + 1.200 = R$ 2.200,00.",
    level: "médio"
  },

  // 10 CONHECIMENTOS BANCÁRIOS (31-40)
  {
    id: 31,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "O Sistema Financeiro Nacional (SFN) é estruturado por órgãos normativos, supervisores e operadores. Assinale a alternativa que apresenta uma atribuição exclusiva do Conselho Monetário Nacional (CMN):",
    alternatives: {
      A: "Decretar a liquidação extrajudicial de bancos comerciais em situação insolvente crônica.",
      B: "Gerir e fiscalizar as reservas cambiais físicas em moeda estrangeira mantidas pelo país.",
      C: "Fixar as diretrizes e normas gerais das políticas monetária, cambial e de crédito nacionais.",
      D: "Autorizar o funcionamento e registrar as cooperativas de crédito de pequeno porte municipais.",
      E: "Realizar as operações de mercado aberto (Open Market) para drenar excessos de liquidez comercial."
    },
    correctAlternative: "C",
    explanation: "O CMN é o órgão normativo máximo do SFN, responsável por ditar diretrizes gerais e governar políticas cambiais, monetárias e creditícias, enquanto o Banco Central atua executando essas normas.",
    level: "médio"
  },
  {
    id: 32,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "A Comissão de Valores Mobiliários (CVM) é uma autarquia vinculada ao Ministério da Fazenda. Qual é a sua competência central no âmbito do mercado financeiro?",
    alternatives: {
      A: "Controle e fiscalização da poupança e das contas correntes abertas em agências públicas estatais.",
      B: "Desenvolver, regular e fiscalizar o mercado de títulos e valores mobiliários no Brasil.",
      C: "Supervisionar as companhias de seguros e planos de capitalização abertos rurais.",
      D: "Controlar rigorosamente a circulação de papel-moeda e determinar a cunhagem de moedas de metal.",
      E: "Definir os parâmetros de taxas mínimas e máximas de rotativo de cartão de crédito no varejo."
    },
    correctAlternative: "B",
    explanation: "A CVM fiscaliza companhias abertas, bolsas de valores, fundos de investimento e outros emissores e distribuidores de valores mobiliários (ações, debêntures, etc.).",
    level: "fácil"
  },
  {
    id: 33,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Sobre os bancos múltiplos, assinale a opção que descreve um requisito obrigatório para a sua constituição e funcionamento legal estabelecidos pelo Banco Central:",
    alternatives: {
      A: "Possuir pelo menos quatro carteiras operacionais idênticas com sede na capital federal.",
      B: "Ser organizado como sociedade limitada sob a tutela ética direta do Banco Mundial.",
      C: "Operar com pelo menos duas carteiras, sendo uma delas, obrigatoriamente, comercial ou de investimento.",
      D: "Excluir de suas operações transações eletrônicas remotas que dispensem conferência manual.",
      E: "Subordinar todas as suas agências à diretoria executiva da Caixa Econômica Federal."
    },
    correctAlternative: "C",
    explanation: "Um banco múltiplo deve ter no mínimo duas carteiras, de onde pelo menos uma deve ser comercial ou de investimento, e constituir-se sob a forma de sociedade anônima.",
    level: "médio"
  },
  {
    id: 34,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "O depósito compulsório é um importante instrumento de política monetária de eficácia comprovada. Quando o Banco Central reduz as alíquotas compulsórias impostas às instituições, ocorre:",
    alternatives: {
      A: "Uma contração instantânea da liquidez bancária nacional, encarecendo os créditos das agências.",
      B: "Uma elevação induzida no custo das taxas de juros bancários pelo sumiço de papel moeda disponível.",
      C: "O aumento do multiplicador monetário, gerando maior volume de crédito disponível no mercado financeiro.",
      D: "A redução automática do deficit habitacional pela migração imediata de depósitos para o Tesouro SELIC.",
      E: "O cancelamento de todas as obrigações judiciais de renegociação de dívidas ativas pendentes."
    },
    correctAlternative: "C",
    explanation: "A redução das alíquotas deixa mais dinheiro livre em caixa para os bancos emprestarem, aumentando a liquidez global e o multiplicador bancário de crédito.",
    level: "médio"
  },
  {
    id: 35,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No que diz respeito ao mercado cambial brasileiro, as operações denominadas de 'Arbitragem' são caracterizadas por:",
    alternatives: {
      A: "Arbitrar disputas litigiosas de herança imobiliária com apoio direto judiciário de tribunais federais.",
      B: "Aproveitar disparidades temporárias de cotação de uma moeda em diferentes mercados para obter ganhos com risco reduzido.",
      C: "Garantir taxa de câmbio pré-fixada para insumos agrários por intermédio de subsídios do tesouro.",
      D: "Proibir remessas em dólares de empresas multinacionais que apresentarem atraso no INSS.",
      E: "Cobrar tarifa fixa trimestral para contas de turismo mantidas por estrangeiros em fronteiras secas."
    },
    correctAlternative: "B",
    explanation: "Arbitragem no mercado cambial ou financeiro refere-se a comprar um ativo onde está barato e vendê-lo quase simultaneamente onde está mais caro, tirando proveito de ineficiências de preço.",
    level: "médio"
  },
  {
    id: 36,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Assinale a alternativa que descreve corretamente o funcionamento do Fundo Garantidor de Créditos (FGC):",
    alternatives: {
      A: "Garante integralmente todos os saldos de ações negociadas na B3 em caso de falência das corretoras emissoras.",
      B: "Uma autarquia pública criada pelo Governo para dar assessoria cambial a pequenos produtores agropecuários rurais.",
      C: "Garante depósitos em conta corrente, caderneta de poupança e CDBs limitados a R$ 250.000,00 por CPF/CNPJ em uma mesma instituição.",
      D: "Elimina a cobrança de tributos IOF para idosos que apliquem por mais de cinco anos em títulos privados.",
      E: "Cobre rombos provenientes de oscilações internacionais em fundos de derivativos de alto risco estruturados."
    },
    correctAlternative: "C",
    explanation: "O FGC garante depósitos em conta, poupança, CDB, LCI, LCA entre outros, até o limite regulamentado de R$ 250 mil por CPF/CNPJ e instituição, respeitando tetos plurianuais globais.",
    level: "fácil"
  },
  {
    id: 37,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No contexto de crimes cibernéticos e segurança nacional, a lavagem de dinheiro compreende três fases sequenciais clássicas bem definidas pela Lei nº 9.613/1998. São elas:",
    alternatives: {
      A: "Criação, pulverização e formalização de cartórios de fachadas internacionais de comércio civil.",
      B: "Ocultação, circulação e devolução de depósitos para custódia do exterior.",
      C: "Introdução, transformação e exportação de ouro.",
      D: "Colocação, ocultação e integração dos ativos obtidos ilegalmente no sistema financeiro.",
      E: "Subtração, alienação e lavagem física de cédulas papel e moedas em estabelecimentos autorizados."
    },
    correctAlternative: "D",
    explanation: "As três fases da lavagem de dinheiro são: 1. Colocação (inserir o dinheiro sujo no sistema); 2. Ocultação (camuflar a origem criminosa); 3. Integração (retornar o dinheiro ao fluxo econômico simulando origem lícita).",
    level: "médio"
  },
  {
    id: 38,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Para conter pressões inflacionárias severas sobre o consumo interno, o Copom (Comitê de Política Monetária do Banco Central) adota qual medida clássica padrão?",
    alternatives: {
      A: "Reduz a taxa básica de juros (Selic), estimulando ofertas de empréstimos sem juros adicionais.",
      B: "Aumenta a emissão física de notas bancárias no comércio varejista.",
      C: "Eleva a taxa Selic para encarecer o custo de crédito e reduzir a demanda agregada por consumo.",
      D: "Elimina barreiras alfandegárias de importação de vestuário.",
      E: "Obriga a fusão de bancos públicos estatais nacionais."
    },
    correctAlternative: "C",
    explanation: "Ao elevar a Selic, o crédito fica mais caro, desestimulando investimentos e consumo, o que contribui para desacelerar o ritmo da inflação.",
    level: "fácil"
  },
  {
    id: 39,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um dos títulos de crédito mais emitidos no apoio direto à produção agropecuária brasileira, isento de imposto de renda para pessoas físicas, representativo de promessa de pagamento em dinheiro é a:",
    alternatives: {
      A: "Duplicata Comercial Varejista (DCV)",
      B: "Debênture Perpétua Produtiva (DPP)",
      C: "Letra de Crédito do Agronegócio (LCA)",
      D: "Cédula de Crédito de Serviços Gerais (CCSG)",
      E: "Letra de Câmbio Agroindustrial (LCA)"
    },
    correctAlternative: "C",
    explanation: "A LCA (Letra de Crédito do Agronegócio) é um título de renda fixa lastreado em créditos do agronegócio que conta com isenção de IR para pessoas físicas.",
    level: "fácil"
  },
  {
    id: 40,
    subject: "Conhecimentos Bancários",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "O Conselho de Controle de Atividades Financeiras (COAF) possui como responsabilidade nuclear no âmbito do SFN:",
    alternatives: {
      A: "Arbitrar falências de seguradoras de saúde de grande porte nacional.",
      B: "Instaurar inquéritos criminais operacionais que levem à prisão de funcionários de corretoras digitais.",
      C: "Receber, examinar e identificar ocorrências suspeitas de atividades ilícitas, com ênfase na prevenção de lavagem de dinheiro.",
      D: "Fixar a cotação oficial diária para negociação de moedas e derivativos estrangeiros corporativos.",
      E: "Gerir por completo as contas de poupança clássica da totalidade de servidores civis da União."
    },
    correctAlternative: "C",
    explanation: "O COAF é o órgão de inteligência financeira do Brasil que atua na prevenção, detecção e combate à lavagem de dinheiro e financiamento ao terrorismo.",
    level: "médio"
  },

  // 15 CONHECIMENTOS DE INFORMÁTICA (41-55)
  {
    id: 41,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No Windows 10, qual atalho de teclado padrão serve para alternar rapidamente entre janelas funcionais abertas na Área de Trabalho de forma circular sequencial?",
    alternatives: {
      A: "Alt + Tab",
      B: "Ctrl + Espaço",
      C: "Windows + L",
      D: "Shift + Caps Lock",
      E: "Alt + F4"
    },
    correctAlternative: "A",
    explanation: "Alt + Tab permite navegar rapidamente e alternar janelas sob o gerenciador do Windows.",
    level: "fácil"
  },
  {
    id: 42,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um correntista desavisado recebeu um e-mail idêntico ao do Banco do Brasil com um link incentivando a atualizar suas senhas biométricas emergenciais. Ao clicar, revelou credenciais numéricas em formulário falso. Esse ataque é categorizado tecnicamente de:",
    alternatives: {
      A: "Ransomware sequestrador de disco",
      B: "Phishing por engenharia social",
      C: "Worm de auto-propagação rápida",
      D: "Trojan backdoor",
      E: "Buffer overflow administrativo"
    },
    correctAlternative: "B",
    explanation: "Phishing consiste em usar identidades falsas (como imitar bancos legítimos) para capturar senhas e informações sigilosas de vítimas voluntárias por meio de engano.",
    level: "fácil"
  },
  {
    id: 43,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No que se refere aos conceitos de redes de computadores, a principal diferença operacional que distingue a Internet de uma Intranet consiste em:",
    alternatives: {
      A: "A Internet usa a suíte de protocolos TCP/IP, enquanto a Intranet depende restritamente de conexões rádio micro-ondas privadas.",
      B: "A Internet possui abrangência pública e global, ao passo que a Intranet é de acesso privado e restrito a membros autorizados de uma organização.",
      C: "O protocolo FTP é proibido na rede mundial pública, sendo de uso exclusivo para transferências operacionais de agências locais.",
      D: "A velocidade física de transmissão da Internet é invariavelmente dez vezes superior à de qualquer rede corporativa física privada.",
      E: "A Intranet proíbe a implementação de páginas HTML, limitando-se ao compartilhamento de arquivos de texto simples unificados."
    },
    correctAlternative: "B",
    explanation: "Tanto Internet quanto Intranet compartilham as mesmas tecnologias e protocolos (TCP/IP), contudo a Intranet está limitada a um ambiente privado corporativo delimitado.",
    level: "fácil"
  },
  {
    id: 44,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Ao navegar no portal principal de serviços corporativos usando criptografia HTTPS, um pequeno candado verde aparece ao lado da barra de endereços. Esse ícone sinaliza a utilização de qual protocolo de segurança subjacente de dados?",
    alternatives: {
      A: "TLS / SSL",
      B: "SNMP",
      C: "Telnet",
      D: "WEP",
      E: "POP3"
    },
    correctAlternative: "A",
    explanation: "O cadeado indica que a comunicação HTTP está encapsulada usando criptografia simétrica e assimétrica baseada em protocolo de segurança de transporte SSL/TLS.",
    level: "fácil"
  },
  {
    id: 45,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No Microsoft Excel 365, para somar apenas os valores do intervalo B2:B10 que correspondam a registros da agência comercial 'Centro' no intervalo A2:A10, a fórmula ideal de busca condicional é:",
    alternatives: {
      A: "=SOMASE(A2:A10; \"Centro\"; B2:B10)",
      B: "=SOMASE(B2:B10; \"Centro\"; A2:A10)",
      C: "=PROCV(\"Centro\"; A2:B10; 2; FALSO)",
      D: "=CONT.SE(A2:A10; \"Centro\"; B2:B10)",
      E: "=CONCAT(A2:A10; B2:B10)"
    },
    correctAlternative: "A",
    explanation: "A função SOMASE exige: intervalo de critérios, critério em modo texto, e intervalo das células que serão efetivamente somadas.",
    level: "médio"
  },
  {
    id: 46,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Os sistemas operacionais modernos implementam o conceito de Memória Virtual. O objetivo prioritário dessa tecnologia de arquitetura de hardware é:",
    alternatives: {
      A: "Armazenar arquivos residuais excluídos para que sejam recuperáveis mesmo após limpeza física de discos ativas.",
      B: "Utilizar uma porção de espaço em disco rígido / SSD secundário para simular memória RAM adicional, permitindo executar programas que extrapolam a RAM física.",
      C: "Garantir o salvamento automático na nuvem em tempo real de planilhas locais para evitar prejuízos mecânicos residuais.",
      D: "Aumentar a frequência física real em clock do processador central para acelerar transferências multimídias internas.",
      E: "Criptografar arquivos de e-mail local para impedir adulterações de dados e ataques externos de vírus clássicos."
    },
    correctAlternative: "B",
    explanation: "A memória virtual expande temporariamente a capacidade da memória RAM utilizando o espaço de armazenamento de massa (página Swap ou arquivo de paginação).",
    level: "médio"
  },
  {
    id: 47,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Assinale a opção que descreve um tipo de malware silencioso que registra todas as teclas físicas pressionadas pelo usuário em teclados locais, capturando senhas durante digitação:",
    alternatives: {
      A: "Keylogger (Spyware)",
      B: "Adware publicitário",
      C: "Macro vírus",
      D: "Rootkit estrutural",
      E: "Logic bomb"
    },
    correctAlternative: "A",
    explanation: "O Keylogger é uma subclassificação de Spyware que monitora e reporta digitações físicas feitas no teclado físico, gravando segredos em arquivos de log secretos.",
    level: "fácil"
  },
  {
    id: 48,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Qual das opções apresenta um serviço que atua traduzindo endereços IP numéricos para nomes legíveis e resolvendo domínios válidos digitados no navegador padrão?",
    alternatives: {
      A: "DHCP",
      B: "DNS",
      C: "SMTP",
      D: "RIP",
      E: "IPv6"
    },
    correctAlternative: "B",
    explanation: "O DNS (Domain Name System) mapeia nomes com IPs numéricos reais, permitindo a correta conexão com os servidores de destino na Internet.",
    level: "fácil"
  },
  {
    id: 49,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No ambiente corporativo de cloud computing, a arquitetura onde a provedora oferece ao cliente recursos de hardware cru (processamento, RAM, servidores virtuais e armazenamento em massa), ficando o cliente encarregado por configurar Sistemas e Softwares é dominada:",
    alternatives: {
      A: "SaaS (Software as a Service)",
      B: "IaaS (Infrastructure as a Service)",
      C: "PaaS (Platform as a Service)",
      D: "BaaS (Backend as a Service)",
      E: "DaaS (Desktop as a Service)"
    },
    correctAlternative: "B",
    explanation: "IaaS fornece infraestrutura básica flexível (máquinas virtuais, storages, redes) para o cliente implantar seus sistemas operacionais e servidores sob medida.",
    level: "médio"
  },
  {
    id: 50,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "A LGPD (Lei Geral de Proteção de Dados) estipula limites exigentes de segurança corporativa. Qual sanção administrativa é cabível diretamente às instituições financeiras que sofrerem vazamentos culposos de bancos de dados contendo PII sob regência da ANPD?",
    alternatives: {
      A: "Prisão perpétua imposta a todos os gerentes operacionais de computação da localidade.",
      B: "Multa de até 2% do faturamento da pessoa jurídica limitada a R$ 50 milhões de reais por infração cometida.",
      C: "Confisco imediato e definitivo de todas as reservas cambiais metálicas custodiadas pelo banco herdeiro.",
      D: "Obrigatoriedade de suspender o atendimento por tempo indeterminado de todas as agências físicas nacionais.",
      E: "Eliminar a cobrança de IPTU anual para as vítimas que comprovarem perdas no Pix residencial."
    },
    correctAlternative: "B",
    explanation: "Conforme a LGPD, a multa administrativa pecuniária imposta por infração pode atingir até 2% do faturamento limitada ao teto estatutário de R$ 50 milhões.",
    level: "difícil"
  },
  {
    id: 51,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Em relação ao ecossistema moderno de Inteligência Artificial e Processamento de Linguagem Natural, o que representa em computação a sigla LLM?",
    alternatives: {
      A: "Lines of Code Language Management",
      B: "Large Language Model",
      C: "Local Listening Mechanism",
      D: "Low Latency Machine",
      E: "Logarithmic Learning Module"
    },
    correctAlternative: "B",
    explanation: "Large Language Models (LLM) são modelos de linguagem de grande escala, treinados em massivos volumes textuais para gerar e resumir textos de forma inteligente.",
    level: "fácil"
  },
  {
    id: 52,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No contexto da criptografia assimétrica, qual o papel desempenhado pela chave pública de um usuário?",
    alternatives: {
      A: "Criptografar mensagens destinadas a esse usuário, as quais só poderão ser abertas por sula correspondente chave privada.",
      B: "Descriptografar qualquer arquivo contido em repositórios abertos de servidores de nuvem livres.",
      C: "Autenticar acessos físicos a caixas eletrônicos de terminais de agências por autenticação de chip.",
      D: "Exibir o histórico nominal completo de todas as contas abertas de correntistas em bancos de capitais.",
      E: "Gerar duplicatas comerciais digitais isentas de imposto sobre importação cambial corporativo."
    },
    correctAlternative: "A",
    explanation: "Na criptografia assimétrica, a chave pública codifica a mensagem de forma que apenas o detentor da respectiva chave privada secreta correspondente possa decodificá-la.",
    level: "difícil"
  },
  {
    id: 53,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Assinale a opção que melhor define a utilidade de uma rede privada virtual, vulgo VPN, nas rotinas dos analistas comerciais do Banco do Brasil:",
    alternatives: {
      A: "Multiplicar por quatro a velocidade de downloads de arquivos internos de treinamento em vídeo.",
      B: "Permitir conexões remotas seguras através da Internet criptografando o canal de comunicação para proteger dados institucionais privados.",
      C: "Excluir automaticamente propagandas indesejadas de navegadores locais e chats pessoais de usuários.",
      D: "Criar moedas digitais sob custódia interna de TI para pagar fomento agrário rural sem imposto cambial.",
      E: "Garantir a ausência de quedas físicas na rede de energia elétrica de agências comerciais do interior."
    },
    correctAlternative: "B",
    explanation: "Uma VPN cria um túnel seguro criptografado sobre redes públicas (como a Internet), protegendo a privacidade e integridade das conexões home office corporativas.",
    level: "médio"
  },
  {
    id: 54,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Os navegadores Google Chrome e Microsoft Edge possuem recursos de navegação Privada ou Anônima. A principal consequência ativada ao abrir essa aba especial é:",
    alternatives: {
      A: "Impedir por completo que provedoras de Internet monitorem os sites externos visualizados durante sessão ativa.",
      B: "Tornar o computador imune a vírus, ransomwares e scripts maliciosos injetados por sites clonados de lazer.",
      C: "Não salvar dados digitados em formulários, histórico de navegação e arquivos cookies ao encerrar a sessão.",
      D: "Esconder por completo o endereço IP físico da máquina contornando barreiras alfandegárias governamentais.",
      E: "Ocultar o acesso de relatórios internos do painel de monitoramento do conselho diretor de TI do banco."
    },
    correctAlternative: "C",
    explanation: "Abas anônimas impedem que o navegador armazene localmente o rastro da sessão (cookies, histórico, preenchimentos) após ser encerrada, mas não ocultam dados na origem / rede externa.",
    level: "fácil"
  },
  {
    id: 55,
    subject: "Conhecimentos de Informática",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No Microsoft Word 365, para aplicar rapidamente recuo de parágrafo e alinhar o texto justificado, o atalho rápido padrão no teclado é:",
    alternatives: {
      A: "Ctrl + J",
      B: "Ctrl + Q",
      C: "Ctrl + E",
      D: "Ctrl + G",
      E: "Ctrl + I"
    },
    correctAlternative: "A",
    explanation: "No software de processamento Word em português do Brasil, o atalho Ctrl + J justifica o texto selecionado de uma só vez.",
    level: "fácil"
  },

  // 15 VENDAS E NEGOCIAÇÃO (56-70)
  {
    id: 56,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Na abordagem moderna do Marketing de Relacionamento dentro de grandes redes varejistas do setor financeiro, o conceito central do 'CLV' (Customer Lifetime Value) representa:",
    alternatives: {
      A: "O índice de reclamações totais acumuladas por um cliente com direito à reparação pecuniária judicial.",
      B: "O valor financeiro líquido acumulado estimado que um cliente traz ao longo de toda a duração de sua parceria comercial.",
      C: "O custo cobrado para emitir faturas impressas mensais para aposentados em caixas eletrônicos presenciais.",
      D: "A velocidade nominal média de abertura de novas pastas de custódia corporativa em pregão financeiro.",
      E: "Um limitador fixado de empréstimos sem garantias ativas para novos microempresários locais."
    },
    correctAlternative: "B",
    explanation: "CLV é o Lifetime Value (Valor do Tempo de Vida do Cliente), que mede a projeção de receitas de negócios gerada por um cliente ao longo do seu relacionamento comercial.",
    level: "médio"
  },
  {
    id: 57,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No que se refere às técnicas de negociação no setor de varejo bancário, o fenômeno conhecido pela sigla BATNA (Best Alternative to a Negotiated Agreement) orienta o gerente comercial a:",
    alternatives: {
      A: "Subordinar-se por completo a todas as demandas impostas pelo cliente para fechar a negociação imediatamente.",
      B: "Conhecer sua melhor alternativa de ação fora da mesa de negociações caso a tratativa atual falhe, determinando seu limite seguro.",
      C: "Aplicar propostas agressivas baseadas em mentiras operacionais sobre fundos de renda fixa pós-fixadas.",
      D: "Denunciar à ouvidoria clientes exigentes que demonstrem saber taxas cobradas em concorrências externas.",
      E: "Cancelar o consórcio em andamento de pequenos agricultores para direcionar recursos a outras carteiras mais ativas."
    },
    correctAlternative: "B",
    explanation: "BATNA (MAPNA em português) é a melhor alternativa para um acordo negociado, definindo o ponto em que o negociador deve declinar da proposta atual.",
    level: "difícil"
  },
  {
    id: 58,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "A técnica clássica de vendas baseada no acrônimo 'AIDA' define as etapas sequenciais pelas quais um consumidor se movimenta até a aquisição de um consórcio ou capitalização. Esse fluxo é formado por:",
    alternatives: {
      A: "Ação, Inovação, Detecção, Alocação",
      B: "Atenção, Interesse, Desejo, Ação",
      C: "Agilidade, Intermediação, Devolução, Apoio",
      D: "Atração, Informação, Detalhamento, Aprovação",
      E: "Amizade, Idoneidade, Decisão, Atendimento"
    },
    correctAlternative: "B",
    explanation: "O funil de vendas AIDA estipula que a venda flui gerando primeiramente Atenção, estimulando Interesse genuíno, gerando Desejo forte de compra, que culmina na Ação de fechamento.",
    level: "fácil"
  },
  {
    id: 59,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um gerente comercial utiliza a técnica de Cross-Selling de modo ético e alinhado aos conselhos institucionais. Qual das opções representa uma aplicação factual dessa metodologia?",
    alternatives: {
      A: "Vender um empréstimo consignado atrelado obrigatoriamente à contratação contratual sem opção de exclusão de um plano dental.",
      B: "Oferecer a um cliente que acaba de abrir conta comercial, um cartão corporativo integrado com condições facilitadas de maquininhas de venda.",
      C: "Aplicar juros diferenciados fraudulentos em duplicatas para bater metas corporativas urgentes de agências de custódia.",
      D: "Incentivar saques sistemáticos da poupança clássica rural para investimento em loterias governamentais de luxo.",
      E: "Bloquear acesso remoto ao Pix corporativo até o fechamento de consórcio de caminhão de pequeno porte."
    },
    correctAlternative: "B",
    explanation: "Cross-Selling (venda cruzada) consiste em agregar e sugerir produtos complementares associados às necessidades originais demonstradas pelo cliente, sem configurar venda casada ilícita.",
    level: "fácil"
  },
  {
    id: 60,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "O Código de Defesa do Consumidor (CDC) proíbe expressamente a 'Venda Casada'. Assinale a alternativa que descreve uma infração clara e tipificada a essa prerrogativa nas operações financeiras habituais:",
    alternatives: {
      A: "Exigir assinatura eletrônica de documentos para consolidar empréstimos e prevenir fraudes cadastrais.",
      B: "Vender uma apólice de seguro habitacional e forçar o consumidor a aceitar estritamente o seguro oferecido pelo próprio agente, sem dar a opção de escolher outra seguradora concorrente.",
      C: "Oferecer isenções de taxas de custódia para investidores com mais de cem mil reais aplicados em fundos ESG.",
      D: "Cobrar tarifas administrativas tabeladas por correspondências físicas enviadas trimestralmente à residência de aposentados.",
      E: "Permitir amortização antecipada de juros em SAC reduzindo saldo devedor de modo claro."
    },
    correctAlternative: "B",
    explanation: "Determinar a contratação compulsória de seguro junto ao banco credor, sem possibilidade de apólices equivalentes de seguradoras independentes é prática ilegal de venda casada sob regência do CDC.",
    level: "médio"
  },
  {
    id: 61,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No contexto da gestão da experiência do cliente (Customer Experience), o indicador 'NPS' (Net Promoter Score) é medido por meio de qual indagação nuclear formulada ao correntista?",
    alternatives: {
      A: "Qual a probabilidade de você indicar os serviços dessa instituição para um amigo ou familiar, em uma escala de 0 a 10?",
      B: "Quantas vezes você compareceu fisicamente a uma agência comercial bancária no trimestre anterior?",
      C: "Sua renda familiar atende aos requisitos mínimos para liberação imediata de crédito agrícola ouro?",
      D: "Você deseja renegociar créditos em atraso cobrados eletronicamente em rotativo de cartões?",
      E: "Qual a senha secreta cadastrada para transacionar no aplicativo móvel oficial do banco estatal?"
    },
    correctAlternative: "A",
    explanation: "O Net Promoter Score (NPS) avalia o grau de lealdade e recomendação dos clientes por meio da famosa pergunta definitiva, gerando classificação em detratores, neutros ou promotores.",
    level: "fácil"
  },
  {
    id: 62,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "A Resolução CMN nº 4.949 estabelece regras importantes sobre o relacionamento ético de cooperativas e bancos com seus clientes. Qual das ações contraria frontalmente tais regras?",
    alternatives: {
      A: "Fornecer faturas detalhadas explicando tarifas cobradas e explicando caminhos corretos de ouvidorias disponíveis.",
      B: "Utilizar tom jocoso, vexatório ou constsubordinado para coagir adimplentes e inadimplentes durante chamadas comerciais de cobrança.",
      C: "Disponibilizar contratos e termos prévios transcritos de investimentos em tamanhos de fontes legíveis.",
      D: "Permitir a portabilidade gratuita de crédito imobiliário a qualquer momento para outra instituição autorizada.",
      E: "Informar os riscos inerentes de oscilações de dividendos em ofertas de títulos privados ativos."
    },
    correctAlternative: "B",
    explanation: "É dever ético tratar os clientes com respeito e integridade, sendo cabível punição legal para cobranças vexatórias ou constrangimentos impostos aos clientes de qualquer natureza.",
    level: "fácil"
  },
  {
    id: 63,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Dentro de um funil de prospecção corporativo comercial de consórcios imobiliários, a etapa rotulada de 'Qualificação' caracteriza-se por:",
    alternatives: {
      A: "Efetuar abordagens físicas diretas em residências sem aviso prévio enviando cobranças fiscais de teste.",
      B: "Filtrar os leads gerados, separando os que possuem real interesse, poder aquisitivo e aderência à proposta comercial.",
      C: "Forçar idosos a aderir a empréstimos por telefone desligando caso recusem categoricamente a proposta.",
      D: "Parabenizar funcionários das agências por realizarem palestre de agronegócio rural.",
      E: "Reduzir as taxas mínimas mensais de atendimento de contas para clientes desprovidos de investimentos."
    },
    correctAlternative: "B",
    explanation: "A etapa de qualificação no funil assegura que o tempo da equipe comercial seja alocado com foco em clientes reais com potencial verificado e intenção compatível de compra.",
    level: "médio"
  },
  {
    id: 64,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Um dos atalhos mentais de tomada de decisão, chamados de Gatilhos Mentais, é a 'Reciprocidade'. No atendimento de agências bancárias, esse gatilho opera quando:",
    alternatives: {
      A: "O gerente de contas impõe limites de crédito agressivos para prender o correntista à instituição.",
      B: "O especialista do banco entrega valor gratuito prévio relevante (como uma planilha de finanças ou assessoria sincera), despertando na pessoa o desejo natural de retribuir fechando o produto proposto.",
      C: "O banco distribui brindes de baixo custo estritamente para pessoas inadimplentes como punição social implícita.",
      D: "A ouvidoria ignora reclamações recorrentes forçando o cliente a comparecer na superintendência estadual central.",
      E: "O atendente realiza vendas com linguagem e promessas de retornos exorbitantes insustentáveis."
    },
    correctAlternative: "B",
    explanation: "A reciprocidade baseia-se na tendência humana natural de retribuir sentimentos e favores positivos prévios prestados de boa-fé.",
    level: "fácil"
  },
  {
    id: 65,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "A matriz SWOT (F.O.F.A) é um instrumento elementar utilizado por equipes de marketing do Banco do Brasil. Qual dos componentes refere-se a um fator estritamente do ambiente externo e desfavorável?",
    alternatives: {
      A: "Fraquezas (Weaknesses)",
      B: "Ameaças (Threats)",
      C: "Oportunidades (Opportunities)",
      D: "Forças (Strengths)",
      E: "Desafios Organizacionais Internos (DOI)"
    },
    correctAlternative: "B",
    explanation: "Ameaças correspondem a fatores desfavoráveis (barreiras macroeconômicas, concorrentes, inflação) emanados do ambiente puramente externo sobre o qual a empresa possui pouco ou nenhum controle.",
    level: "fácil"
  },
  {
    id: 66,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "No desdobramento do composto de marketing, comumente denominado '4Ps', quando um banco estatal decide reduzir ou isentar tarifas de contas digitais e anuidade de cartões, ele está atuando diretamente sobre o componente de:",
    alternatives: {
      A: "Praça",
      B: "Promoção",
      C: "Preço",
      D: "Produto",
      E: "Processo"
    },
    correctAlternative: "C",
    explanation: "Tarifas, taxas, anuidades e encargos de contratação compõem o pilar de 'Preço' do produto oferecido ao correntista.",
    level: "fácil"
  },
  {
    id: 67,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Em uma simulação de negociação, o correntista demonstra forte resistência contra adquirir determinado seguro residencial, alegando que o valor mensal excede suas economias programadas. Trata-se de uma objeção comum de:",
    alternatives: {
      A: "Falta de Necessidade imediata",
      B: "Falta de Confiança na seguradora",
      C: "Preço / Custo financeiro",
      D: "Urgência protelada",
      E: "Desconfiança logística operacional"
    },
    correctAlternative: "C",
    explanation: "Quando o empecilho apontado refere-se à taxa ou montante a ser despendido, caracteriza-se uma objeção de Preço/Valor financeiro imposta à mesa.",
    level: "fácil"
  },
  {
    id: 68,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Dentre os modelos clássicos de segmentação de clientela no varejo, o modelo RFV fundamenta a tomada de decisão comercial baseando-se em três métricas cruciais de conduta do correntista:",
    alternatives: {
      A: "Renda, Frequência, Volatilidade cambial",
      B: "Recência, Frequência, Valor monetário gasto",
      C: "Relacionamento, Fomento, Vendas efetuadas",
      D: "Retorno de ações, Fluxo de caixa de derivativos, Volumes",
      E: "Registro civil, Filiação, Votações éticas conselho"
    },
    correctAlternative: "B",
    explanation: "O índice RFV segmenta com precisão avaliando a Recência (há quanto tempo fez a última transação), Frequência (com qual constância faz) e Valor acumulado investido/gasto.",
    level: "médio"
  },
  {
    id: 69,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Uma campanha de e-mail marketing que possui taxa de cliques (Click-Through Rate - CTR) de 5% em 10.000 mensagens disparadas com relativo sucesso de entregas, registrou quantos cliques direcionados para a página final do simulado?",
    alternatives: {
      A: "50 cliques",
      B: "500 cliques",
      C: "5.000 cliques",
      D: "250 cliques",
      E: "1.000 cliques"
    },
    correctAlternative: "B",
    explanation: "Multiplicação direta: 10.000 * 5% (0,05) = 500 cliques efetivados.",
    level: "fácil"
  },
  {
    id: 70,
    subject: "Vendas e Negociação",
    reference: "CESGRANRIO | Banco do Brasil | Escriturário — Agente Comercial | Simulado Autoral Jornada BB | Estilo 2023",
    enunciado: "Na prospecção qualificada de crédito, qual ação comercial preventiva do agente minimiza cancelamentos indesejados pós-fechamento (Churn Rate)?",
    alternatives: {
      A: "Ocultar cláusulas de multas em letras reduzidas induzindo o cliente a crer que dispõe de carência gratuita.",
      B: "Praticar o Overpromising vendendo ganhos irreais agressivos que frustram seguras expectativas pós-venda.",
      C: "Realizar o alinhamento transparente de expectativas do produto comercial detalhando prazos e de forma humanizada prestando suporte de acolhimento.",
      D: "Rejeitar chamadas telefônicas de clientes recém-captados direcionando toda atenção à prospecção fria.",
      E: "Interromper transações de portabilidades de agências de custódias concorrentes sem justificativas legais."
    },
    correctAlternative: "C",
    explanation: "Para reduzir Churn (perda voluntária de clientes), a transparência comercial e o alinhamento sincero de expectativas criam uma experiência de confiabilidade sustentável a longo prazo.",
    level: "médio"
  }
];
