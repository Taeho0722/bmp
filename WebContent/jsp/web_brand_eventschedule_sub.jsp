<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">

//오늘 날짜 셋팅
var today = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date();//today의 Date를 세어주는 역할

var now_year = today.getFullYear();
var now_month = today.getMonth()+1;
var now_date = today.getDate();

var ozController;


var sel_year = "";
var sel_month = "";
var sel_date = "";

//화면 로드 시 실행
$(document).ready(function() {
	screenLog("조회", "web_brand_eventschedule_sub", "행사일정",get_client_ip);//화면 로그(공통)
	
	ozController = new oz_frame();//ozController 정의
	ozController.Ctllist.push(new oz_ItemValue('com.obzen.bmp.DocBMPBoard', 'grd_list'));//그리드 아이디 정의
	
	calendarDesign(now_year,now_month);
	eventBrandList("select");
	
	
	//년도 변경 시  
	$("#sel_year").change(function(){
		sel_year = $("#sel_year").val();
		sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
		eventBrandList("search");
	});
	
	
	//월 변경 시 
	$("#sel_month").change(function(){
		sel_year = $("#sel_year").val();
		sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
		eventBrandList("search");
	});
	
	
	//MD건수 클릭 시
	$("#md_cnt").click(function() {
		sel_year = $("#sel_year").val();
		sel_month = $("#sel_month").val();
		
		eventBrandList("search");
  });
	
});


/*===============================================================
년월 
===============================================================*/
function selectBox(iYear, iMonth){
	 var selectYearHtml = "";
	 var selectMonthHtml = "";
	 var selectedValue = "";
	 var yearCnt = 0;
	 var monthCnt = 0;
	 var i = 0;
	 var yearSelect = "";
	 var monthSelect = "";
	 
	 
	 //년도
	 for(i=(parseInt(iYear)-10);i<(parseInt(iYear)+10);i++){
		 if(parseInt(iYear) == i){yearSelect = "selected";}else{yearSelect = "";}
		 selectYearHtml += "<option value='"+i+"' "+yearSelect+">"+i+"년</option>";
		 yearCnt++;
	 }
	 
	 $(".sel_year").html(selectYearHtml);
	 
	 
	 //월
	 for(var j=1;j<13;j++){
		 if(iMonth == j){monthSelect = "selected";}else{monthSelect = "";}
		 selectMonthHtml += "<option value='"+j+"' "+monthSelect+">"+j+"월</option>";	 
		 monthCnt++;
	 }
	 $(".sel_month").html(selectMonthHtml);
	  
	 
}


/*===============================================================
년월 변경 시
===============================================================*/
function selectChange(){
   sel_year = $("#sel_year").val();
   sel_month = $("#sel_month").val();
   
 	 //달력 그리기
   calendarDesign(sel_year,sel_month);
}


/*===============================================================
달력 데이터 세팅
===============================================================*/
function fBuildCal(iYear, iMonth) 
{ 
 var aMonth=new Array(); 
   
   for(i=1;i<7;i++) 
   aMonth[i]=new Array(i); 

   var dCalDate=new Date(iYear, iMonth-1, 1); 
   var iDayOfFirst=dCalDate.getDay(); 
   var iDaysInMonth=new Date(iYear, iMonth, 0).getDate(); 
   var iOffsetLast=new Date(iYear, iMonth-1, 0).getDate()-iDayOfFirst+1; 
   var iDate = 1; 
   var iNext = 1; 

   for (d = 0; d < 7; d++) 
   aMonth[1][d] = (d<iDayOfFirst)?-(iOffsetLast+d):iDate++; 
   for (w = 2; w < 6; w++) 
   for (d = 0; d < 7; d++) 
   aMonth[w][d] = (iDate<=iDaysInMonth)?iDate++:-(iNext++); 
   
   return aMonth;
}

/**========================================================================================
* 달력 그리기
========================================================================================*/
function calendarDesign(iYear, iMonth){
	
	 //캘린더 데이터 조회-------------------------
	  var calTm = new oza_TMHandler('com.obzen.bmpanly.ColManageCond', 'selectCalendarMdCnt', '0', '\@#%');
	  calTm.setAddDataField('BASE_YM', iYear+""+iMonth);
	  calTm.execute(null, false);
	  var calTmResult = calTm.getResult();
	  if(calTmResult != ""){calTm_json = JSON.parse(calTmResult);}
	  calTm.clear();
	  //캘린더 데이터 조회-------------------------
	  
	
  	myMonth = fBuildCal(iYear, iMonth); 

    selectBox(iYear, iMonth);//년월 select 생성
    
    var calHtml = "";
    
    var i = 0; 
    
    var baseDate = "";
    var md_cnt = "";
    
        
    for (w = 0; w < 5; w++)
    {
 	   calHtml += "<tr>";     
        for (d = 0; d < 7; d++)
        {
             
     	    //이전 월 일자
             if (myMonth[w+1][d]<0) 
             { 
                 	innerText = -myMonth[w+1][d]; 
                 
                 	calHtml += "<td>";
                 	calHtml += "<span class='dis'>"+innerText+"</span>";
                 	calHtml += "</td>";
             
             //해당 월 일자    
             }else{  
             		innerText = myMonth[w+1][d];
             	
             		calHtml += "<td>";
             		calHtml += "<span>"+innerText+"</span>";
             	
         				cardCnt1 = 0;
               	cardCnt2 = 0;
               	cardCnt3 = 0;
               	cardCnt4 = 0;
               	cardCnt5 = 0;
               
               	if(d == 0){
                 	styleTopCard1 = "";
                  styleTopCard2 = "";
                  styleTopCard3 = "";
                  styleTopCard4 = "";
                  styleTopCard5 = "";
               	}
         		
         		for(var j=0; j<calTm_json.length; j++) {
         				
         			baseDate 	= calTm_json[j].BASE_DT;
         			md_cnt 		= calTm_json[j].MD_CNT;
         			
         			//날짜가 같으면 MD 값 셋팅
         			if(baseDate == (iYear+""+iMonth+""+innerText)){
         				calHtml += "<p onclick=\"javascript:selectMdCnt('"+baseDate+"');\">"+md_cnt +"</p>";
         			}
         			
         		}
         		
         		calHtml += "</td>";
          }
        }
        calHtml += "</tr>";
    }
    
    $("#calendar").html(calHtml);
}


/**========================================================================================
* ozController 컨트롤 가져오기
========================================================================================*/
function getCtl(id) {
	return ozController.getControl(id);
}


/**========================================================================================
*MD선택 시 행사 브랜드 목록 조회
========================================================================================*/
function selectMdCnt(val) {
	sel_date = val;
	eventBrandList("search");
}



/*===============================================================
행사 브랜드 목록 조회
===============================================================*/
var listTmResult_json = "";
function eventBrandList(selelct_flag){
		
		//TM 시작--------------------------------------------------------------------------------------------
		var listTm = new oza_TMHandler('com.obzen.bmpanly.ColManageCond', 'selectEvtMdInfo', '0', '\@#%');
	  listTm.setAddDataField('BASE_DT', sel_date);
	  listTm.execute(null, false);
		var listTmResult = listTm.getResult();
	  if(listTmResult != ""){listTmResult_json = JSON.parse(listTmResult);}
	  listTm.clear();
		//TM 종료--------------------------------------------------------------------------------------------
	  
		
		//진행상태값 기준으로 진행상태명 세팅
		for(var i=0; i<listTmResult_json.length; i++) {
			if(listTmResult_json[i].STAT_CD == "1"){
				listTmResult_json[i].STAT_NM = "시작";	
			}else if(listTmResult_json[i].STAT_CD == "2"){
				listTmResult_json[i].STAT_NM = "진행중";	
			}else if(listTmResult_json[i].STAT_CD == "3"){
				listTmResult_json[i].STAT_NM = "종료";	
			}
		}
    
		
	  
	  if(selelct_flag != "search"){
		  var gridCampInfocolinfo = [ 
				{header : '진행상태', binding: 'STAT_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
				{header : 'MD명', binding: 'MD_NM', align : 'left', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, width: '*',allowMerging : false}, 
		  	{header : '행사기간', binding: 'CAMP_PERIOD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false} 
		  ];

		  
			var gridCampInfoinitinfo = {
				autoGenerateColumns: false,
				columns: gridCampInfocolinfo,
				formatItem: function (s, e) {//grid 셀에 이미지 태그 추가 
				  //헤더 색깔구분
		    	if(e.panel.cellType == wijmo.grid.CellType.ColumnHeader){
		    			wijmo.addClass(e.cell, 'head_bg');	
		    	}
				}
			};
			
			ctlInst = new oz_grid('#event_list');
			ozgrid_instMgr.add(ctlInst);
			ctlInst.initialize(gridCampInfoinitinfo);
			//ctlInst.selectionHeader = '선택';
			ctlInst.disableAllChecked = false;
			ctlInst.dateDelimiter = '';
			ctlInst.delimiter = ';';
			ctlInst.exportDelimiter = ';';
			ctlInst.showRadioButton = false;
			ctlInst.indexColumnVisible = true;
			ctlInst.selectionMode = wijmo.grid.SelectionMode.None;
			//ctlInst.addEventListener("onClick",noticeDetail);//Click 이벤트 
			ctlInst.applySettings();
			ozController.registerControl(ctlInst, 'grd_list', true, true);
		}
	  
	  getCtl('grd_list').setItemsSource(listTmResult_json);
}

</script>