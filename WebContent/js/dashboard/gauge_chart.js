$(function(){
    $("#gauge_chart").dxBarGauge({
    	relativeInnerRadius:0.6,
    	palette: ["#4092F8","#2DD790"],
    	startValue: 0,
        endValue: 100,
        values: [47.27, 78],
        label: {
            indent: 30,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            customizeText: function (arg) {
                return arg.valueText + " %";
            }
        },
        tooltip: {
            enabled: false,
            customizeTooltip: function (arg) {
                return {
                    text: getText(arg, arg.valueText)
                };
            }
        },
        "export": {
            enabled: true
        },
        /*
        title: {
            text: "Average Speed by Racer",
            font: {
                size: 28
            }
        },
        */
        legend: {
            visible: true,
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            customizeText: function(arg) {
                return getText(arg.item, arg.text);
            }
        }
    });

    function getText(item, text){
        return "Racer " + (item.index + 1) + " - " + text + " km/h";
    }
});