
$.ajax({
    url: "/api/SubsidyCalculation/Get?ID=" + id,
    type: "Get",
    success: function (res) {
        //$('#btn_Calculate').prop('disabled', '');

        $('#companyName_1').html(res.companyName);
        $('#bankname').html(res.bankName);
        $('#SalesOrganizationPrice').html(res.organizationPrice.toLocaleString('ar-EG'));
        $('#SalesFacilityBankInterest').html(res.salesFacilityBankInterest);
        $('#SalesDuration').html(res.salesDuration);
        $('#SalesOrganizationInterest').html(res.organizationInterest);
        $('#salesCalculatedFromDate').html(getPerianDate(res.salesCalculatedFromDate));

        if (res.confirmSubsidyCalculation == true) {
            $('#btn_save').remove();
            $('#btn_Calculate').remove();
            $('#btn_ssve_header').html(`<span><b style="color:red">*</b>یارانه محاسبه و تایید شده است</span>`);
        }
        else {
            if (checkPermition("ConfirmSubsidyCalculation") == false) {
                $('#btn_save').remove();
            }

            if (checkPermition("SetSubsidyCalculation") == false) {
                $('#btn_Calculate').remove();

            }
        }

    }
});
var area = $("#bankBranchtable");

var ProgramDataTableCalc = area.DataTable({
    ajax:
    {
        contentType: 'application/json',
        url: "/api/SubsidyCalculation/GetCalculatedSubsidy?ID=" + id
    },
    searching: false,
    select: true,
    info: false,
    order: [[1, 'asc']],
    columns: [
        { data: "radif", name: "radif", type: "html" },
        { data: "date", name: "date", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
        { data: "amountInstallment", name: "amountInstallment", type: "number", render: function (data, type, row) { return data.toLocaleString('ar-EG') } },
        { data: "principleOfTheInstallment", name: "principleOfTheInstallment", type: "number", render: function (data, type, row) { return data.toLocaleString('ar-EG') } },
        { data: "interestOnInstallments", name: "interestOnInstallments", type: "number", render: function (data, type, row) { return data.toLocaleString('ar-EG') } },
        { data: "organizationSubsidy", name: "organizationSubsidy", type: "number", render: function (data, type, row) { return data.toLocaleString('ar-EG') } },

    ],
    footerCallback: function (row, data, start, end, display) {
        var api = this.api();

        // Remove the formatting to get integer data for summation
        var intVal = function (i) {
            return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
        };

        var total2 = api
            .column(2)
            .data()
            .reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        $(api.column(2).footer()).html(total2.toLocaleString('ar-EG'));

        var total3 = api
            .column(3)
            .data()
            .reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        $(api.column(3).footer()).html(total3.toLocaleString('ar-EG'));
        // Total over all pages
        var total4 = api
            .column(4)
            .data()
            .reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        $(api.column(4).footer()).html(total4.toLocaleString('ar-EG'));

        var total5 = api
            .column(5)
            .data()
            .reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        $(api.column(5).footer()).html(total5.toLocaleString('ar-EG'));
    },

});

function btncalculate() {
    loading('btn_Calculate', true, true);

    $.ajax({
        url: "/api/SubsidyCalculation/Calculate?ID=" + id,
        type: "Get",
        success: function (res) {
            ProgramDataTableCalc.rows().ajax.reload();
            $('#btn_save').css('display', '');
            loading('btn_Calculate', false, true);

        }, error: function (re, se) {
            ivsAlert2('error', "خطا", "خطا در محاسبه یارانه");
            //console.log(re);
            loading('btn_Calculate', false, true);
        }

    });
};


function btnsave() {

    loading('btn_save', true, true);

    $.ajax({
        url: "/api/SubsidyCalculation/SaveCalculations?FacilityId=" + id,
        type: "Get",
        dataType: "json",
        success: function (res) {

            $('#btn_Calculate').css("display", "none")
            $('#btn_save').css("display", "none")
            ivsAlert2('success', "موفقیت", "محاسبات با موفقیت ذخیره شدند.");

        }
        , error: function (re, se) {
            ivsAlert2('error', "خطا", "خطا د ذخیره اطلاعات");
            //console.log(re);
            //console.log(se);
        }
    });

}

