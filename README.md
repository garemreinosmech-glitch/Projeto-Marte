# Projeto Marte

Mini-site responsivo do Projeto ATENA para reunir a pesquisa da turma sobre a colonização de Marte. O trabalho é desenvolvido em parceria com o Colégio Ágora Educação Integral e foi pensado para ser aberto por QR Code no banner e no vídeo do totem.

## Como adicionar os textos

1. Abra o arquivo `conteudo.js` no GitHub.
2. Clique no ícone de lápis (`Edit this file`).
3. Procure o nome da disciplina.
4. Substitua os textos entre colchetes, mantendo as crases, vírgulas e chaves.
5. Clique em `Commit changes`.

Exemplo:

```js
{
  titulo: "Gravidade e movimento",
  texto: `Cole aqui o texto completo da pesquisa.`,
  imagem: "",
  legenda: ""
}
```

## Como adicionar uma imagem

1. Na página principal do repositório, clique em `Add file` → `Upload files`.
2. Envie a imagem para uma pasta chamada `imagens`.
3. No campo `imagem` do tópico, escreva o caminho do arquivo.

```js
imagem: "imagens/nome-da-imagem.jpg",
legenda: "Descrição e crédito da imagem"
```

Use nomes sem espaços e sem acentos, por exemplo: `painel-solar-marte.jpg`.

## Como criar outro tópico

Copie um bloco de tópico dentro de `topicos` e altere os dados:

```js
{
  titulo: "Novo tópico",
  texto: `Texto do novo tópico.`,
  imagem: "",
  legenda: ""
},
```

## Como publicar no GitHub Pages

1. Abra `Settings` no repositório.
2. No menu esquerdo, clique em `Pages`.
3. Em `Build and deployment`, escolha `Deploy from a branch`.
4. Em `Branch`, selecione `main` e `/ (root)`.
5. Clique em `Save`.
6. Aguarde alguns minutos. O endereço será:

`https://garemreinosmech-glitch.github.io/Projeto-Marte/`

O QR Code deve apontar para esse endereço. Alterações futuras no conteúdo não exigem a troca do QR Code.

Os arquivos prontos do QR Code estão na pasta `assets`:

- `qr-code-projeto-marte.png`: use no vídeo do totem e em imagens digitais.
- `qr-code-projeto-marte.svg`: use no banner, pois pode ser ampliado sem perder qualidade.

## Créditos visuais

- Globo de Marte: NASA/JPL-Caltech, mosaico de imagens dos orbitadores Viking.
- Panorama da cratera Jezero: NASA/JPL-Caltech/ASU/MSSS, rover Perseverance.
