// TM 사용하지 않는 차트

var area_dataSource = [{
    country: "USA",
    hydro: 59.8,
    oil: 937.6
}, {
    country: "China",
    hydro: 74.2,
    oil: 308.6

}, {
    country: "Russia",
    hydro: 40,
    oil: 128.5

}, {
    country: "Japan",
    hydro: 522.6,
    oil: 241.5

}, {
    country: "India",
    hydro: 19,
    oil: 119.3

}, {
    country: "Germany",
    hydro: 6.1,
    oil: 123.6
}];
// var types = ["line", "stackedline", "fullstackedline"];

$(function(){
    $("#area_chart").dxChart({  //  id = area_chart 태그에 차트 생성
        size:{  // 사이즈 옵션
          width: 1176,
          height: 490
        },
        palette: ["#747474","#2DD790"], // 색상 지정 (배열로 순서 따라 차트 각각의 색상을 지정)
        dataSource: area_dataSource,  //  dataSource 지정
        commonSeriesSettings: {
            argumentField: "country", // argument 지정
            type: "area" // 타입 area 차트
        },
        margin: { //  margin 옵션
            bottom: 20
        },
        argumentAxis: { //  x축 옵션
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: "crossLabels",
            grid: {
                visible: true
            },
            color: "#ffffff",
            tick:{     // 눈금
                color: "#ffffff"
            }
        },
        valueAxis: {    //  y축 옵션
           color: "#ffffff",
            tick:{
                color: "#ffffff"
            }
        },

        series: [   //  {계열1}, {계열2}, ...
            { valueField: "hydro", name: "Hydro-electric",  // {계열1 "hydro"}
              point: {  // 계열1 에 대한 point 속성
                visible: true,
                size:10,
                color: "#747474",
              },
              border: { //  계열1 에 대한 border 속성
                visible:true,
                width:2,
                color: "#747474"
              }
            },
            { valueField: "oil", name: "Oil",  // {계열2 "oil"}
              point: {  // 계열2 에 대한 point 속성
                visible: true,
                size:10,
                color: "#2DD790",
              },
              border: { //  계열2 에 대한 border 속성
                visible:true,
                width:2,
                color: "#2DD790"
              }
            }

        ],
        legend: { //  범례 속성
            visible: false,
            verticalAlignment: "top",
            horizontalAlignment: "center",
        },
        tooltip: {  // point에 hover 옵션
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.valueText
                };
            }
        }
    }).dxChart("instance");

});
