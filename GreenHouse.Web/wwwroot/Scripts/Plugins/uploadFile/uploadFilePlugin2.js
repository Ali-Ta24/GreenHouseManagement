(function ($) {
    $.fn.uploadFilePlugin2 = function (options) {
        var settings = $.extend({

            ///require
            objectId: null,
            isViewDocuments: 1,
            isAddDocuments: 1,
            isEditDocuments: 1,

            ///option
            title: null,
            required: false,
            requestDocumentGroupID: null,
            number: 0,

            postUploadFile: '/api/DMS/UploadFile',
            postDocumentToRequest: '/api/Facility/PostDocumentToFacilityRequest',

            deleteDocumentFromFacilityRequest: '/api/Facility/RemoveDocumentFromFacilityRequest',

            getFacilityRequestDocumentsByGroup: '/api/Facility/GetFacilityRequestDocumentsByGroup',
            getmaximumFileSizeKilobytes: '/api/dms/getmaximumFileSizeKilobytes',
            getValidFileTypes: '/api/dms/getValidFileTypes',

            addTemplate: true,
            aferAddbtnClick: null
        }, options);

        var viewModel = undefined;
        var area = this;





        async function buildInterface() {
            if (settings.isViewDocuments == -1) {
                area.html(cardAlert('شما به این بخش دسترسی ندارید', 'خطا عدم دسترسی', 'error'));
                return
            }

            if (settings.addTemplate) {
                area.html(await getTemplate());
            }

            if (settings.requestDocumentGroupID != null && settings.objectId != null) {
                await docTemplate()
            }
            else if (settings.requestDocumentGroupID == null && settings.objectId != null) {
                await gDocTemplate();
            }


            area.find('#addDocBtn').click(async function () {

                var validFileTypes = await getValidFileTypes();

                var acceptType = validFileTypes.split(',');
                var resultAcceptType = '';

                for (let t in acceptType) {
                    resultAcceptType += '.';
                    resultAcceptType += acceptType[t];
                    if (acceptType.indexOf(acceptType[t]) != (acceptType.length - 1)) {
                        resultAcceptType += ',';
                    }

                }
                ;

                //area.find('#modalAddDocuments').modal('show');
                var temp = `  <div class="col-lg-12">
                                    <div class="border border-3 p-4 rounded">
                                        <form id="formAddDoc" class="row g-3 needs-validation">
                                            <div class="mb-3">
                                                <label for="title-Doc" class="form-label">عنوان مدرک</label>
                                                <input type="text" class="form-control" id="title-Doc" name="title-Doc"
                                                       data-val="true"
                                                       data-val-required="لطفا عنوان مدرک را وارد نمایید"
                                                       required>
                                                <div id="title-Doc-error" class="text-danger"></div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="inputProductDescription" class="form-label">توضیحات</label>
                                                <textarea class="form-control" id="des-Doc"
                                                          rows="3"></textarea>
                                            </div>
                                            <div class="">
                                                <label for="inputProductDescription" class="form-label">بارگذاری مدرک </label>
                                                <input accept=".pdf" class="form-control" id="filedoc" type="file"
                                                       required>
                                                <div id="filedoc-error" class="text-danger"></div>
                                                <p id="error-input-file" class="text-danger"></p>
                                            </div>
                                            
                                        </form>
                                    </div>
                                </div>
                                `

                bootbox.dialog({
                    message: temp,
                    title: "افزودن مستندات",
                    buttons: {
                        ok: {
                            label: "افزودن",
                            className: 'btn-success btn-addDoc',
                            callback: function () {

                                addDocServer(area);
                                return false;
                            }
                        },
                        ancel: {
                            label: "انصراف",
                            className: 'btn-danger',
                            callback: function () {
                                //console.log('Custom cancel clicked');
                            }
                        },
                    }
                }).on('shown.bs.modal', function (e) {

                    area.find('#btn-add-doc').click(function () {

                        addDocServer();

                    });
                });

                area.find("#filedoc").accept = resultAcceptType;
                area.find('#error-input-file').text(`فرمت های قابل قبول ${validFileTypes} میباشند.`);

                if (settings.aferAddbtnClick != null)
                    settings.aferAddbtnClick();

            });

            area.find(".remove").click(function (e) {

                var docid = e.delegateTarget.attributes.docid.value;
                confirmDeleteItem(docid);

            });


            area.find('#btn-close-formDoc').click(function () {
                // area.find('#modalAddDocuments').modal('hide');
            });

            area.find('#test').click(function () {
                //console.log(area);
            });

        }

        async function gDocTemplate() {
            let gd = `<div class="card"> 
                
                ${settings.isAddDocuments != -1 ? `
                                         <div class="card-header" style="background-color: darkviolet;height: 60px;">
                                            <button  class="btn btn-success" type="button"  title=" افزودن سند"  role="button" id="addDocBtn">
                                               <i class="fadeIn animated font-35 bx bx-message-square-add text-white"></i>
                                            </button>
                                     </div>     
                                ` : ``}
                         
            <div class="card-body">
                
                <div class="mt-3 row" id="" style="margin: 10px;">
                    `+
                await getListGDocFiles()
                + `
                    </div>
                   </div>
                </div>
                <script>
		            $(function () {
			            $('[data-bs-toggle="popover"]').popover();
			            $('[data-bs-toggle="tooltip"]').tooltip();
		            })
	            </script>
                `;

            gd = minifyHtml(gd);

            area.find("#templateDoc").html(gd);

            //return gd;
        }

        async function docTemplate() {
            //area.find("#templateDoc").html("");
            //ss = "";
            var d = `
                   <div class="card m-2 rounded">
						<div class="card-body row">
							<h6>${settings.number} - ${settings.title}  ${settings.required == true ? `<span class="badge rounded-pill bg-danger"> اجباری </span>` : ``}</h6>
                            ${settings.isEditDocuments != -1 ? `<button class="btn btn-outline-dark" id="addDocBtn" >افزودن مستندات</button>` : ""}
						</div>
                        <hr/>
                        <div class=" mb-3 card-itemsFile">				           
                        `+
                await getListDocFiles()
                + `                           
                        </div>
				   </div>
                   <script>
		                $(function () {
			                $('[data-bs-toggle="popover"]').popover();
			                $('[data-bs-toggle="tooltip"]').tooltip();
		                })
	               </script>
                `;
            d = minifyHtml(d);

            area.find("#templateDoc").html(d);
            //return d;
        }

        async function getListGDocFiles() {
            var dataDoc = await $.ajax({
                type: "get",
                url: settings.getFacilityRequestDocumentsByGroup + '?facilityRequestID=' + settings.objectId,
                success: function (result) {
                    return result;
                },
                error: function (ex, cc, bb) {

                    if (ex.responseText.includes("found by id")) {
                        area.html(cardAlert('شی با ای دی مورد نظر یافت نشد', 'خطا عدم وجود ای دی', 'error'));
                    }
                    else {
                        area.html(cardAlert('خطای عدم ارتباط با سرور - با پشتیبانی تماس بگیرید.', 'خطا سرور ', 'error'));
                    }
                    return;
                },
                complete: function (jqXHR, status) {
                }
            });

            var cardDownload = "";

            if (dataDoc.length == 0) {
                return `<span>سند ثبت نشده است</span> `;
            }

            for (var i = 0; i < dataDoc.length; i++) {
                var type = getNameTypeFile(dataDoc[i].latestFileName);
                let strDoc = `
                  <div class="mb-3 d-flex align-items-center border border-dark p-2 rounded">
					    <div class="" style="overflow: hidden;">
						    `+ getTypeFile(dataDoc[i].latestFileName) + `
					    </div>
					    <div class="ms-2">
						    <h4 title="${dataDoc[i].title}" style="max-width:800px" class="mb-1 title-file font-14">${dataDoc[i].title}</h4>
                            <p title="${dataDoc[i].description}" style="max-width:800px" class="mb-1 des-file font-14">${dataDoc[i].description}</p>

					    </div>
					    <div class="list-inline d-flex customers-contacts ms-auto">
                              <a data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="دانلود فایل" href="/api/DMS/download/${dataDoc[i].latestFileID}" download class="btn-outline-success list-inline-item cursor-pointer  "><i class='bx bx-download'></i></a>
                              <a data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="نمایش فایل" onclick="showFileToWeb('/api/DMS/download/${dataDoc[i].latestFileID}', '${type}' )" class="list-inline-item cursor-pointer btn-outline-info"><i class="bx bx-show-alt"></i></a>
                              ${settings.isEditDocuments != -1 ? `<a docId="${dataDoc[i].documentID}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="حذف فایل" class="remove list-inline-item cursor-pointer btn-outline-danger"><i class='bx bx-trash-alt'></i></a>` : ""}
					    </div>
                   </div>               
				`;

                cardDownload += strDoc;
            }
            return cardDownload;
        }

        async function getListDocFiles() {
            var data = await $.ajax({
                type: "get",
                url: settings.getFacilityRequestDocumentsByGroup + '?facilityRequestID=' + settings.objectId + "&documentGroupID=" + settings.requestDocumentGroupID,
                success: function (result) {
                    return result;
                },
                error: function (ex, cc, bb) {

                    if (ex.responseText.includes("found by id")) {
                        area.html(cardAlert('شی با ای دی مورد نظر یافت نشد', 'خطا عدم وجود ای دی', 'error'));
                    }
                    else {
                        area.html(cardAlert('خطای عدم ارتباط با سرور - با پشتیبانی تماس بگیرید.', 'خطا سرور ', 'error'));
                    }
                    return;
                },
                complete: function (jqXHR, status) {
                }
            });

            var cardDownload = "";


            if (data.length == 0) {
                return "مدرک ثبت نشده است.";
            }
            for (var i = 0; i < data.length; i++) {
                var typefile = getNameTypeFile(data[i].latestFileName);

                let strDoc = `
              <div class="p-2 customers-list-item rounded d-flex align-items-center">
					<div class="" style="overflow: hidden;">
						`+ getTypeFile(data[i].latestFileName) + `
					</div>
					<div class="ms-2">
						<h4 title="${data[i].title}" class="mb-1 title-file font-14">${data[i].title}</h4>
                        <p title="${data[i].description}" class="mb-1 des-file font-14">${data[i].description}</p>

					</div>
					<div class="list-inline d-flex customers-contacts ms-auto">
                          <a data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="دانلود فایل" href="/api/DMS/download/${data[i].latestFileID}" download class="list-inline-item cursor-pointer  btn-outline-success"><i class='bx bx-download'></i></a>
                          <a data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="نمایش فایل" onclick="showFileToWeb('/api/DMS/download/${data[i].latestFileID}', '${typefile}' )" class="list-inline-item cursor-pointer btn-outline-info"><i class="bx bx-show-alt" ></i></a>
                          ${settings.isEditDocuments != -1 ? `<a docId="${data[i].documentID}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="حذف فایل"  class="remove list-inline-item cursor-pointer btn-outline-danger"><i class='bx bx-trash-alt'></i></a>` : ""
                    }
					</div>
               </div>
                
				`;
                cardDownload += strDoc;
            }
            return cardDownload;

        }

        async function getTemplate() {
            var ss = `
                
                <div id="templateDoc"><div>
            `;


            ss = minifyHtml(ss);

            return ss;
        }

        function confirmDeleteItem(docid) {
            bootbox.confirm({
                message: "آیا از حذف سند انتخاب شده مطمئن هستید؟",
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
                        await deleteItem(docid)
                    }
                }
            });
        }

        function deleteItem(docid) {
            $.ajax({
                type: "delete",
                url: settings.deleteDocumentFromFacilityRequest + "?facilityRequestID=" + settings.objectId + '&documentID=' + docid,
                success: function (result) {
                    ivsAlert2("success", "پیام موفقیت", "مدرک مورد نظر حذف شد");
                    //if (settings.requestDocumentGroupID != null) {
                    //    docTemplate();
                    //}
                    //else {
                    //    gDocTemplate();
                    //}
                    buildInterface();
                },
                error: function (ex, cc, bb) {
                    if (ex.responseText.includes("WorkflowActionIsNotAvailableForTheRole")) {
                        ivsAlert2('error', 'خطای عدم دسترسی', 'شما دسترسی برای حذف فایل ندارید');
                    }
                    else {
                        ivsAlert2('error', 'خطای عدم ارتباط با سرور', 'شما دسترسی برای حذف فایل نداریدبا پشتیبانی تماس بگیرید');

                    }
                    //console.log(ex);
                    //console.log(bb);
                },

            });
        }

        async function getValidFileTypes() {
            let data = await $.ajax({
                type: "get",
                url: settings.getValidFileTypes,
                contentType: "application/json; charset=utf-8",
                success: async function (result) {
                    //document.getElementById("filedoc").accept = result;
                    return result;
                },
                error: function (ex, cc, bb) {

                    ivsAlert('اشکال در برقراری ارتباط با سرور - بخش نوع فایل', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                }
            });
            return data;

        }

        async function checkTypeFiles(fileName) {
            let validFileTypes = await getValidFileTypes();

            let typeFile = fileName.split('.').pop();
            typeFile = typeFile.toLowerCase();

            let result = validFileTypes.toLowerCase().includes(typeFile);

            return result;
        }

        async function getmaximumFileSizeKilobytes() {
            let data = await fetch(settings.getmaximumFileSizeKilobytes)
                .then((response) => response.json())
                .then(data => {
                    return data;
                })
                .catch(error => {
                    ivsAlert('اشکال در برقراری ارتباط با سرور - خطا در اجرا  گرفتن ماکس فایل', 'خطا', 'error');
                    console.error(error);
                });
            return data;
        }

        async function addDocServer(area) {
            //let formAddDoc = area.find('#formAddDoc');
            ;
            $("#des-Doc").addClass("successInput");

            var countErrors = 0;

            if ($("#title-Doc").val() == "") {
                countErrors++;
                $("#title-Doc").addClass("errorInput");
                $("#title-Doc").removeClass("successInput");
                $("#title-Doc-error").text("لطفا عنوان فایل را وارد کنید");
            }
            else {
                $("#title-Doc").removeClass("errorInput");
                $("#title-Doc").addClass("successInput");
                $("#title-Doc-error").text("");
            }

            if ($("#filedoc").val() == "" || $("#filedoc").val() == null) {
                countErrors++;
                $("#filedoc").addClass("errorInput");
                $("#filedoc").removeClass("successInput");
                $("#filedoc-error").text("لطفا یک فایل با فرمت خواسته شده وارد کنید");
            }
            else {
                $("#filedoc").removeClass("errorInput");
                $("#filedoc").addClass("successInput");
                $("#filedoc-error").text("");
            }


            var checkTypeFile = await checkTypeFiles($("#filedoc").val());
            var validFileTypesServer = await getValidFileTypes();

            if (!checkTypeFile) {
                countErrors++;
                $("#filedoc").addClass("errorInput");
                $("#filedoc").removeClass("successInput");
                $("#filedoc-error").text("فرمت وارد شده معتبر نمی باشد");
                ivsAlert2("error", "پیام خطا", `فرمت فایل وارد شده معتبر نمی باشد. فرمت های معتبر "${validFileTypesServer}" می باشند.`);
                return false;
            }


            if (countErrors > 0) {
                return;
            }

            loadingClass("btn-addDoc", true, true);

            var getMax = await getmaximumFileSizeKilobytes();
            var filedoc = document.getElementById('filedoc');
            var fileSize = filedoc.size;

            if (fileSize > getMax) {
                ivsAlert2("error", "پیام خطا", `حجم فایل آپلود شده بیش از حد مجاز است. حد مجاز برابر ${getMax} بایت میباشد `);

                return false;
            }


            var model = new FormData();
            model.append("file", $("#filedoc")[0].files[0]);


            $.ajax({
                type: "post",
                url: settings.postUploadFile,
                data: model,
                processData: false,
                contentType: false,
                success: async function (result) {
                    var infoDoc = {
                        title: $("#title-Doc").val(),
                        comment: $("#des-Doc").val(),
                        fileID: result,
                        fileName: $('#filedoc').val().split('\\').pop(),
                        doucumentGroupID: settings.requestDocumentGroupID,
                        facilityRequestID: settings.objectId,
                    }

                    $.ajax({
                        type: "post",
                        url: settings.postDocumentToRequest,
                        data: JSON.stringify(infoDoc),
                        contentType: "application/json; charset=utf-8",
                        success: async function (result) {
                            //console.log(result);
                            loadingClass("btn-addDoc", true, true);

                            //if (settings.requestDocumentGroupID != null) {
                            //    await docTemplate();
                            //}
                            //else {
                            //    await gDocTemplate();
                            //}

                            buildInterface();

                            resetFormDoc();

                            //$('#modalAddDocuments').modal('hide');

                            //area.html(await getTemplate());
                            $('.bootbox-close-button').last().click();
                            ivsAlert2("success", "پیام موفقیت", "مدرک با موفقیت بارگذاری شد");
                        },
                        error: function (ex, cc, bb) {
                            if (ex.responseText.includes("WorkflowActionIsNotAvailableForTheRole")) {
                                ivsAlert2('error', 'خطای عدم دسترسی', 'شما دسترسی برای افزودن فایل ندارید');
                            }
                            else {
                                ivsAlert2('error', 'خطای عدم ارتباط با سرور', 'شما دسترسی برای حذف فایل نداریدبا پشتیبانی تماس بگیرید');

                            }
                            //console.log(ex);
                            //console.log(cc);
                            //console.log(bb);
                            loadingClass("btn-addDoc", true, true);

                        }

                    });


                },
                error: function (ex, cc, bb) {
                    ivsAlert('اشکال در برقراری ارتباط با سرور برای اپلود فایل', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                    loadingPlugin($("#btn-add-doc"), false);

                }

            });
        }

        function resetFormDoc() {
            area.find("#title-Doc").removeClass("errorInput");
            area.find("#title-Doc").removeClass("successInput");
            area.find("#title-Doc-error").text("");
            area.find("#title-Doc").val("");


            area.find("#des-Doc").removeClass("successInput");
            area.find("#des-Doc").val("");

            area.find("#filedoc").removeClass("errorInput");
            area.find("#filedoc").removeClass("successInput");
            area.find("#filedoc-error").text("");
            area.find("#filedoc").val("");

            //resetForm('formAddDoc');
        }

        this.destroy = function () {
            if (settings.addTemplate) {
                area.html('');
            }
        };



        buildInterface();




        return this;
    }

}(jQuery));
