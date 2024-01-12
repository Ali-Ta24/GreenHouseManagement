var area = $("#RegisterBankLeasingPaymentTable");
var exceldata = null;
var RegisterBankLeasingPaymentDataTable = area.DataTable({
    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',

    },
    filterable: false,
    select: true,
    info: false,
    searching: false,
    paging: false,
    sorting: false,
    columns: [
        //{ data: "id", name: "id", type: "html" },
        { data: "datePayment", name: "DatePayment", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
        { data: "facilityPercentage", searchable: true, name: "FacilityPercentage", type: "html" },
        { data: "price", name: "Price", searchable: true, type: "html", render: function (data, type, row) { return data.toLocaleString('ar-EG') } },
        { data: "creationTime", name: "CreationTime", type: "html", render: function (data, type, row) { return getPerianDate(data) } }
        /* ,*/

    ]


});//DataTable

RegisterBankLeasingPaymentDataTable.on('xhr', function (event, dt, type, indexes) {
    let $sum = 0;
    if (type != null) {
        $.each(type.data, function (a, b) {
            $sum += parseFloat(b.price);
        });
        $('#RegisterBankGridfooter').html(`<b>جمع مبلغ پرداختی :</b>  ${$sum.toLocaleString('ar-EG')}`);
    }
});

if (checkPermition("RegisterBankLeasingPayment") == false) {
    $('.registerbankLeasing').remove();
}
RegisterBankLeasingPaymentDataTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = RegisterBankLeasingPaymentDataTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined && $('#showType').val() != "Viewable") {
        $("#editRegisterbtn").removeClass("d-none");
        $("#deleteRegisterBtn").removeClass("d-none");
        event.stopPropagation();

    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editRegisterbtn").addClass("d-none");
    $("#deleteRegisterBtn").addClass("d-none");

});

function createOrUpdate(operation) {
    var data = {
        ID: 0,
        FacilityRequestLocalId: $('#FacilityId').val(),
        FacilityPercentage: 0,
        Price: 0,
        DatePayment: new Date(),
        CreationTime: new Date()
    };

    if (operation == 'edit') {
        let valueRowSelect = RegisterBankLeasingPaymentDataTable.rows({ selected: true }).data()[0];
        if (valueRowSelect == undefined) {
            ivsAlert('ابتدا یک ردیف را انتخاب نماید', 'خطا', 'error');
            return false;
        }
        data.ID = valueRowSelect.id;
        data.FacilityPercentage = valueRowSelect.facilityPercentage;
        data.Price = valueRowSelect.price;
        data.DatePayment = valueRowSelect.datePayment;

    }
    var title = 'اصلاح';
    if (operation == 'add') {
        title = 'افزودن';
    }

    $.ajax({
        url: "/FinancialCartable/CrudRegisterBankLeasingPaymen",
        type: "POST",
        data: data,
        async: false,
        success: function (res) {
            bootbox.dialog({
                message: res,
                title: title,
                closeButton: false,
                buttons: {
                    cancel: {
                        label: 'انصراف',
                        className: 'btn btn-danger'
                    },
                    ok: {
                        label: 'تایید',
                        className: 'btn btn-success',
                        callback: function () {
                            var sres = true;

                            if (operation == 'add')
                                sres = addRegister();
                            else
                                sres = editRegister();

                            return sres;
                        }
                    }
                }

            });
        }
    });

}
function editRegister() {

    if ($('#FacilityPercentage').val() == '' || parseFloat($('#FacilityPercentage').val()) <= 0 || parseFloat($('#FacilityPercentage').val()) > 100) {
        ivsAlert2('error', 'خطا', 'نرخ سود تسهیلات را وارد نمایید');

        return false;
    }
    if ($('#Price').val() == '' || $('#Price').val() <= 0) {
        ivsAlert2('error', 'خطا', 'مبلغ تسهیلات را وارد نمایید');
        return false;
    }

    var data = {
        ID: $('#currentId').val(),
        FacilityRequestLocalId: $('#FacilityId').val(),
        FacilityPercentage: $('#FacilityPercentage').val(),
        Price: $('#Price').val(),
        DatePayment: shamsiTomiladi($('#DatePayment').val()),
        CreationTime: shamsiTomiladi($('#DatePayment').val()),

    };
    $.ajax({
        url: "/api/RegisterBankLeasingPaymen/Put",
        data: JSON.stringify(data),
        type: "PUT",
        contentType: 'application/json',
        //dataType: "json",
        success: function () {
            RegisterBankLeasingPaymentDataTable.rows().deselect();
            refreshGridLeasing();

            return true;

        },
        error: function (ex, cc, bb) {

            //console.log(ex);
            //console.log(cc);
            //console.log(bb);
            ivsAlert2('error', "خطا", "خطا در اصلاح رکورد");
            return false;
        },

    });



}
function addRegister() {

    if ($('#FacilityPercentage').val() == '' || $('#FacilityPercentage').val() <= 0 || $('#FacilityPercentage').val() > 100) {
        ivsAlert2('error', 'خطا', 'نرخ سود تسهیلات را وارد نمایید');

        return false;
    }
    if ($('#Price').val() == '' || $('#Price').val() <= 0) {
        ivsAlert2('error', 'خطا', 'مبلغ تسهیلات را وارد نمایید');
        return false;
    }

    var data = {
        ID: 0,
        FacilityRequestLocalId: $('#FacilityId').val(),
        FacilityPercentage: $('#FacilityPercentage').val(),
        Price: $('#Price').val(),
        DatePayment: shamsiTomiladi($('#DatePayment').val()),
        CreationTime: shamsiTomiladi($('#DatePayment').val()),
    };
    $.ajax({
        url: "/api/RegisterBankLeasingPaymen/POST",
        data: JSON.stringify(data),
        type: "POST",
        contentType: 'application/json',
        dataType: "json",
        success: function (res) {
            RegisterBankLeasingPaymentDataTable.rows().deselect();
            refreshGridLeasing();
            return true
        },
        error: function (ex, cc, bb) {
            //console.log(ex);
            //console.log(cc);
            //console.log(bb);
            ivsAlert2('error', "خطا", "خطا در ایجاد رکورد");
            return false;
        },

    });

}

function RemoveRegister() {
    let valueRowSelect = RegisterBankLeasingPaymentDataTable.rows({ selected: true }).data()[0];
    bootbox.confirm("آیا از حذف این پرداختی اطمینان دارید ؟", function (a) {
        if (a) {
            $.ajax({
                url: "/api/RegisterBankLeasingPaymen/delete/?id=" + valueRowSelect.id,
                type: "Delete",
                success: function (res) {
                    RegisterBankLeasingPaymentDataTable.rows().deselect();
                    refreshGridLeasing();
                },
            });
        }
    });
}
if (checkPermition("PurchaseRegisterBankLeasingPayment"))
    $('#kindId').append(`<option value="1">پرداخت های دوران فروش اقساطی</option>`);
if (checkPermition("ConstructionRegisterBankLeasingPayment"))
    $('#kindId').append(`<option value="2">پرداخت های دوران مشارکت</option>`);

function refreshGridLeasing() {

    var url = `/api/RegisterBankLeasingPaymen/GetAll/?Facilityid=${$('#FacilityId').val()} `;
    RegisterBankLeasingPaymentDataTable.ajax.url(url);
    RegisterBankLeasingPaymentDataTable.rows().ajax.reload();

}
refreshGridLeasing();


function ImportExcell() {

    bootbox.dialog({
        title: 'لطفا فایل از نوع Excel را انتخاب نمایید',
        message: `<div class="row">
        <div class="col-md-12">
  <input type="file" name="imageFile" id="file"  />            
</div>
    </div>`,
        buttons: {
            downloadSampel: {
                label: "دریافت فایل نمونه",
                className: "btn btn-warning Sticktoright",
                callback: function () {
                    window.open("/api/RegisterBankLeasingPaymen/GetSampelExcell", '_blank');

                }
            }, danger: {
                label: "انصراف",
                className: "btn btn-Danger"
            },
            success: {
                label: "بارگذاری",
                className: "btn btn-success",
                callback: function () {
                    if ($("#file")[0].files[0] == undefined) {
                        $('#file').notify('ابتدا فایل را انتخاب نمایید ', { position: "left" });
                        return false;
                    }
                    var model = new FormData();
                    model.append("file", $("#file")[0].files[0]);

                    $.ajax({
                        type: "post",
                        url: `/api/RegisterBankLeasingPaymen/GetExelImport`,
                        data: model,
                        processData: false,
                        contentType: false,
                        success: async function (result) {
                            //debugger;
                            //console.log(result);
                            var columns = [];
                            $.each(Object.keys(result[0]), function (a, b) {
                                var Columnname_fa = '';
                                if (b.toLowerCase() === 'Date'.toLowerCase())
                                    Columnname_fa = 'تاریخ پرداخت';
                                else if (b.toLowerCase() === 'Percentage'.toLowerCase())
                                    Columnname_fa = 'نرخ سود تسهیلات';
                                else if (b.toLowerCase() === 'Price'.toLowerCase())
                                    Columnname_fa = 'مبلغ تسهیلات';
                                else {
                                    bootbox.alert('خطا در فرمت وردی نام ستون ها همخوانی ندارد');
                                    throw 'خطا در فرمت وردی نام ستون ها همخوانی ندارد';
                                    return false;
                                }

                                columns.push({ data: b, searchable: false, name: b, title: Columnname_fa, type: "html" });
                            });

                            columns.push({
                                data: 'operations', searchable: false, name: "operations", title: "عملیات", type: "html", render:
                                    function (data, type, row) {
                                        //debugger;
                                        if (data == undefined || data == null) {
                                            return ` <button  onclick='remoedata()' class='btn btn-danger closeStyle'>x</button>`;
                                        } else if (data == 1) { return `<i style='color:green' title='با موفقیت انجام گردید' class='bx bx-check-shield bx-md'>موفق</i>`; }
                                        else if (data == 2) {
                                            let message = `خطا در تبدیل تاریخ فرمت تاریخ باید به صورت 1400/01/01 باشد 
چهار رقم سال و دو رقم ماه و دو رقم روز و بین آنها با اسلش جدا شده باشد`;
                                            return `<i style='color:red' title='${message}' class='bx bx-check-shield bx-md'>ناموفق</i>`
                                        }
                                        else if (data == 3) {
                                            return `<i style='color:red' title='" + row.responseText + "' class='bx bx-check-shield bx-md'>ناموفق</i>`;
                                        }

                                    }
                            });

                            bootbox.dialog({
                                title: "تایید فایل بارگذاری شده",
                                message: "<div><table style='width:100%' id='ConfirmTable'> </table><div>",
                                buttons: {
                                    cancel: {
                                        label: 'انصراف',
                                        className: 'btn btn-danger'
                                    },
                                    ok: {
                                        label: 'تایید و بارگذاری',
                                        className: 'btn btn-success',
                                        callback: function () {
                                            imports();
                                            return false;
                                        }
                                    }
                                }
                            }).init(function () {
                                $('.modal-dialog').last().css('max-width', '90%');
                            });

                            exceldata = $('#ConfirmTable').DataTable({
                                data: result,
                                columns: columns,
                                select: true,
                                language: {
                                    url: '/lib/jQueryDatatable/fa.json'
                                },
                                dom: 'Bfrtip',
                                serverSide: false,
                                buttons: [{
                                    extend: 'excel',
                                    text: 'excel',
                                    filename: 'گزارش ایمپورت ',
                                    exportOptions: {
                                        modifier: {
                                            selected: null
                                        }
                                    }
                                }],

                            });

                            return false;
                        }
                    });


                }
            }
        }
    });

}

function remoedata() {

    setTimeout(function () {
        var xxx = exceldata.rows({ selected: true }).remove().draw(false);

    }, 100);

}
function imports() {
    $('.buttons-excel').last().css('display', 'unset');
    $('.buttons-excel span').last().html("خروجی اکسل");
    $('.buttons-excel').last().append("<i class='bx bxs-file-export'></i>");

    var deletItemHeader = exceldata.rows(1).columns(exceldata.columns()[0].length - 1).nodes();
    for (var i = 0; i < exceldata.rows().data().length; i++) {

        let valueRowSelect = exceldata.row(i).data();

        $(deletItemHeader[0][i]).html('<div id="loderfake"></div>');
        loading('loderfake', true, true);

        if (shamsiTomiladi(valueRowSelect.date) === 'NaN/01/NaN') {
            valueRowSelect.operations = 2;
        }
        else {

            var data = {
                ID: 0,
                FacilityRequestLocalId: $('#FacilityId').val(),
                FacilityPercentage: valueRowSelect.percentage,
                Price: valueRowSelect.price,
                DatePayment: shamsiTomiladi(valueRowSelect.date),
                CreationTime: shamsiTomiladi(valueRowSelect.date),
            };
            $.ajax({
                url: "/api/RegisterBankLeasingPaymen/POST",
                data: JSON.stringify(data),
                type: "POST",
                async: false,
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    valueRowSelect.operations = 1;
                    exceldata.row(i).data(valueRowSelect).draw();

                },
                error: function (ex, cc, bb) {
                    //debugger;
                    //console.log(ex);
                    //console.log(cc);
                    //console.log(bb);
                    if (ex.responseText.indexOf('Could not convert string to DateTime') > -1) {
                        valueRowSelect.operations = 2;
                    } else {
                        valueRowSelect.operations = 3;
                        valueRowSelect.responseText = ex.responseText;
                    }
                    exceldata.row(i).data(valueRowSelect).draw();

                },

            });

        }



    }

    for (var i = 0; i < exceldata.rows().data().length; i++) {
        exceldata.row(i).data(exceldata.row(i).data()).draw();

    }

    $('.bootbox-accept').last().addClass('d-none');
    $('.modal-body').last().notify('عملیات به پایان رسید', 'success', { position: 'rigth' })
    refreshGridLeasing();

}