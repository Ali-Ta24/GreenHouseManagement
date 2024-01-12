(function ($) {
    $.fn.facilityDetails = function (options) {
        var settings = $.extend({
            objectID: null,
            typeParamId: 'id', //id,facilitySUID
            getcheckPermissionAndGetViewByIDApiAddress: '/api/Facility/CheckPermissionAndGetViewByID',
            alsoCheckSessions: false,
            addTemplate: true,
        }, options);

        var viewModel = undefined;
        var area = this;


        if (settings.addTemplate) {
            //area.html(getTemplate());
        }
        buildInterface();

        function buildInterface() {
            checkPermissionAndGetViewByID();
        }

        function checkPermissionAndGetViewByID() {
            $.ajax({
                url: settings.getcheckPermissionAndGetViewByIDApiAddress + "?" + settings.typeParamId + "=" + settings.objectID + "&alsoCheckSessions=" + settings.alsoCheckSessions,
                success: function (result) {

                    //console.log({ result });
                    area.html(getTemplate(result))

                },
                error: function (ex, cc, bb) {
                    if (ex.responseText.includes("1010")) {
                        area.html(cardAlert('شما به این تسهیلات دسترسی ندارید', 'خطا', 'error'))
                    }

                }
            });
        }


        function getTemplate(v) {

            var ss = `
    <div class="row">

        ${v.latestWorkflowAction == "Accept" || v.latestWorkflowAction == null ? "" :
                    `
        <div class="col-lg-12 col-md-12 mb-2">
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap ${v.latestWorkflowAction == "Reject" ? 'bg-danger' : 'bg-primary'} rounded" >
                <span class=" mb-0 text-white">
                    ${v.latestWorkflowAction == "Reject" ? "<span>توضیحات علت رد:</span>" : "<span>توضیحات علت بازگشت:</span>"}
                    <span class="text-secondary text-white"> ${v.latestWorkflowActionDescription}</span >
                    </span>
                </li>
            </ul>
        </div>
                `}
        <br />

        <h5>اطلاعات تسهیلات</h5>
        <div id="" class="row" style="padding-left: unset;">
            <div class="col-lg-12 col-md-12"  style="padding-left: unset;">
                <ul class="list-group list-group-flush border border-3 border-dark text-center rounded ">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <span class="mb-0">
                            مرحله جاری فرآیند: ${setNameForNullValues(v.workflowCurrentStepTitle)}
                        </span>
                    </li>
                    <li class=" list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <span class="mb-0">
                            توضیحات مرحله جاری فرآیند: ${setNameForNullValues(v.workflowCurrentStepDescription)}
                        </span>
                    </li>
                </ul>
            </div>


            <div class="col-lg-6 col-md-6"  style="padding-left: unset;">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            کد
                        </h6>
                        <span class="text-secondary">${v.code}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            مدت زمان برآوردی خريد / ساخت (ماه)

                        </h6>
                        <span class="text-secondary">${v.requiredTime}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            هزينه برآوردی خريد/ساخت (ريال)
                        </h6>
                        <span class="text-secondary">${PersianTools.addCommas(v.requiredBudget)}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            توانائی تامين سهم آورده تسهيلات بانک
                        </h6>
                        <span class="text-secondary">`+ setValueBoolean(v.companyIsAbleToProvideFinanceShare) + `</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             نام شرکت ثبت شده به عنوان شرکت ناظر
                         </h6>
                         <span class="text-secondary">`+ setNameForNullValues(v.thirdPartyCompanyName) + `</span>
                        
                        
                     </li>

                </ul>
            </div>
            <div class="col-lg-6 col-md-6"  style="padding-left: unset;">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            وضعیت کلی فرآیند
                        </h6>
                        <span class="text-secondary">`+ setFacilityRequestTotalState(v.facilityRequestTotalState) +
                `</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            تاریخ پایان چرخه
                        </h6>
                        <span class="text-secondary"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            آخرین ویرایش کننده
                        </h6>
                        <span class="text-secondary">${v.lastModifiedBy}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            تاریخ آخرین ویرایش
                        </h6>
                        <span class="text-secondary">`+ getPerianDate(v.lastModificationTime) + `</span>
                    
                    </li>
                    
                </ul>
            </div>
        </div>
        <hr />
        <br />
        <h5>اطلاعات طرح </h5>
        <div id="" class="row"  style="padding-left: unset;">
            <div class="col-lg-6 col-md-6"  style="padding-left: unset;">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            کد
                        </h6>
                        <span class="text-secondary">${v.programCode}</span>
                    </li>
                    <li class=" list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            نام شرکت
                        </h6>
                        <span class="text-secondary">${v.companyName}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            عنوان طرح
                        </h6>
                        <span class="text-secondary">${v.programTitle}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            نوع طرح
                        </h6>
                        <span class="text-secondary">${v.programTypeTitle}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            تعداد تقاضاهای تسهیلات
                        </h6>
                        <span class="text-secondary">-</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            تعداد تقاضاهای در گردش
                        </h6>
                        <span class="text-secondary">-</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            تعداد تقاضا
                        </h6>
                        <span class="text-secondary">${v.program_RequestCount}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            نوع تقاضا
                        </h6>
                        <span class="text-secondary">${v.program_RequestCountTypeTitle}</span>
                    </li>

                </ul>
            </div>
            <div class="col-lg-6 col-md-6"  style="padding-left: unset;">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            ظرفیت
                        </h6>
                        <span class="text-secondary">${v.program_RequestCapacity}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            نوع ظرفیت
                        </h6>
                        <span class="text-secondary">${v.program_FleetCapacityUnitName}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            سازنده/فروشنده
                        </h6>
                        <span class="text-secondary">${v.program_ThirdParty}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            محل فعالیت
                        </h6>
                        <span class="text-secondary">${v.program_ActivityLocation}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            مسیر فعالیت طرح
                        </h6>
                        <span class="text-secondary">${v.facilityRequestTime_Program_ActivityPath}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            تعداد طرح‌های مشابه تملیکی
                        </h6>
                        <span class="text-secondary">${v.program_SimilarOwnedPrograms}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            تعداد طرح‌های مشابه استیجاری
                        </h6>
                        <span class="text-secondary">${v.program_SimilarRentedPrograms}</span>
                    </li>
                </ul>
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
