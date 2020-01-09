
var doughnut_dataSource = [{  // sample 데이터소스
    region: "Asia",
    val: 4119626293
}, {
    region: "Africa",
    val: 1012956064
}];

$(function(){ // 자바스크립트 메인함수
    var color = new Array(); // color 배열

    color = ["#349BF9", "#EBEBEB"];
    draw_doughnut("doughnut1", color);
    // draw_doughnut(id, 색)
    color = ["#76D350", "#EBEBEB"];
    draw_doughnut("doughnut2", color);
    color = ["#7B57E2", "#EBEBEB"];
    draw_doughnut("doughnut3", color);
});
function draw_doughnut(id, color){
  $("#"+id).dxPieChart({  // 해당 id 태그에서 차트 생성
      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
      size: { // 사이즈
        height: 112,
        width: 112
      },
      type: "doughnut", // 타입 doughnut
      palette: color, // 배열 순서대로 차트 색상을 지정
      dataSource: doughnut_dataSource,  // 데이터소스 지정
      // title: "The Population of Continents and Regions",
      tooltip: {  // hover 속성
          enabled: true,
          format: "millions",
          customizeTooltip: function (arg) {
                      return {
                  text: arg.valueText + " - " + arg.percentText
              };
          }
      },
      // legend: {
      //     horizontalAlignment: "right",
      //     verticalAlignment: "top",
      //     margin: 0
      // },
      "export": {
          enabled: false
      },
      series: [{
          argumentField: "region",  // argument 지정
          label: {
              visible: false,
              format: "millions",
              connector: {
                  visible: false
              }
          }
      }]
  });
}
