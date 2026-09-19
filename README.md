# L7MRZ Invest

Site canónico: **este repo**. GitHub Pages = produção.

- Preview / live: https://lmpjzs.github.io/L7Mrz-Invest/
- Produto: educação financeira (reserva → renda fixa → bolsa → cripto). Não é consultoria nem gestão de conta.
- Wix (`lmpjzs.wixsite.com/l7mrz-invest`) ficou como vitrine antiga até o DNS apontar para Pages.

## Deploy

Push em `main` atualiza Pages (`/` no branch `main`).

```bash
git -C /DADOS/git/L7Mrz-Invest status
```

O Wix Editor **não** recebe este HTML. Não use `WIX-EXPORT.md` como pipeline de publicação.

## Dados ao vivo

CoinGecko `/coins/markets` em BRL no radar educacional. Se a API falhar, o JS usa fallback estático.
