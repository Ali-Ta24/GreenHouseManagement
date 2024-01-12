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

var CountTypeTable = $('#CountTypeTable').DataTable({
    ajax:
    {
        contentType: 'application/json',
        url: '/api/RequestCountType/Items',
    },
    searching: false,
    select: true,
    info: false,
    columns: [
        { data: "title", name: "title", type: "html" },
    ]

});

CountTypeTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = CountTypeTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editCountTypeBtn").removeClass("d-none");
        $("#deleteCountTypeBtn").removeClass("d-none");
        event.stopPropagation();
    }
}).on('deselect', function (event, dt, type, indexes) {
    $("#editCountTypeBtn").addClass("d-none");
    $("#deleteCountTypeBtn").addClass("d-none");
});

//function postRequestCountType() {
//    $.ajax({
//        type: "post",
//        url: "/api/RequestCountType/post",
//        contentType: 'application/json',
//        data: JSON.stringify({
//            title: 'بشکه'
//        }),
//        success: function (result) {

//        },
//        error: function (ex, cc, bb) {
//            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
//           //console.log(ex);
//           //console.log(bb);
//        }
//    });
//}

//function putRequestCountType() {
//    $.ajax({
//        type: "put",
//        url: "/api/RequestCountType/put",
//        contentType: 'application/json',
//        data: JSON.stringify({
//            id: 6,
//            title: 'بشکه ها'
//        }),
//        success: function (result) {

//        },
//        error: function (ex, cc, bb) {
//            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
//           //console.log(ex);
//           //console.log(bb);
//        }
//    });
//}
function operationCountType(typeOperation) {
    if (typeOperation == 'add') {
        $('#create_editCountType .modal-title').html("افزودن نوع درخواست");
        resetForm('formCountType');

    }
    else {
        $('#create_editCountType .modal-title').html("ویرایش نوع درخواست");
        let currentRow = CountTypeTable.rows({ selected: true }).data()[0];
        $('#idCountType').val(currentRow.id);
        $('#countTypeTitle').val(currentRow.title);
    }

    $('#typeOperation').val(typeOperation);
    $('#create_editCountType').modal('show');
    setTimeout(function () { $("#CountTypeTitle").focus(); }, 500)
}

function operation() {

    let formCountType = document.getElementById('formCountType');
    if (!$("#formCountType").valid()) {
        formCountType.classList.add('was-validated');
        return false;
    }

    let typeOperation = $('#typeOperation').val();
    loading('submitBtn', true, true);

    if (typeOperation == 'add') {
        if ($('#countTypeIsActive').is(":checked")) {
            isAvailable = true;
        }
        var addCountTypeModel = {
            title: $('#countTypeTitle').val()
        }
        $.ajax({
            type: "post",
            url: "/api/RequestCountType/post",
            contentType: 'application/json',
            data: JSON.stringify(addCountTypeModel),
            success: function (result) {

                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "مدرک درخواستی به سامانه اضافه شد");
                $('#create_editCountType').modal('hide');

            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editCountType').modal('hide');

                ivsAlert2('error', "خطا", "خطا در افزودن مدرک درخواستی جدید");
            },
            complete: function (jqXHR) {
                resetForm('formCountType');
                CountTypeTable.rows().deselect();
                CountTypeTable.ajax.reload();
            }
        });
    }
    else if (typeOperation == 'edit') {
        var editCountTypeModel = {
            id: $('#idCountType').val(),
            title: $('#countTypeTitle').val(),
        }
        $.ajax({
            type: "put",
            url: "/api/RequestCountType/put",
            contentType: 'application/json',
            data: JSON.stringify(editCountTypeModel),
            success: function (result) {
                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "مدرک درخواستی با موفقیت ویرایش شد. ");
                $('#create_editCountType').modal('hide');
                resetForm('formCountType');
            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editCountType').modal('hide');

                ivsAlert2('error', "خطا", "خطا در ویرایش مدرک درخواستی ");
            },
            complete: function (jqXHR) {
                resetForm('formCountType');
                CountTypeTable.rows().deselect();
                CountTypeTable.ajax.reload();
            }
        });
    }
    else {
        //console.log('error in operation');
    }
}

function deleteCountType() {
    let currentRow = CountTypeTable.rows({ selected: true }).data()[0];

    $('#idRemoveCountType').val(currentRow.id);
    $('#deleteCountTypeModal .modal-body h4').html(`آیا از حذف ${currentRow.title} مطمئن هستید؟`);
    $('#deleteCountTypeModal').modal('show');
}

function removeCountType() {
    //console.log("Sdsfsdfsd");
    loading('removeBtn', true, true);
    let currentRow = $('#idRemoveCountType').val();
    if (currentRow == undefined || currentRow == null) {
        ivsAlert2('error', "خطا", "خطا در حذف مدرک درخواستی ");
        return;
    }

    $.ajax({
        type: "delete",
        url: "/api/RequestCountType/delete?id=" + currentRow,
        contentType: 'application/json',

        success: function (result) {
            loading('removeBtn', false, true);
            ivsAlert2('success', "موفقیت", "مدرک درخواستی با موفقیت حذف شد");
            $('#deleteCountTypeModal').modal('hide');
        },
        error: function (ex, cc, bb) {
            loading('removeBtn', false, true);
            $('#deleteCountTypeModal').modal('hide');
            ivsAlert2('error', 'خطای سیستم', "امکان حذف وجود ندارد. با پشتیبانی تماس بگیرید..", position = "top right", delay = 5);
        },
        complete: function (jqXHR) {
            CountTypeTable.rows().deselect();
            CountTypeTable.ajax.reload();
        }
    });
}

//$(document).ready(function () {
//    $("#btnSendType").click(function () {
//        postRequestCountType();
//    });
//    $("#btnUpdateType").click(function () {
//        putRequestCountType();
//    });
//    $("#btnDeleteType").click(function () {
//        deleteRequestCountType();
//    });


//    $("#requestCountTypeGrid thead tr")
//        .clone(true)
//        .addClass('filters')
//        .appendTo('#TableBlogList thead');

//    $ArticleCustomerDataTable = $("#requestCountTypeGrid").DataTable({
//        serverSide: true, //make server side processing to true
//        ajax:
//        {
//            contentType: 'application/json',
//            url: '/api/RequestCountType/Items', //url of the Ajax source,i.e. web api method
//        },
//        processing: true,
//        colReorder: true,
//        searchPanes: true,
//        lengthChange: false,
//        paginationType: "full_numbers",//pagination type
//        columns: [
//            { data: "title", name: "title", type: "html" },
//        ],
//        language: {
//            url: '/lib/jQueryDatatable/fa.json'
//        },
//        orderCellsTop: true,
//        fixedHeader: true,
//        initComplete: function () {
//            var api = this.api();

//            // For each column
//            api.columns()
//                .eq(0)
//                .each(function (colIdx) {
//                    // Set the header cell to contain the input element
//                    var cell = $('.filters th').eq(
//                        $(api.column(colIdx).header()).index()
//                    );
//                    var title = $(cell).text();
//                    $(cell).html('<input type="text" placeholder="' + title + '" />');

//                    // On every keypress in this input
//                    $(
//                        'input',
//                        $('.filters th').eq($(api.column(colIdx).header()).index())
//                    )
//                        .off('keyup change')
//                        .on('change', function (e) {
//                            // Get the search value
//                            $(this).attr('title', $(this).val());
//                            var regexr = '({search})'; //$(this).parents('th').find('select').val();
//                           //console.log(this);
//                            var cursorPosition = this.selectionStart;
//                            // Search the column for that value
//                            api
//                                .column(colIdx)
//                                .search(
//                                    this.value != ''
//                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
//                                        : '',
//                                    this.value != '',
//                                    this.value == ''
//                                )
//                                .draw();
//                        })
//                        .on('keyup', function (e) {
//                            e.stopPropagation();

//                            $(this).trigger('change');
//                            $(this)
//                                .focus()[0];
//                            //.setSelectionRange(cursorPosition, cursorPosition);
//                        });
//                });
//        },//initComplete

//    });//DataTable
//});