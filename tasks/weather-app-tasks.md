# Backlog de Tarefas — Weather App

Decisões ainda abertas são gates: tarefas dependentes só avançam com escolhas aprovadas registradas. Nenhum valor provisório é presumido. Caminhos são previsões de artefatos, não afirmações de que arquivos de código já existem.

## Entrega 1 — Decisões e contratos de API


### T-01
- **Título:** Fechar decisões de busca e seleção
- **Descrição curta:** Registrar `count`, idioma, política de acentos/Unicode e contexto/fallback para homônimos.
- **Critérios de aceite:** Em `specs/weather-app-spec.md`, cada decisão sobre `count`, idioma, correspondência com/sem acentos e fallback de contexto de homônimos registra pergunta, escolha, aprovador e fonte; questão sem aprovação fica `Bloqueada`, sem valor provisório. Conferir os registros contra FR-01, FR-02, AC-01c e AC-02.
- **Dependências:** Nenhuma
- **Arquivos prováveis:** `specs/weather-app-spec.md`
- **Tipo:** Infra

### T-02
- **Título:** Fechar decisões meteorológicas e de unidade
- **Descrição curta:** Registrar campos/granularidade, fallback de timezone, timeout, freshness, arredondamento/persistência e tabela WMO pt-BR de rótulos/ícones; resolver a inconsistência sobre ausência de temperatura utilizável.
- **Critérios de aceite:** Em `specs/weather-app-spec.md`, campos/granularidade, fallback de timezone, timeout, freshness, arredondamento/persistência da unidade, tabela WMO pt-BR e regra para ausência total de temperatura têm pergunta, escolha, aprovador e fonte; cada item sem aprovação fica `Bloqueado`, sem valor provisório. Conferir FR-03–FR-05, AC-03b, AC-03c, AC-04b, AC-05, AC-07d e NFR-06.
- **Dependências:** Nenhuma
- **Arquivos prováveis:** `specs/weather-app-spec.md`
- **Tipo:** Infra

### T-03
- **Título:** Fechar critérios de qualidade e medição
- **Descrição curta:** Registrar matriz de navegadores/dispositivos, nível de acessibilidade e métodos, ambientes, amostras e limites para avaliar NFRs.
- **Critérios de aceite:** Em `specs/weather-app-spec.md` e `plans/weather-app-plan.md`, matriz de navegadores, nível de acessibilidade e método/ambiente/amostra/limites de NFR-02, NFR-04 e NFR-05 registram pergunta, escolha, aprovador e fonte. Itens sem aprovação ficam `Bloqueados`; métodos distinguem app de provedor e medição real de mock (NFR-01–NFR-05, NFR-07).
- **Dependências:** Nenhuma
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`
- **Tipo:** Infra

### T-04
- **Título:** Validar separadamente os contratos Open-Meteo
- **Descrição curta:** Conferir documentação vigente, parâmetros aprovados, payloads, unidades, fuso, termos, limites, cobertura, disponibilidade e custos.
- **Critérios de aceite:** `plans/weather-app-plan.md` registra URL oficial e data de consulta, evidência e resultado para parâmetros aprovados, payloads, unidades, fuso, termos, limites, cobertura, disponibilidade e custos; desconhecidos/discrepâncias apontam fonte e decisão/aprovador pendentes e deixam a tarefa `Bloqueada` quando impedem o contrato. Não declara garantias não documentadas nem usa API ao vivo nos testes (FR-01, FR-03, FR-04; AC-01b, AC-07a; NFR-05, NFR-08).
- **Dependências:** T-01, T-02, T-03
- **Arquivos prováveis:** `plans/weather-app-plan.md`
- **Tipo:** Infra

## Entrega 2 — Tipos e funções puras de produção

### T-05
- **Título:** Definir contratos TypeScript do domínio
- **Descrição curta:** Criar tipos estritos para cidade, unidade, dados, estados, erros e respostas parciais.
- **Critérios de aceite:** `src/types/weather.ts` representa cidade/coordenadas, unidade, estados discriminados e ausências sem `any`; só inclui campos/granularidade aprovados e preserva current/forecast independentes. `pnpm build` conclui sem erro TypeScript strict; decisão aplicável sem aprovação mantém a tarefa `Bloqueada` (FR-02–FR-07; AC-03b, AC-03c, AC-04b, AC-06; NFR-06).
- **Dependências:** T-01, T-02, T-03, T-04
- **Arquivos prováveis:** `src/types/weather.ts`
- **Tipo:** Data

### T-06
- **Título:** Implementar normalização de geocoding
- **Descrição curta:** Validar payload desconhecido e mapear cidades conforme contratos aprovados.
- **Critérios de aceite:** Com fixtures, `normalizeGeocoding` preserva nome, coordenadas válidas e contexto recebido; resultados vazios normalizam como vazio, enquanto JSON/estrutura inválida e coordenadas não finitas não produzem cidades. Comportamento verificável pelos casos de T-07; campos e regras de busca dependentes de T-01 ficam bloqueados até aprovação (FR-01, FR-02, FR-07; AC-01, AC-02, AC-07a, AC-07c).
- **Dependências:** T-01, T-04, T-05
- **Arquivos prováveis:** `src/lib/normalizeGeocoding.ts`
- **Tipo:** Data

### T-08
- **Título:** Implementar normalização de clima atual
- **Descrição curta:** Validar e mapear campos atuais aprovados, preservando dados válidos e representando ausências.
- **Critérios de aceite:** Com fixture de resposta, `normalizeCurrentWeather` mantém temperatura válida em Celsius canônico e transforma campo aprovado ausente/inválido em ausência, sem inventar valor nem reutilizar resposta anterior; unidades e tratamento sem temperatura utilizável seguem T-02. Verificar pelos casos de T-09; decisão não aprovada mantém a tarefa `Bloqueada` (FR-03, FR-07; AC-03, AC-03b, AC-03c, AC-07b; NFR-06).
- **Dependências:** T-02, T-04, T-05
- **Arquivos prováveis:** `src/lib/normalizeCurrentWeather.ts`
- **Tipo:** Data

### T-10
- **Título:** Implementar normalização de forecast
- **Descrição curta:** Validar datas e campos aprovados, mantendo somente dados recebidos válidos.
- **Critérios de aceite:** Com relógio e fixture controlados, `normalizeForecast` usa datas locais no timezone/fallback aprovado, inclui no máximo as cinco datas consecutivas a partir de hoje e preserva somente datas/campos recebidos válidos; menos de cinco resulta incompleto e nenhuma data válida resulta indisponível, sem preencher lacunas. Verificar pelos casos de T-11; granularidade/fallback sem aprovação mantém a tarefa `Bloqueada` (FR-04; AC-04, AC-04b; NFR-06).
- **Dependências:** T-02, T-04, T-05
- **Arquivos prováveis:** `src/lib/normalizeForecast.ts`
- **Tipo:** Data

### T-12
- **Título:** Implementar conversão de temperatura
- **Descrição curta:** Criar conversão/formatação pura dos campos aprovados, mantendo Celsius canônico.
- **Critérios de aceite:** Funções puras convertem valores Celsius aprovados para Fahrenheit e de volta sem mutar entrada ou requisitar dados; `0 °C` resulta em `32 °F` e `20 °C` em `68 °F`, conforme asserts de T-13. Formatação/arredondamento não aprovado não é presumido e deixa essa parte bloqueada (FR-05; AC-05; NFR-06).
- **Dependências:** T-02, T-05
- **Arquivos prováveis:** `src/lib/temperature.ts`
- **Tipo:** Data

### T-14
- **Título:** Implementar tabela de códigos WMO
- **Descrição curta:** Mapear códigos para rótulos pt-BR e ícones aprovados, sem inventar assets ou fallbacks.
- **Critérios de aceite:** Se a extensão WMO for aprovada em T-02, `src/lib/weatherCode.ts` mapeia somente códigos, rótulos pt-BR e ícones aprovados; código desconhecido segue o fallback aprovado, sem rótulo ou asset inventado, conforme T-15. Se for adiada, registrar a tarefa como `Adiada` sem bloquear FR-03/FR-04 (FR-03, FR-04; AC-03b, AC-04b; NFR-06).
- **Dependências:** T-02, T-05
- **Arquivos prováveis:** `src/lib/weatherCode.ts`
- **Tipo:** Data

## Entrega 3 — Services de produção

### T-16
- **Título:** Implementar serviço de geocoding
- **Descrição curta:** Construir requisição aprovada, verificar HTTP e encaminhar payload à normalização, sem UI.
- **Critérios de aceite:** O serviço serializa os parâmetros aprovados preservando Unicode (incluindo `São João d'Aliança`), retorna zero resultados como vazio e classifica falha de rede/HTTP/JSON inválido como erro, nunca como vazio; chamada vazia não executa `fetch`. Confirmar com T-17; `count`/idioma/regras sem aprovação em T-01 deixam a tarefa `Bloqueada` (FR-01, FR-02, FR-07; AC-01b, AC-01c, AC-07a, AC-07c; NFR-08).
- **Dependências:** T-01, T-04, T-05, T-06
- **Arquivos prováveis:** `src/services/geocoding.ts`
- **Tipo:** Data

### T-18
- **Título:** Implementar serviço de forecast
- **Descrição curta:** Consultar current/forecast segundo contrato aprovado, verificar HTTP e entregar payload à normalização.
- **Critérios de aceite:** A requisição usa as coordenadas da cidade selecionada e somente campos, granularidade, unidades e timezone/fallback aprovados; encaminha payload desconhecido para normalização e mantém falha de seção distinta de sucesso parcial válido. Verificar URL/params e respostas por T-19; parâmetros ou fallback não aprovados mantêm a tarefa `Bloqueada` (FR-03, FR-04, FR-07; AC-03b, AC-03c, AC-04, AC-04b, AC-07b; NFR-08).
- **Dependências:** T-02, T-04, T-05, T-08, T-10
- **Arquivos prováveis:** `src/services/forecast.ts`
- **Tipo:** Data

## Entrega 4 — Hook de produção

### T-20
- **Título:** Implementar hook de busca e clima
- **Descrição curta:** Orquestrar busca/seleção, estados independentes, retry explícito, unidade e concorrência.
- **Critérios de aceite:** `useWeather` expõe busca `idle/loading/success/empty/error` e estados independentes de clima/previsão; input vazio não chama serviço, zero resultados não chama forecast, seleção inicia consulta, retry repete só a operação falha, troca de unidade não requisita e resposta tardia de A não substitui B nem conserva A como atual. Timeout/mensagens dependem de T-02; testar esses comportamentos em T-21 e bloquear qualquer decisão ainda não aprovada (FR-01, FR-03–FR-08; AC-01b, AC-05, AC-06, AC-06b, AC-07a–AC-08; NFR-06).
- **Dependências:** T-01, T-02, T-05, T-12, T-16, T-18
- **Arquivos prováveis:** `src/hooks/useWeather.ts`
- **Tipo:** Data

## Entrega 5 — Componentes de produção

### T-22
- **Título:** Implementar formulário de busca
- **Descrição curta:** Criar entrada e envio por teclado, com estado local e mensagem de input vazio.
- **Critérios de aceite:** Formulário aparar somente espaços externos e preservar `São João d'Aliança`; vazio/só espaços exibe `Informe uma cidade para buscar` e não chama busca. Campo tem nome acessível, envio por teclado e foco visível; verificar por interação/DOM em T-27 (FR-01, FR-07; AC-01b, AC-01c; NFR-03).
- **Dependências:** T-01, T-20
- **Arquivos prováveis:** `src/components/CitySearch.tsx`
- **Tipo:** UI

### T-23
- **Título:** Implementar resultados de cidades
- **Descrição curta:** Apresentar resultados contextuais e seleção da cidade correta.
- **Critérios de aceite:** Cada resultado mostra nome e contexto administrativo/país quando recebidos; em fixture de homônimos, selecionar o segundo por teclado repassa exatamente as coordenadas e contexto desse resultado e identifica essa cidade. Sem contexto, não inventa rótulo; validar interação em T-28 (FR-02, FR-06; AC-02, AC-06; NFR-03, NFR-06).
- **Dependências:** T-01, T-05, T-20
- **Arquivos prováveis:** `src/components/CityResults.tsx`
- **Tipo:** UI

### T-24
- **Título:** Implementar estado visual de loading
- **Descrição curta:** Apresentar carregamento com semântica acessível.
- **Critérios de aceite:** Enquanto uma promise pendente, a UI apresenta indicação de loading anunciada semanticamente (`role="status"` ou equivalente); sucesso e falha removem a indicação. Confirmar com promise controlada e consulta semântica em T-29 (FR-08; AC-08; NFR-03).
- **Dependências:** T-20
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`
- **Tipo:** UI

### T-25
- **Título:** Implementar estado visual vazio
- **Descrição curta:** Apresentar busca concluída sem resultados, distinta de erro.
- **Critérios de aceite:** Resultado de geocoding concluído com lista vazia exibe literalmente `Nenhuma cidade encontrada`, mantém campo/ação de nova busca disponíveis e não apresenta erro nem dados meteorológicos. Confirmar com estado vazio controlado em T-29 (FR-01, FR-07; AC-07a; NFR-03).
- **Dependências:** T-01, T-20
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`
- **Tipo:** UI


### T-26
- **Título:** Implementar estado visual de erro
- **Descrição curta:** Apresentar mensagem de erro e retry explícito da operação correspondente.
- **Critérios de aceite:** Erro de busca exibe `Falha na busca`; erro meteorológico exibe `Não foi possível obter os dados`; timeout usa `A consulta demorou demais` somente se o limite de T-02 for aprovado. Cada estado oferece `Tentar novamente` com nome/foco acessíveis, remove loading e só repete após ação explícita; erro nunca aparece como vazio. Verificar em T-29 (FR-07, FR-08; AC-07b, AC-07c, AC-07d, AC-08; NFR-03).
- **Dependências:** T-02, T-20
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`
- **Tipo:** UI

### T-30
- **Título:** Implementar clima atual
- **Descrição curta:** Apresentar campos aprovados e indisponibilidade; WMO é extensão opcional via T-14.
- **Critérios de aceite:** Para a cidade vigente, exibe temperatura válida (fixture 18 °C como `18 °C`) e somente campos aprovados; campo ausente aparece `Indisponível`, sem valor inventado ou dado da cidade anterior. Temperatura ausente com outros campos válidos e ausência total seguem decisão T-02; testar em T-31. A tela principal não depende de rótulos/ícones WMO (FR-03, FR-06; AC-03, AC-03b, AC-03c, AC-06; NFR-06).
- **Dependências:** T-02, T-05, T-08, T-12, T-20
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`
- **Tipo:** UI

### T-32
- **Título:** Implementar forecast
- **Descrição curta:** Apresentar datas/campos aprovados e estados incompleto/indisponível; WMO é extensão opcional via T-14.
- **Critérios de aceite:** Para a cidade selecionada, mostra somente campos/granularidade aprovados e datas locais válidas recebidas, no máximo cinco começando por hoje; lacunas não são preenchidas; menos de cinco é `Previsão incompleta` e nenhuma data válida é `Previsão indisponível`. Fuso/fallback segue T-02; campo ou decisão pendente bloqueia a tarefa. A previsão principal não depende de rótulos/ícones WMO (FR-04; AC-04, AC-04b; NFR-06).
- **Dependências:** T-02, T-05, T-10, T-12, T-20
- **Arquivos prováveis:** `src/components/Forecast.tsx`
- **Tipo:** UI

### T-34
- **Título:** Implementar controle de unidade
- **Descrição curta:** Criar controle acessível que atualiza a unidade de apresentação.
- **Critérios de aceite:** Controle acessível inicia em Celsius; ao alternar, valores canônicos 0/20 °C são apresentados como 32/68 °F e retornam a 0/20 °C sem nova chamada de geocoding/forecast. Campos e arredondamento seguem T-02; não presume persistência entre sessões nem valor pendente (FR-05; AC-05; NFR-03, NFR-06).
- **Dependências:** T-02, T-12, T-20
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`
- **Tipo:** UI


## Entrega 6 — Integração

### T-36
- **Título:** Compor experiência em App
- **Descrição curta:** Integrar hook, busca, estados, clima, forecast e unidade sem chamadas de API na UI.
- **Critérios de aceite:** `App` compõe busca, seleção explícita, estados, clima, previsão e unidade sem chamadas de API em componentes; com serviços controlados, seleciona cidade, não mostra A como atual após selecionar B e mantém uma seção válida de B quando a outra falha. Verificar integração em T-37; só contratos aprovados são usados (FR-01, FR-02, FR-03–FR-08; AC-02, AC-03b, AC-04b, AC-05, AC-06, AC-06b, AC-07b, AC-08; NFR-06).
- **Dependências:** T-01, T-02, T-20, T-22, T-23, T-24, T-25, T-26, T-30, T-32, T-34
- **Arquivos prováveis:** `src/App.tsx`
- **Tipo:** UI

## Entrega 7 — Testes

### T-07
- **Título:** Testar normalização de geocoding
- **Descrição curta:** Cobrir a função pura com Vitest e fixtures, sem rede.
- **Critérios de aceite:** `pnpm test -- tests/lib/normalizeGeocoding.test.ts` passa com fixtures que afirmam: cidade válida preserva nome/coordenadas/contexto; contexto ausente permanece opcional; resultados vazios não são erro; JSON/estrutura malformada e latitude/longitude ausentes, não numéricas ou fora do intervalo não geram cidade. Nenhum teste acessa rede real (FR-01, FR-02, FR-07; AC-01, AC-02, AC-07a, AC-07c).
- **Dependências:** T-01, T-04, T-06
- **Arquivos prováveis:** `tests/lib/normalizeGeocoding.test.ts`
- **Tipo:** Test

### T-09
- **Título:** Testar normalização de clima atual
- **Descrição curta:** Cobrir payload atual com Vitest, sem serviço ou UI.
- **Critérios de aceite:** `pnpm test -- tests/lib/normalizeCurrentWeather.test.ts` passa com asserts para temperatura 18 °C válida, campo aprovado ausente/inválido como indisponível, unidade inesperada rejeitada, temperatura ausente com outro campo válido preservado, nenhum campo utilizável conforme decisão T-02 e payload malformado sem valores inventados. Fixtures locais, sem API ou serviço real (FR-03; AC-03, AC-03b, AC-03c; NFR-06).
- **Dependências:** T-02, T-08
- **Arquivos prováveis:** `tests/lib/normalizeCurrentWeather.test.ts`
- **Tipo:** Test

### T-11
- **Título:** Testar normalização de forecast
- **Descrição curta:** Cobrir datas locais e respostas parciais com relógio/timezone controlados.
- **Critérios de aceite:** `pnpm test -- tests/lib/normalizeForecast.test.ts` passa com relógio/timezone controlados: cinco datas locais consecutivas incluem hoje e não uma sexta; cruzar meia-noite usa o dia local aprovado; datas/campos ausentes ou inválidos não são inventados; menos de cinco é incompleto; nenhuma data válida é indisponível; payload malformado não vira previsão. Sem rede real (FR-04; AC-04, AC-04b; NFR-06).
- **Dependências:** T-02, T-10
- **Arquivos prováveis:** `tests/lib/normalizeForecast.test.ts`
- **Tipo:** Test

### T-13
- **Título:** Testar conversão de temperatura
- **Descrição curta:** Validar conversão e formatação em Vitest.
- **Critérios de aceite:** `pnpm test -- tests/lib/temperature.test.ts` passa afirmando `0 °C = 32 °F`, `20 °C = 68 °F`, retorno aos valores Celsius originais e ausência de mutação; testa casas/arredondamento somente conforme decisão aprovada em T-02. Testes puros, sem chamadas de rede (FR-05; AC-05; NFR-06).
- **Dependências:** T-02, T-12
- **Arquivos prováveis:** `tests/lib/temperature.test.ts`
- **Tipo:** Test

### T-15
- **Título:** Testar tabela de códigos WMO
- **Descrição curta:** Cobrir mapeamentos e fallback com Vitest.
- **Critérios de aceite:** Se T-02 aprovar a extensão, `pnpm test -- tests/lib/weatherCode.test.ts` passa verificando cada mapeamento aprovado e o fallback de código desconhecido, sem conteúdo inventado. Se T-02 adiar a extensão, registrar `Adiada` e não criar teste/assets para o MVP (FR-03, FR-04; AC-03b, AC-04b; NFR-06).
- **Dependências:** T-02, T-14
- **Arquivos prováveis:** `tests/lib/weatherCode.test.ts`
- **Tipo:** Test

### T-17
- **Título:** Testar geocoding com fetch mockado
- **Descrição curta:** Testar somente serviço, com Vitest e `fetch` mockado.
- **Critérios de aceite:** `pnpm test -- tests/services/geocoding.test.ts` passa com `fetch` mockado: URL e parâmetros aprovados; `trim` apenas externo e Unicode/apóstrofo preservados; sucesso e zero resultados distintos; JSON inválido, rejeição de rede, HTTP 429, 5xx e outros não-2xx resultam em erro; input vazio tem zero chamadas. Nenhum teste acessa API ao vivo (FR-01, FR-02, FR-07; AC-01, AC-01b, AC-01c, AC-07a, AC-07c).
- **Dependências:** T-01, T-04, T-16
- **Arquivos prováveis:** `tests/services/geocoding.test.ts`
- **Tipo:** Test

### T-19
- **Título:** Testar forecast com fetch mockado
- **Descrição curta:** Testar somente serviço de forecast, sem rede real.
- **Critérios de aceite:** `pnpm test -- tests/services/forecast.test.ts` passa com `fetch` mockado e relógio controlado: coordenadas/parâmetros aprovados; sucesso e payload parcial; JSON inválido, rede, HTTP 429, 5xx e outros não-2xx como erro; timeout e duração conforme T-02 somente se aprovados. Asserções cobrem status/resultado e nenhuma API ao vivo é acessada; mocks não servem como medição NFR (FR-03, FR-04, FR-07; AC-03b, AC-03c, AC-04b, AC-07b, AC-07d).
- **Dependências:** T-01, T-02, T-04, T-18
- **Arquivos prováveis:** `tests/services/forecast.test.ts`
- **Tipo:** Test

### T-21
- **Título:** Testar hook, retry e concorrência
- **Descrição curta:** Testar hook com Testing Library, promises e relógio controlados.
- **Critérios de aceite:** `pnpm test -- tests/hooks/useWeather.test.ts` passa com serviços mockados, promises/relógio controlados: estados iniciais e loading/success/empty/error; input vazio e zero hits sem forecast; current válido com forecast falho e vice-versa; retry isolado; loading removido após término; resposta tardia A ignorada após B; 0/20 °C exibidos como 32/68 °F e retorno sem nova chamada; timeout somente no limite aprovado. Nenhum teste usa API ao vivo (FR-01, FR-03–FR-08; AC-01b, AC-03b, AC-03c, AC-04b, AC-05, AC-06b, AC-07a–AC-08; NFR-06).
- **Dependências:** T-01, T-02, T-20
- **Arquivos prováveis:** `tests/hooks/useWeather.test.ts`
- **Tipo:** Test

### T-27
- **Título:** Testar formulário de busca
- **Descrição curta:** Cobrir interação, teclado e input vazio com Testing Library.
- **Critérios de aceite:** `pnpm test -- tests/components/CitySearch.test.tsx` passa afirmando envio de `São João d'Aliança` aparado sem perda de acento/apóstrofo, envio por teclado, zero callback para vazio/só espaços, mensagem literal `Informe uma cidade para buscar`, nome acessível e foco visível. Testes locais sem rede (FR-01; AC-01b, AC-01c; NFR-03).
- **Dependências:** T-01, T-22
- **Arquivos prováveis:** `tests/components/CitySearch.test.tsx`
- **Tipo:** Test

### T-28
- **Título:** Testar resultados de cidades
- **Descrição curta:** Cobrir contexto, homônimos e seleção com Testing Library.
- **Critérios de aceite:** `pnpm test -- tests/components/CityResults.test.tsx` passa com dois homônimos de regiões/países diferentes: contexto recebido é exibido, contexto ausente não é inventado, seleção por teclado do segundo item chama callback uma vez com suas coordenadas/contexto exatos e foco permanece operável (FR-02, FR-06; AC-02, AC-06; NFR-03).
- **Dependências:** T-01, T-23
- **Arquivos prováveis:** `tests/components/CityResults.test.tsx`
- **Tipo:** Test

### T-29
- **Título:** Testar estados visuais
- **Descrição curta:** Cobrir loading, vazio e erro/retry em um único arquivo de teste.
- **Critérios de aceite:** `pnpm test -- tests/components/WeatherStates.test.tsx` passa afirmando status anunciado somente durante loading pendente; vazio mostra `Nenhuma cidade encontrada`; erro de busca mostra `Falha na busca`; erro meteorológico mostra `Não foi possível obter os dados`; timeout mostra `A consulta demorou demais` apenas com decisão aprovada; erro e vazio são distintos e `Tentar novamente` exige ativação por teclado, sem retry automático (FR-07, FR-08; AC-07a, AC-07b, AC-07c, AC-07d, AC-08; NFR-03).
- **Dependências:** T-01, T-02, T-24, T-25, T-26
- **Arquivos prováveis:** `tests/components/WeatherStates.test.tsx`
- **Tipo:** Test

### T-31
- **Título:** Testar clima atual
- **Descrição curta:** Cobrir dados válidos, parciais e indisponíveis com Testing Library.
- **Critérios de aceite:** `pnpm test -- tests/components/CurrentWeather.test.tsx` passa afirmando `18 °C`; campo aprovado ausente como `Indisponível`; temperatura ausente com outro campo válido mantém esse campo e não mostra temperatura antiga; ausência total conforme decisão T-02. Sem API ao vivo; WMO é coberto separadamente por T-15 se aprovado (FR-03; AC-03, AC-03b, AC-03c; NFR-06).
- **Dependências:** T-02, T-30
- **Arquivos prováveis:** `tests/components/CurrentWeather.test.tsx`
- **Tipo:** Test

### T-33
- **Título:** Testar forecast
- **Descrição curta:** Cobrir cinco datas e respostas parciais com Testing Library.
- **Critérios de aceite:** `pnpm test -- tests/components/Forecast.test.tsx` passa com relógio, timezone e fixtures controlados: renderiza exatamente cinco datas locais consecutivas (sem sexta), somente dados recebidos; exibe `Previsão incompleta` para menos de cinco e `Previsão indisponível` para nenhuma válida; ausência de campo não inventa valor. Sem API ao vivo; WMO é coberto separadamente por T-15 se aprovado (FR-04; AC-04, AC-04b; NFR-06).
- **Dependências:** T-02, T-32
- **Arquivos prováveis:** `tests/components/Forecast.test.tsx`
- **Tipo:** Test

### T-35
- **Título:** Testar controle de unidade
- **Descrição curta:** Cobrir alternância e acessibilidade com Testing Library.
- **Critérios de aceite:** `pnpm test -- tests/components/UnitToggle.test.tsx` passa afirmando unidade inicial Celsius, transições Celsius→Fahrenheit→Celsius, exibição de 0/20 °C como 32/68 °F, controle com nome acessível e zero chamadas adicionais a serviços. Arredondamento adicional somente conforme decisão T-02 (FR-05; AC-05; NFR-03).
- **Dependências:** T-02, T-34
- **Arquivos prováveis:** `tests/components/UnitToggle.test.tsx`
- **Tipo:** Test

### T-37
- **Título:** Testar integração em App
- **Descrição curta:** Testar fluxo integrado com serviços controlados e Testing Library.
- **Critérios de aceite:** `pnpm test -- tests/App.test.tsx` passa com serviços mockados cobrindo: input vazio sem busca; busca/sucesso e seleção contextual; loading até resposta; zero resultados sem forecast; mensagens distintas de erro e retry explícito; current/forecast parciais independentes; troca A→B ignora resposta tardia de A; unidade 0/20 °C→32/68 °F→Celsius sem nova consulta. Nenhum teste chama API ao vivo (FR-01–FR-08; AC-01b, AC-01c, AC-02, AC-03b, AC-04b, AC-05, AC-06, AC-06b, AC-07a, AC-07b, AC-07c, AC-08; NFR-03, NFR-06).
- **Dependências:** T-01, T-02, T-21, T-27, T-28, T-29, T-31, T-33, T-35, T-36
- **Arquivos prováveis:** `tests/App.test.tsx`
- **Tipo:** Test

## Entrega 8 — E2E responsivo

### T-38
- **Título:** Testar E2E desktop/tablet
- **Descrição curta:** Playwright com rotas interceptadas em 768, 1024 e 1440 px.
- **Critérios de aceite:** `pnpm test:e2e -- tests/e2e/weather-desktop.spec.ts` passa em 768, 1024 e 1440 px, com rotas Open-Meteo interceptadas, fixtures de homônimos/dados e relógio/timezone controlados: busca→seleção→cinco datas→alternância de unidade; vazio sem forecast; loading pendente; falha e retry; nenhuma rolagem horizontal ou sobreposição em cada viewport. Confirma estados/valores visíveis, não mede NFR-04/05 por mock nem acessa API ao vivo (AC-01, AC-01b, AC-02, AC-04, AC-05, AC-07a, AC-07b, AC-08; NFR-01, NFR-03, NFR-07).
- **Dependências:** T-01, T-02, T-03, T-36, T-37
- **Arquivos prováveis:** `tests/e2e/weather-desktop.spec.ts`
- **Tipo:** Test

### T-39
- **Título:** Testar E2E mobile
- **Descrição curta:** Playwright com rotas interceptadas em 320 e 375 px.
- **Critérios de aceite:** `pnpm test:e2e -- tests/e2e/weather-mobile.spec.ts` passa em 320 e 375 px com rotas interceptadas, fixtures e relógio/timezone controlados: busca→seleção→clima atual e exatamente cinco datas locais da previsão→alternância Celsius/Fahrenheit; erro→retry. Controles são alcançáveis por teclado, sem rolagem horizontal ou sobreposição em cada viewport. Asserts DOM confirmam estados e valores esperados; sem API ao vivo e sem alegar medição NFR por mock (AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07b, AC-08; NFR-01, NFR-03, NFR-07).
- **Dependências:** T-01, T-02, T-03, T-36, T-37
- **Arquivos prováveis:** `tests/e2e/weather-mobile.spec.ts`
- **Tipo:** Test

## Entrega 9 — Hardening e medições

### T-40
- **Título:** Revisar acessibilidade manualmente
- **Descrição curta:** Registrar avaliação de teclado, foco, nomes e contraste conforme nível aprovado.
- **Critérios de aceite:** `tests/quality/accessibility-checklist.md` registra versão/build, nível aprovado, ambiente, execução manual de teclado/foco/nome acessível/contraste, evidência por fluxo e falhas/resultado. Sem nível aprovado em T-03 ou sem avaliação manual, a tarefa fica `Bloqueada`; não declara conformidade WCAG por teste automatizado isolado (NFR-03).
- **Dependências:** T-03, T-38, T-39
- **Arquivos prováveis:** `tests/quality/accessibility-checklist.md`
- **Tipo:** Test

### T-41
- **Título:** Verificar matriz de compatibilidade
- **Descrição curta:** Executar fluxos essenciais nos navegadores/dispositivos aprovados e registrar resultados.
- **Critérios de aceite:** `tests/quality/compatibility-matrix.md` lista cada navegador, versão, sistema, dispositivo/viewport aprovados em T-03 e, para cada um, ambiente, execução dos fluxos busca→seleção→clima, unidade e resultado/evidência ou bloqueio. Matriz não aprovada ou item não executado mantém tarefa `Bloqueada`; não presume compatibilidade (NFR-01, NFR-07).
- **Dependências:** T-03, T-38, T-39
- **Arquivos prováveis:** `tests/quality/compatibility-matrix.md`
- **Tipo:** Test

### T-42
- **Título:** Executar gates automatizados
- **Descrição curta:** Executar os gates existentes após implementação.
- **Critérios de aceite:** No ambiente de CI/desenvolvimento com Node.js `>=22` e pnpm `11.8.0`, executar `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e`; registrar execução, ambiente, saída/status de cada comando e falhas no resultado da tarefa/CI. Concluir somente se os quatro passam; E2E usa interceptação de API e não depende de serviço ao vivo (NFR-03, NFR-07).
- **Dependências:** T-38, T-39
- **Arquivos prováveis:** Nenhum arquivo; comandos existentes
- **Tipo:** Infra

### T-43
- **Título:** Medir usabilidade com participantes
- **Descrição curta:** Executar método/amostra aprovados, sem substituir pessoas por testes automatizados.
- **Critérios de aceite:** `tests/quality/usability-results.md` registra decisão/aprovação e fonte para público, número de participantes, roteiro, ambiente e limiar; depois registra amostra realizada, resultados individuais/agregados, tempo até buscar/consultar/alternar, falhas e limitações. Usa participantes reais, não mocks; sem método, limiar ou aprovação de T-03, fica `Bloqueada` e não declara NFR-02 atendido.
- **Dependências:** T-03, T-38, T-39, T-42
- **Arquivos prováveis:** `tests/quality/usability-results.md`
- **Tipo:** Test

### T-44
- **Título:** Medir performance real
- **Descrição curta:** Medir no ambiente/perfil/amostra aprovados; não criar tarefa de deploy.
- **Critérios de aceite:** `tests/quality/performance-results.md` registra método, aprovador/fonte, build, ambiente, perfil de rede/dispositivo, amostra aprovada (incluindo 100 execuções somente se ratificado), latência p95 observada e tratamento da latência do provedor; compara com o limiar aprovado e separa app/provedor. Medição usa requisições reais, nunca mocks; sem perfil, amostra, limiar ou ambiente aprovado, fica `Bloqueada` (NFR-04).
- **Dependências:** T-03, T-38, T-39, T-42
- **Arquivos prováveis:** `tests/quality/performance-results.md`
- **Tipo:** Test

### T-45
- **Título:** Medir disponibilidade real
- **Descrição curta:** Avaliar probes e janela aprovados para app e provedor, sem implementar deploy/monitoração.
- **Critérios de aceite:** `tests/quality/availability-results.md` registra método/probe, aprovador/fonte, ambiente, intervalo, janela observada, denominador, sucessos/falhas e disponibilidade calculada separadamente para app e provedor; compara com meta aprovada (99,5% somente se ratificada). Usa evidência operacional real, sem mocks; sem ambiente, janela, método ou limiar aprovados, fica `Bloqueada` e não declara NFR-05 atendido.
- **Dependências:** T-03, T-42
- **Arquivos prováveis:** `tests/quality/availability-results.md`
- **Tipo:** Test

## Rastreabilidade FR → Tarefas

| Requisito funcional | Tarefas de implementação | Tarefas de teste/validação |
| --- | --- | --- |
| FR-01 — Buscar cidades | T-16 (geocoding), T-20 (orquestração), T-22 (formulário), T-25 (estado sem resultados) | T-07, T-17, T-21, T-27, T-29, T-37, T-38, T-39 |
| FR-02 — Selecionar cidade | T-16 (resultados de geocoding), T-20 (seleção), T-23 (resultados contextuais) | T-07, T-17, T-21, T-28, T-37, T-38, T-39 |
| FR-03 — Consultar clima atual | T-08 (normalização), T-18 (serviço forecast/current), T-20 (estado), T-30 (apresentação atual) | T-09, T-19, T-21, T-31, T-37, T-38, T-39 |
| FR-04 — Consultar previsão de cinco datas | T-10 (normalização), T-18 (serviço forecast), T-20 (estado), T-32 (apresentação forecast) | T-11, T-19, T-21, T-33, T-37, T-38, T-39 |
| FR-05 — Alternar Celsius/Fahrenheit | T-12 (conversão), T-20 (estado da unidade), T-34 (controle) | T-13, T-21, T-35, T-37, T-38, T-39 |
| FR-06 — Atualizar dados ao trocar cidade | T-20 (orquestração e concorrência), T-23 (seleção), T-30 (clima atual), T-32 (previsão), T-36 (composição) | T-21, T-28, T-31, T-33, T-37, T-38, T-39 |
| FR-07 — Informar falhas e permitir nova tentativa | T-16, T-18 (classificação de falhas), T-20 (erro/retry), T-25 (vazio), T-26 (erro) | T-17, T-19, T-21, T-29, T-37, T-38, T-39 |
| FR-08 — Indicar carregamento | T-20 (estado loading), T-24 (apresentação loading), T-36 (composição) | T-21, T-29, T-37, T-38, T-39 |

Todos os requisitos FR-01 a FR-08 têm ao menos uma tarefa de implementação e uma tarefa de teste/validação. Nenhum requisito funcional está sem cobertura no backlog.

## Prioridade e tamanho

- **P0:** caminho crítico para um MVP funcional e verificável dos requisitos funcionais.
- **P1:** validação de qualidade/produção após a primeira fatia utilizável; não deve ser declarada concluída sem evidência.
- **P2:** melhoria opcional que não bloqueia os FR obrigatórios do MVP. Neste backlog, T-14/T-15 são a extensão opcional de rótulos/ícones WMO; itens fora de escopo não foram convertidos em tarefas.
- **P (pequeno):** uma unidade localizada, normalmente um arquivo e um comportamento/teste direto.
- **M (médio):** uma integração delimitada ou múltiplos cenários relacionados numa única unidade.
- **G (grande):** decisões que abrangem vários domínios, fluxo integrado amplo ou medição que depende de ambiente/amostra/janela.

| Tarefa | Prioridade | Tamanho |
| --- | --- | --- |
| T-01 | P0 | G |
| T-02 | P0 | G |
| T-03 | P0 | G |
| T-04 | P0 | M |
| T-05 | P0 | P |
| T-06 | P0 | P |
| T-07 | P0 | P |
| T-08 | P0 | P |
| T-09 | P0 | P |
| T-10 | P0 | M |
| T-11 | P0 | M |
| T-12 | P0 | P |
| T-13 | P0 | P |
| T-14 | P2 | M |
| T-15 | P2 | P |
| T-16 | P0 | M |
| T-17 | P0 | M |
| T-18 | P0 | M |
| T-19 | P0 | M |
| T-20 | P0 | G |
| T-21 | P0 | G |
| T-22 | P0 | P |
| T-23 | P0 | P |
| T-24 | P0 | P |
| T-25 | P0 | P |
| T-26 | P0 | M |
| T-27 | P0 | P |
| T-28 | P0 | P |
| T-29 | P0 | M |
| T-30 | P0 | P |
| T-31 | P0 | M |
| T-32 | P0 | M |
| T-33 | P0 | M |
| T-34 | P0 | P |
| T-35 | P0 | P |
| T-36 | P0 | G |
| T-37 | P0 | G |
| T-38 | P0 | G |
| T-39 | P0 | M |
| T-40 | P1 | M |
| T-41 | P1 | M |
| T-42 | P0 | P |
| T-43 | P1 | G |
| T-44 | P1 | G |
| T-45 | P1 | G |

## Sequência vertical sugerida

1. **Gate de produto/contratos:** concluir T-01 a T-05 para a fatia em questão. Priorizar primeiro busca, geocoding e temperatura atual; decisões exclusivas de forecast/unidade podem bloquear somente a fatia posterior se os contratos forem separados e aprovados.
2. **Fatia vertical 1 — Buscar cidade e consultar temperatura atual:** T-06, T-07, T-08, T-09, T-16, T-17, T-22 a T-29, T-30, T-31 e uma integração/teste de `App` reduzidos ao fluxo atual. Entrega visível: busca, seleção, temperatura atual e estados loading/vazio/erro, validada com testes e sem esperar forecast, unidade ou WMO.
3. **Fatia vertical 2 — Previsão de cinco datas:** T-10, T-11, parte forecast de T-18/T-19, T-32/T-33 e integração/teste de `App` atualizado. Entrega visível: previsão local para cinco datas, inclusive tratamento de resposta parcial.
4. **Fatia vertical 3 — Alternância de unidade:** T-12/T-13 e T-34/T-35, integradas e verificadas no fluxo completo; converte a apresentação sem nova requisição.
5. **Fatia vertical 4 — E2E e qualidade:** T-38/T-39 cobrem os viewports desktop/tablet/mobile; T-40 a T-45 registram acessibilidade, compatibilidade, gates e medições reais.
6. **Extensão P2 — Apresentação WMO:** executar T-14/T-15 somente após aprovação da tabela/ícones; não bloqueia as quatro fatias obrigatórias.

**Mudança necessária para a primeira fatia ficar executável:** o backlog atual acopla current e forecast em T-18/T-19 e em `useWeather` T-20/T-21; T-36/T-37 também exigem Forecast e UnitToggle. Antes de iniciar a Fatia 1, dividir esses serviços/hook/App em integração mínima de busca+current e extensão posterior de forecast/unidade, ajustando dependências e IDs. Sem essa divisão, a primeira entrega executável permanece o MVP completo de T-36/T-37, não a Fatia 1 isolada.

## Bloqueios finais
Tarefas dependentes não podem assumir valores provisórios: decisões de busca (count, idioma, acentos e contexto), campos/granularidade, fallback de timezone, timeout, freshness, conversão/arredondamento/persistência, tabela WMO, matriz de navegadores e métodos/limiares NFR exigem escolha aprovada com aprovador e fonte no artefato indicado; sem isso, a tarefa correspondente fica `Bloqueada`. Medições de usabilidade, performance e disponibilidade só concluem com participantes ou evidência operacional no ambiente e método aprovados. Mantêm-se fora de escopo autenticação, persistência no servidor, GPS, offline/cache, app nativo, alertas, favoritos, histórico, compartilhamento, notificações e deploy.
