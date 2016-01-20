Execução do Frost

Para executar o frost via command line, utilize o seguinte comando:

  phantomjs index.js

Para que o comando funcione corretamente, você deve mandar as opções:

  --mode: "list" ou "crawl" (obrigatório)
    list faz com que o Frost apenas percorra a lista enviada no parâmetro 'list'
    crawl faz com que o Frost percorra a lista enviada no parâmetro list e em suas páginas-filha (crawl não é recomendado para execuções automáticas pois a quantidade de links percorrida é imprevisível)

  --list: "/,/link1/path,/produtos" (obrigatório)
    A lista de paths para inspecionar separados por vírgula. É recomendado que para mode="crawl" a lista contenha apenas um path (geralmente home "/")

  --env: "local|hom|prod" (default: "local")
    Especifica qual arquivo de configuração usar, os arquivos estão localizados em config/{env}.js


Um exemplo de implementação básica seria o seguinte:

  phantomjs index.js --list="/,/produtos,/receitas" --mode="list" --env="hom"



Baixando assets do site

Em algumas situações, precisamos baixar arquivos físicos do site dinâmico e colocá-los na pasta estática. Para isso, criamos um novo comando chamado assets.js. Sua execução básica é a seguinte:

  phantomjs assets.js

Quase como o comando principal, o assets tem alguns options:

  --env: Exatamente como o comando principal

  --list: "/panel/sitemap.xml->sitemap.xml,/app.css->styles/app.css"
    Lista de links, também separados por vírgula, a diferença é que cada item tem dois valores: o path de origem e o path de destino, ex:

      /panel/sitemap.xml->sitemap.xml

      Buscará o arquivo em {base_url_de_origem}/panel/sitemap.xml
      Salvará o arquivo em {pasta_estatica}/sitemap.xml
