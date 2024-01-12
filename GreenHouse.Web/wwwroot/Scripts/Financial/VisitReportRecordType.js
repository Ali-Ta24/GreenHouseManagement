var area = $("#Visitreports");
var ProgramDataTable = null;


function Initialize(typeid, kindid) {

    ProgramDataTable = area.DataTable({
        "destroy": true,
        ajax:
        {
            contentType: 'application/json',
            url: '/api/VisitReportRecordType/GetByType?typeID=' + typeid + "&kindID=" + kindid,
            cache: false,

        },
        searching: false,
        select: true,
        info: false,
        sorting: false,
        columns: [
            //{ data: "id", name: "id", type: "html" },
            { data: "title", name: "title", type: "html" },
            { data: "order", name: "order", type: "html" },
            { data: "weight", name: "weight", type: "html" },
            /* ,*/

        ]


    });
    ProgramDataTable.on('xhr', function (event, dt, type, indexes) {

        if (type != undefined && type.data != undefined && type.data != null) {
            let $sum = 0;
            $.each(type.data, function (a, b) {
                $sum += parseInt(b.weight);
            });
            $('#sumWeight').html($sum);
        }
    });
    ProgramDataTable.on('select', function (event, dt, type, indexes) {
        let valueRowSelect = ProgramDataTable.rows({ selected: true }).data()[0];

        if (valueRowSelect != undefined) {
            $("#editBtn").removeClass("d-none");
            $("#deleteBtn").removeClass("d-none");

            event.stopPropagation();
        }

    }).on('deselect', function (event, dt, type, indexes) {
        $("#editBtn").addClass("d-none");
        $("#deleteBtn").addClass("d-none");

    });

}

$('#VisitReportTypeId').select2({
    placeholder: "یک مورد را انتخاب نمایید",
    ajax: {
        url: "/api/VisitReportRecordType/GetVisitReportTypes",
        dataType: 'json',
        processResults: function (data, params) {

            var _data = [];
            let index = 1;
            $.each(data, function (a, b) {
                _data.push({
                    "id": b.id,
                    "text": b.name,
                    "index": index
                });
                index += 1;
            });

            return {

                results: _data,

            };
        }
    }
});

$('#VisitReportTypeKindId').select2({
    placeholder: "یک مورد را انتخاب نمایید",

    ajax: {
        url: "/api/VisitReportRecordType/GetVisitReportTypeKinds",
        dataType: 'json',
        processResults: function (data, params) {
            var _data = [];
            let index = 1;
            $.each(data, function (a, b) {
                _data.push({
                    "id": b.id,
                    "text": b.name,
                    "index": index
                });
                index += 1;
            });

            return {

                results: _data,

            };
        }
    }
});

$('#VisitReportTypeKindId,#VisitReportTypeId').change(function () {
    if (checkdropdons() == false) {

        return false;
    }

    Initialize($('#VisitReportTypeId').val(), $('#VisitReportTypeKindId').val());
});

function checkdropdons() {
    if ($('#VisitReportTypeKindId').val() == null || $('#VisitReportTypeId').val() == null) {
        if ($('#VisitReportTypeKindId').val() == null)
            $('#head_kind').notify("ابتدا یک مورد را انتخاب نمایید");

        if ($('#VisitReportTypeId').val() == null)
            $('#head_type').notify("ابتدا یک مورد را انتخاب نمایید");
        return false;

    }
    return true;
}

function operation(opartion) {
    //if (checkdropdons() == false) {

    //    return false;
    //}
    var title = "ایجاد آیتم جدید";
    if (opartion == "put")
        title = "اصلاح آیتم ";
    var message = `
    <div class="row">
    <div class="col-md-12 form-group">
        <span>عنوان</span>
        <textarea id="title" class="form-control" rows="3" placeholder="عنوان را وارد نمایید"></textarea>
    </div>
    </div>

     <div class="row">
    <div class="col-md-12 form-group">
        <span>ترتیب</span>
        <input type="number" id="order" class="form-control" placeholder="ترتیب نمایش را وارد نمایید" />
    </div>
    </div>
    <div class="row">
    <div class="col-md-12 form-group">
        <span>وزن</span>
        <input type="number" id="weight" class="form-control" placeholder="وزن آیتم نسبت به کل آیتم ها" />
    </div>
    </div>

`
    bootbox.dialog({
        title: title,
        message: message,
        closeButton: true,
        buttons: {
            cancel: {
                label: "انصراف",
                className: 'btn-danger',
                callback: function () {
                    //console.log('Custom cancel clicked');
                }
            },
            ok: {
                label: "تایید",
                className: 'btn-success',
                callback: function () {
                    savebtn(opartion)
                }

            }
        }
    }).init(function () {

        if (opartion == "put") {

            let valueRowSelect = ProgramDataTable.rows({ selected: true }).data()[0];
            $('#title').val(valueRowSelect.title);
            $('#order').val(valueRowSelect.order);
            $('#weight').val(valueRowSelect.weight);
        }
    });

    function savebtn(opartion) {
        if (checkbeForInsertUpdate() == false)
            return false;
        let id = 0;
        if (opartion == "put") {
            let valueRowSelect = ProgramDataTable.rows({ selected: true }).data()[0];
            id = valueRowSelect.id;
        }

        $.ajax({
            url: "/api/VisitReportRecordType/" + opartion,
            type: opartion,
            datatype: "json",
            contentType: 'application/json',
            data: JSON.stringify({
                ID: id,
                VisitRecordTypeKindID: $('#VisitReportTypeKindId').val(),
                VisitReportTypeID: $('#VisitReportTypeId').val(),
                Title: $('#title').val(),
                Order: $('#order').val(),
                VisitRecordTypeKind_title: "",
                VisitReportType_title: "",
                Weight: $('#weight').val()
            }),
            success: function (res) {
                ProgramDataTable.rows().deselect();
                ProgramDataTable.ajax.reload();
            }, error: function (ex, cc, bb) {
                ivsAlert2('error', "خطا", "خطا در عملیات  ");
                //console.log(ex);
                //console.log(cc);
                //console.log(bb);
            }

        });
    }

    function checkbeForInsertUpdate() {
        if ($('#title').val() == '' || $('#order').val() == '') {
            if ($('#title').val() == '')
                $('#title').notify("عنوان را وارد نمایید ");

            if ($('#order').val() == '')
                $('#title').notify("ترتیب را وارد نمایید ");
            return false;

        }
        return true;

    }

}

function removeItem() {
    let valueRowSelect = ProgramDataTable.rows({ selected: true }).data()[0];
    if (valueRowSelect == null || valueRowSelect == undefined) {
        ivsAlert2('error', "خطا", "ابتدا یک ردیف را انتخاب نمایید");
        return false;
    }
    let id = valueRowSelect.id;
    bootbox.confirm("آیا از حذف این آیتم اطمینان دارید ؟", function (result) {
        if (result) {
            $.ajax({
                url: "/api/VisitReportRecordType/Delete?Id=" + id,
                type: "delete",
                success: function (res) {
                    ivsAlert2('success', "موفقیت", "آیتم با موفقیت حذف شد");
                    ProgramDataTable.rows().deselect();
                    ProgramDataTable.ajax.reload();
                }, error: function (ex, cc, bb) {
                    ivsAlert2('error', "خطا", "خطا در عملیات  ");
                    //console.log(ex);
                    //console.log(cc);
                    //console.log(bb);
                }

            });
        }
    });

}