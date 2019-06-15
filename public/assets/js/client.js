
//Modify Output during export
var buttonCommon = {
    exportOptions: {
        columns: [2,3,4,5,6],
        format: {
            body: function ( data, row, column, node ) {
                var element = $(node);
                //console.log(element);
                var newString = element.find("span").html();
                return newString;
            }
        }
    },
};


var table = $('#client-table').DataTable({
    dom: 'Bfrtip',
    buttons: [
        $.extend( true, {}, buttonCommon, {
            extend: 'copy',
            text: '<i class="fa fa-files-o" aria-hidden="true"></i> Copy',
        }),
        $.extend( true, {},buttonCommon, {
            extend: 'print',
            text: '<i class="fa fa-print" aria-hidden="true"></i> Print',
        }),
        $.extend( true, {}, buttonCommon, {
            extend: 'pdfHtml5',
            title: 'Export-Users',
            text: '<i class="fa fa-file-pdf-o" aria-hidden="true"></i> Save as PDF',
            messageTop: 'The information in this excel is status of current Clients.'
        }),
        $.extend( true, {}, buttonCommon, {
            extend: 'excelHtml5',
            title: 'Export-Users',
            text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Save as Excel',
            messageTop: 'The information in this excel is status of current Clients.'
        })
    ]
});


/*add client in users */
$('.addClient').click(function(){
    let ClientId = $(this).attr("id");
    let ClientEmailOption = $(this).data('client');
    $.ajax({
        url: 'client/saveClientAsUser',
        data: { clientid: ClientId, clientEmailOption: ClientEmailOption },
        type: 'GET',
        datatype: "json", // expecting JSON to be returned
    })
    .done(function(result){
        console.log(result);
        if(result.status = 200){
            displayAlertMessage(result.success);
        }
        
    });
});

