
var STEP_TWO_VALID = false;
var idOfAddedProgram;
var idOfAddedFacility;

var infomationMoney = {};

const queryStringValueID = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
idOfAddedProgram = queryStringValueID.id;

if (idOfAddedProgram === null) {
    showErrorServerWithOutClose('card-body', 'هیچ طرحی ارسال نشده است');
}

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
            gotoCartable(response);
            idOfAddedFacility = response;
        },
        error: function (ex, cc, bb) {
            loading('finish-btn', false, true);
            if (ex.status == 500) {

                ivsAlert2('error', 'شما دسترسی لازم برای مشاهده اطلاعات تسهیلات دیگر را ندارید');
            }
            else if (ex.status == 404) {
                ivsAlert2('error', 'اشکال در برقراری ارتباط با سرور', 'خطا');
            }
            else {
                ivsAlert2('error', 'اشکال در برقراری ارتباط با سرور', 'خطا');
            }
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

$("#finish-btn").on("click", async function (e) {

    let countError = 0;
    let textError = "";
    //let vlidate1 = await validateStepOne();


    let vlidate2 = await validateStepTwo();
    if (STEP_TWO_VALID == false && vlidate2 == false) {
        countError++;
        textError += " ابتدا اطلاعات تسهيلات درخواستی را وارد کنید";
        textError += "<br/>";
    }

    if (countError > 0) {
        ivsAlert(textError, `${countError} خطا`, 'error');
        return;
    }
    else {
        if (idOfAddedProgram == null) {
            ivsAlert("شما هیچ طرحی برای این تسهیلات وارد نکرده اید ,");
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