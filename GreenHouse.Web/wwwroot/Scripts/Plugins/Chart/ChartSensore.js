(function ($) {
    $.fn.ChartSensore = function (options) {
        var settings = $.extend({
            AllItemsTemperatureSensorApiAddress: "/api/TemperatureSensor/GetTemperatureSensors",

            hasTemplate: true
        }, options);
        var area = this;
        var ctrl = null;
        buildInterface();
        function buildInterface() {
            area.html(getTemplate());
        }


        function getTemplate() {
            var allSensore;
            $.ajax({
                type: "get",
                url: settings.AllItemsTemperatureSensorApiAddress,
                contentType: 'application/json',
                success: function (result) {
                    console.log(result);
                    if (result == null || result == undefined || result.length == 0) {
                        ivsAlert2('warning', 'اخطار', 'ابتدا باید حداقل یک سالن اضافه کنید');
                    }
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                }
            });
            var template = `<div data-message-role="main"></div>`;
            return template;
        }
        return this;
    }
})(jQuery)