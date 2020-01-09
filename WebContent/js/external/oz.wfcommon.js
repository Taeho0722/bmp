/*!
 * obzen Builder Control
 * Copyright 2000 - 2016 obzen, Inc
 */

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////
* Utility
*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// -- framework.js
//if (!String.prototype.endsWith) {
//    String.prototype.endsWith = function (str, strToSearch) {
//        var strSearchLength = strToSearch.length;
//        if (!str || !strToSearch) return false;
//        if (str.substring(str.length - strSearchLength, str.length) === strToSearch) {
//            return true;
//        } else return false;
//    }
//}
function ozw_IsVacant(sVar) {
    //check if sVar == ""
    if (typeof sVar === "undefined") return true;
    if (sVar === null) return true;
    if (sVar.trim().length === 0) return true;
    return false;
}
function ozw_IsNull(sVar) {
    if (typeof sVar === "undefined") return true;
    if (sVar === null) return true;
    return false;
}
function ozw_GetParsedXDoc(sXML) {
    var xmlDoc;
    if (!window.ActiveXObject) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(sXML, "text/xml");
    }
    else { // Internet Explorer
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(sXML);
    }
    return xmlDoc;
}
function ozw_GetAttrValue(xElem, sAttrName, defaultValue) {
    if (typeof defaultValue === 'undefined') defaultValue = "";
    var xAttr;
    xAttr = xElem.attributes.getNamedItem(sAttrName);
    if (ozw_IsNull(xAttr) === false) { //xAttr !== null
        if (xAttr.value.trim() === "")
            return defaultValue;
        else
            return xAttr.value;
    } else {
        return defaultValue;
    }
}
function ozw_GetElementText(xElem, TagNm) {
    if (xElem.getElementsByTagName(TagNm).length > 0) {
        if (!window.ActiveXObject)
            return xElem.getElementsByTagName(TagNm)[0].textContent;
        else
            return xElem.getElementsByTagName(TagNm)[0].text; //nodeTypedValue; //.text
    }
    return "";
}
function ozw_GetColorValue(sBrushXML) {
    var xDoc = ozw_GetParsedXDoc(sBrushXML);
    if (xDoc.getElementsByTagName("SolidColorBrush").length > 0) {
        return xDoc.getElementsByTagName("SolidColorBrush")[0].getAttribute("Color");
    }
    return "#000000";
}
/*
function ozw_rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}
RGBToHex = function (r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(7 - h.length).join("0") + h;
    })(bin.toString(16).toUpperCase())
}
*/
function ozw_rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
     ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}
function ozw_Convert_StrTF2Bool(strVal) {
    if (strVal.toUpperCase() === "T") {
        return true;
    } else {
        return false;
    }
}
function ozw_Convert_String2Bool(strVal) {
    if (strVal.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
}
function ozw_Convert_AckKind2Type(sKind) {
    var sK = sKind.toLowerCase();
     switch (sK) {
        case "procedure":
            return 2;
        case "startprocess":
            return 1;
        case "endprocess":
            return 0;
        case "route":
            return 3;
        case "stopprocess":
            return 4;
        case "dummy":
            return 5;
        default:
             return -1;
    }

}

function ozw_GetLastToken(src, delim) {
    var tokens = src.split(delim);
    return tokens[tokens.length - 1];
}
/*////////////////////////////////////////////////////////////////////////////////////////////////////////////
* Collections
*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ClsColl
function ClsCollJ() {
    this.Keys = [];
    this.Values = [];
    this.keyDelim = "_";
    this.itemIndex = -1;

    Object.defineProperty(this, 'Count', {
        get: function () {
            return this.Values.length;
        },
        set: function (val) {

        }
    });
}
//if (!ClsCollJ.prototype.Count) {
//    ClsCollJ.prototype.Count = function () {
//        return this.Values.length;
//    }
//}
//if (!ClsCollJ.prototype.length) {
//    ClsCollJ.prototype.length = function () {
//        return this.Values.length;
//    }
//}
if (!ClsCollJ.prototype.Clear) {
    ClsCollJ.prototype.Clear = function () {
        this.Keys = [];
        this.Values = [];
    }
}
if (!ClsCollJ.prototype.containsKey) {
    ClsCollJ.prototype.containsKey = function (sKey) {
        if (sKey === null) return false;
        if (sKey === "") return false;
        for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
            if (this.Keys[i] === sKey) {
                this.itemIndex = i;
                return true;
            }
        }
        return false;
    }
}
//if (!ClsCollJ.prototype.put) {
//    ClsCollJ.prototype.put = function (sKey, oValue) {
//        this.Add(sKey, oValue);
//    }
//}
//if (!ClsCollJ.prototype.get) {
//    ClsCollJ.prototype.get = function (sKey) {
//        return this.Item(sKey);
//    }
//}
if (!ClsCollJ.prototype.Add) {
    ClsCollJ.prototype.Add = function (sKey, oValue) {
//sKey == "", Key 없이 index로만 access . 단 Remove하면 KeyIndex에 Hole이 생김
        if (sKey === null) return false;
        if (sKey === "")
            this.Keys.push(this.Values.length);
        else
            this.Keys.push(sKey);
        this.Values.push(oValue);
    }
}
if (!ClsCollJ.prototype.AddKey) {
    ClsCollJ.prototype.AddKey = function (sKey) {
        //sKey == "", Key 없이 index로만 access . 단 Remove하면 KeyIndex에 Hole이 생김
        if (sKey === null) return false;
        if (sKey === "")
            this.Keys.push(this.Keys.length);
        else
            this.Keys.push(sKey);
    }
}
if (!ClsCollJ.prototype.Remove) {
    ClsCollJ.prototype.Remove = function (sKey) {
        if (sKey === null) return false;
        if (sKey === "") return false;
        if (this.containsKey(sKey) === true) {
            if (this.itemIndex === 0) { //if first
                this.Keys.shift();
                this.Values.shift();
                return true;
            }
            if (this.itemIndex === (this.Values.length - 1)) { //if last
                this.Keys.pop();
                this.Values.pop();
                return true;
            }
            //between slice(fromIndex, toIndex + 1)
            var a1 = this.Keys.slice(0, this.itemIndex);
            var a2 = this.Keys.slice(this.itemIndex + 1, this.Values.length);
            this.Keys = a1.concat(a2);
            a1 = this.Values.slice(0, this.itemIndex);
            a2 = this.Values.slice(this.itemIndex + 1, this.Values.length);
            this.Values = a1.concat(a2);
        }
    }
}
if (!ClsCollJ.prototype.RemoveKey) {
    ClsCollJ.prototype.RemoveKey = function (sKey) {
        //gojs removeNodeData/removeLinkData에서 Value만 지우는 경우 사용
        if (sKey === null) return false;
        if (sKey === "") return false;
        if (this.containsKey(sKey) === true) {
            if (this.itemIndex === 0) { //if first
                this.Keys.shift();
                return true;
            }
            if (this.itemIndex === (this.Keys.length - 1)) { //if last
                this.Keys.pop();
                return true;
            }
            //between slice(fromIndex, toIndex + 1)
            var a1 = this.Keys.slice(0, this.itemIndex);
            var a2 = this.Keys.slice(this.itemIndex + 1, this.Keys.length);
            this.Keys = a1.concat(a2);
        }
    }
}
if (!ClsCollJ.prototype.Item) {
    ClsCollJ.prototype.Item = function (sKey) {
        //없으면 null 반환
        if (sKey === null) return null;
        if (sKey === "") return null;
        var found = -1;
        for (var i = 0, keyslen = this.Keys.length; i < keyslen; i++) {
            if (this.Keys[i] === sKey) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            var retVal = this.Values[found];
            this.itemIndex = found;
            return retVal;
        }
        else { //error
            return null;
        }
    }
}
//Index 0 base
if (!ClsCollJ.prototype.ItemByIndex) {
    ClsCollJ.prototype.ItemByIndex = function (iIndex) {
        if (iIndex < 0 || iIndex >= this.Values.length) return null;
        return this.Values[iIndex];
    }
}
if (!ClsCollJ.prototype.sort) {
    ClsCollJ.prototype.sort = function (sortfunc) {
        this.Values.sort(sortfunc);
    }
}

function ozw_transPath2OZID(path) {
    var mh = new oza_MetaHandler("ServerHelper",
                    "<List><Item address='{0}'/></List>".format(path), "<List><Item option='translate'/></List>");
    mh.execute("", "");

    if (mh.iserror === true) {
        return "";
    }

    var xDoc = ozw_GetParsedXDoc(mh.returncontent);
    var xroot = xDoc.documentElement;
    if (xroot.childNodes.length === 0) { return; }

    xroot = xroot.childNodes[0];
    var ozid = ozw_GetAttrValue(xroot, "address", "");

    return ozid;
}

function OZWfAttr() {
    this.name = "";
    this.caption = "";
    this.valuetype = "String"; //Boolean/Calss
    this.value = "";
}
function ozw_GetWfInitValue(xAttr) {
    //<Attr ><InitValue><![CDATA[xx]]></InitValue></Attr>
    var sVal = "";
    if (xAttr.childElementCount > 0) { //childNodes.length > 0) {
        //nodetype != 1이면 text(newline 등)임
        //sVal = xAttr.childNodes[0].textContent.trim();
        sVal = xAttr.firstElementChild.textContent.trim();
    }
    return sVal;
}
function ozw_GetWfCDataValue(xParent, sChild) {
    //<Transition ><Caption><![CDATA[xx]]></Caption></Transition>
    var sVal = "";
    var xChild = xParent.getElementsByTagName(sChild);
    if (xChild.length > 0) {
        sVal = xChild[0].textContent.trim();
    }
    return sVal;
}

function OZwfDataField() {
    this.name;
    this.value;
}


function ozw_GetCollItemValue(refColl, sID) {
    //Collection의 Item이 Class(DataField/Attr Item)인 경우
    //없으면 빈 스트링 반환해야 함
    if (refColl.containsKey(sID) === true) {
        return refColl.ItemByIndex(refColl.itemIndex).value;
        //return refColl.Item(sID).value;
    } else {
        return "";
    }
}

function OZwfExecInfo() {
    this.M_ID = "";
    this.I_ID = "";
    this.Status = ""; //UI편의성을 위해 NONE 디폴트값 사용안하기
    this.HasError = false;
    this.ErrorDesc = ""; //For OptionWindow?
}

//유지할 이유가 있을까??? 공유할 수 있는지도 불분명함
var gWfResources = new ClsCollJ();

function OZwfResource() {
    this.myPathAddr; //PathAddress
    this.myContent;
    this.OZID;
    this.Name;
    this.WfProc = new OZwfProcess();
    this.WfActList = new ClsCollJ(); //Attr 
}
if (!OZwfResource.prototype.ReadContent) {
    OZwfResource.prototype.ReadContent = function (sID) {
        //doReadResource
        this.myPathAddr = sID;
        //this.myOZID = ozw_transPath2OZID(sID);
        var mh = new oza_MetaHandler("Content", 
            "<List><Item address='{0}'/></List>".format(sID), "<List><Info option='content'/></List>");
        if (mh.execute("", "") === false) {
            console.log("Error>> Resource_Init Failed!!");
            return false;
        }
        this.myContent = mh.returncontent;
        var xDoc = ozw_GetParsedXDoc(this.myContent);
        var xRoot = xDoc.documentElement;   
        if (xRoot.childNodes.length === 0) { return false; }
        xRoot = xRoot.childNodes[0];
        this.Name = ozw_GetAttrValue(xRoot, "name", "");
        this.OZID = ozw_GetAttrValue(xRoot, "ozid", "");
        if (xRoot.childNodes.length === 0) { return; }
        var xProc = xRoot.getElementsByTagName("ProcessInfo"); //List/ProcessResource/ProcessInfo
        if (xProc.length > 0) this.WfProc.SetProcContent(xProc[0]);  //Design
        var xAct, oWfAct, i, j, sNA, sV;
        var xActs = xRoot.getElementsByTagName("Activities")[0];
        var oWfAttr, xAttrs, xAttr;
        for (i = 0; i < xActs.childNodes.length; i++) {
            xAct = xActs.childNodes[i];
            if (xAct.nodeType !== 1) continue;
            oWfAct = new OZwfActivity();
            oWfAct.xData = xAct;
            oWfAct.key = ozw_GetAttrValue(xAct, "name", "");
            oWfAct.ActName = ozw_GetAttrValue(xAct, "name", "");
            oWfAct.activitykind = ozw_GetAttrValue(xAct, "activitykind", "");
            oWfAct.acttype = ozw_Convert_AckKind2Type(oWfAct.activitykind);
            oWfAct.color = ozw_GetAttrValue(xAct, "color", "");
            oWfAct.colorH = ozw_rgb2hex("rgb(" + oWfAct.color + ")");
            //web image file match를 위해 소문자로
            oWfAct.imageid = ozw_GetAttrValue(xAct, "imageid", "");
            xAttrs = xAct.getElementsByTagName("Attr");
            for (j = 0; j < xAttrs.length; j++) {
                xAttr = xAttrs[j];
                sNA = ozw_GetAttrValue(xAttr, "name", "");
                sV = xAttr.children[0].textContent.trim();
                if (sNA === "design_page") {
                    oWfAct.design_page = sV;
                }
                if (sNA === "result_page") {
                    oWfAct.result_page = sV;
                }
                if (sNA === "error_page") {
                    oWfAct.error_page = sV;
                }
                //Design
                oWfAttr = new OZWfAttr();
                oWfAttr.name = ozw_GetAttrValue(xAttr, "name", "");
                oWfAttr.caption = ozw_GetAttrValue(xAttr, "caption", "");
                oWfAttr.valuetype = ozw_GetAttrValue(xAttr, "valuetype", "");
                oWfAttr.value = ozw_GetWfInitValue(xAttr);
                oWfAct.Attrs.Add(oWfAttr.name, oWfAttr);
            }
            this.WfActList.Add(oWfAct.key, oWfAct);
        }

        var xData, xItms, oWfDF;
        var xDataRoot = xRoot.getElementsByTagName("DataFields");
        if (xDataRoot.length > 0) {
            xDataRoot = xDataRoot[0];
            xData = xDataRoot.getElementsByTagName("ProcessData");
            if (xData.length > 0) {
                this.WfProc.applyProcessData(xData[0]);
            }
            xData = xDataRoot.getElementsByTagName("ActivityData");
            if (xData.length > 0) {
                //this.applyActData(xData[0], false);
                xData = xData[0].getElementsByTagName("Activity");
                for (i = 0; i < xData.length; i++) {
                    oWfAct = this.WfActList.Item(ozw_GetAttrValue(xData[i], "name", ""));
                    if (oWfAct === null) {
                        alert("리소스 액티비티가 없어 데이터를 변경할 수 없음:" + sNA);
                    } else {
                        xItms = xData[i].getElementsByTagName("Item");
                        for (j = 0; j < xItms.length; j++) {
                            oWfDF = new OZwfDataField();
                            oWfDF.name = ozw_GetAttrValue(xItms[j], "na", "");
                            oWfDF.value = xItms[j].textContent.trim();
                            oWfAct.DataFields.Add(oWfDF.name, oWfDF);
                        }                    }
                }
            }
        }

        return true;
    }
}

function ozw_GetResourceInfo(sResourceAddressPath) {
    //안쓸수도
    if (gWfResources.containsKey(sResourceAddressPath)) {
        return gWfResources.Item(sResourceAddressPath);
    } else {
        var oWfR = new OZwfResource();
        oWfR.ReadContent(sResourceAddressPath);
        gWfResources.Add(sResourceAddressPath, oWfR);
        return oWfR;
    }
}


function OZwfProcess() {
    //this.ProcessName; //대신 ozbuildere.MProcessName 사용
    this.Description = "";   //SaveContent시 필요
    //Design>Attr-Property
    this.Attrs = new ClsCollJ();         //OZWfAttr
    //
    this.DataFields = new ClsCollJ();    //OZwfDataField
    //ExecInfo
    this.ExecInfo;
}
if (!OZwfProcess.prototype.SetProcContent) {
    OZwfProcess.prototype.SetProcContent = function (xNod) {
        //Design
        this.Description = ozw_GetAttrValue(xNod, "description", "");
        var xAttrs = xNod.getElementsByTagName("Attr");
        var xAttr, oWfAttr;
        for (var i = 0; i < xAttrs.length; i++) {
            xAttr = xAttrs[i];
            oWfAttr = new OZWfAttr();
            oWfAttr.name = ozw_GetAttrValue(xAttr, "name", "");
            //name이 'DataFields'인 경우가 있는가? 있으면 제외?
            oWfAttr.caption = ozw_GetAttrValue(xAttr, "caption", "");
            oWfAttr.valuetype = ozw_GetAttrValue(xAttr, "valuetype", "");
            oWfAttr.value = ozw_GetWfInitValue(xAttr);
            this.Attrs.Add(oWfAttr.name, oWfAttr);
        }
    }
}
if (!OZwfProcess.prototype.applyProcessData) {
    OZwfProcess.prototype.applyProcessData = function (xNod) {
        //<ProcessData><Item na='xx'></Item>sValueX</ProcessData>
        var xItms, xItm, sNa, oWfDF;
        xItms = xNod.getElementsByTagName("Item");
        for (var i = 0; i < xItms.length; i++) {
            xItm = xItms[i];
            sNa = ozw_GetAttrValue(xItm, "na", "");
            oWfDF = this.DataFields.Item(sNa);
            if (oWfDF === null) {
                oWfDF = new OZwfDataField();
                oWfDF.name = sNa;
                this.DataFields.Add(sNa, oWfDF);
            }
            oWfDF.value = xItm.textContent.trim();
        }
    }
}
if (!OZwfProcess.prototype.Clone) {
    OZwfProcess.prototype.Clone = function () {
        var oWfProc = new OZwfProcess();
        oWfProc.Description = this.Description;
        var oWfDF, pWfDF;
        for (var i = 0; i < this.DataFields.Count; i++) {
            pWfDF = this.DataFields.ItemByIndex(i);
            oWfDF = new OZwfDataField();
            oWfDF.name = pWfDF.name;
            oWfDF.value = pWfDF.value;
            oWfProc.DataFields.Add(oWfDF.name, oWfDF);
        }
        //Design
        var oWfAttr, pWfAttr;
        for (var j = 0; j < this.Attrs.Count; j++) {
            pWfAttr = this.Attrs.ItemByIndex(j);
            oWfAttr = new OZWfAttr();
            oWfAttr.name = pWfAttr.name;
            oWfAttr.caption = pWfAttr.caption;
            oWfAttr.valuetype = pWfAttr.valuetype;
            oWfAttr.value = pWfAttr.value;
            oWfProc.Attrs.Add(oWfAttr.name, oWfAttr);
        }
        //ExecInfo는 리소스에 없을 듯하므로 할 필요???
        return oWfProc;
    }
}


function OZwfActivity() {
    this.xData; //xml Content xElement
    //Property
    this.activitykind = "procedure";
    this.key = "";   //name
    this.color;
    this.imageid = "";

    //--UI표시와 관련
    //wActivityI activityData
    //this.app_name_def = ""; //caption으로 대치. Attrs에 있음 ACT_NM CAMP_NM
    //wActivityP
    //this.app_desc_def = ""; //description for wProAct : ACT_DESC_INFO
    //this.item_addition = ""; //Extra
    /**
     * 런타임에 많이 access 되므로 Attrs 컬렉션 내부에 저장되는 문자열("True"/"False"") 형태의 값과 별도로 유지.
     * 값이 바뀌면 Attrs("design_finish")값도 같이 바꿀것. 저장시에는 Attrs의 값이 저장됨
    */
    this.design_finish = false;     
    this.colorH = "#e87f24";            //화면에서 사용하기위해 hexa향태로
    this.designmode = true;
    this.finishVisible = 0;
    //function () {
    //    if ((this.designmode == true) && (this.design_finish == true)) return 1;
    //    return 0;
    //}
    //Object.defineProperty(this, 'finishVisible', {
    //    get: function () {
    //        if ((this.designmode == true) && (this.design_finish == true)) {
    //            this._finishVisible = 1;
    //        } else {
    //            this._finishVisible = 0;
    //        }
    //        return this._finishVisible;
    //    },
    //    set: function (val) {
    //        this._finishVisible = val; 
    //    }
    //});
    //base resource
    this.ActName = "";      //resource name
    this.design_page = "";
    this.result_page = "";
    this.error_page = "";
    //internal
    this.acttype = 2; //2:procedure

    //wfProcAct
    this.caption = "";   
    this.description = "";
    this.Extra = "";
    this.tocand;    //wfLinkCandidates : 처음 access될 때 초기화
    this.tocand_isAnd = true;  //true/false
    this.fromcand;
    this.fromcand_isAnd = true;
    //_InLinks/_OutLInks OZwfLink 컬렉션: getPreActs/getPostActs
    //this.inLinks = new ClsCollJ();  //in WfAct의 key
    //this.outLinks = new ClsCollJ(); //Out WfAct의 key
    //Design
    this.Attrs = new ClsCollJ(); 

    //ExecInfo
    this.HasExecInfo = false;
    this.ExecInfo;
    this.SetStatus = function (sStatus) { this.ExecInfo.Status = sStatus; };

    //internal
    this.isSmall = false; //fissmall;

    this.DataFields = new ClsCollJ();

    //gojs nodetemplatemap
    Object.defineProperty(this, 'category', {
        get: function () {
            return this.activitykind.toLowerCase();
        },
        set: function (val) {

        }
    });

    this.toActs; //buildere. runtime temporary(while deleteing)
    //Method
    // GetFromAppIDValueList -> wfbuilder의 GetFromAppIDValueList(pWfAct) 로 대치
}


if (!OZwfActivity.prototype.CloneFrom) {
    OZwfActivity.prototype.CloneFrom = function (wfActF, sName) {
        this.key = wfActF.key;
        this.caption = wfActF.caption;
        this.ActName = wfActF.ActName;
        this.activitykind = wfActF.activitykind;
        this.color = wfActF.color;
        this.colorH = wfActF.colorH;
        this.imageid = wfActF.imageid;
        this.design_page = wfActF.design_page;
        this.result_page = wfActF.result_page;
        this.error_page = wfActF.error_page;
        var oWfAttr, pWfAttr;
        for (var j = 0; j < wfActF.Attrs.Count; j++) {
            pWfAttr = wfActF.Attrs.ItemByIndex(j);
            oWfAttr = new OZWfAttr();
            oWfAttr.name = pWfAttr.name; 
            oWfAttr.caption = pWfAttr.caption; 
            oWfAttr.valuetype = pWfAttr.valuetype; 
            oWfAttr.value = pWfAttr.value; 
            this.Attrs.Add(oWfAttr.name, oWfAttr);
        }
        var oWfDF, pWfDF;
        for (var k = 0; k < wfActF.DataFields.Count; k++) {
            pWfDF = wfActF.DataFields.ItemByIndex(k);
            oWfDF = new OZwfDataField();
            oWfDF.name = pWfDF.name;
            oWfDF.value = pWfDF.value;
            this.DataFields.Add(oWfDF.name, oWfDF);
        }
        if (sName === "")
            this.key = wfActF.ActName;
        else
            this.key = sName;
        this.caption = this.key;
    }
}

if (!OZwfActivity.prototype.ChangeCaption) {
    OZwfActivity.prototype.ChangeCaption = function (sNewCaption) {
        this.caption = sNewCaption;
    }
}
if (!OZwfActivity.prototype.ChangeDesc) {
    OZwfActivity.prototype.ChangeDesc = function (sNewDesc) {
        this.description = sNewDesc;
    }
}
if (!OZwfActivity.prototype.checkCandInit) {
    OZwfActivity.prototype.checkCandInit = function () {
        var pWfLnkC, pArr, i;
        checkInitTo: {
            if (ozw_IsNull(this.tocand) === true) {
                //create wfLinkCandidates
                this.tocand = new ClsCollJ();
                var sCands = ozw_GetCollItemValue(this.Attrs, "_to_");
                if (sCands === "") break checkInitTo;
                if (sCands.endsWith(";")) {
                    sCands = sCands.substr(0, sCands.length - 1);
                }
                if (sCands.endsWith(",")) {
                    sCands = sCands.substr(0, sCands.length - 1);
                }
                if (ozw_IsVacant(sCands) === true) break checkInitTo;
                pArr = [];
                if (sCands.indexOf(";") !== -1) {
                    pArr = sCands.split(";");
                    for (i = 0; i < pArr.length; i++) {
                        pWfLnkC = new OZwfLinkCandItem(pArr[i]);
                        this.tocand.Add(pWfLnkC.sNamesComma, pWfLnkC);
                    }
                    this.tocand_isAnd = true;
                } else {
                    if (sCands.indexOf(",") !== -1) {
                        pArr = sCands.split(",");
                        for (i = 0; i < pArr.length; i++) {
                            pWfLnkC = new OZwfLinkCandItem(pArr[i]);
                            this.tocand.Add(pWfLnkC.sNamesComma, pWfLnkC);
                        }
                        this.tocand_isAnd = false;
                    } else {
                        pWfLnkC = new OZwfLinkCandItem(sCands);
                        this.tocand.Add(pWfLnkC.sNamesComma, pWfLnkC);
                        this.tocand_isAnd = false;
                    }
                }
            }
        }
        checkInitFrom: {
                //from
                this.fromcand = new ClsCollJ();
                sCands = ozw_GetCollItemValue(this.Attrs, "_from_");
                if (sCands === "") break checkInitFrom;
                if (sCands.endsWith(";")) {
                    sCands = sCands.substr(0, sCands.length - 1);
                }
                if (sCands.endsWith(",")) {
                    sCands = sCands.substr(0, sCands.length - 1);
                }
                if (ozw_IsVacant(sCands) === true) break checkInitFrom;
                pArr = [];
                if (sCands.indexOf(";") !== -1) {
                    pArr = sCands.split(";");
                    for (i = 0; i < pArr.length; i++) {
                        pWfLnkC = new OZwfLinkCandItem(pArr[i]);
                        this.fromcand.Add(pWfLnkC.sNamesComma, pWfLnkC);
                    }
                    this.fromcand_isAnd = true;
                } else {
                    if (sCands.indexOf(",") !== -1) {
                        pArr = sCands.split(",");
                        for (i = 0; i < pArr.length; i++) {
                            pWfLnkC = new OZwfLinkCandItem(pArr[i]);
                            this.fromcand.Add(pWfLnkC.sNamesComma, pWfLnkC);
                        }
                        this.fromcand_isAnd = false;
                    } else {
                        pWfLnkC = new OZwfLinkCandItem(sCands);
                        this.fromcand.Add(pWfLnkC.sNamesComma, pWfLnkC);
                        this.fromcand_isAnd = false;
                    }
                }
            }        
    }
}
if (!OZwfActivity.prototype.getConnectables) {
    OZwfActivity.prototype.getConnectables = function (pCollCands) {
        var pWfLnkC, i;
        this.checkCandInit();
        //wfLinkCandidates.getCreatables
        if (this.tocand.Count === 0) return false;
        var iTmpCnt = 0;
        if (this.tocand_isAnd === true) {
            for (i = 0; i < this.tocand.Count; i++) {
                pWfLnkC = this.tocand.ItemByIndex(i);
                if (pWfLnkC.iCurCount < pWfLnkC.iMaxCount) {
                    iTmpCnt++;
                    pCollCands.Add(pWfLnkC.sNamesComma, pWfLnkC.sNamesComma);
                }
            }
            if (iTmpCnt === 0) return false;
        } else {
            for (i = 0; i < this.tocand.Count; i++) {
                pWfLnkC = this.tocand.ItemByIndex(i);
                if (pWfLnkC.iCurCount > 0) {
                    if (pWfLnkC.iCurCount < pWfLnkC.iMaxCount) {
                        pCollCands.Add(pWfLnkC.sNamesComma, pWfLnkC.sNamesComma);
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    iTmpCnt++;
                    pCollCands.Add(pWfLnkC.sNamesComma, pWfLnkC.sNamesComma);
                }
            }
            if (iTmpCnt === 0) return false;
        }        
        return true;
    }
}
if (!OZwfActivity.prototype.AddLink) {
    OZwfActivity.prototype.AddLink = function (sActName, bIsIn) {
        this.checkCandInit();
        var pWfLnkC;
        if (bIsIn) {
            if (this.fromcand.Count === 0) return true;
            pWfLnkC = this.fromcand.Item(sActName);
            if (pWfLnkC !== null) {
                pWfLnkC.TryLinkAdd();
            }
        } else {
            if (this.tocand.Count === 0) return true;
            pWfLnkC = this.tocand.Item(sActName);
            if (pWfLnkC !== null) {
                pWfLnkC.TryLinkAdd();
            }
        }
    }
}
if (!OZwfActivity.prototype.RemoveLink) {
    OZwfActivity.prototype.RemoveLink = function (sActName, bIsIn) {
        var pWfLnkC;
        if (bIsIn) {
            if (this.fromcand.Count === 0) return true;
            pWfLnkC = this.fromcand.Item(sActName);
            if (pWfLnkC !== null) {
                pWfLnkC.TryLinkDel(sActName);
                //this.fromcand.Remove(sActName);
            }
        } else {
            if (this.tocand.Count === 0) return true;
            pWfLnkC = this.tocand.Item(sActName);
            if (pWfLnkC !== null) {
                pWfLnkC.TryLinkDel(sActName);
                //this.tocand.Remove(sActName);
            }
        }
    }
}
if (!OZwfActivity.prototype.CheckLinkable) {
    OZwfActivity.prototype.CheckLinkable = function (pWfAct, bIsFrom) {
        this.checkCandInit();
        //두 노드간에 1개 이상의 링크가 연결되지 않는다는 가정??
        var collCand, bIsAnd;
        if (bIsFrom === true) {
            //this.fromcand.tryLink
            collCand = this.fromcand;
            bIsAnd = this.fromcand_isAnd;
        } else {
            //this.tocand.tryLink
            collCand = this.tocand;
            bIsAnd = this.tocand_isAnd;
        }
        //getConnectables가 항상 먼저 호출된다는 가정하에 tocand 초기화 확인 안함.

        if (collCand.Count === 0) return true;
        var pWfLnkC;
        if (collCand.containsKey(pWfAct.ActName) === false) {
            console.log("ozWfCommon:링크안됨:" + this.ActName + ":---To:" + pWfAct.ActName);
            return false;
        }
        if (bIsAnd) {
            pWfLnkC = collCand.Item(pWfAct.ActName);
            if (pWfLnkC.TryLinkAdd() === true) return true;
            console.log("ozWfCommon:링크안됨Max초과:" + this.ActName + ":---To:" + pWfAct.ActName);
            return false;
        } else {
            //OR
            for (var i = 0; i < collCand.Count; i++) {
                pWfLnkC = collCand.ItemByIndex(i);
                if (pWfLnkC.sNamesComma !== pWfAct.ActName) {
                    if (pWfLnkC.iCurCount > 0) {
                        console.log("ozWfCommon:링크안됨:동일형식이미존재" + this.ActName + ":---To:" + pWfAct.ActName);
                        return false;
                    }
                }
            }
            pWfLnkC = collCand.Item(pWfAct.ActName);
            if (pWfLnkC.TryLinkAdd() === true) {
                return true;
            } else {
                console.log("ozWfCommon:링크안됨Max초과:" + this.ActName + ":---To:" + pWfAct.ActName);
                return false;
            }
        }
        

    }
}

function OZwfLinkCandItem(sDefStr) {
    this.sNamesComma = "";
    this.iMaxCount = 0;
    this.iCurCount = 0;

    if (ozw_IsVacant(sDefStr) === true) return;
    if (sDefStr.indexOf(",") !== -1) {
        this.iMaxCount = 1;
    } else {
        if (sDefStr.indexOf("*") !== -1) {
            this.iMaxCount = 100; //no limit
            sDefStr = sDefStr.substr(0, sDefStr.length - 1);
        } else {
            this.iMaxCount = 1;
        }
    }
    this.sNamesComma = sDefStr;
}
if (!OZwfLinkCandItem.prototype.TryLinkAdd) {
    OZwfLinkCandItem.prototype.TryLinkAdd = function () {
        //실제 추가한 것처럼 CurCount 증가
        if ((this.iMaxCount > 0) && (this.iMaxCount > this.iCurCount)) {
            this.iCurCount++;
            return true;
        }
        return false;
    }
}
if (!OZwfLinkCandItem.prototype.TryLinkDel) {
    OZwfLinkCandItem.prototype.TryLinkDel = function () {
        //실제 추가한 것처럼 CurCount 증가
        if ((this.iMaxCount > 0) && (this.iMaxCount >= this.iCurCount)) {
            this.iCurCount--;
            return true;
        }
        return false;
    }
}

function OZwfLink() {
    this.xData;
    this.key;   //name
    this.from;
    this.to;
    this.color;
    this.colorH;
    //Link Internal
    this.fromPort = "Out";
    this.toPort = "In";
    //Design
    this.caption = "";
    this.condition = "";
    //eventBuilder Only    
    this.priority = "";
    this.dummyname = "";
    this.isdummy = false;
    this.isgroup = false;
    this._linklabel = ""; //for UI
    Object.defineProperty(this, 'linklabel', {
        get: function () {
            var tmp = this.caption;
            if ((this.isgroup === true) && (this.isdummy === false)) {
                tmp = "";
            }
            return tmp;
        },
        set: function (val) {
            this._linklabel = val; 
        }
    });
}
if (!OZwfLink.prototype.GetID) {
    OZwfLink.prototype.GetID = function () {
        return this.from + "_" + this.to;
    }
}

function OZwfBuilderEventInfo() {
    this.Purpose;
    this.Address;
    this.Content;
    this.Extra;
}


function ozw_GetStatusCaption(sID) {
    var sCap = sID;
    switch (sID) {
        case "COMPLETE":
            sCap = "종료";
            break;
        case "READY":
            sCap = "준비";
            break;
        case "SUSPEND":
            sCap = "멈춤";
            break;
        case "START":
            sCap = "시작";
            break;
        case "STOP":
            sCap = "중단";
            break;
        case "RESTART":
            sCap = "재시작";
            break;
        case "RESUME":
            sCap = "재개";
            break;
        case "AFTER_START":
            sCap = "시작후";
            break;
        case "BEFORE_START":
            sCap = "시작전";
            break;
        case "NOTREADY":
            sCap = "NOTREADY";
            break;
    }
    return sCap;
}

