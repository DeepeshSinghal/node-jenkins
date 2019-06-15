
var i = 1; 
//Define User Status Object
const userStatus = {'A':'Active', 'I':'InActive'};

//get UserRole Data
var role = '';    
$.ajax({
    url: "/user/roles",
    type: "GET",
    async:false,
    contentType: "application/json"
})
.done( function(data) { 
    roleData = {};
    $.each(data, function (index, value) {
        roleData[value.id] = value.name;
        role+= '<option value="' + value.id + '">' + value.name + '</option>';
    });
    $(`#row${i} #role`).append(role);  
});

//Edit Row Plugin Use
$('#user-table').Tabledit({
    debug: true,
    url: '/user/add',
    onSuccess(data, textStatus, jqXHR)
    {
        displayAlertMessage(data.msg, data.status);
    },
    onFail(jqXHR, textStatus, errorThrown){
        console.log(errorThrown)
    },
    hideIdentifier: true, 
    deleteButton: false,
    inputClass: 'relative validate[required] form-control small',
    columns: {
        identifier: [0, 'id'],                       
        editable: [[2, 'first_name'], [3, 'middle_name'], [4, 'last_name'], [5, 'email'], [6, 'user_role_id', JSON.stringify(roleData)], [7, 'status', JSON.stringify(userStatus)]]
    }
});


//Modify Output during export
var buttonCommon = {
    exportOptions: {
        columns: [2,3,4,5,6,7,8],
        format: {
            body: function ( data, row, column, node ) {
                var element = $(node);
                var newString = element.find("span").html();
                return newString;
            }
        }
    },
};

//Load Datatable
var table = $('#user-table').DataTable({   
    dom: 'Bfrtip',
    buttons: [
        // $.extend( true, {}, buttonCommon, {
        //     extend: 'copy',
        //     text: '<i class="fa fa-files-o" aria-hidden="true"></i> Copy',
        // }),
        // $.extend( true, {}, buttonCommon, {
        //     extend: 'print',
        //     text: '<i class="fa fa-print" aria-hidden="true"></i> Print',
        // }),
        $.extend( true, {}, buttonCommon, {
            extend: 'pdfHtml5',
            title: 'Export-Users',
            text: '<i class="fa fa-file-pdf-o" aria-hidden="true"></i> PDF',
            messageTop: 'The information in this excel is status of current Users.'
        }),
        $.extend( true, {}, buttonCommon, {
            extend: 'excelHtml5',
            title: 'Export-Users',
            text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Excel',
            messageTop: 'The information in this excel is status of current Users.'
        })
    ],
    order: [[ 1, "asc" ]]
});

$(function(){
    //set status array
    statusOption = '';
    $.each(userStatus, function (index, value) {  
        statusOption+= '<option value="' + index + '">' + value + '</option>';
        });
        $(`#row${i} #status`).append(statusOption);  

   // add new row   
   $('#add-user-row').click(function(){
    $(this).prop("disabled", true);//disable add new button
    table.search( '' ).columns().search( '' ).draw();
    var rowNode = table.row.add( [
        ``,        
        '<input type="text" id="first_name" class="relative validate[required] form-control small" value="" name="first_name">',
        `<input type="text" id="middle_name" class="relative validate[required] form-control small" value="" name="middle_name">`,
        `<input type="text" id="last_name" class="relative validate[required] form-control small" value="" name="last_name">`,
        '<input type="text" id="email" class="relative validate[required, custom[email]] form-control" form-control small" value="" name="email">',
        `<select id="user_role_id" class="relative validate[required] form-control role" id="role" name="user_role_id"> 
            <option value=''> Select </option>
            ${role}                       
        </select>`,
        `<select id="status" class="relative validate[required] form-control" name="status" id="status">
            <option value=''>Select</option>
            ${statusOption}
        </select`,
        '<button onclick="saveUserData(this)" class="tabledit-delete-button btn btn-xs btn-default"><span class="glyphicon glyphicon-ok"></span></button>|<button id="remove" class="tabledit-delete-button btn btn-xs btn-default"><span class="glyphicon glyphicon-trash"></span></button>',
        ``,
                 
        ]).draw(true).node();
        $(rowNode).find('td:last').remove();
        $(rowNode).attr('id', `row${i}`);
    });

    //remove row
    $('#user-table tbody').on( 'click', '#remove', function () {
        if(confirm('Your data will destroy from row, Are you sure want to remove?')){
            table.row($(this).parents('tr')).remove().draw();
            $('#add-user-row').prop('disabled',false);
        }
    });
});

 //add User Data
 function saveUserData(obj){
    let rowId = $(obj).closest('tr').attr('id');//tr

    flag = checkFieldValidation(rowId); //field validation
    let f_name = $('#'+rowId+" input[name=first_name]").val();
    let m_name = $('#'+rowId+" input[name=middle_name]").val();
    let l_name = $('#'+rowId+" input[name=last_name]").val();
    let email = $('#'+rowId+" input[name=email]").val();  
    let role = $('#'+rowId+' select[name=user_role_id]').val();
    let status = $('#'+rowId+' #status').val();

    //To Save Data
    if(flag){ //If there is no error
        let dataBody = {
            first_name: f_name,
            middle_name: m_name,
            last_name: l_name,
            email: email,
            user_role_id: role,
            status: status
        };

        $.ajax({
            url: '/user/add',
            method:'POST',
            data: dataBody,
            type:'json',
            beforeSend:function(){
                $('#'+rowId).preloader();
            },
            success:function(response){            
                if(response.errors){
                    let errors = response.errors;
                    errors.forEach(function(data){ 
                        $(".formError").remove();
                        $('#'+data.param).validationEngine('validate');
                    })
                }else{
                    displayAlertMessage(response.msg, response.status);
                } 
            }
        }) 
    }
}


//field validation on edit row
$('.tabledit-save-button').click(function(){
    let rowId = $(this).closest('tr').attr('id');//tr
    flag = checkFieldValidation(rowId); //cal field validation method
    if(!flag) { return false; }
})


/* fields validation function
    return bool
*/
function checkFieldValidation(rowId){    
    fNameCell = $('#'+rowId+' input[name=first_name]');
    mNameCell = $('#'+rowId+" input[name=middle_name]");
    lNameCell = $('#'+rowId+" input[name=last_name]");
    emailCell = $('#'+rowId+" input[name=email]");
    roleCell = $('#'+rowId+' select[name=user_role_id]');
    statusCell = $('#'+rowId+' #status');

    // Fields Validation
    let validateFlag = false;
    if(fNameCell.validationEngine('validate') && lNameCell.validationEngine('validate') && 
        emailCell.validationEngine('validate') && roleCell.validationEngine('validate') &&
        statusCell.validationEngine('validate'))
        {
            validateFlag = true;
        }
    return validateFlag;
}

