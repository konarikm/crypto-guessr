# Závěrečný projekt z předmětu AP5PM - CryptoGuessr
Tento repozitář slouží pro závěrečný projekt z předmětu Programování mobilních aplikací na FAI UTB

## Cíl projektu
Hlavním cílem projektu bylo vytvoření nativní mobilní aplikace zaměřené na konkrétní funkcionalitu.

Požadavky na aplikaci:
* Implementace vlastní ikony aplikace a splash screenu.
* Vytvoření více propojených obrazovek s funkční navigací a přechody.
* Ukládání dat do perzistentní paměti zařízení.
* Zajištění uživatelského vstupu prostřednictvím formulářů a zadávání dat.
* Komunikace s REST API nebo využití nativního plug-inu (např. GPS, kamera, kalendář, kontakty).

Aplikace byla vyvinuta pomocí frameworků Ionic a Angular, které umožňují rychlý a efektivní vývoj multiplatformních aplikací.

## Popis aplikace
CryptoGuessr je hra, ve které hráč hádá, zda je aktuální cena vybrané kryptoměny vyšší nebo nižší než zobrazená cena.

### Funkce a vlastnosti
#### Aktuální ceny kryptoměn:
- Hra využívá [CoinCap API 2.0](https://docs.coincap.io/) pro získání aktuálních cen kryptoměn.

#### Výběr kryptoměny:
- Hráč si před začátkem každého kola může zvolit jednu z 1000 nejznámějších kryptoměn (k 11. 12. 2024), nebo si nechat náhodně vybrat kryptoměnu pro hru.

#### Princip hry:
- Hráč hádá, zda je aktuální cena zvolené kryptoměny vyšší nebo nižší než zobrazená cena. Hra končí v okamžiku, kdy hráč zvolí nesprávnou odpověď.

#### Historie her:
- Hráč si může ukládat výsledky jednotlivých her do historie.
- V nastavení lze zvolit způsob řazení uložených her (podle data nebo skóre).

#### Obtížnost hry:
- Hra umožňuje nastavit obtížnost, která určuje, jak blízko je zobrazená cena skutečné ceně kryptoměny.
- Jednodušší obtížnost = větší tolerance.

## Použitá API
[CoinCap API 2.0](https://docs.coincap.io/)

## Autor projektu
* Martin Koňařík 
* Email: m1_konarik@utb.cz
* GitHub: [@konarikm](https://github.com/konarikm)

Vytvořeno v roce 2024 pro účely předmětu AP5PM na FAI UTB
