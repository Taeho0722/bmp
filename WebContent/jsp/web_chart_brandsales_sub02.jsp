<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
//TM Start =================================================================================================

//화면 시작 시 실행
$(document).ready(function() {
	screenLog("조회", "web_chart_brandsales_sub02", "분석>내 브랜드 알기>고객현황",get_client_ip);//화면 로그(공통)
	
	//상단 고정 내용 시작------------------------------------------------------------
	var innerHtml = "";
	var grow_rt_cls =  grow_rt_color == 'R' ? "fc_red" : "fc_blue";
	var ms_cls =  ms_color == 'R' ? "fc_red" : "fc_blue";
	var vip_sale_rate_cls  = vip_sale_rate_color == 'R' ? "fc_red" : "fc_blue";
	var new_cust_sale_rate_cls = new_cust_sale_rate_color == 'R' ? "fc_red" : "fc_blue";
	if(md_cd == "") {
		innerHtml += "<div class='md_noti'><p><strong>MD</strong>를 선택해주세요.</p></div>"
	} else {
		innerHtml += "<p>매출신장률은 <strong class='" + grow_rt_cls + "'>\"" + grow_rt_cont + "\"</strong>, M/S는 <strong class='" + ms_cls + "'>\"" + ms_cont + "\"</strong>추세 입니다.<br>"
		innerHtml += "<span>Top5 브랜드와 비교시 주요 고객특징은</span> <strong>VIP비중</strong>이 <strong class='" + vip_sale_rate_cls + "'>\"" + vip_sale_rate_cont + "\"</strong> <strong>신규고객비중</strong>이 <strong class='" + new_cust_sale_rate_cls + "'>\"" + new_cust_sale_rate_cont + "\"</strong></p>"
	}
	$(".br_top").html(innerHtml);
	//상단 고정 내용 종료------------------------------------------------------------
	
	drawVisitCust();
	drawVisitCustTop5();
	drawVipCust();
	drawNewCustRate();
});

/**========================================================================================
 * 내점고객 내 브랜드
========================================================================================*/
function drawVisitCust(){
	
	$("#visit_tot_sale_cust_cnt").text(AddComma(tot_sale_cust_cnt));
	
	
	var data = [{
					col: "1회",
				    val1: visit_sale_1t_cust_cnt,
				    val2: visit_sale_1t_ppc
	}, {
					col: "2회",
				    val1: visit_sale_2t_cust_cnt,
				    val2: visit_sale_2t_ppc
	}, {
				    col: "3회",
				    val1: visit_sale_3t_cust_cnt,
				    val2: visit_sale_3t_ppc
	}, {
					col: "4회",
				    val1: visit_sale_4t_cust_cnt,
				    val2: visit_sale_4t_ppc
	}, {
					col: "5회 이상",
				    val1: visit_year_sale_5t_cust_cnt,
				    val2: visit_year_sale_5t_ppc
	}];
	
	if(tot_sale_cust_cnt == 0){
		$("#visit_cust_chart").html("<p class='nodata'>내점횟수별 고객 데이터가 없습니다.</p>");
	} else {
		$("#visit_cust_chart").dxChart({
			dataSource: data,
			commonSeriesSettings: {
				//barWidth: 5,//바 굵기
				//barPadding:0.8,
				argumentField: "col",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				 { axis: "cust", valueField: "val1", name: "cust", color: '#4092f8',barWidth:5 },
				 { axis: "price", valueField: "val2", name: "price", color: '#5D5D5D',barWidth:5 
					 /*
				 
					axis: "price",
					type: "bar",
					valueField: "val2",
					name: "객단가",
					color: "#808592",
					point: { border: {color: "#808592",width: 3,visible: true},//포인트 설정
							hoverStyle:{border: {color: "#808592",width: 5,visible: true},color: "#ffffff",size: 13},//포인트 호버 스타일 설정(마우스 오버시)	
							color: "#ffffff",size: 9}
				 */
		          }
		    ],
			valueAxis: [
				  {
					name: "cust",
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
				}, {
					name: "price",
					position: "right",
					visualRange: {
					    startValue: 0,
					    //endValue: 100
					},
					showZero: true,//0부터 시작
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
			 tooltip: {
		            enabled: true,
		            customizeTooltip: function (arg) {
		            	var unit = "";
        	        	if(this.seriesName == "cust"){
        	        		unit = "명";
        	        	} else{
        	        		unit = "만원";
        	        	}
        	  	      return {text: AddComma(arg.valueText) + unit};
		            }
		        },
			onPointClick: function (e) {
				e.target.select();
			}
		});
		
	}
	
}

/**========================================================================================
 * 내점고객 Top5
========================================================================================*/
function drawVisitCustTop5(){

	$("#visit_top5_tot_sale_cust_cnt").text(AddComma(top5_tot_sale_cust_cnt));

	var data = [{
					col: "1회",
				    val1: visit_top5_sale_1t_cust_cnt,
				    val2: visit_top5_sale_1t_ppc
	}, {
					col: "2회",
				    val1: visit_top5_sale_2t_cust_cnt,
				    val2: visit_top5_sale_2t_ppc
	}, {
				    col: "3회",
				    val1: visit_top5_sale_3t_cust_cnt,
				    val2: visit_top5_sale_3t_ppc
	}, {
					col: "4회",
				    val1: visit_top5_sale_4t_cust_cnt,
				    val2: visit_top5_sale_4t_ppc
	}, {
					col: "5회 이상",
				    val1: visit_top5_year_sale_5t_cust_cnt,
				    val2: visit_top5_year_sale_5t_ppc
	}];
	
	if(top5_tot_sale_cust_cnt == 0){
		$("#visit_top5_cust_chart").html("<p class='nodata'>Top5 평균 내점횟수별 고객 데이터가 없습니다.</p>");
	} else {
		
		$("#visit_top5_cust_chart").dxChart({
			dataSource: data,
			commonSeriesSettings: {
				//barWidth: 5,//바 굵기
				//barPadding:0.8,
				argumentField: "col",
				type: "bar",
				hoverMode: "allArgumentPoints",
				selectionMode: "allArgumentPoints",
				label: {
					visible: false
				}
			},
			series: [
				 //{ axis: "cust", valueField: "val1", name: "내점일수별고객수", color: '#4590eb',barWidth:5 },
				 { axis: "cust", valueField: "val1", name: "cust", color: '#A1A1A1',barWidth:5 },
				 { axis: "price", valueField: "val2", name: "price", color: '#5D5D5D',barWidth:5
					 
				   /*
					axis: "price",
					type: "line",
					valueField: "val2",
					name: "객단가",
					color: "#808592",
					point: { border: {color: "#808592",width: 3,visible: true},//포인트 설정
							hoverStyle:{border: {color: "#808592",width: 5,visible: true},color: "#ffffff",size: 13},//포인트 호버 스타일 설정(마우스 오버시)	
							color: "#ffffff",size: 9})
					 */
		          }
		    ],
			valueAxis: [
				  {
					name: "cust",
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
				}, {
					name: "price",
					position: "right",
					visualRange: {
					    startValue: 0,
					    //endValue: 100
					},
					showZero: true,//0부터 시작
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
			 tooltip: {
		            enabled: true,
		            customizeTooltip: function (arg) {
		            	var unit = "";
        	        	if(this.seriesName == "cust"){
        	        		unit = "명";
        	        	} else{
        	        		unit = "만원";
        	        	}
        	        	return {text: AddComma(arg.valueText) + unit};
		            }
					
		        },
			onPointClick: function (e) {
				e.target.select();
			}
		});
	}
	
}

/**========================================================================================
 * 신세계 VIP 비중
========================================================================================*/
function drawVipCust(){
	
	//VIP 고객 매출비중----------------------------------------------------------------------------------------
	$("#vip_sale_rate").text(vip_sale_rate);//비율
	$("#vip_tot_sale_amt").text(AddComma(md_mm_amt)+" 백만");
	$("#vip_sale_amt").text(AddComma(vip_sale_amt));
	
	var vip_sale_src = [{
			col: "vip",
		    val: vip_sale_amt
			}, {
		    col: "vip외",
		    val: md_mm_amt ? md_mm_amt-vip_sale_amt : 1
			}
	];
	
	$("#vip_sale_chart").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#4092f8", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: vip_sale_src,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	 if(md_mm_amt + vip_sale_amt == 0) arg.valueText = 0; 
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
	//VIP top5 고객 매출비중----------------------------------------------------------------------------------------
	$("#vip_top5_sale_rate").text(vip_top5_sale_rate);//비율
	$("#vip_top5_tot_sale_amt").text(AddComma(top5_md_mm_amt)+" 백만");
	$("#vip_top5_sale_amt").text(AddComma(vip_top5_sale_amt));
	
	var vip_top5_sale_src = [{
			col: "vip",
		    val: vip_top5_sale_amt
			}, {
		    col: "vip외",
		    val: top5_md_mm_amt ? top5_md_mm_amt-vip_top5_sale_amt : 1
			}
	];
	
	$("#vip_top5_sale_chart").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#4D5271", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: vip_top5_sale_src,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	 if(top5_md_mm_amt + vip_top5_sale_amt == 0) arg.valueText = 0;
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
	
	//VIP 고객 비중----------------------------------------------------------------------------------------
	$("#vip_rate").text(vip_rate);//비율
	$("#vip_tot_sale_cust_cnt").text(AddComma(tot_sale_cust_cnt)+" 명");
	$("#vip_cust_cnt").text(AddComma(vip_cust_cnt));

	var vip_cust_src = [{
  			col: "vip",
  	    val: vip_cust_cnt
			}, {
  	    col: "vip외",
  	    val: tot_sale_cust_cnt ? tot_sale_cust_cnt-vip_cust_cnt : 1
			}
	];
	
	$("#vip_cust_chart").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#4092f8", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: vip_cust_src,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	 if(tot_sale_cust_cnt + vip_cust_cnt == 0) arg.valueText = 0; 	
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
	
	//VIP top5 고객 비중----------------------------------------------------------------------------------------
	$("#vip_top5_rate").text(vip_top5_rate);//비율
	$("#vip_top5_tot_sale_cust_cnt").text(AddComma(top5_tot_sale_cust_cnt)+" 명");
	$("#vip_top5_cust_cnt").text(AddComma(vip_top5_cust_cnt));
	
	var vip_top5_cust_src = [{
			col: "vip",
		    val: vip_top5_cust_cnt
			}, {
		    col: "vip외",
		    val: top5_tot_sale_cust_cnt ? top5_tot_sale_cust_cnt-vip_top5_cust_cnt : 1
			}
	];
	
	$("#vip_top5_cust_chart").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#4D5271", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: vip_top5_cust_src,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	          	if(top5_tot_sale_cust_cnt + vip_top5_cust_cnt == 0) arg.valueText = 0;	
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
}

/**========================================================================================
 * 신세계 신규고객 비중
========================================================================================*/
function drawNewCustRate(){
	//신규 고객 매출비중----------------------------------------------------------------------------------------
	$("#new_sale_rate").text(new_sale_rate);//비율
	$("#new_tot_sale_amt").text(AddComma(md_mm_amt)+" 백만");
	$("#new_sale_amt").text(AddComma(new_sale_amt));
	
	var new_sale_src = [{
			col: "신규",
		    val: new_sale_amt
			}, {
		    col: "신규외",
		    val: md_mm_amt ? md_mm_amt-new_sale_amt : 1
			}
	];
	
	$("#new_sale_chart").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#7B57E2", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: new_sale_src,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(md_mm_amt + new_sale_amt == 0) arg.valueText = 0;
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
	
	//신규 top5 고객 매출비중----------------------------------------------------------------------------------------
	$("#new_top5_sale_rate").text(new_top5_sale_rate);//비율
	$("#new_top5_tot_sale_amt").text(AddComma(top5_md_mm_amt)+" 백만");
	$("#new_top5_sale_amt").text(AddComma(new_top5_sale_amt));
	
	var new_top5_sale_src = [{
			col: "신규",
		    val: new_top5_sale_amt
			}, {
		    col: "신규외",
		    val: top5_md_mm_amt ? top5_md_mm_amt-new_top5_sale_amt : 1
			}
	];
	
	$("#new_top5_sale_chart").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#4D5271", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: new_top5_sale_src,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(top5_md_mm_amt + new_top5_sale_amt == 0) arg.valueText = 0;
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
	
	//신규 고객 비중----------------------------------------------------------------------------------------
	$("#new_cust_rate").text(new_cust_rate);//비율
	$("#new_tot_sale_cust_cnt").text(AddComma(tot_sale_cust_cnt)+" 명");
	$("#new_cust_cnt").text(AddComma(new_cust_cnt));

	var new_cust_src = [{
  			col: "신규",
  	    val: new_cust_cnt
			}, {
  	    col: "신규외",
  	    val: tot_sale_cust_cnt ? tot_sale_cust_cnt-new_cust_cnt : 1
			}
	];
	
	$("#new_cust_chart").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#7B57E2", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: new_cust_src,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(tot_sale_cust_cnt + new_cust_cnt == 0) arg.valueText = 0;
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
	
	//신규 top5 고객 비중----------------------------------------------------------------------------------------
	$("#new_top5_cust_rate").text(new_top5_cust_rate);//비율
	$("#new_top5_tot_sale_cust_cnt").text(AddComma(top5_tot_sale_cust_cnt)+" 명");
	$("#new_top5_cust_cnt").text(AddComma(new_top5_cust_cnt));
	
	var new_top5_cust_src = [{
			col: "신규",
		    val: new_top5_cust_cnt
			}, {
		    col: "신규외",
		    val: top5_tot_sale_cust_cnt ? top5_tot_sale_cust_cnt-new_top5_cust_cnt : 1
			}
	];
	
	$("#new_top5_cust_chart").dxPieChart({  // 해당 id 태그에서 차트 생성
	      innerRadius: 1, // 도넛의 가운데 빈 공간 크기
	      type: "doughnut", // 타입 doughnut
	      //size: {  width : 146, height : 146 },
	      palette: ["#4D5271", "#E1E6ED"],  // 색상 두가지 지정
	      dataSource: new_top5_cust_src,  // 데이터소스 지정
	      tooltip: {  // hover 속성
	          enabled: true,
	          //format: "millions",
	          customizeTooltip: function (arg) {
	        	  if(top5_tot_sale_cust_cnt + new_top5_cust_cnt == 0) arg.valueText = 0;
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
}

</script>
	<div id="web_content2">
         <div class="analysis_wrap pt85">
         	<div class="br_top">
         	<!-- 
                 <p>Top5 브랜드와 비교시 매출신장률은 <strong class="fc_red">""</strong>, M/S는 <strong class="fc_red">""</strong>추세 입니다.<br>
              <span>주요 고객득징은</span> <strong>VIP비중</strong>이 <span class="fc_blue">""</span> <strong>신규고객비중</strong>이 <span class="fc_red">""</span></p>
              --> 
            </div>
            <div class="box analysis0">
             <p class="tit">최근 내점 횟수별 고객</p>
             <ul>
               <li class="latest1">
                 <div class="total"><span>내 브랜드 고객수</span><strong id = "visit_tot_sale_cust_cnt"></strong>명</div>
                 <div class="graph_wrap">
                   <div class="graph_regend">
                     <span class="regend3">(명)</span>
                     <span class="regend1"><i></i>고객수</span>
                     <span class="regend2"><i></i>객단가</span>
                     <span class="regend4">(만원)</span>
                   </div>
                   <div class="graph" id="visit_cust_chart"></div>
                 </div>
               </li>
               <li class="latest2">
                 <div class="total"><span>Top5 고객수</span><strong id="visit_top5_tot_sale_cust_cnt"></strong>명</div>
                 <div class="graph_wrap">
                   <div class="graph_regend">
                     <span class="regend3">(명)</span>
                     <span class="regend1"><i></i>고객수</span>
                     <span class="regend2"><i></i>객단가</span>
                     <span class="regend4">(만원)</span>
                   </div>
                   <div class="graph" id="visit_top5_cust_chart"></div>
                 </div>
               </li>
             </ul>
           </div>
           <div class="box analysis1">
             <p class="tit">신세계 VIP 비중</p>
             <div class="analysis_area">
               <ul>
                 <li>
                   <p>내 브랜드 VIP 매출비중</p>
                   <div class="graph_wrap">
                     <div class="graph" id="vip_sale_chart"></div>
                     <p class="graph_txt type1"><span id="vip_sale_rate"></span>%</p>
                   </div>
                   <ul>
                     <li>
                       <span>신세계 VIP매출</span>
                       <p class="type1"><strong id="vip_sale_amt"></strong> 백만</p>
                     </li>
                     <li>
                       <span >전체 매출</span>
                       <p id="vip_tot_sale_amt"></p>
                     </li>
                   </ul>
                 </li>
                 <li>
                   <p>Top5 평균 VIP 매출비중</p>
                   <div class="graph_wrap">
                     <div class="graph" id="vip_top5_sale_chart"></div>
                     <p class="graph_txt type4"><span id="vip_top5_sale_rate"></span>%</p>
                   </div>
                   <ul>
                     <li>
                       <span>신세계 VIP매출</span>
                       <p class="type4"><strong id="vip_top5_sale_amt"></strong> 백만</p>
                     </li>
                     <li>
                       <span>전체 매출</span>
                      	<p id="vip_top5_tot_sale_amt"></p> 
                     </li>
                   </ul>
                 </li>
               </ul>
             </div>
             <div class="analysis_area">
               <ul>
                 <li>
                   <p>내 브랜드 VIP 고객비중</p>
                   <div class="graph_wrap">
                     <div class="graph" id="vip_cust_chart"></div>
                     <p class="graph_txt type1"><span id = "vip_rate"></span>%</p>
                   </div>
                   <ul>
                     <li>
                       <span>신세계 VIP고객</span>
                       <p class="type1"><strong id="vip_cust_cnt"></strong> 명</p>
                     </li>
                     <li>
                       <span>전체 고객</span>
                       <p id="vip_tot_sale_cust_cnt"></p>
                     </li>
                   </ul>
                 </li>
                 <li>
                   <p>Top5 평균 VIP 고객비중</p>
                   <div class="graph_wrap">
                     <div class="graph" id="vip_top5_cust_chart"></div>
                     <p class="graph_txt type4"><span id="vip_top5_rate"></span>%</p>
                   </div>
                   <ul>
                     <li>
                       <span>신세계 VIP고객</span>
                       <p class="type4"><strong id="vip_top5_cust_cnt"></strong> 명</p>
                     </li>
                     <li>
                       <span>전체 고객</span>
                       <p id="vip_top5_tot_sale_cust_cnt"></p>
                     </li>
                   </ul>
                 </li>
               </ul>
             </div>
             
           </div>
           <div class="box analysis2">
             <p class="tit">신규 고객 비중</p>
             <div class="analysis_area">
               <ul>
                 <li>
                   <p>내 브랜드 신규고객 매출비중</p>
                   <div class="graph_wrap">
                     <div class="graph" id="new_sale_chart"></div>
                     <p class="graph_txt type3"><span id="new_sale_rate"></span>%</p>
                   </div>
                   <ul>
                     <li>
                       <span>신규고객매출</span>
                       <p class="type3"><strong id="new_sale_amt"></strong> 백만</p>
                     </li>
                     <li>
                       <span>전체매출</span>
                       <p id="new_tot_sale_amt"></p>
                     </li>
                   </ul>
                 </li>
                 <li>
                   <p>Top5 평균 신규고객 매출비중</p>
                   <div class="graph_wrap">
                     <div class="graph" id="new_top5_sale_chart"></div>
                     <p class="graph_txt type4"><span id="new_top5_sale_rate"></span>%</p>
                   </div>
                   <ul>
                     <li>
                       <span>신규고객매출</span>
                       <p class="type4"><strong id="new_top5_sale_amt"></strong> 백만</p>
                     </li>
                     <li>
                       <span>전체매출</span>
                     	<p id="new_top5_tot_sale_amt"></p>  
                     </li>
                   </ul>
                 </li>
               </ul>
             </div>
             <div class="analysis_area">
               <ul>
                 <li>
                   <p>내 브랜드 신규고객 비중</p>
                   <div class="graph_wrap">
                     <div class="graph" id="new_cust_chart"></div>
                     <p class="graph_txt type3"><span id="new_cust_rate"></span>%</p>
                   </div>
                   <ul>
                     <li>
                       <span>신규고객</span>
                       <p class="type3"><strong id="new_cust_cnt"></strong> 명</p>
                     </li>
                     <li>
                       <span>전체고객</span>
                       <p id="new_tot_sale_cust_cnt"></p>
                     </li>
                   </ul>
                 </li>
                 <li>
                   <p>Top5 평균 신규고객 비중</p>
                   <div class="graph_wrap">
                     <div class="graph" id="new_top5_cust_chart"></div>
                     <p class="graph_txt type4"><span id="new_top5_cust_rate"></span>%</p>
                   </div>
                   <ul>
                     <li>
                       <span>신규고객</span>
                       <p class="type4"><strong id="new_top5_cust_cnt"></strong> 명</p>
                     </li>
                     <li>
                       <span>전체고객</span>
                       <p id="new_top5_tot_sale_cust_cnt"></p>
                     </li>
                   </ul>
                 </li>
               </ul>
             </div>
           </div>
         </div>
       </div>
