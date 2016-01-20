Configurando o Frost

Os arquivos de config estão localizados na pasta config e cada arquivo dessa pasta representa a configuração de um ambiente

No arquivo de configuração, você pode definir as seguintes variáveis:


  scheme: "http|https"
    O protocolo do site de origem

  staticScheme: "http|https"
    O protocolo do site destino (estático)

  hostname: "origin.exemplo.com.br"
    O hostname do site de origem

  staticHostname: "exemplo.com.br"
    O hostname do site destino

  baseUrl: (function)
    A função que retorna o base URL montado do site de origem (sem barra no final)

  staticBaseUrl: (function)
    A função que retorna o base URL montado do site destino (sem barra no final)

  staticDir: "../path/para/static"
    O path relativo à root do Frost que aponta para a pasta onde os arquivos gerados devem ser salvos
