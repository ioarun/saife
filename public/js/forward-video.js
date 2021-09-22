$('#forwardVideoModal').modal();
$('select').formSelect();

// Send the message and video link to the expert
$('#forward-video').click(() => {
    // Get the video link, expert details and the message to be sent
    let expertId = $('#expert-name').val();
    let source = document.getElementsByTagName('source')
    let videoLink = source[0].src;
    let message = $('#message-to-expert').val();
    let finalMessage = "Message sent to : "+ expertId + 
                        "Video link : " + videoLink +
                        "Message : " + message;
    alert(finalMessage);

    let modalInstance = M.Modal.getInstance($("#forwardVideoModal"));
    modalInstance.close();

})