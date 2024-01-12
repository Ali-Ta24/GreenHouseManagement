(function ($) {
    $.fn.agendaPlugin = function (options) {
        var settings = $.extend({
            sesstionId: null,
            startSesstion: null,

            agendaTable: '',
            proceedingsTable: '',
            facilityProceedingTable: '',


            hasPermisstionAddProceedings: true,
            hasPermisstionEditProceedings: false,
            hasPermisstionRemoveProceedings: false,

            getAgendas: '/api/Agenda/GetAgendas',
            getAllActiveUser: '/api/User/GetAllActiveUser',
            deleteAgenda: '/api/Agenda/Delete',
            postAgenda: '/api/Agenda/Post',


            addTemplate: true,
        }, options);

        var viewModel = undefined;
        var area = this;



        buildInterface();

        function buildInterface() {

            if (settings.sesstionId == null) {
                area.find("#infoProceedingModal-body").html(cardAlert('ای دی جلسه یافت نشد', 'خطا', 'error'));
                return;
            }



            if (settings.addTemplate) {
                area.html(getTemplate());
            }

            getAgendas();

            area.find('#btn-removeAgenda').click(function () {
                confirmDeleteItem();
            });

            area.find('#typeUserResponseAgenda').change(async function (e) {
                var selectedVal = area.find('#typeUserResponseAgenda option:selected').val();
                //console.log(selectedVal);
                await setUserResponseAgenda(selectedVal);
            });

            area.find('#btn-addAgenda').click(function () {
                resetAgendaForm();
                aeAgendaModal();
            });

            area.find('#btn-close-aeAgendaModal').click(function () {
                area.find("#aeAgendaModal").modal("hide");
            });

            area.find('#btn-cancelAeAgendaModal').click(function () {
                area.find("#aeAgendaModal").modal("hide");
            });

            area.find('#btn-submitAgenda').click(function () {
                addAgenda()
            });
        }

        function getAgendas() {
            settings.agendaTable =
                area.find('#agendaTable').DataTable({
                    ajax:
                    {
                        contentType: 'application/json',
                        url: settings.getAgendas + "?sessionID=" + settings.sesstionId,
                    },
                    paging: false,
                    ordering: false,
                    info: false,
                    //processing: true,
                    colReorder: false,
                    searchPanes: false,
                    scrollX: false,
                    destroy: true,
                    select: true,
                    bFilter: false,
                    columns: [

                        { data: "title", name: "title", type: "html" },
                        { data: "description", name: "description", type: "html" },
                        { render: function (data, type, row) { return getResponsible(row) } },
                    ],

                });

            var sesstionDate = shamsiTomiladi4(settings.startSesstion);
            var dateNow = shamsiTomiladi4(Date.now());
            var resultCompareDates = compareDates(sesstionDate, dateNow);


            settings.agendaTable.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = settings.agendaTable.rows({ selected: true }).data()[0];

                if (valueRowSelect != undefined && resultCompareDates <= 0) {
                    if (valueRowSelect.responsibleUserID != null || valueRowSelect.responsible != null) {
                        area.find("#btn-removeAgenda").prop('hidden', false);
                    }

                    event.stopPropagation();
                }
            }).on('deselect', function (event, dt, type, indexes) {

                area.find("#btn-removeAgenda").prop('hidden', true);

            });

            if (resultCompareDates <= 0) {
                area.find("#btn-addAgenda").prop('hidden', false);
            }
            else {
                area.find("#btn-addAgenda").prop('hidden', true);
            }
        }

        function getResponsible(data) {

            if (data.responsibleUserID == null && data.responsible == null) {
                return 'نامشخص';
            }
            else if (data.responsibleUserID == null) {
                return data.responsible;
            }
            else if (data.responsible == null) {
                return data.responsibleUserID;
            }

        }

        function confirmDeleteItem() {
            let currentRow = settings.agendaTable.rows({ selected: true }).data()[0];
            bootbox.confirm({
                message: "آیا از حذف مورد انتخاب شده مطمئن هستید؟",
                buttons: {
                    confirm: {
                        label: 'بله',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'خیر',
                        className: 'btn-danger'
                    }
                },
                callback: async function (result) {
                    if (result == true) {
                        await deleteItem(currentRow.id)
                    }
                }
            });
        }

        function deleteItem(agendaId) {

            $.ajax({
                type: "delete",
                url: settings.deleteAgenda + "?id=" + agendaId,
                contentType: 'application/json',
                success: function (result) {
                    ivsAlert2('success', "موفقیت", "آیتم مورد نظر با موفقیت حذف شد");
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', "خطا", "خطا در حذف آتیم انتخاب شده ");
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {
                    settings.agendaTable.rows().deselect();
                    settings.agendaTable.ajax.reload();
                }
            });

        }

        function resetAgendaForm() {
            area.find("#userResponseCard").html("");
            resetForm('formAeAgenda');
        }

        async function aeAgendaModal() {
            area.find("#aeAgendaModal").modal("show");
        }

        async function setUserResponseAgenda(id) {
            area.find('#userResponseCard').html("");
            var userResponseCard = ``;
            if (id == 1) {

                await area.find("#userResponseCard").drapdownPlugin({
                    apiAddress: settings.getAllActiveUser,
                    valueOption: 'nationalCodeId',
                    textOption: 'lastName',
                    idTagName: 'fullNameInOrg',
                    title: 'نام مسئول درون سازمانی',
                    dropdownParent: 'aeAgendaModal',
                });
            }
            else if (id == 2) {
                userResponseCard = `
                    <label for="fullNameOutOrg" class="form-label"> نام مسئول خارج از سازمان </label>
                    <input type="text" class="form-control"  tabindex="1" id="fullNameOutOrg"  name="fullNameOutOrg"/>`;
                area.find('#userResponseCard').html(userResponseCard);
            }

        }

        function addAgenda() {

            if (area.find("#agendaTitle").val() == "") {
                ivsAlert2('error', ' پیام خطا', 'ابتدا عنوان را مشخص کنید');
                return;
            }

            var modelAgenda = {};

            if (parseInt(area.find("#typeUserResponseAgenda").val()) == 1) {
                modelAgenda = {
                    sessionID: settings.sesstionId,
                    responsibleUserID: area.find("#fullNameInOrg").val(),
                    title: area.find("#agendaTitle").val(),
                    description: area.find("#agendaDes").val(),
                    allocatedMinutes: 0,
                    rowOrder: 0

                };
            }
            else if (parseInt(area.find("#typeUserResponseAgenda").val()) == 2) {
                if (area.find("#fullNameOutOrg").val() == "" || area.find("#fullNameOutOrg").val() == null) {
                    ivsAlert2('error', ' پیام خطا', 'ابتدا یک کاربر خارج سازمانی مشخص کنید.');
                    return;
                }
                modelAgenda = {
                    sessionID: settings.sesstionId,
                    responsible: area.find("#fullNameOutOrg").val(),
                    title: area.find("#agendaTitle").val(),
                    description: area.find("#agendaDes").val(),
                    allocatedMinutes: 0,
                    rowOrder: 0

                };
            }


            loadingPlugin(area.find('#btn-submitAgenda'), true);

            $.ajax({
                type: "post",
                url: settings.postAgenda,
                data: JSON.stringify(modelAgenda),
                contentType: "application/json; charset=utf-8",
                success: async function (result) {

                    loadingPlugin(area.find('#btn-submitAgenda'), false);
                    area.find('#aeAgendaModal').modal('hide');

                    settings.agendaTable.rows().deselect();
                    settings.agendaTable.ajax.reload();

                    resetForm('formAeAgenda');


                    ivsAlert2('success', ' پیام موفقیت', 'دستور جلسه ثبت شد');


                },
                error: function (ex, cc, bb) {
                    loadingPlugin(area.find('#btn-submitAgenda'), false);

                    ivsAlert2('error', ' پیام خطا', 'دستور جلسه ثبت نشد');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
        }



        function getTemplate(v) {

            var ss = `
                <div class="col-lg-12 heightModal-body">
                    <nav class="navbar p-0 navbar-expand-lg navbar-dark bg-primary rounded">
                        <div class=" row row-cols-auto g-3">
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarSupportedAgenda" aria-controls="navbarSupportedAgenda"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedAgenda">
                                <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title=" افزودن دستورجلسه" role="button"  class="pointer menu-items ms-1" id="btn-addAgenda">
                                    <i class="font-35 bx bx-message-square-add text-white"></i>
                                </span>
                                <span hidden data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title=" حذف دستورجلسه" role="button"class="pointer menu-items ms-1" id="btn-removeAgenda">
                                    <i class="font-35 bx bx-message-square-minus text-white"></i>
                                </span>
                            </div>
                        </div>
                    </nav>
                    <script>
		                $(function () {
			                $('[data-bs-toggle="popover"]').popover();
			                $('[data-bs-toggle="tooltip"]').tooltip();
		                })
	                </script>
                    
                    <div class="col-12 table-responsive">
                            <style>
                                table, th,td {
                                    border: 1px solid #DDDDDD;
                                }
                            </style>
                            <table id="agendaTable" class=" table table-sm table-bordered table-striped table-responsive stripe cell-border" style=" width:100% !important; border: 1px solid #DDDDDD">
                                <thead>
                                    <tr>
                                        <th>عنوان</th>
                                        <th>توضیحات</th>
                                        <th>مسئول</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                    </div>
                </div>
                <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="aeAgendaModal" style="z-index:5555"  aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <style>
                            .modal-content{
                                z-index:-111
                            }
                        </style>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title text-primary">افزودن دستورجلسه</h5>
                                <button type="button" id="btn-close-aeAgendaModal" class="btn-close"></button>
                            </div>
                            <div class="modal-body">
                                <input hidden id="sesstinIdForAgenda"  />
                                <input hidden id="stateDateSesstion"  />
                                <form id="formAeAgenda" class="row g-3 needs-validation">
                                    <div class="">
                                        <label for="agendaTitle" class="form-label"> عنوان دستورجلسه (اجباری) </label>
                                        <input type="text" class="form-control"  tabindex="1" id="agendaTitle"  autofocus
                                               name="agendaTitle"
                                               data-val="true"
                                               data-val-required="لطفا عنوان را وارد نمایید "
                                               required />

                                        <div class="invalid-feedback" data-valmsg-for="agendaTitle" data-valmsg-replace="true" for="agendaTitle"></div>
                                    </div>
                                    <div class="">
                                        <label for="agendaDes" class="form-label"> توضیحات دستورجلسه </label>
                                        <textarea type="text" class="form-control"  tabindex="1" id="agendaDes"  rows="2"
                                               name="agendaDes"></textarea>
                                    </div>
                                    <div class="">
                                        <label for="typeUserResponseAgenda" class="form-label"> نوع مسئول دستورجلسه </label>
                                        <select class="form-select" id="typeUserResponseAgenda">
                                            <option selected>لطفا نوع مسئول را مشخص کنید</option>
                                            <option value="1">مسئول درون سازمانی</option>
                                            <option value="2">مسئول خارج از سازمانی</option>
                                        </select>
                                    </div>
                                    <div class="" id="userResponseCard"></div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-danger" tabindex="3" id="btn-cancelAeAgendaModal">لغو</button>
                                <button class="btn btn-success" tabindex="2" id="btn-submitAgenda">افزودن</button>
                            </div>
                        </div>
                    </div>
                </div>

            `;
            ss = minifyHtml(ss);

            return ss;
        }



        this.destroy = function () {
            if (settings.addTemplate) {
                area.html('');
            }
        };
        return this;
    }

}(jQuery));