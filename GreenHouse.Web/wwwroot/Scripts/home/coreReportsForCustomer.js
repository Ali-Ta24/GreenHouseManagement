try {
    $.ajax({
        type: "get",
        url: "/api/IdentityLog/GetLoginCount",
        contentType: "application/json; charset=utf-8",
        success: async function (result) {
            $("#loginCount").text(result);
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی GetLoginCount');

            //console.log(ex);
            //console.log(bb);
        }
    });
} catch (e) {
    $("#loginCount").text(0);
}

try {
    $.ajax({
        type: "get",
        url: "/api/CoreReports/GetCompanyLatestInProgressFacilityState",
        contentType: "application/json; charset=utf-8",
        success: async function (result) {
            if (result == null) {
                $("#companyLatestInProgressFacilityState").text("هیچ تسهیلات در جریانی یافت نشد");

            }
            else {

                $("#companyLatestInProgressFacilityState").text(result);
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی GetCompanyLatestInProgressFacilityState');
            $("#companyLatestInProgressFacilityState").html("هیچ تسهیلات در جریانی یافت نشد");
            //console.log(ex);
            //console.log(bb);
        }
    });
} catch (e) {
    $("#companyLatestInProgressFacilityState").text("هیچ تسهیلات در جریانی یافت نشد");
}

try {
    $.ajax({
        type: "get",
        url: "/api/CoreReports/GetCompanyLatestInProgressFacilityProgressPercent",
        contentType: "application/json; charset=utf-8",
        success: async function (result) {
            if (result == null) {
                $("#companyLatestInProgressFacilityProgressPercent").text("هیچ تسهیلات در جریانی یافت نشد");

            }
            else {

                $("#companyLatestInProgressFacilityProgressPercent").html(`<h4 class="my-1 text-dark">${result} %</h4>`);
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی GetCompanyLatestInProgressFacilityProgressPercent');

            $("#companyLatestInProgressFacilityProgressPercent").html("هیچ تسهیلات در جریانی یافت نشد");
            //console.log(ex);
            //console.log(bb);
        }
    });
} catch (e) {
    $("#companyLatestInProgressFacilityProgressPercent").html("هیچ تسهیلات در جریانی یافت نشد");
}