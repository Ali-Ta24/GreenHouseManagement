(function ($) {
    $.fn.sample = function (options) {
        var settings = $.extend({
            hasTemplate: true
        }, options);
        var area = this;
        var ctrl = null;
        buildInterface();
        function buildInterface() {
            area.html(getTemplate());
            area.find('[data-message-role="main"]').sample2();
        }
        function getTemplate() {
            var template = `<div data-message-role="main"></div>`;
            return template;
        }
        return this;
    }
})(jQuery)