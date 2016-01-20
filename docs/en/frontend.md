Synchronizing Frost with the application frontend

In its natural state, at the indexing moment, Frost crawls the page and wait for every element containing the attribute data-unloaded is gone.

When you are programming in javascript and want any ajax request to be saved by frost, you should put in some element (usually the container of the data you want to save) this data-unloaded attribute. On the callback of the AJAX call, you remove the attribute. This way, Frost will know that he can save the page.

Here's a example:

1. Create the element containing the data:
    
    <div id='my-data-container' data-unloaded='my_data'></div>

2. Create the AJAX call with the attribute remover on the callback:
  
    var $container = $('#my-data-container');
    $.get("/api/users/25", function(data){
      // Do anything with the data
      $container.text(data.name);
      
      // Remove the data-unloaded attribute so Frost will save the div with data.name inside
      $container.removeAttr('data-unloaded');
    });

3. Frost will save the html file with the data inside, eg.:
    
    <div id='my-data-container'>John Doe</div>

