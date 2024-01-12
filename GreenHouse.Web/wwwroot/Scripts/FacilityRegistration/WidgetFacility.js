var current_Row = null;
var area = $("#widjetProgramTable");
function GetAllFacilityRequests() {
    loading('widjetProgramTable', true, false);
    $.ajax({
        url: "/api/Facility/GetAllFacilityRequests",
        success: function (result) {
            loading('widjetProgramTable', false, false);
            //console.log({ result });
            if (result.data.length == 0) {
                let detailTab = document.getElementById("widjetProgramTable");
                detailTab.innerHTML += `
                      <tr>

                          <td colspan="5" style="text-align:center">هیچ تسهیلاتی ثبت نشده است</td>

                     </tr>
                      `;

            } else
                if (result != null) {
                    var countRequest = 0;
                    let detailTab = document.getElementById("widjetProgramTable");
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
                        document.getElementById('countRequest').innerHTML = cardAlert(`کاربر گرامی شما ${countRequest} درخواست نهائی نشده دارید. جهت بازبینی و نهائی سازی درخواست‌ها و ارسال به کمیته برای بررسی <a href="/FacilityRegistration/Cartable">اينجا</a> کنید`, 'هشدار درخواست‌ها', 'warning', true);
                    }

                }
                else {

                    //console.log("error");
                }

        },
        error: function (ex, cc, bb) {
            loading('widjetProgramTable', false, false);


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