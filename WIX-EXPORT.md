# Arquivo legado (ago/2026)

**Obsoleto como pipeline.** Produção = GitHub Pages neste repo (`main` → `/`).
Não remontar no Editor Wix. O Wix `lmpjzs.wixsite.com/l7mrz-invest` é vitrine antiga até o DNS mudar.

---

# Como levar a L7Mrz-Invest para o Wix

A Wix **não importa um site HTML inteiro** como tema. O caminho antigo era: usar este projeto como *fonte da verdade* (layout, textos, paleta, widget) e remontar no editor com seções nativas + 1 embed.

## Arquivos

```
L7Mrz-Invest/
  index.html                 preview completo (abrir no browser)
  css/styles.css
  js/app.js
  wix-export/
    copy-deck.md             textos prontos para colar
    palette.json             hex da paleta
    embed-market.html        widget de cotações (iframe / HTML embed)
    sitemap.json             mapa de seções e âncoras
```

Preview local:

```bash
xdg-open /home/leomrz/.openclaw/workspace/L7Mrz-Invest/index.html
```

Ou servir em HTTP se o browser bloquear a API por `file://`:

```bash
python3 -m http.server 8765 --directory /home/leomrz/.openclaw/workspace/L7Mrz-Invest
# http://127.0.0.1:8765/
```

## Paleta no editor Wix

Site styles → Colors:

| Papel Wix   | Hex       | Uso                         |
|-------------|-----------|-----------------------------|
| Background  | `#050810` | fundo da página             |
| Secondary   | `#08111F` | cards / faixas              |
| Action      | `#163056` | blocos navy                 |
| Primary     | `#D4AF37` | botões, links, detalhes     |
| Title       | `#F0DD9A` | títulos claros              |
| Text        | `#E9EDF5` | corpo                       |
| Muted       | `#9AA6BB` | legendas                    |
| Up / Down   | `#3DD68C` / `#FF6B7A` | variação |

Fontes: **Playfair Display** nos títulos, **Manrope** no corpo.
Fallbacks nativos Wix: Didot / Cormorant + Helvetica Neue.

## Estrutura de páginas (recomendado)

Uma one-page, iguais às âncoras do preview:

1. Header sticky + mega menu Mercado
2. Hero (H1 + 3 stats + CTA)
3. Ticker (opcional: faixa nativa ou o embed)
4. Cotações — **HTML iframe** com `embed-market.html`
5. Watchlist — 10 cards (Repeater / Grid)
6. Serviços — 3 colunas
7. Método — 3 passos
8. Sobre — foto + texto do founder
9. Contato — form nativo Wix + dados
10. Footer

Menu âncora: Home `#topo`, Mercado `#cotacoes`, Consultoria `#servicos`, Sobre `#sobre`, Contato `#contato`.

## Widget de mercado (substitui o iframe antigo)

1. Hospede `wix-export/embed-market.html` em qualquer URL HTTPS:
   - Wix Velo / arquivo estático, GitHub Pages, Netlify drop, ou o próprio preview.
2. No Wix: Add → Embed → **HTML iframe**.
3. Cole a URL ou o HTML do arquivo.
4. Altura sugerida: `640px`. Largura: 100%.
5. O widget puxa CoinGecko (BRL, 24h, 7d). Se a API bloquear, cai no fallback estático.

Se preferir **zero código**, use o elemento nativo “Crypto” / TradingView da Wix só como apoio e mantenha os 10 cards com o texto do `copy-deck.md`. O recorte editorial (ZEC, teses, tags) não existe em widget genérico.

## Formulário

Não use o `<form>` do preview em produção Wix. Ele só confirma no front.

No editor: Add → Contact & Forms → ligue a `lmpjzs@gmail.com`.
Assuntos prontos estão no copy-deck.

## Animações “estilo IA” no Wix

O preview tem canvas neural + hover + ticker.
No editor, replique o clima sem o canvas:

- Entrance: Fade + Slide up, 400–700 ms, stagger nos cards
- Hover: elevação leve nos cards da watchlist
- Loop sutil no kicker dourado (opacity 80↔100)
- Fundo escuro + linha dourada 18% opacity

O canvas `#neural` só roda no `index.html` (JS). Wix Editor clássico não aceita esse canvas nativamente.

## Conteúdo herdado vs descartado

Reaproveitado:
- Founder Léo Mariz, IBTA, MCSE, LPI
- Retrato: `assets/leo-mariz.png`
- Origem 2017 / tese de revolução financeira
- Explicação de Bitcoin / blockchain
- Telefone, endereço, Facebook e WhatsApp reais

Descartado (era template Wix):
- Lorem dos blocos App / Vantagens / Depoimentos
- João dos Santos, Tereza Souza
- Links oficiais do Wix (Twitter/YouTube/Instagram/Google+)

## Dois caminhos de publicação

**A. Remontar no Wix (pedido original)**  
Seguir este guia. Controle de domínio, form e SEO ficam no Wix.

**B. Publicar o HTML direto**  
Se quiser o visual 1:1 do preview, hospede a pasta `L7Mrz-Invest/` (Netlify, Cloudflare Pages, nginx). Wix vira só DNS, se quiser.

## Checklist de export

- [ ] Paleta aplicada no Site Styles
- [ ] Fontes Playfair + Manrope (ou fallback)
- [ ] Textos colados do `copy-deck.md` — nenhum “sou um parágrafo”
- [ ] 10 cards na ordem editorial (BTC…ADA), ZEC com zk-SNARKs
- [ ] Embed de `embed-market.html` no lugar do iframe antigo
- [ ] Form nativo + telefone / endereço / WhatsApp
- [ ] Disclaimer de conteúdo educacional
- [ ] Marca no header: L7Mrz-Invest, não L7 Crypto Mining
