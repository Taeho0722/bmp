<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">

var max_size = 150;
//TM Start ===============================================================================================

	
	
//행사 정보 조회
var msg_camp_nm = "";
var msg_camp_desc = "";
var msg_camp_str_dt = "";
var msg_camp_end_dt = "";
var msg_bran_offer = "";
var msg_bran_offer1 = "";
var msg_bran_offer2 = "";
var msg_bran_offer3 = "";
var msg_bran_offer1_desc = "";
var msg_bran_offer2_desc = "";
var msg_bran_offer3_desc = "";
var msg_offer1 = "";
var msg_offer2 = "";
var msg_offer3 = "";
var msg_offer4 = "";
var msg_chan_tran_dt = "";
var msg_chan_tran_prdt_cust_cnt = "";
var msg_store_nm = "";
var msg_tget_store_cd = "";
var msg_evt_flr = "";
var camp_drft_dept = "";


var campSummaryTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'selectCampSummary', '1', '\@#%');
campSummaryTm.setAddDataField('CAMP_ID', camp_id);
campSummaryTm.returnlist('CAMP_NM'+//행사명
                    		';CAMP_DESC'+//행사설명                		
                    		';CAMP_STR_DT'+//행사시작일자
                    		';CAMP_END_DT'+//행사종료일자
                    		';BRAN_OFFER'+//브랜드혜택
                    		';BRAN_OFFER1'+//md혜택
                    		';BRAN_OFFER2'+//할인혜택
                    		';BRAN_OFFER3'+//증정혜택
                    		';BRAN_OFFER1_DESC'+//md혜택 설명
                    		';BRAN_OFFER2_DESC'+//할인혜택 설명
                    		';BRAN_OFFER3_DESC'+//증정혜택 설명
                    		';OFFER1'+//제공혜택1
                    		';OFFER2'+//제공혜택2
                    		';OFFER3'+//제공혜택3
                    		';OFFER4'+//제공혜택4
                    		';CHAN_TRAN_DT'+//채널 발송일
                    		';CHAN_TRAN_PRDT_CUST_CNT'+//발송 예상 고객수
                    		';STORE_NM'+//점포명
                    		';TGET_STORE_CD'+//점포코드
                    		';EVT_FLR'+//층정보(행사장소)
                    		';CAMP_DRFT_DEPT');//부서코드
campSummaryTm.execute(null, false);
msg_camp_nm = campSummaryTm.ElementValue('CAMP_NM');
msg_camp_desc = campSummaryTm.ElementValue('CAMP_DESC');
msg_camp_str_dt = campSummaryTm.ElementValue('CAMP_STR_DT');
msg_camp_end_dt = campSummaryTm.ElementValue('CAMP_END_DT');
msg_bran_offer = campSummaryTm.ElementValue('BRAN_OFFER');
msg_bran_offer1 = campSummaryTm.ElementValue('BRAN_OFFER1');
msg_bran_offer2 = campSummaryTm.ElementValue('BRAN_OFFER2');
msg_bran_offer3 = campSummaryTm.ElementValue('BRAN_OFFER3');
msg_bran_offer1_desc = campSummaryTm.ElementValue('BRAN_OFFER1_DESC');
msg_bran_offer2_desc = campSummaryTm.ElementValue('BRAN_OFFER2_DESC');
msg_bran_offer3_desc = campSummaryTm.ElementValue('BRAN_OFFER3_DESC');
msg_offer1 = campSummaryTm.ElementValue('OFFER1');
msg_offer2 = campSummaryTm.ElementValue('OFFER2');
msg_offer3 = campSummaryTm.ElementValue('OFFER3');
msg_offer4 = campSummaryTm.ElementValue('OFFER4');
msg_chan_tran_dt = campSummaryTm.ElementValue('CHAN_TRAN_DT');
msg_chan_tran_prdt_cust_cnt = campSummaryTm.ElementValue('CHAN_TRAN_PRDT_CUST_CNT');
msg_store_nm = campSummaryTm.ElementValue('STORE_NM');
msg_tget_store_cd = campSummaryTm.ElementValue('TGET_STORE_CD');
msg_evt_flr = campSummaryTm.ElementValue('EVT_FLR');
camp_drft_dept = campSummaryTm.ElementValue('CAMP_DRFT_DEPT');
campSummaryTm.clear();


//등급별 채널사용 권한 조회
var lms_yn = "";
var mms_yn = "";
var edm_yn = "";

var chanAuthTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'selectChanAuth', '1', '\@#%');
chanAuthTm.setAddDataField('CAMP_ID', camp_id);
chanAuthTm.returnlist('LMS_YN;MMS_YN;EDM_YN');
chanAuthTm.execute(null, false);
lms_yn = chanAuthTm.ElementValue('LMS_YN');
mms_yn = chanAuthTm.ElementValue('MMS_YN');
edm_yn = chanAuthTm.ElementValue('EDM_YN');
chanAuthTm.clear();



//매장 전화번호 조회
var shop_phone_no = "";

var mdStoreTelTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectMdStoreTelNo', '1', '\@#%');
mdStoreTelTm.setAddDataField('MD_CD', md_cd);
mdStoreTelTm.setAddDataField('STORE_CD', msg_tget_store_cd);
mdStoreTelTm.returnlist('SHOP_PHONE_NO');
mdStoreTelTm.execute(null, false);
shop_phone_no = mdStoreTelTm.ElementValue('SHOP_PHONE_NO');//매장 전화번호
mdStoreTelTm.clear();



//전송번호 조회
var send_telno = "";

var scrtSendNoTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'selectScrtSendNo', '1', '\@#%');
scrtSendNoTm.setAddDataField('STORE_CD', msg_tget_store_cd);
scrtSendNoTm.returnlist('SEND_TELNO');
scrtSendNoTm.execute(null, false);
send_telno = scrtSendNoTm.ElementValue('SEND_TELNO');//전송번호
scrtSendNoTm.clear();


//테스트발송 번호 조회
var test_telno = "";

var userCellNoTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectUserCellNo', '1', '\@#%');
userCellNoTm.setAddDataField('USERID', user_id);
userCellNoTm.returnlist('MPHON_NO');
userCellNoTm.execute(null, false);
test_telno = userCellNoTm.ElementValue('MPHON_NO');//전송번호
userCellNoTm.clear();



//무료수신거부 번호 조회
var scrt_add_cont1 = "";
var scrt_add_cont2 = "";

var refusalNoTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectRefusalNo', '1', '\@#%');
refusalNoTm.returnlist('SCRT_ADD_CONT1;SCRT_ADD_CONT2');
refusalNoTm.execute(null, false);
scrt_add_cont1 = refusalNoTm.ElementValue('SCRT_ADD_CONT1');//신세계 전체
scrt_add_cont2 = refusalNoTm.ElementValue('SCRT_ADD_CONT2');//브랜드
refusalNoTm.clear();



//스크립트 정보 조회
var act_id = "";
var chan_cd = "";
var sms_send_telno = "";
var link_url1 = "";
var link_url2 = "";
var link_url3 = "";
var link_url4 = "";
var scrt_id = "";
var scrt_nm = "";
var scrt_ttl = "";
var script = "";
var edm_url = "";

var actInfoBMPTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'selectActInfoBMP', '1', '\@#%');
actInfoBMPTm.setAddDataField('CAMP_ID', camp_id);
actInfoBMPTm.returnlist('ACT_ID'+//행사활동ID
                    		';CHAN_CD'+//채널코드                		
                    		';SMS_SEND_TELNO'+//전송번호
                    		';LINK_URL1'+//이미지URL1
                    		';LINK_URL2'+//이미지URL1
                    		';SCRT_ID'+//스크립트ID
                    		';SCRT_NM'+//스크립트명
                    		';SCRT_TTL'+//메시지제목
                    		';EDM_URL'+//EDM링크
                    		';SCRIPT');//메시지 문구
actInfoBMPTm.execute(null, false);
act_id = actInfoBMPTm.ElementValue('ACT_ID');
chan_cd = actInfoBMPTm.ElementValue('CHAN_CD');
sms_send_telno = actInfoBMPTm.ElementValue('SMS_SEND_TELNO');
link_url1 = actInfoBMPTm.ElementValue('LINK_URL1');
link_url2 = actInfoBMPTm.ElementValue('LINK_URL2');
link_url3 = actInfoBMPTm.ElementValue('LINK_URL1');
link_url4 = actInfoBMPTm.ElementValue('LINK_URL2');
scrt_id = actInfoBMPTm.ElementValue('SCRT_ID');
scrt_nm = actInfoBMPTm.ElementValue('SCRT_NM');
scrt_ttl = actInfoBMPTm.ElementValue('SCRT_TTL');
script = actInfoBMPTm.ElementValue('SCRIPT');
edm_url = actInfoBMPTm.ElementValue('EDM_URL');
actInfoBMPTm.clear();


//스크립트 조회(스크립트ID가 없을때)
if(scrt_id == ""){
	var setScriptTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'setScript', '1', '\@#%');
	setScriptTm.setAddDataField('CAMP_ID', camp_id);
	setScriptTm.setAddDataField('CHAN_CD', chan_cd);
	setScriptTm.setAddDataField('SHOP_PHONE_NO', shop_phone_no);
	setScriptTm.setAddDataField('EDM_URL', '');
	setScriptTm.returnlist('SCRIPT;SCRT_TTL');
	setScriptTm.execute(null, false);
	script = setScriptTm.ElementValue('SCRIPT');
	scrt_ttl = setScriptTm.ElementValue('SCRT_TTL');
	setScriptTm.clear();
}
//TM End =================================================================================================	
 
	
	
	
	
 
//화면 로드 시 실행
$(document).ready(function() {
	//$('html, body').animate({scrollTop: $('#web_cmp_content').offset().top}, 'fast');
	
	screenLog("조회", "web_cp_campdraftbrand_sub06", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>채널문구 작성",get_client_ip);//화면 로그(공통)

	$(".way1").css("cursor","pointer");
	$(".way2").css("cursor","pointer");
	$(".way3").css("cursor","pointer");
	
	$("#dm_off").css("display","block");
	$("#dm_on").css("display","none");
	$("#mms_off").css("display","block");
	$("#mms_on").css("display","none");
	
	$("#file_input1").css("cursor","pointer");
	$("#file_input2").css("cursor","pointer");
	$("#file_input3").css("cursor","pointer");
	$("#file_input4").css("cursor","pointer");
	$("#edm_a").css("cursor","pointer");
	
	
	$("#msg_camp_nm").val(msg_camp_nm);
	$("#msg_camp_desc").val(msg_camp_desc);
	$("#msg_bran_offer").text(msg_bran_offer);
	$("#msg_camp_dt").text(setValidDate2(msg_camp_str_dt)+"~"+setValidDate2(msg_camp_end_dt));
	$("#msg_store_nm").text(msg_store_nm);
	$("#msg_evt_flr").text(msg_evt_flr);
	$("#msg_chan_tran_dt").text(setValidDate2(msg_chan_tran_dt));
	$("#msg_chan_tran_prdt_cust_cnt").text(AddComma(isNullZero(msg_chan_tran_prdt_cust_cnt))+" 명");
	
	
	$("#msg_offer1").text(msg_offer1);
	$("#msg_offer2").text(msg_offer2);
	$("#msg_offer3").text(msg_offer3);
	$("#msg_offer4").text(msg_offer4);

	
	if(msg_bran_offer1 == ""){
		$("#msg_bran_offer1").addClass("none");
		$("#msg_bran_offer1").text("해당없음");
	}else{
		$("#msg_bran_offer1").text(msg_bran_offer1);	
	}
	
	
	if(msg_bran_offer2 == ""){
		$("#msg_bran_offer2").addClass("none");
		$("#msg_bran_offer2").text("해당없음");
	}else{
		$("#msg_bran_offer2").text(msg_bran_offer2);	
	}
	
	
	if(msg_bran_offer3 == ""){
		$("#msg_bran_offer3").addClass("none");
		$("#msg_bran_offer3").text("해당없음");
	}else{
		$("#msg_bran_offer3").text(msg_bran_offer3);	
	}
	
	
	
	if(msg_bran_offer1_desc == ""){
		$("#msg_bran_offer1_desc").addClass("none");
	}else{
		$("#msg_bran_offer1_desc").html(msg_bran_offer1_desc.replace(/(?:\r\n|\r|\n)/g, '<br/>'));	
	}
	
	
	if(msg_bran_offer2_desc == ""){
		$("#msg_bran_offer2_desc").addClass("none");
	}else{
		$("#msg_bran_offer2_desc").html(msg_bran_offer2_desc.replace(/(?:\r\n|\r|\n)/g, '<br/>'));	
	}
	
	
	if(msg_bran_offer3_desc == ""){
		$("#msg_bran_offer3_desc").addClass("none");
	}else{
		$("#msg_bran_offer3_desc").html(msg_bran_offer3_desc.replace(/(?:\r\n|\r|\n)/g, '<br/>'));	
	}
	
	
	
	$("#edm_url").val(edm_url);
	$("#shop_phone_no").val(shop_phone_no);
	$("#send_telno").val(send_telno);
	$("#send_telno").attr("disabled",true)
	$("#test_telno").val(test_telno);
	$("#scrt_ttl").val(scrt_ttl);
	$("#script").html(script.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
	$("#input_script").val(script);
	$("#scrt_add_cont").html(scrt_add_cont1+"</br>"+scrt_add_cont2);
	
	//phoneNumberCheck("send_telno");
	phoneNumberCheck("shop_phone_no");
	phoneNumberCheck("test_telno");
	
	
	//byte 체크
	inputCheck("1","2000", script);
	
	
	//모바일DM
	if(chan_cd == "00036"){
		$(".way1").addClass("on");
		$("#dm_off").css("display","none");
		$("#dm_on").css("display","block");
	}
	
	
	//MMS
	if(chan_cd == "00027"){
		$(".way2").addClass("on");
		$("#mms_off").css("display","none");
		$("#mms_on").css("display","block");
	}
	
	//LMS
	if(chan_cd == "00025"){
		$(".way3").addClass("on");
	}
	
	
	//권한 체크
	if(edm_yn == "N"){
		$(".way1").css("cursor","default");
		$(".way1").addClass("none");
		$("#file_input1").css("cursor","default");
		$("#file_input2").css("cursor","default");
		$("#file_input1").attr("disabled",true);
		$("#file_input2").attr("disabled",true);
		$("#link_url1").attr("disabled",true);
		$("#link_url2").attr("disabled",true);
		$("#edm_a").css("cursor","default");
		$("#edm_url").attr("disabled",true);
	}
	
	if(lms_yn == "N"){
		$(".way3").css("cursor","default");
		$(".way3").addClass("none");
	}
	
	if(mms_yn == "N"){
		$(".way2").css("cursor","default");
		$(".way2").addClass("none");
		$("#file_input3").css("cursor","default");
		$("#file_input4").css("cursor","default");
		$("#file_input3").attr("disabled",true);
		$("#file_input4").attr("disabled",true);
		$("#link_url3").attr("disabled",true);
		$("#link_url4").attr("disabled",true);
	}
	
	
	
	if(mod_flag == "N" || (user_id != reg_id)){
		$(".way1").css("cursor","default");
		$(".way2").css("cursor","default");
		$(".way3").css("cursor","default");
		$("#file_input1").css("cursor","default");
		$("#file_input2").css("cursor","default");
		$("#file_input1").attr("disabled",true);
		$("#file_input2").attr("disabled",true);
		$("#file_input3").css("cursor","default");
		$("#file_input4").css("cursor","default");
		$("#file_input3").attr("disabled",true);
		$("#file_input4").attr("disabled",true);
		$("#link_url1").attr("disabled",true);
		$("#link_url2").attr("disabled",true);
		$("#link_url3").attr("disabled",true);
		$("#link_url4").attr("disabled",true);
		$("#edm_a").css("cursor","default");
		$("#edm_url").attr("disabled",true);
		$("#test_a").css("cursor","default");
		$("#test_telno").attr("disabled",true);
		$("#shop_phone_no").attr("disabled",true);
		$("#send_telno").attr("disabled",true);
		//$("#script").attr("disabled",true);
		$("#scrt_ttl").attr("disabled",true);
		$(".btn_prev").css("cursor","default");
		$(".btn_next").css("cursor","default");
		$("#msg_camp_nm").attr("disabled",true);
		$("#msg_camp_desc").attr("disabled",true);
		$("#camp_update_button").css("cursor","default");
	}
	
	
	
	
	//모바일DM
	$(".way1").click(function(e) {
		if(bmpevtTy_cd == "3"){cmdMessage(0,"[신세계 임직원 대상 알리기] 행사는 선택 할 수 없습니다.");return;}
		if(mod_flag == "N"){return;}
		if(user_id != reg_id){return;}
		if(edm_yn == "N"){return;}
		
		/*
		if(e.target.id == ""){return;}//첨부하기 클릭 시 방지
		if(e.target.id == "edm_a"){return;}//첨부하기 클릭 시 방지
		if(e.target.id == "edm_url"){return;}//모바일DM url
		if(e.target.id == "file_input1"){return;}//첨부하기1
		if(e.target.id == "file_input2"){return;}//첨부하기2
		if(e.target.id == "link_url1"){return;}//첨부하기1 url
		if(e.target.id == "link_url2"){return;}//첨부하기1 url
		*/
		
		//$(".way_list li").removeClass("on");
		$(".way2").removeClass("on");
		$(".way3").removeClass("on");
		
		$("#mms_off").css("display","block");
		$("#mms_on").css("display","none");
		
    if(!$(this).hasClass("on")){
    	$(this).addClass("on");
    	$("#dm_off").css("display","none");
    	$("#dm_on").css("display","block");
    
    	chan_cd = "00036";
    	test_flag = "N";
    	
    	$("#link_url1").val("");
    	$("#link_url2").val("");
    	$("#link_url3").val("");
    	$("#link_url4").val("");
    	
    	setScriptTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'setScript', '1', '\@#%');
    	setScriptTm.setAddDataField('CAMP_ID', camp_id);
    	setScriptTm.setAddDataField('CHAN_CD', chan_cd);
    	setScriptTm.setAddDataField('SHOP_PHONE_NO', shop_phone_no);
    	setScriptTm.setAddDataField('EDM_URL', '');
    	setScriptTm.returnlist('SCRIPT;SCRT_TTL');
    	setScriptTm.execute(null, false);
    	script = setScriptTm.ElementValue('SCRIPT');
    	scrt_ttl = setScriptTm.ElementValue('SCRT_TTL');
    	setScriptTm.clear();
    	
    	$("#scrt_ttl").val(scrt_ttl);
    	$("#script").html(script.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
    	$("#input_script").val(script);
    	
    }
    
    return;
	});
	
	//MMS
	$(".way2").click(function() {
		if(mod_flag == "N"){return;}
		if(user_id != reg_id){return;}
		if(mms_yn == "N"){return;}
		
		//$(".way_list li").removeClass("on");
		$(".way1").removeClass("on");
		$(".way3").removeClass("on");
		$("#dm_off").css("display","block");
		$("#dm_on").css("display","none");
		
	  if(!$(this).hasClass("on")){
	 		$(this).addClass("on");
	 		$("#mms_off").css("display","none");
	    $("#mms_on").css("display","block");
	 		
	 		chan_cd = "00027";
	 		test_flag = "N";
	 		
	 		$("#link_url1").val("");
	 		$("#link_url2").val("");
	 		$("#link_url3").val("");
	    $("#link_url4").val("");
	 		$("#edm_url").val("");
	 		
			setScriptTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'setScript', '1', '\@#%');
			setScriptTm.setAddDataField('CAMP_ID', camp_id);
			setScriptTm.setAddDataField('CHAN_CD', chan_cd);
			setScriptTm.setAddDataField('SHOP_PHONE_NO', shop_phone_no);
			setScriptTm.setAddDataField('EDM_URL', '');
			setScriptTm.returnlist('SCRIPT;SCRT_TTL');
			setScriptTm.execute(null, false);
			script = setScriptTm.ElementValue('SCRIPT');
			scrt_ttl = setScriptTm.ElementValue('SCRT_TTL');
			setScriptTm.clear();
			
			$("#scrt_ttl").val(scrt_ttl);
			$("#script").html(script.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
			$("#input_script").val(script);
			$("#edm_url").val("");
	 	}
	 	
	 	return;
	});
	
	
	//LMS
	$(".way3").click(function() {
	 if(mod_flag == "N"){return;}
	 if(user_id != reg_id){return;}
	 if(lms_yn == "N"){return;}
	 
	 //$(".way_list li").removeClass("on");
	 $(".way1").removeClass("on");
	 $(".way2").removeClass("on");
	 $("#dm_off").css("display","block");
   $("#dm_on").css("display","none");
   $("#mms_off").css("display","block");
   $("#mms_on").css("display","none");
   
	 if(!$(this).hasClass("on")){
	 		$(this).addClass("on");
	 		chan_cd = "00025";
	 		test_flag = "N";
	 		
	 		$("#link_url1").val("");
	 		$("#link_url2").val("");
	 		$("#link_url3").val("");
	    $("#link_url4").val("");
	 		$("#edm_url").val("");
	 		
	 		$("#file_input1").val("");
	 		$("#file_input2").val("");
	 		$("#file_input3").val("");
	 		$("#file_input4").val("");
	 		
			setScriptTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'setScript', '1', '\@#%');
			setScriptTm.setAddDataField('CAMP_ID', camp_id);
			setScriptTm.setAddDataField('CHAN_CD', chan_cd);
			setScriptTm.setAddDataField('SHOP_PHONE_NO', shop_phone_no);
			setScriptTm.setAddDataField('EDM_URL', '');
			setScriptTm.returnlist('SCRIPT;SCRT_TTL');
			setScriptTm.execute(null, false);
			script = setScriptTm.ElementValue('SCRIPT');
			scrt_ttl = setScriptTm.ElementValue('SCRT_TTL');
			setScriptTm.clear();
			
			$("#scrt_ttl").val(scrt_ttl);
			$("#script").html(script.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
			$("#input_script").val(script);
			$("#edm_url").val("");
	 	}
	 	
	 	return;
	});
	
	
	
	//모바일DM 시작------------------------------------------------------------------------------------------------------------------------
	//이미지 첨부1 클릭 시
	$("#file_input1").change(function(){
		var file1 = $("#file_input1").val(); 
		$("#link_url1").val(file1);
		
		if(file1 != ""){
			var size = document.getElementById("file_input1").files[0].size;
			
			if(max_size <parseInt(size/1024)){
				cmdMessage(0,"첨부 용량이 150KB을 넘을 수 없습니다.\n(현재 파일 크기 : "+parseInt(size/1024)+"KB)");
				$("#file_input1").val("");
				$("#link_url1").val("");
				return;
			}	
			
			//파일 확장자 체크
			var check_file = $("#link_url1").val();
			pathHeader = check_file.lastIndexOf("\\");
      pathMiddle = check_file.lastIndexOf(".");
      pathEnd = check_file.length;
      fileName = check_file.substring(pathHeader+1, pathMiddle);
      extName = check_file.substring(pathMiddle+1, pathEnd);
			
      var check_file_type=['jpg'];
			
			if(check_file_type.indexOf(extName)==-1){
				cmdMessage(0,"jpg 파일만 선택 가능합니다.");
				$("#file_input1").val("");
				$("#link_url1").val("");
  		  return;
  		}
			
		}
		
		
		test_flag = "N";
	});
	
	
	//이미지 첨부2 클릭 시
	$("#file_input2").change(function(){
		var file2 = $("#file_input2").val(); 
		$("#link_url2").val(file2);
		
		if(file2 != ""){
			var size = document.getElementById("file_input2").files[0].size;
			
			if(max_size <parseInt(size/1024)){
				cmdMessage(0,"첨부 용량이 150KB을 넘을 수 없습니다.\n(현재 파일 크기 : "+parseInt(size/1024)+"KB)");
				$("#file_input2").val("");
				$("#link_url2").val("");
				return;
			}
			
			//파일 확장자 체크
			var check_file = $("#link_url2").val();
			pathHeader = check_file.lastIndexOf("\\");
      pathMiddle = check_file.lastIndexOf(".");
      pathEnd = check_file.length;
      fileName = check_file.substring(pathHeader+1, pathMiddle);
      extName = check_file.substring(pathMiddle+1, pathEnd);
			
      var check_file_type=['jpg'];
			
			if(check_file_type.indexOf(extName)==-1){
				cmdMessage(0,"jpg 파일만 선택 가능합니다.");
				$("#file_input2").val("");
				$("#link_url2").val("");
  		  return;
  		}
		}
		
		
		test_flag = "N";
	});
	//모바일DM 종료------------------------------------------------------------------------------------------------------------------------
	
	
	
	//MMS 시작------------------------------------------------------------------------------------------------------------------------
	//이미지 첨부1 클릭 시
	$("#file_input3").change(function(){
		var file1 = $("#file_input3").val(); 
		$("#link_url3").val(file1);
		
		if(file1 != ""){
			var size = document.getElementById("file_input3").files[0].size;
			
			if(max_size <parseInt(size/1024)){
				cmdMessage(0,"첨부 용량이 150KB을 넘을 수 없습니다.\n(현재 파일 크기 : "+parseInt(size/1024)+"KB)");
				$("#file_input3").val("");
				$("#link_url3").val("");
				return;
			}
			
			//파일 확장자 체크
			var check_file = $("#link_url3").val();
			pathHeader = check_file.lastIndexOf("\\");
      pathMiddle = check_file.lastIndexOf(".");
      pathEnd = check_file.length;
      fileName = check_file.substring(pathHeader+1, pathMiddle);
      extName = check_file.substring(pathMiddle+1, pathEnd);
			
      var check_file_type=['jpg'];
			
			if(check_file_type.indexOf(extName)==-1){
				cmdMessage(0,"jpg 파일만 선택 가능합니다.");
				$("#file_input3").val("");
				$("#link_url3").val("");
  		  return;
  		}
		}
		
		
		test_flag = "N";
	});
	
	
	//이미지 첨부2 클릭 시
	$("#file_input4").change(function(){
		var file2 = $("#file_input4").val(); 
		$("#link_url4").val(file2);
		
		if(file2 != ""){
			var size = document.getElementById("file_input4").files[0].size;
			
			if(max_size <parseInt(size/1024)){
				cmdMessage(0,"첨부 용량이 150KB을 넘을 수 없습니다.\n(현재 파일 크기 : "+parseInt(size/1024)+"KB)");
				$("#file_input4").val("");
				$("#link_url4").val("");
				return;
			}
			
			//파일 확장자 체크
			var check_file = $("#link_url4").val();
			pathHeader = check_file.lastIndexOf("\\");
      pathMiddle = check_file.lastIndexOf(".");
      pathEnd = check_file.length;
      fileName = check_file.substring(pathHeader+1, pathMiddle);
      extName = check_file.substring(pathMiddle+1, pathEnd);
			
      var check_file_type=['jpg'];
			
			if(check_file_type.indexOf(extName)==-1){
				cmdMessage(0,"jpg 파일만 선택 가능합니다.");
				$("#file_input4").val("");
				$("#link_url4").val("");
  		  return;
  		}
		}
		
		
		test_flag = "N";
	});
	//MMS 종료------------------------------------------------------------------------------------------------------------------------
	
	
	
	
	/*
	//매장전화번호 체크 
	$("#shop_phone_no").on("propertychange change keyup paste input", function() {
		phoneNumberCheck('shop_phone_no');
	});
	
	//전송번호 체크 
	$("#send_telno").on("propertychange change keyup paste input", function() {
		phoneNumberCheck('send_telno');
	});
	
	//테스트 발송번호 체크 
	$("#test_telno").on("propertychange change keyup paste input", function() {
		phoneNumberCheck('test_telno');
	});
	
	//메시지 제목
	$("#scrt_ttl").on("propertychange change keyup paste input", function() {
		inputCheck('2','128',$(this).val());
	});
	
	//모바일DM 링크
	$("#edm_url").on("propertychange change keyup paste input", function() {
		inputCheck('3','100',$(this).val());
	});
	*/
});


/*===============================================================
파일 삭제
===============================================================*/
function file_delete(del_flag){
	
	var input_name = "";
	var input_id = "";
	
	if(del_flag == "1"){
		input_name = "file_input1";
		input_id = "link_url1";
	}
	
	if(del_flag == "2"){
		input_name = "file_input2";
		input_id = "link_url2";
	}
	
	if(del_flag == "3"){
		input_name = "file_input3";
		input_id = "link_url3";
	}
	
	if(del_flag == "4"){
		input_name = "file_input4";
		input_id = "link_url4";
	}
	
	
	$("#"+input_name).val("");
	$("#"+input_id).val("");
}


/**========================================================================================
* 전화번호 형식 체크
========================================================================================*/
function phoneNumberCheck(inputId){
	var inputValue = $("#"+inputId).val();
	
	if(inputValue == "" || inputValue == null){return;}
	
	test_flag = "N";
	
	if(inputId == "test_telno"){
		inputValue= formatMobile(inputValue);	
	}else{
		inputValue= formatPhone(inputValue);
	}
	
	if(isValidPhone(inputValue) == false){
		cmdMessage(0, "번호를 확인하세요");
	 	$("#"+inputId).val("");
	 	$("#"+inputId).focus();
		return;
	}
	
	$("#"+inputId).val(inputValue);
	
	
	
	//매장 전화번호 일때 모바일 뷰 실시간 변경
	if(inputId == "shop_phone_no"){
		var input_script = "";
		var setScriptTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'setScript', '1', '\@#%');
		setScriptTm.setAddDataField('CAMP_ID', camp_id);
		setScriptTm.setAddDataField('CHAN_CD', chan_cd);
		setScriptTm.setAddDataField('SHOP_PHONE_NO', inputValue);
		setScriptTm.setAddDataField('EDM_URL', '');
		setScriptTm.returnlist('SCRIPT');
		setScriptTm.execute(null, false);
		input_script = setScriptTm.ElementValue('SCRIPT');
		setScriptTm.clear();
		
		$("#script").html(input_script.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
		$("#input_script").val(input_script);
	}
	
}


/*===============================================================
입력값 체크 
===============================================================*/
function inputCheck(flag, byte_value, input_value, input_id){
  byte_value = parseInt(byte_value);
  
  test_flag = "N";
  
  //메시지 문구
  if(flag == "1"){
	  input_value += scrt_add_cont1;
	  input_value += scrt_add_cont2;
	  
	  $("#script_byte").html("");
	  $("#script_byte").text(getByteLength(input_value)+" bytes");
  }
  
  
  if((byte_value/2) < input_value.length){ 
		cmdMessage(0,"최대 "+(byte_value/2)+"글자를 넘을 수 없습니다.");
		
		if(input_id){
			$("#"+input_id).val(getByteVal(input_value,(byte_value/2)));
	 		$("#"+input_id).focus();	
		}
		
		return; 
	}
  
  if(byte_value < getByteLength(input_value)){ 
 		cmdMessage(0,"최대 "+byte_value+"Bytes를 넘을 수 없습니다.");
 		
 		if(input_id){
 			$("#"+input_id).val(getByteVal(input_value,byte_value));
 	 		$("#"+input_id).focus();	
 		}
 		
 		return; 
 	}
  
  
	
  
  //모바일DM
  if(flag == "3"){
	  var input_script = "";
		var setScriptTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'setScript', '1', '\@#%');
		setScriptTm.setAddDataField('CAMP_ID', camp_id);
		setScriptTm.setAddDataField('CHAN_CD', chan_cd);
		setScriptTm.setAddDataField('SHOP_PHONE_NO', $("#shop_phone_no").val());
		setScriptTm.setAddDataField('EDM_URL', input_value);
		setScriptTm.returnlist('SCRIPT');
		setScriptTm.execute(null, false);
		input_script = setScriptTm.ElementValue('SCRIPT');
		setScriptTm.clear();
		
		$("#script").html(input_script.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
		$("#input_script").val(input_script);
		
  }
  
  if(input_id){$("#"+input_id).val(input_value);}
  
}





/**========================================================================================
* 모바일DM 작성 팝업 
========================================================================================*/
var edm_flag = "N";
function eDMPopup(){
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	if($(".way1").hasClass("on")){
		
  	//edm 행사 정보 등록
  	var insertEdmTm = new oza_TMHandler('com.obzen.bmp.DocEdm', 'insertEdm', '1', '\@#%');
  	insertEdmTm.setAddDataField('CAMP_ID', camp_id);
  	insertEdmTm.returnlist('LOGMSG');
  	insertEdmTm.execute(null, false);
  	var msg = insertEdmTm.ElementValue('LOGMSG');
  	insertEdmTm.clear();
  	
  	if(msg != "INST_SUCCESS"){cmdMessage(0,"모바일DM 작성 실패");return;}
  	
  	var url = "";
  	
  	if(document.location.host == "bmp.shinsegae.com"){
  		url = "http://bmpadmin.shinsegae.com/bmp/create/list.do?storeCd="+msg_tget_store_cd+"&campId="+camp_id+"&intgBranCd="+md_cd+"&branCd="+intg_bran_cd+"&user_id="+user_id;
  	}else{
  		url = "http://10.102.0.28:11900/bmp/create/list.do?storeCd="+msg_tget_store_cd+"&campId="+camp_id+"&intgBranCd="+md_cd+"&branCd="+intg_bran_cd+"&user_id="+user_id;
  	}
  	
    window.open(url, "_blank"); 
    
    edm_flag = "Y";
	}
}


/**========================================================================================
* Test 문자 전송
========================================================================================*/
var test_flag = "Y";
var sel_link1 = "";
var sel_link2 = "";

function messageSendTest(){
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	if(chan_cd == ""){
		cmdMessage(3,"발송채널");
		return;
	}
	
	
	//console.log("sel_link1="+document.getElementById("file_input9").files[0]+"   scrt_file_nm1="+scrt_file_nm1);
	
	if($("#test_telno").val() == ""){
		cmdMessage(2,"테스트 발송번호");
		$("#test_telno").focus();
		return;
	}
	
	
	
	
	//유효 휴대폰 번호 체크
	var cnt = "";
	var test_no = replaceAll($("#test_telno").val(),"-","");
	var msg = "";
	
	
	var isUserCellNoTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'selectIsUserCellNo', '1', '\@#%');
	isUserCellNoTm.setAddDataField('MPHON_NO', test_no);
	isUserCellNoTm.returnlist('CNT');
	isUserCellNoTm.execute(null, false);
	cnt = isUserCellNoTm.ElementValue('CNT');//전송번호 체크
	isUserCellNoTm.clear();

	if(cnt == 0){
		cmdMessage(0,"유효 하지 않는 번호 입니다.");
		$("#test_telno").focus();
		return;
	}
	
		
	//저장 시작--------------------------------------------------------------------------------------------------
	var pathHeader = "";
 	var pathMiddle = "";
 	var fileName = "";
 	var extName = "";
  var allFilename = "";
  var pathEnd = "";
  var scrt_file_nm1 = "";
  var scrt_file_nm2 = "";
 	var file_id1 = "";
 	var file_id2 = "";
  
 	scrt_ttl = $("#scrt_ttl").val();
 	script = $("#input_script").val();
 	edm_url = $("#edm_url").val();
 	link_url1 = $("#link_url1").val();
 	link_url2 = $("#link_url2").val();
 	link_url3 = $("#link_url3").val();
 	link_url4 = $("#link_url4").val();
 	scrt_file_nm = "";
 	send_telno = replaceAll($("#send_telno").val(),"-","");
 	
	
 	
 	//모바일DM
 	if(chan_cd == "00036"){
 		sel_link1 = link_url1;
 		sel_link2 = link_url2;
 		file_id1 = "file_input1";
 		file_id2 = "file_input2";
 	}
 	
 	
 	//MMS
 	if(chan_cd == "00027"){
 		sel_link1 = link_url3;
 		sel_link2 = link_url4;
 		file_id1 = "file_input3";
 		file_id2 = "file_input4";
 	}
 	
 	
 	//메시지제목 40bye
 	//채널선택 필수체크
 	//메시지 제목 & 문구에 "(광고)" 문구 체크
 	//스크립트 2000byte
 	
 	
 	//입력 체크 시작-----------------------------------------------------
 	
 	
 	if(msg_chan_tran_prdt_cust_cnt == ""){
 		cmdMessage(0,"발송 예상 고객이 없습니다.");
		return;
 	}
 	
 	if(scrt_ttl == ""){
		cmdMessage(2,"메시지 제목");
		$("#scrt_ttl").focus();
		return;
	}
 	
 	
 	if(scrt_ttl != "" && scrt_ttl.indexOf("광고") < 0){
		cmdMessage(0,"메시지 제목에 광고 문구가 포함되어야 합니다.");
		$("#scrt_ttl").focus();
		return;
	}
 	
 	
 	if(script == ""){
		cmdMessage(2,"메시지 문구");
		$("#script").focus();
		return;
	}
 	
 	
 	if(script != "" && script.indexOf("광고") < 0){
		cmdMessage(0,"메시지 문구에 광고 문구가 포함되어야 합니다.");
		$("#script").focus();
		return;
	}
 	
 	
 	if(send_telno == ""){
		cmdMessage(2,"전송번호");
		$("#send_telno").focus();
		return;
	}
 	
 	//모바일DM
 	if(chan_cd == "00036"){
 		if(edm_url == ""){
 			cmdMessage(2,"모바일DM 작성하기");
 			$("#edm_url").focus();
 			return;
 		}
 	}
 	
 	//MMS가 아니고 첨부파일이 없을 경우 LMS로 전환
 	if(chan_cd == "00027" && (sel_link1 == "" && sel_link2 == "")){
 		if(cmdMessage(1, "LMS로 전환 하시겠습니까?") == false){
	   	return;
	  }
 		
 		//$(".way_list li").removeClass("on");
 		$(".way1").removeClass("on");
		$(".way2").removeClass("on");
 		$("#dm_off").css("display","block");
    $("#dm_on").css("display","none");
    $("#mms_off").css("display","block");
    $("#mms_on").css("display","none");

 		$(".way3").addClass("on");
 		
 		$("#link_url3").val("");
 		$("#link_url4").val("");
 		
 		chan_cd = "00025";
 		return;
 	}
 	//입력 체크 종료-----------------------------------------------------
 	
 	
 	
 	
 	if(cmdMessage(1, "테스트 발송을 진행 하시겠습니까?") == false){
   	return;
  }
 	
 	
 	
 	//lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
 	
 	//메시지 스크립트 저장
 	var insertScriptBMPTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'insertScriptBMP', '1', '\@#%');
 	insertScriptBMPTm.setAddDataField('CAMP_ID', camp_id);
 	insertScriptBMPTm.setAddDataField('SCRT_ID', scrt_id);//스크립트ID
 	insertScriptBMPTm.setAddDataField('SCRT_TTL', scrt_ttl);//메시지 제목
 	insertScriptBMPTm.setAddDataField('CHAN_CD', chan_cd);//채널 코드
 	insertScriptBMPTm.setAddDataField('SCRT_CONT', script);//메시지 문구
 	insertScriptBMPTm.setAddDataField('USERID', user_id);
 	insertScriptBMPTm.returnlist('SCRT_ID');
 	insertScriptBMPTm.execute(null, false);
 	scrt_id = insertScriptBMPTm.ElementValue('SCRT_ID');
 	insertScriptBMPTm.clear();
 	
 	 
   //MMS, 모바일DM 선택 일때
   if(chan_cd == "00027" || chan_cd == "00036"){
	   
	   
	   //MMS 이미지 업로드 실행 시작-----------------------------------------------------------------
	   if(sel_link1 != "" || sel_link2 != ""){
		  
		  //upload 폴더 생성
		 	var createFolderTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'createFileDir', '1', '\@#%');
		 	createFolderTm.setAddDataField('STORE_CD', camp_drft_dept);
		 	createFolderTm.setAddDataField('USER_ID', user_id);
		 	createFolderTm.execute(null, false);
		 	createFolderTm.clear();
		 	
		 	
		 	if(sel_link1 != ""){
				pathHeader = sel_link1.lastIndexOf("\\");
	      pathMiddle = sel_link1.lastIndexOf(".");
	      pathEnd = sel_link1.length;
	      fileName = sel_link1.substring(pathHeader+1, pathMiddle);
	      extName = sel_link1.substring(pathMiddle+1, pathEnd);
	      allFilename = fileName+"."+extName;
	      
	      
	      scrt_file_nm1 = allFilename;	
			}
		 	
		 	
		 	
			if(sel_link2 != ""){
				pathHeader = sel_link2.lastIndexOf("\\");
	      pathMiddle = sel_link2.lastIndexOf(".");
	      pathEnd = sel_link2.length;
	      fileName = sel_link2.substring(pathHeader+1, pathMiddle);
	      extName = sel_link2.substring(pathMiddle+1, pathEnd);
	      allFilename = fileName+"."+extName;
	      
	      scrt_file_nm2 = allFilename;
			}
		 	
			//파일명처리
			if(sel_link1 == "" && sel_link2 != ""){scrt_file_nm = "99;"+scrt_file_nm2;}
			if(sel_link1 != "" && sel_link2 == ""){scrt_file_nm = scrt_file_nm1+";99";}
			if(sel_link1 != "" && sel_link2 != ""){scrt_file_nm = scrt_file_nm1+";"+scrt_file_nm2;}
			
			
			//파일 업로드 처리
			if(sel_link1 != ""){oz_file_upload(scrt_file_nm1, $("#"+file_id1)[0].files[0]);}
			if(sel_link2 != ""){oz_file_upload(scrt_file_nm2, $("#"+file_id2)[0].files[0]);}
		 //cmdMessage(0,"파일 업로드 완료");
		 //MMS 이미지 업로드 실행 종료-----------------------------------------------------------------
		 }
	 }
   
 	 //테스트 발송 처리(첨부 포함)
   msgProcess();
  
 	//저장 종료--------------------------------------------------------------------------------------------------
	
 	screenLog("테스트 발송", "web_cp_campdraftbrand_sub06", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>채널문구 작성",get_client_ip);//화면 로그(공통)
 	test_flag = "Y";
 	//lodingImgOff();//백그라운드 이미지 비활성
}


/**========================================================================================
* 메시지 저장 및 테스트 발송
========================================================================================*/
function msgProcess(){
	
	var test_no = replaceAll($("#test_telno").val(),"-","");
	var msg = "";
	
	var file_link1 = "";
	var file_link2 = "";
	
	
	//MMS, 모바일DM 선택 일때
	if(chan_cd == "00027" || chan_cd == "00036"){
		if(sel_link1  != ""){file_link1 = replaceAll(sel_link1,"\\","@#");}else{file_link1 = "";}
		if(sel_link2  != ""){file_link2 = replaceAll(sel_link2,"\\","@#");}else{file_link2 = "";}
	}
	
	//LMS
	if(chan_cd == "00025"){
		file_link1 = "";
		file_link2 = "";
	}
	
	
	//메시지 활동 정보 생성
 	var insertMsgActTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'insertMsgAct', '1', '\@#%');
 	insertMsgActTm.setAddDataField('CAMP_ID', camp_id);
 	insertMsgActTm.setAddDataField('ACT_ID', act_id);//행사활동ID
 	insertMsgActTm.setAddDataField('CHAN_CD', chan_cd);//채널코드
 	insertMsgActTm.setAddDataField('SCRT_ID', scrt_id);//스크립트ID
 	insertMsgActTm.setAddDataField('APP_LINK_URL', edm_url);//EDM링크
 	insertMsgActTm.setAddDataField('LINK_URL1', file_link1);//이미지url1
 	insertMsgActTm.setAddDataField('LINK_URL2', file_link2);//이미지url2
 	insertMsgActTm.setAddDataField('SCRT_FILE_NM', scrt_file_nm);//mms 첨부파일명(mms일때 첨부파일, 최대2개 구분자 ;)
 	insertMsgActTm.setAddDataField('SERVER_FILE_PATH', camp_drft_dept+"/"+user_id+"/");//mms 첨부파일 패스 (camp_drft_dept/userid/)
 	insertMsgActTm.setAddDataField('SMS_SEND_TELNO', replaceAll(send_telno,"-",""));//전송번호
 	insertMsgActTm.returnlist('ACT_ID;LOGMSG');
 	insertMsgActTm.execute(null, false);
 	act_id = insertMsgActTm.ElementValue('ACT_ID');
 	msg = insertMsgActTm.ElementValue('LOGMSG');
 	insertMsgActTm.clear();
 	
 	
	if(act_id == ""){cmdMessage(0,"메시지 활동 정보 생성 실패");test_flag = "N";return;}
	
	
	//로딩바 시작
	loadingStart();
	
	//테스트 발송 
 	var bmpTestMsgSendIndTm = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'bmpTestMsgSendInd', '1', '\@#%');
 	bmpTestMsgSendIndTm.setAddDataField('ACT_ID', act_id);
 	bmpTestMsgSendIndTm.setAddDataField('USERID', user_id);
 	bmpTestMsgSendIndTm.setAddDataField('MPHON_NO', test_no);
 	bmpTestMsgSendIndTm.returnlist('TEST_SEND_RESULT');
 	bmpTestMsgSendIndTm.execute(callBackTestSend, true);
}



/**========================================================================================
* 테스트 발송 콜백 함수(비동기)
========================================================================================*/
function callBackTestSend(bmpTestMsgSendIndTm){
	var msg = bmpTestMsgSendIndTm.ElementValue('TEST_SEND_RESULT');
 	bmpTestMsgSendIndTm.clear();
 	
 	//로딩 종료
 	loadingStop();
 	
 	cmdMessage(0,msg);
 	
 	if(msg == ""){
 		scrt_id = "";
 		return;
 	}
 	
 	
	screenLog("테스트 발송", "web_cp_campdraftbrand_sub06", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>채널문구 작성",get_client_ip);//화면 로그(공통)
 	test_flag = "Y";
}



/**========================================================================================
* 이전 단계
========================================================================================*/
function preStep05(){
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
	
	 webPageMove("5");
}


/**========================================================================================
* 다음 단계(등록/수정)
========================================================================================*/
var scrt_file_nm = "";

function nextStep05(){
	if(mod_flag == "N"){return;}
	if(user_id != reg_id){return;}
 	
 	
 	if(scrt_id == ""){cmdMessage(0,"테스트 발송을 진행 하세요.");return;}
 	if(test_flag == "N"){cmdMessage(0,"테스트 발송을 진행 하세요.");return;}
 	if(test_flag == "N" && chan_cd == "00036" && edm_flag == "N"){cmdMessage(0,"[제작하기] 버튼을 클릭 후 진행 가능합니다.");return;}
 	
 	
 	/*
 	if(cmdMessage(1, "다음 단계로 이동 하시겠습니까?") == false){
   	return;
  }
 	*/
 	
 	lodingImgOn();//백그라운드 이미지 활성(더블클릭방지)
 	
 	//채널 문구 작성완료 상태 변경
 	var updateChanStatTm = new oza_TMHandler('com.obzen.bmp.DocActInfo', 'updateChanStat', '1', '\@#%');
 	updateChanStatTm.setAddDataField('CAMP_ID', camp_id);
 	updateChanStatTm.setAddDataField('USERID', user_id);
 	updateChanStatTm.returnlist('LOGMSG');
 	updateChanStatTm.execute(null, false);
  var msg = updateChanStatTm.ElementValue('LOGMSG');//리턴 처리 메시지
 	updateChanStatTm.clear();
 	
 	
 	screenLog("등록", "web_cp_campdraftbrand_sub06", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>채널문구 작성",get_client_ip);//화면 로그(공통)
 	//cmdMessage(0,msg);
 	

 	flag = "7";
	camp_id = camp_id;
	bmpevtTy_cd = bmpevtTy_cd;
	
	do_RefreshPage("onload");
}


/**========================================================================================
* 수정하기
========================================================================================*/
var msg_camp_nm = "";
var msg_camp_desc = "";

function campUpdate(){
	if(mod_flag == "N"){return;}
 	if(user_id != reg_id){return;}
 	
	msg_camp_nm = $("#msg_camp_nm").val();
	msg_camp_desc = $("#msg_camp_desc").val();
	
	if(msg_camp_nm == ""){cmdMessage(2, "행사명"); $("#msg_camp_nm").focus();return;}
	if(msg_camp_desc == ""){cmdMessage(2, "행사설명"); $("#msg_camp_desc").focus();return;}
	
	
	
	if(msg_camp_nm != ""){
	  var charCheck = "";
	  
	  if(msg_camp_nm.indexOf("$") > -1){charCheck = "$";}
	  if(msg_camp_nm.indexOf("&") > -1){charCheck = "&";}
	  if(msg_camp_nm.indexOf(">") > -1){charCheck = ">";}
	  if(msg_camp_nm.indexOf("<") > -1){charCheck = "<";}
	  if(msg_camp_nm.indexOf("/") > -1){charCheck = "/";}
	  if(msg_camp_nm.indexOf("\'") > -1){charCheck = "\'";}
	  if(msg_camp_nm.indexOf("\"") > -1){charCheck = "\"";}
	  if(msg_camp_nm.indexOf(";") > -1){charCheck = ";";}
	  
	  if(charCheck != ""){
	  	cmdMessage(0,"행사명에 특수문자는 사용할 수 없습니다. ($&<>/\'\";)");
	  	return;
	  }
	}
	
	
	//모바일DM 선택 일때 등록 및 체크
	if(chan_cd == "00036"){
		//edm 행사 정보 등록
		var insertEdmTm = new oza_TMHandler('com.obzen.bmp.DocEdm', 'insertEdm', '1', '\@#%');
		insertEdmTm.setAddDataField('CAMP_ID', camp_id);
		insertEdmTm.returnlist('LOGMSG');
		insertEdmTm.execute(null, false);
		var msg = insertEdmTm.ElementValue('LOGMSG');
		insertEdmTm.clear();
		
		if(msg != "INST_SUCCESS"){cmdMessage(0,"모바일DM 작성 실패");return;}	
	}
	
	
	//행사명, 행사설명 수정하기
 	var updateCampTm = new oza_TMHandler('com.obzen.bmp.DocCampReg', 'updateCampNm', '1', '\@#%');
 	updateCampTm.setAddDataField('CAMP_ID', camp_id);
 	updateCampTm.setAddDataField('CAMP_NM', msg_camp_nm);
 	updateCampTm.setAddDataField('CAMP_DESC', msg_camp_desc);
 	//updateCampTm.returnlist('LOGMSG');
 	updateCampTm.execute(null, false);
  //var msg = updateCampTm.ElementValue('LOGMSG');//리턴 처리 메시지
 	updateCampTm.clear();
 	
 	test_flag = "N";
  
 	screenLog("수정", "web_cp_campdraftbrand_sub06", "브랜드마케팅>행사등록하기>신세계 백화점 행사등록>채널문구 작성",get_client_ip);//화면 로그(공통)
 	
 	cmdMessage(0,"수정 하였습니다.");
 	
 	$("#camp_nm").val(msg_camp_nm);
}




/**========================================================================================
* OBZEN 파일 업로드 컨트롤러
* .execute(caller, false, serverFileName, clientfileInfo);  콜러, false, 서버업로드이름, 로컬풀패스
========================================================================================*/
function oz_file_upload(serverFileName, clientfileInfo){
  var fileTransfer = new oza_fileuploadhandler();
  fileTransfer.execute(return_FileTransfer, false, serverFileName, clientfileInfo);
  fileTransfer = null;
}

/**========================================================================================
* OBZEN 파일 업로드 컨트롤러 콜백 함수 
========================================================================================*/
function return_FileTransfer(fileTransfer) {
  if (fileTransfer != undefined) {
  	if (fileTransfer.isError() === true) {
  		alert('파일 업로드 작업을 실패 하였습니다.');
  		fileTransfer = null;
  		return ;
  	}
  	fileTransfer = null;
  }
}


</script>


<input type="hidden" id="input_script" name="input_script">

<div class="c_write_wrap">
  <div class="tip_txt">앞 단계에서 입력된 행사내용을 확인하는 단계입니다. <br>수정을 원할 경우 해당 단계로 다시 이동하여 수정 가능 합니다. 모바일DM도 신세계 전용 템플릿을 활용하여 손쉽게 작성 하실 수 있습니다.</div>
  <div class="c_write_5">
    <div class="channel_wrap1">
      <p class="tit">발송채널 선택<span>고객접근방식을 선택해 주세요.</span></p>
      <ul class="way_list">
      
      
        <!-- 모바일 DM 영역 시작 -->      
        <li class="way1" id="dm_div"><!-- 클릭시 class="on" 추가 -->
          
          <!-- 선택 안함 -->
          <div class="cnt_off" id="dm_off"><!-- 초기화면 display:block, 클릭시 display:none -->
            <strong>모바일DM</strong>
            <p>카탈로그 형식으로 제작하여 발송할 수 있습니다.</p>
          </div>
          <!-- 선택 안함 -->
          
          
          <!-- 선택 -->
          <div class="cnt_on" id="dm_on"><!-- 초기화면 display:none, 클릭시 display:block -->
            <strong>모바일DM</strong>
            <p>카탈로그 형식으로 제작하여 발송할 수 있습니다.</p>
            <a href="javascript:eDMPopup();" id="edm_a" >제작하기</a>
            <input type="text" class="dm_url" placeholder="제작완료 후 URL 붙여넣기" id="edm_url" onblur="javascript:inputCheck('3','100',this.value);">
            
            <form id="fileForm" method="post" enctype="Multipart/form-data">
            <div class="img_wrap">
              <ul>
                <li>
                  <div class="file_input">
                    <label>
                      첨부하기
                      <input type="file" id="file_input1" name="file_input1" accept="image/jpeg" style="cursor: pointer;">
                    </label>
                    <input type="text" readonly="readonly" title="" id="link_url1" placeholder="이미지를 업로드 해주세요.">
                    <a href="javascript:file_delete('1');" class="file_cancel">파일삭제</a>
                  </div>
                </li>
                <li>
                  <div class="file_input">
                    <label>
                      첨부하기
                      <input type="file" id="file_input2" name="file_input2" accept="image/jpeg" style="cursor: pointer;">
                    </label>
                    <input type="text" readonly="readonly" title="" id="link_url2" placeholder="이미지를 업로드 해주세요.">
                    <a href="javascript:file_delete('2');" class="file_cancel">파일삭제</a>
                  </div>
                </li>
              </ul>
            </div>
            </form>
          </div>
          <!-- 선택 -->
          
        </li>
        <!-- 모바일 DM 영역 종료 -->
        
        
        
        
        <!-- MMS 영역 시작 -->
        <li class="way2"><!-- 클릭시 class="on" 추가 -->
        
          <!-- 선택 안함 -->
          <div class="cnt_off" id="mms_off"><!-- 초기화면 display:block, 클릭시 display:none -->
            <strong>이미지</strong>
            <p>이미지를 첨부하여 발송할 수 있습니다.</p>
          </div>
          <!-- 선택 안함 -->
          
          <!-- 선택 -->
          <div class="cnt_on" id="mms_on"><!-- 초기화면 display:none, 클릭시 display:block -->
            <strong>이미지</strong>
            <p>이미지를 첨부하여 발송할 수 있습니다.</p>
            <form id="fileForm2" method="post" enctype="Multipart/form-data">
            <div class="img_wrap">
              <ul>
                <li>
                  <div class="file_input">
                    <label>
                      첨부하기
                      <input type="file" id="file_input3" name="file_input3" accept="image/jpeg" style="cursor: pointer;">
                    </label>
                    <input type="text" readonly="readonly" title="" id="link_url3" placeholder="이미지를 업로드 해주세요.">
                    <a href="javascript:file_delete('3');" class="file_cancel">파일삭제</a>
                  </div>
                </li>
                <li>
                  <div class="file_input">
                    <label>
                      첨부하기
                      <input type="file" id="file_input4" name="file_input4" accept="image/jpeg" style="cursor: pointer;">
                    </label>
                    <input type="text" readonly="readonly" title="" id="link_url4" placeholder="이미지를 업로드 해주세요.">
                    <a href="javascript:file_delete('4');" class="file_cancel">파일삭제</a>
                  </div>
                </li>
              </ul>
            </div>
            </form>
          </div>
          <!-- 선택 -->
        </li>
        <!-- MMS 영역 종료 -->
        
        
        
        
        <!-- LMS 영역 시작 -->
        <li class="way3"><!-- 클릭시 class="on" 제어 -->
          <div class="cnt_off" id="lms_off">
            <strong>LMS</strong>
            <p>이미지, 모바일DM 없이<br>텍스트로만 작성하여 발송하는 문자 입니다.</p>
          </div>
        </li>
        <!-- LMS 영역 종료 -->
        
        
      </ul>
    </div>
    <div class="channel_wrap2">
      <div class="txt_wrap">
        <p class="tit">발송문구 확인</p>
        <div class="txt_info">
          <p>STEP 1 과 STEP 2 에서 입력된 내용을 최종적으로 확인해 주세요.<br>수정하기 버튼을 누르면 행사명과 행사설명을 수정할 수 있습니다.<br>행사일정 및 브랜드 혜택 내용 등을 수정 원하실 경우 STEP 1 에서 수정가능합니다.</p>
          <a href="javascript:campUpdate();" id="camp_update_button">수정하기</a>
        </div>
        <div class="txt_list">
          <ul>
            <li>
              <div class="event_nm">
                <span>행사명</span>
                <input type="text" id="msg_camp_nm" onblur="javascript:inputCheck('2','50',this.value,'msg_camp_nm');">
              </div>
            </li>
            <li class="event_cnt">
              <span>행사설명</span>
              <textarea id="msg_camp_desc" onblur="javascript:inputCheck('2','1000',this.value,'msg_camp_desc');"></textarea>
            </li>
            <li>
              <span>행사 일정</span>
              <p id="msg_camp_dt"></p>
            </li>
            <li>
              <div class="wd50 mr20">
                <span>행사 점포</span>
                <p id="msg_store_nm"></p>
              </div>
              <div class="wd50">
                <span>행사 장소</span>
                <p id="msg_evt_flr"></p>
              </div>
            </li>
            <li>
              <div class="wd50 mr20">
                <span>채널 발송일</span>
                <p id="msg_chan_tran_dt"></p>
              </div>
              <div class="wd50">
                <span>발송예상고객</span>
                <p id="msg_chan_tran_prdt_cust_cnt"></p>
              </div>
            </li>
            <li>
              <div class="wd40 mr20">
                <span>브랜드 컨텐츠1</span>
                <p id="msg_bran_offer1"></p>
              </div>
              <div class="wd60">
                <p id="msg_bran_offer1_desc"></p>
              </div>
            </li>
            <li>
              <div class="wd40 mr20">
                <span>브랜드 컨텐츠2</span>
                <p id="msg_bran_offer2"></p>
              </div>
              <div class="wd60">
                <p id="msg_bran_offer2_desc"></p>
              </div>
            </li>
            <li>
              <div class="wd40 mr20">
                <span>브랜드 컨텐츠3</span>
                <p id="msg_bran_offer3"></p>
              </div>
              <div class="wd60">
                <p id="msg_bran_offer3_desc"></p>
              </div>
            </li>
            <li>
              <div class="wd20"><span>신세계 프로모션1</span></div>
              <div class="wd80"><p id="msg_offer1"></p></div>
            </li>
            <li>
              <div class="wd20"><span>신세계 프로모션2</span></div>
              <div class="wd80"><p id="msg_offer2"></p></div>
            </li>
            <li>
              <div class="wd20"><span>신세계 프로모션3</span></div>
              <div class="wd80"><p id="msg_offer3"></p></div>
            </li>
            <li>
              <div class="wd20"><span>신세계 프로모션4</span></div>
              <div class="wd80"><p id="msg_offer4"></p></div>
            </li>
          </ul>
          <div class="number_wrap">
            <div>
              <p>매장 전화번호</p>
              <input type="text" id="shop_phone_no" maxlength="13" onblur="javascript:phoneNumberCheck('shop_phone_no');">
            </div>
            <div>
              <p>전송번호</p>
              <input type="text" id="send_telno"  maxlength="13" onblur="javascript:phoneNumberCheck('send_telno');">
            </div>
          </div>
        </div>
      </div>
      <div class="view_wrap">
        <p class="tit">발송문구 미리보기</p>
        <div class="view_cnt">
          <input type="text" id="scrt_ttl" placeholder="메시지 제목 작성 영역..." onblur="javascript:inputCheck('2','128',this.value,'scrt_ttl');">
          <div id="script" class="cont_wrap"></div>
          <p id="scrt_add_cont"></p>
          <div class="btn_wrap">
            <span id="script_byte">0 Byte</span>
          </div>
        </div>
        <div class="number_wrap">
          <p>테스트 발송번호</p>
          <input type="text" id="test_telno" maxlength="13" onblur="javascript:phoneNumberCheck('test_telno');">
          <a href="javascript:void(0);" onclick="javascript:messageSendTest();" id="test_a">Test전송</a>
        </div>
      </div>
    </div>
  </div>
  <div class="btn_box">
    <a href="javascript:preStep05();" class="btn_prev">이전단계</a>
    <a href="javascript:nextStep05();" class="btn_next">다음단계</a>
  </div>
</div>
<iframe id="ifrmTarget" name="ifrmTarget" width="0" height="0"></iframe>
