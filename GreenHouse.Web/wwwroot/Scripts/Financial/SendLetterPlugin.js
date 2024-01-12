
(function ($) {

    $.fn.SendLetter = function (options) {
        var settings = $.extend({
            FacilityId: 0,
            letterType: 0,
            CheckPermitionTosend: "",
            permitions: {},
            rools:[]

        }, options);
        var area = this;
        var container = `<div class="card" style=" " id="LetterContainer">
    <h3 class="card-header ">
        تهیه نامه بانک
        
    </h3>
    <div class="card-body">
        <nav class="navbar navbar-expand-lg navbar-dark bg-warning rounded">
            <div class=" row row-cols-auto g-3" style="padding-right:1rem">

                <button class="menu-items btn btn-info me-2" id="btnAction"  >
                    <i class='bx bx-show'></i>
                    تولید و نمایش نامه بانک
                </button>
                <button class="menu-items btn btn-secondary me-2" id="btnprint"   style="display:none">
                    <i class='bx bxs-file-pdf'></i>
                    دریافت نسخه PDF
                </button>
                <div id="divSendbtn">
                    <button class="menu-items btn btn-success me-2" id="btnsend"  style="display:none;position: absolute;left: 5px;">
                        <i class='bx bx-envelope'></i>
                        ارسال نامه به بانک
                    </button>
                </div>
            </div>
        </nav>
        <br />
        <div class="card">
            <div class="card-body" id="letter">
            </div>
        </div>

    </div>
</div>`;
        area.html(container);

        area.find("#btnAction").click(function () {

            $.ajax({
                url: "/api/Cartable/GetLetterView/?id=" + settings.FacilityId + '&LetterType=' + settings.letterType,
                type: "GET",
                success: function (res) {
                    $('#letter').html(res);
                    $('#btnprint').css('display', '');
                    $('#btnsend').css('display', '');
                    $('#divSendbtn').css('display', '');

                }
            });

        });
        area.find("#btnprint").click(function () {
            window.open(`/api/Cartable/PrintLetterBank/?id=${settings.FacilityId}&Typeid=${settings.letterType}`);
        });
        
        let IsAccessSend = -1;
        $.each(settings.permitions, function (a, b) {
            if (settings.rools.indexOf(b.RoleName) != -1 && b.StateActionName === settings.CheckPermitionTosend) {
                IsAccessSend = 1;
            }
        });
        if (IsAccessSend === -1) {
            area.find('#divSendbtn').remove();
        }

        area.find("#btnsend").click(function () {
            loading('btnsend', true, true);
            $.ajax({
                url: `/api/Cartable/SendLetterToBank/?id=${settings.FacilityId}&Typeid=${settings.letterType}`,
                type: "GET",
                success: function (res) {
                    //bootbox.hideAll();
                    // ProgramDataTableCartable.ajax.reload();
                    ivsAlert2('success', "موفقیت", "نامه با موفقیت ارسال شد");
                    GetLetterInformation();
                },
                error: function (a, b, c) {
                    ivsAlert2('error', "خطا", "خطا در دریافت اطلاعات");
                    loading('btnsend', false, true);
                }

            });
        });
        GetLetterInformation();
        function GetLetterInformation() {

            loading('LetterContainer', true, false);
            $.ajax({
                url: `/api/Cartable/GetLetterInformation?facilityRequestId=${settings.FacilityId}&LetterTypeId=${settings.letterType}`,
                type: "GET",
                success: function (res) {
                    if (res.letterExist === true) {

                        area.find('#divSendbtn').html(`<span style="position: absolute;left: 5px;"> شماره نامه ایجاد شده : ${res.letterNumber}</span>`)
                        loading('LetterContainer', false, false);
                        area.find("#btnAction").click();
                    }
                    else {
                        loading('LetterContainer', false, false);
                    }

                }

            });
        }

        return this;
    }



})(jQuery);