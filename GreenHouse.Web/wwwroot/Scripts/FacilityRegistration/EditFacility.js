const queryStringValueID = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let valueId = queryStringValueID.id; // "id"
console.log(valueId);

if (valueId === null) {
    showErrorServerWithOutClose('card-body', 'هیچ طرحی ارسال نشده است');

}

GetValueOfCurrentFacility();

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

function GetValueOfCurrentFacility() {

    /*   var rtn;*/
    $.ajax({
        type: "get",

        url: "/api/Facility/CheckPermissionAndGetByID?id=" + valueId,
        success: function (result) {
            if (result != null) {


                //console.log(result);

                $("#EvaluationTime").val("");
                $("#costEstimate").val("");
                $("#canCost").val("");

                $("#EvaluationTime").val(result.requiredTime);
                $("#costEstimate").val(PersianTools.addCommas(result.requiredBudget));
                if (result.companyIsAbleToProvideFinanceShare == true)
                    $("#canCost").prop("checked", true)
                //$("#canCost").checked = true
                else
                    $("#canotCost").prop("checked", true)
                //$("input[name='canCost']:checked").checked = false


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

                showErrorServerWithOutClose('card-body', 'تسهیلات یافت نشد');
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

async function PutFacility() {

    var facilityRequestDto = {
        id: valueId,
        requiredTime: parseFloat($("#EvaluationTime").val()),
        requiredBudget: parseFloat(PersianTools.removeCommas($("#costEstimate").val())),
        companyIsAbleToProvideFinanceShare: $('#canCost').prop('checked')
    }

    $.ajax({
        type: "PUT",
        url: "/api/Facility/PutFacilityRequest",
        data: JSON.stringify(facilityRequestDto),
        contentType: "application/json; charset=utf-8",

        success: async function (response) {

            //console.log(response);
            ivsAlert("تغییرات با موفقیت ذخیره شد", "ذخیره تغییرات", "success")

        },
        error: function (response) {
            //console.log(response);
            ivsAlert('خطا در ویرایش تسهیلات', 'خطا', 'error');
        }
    });

}

$("#save-btn").on("click", async function (e) {
    var vlidate2 = await validateStepTwo();
    if (vlidate2) {
        PutFacility();
    }
    else {
        ivsAlert("لطفا فیلدهای اجباری را کامل وارد کنید", "خطا", "error");
    }

});