try {
    $.ajax({
        type: "get",
        url: "/api/UserGreenhouseHall/GetCountAllGreenhouseHallByUserName",
        contentType: 'application/json',
        success: async function (result) {
            $("#GreenhouseHallCount").text(result);
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی تعداد سالن ها');
            $("#GreenhouseHallCount").html("هیچ سالنی  یافت نشد");
        }
    });
} catch (e) {
    $("#GreenhouseHallCount").text(0);
}

try {
    $.ajax({
        type: "get",
        url: "/api/TemperatureSensor/GetCountAllTemperatureSensorByUserName",
        contentType: 'application/json',
        success: async function (result) {
            $("#TemperatureSensorCount").text(result);
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی تعداد سنسورهای دما');
            $("#TemperatureSensorCount").html("هیچ سنسور دمایی  یافت نشد");
        }
    });
} catch (e) {
    $("#TemperatureSensorCount").text(0);
}

try {
    $.ajax({
        type: "get",
        url: "/api/HumiditySensor/GetCountAllHumiditySensorByUserName",
        contentType: 'application/json',
        success: async function (result) {
            $("#HumiditySensorCount").text(result);
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی تعداد سنسورهای رطوبت');
            $("#HumiditySensorCount").html("هیچ سنسور رطوبتی  یافت نشد");
        }
    });
} catch (e) {
    $("#HumiditySensorCount").text(0);
}

try {
    $.ajax({
        type: "get",
        url: "/api/LightIntensitySensor/GetCountAllLightIntensitySensorByUserName",
        contentType: 'application/json',
        success: async function (result) {
            $("#LightIntensitySensorCount").text(result);
        },
        error: function (ex, cc, bb) {
            ivsAlert2('error', 'خطا سیستم', 'خطا در فراخوانی تعداد سنسورهای نور');
            $("#LightIntensitySensorCount").html("هیچ سنسور نوری یافت نشد");
        }
    });
} catch (e) {
    $("#LightIntensitySensorCount").text(0);
}