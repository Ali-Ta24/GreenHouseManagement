(function ($) {
    $.fn.facilityCartablePlugin = function (options) {
        var settings = $.extend({
            objectID: null,
            typeParamId: 'id', //id,facilitySUID
            viewModeType: 'Acctionable',
            currentRole: null,

            checkPermissionAndGetByID: '/api/Facility/CheckPermissionAndGetByID',
            getProgramFacilityRequests: '/api/Facility/GetProgramFacilityRequests',
            getMyCompany: '/api/Company/GetMyCompany',
            getLatestCompanyStateByNationalCodeID: '/api/CompanyState/GetLatestCompanyStateByNationalCodeID',
            getcheckPermissionAndGetViewByIDApiAddress: '/api/Facility/CheckPermissionAndGetViewByID',
            getLatestCompanyContactInformationByNationalCodeAsync: '/api/CompanyContactInformation/GetLatestCompanyContactInformationByNationalCodeAsync',
            getLatestShareholderCompositionByNationalCodeID: '/api/ShareholderComposition/GetLatestShareholderCompositionByNationalCodeID',
            getLatestBoardOfDirectorCompositionByNationalCodeID: '/api/BoardOfDirectorComposition/GetLatestBoardOfDirectorCompositionByNationalCodeID',
            getCartableProgramItems: '/api/facility/GetCartableProgramItems',
            historyFlow: '/FacilityRegistration/HistoryFlow',
            editfacilityrequest: '/FacilityRegistration/editfacilityrequest',
            editprogram: '/FacilityRegistration/editprogram',
            workflow_definitions: '/workflow/workflow-definitions',
            workflow_instances: '/workflow/workflow-instances',
            getResetFacilityRequestWorkflow: '/api/Facility/ResetFacilityRequestWorkflow',
            getFinalizeFacilityRequestAndStartWorkflow: '/api/Facility/FinalizeFacilityRequestAndStartWorkflow',
            addFacilityRequest: '/FacilityRegistration/AddFacilityRequest',
            finalizeFacilityRequestAndStartWorkflow: '/api/Facility/FinalizeFacilityRequestAndStartWorkflow',
            sendActionToFacilityRequestWorkflow: '/api/Facility/SendActionToFacilityRequestWorkflow',
            getFacilityRequestRequiredDocuments: '/api/Facility/GetFacilityRequestRequiredDocuments',
            getUsersOfDepartment: '/api/User/GetUsersOfDepartment',
            setDirectDepartmentExpert: '/api/Facility/SetDirectDepartmentExpert',
            setThirdParty: '/api/Facility/SetThirdParty',
            getAllCompanythirdPartyView: '/api/Company/GetAllCompanythirdPartyView',
            getFullNameFromUserName: '/api/User/GetFullNameFromUserName',
            setSecondaryCommitteeResults: '/api/Facility/SetSecondaryCommitteeResults',
            setPrimaryCommitteeSessionResults: '/api/Facility/SetPrimaryCommitteeSessionResults',
            getCompanyNationalCodeFromCompany: '/api/Company/GetCompanyNationalCodeFromCompanyID',
            getAllUserFullNameFromCompanyNational: '/api/User/GetAllUserFullNameFromCompanyNationalID',
            getAllRoles: '/api/User/GetAllRoles',
            getAllStateActions: '/api/Facility/GetAllStateActions',
            addPermissionToFacilityRequestAcceptanceWorkflow: '/api/Facility/AddPermissionToFacilityRequestAcceptanceWorkflow',
            getGetProgramWithFacilityItem: '/api/Facility/GetProgramWithFacilityItem',

            alsoCheckSessions: false,
            addTemplate: true,
        }, options);

        var viewModel = {
            facilityId: null,
            currentRowFacility: null,
            childTable: null,
            programDataTable: null,
            areaProgram: $("#programCarable"),


            action: null,
            indexEditDocuments: null,

        };
        var area = this;


        if (settings.addTemplate) {
            //area.append(getTemplate());
        }
        buildInterface();

        async function buildInterface() {

            await checkUrlParam();
            changeShowTypeProgram_facility(settings.viewModeType);


            area.find('#btnHistory').click(function () {
                gotoHistory();
            });

            area.find('#btnEditFacility').click(function () {
                gotoEditFacilityPage();
            });

            area.find('#btnEditProgram').click(function () {
                gotoEditProgramPage();
            });

            area.find('#cycleModelBtn').click(function () {
                gotoWorkflowDefinitions();
            });

            area.find('#cycleProcessBtn').click(function () {
                gotoWorkflowInstance();
            });

            area.find('#resetCycleBtn').click(function () {
                resetWorkFlow();
            });

            area.find('#restartCycleBtn').click(function () {
                restartWorkflow();
            });

            area.find('#showType').change(function () {
                let showType = $('#showType').find(":selected").val();
                changeShowTypeProgram_facility(showType);
            });

            area.find('#btnAction').click(function () {
                checkPermisstionAndShowModalAction();
            });

            area.find('#btnAddFacilityToProgram').click(function () {
                gotoAddFacilityPage();
            });

            area.find('#btnSubmitAndReviewFacility').click(function () {
                submitAndReviewFacility();
            });

            area.find('#registerDescriptionReject_TurnbackBtn').click(function () {
                registerDescriptionReject_Turnback();
            });

            area.find('#btnExel').click(function () {
                exportTemplate = `<div class ="row" id="exportModal">
                                <p>ستون هایی که میخواهید در خروجی نشان داده شود را انتخاب کنید.</p>
                                <hr>
                                <h4>اطلاعات مربوط به طرح</h4>
                                <span class="m-2"></span>
                                <div class="col-2">
                                    <label class="form-check-label" for="code">کد</label>
                                    <input class="form-check-input" type="checkbox" title="کد" id="code">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="companyName">نام شرکت</label>
                                    <input class="form-check-input" type="checkbox" title="نام شرکت" id="companyName">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="title">عنوان طرح</label>
                                    <input class="form-check-input" type="checkbox" title="عنوان طرح" id="title">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="programTypeTitle">نوع طرح</label>
                                    <input class="form-check-input" type="checkbox" title="نوع طرح" id="programTypeTitle">
                                </div>
                                
                                <div class="col-3">
                                    <label class="form-check-label" for="totalFacilityRequestCount">تعداد تقاضاهای تسهیلات</label>
                                    <input class="form-check-input" type="checkbox" title="تعداد تقاضاهای تسهیلات" id="totalFacilityRequestCount">
                                </div>
                                
                                <div class="col-2">
                                    <label class="form-check-label" for="requestCount">کمیت طرح</label>
                                    <input class="form-check-input" type="checkbox" title="کمیت طرح" id="requestCount">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="requestCapacity">ظرفیت طرح</label>
                                    <input class="form-check-input" type="checkbox" title="ظرفیت طرح" id="requestCapacity">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="thirdParty">سازنده/فروشنده</label>
                                    <input class="form-check-input" type="checkbox" title="سازنده/فروشنده" id="thirdParty">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="activityLocation">محل فعالیت</label>
                                    <input class="form-check-input" type="checkbox" title="محل فعالیت" id="activityLocation">
                                </div>

                                <div class="col-3">
                                    <label class="form-check-label" for="inProgressFacilityRequestCount"> تعداد تقاضاهای در گردش</label>
                                    <input class="form-check-input" type="checkbox" title=" تعداد تقاضاهای در گردش" id="inProgressFacilityRequestCount">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="activityPath">مسیر فعالیت طرح</label>
                                    <input class="form-check-input" type="checkbox" title="مسیر فعالیت طرح" id="activityPath">
                                </div>

                                 <div class="col-2">
                                    <label class="form-check-label" for="createdBy">ایجادکننده</label>
                                    <input class="form-check-input" type="checkbox" title="ایجادکننده" id="createdBy">
                                </div>

                                 <div class="col-2">
                                    <label class="form-check-label" for="lastModifiedBy">آخرین ویرایش کننده</label>
                                    <input class="form-check-input" type="checkbox" title="آخرین ویرایش کننده" id="lastModifiedBy">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="creationTime">تاریخ ایجاد</label>
                                    <input class="form-check-input" type="checkbox" title="تاریخ ایجاد" id="creationTime">
                                </div>

                                <div class="col-3">
                                    <label class="form-check-label" for="similarOwnedPrograms">تعداد طرح‌های مشابه تملیکی</label>
                                    <input class="form-check-input" type="checkbox" title="تعداد طرح‌های مشابه تملیکی" id="similarOwnedPrograms">
                                </div>
                                
                                <div class="col-2">
                                    <label class="form-check-label" for="lastModificationTime">تاریخ آخرین ویرایش</label>
                                    <input class="form-check-input" type="checkbox" title="تاریخ آخرین ویرایش" id="lastModificationTime">
                                </div>

                                 <div class="col-3">
                                    <label class="form-check-label" for="similarRentedPrograms">تعداد طرح های مشابه استیجاری</label>
                                    <input class="form-check-input" type="checkbox" title="تعداد طرح های مشابه استیجاری" id="similarRentedPrograms">
                                </div>
                                <span class="m-2"></span>

                                <hr>
                                <span class="m-2"></span>
                                <h4>اطلاعات مربوط به تسهیلات</h4>
                                <span class="m-2"></span>

                                 <div class="col-3">
                                    <label class="form-check-label" for="requiredTime">مدت زمان برآوردی ساخت/خرید (ماه)</label>
                                    <input class="form-check-input" type="checkbox" title="مدت زمان برآوردی ساخت/خرید (ماه)" id="requiredTime">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="facilityCode">کد تسهیلات</label>
                                    <input class="form-check-input" type="checkbox" title="کد تسهیلات" id="facilityCode">
                                </div>

                                <div class="col-3">
                                    <label class="form-check-label" for="requiredBudget">هزينه برآوردی خريد/ساخت (ريال)</label>
                                    <input class="form-check-input" type="checkbox" title="هزينه برآوردی خريد/ساخت (ريال)" id="requiredBudget">
                                </div>

                                <div class="col-3">
                                    <label class="form-check-label" for="workflowCurrentStepTitle">وضعیت فرآیند</label>
                                    <input class="form-check-input" type="checkbox" title="وضعیت فرآیند" id="workflowCurrentStepTitle">
                                </div>
                                
                                <div class="col-3">
                                    <label class="form-check-label" for="finalizationTime">تاریخ ورود تسهیلات به فرآیند بررسی</label>
                                    <input class="form-check-input" type="checkbox" title="تاریخ ورود تسهیلات به فرآیند بررسی" id="finalizationTime">
                                </div>
                                <span class="m-2"></span>
                              </div>


                            <div class="modal-footer">
                                <div class="btn btn-success" id="exportBtn">نمایش گزارش</div>
                                <div class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">لغو</div>
                            </div>`
                bootbox.dialog({
                    message: exportTemplate,
                    title: "گزارشگیری",
                }).bind('shown.bs.modal', function () {
                    $('.modal-dialog').css('max-width', '80%');
                    $('.bootbox-close-button').css("display", "inline");
                    $('.bootbox-close-button').addClass("btn-close");
                    $('.bootbox-close-button').text("");
                });

                $("#exportBtn").click(function () {
                    var allInputSelected = $('#exportModal input[type="checkbox"]:checked');
                    if (allInputSelected.length == 0) {
                        ivsAlert2('warning', 'اخطار', 'لطفا حداقل یک مورد را جهت گزارش گیری انتخاب کنید.');
                        return;
                    }
                    var tableTemp = `<nav class="navbar navbar-expand-lg navbar-dark rounded p-2 mb-2" style="background-color:#008080">
                                        <div class="sticky">
                                            <button class="menu-items btn btn-light me-2 mb-1" href="#headerfiltersExport" data-bs-toggle="collapse" data-toggle="collapse" title="فیلتر"><i class='bx bx-search'></i>فیلتر</button>
                                        </div>
                                        <div class="dropdown me-2 mb-1">
                                            <button class="btn btn-info" type="button" onclick="$('.buttons-excel').trigger('click');">
                                                دانلود گزارش
                                            </button>
                                        </div>
                                     </nav>
                                    <table id="exportTable" class="table table-border" style="width:100%">
                                     <thead>
                                          <tr id="headerfiltersExport" class="collapse">`

                    for (var i = 0; i < allInputSelected.length; i++) {
                        tableTemp += `<th scope="col" class="cartablefilter">`
                        tableTemp += '<input type="text" class="inputSearchExport form-control" data-name=' + allInputSelected[i].id + ' placeholder="' + allInputSelected[i].title + '"/>';
                        tableTemp += `</th>`
                    }

                    tableTemp += `</tr>
                          <tr>`;

                    for (var i = 0; i < allInputSelected.length; i++) {
                        tableTemp += '<th scope="col" name-export="' + allInputSelected[i].id + '"><b>' + allInputSelected[i].title + '</b></th>';
                    }

                    tableTemp += `</thead>  
                             </table>`;


                    var col = [];
                    var renderFuncTime = function (data) { return data != null ? moment(data, 'YYYY/MM/DD').format('jYYYY/jMM/jDD') : null };
                    var renderFuncPrice = function (data) { return data != null ? data.toLocaleString('en-US') : null };
                    var renderRequestShow = function (data, type, row) { return row.requestCount + ' ' + row.requestCountTypeTitle };
                    var renderCapacityShow = function (data, type, row) { return row.requestCapacity + ' ' + row.fleetCapacityUnitName };

                    for (var i = 0; i < allInputSelected.length; i++) {
                        if (allInputSelected[i].id == "lastModificationTime" || allInputSelected[i].id == "creationTime" || allInputSelected[i].id == "finalizationTime") {
                            col.push({ data: allInputSelected[i].id, name: allInputSelected[i].id, type: 'html', render: renderFuncTime });
                            continue;
                        }
                        if (allInputSelected[i].id == "requiredBudget") {
                            col.push({ data: allInputSelected[i].id, name: allInputSelected[i].id, type: 'html', render: renderFuncPrice });
                            continue;
                        }
                        if (allInputSelected[i].id == "requestCount") {
                            col.push({ data: 'requestCount', name: 'requestCount', type: 'html', render: renderRequestShow });
                            continue;
                        }
                        if (allInputSelected[i].id == "requestCapacity") {
                            col.push({ data: 'fleetCapacityUnitName', name: 'fleetCapacityUnitName', type: 'html', render: renderCapacityShow });
                            continue;
                        }
                        col.push({ data: allInputSelected[i].id, name: allInputSelected[i].id, type: 'html' });
                    }
                    console.log(col);
                    bootbox.dialog({
                        message: tableTemp,
                        title: "گزارشگیری",
                    }).bind('shown.bs.modal', function () {
                        $('.modal-dialog').css('max-width', '95%');
                        $('#exportTable_wrapper').css('overflow-x', 'scroll');
                        $('.bootbox-close-button').css("display", "inline");
                        $('.bootbox-close-button').addClass("btn-close");
                        $('.bootbox-close-button').text("");
                    });
                    var exportDataTable = $('#exportTable').DataTable({
                        ajax:
                        {
                            contentType: 'application/json',
                            url: settings.getGetProgramWithFacilityItem,
                            type: 'get',
                            dataType: "json",
                            error: function () {
                                ivsAlert2('error', 'خطا', 'اشکل در خروجی گرفتن اکسل');
                            }
                        },
                        destroy: true,
                        colReorder: true,
                        searchPanes: true,
                        serverSide: true,
                        select: true,
                        paginationType: "full_numbers",
                        columns: col,
                        paging: true,
                        serverMethod: 'post',
                        dom: 'rlt<".d-none" B>p',
                        buttons: [
                            'excel'
                        ],
                        language: {
                            url: '/lib/jQueryDatatable/fa.json'
                        },
                    });
                    $('.inputSearchExport').change(function () {
                        exportDataTable.columns().search('');
                        $('input.inputSearchExport').filter(function (a) {
                            return $('input.inputSearchExport')[a].value.length > 0
                        }).each(function (a, b) {
                            columnindex = parseInt($("[name-export='" + b.dataset.name + "']")[0].dataset.columnIndex);
                            exportDataTable.columns(columnindex).search(b.value);
                        });
                        exportDataTable.draw();
                    });
                });
            });

            area.find('#btnPermissionFacility').click(function () {

                showModalAddDelPermissionToFacility();

            });

            area.find('#addPermissionToFacility').click(function () {

                addPermissionToFacility();

            });
        }


        function showModalAddDelPermissionToFacility() {

            area.find("#roles").drapdownPlugin({
                apiAddress: settings.getAllRoles,
                valueOption: 'id',
                textOption: 'titleMultilang',
                idTagName: 'roleUser',

                title: 'نقش کاربر',
                //isMultiSelect: true,
                //isRequire: true,
                //textRequire: 'این فیلد اجباری است.',
                dropdownParent: 'modalAddDelPermissionToFacility',
            });

            area.find("#permissions").drapdownPlugin({
                apiAddress: settings.getAllStateActions,
                valueOption: 'id',
                textOption: 'name',
                idTagName: 'permissionsUser',

                title: 'وضعیت تسهیلات',
                //isMultiSelect: true,
                //isRequire: true,
                //textRequire: 'این فیلد اجباری است.',
                dropdownParent: 'modalAddDelPermissionToFacility',
            });

            area.find('#modalAddDelPermissionToFacility').modal('show');

        }

        function addPermissionToFacility() {
            roleUser = area.find('#roleUser').find(":selected").val();
            permissionsUser = parseInt(area.find('#permissionsUser').find(":selected").val());

            var valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];

            facilityId = valueRowSelect.id;



            //addPermissionToFacilityModek = {

            //};

            loadingPlugin(area.find("#addPermissionToFacility"), true);


            $.ajax({
                type: "post",
                url: settings.addPermissionToFacilityRequestAcceptanceWorkflow + '?facilityRequestID=' + facilityId + '&roleId=' + roleUser + '&stateActionId=' + permissionsUser,
                //data: JSON.stringify(sesstionInfo),
                contentType: "application/json; charset=utf-8",
                success: async function (result) {


                    loadingPlugin(area.find("#addPermissionToFacility"), false);
                    area.find('#modalAddDelPermissionToFacility').modal('hide');

                    ivsAlert2('success', ' پیام موفقیت', 'دسترسی افزوده  شد');



                },
                error: function (ex, cc, bb) {
                    loadingPlugin(area.find("#addPermissionToFacility"), false);

                    ivsAlert2('error', 'خطا در ثبت', 'شما دسترسی انجام این عملیات را ندارید');
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {
                    viewModel.programDataTable.ajax.reload();
                }
            });


        }

        function checkUrlParam() {
            const queryStringValueID = new Proxy(new URLSearchParams(window.location.search), {
                get: (searchParams, prop) => searchParams.get(prop),
            });
            viewModel.facilityId = queryStringValueID.id;

            if (viewModel.facilityId != null) {
                $.ajax({
                    type: "get",
                    url: settings.checkPermissionAndGetByID + "?id=" + viewModel.facilityId,
                    success: function (result) {
                        if (result) {
                            $.ajax({
                                type: "get",
                                url: settings.getProgramFacilityRequests + "?viewMode=" + settings.viewModeType + "&programID=" + result.programID,
                                success: function (result) {
                                    //console.log(result);
                                    var infoOfNewFacility = result.data[0];
                                    if (infoOfNewFacility.workflowInstanceID === null) {
                                        showDetailsProgram(infoOfNewFacility, 'infoTab1');
                                        showDetailsFacility(infoOfNewFacility, 'infoTab2');
                                        loadInformationCompany(infoOfNewFacility.companyNationalCode);
                                        loadShareholder(infoOfNewFacility.companyNationalCode);
                                        loadDirector(infoOfNewFacility.companyNationalCode);
                                        //("#facilityIdModal").val(infoOfNewFacility.id);
                                        viewModel.facilityId = infoOfNewFacility.id
                                        //$('#facilityIdModal').val(infoOfNewFacility.id);

                                    }
                                    else {
                                        ivsAlert('برای این تسهیلات تایید نهایی و ارسال جهت بررسی انجام شده است.', 'خطا', 'error');
                                        return;
                                    }
                                    area.find('#detailsModal').modal('show');
                                },
                                error: function (ex, cc, bb) {
                                    if (ex.responseText.includes("1010")) {
                                        ivsAlert2('error', 'خطای عدم دسترسی', "شما دسترسی به اطلاعات تسهیلات ندارید", position = "top right", delay = 5);
                                    }
                                    else {
                                        ivsAlert('اشکال در برقراری ارتباط با سرور - اطلاعات وارد شده معتبر نیست', 'خطا', 'error');
                                    }

                                    //console.log(ex);
                                    //console.log(bb);
                                },
                                complete: function (jqXHR) {

                                }
                            });
                        }
                    },
                    error: function (ex, cc, bb) {

                        ivsAlert('اشکال در برقراری ارتباط با سرور - ای دی تسهیلات وارد شده معتبر نیست', 'خطا', 'error');
                        //console.log(ex);
                        //console.log(bb);
                    },
                    complete: function (jqXHR) {
                    }
                });

            }
        }

        function showDetailsProgram(v, area) {
            let card = `
            <div class="col-lg-6 col-md-6">
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
            <div class="col-lg-6 col-md-6">
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
                        <span class="text-secondary">${v.program_ActivityPath}</span>
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
    `;
            let detailTab1 = document.getElementById(area);
            if (detailTab1 != undefined) {
                detailTab1.innerHTML = card;
            }
        }

        function showDetailsFacility(v, area) {
            let card = `
            ${v.latestWorkflowAction == "Accept" || v.latestWorkflowAction == null ? "" :
                    `
            <div class="col-lg-12 col-md-12 mb-2">
                <ul class="list-group list-group-flush">
                    <li  class="list-group-item d-flex justify-content-between align-items-center flex-wrap ${v.latestWorkflowAction == "Reject" ? ' bg-danger  ' : 'bg-primary'} rounded  ">
                         <span class="mb-0 text-white">
                            ${v.latestWorkflowAction == "Reject" ? "<span>توضیحات علت رد:</span>" : "<span>توضیحات علت بازگشت:</span>"}
                            <span class="text-secondary text-white">${v.latestWorkflowActionDescription}</span>
                         </span>
                         
                     </li>
                </ul>
            </div>
            

        `}
       

            <br/>

            <div class="col-lg-12 col-md-12 mb-2">
                <ul class="list-group list-group-flush border border-3 border-dark text-center rounded ">
                    <li  class="list-group-item d-flex justify-content-between align-items-center flex-wrap  ">
                         <span class="mb-0">
                            مرحله جاری فرآیند: ${setNameForNullValues(v.workflowCurrentStepTitle)}
                         </span>

                     </li>
                    <li  class="list-group-item d-flex justify-content-between align-items-center flex-wrap ">
                         <span class="mb-0">
                            توضیحات مرحله جاری فرآیند: ${setNameForNullValues(v.workflowCurrentStepDescription)}
                         </span>
                         
                     </li>
                </ul>
            </div>

            <br/>

            <div class="col-lg-6 col-md-6 row">
                 <ul class="list-group list-group-flush">
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             کد
                         </h6>
                         <span class="text-secondary">${v.code}</span>
                     </li>
                     <li class=" list-group-item d-flex justify-content-between align-items-center flex-wrap">
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
                 </ul>
            </div>
            <div class="col-lg-6 col-md-6">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                            وضعیت کلی فرآیند
                         </h6>
                         <span class="text-secondary">`+ setFacilityRequestTotalState(v.facilityRequestTotalState) + `</span>
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
            
    `;
            let detailTab1 = document.getElementById(area);
            if (detailTab1 != undefined) {
                detailTab1.innerHTML = card;
            }
        }

        function showDetailsFacilityWithoutData() {
            return (
                `
            <div style="text-align: right;" class="alert alert-warning">هیچگونه تسهیلاتی ثبت نشده است.</div>
        `
            );
        }

        async function loadInformationCompany(companyNationalCode) {
            loading('info3', true, false);
            $.ajax({
                type: "get",
                async: false,
                url: settings.getMyCompany,
                success: async function (result1) {
                    loading('info3', false, false);
                    var info1 = result1;
                    await $.ajax({
                        type: "get",
                        async: false,
                        url: settings.getLatestCompanyStateByNationalCodeID + "?nationalCode=" + companyNationalCode,
                        success: async function (result2) {
                            var info2 = result2;
                            await $.ajax({
                                type: "get",
                                async: false,
                                url: settings.getLatestCompanyContactInformationByNationalCodeAsync + "?nationalCode=" + companyNationalCode,
                                success: async function (result3) {
                                    var info3 = result3;
                                    showDetailsCompany(info1, info2, info3)
                                },
                                error: function (ex, cc, bb) {

                                    loading('info3', false, false);
                                    ivsAlert('اشکال در برقراری ارتباط با سرور - بخش اطلاعات شرکت', 'خطا', 'error');
                                    //console.log(ex);
                                    //console.log(bb);
                                }
                            });
                        },
                        error: function (ex, cc, bb) {

                            loading('info3', false, false);
                            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش اطلاعات شرکت', 'خطا', 'error');
                            //console.log(ex);
                            //console.log(bb);
                        }
                    });
                },
                error: function (ex, cc, bb) {

                    loading('info3', false, false);
                    ivsAlert('اشکال در برقراری ارتباط با سرور - بخش اطلاعات شرکت', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
        }

        function loadShareholder(nationalCode) {
            $.ajax({
                type: "get",
                url: settings.getLatestShareholderCompositionByNationalCodeID + "?nationalCode=" + nationalCode,
                success: function (result) {
                    if (result.shareholderEntities != 0) {

                        let info = showAllShareholders(result.shareholderEntities);
                        let detailTab = document.getElementById('shareholderEntitiesCard');
                        if (detailTab != undefined) {
                            detailTab.innerHTML = info;
                        }

                    }
                    else {
                        let detailTab = document.getElementById('shareholderEntitiesCard');
                        if (detailTab != undefined) {
                            detailTab.innerHTML = 'سهامداری ثبت نشده است';
                        }
                    }

                },
                error: function (ex, cc, bb) {
                    loading('info2', false, false);
                    ivsAlert('اشکال در برقراری ارتباط با سرور - بخش سهامداران', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
        }

        function loadDirector(nationalCode) {
            $.ajax({
                type: "get",
                url: settings.getLatestBoardOfDirectorCompositionByNationalCodeID + "?nationalCode=" + nationalCode,
                success: function (result) {
                    if (result.directorEntities != 0) {

                        let info = showAllDirectors(result.directorEntities);
                        let detailTab = document.getElementById('directorEntitiesCard');
                        if (detailTab != undefined) {
                            detailTab.innerHTML = info;
                        }

                    }
                    else {
                        let detailTab = document.getElementById('directorEntitiesCard');
                        if (detailTab != undefined) {
                            detailTab.innerHTML = 'هیئت مدیره ثبت نشده است';
                        }
                    }

                },
                error: function (ex, cc, bb) {
                    loading('info2', false, false);
                    ivsAlert('اشکال در برقراری ارتباط با سرور - بخش هیئت مدیره', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
        }

        function showDetailsCompany(v, v2, v3) {
            let card = `
            <div class="col-lg-6 col-md-6">
                 <ul class="list-group list-group-flush">
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             نام شرکت
                         </h6>
                         <span class="text-secondary">${v.name}</span>
                     </li>
                     <li class=" list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                            شناسه ملی شرکت
                         </h6>
                         <span class="text-secondary">${v.nationalCode}</span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             شماره ثبت
                         </h6>
                         <span class="text-secondary">${v.registrationCode}</span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             کد اقتصادی شرکت
                         </h6>
                         <span class="text-secondary">${setNameForNullValues(v.financialCode)}</span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                            تاریخ تاسیس شرکت
                         </h6>
                         <span class="text-secondary">`+ getDateWithOutTime(v.initiationDate) + `</span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             تاریخ ثبت شرکت
                         </h6>
                         <span class="text-secondary">`+ getDateWithOutTime(v.registrationDate) + ` </span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             نوع شرکت
                         </h6>
                         <span class="text-secondary">`+ getCompanyType(v.companyTypeID) + `</span>
                     </li>
                 </ul>
            </div>
            <div class="col-lg-6 col-md-6">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             نوع مالکیت
                         </h6>
                         <span class="text-secondary">`+ getCompanyOwnershipType(v.companyOwnershipTypeID) + `</span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                            نشانی محل فعالیت
                         </h6>
                         <span class="text-secondary">${v2.address}</span>
                     </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                             ایا شرکت ورشکسته شده است؟
                        </h6>
                        <span class="text-secondary">`+ setValueBoolean(v2.isBankRupt) + ` </span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            ایا شرکت منحل شده است؟
                        </h6>
                        <span class="text-secondary"> `+ setValueBoolean(v2.isBreakUp) + ` </span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            ایا شرکت تعلیق شده است؟
                        </h6>
                        <span class="text-secondary"> `+ setValueBoolean(v2.isSuspended) + ` </span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            ایا شرکت دارای محدودیت مالی است؟
                        </h6>
                        <span class="text-secondary"> `+ setValueBoolean(v2.isTaxRestricted) + `</span>
                    </li>
                    
                </ul>
            </div>
            <hr/>
            <h6>آدرس و شماره تماس</h6>
            <div class="col-lg-12 col-md-12">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             تلفن شرکت
                         </h6>
                         <span class="text-secondary">`+ (v3.telNumber1) + `</span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                            فکس شرکت
                         </h6>
                         <span class="text-secondary">${v3.faxNumber1}</span>
                     </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                             کدپستی شرکت
                        </h6>
                        <span class="text-secondary">`+ v3.postalCode + ` </span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            وب سایت شرکت
                        </h6>
                        <span class="text-secondary"> `+ v3.website + ` </span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                            ایمیل شرکت
                        </h6>
                        <span class="text-secondary"> `+ v3.email + ` </span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                           نشانی دفتر مرکزی
                        </h6>
                        <span class="text-secondary"> `+ v3.centralOfficeAddress + `</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <h6 class="mb-0">
                           نشانی محل فعالیت
                        </h6>
                        <span class="text-secondary"> `+ v3.activeLocationAddress + `</span>
                    </li>
                </ul>
            </div>
    `;
            let detailTab1 = document.getElementById('infoTab3');
            if (detailTab1 != undefined) {
                detailTab1.innerHTML = card;
            }
        }

        function showAllShareholders(d) {
            let infoShareholder = ``;
            if (d.length != 0) {
                let indexRow = 0;
                for (let i = 0; i < d.length; i++) {
                    indexRow++;
                    infoShareholder += `
            <tr>
                <td>${indexRow}</td>
                <td>${d[i].fullName}</td>
                <td>${d[i].nationalCode}</td>
                <td>${d[i].percentageOfPersonShare}</td>
                <td>`
                        +
                        getShareholderType(d[i].shareholderTypeID)
                        +
                        `</td>
            </tr>
            `
                }
            }
            return infoShareholder;


        }

        function showAllDirectors(d) {
            //console.log(d);
            let infoDirector = ``;
            if (d.length != 0) {
                let indexRow = 0;
                for (let i = 0; i < d.length; i++) {
                    indexRow++;
                    infoDirector += `
            <tr>
                <td>${indexRow}</td>
                <td>${d[i].fullName}</td>
                <td>${d[i].nationalCode}</td>
                <td>${getDateWithOutTime(d[i].birthDay)}</td>
                <td>`
                        +
                        getDirectorPositionTypeID(d[i].directorPositionTypeID)
                        +
                        `</td>
                <td>${getDateWithOutTime(d[i].expiryDateOfPosition)}</td>
                
                <td>`
                        +
                        getEducationLevelType(d[i].educationLevelTypeID)
                        +
                        `</td>
           </tr>
            `
                }
            }
            return infoDirector;


        }

        $('.inputSearch').change(function () {
            viewModel.programDataTable.columns().search('');
            console.log(viewModel.programDataTable);
            $('input.inputSearch').filter(function (a) {
                return $('input.inputSearch')[a].value.length > 0
            }).each(function (a, b) {
                columnindex = parseInt($("[name='" + b.dataset.name + "']")[0].dataset.columnIndex);
                console.log(columnindex);
                viewModel.programDataTable.columns(columnindex).search(b.value);
            });
            viewModel.programDataTable.draw();

        });

        function changeShowTypeProgram_facility(showType) {

            //var viewMode = showType;
            settings.viewModeType = showType
            viewModel.programDataTable = viewModel.areaProgram.DataTable({
                //serverSide: true, //make server side processing to true
                ajax:
                {
                    type: 'get',
                    dataType: "json",
                    contentType: 'application/json',
                    url: settings.getCartableProgramItems + '?viewMode=' + showType,
                    error: function (x, e) {
                        //console.log(x);
                        //console.log(e);
                        if (x.status == 401) {
                            //alert("Unauthorized Access");
                            window.location.replace(x.getResponseHeader("login-address"));
                        }
                    },
                },
                //processing: true,
                destroy: true,
                colReorder: true,
                searchPanes: true,
                scrollX: true,
                select: true,
                //scrollY: "50vh",
                scrollX: true,
                searching: true,
                serverSide: true,
                serverMethod: 'post',
                //scrollCollapse: true,
                //fixedColumns: {
                //    left: 1,
                //    right: 1
                //},
                //fixedColumns: true,
                //lengthChange: false,
                //dom: 'T<"clear">lfrtip',
                //tableTools: {
                //    sRowSelect: 'os',
                //    sRowSelector: 'td:first-child',
                //    aButtons: ['select_all', 'select_none']
                //},
                paginationType: "full_numbers",//pagination type
                columns: [
                    {
                        //className: 'font-22',
                        orderable: false,
                        data: null,
                        //defaultContent: '<div style="cursor: pointer;" class="font-22 text-primary"> <i class="lni lni-chevron-left-circle"></i></div>',
                        type: "html",

                        render: function (data, type, row, meta) {
                            let totalFacilityRequestCount = parseInt(data.totalFacilityRequestCount);
                            if (totalFacilityRequestCount > 0) {
                                return '<div style="cursor: pointer;" class="font-22 text-primary"> <i class="lni lni-chevron-left-circle"></i></div>'
                            }
                            return '';

                        }
                    },
                    { data: "code", name: "code", type: "html" },
                    { data: "companyName", name: "companyName", type: "html" },
                    { data: "title", name: "title", type: "html" },
                    { data: "programTypeTitle", name: "programTypeTitle", type: "html" },
                    { data: "totalFacilityRequestCount", name: "totalFacilityRequestCount", type: "html" },
                    { data: "inProgressFacilityRequestCount", name: "inProgressFacilityRequestCount", type: "html" },

                    { data: "requestCount", name: "requestCount", type: "html", render: function (data, type, row) { return row.requestCount + ' ' + row.requestCountTypeTitle } },
                    { data: "requestCapacity", name: "requestCapacity", type: "html", render: function (data, type, row) { return row.requestCapacity + ' ' + row.fleetCapacityUnitName } },


                    { data: "thirdParty", name: "thirdParty", type: "html" },

                    { data: "activityLocation", name: "activityLocation", type: "html" },
                    { data: "activityPath", name: "activityPath", type: "html" },

                    { data: "similarOwnedPrograms", name: "similarOwnedPrograms", type: "html" },
                    { data: "similarRentedPrograms", name: "similarRentedPrograms", type: "html" },

                    { data: "createdBy", name: "createdBy", type: "html" },
                    { data: "lastModifiedBy", name: "lastModifiedBy", type: "html" },
                    { data: "creationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
                    { data: "lastModificationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },

                ],
                language: {
                    url: '/lib/jQueryDatatable/fa.json'
                },
                dom: 'rtip',
            });//DataTable

            viewModel.programDataTable.on('select', function (event, dt, type, indexes) {
                //var rowData = table.rows( indexes ).data().toArray();
                //let id = ProgramDataTable.row().data().id;
                //current_Row = ProgramDataTable.row().data().id;
                //$(".child-table tr").removeClass("selected");
                var childTables = [];
                $("table[id^='facilityTable_']").each(function () {
                    childTables.push(this.id);
                });

                for (let i in childTables) {
                    $(`#${childTables[i]}`).DataTable().rows().deselect();
                }

                let valueRowSelect = viewModel.programDataTable.rows({ selected: true }).data()[0];
                //if (childTable != null) {
                //    childTable.rows().deselect();
                //}

                if (valueRowSelect != undefined && valueRowSelect.totalFacilityRequestCount == 0) {
                    $('#btnEditProgram').prop('disabled', false);
                    $('#btnAddFacilityToProgram').prop('disabled', false);
                    event.stopPropagation();
                }

            }).on('deselect', function (event, dt, type, indexes) {
                $('#btnEditProgram').prop('disabled', true);
                $('#btnAddFacilityToProgram').prop('disabled', true);

                event.stopPropagation();
            });

        }

        $('#programCarable tbody').on('click', 'td div.font-22', async function () {
            var tr = $(this).closest('tr');
            var row = viewModel.programDataTable.row(tr);
            if (row.child.isShown()) {
                var col1 = tr.find("td:eq(0)").html('<div style="cursor: pointer;" class="font-22 text-primary"> <i class="lni lni-chevron-left-circle"></i></div>');
                row.child.hide();
                tr.removeClass('shown');

            } else {

                viewModel.programDataTable.rows().eq(0).each(function (idx) {

                    viewModel.programDataTable.cell({ row: idx, column: 0 }).data('<div style="cursor: pointer;" class="font-22 text-primary"> <i class="lni lni-chevron-left-circle"></i></div>');
                    var otherRows = viewModel.programDataTable.row(idx);
                    if (otherRows.child.isShown()) {
                        otherRows.child.hide();
                    }
                });

                DetailsFacility(row, row.data().id, settings.viewModeType);
                var col1 = tr.find("td:eq(0)").html('<div style="cursor: pointer;" class="font-22 text-primary"> <i class="lni lni-chevron-down-circle"></i></div>');
            }
        });

        function DetailsFacility(dtrow, id) {
            var idTable = `facilityTable_${id}`;

            dtrow.child(`
         <table id="${idTable}" style="width: unset" class="child-table table table-sm table-bordered table-striped table-responsive" >
            <thead>
               <tr>
                
                <th >programID</th>
                <th >programCode</th>
                <th >companyName</th>
                <th >programTypeTitle</th>
                <th >program_RequestCount</th>
                <th >program_RequestCountTypeTitle</th>
                <th >program_RequestCapacity </th>
                <th >program_FleetCapacityUnitName</th>
                <th >program_ThirdParty</th>
                <th >activityLocation</th>
                <th >activityPath</th>
                <th >similarOwnedPrograms</th>
                <th >similarRentedPrograms</th>
                <th >companyNationalCode</th>
                <th >roleName</th>
                <th >workflowInstanceID</th>
                <th >totalFacilityRequestCount </th>
                <th >inProgressFacilityRequestCount</th>
                <th>کد</th>
                <th>مدت زمان برآوردی خريد / ساخت (ماه)</th>
                <th>هزينه برآوردی خريد/ساخت (ريال)</th>
                
                 <th>وضعیت فرآیند</th>
                 <th>تاریخ  ورود تسهیلات به فرآیند بررسی</th>
           
               </tr>
            </thead>
            <tbody></tbody>
                
            </table>
        `).show();
            var areaChild = $(dtrow.child()[0]).find(`#${idTable}`);
            //console.log(area);

            viewModel.childTable = areaChild.DataTable({
                //serverSide: true, //make server side processing to true
                ajax:
                {
                    contentType: 'application/json',
                    url: settings.getProgramFacilityRequests + '?viewMode=' + settings.viewModeType + '&programID=' + + id,
                    error: function (x, e) {
                        //console.log(x);
                        //console.log(e);
                        //console.log(x.getResponseHeader("login-address"));
                        if (x.status == 401) {
                            //alert(authenticationStrs.haveBeenLoggedOutForNotHavingInteraction);
                            window.location.replace(x.getResponseHeader("login-address"));
                        }

                    }
                },
                paging: false,
                ordering: false,
                info: false,
                //processing: true,
                colReorder: false,
                searchPanes: false,
                scrollX: false,
                select: true,
                bFilter: false,
                paginationType: "full_numbers",//pagination type


                columns: [
                    { data: "programID", name: "programID", type: "html", visible: false, },

                    { data: "programCode", name: "programCode", type: "html", visible: false, },
                    { data: "companyName", name: "companyName", type: "html", visible: false, },
                    { data: "programTypeTitle", name: "programTypeTitle", type: "html", visible: false, },
                    { data: "program_RequestCount", name: "program_RequestCount", type: "html", visible: false, },
                    { data: "program_RequestCountTypeTitle", name: "program_RequestCountTypeTitle", type: "html", visible: false, },
                    { data: "program_RequestCapacity", name: "program_RequestCapacity", type: "html", visible: false, },
                    { data: "program_FleetCapacityUnitName", name: "program_FleetCapacityUnitName", type: "html", visible: false, },
                    { data: "program_ThirdParty", name: "program_ThirdParty", type: "html", visible: false, },
                    { data: "program_ActivityLocation", name: "program_ActivityLocation", type: "html", visible: false, },
                    { data: "facilityRequestTime_Program_SimilarRentedPrograms", name: "facilityRequestTime_Program_SimilarRentedPrograms", type: "html", visible: false, },
                    { data: "program_SimilarOwnedPrograms", name: "program_SimilarOwnedPrograms", type: "html", visible: false, },
                    { data: "program_SimilarRentedPrograms", name: "program_SimilarRentedPrograms", type: "html", visible: false, },
                    { data: "companyNationalCode", name: "companyNationalCode", type: "html", visible: false, },

                    { data: "workflowInstanceID", name: "workflowInstanceID", type: "html", visible: false, },
                    { data: "roleActions", name: "roleActions", visible: false, },
                    { data: "rolePermissions", name: "rolePermissions", visible: false, },
                    { data: "rolePermissions", name: "rolePermissions", visible: false, },

                    { data: "code", name: "code", type: "html" },
                    { data: "requiredTime", name: "requiredTime", type: "html" },
                    { data: "requiredBudget", name: "requiredBudget", render: function (data, type, row) { return PersianTools.addCommas(data) } },

                    { data: "workflowCurrentStepTitle", name: "workflowCurrentStepTitle", type: "html", visible: true, },
                    { data: "finalizationTime", render: function (data, type, row) { return getPerianDate(data) } },

                ],
                language: {
                    url: '/lib/jQueryDatatable/fa.json'
                },
                error: function (x, e) {
                    //console.log(x);
                    //console.log(e);
                    if (x.status == 401) {
                        alert("Unauthorized Access");
                    }
                    viewModel.childTable.fnProcessingIndicator(false);
                }
            });

            viewModel.childTable.on('select', function (event, dt, type, indexes) {

                viewModel.programDataTable.rows().deselect();


                let valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];

                var currenSelectChildTable = $(`table[id*="facilityTable_${valueRowSelect.programID}"]`).attr('id');
                //console.log({ currenSelectChildTable });
                var childTables = [];

                $("table[id^='facilityTable_']").each(function () {
                    childTables.push(this.id);
                });

                for (let i in childTables) {
                    //console.log(elements[i]);
                    if (currenSelectChildTable != childTables[i]) {
                        $(`#${childTables[i]}`).DataTable().rows().deselect();
                    }
                }


                $('#btnAction').prop('disabled', false);
                $('#toggleModelBtn').prop('disabled', false);

                if (valueRowSelect.workflowInstanceID != null) {
                    $('#btnEditFacility').prop('disabled', true);
                    $('#btnHistory').prop('disabled', false);
                    $('#btnPermissionFacility').prop('disabled', false);

                    $('#resetCycleBtn').prop('hidden', false);
                    $('#cycleProcessBtn').prop('hidden', false);
                    $('#restartCycleBtn').prop('hidden', true);
                }
                else {
                    $('#btnEditFacility').prop('disabled', false);

                    $('#resetCycleBtn').prop('hidden', true);
                    $('#cycleProcessBtn').prop('hidden', true);
                    $('#restartCycleBtn').prop('hidden', false);

                }

                if (valueRowSelect.workflowModelID != null) {
                    $('#cycleModelBtn').prop('hidden', false);
                }
                else {
                    $('#cycleModelBtn').prop('hidden', true);
                }

                event.stopPropagation();
            }).on('deselect', function (event, dt, type, indexes) {

                $('#btnEditFacility').prop('disabled', true);
                $('#btnHistory').prop('disabled', true);
                $('#btnPermissionFacility').prop('disabled', true);
                $('#btnAction').prop('disabled', true);
                $('#toggleModelBtn').prop('disabled', true);

                $('#resetCycleBtn').prop('hidden', true);
                $('#cycleProcessBtn').prop('hidden', true);
                $('#cycleModelBtn').prop('hidden', true);
                $('#restartCycleBtn').prop('hidden', true);


                document.getElementById('acceptFacility').innerHTML = '';
                document.getElementById('rejectFacility').innerHTML = '';
                document.getElementById('turnBackFacility').innerHTML = '';
                event.stopPropagation();

            });


        }

        async function gotoHistory() {
            let count = viewModel.childTable.rows({ selected: true }).count();
            var valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];

            if (count > 0) {
                window.location = settings.historyFlow + "?id=" + valueRowSelect.id + "&code=" + valueRowSelect.code;
            }

            else {
                ivsAlert('ابتدا یک رکورد را انتخاب کنید', `خطا`, 'error');
            }

        }

        function gotoEditFacilityPage() {
            let count = viewModel.childTable.rows({ selected: true }).count();
            var valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];

            if (count > -1 && valueRowSelect.workflowInstanceID === null) {

                window.location = settings.editfacilityrequest + "?id=" + valueRowSelect.id;
            }
            else {
                ivsAlert2('error', 'خطای عدم توانایی ویرایش', "امکان ویرایش وجود ندارد زیرا برای این طرح تسهیلات در چرخه است .");
            }
        }

        async function gotoEditProgramPage() {
            let count = viewModel.programDataTable.rows({ selected: true }).count();
            var valueRowSelect = viewModel.programDataTable.rows({ selected: true }).data()[0];

            if (count > -1 && valueRowSelect.totalFacilityRequestCount === 0) {
                window.location = settings.editprogram + "?id=" + valueRowSelect.id;
            }
            else {
                ivsAlert('امکان ویرایش وجود ندارد زیرا برای این طرح تسهیلات ثبت شده است.', `خطا`, 'error');
            }
        }

        function gotoWorkflowDefinitions() {
            let valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];
            if (valueRowSelect.workflowModelID != null) {

                window.location = settings.workflow_definitions + "/" + valueRowSelect.workflowModelID;
            }
            else {
                ivsAlert2('error', 'خطای خالی بودن مدل', "امکان رفتن به مدل چرخه وجود ندارد زیرا مدل خالی است.");
            }
        }

        function gotoWorkflowInstance() {
            let valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];
            if (valueRowSelect.workflowInstanceID != null) {

                window.location = settings.workflow_instances + "/" + valueRowSelect.workflowInstanceID;
            }
            else {
                ivsAlert2('error', 'خطای خالی بودن نمونه', "امکان رفتن به مدل چرخه وجود ندارد زیرا نمونه خالی است.");
            }
        }


        function resetWorkFlow() {
            let valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];
            var facilityId = valueRowSelect.id;

            bootbox.confirm({
                message: "آیا از ریست چرخه تسهیلات انتخاب شده مطمئن هستید؟",
                buttons: {
                    confirm: {
                        label: 'بله',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'خیر',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {

                    if (result == true) {

                        confirmAgainResetWorkflow(facilityId)
                    }

                }
            });
        }

        function confirmAgainResetWorkflow(facilityId) {
            bootbox.confirm({
                message: "با ریست چرخه کلیه فرآیندهای آن حذف شده و از لازم است فرآیند تسهیلات از نو آغاز شود. آیا مطمئن هستید؟",
                buttons: {
                    confirm: {
                        label: 'بله',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'خیر',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {

                    if (result == true) {
                        resetFacilityRequestWorkflow(facilityId);
                    }

                }
            });
        }

        function resetFacilityRequestWorkflow(id) {

            $.ajax({
                type: "get",
                url: settings.getResetFacilityRequestWorkflow + "?id=" + id,
                success: function (result) {
                    ivsAlert2('success', 'موفقیت در ریست چرخه', "چرخه تسهیلات انتخابی با موفقیت ریست شد");
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'عدم توانایی ریست ', "اشکال در برقراری ارتباط با سرور - ریست انجام نشد");
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {
                    viewModel.programDataTable.ajax.reload();
                }
            });
        }

        function restartWorkflow() {
            let valueRowSelect = childTable.rows({ selected: true }).data()[0];
            var facilityId = valueRowSelect.id;

            bootbox.confirm({
                message: " آیا از شروع فرآیند چرخه تاییدیه تسهیلات به نمایندگی از متقاضی مطمئن هستید؟ ",
                buttons: {
                    confirm: {
                        label: 'بله',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'خیر',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {

                    if (result == true) {
                        finalizeFacilityRequestAndStartWorkflow(facilityId)
                    }

                }
            });
        }

        function finalizeFacilityRequestAndStartWorkflow(id) {

            $.ajax({
                type: "get",
                url: settings.getFinalizeFacilityRequestAndStartWorkflow + "?id=" + id,
                success: function (result) {
                    ivsAlert2('success', 'موفقیت در شروع  چرخه', "چرخه تسهیلات انتخابی با موفقیت شروع شد");
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'عدم توانایی شروع چرخه ', "اشکال در برقراری ارتباط با سرور - شروع چرخه انجام نشد");
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {
                    viewModel.programDataTable.ajax.reload();
                }
            });
        }

        //async function loadProgranAndFacility(data) {
        //    await showDetailsProgram(data, 'infoProgramAction');
        //    await showDetailsFacility(data, 'infoFacilityAction');

        //}

        function checkPermisstionAndShowModalAction() {
            let count = viewModel.childTable.rows({ selected: true }).count();
            var valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];
            //console.log(valueRowSelect);
            current_Row = valueRowSelect.id;
            viewModel.facilityId = valueRowSelect.id;
            ;
            if (count > -1) {
                if (valueRowSelect.workflowInstanceID === null) {
                    $('.nav-tabs a[href="#info1"]').tab('show');
                    $('#detailsModal').modal('show');
                    showDetailsProgram(valueRowSelect, 'infoTab1');
                    showDetailsFacility(valueRowSelect, 'infoTab2');
                    loadInformationCompany(valueRowSelect.companyNationalCode);
                    loadShareholder(valueRowSelect.companyNationalCode);
                    loadDirector(valueRowSelect.companyNationalCode);
                    $('#facilityIdModal').val(valueRowSelect.id);
                }
                else {

                    //loadProgranAndFacility(valueRowSelect);
                    $("#infoFacilityProgram").facilityDetails({
                        objectID: current_Row,
                        alsoCheckSessions: false
                    });

                    let permition = valueRowSelect.rolePermissions;
                    var roleActions = valueRowSelect.roleActions;
                    try {
                        var arrayPermition = permition.split(",");
                        if (roleActions != null) {
                            var arrayRoleActions = roleActions.split(",");
                        }

                        var indexViewDocuments = arrayPermition.indexOf("ViewDocuments");
                        var indexEditDocuments = arrayPermition.indexOf("EditDocuments");
                        var SetSecondaryCommitteeSessionResults = arrayPermition.indexOf("SetSecondaryCommitteeSessionResults");
                        var SetPrimaryCommitteeSessionResults = arrayPermition.indexOf("SetPrimaryCommitteeSessionResults");
                        var SetSecondaryCommitteeSession = arrayPermition.indexOf("SetSecondaryCommitteeSession");
                        var SetPrimaryCommitteeSession = arrayPermition.indexOf("SetPrimaryCommitteeSession");
                        var ShowUserNameOfDepartmentExpertSet = arrayPermition.indexOf("ShowUserNameOfDepartmentExpertSet");
                        var ShowUsersInThirdPartyCompany = arrayPermition.indexOf("ShowUsersInThirdPartyCompany");


                        var indexSetDirectDepartmentExpert = arrayPermition.indexOf("SetDirectDepartmentExpert");
                        var indexSetThirdParty = arrayPermition.indexOf("SetThirdParty");

                        var indexComment = arrayPermition.indexOf("Comment");

                        var indexAccept = -1;
                        var indexReject = -1;
                        var indexTurnBack = -1;

                        if (roleActions != null) {
                            var indexAccept = arrayRoleActions.indexOf("Accept");
                            var indexReject = arrayRoleActions.indexOf("Reject");
                            var indexTurnBack = arrayRoleActions.indexOf("TurnBack");
                        }

                        var indexViewGeneralDocuments = arrayPermition.indexOf("ViewGeneralDocuments");
                        var indexAddGeneralDocuments = arrayPermition.indexOf("AddGeneralDocuments");
                        var indexEditGeneralDocuments = arrayPermition.indexOf("EditGeneralDocuments");

                        if (indexViewGeneralDocuments != -1) {
                            //getAreaGeneralDocuments(current_Row, indexAddGeneralDocuments, indexEditGeneralDocuments);

                            $("#generalDoc-body").uploadFilePlugin({
                                objectId: valueRowSelect.id,
                                isViewDocuments: indexViewGeneralDocuments,
                                isAddDocuments: indexAddGeneralDocuments,
                                isEditDocuments: indexEditGeneralDocuments,
                            })

                            $('#generalDoc').removeClass('d-none');
                        }
                        else {
                            $("#generalDoc-body").html("");
                            $('#generalDoc').addClass('d-none');
                        }


                        if (indexViewDocuments != -1) {
                            //getRequiredFiles(valueRowSelect.id, indexEditDocuments);

                            $("#file-body").documentPlugin({
                                objectId: valueRowSelect.id,
                                isViewDocuments: indexViewDocuments,
                                isAddDocuments: indexEditDocuments,
                                isEditDocuments: indexEditDocuments,
                            })

                            $('#addFile').removeClass('d-none');
                        }
                        else {
                            $("#file-body").html("");
                            $('#addFile').addClass('d-none');
                        }

                        if (indexComment != -1) {

                            $("#commentCard").CommentPlugin({
                                objectId: viewModel.facilityId,
                                currentRole: settings.currentRole
                            });

                            $('#commentTab').removeClass('d-none')
                        }
                        else {
                            $("#commentCard").html("");
                            $('#commentTab').addClass('d-none');
                        }

                        if (indexAccept != -1) {

                            viewModel.action = 'Accept';
                            viewModel.indexEditDocuments = indexEditDocuments;

                            let okBtn = `<button id="okBtn" type="button" class="btn btn-success">تائید </button>`;
                            $("#acceptFacility").html(okBtn);
                            //document.getElementById('acceptFacility').innerHTML = btn1;
                        }
                        else {
                            $("#acceptFacility").html("");
                        }
                        if (indexReject != -1) {
                            let rejectBtn = `<button id="rejectBtn" type="button" class="btn btn-danger">
                            رد
                        </button>`;
                            $("#rejectFacility").html(rejectBtn);
                            //document.getElementById('rejectFacility').innerHTML = btn2;
                        }
                        else {
                            $("#rejectFacility").html("");
                        }
                        if (indexTurnBack != -1) {
                            let turnBackBtn = `<button  id="turnBackBtn" type="button" class="btn btn-primary" >
                            بازگشت
                        </button>`;
                            $("#turnBackFacility").html(turnBackBtn);
                            //document.getElementById('turnBackFacility').innerHTML = btn3;
                        }
                        else {
                            $("#turnBackFacility").html("");
                        }

                        //ThirdPartyINformation
                        if (ShowUsersInThirdPartyCompany != -1) {
                            // $("#facilityIdForAcceptSecendatySesstion").val(valueRowSelect.id);
                            //var secondaryCommitteeSessionDate = getDateWithOutTime(valueRowSelect.secondaryCommitteeSessionDate);
                            //var secondaryCommitteeSessionActualDate = getDateWithOutTime(valueRowSelect.secondaryCommitteeSessionActualDate);

                            let ShowUsersInThirdPartyCompany = `
                         <div class=" table-responsive">
                         <table id="FullNameOfUserInCompany" class="table table-striped table-responsive">
                            <thead>
                                <tr>
                                    <th>نام اعضای حاضر در شرکت انتخاب شده به عنوان (شرکت ناظر)</th>
                                </tr>
                            </thead>
                            <tbody id="UserInformationThirdParttyTable">
                            </tbody>

                         </table>
                        `;
                            $("#showUsersInThirdPartyCompanyInfo").html(ShowUsersInThirdPartyCompany);
                            FiilTableForAbputThirdPartyInformation();
                        }
                        else {
                            $("#showUsersInThirdPartyCompanyInfo").html("");
                        }

                        //DepartmentExpertInformation
                        if (ShowUserNameOfDepartmentExpertSet != -1) {
                            // $("#facilityIdForAcceptSecendatySesstion").val(valueRowSelect.id);
                            //var secondaryCommitteeSessionDate = getDateWithOutTime(valueRowSelect.secondaryCommitteeSessionDate);
                            //var secondaryCommitteeSessionActualDate = getDateWithOutTime(valueRowSelect.secondaryCommitteeSessionActualDate);

                            let showUserNameOfDepartmentExpertInfo = `
                           <div class="col-lg-12 col-md-12 mb-2">
                                        <ul class="list-group list-group-flush">
                                            <li  class="list-group-item d-flex justify-content-between align-items-center flex-wrap bg-info rounded  ">
                                                 <span class="mb-0">
                                                    <span>کاربر انتخاب شده به عنوان کارشناس اداره کل تخصصی:</span>
                                                    <span style="color: black"  id="fullNameChoosen"></span>
                                                 </span>

                                             </li>
                                        </ul>
                                    </div>
                                    <br />
                        `;
                            $("#showUserNameOfDepartmentExpertInfo").html(showUserNameOfDepartmentExpertInfo);
                            GetFullNameFromUserName();
                        }
                        else {
                            $("#showUserNameOfDepartmentExpertInfo").html("");
                        }

                        if (SetSecondaryCommitteeSessionResults != -1) {
                            // $("#facilityIdForAcceptSecendatySesstion").val(valueRowSelect.id);
                            var secondaryCommitteeSessionDate = getDateWithOutTime(valueRowSelect.secondaryCommitteeSessionDate);
                            var secondaryCommitteeSessionActualDate = getDateWithOutTime(valueRowSelect.secondaryCommitteeSessionActualDate);

                            let setSecondaryCommitteeSessionCard = `
                    <div class="border border-3 border-primary p-2  rounded">
                         <input  hidden type="text" value="${valueRowSelect.id}" id="facilityIdForAcceptSecendatySesstion" />
                         <h4>ثبت نتیجه جلسه فرعی</h4>
                         <div class="row">
                          <div class="col-md-4">
                             <label for="dateSesstion" class="form-label">تاریخ برگزاری جلسه فرعی</label>

                             <input type="text" class="form-control" id="actualDateSesstion" value="${secondaryCommitteeSessionActualDate != "" ? secondaryCommitteeSessionActualDate : secondaryCommitteeSessionDate}" name="actualDateSesstion" />
                             <div class="text-danger" id="actualDateSesstionError"></div>

                         </div>
                         <br />
                         <div class="col-md-4 col-sm-12">
                              <label style="visibility: hidden;" for="" class="form-label">دکمه تایید</label>
                              <br/>
                              <button id="btnAcceptSecendarySesstion"  style="width: 100%;" class="btn btn-warning">ثبت نتیجه جلسه فرعی</button>
                         </div>

                        </div>
                    </div>
                         <script>
                            var persianDatepickerActualDateSesstion = $('#actualDateSesstion').persianDatepicker({
                                'format': 'YYYY/MM/DD',
                                'autoclose': true,
                                showOtherMonths: true,
                                selectOtherMonths: true,
                                initialValue: true,
                                initialValueType: 'gregorian',
                                observer: true,

                            });
                        </script>
                    `;
                            $("#setSecondaryCommitteeSession-body").html(setSecondaryCommitteeSessionCard);
                        }
                        else {
                            $("#setSecondaryCommitteeSession-body").html("");
                        }

                        if (SetPrimaryCommitteeSessionResults != -1) {

                            var primaryCommitteeSessionDate = getDateWithOutTime(valueRowSelect.primaryCommitteeSessionDate);
                            var primaryCommitteeSessionActualDate = getDateWithOutTime(valueRowSelect.primaryCommitteeSessionActualDate);


                            let SetSetPrimaryCommitteeSessionCard = `
                      <div class="border border-3 border-primary p-2  rounded" id="setSetPrimaryCommitteeSession-body">

                            <input hidden  type="text" value="${valueRowSelect.id}" id="facilityIdForAcceptPrimarySesstion" />
                            <input hidden type="text" value="${valueRowSelect.primaryCommitteeSessionID}" id="PrimarySesstionId" />
                            <h4>ثبت نتیجه جلسه اصلی</h4>
                            
                            <div class="row">
                                   <div class="col-md-4">
                                        <label for="dateSesstion" class="form-label">تاریخ برگزاری جلسه اصلی</label>

                                        <input type="text" class="form-control" id="actualDatePrimarySesstion" value="${primaryCommitteeSessionActualDate != "" ? primaryCommitteeSessionActualDate : primaryCommitteeSessionDate}" name="actualDatePrimarySesstion" />
                                        <div class="text-danger" id="actualDateSesstionError"></div>

                                    </div>
                                    <div class="col-md-4">
                                        <label for="acceptedAmount" class="form-label">مبلغ تایید شده (ریال)</label>
                                        <input type="text" class="form-control" id="acceptedAmount"  value="${valueRowSelect.acceptedAmount != null ? valueRowSelect.acceptedAmount : ''}"
                                                />
                                        <div class="invalid-feedback" data-valmsg-for="acceptedAmount" data-valmsg-replace="true" for="acceptedAmount"></div>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="acceptedInterestRate" class="form-label">نرخ یارانه</label>
                                        <input type="number" class="form-control" id="acceptedInterestRate"
                                                value="${valueRowSelect.acceptedInterestRate != null ? valueRowSelect.acceptedInterestRate : ''}"/>
                                        <div class="invalid-feedback" data-valmsg-for="acceptedInterestRate" id="acceptedInterestRateError" data-valmsg-replace="true" for="acceptedInterestRate"></div>
                                    </div>

                                    <div class="col-md-4 col-sm-12 mt-2">
                                        <button id="btnAcceptPrimarySesstion"  style="width: 100%;" class="btn btn-warning ">ثبت نتیجه  جلسه اصلی</button>
                                     </div>
                            </div>
                            
                       </div>
                      <script>
                          var acceptedAmount = new Cleave('#acceptedAmount', {
                          numeral: true,
                          numeralThousandsGroupStyle: 'thousand',
                      });
                          $('#actualDatePrimarySesstion').persianDatepicker({
                              'format': 'YYYY/MM/DD',
                                'autoclose': true,
                                showOtherMonths: true,
                                selectOtherMonths: true,
                                initialValue: true,
                                initialValueType: 'gregorian',
                                observer: true,
                          });
                      </script>
                    `;
                            $("#setSetPrimaryCommitteeSession-body").html(SetSetPrimaryCommitteeSessionCard);
                        }
                        else {
                            $("#setSetPrimaryCommitteeSession-body").html("");
                        }

                        if (indexSetDirectDepartmentExpert != -1) {

                            let template = `
                        <div class="border border-3 border-primary p-2  rounded">
                            <h4>تخصیص کارشناس مستقیم   </h4>
                            <div class="row">
                                   <div class="col-md-6">
                                        <label for="departmentUserLocal" class="form-label">انتخاب کارشناس</label>
                                       <select class="form-select mb-3" aria-label="" id="departmentUserLocal" name="departmentUserLocal" data-val-required="لطفا شخص مورد نظر  را وارد کنید"
                                                required>
                                                <option value="null">انتخاب کارشناس</option>
                                        </select>

                                    </div>

                                    <div class="col-md-4 col-sm-12 " id="setExpertBtnCard">
                                        <label for="setExpertBtn" class="form-label text-white">انتخاب کارشناس</label>
                                        <button id="setExpertBtn" style="width: 100%;" class="btn btn-warning ">ثبت کارشناس </button>
                                     </div>
                                    <div hidden class="col-md-4 col-sm-12" id="editExpertBtnCard">
                                        <label for="editExpertBtn" class="form-label text-white">انتخاب کارشناس</label>
                                        <button  id="editExpertBtn" style="width: 100%;" class="btn btn-warning">ویرایش کارشناس </button>
                                     </div>
                            </div>
                         </div>                           
                         <br/>
                         `
                            $("#UserOfDepartmentSection").html(template);
                            GetAlluserOfDepartment(valueRowSelect.directDepartmentExpertUserName);
                        }
                        else {
                            $("#UserOfDepartmentSection").html("");
                        }

                        if (indexSetThirdParty != -1) {

                            let template = `
                        <div class="border border-3 border-primary p-2  rounded">
                            <h4>تخصیص شرکت حقوقی ثالث  </h4>
                            <div class="row">
                                    <div class="col-md-6">
                                        <label for="dateSesstion" class="form-label">انتخاب شرکت حقوقی ثالث</label>
                                       <select class="form-select mb-3" aria-label="" id="companyThirdParty" name="companyThirdParty" data-val-required="لطفا شرکت حقوقی ثالث  را وارد کنید"
                                                required>
                                                <option value="null">انتخاب شرکت حقوقی ثالث</option>
                                        </select>

                                    </div>

                                    <div class="col-md-4 col-sm-12" id="setThirdPartiBtnCard">
                                        <label for="setThirdPartiBtn" class="form-label text-white">انتخاب شرکت حقوقی</label>

                                        <button id="setThirdPartiBtn"  style="width: 100%;" class="btn btn-warning ">ثبت شرکت حقوقی ثالث</button>
                                     </div>
                                    <div hidden class="col-md-4 col-sm-12 " id="editThirdPartiBtnCard">
                                        <label for="editThirdPartiBtn" class="form-label text-white">انتخاب شرکت حقوقی</label>

                                        <button  id="editThirdPartiBtn"  style="width: 100%;" class="btn btn-warning">ویرایش شرکت حقوقی ثالث</button>
                                     </div>
                            </div>
                         </div>                           
                         <br/>
                         `
                            $("#ThirdPartiSection").html(template);
                            getAllCompanyThirdParty(valueRowSelect.thirdPartyCompanyID);
                        }
                        else {
                            $("#ThirdPartiSection").html("");
                        }

                        area.find('#rejectBtn').click(function () {
                            showModalSendActionToFacilityRequestWorkflow(viewModel.facilityId, 'Reject')

                        });

                        area.find('#turnBackBtn').click(function () {
                            showModalSendActionToFacilityRequestWorkflow(viewModel.facilityId, 'TurnBack')
                        });

                        area.find('#okBtn').click(function () {
                            sendActionToFacilityRequestWorkflow(viewModel.facilityId, 'Accept', viewModel.indexEditDocuments)
                        });

                        area.find('#setExpertBtn').click(function () {
                            setExpert(viewModel.facilityId)
                        });

                        area.find('#editExpertBtn').click(function () {
                            editExpert()
                        });

                        area.find('#setThirdPartiBtn').click(function () {
                            setThirdParti(viewModel.facilityId)
                        });

                        area.find('#editThirdPartiBtn').click(function () {
                            editThirdParti()
                        });

                        area.find('#btnAcceptSecendarySesstion').click(function () {
                            acceptSecendarySesstion()
                        });

                        area.find('#btnAcceptPrimarySesstion').click(function () {
                            acceptPrimarySesstion()
                        });

                    } catch (e) {
                        indexViewDocuments = -1;
                        indexAccept = -1;
                        indexReject = -1;
                        indexTurnBack = -1;;
                        SetSecondaryCommitteeSessionResults = -1;
                        SetPrimaryCommitteeSessionResults = -1;
                        SetSecondaryCommitteeSession = -1;
                        SetPrimaryCommitteeSession = -1;
                        indexSetDirectDepartmentExpert = -1;
                        indexSetThirdParty = -1;
                    }

                    $('.nav-tabs a[href="#infofacilityAndProgram1"]').tab('show');
                    $('#detailsModalFacilityWithWorkFlowInstance').modal('show');
                }

            }
            else {
                ivsAlert('ابتدا یک رکورد را انتخاب کنید', `خطا`, 'error');
            }
        }

        function showModalSendActionToFacilityRequestWorkflow(id, actionName) {
            $('#facilityId').val(id);
            $('#actionName').val(actionName);
            $('#desForFacility').val("");

            if (actionName == 'Reject') {
                $('#modalRegisterDescriptionReject_TurnBack .modal-title').text("علت رد");
            }
            else if (actionName == 'TurnBack') {
                $('#modalRegisterDescriptionReject_TurnBack .modal-title').text("توضیحات حین بازگشت");
            }
            $('#modalRegisterDescriptionReject_TurnBack').modal('show');

        }

        function registerDescriptionReject_Turnback() {

            var facilityId = parseInt($('#facilityId').val());
            var actionNameFacility = $('#actionName').val();
            var desForFacility = $('#desForFacility').val();

            if (actionNameFacility == "TurnBack") {
                if (desForFacility == "") {
                    ivsAlert2('error', 'خطا سیستم', 'علت بازگشت نمیتواند خالی باشد');
                    return
                }
            }
            else {
                if (desForFacility == "") {
                    ivsAlert2('error', 'خطا سیستم', 'علت رد نمیتواند خالی باشد');
                    return
                }
            }


            loading('registerDescriptionReject_TurnbackBtn', true, true);

            $.ajax({
                type: "get",
                url: settings.sendActionToFacilityRequestWorkflow + "?id=" + facilityId + "&actionName=" + actionNameFacility + "&description=" + desForFacility,
                //url: "/api/Facility/SendActionToFacilityRequestWorkflow?id=" + id + "&actionName=" + actionName,
                success: function (result) {
                    loading('registerDescriptionReject_TurnbackBtn', false, true);
                    $('#modalRegisterDescriptionReject_TurnBack').modal('hide');
                    $('#detailsModalFacilityWithWorkFlowInstance').modal('hide');
                    ivsAlert('عملیات با موفقیت انجام شد', 'پیغام موفقیت', 'success');
                    $('#desForFacility').val("");
                    $('.menu-items').prop('disabled', true);
                },
                error: function (ex, cc, bb) {
                    loading('registerDescriptionReject_TurnbackBtn', false, true);
                    $('#modalRegisterDescriptionReject_TurnBack').modal('hide');
                    $('#desForFacility').val("");

                    $('#detailsModalFacilityWithWorkFlowInstance').modal('hide');

                     if(ex.responseText.includes("1020")) {
                         ivsAlert2('warning', 'خطای عدم ثبت  سند توسط کاربر شرکت ثالث', 'شما به عنوان کاربر شرکت ثالث باید حداقل یک سند در بخش اسناد عمومی وارد کنید', position = "top right", delay = 5);
                     }
                     else {
                         ivsAlert('اشکال در برقراری ارتباط با سرور - بخش ثبت دکمه ها', 'خطا', 'error');
                     }
                    //console.log({ ex });
                    //console.log({ cc });
                    //console.log({ bb });

                },
                complete: function (jqXHR) {

                    viewModel.programDataTable.ajax.reload();
                    viewModel.childTable.ajax.reload();
                }
            });

        }

        ///بررسی فایل های اجباری
        async function checkUploadRequireFiles(facilityId) {

            let data = await fetch(settings.getFacilityRequestRequiredDocuments + "?id=" + facilityId)
                .then((response) => response.json())
                .then(result => {
                    var errorCountRequiredDocuments = 0;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].required == true) {
                            if (result[i].uploadedDocuments.length < 1) {
                                errorCountRequiredDocuments++
                            }
                        }
                    }

                    return errorCountRequiredDocuments;
                })
                .catch(error => {
                    ivsAlert('اشکال در برقراری ارتباط با سرور - خطا در چک کردن فایل های اجباری', 'خطا', 'error');
                    console.error(error);
                });

            return data;

        }

        async function sendActionToFacilityRequestWorkflow(id, actionName, isHasEditDocuments) {

            loading('okBtn', true, true);

            if (isHasEditDocuments != -1) {
                var countError = await checkUploadRequireFiles(id);
                if (countError != 0) {
                    ivsAlert2('error', 'خطا سیستم', 'متقاضی گرامی ابتدا برای مستندات اجباری سیستم حداقل یک فایل بارگذاری کنید', position = "top right", delay = 10);
                    loading('okBtn', false, true);
                    return;
                }
            }




            $.ajax({
                type: "get",

                url: settings.sendActionToFacilityRequestWorkflow + "?id=" + id + "&actionName=" + actionName,
                success: function (result) {
                    loading('okBtn', false, true);
                    $('.menu-items').prop('disabled', true);
                    $('#detailsModalFacilityWithWorkFlowInstance').modal('hide');
                    ivsAlert('عملیات با موفقیت انجام شد', 'پیغام موفقیت', 'success');

                },
                error: function (ex, cc, bb) {
                    loading('okBtn', false, true);


                    if (ex.responseText.includes("1011")) {
                        ivsAlert2('error', 'خطای عدم معرفی کارشناس', "لطفا کارشناس مربوطه جهت بررسی ادامه فرایند را انتخاب نمایید", position = "top right", delay = 5);
                    }
                    else if (ex.responseText.includes("1012")) {
                        ivsAlert2('error', 'خطای عدم ثبت جلسه فرعی', 'ابتدا برای این تسهیلات یک جلسه فرعی تنظیم نمایید.', position = "top right", delay = 5);
                    }
                    else if (ex.responseText.includes("1013")) {
                        ivsAlert2('error', 'خطای عدم ثبت نتیجه جلسه فرعی', 'ابتدا برای این تسهیلات نتیجه جلسه فرعی ثبت نمایید.', position = "top right", delay = 5);
                    }
                    else if (ex.responseText.includes("1014")) {
                        ivsAlert2('error', 'خطای عدم ثبت جلسه اصلی', 'ابتدا برای این تسهیلات یک جلسه اصلی تنظیم نمایید.', position = "top right", delay = 5);
                    }
                    else if (ex.responseText.includes("1015")) {
                        ivsAlert2('error', 'خطای عدم ثبت نتیجه جلسه اصلی', 'ابتدا برای این تسهیلات نتیجه جلسه اصلی ثبت نمایید.', position = "top right", delay = 5);
                    }
                    else if (ex.responseText.includes("1016")) {
                        ivsAlert2('error', 'خطای عدم ثبت شرکت ثالث', 'ابتدا شرکت ثالث را ثبت کنید', position = "top right", delay = 5);
                    }
                    else if (ex.responseText.includes("1020")) {
                        ivsAlert2('error', 'خطای عدم ثبت  سند توسط کاربر شرکت ثالث', 'شما به عنوان کاربر شرکت ثالث باید حداقل یک سند در بخش اسناد عمومی وارد کنید', position = "top right", delay = 5);
                    }
                    else {
                        ivsAlert2("error", "خطا سیستم", "خطای ارتباط با سرور");
                    }

                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {

                    viewModel.programDataTable.ajax.reload();
                    viewModel.childTable.ajax.reload();
                }
            });
        }


        function submitAndReviewFacility() {

            var facilityIdSubmit = parseInt($('#facilityIdModal').val());

            loading('btnSubmitAndReviewFacility', true, true);
            $.ajax({
                type: "get",
                url: settings.finalizeFacilityRequestAndStartWorkflow + "?id=" + viewModel.facilityId,
                success: function (result) {
                    loading('btnSubmitAndReviewFacility', false, true);
                    //console.log(result);

                    $('.menu-items').prop('disabled', true);
                    $('#detailsModal').modal('hide');
                    ivsAlert('تایید نهایی با موفقیت انجام و جهت بررسی اولیه بوسیله به کارشناس دبیرخانه ارسال شد', 'پیغام موفقیت', 'success');


                },
                error: function (ex, cc, bb) {

                    loading('btnSubmitAndReviewFacility', false, true);
                    ivsAlert('اشکال در برقراری ارتباط با سرور - بخش ثبت جهت بررسی اولیه', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {
                    viewModel.programDataTable.ajax.reload();
                }
            });
        }

        function GetAlluserOfDepartment(directDepartmentExpertUserName) {

            var departmentCode = $("#departmentCodeID").val();
            $.ajax({
                type: "get",
                url: settings.getUsersOfDepartment + "?departmentID=" + departmentCode,
                success: function (result) {
                    //console.log(result);
                    if (result != null) {
                        $.each(result, function (a, b) {
                            $('#departmentUserLocal').append(`<option value="${b.userName}">${b.fullName}</option>`)
                        });
                        if (directDepartmentExpertUserName != null) {
                            $('#departmentUserLocal').val(directDepartmentExpertUserName);
                            $('#departmentUserLocal').prop('disabled', true);
                            $('#setExpertBtnCard').prop('hidden', true);
                            $('#editExpertBtnCard').prop('hidden', false);
                        }
                    }
                },
                error: function (ex, cc, bb) {
                    ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {

                }

            });
        }

        function editExpert() {
            $('#departmentUserLocal').prop('disabled', false);

            $('#setExpertBtnCard').prop('hidden', false);
            $('#editExpertBtnCard').prop('hidden', true);
        }

        function setExpert(facilityId) {
            var DepartmentUserSelected = $("#departmentUserLocal").val();

            if (DepartmentUserSelected == "null") {
                ivsAlert2('error', 'پیغام خطا', 'کارشناس را انتخاب کنید');
                return;
            }


            loading('setExpertBtn', true, true);

            $.ajax({
                type: "post",

                url: settings.setDirectDepartmentExpert + "?facilityRequestID=" + facilityId + "&userName=" + DepartmentUserSelected,
                success: async function (result) {
                    loading('setExpertBtn', false, true);

                    ivsAlert2('success', 'پیغام موفقیت', 'کارشناس با موفقیت ثبت شد.');

                    $('#departmentUserLocal').prop('disabled', true);

                    $('#setExpertBtnCard').prop('hidden', true);
                    $('#editExpertBtnCard').prop('hidden', false);


                },
                error: function (ex, cc, bb) {
                    loading('setExpertBtn', false, true);

                    ivsAlert2('error', 'پیغام خطا', 'اشکال در برقراری ارتباط با سرور - بخش تخصیص انتخاب کارشناس');
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {
                    loading('setExpertBtn', false, true);
                    viewModel.programDataTable.ajax.reload();
                    viewModel.childTable.ajax.reload();
                }
            });
        }

        function editThirdParti() {
            $('#companyThirdParty').prop('disabled', false);

            $('#setThirdPartiBtnCard').prop('hidden', false);
            $('#editThirdPartiBtnCard').prop('hidden', true);
        }

        function setThirdParti(facilityId) {
            var thirdPartiId = $("#companyThirdParty").val();

            if (thirdPartiId == "null") {
                ivsAlert2('error', 'پیغام خطا', 'کارشناس و شخص حقوقی ثالث را انتخاب کنید');
                return;
            }


            loading('setThirdPartiBtn', true, true);

            $.ajax({
                type: "post",
                url: settings.setThirdParty + "?facilityRequestID=" + facilityId + "&thirdPartyCompanyID=" + thirdPartiId,
                success: function (result) {
                    //console.log(result);
                    loading('SetDirectorExpert', false, true);
                    ivsAlert2('success', 'پیغام موفقیت', 'شخص حقوقی ثالث با موفقیت ثبت شد.');

                    $('#departmentUserLocal').prop('disabled', true);
                    $('#companyThirdParty').prop('disabled', true);

                    $('#setThirdPartiBtnCard').prop('hidden', true);
                    $('#editThirdPartiBtnCard').prop('hidden', false);

                },
                error: function (ex, cc, bb) {
                    ivsAlert2("error", "پیام خطا", "خطا در ثبت شخص حقوقی ثالث");
                    //console.log(ex);
                    //console.log(bb);
                    loading('setThirdPartiBtn', false, true);
                },
                complete: function (jqXHR) {
                    loading('setThirdPartiBtn', false, true);

                }

            });
        }

        function getAllCompanyThirdParty(thirdPartyCompanyID) {

            $.ajax({
                type: "get",
                url: settings.getAllCompanythirdPartyView,
                success: function (result) {
                    //console.log(result);
                    if (result != null) {
                        $.each(result, function (a, b) {
                            $('#companyThirdParty').append(`<option value="${b.id}">${b.name}</option>`)
                        });
                        if (thirdPartyCompanyID != null) {
                            $('#companyThirdParty').val(thirdPartyCompanyID);
                            $('#companyThirdParty').prop('disabled', true);
                            $('#setThirdPartiBtnCard').prop('hidden', true);
                            $('#editThirdPartiBtnCard').prop('hidden', false);
                        }
                    }
                },
                error: function (ex, cc, bb) {
                    ivsAlert('اشکال در برقراری ارتباط با سرور', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {

                }

            });
        }

        function GetFullNameFromUserName() {
            var valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];
            var x = valueRowSelect.directDepartmentExpertUserName;
            //console.log(valueRowSelect);
            $.ajax({
                type: "get",
                url: settings.getFullNameFromUserName + "?userName=" + x,
                success: function (result) {
                    if (result != null) {
                        //console.log(result);
                        if ($('#fullNameChoosen').text() != null) {
                            $('#fullNameChoosen').text("");
                        };
                        $('#fullNameChoosen').text(result.fullName);
                    }
                },
                error: function (ex, cc, bb) {
                    ivsAlert('نام کامل کارشناس انتخاب شده با موفقیت دریافت نشد !', 'خطا', 'error');
                },
                complete: function (jqXHR) {

                }

            });
        }

        function FiilTableForAbputThirdPartyInformation() {
            ;
            var valueRowSelect = viewModel.childTable.rows({ selected: true }).data()[0];
            var x = valueRowSelect.thirdPartyCompanyID;
            //console.log(valueRowSelect);
            $.ajax({
                type: "get",
                url: settings.getCompanyNationalCodeFromCompany + "?companyID=" + x,
                success: function (result) {
                    ;
                    if (result != null) {
                        $.ajax({
                            type: "get",
                            url: settings.getAllUserFullNameFromCompanyNational + "?companyNationalID=" + result,
                            success: function (result2) {
                                ;
                                if (result2 != null) {
                                    const table = $('#UserInformationThirdParttyTable')[0];
                                    result2.forEach(data => {
                                        let row = table.insertRow();
                                        let cel = row.insertCell(0);
                                        cel.innerHTML = data;
                                    });
                                }
                            },
                            error: function (ex, cc, bb) {
                                ivsAlert('sw !', 'خطا', 'error');
                            },
                            complete: function (jqXHR) {

                            }

                        });
                    }
                },
                error: function (ex, cc, bb) {
                    ivsAlert('sw!', 'خطا', 'error');
                },
                complete: function (jqXHR) {

                }

            });
        }


        function acceptSecendarySesstion() {


            if ($('#actualDateSesstion').val() == null || $('#actualDateSesstion').val() == "") {
                ivsAlert2("error", "پیام خطا", "تاریخ برگزاری جلسه را وارد کنید");
                return;
            }

            var secendarySesstionResultModel = {
                facilityRequestID: $('#facilityIdForAcceptSecendatySesstion').val(),
                actualSessionDate: shamsiTomiladi2($('#actualDateSesstion').val()),
            }

            loading('btnAcceptSecendarySesstion', true, true);
            $.ajax({
                type: "post",
                url: settings.setSecondaryCommitteeResults,
                data: JSON.stringify(secendarySesstionResultModel),
                contentType: "application/json;",
                success: function (result) {



                    loading('btnAcceptSecendarySesstion', false, true);
                    ivsAlert2('success', ' پیام موفقیت', 'تاریخ برگزاری جلسه با موفقیت ثبت شد');
                    //$('#detailsModalFacilityWithWorkFlowInstance').modal('hide');


                    //console.log({ result })
                },
                error: function (ex, cc, bb) {
                    loading('btnAcceptSecendarySesstion', false, true);

                    ivsAlert('اشکال در برقراری ارتباط با سرور -   بخش ثبت تاریخ جلسه', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);

                },
                complete: function (jqXHR) {

                    //viewModel.programDataTable.ajax.reload();
                    //childTable.ajax.reload();
                }
            });


        };

        function acceptPrimarySesstion() {

            if ($('#actualDatePrimarySesstion').val() == "" || $('#acceptedAmount').val() == "" || $('#acceptedInterestRate').val() == "") {
                ivsAlert2("error", "پیام خطا", "ابتدا فیلدهای مورد نظر را پر کنید");
                return;
            }

            if ($('#acceptedInterestRate').val() > 100) {
                ivsAlert2("error", "پیام خطا", "نرخ یارانه باید بین 0 تا 100 باشد");
                return;
            }
            if ($('#acceptedInterestRate').val() < 0) {
                ivsAlert2("error", "پیام خطا", "نرخ یارانه باید بین 0 تا 100 باشد");
                return;
            }

            loading('btnAcceptPrimarySesstion', true, true);
            var primarySesstionResultModel = {
                facilityRequestID: $('#facilityIdForAcceptPrimarySesstion').val(),
                sessionID: $('#PrimarySesstionId').val(),
                //sessionID:  "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                actualSessionDate: shamsiTomiladi2($('#actualDatePrimarySesstion').val()),
                acceptedAmount: PersianTools.removeCommas($('#acceptedAmount').val()),
                acceptedInterestRate: $('#acceptedInterestRate').val(),

            }

            $.ajax({
                type: "post",
                url: settings.setPrimaryCommitteeSessionResults,
                data: JSON.stringify(primarySesstionResultModel),
                contentType: "application/json;",
                success: async function (result) {


                    loading('btnAcceptPrimarySesstion', false, true);
                    ivsAlert2('success', ' پیام موفقیت', 'تاریخ برگزاری جلسه با موفقیت ثبت شد');
                    //$('#detailsModalFacilityWithWorkFlowInstance').modal('hide');


                    //console.log({ result })
                },
                error: function (ex, cc, bb) {
                    loading('btnAcceptPrimarySesstion', false, true);
                    if (ex.responseText.match(/(^|\W)912($|\W)/)) {
                        ivsAlert2("error", "پیام خطا", "نرخ یارانه باید بین 0 تا 100 باشد");
                        return;
                    }

                    ivsAlert('اشکال در برقراری ارتباط با سرور -   بخش ثبت تاریخ جلسه', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {

                    //viewModel.programDataTable.ajax.reload();
                    //childTable.ajax.reload();
                }
            });

            //console.log(acceptSecendarySesstionModel);
        };

        async function gotoAddFacilityPage() {
            let count = viewModel.programDataTable.rows({ selected: true }).count();
            var valueRowSelect = viewModel.programDataTable.rows({ selected: true }).data()[0];

            if (count > -1 && valueRowSelect.totalFacilityRequestCount === 0) {
                window.location = settings.addFacilityRequest + "?id=" + valueRowSelect.id;
            }
            else {
                ivsAlert('امکان افزودن تسهیلات وجود ندارد زیرا برای این طرح تسهیلات ثبت شده است.', `خطا`, 'error');
            }
        }


        function getTemplate(v) {

            var ss = `
                
            `;
            ss = minifyHtml(ss);

            return ss;
        }


        this.refreshCartable = function () {
            viewModel.programDataTable.ajax.reload();

        }

        this.destroy = function () {
            if (settings.addTemplate) {
                area.html('');
            }
        };
        return this;
    }

}(jQuery));
