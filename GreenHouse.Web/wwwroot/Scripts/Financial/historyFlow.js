
var facilityId = $('#facilityId').val();
var facilityCode = $('#facilityCode').val();
var allData = [];
if (facilityId != null && facilityCode != null) {

    loading('cardHistory', true, false);
    $.ajax({
        type: "get",
        async: false,
        url: "/api/Facility/GetFacilityFlowHistory?id=" + parseInt(facilityId),
        success: function (result) {

            $.each(result, function (a, b) {
                allData.push(b);
            });
        },
        error: function (ex, cc, bb) {

            ivsAlert('اشکال در برقراری ارتباط با سرور - ای دی تسهیلات وارد شده معتبر نیست', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        }
    });

    $.ajax({
        type: "get",
        async: false,
        url: "/api/Cartable/GetFacilityFlowHistory?id=" + parseInt(facilityId) + "&code=" + facilityCode,
        success: function (result) {

            $.each(result, function (a, b) {
                allData.push(b);
            });

        },
        error: function (ex, cc, bb) {
            ivsAlert('اشکال در برقراری ارتباط با سرور - ای دی تسهیلات وارد شده معتبر نیست', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            loading('cardHistory', false, false);
        }
    });

    $("#codeFacility").text(facilityCode);

    allData.forEach(item => {
        createFlowHistoryUi(item);
    });


}

function createFlowHistoryUi(data) {
    let templateUser = `
       <div class="row g-0">
        <div class="col-sm py-2">
            <div class="card border-primary shadow radius-15">
                <div class="card-body">
                    <div class="float-end text-primary small">`+ getPerianDateTime(data.stepEntranceDate) + `</div>
                    <h4 class="card-title text-primary">${data.stepTitle}</h4>
                    <p class="card-text">`+ setNameForNullValues(data.stepDescription) + `</p>

                </div>
            </div>
        </div>
        <div class="col-sm-1 text-center flex-column d-none d-sm-flex">
            <div class="row h-50">
                <div class="col ${data.historyType == 1 ? '' : 'border-end'}">&nbsp;</div>
                <div class="col">&nbsp;</div>
            </div>
            <h5 class="m-2">
                <span class="badge rounded-pill bg-primary" style="background-color:${data.historyType == 1 ? 'green !important' : 'blue !important'}">&nbsp;</span>
            </h5>
            <div class="row h-50">
                <div class="col border-end">&nbsp;</div>
                <div class="col">&nbsp;</div>
            </div>
        </div>
        <div class="col-sm">
            <!--spacer-->
        </div>
    </div>
     `;

    let templateAdmin = `
           <div class="row g-0">
        <div class="col-sm">
            <!--spacer-->
        </div>
        <!-- timeline item 1 center dot -->
        <div class="col-sm-1 text-center flex-column d-none d-sm-flex">
            <div class="row h-50">
                <div class="col border-end">&nbsp;</div>
                <div class="col">&nbsp;</div>
            </div>
            <h5 class="m-2">
                <span class="badge rounded-pill bg-light border" style="background-color:#e7d7d7 !important">
                ${statusIcon(data)}
               
            </span> ${statusFacility(data)}
            </h5>
            <div class="row h-50">
                <div class="col border-end">&nbsp;</div>
                <div class="col">&nbsp;</div>
            </div>
        </div>
        <!-- timeline item 1 event content -->
        <div class="col-sm py-2">
            <div class="card radius-15">
                <div class="card-body">
                    <div class="float-end text-muted small">`+ getPerianDateTime(data.stepEntranceDate) + `</div>
                    <h4 class="card-title text-muted">${data.stepTitle}</h4>
                    <p class="card-text">`+ setNameForNullValues(data.stepDescription) + `</p>` +
        //statusFacility(data)
        statusFacilityDescription(data)
        + `
                </div>
            </div>
        </div>
    </div>
     `;

    var cards = document.getElementById('cards');
    if (data.historyType == 1 || data.historyType == 2 || data.historyType == 3) {
        if (cards != undefined) {
            cards.innerHTML += templateUser;
        }
    }
    else if (data.historyType == 10 || data.historyType == 11 || data.historyType == 100) {
        if (cards != undefined) {
            cards.innerHTML += templateAdmin;
        }
    }


}

function statusFacility(data) {
    var statusFacilityCard = ``;

    if (data.stepExitAction == 'Accept') {
        statusFacilityCard = `<span style="color:green">تایید</span>`;

    }
    else if (data.stepExitAction == 'Reject') {
        statusFacilityCard = `<span style="color:red">رد</span>`;

    }
    else if (data.stepExitAction == 'TurnBack') {
        statusFacilityCard = `</br><span style="color:red">بازگشت</span>`;
    }
    else if (data.stepExitAction == 'End') {
        statusFacilityCard = `<span style="color:green">پایان</span>`;
    }
    else {
        statusFacilityCard = `<span style="color:#001fff;white-space: nowrap;">در انتظار </span>`;
    }

    return statusFacilityCard;
}

function statusIcon(data) {
    var statusFacilityCard = ``;

    if (data.stepExitAction == 'Accept' || data.stepExitAction == 'End') {
        statusFacilityCard = ` <i class="fadeIn animated bx bx-check bx-md" style="color:green"></i>`;

    }
    else if (data.stepExitAction == 'Reject') {
        statusFacilityCard = ` <i class="fadeIn animated bx bx-x bx-md" style="color:red"></i>`;

    }
    else if (data.stepExitAction == 'TurnBack') {
        statusFacilityCard = ` <i class="fadeIn animated bx bx-undo bx-md" style="color:red"></i>`;
    }

    else {
        statusFacilityCard = ` <i class="fadeIn animated bx bx-question-mark bx-md" style="color:#001fff;"></i>`;
    }

    return statusFacilityCard;
}

function statusFacilityDescription(data) {
    var statusFacilityCard = ``;

    if (data.stepExitAction == 'Accept') {
        statusFacilityCard = `
           
             ${data.stepExitDescription != null && data.stepExitDescription != "" ? `<hr /><div>
             <b style="font-size: initial;">
                 توضیحات :
             </b>
             
             ${data.stepExitDescription}
         </div>`: ""}
          
        `;
    }
    else if (data.stepExitAction == 'Reject') {
        statusFacilityCard = `
          
        <hr />
         <div>
             <b>
               توضیحات هنگام بازگشت درخواست:
             </b>
             
             ${data.stepExitDescription}
         </div>
        `;
    }
    else if (data.stepExitAction == 'TurnBack') {
        statusFacilityCard = `
        
        <hr />
         <div>
             <b>
                 توضیحات هنگام بازگشت درخواست:
             </b>
            
             ${data.stepExitDescription}
         </div>
        `;
    }

    return statusFacilityCard;
}

