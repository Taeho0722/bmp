var bar2_dataSource = [{  // 샘플 데이터소스
    country: "USA",
    hydro: 359.8,
    oil: 637.6,
    gas: 582,
    coal: 564.3,
    nuclear: 187.9
}];

$(function(){ // 자바스크립트 메인 함수
  var tmh = new oza_TMHandler('com.obzen.DataSource.Col_Class1', 'chart1', '0', '\@#%');
  // oza_TMHandler(클래스, 메소드, 0/1(컬렉션/엘리먼트), 딜리미터)
  tmh.execute(null, false); //  tm 실행
  var tmResult = tmh.getResult(); //  컬렉션 TM 결과 호출
  var tmResult_json = JSON.parse(tmResult); //  자바스크립트 객체로 변환

  for(var i=0; i<tmResult_json.length; i++) { //  결과값 숫자형 변환
    tmResult_json[i].value1 = parseInt(tmResult_json[i].value1);
    tmResult_json[i].value2 = parseInt(tmResult_json[i].value2);
  }

  $("#womanpic2")[0].innerHTML= tmResult_json[0].value1+"<span class='unit_00'>%</span>"; // id = womanpic2 태그 아래에서 TM 결과값들을 html 태그와 함께 출력
  $("#manpic2")[0].innerHTML= tmResult_json[0].value2+"<span class='unit_00'>%</span>";
  $("#age20").text(tmResult_json[0].value3);  //  TM 결과값 텍스트 출력
  $("#age30").text(tmResult_json[0].value4);
  $("#age40").text(tmResult_json[0].value5);
  $("#age50").text(tmResult_json[0].value6);
  $("#customer_transaction")[0].innerHTML= tmResult_json[0].value7+"<span class='unit_01'>만원</span>";

  $("#bar2_chart0").dxChart({ // id = bar2_chart0 태그에서 차트 생성
      animation:{ // 애니메이션 속성
             duration: 2000 // 로딩 milliseconds 지정
      },
      size: {  width : 591, height : 100 },
      dataSource: tmResult_json,  //  TM 결과의 자바스크립트 객체를 데이터소스로 지정
      rotated: true, // 세로막대 -> 가로막대
      commonSeriesSettings: {
          argumentField: "argument",  // argumentField 지정
          type: "fullStackedBar"
      },
      argumentAxis: { visible: false, label: {visible:false} }, // x축 옵션
      valueAxis: { visible : false, // y축 옵션
                   grid : { visible : false },
                   tick: {visible : false},
                   label: {visible : false}
      },
      series: [
          { valueField: "value1", name: "value1", color: "#2DD790" }, // valueField 지정
          { valueField: "value2", name: "value2", color: "#4D5271"}
      ],
      legend: {
          visible: false
      },
      tooltip: {
          enabled: true,
          customizeTooltip: function (arg) {
              return {
                  text: arg.seriesName + " : " + arg.percentText// + " - " + arg.valueText
              };
          }
      }
  });

// 두번째 fullStackBar 생성
  var tmh = new oza_TMHandler('com.obzen.DataSource.Col_Class3', 'chart3', '0', '\@#%');
  tmh.execute(null, false);
  var tmResult = tmh.getResult();
  var tmResult_json = JSON.parse(tmResult);

  for(var i=0; i<tmResult_json.length; i++) {
    tmResult_json[i].value1 = parseInt(tmResult_json[i].value1);
    tmResult_json[i].value2 = parseInt(tmResult_json[i].value2);
    tmResult_json[i].value3 = parseInt(tmResult_json[i].value3);
    tmResult_json[i].value4 = parseInt(tmResult_json[i].value4);
  }
    $("#bar2_chart1").dxChart({ // id=bar2_char1 태그에 차트 생성
        size: {  width : 660, height : 10 },
        dataSource: tmResult_json,
        rotated: true,
        commonSeriesSettings: {
            argumentField: "argument",
            type: "fullStackedBar"
        },
        argumentAxis: { visible: false, label: {visible:false} },
        valueAxis: { visible : false,
                     grid : { visible : false },
                     tick: {visible : false},
                     label: {visible : false}
        },
        series: [
            { valueField: "value1", name: "value1", color: "#4092F8" },
            { valueField: "value2", name: "value2", color: "#2DD790" },
            { valueField: "value3", name: "value3", color: "#4D5271"},
            { valueField: "value4", name: "value4", color: "#7858DF"}

        ],
        legend: {
            visible: false
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " : " + arg.percentText// + " - " + arg.valueText
                };
            }
        }
    });

    $("#brand1")[0].innerHTML=tmResult_json[0].value1 + "<span class='unit_00'>%</span>";
    $("#brand2")[0].innerHTML=tmResult_json[0].value2 + "<span class='unit_00'>%</span>"
    $("#brand3")[0].innerHTML=tmResult_json[0].value3 + "<span class='unit_00'>%</span>"
    $("#brand4")[0].innerHTML=tmResult_json[0].value4 + "<span class='unit_00'>%</span>"


// 3번째 fullStackedBar 생성
    $("#bar2_chart2").dxChart({
        size: {  width : 340, height : 45 },
        dataSource: bar2_dataSource,
        rotated: true,
        commonSeriesSettings: {
            argumentField: "country",
            type: "fullStackedBar"
        },
        argumentAxis: { visible: false, label: {visible:false} },
        valueAxis: { visible : false,
                     grid : { visible : false },
                     tick: {visible : false},
                     label: {visible : false}
        },
        series: [
            { valueField: "hydro", name: "Hydro-electric", color: "#4D5271"},
            { valueField: "oil", name: "Oil", color: "#2DD790" },
            { valueField: "gas", name: "Natural gas", color: "#4092F8" }
        ],
        legend: {
            visible: false
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + " : " + arg.percentText// + " - " + arg.valueText
                };
            }
        }
    });
});
