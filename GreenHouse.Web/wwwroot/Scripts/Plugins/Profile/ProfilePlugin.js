(function ($) {

    $.fn.userProfilePlugin = function (options) {
        var settings = $.extend({
            userID: "",
            getAllMessageApiAddress: "/api/User/GetUserInformationForProfile",
            postChangePasswordAddress: "/api/UserManagement/ChangePasswordForMySelf",
            getActionableandViewableAddress: "/api/User/GetActionableAndViewbleColoumn",
            putChangeProfileInformation: "/api/User/ChangeProfileInformation",
            hastemplate: false
        }, options);

        var area = this;
        /*      var forms = document.querySelectorAll('.needs-validation');*/

        buildInterface();

        async function buildInterface() {
            if (settings.hastemplate) {
                area.html(getTemplate)
            }
            await GetActionableAndViewbleColoumn();
            await GertUserProfileInfo();

        }

        async function GetActionableAndViewbleColoumn() {
            var roleName = area.find("#roleName").val();

            $.ajax({
                type: "get",
                async: false,
                url: settings.getActionableandViewableAddress + "?roleName=" + roleName,
                success: function (result) {
                    $.each(result, function (a, b) {

                        if (b.viewable == true) {
                            $('#head_' + b.coloumnName).show();
                            //.css('display', 'show');
                            $('#' + b.coloumnName).attr('disabled', true);
                        }
                        else if (b.actionable) {
                            $('#head_' + b.coloumnName).show();
                            //.css('display', 'show');
                        }
                        //else {
                        /* $('#head_' + a.columnName).css('display', 'show');*/
                        //}

                    })
                },

                error: function (ex, cc, bb) {
                    if (ex.status == 401) {
                        ivsAlert("توکن شما اکسپایر شده است مجدد وارد شوید");
                    }
                    else {

                    }
                    ivsAlert('اشکال در برقراری ارتباط با سرور -   بخش دریافت ستون های قابل نمایش', 'خطا', 'error');
                }

            });
        }

        async function GertUserProfileInfo() {

            var userID = area.find("#userID").val();

            $.ajax({
                type: "get",
                async: false,
                url: settings.getAllMessageApiAddress + "?userID=" + userID,
                success: function (result) {
                    $("#FirstName").val(result.firstName);
                    $("#LastName").val(result.lastName);
                    $("#Email").val(result.email);

                    $("#PhoneNumber").val(result.phoneNumber);
                    $("#DepartmentName").text(result.departmentName);
                    $("#CompanyName").text(result.companyName);
                    $("#CompanyNationalID").text(result.companyNationalID);
                    //Financial
                    $("#FarzinCreatorID").text(result.farzinCreatorID);
                    $("#FarzinUserName").text(result.farzinUserName);
                    $("#FarzinCreatorRoleID").text(result.farzinCreatorRoleID);


                    $("#fullName").text(result.fullName);
                    $("#roleUser").text(result.roleName);
                    $("#NationalCodeID").text(result.nationalCodeId);

                },
                error: function (ex, cc, bb) {
                    if (ex.status == 401) {
                        ivsAlert("توکن شما اکسپایر شده است مجدد وارد شوید", "UnAuthorized");
                    }
                    else {
                        ivsAlert('اشکال در برقراری ارتباط با سرور -   بخش دریافت اطلاعات کاربر', 'خطا', 'error');
                    }

                }

            });

        }

        area.find("#ModalForChangePassword").click(function () {
            $('#change_password .modal-title').html("تغییر رمز عبور کاربری");
            $('#change_password').modal('show');
        });

        $("#submitChangePasswordBtn").click(function () {
            let formStep4 = document.getElementById('changePasswoedForm');
            if (!$("#changePasswoedForm").valid()) {
                formStep4.classList.add('was-validated');
                return;
            }
            else {
                ChangePassword();
            }
        });

        async function ChangePassword() {

            loading('submitChangePasswordBtn', true, false);
            var changePasswordDto = {
                UserID: area.find("#userID").val(),
                OldPassword: $("#OldPassword").val(),
                NewPassword: $("#NewPassword").val(),
                RepeatNewPassword: $("#RepeatPassword").val()
            }

            $.ajax({
                type: "POST",
                url: settings.postChangePasswordAddress,
                data: JSON.stringify(changePasswordDto),
                contentType: "application/json; charset=utf-8",

                success: async function (response) {
                    ivsAlert2('success', "موفقیت", "رمز عبور شما با موفقیت ویرایش شد");
                    $('#change_password').modal('hide');
                },

                error: function (response) {
                    if (response.status == 401) {
                        ivsAlert("توکن شما اکسپایر شده است مجدد وارد شوید", "UnAuthorized");
                    }
                    if (response.responseText.includes("Code2")) {
                        ivsAlert2('warning', "خطا", "پسور فعلی خود را به درستی وارد نکرده اید");
                    }
                    else if (response.responseText.includes("Code1")) {
                        ivsAlert2('warning', "خطا", "رمز عبور و تکرار رمز عبور با هم همخوانی ندارد");
                    }
                    else if (response.responseText.includes("Code3")) {
                        ivsAlert2('warning', "خطا", response.responseText);
                    }
                    else {
                        ivsAlert2('error', "خطا", "خطا در تغییر رمز عبور");
                    }

                },
                complete: function () {
                    loading('submitChangePasswordBtn', false, false);
                    $('#change_password').modal('hide');
                    resetForm('changePasswoedForm');
                }
            });
        }

        $("#submitChangeProfileInformationBtn").click(function () {
            ChangeProfileInformation();
        });

        function ChangeProfileInformation() {
            var countErrors = 0;

            if (area.find("#FirstName").val() == "") {
                countErrors++;
                area.find("#FirstName").addClass("errorInput");
                area.find("#FirstName").removeClass("successInput");
                area.find("#FirstNameError").text("لطفا نام خود را وارد نمایید");
            }
            else {
                area.find("#FirstName").removeClass("errorInput");
                area.find("#FirstName").addClass("successInput");
                area.find("#FirstNameError").text("");
            }

            if (area.find("#LastName").val() == "") {
                countErrors++;
                area.find("#LastName").addClass("errorInput");
                area.find("#LastName").removeClass("successInput");
                area.find("#LastNameError").text("لطفا نام خانوادگی خود را وارد نمایید");
            }
            else {
                area.find("#LastName").removeClass("errorInput");
                area.find("#LastName").addClass("successInput");
                area.find("#LastNameError").text("");
            }

            if (area.find("#Email").val() == "") {
                countErrors++;
                area.find("#Email").addClass("errorInput");
                area.find("#Email").removeClass("successInput");
                area.find("#EmailError").text("لطفا ایمیل خود را وارد کنید");
            }
            else {
                area.find("#Email").removeClass("errorInput");
                area.find("#Email").addClass("successInput");
                area.find("#EmailError").text("");
            }


            if (countErrors > 0) {
                return false;
            }

            bootbox.confirm("ایا از تغییر اطلاعات خود اطمینان دارید؟", function (a) {
                if (a) {
                    loading('submitChangeProfileInformationBtn', true, false);
                    var ChangeProfileInformationDto = {
                        ID: area.find("#userID").val(),
                        firstName: area.find("#FirstName").val(),
                        lastName: area.find("#LastName").val(),
                        email: area.find("#Email").val(),
                        phoneNumber: area.find("#PhoneNumber").val()
                    }
                    $.ajax({
                        type: "PUT",
                        url: settings.putChangeProfileInformation,
                        data: JSON.stringify(ChangeProfileInformationDto),
                        contentType: "application/json; charset=utf-8",

                        success: async function (response) {
                            ivsAlert2('success', "موفقیت", "اطلاعات شما با موفقیت ویرایش شد");
                        },

                        error: function (response) {
                            if (response.status == 401) {
                                ivsAlert("توکن شما اکسپایر شده است مجدد وارد شوید", "UnAuthorized");
                            }
                            if (response.responseText.includes("Code1")) {
                                ivsAlert2('error', "خطا", "شماره موبایل وارد شده تکراری میباشد");
                            }
                            else if (response.responseText.includes("Code2")) {
                                ivsAlert2('error', "خطا", "ایمیل وارد شده تکراری میباشد");
                            }
                            else if (response.responseText.includes("Code3")) {
                                ivsAlert2('error', "خطا", "نام خود را وارد نمایید");
                            }
                            else if (response.responseText.includes("Code4")) {
                                ivsAlert2('error', "خطا", "نام خانوادگی خود را وارد نمایید");
                            }
                            else if (response.responseText.includes("Code5")) {
                                ivsAlert2('error', "خطا", "شماره همراه وارد شده معتبر نمیباشد");
                            }
                            else if (response.responseText.includes("Code6")) {
                                ivsAlert2('error', "خطا", "ایمیل وارد شده معتبر نمیباشد");
                            }
                            else {
                                ivsAlert2('error', "خطا", "خطا در ویرایش اطلاعات شما");
                            }
                        },
                        complete: function () {
                            loading('submitChangeProfileInformationBtn', false, false);
                        }
                    });
                }
            });
        }

        $("#btn-add-doc").click(function () {
            addProfilePhoto();
        });

        function addProfilePhoto() {

            $("#des-Doc").addClass("successInput");

            var countErrors = 0;



            if ($("#file-doc").val() == "" || $("#file-doc").val() == null) {
                countErrors++;
                $("#file-doc").addClass("errorInput");
                $("#file-doc").removeClass("successInput");
                $("#file-Doc-error").text("لطفا ابـتدا یک فایل با فرمت خواسته شده وارد کنید");
            }
            else {
                $("#file-doc").removeClass("errorInput");
                $("#file-doc").addClass("successInput");
                $("#file-Doc-error").text("");
            }

            var checkTypeFile = checkTypeFiles($("#file-doc").val());

            if (!checkTypeFile) {
                countErrors++;
                $("#file-doc").addClass("errorInput");
                $("#file-doc").removeClass("successInput");
                $("#file-Doc-error").text("فرمت وارد شده معتبر نمی باشد");
                ivsAlert2("error", "پیام خطا", `فرمت فایل وارد شده معتبر نمی باشد. فرمت های معتبر {png,jpgjpeg} می باشند.`);
                return false;
            }

            if (countErrors > 0) {
                return;
            }

            loading('btn-add-doc', true, true);

            var getMax = 1024;
            var filedoc = document.getElementById('file-doc');
            var fileSize = filedoc.size;

            if (fileSize > getMax) {
                ivsAlert2("error", "پیام خطا", `حجم فایل آپلود شده بیش از حد مجاز است. حد مجاز برابر ${getMax} بایت میباشد `);
                return false;
            }

            var model = new FormData();
            model.append("file", $("#file-doc")[0].files[0]);

            $.ajax({
                type: "post",
                url: "/api/User/UploadProfilePhoto",
                //dataType: "json",
                data: model,
                processData: false,
                contentType: false,
                success: function (result) {
                    ////console.log(result);
                    //var infoDoc = {
                    //    fileID: result,
                    //}
                    loading('btn-add-doc', false, true);
                    //debugger;
                    ivsAlert('عکس شما با موفقیت آپلود شد', 'موفقیت', 'success');
                },
                error: function (ex, cc, bb) {
                    if (ex.status == 401) {
                        ivsAlert("توکن شما اکسپایر شده است مجدد وارد شوید", "UnAuthorized");
                    }
                    else if (ex.responseText.includes("Code1")) {
                        ivsAlert("نوع فایل وارد شده معتبر نمیباشد", 'خطا', "error");
                    }
                    else if (ex.responseText.includes("Code2")) {
                        ivsAlert("حجم فایل شما باید کمتر از یک مگابایت باشد", 'خطا', "error");
                    }
                    else {
                        ivsAlert("خطا در برقراری ارتباط با سرور", 'خطا', "error");
                    }
                    //console.log(ex);
                    //console.log(bb);
                    loading('btn-add-doc', false, true);

                }

            });
        }

        function checkTypeFiles(fileName) {
            let validFileTypes = getValidFileTypes();

            let typeFile = fileName.split('.').pop();
            typeFile = typeFile.toLowerCase();

            let result = validFileTypes.toLowerCase().includes(typeFile);

            return result;
        }

        function getValidFileTypes() {
            return 'png,jpg,jpeg';
        }

        function getTemplate() {
            //var ss = ` `;
            //ss = minifyHtml(ss);
            //return ss;
        }

        return;
    }
}(jQuery));