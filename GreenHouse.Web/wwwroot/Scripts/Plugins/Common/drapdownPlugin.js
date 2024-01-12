(function ($) {
    $.fn.drapdownPlugin = function (options) {
        var settings = $.extend({
            //require
            apiAddress: null,
            valueOption: null,
            textOption: null,
            idTagName: null,

            //option
            paramsApi: '',
            title: '',
            isLinqSource: false,
            isMultiSelect: false,
            isRequire: false,
            textRequire: 'این فیلد اجباری است.',
            typeApi: 'get',
            dropdownParent: null,
            defaultValue: [],
        }, options);

        var viewModel = undefined;
        var area = this;

        buildInterface();

        function buildInterface() {

            area.html(getTemplate());

            if (settings.apiAddress == null || settings.valueOption == null || settings.textOption == null || settings.idTagName == null) {
                area.html(cardAlert('فیلدهای اجباری را کامل وارد کنید.', 'خطا', 'error'));
                return;
            }


            getDataSource();
        }

        function getDataSource() {
            $.ajax({
                type: settings.typeApi,
                url: settings.apiAddress + settings.paramsApi,
                success: function (result) {
                    ;
                    createUi(result);
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


        function createUi(data) {
            var result = null;
            if (settings.isLinqSource == true) {
                ;
                result = data.data;
            }
            else {
                result = data;
            }

            if (result.length > 0) {
                area.find(`#${settings.idTagName}`).html("");
                ss = "";

                for (var i = 0; i < result.length; i++) {
                    let tempData = result[i];
                    var getTypeValueOption = typeof (tempData[settings.valueOption]);
                    var compareTempData = tempData[settings.valueOption];
                    if (getTypeValueOption != "number") {
                        compareTempData = String(tempData[settings.valueOption])
                    }
                    var str = "";
                    if (settings.defaultValue.length > 0 && settings.defaultValue.includes(compareTempData)) {
                        str = `
                            <option selected value="${tempData[settings.valueOption]}">${tempData[settings.textOption]} </option>
                        `;
                    }
                    else {
                        str = `
                            <option value="${tempData[settings.valueOption]}">${tempData[settings.textOption]} </option>
                        `;
                    }


                    ss += str;
                }
                area.find(`#${settings.idTagName}`).html(ss);

            }
        }

        function getTemplate() {

            var ss = `
                <label for="${settings.idTagName}" class="form-label">${settings.title}</label>
                <select ${settings.isMultiSelect ? `multiple="multiple"` : ``}" class="${settings.isMultiSelect ? `multiple-select` : `single-select`}" id="${settings.idTagName}" name="${settings.idTagName}"
                       ${settings.isRequire ? `data-val-required="${settings.textRequire}"                           
                           data-val="true"
                           required="required"` : ""
                }>
                    <option disabled>گزینه ای تعریف نشده است</option>
                </select>
                <div class="invalid-feedback" data-valmsg-for="${settings.idTagName}" data-valmsg-replace="true" for="${settings.idTagName}"></div>

                ${settings.isMultiSelect ?
                    `<script>
                    $('.multiple-select').select2({
			            theme: 'bootstrap4',
			            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
			            placeholder: $(this).data('placeholder'),
			            allowClear: Boolean($(this).data('allow-clear')),
                        ${settings.dropdownParent != null ? `dropdownParent: $('#${settings.dropdownParent}')` : ''}
                        

		            });
                    </script>`
                    :
                    `<script>
                    $('.single-select').select2({
			            theme: 'bootstrap4',
			            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
			            placeholder: $(this).data('placeholder'),
			            allowClear: Boolean($(this).data('allow-clear')),
                        ${settings.dropdownParent != null ? `dropdownParent: $('#${settings.dropdownParent}')` : ''}

		            });
                    </script>`
                }
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
