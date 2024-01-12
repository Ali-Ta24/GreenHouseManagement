(function ($) {

    $.fn.SetDetailAccound = function (options) {
        var settings = $.extend({
            facilityRequestId: 0,
            permitions: {},
            rools: []

        }, options);
        var area = this;

        var fetchCartableRecord = ProgramDataTableCartable.rows({ selected: true }).data()[0];
        var view = `
                <div class="card cardstyle" >
    
                    <div class="card-body" id="subsitCalulateInformation">
       
                <div class="row">
                  <div class="form-group col-md-3">
                    <label for="DetailAccountCodeval">کد تفصیلی</label>
                    <input type="text" class="form-control datepicker2" id="DetailAccountCodeval"  value="${fetchCartableRecord.detailAccountCode != null ? fetchCartableRecord.detailAccountCode : ""}" />
                     <small id="DetailAccountCodeval" class="form-text text-muted">کد تفصیلی که در سیستم نماد به طرح اختصاص یافته است</small>
                 <div class="invalid-feedback">
                       وارد کردن کد اجباریست
                      </div>
                  </div>

                  <div class="col-md-3">
                 <button id="btn_saveInfo" type="button" class="btn btn-success " style="margin-top: 20px;margin-right: 20%;"   >ذخیره تغییرات<i class='bx bx-save'></i></button> 
 
                </div>
                </div>
                </br>
                <hr/>

                </br>

                    </div>
                    </div>

        `;

        area.html(view);
        $('#btn_saveInfo').click(function () {

            //if (checkPermition("SetDetailAccount") == false) {
            //    bootbox.alert("You Don't Permission To use this Feature");
            //    return false;
            //}

            bootbox.confirm("آیا از تغییر کد تفصیلی اطمینان دارید ؟", function (isok) {
                if (isok) {
                    loading('btn_saveInfo', true, true);

                    $.ajax({
                        url: `/api/FacilityRequestLocal/FacilityRequestSetDetailAccountCode`,
                        contentType: 'application/json',
                        type: "PUT",
                        data: JSON.stringify({
                            FacilityRequestId: settings.facilityRequestId,
                            DetailAccountCode: $('#DetailAccountCodeval').val()
                        }),
                        success: function (res) {
                            $('#btn_saveInfo').notify("ثبت با موفقیت انجام شد", "success");
                            loading('btn_saveInfo', false, true);
                        },
                        error: function (ex, cc, bb) {

                            loading('btn_saveInfo', false, true);
                            ivsAlert('اشکال در ثبت', 'خطا', 'error');
                            //console.log(ex);
                            //console.log(bb);

                        },


                    });

                }
            });


        });


        return this;
    }



})(jQuery);