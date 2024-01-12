
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

var capacityTable = $('#capacityTable').DataTable({
    ajax:
    {
        contentType: 'application/json',
        url: '/api/FleetCapacityUnit/Items',
    },
    searching: false,
    select: true,
    info: false,
    columns: [
        { data: "id", name: "id", type: "html", visible: false, },
        { data: "name", name: "name", type: "html" },
    ]

});

capacityTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = capacityTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editCapacityBtn").removeClass("d-none");
        $("#deleteCapacityBtn").removeClass("d-none");
        event.stopPropagation();
    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editCapacityBtn").addClass("d-none");
    $("#deleteCapacityBtn").addClass("d-none");
});


function operationCapacity(typeOperation) {
    if (typeOperation == 'add') {
        $('#create_editCapacity .modal-title').html("افزودن ظرفیت");
        $('#idCapacity').val('');
        $('#capacityTitle').val('');
    }
    else {
        $('#create_editCapacity .modal-title').html("ویرایش ظرفیت");
        let currentRow = capacityTable.rows({ selected: true }).data()[0];
        $('#idCapacity').val(currentRow.id);
        $('#capacityTitle').val(currentRow.name);

    }

    $('#typeOperation').val(typeOperation);
    $('#create_editCapacity').modal('show');
    setTimeout(function () { $("#capacityTitle").focus(); }, 500)
}


function operation() {

    let formCapacity = document.getElementById('formCapacity');
    if (!$("#formCapacity").valid()) {
        formCapacity.classList.add('was-validated');
        return false;
    }

    let typeOperation = $('#typeOperation').val();
    loading('submitBtn', true, true);
    if (typeOperation == 'add') {

        $.ajax({
            type: "post",
            url: "/api/FleetCapacityUnit/post",
            contentType: 'application/json',
            data: JSON.stringify({
                name: $('#capacityTitle').val()
            }),
            success: function (result) {
                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "ظرفیت جدید به سامانه اضافه شد");
                $('#create_editCapacity').modal('hide');

            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editCapacity').modal('hide');

                ivsAlert2('error', "خطا", "خطا در افزودن ظرفیت جدید");
                //console.log(ex);
                //console.log(bb);
            },
            complete: function (jqXHR) {
                resetForm('formCapacity');
                capacityTable.rows().deselect();
                capacityTable.ajax.reload();
            }
        });
    }
    else if (typeOperation == 'edit') {
        $.ajax({
            type: "put",
            url: "/api/FleetCapacityUnit/put",
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('#idCapacity').val(),
                name: $('#capacityTitle').val()
            }),
            success: function (result) {
                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "ظرفیت با موفقیت ویرایش شد. ");
                $('#create_editCapacity').modal('hide');
                resetForm('formCapacity');
            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editCapacity').modal('hide');

                ivsAlert2('error', "خطا", "خطا در ویرایش ظرفیت ");
                //console.log(ex);
                //console.log(bb);
            },
            complete: function (jqXHR) {
                resetForm('formCapacity');
                capacityTable.rows().deselect();
                capacityTable.ajax.reload();
            }
        });
    }
    else {
        //console.log('error in operation');
    }


}


function deleteCapacity() {
    let currentRow = capacityTable.rows({ selected: true }).data()[0];
    $('#idRemoveCapacity').val(currentRow.id);
    $('#deleteCapacityModal .modal-body h4').html(`آیا از حذف ${currentRow.name} مطمئن هستید؟`);
    $('#deleteCapacityModal').modal('show');
}

function removeCapacity() {

    loading('removeBtn', true, true);
    let currentRow = $('#idRemoveCapacity').val();
    if (currentRow == undefined || currentRow == null) {
        ivsAlert2('error', "خطا", "خطا در حذف ظرفیت ");
        return;
    }
    $.ajax({
        type: "delete",
        url: "/api/FleetCapacityUnit/delete?id=" + currentRow,
        contentType: 'application/json',
        success: function (result) {
            loading('removeBtn', false, true);
            ivsAlert2('success', "موفقیت", "واحد ظرفیت با موفقیت حذف شد");
            $('#deleteCapacityModal').modal('hide');
        },
        error: function (ex, cc, bb) {
            loading('removeBtn', false, true);
            $('#deleteCapacityModal').modal('hide');
            ivsAlert2('error', "خطا", "خطا در حذف ظرفیت ");
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            capacityTable.rows().deselect();
            capacityTable.ajax.reload();
        }
    });

}

