<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
 
var division_value = 1000000;//백만원

var camp_id = "";
var camp_nm = "";
var date_nm = "";
var promotion_nm = "";
 
var accure_flag = "";
var accure_sale_amt = "";//누적 매출액
var tot_amt = "";//총 비용
 
var approach_cnt = "";
var select_cnt = "";
var select_rate = "";
var use_cnt = "";
var use_rate = "";

 
 
//TM Start =================================================================================================

	
//TM End ===================================================================================================	
 
/*
//sample-------------------------------------------------------------------------------------------------
camp_nm = "제이트리 강남점 팝업 스토어 입점 이벤트";
date_nm = "2019.11.11 ~ 2019.11.14, 4일간";
promotion_nm = "50,000원 이상 결재 시, 3,000원 할인";
 
accure_flag = "down";
accure_sale_amt = "1560000";//누적 매출액
tot_amt = "950000";//총 비용
 

approach_cnt = "10000";
approach_cnt = "5000";
select_cnt = "84";
select_rate = "10.2";
use_cnt = "345";
use_rate = "100";
//sample--------------------------------------------------------------------------------------------------
*/

	
 
//화면 로드 시 실행
$(document).ready(function() {
  screenLog("조회", "web_chart_shinhancard_info_sub", "행사결과보기>분석Report(신한카드)",get_client_ip);//화면 로그(공통)
  
  historyList();
  campInfoSelect(camp_id);
});



/**========================================================================================
* text 설정
========================================================================================*/
function txtSetting(){
	
	//형변환
	approach_cnt = parseInt(isNullZero(approach_cnt));
	tot_amt = parseInt(isNullZero(tot_amt));
	accure_sale_amt = parseInt(isNullZero(accure_sale_amt));
	approach_cnt = parseInt(isNullZero(approach_cnt));
	select_cnt = parseInt(isNullZero(select_cnt));
	select_rate = parseFloat(isNullZero(select_rate));
	use_cnt = parseInt(isNullZero(use_cnt));
	use_rate = parseFloat(isNullZero(use_rate));
	
	
	//캠페인명
	$("#camp_nm").html(camp_nm);
	
	//날짜
	$("#date_nm").html(date_nm);
	
	//프로모션
	$("#promotion_nm").html(promotion_nm);
	
	
	//누적 매출액
	if(accure_sale_amt > 0){
		accure_sale_amt = exRound((parseInt(accure_sale_amt)/division_value)*100,2);
	}
		
	if(accure_flag == "up"){$("#accure_sale_amt").addClass("up");}
	else if(accure_flag == "down"){$("#accure_sale_amt").addClass("down");}
	
	$("#accure_sale_amt").html(AddComma(accure_sale_amt)+"<span>백만원</span>");	
	
		
	
	
	//총 비용
	$("#tot_amt").html(AddComma(tot_amt)+"<span>원</span>");
}


/**========================================================================================
* history 조회
========================================================================================*/
function historyList(){
var innerHtml = "";
	
	//행사 목록 조회
	var evtListTm = new oza_TMHandler('com.obzen.bmpanly.ColShinhanRst', 'selectEvtList', '0', '\@#%');
	evtListTm.setAddDataField('MD_CD', md_cd);
	evtListTm.setAddDataField('STORE_CD', store_cd);
	evtListTm.execute(null, false);
	var evtListTmResult = evtListTm.getResult();
	var evtListTm_json = "";
	if(evtListTmResult != ""){evtListTm_json = JSON.parse(evtListTmResult);}
	evtListTm.clear();
	
	var old_ym = "";
	var base_ym = "";
	var his_store_nm = "";
	var his_camp_nm = "";
	var his_camp_id = "";
	var his_camp_stat_cd = "";
	var his_camp_stat_nm = "";
	var classType = "";
	
	var his_camp_period = "";
	var his_offer_brch = "";
	var his_disc_rate = "";
	var his_disc_amt = "";
	var his_min_pur_amt = "";
	var his_max_disc_amt = "";
	var his_appr_cln_cn = "";
	var his_slt_cln_cn = "";
	var his_use_cln_cn = "";
	var his_evt_amt = "";
	
	
	for(var i=0; i<evtListTm_json.length; i++) {
		base_ym = evtListTm_json[i].BASE_YM;//기준년월
		his_camp_period = evtListTm_json[i].CAMP_PERIOD;//캠페인기간
		his_store_nm = evtListTm_json[i].STORE_NM;//점포명
		his_camp_id = evtListTm_json[i].CAMP_ID;//캠페인ID
		his_camp_nm = evtListTm_json[i].CAMP_NM;//캠페인명
		his_camp_stat_cd = evtListTm_json[i].CAMP_STAT_CD;//2:진행중, 3:완료
		his_camp_stat_nm = evtListTm_json[i].CAMP_STAT_NM;//진행중, 완료
		his_offer_brch = evtListTm_json[i].OFFER_BRCH;//오퍼분류
		his_disc_rate = isNullZero(evtListTm_json[i].DISC_RATE);//할인비율
		his_disc_amt = AddComma(isNullZero(evtListTm_json[i].DISC_AMT));//할인액
		his_min_pur_amt = AddComma(isNullZero(evtListTm_json[i].MIN_PUR_AMT));//최소구매금액
		his_max_disc_amt = AddComma(isNullZero(evtListTm_json[i].MAX_DISC_AMT));//최대할인금액
		his_appr_cln_cn = AddComma(isNullZero(evtListTm_json[i].APPR_CLN_CN));//접근고객수
		his_slt_cln_cn = AddComma(isNullZero(evtListTm_json[i].SLT_CLN_CN));//다운로드고객
		his_use_cln_cn = AddComma(isNullZero(evtListTm_json[i].USE_CLN_CN));//응답고객
		
		if(parseInt(isNullZero(evtListTm_json[i].EVT_AMT)) > 0){
			his_evt_amt = AddComma(exRound(parseInt(isNullZero(evtListTm_json[i].EVT_AMT))/division_value,2));//매출액	
		}else{
			his_evt_amt = "0";//매출액
		}
		
		
		if(his_camp_stat_cd == "2"){classFlag = "on";}//진행중
		if(his_camp_stat_cd == "3"){classFlag = "off";}//완료
		if(i == 0){camp_id = evtListTm_json[i].CAMP_ID;}//최초 캠페인 ID 설정 
		
		if(i == 0){
			innerHtml += "<li>";
			innerHtml += "<div class='date'>";
			innerHtml += "<p>"+base_ym.substring(0,4)+"년 "+base_ym.substring(4,6)+"월</p>";
			innerHtml += "</div>";
			
			old_ym = base_ym;
		}else{
			if(base_ym != old_ym){
				innerHtml += "</li>";
				innerHtml += "<li>";
				innerHtml += "<div class='date'>";
				innerHtml += "<p>"+base_ym.substring(0,4)+"년 "+base_ym.substring(4,6)+"월</p>";
				innerHtml += "</div>";
				old_ym = base_ym;
			}
		}
		
		innerHtml += "<div class='his_list "+classFlag+"' onclick=\"javascript:campInfoSelect('"+his_camp_id+"');\">";
		innerHtml += "<div class='event_cnt'>"
		innerHtml += "<strong>"+his_store_nm+"<span>"+his_camp_stat_nm+"</span></strong>";
		innerHtml += "<p class='event_date'>"+his_camp_period+"</p>";
		innerHtml += "<p class='event_nm'>"+his_camp_nm+"</p>";
		innerHtml += "<p class='event_txt'>";
		
		
		//정률
		if(his_offer_brch == "110101"){
			innerHtml += his_disc_rate+"% 할인 ";
			innerHtml += his_min_pur_amt+"원 이상 결제 시 ";
			innerHtml += "최대 "+his_max_disc_amt+"원 까지";
		}
		
		//정액
		if(his_offer_brch == "120101"){
			innerHtml += his_min_pur_amt+"원 이상 결제 시 ";
			innerHtml += "최대 "+his_disc_amt+"원 까지";
		}
		
		innerHtml += "</p>";
		innerHtml += "<ul>";
		innerHtml += "<li class='client1'>접근고객<p>"+his_appr_cln_cn+"명</p></li>";
		innerHtml += "<li class='client2'>다운로드고객<p>"+his_slt_cln_cn+"명</p></li>";
		innerHtml += "<li class='client3'>응답고객<p>"+his_use_cln_cn+"명</p></li>";
		innerHtml += "</ul>";
		innerHtml += "</div>";
		innerHtml +="<div class='amount'>매출액 <p>"+his_evt_amt+"</p>백만</div>"
		innerHtml += "</div>";
	}
	
	innerHtml += "</li>";
	
	
	$(".his_cnt").html(innerHtml);
	
	//마우스 커서 설정
	$(".his_cnt li").css("cursor","pointer");
}



/**========================================================================================
* History 행사 클릭 시 이벤트
========================================================================================*/
function campInfoSelect(val){
	
	camp_id = val;
	
	var camp_str_dt = "";
	var camp_end_dt = "";
	var camp_period = "";
	var offer_brch = "";
	var disc_rate = "";
	var disc_amt = "";
	var min_pur_amt = "";
	var max_disc_amt = "";
	promotion_nm = "";
	
	
	//신한카드행사 결과 조회
	var shinhanEvtInfoTm = new oza_TMHandler('com.obzen.bmpanly.DocShinhanRst', 'selectShinhanEvtInfo', '1', '\@#%');
	shinhanEvtInfoTm.setAddDataField('CAMP_ID', camp_id);
	shinhanEvtInfoTm.returnlist('CAMP_NM'+//행사명
                        			';CAMP_STR_DT'+//행사시작일자
                        			';CAMP_END_DT'+//행사종료일자							
                        			';CAMP_PERIOD'+//캠페인 기간
                        			';OFFER_BRCH'+//오퍼분류
                        			';DISC_RATE'+//할인비율
                        			';DISC_AMT'+//할인액
                        			';MIN_PUR_AMT'+//최소구매금액
                        			';MAX_DISC_AMT'+//최대할인금액
                        			';APPR_CLN_CN'+//접근고객수
                        			';SLT_CLN_CN'+//다운로드고객수
                        			';USE_CLN_CN'+//응답고객수
                        			';EVT_AMT'+//누적매출액
                        			';EVT_COST');//총비용
	shinhanEvtInfoTm.execute(null, false);
	camp_nm = shinhanEvtInfoTm.ElementValue('CAMP_NM');
	camp_str_dt = shinhanEvtInfoTm.ElementValue('CAMP_STR_DT');
	camp_end_dt = shinhanEvtInfoTm.ElementValue('CAMP_END_DT');
	camp_period = shinhanEvtInfoTm.ElementValue('CAMP_PERIOD');
	offer_brch = shinhanEvtInfoTm.ElementValue('OFFER_BRCH');
	disc_rate = shinhanEvtInfoTm.ElementValue('DISC_RATE');
	disc_amt = shinhanEvtInfoTm.ElementValue('DISC_AMT');
	min_pur_amt = shinhanEvtInfoTm.ElementValue('MIN_PUR_AMT');
	max_disc_amt = shinhanEvtInfoTm.ElementValue('MAX_DISC_AMT');
	approach_cnt = shinhanEvtInfoTm.ElementValue('APPR_CLN_CN');
	select_cnt = shinhanEvtInfoTm.ElementValue('SLT_CLN_CN');
	use_cnt = shinhanEvtInfoTm.ElementValue('USE_CLN_CN');
	accure_sale_amt = shinhanEvtInfoTm.ElementValue('EVT_AMT');
	tot_amt = shinhanEvtInfoTm.ElementValue('EVT_COST');
	shinhanEvtInfoTm.clear();	
	
	//정률
	if(offer_brch == "110101"){
		promotion_nm += disc_rate+"% 할인 ";
		promotion_nm += AddComma(isNullZero(min_pur_amt))+"원 이상 결제 시 ";
		promotion_nm += "최대 "+AddComma(isNullZero(max_disc_amt))+"원 까지";
	}
	
	//정액
	if(offer_brch == "120101"){
		promotion_nm += AddComma(isNullZero(min_pur_amt))+"원 이상 결제 시 ";
		promotion_nm += "최대 "+AddComma(isNullZero(disc_amt))+"원 까지";
	}
	
	date_nm = camp_str_dt + " ~ " +camp_end_dt+", ("+camp_period+")일간";
	if(camp_nm == ""){camp_nm = "&nbsp;";}
	if(camp_str_dt == ""){date_nm = "&nbsp;";}
	if(offer_brch == ""){promotion_nm = "&nbsp;";}
	if(promotion_nm == ""){promotion_nm = "&nbsp;";}
	
	
	//문구, 차트 재조회
	txtSetting();
	selectCustChart();
  useCustChart();
  approachCustChart();
  accureCustChart();
  accureAmtChart();
}



/**========================================================================================
* 접근고객 Chart
========================================================================================*/
function approachCustChart(){
	
	//차트 안 숫자 표시
	$("#approach_cnt").text(AddComma(approach_cnt));
	
	//Doughnut Chart Start==========================================================
	var data = [{
  			region: "접근고객",
  	    val: approach_cnt
  		}, {
  	    region: "전체고객",
  	    val: approach_cnt ? approach_cnt : 1
  	  }
	];
	
	
	$("#approachCustChart").dxPieChart({
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#2ed790", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data,  // 데이터소스 지정
	      /*
	      tooltip: {
	            enabled: true,
	            customizeTooltip: function (arg) {
	                return {
	                    text: arg.valueText + "%"
	                    
	                };
	            }
	        },
	      */  
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
	          argumentField: "region",  // argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
		});
	//Doughnut Chart End============================================================
	
}


/**========================================================================================
* 다운로드고객 Chart
========================================================================================*/
function selectCustChart(){
	//차트 안 숫자 표시
	$("#select_rate").text(select_rate);
	$("#select_cnt").text("("+AddComma(select_cnt)+"명)");
	
	//Doughnut Chart Start==========================================================
	var data = [{
  			region: "다운로드고객",
  	    val: select_cnt
  		}, {
  	    region: "전체고객",
  	    val: approach_cnt ? approach_cnt-select_cnt : 1
  	  }
	];
	
	
	$("#selectCustChart").dxPieChart({
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#2ed790", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data,  // 데이터소스 지정
	      /*
	      tooltip: {
	            enabled: true,
	            customizeTooltip: function (arg) {
	                return {
	                    text: arg.valueText + "%"
	                    
	                };
	            }
	        },
	      */  
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
	          argumentField: "region",  // argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
		});
	//Doughnut Chart End============================================================
}



/**========================================================================================
* 응답고객 Chart
========================================================================================*/
function useCustChart(){
	//차트 안 숫자 표시
	$("#use_rate").text(use_rate);
	$("#use_cnt").text("("+AddComma(use_cnt)+"명)");
	
	//Doughnut Chart Start==========================================================
	var data = [{
  			region: "응답고객",
  	    val: use_cnt
  		}, {
  	    region: "전체고객",
  	    val: approach_cnt ? approach_cnt-use_cnt : 1
  	  }
	];
	
	
	$("#useCustChart").dxPieChart({
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#2ed790", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data,  // 데이터소스 지정
	      /*
	      tooltip: {
	            enabled: true,
	            customizeTooltip: function (arg) {
	                return {
	                    text: arg.valueText + "%"
	                    
	                };
	            }
	        },
	      */  
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
	          argumentField: "region",  // argument 지정
	          label: {
	              visible: false,
	              //format: "millions",
	              connector: {
	                  visible: false
	              }
	          }
	      }]
		});
	//Doughnut Chart End============================================================
}


/**========================================================================================
* 누적이용 고객 Chart
========================================================================================*/
function accureCustChart(){
	
  //날짜별 이용 고객수 조회
	var shinhanCntTm = new oza_TMHandler('com.obzen.bmpanly.ColShinhanRst', 'selectShinhanCnt', '0', '\@#%');
	shinhanCntTm.setAddDataField('CAMP_ID', camp_id);
	shinhanCntTm.execute(null, false);
	var shinhanCntTmResult = shinhanCntTm.getResult();
	var shinhanCntTm_json = "";
	if(shinhanCntTmResult != ""){shinhanCntTm_json = JSON.parse(shinhanCntTmResult);}
	shinhanCntTm.clear();
	
//Area Chart Start==========================================================
	
	// sample 데이터소스
	var data = "";
	
	/*
	shinhanCntTm_json = [
		{ BASEDT: "11.11",
			CUST_CNT: 700
	    },
	    {BASEDT: "11.12",
	    	CUST_CNT: 900
	    },
	    {BASEDT: "11.13",
	    	CUST_CNT: 300
	    },
	    {BASEDT: "11.14",
	    	CUST_CNT: 700
	    },
	    {BASEDT: "11.15",
	    	CUST_CNT: 1000
	    }
	];
	*/
	
	data = shinhanCntTm_json;
	
	
	
	for(var i=0; i<data.length; i++) {
		data[i].CUST_CNT = parseInt(isNullZero(data[i].CUST_CNT));
	}
	
	
	
	if(data.length == 0){
		$("#accureCustChart").html("<p class='nodata'>누적이용 고객 데이터가 없습니다.</p>");
		
	}else{
		var chart = $("#accureCustChart").dxChart({
			//size:{width:520, height:220},
			palette: ["#2ed790","#808592"],
	        dataSource: data,
	        commonSeriesSettings: {
	            type: "area",
	            argumentField: "BASEDT"
	        },
	        series: [   //  {계열1}, {계열2}, ...
	            {
					valueField: "CUST_CNT",
					name: "누적이용고객",
					color: "#2ed790",
					label : {
						visible: true,
						font:{color:"#2ed790",weight:690},
						customizeText : function(arg){
      				var items = arg.valueText.split("\n");
      				$.each(items, function(index, item) {
                         items[index] = AddComma(items[index])+"명";//숫자에 콤마
                      });
      				
      				return items;
						},
						backgroundColor:"none"
					},
					point: { visible: true,border: {color: "#2ed790",width: 3,visible: true},//포인트 설정
							hoverStyle:{border: {color: "#2ed790",width: 5,visible: true},color: "#ffffff",size: 13},//포인트 호버 스타일 설정(마우스 오버시)	
							color: "#ffffff",size: 11
							},
					border: {
		                visible:true,
		                width:2,
		                color: "#2ed790"
		              }		
		        }
					],
	        argumentAxis: {
	            valueMarginsEnabled: false,
	            grid: {visible: false},
	            color: "#ffffff",
	            tick:{     // 눈금
	                color: "#ffffff"
	            }
	        },
	        valueAxis: {    //  y축 옵션
	           	visible:true,
	        	color: "#ffffff",
	            tick:{
	                color: "#ffffff"
	            },
	            grid: {visible: true},
	            //position: "right",
	            label: {
	        				customizeText : function(arg){
	        				var items = arg.valueText.split("\n");
	        				$.each(items, function(index, item) {
	                           items[index] = AddComma(items[index])+"명";//숫자에 콤마
	                        });
	        				
	        				return items;
	        			}
	        		},
	            showZero: true//0부터 시작
	        },
	        "export": {
	            enabled: false
	        },
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
	}
	
	//Area Chart End============================================================
}


/**========================================================================================
* 누적매출 Chart
========================================================================================*/
function accureAmtChart(){
	
  //날짜별 누적매출액 조회
	var shinhanAmtTm = new oza_TMHandler('com.obzen.bmpanly.ColShinhanRst', 'selectShinhanAmt', '0', '\@#%');
	shinhanAmtTm.setAddDataField('CAMP_ID', camp_id);
	shinhanAmtTm.execute(null, false);
	var shinhanAmtTmResult = shinhanAmtTm.getResult();
	var shinhanAmtTm_json = "";
	if(shinhanAmtTmResult != ""){shinhanAmtTm_json = JSON.parse(shinhanAmtTmResult);}
	shinhanAmtTm.clear();
	
//Area Chart Start==========================================================
	
	// sample 데이터소스
	var data = "";
	
	/*
	shinhanAmtTm_json = [
		{ BASEDT: "11.11",
			AMT: 700
	    },
	    {BASEDT: "11.12",
	    	AMT: 900
	    },
	    {BASEDT: "11.13",
	    	AMT: 300
	    },
	    {BASEDT: "11.14",
	    	AMT: 700
	    },
	    {BASEDT: "11.15",
	    	AMT: 1000
	    }
	];
	*/
	
	data = shinhanAmtTm_json;
	
	
	
	for(var i=0; i<data.length; i++) {
		data[i].AMT = parseInt(isNullZero(data[i].AMT));
	}
	
	
	
	if(data.length == 0){
		$("#accureAmtChart").html("<p class='nodata'>누적매출액 데이터가 없습니다.</p>");
		
	}else{
		var chart = $("#accureAmtChart").dxChart({
			//size:{width:520, height:220},
			palette: ["#2ed790","#808592"],
	        dataSource: data,
	        commonSeriesSettings: {
	            type: "area",
	            argumentField: "BASEDT"
	        },
	        series: [   //  {계열1}, {계열2}, ...
	            {
					valueField: "AMT",
					name: "누적매출",
					color: "#2ed790",
					//label : {visible: true,font:{color:"#7b57e2",weight:690},backgroundColor:"none"},//weight(글자 진하기 정도)
					point: { visible: true,border: {color: "#2ed790",width: 3,visible: true},//포인트 설정
							hoverStyle:{border: {color: "#2ed790",width: 5,visible: true},color: "#ffffff",size: 13},//포인트 호버 스타일 설정(마우스 오버시)	
							color: "#ffffff",size: 11
							},
					border: {
		                visible:true,
		                width:2,
		                color: "#2ed790"
		              }		
		        }
					],
	        argumentAxis: {
	            valueMarginsEnabled: false,
	            grid: {visible: false},
	            color: "#ffffff",
	            tick:{     // 눈금
	                color: "#ffffff"
	            }
	        },
	        valueAxis: {    //  y축 옵션
	           	visible:true,
	        	color: "#ffffff",
	            tick:{
	                color: "#ffffff"
	            },
	            grid: {visible: true},
	            //position: "right",
	            label: {
	        				customizeText : function(arg){
	        				var items = arg.valueText.split("\n");
	        				$.each(items, function(index, item) {
	                           items[index] = AddComma(items[index]);//숫자에 콤마
	                        });
	        				
	        				return items;
	        			}
	        		},
	            showZero: true//0부터 시작
	        },
	        "export": {
	            enabled: false
	        },
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
	}
	
	//Area Chart End============================================================
}

</script>
<div class="f_l brand_history">
  <p class="tit">History</p>
  <ul class="his_cnt">
  </ul>
</div>
<div class="f_r brand_event">
  <div class="be_cnt1">
    <p class="tit" id="camp_nm"></p>
    <span id="date_nm"></span>
    <strong id="promotion_nm"></strong>
    <ul>
      <li>
        <div class="graph_wrap">
          <p class="graph_tit">접근고객</p>
          <div class="graph_txt"><p id="approach_cnt"></p><br>명</div>
          <div class="graph" id="approachCustChart"></div>
        </div>
      </li>
      <li>
        <div class="graph_wrap">
          <p class="graph_tit">다운로드고객</p>
          <div class="graph_txt"><p id="select_rate"></p>%<span id="select_cnt"></span></div>
          <div class="graph" id="selectCustChart"></div>
        </div>
      </li>
      <li>
        <div class="graph_wrap">
          <p class="graph_tit">응답고객</p>
          <div class="graph_txt"><p id="use_rate"></p>%<span id="use_cnt"></span></div>
          <div class="graph" id="useCustChart"></div>
        </div>
      </li>
    </ul>
    <p class="tit">누적이용 고객</p>
    <div class="graph2" id="accureCustChart">
    </div>
  </div>
  <div class="be_cnt2">
    <p>누적 매출액</p>
    <strong id="accure_sale_amt"></strong>
    <div class="graph_wrap">
      <p class="graph_tit">누적 매출액</p>
      <div class="graph" id="accureAmtChart">
      </div>
    </div>
  </div>
  <div class="be_cnt3">
    <p>총비용 <span>(VAT포함)</span></p>
    <strong id="tot_amt"></strong>
  </div>
</div>
