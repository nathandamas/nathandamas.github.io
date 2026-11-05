# Nathan Damas Antonio — Bilingual Academic Website

This repository contains the publication-ready bilingual website for Nathan Damas Antonio,
built with MyST Markdown and organized in Portuguese and English.

## Structure

- `content/pt/` — Portuguese version
- `content/en/` — English version
- `content/index.md` — language landing page
- `myst.yml` — MyST project configuration

## Core sections

- Home / Início
- About / Sobre
- Research / Pesquisa
- Publications / Publicações
- Projects / Projetos
- CV
- Contact / Contato

## Publication-oriented refinements

- strategic home pages in both languages;
- short recruiter-facing biography on the home page;
- extended academic biography on the About page;
- selected works section;
- publications split into selected publications and full list;
- ABNT references in Portuguese and APA references in English.

## Local development

```bash
myst start
```

## Static build

```bash
myst build --html
```
