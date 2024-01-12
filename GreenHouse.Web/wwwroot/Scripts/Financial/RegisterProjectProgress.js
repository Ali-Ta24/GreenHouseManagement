var area = $("#visitReports");
var FacilityrequestId = $('#visitreportview_Facilityid').val();

var registerProjectDataTable = area.DataTable({
    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',
        url: '/api/VisitReportRecordType/GetVisitReportByFacilityId?FacilityrequestId=' + FacilityrequestId,
    },
    searching: false,
    select: true,
    info: false,
    ordering: false,
    paging: false,
    columns: [
        { data: "createdBy", name: "createdBy", type: "html" },
        {
            data: "creationTime", name: "creationTime", type: "html",
            render: function (data, type, row) {

                return getPerianDateTime(data)
            }
        },
        {
            data: "visitDate", name: "visitDate", type: "html", render: function (data, type, row) {

                return getPerianDateTime(data)
            }
        },
        { data: "visitLocation", name: "visitLocation", type: "html" },
        { data: "visitor", name: "visitor", type: "html" },
        { data: "visitorCompany", name: "visitorCompany", type: "html" }

    ]


});//DataTable

function createOrUpdate(operation) {

    var message = "A";
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '/' + mm + '/' + dd;
    let current = registerProjectDataTable.rows({ selected: true }).data()[0];
    $.ajax({
        url: '/FinancialCartable/AddOrEditVisitReport',
        data: {
            ID: (operation === "edit" ? current.id : 0),
            FacilityRequestId: FacilityrequestId,
            CreationTime: today,
            VisitDate: today,
        },
        async: false,
        success: function (res) {

            message = res;
        }
    });
    let valueRowSelect = ProgramDataTableCartable.rows({ selected: true }).data()[0];

    var boox = bootbox.dialog({
        message: message,
        title: "گزارش بازدید شرکت  " + valueRowSelect.companyName,
        buttons: {
            cancel: {
                label: "انصراف",
                className: 'btn-danger',
                callback: function () {
                    //console.log('انصراف');
                }
            },
        }
    }).init(function () {
        if (operation === "edit") {
            $('#VisitLocation').val(current.visitLocation);
            $('#VisitDate').val(getPerianDate(current.visitDate));
            $('#Visitor').val(current.visitor);
            $('#ApprovedAmount').val(current.approvedAmount);
            $('#ContractDate').val(getPerianDate(current.contractDate));
            $('#ApplicantPartnershipShare').val(current.applicantPartnershipShare);
            $('#BankPartnershipShare').val(current.bankPartnershipShare);
            $('#USE').val(current.use);
            $('#Power').val(current.power);
            $('#Length').val(current.length);
            $('#Width').val(current.width);
            $('#VisitorCompany').val(current.visitorCompany);
            $('#TemporaryRegistration').val(current.temporaryRegistration);
            $("#DateOfEndProject").val(current.dateOfEndProject);
            $('#visitreportId').val(current.id);
            $('#Depth').val(current.depth);
            $('#visitreportId').val(current.id)
            readonlyitem();

            $('#headerSave').css('display', 'none');
            $('#headerVisitgrid').css('display', '');

        }
        $('.modal-dialog').last().css('max-width', '99%');

    });



}

function readonlyitem() {
    $('#VisitLocation').attr('readonly', true);
    $('#VisitDate').attr('readonly', true);
    $('#Visitor').attr('readonly', true);
    $('#ApprovedAmount').attr('readonly', true);
    $('#ContractDate').attr('readonly', true);
    $('#ApplicantPartnershipShare').attr('readonly', true);
    $('#BankPartnershipShare').attr('readonly', true);
    $('#USE').attr('readonly', true);
    $('#Power').attr('readonly', true);
    $('#Length').attr('readonly', true);
    $('#Width').attr('readonly', true);
    $('#VisitorCompany').attr('readonly', true);
    $('#TemporaryRegistration').attr('readonly', true);

    $("#DateOfEndProject").attr('readonly', true);
    $('#visitreportId').attr('readonly', true);
    $('#Depth').attr('readonly', true);

}

registerProjectDataTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = registerProjectDataTable.rows({ selected: true }).data()[0];
    let ProgramDataTableCartable22 = ProgramDataTableCartable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined && $('#showType').val() != "Viewable") {
        if (checkPermition("EditProjectProgress"))
            $("#editCapacityBtn").removeClass("d-none");

        if (checkPermition("RemoveProjectProgress"))
            $("#deleteCapacityBtn").removeClass("d-none");

        if (checkPermition("VisitReportViewDocument"))
            $("#UploadBtn").removeClass("d-none");


        event.stopPropagation();
    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editCapacityBtn").addClass("d-none");
    $("#deleteCapacityBtn").addClass("d-none");
    $("#UploadBtn").addClass("d-none");

});

function showuploaud() {
    var current = registerProjectDataTable.rows({ selected: true }).data()[0];
    var cartable = ProgramDataTableCartable.rows({ selected: true }).data()[0];
    if (current == undefined) {
        ivsAlert('ابتدا یک ردیف را انتخاب نمایید', 'خطا', 'error');
        return false;
    }

    var result = '<div id="Docs"><div>';
    bootbox.dialog({
        message: result,
        title: "بارگذاری عکس",
        buttons: {
            cancel: {
                label: "خروج",
                className: 'btn-danger',
                callback: function () {
                    //console.log('Custom cancel clicked');
                }
            }

        }
    }).init(function () {


        var data = $('#Docs').UploadVisitReportDoc({
            VisitReportID: current.id,
            documentGroupId: 5,
            permitions: JSON.parse(cartable.activityPermission),
            rools: getuserroll().split(',')
        });


    });


}
function RemoveRegister() {
    let valueRowSelect = registerProjectDataTable.rows({ selected: true }).data()[0];
    let cartableid = ProgramDataTableCartable.rows({ selected: true }).data()[0];

    bootbox.confirm("آیا از حذف این گزارش بازدید اطمینان دارید ؟", function (result) {
        if (result) {
            $.ajax({
                url: "/api/VisitReport/DeleteVisitReport?id=" + valueRowSelect.id + "&FacilityId=" + cartableid.id,
                type: "Delete",
                success: function (res) {
                    registerProjectDataTable.ajax.reload();
                }
                , error: function (ex, cc, bb) {
                    loading('mainbtnsave', false, true);
                    ivsAlert('اشکال در حذف', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);

                },

            });
        }
    });
}
