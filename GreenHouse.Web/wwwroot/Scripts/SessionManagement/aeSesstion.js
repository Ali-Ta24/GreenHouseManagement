

var forms = document.querySelectorAll('.needs-validation');
var facilityRequestForSesstion = '';

$('.multiple-select').select2({
    theme: 'bootstrap4',
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
    allowClear: Boolean($(this).data('allow-clear')),
    dropdownParent: $('#aeSesstionModal')
});

async function checkPrimarySesstion() {

    let data = await fetch("/api/Facility/FacilityRequestItemsReadyForPrimaryCommitteeSessionAsync?justNew=true")
        .then((response) => response.json())
        .then(data => {
            if (data.recordsTotal < 1) {

                return data.recordsTotal;
            }
        })
        .catch(error => {
            ivsAlert('اشکال در برقراری ارتباط با سرور - خطا در اجرا جلسات اصلی', 'خطا', 'error');
            console.error(error);
        });

    return data;

}

async function checkSecondarySesstion() {

    let data = await fetch("/api/Facility/FacilityRequestItemsReadyForSecondaryCommitteeSessionAsync?justNew=true")
        .then((response) => response.json())
        .then(data => {

            if (data.recordsTotal < 1) {

                return data.recordsTotal;
            }
        })
        .catch(error => {
            ivsAlert('اشکال در برقراری ارتباط با سرور - خطا در اجرا جلسات فرعی', 'خطا', 'error');
            console.error(error);
        });

    return data;

}

async function showAeSesstionModal(typeSesstion, actionName) {
    var urlTable = '';
    $('#title-sesstion').html("");
    $('#btn-RegisterSesstion').html("");


    resetForm("aeSesstionModalForm");

    if (actionName == "add") {
        if (typeSesstion == "PrimarySesstion") {

            let getCountSesstion = await checkPrimarySesstion();
            if (getCountSesstion == 0) {
                ivsAlert2('error', 'هشدار سیستم', 'هیچ تسهیلاتی برای تعیین جلسه وجود ندارد');
                return;
            }

            $('#title-sesstion').html("افزودن جلسه کمیته اصلی");
            $('#titleSesstion').val(" جلسه کمیته اصلی");
            urlTable = '/api/Facility/FacilityRequestItemsReadyForPrimaryCommitteeSessionAsync?justNew=true';
            $('#sesstionTypeId').val(1);
        }
        else if (typeSesstion == "SecondarySesstion") {

            let getCountSesstion = await checkSecondarySesstion();
            if (getCountSesstion == 0) {
                ivsAlert2('error', 'هشدار سیستم', 'هیچ تسهیلاتی برای تعیین جلسه وجود ندارد');
                return;
            }

            $('#title-sesstion').html("افزودن جلسه فرعی");
            $('#titleSesstion').val(" جلسه فرعی");
            urlTable = '/api/Facility/FacilityRequestItemsReadyForSecondaryCommitteeSessionAsync?justNew=true';
            $('#sesstionTypeId').val(2);
        }
    }




    loadRoom();
    loadInviteUser();
    loadInformantsUser();

    facilityRequestForSesstion =
        $('#facilityRequestForSesstion').DataTable({
            //serverSide: true, //make server side processing to true
            ajax:
            {
                contentType: 'application/json',
                url: urlTable, //url of the Ajax source,i.e. web api method
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

    facilityRequestForSesstion.on('select', function (event, dt, type, indexes) {

        //console.log(indexes);
        facilityRequestForSesstion.cell({ row: indexes[0], column: 0 }).data(`<input type="checkbox" checked  class="form-check-input check-facility" name="" id="">`);

    }).on('deselect', function (event, dt, type, indexes) {
        //console.log('deselect');
        facilityRequestForSesstion.cell({ row: indexes[0], column: 0 }).data(`<input type="checkbox"  class="form-check-input check-facility" name="" id="">`);
    });

    $('#dateSesstion').persianDatepicker({
        'format': 'YYYY/MM/DD',
        'autoclose': true,
        showOtherMonths: true,
        selectOtherMonths: true,
    });

    $('#endTime').pickatime({
        format: 'HH:i',
        min: [5, 00],

    });

    $('#startTime').pickatime({
        format: 'HH:i',
        min: [5, 00],
        onSet: function (context) {

            let selectTime = minutesToHours(context.select + 30);
            let max = [selectTime[0], selectTime[1]]
            let time = $('#endTime').pickatime().pickatime('picker');
            time.clear().set({ 'min': max });
        }
    });

    $('#aeSesstionModal').modal('show');



}

function loadRoom() {
    $.ajax({
        type: "get",
        url: "/api/SessionRoom/GetAllSessionRooms",
        success: function (result) {
            if (result.length > 0) {
                $("#roomSesstion").html("");

                ss = "";
                ss += "<option disabled>یک اتاق برای جلسه انتخاب نمایید</option>";
                for (var i = 0; i < result.length; i++) {
                    var str = `
                    <option value="${result[i].id}">${result[i].title}    </option>
                `;
                    ss += str;
                }
                $("#roomSesstion").html(ss);
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش اتاق جلسات ', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            $('#roomSesstion').val(null);
        }
    });
}

function loadInviteUser() {
    $.ajax({
        type: "get",
        url: "/api/User/GetAllActiveUser",
        success: function (result) {
            if (result.length > 0) {
                $("#inviteUserSesstion").html("");
                ss = "";
                for (var i = 0; i < result.length; i++) {
                    var str = `
                    <option value="${result[i].nationalCodeId}">${result[i].firstName} ${result[i].lastName}   </option>
                `;
                    ss += str;
                }
                $("#inviteUserSesstion").html(ss);
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش اتاق جلسات ', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }
    });
}

function loadInformantsUser() {
    $.ajax({
        type: "get",
        url: "/api/User/GetAllActiveUser",
        success: function (result) {
            if (result.length > 0) {
                $("#InformantsSesstion").html("");
                ss = "";
                for (var i = 0; i < result.length; i++) {
                    var str = `
                    <option value="${result[i].nationalCodeId}">${result[i].firstName} ${result[i].lastName}   </option>
                `;
                    ss += str;
                }
                $("#InformantsSesstion").html(ss);
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش اتاق جلسات ', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }
    });
}


async function checkAttendeesAvailablity() {

    let data = await fetch("/api/Session/CheckAttendeesAvailablity")
        .then((response) => response.json())
        .then(data => {
            if (data.recordsTotal < 1) {

                return data.recordsTotal;
            }
        })
        .catch(error => {
            ivsAlert('اشکال در برقراری ارتباط با سرور - خطا در اجرا جلسات اصلی', 'خطا', 'error');
            console.error(error);
        });

    return data;

}

async function checkRoomAvailablity() {

    let data = await fetch("/api/Facility/FacilityRequestItemsReadyForPrimaryCommitteeSessionAsync?justNew=true")
        .then((response) => response.json())
        .then(data => {
            if (data.recordsTotal < 1) {

                return data.recordsTotal;
            }
        })
        .catch(error => {
            ivsAlert('اشکال در برقراری ارتباط با سرور - خطا در اجرا جلسات اصلی', 'خطا', 'error');
            console.error(error);
        });

    return data;

}

async function registerSesstion() {

    let getAttendeesAvailablity = await checkAttendeesAvailablity();
    let getkRoomAvailablity = await checkRoomAvailablity();



    var inviteUsers = [];
    var informantsUsers = [];
    var facilityList = [];

    inviteUsers = $("#inviteUserSesstion").val();
    informantsUsers = $("#InformantsSesstion").val();



    var countErrors = 0;

    if (inviteUsers.length < 1) {
        countErrors++;
        $(".inviteUser  .select2-selection--multiple ").addClass("errorInput");
        $(".inviteUser  .select2-selection--multiple ").removeClass("successInput");
        $("#errorMassageInviteUser").text("کاربران دعوت شده به جلسه را مشخص نمایید");
    }
    else {
        $(".inviteUser .select2-selection--multiple ").removeClass("errorInput");
        $(".inviteUser .select2-selection--multiple ").addClass("successInput");
        $("#errorMassageInviteUser").text("");
    }

    if (facilityRequestForSesstion.rows('.selected').count() < 1) {
        countErrors++;
        $("#errorMassageNoSelectFacility").text("لطفا تسهیلات (حداقل یک مورد) انتخاب نمایید");
        $("#facilityRequestForSesstion").addClass("errorTable");

    }
    else {
        $("#errorMassageNoSelectFacility").text("");
        $("#facilityRequestForSesstion").removeClass("errorTable");

    }

    if ($('#startTime').val() == "") {
        countErrors++;
        $("#startTimeErrorMassage").text("لطفا ساعت شروع جلسه را مشخص نمایید.");
        $("#startTime").addClass("errorInput");
        $("#startTime").removeClass("successInput");

    }
    else {
        $("#startTimeErrorMassage").text("");
        $("#startTime").removeClass("errorInput");
        $("#startTime").addClass("successInput");

    }

    if ($('#endTime').val() == "") {
        countErrors++;
        $("#endTimeErrorMassage").text("لطفا ساعت پایان جلسه را مشخص نمایید.");
        $("#endTime").addClass("errorInput");
        $("#endTime").removeClass("successInput");

    }
    else {
        $("#endTimeErrorMassage").text("");
        $("#endTime").removeClass("errorInput");
        $("#endTime").addClass("successInput");


    }

    let aeSesstionModalForm = document.getElementById('aeSesstionModalForm');
    if (!$("#aeSesstionModalForm").valid()) {
        countErrors++;
        aeSesstionModalForm.classList.add('was-validated');
    }


    if (countErrors > 0) {
        return;
    }



    var facility = facilityRequestForSesstion.rows({ selected: true }).data();

    $.each(facility, function (key, value) {
        facilityList.push(value.sUID);

    });


    var sesstionInfo = {
        sessionNo: $("#sessionNo").val(),
        sessionAgendaNo: $("#sessionAgendaNo").val(),
        sessionSubject: $("#titleSesstion").val(),
        date: moment($("#dateSesstion").val(), 'jYYYY/jM/jD').format('YYYY-M-D'),
        startTimeHour: $("#startTime").val(),
        endTimeHour: $("#endTime").val(),
        roomID: $('#roomSesstion').find(":selected").val(),
        //roomID: null,
        description: $("#desSesstion").val(),
        sessionTypeID: parseInt($("#sesstionTypeId").val()),

        outerAttendees: $("#otherInviteSesstion").val(),

        SessionInvitedUserIDs: [...inviteUsers],
        SessionInformedUserIDs: [...informantsUsers],
        SessionFacilityRequestSUIDs: [...facilityList]

    }



    loading('btnRegisterSesstion', true, true);


    $.ajax({
        type: "post",
        url: "/api/Session/Post",
        data: JSON.stringify(sesstionInfo),
        contentType: "application/json; charset=utf-8",
        success: async function (result) {

            loading('btnRegisterSesstion', false, true);
            $('#aeSesstionModal').modal('hide');

            ivsAlert2('success', ' پیام موفقیت', 'جلسه ثبت شد');
            getAgendaList(result, 'aEAgendaCard', 'agendaTable', sesstionInfo.date);

            //console.log({ result });
            $('#listAgendaModal').modal('show');
        },
        error: function (ex, cc, bb) {
            loading('btnRegisterSesstion', false, true);

            ivsAlert('اشکال در برقراری ارتباط با سرور -   بخش افزودن جلسه', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {


            try {

                if (document.getElementById('programCarable') != undefined) {
                    ProgramDataTable.ajax.reload();
                    childTable.ajax.reload();
                }
                if (document.getElementById('calendar2') != undefined) {
                    refreshSesstionManagment();
                }

            } catch (e) {

            }
        }
    });


}

