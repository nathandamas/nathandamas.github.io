# Science & postgraduate education / Ciência e pós-graduação

[English story](./?lang=en) · [Narrativa em português](./?lang=pt)

## English

Eight-card bilingual adaptation by Nathan Damas Antonio: an introduction, federal investment, GDP share, CAPES scholarship holders abroad, postgraduate programmes, enrolments, degrees awarded and methods. Six national datasets cover 2000–2023 (investment and GDP share) or 2000–2024 (the other views). This is a dated pilot, not a live monitoring system.

### Attribution and licenses

Derived data: **Alexandre Ribeiro Cajazeira Ramos**, *Ciência e pós-graduação no Brasil, governo a governo*, snapshot dated 16 October 2026. [Original product](https://cajazeiraalexandre.github.io/pilotos/ciencia-e-pos-graduacao/) · [Pinned source and license declaration](https://github.com/cajazeiraalexandre/cajazeiraalexandre.github.io/blob/cd79b6124949f6fbd4ac3ae884b8e6d10176d950/pilotos/ciencia-e-pos-graduacao/README.md).

The original product declares **MIT for code** and **CC BY 4.0 for derived data**. The derived data here remain under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The upstream MIT notice is retained in `LICENSE-UPSTREAM-MIT.txt`. The new interface and preparation script are MIT, copyright 2026 Nathan Damas Antonio; see [../LICENSE](../LICENSE). The new bilingual narrative is CC BY 4.0, attribution Nathan Damas Antonio. No portfolio photographs or prose were copied, and the original author does not endorse this adaptation.

Changes: six national datasets selected; maps, government comparisons and the original narrative omitted; new eight-card interface and original EN/PT explanatory text; investment totals recalculated from their two components. No scientific conclusion about government causality is made. No analytics scripts are included.

### What is verified

- The numerical extract matches the pinned published HTML, checked using its full SHA-256.
- Years, nonnegative finite observations, lengths and investment sums are validated.
- The downloadable CSV and JSON reproduce the frozen extract; chart labels are rounded, downloads retain precision.
- Primary source files have **not** been independently downloaded or audited. This checks fidelity to the published derivative, not independent verification of agency data or the upstream inflation adjustment.

`data/provenance.json` identifies the source commit, original HTML SHA-256, extract SHA-256, primary links, dates and changes. Original file checksums listed by the upstream author are abbreviated identifiers, not independently verified full checksums.

### Reproduce from the repository root

Python 3.11+; no third-party Python dependencies required:

```bash
python3 analises/ciencia-e-pos-graduacao/prepare.py
python3 analises/ciencia-e-pos-graduacao/prepare.py --check
python3 -m unittest discover -s tests -p 'test_science_data.py'
```

To additionally check parity against the pinned upstream HTML, download this exact revision with TLS verification enabled:

```bash
curl --fail --location https://raw.githubusercontent.com/cajazeiraalexandre/cajazeiraalexandre.github.io/cd79b6124949f6fbd4ac3ae884b8e6d10176d950/pilotos/ciencia-e-pos-graduacao/index.html --output /tmp/science-upstream.html
python3 analises/ciencia-e-pos-graduacao/prepare.py --upstream-html /tmp/science-upstream.html --check
```

To view locally, run `python3 -m http.server 8000` from the repository root and open `/laboratorio/`. Serve over HTTP; opening the HTML as a local file will not allow the JSON requests. The interface has no external JavaScript, font or chart dependencies.

### Data dictionary and reading notes

`series.csv`: `dataset`, `series`, `year`, `value`, `unit`, `snapshot_date`. Stable series identifiers match the upstream extract; `total` is recalculated. `series.json` contains the same values grouped by dataset. `source-series.json` is the immutable numeric projection used as input.

- Investment: committed expenditure in September 2026 BRL (IPCA), with executed S&T and estimated postgraduate spending; repayable FNDCT credit excluded. Component lines must not be added to the total line again.
- GDP share: percent, not a fraction; percentage-point differences are not percentage growth.
- International scholarships: CAPES scholarship holders abroad; distinct from CNPq scholarship-years and grant spending.
- Programmes are not courses; enrolments are year-end stocks; degrees awarded are annual flows, including academic and professional postgraduate education.

## Português

Adaptação bilíngue em oito cartões por Nathan Damas Antonio: introdução, investimento federal, participação no PIB, bolsistas da CAPES no exterior, programas, matrículas, titulações e métodos. Os seis conjuntos cobrem 2000–2023 (investimento e PIB) ou 2000–2024 (demais recortes). É um piloto com base datada, não um monitoramento em tempo real.

### Atribuição e licenças

Dados derivados: **Alexandre Ribeiro Cajazeira Ramos**, *Ciência e pós-graduação no Brasil, governo a governo*, base de 16 de outubro de 2026. O [produto original](https://cajazeiraalexandre.github.io/pilotos/ciencia-e-pos-graduacao/) declara código MIT e dados derivados CC BY 4.0. Os dados mantêm a licença [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). O aviso MIT original foi preservado em `LICENSE-UPSTREAM-MIT.txt`.

A nova interface e o script de preparação são MIT, copyright 2026 Nathan Damas Antonio, conforme [../LICENSE](../LICENSE). A nova narrativa bilíngue é CC BY 4.0, com atribuição a Nathan Damas Antonio. Não foram copiados fotos ou textos do portfólio; a adaptação não implica endosso do autor original.

Alterações: seleção de seis conjuntos nacionais; exclusão dos mapas, comparações entre governos e narrativa original; nova interface em oito cartões e textos próprios em EN/PT; recálculo do investimento total a partir dos componentes. Não são feitas conclusões causais sobre governos. Não há scripts de rastreamento de visitas.

### Conferência e reprodução

Os valores foram comparados com o HTML publicado na revisão fixada, identificado pelo SHA-256 completo. São conferidos os anos, a integridade numérica, as somas do investimento e a equivalência dos arquivos CSV/JSON. Os arquivos primários dos órgãos **não foram baixados novamente nem auditados independentemente**. A conferência verifica a fidelidade ao produto derivado publicado, não os arquivos originais nem a correção monetária feita na origem.

`data/provenance.json` registra revisão, checksums, datas, fontes e alterações. Os hashes abreviados dos arquivos primários são metadados do autor original, não checksums completos conferidos por esta adaptação. Use os comandos de reprodução acima a partir da raiz do repositório; basta Python 3.11+, sem dependências externas.

### Dicionário e leitura

O CSV contém `dataset` (conjunto), `series` (indicador), `year` (ano), `value` (valor), `unit` (unidade) e `snapshot_date` (data da base). O JSON contém os mesmos números agrupados. `source-series.json` é a entrada numérica congelada. Downloads preservam a precisão; rótulos dos gráficos são arredondados.

O investimento é empenhado, corrigido para reais de setembro de 2026, e exclui crédito reembolsável do FNDCT. A série total é a soma dos dois componentes, não uma terceira parcela. Participação no PIB é porcentagem; pontos percentuais diferem de variação percentual. Bolsistas não são valor financeiro nem bolsas-ano. Programas não são cursos, matrículas são estoques ao fim do ano e titulações são fluxos anuais.
