
# LEIA-ME

### FROST- Gerador de páginas web estáticas

## Pré-requisitos

Antes de começar, se certifique de ter o item abaixo instalado:

1. [phantomjs](http://phantomjs.org/)

## Instalando o Frost

A instalação do frost é feita de forma simples:

```
git clone https://github.com/justdigital/frost.git
```

Para facilitar a execução do comando, crie uma entrada na pasta de binários de seu usuário no sistema operacional:

```
$ ln -s /path/para/frost/bin/frost /usr/local/bin/frost
```

## Configurando o Frost

Os arquivos de configuração do Frost estão localizados na pasta 'config'. Cada arquivo nesta pasta representa uma opção `--env` no momento da execução. Você pode exportar as variáveis abaixo dentro dos arquivos de configuração:

|Option|Tipo|Descrição|
|:---|:---|---:|
|baseTag|bool|Colocar ou não uma tag base nos arquivos gerados|
|baseUrl|function|A função que retorna o base URL montado do site de origem (sem barra no final)|
|bodyClass|string|Qualquer classe css para adicionar para a tag body das páginas geradas|
|customScript|string|Script que será executado apenas nas páginas estáticas geradas. Isso é usado quando um script deverá executar só em páginas geradas pelo Frost e não nas outras, por exemplo, scripts de analytics ou ads.|
|doctype|string|O doctype das páginas geradas|
|downloadAssets|bool|Define se o Frost vai baixar arquivos CSS e JS.|
|hostname|string|O hostname do site de origem|
|pageLoadTimeout|inteiro|O tempo máximo (em segundos) que o Frost vai aguardar o carregamento da página|
|pathReplacePatterns|array|Esses patterns serão utilizados no momento de salvar os arquivos. Além disso, Frost vai aplicar essa regra em todos os atributos href de links.  Os objetos de replace deverão ser declarados como no arquivo config/default-example.js|
|removeHashSymbol|bool|Transformar ou não hashes em paths. ex. /#/foo/bar -> /foo/bar|
|scheme|"http/https"|O protocolo do site de origem|
|staticBaseUrl|function|A função que retorna o base URL montado do site destino (sem barra no final)|
|staticDir|string|O path relativo à root do Frost que aponta para a pasta onde os arquivos gerados devem ser salvos|
|staticHostname|string|O hostname do site destino|
|staticScheme|"http/https"|O protocolo do site destino (estático)|
|userAgent|string|User agent usado pelo Frost ao visitar as páginas|

## Executando

Para rodar o Frost por linha de comando você deve usar o comando abaixo:

```
$ frost
```

Você também deve espeficiar algumas opções:

  * `--mode`: "list" ou "crawl" (padrão: crawl)
    * list  - faz o Frost rodar em uma lista específica de links, nenhum a mais ou a menos.
    * crawl - faz o Frost rodar em todas as páginas em uma lista de links e suas páginas filhas (Não é recomendado usar o modo 'crawl' em uma execução automática por que é difícil adivinhar o tempo total de execução).
    *OBS: O modo crawl não segue nenhum link mais de uma vez*

  * `--list`: "/,/link1/path,/products" (padrão: /)
    * A lista de caminhos para ser seguido pelo Frost. É recomendado que se você usar `--mode="crawl"`, a lista deve ter somente um caminho (geralmente o caminho "/").

  * `--type`: O tipo de comportamento do Frost, o padrão é "page". (mais informação em "Baixando Assets")

  * `--env`: "default|local|hom|prod|etc" (padrão: "default")
    * Especifica qual arquivo de configuração usar. O arquivo de configuração deve estar na pasta config/{env}.js


Dois exemplos básicos de implementação:

1º `"list"`
```
$ frost --list="/,/products,/recipes" --mode="list" --env="{env}"
```
2º `"crawl"`
```
$ frost --list="/" --mode="crawl" --env="{env}"
```

## Baixando assets


Em algumas situações, você precisará baixar arquivos físicos do site dinâmico e colocá-los no diretório estático. Para isso, nós criamos a opção `--type`.

  `$ frost --type="asset"`

Assim como o comando principal, você ainda pode passar as opções `--env` e `--list`:

  * `--path-replace-inside-assets: "true|false" (default: false)`
    * Faz com que a funcionalidade de path replacing atue sobre os assets da lista indicada
  * `--list: "/panel/sitemap.xml->sitemap.xml,/app.css->styles/app.css"`
    * Esse é um pouco diferente da opção `--type="page"`. Aqui, os caminhos também são separados por vírgula, mas você precisa especificar a origem e destino do arquivo:

     1. Um caminho contendo:  `/panel/sitemap.xml->sitemap.xml`
     2. Irá pegar o arquivo em `{origin_base_url}/panel/sitemap.xml`
     3. E irá salvar o arquivo em `{static_folder}/sitemap.xml`

## Contribuindo


O sistema de contribuição do Frost usa o GitHub para gerenciar os pull-requests. Então, basicamente, para contribuir, você irá fazer um [fork](https://help.github.com/articles/fork-a-repo/), executar o commit de suas alterações e submeter um pull-request baseado na issue criada por qualquer usuário GitHub. Seguem alguns passos mais detalhados:

1. Faça um [fork](https://help.github.com/articles/fork-a-repo/) do projeto e configure o repositório.
2. Crie uma nova branch para trabalhar: **git checkout -b nova_branch**
3. Trabalhe no código e realize o commit de suas alterações. **ALERTA: Você deve realizar o commit de seus arquivos com quebra de linhas LF. [Leia mais aqui](https://help.github.com/articles/dealing-with-line-endings/)**
4. Depois de ter certeza que seu código foi totalmente testado, você pode realizar seu push no repositório remoto: **git push origin nova_branch**
5. Agora você deve criar um [pull-request](https://help.github.com/articles/creating-a-pull-request) com um título específico, uma boa descrição contendo **o número da issue** e um pedaço de documentação explicando o que você fez.
6. Os contribuidores do código irão revisar as alterações agora, tenha em mente que é muito comum receber pedido de alteração de código, então, tente acompanhá-los ou discutir a importância do pedido de alteração para ter certeza que tudo foi feito da melhor maneira possível.

## Licença

Copyright 2016 Frost

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
