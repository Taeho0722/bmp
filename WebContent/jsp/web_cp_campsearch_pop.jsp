<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>캠페인 검색</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->  
<%
String r_flag = XSScheck(request.getParameter("r_flag"));
String r_camp_id = XSScheck(request.getParameter("r_camp_id"));
String r_camp_stat = XSScheck(request.getParameter("r_camp_stat"));
String r_bmpevtTy_cd = XSScheck(request.getParameter("r_bmpevtTy_cd"));
String shn_crd_evt_yn = XSScheck(request.getParameter("shn_crd_evt_yn"));
if("".equals(shn_crd_evt_yn)){shn_crd_evt_yn = "N";}
%>



<script type="text/javascript">

 var user_id = "";
 var md_cd = "";
 var store_cd = "";
 var shn_crd_evt_yn = "";
 
 //복사하기 전용 변수
 var r_flag = "";
 var r_camp_id = "";
 var r_camp_stat = "";
 var r_bmpevtTy_cd = "";
 
 var camp_id = "";
 var mod_yn = "";
 var reg_id = "";
 
//화면 로드 시 실행
 $(document).ready(function() {
	 user_id = sessionStorage.getItem("USERID");
	 md_cd = sessionStorage.getItem("MD_CD");
	 store_cd = sessionStorage.getItem("STORE_CD");
	 
	 //shn_crd_evt_yn = "<%=shn_crd_evt_yn%>";
	 //r_flag = "<%=r_flag%>";
	 //r_camp_id = "<%=r_camp_id%>";
	 //r_camp_stat = "<%=r_camp_stat%>";
	 //r_bmpevtTy_cd = "<%=r_bmpevtTy_cd%>";
	 
	 r_flag = $(opener.document).find("#r_flag").val();
	 r_camp_id = $(opener.document).find("#r_camp_id").val();
	 r_camp_stat = $(opener.document).find("#r_camp_stat").val();
	 r_bmpevtTy_cd = $(opener.document).find("#r_bmpevtTy_cd").val();
	 shn_crd_evt_yn = $(opener.document).find("#shn_crd_evt_yn").val();
	 
	
	 searchGrid();//검색 목록 조회 및 그리드 생성
	 screenLog("조회", "web_cp_campsearch", "캠페인 검색",get_client_ip);//화면 로그(공통)
	 
	 
	 //복사하기 버튼 컨트롤
	 //행사유형 페이지에서 호출 할 것
	 //캠페인 ID 존재 할 것
	 //행사유형 존재 할 것
	 //캠페인진행상태는 0000
	 if(r_flag == "2" && r_camp_stat == "0000" && r_bmpevtTy_cd != "" && r_camp_id != ""){
		 $(".btn_copy").css("display","");
	 }else{
		 $(".btn_copy").css("display","none");
	 }
	 
 });
 
 
 
 
 /*=======================================================
 그리드
 =======================================================*/
 function searchGrid() {
	var tmList = new oza_TMHandler('com.obzen.bmp.ColCampSearch', 'selectCampSearch', '0', '\@#%');
    tmList.setAddDataField('MD_CD', md_cd);
    tmList.setAddDataField('TGET_STORE_CD', store_cd);
    tmList.setAddDataField('SHN_CRD_EVT_YN', shn_crd_evt_yn);
    tmList.execute(null, false); //  tm 실행
    var tmResult = tmList.getResult(); //  컬렉션 TM 결과 호출
    var tmResult_json = JSON.parse(tmResult); //  자바스크립트 객체로 변환
    tmList.clear();
    
    //Initialize grid
	var gridCampInfocolinfo = [ 
		{header : '점포명', binding: 'STORE_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
		{header : '행사ID', binding: 'CAMP_ID', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : '행사명', binding: 'CAMP_NM', align : 'left', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : '행사시작일자', binding: 'EVR_STR_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd', visible : true, width: '*', allowMerging : false}, 
  	{header : '행사종료일자', binding: 'EVR_END_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd', visible : true, width: '*', allowMerging : false},
  	{header : '진행상태', binding: 'CAMP_STAT_NM', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false}, 
  	{header : '등록자', binding: 'CAMP_DRFT_EMP', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.String, format : '', visible : true, allowMerging : false},
  	{header : '등록일자', binding: 'CAMP_DRFT_DT', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : 'yyyy-MM-dd', visible : true, width: '*', allowMerging : false},
  	{header : '수정여부', binding: 'MOD_YN', align : 'center', name : '', isReadOnly : true, dataType : wijmo.DataType.Date, format : '', visible : false, width: '*', allowMerging : false}
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
 }
 
 
 /**========================================================================================
  * 검색(선택)
  ========================================================================================*/
 function selectCampain() {
	 camp_id = ctlInst.getDataSourceValue('CAMP_ID');
	 
	 if(camp_id == ""){
		 cmdMessage(0,"행사를 선택하세요.");
		 return;
	 }
	 
    var pageParam = new Array(); //Parameters
		pageParam.push(new oz_para('in', 'CAMP_ID', ctlInst.getDataSourceValue('CAMP_ID'), ''));
		pageParam.push(new oz_para('in', 'COPY_YN', 'N', ''));
	 
		window.opener.getReturnValue(pageParam);
		pageParam = null;
	
		popupClose();
}

 
 
 /**========================================================================================
  * 삭제(선택)
  ========================================================================================*/
 function deleteCampain() {
   
	 camp_id = ctlInst.getDataSourceValue('CAMP_ID');
	 mod_yn = ctlInst.getDataSourceValue('MOD_YN'); 
	 reg_id = ctlInst.getDataSourceValue('CAMP_DRFT_EMP');
	 
	 if(camp_id == ""){
		 cmdMessage(0,"행사를 선택하세요.");
		 return;
	 }
	 
	 if(mod_yn === "Y"){
		
		if(user_id != reg_id){cmdMessage(0,"삭제 권한이 없습니다."); return;} 
		 
		if(cmdMessage(1, "선택한 행사를 삭제 하시겠습니까?") == false){
			return;
		}
		
		var deleteBMPTM = new oza_TMHandler('com.obzen.bmp.DocCampaign', 'deleteBMPCamp', '1', '\@#%');
    deleteBMPTM.setAddDataField('CAMP_ID', camp_id);
    deleteBMPTM.execute(null, false);
    deleteBMPTM.returnlist('LOGMSG');
    deleteBMPTM.execute(null, false);
		var msg = deleteBMPTM.ElementValue('LOGMSG');//리턴 처리 메시지
		deleteBMPTM.clear();    
		cmdMessage(0,msg);
		
	 }else{
		cmdMessage(0,"작성 중 인 행사만 삭제 가능 합니다.");
		return;
	 }
	 
	 window.opener.getReturnValue("");
	 popupClose();
}
 
 
 
 /**========================================================================================
  * 복사하기
  ========================================================================================*/
 function copyCampain() {
	 
	 camp_id = ctlInst.getDataSourceValue('CAMP_ID');
	 
	 if(camp_id == ""){
		 cmdMessage(0,"행사를 선택하세요.");
		 return;
	 }
	 
   if(cmdMessage(1, "선택한 행사 정보를 복사 하시겠습니까?\n기존 선택, 입력된 정보가 변경 됩니다.\n\n(Step1에 해당하는 행사정보를 복사합니다.)") == false){
		return;
	 }
  
  var pageParam = new Array(); //Parameters
	pageParam.push(new oz_para('in', 'CAMP_ID', camp_id, ''));
	pageParam.push(new oz_para('in', 'COPY_YN', 'Y', ''));

	window.opener.getReturnValue(pageParam);
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
 
 </script>
  
 </head>

 <body onbeforeunload="javascript:popupClose();">
   <div id="search_popup" class="layer_window">
    <p class="tit">작성 중인 행사 선택<a href="javascript:popupClose();" class="btn_close">닫기</a></p>
    <div class="search_grid">
      <div class="grid_area" id='divgridCampInfo'>
      </div>
    </div>
    <div class="pop_btn">
      <a href="javascript:copyCampain();" class="btn_copy">복사하기</a>
      <a href="javascript:selectCampain();" class="btn_submit">선택</a>
      <a href="javascript:popupClose();" class="btn_cancel">닫기</a>
      <a href="javascript:deleteCampain();" class="btn_delete">삭제</a>
    </div>
  </div>
</body>
</html>
