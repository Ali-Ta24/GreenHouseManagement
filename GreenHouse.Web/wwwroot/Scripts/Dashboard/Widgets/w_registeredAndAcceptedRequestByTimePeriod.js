
(function ($) {
    $.fn.w_registeredAndAcceptedRequestByTimePeriod = function (options) {

        var widgetArea = this;
        var grid = null;
        var settings = $.extend({
            widget: null,
            getRegisteredAndAcceptedRequestByTimePeriod: '/api/CoreReports/getRegisteredAndAcceptedRequestByTimePeriod',
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


            var timePeriod = 2;
            var numberFewAgo = 1;

            if (settings.configObject != undefined || settings.configObject != null) {
                timePeriod = settings.configObject.timePeriod;
                numberFewAgo = settings.configObject.numberFewAgo;
            }

            var end = '';
            var start = '';

            var dateNow = new Date();

            if (timePeriod == 2) {
                //end = dateNow.getFullYear() + '-' + dateNow.getMonth() + 1 + '-' + dateNow.getDate();
                //var tempStart = new Date(dateNow.getFullYear(), dateNow.getMonth() + 2 - numberFewAgo, dateNow.getDate());

                //startDate = dateNow.getDate();

                //if (dateNow.getDate() == 31) {
                //    startDate = 30;
                //}

                //start = tempStart.getFullYear() + '-' + tempStart.getMonth() + '-' + startDate

                var yearstart = dateNow.getFullYear() - 1;
                var mounthstart = dateNow.getMonth() + 3;
                start = yearstart + '-' + mounthstart + '-' + dateNow.getDate();

                var tempStart = new Date(dateNow.getFullYear(), dateNow.getMonth() + 2 - numberFewAgo, dateNow.getDate() - 1);
                startDate = dateNow.getDate();

                if (dateNow.getDate() == 31) {
                    startDate = 30;
                }
                var mounth = tempStart.getMonth() + 1
                end = tempStart.getFullYear() + '-' + mounth + '-' + startDate
            }
            else if (timePeriod == 1) {
            }




            $.ajax({
                url: settings.getRegisteredAndAcceptedRequestByTimePeriod + "?TimePeriod=" + timePeriod + '&start=' + start + '&end=' + end,
                type: 'GET',


                success: function (data) {
                    if (data.length == 0) {
                        widgetArea.find('#registeredAndAcceptedRequestByTimePeriodChart').html("اطلاعاتی جهت نمایش وجود ندارد");
                    }
                    else {
                        categories = [];
                        registerData = [];
                        accentData = [];

                        for (var i = 0; i < data.length; i++) {
                            categories.push(data[i].title);
                            registerData.push(data[i].registeredItems);
                            accentData.push(data[i].acceptedItems);
                        }

                        loadChart(categories, registerData, accentData);
                    }

                },
                error: function (x, y, z) {
                    alert(x + '\n' + y + '\n' + z);

                }
            });

        };



        function loadChart(categories, registerData, accentData) {
            var options = {
                series: [{
                    name: 'تعداد تسهیلات تایید شده در حال گذراندن فرایند چرخه تسهیلات ',
                    data: registerData
                }, {
                    name: ' تعداد تسهیلات ثبت شده و پایان یافته در چرخه تسهیلات و شروع فرایند مالی ',
                    data: accentData
                }],
                chart: {
                    foreColor: '#9ba7b2',
                    type: 'bar',
                    height: 360
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                title: {
                    text: 'نمودار تعداد درخواست‌های ثبت و تایید در هرماه ',
                    align: 'right',
                    style: {
                        fontSize: '14px'
                    }
                },
                colors: ["#29cc39", '#e62e2e'],
                xaxis: {
                    categories: categories,
                },
                yaxis: {
                    title: {
                        text: 'تعداد (عدد)'
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return " " + val + "  عدد"
                        }
                    }
                }
            };
            //console.log(widgetArea);
            var chartArea = widgetArea.find('#registeredAndAcceptedRequestByTimePeriodChart');
            //console.log(chartArea);
            var chart = new ApexCharts(chartArea[0], options);
            chart.render();

          
        }

        function getTemplate() {
            var s = `               
				<div class="card-body">
					<div id="registeredAndAcceptedRequestByTimePeriodChart"></div>
				</div>
            `;

            s = minifyHtml(s);
            //s = localizationstring(s);
            return s;
        }

        this.setWidgetConfigObject = function (obj) {
            //debugger
            if (obj) {
                settings.configObject = obj;
            }
            //this.reBind(dashType, thisObjectID);
        };

        this.containerSizeChanged = function (e) {

        };

        this.destroy = function () {

        };

        return this;
    }

}(jQuery));

(function ($) {
    $.fn.w_registeredAndAcceptedRequestByTimePeriodSettings = function (options) {

        var widgetSettingsArea = this;
        var viewModel = null;

        var settings = $.extend({
            configObject: null
        }, options);

        widgetSettingsArea.html(getTemplate());
        buildInterface();

        function buildInterface() {

            //Default config object
            if (!settings.configObject) {
                settings.configObject = {
                    timePeriod: 2,
                    numberFewAgo: 1,
                }
            }
            else {

                widgetSettingsArea.find("#timePeriod").val(settings.configObject.timePeriod);
                widgetSettingsArea.find("#numberFewAgo").val(settings.configObject.numberFewAgo);

            }

        }

        function getTemplate() {
            return `
                 <div class="row">
                   <div class="col-md-12">
						<label for="timePeriod" class="form-label">نوع نمایش</label>
						<select class="form-select" id="timePeriod" >
							<option selected value="2">ماهانه</option>
						</select>
					</div>
                    <div class="col-md-12">
						<label for="numberFewAgo" class="form-label">چند هفته/ماه قبل</label>
						<input value="1" type="number" class="form-control" id="numberFewAgo" min="1">
                        <span for="numberFewAgo" class="form-label text-danger">حداقل مقدار وارد شده باید عدد 1 باشد.</span>
					</div>
                </div>
            `;
        }


        this.getConfigObject = function () {

            viewModel = {
                timePeriod: widgetSettingsArea.find("#timePeriod").val(),
                numberFewAgo: widgetSettingsArea.find("#numberFewAgo").val(),
            }

            return viewModel;

            //return viewModel.get("configObject");
        };

        this.destroy = function () {

        };

        return this;

    }
}(jQuery));


dashboardWidgets["9289e702-b857-43cf-8fbd-dd4431d358cd"] = {

    createWidget: function (item, w, c) {

        return $(item).w_registeredAndAcceptedRequestByTimePeriod({ widget: w, configObject: c });
    },
    createSettings: function (item, c) {
        return $(item).w_registeredAndAcceptedRequestByTimePeriodSettings({ configObject: c });
    },
};
