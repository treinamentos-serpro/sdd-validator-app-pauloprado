# Backlog de Tarefas — Weather App

Decisões ainda abertas são gates: tarefas dependentes só avançam com escolhas aprovadas registradas. Nenhum valor provisório é presumido. Caminhos são previsões de artefatos, não afirmações de que arquivos de código já existem.

## Entrega 1 — Decisões e contratos

### T-01
- **Título:** Fechar decisões de busca e seleção
- **Descrição curta:** Registrar `count`, idioma, política de acentos/Unicode e contexto/fallback para homônimos.
- **Critérios de aceite:** Cada escolha está aprovada ou explicitamente bloqueada, sem parâmetros presumidos. (FR-01, FR-02; AC-01, AC-01b, AC-01c, AC-02)
- **Dependências:** Nenhuma
- **Arquivos prováveis:** `specs/weather-app-spec.md`
- **Tipo:** Infra

### T-02
- **Título:** Fechar decisões meteorológicas e de unidade
- **Descrição curta:** Registrar campos/granularidade, fallback de timezone, timeout, freshness, arredondamento/persistência e tabela WMO pt-BR de rótulos/ícones; resolver a inconsistência sobre ausência de temperatura utilizável.
- **Critérios de aceite:** Decisões aprovadas ou bloqueadas; nenhuma é presumida por tarefas dependentes. (FR-03–FR-05; AC-03b, AC-03c, AC-04, AC-04b, AC-05, AC-07d; NFR-06)
- **Dependências:** T-01
- **Arquivos prováveis:** `specs/weather-app-spec.md`
- **Tipo:** Infra

### T-03
- **Título:** Fechar critérios de qualidade e medição
- **Descrição curta:** Registrar matriz de navegadores/dispositivos, nível de acessibilidade e métodos, ambientes, amostras e limites para avaliar NFRs.
- **Critérios de aceite:** Escolhas aprovadas ou bloqueadas; métodos distinguem evidência real do app e do provedor. (NFR-01–NFR-05, NFR-07)
- **Dependências:** T-02
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`
- **Tipo:** Infra

### T-04
- **Título:** Validar separadamente os contratos Open-Meteo
- **Descrição curta:** Conferir documentação vigente, parâmetros aprovados, payloads, unidades, fuso, termos, limites, cobertura, disponibilidade e custos.
- **Critérios de aceite:** Registrar discrepâncias/resultados ou bloqueios; não presumir garantias do provedor nem usar API ao vivo em testes. (FR-01–FR-04; AC-01b, AC-07a; NFR-05, NFR-08)
- **Dependências:** T-01, T-02, T-03
- **Arquivos prováveis:** `plans/weather-app-plan.md`
- **Tipo:** Infra

## Entrega 2 — Contratos e funções puras

### T-05
- **Título:** Definir contratos TypeScript do domínio
- **Descrição curta:** Criar tipos estritos para cidade, unidade, dados, estados, erros e respostas parciais.
- **Critérios de aceite:** Refletem apenas escolhas aprovadas, representam ausências/estados sem `any` e compilam em strict. (FR-02–FR-07; AC-03b, AC-03c, AC-04b; NFR-06)
- **Dependências:** T-01, T-02, T-04
- **Arquivos prováveis:** `src/types/weather.ts`
- **Tipo:** Data

### T-06
- **Título:** Implementar normalização de geocoding
- **Descrição curta:** Validar payload desconhecido e mapear cidades conforme contratos aprovados.
- **Critérios de aceite:** Preserva coordenadas/contexto; zero resultados distingue-se de payload inválido; valores malformados não viram cidades. (FR-01, FR-02, FR-07; AC-01, AC-02, AC-07a, AC-07c)
- **Dependências:** T-01, T-04, T-05
- **Arquivos prováveis:** `src/lib/normalizeGeocoding.ts`
- **Tipo:** Data

### T-07
- **Título:** Testar normalização de geocoding
- **Descrição curta:** Cobrir a função pura com Vitest e fixtures, sem rede.
- **Critérios de aceite:** Cobrir payload válido/vazio/malformado, contexto opcional e coordenadas inválidas. (FR-01, FR-02, FR-07; AC-01, AC-02, AC-07a, AC-07c)
- **Dependências:** T-01, T-04, T-06
- **Arquivos prováveis:** `tests/lib/normalizeGeocoding.test.ts`
- **Tipo:** Test

### T-08
- **Título:** Implementar normalização de clima atual
- **Descrição curta:** Validar e mapear campos atuais aprovados, preservando dados válidos e representando ausências.
- **Critérios de aceite:** Unidades e regra de dados não utilizáveis seguem decisões; não inventa valores nem reutiliza dados anteriores. (FR-03, FR-07; AC-03, AC-03b, AC-03c, AC-07b; NFR-06)
- **Dependências:** T-02, T-04, T-05
- **Arquivos prováveis:** `src/lib/normalizeCurrentWeather.ts`
- **Tipo:** Data

### T-09
- **Título:** Testar normalização de clima atual
- **Descrição curta:** Cobrir payload atual com Vitest, sem serviço ou UI.
- **Critérios de aceite:** Cobrir dados válidos, ausentes/inválidos, unidades inesperadas, temperatura ausente com outro campo válido, nenhum dado utilizável e payload malformado. (FR-03; AC-03, AC-03b, AC-03c; NFR-06)
- **Dependências:** T-02, T-08
- **Arquivos prováveis:** `tests/lib/normalizeCurrentWeather.test.ts`
- **Tipo:** Test

### T-10
- **Título:** Implementar normalização de forecast
- **Descrição curta:** Validar datas e campos aprovados, mantendo somente dados recebidos válidos.
- **Critérios de aceite:** Usa timezone decidido, limita a cinco datas, não preenche lacunas e distingue forecast incompleto/indisponível. (FR-04; AC-04, AC-04b; NFR-06)
- **Dependências:** T-02, T-04, T-05
- **Arquivos prováveis:** `src/lib/normalizeForecast.ts`
- **Tipo:** Data

### T-11
- **Título:** Testar normalização de forecast
- **Descrição curta:** Cobrir datas locais e respostas parciais com relógio/timezone controlados.
- **Critérios de aceite:** Cobrir cinco datas, mudança de dia, datas/campos ausentes ou inválidos, menos de cinco, nenhum válido e payload malformado; sem preencher lacunas. (FR-04; AC-04, AC-04b; NFR-06)
- **Dependências:** T-02, T-10
- **Arquivos prováveis:** `tests/lib/normalizeForecast.test.ts`
- **Tipo:** Test

### T-12
- **Título:** Implementar conversão de temperatura
- **Descrição curta:** Criar conversão/formatação pura dos campos aprovados, mantendo Celsius canônico.
- **Critérios de aceite:** Arredondamento segue decisão; não muta dados nem faz requisições. (FR-05; AC-05; NFR-06)
- **Dependências:** T-02, T-05
- **Arquivos prováveis:** `src/lib/temperature.ts`
- **Tipo:** Data

### T-13
- **Título:** Testar conversão de temperatura
- **Descrição curta:** Validar conversão e formatação em Vitest.
- **Critérios de aceite:** Verificar 0 °C → 32 °F, 20 °C → 68 °F, retorno sem mutação e arredondamento aprovado. (FR-05; AC-05; NFR-06)
- **Dependências:** T-02, T-12
- **Arquivos prováveis:** `tests/lib/temperature.test.ts`
- **Tipo:** Test

### T-14
- **Título:** Implementar tabela de códigos WMO
- **Descrição curta:** Mapear códigos para rótulos pt-BR e ícones aprovados, sem inventar assets ou fallbacks.
- **Critérios de aceite:** Códigos aprovados e código desconhecido seguem tabela/fallback decidido. (FR-03, FR-04; AC-03b, AC-04b; NFR-06)
- **Dependências:** T-02, T-05
- **Arquivos prováveis:** `src/lib/weatherCode.ts`
- **Tipo:** Data

### T-15
- **Título:** Testar tabela de códigos WMO
- **Descrição curta:** Cobrir mapeamentos e fallback com Vitest.
- **Critérios de aceite:** Verificar rótulos/ícones aprovados e código desconhecido sem conteúdo inventado. (FR-03, FR-04; AC-03b, AC-04b; NFR-06)
- **Dependências:** T-02, T-14
- **Arquivos prováveis:** `tests/lib/weatherCode.test.ts`
- **Tipo:** Test

## Entrega 3 — Serviços

### T-16
- **Título:** Implementar serviço de geocoding
- **Descrição curta:** Construir requisição aprovada, verificar HTTP e encaminhar payload à normalização, sem UI.
- **Critérios de aceite:** Parâmetros aprovados e Unicode codificado; vazio não requisita; falha não é resultado vazio. (FR-01, FR-02, FR-07; AC-01b, AC-01c, AC-07a, AC-07c; NFR-08)
- **Dependências:** T-01, T-04, T-05, T-06
- **Arquivos prováveis:** `src/services/geocoding.ts`
- **Tipo:** Data

### T-17
- **Título:** Testar geocoding com fetch mockado
- **Descrição curta:** Testar somente serviço, com Vitest e `fetch` mockado.
- **Critérios de aceite:** Cobrir URL/parâmetros, trim, acentos/apóstrofo, sucesso, zero hits, JSON inválido, rede, HTTP 429/5xx e outros não-2xx; vazio não chama fetch. (FR-01, FR-02, FR-07; AC-01, AC-01b, AC-01c, AC-07a, AC-07c)
- **Dependências:** T-01, T-04, T-16
- **Arquivos prováveis:** `tests/services/geocoding.test.ts`
- **Tipo:** Test

### T-18
- **Título:** Implementar serviço de forecast
- **Descrição curta:** Consultar current/forecast segundo contrato aprovado, verificar HTTP e entregar payload à normalização.
- **Critérios de aceite:** Coordenadas, campos, granularidade, unidades e timezone não divergem das decisões; falha não vira sucesso parcial. (FR-03, FR-04, FR-07; AC-03b, AC-03c, AC-04, AC-04b, AC-07b; NFR-08)
- **Dependências:** T-02, T-04, T-05, T-08, T-10
- **Arquivos prováveis:** `src/services/forecast.ts`
- **Tipo:** Data

### T-19
- **Título:** Testar forecast com fetch mockado
- **Descrição curta:** Testar somente serviço de forecast, sem rede real.
- **Critérios de aceite:** Cobrir parâmetros, sucesso/parcial, payload/JSON inválido, rede, HTTP 429/5xx/outros não-2xx e timeout aprovado. Mocks não medem NFR real. (FR-03, FR-04, FR-07; AC-03b, AC-03c, AC-04b, AC-07b, AC-07d)
- **Dependências:** T-01, T-02, T-04, T-18
- **Arquivos prováveis:** `tests/services/forecast.test.ts`
- **Tipo:** Test

## Entrega 4 — Hook e interface

### T-20
- **Título:** Implementar hook de busca e clima
- **Descrição curta:** Orquestrar busca/seleção, estados independentes, retry explícito, unidade e concorrência.
- **Critérios de aceite:** Estados idle/loading/success/empty/error; vazio sem chamada; forecast após seleção; retry só da operação falha; timeout aprovado; corrida A/B ignora resposta tardia; unidade não requisita; cidade nova não apresenta dados antigos. (FR-01–FR-08; AC-01b, AC-06, AC-06b, AC-07a–AC-08; NFR-06)
- **Dependências:** T-01, T-02, T-05, T-12, T-16, T-18
- **Arquivos prováveis:** `src/hooks/useWeather.ts`
- **Tipo:** Data

### T-21
- **Título:** Testar hook, retry e concorrência
- **Descrição curta:** Testar hook com Testing Library, promises e relógio controlados.
- **Critérios de aceite:** Cobrir estados, parcialidade independente, rede/HTTP/timeout, retry isolado, loading, corrida A/B e conversão C/F sem nova chamada. (FR-01–FR-08; AC-01b, AC-03b, AC-03c, AC-04b, AC-05, AC-06b, AC-07a–AC-08; NFR-06)
- **Dependências:** T-01, T-02, T-20
- **Arquivos prováveis:** `tests/hooks/useWeather.test.ts`
- **Tipo:** Test

### T-22
- **Título:** Implementar formulário de busca
- **Descrição curta:** Criar entrada e envio por teclado, com estado local e mensagem de input vazio.
- **Critérios de aceite:** Trim segue decisão; vazio não chama busca; mensagem, nome acessível e foco visível. (FR-01, FR-07; AC-01b, AC-01c; NFR-03)
- **Dependências:** T-01, T-20
- **Arquivos prováveis:** `src/components/CitySearch.tsx`
- **Tipo:** UI

### T-23
- **Título:** Implementar resultados de cidades
- **Descrição curta:** Apresentar resultados contextuais e seleção da cidade correta.
- **Critérios de aceite:** Distingue homônimos com contexto disponível; seleção por teclado repassa coordenadas corretas. (FR-02, FR-06; AC-02, AC-06; NFR-03, NFR-06)
- **Dependências:** T-01, T-05, T-20
- **Arquivos prováveis:** `src/components/CityResults.tsx`
- **Tipo:** UI

### T-24
- **Título:** Implementar estado visual de loading
- **Descrição curta:** Apresentar carregamento com semântica acessível.
- **Critérios de aceite:** Loading é anunciado e some ao concluir/falhar. (FR-08; AC-08; NFR-03)
- **Dependências:** T-20
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`
- **Tipo:** UI

### T-25
- **Título:** Implementar estado visual vazio
- **Descrição curta:** Apresentar busca concluída sem resultados, distinta de erro.
- **Critérios de aceite:** Exibe `Nenhuma cidade encontrada` e permite nova busca. (FR-01, FR-07; AC-07a; NFR-03)
- **Dependências:** T-01, T-20
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`
- **Tipo:** UI

### T-26
- **Título:** Implementar estado visual de erro
- **Descrição curta:** Apresentar mensagem de erro e retry explícito da operação correspondente.
- **Critérios de aceite:** Não confunde erro e vazio; ação acessível não cria retry automático. (FR-07, FR-08; AC-07b–AC-07d, AC-08; NFR-03)
- **Dependências:** T-02, T-20
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`
- **Tipo:** UI

### T-27
- **Título:** Testar formulário de busca
- **Descrição curta:** Cobrir interação, teclado e input vazio com Testing Library.
- **Critérios de aceite:** Verificar envio, vazio sem callback, mensagem, trim/Unicode, nome acessível e foco. (FR-01; AC-01b, AC-01c; NFR-03)
- **Dependências:** T-01, T-22
- **Arquivos prováveis:** `tests/components/CitySearch.test.tsx`
- **Tipo:** Test

### T-28
- **Título:** Testar resultados de cidades
- **Descrição curta:** Cobrir contexto, homônimos e seleção com Testing Library.
- **Critérios de aceite:** Verificar contexto opcional, teclado e coordenadas do item selecionado. (FR-02, FR-06; AC-02, AC-06; NFR-03)
- **Dependências:** T-01, T-23
- **Arquivos prováveis:** `tests/components/CityResults.test.tsx`
- **Tipo:** Test

### T-29
- **Título:** Testar estados visuais
- **Descrição curta:** Cobrir loading, vazio e erro/retry em um único arquivo de teste.
- **Critérios de aceite:** Verificar semântica, mensagens, distinção vazio/erro e retry por teclado. (FR-07, FR-08; AC-07a–AC-08; NFR-03)
- **Dependências:** T-01, T-02, T-24, T-25, T-26
- **Arquivos prováveis:** `tests/components/WeatherStates.test.tsx`
- **Tipo:** Test

## Entrega 5 — Clima, previsão, unidade e App

### T-30
- **Título:** Implementar clima atual
- **Descrição curta:** Apresentar campos aprovados, indisponibilidade e WMO aprovado.
- **Critérios de aceite:** Não inventa ausências nem mostra dados antigos; trata temperatura não válida conforme decisão. (FR-03, FR-06; AC-03, AC-03b, AC-03c, AC-06; NFR-06)
- **Dependências:** T-02, T-05, T-08, T-12, T-14, T-20
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`
- **Tipo:** UI

### T-31
- **Título:** Testar clima atual
- **Descrição curta:** Cobrir dados válidos, parciais e indisponíveis com Testing Library.
- **Critérios de aceite:** Verificar campos, temperatura ausente/outros campos válidos, seção indisponível e WMO aprovado. (FR-03; AC-03, AC-03b, AC-03c; NFR-06)
- **Dependências:** T-02, T-30
- **Arquivos prováveis:** `tests/components/CurrentWeather.test.tsx`
- **Tipo:** Test

### T-32
- **Título:** Implementar forecast
- **Descrição curta:** Apresentar datas/campos aprovados e estados incompleto/indisponível.
- **Critérios de aceite:** Só mostra datas recebidas válidas, no máximo cinco, no timezone aprovado; sem preencher lacunas. (FR-04; AC-04, AC-04b; NFR-06)
- **Dependências:** T-02, T-05, T-10, T-12, T-14, T-20
- **Arquivos prováveis:** `src/components/Forecast.tsx`
- **Tipo:** UI

### T-33
- **Título:** Testar forecast
- **Descrição curta:** Cobrir cinco datas e respostas parciais com Testing Library.
- **Critérios de aceite:** Verificar cinco datas, previsão incompleta/indisponível, campos ausentes e WMO aprovado. (FR-04; AC-04, AC-04b; NFR-06)
- **Dependências:** T-02, T-32
- **Arquivos prováveis:** `tests/components/Forecast.test.tsx`
- **Tipo:** Test

### T-34
- **Título:** Implementar controle de unidade
- **Descrição curta:** Criar controle acessível que atualiza a unidade de apresentação.
- **Critérios de aceite:** Celsius inicial; alternar e retornar não chama geocoding/forecast. (FR-05; AC-05; NFR-03, NFR-06)
- **Dependências:** T-02, T-12, T-20
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`
- **Tipo:** UI

### T-35
- **Título:** Testar controle de unidade
- **Descrição curta:** Cobrir alternância e acessibilidade com Testing Library.
- **Critérios de aceite:** Verificar Celsius inicial, ambas direções, controle acessível e nenhuma chamada nova. (FR-05; AC-05; NFR-03)
- **Dependências:** T-02, T-34
- **Arquivos prováveis:** `tests/components/UnitToggle.test.tsx`
- **Tipo:** Test

### T-36
- **Título:** Compor experiência em App
- **Descrição curta:** Integrar hook, busca, estados, clima, forecast e unidade sem chamadas de API na UI.
- **Critérios de aceite:** Seleção é explícita; troca de cidade não mantém dados antigos como atuais; falha de uma seção preserva seção válida independente. (FR-01–FR-08; AC-01–AC-08; NFR-06)
- **Dependências:** T-01, T-02, T-20, T-22, T-23, T-24, T-25, T-26, T-30, T-32, T-34
- **Arquivos prováveis:** `src/App.tsx`
- **Tipo:** UI

### T-37
- **Título:** Testar integração em App
- **Descrição curta:** Testar fluxo integrado com serviços controlados e Testing Library.
- **Critérios de aceite:** Cobrir busca, seleção, loading/sucesso/vazio/erro, retry, parcialidade, troca de cidade e unidade sem nova chamada. (FR-01–FR-08; AC-01–AC-08; NFR-03, NFR-06)
- **Dependências:** T-01, T-02, T-36
- **Arquivos prováveis:** `tests/App.test.tsx`
- **Tipo:** Test

## Entrega 6 — E2E responsivo

### T-38
- **Título:** Testar E2E desktop/tablet
- **Descrição curta:** Playwright com rotas interceptadas em 768, 1024 e 1440 px.
- **Critérios de aceite:** Cobrir fluxo, cinco datas, unidade, vazio, loading, falhas e retry; sem rolagem horizontal/sobreposição. Relógio/timezone controlados; mocks não medem NFR real. (AC-01–AC-08; NFR-01, NFR-03, NFR-07)
- **Dependências:** T-01, T-02, T-03, T-36, T-37
- **Arquivos prováveis:** `tests/e2e/weather-desktop.spec.ts`
- **Tipo:** Test

### T-39
- **Título:** Testar E2E mobile
- **Descrição curta:** Playwright com rotas interceptadas em 320 e 375 px.
- **Critérios de aceite:** Cobrir fluxo principal, unidade e erro/retry; sem rolagem horizontal/sobreposição e controles alcançáveis. Fixtures/relógio controlados; sem API ao vivo ou medição NFR por mocks. (AC-01–AC-08; NFR-01, NFR-03, NFR-07)
- **Dependências:** T-01, T-02, T-03, T-36, T-37
- **Arquivos prováveis:** `tests/e2e/weather-mobile.spec.ts`
- **Tipo:** Test

## Entrega 7 — Hardening e medições

### T-40
- **Título:** Revisar acessibilidade manualmente
- **Descrição curta:** Registrar avaliação de teclado, foco, nomes e contraste conforme nível aprovado.
- **Critérios de aceite:** Checklist contém evidências e falhas; não declara conformidade sem avaliação. (NFR-03)
- **Dependências:** T-03, T-38, T-39
- **Arquivos prováveis:** `tests/quality/accessibility-checklist.md`
- **Tipo:** Test

### T-41
- **Título:** Verificar matriz de compatibilidade
- **Descrição curta:** Executar fluxos essenciais nos navegadores/dispositivos aprovados e registrar resultados.
- **Critérios de aceite:** Cada item da matriz tem evidência ou bloqueio explícito, sem presumir cobertura. (NFR-01, NFR-07)
- **Dependências:** T-03, T-38, T-39
- **Arquivos prováveis:** `tests/quality/compatibility-matrix.md`
- **Tipo:** Test

### T-42
- **Título:** Executar gates automatizados
- **Descrição curta:** Executar os gates existentes após implementação.
- **Critérios de aceite:** Passam `pnpm lint`, `pnpm build`, `pnpm test`, `pnpm test:e2e`; falhas são registradas. (NFR-03, NFR-07)
- **Dependências:** T-38, T-39
- **Arquivos prováveis:** Nenhum arquivo; comandos existentes
- **Tipo:** Infra

### T-43
- **Título:** Medir usabilidade com participantes
- **Descrição curta:** Executar método/amostra aprovados, sem substituir pessoas por testes automatizados.
- **Critérios de aceite:** Registrar público, amostra, roteiro, resultados e limitações; mocks não contam como evidência real. (NFR-02)
- **Dependências:** T-03, T-38, T-39, T-42
- **Arquivos prováveis:** `tests/quality/usability-results.md`
- **Tipo:** Test

### T-44
- **Título:** Medir performance real
- **Descrição curta:** Medir no ambiente/perfil/amostra aprovados; não criar tarefa de deploy.
- **Critérios de aceite:** Registrar resultados e separar cliente/provedor conforme método; não usar mocks. Sem ambiente, permanece bloqueada. (NFR-04)
- **Dependências:** T-03, T-38, T-39, T-42
- **Arquivos prováveis:** `tests/quality/performance-results.md`
- **Tipo:** Test

### T-45
- **Título:** Medir disponibilidade real
- **Descrição curta:** Avaliar probes e janela aprovados para app e provedor, sem implementar deploy/monitoração.
- **Critérios de aceite:** Registrar período/evidências, separar indisponibilidade do app e do provedor; mocks não contam. Sem ambiente/janela, permanece bloqueada. (NFR-05)
- **Dependências:** T-03, T-42
- **Arquivos prováveis:** `tests/quality/availability-results.md`
- **Tipo:** Test

## Notas
As antigas T-04 a T-11 foram desdobradas entre funções puras, serviços, hook e testes; T-10/T-11 foram detalhadas em busca, estados, clima atual, forecast e unidade; T-12 foi separada entre App e teste; T-13/T-14 seguem como E2E desktop/tablet e mobile; T-15 virou revisão manual, compatibilidade e gates; T-16 foi dividida em medições independentes. Pendências: decisões de busca/dados/timezone/timeout/freshness/unidade/WMO, contratos Open-Meteo, matriz de navegadores e métodos NFR; medições reais dependem de participantes ou ambiente/janela aprovados. Fora de escopo: auth, persistência no servidor, GPS, offline/cache, app nativo, alertas, favoritos, histórico, compartilhamento, notificações e deploy.
