<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<!DOCTYPE html>
<html lang="ko">
 <head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <link rel="stylesheet" href="css/style.css">
  <title>공문 검색</title>
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
<%
String camp_id = XSScheck(request.getParameter("camp_id"));
String user_id = XSScheck(request.getParameter("user_id"));
String intg_bran_cd = XSScheck(request.getParameter("intg_bran_cd"));
String cprn_comp_cd = XSScheck(request.getParameter("cprn_comp_cd"));
%>
 <script type="text/javascript">

 var intg_bran_cd = "";
 var user_id = "";
 var camp_id = "";
 var cprn_comp_cd = "";
 
 
//화면 로드 시 실행
 $(document).ready(function() {
	 
	 screenLog("조회", "web_cp_official_pop", "공문 검색",get_client_ip);//화면 로그(공통)
	 
	 //intg_bran_cd = "<%=intg_bran_cd%>";
	 //user_id = "<%=user_id%>";
	 //camp_id = "<%=camp_id%>";
	 //cprn_comp_cd = "<%=cprn_comp_cd%>";
	 
	 intg_bran_cd = $(opener.document).find("#intg_bran_cd").val();
	 user_id = $(opener.document).find("#user_id").val();
	 camp_id = $(opener.document).find("#camp_id").val();
	 cprn_comp_cd = $(opener.document).find("#cprn_comp_cd").val();
	 
	 
	 dateDesing();
	 
	 $('#camp_str_dt').datepicker('setDate', 'today');
	 $('#camp_end_dt').datepicker('setDate', 'today');
	 //$("#user_id").val(user_id);
	 
	 
	 searchGrid();//검색 목록 조회 및 그리드 생성
	 
	 
	 
	//등록시작일자 
	$("#camp_str_dt").on("propertychange change keyup paste input", function() {
	  	dateCheck('1',$(this).val());
	});
	 
	//등록종료일자
	$("#camp_end_dt").on("propertychange change keyup paste input", function() {
	  	dateCheck('2',$(this).val());
	});
	 
});

/**========================================================================================
* 행사기간 디자인
========================================================================================*/
function dateDesing(){
  //행사기간 선택
  $("#camp_str_dt").datepicker({
  	dateFormat: 'yy-mm-dd' //Input Display Format 변경
         ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
         ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
         ,changeYear: true //콤보박스에서 년 선택 가능
         ,changeMonth: true //콤보박스에서 월 선택 가능                
         ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
         ,buttonImage: "../../img/web/icon/ic_calendar.png" //버튼 이미지 경로
         ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
         ,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 텍스트
         ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
         ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
         ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
    });
  
  
  
  $("#camp_end_dt").datepicker({
  	dateFormat: 'yy-mm-dd' //Input Display Format 변경
         ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
         ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
         ,changeYear: true //콤보박스에서 년 선택 가능
         ,changeMonth: true //콤보박스에서 월 선택 가능                
         ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
         ,buttonImage: "../../img/web/icon/ic_calendar.png" //버튼 이미지 경로
         ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
         ,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 텍스트
         ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
         ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
         ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
    });
}

/*===============================================================
날짜 체크
===============================================================*/
var str_dt = "";
var end_dt = "";

function dateCheck(flag, dateValue){
	  
	  if(dateValue == ""){return;}
	  
	  if(dateValue.length > 7){
		  setValidDate(dateValue);				  
	  }else{
		  return;
	  }
	  
	  if(flag == "1"){str_dt = dateValue;}
	  else if(flag == "2"){end_dt = dateValue;}
	  
	  if(str_dt == "" || end_dt == ""){return;}
	  
	  if(str_dt != ""){str_dt = sDelHypn(str_dt);}
	  if(end_dt != ""){end_dt = sDelHypn(end_dt);}
	  
	  var calDate = getCalDate(str_dt,end_dt ,"D");//시작일 보다 종료일이 작지 않도록 체크
	  
	  if(calDate < 1){
		  cmdMessage(0,"행사 기간을 확인 하세요.");
			//오늘 날짜 설정
			$('#camp_str_dt').datepicker('setDate', 'today');
			$('#camp_end_dt').datepicker('setDate', 'today');
		  str_dt = "";end_dt = "";
		  
		  $("#camp_str_dt").focus();
		  return;
	  }
} 
 
/*=======================================================
그리드
=======================================================*/
var tmResult_json = "";
function searchGrid() {
	
  var tmList = new oza_TMHandler('com.obzen.bmp.ColOfldcInfo', 'selectOfldcList', '0', '\@#%');
  tmList.setAddDataField('INTG_BRAN_CD', intg_bran_cd);
  tmList.setAddDataField('START_DT', sDelHypn($("#camp_str_dt").val()));
  tmList.setAddDataField('END_DT', sDelHypn($("#camp_end_dt").val()));
  tmList.setAddDataField('CRAT_EMP', $("#user_id").val());
  tmList.setAddDataField('CPRN_COMP_CD', cprn_comp_cd);
  tmList.execute(null, false);
  var tmResult = tmList.getResult();
  if(tmResult != ""){tmResult_json = JSON.parse(tmResult);}
  tmList.clear();
    
    //Initialize grid
  var gridCampInfocolinfo = [ 
  	{header : '문서번호', binding: 'DOC_NO', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : '문서종류', binding: 'DOC_KIND', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : '문서제목', binding: 'OFLDC_TITL', align : 'left', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '협력업체', binding: 'CORP_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : 'OFLDC_CN', binding: 'OFLDC_CN', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false},
  	{header : '사업자번호', binding: 'BIZ_NO', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '통합브랜드코드', binding: 'INTG_BRAN_CD', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false},
  	{header : '통합브랜드', binding: 'INTG_BRAN_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '법인구분', binding: 'CORP_CLS', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '대상점포', binding: 'STORE_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '등록자', binding: 'REGR_ID', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '등록일시', binding: 'REG_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd', visible : true, allowMerging : false},
  	{header : '진행상태', binding: 'PROG_STAT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : 'FILE_NM', binding: 'FILE_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false},
  	{header : 'FILE_CRS', binding: 'FILE_CRS', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : false, allowMerging : false}
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
  
  ctlInst = new oz_grid('#divgridCampInfo');
  ozgrid_instMgr.add(ctlInst);
  ctlInst.initialize(gridCampInfoinitinfo);
  ctlInst.selectionHeader = '선택';
  ctlInst.disableAllChecked = false;
  ctlInst.dateDelimiter = '';
  ctlInst.delimiter = ';';
  ctlInst.exportDelimiter = ';';
  ctlInst.showRadioButton = true;
  ctlInst.indexColumnVisible = true;
  ctlInst.selectionMode = wijmo.grid.SelectionMode.Row;
  ctlInst.applySettings();
  ctlInst.setItemsSource(tmResult_json);
  //그리드 End-------------------------------------------------------------------------------------------------
  
  
  //조회 클릭 시
  $('#search_grid').click(function() {
	  var str_dt_value = "";
    var end_dt_value = ""; 
    var reg_id_value = "";
    var str_dt_old = "";
    var end_dt_old = "";
    var reg_id_old = "";
    
    str_dt_value = $("#camp_str_dt").val();
    end_dt_value = $("#camp_end_dt").val();
 
    var tmList = new oza_TMHandler('com.obzen.bmp.ColOfldcInfo', 'selectOfldcList', '0', '\@#%');
    tmList.setAddDataField('INTG_BRAN_CD', intg_bran_cd);
    tmList.setAddDataField('START_DT', sDelHypn($("#camp_str_dt").val()));
    tmList.setAddDataField('END_DT', sDelHypn($("#camp_end_dt").val()));
    tmList.setAddDataField('CRAT_EMP', $("#user_id").val());
    tmList.setAddDataField('CPRN_COMP_CD', cprn_comp_cd);
    tmList.execute(null, false);
    var tmResult = tmList.getResult();
    if(tmResult != ""){tmResult_json = JSON.parse(tmResult);}
    tmList.clear();
    
    ctlInst.setItemsSource(tmResult_json);//data 재 설정
  });
}
 
 

 /**========================================================================================
 * 선택
 ========================================================================================*/
 function selectCampain() {
 	
 	if(cmdMessage(1, "공문을 등록 하시겠습니까?") == false){
 	  	return;
 	}

	//공문 저장
	var insertOfldcTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'insertOfldc', '1', '\@#%');
	insertOfldcTm.setAddDataField('CAMP_ID', camp_id);
	insertOfldcTm.setAddDataField('OFLDC_DOC_NO1', ctlInst.getDataSourceValue('DOC_NO').substring(0,8));
	insertOfldcTm.setAddDataField('OFLDC_DOC_NO2', ctlInst.getDataSourceValue('DOC_NO').substring(8));
	insertOfldcTm.setAddDataField('OFLDC_TITL', ctlInst.getDataSourceValue('OFLDC_TITL'));
	insertOfldcTm.setAddDataField('OFLDC_CN', ctlInst.getDataSourceValue('OFLDC_CN'));
	insertOfldcTm.setAddDataField('INTG_BRAN_CD', ctlInst.getDataSourceValue('INTG_BRAN_CD'));
	insertOfldcTm.setAddDataField('INTG_BRAN_NM', ctlInst.getDataSourceValue('INTG_BRAN_NM'));
	insertOfldcTm.setAddDataField('OFLDC_REGR_ID', ctlInst.getDataSourceValue('REGR_ID'));
	insertOfldcTm.setAddDataField('OFLDC_REG_DT', ctlInst.getDataSourceValue('REG_DT'));
	insertOfldcTm.setAddDataField('FILE_NM', ctlInst.getDataSourceValue('FILE_NM'));
	insertOfldcTm.setAddDataField('OORG_FILE_PATH', ctlInst.getDataSourceValue('FILE_CRS'));
	insertOfldcTm.setAddDataField('USER_ID', user_id);
	insertOfldcTm.execute(null, false);
	insertOfldcTm.clear();


	var pageParam = new Array(); //Parameters
	pageParam.push(new oz_para('in', 'OFLDC_TITL', ctlInst.getDataSourceValue('OFLDC_TITL'), ''));
	window.opener.officialReturn(pageParam);
	pageParam = null;
	
 	
 	popupClose();
 }  
 

 
 
/**========================================================================================
* 검색(팝업 닫기)
========================================================================================*/
function popupClose() {
	 window.opener.popupImageRemove();
	 window.close();
}





/**========================================================================================
* 검색
========================================================================================*/
function search() {
	searchList();//검색 목록 조회 및 그리드 생성
}


</script>
</head>
<body onbeforeunload="javascript:popupClose();">
   <div id="search_popup" class="layer_window">
    <p class="tit">공문 검색<a href="javascript:popupClose();" class="btn_close">닫기</a></p>
    
    <!-- 검색 시작 -->
    <div class="search_top">
      <ul>
        <li>
          <label for="">등록일자</label>
          <input type="text" id="camp_str_dt"> ~ <input type="text" id="camp_end_dt">
        </li>
        <li>
          <label for="">등록자</label>
          <input type="text" class="ta_c" id="user_id">
        </li>
      </ul>
      <p id="search_grid" style="cursor:pointer;">조회</p>
    </div>
    <!-- 검색 종료 -->
    
    
    <!-- 그리드 목록 시작 -->
    <div class="search_grid">
      <div class="grid_area2" id='divgridCampInfo'>
      </div>
    </div>
    <!-- 그리드 목록 종료 -->
    
    
    <div class="pop_btn">
      <a href="javascript:selectCampain();" class="btn_submit">선택</a>
      <a href="javascript:popupClose();" class="btn_cancel">닫기</a>
    </div>
  </div>
</body>
</html>
