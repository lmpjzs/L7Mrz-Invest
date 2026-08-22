# L7Mrz-Invest

Site novo a partir da Wix antiga [L7 Crypto Mining](https://lmpjzs.wixsite.com/l7cryptomining).

Direção: mesa de investimento / consultoria. Paleta navy + dourado. Radar ao vivo no lugar do iframe. Textos reais do founder; lorem e links do Wix fora.

## Abrir o preview

Serviço persistente na LAN (systemd user, linger=yes):

- http://192.168.1.79:18791/
- http://127.0.0.1:18791/

```bash
systemctl --user status l7mrz-invest.service
```

## Exportar para Wix

Leia `WIX-EXPORT.md`. Resumo: remontar seções no editor + embed de `wix-export/embed-market.html` + textos de `wix-export/copy-deck.md`.

## Dados ao vivo

CoinGecko `/coins/markets` em BRL para:

BTC, ETH, USDT, BNB, XRP, SOL, USDC, DOGE, ZEC, ADA.

Se a API falhar, o JS usa o fallback da última coleta (2026-08-22).
