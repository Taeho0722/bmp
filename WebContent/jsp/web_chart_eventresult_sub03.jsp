<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">


//TM Start =================================================================================================
//성별 응답고객수
var gen_male_cnt = "";
var gen_female_cnt = "";

//성별 Top5 평균응답고객수
var gen_top5_male_cnt = "";
var gen_top5_female_cnt = "";

//성별 행사매출
var gen_male_amt = "";
var gen_female_amt = "";


//성별 Top5 평균행사매출
var gen_top5_male_amt = "";
var gen_top5_female_amt = "";

//성별 고객 수 
var evtPurCustSexTm = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'selectEvtPurCustSex', '1', '\@#%');
evtPurCustSexTm.setAddDataField('CAMP_ID', camp_id);
evtPurCustSexTm.returnlist('MAN_CNT'+//남성응답고객수
        									';WOM_CNT'+//여성응답고객수
        									';MAN_AMT'+//남성행사매출
        									';WOM_AMT'+//여성행사매출
        									';TOP5_MAN_CNT'+//TOP5남성응답고객수
        									';TOP5_WOM_CNT'+//TOP5여성응답고객수
        									';TOP5_MAN_AMT'+//TOP5남성행사매출
        									';TOP5_WOM_AMT');//TOP5여성행사매출
evtPurCustSexTm.execute(null, false);
gen_male_cnt = evtPurCustSexTm.ElementValue('MAN_CNT');
gen_female_cnt = evtPurCustSexTm.ElementValue('WOM_CNT');
gen_male_amt = evtPurCustSexTm.ElementValue('MAN_AMT');
gen_female_amt = evtPurCustSexTm.ElementValue('WOM_AMT');
gen_top5_male_cnt = evtPurCustSexTm.ElementValue('TOP5_MAN_CNT');
gen_top5_female_cnt = evtPurCustSexTm.ElementValue('TOP5_WOM_CNT');
gen_top5_male_amt = evtPurCustSexTm.ElementValue('TOP5_MAN_AMT');
gen_top5_female_amt = evtPurCustSexTm.ElementValue('TOP5_WOM_AMT');
evtPurCustSexTm.clear();	

//연령대별 행사매출
var evtPurCustAgeTm = new oza_TMHandler('com.obzen.bmpanly.ColEvtSaleRate', 'selectEvtPurCustAge', '0', '\@#%');
evtPurCustAgeTm.setAddDataField('CAMP_ID', camp_id);
evtPurCustAgeTm.execute(null, false);
var evtPurCustAgeTmResult = evtPurCustAgeTm.getResult();
var evtPurCustAgeTmResult_json = "";
if(evtPurCustAgeTmResult != ""){
	evtPurCustAgeTm_json = JSON.parse(evtPurCustAgeTmResult);
}
evtPurCustAgeTm.clear();


//시간대별 매출
var evtPurCustTimeTm = new oza_TMHandler('com.obzen.bmpanly.ColEvtSaleRate', 'selectEvtPurCustTime', '0', '\@#%');
evtPurCustTimeTm.setAddDataField('CAMP_ID', camp_id);
evtPurCustTimeTm.execute(null, false);
var evtPurCustTimeTmResult = evtPurCustTimeTm.getResult();
var evtPurCustTimeTm_json = "";
if(evtPurCustTimeTmResult != ""){
	evtPurCustTimeTm_json = JSON.parse(evtPurCustTimeTmResult);
}
evtPurCustTimeTm.clear();

gen_male_cnt   = parseInt(isNullZero(gen_male_cnt));
gen_female_cnt = parseInt(isNullZero(gen_female_cnt));
gen_top5_male_cnt   = parseInt(isNullZero(gen_top5_male_cnt));
gen_top5_female_cnt   = parseInt(isNullZero(gen_top5_female_cnt));

gen_male_amt = parseInt(isNullZero(gen_male_amt));
gen_female_amt = parseInt(isNullZero(gen_female_amt));
gen_top5_male_amt = parseInt(isNullZero(gen_top5_male_amt));
gen_top5_female_amt = parseInt(isNullZero(gen_top5_female_amt));
if(gen_male_amt != 0) gen_male_amt = exCeil(gen_male_amt/division_amt, 1);
if(gen_female_amt != 0) gen_female_amt = exCeil(gen_female_amt/division_amt, 1);
if(gen_top5_male_amt != 0) gen_top5_male_amt = exCeil(gen_top5_male_amt/division_amt, 1);
if(gen_top5_female_amt != 0) gen_top5_female_amt = exCeil(gen_top5_female_amt/division_amt, 1);
	
//화면 시작 시 실행
$(document).ready(function() {
	
	screenLog("조회", "web_chart_eventresult_sub03", "브랜드마케팅>분석>분석Report>행사고객분석(기타)",get_client_ip);//화면 로그(공통)
	
	
	//상단 고정 내용 시작------------------------------------------------------------
	var innerHtml = "";
	
	
	innerHtml += "<div class='top_cnt'>";
	innerHtml += "<div class='top_left'>";
	
	if(grd_level == "1"){
		innerHtml += "<div class='img_wrap'><img src='../../img/web/icon/br_img1.png' alt=''></div>";
		innerHtml += "<div class='txt_wrap'><h2>Excellent!<p><BR>성공적인 행사였습니다. 다시한번 도전~!</p></h2><p><strong>" + grd_msg + "</strong>이 특히 좋았습니다.</p></div>";
	} else if(grd_level == "2"){
		innerHtml += "<div class='img_wrap'><img src='../../img/web/icon/br_img2.png' alt=''></div>";
		innerHtml += "<div class='txt_wrap'><h2>Good!<p><BR>양호한 행사결과였습니다. 조금만 더 노력해보세요!</p></h2><p><strong>" + grd_msg + "</strong>이 특히 부족합니다.</p></div>";
	} else if(grd_level == "3"){
		innerHtml += "<div class='img_wrap'><img src='../../img/web/icon/br_img3.png' alt=''></div>";
		innerHtml += "<div class='txt_wrap'><h2>Cheer up!<p><BR>평균이하의 다소 부진한 행사였습니다.<BR>분석을 통하여 더 좋은 결과를 얻어보세요!</p></h2><p><strong>" + grd_msg + "</strong>이 특히 부족합니다.</p></div>";
	}  else {
		innerHtml += "<div class='txt_wrap fit_noti'><p><strong>'FIT 행사현황'</strong>에서 행사별 자세히 보기 버튼을 클릭해주세요.</p></div>";
	}
	
	
	innerHtml += "</div>";
	innerHtml += "<div class='top_right'>"+mainTitle+"<br>"+mainTitleDate+"</div>";
	if(sys_div == "2"){innerHtml += "<a href='javascript:resCustCntExcel();' class='btn_down'>응답고객 다운로드</a>";}//운영정보 사용자만 사용
	innerHtml += "</div>";
	innerHtml += "<ul>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><span class='tip_img' title='행사대상고객중 실제 구매한 고객'></span><p>응답고객수</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_rsp_cust_cnt)+"</strong>명</p>";
	innerHtml += "</li>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><p>응답고객<br>객단가</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_rsp_cust_price)+"</strong>만원</p>";
	innerHtml += "</li>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><span class='tip_img'title='동일기간 구매한 모든 고객'></span><p>전체고객수</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_md_tot_cust_cnt)+"</strong>명</p>";
	innerHtml += "</li>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><p>전체고객<br>객단가</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_md_tot_cust_price)+"</strong>만원</p>";
	innerHtml += "</li>";
	innerHtml += "</ul>";
	
	
	$(".analysis_top").html(innerHtml);
	//상단 고정 내용 종료------------------------------------------------------------
	
	//Chart 그리기
	drawGenderChart();
	drawAgeChart();
	drawTimeChart();
});



/**========================================================================================
* 성별
========================================================================================*/
function drawGenderChart(){
	//for test
	/*
	gen_male_cnt = 45;
	gen_female_cnt = 60;
	gen_top5_male_cnt = 80
	gen_top5_female_cnt = 120;
	gen_female_amt = 100;
	gen_male_amt = 600;
	gen_top5_male_amt = 100;
	gen_top5_female_amt = 600;
	*/
	var gen_tot_cnt = gen_male_cnt + gen_female_cnt;
	var gen_cust_rt = 0;
	var gen_top5_tot_cnt = gen_top5_male_cnt + gen_top5_female_cnt;
	var gen_top5_cust_rt = 0;
	var gen_tot_amt = gen_male_amt + gen_female_amt;
	var gen_amt_rt = 0;
	var gen_top5_tot_amt = gen_top5_male_amt + gen_top5_female_amt;
	var gen_top5_amt_rt = 0;
	
	if(gen_tot_cnt != 0) {
		gen_cust_rt = exCeil(gen_male_cnt/gen_tot_cnt * 100, 2);
	}
	
	if(gen_top5_tot_cnt != 0) {
		gen_top5_cust_rt = exCeil(gen_top5_male_cnt/gen_top5_tot_cnt * 100, 2);
	}
	
	if(gen_tot_amt != 0) {
		gen_amt_rt = exCeil(gen_male_amt/gen_tot_amt * 100, 2);
	}
	
	if(gen_top5_tot_amt != 0) {
		gen_top5_amt_rt = exCeil(gen_top5_male_amt/gen_top5_tot_amt * 100, 2);
	}
	
	
	$("#gen_male_cnt").text(AddComma(gen_male_cnt));
	$("#gen_female_cnt").text(AddComma(gen_female_cnt));
	
	$("#gen_cust_chart").dxBarGauge({
    	relativeInnerRadius:0.8,
    	backgroundColor:"#a8df59",
    	palette: ["#4092f8"],
    	startValue: 0,
      	endValue: gen_tot_cnt,
      	values: [gen_male_cnt],
        label: {visible: false},
        tooltip: { enabled: true,
        	       zIndex:1e3,
          		   customizeTooltip: function (arg) {
        	  			return { text:AddComma(gen_cust_rt) + "%"};
          		   }
        },
        
	    legend: {
	          visible: false
	    }
   });
	
	$("#gen_top5_male_cnt").text(AddComma(gen_top5_male_cnt));
	$("#gen_top5_female_cnt").text(AddComma(gen_top5_female_cnt));
	
	$("#gen_top5_cust_chart").dxBarGauge({
			relativeInnerRadius:0.8,
    	backgroundColor:"#9EA3B7",
    	palette: ["#4D5271"],
    	startValue: 0,
      endValue: gen_top5_tot_cnt,
      values: [gen_top5_male_cnt],
      //values: [gen_male_cnt],
      "export": {
          enabled: false
      },
      label: {
          visible: false
      },
      tooltip: {  // hover 속성
          enabled: true,
          zIndex:1e3,
          //format: "millions",
          customizeTooltip: function (arg) {
        	  return { text:AddComma(gen_top5_cust_rt) + "%"};
          }
      },
      legend: {
          visible: false
      }
    });	
	
	$("#gen_male_amt").text(AddComma(gen_male_amt));
	$("#gen_female_amt").text(AddComma(gen_female_amt));
	
	$("#gen_amt_chart").dxBarGauge({
    	relativeInnerRadius:0.8,
    	backgroundColor:"#2DD790",
    	palette: ["#7f85ae"],
    	startValue: 0,
      endValue: gen_tot_amt,
      values: [gen_male_amt],
      //values: [gen_male_cnt],
      "export": {
          enabled: false
      },
      label: {
          visible: false
      },
      tooltip: {  // hover 속성
          enabled: true,
          zIndex:1e3,
          //format: "millions",
          customizeTooltip: function (arg) {
        	  return { text:AddComma(gen_amt_rt) + "%"};
          }
      },
      legend: {
          visible: false
      }
   });
	
	$("#gen_top5_male_amt").text(AddComma(gen_top5_male_amt));
	$("#gen_top5_female_amt").text(AddComma(gen_top5_female_amt));
	
	$("#gen_top5_amt_chart").dxBarGauge({
    	relativeInnerRadius:0.8,
    	backgroundColor:"#9EA3B7",
    	palette: ["#4D5271"],
    	startValue: 0,
      endValue: gen_top5_tot_amt,
      values: [gen_top5_male_amt],
      //values: [gen_male_cnt],
      "export": {
          enabled: false
      },
      label: {
          visible: false
      },
      tooltip: {  // hover 속성
          enabled: true,
          zIndex:1e3,
          //format: "millions",
          customizeTooltip: function (arg) {
        	  return { text:AddComma(gen_top5_amt_rt) + "%"};
          }
      },
      legend: {
          visible: false
      }
   });
	
}

/**========================================================================================
* 연령대별
========================================================================================*/
function drawAgeChart(){
	
	var data = null;
	data = evtPurCustAgeTm_json;
	var age_sale_amt = "";
	var top5_age_sale_amt = "";
	
	//형변환
	for(var i=0; i<data.length; i++) {
		data[i].AGE_CUST_CNT = parseInt(data[i].AGE_CUST_CNT);//응답고객수
		data[i].TOP5_AGE_CUST_CNT = parseInt(data[i].TOP5_AGE_CUST_CNT);//TOP5응답고객수
		age_sale_amt = parseInt(data[i].AGE_SALE_AMT) / division_amt;
		data[i].AGE_SALE_AMT = exCeil(age_sale_amt, 1);//행사매출
		top5_age_sale_amt = parseInt(data[i].TOP5_AGE_SALE_AMT) / division_amt ;
		data[i].TOP5_AGE_SALE_AMT = exCeil(top5_age_sale_amt, 1);//TOP5행사매출
	}
	
	if(data.length == 0){
		$("#cust_age_chart").html("<p class='nodata'>고객 수 데이터가 없습니다.</p>");	
		$("#amt_age_chart").html("<p class='nodata'>행사매출 데이터가 없습니다.</p>");
	}else{
		$("#cust_age_chart").dxChart({
			dataSource: data,
			commonSeriesSettings: {
				//argumentField: "BASE_DT",
				argumentField: "AGE_NM",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				{ axis: "salse", valueField: "AGE_CUST_CNT", name: "응답고객수", color: '#4092f8',barWidth:5 },
		    { axis: "salse", valueField: "TOP5_AGE_CUST_CNT", name: "Top5평균응답고객수", color: '#E4E4E4',barWidth:5 },
		  ],
			valueAxis: [
				{
					name: "salse",
					//position: "right",//값 위치
					grid: {visible: true},
					label: {
						customizeText : function(arg){
							var items = arg.valueText.split("\n");
							$.each(items, function(index, item) {
			                   items[index] = AddComma(items[index]);//숫자에 콤마
			                });
							
							return items;
						}
					}
				}
			],
			legend: {
	    	    visible: false
	    },
			"export": {
				enabled: false
			},
			tooltip: {  // hover 속성
		          enabled: true,
		          //format: "millions",
		          customizeTooltip: function (arg) {
		                      return {
		                  text:AddComma(arg.valueText) + "명"
		              };
		          }
		      },
			onPointClick: function (e) {
				e.target.select();
			}
		});
		
		
		
		//행사매출
		$("#amt_age_chart").dxChart({
			dataSource: data,
			commonSeriesSettings: {
				//argumentField: "BASE_DT",
				argumentField: "AGE_NM",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				{ axis: "salse", valueField: "AGE_SALE_AMT", name: "행사매출", color: '#7f85ae',barWidth:5 },
		    { axis: "salse", valueField: "TOP5_AGE_SALE_AMT", name: "Top5평균행사매출", color: '#E4E4E4',barWidth:5 },
		  ],
			valueAxis: [
				{
					name: "salse",
					//position: "right",//값 위치
					grid: {visible: true},
					label: {
						customizeText : function(arg){
							var items = arg.valueText.split("\n");
							$.each(items, function(index, item) {
			                   items[index] = AddComma(items[index]);//숫자에 콤마
			                });
							
							return items;
						}
					}
				}
			],
			legend: {
	    	    visible: false
	    },
			"export": {
				enabled: false
			},
			tooltip: {  // hover 속성
		          enabled: true,
		          //format: "millions",
		          customizeTooltip: function (arg) {
		                      return {
		                  text:AddComma(arg.valueText) + "백만"
		              };
		          }
		      },
			onPointClick: function (e) {
				e.target.select();
			}
		});
	}
}




/**========================================================================================
* 시간대별
========================================================================================*/
function drawTimeChart(){
	
	var data = null;	
	
	data = evtPurCustTimeTm_json;
	
	var time_sale_amt = "";
	var top5_time_sale_amt = "";
	//형변환
	for(var i=0; i<data.length; i++) {
		time_sale_amt = parseInt(data[i].TIME_SALE_AMT) / division_amt;
		data[i].TIME_SALE_AMT = exCeil(time_sale_amt, 1);//행사매출
		top5_time_sale_amt = parseInt(data[i].TOP5_TIME_SALE_AMT) / division_amt;
		data[i].TOP5_TIME_SALE_AMT = exCeil(top5_time_sale_amt, 1);//TOP5행사매출
	}
	
	if(data.length == 0){
		$("#time_chart").html("<p class='nodata'>시간대별 매출 데이터가 없습니다.</p>");	
		
	}else{
		$("#time_chart").dxChart({
	      dataSource: data,
	      //size:{width: 1176,height: 490},
	      commonSeriesSettings: {
	          type: "line",
	          argumentField: "TIME_DIV",
	          stepline: {
	              point: {
	                  visible: false
	              }
	          }
	      },
	      valueAxis: {    //  y축 옵션
	         	//position: "right",
	          showZero: true, //0부터 시작
	          label: {
	    					customizeText : function(arg){
	    					var items = arg.valueText.split("\n");
	    					$.each(items, function(index, item) {
	    	                   items[index] = AddComma(items[index]);//숫자에 콤마
	    	                });
	    					
	    					return items;
	    				}
	    			}
	      },
	      series: [
	          { valueField: "TIME_SALE_AMT", name: "매출", color: "#2DD790"
	        	  , point: { border: {color: "#2DD790",width: 1,visible: true}//포인트 설정
      				, hoverStyle:{border: {color: "#2DD790",width: 1,visible: true}
      				, color: "#ffffff",size: 13}//포인트 호버 스타일 설정(마우스 오버시)	
              }
	          },
	          { valueField: "TOP5_TIME_SALE_AMT", name: "TOP5평균매출", color: "#E4E4E4" 
	        	  , point: { border: {color: "#7f85ae",width: 1,visible: true}//포인트 설정
      				, hoverStyle:{border: {color: "#7f85ae",width: 1,visible: true}
      				, color: "#ffffff",size: 13}//포인트 호버 스타일 설정(마우스 오버시)	
              }
	          }
	      ],
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	                      return {
	                  text:AddComma(arg.valueText) + "백만"
	              };
	          }
	      },
	      legend: {
	          visible:false
	      }
	  });
	}
}



/**========================================================================================
* 고객 다운로드
========================================================================================*/
function custDownload(){
	
	
	
}


/**========================================================================================
* 응답고객 다운로드
========================================================================================*/
function resCustDownload(){
	
	
	
}



/**========================================================================================
* 행사 Summary
========================================================================================*/
function evtSummary(){
	
	
	
}

</script>

<div id="web_content2">
  <div class="analysis_wrap">
    <!-- 상단 -->
		<div class="analysis_top"></div>
		<!-- 상단 -->
    
    <div class="box gender_area">
      <p class="tit">성별</p>
      <div class="graph_area ">
        <ul>
          <li class="type1">
            <p>응답고객수</p>
            <div class="graph_wrap">
              <div class="graph" id="gen_cust_chart"></div>
               <p class="graph_img"><img src="../../img/web/icon/chart_icon1.png" alt=""></p> 
            </div>
            <ul>
              <li class="list1">
                <span><i></i>남성</span>
                <!--  <p id="gen_male_cnt"></p>-->
                <p><strong id="gen_male_cnt"></strong> 명</p>
              </li>
              <li class="list2">
                <span><i></i>여성</span>
               <!--   <p id="gen_female_cnt"> 명</p> -->
               <p><strong id="gen_female_cnt"></strong> 명</p>
              </li>
            </ul>
          </li>
          <li>
            <p>Top5 평균 응답고객수</p>
            <div class="graph_wrap">
              <div class="graph" id="gen_top5_cust_chart"></div>
              <p class="graph_img"><img src="../../img/web/icon/chart_icon1.png" alt=""></p>
            </div>
            <ul>
              <li class="list1">
                <span><i></i>남성</span>
                <!-- <p id="gen_top5_male_cnt"></p> -->
                <p><strong id="gen_top5_male_cnt"></strong> 명</p>
              </li>
              <li class="list2">
                <span><i></i>여성</span>
                <p><strong id="gen_top5_female_cnt"></strong> 명</p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="graph_area">
        <ul>
          <li class="type2">
            <p>행사매출</p>
            <div class="graph_wrap">
              <div class="graph" id="gen_amt_chart"></div>
              <p class="graph_img"><img src="../../img/web/icon/chart_icon2.png" alt=""></p>
            </div>
            <ul>
              <li class="list1">
                <span><i></i>남성</span>
                <!--  <p id="gen_male_amt"></p> -->
                <p><strong id="gen_male_amt"></strong> 백만</p>
              </li>
              <li class="list2">
                <span><i></i>여성</span>
                <p><strong id="gen_female_amt"></strong> 백만</p>
              </li>
            </ul>
          </li>
          <li>
            <p>Top5 평균 행사매출</p>
            <div class="graph_wrap">
              <div class="graph" id="gen_top5_amt_chart"></div>
              <p class="graph_img"><img src="../../img/web/icon/chart_icon2.png" alt=""></p>
            </div>
            <ul>
              <li class="list1">
                <span><i></i>남성</span>
                <!-- <p id="gen_top5_male_amt"></p> -->
                <p><strong id="gen_top5_male_amt"></strong> 백만</p>
              </li>
              <li class="list2">
                <span><i></i>여성</span>
                <p><strong id="gen_top5_female_amt"></strong> 백만</p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="box age_area">
      <p class="tit">연령대별</p>
      <div class="age_graph type1">
        <div class="graph_wrap">
          <ul class="graph_regend">
            <li class="regend1"><i></i>응답고객수</li>
            <li class="regend2"><i></i>Top5 평균 응답고객수</li>
          </ul>
          <div class="graph" id="cust_age_chart"></div>
          <p class="graph_unit">[단위:명]</p>
        </div>
      </div>
      <div class="age_graph type2">
        <div class="graph_wrap">
          <ul class="graph_regend">
            <li class="regend1"><i></i>행사매출</li>
            <li class="regend2"><i></i>Top5 평균 행사매출</li>
          </ul>
          <div class="graph" id="amt_age_chart"></div>
          <p class="graph_unit">[단위:백만원]</p>
        </div>
      </div>
    </div>
    <div class="box time_area">
      <p class="tit">시간대별</p>
      <div class="time_graph">
        <ul class="graph_regend">
          <li><img src="../../img/web/icon/graph_img2.png" alt="">매출</li>
          <li><img src="../../img/web/icon/graph_img3.png" alt="">Top5 평균 매출</li>
        </ul>
        <div class="graph" id="time_chart"></div>
        <p class="graph_unit">[단위:백만원]</p>
      </div>
    </div>
    <!-- 
    <div class="btn_wrap">
      <a href="javascript:custDownload();">다운로드 고객 다운로드</a>
      <a href="javascript:resCustDownload();">응답고객 다운로드</a>
      <a href="javascript:evtSummary();">행사 Summary</a>
    </div>
     -->
  </div>
</div>