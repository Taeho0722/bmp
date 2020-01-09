// sample
// var standard_dataSource = [{
//     day: "2019.01",
//     oranges: 3
// }, {
//     day: "2019.02",
//     oranges: 2
// }, {
//     day: "2019.03",
//     oranges: 3
// }, {
//     day: "2019.04",
//     oranges: 4
// }, {
//     day: "2019.05",
//     oranges: 6
// }, {
//     day: "2019.05",
//     oranges: 11
// }, {
//     day: "2019.07",
//     oranges: 4
// }];

$(function(){
    // var tmh = new oza_TMHandler('com.obzen.DataSource.Doc_Class5', 'total', '1', '\@#%');   // 엘리먼트 TM 지정
    // tmh.execute(null, false);  // TM 실행
    // var tmResult = tmh.ElementValue('total_value');  // 엘리먼트 결과값 지정
    // var tmResult_json = JSON.parse(tmResult);  // 자바스크립트 객체 변환

    var tmh = new oza_TMHandler('com.obzen.DataSource.Col_Class5', 'total', '0', '\@#%');
    // oza_TMHandler(클래스, 메소드, 0/1(컬렉션/엘리먼트), 딜리미터)
    tmh.execute(null, false); // TM 실행
    var tmResult = tmh.getResult(); // 컬렉션 TM 결과 호출
    var tmResult_json = JSON.parse(tmResult); // 결과를 자바스크립트 객체 변환

    $("#total").text(tmResult_json[0].total_value); // id=total 태그의 텍스트를 tm결과값의 total_value(tm 결과 컬럼명) 지정

    var tmh = new oza_TMHandler('com.obzen.DataSource.Col_Class5', 'increase', '0', '\@#%');
    tmh.execute(null, false);
    var tmResult = tmh.getResult();
    var tmResult_json = JSON.parse(tmResult);

    $("#increase").text('+' + tmResult_json[0].increase_value);
    // $("#increase").text(tmResult_json[0].value4);

    var tmh = new oza_TMHandler('com.obzen.DataSource.Col_Class5', 'chart5', '0', '\@#%');
    tmh.execute(null, false);
    var tmResult = tmh.getResult();
    var tmResult_json = JSON.parse(tmResult);

    for(var i=0; i<tmResult_json.length; i++){
      tmResult_json[i].value = parseInt(tmResult_json[i].value);
    }

    $("#standard_chart").dxChart({  // id=standard_chart 태그에 차트 생성
        dataSource: tmResult_json,
        palette: ["#D8DAE5", "#D8DAE5", "#D8DAE5", "#2ED790", "#2ED790","#2ED790","#2ED790"], // bar 그래프 각각의 색상을 순서대로 지정
        size:{
          width:330,
          height:160
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "value",
            argumentField: "YYYYMM",
            ignoreEmptyPoints: true,
            barWidth:7,
            barPadding:0.3

        },
        seriesTemplate: {
            nameField: "YYYYMM"
        },
        argumentAxis:{
          color:"#D7D7D7",
          tick:{
                color: "#ffffff"
          },
          label:{
            font:{
              size: 10
            }
          }

    	},
        valueAxis:{
        	color: "#ffffff",
            tick:{
                color: "#ffffff"
              },
            position: "right"
    	},
        legend:{
            visible: false
		}
    });
});
