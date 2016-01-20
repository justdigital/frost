Sincronizando o Frontend com o Frost

Em seu estado natural, no momento da indexação, o Frost entra na página e aguarda todos os elementos contendo o atributo data-unloaded sumirem.

Quando estamos programando em javascript e queremos que nossas requisições sejam salvas no Frost, colocamos no HTML do elemento um atributo data-unloaded="nome_do_bloco". Ao terminar quaisquer requisições que desejamos salvar, removemos via JS o atributo data-unloaded.
