<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">




//TM Start =================================================================================================

//상단 출력내용
/*
var grow_rt_cont = "";
var date_cnt = 0;
var ms_cont = "";
var vip_sale_rate_cont = "";
var new_cust_sale_rate_cont = "";
*/
//최근 3개월 매출 및 신장률
var sale_amt = "0";//매출
var avg_sale_amt = "0";//일평균 매출
	
//PC M/s
var team_pc_rate = "0";//소속PC매출M/S
var my_pc_rate = "0";//내PC매출M/S


//최근 3개월 매출, 신장율, M/S 추세-------------------------
var bf3MSaleTrandTm = new oza_TMHandler('com.obzen.bmpanly.ColGraspMyBrand', 'selectBf3SaleTrand', '0', '\@#%');
bf3MSaleTrandTm.setAddDataField('BASE_YEAR', sel_year);
bf3MSaleTrandTm.setAddDataField('BASE_MON', sel_month);
bf3MSaleTrandTm.setAddDataField('STORE_CD', store_cd);
bf3MSaleTrandTm.setAddDataField('MD_CD', md_cd);
bf3MSaleTrandTm.execute(null, false);
var bf3MSaleTrandTmResult = bf3MSaleTrandTm.getResult();
var bf3MSaleTrandTmResult_json = "";
if(bf3MSaleTrandTmResult != ""){
	bf3MSaleTrandTmResult_json = JSON.parse(bf3MSaleTrandTmResult);
	
}
bf3MSaleTrandTm.clear();


//요일별 매출 현황-------------------------
var weekAmtTm = new oza_TMHandler('com.obzen.bmpanly.ColGraspMyBrand', 'selectWeekAmt', '0', '\@#%');
weekAmtTm.setAddDataField('BASE_YEAR', sel_year);
weekAmtTm.setAddDataField('BASE_MON', sel_month);
weekAmtTm.setAddDataField('STORE_CD', store_cd);
weekAmtTm.setAddDataField('MD_CD', md_cd);
weekAmtTm.execute(null, false);
var weekAmtTmResult = weekAmtTm.getResult();
var weekAmtTmResult_json = "";
if(weekAmtTmResult != ""){
	weekAmtTmResult_json = JSON.parse(weekAmtTmResult);
	/*
	DAY_CD :요일코드
	DAY_NM :요일명(일,월...)
	MD_AMT :내브랜드매출
	TOP5_AMT :TOP5매출
	*/
}
weekAmtTm.clear();


//시간대별 매출 현황-------------------------
var timeAmtTm = new oza_TMHandler('com.obzen.bmpanly.ColGraspMyBrand', 'selectTimeAmt', '0', '\@#%');
timeAmtTm.setAddDataField('BASE_YEAR', sel_year);
timeAmtTm.setAddDataField('BASE_MON', sel_month);
timeAmtTm.setAddDataField('STORE_CD', store_cd);
timeAmtTm.setAddDataField('MD_CD', md_cd);
timeAmtTm.execute(null, false);
var timeAmtTmResult = timeAmtTm.getResult();
var timeAmtTmResult_json = "";
if(timeAmtTmResult != ""){
	timeAmtTmResult_json = JSON.parse(timeAmtTmResult);
	/*
	TIME_CD :요일코드
	MD_AMT :내브랜드매출
	TOP5_AMT :TOP5매출
	*/
}
timeAmtTm.clear();

//TM End =================================================================================================

	
	
//화면 시작 시 실행
$(document).ready(function() {
	screenLog("조회", "web_chart_brandsales_sub01", "분석>내 브랜드 알기>매출현황",get_client_ip);//화면 로그(공통)
	
	//상단 고정 내용 시작------------------------------------------------------------20191029 stj 추가
	var grow_rt_cls =  grow_rt_color == 'R' ? "fc_red" : "fc_blue";
	var ms_cls =  ms_color == 'R' ? "fc_red" : "fc_blue";
	var vip_sale_rate_cls  = vip_sale_rate_color == 'R' ? "fc_red" : "fc_blue";
	var new_cust_sale_rate_cls = new_cust_sale_rate_color == 'R' ? "fc_red" : "fc_blue";
	var innerHtml = "";
	if(md_cd == "") {
		innerHtml += "<div class='md_noti'><p><strong>MD</strong>를 선택해주세요.</p></div>"
	} else {	
		innerHtml += "<p>매출신장률은 <strong class='" + grow_rt_cls + "'>\"" + grow_rt_cont + "\"</strong>, M/S는 <strong class='" + ms_cls + "'>\"" + ms_cont + "\"</strong>추세 입니다.<br>"
		innerHtml += "<span>Top5 브랜드와 비교시 주요 고객특징은</span> <strong>VIP비중</strong>이 <strong class='" + vip_sale_rate_cls + "'>\"" + vip_sale_rate_cont + "\"</strong> <strong>신규고객비중</strong>이 <strong class='" + new_cust_sale_rate_cls + "'>\"" + new_cust_sale_rate_cont + "\"</strong></p>"
	}
	
	$(".br_top2").html(innerHtml);
	//상단 고정 내용 종료------------------------------------------------------------
	
	$("#brand_sales").html("<strong>" + AddComma(md_mm_amt) +"</strong>백만");
	$("#top_avg").html("<strong>"+ AddComma(dd_avg_sale_amt) +"</strong>백만");
	
	var base_ym = "";
	
	/*
	if(!yyyymm){
		base_ym = "";
  }else {
    base_ym = yyyymm.substring(0,4) +"년 " + yyyymm.substring(4,6) + "월";	
	}
	*/
	
	if(sel_month != ""){
		base_ym = sel_year +"년 " + sel_month + "월";	
	}else{
		base_ym = sel_year +"년";
	}
	
	$("#base_ym").text(base_ym);
	drawTopSmdSales();
	drawBrandSales();
	drawMsSales();
	drawDaySales();
	drawWeekSales();
	
});



/**========================================================================================
 * 매출,상위 SMD 비교 매출 추이(지난 3개월)
 ========================================================================================*/
function drawTopSmdSales(){

	//Multi Bar-Line Chart Start====================================================
	var data = null;
	
	data = bf3MSaleTrandTmResult_json;
	
	for(var i=0; i<data.length; i++) {
		data[i].MD_TOT_SALE_AMT = exCeil((parseInt(data[i].MD_TOT_SALE_AMT)/division_amt), 1);
		data[i].TOP5_TOT_SALE_AMT = exCeil((parseInt(data[i].TOP5_TOT_SALE_AMT)/division_amt), 1);
		data[i].MD_GROW_RATE = exCeil(parseFloat(data[i].MD_GROW_RATE), 2);
		data[i].TOP5_GROW_RATE = exCeil(parseFloat(data[i].TOP5_GROW_RATE), 2);
		data[i].BASE_YM = data[i].BASE_YM;
		/*
		BASE_DT :YYYYMM 
		MD_AMT : 내브랜드매출
		TOP5_AMT : TOP5매출
		MD_GROW_RT : 내MD신장률
		TOP5_GROW_RT : TOP5신장률
		*/
	}
	
	if(data.length == 0){
		$("#top_smd_chart").html("<p class='nodata'>매출 데이터가 없습니다.</p>");
		
	}else{
		$("#top_smd_chart").dxChart({
			dataSource: data,
			//dataSource: tmResult_json,
			commonSeriesSettings: {
				//barWidth: 5,//바 굵기
				//barPadding:0.8,
				tagField :  "BASE_YM",
				argumentField: "BASE_YM",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				{ axis: "amt", valueField: "MD_TOT_SALE_AMT", name: "amt", color: '#2ED790',barWidth:5 },
		        { axis: "amt", valueField: "TOP5_TOT_SALE_AMT", name: "amt", color: '#9EA3B7',barWidth:10 },
		        {
					axis: "rate",
					type: "line",
					valueField: "MD_GROW_RATE",
					name: "rate",
					color: "#4590EB",
					/*label : {visible: true,font:{color:"#4590EB",weight:690},backgroundColor:"none"},*/ //weight(글자 진하기 정도)
					point: { border: {color: "#4590EB",width: 1,visible: true},//포인트 설정
							 hoverStyle:{border: {color: "#4590EB",width: 1,visible: true}, color: "#4590EB",size: 10},//포인트 호버 스타일 설정(마우스 오버시)	
							 color: "#ffffff",size: 10}	
		            /*
					customizePoint: function() {
		    			return {image: { url: "../img/web/icon/chart_circle.png", width: 13, height: 13 }, visible: true };
		            },
		            */
		        },
		        {
					axis: "rate",
					type: "line",
					valueField: "TOP5_GROW_RATE",
					name: "rate",
					color: "#5D5D5D",
					/*label : {visible: true,font:{color:"#5D5D5D",weight:690},backgroundColor:"none"},*/ //weight(글자 진하기 정도)
					point: { border: {color: "#5D5D5D",width: 1,visible: true},//포인트 설정
							hoverStyle:{border: {color: "#5D5D5D",width: 1,visible: true}, color: "#5D5D5D",size: 10},//포인트 호버 스타일 설정(마우스 오버시)	
					        color: "#ffffff",size: 10}
		            /*
					customizePoint: function() {
		    			return {image: { url: "../img/web/icon/chart_circle.png", width: 13, height: 13 }, visible: true };
		            },
		            */
		        }
			],
			tooltip: {  // hover 속성
		          enabled: true,
		          customizeTooltip: function (arg) {
		        		var unit = "";
	      	        	if(this.seriesName == "amt"){
	      	        		unit = "백만";
	      	        	} else{
	      	        		unit = "%";
	      	        	}
	      	  	      return {text: AddComma(arg.valueText) + unit};
		          }
		      }, 
			valueAxis: [
				{
					name: "amt",
					position: "left",//값 위치
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
				, {
					name: "rate",
					position: "right",
					visualRange: {
					    startValue: 0,
					    endValue: 100
					},
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
				//alert(e.target.tag);
			}
		});
	}
	
	
	
}


/**========================================================================================
 * 브랜드 매출정보
 ========================================================================================*/
function drawBrandSales(){
	
	//Doughnut Chart Start==========================================================
	var data = null;	
	
	
	data = [{
		    YM: "A",
		    MD_MS: md_mm_amt,
		    TOP5_MS: top5_md_mm_amt
		},
		{
			YM: "B",
		    MD_MS  : pc_mm_amt ? pc_mm_amt - md_mm_amt :1,
		    TOP5_MS: top5_pc_mm_amt ? top5_pc_mm_amt - top5_md_mm_amt : 1
		}];
	
	
	
	$("#pc_ms_rate").html("<strong>"+AddComma(md_mm_ms_rate)+"</strong>%");
	$("#pc_ms_rate2").html("<strong>"+AddComma(md_mm_ms_rate)+"</strong>%");
	
	$("#top_pc_ms_rate").html("<strong>"+AddComma(top5_md_mm_ms_rate)+"</strong>%");
	$("#brand_chart").dxPieChart({
		  size:{width:275, height:275},
		  margin: {
	          bottom: 80,
	          right : 90
	      },
		  innerRadius: 0.6, // 도넛의 가운데 빈 공간 크기
		  relativeInnerRadius:0.8,
	      type: "doughnut", // 타입 doughnut
	      palette: ["#4590eb", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: data,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(this.seriesName == "myBrand"){
	        		  if(pc_mm_amt + md_mm_amt == 0) arg.valueText = 0;
	        	  } else {
	        		  if(top5_pc_mm_amt + top5_md_mm_amt == 0) arg.valueText = 0;
	        	  }
	        	 return {text: AddComma(arg.valueText) + "백만"};
	          }
	      },
	      "export": {
	          enabled: false
	      },
	      legend: {
	          visible: false
	      },
	      series: [{
							//안쪽    	  
	            name: "myBrand",
	            argumentField: "YM",
	            valueField: "MD_MS",
	        }, {
	        	
	        		//바깥쪽
	            name: "top5",
	            argumentField: "YM",
	            valueField: "TOP5_MS"
	        }]
	    });
	//Doughnut Chart End============================================================
		
}


/**========================================================================================
 * M/S 추세(지난 3개월)
 ========================================================================================*/
function drawMsSales(){
	
	//Step Line Chart Start==========================================================
		
	var data = null;	
	
	data = bf3MSaleTrandTmResult_json;
	
	for(var i=0; i<data.length; i++) {
		
		data[i].MD_MS_RATE = exCeil(parseFloat(data[i].MD_MS_RATE), 2);
		data[i].TOP5_MS_RATE = exCeil(parseFloat(data[i].TOP5_MS_RATE), 2);
		data[i].BASE_YM = data[i].BASE_YM;
	}
	
	
	if(data.length == 0){
		$("#ms_chart").html("<p class='nodata'>M/S 추세 데이터가 없습니다.</p>");
		
	}else{
		$("#ms_chart").dxChart({
	      //title: "Australian Olympic Medal Count",
	      dataSource: data,
	      //size:{width: 1176,height: 490},
	      commonSeriesSettings: {
	          type: "line",
	          argumentField: "BASE_YM",
	          stepline: {
	              point: {
	                  visible: false
	              }
	          }
	      },
	      tooltip: {  // hover 속성
	          enabled: true,
	          customizeTooltip: function (arg) {
	                      return {  
	                  text: AddComma(arg.valueText) + "%"
	              };
	          }
	      },
	      valueAxis: {    //  y축 옵션
	         	position: "right",
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
	          { valueField: "MD_MS_RATE", name: "내M/S", color: "#4590EB",
	        	  point: { border: {color: "#4590EB",width: 1,visible: true},//포인트 설정
						 hoverStyle:{border: {color: "#4590EB",width: 1,visible: true}, color: "#4590EB",size: 10},//포인트 호버 스타일 설정(마우스 오버시)	
						 color: "#ffffff",size: 10}	  
	          
	          },
	          { valueField: "TOP5_MS_RATE", name: "TOP5M/S", color: "#808592", 
	        	  point: { border: {color: "#808592",width: 1,visible: true},//포인트 설정
						 hoverStyle:{border: {color: "#808592",width: 1,visible: true}, color: "#808592",size: 10},//포인트 호버 스타일 설정(마우스 오버시)	
						 color: "#ffffff",size: 10}
	          }
	      ],
	      argumentAxis: {
	          label: {
	              format: {
	                  type: "decimal"
	              }
	          }
	      },
	      legend: {
	          visible:false
	      }
	  });
	}
	
	
		
	//Step Line Chart Start==========================================================
}


/**========================================================================================
 * 시간대별 매출
 ========================================================================================*/
function drawDaySales(){
	
	//Line Chart Start==========================================================
	var data = null;
	data = timeAmtTmResult_json;
	
	
	for(var i=0; i<data.length; i++) {
		
		data[i].MD_TIME_SALE_AMT = exCeil((parseInt(data[i].MD_TIME_SALE_AMT)/division_amt), 1);
		data[i].TOP5_TIME_SALE_AMT = exCeil((parseInt(data[i].TOP5_TIME_SALE_AMT)/division_amt), 1);
	}
	
	
	if(data.length == 0){
		$("#day_chart").html("<p class='nodata'>시간대별 데이터가 없습니다.</p>");
		
	}else{
		$("#day_chart").dxChart({  //  id = area_chart 태그에 차트 생성
	        //size:{width: 1176,height: 490},
	        palette: ["#2ED790","#9EA3B7"], // 색상 지정 (배열로 순서 따라 차트 각각의 색상을 지정)
	        dataSource: data,  //  dataSource 지정
	        commonSeriesSettings: {
	            argumentField: "TIME_NM", // argument 지정
	            type: "spline" // 타입 area 차트
	        },
	        margin: { //  margin 옵션
	            bottom: 20
	        },
	        argumentAxis: { //  x축 옵션
	            valueMarginsEnabled: false,
	            discreteAxisDivisionMode: "crossLabels",
	            grid: {visible: false},
	            color: "#ffffff",
	            tick:{     // 눈금
	                color: "#ffffff"
	            }
	        },
	        valueAxis: {    //  y축 옵션
	           color: "#ffffff",
	            tick:{
	                color: "#ffffff"
	            },
	            grid: {visible: true},
	            position: "right",
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

	        series: [   //  {계열1}, {계열2}, ...
	            { valueField: "MD_TIME_SALE_AMT", name: "매출",
	            	point: {visible: false},
	              border: { //  계열1 에 대한 border 속성
	                visible:true,
	                width:2,
	                color: "#2ED790"
	              }
	            },
	            { valueField: "TOP5_TIME_SALE_AMT", name: "TOP5매출",
	              point: {visible: false},
	              border: {
	                visible:true,
	                width:2,
	                color: "#9EA3B7"
	              }
	            }

	        ],
	        legend: { //  범례 속성
	            visible: false,
	            verticalAlignment: "top",
	            horizontalAlignment: "center",
	        },
	        tooltip: {  // point에 hover 옵션
	            enabled: true,
	            customizeTooltip: function (arg) {
	                return {
	                    text: arg.valueText + "백만"
	                };
	            }
	        }
	    }).dxChart("instance");
	}
	
	
	//Line Chart End============================================================
	
}


/**========================================================================================
 * 요일별 매출
 ========================================================================================*/
function drawWeekSales(){
	
	//Area Chart Start==========================================================
	
	// sample 데이터소스
	var data = null;
	
	data = weekAmtTmResult_json;
	
	
	for(var i=0; i<data.length; i++) {
		
		data[i].MD_DAY_SALE_AMT = exCeil((parseInt(data[i].MD_DAY_SALE_AMT)/division_amt), 1);
		data[i].TOP5_DAY_SALE_AMT = exCeil((parseInt(data[i].TOP5_DAY_SALE_AMT)/division_amt), 1);
	}
	
	
	
	if(data.length == 0){
		$("#week_chart").html("<p class='nodata'>요일별 데이터가 없습니다.</p>");
		
	}else{
		var chart = $("#week_chart").dxChart({
			//size:{width:520, height:220},
			palette: ["#2ed790","#808592"],
	        dataSource: data,
	        commonSeriesSettings: {
	            type: "area",
	            argumentField: "DAY_NM"
	        },
	        series: [   //  {계열1}, {계열2}, ...
	            {
					valueField: "MD_DAY_SALE_AMT",
					name: "내브랜드매출",
					color: "#2ed790",
					//label : {visible: true,font:{color:"#7b57e2",weight:690},backgroundColor:"none"},//weight(글자 진하기 정도)
					point: { visible: true,border: {color: "#2ed790",width: 1,visible: true},//포인트 설정
							hoverStyle:{border: {color: "#2ed790",width: 1,visible: true},color: "#2ed790",size: 10},//포인트 호버 스타일 설정(마우스 오버시)	
							color: "#ffffff",size: 10
							},
					border: {
		                visible:true,
		                width:2,
		                color: "#2ed790"
		              }		
		        },
	            {
					valueField: "TOP5_DAY_SALE_AMT",
					name: "TOP5매출",
					color: "#808592",
					//label : {visible: true,font:{color:"#7b57e2",weight:690},backgroundColor:"none"},//weight(글자 진하기 정도)
					point: { visible: true,border: {color: "#808592",width: 1,visible: true},//포인트 설정
							hoverStyle:{border: {color: "#808592",width: 1,visible: true},color: "#808592",size: 10},//포인트 호버 스타일 설정(마우스 오버시)	
							color: "#ffffff",size: 10},
					border: {
		                visible:true,
		                width:2,
		                color: "#808592"
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
	            position: "right",
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
	                    text: arg.valueText + "백만"
	                };
	            }
	        }
	    }).dxChart("instance");
	}
	
	//Area Chart End============================================================
	
}
</script>



<div id="web_content">
	<div class="brandResult_wrap">
	 
		<div class="br_top2">
		<!--
			<p class="type02">
				Top5 브랜드와 비교시 매출신장률은 <strong class="fc_red">“높으며”</strong>, M/S는 <strong class="fc_red">“확대”</strong>추세 입니다.<br>
				<span>주요 고객득징은</span> <strong>VIP비중</strong>이 <span class="fc_blue">“낮고”</span> <strong>신규고객비중</strong>이 <span class="fc_red">“높습니다”</span>
			</p>
			-->
		</div>
	  
		<div class="br_box">
			<div class="br_cnt1">
				<p class="tit">최근 3개월 매출 및 신장률</p>
				<div class="cnt_area1">
          <p class="area_tit" id="base_ym" ></p>
					<ul>
						<li>
							<p>매출</p>
							<span class="my_md" id="brand_sales"></span>
						</li>
						<li>
							<p>일평균</p>
							<span class="top_md" id="top_avg"></span>
						</li>
					</ul>
				</div>
				<div  class="cnt_area2">
					<ul class="graph_regend">
						<li class="regend3"><span></span>내 브랜드 매출액</li>
						<li class="regend4"><span></span>Top5 평균 매출액</li>
						<li class="regend1"><span></span>내 브랜드 신장률</li>
						<li class="regend2"><span></span>Top5 평균 신장률</li>
						<li class="regend5">[단위 : 백만, %]</li>
					</ul>
					<div class="graph" id="top_smd_chart"></div>
				</div>
			</div>
		</div>
		<div class="br_box">
			<div class="br_cnt2">
				<p class="tit">나의 브랜드 매출 M/S(동일 장르 기준)</p>
        <div class="graph_wrap">
          <div class="graph" id="brand_chart"></div>
          <div class="graph_txt" id="pc_ms_rate2"></div>
        </div>
				<ul>
					<li>
						<p>내 브랜드 M/S </p>
						<span id="pc_ms_rate" class="my_ms"></span>
					</li>
					<li>
						<p>Top5 평균 M/S</p>
						<span id="top_pc_ms_rate" class="top_ms"></span>
					</li>
				</ul>
			</div>
			<div class="br_cnt3">
				<p class="tit">최근 3개월 M/S 추세</p>
				<ul class="graph_regend">
					<li class="regend1"><span></span>내 브랜드 M/S</li>
					<li class="regend2"><span></span>Top5 평균 M/S</li>
					<li class="regend3">[단위 : %]</li>
				</ul>
				<div class="graph" id="ms_chart"></div>
			</div>
		</div>
		<div class="br_box">
			<div class="br_cnt4">
				<p class="tit">시간대별 매출 구성비</p>
				<ul class="graph_regend">
					<li class="regend1"><span></span>내 브랜드</li>
					<li class="regend2"><span></span>Top5 평균</li>
					<li class="regend3"> [단위 : 백만]</li>
				</ul>
				<div class="graph" id="day_chart"></div>
			</div>
			<div class="br_cnt5">
				<p class="tit">요일별 매출 구성비</p>
				<ul class="graph_regend">
					<li class="regend1"><span></span>내 브랜드</li>
					<li class="regend2"><span></span>Top5 평균</li>
				</ul>
				<div class="graph" id="week_chart"></div>
			</div>
		</div>
	</div>
</div>