<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
var division_value = 100000000;//억원
var division_value2 = 1000000;//백만원

  
//TM Start =================================================================================================
//행사실적 TOP5 조회
var evtRstTop5Tm = new oza_TMHandler('com.obzen.bmpanly.ColEvtRstComp', tm_sub_method1, '0', '\@#%');
evtRstTop5Tm.setAddDataField('STR_DT', str_ym);
evtRstTop5Tm.setAddDataField('END_DT', end_ym);
evtRstTop5Tm.setAddDataField(tm1_setCol, result_cd1);
evtRstTop5Tm.setAddDataField(tm2_setCol, result_cd2);
evtRstTop5Tm.execute(null, false);
var evtRstTop5TmResult = evtRstTop5Tm.getResult();
var evtRstTop5Tm_json = "";
if(evtRstTop5TmResult != ""){evtRstTop5Tm_json = JSON.parse(evtRstTop5TmResult);}
evtRstTop5Tm.clear(); 



//행사실적 조회(실적기준)
var base_nm = "";
var evt_md_cnt = "";
var tot_md_cnt = "";
var evt_ent_cust_cnt = "";
var evt_rsp_cust_cnt = "";
var evt_sale_amt = "";
var tot_sale_amt = "";
var base_top5_nm = "";

var evtResultTm = new oza_TMHandler('com.obzen.bmpanly.DocEvtRstComp', tm_sub_method2, '1', '\@#%');
evtResultTm.setAddDataField('STR_DT', str_ym);
evtResultTm.setAddDataField('END_DT', end_ym);
evtResultTm.setAddDataField('CAMP_STAT', camp_stat);
evtResultTm.setAddDataField(tm1_setCol, result_cd1);
evtResultTm.setAddDataField(tm2_setCol, result_cd2);
evtResultTm.setAddDataField(tm3_setCol, result_cd3);
evtResultTm.returnlist('BASE_NM'+//실적기준 조직 이름
											';BASE_TOP5_NM'+//실적기준 조직 이름 TOP용
    									';EVT_MD_CNT'+//행사MD수
    									';TOT_MD_CNT'+//전체MD수
    									';EVT_ENT_CUST_CNT'+//접근고객수
    									';EVT_RSP_CUST_CNT'+//응답고객수
    									';EVT_SALE_AMT'+//행사매출
    									';TOT_SALE_AMT');//전체매출
evtResultTm.execute(null, false);

base_nm = evtResultTm.ElementValue('BASE_NM');
base_top5_nm = evtResultTm.ElementValue('BASE_TOP5_NM');
evt_md_cnt = evtResultTm.ElementValue('EVT_MD_CNT');
tot_md_cnt = evtResultTm.ElementValue('TOT_MD_CNT');
evt_ent_cust_cnt = evtResultTm.ElementValue('EVT_ENT_CUST_CNT');
evt_rsp_cust_cnt = evtResultTm.ElementValue('EVT_RSP_CUST_CNT');
evt_sale_amt = evtResultTm.ElementValue('EVT_SALE_AMT');
tot_sale_amt = evtResultTm.ElementValue('TOT_SALE_AMT');
evtResultTm.clear();	



//행사실적 조회(비교기준)
var base_nm2 = "";
var evt_md_cnt2 = "";
var tot_md_cnt2 = "";
var evt_ent_cust_cnt2 = "";
var evt_rsp_cust_cnt2 = "";
var evt_sale_amt2 = "";
var tot_sale_amt2 = "";

var evtResultTm2 = new oza_TMHandler('com.obzen.bmpanly.DocEvtRstComp', tm_sub_method2, '1', '\@#%');
evtResultTm2.setAddDataField('STR_DT', str_ym);
evtResultTm2.setAddDataField('END_DT', end_ym);
evtResultTm2.setAddDataField('CAMP_STAT', camp_stat);
evtResultTm2.setAddDataField(tm1_setCol, compare_cd1);
evtResultTm2.setAddDataField(tm2_setCol, compare_cd2);
evtResultTm2.setAddDataField(tm3_setCol, compare_cd3);
evtResultTm2.returnlist('BASE_NM'+//실적기준 조직 이름
											';BASE_TOP5_NM'+//실적기준 조직 이름 TOP용
    									';EVT_MD_CNT'+//행사MD수
    									';TOT_MD_CNT'+//전체MD수
    									';EVT_ENT_CUST_CNT'+//접근고객수
    									';EVT_RSP_CUST_CNT'+//응답고객수
    									';EVT_SALE_AMT'+//행사매출
    									';TOT_SALE_AMT');//전체매출
evtResultTm2.execute(null, false);

base_nm2 = evtResultTm2.ElementValue('BASE_NM');
evt_md_cnt2 = evtResultTm2.ElementValue('EVT_MD_CNT');
tot_md_cnt2 = evtResultTm2.ElementValue('TOT_MD_CNT');
evt_ent_cust_cnt2 = evtResultTm2.ElementValue('EVT_ENT_CUST_CNT');
evt_rsp_cust_cnt2 = evtResultTm2.ElementValue('EVT_RSP_CUST_CNT');
evt_sale_amt2 = evtResultTm2.ElementValue('EVT_SALE_AMT');
tot_sale_amt2 = evtResultTm2.ElementValue('TOT_SALE_AMT');
evtResultTm2.clear();

//TM End ===================================================================================================	


	
	
//화면 로드 시 실행
$(document).ready(function() {
  screenLog("조회", "web_chart_manage_info_sub", "운영현황>FIT행사실적비교",get_client_ip);//화면 로그(공통)
  
  castValue();
  mdChart();
  top5BoardList();
  mdCntChart();
  mdSalesChart();
});


/**========================================================================================
* 형변환 및 Null 처리 
========================================================================================*/
function castValue(){
	if(base_nm == ""){base_nm = "&nbsp;";}
	if(base_nm2 == ""){base_nm2 = "&nbsp;";}
	evt_md_cnt = parseInt(isNullZero(evt_md_cnt));//행사MD수
	tot_md_cnt = parseInt(isNullZero(tot_md_cnt));//전체MD수
	evt_ent_cust_cnt = parseInt(isNullZero(evt_ent_cust_cnt));//접근고객수
	evt_rsp_cust_cnt = parseInt(isNullZero(evt_rsp_cust_cnt));//응답고객수
	evt_sale_amt = parseInt(isNullZero(evt_sale_amt));//행사매출
	tot_sale_amt = parseInt(isNullZero(tot_sale_amt));//전체매출
	evt_md_cnt2 = parseInt(isNullZero(evt_md_cnt2));
	tot_md_cnt2 = parseInt(isNullZero(tot_md_cnt2));
	evt_ent_cust_cnt2 = parseInt(isNullZero(evt_ent_cust_cnt2));
	evt_rsp_cust_cnt2 = parseInt(isNullZero(evt_rsp_cust_cnt2));
	evt_sale_amt2 = parseInt(isNullZero(evt_sale_amt2));
	tot_sale_amt2 = parseInt(isNullZero(tot_sale_amt2));
}



/**========================================================================================
* 행사참여 MD 
========================================================================================*/
var md_rate = "";
var md_rate2 = "";

function mdChart(){
	
	if(tot_md_cnt > 0){md_rate = exRound((evt_md_cnt/tot_md_cnt)*100,2);}else{md_rate = 0;	}
	if(tot_md_cnt2 > 0){md_rate2 = exRound((evt_md_cnt2/tot_md_cnt2)*100,2);}else{md_rate2 = 0;	}
	
	$("#base_nm").html(base_nm);
	$("#md_rate").text(md_rate);
	$("#evt_md_cnt").html(AddComma(evt_md_cnt));
	$("#tot_md_cnt").html(AddComma(tot_md_cnt)+"MD");
	
	$("#base_nm2").html(base_nm2);
	$("#md_rate2").text(md_rate2);
	$("#evt_md_cnt2").html(AddComma(evt_md_cnt2));
	$("#tot_md_cnt2").html(AddComma(tot_md_cnt2)+"MD");
	
	//Doughnut Chart Start==========================================================
	var data = [{
  			region: "행사",
  	    val: evt_md_cnt
  		}, {
  	    region: "전체",
  	    val: tot_md_cnt ? tot_md_cnt-evt_md_cnt : 1
  	  }
	];
	
	
	$("#evtMdChart").dxPieChart({
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#4092f8", "#E1E6ED"],  // 색상 두가지 지정
	      startAngle : 180,//차트 시작 0 도 기준
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
		
		
	//Doughnut Chart Start==========================================================
	var data2 = [{
		region: "행사",
  	    val: evt_md_cnt2
  		}, {
  	    region: "전체",
  	    val: tot_md_cnt2 ? tot_md_cnt2-evt_md_cnt2 : 1
  	  }
	];
	
	
	$("#totMdChart").dxPieChart({
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#a1a1a1", "#e4e4e4"],  // 색상 두가지 지정
	      startAngle : 180,//차트 시작 0 도 기준
	      dataSource: data2,  // 데이터소스 지정
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
* PC행사 빌보드 
========================================================================================*/
function top5BoardList(){
	
	$("#board_base_nm").html(base_top5_nm);
	$("#sel_rank1").css("cursor","pointer");
	$("#sel_rank2").css("cursor","pointer");
	$("#sel_rank3").css("cursor","pointer");
	$("#sel_rank1").addClass("on");
	
	
	var innerHtml1 = "";
	var innerHtml2 = "";
	var innerHtml3 = "";
	
	
	var innerHtml1_1 = "";
	var innerHtml1_2 = "";
	var innerHtml1_3 = "";
	var innerHtml1_4 = "";
	var innerHtml1_5 = "";
	
	var innerHtml2_1 = "";
	var innerHtml2_2 = "";
	var innerHtml2_3 = "";
	var innerHtml2_4 = "";
	var innerHtml2_5 = "";
	
	var innerHtml3_1 = "";
	var innerHtml3_2 = "";
	var innerHtml3_3 = "";
	var innerHtml3_4 = "";
	var innerHtml3_5 = "";
	
	
	
	var pc_nm = "";
	var evt_int_rank = "";//참여율 순위
	var evt_inv_rate = "";//참여율
	var evt_rsp_rank = "";//응답률 순위
	var camp_rsp_rate = "";//응답률
	var evt_amt_rank = "";//행사매출비중 순위
	var evt_amt_rate = "";//행사매출비중
	
	
	for(var i=0; i<evtRstTop5Tm_json.length; i++) {
		pc_nm = evtRstTop5Tm_json[i].PC_NM;
		//if (pc_nm.length >= 7) {pc_nm = pc_nm.substring(0, 6) + "..";}
		evt_int_rank = evtRstTop5Tm_json[i].EVT_INT_RANK;
    evt_inv_rate = evtRstTop5Tm_json[i].EVT_INV_RATE;
    evt_rsp_rank = evtRstTop5Tm_json[i].EVT_RSP_RANK;
    camp_rsp_rate = evtRstTop5Tm_json[i].CAMP_RSP_RATE;
    evt_amt_rank = evtRstTop5Tm_json[i].EVT_AMT_RANK;
    evt_amt_rate = evtRstTop5Tm_json[i].EVT_AMT_RATE;
		
		
		//참여율 
		if(evt_int_rank != ""){
			if("1" == evt_int_rank){
				innerHtml1_1 += "<li class='top clear'>";
				innerHtml1_1 += "<p class='rank'><img src='../../img/web/icon/ic_medal1_b.png' alt='1'></p>";
				innerHtml1_1 += "<p class='pc_nm'>"+pc_nm+"</p>";
			  innerHtml1_1 += "<p class='top1 ta_r'><span>"+evt_inv_rate+"</span>%</p>";
			  innerHtml1_1 += "</li>";
			}else if("2" == evt_int_rank){
	    	innerHtml1_2 += "<li class='top clear'>";
	    	innerHtml1_2 += "<p class='rank'><img src='../../img/web/icon/ic_medal2_b.png' alt='2'></p>";
	    	innerHtml1_2 += "<p class='pc_nm'>"+pc_nm+"</p>";
	      innerHtml1_2 += "<p class='top2 ta_r'><span>"+evt_inv_rate+"</span>%</p>";
	      innerHtml1_2 += "</li>";
	    }else if("3" == evt_int_rank){
	    	innerHtml1_3 += "<li class='top clear'>";
	    	innerHtml1_3 += "<p class='rank'><img src='../../img/web/icon/ic_medal3_b.png' alt='3'></p>";
	    	innerHtml1_3 += "<p class='pc_nm'>"+pc_nm+"</p>";
	      innerHtml1_3 += "<p class='top3 ta_r'><span>"+evt_inv_rate+"</span>%</p>";
	      innerHtml1_3 += "</li>";
	    }else if("4" == evt_int_rank){
	    	innerHtml1_4 += "<li class='clear'>";
	  	  innerHtml1_4 += "<p class='rank'>4</p>";
	  	  innerHtml1_4 += "<p class='pc_nm'>"+pc_nm+"</p>";
	  	  innerHtml1_4 += "<p class='ta_r'><span>"+evt_inv_rate+"</span>%</p>";
	  	  innerHtml1_4 += "</li>";
	    }else if("5" == evt_int_rank){
	    	innerHtml1_5 += "<li class='clear'>";
	  	  innerHtml1_5 += "<p class='rank'>5</p>";
	  	  innerHtml1_5 += "<p class='pc_nm'>"+pc_nm+"</p>";
	  	  innerHtml1_5 += "<p class='ta_r'><span>"+evt_inv_rate+"</span>%</p>";
	  	  innerHtml1_5 += "</li>";
	    }
		}
		
		//응답율 
		if(evt_rsp_rank != ""){
			if("1" == evt_rsp_rank){
				innerHtml2_1 += "<li class='top clear'>";
				innerHtml2_1 += "<p class='rank'><img src='../../img/web/icon/ic_medal1_b.png' alt='1'></p>";
				innerHtml2_1 += "<p class='pc_nm'>"+pc_nm+"</p>";
			  innerHtml2_1 += "<p class='top1 ta_r'><span>"+camp_rsp_rate+"</span>%</p>";
			  innerHtml2_1 += "</li>";
			}else if("2" == evt_rsp_rank){
	    	innerHtml2_2 += "<li class='top clear'>";
	    	innerHtml2_2 += "<p class='rank'><img src='../../img/web/icon/ic_medal2_b.png' alt='2'></p>";
	    	innerHtml2_2 += "<p class='pc_nm'>"+pc_nm+"</p>";
	      innerHtml2_2 += "<p class='top2 ta_r'><span>"+camp_rsp_rate+"</span>%</p>";
	      innerHtml2_2 += "</li>";
	    }else if("3" == evt_rsp_rank){
	    	innerHtml2_3 += "<li class='top clear'>";
	    	innerHtml2_3 += "<p class='rank'><img src='../../img/web/icon/ic_medal3_b.png' alt='3'></p>";
	    	innerHtml2_3 += "<p class='pc_nm'>"+pc_nm+"</p>";
	      innerHtml2_3 += "<p class='top3 ta_r'><span>"+camp_rsp_rate+"</span>%</p>";
	      innerHtml2_3 += "</li>";
	    }else if("4" == evt_rsp_rank){
	    	innerHtml2_4 += "<li class='clear'>";
	  	  innerHtml2_4 += "<p class='rank'>4</p>";
	  	  innerHtml2_4 += "<p class='pc_nm'>"+pc_nm+"</p>";
	  	  innerHtml2_4 += "<p class='ta_r'><span>"+camp_rsp_rate+"</span>%</p>";
	  	  innerHtml2_4 += "</li>";
	    }else if("5" == evt_rsp_rank){
	    	innerHtml2_5 += "<li class='clear'>";
	  	  innerHtml2_5 += "<p class='rank'>5</p>";
	  	  innerHtml2_5 += "<p class='pc_nm'>"+pc_nm+"</p>";
	  	  innerHtml2_5 += "<p class='ta_r'><span>"+camp_rsp_rate+"</span>%</p>";
	  	  innerHtml2_5 += "</li>";
	    }
		}
		
		
		
		//매출비중 
		if(evt_amt_rank != ""){
			if("1" == evt_amt_rank){
				innerHtml3_1 += "<li class='top clear'>";
				innerHtml3_1 += "<p class='rank'><img src='../../img/web/icon/ic_medal1_b.png' alt='1'></p>";
				innerHtml3_1 += "<p class='pc_nm'>"+pc_nm+"</p>";
			  innerHtml3_1 += "<p class='top1 ta_r'><span>"+evt_amt_rate+"</span>%</p>";
			  innerHtml3_1 += "</li>";
			}else if("2" == evt_amt_rank){
	    	innerHtml3_2 += "<li class='top clear'>";
	    	innerHtml3_2 += "<p class='rank'><img src='../../img/web/icon/ic_medal2_b.png' alt='2'></p>";
	    	innerHtml3_2 += "<p class='pc_nm'>"+pc_nm+"</p>";
	      innerHtml3_2 += "<p class='top2 ta_r'><span>"+evt_amt_rate+"</span>%</p>";
	      innerHtml3_2 += "</li>";
	    }else if("3" == evt_amt_rank){
	    	innerHtml3_3 += "<li class='top clear'>";
	    	innerHtml3_3 += "<p class='rank'><img src='../../img/web/icon/ic_medal3_b.png' alt='3'></p>";
	    	innerHtml3_3 += "<p class='pc_nm'>"+pc_nm+"</p>";
	      innerHtml3_3 += "<p class='top3 ta_r'><span>"+evt_amt_rate+"</span>%</p>";
	      innerHtml3_3 += "</li>";
	    }else if("4" == evt_amt_rank){
	    	innerHtml3_4 += "<li class='clear'>";
	  	  innerHtml3_4 += "<p class='rank'>4</p>";
	  	  innerHtml3_4 += "<p class='pc_nm'>"+pc_nm+"</p>";
	  	  innerHtml3_4 += "<p class='ta_r'><span>"+evt_amt_rate+"</span>%</p>";
	  	  innerHtml3_4 += "</li>";
	    }else if("5" == evt_amt_rank){
	    	innerHtml3_5 += "<li class='clear'>";
	  	  innerHtml3_5 += "<p class='rank'>5</p>";
	  	  innerHtml3_5 += "<p class='pc_nm'>"+pc_nm+"</p>";
	  	  innerHtml3_5 += "<p class='ta_r'><span>"+evt_amt_rate+"</span>%</p>";
	  	  innerHtml3_5 += "</li>";
	    }
		}
	}	
		
	 

	if(evtRstTop5Tm_json.length == 0){
		innerHtml1 += "<li class='top clear'>";
		innerHtml1 += "<p class='rank'><img src='../../img/web/icon/ic_medal1_b.png' alt='1'></p>";
		innerHtml1 += "<p class='pc_nm'></p>";
		innerHtml1 += "<p class='top1 ta_r'><span></span></p>";
		innerHtml1 += "</li>";
		innerHtml1 += "<li class='top clear'>";
		innerHtml1 += "<p class='rank'><img src='../../img/web/icon/ic_medal2_b.png' alt='2'></p>";
		innerHtml1 += "<p class='pc_nm'></p>";
		innerHtml1 += "<p class='top2 ta_r'><span></span></p>";
		innerHtml1 += "</li>";
		innerHtml1 += "<li class='top clear'>";
		innerHtml1 += "<p class='rank'><img src='../../img/web/icon/ic_medal3_b.png' alt='3'></p>";
		innerHtml1 += "<p class='pc_nm'></p>";
		innerHtml1 += "<p class='top3 ta_r'><span></span></p>";
		innerHtml1 += "</li>";
		innerHtml1 += "<li class='clear'>";
		innerHtml1 += "<p class='rank'>4</p>";
		innerHtml1 += "<p class='pc_nm'></p>";
		innerHtml1 += "<p class='ta_r'><span></span></p>";
		innerHtml1 += "</li>";
		innerHtml1 += "<li class='clear'>";
		innerHtml1 += "<p class='rank'>5</p>";
		innerHtml1 += "<p class='pc_nm'></p>";
		innerHtml1 += "<p class='ta_r'><span></span></p>";
		innerHtml1 += "</li>";
		
		innerHtml2 += "<li class='top clear'>";
		innerHtml2 += "<p class='rank'><img src='../../img/web/icon/ic_medal1_b.png' alt='1'></p>";
		innerHtml2 += "<p class='pc_nm'></p>";
		innerHtml2 += "<p class='top1 ta_r'><span></span></p>";
		innerHtml2 += "</li>";
		innerHtml2 += "<li class='top clear'>";
		innerHtml2 += "<p class='rank'><img src='../../img/web/icon/ic_medal2_b.png' alt='2'></p>";
		innerHtml2 += "<p class='pc_nm'></p>";
		innerHtml2 += "<p class='top2 ta_r'><span></span></p>";
		innerHtml2 += "</li>";
		innerHtml2 += "<li class='top clear'>";
		innerHtml2 += "<p class='rank'><img src='../../img/web/icon/ic_medal3_b.png' alt='3'></p>";
		innerHtml2 += "<p class='pc_nm'></p>";
		innerHtml2 += "<p class='top3 ta_r'><span></span></p>";
		innerHtml2 += "</li>";
		innerHtml2 += "<li class='clear'>";
		innerHtml2 += "<p class='rank'>4</p>";
		innerHtml2 += "<p class='pc_nm'></p>";
		innerHtml2 += "<p class='ta_r'><span></span></p>";
		innerHtml2 += "</li>";
		innerHtml2 += "<li class='clear'>";
		innerHtml2 += "<p class='rank'>5</p>";
		innerHtml2 += "<p class='pc_nm'></p>";
		innerHtml2 += "<p class='ta_r'><span></span></p>";
		innerHtml2 += "</li>";
		
		innerHtml3 += "<li class='top clear'>";
		innerHtml3 += "<p class='rank'><img src='../../img/web/icon/ic_medal1_b.png' alt='1'></p>";
		innerHtml3 += "<p class='pc_nm'></p>";
		innerHtml3 += "<p class='top1 ta_r'><span></span></p>";
		innerHtml3 += "</li>";
		innerHtml3 += "<li class='top clear'>";
		innerHtml3 += "<p class='rank'><img src='../../img/web/icon/ic_medal2_b.png' alt='2'></p>";
		innerHtml3 += "<p class='pc_nm'></p>";
		innerHtml3 += "<p class='top2 ta_r'><span></span></p>";
		innerHtml3 += "</li>";
		innerHtml3 += "<li class='top clear'>";
		innerHtml3 += "<p class='rank'><img src='../../img/web/icon/ic_medal3_b.png' alt='3'></p>";
		innerHtml3 += "<p class='pc_nm'></p>";
		innerHtml3 += "<p class='top3 ta_r'><span></span></p>";
		innerHtml3 += "</li>";
		innerHtml3 += "<li class='clear'>";
		innerHtml3 += "<p class='rank'>4</p>";
		innerHtml3 += "<p class='pc_nm'></p>";
		innerHtml3 += "<p class='ta_r'><span></span></p>";
		innerHtml3 += "</li>";
		innerHtml3 += "<li class='clear'>";
		innerHtml3 += "<p class='rank'>5</p>";
		innerHtml3 += "<p class='pc_nm'></p>";
		innerHtml3 += "<p class='ta_r'><span></span></p>";
		innerHtml3 += "</li>";
	}else{
		innerHtml1 = innerHtml1_1+innerHtml1_2+innerHtml1_3+innerHtml1_4+innerHtml1_5;
		innerHtml2 = innerHtml2_1+innerHtml2_2+innerHtml2_3+innerHtml2_4+innerHtml2_5;
		innerHtml3 = innerHtml3_1+innerHtml3_2+innerHtml3_3+innerHtml3_4+innerHtml3_5;
	}
	
	
  
  $("#rank_list").html(innerHtml1);

	//참여율
  $("#sel_rank1").click(function() {
	  if(!$(this).hasClass("on")){
		  $(this).addClass("on");
		  $("#sel_rank2").removeClass("on");
		  $("#sel_rank3").removeClass("on");
		  $("#rank_list").html(innerHtml1);
	  }
	});
	
	//응답율
  $("#sel_rank2").click(function() {
	  if(!$(this).hasClass("on")){
		  $(this).addClass("on");
		  $("#sel_rank1").removeClass("on");
		  $("#sel_rank3").removeClass("on");
		  $("#rank_list").html(innerHtml2);
	  }
	});

	//행사매출 비중
  $("#sel_rank3").click(function() {
	  if(!$(this).hasClass("on")){
		  $(this).addClass("on");
		  $("#sel_rank1").removeClass("on");
		  $("#sel_rank2").removeClass("on");
		  $("#rank_list").html(innerHtml3);
	  }
	});
	
}



/**========================================================================================
* 행사참여 MD 응답고객수
========================================================================================*/
var res_md_rate = "";
var res_md_rate2 = "";

function mdCntChart(){
	if(evt_ent_cust_cnt > 0){res_md_rate = exRound((evt_rsp_cust_cnt/evt_ent_cust_cnt)*100,2);}else{res_md_rate = 0;	}
	if(evt_ent_cust_cnt2 > 0){res_md_rate2 = exRound((evt_rsp_cust_cnt2/evt_ent_cust_cnt2)*100,2);}else{res_md_rate2 = 0;	}
	
	$("#res_base_nm").html(base_nm);
	$("#res_md_rate").text(res_md_rate);
	$("#evt_rsp_cust_cnt").html(AddComma(evt_rsp_cust_cnt)+"<span>명</span>");
	$("#evt_ent_cust_cnt").text(AddComma(evt_ent_cust_cnt)+"명");
	
	$("#res_base_nm2").html(base_nm2);
	$("#res_md_rate2").text(res_md_rate2);
	$("#evt_rsp_cust_cnt2").html(AddComma(evt_rsp_cust_cnt2)+"<span>명</span>");
	$("#evt_ent_cust_cnt2").text(AddComma(evt_ent_cust_cnt2)+"명");
	
	$("#resMdRateChart").css("width",res_md_rate+"%");
	$("#resMdRateChart2").css("width",res_md_rate2+"%");
}



/**========================================================================================
* 행사참여 MD 매출
========================================================================================*/
var sales_md_rate = "";
var sales_md_rate2 = "";


function mdSalesChart(){
	
	if(tot_sale_amt > 0){sales_md_rate = exRound((evt_sale_amt/tot_sale_amt)*100,2);}else{sales_md_rate = 0;	}
	if(tot_sale_amt2 > 0){sales_md_rate2 = exRound((evt_sale_amt2/tot_sale_amt2)*100,2);}else{sales_md_rate2 = 0;	}
	
	/*
	evt_sale_amt = exRound(evt_sale_amt/division_value2,2);
	tot_sale_amt = exRound(tot_sale_amt/division_value2,2);
	evt_sale_amt2 = exRound(evt_sale_amt2/division_value2,2);
	tot_sale_amt2 = exRound(tot_sale_amt2/division_value2,2);
	*/
	
	evt_sale_amt = parseInt(evt_sale_amt/division_value2);
	tot_sale_amt = parseInt(tot_sale_amt/division_value2);
	evt_sale_amt2 = parseInt(evt_sale_amt2/division_value2);
	tot_sale_amt2 = parseInt(tot_sale_amt2/division_value2);
	
	
	$("#sales_md_nm").html(base_nm);
	$("#sales_md_rate").text(sales_md_rate);
	$("#evt_sale_amt").text(AddComma(evt_sale_amt));
	$("#tot_sale_amt").text(AddComma(tot_sale_amt));
	
	$("#sales_md_nm2").html(base_nm2);
	$("#sales_md_rate2").text(sales_md_rate2);
	$("#evt_sale_amt2").text(AddComma(evt_sale_amt2));
	$("#tot_sale_amt2").text(AddComma(tot_sale_amt2));
	
	
	//Bar Chart Start==========================================================
	var data = [{
			argument: "PC매출비중",
	    value1: sales_md_rate,
			//value2: sales_md_rate ? exFloor(100 - sales_md_rate, 2) : 1
			value2: sales_md_rate < 10 ? 10 - sales_md_rate : 0 
	}];
	
	
	$("#mdSalesRateChart").dxChart({
	      animation:{ // 애니메이션 속성
	      	duration: 2000 // 로딩 milliseconds 지정
	      },
	      
	      size: {height : 101 },
	      
	      dataSource: data,
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
	    	  	{ valueField: "value1", name: "value1", color: "#2ed790" }, // valueField 지정
	          { valueField: "value2", name: "value2", color: "#E1E6ED"}
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
	  //Bar Chart End============================================================
		  
		  
		//Bar Chart Start==========================================================
  	var data2 = [{
  			argument: "점포매출비중",
  	    value1: sales_md_rate2,
  			//value2: sales_md_rate2? exFloor(100 - sales_md_rate2, 2) : 1
  			value2: sales_md_rate2 < 10 ? 10 - sales_md_rate2 : 0 
  	}];
  	
  	
  	$("#mdSalesRateChart2").dxChart({
  	      animation:{ // 애니메이션 속성
  	      	duration: 2000 // 로딩 milliseconds 지정
  	      },
  	      size: {height : 101 },
  	      dataSource: data2,
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
  	        { valueField: "value1", name: "value1", color: "#a1a1a1" }, // valueField 지정
	          { valueField: "value2", name: "value2", color: "#e4e4e4"}
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
  	  //Bar Chart End============================================================
	
}

</script>
<div class="event_md_wrap">
   <div class="event_md1 clear">
    <div class="f_l md_cnt1">
      <div class="md_part">
        <p class="tit">FIT 행사진행 MD</p>
        <ul>
          <li>
          <p id="base_nm"></p>
          <div class="graph_wrap">
            <div class="graph" id="evtMdChart"></div>
            <p class="graph_txt type1"><span id="md_rate"></span>%</p>
          </div>
          <ul>
            <li>
            <span>행사MD</span>
            <p class="type1"><strong id="evt_md_cnt"></strong>MD</p>
            </li>
            <li>
            <span>전체MD</span>
            <p id="tot_md_cnt"></p>
            </li>
          </ul>
          </li>
          <li>
          <p><span id="base_nm2" class="store_nm"></span></p>
          <div class="graph_wrap">
            <div class="graph" id="totMdChart"></div>
            <p class="graph_txt type2"><span id="md_rate2"></span>%</p>
          </div>
          <ul>
            <li>
            <span>행사MD</span>
            <p class="type2"><strong id="evt_md_cnt2"></strong>MD</p>
            </li>
            <li>
            <span>전체MD</span>
            <p id="tot_md_cnt2"></p>                       
            </li>
          </ul>
          </li>
        </ul>
      </div>
      <div class="md_reply">
        <p class="tit">FIT 행사 MD 응답률</p>
        <div class="graph_wrap1">
          <p class="graph_tit" id="res_base_nm"></p>
          <div class="graph">
            <div class="graph_bar">
              <p id="resMdRateChart"></p>
              <span><strong id="res_md_rate"></strong>%</span>
            </div>
          </div>
          <ul>
            <li>
              <p>응답고객</p>
              <strong class="fc_em" id="evt_rsp_cust_cnt"></strong>
            </li>
            <li class="ta_r">
              <p>전체접근고객</p>
              <strong id="evt_ent_cust_cnt"></strong>
            </li>
          </ul>
        </div>
        <div class="graph_wrap2">
          <p class="graph_tit"><span id="res_base_nm2" class="store_nm"></span></p>
          <div class="graph">
            <div class="graph_bar">
              <p id="resMdRateChart2"></p>
              <span><strong id="res_md_rate2"></strong>%</span>
            </div>
          </div>
          <ul>
            <li>
              <p>응답고객</p>
              <strong class="fc_em" id="evt_rsp_cust_cnt2"></strong>
            </li>
            <li class="ta_r">
              <p>전체접근고객</p>
              <strong id="evt_ent_cust_cnt2"></strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="f_l md_cnt2">
      <p class="tit"><strong id="board_base_nm"></strong> Top5</p>
      <ul class="md_tab">
        <li id="sel_rank1"><p>참여율</p></li>
        <li id="sel_rank2"><p>응답율</p></li>
        <li id="sel_rank3"><p>매출비중</p></li>
      </ul>
      <div class="tab_cnt">
        <ul class="rank_list even" id="rank_list">
        </ul>
      </div>
    </div>
   </div>
   <div class="event_md2">
    <p class="tit">FIT 행사 MD 매출</p>
    <ul>
      <li>
      <p id="sales_md_nm"></p>
      <div class="graph_wrap">
        <p class="graph_txt type1"><em>행사매출비중</em><span><strong id="sales_md_rate"></strong>%</span></p>
        <div class="graph_img">
          <img src="../../img/web/chart/money_chart.png" alt="">
          <div class="graph" id="mdSalesRateChart"></div>
        </div>
      </div>
      <ul>
        <li>
        <span>행사매출</span>
        <p class="type1"><strong id="evt_sale_amt"></strong>백만</p>
        </li>
        <li>
        <span>전체매출</span>
        <p><strong id="tot_sale_amt"></strong>백만</p>
        </li>
      </ul>
      </li>
      <li>
      <p><span id="sales_md_nm2" class="store_nm"></span></p>
      <div class="graph_wrap">
        <p class="graph_txt type2"><em>행사매출비중</em><span><strong id="sales_md_rate2"></strong>%</span></p>
        <div class="graph_img">
          <img src="../../img/web/chart/money_chart.png" alt="">
          <div class="graph" id="mdSalesRateChart2"></div>
        </div>
      </div>
      <ul>
        <li>
        <span>행사매출</span>
        <p class="type2"><strong id="evt_sale_amt2"></strong>백만</p>
        </li>
        <li>
        <span>전체매출</span>
        <p><strong id="tot_sale_amt2"></strong>백만</p>
        </li>
      </ul>
      </li>
    </ul>
   </div>
</div>