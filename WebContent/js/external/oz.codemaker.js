var IDDic = {};
var TypeDic = {};
var ip_itemIDDic = {};
var ip_itemTypeDic = {};
var op_itemIDDic = {};
var op_itemTypeDic = {};
var Nex_itemlist = {};

function SetDic(IDDicfrom, TypeDicfrom){
	IDDic = IDDicfrom;
	TypeDic= TypeDicfrom
}

function ClearDic(){
	ip_itemTypeDic = {};
	op_itemIDDic = {};
	op_itemTypeDic = {};
	Nex_itemlist = {};
}

function getType(text, in_out){
	var orgtext = text;
	var Type = "";
	var TextTypeDic = {};
	
	if(fStrCnt(text, "{") != fStrCnt(text, "}")){
		ozf_MsgBox(ozf_getresource('m_Notmatch1', '{, } 의 사용이 올바르지 않거나 개수가 일치하지 않습니다.'));
		return false;
	}
	if(fStrCnt(text, "(") != fStrCnt(text, ")")){
		ozf_MsgBox(ozf_getresource('m_Notmatch2', '(, ) 의 사용이 올바르지 않거나 개수가 일치하지 않습니다.'));
		return false;
	}
	//exe ContDic, Item Check
	var temptype = "";
	if(text.indexOf("{") >= 0){
		TextTypeDic = ContDic(text, in_out);
		for (var key in TextTypeDic) {
			if(temptype != "" && temptype != TextTypeDic[key]){
				ozf_MsgBox(ozf_getresource('m_Notmatch3', orgtext + '에 사용된 Item Type이 서로 다릅니다.'));
				return false;
			}
			temptype = TextTypeDic[key];
			Type = temptype;
			//console.log(key + "  :  " + temptype);
		}
	}
	//Text Check
	text = text.trim().replace(/ /gi, "").replace(/\(/g, "").replace(/\)/g, "");
	var textlist = text.split(/[-,*+=<>!&/%]/);
	temptype = "";
	for(var i=0;i<textlist.length;i++){
		if(textlist[i].indexOf("{") == -1 && textlist[i] != ""){
			if(Type == ""){
				if(isNumber(textlist[i])){
					Type = "NUMERIC";
					temptype = "NUMERIC";
				}else{
					Type = "STRING";
					temptype = "STRING";
				}
			}
			if((isNumber(textlist[i]) && Type == "STRING") || (isNumber(textlist[i]) == false && Type == "NUMERIC") ){
				ozf_MsgBox(ozf_getresource('m_Notmatch4', orgtext + '에서 사용된 Item과 입력값의 Type이 일치 하지 않습니다.'));
				return false;
			}else if((isNumber(textlist[i]) && temptype == "STRING") || (isNumber(textlist[i]) == false && temptype == "NUMERIC") ){
				ozf_MsgBox(ozf_getresource('m_Notmatch4', orgtext + ' 입력값들의 Type이 일치 하지 않습니다.'));
				return false;
			}
			
			if(isNumber(textlist[i])){
				temptype = "NUMERIC";
			}else{
				temptype = "STRING";
			}
			//console.log(textlist[i] + "  :  " + temptype);
		}
	}
	return Type;
}

function isNumber(s) {
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s == '' || isNaN(s)) return false;
  return true;
}

function CreateJavaCode(eq, optr, va, in_out){
	var eqrst = "";
	var varst = "";
	var Code = "";
	
	optr = optr.replace("<&gt;", "!=").replace("&gt;", ">").replace("&lt;", "<");
	
	//eq-----------------------------------------------------------------------------------------
	if(optr != "IN" && optr != "NOT IN"){
		eqrst = eq.trim().replace(/ /gi, "").replace(/\(/g, "").replace(/\)/g, "");
		var textlist = eqrst.split(/[-,*+=<>!&/%]/);
		for(var i=0;i<textlist.length;i++){
			if(textlist[i].indexOf("{") == -1 && isNumber(textlist[i])){
				var number = textlist[i];
				eqrst = eqrst.replace(number + "+", number + "d +").replace(number + "-", number + "d -").replace(number + "*", number + "d *").replace(number + "/", number + "d /").replace(number + "%", number + "d %").replace(number + ",", number + "d ,").replace(number + ")", number + "d)");
				if(eqrst.slice(-number.length) == number){
					eqrst = eqrst.slice(0, eqrst.length - number.length) + number + "d";
				}
			}
		}
	}
	
	var eq_itemdic = ContDic(eq, in_out);
	for (var key in eq_itemdic) {
		if(eq_itemdic[key] == "STRING"){
			eqrst = eq.replace("{" + key, "get('" + key).replace(key + "}", key + "')"); 
		}else if(eq_itemdic[key] == "NUMERIC"){
			eqrst = eq.replace("{" + key, "Double.parseDouble(get('" + key).replace(key + "}", key + "'))"); 
		}	
	}
	
	//va-----------------------------------------------------------------------------------------
	if(optr != "IN" && optr != "NOT IN"){
		varst = va.trim().replace(/ /gi, "").replace(/\(/g, "").replace(/\)/g, "");
		var textlist = va.split(/[-,*+=<>!&/%]/);
		for(var i=0;i<textlist.length;i++){
			if(textlist[i].indexOf("{") == -1 && isNumber(textlist[i])){
				var number = textlist[i];
				varst = varst.replace(number + "+", number + "d +").replace(number + "-", number + "d -").replace(number + "*", number + "d *").replace(number + "/", number + "d /").replace(number + "%", number + "d %").replace(number + ",", number + "d ,").replace(number + ")", number + "d)");
			}
		}
	}
	
	var va_itemdic = ContDic(va, in_out);
	for (var key in va_itemdic) {
		if(va_itemdic[key] == "STRING"){
			varst = va.replace("{" + key, "get('" + key).replace(key + "}", key + "')"); 
		}else if(va_itemdic[key] == "NUMERIC"){
			varst = va.replace("{" + key, "Double.parseDouble(get('" + key).replace(key + "}", key + "'))"); 
		}	
	}
	
	var Type = getType(eq + optr + va, in_out);
	var eqlist = eq.split(/[,=<>!&]/);
	var valist = va.split(/[,=<>!&]/);
	if(valist.length > 1){
		ozf_MsgBox(ozf_getresource('m_OptrErr2', optr + ' 다음 값에 올수 없는 문자가 존재 합니다. : ' + eq + optr + va));
		return false;
	}else if(eqlist.length > 1){
		ozf_MsgBox(ozf_getresource('m_OptrErr2', optr + ' 앞에 올수 없는 문자가 존재 합니다. : ' + eq + optr + va));
		return false;
	}
	
	if(Type == "STRING" && (optr != "IN" && optr != "LIKE" && optr != "NOT IN" )){
			eqrst = "(" + eqrst + ")";
			Code = "(" + eqrst + ").compareTo(" + varst + ")" + optr + "0";
	}else if(Type == "NUMERIC" && (optr != "IN" && optr != "LIKE" && optr != "NOT IN" )){
			Code = eqrst + optr + varst;
	}else if(optr == "IN"){
		if(Object.keys(va_itemdic).length > 0){
			ozf_MsgBox(ozf_getresource('m_OptrErr1', 'IN 다음 값에는 Item을 사용 할 수 없습니다. : ' + eq + optr + va));
			return false;
		}else{
			Code = "(obzFunction.operatorIN(" + eqrst + "'" + varst.replace(/"/gi, "") + "')";
		}
	}else if(optr == "NOT IN"){
		if(Object.keys(va_itemdic).length > 0){
			ozf_MsgBox(ozf_getresource('m_OptrErr2', 'NOT IN 뒤에 오는 값에는 Item을 사용 할 수 없습니다.'));
			return false;
		}else{
			Code = "(obzFunction.operatorNOT_IN(" + eqrst + "'" + varst.replace(/"/gi, "") + "')";
		}
	}else if(optr == "LIKE"){
		if(Type == "NUMERIC"){
			ozf_MsgBox(ozf_getresource('m_OptrErr3', '숫자형 연산에서는 LIKE를 사용 할 수 없습니다. ' + eq + optr + va));
			return false;
		}else{
			if(Object.keys(eq_itemdic).length > 1){
				ozf_MsgBox(ozf_getresource('m_OptrErr4', 'LIKE 앞에 하나의 ITEM만 사용 가능 합니다. ' + eq + ' 를 수정해 주세요.'));
				return false;
			}else{
				Code = "(obzFunction.operatorLIKE(" + eqrst + "'" + varst.replace(/"/gi, "") + "')";
			}
		}
	}
	
	
	return Code;
}

//GetUseItem, ItemCheck
function ContDic(text, in_out){
	var TextTypeDic = {};
	var iMaxLen = text.length;
	var iln = text.indexOf("{");
	var Eln = 0;
	var itemName = ""; 
	while (iln >= 0) {
		text = text.substring(iln + 1);
		Eln = text.indexOf("}");
		itemName = text.substring(0, Eln);
		
		if(itemName in IDDic == false){
			Nex_itemlist[itemName] = itemName;
		}else if(in_out.equals("in")){
			if(itemName in ip_itemIDDic == false && itemName in IDDic){
				ip_itemIDDic[itemName] = IDDic[itemName];
				ip_itemTypeDic[itemName] = TypeDic[itemName];
			}
		}else if(in_out.equals("out")){
			if(itemName in op_itemIDDic == false && itemName in IDDic){
				op_itemIDDic[itemName] = IDDic[itemName];
				op_itemTypeDic[itemName] = TypeDic[itemName];
			}
		}
		
		if(itemName in IDDic){
			TextTypeDic[itemName] = TypeDic[itemName];
		}
		
		iln = text.indexOf("{");
	}
	return TextTypeDic;
}

//Char Count
function fStrCnt(SrcStr, DestChar){
	var intCnt = 0;
	var chrTmp = "";
	
	for (var i = 0, len = SrcStr.length; i < len; i++) {
		chrTmp = SrcStr.substring(i, i+1);
		if (chrTmp == DestChar){
			intCnt += 1;
		}
	}
	
	return intCnt;
}