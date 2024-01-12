
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

var SessionRoomTable = $('#SessionRoomTable').DataTable({
    ajax:
    {
        contentType: 'application/json',
        url: '/api/SessionRoom/Items',
    },
    searching: false,
    select: true,
    info: false,
    columns: [

        { data: "title", name: "title", type: "html" },
        {
            orderable: false,
            data: null,
            type: "html",
            render: function (data, type, row, meta) {

                return ` <input type="color" class="form-control" value="${data.color}" disabled/>`
            }
        },
        { data: "isavailable", render: function (data, type, row) { return setValueBoolean(data) } },
    ]

});

SessionRoomTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = SessionRoomTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editSessionRoomBtn").removeClass("d-none");
        $("#deleteSessionRoomBtn").removeClass("d-none");
        event.stopPropagation();
    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editSessionRoomBtn").addClass("d-none");
    $("#deleteSessionRoomBtn").addClass("d-none");
});


function operationSessionRoom(typeOperation) {
    if (typeOperation == 'add') {
        $('#create_editSessionRoom .modal-title').html("افزودن اتاق جلسه");
        resetForm('formSessionRoom');

    }
    else {
        $('#create_editSessionRoom .modal-title').html("ویرایش اتاق جلسه");
        let currentRow = SessionRoomTable.rows({ selected: true }).data()[0];
        $('#idSessionRoom').val(currentRow.id);
        $('#sessionRoomTitle').val(currentRow.title);
        $('#sessionRoomColor').val(currentRow.color);
        //debugger
        if (currentRow.isavailable == true)
            $("#sessionRoomIsActive").prop("checked", true)
        else
            $("#sessionRoomIsActive").prop("checked", false)

    }

    $('#typeOperation').val(typeOperation);
    $('#create_editSessionRoom').modal('show');
    setTimeout(function () { $("#SessionRoomTitle").focus(); }, 500)
}


function operation() {

    let formSessionRoom = document.getElementById('formSessionRoom');
    if (!$("#formSessionRoom").valid()) {
        formSessionRoom.classList.add('was-validated');
        return false;
    }

    let typeOperation = $('#typeOperation').val();
    loading('submitBtn', true, true);

    if (typeOperation == 'add') {
        var isAvailable = false;
        if ($('#sessionRoomIsActive').is(":checked")) {
            isAvailable = true;
        }
        var addRoomModel = {
            stakeholderID: 0,
            title: $('#sessionRoomTitle').val(),
            color: $('#sessionRoomColor').val(),
            isAvailable: isAvailable,
        }
        $.ajax({
            type: "post",
            url: "/api/SessionRoom/post",
            contentType: 'application/json',
            data: JSON.stringify(addRoomModel),
            success: function (result) {

                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "اتاق جلسه جدید به سامانه اضافه شد");
                $('#create_editSessionRoom').modal('hide');

            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editSessionRoom').modal('hide');

                ivsAlert2('error', "خطا", "خطا در افزودن اتاق جلسه جدید");
            },
            complete: function (jqXHR) {
                resetForm('formSessionRoom');
                SessionRoomTable.rows().deselect();
                SessionRoomTable.ajax.reload();
            }
        });
    }
    else if (typeOperation == 'edit') {
        //debugger
        var isAvailable = false;
        if ($('#sessionRoomIsActive').is(":checked")) {
            isAvailable = true;
        }
        var editRoomModel = {
            stakeholderID: 0,
            id: $('#idSessionRoom').val(),
            title: $('#sessionRoomTitle').val(),
            color: $('#sessionRoomColor').val(),
            isAvailable: isAvailable,
        }
        $.ajax({
            type: "put",
            url: "/api/SessionRoom/put",
            contentType: 'application/json',
            data: JSON.stringify(editRoomModel),
            success: function (result) {
                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "اتاق جلسه با موفقیت ویرایش شد. ");
                $('#create_editSessionRoom').modal('hide');
                resetForm('formSessionRoom');
            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editSessionRoom').modal('hide');

                ivsAlert2('error', "خطا", "خطا در ویرایش اتاق جلسه ");
                //console.log(ex);
                //console.log(bb);
            },
            complete: function (jqXHR) {
                resetForm('formSessionRoom');
                SessionRoomTable.rows().deselect();
                SessionRoomTable.ajax.reload();
            }
        });
    }
    else {
        //console.log('error in operation');
    }


}


function deleteSessionRoom() {
    let currentRow = SessionRoomTable.rows({ selected: true }).data()[0];
    //console.log(currentRow);
    $('#idRemoveSessionRoom').val(currentRow.id);
    $('#deleteSessionRoomModal .modal-body h4').html(`آیا از حذف ${currentRow.title} مطمئن هستید؟`);
    $('#deleteSessionRoomModal').modal('show');
}

function removeSessionRoom() {

    loading('removeBtn', true, true);
    let currentRow = $('#idRemoveSessionRoom').val();
    if (currentRow == undefined || currentRow == null) {
        ivsAlert2('error', "خطا", "خطا در حذف اتاق جلسه ");
        return;
    }
    $.ajax({
        type: "delete",
        url: "/api/SessionRoom/delete?id=" + currentRow,
        contentType: 'application/json',
        success: function (result) {
            loading('removeBtn', false, true);
            ivsAlert2('success', "موفقیت", "اتاق جلسه با موفقیت حذف شد");
            $('#deleteSessionRoomModal').modal('hide');
        },
        error: function (ex, cc, bb) {
            loading('removeBtn', false, true);
            $('#deleteSessionRoomModal').modal('hide');
            if (ex.responseText.includes("1")) {
                ivsAlert2('error', 'خطای سیستم', "امکان حذف این اتاق وجود ندارد زیرا برای این اتاق جلسه تنظیم شده است.", position = "top right", delay = 5);
            }
            else {
                ivsAlert2('error', 'خطای سیستم', "امکان حذف وجود ندارد. با پشتیبانی تماس بگیرید.", position = "top right", delay = 5);

            }
            //ivsAlert2('error', "خطا", "خطا در حذف اتاق جلسه ");
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            SessionRoomTable.rows().deselect();
            SessionRoomTable.ajax.reload();
        }
    });

}

