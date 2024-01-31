// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

//type of myDate is date
function getPerianDate(myDate) {
    if (myDate != null)
        return moment(myDate, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');
    else
        return ''
}

function getPerianDateTime(myDate) {
    if (myDate != null)
        return moment(myDate, 'YYYY-MM-DD - hh:mm').locale('fa').format('YYYY/MM/DD - hh:mm');
    else
        return ''
}

function getDateEn(dateRequest) {



    var dd = String(dateRequest.getDate()).padStart(2, '0');
    var mm = String(dateRequest.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateRequest.getFullYear();

    dateRequest = yyyy + '-' + mm + '-' + dd;
    return dateRequest;
}

function serializeToJson(formid) {

    var serializer = $("#" + formid).serializeArray();
    var _string = '{';
    for (var ix in serializer) {
        var row = serializer[ix];

        _string += '"' + row.name + '":"' + row.value + '",';
    }
    var end = _string.length - 1;
    _string = _string.substr(0, end);
    _string += '}';

    return JSON.parse(_string);
}

//type of v is boolean
//true or false
function setValueBoolean(v) {
    var message = '';
    if (v == true) {
        message = 'بله';
    }
    else {
        message = 'خیر';
    }
    return message;
}

//v is data. data can number of string or ...
function setNameForNullValues(v) {
    if (v != null) {
        return v;
    }
    return '';
}

//code is string
function checkCodeMeli(code) {

    var L = code.length;

    if (L < 8 || parseInt(code, 10) == 0) return false;
    code = ('0000' + code).substr(L + 4 - 10);
    if (parseInt(code.substr(3, 6), 10) == 0) return false;
    var c = parseInt(code.substr(9, 1), 10);
    var s = 0;
    for (var i = 0; i < 9; i++)
        s += parseInt(code.substr(i, 1), 10) * (10 - i);
    s = s % 11;
    return (s < 2 && c == s) || (s >= 2 && c == (11 - s));
    return true;
}

function minutesToHours(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    //return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
    return [rhours, rminutes];
}

function getDateWithOutTime(v) {
    if (v != null) {
        var dateTime = v.split("T");
        return dateTime[0];
    }
    else return '';
}

function getTimeWithOutDate(v) {
    if (v != null) {
        var dateTime = v.split("T");
        return dateTime[1];
    }
    else return '';
}

//status, title ,msg  is require and type is string
//position: is string and have default value and ex value top right , top center,... 
//delay is number and have default value
//width is string  and have default value
function ivsAlert2(status, title, msg, position = "top right", delay = 5, width = "400") {
    var myIcon = "";
    if (status == 'primary') {
        myIcon = "bx bx-bookmark-heart";
    }
    else if (status == 'secondary') {
        icon = "<i class='bx bx-tag-alt'></i>";
    }
    else if (status == 'success') {
        myIcon = "bx bxs-check-circle";
    }
    else if (status == 'danger' || status == 'error') {
        myIcon = "bx bxs-message-square-x";
    }
    else if (status == 'warning') {
        myIcon = "bx bx-info-circle";
    }
    else if (status == 'info') {
        myIcon = "bx bx-info-square";
    }
    else if (status == 'dark') {
        myIcon = "bx bx-bell";
    }
    else {
        console.log('نوع  cardAlert درست مشخص نشده است')
        return;
    }

    Lobibox.notify(status, {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: position,
        icon: myIcon,
        width: width,
        title: title,
        delay: `${delay}e3`,
        //img: 'assets/plugins/notifications/img/4.jpg',
        msg: msg
    });
}

//idForm is string 
function resetForm(idForm) {
    document.getElementById(idForm).reset();
}
function getMoneyWithOutkama(value) {
    var ca = value.split(",");
    var temp = '';
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        temp += c;
    }
    temp = parseInt(temp);
    return temp;
}

//title: type string and require
// msg: type string , option
//typeAlert: type string , option => primary, secondary, success, danger, warning, info, dark
//btnClose=> type boolean , option => true, flase
function cardAlert(msg, title = 'پیغام', status = 'success', btnClose = false) {
    var setType = {};
    if (status == 'primary') {
        setType = { icon: "<i class='bx bx-bookmark-heart'>", class: 'alert-primary bg-primary ', textColor: 'text-white' }
    }
    else if (status == 'secondary') {
        setType = { icon: "<i class='bx bx-tag-alt'></i>", class: 'alert-secondary bg-secondary', textColor: 'text-white' }
    }
    else if (status == 'success') {
        setType = { icon: "<i class='bx bxs-check-circle'></i>", class: 'alert-success bg-success', textColor: 'text-white' }
    }
    else if (status == 'danger' || status == 'error') {
        setType = { icon: "<i class='bx bxs-message-square-x'></i>", class: 'alert-danger bg-danger', textColor: 'text-white' }
    }
    else if (status == 'warning') {
        setType = { icon: "<i class='bx bx-info-circle'></i>", class: ' alert-warning bg-warning ', textColor: 'text-dark ' }
    }
    else if (status == 'info') {
        setType = { icon: "<i class='bx bx-info-square'></i>", class: 'alert-info bg-info', textColor: 'text-dark' }
    }
    else if (status == 'dark') {
        setType = { icon: "<i class='bx bx-bell'></i>", class: 'lert-dark bg-dark', textColor: 'text-white' }
    }
    else {
        console.log('نوع  cardAlert درست مشخص نشده است')
        return;
    }

    var btnCloseArea = '';
    if (btnClose == true) {
        btnCloseArea = `
        <button type="button" class="btn-close" data-bs-dismiss="alert"aria-label="Close"></button>
        `;
    }

    let card = `
        <div class="alert ${setType.class} border-0 alert-dismissible fade show py-2">
			<div class="d-flex align-items-center">
				<div class="font-35 ${setType.textColor} ">${setType.icon}
				</div>
				<div class="ms-3">
					<h5 class="mb-0 ${setType.textColor}">${title}</h5>
                   
					<div style="font-size:16px; margin-top:8px" class="${setType.textColor}">${msg}</div>
				</div>
			</div>
			${btnCloseArea}
		</div>

    `;

    return card;
}

//type: error(danger),info,success,warning
function ivsAlert(message, title, type) {
    //first reset
    $("#alertProvider_inner").removeClass("border-primary")
        .removeClass("border-secondary")
        .removeClass("border-success")
        .removeClass("border-danger")
        .removeClass("border-warning")
        .removeClass("border-info")
        .removeClass("border-dark");

    $("#alertProvider_title").removeClass("text-primary")
        .removeClass("text-secondary")
        .removeClass("text-success")
        .removeClass("text-danger")
        .removeClass("text-warning")
        .removeClass("text-info")
        .removeClass("text-dark");
    $("#alertProvider_title").html('');

    if (message) {
        document.getElementById("alertProvider_message").innerHTML = `<span>${message}</span>`;
    } else {
        $("#alertProvider_message").text("");
    }
    if (title) {
        $("#alertProvider_title").text(title);
    } else {
        $("#alertProvider_title").text("");
    }
    if (type && (type.toLowerCase() === "danger" || type.toLowerCase() === "error")) {
        $("#alertProvider_inner").addClass("border-danger");
        $("#alertProvider_title").addClass("text-danger");
        $("#alertProvider_title").html(`<i class="bx bxs-message-square-x"></i> ${title}`);
    } else
        if (type && type.toLowerCase() === "warning") {
            $("#alertProvider_inner").addClass("border-warning");
            $("#alertProvider_title").addClass("text-warning");
            $("#alertProvider_title").html(`<i class="bx bx-info-circle"></i> ${title}`);
        } else
            if (type && type.toLowerCase() === "success") {
                $("#alertProvider_inner").addClass("border-success");
                $("#alertProvider_title").addClass("text-success");
                $("#alertProvider_title").html(`<i class="bx bxs-check-circle"></i> ${title}`);
            } else
                if (type && type.toLowerCase() === "info") {
                    $("#alertProvider_inner").addClass("border-info");
                    $("#alertProvider_title").addClass("text-info");
                    $("#alertProvider_title").html(`<i class="bx bx bx-info-square"></i>  ${title}`);
                } else {
                    $("#alertProvider_inner").addClass("border-primary");
                    $("#alertProvider_title").addClass("text-primary");
                    $("#alertProvider_title").html(`<i class="bx bx bx-bell"></i> ${title}`);
                }
    $(document).ready(function () {
        $("#alertProvider").modal('show');
    });
}

function showErrorServer(id, massage) {
    var cardMassage = `

        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <span>${massage}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
`;

    $(document).ready(function () {
        var el = document.getElementById(id);

        el.innerHTML = cardMassage;
    });


}

function showErrorServerWithOutClose(id, massage) {
    var cardMassage = `

        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <span>${massage}</span>
        </div>
`;

    $(document).ready(function () {
        var el = document.getElementById(id);

        el.innerHTML = cardMassage;
    });


}

// sleep time expects milliseconds
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



$.fn.modal = bootstrap.Modal.jQueryInterface
$.fn.modal.Constructor = bootstrap.Modal


var JalaliDate = {
    g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
};
JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
    j_y = parseInt(j_y);
    j_m = parseInt(j_m);
    j_d = parseInt(j_d);
    var jy = j_y - 979;
    var jm = j_m - 1;
    var jd = j_d - 1;

    var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
    for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

    j_day_no += jd;

    var g_day_no = j_day_no + 79;

    var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    g_day_no = g_day_no % 146097;

    var leap = true;
    if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
        g_day_no--;
        gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
        g_day_no = g_day_no % 36524;

        if (g_day_no >= 365) g_day_no++;
        else leap = false;
    }

    gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
    g_day_no %= 1461;

    if (g_day_no >= 366) {
        leap = false;

        g_day_no--;
        gy += parseInt(g_day_no / 365);
        g_day_no = g_day_no % 365;
    }

    for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
        g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
    var gm = i + 1;
    var gd = g_day_no + 1;

    gm = gm < 10 ? "0" + gm : gm;
    gd = gd < 10 ? "0" + gd : gd;

    return gy + "/" + gm + "/" + gd;
}

function shamsiTomiladi(date) {
    
    var dateSplitted = date.split("/");
    return JalaliDate.jalaliToGregorian(dateSplitted[0], dateSplitted[1], dateSplitted[2]);

}

function shamsiTomiladi2(date) {

    return moment.from(date, 'fa', 'YYYY/M/D HH:mm')
        .format('YYYY-M-D');

}

function shamsiTomiladi3(date) {
    
    var dateSplitted = date.split("/");
    return JalaliDate.jalaliToGregorian(dateSplitted[2], dateSplitted[0], dateSplitted[1]);

}

function shamsiTomiladi4(d) {   
    var date = new Date(d);


    var getYear= date.getFullYear()
    var getMonth = parseInt(date.getMonth()) + 1;
    var getDay = date.getDate();


    var final = getYear + '-' + getMonth + '-' + getDay;

    return final;

}


function compareDates(d1, d2) {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    //d1 Smaller d2
    if (date1 < date2) {
        return 1;
    }
    //d1 bigger d2
    else if (date1 > date2) {
        return -1;
    }
    //d1 equal d2
    else {
        return 0;
    }
}
// sample set oninput="jsustnumber(this)"
function jsustNumber(val) {
    val.value = val.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0');
}

function showImage(fileAddress) {
    
    var viewer = ImageViewer(); //options is optional parameter
    viewer.show(fileAddress); //second paramter is optional
}

function showPdf(fileAddress) {
    window.open(
        "/General/ViewPDF?url=" + fileAddress,
        '_blank' // <- This is what makes it open in a new window.
    );
}

function showFileToWeb(fileAddress,type) {
    
    if (type == "pdf") {
        showPdf(fileAddress);
    }
    else if (type == "jpg" || type == "jpeg" || type == "gif" || type == "tif" ) {
        showImage(fileAddress);
    }
    else {
        alert("نوع فایل نادرست است")
    }

}
