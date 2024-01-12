var area = $("#typeTable");
var DocumentGroupDataTable = null;

$.ajax({
    url: "/api/DocumentGroup/GetDocumentGroupType",
    type: "GET",
    success: function (res) {
        //console.log(res);
        $.each(res, function (a, b) {
            $('#Documntgrouptypes').append(`<option value="${b.id}">${b.title}</option>`);
        });

        $('#Documntgrouptypes').select2({
            // theme: 'bootstrap4',
            dir: "rtl",
            width: "100%"
        });
        Initialize();

    }
});

DocumentGroupDataTable = area.DataTable({
    //"destroy": true,
    ajax:
    {
        contentType: 'application/json',
        url: '/api/DocumentGroup/GetAll?DocumentGroupTypeId=0',
        cache: false,
    },
    searching: false,
    select: true,
    info: false,

    columns: [
        //{ data: "id", name: "id", type: "html" },
        { data: "title", name: "title", type: "html" },
        {
            data: "isRequired", name: "isRequired", type: "html",
            render: function (data, type, row) {

                if (data === true) {
                    return '<input type="checkbox" style="width: 20px;height: 20px;margin-right: 35%;" checked="checked" disabled>';
                }
                else {
                    return '<input type="checkbox" style="width: 20px;height: 20px;margin-right: 35%;" disabled>';
                }

                return data;
            }
        }
    ]


});//DataTable

DocumentGroupDataTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = DocumentGroupDataTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editBtn").removeClass("d-none");
        $("#deleteBtn").removeClass("d-none");
        event.stopPropagation();
    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editBtn").addClass("d-none");
    $("#deleteBtn").addClass("d-none");

});

function Initialize() {


    var url = '/api/DocumentGroup/GetAll?DocumentGroupTypeId=' + $('#Documntgrouptypes').val();
    DocumentGroupDataTable.ajax.url(url);
    DocumentGroupDataTable.rows().ajax.reload();

}

function deleteBank() {
    bootbox.confirm("آیا از حذف این مورد اطمینان دارید؟", function (res) {
        if (res) {
            let valueRowSelect = DocumentGroupDataTable.rows({ selected: true }).data()[0];
            if (valueRowSelect == undefined) {
                ivsAlert2('error', "خطا", "لطفا یک ردیف را انتخاب کنید");
                return;
            }
            var id = valueRowSelect.id;
            $.ajax({
                url: "/api/DocumentGroup/Delete?id=" + id,
                type: "DELETE",
                success: function () {

                    DocumentGroupDataTable.ajax.reload();
                }
            });

        }
    });

}
function editORupdate(kind) {

    var data = {};
    if (kind == 'add') {
        data = {
            Id: 0,
            Title: '',
            IsRequired: false,
            GroupTypeId: $('#Documntgrouptypes').val()
        }
    }
    else {
        let valueRowSelect = DocumentGroupDataTable.rows({ selected: true }).data()[0];
        if (valueRowSelect == undefined) {
            ivsAlert2('error', "خطا", "لطفا یک ردیف را انتخاب کنید");
            return;
        }
        data = {
            Id: valueRowSelect.id,
            Title: valueRowSelect.title,
            IsRequired: valueRowSelect.isRequired,
            GroupTypeId: valueRowSelect.groupTypeId
        }
    }
    var title = "ایجاد";
    if (kind == 'edit')
        title = "اصلاح";
    $.ajax({
        url: "/FinancialDocumentGroup/EditOrCreate",
        data: data,
        type: "Get",
        success: function (res) {
            bootbox.dialog({
                message: res,
                title: title,
                size: "small",
            });
        }

    });

}

$('#Documntgrouptypes').change(function () {
    Initialize();
});

