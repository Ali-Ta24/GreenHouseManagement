
//aec919fa-4ac2-4b13-9ed4-f9d0a4e06b2a


(function ($) {
    $.fn.w_averageStepTimes = function (options) {


        var widgetArea = this;

        var settings = $.extend({
            widget: null,
            getAverageStepTimesApiAddress: '/api/CoreReports/GetStepTimes',

        }, options);


        widgetArea.html("");

        widgetArea.html(getTemplate());
        buildInterface(widgetArea);
        function buildInterface(area) {

        }

        this.reBind = function (type, objectID) {


            // kendo.ui.progress(hh, true);

            $.ajax({
                url: settings.getAverageStepTimesApiAddress,
                //url: settings.startWfApiAddress ,
                type: 'GET',


                success: function (data) {
                    categories = [];
                    seriesData = [];

                    for (var i = 0; i < data.length; i++) {
                        categories.push(data[i].formalName);
                        seriesData.push(data[i].totalTimeSeconds / (60.0 * 60.0 * 24.0));
                    }

                    loadChart(categories, seriesData);

                    //kendo.ui.progress(hh, false);
                },
                error: function (x, y, z) {
                    alert(x + '\n' + y + '\n' + z);
                    //kendo.ui.progress(hh, false);
                }
            });

        }

        function loadChart(categories, seriesData) {
            //console.log(categories);
            //console.log(seriesData);
            var options = {
                series: [{
                    name: 'تمامی تسیهلات که وارد فرآیند تایید شده اند',
                    data: seriesData

                }],
                chart: {
                    foreColor: '#9ba7b2',
                    type: 'bar',
                    height: 500,
                    stacked: false,
                    toolbar: {
                        show: false
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        columnWidth: '45%',
                        endingShape: 'rounded'
                    },
                },
                legend: {
                    show: true,
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: -20,
                    offsetY: 5
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 3,
                    colors: ['transparent']
                },
                colors: ["#8833ff", '#cba6ff'],
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return value;
                        },
                        maxWidth: 260,
                        rotate: -30,
                    },
                },
                xaxis: {
                    categories: categories,

                },
                grid: {
                    show: true,
                    borderColor: '#ededed',
                    //strokeDashArray: 4,
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    theme: 'dark',
                    y: {
                        formatter: function (val) {
                            return "" + getSecondsString(val);
                        }
                    }
                }
            };
            //console.log(widgetArea);
            var chartArea = widgetArea.find('[data-wAverageStepTimes="main"]');
            //console.log(chartArea);
            var chart = new ApexCharts(chartArea[0], options);
            chart.render();
        }
        function getSecondsString(value) {
            var s = "";
            var hasDays = false;
            var hasHours = false;
            var hasMinuts = false;
            var days = Math.floor(value);

            if (days >= 1) {
                s += Math.floor(value) + " روز";
                hasDays = true;
            }
            var hours = (value % 1) * 24;

            if (hours >= 1) {
                if (hasDays) {
                    s += " و ";
                }
                s += Math.floor(hours) + " ساعت";
                hasHours = true;
            }
            var minuts = (hours % 1) * 60;
            if (minuts >= 1) {
                if (hasDays || hasHours) {
                    s += " و ";
                }
                s += Math.floor(minuts) + " دقیقه";
                hasMinuts = true;
            }
            var seconds = (minuts % 1) * 60;

            if (seconds >= 1) {
                if (hasDays || hasHours || hasMinuts) {
                    s += " و ";
                }
                s += Math.floor(seconds) + " ثانیه";

            }
            //console.log("v:" + value + ",days " + days + ",hours " + hours + ",minuts " + minuts + ",seconds " + seconds)
            return s;
        }
        function getTemplate() {
            var s = "";
            s += '<div data-wAverageStepTimes="main"></div>';

            s = minifyHtml(s);

            return s;
        }
        this.getWidgetConfigObject = function () {

        }

        this.setWidgetConfigObject = function (obj) {

        }
        this.containerSizeChanged = function () {

        }

        this.destroy = function () {

        }

        return this;

    }

}(jQuery));


dashboardWidgets["a5660356-2693-433f-8c66-a29d5c4a887c"] = {
    createWidget: function (item, config) {
        return $(item).w_averageStepTimes({ widget: config });
    }
}

