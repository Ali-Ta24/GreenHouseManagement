(function ($) {
    $.fn.documentPlugin = function (options) {
        var settings = $.extend({

            ///require
            objectId: null,

            getFacilityRequestRequiredDocuments: '/api/Facility/GetFacilityRequestRequiredDocuments',

            isViewDocuments: 1,
            isAddDocuments: 1,
            isEditDocuments: 1,

            addTemplate: true,

        }, options);

        var viewModel = {
            listDocumentGroupID: []
        };
        var area = this;

        buildInterface();

        async function buildInterface() {

            await getFacilityRequestRequiredDocuments();

            if (settings.addTemplate) {
                area.html(await getTemplate());
            }

            await calluploadFilePlugin();

        }

        function calluploadFilePlugin() {
            if (viewModel.listDocumentGroupID.length == 0) {
                return;
            }

            var number = 1;

            for (var i = 0; i < viewModel.listDocumentGroupID.length; i++) {
                $(`#doc${number}`).uploadFilePlugin({
                    objectId: settings.objectId,
                    requestDocumentGroupID: viewModel.listDocumentGroupID[i].requestRequiredDocumentGroupID,
                    title: viewModel.listDocumentGroupID[i].title,
                    required: viewModel.listDocumentGroupID[i].required,
                    number: number,
                    isViewDocuments: settings.isViewDocuments,
                    isAddDocuments: settings.isAddDocuments,
                    isEditDocuments: settings.isEditDocuments,
                });

                number++;
            }

        }

        async function getFacilityRequestRequiredDocuments() {
            var data = await $.ajax({
                type: "get",
                url: settings.getFacilityRequestRequiredDocuments + '?id=' + settings.objectId,
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
            viewModel.listDocumentGroupID = [...data];

            return data;

            //console.log(viewModel.listDocumentGroupID);

            var cardDownload = "";

            if (data.length == 0) {
                return "هیچ نوع مستنداتی وجود ندارد";
            }

            for (var i = 0; i < data.length; i++) {

                let strDoc = `
                    <div id="doc${number}">${number}</div>
                    <br/>
				`;
                number++;
                cardDownload += strDoc;
            }

            return cardDownload;
        }

        async function getTemplate() {
            var card = "";
            if (viewModel.listDocumentGroupID.length == 0) {
                card = "هیچ نوع مستنداتی وجود ندارد";
                return card;
            }

            var number = 1;
            for (var i = 0; i < viewModel.listDocumentGroupID.length; i++) {

                let strDoc = `
                   <div id="doc${number}"></div>
                   <br/>
                `;
                number++;
                card += strDoc;
            }

            //card = `<div id="test"></div>`;
            card = minifyHtml(card);
            return card;
        }


        this.destroy = function () {
            if (settings.addTemplate) {
                area.html('');
            }
        };
        return this;
    }

}(jQuery));
