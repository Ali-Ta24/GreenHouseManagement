(function ($) {
    $.fn.TemperatureSensor = function (options) {
        var settings = $.extend({

            postTemperatureSensorApiAddress: "/api/TemperatureSensor/post",
            putApiAddress: "/api/TemperatureSensor/put",
            deleteTemperatureSensorApiAddress: "/api/TemperatureSensor/Delete",
            AllItemsApiAddress: "/api/TemperatureSensor/GetTemperatureSensors",
            GetTemperatureSensorIDApiAddress: "/api/TemperatureSensor/GetTemperatureSensorByID",

            hasTemplate: true
        }, options);

        var viewModel = undefined;
        var area = this;
        var HallID;
        var TemperatureSensorTableCartable;
        var SensorChanged;
        var cols = [

            { data: "temperatureSensorName", name: "TemperatureSensorName", type: "html" },
            { data: "userName", name: "UserName", type: "html" },
            { data: "hallName", name: "HallName", type: "html" },
            { data: "createdBy", name: "CreatedBy", type: "html" },
            { data: "lastModifiedBy", name: "LastModifiedBy", type: "html" },
            { data: "creationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
            { data: "lastModificationTime", render: function (data, type, row) { return moment(data, 'YYYY-M-D').locale('fa').format('YYYY/M/D'); } },
            { data: "temperatureValue", name: "TemperatureValue", type: "html" },
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
                                <form id="formTemperatureSensor" class="row g-3 needs-validation">

                                    <div class="col-6">
                                        <label class="form-label">شناسه سنسور</label>
                                        <input type="text" class="form-control" id="TemperatureSensorName" placeholder="شناسه سنسور" required/>
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
                                                 dropdownParent: 'formTemperatureSensor',
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
                    HallID = area.find("#GreenhouseHallNavID").val();
                }, 1000);
            }
        }
        $('.inputSearch').change(function () {

            TemperatureSensorTableCartable.columns().search('');
            $('input.inputSearch').filter(function (a) {
                return $('input.inputSearch')[a].value.length > 0
            }).each(function (a, b) {
                columnindex = parseInt($("[name='" + b.dataset.name + "']")[0].dataset.columnIndex);
                TemperatureSensorTableCartable.columns(columnindex).search(b.value);

            });
            TemperatureSensorTableCartable.draw();

        });
        setTimeout(function () {
            TemperatureSensorTableCartable.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = TemperatureSensorTableCartable.rows({ selected: true }).data()[0];
                $("[data-role-operation='edit']").removeClass("d-none");
                $('[data-role-remove]').removeClass("d-none");

            }).on('deselect', function (event, dt, type, indexes) {
                $("[data-role-operation='edit']").addClass("d-none");
                $('[data-role-remove]').addClass("d-none");
            });
        }, 1000);

        $('[role="textbox"]').on("mouseover", function () {
            if (area.find("#GreenhouseHallNavID").val() != HallID) {
                getAllItems();
                HallID = area.find("#GreenhouseHallNavID").val();
                TemperatureSensorTableCartable.rows().ajax.reload();

            }
        });

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
                postTemperatureSensor(e);
            });
            $("#GreenhouseNav").drapdownPlugin({
                apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                valueOption: 'id',
                textOption: 'hallName',
                idTagName: 'GreenhouseHallNavID',
                dropdownParent: 'temperatureSensorTab',
                isRequire: true
            });

            setTimeout(function () {
                $('[role="textbox"]').on("mouseover", function () {
                    if (area.find("#GreenhouseHallNavID").val() != HallID) {
                        getAllItems();
                        HallID = area.find("#GreenhouseHallNavID").val();
                    }
                });
            }, 1000);
        });

        area.find("[data-role-operation ='edit']").click(function () {
            let idRowSelect = TemperatureSensorTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "get",
                url: settings.GetTemperatureSensorIDApiAddress + "?Id=" + idRowSelect,
                contentType: 'application/json',
                success: function (result) {

                    var template = putTemplate(result);
                    bootbox.dialog({
                        message: template,
                        title: "ویرایش سنسور دما",
                    }).bind('shown.bs.modal', function () {
                        $('.modal-dialog').css('max-width', '25%');
                        $('.bootbox-close-button').css("display", "inline");
                        $('.bootbox-close-button').addClass("btn-close");
                        $('.bootbox-close-button').text("");
                    });
                    $('[data-model="up"]').click(function () {
                        $("#TemperatureValue").val((parseFloat($("#TemperatureValue").val()) + 1).toFixed(2));
                        SensorChanged = true;
                    });
                    $('[data-model="down"]').click(function () {
                        $("#TemperatureValue").val((parseFloat($("#TemperatureValue").val()) - 1).toFixed(2));
                        SensorChanged = true;
                    });
                    $("#editsubmitBtn").click(function (e) {
                        putTemperatureSensor(e);
                    });
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                }
            });
            $("#GreenhouseNav").drapdownPlugin({
                apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                valueOption: 'id',
                textOption: 'hallName',
                idTagName: 'GreenhouseHallNavID',
                dropdownParent: 'temperatureSensorTab',
                isRequire: true
            });
            setTimeout(function () {
                $('[role="textbox"]').on("mouseover", function () {
                    if (area.find("#GreenhouseHallNavID").val() != HallID) {
                        getAllItems();
                        HallID = area.find("#GreenhouseHallNavID").val();
                    }
                });
            }, 1000);
        });

        area.find("[data-role-remove]").click(function () {
            let idRowSelect = TemperatureSensorTableCartable.rows({ selected: true }).data()[0].id;
            $.ajax({
                type: "delete",
                url: settings.deleteTemperatureSensorApiAddress + "?id=" + idRowSelect,
                contentType: 'application/json',
                success: function () {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور دما با موفقیت حذف شد.');
                    TemperatureSensorTableCartable.rows().ajax.reload();
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    TemperatureSensorTableCartable.rows('.important').deselect();
                }
            });
            $("#GreenhouseNav").drapdownPlugin({
                apiAddress: '/api/UserGreenhouseHall/GetAllGreenhouseHallByUser',
                valueOption: 'id',
                textOption: 'hallName',
                idTagName: 'GreenhouseHallNavID',
                dropdownParent: 'temperatureSensorTab',
                isRequire: true
            });
            setTimeout(function () {
                $('[role="textbox"]').on("mouseover", function () {
                    if (area.find("#GreenhouseHallNavID").val() != HallID) {
                        getAllItems();
                        HallID = area.find("#GreenhouseHallNavID").val();
                    }
                });
            }, 1000);
        });

        function putTemperatureSensor(click) {
            var editModal = {
                ID: TemperatureSensorTableCartable.rows({ selected: true }).data()[0].id,
                TemperatureSensorName: $("#TemperatureSensorName").val(),
                GreenhouseHallID: $("#GreenhouseHallModalID").val(),
                TemperatureValue: $("#TemperatureValue").val(),
                SensorChanged: SensorChanged,
            }

            $.ajax({
                type: "put",
                url: settings.putApiAddress,
                data: JSON.stringify(editModal),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور دما با موفقیت تغییر یافت.');
                    TemperatureSensorTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    TemperatureSensorTableCartable.rows('.important').deselect();
                }
            });
        }

        function putTemplate(result) {
            var editTemplateModal = `<div class="row" id="editmodal">
                                <form id="formTemperatureSensorAdd" class="row g-3 needs-validation">

                                    <div class="col-6">
                                        <label class="form-label">شناسه سنسور</label>
                                        <input type="text" class="form-control" id="TemperatureSensorName" value="${result.temperatureSensorName == null ? "" : result.temperatureSensorName}"/>
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
                                                 dropdownParent: 'formTemperatureSensorAdd',
                                                 title: 'نام سالن',
                                                 defaultValue: [${result.greenhouseHallID}],
                                                 isRequire: true
                                             });
                                    </script>

                                   <div id="counter-app" class="d-flex align-items-center">
                                       <label class="form-label" style="margin: 12px;">دما سنسور</label>
                                       <iconify-icon icon="octicon:feed-plus-16" style="color: green; cursor:pointer;" width="35" height="35" data-model="up"></iconify-icon>
                                       <input type="text" class="form-control text-center mx-2" style="width: 70px !important;" id="TemperatureValue" value="${result.temperatureValue == null ? "" : result.temperatureValue}">
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

        function postTemperatureSensor(click) {
            var addModal = {
                TemperatureSensorName: $("#TemperatureSensorName").val(),
                GreenhouseHallID: $("#GreenhouseHallModalID").val(),
            }
            $.ajax({
                type: "post",
                url: settings.postTemperatureSensorApiAddress,
                data: JSON.stringify(addModal),
                contentType: "application/json; charset=utf-8",

                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'سنسور دما با موفقیت ثبت شد.');
                    TemperatureSensorTableCartable.rows().ajax.reload();
                    $("[aria-label='Close']").trigger('click');
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                },
                complete: function () {
                    $("[data-role-operation='edit']").addClass("d-none");
                    $('[data-role-remove]').addClass("d-none");
                    TemperatureSensorTableCartable.rows('.important').deselect();
                }
            });
        }

        function getAllItems() {
            var areaCartable = area.find("#cartable");
            var GreenhouseHallID = area.find("#GreenhouseHallNavID").val();
            if (GreenhouseHallID == undefined || GreenhouseHallID == null) {
                ivsAlert2('warning', 'اخطار', 'ابتدا باید حداقل یک سالن اضافه کنید');
                return;
            }
            TemperatureSensorTableCartable = areaCartable.DataTable({
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
                            <div class="card-body" id="temperatureSensorTab">
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
                                                 dropdownParent: 'temperatureSensorTab',
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
                                                <input type="text" placeholder="شناسه سنسور" class="inputSearch form-control" data-name="temperatureSensorName" />
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
                                            <th scope="col" class="cartablefilter">
                                            </th>
                                            <th scope="col" class="cartablefilter">
                                            </th>
                                        </tr>
                                        <tr>
                                            <th scope="col" name="temperatureSensorName"><b>شناسه سنسور</b></th>
                                            <th scope="col" name="userName"><b>گلخانه دار</b></th>
                                            <th scope="col" name="hallName"><b>نام سالن</b></th>
                                            <th scope="col" name="createdBy"><b>ایجاد کننده</b></th>
                                            <th scope="col" name="lastModifiedBy"><b>آخرین ویرایش کننده</b></th>
                                            <th scope="col" name="creationTime"><b>زمان ایجاد</b></th>
                                            <th scope="col" name="lastModificationTime"><b>زمان ویرايش</b></th>
                                            <th scope="col" name="temperatureValue"><b>دمای سنسور</b></th>
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
