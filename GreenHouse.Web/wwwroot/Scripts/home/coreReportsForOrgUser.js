try {
    $.ajax({
        type: "get",
        url: "/api/CoreReports/GetTotalInAcceptanceProgressFacilities",
        contentType: "application/json; charset=utf-8",
        success: async function (result) {
            $("#totalInAcceptanceProgressFacilities").text(result);
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی GetTotalInAcceptanceProgressFacilities');
            //console.log(ex);
            //console.log(bb);
        }
    });
} catch (e) {
    $("#totalInAcceptanceProgressFacilities").text(0);
}

try {
    $.ajax({
        type: "get",
        url: "/api/CoreReports/GetTotalInAcceptanceProgressFacilityAmounts",
        contentType: "application/json; charset=utf-8",
        success: async function (result) {
            $("#totalInAcceptanceProgressFacilityAmounts").text(PersianTools.addCommas(result) + " " + "ریال");
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی GetTotalInAcceptanceProgressFacilityAmounts');

            //console.log(ex);
            //console.log(bb);
        }
    });
} catch (e) {
    $("#totalInAcceptanceProgressFacilityAmounts").text(0);
}

try {
    $.ajax({
        type: "get",
        url: "/api/CoreReports/GetTotalRegisteredCompaniesAsync",
        contentType: "application/json; charset=utf-8",
        success: async function (result) {
            $("#totalRegisteredCompanies").text(result);
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی GetTotalRegisteredCompaniesAsync');

            //console.log(ex);
            //console.log(bb);
        }
    });
} catch (e) {
    $("#totalRegisteredCompanies").text(0);
}