(function ($) {
    $.fn.HumiditySensor = function (options) {
        var settings = $.extend({

            postHumiditySensorApiAddress: "/api/HumiditySensor/post",
            putOldFaciltyApiAddress: "/api/HumiditySensor/put",
            deleteHumiditySensorApiAddress: "/api/HumiditySensor/Delete",
            AllItemsApiAddress: "/api/HumiditySensor/GetHumiditySensors",
            GetHumiditySensorIDApiAddress: "/api/HumiditySensor/GetHumiditySensorByID",

            hasTemplate: true
        }, options);

        var viewModel = undefined;
        var area = this;

        var HumiditySensorTableCartable;
        var cols = [

            { data: "humiditySensorName", name: "HumiditySensorName", type: "html" },
            { data: "userName", name: "UserName", type: "html" },
            { data: "hallName", name: "HallName", type: "html" },
            { data: "createdBy", name: "CreatedBy", type: "html" },
            { data: "lastModifiedBy", name: "LastModifiedBy", type: "html" },
            { data: "creationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
            { data: "lastModificationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
        ];

        var addtemplate = `<div class="row" id="addmodal">
                                <form id="formHumiditySensor" class="row g-3 needs-validation">

                                    <div class="col-6">
                                        <label class="form-label">شناسه سنسور</label>
                                        <input type="text" class="form-control" id="HumiditySensorName" placeholder="شناسه سنسور" required/>
                                    </div>

                                    <div class="col-6">
                                        <div id="Greenhouse">
                                        </div>
                                    </div>
                                
                                 <script>
                                             $("#Greenhouse").drapdownPlugin({
                                                 apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                                                 valueOption: 'id',
                                                 textOption: 'hallName',
                                                 idTagName: 'GreenhouseHallModalID',
                                                 dropdownParent: 'formHumiditySensor',
                                                 title: 'نام سالن',
                                                 isRequire: true
                                             });
                                 </script>
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
                setTimeout(function () {
                    getAllItems();
                }, 1000);
            }
        }
        $('.inputSearch').change(function () {

            HumiditySensorTableCartable.columns().search('');
            $('input.inputSearch').filter(function (a) {
                return $('input.inputSearch')[a].value.length > 0
            }).each(function (a, b) {
                columnindex = parseInt($("[name='" + b.dataset.name + "']")[0].dataset.columnIndex);
                HumiditySensorTableCartable.columns(columnindex).search(b.value);

            });
            HumiditySensorTableCartable.draw();

        });
        setTimeout(function () {
            HumiditySensorTableCartable.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = HumiditySensorTableCartable.rows({ selected: true }).data()[0];
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
                title: "افزودن سنسور دما",
            }).bind('shown.bs.modal', function () {
                $('.modal-dialog').css('max-width', '25%');
                $('.bootbox-close-button').css("display", "inline");
                $('.bootbox-close-button').addClass("btn-close");
                $('.bootbox-close-button').text("");
            });
            $("#submitBtn").click(function (e) {
                postHumiditySensor(e);
            });
            $("#GreenhouseNav").drapdownPlugin({
                apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                valueOption: 'id',
                textOption: 'hallName',
                idTagName: 'GreenhouseHallNavID',
                dropdownParent: 'formHumiditySensor',
                isRequire: true
            });
        });

        area.find("[data-role-operation ='edit']").click(function () {
            $("#GreenhouseNav").drapdownPlugin({
                apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                valueOption: 'id',
                textOption: 'hallName',
                idTagName: 'GreenhouseHallNavID',
                dropdownParent: 'humiditySensorTab',
                isRequire: true
            });
            let idRowSelect = HumiditySensorTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "get",
                url: settings.GetHumiditySensorIDApiAddress + "?Id=" + idRowSelect,
                contentType: 'application/json',
                success: function (result) {

                    var template = putTemplateOldFacility(result);
                    bootbox.dialog({
                        message: template,
                        title: "ویرایش سنسور دما",
                    }).bind('shown.bs.modal', function () {
                        $('.modal-dialog').css('max-width', '25%');
                        $('.bootbox-close-button').css("display", "inline");
                        $('.bootbox-close-button').addClass("btn-close");
                        $('.bootbox-close-button').text("");
                    });
                    $("#editsubmitBtn").click(function (e) {
                        putHumiditySensor(e);
                    });
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                }
            });
        });

        area.find("[data-role-remove]").click(function () {
            let idRowSelect = HumiditySensorTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "delete",
                url: settings.deleteHumiditySensorApiAddress + "?id=" + idRowSelect,
                contentType: 'application/json',
                success: function () {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور دما با موفقیت حذف شد.');
                    HumiditySensorTableCartable.rows().ajax.reload();
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    HumiditySensorTableCartable.rows('.important').deselect();
                }
            });
            $("#GreenhouseNav").drapdownPlugin({
                apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                valueOption: 'id',
                textOption: 'hallName',
                idTagName: 'GreenhouseHallNavID',
                dropdownParent: 'humiditySensorTab',
                isRequire: true
            });
        });

        function putHumiditySensor(click) {
            var editModal = {
                ID: HumiditySensorTableCartable.rows({ selected: true }).data()[0].id,
                HumiditySensorName: $("#HumiditySensorName").val(),
                GreenhouseHallID: $("#GreenhouseHallModalID").val(),
            }

            $.ajax({
                type: "put",
                url: settings.putOldFaciltyApiAddress,
                data: JSON.stringify(editModal),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور دما با موفقیت تغییر یافت.');
                    HumiditySensorTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    HumiditySensorTableCartable.rows('.important').deselect();
                }
            });
        }

        function putTemplateOldFacility(result) {
            var editTemplateModal = `<div class="row" id="editmodal">
                                <form id="formHumiditySensorAdd" class="row g-3 needs-validation">

                                    <div class="col-6">
                                        <label class="form-label">شناسه سنسور</label>
                                        <input type="text" class="form-control" id="HumiditySensorName" value="${result.humiditySensorName == null ? "" : result.humiditySensorName}"/>
                                    </div>

                                    <div class="col-6">
                                        <div id="Greenhouse">
                                        </div>
                                    </div>

                                    <script>
                                    $("#Greenhouse").drapdownPlugin({
                                                 apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                                                 valueOption: 'id',
                                                 textOption: 'hallName',
                                                 idTagName: 'GreenhouseHallModalID',
                                                 dropdownParent: 'formHumiditySensorAdd',
                                                 title: 'نام سالن',
                                                 defaultValue: [${result.greenhouseHallID}],
                                                 isRequire: true
                                             });
                                    </script>

                                </form>
                            </div>


                            <div class="modal-footer">
                                <div class="btn btn-success" id="editsubmitBtn">ثبت</div>
                                <div class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">لغو</div>
                            </div>`;
            return editTemplateModal;
        }

        function postHumiditySensor(click) {
            var addModal = {
                HumiditySensorName: $("#HumiditySensorName").val(),
                GreenhouseHallID: $("#GreenhouseHallModalID").val(),
            }
            $.ajax({
                type: "post",
                url: settings.postHumiditySensorApiAddress,
                data: JSON.stringify(addModal),
                contentType: "application/json; charset=utf-8",

                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور دما با موفقیت ثبت شد.');
                    HumiditySensorTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    HumiditySensorTableCartable.rows('.important').deselect();
                }
            });
        }

        function getAllItems() {
            var areaCartable = area.find("#cartable");
            var GreenhouseHallID = area.find("#GreenhouseHallNavID").val();
            HumiditySensorTableCartable = areaCartable.DataTable({
                ajax:
                {
                    contentType: 'application/json',
                    url: settings.AllItemsApiAddress + "?GreenHouseID=" + GreenhouseHallID,
                    type: 'get',
                    dataType: "json",
                },
                destroy: true,
                colReorder: true,
                searchPanes: true,
                scrollX: true,
                select: true,
                serverSide: true,
                paging: true,
                dom: 'rt<"mt-2" l>p',
                paginationType: "numbers",
                serverMethod: 'post',
                columns: cols,
                language: {
                    url: '/lib/jQueryDatatable/fa.json'
                },

            });
        }

        function getTemplate() {
            var ss = `<div class="card">
                            <div class="card-body" id="humiditySensorTab">
                                <h4 class="mb-0">کنترل سنسور دما</h4>
                                <hr>
                                <nav class="navbar navbar-expand-lg navbar-dark bg-info rounded p-2 mb-2">
                                    <div class="sticky">
                                        <button type="button" class="btn btn-success text-dark" data-role-operation="add" alt="افزودن سنسور دما"><i class="bx bx-message-square-add"></i>افزودن سنسور دما</button>
                                        <button type="button" class="btn btn-warning d-none ms-2" data-role-operation="edit"><i class="bx bx-message-square-edit"></i>ویرایش سنسور دما</button>
                                        <button type="button" class="btn btn-danger text-dark d-none ms-2" data-role-remove><i class="bx bx-comment-minus"></i>حذف سنسور دما</button>
                                        <button class="btn btn-light ms-2" href="#headerfilters" data-bs-toggle="collapse" data-toggle="collapse" title="جستجو"><i class='bx bx-search'></i>جستجو</button>
                                        <span class="text-dark ms-3" style="font-size:17px">سالن</span>
                                        <button type="button" class="btn mb-2 mt-0 py-0" id="GreenhouseNav"></button>

                                    <script>
                                             $("#GreenhouseNav").drapdownPlugin({
                                                 apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                                                 valueOption: 'id',
                                                 textOption: 'hallName',
                                                 idTagName: 'GreenhouseHallNavID',
                                                 dropdownParent: 'humiditySensorTab',
                                                 isRequire: true
                                             });
                                    </script>
                                    </div>
                                    <hr>
                                </nav>
                                <div>
                                    <table id="cartable" class="table table-border" style="width:100%">
                                    <thead>
                                        <tr id="headerfilters" class="collapse">
                                            <th scope="col" class="cartablefilter" >
                                                <input type="text" placeholder="شناسه سنسور" class="inputSearch form-control" data-name="humiditySensorName" />
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                                <input type="text" class="inputSearch form-control" placeholder="گلخانه دار" data-name="userName" />
                                            </th>
                                            <th scope="col" class="cartablefilter"> 
                                                <input type="text" class="inputSearch form-control" placeholder="نام سالن" data-name="hallName" />
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
                                            <th scope="col" name="humiditySensorName"><b>شناسه سنسور</b></th>
                                            <th scope="col" name="userName"><b>گلخانه دار</b></th>
                                            <th scope="col" name="hallName"><b>نام سالن</b></th>
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
