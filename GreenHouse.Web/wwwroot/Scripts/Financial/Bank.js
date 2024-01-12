var area = $("#banktable");


var ProgramDataTable = area.DataTable({
    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',
        url: '/api/bank/GetAllBank', //url of the Ajax source,i.e. web api method
    },
    searching: false,
    destroy: true,
    processing: true,
    orderCellsTop: true,
    select: true,
    info: true,
    serverSide: true,
    columns: [
        //{ data: "id", name: "id", type: "html" },
        { data: "name", name: "name", type: "html" }
        /* ,*/

    ],
    paginationType: "full_numbers",
    language: {
        url: '/lib/jQueryDatatable/fa.json'
    },
});//DataTable

function operationBank(typeOperation) {

    if (typeOperation == 'add') {
        $('#Bankname').val('');
    }
    else {
        $('#create_editBank .modal-title').html("ویرایش نام بانک");
        let currentRow = ProgramDataTable.rows({ selected: true }).data()[0];
        $('#Bankname').val(currentRow.name);

    }

    $('#typeOperation').val(typeOperation);
    $('#create_editBank').modal('show');
    setTimeout(function () { $("#capacityTitle").focus(); }, 500)
}

function operation() {

    let formCapacity = document.getElementById('formCapacity');
    if (!$("#formCapacity").valid()) {
        formCapacity.classList.add('was-validated');
        return false;
    }

    let typeOperation = $('#typeOperation').val();
    if (typeOperation == 'add') {
        loading('submitBtn', true, true);
        $.ajax({
            type: "post",
            url: "/api/Bank/PostBank",
            contentType: 'application/json',
            data: JSON.stringify({
                name: $('#Bankname').val()
            }),
            success: function (result) {
                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "بانک جدید به سامانه اضافه شد");
                $('#create_editBank').modal('hide');
                ProgramDataTable.rows().deselect();
                ProgramDataTable.ajax.reload();
            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editBank').modal('hide');

                ivsAlert2('error', "خطا", "خطا در افزودن بانک جدید");
                //console.log(ex);
                //console.log(bb);
            },
            complete: function (jqXHR) {
                ProgramDataTable.rows().deselect();
                ProgramDataTable.ajax.reload();
            }
        });
    }
    else if (typeOperation == 'edit') {
        $.ajax({
            type: "put",
            url: "/api/Bank/putBank",
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('#idCapacity').val(),
                name: $('#Bankname').val()
            }),
            success: function (result) {
                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "ظرفیت با موفقیت ویرایش شد. ");
                $('#create_editBank').modal('hide');
                resetForm('formCapacity');
            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_editBank').modal('hide');

                ivsAlert2('error', "خطا", "خطا در ویرایش ظرفیت ");
                //console.log(ex);
                //console.log(bb);
            },
            complete: function (jqXHR) {
                ProgramDataTable.rows().deselect();
                ProgramDataTable.ajax.reload();
            }
        });
    }
    else {
        //console.log('error in operation');
    }


}

ProgramDataTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = ProgramDataTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editCapacityBtn").removeClass("d-none");
        $("#deleteCapacityBtn").removeClass("d-none");
        $("#branchBtn").removeClass("d-none");
        $('#idCapacity').val(valueRowSelect.id);
        event.stopPropagation();
    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editCapacityBtn").addClass("d-none");
    $("#deleteCapacityBtn").addClass("d-none");
    $("#branchBtn").addClass("d-none");
});


function deleteBank() {
    let currentRow = ProgramDataTable.rows({ selected: true }).data()[0];

    if (confirm("آیا از حذف مطمعن هستید؟")) {

        $('#idRemoveCapacity').val(currentRow.id);
        if (currentRow == undefined || currentRow == null) {
            ivsAlert2('error', "خطا", "خطا در حذف  ");
            return;
        }
        $.ajax({
            type: "delete",
            url: "/api/Bank/DeleteBank?id=" + currentRow.id,
            contentType: 'application/json',
            success: function (result) {
                loading('removeBtn', false, true);
                ivsAlert2('success', "موفقیت", "واحد ظرفیت با موفقیت حذف شد");

            },
            error: function (ex, cc, bb) {
                loading('removeBtn', false, true);


                if (ex.responseText.indexOf("1006") > -1) {
                    ivsAlert2('error', "خطا", "ابتدا شعب بانک را حذف نمایید سپس اقدام به حذف بانک نمایید");
                    return;
                }
                ivsAlert2('error', "خطا", "خطا در حذف  ");
                //console.log(ex);
                //console.log(cc);
                //console.log(bb);
            },
            complete: function (jqXHR) {
                ProgramDataTable.rows().deselect();
                ProgramDataTable.ajax.reload();
            }
        });

    }
}

function branchBank() {
    let currentRow = ProgramDataTable.rows({ selected: true }).data()[0];
    if (currentRow == undefined || currentRow == null) {
        ivsAlert2('error', "خطا", "ابتدا بانک را انتخاب نمایید");
        return;
    }
    window.location.href = "/Bank/BankBranch/?id=" + currentRow.id + "&bankName=" + currentRow.name
}