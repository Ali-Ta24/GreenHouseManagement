
const queryStringValueID = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let valueId = queryStringValueID.id;

if (valueId === null) {
    showErrorServerWithOutClose('card-body', 'هیچ طرحی ارسال نشده است');
}

async function FillDropDown() {

    await GetAllRequestCountTypes();
    await GetAllFleetCapacityUnitTypes();
    await GetAllProgramTypes();
    await GetAllProgramTypeKinds();


    GetValueOfCurrentProgram();
}

FillDropDown();


async function GetAllRequestCountTypes() {
    $.ajax({
        type: "get",
        url: "/api/Program/GetAllRequestCountTypes",
        success: function (result) {
            if (result != null) {
                result.forEach(item => {
                    createUiRequestCountTypes(item);
                })
            }
        },
        async: false,
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
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

async function GetAllFleetCapacityUnitTypes() {
    $.ajax({
        type: "get",
        url: "/api/FleetCapacityUnit/GetAllFleetCapacityUnitTypes",
        async: false,
        success: function (result) {
            if (result != null) {
                result.forEach(item => {
                    createUiFleetCapacityUnitTypes(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
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

async function GetAllProgramTypes() {
    $.ajax({
        type: "get",
        async: false,
        url: "/api/Program/GetAllProgramTypes",
        success: function (result) {
            if (result != null) {
                result.forEach(item => {
                    createUiProgramTypes(item);
                })
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
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

async function GetAllProgramTypeKinds() {
    $.ajax({
        type: "get",
        async: false,
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

async function validateStepOne() {
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

function GetValueOfCurrentProgram() {
    /*   var rtn;*/
    $.ajax({
        type: "get",
        async: false,
        url: "/api/Program/GetDetailOfMyProgram?id=" + valueId,
        success: function (result) {
            if (result != null) {
                //console.log(result);
                //rtn == 0;
                //var requestCount = getRequestCountType(result.requestCountTypeID);
                //var programType = getProgramType(result.programTypeID);
                //var fleetCapacityUnit = getFleetCapacityUnitType(result.fleetCapacityUnitID);

                $("#designType").val(result.programTypeID);
                $("#numberCompany").val(result.requestCount);
                $("#capacity").val(result.requestCapacity);
                $("#creator_seller").val(result.thirdParty);
                $("#city").val(result.activityLocation);
                $("#address").val(result.activityPath);
                $("#NumberOwnership").val(result.similarOwnedPrograms);
                $("#NumberTenants").val(result.similarRentedPrograms);
                $("#DemandType").val(result.requestCountTypeID);
                $("#capacityType").val(result.fleetCapacityUnitID);

                $("#programTypeKind").val(result.programTypeKindID);
                $("#title").val(result.title);

                if ($('#designType').val() == 1) {
                    $('#programTypeKind').val("1");
                    $('#programTypeKind').attr('disabled', 'disabled');
                }
                else if ($('#designType').val() == 4) {
                    $('#programTypeKind').val("2");
                    $('#programTypeKind').attr('disabled', 'disabled');
                }
                //var newOption = new Option(programType, result.programTypeID, false, false);
                //$('#designType').append(newOption).trigger('change');

            }
            else {
                /*  rtn == 1;*/
                //console.log("error");
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
                showErrorServerWithOutClose('شما دسترسی لازم برای مشاهده اطلاعات شرکت های دیگر را ندارید', 'خطای دسترسی', 'danger');
            } else if (ex.status == 500) {

                showErrorServerWithOutClose('card-body', 'این طرح یافت نشد');
            }
            else if (ex.status == '404') {

                showErrorServerWithOutClose('اشکال در برقراری ارتباط با سرور', 'خطا', 'danger');
            }
            else {
                showErrorServerWithOutClose('اشکال در برقراری ارتباط با سرور', 'خطا', 'danger');
            }
        }
    });
}

async function PutPorgram() {
    var programDto = {
        id: valueId,
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
            ivsAlert("تغییرات با موفقیت ذخیره شد", "ذخیره تغییرات", "success")
        },
        error: function (response) {
            //console.log(response);
            ivsAlert('خطا در ویرایش طرح', 'خطا', 'error');
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
//#End Region

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

$("#save-btn").on("click", async function (e) {
    var vlidate1 = await validateStepOne();
    if (vlidate1) {
        PutPorgram();
    }
    else {
        ivsAlert("لطفا فیلدهای اجباری را کامل وارد کنید", "خطا", "error");
    }

});



