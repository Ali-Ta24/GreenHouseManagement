var MAX_ADD_LIST = 15;
var STEP_ONE_VALID = false;
var STEP_TWO_VALID = false;
var STEP_THREE_VALID = false;
var STEP_FOUR_VALID = false;
var MAX_PERCENTAGE_REMAINIG_SHARE = 100;
var elm1S1Old;
var elm2S1Old;
var elm3S1Old;
var elm4S1Old;
var elm5S1Old;
var elm6S1Old;
var elm7S1Old;
var elm1S1New;
var elm2S1New;
var elm3S1New;
var elm4S1New;
var elm5S1New;
var elm6S1New;
var elm7S1New;
var countStep0;
var givenCode = $("#companyNationalCodeID").val();
var CompanySituation = {};

let options = { year: 'numeric', month: 'long', day: 'numeric' };
let today = new Date().toLocaleDateString('fa-IR', options);
console.log(today);

var MAX_STEP_VALID = 0;


var listShareholders = [];
var listShareholdersServer = [];
var listShareholdersLatest = [];

var listBoardDirectors = [];
var listBoardDirectorsServer = [];
var listBoardDirectorsLatest = [];

var infomationCompany = {};
getAllCompanyTypes();
getAllCompanyOwnershipTypes();
GetAllEducationLevelTypes();
GetAllDirectorPositionTypes();
getMaxValidStep();

//Step show event
$("#smartwizard").on("showStep", function (e, anchorObject, stepNumber, stepDirection, stepPosition) {
    $("#prev-btn").removeClass('disabled');
    $("#next-btn").removeClass('disabled');
    $("#finish-btn").removeClass('disabled');

    if (stepPosition === 'first') {
        $("#prev-btn").addClass('disabled');
    } else if (stepPosition === 'last') {
        $("#next-btn").addClass('disabled');
    } else {
        $("#prev-btn").removeClass('disabled');
        $("#next-btn").removeClass('disabled');
    }

    if (stepNumber == 3) {
        $("#finish-btn").removeClass('disabled');
    }
    else {
        $("#finish-btn").addClass('disabled');

    }

});

$("#reset-btn").on("click", function () {
    // Reset wizard
    STEP_ONE_VALID = false;
    STEP_TWO_VALID = false;
    STEP_THREE_VALID = false;
    STEP_FOUR_VALID = false;
    MAX_STEP_VALID = 0;
    MAX_PERCENTAGE_REMAINIG_SHARE = 100;
    listShareholders = [];
    listShareholdersServer = [];
    listBoardDirectors = [];
    listBoardDirectorsServer = [];
    infomationCompany = {};
    CompanySituation = {};
    givenCode = "",

        $("#companyCode").removeClass("d-none");
    $("#companyDetails1").addClass("d-none");
    $("#tableStep3").find("tr:not(:first)").remove();
    $("#tableStep4").find("tr:not(:first)").remove();

    resetInputStep1();
    resetInputStep2();
    resetInputBoardDirector();
    resetInputShareholders();

    $('#smartwizard').smartWizard("reset");
    return true;
});
$("#prev-btn").on("click", function () {

    $('#smartwizard').smartWizard("prev");
    return true;
});
$("#next-btn").on("click", function (e) {

    Validation_NextStep(e)
    return true;
});
$("#finish-btn").on("click", async function (e) {

    let countError = 0;
    let textError = "";
    if (STEP_ONE_VALID == false) {
        countError++;
        textError += " گام اول: ابتدا شناسه شرکت را جهت بررسی وارد کنید.";
        textError += "<br/>";

    }
    if (jQuery.isEmptyObject(infomationCompany)) {
        countError++;
        textError += "  گام دوم: ابتدا اطالاعات شرکت را وارد کنید.";
        textError += "<br/>";

    }
    if (listShareholders.length <= 0) {
        countError++;
        textError += "  گام سوم: ابتدا سهام داران را وارد کنید.";
        textError += "<br/>";
    }
    if (listBoardDirectors.length <= 0) {
        countError++;
        textError += "  گام چهارم: ابتدا هئیت مدیره را وارد کنید.";
        textError += "<br/>";
    }
    if (countError < 0) {
        //console.log(textError);
        ivsAlert(textError, `${countError} خطا`, 'error');
        return;
    }
    else {

        //Validation_NextStep(e)
        if (STEP_FOUR_VALID) {
            if (!CheckValuesOfstep4HasChange(listBoardDirectorsLatest, listBoardDirectorsServer)) {
                var postStep4 = await PostStep4();
            }
            else {
                gotoFacilityRegistration();

                //ivsAlert("تمام مراحل ثبت اطلاعات شرکت با موفقیت تکمیل یافت تا لحظاتی دیگر به صفحه ثبت تسهیلات منتقل خواهید شد", "ثبت کامل اطلاعات شرکت");

                //await sleep(4000).then(() => {
                //    window.location = "/FacilityRegistration/Index";
                //});
            } //ivsAlert(`اطلاعات با موفقیت ثبت شد`, "پیام موفقیت", 'success');
        }
        else {
            MAX_STEP_VALID = 3;
            $('#smartwizard').smartWizard({
                selected: MAX_STEP_VALID,
                theme: 'dots',
                enableURLhash: 0,
                transition: {
                    animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                },
                toolbarSettings: {
                    toolbarPosition: 'none', // both bottom
                },

            });

            ivsAlert('لطفا در ابتدا حداقل یک عضو از هیئت مدیره را وارد کنید', 'خطا', 'error');
        }

    }
    return true;
});




async function Validation_NextStep(e) {

    let stepIndex = $('#smartwizard').smartWizard("getStepIndex");

    if (stepIndex == 3) {

        ///check valid step-4

        if (STEP_FOUR_VALID) {

            MAX_STEP_VALID = 3;
            if (!CheckValuesOfstep4HasChange(listBoardDirectorsLatest, listBoardDirectorsServer)) {
                var postStep4 = await PostStep4();
            }
            else {
                gotoFacilityRegistration();

                //ivsAlert("تمام مراحل ثبت اطلاعات شرکت با موفقیت تکمیل یافت تا لحظاتی دیگر به صفحه ثبت تسهیلات منتقل خواهید شد", "ثبت کامل اطلاعات شرکت");

                //await sleep(4000).then(() => {
                //    window.location = "/FacilityRegistration/Index";
                //});
            }

            return;
        }
        ivsAlert('لطفا در ابتدا حداقل یک عضو از هیئت مدیره را وارد کنید', 'خطا', 'error');

    }
    else if (stepIndex == 2) {
        ///check valid step-3

        if (STEP_THREE_VALID) {
            MAX_STEP_VALID = 3;
            if (MAX_PERCENTAGE_REMAINIG_SHARE != 0) {
                ivsAlert('مجموع درصد سهام داران برابر 100 درصد نمی باشد.', 'خطا', 'error');
                return;
            }

            if (!CheckValuesOfstep3HasChange(listShareholdersLatest, listShareholdersServer)) {

                var postStep3 = await PostStep3();
            }
            else
                $('#smartwizard').smartWizard("next");
            return;
        }
        ivsAlert('لطفا در ایتدا حداقل یک سهام دار وارد کنید', 'خطا', 'error');

    }

    else if (stepIndex == 1) {


        ///check valid step-2
        var vlidate2 = await validateStepTwo();

        if (STEP_TWO_VALID && vlidate2) {
            MAX_STEP_VALID = 2;

            elm1S1New = $("#telNumber1").val();

            elm2S1New = $("#faxNumber1").val();

            elm3S1New = $("#postalCode").val();

            elm4S1New = $("#website").val();

            elm5S1New = $("#email").val();

            elm6S1New = $("#centralOfficeAddress").val();

            elm7S1New = $("#activeLocationAddress").val();

            if (CheckValuesOfstep2HasChange()) {
                var postStep2 = await PostStep2();
            }
            else
                $('#smartwizard').smartWizard("next");
            return;
        }
        ivsAlert('فیلد های اجباری را به صورت کامل وارد کنید', 'خطا', 'error');

    }
    else if (stepIndex == 0) {

        ///check valid step-1

        if (STEP_ONE_VALID) {

            var result = checkUserCompanyRegistered();
            //
            //if (result) {
            //    MAX_STEP_VALID = 1;

            //    $('#smartwizard').smartWizard("next");
            //}
            //else {
            //    var postStep1 = await PostStep1();
            //}

            return;
        }
        ivsAlert('ابتدا شناسه ملی شرکت را وارد و روی دکمه بررسی کلیک کنید.', 'خطا', 'error');

    }

}

/*checkUserCompanyRegistered();*/


function checkUserCompanyRegistered() {

    /*   var rtn;*/
    $.ajax({
        type: "get",
        async: false,
        url: "/api/Company/GetMyCompany",
        success: async function (result) {

            if (result.id == 0) {
                //console.log(result);
                //rtn == 0;
                var postStep1 = await PostStep1();
            }
            else {
                /*  rtn == 1;*/
                MAX_STEP_VALID = 1;

                $('#smartwizard').smartWizard("next");
            }

        },
        error: function (ex, cc, bb) {
            //console.log(ex);
            ////console.log("--------------------");
            //console.log(cc);
            ////console.log("--------------------");
            //console.log(bb);
            ////console.log("--------------------");
            if (bb == 'Unauthorized') {
                ivsAlert('شما دسترسی لازم برای مشاهده اطلاعات شرکت های دیگر را ندارید', 'خطای دسترسی', 'error');
            } else if (ex.status == 500) {

                ivsAlert('در اجرای درخواست شما مشکلی پیش آمده است.', 'خطای داخلی', 'error');
            }
            else if (ex.status == '404') {

                ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            }
            /*      rtn == 0;*/
            /*   var postStep1 = await PostStep1();*/
        }
    });

    //

    //if (rtn == 0)
    //    return false;
    //else
    //    return true;
}
///step-1
function checkCompanyRegValidity() {
    loading('smartwizard', true, false);
    var givenCode = $("#companyNationalCodeEntered").val();
    $.ajax({
        type: "get",
        url: "/api/CompanyRegistration/CompanyValid?regCode=" + givenCode,
        success: function (result) {
            //console.log(result);
            if (result.isSuccess) {

                if (result.companyFound) {
                    STEP_ONE_VALID = true;
                    $("#companyDetails1").removeClass("d-none");
                    $("#companyCode").addClass("d-none");
                    $("#mainTabContents").css("height", "");

                    $("#companyName").prop('disabled', true);
                    $("#companyNationalCode").prop('disabled', true);
                    $("#companyRegCode").prop('disabled', true);
                    //$("#financialCode").prop('disabled', true);
                    $("#companyInitDate").prop('disabled', true);
                    $("#companyRegDate").prop('disabled', true);
                    $("#lastChangeDate").prop('disabled', true);
                    $("#breakUpDate").prop('disabled', true);
                    $("#bankRuptyDate").prop('disabled', true);

                    /* $("#companyType").prop('disabled', true);*/
                    //$("#registerLocation").prop('disabled', true);
                    //$("#ownershipType").prop('disabled', true);
                    //$("#companyRegLocation").prop('disabled', true);
                    $("#isbankRupt").prop('disabled', true);
                    $("#isbreakUp").prop('disabled', true);
                    $("#isSuspention").prop('disabled', true);
                    $("#isTaxRestricted").prop('disabled', true);
                    //$("#postalCode").prop('disabled', true);
                    $("#state").prop('disabled', true);
                    //$("#address").prop('disabled', true);

                    CompanySituation = result;
                    $("#companyName").val(result.companyName);
                    $("#companyNationalCode").val(result.companyNationalCode);
                    $("#companyRegCode").val(result.companyRegisterCode);
                    //$("#financialCode").val(result.financialCode);
                    //$("#companyRegLocation").val(result.companyRegisterLocation);
                    //$("#registerLocation").val(result.registerLocation);
                    $("#isbankRupt").val(setValueBoolean(result.isbankRupt));
                    $("#isbreakUp").val(setValueBoolean(result.isbreakUp));
                    $("#isSuspention").val(setValueBoolean(result.isSuspention));
                    $("#isTaxRestricted").val(setValueBoolean(result.isTaxRestricted));
                    //$("#postalCode").val(result.state);
                    $("#state").val(result.state);
                    //$("#address").val(result.address);
                    $("#lastChangeDate").val(getPerianDate(result.lastChangeDate));

                    //$("#companyType").val(result.companyNationalCode);
                    //$("#registerLocation").val(result.companyRegCode);
                    //$("#ownershipType").val(result.financialCode);

                    //$("#companyInitDate").val(new Date(result.companyInitDate).toLocaleDateString('fa-IR'));
                    $("#companyInitDate").val(getPerianDate(result.companyInitDate));
                    $("#companyRegDate").val(getPerianDate(result.companyRegisterDate));
                    $("#breakUpDate").val(getPerianDate(result.breakUpDate));
                    $("#bankRuptyDate").val(getPerianDate(result.bankRuptyDate));
                    //$('#companyRegDate').persianDatepicker({
                    //    'format': 'YYYY/MM/DD',
                    //    'autoclose': true,
                    //    showOtherMonths: true,
                    //    selectOtherMonths: true,
                    //});
                    //$('#companyInitDate').persianDatepicker({
                    //    'format': 'YYYY/MM/DD',
                    //    'autoclose': true,
                    //    showOtherMonths: true,
                    //    selectOtherMonths: true,
                    //});

                }
                else {
                    STEP_ONE_VALID = false;
                    ivsAlert('شرکتی متناظر با شناسه ملی وارد شده یافت نشد', 'شرکت یافت نشد', 'error');
                }
            } else {
                STEP_ONE_VALID = false;
                ivsAlert('امکان دریافت اطلاعات از سامانه سازمان ثبت وجود ندارد', 'اشکال در دریافت اطلاعات شرکت', 'error');
            }
        },
        error: function (ex, cc, bb) {

            //console.log(ex);
            //console.log("--------------------");
            //console.log(cc);
            //console.log("--------------------");
            //console.log(bb);
            //console.log("--------------------");
            if (bb == 'Unauthorized') {
                STEP_ONE_VALID = false;
                ivsAlert('شما دسترسی لازم برای مشاهده اطلاعات شرکت های دیگر را ندارید', 'خطای دسترسی', 'error');
            }
            else if (ex.responseText.includes('Sazman Sabt Service Not Available')) {
                STEP_ONE_VALID = false;
                ivsAlert('سازمان ثبت برای دریافت اطلاعات در دسترس نمیباشد', 'خطای دسترسی', 'error');
            }
            else if (ex.status == 404) {
                STEP_ONE_VALID = false;
                ivsAlert('هیچ اطلاعاتی برای کد ملی وارد شده یافت نشد', 'خطای دسترسی', 'error');
            }
            else {
                STEP_ONE_VALID = false;
                ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            }
        },

        complete: function () {
            loading('smartwizard', false, false);
        }
    });

}


function resetInputStep1() {
    $("#companyNationalCodeEntered").val("");
    $("#companyName").val("");
    $("#companyNationalCode").val("");
    $("#companyRegCode").val("");
    //$("#financialCode").val("");
    $("#companyInitDate").val("");
    $("#companyRegDate").val("");
    $("#lastChangeDate").val("");
    //$("#postalCode").val("");
    $("#state").val("");
    $("#address").val("");
    $("#isbankRupt").val("");
    $("#isbreakUp").val("");
    $("#isSuspention").val("");
    $("#isTaxRestricted").val("");
    //document.getElementById("companyType").selectedIndex = "0";
    //$("#registerLocation").val("");
    //document.getElementById("ownershipType").selectedIndex = "0";

}

///step-2
function validateStepTwo() {

    let formStep2 = document.getElementById('formStep2');
    if (!$("#formStep2").valid()) {
        formStep2.classList.add('was-validated');
        return false;
    }
    STEP_TWO_VALID = true;
    infomationCompany = {


        phoneNumber: $("#telNumber1").val(),
        fax: $("#faxNumber1").val(),
        /*   ForeignPartner: $("#ForeignPartner").val(),*/
        PostalCode: $("#postalCode").val(),
        email: $("#email").val(),
        centerOffice: $("#centralOfficeAddress").val(),
        activeLocation: $("#activeLocationAddress").val(),
    }
    //console.log(infomationCompany);
    return true;
}

function resetInputStep2() {
    $("#telNumber1").val("");
    $("#faxNumber1").val("");
    //document.getElementById("ForeignPartner").selectedIndex = "0";
    $("#postalCode").val("");
    $("#email").val("");
    $("#centralOfficeAddress").val("");
    $("#activeLocationAddress").val("");
}

///step-3
function addShareholder() {


    if (listShareholders.length == MAX_ADD_LIST) {
        ivsAlert('امکان افزودن سهامدار وجود ندارد. شما حداکثر 15 سهامدار می توانید وارد کنید.', 'خطا', 'error');
        return;
    }

    let formStep3 = document.getElementById('formStep3');
    if (!$("#formStep3").valid()) {
        formStep3.classList.add('was-validated');
        return;
    }

    let shareholder = {};

    if (MAX_PERCENTAGE_REMAINIG_SHARE == 0) {
        ivsAlert(`امکان افزودن سهامدار وجود ندارد زیرا 100 درصد سهام تخصیص داده شده است.`, 'خطا', 'error');
        return;
    }

    if ($("#shareholderShare").val() > MAX_PERCENTAGE_REMAINIG_SHARE + 1) {
        ivsAlert(`مجموع درصد سهم سهامداران نمیتواند بیشتر از 100 درصد باشد، درصد باقی مانده ${MAX_PERCENTAGE_REMAINIG_SHARE} است.`, 'خطا', 'error');
        return;
    }

    if (listShareholders.filter((c) => c.nationalCode == $("#shareholderNationalCode").val()).length > 0) {
        ivsAlert(`کد ملی وارد شده تکراری می باشد`, 'خطا', 'error');
        return;
    }

    var tempNationalCodeShareholder = $("#shareholderNationalCode").val();
    var temptypePerson = $("#typePersonShareholder").val();


    if (temptypePerson == 1 && tempNationalCodeShareholder.length != 11) {
        ivsAlert(`کد ملی حقوقی باید 11 رقم باشد`, 'خطا', 'error');
        return;
    }
    if (temptypePerson == 2 && tempNationalCodeShareholder.length != 10) {
        ivsAlert(`کد ملی حقیقی باید 10 رقم باشد`, 'خطا', 'error');
        return;
    }

    if (temptypePerson == 2 && checkCodeMeli(tempNationalCodeShareholder) == false) {
        ivsAlert(`کد ملی وارد شده معتبر نمی باشد`, 'خطا', 'error');
        return;
    }


    MAX_PERCENTAGE_REMAINIG_SHARE = parseFloat(parseFloat(MAX_PERCENTAGE_REMAINIG_SHARE) - parseFloat($("#shareholderShare").val()));


    STEP_THREE_VALID = true;

    shareholder = {
        id: (listShareholders.length + 1) + (Math.floor(Math.random() * 10000) + 1),
        fullName: $("#shareholderName").val(),
        nationalCode: $("#shareholderNationalCode").val(),
        percentageOfPersonShare: $("#shareholderShare").val(),
        shareholderTypeID: $("#typePersonShareholder").val(),
    }
    shareholderServer = {
        fullName: $("#shareholderName").val(),
        nationalCode: $("#shareholderNationalCode").val(),
        percentageOfPersonShare: $("#shareholderShare").val(),
        shareholderTypeID: $("#typePersonShareholder").val(),
    }

    listShareholders.push(shareholder);
    listShareholdersServer.push(shareholderServer)
    resetInputShareholders();

    let tableStep3 = document.getElementById("tableStep3");
    let rowTable = tableStep3.insertRow();
    var textTypePersonShareholder = $('#typePersonShareholder').find(":selected").text();

    var cellTable = rowTable.insertCell();
    cellTable.innerHTML = shareholder.fullName;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = shareholder.nationalCode;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = shareholder.percentageOfPersonShare;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = textTypePersonShareholder;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = `<i class="lni lni-trash" onclick="deleteShareholder(${shareholder.id})" style="cursor:pointer; font-size:24px;color:red"></i>`;

}

function deleteShareholder(id) {

    const indexOfObject = listShareholders.findIndex(object => {
        return object.id === id;
    });

    const deleteShareholder = listShareholders.find(obj => obj.id === id);
    MAX_PERCENTAGE_REMAINIG_SHARE += parseFloat(deleteShareholder.percentageOfPersonShare);


    //console.log(indexOfObject);
    listShareholders.splice(indexOfObject, 1);
    listShareholdersServer.splice(indexOfObject, 1);

    $("#tableStep3").on('click', '.lni-trash', function () {
        $(this).closest('tr').remove();

    });

    if (listShareholders.length == 0) {

        STEP_THREE_VALID = false;
    }
}

function resetInputShareholders() {

    $("#shareholderName").val("");
    $("#shareholderNationalCode").val("");
    $("#shareholderShare").val("");
    $("#shareMoney").val("");
}


///step-4
function addBoardDirector() {

    var inputPositionType = $("#BoardDirectorsPosition").val();
    //console.log("BoardDirectorsPosition");
    if (listBoardDirectors.length == MAX_ADD_LIST) {
        ivsAlert('امکان افزودن هئیت مدیره وجود ندارد. شما حداکثر 15 هئیت مدیره می توانید وارد کنید.', 'خطا', 'error');
        return;
    }

    let formStep4 = document.getElementById('formStep4');
    if (!$("#formStep4").valid()) {
        formStep4.classList.add('was-validated');
        return;
    }

    if (listBoardDirectors.length > 0) {

        var checkPostionCEO = listBoardDirectors.filter((bd) => {
            if (parseInt(bd.directorPositionTypeID) === 2)
                return bd;

        })
        var checkPostionBOSS = listBoardDirectors.filter((bd) => {
            if (parseInt(bd.directorPositionTypeID) === 3)
                return bd;

        })
        var checkPostionASSITANTBOSS = listBoardDirectors.filter((bd) => {
            if (parseInt(bd.directorPositionTypeID) === 4)
                return bd;
        })

        //var checkPostionCEO = listBoardDirectors.filter((bd) => {
        //    return bd.directorPositionTypeID.includes(2);
        //})
        //var checkPostionBOSS = listBoardDirectors.filter((bd) => {
        //    return bd.directorPositionTypeID.includes(3);
        //})
        //var checkPostionASSITANTBOSS = listBoardDirectors.filter((bd) => {
        //    return bd.directorPositionTypeID.includes(4);
        //})
        //console.log(checkPostionCEO);
        //console.log(checkPostionBOSS);
        //console.log(checkPostionASSITANTBOSS);



        if (listBoardDirectors.filter((c) => c.nationalCode == $("#BoardDirectorsNationalCode").val()).length > 0) {
            ivsAlert(`شناسه ملی وارد شده تکراری می باشد`, 'خطا', 'error');
            return;
        }

        if (checkPostionCEO.length >= 1 && checkPostionCEO.filter(setDirectorPositionTypeIdFromInput).length > 0) {
            ivsAlert('امکان افزودن مدیرعامل وجود ندارد زیرا یک مدیر عامل ثبت شده است', 'خطا', 'error');

            return;
        }
        if (checkPostionBOSS.length >= 1 && checkPostionBOSS.filter(setDirectorPositionTypeIdFromInput).length > 0) {
            ivsAlert('امکان افزودن رئیس هیئت مدیره وجود ندارد زیرا یک رئیس هیئت مدیره ثبت شده است', 'خطا', 'error');

            return;
        }
        if (checkPostionASSITANTBOSS.length >= 1 && checkPostionASSITANTBOSS.filter(setDirectorPositionTypeIdFromInput).length > 0) {
            ivsAlert('امکان افزودن نائب رئیس هیئت مدیره وجود ندارد زیرا یک نائب رئیس هیئت مدیره ثبت شده است', 'خطا', 'error');

            return;
        }

    }

    let boardDirector = {};

    STEP_FOUR_VALID = true;

    boardDirector = {
        id: (listBoardDirectors.length + 1) + (Math.floor(Math.random() * 10000) + 1),
        fullName: $("#BoardDirectorsName").val(),
        nationalCode: $("#BoardDirectorsNationalCode").val(),
        birthDay: $("#BoardDirectorsBirthday").val(),
        directorPositionTypeID: $("#BoardDirectorsPosition").val(),
        expiryDateOfPosition: $("#ExpirationPosition").val(),
        educationLevelTypeID: $("#degreeEducationBoardDirectors").val(),

    }

    boardDirectorServer = {
        fullName: $("#BoardDirectorsName").val(),
        nationalCode: $("#BoardDirectorsNationalCode").val(),
        //birthDay: shamsiTomiladi($("#BoardDirectorsBirthday").val()),
        directorPositionTypeID: $("#BoardDirectorsPosition").val(),
        //expiryDateOfPosition: shamsiTomiladi($("#ExpirationPosition").val()),
        educationLevelTypeID: $("#degreeEducationBoardDirectors").val(),

    }
    if ($("#BoardDirectorsBirthday").val() == '') {
        boardDirectorServer.birthDay = $("#BoardDirectorsBirthday").val();
    }
    else {
        boardDirectorServer.birthDay = shamsiTomiladi($("#BoardDirectorsBirthday").val());
    }

    if ($("#ExpirationPosition").val() == '') {
        boardDirectorServer.expiryDateOfPosition = $("#ExpirationPosition").val();
    }
    else {
        boardDirectorServer.expiryDateOfPosition = shamsiTomiladi($("#ExpirationPosition").val());
    }

    listBoardDirectors.push(boardDirector);
    listBoardDirectorsServer.push(boardDirectorServer);


    var textBoardDirectorsPosition = $('#BoardDirectorsPosition').find(":selected").text();
    var textDegreeEducationBoardDirectors = $('#degreeEducationBoardDirectors').find(":selected").text();

    //if ($("#BoardDirectorsPosition option:selected").data("single") == '1') {
    //    $("#BoardDirectorsPosition option:selected").attr('disabled', 'disabled')
    //        .siblings().removeAttr('disabled');
    //}
    resetInputBoardDirector();

    let tableStep4 = document.getElementById("tableStep4");
    let rowTable = tableStep4.insertRow();

    var cellTable = rowTable.insertCell();
    cellTable.innerHTML = boardDirector.fullName;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = boardDirector.nationalCode;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = boardDirector.birthDay;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = textBoardDirectorsPosition;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = boardDirector.expiryDateOfPosition;
    cellTable = rowTable.insertCell();
    cellTable.innerHTML = textDegreeEducationBoardDirectors;



    cellTable = rowTable.insertCell();
    cellTable.innerHTML = `<i class="lni lni-trash" onclick="deleteBoardDirector(${boardDirector.id})" style="cursor:pointer; font-size:24px;color:red"></i>`;




    //console.log(listBoardDirectors);
}

function setDirectorPositionTypeIdFromInput(a) {
    var inputPositionType = $("#BoardDirectorsPosition").val();

    return a.directorPositionTypeID == inputPositionType
}

function deleteBoardDirector(id) {


    const indexOfObject = listBoardDirectors.findIndex(object => {
        return object.id === id;
    });



    //console.log(indexOfObject);
    listBoardDirectors.splice(indexOfObject, 1);
    listBoardDirectorsServer.splice(indexOfObject, 1);

    $("#tableStep4").on('click', '.lni-trash', function () {
        $(this).closest('tr').remove();
    });
    if (listBoardDirectors.length == 0) {
        STEP_FOUR_VALID = false;
    }

}

function resetInputBoardDirector() {

    $("#BoardDirectorsName").val("");
    $("#BoardDirectorsNationalCode").val("");
    $("#BoardDirectorsBirthday").val("");

    document.getElementById("BoardDirectorsPosition").selectedIndex = "0";

    $("#ExpirationPosition").val("");

    document.getElementById("degreeEducationBoardDirectors").selectedIndex = "3";

    $("#WorkExperienceBoardDirectors").val("");
}


$('#BoardDirectorsBirthday').persianDatepicker({
    'format': 'YYYY/MM/DD',
    'autoclose': true,
    //maxDate: new persianDate().valueOf(),
    //minDate: new persianDate().subtract('day', 0).valueOf(),
    showOtherMonths: true,
    selectOtherMonths: true,

});
$('#ExpirationPosition').persianDatepicker({
    'format': 'YYYY/MM/DD',
    'autoclose': true,
    showOtherMonths: true,
    selectOtherMonths: true,

});

// Fetch all the forms we want to apply custom Bootstrap validation styles to
var forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {

            if (!form.checkValidity()) {

                event.preventDefault();
                event.stopPropagation();
            } else {
                event.stopPropagation();
                event.preventDefault();
                //console.log(event.submitter);
                if ($(event.submitter)[0].id == "checkRegCode")
                    checkCompanyRegValidity();
            }
            form.classList.add('was-validated')
        }, false)
    });


$("#btnAlert").on("click", function () {

    //var myAlert = document.getElementById('alertProvider')
    ivsAlert('سلام', 'خطا', 'success');

});
$("#btnAlert2").on("click", function () {

    //var myAlert = document.getElementById('alertProvider')
    ivsAlert('سلام', 'خطا', 'error');

});

async function getMaxValidStep() {

    var givenCode = $("#companyNationalCodeID").val();
    $.ajax({
        type: "get",
        async: false,
        url: "/api/CompanyState/GetLatestCompanyStateByNationalCodeID?nationalCode=" + givenCode,
        success: async function (result) {
            MAX_STEP_VALID = 1;

            await checkCompanyRegValidity();
            GetLatestForStep2();
        },
        error: function (ex, cc, bb) {

            MAX_STEP_VALID = 0;
            //ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            $('#smartwizard').smartWizard({
                selected: MAX_STEP_VALID,
                theme: 'dots',
                enableURLhash: 0,
                transition: {
                    animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                },
                toolbarSettings: {
                    toolbarPosition: 'none', // both bottom
                },

            });
            //console.log(ex);
            //console.log(bb);
        }

    });

}

function GetLatestForStep2() {

    var givenCode = $("#companyNationalCodeEntered").val();
    $.ajax({
        type: "get",
        url: "/api/CompanyContactInformation/GetLatestCompanyContactInformationByNationalCodeAsync?nationalCode=" + givenCode,
        success: function (result) {
            if (result != undefined) {
                if (result.telNumber1 != null) {

                    $("#telNumber1").val(result.telNumber1);
                    $("#faxNumber1").val(result.faxNumber1);
                    $("#postalCode").val(result.postalCode);
                    $("#website").val(result.website);
                    $("#email").val(result.email);
                    $("#centralOfficeAddress").val(result.centralOfficeAddress);
                    $("#activeLocationAddress").val(result.activeLocationAddress);


                    elm1S1Old = $("#telNumber1").val();
                    elm2S1Old = $("#faxNumber1").val();
                    elm3S1Old = $("#postalCode").val();
                    elm4S1Old = $("#website").val();
                    elm5S1Old = $("#email").val();
                    elm6S1Old = $("#centralOfficeAddress").val();
                    elm7S1Old = $("#activeLocationAddress").val();

                    MAX_STEP_VALID = 2;
                    GetLatestForStep3();
                }
                else {

                    MAX_STEP_VALID = 1;
                    $('#smartwizard').smartWizard({
                        selected: MAX_STEP_VALID,
                        theme: 'dots',
                        enableURLhash: 0,
                        transition: {
                            animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                        },
                        toolbarSettings: {
                            toolbarPosition: 'none', // both bottom
                        },

                    });
                    return
                }
            }
            else {
                MAX_STEP_VALID = 1;
                $('#smartwizard').smartWizard({
                    selected: MAX_STEP_VALID,
                    theme: 'dots',
                    enableURLhash: 0,
                    transition: {
                        animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                    },
                    toolbarSettings: {
                        toolbarPosition: 'none', // both bottom
                    },

                });
                return
            }

        },
        error: function (ex, cc, bb) {

            MAX_STEP_VALID = 0;
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        }

    });

}

function JustgetMaxValidStep() {

    var givenCode = $("#companyNationalCodeID").val();
    $.ajax({
        type: "get",
        url: "/api/CompanyContactInformation/GetLatestCompanyContactInformationByNationalCodeAsync?nationalCode=" + givenCode,
        success: function (result) {
            if (result != null) {
                $("#telNumber1").val(result.telNumber1);
                $("#faxNumber1").val(result.faxNumber1);
                $("#postalCode").val(result.postalCode);
                $("#website").val(result.website);
                $("#email").val(result.email);
                $("#centralOfficeAddress").val(result.centralOfficeAddress);
                $("#activeLocationAddress").val(result.activeLocationAddress);


                elm1S1Old = $("#telNumber1").val();
                elm2S1Old = $("#faxNumber1").val();
                elm3S1Old = $("#postalCode").val();
                elm4S1Old = $("#website").val();
                elm5S1Old = $("#email").val();
                elm6S1Old = $("#centralOfficeAddress").val();
                elm7S1Old = $("#activeLocationAddress").val();

                MAX_STEP_VALID = 2;
            }
            else {

                MAX_STEP_VALID = 1;
                return
            }
        },
        error: function (ex, cc, bb) {
            MAX_STEP_VALID = 0;
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        }

    });

}

function GetLatestForStep3() {
    var givenCode = $("#companyNationalCodeID").val();
    $.ajax({
        type: "get",
        url: "/api/ShareholderComposition/GetLatestShareholderCompositionByNationalCodeID?nationalCode=" + givenCode,
        success: function (result) {

            if (result != undefined) {
                if (result.shareholderEntities != null) {

                    $.each(result.shareholderEntities, function (a, object) {
                        shareholder = {
                            id: (listShareholders.length + 1) + (Math.floor(Math.random() * 10000) + 1),
                            fullName: object.fullName,
                            nationalCode: object.nationalCode,
                            percentageOfPersonShare: object.percentageOfPersonShare,
                            shareholderTypeID: object.shareholderTypeID
                        }
                        listShareholders.push(shareholder);

                        MAX_PERCENTAGE_REMAINIG_SHARE = parseFloat(MAX_PERCENTAGE_REMAINIG_SHARE - parseFloat(shareholder.percentageOfPersonShare));

                        let tableStep3 = document.getElementById("tableStep3");
                        let rowTable = tableStep3.insertRow();
                        //var textTypePersonShareholder = $('#typePersonShareholder').find(":selected").text();
                        var textTypePersonShareholder = document.getElementById("typePersonShareholder").options[shareholder.shareholderTypeID - 1].innerText;

                        var cellTable = rowTable.insertCell();
                        cellTable.innerHTML = shareholder.fullName;
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = shareholder.nationalCode;
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = shareholder.percentageOfPersonShare;
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = getShareholderType(shareholder.shareholderTypeID);
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = `<i class="lni lni-trash" onclick="deleteShareholder(${shareholder.id})" style="cursor:pointer; font-size:24px;color:red"></i>`;
                        STEP_THREE_VALID = true;
                        shareholderServer = {
                            fullName: object.fullName,
                            nationalCode: object.nationalCode,
                            percentageOfPersonShare: object.percentageOfPersonShare,
                            shareholderTypeID: object.shareholderTypeID
                        }
                        listShareholdersServer.push(shareholderServer)
                    });
                    listShareholdersLatest = [...result.shareholderEntities];
                    //listShareholdersServer = [...result.shareholderEntities];
                    //listShareholders = [...result.shareholderEntities];
                    MAX_STEP_VALID = 3;
                    GetLatestForStep4();
                }
                else {

                    MAX_STEP_VALID = 2;
                    STEP_THREE_VALID = false;
                    $('#smartwizard').smartWizard({
                        selected: MAX_STEP_VALID,
                        theme: 'dots',
                        enableURLhash: 0,
                        transition: {
                            animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                        },
                        toolbarSettings: {
                            toolbarPosition: 'none', // both bottom
                        },

                    });
                    return;
                }
            }
            else {

                MAX_STEP_VALID = 2;
                STEP_THREE_VALID = false;
                $('#smartwizard').smartWizard({
                    selected: MAX_STEP_VALID,
                    theme: 'dots',
                    enableURLhash: 0,
                    transition: {
                        animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                    },
                    toolbarSettings: {
                        toolbarPosition: 'none', // both bottom
                    },

                });
                return;
            }

        },
        error: function (ex, cc, bb) {

            MAX_STEP_VALID = 0;
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        //complete: function (jqXHR) {
        //    
        //    $('#smartwizard').smartWizard({
        //        selected: MAX_STEP_VALID,
        //        theme: 'dots',
        //        enableURLhash: 0,
        //        transition: {
        //            animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
        //        },
        //        toolbarSettings: {
        //            toolbarPosition: 'none', // both bottom
        //        },

        //    });
        //}
    });
}

function JustGetLatestForStep3() {
    var givenCode = $("#companyNationalCodeID").val();
    $.ajax({
        type: "get",
        url: "/api/ShareholderComposition/GetLatestShareholderCompositionByNationalCodeID?nationalCode=" + givenCode,
        success: function (result) {
            if (result != null) {

                var tableStep3 = document.getElementById("tableStep3");
                if (tableStep3.rows.length != 0) {

                    $("#tableStep3").find("tr:not(:first)").remove();
                    listShareholders = [];
                    listShareholdersServer = [];
                    MAX_PERCENTAGE_REMAINIG_SHARE = 100;
                    STEP_THREE_VALID = false;
                }
                $.each(result.shareholderEntities, function (a, object) {
                    shareholder = {
                        id: (listShareholders.length + 1) + (Math.floor(Math.random() * 10000) + 1),
                        fullName: object.fullName,
                        nationalCode: object.nationalCode,
                        percentageOfPersonShare: object.percentageOfPersonShare,
                        shareholderTypeID: object.shareholderTypeID
                    }
                    listShareholders.push(shareholder);

                    MAX_PERCENTAGE_REMAINIG_SHARE = parseFloat(MAX_PERCENTAGE_REMAINIG_SHARE - parseFloat(shareholder.percentageOfPersonShare));



                    let rowTable = tableStep3.insertRow();
                    //var textTypePersonShareholder = $('#typePersonShareholder').find(":selected").text();
                    var textTypePersonShareholder = document.getElementById("typePersonShareholder").options[shareholder.shareholderTypeID - 1].innerText;

                    var cellTable = rowTable.insertCell();
                    cellTable.innerHTML = shareholder.fullName;
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = shareholder.nationalCode;
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = shareholder.percentageOfPersonShare;
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = getShareholderType(shareholder.shareholderTypeID);
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = `<i class="lni lni-trash" onclick="deleteShareholder(${shareholder.id})" style="cursor:pointer; font-size:24px;color:red"></i>`;
                    STEP_THREE_VALID = true;
                    shareholderServer = {
                        fullName: object.fullName,
                        nationalCode: object.nationalCode,
                        percentageOfPersonShare: object.percentageOfPersonShare,
                        shareholderTypeID: object.shareholderTypeID
                    }
                    listShareholdersServer.push(shareholderServer)
                });
                listShareholdersLatest = [...result.shareholderEntities];
                MAX_STEP_VALID = 3;
            }
            else {
                return;
            }
        },
        error: function (ex, cc, bb) {

            MAX_STEP_VALID = 0;
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        }
    });
}

function GetLatestForStep4() {
    var givenCode = $("#companyNationalCodeID").val();
    $.ajax({
        type: "get",
        url: "/api/BoardOfDirectorComposition/GetLatestBoardOfDirectorCompositionByNationalCodeID?nationalCode=" + givenCode,
        success: function (result) {

            //if (result != null) {
            //    MAX_STEP_VALID = 3;
            //}
            if (result != undefined) {

                if (result.directorEntities.length != 0) {
                    var tableStep4 = document.getElementById("tableStep4");
                    if (tableStep4.rows.length != 0) {

                        $("#tableStep4").find("tr:not(:first)").remove();
                        listBoardDirectors = [];
                        listBoardDirectorsServer = [];
                        STEP_FOUR_VALID = true;
                    }
                    $.each(result.directorEntities, function (a, object) {

                        boardDirector = {
                            id: (listBoardDirectors.length + 1) + (Math.floor(Math.random() * 10000) + 1),
                            fullName: object.fullName,
                            nationalCode: object.nationalCode,
                            birthDay: new Date(object.birthDay).toLocaleDateString('fa-IR'),/*.substring(0, 10).replace('-', '/').replace('-', '/')*/
                            directorPositionTypeID: object.directorPositionTypeID,
                            expiryDateOfPosition: new Date(object.expiryDateOfPosition).toLocaleDateString('fa-IR'),/*.substring(0, 10).replace('-', '/').replace('-', '/')*/
                            educationLevelTypeID: object.educationLevelTypeID,
                        }
                        listBoardDirectors.push(boardDirector);

                        let tableStep4 = document.getElementById("tableStep4");
                        let rowTable = tableStep4.insertRow();
                        //var textBoardDirectorsPosition = $('#BoardDirectorsPosition').find(":selected").text();
                        //var textBoardDirectorsPosition = $('#BoardDirectorsPosition').find(boardDirector.directorPositionTypeID).text();
                        //var textDegreeEducationBoardDirectors = $('#degreeEducationBoardDirectors').find(":selected").text();
                        //var textDegreeEducationBoardDirectors = $('#degreeEducationBoardDirectors').find(boardDirector.educationLevelTypeID).text();

                        var textDegreeEducationBoardDirectors = document.getElementById("degreeEducationBoardDirectors").options[boardDirector.educationLevelTypeID - 1].innerText;
                        var textBoardDirectorsPosition = document.getElementById("BoardDirectorsPosition").options[boardDirector.directorPositionTypeID - 1].innerText;

                        var cellTable = rowTable.insertCell();
                        cellTable.innerHTML = boardDirector.fullName;
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = boardDirector.nationalCode;
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = getDateWithOutTime(boardDirector.birthDay);
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = textBoardDirectorsPosition;
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = getDateWithOutTime(boardDirector.expiryDateOfPosition);
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = textDegreeEducationBoardDirectors;
                        cellTable = rowTable.insertCell();
                        cellTable.innerHTML = `<i class="lni lni-trash" onclick="deleteBoardDirector(${boardDirector.id})" style="cursor:pointer; font-size:24px;color:red"></i>`;
                        STEP_THREE_VALID = true;
                        boardDirectorServer = {
                            fullName: object.fullName,
                            nationalCode: object.nationalCode,
                            birthDay: object.birthDay,
                            directorPositionTypeID: object.directorPositionTypeID,
                            expiryDateOfPosition: object.expiryDateOfPosition,
                            educationLevelTypeID: object.educationLevelTypeID
                        }
                        listBoardDirectorsServer.push(boardDirectorServer)
                    });
                    listBoardDirectorsLatest = [...result.directorEntities];
                    MAX_STEP_VALID = 3;
                }
                else {

                    MAX_STEP_VALID = 3;
                    STEP_FOUR_VALID = false;
                    $('#smartwizard').smartWizard({
                        selected: MAX_STEP_VALID,
                        theme: 'dots',
                        enableURLhash: 0,
                        transition: {
                            animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                        },
                        toolbarSettings: {
                            toolbarPosition: 'none', // both bottom
                        },

                    });
                    return;
                }
            }
            else {

                MAX_STEP_VALID = 3;
                STEP_FOUR_VALID = false;
                $('#smartwizard').smartWizard({
                    selected: MAX_STEP_VALID,
                    theme: 'dots',
                    enableURLhash: 0,
                    transition: {
                        animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                    },
                    toolbarSettings: {
                        toolbarPosition: 'none', // both bottom
                    },

                });
                return;
            }

        },
        error: function (ex, cc, bb) {
            MAX_STEP_VALID = 0;
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

            $('#smartwizard').smartWizard({
                selected: MAX_STEP_VALID,
                theme: 'dots',
                enableURLhash: 0,
                transition: {
                    animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                },
                toolbarSettings: {
                    toolbarPosition: 'none', // both bottom
                },

            });
        }

    });
}

function JustGetLatestForStep4() {
    var givenCode = $("#companyNationalCodeID").val();
    $.ajax({
        type: "get",
        url: "/api/BoardOfDirectorComposition/GetLatestBoardOfDirectorCompositionByNationalCodeID?nationalCode=" + givenCode,
        success: function (result) {

            //if (result != null) {
            //    MAX_STEP_VALID = 3;
            //}
            if (result != null) {
                var tableStep4 = document.getElementById("tableStep4");
                if (tableStep4.rows.length != 0) {

                    $("#tableStep4").find("tr:not(:first)").remove();
                    listBoardDirectors = [];
                    listBoardDirectorsServer = [];
                    STEP_FOUR_VALID = false;
                }
                $.each(result.directorEntities, function (a, object) {

                    boardDirector = {
                        id: (listBoardDirectors.length + 1) + (Math.floor(Math.random() * 10000) + 1),
                        fullName: object.fullName,
                        nationalCode: object.nationalCode,
                        birthDay: new Date(object.birthDay).toLocaleDateString('fa-IR'),
                        directorPositionTypeID: object.directorPositionTypeID,
                        expiryDateOfPosition: new Date(object.expiryDateOfPosition).toLocaleDateString('fa-IR'),
                        educationLevelTypeID: object.educationLevelTypeID,
                    }
                    listBoardDirectors.push(boardDirector);

                    let tableStep4 = document.getElementById("tableStep4");
                    let rowTable = tableStep4.insertRow();

                    //var textBoardDirectorsPosition = $('#BoardDirectorsPosition').find(":selected").text();
                    //var textDegreeEducationBoardDirectors = $('#degreeEducationBoardDirectors').find(":selected").text();
                    var textDegreeEducationBoardDirectors = document.getElementById("degreeEducationBoardDirectors").options[boardDirector.educationLevelTypeID - 1].innerText;
                    var textBoardDirectorsPosition = document.getElementById("BoardDirectorsPosition").options[boardDirector.directorPositionTypeID - 1].innerText;

                    var cellTable = rowTable.insertCell();
                    cellTable.innerHTML = boardDirector.fullName;
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = boardDirector.nationalCode;
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = boardDirector.birthDay;
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = textBoardDirectorsPosition;
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = boardDirector.expiryDateOfPosition;
                    cellTable = rowTable.insertCell();
                    cellTable.innerHTML = textDegreeEducationBoardDirectors;
                    cellTable.innerHTML = `<i class="lni lni-trash" onclick="deleteBoardDirector(${boardDirector.id})" style="cursor:pointer; font-size:24px;color:red"></i>`;

                    STEP_THREE_VALID = true;
                    boardDirectorServer = {
                        fullName: object.fullName,
                        nationalCode: object.nationalCode,
                        birthDay: object.birthDay,
                        directorPositionTypeID: object.directorPositionTypeID,
                        expiryDateOfPosition: object.expiryDateOfPosition,
                        educationLevelTypeID: object.educationLevelTypeID
                    }
                    listBoardDirectorsServer.push(boardDirectorServer)
                });
                listBoardDirectorsLatest = [...result.directorEntities];
                MAX_STEP_VALID = 3;
            }
            else {

                return;
            }
        },
        error: function (ex, cc, bb) {
            MAX_STEP_VALID = 0;
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        }

    });
}

function PostStep1() {

    let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

    var companyCompanyState = {

        companyName: $("#companyName").val(),
        companyNationalCode: $("#companyNationalCode").val(), /*CompanySituation.companyNationalCode,*/ /*$("#companyNationalCode").val(),*/
        companyRegCode: $("#companyRegCode").val(), /*CompanySituation.companyRegCode,*/ /*$("#companyRegCode").val(),*/
        //financialCode: $("#financialCode").val(),
        //companyRegLocation: $("#companyRegLocation").val(),
        isbankRupt: CompanySituation.isbankRupt,
        isbreakUp: CompanySituation.isbreakUp,
        isSuspention: CompanySituation.isSuspention,
        isTaxRestricted: CompanySituation.isTaxRestricted,
        //companyOwnershipTypeID: $("#ownershipType").val(),
        //companyTypeID: $("#companyType").val(),
        //postalCode = CompanySituation.postalCode,
        state: CompanySituation.state,
        address: CompanySituation.address,

        //companyInitDate: shamsiTomiladi3(d1),
        //companyRegDate: shamsiTomiladi3(d2),
        //lastChangeDate: shamsiTomiladi3(d3),
        //bankRuptyDate: d4,
        //breakUpDate: d5,
        postalCode: CompanySituation.postalCode
    };

    var s1 = $("#companyInitDate").val();
    var d1 = new Date(s1).toLocaleDateString('en-US', options);

    if (d1 === 'Invalid Date') {
        d1 = $('#bankRuptyDate').val();
        companyCompanyState.companyInitDate = d1;
    }
    else {
        companyCompanyState.companyInitDate = shamsiTomiladi3(d1);
    }

    var s2 = $("#companyRegDate").val();
    var d2 = new Date(s2).toLocaleDateString('en-US', options);

    if (d2 === 'Invalid Date') {
        d2 = $('#bankRuptyDate').val();
        companyCompanyState.companyRegDate = d2;
    }
    else {
        companyCompanyState.companyRegDate = shamsiTomiladi3(d2);
    }

    var s3 = $("#lastChangeDate").val();
    var d3 = new Date(s3).toLocaleDateString('en-US', options);

    if (d3 === 'Invalid Date') {
        d3 = $('#bankRuptyDate').val();
        companyCompanyState.lastChangeDate = d3;
    }
    else {
        companyCompanyState.lastChangeDate = shamsiTomiladi3(d3);
    }

    var s4 = $('#bankRuptyDate').val();
    var d4 = new Date(s4).toLocaleDateString('en-US', options);

    if (d4 === 'Invalid Date') {
        d4 = $('#bankRuptyDate').val();
        companyCompanyState.bankRuptyDate = d4;
    }
    else {
        companyCompanyState.bankRuptyDate = shamsiTomiladi3(d4);
    }

    var s5 = $('#breakUpDate').val();
    var d5 = new Date(s5).toLocaleDateString('en-US', options);

    if (d5 === 'Invalid Date') {
        d5 = $('#breakUpDate').val();
        companyCompanyState.breakUpDate = d5;
    }
    else {
        companyCompanyState.breakUpDate = shamsiTomiladi3(d5);
    }

    $.ajax({
        type: "POST",
        url: "/api/Company/PostCompanyAndCompanyState",
        data: JSON.stringify(companyCompanyState),
        contentType: "application/json; charset=utf-8",

        success: function (response) {

            //console.log(response);
            $('#smartwizard').smartWizard("next");
            //JustgetMaxValidStep();
        },
        error: function (response) {

            //console.log(response);
            ivsAlert("اطلاعات شرکت با موفقیت ثبت نشد", "خطا", "danger");
            //showErrorServer('showMassageErrorServerStep2', response.responseText);


        }
    });
}

function PostStep2() {


    var companyDto = {

        telNumber1: $("#telNumber1").val(),
        faxNumber1: $("#faxNumber1").val(),
        postalCode: $("#postalCode").val(),
        email: $("#email").val(),
        website: $("#website").val(),
        centralOfficeAddress: $("#centralOfficeAddress").val(),
        activeLocationAddress: $("#activeLocationAddress").val(),
        companyNationalCode: $("#companyNationalCodeID").val()
    }

    $.ajax({
        type: "POST",
        url: "/api/CompanyContactInformation/Post",
        data: JSON.stringify(companyDto),
        contentType: "application/json; charset=utf-8",

        success: function (response) {

            //console.log(response);
            $('#smartwizard').smartWizard("next");
            JustgetMaxValidStep();
        },
        error: function (response) {

            var messageToShowToUser = '';
            if (messageToShowToUser != null) {
                messageToShowToUser = ''
            }
            //console.log(response);

            if (response.responseText.includes("Code:201")) {
                messageToShowToUser = '  وارد کردن شماره تلفن الزامی است'
                showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:201")) {
                messageToShowToUser += '  وارد کردن کد پستی الزامی است'
                showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:303")) {
                messageToShowToUser += '  وارد کردن نشانی دفتر مرکزی اجباری است'
                showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:304")) {
                messageToShowToUser += '  وارد کردن محل فعالیت شرکت الزامی است'
                showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            }
            else if (response.responseText.includes("service_exception_code:1005")) {
                messageToShowToUser += '  شما باید ابتدا مرحله قبلی را تکمیل کنید'
                showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            }
            else if (response.responseText.includes("service_exception_code:5")) {
                messageToShowToUser += '  شما هنوز شرکت خود را ثبت نکرده اید , ابتدا باید به گام اول رفته و شرکت خود را ثبت کنید'
                showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            }
            else {
                showErrorServer('showMassageErrorServerStep2', 'خطایی در ثبت اطلاعات شما رخ داده است درصورت ادامه این وضعیت با ادمین سیستم تماس بگیرید');
            }

        }
    });

}

function PostStep3() {


    var shareholderCompositionDto = {

        companyNationalCode: $("#companyNationalCodeID").val(),
        shareholderEntities: listShareholdersServer
    }

    //console.log(shareholderCompositionDto);


    $.ajax({
        type: "POST",
        url: "/api/ShareholderComposition/Post",
        data: JSON.stringify(shareholderCompositionDto),
        contentType: "application/json; charset=utf-8",

        success: function (response) {

            //console.log(response);
            $('#smartwizard').smartWizard("next");
            /*  getMaxValidStep();*/
            JustGetLatestForStep3();
        },
        error: function (response) {

            var messageToShowToUser = '';
            if (messageToShowToUser != null) {
                messageToShowToUser = ''
            }
            //console.log(response);

            if (response.responseText.includes("Code:314")) {
                messageToShowToUser = '  شناسه ملی کاربر های حقوقی باید 11 رقمی باشد , لطفا کدهای ملی وارد شده را اصلاح کنید'
                showErrorServer('showMassageErrorServerStep3', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:313")) {
                messageToShowToUser += '  شناسه ملی کاربر های حقیقی باید 10 رقمی باشد, لطفا کدهای ملی وارد شده را اصلاح کنید'
                showErrorServer('showMassageErrorServerStep3', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:316")) {
                messageToShowToUser += '  کد های ملی وارد شده برای سهام داران باید از هم متمایز باشد , لطفا کدهای ملی تکراری وارد نکنید'
                showErrorServer('showMassageErrorServerStep3', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:315")) {
                messageToShowToUser += '  جمع درصد سهام های وارد شده نباید بیشتر از 100 باشد'
                showErrorServer('showMassageErrorServerStep3', messageToShowToUser);
            }
            else if (response.responseText.includes("service_exception_code:1005")) {
                messageToShowToUser += '  شما باید ابتدا مرحله قبلی را تکمیل کنید'
                showErrorServer('showMassageErrorServerStep3', messageToShowToUser);
            }
            else if (response.responseText.includes("service_exception_code:5")) {
                messageToShowToUser += '  شما هنوز شرکت خود را ثبت نکرده اید , ابتدا باید به گام اول رفته و شرکت خود را ثبت کنید'
                showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            }
            else {
                showErrorServer('showMassageErrorServerStep3', 'خطایی در ثبت اطلاعات شما رخ داده است درصورت ادامه این وضعیت با ادمین سیستم تماس بگیرید');
            }
        }
    });

}

async function PostStep4() {

    var boardOfDirectorCompositionPostDto = {

        companyNationalCode: $("#companyNationalCodeID").val(),
        directordtos: listBoardDirectorsServer
    }
    loading('finish-btn', true, true);

    $.ajax({
        type: "POST",
        url: "/api/BoardOfDirectorComposition/Post",
        data: JSON.stringify(boardOfDirectorCompositionPostDto),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {

            //console.log(response);
            gotoFacilityRegistration();

        },

        error: function (response) {
            loading('finish-btn', false, true);

            var messageToShowToUser = '';
            if (messageToShowToUser != null) {
                messageToShowToUser = ''
            }
            //console.log(response);
            if (response.responseText.includes("Code:517")) {
                messageToShowToUser = '  کد های ملی وارد شده برای سهام داران باید از هم متمایز باشد , لطفا کدهای ملی تکراری وارد نکنید'
                showErrorServer('showMassageErrorServerStep4', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:516")) {
                messageToShowToUser += '  شما از بین مدیرعامل , نائب رئیس هیئت مدیره , رئیس هیئت مدیره فقط میتوانید یک عضو انتخاب کنید'
                showErrorServer('showMassageErrorServerStep4', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:513")) {
                messageToShowToUser += '  کد ملی اعضا حتما باید 10 رقمی باشد'
                showErrorServer('showMassageErrorServerStep4', messageToShowToUser);
            }
            else if (response.responseText.includes("Code:515")) {
                messageToShowToUser += '  تاریخ تولد اعضا نباید برای امروز یا اینده باشد!'
                showErrorServer('showMassageErrorServerStep4', messageToShowToUser);
            }
            else if (response.responseText.includes("service_exception_code:1005")) {
                messageToShowToUser += '  شما باید ابتدا مرحله قبلی را تکمیل کنید'
                showErrorServer('showMassageErrorServerStep4', messageToShowToUser);
            }
            else if (response.responseText.includes("service_exception_code:5")) {
                messageToShowToUser += '  شما هنوز شرکت خود را ثبت نکرده اید , ابتدا باید به گام اول رفته و شرکت خود را ثبت کنید'
                showErrorServer('showMassageErrorServerStep2', messageToShowToUser);
            }
            else {
                showErrorServer('showMassageErrorServerStep4', 'خطایی در ثبت اطلاعات شما رخ داده است درصورت ادامه این وضعیت با ادمین سیستم تماس بگیرید');
            }

        }
    });

}


function getAllCompanyTypes() {
    $.ajax({
        type: "get",
        url: "/api/Company/GetAllCompanyTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiCompanyTypes(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}


function createUiCompanyTypes(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let companyType = document.getElementById('companyType');
    if (companyType != undefined) {
        companyType.innerHTML += template;
    }
}

function getAllCompanyOwnershipTypes() {
    $.ajax({
        type: "get",
        url: "/api/Company/GetAllCompanyOwnershipTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiCompanyOwnershipTypes(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }
    });
}

function createUiCompanyOwnershipTypes(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let companyType = document.getElementById('ownershipType');
    if (companyType != undefined) {
        companyType.innerHTML += template;
    }
}


function GetAllEducationLevelTypes() {
    $.ajax({
        type: "get",
        url: "/api/BoardOfDirectorComposition/GetAllEducationLevelTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiEducationLevelTypes(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}

function createUiEducationLevelTypes(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let companyType = document.getElementById('degreeEducationBoardDirectors');
    if (companyType != undefined) {
        companyType.innerHTML += template;
    }
}

function GetAllDirectorPositionTypes() {
    $.ajax({
        type: "get",
        url: "/api/BoardOfDirectorComposition/GetAllDirectorPositionTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiDirectorPositionTypes(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}

function createUiDirectorPositionTypes(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let companyType = document.getElementById('BoardDirectorsPosition');
    if (companyType != undefined) {
        companyType.innerHTML += template;
    }
}


function CheckValuesOfstep2HasChange() {

    if (elm1S1New != elm1S1Old || elm2S1New != elm2S1Old || elm3S1New != elm3S1Old || elm4S1New != elm4S1Old || elm5S1New != elm5S1Old || elm6S1New != elm6S1Old || elm7S1New != elm7S1Old) {
        return true
    }
    else
        false;
}

const CheckValuesOfstep3HasChange = (o1, o2) =>

    typeof o1 === 'object' && Object.keys(o1).length > 0
        ? Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => CheckValuesOfstep3HasChange(o1[p], o2[p]))
        : o1 === o2;


function CheckValuesOfstep4HasChange(o1, o2) {

    if (o1 !== null && o2 !== null) {
        typeof o1 === 'object' && Object.keys(o1).length > 0
            ? Object.keys(o1).length === Object.keys(o2).length
            && Object.keys(o1).every(p => CheckValuesOfstep4HasChange(o1[p], o2[p]))
            : o1 === o2;
    }
    else
        return true;

}

async function gotoFacilityRegistration() {
    ivsAlert2('success', "پیام موفقیت", "تمام مراحل ثبت اطلاعات شرکت با موفقیت تکمیل یافت تا لحظاتی دیگر به صفحه ثبت تسهیلات منتقل خواهید شد", "top center", 4, "600");

    await sleep(4000).then(() => {
        window.location = "/FacilityRegistration/Index";
    });
    loading('finish-btn', false, true);
}







    //const objectsEqual = (listShareholdersLatest, listShareholdersServer) =>
    //    Object.keys(listShareholdersLatest).length == Object.keys(listShareholdersServer).length
    //    && Object.keys(listShareholdersLatest).every(p => listShareholdersLatest[p] === listShareholdersServer[p]);

    //return objectsEqual;


//
//    if (listShareholdersLatest != listShareholdersServer)
//        return true
//    else
//        false;

//    listShareholdersLatest.prototype.equals = function (listShareholdersServer) {
//        if (!listShareholdersServer)
//            return false;

//        // compare lengths - can save a lot of time
//        if (this.length != array.length)
//            return false;

//        for (var i = 0, l = this.length; i < l; i++) {
//            // Check if we have nested arrays
//            if (this[i] instanceof Array && array[i] instanceof Array) {
//                // recurse into the nested arrays
//                if (!this[i].equals(array[i]))
//                    return false;
//            }
//            else if (this[i] != array[i]) {
//                // Warning - two different object instances will never be equal: {x:20} != {x:20}
//                return false;
//            }
//        }
//        return true;
//    }
//}



//function getMaxValidStep() {
//
//    var givenCode = $("#companyNationalCodeEntered").val();
//    $.ajax({
//        type: "get",
//        url: "/api/CompanyContactInformation/GetLatestCompanyContactInformationByNationalCodeAsync?nationalCode=" + givenCode,
//        success: function (result) {
//            if (result != null) {
//
//                MAX_STEP_VALID = 2;

//            }
//            else {

//                MAX_STEP_VALID = 1;
//                return
//            }
//        },
//        error: function (ex, cc, bb) {
//            MAX_STEP_VALID = 0;
//            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
//           //console.log(ex);
//           //console.log(bb);
//        },
//        complete: function (jqXHR) {
//
//            $('#smartwizard').smartWizard({
//                selected: MAX_STEP_VALID,
//                theme: 'dots',
//                enableURLhash: 0,
//                transition: {
//                    animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
//                },
//                toolbarSettings: {
//                    toolbarPosition: 'none', // both bottom
//                },

//            });
//        }
//    });

//}






































//function TrackChengesOfForm2() {
//    $("#telNumber1").change(function () {
//        var elm1S1New = $(this).val();

//    });
//    $("#faxNumber1").change(function () {
//        var elm2S1New = $(this).val();

//    });
//    $("#postalCode").change(function () {
//        var elm3S1New = $(this).val();

//    });
//    $("#website").change(function () {
//        var elm4S1New = $(this).val();

//    });
//    $("#email").change(function () {
//        var elm5S1New = $(this).val();

//    });
//    $("#centralOfficeAddress").change(function () {
//        var elm6S1New = $(this).val();

//    });
//    $("#activeLocationAddress").change(function () {
//        var elm7S1New = $(this).val();

//    });
//}
//function CheckAnyChangeInStep2() {
//
//    $('#telNumber1').each(function () {
//        var elem1 = $(this);

//        elem1.data('oldVal', elem1.val());

//        elem1.bind("propertychange change click keyup input paste", function (event) {

//        });
//    });
//    $('#faxNumber1').each(function () {
//        var elem2 = $(this);

//        elem2.data('oldVal', elem2.val());

//        elem2.bind("propertychange change click keyup input paste", function (event) {

//        });
//    });
//    $('#postalCode').each(function () {
//        var elem3 = $(this);

//        elem3.data('oldVal', elem3.val());

//        elem3.bind("propertychange change click keyup input paste", function (event) {

//        });
//    });
//    $('#website').each(function () {
//        var elem4 = $(this);

//        elem4.data('oldVal', elem4.val());

//        elem4.bind("propertychange change click keyup input paste", function (event) {

//        });
//    });
//    $('#email').each(function () {
//        var elem5 = $(this);

//        elem5.data('oldVal', elem5.val());

//        elem5.bind("propertychange change click keyup input paste", function (event) {

//        });
//    });
//    $('#centralOfficeAddress').each(function () {
//        var elem6 = $(this);

//        elem6.data('oldVal', elem.val());

//        elem6.bind("propertychange change click keyup input paste", function (event) {


//        });
//    });
//
//    $('#activeLocationAddress').each(function () {
//

//        var elem7 = $(this);

//        // Save current value of element
//        elem7.data('oldVal', elem7.val());

//        // Look for changes in the value
//        elem7.bind("propertychange change click keyup input paste", function (event) {
//            // If value has changed...
//            if (elem7.data('oldVal') != elem7.val() ) {
//                // Updated stored value
//                elem7.data('newVal', elem7.val());

//               // Do action
//              return true;
//            }
//        });
//    });
//    // If value has changed...
//    if (elem1.data('oldVal') != elem1.val() || elem2.data('oldVal') != elem2.val() || elem3.data('oldVal') != elem3.val() || elem4.data('oldVal') != elem4.val()
//        || elem5.data('oldVal') != elem5.val() || elem6.data('oldVal') != elem6.val() || elem7.data('oldVal') != elem7.val()) {
//        // Updated stored value
//        elem1.data('oldVal', elem1.val());

//        // Do action
//        return true;
//    }
//}




