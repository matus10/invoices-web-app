Tento projekt vznikl v rámci rekvalifikačního kurzu „Programátor webových aplikací v Pythonu“.
Jedná se o rozšíření programu v Django REST Frameworku, který původně obsahoval pouze backend pro entitu Person

Níže popisuji mnou provedené úpravy:

Projekt byl rozšířen o nový model model Invoice, který slouží pro evidenci faktur. Model obsahuje pole jako číslo faktury, datum vystavení a splatnosti, produkt, cenu, DPH atd.
Faktura je navázaná na dvě osoby (nakupující, prodávající) a pomocí ForeignKey je napojena na model Person.

Do serializers.py byl doplněn import modelu Invoice, nový InvoiceSerializer s metodou to_representation, aby se vrátily kompletní data osob místo ID.
Cílem byl pohodlnější výstup pro klienta, bez nutnosti dohledávání konkrétních dat.

Doprogramován byl také nový InvoiceViewSet, který řeší celé CRUD API pro faktury. U obou viewsetů (pro osoby i faktury) byl doplněn pomocí DjangoFilterBackend vlastní 
FilterSet pro třídy (PersonFilter a InvoiceFilter) Díky tomu je možné v API pohodlně filtrovat faktury i osoby, podle různých parametrů ze samostatného souboru filters.py
Zde se nachází 2 třídy pro filtrování. Pro faktury je zde InvoiceFilter s možností filtrování podle ceny (price, minPrice, maxPrice), filtrování podle data vystavení
a splatnosti (tato funkce však nebyla zatím implementována do Reactu).
Pro filtrování osob je zde třída PersonFilter s parametrem search, který dělá fulltextové vyhledávání přes více polí najednou (jméno, IČO, DIČ, atd.) a parametr limit pro omezení počtu výsledků.
Pro obě třídy byly použity kombinace Q objektů a vlastní metody.

Použité technologie:
Python, Django, Django REST Framework, SQlite, React