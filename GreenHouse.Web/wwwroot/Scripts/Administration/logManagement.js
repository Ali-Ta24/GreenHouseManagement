$("#logTable thead tr")
    .clone(true)
    .addClass('filters')
    .appendTo('#logTable thead');
var cols = [
    { data: "timeStamp", searchable: false, name: "timeStamp", filter_type: "datetimerange", type: "html", width: "200px", render: function (data, type, row) { return "<div style='width:120px; overflow:clip'>" + moment(data, 'YYYY-MM-DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm') + "</div>"; } },
    { data: "message", name: "message", filter_type: "string", type: "html", width: "500px", render: function (data, type, row) { return "<div style='width:500px; overflow:clip' title='" + (data ? data : '') + "'>" + (data ? data : '') + "</div>"; } },
    { data: "level", name: "level", filter_type: "select", filter_type_selectValues: "Fatal,Error,Warning,Information", type: "html", width: "100px" },
    { data: "exception", name: "exception", filter_type: "string", type: "html", width: "500px", render: function (data, type, row) { return "<div style='width:500px; overflow:clip' title='" + (data ? data : '') + "'>" + (data ? data : '') + "</div>"; } },
    { data: "userName", name: "userName", filter_type: "string", type: "html", width: "100px" },
    { data: "ip", name: "ip", filter_type: "string", type: "html", width: "100px" },
    { data: "userActionID", filter_type: "string", name: "userActionID", type: "html", width: "100px" },
    { data: "remoteAddress", filter_type: "string", name: "remoteAddress", type: "html", width: "300px" },
    { data: "category", name: "category", filter_type: "string", type: "html", width: "200px" },
    { data: "serviceMethod", name: "serviceMethod", filter_type: "string", type: "html", width: "200px" },

];
//start - required all files than have form validation
var forms = document.querySelectorAll('.needs-validation')

Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated')
        }, false)
    });
//end

var logTable = $('#logTable').DataTable({
    serverSide: true,
    ajax:
    {
        contentType: 'application/json',
        type: 'Get',
        url: '/api/LogManagement/LogItems',

    },
    orderCellsTop: true,
    fixedHeader: true,

    processing: true,
    scrollX: true,
    //colReorder: true,
    select: true,
    info: true,
    //colReorder: true,
    searching: true,
    //lengthChange: true,
    paginationType: "full_numbers",//pagination type
    columns: cols,
    language: {
        url: '/lib/jQueryDatatable/fa.json'
    },


    initComplete: function () {
        $(".dataTables_filter").hide();
        $(".select-info").hide();
        var api = this.api();
        // For each column
        api
            .columns()
            .eq(0)
            .each(function (colIdx) {
                //console.log(cols[colIdx].searchable);
                // Set the header cell to contain the input element
                var cell = $('.filters th').eq(
                    $(api.column(colIdx).header()).index()
                );
                var title = $(cell).text();

                if (cols[colIdx].searchable !== undefined && cols[colIdx].searchable !== true) {
                    $(cell).html('');
                    return;
                }
                if (cols[colIdx].filter_type) {

                    if (cols[colIdx].filter_type === 'string') {
                        $(cell).html('<input class="inputSearch form-control" type="text" placeholder="' + title + '" data-name="' + cols[colIdx].data + '" />');
                    } else if (cols[colIdx].filter_type === 'select') {
                        var items = cols[colIdx].filter_type_selectValues.split(",");
                        var a = "";
                        a += "<select>";
                        a += "<option value=''>None</options>";
                        for (var i = 0; i < items.length; i++) {
                            a += "<option value='" + items[i] + "'>";
                            a += items[i];
                            a += "</option>";
                        }
                        a += "</select>";
                        $(cell).html(a);
                    }
                } else {
                    $(cell).html('<input  class="inputSearch form-control" type="text" placeholder="' + title + '" data-name="' + cols[colIdx].data + '" />');
                }

                // On every keypress in this input
                $('input', $('.filters th').eq($(api.column(colIdx).header()).index()))
                    .off('keyup change')
                    .on('change', function (e) {
                        // Get the search value
                        $(this).attr('title', $(this).val());
                        var regexr = '({search})'; //$(this).parents('th').find('select').val();

                        if (this.value.length < 3) {
                            return;
                        }

                        api
                            .column(colIdx)
                            .search(
                                this.value != ''
                                    ? regexr.replace('{search}', '(((' + this.value + ')))')
                                    : '',
                                this.value != '',
                                this.value == ''
                            )
                            .draw();
                    })
                    .on('keyup', function (e) {
                        e.stopPropagation();

                        $(this).trigger('change');
                        $(this)
                            .focus()[0];
                        //.setSelectionRange(cursorPosition, cursorPosition);
                    });
                $(
                    'select',
                    $('.filters th').eq($(api.column(colIdx).header()).index())
                )
                    .off('keyup change')
                    .on('change', function (e) {
                        // Get the search value
                        $(this).attr('title', $(this).val());
                        var regexr = '({search})'; //$(this).parents('th').find('select').val();
                        //console.log($(this).val());
                        var selectedValue = $(this).val();
                        // Search the column for that value
                        api
                            .column(colIdx)
                            .search(
                                selectedValue
                            )
                            .draw();
                    });

            });
    },//initComplete
});


logTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = logTable.rows({ selected: true }).data()[0];
    console.log(valueRowSelect);
    if (valueRowSelect != undefined) {
        $("#logDetailsBtn").removeClass("d-none");

        event.stopPropagation();
    }
    setTimeout(function () { $(".select-info").hide(); }, 100);

}).on('deselect', function (event, dt, type, indexes) {
    $("#logDetailsBtn").addClass("d-none");
    setTimeout(function () { $(".select-info").hide(); }, 100);


}).on('xhr.dt', function (e, settings, json, xhr) {
    setTimeout(function () { $(".select-info").hide(); }, 100);
}).on('selectItems', function (e, dt, items) {

});


function operationLog(typeOperation) {
    if (typeOperation == 'details') {

        $('#log_details .modal-title').html("جزئیات لاگ");
        let currentRow = logTable.rows({ selected: true }).data()[0];
        $('#idLog').val(currentRow.id);
        $('#divMessageDetails').html(currentRow.message);
        $('#divErrorDetails').html(currentRow.error);

    }

    $('#typeOperation').val(typeOperation);

}

$("[data-role-operation ='details']").click(function () {
    let idRowSelect = logTable.rows({ selected: true }).data()[0];
    console.log(idRowSelect);
    var template = LogDetailManagement(idRowSelect);
    bootbox.dialog({
        message: template,
        title: "جزِیات لاگ",
    }).bind('shown.bs.modal', function () {
        $('.modal-dialog').css('max-width', '90%');
        $('.bootbox-close-button').css("display", "inline");
        $('.bootbox-close-button').addClass("btn-close");
        $('.bootbox-close-button').text("");
    });
});



function LogDetailManagement(result) {
    debugger;
    var editTemplateModal = `<div class="row" id="editmodal">
                                <form id="formoldLog" class="row g-3 needs-validation">

                                    <div class="col-4">
                                        <label class="form-label">زمان</label>
                                        <input type="text" class="form-control" id="timeStamp" min=0 max=100 value="${result.timeStamp == null ? "" : result.timeStamp}"/>
                                    </div>

                                        <script>
                                        $('#timeStamp').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: false,
                                            initialValueType: 'persian',
                                            observer: true,
                                        });
                                        if(${result.timeStamp == null}){
                                            $('#timeStamp').val("");
                                         }
                                    </script>
                                    <div class="col-4">
                                        <label class="form-label">نام متد</label>
                                        <input type="text" class="form-control" id="serviceMethod"  value="${result.serviceMethod == null ? "" : result.serviceMethod}"/>
                                    </div>

                                    <div class="col-4">
                                       <label class="form-label">IP</label>
                                       <input type="text" class="form-control" id="ip" value="${result.ip}">
                                    </div>

                                   
                                    <div class="col-4">
                                        <label class="form-label">سطح لاگ</label>
                                        <input type="text" class="form-control" id="level"  value="${result.level == null ? "" : result.level}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">نام کاربر</label>
                                        <textarea type="text" class="form-control" id="userName">${result.userName == null ? "" : result.userName}</textarea>
                                    </div>


                                    <div class="col-12">
                                        <label class="form-label">خطا</label>
                                        <textarea type="text" class="form-control" id="exception">${result.exception}</textarea>
                                    </div>


                                    <div class="col-12">
                                        <label class="form-label">متن لاگ</label>
                                        <textarea type="text" class="form-control" id="message">${result.message}</textarea>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label">Message Template</label>
                                        <textarea type="text" class="form-control" id="message">${result.messageTemplate}</textarea>
                                    </div>
                                    
                                </form>
                            </div>
`;
    return editTemplateModal;
}

//$('.inputSearch').change(function () {
//    debugger;
//    logTable.columns().search('');
//    $('input.inputSearch').filter(function (a) {
//        return $('input.inputSearch')[a].value.length > 0
//    }).each(function (a, b) {
//        columnindex = parseInt($("[data-name='" + b.dataset.name + "']")[0].dataset.columnIndex);
//        logTable.columns(columnindex).search(b.value);
//    });
//    logTable.draw();

//});


