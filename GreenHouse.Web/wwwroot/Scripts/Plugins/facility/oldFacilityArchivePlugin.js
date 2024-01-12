(function ($) {

    $.fn.oldFacilityArchivePlugin = function (options) {
        var settings = $.extend({

            postOldFaciltyApiAddress: "/api/OldFacilityRequest/post",
            putOldFaciltyApiAddress: "/api/OldFacilityRequest/put",
            deleteOldFaciltyApiAddress: "/api/OldFacilityRequest/Delete",
            AllItemsApiAddress: "/api/OldFacilityRequest/Items",
            GetOldFacilityByIDApiAddress: "/api/OldFacilityRequest/GetOldFacilityByID",
            GetAllOldFacilityesForExport: "/api/OldFacilityRequest/GetAllOldFacilityesForExport",

            //for Document
            postDocumentToRequest: "/api/OldFacilityRequest/PostDocumentToOldFacilityRequest",
            deleteDocumentFromFacilityRequest: "/api/OldFacilityRequest/RemoveDocumentFromOldFacilityRequest",
            getFacilityRequestDocumentsByGroup: "/api/OldFacilityRequest/GetOldFacilityRequestDocumentsByID",

            hasTemplate: true
        }, options);

        var viewModel = undefined;
        var area = this;

        var OldFacilityTableCartable;
        var cols = [

            { data: "introductionYear", name: "IntroductionYear", type: "number" },
            { data: "customerName", name: "CustomerName", type: "html" },
            { data: "programType", name: "ProgramType", type: "html" },
            { data: "programTitle", name: "ProgramTitle", type: "html" },
            { data: "organizationPrice", name: "OrganizationPrice", type: "number", render: function (data) { return data != null ? data.toLocaleString('ar-EG') : null } },
            { data: "activityLocation", name: "ActivityLocation", type: "html" },
            {
                data: "oldFacilityRequestTotalState", name: "OldFacilityRequestTotalState", type: "html", render: function (data) {
                    var obj = FacilityRequestTotalState.find(ss => ss.id == data);
                    return obj.title;
                }
            },
        ];

        var FacilityRequestTotalState = [
            { id: 0, title: "بهره برداري" },
            { id: 1, title: "درحال ساخت" },
            { id: 2, title: "درحال کارشناسی بانک" },
            { id: 3, title: "ابطال" }];

        var addtemplate = `<div class="row" id="addmodal">
                                <form id="formoldFacility" class="row g-3 needs-validation">

                                    <div class="col-4">
                                        <label class="form-label">شماره مصوبه کمیته</label>
                                        <input type="text" class="form-control" id="CommitteeaApprovalNumber"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">سال معرفی</label>
                                        <input type="number" class="form-control" id="IntroductionYear"
                                            placeholder="سال را به صورت یک عدد چهار رقمی وارد کنید"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">شماره بایگانی</label>
                                        <input type="text" class="form-control" id="ArchiveNumber"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">شناسه ملی حقیقی/حقوقی</label>
                                        <input type="text" class="form-control" id="NationalCode"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">كدتفصيلي</label>
                                        <input type="text" class="form-control" id="DetailedCode"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">نام متقاضي</label>
                                        <input type="text" class="form-control" id="CustomerName"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">نوع طرح</label>
                                        <input type="text" class="form-control" id="ProgramType"/>
                                    </div>

                                    <div class="col-4">
                                        <div id="ToProgramTypeKindID">
                                        </div>
                                    </div>

                                    <script>
                                                $("#ToProgramTypeKindID").drapdownPlugin({
                                                    apiAddress: '/api/Program/GetAllProgramTypeKinds',
                                                    valueOption: 'id',
                                                    textOption: 'title',
                                                    idTagName: 'ProgramTypeKindID',
                                                    dropdownParent: 'formoldFacility',
                                                    title: 'دسته بندی طرح',
                                                });
                                    </script>

                                    <div class="col-4">
                                        <label class="form-label">موضوع طرح</label>
                                        <input type="text" class="form-control" id="ProgramTitle"/>
                                   </div>

                                    <div class="col-4">
                                        <label class="form-label">ظرفيت</label>
                                        <input type="number" class="form-control" id="RequestCapacity"/>
                                    </div>
            
                                    <div class="col-4">
                                        <div id="ToRequestCountTypeID">
                                        </div>
                                    </div>

                                    <script>
                                                $("#ToRequestCountTypeID").drapdownPlugin({
                                                    apiAddress: '/api/Program/GetAllRequestCountTypes',
                                                    valueOption: 'id',
                                                    textOption: 'title',
                                                    idTagName: 'RequestCountTypeID',
                                                    dropdownParent: 'formoldFacility',
                                                    title: 'واحد ظرفیت',
                                                });
                                    </script>

                                    <div class="col-4">
                                        <label class="form-label">تعداد</label>
                                        <input type="number" class="form-control" id="RequestCount"/>
                                    </div>
                    
                                    <div class="col-4">
                                        <label class="form-label">مبلغ ارزش طرح</label>
                                        <input type="number" class="form-control" id="ProgramPrice"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">مبلغ تسهيلات مصوب سازمان</label>
                                        <input type="number" class="form-control" id="OrganizationPrice"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">مبلغ  تسهیلات پرداختي</label>
                                        <input type="number" class="form-control" id="AmountFacilityPaid"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">مانده تعهدات يارانه</label>
                                        <input type="number" class="form-control" id="BalanceSubsidyObligations"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">يارانه دوران مشاركت</label>
                                        <input type="number" class="form-control" id="SubsidyDuringParticipation"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">يارانه اجاره </label>
                                        <input type="number" class="form-control" id="RentSubsidy"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">يارانه پرداختي</label>
                                        <input type="number" class="form-control" id="PaidSubsidy"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">بانک عامل</label>
                                        <input type="text" class="form-control" id="BankName"/>
                                    </div>
                                    
                                    <div class="col-4">
                                        <label class="mb-2">وضعيت پروژه</label>
                                        <select class="form-select mb-3">
                                            <option value="0">بهره برداري</option>
                                            <option value="1">درحال ساخت</option>
                                            <option value="2">درحال کارشناسی بانک</option>
                                            <option value="3">ابطال</option>
                                        </select>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">توضيحات طرح</label>
                                        <input type="text" class="form-control" id="FacilityDescription"/>
                                    </div>

                                    <div class="col-4">
                                       <label class="form-label">تاریخ معرفی</label>
                                       <input type="text" class="form-control" id="Announced">
                                    </div>

                                    <script>
                                        $('#Announced').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: true,
                                            initialValueType: 'gregorian',
                                            observer: true,
            
                                        });
                                    </script>

                                    <div class="col-4">
                                       <label class="form-label">تاریخ صدور مصوبه بانکی</label>
                                       <input class="form-control" id="IssuanceBankApproval">
                                      </div>    

                                     <script>
                                        $('#IssuanceBankApproval').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: true,
                                            initialValueType: 'gregorian',
                                            observer: true,
                                        });
                                    </script>

                                    <div class="col-4">
                                       <label class="form-label">مهلت معرفی نامه</label>
                                       <input type="text" class="form-control" id="IntroductionDeadline">
                                    </div>

                                    <script>
                                        $('#IntroductionDeadline').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: true,
                                            initialValueType: 'gregorian',
                                            observer: true,
                                        });
                                    </script>

                                    <div class="col-4">
                                        <label class="form-label">درصد یارانه</label>
                                        <input type="number" class="form-control" id="SubsidyPercentage" min=0 max=100/>
                                    </div>


                                    <div class="col-4">
                                        <label class="form-label">تعداد اقساط </label>
                                        <input type="text" class="form-control" id="NumberInstallments" />
                                    </div>


                                    <div class="col-4">
                                       <label class="form-label">تاريخ ثبت قرارداد </label>
                                       <input type="text" class="form-control" id="ContractRegistrationDate">
                                    </div>

                                    <script>
                                        $('#ContractRegistrationDate').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: true,
                                            initialValueType: 'gregorian',
                                            observer: true,
                                        });
                                    </script>

                                   <div class="col-4">
                                        <label class="form-label">سازنده</label>
                                        <input type="text" class="form-control" id="CreatorLocation" />
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">محل اجراي پرو‍ژه</label>
                                        <input type="text" class="form-control" id="ActivityLocation" />
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label">آدرس و شماره تماس</label>
                                        <textarea  type="text" class="form-control" id="PathAndPhone"></textarea>
                                    </div>
                                    
                                </form>
                            </div>


                            <div class="modal-footer">
                                <div class="btn btn-success" id="submitBtn">ثبت و افزودن اسناد</div>
                                <div class="btn btn-info" id="submitBtn2">ثبت بدون افزودن اسناد</div>
                                <div class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">لغو</div>
                            </div>`;

        buildInterface();

        function buildInterface() {
            if (settings.hasTemplate) {
                area.html(getTemplate());
                getAllItems();
            }
        }
        $('.inputSearch').change(function () {

            OldFacilityTableCartable.columns().search('');
            $('input.inputSearch').filter(function (a) {
                return $('input.inputSearch')[a].value.length > 0
            }).each(function (a, b) {
                columnindex = parseInt($("[name='" + b.dataset.name + "']")[0].dataset.columnIndex);
                OldFacilityTableCartable.columns(columnindex).search(b.value);

            });
            OldFacilityTableCartable.draw();

        });

        OldFacilityTableCartable.on('select', function (event, dt, type, indexes) {
            let valueRowSelect = OldFacilityTableCartable.rows({ selected: true }).data()[0];
            $("[data-role-operation='edit']").removeClass("d-none");
            $('[data-role-remove]').removeClass("d-none");

        }).on('deselect', function (event, dt, type, indexes) {
            $("[data-role-operation='edit']").addClass("d-none");
            $('[data-role-remove]').addClass("d-none");
        });

        area.find("[data-role-operation ='add']").click(function () {
            bootbox.dialog({
                message: addtemplate,
                title: "افزودن تسهیلات قدیمی",
            }).bind('shown.bs.modal', function () {
                $('.modal-dialog').css('max-width', '90%');
                $('.bootbox-close-button').css("display", "inline");
                $('.bootbox-close-button').addClass("btn-close");
                $('.bootbox-close-button').text("");
            });
            $("#submitBtn").click(function (e) {
                postOldFacility(e);
            });
            $("#submitBtn2").click(function (e) {
                postOldFacility(e);
            });
        });

        area.find("[data-role-operation ='edit']").click(function () {
            let idRowSelect = OldFacilityTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "get",
                url: settings.GetOldFacilityByIDApiAddress + "?oldFacilityID=" + idRowSelect,
                contentType: 'application/json',
                success: function (result) {

                    var template = putTemplateOldFacility(result);
                    bootbox.dialog({
                        message: template,
                        title: "ویرایش تسهیلات قدیمی",
                    }).bind('shown.bs.modal', function () {
                        $('.modal-dialog').css('max-width', '90%');
                        $('.bootbox-close-button').css("display", "inline");
                        $('.bootbox-close-button').addClass("btn-close");
                        $('.bootbox-close-button').text("");
                    });
                    $("#editsubmitBtn").click(function (e) {
                        putOldFacility(e);
                    });
                    $("#editsubmitBtn2").click(function (e) {
                        putOldFacility(e);
                    });
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش تسهیلات قدیمی');
                }
            });
        });

        area.find("[data-role-remove]").click(function () {
            let idRowSelect = OldFacilityTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "delete",
                url: settings.deleteOldFaciltyApiAddress + "?id=" + idRowSelect,
                contentType: 'application/json',
                success: function () {
                    ivsAlert2('success', ' پیام موفقیت', 'تسهیلات با موفقیت حذف شد.');
                    OldFacilityTableCartable.rows().ajax.reload();
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش تسهیلات قدیمی');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    OldFacilityTableCartable.rows('.important').deselect();
                }
            });
        });

        area.find("#export-excel").click(function () {
            var ProgramTypeKind = [];
            var RequestCountType = [];
            $.ajax({
                type: 'Get',
                url: '/api/Program/GetAllProgramTypeKinds',
                success: function (res) {
                    ProgramTypeKind.push(...res);
                }
            });
            $.ajax({
                type: 'Get',
                url: '/api/Program/GetAllRequestCountTypes',
                success: function (res) {
                    RequestCountType.push(...res);
                }
            });


            var ss = $('#table-export-excel').DataTable({
                ajax:
                {
                    contentType: 'application/json',
                    url: settings.GetAllOldFacilityesForExport,
                    type: 'get',
                    dataType: "json",
                    error: function () {
                        ivsAlert2('error', 'خطا', 'اشکل در خروجی گرفتن اکسل');
                    },
                    complete: function () {
                        $(".buttons-excel").trigger("click");
                    },
                },
                columns: [
                    { data: "committeeaApprovalNumber", title: 'کد تفصیلی شماره مصوبه کمیته' },
                    { data: "introductionYear", title: 'سال معرفی' },
                    { data: "archiveNumber", title: 'شماره بایگانی' },
                    { data: "nationalCode", title: 'شناسه ملی حقیقی/حقوقی' },
                    { data: "detailedCode", title: 'كدتفصيلي' },
                    { data: "customerName", title: 'نام متقاضي' },
                    { data: "programType", title: 'نوع طرح' },
                    {
                        data: "programTypeKindID", title: 'ساخت/خريد', render: function (data) {
                            var obj = ProgramTypeKind.find(ss => ss.id == data);
                            return obj.title;
                        }
                    },
                    { data: "programTitle", title: 'موضوع طرح' },
                    { data: "requestCapacity", title: 'ظرفيت' },
                    { data: "requestCount", title: 'تعداد' },
                    {
                        data: "requestCountTypeID", title: 'نوع تعداد', render: function (data) {
                            var obj = RequestCountType.find(ss => ss.id == data);
                            return obj.title;
                        }
                    },
                    { data: "programPrice", title: 'مبلغ ارزش طرح', render: function (data) { return data != null ? data.toLocaleString('en-US') : null } },
                    { data: "organizationPrice", title: 'مبلغ تسهيلات مصوب سازمان', render: function (data) { return data != null ? data.toLocaleString('en-US') : null } },
                    { data: "amountFacilityPaid", title: 'مبلغ  تسهیلات پرداختي', render: function (data) { return data != null ? data.toLocaleString('en-US') : null } },
                    { data: "balanceSubsidyObligations", title: 'مانده تعهدات يارانه ', render: function (data) { return data != null ? data.toLocaleString('en-US') : null } },
                    { data: "subsidyDuringParticipation", title: 'يارانه دوران مشاركت', render: function (data) { return data != null ? data.toLocaleString('en-US') : null } },
                    { data: "rentSubsidy", title: 'يارانه اجاره', render: function (data) { return data != null ? data.toLocaleString('en-US') : null } },
                    { data: "paidSubsidy", title: 'يارانه پرداختي ', render: function (data) { return data != null ? data.toLocaleString('en-US') : null } },
                    { data: "bankName", title: 'بانک عامل' },
                    {
                        data: "oldFacilityRequestTotalState", title: 'وضعيت پروژه', render: function (data) {
                            var obj = FacilityRequestTotalState.find(ss => ss.id == data);
                            return obj.title;
                        },
                    },
                    { data: "facilityDescription", title: 'توضيحات طرح' },
                    { data: "announced", title: 'تاریخ معرفی', render: function (data) { return data != null ? moment(data, 'YYYY/MM/DD').format('jYYYY-jMM-jDD') : null } },
                    { data: "issuanceBankApproval", title: 'تاریخ صدور مصوبه بانکی', render: function (data) { return data != null ? moment(data, 'YYYY/MM/DD').format('jYYYY-jMM-jDD') : null } },
                    { data: "introductionDeadline", title: 'مهلت معرفی نامه ', render: function (data) { return data != null ? moment(data, 'YYYY/MM/DD').format('jYYYY-jMM-jDD') : null } },
                    { data: "subsidyPercentage", title: 'درصد یارانه ' },
                    { data: "numberInstallments", title: 'تعداد اقساط ' },
                    { data: "contractRegistrationDate", title: 'تاريخ ثبت قرارداد', render: function (data) { return data != null ? moment(data, 'YYYY/MM/DD').format('jYYYY-jMM-jDD') : null } },
                    { data: "creatorLocation", title: 'سازنده' },
                    { data: "activityLocation", title: 'محل اجراي پرو‍ژه' },
                    { data: "pathAndPhone", title: 'آدرس و شماره تماس' },
                ],
                dom: '<"#excel_btn.d-none" B>',
                buttons: [
                    'excel'
                ],
                destroy: true,
            });

        });

        area.find('#btnExel').click(function () {
            exportTemplate = `<div class ="row" id="exportModal">
                                <p>ستون هایی که میخواهید در خروجی نشان داده شود را انتخاب کنید.</p>
                                <hr>
                                <h4>اطلاعات مربوط به تسهیلات قدیمی</h4>
                                <span class="m-2"></span>
                                <div class="col-2">
                                    <label class="form-check-label" for="introductionYear">سال معرفی</label>
                                    <input class="form-check-input" type="checkbox" title="سال معرفی" id="introductionYear">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="archiveNumber">شماره بایگانی</label>
                                    <input class="form-check-input" type="checkbox" title="شماره بایگانی" id="archiveNumber">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="nationalCode">شناسه ملی حقیقی/حقوقی</label>
                                    <input class="form-check-input" type="checkbox" title="شناسه ملی حقیقی/حقوقی" id="nationalCode">
                                </div>
                                
                                <div class="col-2">
                                    <label class="form-check-label" for="detailedCode">كدتفصيلی</label>
                                    <input class="form-check-input" type="checkbox" title="كدتفصیلی" id="detailedCode">
                                </div>

                                <div class="col-3">
                                    <label class="form-check-label" for="committeeaApprovalNumber">شماره مصوبه کمیته</label>
                                    <input class="form-check-input" type="checkbox" title="شماره مصوبه کمیته" id="committeeaApprovalNumber">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="customerName">نام متقاضی</label>
                                    <input class="form-check-input" type="checkbox" title="نام متقاضی" id="customerName">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="programType">نوع طرح</label>
                                    <input class="form-check-input" type="checkbox" title="نوع طرح" id="programType">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="programTypeKindID">ساخت/خرید</label>
                                    <input class="form-check-input" type="checkbox" title="ساخت/خرید" id="programTypeKindID">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="programTitle">موضوع طرح</label>
                                    <input class="form-check-input" type="checkbox" title="موضوع طرح" id="programTitle">
                                </div>

                                <div class="col-3">
                                    <label class="form-check-label" for="requestCapacity">ظرفیت</label>
                                    <input class="form-check-input" type="checkbox" title="ظرفیت" id="requestCapacity">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="requestCount">تعداد</label>
                                    <input class="form-check-input" type="checkbox" title="تعداد" id="requestCount">
                                </div>

                                 <div class="col-2">
                                    <label class="form-check-label" for="requestCountTypeID">نوع تعداد</label>
                                    <input class="form-check-input" type="checkbox" title="نوع تعداد" id="requestCountTypeID">
                                </div>

                                 <div class="col-2">
                                    <label class="form-check-label" for="programPrice">مبلغ ارزش طرح</label>
                                    <input class="form-check-input" type="checkbox" title="مبلغ ارزش طرح" id="programPrice">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="amountFacilityPaid">مبلغ تسهیلات پرداختی</label>
                                    <input class="form-check-input" type="checkbox" title="مبلغ تسهیلات پرداختی" id="amountFacilityPaid">
                                </div>
                                
                                <div class="col-3">
                                    <label class="form-check-label" for="organizationPrice">مبلغ تسهیلات مصوب سازمان</label>
                                    <input class="form-check-input" type="checkbox" title="مبلغ تسهیلات مصوب سازمان" id="organizationPrice">
                                </div>
                                
                                <div class="col-2">
                                    <label class="form-check-label" for="balanceSubsidyObligations">مانده تعهدات یارانه</label>
                                    <input class="form-check-input" type="checkbox" title="مانده تعهدات یارانه" id="balanceSubsidyObligations">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="subsidyDuringParticipation">یارانه دوران مشارکت</label>
                                    <input class="form-check-input" type="checkbox" title="یارانه دوران مشارکت" id="subsidyDuringParticipation">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="rentSubsidy">یارانه اجاره</label>
                                    <input class="form-check-input" type="checkbox" title="یارانه اجاره" id="rentSubsidy">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="paidSubsidy">یارانه پرداختی</label>
                                    <input class="form-check-input" type="checkbox" title="یارانه پرداختی" id="paidSubsidy">
                                </div>

                                <div class="col-3">
                                    <label class="form-check-label" for="bankName">بانک عامل</label>
                                    <input class="form-check-input" type="checkbox" title="بانک عامل" id="bankName">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="facilityDescription">توضیحات طرح</label>
                                    <input class="form-check-input" type="checkbox" title="توضیحات طرح" id="facilityDescription">
                                </div>
                                
                                <div class="col-2">
                                    <label class="form-check-label" for="oldFacilityRequestTotalState">وضعیت پروژه</label>
                                    <input class="form-check-input" type="checkbox" title="وضعیت پروژه" id="oldFacilityRequestTotalState">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="announced">تاریخ معرفی</label>
                                    <input class="form-check-input" type="checkbox" title="تاریخ معرفی" id="announced">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="issuanceBankApproval">تاریخ صدور مصوبه بانکی</label>
                                    <input class="form-check-input" type="checkbox" title="تاریخ صدور مصوبه بانکی" id="issuanceBankApproval">
                                </div>

                                <div class="col-3">
                                    <label class="form-check-label" for="introductionDeadline">مهلت معرفی نامه</label>
                                    <input class="form-check-input" type="checkbox" title="مهلت معرفی نامه" id="introductionDeadline">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="numberInstallments">تعداد اقساط</label>
                                    <input class="form-check-input" type="checkbox" title="تعداد اقساط" id="numberInstallments">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="contractRegistrationDate">تاریخ ثبت قرارداد</label>
                                    <input class="form-check-input" type="checkbox" title="تاریخ ثبت قرارداد" id="contractRegistrationDate">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="creatorLocation">سازنده</label>
                                    <input class="form-check-input" type="checkbox" title="سازنده" id="creatorLocation">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="activityLocation">محل اجرای پروژه</label>
                                    <input class="form-check-input" type="checkbox" title="محل اجرای پروژه" id="activityLocation">
                                </div>

                                <div class="col-2">
                                    <label class="form-check-label" for="pathAndPhone">آدرس و شماره تماس</label>
                                    <input class="form-check-input" type="checkbox" title="آدرس و شماره تماس" id="pathAndPhone">
                                </div>
                                
                                <div class="col-2">
                                    <label class="form-check-label" for="subsidyPercentage">درصد یارانه</label>
                                    <input class="form-check-input" type="checkbox" title="درصد یارانه" id="subsidyPercentage">
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


            var ProgramTypeKind = [];
            var RequestCountType = [];
            $.ajax({
                type: 'Get',
                url: '/api/Program/GetAllProgramTypeKinds',
                success: function (res) {
                    ProgramTypeKind.push(...res);
                }
            });
            $.ajax({
                type: 'Get',
                url: '/api/Program/GetAllRequestCountTypes',
                success: function (res) {
                    RequestCountType.push(...res);
                }
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
                var renderStatusProject = function (data) { var obj = FacilityRequestTotalState.find(ss => ss.id == data); return obj.title; }
                var renderProgramTypeKind = function (data) { var obj = ProgramTypeKind.find(ss => ss.id == data); return obj.title; }


                for (var i = 0; i < allInputSelected.length; i++) {
                    if (allInputSelected[i].id == "introductionDeadline" || allInputSelected[i].id == "contractRegistrationDate" || allInputSelected[i].id == "announced" || allInputSelected[i].id == "issuanceBankApproval") {
                        col.push({ data: allInputSelected[i].id, name: allInputSelected[i].id, type: 'html', render: renderFuncTime });
                        continue;
                    }
                    if (allInputSelected[i].id == "organizationPrice" || allInputSelected[i].id == "balanceSubsidyObligations" || allInputSelected[i].id == "paidSubsidy" || allInputSelected[i].id == "subsidyDuringParticipation" || allInputSelected[i].id == "programPrice" || allInputSelected[i].id == "rentSubsidy" || allInputSelected[i].id == "amountFacilityPaid") {
                        col.push({ data: allInputSelected[i].id, name: allInputSelected[i].id, type: 'html', render: renderFuncPrice });
                        continue;
                    }
                    if (allInputSelected[i].id == "programTypeKindID") {
                        col.push({ data: allInputSelected[i].id, name: allInputSelected[i].id, type: 'html', render: renderProgramTypeKind });
                        continue;
                    }
                    if (allInputSelected[i].id == "oldFacilityRequestTotalState") {
                        col.push({ data: allInputSelected[i].id, name: allInputSelected[i].id, type: 'html', render: renderStatusProject });
                        continue;
                    }
                    col.push({ data: allInputSelected[i].id, name: allInputSelected[i].id, type: 'html' });
                }
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
                        url: settings.GetAllOldFacilityesForExport,
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
                    paging: true,
                    paginationType: "full_numbers",
                    columns: col,
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

        function putOldFacility(click) {
            var editModal = {
                Id: OldFacilityTableCartable.rows({ selected: true }).data()[0].id,
                CommitteeaApprovalNumber: $("#CommitteeaApprovalNumber").val(),
                IntroductionYear: $("#IntroductionYear").val(),
                ArchiveNumber: $("#ArchiveNumber").val(),
                NationalCode: $("#NationalCode").val(),
                DetailedCode: $("#DetailedCode").val(),
                CustomerName: $("#CustomerName").val(),
                ProgramType: $("#ProgramType").val(),
                ProgramTypeKindID: $("#ProgramTypeKindID").val(),
                ProgramTitle: $("#ProgramTitle").val(),
                RequestCapacity: $("#RequestCapacity").val(),
                RequestCountTypeID: $("#RequestCountTypeID").val(),
                ProgramPrice: $("#ProgramPrice").val(),
                OrganizationPrice: $("#OrganizationPrice").val(),
                AmountFacilityPaid: $("#AmountFacilityPaid").val(),
                BalanceSubsidyObligations: $("#BalanceSubsidyObligations").val(),
                SubsidyDuringParticipation: $("#SubsidyDuringParticipation").val(),
                RentSubsidy: $("#RentSubsidy").val(),
                PaidSubsidy: $("#PaidSubsidy").val(),
                BankName: $("#BankName").val(),
                OldFacilityRequestTotalState: $("#OldFacilityRequestTotalState").val(),
                FacilityDescription: $("#FacilityDescription").val(),
                Announced: moment($("#Announced").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                IssuanceBankApproval: moment($("#IssuanceBankApproval").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                IntroductionDeadline: moment($("#IntroductionDeadline").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                SubsidyPercentage: $("#SubsidyPercentage").val(),
                NumberInstallments: $("#NumberInstallments").val(),
                ContractRegistrationDate: moment($("#ContractRegistrationDate").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                CreatorLocation: $("#CreatorLocation").val(),
                ActivityLocation: $("#ActivityLocation").val(),
                PathAndPhone: $("#PathAndPhone").val(),
            }
            if (editModal.IntroductionDeadline == "Invalid date") {
                editModal.IntroductionDeadline = null;
            }
            if (editModal.Announced == "Invalid date") {
                editModal.Announced = null;
            }
            if (editModal.IssuanceBankApproval == "Invalid date") {
                editModal.IssuanceBankApproval = null;
            }
            if (editModal.ContractRegistrationDate == "Invalid date") {
                editModal.ContractRegistrationDate = null;
            }
            $.ajax({
                type: "put",
                url: settings.putOldFaciltyApiAddress,
                data: JSON.stringify(editModal),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'تسهیلات با موفقیت تغییر یافت.');
                    OldFacilityTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                    if ($(click.target)[0].id == "editsubmitBtn") {

                        bootbox.dialog({
                            message: `<div id="file-body"></div>`,
                            title: "پیوست اسناد به تسهیلات قدیمی",
                        }).bind('shown.bs.modal', function () {
                            $('.modal-dialog').css('max-width', '60%');
                            $('.bootbox-close-button').css("display", "inline");
                            $('.bootbox-close-button').addClass("btn-close");
                            $('.bootbox-close-button').text("");
                        });

                        $("#file-body").uploadFilePlugin2({
                            postDocumentToRequest: settings.postDocumentToRequest,
                            deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                            getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                            objectId: OldFacilityTableCartable.rows({ selected: true }).data()[0].id
                        });
                    }
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش تسهیلات قدیمی');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    OldFacilityTableCartable.rows('.important').deselect();
                }
            });
        }

        function putTemplateOldFacility(result) {
            var editTemplateModal = `<div class="row" id="editmodal">
                                <form id="formoldFacility" class="row g-3 needs-validation">

                                    <div class="col-4">
                                        <label class="form-label">شماره مصوبه کمیته</label>
                                        <input type="text" class="form-control" id="CommitteeaApprovalNumber" value="${result.committeeaApprovalNumber == null ? "" : result.committeeaApprovalNumber}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">سال معرفی</label>
                                        <input type="number" class="form-control" id="IntroductionYear"
                                            placeholder="سال را به صورت یک عدد چهار رقمی وارد کنید" value="${result.introductionYear == null ? "" : result.introductionYear}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">شماره بایگانی</label>
                                        <input type="text" class="form-control" id="ArchiveNumber" value="${result.archiveNumber == null ? "" : result.archiveNumber}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">شناسه ملی حقیقی/حقوقی</label>
                                        <input type="text" class="form-control" id="NationalCode" value="${result.nationalCode == null ? "" : result.nationalCode}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">كدتفصيلي</label>
                                        <input type="text" class="form-control" id="DetailedCode" value="${result.detailedCode == null ? "" : result.detailedCode}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">نام متقاضي</label>
                                        <input type="text" class="form-control" id="CustomerName" value="${result.customerName == null ? "" : result.customerName}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">نوع طرح</label>
                                        <input type="text" class="form-control" id="ProgramType" value="${result.programType == null ? "" : result.programType}"/>
                                    </div>

                                    <div class="col-4">
                                        <div id="ToProgramTypeKindID">
                                        </div>
                                    </div>

                                    <script>
                                                $("#ToProgramTypeKindID").drapdownPlugin({
                                                    apiAddress: '/api/Program/GetAllProgramTypeKinds',
                                                    valueOption: 'id',
                                                    textOption: 'title',
                                                    idTagName: 'ProgramTypeKindID',
                                                    dropdownParent: 'formoldFacility',
                                                    defaultValue: [${result.programTypeKindID}],
                                                    title: 'دسته بندی طرح',
                                                });
                                    </script>

                                    <div class="col-4">
                                        <label class="form-label">موضوع طرح</label>
                                        <input type="text" class="form-control" id="ProgramTitle" value="${result.programTitle == null ? "" : result.programTitle}"/>
                                   </div>

                                    <div class="col-4">
                                        <label class="form-label">ظرفيت</label>
                                        <input type="number" class="form-control" id="RequestCapacity" value="${result.requestCapacity == null ? "" : result.requestCapacity}"/>
                                    </div>
            
                                    <div class="col-4">
                                        <div id="ToRequestCountTypeID">
                                        </div>
                                    </div>

                                    <script>
                                                $("#ToRequestCountTypeID").drapdownPlugin({
                                                    apiAddress: '/api/Program/GetAllRequestCountTypes',
                                                    valueOption: 'id',
                                                    textOption: 'title',
                                                    idTagName: 'RequestCountTypeID',
                                                    dropdownParent: 'formoldFacility',
                                                    defaultValue: [${result.requestCountTypeID}],
                                                    title: 'واحد ظرفیت',
                                                });
                                    </script>

                                    <div class="col-4">
                                        <label class="form-label">تعداد</label>
                                        <input type="number" class="form-control" id="RequestCount" value="${result.requestCount == null ? "" : result.requestCount}"/>
                                    </div>
                    
                                    <div class="col-4">
                                        <label class="form-label">مبلغ ارزش طرح</label>
                                        <input type="number" class="form-control" id="ProgramPrice" value="${result.programPrice == null ? "" : result.programPrice}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">مبلغ تسهيلات مصوب سازمان</label>
                                        <input type="number" class="form-control" id="OrganizationPrice" value="${result.organizationPrice == null ? "" : result.organizationPrice}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">مبلغ  تسهیلات پرداختي</label>
                                        <input type="number" class="form-control" id="AmountFacilityPaid" value="${result.amountFacilityPaid == null ? "" : result.amountFacilityPaid}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">مانده تعهدات يارانه</label>
                                        <input type="number" class="form-control" id="BalanceSubsidyObligations" value="${result.balanceSubsidyObligations == null ? "" : result.balanceSubsidyObligations}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">يارانه دوران مشاركت</label>
                                        <input type="number" class="form-control" id="SubsidyDuringParticipation" value="${result.subsidyDuringParticipation == null ? "" : result.subsidyDuringParticipation}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">يارانه اجاره </label>
                                        <input type="number" class="form-control" id="RentSubsidy" value="${result.rentSubsidy == null ? "" : result.rentSubsidy}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">يارانه پرداختي</label>
                                        <input type="number" class="form-control" id="PaidSubsidy" value="${result.paidSubsidy == null ? "" : result.paidSubsidy}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">بانک عامل</label>
                                        <input type="text" class="form-control" id="BankName" value="${result.bankName == null ? "" : result.bankName}"/>
                                    </div>
                                    
                                    <div class="col-4">
                                        <label class="mb-2">وضعيت پروژه</label>
                                        <select class="form-select mb-3" value="${result.oldFacilityRequestTotalState == 0 ? `بهره برداري` : result.oldFacilityRequestTotalState == 1 ? `درحال ساخت` : result.oldFacilityRequestTotalState == 2 ? `درحال کارشناسی بانک` : `ابطال`}">
                                         <option value="0">بهره برداري</option> 
                                         <option value="1">درحال ساخت</option>
                                         <option value="2">درحال کارشناسی بانک</option>
                                         <option value="3">ابطال</option>

                                        </select>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">توضيحات طرح</label>
                                        <input type="text" class="form-control" id="FacilityDescription" value="${result.facilityDescription == null ? "" : result.facilityDescription}"/>
                                    </div>

                                    <div class="col-4">
                                       <label class="form-label">تاریخ معرفی</label>
                                       <input type="text" class="form-control" id="Announced" value="${result.announced}">
                                    </div>

                                    <script>
                                        $('#Announced').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: false,
                                            initialValueType: 'persian',
                                            observer: true,
                                        });
                                        if(${result.announced == null}){
                                            $('#Announced').val("");
                                         }
                                    </script>

                                    <div class="col-4">
                                       <label class="form-label">تاریخ صدور مصوبه بانکی</label>
                                       <input class="form-control" id="IssuanceBankApproval" value="${result.issuanceBankApproval}">
                                      </div>    

                                     <script>
                                        $('#IssuanceBankApproval').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: true,
                                            initialValueType: 'gregorian',
                                            observer: true,
                                        });
                                        if(${result.issuanceBankApproval == null}){
                                            $('#IssuanceBankApproval').val("");
                                         }
                                    </script>

                                    <div class="col-4">
                                       <label class="form-label">مهلت معرفی نامه</label>
                                       <input type="text" class="form-control" id="IntroductionDeadline" value="${result.introductionDeadline}">
                                    </div>

                                    <script>
                                        $('#IntroductionDeadline').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: true,
                                            initialValueType: 'gregorian',
                                            observer: true,
                                        });
                                        if(${result.introductionDeadline == null}){
                                            $('#IntroductionDeadline').val("");
                                         }
                                    </script>

                                    <div class="col-4">
                                        <label class="form-label">درصد یارانه</label>
                                        <input type="number" class="form-control" id="SubsidyPercentage" min=0 max=100 value="${result.subsidyPercentage == null ? "" : result.subsidyPercentage}"/>
                                    </div>


                                    <div class="col-4">
                                        <label class="form-label">تعداد اقساط </label>
                                        <input type="text" class="form-control" id="NumberInstallments"  value="${result.numberInstallments == null ? "" : result.numberInstallments}"/>
                                    </div>


                                    <div class="col-4">
                                       <label class="form-label">تاريخ ثبت قرارداد </label>
                                       <input type="text" class="form-control" id="ContractRegistrationDate" value="${result.contractRegistrationDate}">
                                    </div>

                                    <script>
                                        $('#ContractRegistrationDate').persianDatepicker({
                                            'format': 'YYYY/MM/DD',
                                            'autoclose': true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true,
                                            initialValue: true,
                                            initialValueType: 'gregorian',
                                            observer: true,
                                        });
                                        if(${result.contractRegistrationDate == null}){
                                            $('#ContractRegistrationDate').val("");
                                         }
                                    </script>

                                   <div class="col-4">
                                        <label class="form-label">سازنده</label>
                                        <input type="text" class="form-control" id="CreatorLocation"  value="${result.creatorLocation == null ? "" : result.creatorLocation}"/>
                                    </div>

                                    <div class="col-4">
                                        <label class="form-label">محل اجراي پرو‍ژه</label>
                                        <input type="text" class="form-control" id="ActivityLocation"  value="${result.activityLocation == null ? "" : result.activityLocation}"/>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label">آدرس و شماره تماس</label>
                                        <textarea  type="text" class="form-control" id="PathAndPhone" value="${result.pathAndPhone == null ? "" : result.pathAndPhone}"></textarea>
                                    </div>
                                    
                                </form>
                            </div>


                            <div class="modal-footer">
                                <div class="btn btn-success" id="editsubmitBtn">ثبت و تغییر پیوست ها</div>
                                <div class="btn btn-info" id="editsubmitBtn2">ثبت بدون تغییر پیوست ها</div>
                                <div class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">لغو</div>
                            </div>`;
            return editTemplateModal;
        }

        function postOldFacility(click) {
            var addModal = {
                CommitteeaApprovalNumber: $("#CommitteeaApprovalNumber").val(),
                IntroductionYear: $("#IntroductionYear").val(),
                ArchiveNumber: $("#ArchiveNumber").val(),
                NationalCode: $("#NationalCode").val(),
                DetailedCode: $("#DetailedCode").val(),
                CustomerName: $("#CustomerName").val(),
                ProgramType: $("#ProgramType").val(),
                ProgramTypeKindID: $("#ProgramTypeKindID").val(),
                ProgramTitle: $("#ProgramTitle").val(),
                RequestCapacity: $("#RequestCapacity").val(),
                RequestCountTypeID: $("#RequestCountTypeID").val(),
                ProgramPrice: $("#ProgramPrice").val(),
                OrganizationPrice: $("#OrganizationPrice").val(),
                AmountFacilityPaid: $("#AmountFacilityPaid").val(),
                BalanceSubsidyObligations: $("#BalanceSubsidyObligations").val(),
                SubsidyDuringParticipation: $("#SubsidyDuringParticipation").val(),
                RentSubsidy: $("#RentSubsidy").val(),
                PaidSubsidy: $("#PaidSubsidy").val(),
                BankName: $("#BankName").val(),
                OldFacilityRequestTotalState: $("#OldFacilityRequestTotalState").val(),
                FacilityDescription: $("#FacilityDescription").val(),
                Announced: moment($("#Announced").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                IssuanceBankApproval: moment($("#IssuanceBankApproval").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                IntroductionDeadline: moment($("#IntroductionDeadline").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                SubsidyPercentage: $("#SubsidyPercentage").val(),
                NumberInstallments: $("#NumberInstallments").val(),
                ContractRegistrationDate: moment($("#ContractRegistrationDate").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
                CreatorLocation: $("#CreatorLocation").val(),
                ActivityLocation: $("#ActivityLocation").val(),
                PathAndPhone: $("#PathAndPhone").val(),
            }
            $.ajax({
                type: "post",
                url: settings.postOldFaciltyApiAddress,
                data: JSON.stringify(addModal),
                contentType: "application/json; charset=utf-8",

                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'تسهیلات با موفقیت ثبت شد.');
                    OldFacilityTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');

                    if ($(click.target)[0].id == "submitBtn") {

                        bootbox.dialog({
                            message: `<div id="file-body"></div>`,
                            title: "پیوست اسناد به تسهیلات قدیمی",
                        }).bind('shown.bs.modal', function () {
                            $('.modal-dialog').css('max-width', '60%');
                            $('.bootbox-close-button').css("display", "inline");
                            $('.bootbox-close-button').addClass("btn-close");
                            $('.bootbox-close-button').text("");
                        });

                        $("#file-body").uploadFilePlugin2({
                            postDocumentToRequest: settings.postDocumentToRequest,
                            deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                            getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                            objectId: result
                        });
                    }
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش تسهیلات قدیمی');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    OldFacilityTableCartable.rows('.important').deselect();
                }
            });
        }

        function getAllItems() {
            var areaCartable = area.find("#cartable");
            OldFacilityTableCartable = areaCartable.DataTable({
                ajax:
                {
                    contentType: 'application/json',
                    url: settings.AllItemsApiAddress,
                    type: 'get',
                    dataType: "json",
                },
                destroy: true,
                colReorder: true,
                searchPanes: true,
                scrollX: true,
                select: true,
                serverSide: true,
                paging: true,
                dom: 'rt<"mt-2" l>p',
                paginationType: "full_numbers",
                serverMethod: 'post',
                columns: cols,
                language: {
                    url: '/lib/jQueryDatatable/fa.json'
                },

            });
            OldFacilityTableCartable.on('xhr', function (event, dt, type, indexes) {
                $.ajax({
                    type: 'Get',
                    url: '/api/Program/GetAllProgramTypeKinds',
                    success: function (res) {
                        ProgramTypeKind.push(...res);
                    }
                });
                let $sum = 0;
                if (type != null) {
                    $.each(type.data, function (a, b) {
                        $sum += parseFloat(b.organizationPrice);
                    });
                    $('#Cartablefooter').html(`<b> ${$sum.toLocaleString('ar-EG')} ریال</b>`);
                }
            });
        }

        function getTemplate() {
            var ss = `<div class="card">
                            <div class="card-body" id="ArchiveOldFacility">
                                <h4 class="mb-0">آرشیو تسهیلات قدیمی</h4>
                                <hr>
                                <nav class="navbar navbar-expand-lg navbar-dark bg-info rounded p-2 mb-2">
                                    <div class="sticky">
                                        <button type="button" class="btn btn-success text-dark" data-role-operation="add" alt="افزودن تسهیلات قدیمی"><i class="bx bx-message-square-add"></i>افزودن تسهیلات</button>
                                        <button type="button" class="btn btn-warning d-none ms-2" id="editSessionRoomBtn"  data-role-operation="edit"><i class="bx bx-message-square-edit"></i>ویرایش تسهیلات</button>
                                        <button type="button" class="btn btn-danger text-dark d-none ms-2" id="deleteSessionRoomBtn" data-role-remove><i class="bx bx-comment-minus"></i>حذف تسهیلات</button>
                                        <button class="btn btn-light ms-2" href="#headerfilters" data-bs-toggle="collapse" data-toggle="collapse" title="جستجو"><i class='bx bx-search'></i>جستجو</button>
                                        <button id="btnExel" class="menu-items btn bg-warning ms-2">گزارشگیری</button>
                                    </div>
                                    <hr>
                                </nav>
                                <div>
                                    <table id="cartable" class="table table-border" style="width:100%">
                                    <thead>
                                        <tr id="headerfilters" class="collapse">
                                            <th scope="col" class="cartablefilter" >
                                                <input type="number" placeholder="سال معرفی" class="inputSearch form-control" data-name="introductionYear" />
                                                </th>
                                            <th scope="col" class="cartablefilter">
                                                <input type="text" class="inputSearch form-control" placeholder="نام متقاضی" data-name="customerName" />
                                                </th>
                                            <th scope="col" class="cartablefilter"> 
                                                <input type="text" class="inputSearch form-control" placeholder="نوع طرح" data-name="programType" />
                                                </th>
                                            <th scope="col" class="cartablefilter">
                                                <input type="text" placeholder="موضوع طرح" class="inputSearch form-control" data-name="programTitle" />
                                            </th>
                                            <th scope="col" class="cartablefilter"></th>
                                            <th scope="col" class="cartablefilter">
                                                <input type="text" placeholder="استان محل بهره برداری" class="inputSearch form-control" data-name="activityLocation" />
                                            </th>
                                            <th scope="col" class="cartablefilter"></th>
                                        </tr>
                                        <tr>
                                            <th scope="col" name="introductionYear"><b>سال معرفی</b></th>
                                            <th scope="col" name="customerName"><b>نام متقاضی</b></th>
                                            <th scope="col" name="programType"><b>نوع طرح</b></th>
                                            <th scope="col" name="programTitle"><b>موضوع طرح</b></th>
                                            <th scope="col" name="organizationPrice"><b>مبلغ تسهيلات مصوب سازمان</b></th>
                                            <th scope="col" name="activityLocation"><b>استان محل بهره برداری</b></th>
                                            <th scope="col" name=""><b>وضعیت پروژه</b></th>
                                        </tr>
                                    </thead>
                                        <tfoot>
                                            <tr style="background-color: goldenrod;">
                                                <td colspan="2"><b>جمع مبلغ تسهیلات مصوب سازمان :</b></td> 
                                                <td id="Cartablefooter" class="text-start" colspan="5"></td>
                                            </tr>
                                        </tfoot>
                                    </table>


                                 <table class="d-none" id="table-export-excel"></table>
                                </div>
                            </div>
                        </div>

                        `;
            ss = minifyHtml(ss);
            return ss;

        }

        return this;
    }
}(jQuery));
