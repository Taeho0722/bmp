<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">


//TM Start =================================================================================================

//행사매출
var selectEvtAmtRstInfo = new oza_TMHandler('com.obzen.bmpanly.DocEvtSaleRate', 'selectEvtAmtRstInfo', '1', '\@#%');
selectEvtAmtRstInfo.setAddDataField('CAMP_ID', camp_id);

selectEvtAmtRstInfo.returnlist( 'MD_TOT_SALE_AMT'+
								';RSP_CUST_SALE_AMT'+
								';RSP_CUST_SALE_AMT_D_AVG'+
								';RSP_CUST_SALE_RATE'+
								';RSP_CUST_CNT'+
								';ENT_CUST_CNT'+
								';RSP_ENT_CUST_RATE'+
								';PMOT_RMK'+
								';PMOT_COST'+
								';PMOT_REG_CUST_CNT'+
								';PMOT_REG_CUST_RATE'+
								';SSG_ADD_SVC_CNT'+
								';SSG_ADD_SVC_COST'+
								';MSG_SEND_CNT'+
								';MSG_SEND_COST'+
								';MEMBER_BAR_CNT'+
								';MEMBER_BAR_COST'+
								';SYS_COST'+
								';TOP5_RSP_CUST_SALE_AMT'+
								';TOP5_RSP_CUST_SALE_AMT_D_AVG'+
								';TOP5_RSP_CUST_CNT'+
								';TOP5_ENT_CUST_CNT'+
								';TOP5_RSP_ENT_CUST_RATE');

//selectEvtAmtRstInfo.setlog = do_FrameTmQueryLog();
selectEvtAmtRstInfo.execute(null, false);

var md_tot_sale_amt = selectEvtAmtRstInfo.ElementValue('MD_TOT_SALE_AMT');//전체매출
var rsp_cust_sale_amt = selectEvtAmtRstInfo.ElementValue('RSP_CUST_SALE_AMT');//
var rsp_cust_sale_amt_d_avg = selectEvtAmtRstInfo.ElementValue('RSP_CUST_SALE_AMT_D_AVG');//
var rsp_cust_sale_rate = selectEvtAmtRstInfo.ElementValue('RSP_CUST_SALE_RATE');//
var rsp_cust_cnt = selectEvtAmtRstInfo.ElementValue('RSP_CUST_CNT');//
var ent_cust_cnt = selectEvtAmtRstInfo.ElementValue('ENT_CUST_CNT');//
var rsp_ent_cust_rate = selectEvtAmtRstInfo.ElementValue('RSP_ENT_CUST_RATE');//
var pmot_rmk = selectEvtAmtRstInfo.ElementValue('PMOT_RMK');//
var pmot_cost = selectEvtAmtRstInfo.ElementValue('PMOT_COST');//
var pmot_reg_cust_cnt = selectEvtAmtRstInfo.ElementValue('PMOT_REG_CUST_CNT');//
var pmot_reg_cust_rate = selectEvtAmtRstInfo.ElementValue('PMOT_REG_CUST_RATE');//
var ssg_add_svc_cnt = selectEvtAmtRstInfo.ElementValue('SSG_ADD_SVC_CNT');//
var ssg_add_svc_cost = selectEvtAmtRstInfo.ElementValue('SSG_ADD_SVC_COST');//
var msg_send_cnt = selectEvtAmtRstInfo.ElementValue('MSG_SEND_CNT');//
var msg_send_cost = selectEvtAmtRstInfo.ElementValue('MSG_SEND_COST');//
var member_bar_cnt = selectEvtAmtRstInfo.ElementValue('MEMBER_BAR_CNT');//
var member_bar_cost = selectEvtAmtRstInfo.ElementValue('MEMBER_BAR_COST');//
var system_cost = selectEvtAmtRstInfo.ElementValue('SYS_COST');//

var top5_rsp_cust_sale_amt = selectEvtAmtRstInfo.ElementValue('TOP5_RSP_CUST_SALE_AMT');//
var top5_rsp_cust_sale_amt_d_avg = selectEvtAmtRstInfo.ElementValue('TOP5_RSP_CUST_SALE_AMT_D_AVG');//
var top5_rsp_cust_cnt = selectEvtAmtRstInfo.ElementValue('TOP5_RSP_CUST_CNT');//
var top5_ent_cust_cnt = selectEvtAmtRstInfo.ElementValue('TOP5_ENT_CUST_CNT');//
var top5_rsp_ent_cust_rate = selectEvtAmtRstInfo.ElementValue('TOP5_RSP_ENT_CUST_RATE');//

selectEvtAmtRstInfo.clear();

//금액 유효성 체크 및 변환처리(객단가 : 만원, 매출 : 백만원 올림)

md_tot_sale_amt              = parseInt(isNullZero(md_tot_sale_amt));
rsp_cust_sale_amt            = parseInt(isNullZero(rsp_cust_sale_amt));
rsp_cust_sale_amt_d_avg      = parseInt(isNullZero(rsp_cust_sale_amt_d_avg));
top5_rsp_cust_sale_amt_d_avg = parseInt(isNullZero(top5_rsp_cust_sale_amt_d_avg));
top5_rsp_cust_sale_amt       = parseInt(isNullZero(top5_rsp_cust_sale_amt));
pmot_cost                    = parseInt(isNullZero(pmot_cost));
ssg_add_svc_cost 			 = parseInt(isNullZero(ssg_add_svc_cost));
msg_send_cost 				 = parseInt(isNullZero(msg_send_cost));
member_bar_cost 			 = parseInt(isNullZero(member_bar_cost));
system_cost     			 = parseInt(isNullZero(system_cost));

if(md_tot_sale_amt != 0)              md_tot_sale_amt = exCeil(md_tot_sale_amt/division_amt, 1);
if(rsp_cust_sale_amt != 0)            rsp_cust_sale_amt = exCeil(rsp_cust_sale_amt/division_amt, 1);
if(rsp_cust_sale_amt_d_avg != 0)      rsp_cust_sale_amt_d_avg = exCeil(rsp_cust_sale_amt_d_avg/division_amt, 1);
if(top5_rsp_cust_sale_amt_d_avg != 0) top5_rsp_cust_sale_amt_d_avg = exCeil(top5_rsp_cust_sale_amt_d_avg/division_amt, 1);
if(top5_rsp_cust_sale_amt != 0)       top5_rsp_cust_sale_amt = exCeil(top5_rsp_cust_sale_amt/division_amt, 1);
if(pmot_cost != 0)                    pmot_cost = exCeil(pmot_cost/division_amt, 1);
if(ssg_add_svc_cost != 0)             ssg_add_svc_cost = exCeil(ssg_add_svc_cost/division_amt, 1);
if(msg_send_cost != 0)                msg_send_cost = exCeil(msg_send_cost/division_amt, 1);
if(member_bar_cost != 0)              member_bar_cost = exCeil(member_bar_cost/division_amt, 1);
if(system_cost != 0)                  system_cost = exCeil(system_cost/division_amt, 1);

/*
alert("ssg_add_svc_cost" + ssg_add_svc_cost);
alert("msg_send_cost" + msg_send_cost);
alert("member_bar_cost" + member_bar_cost);
alert("system_cost" + system_cost);
*/

//건수 유효성 체크
rsp_cust_cnt      = parseInt(isNullZero(rsp_cust_cnt));
ent_cust_cnt      = parseInt(isNullZero(ent_cust_cnt));
pmot_reg_cust_cnt = parseInt(isNullZero(pmot_reg_cust_cnt));
ssg_add_svc_cnt   = parseInt(isNullZero(ssg_add_svc_cnt));
msg_send_cnt      = parseInt(isNullZero(msg_send_cnt));
member_bar_cnt 	  = parseInt(isNullZero(member_bar_cnt));
top5_rsp_cust_cnt = parseInt(isNullZero(top5_rsp_cust_cnt));
top5_ent_cust_cnt = parseInt(isNullZero(top5_ent_cust_cnt));


//비중(백분율 유효성 체크 및 변환처리(소수점 첫째자리 올림)
rsp_cust_sale_rate     = exCeil(parseFloat(isNullZero(rsp_cust_sale_rate)), 2); //
rsp_ent_cust_rate      = exCeil(parseFloat(isNullZero(rsp_ent_cust_rate)), 2); // 
pmot_reg_cust_rate     = exCeil(parseFloat(isNullZero(pmot_reg_cust_rate)), 2); //
top5_rsp_ent_cust_rate = exCeil(parseFloat(isNullZero(top5_rsp_ent_cust_rate)), 2); //

//날짜별 매출, 고객수 조회
var selectEvtAmtPerDate = new oza_TMHandler('com.obzen.bmpanly.ColEvtSaleRate', 'selectEvtAmtPerDate', '0', '\@#%');
selectEvtAmtPerDate.setAddDataField('CAMP_ID', camp_id);
selectEvtAmtPerDate.execute(null, false); //  tm 실행
var tmResult = selectEvtAmtPerDate.getResult(); //  컬렉션 TM 결과 호출
var tmResult_json = "";
if(tmResult != ""){tmResult_json = JSON.parse(tmResult);} //  자바스크립트 객체로 변환
selectEvtAmtPerDate.clear();

//TM End =================================================================================================


//화면 시작 시 실행
$(document).ready(function() {
	
	screenLog("조회", "web_chart_eventresult_sub01", "브랜드마케팅>분석>분석 Report>행사매출/응답률",get_client_ip);//화면 로그(공통)
	
	
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
	} else {
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
	
	$("#subTitle1").text("행사매출 (" + titleDate + ")");
	$("#subTitle2").text("일자별 행사매출 (" + titleDate + ")");
	
	drawEventSales();//행사매출
	drawEventResponseRate();//행사응답률
	drawPromotionSales();//프로모션 참여율 및 비용

});






/**========================================================================================
 * 행사 매출
 ========================================================================================*/
function drawEventSales(){
	

	$("#resCustomerRate").html("<span>&nbsp;</span>"+ rsp_cust_sale_rate +"<span>%</span>");
	$("#eventSaleTotAmt").html("<strong>"+AddComma(md_tot_sale_amt)+"</strong>백만");
	$("#resCustomerAmt").html("<strong>"+AddComma(rsp_cust_sale_amt)+"</strong>백만");
	
	//20191016 stj 수정
	//$("#eventSaleAmt").html("<p><strong>"+AddComma(exRound(eventSaleAmt/division_value,2))+"</strong>억원</p><span>(일평균 "+AddComma(exRound(eventSaleDayAmt/division_value,2))+"억원)</span>");
	//$("#resCustomer").html("<p><strong>"+AddComma(resCustomer)+"</strong>명</p><span>(일평균 "+AddComma(resDayCustomer)+"명)</span>");
	$("#eventSaleAmt").html("<p><strong>"+AddComma(rsp_cust_sale_amt)+"</strong>백만</p><span>일평균 <em>"+ AddComma(rsp_cust_sale_amt_d_avg)+"</em>백만</span>");
	$("#eventTop5SaleAmt").html("<p><strong>"+ AddComma(top5_rsp_cust_sale_amt) +"</strong>백만</p><span>일평균 <em>"+ AddComma(top5_rsp_cust_sale_amt_d_avg) +"</em>백만</span>");
	
	//Doughnut Chart Start==========================================================
	var eventSalesDoughnut = [{
  			region: "응답고객 매출",
  	    
  			val: rsp_cust_sale_amt
			}, {
  	    region: "전체매출",
  	    val: md_tot_sale_amt ? md_tot_sale_amt - rsp_cust_sale_amt : 1
  	    //    val: exFloor(100 - rsp_cust_sale_rate, 2)	
			}
	];
	
	
	$("#eventSalesDoughnut").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      palette: ["#2ed790", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: eventSalesDoughnut,  // 데이터소스 지정
	      tooltip: {
	            enabled: true,
	            customizeTooltip: function (arg) {
	            	if(md_tot_sale_amt + rsp_cust_sale_amt == 0) arg.valueText = 0;
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
	//Doughnut Chart End============================================================
		
	//Multi Bar-Line Chart Start====================================================
	for(var i=0; i<tmResult_json.length; i++){//  결과값 숫자형 변환
		tmResult_json[i].CAMP_DT = tmResult_json[i].CAMP_DT;
	    tmResult_json[i].DD_RSP_CUST_SALE_AMT = parseInt(tmResult_json[i].DD_RSP_CUST_SALE_AMT);
	    if(tmResult_json[i].DD_RSP_CUST_SALE_AMT != 0)     {tmResult_json[i].DD_RSP_CUST_SALE_AMT = exCeil(tmResult_json[i].DD_RSP_CUST_SALE_AMT/division_amt, 1);}
	    tmResult_json[i].DD_RSP_CUST_CNT = parseInt(tmResult_json[i].DD_RSP_CUST_CNT);
    }
	
	if(tmResult_json.length == 0){
		$("#eventSalesBarSpline").html("<p class='nodata'>일자별 행사매출 데이터가 없습니다.</p>");
		
	}else{
		$("#eventSalesBarSpline").dxChart({
			dataSource: tmResult_json,
			commonSeriesSettings: {
				barPadding: 0.5,//바 굵기
				argumentField: "CAMP_DT",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			 
			series: [
					{ axis: "amt",valueField: "DD_RSP_CUST_SALE_AMT", name: "amt", color: '#4092f8' },//->#4092f8
		    	   // { axis: "amt",valueField: "TOP5_DD_RSP_CUST_SALE_AMT", name: "Top5행사매출", color: '#4092f8' },
		    	{ 
  		    	axis: "customer"
  		    	, type: "line"
  					, valueField: "DD_RSP_CUST_CNT"
  					, name: "customer"
  					, color: '#2ed790'
  					/*, label : {visible: true,font:{color:"#609ae2c1",weight:690},backgroundColor:"none"}//weight(글자 진하기 정도)*/ // 20191017 stj 수정
  					, point: { border: {color: "#2ed790",width: 1,visible: true}//포인트 설정  ->#2ed790
          						, hoverStyle:{border: {color: "#2ed790",width: 1,visible: true}
          						, color: "#ffffff",size: 10}//포인트 호버 스타일 설정(마우스 오버시)	
  				           }
  				}
		   ],
			tooltip: {  // hover 속성
		          enabled: true,
		          customizeTooltip: function (arg) {
		        	        	var unit = "";
		        	        	if(this.seriesName == "amt"){
		        	        		unit = "백만";
		        	        	} else{
		        	        		unit = "명";
		        	        	}
		        	  	      return {text: AddComma(arg.valueText) + unit};
		          }
		      }, 
		   
			valueAxis: [
				{
					name: "amt",
					position: "left",//값 위치
					grid: {visible: true},
					showZero: true,//0부터 시작
					visualRange: {
					    startValue: 0
					    //endValue: 100
					},
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
				, {
					name: "customer",
					position: "right",
					showZero: true,//0부터 시작
					grid: {visible: true}
				}
			],
			//title: "Gross State Product within the Great Lakes Region",
			legend: {
	    	    visible: false
	    	  	//verticalAlignment: "bottom",
				//horizontalAlignment: "center",
				//itemTextPosition: 'right'
			},
			"export": {
				enabled: false
			},
			onPointClick: function (e) {
				e.target.select();
			}
	        
		});
		
	}
	
	//Multi Bar-Line Chart End======================================================	
}





/**========================================================================================
 * 행사 응답률 Doughnut Chart
 ========================================================================================*/
function drawEventResponseRate(){
	/*
	var resRate = 0;//행사 응답률
	var resTop5Rate = 0;//행사 응답률
	if(totCustomer != null && totCustomer != ""){
		resRate = ((parseInt(resCustomer)/parseInt(totCustomer))*100);	
		resRate = exCeil(resRate, 2);//20191016 stj 수정
	}
	*/
	
	$("#resRate").text(rsp_ent_cust_rate);
	$("#resCustomer").html("<strong>"+AddComma(rsp_cust_cnt)+"</strong> 명");
	$("#totCustomer").html("<strong>"+AddComma(ent_cust_cnt)+"</strong> 명");
	
	/*
	if(totTop5Customer != null && totTop5Customer != ""){
		resTop5Rate = ((parseInt(resTop5Customer)/parseInt(totTop5Customer))*100);	
		resTop5Rate = exCeil(resTop5Rate, 1);//20191016 stj 수정
	}
	*/
	
	$("#resTop5Rate").text(top5_rsp_ent_cust_rate);
	$("#resTop5Customer").html("<strong>"+AddComma(top5_rsp_cust_cnt)+"</strong> 명");
	$("#totTop5Customer").html("<strong>"+AddComma(top5_ent_cust_cnt)+"</strong> 명");
	
	
	var eventResponseRateDoughnut = [{
	    region: "응답고객",
	    //val: resCustomer
	    val: rsp_cust_cnt
	}, {
	    region: "전체접근고객(APP포함)",
	    val: ent_cust_cnt ? ent_cust_cnt-rsp_cust_cnt : 1
	    //val: exFloor(100 - resRate, 2)
	}];
	
	var eventResponseRateDoughnutTop5 = [{
	    region: "Top5평균응답고객",//20191016 stj 수정
	    //val: resTop5Customer
	    val: top5_rsp_cust_cnt
	}, {
	    region: "Top5평균접근고객",//20191016 stj 수정
	    val: top5_ent_cust_cnt ? top5_ent_cust_cnt-top5_rsp_cust_cnt : 1
	    //val: exCeil(100 - resTop5Rate, 1)
	}];
	
	//Doughnut Chart Start==========================================================
	$("#eventResponseRateDoughnut").dxPieChart({  // 해당 id 태그에서 차트 생성
		size: {width: 175,height: 175},
		innerRadius: 1, // 도넛의 가운데 빈 공간 크기
      type: "doughnut", // 타입 doughnut
      palette: ["#4590EB", "#E1E6ED"],  // 색상 두가지 지정
      dataSource: eventResponseRateDoughnut,  // 데이터소스 지정
      tooltip: {  // hover 속성
          enabled: true,
          customizeTooltip: function (arg) {
        	  if(ent_cust_cnt + rsp_cust_cnt == 0) arg.valueText = 0;
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
	//Doughnut Chart End============================================================
	
	
		
	//Doughnut Chart(Top5) Start====================================================
	$("#eventResponseRateDoughnutTop5").dxPieChart({  // 해당 id 태그에서 차트 생성
		size: {width: 175,height: 175},
	  innerRadius: 1, // 도넛의 가운데 빈 공간 크기
      type: "doughnut", // 타입 doughnut
      palette: ["#A1A1A1", "#E1E6ED"],  // 색상 두가지 지정
      dataSource: eventResponseRateDoughnutTop5,  // 데이터소스 지정
      tooltip: {  // hover 속성
          enabled: true,
          customizeTooltip: function (arg) {
        	  if(top5_ent_cust_cnt+top5_rsp_cust_cnt == 0) arg.valueText = 0;
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
	//Doughnut Chart(Top5) End======================================================	
}




/**========================================================================================
 * 프로모션 참여율 및 비용
 ========================================================================================*/
function drawPromotionSales(){

	/*
	if(partCustomer != null && partCustomer != "" && partCustomer != "0"){
		//promotionPartRate = ((parseInt(promotionResCustomer)/parseInt(partCustomer))*100);	
		promotionPartRate =  (parseInt(partCustomer)/parseInt(promotionResCustomer))*100;
		//promotionPartRate = ((parseInt(promotionResCustomer)/parseInt(partCustomer))*100);
		promotionPartRate = exCeil(promotionPartRate, 2);
	}
	*/
	
	$("#promotionRemark").text("프로모션내용 : "+pmot_rmk);
	$("#pmotRegRate").html(pmot_reg_cust_rate+"<span> %</span>");
	$("#pmotRegCustCnt").text(AddComma(pmot_reg_cust_cnt));
	$("#pmotRspCustCnt").text(AddComma(rsp_cust_cnt));
	$("#pmotCost").text(AddComma(pmot_cost));
	$("#addSvcCost").text(AddComma(ssg_add_svc_cost));
	$("#msgSndCost").text(AddComma(msg_send_cost));
	$("#mbrBarCost").text(AddComma(member_bar_cost));
	$("#systemCost").text(AddComma(system_cost));
	$("#msgSndCnt").text(AddComma(msg_send_cnt));
	$("#mbrBarCnt").text(AddComma(member_bar_cnt));
	$("#addSvcCnt").text(AddComma(ssg_add_svc_cnt));
  
	//Bar Chart Start==========================================================
	var promotionSalesBar = [{
			argument: "참여고객",
	    //value1: parseInt(partCustomer),
	    //value2: parseInt(promotionResCustomer) ? parseInt(promotionResCustomer)-parseInt(partCustomer) : 1
		value1: pmot_reg_cust_cnt,
		value2: rsp_cust_cnt ? rsp_cust_cnt - pmot_reg_cust_cnt : 1
	}];
	
	$("#pmot_chart_tooltip").attr("title", pmot_reg_cust_rate + "%");	
	
	$("#promotionSalesBar").dxChart({ // id = bar2_chart0 태그에서 차트 생성
	      animation:{ // 애니메이션 속성
	             duration: 2000 // 로딩 milliseconds 지정
	      },
	      size: {  width : 448, height : 91 },
	      margin: {
	          bottom: 1
	      },
	      dataSource: promotionSalesBar,  //  TM 결과의 자바스크립트 객체를 데이터소스로 지정
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
	          { valueField: "value2", name: "value2", color: "#E1E6ED"}
	      ],
	      legend: {
	          visible: false
	      },
	      tooltip: {
	          enabled: true,
	          customizeTooltip: function (arg) {
	        	 
	              return {
	                  text: AddComma(arg.valueText) + "명"
	              };
	          }
	      }
	  });	
	//Bar Chart End============================================================
	
}

//시스템함수



</script>

<div id="web_content">
  <!-- 상단 -->
	<div class="analysis_top"></div>
	<!-- 상단 -->

  <div class="web_box01 salse">
    <p class="sub_tit" id="subTitle1"></p>
    <div class="chart01">
      <ul>
        <li>
          <p>행사매출</p>
          <img src="../../img/web/icon/ic_money3.png"/>
          <div id="eventSaleAmt"></div>
        </li>   
        <li>
          <p>Top5 평균행사매출<span class='tip_img'title='해당 브랜드 장르내 행사실적기준 1~5위 선정(전월기준)'></span></p>
          <img src="../../img/web/icon/ic_money4.png"/>
          <div id="eventTop5SaleAmt" class="col2"></div>
        </li>       
      </ul>
    </div>
    <div class="chart02">
      <div class="graph_wrap">
        <p class="graph_tit">응답고객 매출비중</p>
        <div class="graph_txt">
          <strong id="resCustomerRate"></strong>
        </div>
        <div class="graph" id="eventSalesDoughnut"></div>
      </div>
      <ul>
        <li>
        <p>응답고객 매출</p>
          <p class="graph_count col_green" id="resCustomerAmt"></p>
        </li>
        <li>
          <p>행사기간 전체매출</p>
          <p class="graph_count" id="eventSaleTotAmt"></p>
        </li>
      </ul>
    </div>

  </div>
  <div class="web_box01 sales_chart03">
    <p class="sub_tit" id="subTitle2"></p>
    <ul class="graph_regend">
      <li class="regend01"><span></span>행사매출(백만)</li>
      <li class="regend02"><span></span>응답고객(명)</li>
    </ul>
    <p class="unit">[단위 : 백만, 명]</p>
    <div class="graph" id="eventSalesBarSpline"></div>
  </div>
  <div class="web_box01 reponse_rate">
    <p class="sub_tit">행사 응답률</p>
    <div class="chart01">
      <div class="graph_wrap">
        <div class="graph_txt"><p id="resRate"></p>%</div>
        <div class="graph" id="eventResponseRateDoughnut"></div>
        <ul class="graph_regend">
          <li class="regend02"><span></span>응답고객</li>
          <li class="regend01"><span></span>전체접근고객(APP포함)</li>
        </ul>
      </div>
      <ul>
        <li>
          응답고객
          <p id="resCustomer"></p>
        </li>
        <li>
          전체접근고객(APP포함)
          <p id="totCustomer"></p>
        </li>
      </ul>
    </div>
    <div class="chart02">
      <div class="graph_wrap">
        <div class="graph_txt"><p id="resTop5Rate"></p>%</div>
        <div class="graph" id="eventResponseRateDoughnutTop5"></div>
        <ul class="graph_regend">
          <li class="regend01"><span></span>Top5 평균응답고객</li>
          <li class="regend02"><span></span>Top5 평균접근고객</li>
        </ul>
      </div>
      <ul>
        <li>
          Top5 평균응답고객
          <p id="resTop5Customer"></p>
        </li>
        <li>
          Top5 평균접근고객
          <p id="totTop5Customer"></p>
        </li>
      </ul>
    </div>
  </div>
  <div class="web_box01 pr_cost">
    <p class="sub_tit">프로모션 참여율 및 비용</p>
     <div class="chart01">
      <p class="graph_tit" id="promotionRemark"></p>
      <ul class="prom_top">
        <li class=top1><em>참여고객<span class='tip_img' title='응답고객 중 실제 사은행사/할인쿠폰 사용 고객'></span></em> <p><strong id="pmotRegCustCnt"></strong>명</p></li>
        <li class="top2"><em>응답고객</em><p><strong id="pmotRspCustCnt"></strong>명</p></li>
      </ul>
      <div class="graph_wrap">
        <img src="../img/web/chart/human_chart.png" alt="사람모양 차트" title="" id="pmot_chart_tooltip">
        <div class="graph" id="promotionSalesBar"></div>
      </div>
      <ul class="prom_btm">
        <li class="btm1"><em>프로모션 참여율</em> <p><strong id="pmotRegRate"></strong></p></li>
        <li class="btm2"><em>프로모션비용</em> <p><strong id="pmotCost"></strong>백만</p></li>
      </ul>
     </div>
     <div class="chart03">
      <p class="tit">신세계 지원 서비스</p>
      <ul>
        <li class="list01">
          <p><span>세일리지<br>마일리지</span></p>
          <div class="cost_txt2"><strong id="addSvcCnt"></strong>명</div>
          <div class="cost_txt"><strong id="addSvcCost"></strong>백만</div>
        </li>
        <li class="list02">
          <p><span>문자발송비</span></p>
          <div class="cost_txt2"><strong id="msgSndCnt"></strong>건</div>
          <div class="cost_txt"><strong id="msgSndCost"></strong>백만</div>
        </li>
        <li class="list03">
          <p><span>멤버스바</span></p>
          <div class="cost_txt2"><strong id="mbrBarCnt"></strong>건</div>
          <div class="cost_txt"><strong id="mbrBarCost"></strong>백만</div>
        </li>
        <li class="list04">
          <p><span>플랫폼사용료<br>(DB사용료제외)</span></p>
          <div class="cost_txt2">-</div>
          <div class="cost_txt"><strong id="systemCost"></strong>백만</div>
        </li>
      </ul>
     </div>
  </div>
</div>
