var forms = document.querySelectorAll('.needs-validation');
var area = $("#usertable");
var companyName = '';

$('.multiple-select').select2({
    theme: 'bootstrap4',
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
    allowClear: Boolean($(this).data('allow-clear')),
    dropdownParent: $('#create')
});

$('.multiple-select').select2({
    theme: 'bootstrap4',
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
    allowClear: Boolean($(this).data('allow-clear')),
    dropdownParent: $('#edit')
});

GetAllRoles();
GetAllDepartments();
GetAllThirdPartyCompany();

var UserDataTable = area.DataTable({

    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',
        url: '/api/UserManagement/GetAllUsers', //url of the Ajax source,i.e. web api method
        error: function (x, e) {
            if (x.status == 401) {
                alert(authenticationStrs.haveBeenLoggedOutForNotHavingInteraction);
                window.location.replace(x.getResponseHeader("login-address"));
            }

        }
    },
    searching: true,
    select: true,
    info: false,

    columns: [
        { data: "firstName", name: "firstName", type: "html" },
        { data: "lastName", name: "lastName", type: "html" },
        { data: "userName", name: "userName", type: "html" },
        { data: "phoneNumber", name: "phoneNumber", type: "html" },
        { data: "email", name: "email", type: "html" },
        {
            data: "isActive", name: "isActive", type: "html",
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
        { data: "nationalCodeId", name: "nationalCodeId", type: "html" },
        { data: "roleNames", name: "roleNames", type: "html" },
        { data: "departmentName", name: "departmentName", type: "html" },
        { data: "companyName", name: "companyName", type: "html" },
        { data: "companyNationalID", name: "companyNationalID", type: "html" },
        { data: "farzinUserName", name: "farzinUserName", type: "html" },
        { data: "farzinCreatorID", name: "farzinCreatorID", type: "html" },
        { data: "farzinCreatorRoleID", name: "farzinCreatorRoleID", type: "html" },
    ]
});


function ModalOperationForAdd() {

    /*$('.multiple-select option:selected').removeAttr("selected");*/
    //$("#create_edit").val(null).trigger("change");
    //$('#create_edit').removeData();

    $('#create .modal-title').html("ثبت اطلاعات کاربر");
    resetForm('userForm');

    $("#roleIds").attr("disabled", false);
    $('#thirdPartyCompany').attr('disabled', 'disabled');
    $('#thirdPartyCompany').val('');
    $('#departmentName').attr('disabled', 'disabled');

    $('#name').val('');
    $('#lastName').val('');
    $('#email').val('');
    $('#phoneNumber').val('');
    //$('#companyName').val('');
    $('#companyNationalID').val('');
    $('#nationalCodeID').val('');
    $('#roleIds').val('');
    //$('#isActive').val('');
    $('#isActive').prop('checked', true);
    //$('#roleIds').val(null).trigger("change");
    $('#departmentName').val(null).trigger("change");
    $("#EditBtnFinal").addClass("d-none");
    $("#submitBtn").removeClass("d-none");
    $('#create').modal('show');
    $('#farzinUserName').val('');
    $('#farzinCreatorID').val('');
    $('#farzinCreatorRoleID').val('');
}

function ModalOperationForUpdate() {
    $('#edit .modal-title').html("ویرایش اطلاعات کاربر");
    let currentRow = UserDataTable.rows({ selected: true }).data()[0];
    /*("#roleIds").html("");*/
    ss = "";
    var result = currentRow.roleNames.split(", ");
    //for (var i = 0; i < result; i++) {
    //    $("#roleIds").val(result[0]);
    //}

    $('#userID-u').val(currentRow.userID);
    $('#name-u').val(currentRow.firstName);
    //$('#companyName').val(currentRow.companyName);
    $('#lastName-u').val(currentRow.lastName);
    /*$('#userName').val(currentRow.userName);*/
    $('#email-u').val(currentRow.email);
    $('#phoneNumber-u').val(currentRow.phoneNumber);
    //$('#companyNationalID').val(currentRow.companyNationalID);
    $('#nationalCodeID-u').val(currentRow.nationalCodeId);
    $('#departmentName-u').val(currentRow.departmentID);
    $('#farzinUserName-u').val(currentRow.farzinUserName);
    $('#farzinCreatorID-u').val(currentRow.farzinCreatorID);
    $('#farzinCreatorRoleID-u').val(currentRow.farzinCreatorRoleID);
    //$('#roleName').val(currentRow.roleIds);
    if (currentRow.roleNamesEnglish == "Customer") {
        //$("roleIds").prop('disabled', true);
        $('#roleIds-u').val('');
        $("#roleIds-u").attr("disabled", true);
    }
    else {
        $("#roleIds-u").val(currentRow.roleNamesEnglish);
        $("#roleIds-u").attr("disabled", false);
    }

    if (currentRow.roleNamesEnglish == "Committee_Department_User" || currentRow.roleNamesEnglish == "Committee_Department_Admin" || currentRow.roleNamesEnglish ==
        "Committee_Department_Manager" || currentRow.roleNamesEnglish == "General_Department_Admin" ||
        currentRow.roleNamesEnglish == "General_Department_User") {
        //$("roleIds").prop('disabled', true);
        $('#departmentName-u').val(currentRow.departmentID);
        $("#departmentName-u").attr("disabled", false);
    }
    else {
        $("#departmentName-u").val(currentRow.departmentID);
        $("#departmentName-u").attr("disabled", true);
    }

    if (currentRow.roleNamesEnglish == "ThirdParty") {
        //$("roleIds").prop('disabled', true);
        $('#thirdPartyCompany-u').val(currentRow.companyNationalID);
        $("#thirdPartyCompany-u").attr("disabled", false);
    }
    else {
        $("#thirdPartyCompany-u").val(currentRow.companyNationalID);
        $("#thirdPartyCompany-u").attr("disabled", true);
    }

    if (currentRow.isActive) {
        $('#isActive-u').prop('checked', true);
    }
    $("#EditBtnFinal").removeClass("d-none");
    $("#submitBtn").addClass("d-none");
    $('#edit').modal('show');
}

function ModalForChangePassword() {
    $('#change_password .modal-title').html("تغییر رمز عبور کاربر");
    let currentRow = UserDataTable.rows({ selected: true }).data()[0];

    $('#userIDForChangePassword').val(currentRow.userID);
    $('#change_password').modal('show');
}

async function PostUser() {

    //var roleIDS = [];
    //roleIDS = $("#roleIds").val();
    var countErrors = 0;
    //if (roleIDS.length < 1) {
    //    countErrors++;
    //    $(".roleUser  .select2-selection--multiple ").addClass("errorInput");
    //    $(".roleUser  .select2-selection--multiple ").removeClass("successInput");
    //    $("#errorroleUser").text("نقش کاربر را مشخص نمایید");
    //}
    //else {
    //    $(".roleUser .select2-selection--multiple ").removeClass("errorInput");
    //    $(".roleUser .select2-selection--multiple ").addClass("successInput");
    //    $("#errorroleUser").text("");
    //}

    let userForm = document.getElementById('userForm');
    if (!$("#userForm").valid()) {
        countErrors++;
        userForm.classList.add('was-validated');

    }

    if (countErrors > 0) {
        return;
    }

    var user = {
        id: 0,
        firstName: $("#name").val(),
        lastName: $("#lastName").val(),
        /*  userName: $("#userName").val(),*/
        email: $("#email").val(),
        phoneNumber: $("#phoneNumber").val(),
        companyName: null,
        companyNationalID: $("#thirdPartyCompany").val(),
        nationalCodeID: $("#nationalCodeID").val(),
        departmentID: $("#departmentName").val(),
        roleName: $("#roleIds").val(),
        isActive: $('#isActive').is(":checked"),
        farzinUserName: $("#farzinUserName").val(),
        farzinCreatorID: $("#farzinCreatorID").val(),
        farzinCreatorRoleID: $("#farzinCreatorRoleID").val(),
        /*  selectedRoleNames: [...roleIDS]*/
    }

    if ($("#thirdPartyCompany").val() != "") {
        var x = await GetCompanyNameWithNationalCodeID($("#thirdPartyCompany").val());

        if ($("#thirdPartyCompany").val() != null) {
            user.companyName = x;
        }
    }

    loading('submitBtn', true, true);
    $.ajax({
        type: "POST",
        url: "/api/UserManagement/PostUser",
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {

            loading('submitBtn', false, true);
            ivsAlert2('success', "موفقیت", "کاربر جدید به سامانه اضافه شد");
            $('#create').modal('hide');
            UserDataTable.rows().deselect();
            UserDataTable.ajax.reload();

            bootbox.alert(response);
        },

        error: function (response) {


            loading('submitBtn', false, true);
            $('#create').modal('hide');

            if (response.responseText.includes("Code5")) {
                ivsAlert2('error', "خطا", "شما برای این کاربر با توجه به نقش ان فیلد های غیر مجاز وارد کرده اید ");
            }
            else if (response.responseText.includes("Code1")) {
                ivsAlert2('error', "خطا", "شماره موبایل وارد شده تکراری است");
            }
            else if (response.responseText.includes("Code2")) {
                ivsAlert2('error', "خطا", "ایمیل وارد شده تکراری میباشد");
            }
            else if (response.responseText.includes("Code3")) {
                ivsAlert2('error', "خطا", "کد ملی وارد شده تکراری میباشد");
            }
            else if (response.responseText.includes("Code6")) {
                ivsAlert2('error', "خطا", " اس ام اس رمز عبور برای کاربر ارسال نشد , لطفا لحظاتی دیگر مجددا تلاش کنید");
            }
            else if (response.responseText.includes("Code7")) {
                ivsAlert2('primary', "خطا", "برای کاربر نقش انتخاب نکرده اید");
            }
            else {
                if (response.status == 401) {
                    alert(authenticationStrs.haveBeenLoggedOutForNotHavingInteraction);
                    window.location.replace(x.getResponseHeader("login-address"));
                } else {
                    ivsAlert2('error', "خطا", "خطا در افزودن کاربر جدید");
                }
            }


        },
        complete: function () {
            loading('submitBtn', false, true);
            resetForm('userForm');
        }
    });

}

async function PutUser() {

    //var roleIDS = [];
    //roleIDS = $("#roleIds").val();
    var countErrors = 0;
    //if (roleIDS.length < 1) {
    //    countErrors++;
    //    $(".roleUser  .select2-selection--multiple ").addClass("errorInput");
    //    $(".roleUser  .select2-selection--multiple ").removeClass("successInput");
    //    $("#errorroleUser").text("نقش کاربر را مشخص نمایید");
    //}
    //else {
    //    $(".roleUser .select2-selection--multiple ").removeClass("errorInput");
    //    $(".roleUser .select2-selection--multiple ").addClass("successInput");
    //    $("#errorroleUser").text("");
    //}

    let userForm = document.getElementById('userForm-u');
    if (!$("#userForm-u").valid()) {
        countErrors++;
        userForm.classList.add('was-validated');
    }

    if (countErrors > 0) {
        return;
    }

    var user = {

        id: $("#userID-u").val(),
        firstName: $("#name-u").val(),
        lastName: $("#lastName-u").val(),
        /*   userName: $("#userName").val(),*/
        email: $("#email-u").val(),
        phoneNumber: $("#phoneNumber-u").val(),
        //companyName: $("#companyName").val(),
        companyNationalID: $("#thirdPartyCompany-u").val(),
        departmentID: $("#departmentName-u").val(),
        roleName: $("#roleIds-u").val(),
        isActive: $('#isActive-u').is(":checked"),
        farzinUserName: $("#farzinUserName-u").val(),
        farzinCreatorID: $("#farzinCreatorID-u").val(),
        farzinCreatorRoleID: $("#farzinCreatorRoleID-u").val(),
    }

    if ($("#thirdPartyCompany-u").val() != "") {
        {
            var x = await GetCompanyNameWithNationalCodeID($("#thirdPartyCompany-u").val());

            if ($("#thirdPartyCompany-u").val() != null) {
                user.companyName = x;
            }
        }
    }



    if (user.roleName == null) {
        user.roleName = 'Customer';
    }


    loading('EditBtnFinal', true, true);
    $.ajax({
        type: "PUT",
        url: "/api/UserManagement/PutUser",
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {
            loading('EditBtnFinal', false, true);
            ivsAlert2('success', "موفقیت", "کاربر انتخاب شده ویرایش شد");
            $('#edit').modal('hide');
            UserDataTable.rows().deselect();
            UserDataTable.ajax.reload();
        },

        error: function (response) {

            loading('EditBtnFinal', false, true);
            $('#edit').modal('hide');


            if (response.responseText.includes("Code5")) {
                ivsAlert2('error', "خطا", "شما برای این کاربر با توجه به نقش ان فیلد های غیر مجاز وارد کرده اید ");
            }
            else if (response.responseText.includes("Code1")) {
                ivsAlert2('warning', "خطا", "شماره موبایل وارد شده تکراری میباشد");
            }
            else if (response.responseText.includes("Code2")) {
                ivsAlert2('warning', "خطا", "ایمیل وارد شده تکراری میباشد");
            }
            else if (response.responseText.includes("Code3")) {
                ivsAlert2('warning', "خطا", "نام کاربری وارد شده تکراری میباشد");
            }
            else if (response.responseText.includes("Code4")) {
                ivsAlert2('error', "خطا", "برای کاربر دپارتمان انتخاب نکرده اید");
            }
            else if (response.responseText.includes("Code6")) {
                ivsAlert2('error', "خطا", "برای کاربر شرکت انتخاب نکرده اید");
            }
            else if (response.responseText.includes("Code7")) {
                ivsAlert2('primary', "خطا", "برای کاربر نقش انتخاب نکرده اید");
            }
            else {
                ivsAlert2('error', "خطا", "خطا در ویرایش کاربر ");
            }

        },
        complete: function () {
            loading('EditBtnFinal', false, true);
            resetForm('userForm');
        }
    });

}


function DeleteUser() {
    let currentRow = UserDataTable.rows({ selected: true }).data()[0];

    bootbox.confirm("آیا از حذف این کاربر اطمینان دارید؟", function (a) {
        if (a) {
            loading('deleteRoleBtn', true, true);
            $('#userID').val(currentRow.id);
            if (currentRow == undefined || currentRow == null) {
                ivsAlert2('error', "خطا", "خطا در حذف کاربر");
                return;
            }
            $.ajax({
                type: "delete",
                url: "/api/UserManagement/DeleteUser?id=" + currentRow.userID,
                contentType: 'application/json',
                success: function (result) {
                    loading('deleteRoleBtn', false, true);
                    ivsAlert2('success', "موفقیت", "کاربر با موفقیت حدف شد");

                },
                error: function (ex, cc, bb) {
                    loading('deleteRoleBtn', false, true);

                    ivsAlert2('error', "خطا", "خطا در حذف  کاربر");

                },
                complete: function (jqXHR) {
                    UserDataTable.rows().deselect();
                    UserDataTable.ajax.reload();
                }

            });
        }
    });
}


async function GetCompanyNameWithNationalCodeID(nationalcpdeid) {
    //let currentRow = UserDataTable.rows({ selected: true }).data()[0];


    //var nationalcode = currentRow.nationalCodeID;
    //return;

    return $.ajax({
        type: "get",
        url: "/api/company/GetCompanyNameWithNationalCode?nationalCodeID=" + nationalcpdeid,
        contentType: 'application/json',
        success: async function (result) {

            //loading('deleteRoleBtn', false, true);
            //ivsAlert2('success', "موفقیت", "کاربر با موفقیت حدف شد");
            companyName = result;
            helpFunction(result);
            $('#companyName').append(result);
            $('#companyName-u').append(result);
            return result;
        },
        error: async function (ex, cc, bb) {

            //loading('deleteRoleBtn', false, true);

            ivsAlert2('error', "خطا", "خطا در دریافت نام شرکت");

        },
        complete: async function (jqXHR) {

            UserDataTable.rows().deselect();
            //UserDataTable.ajax.reload();
            return jqXHR;
        }
    });


}

function helpFunction(item) {

    return item;
}

function ChangePassword() {

    var countErrors = 0;

    let changepasswordForm = document.getElementById('changePasswoedForm');
    if (!$("#changePasswoedForm").valid()) {
        countErrors++;
        changepasswordForm.classList.add('was-validated');
    }

    if (countErrors > 0) {
        return;
    }

    let currentRow = UserDataTable.rows({ selected: true }).data()[0];

    loading('submitChangePasswordBtn', true, true);

    if (currentRow == undefined || currentRow == null) {
        ivsAlert2('error', "خطا", "ابتدا یک کاربر را انتخاب کنید");
        return;
    }

    var changePasswordDto = {
        userID: $("#userIDForChangePassword").val(),
        newPassword: $("#newPasswordForChange").val()
    }

    $.ajax({
        type: "POST",
        url: "/api/UserManagement/ChangePassword",
        data: JSON.stringify(changePasswordDto),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {
            loading('submitChangePasswordBtn', false, true);
            ivsAlert2('success', "موفقیت", "رمز عبور کاربر انتخاب شده ویرایش شد");
            $('#change_password').modal('hide');
            UserDataTable.rows().deselect();
            UserDataTable.ajax.reload();
        },

        error: function (response) {

            loading('submitChangePasswordBtn', false, true);
            $('#change_password').modal('hide');

            if (response.responseText.includes("code:8002")) {
                ivsAlert2('error', "خطا", response.responseText);
            }
            else {
                ivsAlert2('error', "خطا", "خطا در تغییر رمز عبور کاربر ");
            }

        },
        complete: function () {
            loading('submitChangePasswordBtn', false, true);
            resetForm('changePasswoedForm');
        }
    });

}

UserDataTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = UserDataTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editRoleBtn").removeClass("d-none");
        $("#deleteRoleBtn").removeClass("d-none");
        $("#changePassword").removeClass("d-none");
        $('#roleID').val(valueRowSelect.id);
        event.stopPropagation();
    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editRoleBtn").addClass("d-none");
    $("#deleteRoleBtn").addClass("d-none");
    $("#changePassword").addClass("d-none");
    $('#roleID').val('');
});

//MultiSelect Form

//function loadInviteUser() {
//    $.ajax({
//        type: "get",
//        url: "/api/User/GetAllRoles",
//        success: function (result) {
//            if (result.length > 0) {
//                $("#roleIds").html("");
//                ss = "";
//                for (var i = 0; i < result.length; i++) {
//                    var str = `
//                    <option value="${result[i].name}">${result[i].name}</option>
//                `;
//                    ss += str;
//                }
//                $("#roleIds").html(ss);
//            }
//        },
//        error: function (ex, cc, bb) {
//            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش دریافت نقش ها ', 'خطا', 'error');
//           //console.log(ex);
//           //console.log(bb);
//        },
//        complete: function (jqXHR) {

//        }
//    });
//}

//function loadInviteUserEdit(resultSelected) {
//    $.ajax({
//        type: "get",
//        url: "/api/User/GetAllRoles",
//        success: function (result) {
//            if (result.length > 0) {
//                $("#roleIds").html("");
//                ss = "";

//                for (var j = 0; j < resultSelected.length; j++) {
//                    var str = "";
//                    for (var i = 0; i < result.length; i++) {
//                        
//                        if (result[i].name == resultSelected[j]) {
//                            str = `
//                            <option selected value="${result[i].name}">${result[i].name}</option>
//                            `;
//                        }
//                        else {
//                            str = `
//                            <option value="${result[i].name}">${result[i].name}</option>
//                            `;
//                        }
//                        ss += str;
//                    }


//                }

//                //for (var i = 0; i < result.length; i++) {
//                //    var str = `
//                //    <option value="${result[i].name}">${result[i].name}</option>
//                //`;
//                //    ss += str;
//                //}
//                $("#roleIds").html(ss);
//            }
//        },
//        error: function (ex, cc, bb) {
//            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش دریافت نقش ها ', 'خطا', 'error');
//           //console.log(ex);
//           //console.log(bb);
//        },
//        complete: function (jqXHR) {

//        }
//    });
//}

function GetAllRoles() {
    $.ajax({
        type: "get",
        url: "/api/User/GetAllRoles",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiRoles(item);
                    createUiRolesU(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert(' اشکال در برقراری ارتباط با سرور بخش دریافت نقش ها', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}

function createUiRoles(item) {
    let template = `
        <option value="${item.name}">${item.titleMultilang}</option>
     `;
    let roleNameSelected = document.getElementById('roleIds');
    if (roleNameSelected != undefined) {
        roleNameSelected.innerHTML += template;
    }
}
function createUiRolesU(item) {
    let template = `
        <option value="${item.name}">${item.titleMultilang}</option>
     `;
    let roleNameSelected = document.getElementById('roleIds-u');
    if (roleNameSelected != undefined) {
        roleNameSelected.innerHTML += template;
    }
}


function GetAllDepartments() {
    $.ajax({
        type: "get",
        url: "/api/User/GetAllDepartments",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiDepartment(item);
                    createUiDepartmentU(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert(' اشکال در برقراری ارتباط با سرور بخش دریافت دپارتمان ها', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}

function createUiDepartment(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let roleNameSelected = document.getElementById('departmentName');
    if (roleNameSelected != undefined) {
        roleNameSelected.innerHTML += template;
    }
}
function createUiDepartmentU(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let roleNameSelected = document.getElementById('departmentName-u');
    if (roleNameSelected != undefined) {
        roleNameSelected.innerHTML += template;
    }
}

function GetAllThirdPartyCompany() {
    $.ajax({
        type: "get",
        url: "/api/Company/GetAllCompanythirdPartyView",
        success: function (result) {
            //console.log(result);
            //console.log('--------------------');
            if (result != null) {
                result.forEach(item => {
                    createUiThirdParty(item);
                    createUiThirdPartyU(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert(' اشکال در برقراری ارتباط با سرور بخش دریافت شرکت ها', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}

function createUiThirdParty(item) {
    let template = `
        <option value="${item.nationalCode}">${item.name}</option>
     `;
    let roleNameSelected = document.getElementById('thirdPartyCompany');
    if (roleNameSelected != undefined) {
        roleNameSelected.innerHTML += template;
    }
}
function createUiThirdPartyU(item) {
    let template = `
        <option value="${item.nationalCode}">${item.name}</option>
     `;
    let roleNameSelected = document.getElementById('thirdPartyCompany-u');
    if (roleNameSelected != undefined) {
        roleNameSelected.innerHTML += template;
    }
}











function changeCompanytName() {
    var value = $('#roleIds').val();
    $.ajax({
        type: "get",
        url: "/api/RoleManagement/GetMyRole?id=" + value,
        success: function (rtn) {
            if (rtn != null && rtn.name == 'ThirdParty') {
                //$('#programTypeKind').val("1");
                $('#departmentName').val("");
                $('#thirdPartyCompany').attr('disabled', false);
            }
            else if (rtn != null && (rtn.name == 'Committee_Department_Admin' || rtn.name == 'Committee_Department_User' ||
                rtn.name == 'Committee_Department_Manager' ||
                rtn.name == 'General_Department_User' ||
                rtn.name == 'General_Department_Admin'))
            {
                //$('#programTypeKind').val("1");
                $('#thirdPartyCompany').val("");
                $('#departmentName').attr('disabled', false);
            }
            //else if (rtn != null && rtn.programTypeKindID == 2) {
            //    //$('#programTypeKind').val("2");
            //    $('#programTypeKind').attr('disabled', 'disabled');
            //}
            else {
                //var obj = document.getElementById('thirdPartyCompany');
                /*        var x = $("#designType").attr('disabled');*/
                //if (!obj.hasAttribute('disabled')) {

                $('#thirdPartyCompany').attr('disabled', 'disabled');
                $('#departmentName').attr('disabled', 'disabled');
                $('#thirdPartyCompany').val("");
                $('#departmentName').val("");
                //}

            }

            //else if (rtn != null && rtn.programTypeKindID == 2) {
            //    //$('#programTypeKind').val("2");
            //    $('#programTypeKind').attr('disabled', 'disabled');
            //}
            //else {
            //var obj = document.getElementById('departmentName');
            /*        var x = $("#designType").attr('disabled');*/
            /*        if (!obj.hasAttribute('disabled')) {*/

            //}
            //}
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور بخش دریافت دپارتمان ها', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            if (jqXHR.responseJSON != null && (jqXHR.responseJSON.name == 'Committee_Department_Admin' || jqXHR.responseJSON.name == 'Committee_Department_User')) {
                $('#thirdPartyCompany').attr('disabled', 'disabled');
            }
            else if (jqXHR.responseJSON != null && jqXHR.responseJSON.name == 'ThirdParty') {
                $('#departmentName').attr('disabled', 'disabled');
            }
            else {

            }
        }

    });
}

function changeCompanytNameUpdate() {
    var value = $('#roleIds-u').val();
    $.ajax({
        type: "get",
        url: "/api/RoleManagement/GetMyRole?id=" + value,
        success: function (rtn) {
            if (rtn != null && rtn.name == 'ThirdParty') {
                //$('#programTypeKind').val("1");
                $('#departmentName-u').val("");
                $('#thirdPartyCompany-u').attr('disabled', false);
            }
            else if (rtn != null && (rtn.name == 'Committee_Department_Admin' || rtn.name == 'Committee_Department_User' || rtn.name == 'Committee_Department_Manager')) {
                //$('#programTypeKind').val("1");
                $('#thirdPartyCompany-u').val("");
                $('#departmentName-u').attr('disabled', false);
            }
            //else if (rtn != null && rtn.programTypeKindID == 2) {
            //    //$('#programTypeKind').val("2");
            //    $('#programTypeKind').attr('disabled', 'disabled');
            //}
            else {
                //var obj = document.getElementById('thirdPartyCompany');
                /*        var x = $("#designType").attr('disabled');*/
                //if (!obj.hasAttribute('disabled')) {

                $('#thirdPartyCompany-u').attr('disabled', 'disabled');
                $('#departmentName-u').attr('disabled', 'disabled');
                $('#thirdPartyCompany-u').val("");
                $('#departmentName-u').val("");
                //}

            }

            //else if (rtn != null && rtn.programTypeKindID == 2) {
            //    //$('#programTypeKind').val("2");
            //    $('#programTypeKind').attr('disabled', 'disabled');
            //}
            //else {
            //var obj = document.getElementById('departmentName');
            /*        var x = $("#designType").attr('disabled');*/
            /*        if (!obj.hasAttribute('disabled')) {*/

            //}
            //}
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور بخش دریافت دپارتمان ها', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            if (jqXHR.responseJSON != null && (jqXHR.responseJSON.name == 'Committee_Department_Admin' || jqXHR.responseJSON.name == 'Committee_Department_User')) {
                $('#thirdPartyCompany-u').attr('disabled', 'disabled');
            }
            else if (jqXHR.responseJSON != null && jqXHR.responseJSON.name == 'ThirdParty') {
                $('#departmentName-u').attr('disabled', 'disabled');
            }
            else {

            }
        }

    });
}