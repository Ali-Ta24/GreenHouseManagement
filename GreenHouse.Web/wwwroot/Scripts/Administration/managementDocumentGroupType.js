
getAllProgramTypes();
var requestRequiredDocumentGroupTable = '';
var documnetGroupTypeTable = "";

//start - required all files than have form validation
var forms = document.querySelectorAll('.needs-validation')
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated')
        }, false)
    });
//end


function loadDocumnetGroupTypeTable(programTypeID, hasThisProgramTypeID = true) {

    documnetGroupTypeTable = $('#documnetGroupTypeTable').DataTable({
        ajax:
        {
            contentType: 'application/json',
            url: '/api/ProgramTypeRequestRequiredDocumentGroup/GetRequestRequiredDocumentViewByTypeID?programTypeID=' + programTypeID + "&hasThisProgramTypeID=" + true,
            dataSrc: '',
        },
        destroy: true,
        searching: false,
        select: true,
        info: false,
        columns: [
            { data: "title", name: "title", type: "html", },
            { data: "required", render: function (data, type, row) { return setValueBoolean(data) } }
        ]

    });
    documnetGroupTypeTable.on('select', function (event, dt, type, indexes) {
        let valueRowSelect = documnetGroupTypeTable.rows({ selected: true }).data()[0];

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

function changeShowTypeProgram_facility(programTypeID) {
    loadDocumnetGroupTypeTable(programTypeID, true);
}

function getAllProgramTypes() {
    $.ajax({
        type: "get",
        url: "/api/Program/GetAllProgramTypes",
        success: function (result) {
            if (result.length > 0) {
                var firstItem = 0;
                $("#showType").html("");
                ss = "";
                for (var i = 0; i < result.length; i++) {
                    var str = `
                        <option value="${result[i].id}">${result[i].title}</option>
                    `;
                    if (i == 0) {
                        firstItem = result[i].id;
                    }
                    ss += str;
                }
                loadDocumnetGroupTypeTable(firstItem);
                $("#showType").html(ss);
            }
            else {
                $("#showType").html("<option disabled> هیچ نوعی برای نمایش وجود ندارد</option>");

            }
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا', ' اشکال در برقراری ارتباط با سرور - خطا در فراخوانی GetAllProgramTypes  ',);
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }
    });
}

function confirmDeleteItem() {
    let currentRow = documnetGroupTypeTable.rows({ selected: true }).data()[0];
    bootbox.confirm({
        message: "آیا از حذف آیتم انتخاب شده مطمئن هستید؟",
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
                await deleteItem(currentRow.programTypeID, currentRow.requestRequiredDocumentGroupID)
            }
        }
    });
}

function deleteItem(programTypeID, requestRequiredDocumentGroupID) {

    $.ajax({
        type: "delete",
        url: "/api/ProgramTypeRequestRequiredDocumentGroup/delete?ProgramTypeID=" + programTypeID + "&RequestRequiredDocumentGroupID=" + requestRequiredDocumentGroupID,
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
            documnetGroupTypeTable.rows().deselect();
            documnetGroupTypeTable.ajax.reload();
        }
    });

}



function EditItem() {
    let currentRow = documnetGroupTypeTable.rows({ selected: true }).data()[0];

    if (currentRow.required == true)
        $("#requiredType").prop("checked", true)
    else
        $("#requiredType").prop("checked", false)

    $("#titleType").text(currentRow.title);

    $("#editDocTypeModal").modal("show");
}

function submitEdit() {
    let currentRow = documnetGroupTypeTable.rows({ selected: true }).data()[0];
    loading('submitEditBtn', true, true);

    var isRequiredType = false;
    if ($('#requiredType').is(":checked")) {
        isRequiredType = true;
    }

    var editModel = {
        required: isRequiredType,
        requestRequiredDocumentGroupID: currentRow.requestRequiredDocumentGroupID,
        programTypeID: currentRow.programTypeID,
    }

    $.ajax({
        type: "put",
        url: "/api/ProgramTypeRequestRequiredDocumentGroup/put",
        contentType: 'application/json',
        data: JSON.stringify(editModel),
        success: function (result) {
            ivsAlert2('success', "موفقیت", "آیتم مورد نظر با موفقیت ویرایش شد");
            loading('submitEditBtn', false, true);
        },
        error: function (ex, cc, bb) {
            loading('submitEditBtn', false, true);
            ivsAlert2('error', "خطا", "خطا در ویرایش آتیم انتخاب شده ");
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            loading('submitEditBtn', false, true);
            $("#editDocTypeModal").modal("hide");
            documnetGroupTypeTable.rows().deselect();
            documnetGroupTypeTable.ajax.reload();
        }
    });

}

function addItem() {

    var programTypeID = $('#showType').find(":selected").val();

    $("#programTypeTitle").text($('#showType').find(":selected").text());

    requestRequiredDocumentGroupTable =
        $('#requestRequiredDocumentGroupTable').DataTable({
            //serverSide: true, //make server side processing to true
            ajax:
            {
                contentType: 'application/json',
                url: '/api/ProgramTypeRequestRequiredDocumentGroup/GetRequestRequiredDocumentViewByTypeID?programTypeID=' + programTypeID + "&hasThisProgramTypeID=" + false,
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
            //select: true,
            bFilter: false,
            paginationType: "full_numbers",//pagination type


            columns: [
                {
                    defaultContent: '<input type="checkbox"  class="form-check-input check-facility" name="" id="">',
                    type: "html",
                },
                { data: "title", name: "title", type: "html" },

            ],
            select: {
                style: 'single'
            }
        });

    requestRequiredDocumentGroupTable.on('select', function (event, dt, type, indexes) {

        //console.log(indexes);
        requestRequiredDocumentGroupTable.cell({ row: indexes[0], column: 0 }).data(`<input type="checkbox" checked  class="form-check-input check-facility" name="" id="">`);

    }).on('deselect', function (event, dt, type, indexes) {
        //console.log('deselect');
        requestRequiredDocumentGroupTable.cell({ row: indexes[0], column: 0 }).data(`<input type="checkbox"  class="form-check-input check-facility" name="" id="">`);
    });

    $("#addDocTypeModal").modal("show");
}

function submitAddItem() {
    var programTypeID = $('#showType').find(":selected").val();

    if (programTypeID == null || programTypeID == "") {
        ivsAlert2('error', "خطا", "نوع طرح مشخص نیست، امکان افزودن وجود ندارد");
        return;
    }

    if (requestRequiredDocumentGroupTable.rows('.selected').count() < 1) {
        $("#errorMassageNoSelectDoc").text("لطفا یک سند انتخاب نمایید");
        $("#requestRequiredDocumentGroupTable").addClass("errorTable");
        return;
    }
    else {
        $("#errorMassageNoSelectDoc").text("");
        $("#requestRequiredDocumentGroupTable").removeClass("errorTable");

    }

    var isRequiredType = false;
    if ($('#requiredTypePost').is(":checked")) {
        isRequiredType = true;
    }

    var groupDocId = "";
    var groupDoc = requestRequiredDocumentGroupTable.rows({ selected: true }).data();

    $.each(groupDoc, function (key, value) {
        groupDocId = value.requestRequiredDocumentGroupID;

    });

    var editModel = {
        required: isRequiredType,
        requestRequiredDocumentGroupID: groupDocId,
        programTypeID: programTypeID,
    }



    loading('submitAddBtn', true, true);
    $.ajax({
        type: "post",
        url: "/api/ProgramTypeRequestRequiredDocumentGroup/post",
        contentType: 'application/json',
        data: JSON.stringify(editModel),
        success: function (result) {
            ivsAlert2('success', "موفقیت", "سند مورد نظر با موفقیت اضافه شد");
            loading('submitAddBtn', false, true);
        },
        error: function (ex, cc, bb) {
            loading('submitAddBtn', false, true);
            ivsAlert2('error', "خطا", "خطا در افزودن سند انتخاب شده ");
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            loading('submitAddBtn', false, true);
            $("#addDocTypeModal").modal("hide");
            documnetGroupTypeTable.rows().deselect();
            documnetGroupTypeTable.ajax.reload();
        }
    });
}

