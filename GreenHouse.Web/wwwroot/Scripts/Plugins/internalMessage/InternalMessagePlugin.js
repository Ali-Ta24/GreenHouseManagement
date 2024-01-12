(function ($) {

    $.fn.internalMessagePlugin = function (options) {
        var settings = $.extend({

            getAllMessageApiAddress: "/api/Notification/GetAllMessageForASpecailUser",
            getAllNotReadMessageApiAddress: "/api/Notification/GetAllNotReadedMessageForASpecailUser",
            getCountNotReadApiAddress: "/api/Notification/CountNotReadAsync",
            getCountAllMessageApiAddress: "/api/Notification/CountAllMessageAsync",
            postMessageApiAddress: "/api/Notification/PostPrivateInternalMessage",
            deleteMessageApiAddress: "/api/Notification/Delete",
            readMessageApiAddress: "/api/Notification/ReadOneMessageAsync",

            //For Dropdown 
            getAllActiveUser: '/api/User/GetAllActiveUser',

            //For sendDocoument
            postDocumentToRequest: "/api/Notification/PostDocumentToInternalMessage",
            deleteDocumentFromFacilityRequest: "/api/Notification/RemoveDocumentFromInternalMessage",
            getFacilityRequestDocumentsByGroup: "/api/Notification/GetInternalMessageDocumentsByID",

            hasTemplate: true
        }, options);

        var viewModel = undefined;
        var area = this;

        var messageId = generateGuid();

        buildInterface();

        async function buildInterface() {
            if (settings.hasTemplate) {
                area.html(getTemplate());
                getCountAllMessage();
            }

            area.find("#file-body").uploadFilePlugin({
                postDocumentToRequest: settings.postDocumentToRequest,
                deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                objectId: messageId
            });

            area.find("#ToUserName").drapdownPlugin({
                apiAddress: settings.getAllActiveUser,
                valueOption: 'nationalCodeId',
                textOption: 'lastName',
                idTagName: 'UserName',

                title: 'نام کاربر',
            });


            var messagelist = getMessageList();
            messagelist.then(function () {
                $('[data-message-rols]').click(function (e) {
                    e.stopPropagation();
                    var ss = readMessage($(e.target).attr('data-message-rols'));


                    ss.then(function () {
                        //console.log($("#file-body-ToRead"));
                        $("#file-body-ToRead").uploadFilePlugin({
                            postDocumentToRequest: settings.postDocumentToRequest,
                            deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                            getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                            objectId: $(e.target).attr('data-message-rols'),
                            isAddDocuments: -1,
                            isEditDocuments: -1,
                        });
                    });

                });
            });

            area.find("#btn-refresh-messageList").click(function () {
                var messagelist = getMessageList();
                getCountAllMessage();
                messagelist.then(function () {
                    $('[data-message-rols]').click(function (e) {
                        e.stopPropagation();
                        var ss = readMessage($(e.target).attr('data-message-rols'));
                        ss.then(function () {
                            //console.log($("#file-body-ToRead"));
                            $("#file-body-ToRead").uploadFilePlugin({
                                postDocumentToRequest: settings.postDocumentToRequest,
                                deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                                getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                                objectId: $(e.target).attr('data-message-rols'),
                                isAddDocuments: -1,
                                isEditDocuments: -1,
                            });
                        });
                    });
                });
                ivsAlert2('success', "موفقیت", "لیست پیام ها با موفقیت بروزرسانی شد.");
                //location.reload();
            });

            area.find("#SelectAllMessage").click(function (e) {
                var selected = area.find("#SelectAllMessage").prop("checked");
                var toggle = area.find('[data-select-rols]');
                toggle.prop("checked", selected);
            });

            area.find("#btn-remove").click(function () {
                deleteMessage();
                getCountAllMessage();
                var ww = getMessageList();
                ww.then(function () {
                    $('[data-message-rols]').click(function (e) {
                        e.stopPropagation();
                        var ss = readMessage($(e.target).attr('data-message-rols'));
                        ss.then(function () {
                            //console.log($("#file-body-ToRead"));
                            $("#file-body-ToRead").uploadFilePlugin({
                                postDocumentToRequest: settings.postDocumentToRequest,
                                deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                                getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                                objectId: $(e.target).attr('data-message-rols'),
                                isAddDocuments: -1,
                                isEditDocuments: -1,
                            });
                        });
                    });
                });
                area.find('#btn-getAllMessage').removeClass('active');
                area.find('#btn-getNotReadMessage').addClass('active');
            });

            area.find("#btn-sendMessage").click(function () {
                sendMessage();
                //var ww = getMessageList();
                //ww.then(function () {
                //    $('[data-message-rols]').click(function (e) {
                //        e.stopPropagation();
                //        var ss = readMessage($(e.target).attr('data-message-rols'));
                //        ss.then(function () {
                //           //console.log($("#file-body-ToRead"));
                //            $("#file-body-ToRead").uploadFilePlugin({
                //                postDocumentToRequest: settings.postDocumentToRequest,
                //                deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                //                getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                //                objectId: $(e.target).attr('data-message-rols'),
                //                isAddDocuments: -1,
                //                isEditDocuments: -1,
                //            });
                //        });
                //    });
                //});
            });

            area.find('#btn-getNotReadMessage').click(function () {
                var messagelist = getMessageList();
                messagelist.then(function () {
                    $('[data-message-rols]').click(function (e) {
                        e.stopPropagation();
                        var ss = readMessage($(e.target).attr('data-message-rols'));


                        ss.then(function () {
                            //console.log($("#file-body-ToRead"));
                            $("#file-body-ToRead").uploadFilePlugin({
                                postDocumentToRequest: settings.postDocumentToRequest,
                                deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                                getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                                objectId: $(e.target).attr('data-message-rols'),
                                isAddDocuments: -1,
                                isEditDocuments: -1,
                            });
                        });
                    });
                });
                area.find('#btn-getAllMessage').removeClass('active');
                area.find('#btn-getNotReadMessage').addClass('active');
            });

            area.find('#btn-getAllMessage').click(function () {
                var messagelist = getAllMessageList();
                messagelist.then(function () {
                    $('[data-message-rols]').click(function (e) {
                        e.stopPropagation();
                        var ss = readMessage($(e.target).attr('data-message-rols'));


                        ss.then(function () {
                            //console.log($("#file-body-ToRead"));
                            $("#file-body-ToRead").uploadFilePlugin({
                                postDocumentToRequest: settings.postDocumentToRequest,
                                deleteDocumentFromFacilityRequest: settings.deleteDocumentFromFacilityRequest,
                                getFacilityRequestDocumentsByGroup: settings.getFacilityRequestDocumentsByGroup,

                                objectId: $(e.target).attr('data-message-rols'),
                                isAddDocuments: -1,
                                isEditDocuments: -1,
                            });
                        });
                    });
                });
                area.find('#btn-getNotReadMessage').removeClass('active');
                area.find('#btn-getAllMessage').addClass('active');
                //location.reload();
            });
        }

        function getMessageList() {
            return $.ajax({
                contentType: 'application/json',
                type: "get",
                url: settings.getAllNotReadMessageApiAddress,
                success: function (result) {
                    getCountNotRead();
                    getCountAllMessage();
                    area.find("#messageContent").empty();

                    area.find("#messageContent").html(getMessageListTemplate(result.data));
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش پیام های داخلی');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
        }

        function getAllMessageList() {
            return $.ajax({
                contentType: 'application/json',
                type: "get",
                url: settings.getAllMessageApiAddress,
                success: function (result) {
                    getCountNotRead();
                    area.find("#messageContent").html(getMessageListTemplate(result.data));
                },
                error: function (ex, cc, bb) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش پیام های داخلی');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
        }

        function getCountNotRead() {
            $.ajax({
                contentType: 'application/json',
                type: "get",
                url: settings.getCountNotReadApiAddress,
                success: function (result) {
                    area.find("#countNotReadMessage").html(result);
                },
                error: function (x, y, z) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش پیام های داخلی');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
        }

        function getCountAllMessage() {
            $.ajax({
                contentType: 'application/json',
                type: "get",
                url: settings.getCountAllMessageApiAddress,
                success: function (result) {
                    area.find("#countAllMessage").html(result);
                },
                error: function (x, y, z) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش پیام های داخلی');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
        }

        function deleteMessage() {
            listItem = [];
            var toremoveitem = area.find('[data-messageId-rols]input[type="checkbox"]:checked');
            if (toremoveitem.length == 0) {
                ivsAlert('پیامی انتخاب نشده است.', 'اخطار', 'warning');
                return;
            }
            for (var i = 0; i < toremoveitem.length; i++) {
                listItem.push(area.find(toremoveitem[i]).attr('data-messageId-rols'));
            }
            $.ajax({
                contentType: 'application/json',
                type: "post",
                url: settings.deleteMessageApiAddress,
                data: JSON.stringify(listItem),
                success: function () {
                    getCountAllMessage();
                    var toggle = $('#SelectAllMessage');
                    if (toggle.prop("checked") == true) {
                        toggle.prop("checked", !toggle.prop("checked"));
                    }
                    ivsAlert2('success', "موفقیت", "پیام با موفقیت حذف شد");
                },
                error: function (x, y, z) {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش پیام های داخلی');
                }
            });
        }

        function sendMessage() {
            var modelEmail = {
                id: messageId,
                userName: '',
                FromUserName: '',
                toUserName: area.find("#UserName").val(),
                body: area.find("#MessageBody").val()
            };
            if (modelEmail.body === "") {
                ivsAlert2('warning', 'اخطار', 'متن پیام نمیتواند خالی باشد');
                return;
            }
            return $.ajax({
                type: "post",
                url: settings.postMessageApiAddress,
                data: JSON.stringify(modelEmail),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    ivsAlert2('success', ' پیام موفقیت', 'پیام با موفقیت ارسال شد.');

                    area.find("#addmodal").fadeOut(0);
                    area.find("#ToUserName").val("");
                    area.find("#MessageBody").val("");
                    messageId = generateGuid();
                    setTimeout(function () {
                        location.reload();
                    }, 3000)
                },
                error: function (ex, cc, bb) {
                    if (ex.responseText.match(/(^|\W)109($|\W)/)) {
                        ivsAlert2('error', 'خطا', 'پیام نمیتواند خالی باشد.');
                    }
                    else if (ex.responseText.match(/(^|\W)110($|\W)/)) {
                        ivsAlert2('error', 'خطا', 'زمان ارسال پیام درست نیست.');
                    }
                    else if (ex.responseText.match(/(^|\W)111($|\W)/)) {
                        ivsAlert2('error', 'خطا', 'گیرنده پیام نمیتواند خالی باشد.');
                    }
                    else if (ex.responseText.match(/(^|\W)112($|\W)/)) {
                        ivsAlert2('error', 'خطا', 'فرستنده پیام نمیتواند خالی باشد.');
                    }
                    else {
                        ivsAlert('اشکال در برقراری ارتباط با سرور -   بخش پیام های داخلی', 'خطا', 'error');
                    }
                    //console.log(ex);
                    //console.log(bb);
                    //console.log(cc);
                }
            });
        }

        function readMessage(messageId) {
            if (typeof messageId !== 'undefined') {
                return $.ajax({
                    ontentType: 'application/json',
                    type: "get",
                    url: settings.readMessageApiAddress + "?id=" + messageId,
                    success: function (result) {
                        area.find("#messageContent").empty().html(showMessageTemplate(result));
                    },
                    error: function (x, y, z) {
                        ivsAlert('اشکال در برقراری ارتباط با سرور -   بخش پیام های داخلی', 'خطا', 'error');
                        //console.log(ex);
                        //console.log(bb);
                    }
                });
            }
        }

        function getMessageListTemplate(data) {
            var Messagetemplate = "";
            for (var i = 0; i < data.length; i++) {
                Messagetemplate += `<div class="d-md-flex align-items-center email-message px-3 py-1" data-message-rols="${data[i].id}">
                                        <div class="d-flex align-items-center email-actions" data-message-rols="${data[i].id}">
                                            <input class="form-check-input" data-select-rols type="checkbox" data-messageid-rols="${data[i].id}"/> <i class='bx bx-star font-20 mx-2 email-star'></i>
                                            <p class="mb-0" >
                                                <b data-message-rols="${data[i].id}">${data[i].userName}</b>
                                            </p>
                                        </div>
                                        <div >
                                            <p class="mb-0" data-message-rols="${data[i].id}">
                                                ${data[i].body.slice(0, 15)}
                                            </p>
                                        </div>
                                        <div class="ms-auto">
                                            <p class="mb-0 email-time" data-message-rols="${data[i].id}">${getPerianDateTime(data[i].sentTime)}</p>
                                        </div>
                                    </div>`;

            }
            Messagetemplate = minifyHtml(Messagetemplate);
            return Messagetemplate;
        }

        function getTemplate() {
            var ss = ` <div class="wrapper">
                           <div class="email-wrapper">
                               <div class="email-sidebar">
                                   <div class="email-sidebar-header d-grid my-3 ">
                                       <a class="btn btn-primary compose-mail-btn "><i class='bx bx-plus me-2'></i> ایمیل جدید</a>
                                   </div>
                                   <div class="email-sidebar-content">
                                       <div class="email-navigation h-auto">
                                           <div class="list-group list-group-flush">
                                               <a id="btn-getNotReadMessage"
                                                  class="list-group-item d-flex align-items-center active">
                                                   <i class='bx bxs-inbox me-3 font-20'></i><span>صندوق دریافت</span><span class="badge bg-primary rounded-pill ms-auto" id="countNotReadMessage"></span>
                                               </a>
                                               <a id="btn-getAllMessage"
                                                  class="list-group-item d-flex align-items-center">
                                                   <i class="bx bxs-envelope-open me-3 font-20"></i><span>همه ایمیل ها</span><span class="badge bg-primary rounded-pill ms-auto" id="countAllMessage"></span>
                                               </a>
                                           </div>
                                       </div>

                                   </div>
                               </div>
                               <div class="email-header d-xl-flex align-items-center">
                                   <div class="d-flex align-items-center">
                                       <div class="email-toggle-btn">
                                           <i class='bx bx-menu'></i>
                                       </div>
                                       <div class="btn btn-white">
                                           <input class="form-check-input m-1" type="checkbox" id="selectAllMessage">
                                       </div>
                                       <div class="">
                                           <button type="button" class="btn btn-white ms-2 align-items-center" id="btn-refresh-messageList">

                                               <i class='bx bx-refresh my-auto'></i>
                                           </button>
                                       </div>
                                       <div class="">
                                           <button type="button" class="btn btn-white ms-2" id="btn-remove">
                                               <i class='bx bx-trash my-auto'></i>
                                           </button>
                                       </div>
                                   </div>
                               </div>
                               <div class="email-content">
                                   <div class="email-list" id="messageContent">
                                   </div>
                               </div>
                               <div class="compose-mail-popup" id="addmodal">
                                   <div class="card">
                                       <div class="card-header bg-dark text-white py-2 cursor-pointer">
                                           <div class="d-flex align-items-center">
                                               <div class="compose-mail-title">ایمیل جدید</div>
                                               <div class="compose-mail-close ms-auto">x</div>
                                           </div>
                                       </div>
                                       <div class="card-body">
                                           <div class="email-form">
                                               <div class="mb-3">
                                                   <div id="ToUserName"></div>
                                               </div>
                                               <div class="mb-3">
                                                   <textarea class="form-control" placeholder="متن ایمیل" rows="10" cols="10" id="MessageBody"></textarea>
                                               </div>
                                               <div id="file-body"></div>

                                               <div class="mb-0">
                                                   <div class="d-flex align-items-center">
                                                       <div class="">
                                                           <div class="btn-group">
                                                               <button type="button" class="btn btn-primary" id="btn-sendMessage">ارسال</button>
                                                               <div class="dropdown-menu">
                                                               </div>
                                                           </div>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>`;
            ss = minifyHtml(ss);
            return ss;
        }

        function showMessageTemplate(data) {
            //console.log(data);
            var messageTemplate = `<div class="email-read-box p-3">
							<h4>پیام متنی</h4>
							<hr>
							<div class="d-flex align-items-center">
								<div class="flex-grow-1 ms-2">
									<p class="mb-0 font-weight-bold">فرستنده : ${data.fromUserName}</p>
									
								</div>
								<p class="mb-0 chat-time ps-5 ms-auto">${getPerianDateTime(data.sentTime)}</p>
							</div>
							<div class="email-read-content px-md-5 py-5">
								<p class="text-break">${data.body.replace(/\n/g, '<br/>')}</p>
							</div>
                            <div id="file-body-ToRead"></div>
						</div>`;
            messageTemplate = minifyHtml(messageTemplate);
            return messageTemplate;
        }

        function generateGuid() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        return this;
    }

}(jQuery));