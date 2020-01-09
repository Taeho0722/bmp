<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<script type="text/javascript">

//TM Start ===============================================================================================
	
//MD명 조회	
var md_nm = "";

var mdNmTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectMdNm', '1', '\@#%');
mdNmTm.setAddDataField('MD_CD', md_cd);
mdNmTm.setAddDataField('CPRN_COMP_CD', cprn_comp_cd);
mdNmTm.returnlist('MD_NM');
mdNmTm.execute(null, false);
md_nm = mdNmTm.ElementValue('MD_NM');
mdNmTm.clear();	



//MD별 점포 조회-------------------------
var sel_store_cd = "";
var sel_store_nm = "";

var storeTm = new oza_TMHandler('com.obzen.bmp.ColBMPComm', 'selectStoreMD', '0', '\@#%');
storeTm.setAddDataField('MD_CD', md_cd);
storeTm.setAddDataField('USERID', user_id);
storeTm.execute(null, false);
var storeTmResult = storeTm.getResult();
var storeTm_json = ""; 
if(storeTmResult != ""){storeTm_json = JSON.parse(storeTmResult);}
storeTm.clear();

	
var crtfc_num = "";


//TM End =================================================================================================	


	
//화면 로드 시 실행
$(document).ready(function() {
	screenLog("조회", "web_cp_verificationcode_sub", "행사등록하기>인증번호 관리",get_client_ip);//화면 로그(공통)
  
	//점포 목록 그리기
	storeList();
	
	//태그 값 설정
	$("#md_nm").text(md_nm);
	$("#md_cd").text(md_cd);
	$("#sel_store").val(store_cd).attr("selected","selected");
	
	if(store_cd != ""){storeChange();}//점포 코드 존재 시 자동으로 점포에 맞는 인증번호 조회
	
	//점포 변경 시 이벤트
	$("#sel_store").change(function(){
		work_flag = "Y";
		storeChange();
	});
	
	
	//신규 인증번호 
	$("#mod_crtfc_num").on("propertychange change keyup paste input", function() {
		inputCheck('6',  $(this).val(), 'mod_crtfc_num');
	});
	
});	



/*===============================================================
* 점포목록
===============================================================*/
function storeList(){
  
  var storeHtml = "";
  
  var cdm_cd = "";
  var cdm_nm = "";
  
  storeHtml += "<option value=''>::선택::</option>";
  
  for(var i=0; i<storeTm_json.length; i++) {
	  cdm_cd = storeTm_json[i].CDM_CD;
	  cdm_nm = storeTm_json[i].CDM_CD_NM;
	  
	  if(i == 0){store_cd = cdm_cd;}
	  
	  storeHtml += "<option value='"+cdm_cd+"'>"+cdm_nm+"</option>";
	}
  $("#sel_store").html(storeHtml);
}



/*===============================================================
* 점포 변경 이벤트
===============================================================*/
function storeChange(){
  sel_store_cd = $("#sel_store option:selected").val();
	
	//인증번호 조회
	var ctrfcNumTm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'selectCrtfcNumAdmin', '1', '\@#%');
	ctrfcNumTm.setAddDataField('MD_CD', md_cd);
	ctrfcNumTm.setAddDataField('STORE_CD', sel_store_cd);
	ctrfcNumTm.returnlist('CRTFC_NUM');
	ctrfcNumTm.execute(null, false);
	crtfc_num = ctrfcNumTm.ElementValue('CRTFC_NUM');
	ctrfcNumTm.clear();
	
	$("#crtfc_num").val(crtfc_num);
}



/*===============================================================
* 입력값 체크 
===============================================================*/
function inputCheck(byte_value, input_value, input_id){
  input_value = $.trim(input_value);
  byte_value = parseInt(byte_value);
  
  work_flag = "Y";
  
  //입력 Byte 체크
  if(byte_value < getByteLength(input_value)){ 
 		cmdMessage(0,"최대 "+byte_value+"Bytes를 넘을 수 없습니다.");
 		$("#"+input_id).val(getByteVal(input_value,byte_value));
 		$("#"+input_id).focus();
 		return false; 
 	}
  
  //숫자 입력 체크
  if(isNumber(input_value) == false){
	 	cmdMessage(0, "숫자만 입력하세요.");
	 	$("#"+input_id).val("");
	 	$("#"+input_id).focus();
		return;
	}

  
  //신규 인증번호와 기존 인증번호 비교 체크
  if(input_id == "mod_crtfc_num"){
	  if($.trim($("#mod_crtfc_num").val()) == $.trim($("#crtfc_num").val())){
		  cmdMessage(0,"기존 인증번호와 동일합니다.");
		  $("#"+input_id).val("");
		  $("#"+input_id).focus();
		  return;
		}
	}
  
  
  $("#"+input_id).val(input_value);
}
  


/**========================================================================================
* 변경
========================================================================================*/ 
var crtfc_num = "";
var mod_crtfc_num = "";

function codeUpdate() {
	mod_crtfc_num = $.trim($("#mod_crtfc_num").val()); 
	
	if(sel_store_cd == ""){cmdMessage(3, "점포"); $("#sel_store").focus();return;}
	if(mod_crtfc_num == ""){cmdMessage(2, "신규 인증번호"); $("#mod_crtfc_num").focus();return;}
	
	
	//입력 길이 체크
  if(6 != getByteLength(mod_crtfc_num)){ 
 		cmdMessage(0,"6자리로 입력하세요.");
 		$("#mod_crtfc_num").val(getByteVal(mod_crtfc_num,6));
 		$("#mod_crtfc_num").focus();
 		return;
 	}
	
	
	
	lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
	
	//insert TM 호출
	var insertTm = new oza_TMHandler('com.obzen.bmp.DocCampOfferSel', 'insertCrtfcNum', '1', '\@#%');
	insertTm.setAddDataField('MD_CD', md_cd);
	insertTm.setAddDataField('STORE_CD', sel_store_cd);
	insertTm.setAddDataField('MOD_CRTFC_NUM', mod_crtfc_num);
	insertTm.setAddDataField('USERID', user_id);
	insertTm.returnlist('LOGMSG');
	insertTm.execute(null, false);
	var msg = insertTm.ElementValue('LOGMSG');//리턴 처리 메시지
	insertTm.clear();
	
	screenLog("등록", "web_cp_verificationcode_sub", "행사등록하기>인증번호 관리",get_client_ip);//화면 로그(공통)
	cmdMessage(0,msg);
	
	
	//화면 reload
	store_cd = sel_store_cd;
	do_RefreshPage("update");
}
</script>
<div class="certify_wrap">
  <div class="certify_cnt">
    <p class="tit">인증번호 관리<span> * 인증번호 변경 규칙 : 숫자 6자리 (기존 인증번호 사용 불가)</span></p>
    <div class="certify_input">
      <label for="MD명">MD명</label>
      <div class="clear">
        <p class="brand_nm f_l" id="md_nm"></p><p class="brand_nb f_r" id="md_cd"></p>
      </div>
      <label for="점포 명">점포 명</label>
      
      <!-- 점포 목록 -->
      <select id="sel_store"></select>
      <!-- 점포 목록 -->
      
      <label for="기존인증번호">기존 인증번호</label>
      <input type="text" maxlength="6" id="crtfc_num" disabled>
      <label for="신규인증번호">신규 인증번호</label>
      <input type="text" maxlength="6" id="mod_crtfc_num">
      <!-- 
      <label for="신규인증번호확인">신규 인증번호 확인</label>
      <input type="text" maxlength="6" id="new_crtfc_num2">
       -->
    </div>
  </div>
  <div class="certify_btn">
    <a href="javascript:codeUpdate();">변경</a>
  </div>
</div>