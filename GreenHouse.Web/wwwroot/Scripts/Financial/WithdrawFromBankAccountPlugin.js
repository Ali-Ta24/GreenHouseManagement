var permitions = {};
(function ($) {

    $.fn.WithdrawFromBankAccount = function (options) {
        var settings = $.extend({
            facilityRequestId: null,
            permitions: {},
            rools: [],

        }, options);
        var area = this;
        var Gridview = `
        <div class="card">
    <div class="card-body">

          <div class="sticky" style="">
            <button type="button" class="btn btn-success" id="btnAddWithdraw"><i class="bx bx-message-square-add"></i> ایجاد</button>
            <button id="editBtnWithdraw" type="button" class="btn btn-warning  d-none" onclick="createOrUpdate('edit');"><i class="bx bx-message-square-edit "></i>ویرایش  </button>
            <button id="deleteBtnWithdraw" type="button" class="btn btn-danger  d-none" onclick="RemoveRegister();"><i class="bx bx-comment-minus"></i> حذف</button>           
        </div>
    </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-md-12">

            <table id="WithdrawGrid" class="table table-striped table-responsive" style="width:100%">
                <thead>
                    <tr>
                        <th>نوع</th>
                        <th>تاریخ برداشت</th>
                        <th>مبلغ</th>
                        <th>توضیحات</th>
                       
                        </tr>
                </thead>
                <tbody>
                <thead>
                <tr style="background-color: goldenrod;">
                  <td><b>جمع مبلغ:</b></td> <td colspan="4" style="text-align: right;" id="WithdrawGridfooter"></td>
                </tr>
                </thead>
                </tbody>

            </table>

        </div>
    </div>
<br />`
        area.append(Gridview);

        var WithdrawGridDataTable = $("#WithdrawGrid").DataTable({
            //serverSide: true, //make server side processing to true
            ajax:
            {
                contentType: 'application/json',
                url: '/api/WithdrawFromBankAccount/GetByFacilityId?ID=' + settings.facilityRequestId, //url of the Ajax source,i.e. web api method
            },
            searching: false,
            destroy: true,
            processing: true,
            orderCellsTop: true,
            select: true,
            info: true,
            serverSide: true,
            columns: [

                {
                    data: "programTypekindName", name: "programTypekindName", type: "html", render: function (data, type, row) {
                        if (row.programTypekindId == 1)
                            return "دوران فروش اقساطی"
                        else if (row.programTypekindId == 2)
                            return "دوران مشارکت"
                    }
                },
                { data: "withdrawDate", name: "withdrawDate", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
                { data: "price", name: "Price", type: "html", render: function (data, type, row) { return data.toLocaleString('ar-EG') } },
                { data: "descript", name: "descript", type: "html" },
                //{ data: "creationTime", name: "creationTime", type: "html", render: function (data, type, row) { return getPerianDateTime(data) } },
                /* ,*/

            ],
            paginationType: "full_numbers",
            language: {
                url: '/lib/jQueryDatatable/fa.json'
            },
        });//DataTable

        WithdrawGridDataTable.on('xhr', function (event, dt, type, indexes) {
            let $sum = 0;
            if (type != null) {
                $.each(type.data, function (a, b) {
                    $sum += parseFloat(b.price);
                });
                $('#WithdrawGridfooter').html(`<b> ${$sum.toLocaleString('ar-EG')}</b>`);
            }
        });

        WithdrawGridDataTable.on('select', function (event, dt, type, indexes) {
            let valueRowSelect = WithdrawGridDataTable.rows({ selected: true }).data()[0];

            if (valueRowSelect != undefined) {
                $("#editBtnWithdraw").removeClass("d-none");
                $("#deleteBtnWithdraw").removeClass("d-none");

                event.stopPropagation();
            }

        }).on('deselect', function (event, dt, type, indexes) {
            $("#editBtnWithdraw").addClass("d-none");
            $("#deleteBtnWithdraw").addClass("d-none");

        });


        var viewEditorcreate = `
             <div class="card-body" id="tt4">
         <div class="row">
            <div class="col-md-12">
                <div class="input-group mb-3">
                    <div class="input-group-append" style="min-width: 110px;">
                        <span class="input-group-text" id="basic-addon2">نوع برداشت </span>
                    </div>
                <select id="programKindId" class="form-control programKindId" placeholder="نوع برداشت " aria-label="" aria-describedby="basic-addon2" >
                  <option value="" disabled selected hidden>نوع برداشت را انتخاب نمایید</option>
                  <option value="1">دوران فروش اقساطی</option>
                  <option value="2">دوران مشارکت</option>
                    </select>
                  
                </div>
            </div>
            </div>
         <div class="row">
            <div class="col-md-12">
                <div class="input-group mb-3">
                    <div class="input-group-append" style="min-width: 110px;">
                        <span class="input-group-text" id="basic-addon2">تاریخ برداشت</span>
                    </div>
                    <input id="WithdrawDate" type="text" class="form-control datepicker2" placeholder="تاریخ برداشت " aria-label="" aria-describedby="basic-addon2">
                </div>
            </div>
            </div>
            <div class="row">
            <div class="col-md-12">
                <div class="input-group mb-3">
                    <div class="input-group-append" style="min-width: 110px;">
                        <span class="input-group-text" id="basic-addon2">مبلغ برداشت</span>
                    </div>
                    <input id="WithdrawPrice" type="text" class="form-control" placeholder="مبلغ برداشت " aria-label="" aria-describedby="basic-addon2">
                </div>
            </div>
            </div> 
            <div class="row">
            <div class="col-md-12">
                <div class="input-group mb-3">
                    <div class="input-group-append" style="min-width: 110px;">
                        <span class="input-group-text" id="basic-addon2">توضیحات</span>
                    </div>
                    <textarea id="WithdrawDescript"   class="form-control" placeholder="توضیحات" aria-label="" aria-describedby="basic-addon2"></textarea>
                </div>
            </div>
            </div>



            </div>
        `;
        area.find("#btnAddWithdraw").click(function () {

            $.ajax({
                url: "/api/Program/GetAllProgramTypeKinds",
                type: "Get",
                async: false,
                success: function (res) {
                    var options = '';
                    $.each(res, function (a, b) {
                        options += `<option value="${b.id}">${b.title}</option>`;
                    });

                    viewEditorcreate = viewEditorcreate.replace("@@options", options);
                }

            });

            bootbox.dialog({
                message: viewEditorcreate,
                title: "ثبت برداشت یارانه",
                buttons: {

                    OK: {
                        label: '<i class="fa fa-check"></i> تایید',
                        className: "okBtn btn-success",
                        callback: function () {
                            return additem();
                        }
                    },
                    cancel: {
                        label: '<i class="fa fa-times"></i> انصراف',
                        className: "btn-danger",

                    },
                },

            }).init(function () {
                $('.datepicker2').persianDatepicker({
                    format: 'YYYY/MM/DD',
                    autoClose: true,
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    observer: true,
                });

                $('.datepicker-plot-area').css('z-index', '50000');
                var costEstimate = new Cleave('#WithdrawPrice', {
                    numeral: true,
                    numeralThousandsGroupStyle: 'thousand',
                });
                //$('#programKindId').select2({
                //    dropdownParent: $('#tt4'),
                //    placeholder: "یک نوع را انتخاب نمایید",
                //    width: "60%",
                //    height:"50px"
                //})
            });

        });

        area.find("#editBtnWithdraw").click(function () {
            let valueRowSelect = WithdrawGridDataTable.rows({ selected: true }).data()[0];
            if (valueRowSelect == undefined || valueRowSelect == null) {
                ivsAlert2('error', "خطا", "ابتدا یک ردیف را انتخاب نمایید ");
                return false;
            }

            $.ajax({
                url: "/api/Program/GetAllProgramTypeKinds",
                type: "Get",
                async: false,
                success: function (res) {
                    var options = '';
                    $.each(res, function (a, b) {
                        if (b.id == valueRowSelect.programTypekindId)
                            options += `<option value="${b.id}" selected>${b.title}</option>`;
                        //else 
                        //    options += `<option value="${b.id}">${b.title}</option>`;

                    });

                    viewEditorcreate = viewEditorcreate.replace("@@options", options);
                }

            });

            bootbox.dialog({
                message: viewEditorcreate,
                title: "اصلاح برداشت از حساب",
                buttons: {

                    OK: {
                        label: '<i class="fa fa-check"></i> تایید',
                        className: "okBtn btn-success",
                        callback: function () {
                            edititem();
                        }
                    },
                    cancel: {
                        label: '<i class="fa fa-times"></i> انصراف',
                        className: "btn-danger",

                    },
                },

            }).init(function () {
                $('.datepicker2').persianDatepicker({
                    format: 'YYYY/MM/DD',
                    autoClose: true,
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    observer: true,
                });

                $('.datepicker-plot-area').css('z-index', '50000');
                var costEstimate = new Cleave('#WithdrawPrice', {
                    numeral: true,
                    numeralThousandsGroupStyle: 'thousand',
                });

                $('#WithdrawDescript').val(valueRowSelect.descript);
                $('#WithdrawPrice').val(valueRowSelect.price);
                $('#WithdrawDate').val(getPerianDate(valueRowSelect.withdrawDate));
            });
        });

        area.find("#deleteBtnWithdraw").click(function () {

            bootbox.confirm("آیا از حذف این رکورد اطمینان دارید؟", function (res) {
                if (res) {
                    Removeitem();
                }

            });
        });

        function additem() {
            if ($('#programKindId').val() == null || $('#programKindId').val() == undefined) {
                $('#programKindId').notify("انتخاب یک گزینه اجباری است");
                return false;
            }

            $.ajax({
                type: "post",
                url: "/api/WithdrawFromBankAccount/Post",
                contentType: 'application/json',
                data: JSON.stringify({
                    FacilityRequestId: settings.facilityRequestId,
                    WithdrawDate: shamsiTomiladi($('#WithdrawDate').val()),
                    Descript: $('#WithdrawDescript').val(),
                    Price: $('#WithdrawPrice').val(),
                    ProgramTypekindId: $('#programKindId').val(),
                    ID: 0,

                }),
                success: function (result) {

                    ivsAlert2('success', "موفقیت", "عملیات ثبت با موفقیت انجام شد");
                    $('#create_editBank').modal('hide');
                    WithdrawGridDataTable.rows().deselect();
                    WithdrawGridDataTable.ajax.reload();
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', "خطا", "خطا در افزودن ");
                    //console.log(ex);
                    //console.log(bb);
                    return false;
                },
            });
        }

        function edititem() {
            let valueRowSelect = WithdrawGridDataTable.rows({ selected: true }).data()[0];
            $.ajax({
                type: "put",
                url: "/api/WithdrawFromBankAccount/PUT",
                contentType: 'application/json',
                data: JSON.stringify({
                    FacilityRequestId: settings.facilityRequestId,
                    WithdrawDate: shamsiTomiladi($('#WithdrawDate').val()),
                    Descript: $('#WithdrawDescript').val(),
                    Price: $('#WithdrawPrice').val(),
                    ID: valueRowSelect.id,
                    ProgramTypekindId: $('#programKindId').val()

                }),
                success: function (result) {

                    ivsAlert2('success', "موفقیت", "عملیات ثبت با موفقیت انجام شد");
                    $('#create_editBank').modal('hide');
                    WithdrawGridDataTable.rows().deselect();
                    WithdrawGridDataTable.ajax.reload();
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', "خطا", "خطا در اصلاح ");
                    //console.log(ex);
                    //console.log(bb);
                    return false;
                },
            });

        }

        function Removeitem() {

            let valueRowSelect = WithdrawGridDataTable.rows({ selected: true }).data()[0];
            $.ajax({
                type: "Delete",
                url: "/api/WithdrawFromBankAccount/Delete?ID=" + valueRowSelect.id,
                contentType: 'application/json',
                success: function (result) {

                    ivsAlert2('success', "موفقیت", "عملیات حذف با موفقیت انجام شد");
                    $('#create_editBank').modal('hide');
                    WithdrawGridDataTable.rows().deselect();
                    WithdrawGridDataTable.ajax.reload();
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', "خطا", "خطا در حذف ");
                    //console.log(ex);
                    //console.log(bb);
                    return false;
                },
            });

        }

        return this;
    }



})(jQuery);

$('#closeForm').click(function () {

    bootbox.hideAll();
});
