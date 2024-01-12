(function ($) {
    $.fn.smartAlertPlugin = function (options) {
        var settings = $.extend({


            tblGetEventTypes: '',
            tblGetEvent: '',
            tblEventRegisters: '',
            tblEventParameters: '',

            getEventTypes: '/api/FechDataSmart/GetEventTypes',
            getEvents: '/api/FechDataSmart/GetEvents',
            getEventRegisters: '/api/FechDataSmart/GetEventRegisters',
            getEventParameters: '/api/FechDataSmart/GetEventParameters',
            getMediaTypeList: '/api/FechDataSmart/GetMediaTypeList',
            getEventAvailableUserGroups: '/api/FechDataSmart/GetEventAvailableUserGroups',
            getAvailableWorkFlowPermissons: '/api/FechDataSmart/GetAvailableWorkFlowPermissons',
            getEventRegistersMedias: '/api/FechDataSmart/GetEventRegistersMedias',

            postEventRegister: '/api/EventRegister/Post',
            putEventRegister: '/api/EventRegister/put',
            deleteEventRegister: '/api/EventRegister/delete',
            getAllRoles: '/api/RoleManagement/GetAllRoles',

            addTemplate: true,
        }, options);



        var viewModel = {
            eventTypeID: null,
            eventID: null,
            eventRegisterId: null,
            eventRegisterMediaSmsId: null,
            eventRegisterMediaEmailId: null,
            eventRegisterMediaInternalId: null,

        }

        var area = this;

        buildInterface();

        function buildInterface() {

            if (settings.addTemplate) {
                area.append(getTemplate());

            }
            initSmartWizard();
            getEventTypes();

            area.find('#btn-remove').click(function () {
                confirmDeleteEventRegister();
            });

            area.find('#btn-add').click(function () {
                setDataSmartAlertForm();

                area.find("#typeAction").val("add");
                area.find("#aeSmartAlertModal .modal-title").text("افزودن رخدادگردان");
                area.find("#aeSmartAlertModal").modal("show");
            });

            area.find('#btn-addToCondition').click(function () {
                addToCondition();
            });

            area.find('#btn-addToMassage').click(function () {
                addToMassage();
            });

            area.find("#isActive-Sms").change(function () {
                disableMassageCard('isActive-Sms', 'sms-FormBody');
            });
            area.find("#isActive-email").change(function () {
                disableMassageCard('isActive-email', 'email-FormBody');
            });
            area.find("#isActive-internal").change(function () {
                disableMassageCard('isActive-internal', 'internal-FormBody');
            });

            area.find('#btn-submit').click(function () {
                eventRegister();
            });

            area.find('#btn-edit').click(async function () {

                let valueRowSelect = settings.tblEventRegisters.rows({ selected: true }).data()[0];

                if (valueRowSelect != undefined) {

                    await setDataSmartAlertFormForEdit(valueRowSelect);

                    area.find("#typeAction").val("edit");
                    area.find("#aeSmartAlertModal .modal-title").text("ویرایش رخدادگردان");
                    area.find("#aeSmartAlertModal").modal("show");
                }
                else {
                    ivsAlert2('error', 'خطا', 'ابتدا یک مورد را انتخاب کنید');
                }


            });
        }



        function initSmartWizard() {
            var btnCancel = $('<button></button>').text('لغو').addClass('btn btn-danger').on('click', function () {
                area.find('#smartAlertWizard').smartWizard("reset");
            });
            // Step show event
            area.find("#smartAlertWizard").on("showStep", function (e, anchorObject, stepNumber, stepDirection, stepPosition) {
                area.find("#prev-btn").removeClass('disabled');
                area.find("#next-btn").removeClass('disabled');
                if (stepPosition === 'first') {
                    area.find("#prev-btn").addClass('disabled');
                } else if (stepPosition === 'last') {
                    area.find("#next-btn").addClass('disabled');
                } else {
                    area.find("#prev-btn").removeClass('disabled');
                    area.find("#next-btn").removeClass('disabled');
                }
            });
            // Smart Wizard
            area.find('#smartAlertWizard').smartWizard({
                selected: 0,
                theme: 'arrows',
                enableURLhash: 0,
                transition: {
                    animation: 'slide-horizontal',
                },
                toolbarSettings: {
                    toolbarPosition: 'none', // both bottom
                    toolbarExtraButtons: [btnCancel]
                },

            });
            // External Button Events
            area.find("#reset-btn").on("click", function () {
                // Reset wizard
                area.find('#smartAlertWizard').smartWizard("reset");
                return true;
            });
            area.find("#prev-btn").on("click", function () {
                // Navigate previous
                area.find('#smartAlertWizard').smartWizard("prev");
                return true;
            });
            area.find("#next-btn").on("click", function () {

                var result = validation_NextStep();

                if (result) {
                    area.find('#smartAlertWizard').smartWizard("next");
                    return true;
                }
                ivsAlert2("error", "پیغام خطا", "ابتدا یک مورد انتخاب کنید");

            });
            // Demo Button Events
            area.find("#got_to_step").on("change", function () {
                // Go to step
                var step_index = area.find(this).val() - 1;
                area.find('#smartAlertWizard').smartWizard("goToStep", step_index);
                return true;
            });
        }

        function getEventTypes() {
            settings.tblGetEventTypes = area.find('#tbl-getEventTypes').DataTable({
                ajax:
                {
                    //type: 'POST',
                    //contentType: 'application/json',
                    url: settings.getEventTypes,
                    dataSrc: '',
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
                    { data: "title", name: "title", type: "html", },
                    { data: "eventsCount", name: "eventsCount", type: "html", },
                ]

            });
            settings.tblGetEventTypes.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = settings.tblGetEventTypes.rows({ selected: true }).data()[0];

            }).on('deselect', function (event, dt, type, indexes) {

            });
        }

        function getEvents(eventTypeID) {
            settings.tblGetEvent = area.find('#tbl-getEvent').DataTable({
                ajax:
                {
                    //type: 'POST',
                    contentType: 'application/json',
                    url: settings.getEvents + "?eventTypeID=" + eventTypeID,
                    dataSrc: '',
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
                    { data: "title", name: "title", type: "html", },
                    { data: "eventRegistersCount", name: "eventRegistersCount", type: "html", },
                ]

            });
            settings.tblGetEvent.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = settings.tblGetEvent.rows({ selected: true }).data()[0];

            }).on('deselect', function (event, dt, type, indexes) {

            });
        }

        function getEventRegisters(eventID) {

            settings.tblEventRegisters = area.find('#tbl-eventRegisters').DataTable({
                ajax:
                {
                    //type: 'POST',
                    contentType: 'application/json',
                    url: settings.getEventRegisters + "?eventID=" + eventID,
                    dataSrc: '',
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
                    { data: "title", name: "title", type: "html", },
                ]

            });
            settings.tblEventRegisters.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = settings.tblEventRegisters.rows({ selected: true }).data()[0];

                if (valueRowSelect != undefined) {
                    area.find('#btn-remove').prop('disabled', false);
                    area.find('#btn-edit').prop('disabled', false);
                    event.stopPropagation();
                }

            }).on('deselect', function (event, dt, type, indexes) {
                area.find('#btn-remove').prop('disabled', true);
                area.find('#btn-edit').prop('disabled', true);
            });
        }

        function confirmDeleteEventRegister() {
            let currentRow = settings.tblEventRegisters.rows({ selected: true }).data()[0];
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
                        await deleteEventRegister(currentRow.id)
                    }
                }
            });
        }

        function deleteEventRegister(eventRegisterId) {

            $.ajax({
                type: "delete",
                url: settings.deleteEventRegister + "?id=" + eventRegisterId,
                contentType: 'application/json',
                success: function (result) {
                    ivsAlert2('success', "موفقیت", "آیتم مورد نظر با موفقیت حذف شد");
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', "خطا", "خطا در حذف آتیم انتخاب شده ");
                },
                complete: function (jqXHR) {
                    settings.tblEventRegisters.rows().deselect();
                    settings.tblEventRegisters.ajax.reload();
                }
            });

        }

        function resetSmartAlertForm() {
            resetForm('formAeSmartAlertEventRegister');
            resetForm('sms-FormSmartAlert');
            resetForm('email-FormSmartAlert');
            resetForm('internal-FormSmartAlert');
            area.find('#sms-FormBody *').prop('disabled', false);
            area.find('#email-FormBody *').prop('disabled', false);
            area.find('#internal-FormBody *').prop('disabled', false);
        }

        async function setDataSmartAlertForm() {
            resetSmartAlertForm();
            await getMediaTypeList();
            await getEventParameters();

        }

        function getEventParameters() {
            settings.tblEventParameters = area.find('#tbl-EventParameters').DataTable({
                ajax:
                {
                    url: settings.getEventParameters + "?eventID=" + viewModel.eventID,
                    dataSrc: '',
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
                    { data: "titleMultiLang", name: "titleMultiLang", type: "html", },
                    { data: "name", name: "name", type: "html", },
                ]

            });
            settings.tblEventParameters.on('select', function (event, dt, type, indexes) {
                let valueRowSelect = settings.tblEventParameters.rows({ selected: true }).data()[0];

            }).on('deselect', function (event, dt, type, indexes) {

            });
        }

        function addToCondition() {
            let valueRowSelect = settings.tblEventParameters.rows({ selected: true }).data()[0];
            if (valueRowSelect != undefined) {
                var tempValueCondition = area.find('#conditionEventRegister').val();
                if (tempValueCondition == '') {
                    area.find('#conditionEventRegister').val(valueRowSelect.name);
                }
                else {
                    area.find('#conditionEventRegister').val(tempValueCondition + ' ' + valueRowSelect.name);
                }
            }
            else {
                ivsAlert2('error', 'خطای عدم انتخاب ', 'لطفا یک پارامتر انتخاب و سپس دکمه افزودن به شرط را بزنید')
            }

        }

        function addToMassage() {
            let valueRowSelect = settings.tblEventParameters.rows({ selected: true }).data()[0];
            if (valueRowSelect != undefined) {

                var sms = area.find('#sms-tab .active');
                var email = area.find('#email-tab .active');
                var internal = area.find('#internal-tab .active');



                if (sms.length != 0) {
                    var tempValueCondition = area.find('#text-Sms').val();
                    if (tempValueCondition == '') {
                        area.find('#text-Sms').val(valueRowSelect.name);
                    }
                    else {
                        area.find('#text-Sms').val(tempValueCondition + ' ' + valueRowSelect.name);
                    }
                }
                else if (email.length != 0) {
                    var tempValueCondition = area.find('#text-email').val();
                    if (tempValueCondition == '') {
                        area.find('#text-email').val(valueRowSelect.name);
                    }
                    else {
                        area.find('#text-email').val(tempValueCondition + ' ' + valueRowSelect.name);
                    }
                }
                else if (internal.length != 0) {
                    var tempValueCondition = area.find('#text-internal').val();
                    if (tempValueCondition == '') {
                        area.find('#text-internal').val(valueRowSelect.name);
                    }
                    else {
                        area.find('#text-internal').val(tempValueCondition + ' ' + valueRowSelect.name);
                    }
                }

            }
            else {
                ivsAlert2('error', 'خطای عدم انتخاب ', 'لطفا یک پارامتر انتخاب و سپس دکمه افزودن به شرط را بزنید')
            }

        }

        function getEventAvailableUserGroups(tagNameCard, tagNameid, defaultValue = []) {
            $(`#${tagNameCard}`).drapdownPlugin({
                apiAddress: settings.getEventAvailableUserGroups + '?eventID=' + viewModel.eventID,
                valueOption: 'id',
                textOption: 'titleMultiLang',
                idTagName: tagNameid,
                title: 'ارسال برای گروههای کاربری مرتبط',
                dropdownParent: 'aeSmartAlertModal',
                isMultiSelect: true,
                defaultValue: defaultValue
            });
        }

        function getAvailableRoles(tagNameCard, tagNameid, defaultValue = []) {
            $(`#${tagNameCard}`).drapdownPlugin({
                apiAddress: settings.getAllRoles,
                isLinqSource: true,
                valueOption: 'id',
                textOption: 'name',
                idTagName: tagNameid,
                title: 'ارسال برای نقش های کاربری سیستمی',
                dropdownParent: 'aeSmartAlertModal',
                isMultiSelect: true,
                defaultValue: defaultValue
            });
        }

        function getMediaTypeList() {
            $.ajax({
                type: 'get',
                url: settings.getMediaTypeList,
                success: function (result) {

                    var startTab = null;
                    $('#isActive-Sms').prop('checked', false);
                    //area.find(`#sms-FormBody *`).prop('disabled', true);
                    $('#isActive-email').prop('checked', false);
                    //area.find(`#email-FormBody *`).prop('disabled', true);
                    $('#isActive-internal').prop('checked', false);
                    //area.find(`#internal-FormBody *`).prop('disabled', true);
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title == "SMS" && result[i].enabled == true) {

                            area.find('#sms-tab').removeClass('d-none');
                            area.find('#sms-Panel').removeClass('d-none');
                            getEventAvailableUserGroups('groupUser-Sms', 'users-sms')
                            getAvailableRoles('Roles-Sms', 'Roles-MultiSelectTag-Sms')
                            $('#isActive-Sms').prop('checked', true)
                            if (startTab == null) {
                                startTab = "#sms-Panel";
                            }

                        }
                        if (result[i].title == "Email" && result[i].enabled == true) {
                            area.find('#email-tab').removeClass('d-none');
                            area.find('#email-Panel').removeClass('d-none');

                            getEventAvailableUserGroups('groupUser-email', 'users-email')
                            getAvailableRoles('Roles-email', 'Roles-MultiSelectTag-email')
                            $('#isActive-email').prop('checked', true);
                            if (startTab == null) {
                                startTab = "#email-Panel";
                            }

                        }
                        if (result[i].title == "Internal Message" && result[i].enabled == true) {

                            area.find('#internal-tab').removeClass('d-none');
                            area.find('#internal-Panel').removeClass('d-none');
                            getEventAvailableUserGroups('groupUser-internal', 'users-internal')
                            getAvailableRoles('Roles-internal', 'Roles-MultiSelectTag-internal')
                            $('#isActive-internal').prop('checked', true);
                            if (startTab == null) {
                                startTab = "#internal-Panel";
                            }

                        }
                    }
                    //startTab = null;
                    if (startTab == null) {
                        area.find('#smartAlertCard').html(cardAlert('هیچ کدام از سامانه های اطلاع رسانی فعال نیست', 'خطای عدم فعال بودن سامانه اطلاع رسانی', 'error'))
                    }
                    else {
                        $(`.nav-tabs a[href="${startTab}"]`).tab('show');
                        $(`.nav-tabs a[href="${startTab}"]`).addClass('active');

                    }
                },
                error: function (ex, cc, bb) {
                    area.html(cardAlert('امکان دریافت اطلاعات از سمت سرور وجود ندارد. با پشتیبانی تماس برقرار کنید', 'خطای سرور', 'error'))
                    //console.log(ex);
                    //console.log(bb);
                },
                complete: function (jqXHR) {

                }
            });
        }

        function disableMassageCard(btnId, cardId) {

            if (area.find(`#${btnId}`).is(":checked")) {
                area.find(`#${cardId} *`).prop('disabled', false);

            }
            else {
                area.find(`#${cardId} *`).prop('disabled', true);

            }
        }

        function eventRegister() {
            if (area.find("#typeAction").val() == "add") {
                postEventRegister();
            }
            else {
                putEventRegister();
            }
        }

        function postEventRegister() {

            if (area.find('#titleEventRegister').val() == "") {
                ivsAlert2('error', 'خطا', 'عنوان را وارد نمائید');
                return;
            }

            var smsEnabled = false;
            var emailEnabled = false;
            var internalEnabled = false;

            if (area.find('#isActive-Sms').is(":checked")) {
                smsEnabled = true;

            }
            if (area.find('#isActive-email').is(":checked")) {
                emailEnabled = true;

            }
            if (area.find('#isActive-internal').is(":checked")) {
                internalEnabled = true;

            }

            eventRegisterDto = {
                title: area.find('#titleEventRegister').val(),
                eventID: viewModel.eventID,
                checkStatement: area.find('#conditionEventRegister').val(),

                eventRegisterMediaDtos: [
                    {
                        mediaTypeID: 1,
                        text: area.find("#text-Sms").val(),
                        enabled: smsEnabled,
                        sendEventUserGroupIDs: area.find('#users-sms').val(),
                        organizationRoles: area.find('#Roles-MultiSelectTag-Sms').val(),
                        workflowPermissions: [],
                        justSendOnce: false,
                        justSendOncePerUser: false
                    },
                    {
                        mediaTypeID: 2,
                        text: area.find("#text-email").val(),
                        enabled: emailEnabled,
                        sendEventUserGroupIDs: area.find('#users-email').val(),
                        organizationRoles: area.find('#Roles-MultiSelectTag-email').val(),
                        workflowPermissions: [],
                        justSendOnce: false,
                        justSendOncePerUser: false
                    },
                    {
                        mediaTypeID: 3,
                        text: area.find("#text-internal").val(),
                        enabled: internalEnabled,
                        sendEventUserGroupIDs: area.find('#users-internal').val(),
                        organizationRoles: area.find('#Roles-MultiSelectTag-internal').val(),
                        workflowPermissions: [],
                        justSendOnce: false,
                        justSendOncePerUser: false
                    }
                ]
            }

            loading('btn-submit', true, true);

            $.ajax({
                type: 'post',
                url: settings.postEventRegister,
                data: JSON.stringify(eventRegisterDto),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    loading('btn-submit', false, true);

                    ivsAlert2('success', 'پیام موفقیت', 'با موفقیت ثبت شد');

                    settings.tblEventRegisters.ajax.reload();
                    settings.tblEventRegisters.ajax.reload();

                    area.find("#aeSmartAlertModal").modal("hide");

                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطای سرور', 'امکان دریافت اطلاعات از سمت سرور وجود ندارد. با پشتیبانی تماس برقرار کنید');
                    //console.log(ex);
                    //console.log(bb);
                    loading('btn-submit', false, true);


                },
                complete: function (jqXHR) {
                    loading('btn-submit', false, true);

                }
            });


        }

        async function setDataSmartAlertFormForEdit(eventRegister) {
            resetSmartAlertForm();
            await getMediaTypeList();
            await getEventParameters();

            area.find('#titleEventRegister').val(eventRegister.title);
            area.find('#conditionEventRegister').val(eventRegister.checkStatement);

            await getEventRegistersMedias(eventRegister.id);

        }

        function getEventRegistersMedias(eventRegisterId) {
            $.ajax({
                type: 'GET',
                url: settings.getEventRegistersMedias + '?eventRegisterID=' + eventRegisterId,
                success: function (result) {
                    var startTab = null;
                    viewModel.eventRegisterId = eventRegisterId;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].mediaTypeID == 1) {
                            viewModel.eventRegisterMediaSmsId = result[i].id;

                            //area.find('#sms-tab').removeClass('d-none');
                            //area.find('#sms-Panel').removeClass('d-none');
                            getEventAvailableUserGroups('groupUser-Sms', 'users-sms', result[i].sendEventUserGroupIDs);
                            getAvailableRoles('Roles-Sms', 'Roles-MultiSelectTag-Sms', result[i].organizationRolesCommaSep)
                            area.find('#text-Sms').val(result[i].text);

                            if (result[i].enabled != true) {
                                $('#isActive-Sms').prop('checked', false);

                                area.find(`#sms-FormBody *`).prop('disabled', true);

                                //disableMassageCard('isActive-Sms', 'sms-FormBody');
                            }

                            if (startTab == null) {
                                startTab = "#sms-Panel";
                            }

                        }
                        if (result[i].mediaTypeID == 2) {
                            viewModel.eventRegisterMediaEmailId = result[i].id;

                            //area.find('#email-tab').removeClass('d-none');
                            //area.find('#email-Panel').removeClass('d-none');

                            getEventAvailableUserGroups('groupUser-email', 'users-email', result[i].sendEventUserGroupIDs);
                            getAvailableRoles('Roles-email', 'Roles-MultiSelectTag-email', result[i].organizationRolesCommaSep);
                            area.find('#text-email').val(result[i].text);

                            if (result[i].enabled != true) {
                                $('#isActive-email').prop('checked', false);

                                area.find(`#email-FormBody *`).prop('disabled', true);


                                //disableMassageCard('isActive-email', 'email-FormBody');
                            }

                            if (startTab == null) {
                                startTab = "#email-Panel";
                            }

                        }
                        if (result[i].mediaTypeID == 3) {
                            viewModel.eventRegisterMediaInternalId = result[i].id;

                            //area.find('#internal-tab').removeClass('d-none');
                            //area.find('#internal-Panel').removeClass('d-none');

                            getEventAvailableUserGroups('groupUser-internal', 'users-internal', result[i].sendEventUserGroupIDs);
                            getAvailableRoles('Roles-internal', 'Roles-MultiSelectTag-internal', result[i].organizationRolesCommaSep);
                            area.find('#text-internal').val(result[i].text);

                            if (result[i].enabled != true) {
                                $('#isActive-internal').prop('checked', false);

                                area.find(`#internal-FormBody *`).prop('disabled', true);


                                //disableMassageCard('isActive-internal', 'internal-FormBody');
                            }

                            if (startTab == null) {
                                startTab = "#internal-Panel";
                            }

                        }
                    }
                    //startTab = null;
                    if (startTab == null) {
                        area.find('#smartAlertCard').html(cardAlert('هیچ کدام از سامانه های اطلاع رسانی فعال نیست', 'خطای عدم فعال بودن سامانه اطلاع رسانی', 'error'))
                    }
                    else {
                        $(`.nav-tabs a[href="${startTab}"]`).tab('show');

                    }


                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطای سرور', 'امکان دریافت اطلاعات از سمت سرور وجود ندارد. با پشتیبانی تماس برقرار کنید');
                    //console.log(ex);
                    //console.log(bb);


                }
            });
        }

        function putEventRegister() {

            if (area.find('#titleEventRegister').val() == "") {
                ivsAlert2('error', 'خطا', 'عنوان را وارد نمائید');
                return;
            }

            var smsEnabled = false;
            var emailEnabled = false;
            var internalEnabled = false;

            if (area.find('#isActive-Sms').is(":checked")) {
                smsEnabled = true;

            }
            if (area.find('#isActive-email').is(":checked")) {
                emailEnabled = true;

            }
            if (area.find('#isActive-internal').is(":checked")) {
                internalEnabled = true;

            }

            var organizationRoles1 = area.find('#Roles-MultiSelectTag-Sms').val();
            var organizationRoles2 = area.find('#Roles-MultiSelectTag-email').val();
            var organizationRoles3 = area.find('#Roles-MultiSelectTag-internal').val();

            var eventRegisterMediaSmsId = null;
            var eventRegisterMediaEmailId = null;
            var eventRegisterMediaInternalId = null;
            var eventRegisterMediaDtosTemp = [];
            if (viewModel.eventRegisterMediaSmsId != undefined || viewModel.eventRegisterMediaSmsId != null) {
                eventRegisterMediaSmsId = {
                    id: viewModel.eventRegisterMediaSmsId,
                    mediaTypeID: 1,
                    text: area.find("#text-Sms").val(),
                    enabled: smsEnabled,
                    sendEventUserGroupIDs: area.find('#users-sms').val() == null || undefined ? [] : area.find('#users-sms').val(),
                    organizationRoles: area.find('#Roles-MultiSelectTag-Sms').val() == null || undefined ? [] : area.find('#Roles-MultiSelectTag-Sms').val(),
                    workflowPermissions: [],
                    justSendOnce: false,
                    justSendOncePerUser: false
                };
                eventRegisterMediaDtosTemp.push(eventRegisterMediaSmsId)
            }
            if (viewModel.eventRegisterMediaEmailId != undefined || viewModel.eventRegisterMediaEmailId != null) {
                eventRegisterMediaEmailId = {
                    id: viewModel.eventRegisterMediaEmailId,
                    mediaTypeID: 2,
                    text: area.find("#text-email").val(),
                    enabled: emailEnabled,
                    sendEventUserGroupIDs: area.find('#users-email').val() == null || undefined ? [] : area.find('#users-email').val(),
                    organizationRoles: area.find('#Roles-MultiSelectTag-email').val() == null || undefined ? [] : area.find('#Roles-MultiSelectTag-email').val(),
                    workflowPermissions: [],
                    justSendOnce: false,
                    justSendOncePerUser: false
                },
                    eventRegisterMediaDtosTemp.push(eventRegisterMediaEmailId)
            }
            if (viewModel.eventRegisterMediaInternalId != undefined || viewModel.eventRegisterMediaInternalId != null) {
                eventRegisterMediaInternalId = {
                    id: viewModel.eventRegisterMediaInternalId,
                    mediaTypeID: 3,
                    text: area.find("#text-internal").val(),
                    enabled: internalEnabled,
                    sendEventUserGroupIDs: area.find('#users-internal').val() == null || undefined ? [] : area.find('#users-internal').val(),
                    organizationRoles: area.find('#Roles-MultiSelectTag-internal').val() == null || undefined ? [] : area.find('#Roles-MultiSelectTag-internal').val(),
                    workflowPermissions: [],
                    justSendOnce: false,
                    justSendOncePerUser: false
                }
                eventRegisterMediaDtosTemp.push(eventRegisterMediaInternalId)
            }
            eventRegisterDto = {
                id: viewModel.eventRegisterId,
                title: area.find('#titleEventRegister').val(),
                eventID: viewModel.eventID,
                checkStatement: area.find('#conditionEventRegister').val(),


                eventRegisterMediaDtos: [...eventRegisterMediaDtosTemp]
            }

            loading('btn-submit', true, true);

            $.ajax({
                type: 'put',
                url: settings.putEventRegister,
                data: JSON.stringify(eventRegisterDto),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    loading('btn-submit', false, true);

                    ivsAlert2('success', 'پیام موفقیت', 'با موفقیت ویرایش شد');

                    settings.tblEventRegisters.ajax.reload();
                    settings.tblEventRegisters.ajax.reload();

                    area.find("#aeSmartAlertModal").modal("hide");

                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطای سرور', 'امکان دریافت اطلاعات از سمت سرور وجود ندارد. با پشتیبانی تماس برقرار کنید');
                    //console.log(ex);
                    //console.log(bb);
                    loading('btn-submit', false, true);


                },
                complete: function (jqXHR) {
                    loading('btn-submit', false, true);

                }
            });

        }

        function validation_NextStep() {
            let stepIndex = area.find("#smartAlertWizard").smartWizard("getStepIndex");

            if (stepIndex == 2) {

            }

            else if (stepIndex == 1) {

                let valueRowSelect = settings.tblGetEvent.rows({ selected: true }).data()[0];
                if (valueRowSelect == undefined) {
                    return false
                }
                //eventID = valueRowSelect.id;
                viewModel.eventID = valueRowSelect.id;
                getEventRegisters(valueRowSelect.id);
                return true;
            }
            else if (stepIndex == 0) {

                let valueRowSelect = settings.tblGetEventTypes.rows({ selected: true }).data()[0];
                if (valueRowSelect == undefined) {
                    return false
                }
                //eventTypeID = valueRowSelect.id;
                viewModel.eventTypeID = valueRowSelect.id;
                getEvents(valueRowSelect.id);
                return true;
            }

        }



        function getTemplate(v) {

            var ss = `
                <div></div>
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
