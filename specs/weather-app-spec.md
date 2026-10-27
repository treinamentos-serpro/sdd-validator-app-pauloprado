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

- **US-01 (FR-01):** Como pessoa que se desloca diariamente, quero buscar uma cidade pelo nome para consultar o tempo do local onde estarei.
- **US-02 (FR-02):** Como pessoa planejando uma viagem, quero selecionar a cidade correta entre os resultados da busca para confirmar a previsão do meu destino.
- **US-03 (FR-03):** Como profissional que trabalha ao ar livre, quero consultar o clima atual da cidade de trabalho para preparar minha rotina e meus equipamentos.
- **US-04 (FR-04):** Como pessoa planejando uma viagem, quero consultar a previsão de hoje e dos quatro dias seguintes para decidir o que levar.
- **US-05 (FR-05):** Como pessoa que se desloca diariamente, quero alternar entre Celsius e Fahrenheit para interpretar a temperatura na unidade que prefiro.
- **US-06 (FR-06):** Como pessoa planejando uma viagem, quero selecionar outra cidade e ver os dados atualizados para planejar atividades no destino correto.
- **US-07 (FR-07):** Como pessoa que se desloca diariamente, quero receber uma mensagem quando a busca ou consulta falhar para saber que não posso confiar em dados indisponíveis.
- **US-08 (FR-08):** Como profissional que trabalha ao ar livre, quero ver quando uma busca ou atualização está em andamento para saber que o app está processando minha consulta.

## Acceptance Criteria

Para automação, os cenários usam respostas controladas do Open-Meteo e um relógio fixo. Nenhum critério depende de uma chamada à API real.

- **AC-01 (US-01; FR-01)**
	- **Given** uma busca por uma cidade e uma resposta de geocodificação contendo essa cidade
	- **When** a pessoa usuária envia a busca
	- **Then** a cidade retornada aparece entre os resultados exibidos.
- **AC-01b (US-01; FR-01)**
	- **Given** o campo de busca vazio ou contendo somente espaços
	- **When** a pessoa usuária tenta enviar a busca
	- **Then** nenhuma requisição de geocodificação é enviada e a interface solicita um nome de cidade.
- **AC-01c (US-01; FR-01)**
	- **Given** uma busca contendo acentos e pontuação válida, como `São João d'Aliança`, e uma resposta controlada com essa cidade
	- **When** a pessoa usuária envia a busca
	- **Then** a cidade aparece nos resultados com os caracteres preservados e sem erro de codificação.
- **AC-02 (US-02; FR-02)**
	- **Given** dois resultados de cidade distintos exibidos para uma busca
	- **When** a pessoa usuária seleciona o segundo resultado
	- **Then** o segundo resultado passa a ser a cidade selecionada para a consulta.
- **AC-03 (US-03; FR-03)**
	- **Given** uma cidade selecionada e uma resposta de clima atual contendo temperatura de 18 °C
	- **When** os dados atuais são apresentados
	- **Then** a temperatura atual exibida para essa cidade é 18 °C.
- **AC-03b (US-03; FR-03)**
	- **Given** uma resposta atual com temperatura válida e outro campo previsto para exibição ausente
	- **When** os dados atuais são apresentados
	- **Then** a temperatura válida é exibida e o campo ausente é identificado como indisponível, sem ser substituído por um valor inventado ou antigo.
- **AC-04 (US-04; FR-04)**
	- **Given** o relógio de teste fixado em uma data e uma resposta de previsão para essa data e os quatro dias consecutivos seguintes
	- **When** a previsão é apresentada para uma cidade selecionada
	- **Then** a interface apresenta dados para as cinco datas retornadas, incluindo a data atual fixada e sem incluir uma sexta data.
- **AC-04b (US-04; FR-04)**
	- **Given** uma resposta de previsão contendo dados para menos de cinco datas
	- **When** a previsão é apresentada
	- **Then** a interface apresenta somente as datas recebidas, informa que a previsão está incompleta e não inventa dados para datas ausentes.
- **AC-05 (US-05; FR-05)**
	- **Given** temperaturas disponíveis de 0 °C e 20 °C
	- **When** a consulta inicial é apresentada e, em seguida, a pessoa usuária seleciona Fahrenheit
	- **Then** a unidade inicial é Celsius e os valores passam a ser exibidos como 32 °F e 68 °F, respectivamente.
- **AC-06 (US-06; FR-06)**
	- **Given** uma cidade A exibida e uma cidade B selecionável, com respostas controladas distintas para ambas
	- **When** a pessoa usuária seleciona a cidade B
	- **Then** a identificação, o clima atual e a previsão exibidos correspondem à cidade B, e nenhum dado da cidade A permanece apresentado como dado atual.
- **AC-07a (US-07; FR-07)**
	- **Given** uma busca cuja resposta de geocodificação não contém resultados
	- **When** a busca termina
	- **Then** a interface apresenta uma mensagem indicando que nenhuma cidade foi encontrada.
- **AC-07b (US-07; FR-07)**
	- **Given** uma cidade selecionada e uma resposta de falha ao solicitar dados meteorológicos
	- **When** a consulta termina com erro
	- **Then** a interface informa que não foi possível obter os dados e não apresenta dados indisponíveis como atuais.
- **AC-07c (US-07; FR-07)**
	- **Given** uma requisição de geocodificação que termina com erro de rede ou resposta de erro do serviço
	- **When** a busca termina
	- **Then** a interface informa que a busca falhou, diferencia essa falha de uma busca sem resultados e permite uma nova tentativa.
- **AC-07d (US-07; FR-07)**
	- **Given** uma busca ou consulta meteorológica que permanece pendente além do timeout configurado, proposto inicialmente como 8 segundos
	- **When** o limite de tempo é atingido
	- **Then** a requisição é encerrada, a indicação de carregamento é removida, a interface informa o timeout e permite uma nova tentativa.
- **AC-08 (US-08; FR-08)**
	- **Given** uma busca ou atualização cuja resposta controlada permanece pendente
	- **When** a operação é iniciada
	- **Then** a interface apresenta uma indicação de carregamento até a resposta ser concluída ou falhar e a remove quando a operação termina.

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

- **Input vazio:** se o campo estiver vazio ou contiver somente espaços, não enviar requisição, não iniciar carregamento e solicitar que a pessoa informe uma cidade.
- **Cidade sem correspondência:** quando a geocodificação concluir com sucesso, mas retornar zero resultados, informar que nenhuma cidade foi encontrada, manter a busca disponível para correção e não solicitar previsão. Não afirmar que a cidade inexiste nem tratar o caso como erro do serviço.
- **Caracteres especiais:** remover espaços externos, mas preservar acentos, espaços internos e pontuação válida, como hífen ou apóstrofo. Nomes como `São João d'Aliança` devem ser enviados e exibidos sem erro de codificação. Busca sem distinção de acentos é uma proposta ainda sujeita a confirmação.
- **Falha de geocodificação:** se houver erro de rede ou resposta de erro do serviço, informar falha na busca, sem apresentar o estado de “nenhuma cidade encontrada”; remover o carregamento e permitir nova tentativa.
- **Falha de dados meteorológicos:** se a API falhar após a seleção da cidade, informar que os dados não puderam ser obtidos, manter a cidade identificada e não apresentar dados antigos como atuais.
- **Timeout:** proposta inicial de limite de 8 segundos por requisição. Ao atingir o limite, encerrar a requisição pendente, remover o carregamento, informar timeout e permitir nova tentativa. O limite precisa de confirmação.
- **Resposta parcial:** apresentar os campos e datas válidos recebidos; marcar os campos ausentes como indisponíveis e a previsão como incompleta quando faltarem datas. Não inventar valores nem preencher ausências com dados antigos. Se não houver dados essenciais para uma seção, apresentar indisponibilidade somente naquela seção, preservando outras seções válidas.
- A resposta está vencida ou sua última atualização não pode ser determinada; o limite de validade e a apresentação do horário de atualização ainda precisam ser definidos.
- O fuso da cidade atravessa a meia-noite ou difere do fuso da pessoa usuária, afetando a definição de hoje e os limites das cinco datas da previsão.
- Há alternância de unidade antes ou durante a exibição de dados, e diferentes campos de temperatura podem exigir conversão consistente; campos abrangidos e arredondamento ainda precisam ser definidos.
- A pessoa usuária está em uma rede móvel lenta ou perde a conexão durante a busca ou atualização; o comportamento offline e a apresentação de cache ainda precisam ser definidos. A proposta para o MVP é não apresentar cache como resposta atual.

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

- **Busca e cidades:** quais entradas além do nome da cidade serão aceitas (país, estado, código postal ou coordenadas)? Haverá sugestões enquanto a pessoa digita? Como distinguir cidades homônimas? Para correspondência com acentos, confirmar: (A) busca sem distinção de acentos, recomendada para facilitar a busca, ou (B) correspondência exata dos acentos. Também falta confirmar suporte a aliases, transliterações e nomes em outros idiomas; o comportamento para input vazio e para zero resultados já está proposto em Edge Cases.
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
- **Falhas e conectividade:** confirmar o timeout por requisição: (A) 5 segundos, (B) 8 segundos, recomendação inicial, ou (C) 10 segundos. Para resposta parcial, escolher: (A) apresentar dados disponíveis e marcar ausências, recomendação inicial, ou (B) ocultar a seção inteira se faltar algum campo obrigatório; definir quais campos são essenciais. Para dados antigos em falhas, escolher: (A) não usar cache no MVP, recomendação inicial, ou (B) mostrar a última resposta com horário e indicação explícita de dado desatualizado. Uma nova tentativa exigirá apenas reenviar a busca ou deve haver uma ação explícita de “Tentar novamente”? A aplicação deve oferecer algum comportamento offline?
- **Plataforma e conteúdo:** a experiência será apenas web responsiva ou há intenção de aplicativo nativo futuro? Existem identidade visual, tom de voz ou diretrizes de conteúdo a seguir?