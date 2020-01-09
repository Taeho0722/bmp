<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">

//오늘 날짜 셋팅
var today = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date();//today의 Date를 세어주는 역할

var now_year = today.getFullYear();
var now_month = today.getMonth()+1;
var now_date = today.getDate();

var ozController;

//화면 로드 시 실행
$(document).ready(function() {
	screenLog("조회", "web_brandnotice_sub", "공지사항",get_client_ip);//화면 로그(공통)
	
	ozController = new oz_frame();//ozController 정의
	ozController.Ctllist.push(new oz_ItemValue('com.obzen.bmp.DocBMPBoard', 'grd_notice'));//그리드 아이디 정의
	ozController.Ctllist.push(new oz_ItemValue('com.obzen.bmp.ColDwCamp', 'grd_rank'));
	
	selectStoreCd();//지점명 select box
	
	if(webSysDivFlag == "1.1"){ //브랜드-매장사용자 : 세션정보 점포코드
		$("#sel_store_cd").val(store_cd).attr("selected","selected");	
		$("#sel_store_cd").attr("disabled",true);
		$("#sel_store_cd").addClass("disabled");
	} else if(webSysDivFlag == "1.2"){ //브랜드-본사사용자 : 세션정보md에 해당하는 첫번째 점포코드 
		$("#sel_store_cd option:eq(1)").attr("selected","selected");
	}
	
	store_cd = $("#sel_store_cd option:selected").val();
	calendarDesign(now_year,now_month);
	storeNote();
	notice("select");
	salesBillboard("select");
	
	
	
	//지점 변경 시 
	$("#sel_store_cd").change(function(){
		store_cd = $("#sel_store_cd option:selected").val();
		
		var sel_year = $("#sel_year").val();
		var sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
		notice("search");
		salesBillboard("search");
		
	});
	
	
	//년도 변경 시  
	$("#sel_year").change(function(){
		store_cd = $("#sel_store_cd option:selected").val();
		
		var sel_year = $("#sel_year").val();
		var sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
		storeNote();
	});
	
	
	//월 변경 시 
	$("#sel_month").change(function(){
		store_cd = $("#sel_store_cd option:selected").val();
		
		var sel_year = $("#sel_year").val();
		var sel_month = $("#sel_month").val();
		
		calendarDesign(sel_year,sel_month);
		storeNote();
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
 * 안내 동영상 버튼 클릭
 ========================================================================================*/
function useVideoInfo(){

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
		  
		  if(note_ttl_list[j] != "" && note_ttl_list[j].length > 7){
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
	
  var frm = $("form#frmStore")[0];
  frm.store_cd.value = val;
  frm.stnd_ym.value = sel_year+sel_month;
  
  //var ret = window.open(url, name, option);
  var ret = window.open("web_brandnotice_sub_pop.jsp", name, option);
  
  
  /*
  //post 방식
  var frm = $("form#frmStore")[0];
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
* 공지사항
========================================================================================*/
var board_id = "";
var listTmResult_json = "";
function notice(selelct_flag){

	var listTm = new oza_TMHandler('com.obzen.bmp.ColBMPBoard', 'selectBoardList', '0', '\@#%');
  listTm.setAddDataField('STORE_CD', store_cd);
  listTm.execute(null, false);
	var listTmResult = listTm.getResult();
  if(listTmResult != ""){listTmResult_json = JSON.parse(listTmResult);}
  listTm.clear();
	
  if(selelct_flag != "search"){
	  var gridCampInfocolinfo = [ 
			{header : '점포', binding: 'STORE_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
			{header : '제목', binding: 'BOARD_TTL', align : 'left', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, width: '*',allowMerging : false}, 
	  	{header : '작성자', binding: 'CRAT_EMP_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
	  	{header : '등록일자', binding: 'CRAT_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd',visible : true,  allowMerging : false},
	  	{header : '점포코드', binding: 'STORE_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : '', visible : false, allowMerging : false},
	  	{header : '공지사항ID', binding: 'BOARD_ID', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : '', visible : false,allowMerging : false}
		];

	  
		var gridCampInfoinitinfo = {
			autoGenerateColumns: false,
			columns: gridCampInfocolinfo,
			formatItem: function (s, e) {//grid 셀에 이미지 태그 추가 
			  //헤더 색깔구분
	    	if(e.panel.cellType == wijmo.grid.CellType.ColumnHeader){
	    			wijmo.addClass(e.cell, 'head_bg');	
	    	}else{
	    		wijmo.setCss(e.cell, {cursor:'pointer'});
	    	}
			}
		};
		
		ctlInst = new oz_grid('#notice_list');
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
		ctlInst.addEventListener("onClick",noticeDetail);//Click 이벤트 
		ctlInst.applySettings();
		ozController.registerControl(ctlInst, 'grd_notice', true, true);
	}
  
  getCtl('grd_notice').setItemsSource(listTmResult_json);
}





/**========================================================================================
* ozController 컨트롤 가져오기
========================================================================================*/
function getCtl(id) {
	return ozController.getControl(id);
}

/**========================================================================================
* 공지사항 상세보기
========================================================================================*/
var det_store_cd = "";
var det_store_nm = "";
var det_board_ttl = "";
var det_board_cont = "";
var det_crat_emp_nm = "";
var det_crat_dt = "";

function noticeDetail(){
	board_id = getCtl('grd_notice').getDataSourceValue('BOARD_ID');
	
	var boardInfoTm = new oza_TMHandler('com.obzen.bmp.DocBMPBoard', 'selectBoardInfo', '1', '\@#%');
	boardInfoTm.setAddDataField('BOARD_ID', board_id);
	boardInfoTm.returnlist('STORE_CD'+
	                  		 ';STORE_NM'+
	                  		 ';BOARD_TTL'+
	                  		 ';BOARD_CONT'+
	                  		 ';CRAT_EMP_NM'+
	                  		 ';CRAT_DT');
	boardInfoTm.execute(null, false);
	det_store_cd = boardInfoTm.ElementValue('STORE_CD');
	det_store_nm = boardInfoTm.ElementValue('STORE_NM');
	det_board_ttl = boardInfoTm.ElementValue('BOARD_TTL');
	det_board_cont = boardInfoTm.ElementValue('BOARD_CONT');
	det_crat_emp_nm = boardInfoTm.ElementValue('CRAT_EMP_NM');
	det_crat_dt = boardInfoTm.ElementValue('CRAT_DT');
	boardInfoTm.clear();
	
	$("#det_store_nm").text(det_store_nm);
	$("#det_board_ttl").text(det_board_ttl);
	$("#det_crat_emp_nm").text(det_crat_emp_nm);
	$("#det_crat_dt").text(setValidDate(det_crat_dt));
	$("#det_board_cont").html(det_board_cont.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
	
	layerPopOpen("layer_noticeDetail");
}



/**========================================================================================
* 행사매출 빌보드
========================================================================================*/
var listTm2Result_json = ""; 
function salesBillboard(selelct_flag){

	var listTm2 = new oza_TMHandler('com.obzen.bmp.ColDwCamp', 'selectBillboard', '0', '\@#%');
	listTm2.setAddDataField('STORE_CD', store_cd);
  listTm2.execute(null, false);
	var listTm2Result = listTm2.getResult();
  if(listTm2Result != ""){listTm2Result_json = JSON.parse(listTm2Result);}
  listTm2.clear();
	
  if(selelct_flag != "search"){
	  var gridCampInfocolinfo = [ 
			{header : '순위', binding: 'ROW_NO', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
			{header : 'MD', binding: 'MD_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
	  	{header : '행사명', binding: 'CAMP_NM', align : 'left', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false} 
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
		
		ctlInst = new oz_grid('#rank_list');
		ozgrid_instMgr.add(ctlInst);
		ctlInst.initialize(gridCampInfoinitinfo);
		ctlInst.disableAllChecked = false;
		ctlInst.dateDelimiter = '';
		ctlInst.delimiter = ';';
		ctlInst.exportDelimiter = ';';
		ctlInst.showRadioButton = false;
		ctlInst.indexColumnVisible = true;
		ctlInst.selectionMode = wijmo.grid.SelectionMode.None;
		ctlInst.applySettings();  
		ozController.registerControl(ctlInst, 'grd_rank', true, true);
  }
  
	getCtl('grd_rank').setItemsSource(listTm2Result_json);
}


/*===============================================================
팝업 Open
===============================================================*/
function layerPopOpen(popupN){
	
	var $layer = $("#"+ popupN);
	
	$layer.css("position", "absolute");

  $layer.css("top",(($(window).height() - $layer.outerHeight()) / 2) + $(window).scrollTop());
  $layer.css("left",(($(window).width() - $layer.outerWidth()) / 2) + $(window).scrollLeft());
  $layer.draggable();
  $layer.show();
}


/*===============================================================
팝업 Close
===============================================================*/
function popupClose(popupN) {
	var $layer = $("#"+ popupN);
  $layer.hide();
}
</script>
<div class="notice_wrap">
  <div class="notice_top clear">
    <div class="calendar_wrap f_l">
      <p class="tit">카드사&amp;행사 캘린더</p>
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
      <!-- a href="javascript:useVideoInfo();" class="btn_video">사용자 메뉴얼 보기</a -->
      <div class="event_list">
        <p class="tit">점포별 특이사항</p>
        <ul id="store">
        </ul>
      </div>
    </div>
  </div>
  <div class="notice_btm clear">
    <div class="notice_cnt f_l">
      <p class="tit">공지사항</p>
      <div class="notice_list" id="notice_list">
      </div>
    </div>
    <div class="md_rank f_l">
      <p class="tit">행사매출 빌보드</p>
      <div class="rank_list" id="rank_list">
      </div>
    </div>
  </div>
</div>

<!-- 공지사항 상세보기 -->
<div id="layer_noticeDetail" class="layer">
  <p class="tit">공지사항 상세보기<a href="javascript:popupClose('layer_noticeDetail');" class="btn_close">닫기</a></p>
  <div class="detail_cnt">
  <ul>
    <li class="wd30">
      <span>점포</span>
      <p id="det_store_nm"></p>
    </li>
    <li class="wd30">
      <span>작성일</span>
      <p id="det_crat_dt"></p>
    </li>
    <li class="wd30">
      <span>작성자</span>
      <p id="det_crat_emp_nm"></p>
    </li>
    <li>
      <span>제목</span>
      <p id="det_board_ttl"></p>
    </li>
    <li class="bor0">
      <span>내용</span>
      <div id="det_board_cont"></div>
    </li>
  </ul>
  </div>
  <div class="pop_btn">
    <a href="javascript:popupClose('layer_noticeDetail');" class="btn_cancel">닫기</a>
  </div>
</div>
<!-- 공지사항 상세보기 -->

<form id="frmStore" method="post" >
<input type="hidden" id="store_cd" name="store_cd"/>
<input type="hidden" id="stnd_ym" name="stnd_ym"/>
</form>