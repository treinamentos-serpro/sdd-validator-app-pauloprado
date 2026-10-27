## Overview

O produto é uma aplicação para consultar informações meteorológicas de cidades. O MVP deve permitir pesquisar e selecionar uma cidade, consultar seu clima atual e uma previsão que abrange hoje e os quatro dias seguintes, e alternar a unidade de temperatura entre Celsius e Fahrenheit. A fonte de dados inicial será o Open-Meteo, sem API key. A interface será em pt-BR, Celsius será a unidade padrão e não haverá autenticação nem persistência de dados no servidor.

O objetivo é permitir que a pessoa usuária encontre informações meteorológicas da localidade desejada e as use para planejar atividades. O público prioritário, as métricas de sucesso e as necessidades que devem orientar decisões de produto ainda precisam ser validados.

## Functional Requirements

- **FR-01 — Buscar cidades:** permitir que a pessoa usuária pesquise cidades pelo nome.
- **FR-02 — Selecionar cidade:** apresentar resultados com nome da cidade e, quando disponíveis, região administrativa e país; permitir selecionar a localidade desejada quando houver mais de um resultado.
- **FR-03 — Consultar clima atual:** apresentar pelo menos a temperatura atual da cidade selecionada, em Celsius por padrão. Outros campos meteorológicos dependem da decisão registrada em Open Questions.
- **FR-04 — Consultar previsão:** apresentar dados para cinco datas consecutivas, começando pela data atual no fuso horário da cidade selecionada. A granularidade diária ou horária ainda não foi decidida.
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
- **US-07 (FR-07):** Como pessoa que se desloca diariamente, quero receber uma mensagem clara e poder tentar novamente quando a busca ou consulta falhar para saber que não posso confiar em dados indisponíveis.
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
	- **Then** nenhuma requisição de geocodificação é enviada e a interface exibe `Informe uma cidade para buscar`.
- **AC-01c (US-01; FR-01)**
	- **Given** uma busca com espaços externos e caracteres válidos, como `  São João d'Aliança  `, e uma resposta controlada contendo essa cidade
	- **When** a pessoa usuária envia a busca
	- **Then** a geocodificação recebe `São João d'Aliança` sem os espaços externos, preservando acentos e apóstrofo, e o resultado aparece sem erro de codificação.
- **AC-02 (US-02; FR-02)**
	- **Given** dois resultados homônimos em regiões ou países diferentes
	- **When** a pessoa usuária seleciona o segundo resultado
	- **Then** os resultados exibem o nome da cidade e, quando disponíveis, região administrativa e país; a cidade selecionada fica identificada com esse contexto e a consulta meteorológica corresponde ao segundo resultado.
- **AC-03 (US-03; FR-03)**
	- **Given** uma cidade selecionada e uma resposta de clima atual contendo temperatura de 18 °C
	- **When** os dados atuais são apresentados
	- **Then** a temperatura atual exibida para essa cidade é 18 °C.
- **AC-03b (US-03; FR-03)**
	- **Given** uma resposta atual com temperatura válida e outro campo previsto para exibição ausente
	- **When** os dados atuais são apresentados
	- **Then** a temperatura válida é exibida e o campo ausente aparece como `Indisponível`, sem ser substituído por um valor inventado ou antigo.
- **AC-03c (US-03; FR-03)**
	- **Given** uma resposta atual sem temperatura válida, mas com outro campo meteorológico válido
	- **When** os dados atuais são apresentados
	- **Then** a temperatura aparece como `Indisponível`, os demais campos válidos continuam visíveis e a seção não apresenta uma temperatura antiga como atual.
- **AC-04 (US-04; FR-04)**
	- **Given** o relógio de teste fixado em uma data no fuso da cidade selecionada e uma resposta de previsão para essa data e os quatro dias consecutivos seguintes
	- **When** a previsão é apresentada para uma cidade selecionada
	- **Then** a interface apresenta dados para exatamente essas cinco datas locais, começando pela data atual fixada e sem incluir uma sexta data.
- **AC-04b (US-04; FR-04)**
	- **Given** uma resposta de previsão contendo dados para menos de cinco datas
	- **When** a previsão é apresentada
	- **Then** a interface apresenta somente as datas recebidas e informa `Previsão incompleta`; se nenhuma data válida for recebida, informa `Previsão indisponível`. Não inventa dados para datas ausentes.
- **AC-05 (US-05; FR-05)**
	- **Given** temperaturas disponíveis de 0 °C e 20 °C
	- **When** a consulta inicial é apresentada, a pessoa usuária seleciona Fahrenheit e depois volta para Celsius
	- **Then** a unidade inicial é Celsius, os valores em Fahrenheit são 32 °F e 68 °F e, ao voltar para Celsius, os valores retornam a 0 °C e 20 °C sem nova busca por dados meteorológicos.
- **AC-06 (US-06; FR-06)**
	- **Given** uma cidade A exibida e uma cidade B selecionável, com respostas controladas distintas para ambas
	- **When** a pessoa usuária seleciona a cidade B
	- **Then** a identificação, o clima atual e a previsão exibidos correspondem à cidade B, e nenhum dado da cidade A permanece apresentado como dado atual.
- **AC-06b (US-06; FR-06)**
	- **Given** uma consulta para a cidade A ainda pendente quando a pessoa usuária seleciona a cidade B
	- **When** a resposta de A chega depois da resposta de B
	- **Then** a interface continua exibindo B e ignora a resposta tardia de A.
- **AC-07a (US-07; FR-07)**
	- **Given** uma busca cuja geocodificação conclui com sucesso e não contém resultados
	- **When** a busca termina
	- **Then** a interface apresenta `Nenhuma cidade encontrada`, não solicita dados meteorológicos e não associa dados de outra cidade à busca sem resultados.
- **AC-07b (US-07; FR-07)**
	- **Given** uma cidade selecionada e uma resposta de falha ao solicitar dados meteorológicos
	- **When** a consulta termina com erro
	- **Then** a interface informa `Não foi possível obter os dados`, remove o carregamento, oferece a ação `Tentar novamente` e não apresenta dados anteriores como atuais.
- **AC-07c (US-07; FR-07)**
	- **Given** uma requisição de geocodificação que termina com erro de rede, resposta HTTP 429 ou resposta HTTP 5xx
	- **When** a busca termina
	- **Then** a interface informa `Falha na busca`, diferencia a falha de `Nenhuma cidade encontrada`, remove o carregamento e oferece a ação `Tentar novamente`.
- **AC-07d (US-07; FR-07)**
	- **Given** uma busca ou consulta meteorológica que permanece pendente
	- **When** 8 segundos se passam sem resposta
	- **Then** a operação é tratada como timeout, a indicação de carregamento é removida, a interface informa `A consulta demorou demais` e oferece a ação `Tentar novamente`; uma resposta tardia não altera o estado exibido.
- **AC-08 (US-08; FR-08)**
	- **Given** uma busca ou atualização cuja resposta controlada permanece pendente
	- **When** a operação é iniciada
	- **Then** a interface apresenta uma indicação de carregamento até a resposta ser concluída ou falhar e a remove quando a operação termina.

## Non-Functional Requirements

Os valores e níveis abaixo são metas iniciais propostas para tornar a validação objetiva; precisam ser confirmados antes de se tornarem compromissos do produto.

- **NFR-01 — Responsividade:** em larguras de 320, 375, 768, 1024 e 1440 px, os fluxos de busca, seleção e consulta não devem apresentar rolagem horizontal nem sobreposição de conteúdo. Validar se essa faixa e as orientações cobrem os dispositivos prioritários.
- **NFR-02 — Usabilidade:** meta inicial: pelo menos 4 de 5 participantes representativos devem conseguir buscar uma cidade, consultar sua temperatura e alternar a unidade em até 60 segundos, sem ajuda. Confirmar público, tamanho da amostra e meta antes de tratar como compromisso.
- **NFR-03 — Acessibilidade:** meta inicial de WCAG 2.2 nível AA. Todos os controles dos fluxos principais devem ser operáveis por teclado, manter foco visível e nome acessível, e cumprir os critérios de contraste do nível adotado. Validar o nível exigido e combinar avaliação automatizada com revisão manual.
- **NFR-04 — Performance:** meta inicial de p95 de até 3 segundos entre o envio de uma busca válida e a exibição do clima atual e da previsão, incluindo geocodificação e consulta meteorológica. Medir em 100 execuções bem-sucedidas no ambiente de teste acordado; documentar perfil de rede/dispositivo e inclusão ou exclusão da latência do provedor.
- **NFR-05 — Disponibilidade:** proposta inicial de 99,5% por mês-calendário para a aplicação, calculada a partir de verificações periódicas de sucesso dos fluxos essenciais; indisponibilidades do provedor externo ficam fora da meta da aplicação e devem ser monitoradas separadamente. Confirmar intervalo das verificações, manutenção programada e método de medição.
- **NFR-06 — Integridade e atualidade:** os valores apresentados devem corresponder à cidade e à unidade selecionadas. Dados indisponíveis ou vencidos não devem ser apresentados como atuais. Frequência, validade e indicação da última atualização ainda precisam ser definidas.
- **NFR-07 — Compatibilidade:** proposta inicial de suporte às versões atuais e imediatamente anteriores dos navegadores móveis e desktop prioritários. Definir e publicar a matriz de navegadores, versões, sistemas operacionais e dispositivos antes de validar compatibilidade.
- **NFR-08 — Segurança e privacidade:** todas as comunicações devem usar HTTPS. O MVP não coleta nem armazena localização precisa, não autentica usuários e não persiste dados no servidor. Confirmar requisitos corporativos, legais e de privacidade adicionais antes do lançamento.

## Edge Cases

- **Input vazio:** se o campo estiver vazio ou contiver somente espaços, não enviar requisição, não iniciar carregamento e solicitar que a pessoa informe uma cidade.
- **Cidade sem correspondência:** quando a geocodificação concluir com sucesso, mas retornar zero resultados, informar que nenhuma cidade foi encontrada, manter a busca disponível para correção e não solicitar previsão. Não afirmar que a cidade inexiste nem tratar o caso como erro do serviço.
- **Caracteres especiais:** remover espaços externos, mas preservar acentos, espaços internos e pontuação válida, como hífen ou apóstrofo. Nomes como `São João d'Aliança` devem ser enviados e exibidos sem erro de codificação. Correspondência sem distinção de acentos ainda precisa de confirmação.
- **Falha de geocodificação:** se houver erro de rede, resposta de erro ou payload inválido do serviço, informar falha na busca, sem apresentar o estado de “nenhuma cidade encontrada”; remover o carregamento e permitir nova tentativa.
- **Falha de dados meteorológicos:** se a API falhar após a seleção da cidade, informar que os dados não puderam ser obtidos, manter a cidade identificada e não apresentar dados antigos como atuais.
- **Timeout:** usar 8 segundos como limite provisório por requisição. Ao atingir o limite, encerrar a requisição pendente, remover o carregamento, informar timeout e oferecer `Tentar novamente`. Confirmar o limite antes da implementação.
- **Resposta parcial:** apresentar os campos válidos recebidos; marcar os campos ausentes com `Indisponível`. Para a previsão, mostrar somente as datas válidas e `Previsão incompleta`; sem datas válidas, mostrar `Previsão indisponível`. A seção atual exige ao menos um valor atual válido; não havendo nenhum, mostrar `Dados atuais indisponíveis`. Nunca inventar valores nem preencher lacunas com dados anteriores. Preservar seções independentes que tenham dados válidos.
- **Respostas fora de ordem:** se uma consulta anterior terminar depois de uma seleção mais recente, ignorar a resposta anterior e manter visíveis apenas os dados da seleção mais recente.
- A resposta está vencida ou sua última atualização não pode ser determinada; o limite de validade e a apresentação do horário de atualização ainda precisam ser definidos. Dados anteriores não devem substituir a resposta atual.
- O fuso da cidade atravessa a meia-noite ou difere do fuso da pessoa usuária, afetando a definição de hoje e os limites das cinco datas da previsão.
- Há alternância de unidade antes ou durante a exibição de dados, e diferentes campos de temperatura podem exigir conversão consistente; campos abrangidos e arredondamento ainda precisam ser definidos.
- A pessoa usuária está em uma rede móvel lenta ou perde a conexão durante a busca ou atualização; o MVP não apresenta dados em cache como atuais nem garante funcionamento offline.

## Assumptions

- Open-Meteo é a fonte de dados inicial e a integração não requer API key; cobertura, termos, limites e disponibilidade ainda precisam ser validados.
- O período da previsão compreende cinco datas consecutivas, começando pela data atual no fuso horário da cidade selecionada; a granularidade continua em aberto.
- Celsius é a unidade padrão. A alternância para Fahrenheit é necessária, mas o conjunto de campos convertido e a persistência da preferência não foram decididos.
- Não haverá autenticação nem persistência de dados no servidor. Persistência local no navegador continua em aberto.
- A interface será em português do Brasil. Formatos de data e hora continuam em aberto.
- A experiência deve funcionar em dispositivos móveis por meio de uma interface responsiva; aplicativo nativo não foi confirmado.
- As três personas descritas são hipóteses para validação, não evidência confirmada sobre público ou comportamento.
- Busca por nome de cidade é o requisito confirmado; sugestões, formatos adicionais e regras detalhadas de busca não foram confirmados.

## Risks

- **Necessidade e público não validados:** o produto pode priorizar informações inadequadas ou não gerar adoção. Mitigação: validar personas e casos de uso com o público-alvo e definir critérios de sucesso antes de fechar o MVP.
- **Escopo meteorológico ambíguo:** falta decidir campos atuais, granularidade e conteúdo da previsão, criando risco de retrabalho e divergência de expectativa. Mitigação: resolver essas perguntas e derivar critérios específicos antes do planejamento técnico.
- **Dependência do Open-Meteo:** latência, indisponibilidade, limites, cobertura, termos ou custos podem inviabilizar o uso previsto. Mitigação: validar essas condições e volume estimado antes da integração; definir timeout, tratamento de falha, nova tentativa e monitoramento da dependência.
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
- Funcionamento offline e apresentação de dados em cache no MVP. Uma evolução futura poderá considerar dados anteriores somente com identificação explícita de que estão desatualizados e com horário da última atualização.

## Open Questions

- **Busca e cidades:** quais entradas além do nome da cidade serão aceitas (país, estado, código postal ou coordenadas)? Haverá sugestões enquanto a pessoa digita? A proposta é distinguir resultados pelo nome da cidade e, quando disponíveis, região administrativa e país; qual fallback usar quando esses dados não estiverem disponíveis? Para acentos, confirmar: (A) busca sem distinção de acentos, recomendada, ou (B) correspondência exata. Também falta confirmar suporte a aliases, transliterações e nomes em outros idiomas. Input vazio, pontuação válida e zero resultados já têm comportamento definido em Edge Cases.
- **Granularidade:** a previsão para hoje e os quatro dias seguintes será diária, horária ou incluirá ambas?
- **Fuso e formatos:** os cinco dias seguem o fuso horário da cidade selecionada. Quais formatos pt-BR serão usados para datas e horários e em qual formato/precisão será exibido o horário da última atualização?
- **Campos meteorológicos:** temperatura atual é o dado mínimo do clima atual; quais outros campos devem ser exibidos? Para cada data da previsão, quais campos são necessários entre condição, mínima, máxima, precipitação e outros?
- **Atualização e validade:** com que frequência os dados serão atualizados? Qual será o limite de validade, como será indicada a última atualização e como serão tratados dados vencidos, incompletos ou divergentes?
- **Open-Meteo:** quais são os termos de uso, limites de requisição, cobertura geográfica, disponibilidade, custos aplicáveis e garantias do provedor? Como serão avaliadas precisão e indisponibilidade por localidade?
- **Persistência local:** a aplicação deve lembrar no navegador a última cidade, a unidade, favoritos ou histórico? Por quanto tempo e com qual comportamento entre sessões?
- **Localização:** haverá detecção de localização do dispositivo? Se houver, será opcional, dependerá de permissão e terá consentimento explícito?
- **Unidades:** quais campos de temperatura serão convertidos para Fahrenheit e Celsius? Como serão definidos conversão, arredondamento e apresentação? A unidade escolhida será lembrada apenas durante a sessão ou no navegador?
- **Qualidade e compatibilidade:** confirmar as metas iniciais de usabilidade (4 de 5 participantes em até 60 segundos), performance (p95 de até 3 segundos em 100 execuções) e disponibilidade (99,5% por mês-calendário). Qual perfil de rede/dispositivo e quais exclusões serão usados para medir performance? Quais navegadores, versões, sistemas operacionais, dispositivos, tamanhos e orientações serão prioritários? WCAG 2.2 AA será critério obrigatório?
- **Produto e prioridade:** quais são os critérios de sucesso mensuráveis, qual segmento será prioritário e as hipóteses das três personas serão confirmadas? Alertas, favoritos, histórico, notificações ou outros recursos serão considerados em uma fase posterior?
- **Volume e operação:** qual o volume inicial e de pico de usuários e consultas? Onde a aplicação será publicada, quais ambientes serão necessários, quem fará monitoramento e suporte e quais métricas, alertas e procedimentos de resposta serão exigidos?
- **Privacidade e segurança:** haverá analytics ou coleta de dados pessoais? Quais dados poderão ser guardados, por quanto tempo e com qual consentimento? Quais requisitos legais e corporativos se aplicam a privacidade, segurança, retenção, gestão de segredos e proteção contra abuso?
- **Acessibilidade:** WCAG 2.2 AA é a meta proposta; confirmar se será critério obrigatório de lançamento.
- **Falhas e conectividade:** confirmar o timeout provisório de 8 segundos ou escolher 5 ou 10 segundos. O MVP não usa dados anteriores como resposta atual, apresenta dados parciais com ausências marcadas e oferece a ação `Tentar novamente`. Há necessidade de suporte offline em uma fase futura?
- **Atualização manual:** além de atualizar os dados quando outra cidade é selecionada, a pessoa usuária precisa de uma ação explícita para atualizar a cidade atual? Qual deve ser a frequência de atualização automática, se houver?
- **Plataforma e conteúdo:** a experiência será apenas web responsiva ou há intenção de aplicativo nativo futuro? Existem identidade visual, tom de voz ou diretrizes de conteúdo a seguir?