$('#forwardVideoModal').modal();
$('select').formSelect();

// Send the message and video link to the expert
$('#forward-video').click(() => {
    console.log($('#expert-name').val(), members[currentSelectedrowID]._id);

    // Get the video link, expert details and the message to be sent
    let expertId = $('#expert-name').val();
    let memberId = members[currentSelectedrowID]._id;
    let source = document.getElementsByTagName('source')
    let videoLink = source[0].src;
    let message = $('#message-to-expert').val();
    let finalMessage = "Message sent to : "+ expertId + 
                        " Video link : " + videoLink +
                        " Message : " + message;
    
    // //Ajax call Forward to Expert
    // $.ajax({
    //     url: "/users/myMembers",
    //     data: memberData,
    //     type: "DELETE",
    //     success: (result) => {
    //         swal("Member deleted successfully!", {
    //             icon: "success",
    //             buttons: false
    //         });
    //         setTimeout(() => location.reload(), 500);
    //     }
    // });

    let modalInstance = M.Modal.getInstance($("#forwardVideoModal"));
    modalInstance.close();

})