$('#forwardVideoModal').modal();
$('select').formSelect();

// Send the message and video link to the expert
$('#forward-video').click((event) => {
    event.preventDefault();
    // Get the video link, expert details and the message to be sent
    let email = $('#emailId').val();
    console.log(email)
    let memberId = members[currentSelectedrowID]._id;
    let source = document.getElementsByTagName('source')
    let videoLink = source[0].src;
    let message = $('#message-to-expert').val();
    // let finalMessage = "Message sent to : "+ expertEmail + 
    //                     " Video link : " + videoLink +
    //                     " Message : " + message;
    
    //Ajax call Forward to Expert
    $.ajax({
        url: "/users/forwardCase",
        data: {email, memberId, videoLink, message},
        type: "POST",
        success: (result) => {
            swal("Forward Success!", {
                icon: "success",
                buttons: false
            });
            setTimeout(() => location.reload(), 500);
        }
    });

    let modalInstance = M.Modal.getInstance($("#forwardVideoModal"));
    modalInstance.close();

})