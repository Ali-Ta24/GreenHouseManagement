(function ($) {
    $.fn.ChartSensore = async function (options) {
        var settings = $.extend({
            AllItemsTemperatureSensorApiAddress: "/api/TemperatureSensor/GetTemperatureSensors",
            GetTemperatureSensorsDetailForChart: "/api/TemperatureSensorDetail/GetTemperatureSensorsDetailForChart",

            AllItemsHumiditySensorApiAddress: "/api/HumiditySensor/GetHumiditySensors",
            GetHumiditySensorsDetailForChart: "/api/HumiditySensorDetail/GetHumiditySensorsDetailForChart",

            AllItemsLightIntensitySensorApiAddress: "/api/LightIntensitySensor/GetLightIntensitySensors",
            GetLightIntensitySensorsDetailForChart: "/api/LightIntensitySensorDetail/GetLightIntensitySensorsDetailForChart",

            hasTemplate: true
        }, options);
        var area = this;
        var ctrl = null;
        buildInterface();
        async function buildInterface() {
            var tmp = await getTemplateTemperatureSensorChart();
            tmp += await getTemplateHumiditySensorChart();
            tmp += await getTemplateLightIntensitySensorChart();
            area.html(tmp)
        }
        async function getTemplateTemperatureSensorChart() {
            var allSensorId;
            var sensorDetailValue = [];
            var sensorDetailModified = [];
            var sensorName = [];
            var template = ``;
            await $.ajax({
                type: "get",
                url: settings.AllItemsTemperatureSensorApiAddress,
                contentType: 'application/json',
                success: function (result) {
                    allSensorId = result.data.map(function (item) {
                        return item.id;
                    });
                    if (result == null || result == undefined || result.length == 0) {
                        ivsAlert2('warning', 'اخطار', 'ابتدا باید حداقل یک سالن اضافه کنید');
                    }
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                }
            });
            for (var i = 0; i < allSensorId.length; ++i) {
                await $.ajax({
                    type: "get",
                    url: settings.GetTemperatureSensorsDetailForChart + "?TemperatureSensorID=" + allSensorId[i],
                    contentType: 'application/json',
                    success: function (result) {
                        sensorDetailValue.push(result.map(function (item) {
                            return `${item.temperatureValue}`;
                        }));

                        sensorDetailModified.push(result.map(function (item) {
                            return `${moment(item.lastModificationTime).locale('fa').format('YYYY-MM-DDTHH:mm:ss') + 'Z'}`;
                        }));

                        sensorName.push(result.map(function (item) {
                            return `${item.temperatureSensorEntity.temperatureSensorName}`;
                        }));
                        //console.log(sensorName);
                    },
                    error: function () {
                        ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور دما');
                    }
                })
            }

            for (var i = 0; i < allSensorId.length; ++i) {

                template += `            
                        <div class="col-xl-6 col-lg-6" style="z-index: 0;">
                            <h6 class="mb-0 text-uppercase">سنسور دما</h6>
                            <hr />
                            <div class="card">
                                <div class="card-body">
                                    <div id="chartTemperature${i}"></div>
                                </div>
                            </div>
                        </div>
                    <script>
                    "use strict";
                    var optionsTemperature${i} = {
                        series: [{
                            name: 'دما',
                            data: [${sensorDetailValue[i].map(element => `"${element}"`).join(', ')}]
                        }],
                        chart: {
                            foreColor: '#9ba7b2',
                            height: 360,
                            type: 'line',
                            zoom: {
                                enabled: true
                            },
                            toolbar: {
                                show: true
                            },
                            dropShadow: {
                                enabled: true,
                                top: 3,
                                left: 14,
                                blur: 4,
                                opacity: 0.10,
                            }
                        },
                        stroke: {
                            width: 5,
                            curve: 'smooth'
                        },
                        xaxis: {
                            type: 'datetime',
                            categories: [${sensorDetailModified[i].map(element => `"${element}"`).join(', ')}],
                        },
                        tooltip: {
                            x: {
                                format: 'yyyy/MM/dd HH:mm'
                            },
                        },
                        title: {
                            text: '${sensorName[i][0]}',
                            align: 'right',
                            style: {
                                fontSize: "16px",
                                color: '#666'
                            }
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shade: 'light',
                                gradientToColors: ['#bd4850'],
                                shadeIntensity: 1,
                                type: 'horizontal',
                                opacityFrom: 1,
                                opacityTo: 1,
                                stops: [0, 100, 100, 100]
                            },
                        },
                        markers: {
                            size: 4,
                            colors: ["#bd4850"],
                            strokeColors: "#fff",
                            strokeWidth: 2,
                            hover: {
                                size: 7,
                            }
                        },
                        colors: ["#bd4850"],
                        yaxis: {
                            title: {
                                text: '',
                            },
                        }
                    };
                    var chartTemperature${i} = new ApexCharts(document.querySelector("#chartTemperature${i}"), optionsTemperature${i});
                    chartTemperature${i}.render();
                    </script>`;
            }
            console.log(template);
            return minifyHtml(template);
            //console.log(template);
            //console.log(template);
        }
        async function getTemplateHumiditySensorChart() {
            var allSensorId;
            var sensorDetailValue = [];
            var sensorDetailModified = [];
            var sensorName = [];
            var template = ``;
            await $.ajax({
                type: "get",
                url: settings.AllItemsHumiditySensorApiAddress,
                contentType: 'application/json',
                success: function (result) {
                    allSensorId = result.data.map(function (item) {
                        return item.id;
                    });
                    if (result == null || result == undefined || result.length == 0) {
                        ivsAlert2('warning', 'اخطار', 'ابتدا باید حداقل یک سالن اضافه کنید');
                    }
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور رطوبت');
                }
            });
            for (var i = 0; i < allSensorId.length; ++i) {
                await $.ajax({
                    type: "get",
                    url: settings.GetHumiditySensorsDetailForChart + "?HumiditySensorID=" + allSensorId[i],
                    contentType: 'application/json',
                    success: function (result) {
                        sensorDetailValue.push(result.map(function (item) {
                            return `${item.humiditySensorValue}`;
                        }));

                        sensorDetailModified.push(result.map(function (item) {
                            return `${moment(item.lastModificationTime).locale('fa').format('YYYY-MM-DDTHH:mm:ss') + 'Z'}`;
                        }));

                        sensorName.push(result.map(function (item) {
                            return `${item.humiditySensorEntity.humiditySensorName}`;
                        }));
                        //console.log(sensorName);
                    },
                    error: function () {
                        ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور رطوبت');
                    }
                })
            }

            for (var i = 0; i < allSensorId.length; ++i) {

                template += `            
                        <div class="col-xl-6 col-lg-6" style="z-index: 0;">
                            <h6 class="mb-0 text-uppercase">سنسور رطوبت</h6>
                            <hr />
                            <div class="card">
                                <div class="card-body">
                                    <div id="chartHumidity${i}"></div>
                                </div>
                            </div>
                        </div>
                    <script>
                    "use strict";
                    var optionsHumidity${i} = {
                        series: [{
                            name: 'رطوبت',
                            data: [${sensorDetailValue[i].map(element => `"${element}"`).join(', ')}]
                        }],
                        chart: {
                            foreColor: '#9ba7b2',
                            height: 360,
                            type: 'line',
                            zoom: {
                                enabled: true
                            },
                            toolbar: {
                                show: true
                            },
                            dropShadow: {
                                enabled: true,
                                top: 3,
                                left: 14,
                                blur: 4,
                                opacity: 0.10,
                            }
                        },
                        stroke: {
                            width: 5,
                            curve: 'smooth'
                        },
                        xaxis: {
                            type: 'datetime',
                            categories: [${sensorDetailModified[i].map(element => `"${element}"`).join(', ')}],
                        },
                        tooltip: {
                            x: {
                                format: 'yyyy/MM/dd HH:mm'
                            },
                        },
                        title: {
                            text: '${sensorName[i][0]}',
                            align: 'right',
                            style: {
                                fontSize: "16px",
                                color: '#666'
                            }
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shade: 'light',
                                gradientToColors: ['#057d29'],
                                shadeIntensity: 1,
                                type: 'horizontal',
                                opacityFrom: 1,
                                opacityTo: 1,
                                stops: [0, 100, 100, 100]
                            },
                        },
                        markers: {
                            size: 4,
                            colors: ["#057d29"],
                            strokeColors: "#fff",
                            strokeWidth: 2,
                            hover: {
                                size: 7,
                            }
                        },
                        colors: ["#057d29"],
                        yaxis: {
                            title: {
                                text: '',
                            },
                        }
                    };
                    var chartHumidity${i} = new ApexCharts(document.querySelector("#chartHumidity${i}"), optionsHumidity${i});
                    chartHumidity${i}.render();
                    </script>`;
            }
            console.log(template);
            return minifyHtml(template);
        }
        async function getTemplateLightIntensitySensorChart() {
            var allSensorId;
            var sensorDetailValue = [];
            var sensorDetailModified = [];
            var sensorName = [];
            var template = ``;
            await $.ajax({
                type: "get",
                url: settings.AllItemsLightIntensitySensorApiAddress,
                contentType: 'application/json',
                success: function (result) {
                    allSensorId = result.data.map(function (item) {
                        return item.id;
                    });
                    if (result == null || result == undefined || result.length == 0) {
                        ivsAlert2('warning', 'اخطار', 'ابتدا باید حداقل یک سالن اضافه کنید');
                    }
                },
                error: function () {
                    ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور رطوبت');
                }
            });
            for (var i = 0; i < allSensorId.length; ++i) {
                await $.ajax({
                    type: "get",
                    url: settings.GetLightIntensitySensorsDetailForChart + "?LightIntensitySensorID=" + allSensorId[i],
                    contentType: 'application/json',
                    success: function (result) {
                        sensorDetailValue.push(result.map(function (item) {
                            return `${item.lightIntensitySensorValue}`;
                        }));

                        sensorDetailModified.push(result.map(function (item) {
                            return `${moment(item.lastModificationTime).locale('fa').format('YYYY-MM-DDTHH:mm:ss') + 'Z'}`;
                        }));

                        sensorName.push(result.map(function (item) {
                            return `${item.lightIntensitySensorEntity.lightIntensitySensorName}`;
                        }));
                        //console.log(sensorName);
                    },
                    error: function () {
                        ivsAlert2('error', 'خطا', 'اشکال در برقراری ارتباط با سرور - بخش سنسور رطوبت');
                    }
                })
            }

            for (var i = 0; i < allSensorId.length; ++i) {

                template += `            
                        <div class="col-xl-6 col-lg-6" style="z-index: 0;">
                            <h6 class="mb-0 text-uppercase">سنسور نور</h6>
                            <hr />
                            <div class="card">
                                <div class="card-body">
                                    <div id="chartlightIntensity${i}"></div>
                                </div>
                            </div>
                        </div>
                    <script>
                    "use strict";
                    var optionslightIntensity${i} = {
                        series: [{
                            name: 'نور',
                            data: [${sensorDetailValue[i].map(element => `"${element}"`).join(', ')}]
                        }],
                        chart: {
                            foreColor: '#9ba7b2',
                            height: 360,
                            type: 'line',
                            zoom: {
                                enabled: true
                            },
                            toolbar: {
                                show: true
                            },
                            dropShadow: {
                                enabled: true,
                                top: 3,
                                left: 14,
                                blur: 4,
                                opacity: 0.10,
                            }
                        },
                        stroke: {
                            width: 5,
                            curve: 'smooth'
                        },
                        xaxis: {
                            type: 'datetime',
                            categories: [${sensorDetailModified[i].map(element => `"${element}"`).join(', ')}],
                        },
                        tooltip: {
                            x: {
                                format: 'yyyy/MM/dd HH:mm'
                            },
                        },
                        title: {
                            text: '${sensorName[i][0]}',
                            align: 'right',
                            style: {
                                fontSize: "16px",
                                color: '#666'
                            }
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shade: 'light',
                                gradientToColors: ['#ffd11a'],
                                shadeIntensity: 1,
                                type: 'horizontal',
                                opacityFrom: 1,
                                opacityTo: 1,
                                stops: [0, 100, 100, 100]
                            },
                        },
                        markers: {
                            size: 4,
                            colors: ["#ffd11a"],
                            strokeColors: "#fff",
                            strokeWidth: 2,
                            hover: {
                                size: 7,
                            }
                        },
                        colors: ["#ffd11a"],
                        yaxis: {
                            title: {
                                text: '',
                            },
                        }
                    };
                    var chartlightIntensity${i} = new ApexCharts(document.querySelector("#chartlightIntensity${i}"), optionslightIntensity${i});
                    chartlightIntensity${i}.render();
                    </script>`;
            }
            console.log(template);
            return minifyHtml(template);
        }

    }

    return this;

}(jQuery));