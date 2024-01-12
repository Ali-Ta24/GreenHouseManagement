(function ($) {
    $.fn.ProceedingsPlugin = function (options) {
        var settings = $.extend({
            sesstionId: null,
            //startSesstion: '2000-01-01',
            startSesstion: '2022-12-06',
            listFacility: [],

            proceedingsTable: '',
            facilityProceedingTable: '',

            hasPermisstionAddProceedings: true,
            hasPermisstionEditProceedings: false,
            hasPermisstionRemoveProceedings: false,


            getAllUsers: '/api/User/GetAllActiveUser',
            getFacilitySesstion: '',
            postProceeding: '/api/Proceeding/post',
            putProceeding: '/api/Proceeding/put',
            deleteProceeding: '/api/Proceeding/Delete',
            getProceedings: '/api/Proceeding/GetProceedingView',
            getDetailOfProceeding: '/api/Proceeding/GetDetailOfProceeding',
            getAllActiveUser: '/api/User/GetAllActiveUser',
            getFacilityBySessionId: '/api/Proceeding/GetFacilityBySessionId',

            addTemplate: true,
        }, options);

        var viewModel = undefined;
        var area = this;



        buildInterface();

        function buildInterface() {

            if (settings.sesstionId == null) {
                area.find("#infoProceedingModal-body").html(cardAlert('ای دی جلسه یافت نشد', 'خطا', 'error'));
                return;
            }



            if (settings.addTemplate) {
                area.html(getTemplate());
            }

            getProceeding();

            area.find('#delProceedingBtn').click(function () {
                confirmDeleteItem();
            });

            area.find('#infoProceedingBtn').click(function () {
                detailsOfProceeding();
            });

            area.find('#addProceedingBtn').click(function () {
                resetProceedingForm()
                addProceedingModal();
            });

            area.find('#btn-close-infoProceedingModal').click(function () {

                area.find("#infoProceedingModal").modal("hide");
            });

            area.find('#btn-close-addProceedingModal').click(function () {

                area.find("#addProceedingModal").modal("hide");
            });

            area.find('.btn-closeModal').click(function () {
                resetProceedingForm();
                area.find("#addProceedingModal").modal("hide");
            });

            area.find('#btn-addProceeding').click(function () {
                addProceeding()
            });
        }

        function resetProceedingForm() {

            resetForm('formAddProceeding');
        }

        async function addProceedingModal() {

            $('.multiple-select').select2({
                theme: 'bootstrap4',
                width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
                placeholder: $(this).data('placeholder'),
                allowClear: Boolean($(this).data('allow-clear')),
                dropdownParent: $('#addProceedingModal')
            });
            $('#proceedingDuedate').persianDatepicker({
                'format': 'YYYY/MM/DD',
                'autoclose': true,
                showOtherMonths: true,
                selectOtherMonths: true,
            });
            await loadInformantsUser();
            await loadFacilitySesstion();
            area.find("#addProceedingModal").modal("show");

        }

        function addProceeding() {
            if (area.find('#proceedingDuedate').val() == "" || area.find('#proceedingTitle').val() == "") {
                ivsAlert2('error', 'خطا', 'لطفا عنوان و تاریخ سررسید را وارد نمائید');
                return;
            }

            var getEnDue = shamsiTomiladi(area.find('#proceedingDuedate').val());
            var getDueNormalFormat = shamsiTomiladi4(getEnDue);

            var facilityProceedingId = null;
            var facilityProceeding = settings.facilityProceedingTable.rows({ selected: true }).data();

            $.each(facilityProceeding, function (key, value) {
                facilityProceedingId = value.id;

            });

            var userProceedings = null;

            if ($('#userProceedings').val() != "") {
                userProceedings = $('#userProceedings').val()
            }



            proceedingDto = {
                id: 0,
                sessionID: settings.sesstionId,
                title: area.find('#proceedingTitle').val(),
                description: area.find('#proceedingDes').val(),
                dueDate: getDueNormalFormat,
                facilityID: facilityProceedingId,
                userID: userProceedings
            }

            loadingPlugin(area.find('#btn-addProceeding'), true);

            $.ajax({
                type: "post",
                url: settings.postProceeding,
                data: JSON.stringify(proceedingDto),
                contentType: "application/json; charset=utf-8",
                success: async function (result) {

                    loadingPlugin(area.find('#btn-addProceeding'), false);

                    resetForm('formAddProceeding');
                    ivsAlert2('success', ' پیام موفقیت', 'صورت جلسه ثبت شد');

                    settings.proceedingsTable.ajax.reload();
                    area.find('#addProceedingModal').modal('hide');

                },
                error: function (ex, cc, bb) {
                    loadingPlugin(area.find('#btn-addProceeding'), false);
                    area.find('#addProceedingModal').modal('hide');

                    if (ex.responseText.includes("1016")) {
                        ivsAlert2('error', 'خطا ثبت صورتجلسه', 'هنوز جلسه برگزار نشده است و امکان ثبت صورتجلسه وجود ندارد');
                    }
                    else {
                        ivsAlert2("error", "خطا سیستم", "خطای ارتباط با سرور");
                    }

                    //console.log(ex);
                    //console.log(bb);
                }
            });


        }

        function loadFacilitySesstion() {

            settings.facilityProceedingTable = $('#facilityProceedingTable').DataTable({
                ajax:
                {
                    contentType: 'application/json',
                    url: settings.getFacilityBySessionId + "?sessionId=" + settings.sesstionId,
                    dataSrc: '',
                },
                paging: false,
                ordering: false,
                info: false,
                //processing: true,
                colReorder: false,
                searchPanes: false,
                scrollX: false,
                destroy: true,
                select: true,
                bFilter: false,
                columns: [
                    { data: "programTitle", name: "programTitle", type: "html", },
                    { data: "requiredTime", render: function (data, type, row) { return PersianTools.addCommas(data) } },
                    { data: "requiredBudget", render: function (data, type, row) { return PersianTools.addCommas(data) } }
                ]

            });
            settings.facilityProceedingTable.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = settings.facilityProceedingTable.rows({ selected: true }).data()[0];

            }).on('deselect', function (event, dt, type, indexes) {

            });
        }

        function loadInformantsUser() {
            $.ajax({
                type: "get",
                url: settings.getAllActiveUser,
                success: function (result) {
                    if (result.length > 0) {
                        $("#userProceedings").html("");
                        ss = "";
                        for (var i = 0; i < result.length; i++) {
                            var str = `
                                <option value="${result[i].nationalCodeId}">${result[i].firstName} ${result[i].lastName}   </option>
                            `;
                            ss += str;
                        }
                        $("#userProceedings").html(ss);
                    }
                },
                error: function (ex, cc, bb) {
                    ivsAlert('اشکال در برقراری ارتباط با سرور - بخش کاربران صورتجلسه  ', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {

                }
            });
        }

        function getProceeding() {
            settings.proceedingsTable =
                area.find('#proceedingsTable').DataTable({
                    ajax:
                    {
                        contentType: 'application/json',
                        url: settings.getProceedings + "?sessionID=" + settings.sesstionId,
                    },
                    paging: false,
                    ordering: false,
                    info: false,
                    //processing: true,
                    colReorder: false,
                    searchPanes: false,
                    scrollX: false,
                    destroy: true,
                    select: true,
                    bFilter: false,
                    columns: [

                        { data: "proceedingTitle", name: "proceedingTitle", type: "html" },
                        { data: "dueDate", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
                    ],

                });

            var sesstionDate = shamsiTomiladi4(settings.startSesstion);
            var dateNow = shamsiTomiladi4(Date.now());
            var resultCompareDates = compareDates(sesstionDate, dateNow);


            settings.proceedingsTable.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = settings.proceedingsTable.rows({ selected: true }).data()[0];

                if (valueRowSelect != undefined && resultCompareDates >= 0) {
                    area.find("#delProceedingBtn").prop('hidden', false);
                    area.find("#infoProceedingBtn").prop('hidden', false);
                    event.stopPropagation();
                }
            }).on('deselect', function (event, dt, type, indexes) {

                area.find("#delProceedingBtn").prop('hidden', true);
                area.find("#infoProceedingBtn").prop('hidden', true);

            });


            if (resultCompareDates >= 0) {
                area.find("#addProceedingBtn").prop('hidden', false);
            }
            else {
                area.find("#addProceedingBtn").prop('hidden', true);
            }
        }

        function confirmDeleteItem() {
            let currentRow = settings.proceedingsTable.rows({ selected: true }).data()[0];
            bootbox.confirm({
                message: "آیا از حذف مورد انتخاب شده مطمئن هستید؟",
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
                callback: async function (result) {
                    if (result == true) {
                        await deleteItem(currentRow.id)
                    }
                }
            });
        }

        function deleteItem(proceedingId) {

            $.ajax({
                type: "delete",
                url: settings.deleteProceeding + "?id=" + proceedingId,
                contentType: 'application/json',
                success: function (result) {
                    ivsAlert2('success', "موفقیت", "آیتم مورد نظر با موفقیت حذف شد");
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', "خطا", "خطا در حذف آتیم انتخاب شده ");
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {
                    settings.proceedingsTable.rows().deselect();
                    settings.proceedingsTable.ajax.reload();
                }
            });

        }

        function detailsOfProceeding() {

            let currentRow = settings.proceedingsTable.rows({ selected: true }).data()[0];


            $.ajax({
                url: settings.getDetailOfProceeding + "?proceedingID=" + currentRow.id,
                success: function (v) {

                    var d = `
                    <div class="row ">
                         <div class="col-lg-6 col-md-6">
                             <ul class="list-group list-group-flush">
                                 <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                     <h6 class="mb-0">
                                         عنوان صورتجلسه
                                     </h6>
                                     <span class="text-secondary">${v.procesdingTitle}</span>
                                 </li>
                             </ul>
                         </div>
                         <div class="col-lg-6 col-md-6">
                             <ul class="list-group list-group-flush">
                                 <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                     <h6 class="mb-0">
                                        تاریخ سررسید                       
                                     </h6>
                                     <span class="text-secondary">`+ getPerianDate(v.procesdingDueDate) + `</span>
                                 </li>
                             </ul>
                         </div>
                        <hr/>
                         <div class="col-lg-12 col-md-12">
                             <ul class="list-group list-group-flush">
                                 <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                     <span class="mb-0">
                                         توضیحات: ${setNameForNullValues(v.procesdingDescription)}
                                     </span>
                                 </li>
                             </ul>
                         </div>

                    </div>
                    <hr/>
                    ${v.facilityID == null ? `` : `
                    <div class="col-12 table-responsive p-3">
                        <h5>جزییات تسهیلات</h5>
                        <br/>
                        <table class=" table table-sm table-bordered table-striped  table-responsive " style=" width:100% !important">
                            <thead>
                                <tr>
                                    <th>کد تسهیلات</th>
                                    <th>عنوان طرح</th>
                                    <th>نوع طرح</th>
                                    <th>مدت زمان برآوردی خريد / ساخت (ماه)	</th>
                                    <th>هزينه برآوردی خريد/ساخت (ريال)	</th>
                                    <th>وضعیت فرآیند</th>
                                    <th>تاریخ پایان چرخه</th>
                                </tr>
                            </thead>
                            <tbody id="dataFacilityTable">
                                <tr>
                                     <td>${v.facilityCode}</td>
                                     <td>${v.programTitle}</td>
                                     <td>${v.programTypeTitle}</td>
                                     <td>${v.requiredTime}</td>
                                     <td>${PersianTools.addCommas(v.requiredBudget)}</td>
                                     <td>${setNameForNullValues(v.workflowCurrentStepTitle)}</td>
                                     <td>${getPerianDateTime(v.finalizationTime)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`}
                    <hr/>
                    ${v.proceedingAssignments.length > 0 ? `
                    <div class="col-12  table-responsive p-3">
                        <h5>لیست کاربران مرتبط با صورتجلسه</h5>
                        <br/>
                        <table class=" table table-sm table-bordered table-striped  table-responsive " style=" width:100% !important">
                            <thead>
                                <tr>
                                    <th>نام و نام خانوادگی</th>
                                    <th>کد ملی</th>
                                </tr>
                            </thead>
                            <tbody id="UsersProceeding">
                                `+ getUserProceeding(v.proceedingAssignments) + `
                            </tbody>
                        </table>
                    </div>
                    <hr/>
                    `: ""}

                    `;

                    //console.log({ v });

                    area.find("#infoProceedingModal-body").html(d);

                    area.find("#infoProceedingModal").modal("show");
                },
                error: function (ex, cc, bb) {
                    if (1) {
                        area.find("#infoProceedingModal-body").html(cardAlert('خطا در نمایش جزییات صورتجلسه', 'خطا', 'error'))
                    }

                }
            });



        }

        function getUserProceeding(data) {
            var userProceedingTr = "";

            for (let u in data) {

                userProceedingTr += `
            <tr>
                <td>${data[u].firstName}  ${data[u].lastName}</td>
                <td>${data[u].userID}</td>
            </tr>
        `;
            }
            return userProceedingTr;
        }

        function getTemplate(v) {

            var ss = `
                <div class="col-lg-12 heightModal-body">
                    <nav class="navbar p-0 navbar-expand-lg navbar-dark bg-primary rounded">
                        <div class=" row row-cols-auto g-3">

                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarSupportedAgenda" aria-controls="navbarSupportedAgenda"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedAgenda">
                                <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title=" افزودن صورتجلسه" role="button"  class="pointer menu-items ms-1" id="addProceedingBtn">
                                    <i class="font-35 bx bx-message-square-add text-white"></i>
                                </span>
                                <span hidden data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title=" حذف صورتجلسه" role="button" class="pointer menu-items ms-1" id="delProceedingBtn">
                                    <i class="font-35 bx bx-message-square-minus text-white"></i>
                                </span>
                                <span hidden data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title=" جزییات صورتجلسه" role="button" class="pointer menu-items ms-1" id="infoProceedingBtn">
                                    <i class="font-35 bx bx-message-square-error text-white"></i>
                                </span>

                            </div>
                        </div>
                    </nav>
                    <script>
		                $(function () {
			                $('[data-bs-toggle="popover"]').popover();
			                $('[data-bs-toggle="tooltip"]').tooltip();
		                })
	                </script>
                    <div class="col-12 table-responsive">
                            <style>
                                table, th,td {
                                    border: 1px solid #DDDDDD;
                                }
                            </style>
                            <table id="proceedingsTable" class=" table table-sm table-bordered table-striped table-responsive stripe cell-border" style=" width:100% !important; border: 1px solid #DDDDDD">
                                <thead>
                                    <tr>
                                        <th>عنوان</th>
                                        <th>تاریخ سررسید</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                    </div>
                </div>
				<div class="modal fade" id="infoProceedingModal" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
					<div class="modal-dialog modal-xl">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title">جزییات صورتجلسه</h5>
								<button type="button" class="btn-close" id="btn-close-infoProceedingModal" ></button>
							</div>
							<div id="infoProceedingModal-body">
                                
                            </div>
						</div>
					</div>
				</div>
				<div class="modal fade" id="addProceedingModal" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title">افزودن صورتجلسه</h5>
								<button type="button" class="btn-close" id="btn-close-addProceedingModal"></button>
							</div>
							<div id="addProceedingModal-body ">
                                <div class="p-3 heightModal-body">
                                   <form id="formAddProceeding" class="row g-3 needs-validation">

                                       <div class="">
                                           <label for="proceedingTitle" class="form-label"> عنوان صورتجلسه (اجباری) </label>
                                           <input type="text" class="form-control"  tabindex="1" id="proceedingTitle"  autofocus
                                                  name="proceedingTitle"
                                                  data-val="true"
                                                  data-val-required="لطفا عنوان را وارد نمایید "
                                                  required />

                                           <div class="invalid-feedback" data-valmsg-for="proceedingTitle" data-valmsg-replace="true" for="proceedingTitle"></div>
                                       </div>
                                       <div class="">
                                           <label for="proceedingDuedate" class="form-label"> تاریخ رسید(اجباری) </label>
                                           <input type="text" class="form-control"  tabindex="2" id="proceedingDuedate"  />
                                       </div>
                                       <div class="">
                                           <label for="proceedingDes" class="form-label"> توضیحات دستورجلسه </label>
                                           <textarea type="text" class="form-control"  tabindex="3" id="proceedingDes"  rows="2"
                                                  name="proceedingDes"></textarea>
                                       </div>
                                       <div class="">
                                           <label for="agendaDes" class="form-label"> تسهیلات دستورجلسه </label>
                                            <div class="col-12   table-responsive" style="max-height:40vh">
                                                 <table id="facilityProceedingTable" class=" table table-sm table-bordered table-striped  stripe cell-border" style=" width:100% !important; border:1px solid #DEE2E6; ">
                                                     <thead>
                                                         <tr>
                                                             <th>عنوان طرح</th>
                                                             <th>مدت زمان برآوردی خريد / ساخت (ماه)</th>
                                                             <th>هزينه برآوردی خريد/ساخت (ريال)	</th>
                                                         </tr>
                                                     </thead>
                                                     <tbody></tbody>
                                                 </table>
                                            </div>
                                       </div>
                                        <div>
                                            <label for="userProceedings" class="form-label">  کاربران صورتجلسه </label>
                                            <select class="multiple-select" data-placeholder="Choose anything" id="userProceedings"
                                                    multiple="multiple">
                                                <option>کاربر تعریف نشده است</option>

                                            </select>
                                        </div>
                                   </form>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-secondary btn-closeModal">لغو</button>

                                <span>
                                    <button class="btn btn-success" id="btn-addProceeding" onclick="">ثبت</button>
                                </span>
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
