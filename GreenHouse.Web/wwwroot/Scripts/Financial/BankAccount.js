var area = $("#bankAccount");


//bootbox.dialog({
//    message: ssaa()
//});


var ProgramDataTable = area.DataTable({
    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',
        url: '/api/BankAccount/GetAll/?bankBranchId=' + $('#bankBranchId').val(), //url of the Ajax source,i.e. web api method
    },
    searching: false,
    select: true,
    info: false,

    columns: [
        //{ data: "id", name: "id", type: "html" },
        { data: "accountNumber", name: "accountNumber", type: "html" },
        {
            data: "accountType.name", name: "accountType.name", type: "html"
        },
        { data: "accountCreate", name: "AccountCreate", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
        { data: "detailedCode", name: "DetailedCode", type: "html" },
        {
            data: "isActive", name: "IsActive", type: "html",
            render: function (data, type, row) {

                if (data === true) {
                    return '<input type="checkbox" style="width: 20px;height: 20px;margin-right: 35%;" checked="checked" disabled>';
                }
                else {
                    return '<input type="checkbox" style="width: 20px;height: 20px;margin-right: 35%;" disabled>';
                }

                return data;
            },
        },
        { data: "closeAccountDate", name: "CloseAccountDate", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
        { data: "descript", name: "Descript", type: "html" },
        /* ,*/

    ]


});//DataTable

function operationBank(typeOperation) {

    let currentRow = {};
    let titel = "حساب جدید"
    if (typeOperation != 'add') {
        currentRow = ProgramDataTable.rows({ selected: true }).data()[0];
        titel = "اصلاح حساب"
        if (currentRow == undefined || currentRow == null) {
            ivsAlert2('error', "خطا", "ابتدا یک ردیف را انتخاب نمایید  ");
            return;
        }
    }
    else {
        currentRow.BankBrancheId = $('#bankBranchId').val()
    }
    $.ajax({
        url: "/Bank/EditCreateBankAccount",
        data: currentRow,
        type: "Get",
        success: function (res) {
            bootbox.dialog({ message: res, title: titel, size: "large" }).init(function () {
                if (currentRow != null && currentRow != undefined) {

                    var newOption = new Option(currentRow.accountType.name, currentRow.accountTypeID, false, false);
                    $('#AccountTypeID').append(newOption).trigger('change');

                }
            });
        }
    });


}

function closeButton() {

    ProgramDataTable.rows().deselect();
    ProgramDataTable.ajax.reload();
    bootbox.hideAll();

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
            url: "/api/BankBranch/Post",
            contentType: 'application/json',
            data: JSON.stringify({
                ID: 0,
                Name: $('#branchName').val(),
                Code: $('#branchCode').val(),
                Address: $('#branchAddress').val(),
                BankId: $('#BankId').val(),

            }),
            success: function (result) {

                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "بانک جدید به سامانه اضافه شد");
                $('#create_edit').modal('hide');
                ProgramDataTable.rows().deselect();
                ProgramDataTable.ajax.reload();
            },
            error: function (ex, cc, bb) {


                loading('submitBtn', false, true);
                $('#create_edit').modal('hide');

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
            url: "/api/BankBranch/put",
            contentType: 'application/json',
            data: JSON.stringify({
                ID: $('#BankBranchId').val(),
                Name: $('#branchName').val(),
                Code: $('#branchCode').val(),
                Address: $('#branchAddress').val(),
                BankId: $('#BankId').val(),

            }),
            success: function (result) {
                loading('submitBtn', false, true);
                ivsAlert2('success', "موفقیت", "شعبه با موفقیت ویرایش شد. ");
                $('#create_edit').modal('hide');
                resetForm('formCapacity');
            },
            error: function (ex, cc, bb) {
                loading('submitBtn', false, true);
                $('#create_edit').modal('hide');

                ivsAlert2('error', "خطا", "خطا در ویرایش شعبه ");
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

    bootbox.confirm("آیا از حذف اطمینان داری؟", function (a) {
        if (a) {

            $('#idRemoveCapacity').val(currentRow.id);
            if (currentRow == undefined || currentRow == null) {
                ivsAlert2('error', "خطا", "خطا در حذف  ");
                return;
            }
            $.ajax({
                type: "delete",
                url: "/api/BankAccount/Delete?id=" + currentRow.id,
                contentType: 'application/json',
                success: function (result) {
                    loading('removeBtn', false, true);
                    ivsAlert2('success', "موفقیت", "شعبه بانک با موفقیت حذف شد");

                },
                error: function (ex, cc, bb) {
                    loading('removeBtn', false, true);



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
    });


}

function saveAccounting() {


    let formCapacity = document.getElementById('formedit');
    if (!$("#formedit").valid()) {
        formCapacity.classList.add('was-validated');
        $('label.error').css('color', 'red')
        return false;

    }

    var dataForm = serializeToJson('formedit');

    dataForm.AccountCreate = shamsiTomiladi(dataForm.AccountCreate);
    dataForm.IsActive = $('#IsActive').is(":checked")

    if (dataForm.CloseAccountDate.length > 0)
        dataForm.CloseAccountDate = shamsiTomiladi(dataForm.CloseAccountDate);
    else
        dataForm.CloseAccountDate = null;
    dataForm.AccountType = null;

    var url = "/api/BankAccount/post";
    var types = "Post";
    if (dataForm.ID > 0) {
        url = "/api/BankAccount/Put";
        types = "Put";
    }
    $.ajax({
        url: url,
        contentType: 'application/json',
        type: types,
        dataType: "json",
        data: JSON.stringify(dataForm),
        success: function (data) {
            bootbox.hideAll();
            ProgramDataTable.rows().deselect();
            ProgramDataTable.ajax.reload();
        },
        error: function (ex, cc, bb) {
            //console.log(ex);
            //console.log(cc);
            //console.log(bb);
            ivsAlert2('error', "خطا", "خطا در افزودن حساب  جدید");
        },
        complete: function (jqXHR) {
            ProgramDataTable.rows().deselect();
            ProgramDataTable.ajax.reload();
        }
    });

}
