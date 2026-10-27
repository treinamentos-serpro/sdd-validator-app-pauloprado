## Overview

O produto é uma aplicação para consultar informações meteorológicas de cidades. O MVP deve permitir pesquisar e selecionar uma cidade, consultar seu clima atual e uma previsão que abrange hoje e os quatro dias seguintes, e alternar a unidade de temperatura entre Celsius e Fahrenheit. A fonte de dados inicial será o Open-Meteo, sem API key. A interface será em pt-BR, Celsius será a unidade padrão e não haverá autenticação nem persistência de dados no servidor.

O objetivo é permitir que a pessoa usuária encontre informações meteorológicas da localidade desejada e as use para planejar atividades. O público prioritário, as métricas de sucesso e as necessidades que devem orientar decisões de produto ainda precisam ser validados.

## Functional Requirements

- **FR-01 — Buscar cidades:** permitir que a pessoa usuária pesquise cidades pelo nome.
- **FR-02 — Selecionar cidade:** permitir que a pessoa usuária selecione a cidade desejada quando a busca retornar mais de um resultado.
- **FR-03 — Consultar clima atual:** apresentar as condições meteorológicas atuais da cidade selecionada.
- **FR-04 — Consultar previsão:** apresentar a previsão da cidade selecionada para hoje e os quatro dias seguintes. A granularidade diária ou horária ainda não foi decidida.
- **FR-05 — Alternar unidades:** permitir alternar entre Celsius e Fahrenheit nos valores de temperatura apresentados. Celsius é a unidade padrão.
- **FR-06 — Atualizar dados por cidade:** ao selecionar outra cidade, apresentar o clima atual e a previsão correspondentes à nova seleção.
- **FR-07 — Informar falhas:** informar quando uma cidade não for encontrada ou quando não for possível obter os dados meteorológicos.
- **FR-08 — Indicar carregamento:** indicar quando uma busca ou atualização dos dados estiver em andamento.

## User Stories

As personas abaixo são hipóteses baseadas em usos comuns de um aplicativo de clima; não representam pesquisa confirmada e devem ser validadas com o público-alvo.

- **US-01 — Pessoa que se desloca diariamente:** Como pessoa que se desloca diariamente (hipótese de persona), quero buscar uma cidade e consultar seu clima atual e sua previsão para planejar roupa, trajeto e itens necessários.
- **US-02 — Profissional que trabalha ao ar livre:** Como profissional que trabalha ao ar livre (hipótese de persona), quero selecionar a cidade de trabalho e consultar o clima atual e a previsão para decidir se preciso ajustar minha rotina ou meus equipamentos.
- **US-03 — Pessoa planejando uma viagem:** Como pessoa planejando uma viagem (hipótese de persona), quero buscar e selecionar a cidade do destino e consultar o clima atual e a previsão para planejar o que levar.
- **US-04 — Pessoa usuária que prefere outra unidade:** Como pessoa usuária que prefere outra unidade de temperatura, quero alternar entre Celsius e Fahrenheit para interpretar os valores na unidade que prefiro.

## Acceptance Criteria

- **AC-01 (US-01, US-02, US-03; FR-01):** ao enviar o nome de uma cidade em uma busca, a aplicação apresenta resultados de cidades correspondentes ou informa que nenhum resultado foi encontrado. Os formatos de entrada aceitos permanecem sujeitos à decisão registrada em Open Questions.
- **AC-02 (US-01, US-02, US-03; FR-02):** quando a busca apresentar mais de uma cidade, cada resultado pode ser selecionado; após a seleção, a cidade escolhida fica identificada como a cidade consultada. A informação contextual usada para distinguir homônimos permanece sujeita à decisão registrada em Open Questions.
- **AC-03 (US-01, US-02, US-03; FR-03):** para uma cidade selecionada com dados atuais disponíveis, a aplicação apresenta dados identificáveis como clima atual e associados àquela cidade. Os campos meteorológicos específicos permanecem sujeitos à decisão registrada em Open Questions.
- **AC-04 (US-01, US-02, US-03; FR-04):** para uma cidade selecionada com previsão disponível, a aplicação apresenta um período que inclui hoje e os quatro dias seguintes, totalizando cinco datas do calendário conforme a definição de fuso horário a ser decidida. A granularidade e os campos de cada período permanecem sujeitos à decisão registrada em Open Questions.
- **AC-05 (US-04; FR-05):** na primeira consulta, os valores de temperatura são apresentados em Celsius. Após solicitar Fahrenheit, os valores de temperatura apresentados passam a usar Fahrenheit; ao solicitar Celsius, passam a usar Celsius. A conversão deve corresponder à unidade selecionada em todos os campos de temperatura que vierem a ser definidos. A forma de arredondamento e o escopo exato dos campos permanecem sujeitos à decisão registrada em Open Questions.
- **AC-06 (US-01, US-02, US-03; FR-06):** depois de selecionar outra cidade, a identificação da cidade e os dados meteorológicos apresentados correspondem à nova seleção, e não à cidade anteriormente consultada.
- **AC-07 (US-01, US-02, US-03; FR-07):** se a busca não encontrar cidades, a aplicação informa que não houve resultado; se a obtenção dos dados meteorológicos falhar, informa que os dados não puderam ser obtidos. Nenhum dado indisponível deve ser apresentado como uma resposta atual bem-sucedida.
- **AC-08 (US-01, US-02, US-03; FR-08):** durante uma busca e durante a obtenção ou atualização de dados meteorológicos, a aplicação exibe uma indicação de carregamento até a operação terminar ou falhar.

## Non-Functional Requirements

Os valores e níveis abaixo são metas iniciais propostas pelo discovery e precisam ser validados; não são compromissos já aprovados.

- **NFR-01 — Responsividade:** meta inicial de uso entre 320 px e 1440 px de largura, sem rolagem horizontal nem sobreposição de conteúdo nos fluxos de busca, seleção e consulta. Validar faixa, dispositivos e orientações com as partes interessadas.
- **NFR-02 — Usabilidade:** como objetivo inicial, permitir buscar e selecionar uma cidade e alternar a unidade sem instruções externas. Definir método de avaliação e meta quantitativa de sucesso durante o planejamento.
- **NFR-03 — Acessibilidade:** buscar conformidade com WCAG 2.2 nível AA, incluindo operação por teclado, foco visível, nomes acessíveis para controles e contraste adequado. O nível exigido ainda precisa ser confirmado.
- **NFR-04 — Performance:** meta inicial de p95 de até 3 segundos entre a ação de busca e a apresentação dos resultados, em condições normais de rede. Validar a meta, as condições de medição e como a latência do provedor será contabilizada.
- **NFR-05 — Disponibilidade:** proposta inicial de disponibilidade mensal mínima de 99,5% para a aplicação, excluindo indisponibilidades do provedor externo. Validar meta, janela de medição e exclusões.
- **NFR-06 — Integridade e atualidade:** os valores apresentados devem corresponder à cidade e à unidade selecionadas. Dados indisponíveis ou vencidos não devem ser apresentados como atuais. Frequência, validade e indicação da última atualização ainda precisam ser definidas.
- **NFR-07 — Compatibilidade:** proposta inicial de suporte às versões atuais e imediatamente anteriores dos navegadores móveis e desktop prioritários. Definir a matriz de navegadores, versões, sistemas operacionais e dispositivos antes de validar compatibilidade.
- **NFR-08 — Segurança e privacidade:** proposta de usar HTTPS em todas as comunicações e não coletar nem armazenar localização precisa sem necessidade e consentimento explícito. Confirmar requisitos corporativos, legais, de retenção e privacidade aplicáveis.

## Edge Cases

- A busca não encontra cidade correspondente ou recebe uma entrada inválida; o serviço de busca também pode falhar. O tratamento exato de entradas e mensagens ainda precisa ser definido.
- A busca retorna cidades homônimas, nomes com acentos, aliases ou resultados de localidades distintas; os formatos aceitos e os dados de desambiguação ainda precisam ser definidos.
- A cidade selecionada não tem dados atuais ou previsão disponíveis, ou o provedor retorna dados incompletos.
- O provedor está indisponível, responde com erro ou demora além do limite que vier a ser definido; timeout, cache e apresentação de dados anteriores ainda precisam ser decididos.
- A resposta está vencida ou sua última atualização não pode ser determinada; o limite de validade e a apresentação do horário de atualização ainda precisam ser definidos.
- O fuso da cidade atravessa a meia-noite ou difere do fuso da pessoa usuária, afetando a definição de hoje e os limites das cinco datas da previsão.
- Há alternância de unidade antes ou durante a exibição de dados, e diferentes campos de temperatura podem exigir conversão consistente; campos abrangidos e arredondamento ainda precisam ser definidos.
- A pessoa usuária está em uma rede móvel lenta ou perde a conexão durante a busca ou atualização; o comportamento offline e a eventual apresentação de cache ainda precisam ser definidos.

## Assumptions

- Open-Meteo é a fonte de dados inicial e a integração não requer API key; cobertura, termos, limites e disponibilidade ainda precisam ser validados.
- O período da previsão compreende hoje e os quatro dias seguintes; granularidade e fuso horário continuam em aberto.
- Celsius é a unidade padrão. A alternância para Fahrenheit é necessária, mas o conjunto de campos convertido e a persistência da preferência não foram decididos.
- Não haverá autenticação nem persistência de dados no servidor. Persistência local no navegador continua em aberto.
- A interface será em português do Brasil. Formatos de data e hora continuam em aberto.
- A experiência deve funcionar em dispositivos móveis por meio de uma interface responsiva; aplicativo nativo não foi confirmado.
- As três personas descritas são hipóteses para validação, não evidência confirmada sobre público ou comportamento.
- Busca por nome de cidade é o requisito confirmado; sugestões, formatos adicionais e regras detalhadas de busca não foram confirmados.

## Risks

- **Necessidade e público não validados:** o produto pode priorizar informações inadequadas ou não gerar adoção. Mitigação: validar personas e casos de uso com o público-alvo e definir critérios de sucesso antes de fechar o MVP.
- **Escopo meteorológico ambíguo:** falta decidir campos atuais, granularidade e conteúdo da previsão, criando risco de retrabalho e divergência de expectativa. Mitigação: resolver essas perguntas e derivar critérios específicos antes do planejamento técnico.
- **Dependência do Open-Meteo:** latência, indisponibilidade, limites, cobertura, termos ou custos podem inviabilizar o uso previsto. Mitigação: validar essas condições e volume estimado antes da integração; definir tratamento de falha, validade de cache e monitoramento após confirmar as políticas aplicáveis.
- **Geocodificação e localidades homônimas:** cobertura insuficiente ou desambiguação inadequada pode levar a uma cidade errada. Mitigação: validar cidades representativas e definir contexto regional nos resultados; testar acentos, aliases e homônimos depois de decidir as regras de busca.
- **Dados vencidos ou associados ao dia errado:** frequência, validade e fuso não definidos podem levar a interpretações incorretas. Mitigação: definir essas regras, indicar a última atualização e testar limites de data e fuso antes de declarar dados como atuais.
- **Privacidade e expansão de escopo:** localização automática, histórico ou persistência podem introduzir coleta de dados e obrigações não previstas. Mitigação: manter esses itens fora do MVP até priorização explícita e revisar necessidade, consentimento e retenção antes de qualquer coleta ou armazenamento.
- **Qualidade em dispositivos e acessibilidade:** matriz de compatibilidade e critérios de acessibilidade ainda não estão validados. Mitigação: confirmar dispositivos prioritários e avaliar responsividade, teclado e acessibilidade desde os primeiros testes.
- **Performance, disponibilidade e operação:** metas propostas, volume esperado, monitoramento e responsáveis ainda não foram acordados. Mitigação: validar metas e volume, medir consultas em condições representativas e definir monitoramento e resposta operacional antes do lançamento.
- **Conversão de unidades:** escopo de conversão e arredondamento indefinidos podem produzir valores inconsistentes. Mitigação: decidir campos abrangidos e regra de apresentação e verificar consistência entre clima atual e previsão.

## Out of Scope

- Autenticação, contas de usuário e sincronização entre dispositivos.
- Persistência de dados do usuário no servidor.
- Localização automática ou coleta de localização do dispositivo como comportamento do MVP.
- Alertas meteorológicos, notificações, favoritos, histórico, compartilhamento e outras funcionalidades adicionais não confirmadas para o MVP.
- Aplicativo nativo para dispositivos móveis; o requisito confirmado é uso em dispositivos móveis com experiência responsiva.
- Garantia de funcionamento offline ou apresentação de dados armazenados em cache; comportamento depende de decisão futura.

## Open Questions

- **Busca e cidades:** quais entradas além do nome da cidade serão aceitas (país, estado, código postal ou coordenadas)? Haverá sugestões enquanto a pessoa digita? Como distinguir cidades homônimas? A busca aceitará acentos, aliases, transliterações e nomes em outros idiomas? Qual será o comportamento detalhado para entradas inválidas, ausência de resultados e falha do serviço?
- **Granularidade:** a previsão para hoje e os quatro dias seguintes será diária, horária ou incluirá ambas?
- **Fuso e formatos:** qual fuso define “hoje” e os limites do período de cinco dias? Quais formatos pt-BR serão usados para datas e horários?
- **Campos meteorológicos:** quais campos compõem o clima atual e cada período da previsão, incluindo temperatura, sensação térmica, condição, umidade, vento, precipitação, mínimas e máximas ou probabilidade de chuva?
- **Atualização e validade:** com que frequência os dados serão atualizados? Qual será o limite de validade, como será indicada a última atualização e como serão tratados dados vencidos, incompletos ou divergentes?
- **Open-Meteo:** quais são os termos de uso, limites de requisição, cobertura geográfica, disponibilidade, custos aplicáveis e garantias do provedor? Como serão avaliadas precisão e indisponibilidade por localidade?
- **Persistência local:** a aplicação deve lembrar no navegador a última cidade, a unidade, favoritos ou histórico? Por quanto tempo e com qual comportamento entre sessões?
- **Localização:** haverá detecção de localização do dispositivo? Se houver, será opcional, dependerá de permissão e terá consentimento explícito?
- **Unidades:** quais campos de temperatura serão convertidos para Fahrenheit e Celsius? Como serão definidos conversão, arredondamento e apresentação? A unidade escolhida será lembrada apenas durante a sessão ou no navegador?
- **Qualidade e compatibilidade:** quais metas de performance e disponibilidade serão aprovadas, sob quais condições e com quais exclusões? Quais navegadores, versões, sistemas operacionais, dispositivos, tamanhos e orientações serão prioritários?
- **Produto e prioridade:** quais são os critérios de sucesso mensuráveis, qual segmento será prioritário e as hipóteses das três personas serão confirmadas? Alertas, favoritos, histórico, notificações ou outros recursos serão considerados em uma fase posterior?
- **Volume e operação:** qual o volume inicial e de pico de usuários e consultas? Onde a aplicação será publicada, quais ambientes serão necessários, quem fará monitoramento e suporte e quais métricas, alertas e procedimentos de resposta serão exigidos?
- **Privacidade e segurança:** haverá analytics ou coleta de dados pessoais? Quais dados poderão ser guardados, por quanto tempo e com qual consentimento? Quais requisitos legais e corporativos se aplicam a privacidade, segurança, retenção, gestão de segredos e proteção contra abuso?
- **Acessibilidade e usabilidade:** WCAG 2.2 AA será o nível exigido? Qual método e qual meta quantitativa serão usados para avaliar usabilidade e sucesso dos fluxos?
- **Falhas e conectividade:** quais timeouts e mensagens serão usados? Em falhas do provedor, será exibido erro ou cache e por quanto tempo? A aplicação deve oferecer algum comportamento offline?
- **Plataforma e conteúdo:** a experiência será apenas web responsiva ou há intenção de aplicativo nativo futuro? Existem identidade visual, tom de voz ou diretrizes de conteúdo a seguir?