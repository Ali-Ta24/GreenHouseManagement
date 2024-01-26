(function ($) {
    $.fn.GreenHouseHall = function (options) {
        var settings = $.extend({

            postGreenHouseHallApiAddress: "/api/UserGreenhouseHall/post",
            putApiAddress: "/api/UserGreenhouseHall/put",
            deleteGreenHouseHallApiAddress: "/api/UserGreenhouseHall/Delete",
            AllItemsApiAddress: "/api/UserGreenhouseHall/GetGreenHouseHalls",
            GetGreenHouseHallIDApiAddress: "/api/UserGreenhouseHall/GetGreenHouseHallByID",

            hasTemplate: true
        }, options);

        var viewModel = undefined;
        var area = this;
        var GreenHouseHallTableCartable;
        var SensorChanged;
        var cols = [

            { data: "hallName", name: "HallName", type: "html" },
            { data: "fullName", name: "FullName", type: "html" },
            { data: "createdBy", name: "CreatedBy", type: "html" },
            { data: "lastModifiedBy", name: "LastModifiedBy", type: "html" },
            { data: "creationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
            { data: "lastModificationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
        ];

        var addtemplate = `<div class="row" id="addmodal">
                                <form id="formGreenHouseHall" class="row g-3 needs-validation">

                                    <div class="col-12">
                                        <label class="form-label">نام سالن</label>
                                        <input type="text" class="form-control" id="GreenHouseHallName" placeholder="نام سالن" required/>
                                    </div>
                                    
                                </form>
                            </div>

                            <div class="modal-footer">
                                <div class="btn btn-success" id="submitBtn">ثبت</div>
                                <div class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">لغو</div>
                            </div>`;

        buildInterface();

        function buildInterface() {
            if (settings.hasTemplate) {
                area.html(getTemplate());
                getAllItems();
            }
        }
        $('.inputSearch').change(function () {

            GreenHouseHallTableCartable.columns().search('');
            $('input.inputSearch').filter(function (a) {
                return $('input.inputSearch')[a].value.length > 0
            }).each(function (a, b) {
                columnindex = parseInt($("[name='" + b.dataset.name + "']")[0].dataset.columnIndex);
                GreenHouseHallTableCartable.columns(columnindex).search(b.value);

            });
            GreenHouseHallTableCartable.draw();

        });
        setTimeout(function () {
            GreenHouseHallTableCartable.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = GreenHouseHallTableCartable.rows({ selected: true }).data()[0];
                $("[data-role-operation='edit']").removeClass("d-none");
                $('[data-role-remove]').removeClass("d-none");

            }).on('deselect', function (event, dt, type, indexes) {
                $("[data-role-operation='edit']").addClass("d-none");
                $('[data-role-remove]').addClass("d-none");
            });
        }, 1000);

        area.find("[data-role-operation ='add']").click(function () {
            bootbox.dialog({
                message: addtemplate,
                title: "افزودن سالن گلخانه",
            }).bind('shown.bs.modal', function () {
                $('.modal-dialog').css('max-width', '25%');
                $('.bootbox-close-button').css("display", "inline");
                $('.bootbox-close-button').addClass("btn-close");
                $('.bootbox-close-button').text("");
            });
            $("#submitBtn").click(function (e) {
                postGreenHouseHall(e);
            });
        });

        area.find("[data-role-operation ='edit']").click(function () {
            let idRowSelect = GreenHouseHallTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "get",
                url: settings.GetGreenHouseHallIDApiAddress + "?Id=" + idRowSelect,
                contentType: 'application/json',
                success: function (result) {

                    var template = putTemplate(result);
                    bootbox.dialog({
                        message: template,
                        title: "ویرایش سالن گلخانه",
                    }).bind('shown.bs.modal', function () {
                        $('.modal-dialog').css('max-width', '25%');
                        $('.bootbox-close-button').css("display", "inline");
                        $('.bootbox-close-button').addClass("btn-close");
                        $('.bootbox-close-button').text("");
                    });
                    $("#editsubmitBtn").click(function (e) {
                        putGreenHouseHall(e);
                    });
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سالن گلخانه');
                }
            });
        });

        area.find("[data-role-remove]").click(function () {
            let idRowSelect = GreenHouseHallTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "delete",
                url: settings.deleteGreenHouseHallApiAddress + "?id=" + idRowSelect,
                contentType: 'application/json',
                success: function () {
                    ivsAlert2('success', ' پیام موفقیت', 'سالن گلخانه با موفقیت حذف شد.');
                    GreenHouseHallTableCartable.rows().ajax.reload();
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سالن گلخانه');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    GreenHouseHallTableCartable.rows('.important').deselect();
                }
            });
        });

        function putGreenHouseHall(click) {
            var editModal = {
                ID: GreenHouseHallTableCartable.rows({ selected: true }).data()[0].id,
                HallName: $("#GreenHouseHallName").val(),
            }

            $.ajax({
                type: "put",
                url: settings.putApiAddress,
                data: JSON.stringify(editModal),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'سالن گلخانه با موفقیت تغییر یافت.');
                    GreenHouseHallTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سالن گلخانه');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    GreenHouseHallTableCartable.rows('.important').deselect();
                }
            });
        }

        function putTemplate(result) {
            var editTemplateModal = `<div class="row" id="editmodal">
                                <form id="formGreenHouseHallAdd" class="row g-3 needs-validation">

                                    <div class="col-12">
                                        <label class="form-label">نام سالن</label>
                                        <input type="text" class="form-control" id="GreenHouseHallName" value="${result.hallName == null ? "" : result.hallName}"/>
                                    </div>
                                   
                                </form>
                            </div>


                            <div class="modal-footer">
                                <div class="btn btn-success" id="editsubmitBtn">ثبت</div>
                                <div class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">لغو</div>
                            </div>`;
            return editTemplateModal;
        }

        function postGreenHouseHall(click) {
            var addModal = {
                HallName: $("#GreenHouseHallName").val(),
            }
            $.ajax({
                type: "post",
                url: settings.postGreenHouseHallApiAddress,
                data: JSON.stringify(addModal),
                contentType: "application/json; charset=utf-8",

                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'سالن گلخانه با موفقیت ثبت شد.');
                    GreenHouseHallTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سالن گلخانه');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    GreenHouseHallTableCartable.rows('.important').deselect();
                }
            });
        }

        function getAllItems() {
            var areaCartable = area.find("#cartable");
            GreenHouseHallTableCartable = areaCartable.DataTable({
                ajax:
                {
                    contentType: 'application/json',
                    url: settings.AllItemsApiAddress,
                    type: 'get',
                    dataType: "json",
                },
                destroy: true,
                colReorder: true,
                searchPanes: true,
                scrollX: false,
                select: true,
                serverSide: true,
                paging: true,
                dom: '<"mb-2 float-left" B>rt<"mt-2 float-right" l><"mt-2 float-left" p>',
                buttons: [
                    'excel',
                    'print'
                ],
                paginationType: "full_numbers",
                serverMethod: 'post',
                columns: cols,
                language: {
                    url: '/lib/jQueryDatatable/fa.json'
                },

            });
        }

        function getTemplate() {
            var ss = `<div class="card">
                            <div class="card-body" id="temperatureSensorTab">
                                <h4 class="mb-0">کنترل سالن گلخانه</h4>
                                <hr>
                                <nav class="navbar navbar-expand-lg navbar-dark rounded p-2 mb-2 bg-info">
                                    <div class="sticky">
                                        <button type="button" class="btn btn-success text-dark" data-role-operation="add" alt="افزودن سالن گلخانه"><i class="bx bx-message-square-add"></i>افزودن سالن گلخانه</button>
                                        <button type="button" class="btn btn-warning d-none ms-2" data-role-operation="edit"><i class="bx bx-message-square-edit"></i>ویرایش سالن گلخانه</button>
                                        <button type="button" class="btn btn-danger text-dark d-none ms-2" data-role-remove><i class="bx bx-comment-minus"></i>حذف سالن گلخانه</button>
                                        <button class="btn btn-light ms-2" href="#headerfilters" data-bs-toggle="collapse" data-toggle="collapse" title="جستجو"><i class='bx bx-search'></i>جستجو</button>
                                    </div>
                                    <hr>
                                </nav>
                                <div>
                                    <table id="cartable" class="table table-border" style="width:100%">
                                    <thead>
                                        <tr id="headerfilters" class="collapse">
                                            <th scope="col" class="cartablefilter"> 
                                                <input type="text" class="inputSearch form-control" placeholder="نام سالن" data-name="hallName" />
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                                <input type="text" class="inputSearch form-control" placeholder="گلخانه دار" data-name="fullName" />
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                                <input type="text" placeholder="ایجاد کننده" class="inputSearch form-control" data-name="createdBy" />
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                                <input type="text" placeholder="آخرین ویرایش کننده" class="inputSearch form-control" data-name="lastModifiedBy" />
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                            </th>
                                        </tr>
                                        <tr>
                                            <th scope="col" name="hallName"><b>نام سالن</b></th>
                                            <th scope="col" name="fullName"><b>گلخانه دار</b></th>
                                            <th scope="col" name="createdBy"><b>ایجاد کننده</b></th>
                                            <th scope="col" name="lastModifiedBy"><b>آخرین ویرایش کننده</b></th>
                                            <th scope="col" name="creationTime"><b>زمان ایجاد</b></th>
                                            <th scope="col" name="lastModificationTime"><b>زمان ویرايش</b></th>
                                        </tr>
                                    </thead>
                                    </table>

                                </div>
                            </div>
                        </div>

                        `;
            ss = minifyHtml(ss);
            return ss;
        }

        return this;
    }
}(jQuery));
