# Rekenmodel (samenvatting)

```
kWh per jaar    = (bytes / 10^12) × wattPerTB × kopieen × pue × urenPerJaar / 1000
kg CO2 per jaar = kWh per jaar × kgCo2PerKwh
```

We rekenen altijd met een lage en een hoge waarde en tonen de uitkomst als bandbreedte. De factoren en hun bronnen staan in `src/model/config.ts`. Het team stelt de definitieve waarden vast in het rekenmodel-document.
