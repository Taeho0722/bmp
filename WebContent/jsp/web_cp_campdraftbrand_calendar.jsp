<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<title>카드행사 캘린더</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
<%
String store_cd = XSScheck(request.getParameter("store_cd"));
String md_cd = XSScheck(request.getParameter("md_cd"));
String user_id = XSScheck(request.getParameter("user_id"));
%>


<script type="text/javascript">
//오늘 날짜 셋팅
var today = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date();//today의 Date를 세어주는 역할
 
var now_year = today.getFullYear();
var now_month = today.getMonth()+1;
if(now_month.toString().length == 1) {
	now_month = '0'+now_month;
}
var now_date = today.getDate();

var store_cd = "";
var md_cd = "";
var user_id = "";


//화면 로드 시 실행
$(document).ready(function() {
	screenLog("조회", "web_cp_campdraftbrand_calendar", "카드사행사 달력",get_client_ip);//화면 로그(공통)
	
	//md_cd = "<%=md_cd%>";
	//user_id = "<%=user_id%>";
	//store_cd = "<%=store_cd%>";
	
	md_cd = $(opener.document).find("#md_cd").val();
	user_id = $(opener.document).find("#user_id").val();
	store_cd = $(opener.document).find("#store_cd").val();
	
	selectStoreCd();
	$("#sel_store_cd option:eq(1)").attr("selected","selected");
	calendarDesign(now_year,now_month);
	storeNote();
	 
	//지점 변경 시 
	$("#sel_store_cd").change(function(){
		store_cd = $("#sel_store_cd option:selected").val();
		
		var sel_year = $("#sel_year").val();
		var sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
	});
	
	
	//년도 변경 시  
	$("#sel_year").change(function(){
		store_cd = $("#sel_store_cd option:selected").val();
		
		var sel_year = $("#sel_year").val();
		var sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
	});
	
	
	//월 변경 시 
	$("#sel_month").change(function(){
		store_cd = $("#sel_store_cd option:selected").val();
		
		var sel_year = $("#sel_year").val();
		var sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
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
		 
		 if(j < 10){selectMonthHtml += "<option value='0"+j+"' "+monthSelect+">"+j+"월</option>";}
		 else{selectMonthHtml += "<option value='"+j+"' "+monthSelect+">"+j+"월</option>";}
		 
		 monthCnt++;
	 }
	 $(".sel_month").html(selectMonthHtml);
	  
	 
}


/*===============================================================
년월 변경 시
===============================================================*/
function selectChange(){
   var sel_year = $("#sel_year").val();
   var sel_month = $("#sel_month").val();
   
 	 //달력 그리기
   calendarDesign(sel_year,sel_month);
}


/**========================================================================================
* 점포코드 selectbox 조회
* TM을 호출하여 점포코드 조회
========================================================================================*/
function selectStoreCd(){
	var innerHtml = "";
	var storeTm = new oza_TMHandler('com.obzen.bmpanly.ColCommMngCRM', 'selectStoreCd', '0', '\@#%');
	
	storeTm.setAddDataField('MD_CD', md_cd);
	storeTm.setAddDataField('USERID', user_id);
	storeTm.execute(null, false);
	var storeTmResult = storeTm.getResult();
	var storeTmResult_json = "";
	if(storeTmResult != ""){
		storeTmResult_json = JSON.parse(storeTmResult);
	}
	storeTm.clear();
	
	innerHtml += "<option value=''>::점::</option>";
	for(var i=0; i<storeTmResult_json.length; i++) {
		innerHtml += "<option value='"+storeTmResult_json[i].ITEM_CD+"'>"+storeTmResult_json[i].ITEM_NM+"</option>";
	}
	$("#sel_store_cd").html(innerHtml);
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
	  var calTm = new oza_TMHandler('com.obzen.bmp.ColCampReg', 'selectCardEvtCalWeb', '0', '\@#%');
	  calTm.setAddDataField('STORE_CD', store_cd);
	  calTm.setAddDataField('DT', iYear+""+iMonth);
	  calTm.execute(null, false);
	  var calTmResult = calTm.getResult();
	  if(calTmResult != ""){
	  	calTm_json = JSON.parse(calTmResult);
	  }
	  calTm.clear();
	  //캘린더 데이터 조회-------------------------
	  
	
  	myMonth = fBuildCal(iYear, iMonth); 

    selectBox(iYear, iMonth);//년월 select 생성
    
    var calHtml = "";
    
    var i = 0; 
    
    var startYear = "";
    var startMonth = "";
    var startDay = "";
    var endYear = "";
    var endMonth = "";
    var endDay = "";
    var styleBar1 = "";
    var styleBar2 = "";
    var styleBar3 = "";
    var styleBar4 = "";
    var cardName = "";
    var cardCd = "";
    
    var styleTop = "";
    
    
    var cardCnt1 = 0;
    var cardCnt2 = 0;
    var cardCnt3 = 0;
    var cardCnt4 = 0;
    var cardCnt5 = 0;
    var barCnt = 0;
    
    
    var styleTopCard1 = "";
    var styleTopCard2 = "";
    var styleTopCard3 = "";
    var styleTopCard4 = "";
    var styleTopCard5 = "";
    
    var barName1 = "";
    var barName2 = "";
    var barName3 = "";
    var barName4 = "";
        
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
         				
         			startYear 	= calTm_json[j].PAY_STR_DT.substring(0,4);
         			startMonth 	= calTm_json[j].PAY_STR_DT.substring(4,6);
         			startDay 	= calTm_json[j].PAY_STR_DT.substring(6,8);
         			endYear 	= calTm_json[j].PAY_END_DT.substring(0,4);
         			endMonth 	= calTm_json[j].PAY_END_DT.substring(4,6);
         			endDay 		= calTm_json[j].PAY_END_DT.substring(6,8);
         			cardName    = calTm_json[j].PAY_CD_NM;
         			cardCd    	= calTm_json[j].PAY_CD;
         			
         			
							if(parseInt(startYear) == parseInt(iYear) && parseInt(startMonth) == parseInt(iMonth) && (parseInt(startDay) <= parseInt(innerText) )){
         				
								if(cardName != ""){
         					if(cardCd == "05"){barName1 = cardName.substring(3,5);}//시티
             			else if(cardCd == "06"){barName2 = cardName.substring(3,5);}//삼성
             			else if(cardCd == "16"){barName3 = cardName.substring(3,5);}//신한
             			else if(cardCd == "18"){barName4 = cardName.substring(3,5);}//하나
             			else if(cardCd == "99"){barName5 = cardName;}//하나	
         				}
         					
         				if(parseInt(endYear) == parseInt(iYear) && parseInt(endMonth) == parseInt(iMonth) && parseInt(endDay) >= parseInt(innerText) ){
         					if(cardCd == "05"){styleBar1 = "co1";cardCnt1++;}//시티
             			else if(cardCd == "06"){styleBar2 = "co2";cardCnt2++;}//삼성
             			else if(cardCd == "16"){styleBar3 = "co3";cardCnt3++;}//신한
             			else if(cardCd == "18"){styleBar4 = "co4";cardCnt4++;}//하나
             			else if(cardCd == "99"){styleBar5 = "co5";cardCnt5++;}//포인트
             		}
         			}
         		}
         		
         		if(cardCnt1 == 0){styleBar1 = "none";barName1="&nbsp;";}
         		if(cardCnt2 == 0){styleBar2 = "none";barName2="&nbsp;";}
         		if(cardCnt3 == 0){styleBar3 = "none";barName3="&nbsp;";}
         		if(cardCnt4 == 0){styleBar4 = "none";barName4="&nbsp;";}
         		if(cardCnt5 == 0){styleBar5 = "none";barName5="&nbsp;";}
         		
         		calHtml += "<p class=\""+styleBar1+"\">"+barName1 +"</p>";
         		calHtml += "<p class=\""+styleBar2+"\">"+barName2 +"</p>";
         		calHtml += "<p class=\""+styleBar3+"\">"+barName3 +"</p>";
         		calHtml += "<p class=\""+styleBar4+"\">"+barName4 +"</p>";
         		calHtml += "<p class=\""+styleBar5+"\">"+barName5 +"</p>";
         		
         		calHtml += "</td>";
          }
        }
        calHtml += "</tr>";
    }
    
    $("#calendar").html(calHtml);
}


/**========================================================================================
 * 특이사항
 ========================================================================================*/
function storeNote(){

	var storeHtml = "";
  var classType = "";
  var p_id = "";
  var cursorType = "";

  now_year = $("#sel_year option:selected").val();
  now_month = $("#sel_month option:selected").val();
  
  
	//특이사항 목록 조회
  var storeTm = new oza_TMHandler('com.obzen.bmp.ColBMPBoard', 'selectSpecialList', '0', '\@#%');
  storeTm.setAddDataField('STND_YM', now_year+now_month);
  storeTm.execute(null, false);
	var storeTmResult = storeTm.getResult();
  var storeTmResult_json = "";
  if(storeTmResult != ""){storeTm_json = JSON.parse(storeTmResult);}
  storeTm.clear();
  
   
  var note_store_nm = "";
  var note_store_cd = "";
  var note_ttl_list = "";
  var ttl_list = "";
  
  
  for(var i=0; i<storeTm_json.length; i++) {
	  ttl_list = "";
	  note_store_nm = storeTm_json[i].STORE_NM;
	  note_store_cd = storeTm_json[i].STORE_CD;
	  note_ttl_list = storeTm_json[i].TTL_LIST.split('¿');
	  
	  storeHtml += "<li onclick=\"javascript:selectCode('"+note_store_cd+"');\" style='cursor:pointer'>";
	  storeHtml += "<p>"+note_store_nm+"</p>";
	  
	  for(var j=0; j<note_ttl_list.length; j++){
		  if(note_ttl_list[j].length > 7){
			  ttl_list += note_ttl_list[j].substring(0,5)+"..";
		  }else{
			  ttl_list += note_ttl_list[j];
		  }
		  
		  if((j+1) < note_ttl_list.length){ttl_list += "<br>";}
		}
	  
	  storeHtml += "<span>"+ttl_list+"</span>";
		storeHtml += "</li>";
	}
  
  storeHtml += "<li>";
  storeHtml += "<p>추가점포</p>";
  storeHtml += "<span class='none'></span>";
  storeHtml += "</li>";
  
  
  $("#store").html(storeHtml);
}





/*===============================================================
코드 선택
===============================================================*/
function selectCode(val){
	var name = "web_brandnotice_sub_pop";
  var option = "location=no,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no";
  
  //해상도 계산하여 위치 조절
  var popupX = (document.body.offsetWidth / 2) - (200 / 2);
  var popupY = (document.body.offsetHeight / 2) - (300 / 2);
  	 
  option += ",top="+popupY+",left="+popupX+",height=512,width=825";
  
  var sel_year = $("#sel_year").val();
	var sel_month = $("#sel_month").val();
  
	var frm = $("form#frmCal")[0];
	frm.store_cd.value = val;
	frm.stnd_ym.value = sel_year+sel_month;
	
  //var ret = window.open(url, name, option);
  var ret = window.open("web_brandnotice_sub_pop.jsp", name, option);
  
  /*
  //post 방식
  var frm = $("form#frmCal")[0];
  frm.store_cd.value = val;
  frm.stnd_ym.value = sel_year+sel_month;
  frm.action = "web_brandnotice_sub_pop.jsp";
  frm.target = name;
  frm.method = "post";
  frm.submit();
  */
  
  $("#mask").css("display","");//팝업 호출 시 보이게 설정
  
  $('#mask').click(function() {
  		ret.focus();
  });
}

/**========================================================================================
 * 검색(팝업 닫기)
 ========================================================================================*/
function popupClose() {
	 window.opener.popupImageRemove();
	 window.close();
	 
}
</script>
<body onbeforeunload="javascript:popupClose();">
  <div id="layer_calendar2" class="layer_window">
    <p class="tit">카드사 &amp; 행사 캘린더<a href="javascript:popupClose();" class="btn_close">닫기</a></p>
    <div class="lc_wrap">
      <div class="calendar_wrap f_l">
        <div class="date_sel">
          <select id="sel_year" class="sel_year" ></select>
          <select id="sel_month" class="sel_month"></select>
          <select id="sel_store_cd" class="sel_store"></select>
        </div>
        <div class="calendar">
          <table>
            <colgroup>
              <col width="14.28%">
              <col width="14.28%">
              <col width="14.28%">
              <col width="14.28%">
              <col width="14.28%">
              <col width="14.28%">
              <col width="14.28%">
            </colgroup>
            <thead>
              <tr>
                <th class="fc_red">일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th class="fc_blue">토</th>
              </tr>
            </thead>
            <tbody id="calendar"></tbody>
          </table>
        </div>
      </div>
      <div class="event_list_wrap f_l">
        <div class="event_list">
          <p class="tit">점포별 특이사항</p>
          <ul id="store">
          </ul>
        </div>
      </div>
    </div>
    <div class="pop_btn">
      <a href="javascript:popupClose();" class="btn_cancel">닫기</a>
    </div>
  </div>

<form id="frmCal" method="post">
<input type="hidden" id="store_cd" name="store_cd"/>
<input type="hidden" id="stnd_ym" name="stnd_ym"/>
</form>
 </body>
 
 
</html>
