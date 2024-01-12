

async function showDetailsSesstion(sesstionId) {

    $.ajax({
        type: "get",
        url: "/api/Session/GetSessionByID?Id=" + sesstionId,
        success: async function (result) {
            if (result) {
                //console.log(result);
                //$('.nav-tabs a[href="#infoGeneralSesstionCard"]').tab('show');

                getSesstionGeneralInfo(result);
                //$('#detailsSesstionModal').modal('show')
            }
        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور - بخش نمایش جزییات یک جلسه ', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {

        }
    });

}


function getSesstionGeneralInfo(result) {
    $('#infoGeneralSesstionCard-body').html("");
    var getSesstionDate = getDateWithOutTime(result.startTime);

    var templateSesstionInfo = `
        <div class="col-12 p-1 border border-3 border-dark rounded">

            <h6 class="">
                نوع جلسه: ${result.sessionTypeID == 1 ? 'جلسه اصلی' : 'جلسه فرعی'}
            </h6>
            <hr/>
            <h6 class="">
                عنوان جلسه: ${result.sessionSubject}
            </h6>
        </div>

        <div class="col-md-6">
                 <ul class="list-group list-group-flush">
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             شماره جلسه
                         </h6>
                         <span class="text-secondary">${result.sessionNo}</span>
                     </li>
                     <li class=" list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             شماره دستور جلسه
                         </h6>
                         <span class="text-secondary">${result.sessionAgendaNo}</span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                           مکان جلسه
                         </h6>
                         <span class="text-secondary">${result.sessionRoomTitle}</span>
                     </li>
                 </ul>
            </div>

             <div class="col-md-6">
                 <ul class="list-group list-group-flush">
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             تاریخ جلسه
                         </h6>
                         <span class="text-secondary">${getPerianDate(result.startTime)}</span>
                     </li>
                     <li class=" list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                             ساعت شروع جلسه
                         </h6>
                         <span class="text-secondary">${getTimeWithOutDate(result.startTime)}</span>
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                         <h6 class="mb-0">
                           ساعت پایان جلسه
                         </h6>
                         <span class="text-secondary">${getTimeWithOutDate(result.endTime)}</span>
                     </li>
                 </ul>
            </div>
            <hr/>
            <div class="col-md-12">
                <ul class="list-group list-group-flush text-center rounded">
                    <li  class="list-group-item d-flex justify-content-between align-items-center flex-wrap ">
                         <h6 class="mb-0">
                             توضیحات جلسه: ${result.description}
                         </h6>
                     </li>
                </ul>
            </div>
            <hr/>

            <div class="col-12 table-responsive ">
                <h5>لیست تسهیلات حاضر در جلسه</h5>
                <br/>
                <table class=" table table-sm table-bordered table-striped  table-responsive " style=" width:100% !important">
                    <thead>
                        <tr>
                            <th>کد</th>
                            <th>مدت زمان برآوردی خريد / ساخت (ماه)	</th>
                            <th>هزينه برآوردی خريد/ساخت (ريال)	</th>
                            <th>وضعیت فرآیند</th>
                            <th>تاریخ پایان چرخه</th>
                            <th>نمایش جزییات تسهیلات</th>
                        </tr>
                    </thead>
                    <tbody id="dataFacilityTable">
                        `+ getdataFacilityTable(result.sessionFacilityRequest) + `
                    </tbody>
                </table>
            </div>
            <hr/>


            <div class="col-12 table-responsive ">
                <h5>لیست کاربران دعوت شده به جلسه</h5>
                <br/>
                <table class=" table table-sm table-bordered table-striped  table-responsive " style=" width:100% !important">
                    <thead>
                        <tr>
                            <th>نام و نام خانوادگی</th>
                            <th>کد ملی</th>
                            <th>نام کاربری</th>
                        </tr>
                    </thead>
                    <tbody id="dataInvitedUserTable">
                        `+ getdataInvitedUserTable(result.sessionInvitedUser) + `
                    </tbody>
                </table>
            </div>
            <hr/>

            <div>
                ${result.sessionInformedUser.length > 0 ? `
                    <div class="col-12  table-responsive">
                        <h5>لیست کاربران مطلع از جلسه</h5>
                        <br/>
                        <table class=" table table-sm table-bordered table-striped  table-responsive " style=" width:100% !important">
                            <thead>
                                <tr>
                                    <th>نام و نام خانوادگی</th>
                                    <th>کد ملی</th>
                                    <th>نام کاربری</th>
                                </tr>
                            </thead>
                            <tbody id="dataInvitedUserTable">
                                `+ getdataInformedUserTable(result.sessionInformedUser) + `
                            </tbody>
                        </table>
                    </div>
                    <hr/>
                    `: ""}
             </div>
            

            <div class="col-12 ">
                ${result.outerAttendees != "" ? `
                    <h5 class="mb-0">
                        لیست سایر مطلعین از جلسه:  ${result.outerAttendees}
                    </h5>                   
                `: ""}               
            </div>

    `;

    $('#infoGeneralSesstionCard-body').html(templateSesstionInfo);
}

function getdataFacilityTable(data) {
    var facilityTr = "";
    for (let f in data) {

        facilityTr += `
            <tr>
                <td>${data[f].code}</td>
                <td>${data[f].requiredTime}</td>
                <td>${PersianTools.addCommas(data[f].requiredBudget)}</td>
                <td>${setNameForNullValues(data[f].workflowCurrentStepTitle)}</td>
                <td>${getPerianDateTime(data[f].finalizationTime)}</td>
                <td><button class="btn btn-outline-primary" onclick="gotoFacilityInfo('${data[f].id}')">جزییات</button></td>
            </tr>
        `;
    }
    return facilityTr;
}

function getdataInvitedUserTable(data) {
    var invitedUserTr = "";

    for (let u in data) {

        invitedUserTr += `
            <tr>
                <td>${data[u].firstName}  ${data[u].lastName}</td>
                <td>${data[u].nationalCodeId}</td>
                <td>${data[u].userName}</td>
            </tr>
        `;
    }
    return invitedUserTr;
}

function getdataInformedUserTable(data) {
    var informedUserTr = "";
    for (let u in data) {
        informedUserTr += `
            <tr>
                <td>${data[u].firstName}  ${data[u].lastName}</td>
                <td>${data[u].nationalCodeId}</td>
                <td>${data[u].userName}</td>
            </tr>
        `;
    }
    return informedUserTr;
}

function gotoFacilityInfo(id) {

    window.location = "/FacilityRegistration/DetailsOfFacility?facilitySUID=" + id;
}