# Elétricos — site de captação de orçamentos

Site da oficina de **bicicletas, patinetes e scooters elétricas**.
O objetivo é um só: transformar quem chega no site em uma conversa no WhatsApp
**com o problema já descrito**, para o orçamento começar sem ping-pong de mensagem.

> Identidade visual tirada do cartão de visita: vermelho, preto e branco.
> O verde aparece só nas ações de WhatsApp.

## O que o site faz

- **Landing page** com serviços, como funciona, compromissos, área de atendimento e FAQ.
- **Assistente de orçamento em 5 passos** (equipamento → problema → detalhes → contato → envio).
- **Mensagem pronta no WhatsApp**: o site monta o texto com as respostas e abre a conversa
  no número do Guilherme. O cliente só confere e envia.
- **Registro de leads** na API: mesmo quem desiste de enviar fica registrado, então dá para
  recuperar o contato depois.
- **SEO local**: JSON-LD de `LocalBusiness` e `FAQPage`, sitemap e metatags em pt-BR.

## Stack

| Camada | O que é | Onde |
| --- | --- | --- |
| Front | Vue 3 (`<script setup>`) + Pinia + Vue Router + Vite | `web/` |
| API | Node 22 + Express | `server/` |
| Compartilhado | Dados do negócio, catálogo e gerador da mensagem | `shared/` |

`shared/` é a peça central: front e back leem **os mesmos dados**, então não existe
catálogo divergente entre a tela e a validação do servidor.

## Rodando localmente

```bash
npm install

# terminal 1 — API em http://localhost:3000
npm run dev:api

# terminal 2 — site em http://localhost:5173 (com proxy /api para a API)
npm run dev
```

Produção em um processo só (Node serve o build do Vite + a API):

```bash
npm run build
npm start        # http://localhost:3000
```

## Testes

```bash
npm test         # mensagem do WhatsApp, catálogo e API (17 testes)
npm run lint     # ESLint no front
npm run test:e2e # fluxo real no navegador (precisa do site rodando)
```

O `test:e2e` sobe um Chromium e percorre o orçamento inteiro em 320px, 390px e 1360px,
conferindo que **o texto do link do WhatsApp é idêntico ao que aparece na tela** e que
nenhuma tela ganha scroll horizontal. Precisa de `npm i -D playwright && npx playwright install chromium`.

## Mudando o conteúdo

### Telefone, horário, bairros, garantia

Tudo em **`shared/src/business.js`**. É o único arquivo que precisa ser tocado para
trocar o número do WhatsApp — header, rodapé, botão flutuante, orçamento e SEO leem dali.

```js
whatsapp: {
  phone: '5565999901389',   // 55 + DDD + número, só dígitos (usado no link wa.me)
  display: '(65) 99990-1389',
  tel: '+5565999901389',
},
```

### Serviços e problemas do orçamento

**`shared/src/catalog.js`**. Adicionar um problema novo é acrescentar um objeto na lista
`problems`. Use `vehicles: null` para valer em todos os equipamentos ou
`vehicles: ['patinete']` para restringir.

### Perguntas frequentes

**`shared/src/faq.js`**. Cada pergunta entra automaticamente no JSON-LD de `FAQPage`
(é o que faz as perguntas aparecerem abertas no Google).

### Fotos

`web/public/img/` — veja o README de lá. Nenhuma foto é obrigatória; o site funciona
completo sem imagem. Foto real de bancada converte mais que banco de imagens.

## Leads

Cada envio grava uma linha em `server/data/leads.jsonl` (um JSON por linha):

```jsonl
{"id":"...","createdAt":"2026-09-21T12:00:00.000Z","vehicle":"patinete","problem":"bateria","name":"Gustavo","message":"Olá, Guilherme! ..."}
```

Para abrir no Excel/Sheets:

```bash
node -e "const l=require('fs').readFileSync('server/data/leads.jsonl','utf8').trim().split('\n').map(JSON.parse);console.log(['data','nome','equipamento','problema','bairro'].join(';'));l.forEach(x=>console.log([x.createdAt,x.name,x.vehicle,x.problem,x.neighborhood].join(';')))" > leads.csv
```

Quando o volume crescer, troque só `server/src/lib/leadStore.js` por um banco — o resto não muda.

### Proteções da rota de leads

- Validação contra o catálogo compartilhado (equipamento, problema e a combinação dos dois).
- Rate limit por IP (`RATE_LIMIT_MAX` por `RATE_LIMIT_WINDOW_MS`).
- Honeypot: campo invisível `website`; se vier preenchido, a resposta é 202 e nada é gravado.

## Deploy

**Site + API juntos** (Render, Railway, Fly, VPS):

```bash
docker build -t eletricos .
docker run -p 3000:3000 eletricos
```

Variáveis em `server/.env.example`. Em produção, defina `CORS_ORIGINS` com o domínio real.

**Só o site** (Vercel, Netlify): já existem `vercel.json` e `netlify.toml` com o rewrite de SPA.
O site funciona inteiro sem a API — o catálogo vem no bundle e o WhatsApp é link direto.
A única coisa que você perde é o registro dos leads.

### Antes de publicar

- [ ] Conferir telefone e horários em `shared/src/business.js`
- [ ] Ajustar a lista de bairros atendidos
- [ ] Trocar `siteUrl` pelo domínio real (usado em canonical, sitemap e JSON-LD)
- [ ] Atualizar `web/public/sitemap.xml` e `web/public/robots.txt` com o domínio
- [ ] Colocar `og-cover.jpg` (1200×630) em `web/public/img/` — é a miniatura no WhatsApp
- [ ] Confirmar se a garantia de 90 dias e o diagnóstico gratuito batem com o combinado
- [ ] Criar o Perfil da Empresa no Google com o mesmo nome, telefone e endereço do site

## Medindo o resultado

`web/src/utils/analytics.js` dispara eventos para `dataLayer`/`gtag` se houver tag instalada;
sem tag, não faz nada. Os eventos que importam:

| Evento | Quando |
| --- | --- |
| `whatsapp_click` | Qualquer clique que leva ao WhatsApp (com a origem: hero, rodapé, botão flutuante…) |
| `quote_step` | Avanço de passo no orçamento — mostra onde as pessoas desistem |
| `quote_submit` | Envio do orçamento |

Com `whatsapp_click` medido dá para saber o custo por orçamento em campanha paga.
