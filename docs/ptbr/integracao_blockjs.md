Em integração com o framework BlockJS, configuramos nosso frost para aguardar também até que todos os data-block e data-view sejam resolvidos, assim, os blocos criados por padrão, sem requisições customizadas ao painel, são aguardados nativamente pelo indexador.

Os blocos do Frost possuem dois eventos que representam o carregamento completo da página:

  onLoad e onReady

  - onLoad é o evento que é chamado somente em requisições ao site dinâmico, ou seja, requisições do Frost ou de pessoas testando o funcionamento do site.

  - onReady é o evento que é chamado em todos os momentos MENOS quando a requisição é feita pelo Frost, ou seja, códigos javascript que precisam estar "escondidos" do frost, devem ficar dentro de eventos onReady, por exemplo, criação de thumbnail de sliders, bind de eventos, carregamento de blocos com feed social.

