
var _registerProjectDataTable = registerProjectDataTable.rows({ selected: true }).data()[0];

var visitRecordGrid = $("#visitReportGrid").DataTable({
    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',
        url: '/api/VisitReportRecordType/GetVisitReportRecordType?FacilityrequestId=' + $('#visitreportview_Facilityid').val() + '&visitReportId=' + $('#visitreportId').val()
        , //url of the Ajax source,i.e. web api method
    },
    searching: false,
    select: false,
    info: false,
    sorting: false,
    paging: false,
    rowGroup: { dataSrc: "visitRecordTypeKindName" },

    columns: [

        { data: "visitRecordTypeKindName", name: "visitRecordTypeKindName", type: "html", visible: false },
        { data: "title", name: "title", type: "html", className: 'fixwidthCol' },
        { data: "value", name: "value", type: "html", },
        { data: "description", name: "description", type: "html", className: 'fixwidthCol' },
        {
            data: "id", name: "id", type: "html"
            , render: function (data, type, row) {

                return `  <button title="ثبت درصد پیشرفت" onclick="clickbtn(${data})" style="border:none;" class=" " type="button"><i style="color: green;" class='bx bx-task bx-md bx-green'></i></button>`
            }
        }


    ]

});//DataTable

visitRecordGrid.on('xhr', function (event, dt, type, indexes) {
    CreateFooter(type.data);

});

function CreateFooter(data) {
    var groups = [];
    $('#footergrid').html('');
    $('#footergrid').append(`<tr><td colspan="4" style="text-align: center;background-color: bisque;font-size: larger;font-weight: bold;">جمع بندی پیشرفت </td></tr>`);
    var PreviousFooter = '';
    $.each(data, function (a, b) {
        if (groups.map(a => a.id).indexOf(b.visitRecordTypeKindId) == -1) {
            groups.push({ id: b.visitRecordTypeKindId, text: b.visitRecordTypeKindName });
            //calculate Persentage
            let $sumdarsad = 0.00;
            var filterdata = data.filter(x => x.visitRecordTypeKindId === b.visitRecordTypeKindId && parseFloat(x.value) > 0);
            $.each(filterdata, function (x, y) {
                $sumdarsad += (y.value / 100) * (y.weight / 100);
            });

            $('#footergrid').append(`<tr><td>${b.visitRecordTypeKindName}</td><td class="footerData" colspan="3">% ${($sumdarsad * 100).toFixed(2)} درصد</td></tr>`);

            if (registerProjectDataTable.rows().data().length > 0) {
                if (parseInt($('#visitreportId').val()) == 0)
                    return false;

                let rowindex = 0;
                registerProjectDataTable
                    .rows(function (idx, data, node) {
                        if (data.id === parseInt($('#visitreportId').val())) {
                            currentrow = data;
                            rowindex = idx;
                            return true;
                        }
                        else {
                            return false;
                        }
                    }).data()[0];

                if (rowindex > 0)// درصورتی که اولین رکورد بود بپر بیرون
                {
                    var Previous_Record = registerProjectDataTable.rows(rowindex - 1).data()[0];

                    if (Previous_Record != undefined && Previous_Record.childs != null && Previous_Record.childs != undefined && Previous_Record.childs.length != 0) {

                        let filterKind = Previous_Record.childs.filter(x => x.kindid == b.visitRecordTypeKindId);
                        let $sumdarsad2 = 0;
                        $.each(filterKind, function (a1, b1) {
                            $sumdarsad2 += (b1.value / 100) * (b1.weight / 100);
                        });
                        PreviousFooter += `<tr><td>تغییر پیشرفت نسبت به بازدید قبل(${b.visitRecordTypeKindName})</td><td class="footerData" colspan="3">% ${((($sumdarsad * 100) - ($sumdarsad2 * 100))).toFixed(2)} درصد</td></tr>`;
                    }
                }

            }

        }
    });
    if (PreviousFooter != '') {
        $('#footergrid').append(PreviousFooter);
    }

}

function clickbtn(id) {
    var currentrow = {};
    rowindex = 0;
    visitRecordGrid
        .rows(function (idx, data, node) {
            if (data.id === id) {
                currentrow = data;
                rowindex = idx;
                return true;
            }
            else {
                return false;
            }
        }).data()[0];

    var views =

        bootbox.dialog({
            title: currentrow.title,
            message: $('#aeeditform').html(),
            buttons: {
                ok: {
                    label: "تایید",
                    className: 'btn-success',
                    callback: function () {

                        currentrow.value = $('#btn_value').val();
                        currentrow.description = $('#btn_Descript').val();

                        var data = {
                            "Description": currentrow.description,
                            "value": currentrow.value,
                            "ID": currentrow.id,
                            "VisitReportID": $('#visitreportId').val(),
                            "VisitReportRecordID": 0
                        }
                        if (currentrow.value > 100 || currentrow.value < 0) {
                            $('#btn_value').notify("مقدار وارد شده باید بین 0 تا 100 باشد");
                            return false;
                        }

                        if (currentrow.value < currentrow.lastvalue) {
                            $('#btn_value').notify(`مقدار وارد شده ${currentrow.value} از مقدار گزارش قبلی  ${currentrow.lastvalue} نباید کمتر باشد`);
                            return false;
                        }
                        if (currentrow.visitReportRecordID == null || currentrow.visitReportRecordID == 0) {
                            //insert
                            $.ajax({
                                url: "/api/VisitReport/PostVisitReportRecord",
                                type: "POST",
                                async: false,
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                success: function (res) {

                                    let val = parseInt(res);
                                    currentrow.visitReportRecordID = val;

                                    visitRecordGrid.row(rowindex).data(currentrow).draw();


                                }, error: function (ex, cc, bb) {

                                    loading('mainbtnsave', false, true);
                                    //debugger;
                                    //if(ex.)
                                    ivsAlert('اشکال در ثبت', 'خطا', 'error');
                                    //console.log(ex);
                                    //console.log(bb);

                                }

                            });
                        }
                        else {
                            let ProgramDataTableCartab = ProgramDataTableCartable.rows({ selected: true }).data()[0];
                            data.VisitReportRecordID = currentrow.visitReportRecordID;
                            //update
                            $.ajax({
                                url: "/api/VisitReport/PutVisitReportRecord?FacilityId=" + ProgramDataTableCartab.id,
                                type: "Put",
                                async: false,
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                success: function (res) {
                                    visitRecordGrid.row(rowindex).data(currentrow).draw();
                                    var Alldata = visitRecordGrid.rows().data();
                                    CreateFooter(Alldata);
                                }, error: function (ex, cc, bb) {

                                    loading('mainbtnsave', false, true);
                                    ivsAlert('اشکال در ثبت', 'خطا', 'error');
                                    //console.log(ex);
                                    //console.log(bb);

                                }

                            });
                        }


                    }
                }, cancel: {
                    label: "انصراف",
                    className: 'btn-danger',
                    callback: function () {
                        $('.modal-dialog').last().find('.bootbox-close-button').click();
                    }
                }


            }
        }).init(function () {
            setTimeout(function () {

                if (CheckisReadonly() == true) {
                    //$('#btn_value').prop('readonly', 'readonly');

                }
                $('#btn_value').val(currentrow.value);
                $('#btn_Descript').val(currentrow.description);

                $('#btn_value').focus();

            }, 500);
            var height = $('#visitReportGrid').css("height");
            $('.modal-dialog').last().css("top", "200px");
        });

}


$('#headerSave').click(function () {


    $.ajax({
        url: "/api/VisitReport/PostVisitReport",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(
            {
                "VisitLocation": $('#VisitLocation').val(),
                "VisitDate": shamsiTomiladi($('#VisitDate').val()),
                "Visitor": $('#Visitor').val(),
                "VisitorCompany": $('#VisitorCompany').val(),
                "FacilityRequestId": $('#visitreportview_Facilityid').val(),
                "DateOfEndProject": "",
                "CreatedBy": "User",
                "CreationTime": shamsiTomiladi($('#VisitDate').val()),
                "ID": $('#visitreportId').val()

            }),
        success: function (res) {
            $('#visitreportId').val(res);
            $('#headerSave').css('display', 'none');
            $('#headerVisitgrid').css("display", "");
            visitRecordGridReload();
            registerProjectDataTable.ajax.reload();
            readonlyitem();
        },
        error: function (ex, cc, bb) {

            loading('mainbtnsave', false, true);
            ivsAlert('اشکال در ثبت', 'خطا', 'error');
            //console.log(ex);
            //console.log(bb);

        },
    });

});

function visitRecordGridReload() {
    var url = '/api/VisitReportRecordType/GetVisitReportRecordType?FacilityrequestId=' + $('#visitreportview_Facilityid').val() + '&visitReportId=' + $('#visitreportId').val();
    visitRecordGrid.ajax.url(url);
    visitRecordGrid.rows().ajax.reload();
}

function CheckisReadonly() {

    let index = registerProjectDataTable.row({ selected: true }).index() + 1;
    let Count = registerProjectDataTable.rows().data().length;
    if (Count > index) {
        return true;
    }
    else { return false; }

}
