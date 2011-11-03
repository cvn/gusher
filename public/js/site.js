$(document).ready(function(){
  $('#addFeed').submit(function(event){
    event.preventDefault();
    $formData = $(this).serialize();
    $.post('/stream/addfeed',$formData, function(data){
      data = $.parseJSON(data);
      var feed = new Feed(window[data.params]);
      feed.params.user_name = data.user_name;
      feed.params.user_id = data.user_id;
      feed.render();
    });
  });
  $('.removefeed').click(function(event){
    event.preventDefault();
    var $trigger = $(event.target);
    var target = {
      targetstream: $trigger.data('targetstream'),
      timestamp: $trigger.data('timestamp')
    }
    $.post('/stream/removefeed', target, function(data){
      alert(data);
    })
  });
  $('#deleteStream').submit(function(event){
    return(confirm("Really delete stream?"));
  });
  
  /*
  $('.removestream').click(function(event){
    event.preventDefault();
    var $trigger = $(event.target);
    var target = {
      _id: $feed.data('_id')
    }
    console.log(target)
    $.post('/stream/removestream', target, function(data){
      alert(data);
    })
  });
  */
});