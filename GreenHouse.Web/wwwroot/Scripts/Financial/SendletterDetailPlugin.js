var permitions = {};
(function ($) {

    $.fn.sendLetterDetailPlugin = function (options) {
        var settings = $.extend({
            facilityRequestId: null,

        }, options);
        permitions = settings.permitions;
        var area = this;

        const SyncPermition = checkPermition("ChangeCirculationLetter");;
        const showPermition = checkPermition("ViewCirculationLetter");

        if (settings.facilityRequestId == null || settings.facilityRequestId == undefined || settings.facilityRequestId == 0) {

            bootbox.alert("خطا در پارامترهای ورودی");
            throw "Object refrence null parameter name facilityRequestId ";
        }

        //if (showPermition === false) {

        //    bootbox.alert("خطا در پارامترهای ورودی");
        //    throw "CanNot Access to View Circulation Letter";
        //}
        let viewLetterGrid = `
            <div class="card">
<div class="card-header" style="background-color: blanchedalmond;">
<h5 class="mb-0">گردش نامه</h5>
</div>
    <div class="card-body">
        
        <div class="sticky" style="">
          <button id="Btnshow" type="button" class="btn btn-info d-none" ><i class="bx bxs-bank"></i>نمایش اطلاعات</button>            
            &emsp;<button id="BtnGethistory" type="button" class="btn btn-primary  d-none" ><i class='bx bxs-bookmarks'></i>روند جریان نامه</button>           
            &emsp;<button id="BtnSync" type="button" class="btn btn-warning  d-none"  ><i class='bx bx-sync'></i> همگام سازی با اتوماسیون اداری فرزین</button>
        </div>
        <hr>
        <div class="table-responsive">
            <table id="Lettertable" class="table table-striped table-responsive" style="width:100%">
            <thead>
                <tr>                   
                    <th>نوع نامه</th>
                    <th>شماره نامه</th>
                    <th>تاریخ ایجاد</th>
                    <th>پیوست</th>
                </tr>
            </thead>
            <tbody>
            </tbody>

        </table>
        </div>
    </div>
    </div>
            `;
        area.html(viewLetterGrid);

        var ProgramDataTableLetter = $('#Lettertable').DataTable({
            //serverSide: true, //make server side processing to true
            ajax:
            {
                contentType: 'application/json',
                url: '/api/SendLetterDetail/GetSendLetterDetail?FacilityRequestId=' + settings.facilityRequestId, //url of the Ajax source,i.e. web api method
            },
            searching: false,
            destroy: true,
            processing: true,
            orderCellsTop: true,
            select: true,
            info: true,
            serverSide: true,
            columns: [
                //{ data: "id", name: "id", type: "html" },
                { data: "letterTemplateName", name: "letterTemplateName", type: "html" },
                { data: "farzinLetterNo", name: "farzinLetterNo", type: "html" },
                { data: "createDatetime", name: "createDatetime", type: "html", render: function (data, type, row) { return getPerianDate(data) } },
                {
                    data: "attaches", name: "attaches", type: "html", render: function (data, type, row) {
                        var buttons = '';

                        $.each(data, function (a, b) {
                            buttons += `<a class="text-dark" style="margin-right: 20px;">
                                      <span class="badge rounded-pill badge-notification bg-danger">${b.count}</span> ${b.name}                   
                                </a>`;
                        });
                        return buttons;
                    }
                },
                /* ,*/

            ],
            paginationType: "full_numbers",
            language: {
                url: '/lib/jQueryDatatable/fa.json'
            },
        });//DataTable



        ProgramDataTableLetter.on('select', function (event, dt, type, indexes) {
            let valueRowSelectLetter = ProgramDataTableLetter.rows({ selected: true }).data()[0];

            if (valueRowSelectLetter != undefined) {
                $("#BtnSync").removeClass("d-none");
                $("#Btnshow").removeClass("d-none");
                $("#BtnGethistory").removeClass("d-none");

                event.stopPropagation();
            }

        }).on('deselect', function (event, dt, type, indexes) {
            $("#BtnSync").addClass("d-none");
            $("#Btnshow").addClass("d-none");
            $("#BtnGethistory").addClass("d-none");

        });


        area.find('#BtnSync').click(function () {

            let valueRowSelectLetter = ProgramDataTableLetter.rows({ selected: true }).data()[0];
            if (valueRowSelectLetter == null || valueRowSelectLetter == undefined) {
                bootbox.alert('ابتدا یک ردیف را انتخاب نمایید');
                return false;
            }
            bootbox.confirm('در صورت تایید پیوست ها مجدد از سیستم فرزین فراخوانی میشود آیا اطمینان دارید ؟', function (res) {
                if (res) {
                    loading('BtnSync', true, false);
                    $.ajax({
                        url: `/api/SendLetterDetail/SyncWithFarzin?FacilityRequestId=${settings.facilityRequestId}&LetteerId=${valueRowSelectLetter.id}`,
                        success: function () {
                            ProgramDataTableLetter.ajax.reload();
                            $.notify("عملیات با موفقیت انجام شد", "success");
                            loading('BtnSync', false, false);
                        },
                        error: function (a, b, c) {
                            ivsAlert2('error', "خطا", "خطا ");
                            loading('BtnSync', false, false);
                        }

                    });
                }

            }).init(function () {
                $('.modal-dialog').last().css('top', '200px');
            });



        });
        area.find('#Btnshow').click(function () {

            let valueRowSelectLetter = ProgramDataTableLetter.rows({ selected: true }).data()[0];
            if (valueRowSelectLetter == null || valueRowSelectLetter == undefined) {
                bootbox.alert('ابتدا یک ردیف را انتخاب نمایید');
                return false;
            }
            var menu = $(`<div></div>`);
            var view = $(`<div></div>`);
            menu.append(`<button class="nav-link " id="nav-letter-tab" data-bs-toggle="tab" data-bs-target="#nav-letter" type="button" role="tab" aria-controls="nav-letter" aria-selected="true">متن نامه</button>`);
            view.append(`<div class="tab-pane fade show " id="nav-letter" role="tabpanel" aria-labelledby="nav-letter-tab"><br/><br/>`
                + valueRowSelectLetter.letterHtml + `</div>`);
            if (valueRowSelectLetter.attaches.length > 0) {

                menu.append(`<button class="nav-link " id="nav-attach-tab" data-bs-toggle="tab" data-bs-target="#nav-attach" type="button" role="tab" aria-controls="nav-attach" aria-selected="true">پیوست</button>`);
                view.append(`<div class="tab-pane fade show " id="nav-attach" role="tabpanel" aria-labelledby="nav-attach-tab"><br/><br/>` +
                    getviewOfAttac(valueRowSelectLetter.id)
                    + `</div>`);

            }


            var xxx = '<nav><div class="nav nav-tabs nav-primary " id="nav-letters" role="tablist">' + menu.html() + '</div></nav>' +
                '<div class="tab-content" id="nav-letters-tabContent">' + view.html() + `</div>
                <div class="modal-footer">`

                + ` <button type="button" class="btn btn-danger" id="letter-nav-close">خروج</button> </div>`;


            var xx = bootbox.dialog({
                message: xxx,
                title: "گردش نامه  " + valueRowSelectLetter.farzinLetterNo

            });
            xx.bind('shown.bs.modal', function () {
                $('.modal-dialog').css('max-width', '90%');
                $('#nav-letters .nav-link')[0].click();
            });


            $('#letter-nav-close').click(function () {
                $('.bootbox-close-button').last().click();

            });

            function getviewOfAttac(id) {

                var result = '';
                $.ajax({
                    url: `/api/SendLetterDetail/GetFileAttachInLetter?LetteerId=${valueRowSelectLetter.id}`,
                    async: false,
                    success: function (res) {
                        //debugger;
                        var firstDiv = $('<div><div>');
                        // lop for distinct type for create headr 
                        $.each(jQuery.unique(res.map(a => a.typeName)), function (x, y) {
                            var secoundDiv = $(`<div ><div>`);

                            $.each(res.filter(a => a.typeName === y), function (a, d) {

                                var file = `<div class="list-inline d-flex customers-contacts ms-auto" style="margin-top: 5px;">
                        <a data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="دانلود فایل" href="/api/DMS/download/${d.fileId}" download class="list-inline-item cursor-pointer  btn-outline-success"><i class='bx bx-download'></i></a>
                    <a data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="نمایش فایل" onclick="showFileToWeb('/api/DMS/download/${d.fileId}', '${getNameTypeFile(d.fileNme)}' )" class="list-inline-item cursor-pointer btn-outline-info"><i class="bx bx-show-alt"></i></a>

                             <span style="margin-top: 6px;margin-right: 10px" title="${getPerianDateTime(d.createDate)}">${d.fileNme} </span></div>`
                                secoundDiv.append(file);
                            });
                            var t1 = $(`<div class="card"><div>`);
                            var t2 = $(`<div class="card-header" style="background-color: gainsboro;"><h4>${y}</h4></div>`);
                            var t3 = $(`<div class="card-body"></div>`);
                            t3.append(secoundDiv);
                            t1.append(t2);
                            t1.append(t3);

                            firstDiv.append(t1);


                        });
                        result = firstDiv.html();
                    },
                    error: function (a, b, c) {
                        ivsAlert2('error', "خطا", "خطا ");
                        loading('BtnSync', false, false);
                        result = '';
                    }
                });

                return result;

            }



        });

        area.find('#BtnGethistory').click(function () {
            let valueRowLetter = ProgramDataTableLetter.rows({ selected: true }).data()[0];
            loading('BtnGethistory', true, true);

            $.ajax({
                url: `/api/SendLetterDetail/GetCirculationLetter?FacilityRequestId=${settings.facilityRequestId}&LetteerId=${valueRowLetter.id}`,
                async: false,
                success: function (res) {
                    var template = "";
                    $.each(res, function (a, b) {
                        template += `
                         <div class="container right">
                        <div class="content">
                          <h4>سمت :${b.roleName}</h2><p>${b.reciveName} (${b.receiveDate})</p> 
                          <b style="color:green;">وضعیت :${b.responseAction}</b>
                        </div>
                      </div>`;

                    });

                    var templatemain = `
                     <link href="/css/timeline/farzintimeline.css" rel="stylesheet" />
                        <br/>
                    <div class="timeline">
                      ${template}
                    </div>
                        <br/>
                        <br/>
                            `;


                    bootbox.dialog({
                        title: `روند جریان نامه شماره ${valueRowLetter.farzinLetterNo}`,
                        message: templatemain,
                        size: "large",
                        buttons: {
                            cancel: {
                                label: 'بازگشت',
                                className: 'btn-danger'
                            }
                        },

                    }).init(function () {
                        $('.bootbox-close-button').last().css("display", "unset");
                        $('.bootbox-close-button').last().addClass("btn-close");
                        $('.bootbox-close-button').last().text("");
                    });
                    loading('BtnGethistory', false, true);
                },
                error: function (a, b, c) {
                    ivsAlert2('error', "خطا", "خطا ");
                    loading('BtnGethistory', false, true);

                }
            });
        });






        return this;
    }



})(jQuery);

$('#closeForm').click(function () {

    bootbox.hideAll();
});

