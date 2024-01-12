
var STEP_ONE_VALID = false;
var STEP_TWO_VALID = false;
var idOfAddedProgram;
var idOfAddedFacility;

var MAX_STEP_VALID = 0;

var infomationDesign = {};
var infomationMoney = {};

CheckAnyCompanyOrCompanyDetailsAreExistForCurrentUser();



//Step show event
$("#smartwizard").on("showStep", function (e, anchorObject, stepNumber, stepDirection, stepPosition) {
    $("#prev-btn").removeClass('disabled');
    $("#next-btn").removeClass('disabled');
    if (stepPosition === 'first') {
        $("#prev-btn").addClass('disabled');
    } else if (stepPosition === 'last') {
        $("#next-btn").addClass('disabled');
    } else {
        $("#prev-btn").removeClass('disabled');
        $("#next-btn").removeClass('disabled');
    }
});

$("#reset-btn").on("click", function () {
    // Reset wizard
    STEP_ONE_VALID = false;
    STEP_TWO_VALID = false;

    MAX_STEP_VALID = 0;

    infomationDesign = {};
    infomationMoney = {};

    resetInputStep1();
    resetInputStep2();

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
    //let vlidate1 = await validateStepOne();
    if (jQuery.isEmptyObject(infomationDesign)) {
        countError++;
        textError += "گام اول: ابتدا اطلاعات كلی طرح را وارد کنید";
        textError += "<br/>";

    }

    let vlidate2 = await validateStepTwo();
    if (STEP_TWO_VALID == false && vlidate2 == false) {
        countError++;
        textError += "  گام دوم: ابتدا اطلاعات تسهيلات درخواستی را وارد کنید.";
        textError += "<br/>";
    }

    if (countError > 0) {
        //console.log(textError);
        ivsAlert(textError, `${countError} خطا`, 'error');
        return;
    }
    else {
        if (idOfAddedProgram == null) {
            ivsAlert("شما هیچ طرحی برای این تسهیلات وارد نکرده اید , تا لحظاتی دیگر به گام قبل منتقل خواهید شد ");
            MAX_STEP_VALID = 0;

            await sleep(3000).then(() => {
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
            });

            return;
        }
        else {
            await PostFacility();
            return;
        }
        /*ivsAlert(`اطلاعات با موفقیت ثبت شد`, "پیام موفقیت", 'success');*/
    }

    return true;
});

async function Validation_NextStep(e) {

    let stepIndex = $('#smartwizard').smartWizard("getStepIndex");

    if (stepIndex == 1) {

        ///check valid step-2
        let vlidate2 = await validateStepTwo();

        if (STEP_TWO_VALID && vlidate2) {
            $('#smartwizard').smartWizard("next");
            return;
        }
        ivsAlert('ابتدا اطلاعات تسهیلات را وارد کنید', 'خطا', 'error');

    }
    else if (stepIndex == 0) {

        ///check valid step-1
        var vlidate1 = await validateStepOne();
        if (STEP_ONE_VALID && vlidate1) {
            //let x = $('#designType').val();
            //if (x == "") {
            //    STEP_ONE_VALID = false;
            //    ivsAlert("نوع طرح را وارد نمایید", "خطا", "error")
            //    return false;
            //}
            if (idOfAddedProgram == null) {
                await PostPorgram();
                return;
            }
            else {
                await PutPorgram();
                return;
            }
            $('#smartwizard').smartWizard("next");
            MAX_STEP_VALID = 1;
        }
        ivsAlert('ابتدا اطلاعات كلی طرح را وارد کنید', 'خطا', 'error');
    }

}

///step-1
function validateStepOne() {

    let formStep1 = document.getElementById('formStep1');

    if (!$("#formStep1").valid()) {
        formStep1.classList.add('was-validated');
        STEP_ONE_VALID = false;
        return false;
    }
    STEP_ONE_VALID = true;
    infomationDesign = {
        designType: $("#designType").val(),
        numberCompany: $("#numberCompany").val(),
        capacity: $("#capacity").val(),
        creator_seller: $("#creator_seller").val(),
        city: $("#city").val(),
        address: $("#address").val(),
        NumberOwnership: $("#NumberOwnership").val(),
        NumberTenants: $("#NumberTenants").val(),
        DemandType: $("#DemandType").val(),
        capacityType: $("#capacityType").val(),
    }
    //console.log(infomationDesign);
    return true;
}

function resetInputStep1() {

    $("#designType").val("");
    $("#numberCompany").val("");
    $("#capacity").val("");
    $("#creator_seller").val("");
    $("#city").val("");
    $("#address").val("");
    $("#NumberOwnership").val("");
    $("#NumberTenants").val("");
    document.getElementById("DemandType").selectedIndex = "0";
    document.getElementById("capacityType").selectedIndex = "0";
}


///step-2
function validateStepTwo() {

    let formStep2 = document.getElementById('formStep2');
    if (!$("#formStep2").valid()) {
        formStep2.classList.add('was-validated');
        STEP_TWO_VALID = false;
        return false;
    }
    else if ($("#EvaluationTime").val() == "" || $("#costEstimate").val() == "" || $("input[name='canCost']:checked").val() == undefined) {
        STEP_TWO_VALID = false;
        return false;
    }

    STEP_TWO_VALID = true;
    infomationMoney = {
        EvaluationTime: $("#EvaluationTime").val(),
        costEstimate: PersianTools.removeCommas($("#costEstimate").val()),

        canCost: $("input[name='canCost']:checked").val(),
        GetMoneyBank: $("input[name='GetMoneyBank']:checked").val(),
        GetMoney: $("input[name='GetMoney']:checked").val(),
    }
    //console.log(infomationMoney);

    return true;
}

function resetInputStep2() {

    $("#EvaluationTime").val("");
    $("#costEstimate").val("");

}


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

async function PostPorgram() {

    var programDto = {
        companyNationalID: $("#companyNationalCodeID").val(),
        programTypeID: parseInt($("#designType").val()),
        requestCount: parseInt($("#numberCompany").val()),
        requestCountTypeID: $("#DemandType").val(),
        requestCapacity: parseInt($("#capacity").val()),
        fleetCapacityUnitID: $("#capacityType").val(),
        thirdParty: $("#creator_seller").val(),
        activityLocation: $("#city").val(),
        activityPath: $("#address").val(),
        similarOwnedPrograms: parseInt($("#NumberOwnership").val()),
        similarRentedPrograms: parseInt($("#NumberTenants").val()),
        programTypeKindID: $("#programTypeKind").val(),
        title: $("#title").val()
    }


    $.ajax({
        type: "POST",
        url: "/api/Program/Post",
        data: JSON.stringify(programDto),
        contentType: "application/json; charset=utf-8",

        success: function (response) {

            //console.log(response);
            $('#smartwizard').smartWizard("next");
            idOfAddedProgram = response;
            //console.log(idOfAddedProgram);
        },
        error: function (response) {
            //console.log(response);
            ivsAlert('خطا در ساخت طرح', 'خطا', 'error');
        }
    });

}

async function PutPorgram() {

    var programDto = {
        id: idOfAddedProgram,
        companyNationalID: $("#companyNationalCodeID").val(),
        programTypeID: parseInt($("#designType").val()),
        requestCount: parseInt($("#numberCompany").val()),
        requestCountTypeID: $("#DemandType").val(),
        requestCapacity: $("#capacity").val(),
        fleetCapacityUnitID: $("#capacityType").val(),
        thirdParty: $("#creator_seller").val(),
        activityLocation: $("#city").val(),
        activityPath: $("#address").val(),
        similarOwnedPrograms: parseInt($("#NumberOwnership").val()),
        similarRentedPrograms: parseInt($("#NumberTenants").val()),
        programTypeKindID: parseInt($("#programTypeKind").val()),
        title: $("#title").val()
    }


    $.ajax({
        type: "PUT",
        url: "/api/Program/Put",
        data: JSON.stringify(programDto),
        contentType: "application/json; charset=utf-8",

        success: function (response) {

            //console.log(response);
            $('#smartwizard').smartWizard("next");
            //idOfAddedProgram = response;
            //console.log(idOfAddedProgram);
        },
        error: function (response) {
            //console.log(response);
            ivsAlert('خطا در ویرایش طرح', 'خطا', 'error');
        }
    });

}

async function gotoCartable(id) {
    ivsAlert2('success', "پیام موفقیت", "مراحل ثبت تسهیلات با موفقیت انجام شد , تا لحظاتی دیگر به صفحه کارتابل منتقل خواهید شد", "top center", 4, "600");
    await sleep(4000).then(() => {
        window.location = "/FacilityRegistration/Cartable?id=" + id;
    });
    loading('finish-btn', false, true);
}

async function PostFacility() {
    loading('finish-btn', true, true);
    var facilityRequestDto = {
        programID: idOfAddedProgram,
        requiredTime: parseFloat($("#EvaluationTime").val()),
        requiredBudget: PersianTools.removeCommas($("#costEstimate").val()),
        companyIsAbleToProvideFinanceShare: $('#canCost').prop('checked')
    }

    $.ajax({
        type: "POST",
        url: "/api/Facility/PostFacilityRequest",
        data: JSON.stringify(facilityRequestDto),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {

            //console.log(response);
            //ivsAlert("مراحل ثبت طرح با موفقیت انجام شد , تا لحظاتی دیگر به صفحه کارتابل منتقل خواهید شد", "ثبت کامل اطلاعات");

            gotoCartable(response);



            idOfAddedFacility = response;
            //$('#smartwizard').smartWizard("next");
            //idOfAddedProgram = response;
            //console.log(idOfAddedProgram);
        },
        error: function (response) {
            loading('finish-btn', false, true);

            //console.log(response);
            ivsAlert('خطا در ساخت تسهیلات', 'خطا', 'error');
        }
    });

}

function checkMaxValue(id, minval) {

    if (parseInt($('#' + id).val()) < minval)
        $('#' + id).val(minval);
}

async function PutFacility() {

    var facilityRequestDto = {
        id: idOfAddedFacility,
        requiredTime: parseFloat($("#EvaluationTime").val()),
        requiredBudget: PersianTools.removeCommas($("#costEstimate").val()),
        companyIsAbleToProvideFinanceShare: $('#canCost').prop('checked')

    }
    loading('finish-btn', true, true);

    $.ajax({
        type: "PUT",
        url: "/api/Facility/PutFacilityRequest",
        data: JSON.stringify(facilityRequestDto),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {

            //console.log(response);
            gotoCartable(response);

        },
        error: function (response) {
            loading('finish-btn', false, true);

            //console.log(response);
            ivsAlert('خطا در ساخت تسهیلات', 'خطا', 'error');
        }
    });

}



function GetAllRequestCountTypes() {
    $.ajax({
        type: "get",
        url: "/api/Program/GetAllRequestCountTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiRequestCountTypes(item);
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

function createUiRequestCountTypes(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let requestCountType = document.getElementById('DemandType');
    if (requestCountType != undefined) {
        requestCountType.innerHTML += template;
    }
}

function GetAllFleetCapacityUnitTypes() {
    $.ajax({
        type: "get",
        url: "/api/FleetCapacityUnit/GetAllFleetCapacityUnitTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiFleetCapacityUnitTypes(item);
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

function createUiFleetCapacityUnitTypes(item) {
    let template = `
        <option value="${item.id}">${item.name}</option>
     `;
    let fleetCapacityUnit = document.getElementById('capacityType');
    if (fleetCapacityUnit != undefined) {
        fleetCapacityUnit.innerHTML += template;
    }
}

function GetAllProgramTypes() {
    $.ajax({
        type: "get",
        url: "/api/Program/GetAllProgramTypes",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiProgramTypes(item);
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

function createUiProgramTypes(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let programType = document.getElementById('designType');
    if (programType != undefined) {
        programType.innerHTML += template;
    }
}

function GetAllProgramTypeKinds() {
    $.ajax({
        type: "get",
        url: "/api/Program/GetAllProgramTypeKinds",
        success: function (result) {
            //console.log(result);
            if (result != null) {
                result.forEach(item => {
                    createUiProgramTypeKinds(item);
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

function createUiProgramTypeKinds(item) {
    let template = `
        <option value="${item.id}">${item.title}</option>
     `;
    let programTypeKind = document.getElementById('programTypeKind');
    if (programTypeKind != undefined) {
        programTypeKind.innerHTML += template;
    }
}

function CheckAnyProgramExistForCurrentUser() {

    $.ajax({
        type: "get",
        async: false,
        url: "/api/facility/GetCartableProgramItems?viewMode=Acctionable",
        success: function (result) {

            if (result.recordsTotal != 0) {

                showMessageInfoForFacility('showMassageInfoStep1', 'شما قبلا طرح تقاضا ثبت کرده اید , آیا مایل به ثبت طح جدید هستید یا می خواهید طرح های قبلی را ویرایش کنید ')

            }
            else {

                onClickRegisterFacility();
                MAX_STEP_VALID = 0;
                return
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

function CheckAnyCompanyOrCompanyDetailsAreExistForCurrentUser() {

    var companyNationalCodeID = $("#companyNationalCodeID").val();
    $.ajax({
        type: "get",
        url: "/api/BoardOfDirectorComposition/GetLatestBoardOfDirectorCompositionByNationalCodeID?nationalCode=" + companyNationalCodeID,
        success: function (result) {

            if (result != undefined) {
                if (result.directorEntities.length == 0) {
                    showMessageThatCompanyOrCompanyDetailsAreExistOrNot('showMassageCompanyAndCompanyDetails', 'شما هنوز اطلاعات شرکت را کامل وارد نکرده اید , لطفا ابتدا اطلاعات شرکت خود را کامل کنید');
                    return;
                }

                else {
                    CheckAnyProgramExistForCurrentUser();
                    GetAllFleetCapacityUnitTypes();
                    GetAllRequestCountTypes();
                    GetAllProgramTypes();
                    GetAllProgramTypeKinds();
                }
            }
            else {
                showMessageThatCompanyOrCompanyDetailsAreExistOrNot('showMassageCompanyAndCompanyDetails', 'شما هنوز اطلاعات شرکت را کامل وارد نکرده اید , لطفا ابتدا اطلاعات شرکت خود را کامل کنید')
                return;
            }


        },
        error: function (ex, cc, bb) {

            showMessageThatCompanyOrCompanyDetailsAreExistOrNot('showMassageCompanyAndCompanyDetails', 'شما هنوز شرکت خود را ثبت نکرده اید , لطفا ابتدا شرکت را ثبت کنید')
            //MAX_STEP_VALID = 0;
            //ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        }
    });

}

//Ravesh Qadim
function HandleProgramTypeKindValue() {
    if ($('#designType').val() == 1) {
        $('#programTypeKind').val("1");
        $('#programTypeKind').attr('disabled', 'disabled');
    }
    else if ($('#designType').val() == 4) {
        $('#programTypeKind').val("2");
        $('#programTypeKind').attr('disabled', 'disabled');
    }
    else {
        var obj = document.getElementById('programTypeKind');
        /*        var x = $("#designType").attr('disabled');*/
        if (obj.hasAttribute('disabled')) {
            $('#programTypeKind').attr('disabled', false);
        }
    }
}
//End Region

//Ravesh Jadid
function HandleProgramTypeKindValue2() {
    var value = $('#designType').val();
    $.ajax({
        type: "get",
        url: "/api/Program/GetProgramTypeKindFromProgramType?programTypeID=" + value,
        success: function (rtn) {
            if (rtn != null && rtn.programTypeKindID == 1) {
                $('#programTypeKind').val("1");
                $('#programTypeKind').attr('disabled', 'disabled');
            }
            else if (rtn != null && rtn.programTypeKindID == 2) {
                $('#programTypeKind').val("2");
                $('#programTypeKind').attr('disabled', 'disabled');
            }
            else {
                var obj = document.getElementById('programTypeKind');
                /*        var x = $("#designType").attr('disabled');*/
                if (obj.hasAttribute('disabled')) {
                    $('#programTypeKind').attr('disabled', false);
                }
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرورss', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }

    });
}

//End Region

function onClickRegisterFacility() {

    $("#smartwizard").css('display', '');
    $("#buttonsOfFacility").css('display', '');
    $("#step-1").css('width', '');


}
