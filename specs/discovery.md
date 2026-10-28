# Discovery: Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação para que usuários consultem informações meteorológicas de cidades. A experiência deve apresentar o clima atual e uma previsão para os próximos cinco dias, permitir alternância entre Celsius e Fahrenheit e funcionar em dispositivos móveis.

As decisões iniciais sobre fonte de dados, período da previsão, unidade padrão, autenticação e idioma da interface estão registradas abaixo. Permanecem em aberto detalhes como critérios de busca, campos meteorológicos, fuso horário e frequência de atualização.

## Decisões

1. **Fonte de dados: Open-Meteo, sem API key.** Essa escolha simplifica a integração inicial e evita a necessidade de provisionar uma chave de API. Resolve a escolha inicial do provedor; ainda é necessário confirmar cobertura, termos de uso, limites e disponibilidade.
2. **Período da previsão: hoje mais os quatro dias seguintes.** Essa definição deixa explícito que o período de cinco dias inclui o dia atual. Resolve a dúvida entre “hoje + quatro dias” e os cinco dias seguintes; a granularidade diária ou intradiária e o fuso usado para definir “hoje” continuam em aberto.
3. **Unidade padrão: Celsius.** A unidade inicial será explícita, evitando ambiguidade na primeira consulta. Resolve qual unidade exibir por padrão; persistência da escolha após alternância e conversão de todos os campos de temperatura ainda precisam ser especificadas.
4. **Sem autenticação e sem persistência no servidor.** O escopo inicial não terá contas nem armazenamento de dados do usuário no servidor, reduzindo complexidade e coleta de dados. Resolve a necessidade de login e persistência de servidor; armazenamento local no navegador, como cidade recente ou preferência de unidade, permanece em aberto.
5. **Idioma da interface: pt-BR.** A interface será apresentada em português do Brasil, mantendo consistência linguística para o público inicial. Resolve o idioma da UI; convenções de data, hora e fuso horário ainda precisam ser definidas.

## Personas (hipóteses para validação)

As personas abaixo são hipóteses baseadas nos usos comuns de um app de clima; devem ser validadas com pesquisa junto ao público-alvo.

### Pessoa que se desloca diariamente

- **Objetivo principal:** saber como estará o tempo ao sair e nos próximos dias para planejar roupa, trajeto e itens como guarda-chuva.
- **Contexto de uso:** principalmente no celular, em consultas rápidas antes de sair; pode usar desktop durante o planejamento do dia.
- **Métrica de sucesso percebida:** consegue identificar em até 30 segundos a condição atual e se precisará se preparar para chuva ou variação de temperatura.

### Profissional que trabalha ao ar livre

- **Objetivo principal:** consultar as condições da cidade de trabalho e antecipar se o clima pode exigir ajustes na rotina ou nos equipamentos.
- **Contexto de uso:** principalmente no celular, em campo e possivelmente sob condições de conectividade limitada; usa a previsão de cinco dias para planejar a agenda.
- **Métrica de sucesso percebida:** consegue encontrar a previsão da localidade correta e decidir se precisa ajustar o plano de trabalho sem recorrer a outra fonte.

### Pessoa planejando uma viagem

- **Objetivo principal:** consultar o clima atual e a previsão do destino para escolher datas, roupas e itens para levar.
- **Contexto de uso:** desktop durante o planejamento e celular durante a viagem; pesquisa cidades diferentes da localização atual.
- **Métrica de sucesso percebida:** consegue confirmar que está vendo a previsão do destino correto e decidir o que levar com base nos próximos cinco dias.

## Requisitos Funcionais

- **RF-01 — Buscar cidades:** permitir que o usuário pesquise cidades pelo nome.
- **RF-02 — Selecionar cidade:** permitir que o usuário escolha a cidade desejada quando a busca retornar mais de um resultado.
- **RF-03 — Consultar clima atual:** exibir as condições meteorológicas atuais da cidade selecionada.
- **RF-04 — Consultar previsão:** exibir a previsão para os próximos cinco dias da cidade selecionada.
- **RF-05 — Alternar unidades:** permitir alternar entre Celsius e Fahrenheit para os valores de temperatura apresentados.
- **RF-06 — Atualizar dados por cidade:** ao selecionar outra cidade, apresentar as informações correspondentes a ela.
- **RF-07 — Informar falhas:** quando não for possível encontrar uma cidade ou obter dados meteorológicos, informar o problema ao usuário.
- **RF-08 — Indicar carregamento:** durante uma busca ou atualização, indicar que a operação está em andamento.

## Requisitos Não-Funcionais

- **RNF-01 — Responsividade:** entre as larguras de 320 px e 1440 px, os fluxos de busca, seleção de cidade e consulta devem permanecer utilizáveis, sem rolagem horizontal ou sobreposição de conteúdo. Validar a faixa e os dispositivos-alvo com as partes interessadas.
- **RNF-02 — Usabilidade:** usuários devem conseguir buscar e selecionar uma cidade e alternar a unidade sem instruções externas. Definir um método e uma meta de sucesso para testes de usabilidade durante o planejamento.
- **RNF-03 — Acessibilidade:** buscar conformidade com WCAG 2.2 nível AA, incluindo operação por teclado, foco visível, nomes acessíveis para controles e contraste adequado. Confirmar o nível de conformidade exigido.
- **RNF-04 — Performance:** como meta inicial, 95% das consultas devem exibir os dados em até 3 segundos em condições normais de rede, medidos da ação de busca até a apresentação dos resultados. Validar a meta e definir como a latência do provedor externo será contabilizada.
- **RNF-05 — Disponibilidade:** propor disponibilidade mensal mínima de 99,5% para a aplicação, excluindo indisponibilidades do provedor meteorológico externo. Confirmar a meta, a janela de medição e as exclusões.
- **RNF-06 — Integridade e atualidade dos dados:** valores e unidades devem corresponder à cidade e à unidade selecionadas. Dados indisponíveis ou vencidos não devem ser apresentados como atuais; definir o limite de validade e como indicar a última atualização.
- **RNF-07 — Compatibilidade:** suportar as versões atuais e imediatamente anteriores dos navegadores móveis e desktop definidos como prioritários pela empresa. Confirmar a matriz de navegadores e sistemas operacionais.
- **RNF-08 — Segurança e privacidade:** usar HTTPS em todas as comunicações e não coletar ou armazenar localização precisa sem necessidade e consentimento explícito. Confirmar requisitos corporativos adicionais de retenção e privacidade.

## Riscos

As classificações abaixo são estimativas iniciais, baseadas no briefing disponível. Devem ser revistas quando as perguntas em aberto forem respondidas e o provedor e o escopo do MVP forem definidos.

| Categoria | Risco | Probabilidade | Impacto | Estratégia de mitigação |
| --- | --- | --- | --- | --- |
| Produto | Público, necessidade e critérios de sucesso não estão definidos; o app pode resolver o problema errado ou não gerar adoção. | Média | Alto: esforço investido em uma experiência que não atende às necessidades prioritárias. | Validar público e casos de uso com usuários; definir métricas de sucesso e critérios de aceite antes de fechar o MVP. |
| Produto | “Clima atual” e “previsão de cinco dias” têm escopo ambíguo. | Alta | Alto: retrabalho em UX e integração, além de divergência sobre o que significa entregar o produto. | Decidir quais dados serão exibidos e se a previsão será diária ou intradiária; registrar exemplos e critérios de aceite na especificação. |
| Produto | Escopo pode crescer com localização automática, favoritos, histórico ou alertas não descritos no briefing. | Média | Médio: atrasos e aumento de complexidade antes de validar o valor principal. | Delimitar o MVP, registrar itens fora de escopo e exigir priorização explícita para novas funcionalidades. |
| Técnico | Indisponibilidade, latência ou limites de requisição do provedor podem interromper buscas e consultas. | Média | Alto: usuários ficam sem dados ou recebem respostas lentas. | Validar limites, cobertura e disponibilidade do Open-Meteo antes da integração; definir timeout, tratamento de erro, cache com validade explícita e monitoramento da dependência. |
| Técnico | Cobertura ou geocodificação insuficiente pode omitir cidades ou selecionar localidade homônima. | Média | Alto: dados meteorológicos apresentados para a cidade errada ou busca sem resultado. | Validar cidades representativas dos mercados-alvo; apresentar contexto regional nos resultados e testar entradas com acentos, aliases e homônimos. |
| Técnico | Dados podem estar desatualizados, ter qualidade variável ou ser associados ao dia/fuso horário incorreto. | Média | Alto: decisões baseadas em informações apresentadas como atuais, mas incorretas ou confusas. | Definir validade e frequência de atualização; exibir horário da última atualização; usar fuso da localidade e testar mudanças de data e limites de período. |
| Técnico | Custos, licença, limites ou termos do provedor podem não atender ao uso previsto. | Média | Alto: aumento de custo, restrição de uso ou necessidade de trocar a integração após o desenvolvimento. | Revisar termos, cobertura, cotas e projeção de volume do Open-Meteo antes da integração; manter acesso a dados isolado em uma camada de serviço. |
| Técnico | A aplicação pode não atingir metas de performance ou disponibilidade em redes móveis ou picos de uso. | Média | Alto: abandono, falhas de consulta e descumprimento das metas propostas de qualidade. | Validar metas com stakeholders; medir latência ponta a ponta; testar em redes e dispositivos representativos; definir limites, cache e monitoramento. |
| Técnico | Layout, navegação por teclado ou suporte de navegador podem falhar em dispositivos móveis ou para usuários com deficiência. | Média | Alto: partes da população não conseguem usar o serviço ou completar fluxos essenciais. | Definir matriz de dispositivos e navegadores; validar responsividade e acessibilidade com testes automatizados e manuais desde os primeiros protótipos. |
| Técnico | Conversão e arredondamento entre Celsius e Fahrenheit podem divergir entre clima atual e previsão. | Baixa | Médio: valores inconsistentes reduzem confiança e podem confundir o usuário. | Manter uma unidade canônica no domínio, centralizar a conversão e testar valores-limite e todos os campos de temperatura exibidos. |
| Técnico | Coleta de localização ou armazenamento de histórico pode criar exposição de dados pessoais ou descumprir políticas aplicáveis. | Baixa | Alto: perda de confiança, incidente de privacidade ou necessidade de remover funcionalidades. | Minimizar coleta e retenção; pedir consentimento para localização; usar HTTPS e revisar requisitos legais e corporativos antes de implementar persistência. |
| Operação | Falta de observabilidade e plano de resposta pode atrasar a identificação de falhas do app ou do provedor. | Média | Médio: indisponibilidade prolongada e diagnóstico demorado. | Definir métricas e alertas para erros, latência e disponibilidade; atribuir responsáveis e documentar procedimentos de suporte e contingência. |

## Perguntas em Aberto e Impactos

### Produto e escopo

1. **Público e necessidade:** Quem usará o app e para qual decisão ou situação? **Impacto:** sem isso, não há base para priorizar informações, fluxos e linguagem.
2. **Critérios de sucesso:** Como será medido o sucesso do produto, por exemplo, buscas concluídas, retorno de usuários ou tempo para encontrar uma previsão? **Impacto:** pode-se entregar funcionalidades sem saber se resolvem a necessidade.
3. **Alertas meteorológicos:** O app deve apenas exibir condições e previsões ou também alertas de eventos severos? **Impacto:** alertas exigem fontes, apresentação e expectativas de confiabilidade diferentes.
4. **Escopo adicional:** Além de buscar e consultar, haverá favoritos, histórico, cidade padrão, compartilhamento ou notificações? **Impacto:** a resposta altera navegação, persistência, esforço e expectativas de entrega.

### Busca e cidades

5. **Formato da busca:** A busca aceitará apenas nomes de cidades ou também país, estado, código postal e coordenadas? Deve sugerir resultados enquanto o usuário digita? **Impacto:** sem isso, não se definem a experiência nem os serviços de geocodificação necessários.
6. **Cidades homônimas:** Que dados devem distinguir resultados com o mesmo nome, como país, estado ou região? **Impacto:** o usuário pode selecionar a localidade errada e receber uma previsão irrelevante.
7. **Variações de nomes:** A busca deve aceitar acentos, nomes alternativos, transliterações e nomes em outros idiomas? **Impacto:** buscas por entradas válidas podem não encontrar a cidade esperada.
8. **Busca sem resultado ou inválida:** O que informar quando não houver correspondência, a entrada for inválida ou o serviço de busca falhar? **Impacto:** sem um comportamento definido, o usuário pode não entender se errou ou se houve uma falha técnica.
9. **Localização automática:** O app deve detectar a localização do usuário? Deve ser opcional e depender de permissão? **Impacto:** a decisão afeta privacidade, permissões e a experiência inicial.
10. **Persistência local:** Sem autenticação e sem persistência no servidor, o app deve lembrar no navegador a última cidade, favoritos ou histórico? Por quanto tempo? **Impacto:** a decisão ainda afeta armazenamento local, privacidade e comportamento entre sessões, embora não haja conta ou sincronização entre dispositivos.

### Dados meteorológicos

11. **Conteúdo do clima atual:** Quais informações serão exibidas, como temperatura, sensação térmica, condição, umidade, vento e precipitação? **Impacto:** “clima atual” não define os dados necessários nem permite estimar a integração.
12. **Granularidade da previsão:** A previsão de hoje mais quatro dias será exibida como resumo diário ou incluirá períodos horários? **Impacto:** a resposta altera os dados solicitados, a interface e os critérios de aceite.
13. **Detalhes da previsão:** Cada dia deve incluir mínima e máxima, condição predominante, probabilidade de chuva ou outros indicadores? **Impacto:** a previsão pode ser entregue com informações insuficientes para o uso esperado.
14. **Fuso horário e formato:** Qual fuso define o dia atual da previsão e como datas e horários devem ser formatados em pt-BR? **Impacto:** períodos podem aparecer associados ao dia errado, sobretudo em cidades de outros fusos.
15. **Atualização e validade:** Com que frequência atualizar os dados? Deve ser exibido o horário da última atualização e qual será o limite para considerar os dados vencidos? **Impacto:** informações antigas podem ser confundidas com condições atuais.
16. **Condições do provedor:** Quais são os termos de uso, limites, cobertura, custos aplicáveis e garantias de disponibilidade do Open-Meteo? **Impacto:** sem essa validação, há risco de incompatibilidade com o uso pretendido, restrições ou indisponibilidade.
17. **Precisão e divergências:** Que nível de precisão é esperado e como tratar previsões divergentes ou indisponíveis para uma localidade? **Impacto:** usuários podem interpretar estimativas como garantias ou perder confiança em resultados inconsistentes.
18. **Alternância de unidades:** Celsius será o padrão; a alternância para Fahrenheit se aplica a quais campos? A preferência permanece apenas durante a sessão ou no navegador? **Impacto:** sem essa definição, a conversão pode ser inconsistente e a preferência pode surpreender o usuário em visitas futuras.

### Experiência e qualidade

19. **Plataforma móvel:** “Usar em dispositivos móveis” significa site responsivo, aplicativo nativo ou ambos? Quais tamanhos e orientações devem ser suportados? **Impacto:** a resposta define plataforma, navegação, tecnologia e esforço.
20. **Acessibilidade:** Qual padrão deve ser atendido? Há necessidades específicas de teclado, leitor de tela, contraste ou redução de movimento? **Impacto:** sem critérios, a acessibilidade não pode ser verificada e correções podem exigir retrabalho.
21. **Performance:** Qual tempo máximo é aceitável para busca e carregamento, e sob quais condições de rede e dispositivo? **Impacto:** “rápido” não é verificável sem uma meta e pode ocultar problemas para usuários móveis.
22. **Disponibilidade e falhas externas:** Qual disponibilidade é esperada e o que mostrar se o provedor estiver indisponível: erro ou dados armazenados em cache? **Impacto:** sem metas e comportamento de contingência, a experiência fica imprevisível e pode exibir dados vencidos como atuais.
23. **Uso offline:** O app deve funcionar parcialmente sem conexão ou exibir a última consulta armazenada? Por quanto tempo? **Impacto:** a decisão afeta armazenamento e como distinguir dados recentes de antigos.
24. **Estados da interface:** Quais estados devem existir para início, carregamento, erro, busca sem resultados e dados indisponíveis? **Impacto:** a interface pode parecer travada ou não explicar situações comuns.
25. **Compatibilidade:** Quais navegadores, versões, sistemas operacionais e dispositivos devem ser suportados? **Impacto:** sem uma matriz de suporte, não há critério claro para testes nem garantia de funcionamento para o público-alvo.

### Operação, privacidade e governança

26. **Privacidade e dados pessoais:** Haverá coleta de localização, histórico ou analytics? O que será guardado, por quanto tempo e com qual consentimento? **Impacto:** a coleta pode gerar riscos de privacidade e obrigações legais ou corporativas.
27. **Segurança:** Há requisitos corporativos adicionais, como gestão de segredos, proteção contra abuso ou revisão de dependências? **Impacto:** requisitos descobertos tarde podem exigir mudanças na arquitetura e no processo de entrega.
28. **Volume de uso:** Quantos usuários e consultas são esperados inicialmente e em picos? **Impacto:** o volume influencia limites do provedor, cache, custos e metas de desempenho.
29. **Marca e conteúdo:** Há identidade visual, tom de voz, idioma inicial ou diretrizes de conteúdo? **Impacto:** sem isso, a experiência pode não corresponder à marca nem ao público.
30. **Lançamento e operação:** Onde o app será publicado, quem fará monitoramento e suporte e quais ambientes serão necessários? **Impacto:** o desenvolvimento pode terminar sem publicação, monitoramento ou resposta a incidentes definidos.

## Suposições

- A consulta será feita por cidade escolhida pelo usuário; localização automática não é requisito confirmado.
- Open-Meteo será a fonte de dados inicial e não exigirá API key.
- A previsão cobrirá o dia atual e os quatro dias seguintes; o fuso usado para definir o dia atual ainda precisa ser confirmado.
- Celsius será a unidade padrão; a persistência da preferência após alternância ainda precisa ser definida.
- A alternância entre Celsius e Fahrenheit altera a apresentação dos valores, sem necessariamente exigir uma nova busca.
- Não haverá autenticação nem persistência de dados no servidor; eventual armazenamento local no navegador ainda precisa ser definido.
- A interface será em português do Brasil; formatos de data e hora ainda precisam ser definidos.
- O uso em dispositivos móveis exige uma interface responsiva, não necessariamente um aplicativo nativo.
- A frequência de atualização e os detalhes da previsão serão definidos nas etapas seguintes.