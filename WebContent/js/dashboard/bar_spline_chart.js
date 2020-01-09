var dataSource = [{
    state: "Illinois",
    year1998: 423.721,
    year2001: 476.851,
    year2004: 528.904
}, {
    state: "Indiana",
    year1998: 178.719,
    year2001: 195.769,
    year2004: 227.271
}, {
    state: "Michigan",
    year1998: 308.845,
    year2001: 335.793,
    year2004: 372.576
}, {
    state: "Ohio",
    year1998: 348.555,
    year2001: 374.771,
    year2004: 418.258
}, {
    state: "Wisconsin",
    year1998: 160.274,
    year2001: 182.373,
    year2004: 211.727
}];


$(function(){ // 자바스크립트 메인 함수
  var tmh = new oza_TMHandler('com.obzen.bmpanly.ColEvtSaleRate', 'selectEvtSaleAmtCust', '0', '\@#%');
  tmh.execute(null, false); //  tm 실행
  var tmResult = tmh.getResult(); //  컬렉션 TM 결과 호출
  var tmResult_json = JSON.parse(tmResult); //  자바스크립트 객체로 변환

  for(var i=0; i<tmResult_json.length; i++) { //  결과값 숫자형 변환
    tmResult_json[i].EVE_AMT = parseFloat(tmResult_json[i].EVE_AMT);
    tmResult_json[i].ETC_AMT = parseFloat(tmResult_json[i].ETC_AMT);
    tmResult_json[i].CUST_CNT = parseFloat(tmResult_json[i].CUST_CNT);
  }
  
  
  $("#bar_spline_chart").dxChart({
      //dataSource: dataSource,
      dataSource: tmResult_json,
      size:{  // 사이즈 옵션
          width: 1176,
          height: 490
        },
      commonSeriesSettings: {
          argumentField: "BASE_DT",
          type: "bar",
          hoverMode: "allArgumentPoints",
          selectionMode: "allArgumentPoints",
          label: {
              visible: false,
              format: {
                  type: "fixedPoint",
                  precision: 0
              }
          }
      },
      series: [
          { valueField: "EVT_AMT", name: "행사매출(억)" },
          { valueField: "ETC_AMT", name: "전체매출(억)" },
          {
              axis: "CUST_CNT",
              type: "spline",
              valueField: "CUST_CNT",
              name: "고객수(명)",
              color: "#008fd8"
          }
      ],
      valueAxis: [{
          grid: {
              visible: true
          }
      }, {
          name: "CUST_CNT",
          position: "right",
          grid: {
              visible: true
          },
          title: {
              text: "고객수(명)"
          }
      }],
      //title: "Gross State Product within the Great Lakes Region",
      legend: {
          verticalAlignment: "bottom",
          horizontalAlignment: "center"
      },
      "export": {
          enabled: false
      },
      onPointClick: function (e) {
          e.target.select();
      }
  });
});



