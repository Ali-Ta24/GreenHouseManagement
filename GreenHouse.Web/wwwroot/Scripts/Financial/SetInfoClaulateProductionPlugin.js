(function ($) {

    $.fn.InfoCalculationProduction = function (options) {
        var settings = $.extend({
            facilityRequestId: 0,
            permitions: {},
            rools: []

        }, options);
        var area = this;


        var view = `
<div class="card cardstyle" >
    <div class="card-header bg-light   mb-3" style="font-size: large;text-align: center;" data-bs-toggle="collapse" href="#tt1" aria-expanded="false" aria-controls="tt1">
        اطلاعات محاسبه یارانه دوران مشارکت  (ساخت)</div>
    <div class="card-body" id="subsitCalulateInformation">
       
<div class="row">

  <div class="form-group col-md-3">
    <label for="salesCalculatedToDate">محاسبه یارانه تا تاریخ</label>
    <input type="text" class="form-control datepicker2" id="salesCalculatedToDate"  >
     <small id="salesCalculatedToDate" class="form-text text-muted">تاریخ اتمام محاسبه بر حسب این تاریخ می باشد</small>
 <div class="invalid-feedback">
       وارد کردن تاریخ اجباریست
      </div>
  </div>

  <div class="col-md-3">
${checkPermition("SetInfoCalculationProduction") ?`<button id="btn_saveInfoProduction" type="button" class="btn btn-success " style="margin-top: 20px;margin-right: 20%;"   >ذخیره تغییرات<i class='bx bx-save'></i></button>`:"" }
 
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
                  
                    if (res.salesCalculatedToDate != null && res.salesCalculatedToDate.startsWith('00') == false)
                        $('#salesCalculatedToDate').val(getPerianDate(res.salesCalculatedToDate));
                     
                },
                error: function (ex, cc, bb) {
                    bootbox.alert("خطا در بارگذاری اطلاعات ");

                }
            });

        }

        init();

        area.find("#btn_saveInfoProduction").click(function () {

            if (validation() == false)
                return false;
            loading('btn_saveInfoProduction', true, true);

            $.ajax({
                url: "/api/SubsidyCalculation/PutInformationProduction",
               contentType: 'application/json',
                type: "put",
                data: JSON.stringify({
                    FacilityRequestId: settings.facilityRequestId,
                     SalesCalculatedToDate: shamsiTomiladi($('#salesCalculatedToDate').val()),
                    }),
                async: false,
                success: function (res) {
                    loading('btn_saveInfoProduction', false, true);
                    $('#btn_saveInfoProduction').notify("تغییرات با موفقیت ذخیره شد", "success", {position:"bottom"});
                },
                error: function (ex, cc, bb) {
                    bootbox.alert("خطا در ذخیره اطلاعات ");
                    loading('btn_saveInfoProduction', false, true);

                }
            });


        });

        function validation() {
            
            $('#salesCalculatedToDate').removeClass('is-valid');
            
            let validation = true;
            
            if ($('#salesCalculatedToDate').val() == "") {
                $('#salesCalculatedToDate').addClass('is-invalid');
                validation = false;
            }
            else { $('#salesCalculatedToDate').addClass('is-valid'); }

           
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