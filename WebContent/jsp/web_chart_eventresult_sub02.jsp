<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">


//접근고객 그룹별 응답비중
var selectEvtPurCustMdlGrp = new oza_TMHandler('com.obzen.bmpanly.ColEvtSaleRate', 'selectEvtPurCustMdlGrp', '0', '\@#%');
selectEvtPurCustMdlGrp.setAddDataField('CAMP_ID', camp_id);
selectEvtPurCustMdlGrp.execute(null, false); //  tm 실행
var tmResult = selectEvtPurCustMdlGrp.getResult(); //  컬렉션 TM 결과 호출
var tmResult_json = "";
if(tmResult != ""){tmResult_json = JSON.parse(tmResult);} //  자바스크립트 객체로 변환
selectEvtPurCustMdlGrp.clear();


//화면 시작 시 실행
$(document).ready(function() {
	
	screenLog("조회", "web_chart_eventresult_sub02", "브랜드마케팅>분석>분석 Report>행사고객분석(VIP/신규)",get_client_ip);//화면 로그(공통)
	
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
	innerHtml += "<div class='tit'><span class='tip_img' title='동일기간 구매한 모든 고객'></span><p>전체고객수</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_md_tot_cust_cnt)+"</strong>명</p>";
	innerHtml += "</li>";
	innerHtml += "<li>";
	innerHtml += "<div class='tit'><p>전체고객<br>객단가</p></div>";
	innerHtml += "<p><strong>"+AddComma(top_md_tot_cust_price)+"</strong>만원	</p>";
	innerHtml += "</li>";
	innerHtml += "</ul>";
	
	$(".analysis_top").html(innerHtml);
	//상단 고정 내용 종료------------------------------------------------------------
	
	drawShinsegaeVIP();//신세계 VIP
	drawNewCustomer();//신규 고객
	drawGrpChartArea();
	//custGrpResRate();//접근 고객 그룹별 응답 비중
});

/**========================================================================================
* 신세계 VIP
========================================================================================*/
function drawShinsegaeVIP(){
	
	//전체고객 수----------------------------------------------------------------------------------------
	$("#shin_tot_rate").text(shin_tot_rate);//비율
	$("#shin_tot_rsp_cust_cnt").text(AddComma(shin_tot_rsp_cust_cnt)+" 명");
	$("#shin_tot_vip_cnt").text(AddComma(shin_tot_vip_cnt));

	var data1 = [{
  			col: "vip",
  	    val: shin_tot_vip_cnt
			}, {
  	    col: "vip외",
  	    val: shin_tot_rsp_cust_cnt ? shin_tot_rsp_cust_cnt-shin_tot_vip_cnt : 1
			}
	];
	
	
	$("#shin_tot_cust").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#4092f8", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data1,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(shin_tot_rsp_cust_cnt+shin_tot_vip_cnt == 0) arg.valueText = 0;
	              return {text: AddComma(arg.valueText) + "명"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      adaptiveLayout: {  
	    	    width: 0, // not 1px  
	    	    height: 0 // not 1px  
	    	},
	      series: [{
	          argumentField: "col",// argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
	});
	
	
	//Top5평균 고객 수----------------------------------------------------------------------------------------
	$("#shin_top5_cust_rate").text(shin_top5_cust_rate);//비율
	$("#shin_top5_rsp_cnt").text(AddComma(shin_top5_rsp_cnt)+" 명");
	$("#shin_top5_cust_vip_cnt").text(AddComma(shin_top5_cust_vip_cnt));
	
	var data2 = [{
  			col: "top5",
  	    val: shin_top5_cust_vip_cnt
			}, {
  	    col: "top5외",
  	    val: shin_top5_rsp_cnt ? shin_top5_rsp_cnt-shin_top5_cust_vip_cnt : 1
			}
	];
	
	
	$("#shin_top5_cust").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#4D5271", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data2,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(shin_top5_rsp_cnt+shin_top5_cust_vip_cnt == 0) arg.valueText = 0;
	              return {text: AddComma(arg.valueText) + "명"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      adaptiveLayout: {  
	    	    width: 0, // not 1px  
	    	    height: 0 // not 1px  
	    	},  
	      series: [{
	          argumentField: "col",// argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
	});
	
	//행사기간 매출----------------------------------------------------------------------------------------
	$("#shin_sale_rate").text(shin_sale_rate);//비율
	$("#shin_sale_rsp_amt").text(AddComma(shin_sale_rsp_amt)+" 백만");
	$("#shin_sale_vip_amt").text(AddComma(shin_sale_vip_amt));
	
	var data3 = [{
  			col: "vip",
  	    val: shin_sale_vip_amt
			}, {
  	    col: "vip외",
  	    val: shin_sale_rsp_amt ? shin_sale_rsp_amt-shin_sale_vip_amt : 1
			}
	];
	
	
	$("#shin_sale").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#4092f8", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data3,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(shin_sale_rsp_amt+shin_sale_vip_amt == 0) arg.valueText = 0;
	              return {text: AddComma(arg.valueText) + "백만"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      adaptiveLayout: {  
	    	    width: 0, // not 1px  
	    	    height: 0 // not 1px  
	    	},  
	      series: [{
	          argumentField: "col",// argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
	});
	
	
	//Top5평균 매출----------------------------------------------------------------------------------------
	$("#shin_top5_sale_rate").text(shin_top5_sale_rate);//비율
	$("#shin_top5_sale_rsp_amt").text(AddComma(shin_top5_sale_rsp_amt)+" 백만");
	$("#shin_top5_sale_vip_amt").text(AddComma(shin_top5_sale_vip_amt));
	
	var data4 = [{
  			col: "vip",
  	    val: shin_top5_sale_vip_amt
			}, {
  	    col: "vip외",
  	    val: shin_top5_sale_rsp_amt ? shin_top5_sale_rsp_amt-shin_top5_sale_vip_amt : 1
			}
	];
	
	
	$("#shin_top5_sale").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#4D5271", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data4,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(shin_top5_sale_rsp_amt+shin_top5_sale_vip_amt == 0) arg.valueText = 0;
	              return {text:AddComma(arg.valueText) + "백만"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      adaptiveLayout: {  
	    	    width: 0, // not 1px  
	    	    height: 0 // not 1px  
	    	},  
	      series: [{
	          argumentField: "col",// argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
	});
}



/**========================================================================================
* 신규고객
========================================================================================*/

function drawNewCustomer(){
	
	//전체고객 수----------------------------------------------------------------------------------------
	$("#new_tot_rate").text(new_tot_rate);//비율
	$("#new_tot_rsp_cust_cnt").text(AddComma(new_tot_rsp_cust_cnt)+" 명");
	$("#new_tot_new_cust_cnt").text(AddComma(new_tot_new_cust_cnt));
	
	var data1 = [{
  			col: "신규",
  	    val: new_tot_new_cust_cnt
			}, {
  	    col: "신규외",
  	    val: new_tot_rsp_cust_cnt ? new_tot_rsp_cust_cnt-new_tot_new_cust_cnt : 1
			}
	];
	
	
	//파이차트
	$("#new_tot_cust").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#7b57e2", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data1,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(new_tot_rsp_cust_cnt+new_tot_new_cust_cnt == 0) arg.valueText = 0;
	              return {text:AddComma(arg.valueText) + "명"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      adaptiveLayout: {  
	    	    width: 0, // not 1px  
	    	    height: 0 // not 1px  
	    	},  
	      series: [{
	          argumentField: "col",// argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
	});
	
	//FOR TEST
	//바게이지 차트
	/*
	$("#new_tot_cust").dxBarGauge({
    	relativeInnerRadius:0.8,
    	backgroundColor:"#E1E6ED",
    	palette: ["#7b57e2"],
    	startValue: 0,
      endValue: new_tot_new_cust_cnt+new_tot_rsp_cust_cnt,
      values: [new_tot_new_cust_cnt],
      "export": {
          enabled: false
      },
      label: {
          visible: false
      },
      legend: {
          visible: false
      }
   });
	*/
	
	
	//Top5평균 고객 수----------------------------------------------------------------------------------------
	$("#new_top5_cust_rate").text(new_top5_cust_rate);//비율
	$("#new_top5_rsp_cust_cnt").text(AddComma(new_top5_rsp_cust_cnt)+" 명");
	$("#new_top5_new_cust_cnt").text(AddComma(new_top5_new_cust_cnt));
	
	var data2 = [{
  			col: "vip",
  	    val: new_top5_new_cust_cnt
			}, {
  	    col: "vip외",
  	    val: new_top5_rsp_cust_cnt ? new_top5_rsp_cust_cnt-new_top5_new_cust_cnt : 1
			}
	];
	
	
	$("#new_top5_cust").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#4d5271", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data2,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(new_top5_rsp_cust_cnt+new_top5_new_cust_cnt == 0) arg.valueText = 0;
	              return {text: AddComma(arg.valueText) + "명"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      adaptiveLayout: {  
	    	    width: 0, // not 1px  
	    	    height: 0 // not 1px  
	    	},  
	      series: [{
	          argumentField: "col",// argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
	});
	
	
	
	//바게이지 차트
	/*
	$("#new_top5_cust").dxBarGauge({
    	relativeInnerRadius:0.8,
    	backgroundColor:"#E1E6ED",
    	palette: ["#4d5271"],
    	startValue: 0,
      endValue: new_top5_new_cust_cnt+new_top5_rsp_cust_cnt,
      values: [new_top5_cust_vip_cnt],
      "export": {
          enabled: false
      },
      label: {
          visible: false
      },
      legend: {
          visible: false
      }
   });
*/	
	//매출액 처리테스트  주석 
	//행사기간 매출----------------------------------------------------------------------------------------
	
	$("#new_sale_rate").text(new_sale_rate);//비율
	$("#new_sale_rsp_amt").text(AddComma(new_sale_rsp_amt)+" 백만");
	$("#new_sale_new_amt").text(AddComma(new_sale_new_amt));
	
	var data3 = [{
  			col: "vip",
  	    val: new_sale_new_amt
			}, {
  	    col: "vip외",
  	    val: new_sale_rsp_amt ? new_sale_rsp_amt-new_sale_new_amt : 1
			}
	];
	
	
	$("#new_sale").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#7b57e2", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data3,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(new_sale_rsp_amt+new_sale_new_amt == 0) arg.valueText = 0;
	              return {text: AddComma(arg.valueText) + "백만"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      adaptiveLayout: {  
	    	    width: 0, // not 1px  
	    	    height: 0 // not 1px  
	    	},  
	      series: [{
	          argumentField: "col",// argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
	});
	
	
	
	//바게이지 차트
	/*
	$("#new_sale").dxBarGauge({
    	relativeInnerRadius:0.8,
    	backgroundColor:"#E1E6ED",
    	palette: ["#7b57e2"],
    	startValue: 0,
      endValue: new_sale_new_amt+new_sale_rsp_amt,
      values: [new_sale_new_amt],
      "export": {
          enabled: false
      },
      label: {
          visible: false
      },
      legend: {
          visible: false
      }
   });
	*/
	
	//Top5평균 매출----------------------------------------------------------------------------------------
	$("#new_top5_sale_rate").text(new_top5_sale_rate);//비율
	$("#new_top5_sale_rsp_amt").text(AddComma(new_top5_sale_rsp_amt)+" 백만");
	$("#new_top5_sale_new_amt").text(AddComma(new_top5_sale_new_amt));
	//val: top5_ent_cust_cnt ? top5_ent_cust_cnt-top5_rsp_cust_cnt : 1
	var data4 = [{
  			col: "vip",
  	    val: new_top5_sale_new_amt
			}, {
  	    col: "vip외",
  	    val: new_top5_sale_rsp_amt ? new_top5_sale_rsp_amt-new_top5_sale_new_amt : 1
			}
	];
	
	
	$("#new_top5_sale").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#4D5271", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data4,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(new_top5_sale_rsp_amt+new_top5_sale_new_amt == 0) arg.valueText = 0;	
	              return {text: AddComma(arg.valueText) + "백만"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      adaptiveLayout: {  
	    	    width: 0, // not 1px  
	    	    height: 0 // not 1px  
	    	},  
	      series: [{
	          argumentField: "col",// argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
	});
	
	
	//바게이지 차트
	/*
	$("#new_top5_sale").dxBarGauge({
    	relativeInnerRadius:0.8,
    	backgroundColor:"#E1E6ED",
    	palette: ["#4d5271"],
    	startValue: 0,
      endValue: new_top5_sale_rsp_amt,
      values: [new_top5_sale_new_amt],
      "export": {
          enabled: false
      },
      label: {
          visible: false
      },
      legend: {
          visible: false
      }
   });
	*/
	
}

function drawGrpChartArea(){
	var divHtml = "";
	var chartId = "";
	var mdl_cust_cnt = "";
	var mdl_sale_cust_cnt = "";
	var mdl_sale_amt = "";
	var mdl_cust_price = "";
	var mdl_card_id = "";
	var mdl_card_type = "";
	var mdl_card_title = "";
	
	for(var i=0; i<tmResult_json.length; i++){//  영역그리기
		
		mdl_card_id = tmResult_json[i].CUSTG_MDL_ID;
		chartId = "mdl_chart_" + mdl_card_id;
		
		mdl_cust_cnt = parseInt(isNullZero(tmResult_json[i].MDL_CUST_CNT));
		mdl_sale_cust_cnt = parseInt(isNullZero(tmResult_json[i].MDL_SALE_CUST_CNT));
		mdl_sale_amt = parseFloat(isNullZero(tmResult_json[i].MDL_CUST_SALE_AMT));
		mdl_cust_price = parseFloat(isNullZero(tmResult_json[i].MDL_CUST_PPC));
		
		if(mdl_sale_amt != 0)   mdl_sale_amt = exCeil(mdl_sale_amt/division_amt, 1);
		if(mdl_cust_price != 0) mdl_cust_price = exCeil(mdl_cust_price/division_ppc, 1);
		
		mdl_card_type = "type5"; //기본 타입은 기타
		if(mdl_card_id == "001") mdl_card_type = "type1";
		if(mdl_card_id == "002") mdl_card_type = "type2";
		if(mdl_card_id == "004") mdl_card_type = "type3";
		if(mdl_card_id == "005") mdl_card_type = "type4";
		
		divHtml += "<li>";
		divHtml += " <p class='sub_tit'>";
		divHtml += tmResult_json[i].CUSTG_MDL_NM;
		divHtml += " </p>";
		divHtml += " <div class='card_bg " + mdl_card_type + "'>";
		divHtml += "   <span>접근고객</span>";
		divHtml += "   <p><strong>" + AddComma(mdl_cust_cnt) + "</strong>명</p>";
		divHtml += " </div>";
		divHtml += " <ul>";
		divHtml += "  <li>";
		divHtml += "   <span>응답고객</span>";
		divHtml += "   <p class='type1'><strong>" + AddComma(mdl_sale_cust_cnt) + "</strong>명</p>";
		divHtml += "  </li> ";
		divHtml += "  <li> ";
		divHtml += "   <span>응답고객 매출</span>";
		divHtml += "   <p class='type2'><strong>" + AddComma(mdl_sale_amt) + "</strong>백만</p>";
		divHtml += "  </li> ";
		divHtml += "  <li> ";
		divHtml += "  <span>객단가</span>";
		divHtml += "  <p><strong>" + AddComma(mdl_cust_price) + "</strong>만원</p>";
		divHtml += "  </li> ";
		divHtml += " </ul> ";
		divHtml += "</li> ";
		
	}
	$("#mdl_rsp_area").html(divHtml);
	/*
	for(var i=0; i<tmResult_json.length; i++){//  차트조회
		chartId = "mdl_chart_" + tmResult_json[i].CUSTG_MDL_ID;
		
		mdl_cust_cnt = parseInt(isNullZero(tmResult_json[i].MDL_CUST_CNT));
		mdl_sale_cust_cnt = parseInt(isNullZero(tmResult_json[i].MDL_SALE_CUST_CNT));
		
		selectGrptChart(chartId, mdl_cust_cnt, mdl_sale_cust_cnt);
	}
	*/
	
}

function selectGrptChart(arg_chart_id, arg_mdl_cust_cnt, arg_mdl_sale_cust_cnt){
	var chart_id = "#" + arg_chart_id;
	var mdl_data = null;
	
	mdl_data = [
    	    {
            column: "명",
            val1: arg_mdl_sale_cust_cnt,
            val2: arg_mdl_cust_cnt? arg_mdl_cust_cnt-arg_mdl_sale_cust_cnt : 1
    	    }
	];
	
	$(chart_id).dxChart({
		animation:{
	            duration: 2000 // 로딩 milliseconds 지정
	     },
	     dataSource: mdl_data,
	     commonSeriesSettings: {
	         argumentField: "column",  // argumentField 지정
	         type: "fullStackedBar"
	     },
	     size: {  width : 130, height : 182 },
	     argumentAxis: { visible: false, label: {visible:false} }, // x축 옵션
	     valueAxis: {visible : true, // y축 옵션
	                  grid : { visible : false },
	                  tick: {visible : false},
	                  label: {visible : false},
	                  position:"right"
	      },
	      series: [
	          { valueField: "val1", name: "val1", color: "#4590eb" }, // valueField 지정
	          { valueField: "val2", name: "val2", color: "#E1E6ED"}
	        ],
	        legend: {
	            visible: false
	        },
	        tooltip: {
	            enabled: true,
	            customizeTooltip: function (arg) {
	                return {
	                    text: arg.valueText + "명"
	                };
	            }
	        }
		
		
	});
}

</script>
<div id="web_content2">
  <div class="analysis_wrap">
    <!-- 상단 -->
		<div class="analysis_top"></div>
		<!-- 상단 -->
    <div class="box analysis1">
      <p class="tit">행사참여고객 중 신세계 VIP 비중</p>
      <div class="analysis_area">
        <ul>
          <li>
            <p>VIP 매출비중<span class='tip_img' title='신세계 정규 VIP 트리니티~연간레드 등급의 고객입니다.'></span></p>
            <div class="graph_wrap">
              <div class="graph" id="shin_sale"></div>
              <p class="graph_txt type1"><span id="shin_sale_rate"></span>%</p>
            </div>
            <ul>
              <li>
                <span>VIP매출</span>
                <p class="type1"><strong id="shin_sale_vip_amt"></strong> 백만</p>
                
              </li>
              <li>
                <span>응답고객매출</span>
                <p id="shin_sale_rsp_amt"></p>
              </li>
            </ul>
          </li>
          <li>
            <p>Top5 평균 VIP 매출비중</p>
            <div class="graph_wrap">
              <div class="graph" id="shin_top5_sale"></div>
              <p class="graph_txt type4"><span id="shin_top5_sale_rate"></span>%</p>
            </div>
            <ul>
              <li>
                <span>VIP매출</span>
                <p class="type4"><strong id="shin_top5_sale_vip_amt"></strong> 백만</p>
              </li>
              <li>
                <span>응답고객매출</span>
              	<p id="shin_top5_sale_rsp_amt"></p>  
              </li>
            </ul>
          </li>
        </ul>
      </div>
       <div class="analysis_area">
        <ul>
          <li>
            <p>VIP고객수 비중</p>
            <div class="graph_wrap">
              <div class="graph" id="shin_tot_cust"></div>
              <p class="graph_txt type1"><span id="shin_tot_rate"></span>%</p>
            </div>
            <ul>
              <li>
                <span>VIP고객수</span>
              	<p class="type1"><strong id="shin_tot_vip_cnt"></strong> 명</p>  
              </li>
              <li>
                <span>응답고객수</span>
                <p id="shin_tot_rsp_cust_cnt"></p>
              </li>
            </ul>
          </li>
          <li>
            <p>Top5 평균 VIP고객수 비중</p>
            <div class="graph_wrap">
              <div class="graph" id="shin_top5_cust"></div>
              <p class="graph_txt type4"><span id="shin_top5_cust_rate"></span>%</p>
            </div>
            <ul>
              <li>
                <span>VIP고객수</span>
                <p class="type4"><strong id="shin_top5_cust_vip_cnt"></strong> 명</p>
              </li>
              <li>
                <span>응답고객수</span>
                <p id="shin_top5_rsp_cnt"></p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="box analysis2">
      <p class="tit">행사참여고객 중 신규 고객 비중</p>
      <div class="analysis_area">
        <ul>
          <li>
            <p>신규고객 매출비중<span class='tip_img' title='최근 1년간 구매 경험이 없는 고객'></span></p>
            <div class="graph_wrap">
              <div class="graph" id="new_sale"></div>
              <p class="graph_txt type3"><span id="new_sale_rate"></span>%</p>
            </div>
            <ul>
              <li>
              	<span>신규고객매출</span>
                <p class="type3"><strong id="new_sale_new_amt"></strong> 백만</p>
              </li>
              <li>
             	<span>응답고객매출</span>
                <p id="new_sale_rsp_amt"></p>   
              </li>
            </ul>
          </li>
          <li>
            <p>Top5 평균 신규고객 매출비중</p>
            <div class="graph_wrap">
              <div class="graph" id="new_top5_sale"></div>
              <p class="graph_txt type4"><span id="new_top5_sale_rate"></span>%</p>
            </div>
            <ul>
              <li>
                <span>신규고객매출</span>
                <p class="type4"><strong id="new_top5_sale_new_amt"></strong> 백만</p>
              </li>
              <li>
              	<span>응답고객매출</span>
                <p id="new_top5_sale_rsp_amt"></p>  
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="analysis_area">
        <ul>
          <li>
            <p>신규고객수 비중</p>
            <div class="graph_wrap">
              <div class="graph" id="new_tot_cust"></div>
              <p class="graph_txt type3"><span id="new_tot_rate"></span>%</p>
            </div>
            <ul>
              <li>
              	<span>신규고객수</span>
                <p class="type3"><strong id="new_tot_new_cust_cnt"></strong> 명</p>
              </li>
              <li>
                <span>응답고객수</span>
                <p id="new_tot_rsp_cust_cnt"></p>
              </li>
            </ul>
          </li>
          <li>
            <p>Top5 평균 신규고객수 비중</p>
            <div class="graph_wrap">
              <div class="graph" id="new_top5_cust"></div>
              <p class="graph_txt type4"><span id="new_top5_cust_rate"></span>%</p>
            </div>
            <ul>
              <li>
                <span>신규고객수</span>
                <p class="type4"><strong id="new_top5_new_cust_cnt"></strong> 명</p>
              </li>
              <li>
                <span>응답고객수</span>
                <p id="new_top5_rsp_cust_cnt"></p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      
    </div>
    <div class="box analysis3">
      <p class="tit">접근고객 그룹별 응답 비중</p>
      <ul id = "mdl_rsp_area">
      	<li>
         <p class="sub_tit">구매이력 고객</p>
    		 <div class="card_bg type1">
          <span>접근고객</span>
          <p><strong>1,950</strong>명</p>
         </div>
    		 <ul>
    		  <li>
    		   <span>응답고객</span>
    		   <p class='type1'><strong>44</strong>명</p>
    		  </li> 
    		  <li> 
    		   <span>응답고객 매출</span>
    		   <p class='type2'><strong>2</strong>백만</p>
    		  </li> 
    		  <li> 
    		  <span>객단가</span>
    		  <p><strong>3</strong>만원</p>
    		  </li> 
    		 </ul> 
    		</li>
        <li>
          <p class="sub_tit">구매이력 고객</p>
         <div class="card_bg type2">
          <span>접근고객</span>
          <p><strong>1,950</strong>명</p>
         </div>
         <ul>
          <li>
           <span>응답고객</span>
           <p class='type1'><strong>44</strong>명</p>
          </li> 
          <li> 
           <span>응답고객 매출</span>
           <p class='type2'><strong>2</strong>백만</p>
          </li> 
          <li> 
          <span>객단가</span>
          <p><strong>3</strong>만원</p>
          </li> 
         </ul> 
        </li>
        <li>
        <p class="sub_tit">구매이력 고객</p>
         <div class="card_bg type3">
          <span>접근고객</span>
          <p><strong>1,950</strong>명</p>
         </div>
         <ul>
          <li>
           <span>응답고객</span>
           <p class='type1'><strong>44</strong>명</p>
          </li> 
          <li> 
           <span>응답고객 매출</span>
           <p class='type2'><strong>2</strong>백만</p>
          </li> 
          <li> 
          <span>객단가</span>
          <p><strong>3</strong>만원</p>
          </li> 
         </ul> 
        </li>
        <li>
        <p class="sub_tit">구매이력 고객</p>
         <div class="card_bg type4">
          <span>접근고객</span>
          <p><strong>1,950</strong>명</p>
         </div>
         <ul>
          <li>
           <span>응답고객</span>
           <p class='type1'><strong>44</strong>명</p>
          </li> 
          <li> 
           <span>응답고객 매출</span>
           <p class='type2'><strong>2</strong>백만</p>
          </li> 
          <li> 
          <span>객단가</span>
          <p><strong>3</strong>만원</p>
          </li> 
         </ul> 
        </li>
        <li>
        <p class="sub_tit">구매이력 고객</p>
         <div class="card_bg type5">
          <span>접근고객</span>
          <p><strong>1,950</strong>명</p>
         </div>
         <ul>
          <li>
           <span>응답고객</span>
           <p class='type1'><strong>44</strong>명</p>
          </li> 
          <li> 
           <span>응답고객 매출</span>
           <p class='type2'><strong>2</strong>백만</p>
          </li> 
          <li> 
          <span>객단가</span>
          <p><strong>3</strong>만원</p>
          </li> 
         </ul> 
        </li>
      </ul>
    </div>
  </div>
</div>
