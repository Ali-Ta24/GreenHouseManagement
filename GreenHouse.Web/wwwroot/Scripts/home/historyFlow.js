const queryStringValueID = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

var facilityId = queryStringValueID.id;
var numberField = 1;


var facilityCode = queryStringValueID.code;

if (facilityId != null && facilityCode != null) {
    loading('cardHistory', true, false);
    $.ajax({
        type: "get",
        url: "/api/Facility/GetFacilityFlowHistory?id=" + parseInt(facilityId),
        success: function (result) {
            //console.log(result);
            if (result.length > 0) {
                $("#codeFacility").text(facilityCode);
                result.forEach(item => {
                    //for (let i = 1; i <= item.length; i++) {
                    //    numberField = i;
                    //}
                    createFlowHistoryUi(item, numberField);
                    numberField++;

                })
            }
            else {
                $("#cardHistory").html(cardAlert("هیچگونه تاریخچه ای ثبت نشده است.", title = 'هشدار', status = 'warning', btnClose = false))
            }
            loading('cardHistory', false, false);
        },
        error: function (ex, cc, bb) {
            loading('cardHistory', false, false);
            ivsAlert('اشکال در برقراری ارتباط با سرور - دریافت تاریخچه تسهیلات', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);
        },
        complete: function (jqXHR) {
            loading('cardHistory', false, false);

        }
    });

}

function createFlowHistoryUi(data, numberField) {
    let templateUser = `
       <div class="row g-0">
        <div class="col-sm py-2">
            <div class="card border-primary shadow radius-15">
                <div class="card-body">
                    <div class="float-end text-primary small">`+ getPerianDateTime(data.stepEntranceDate) + `</div>
                    <h4 class="card-title text-primary">${data.stepTitle}</h4>
                    <p class="card-text">`+ setNameForNullValues(data.stepDescription) + `</p>
                    <hr />
                         <div>
                              <b>
                                 اجرای عملیات توسط کاربر:
                             </b>

                            <span style="color:green" id="FullName_${numberField}">

                             </span> 
                         </div>
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
    GetFullNameFromUserName(data.actionActorUserName, `FullName_${numberField}`);

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
                <span class="badge rounded-pill bg-light border" style="background-color:gray !important">&nbsp;</span>
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
        statusFacility(data, numberField)
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

function statusFacility(data, numberField) {
    var statusFacilityCard = ``;

    if (data.stepExitAction == 'Accept') {
        statusFacilityCard = `
          <div class="font-22 text-primary" style="color:green!important">
              تایید
              <i class="fadeIn animated bx bx-check"></i>
          </div>
         <hr />
         <div>
              <b>
                 اجرای عملیات توسط کاربر:
             </b>
        
             <span style="color:green" id="FullName_${numberField}">
                
             </span> 
         </div>
        `;
        GetFullNameFromUserName(data.actionActorUserName, `FullName_${numberField}`);

    }
    else if (data.stepExitAction == 'Reject') {
        statusFacilityCard = `
         <div class="font-22 text-primary" style="color:red!important">
             رد
             <i class="fadeIn animated bx bx-x"></i>
         </div>
        <hr />
         <div>
             <b>
                 توضیحات هنگام رد درخواست:
             </b>
             
          
             <br />
             <b>
                 اجرای عملیات توسط کاربر:
             </b>
             <span style="color:green" id="FullName_${numberField}">

             </span> 
         </div>
        `;
        GetFullNameFromUserName(data.actionActorUserName, `FullName_${numberField}`);

    }
    else if (data.stepExitAction == 'TurnBack') {
        statusFacilityCard = `
         <div class="font-22 text-primary" style="color:orange!important">
             بازگشت خورده
             <b>!</b>
         </div>
         <hr />
         <div>
             <b>
                 توضیحات هنگام بازگشت درخواست:
             </b>
              <br />
              <b>
                 اجرای عملیات توسط کاربر:
              </b>
               
              <span  style="color:green" id="FullName_${numberField}">
                     
              </span> 
         </div>
        `;
        GetFullNameFromUserName(data.actionActorUserName, `FullName_${numberField}`);
    }

    return statusFacilityCard;

    $("")
}

function GetFullNameFromUserName(userName, spanID) {
    $.ajax({
        type: "get",
        url: "/api/User/GetFullNameFromUserName?userName=" + userName,
        success: function (result) {
            if (result != null || result != undefined) {
                var SpanID = spanID;
                $('#' + SpanID).text(result.fullName);
            }

        },
        error: function (ex, cc, bb) {

        },
        complete: function (jqXHR) {

        }
    });
}



