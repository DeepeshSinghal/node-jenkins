var clientArr = {};
var pmArr = {};

var promise1 = Promise.resolve({"E":"Open", "S":"Suspended", "D":"Cancelled", "A":"Awaiting Sign Off", "W":"Wrongly Created", "C":"Closed"});
var promise2 = new Promise(function(resolve, reject) {
    $.ajax(`get-clients`)
    .done(function(data) {
        $.each(data, function(key, value){
            let k = value.i_clientid;
            let v = value.v_contactname;
            clientArr[k] = v;
        });
        resolve(clientArr);
    })
    .fail(function() {
        reject("error");
    });
});

var promise3 = new Promise(function(resolve, reject) {
    $.ajax(`get-pms`)
    .done(function(data) {
        $.each(data, function(key, value){
            let k = value.id;
            let v = `${value.first_name} ${value.middle_name} ${value.last_name}`;
            pmArr[k] = v;
        });
        resolve(pmArr);
    })
    .fail(function() {
        reject("error");
    });
});

Promise.all([promise1, promise2, promise3]).then(function(result) {
    statusArr = JSON.stringify(result[0]);
    clientArr = JSON.stringify(result[1]);
    pmArr = JSON.stringify(result[2]);

    let clientStr = '<option value="">Select Client</option>';
    let pmStr = '<option value="">Select PM</option>';
    let statusStr = '<option value="">Select Status</option>';
    var i = 0;
    
    $('#project-list').Tabledit({
        url: 'add-project',
        deleteButton:false,
        hideIdentifier: true,
        inputClass: 'relative validate[required] small form-control',
        columns: {
            identifier: [0, 'id'],
            editable: [[2, 'name'], [3, 'client_id', clientArr], [4, 'pm_id', pmArr], [5, 'escalation_matrix'], [6, 'status', statusArr]]
        },
        onAjax(action, serialize){
            let data = $.unserialize(serialize);
            let rowId = data.id;
            $('#'+rowId+' input[name="name"]').attr('data-errormessage-value-missing','Name should not be empty.');
            $('#'+rowId+' input[name="client_id"]').attr('data-errormessage-value-missing','Select project client.');
            $('#'+rowId+' input[name="pm_id"]').attr('data-errormessage-value-missing','Select project manager.');
            $('#'+rowId+' input[name="status"]').attr('data-errormessage-value-missing','Select project status.');
            if($('#'+rowId+' input[name="name"]').validationEngine('validate') && $('#'+rowId+' input[name="client_id"]').validationEngine('validate') && $('#'+rowId+' input[name="pm_id"]').validationEngine('validate') && $('#'+rowId+' input[name="status"]').validationEngine('validate')){
                $('body').preloader();
                return true;
            }else{
                return false;
            }
        },
        onSuccess(response){
            $('body').preloader('remove'); 
        }
    });
    
    var buttonCommon = {
        exportOptions: {
            columns: [2,3,4,5,6],
            format: {
                body: function ( data, row, column, node ) {
                    var element = $(node);
                    var newString = element.find("span").html();
                    return newString;
                }
            }
        },
    };

    const pr = $('#project-list').DataTable({
        buttons: [
            $.extend( true, {}, buttonCommon, {
                extend: 'copy',
                text: '<i class="fa fa-files-o" aria-hidden="true"></i> Copy',
            }),
            $.extend( true, {}, buttonCommon, {
                extend: 'print',
                text: '<i class="fa fa-print" aria-hidden="true"></i> Print',
            }),
            $.extend( true, {}, buttonCommon, {
                extend: 'pdfHtml5',
                title: 'Export-projects',
                text: '<i class="fa fa-file-pdf-o" aria-hidden="true"></i> Save as PDF',
                messageTop: 'The information in this excel is status of current projects.'
            }),
            $.extend( true, {}, buttonCommon, {
                extend: 'excelHtml5',
                title: 'Export-projects',
                text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Save as Excel',
                messageTop: 'The information in this excel is status of current projects.'
            })
        ],
        order: [[ 1, "asc" ]]
    });

    pr.buttons().container().appendTo('#dataTableButtons'); // display export buttons

    $.each(JSON.parse(clientArr), function(key, value){
        clientStr+= `<option value="${key}">${value}</option>`;
    });

    $.each(JSON.parse(pmArr), function(key, value){
        pmStr+= `<option value="${key}">${value}</option>`;
    });

    $.each(JSON.parse(statusArr), function(key, value) {   
        statusStr+= `<option value="${key}">${value}</option>`;
    });

    $('#add-new-project').click(function(){
        $('body').preloader();
        $(this).prop("disabled", true);
        pr.search( '' ).columns().search( '' ).draw();
        var rowNode = pr.row.add( [
            ``,
            '<input type="text" name="name" placeholder="Project name" id="name" data-errormessage-value-missing="Name should not be empty."  class="relative small validate[required] form-control">',
            `<select name="client_id" id="client_id" data-errormessage-value-missing="Select project client." class="relative validate[required] small form-control">${clientStr}</select>`,
            `<select name="pm_id" id="pm_id" data-errormessage-value-missing="Select project manager." class="relative validate[required] small form-control">${pmStr}</select>`,
            '<input type="text" name="escalation_matrix" placeholder="Escalation Matrix" id="escalation_matrix" class="form-control small">',
            `<select name="status" id="status" data-errormessage-value-missing="Select project status." class="relative small validate[required] form-control">${statusStr}</select>`,
            '<button onclick="saveData(this)" class="tabledit-delete-button btn btn-xs btn-default"><span class="glyphicon glyphicon-ok"></span></button>|<button id="remove" class="tabledit-delete-button btn btn-xs btn-default"><span class="glyphicon glyphicon-trash"></span></button>',
            ``              
        ]).draw(true).node();
        $(rowNode).find('td:last').remove();
        $(rowNode).prop('id','row-id-'+ ++i);
        $('body').preloader('remove');
    }); 

    $('#project-list tbody').on( 'click', '#remove', function () {
        if(confirm('Your data will destroy from row, Are you sure want to remove?')){
            $('body').preloader();
            pr.row($(this).parents('tr')).remove().draw();
            $('#add-new-project').prop('disabled',false);
            $('body').preloader('remove');
        }
    });

}, function(err) {
    console.log(err);
});

function saveData(obj){
    $('#project-list').preloader();
    var rowId = $(obj).closest('tr').attr('id');
    var name = $('#'+rowId+' #name').val();
    var client_id = $('#'+rowId+' #client_id').val();
    var pm_id = $('#'+rowId+' #pm_id').val();
    var escalation_matrix = $('#'+rowId+' #escalation_matrix').val();
    var status = $('#'+rowId+' #status').val();
    
    if($('#'+rowId+' #name').validationEngine('validate') && $('#'+rowId+' #client_id').validationEngine('validate') && $('#'+rowId+' #pm_id').validationEngine('validate') && $('#'+rowId+' #status').validationEngine('validate')){
        var userData = {
            name:name,
            client_id:client_id,
            pm_id:pm_id,
            escalation_matrix:escalation_matrix,
            status:status
        };
    }else{
        return false;
    }
    
    $.ajax({
        url: 'add-project',
        method:'POST',
        data:userData,
        type:'json',
        beforeSend:function(){
            
        },
        success:function(response){
            if(response.errors){
                let errors = response.errors;
                errors.forEach(function(data){
                    $(".formError").remove();
                    $('#'+data.param).validationEngine('validate');
                    return false;
                })
            }else{
                displayAlertMessage('Project added successfully, redirecting to listing...');
            } 
        }
    }) 
}
