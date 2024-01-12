
(function ($) {
    $.fn.w_countOfFacilityInSpecialStep = function (options) {

        var widgetArea = this;
        var grid = null;
        var settings = $.extend({
            widget: null,
            getCountOfFacilityInSpecialStep: '/api/CoreReports/GetCountOfFacilityInSpecialStep',
            timePeriod: 2,
            numberFewAgo: 1,

        }, options);
        var thisObjectID = null;
        var viewModel = null;

        widgetArea.html("");
        buildInterface();
        function buildInterface() {

            widgetArea.html(getTemplate());

        }

        this.reBind = function (type, objectID) {


            $.ajax({
                url: settings.getCountOfFacilityInSpecialStep,
                type: 'GET',
                success: function (data) {
                    if (data.length == 0) {
                        widgetArea.find('#getCountOfFacilityInSpecialStepChart').html("اطلاعاتی جهت نمایش وجود ندارد");
                    }
                    else {
                        categories = [];
                        registerData = [];

                        for (var i = 0; i < data.length; i++) {
                            categories.push(data[i].formalName);
                            registerData.push(data[i].count);
                        }

                        loadChart(categories, registerData);
                    }

                },
                error: function (x, y, z) {
                    alert(x + '\n' + y + '\n' + z);

                }
            });

        };



        function loadChart(categories, registerData) {
            var options = {
                series: [{
                    data: registerData
                }],
                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        columnWidth: '45%',
                    },
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return value;
                        },
                        maxWidth: 260,
                        rotate: 0,
                    },
                },
                dataLabels: {
                    enabled: false,
                    offsetX: 0,
                },
                xaxis: {
                    categories: categories
                    
                }
            };
            var chartArea = widgetArea.find('#getCountOfFacilityInSpecialStepChart');
            var chart = new ApexCharts(chartArea[0], options);
            chart.render();

        }

        function getTemplate() {
            var s = `               
				<div class="card-body">
					<div id="getCountOfFacilityInSpecialStepChart"></div>
				</div>
            `;

            s = minifyHtml(s);
            //s = localizationstring(s);
            return s;
        }

        this.setWidgetConfigObject = function (obj) {

            if (obj) {
                settings.configObject = obj;
            }
            //buildInterface();
            //this.reBind(dashType, thisObjectID);
        };

        this.containerSizeChanged = function (e) {

        };

        this.destroy = function () {

        };

        return this;
    }

}(jQuery));


dashboardWidgets["73afe9af-30e6-4100-a784-ce773f0cacb6"] = {

    createWidget: function (item, w, c) {

        return $(item).w_countOfFacilityInSpecialStep({ widget: w});
    }
    //createSettings: function (item, c) {
    //    return $(item).w_registeredAndAcceptedRequestAmountsByTimePeriodSettings({ configObject: c });
    //},
};
