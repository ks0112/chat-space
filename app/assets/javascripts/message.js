$(function(){

  function buildHTML(message){
    if ( message.image ) {
      let html = `
      <div class="message" data-message-id=${message.id}>
      <div class="upper-message">
      <div class="upper-message__user-name">
      ${message.user_name}
      </div>
      <div class="upper-message__date">
      ${message.created_at}
      </div>
      </div>
      <div class="lower-message">
      <p class="lower-message__content">
      ${message.content}
      </p>
      </div>
      <img src=${message.image} >
      </div>
        `;
        return html;
      } else {
        let html = `
        <div class="message" data-message-id=${message.id}>
        <div class="upper-message">
        <div class="upper-message__user-name">
        ${message.user_name}
        </div>
        <div class="upper-message__date">
        ${message.created_at}
        </div>
        </div>
        <div class="lower-message">
        <p class="lower-message__content">
        ${message.content}
        </p>
        </div>
        </div>
        `;
        return html;
      };
    }
    $('#new_message').on('submit', function(e){
      e.preventDefault()
      let formData = new FormData(this);
      let url = $(this).attr('action');
      $.ajax({
        url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
     .done(function(data){
       let html = buildHTML(data);
       $('.messages').append(html);
       $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
       $('#new_message')[0].reset();
       $('.submit-btn').attr('disabled', false);
     })
     .fail(function(){
       alert('メッセージ送信に失敗しました');
     });
    })
  let reloadMessages = function() {
    let last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        let insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
})