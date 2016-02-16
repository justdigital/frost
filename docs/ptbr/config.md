Configurando o Frost

Os arquivos de config estão localizados na pasta config e cada arquivo dessa pasta representa a configuração de um ambiente

No arquivo de configuração, você pode definir as seguintes variáveis:

  baseTag: true|false
    Colocar ou não uma tag <base> nos arquivos gerados

  baseUrl: (function)
    A função que retorna o base URL montado do site de origem (sem barra no final)

  bodyClass: "css-classname"
    Qualquer classe css para adicionar para a tag <body> das páginas geradas
  
  customScript: "Qualquer.codigo.javascript();"
    Script que será executado apenas nas páginas estáticas geradas
    Isso é usado quando um script deverá executar só em páginas geradas pelo Frost e não nas outras, por exemplo, scripts de analytics ou ads.

  doctype: "<!doctype html>"
    O doctype das páginas geradas

  downloadAssets: true|false
    Define se o Frost vai baixar arquivos CSS e JS.

  hostname: "origin.exemplo.com.br"
    O hostname do site de origem

  pageLoadTimeout: 1-9999
    O tempo máximo (em segundos) que o Frost vai aguardar o carregamento da página

  pathReplacePatterns: (array de objetos de replace)
    Esses patterns serão utilizados no momento de salvar os arquivos. Além disso, Frost vai aplicar essa regra em todos os atributos href de links.
    Os objetos de replace deverão ser declarados como no arquivo config/default-example.js

  scheme: "http|https"
    O protocolo do site de origem

  staticBaseUrl: (function)
    A função que retorna o base URL montado do site destino (sem barra no final)

  staticDir: "/path/para/static"
    O path relativo à root do Frost que aponta para a pasta onde os arquivos gerados devem ser salvos

  staticHostname: "exemplo.com.br"
    O hostname do site destino

  staticScheme: "http|https"
    O protocolo do site destino (estático)

  userAgent: "qualquer user agent" 
