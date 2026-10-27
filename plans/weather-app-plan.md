## Architecture

Aplicação web client-side, sem autenticação e sem persistência no servidor. A arquitetura mantém a rede isolada nos serviços e a normalização em funções puras.

```text
React UI (components)
        |
        v
Hook de orquestração (useWeather)
        |                     \
        v                      v
Serviço de geocoding     Serviço de forecast
        |                      |
        +----------+-----------+
                   v
       Open-Meteo Geocoding + Forecast

Respostas externas -> normalizadores puros (lib) -> contratos de domínio (types)
```

- **UI (`components/`, `App.tsx`)**: captura busca e seleção, apresenta resultados e estados; não conhece URLs nem payloads do provedor.
- **Orquestração (`hooks/`)**: coordena busca, seleção, carregamento, retry e identidade da consulta vigente. Mantém separados o resultado atual e a previsão.
- **Acesso externo (`services/`)**: constrói requisições Open-Meteo, interpreta status HTTP e entrega payloads tipados como desconhecidos para validação/normalização. Nenhum componente chama a API diretamente.
- **Funções puras (`lib/`)**: validam e convertem respostas do provedor em contratos de domínio; conversão de temperatura para apresentação também fica isolada e não causa nova requisição.
- **Contratos (`types/`)**: modelos compartilhados de cidade, clima, estado e erro.

Não há backend próprio no MVP. As fronteiras permitem testar a UI e os serviços com respostas controladas, sem depender de chamadas ao vivo.

## Tech Stack

| Tecnologia | Decisão e justificativa | Rastreabilidade |
| --- | --- | --- |
| React + TypeScript strict | Mantém a stack do repositório; contratos discriminados representam estados sem `any`. | FR-01–FR-08; AC-01–AC-08; NFR-06 |
| Vite | Ferramenta de desenvolvimento e build já adotada pelo projeto. | NFR-04, NFR-07 |
| Tailwind CSS | Mantém o padrão visual e de estilo do repositório. | NFR-01, NFR-03 |
| pnpm + Biome | Mantêm os comandos e convenções de dependências, lint e formatação existentes. | NFR-07 |
| Vitest + Testing Library | Testes rápidos de funções, serviços e componentes React. | AC-01–AC-08; NFR-03, NFR-04 |
| Playwright | Validação dos fluxos integrados em navegador, com APIs interceptadas. | AC-01–AC-08; NFR-01, NFR-03, NFR-07 |
| Open-Meteo | Fonte inicial confirmada, sem API key. Termos, cobertura, limites e disponibilidade precisam ser avaliados; não se presume precisão ou garantia do provedor. | FR-01–FR-04, FR-07; NFR-05, NFR-08 |

Não se propõe Redux, TanStack Query, persistência de browser ou uma camada de backend: o estado e o fluxo atuais não justificam essas dependências.

## Project Structure

Preservar a organização do README; responsabilidades previstas, sem criar arquivos nesta etapa:

```text
src/
├── components/      # Busca, resultados, cidade selecionada e seções meteorológicas
│   └── states/      # Apresentações reutilizáveis de loading, erro e vazio
├── hooks/           # useWeather: estado e orquestração da tela
├── services/        # Cliente Open-Meteo, geocoding e forecast
├── lib/             # Normalização, validação, conversão e formatação puras
├── types/           # Contratos compartilhados
├── styles/          # Tailwind e estilos globais
├── App.tsx          # Composição da experiência
└── main.tsx         # Bootstrap React
```

Manter um componente por arquivo, serviços sem dependência da UI e funções puras testáveis. Os nomes são responsabilidades planejadas, não instrução para gerar arquivos agora.

## Data Model

Contratos declarativos; campos externos não validados não devem ser tratados como domínio. `null` representa um campo selecionado para exibição, mas ausente ou inválido na resposta. A spec exige temperatura atual; os demais campos e a granularidade da previsão abaixo são uma proposta técnica baseada em variáveis disponíveis na Open-Meteo e precisam ser aprovados.

```ts
type Unit = "celsius" | "fahrenheit";

interface City {
  id?: number; // ID da localidade, quando fornecido.
  name: string; // Nome da cidade retornado pelo geocoding.
  latitude: number; // Latitude usada na consulta meteorológica.
  longitude: number; // Longitude usada na consulta meteorológica.
  country?: string; // País, quando disponível.
  countryCode?: string; // Código do país, quando disponível.
  admin1?: string; // Região administrativa, quando disponível.
  timezone?: string; // Fuso IANA, quando disponível.
}

interface CurrentWeather {
  time: string; // Horário local da observação retornado pela API.
  temperatureC: number | null; // Temperatura atual em Celsius.
  apparentTemperatureC: number | null; // Sensação térmica em Celsius, proposta.
  relativeHumidityPct: number | null; // Umidade relativa em porcentagem, proposta.
  precipitationMm: number | null; // Precipitação atual em milímetros, proposta.
  windSpeedKmh: number | null; // Velocidade do vento em km/h, proposta.
  weatherCode: number | null; // Código meteorológico WMO, proposta.
  isDay: boolean | null; // Indicador de dia/noite, proposta.
}

interface ForecastDay {
  date: string; // Data local no formato YYYY-MM-DD.
  temperatureMinC: number | null; // Mínima diária em Celsius, proposta.
  temperatureMaxC: number | null; // Máxima diária em Celsius, proposta.
  precipitationProbabilityMaxPct: number | null; // Probabilidade máxima de precipitação, proposta.
  precipitationSumMm: number | null; // Precipitação diária em milímetros, proposta.
  windSpeedMaxKmh: number | null; // Velocidade máxima diária do vento em km/h, proposta.
  weatherCode: number | null; // Código meteorológico WMO do dia, proposta.
}

interface WeatherData {
  city: City; // Localidade à qual os dados pertencem.
  current: CurrentWeather; // Dados atuais normalizados.
  forecast: readonly ForecastDay[]; // Até cinco datas locais normalizadas.
  retrievedAt: string; // Instante da consulta em ISO 8601.
}

type WeatherError =
  | { kind: "network" }
  | { kind: "http"; status: number }
  | { kind: "rate-limited" }
  | { kind: "timeout" }
  | { kind: "invalid-payload" }
  | { kind: "weather-unavailable" };

type ResourceState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: WeatherError };

type CitySearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty" }
  | { status: "success"; cities: readonly City[] }
  | { status: "error"; error: WeatherError };

interface WeatherViewState {
  selectedCity: City | null;
  unit: Unit;
  current: ResourceState<CurrentWeather>;
  forecast: ResourceState<readonly ForecastDay[]>;
}
```

- `Unit` representa a preferência de apresentação; a temperatura permanece em Celsius no domínio. Ao converter para Fahrenheit, não se altera o dado armazenado nem se faz nova busca.
- `temperatureC` é exigido por FR-03. Os demais campos de `CurrentWeather` e `ForecastDay` são uma proposta inicial para produto; selecionar campos da Open-Meteo não aprova automaticamente sua exibição no MVP.
- Campos escolhidos, mas ausentes ou inválidos na resposta, normalizam para `null`; não usar `undefined`, zero ou valores de consultas anteriores como substitutos.
- `weatherCode` preserva o código WMO fornecido pela API; a tabela de rótulos/ícones em pt-BR precisa ser definida e testada antes da apresentação visual.
- `City.id` pode não existir no retorno; seleção deve preservar coordenadas e contexto retornados. `timezone`, `country` e `admin1` são opcionais porque o provedor pode não os retornar.
- `WeatherData` agrega cidade, dados atuais, previsão e instante da consulta; no estado de tela, `current` e `forecast` permanecem independentes para permitir sucesso parcial sem apresentar conteúdo antigo como atual.
- Uma busca sem resultados é `empty`, não `WeatherError`. O valor inicial de `unit` é `"celsius"`.

## Data Flow

1. A pessoa informa o nome da cidade. Antes de enviar, o hook remove somente espaços externos (`trim`); busca vazia não chama serviço. Preserva Unicode, acentos, apóstrofos, pontuação e espaços internos.
2. O hook define a busca como loading e chama o serviço de geocoding com o texto aparado. Resultado vazio encerra em `empty`, sem solicitar forecast.
3. A UI apresenta nome e, quando disponíveis, região administrativa e país. A seleção identifica uma cidade concreta, incluindo coordenadas e metadados retornados.
4. Ao selecionar uma cidade, a orquestração inicia as consultas de clima atual e forecast. Cada serviço valida/normaliza a resposta através de funções puras, que convertem dados para Celsius e datas locais no timezone retornado/configurado.
5. O hook publica os resultados da cidade ainda vigente em estados independentes. Respostas associadas a uma busca/seleção anterior são ignoradas.
6. A UI apresenta apenas campos válidos, marca ausências com `Indisponível` e limita a previsão às datas efetivamente válidas recebidas, sem preencher lacunas.
7. A troca entre °C e °F recalcula os valores de exibição a partir dos valores em Celsius mantidos no domínio; não repete geocoding nem forecast.
8. Retry é ação explícita e repete somente a operação que falhou, com a busca/cidade correspondente.

**Política de busca:** remover espaços externos e preservar Unicode é confirmado por AC-01b/AC-01c. Normalização sem distinção de acentos é uma alternativa ainda não aprovada; até decisão, não remover diacríticos nem transliterar. `locale` e `count` do endpoint permanecem pendentes. Não incluir autocomplete, busca enquanto digita ou persistência.

## External APIs

### Confirmado pela spec

- Open-Meteo como fonte inicial, sem API key.
- Busca de localidade por nome; clima atual; previsão para hoje e os quatro dias seguintes, segundo as datas locais do timezone da cidade.
- A spec não fecha campos meteorológicos, granularidade diária/horária, `locale` da busca ou `count` de resultados.

### Contratos técnicos propostos, sujeitos à aprovação

| Operação | Endpoint e parâmetros essenciais propostos | Retorno/mapeamento |
| --- | --- | --- |
| Geocoding | `https://geocoding-api.open-meteo.com/v1/search`; `name` recebe o nome aparado e codificado como query; `count`, `language` e `format=json` são configuração proposta, não requisitos confirmados. | `results[]` mapeia `id`, `name`, `latitude`, `longitude`, `country`, `country_code`, `admin1` e `timezone`, quando presentes, para `City`. Resultados ausentes/null normalizam para lista vazia; payload malformado é erro. |
| Forecast | `https://api.open-meteo.com/v1/forecast`; `latitude`, `longitude`, `timezone=<timezone da cidade>`, `temperature_unit=celsius` e `forecast_days=5`. Proposta diária: `current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,is_day`; `daily=temperature_2m_min,temperature_2m_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,weather_code`; `wind_speed_unit=kmh`. Campos e granularidade são propostas, não requisitos aprovados. | `current.temperature_2m` mapeia para `temperatureC`; demais variáveis current e daily mapeiam aos campos homônimos normalizados de `CurrentWeather`/`ForecastDay`. `current.is_day` (0/1) é normalizado para boolean; `time` e `daily.time[]` definem horário/data local. Unidades devem ser verificadas pela resposta `current_units`/`daily_units`; ausências escolhidas viram `null`, datas sem previsão são omitidas e não inventadas. |

- Configurar explicitamente timezone local da cidade e Celsius é proposta técnica para cumprir FR-04 e preservar Celsius no domínio. Usar `timezone=auto` como fallback, ou rejeitar uma cidade sem timezone, ainda precisa de decisão; não inferir timezone pelo dispositivo.
- `forecast_days=5` é a configuração proposta para as cinco datas exigidas; os limites e a forma de representar datas devem ser conferidos contra o contrato vigente do endpoint antes da implementação.
- A lista de campos da linha Forecast é uma proposta inicial coerente com os contratos apresentados. Aprovar ou ajustar campos e granularidade (`daily` ou `hourly`) antes da implementação; se forem escolhidos dados horários, revisar `ForecastDay` para representar períodos horários. `count`, idioma de geocoding e política de correspondência sem acentos também permanecem pendentes.
- Os serviços devem codificar a query preservando caracteres Unicode, verificar status HTTP e tratar resposta como não confiável até normalização. Não se presume precisão, disponibilidade ou garantia de dados do provedor.
- Validar antes da implementação termos de uso, limites, cobertura, disponibilidade e custos aplicáveis (NFR-05, NFR-08).

## State Management

- Usar estado local React, concentrado no hook de orquestração da tela; componentes recebem estado e callbacks. Sem Redux, TanStack Query, storage de browser, estado global persistente ou persistência de servidor.
- Modelar busca (`CitySearchState`), clima atual e previsão com estados discriminados `idle/loading/success/error`; busca sem hits é estado `empty`. Estados atuais e forecast não se sobrescrevem mutuamente.
- Unidade começa em Celsius e vive na sessão da tela. A persistência da preferência não é requisito aprovado.
- Associar cada operação a uma identidade crescente de consulta/seleção. Antes de publicar resultado, verificar se ainda corresponde à identidade vigente; descartar respostas tardias. Cancelamento da requisição via `AbortController` é opção técnica complementar, não substitui a checagem de identidade.
- Retry explícito pelo usuário, limitado à operação falha e aos parâmetros da consulta corrente. Sem retry automático ou cache no MVP.
- Ao selecionar outra cidade, limpar/invalidar os dados anteriores como atuais e associar novos estados à cidade selecionada. Se apenas current ou forecast falhar, preservar a seção independente que teve sucesso para a cidade atual.

## Error Handling

| Situação | Comportamento e mensagem literal | Rastreabilidade |
| --- | --- | --- |
| Campo vazio ou só espaços | Não requisitar, não iniciar loading; exibir `Informe uma cidade para buscar`. | AC-01b |
| Geocoding conclui sem resultados | Estado vazio, sem chamada meteorológica; exibir `Nenhuma cidade encontrada`. Não é erro do serviço. | AC-07a |
| Falha de rede, HTTP 429 ou 5xx em geocoding | Finalizar loading; exibir `Falha na busca` e ação `Tentar novamente`. Diferenciar de zero resultados. | AC-07c |
| Falha ao obter dados meteorológicos | Finalizar loading; exibir `Não foi possível obter os dados` e `Tentar novamente`; não exibir dados anteriores como atuais. | AC-07b |
| Requisição pendente além do timeout | Finalizar loading; exibir `A consulta demorou demais` e `Tentar novamente`; descartar conclusão tardia. Limite de 8 segundos é provisório e carece de confirmação, apesar de constar literalmente em AC-07d. | AC-07d; questão aberta na spec |
| Forecast com menos de cinco datas válidas | Exibir somente datas recebidas e `Previsão incompleta`; sem data válida, `Previsão indisponível`. Não inventar datas/valores. | AC-04b |
| Campo meteorológico ausente/inválido | Mostrar `Indisponível` para o campo, preservando outros campos válidos e sem reutilizar valor antigo. | AC-03b, AC-03c |
| Payload inválido ou parcial | Validar em normalizador; classificar estrutura inutilizável como erro, campos ausentes como dados parciais. Estado de current é independente do forecast. | AC-03b, AC-03c, AC-04b, AC-07b |
| Resposta de cidade anterior chega depois da seleção atual | Ignorar resposta; não atualizar identificação nem seções da cidade vigente. | AC-06b |

Mensagens adicionais definidas em Edge Cases, não como texto de critério de aceite: `Dados atuais indisponíveis` quando nenhum campo atual aproveitável existir. Zero geocoding hits nunca deve produzir mensagem de falha. Para erros HTTP, separar 429; outros status e 5xx permanecem `http`/falha e não são descritos como erro de rede.

**Ponto de consistência a resolver:** AC-07d exige timeout aos 8 segundos, enquanto a seção Open Questions o chama de provisório e pede confirmação entre 5, 8 ou 10 segundos. Implementação deve aguardar decisão de produto ou tratar 8 segundos como requisito provisório explicitamente aceito; este plano não altera o critério.

## Testing Strategy

Todos os testes usam fixtures de payloads Open-Meteo e relógio controlado; nenhuma suíte depende de API ao vivo. E2E deve interceptar as rotas externas. Os testes devem ser derivados dos critérios de aceite, não gerar escopo de produto novo.

| Camada | Cobertura prevista | ACs / NFRs |
| --- | --- | --- |
| Unit (funções puras) | Aparar espaços externos preservando Unicode (incluindo `São João d'Aliança`); validar payloads; mapear campos ausentes; datas no timezone da cidade; exibir `Indisponível`; conversão Celsius/Fahrenheit e retorno à unidade original sem arredondar o domínio. | AC-01b, AC-01c, AC-03b, AC-03c, AC-04, AC-04b, AC-05; NFR-06 |
| Service | URL/query e parâmetros; mapeamento City/current/forecast; respostas válidas, vazias, parciais e inválidas; rede, 429 e 5xx; chamadas condicionais: input vazio não chama geocoding e zero hits não chama forecast. | AC-01, AC-01b, AC-02, AC-07a, AC-07c; NFR-04, NFR-08 |
| Component (Testing Library) | Acessibilidade/ações principais; resultados com contexto de região/país; loading, vazio, erro, retry; seção parcial, unidade default e troca de unidade sem novas chamadas. | AC-01–AC-08; NFR-03 |
| Integração do hook | Seleção de cidade, estados independentes current/forecast, troca de unidade, retry e race condition: A pendente, seleção/resposta B, resposta tardia A ignorada; timeout e resposta posterior ignorada. | AC-05, AC-06, AC-06b, AC-07b–AC-08; NFR-06 |
| E2E (Playwright) | Fluxo buscar, desambiguar, selecionar, conferir clima/previsão e trocar unidade; mensagens literais, carregamento e falhas com respostas interceptadas; viewport conforme matriz prioritária aprovada. | AC-01–AC-08; NFR-01, NFR-02, NFR-03, NFR-07 |

Fixar a data do relógio e verificar exatamente cinco datas locais, sem sexta data. A medição de p95 do NFR-04 exige ambiente, perfil de rede/dispositivo e tratamento da latência externa acordados; testes determinísticos com mocks não demonstram por si só desempenho real do provedor. NFR-02, NFR-03, NFR-05 e NFR-07 também precisam dos métodos/limites ainda pendentes na spec.

## Risks & Trade-offs

- **Bloqueios de produto:** fields do clima atual/previsão, granularidade, política de busca por acentos, `count`/locale, fallback de timezone, validade/atualização e formatação de datas/hora precisam de decisão antes de fechar contrato de UI e critérios de aceite. Sem isso, implementação e aceite de cobertura meteorológica ficam bloqueados ou limitados à temperatura mínima confirmada (FR-03).
- **Timeout contraditório em status:** 8 segundos é critério observável em AC-07d, mas continua como proposta nas perguntas abertas. Resolver com responsável de produto antes de tratar a duração como compromisso final.
- **Dados incompletos:** representar ausência evita inventar valores, mas a escolha de quais campos são essenciais determina se current é utilizável e como se interpreta resposta parcial. Definir regras depois de aprovar a lista de campos.
- **Timezone ausente:** configurar explicitamente o timezone da cidade atende à semântica de cinco datas locais; a spec não define fallback para geocoding sem timezone. Não usar timezone do dispositivo silenciosamente, pois isso pode deslocar a data (AC-04, NFR-06).
- **Geocoding homônimo e unicode:** nomes iguais exigem contexto retornado e coordenadas corretas. A spec confirma preservação de acentos no envio, mas não confirma busca sem distinção de acentos, aliases ou transliteração.
- **Dependência externa:** latência, falhas, limites, cobertura, termos e custos dependem do Open-Meteo; não prometer precisão nem disponibilidade. Definir monitoramento e interpretar NFR-05 sem atribuir indisponibilidade externa à aplicação.
- **Unidades e campos abertos:** Celsius no domínio evita perda por alternância, mas somente temperaturas aprovadas devem ser convertidas. Definir campos e arredondamento antes do aceite visual (AC-05).
- **Metas não aprovadas:** NFR-01 a NFR-08 incluem metas iniciais a validar (dispositivos, usabilidade, WCAG, performance, disponibilidade, atualidade, navegadores e requisitos corporativos). Registrar método e responsável antes de declarar conformidade.
- **Questões de consistência na spec:** (1) AC-07d fixa 8s enquanto Open Questions solicita confirmação; resolução proposta: aprovação explícita do timeout sem editar a spec neste plano. (2) AC-03c exige temperatura `Indisponível` e mantém outros campos válidos, enquanto Edge Cases adiciona `Dados atuais indisponíveis` se nenhum campo atual for válido; resolução proposta: manter a temperatura como `Indisponível` em ambos os casos e usar a mensagem de seção somente quando nenhum campo puder ser apresentado. Validar o texto/condição com produto.
- **Escopo fechado:** não reabrir autenticação, persistência no servidor, GPS/localização automática, offline/cache, app nativo, alertas, favorites, history, share ou notifications. Qualquer inclusão exige mudança aprovada de escopo e revisão de privacidade/segurança; não faz parte deste plano.

| Decisão/contrato | IDs rastreados |
| --- | --- |
| Busca aparada, Unicode preservado, vazio sem rede, zero hits distinto de falha | FR-01, FR-07; AC-01, AC-01b, AC-01c, AC-07a, AC-07c |
| Seleção contextual por cidade e isolamento de resultados entre cidades | FR-02, FR-06; AC-02, AC-06, AC-06b; NFR-06 |
| Domínio em Celsius, unidade de apresentação separada | FR-03, FR-05; AC-03, AC-05; NFR-06 |
| Cinco datas locais; granularidade/fields aguardam decisão | FR-04; AC-04, AC-04b; NFR-06 |
| Loading, erro, vazio e retry explícitos | FR-07, FR-08; AC-01b, AC-07a–AC-08; NFR-03 |
| Respostas tardias não alteram a seleção vigente | FR-06, FR-07; AC-06b, AC-07d; NFR-06 |
| API sem chave, integração isolada e comunicação HTTPS | FR-01–FR-04; NFR-05, NFR-08 |
| Layout responsivo, teclado/nome acessível e testes de navegador | FR-01–FR-08; NFR-01, NFR-02, NFR-03, NFR-07 |
| Timeout inicial de 8s e configuração explícita de timezone/Celsius | FR-04, FR-07; AC-04, AC-07d; NFR-04, NFR-06 (propostas pendentes de confirmação) |