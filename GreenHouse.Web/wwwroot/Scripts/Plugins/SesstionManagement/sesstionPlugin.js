(function ($) {
    $.fn.sesstionPlugin = function (options) {
        var settings = $.extend({

            layout: 'sesstionManagment', ///sesstionManagment, cartable
            typeSesstion: null,
            actionName: 'add',

            facilityTable: null,

            getFacilityRequestItemsReadyForPrimaryCommitteeSessionAsync: '/api/Facility/FacilityRequestItemsReadyForPrimaryCommitteeSessionAsync?justNew=true',
            getFacilityRequestItemsReadyForSecondaryCommitteeSessionAsync: '/api/Facility/FacilityRequestItemsReadyForSecondaryCommitteeSessionAsync?justNew=true',
            getAllActiveUser: '/api/User/GetAllActiveUser',
            getAllSessionRooms: '/api/SessionRoom/GetAllSessionRooms',

            postSession: '/api/Session/Post',

            addTemplate: true,
        }, options);

        var viewModel = {
            urlFacilityTable: null,
            sesstionTypeId: null
        };
        var area = this;



        buildInterface();

        async function buildInterface() {

            if (settings.typeSesstion == null) {
                area.html(cardAlert('نوع جلسه را مشخص کنید', 'خطا', 'error'));
                return;
            }

            if (settings.addTemplate) {
                await area.html(getTemplate());
            }


            await createUi_loadDefualtValue();

            area.find('#btnRegisterSesstion').click(function () {
                addSesstion();
            });

            area.find('#closeaeAgendaModal').click(function () {
                area.find("#aeAgendaModal").modal("hide");
            });

        }

        async function checkPrimarySesstion() {
            let data = await fetch(settings.getFacilityRequestItemsReadyForPrimaryCommitteeSessionAsync)
                .then((response) => response.json())
                .then(data => {
                    return data.recordsTotal;
                })
                .catch(error => {
                    ivsAlert2("error", 'خطای سیستم', 'اشکال در برقراری ارتباط با سرور - خطا در اجرا جلسات اصلی');
                    console.error(error);
                });
            return data;
        }

        async function checkSecondarySesstion() {
            let data = await fetch(settings.getFacilityRequestItemsReadyForSecondaryCommitteeSessionAsync)
                .then((response) => response.json())
                .then(data => {
                    return data.recordsTotal;
                })
                .catch(error => {
                    ivsAlert2("error", 'خطای سیستم', 'اشکال در برقراری ارتباط با سرور - خطا در اجرا جلسات فرعی');
                    console.error(error);
                });
            return data;
        }

        async function createUi_loadDefualtValue() {

            if (settings.actionName == "add") {
                if (settings.typeSesstion == "PrimarySesstion") {

                    let getCountSesstion = await checkPrimarySesstion();
                    if (getCountSesstion == 0) {
                        ivsAlert2('error', 'هشدار سیستم', 'هیچ تسهیلاتی برای تعیین جلسه وجود ندارد');
                        return;
                    }

                    area.find('#title-sesstion').html("افزودن جلسه کمیته اصلی");
                    area.find('#titleSesstion').val(" جلسه کمیته اصلی");
                    viewModel.urlFacilityTable = settings.getFacilityRequestItemsReadyForPrimaryCommitteeSessionAsync;
                    viewModel.sesstionTypeId = 1;
                }
                else if (settings.typeSesstion == "SecondarySesstion") {

                    let getCountSesstion = await checkSecondarySesstion();
                    if (getCountSesstion == 0) {
                        ivsAlert2('error', 'هشدار سیستم', 'هیچ تسهیلاتی برای تعیین جلسه وجود ندارد');
                        return;
                    }

                    area.find('#title-sesstion').html("افزودن جلسه فرعی");
                    area.find('#titleSesstion').val(" جلسه فرعی");
                    viewModel.urlFacilityTable = settings.getFacilityRequestItemsReadyForSecondaryCommitteeSessionAsync;
                    viewModel.sesstionTypeId = 2;
                }
            }

            area.find("#inviteUserSesstionCard").drapdownPlugin({
                apiAddress: settings.getAllActiveUser,
                valueOption: 'nationalCodeId',
                textOption: 'lastName',
                idTagName: 'inviteUserSesstion',

                title: 'کاربران دعوت شده',
                isMultiSelect: true,
                //isRequire: true,
                //textRequire: 'این فیلد اجباری است.',
                dropdownParent: 'aeSesstionModal',
            });

            area.find("#informantsSesstionCard").drapdownPlugin({
                apiAddress: settings.getAllActiveUser,
                valueOption: 'nationalCodeId',
                textOption: 'lastName',
                idTagName: 'informantsSesstion',

                title: 'کاربران مطلع',
                isMultiSelect: true,
                dropdownParent: 'aeSesstionModal',
            });

            area.find("#roomSesstionCard").drapdownPlugin({
                apiAddress: settings.getAllSessionRooms,
                valueOption: 'id',
                textOption: 'title',
                idTagName: 'roomSesstion',
                title: 'اتاق جلسات',
                //isRequire: true,
                //textRequire: 'این فیلد اجباری است.',
                dropdownParent: 'aeSesstionModal',
            });

            settings.facilityTable =
                area.find('#facilityRequestForSesstion').DataTable({
                    //serverSide: true, //make server side processing to true
                    ajax:
                    {
                        contentType: 'application/json',
                        url: viewModel.urlFacilityTable
                    },
                    paging: false,
                    ordering: false,
                    info: false,
                    //processing: true,
                    colReorder: false,
                    searchPanes: false,
                    scrollX: false,
                    destroy: true,
                    //select: true,
                    bFilter: false,
                    paginationType: "full_numbers",//pagination type


                    columns: [
                        {
                            defaultContent: '<input type="checkbox"  class="form-check-input check-facility" name="" id="">',
                            type: "html",
                        },
                        { data: "code", name: "code", type: "html" },

                        { data: "requiredTime", name: "requiredTime", type: "html" },
                        { data: "requiredBudget", name: "requiredBudget", render: function (data, type, row) { return PersianTools.addCommas(data) } },

                        { data: "workflowCurrentStepTitle", name: "workflowCurrentStepTitle", type: "html", visible: true, },
                        { data: "finalizationTime", render: function (data, type, row) { return getPerianDate(data) } },

                    ],
                    select: {
                        style: 'multi'
                    }
                });

            settings.facilityTable.on('select', function (event, dt, type, indexes) {

                //console.log(indexes);
                settings.facilityTable.cell({ row: indexes[0], column: 0 }).data(`<input type="checkbox" checked  class="form-check-input check-facility" name="" id="">`);

            }).on('deselect', function (event, dt, type, indexes) {
                //console.log('deselect');
                settings.facilityTable.cell({ row: indexes[0], column: 0 }).data(`<input type="checkbox"  class="form-check-input check-facility" name="" id="">`);
            });

            area.find('#dateSesstion').persianDatepicker({
                'format': 'YYYY/MM/DD',
                'autoclose': true,
                showOtherMonths: true,
                selectOtherMonths: true,
            });

            area.find('#endTime').pickatime({
                format: 'HH:i',
                min: [5, 00],

            });

            area.find('#startTime').pickatime({
                format: 'HH:i',
                min: [5, 00],
                onSet: function (context) {

                    let selectTime = minutesToHours(context.select + 30);
                    let max = [selectTime[0], selectTime[1]]
                    let time = $('#endTime').pickatime().pickatime('picker');
                    time.clear().set({ 'min': max });
                }
            });

            area.find("#aeSesstionModal").modal('show');
        }


        async function addSesstion() {

            //let getAttendeesAvailablity = await checkAttendeesAvailablity();
            //let getkRoomAvailablity = await checkRoomAvailablity();



            var inviteUsers = [];
            var informantsUsers = [];
            var facilityList = [];

            inviteUsers = area.find("#inviteUserSesstion").val();
            informantsUsers = area.find("#informantsSesstion").val();
            roomSesstion = area.find("#roomSesstion").val();



            var countErrors = 0;

            if (area.find("#titleSesstion").val() == "") {
                countErrors++;

                area.find("#titleSesstion-error").text("لطفا عنوان جلسه را وارد نمایید");
                area.find("#titleSesstion").removeClass("successInput")
                area.find("#titleSesstion").addClass("errorInput");
            }
            else {
                area.find("#titleSesstion-error").text("");
                area.find("#titleSesstion").removeClass("errorInput");
                area.find("#titleSesstion").addClass("successInput");
            }

            if (roomSesstion == null) {
                countErrors++;
                area.find(".roomSesstion  .select2-selection--single ").addClass("errorInput");
                area.find(".roomSesstion  .select2-selection--single ").removeClass("successInput");
                area.find("#roomSesstion-error").text("اتاق جلسه را مشخص نمایید");
            }
            else {
                area.find(".inviteUser .select2-selection--multiple ").removeClass("errorInput");
                area.find(".inviteUser .select2-selection--multiple ").addClass("successInput");
                area.find("#errorMassageInviteUser").text("");
            }

            if (inviteUsers.length < 1) {
                countErrors++;
                area.find(".inviteUser  .select2-selection--multiple ").addClass("errorInput");
                area.find(".inviteUser  .select2-selection--multiple ").removeClass("successInput");
                area.find("#errorMassageInviteUser").text("کاربران دعوت شده به جلسه را مشخص نمایید");
            }
            else {
                area.find(".inviteUser .select2-selection--multiple ").removeClass("errorInput");
                area.find(".inviteUser .select2-selection--multiple ").addClass("successInput");
                area.find("#errorMassageInviteUser").text("");
            }

            if (settings.facilityTable.rows('.selected').count() < 1) {
                countErrors++;
                area.find("#errorMassageNoSelectFacility").text("لطفا تسهیلات (حداقل یک مورد) انتخاب نمایید");
                area.find("#facilityRequestForSesstion").addClass("errorTable");

            }
            else {
                area.find("#errorMassageNoSelectFacility").text("");
                area.find("#facilityRequestForSesstion").removeClass("errorTable");

            }

            if (area.find('#startTime').val() == "") {
                countErrors++;
                area.find("#startTimeErrorMassage").text("لطفا ساعت شروع جلسه را مشخص نمایید.");
                area.find("#startTime").addClass("errorInput");
                area.find("#startTime").removeClass("successInput");

            }
            else {
                area.find("#startTimeErrorMassage").text("");
                area.find("#startTime").removeClass("errorInput");
                area.find("#startTime").addClass("successInput");

            }

            if ($('#endTime').val() == "") {
                countErrors++;
                area.find("#endTimeErrorMassage").text("لطفا ساعت پایان جلسه را مشخص نمایید.");
                area.find("#endTime").addClass("errorInput");
                area.find("#endTime").removeClass("successInput");

            }
            else {
                area.find("#endTimeErrorMassage").text("");
                area.find("#endTime").removeClass("errorInput");
                area.find("#endTime").addClass("successInput");
            }


            let aeSesstionModalForm = document.getElementById('aeSesstionModalForm');
            if (!$("#aeSesstionModalForm").valid()) {
                countErrors++;

            }
            aeSesstionModalForm.classList.add('was-validated');

            if (countErrors > 0) {
                return;
            }



            var facility = settings.facilityTable.rows({ selected: true }).data();

            $.each(facility, function (key, value) {
                facilityList.push(value.sUID);

            });


            var sesstionInfo = {
                sessionNo: area.find("#sessionNo").val(),
                sessionAgendaNo: area.find("#sessionAgendaNo").val(),
                sessionSubject: area.find("#titleSesstion").val(),
                date: moment(area.find("#dateSesstion").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                startTimeHour: area.find("#startTime").val(),
                endTimeHour: area.find("#endTime").val(),
                roomID: area.find('#roomSesstion').find(":selected").val(),

                description: area.find("#desSesstion").val(),
                sessionTypeID: viewModel.sesstionTypeId,

                outerAttendees: area.find("#otherInviteSesstion").val(),

                SessionInvitedUserIDs: [...inviteUsers],
                SessionInformedUserIDs: [...informantsUsers],
                SessionFacilityRequestSUIDs: [...facilityList]

            }

            loadingPlugin(area.find("#btnRegisterSesstion"), true);


            $.ajax({
                type: "post",
                url: settings.postSession,
                data: JSON.stringify(sesstionInfo),
                contentType: "application/json; charset=utf-8",
                success: async function (result) {


                    loadingPlugin(area.find("#btnRegisterSesstion"), false);
                    area.find('#aeSesstionModal').modal('hide');

                    ivsAlert2('success', ' پیام موفقیت', 'جلسه ثبت شد');


                    $("#agendaCard").agendaPlugin({
                        sesstionId: result,
                        startSesstion: sesstionInfo.date
                    });
                    area.find('#aeAgendaModal').modal('show');
                },
                error: function (ex, cc, bb) {
                    loadingPlugin(area.find("#btnRegisterSesstion"), false);
                    if (ex.responseText.match(/(^|\W)109($|\W)/)) {
                        ivsAlert2('error', 'خطای زمان بندی ', 'امکان ثبت جلسه وجود ندارد زیرا از زمان انتخاب شده عبور کرده ایم', position = "top right", delay = 5);
                        return;
                    }
                    else if (ex.responseText.match(/(^|\W)110($|\W)/)) {
                        ivsAlert2('error', 'خطای زمان بندی ', 'امکان ثبت جلسه وجود ندارد زیرا زمان شروع و پایان جلسه درست نیست', position = "top right", delay = 5);
                        return;
                    }
                    else if (ex.responseText.match(/(^|\W)111($|\W)/)) {
                        ivsAlert2('error', 'خطای ثبت جلسه ', 'نوع جلسه به درستی انتخاب نشده است.', position = "top right", delay = 5);
                        return;
                    }
                    else if (ex.responseText.match(/(^|\W)112($|\W)/)) {
                        ivsAlert2('error', 'خطای ثبت جلسه ', 'ثبت جلسه بدون دعوت شونده امکان پذیر نیست', position = "top right", delay = 5);
                        return;
                    }
                    else if (ex.responseText.match(/(^|\W)113($|\W)/)) {
                        ivsAlert2('error', 'خطای ثبت جلسه ', 'ثبت جلسه بدون انتخاب تسهیلات ممکن نیست', position = "top right", delay = 5);
                        return;
                    }
                    else if (ex.responseText.match(/(^|\W)114($|\W)/)) {
                        ivsAlert2('error', 'خطای ثبت جلسه ', 'عنوان جلسه نمیتواند خالی باشد', position = "top right", delay = 5);
                        return;
                    }
                    else if (ex.responseText.match(/(^|\W)115($|\W)/)) {
                        ivsAlert2('error', 'خطای ثبت جلسه ', 'اتاق جلسات باید انتخاب شود', position = "top right", delay = 5);
                        return;
                    }
                    else {
                        ivsAlert2("error", "خطا سیستم", "خطای ارتباط با سرور");
                    }
                    //ivsAlert2('error', 'خطا در ثبت', 'جلسه مورد نظر ثبت نشد');
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {
                    try {

                        if (document.getElementById('programCarable') != undefined) {
                            refreshCartable();
                        }
                        if (document.getElementById('calendar2') != undefined) {
                            refreshSesstionManagment();
                        }
                        //  ivsAlert2('success', '  رفرش ', ' رفرش شد');

                    } catch (e) {
                        ivsAlert2('error', 'خطا در رفرش ', ' رفرش نشد');

                    }
                }
            });


        }


        function getTemplate() {

            var ss = `
                <style>
                    .datepicker-plot-area {
                        z-index: 1111111111
                    }

                    #facilityRequestForSesstion table, #facilityRequestForSesstion th, #facilityRequestForSesstion td {
                        border: 1px solid #DDDDDD;
                    }
                </style>
                <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="aeSesstionModal" style="z-index:5555"  aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title text-primary"><span id="title-sesstion"></span></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" id="" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" style="text-align:justify">
                                <div class="col-lg-12 heightModal-body">
                                    <div class="p-4 ">
                                        <form id="aeSesstionModalForm" class="row g-3 needs-validation">
                                            <div class="col-md-12">
                                                <label for="titleSesstion" class="form-label">عنوان جلسه</label>
                                                <input type="text" class="form-control" id="titleSesstion" name="titleSesstion">
                                                <div id="titleSesstion-error" class="text-danger"></div>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="sessionNo" class="form-label">شماره جلسه</label>
                                                <input type="text" class="form-control" id="sessionNo" name="sessionNo">
                                            </div>
                                            <div class="col-md-4">
                                                <label for="sessionAgendaNo" class="form-label">شماره دستور کار جلسه</label>
                                                <input type="text" class="form-control" id="sessionAgendaNo" name="sessionAgendaNo">
                                            </div>
                                            <div class="col-4 ">
                                                <div id="roomSesstionCard" class="roomSesstion"></div>
                                                <div id="roomSesstion-error" class="text-danger"></div>

                                            </div>

                                            <div class="col-md-4">
                                                <label for="dateSesstion" class="form-label">تاریخ جلسه</label>
                                                <input type="text" class="form-control" id="dateSesstion" name="dateSesstion" required data-val="true" data-val-required="لطفا تاریخ جلسه را وارد نمایید">
                                                <div class="invalid-feedback" data-valmsg-for="dateSesstion" data-valmsg-replace="true" for="dateSesstion"></div>
                                            </div>

                                            <div class="col-md-4">
                                                <label for="startTime" class="form-label">ساعت شروع</label>

                                                <input type="text" class="form-control timeSesstion timepicker" id="startTime" name="startTime"
                                                       data-val-required="لطفا ساعت شروع جلسه را وارد نمایید">
                                                <div class="text-danger" id="startTimeErrorMassage" ></div>

                                            </div>
                                            <div class="col-md-4">
                                                <label for="endTime" class="form-label">ساعت پایان </label>
                                                <input type="text" class="form-control timeSesstion timepicker" id="endTime" name="endTime"
                                                       
                                                       data-val-required="لطفا ساعت پایان جلسه را وارد نمایید">
                                                <div id="endTimeErrorMassage" class="text-danger"  ></div>
                                            </div>

                                            <div class="col-12">
                                                <label for="desSesstion" class="form-label">شرح جلسه</label>
                                                <textarea class="form-control" id="desSesstion" name="desSesstion"
                                                          rows="1"></textarea>
                                            </div>

                                            <div class="table-responsive col-12  ">
                                                <table id="facilityRequestForSesstion" class="table-striped table-responsive stripe cell-border table table-sm table-bordered" style=" width:100% !important">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>کد</th>
                                                            <th>مدت زمان برآوردی خريد / ساخت (ماه)</th>
                                                            <th>هزينه برآوردی خريد/ساخت (ريال)</th>
                                                            <th>وضعیت فرآیند</th>
                                                            <th>تاریخ پایان چرخه</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody></tbody>
                                                </table>
                                                <p id="errorMassageNoSelectFacility" class="text-danger"></p>
                                            </div>

                                            <div class="col-12">
                                                <div id="inviteUserSesstionCard" class="inviteUser"></div>
                                                <div id="errorMassageInviteUser" class="text-danger"></div>
                                            </div>

                                            <div class="col-6">
                                                <div id="informantsSesstionCard"></div>
                                            </div>

                                            <div class="col-md-6">
                                                <label for="otherInviteSesstion" class="form-label">سایر مدعوین </label>
                                                <textarea class="form-control" id="otherInviteSesstion" name="otherInviteSesstion" rows="1"></textarea>
                                            </div>


                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">لغو</button>
                                <span>
                                    <button class="btn btn-success" id="btnRegisterSesstion">ثبت</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="aeAgendaModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title text-primary">دستور جلسه </h5>
                                <button type="button" class="btn-close" id="closeaeAgendaModal"></button>
                            </div>
                            <div class="modal-body" style="text-align:justify">
                                <div id="agendaCard"></div>
                            </div>
                        </div>
                    </div>
                </div>

            `;
            ss = minifyHtml(ss);

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
