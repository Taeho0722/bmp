//숫자에 콤마넣기
function AddComma(strValue)
{
	var sum_data="", j=0;
	// strValue가 Number형으로 들어올 수 있기때문에 문자형으로 치환한 변수사용(버그의 원인이었음)
	var rawData = ""+strValue;

	if ((rawData == null) || (rawData == "NaN") || (rawData.length <= 3)) return strValue;
	if (rawData.indexOf(",") >= 0) rawData = DelComma(strValue);

	// 소수점 체크 (소수점이 없으면 문자열의 길이)
    var pos = rawData.indexOf(".");
    var pointPos = (pos < 0) ? rawData.length : pos;
    
	for (var i=rawData.length-1; i>=0 ; i--) {
		if (i < pointPos) {
			var ch = rawData.substring(i, i+1);
			// 소수점 위의 경우
			if (j == 3) {
				j = 0;
				if ((ch != "-") && (ch != "+")) sum_data = "," + sum_data;
			}
			sum_data = ch + sum_data;
			// 부호(+/-)면 중지
			if ((ch == "-") || (ch == "+")) break;
			j++;
		}
		else {
			// 소수점 아래의 경우
			sum_data = rawData.substring(i, i+1) + sum_data;
		}
	}
	return sum_data;
}


//숫자에 들어간 콤마 지우기
function DelComma(strValue)
{
	var sBuf = ""+strValue; /* 숫자로 인자가 넘어올 수 있기때문에 문자열처리 */
	if (sBuf.length < 1) return 0;
	var sum_data = "";
	for (i=0; i<sBuf.length; i++) if (sBuf.substring(i, i+1) != ",") sum_data += sBuf.substring(i, i+1);
	return sum_data;
}


/**
글자치환 
str = 원본문자
sep = 바꿀문자
pad = 치환문자
**/
function replaceAll(str,sep,pad){
while(str.indexOf(sep) > -1){
	str = str.replace(sep,pad);
}

return str;
}



function encodeURI(paramValue)
{
	return encodeURIComponent(paramValue);
}

function decodeURI(paramValue)
{
	return decodeURIComponent(paramValue);
}


/*
 * 입력값에 특정 문자(chars)가 있는지 체크
 * 특정 문자를 허용하지 않으려 할 때 사용
 * ex) if (containsChars(form.name,"!,*&^%$#@~;")) {
 *		 alert("이름 필드에는 특수 문자를 사용할 수 없습니다.");
 *	   }
 */
function containsChars(val, chars)
{
	for (var inx=0; inx<val.length; inx++)
		if (chars.indexOf(val.charAt(inx)) != -1) return true;

	return false;
}

/*
 * 입력값이 특정 문자(chars)만으로 되어있는지 체크
 * 특정 문자만 허용하려 할 때 사용
 * ex) if (!containsCharsOnly(form.blood,"ABO")) {
 *		 alert("혈액형 필드에는 A,B,O 문자만 사용할 수 있습니다.");
 *     }
 */
function containsCharsOnly(val, chars)
{
	for (var inx=0; inx<val.length; inx++){
		if (chars.indexOf(val.charAt(inx)) == -1) return false;
	}

	return true;
}

/*
 * 입력값이 알파벳인지 체크
 * 아래 isAlphabet() 부터 isNumComma()까지의 메소드가
 * 자주 쓰이는 경우에는 var chars 변수를 
 * global 변수로 선언하고 사용하도록 한다.
 * ex) var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 *	 var lowercase = "abcdefghijklmnopqrstuvwxyz"; 
 *	 var number	= "0123456789";
 *	 function isAlphaNum(val) {
 *		 var chars = uppercase + lowercase + number;
 *		 return containsCharsOnly(val,chars);
 *	 }
 */
function isAlphabet(val)
{
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	return containsCharsOnly(val, chars);
}

/*
 * 입력값이 알파벳 대문자인지 체크
 */
function isUpperCase(val)
{
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return containsCharsOnly(val, chars);
}

/*
 * 입력값이 알파벳 소문자인지 체크
 */
function isLowerCase(val)
{
	var chars = "abcdefghijklmnopqrstuvwxyz";
	return containsCharsOnly(val, chars);
}

/*
 * 입력값에 숫자만 있는지 체크
 */
function isNumber(val)
{
	var chars = ",0123456789";
	return containsCharsOnly(val, chars);
}



/*
 * 입력값에 전화번호 체크
 */
function isPhone(val)
{
	var chars = "0123456789-";
	return containsCharsOnly(val, chars);
}

/*
 * 소수점 체크
 */
function isNumber2(val)
{
	var chars = ".0123456789";
	return containsCharsOnly(val, chars);
}

/*
 * 입력값이 알파벳,숫자로 되어있는지 체크
 */
function isAlphaNum(val)
{
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	return containsCharsOnly(val, chars);
}

/*
 * 입력값이 사용자가 정의한 포맷 형식인지 체크
 * 자세한 format 형식은 자바스크립트의 'regular expression'을 참조
 */
function isValidFormat(val, format)
{
	return (val.search(format) != -1) ? true : false;
}

/*
 * 입력값이 이메일 형식인지 체크
 */
function isValidEmail(val)
{
	var format = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;
	return ((val == null) ? true : isValidFormat(val,format));
}

/*
 * 입력값이 전화번호 형식(숫자-숫자-숫자)인지 체크
 */
function isValidPhone(val)
{
	var format = /^(\d+)-(\d+)-(\d+)$/;
	return ((val == null) ? true : isValidFormat(val,format));
}

/*
 * 입력값의 길이가 len 이하인지 체크
 */
function isValidLength(val, len)
{
	return ((val.length > len) ? false : true);
}



/*
 * escape함수에서 null값으로 전송되는 %, +, 기호를 강제로 ASCII코드화처리
 * ASCII코드를 URL엔코딩하기 위한 사전작업....
 */
function getEscape(str)
{
	var d1, d2;
	d1 = str.replace(/\%/gi, "%25");
	d2 = d1.replace(/\+/gi, "%2B");
	return escape(d2);
}



/*
 * bean 에서 variable 혹은 textbox/textarea 로의 값 전송시 특수문자 디코딩
 */
function setDecode(val)
{
	return val.replace(/&amp;/g, "&")
						.replace(/&lt;/g, "<")
						.replace(/&gt;/g, ">")
						.replace(/&quot;/g, "\"")
						.replace(/\r\n/g, " ") 
						.replace(/\"/g, "˝")						
						.replace(/&#34;/g, "˝") // " 는 ˝로 대체
						.replace(/&#39;/g, "`"); // ' 는 `로 대체
}

/*
 * 입력값의 바이트 길이를 리턴
 */
function getByteLength(val)
{
	var byteLength = 0;
	for (var inx = 0; inx < val.length; inx++) {
		var oneChar = escape(val.charAt(inx));
		if (oneChar.length == 1) byteLength++;
		else if (oneChar.indexOf("%u") != -1) byteLength += 2;
		else if (oneChar.indexOf("%") != -1) byteLength += oneChar.length/3;
	}
	return byteLength;
}


/*
 * 입력값의 바이트 길이 제한된 값 리턴
 */
function getByteVal(val,byteVal)
{
	var byteValue = "";
	var byteLength = 0;
	for (var inx = 0; inx < val.length; inx++) {
		var oneChar = escape(val.charAt(inx));
		if (oneChar.length == 1) byteLength++;
		else if (oneChar.indexOf("%u") != -1) byteLength += 2;
		else if (oneChar.indexOf("%") != -1) byteLength += oneChar.length/3;
		
		//console.log("byteVal="+byteVal+"     byteLength="+byteLength);
		if(byteVal <= byteLength){break;}
		byteValue += val.charAt(inx);
		
	}
	return byteValue;
}



//날짜에 들어간 하이픈("-") 지우기(by 중용)
function sDelHypn(strDate)
{
	var sBuf = ""+strDate; /* 숫자로 인자가 넘어올 수 있기때문에 문자열처리 */
	if (sBuf.length < 1) return 0;
	var sum_data = "";
	for (i=0; i<sBuf.length; i++) if (sBuf.substring(i, i+1) != "-") sum_data += sBuf.substring(i, i+1);
	return sum_data;
}


/*------------------------------------------------------------------------------
* 함수명 : replace()
* 처리내용 : GET 전송시 특수문자함께 전송하는 방법
------------------------------------------------------------------------------*/
function get_replace(inum) {
    inum = inum.replace(/&/g,"%26");
    inum = inum.replace(/\+/g,"%2B");
    return inum;
}
/*----------------------------------------------------------------------------*/ 



/*------------------------------------------------------------------------------
* 처리내용 : 일정시간 딜레이 주기
* gap = millisecs
* ex ) cmdDelay(1000); //1초 딜레이
------------------------------------------------------------------------------*/
function cmdDelay(gap){
	var then, now;
	then = new Date().getTime();
	now = then;
	while((now - then) < gap){
		now = new Date().getTime(); //현재시간을 읽어 함수를 불러들인 시간과의 차를 이용하여 처리
	}
}


/*------------------------------------------------------------------------------
* null 처리
* 0으로 반환
------------------------------------------------------------------------------*/
function isNullZero(value){
	
	if(value == "" || value == null){
		value = 0;
	}
	
	return value;
}



/*------------------------------------------------------------------------------
* null 처리
* 0으로 반환
------------------------------------------------------------------------------*/
function isNull(value){
	
	if(value == null){
		value = "";
	}
	
	return value;
}


/*
 * 날짜 형식 체크 (return valid date)
 */
function setValidDate(strValue)
{
	var dayList = [ 31,29,31,30,31,30,31,31,30,31,30,31 ];

	if ((strValue != null) && (strValue != "")) {
		// Length check
		switch (strValue.length) {
			case 6:
				strValue = strValue.substring(0,4)+"-"+strValue.substring(4,6)+"-01";
				break;
			case 8:
				strValue = strValue.substring(0,4)+"-"+strValue.substring(4,6)+"-"+strValue.substring(6,8);
				break;
			case 10:
				break;
			default:
				cmdMessage(0, "날짜 형식이 아닙니다.\r\n\r\nyyyy-mm-dd 형식으로 입력하시기 바랍니다.");
				return "";
		}

		strValue = strValue.replace(/\./g, "-").replace(/\//g, "-");

		if (!/^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}/.test(strValue)) {
			cmdMessage(0, "입력된 날짜에 오류가 있습니다. 확인 후 저장하시기 바랍니다.");
			return "";
		}
		else {
			var ymd = strValue.split("-");
			if (!/[0-9]{4}/.test(ymd[0])) { cmdMessage(0, "입력된 연도(年度)가 잘못되었습니다."); return ""; }
			else if (!/[0-9]{2}/.test(ymd[1])) { cmdMessage(0, "입력된 월(月)이 잘못되었습니다."); return ""; }
			else if (!/[0-9]{2}/.test(ymd[2])) { cmdMessage(0, "입력된 일(日)이 잘못되었습니다."); return ""; }

			var mm = parseInt(ymd[1],10);
			var dd = parseInt(ymd[2],10);
			if ((mm < 1) || (mm > 12)) { cmdMessage(0, "입력된 월(月)이 범위를 벗어났습니다."); return ""; }
			else if ((dd < 1) || (dd > dayList[mm-1])) { cmdMessage(0, "입력된 일(日)이 범위를 벗어났습니다."); return ""; }
		}
	}

	return strValue;
}



/*
 * 날짜 형식 체크 (return valid date)
 */
function setValidDate2(strValue)
{
	var dayList = [ 31,29,31,30,31,30,31,31,30,31,30,31 ];

	if ((strValue != null) && (strValue != "")) {
		// Length check
		switch (strValue.length) {
			case 6:
				strValue = strValue.substring(0,4)+"."+strValue.substring(4,6)+".01";
				break;
			case 8:
				strValue = strValue.substring(0,4)+"."+strValue.substring(4,6)+"."+strValue.substring(6,8);
				break;
			case 10:
				break;
			default:
				cmdMessage(0, "날짜 형식이 아닙니다.\r\n\r\nyyyy.mm.dd 형식으로 입력하시기 바랍니다.");
				return "";
		}

		strValue = strValue.replace(/\./g, ".").replace(/\//g, ".");

		if (!/^[0-9]{4}[.]{1}[0-9]{2}[.]{1}[0-9]{2}/.test(strValue)) {
			cmdMessage(0, "입력된 날짜에 오류가 있습니다. 확인 후 저장하시기 바랍니다.");
			return "";
		}
		else {
			var ymd = strValue.split(".");
			if (!/[0-9]{4}/.test(ymd[0])) { cmdMessage(0, "입력된 연도(年度)가 잘못되었습니다."); return ""; }
			else if (!/[0-9]{2}/.test(ymd[1])) { cmdMessage(0, "입력된 월(月)이 잘못되었습니다."); return ""; }
			else if (!/[0-9]{2}/.test(ymd[2])) { cmdMessage(0, "입력된 일(日)이 잘못되었습니다."); return ""; }

			var mm = parseInt(ymd[1],10);
			var dd = parseInt(ymd[2],10);
			if ((mm < 1) || (mm > 12)) { cmdMessage(0, "입력된 월(月)이 범위를 벗어났습니다."); return ""; }
			else if ((dd < 1) || (dd > dayList[mm-1])) { cmdMessage(0, "입력된 일(日)이 범위를 벗어났습니다."); return ""; }
		}
	}

	return strValue;
}



/*
 * 메시지 창
 * (0:경고, 1:Yes/No, 2:필수입력, 3:필수선택, 4:공백여부, 5:삭제여부, 6:관련삭제여부)
 */
function cmdMessage(gubun, strMsg)
{
	switch (gubun) {
		case 0:
			alert(strMsg);
			break;
		case 1:
			return confirm(strMsg);
			break;
		case 2:
			alert("["+strMsg+"] 항목을 입력 하세요.");
			break;
		case 3:
			alert("["+strMsg+"] 항목을 선택 하세요.");
			break;	
		case 4:
			return confirm("["+strMsg+"] 항목을 공백으로 저장하시겠습니까?");
			break;
		case 5:
			if (strMsg != "") return confirm("["+strMsg+"]\r\n\r\n이 항목을 삭제하시겠습니까?");
			else return confirm("이 항목을 삭제하시겠습니까?");
			break;
		 case 6:
			return confirm("관련된 항목이 모두 삭제됩니다.\r\n\r\n삭제하시겠습니까?");
			break;
		 default: break;
	}
}


//날짜에 들어간 하이픈("-") 지우기
function sDelHypn(strDate)
{
	var sBuf = ""+strDate; /* 숫자로 인자가 넘어올 수 있기때문에 문자열처리 */
	if (sBuf.length < 1) return 0;
	var sum_data = "";
	for (i=0; i<sBuf.length; i++) if (sBuf.substring(i, i+1) != "-") sum_data += sBuf.substring(i, i+1);
	return sum_data;
}



/*
날짜 계산(개월수, 일수)  함수
sdate 	: 시작일
fdate	: 종료일
type	: 'D':일수   'M':월수
*/
function getCalDate(sdate, fdate, type){
	var strSdt 	= new Date(sdate.substring(0,4), sdate.substring(4,6)-1, sdate.substring(6,8));
	var strFdt 	= new Date(fdate.substring(0,4), fdate.substring(4,6)-1, fdate.substring(6,8));
	var strGdt 	= 0;
	
	if(type == "D"){//일수 차이
		strGdt = ( (strFdt.getTime() - strSdt.getTime()) / (1000*60*60*24)) + 1;
	}else{
		if(sdate.substring(0,4) == fdate.substring(0,4)){
			strGdt = sdate.substring(4,6) * 1 - fdate.substring(4,6) * 1; 
		}else{
			strGdt = Math.floor((strFdt.getTime() - strSdt.getTime()) / (1000*60*60*24*365.25/12)); 
		}
	}
	  
	return strGdt;
}


/* 반올림함수 
 * val : 대상숫자
 * pos : 원하는 소수점 이하 자리수
 */
function exRound(val, pos)
{
    var rtn;
    rtn = Math.round(val * Math.pow(10, Math.abs(pos)-1))
    rtn = rtn / Math.pow(10, Math.abs(pos)-1)
   
    return rtn;
}

/* 올림함수 
 * val : 대상숫자
 * pos : 원하는 소수점 이하 자리수
 */
function exCeil(val, pos)
{
    var rtn;
    rtn = Math.ceil(val * Math.pow(10, Math.abs(pos)-1))
    rtn = rtn / Math.pow(10, Math.abs(pos)-1)
   
    return rtn;
}


/* 내림함수 
 * val : 대상숫자
 * pos : 원하는 소수점 이하 자리수
 */
function exFloor(val, pos)
{
    var rtn;
    rtn = Math.floor(val * Math.pow(10, Math.abs(pos)-1))
    rtn = rtn / Math.pow(10, Math.abs(pos)-1)
   
    return rtn;
}

//전화번호
function formatPhone(phoneNum) {
	if(isPhone(phoneNum)) { 
		var rtnNum; var regExp =/(02)([0-9]{3,4})([0-9]{4})$/;
		var myArray; 
		if(regExp.test(phoneNum)){
			myArray = regExp.exec(phoneNum);
			rtnNum = myArray[1]+'-' + myArray[2]+'-'+myArray[3]; 
			return rtnNum; 
		} else {
			regExp =/(0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/;
			if(regExp.test(phoneNum)){
				myArray = regExp.exec(phoneNum); 
				rtnNum = myArray[1]+'-'+myArray[2]+'-'+myArray[3]; 
				return rtnNum;
			} else {
				return phoneNum;
			} 
		}
	} else {
		return phoneNum
	}
}


/** * 전화번호 형식 체크 * * @param 데이터 */ 
function isPhone(phoneNum) { //
	var regExp =/(02|0[3-9]{1}[0-9]{1})[1-9]{1}[0-9]{2,3}[0-9]{4}$/; 
	var regExp =/(02)([0-9]{3,4})([0-9]{4})$/; 
	var myArray; 
	if(regExp.test(phoneNum)){ 
		myArray = regExp.exec(phoneNum); // 
		return true; 
	} else { 
		regExp =/(0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/; 
		if(regExp.test(phoneNum)){
			myArray = regExp.exec(phoneNum); 
			return true;
		} else { 
			return false; 
		} 
	}
}



/** * 핸드폰번호 포맷으로 변환 * * @param 데이터 */ 
function formatMobile(phoneNum) { 
	if(isMobile(phoneNum)) { 
		var rtnNum; 
		var regExp =/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/; 
		var myArray; 
		if(regExp.test(phoneNum)){ 
			myArray = regExp.exec(phoneNum); 
			rtnNum = myArray[1]+'-'+myArray[2]+'-'+myArray[3]; 
			return rtnNum; 
		} else { 
			return phoneNum; 
		} 
	} else { 
		return phoneNum; 
	} 
}


/** * 핸드폰번호 형식 체크 * * @param 데이터 */ 
function isMobile(phoneNum) { 
	var regExp =/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/; 
	var myArray; 
	if(regExp.test(phoneNum)){
		myArray = regExp.exec(phoneNum); 
		return true; 
	} else { 
		return false; 
	} 
}







