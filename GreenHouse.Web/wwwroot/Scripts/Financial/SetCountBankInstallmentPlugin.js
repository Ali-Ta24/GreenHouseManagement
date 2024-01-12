(function ($) {

    $.fn.SetCountBankInstallments = function (options) {
        var settings = $.extend({
            facilityRequestId: 0,
            permitions: {},
            rools: []

        }, options);
        var area = this;


        var view = `
<div class="card cardstyle" >
    <div class="card-header bg-light   mb-3" style="font-size: large;text-align: center;" data-bs-toggle="collapse" href="#tt1" aria-expanded="false" aria-controls="tt1">
        اطلاعات محاسبه یاران  (خرید)</div>
    <div class="card-body" id="subsitCalulateInformation">
       
<div class="row">
  <div class="form-group col-md-3">
    <label for="salesCalculatedFromDate">تاریخ شروع اقساط</label>
    <input type="text" class="form-control datepicker2" id="salesCalculatedFromDate"  >
     <small id="salesCalculatedFromDate" class="form-text text-muted">تاریخ شروع اقساط بر حسب این تاریخ می باشد</small>
 <div class="invalid-feedback">
       وارد کردن تاریخ اجباریست
      </div>
  </div>

<div class="form-group col-md-3">
    <label for="SalesDuration">مدت اقساط</label>
    <input type="number" class="form-control" id="SalesDuration" required >
     <small id="SalesDuration" class="form-text text-muted">مدت اقساط تسهیلات به ماه می باشد</small>
    <div class="invalid-feedback">
        لطفا مقدار مدت اقساط را وارد نمایید
      </div>
  </div>
    <div class="form-group col-md-3">
    <label for="FacilityBankInterest">نرخ سود تسهیلات</label>
    <input type="number" class="form-control" id="FacilityBankInterest" required >
     <small id="FacilityBankInterest" class="form-text text-muted">نرخ سود به صورت درصدی وارد نمایید</small>
     <div class="invalid-feedback">
        لطفا مقدار سود تسهیلات را وارد نمایید
      </div>
  </div>
  <div class="col-md-3">
${checkPermition("SetCountBankInstallments") ? `<button id="btn_saveInfo" type="button" class="btn btn-success " style="margin-top: 20px;margin-right: 20%;"   >ذخیره تغییرات<i class='bx bx-save'></i></button>` : ""}
 
</div>
</div>
</br>
<hr/>

</br>

    </div>
    </div>

`;

        area.html(view);
        area.find('.datepicker2').persianDatepicker({
            format: 'YYYY/MM/DD',
            autoClose: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            observer: true,
        });
        area.find('.datepicker-plot-area').css('z-index', '50000');

        function init() {
            loading('subsitCalulateInformation', true, false);


            $.ajax({
                url: "/api/SubsidyCalculation/GetCalculatedSubsidInformation?FacilityRequestId=" + settings.facilityRequestId,
                type: "Get",
                async: false,
                success: function (res) {
                    loading('subsitCalulateInformation', false, false);
                    //debugger;
                    if (res.salesCalculatedFromDate != null && res.salesCalculatedFromDate.startsWith('00') == false)
                        $('#salesCalculatedFromDate').val(getPerianDate(res.salesCalculatedFromDate));

                    $('#SalesDuration').val(res.salesDuration);
                    $('#FacilityBankInterest').val(res.facilityBankInterest);

                },
                error: function (ex, cc, bb) {
                    bootbox.alert("خطا در بارگذاری اطلاعات ");

                }
            });

        }

        init();

        area.find("#btn_saveInfo").click(function () {

            if (validation() == false)
                return false;
            loading('btn_saveInfo', true, true);

            $.ajax({
                url: "/api/SubsidyCalculation/PutInformation",
                contentType: 'application/json',
                type: "put",
                data: JSON.stringify({
                    FacilityRequestId: settings.facilityRequestId,
                    SalesCalculatedFromDate: shamsiTomiladi($('#salesCalculatedFromDate').val()),
                    SalesCalculatedToDate: null,
                    SalesDuration: $('#SalesDuration').val(),
                    FacilityBankInterest: $('#FacilityBankInterest').val()
                }),
                async: false,
                success: function (res) {
                    loading('btn_saveInfo', false, true);
                    $('#btn_saveInfo').notify("تغییرات با موفقیت ذخیره شد", "success", { position: "bottom" });
                },
                error: function (ex, cc, bb) {
                    bootbox.alert("خطا در ذخیره اطلاعات ");
                    loading('btn_saveInfo', false, true);

                }
            });


        });

        function validation() {
            $('#salesCalculatedFromDate').removeClass('is-valid');
            $('#salesCalculatedToDate').removeClass('is-valid');
            $('#SalesDuration').removeClass('is-valid');
            $('#FacilityBankInterest').removeClass('is-valid');
            $('#salesCalculatedFromDate').removeClass('is-invalid');
            $('#SalesDuration').removeClass('is-invalid');
            $('#FacilityBankInterest').removeClass('is-invalid');

            let validation = true;

            if ($('#salesCalculatedToDate').val() == "") {
                $('#salesCalculatedToDate').addClass('is-invalid');
                validation = false;
            }
            else { $('#salesCalculatedToDate').addClass('is-valid'); }

            if ($('#salesCalculatedFromDate').val() == "") {
                $('#salesCalculatedFromDate').addClass('is-invalid');
                validation = false;
            }
            else { $('#salesCalculatedFromDate').addClass('is-valid'); }

            if ($('#SalesDuration').val() == "" || $('#SalesDuration').val() == 0 || parseInt($('#SalesDuration').val()) < 0) {
                validation = false;
                $('#SalesDuration').addClass('is-invalid');
            }
            else { $('#SalesDuration').addClass('is-valid'); }

            if ($('#FacilityBankInterest').val() == "" || $('#FacilityBankInterest').val() == 0 || parseInt($('#FacilityBankInterest').val()) < 0 || $('#FacilityBankInterest').val() > 100) {
                $('#FacilityBankInterest').addClass('is-invalid');
                validation = false;
            }
            else { $('#FacilityBankInterest').addClass('is-valid'); }

            if (validation == false) {
                return false;
            }
            else {

                return true;
            }
        }

        return this;
    }



})(jQuery);