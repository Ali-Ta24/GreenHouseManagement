try {
    $.ajax({
        type: "get",
        url: "/api/FinancialReport/GetTotalInFinancialProgressFacilities",
        contentType: "application/json; charset=utf-8",
        success: async function (result) {
            $("#totalInFinancialProgressFacilities").text(result);
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی مجموع تسهیلات موجود در فرایند پیشرفت مالی');
        }
    });
} catch (e) {
    $("#totalInFinancialProgressFacilities").text(0);
}