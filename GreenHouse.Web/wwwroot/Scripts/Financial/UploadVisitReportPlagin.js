var permitions = {};
(function ($) {

    $.fn.UploadVisitReportDoc = function (options) {
        var settings = $.extend({
            documentGroupId: null,
            VisitReportID: null,
            permitions: {},
            rools: []

        }, options);
        permitions = settings.permitions;

        if (settings.VisitReportID == null) {
            throw 'VisitReportID Canot be null'
        }
        var area = this;




        async function addDocumentForm(groupId, _VisitReportID, groupTypeId) {
            var validFileTypes = await getValidFileTypes();



            var data = `
                <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title text-primary"> افزودن مستندات </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" id="btn-close-formDoc" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="text-align:justify">
            <div class="col-lg-12">
                <div class="border border-3 p-4 rounded">
                    <form id="formAddDoc" class="row g-3 needs-validation">
                        <input type="hidden" id="currentGroupid"/>

                        <div class="mb-3">
                            <label for="title-Doc" class="form-label">عنوان مدرک</label>
                            <input type="text" class="form-control" id="title-Doc" name="title-Doc"
                                   data-val="true"
                                   data-val-required="لطفا عنوان مدرک را وارد نمایید"
                                   required>
                            <div class="invalid-feedback" data-valmsg-for="title-Doc" data-valmsg-replace="true" for="title-Doc"></div>
                        </div>
                        <div class="mb-3">
                            <label for="inputProductDescription" class="form-label">توضیحات</label>
                            <textarea class="form-control" id="des-Doc"
                                      rows="3"></textarea>
                        </div>
                        <div class="">
                            <label for="inputProductDescription" class="form-label">بارگذاری مدرک </label>
                            <input class="form-control" id="file-doc" type="file"
                                   required>
                            <div class="invalid-feedback">لطفا فایل مدرک را وارد نمایید</div>
                        </div>

                        <div class="mb-3">
                            <button type="button"   class="form-control btn btn-primary btn_addDocServer" id="btn-add-doc">افزودن</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>`
            bootbox.dialog({
                message: data
            }).on('shown.bs.modal', function (e) {

                $(".btn_addDocServer").click(function () {
                    addDocServer(groupId, _VisitReportID, groupTypeId);
                });

            });
        }


        async function getValidFileTypes() {

            let data = $.ajax({
                type: "get",
                url: "/api/dms/getValidFileTypes",
                contentType: "application/json; charset=utf-8",
                success: async function (result) {
                    // document.getElementById("file-doc").accept = result;
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



        async function addDocServer(documentGroupId, _VisitReportID, documentGroupTypeId) {
            let formAddDoc = document.getElementById('formAddDoc');
            if (!$("#formAddDoc").valid()) {
                formAddDoc.classList.add('was-validated');
                return false;
            }


            loading('btn-add-doc', true, true);

            var getMax = await getmaximumFileSizeKilobytes();
            var filedoc = document.getElementById('file-doc');
            var fileSize = filedoc.size;

            if (fileSize > getMax) {
                ivsAlert2("error", "پیام خطا", `حجم فایل آپلود شده بیش از حد مجاز است. حد مجاز برابر ${getMax} بایت میباشد `);

                return false;
            }


            var model = new FormData();
            model.append("file", $("#file-doc")[0].files[0]);


            $.ajax({
                type: "post",
                url: "/api/DMS/UploadFile",
                //dataType: "json",
                data: model,
                processData: false,
                contentType: false,
                success: function (result) {
                    //console.log(result);
                    var infoDoc = {
                        title: $("#title-Doc").val(),
                        comment: $("#des-Doc").val(),
                        fileID: result,
                        fileName: $('#file-doc').val().split('\\').pop(),
                        doucumentGroupID: documentGroupId,
                        visitReportId: _VisitReportID,
                    }

                    $.ajax({
                        type: "post",
                        url: "/api/FinancialDMS/PostDocumentToVisitReport",
                        contentType: 'application/json',
                        //data: infoDoc,
                        data: JSON.stringify(infoDoc),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {

                            //console.log(result);
                            loading('btn-add-doc', false, true);
                            resetForm('formAddDoc');
                            getRequiredFiles(_VisitReportID, documentGroupTypeId);
                            $('#btn-close-formDoc').click();
                            ivsAlert2("success", "پیام موفقیت", "مدرک با موفقیت بارگذاری شد");
                            getRequiredFiles(_VisitReportID, documentGroupTypeId);
                        },
                        error: function (ex, cc, bb) {
                            ivsAlert('اشکال در برقراری ارتباط با سرور برای ثبت اطلاعات مدرک', 'خطا', 'error');
                            //console.log(ex);
                            //console.log(cc);
                            //console.log(bb);
                            loading('btn-add-doc', false, true);

                        }

                    });


                },
                error: function (ex, cc, bb) {
                    ivsAlert('اشکال در برقراری ارتباط با سرور برای اپلود فایل', 'خطا', 'error');
                    //console.log(ex);
                    //console.log(bb);
                    loading('btn-add-doc', false, true);

                }

            });
        }

        async function getRequiredFiles(_VisitReportID, documentGroupTypeID) {

            var rools = settings.rools;
            let indexEditDocuments = -1;



            $.each(permitions, function (a, b) {
                if (rools.indexOf(b.RoleName) != -1 && b.StateActionName === "VisitReportEditDocument") {
                    indexEditDocuments = 1;
                }
            });

            $.ajax({
                url: "/api/FinancialDMS/GetvisitReportDocuments/?VisitReportId=" + _VisitReportID + "&docuntGrouTypeId=" + documentGroupTypeID,
                type: "GET",
                success: function (res) {
                    // alert('succes');

                    $.each(res, function (a, b) {
                        var divitems = $('#files_group' + b.groupId);
                        divitems.html('');
                        $.each(b.uploadedDocuments, function (c, d) {
                            var file = `<div class="list-inline d-flex customers-contacts ms-auto" style="margin-top: 5px;">
                                                         <a data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="دانلود فایل" href="/api/DMS/download/${d.latestFileID}" download class="list-inline-item cursor-pointer  btn-outline-success"><i class='bx bx-download'></i></a>
                                                                  ${indexEditDocuments != -1 ? `<a data-bs-toggle="tooltip"  data-bs-placement="bottom" title="" data-bs-original-title="حذف فایل" data-visidId="${_VisitReportID}" data-docGroupId="${d.id}" data-lastName="${d.latestFileName}" data-groupTypeId="${documentGroupTypeID}" class="list-inline-item cursor-pointer btn-outline-danger btn-removeDoc"><i class='bx bx - trash - alt'></i></a>` : ""
                                }
                                                           <span style="margin-top: 6px;margin-right: 10px"> ${d.title} </span></div>`

                            divitems.append(file);

                        });
                    });

                    $(".btn-removeDoc").click(function () {
                        let VisitReportID = $(this).attr('data-visidId');
                        let docId = $(this).attr('data-docGroupId');
                        let fileName = $(this).attr('data-lastName');
                        let groupId = $(this).attr('data-groupTypeId');

                        removeDoc(VisitReportID, docId, fileName, groupId);
                    });
                }
            });
        }
        async function getmaximumFileSizeKilobytes() {

            let data = await fetch("/api/dms/getmaximumFileSizeKilobytes")
                .then((response) => response.json())
                .then(data => {


                    return data;

                })
                .catch(error => {
                    ivsAlert('اشکال در برقراری ارتباط با سرور - خطا در اجرا  گرفتن ماکس فایل', 'خطا', 'error');
                    console.error(error);
                });

            //debugger
            return data;

        }

        function removeDoc(VisitReportID, docId, fileName, groupId) {

            bootbox.confirm(`آیا از حذف ${fileName} مطمئن هستید؟`, function (a) {
                if (a) {


                    loading('removeBtnDoc', true, true);

                    $.ajax({
                        type: "delete",
                        url: "/api/FinancialDMS/RemoveDocumentToVisitReport?ID=" + VisitReportID + '&DocumentId=' + docId,
                        success: function (result) {
                            //console.log(result);

                            getRequiredFiles(VisitReportID, groupId);
                            loading('removeBtnDoc', false, true);
                            ivsAlert2("success", "پیام موفقیت", "مدرک مورد نظر حذف شد");


                        },
                        error: function (ex, cc, bb) {
                            ivsAlert('اشکال در حذف فایل', 'خطا', 'error');
                            loading('removeBtnDoc', false, true);

                            //console.log(ex);
                            //console.log(bb);
                        },

                    });
                }

            });
        }


        function checkValidation() {

            var allgroup = this.find('.formDocs');
            if (allgroup.length == 0) {
                ivsAlert2("error", `خطا در بارگذاری صفحه`);
                return false;
            }
            var result = true;
            $.each(allgroup, function (a, b) {

                var isrequerd = $(b).data('isrequerd');
                var countupload = $(b).find('.Docs').find('.customers-contacts').length;

                if (isrequerd == true && countupload == 0) {

                    var xx = $(b).find('.card-header span').html();
                    ivsAlert2("error", `وارد کردن ${xx} الزامی می باشد `);
                    result = false;
                    return false;
                }
            });
            return result;
        }


        $.ajax({
            url: "/api/FinancialDMS/GetDocumentGroups?DocumentGroupTypeId=" + settings.documentGroupId,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                let IsAccessEdit = -1;
                $.each(permitions, function (a, b) {
                    if (settings.rools.indexOf(b.RoleName) != -1 && b.StateActionName === "VisitReportEditDocument") {
                        IsAccessEdit = 1;
                    }
                });

                $.each(res, function (a, b) {
                    var data = `<div id="formDoc${b.id}" class="card m-2   rounded formDocs" data-isrequerd="${b.isRequired}">
                                                                     <div class="card-header">
                                                                              <span>`+ b.title + `</span>${b.isRequired ? "<span style='color:red'>*</span>" : ""}
                                                                          </div>
                                                                    <div class="card-body">
                                                                        <div class="row">`+ (IsAccessEdit != 1 ? "" : `
                                                                           <button class="btn btn-outline-dark addDocumnetForm"   data-id="${b.id}" data-VisitReportID="${settings.VisitReportID}" data-documentGroupId="${settings.documentGroupId}">افزودن فایل</button>`) + `
                                                                                      <br/>  <div class="Docs" id="files_group`+ b.id + `"></div>
                                                                        </div>
                                                                    </div>
                                                                    </div>`

                    area.append(data);
                });

                getRequiredFiles(settings.VisitReportID, settings.documentGroupId);

                area.find(".addDocumnetForm").click(function () {

                    let groupId = $(this).attr('data-id');
                    let _VisitReportID = $(this).attr('data-VisitReportID');
                    let groupTypeId = $(this).attr('data-documentGroupId');

                    addDocumentForm(groupId, _VisitReportID, groupTypeId);

                });
            }
        });

        return this;
    }



})(jQuery);

$('#closeForm').click(function () {

    bootbox.hideAll();
});

