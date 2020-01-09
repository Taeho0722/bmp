// sample
// var line_dataSource = [{
//     country: "월",
//     hydro: 59.8,
//     oil: 937.6
// }, {
//     country: "화",
//     hydro: 74.2,
//     oil: 308.6
// }, {
//     country: "수",
//     hydro: 40,
//     oil: 128.5
//
// }, {
//     country: "목",
//     hydro: 22.6,
//     oil: 241.5
//
// }, {
//     country: "금",
//     hydro: 19,
//     oil: 119.3
//
// }, {
//     country: "토",
//     hydro: 6.1,
//     oil: 123.6
// },
// {
//   country: "일",
//   hydro: 6.1,
//   oil: 123.6
// }];

// var types = ["line", "stackedline", "fullstackedline"];

$(function(){ // 자바스크립트 메인함수
    var tmh = new oza_TMHandler('com.obzen.DataSource.Col_Class4', 'chart4', '0', '\@#%');
    // oza_TMHandler(클래스, 메소드, 0/1(컬렉션/엘리먼트), 딜리미터)
    tmh.execute(null, false); // TM 실행
    var tmResult = tmh.getResult();  // 컬렉션 TM 결과 호출
    var tmResult_json = JSON.parse(tmResult); // 결과를 자바스크립트 객체 변환

    for(var i=0; i<tmResult_json.length; i++) { // 결과값을 숫자형으로 변환
      tmResult_json[i].value1 = parseInt(tmResult_json[i].value1);
      tmResult_json[i].value2 = parseInt(tmResult_json[i].value2);
    }

    var chart = $("#chart").dxChart({ // id=chart 인 태그에 차트 생성
        size: {
          height: 268,
          width: 360
        },
        palette: ["#4594F2", "#C8CADB"],  // 색상 두가지 지정
        dataSource: tmResult_json,  // 자바스크립트 객체로 변환된 결과를 데이터소스로 지정
        commonSeriesSettings: {
            argumentField: "argument",  // argument 지정 (TM 결과 컬럼에 맞게 지정)
            // type: types[0]
            type: "line"  //  line 차트
        },
        margin: { // 마진
            left: 30,
            bottom: 20
        },
        argumentAxis: { // x축 속성
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: "crossLabels",
            grid: {
                visible: true
            },
            color: "#EAEAEA",
            tick:{  // 눈금
                color: "#EAEAEA"
              }
        },
        valueAxis: {  // y축 속성
           color: "#EAEAEA",
            tick:{  // 눈금
                color: "#EAEAEA"
            }
        },
        series: [ // [ {계열1}, {계열2}, ...]
            { valueField: "value1", name: "value1", point:{ // {계열1}
            border: {
                color: "#4594F2",
                width: 2,
                visible: true
            },
            color: "#ffffff",
       		size: 5
        }},
            { valueField: "value2", name: "value2" ,point:{ // {계열2}
            border: {
                color: "#C8CADB",
                width: 2,
                visible: true
            },
            color: "#ffffff",
       		size: 5
        }},
        ],
        legend: { // 범례
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            itemTextPosition: "bottom"
        },
        // title: {
        //     text: "Energy Consumption in 2004",
        //     subtitle: {
        //         text: "(Millions of Tons, Oil Equivalent)"
        //     }
        // },
        "export": {
            enabled: false
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.valueText
                };
            }
        }
    }).dxChart("instance");

});
