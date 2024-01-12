var forms = document.querySelectorAll('.needs-validation');
var area = $("#usercompany");


$('.multiple-select').select2({
    theme: 'bootstrap4',
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
    allowClear: Boolean($(this).data('allow-clear')),
    dropdownParent: $('#create_edit')
});


//$('#BoardDirectorsBirthday').persianDatepicker({
//    'format': 'YYYY/MM/DD',
//    'autoclose': true,
//    //maxDate: new persianDate().valueOf(),
//    //minDate: new persianDate().subtract('day', 0).valueOf(),
//    showOtherMonths: true,
//    selectOtherMonths: true,

//});

GetAllCompanyType();
GetAllCompanyOwnerShipType();




var UserDataTable = area.DataTable({

    ajax:
    {
        contentType: 'application/json',
        url: '/api/Company/GetAllCompany' //url of the Ajax source,i.e. web api method
    },
    searching: true,
    select: true,
    info: false,

    columns: [
        { data: "name", name: "name", type: "html" },
        { data: "nationalCode", name: "nationalCode", type: "html" },
        { data: "financialCode", name: "financialCode", type: "html" },
        { data: "registrationCode", name: "registrationCode", type: "html" },
        { data: "registrationLocation", name: "registrationLocation", type: "html" },
        { data: "companyGroupNames", name: "companyGroupNames", type: "html" },

        { data: "initiationDate", name: "initiationDate", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
        { data: "registrationDate", name: "registrationDate", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
        { data: "companyTypeTitle", name: "companyTypeTitle", type: "html" },
        { data: "companyOwnershipTypeTitle", name: "companyOwnershipTypeTitle", type: "html" }

    ]
});



function ModalOperationForAdd() {



    $('#create_edit .modal-title').html(" ثبت اطلاعات شرکت");

    $("#inviteUserSesstion").html("");
    resetForm('userForm');
    loadInviteUser();

    $("#EditBtnFinal").addClass("d-none");
    $("#submitBtn").removeClass("d-none");

    $('#registrationDate').persianDatepicker({
        'format': 'YYYY/MM/DD',
        'autoclose': true,
        showOtherMonths: true,
        selectOtherMonths: true,
        initialValue: true,
        initialValueType: 'gregorian',
        observer: true,
    });

    $('#initiationDate').persianDatepicker({
        'format': 'YYYY/MM/DD',
        'autoclose': true,
        showOtherMonths: true,
        selectOtherMonths: true,
        initialValue: true,
        initialValueType: 'gregorian',
        observer: true,
    });


    $('#create_edit').modal('show');
}

function ModalOperationForUpdate() {

    $('#create_edit .modal-title').html("ویرایش اطلاعات شرکت");
    let currentRow = UserDataTable.rows({ selected: true }).data()[0];

    $("#inviteUserSesstion").html("");
    ss = "";
    var select = [];
    var result = [];
    if (currentRow.companyGroupIds != null) {
        result = currentRow.companyGroupIds.split(", ");
    }
    loadInviteUserEdit(result)


    $('#id').val(currentRow.id);
    $('#name').val(currentRow.name);
    $('#nationalCodeID').val(currentRow.nationalCode);
    $('#financialCode').val(currentRow.financialCode);
    $('#registrationCode').val(currentRow.registrationCode);
    $('#registrationDate').val(getDateWithOutTime(currentRow.registrationDate));
    $('#initiationDate').val(getDateWithOutTime(currentRow.initiationDate));

    $('#registrationDate').persianDatepicker({
        'format': 'YYYY/MM/DD',
        'autoclose': true,
        showOtherMonths: true,
        selectOtherMonths: true,
        initialValue: true,
        initialValueType: 'gregorian',
        //observer: true,

    });

    $('#initiationDate').persianDatepicker({
        'format': 'YYYY/MM/DD',
        'autoclose': true,
        showOtherMonths: true,
        selectOtherMonths: true,
        initialValue: true,
        initialValueType: 'persian',
        //observer: true,
        //altField: '.observer-example-alt'
    });


    $('#registrationLocation').val(currentRow.registrationLocation);
    $('#isThirdParty').val(currentRow.isThirdParty);
    if (currentRow.isThirdParty) {
        $('#isThirdParty').prop('checked', true);
    }
    else {

        $('#isThirdParty').prop('checked', false);

    }
    $('#companyTypeID').val(currentRow.companyTypeID);
    $('#companyOwnershipTypeID').val(currentRow.companyOwnershipTypeID);




    $("#EditBtnFinal").removeClass("d-none");
    $("#submitBtn").addClass("d-none");
    $('#create_edit').modal('show');
}

async function PostUser() {

    var roleIDS = [];
    roleIDS = $("#inviteUserSesstion").val();
    var countErrors = 0;

    let userForm = document.getElementById('userForm');
    if (!$("#userForm").valid()) {
        countErrors++;
        userForm.classList.add('was-validated');

    }

    if (countErrors > 0) {
        return;
    }

    var companyDto = {
        id: 0,
        companyGroupIDs: roleIDS,
        nationalCode: $("#nationalCodeID").val(),
        financialCode: $("#financialCode").val(),
        name: $("#name").val(),
        registrationCode: $("#registrationCode").val(),
        isThirdParty: $('#isThirdParty').is(":checked"),
        companyOwnershipTypeID: $("#companyOwnershipTypeID").val(),
        registrationLocation: $("#registrationLocation").val(),
        initiationDate: moment($("#initiationDate").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
        registrationDate: moment($("#registrationDate").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
        companyTypeID: $('#companyTypeID').val()

        /*  selectedRoleNames: [...roleIDS]*/
    }

    loading('submitBtn', true, true);
    $.ajax({
        type: "POST",
        url: "/api/Company/Post",
        data: JSON.stringify(companyDto),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {
            ;
            loading('submitBtn', false, true);
            ivsAlert2('success', "موفقیت", "شرکت جدید به سامانه اضافه شد");
            $('#create_edit').modal('hide');
            UserDataTable.rows().deselect();
            UserDataTable.ajax.reload();

            bootbox.alert(response);
        },

        error: function (response) {


            loading('submitBtn', false, true);
            $('#create_edit').modal('hide');

            if (response.responseText.includes("Code1")) {
                ivsAlert2('error', "خطا", "کد مالی وارد شده تکراری میباشد");
            }
            else if (response.responseText.includes("Code2")) {
                ivsAlert2('error', "خطا", "شناسه ملی شرکت تکراری میباشد");
            }
            else if (response.responseText.includes("Code3")) {
                ivsAlert2('error', "خطا", "کد ثبتی شرکت تکراری میباشد");
            }
            else if (response.responseText.includes("Code4")) {
                ivsAlert2('error', "خطا", "شناسه ملی شرکت را وارد نکرده اید");
            }
            else if (response.responseText.includes("Code5")) {
                ivsAlert2('error', "خطا", "کابر متقاضی فقط می تواند شرکت ثبت شده از طرف خودش را ویرایش کند");
            }
            else {
                ivsAlert2('error', "خطا", "خطا در افزودن شرکت جدید");
            }

        },
        complete: function () {
            loading('submitBtn', false, true);
            resetForm('userForm');
        }
    });

}

async function PutUser() {
    var countErrors = 0;
    var roleIDS = [];
    roleIDS = $("#inviteUserSesstion").val();
    var countErrors = 0;



    let userForm = document.getElementById('userForm');
    if (!$("#userForm").valid()) {
        countErrors++;
        userForm.classList.add('was-validated');
    }

    if (countErrors > 0) {
        return;
    }
    var companyDto = {
        id: $("#id").val(),
        companyGroupIDs: roleIDS,
        nationalCode: $("#nationalCodeID").val(),
        financialCode: $("#financialCode").val(),
        name: $("#name").val(),
        registrationCode: $("#registrationCode").val(),
        isThirdParty: $('#isThirdParty').is(":checked"),
        companyOwnershipTypeID: $("#companyOwnershipTypeID").val(),
        registrationLocation: $("#registrationLocation").val(),
        initiationDate: moment($("#initiationDate").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
        registrationDate: moment($("#registrationDate").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
        companyTypeID: $('#companyTypeID').val()

    }


    loading('EditBtnFinal', true, true);
    $.ajax({
        type: "PUT",
        url: "/api/Company/Put",
        data: JSON.stringify(companyDto),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {
            loading('EditBtnFinal', false, true);
            ivsAlert2('success', "موفقیت", "شرکت انتخاب شده ویرایش شد");
            $('#create_edit').modal('hide');
            UserDataTable.rows().deselect();
            UserDataTable.ajax.reload();
        },

        error: function (response) {

            loading('EditBtnFinal', false, true);
            $('#create_edit').modal('hide');


            if (response.responseText.includes("Code1")) {
                ivsAlert2('error', "خطا", "کد مالی وارد شده تکراری میباشد");
            }
            else if (response.responseText.includes("service_exception_code:1018")) {
                ivsAlert2('warning', "اخطار", "این شرکت امکان حذفش وجود ندارد زیرا برای آن یک یا چند طرح ثبت شده است ");
            }
            else if (response.responseText.includes("service_exception_code:1019")) {
                ivsAlert2('warning', "اخطار", "شما امکان خارج کردن این شرکت از ماهیت شخص ثالث را ندارید زیرا افرادی در حال حاضر عضو این شرکت به عنوان کاربر های این شرکت شخص ثالث میباشند");
            }
            else if (response.responseText.includes("service_exception_code:1020")) {
                ivsAlert2('warning', "اخطار", "این شرکت توسط کاربر معمولی ساخته شده است و امکان تخصیص هیچ نوع ماهیت نظارتی به آن وجود ندارد");
            }
            else if (response.responseText.includes("Code2")) {
                ivsAlert2('error', "خطا", "شناسه ملی شرکت تکراری میباشد");
            }
            else if (response.responseText.includes("Code3")) {
                ivsAlert2('error', "خطا", "کد ثبت نامی شرکت تکراری میباشد");
            }
            else if (response.responseText.includes("Code4")) {
                ivsAlert2('error', "خطا", "شناسه ملی شرکت را وارد نکرده اید");
            }
            else if (response.responseText.includes("Code5")) {
                ivsAlert2('error', "خطای دسترسی", "کابر متقاضی فقط می تواند شرکت ثبت شده از طرف خودش را ویرایش کند");
            }
            else if (response.responseText.includes("Code6")) {
                ivsAlert2('error', "خطا", "شرکت مورد نظر با شناسه ملی وارد شده یافت نشد");
            }
            else {
                ivsAlert2('error', "خطا", "خطا در ویرایش شرکت ");
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

    bootbox.confirm("آیا از حذف این کمپانی اطمینان دارید؟", function (a) {
        if (a) {
            loading('deleteRoleBtn', true, true);
            $('#userID').val(currentRow.id);
            if (currentRow == undefined || currentRow == null) {
                ivsAlert2('error', "خطا", "خطا در حذف شرکت");
                return;
            }
            $.ajax({
                type: "delete",
                url: "/api/Company/Delete?id=" + currentRow.id,
                contentType: 'application/json',
                success: function (result) {
                    loading('deleteRoleBtn', false, true);
                    ivsAlert2('success', "موفقیت", "شرکت با موفقیت حدف شد");

                },
                error: function (ex, cc, bb) {
                    loading('deleteRoleBtn', false, true);

                    if (ex.responseText.includes("Code1")) {
                        ivsAlert2('warning', "اخطار", "این شرکت امکان حذفش وجود ندارد زیرا برای ان یک یا چند طرح ثبت شده است ");
                    }
                    else if (ex.responseText.includes("Code2")) {
                        ivsAlert2('warning', "اخطار", "امکن حذف این شرکت وجود ندارد , زیرا افرادی زیر مجموعه این شرکت وجود دارد . برای حذف این شرکت ابتدا باید کابر های مربوط به این شرکت را حذف کنید");
                    }
                    else {
                        ivsAlert2('error', "خطا", "خطا در حذف کاربر ");
                    }

                },
                complete: function (jqXHR) {
                    UserDataTable.rows().deselect();
                    UserDataTable.ajax.reload();
                }
            });
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


function GetAllCompanyType() {
    $.ajax({
        type: "get",
        url: "/api/Company/GetAllCompanyTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiCompanyType(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert(' اشکال در برقراری ارتباط با سرور بخش دریافت نوع شرکت ها', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}

function createUiCompanyType(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let roleNameSelected = document.getElementById('companyTypeID');
    if (roleNameSelected != undefined) {
        roleNameSelected.innerHTML += template;
    }
}


function GetAllCompanyOwnerShipType() {
    $.ajax({
        type: "get",
        url: "/api/Company/GetAllCompanyOwnershipTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiCompanyOwnerShipType(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert(' اشکال در برقراری ارتباط با سرور بخش دریافت نوع مالکیت شرکت ها', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}

function createUiCompanyOwnerShipType(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let roleNameSelected = document.getElementById('companyOwnershipTypeID');
    if (roleNameSelected != undefined) {
        roleNameSelected.innerHTML += template;
    }
}

function loadInviteUser() {

    $.ajax({
        type: "get",
        url: "/api/Company/GetAllCompanyGroups",
        success: function (result) {
            if (result.length > 0) {
                $("#inviteUserSesstion").html("");
                ss = "";
                for (var i = 0; i < result.length; i++) {
                    var str = `
                    <option value="${result[i].id}">${result[i].name} </option>
                `;
                    ss += str;
                }
                $("#inviteUserSesstion").html(ss);
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش اتاق جلسات ', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }
    });
}

function loadInviteUserEdit(resultSelected) {
    $.ajax({
        type: "get",
        url: "/api/Company/GetAllCompanyGroups",
        success: function (result) {
            if (result.length > 0) {
                $("#inviteUserSesstion").html("");
                ss = "";

                for (var i = 0; i < result.length; i++) {
                    var str = "";
                    if (resultSelected.includes(String(result[i].id))) {
                        str = `
                            <option selected value="${result[i].id}">${result[i].name}</option>
                            `;
                    }
                    else {
                        str = `
                        <option value="${result[i].id}">${result[i].name}</option>
                    `;
                    }

                    ss += str;
                }
                $("#inviteUserSesstion").html(ss);
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش دریافت نقش ها ', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }
    });
}




