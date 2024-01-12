/// <reference path="setdetailaccountplugin.js" />

var areaCartable = $("#cartable");
loading('CartableFinancialHeader', true, false);
var cols = [
    { data: "facilityRequestCode", name: "facilityRequestCode", type: "html", },
    { data: "accountNumber", name: "accountNumber", type: "html", },
    { data: "companyName", name: "companyName", type: "html", },
    { data: "programName", name: "programName", type: "html", },
    { data: "programTypeKindName", name: "programTypeKindName", type: "html", },
    { data: "programPrice", name: "programPrice", type: "number", render: function (data, type, row) { return data.toLocaleString('ar-EG') } },
    { data: "bankName", name: "bankName", type: "html", },
    { data: "branchName", name: "branchName", type: "html", },
    {
        data: "state", name: "state", type: "html", render: function (data, type, row) {
            return '<span title="' + row.currentActivityDescription + '" >' + data + '  <i class="bx bx-info-circle"  style="color:#deb379"></i></span>'
        }
    },

];

var ProgramDataTableCartable = areaCartable.DataTable({
    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',
        url: "/api/Cartable/GetAll?viewName=Acctionable",  //url of the Ajax source,i.e. web api method
        type: 'Get',
        contentType: 'application/json',
        dataType: "json",
        dataSrc: function (json) {
            loading('CartableFinancialHeader', false, false);

            return json.data;
        }
    },
    destroy: true,
    colReorder: true,
    searchPanes: true,
    scrollX: true,
    select: true,
    serverSide: true,
    scrollX: true,
    paginationType: "full_numbers",

    columns: cols,
    serverMethod: 'post',
    language: {
        url: '/lib/jQueryDatatable/fa.json'
    },
    dom: 'Bfrtip',
    buttons: ['excel'],


});//DataTable
$('.inputSearch').change(function () {

    ProgramDataTableCartable.columns().search('');
    $('input.inputSearch').filter(function (a) {
        return $('input.inputSearch')[a].value.length > 0
    }).each(function (a, b) {
        columnindex = parseInt($("[name='" + b.dataset.name + "']")[0].dataset.columnIndex);
        ProgramDataTableCartable.columns(columnindex).search(b.value);

    });
    ProgramDataTableCartable.draw();

});




function changeShowTypeProgram_facility(type) {

    var url = "/api/Cartable/GetAll?viewName=" + type
    ProgramDataTableCartable.ajax.url(url);
    ProgramDataTableCartable.rows().ajax.reload();

}

function gotoWorkflowInstance() {
    let valueRowSelect = ProgramDataTableCartable.rows({ selected: true }).data()[0];
    $.ajax({
        url: "/api/Cartable/GetWorkFlowInstanceByFacilityID?facilityId=" + valueRowSelect.id,
        complete: function (workflowInstanceID) {

            if (workflowInstanceID.responseText != null)
                window.location = "/workflow/workflow-instances/" + workflowInstanceID.responseText
        }
    })
}

function resetWorkFlow() {
    let valueRowSelect = ProgramDataTableCartable.rows({ selected: true }).data()[0];
    var facilityIntId = valueRowSelect.id;
    var facilityGuidId = valueRowSelect.facilityRequestSUID;
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

                confirmAgainResetWorkflow(facilityIntId, facilityGuidId)
            }

        }
    });
}

function confirmAgainResetWorkflow(facilityIntId, facilityGuidId) {
    bootbox.confirm({
        message: "با ریست چرخه کلیه فرآیندهای آن حذف شده و لازم است فرآیند تسهیلات از نو آغاز شود. آیا مطمئن هستید؟",
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
                ResetFacilityRequestWorkflow(facilityIntId, facilityGuidId);
            }

        }
    });
}

function ResetFacilityRequestWorkflow(facilityIntId, facilityGuidId) {
    loading('toggleModelBtn', true, true);
    $.ajax({
        type: "Post",
        url: "/api/Cartable/RestartWorkflowFinancial?facilityGuidId=" + facilityGuidId + "&facilityIntId=" + facilityIntId,
        success: function (result) {
            ivsAlert2('success', 'موفقیت در ریست چرخه', "چرخه تسهیلات انتخابی با موفقیت ریست شد");
            loading('toggleModelBtn', false, true);

        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'عدم توانایی ریست ', "اشکال در برقراری ارتباط با سرور - ریست انجام نشد");
            //console.log(ex);
            //console.log(bb);
            loading('toggleModelBtn', false, true);

        },
        complete: function (jqXHR) {
            ProgramDataTableCartable.ajax.reload();
        }
    });
}

function gotoWorkflowDefinitions() {
    let valueRowSelect = ProgramDataTableCartable.rows({ selected: true }).data()[0];
    if (valueRowSelect.workflowModelID != null) {

        window.location = "/workflow/workflow-definitions/" + valueRowSelect.workflowModelID;
    }
    else {
        ivsAlert2('error', 'خطای خالی بودن مدل', "امکان رفتن به مدل چرخه وجود ندارد زیرا مدل خالی است.");
    }
}

ProgramDataTableCartable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = ProgramDataTableCartable.rows({ selected: true }).data()[0];
    $("#btnAction").prop("disabled", "");
    $("#btnHistory").prop("disabled", "");

    $('#toggleModelBtn').prop('disabled', false);

}).on('deselect', function (event, dt, type, indexes) {
    $("#btnAction").prop("disabled", "disabled");
    $("#btnHistory").prop("disabled", "disabled");

    $('#toggleModelBtn').prop('disabled', true);
});

function checkPermition(acction) {

    let RowSelect = ProgramDataTableCartable.rows({ selected: true }).data()[0];
    var allpermition = JSON.parse(RowSelect.activityPermission);
    var rools = getuserroll().split(',');

    var result = false;
    $.each(allpermition, function (a, b) {
        if (rools.indexOf(b.RoleName) != -1 && b.StateActionName.toUpperCase() == acction.toUpperCase()) {

            result = true;
            return false;
        }
    })
    return result;

}

function showModalActionFacility() {
    var currentdata = ProgramDataTableCartable.rows({ selected: true }).data()[0];

    $.ajax({
        url: "/api/FacilityRequestLocal/CheckAutorize",
        complete(xhr, status) {

            if (xhr.status === 302) {
                location.reload();
            }
        }
    });

    var menu = $(`<div></div>`);
    var view = $(`<div></div>`);

    menu.append(`<button class="nav-link " id="nav-facility-tab" data-bs-toggle="tab" data-bs-target="#nav-facility" type="button" role="tab" aria-controls="nav-facility" aria-selected="true">اطلاعات کلی طرح</button>`);
    view.append(`<div class="tab-pane fade show " id="nav-facility" role="tabpanel" aria-labelledby="nav-facility-tab">`
        + GetFavilityInformation(currentdata.id) + `</div>`);

    if (currentdata != null && currentdata != undefined && (checkPermition("SetBank") == true || checkPermition("SetBankAccount") == true)) {
        menu.append(`<button class="nav-link" id="nav-SetBank-tab" data-bs-toggle="tab" data-bs-target="#nav-SetBank" type="button" role="tab" aria-controls="nav-SetBank" aria-selected="false">انتخاب بانک</button>`);
        view.append(` <div class="tab-pane fade" id="nav-SetBank" role="tabpanel" aria-labelledby="nav-SetBank-tab">`
            + SetBankAccount() + `</div>`);
    }
    if (currentdata != null && currentdata != undefined && checkPermition("SendInitialBankLetter") == true) {

        menu.append(`<button class="nav-link" id="nav-BankLetter-tab" data-bs-toggle="tab" data-bs-target="#nav-BankLetter" type="button" role="tab" aria-controls="nav-BankLetter" aria-selected="false">نامه معرفی به بانک</button>`);
        view.append(` <div class="tab-pane fade" id="nav-BankLetter" role="tabpanel" aria-labelledby="nav-BankLetter-tab">`
            + `<div id = "letter_1" ></div>
            </div >
            <script> $('#letter_1').SendLetter({FacilityId:${currentdata.id},letterType:2,CheckPermitionTosend:'SendInitialBankLetter',permitions:${currentdata.activityPermission.toLocaleString()},rools:["${getuserroll().split(',').join('","')}"]});</script >`);


    }

    if (currentdata != null && currentdata != undefined && checkPermition("SetBankCreditPillars") == true) {

        menu.append(`<button class="nav-link" id="nav-BankCreditPillar-tab" data-bs-toggle="tab" data-bs-target="#nav-BankCreditPillar" type="button" role="tab" aria-controls="nav-BankCreditPillar" aria-selected="false">ثبت مصوبه ارکان اعتباری بانک</button>`);
        view.append(' <div class="tab-pane fade" id="nav-BankCreditPillar" role="tabpanel" aria-labelledby="nav-BankCreditPillar-tab">' +
            `<div id="doc_1"></div>
            </div>
           
           <script> $('#doc_1').UploadDoc({ facilityRequestId:${currentdata.id} , documentGroupId: 1,permitions:${currentdata.activityPermission}
                ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);


    }

    if (currentdata != null && currentdata != undefined && checkPermition("SetDetailAccount") == true) {
        menu.append(`<button class="nav-link" id="nav-SetDetailAccount-tab" data-bs-toggle="tab" data-bs-target="#nav-SetDetailAccount" type="button" role="tab" aria-controls="nav-SetDetailAccount" aria-selected="false">ثبت کد تفصیلی</button>`);
        view.append(' <div class="tab-pane fade" id="nav-SetDetailAccount" role="tabpanel" aria-labelledby="nav-SetDetailAccount-tab">' +
            `<div id="detailAccounts"></div>
            </div>
           
           <script> $('#detailAccounts').SetDetailAccound({ facilityRequestId:${currentdata.id} , documentGroupId: 1,permitions:${currentdata.activityPermission}
            ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);


    }
    if (currentdata != null && currentdata != undefined && checkPermition("SetTemporaryRegisterDocument") == true) {
        menu.append(`<button class="nav-link" id="nav-TemporaryRegisterDocument-tab" data-bs-toggle="tab" data-bs-target="#nav-TemporaryRegisterDocument" type="button" role="tab" aria-controls="nav-TemporaryRegisterDocument" aria-selected="false">بارگذاری گواهی ثبت موقت شناور</button>`);
        view.append(' <div class="tab-pane fade" id="nav-TemporaryRegisterDocument" role="tabpanel" aria-labelledby="nav-TemporaryRegisterDocument-tab">' +
            `<div id = "doc_2" ></div>
            </div >
            <script> $('#doc_2').UploadDoc({facilityRequestId:${currentdata.id} , documentGroupId: 2,permitions:${currentdata.activityPermission}
                ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }


    if (currentdata != null && currentdata != undefined && checkPermition("SetLeasingContract") == true) {
        menu.append(`<button class="nav-link" id="nav-SetLeasingContract-tab" data-bs-toggle="tab" data-bs-target="#nav-SetLeasingContract" type="button" role="tab" aria-controls="nav-SetLeasingContract" aria-selected="false">بارگذاری قرارداد فروش اقساطی </button>`);
        view.append(` <div class="tab-pane fade" id="nav-SetLeasingContract" role="tabpanel" aria-labelledby="nav-SetLeasingContract-tab">`
            + `<div id = "doc_3" ></div>
            </div >
            <script> $('#doc_3').UploadDoc({facilityRequestId:${currentdata.id} , documentGroupId: 4,permitions:${currentdata.activityPermission}
                ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("ShowBankLeasingPayment") == true) {
        menu.append(`<button class="nav-link" id="nav-RegisterBankLeasingPayment-tab" data-bs-toggle="tab" data-bs-target="#nav-RegisterBankLeasingPayment" type="button" role="tab" aria-controls="nav-RegisterBankLeasingPayment" aria-selected="false">ثبت پرداخت اقساط تسهیلات </button>`);
        view.append(` <div class="tab-pane fade" id="nav-RegisterBankLeasingPayment" role="tabpanel" aria-labelledby="nav-RegisterBankLeasingPayment-tab">`
            + SetRegisterBankLeasingPayment(currentdata.id) + `</div>`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("ViewCountBankInstallments") == true) {
        menu.append(`<button class="nav-link" id="nav-ViewCountBankInstallments-tab" data-bs-toggle="tab" data-bs-target="#nav-ViewCountBankInstallments" type="button" role="tab" aria-controls="nav-ViewCountBankInstallments" aria-selected="false">اطلاعات محاسبه یارانه دوران فروش اقساطی</button>`);
        view.append(' <div class="tab-pane fade" id="nav-ViewCountBankInstallments" role="tabpanel" aria-labelledby="nav-ViewCountBankInstallments-tab">' +
            `<div id = "ViewCountBankInstallment" ></div>
            </div >
            <script> $('#ViewCountBankInstallment').SetCountBankInstallments({facilityRequestId:${currentdata.id} ,permitions:${currentdata.activityPermission}
                ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("ViewSubsidyCalculation") == true) {
        menu.append(`<button class="nav-link " id="nav-SubsidyCalculat-tab" data-bs-toggle="tab" data-bs-target="#nav-SubsidyCalculat" type="button" role="tab" aria-controls="nav-SubsidyCalculat" aria-selected="true">محاسبه یارانه دوران فروش اقساطی (خرید)</button>`);
        view.append(`<div class="tab-pane fade show " id="nav-SubsidyCalculat" role="tabpanel" aria-labelledby="nav-SubsidyCalculat-tab">`
            + calculateSubsidy(currentdata.id) + `</div>`);
    }


    if (currentdata != null && currentdata != undefined && checkPermition("ViewInfoCalculationProduction") == true) {
        menu.append(`<button class="nav-link" id="nav-ViewInfoCalculationProduction-tab" data-bs-toggle="tab" data-bs-target="#nav-ViewInfoCalculationProduction" type="button" role="tab" aria-controls="nav-ViewInfoCalculationProduction" aria-selected="false">اطلاعات محاسبه یارانه دوران مشارکت</button>`);
        view.append(' <div class="tab-pane fade" id="nav-ViewInfoCalculationProduction" role="tabpanel" aria-labelledby="nav-ViewInfoCalculationProduction-tab">' +
            `<div id = "ViewInfoCalculationProduction" ></div>
            </div >
            <script> $('#ViewInfoCalculationProduction').InfoCalculationProduction({facilityRequestId:${currentdata.id} ,permitions:${currentdata.activityPermission}
                ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("ViewSubsidyCalculation") == true) {
        menu.append(`<button class="nav-link " id="nav-SubsidyProductCalculat-tab" data-bs-toggle="tab" data-bs-target="#nav-SubsidyProductCalculat" type="button" role="tab" aria-controls="nav-SubsidyProductCalculat" aria-selected="true">محاسبه یارانه دوران مشارکت (ساخت)</button>`);
        view.append(`<div class="tab-pane fade show " id="nav-SubsidyProductCalculat" role="tabpanel" aria-labelledby="nav-SubsidyProductCalculat-tab">` +
            `<div id = "SubsidyCalculationProductionview" ></div>
            </div >
            <script> $('#SubsidyCalculationProductionview').SubsidyCalculationProduction({facilityRequestId:${currentdata.id} ,permitions:${currentdata.activityPermission}
                ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("SetCooperationContract") == true) {
        menu.append(`<button class="nav-link" id="nav-SetCooperationContract-tab" data-bs-toggle="tab" data-bs-target="#nav-SetCooperationContract" type="button" role="tab" aria-controls="nav-SetCooperationContract" aria-selected="false">بارگذاری قرارداد مشارکت </button>`);
        view.append(` <div class="tab-pane fade" id="nav-SetCooperationContract" role="tabpanel" aria-labelledby="nav-SetCooperationContract-tab">`
            + `<div id = "doc_4" ></div>
            </div >
            <script> $('#doc_4').UploadDoc({facilityRequestId:${currentdata.id} , documentGroupId: 3,permitions:${currentdata.activityPermission}
                ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("RegisterProjectProgress") == true) {
        menu.append(`<button class="nav-link" id="nav-RegisterProjectProgress-tab" data-bs-toggle="tab" data-bs-target="#nav-RegisterProjectProgress" type="button" role="tab" aria-controls="nav-RegisterProjectProgress" aria-selected="false">گزارش پیشرفت پروژه </button>`);
        view.append(` <div class="tab-pane fade" id="nav-RegisterProjectProgress" role="tabpanel" aria-labelledby="nav-RegisterProjectProgress-tab">`
            + GetvisitReport(currentdata.id) + `</div>`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("SetFinalRegisterDocument") == true) {
        menu.append(`<button class="nav-link" id="nav-SetFinalRegisterDocument-tab" data-bs-toggle="tab" data-bs-target="#nav-SetFinalRegisterDocument" type="button" role="tab" aria-controls="nav-SetFinalRegisterDocument" aria-selected="false">ثبت گواهی دائم شناور</button>`);
        view.append(` <div class="tab-pane fade" id="nav-SetFinalRegisterDocument" role="tabpanel" aria-labelledby="nav-SetFinalRegisterDocument-tab">`
            + `<div id = "doc_5" ></div>
            </div >
             <script> $('#doc_5').UploadDoc({facilityRequestId:${currentdata.id} , documentGroupId: 6,permitions:${currentdata.activityPermission}
                ,rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }
    if (currentdata != null && currentdata != undefined && checkPermition("SetSubsidyWithdrawPermissionLetter") == true) {

        menu.append(`<button class="nav-link" id="nav-SetSubsidyWithdrawPermissionLetter-tab" data-bs-toggle="tab" data-bs-target="#nav-SetSubsidyWithdrawPermissionLetter" type="button" role="tab" aria-controls="nav-SetSubsidyWithdrawPermissionLetter" aria-selected="false">نامه مجوز برداشت یارانه</button>`);
        view.append(` <div class="tab-pane fade" id="nav-SetSubsidyWithdrawPermissionLetter" role="tabpanel" aria-labelledby="nav-SetSubsidyWithdrawPermissionLetter-tab">`
            + `<div id = "letter_2" ></div>
            </div >
            <script> $('#letter_2').SendLetter({FacilityId:${currentdata.id},letterType:1,CheckPermitionTosend:'SendSubsidyWithdrawPermissionLetter',permitions:${currentdata.activityPermission.toLocaleString()},rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("SetSubsidyWithdrawFromAccount") == true) {

        menu.append(`<button class="nav-link" id="nav-SetSubsidyWithdrawFromAccount-tab" data-bs-toggle="tab" data-bs-target="#nav-SetSubsidyWithdrawFromAccount" type="button" role="tab" aria-controls="nav-SetSubsidyWithdrawFromAccount" aria-selected="false">ثبت برداشت یارانه</button>`);
        view.append(` <div class="tab-pane fade" id="nav-SetSubsidyWithdrawFromAccount" role="tabpanel" aria-labelledby="nav-SetSubsidyWithdrawFromAccount-tab">`
            + `<div id = "SetWithdrawFromBankAccount" ></div>
            </div >
            <script> $('#SetWithdrawFromBankAccount').WithdrawFromBankAccount({facilityRequestId:${currentdata.id},permitions:${currentdata.activityPermission.toLocaleString()},rools:["${getuserroll().split(',').join('","')}"]});</script >`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("ViewGeneralDocuments") == true) {
        menu.append(`<button class="nav-link" id="nav-GeneralDocument-tab" data-bs-toggle="tab" data-bs-target="#nav-GeneralDocument" type="button" role="tab" aria-controls="nav-GeneralDocument" aria-selected="false">اسناد عمومی</button>`);
        view.append(` <div class="tab-pane fade" id="nav-GeneralDocument" role="tabpanel" aria-labelledby="nav-GeneralDocument-tab">`
            + `<div id = "GeneralDocument" ></div>
            </div >
            <script> $('#GeneralDocument').uploadFilePlugin2({objectId:${currentdata.id},title:"اسناد عمومی",isAddDocuments:${checkPermition("AddGeneralDocuments")},isEditDocuments:${checkPermition("EditGeneralDocuments")},
                postDocumentToRequest:"/api/Facility/PostFinancialDocumentToFacilityRequest",
                deleteDocumentFromFacilityRequest:"/api/Facility/RemoveFinancialDocumentFromFacilityRequest",
                aferAddbtnClick:function(){
                 $('#modalAddDocuments').css('max-width','50%');
                $('#modalAddDocuments').css('margin-right','25%');
                $('#modalAddDocuments').css('z-index','80000');
                
                }});
               
            </script >`);
    }
    if (currentdata != null && currentdata != undefined && checkPermition("ViewCirculationLetter") == true) {
        menu.append(`<button class="nav-link" id="nav-CirculationLetter-tab" data-bs-toggle="tab" data-bs-target="#nav-CirculationLetter" type="button" role="tab" aria-controls="nav-CirculationLetter" aria-selected="false">گردش نامه </button>`);
        view.append(` <div class="tab-pane fade" id="nav-CirculationLetter" role="tabpanel" aria-labelledby="nav-CirculationLetter-tab">`
            + `<div id = "CirculationLetter" ></div>
            </div >
            <script> $('#CirculationLetter').sendLetterDetailPlugin({ facilityRequestId:${currentdata.id},title:"اسناد عمومی",isAddDocuments:${checkPermition("AddGeneralDocuments")},isEditDocuments:${checkPermition("EditGeneralDocuments")}              
                });
               
            </script >`);
    }

    if (currentdata != null && currentdata != undefined && checkPermition("Comment") == true) {
        menu.append(`<button class="nav-link" id="nav-Comment-tab" data-bs-toggle="tab" data-bs-target="#nav-Comment" type="button" role="tab" aria-controls="nav-Comment" aria-selected="false">نظرات</button>`);
        view.append(` <div class="tab-pane fade" id="nav-Comment" role="tabpanel" aria-labelledby="nav-Comment-tab">`
            + `<div id="Comment" ></div>
            </div >
            <script> $('#Comment').CommentPlugin({ objectId:${currentdata.id},postComment:'/api/Facility/PostCommentfinancial'}  );
               
            </script >`);
    }

    if (menu.html() == '') {
        bootbox.alert("شما دسترسی لازم برای نمایش این صفحه را ندارید");
        return false;
    }
    var xxx = '<nav><div class="nav nav-tabs nav-primary " id="nav-tab" role="tablist">' + menu.html() + '</div></nav>' + '<div class="tab-content" id="nav-tabContent">' + view.html() + `</div>
<div class="modal-footer">
`+
        (checkPermition("accept") ? '<button type="button" class="btn btn-success" id="mainbtnsave">تایید فرآیند</button>' : '')
        + (checkPermition("reject") && currentdata.availableAction.indexOf("Reject") > -1 ? '<button type="button" style="right: 10px;position: absolute;" class="btn btn-danger" id="rejectStep">رد و بازگشت به مرحله قبل</button>' : '')

        + ` <button type="button" class="btn btn-danger" id="mainbtnclose">خروج</button>
</div>
`;


    var xx = bootbox.dialog({
        message: xxx,
        title: "اقدامات مرتبط با تسهیلات انتخاب شده "

    });
    xx.bind('shown.bs.modal', function () {
        $('.modal-dialog').css('max-width', '90%');
        $('#nav-tab .nav-link')[0].click();
        $('#workflowCurrentStepDescription').text(currentdata.currentActivityDescription);
        $('.bootbox-close-button').css("display", "inline");
        $('.bootbox-close-button').addClass("btn-close");
        $('.bootbox-close-button').text("");
        $('.modal-header h5').addClass('text-primary');

        if ($('#showType').val() === "Viewable") {
            $('.btn-success').css('display', 'none')
        }

        if (currentdata.lag_Description != null && currentdata.lag_Description != "") {
            $('#lag_Description').text(currentdata.lag_Description);
        }
        else {
            $('#decriptheder').remove();
        }


    });


    $('#mainbtnclose').click(function () {
        bootbox.hideAll();
    });

    $('#mainbtnsave').click(function () {
        if ($.isFunction(window.checkValidation)) {
            if (checkValidation() == false)
                return false;
        }
        var currentdata = ProgramDataTableCartable.rows({ selected: true }).data()[0];
        loading('mainbtnsave', true, true);
        bootbox.prompt({
            centerVertical: true,
            title: 'آیا از تایید این فرآیند اطمینان دارید؟',
            placeholder: "توضیحات",
            inputType: 'textarea', callback(desc) {

                if (desc != null) {
                    $.ajax({
                        url: "/api/Cartable/Accept/?faciltyId=" + currentdata.id + "&descript=" + (desc == null || desc == "" ? "-" : desc),
                        type: "Get",
                        success: function (res) {
                            bootbox.hideAll();
                            ProgramDataTableCartable.ajax.reload();
                        },
                        error: function (ex, cc, bb) {

                            loading('mainbtnsave', false, true);
                            if (ex.responseText.indexOf('ErrorCode=[002]') > -1) {
                                ivsAlert('شما نامه معرفی به بانک را هنوز تولید نکرده اید ابتدا نامه را ارسال نماید تا شماره نامه را دریافت کنید سپس تایید را انجام دهید ', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[001]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا نام بانک را انتخاب نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[003]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا مصوبه ارکان اعتباری بانک را بارگذاری نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[004]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا گواهی ثبت موقت را بارگذاری نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[005]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا قرارداد فروش اقساطی را بارگذاری نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[006]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا  قرارداد مشارکت را بارگذاری نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[007]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا  گزارش پیشرفت پروژه وارد نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[008]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا  گواهی دائم شناور را بارگذاری نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[009]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا  پرداخت اقساط تسهیلات را وارد نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[0010]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا برداشت از حساب را وارد نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[0011]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا مدت زمان اقساط را وارد نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[0012]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا نرخ سود بانکی را وارد نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[0025]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا کدتفصلی را وارد نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[0026]') > -1) {
                                ivsAlert('برای ادامه فرآیند حساب بانکی را وارد نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[0027]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا محاسبه یارانه را تایید نمایید', 'خطا', 'error');
                            }
                            else if (ex.responseText.indexOf('ErrorCode=[0028]') > -1) {
                                ivsAlert('برای ادامه فرآیند ابتدا اطلاعات محاسبه یارانه را وارد نمایید', 'خطا', 'error');
                            }

                            else {
                                ivsAlert('اشکال در ثبت', 'خطا', 'error');
                                //console.log(ex);
                                //console.log(bb);
                            }
                        },

                    })
                }
                else {
                    loading('mainbtnsave', false, true);
                }
            }

        });
    });

    $('#rejectStep').click(function () {
        if (checkPermition("reject") === false) {
            ivsAlert('شما دسترسی لازم برای رد این درخواست را ندارید', `خطا`, 'error');
            return false;
        }
        else {
            bootbox.prompt({
                centerVertical: true,
                title: 'علت رد یا بازگشت ',
                inputType: 'textarea', callback(res) {
                    if (res != null) {
                        loadingClass('modal-content', true, false);
                        $.ajax({
                            url: "/api/Cartable/Reject/?faciltyId=" + currentdata.id + "&descript=" + res,
                            type: "Get",
                            success: function (res) {
                                bootbox.hideAll();
                                loadingClass('modal-content', false, false);
                                ProgramDataTableCartable.ajax.reload();
                            },
                            error: function (ex, cc, bb) {
                                loadingClass('modal-content', false, false);
                                ivsAlert('اشکال در ثبت', 'خطا', 'error');
                                //console.log(ex);
                                //console.log(bb);

                            },

                        })
                    }
                }
            });
        }
    });

}


function SetRegisterBankLeasingPayment(id) {
    var result = '';
    $.ajax({
        url: "/FinancialCartable/RegisterBankLeasingPaymen/?facilityId=" + id,
        type: "Get",
        async: false,
        success: function (res) {
            result = res
        }

    });
    return result;
}


function GetFavilityInformation(id) {
    var result = '';
    $.ajax({
        url: "/FinancialCartable/FacilityInformation/?facilityRequestID=" + id,
        type: "Get",
        async: false,
        success: function (res) {
            result = res
        },
        error: function (ex, cc, bb) {

            location.reload();
        },
        complete(xhr, status) {

            if (status === 302) {
                location.reload();
            }
        }

    });
    return result;
}


function calculateSubsidy(id) {
    var result = '';
    $.ajax({
        url: "/FinancialCartable/CalculateSubsit/?id=" + id,
        type: "Get",
        async: false,
        success: function (res) {

            result = res
            //bootbox.dialog({
            //    message: res,
            //    //title: "محاسبه یارانه",
            //    size: "extra-large"
            //}).init(function () {
            //    $('.modal-dialog').css('max-width', '90%');
            //    //$('.bootbox-close-button').css('display','block');
            //});
        }

    });
    return result;
}

function sendLetter(id, type) {

    var currentdata = ProgramDataTableCartable.rows({ selected: true }).data()[0];
    var result = '';

    $.ajax({
        url: "/FinancialCartable/letterBank/?id=" + id + "&LetterType=" + type,
        async: false,
        data: {
            permitions: JSON.parse(currentdata.activityPermission)
        },
        type: "POST",
        success: function (res) {

            result = res;
        }

    });
    return result;
}

function generalDocument(id, groupid) {

    var result = $('<div id="Doc' + groupid + '"></div>').UploadDoc({ facilityRequestId: id, documentGroupId: groupid });

    return result;
    //$.ajax({
    //    url: "/FinancialCartable/UploadFile",
    //    async: false,
    //    data: { facilityId: id, grouptypeId: groupid },
    //    type: "POST",
    //    success: function (res) {
    //        result = res;

    //        return false;

    //    }

    //});

}

function TemporaryRegisterDocument(id, groupid) {
    //var result = '';
    //$.ajax({
    //    url: "/FinancialCartable/UploadFile/",
    //    async: false,
    //    data: { facilityId: id, grouptypeId: groupid },
    //    type: "POST",
    //    success: function (res) {
    //        result = res;

    //    }

    //});
    //return result;
    var result = $('<div id="Doc' + groupid + '"></div>').UploadDoc({ facilityRequestId: id, documentGroupId: groupid });
    return result;
}

async function gotoHistory() {

    var valueRowSelect = ProgramDataTableCartable.rows({ selected: true }).data()[0];

    if (valueRowSelect == undefined || valueRowSelect == null) {
        ivsAlert('ابتدا یک رکورد را انتخاب کنید', `خطا`, 'error');
    }
    else {
        $.ajax({
            url: "/FinancialCartable/HistoryFlow?id=" + valueRowSelect.id + "&code=" + valueRowSelect.facilityRequestCode,
            type: "GET",
            success: function (res) {
                bootbox.dialog({
                    message: res,
                    size: "Large",
                    title: '<b  class="font-weight-light text-center text-muted py-3"> خط زمانی درخواست تسهیلات کد <span id="" style="color:red">' + valueRowSelect.facilityRequestCode + '</span> </b>'
                }).init(function () {
                    $('.modal-dialog').css('max-width', '90%');
                    $('.bootbox-close-button').css("display", "inline");
                    $('.bootbox-close-button').addClass("btn-close");
                    $('.bootbox-close-button').text("");
                });
            }
        });

    }

}

function SetBankAccount() {

    var valueRowSelect = ProgramDataTableCartable.rows({ selected: true }).data()[0];
    var result = '';
    if (valueRowSelect == undefined || valueRowSelect == null) {
        ivsAlert('ابتدا یک رکورد را انتخاب کنید', `خطا`, 'error');
    }
    else {

        $.ajax({
            url: "/FinancialCartable/ChooseBankAccount?FacilityId=" + valueRowSelect.id,
            async: false,
            success: function (res) {
                result = res;
                return false;
            }
        });

        return result;

    }
}

function GetvisitReport(id) {
    var result = "";
    $.ajax({
        url: "/FinancialCartable/RegisterProjectProgress?FacilityRequestId=" + id,
        type: "Get",
        async: false,
        success: function (res) {
            result = res;
        }
    });
    return result;
}

$('#exportExel').click(function () {
    $('#cartable_wrapper .buttons-excel').click();
});


