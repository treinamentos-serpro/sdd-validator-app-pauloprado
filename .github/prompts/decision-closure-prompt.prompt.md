---
mode: agent
description: 'Fecha decisões aprovadas de busca e seleção do Weather App sem inventar respostas para perguntas em aberto.'
---

# Prompt — Fechar Decisões de Busca e Seleção

Você está executando a tarefa **T-01 — Fechar decisões de busca e seleção** do backlog do Weather App.

## Contexto

O app usa a Open-Meteo para geocodificar cidades. A interface é pt-BR. A spec já define busca por nome, seleção quando houver mais de um resultado e preservação de Unicode, acentos e pontuação no envio.

## Fonte da Verdade

- Leia `specs/weather-app-spec.md` e `tasks/weather-app-tasks.md`.
- Consulte `plans/weather-app-plan.md` apenas como referência de propostas técnicas, não como aprovação de produto.
- Não escreva código. Edite somente `specs/weather-app-spec.md`.

## Decisões a Fechar

Para cada item, use uma resposta aprovada pelo responsável de produto. As alternativas abaixo são opções para confirmação, não decisões tomadas:

1. **Quantidade de resultados do geocoding (`count`):** confirmar uma quantidade. O plano sugere 10 como proposta inicial; não a trate como aprovada sem confirmação.
2. **Idioma do geocoding:** confirmar `pt` ou o idioma padrão do provedor.
3. **Correspondência com acentos:** confirmar busca sem distinção de acentos ou correspondência exata. Preserve a grafia retornada e os caracteres digitados na apresentação.
4. **Desambiguação de cidades homônimas:** confirmar o uso do nome e, quando disponíveis, região administrativa e país; definir um fallback quando esses dados forem ausentes ou insuficientes, como exibir coordenadas ou solicitar mais contexto antes da seleção.

## Procedimento

- Não escolha alternativas por conta própria e não trate valores provisórios como aprovados.
- Para cada decisão, registre pergunta, resposta aprovada, breve justificativa, aprovador e fonte/data da aprovação.
- Se não houver aprovação disponível, mantenha o item explicitamente como **Bloqueado**, apresente as alternativas e solicite a decisão necessária. Não edite a spec como se a escolha estivesse aprovada.
- Quando houver aprovação, registre a decisão em `specs/weather-app-spec.md` e retire de Open Questions apenas os pontos efetivamente resolvidos.
- Preserve FR-01, FR-02, AC-01, AC-01b, AC-01c e AC-02, além dos comportamentos já definidos para input vazio, caracteres especiais e busca sem resultados.
- Não altere escopo, requisitos ou critérios que não sejam necessários para T-01.

## Critérios de Aceite

- Cada decisão aprovada aparece na spec com resposta, justificativa, aprovador e fonte.
- Cada decisão sem aprovação continua identificada como bloqueio, com alternativas claras.
- Open Questions não contradiz as decisões registradas.
- Nenhum código ou outro arquivo foi alterado.

Ao concluir, informe quais decisões foram aprovadas, quais continuam bloqueadas e se T-01 pode ser marcada como concluída.