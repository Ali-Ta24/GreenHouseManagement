var forms = document.querySelectorAll('.needs-validation');
var area = $("#roletable");

var RoleDataTable = area.DataTable({
    
    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',
        url: '/api/RoleManagement/GetAllRoles', //url of the Ajax source,i.e. web api method
    },
    searching: true,
    select: true,
    info: false,

    columns: [
        { data: "name", name: "name", type: "html" }
    ]
});

function ModalOperationForAdd() {
    $('#roleName').val('');
    $("#EditBtnFinal").addClass("d-none");
    $("#submitBtn").removeClass("d-none");
    $('#create_edit').modal('show');
}

function ModalOperationForUpdate() {
    
    $('#create_edit .modal-title').html("ویرایش اطلاعات نقش");
    let currentRow = RoleDataTable.rows({ selected: true }).data()[0];
    $('#roleName').val(currentRow.name);
    $("#EditBtnFinal").removeClass("d-none");
    $("#submitBtn").addClass("d-none");
    $('#create_edit').modal('show');
}

async function PostRole() {

    var role = {
        id : 0,
        name : $("#roleName").val()
    }
    
    loading('submitBtn', true, true);
    $.ajax({
        type: "POST",
        url: "/api/RoleManagement/PostRole",
        data: JSON.stringify(role),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {
            loading('submitBtn', false, true);
            ivsAlert2('success', "موفقیت", "نقش جدید به سامانه اضافه شد");
            $('#create_edit').modal('hide');
            RoleDataTable.rows().deselect();
            RoleDataTable.ajax.reload();
        },

        error: function (response) {

            loading('submitBtn', false, true);
            $('#create_edit').modal('hide');

            ivsAlert2('error', "خطا", "خطا در افزودن نقش جدید");
            //else if (response.responseText.includes("service_exception_code:5")) {
            //    messageToShowToUser += '  شما هنوز شرکت خود را ثبت نکرده اید , ابتدا باید به گام اول رفته و شرکت خود را ثبت کنید'
            //    showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            //}
            //else {
            //    showErrorServer('showMassageErrorServerStep4', 'خطایی در ثبت اطلاعات شما رخ داده است درصورت ادامه این وضعیت با ادمین سیستم تماس بگیرید');
            //}

        },
        complete: function (){
            loading('submitBtn', false, true);
        }
    });

}

async function PutRole() {

    var role = {
        id: $("#roleID").val(),
        name: $("#roleName").val()
    }
    
    loading('EditBtnFinal', true, true);
    $.ajax({
        type: "PUT",
        url: "/api/RoleManagement/PutRole",
        data: JSON.stringify(role),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {
            loading('EditBtnFinal', false, true);
            ivsAlert2('success', "موفقیت", "نقش انتخاب شده ویرایش شد");
            $('#create_edit').modal('hide');
            RoleDataTable.rows().deselect();
            RoleDataTable.ajax.reload();
        },

        error: function (response) {

            loading('EditBtnFinal', false, true);
            $('#create_edit').modal('hide');

            ivsAlert2('error', "خطا", "خطا در ویرایش نقش انتخاب شده");
            //else if (response.responseText.includes("service_exception_code:5")) {
            //    messageToShowToUser += '  شما هنوز شرکت خود را ثبت نکرده اید , ابتدا باید به گام اول رفته و شرکت خود را ثبت کنید'
            //    showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            //}
            //else {
            //    showErrorServer('showMassageErrorServerStep4', 'خطایی در ثبت اطلاعات شما رخ داده است درصورت ادامه این وضعیت با ادمین سیستم تماس بگیرید');
            //}

        },
        complete: function () {
            loading('EditBtnFinal', false, true);
        }
    });

}


function deleteRole() {
    let currentRow = RoleDataTable.rows({ selected: true }).data()[0];
    loading('deleteRoleBtn', true, true);
    if (confirm("آیا از حدف نقش مطمین هستید؟")) {

        $('#roleID').val(currentRow.id);
        if (currentRow == undefined || currentRow == null) {
            ivsAlert2('error', "خطا", " خطا در حذف نقش");
            return;
        }
        $.ajax({
            type: "delete",
            url: "/api/RoleManagement/DeleteRole?id=" + currentRow.id,
            contentType: 'application/json',
            success: function (result) {
                loading('deleteRoleBtn', false, true);
                ivsAlert2('success', "موفقیت", "نقش جدید با موفقیت حدف شد");

            },
            error: function (ex, cc, bb) {
                loading('deleteRoleBtn', false, true);
                
                ivsAlert2('error', "خطا", "خطا در حذف  نقش");
                
            },
            complete: function (jqXHR) {
                RoleDataTable.rows().deselect();
                RoleDataTable.ajax.reload();
            }
        });

    }
}


RoleDataTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = RoleDataTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editRoleBtn").removeClass("d-none");
        $("#deleteRoleBtn").removeClass("d-none");
        $('#roleID').val(valueRowSelect.id);
        event.stopPropagation();
    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editRoleBtn").addClass("d-none");
    $("#deleteRoleBtn").addClass("d-none");
    $('#roleID').val('');
});