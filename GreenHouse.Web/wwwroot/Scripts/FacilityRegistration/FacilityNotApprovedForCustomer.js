(function ($) {
    $.fn.FacilityNotApprovedForCustomer = function (options) {
        var settings = $.extend({
            objectID: null,
            getAllFacilityRequestsApiAddress: '/api/Facility/GetAllFacilityRequests',
            gridHeight: 500,
            addTemplate: true,
        }, options);

        var viewModel = undefined;
        var area = this;


        if (settings.addTemplate) {
            area.html(getTemplate());
        }
        buildInterface();

        function buildInterface() {
            GetAllFacilityRequests();
        }

        function GetAllFacilityRequests() {
            //loading('widjetProgramTable', true, false);
            $.ajax({
                url: settings.getAllFacilityRequestsApiAddress,
                success: function (result) {
                    //loading('widjetProgramTable', false, false);
                    //console.log({ result });
                    if (result.data.length == 0) {
                        let detailTab = area.find('#widjetProgramTable')[0];
                        detailTab.innerHTML += `
                          <tr>
                              <td colspan="5" style="text-align:center">هیچ تسهیلاتی ثبت نشده است</td>
                         </tr>
                          `;

                    } else
                        if (result != null) {
                            var countRequest = 0;
                            let detailTab = area.find('#widjetProgramTable')[0];
                            result.data.forEach(item => {
                                if (item.workflowInstanceID == null) {
                                    countRequest++;
                                }
                                detailTab.innerHTML += `
                                  <tr>
                                      <td>${item.code}</td>
                                      <td>${getPerianDate(item.creationTime)}</td>
                                      <td>${getPerianDate(item.finalizationTime)}</td>
                                      <td>`+ setNameForNullValues(item.workflowCurrentStepTitle) + ` </td>
                                      <td>`+ setFacilityRequestTotalState(item.facilityRequestTotalState) + `</td>
                                 </tr>
                                `
                            });
                            if (countRequest > 0) {
                                area.find('#countRequest').html(cardAlert(`کاربر گرامی شما ${countRequest} درخواست نهائی نشده دارید. جهت بازبینی و نهائی سازی درخواست‌ها و ارسال به کمیته برای بررسی <a href="/FacilityRegistration/Cartable">اينجا</a> کنید`, 'هشدار درخواست‌ها', 'warning', true));
                            }

                        }
                        else {

                            //console.log("error");
                        }

                },
                error: function (ex, cc, bb) {
                    //loading('widjetProgramTable', false, false);

                    if (bb == 'Unauthorized') {
                        showErrorServerWithOutClose('شما دسترسی لازم برای مشاهده اطلاعات شرکت های دیگر را ندارید', 'خطای دسترسی', 'danger');
                    } else if (ex.status == 500) {

                        showErrorServerWithOutClose('card-body', 'تسهیلات یافت نشد');
                    }
                    else if (ex.status == '404') {

                        showErrorServerWithOutClose('اشکال در برقراری ارتباط با سرور', 'خطا', 'danger');
                    }
                    else {
                        showErrorServerWithOutClose('اشکال در برقراری ارتباط با سرور', 'خطا', 'danger');
                    }
                }
            });
        }

        function getTemplate() {

            var ss = `
                <div class="card">
                    <div class="card-body">
                        <div id="countRequest"></div>
                        <br />
                        <div class="table-responsive">
                            <table id="widjetProgramTable" class="  mb-0 table stripe cell-border">
                                <thead>
                                    <tr class="">
                                        <th scope="col">کد تسهیلات</th>
                                        <th scope="col">تاریخ ثبت اولیه</th>
                                        <th scope="col">تاریخ ثبت نهایی</th>
                                        <th scope="col">وضعیت جاری چرخه</th>
                                        <th scope="col">وضعیت کلی چرخه</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            ss = minifyHtml(ss);
            //return localizationstring(ss);
            return ss;
        }



        this.destroy = function () {
            if (settings.addTemplate) {
                area.html('');
            }
        };
        return this;
    }

}(jQuery));
