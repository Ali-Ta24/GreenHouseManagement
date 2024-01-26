(function ($) {
    $.fn.LightIntensitySensor = function (options) {
        var settings = $.extend({

            postLightIntensitySensorApiAddress: "/api/LightIntensitySensor/post",
            putApiAddress: "/api/LightIntensitySensor/put",
            deleteLightIntensitySensorApiAddress: "/api/LightIntensitySensor/Delete",
            AllItemsApiAddress: "/api/LightIntensitySensor/GetLightIntensitySensors",
            GetLightIntensitySensorIDApiAddress: "/api/LightIntensitySensor/GetLightIntensitySensorByID",

            GetAllGreenhouseHallByUserApiAddress: "/api/UserGreenhouseHall/GetAllGreenhouseHallByUser",
            hasTemplate: true
        }, options);

        var viewModel = undefined;
        var area = this;
        var LightIntensitySensorTableCartable;
        var SensorChanged;
        var cols = [

            { data: "lightIntensitySensorName", name: "LightIntensitySensorName", type: "html" },
            { data: "fullName", name: "FullName", type: "html" },
            { data: "hallName", name: "HallName", type: "html" },
            { data: "createdBy", name: "CreatedBy", type: "html" },
            { data: "lastModifiedBy", name: "LastModifiedBy", type: "html" },
            { data: "creationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
            { data: "lastModificationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
            { data: "lightIntensitySensorValue", name: "LightIntensitySensorValue", type: "html" },
            {
                data: "lastState", render: function (data, type, row) {
                    if (data == null) {
                        return "";
                    }
                    return moment(data, 'YYYY-M-D HH:mm:ss').locale('fa').format('YYYY/M/D-HH:mm:ss');
                }
            },
        ];

        var addtemplate = `<div class="row" id="addmodal">
                                <form id="formLightIntensitySensor" class="row g-3 needs-validation">

                                    <div class="col-6">
                                        <label class="form-label">شناسه سنسور</label>
                                        <input type="text" class="form-control" id="LightIntensitySensorName" placeholder="شناسه سنسور" required/>
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
                                                 dropdownParent: 'formLightIntensitySensor',
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
                getAllItems();
            }
        }
        $('.inputSearch').change(function () {

            LightIntensitySensorTableCartable.columns().search('');
            $('input.inputSearch').filter(function (a) {
                return $('input.inputSearch')[a].value.length > 0
            }).each(function (a, b) {
                columnindex = parseInt($("[name='" + b.dataset.name + "']")[0].dataset.columnIndex);
                LightIntensitySensorTableCartable.columns(columnindex).search(b.value);

            });
            LightIntensitySensorTableCartable.draw();

        });
        setTimeout(function () {
            LightIntensitySensorTableCartable.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = LightIntensitySensorTableCartable.rows({ selected: true }).data()[0];
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
                title: "افزودن سنسور نور",
            }).bind('shown.bs.modal', function () {
                $('.modal-dialog').css('max-width', '25%');
                $('.bootbox-close-button').css("display", "inline");
                $('.bootbox-close-button').addClass("btn-close");
                $('.bootbox-close-button').text("");
            });
            $("#submitBtn").click(function (e) {
                postLightIntensitySensor(e);
            });
        });

        area.find("[data-role-operation ='edit']").click(function () {
            let idRowSelect = LightIntensitySensorTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "get",
                url: settings.GetLightIntensitySensorIDApiAddress + "?Id=" + idRowSelect,
                contentType: 'application/json',
                success: function (result) {

                    var template = putTemplate(result);
                    bootbox.dialog({
                        message: template,
                        title: "ویرایش سنسور نور",
                    }).bind('shown.bs.modal', function () {
                        $('.modal-dialog').css('max-width', '25%');
                        $('.bootbox-close-button').css("display", "inline");
                        $('.bootbox-close-button').addClass("btn-close");
                        $('.bootbox-close-button').text("");
                    });
                    $('[data-model="up"]').click(function () {
                        $("#LightIntensitySensorValue").val((parseFloat($("#LightIntensitySensorValue").val()) + 1).toFixed(2));
                        SensorChanged = true;
                    });
                    $('[data-model="down"]').click(function () {
                        $("#LightIntensitySensorValue").val((parseFloat($("#LightIntensitySensorValue").val()) - 1).toFixed(2));
                        SensorChanged = true;
                    });
                    $("#editsubmitBtn").click(function (e) {
                        putLightIntensitySensor(e);
                    });
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور نور');
                }
            });
        });

        area.find("[data-role-remove]").click(function () {
            let idRowSelect = LightIntensitySensorTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "delete",
                url: settings.deleteLightIntensitySensorApiAddress + "?id=" + idRowSelect,
                contentType: 'application/json',
                success: function () {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور نور با موفقیت حذف شد.');
                    LightIntensitySensorTableCartable.rows().ajax.reload();
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور نور');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    LightIntensitySensorTableCartable.rows('.important').deselect();
                }
            });
        });

        function putLightIntensitySensor(click) {
            var editModal = {
                ID: LightIntensitySensorTableCartable.rows({ selected: true }).data()[0].id,
                LightIntensitySensorName: $("#LightIntensitySensorName").val(),
                GreenhouseHallID: $("#GreenhouseHallModalID").val(),
                LightIntensitySensorValue: $("#LightIntensitySensorValue").val(),
                SensorChanged: SensorChanged,
            }

            $.ajax({
                type: "put",
                url: settings.putApiAddress,
                data: JSON.stringify(editModal),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور نور با موفقیت تغییر یافت.');
                    LightIntensitySensorTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور نور');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    LightIntensitySensorTableCartable.rows('.important').deselect();
                }
            });
        }

        function putTemplate(result) {
            var editTemplateModal = `<div class="row" id="editmodal">
                                <form id="formLightIntensitySensorAdd" class="row g-3 needs-validation">

                                    <div class="col-6">
                                        <label class="form-label">شناسه سنسور</label>
                                        <input type="text" class="form-control" id="LightIntensitySensorName" value="${result.lightIntensitySensorName == null ? "" : result.lightIntensitySensorName}"/>
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
                                                 dropdownParent: 'formLightIntensitySensorAdd',
                                                 title: 'نام سالن',
                                                 defaultValue: [${result.greenhouseHallID}],
                                                 isRequire: true
                                             });
                                    </script>

                                  <div id="counter-app" class="d-flex align-items-center">
                                       <label class="form-label" style="margin: 12px;">رطوبت سنسور</label>
                                       <iconify-icon icon="octicon:feed-plus-16" style="color: green; cursor:pointer;" width="35" height="35" data-model="up"></iconify-icon>
                                       <input type="text" class="form-control text-center mx-2" style="width: 70px !important;" id="LightIntensitySensorValue" value="${result.lightIntensitySensorValue == null ? 0 : result.lightIntensitySensorValue}">
                                       <iconify-icon icon="mingcute:minus-circle-fill" style="color: red; cursor:pointer;" width="40" height="40" data-model="down"></iconify-icon>
                                   </div>
                                </form>
                            </div>


                            <div class="modal-footer">
                                <div class="btn btn-success" id="editsubmitBtn">ثبت</div>
                                <div class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">لغو</div>
                            </div>`;
            return editTemplateModal;
        }

        function postLightIntensitySensor(click) {
            var addModal = {
                LightIntensitySensorName: $("#LightIntensitySensorName").val(),
                GreenhouseHallID: $("#GreenhouseHallModalID").val(),
            }
            $.ajax({
                type: "post",
                url: settings.postLightIntensitySensorApiAddress,
                data: JSON.stringify(addModal),
                contentType: "application/json; charset=utf-8",

                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور نور با موفقیت ثبت شد.');
                    LightIntensitySensorTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور نور');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    LightIntensitySensorTableCartable.rows('.important').deselect();
                }
            });
        }

        function getAllItems() {
            var areaCartable = area.find("#cartable");
            $.ajax({
                type: "get",
                url: settings.GetAllGreenhouseHallByUserApiAddress,
                contentType: 'application/json',
                success: function (result) {
                    console.log(result);
                    if (result == null || result == undefined || result.length == 0) {
                        ivsAlert2('warning', 'اخطار', 'ابتدا باید حداقل یک سالن اضافه کنید');
                    }
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور رطوبت');
                }
            });
            LightIntensitySensorTableCartable = areaCartable.DataTable({
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
                scrollX: true,
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
                            <div class="card-body" id="lightIntensitySensorTab">
                                <h4 class="mb-0">کنترل سنسور نور</h4>
                                <hr>
                                <nav class="navbar navbar-expand-lg navbar-dark rounded p-2 mb-2" style="background-color: rgb(255, 209, 26);">
                                    <div class="sticky">
                                        <button type="button" class="btn btn-success text-dark" data-role-operation="add" alt="افزودن سنسور نور"><i class="bx bx-message-square-add"></i>افزودن سنسور نور</button>
                                        <button type="button" class="btn btn-info d-none ms-2" data-role-operation="edit"><i class="bx bx-message-square-edit"></i>ویرایش سنسور نور</button>
                                        <button type="button" class="btn btn-danger text-dark d-none ms-2" data-role-remove><i class="bx bx-comment-minus"></i>حذف سنسور نور</button>
                                        <button class="btn btn-light ms-2" href="#headerfilters" data-bs-toggle="collapse" data-toggle="collapse" title="جستجو"><i class='bx bx-search'></i>جستجو</button>
                                    </div>
                                    <hr>
                                </nav>
                                <div>
                                    <table id="cartable" class="table table-border" style="width:100%">
                                    <thead>
                                        <tr id="headerfilters" class="collapse">
                                            <th scope="col" class="cartablefilter" >
                                                <input type="text" placeholder="شناسه سنسور" class="inputSearch form-control" data-name="lightIntensitySensorName" />
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                                <input type="text" class="inputSearch form-control" placeholder="گلخانه دار" data-name="fullName" />
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
                                            <th scope="col" class="cartablefilter">
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                            </th>
                                        </tr>
                                        <tr>
                                            <th scope="col" name="lightIntensitySensorName"><b>شناسه سنسور</b></th>
                                            <th scope="col" name="fullName"><b>گلخانه دار</b></th>
                                            <th scope="col" name="hallName"><b>نام سالن</b></th>
                                            <th scope="col" name="createdBy"><b>ایجاد کننده</b></th>
                                            <th scope="col" name="lastModifiedBy"><b>آخرین ویرایش کننده</b></th>
                                            <th scope="col" name="creationTime"><b>زمان ایجاد</b></th>
                                            <th scope="col" name="lastModificationTime"><b>زمان ویرايش</b></th>
                                            <th scope="col" name="lightIntensitySensorValue"><b>رطوبت سنسور</b></th>
                                            <th scope="col" name="lastState"><b>زمان آخرین وضعیت ثبت شده</b></th>
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
