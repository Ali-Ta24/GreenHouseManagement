var jOld = jQuery.noConflict();
var calenderSesstion = '';
var listEvent = [];

createCalender();

function createCalender(today, tomarrow) {
    calenderSesstion = jOld('#calendar2').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'agendaWeek',
        defaultDate: Date.now(),
        slotEventOverlap: false,
        selectable: false,
        selectHelper: true,
        lang: 'fa',
        isJalaali: true,
        isRTL: true,
        editable: false,
        droppable: false,
        eventLimit: true,
        selectOverlap: true,
        events: listEvent,
        select: function (info) {
            //console.log(info);
        },
        selectMirror: true,
        //eventClick: function (info, data,info2) {
        //},
        eventRender: function (eventObj, element, view) {

            element.off('dblclick').on('dblclick', function () {
                showDetailsSesstionModal(eventObj.id, eventObj.start._i);
            });
        }

    });

    var sesstionlist = GetCalendarDateRange();

    calenderSesstion.on('click', '.fc-agendaDay-button', function (e) {
        GetCalendarDateRange();
    });
    calenderSesstion.on('click', '.fc-agendaWeek-button', function (e) {
        GetCalendarDateRange();

    });
    calenderSesstion.on('click', '.fc-month-button', function (e) {
        GetCalendarDateRange();

    });


    jOld(".fc-next-button").click(function (event) {
        GetCalendarDateRange();
    });


    jOld(".fc-prev-button").click(function (event) {
        GetCalendarDateRange();

    });

    jOld(".fc-today-button").click(function () {
        GetCalendarDateRange();

    });
}

async function GetCalendarDateRange() {
    var infoCalendar = jOld('#calendar2').fullCalendar('getView');

    var startDay = new Date(infoCalendar.intervalStart._d);


    var getYearStart = startDay.getFullYear();
    var getMonthStart = parseInt(startDay.getMonth()) + 1;
    var getDayStart = startDay.getDate();

    var endDay = new Date(infoCalendar.intervalEnd._d);

    var getYearEnd = endDay.getFullYear()
    var getMonthEnd = parseInt(endDay.getMonth()) + 1;
    var getDayEnd = endDay.getDate();

    var finalStart = getYearStart + '-' + getMonthStart + '-' + getDayStart;
    var finalEnd = getYearEnd + '-' + getMonthEnd + '-' + getDayEnd;

    var listSesstion = getSesstionList(finalStart, finalEnd);

    return listSesstion;
}


async function getSesstionList(today, tomarrow) {

    let data = await fetch("/api/Session/GetSessionsList?startDate=" + today + "&endDate=" + tomarrow)
        .then((response) => response.json())
        .then(data => {
            //console.log(data);
            listEvent = [];
            for (var i = 0; i < data.length; i++) {
                let obj = { id: data[i].id, title: data[i].title, start: data[i].start, end: data[i].end, color: data[i].color };
                listEvent.push(obj);
            }

            jOld('#calendar2').fullCalendar('removeEvents');
            jOld('#calendar2').fullCalendar('addEventSource', listEvent);
            //console.log(listEvent);

        })
        .catch(error => {
            ivsAlert('اشکال در برقراری ارتباط با سرور - خطا در گرفتن جلسات ', 'خطا', 'error');
            //console.error(error);
        });

    return data;

}

function refreshSesstionManagment() {
    //jOld('calendar2').fullCalendar('refresh');
    jOld('#calendar').fullCalendar('refetchEvents');
}

function showDetailsSesstionModal(sestionId, startTime) {


    $("#detailsSesstion").detailsSesstionPlugin({
        sesstionId: sestionId,
        startTime: startTime
    });

    $("#proceedings").ProceedingsPlugin({
        sesstionId: sestionId,
        startSesstion: startTime

    });

    $("#agendas").agendaPlugin({
        sesstionId: sestionId,
        startSesstion: startTime
    });

    $('.nav-tabs a[href="#infoGeneralSesstionCard"]').tab('show');

    $('#detailsSesstionModal').modal('show')

}

