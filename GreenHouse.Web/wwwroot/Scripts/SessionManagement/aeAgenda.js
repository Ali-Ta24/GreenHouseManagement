
var agendaList = '';
var areaAgenda = '';

async function getAgendaList(sesstionId, areaAgendaCard = 'aEAgendaCard', areaAgendaTable = 'agendaTable', stateDateSesstion) {

    $('#sesstinIdForAgenda').val(sesstionId);
    $('#stateDateSesstion').val(stateDateSesstion);

    $('#agendaTableCard').html("");
    areaAgenda = areaAgendaCard;

    var tenplateTbl = `
        <style>
            #${areaAgendaTable} table, #${areaAgendaTable} th, #${areaAgendaTable} td {
                border: 1px solid #DDDDDD;
            }
        </style>
        <table id="${areaAgendaTable}" class=" table table-sm table-bordered table-striped table-responsive stripe cell-border" style=" width:100% !important">
            <thead>
                <tr>
                    <th>عنوان</th>
                    <th>توضیحات</th>
                    <th>مسئول</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>

    `;

    $(`#${areaAgendaCard} #agendaTableCard`).html(tenplateTbl);

    agendaList =
        $(`#${areaAgendaTable}`).DataTable({
            ajax:
            {
                contentType: 'application/json',
                url: '/api/Agenda/GetAgendas?sessionID=' + sesstionId,
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

                { data: "title", name: "title", type: "html" },
                { data: "description", name: "description", type: "html" },

                { render: function (data, type, row) { return getResponsible(row) } },


            ],

        });

    var sesstionDate = shamsiTomiladi4(stateDateSesstion);
    var dateNow = shamsiTomiladi4(Date.now());
    var resultCompareDates = compareDates(sesstionDate, dateNow);


    agendaList.on('select', function (event, dt, type, indexes) {
        let valueRowSelect = agendaList.rows({ selected: true }).data()[0];



        if (valueRowSelect != undefined && resultCompareDates <= 0) {
            if (valueRowSelect.responsibleUserID != null || valueRowSelect.responsible != null) {
                $(`#${areaAgendaCard} #btn-removeAgenda`).removeClass('d-none');
            }
            //$('#btn-editAgenda').removeClass('d-none');

            event.stopPropagation();
        }
    }).on('deselect', function (event, dt, type, indexes) {
        //$('#btn-editAgenda').addClass('d-none');

        $(`#${areaAgendaCard} #btn-removeAgenda`).addClass('d-none');
    });


    //if (resultCompareDates <= 0) {
    if (resultCompareDates >= 0) {
        $(`#${areaAgendaCard} #btn-addAgenda`).removeClass('d-none');
    }
    else {
        $(`#${areaAgendaCard} #btn-addAgenda`).addClass('d-none');
    }

    //$('#listAgendaModal').modal('show');

}

function getResponsible(data) {

    if (data.responsibleUserID == null && data.responsible == null) {
        return 'نامشخص';
    }
    else if (data.responsibleUserID == null) {
        return data.responsible;
    }
    else if (data.responsible == null) {
        return data.responsibleUserID;
    }

}

function closeAgendaModal() {
    $('#btn-editAgenda').addClass('d-none');
    $('#btn-removeAgenda').addClass('d-none');
    agendaList.rows().deselect();
}

function closeAddAgendaModal() {
    resetForm('formAddAgenda');
    $("#userResponseCard").html("");
}



function setUserResponseAgenda(e) {
    //console.log(e.value);
    $('#userResponseCard').html("");
    var userResponseCard = ``;
    if (e.value == 1) {
        $.ajax({
            type: "get",
            url: "/api/User/GetAllActiveUser",
            success: function (result) {

                if (result.length > 0) {
                    userResponseCard = `
                       <label for="fullNameInOrg" class="form-label">نام مسئول درون سازمانی   </label>
                       <select class="form-select" data-placeholder="Choose anything" id="fullNameInOrg" "> `;

                    for (var i = 0; i < result.length; i++) {
                        var str = `
                            <option value="${result[i].nationalCodeId}">${result[i].firstName} ${result[i].lastName}   </option>
                        `;
                        userResponseCard += str;
                    }
                    userResponseCard += ' </select>';
                    $("#userResponseCard").html(userResponseCard);

                }
            },
            error: function (ex, cc, bb) {
                ivsAlert('اشکال در برقراری ارتباط با سرور - بخش کاربران مسئول دستور جلسه  ', 'خطا', 'error');
                //console.log(ex);
                //console.log(bb);
            },

        });
    }
    else if (e.value == 2) {
        userResponseCard = `
           <label for="fullNameOutOrg" class="form-label"> نام مسئول خارج از سازمان </label>
           <input type="text" class="form-control"  tabindex="1" id="fullNameOutOrg"  
                  name="fullNameOutOrg"/>

        `;
        $('#userResponseCard').html(userResponseCard);
    }

}




function addAgendaModal() {
    $("#addAgendaModal").modal('show');
}



function addAgenda() {

    var modelAgenda = {};

    if ($("#typeUserResponseAgenda").val() == 1) {



        resUserIn = $("#fullNameInOrg").val();
        modelAgenda = {
            sessionID: $("#sesstinIdForAgenda").val(),
            responsibleUserID: $("#fullNameInOrg").val(),
            title: $("#agendaTitle").val(),
            description: $("#agendaDes").val(),
            allocatedMinutes: 0,
            rowOrder: 0

        };
    }
    else if ($("#typeUserResponseAgenda").val() == 2) {
        if ($("#fullNameOutOrg").val() == "" || $("#fullNameOutOrg").val() == null) {
            ivsAlert2('error', ' پیام خطا', 'ابتدا یک کاربر خارج سازمانی مشخص کنید.');
            return;
        }
        modelAgenda = {
            sessionID: parseInt($("#sesstinIdForAgenda").val()),
            responsible: $("#fullNameOutOrg").val(),
            title: $("#agendaTitle").val(),
            description: $("#agendaDes").val(),
            allocatedMinutes: 0,
            rowOrder: 0

        };
    }

    loading('btnAddAgenda', true, true);
    $.ajax({
        type: "post",
        url: "/api/Agenda/Post",
        data: JSON.stringify(modelAgenda),
        contentType: "application/json; charset=utf-8",
        success: async function (result) {


            loading('btnAddAgenda', false, true);
            $('#addAgendaModal').modal('hide');
            agendaList.ajax.reload();
            resetForm('formAddAgenda');
            $("#userResponseCard").html("");
            ivsAlert2('success', ' پیام موفقیت', 'دستور جلسه ثبت شد');


        },
        error: function (ex, cc, bb) {
            loading('btnAddAgenda', false, true);

            ivsAlert('اشکال در برقراری ارتباط با سرور -   بخش دستور جلسه', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        }
    });
}

function removeAgenda() {
    var id = $('#agendaIdRemove').val();



    loading('btn-removeAgenda', false, true);

    $.ajax({
        type: "delete",
        url: "/api/Agenda/Delete?id=" + id,
        success: function (result) {
            //console.log(result);
            $('#deleteAgendaModal').modal('hide');
            loading('btn-removeAgenda', false, true);
            ivsAlert2("success", "پیام موفقیت", "دستور جلسه مورد نظر حذف شد");
            //agendaList.ajax.reload();

        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در حذف فایل', 'خطا', 'error');
            loading('btn-removeAgenda', false, true);

            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

            agendaList.ajax.reload();
        }

    });
}

function deleteAgendaModal() {
    ;
    var valueRowSelect = agendaList.rows({ selected: true }).data()[0];
    if (valueRowSelect == undefined || valueRowSelect == null) {
        ivsAlert2('error', 'عدم انتخاب دستورجلسه', 'برای حذف ابتدا یک دستور جلسه را انتخاب کنید');
        return;
    }
    $('#agendaIdRemove').val(valueRowSelect.id);
    $('#deleteAgendaModal').modal('show');
}

//$("#btn-removeAgenda").click(function () {

//});

