(function ($) {

    $.fn.SubsidyCalculationProduction = function (options) {
        var settings = $.extend({
            facilityRequestId: 0,
            permitions: {},
            rools: []

        }, options);
        var area = this;

        var view = `
        <div class="card">
            
        <div class="card-header bg-light" style="text-align:center;"><b>محاسبه یارانه دوران مشارکت (ساخت)</b>
        </div>
<div class="card-body">
        <div class="" style="">

            <div class="alert alert-info">
                <div class="row">
                    <div class="col-md-5">
                        <span><b>نام گیرنده تسهیلات :</b></span>
                        <span id="companyName2"></span>
                    </div>
                    <div class="col-md-4">
                        <span><b>نام بانک :</b></span>
                        <span id="bankname2"></span>
                    </div>
                    <div class="col-md-3">
                        <span><b>مبلغ اصل تسهیلات :</b></span>
                        <span id="SalesOrganizationPrice2"></span>
                    </div>
                </div>
                <hr />
                <div class="row" style="margin-top:15px;">
                                      
                    <div class="col-md-3">
                        <span><b>درصد یارانه سازمان: </b></span>
                        <span id="SalesOrganizationInterest2"></span>%
                    </div>
                    <div class="col-md-5">
                        <span><b>محاسبه سود تا تاریخ : </b></span>
                        <span id="salesCalculatedToDate2"></span>
                    </div>


                </div>
                <hr />
                <div class="row" style="margin-top:15px;">
                    
                    <div class="col-md-3">
                        <button id="btn_ProductionCalculate" type="button" class="btn btn-warning ">محاسبه یارانه<i class='bx bx-calculator'></i></button>
                    </div>
                    <div class="col-md-3" id="btn_ssve_header">
                        <button id="btn_Productionsave" type="button" class="btn btn-success "  >تایید محاسبات<i class='bx bx-save'></i></button>
                    </div>
                  

                </div>


            </div>

        </div>

    <div class="row">
<table id="RegisterBankLeasingPaymentgrid" class="col-md-12 table table-striped table-responsive" style="width:100%">
            <thead>
                <tr>
                    <th>تاریخ پرداخت</th>
                    <th>نرخ سود تسهیلات </th>
                    <th>مبلغ تسهیلات پرداخت  </th>
                    <th>تاریخ ثبت</th>
                    <th>مدت به روز</th>                    
                    <th>مبلغ سود</th>
                    <th>مبلغ سهم سازمان</th>
                    
                </tr>
            </thead>
            <tbody>
            </tbody>
            <thead>
                <tr style="background-color: goldenrod;">
                    <td colspan="2" style="text-align: right;" ><b>جمع پرداختی :</b></td>
                    <td style="text-align: right;" id="sumOfPrice"></td>
                    <td colspan="2" style="text-align: right;"  ></td>
                    <td style="text-align: right;" id="sumOfsod"></td>
                    <td style="text-align: right;" id="sumOforganazition"></td>

                </tr>
            </thead>
        </table>
</div>


    </div>
</div>
            `;

        area.html(view);

        $.ajax({
            url: "/api/SubsidyCalculation/Get?ID=" + id,
            type: "Get",
            success: function (res) {


                $('#companyName2').html(res.companyName);
                $('#bankname2').html(res.bankName);
                $('#SalesOrganizationPrice2').html(res.organizationPrice.toLocaleString('ar-EG'));
                $('#SalesFacilityBankInterest2').html(res.salesFacilityBankInterest);
                $('#SalesDuration2').html(res.salesDuration);
                $('#SalesOrganizationInterest2').html(res.organizationInterest);
                $('#salesCalculatedToDate2').html(getPerianDate(res.calculatedToDate));
                //debugger;
                if (res.confirmProductionSubsidyCalculation == true) {
                    area.find('#btn_Productionsave').remove();
                    area.find('#btn_ProductionCalculate').remove();
                    area.find('#btn_ssve_header').html(`<span><b style="color:red">*</b>یارانه محاسبه و تایید شده است</span>`);
                }
                else {
                    if (checkPermition("ConfirmProductionSubsidyCalculation") == false) {
                        area.find('#btn_Productionsave').remove();
                    }

                    if (checkPermition("SetSubsidyCalculation") == false) {
                        area.find('#btn_ProductionCalculate').remove();

                    }
                }

            }
        });

        var RegisterBankLeasingPaymentGrid = $('#RegisterBankLeasingPaymentgrid').DataTable({
            //serverSide: true, //make server side processing to true
            ajax:
            {
                contentType: 'application/json',
                url: `/api/RegisterBankLeasingPaymen/GetAll/?Facilityid=${settings.facilityRequestId}`,
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
                { data: "facilityPercentage", searchable: true, name: "FacilityPercentage", type: "html", render: function (data, type, row) { return '% ' + data } },
                { data: "price", name: "Price", searchable: true, type: "html", render: function (data, type, row) { return data != null ? data.toLocaleString('ar-EG') : "" } },
                { data: "creationTime", name: "CreationTime", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
                { data: "duration", name: "duration", type: "html", render: function (data, type, row) { return data } },
                { data: "interestAmount", name: "interestAmount", type: "html", render: function (data, type, row) { return data != null ? data.toLocaleString('ar-EG') : "" } },
                { data: "sharOfPriceOrganization", name: "sharOfPriceOrganization", type: "html", render: function (data, type, row) { return data != null ? data.toLocaleString('ar-EG') : "" } },

                /* ,*/

            ]


        });//DataTable
        RegisterBankLeasingPaymentGrid.on('xhr', function (event, dt, type, indexes) {
            let $sum = 0;
            let $sumsode = 0;
            let $sumorg = 0;
            if (type != null) {
                $.each(type.data, function (a, b) {
                    $sum += parseFloat(b.price);
                    $sumsode += parseFloat(b.interestAmount);
                    $sumorg += parseFloat(b.sharOfPriceOrganization);

                });
                if ($sum > 0)
                    $('#sumOfPrice').html($sum.toLocaleString('ar-EG'));
                if ($sumsode > 0)
                    $('#sumOfsod').html($sumsode.toLocaleString('ar-EG'));
                if ($sumorg > 0)
                    $('#sumOforganazition').html($sumorg.toLocaleString('ar-EG'));
            }
        });


        $('#btn_ProductionCalculate').click(function () {

            loading('btn_ProductionCalculate', true, true);
            loading('btn_Productionsave', true, true);
            $.ajax({
                url: "/api/SubsidyCalculation/CalculateProduction?FacilityRequestId=" + settings.facilityRequestId,
                type: "Get",
                success: function (res) {
                    RegisterBankLeasingPaymentGrid.rows().ajax.reload();
                    $('#btn_Productionsave').css('display', '');
                    $('#btn_ProductionCalculate').notify("محاسبه با موفقیت انجام گردید ", "success", { "elementPosition": "left middle" });
                    loading('btn_ProductionCalculate', false, true);
                    loading('btn_Productionsave', false, true);

                }, error: function (re, se) {
                    if (re.responseText.indexOf('ErrorCode(1003)') > -1)
                        ivsAlert2('error', "خطا", "محاسبات از قبل تایید شده است");
                    else
                        ivsAlert2('error', "خطا", "خطا در محاسبه یارانه");
                    //console.log(re);
                    loading('btn_ProductionCalculate', false, true);
                    loading('btn_Productionsave', false, true);
                }

            });
        });


        $('#btn_Productionsave').click(function () {

            bootbox.confirm("آیا از تایید محاسبات اطمینان دارید؟", function (ok) {
                if (ok) {

                    loading('btn_Productionsave', true, true);
                    loading('btn_ProductionCalculate', true, true);
                    $.ajax({
                        url: "/api/SubsidyCalculation/ConfirmCalculateProduction?FacilityRequestId=" + settings.facilityRequestId,
                        type: "Get",
                        success: function (res) {
                            RegisterBankLeasingPaymentGrid.rows().ajax.reload();
                            $('#btn_Productionsave').css('display', 'none');
                            $('#btn_ProductionCalculate').css('display', 'none');
                            $('#btn_Productionsave').notify("محاسبه با موفقیت  تایید گردید ", "success", { "elementPosition": "left middle" });
                            loading('btn_Productionsave', false, true);

                        },
                        error: function (re, se) {
                            if (re.responseText.indexOf('ErrorCode(1002)') > -1)
                                ivsAlert2('error', "خطا", "لطفا ابتدا محاسبه را انجام دهید سپس آن را تایید فرمایید");
                            else
                                ivsAlert2('error', "خطا", "خطا در تایید یارانه");
                            //console.log(re);
                            loading('btn_Productionsave', false, true);
                            loading('btn_ProductionCalculate', false, true);
                        }

                    });

                }
            });
        });




        return this;
    }

})(jQuery);