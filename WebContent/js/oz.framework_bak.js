var ozfmsgtitle = "information";
// Create Base64 Object
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = 0; var c1 = 0; var c2 = 0; var c3; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
var gVarFrameLetterParameter = "${FrameLetterStamp.tmp}$";
var gVarTempContentFrameGroupName = "GroupFramelocal";

/*--------------------------------------------------
  기능   : String
----------------------------------------------------*/
//문자열 다듬기
String.prototype.trim = function () {
    var trimmed = this.replace(/^\s+|\s+$/g, '');
    return trimmed;
};
//문자열의 왼쪽 다듬기
String.prototype.ltrim = function () {
    var trimmed = this.replace(/^\s+/g, '');
    return trimmed;
};
//문자열의 오른쪽 다듬기
String.prototype.rtrim = function () {
    var trimmed = this.replace(/\s+$/g, '');
    return trimmed;
};
//문자열 같은지 체크
String.prototype.equals = function (str) {
    if (this == str) {
        return true;
    } else {
        return false;
    }
};
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (str, strToSearch) {
        var strSearchLength = strToSearch.length;
        if (!str || !strToSearch) return false;
        if (str.substring(str.length - strSearchLength, str.length) === strToSearch) {
            return true;
        } else return false;
    }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return str.length > 0 && this.substring(0, str.length) === str;
    }
}
//문자열 파싱
if (!String.prototype.split) {
    String.prototype.split = function (del) {
        return ozf_SplitString(this, del);
    };
}
if (!Date.prototype.addMonths) {
    Date.prototype.addMonths = function (val) {
        var newDate = this;
        newDate.setMonth(newDate.getMonth() + val);
    };
}
if (!Date.prototype.addDays) {
    Date.prototype.addDays = function (val) {
        var newDate = this;
        newDate.setDate(newDate.getDate() + val);
    };
}
if (!Date.prototype.addYears) {
    Date.prototype.addYears = function (val) {
        var newDate = this;
        newDate.setYear(newDate.getFullYear() + val);
    };
}
if (!Date.prototype.replace) {
    Date.prototype.replace = function (find,replacement) {
        var newDate = this;
        var newStr;
        newStr = ozf_ConvertDateFormat(newDate, "yyyy-MM-dd");
        //ozf_ReplaceString(newStr, find, replacement);
        //return newStr;
        return newStr.replace(find, replacement);
    };
}

/*--------------------------------------------------
  기능   : Array
----------------------------------------------------*/
//배열 개수 반환
Object.defineProperty(Array.prototype, 'Count', {
    get: function () {
        return this.length;
    },
    set: function (val) {
        
    }
});
//해당 인덱스 아이템 반환
Array.prototype.Item = function (val) {
    return this[val];
};
/*--------------------------------------------------
  기능   : Date 객체 ToShortDateString 함수 정의
----------------------------------------------------*/
function ozf_ToShortDateString(d) {
    if (d == null) { return "0001-01-01"; }
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = d.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
}

/*--------------------------------------------------
  기능   : String Builder
----------------------------------------------------*/
var ozf_stringbuilder = function () {
    this.buffer = new Array();
}
//순서대로 문자열을 추가한다.
ozf_stringbuilder.prototype.append = function (strvalue) {
    this.buffer[this.buffer.length] = strvalue;
}
//순서대로 문자열에 NewLine을  붙여서 자동으로 추가한다.
ozf_stringbuilder.prototype.appendline = function (strvalue) {
    this.buffer[this.buffer.length] = strvalue + '\n\r';
}
//문자열의 형식을 지정해서 추가한다.
ozf_stringbuilder.prototype.appendformat = function () {
    var count = arguments.length;
    if (count < 2) return "";
    var strvalue = arguments[0];
    for (var i = 1; i < count; i++) {
        strvalue = strvalue.replace('{' + (i - 1) + '}', arguments[i]);
    }
    this.buffer[this.buffer.length] = strvalue;
}
//해당하는 위치에 문자열을 추가한다.
ozf_stringbuilder.prototype.insert = function (idx, strvalue) {
    this.buffer.splice(idx, 0, strvalue);
}
//해당문자열을 새로운 문자열로 바꾼다.
//배열 단위로 바꾸므로 배열 사이에 낀 문자열은 바꾸지 않음.
ozf_stringbuilder.prototype.replace = function (from, to) {
    for (var i = this.buffer.length - 1; i >= 0; i--) {
        this.buffer[i] = this.buffer[i].replace(new RegExp(from, "g"), to);
    }
}
//문자열로 반환한다.
ozf_stringbuilder.prototype.toString = function () {
    return this.buffer.join("");
}

/*---------------------------------------------------
  기능   : Parse XML
  RETURN :  XML DomParser
----------------------------------------------------*/
//get XMLDomParser
function ozf_getXMLDoc(xml) {
    var xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xml);
    }
    return xmlDoc;
}

/**
 * @description 지정된 경로의 모든 노드를 찾아 반환한다.
 * @param xPnode 부모 노드
 * @param path 노드 경로 (ex) /List/Item/Names
 * @returns null or 노드 배열
 */
function ozf_getSelectedNodes(xPnode, path) {
    if (ozf_StringIsEmpty(path) == true) {
        return null;
    }

    if (path.startsWith('/')) {
        path = ozf_mid(path, 2, path.length - 1);
    }

    var i, j;
    var list = path.split("/")
    var xfind;
    var xnode;
    var xnodelist = [];

    xfind = ozf_findNodeByTagName(xPnode.children, list[0]);
    if (list.slice(1).length == 0) {
        return xfind;
    }
    else {
        for (j = 0; j < xfind.length; j++) {
            xnodelist = xnodelist.concat(ozf_getSelectedNodes(xfind[j], list.slice(1).join("/")));
        }
    }

    if (xnodelist.length === 0) {
        return null;
    } else {
        return xnodelist;
    }
}

/**
 * @description 노드 배열에서 해당 태그이름을 가진 노드 배열 반환.
 * @param xPnode 노드 배열
 * @param path 태그 이름 (ex) "LogicOperator"
 * @returns 노드 배열
 */
function ozf_findNodeByTagName(nodelist, name){
   var resultarr = new Array();
   for(var i=0; i<nodelist.length; i++) {
      if (nodelist[i].tagName == name) {
         resultarr.push(nodelist[i]);
      }
   }
   return resultarr;
}

//get XML Node
function ozf_getSelectedSingleNode(xPnode, path) {
    if (ozf_StringIsEmpty(path) == true){
        return null;
    }

    if (path.startsWith('/')) {
        path = ozf_mid(path, 2, path.length - 1);
    }

    var i;
    var list = path.split("/")
    var xfind;
    var xnode;

    for (i = 0; i < list.length; i++) {
        if (i === 0) {
            xfind = xPnode.getElementsByTagName(list[i]);
            if (xfind.length > 0) {
                xnode = xfind[0];
            } else {
                return null;
            }
        } else {
            xfind = xnode.getElementsByTagName(list[i]);
            if (xfind.length > 0) {
                xnode = xfind[0];
            } else {
                return null;
            }
        }
    }
    return xnode;
}
/*--------------------------------------------------
  기능   : 메타 영역
----------------------------------------------------*/
function ozf_GetItemRegion(ozid) {
    if (ozid != "") {
        switch (ozid.substring(0, 2)) {
            case "20":
                return "manage";
            case "25":
                return "manage";
            case "21":
                return "public";
            case "26":
                return "public";
            case "22":
                return "private";
            case "27":
                return "private";
            default:
                return "";
        }
    }
    else {
        return "";
    }
}

/*--------------------------------------------------
  기능   : 문자열 Byte 수 계산
  INPUT  : str : 문자열
  RETURN : 
----------------------------------------------------*/
function ozf_ByteCount(str) {
    stringByteLength = (function (s, b, i, c) {
        for (b = i = 0; c = s.charCodeAt(i++) ; b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b
    })(str);
    return stringByteLength;
}

//win: FramePage의 window
function gRefMain(win) {
    var aDiv = win.frameElement.parentElement;
    if (aDiv.className.indexOf("popup") >= 0) {
        //'Pop window
        var pParent = win.parent.parent;
        while (pParent.frameElement != null) {
            pParent = pParent.parent;
        }
        return pParent; //win.parent.parent;
    }
    else { //'iFrame에 포함된 경우
        return win.parent;
    }
}
/*--------------------------------------------------
  기능   :  지정한 페이지 열기
  Input  : Sender : 이 함수를 호출한 FramePage의 window
  			   PageCaption : 창 헤더
  				 PageAddrPath : 페이지 경로
  				 ArgData  : Reserved
----------------------------------------------------*/
function ozf_OpenPage(Sender, PageCaption, PageAddrPath, ArgData) {
    Sender.OpenPage(PageCaption, PageAddrPath, ArgData);
}
/*--------------------------------------------------
  기능   :  현재 페이지 닫기
----------------------------------------------------*/
function ozf_ClosePage(Sender, PageAddrPath) {
    Sender.ClosePage(PageAddrPath);
}

/*--------------------------------------------------
기능   :  Dialog 창 열기 
HtmlName = "Abc.html" w="400px" h="260px"
Input  :   Sender : 이 함수를 호출한 FramePage의 window
  		   PageCaption : 창 헤더
  		   HtmlName : html이름
  		   w : 창 너비
  		   h : 창 높이
  		   tag : 다이얼로그 리턴 키
----------------------------------------------------*/
var dialogtimerid;
var readyexeinterval = 100; //화면 로드 후 스크립트 실행 interval
function ozf_OpenDialogOpenPage(Sender, PageCaption, HtmlName, w, h, tag, notdefinesize) {
    if (notdefinesize === null || notdefinesize === '' || notdefinesize === undefined) {
        notdefinesize = false;
    }
    var objid = 'dialogframe' + HtmlName;
    var refBody;
    var aDivPop;
    var aP;
    // var isEmbed;
    var pObj;
        
    // if (Sender.parentObjID == "" || Sender.parentObjID == undefined) {
    //     refBody = window.document.getElementsByTagName("body")[0];
    //     aDivPop = window.document.createElement("div");
    //     aP = window.document.createElement("object");
    //     isEmbed = false;
    // } else {
    //     pObj = ozf_Rootbodyframe(window.parent);
    //     refBody = pObj.document.getElementsByTagName("body")[0];
    //     aDivPop = pObj.document.createElement("div");
    //     aP = pObj.document.createElement("object");
    //     isEmbed = true
    // }

    pObj = ozf_Rootbodyframe(window);
    refBody = pObj.document.getElementsByTagName("body")[0];
    aDivPop = pObj.document.createElement("div");
    aP = pObj.document.createElement("object");

    // if (Sender.parentObjID == "" || Sender.parentObjID == undefined) {
    //     isEmbed = false;
    // } else {
    //     isEmbed = true;
    // }

    //if (Sender.parentObjID == "" || Sender.parentObjID == undefined) {
    //    refBody = window.document.getElementsByTagName("body")[0];
    //    aDivPop = window.document.createElement("div");
    //    aP = window.document.createElement("object");
    //    isEmbed = false;
    //} else {
    //    refBody = window.parent.document.getElementsByTagName("body")[0];
    //    aDivPop = window.parent.document.createElement("div");
    //    aP = window.parent.document.createElement("object");
    //    isEmbed = true
    //}

    var popupid = "popup" + HtmlName.replace('.html', '');

    aP.className = "clsIFrameDialog"
    aP.setAttribute("id", objid);
    var param = "./{0}?autostart:false;pdialogid:{1}".format(HtmlName, objid);
    aP.setAttribute("data", param);

    aDivPop.appendChild(aP);
    aDivPop.className = "popup"; //"modal";
    aDivPop.setAttribute("id", popupid);

    if (refBody.clientHeight < parseInt(h)) {
        h = refBody.clientHeight - 40;
    }

    if (refBody.clientWidth < parseInt(w)) {
        w = refBody.clientWidth;
    }

    aDivPop.style.width = w;
    aDivPop.style.height = h;
    refBody.appendChild(aDivPop);

    if (!notdefinesize) {
        h = parseInt(h) + 60; //for title space
        h = h + "px";
    }
    var pOpts = {
        width: w, height: h,
        showTitle: true,
        title: PageCaption,
        dragEnabled: true,
        closeOnOutsideClick: false,
        showCloseButton: false,
        resizeEnabled: true,
        animation: {
            show: { type: "fade", from: 0, to: 1 },
            hide: { type: "fade", from: 1, to: 0 }
        },
        toolbarItems: [
            {
                toolbar: "top",
                location: "after",
                widget: "dxButton",
                options: {
                    type: "default",
                    icon: "close",
                    onClick: function (e) {
                        //do_CloseModal();
                        //Sender.do_ModalCancel(tag);
                        var a = $(e.element.parents(".dx-popup"));
                        var b = a.find("object")[0];
                        b.contentDocument.defaultView.do_CloseModal();
                    }
                }
            }
        ]
    };
    var p;
    popupid = "#" + popupid;
    p = pObj.$(popupid).dxPopup(pOpts).dxPopup("instance");
    p.show();
}

function ozf_OpenDialogOpenPage2(Sender, PageCaption, HtmlName, w, h, tag, notdefinesize) {
    if (notdefinesize === null || notdefinesize === '' || notdefinesize === undefined) {
        notdefinesize = false;
    }
    var objid = 'dialog' + HtmlName;
    var refBody;
    var aDivPop;
    var aP;
    var isEmbed;
    var pObj;

    if (Sender.parentObjID == "" || Sender.parentObjID == undefined) {
        refBody = window.document.getElementsByTagName("body")[0];
        aDivPop = window.document.createElement("div");
        aP = window.document.createElement("object");
        isEmbed = false;
    } else {
        pObj = ozf_Rootbodyframe(window.parent);
        refBody = pObj.document.getElementsByTagName("body")[0];
        aDivPop = pObj.document.createElement("div");
        aP = pObj.document.createElement("object");
        isEmbed = true
    }

    //if (Sender.parentObjID == "" || Sender.parentObjID == undefined) {
    //    refBody = window.document.getElementsByTagName("body")[0];
    //    aDivPop = window.document.createElement("div");
    //    aP = window.document.createElement("object");        
    //    isEmbed = false;
    //} else {
    //    refBody = window.parent.document.getElementsByTagName("body")[0];
    //    aDivPop = window.parent.document.createElement("div");
    //    aP = window.parent.document.createElement("object");
    //    isEmbed = true
    //}

    aP.className = "clsIFrameDialog"
    aP.setAttribute("id", objid);
    var param = "./{0}?autostart:false;pdialogid:{1}".format(HtmlName, objid);    
    aP.setAttribute("data", param);
    aP.tag = Sender;
    //aP.setAttribute("data", "./" + HtmlName + "?autostart:false;pid:" + objid);

    aDivPop.appendChild(aP);
    aDivPop.className = "popup"; //"modal";
    var popupid = "popup" + HtmlName.replace('.html', '');
    aDivPop.setAttribute("id", popupid);

    if (refBody.clientHeight < parseInt(h)) {
        h = refBody.clientHeight - 40;
    }

    if (refBody.clientWidth < parseInt(w)) {
        w = refBody.clientWidth;
    }

    aDivPop.style.width = w;
    aDivPop.style.height = h;
    refBody.appendChild(aDivPop);

    if (!notdefinesize) {
        h = parseInt(h) + 60; //for title space
        h = h + "px";
    }    
    var pOpts = {
        width: w, height: h,
        showTitle: true,
        title: PageCaption,
        dragEnabled: true,
        closeOnOutsideClick: false,
        showCloseButton: false,
        animation: {
            show: { type: "fade", from: 0, to: 1 },
            hide: { type: "fade", from: 1, to: 0 }
        },
        toolbarItems: [
            {
                toolbar: "top",
                location: "after",
                widget: "dxButton",
                options: {
                    type: "default",
                    icon: "close",
                    onClick: function (e) {
                        Sender.do_ModalCancel(tag);
                    }
                }
            }
        ]
    };
    var p;
    popupid = "#" + popupid
    if (isEmbed == true) {
        p = pObj.$(popupid).dxPopup(pOpts).dxPopup("instance");
    } else {
        p = $(popupid).dxPopup(pOpts).dxPopup("instance");
    }
    p.show();
}

/**
 * 
 * @param cObj
 * @returns 다이얼로그 아니고 Embed도 아닌 부모 찾기
 */
function ozf_Rootbodyframe(cObj) {
    var p;
    if (cObj.document.defaultView.isEmbed != true && cObj.document.defaultView.ozController.isdialog != true) {
        p = cObj;
    } else {
        p = ozf_Rootbodyframe(cObj.parent);
    }
    return p;
}

/*--------------------------------------------------
  기능   : opener 얻는 함수
  Input  : Sender : 이 함수를 호출한 FramePage의 window
----------------------------------------------------*/
function ozf_GetOpener(Sender) {
    return Sender.gPopOwner;
}
/*--------------------------------------------------
  기능   : opener tag 얻는 함수
  Input  : Sender : 이 함수를 호출한 FramePage의 window
----------------------------------------------------*/
function ozf_GetOpenerTag(Sender) {
    return Sender.gPopTag;
}
/*--------------------------------------------------
  기능   : 다이얼로그 창 닫기
  Input  : Opener : 이 함수를 호출한 FramePage의 window
----------------------------------------------------*/
function ozf_CloseDialog(Opener) {
    Opener.CloseModal();
}

/*--------------------------------------------------
기능   : 콘솔 출력
----------------------------------------------------*/
function ozf_DebugPrint(text) {
    console.log(text);
}
/*--------------------------------------------------
기능   : 콘솔 출력
----------------------------------------------------*/
function ozf_DebugPrintLine(text) {
    console.log(text+'\n');
}

/*--------------------------------------------------
  기능   : 공유 영역에 값 저장
  Input  :  Sender      : 이 함수를 호출한 FramePage의 window
  			TempName    : key
  			TempContent : value
  			GroupName   : 그룹 이름
  			IsUpper		: true - value를 대문자로 바꿈
  Return :  true if ok, false if error
----------------------------------------------------*/
function ozf_SetTempContent(Sender, TempName, TempContent, GroupName, IsUpper) {
    if (IsUpper == true) {
        return Sender.SetTemp(TempName, TempContent.toUpperCase(), GroupName);
    }
    else {
        return Sender.SetTemp(TempName, TempContent, GroupName);
    }    
}

/*--------------------------------------------------
  기능   : 공유 영역에서 값 가져오기
  Input  :  Sender : 이 함수를 호출한 FramePage의 window
            TempName : key
  			IsDelete : 가져온 후 저장소에서 삭제할 지 여부(true/false)
  			GroupName : 그룹 이름
  Return :  TempVarValue if ok, "" if error
----------------------------------------------------*/
function ozf_GetTempContent(Sender, TempName, IsDelete, GroupName) {
    return Sender.GetTemp(TempName, IsDelete, GroupName);
}

/*--------------------------------------------------
  기능   :  메세지 박스
  Input  :  msg : 메세지
  			MsgType: 0 OK, 0 초과 Yes/No  
  			mtitle : 제목
  Return :  true(Yes), false(No)
----------------------------------------------------*/
function ozf_MsgBoxEx(msg, msgType, mtitle) {
    if (msgType == "0") { 
        ozf_MsgBox(msg);
    }
    else {
        return confirm(msg);
        //return DevExpress.ui.dialog.confirm(msg, mtitle);  //confirm(msg);
    }
}

/*--------------------------------------------------
  기능   :  메세지 박스
  Input  :  msg : 메세지
  			mtitle : 제목 
  Return :  true(Yes), false(No)
----------------------------------------------------*/
function ozf_MsgBoxYesNo(msg, mtitle) {
    if (typeof (mtitle) === "undefined") mtitle = "";
    var result;
    result = confirm(msg);
    if (result == true) {
        return "6";
    }
    else {
        return "7";
    }
}

/*--------------------------------------------------
기능   :  메세지 박스
Input  :  msg : 메세지
                callback : 메세지 창 닫은 후 실행할 함수 
Return :  true(Yes), false(No)
----------------------------------------------------*/
function ozf_MsgBox(msg, callback) {
	if (typeof (callback) === "undefined") callback = null;
    if (callback !== null) {
        DevExpress.ui.dialog.alert(msg, ozController.messageTitle).done(function () {
            if (callback != null) {
                if (typeof callback === "function") {
                    callback();
                }
            }
        });
    } else {
        alert(msg);
    }
}

/*--------------------------------------------------
  기능   : 사용할 수 없는 특수문자가 문자열에 있는지 여부
  Input  :  str : 문자열
            itemname : 
            title : 
            showmessage : true - 특수문자를 사용할수 없다는 메세지 보이기
----------------------------------------------------*/
function ozf_check_notallowchar(str, itemname, title, showmessage) {
    if (typeof (showmessage) === "undefined") showmessage = true;
    var sNotAllowChars = ';※<※>※&※$※/※\'※\"'.split('※');

    var i;
    for (i in sNotAllowChars) {
        if (str.indexOf(sNotAllowChars[i]) > 0) {
            if (showmessage) {
                alert(itemname + "에서는 " + sNotAllowChars[i] + "문자를 사용할 수 없습니다.")
            }
            return false;
        }
    }
    sNotAllowChars = null;
    return true;
}

/*--------------------------------------------------
기능   :  Server 날짜/시간 가져오기
Input  :  delim : 구분자 
Return :  서버 날짜
----------------------------------------------------*/
function ozf_GetServerDateTime(delim) {
    var metah = new oza_MetaHandler("ServerHelper", "<List><Item address=''/></List>", "<List><Info option='servertime'/></List>")
    metah.execute(null, false);

    if (oza_CheckMetaReturn(metah.returncontent) == false) {
        return "";
    }

    var parser, xmlDoc;
    xmlDoc = ozf_getXMLDoc(metah.returncontent);
    if (oza_IsParseError(xmlDoc)) {
        return "";
    }

    var xResult = xmlDoc.documentElement.childNodes[0];
    var serverdate = xResult.attributes.getNamedItem("servertime").value;
    serverdate = ozf_ReplaceString(serverdate.substring(0, 10), "-", "/")
    var myDate = new Date(serverdate);
    if (delim == null) { delim = "-"; }
    return ozf_ConvertDateToString(myDate, delim);
}

/*--------------------------------------------------
기능   :  Server 시간 가져오기(시, 분, 초)
Input  :  delim : 구분자
Return :  서버 시간(시, 분, 초)
----------------------------------------------------*/
function ozf_GetServerDateTimeHMS(delim) {
    var metah = new oza_MetaHandler("ServerHelper", "<List><Item address=''/></List>", "<List><Info option='servertime'/></List>")
    metah.execute(null, false);

    if (oza_CheckMetaReturn(metah.returncontent) == false) {
        return "";
    }

    var parser, xmlDoc;
    xmlDoc = ozf_getXMLDoc(metah.returncontent);
    if (oza_IsParseError(xmlDoc)) {
        return "";
    }

    var xResult = xmlDoc.documentElement.childNodes[0];
    var serverdate = xResult.attributes.getNamedItem("servertime").value;
    return serverdate;
}

/*--------------------------------------------------
 기능   :  User Info 가져오기
 Input  :  userid : 사용자 ID
 Return :  사용자이름;그룹이름;그룹설명
----------------------------------------------------*/
function ozf_GetUserInfo(userid) {
    var metah = new oza_MetaHandler("UserGroupContent", "<List><Item address='/Users/{0}'/></List>".format(userid), "<List><User option='all'/></List>")
    metah.execute(null, false);

    if (oza_CheckMetaReturn(metah.returncontent) == false) {
        return "";
    }

    var parser, xmlDoc;
    xmlDoc = ozf_getXMLDoc(metah.returncontent);  

    if (oza_IsParseError(xmlDoc)) {
        return "";
    }

    var xUsers = xmlDoc.documentElement.childNodes[0];
    if (xUsers != null) {
        var xUser = xUsers.childNodes[1];
        username = xUser.attributes.getNamedItem("username").value;
        //userozid = xUser.attributes.getNamedItem("ozid").value;
        groupname = xUser.attributes.getNamedItem("groupname").value;
        groupdescription = xUser.attributes.getNamedItem("groupdescription").value;
        return "{0};{1};{2}".format(username, groupname, groupdescription);
    }
}

/*--------------------------------------------------
 기능   :  기준날짜에 interval만큼 일 수를 더한 날짜 반환
 Input  :  curdate  : 기준 날짜 ( formmat : yyyy-mm-dd )
           interval : 더할 일 수 type:number,  formmat : { ex> -1, 1 }
           delim    : 구분자 (기본값 : '-')
 Return :  더해진 날짜
----------------------------------------------------*/
function ozf_GetDayInterval(curdate, interval, delim) {
    if (delim == null) { delim = "-"; }
    var parts = curdate.split(delim);
    var vDate = new Date();
    vDate.setDate(Number(parts[2]) + Number(interval));
    vDate.setFullYear(parts[0]);
    vDate.setMonth(parts[1] - 1);
    return ozf_ConvertDateToString(vDate, delim);
}

/*--------------------------------------------------
*	기능   : 날짜 변환 함수 정의 (일 기준)
*	Input  : curdate : 기준 날짜( formmat : yyyy-mm-dd )
*            interval ( type : number,  formmat : { ex> -1, 1 } )
*            delim    : 구분자 (기본값 : '-')
*   Return : yyyy-mm-dd
----------------------------------------------------*/
function ozf_GetDay(curdate, interval, delim) {
    var vDate = new Date(curdate);
    vDate.setDate(vDate.getDate() + interval)
    return ozf_ConvertDateToString(vDate, delim);
}

/*--------------------------------------------------
*   기능   : 날짜 변환 함수 정의 (월 기준)
*   Input  : curdate : 기준 날짜( formmat : yyyy-mm-dd )
*            interval ( type : number,  formmat : { ex> -1, 1 } )
*            delim    : 구분자 (기본값 : '-')
*   Return : yyyy-mm-dd
----------------------------------------------------*/
function ozf_GetMonth(curdate, interval, delim) {
    var vDate = new Date(curdate);
    vDate.setMonth(vDate.getMonth() + interval)
    return ozf_ConvertDateToString(vDate, delim);
}

/*--------------------------------------------------
*   기능   : 날짜 변환 함수 정의 (년 기준)
*   Input  : curdate : 기준 날짜( formmat : yyyy-mm-dd )
*            interval ( type : number,  formmat : { ex> -1, 1 } )
*            delim    : 구분자 (기본값 : '-')
*   Return : yyyy-mm-dd
----------------------------------------------------*/
function ozf_GetYear(curdate, interval, delim) {
    var vDate = new Date(curdate);
    vDate.setYear(vDate.getFullYear() + interval);
    return ozf_ConvertDateToString(vDate, delim);
}

/*--------------------------------------------------
*	기능 :날짜 변환 함수 정의
*	Input	: curdate ( formmat : yyyy-mm-dd )
*         interval ( formmat : { ex>"-7d" --> 7일전, "3m" --> 3달후, "2y" --> 2년 } )
*         delim : 구분자 (기본값 : '-')
*   return : yyyy-mm-dd
----------------------------------------------------*/
function ozf_GetDateInterval(curdate, interval, delim) {
    var format = interval.substring(interval.length - 1);
    var date = interval.substring(0, interval.length - 1);
    var curdate1 = curdate;

    if (format == "d") {
        return ozf_GetDay(curdate, Number(date), delim);
    } else if (format == "m") {
        return ozf_GetMonth(curdate, Number(date), delim);
    } else if (format == "y") {
        return ozf_GetYear(curdate, Number(date), delim);
    } else {
        return ozf_MsgBox("지정된 형식이 아닙니다.");
    }
}

/**************  날짜 변환 함수 정의  **************/
/*--------------------------------------------------
 기능   : YYYYMMDD --> YYYY-MM-DD
 Input  : value  : 날짜 ( formmat : yyyymmdd )
          delim  : 구분자 (기본값 : '-')
 Return : 변환된 날짜
----------------------------------------------------*/
function ozf_ConvertToYYYY_MM_DD(value, delim) {
    if (delim == null) { delim = "-"; }
    if (value.length == 8) {
        return "{0}-{1}-{2}".format(value.substr(0, 4), value.substr(4, 2), value.substr(6, 2));
    }
    return value;
}

/*--------------------------------------------------
 기능   : YYYYMMDD --> YYYY-MM-DD
 Input  : value  : 날짜 문자열( formmat : yyyymmdd )
          delim  : 구분자 (기본값 : '-')
 Return : Date 오브젝트
----------------------------------------------------*/
function ozf_GetDate(value, delim) {
    if (delim == null) { delim = "-"; }
    var d;
    if (value.length == 6) {
        d = new Date("{0}-{1}-{2}".format(value.substr(0, 4), value.substr(4, 2), "01"));
        return d;
    } else if (value.length == 8) {
        d = new Date("{0}-{1}-{2}".format(value.substr(0, 4), value.substr(4, 2), value.substr(6, 2)));
        return d;
    } else if (value.length == 10) {
        d = new Date("{0}-{1}-{2}".format(value.substr(0, 4), value.substr(5, 2), value.substr(8, 2)));
        return d;
    } else if (value.length > 10) {
        d = new Date("{0}-{1}-{2}".format(value.substr(0, 4), value.substr(4, 2), value.substr(6, 2)));
        d.setHours(value.substr(8, 2), value.substr(10, 2), value.substr(12, 2))
        return d;
    } else {
        d = new Date(value);
        return d;
    }
    return d;
}

/*--------------------------------------------------
 기능   : YYYYMMDD --> YYYY-MM-DD
 Input  : varDate  : 날짜 ( formmat : yyyymmdd )
          delim    : 구분자 (기본값 : '-')
 Return : 변환된 날짜 (형식 : YYYY-MM-DD)
----------------------------------------------------*/
function ozf_ConvertDateToString(varDate, delim) {
    if (delim == null) { delim = "-"; }

    var dd = varDate.getDate();
    var mm = varDate.getMonth() + 1; //January is 0!
    var yyyy = varDate.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    return "{0}-{1}-{2}".format(yyyy, mm, dd);
}

/**
 * @description encode string
 * @param string
 * @returns
 */
function ozf_Encode(str) {
    var ret;
    str = str.replace(/"/gi, '\\"');
    ret = ozf_AgentHelperHandler("AgentHelper", "EncodeString", str)
    return ret;
    //var encStr;
    //var head = document.getElementById('head');
    //var oldCharsetTag;
    //var newCharsetTag;
    //oldCharsetTag = document.getElementById('charset');
    //if (oldCharsetTag != null) {
    //    head.removeChild(oldCharsetTag);
    //}
    //newCharsetTag = document.createElement('meta');
    //newCharsetTag.setAttribute('id', 'charset');
    //newCharsetTag.setAttribute('charset', 'euc-kr');
    //head.appendChild(newCharsetTag);
    //encStr = Base64.encode(string);
    //oldCharsetTag = document.getElementById('charset');
    //if (oldCharsetTag != null) {
    //    head.removeChild(oldCharsetTag);
    //}
    //newCharsetTag = document.createElement('meta');
    //newCharsetTag.setAttribute('id', 'charset');
    //newCharsetTag.setAttribute('charset', 'utf-8');
    //head.appendChild(newCharsetTag);
    //return encStr;
}

/**
 * @description Decode String
 * @param string
 */
function ozf_Decode(string) {
     var ret;
    ret = ozf_AgentHelperHandler("AgentHelper", "DecodeString", string)
    return ret;
    //var decStr;
    //var head = document.getElementById('head');
    //var oldCharsetTag;
    //var newCharsetTag;
    //if (head != null) {
    //    oldCharsetTag = document.getElementById('charset');
    //    if (oldCharsetTag != null) {
    //        head.removeChild(oldCharsetTag);
    //    }
    //    newCharsetTag = document.createElement('meta');
    //    newCharsetTag.setAttribute('id', 'charset');
    //    newCharsetTag.setAttribute('charset', 'euc-kr');
    //    head.appendChild(newCharsetTag);
    //    decStr = Base64.decode(string);
    //    oldCharsetTag = document.getElementById('charset');
    //    if (oldCharsetTag != null) {
    //        head.removeChild(oldCharsetTag);
    //    }
    //    newCharsetTag = document.createElement('meta');
    //    newCharsetTag.setAttribute('id', 'charset');
    //    newCharsetTag.setAttribute('charset', 'utf-8');
    //    head.appendChild(newCharsetTag);
    //    return decStr;
    //} else {
    //    return Base64.decode(string);
    //}
}

/*--------------------------------------------------
  기능   :  XML에서 사용 할 수 없는 문자 체크
  INPUT :  svalue : 문자열
           itemname :  입력 항목 주제
           msgtitle :  메세지 박스 타이틀
           shownmessage : true - 문자를 사용할 수 없다는 메세지 출력 여부
----------------------------------------------------*/
function ozf_CheckNotAllowChar(svalue, itemname, msgtitle, showmessage) {
    if (svalue == "") {
        return true
    }
    var i, notallowchars = (";※<※>※&※$※/※'※", "※").split(",");
    for (i = 0; i < notallowchars.length; i++) {
        if (svalue.indexOf(notallowchars[i]) >= 0) {
            if (showmessage == true) {
                ozf_MsgBox("{0}에서 {1}문자는 사용할 수 없습니다.".format(itemname, notallowchars[i]), "0", msgtitle);
            }
            return false;
        }
    }
    return true;
}

/*--------------------------------------------------
  기능   :  trim(앞뒤 공백 없애기)
  Input  : 	svalue: 원본 문자열
  Return :  trim(앞뒤 공백 없앤 후 문자열)
----------------------------------------------------*/
function ozf_StringTrim(svalue) {
    if (ozf_StringIsEmpty(svalue) == true) {
        return "";
    }
    else {
        return svalue.trim();
    }
}

/*--------------------------------------------------
  기능   : Is Empty String (문자열이 공백인지 확인)
  Input  : svalue: 원본 문자열
  Return : true(공백일때)/false(공백이 아닐때)
----------------------------------------------------*/
function ozf_StringIsEmpty(svalue) {
    if (svalue == undefined) {
        return true;
    }
    if (svalue == null) {
        return true;
    }
    else if (svalue.toString() == '') {
        return true;
    }
    else {
        return false;
    }
}

/*--------------------------------------------------  
  기능   : 문자열 길이 반환
  Input  : svalue: 원본 문자열
  Return : 문자열 길이
----------------------------------------------------*/
function ozf_stringLen(val) {
    if (val == undefined) {
        return 0;
    }
    if (val == null) {
        return 0;
    }
    return val.length;
}

/*--------------------------------------------------
  기능   : 문자열 치환
  Input  : svalue: 원본 문자열
           findstr: 찾는 문자열
           replacement: 대체 문자열
  Return : 문자열 바이트 수  
----------------------------------------------------*/
function ozf_ReplaceString(svalue, findstr, replacement) {
    if (svalue == "") {
        return "";
    }
    else {
        return svalue.replace(new RegExp('[' + findstr + ']', 'g'), replacement);
    }
}

//쌍따옴표앞에 "\" 붙여서 반환
function ozf_EscapeString(Val) {
    return Val.replace(/\\([\s\S])|(")/g, "\\$1$2");
}
//??????????????
function ozf_EscapeStringExceptQuot(Val) {
    return Val.replace(/\\([\s\S])/g, "\\$1$2");
}

//Remove Last Delimeter
function ozf_RemoveLastDelimiter(liststr, delimiter) {
    if (liststr == null) {
        return liststr;
    }

    if (delimiter == null) {
        return liststr;
    }

    var txt1 = liststr;
    var delim = delimiter;
    var delimlen = delim.length;
    var txtlen = txt1.length;

    if ((txtlen - delimlen) < 0) {
        return liststr;
    }

    if (txt1.substr(txtlen - delimlen, delimlen) == delim) {
        return txt1.substr(0, txtlen - delimlen);
    }
    return liststr;
}

/*--------------------------------------------------
  기능   : 문자열의 바이트 수 체크
  Input  : svalue: 문자열
  Return : 문자열 바이트 수
----------------------------------------------------*/
function ozf_GetByte(svalue) {
    var i, b, c;
    if (svalue == "") {
        return 0;
    }
    else {
        for (b = i = 0; c = svalue.charCodeAt(i++) ; b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b;
    }
}

/*--------------------------------------------------
  기능   : 컨트롤 비활성화/활성화
  Input  : ctl   : 컨트롤 id
           value : true(비활성화)/false(활성화)
  Return : 
----------------------------------------------------*/
function ozf_CtlEnabled(controller, ctl, value) {
    if (ctl != null) {
        if (ctl[0].tagName == "A") {
            if (value == false) {
                ctl.attr('disabled', 'disabled');                
                //ctl.prop('disabled', true);
            }
            else {
                ctl.removeAttr('disabled');
                //ctl.prop('disabled', false);
            }
        }
        else {
            //자기 자신
            if (value == false) {
                ctl.prop('disabled', true);
                //ctl.datepicker('option', 'disabled', true);
            }
            else {
                ctl.prop('disabled', false);
                //ctl.datepicker('option', 'disabled', false);
            }
        }
        
        var id = ctl.selector + " *";
        if (value == false) {
            $(id).prop('disabled', true);
        }
        else {
            $(id).prop('disabled', false);
        }

        var ctl;
        var ctlid;
        id = ctl.selector + " .oz-item";
        $(id).each(function (index) {
            ctlid = this.id;
            if ($('#' + this.id).hasClass('ozgrid')) {
                ctlid = ctlid.replace('div', '');
            }
            ctl = controller.getControl(ctlid);
            ctl.setEnabled(value);
            //eval("ctl_" + this.id + ".setEnabled(" + value + ")");
        });
    }
}

/*--------------------------------------------------
  기능   : 주소 XML
----------------------------------------------------*/
function ozf_AddressXML(ozid) {
    var region = ozf_GetItemRegion(ozid);
    return "<List><Item address='{0}' region='{1}'/></List>".format(ozid, region);
}
function ozf_AddressXMLWithInstanceID(ozid, instanceid, cubeozid) {
    return "<List><Item address='{0}' ozid='{0}' instanceid = '{1}' cubeozid='{2}'/></List>".format(ozid, instanceid, cubeozid);
}
function ozf_AddressXMLCube(ozid, cube) {
    var region = ozf_GetItemRegion(ozid);
    return "<List><Item address='{0}' region='{1}' cubeozid ='{2}'/></List>".format(ozid, region, cube);
}

/*--------------------------------------------------
  기능   : 메타 항목의 주소 및 OZID 변환   
  INPUT  : addr : 메타 항목의 주소
  RETURN : 메타항목의 OZID, OZID 없을 시 '' 
----------------------------------------------------*/
function ozf_MetaTranslate(addr) {
    if (addr == "") { return; }

    addr = ozf_AddressXML(addr);

    var errormsg;
    var metahandler1 = new MetaHandler("ServerHelper", addr, "<List><Item option='translate'/></List>", true);
    if (CheckMetareturn(metahandler1.returncontent) == true) {
        var parser, xmlDoc;
        xmlDoc = ozf_getXMLDoc(metahandler1.returncontent);         
        var xele = xmlDoc.documentElement.childNodes[0];
        var path = xele.attributes.getNamedItem("address").value;
        return path;
    } else {
        ozf_MsgBox(GetErrorContent(metahandler1.returncontent));
        return "";
    }
}

/*--------------------------------------------------
  기능   : TM 결과 콤보에 채우기  
  INPUT  : comboctl : 입력할 콤보 컨트롤
           arr : TM결과 값, arr[][]
           allcaption : caption 값
           allcode : caption 코드
----------------------------------------------------*/
function ozf_FillComboTM(comboctl, arr, allcaption, allcode, unselectedname) {
    var iscode;
    if (arr == null) { return; }
    if (arr.length == 0) { return; }
    if (arr.length > 1) {
        iscode = true;
    }    
    comboctl.clear();
    if (allcaption != "") {
        if (allcode != "") {
            comboctl.addItem(allcaption, allcode, false);
        } else {
            comboctl.addItem(allcaption, allcaption, false);
        }
    }

    if (unselectedname != "") {
        comboctl.addItem(unselectedname, unselectedname, false );
    }

    var i;
    for (i = 0; i < arr[0].length; i++) {        
        if (iscode == true) {
            comboctl.addItem(arr[0][i], arr[1][i], false);
        } else {
            comboctl.addItem(arr[0][i], arr[0][i], false);
        }
    }
    comboctl.refresh();
    try {
        comboctl.setSelectedIndex(0);
    }
    catch (e) {
        console.log(e);
    }
}
/*--------------------------------------------------
  기능   :  TM 결과 Refresh
  INPUT  : comboctl : 입력할 콤보 컨트롤
           arr : TM결과 값, arr[][]
           allcaption : caption 값
           allcode : caption 코드
----------------------------------------------------*/
function ozf_FillComboTMRefresh(comboctl, arr, allcaption, allcode) {
    ozf_FillComboTM(comboctl, arr, allcaption, allcode);
}

/*--------------------------------------------------
  기능   :  TM 결과 Radio에 채우기 
  
  INPUT  : ctl : 입력할 라디오 컨트롤
           arr : TM결과 값, arr[][]
           allcaption : caption 값
           allcode : caption 코드 
----------------------------------------------------*/
function ozf_FillRadioTM(ctl, arr, allcaption, allcode) {
    var iscode;
    if (arr == null) { return; }
    if (arr.length > 1) {
        iscode = true;
    }
    ctl.clear();

    if (allcaption != "") {
        if (allcode != "") {
            ctl.addItem( allcode, allcaption,false);
        } else {
            ctl.addItem( allcaption, allcaption,false);
        }
    }

    for (i = 0; i < arr[0].length; i++) {
        if (iscode == true) {
            ctl.addItem( arr[0][i], arr[1][i],false);
        } else {
            ctl.addItem(arr[0][i], arr[0][i],false);
        }
    }
    ctl.refresh();
    ctl.setSelectedIndex(0);
}

/*--------------------------------------------------
기능   :  다국어 지원
INPUT  :   id :
           defaulttext : 
----------------------------------------------------*/
function ozf_Getresource(id, defaulttext) {
    return defaulttext;
}

/*--------------------------------------------------
기능   :  All 값인지 체크함  

INPUT  :  value : 입력된 값
RETURN :  '%'-true, 나머지 false
----------------------------------------------------*/
function ozf_IsAllValue(value) {
    if (ozf_StringIsEmpty(value) == true) {
        return true;
    }
    if (value == "%") {
        return true;
    }
    return false;
}

/*--------------------------------------------------
기능   :  Format Number
ex) format( "#,##0.####", 1234567.890) //output: 1,234,567.89
    format( '#,###.', 1234567.890) // output: 1,234,567
INPUT  :  m : 데이터
          v : 
RETURN :   
----------------------------------------------------*/
function ozf_Format(v, m) {
    if (!m || isNaN(+v)) {
        return v; //return as it is.
    }
    //convert any string to number according to formation sign.
    var v = m.charAt(0) == '-' ? -v : +v;
    var isNegative = v < 0 ? v = -v : 0; //process only abs(), and turn on flag.

    //search for separator for grp & decimal, anything not digit, not +/- sign, not #.
    var result = m.match(/[^\d\-\+#]/g);
    var Decimal = (result && result[result.length - 1]) || '.'; //treat the right most symbol as decimal 
    var Group = (result && result[1] && result[0]) || ',';  //treat the left most symbol as group separator

    //split the decimal for the format string if any.
    var m = m.split(Decimal);
    //Fix the decimal first, toFixed will auto fill trailing zero.
    v = v.toFixed(m[1] && m[1].length);
    v = +(v) + ''; //convert number to string to trim off *all* trailing decimal zero(es)

    //fill back any trailing zero according to format
    var pos_trail_zero = m[1] && m[1].lastIndexOf('0'); //look for last zero in format
    var part = v.split('.');
    //integer will get !part[1]
    if (!part[1] || part[1] && part[1].length <= pos_trail_zero) {
        v = (+v).toFixed(pos_trail_zero + 1);
    }
    var szSep = m[0].split(Group); //look for separator
    m[0] = szSep.join(''); //join back without separator for counting the pos of any leading 0.

    var pos_lead_zero = m[0] && m[0].indexOf('0');
    if (pos_lead_zero > -1) {
        while (part[0].length < (m[0].length - pos_lead_zero)) {
            part[0] = '0' + part[0];
        }
    }
    else if (+part[0] == 0) {
        part[0] = '';
    }

    v = v.split('.');
    v[0] = part[0];

    //process the first group separator from decimal (.) only, the rest ignore.
    //get the length of the last slice of split result.
    var pos_separator = (szSep[1] && szSep[szSep.length - 1].length);
    if (pos_separator) {
        var integer = v[0];
        var str = '';
        var offset = integer.length % pos_separator;
        for (var i = 0, l = integer.length; i < l; i++) {

            str += integer.charAt(i); //ie6 only support charAt for sz.
            //-pos_separator so that won't trail separator on full length
            if (!((i - offset + 1) % pos_separator) && i < l - pos_separator) {
                str += Group;
            }
        }
        v[0] = str;
    }

    v[1] = (m[1] && v[1]) ? Decimal + v[1] : "";
    return (isNegative ? '-' : '') + v[0] + v[1]; //put back any negation and combine integer and fraction.
};


/*--------------------------------------------------
기능   :  Format Number
          ex) format( 1234567.890) //output: 1,234,567.89
INPUT  :  n : 데이터
RETURN :  숫자로된 문자열
----------------------------------------------------*/
function ozf_FormatNumber(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환

    while (reg.test(n))
        n = n.replace(reg, '$1' + ',' + '$2');

    return n;
}

/*--------------------------------------------------
기능   :  Format Number
          ex) format(123456, #.00) //output: 123,456.00
INPUT  :  number : 데이터
          formatstr : 포멧 형식
RETURN :  숫자로된 문자열
----------------------------------------------------*/
function ozf_FormatString(number, formatstr) {
    if (isNaN(number) || number == null) return number;
    if ($.isNumeric(number) == false) { return number; }

    var isNumericFormat = false;
    var dsep, tsep, dec = 0;
    if (formatstr != null && formatstr != '') {

        if (formatstr.indexOf(",") >= 0) {
            isNumericFormat = true;
        } else {
            if (formatstr.indexOf(".") >= 0) {
                isNumericFormat = true;
            }
        }
        
        if (isNumericFormat == false) {
            var j = 0;
            var i, patterns=[];
            for (i = 0; i < formatstr.length; i++) {
                if (formatstr[i] == '#') {
                    patterns.push(number[j]);
                    j = j + 1;
                } else {
                    patterns.push(formatstr[i]);
                }
                if (j >= number.length) {
                    break;
                }
            }
            return patterns.join('');
        } else {
            var info = formatstr.split(".");
            if (info.length > 1) {
                dec = info[1].length;
            }
        }
    }

    number = parseFloat(number).toFixed(~~dec);
    tsep = typeof tsep == 'string' ? tsep : ',';

    var parts = number.split('.'), fnums = parts[0],
      decimals = parts[1] ? (dsep || '.') + parts[1] : '';

    return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
}

/*--------------------------------------------------
  기능   : resource 정보를 가져온다.
  INPUT  : id : 그리드 컨트롤
           notfoundstring : 못 찾는 경우 반환 문자열
  RETURN : 리소스 문자열
----------------------------------------------------*/
function ozf_getresource(id, notfoundstring) {
    if (typeof(notfoundstring)==="undefined") notfoundstring = "";
    return notfoundstring
}

/*--------------------------------------------------
  기능  : Page 파라미터 전달
  INPUT : basicvar
----------------------------------------------------*/
function ozf_pageletter(Sender, basicvar) {
    if (basicvar == null) {
        ozf_MsgBox("페이지 정보를 찾을 수 없습니다.[pageletter]");
        return;
    }

    var i;
    var para;
    var info;
    info = ozf_GetTempContent(Sender, "${FrameRefreshPage.tmp}$", true, "GroupFramelocal");
    if (!ozf_StringIsEmpty(info)) {
        var jsonObj = $.parseJSON('[' + info + ']');
        if (jsonObj.length == 1) {
            for (i = 0; i < jsonObj[0].length; i++) {
                para = jsonObj[0][i];
                basicvar.setValue(para);
            }
        }
    }    
    
    info = ozf_GetTempContent(Sender, "${FrameDialogKey.tmp}$", true, "GroupFramelocal");
    if (!ozf_StringIsEmpty(info)) {
        jsonObj = $.parseJSON('[' + info + ']');
        if (jsonObj.length == 1) {
            var i;
            var para;
            for (i = 0; i < jsonObj[0].length; i++) {
                para = jsonObj[0][i];
                basicvar.setValue(para);
            }
        }
    }    
}

/*--------------------------------------------------
  기능   :  OpenDialog 리턴 파라미터 전달
  INPUT  :  basicvar: Page 기본 정보(통상적으로 MyBasicVar)
            varreturn: 리턴 목록(통상적으로 배열)
  RETURN : 
----------------------------------------------------*/
function ozf_dialogresult(basicvar, varreturn) {
    if (basicvar == null) {
        ozf_MsgBox("페이지 정보를 찾을 수 없습니다.[dialogresul]");
        return;
    }

    var info;
    info = ozf_GetTempContent(basicvar.getRefMain(), basicvar.ParentKey, true, "GroupFramelocal");
    if (ozf_StringIsEmpty(info)) {
        return;
    }

    var jsonObj = $.parseJSON('[' + info + ']');

    if (jsonObj.length == 1) {
        var i;
        var para;
        if (varreturn == null) {                 
            for (i = 0; i < jsonObj[0].length; i++) {
                para = jsonObj[0][i];
                basicvar.setValue(para, basicvar);
            }
        } else {               
            for (i = 0; i < jsonObj[0].length; i++) {
                para = jsonObj[0][i];
                basicvar.setValueToReturn(para,  varreturn);
            }
        }        
    }
    basicvar.isdialog = false;
}

/*--------------------------------------------------
  기능   : 파일 경로에서 파일 명을 반환
  INPUT  : attachctl : 파일 첨부 컨트롤
           attachvalue : 파일 명에 추가할 문자열
  RETURN : 파일 명과 지정한 문자열을 반환
           ex)aaa.html.bak --> aaa + attachvalue.html.bak
----------------------------------------------------*/
function ozf_AttachFileName(attachctl, attachvalue) {
    if (typeof (attachvalue) === "undefined") attachvalue = "";
    attachctl = attachctl[0];
    var path1;
    var filename;
    var newvalue;
    var id = "#" + comboctl.id;
    var filepath = $(id).val(); //"E:\obzen\obzen.Html.Studio.7\obzen.Html.Studio.7\bin\Debug\obzen.Html.Studio.7.exe";
    path1 = filepath.split('\\');
    newvalue = path1[path1.length - 1];

    if (attachvalue != "") {
        var fileinfo = newvalue.split(".");
        filename = fileinfo[0] + attachvalue;
        if (fileinfo.length > 1) {
            filename = filename + ozf_mid(newvalue, fileinfo[0].length + 1, newvalue.length - fileinfo[0].length);
        }
    }
}

/*--------------------------------------------------
  기능   : 문자열에서 지정한 문자 수가 포함된 문자열을 반환합니다.
  INPUT  : str : 검색 문자열
           start : 반환할 문자의 시작 위치(1부터 시작됩니다.)
           len : 반환할 문자의 수
  RETURN : start부터 len길이만큼의 문자열
----------------------------------------------------*/
function ozf_mid(str, start, len) {
    start = start - 1;
    if (start < 0 || len < 0) return "";
    var iEnd, iLen = String(str).length;
    if (start + len > iLen)
        iEnd = iLen;
    else
        iEnd = start + len;
    return String(str).substring(start, iEnd);
}

/*--------------------------------------------------
  기능   : 문자열에서 지정한 문자 수가 포함된 문자열을 반환합니다.
  INPUT  : str : 검색 문자열                   
           len : 반환할 문자의 수
  RETURN : 왼쪽부터 len길이만큼의 문자열
----------------------------------------------------*/
function ozf_left(str, len) {
    return str.substr(0, len);
}

/*--------------------------------------------------
  기능   : 문자열에서 지정한 문자 수가 포함된 문자열을 반환
  INPUT  : str : 검색 문자열                   
           len : 반환할 문자의 수
  RETURN : 오른쪽부터 len길이만큼의 문자열
----------------------------------------------------*/
function ozf_right(str, len) {
    return str.substr(0, -len);
}

/*--------------------------------------------------
  기능   : 한 문자열에서 다른 문자열이 start 인덱스부터 처음으로 나타나는 위치를 지정하는 정수를 반환
  INPUT  : start : 반환할 문자의 시작 위치(1부터 시작)
           str : 대상 문자열
           strSearch : 찾는 문자열
  RETURN : 조건InStr 함수의 반환 값String1의 길이가 0이거나 Nothing인 경우0
           String2의 길이가 0이거나 Nothing인 경우 startString2을 찾을 수 없는 경우0
           String2가 String1 안에 있는 경우 일치가 시작되는 위치Start > String2인 경우0
----------------------------------------------------*/
function ozf_instr(start, str, strSearch) {
    start = start - 1;
    if (str.length == 0) { return -1; }
    if (strSearch.length == 0) { return -1; }
    if (start < 0) { return -1; }
    if (start >= str.length) { return -1; }
    for (i = start; i < str.length; i++) {
        if (strSearch == ozf_mid(str, i, strSearch.length)) {
            return i;
        }
    }
    return -1;
}

/*--------------------------------------------------
  기능   : 한 문자열에서 다른 문자열이 처음으로 나타나는 위치를 지정하는 정수를 반환
  INPUT  : str : 대상 문자열
           strSearch : 찾는 문자열
  RETURN : 조건InStr 함수의 반환 값String1의 길이가 0이거나 Nothing인 경우0
           String2의 길이가 0이거나 Nothing인 경우 startString2을 찾을 수 없는 경우0
           String2가 String1 안에 있는 경우 일치가 시작되는 위치 Start > String2인 경우0
----------------------------------------------------*/
function ozf_instrZero(str, strSearch) {
    var start = 0;
    if (str.length == 0) { return -1; }
    if (strSearch.length == 0) { return -1; }
    for (i = start; i < str.length; i++) {
        if (strSearch == ozf_mid(str, i, strSearch.length)) {
            return i;
        }
    }
    return -1;
}

/*--------------------------------------------------
  기능   : Array의 상한
  INPUT  : arr
           dimension 
  RETURN : integer
----------------------------------------------------*/
function ozf_uBound(arr, dimension) {
    return arr.length - 1;
}

/*--------------------------------------------------
  기능   : 문자열에서 지정한 문자열로 구분
  INPUT  : str : 대상 문자열           
           delimiter : 구분 문자열
  RETURN : Array
----------------------------------------------------*/
function ozf_SplitString(str, delimiter) {
    var tok = new ozf_StringTokenizer(str, delimiter);
    return tok.tokens;
}

/*--------------------------------------------------
  기능   : JSON을 지정한 문자열로 대체하여 반환
  INPUT  : JSONstr : 대상 문자열           
           Delimiter : 구분 문자열
  RETURN : String
----------------------------------------------------*/
function ozf_JSONStringToString(JSONStr, Delimiter) {
    var jsonObj = $.parseJSON(JSONStr);
    var data = [];
    var item;
    var keys;

    if (jsonObj.length > 0) {
        keys = Object.keys(jsonObj[0]);
        for (var i = 0 ; i < jsonObj.length; i++) {
            item = jsonObj[i];
            for (var j = 0; j < keys.length; j++) {
                data.push(item[keys[j]]);
            }
        }
        return data.join(Delimiter);
    } else {
        return '';
    }
}

/*--------------------------------------------------
  기능   : JSON을 지정한 문자열로 구분
  INPUT  : str : 대상 문자열           
           key : 구분 문자열
  RETURN : String
----------------------------------------------------*/
function ozf_StringTokenizer(str, key) {
    this.original = str;
    this.sentence = str;
    this.parseKey = key;
    this.accessPoint = 0;
    this.tokens = this.sentence.split(this.parseKey);
    
    //토큰이 더 있는지 체크
    this.hasMoreTokens = function () {
        if (this.tokens.length > this.accessPoint) {
            return true;
        } else {
            return false;
        }
    }
    //다음 토큰 값 반환
    this.nextToken = function () {
        if (this.hasMoreTokens()) {
            this.accessPoint++;
            return this.tokens[this.accessPoint - 1];
        } else {
            return null;
        }
    }
}

/*--------------------------------------------------
  기능   : 문자열이 json인지 체크
  INPUT  : str : 대상 문자열
  RETURN : true / false
----------------------------------------------------*/
function ozf_isJson(str){
    try {
        JSON.parse(str);
    } catch(e) {
        return false;
    }
    return true;
}

/*--------------------------------------------------
  기능   : 콤보 컨트롤의 값 목록 채우기
  Input  : comboctl: 콤보 컨트롤
           delim:구분자
           valuelist : 값 목록
           codelist :코드 목록(선택사항)
           sValue : 선택 할 항목 값
           sCode : 선택 할 코드 값
  Return : 
----------------------------------------------------*/
function ozf_ComboValueListValueCode(comboctl, delim, valuelist, codelist, sValue, sCode) {
    if (comboctl == null) {
        ozf_MsgBox("Combo 컨트롤을 지정 하세요.");
        return;
    }
    if (valuelist == "") {
        //ozf_MsgBox("값 목록을 지정 하세요.");
        return;
    }
    if (delim == "") {
        ozf_MsgBox("구분자를 지정 하세요.");
        return;
    }
    valuelist = ozf_RemoveLastDelimiter(valuelist, delim);
    codelist = ozf_RemoveLastDelimiter(codelist, delim);
    var arrvalue = valuelist.split(delim);
    var arrcode;
    var existcode;
    if (codelist != "") {
        arrcode = codelist.split(delim);
        if (arrvalue.length != arrcode.length) {
            ozf_MsgBox("코드와 값 목록 수가 다릅니다.");
            return;
        }
        existcode = true;
    }

    var i, founded;

    comboctl.clear();
    for (i = 0; i < arrvalue.length; i++) {
        if (existcode == true) {
            if (sCode == arrcode[i]) {
                founded = true;
            }
            comboctl.addItem(arrvalue[i], arrcode[i], false);
        }
        else {
            if (sValue == arrvalue[i]) {
                founded = true;
            }
            comboctl.addItem(arrvalue[i], '', false)
        }
    }
    comboctl.refresh();
    if (founded == true) {
        if (sCode != "") {
            comboctl.setCode(sCode);
        }
        else {
            comboctl.setValue(sValue);
        }
    }
    else {
        comboctl.setSelectedIndex(0);
    }
}

function ozf_StringFormat(str, replace) {
    return str.format(replace);
}

/*--------------------------------------------------
  기능   : 라디오 컨트롤의 값 목록 채우기
  Input  : ctl: 컨트롤
           delim:구분자
           valuelist : 값 목록
           codelist :코드 목록(선택사항)
           sValue : 선택 할 항목 값
           sCode : 선택 할 코드 값
  Return : 
----------------------------------------------------*/
function ozf_RadioValueListValueCode(ctl, delim, valuelist, codelist, sValue, sCode) {
    if (ctl == null) {
        ozf_MsgBox("컨트롤을 지정 하세요.");
        return;
    }
    if (valuelist == "") {
        //ozf_MsgBox("값 목록을 지정 하세요.");
        return;
    }
    if (delim == "") {
        ozf_MsgBox("구분자를 지정 하세요.");
        return;
    }
    var arrvalue = valuelist.split(delim);
    var arrcode;
    var existcode;
    if (codelist != "") {
        arrcode = codelist.split(delim);
        if (arrvalue.length != arrcode.length) {
            ozf_MsgBox("코드와 값 목록 수가 다릅니다.");
            return;
        }
        existcode = true;
    }
    var ctlid;

    ctlid = "#" + ctl.id;
    $(ctlid).empty();

    var i;
    var value;
    var code;
    var ischecked;
    var bfound = false;
    for (i = 0; i < arrvalue.length; i++) {
        ischecked = false;
        if (existcode == true) {
            value = arrcode[i];
            if (sCode == value) {
                bfound = true;
                ischecked = true;
            }
        }
        else {
            value = arrvalue[i];
            if (sValue == value) {
                bfound = true;
                ischecked = true;
            }
        }

        var radiostr;
        radiostr = '<input type="radio" id="{2}" name="{3}" value="{1}">{0}</input>';

        var radioBtn = $(radiostr.format(arrvalue[i], value, ctl.id + i, ctl.id));
        radioBtn.attr("checked", ischecked);
        radioBtn.appendTo($(ctlid));
    }

    if (!bfound) {
        if (ctl.children.length > 0) {

        }
    }
}

/*--------------------------------------------------
  기능   : 컨트롤의 자식들 수 반환
  Input  : id: 컨트롤 ID
  Return : 
----------------------------------------------------*/
function ozf_ChildrenCount(id) {
    return $('#' + id).children().length;
}

/*--------------------------------------------------
  기능   :  Collection
----------------------------------------------------*/
function ozf_List() {
    this.Values = [];    
}
//List의 Item 개수 반환
if (!ozf_List.prototype.Count) {
    ozf_List.prototype.Count = function () {
        return this.Values.length;
    }
}
//List의 Item 반환
if (!ozf_List.prototype.length) {
    ozf_List.prototype.length = function () {
        return this.Values.length;
    }
}
//List 초기화
if (!ozf_List.prototype.clear) {
    ozf_List.prototype.clear = function () {
        this.Values = [];
    }
}
//List에 값 추가
if (!ozf_List.prototype.Add) {
    ozf_List.prototype.Add = function (oValue) {
        this.Values.push(oValue);
    }
}
//List 값들 Sorting
if (!ozf_List.prototype.Sort) {
    ozf_List.prototype.Sort = function () {
        this.Values.sort();
    }
}
//해당 인덱스의 값 반환
if (!ozf_List.prototype.Item) {
    ozf_List.prototype.Item = function (idx) {
        if (idx >= 0 && idx < this.length ) {
            return this.Values[idx];
        }
        else { //error
            return null;
        }
    }
}


/*--------------------------------------------------
  기능   :  Collection
----------------------------------------------------*/
function ozf_Collection() {
    this.Keys = [];
    this.Values = [];
    this.keyDelim = "_";
}
//Collection Item 개수 반환
if (!ozf_Collection.prototype.Count) {
    ozf_Collection.prototype.Count = function () {
        return this.Values.length;
    }
}
//Collection Item 개수 반환
if (!ozf_Collection.prototype.length) {
    ozf_Collection.prototype.length = function () {
        return this.Values.length;
    }
}
//Collection Item기화
if (!ozf_Collection.prototype.clear) {
    ozf_Collection.prototype.clear = function () {
        this.Keys = [];
        this.Values = [];
    }
}
//Key 포함 여부 반환
if (!ozf_Collection.prototype.containsKey) {
    ozf_Collection.prototype.containsKey = function (sKey) {
        if (sKey == null) return false;
        if (sKey == "") return false;
        for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
            if (this.Keys[i] == sKey) {
                return true;
            }
        }
        return false;
    }
}
//Collection에 추가
if (!ozf_Collection.prototype.put) {
    ozf_Collection.prototype.put = function (sKey, oValue) {
        this.Add(oValue, sKey);
    }
}
//Key에 해당하는 Collection Item 값 반환
if (!ozf_Collection.prototype.get) {
    ozf_Collection.prototype.get = function (sKey) {
        return this.Item(sKey);
    }
}
//sKey == "", Key 없이 index로만 access 
if (!ozf_Collection.prototype.Add) {
    ozf_Collection.prototype.Add = function (oValue, sKey) {        
        if (sKey === "" || sKey == null)
            this.Keys.push(this.Values.length);
        else
            this.Keys.push(sKey);
        this.Values.push(oValue);
    }
}
//Key에 해당하는 Collection Item 값 반환
if (!ozf_Collection.prototype.Item) {
    ozf_Collection.prototype.Item = function (sKey) {
        if (sKey == null) return null;
        if (sKey === "") return null;
        var found = -1;
        var c = 0;
        var cnt = this.Keys.length;
        while (c < cnt) {
            if (this.Keys[c] === sKey) {
                found = c;
                break;
            }
            c++;
        }

        //for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
        //    if (this.Keys[i] == sKey) {
        //        found = i;
        //        break;
        //    }
        //}
        if (found >= 0) {
            var retVal = this.Values[found];
            return retVal;
        }
        else { //error
            return null;
        }
    }
}
//인덱스에 해당하는 Collection Item의 값 봔환
if (!ozf_Collection.prototype.ItemByIndex) {
    ozf_Collection.prototype.ItemByIndex = function (iIndex) {
        if (iIndex < 0 || iIndex >= this.Values.length) return null;
        return this.Values[iIndex];
    }
}
/*--------------------------------------------------
  기능 : Stopwatch
----------------------------------------------------*/
function ozf_Stopwatch() {
    // Private vars
    var startAt = 0;	// Time of last start / resume. (0 if not running)
    var lapTime = 0;	// Time on the clock when last stopped in milliseconds

    var now = function () {
        return (new Date()).getTime();
    };

    // Public methods
    // Start or resume
    this.start = function () {
        startAt = startAt ? startAt : now();
    };

    // Stop or pause
    this.stop = function () {
        // If running, update elapsed time otherwise keep it
        lapTime = startAt ? lapTime + now() - startAt : lapTime;
        startAt = 0; // Paused
    };

    // Reset
    this.reset = function () {
        lapTime = startAt = 0;
    };

    // Duration
    this.time = function () {
        return (lapTime + (startAt ? now() - startAt : 0)) / 1000;
    };

    function pad(num, size) {
        var s = "0000" + num;
        return s.substr(s.length - size);
    }

    function formatTime(time) {
        var h = m = s = ms = 0;
        var newTime = '';

        h = Math.floor(time / (60 * 60 * 1000));
        time = time % (60 * 60 * 1000);
        m = Math.floor(time / (60 * 1000));
        time = time % (60 * 1000);
        s = Math.floor(time / 1000);
        ms = time % 1000;

        newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
        return newTime;
    }

};

/*--------------------------------------------------
  기능 : XML Writer
----------------------------------------------------*/
function ozf_XMLWriter(encoding, version) {
    if (encoding)
        this.encoding = encoding;
    if (version)
        this.version = version;
};
(function () {
    ozf_XMLWriter.prototype = {
        encoding: 'ISO-8859-1',// what is the encoding
        version: '1.0', //what xml version to use
        formatting: 'none', //how to format the output (indented/none)  ?
        indentChar: '\t', //char to use for indent
        indentation: 1, //how many indentChar to add per level
        newLine: '\n', //character to separate nodes when formatting
        //start a new document, cleanup if we are reusing
        WriteStartDocument: function (standalone) {
            this.close();//cleanup
            this.stack = [];
            this.standalone = standalone;
        },
        //get back to the root
        WriteEndDocument: function () {
            this.active = this.root;
            this.stack = [];
        },
        //set the text of the doctype
        WriteDocType: function (dt) {
            this.doctype = dt;
        },
        //start a new node with this name, and an optional namespace
        WriteStartElement: function (name, ns) {
            if (ns)//namespace
                name = ns + ':' + name;

            var node = { n: name, a: {}, c: [] };//(n)ame, (a)ttributes, (c)hildren

            if (this.active) {
                this.active.c.push(node);
                this.stack.push(this.active);
            } else
                this.root = node;
            this.active = node;
        },
        //go up one node, if we are in the root, ignore it
        WriteEndElement: function () {
            this.active = this.stack.pop() || this.root;
        },
        //add an attribute to the active node
        WriteAttributeString: function (name, value) {
            if (this.active)
                this.active.a[name] = value;
        },
        //add a text node to the active node
        WriteString: function (text) {
            if (this.active)
                this.active.c.push(text);
        },
        //shortcut, open an element, write the text and close
        WriteElementString: function (name, text, ns) {
            this.writeStartElement(name, ns);
            this.writeString(text);
            this.writeEndElement();
        },
        //add a text node wrapped with CDATA
        WriteCDATA: function (text) {
            this.WriteString('<![CDATA[' + text + ']]>');
        },
        //add a text node wrapped in a comment
        WriteComment: function (text) {
            this.writeString('<!-- ' + text + ' -->');
        },
        //generate the xml string, you can skip closing the last nodes
        flush: function () {
            if (this.stack && this.stack[0])//ensure it's closed
                this.writeEndDocument();

            var
                    chr = '', indent = '', num = this.indentation,
                    formatting = this.formatting.toLowerCase() == 'indented',
                    buffer = "";
            /* remove version encoding by twkim
            buffer = '<&#63;xml version="'+this.version+'" encoding="'+this.encoding+'"';
            //       modded by Phong Thai @ JavaScriptBank.com
            buffer = buffer.replace( '&#63;', '?' );
            
            
    if( this.standalone !== undefined )
            buffer += ' standalone="'+!!this.standalone+'"';
    buffer += ' ?>';
    */

            buffer = [buffer];

            if (this.doctype && this.root)
                buffer.push('<!DOCTYPE ' + this.root.n + ' ' + this.doctype + '>');

            if (formatting) {
                while (num--)
                    chr += this.indentChar;
            }

            if (this.root)//skip if no element was added
                format(this.root, indent, chr, buffer);

            return buffer.join(formatting ? this.newLine : '');
        },
        //cleanup, don't use again without calling startDocument
        close: function () {
            if (this.root)
                clean(this.root);
            this.active = this.root = this.stack = null;
        },
        getDocument: window.ActiveXObject
                ? function () { //MSIE
                    var doc = new ActiveXObject('Microsoft.XMLDOM');
                    doc.async = false;
                    doc.loadXML(this.flush());
                    return doc;
                }
                : function () {// Mozilla, Firefox, Opera, etc.
                    return (new DOMParser()).parseFromString(this.flush(), 'text/xml');
                }
    };

    //utility, you don't need it
    function clean(node) {
        var l = node.c.length;
        while (l--) {
            if (typeof node.c[l] == 'object')
                clean(node.c[l]);
        }
        node.n = node.a = node.c = null;
    };

    //utility, you don't need it
    function format(node, indent, chr, buffer) {
        var
                xml = indent + '<' + node.n,
                nc = node.c.length,
                attr, child, i = 0;

        for (attr in node.a)
            xml += ' ' + attr + '="' + node.a[attr] + '"';

        xml += nc ? '>' : ' />';

        buffer.push(xml);

        if (nc) {
            do {
                child = node.c[i++];
                if (typeof child == 'string') {
                    if (nc == 1)//single text node
                        return buffer.push(buffer.pop() + child + '</' + node.n + '>');
                    else //regular text node
                        buffer.push(indent + chr + child);
                } else if (typeof child == 'object') //element node
                    format(child, indent + chr, chr, buffer);
            } while (i < nc);
            buffer.push(indent + '</' + node.n + '>');
        }
    };

})();

/**
 * @description 해당의 노드 XML을 반환 한다.
 * @param node 노드
 * @returns XML 문자열
 */
function ozf_getOuterHTML(node) {
    var output = [];
    ozf_serializeXML(node, output);
    return output.join('');
}

/**
 * @description 노드 자신을 제외한 내부 XML을 반환 한다.
 * @param node 노드
 * @returns XML 문자열
 */
function ozf_getInnerHTML(node) {
    var output = [];
    var childNode = node.firstChild;
    while (childNode) {
        ozf_serializeXML(childNode, output);
        childNode = childNode.nextSibling;
    }
    return output.join('');
}

function ozf_serializeXML(node, output) {
    var nodeType = node.nodeType;

    if(nodeType == 9) {
        node = node.documentElement;
        nodeType = node.nodeType;
    }

    if (nodeType == 3) { // TEXT nodes.
        // Replace special XML characters with their entities.
        if (node.textContent.trim() == "") {
            output.push(node.textContent);
        }
        else {
            output.push(node.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
            // output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
        }
        
    } else if (nodeType == 1) { // ELEMENT nodes.
        // Serialize Element nodes.
        output.push('<', node.tagName);
        if (node.hasAttributes()) {
            var attrMap = node.attributes;
            for (var i = 0, len = attrMap.length; i < len; ++i) {
                var attrNode = attrMap.item(i);
                output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
            }
        }
        if (node.hasChildNodes()) {
            output.push('>');
            var childNodes = node.childNodes;
            for (var i = 0, len = childNodes.length; i < len; ++i) {
                ozf_serializeXML(childNodes.item(i), output);
            }
            output.push('</', node.tagName, '>');
        } else {
            output.push('/>');
        }
    } else if (nodeType == 4) {
        // Handle CDATA nodes.
        output.push('<![CDATA[', node.wholeText, ']]>');

    } else if (nodeType == 8) {
        // TODO(codedread): Replace special characters with XML entities?
        output.push('<!--', node.nodeValue, '-->');
    } else {
        
        // TODO: Handle ENTITY nodes.
        // TODO: Handle DOCUMENT nodes.
        throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
    }
}

/**
 * @description 프레임 경로에서 프레임 이름만 찾기
 * @param addr 프레임 경로
 * @returns
 */
function ozf_MetaTranslateFramaddr(addr) {
    if (addr == "") { return ''; }

    var list = addr.split("/")
    return  list[list.length];
}

/**
 * @description RGB 색상값을 반환한다.
 * @param r
 * @param g
 * @param b
 * @returns 색상값
 */
function ozf_Fromrgb(r, g, b) {
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    return ["rgb(", r, ",", g, ",", b, ")"].join("");
}

/**
 * @description XML에서 프레임 이름을 찾아 온다.
 * @param addr 프레임 주소 XML
 * @returns 프레임 이름을 포함한 .html
 */
function ozf_GetFrameNameFromXML(addr) {
    var xmlDoc = ozf_getXMLDoc(addr);
    var varlist = xmlDoc.getElementsByTagName("Item");
    if (varlist != null) {
        var xitem;
        xitem = varlist[0];
        filename = xitem.getAttribute("address");
        if (ozf_StringIsEmpty(filename)) {
            return '';
        }
        //filename = filename.replace(new RegExp('[/FrameExec]', 'g'), '');
        var list = filename.split("/")
        filename = list[list.length-2];
        return filename;
    }
    else {
        return '';
    }
}

/**
 * @description 경로에서 이름 가져오기
 * @param addr
 * @returns
 */
function ozf_GetNameFromAddr(addr) {
    if (addr == "") { return ''; }

    var list = addr.split("/")
    return list[list.length - 1];
}

/**
 * @description 프레임 주소 XML
 * @param addr
 * @returns
 */
function ozf_GetAddressXML(addr) {
    return "<List><Item address='{0}' region='manage'/></List>".format(addr);
}
/**
 * @description 부모 컨트롤 가져오기
 * @param id 
 */
function ozf_GetParent(id) {
    return $(id).parent();
}

//todo implement
function ozf_BringToFront(obj) {

}


/**
 * @description 날짜를 주어진 포맷 형태로 변경
 * @param varDate
 * @param format
 * @returns
 */
function ozf_ConvertDateFormat(varDate, fstr) {
    var dd = varDate.getDate();
    var mm = varDate.getMonth() + 1; //January is 0!
    var yyyy = varDate.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    fstr = fstr.replace('yyyy', '{0}');
    fstr = fstr.replace('MM', '{1}');
    fstr = fstr.replace('dd', '{2}');

    return fstr.format(yyyy, mm, dd);
}

/**
 * @description 주어진 문자열을 날짜 형식으로 변환 하여 반환한다.
 * @param varDate
 * @returns
 */
function ozf_CDate(varDate) {
    var dd;
    var mm; 
    var yyyy;

    if (varDate.length === 8) {
        yyyy = ozf_mid(varDate, 1, 4);
        mm = ozf_mid(varDate, 5, 2);
        dd = ozf_mid(varDate, 7, 2);
    } else {
        yyyy = ozf_mid(varDate, 1, 4);
        mm = ozf_mid(varDate, 6, 2);
        dd = ozf_mid(varDate, 9, 2);
    }
    varDate = "{0}-{1}-{2}".format(yyyy, mm, dd);
    return  new Date(varDate);    
}

/**
 * @description 날짜를 연산
 * @param addtype : 유형 (d:날짜, m:월, y:년)
 * @param val : 연산한 숫자
 * @param datevalue : Date타입
 */
function ozf_DateAdd(addtype, val, datevalue) {
    var newDateValue = datevalue;
    switch (addtype){
        case "d":
            newDateValue.addDays(val);
            break;
        case "m":
            newDateValue.addMonths(val);
            break;
        case "y":
            newDateValue.addYears(val);
            break;
    }
    return newDateValue;
}

/**
 * @description 지정한 컨트롤의 하위 컨트롤 목록을 반환한다.
 * @param pctl
 * @returns
 */
function ozf_GetControls(pctl) {
    var i;
    var list;
    if (ozf_GetType(pctl, "obzenpanel")) {
        var ctllist;
        ctllist = pctl.childControlList;
        if (!ozf_StringIsEmpty(ctllist)) {
            var list1 = [];
            var item;
            list = [];
            list1 = ozf_SplitToArray(ctllist, ',');
            for (i = 0; i < list1.length; i++) {
                item = {};
                item.id = list1[i];
                list.push(item);
            }
        } else {
            list = $(pctl.id).find(".oz-item");
        }
    } else {
        list = $(pctl.id).find(".oz-item");
    }   
    
    var ctllist = new ozf_Collection();
    for (i = 0; i < list.length; i++) {
        ctllist.Add(getCtl(list[i].id), i);
    }
    return ctllist;
}
/**
 * @객체의 생성자를 체크 한다.
 * @param obj
 * @param typename
 * @returns
 */
function ozf_TypeOf(obj, typename) {
    if (obj.constructor.name === typename ) {
        return true; 
    } else {
        return false;
    }
}

/**
 * @description 컨트롤의 Docking 기능을 처리한다.
 * @param ctl : 대상 컨트롤 ID
 * @param dockoption : 0-None, 1-Top, 2-Bottom, 3-Left, 4-Right, 5-fill
 * @param left
 * @param top
 * @param width
 * @param height
 */
function ozf_ControlDock(ctlid, dockoption, isframe, left, top, width, height) {
    switch (dockoption) {
        case 0: //None
        case 1: //Top
        case 2: //Bottom
        case 3: //Left
        case 4: //Right
        case 5: //Fill
            var ele;
            if (isframe) {
                ele = $(ctlid).parent();
               
            } else {
                ele = $(ctlid);
            }
            ele.css({ 'left': '0px' });
            ele.css({ 'top': '0px' });
            ele.css({ 'right': '0px' });
            ele.css({ 'bottom': '0px' });
            ele.width("auto");
            ele.height("auto");            
    }
}


/*--------------------------------------------------
  기능   :  페이지 간의 정보 전달 저장 하기
----------------------------------------------------*/
function ozf_makePageletter(sender, paraxml) {
    var jsonpara;
    var xmlDoc = ozf_getXMLDoc(paraxml);
    var varlist = xmlDoc.getElementsByTagName("Varinfo");
    if (varlist != null) { //XML To JSON
        varlist = varlist[0];
        var xvar, name, value;
        var newvar;
        jsonpara = [];
        for (i = 0; i < varlist.childNodes.length; i++) {
            xvar = varlist.childNodes[i];
            name = xvar.getAttribute("sourcename");
            value = xvar.firstChild.textContent;
            newvar = new oz_para('in', name, value, '');
            jsonpara.push(newvar);
        } //next    
        ozf_SetTempContent(sender, '${FrameRefreshPage.tmp}$', JSON.stringify(jsonpara), 'GroupFramelocal', false);
    }
    else {
        ozf_SetTempContent(sender, '${FrameRefreshPage.tmp}$', '', 'GroupFramelocal', false);
    }
}

/**
 * @description 서버 정보 가져오기
 * @param purpose
 * @param address
 * @param option
 * @returns
 */
function ozf_GetMetaData(purpose, address, option) {
    var metah = new oza_MetaHandler(purpose, address, option);
    metah.execute(null, false);

    if (oza_CheckMetaReturn(metah.returncontent) == false) {
        return "";
    }
    return metah.returncontent;
}


/**
 * @description OLAP 서비스
 * @param purpose
 * @param address
 * @param option
 * @returns
 */
function ozf_OLAPHandler(purpose, address, option, isset, callback) {
    if (isset == undefined) {
        isset = false;
    }
    var olaph = new oza_olaphandler(purpose, address, option);
    olaph.execute(callback, null, false, isset);
    if (oza_CheckMetaReturn(olaph.returncontent) == false) {
        return "";
    }
    return olaph.returncontent;
}

function ozf_AgentHelperHandler(purpose, address, option, isset, callback) {
    if (isset == undefined) {
        isset = false;
    }
    var olaph = new oza_Helperhandler(purpose, address, option);
    olaph.execute(callback, null, false, isset);   
    return olaph.returncontent;
}

/**
 * @description : 엘리먼트의 특정 속성 값을 찾아 반환한다.
 * @param Element
 * @param AttrName
 * @param DefaultValue
 * @returns
 */
function ozf_GetAttributeValue(Element, AttrName, DefaultValue) {
    DefaultValue = DefaultValue || "";

    if (Element == null) {
        return DefaultValue;
    }

    var attr;
    attr = Element.attributes.getNamedItem(AttrName);
    if (attr != null) {
        return attr.value;
    }
    return DefaultValue;
}


/**
 * @description 항목 설명 가져오기
 * @param Addr
 */
function ozf_getItemDesc(Addr) {
    var ret = ozf_GetMetaData('InfoContent', Addr, "<List><Info option='standard'/></List>");
    if (!ozf_StringIsEmpty(ret)) {
        var xmlDoc = ozf_getXMLDoc(ret)
        var xResult = xmlDoc.documentElement.childNodes[0];
        return ozf_GetAttributeValue(xResult, "description");
    }
    return '';
}

/**
 * @description 문자열을 파싱하여 배열로 반환한다.
 * @param liststr
 * @param delimiter
 * @returns
 */
function ozf_SplitToArray(liststr, delimiter) {
    var idx = 0, j, record = "", isDelim, count = 0, islastdelimlength;
    var txt1 = liststr;
    var delim = delimiter;
    var delimlen = delim.length;
    var txtlen = txt1.length;
    var datalist = new Array();

    while (idx < txtlen) {
        if (txt1.charAt(idx) == delim.charAt(0)) {
            if (delimlen > 1) {
                islastdelimlength = true;
                for (j = 1; j < (delimlen - 1); j++) {
                    if (txt1.charAt(idx + j) != delim.charAt(j)) {
                        islastdelimlength = false;
                        break;
                    }
                }

                if (islastdelimlength = true) {
                    datalist.push(record);
                    record = "";
                    idx = idx + delimlen - 1;
                    isDelim = true;
                }
                else {
                    record = record + txt1.charAt(idx)
                }
            }
            else {
                isDelim = true;
                datalist.push(record);
                record = "";
            }
        }
        else {
            isDelim = false;
            record = record + txt1.charAt(idx);
        }
        idx = idx + 1;
    }

    if (record.length > 0 || isDelim == false) {
        datalist.push(record);
        record = "";
    }
    return datalist;
}

/**
 * @description : Key, Value Sort
 */
function ozf_KeyValue() {
    var list = [];
    this.add = function (key, val) {
        var item = new Object();
        item.key = key;
        item.val = val;
        list.push(item);
    }

    this.clear = function () {
        list = [];
    }

    this.sort = function () {
        list.sort(function (a, b) {
            return a.val.localeCompare(b.val);
        });
    }

    this.item = function (idx) {
        if (idx >= 0 && idx < list.length) {
            return list[idx];
        }
        else { //error
            return null;
        }
    }
    
    this.length = function () {
        return list.length;
    }
}

/**
 * @description : 특정 엘리먼트의 텍스트를 반환한다.
 * @param xitem
 * @param tagname
 * @returns
 */
function ozf_GetFindElementText(xitem, tagname) {
    var xfind = xitem.getElementsByTagName(tagname);
    if (xfind.length > 0) {
        return xfind[0].textContent;
    }
    else {
        return "";
    }
}

/**
 * @description : XCDATA 노드 Text
 * @param xitem
 */
function ozf_GetFindCDATAText(xitem, tagname) {    
    return ozf_GetFindElementText(xitem, tagname);
}

/**
 * @description : XCDATA 노드 Text
 * @param xitem
 */
function ozf_GetCDATAText(xitem, tagname) {    
    if (xitem !== null) {
        return xitem.nodeValue;
    } else {
        return ''
    }
}

/**
 * @description : 메타 아이템 이미지 경로
 * @param itemtype
 * @returns
 */
function ozf_geticonpath(itemtype) {
    switch (itemtype.toLowerCase()) {
        case "managebaseserver":
            return "../image/type/managebaseserver.png";
        case "privatebaseserver":
            return "../image/type/privatebaseserver.png";
        case "publicbaseserver":
            return "../image/type/publicbaseserver.png";
        case "cube":
            return "../image/type/cube.png";
        case "cubefolder":
            return "../image/type/cubefolder.png";
        case "reports":
        case "analyticreports":
            return "../image/type/reports.png";
        case "report":
        case "analyticreport":
            return "../image/type/report.png";
        case "crossreport":
            return "../image/type/crossreport.png";
        case "listreport":
            return "../image/type/listreport.png";
        case "dashboard":
            return "../image/type/dashboard.png";
        case "folder":
            return "../image/type/folder.png";
        case "dimensions":
            return "../image/type/dimensions.png";
        case "dimension":
            return "../image/type/dimension.png";
        case "facts":
            return "../image/type/facts.png";
        case "fact":
            return "../image/type/fact.png";
        case "measures":
            return "../image/type/measures.png";
        case "measure":
            return "../image/type/measure.png";
        default:
            return ""
    }
}

/**
 * @description IIF 구문
 * @param cond
 * @param val1
 * @param val2
 * @returns
 */
function ozf_IIF(cond, val1, val2) {
    if (cond) {
        return val1;
    } else {
        return val2;
    }
}

/**
 * @description 객체 유형 이름을 반환한다.
 * @param 변수 객체
 * @returns 변수 유형 이름 반환
 */
function ozf_GetTypeName(obj) {
    return obj.constructor.name.toLowerCase();
}
/**
 * @description 객체 타입 정보 체크
 * @param obj
 * @param typename
 * @returns
 */
function ozf_GetType(obj, typename) {
    var isallowbutton = false;
    typename = typename.toLowerCase();
    typename = typename.replace("obzenframeplayer.", "");
    switch (typename) {
        case 'frameplayer': typename = 'oz_framePlayer';
            break;
        case 'obzencheckbox': typename = 'oz_check';
            break;
        case 'obzencombobox': typename = 'oz_combo';
            break;
        case 'obzencontrolcontainer': typename = 'oz_panel';
            break;
        case 'obzend3bubble': typename = 'oz_bubble';
            break;
        case 'obzend3chord': typename = 'oz_chord';
            break;
        case 'obzend3sunburst': typename = 'oz_sunburst';
            break;
        case 'obzenframechart': typename = 'oz_chart';
            break;
        case 'obzentime': typename = 'oz_datetime';
            break;
        case 'obzennumerictextbox': typename = 'oz_numbertext';
            break;
        case 'obzenpicture': typename = 'oz_image';
            isallowbutton = true;
            break;
        case 'obzenradiogroup': typename = 'oz_radio';
            break;
        case 'obzenrichtext': typename = 'oz_textarea';
            break;
        case 'obzensplitcontainer': typename = 'oz_ratiopanel';
            break;
        case 'obzentabcontrol': typename = 'oz_tabs';
            break;
        case 'obzentitlelabel': typename = 'oz_image';
            isallowbutton = true;
            break;

        case 'obzenattachfile': typename = 'oz_attachfile';
            break;
        case 'obzenbargauge': typename = 'oz_bargauge';
            break;
        case 'obzenbutton': typename = 'oz_button';
            break;        
        case 'obzencirculargauge': typename = 'oz_circulargauge';
            break;
        case 'obzendate': typename = 'oz_date';
            break;
        case 'obzengrid': typename = 'oz_grid';
            break;
        case 'obzentextbox': typename = 'oz_textbox';
            break;
        case 'obzenlabel': typename = 'oz_label';
            isallowbutton= true
            break;

        case 'obzenlineargauge': typename = 'oz_lineargauge';
            break;
        case 'obzenpanel': typename = 'oz_panel';
            break;
        case 'obzentextarea': typename = 'oz_textarea';
            break;
    }

    if (obj.constructor.name.toLowerCase() === typename) {
        return true;
    } else {
        if (isallowbutton) {
            if (obj.constructor.name.toLowerCase() === "oz_button") {
                return true;
            }
        }
        return false;
    }
}

/**
 * @Display 값을 체크 하여  보이기 여부 반환
 * @param val
 * @returns
 */
function ozf_getCtlVisible(val) {
    if (val === '' || val === 'block' || val === 'inline-block') {
        return true
    } else {
        return false 
    }
}

/**
 * @description 아스키 코드 값 반환
 * @param val
 * @returns
 */
function ozf_chr(val) {
    return String.fromCharCode(val);
}

/**
 * @description Unique ID 발급
 * @returns
 */
function ozf_GetUniqueID() {
    var d = new Date().getTime();
    d += (parseInt(Math.random() * 100)).toString();
    d = 'id' + d;
    return d;
}

/**
 * @description 하위의 모든 노드 삭제
 * @param node
 */
function ozf_removeAllNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

/**
 * @description 복사된 새 객체 반환
 * @param fromobj 복사 할 객체
 * @returns 복사 된 객체
 */
function ozf_objectCopy(fromobj) {
    var keys = Object.keys(fromobj), i, keyLen = keys.length, key;
    var toobj = new Object();
    for (i = 0; i < keyLen; ++i) {
        key = keys[i];
        toobj[key] = fromobj[key];
    }
    return toobj;
}

/**
 * @description 브라우저 열기
 * @param fromobj 브라우저 URL
 */
function ozf_executeWebBrowser(url) {
    window.open(url, '', 'fullscreen=yes');
}

/**
 * @description rgb 문자열을 Hex 문자열로 변환하기
 * @param rgb
 * @returns Hex 문자열
 */
function ozf_rgb2hex(orig) {
    var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
}