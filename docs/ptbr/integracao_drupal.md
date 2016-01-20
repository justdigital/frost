Módulo Frost para Drupal 7

O módulo do Frost é uma implementação simples da ferramenta, ele conta com 3 componentes:

  Wrapper do comando para PHP
    O wrapper é uma classe que quando instanciada tem a capacidade de executar (usando exec()) o comando frost com base
    nos parâmetros enviados

  Painel de controle (.admin.inc)
    A tela no admin que permite a seleção de páginas e envio para o Frost e
    A tela de status, que mostra o status de execução do Frost em tempo real

      Para se comunicar com a ferramenta, o painel executa o comando com o seguinte pós-fixo:

      '> frost.status 2> frost.error'

      Assim, toda saída do comando é jogada para o arquivo de status e todos os erros são jogados para o arquivo de erro.

      Então, o painel lê esse arquivo e retorna para a página de status a cada 2 segundos.

  Crontab (hook_cron)
    É executada a cada 1 hora, envia todos os links do site para o Frost fazer um build completo do site estático

Dependências:
  Em Perdigão, o módulo Frost depende do módulo PER Sitemap pois ele utiliza as funções do sitemap para gerar a lista com todos os links do site.
