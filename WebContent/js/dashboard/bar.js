$(function(){ //  자바스크립트 메인함수
  var tmh = new oza_TMHandler('com.obzen.DataSource.Col_Class2', 'chart2', '0', '\@#%');
  // oza_TMHandler(클래스, 메소드, 0/1(컬렉션/엘리먼트), 딜리미터)
  tmh.execute(null, false); //  tm 실행
  var tmResult = tmh.getResult(); //  컬렉션 TM 결과 호출
  var tmResult_json = JSON.parse(tmResult);//  자바스크립트 객체로 변환

  for(var i=0; i<tmResult_json.length; i++){//  결과값 숫자형 변환
    tmResult_json[i].value1 = parseInt(tmResult_json[i].value1);
    tmResult_json[i].value2 = parseInt(tmResult_json[i].value2);
    tmResult_json[i].value3 = parseInt(tmResult_json[i].value3);
    tmResult_json[i].value4 = parseInt(tmResult_json[i].value4);
    tmResult_json[i].value5 = parseInt(tmResult_json[i].value5);
  }
  $("#pictogram")[0].innerHTML = "<img src='../image/dashboard/money.png' width='40' height='40' alt='돈 픽토그램'/>" + tmResult_json[0].value1.format() +"<span class='unit_01'>만원</span>";
// id = pictogram 태그 아래에서 TM 결과값들을 html 태그와 함께 출력

  draw_bar("bar1", "선호", tmResult_json[0].value2, 2000, "#808592");
  // draw_bar(태그ID, 출력명, TM결과값, 최대값, 색)
  draw_bar("bar2", "우수", tmResult_json[0].value3, 2000, "#2ED790");
  draw_bar("bar3", "신한", tmResult_json[0].value4, 2000, "#4092F8");
  draw_bar("bar4", "경쟁", tmResult_json[0].value5, 2000, "#7858DF");


  draw_bar2("bar5_1", 12000, 27000, "#2ED790");
  // draw_bar2(태그ID, 값(또는 TM결과값), 최대값, 색 )
  draw_bar2("bar5_2", 27000, 27000, "#C9C9C9");

  draw_bar2("bar6_1", 25000, 27000, "#4092F8");
  draw_bar2("bar6_2", 27000, 27000, "#C9C9C9");
});

function draw_bar(id, name, actv, tarv, color){
  $("#"+id).append("<div class='name'>"+name+"</div><div class='val'>"+actv.format()+"</div><div class='actual'></div><div class='target'></div>");
  // 해당 id 태그 아래에 추가(append) -> "<div class='name'>"+name+"</div><div class='val'>"+actv.format()+"</div><div class='actual'></div><div class='target'></div>"
  // actv 값을 format() 으로 천단위 ',' 변환

  var actp = parseFloat(actv/tarv); // 실제 actual 크기 와 전체 target 크기 의 비율
  var w = $("#"+id).width() - 130;  // 해당 id태그의 너비를 가져온 뒤 사이즈 조정 (전체 기준 사이즈)
  var aw = actp * w;                // 전체 기준 사이즈에서 actual 크기 비율만큼의 사이즈 설정
  var tw = w * (1 - actp);          // 나머지 사이즈 설정

  $("#"+id+" div").css("display", "inline-block");  //  해당 id 안에 있는 모든 div 태그 inline-block 설정
  $("#"+id+" .actual").css("width", aw).css("height", "100%").css("background", color);  // 해당 id 아래의 class=actual 태그를 실제 actual사이즈만큼 color 설정
  $("#"+id+" .target").css("width", tw).css("height", "100%").css("background", "#FFFFFF");

  $("#"+id+" .name").css("width", "35px").css("margin-left", "15px").css("color", "#232323").css("text-align", "left");
  $("#"+id+" .val").css("width", "60px").css("margin-right", "20px").css("color", color).css("font-size", "18px").css("text-align", "left");
}

function draw_bar2(id, actv, tarv, color){
  $("#"+id).append("<div class='actual'></div><div class='target'></div>");

  var actp = parseFloat(actv/tarv);

  var w = $("#"+id).width() - 35;
  var aw = actp * w;
  var tw = w * (1 - actp);

  $("#"+id+" div").css("display", "inline-block");
  $("#"+id+" .actual").css("width", aw).css("height", "100%").css("background", color);
  $("#"+id+" .target").css("width", tw).css("height", "100%").css("background", "#FFFFFF");
}

Number.prototype.format = function(){ //  Number 타입에서 format() 함수를 쓰기 위함 (천단위 ',')
    if(this==0) return 0;

    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');

    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

    return n;
};
