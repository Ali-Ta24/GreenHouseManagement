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

var RequiredDocumentTable = $('#RequiredDocumentTable').DataTable({
    ajax:
    {
        contentType: 'application/json',
        url: '/api/RequestRequiredDocumentGroup/Items',
    },
    searching: false,
    select: true,
    info: false,
    columns: [
        { data: "title", name: "title", type: "html" },
        //{ data: "requestRequiredDocumentType", name: "requestRequiredDocumentType", type: "html"}
    ]

});

RequiredDocumentTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = RequiredDocumentTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editRequiredDocumentBtn").removeClass("d-none");
        $("#deleteRequiredDocumentBtn").removeClass("d-none");
        event.stopPropagation();
    }
}).on('deselect', function (event, dt, type, indexes) {
    $("#editRequiredDocumentBtn").addClass("d-none");
    $("#deleteRequiredDocumentBtn").addClass("d-none");
});


function operationRequiredDocument(typeOperation) {
    if (typeOperation == 'add') {
        $('#create_editRequiredDocument .modal-title').html("افزودن مدرک");
        resetForm('formRequiredDocument');

    }
    else {
        $('#create_editRequiredDocument .modal-title').html("ویرایش مدرک");
        let currentRow = RequiredDocumentTable.rows({ selected: true }).data()[0];
        $('#idRequiredDocument').val(currentRow.id);
        $('#requiredDocumentTitle').val(currentRow.title);
        $('#requiredDocumentType').val(currentRow.requestRequiredDocumentType);
    }

    $('#typeOperation').val(typeOperation);
    $('#create_editRequiredDocument').modal('show');
    setTimeout(function () { $("#RequiredDocumentTitle").focus(); }, 500)
}


function operation() {

    let formRequiredDocument = document.getElementById('formRequiredDocument');
    if (!$("#formRequiredDocument").valid()) {
        formRequiredDocument.classList.add('was-validated');
        return false;
    }

    let typeOperation = $('#typeOperation').val();
    loading('submitBtn', true, true);

    if (typeOperation == 'add') {
        var isAvailable = false;
        if ($('#requiredDocumentIsActive').is(":checked")) {
            isAvailable = true;
        }
        var addRoomModel = {
            title: $('#requiredDocumentTitle').val(),
            type: $('#requiredDocumentType').val(),
        }
        $.ajax({
            type: "post",
            url: "/api/RequestRequiredDocumentGroup/post",
            contentType: 'application/json',
            data: JSON.stringify(addRoomModel),
            success: function (result) {

                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "مدرک درخواستی به سامانه اضافه شد");
                $('#create_editRequiredDocument').modal('hide');

            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editRequiredDocument').modal('hide');

                ivsAlert2('error', "خطا", "خطا در افزودن مدرک درخواستی جدید");
            },
            complete: function (jqXHR) {
                resetForm('formRequiredDocument');
                RequiredDocumentTable.rows().deselect();
                RequiredDocumentTable.ajax.reload();
            }
        });
    }
    else if (typeOperation == 'edit') {
        var editRoomModel = {
            id: $('#idRequiredDocument').val(),
            title: $('#requiredDocumentTitle').val(),
            type: $('#requiredDocumentType').val(),
        }
        $.ajax({
            type: "put",
            url: "/api/RequestRequiredDocumentGroup/put",
            contentType: 'application/json',
            data: JSON.stringify(editRoomModel),
            success: function (result) {
                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "مدرک درخواستی با موفقیت ویرایش شد. ");
                $('#create_editRequiredDocument').modal('hide');
                resetForm('formRequiredDocument');
            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editRequiredDocument').modal('hide');

                ivsAlert2('error', "خطا", "خطا در ویرایش مدرک درخواستی ");
            },
            complete: function (jqXHR) {
                resetForm('formRequiredDocument');
                RequiredDocumentTable.rows().deselect();
                RequiredDocumentTable.ajax.reload();
            }
        });
    }
    else {
        //console.log('error in operation');
    }
}

function deleteRequiredDocument() {
    let currentRow = RequiredDocumentTable.rows({ selected: true }).data()[0];
    $('#idRemoveRequiredDocument').val(currentRow.id);
    $('#deleteRequiredDocumentModal .modal-body h4').html(`آیا از حذف ${currentRow.title} مطمئن هستید؟`);
    $('#deleteRequiredDocumentModal').modal('show');
}

function removeRequiredDocument() {

    loading('removeBtn', true, true);
    let currentRow = $('#idRemoveRequiredDocument').val();
    if (currentRow == undefined || currentRow == null) {
        ivsAlert2('error', "خطا", "خطا در حذف مدرک درخواستی ");
        return;
    }
    $.ajax({
        type: "delete",
        url: "/api/RequestRequiredDocumentGroup/delete?id=" + currentRow,
        contentType: 'application/json',
        success: function (result) {
            loading('removeBtn', false, true);
            ivsAlert2('success', "موفقیت", "مدرک درخواستی با موفقیت حذف شد");
            $('#deleteRequiredDocumentModal').modal('hide');
        },
        error: function (ex, cc, bb) {
            loading('removeBtn', false, true);
            $('#deleteRequiredDocumentModal').modal('hide');
            ivsAlert2('error', 'خطای سیستم', "امکان حذف وجود ندارد. با پشتیبانی تماس بگیرید..", position = "top right", delay = 5);
        },
        complete: function (jqXHR) {
            RequiredDocumentTable.rows().deselect();
            RequiredDocumentTable.ajax.reload();
        }
    });
}

