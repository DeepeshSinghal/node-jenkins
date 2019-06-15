var dataTable;
if ($('#JobsGrid').length > 0) {
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var min = parseInt($('#minDate').val(), 10);
            var max = parseInt($('#maxDate').val(), 10);
            var etd = parseFloat(data[21]) || 0; // use data for the etd column
            if ((isNaN(min) && isNaN(max)) ||
                (isNaN(min) && etd <= max) ||
                (min <= etd && isNaN(max)) ||
                (min <= etd && etd <= max)) {
                return true;
            }
            return false;
        }
    );

    var dataTable = $('#JobsGrid').DataTable({
        buttons: [
            // {
            //     extend: 'copy',
            //     text: '<i class="fa fa-files-o" aria-hidden="true"></i> Copy',
            //     className: 'btn btn-default',
            //     exportOptions: {
            //         columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
            //     }
            // },
            // {
            //     extend: 'print',
            //     text: '<i class="fa fa-print" aria-hidden="true"></i> Print',
            //     className: 'btn btn-default',
            //     exportOptions: {
            //         columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
            //     }
            // },
            {
                extend: 'pdfHtml5',
                pageSize: 'LEGAL',
                download: 'open',
                title: 'Export-Shipping',
                text: '<i class="fa fa-file-pdf-o" aria-hidden="true"></i> PDF',
                className: 'btn btn-default',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1,2,3,4,5,6,7,8,9,10]
                },
                customize: function(doc) {
                    doc.styles = {
                        tableHeader: {
                            bold: true,
                            fontSize: 10,
                            color: 'white',
                            fillColor: '#2d4154',
                            alignment: 'center'
                        },
                        tableBodyEven: {
                            fillColor: '#f3f3f3',
                            fontSize: 8,
                            alignment: 'center'
                        
                        },
                        tableBodyOdd: {
                            fillColor: '#f3f3f3',
                            fontSize: 8,
                            alignment: 'center'
                            
                        },
                        tableFooter: {
                            bold: true,
                            fontSize: 8,
                            color: 'white',
                            fillColor: '#2d4154'
                        },
                        title: {
                            alignment: 'center',
                            fontSize: 15
                        },
                        message: {}
                    };
                } 
            },
            {
                extend: 'excelHtml5',
                title: 'Export-Shipping',
                text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Excel',
                className: 'btn btn-default',
                exportOptions: {
                    columns: [1,2,3,4,5,6,7,8,9,10]
                }
            },
            // 'colvis'
        ],
        responsive: true,
        columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: -1 }
        ]
    });
    
    // Event listener to the two range filtering inputs to redraw on input
    $('#minDate, #maxDate').change(function () {
        dataTable.draw();
    });

    dataTable.buttons().container().appendTo('#dataTableButtons');

    $(document).on('click', ".save", function (e) {
        addRow(dataTable, $(this).parents("tr")[0]);
    });
}

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + '/' + monthNames[monthIndex] + '/' + year;
}

function saveFormatDate(date) {
    var monthNames = [01,02,03,04,05,06,07,08,09,10,11,12];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return year + '-' + monthNames[monthIndex] + '-' + day;
}

function updateDateRangeForFilter(fromDate, toDate) {
    var fromMonth = (fromDate.getMonth() + 1) < 10 ? '0' + (fromDate.getMonth() + 1) : (fromDate.getMonth() + 1);
    var toMonth = (toDate.getMonth() + 1) < 10 ? '0' + (toDate.getMonth() + 1) : (toDate.getMonth() + 1);
    var fromDay = (fromDate.getDate()) < 10 ? '0' + (fromDate.getDate()) : (fromDate.getDate());
    var toDay = (toDate.getDate()) < 10 ? '0' + (toDate.getDate()) : (toDate.getDate());
    $('#minDate').val(fromDate.getFullYear() + "" + fromMonth + "" + fromDay);
    $('#maxDate').val(toDate.getFullYear() + "" + toMonth + "" + toDay);
    dataTable.draw();
    fDate = formatDate(fromDate);
    tDate = formatDate(toDate);
    $('#from').text(fDate);
    $('#to').text(tDate);
}

$(function () {
    let obj = new Date();
    let day = obj.getDate();
    let month = obj.getMonth();
    let year = obj.getFullYear();
    updateDateRangeForFilter(new Date(year, month-6, day), new Date(year, month+6, day));
    $(document).on('click', '.dropdown-menu, .day', function (event) {
        event.stopPropagation();
    });

    $('#custom_datepicker .date')
        .datepicker({
            format: 'dd/MM/yyyy',
            autoclose: true

        }).on('changeDate', function (e) {
            if ($('#date_from').val() != '' && $('#date_to').val() != '') {
                $('#for-date-range-filter').removeClass('open');
                var fromDate = new Date($('#date_from').val());
                var toDate = new Date($('#date_to').val());
                updateDateRangeForFilter(fromDate, toDate);
            }
        });
        
    $('#tab a').click(function (e) {
        e.preventDefault();
        $('#custom_datepicker .date .form-control').val("");
        $('#tab a').removeClass('active');
        $(this).addClass('active').tab('show');
        if ($(this).hasClass('fixed_date')) {
            var selectedId = $(this).attr('id');
            var currentDate = new Date();
            var fromDate = new Date();
            updateDateRangeForFilter(fromDate, currentDate);

        } else {

        }
    });

    $('.datepicker')
    .datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true
    });

    $("#addShipping").on("hidden.bs.modal", function () {
        $('#addShippingForm').attr('action','/dashboard/add-shipping');
      });
})

function openModel(Id){
    $.ajax(`get-shipping/${Id}`)
    .done(function(data){
        var etd = saveFormatDate(new Date(data.etd));
        var nhs = saveFormatDate(new Date(data.nhs));
        $('#addShippingForm').attr('action','/dashboard/update-shipping');
        $('#cnee').val(data.cnee);
        $('#line').val(data.line);
        $('#origin').val(data.origin);
        $('#job_no').val(data.job_no);
        $('#type').val(data.type);
        $('#contact_no').val(data.contact_no);
        $('#pkgs').val(data.pkgs);
        $('#weight').val(data.weight);
        $('#vol').val(data.vol);
        $('#hbl').val(data.hbl);
        $('#etd').val(etd);
        $('#nhs').val(nhs);
        $('#shipper').val(data.shipper);
        $('#mb_l').val(data.mb_l);
        $('#agent').val(data.agent);
        $('#igm').val(data.igm);
        $('#zoho_freight').val(data.zoho_freight);
        $('#zoho_line').val(data.zoho_line);
        $('#ohbl').val(data.ohbl);
        $('#payment').val(data.payment);
        $('#shipping_id').val(data.id);
    }).fail(function() {
        console.log("error");
    });
    $('#addShipping').modal('show');
}