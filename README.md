# Nathan Damas Antonio — Academic Website / Site Acadêmico

<div align="center">

[![Deploy site](https://img.shields.io/github/actions/workflow/status/nathandamas/nathandamas.github.io/deploy.yml?branch=master&label=Deploy%20site&logo=github)](https://github.com/nathandamas/nathandamas.github.io/actions/workflows/deploy.yml)
[![Website status](https://img.shields.io/website?url=https%3A%2F%2Fnathandamas.github.io%2F&up_color=green&up_message=online&down_color=red&down_message=offline&label=website)](https://nathandamas.github.io/)
[![GitHub last commit](https://img.shields.io/github/last-commit/nathandamas/nathandamas.github.io/master)](https://github.com/nathandamas/nathandamas.github.io/commits/master/)
[![GitHub open issues](https://img.shields.io/github/issues/nathandamas/nathandamas.github.io)](https://github.com/nathandamas/nathandamas.github.io/issues)

**GIScience · OpenStreetMap · Collaborative Cartography · Geospatial Technologies**

**Ciência da Informação Geográfica · OpenStreetMap · Cartografia Colaborativa · Geotecnologias**

**Ph.D. Candidate in Geodetic Sciences | Federal University of Paraná (UFPR)**

**Doutorando em Ciências Geodésicas | Universidade Federal do Paraná (UFPR)**

[🌐 Visit website / Visite o site](https://nathandamas.github.io/) · [🇬🇧 English](#english) · [🇧🇷 Português](#portugues)

</div>

---

<a id="english"></a>

## 🇬🇧 English

### About

This repository contains the source code for my bilingual academic and professional website, built with **MyST Markdown** and the **book-theme** template, and hosted on **GitHub Pages**.

I am Nathan Damas Antonio, a researcher in GIScience and geospatial technologies, a Ph.D. candidate in Geodetic Sciences at UFPR, and a former visiting researcher at Heidelberg University (2023–2024).

My research interests include:

- **Collaborative cartography, OpenStreetMap and VGI:** contributions, editing dynamics and geospatial data quality.
- **Spatial and spatio-temporal analysis:** territorial dynamics, urban mobility and geographic time series.
- **Semantic interoperability:** conceptual models, heterogeneous geospatial data, NLP and large language models.
- **Spatial data infrastructures:** spatial databases, metadata, geospatial ETL and automation.
- **Photogrammetry, LiDAR, UAV and 3D cadastre:** mapping and three-dimensional territorial representation.

[🏠 Home](https://nathandamas.github.io/en/) · [📚 Publications](https://nathandamas.github.io/en/publications/) · [🔬 Projects](https://nathandamas.github.io/en/projects/) · [📄 CV](https://nathandamas.github.io/en/cv/)

### Featured projects

| Project | Focus |
| --- | --- |
| [OpenStreetMap and contribution dynamics](https://nathandamas.github.io/en/projects/osm-spatiotemporal-analysis/) | Spatio-temporal analysis of contributions, deletions and data maturation in OpenStreetMap. |
| [Geospatial infrastructure](https://nathandamas.github.io/en/projects/geospatial-infrastructure/) | Spatial databases, metadata, interoperability and automation for territorial data management. |
| [NLP and LLMs in geospatial technologies](https://nathandamas.github.io/en/projects/nlp-llm-geospatial/) | Natural language processing and large language models applied to geospatial information. |

### Interactive laboratory

[Explore the lab](https://nathandamas.github.io/laboratorio/?lang=en): an nine-card bilingual story about science and postgraduate education in Brazil, with a state/region map, year controls, accessible data tables, CSV/JSON downloads and explicit attribution. Data checks and reproduction are documented in [the product README](laboratorio/ciencia-e-pos-graduacao/README.md).

### Technical details

- **Generator:** [MyST Markdown](https://mystmd.org/).
- **Template:** [book-theme](https://github.com/jupyter-book/myst-theme).
- **Hosting and deployment:** GitHub Pages through [GitHub Actions](https://github.com/nathandamas/nathandamas.github.io/actions/workflows/deploy.yml).
- **Languages:** English and Portuguese, with English first in the navigation.
- **Sections:** about, research, publications, projects, blog, CV and contact.
- **Customizations:** responsive footer with academic profile icons, custom CSS and separate publication styles (APA in English; ABNT in Portuguese).

The badges above report the deployment workflow status, website availability, latest commit and open issues. Their values are updated automatically by GitHub and Shields.io.

### Repository structure

```text
├── .github/workflows/deploy.yml  # Build, publish and verify the live site
├── assets/
│   ├── css/site.css             # Custom styles
│   ├── icons/                   # Social and academic profile icons and licenses
│   └── images/                  # Profile photo and language flags
├── content/
│   ├── index.md                 # Language selection page
│   ├── en/                      # English content
│   └── pt/                      # Portuguese content
├── footer.md                    # Shared site footer
├── myst.yml                     # MyST configuration and navigation
└── README.md                    # Bilingual repository documentation
```

### Local development

Install Node.js and npm, then clone the repository and install the MyST CLI:

```bash
git clone https://github.com/nathandamas/nathandamas.github.io.git
cd nathandamas.github.io
npm install -g mystmd
myst start
```

Open the local address printed by MyST. To generate the static site with the same root URL configuration used in deployment:

```bash
BASE_URL="" myst build --html
```

The generated files are written to `_build/html/`. The deployment workflow uses Node.js 20 and runs when changes are pushed to **`master`**; it can also be started manually from the Actions tab. After publishing, it checks the live homepage, PT/EN navigation, all 11 profile icons, styles and scripts.

### Contact and collaboration

- **Email:** [nathandamas@ufpr.br](mailto:nathandamas@ufpr.br)
- **GitHub:** [@nathandamas](https://github.com/nathandamas)
- **LinkedIn:** [nathandamas](https://www.linkedin.com/in/nathandamas/)
- **ORCID:** [0000-0002-1469-2867](https://orcid.org/0000-0002-1469-2867)
- **Google Scholar:** [Publications and citations](https://scholar.google.com.br/citations?user=WiQYxW0AAAAJ&hl=en)
- **CV Lattes:** [3565779095318842](http://lattes.cnpq.br/3565779095318842)

To report a problem or suggest an improvement, check the existing [issues](https://github.com/nathandamas/nathandamas.github.io/issues) and open a new one with a description, the affected page and, when relevant, browser/device details.

---

<a id="portugues"></a>

## 🇧🇷 Português

### Sobre

Este repositório contém o código-fonte do meu site acadêmico e profissional bilíngue, desenvolvido com **MyST Markdown**, o template **book-theme** e hospedagem no **GitHub Pages**.

Sou Nathan Damas Antonio, pesquisador em Ciência da Informação Geográfica e geotecnologias, doutorando em Ciências Geodésicas na UFPR e ex-pesquisador visitante na Universidade de Heidelberg (2023–2024).

Meus interesses de pesquisa incluem:

- **Cartografia colaborativa, OpenStreetMap e VGI:** contribuições, dinâmica de edição e qualidade dos dados geográficos.
- **Análise espacial e espaço-temporal:** dinâmicas territoriais, mobilidade urbana e séries temporais geográficas.
- **Interoperabilidade semântica:** modelos conceituais, dados geoespaciais heterogêneos, PLN e grandes modelos de linguagem.
- **Infraestruturas de dados espaciais:** bancos de dados espaciais, metadados, ETL geoespacial e automação.
- **Fotogrametria, LiDAR, VANT e cadastro 3D:** mapeamento e representação tridimensional do território.

[🏠 Início](https://nathandamas.github.io/pt/) · [📚 Publicações](https://nathandamas.github.io/pt/publications/) · [🔬 Projetos](https://nathandamas.github.io/pt/projects/) · [📄 CV](https://nathandamas.github.io/pt/cv/)

### Projetos em destaque

| Projeto | Foco |
| --- | --- |
| [OpenStreetMap e dinâmica das contribuições](https://nathandamas.github.io/pt/projects/osm-spatiotemporal-analysis/) | Análises espaço-temporais de contribuições, exclusões e maturação dos dados no OpenStreetMap. |
| [Infraestrutura geoespacial](https://nathandamas.github.io/pt/projects/geospatial-infrastructure/) | Bancos de dados espaciais, metadados, interoperabilidade e automação na gestão de dados territoriais. |
| [PLN e LLMs em geotecnologias](https://nathandamas.github.io/pt/projects/nlp-llm-geospatial/) | Processamento de linguagem natural e grandes modelos de linguagem aplicados à informação geoespacial. |

### Laboratório interativo

[Explore o laboratório](https://nathandamas.github.io/laboratorio/?lang=pt): narrativa bilíngue em nove cartões sobre ciência e pós-graduação no Brasil, com mapa de UFs e regiões, seleção de ano, tabelas acessíveis, download em CSV/JSON e atribuição explícita. A conferência e a reprodução dos dados estão documentadas no [README do produto](laboratorio/ciencia-e-pos-graduacao/README.md).

### Detalhes técnicos

- **Gerador:** [MyST Markdown](https://mystmd.org/).
- **Template:** [book-theme](https://github.com/jupyter-book/myst-theme).
- **Hospedagem e publicação:** GitHub Pages por meio do [GitHub Actions](https://github.com/nathandamas/nathandamas.github.io/actions/workflows/deploy.yml).
- **Idiomas:** inglês e português, com inglês primeiro na navegação.
- **Seções:** sobre, pesquisa, publicações, projetos, blog, CV e contato.
- **Personalizações:** rodapé responsivo com ícones dos perfis acadêmicos, CSS próprio e estilos de referências separados (APA em inglês; ABNT em português).

As marcações no topo mostram a situação da publicação, a disponibilidade do site, o último commit e as issues abertas. Os valores são atualizados automaticamente pelo GitHub e pelo Shields.io.

### Estrutura do repositório

```text
├── .github/workflows/deploy.yml  # Compila, publica e verifica o site no ar
├── assets/
│   ├── css/site.css             # Estilos personalizados
│   ├── icons/                   # Ícones de perfis sociais/acadêmicos e licenças
│   └── images/                  # Foto de perfil e bandeiras dos idiomas
├── content/
│   ├── index.md                 # Página de seleção de idioma
│   ├── en/                      # Conteúdo em inglês
│   └── pt/                      # Conteúdo em português
├── footer.md                    # Rodapé compartilhado
├── myst.yml                     # Configuração e navegação do MyST
└── README.md                    # Documentação bilíngue do repositório
```

### Desenvolvimento local

Instale Node.js e npm. Depois, clone o repositório e instale a CLI do MyST:

```bash
git clone https://github.com/nathandamas/nathandamas.github.io.git
cd nathandamas.github.io
npm install -g mystmd
myst start
```

Abra o endereço local informado pelo MyST. Para gerar o site estático com a mesma configuração de URL na raiz usada na publicação:

```bash
BASE_URL="" myst build --html
```

Os arquivos gerados ficam em `_build/html/`. O workflow usa Node.js 20 e é executado quando alterações são enviadas à branch **`master`**; também pode ser iniciado manualmente pela aba Actions. Depois da publicação, ele verifica a página inicial no ar, a navegação PT/EN, os 11 ícones dos perfis, os estilos e os scripts.

### Contato e colaboração

- **E-mail:** [nathandamas@ufpr.br](mailto:nathandamas@ufpr.br)
- **GitHub:** [@nathandamas](https://github.com/nathandamas)
- **LinkedIn:** [nathandamas](https://www.linkedin.com/in/nathandamas/)
- **ORCID:** [0000-0002-1469-2867](https://orcid.org/0000-0002-1469-2867)
- **Google Scholar:** [Publicações e citações](https://scholar.google.com.br/citations?user=WiQYxW0AAAAJ&hl=pt-BR)
- **CV Lattes:** [3565779095318842](http://lattes.cnpq.br/3565779095318842)

Para relatar um problema ou sugerir uma melhoria, consulte as [issues existentes](https://github.com/nathandamas/nathandamas.github.io/issues) e abra uma nova com a descrição, a página afetada e, quando relevante, informações do navegador/dispositivo.

---

<div align="center">

**Built with / Desenvolvido com [MyST Markdown](https://mystmd.org/) · Hosted on / Hospedado no [GitHub Pages](https://pages.github.com/)**

</div>
