 /*!
 * obzen Builder Control
 * Copyright 2000 - 2017 obzen, Inc
 */

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////
 * Refer>>
 * obzenWebFrame의 getCtl 함수 사용
 * ToDo>>>
 * Diagram 종류별 UI 구현, 차이점 비교 :
 *  - event    : 
 * SaveContent -> agent api에 SetData(Content) 존재 확인. eCube서버도 확인 필요
 */////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*/ CD_EasyBuild
 *   ActivityCreated/ActivityDeleted/ActivityDoubleClicked 이벤트 사용
 */////////////////////////////////////////////////////////////////////////////////////////////////////////////


go.licenseKey = "73ff46e4b71c28c702d95d76423d6cbc5cf07f21de821aa05d5147a7ea5c3d122b99e17102d6dfd2c2ff47ac1d7dc3d1df913b2b924d0532e734868e47e6d4ffe0377ba0040e12dea203749398e83aa2fd7877edcaaa75";

var $go = go.GraphObject.make;  // for conciseness in defining templates

var enumEnd = 0, enumStart = 1, enumProc = 2, enumRoute = 3;

var gWfDiagramID = 'divBuilder1';
function getRefBuilderID() {
    var pDiv = document.getElementById(gWfDiagramID);
    pDiv = pDiv.parentElement;
    return pDiv.id;
}
//=== ozbuilderp==========B=======================================================//
function ozbuilderp(sID) { //parentDivID, contextMenuDivID) {
    this.mvarid = '#' + sID;
    this.ctl;


    //ID
    this.myID = sID; // "";        
    this.sParentDivID = 'divBuilder1'; //parentDivID;
    //<div id='divBuilder1' style="border: solid 1px black;border-left-width:6px; position:absolute; top:112px;width:800px;height:400px"></div>
    //<div id='divWfCM1' class='oz-wf-contextMenu'><ul></ul></div>

    //ContextMenu
    this.sCMDivID = 'divWfCM1'; //contextMenuDivID;;      //ContextMenu Div ID
    this.myCMDiv;               //Object ContextMenu Div
    this.myCMUL;                //Object ContextMenu UL

    var refPDiv = document.getElementById(sID);
    refPDiv.style.border = "solid 1px lightgray";
    refPDiv.innerHTML = "<div id='divBuilder1' class='oz-wf-Div-BuilderP'></div>" +
        "<div id='divWfCM1' class='oz-wf-cm-p'><ul></ul></div>";

    if (ozw_IsVacant(this.sCMDivID) == false) {
        this.myCMDiv = document.getElementById(this.sCMDivID);
        if (ozw_IsNull(this.myCMDiv) == false) {
            // We don't want the div acting as a context menu to have a (browser) context menu!
            this.myCMDiv.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }, false);
            this.myCMDiv.addEventListener("blur", function (e) { this.myDiagram.currentTool.stopTool(); }, false);
            if (this.myCMDiv.children.length > 0)
                this.myCMUL = this.myCMDiv.firstElementChild;
        }
    }
    //this.myContextMenu = $go(go.HTMLInfo, {
    //    show: showContextMenu,
    //    mainElement: this.myCMDiv
    //})

    
    //Property=================

    this.ResourceID = "/ManageBaseServer/Workflow/CampaignResource/EBMBase";
    this.MProcessesID = "/ManageBaseServer/Workflow/ProcessMeta/EBM";
    this.MProcessesOZID = "";   //MProcessesID의 OZID
    this.MProcessID = "";       //_MProcessEOzID
    this.MProcessName = "";
    this.UserID = "";
    this.ResourceCustomCaptionList = "";
    this.RsrcCaptionColl = new ClsCollJ();
    this.UsingResourceNameList = "";
    this.MPAppID;
    this.IPAppID;
    this.LayoutDirection = 0;   //0:Horizon 1:Vertical
    this.ZoomPercent = 100;
    this.InnerDockPos = 3;
    this.Editable = true;
    this.RunAsMonitor = false;
    this.RaiseEvent_BeforeStateChange = false;
    this.ManualActivityDelete = false;
    //활성화 여부 설정
    Object.defineProperty(this, 'Enabled', {
        get: function () {
            //return !this.ctl.prop('disabled');
            return true;
        },
        set: function (val) {
            //this.ctl.prop('disabled', !val);
        }
    });
    // visible Property
    Object.defineProperty(this, 'Visible', {
        get: function () {
            if (this.ctl.css('display') === '') {
                return true;
            } else {
                return false;
            }
        },
        set: function (val) {
            this.setVisible(val);
            if (val === true) {
                this.ctl.css('display', 'block');
            }
            else {
                this.ctl.css('display', 'none');
            }
        }
    });


    //Event======================
    /**
     * Click Event
     * @param e 
     */
    this.Clicked = function (e) { }
    /**
     * Double Click Event
     * @param e
     */
    this.DoubleClicked = function (e) { }
    /**
     * ActivityDoubleClicked Event
     * @param e
     */
    this.activitydoubleclicked = function (e) { } //alert(e.subject.part.data.key);
    this.activitydeleted = function (e) { }
    this.activitycreated = function (e) { }
    this.beforestatechange = function (e) { }
    this.beforeactivitydelete = function (e) { }
    //Event_End==================

    //ContextMenu for Monitoring
    this.gHideActions = "";         //String    HideStatusActions
    this.gCustomStatusAddList;      //ClsColl   HandleStatusActions   
    this.gCustomStatusHideList;     //ClsColl
    this.gCustomStatusAddListByID;  //ClsColl   HandleStatusActionsByID   
    this.gCustomStatusHideListByID; //ClsColl

    //UI========================
    this.bInitCalled = false;
    this.myDiagram = this.initDiagram(this.sParentDivID);
    //this.myDiagram.contextMenu = myContextMenu;
    this.myCurNode; //ContextMenu Owner Node
    this.myCurLink;
    //Diagram Model: NodeLinkData
    //this.myArrNodeData = []; //gProcActs.Values;
    //this.myArrLinkData = []; //gProcLinks.Values
    this.gUniqueIdx = 0;
    this.myStatus = false; //userinsertlink :false addNode(true)
    //Internal==================
    this.gEvtArgs = new OZwfBuilderEventInfo();
    //Resource
    this.gWfResource;      //OZwfResource
    //this.gRsrcWfProc;     //gWfResource.WfProc
    //this.gActivities;     //gWfResource.WfActList = new ClsColl(); //gRsrcActs
    this.IsResourceFilled = false;
    //Process
    this.myContent;
    this.gProcWfProc = new OZwfProcess();
    this.gProcActs = new ClsCollJ();
    this.gProcLinks = new ClsCollJ();

    //
    this.colorLinkDef = ozw_rgb2hex("rgb(105, 105, 105)");  //DimGray       //"rgba(105, 105, 105)" 시도해볼것
    this.colorLinkExe = ozw_rgb2hex("rgb(54, 224, 208)");   //Turquoise


}

if (!ozbuilderp.prototype.addEventListener) {
    ozbuilderp.prototype.addEventListener = function (e, f) {
        if (e == "activitydoubleclicked") {
           // matchEvt = "ObjectDoubleClicked";
           // this.myDiagram.addDiagramListener("ObjectDoubleClicked", f);
            this.activitydoubleclicked = f;
        } else if (e == "activitycreated") {
            this.activitycreated = f;
        } else if (e == "activitydeleted") {
            this.activitydeleted = f;
        } else if (e == "beforeactivitydelete") {
            this.beforeactivitydelete = f;
        } else if (e == "beforestatechange") {
            this.beforestatechange = f;
        }
    }
}
if (!ozbuilderp.prototype.dispose) {
    ozbuilderp.prototype.dispose = function () {
        this.RsrcCaptionColl = null;
        this.gEvtArgs = null;
        this.gWfResource = null;
        this.myContent = null;
        this.gProcWfProc = null;
        this.gProcActs = null;
        this.gProcLinks = null;
    }
}
//활성화 여부 설정
if (!ozbuilderp.prototype.getEnabled) {
    ozbuilderp.prototype.getEnabled = function () {
        return !$(this.mvarid).prop('disabled');
    }
}
if (!ozbuilderp.prototype.setEnabled) {
    ozbuilderp.prototype.setEnabled = function (val) {
        $(this.mvarid).prop('disabled', !val);
    }
}
//Visible 여부
if (!ozbuilderp.prototype.getVisible) {
    ozbuilderp.prototype.getVisible = function () {
        if ($(this.mvarid).prop('style').display == 'none') {
            return false;
        }
        else {
            return true;
        }
    }
}
if (!ozbuilderp.prototype.setVisible) {
    ozbuilderp.prototype.setVisible = function (val) {
        if (val == true) {
            $(this.mvarid).prop('style').display = 'inline-block';
        }
        else {
            $(this.mvarid).prop('style').display = 'none';
        }
    }
}

//Puplic API===================
if (!ozbuilderp.prototype.GetData) {
    ozbuilderp.prototype.GetData = function (sPurpose, sAddress, sContent) {
        sPurpose = sPurpose.toLowerCase();
        sContent = sContent.toLowerCase();
        switch (sPurpose) {
            case "eventargs":
                sAddItems = "COMPLETE;STOP;SUSPEND";
                switch (sContent) {
                    case "activityname":
                        return this.gEvtArgs.Extra ;
                    //BeforeStateChange
                    case "currentstatus":
                        return this.gEvtArgs.Content ;
                    case "tobestatus":
                        return this.gEvtArgs.Address ;
                    //DoubleClicked
                    case "frameaddress":
                        return this.gEvtArgs.Address ;
                    case "args":
                        return this.gEvtArgs.Content ;
                    case "fromresourcename":
                        if (this.myCurNode == null) {
                            return "";
                        } else {
                            return this.GetInfoFromAct(this.myCurNode.data, "resourcename"); //GetFromActRsrcNames
                        }
                    case "toresourcename":
                        if (this.myCurNode == null) {
                            return "";
                        } else {
                            return this.GetInfoToAct(this.myCurNode.data, "resourcename");   //GetToActRsrcNames
                        }
                    case "from_activityname": 
                        if (this.myCurNode == null) {
                            return "";
                        } else {
                            return this.GetInfoFromAct(this.myCurNode.data, "activityname"); //getPreActs
                        }
                    case "to_activityname":
                        if (this.myCurNode == null) {
                            return "";
                        } else {
                            return this.GetInfoToAct(this.myCurNode.data, "activityname");   //getPostActs
                        }
                    //Deleted Created
                    case "resourcename":
                        return this.gEvtArgs.Purpose ;
                    case "fromactivityname":
                        return this.gEvtArgs.Address ;
                    case "toactivityname":
                        return this.gEvtArgs.Content ;
                }
                break;
            case "info":
                var pWfAct = null;
                if (sAddress.trim().length == 0) {
                    if (ozw_IsNull(this.myCurNode) == false) pWfAct = this.myCurNode.data;                    
                } else {
                    pWfAct = this.gProcActs.Item(sAddress.trim());
                }
                if (ozw_IsNull(pWfAct) == true) return "";
                switch (sContent) {
                    case "resourcename":
                        return pWfAct.ActName;
                    case "activityname":
                        return pWfAct.key;
                    case "caption":
                        return pWfAct.caption;
                    case "caption":
                        return pWfAct.description;
                    case "fromresourcename":
                        return this.GetInfoFromAct(pWfAct, "resourcename");
                    case "toresourcename":
                        return this.GetInfoToAct(pWfAct, "resourcename");
                    case "from_activityname":
                        return this.GetInfoFromAct(pWfAct, "activityname");
                    case "to_activityname":
                        return this.GetInfoToAct(pWfAct, "activityname");
                }
                break;
            default:
        }

    }
}

if (!ozbuilderp.prototype.SetData) {
    ozbuilderp.prototype.SetData = function (sPurpose, sAddress, sContent) {
        sPurpose = sPurpose.toLowerCase();
        switch (sPurpose) {
            case "dialogresult":
                if (ozw_IsNull(this.myCurNode) == true) return "";
                var pSelWfAct = this.myCurNode.data;
                if (ozw_IsNull(pSelWfAct) == true) return "";
                if (ozw_IsVacant(sContent) == true) return "";
                var xDoc = ozw_GetParsedXDoc(sContent); //"List/FormLetterInfo/Varinfo/Var"
                if (oza_IsParseError(xDoc)) return "";                

                this.myDiagram.startTransaction("dialogresult");
                var xRoot = xDoc.documentElement.childNodes[0].childNodes[0];
                var xVars = xRoot.getElementsByTagName("Var"); //<Var sourcename="CAMP_ID" sourceozid=""><value>E1000001758</value><code /></Var >
                var xVar, pWfDF, sKey;
                var sAppNameDef = ozw_GetCollItemValue(pSelWfAct.Attrs, "app_name_def");
                var sAppDescDef = ozw_GetCollItemValue(pSelWfAct.Attrs, "app_desc_def");
                var sItemAdd = ozw_GetCollItemValue(pSelWfAct.Attrs, "item_addition");
                for (var iVar = 0; iVar < xVars.length; iVar++) {
                    xVar = xVars[iVar];
                    sKey = ozw_GetAttrValue(xVar, "sourcename", "");
                    if (pSelWfAct.DataFields.containsKey(sKey)) {
                        pWfDF = pSelWfAct.DataFields.Item(sKey);
                        pWfDF.value = ozf_getInnerHTML(xVar.childNodes[0]); //xVar.childNodes[0].innerText;
                        if (pWfDF.name == sAppNameDef) {
                            if (pWfDF.value.trim().length > 0) pSelWfAct.ChangeCaption(pWfDF.value);
                        }
                        if (pSelWfAct.acttype == enumProc) {
                            //if (bUpdate == true) this.myDiagram.model.setDataProperty(pWfAct, "description", sV);
                            if (pWfDF.name == sAppDescDef) pSelWfAct.ChangeDesc(pWfDF.value);
                            if (pWfDF.name == sItemAdd) pSelWfAct.Extra = pWfDF.value;
                        }
                    }
                }
                this.myCurNode.updateTargetBindings();
                this.myDiagram.commitTransaction("dialogresult");
                break;
            case "update":
                var bDoAutoSave = false, bIgnoreSave = false;
                //pSelWfAct AutoSave 필요??
                if (ozw_IsNull(this.myCurNode) == false) {
                    var pSelWfAct = this.myCurNode.data;
                    if (pSelWfAct.acttype == enumProc) bDoAutoSave = (ozw_GetCollItemValue(pSelWfAct.Attrs, "save_level") == "1");
                    if (sContent == "") {
                        if (bDoAutoSave) this.doSave();
                        return "";
                    }
                }
                var xDoc = ozw_GetParsedXDoc(sContent);
                if (oza_IsParseError(xDoc)) return "";
                this.myDiagram.startTransaction("setdata_update");
                var xUpdates = xDoc.documentElement.getElementsByTagName("UpdateNode");
                var xUpdate, pWfAct, i;
                var xNods, xNod, pWfAct, xAttrs, xAttr, pWfAttr;
                for (var iUpdate = 0; iUpdate < xUpdates.length; iUpdate++) {
                    xUpdate = xUpdates[iUpdate];
                    pWfAct = this.gProcActs.Item(ozw_GetAttrValue(xUpdate, "fromactivity", ""));
                    if (pWfAct === null) {
                        //alert("Unknown Activity in SetData_update");
                        //return "";
                        continue;
                    }
                    if (bDoAutoSave == false) {
                        if (pWfAct.acttype == enumProc) bDoAutoSave = (ozw_GetCollItemValue(pWfAct.Attrs, "save_level") == "1");
                    }
                    if (bIgnoreSave == false) {
                        if (ozw_GetAttrValue(xUpdate,"autosave","false").toLowerCase() == "false") bIgnoreSave = true;
                    }
                    var sOpt = ozw_GetAttrValue(xUpdate, "option", "");
                    switch (sOpt) {
                        case "delete":
                            switch (ozw_GetAttrValue(xUpdate, "part", "")) {
                                case "descendant":
                                    this.recDelActsLinkedFrom(pWfAct, true);
                                    this.myDiagram.updateAllTargetBindings();
                                    //this.myDiagram.commitTransaction("setdata_update");
                                    break;
                                case "children":
                                    this.recDelActsLinkedFrom(pWfAct, false);
                                    this.myDiagram.updateAllTargetBindings();
                                    //this.myDiagram.commitTransaction("setdata_update");
                                    break;
                                case "self":
                                    this.doDeleteNode(this.myDiagram.findNodeForData(pWfAct));
                                    //this.myDiagram.model.removeNodeData(pWfAct);
                                    //this.myDiagram.gProcActs.RemoveKey(pWfAct.key);
                                    break;
                            }
                            break;
                        case "add":
                            xNods = xUpdate.getElementsByTagName("Activities");
                            if (xNods.length > 0) {
                                xNod = xNods[0];
                                //위치조정?
                                //var sFrom = ozw_GetAttrValue(xNod, "fromactivity", "");
                                //pWfAct = this.gProcActs.Item(sFrom);
                                if (this.createActivities(xNod, true, true) == false) break;
                            }
                            //
                            xNods = xUpdate.getElementsByTagName("Transitions");
                            if (xNods.length > 0) {
                                xNod = xNods[0];
                                if (this.createTransitions(xNod, true) == false) break;
                            }
                            //activityData
                            xNods = xUpdate.getElementsByTagName("DataFields");
                            if (xNods.length > 0) {
                                xNods = xNods[0].getElementsByTagName("ActivityData");
                                if (xNods.length > 0) {
                                    this.applyActData(xNods[0], true);
                                }
                            }
                            //TM call
                            xNods = xUpdate.getElementsByTagName("Activities");
                            if (xNods.length > 0) {
                                xNods = xNods[0];
                                for (i = 0; i < xNods.childNodes.length; i++) {
                                    xNod = xNods.childNodes[i];
                                    if (xNod.nodeType !== 1) continue;
                                    sKey = ozw_GetAttrValue(xNod, "name", "");
                                    pWfAct = this.gProcActs.Item(sKey);
                                    if (pWfAct != null) {
                                        if (pWfAct.acttype == enumProc) {
                                            this.callTM_NewDel(pWfAct, false);
                                            //#Event_ActivityCreated 
                                            this.gEvtArgs.Purpose = pWfAct.ActName;
                                            this.gEvtArgs.Address = this.GetInfoFromAct(pWfAct, "activityname"); //getPreActs(pWfAct);
                                            this.gEvtArgs.Content = this.GetInfoToAct(pWfAct, "activityname"); //getPostActs(pWfAct);
                                            this.gEvtArgs.Extra = pWfAct.key;                                                                                       
                                            //반복 실행시 async처리가 제대로 되는지, 빠지는 것은 없는지 확인요!!!
                                            if (typeof this.activitycreated === "function") {
                                                setTimeout(this.activitycreated(), 1);
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        case "update":
                            xNods = xUpdate.getElementsByTagName("Activities");                            
                            if (xNods.length > 0) {
                                xNods = xNods[0];
                                //updateActivities
                                for (i = 0; i < xNods.childNodes.length; i++) {
                                    xNod = xNods.childNodes[i];
                                    pWfAct = this.gProcActs.Item(ozw_GetAttrValue(xNod, "name", ""));
                                    if (pWfAct === null) continue;
                                    xAttrs = xNod.getElementsByTagName("Attr");
                                    for (var j = 0; j < xAttrs.length; j++) {
                                        xAttr = xAttrs[j];
                                        sKey = ozw_GetAttrValue(xAttr, "name", "");
                                        sV = ozw_GetWfInitValue(xAttr);
                                        pWfAttr = pWfAct.Attrs.Item(sKey);
                                        if (pWfAttr != null) pWfAttr.value = sV;
                                        //UI Related Property
                                        //if (sKey == "app_name_def") {
                                        //    pWfAct.app_name_def = sV;
                                        //}
                                        if (pWfAct.acttype == enumProc) {
                                            //if (sKey == "app_desc_def") {
                                            //    pWfAct.app_desc_def = sV;
                                            //}
                                            if (sKey == "design_finish") {
                                                pWfAct.design_finish = (sV.toLowerCase() === "false" ? false : true);
                                                if ((this.RunAsMonitor === false) && (pWfAct.design_finish === true)) {
                                                    pWfAct.finishVisible = 1;
                                                } else {
                                                    pWfAct.finishVisible = 0;
                                                }
                                                var pGoNod = this.myDiagram.findNodeForData(pWfAct);
                                                if (pGoNod !== null) pGoNod.updateTargetBindings();
                                            }
                                            //if (sKey == "item_addition") {
                                            //    pWfAct.item_addition = sV;
                                            //}
                                        }
                                    }

                                }
                            }

                            //activityData
                            xNods = xUpdate.getElementsByTagName("DataFields");
                            if (xNods.length > 0) {
                                xNods = xNods[0].getElementsByTagName("ActivityData");
                                if (xNods.length > 0) {
                                    this.applyActData(xNods[0], true);
                                }
                            }
                            break;
                    }
                }
                //this.myDiagram.layout.invalidateLayout(); 
                this.myDiagram.updateAllTargetBindings();
                this.myDiagram.rebuildParts();
                this.myDiagram.commitTransaction("setdata_update");
                break;
            default:
                return "";
        }
    }
}

if (!ozbuilderp.prototype.recDelActsLinkedFrom) {
    ozbuilderp.prototype.recDelActsLinkedFrom = function (pWfActSrc, bDoRecursive) {
        if (typeof (bDoRecursive) === "undefined") {
            bDoRecursive = true;
        }
        var pNod = this.myDiagram.findNodeForData(pWfActSrc);
        var outLinks = pNod.findLinksOutOf();
        if (outLinks.count == 0) return;
        var pLnk, pTNode, pWfActTgt;
        var it = outLinks.iterator;
        while (it.next()) {
            pLnk = it.value;
            pWfActTgt = pLnk.toNode.data;
            pWfActSrc.toActs.Add(pWfActTgt.key, pWfActTgt);
            //이 방식은 중간에 링크가 삭제되므로 it iterator와 충돌
            //if (bDoRecursive) this.recDelActsLinkedFrom(pWfActTgt, true);
            ////pTNode = this.myDiagram.findNodeForData(pWfActTgt);
            //this.doDeleteNode(this.myDiagram.findNodeForData(pWfActTgt));
            ////this.myDiagram.model.removeNodeData(pWfActTgt);
            ////this.myDiagram.gProcActs.RemoveKey(pWfActTgt.key);
        }
        for (var i = 0; i < pWfActSrc.toActs.Count; i++) {
            pWfActTgt = pWfActSrc.toActs.ItemByIndex(i);
            if (bDoRecursive) this.recDelActsLinkedFrom(pWfActTgt, true);            
            this.doDeleteNode(this.myDiagram.findNodeForData(pWfActTgt));
        }
        pWfActSrc.toActs.Clear();
    }
}
if (!ozbuilderp.prototype.clearData) {
    ozbuilderp.prototype.clearData = function () {
        this.gProcWfProc = new OZwfProcess();
        this.gProcActs = new ClsCollJ();
        this.gProcLinks = new ClsCollJ();
    }
}
if (!ozbuilderp.prototype.doReadResource) {
    ozbuilderp.prototype.doReadResource = function (sResourcePathAddress) {
        if (ozw_IsVacant(this.ResourceID) == true) return false;
        var oWfR = new OZwfResource();
        var bResult = oWfR.ReadContent(sResourcePathAddress);
        if (bResult == true) this.IsResourceFilled = true;
        this.gWfResource = oWfR;
        return bResult;
    }
}

if (!ozbuilderp.prototype.InitDraw) {
    ozbuilderp.prototype.InitDraw = function (sDefContent) {
        this.clearData();
        // Resource
        if (this.IsResourceFilled == false) {
            if (this.doReadResource(this.ResourceID) == false) return false;
        }
        this.gProcWfProc = this.gWfResource.WfProc.Clone();       
        if (this.showContent(sDefContent, true) == true) {
            //drawGoDiagram()
            //this.myDiagram.model = new go.GraphLinksModel(this.myArrNodeData, this.myArrLinkData);
            //this.myDiagram.rebuildParts(); //model = new go.GraphLinksModel(this.gProcActs.Values, this.gProcLinks.Values);
            return true;
        } else {
            return false;
        }
    }
}
if (!ozbuilderp.prototype.Init) {
    ozbuilderp.prototype.Init = function () {
        this.ctl = $(this.mvarid);
        //ResourceID MProcessesID MProcessID MProcessName 
        //UsingResourceNameList ResourceCustomCaptionList
        //MPAppID IPAppID
        //HideStatusActions
        //Init
        //SetProcessDataFIeldValue
        if (this.bInitCalled === false) {
            this.bInitCalled = true;
            this.makeDiagram(this.myDiagram, this.RunAsMonitor);
            if (this.RunAsMonitor == false) {
                //DesignMode Background Grid
                //this.myDiagram.gridCellSize = new go.Size(10, 10);
                //this.myDiagram.grid.visible = true;
                this.myDiagram.grid =
                    $go(go.Panel, go.Panel.Grid,
                    {
                        visible: true,
                        gridCellSize: new go.Size(10, 10),
                        gridOrigin: new go.Point(0, 0)
                    },
                    $go(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
                    $go(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
                    $go(go.Shape, "LineH", { stroke: "lightgray", interval: 5, strokeWidth: 0.5 }),
                    $go(go.Shape, "LineV", { stroke: "lightgray", interval: 5, strokeWidth: 0.5 })
                );
                this.myDiagram.toolManager.draggingTool.isGridSnapEnabled = true;
                this.myDiagram.toolManager.linkingTool.direction = go.LinkingTool.ForwardsOnly;
                //this.myDiagram.toolManager.relinkingTool.fromHandleArchetype =
                //    $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" });
                //this.myDiagram.toolManager.relinkingTool.toHandleArchetype =
                //    $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" });


            }
            //GoDiagram Event
            this.myDiagram.addDiagramListener("ObjectDoubleClicked", function (e) {
                //ShowActWindow
                if (e.subject.part instanceof go.Node) {
                    var refBuilder = getCtl(getRefBuilderID()); //MyBuilder; // Assumption: OnlyOne Builder refered as MyBuilder[var]
                    var pNod = e.subject.part;
                    refBuilder.myCurNode = e.subject.part;
                    var pWfAct = e.subject.part.data;
                    refBuilder.gEvtArgs.Purpose = "OpenDialog";
                    var sFrame = "";
                    if (refBuilder.RunAsMonitor == true) {
                        sFrame = pWfAct.result_page;
                        if (ozw_IsNull(pWfAct.ExecInfo) == true) return;

                        if (pWfAct.ExecInfo.HasError) sFrame = pWfAct.error_page;
                    } else {
                        sFrame = pWfAct.design_page;
                    }

                    if (sFrame.length == 0) return;
                    if (pWfAct.acttype == enumProc) {
                        var inLinks = pNod.findLinksInto();
                        if (inLinks.count == 0) return;
                        var bCheck, pLnk, pWfLnk, pFNode, pFwfAct;
                        bCheck = true;
                        var it = inLinks.iterator;
                        while (it.next()) {
                            pLnk = it.value;
                            pFwfAct = pLnk.fromNode.data;
                            if ((pFwfAct.acttype == enumProc) || (pFwfAct.acttype == enumRoute)) {
                                if (pFwfAct.design_finish === false) {
                                    bCheck = false;
                                    break;
                                }
                            }
                        }
                        if (bCheck == false) return;
                    }
                    //
                    var dxml = ""; //sDataXML
                    dxml = dxml.concat("<List><FormLetterInfo><Varinfo>");
                    var pWfDF;
                    for (i = 0; i < refBuilder.gProcWfProc.DataFields.Count; i++) {
                        pWfDF = refBuilder.gProcWfProc.DataFields.ItemByIndex(i);
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format(pWfDF.name, pWfDF.value));
                    }
                    if (refBuilder.RunAsMonitor == true) {
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("mpid", refBuilder.gProcWfProc.ExecInfo.M_ID));
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("ipid", refBuilder.gProcWfProc.ExecInfo.I_ID));
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("status", refBuilder.gProcWfProc.ExecInfo.Status));
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("error", refBuilder.gProcWfProc.ExecInfo.HasError));
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("OBZ_ERROR_DESC", refBuilder.gProcWfProc.ExecInfo.ErrorDesc));
                    }
                    if (pWfAct.acttype == enumProc) {
                        var sFromAppIDsVar = ozw_GetCollItemValue(pWfAct.Attrs, "from_app_id_def");
                        var bCopyIfSame = !(ozw_IsVacant(sFromAppIDsVar));
                        for (i = 0; i < pWfAct.DataFields.Count; i++) {
                            pWfDF = pWfAct.DataFields.ItemByIndex(i);
                            if (bCopyIfSame) {
                                if (pWfDF.name == sFromAppIDsVar) pWfDF.value = refBuilder.GetFromAppIDValueList(pWfAct);
                            }
                            dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format(pWfDF.name, pWfDF.value));
                        }
                    }
                    if (refBuilder.RunAsMonitor == true) {
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("mpid", pWfAct.ExecInfo.M_ID));
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("ipid", pWfAct.ExecInfo.I_ID));
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("status", pWfAct.ExecInfo.Status));
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("error", pWfAct.ExecInfo.HasError));
                        dxml = dxml.concat("<Var sourcename='{0}' sourceozid='' ><value>{1}</value></Var>".format("OBZ_ERROR_DESC", pWfAct.ExecInfo.ErrorDesc));
                    }
                    dxml = dxml.concat("</Varinfo></FormLetterInfo></List>");
                    //for (i = 0; i < this.gProcWfProc.Attrs.Count(); i++) {
                    //Web에서는 Frame이름으로??
                    //refBuilder.gEvtArgs.Address = "<List><Item address='" + sFrame + "/FrameExec' region='manage'/></List>";
                    refBuilder.gEvtArgs.Address = "<List><Item address='" + sFrame + "/FrameExec' region='manage'/></List>"; // sFrame;
                    refBuilder.gEvtArgs.Content = dxml;
                    refBuilder.gEvtArgs.Extra = pWfAct.key; //Selected Node Name
                    //if (refBuilder.onactivitydoubleclicked != null) refBuilder.onactivitydoubleclicked();
                    if (typeof refBuilder.activitydoubleclicked === "function") {
                        setTimeout(refBuilder.activitydoubleclicked, 1);
                    }

                }
                else {
                    return;
                }
            });
            this.myDiagram.addModelChangedListener(function (e) {
                //사용자가 직접 링크를 삭제한경우
                //if (e.change === go.ChangedEvent.Remove) {
                // 메뉴로 삭제한 경우 doDeleteLink에서 호출된 것이므로 gProcLinks의 Key처리도 그곳에서.
                //} 
                //사용자가 직접 링크를 추가한경우
                if (e.change === go.ChangedEvent.Insert) {
                    if (e.propertyName === "linkDataArray") {
                        var refBuilder = getCtl(getRefBuilderID());
                        if (refBuilder.myStatus === true) {
                            refBuilder.myStatus = false;
                            return;
                        }

                        var pWfLnkEvt = e.newValue;
                        var refObj = refBuilder.myDiagram.findLinkForData(pWfLnkEvt);
                        var pWfActF = refObj.fromNode.data;
                        var pWfActT = refObj.toNode.data;
                        var pWfLnk = refBuilder.tryLink(pWfActF, pWfActT);
                        if (pWfLnk != null) {
                            pWfLnkEvt.key = pWfLnk.key;
                            pWfLnkEvt.caption = pWfLnk.caption;
                            pWfLnkEvt.colorH = pWfLnk.colorH;
                            pWfLnkEvt.condition = pWfLnk.condition;
                            pWfLnkEvt.fromPort = pWfLnk.fromPort;
                            pWfLnkEvt.toPort = pWfLnk.toPort;
                            refBuilder.gProcLinks.AddKey(pWfLnkEvt.key);
                            refBuilder.myDiagram.rebuildParts();
                            //refObj.data = pWfLnk;
                            //refBuilder.myArrLinkData.push(pWfLnk);
                        } else {
                            //refBuilder.myDiagram.commandHandler.undo();
                            if (e.canUndo() == true) { e.undo(); }
                            //refBuilder.myDiagram.rollbackTransaction()
                            refBuilder.myDiagram.model.removeLinkData(pWfLnkEvt);
                            refBuilder.myDiagram.rebuildParts();
                            refBuilder.myDiagram.currentTool.stopTool();
                        }
                        //refBuilder.doDeleteLink(refBuilder.myDiagram.findLinkForData(e.newValue));
                        return;
                    }
                }
                //if (e.change === go.ChangedEvent.Transaction) {
                //    if (e.propertyName === "CommittingTransaction" || e.modelChange === "SourceChanged") return;
                //    // do not display any layout transactions
                //    if (e.oldValue === "Layout") return;
                //}  // You will probably want to use e.isTransactionFinished instead

                //// Add entries into the log
                //var changes = e.toString()
                //console.log(changes);
            });
        
            // Init Property Related
            if (this.ResourceCustomCaptionList.endsWith(";"))
                this.ResourceCustomCaptionList = this.ResourceCustomCaptionList.substr(0, this.ResourceCustomCaptionList.length - 1);                    
            if (this.ResourceCustomCaptionList.length > 0) {
                this.RsrcCaptionColl.Clear();
                var pArr = this.ResourceCustomCaptionList.split(";");
                for (var i = 0; i < pArr.length; i = i + 2) {
                    this.RsrcCaptionColl.Add(pArr[i], pArr[i + 1]);
                }           
            }
        } else {
            //this.myDiagram.Model.clear();
        }

        // Initalize Data Model==============================
        this.clearData();
        // Resource
        if (this.IsResourceFilled == false) {
            //this.gWfResource = ozw_GetResourceInfo(this.ResourceID);
            //this.IsResourceFilled = true;
            if (this.doReadResource(this.ResourceID) == false) return false;
        }

        if (ozw_IsVacant(this.MProcessesID) == true) return;
        //this.MProcessesOZID = ozw_transPath2OZID(this.MProcessesID);
        if (ozw_IsVacant(this.MProcessesOZID) == true) {
            //MProcesses Content의 ozid 확인
            var mh0 = new oza_MetaHandler("Content", "<List><Item address='{0}'/></List>".format(this.MProcessesID),
                                                     "<List><Info option='nochild'/></List>");
            if (mh0.execute(null, false) === false) {
                console.log("Error>> MProcesses Content check Failed!!");
                return;
            }
            //List/ExtraContent/Data/List
            var xDoc0 = ozw_GetParsedXDoc(mh0.returncontent);
            var xElm0 = xDoc0.getElementsByTagName("List")[0].getElementsByTagName("GeneralMProcesses")[0];
            this.MProcessesOZID = ozw_GetAttrValue(xElm0, "ozid", "");
        }
        // Read Process Content
        if (ozw_IsVacant(this.MProcessID) == true) {
            this.gProcWfProc = this.gWfResource.WfProc.Clone();
        }
        else {
            var mh = new oza_MetaHandler("ExtraContent", "<List><Item address=''/></List>",
                "<List><ExtraContent option='all' part='all' eozid='{0}' ozid='{1}'/></List>".format(this.MProcessID, this.MProcessesOZID));
            if (mh.execute(null, false) === false) {
                console.log("Error>> Process_Read Failed!!");
                return;
            }
            this.myContent = mh.returncontent; //List/ExtraContent/Data/List
            var xDoc = ozw_GetParsedXDoc(this.myContent);
            var xElm = xDoc.getElementsByTagName("List")[0].getElementsByTagName("ExtraContent")[0];
            this.MProcessName = ozw_GetAttrValue(xElm, "name", "");
            this.MProcessesOZID = ozw_GetAttrValue(xElm, "ozid", "");
            this.MProcessID = ozw_GetAttrValue(xElm, "eozid", "");

            var sCon = xElm.getElementsByTagName("Data")[0].innerHTML;
            this.showContent(sCon, false);
        }

        //drawGoDiagram();
        //Model and Data
        //this.myDiagram.model = new go.GraphLinksModel(this.myArrNodeData, this.myArrLinkData);
        this.myDiagram.model = new go.GraphLinksModel(this.gProcActs.Values, this.gProcLinks.Values);
        //this.myDiagram.model.addChangedListener(function (e) {
        //}); // end model changed listener

        var bReturn = true;
        if (this.RunAsMonitor == true) {
            bReturn = this.RefreshStatus(); //showExecInfo
            //actDel.style.visible = false;
            this.myDiagram.isReadOnly = true;
        } else {
            //actDel.style.visible = true;
            this.myDiagram.isReadOnly = false;
        }



        //contextmenu
        var sIDofCM = this.sCMDivID;

        //if ((typeof sIDofCM !== "undefined") && (sIDofCM !== null)) {
        if (ozw_IsNull(this.myCMDiv) == false) {
            // Override the ContextMenuTool.showContextMenu and hideContextMenu methods
            // in order to modify the HTML appropriately.
            var cxTool = this.myDiagram.toolManager.contextMenuTool;
            // This is the override of ContextMenuTool.showContextMenu:
            // This does not not need to call the base method.
            cxTool.showContextMenu = function (contextmenu, obj) {
                var diagram = this.diagram; // this ==> cxTool. not MyBuilder[ozbuilderp]
                if (diagram === null) { this.stopTool(); return; }
                var refBuilder = getCtl(getRefBuilderID());  // Assumption: OnlyOne Builder refered as MyBuilder[var] that is defined in html.
                //if (obj === null) return; //바탕화면에서는 띄우지 않도록
                //var lbl = obj.findObject("CapLabel"); //test
                if (refBuilder.Editable == false) { this.stopTool(); return; }
                // Hide any other existing context menu
                if (contextmenu !== this.currentContextMenu) {
                    this.hideContextMenu();
                }
                // Clear
                //var ulCM = document.getElementById("CMList1");
                for (var i = refBuilder.myCMUL.childNodes.length - 1; i >= 0; i--) {
                    refBuilder.myCMUL.removeChild(refBuilder.myCMUL.childNodes[i]);
                }

                //
                var iMCount = 0;
                var pWfAct, pWfLnk;
                if (obj.part instanceof go.Node) {
                    refBuilder.myCurNode = obj;
                    refBuilder.myCurLink = null;
                    pWfAct = obj.data;
                } else {
                    refBuilder.myCurLink = obj;
                    refBuilder.myCurNode = null;
                    pWfLnk = obj.data;
                }

                //
                var iMenuCount, sHTML = "";
                if (refBuilder.RunAsMonitor) {
                    pWfAct = obj.data;
                    if (pWfAct.HasExecInfo == false) {
                        this.stopTool(); //안해주면 이후 마우스 반응 안함
                        return;
                    }
                    //ContextMenu Candidate : 1.By State
                    var state = pWfAct.ExecInfo.Status.toUpperCase();
                    var sAddItems = "";
                    switch (state) {
                        case "AFTER_START":
                            sAddItems = "COMPLETE;STOP;SUSPEND";
                            break;
                        case "BEFORE_START":
                        case "READY":
                        case "NOTREADY":
                            sAddItems = "COMPLETE;START;STOP";
                            break;
                        case "CALL_START":
                            sAddItems = "COMPLETE;RESTART";
                            break;
                        case "START":
                        case "RESTART":
                            sAddItems = "COMPLETE;RESTART;STOP;SUSPEND";
                            break;
                        case "COMPLETE":
                        case "CALL_COMPLETE":
                            sAddItems = "RESTART;COMPLETE";
                            break;
                        default:
                    }
                    //2.Add custom definition
                    if (ozw_IsVacant(refBuilder.gCustomStatusAddList) == false) {
                        if (refBuilder.gCustomStatusAddList.containsKey(state)) {
                            var sTmp = refBuilder.gCustomStatusAddList.Item(state).toUpperCase();
                            var pArr = sTmp.split(";");
                            for (var i = 0; i < pArr.length; i++) {
                                if (sAddItems.indexOf(pArr[i] + ";") == -1) {
                                    sAddItems += ";" + pArr[i];
                                }
                            }
                            if (sAddItems.startsWith(";")) sAddItems = sAddItems.substr(1, sAddItems.length - 1);
                        }
                    }
                    //
                    var arrActAdd = [];
                    if (sAddItems.length > 0) { arrActAdd = sAddItems.split(";"); }
                    //3.Check HideAction
                    var collActHide = new ClsCollJ();
                    if (ozw_IsVacant(refBuilder.gHideActions) == false) {
                        var pArr = refBuilder.gHideActions.split(";");
                        for (var i = 0; i < pArr.length; i++) {
                            if (!collActHide.containsKey(pArr[i])) {
                                collActHide.Add(pArr[i], pArr[i]);
                            }
                        }
                    }
                    //4.Check custom hide list
                    if (ozw_IsVacant(refBuilder.gCustomStatusHideList) == false) {
                        if (refBuilder.gCustomStatusHideList.containsKey(state)) {
                            var sTmp = refBuilder.gCustomStatusHideList.Item(state).toUpperCase();
                            var pArr = sTmp.split(";");
                            for (var i = 0; i < pArr.length; i++) {
                                if (!collActHide.containsKey(pArr[i])) {
                                    collActHide.Add(pArr[i], pArr[i]);
                                }
                            }
                        }
                    }
                    //5.HandleStatusByID
                    //if ((typeof refBuilder.gCustomStatusAddListByID !== "undefined") && (refBuilder.gCustomStatusAddListByID !== null)) {

                    //}

                    //Create context menu items
                    var sID, sCap;
                    iMenuCount = 0;
                    for (var i = 0; i < arrActAdd.length; i++) {
                        sID = arrActAdd[i];
                        sCap = ozw_GetStatusCaption(sID);

                        if (collActHide.containsKey(sID)) continue;
                        sHTML += "<li><a href='#' id='" + sID + "' onclick='cxcommand(event)'>" + sCap + "</a></li>";
                        iMenuCount += 1;
                    }
                } else {
                    //DesignMode
                    var bNoDel = true;
                    iMenuCount = 0;
                    if (ozw_IsNull(pWfLnk) == false) {
                        var pTwfAct = refBuilder.myCurLink.toNode.data;
                        bNoDel = true;
                        if (pTwfAct.acttype != enumStart) {
                            bNoDel = (ozw_GetCollItemValue(pTwfAct.Attrs, "nodelete").toLowerCase() == "true");                            
                        }
                        if (bNoDel == false) {
                            //sHTML += "<li style='border-bottom: solid 1px gray; height:2px;'></li>";
                            sHTML += "<li><a href='#' id='" + "_delete" + "' onclick='cxcommand2(event)'>" + "삭제" + "</a></li>";
                            iMenuCount += 1;
                        }
                    }
                    if (ozw_IsNull(pWfAct) == false) {
                        if (pWfAct.acttype == enumProc) {
                            if (pWfAct.design_finish === true) {
	                            var pCollCands = new ClsCollJ();
	                            if (pWfAct.getConnectables(pCollCands) == true) {
	                                var sName, sCap, sGroup, sImg, pWfRsrcAct;
	                                for (var i = 0; i < pCollCands.Count; i++) {
	                                    sName = pCollCands.ItemByIndex(i);
	                                    if (ozw_IsVacant(refBuilder.UsingResourceNameList) == false) {
	                                        if (refBuilder.UsingResourceNameList.endsWith(";") == false) refBuilder.UsingResourceNameList += ";";
	                                        if (refBuilder.UsingResourceNameList.indexOf(sName + ";") == -1) {
	                                            continue;
	                                        }
	                                    }
	                                    sCap = refBuilder.RsrcCaptionColl.Item(sName);
                                        if (sCap == null) sCap = sName;
                                        sImg = "default"
                                        pWfRsrcAct = refBuilder.gWfResource.WfActList.Item(sName);
                                        if (pWfRsrcAct !== null)  sImg = pWfRsrcAct.imageid;
	                                    //Group은 일단 보류.
                                        sHTML += "<li><a href='#' id='" + sName + "' onclick='cxcommand2(event)'><span style='padding-right:3px'><img src='../img/wf/target/" + sImg.toLowerCase() + ".png' class='oz-wf-cm-p-img'/></span><span>" + sCap + " 추가" + "</span></a></li>";
	                                    iMenuCount += 1;
	                                }                                
                            	}
                            }
                        }
                        if (pWfAct.acttype != enumStart) {
                            bNoDel = (ozw_GetCollItemValue(pWfAct.Attrs, "nodelete").toLowerCase() == "true");
                            if (bNoDel == false) {
                                //sHTML += "<li style='border-bottom: solid 1px gray; height:2px;'></li>";
                                sHTML += "<li style='border-top: solid 1px gray;'><a href='#' id='" + "_delete" + "' onclick='cxcommand2(event)'>" + "삭제" + "</a></li>";
                                iMenuCount += 1;
                            }
                        }
                    }
                }
                
 

                if (iMenuCount == 0) {
                    this.stopTool(); //안해주면 이후 마우스 반응 안함
                    return;
                }

                //design
                //sHTML += "<li><a href='#' id='delete' onclick='cxcommand(this.textContent)'>Delete</a></li>";
                //iMCount += 1;
                //if (pWfAct.activitykind === "procedure") {
                //    sHTML += "<li><a href='#' id='cut' onclick='cxcommand(this.textContent)'>Cut</a></li>";
                //} else {
                //    sHTML += "<li><a href='#' id='copy' onclick='cxcommand(this.textContent)'>Copy</a></li>";
                //}
                var cxElement = document.getElementById(refBuilder.sCMDivID);
                var ulCM = cxElement.getElementsByTagName("ul")[0]; 
                ulCM.innerHTML = sHTML;
                // Show only the relevant buttons given the current state.
                //var cmd = diagram.commandHandler;
                //document.getElementById("cut").style.display = cmd.canCutSelection() ? "block" : "none";
                //document.getElementById("copy").style.display = cmd.canCopySelection() ? "block" : "none";
                //document.getElementById("paste").style.display = cmd.canPasteSelection() ? "block" : "none";
                //document.getElementById("delete").style.display = cmd.canDeleteSelection() ? "block" : "none";


                // Now show the whole context menu element
                cxElement.style.display = "block";
                // we don't bother overriding positionContextMenu, we just do it here:
                var mousePt = diagram.lastInput.viewPoint;
                cxElement.style.left = mousePt.x  + "px";
                cxElement.style.top = mousePt.y + "px"; //+ parseInt(document.getElementById(refBuilder.myID).style.top))
                // Remember that there is now a context menu showing
                this.currentContextMenu = contextmenu;
            }
            // This is the corresponding override of ContextMenuTool.hideContextMenu:
            // This does not not need to call the base method.
            cxTool.hideContextMenu = function () {
                if (this.currentContextMenu === null) return;
                var refBuilder = getCtl(getRefBuilderID());  
                document.getElementById(refBuilder.sCMDivID).style.display = "none";
                this.currentContextMenu = null;
            }

        }


        return bReturn;
    }
}

if (!ozbuilderp.prototype.CheckIn) {
    ozbuilderp.prototype.CheckIn = function () {
        if (this.validateContent() == false) return false;
        if (this.doSaveContent() == false) return false;
        if (this.callTM("save") == false) return false;
        if (this.callTM("checkin") == false) return false;
        return true;
    }
}

if (!ozbuilderp.prototype.validateContent) {
    ozbuilderp.prototype.validateContent = function () {
        if (this.checkCircular() == true) return false;
        var i, j, pNode, pWfAct, pWfDF, sAppIDVar;
        for (i = 0; i < this.gProcActs.Count; i++) {
            pWfAct = this.gProcActs.ItemByIndex(i);
            pNod = this.myDiagram.findNodeForData(pWfAct);
            if ((pWfAct.acttype == enumProc) || (pWfAct.acttype == enumProc)) {
                if ((pNod.findLinksInto().count === 0) || (pNod.findLinksOutOf().count === 0)) {
                    ozf_MsgBox("체크인할 수 없습니다. '{0}' 액티비티에 연결된 트랜지션이 없습니다. 모든 액티비티 항목은 1개 이상의 트랜지션으로 연결되어야 합니다.".format(pWfAct.caption), null);
                    return false;
                }
                if (pWfAct.design_finish === false) {
                    ozf_MsgBox("체크인할 수 없습니다. 항목 '{0}'의 설계가 완료되지 않았습니다.".format(pWfAct.caption), null);
                    return false;
                }
                sAppIDVar = ozw_GetCollItemValue(pWfAct.Attrs, "app_id_def");
                for (j = 0; j < pWfAct.DataFields.Count; j++) {
                    pWfDF = pWfAct.DataFields.ItemByIndex(j);
                    if (pWfDF.name == sAppIDVar) {
                        if (ozw_IsVacant(pWfDF.value)) {
                            ozf_MsgBox("체크인할 수 없습니다. 액티비티 '{0}'의 값이 설정되어야 합니다.".format(pWfAct.caption), null);
                            return false;
                        } else {
                            break;
                        }
                    }
                }
            } else {
                if (pNod.findLinksInto().count + pNod.findLinksOutOf().count === 0) {
                    ozf_MsgBox("체크인할 수 없습니다. '{0}' 액티비티에 연결된 트랜지션이 없습니다. 모든 액티비티 항목은 1개 이상의 트랜지션으로 연결되어야 합니다.".format(pWfAct.caption), null);
                    return false;
                }
            }
        }
        return true;
    }
}

if (!ozbuilderp.prototype.Save) {
    ozbuilderp.prototype.Save = function () {
        if (this.checkCircular() == true) return false;
        if (this.doSaveContent() == false) return false;
        if (this.callTM("save") == false) return false;
        return true;
    }
}
if (!ozbuilderp.prototype.checkCircular) {
    ozbuilderp.prototype.checkCircular = function () {
        var pCollPP, pWfAct, pWfActTgt, pWfLnk, sErr;
        //var it, pLnk, pTNode, pNod, outLinks;
        pCollPP = new ClsCollJ();
        for (var i = 0; i < this.gProcActs.Count; i++) {
            pWfAct = this.gProcActs.ItemByIndex(i);
            pCollPP.Add(pWfAct.key, pWfAct.key);
            //pWfAct의 outLinks 찾기
            for (var j = 0; j < this.gProcLinks.Count; j++) {
                pWfLnk = this.gProcLinks.ItemByIndex(j);
                if (pWfLnk.from == pWfAct.key) {
                    pWfActTgt = this.gProcActs.Item(pWfLnk.to);
                    sErr = "";
                    if (this.hasSameAct(pWfActTgt, pCollPP, sErr) == true) {
                        ozf_MsgBox("순환 구조를 가진 액티비티-'{0}'-가 있습니다.".format(sErr), null);
                        pCollPP.Clear();
                        return true;
                    }
                }
            }
            pCollPP.Clear();
            //pNod = this.myDiagram.findNodeForData(pWfAct);
            //outLinks = pNod.findLinksOutOf();
            //if (outLinks.count == 0) continue;
            //it = outLinks.iterator;
            //while (it.next()) {
            //    pLnk = it.value;
            //    pWfActTgt = pLnk.toNode.data;
            //    sErr = "";
            //    if (this.hasSameAct(pWfActTgt, pCollPP, sErr) == true) {
            //        ozf_MsgBox("순환 구조를 가진 액티비티-'{0}'-가 있습니다.".format(sErr), null);
            //        pCollPP.Clear();
            //        return true;
            //    }
            //}
        }
        return false;
    }
}
if (!ozbuilderp.prototype.hasSameAct) {
    ozbuilderp.prototype.hasSameAct = function (refWfAct, refCollPP, sErr) {
        if (refCollPP.containsKey(refWfAct.key)) {
            sErr = refWfAct.caption;
            return true;
        }
        var pWfLnk, pWfActTgt, bFirstFound = true;
        for (var j = 0; j < this.gProcLinks.Count; j++) {
            pWfLnk = this.gProcLinks.ItemByIndex(j);
            if (pWfLnk.from == refWfAct.key) {
                if (bFirstFound === true) {
                    bFirstFound = false;
                    refCollPP.Add(refWfAct.key, refWfAct.key);
                }
                pWfActTgt = this.gProcActs.Item(pWfLnk.to);
                sErr = "";
                if (this.hasSameAct(pWfActTgt, refCollPP, sErr) == true) {
                    return true;
                }
            }
        }

        //var pNod = this.myDiagram.findNodeForData(refWfAct);
        //var outLinks = pNod.findLinksOutOf();
        //if (outLinks.count == 0) return false;
        //refCollPP.Add(refWfAct.key, refWfAct.key);
        //var it, pLnk, pWfActTgt;
        //it = outLinks.iterator;
        //while (it.next()) {
        //    pLnk = it.value;
        //    //pWfActTgt = pLnk.toNode.data;
        //    sErr = "";
        //    if (this.hasSameAct(pLnk.toNode.data, refCollPP, sErr) == true) {
        //        return true;
        //    }
        //}
        return false;
    }
}

if (!ozbuilderp.prototype.doSaveContent) {
    ozbuilderp.prototype.doSaveContent = function () {
        //save meta
        var i, j, con = "";
        var pWfAttr, pWfAct, pWfLnk, pWfDF;

        con = con.concat("<List>");
        con = con.concat("<Process name='{0}' resourceid='{1}' resourcename='{2}'>".format(this.MProcessName, this.gWfResource.OZID, this.gWfResource.Name));
        con = con.concat("<ProcessInfo name='{0}' description='{1}' resourcename='{2}'>".format(this.MProcessName, this.gProcWfProc.Description, this.gWfResource.Name));
        for (i = 0; i < this.gProcWfProc.Attrs.Count; i++) {
            pWfAttr = this.gProcWfProc.Attrs.ItemByIndex(i);
            con = con.concat("<Attr name='{0}' caption='{1}' valuetype='{2}'>".format(pWfAttr.name, pWfAttr.caption, pWfAttr.valuetype));
            con = con.concat("<InitValue><![CDATA[{0}]]></InitValue>".format(pWfAttr.value));
            con = con.concat("</Attr>");
        }
        con = con.concat("</ProcessInfo>");
        con = con.concat("<Activities>");
        for (i = 0; i < this.gProcActs.Count; i++) {
            pWfAct = this.gProcActs.ItemByIndex(i);
            con = con.concat("<Activity activitykind='{0}' name='{1}' description='{2}' imageid='{3}' resourcename='{4}' >".format(pWfAct.activitykind, pWfAct.key, pWfAct.description, pWfAct.imageid, pWfAct.ActName));
            for (j = 0; j < pWfAct.Attrs.Count; j++) {
                pWfAttr = pWfAct.Attrs.ItemByIndex(j);
                if (pWfAttr.name.toLowerCase() == "imageid") continue;
                con = con.concat("<Attr name='{0}' caption='{1}' valuetype='{2}'>".format(pWfAttr.name, pWfAttr.caption, pWfAttr.valuetype));
                con = con.concat("<InitValue><![CDATA[{0}]]></InitValue>".format(pWfAttr.value));
                con = con.concat("</Attr>");
            }
            con = con.concat("</Activity>");
        }
        con = con.concat("</Activities>");
        con = con.concat("<Transitions>");
        for (i = 0; i < this.gProcLinks.Count; i++) {
            pWfLnk = this.gProcLinks.ItemByIndex(i);
            con = con.concat("<Transition name='{0}' source='{1}' target='{2}'>".format(pWfLnk.key, pWfLnk.from, pWfLnk.to));
            con = con.concat("<Caption><![CDATA[{0}]]></Caption>".format(pWfLnk.caption));
            con = con.concat("<Condition><![CDATA[{0}]]></Condition>".format(pWfLnk.condition));
            con = con.concat("</Transition>");
        }
        con = con.concat("</Transitions>");
        con = con.concat("<DataFields>");
        con = con.concat("<ProcessData>");
        for (i = 0; i < this.gProcWfProc.DataFields.Count; i++) {
            pWfDF = this.gProcWfProc.DataFields.ItemByIndex(i);
            con = con.concat("<Item na='{0}'><![CDATA[{1}]]></Item>".format(pWfDF.name, pWfDF.value));
        }
        con = con.concat("</ProcessData>");
        con = con.concat("<ActivityData>");
        for (i = 0; i < this.gProcActs.Count; i++) {
            pWfAct = this.gProcActs.ItemByIndex(i);
            if (pWfAct.DataFields.Count > 0) {
                con = con.concat("<Activity name='{0}'>".format(pWfAct.key));
                for (j = 0; j < pWfAct.DataFields.Count; j++) {
                    pWfDF = pWfAct.DataFields.ItemByIndex(j);
                    con = con.concat("<Item na='{0}'><![CDATA[{1}]]></Item>".format(pWfDF.name, pWfDF.value));
                }
                con = con.concat("</Activity>");
            }
        }
        con = con.concat("</ActivityData>");
        con = con.concat("</DataFields>");
        con = con.concat("</Process>");
        con = con.concat("</List>");

        var sOpt = "update";
        var bIsNew = false;
        if (ozf_StringIsEmpty(this.MProcessID) == true) {
            sOpt = "create";
            bIsNew = true;
        }
        con = "<List><UpdateExtraContent option='{0}' part='all' ozid='{1}' eozid='{2}' name='{3}'><Flow></Flow><Data>{4}</Data></UpdateExtraContent></List>".format(sOpt, this.MProcessesOZID, this.MProcessID, this.MProcessName, con);

        var mh = new oza_MetaHandler("ExtraContent", "<List><Item address=''/></List>", con);
        if (mh.execute(null, false, true) === false) {
            ozf_MsgBox("저장도중 오류?", null);
            return false;
        }
        if (mh.iserror == true) {
            ozf_MsgBox("저장도중 오류", null);
            return false;
        }
        if (bIsNew) {
            var sRes = mh.returncontent;
            var xDoc = ozw_GetParsedXDoc(sRes); //<List><UpdateExtraContent ozid='200a0131-4859c897' eozid='250a019b-599b9c42:E' /></List>
            var xElm = xDoc.getElementsByTagName("List")[0].getElementsByTagName("UpdateExtraContent")[0];
            this.MProcessID = ozw_GetAttrValue(xElm, "eozid", "");
        }

        return true;
    }
}

if (!ozbuilderp.prototype.showContent) {
        ozbuilderp.prototype.showContent = function (sContent, bInitDraw) {
            //<List><Process><ProcessInfo /><Activities /><Transitions /></Process></List>
            // Create the Diagram's Model Data from content
            var xDoc = ozw_GetParsedXDoc(sContent);
            var xRoot = xDoc.documentElement;
            //ProcessInfo
            xRoot = xRoot.getElementsByTagName("Process")[0];
            if (ozw_IsNull(xRoot) == true) {
                alert("[wfbuilderp]InvalidContent:" + sContent);
                return;
            }

            var xProc = xRoot.getElementsByTagName("ProcessInfo")[0]; //List/ProcessResource/ProcessInfo
            if (ozw_IsNull(xProc) == false) 
                this.gProcWfProc.SetProcContent(xProc); //Design
            //Activities
            //this.myArrNodeData = [];
            var xActs = xRoot.getElementsByTagName("Activities")[0];
            if (ozw_IsNull(xActs) == false) {
                if (this.createActivities(xActs, true, false) == false) return;
            }

           
            //this.myArrLinkData = [];
            var xLnks = xRoot.getElementsByTagName("Transitions")[0];
            if (ozw_IsNull(xLnks) == false) {
                //if (xLnks.length > 0) {
                //    xLnks = xLnks[0].getElementsByTagName("Transition");
                    if (this.createTransitions(xLnks, false) == false) return;
                //}
            }
  
            //Data: <DataFields>
            //          <ProcessData><Item na="CAMP_ID"><![CDATA[C1000000746]]></Item></ProcessData>
            //          <ActivityData>
            //              <Activity name="TargetCust_0"><Item na="TGET_CUSTG_ID"><![CDATA[C1000000746_1001]]></Item></Activity>
            //          </ActivityData>
            var xDataRoot = xRoot.getElementsByTagName("DataFields");
            var xData;
            if (xDataRoot.length > 0) {
                xDataRoot = xDataRoot[0];
                xData = xDataRoot.getElementsByTagName("ProcessData");
                if (xData.length > 0) {
                    this.gProcWfProc.applyProcessData(xData[0]);                    
                }
                xData = xDataRoot.getElementsByTagName("ActivityData");
                if (xData.length > 0) {
                    this.applyActData(xData[0], false);
                }
            }


            if (bInitDraw) {
                this.myDiagram.model = new go.GraphLinksModel(this.gProcActs.Values, this.gProcLinks.Values);

                for (var i = 0; i < xActs.childNodes.length; i++) {
                    xAct = xActs.childNodes[i];
                    if (xAct.nodeType !== 1) continue;
                    sKey = ozw_GetAttrValue(xAct, "name", "");
                    oWfAct = this.gProcActs.Item(sKey);
                    if (oWfAct != null) {
                        if (oWfAct.acttype == enumProc) {
                            this.callTM_NewDel(oWfAct, false);
                        }
                    }
                }
            } else {
                if ((this.gProcActs.Count > 0) && (this.myDiagram.model.nodeDataArray.Count == 0)) {
                    this.myDiagram.model = new go.GraphLinksModel(this.gProcActs.Values, this.gProcLinks.Values);
                } else {
                    this.myDiagram.rebuildParts(); //model = new go.GraphLinksModel(this.gProcActs.Values, this.gProcLinks.Values);
                }
            }
            return true;
            } 
    }

if (!ozbuilderp.prototype.createActivities) {
    ozbuilderp.prototype.createActivities = function (xActs, bUpdate, bWithUI) {
        if (typeof (bUpdate) === "undefined") {
            bUpdate = false;
        }
        if (typeof (bWithUI) === "undefined") {
            bWithUI = false;
        }
        var xAct, oWfAct, pWfActRsrc, xAttrs, xAttr, oWfAttr, sKey, sV, sTmp;
        for (var i = 0; i < xActs.childNodes.length; i++) {
            xAct = xActs.childNodes[i];
            if (xAct.nodeType !== 1) continue;
            //원형 Resource에서 정보 가져오기
            var sRsrcName = ozw_GetAttrValue(xAct, "resourcename", "");
            pWfActRsrc = this.gWfResource.WfActList.Item(sRsrcName);
            if (pWfActRsrc == null) { //확인필요
                return false;
            }

            oWfAct = new OZwfActivity();
            sTmp = ozw_GetAttrValue(xAct, "name", "");
            oWfAct.CloneFrom(pWfActRsrc, sTmp);
            oWfAct.designmode = !(this.RunAsMonitor);
            if (this.gProcActs.containsKey(oWfAct.key)) {
                alert("이미 존재하는 항목을 추가할 수 없음");
                return;
            }
            this.checkUniqueIdx(oWfAct.key);
            if (bWithUI) {
                this.myDiagram.model.addNodeData(oWfAct);
                this.gProcActs.AddKey(oWfAct.key);
            } else {
                this.gProcActs.Add(oWfAct.key, oWfAct);
            }
            //this.gProcActs.Add(oWfAct.key, oWfAct);
            //??bWithUI 처리는 
            //if (bWithUI) this.myArrNodeData.push(oWfAct);
            //this.myArrNodeData.push(oWfAct);

            oWfAct.xData = xAct;
            //oWfAct.activitykind = ozw_GetAttrValue(xAct, "activitykind", "");
            oWfAct.acttype = ozw_Convert_AckKind2Type(oWfAct.activitykind);
            oWfAct.isSmall = ((oWfAct.acttype === enumStart || oWfAct.acttype === enumEnd) ? true : false);
            oWfAct.caption = oWfAct.key;
            oWfAct.ActName = sRsrcName;
            if (this.RunAsMonitor == true) {
                oWfAct.ExecInfo = new OZwfExecInfo();
            }
            if (bUpdate) { 
                // <Attr ><InitValue><![CDATA[xx]]></InitValue></Attr>
                xAttrs = xAct.getElementsByTagName("Attr");
                for (var j = 0; j < xAttrs.length; j++) {
                    xAttr = xAttrs[j];
                    sKey = ozw_GetAttrValue(xAttr, "name", "");
                    sV = ozw_GetWfInitValue(xAttr);
                    //Design> Attr
                    oWfAttr = oWfAct.Attrs.Item(sKey);
                    if (oWfAttr == null) {
                        oWfAttr = new OZWfAttr();
                        oWfAttr.name = sKey;
                        oWfAct.Attrs.Add(oWfAttr.name, oWfAttr);
                    }
                    oWfAttr.caption = ozw_GetAttrValue(xAttr, "caption", "");
                    oWfAttr.valuetype = ozw_GetAttrValue(xAttr, "valuetype", "");
                    oWfAttr.value = sV;
                    //UI Related Property???
                    //if (sKey == "app_name_def") {
                    //    oWfAct.app_name_def = sV;
                    //}
                    if (oWfAct.acttype == enumProc) {
                        //if (sKey == "app_desc_def") {
                        //    oWfAct.app_desc_def = sV;
                        //}
                        if (sKey == "design_finish") {
                            oWfAct.design_finish = (sV.toLowerCase() === "false" ? false : true); //Boolean(sV.toLowerCase());
                            if ((this.RunAsMonitor === false) && (oWfAct.design_finish === true)) {
                                oWfAct.finishVisible = 1;
                            } else {
                                oWfAct.finishVisible = 0;
                            }
                        }
                        //if (sKey == "item_addition") {
                        //    oWfAct.item_addition = sV;
                        //}
                    }
                }
            }

        }
    }
}

if (!ozbuilderp.prototype.createTransitions) {
    ozbuilderp.prototype.createTransitions = function (xLnks, bUpdate) {
        if (typeof (bUpdate) === "undefined") {
            bUpdate = false;
        }

        //<Transition name="START-EBMTargetCust_0" source="START" sourcedir="3" target="EBMTargetCust_0" targetdir="1">
        //    <Caption></Caption>
        //    <Condition><![CDATA[#TRUE]]></Condition>
        //</Transition>
        xLnks = xLnks.getElementsByTagName("Transition");
        var xLnk, oLnk, pWfActF, pWfActT;
        for (var i = 0; i < xLnks.length; i++) {
            xLnk = xLnks[i];
            //if (xLnk.nodeType !== 1) continue;
            oLnk = new OZwfLink();
            oLnk.xData = xLnk;
            oLnk.key = ozw_GetAttrValue(xLnk, "name", "");
            oLnk.from = ozw_GetAttrValue(xLnk, "source", "");
            oLnk.to = ozw_GetAttrValue(xLnk, "target", "");
            oLnk.colorH = this.colorLinkDef;
            //Design> caption,condition?
            oLnk.caption = ozw_GetWfCDataValue(xLnk, "Caption");
            oLnk.condition = ozw_GetWfCDataValue(xLnk, "Condition");
            pWfActF = this.gProcActs.Item(oLnk.from);
            if (pWfActF === null) {
                alert("Transition소스NotFound:" + oLnk.from);
                continue;
            }
            pWfActT = this.gProcActs.Item(oLnk.to);
            if (pWfActT === null) {
                alert("Transition소스NotFound:" + oLnk.to);
                continue;
            }
            pWfActF.AddLink(pWfActT.ActName, false); //For MaxCheck in DesignMode
            pWfActT.AddLink(pWfActF.ActName, true);
            this.gProcLinks.Add(oLnk.key, oLnk);
            //this.myArrLinkData.push(oLnk);
        }
    }
}

if (!ozbuilderp.prototype.RefreshStatus) {
    ozbuilderp.prototype.RefreshStatus = function () {
            //==showExecInfo
        var wh = new oza_WorkFlowHandler();
        wh.WorkFlowExec = "App";
        wh.WorkFlowType = "Process";
        wh.ProcessResourceName = this.gWfResource.Name;
        wh.MPAppID = this.MPAppID;
        wh.IPAppID = this.IPAppID;
        wh.Status = "MONITOR";
        if (wh.execute(null, false) === false) {
            console.log("Error>> Process_RefreshStatus Failed!!");
            alert("Error>> Process_RefreshStatus Failed!!");
            return false;
        }
        if (wh.getIsError() == true) {
            alert("모니터링 정보를 가져올 수 없습니다." );
            return false;
        }
        var sRes = "";
        sRes = wh.getResult();
        var xDoc = ozw_GetParsedXDoc(sRes);
        var xRoot = xDoc.documentElement;
        if (ozw_GetAttrValue(xRoot, "errorcode").length > 0) {
            alert("모니터링 정보를 가져올 수 없습니다. ") + ozw_GetAttrValue(xRoot, "errormessage");
            return false;
        }

        if (xRoot.children.length == 0) { return false; }
        xRoot = xRoot.children[0];  //List/Process
        if (xRoot.children.length == 0) { return false; }

        //
        //this.myDiagram.startTransaction("refresh");
        var updateNodes = new ClsCollJ();

        //ProcessExec
        var xExec = xRoot.getElementsByTagName("ExecInfo");
        if (xExec.length > 0) {
            xExec = xExec[0];
            xExec = xExec.getElementsByTagName("ProcessExec");
            //<ProcessExec><Attr name="mpid"><![CDATA[1526308112303076]]></Attr>
            //<Attr name="ipid"><![CDATA[1526314335999673]]></Attr>
            //<Attr name="status"><![CDATA[RUNNING]]></Attr>
            //<Attr name="started_when"><![CDATA[RUNNING]]></Attr>
            //<Attr name="error"><![CDATA[FALSE]]></Attr><Attr name="errordesc"><![CDATA[]]></Attr></ProcessExec>
            //SetExecInfo
            if (xExec.length > 0) {
                if (ozw_IsNull(this.gProcWfProc.ExecInfo)) this.gProcWfProc.ExecInfo = new OZwfExecInfo();
                xAttrs = xExec[0].getElementsByTagName("Attr");
                var sVal;
                for (var j = 0; j < xAttrs.length; j++) {
                    xAttr = xAttrs[j];
                    sKey = ozw_GetAttrValue(xAttr, "name", "");
                    sVal = xAttr.textContent.trim();
                    switch (sKey) {
                        case "mpid":
                            this.gProcWfProc.ExecInfo.M_ID = sVal;
                            break;
                        case "ipid":
                            this.gProcWfProc.ExecInfo.I_ID = sVal;
                            break;
                        case "status":
                            this.gProcWfProc.ExecInfo.Status = sVal;
                            break;
                        case "error":
                            this.gProcWfProc.ExecInfo.HasError = ozw_Convert_String2Bool(sVal);
                            break;
                        case "errordesc":
                            this.gProcWfProc.ExecInfo.ErrorDesc = sVal;
                            break;
                        default:
                            break;
                    }
                }
            }
            //ActivityExec
            xExec = xRoot.getElementsByTagName("ExecInfo");
            xExec = xExec[0].getElementsByTagName("ActivityExec");
            var xAct, xAttrs, xAttr, oWfAct, pNod, sKey;
            for (var i = 0; i < xExec.length; i++) {
                xAct = xExec[i];
                sKey = ozw_GetAttrValue(xAct, "name", "");
                oWfAct = this.gProcActs.Item(sKey);
                if (oWfAct == null) {
                    console.log("Error>> Process_RefreshStatus:Cannot find Activity -" + sKey);
                    continue;
                }
                pNod = this.myDiagram.findNodeForData(oWfAct);
                oWfAct.HasExecInfo = true;
                xAttrs = xAct.getElementsByTagName("Attr");
                for (var j = 0; j < xAttrs.length; j++) {
                    xAttr = xAttrs[j];
                    sKey = ozw_GetAttrValue(xAttr, "name", "");
                    sVal = xAttr.textContent.trim();
                    switch (sKey) {
                        case "maid":
                            oWfAct.ExecInfo.M_ID = sVal;
                            break;
                        case "iaid":
                            oWfAct.ExecInfo.I_ID = sVal;
                            break;
                        case "status":
                            oWfAct.ExecInfo.Status = sVal;
                            if (updateNodes.containsKey(oWfAct.key) == false) updateNodes.Add(oWfAct.key, pNod);
                            //node.updateTargetBindings();
                            //this.myDiagram.model.setDataProperty(oWfAct, "ExecInfo.Status", xAttr.textContent.trim());
                            //this.myDiagram.model.setDataProperty(oWfAct, "SetStatus", xAttr.textContent.trim());
                            //this.myDiagram.model.setDataProperty(oWfAct.ExecInfo, "Status", xAttr.textContent.trim());
                            //oWfAct.ExecInfo.Status = xAttr.textContent.trim();
                            break;
                        case "error":
                            oWfAct.ExecInfo.HasError = ozw_Convert_String2Bool(sVal);
                            this.myDiagram.model.setDataProperty(oWfAct, "HasError", oWfAct.ExecInfo.HasError);
                            break;
                        case "errordesc":
                            //var iPos = sVal.search("REASON=");
                            //var iLen = sVal.length;
                            //if (iPos > -1) {
                            //    sVal = sVal.substr(iPos, iLen);
                            //    sVal = sVal.replace(/REASON=/g, "\n");
                            //    sVal = "오류 원인:" + sVal;
                            //}
                            oWfAct.ExecInfo.ErrorDesc = sVal;
                            this.myDiagram.model.setDataProperty(oWfAct, "ErrorDesc", oWfAct.ExecInfo.ErrorDesc);
                            break;
                        default:
                            break;
                    }
                }

            }
        }
        //activityData
        var xDF = xRoot.getElementsByTagName("DataFields");
        var xData;
        if (xDF.length > 0) {
            xData = xDF[0].getElementsByTagName("ProcessData");
            if (xData.length > 0) {
                this.gProcWfProc.applyProcessData(xData[0]);
            }
            xData = xDF[0].getElementsByTagName("ActivityData");
            if (xData.length > 0) {
                this.applyActData(xData[0], true);
            }
        }

        //this.myDiagram.commitTransaction("refresh");
        for (i = 0; i < updateNodes.Count ; i++) {
            pNod = updateNodes.ItemByIndex(i);
            pNod.updateTargetBindings();
        }

        //this.myDiagram.startTransaction("refresh");
        var pWfLnk, pWfActT, pLnk;
        var cnt = this.gProcLinks.Count;
        for (var i = 0; i < cnt; i++) {
            pWfLnk = this.gProcLinks.ItemByIndex(i);
            pWfActT = this.gProcActs.Item(pWfLnk.to);
            if (pWfActT == null) continue;
            if (pWfActT.ExecInfo == null) continue;
            if (pWfActT.ExecInfo.Status !== "") {
                pWfLnk.colorH = this.colorLinkExe;
                //this.myDiagram.model.setDataProperty(pWfLnk, "color", this.colorLinkExe);
                pLnk = this.myDiagram.findLinkForData(pWfLnk);
                pLnk.updateTargetBindings();
            }
        }
        //this.myDiagram.commitTransaction("refresh");
    }
}

if (!ozbuilderp.prototype.HandleStatusActions) {
    ozbuilderp.prototype.HandleStatusActions = function (sTaskType, sStatus, sActions) {
        sTaskType = sTaskType.toUpperCase();
        sStatus = sStatus.toUpperCase();
        if (sTaskType == "ADD") {
            if (ozw_IsNull(this.gCustomStatusAddList) == true) this.gCustomStatusAddList = new ClsCollJ();
            if (!this.gCustomStatusAddList.containsKey(sStatus)) {
                if (sActions.endsWith(";")) sActions = sActions.substr(0, sActions.length - 1);                    
                this.gCustomStatusAddList.Add(sActions, sStatus)
            }
        }
        else if (sTaskType == "HIDE") {
            if (ozw_IsNull(this.gCustomStatusHideList) == true) this.gCustomStatusHideList = new ClsCollJ();
            if (!gCustomStatusHideList.containsKey(sStatus)) {
                if (sActions.endsWith(";")) sActions = sActions.substr(0, sActions.length - 1);                    
                this.gCustomStatusHideList.Add(sActions, sStatus)
            }
        }
    }
}
if (!ozbuilderp.prototype.HideStatusActions) {
    ozbuilderp.prototype.HideStatusActions = function (sActions) {
        if (sActions.endsWith(";")) { //'마지막 ;는 없애서 split시 수가 어긋나지 않도록.
            sActions = sActions.substr(0, sActions.length - 1);
        }
        this.gHideActions = sActions;
    }
}
if (!ozbuilderp.prototype.SetProcessDataFieldValue) {
    ozbuilderp.prototype.SetProcessDataFieldValue = function (sName, sValue) {
        var pWfDF;
        if (this.gProcWfProc.DataFields.containsKey(sName)) {
            pWfDF = this.gProcWfProc.DataFields.Item(sName);
            if (pWfDF != null)  pWfDF.value = sValue;
        } else {
            pWfDF = new OZwfDataField();
            pWfDF.name = sName;
            pWfDF.value = sValue;
            this.gProcWfProc.DataFields.Add(sName, pWfDF);
        }

    }
}

    if (!ozbuilderp.prototype.applyActData) {
        ozbuilderp.prototype.applyActData = function (xData, bUpdate) {
            //xData = ActivityData
            xData = xData.getElementsByTagName("Activity");
            var pWfAct, xAct, xItms, xItm, sKey, sNA, sV, oWfDF;
            var appnamedef = "", appdescdef = "", itemaddition = "";
            for (var i = 0; i < xData.length; i++) {
                xAct = xData[i];
                //if (xAct.nodeType !== 1) continue;
                sKey = ozw_GetAttrValue(xAct, "name", "");
                pWfAct = this.gProcActs.Item(sKey);
                if (pWfAct == null) {
                    console.log("Error>> Process_RefreshStatus:Cannot find Activity for ActivityData -" + sKey);
                    continue;
                }
                appnamedef = ozw_GetCollItemValue(pWfAct.Attrs, "app_name_def");
                appdescdef = ozw_GetCollItemValue(pWfAct.Attrs, "app_desc_def");
                itemaddition = ozw_GetCollItemValue(pWfAct.Attrs, "item_addition");
                xItms = xAct.getElementsByTagName("Item");                
                for (var j = 0; j < xItms.length; j++) {
                    xItm = xItms[j];
                    sV = xItm.textContent.trim(); //xItm.children[0].textContent.trim();
                    sNA = ozw_GetAttrValue(xItm, "na", "");
                    if (pWfAct.DataFields.containsKey(sNA)) {
                        oWfDF = pWfAct.DataFields.Item(sNA);
                        oWfDF.value = sV;
                    } else {
                        oWfDF = new OZwfDataField();
                        oWfDF.name = sNA;
                        oWfDF.value = sV;
                        pWfAct.DataFields.Add(oWfDF.name, oWfDF);
                    }
                    if (sNA == appnamedef) {  //ChangeCaption
                        if (ozw_IsVacant(sV) == false) {
                            pWfAct.caption = sV;
                            if (bUpdate == true) this.myDiagram.model.setDataProperty(pWfAct, "caption", sV);
                        }
                    }
                    if (pWfAct.acttype == enumProc) {
                        if (sNA == appdescdef) { //ChangeDescription
                            pWfAct.description = sV;
                            if (bUpdate == true) this.myDiagram.model.setDataProperty(pWfAct, "description", sV);
                        }
                        if (sNA == itemaddition) { //item_addition
                            pWfAct.Extra = sV;
                            if (bUpdate == true) this.myDiagram.model.setDataProperty(pWfAct, "Extra", sV);
                        }

                    }
                }
            }
        }
    }

    if (!ozbuilderp.prototype.initDiagram) {
        ozbuilderp.prototype.initDiagram = function (sParentID) {
            //Define UI template
            var myD = new go.Diagram(sParentID);
            myD.allowClipboard = false;
            myD.allowCopy = false;
            myD.allowDelete = false;
            myD.allowGroup = false;
            myD.maxSelectionCount = 1;
            myD.padding = new go.Margin(30, 10, 10, 30);
            myD.undoManager.isEnabled = true; //잘못된 링크제거 가능하게 하기 위해(undo)
            return myD;
        }
    }
    if (!ozbuilderp.prototype.makePort) {
        ozbuilderp.prototype.makePort = function (isIn, isMonitor) {
            //dataFlow Sample
            var name = "Out";
            if (isIn) name = "In";
            var port = $go(go.Shape, 
                {
                    figure: "Diamond", fill: "lightgray", stroke: "gray",
                    //desiredSize: new go.Size(8, 8),
                    portId: name,  // declare this object to be a "port"
                    cursor: "pointer"  // show a different cursor to indicate potential link point
                });
            if (isMonitor) {
                port.desiredSize = new go.Size(0, 0);
            } else {
                port.desiredSize = new go.Size(8, 8);
            }
            var panel = $go(go.Panel, "Horizontal",
                { margin: new go.Margin(0, 0) });
            // set up the port/panel based on which side of the node it will be on
            if (isIn) {
                port.toSpot = go.Spot.Left;
                port.toLinkable = true;
                panel.alignment = go.Spot.TopLeft;
                panel.add(port);
            } else {
                port.fromSpot = go.Spot.Right;
                port.fromLinkable = true;
                panel.alignment = go.Spot.TopRight;
                panel.add(port);
            }
            return panel;
        }
    }
    if (!ozbuilderp.prototype.makeTemplate) {
        ozbuilderp.prototype.makeTemplate = function (typename, inports, outports) {
            var node = $go(go.Node, "Table",
                {
                    locationObjectName: "BODY",
                    contextMenu: $go(go.Adornment),
                    locationSpot: go.Spot.Center,
                    selectionObjectName: "BODY"
                    //contextMenu: nodeMenu 
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                $go(go.RowColumnDefinition,
                    { column: 0, alignment: go.Spot.Left }),
                $go(go.RowColumnDefinition,
                    { column: 2, alignment: go.Spot.Right }),
                // the body 
                $go(go.Panel, "Auto",
                    {
                        row: 0, column: 1, name: "BODY",
                        //contextMenu: $go(go.Adornment),
                        //locationSpot: go.Spot.Center,
                        height: 74, width: 112
                    },
                    new go.Binding("width", "isSmall", function (v) { return v ? 80 : 112; }),
                    $go(go.Shape, "RoundedBottomRectangle",
                        {
                            fill: "white", stroke: "darkgray",
                            //portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
                            //// allow all kinds of links from and to this port
                            //fromLinkable: true, fromLinkableSelfNode: false, fromLinkableDuplicates: false,
                            //toLinkable: true, toLinkableSelfNode: false, toLinkableDuplicates: false
                        }),
                    $go(go.Panel, "Table",
                        $go(go.RowColumnDefinition, { column: 0, width: 36 }),
                        $go(go.RowColumnDefinition, { row: 0, height: 16 }),
                        $go(go.RowColumnDefinition, { row: 1, height: 40 }),
                        $go(go.RowColumnDefinition, { row: 2, height: 16, separatorStrokeWidth: 1, separatorStroke: "darkgray" }),
                        //$go(go.RowColumnDefinition, { row: 3, height: 15 }),
                        $go(go.Shape, "Rectangle",
                            {
                                row: 0, column: 0, columnSpan: 2,
                                fill: "#e87f24", stroke: "darkgray", // fill: "orange#e87f24", the default fill, if there is no data-binding : <test width: 112, 대신 stretch
                                height: 15, margin: new go.Margin(0, 1, 0, 0), stretch: go.GraphObject.Horizontal
                            },
                            new go.Binding("fill", "colorH"),
                            new go.Binding("width", "isSmall", function (v) { return v ? 80 : 112; })
                        ),
                        $go(go.TextBlock,
                            {
                                row: 0, column: 0, columnSpan: 2, alignment: go.Spot.Center,
                                stroke: "white", font: "bold 10px Malgun Gothic, sans-serif", margin: new go.Margin(0, 4, 0, 0)
                            },
                            new go.Binding("text", "ExecInfo", function (ei) {
                                if (ozw_IsNull(ei) == false) { return ei.Status; } else { return "" }
                            })
                        ),
                        $go(go.Picture,
                            {
                                row: 0, column: 0, alignment: go.Spot.MiddleLeft,
                                source: "../img/wf/target/error.png", opacity: 0,
                                width: 14, height: 12, margin: new go.Margin(0, 0, 0, 4)
                            },
                            new go.Binding("opacity", "ExecInfo", function (ei) {
                                if (ozw_IsNull(ei) == false) { return ei.HasError ? 1 : 0 } else { return 0 }
                            })
                        ),

                        $go(go.Picture, {
                                source: "../img/wf/target/default.png", row: 1, column: 0,
                                width: 32, height: 32, margin: new go.Margin(0, 0, 0, 4)
                            },
                            new go.Binding("source", "imageid", function (v) { return "../img/wf/target/" + v.toLowerCase() + ".png"; })
                        ),
                        $go(go.TextBlock,
                            {
                                name: "CapLabel", row: 1, column: 1, alignment: go.Spot.Center,
                                font: "11px Malgun Gothic, sans-serif", stroke: "#365064", maxSize: new go.Size(80, 40),
                                margin: new go.Margin(2, 2, 1, 0), overflow: go.TextBlock.OverflowEllipsis,
                                wrap: go.TextBlock.WrapDesiredSize
                            },
                            new go.Binding("text", "caption"),
                            {
                                toolTip:
                                $go(go.Adornment, "Auto",
                                    { visible: true },
                                    new go.Binding("visible", "caption", function (t) {
                                        return (t.length > 16 ? true : false);
                                    }),

                                    $go(go.Shape, { fill: "#FFFFCC" }),
                                    $go(go.TextBlock, { margin: 4, font: "10px Malgun Gothic, sans-serif", stroke: "#365064" },
                                        new go.Binding("text", "caption"))
                                )  // end of Adornment
                            }
                        ),
                        $go(go.Picture,
                            {
                                row: 2, column: 0, rowSpan: 2, alignment: go.Spot.BottomLeft,
                                source: "../img/wf/target/completed.png", opacity: 0,
                                width: 13, height: 15, margin: new go.Margin(0, 0, 0, 8)
                            },
                            new go.Binding("opacity", "finishVisible", function (v) { return v })
                            //new go.Binding("opacity", "design_finish", function (v) { return v ? 1 : 0 })
                        ),
                        $go(go.TextBlock,
                            {
                                row: 2, column: 1, alignment: go.Spot.Right,
                                stroke: "#3b3b3b", font: "9px Malgun Gothic, sans-serif", margin: new go.Margin(0, 4, 0, 0)
                            },
                            new go.Binding("text", "description")
                        )
                    ) // endOf go.Panel (table)
                ),      // endOf Body
                //Port
                $go(go.Panel, "Horizontal",
                    { column: 0, row: 0 },
                    //$go(go.Shape,  { portId: "In", figure: "Diamond", width: 8, height: 8, fill: "darkgray", stroke: "gray", toSpot: go.Spot.Left }),
                    inports
                ),
                $go(go.Panel, "Horizontal",
                    { column: 2, row: 0 },
                    //$go(go.Shape, { portId: "Out", figure: "Diamond", width: 8, height: 8, fill: "darkgray", stroke: "gray", fromSpot: go.Spot.Right }),
                    outports
                ),
                //Selection
                {
                    selectionAdornmentTemplate:
                    $go(go.Adornment, "Auto",
                        $go(go.Shape, "RoundedBottomRectangle", { fill: null, stroke: "dodgerblue", strokeWidth: 2 }),
                        $go(go.Placeholder)
                    )  // end Adornment
                }
            );
            this.myDiagram.nodeTemplateMap.add(typename, node);
        }
    }
    if (!ozbuilderp.prototype.makeDiagram) {
        ozbuilderp.prototype.makeDiagram = function (myD, isMonitor) {
            //Define Node
            this.makeTemplate("startprocess", [], [this.makePort(false, isMonitor)]);
            this.makeTemplate("procedure", [this.makePort(true, isMonitor)], [this.makePort(false, isMonitor)]);
            this.makeTemplate("route", [this.makePort(true, isMonitor)], [this.makePort(false, isMonitor)]);
            this.makeTemplate("endprocess", [this.makePort(true, isMonitor)], []);


            //Define Link
            myD.linkTemplate =
                $go(go.Link,
                { routing: go.Link.Orthogonal, corner: 10, contextMenu: $go(go.Adornment)},
                  $go(go.Shape,
                    { stroke: "darkgray", strokeWidth: 2 },
                     new go.Binding("stroke", "colorH")),
                  $go(go.Shape,   // the "to" end arrowhead
                    { toArrow: "Standard", stroke: "yellow", fill: "yellow" },
                    new go.Binding("stroke", "colorH"),
                    new go.Binding("fill", "colorH")
                    )
                );


            //
            //myD.initialDocumentSpot = go.Spot.TopCenter;
            //myD.initialViewportSpot = go.Spot.TopCenter;
            myD.initialContentAlignment = go.Spot.Default;
            myD.layout = $go(go.TreeLayout, {
                layerSpacing: 70
                //arrangementOrigin: new go.Point(50, 50)
                }
            ); // new go.TreeLayout();
            //({comparer: go.LayoutVertex.smartComparer});
        }
    }

    if (!ozbuilderp.prototype.callTM) {
        ozbuilderp.prototype.callTM = function (sMethod) {
            var delim = "!%^";
            var tmh1 = new oza_TMHandler("obzen.service.workflow.tool.ProcessDesigner", sMethod, '1', delim, ozController);
            tmh1.setAddDataField('FLD_OZ_ID', this.MProcessesOZID);
            tmh1.setAddDataField('OZ_ID', this.MProcessID);
            tmh1.execute(null, false);
            return !(tmh1.getIsError());
        }
    }
    if (!ozbuilderp.prototype.callTM_NewDel) {
        ozbuilderp.prototype.callTM_NewDel = function (pWfAct, bDel) {
            var sDesignClsNm = ozw_GetCollItemValue(pWfAct.Attrs, "design_class_name");
            if (ozw_IsVacant(sDesignClsNm) === true) return true;
            var delim = "!%^";
            var sTmp = "", sAttrVal = "", sVal = "";           
            //
            var tmh1 = new oza_TMHandler(sDesignClsNm, (bDel ? "drop" : "create"), '1', delim, ozController);
            sAttrVal = ozw_GetCollItemValue(this.gProcWfProc.Attrs, "app_id_def");
            if (this.gProcWfProc.DataFields.containsKey(sAttrVal)) sVal = ozw_GetCollItemValue(this.gProcWfProc.DataFields, sAttrVal);
            tmh1.setAddDataField('APP_ID', sVal);
            tmh1.setAddDataField('ACTIVITYNAME', pWfAct.key);
            tmh1.setAddDataField('PROCESSRESOURCE', this.gWfResource.Name);
            tmh1.setAddDataField('ACTIVITYRESOURCE', pWfAct.ActName);
            sAttrVal = ozw_GetCollItemValue(pWfAct.Attrs, "app_id_def");
            if (pWfAct.DataFields.containsKey(sAttrVal)) sVal = ozw_GetCollItemValue(pWfAct.DataFields, sAttrVal);
            //sTmp = ozw_GetCollItemValue(pWfAct.DataFields, "app_id_def");
            //if (ozw_IsVacant(sTmp) == false) sVal = sTmp;
            tmh1.setAddDataField('APP_ACT_ID', sVal);
            //
            sAttrVal = ozw_GetCollItemValue(pWfAct.Attrs, "from_app_id_def");
            if (ozw_IsVacant(sAttrVal) == false) {
                var pWfDF = pWfAct.DataFields.Item(sAttrVal);
                if (pWfDF !== null) {
                    sVal = this.GetFromAppIDValueList(pWfAct);
                    pWfDF.value = sVal;
                }
            }
            //sVal = this.GetFromAppIDValueList(pWfAct);
            //sTmp = ozw_GetCollItemValue(pWfAct.Attrs, "from_app_id_def");
            //if (ozw_IsVacant(sTmp) == false) {
            //    var pWfDF = pWfAct.DataFields.Item(sTmp);
            //    if (pWfDF !== null) {
            //        pWfDF.value = sVal;
            //    }
            //}
            tmh1.setAddDataField('FROM_APP_ACT_ID', sVal);
            tmh1.setAddDataField('FROM_ACTIVITYRESOURCE', this.GetInfoFromAct(pWfAct, "resourcename"));
            tmh1.setAddDataField('OBZDELIMITER', delim);
            tmh1.setAddDataField('TIMELIMIT', "0");

            tmh1.execute(null, false);
            return !(tmh1.getIsError());
        }
    }


    if (!ozbuilderp.prototype.GetFromAppIDValueList) {
        ozbuilderp.prototype.GetFromAppIDValueList = function (pWfAct) {
            //InitDraw - callTMNewDel에서 호출시 아직 goNod가 생성되기 전일 수 있음
            var sRet = "", idx, pWfLnk, pWfActF, sVar;
            for (idx = 0; idx < this.gProcLinks.Count; idx++) {
                pWfLnk = this.gProcLinks.ItemByIndex(idx);
                if (pWfLnk.to == pWfAct.key) {
                    pWfActF = this.gProcActs.Item(pWfLnk.from);
                    if (pWfActF.acttype != enumRoute) {
                        sVar = ozw_GetCollItemValue(pWfActF.Attrs, "app_id_def");
                        if (pWfActF.DataFields.containsKey(sVar)) {
                            sRet += ozw_GetCollItemValue(pWfActF.DataFields, sVar) + ";";
                        }
                    }
                }
            }
            //var pNod = this.myDiagram.findNodeForData(pWfAct);
            //if (pNod == null) {
            //    alert("refresh_needed");
            //    return;
            //}
            //var inLinks = pNod.findLinksInto();
            //if (inLinks.count == 0) return "";
            //var sRet, pLnk, pFwfAct, sVar;
            //sRet = "";
            //var it = inLinks.iterator;
            //while (it.next()) {
            //    pLnk = it.value;
            //    pFwfAct = pLnk.fromNode.data;
            //    if (pFwfAct.acttype != enumRoute) {
            //        sVar = ozw_GetCollItemValue(pFwfAct.Attrs, "app_id_def");
            //        if (pFwfAct.DataFields.containsKey(sVar)) {
            //            sRet += ozw_GetCollItemValue(pFwfAct.DataFields, "app_id_def") + ";";
            //        }
            //    }
            //}
            if (sRet.length > 0) sRet = sRet.substr(0, sRet.length - 1);
            return sRet;
        }
    }
    

    if (!ozbuilderp.prototype.GetInfoFromAct) {
        ozbuilderp.prototype.GetInfoFromAct = function (pWfAct, sInfoType) {
            //GetFromActRsrcNames getPreActs
            //InitDraw - callTMNewDel에서 호출시 아직 goNod가 생성되기 전일 수 있음
            var pWfActF, pWfLnk, sNames = "";
            var pGoNod = this.myDiagram.findNodeForData(pWfAct);
            if (ozw_IsNull(pGoNod) == true) {
                for (var idx = 0; idx < this.gProcLinks.Count; idx++) {
                    pWfLnk = this.gProcLinks.ItemByIndex(idx);
                    if (pWfLnk.to == pWfAct.key) {
                        pWfActF = this.gProcActs.Item(pWfLnk.from);
                        if (sInfoType == "resourcename") { //GetFromActRsrcNames
                            sNames += pWfActF.ActName + ";";
                        } else if (sInfoType == "activityname") { //getPreActs
                            sNames += pWfActF.key + ";";
                        }
                    }
                }
            } else {
                var pGoLnk, inLinks = pGoNod.findLinksInto();
                if (inLinks.count == 0) return sNames;
                var it = inLinks.iterator;
                while (it.next()) {
                    pGoLnk = it.value;
                    pWfActF = pGoLnk.fromNode.data;
                    if (sInfoType == "resourcename") { //GetFromActRsrcNames
                        sNames += pWfActF.ActName + ";";
                    } else if (sInfoType == "activityname") { //getPreActs
                        sNames += pWfActF.key + ";";
                    }
                }
                //pGoNod.findLinksInto().each(function (pGoLnk) {
                //    sK = pGoLnk.data.key;
                //    pWfActF = pGoLnk.fromNode.data;
                //    if (sInfoType == "resourcename") { //GetFromActRsrcNames
                //        sNames += pWfActF.ActName + ";";
                //    } else if (sInfoType == "activityname") { //getPreActs
                //        sNames += pWfActF.key + ";";
                //    }
                //});
            }
            if (sNames.endsWith(";")) sNames = sNames.substr(0, sNames.length - 1);
            return sNames;            
        }
    }
    if (!ozbuilderp.prototype.GetInfoToAct) {
        ozbuilderp.prototype.GetInfoToAct = function (pWfAct, sInfoType) {
            var pWfLnk, pWfActT, sNames = "";
            for (var idx = 0; idx < this.gProcLinks.Count; idx++) {
                pWfLnk = this.gProcLinks.ItemByIndex(idx);
                if (pWfLnk.from == pWfAct.key) {
                    pWfActT = this.gProcActs.Item(pWfLnk.to);
                    if (sInfoType == "resourcename") { //GetFromActRsrcNames
                        sNames += pWfActT.ActName + ";";
                    } else if (sInfoType == "activityname") { //getPreActs
                        sNames += pWfActT.key + ";";
                    }
                }
            }

            //var pGoNod = this.myDiagram.findNodeForData(pWfAct);
            //var pGoLnk, pWfActT, sNames = "";
            //var outLinks = pGoNod.findLinksOutOf();
            //if (outLinks.count == 0) return sNames;
            //var it = outLinks.iterator;
            //while (it.next()) {
            //    pGoLnk = it.value;
            //    sK = pGoLnk.data.key;
            //    pWfActT = pGoLnk.toNode.data;
            //    if (sInfoType == "resourcename") {
            //        sNames += pWfActT.ActName + ";";
            //    } else if (sInfoType == "activityname") {
            //        sNames += pWfActT.key + ";";
            //    }
            //}
            //function으로 정의하면 sNames가 매번 초기화됨
            //pGoNod.findLinksOutOf().each(function (pGoLnk) {
            //    sK = pGoLnk.data.key;
            //    pWfActT = pGoLnk.toNode.data;
            //    if (sInfoType == "resourcename") {
            //        sNames += pWfActT.ActName + ";";
            //    } else if (sInfoType == "activityname") {
            //        sNames += pWfActT.key + ";";
            //    }
            //    sNames += pWfActT.key + ";";
            //});
            if (sNames.endsWith(";")) sNames = sNames.substr(0, sNames.length - 1);
            return sNames;
        
        }
    }


if (!ozbuilderp.prototype.checkUniqueIdx) {
    ozbuilderp.prototype.checkUniqueIdx = function (sName) {
        var idx = sName.lastIndexOf("_");
        if (idx > -1) {
            var sNo = sName.substr(idx + 1);
            if (sNo.length < 4) {
                var iNo = parseInt(sNo);
                if (this.gUniqueIdx < iNo) this.gUniqueIdx = iNo;
            }
        }
    }
}   
if (!ozbuilderp.prototype.getNewName) {
    ozbuilderp.prototype.getNewName = function (sCap) {
        this.gUniqueIdx += 1;
        return sCap + "_" + this.gUniqueIdx; //.toString;
    }
}

if (!ozbuilderp.prototype.tryLink) {
    ozbuilderp.prototype.tryLink = function (pWfActF, pWfActT) {
        if (pWfActT.acttype == enumStart) return null;
        //From의 out/To의 in 확인. UndoTryLink는 필요없을듯??
        if (pWfActF.CheckLinkable(pWfActT, false) == false) return null;
        if (pWfActT.CheckLinkable(pWfActF, true) == false) return null;

        var oLnk = new OZwfLink();
        oLnk.from = pWfActF.key;
        oLnk.to = pWfActT.key;
        oLnk.key = oLnk.GetID(); //순서 반드시 from/to지정 후에
        oLnk.colorH = this.colorLinkDef;
        //CheckLinkable에서 이미 오류 확인하고 여기서 cancel은 없다 가정
        //pWfActF.AddLink(pWfActT.ActName, false); //AddOutLink
        //pWfActT.AddLink(pWfActF.ActName, true); //AddInLink
        return oLnk;
    }
}

if (!ozbuilderp.prototype.doDeleteNode) {
    ozbuilderp.prototype.doDeleteNode = function (refObj) {
        var refBuilder = getCtl(getRefBuilderID());
        //do DeleteNode 
        var pWfAct = refObj.data;
        var pWfActF, pWfActT;
        if (pWfAct.acttype == enumProc) {
            if (refBuilder.callTM_NewDel(pWfAct, true) == false) return;
        }

        //#Event_ActivityDeleted  : 지우기 전에 정보를 만들어놓아야 함. 특히 FromTo연결정보
        refBuilder.gEvtArgs.Purpose = pWfAct.ActName;
        refBuilder.gEvtArgs.Address = this.GetInfoFromAct(pWfAct, "activityname"); //getPreActs(pWfAct);
        refBuilder.gEvtArgs.Content = this.GetInfoToAct(pWfAct, "activityname"); //getPostActs(pWfAct);
        refBuilder.gEvtArgs.Extra = pWfAct.key;

        //연결 노드의 from/to cand 처리
        var sK, pWfLnk, collLnk2Del = new ClsCollJ();
        refObj.findLinksInto().each(function (pGoLnk) {
            pWfLnk = pGoLnk.data;
            sK = pWfLnk.key;
            collLnk2Del.Add(sK, pWfLnk);
            pWfActF = pGoLnk.fromNode.data;
            pWfActF.RemoveLink(pWfAct.ActName, false);
        });
        refObj.findLinksOutOf().each(function (pGoLnk) {
            pWfLnk = pGoLnk.data;
            sK = pWfLnk.key;
            collLnk2Del.Add(sK, pWfLnk);
            pWfActT = pGoLnk.toNode.data;
            pWfActT.RemoveLink(pWfAct.ActName, true);
            //DocumentChanged : Target항목 
            if (pWfActT.acttype == enumProc) {
                var pWfAttr = pWfActT.Attrs.Item("design_finish");
                if (pWfAttr != null) pWfAttr.value = "False";
                pWfActT.design_finish = false;
                if ((this.RunAsMonitor === false) && (pWfActT.design_finish === true)) {
                    pWfActT.finishVisible = 1;
                } else {
                    pWfActT.finishVisible = 0;
                }
                //var pGoNod = this.myDiagram.findNodeForData(pWfActT);
                //pGoNod.updateTargetBindings(); 
            }
        });
        //연결 링크 제거
        for (var i = 0; i < collLnk2Del.Count; i++) {
            pWfLnk = collLnk2Del.ItemByIndex(i);
            refBuilder.myDiagram.model.removeLinkData(pWfLnk);
            refBuilder.gProcLinks.RemoveKey(pWfLnk.key);
        }
        //노드 제거
        refBuilder.myDiagram.model.removeNodeData(pWfAct);
        refBuilder.gProcActs.RemoveKey(pWfAct.key);
        //
        refBuilder.myDiagram.layout.invalidateLayout(); 

        //#Event_ActivityDeleted 
        if (typeof this.activitydeleted === "function") {
            setTimeout(this.activitydeleted(), 1);
        }
    }
}
if (!ozbuilderp.prototype.doDeleteLink) {
    ozbuilderp.prototype.doDeleteLink = function (refObj) {
        //do DeleteLink :DotNet에서 OnDocumentChanged 이벤트와 나뉘어 있던것 합침
        var refBuilder = getCtl(getRefBuilderID());
        refBuilder.myDiagram.startTransaction("delete link");
        //연결 노드의 from/to cand 처리
        var pWfActF = refObj.fromNode.data;
        var pWfActT = refObj.toNode.data;
        var orgLoc = refObj.toNode.location;
        pWfActF.RemoveLink(pWfActT.ActName, false);
        pWfActT.RemoveLink(pWfActF.ActName, true);
        //
        var pWfLnk = refObj.data;
        refBuilder.myDiagram.model.removeLinkData(pWfLnk);
        refBuilder.gProcLinks.RemoveKey(pWfLnk.key);
        //pWfActF = refBuilder.gProcActs.Item(pWfLnk.from);
        //pWfActT = refBuilder.gProcActs.Item(pWfLnk.to);
        //pWfActF.RemoveLink(pWfActT.ActName, false);
        //pWfActT.RemoveLink(pWfActF.ActName, true);
        //DocumentChanged : Target항목 
        if (pWfActT.acttype == enumProc) {
            var pWfAttr = pWfActT.Attrs.Item("design_finish");
            if (pWfAttr != null) pWfAttr.value = "False";
            pWfActT.design_finish = false;
            if ((this.RunAsMonitor === false) && (pWfActT.design_finish === true)) {
                pWfActT.finishVisible = 1;
            } else {
                pWfActT.finishVisible = 0;
            }
            var pGoNod = this.myDiagram.findNodeForData(pWfActT);
            pGoNod.updateTargetBindings(); //WPDNode.RefreshData?
        }
        //refBuilder.myDiagram.rebuildParts(); //model = new go.GraphLinksModel(refBuilder.gProcActs.Values, refBuilder.gProcLinks.Values); //refresh
        refBuilder.myDiagram.commitTransaction("delete link");
        refObj.toNode.location = orgLoc;
    }
}

if (!ozbuilderp.prototype.InitServer) {
    ozbuilderp.prototype.InitServer = function (selector, refAgent) {
        //Do Nothing. for Interface Only
    }
}

// This is the general menu command handler, parameterized by the name of the command.
    function cxcommand2(event) {
        var refBuilder = getCtl(getRefBuilderID());
        var diagram = refBuilder.myDiagram; // this.diagram;;
        if (!(diagram.currentTool instanceof go.ContextMenuTool)) return;
        var sRsrcID = event.currentTarget.id;
        var pWfAct = null;
        var pWfActF, pWfActT, pWfLnk;
        //actDel_ItemClick
        if (sRsrcID == "_delete") {
            //alert("삭제 메뉴 선택됨!!");
            var refObj = diagram.toolManager.contextMenuTool.currentObject;
            if (refObj instanceof go.Node) {
                if (refBuilder.ManualActivityDelete == true) {
                    //#Event_BeforeActivityDelete
                    pWfAct = refObj.data;
                    refBuilder.gEvtArgs.Purpose = "BeforeActivityDelete";
                    refBuilder.gEvtArgs.Address = this.GetInfoFromAct(pWfAct, "activityname"); //getPreActs(pWfAct);
                    refBuilder.gEvtArgs.Content = this.GetInfoToAct(pWfAct, "activityname"); //getPostActs(pWfAct);
                    refBuilder.gEvtArgs.Extra = pWfAct.key;
                    if (typeof this.beforeactivitydelete === "function") {
                        setTimeout(this.beforeactivitydelete(), 1);
                    }
                } else {
                    refBuilder.doDeleteNode(refObj);
                }    
            } else {
                if (refObj instanceof go.Link) {
                    refBuilder.doDeleteLink(refObj);            
                }
            }
            //diagram refresh??
            diagram.currentTool.stopTool();
            return;
        }

        doCreate: {
            //AddNodeFromResource
            var pWfActRsrc = refBuilder.gWfResource.WfActList.Item(sRsrcID);
            if (pWfActRsrc == null) {
                alert("리소스 없음-" + sRsrcID);
                break doCreate;
            }
            var sN = pWfActRsrc.ActName;
            if (pWfActRsrc.activitykind == "endprocess") {
                pWfAct = refBuilder.gProcActs.Item(sN);
            }
            //UniqueDrawRsrc 기능 생략
            refBuilder.myDiagram.startTransaction("createbymenu");
            if (pWfAct == null) {
                var sCap = "", sTmp;
                //ResourceCustomCaptionList
                sCap = refBuilder.RsrcCaptionColl.Item(sN);
                if (ozw_IsVacant(sCap)) sCap = sN;
                if (pWfActRsrc.activitykind == "endprocess") {
                    sTmp = sCap;
                } else {
                    sTmp = refBuilder.getNewName(sCap);
                    while (refBuilder.gProcActs.containsKey(sTmp)) {
                        sTmp = refBuilder.getNewName(sCap);
                    } 
                }
                pWfAct = new OZwfActivity();
                pWfAct.CloneFrom(pWfActRsrc, sTmp);
                pWfAct.acttype = ozw_Convert_AckKind2Type(pWfAct.activitykind);
                pWfAct.designmode = !(refBuilder.RunAsMonitor);
                //refBuilder.gProcActs.Add(pWfAct.key, pWfAct);
                refBuilder.myDiagram.model.addNodeData(pWfAct);
                refBuilder.gProcActs.AddKey(pWfAct.key);

            }
            var pFNode = diagram.toolManager.contextMenuTool.currentObject;
            var pWfLnk;
            if (pFNode instanceof go.Node) {
                var pWfActF = pFNode.data;
                pWfLnk = refBuilder.tryLink(pWfActF, pWfAct);
                if (pWfLnk != null) {
                    refBuilder.myStatus = true; //ChangedListener가 무시하도록
                    //refBuilder.gProcLinks.Add(pWfLnk.key, pWfLnk); //실제 Node가 Diagram에서 생성되지 않아 callTM_NewDel내에서 inlinks 찾기할 Node를 못찾음
                    refBuilder.myDiagram.model.addLinkData(pWfLnk);
                    refBuilder.gProcLinks.AddKey(pWfLnk.key);
                }
            }
            refBuilder.myDiagram.commitTransaction("createbymenu");
            //refBuilder.myDiagram.rebuildParts(); //model = new go.GraphLinksModel(refBuilder.gProcActs.Values, refBuilder.gProcLinks.Values);

            if (pWfAct.acttype == enumProc) {
                refBuilder.callTM_NewDel(pWfAct, false);
                //#Event_ActivityCreated 
                refBuilder.gEvtArgs.Purpose = pWfAct.ActName;
                refBuilder.gEvtArgs.Address = refBuilder.GetInfoFromAct(pWfAct, "activityname"); //getPreActs(pWfAct);
                refBuilder.gEvtArgs.Content = refBuilder.GetInfoToAct(pWfAct, "activityname"); //getPostActs(pWfAct);
                refBuilder.gEvtArgs.Extra = pWfAct.key;
                //반복 실행시 async처리가 제대로 되는지, 빠지는 것은 없는지 확인요!!!
                if (typeof refBuilder.activitycreated === "function") {
                    setTimeout(refBuilder.activitycreated(), 1);
                }
            }
        }
        diagram.currentTool.stopTool();
}

    function cxcommand(event) {
        var refBuilder = getCtl(getRefBuilderID());
        var diagram = refBuilder.myDiagram; // this.diagram;;
        if (!(diagram.currentTool instanceof go.ContextMenuTool)) return;
        //alert(sStatus);
        var sStatus = event.currentTarget.id;
        if (refBuilder.RaiseEvent_BeforeStateChange == true) {
            var pWfAct = refBuilder.myCurNode.data;
            refBuilder.gEvtArgs.Purpose = pWfAct.resourcename;
            refBuilder.gEvtArgs.Address = sStatus;
            refBuilder.gEvtArgs.Content = pWfAct.ExecInfo.Status;
            refBuilder.gEvtArgs.Extra = pWfAct.key;

            //refBuilder.BeforeStateChange();
            if (typeof refBuilder.beforestatechange === "function") {
                setTimeout(refBuilder.beforestatechange(), 1);
            }
        } else {
            //doChangeStatus
            var refNode = diagram.toolManager.contextMenuTool.currentObject;
            if (refNode instanceof go.Node) {
                var refWfAct = refNode.data;
                var mh = new oza_MetaHandler("Workflow", "<List><Item address=''/></List>",
                    "<List><WorkflowOption><Type va='WorkflowHandle'></Type><WorkflowInfo exec='Meta' type='Activity' kind='Schedule'></WorkflowInfo>" +
                    "<ID na='MP_ID' va='{0}'/><ID na='IP_ID' va='{1}'/>".format(refBuilder.gProcWfProc.ExecInfo.M_ID, refBuilder.gProcWfProc.ExecInfo.I_ID) +
                    "<ID na='MA_ID' va='{0}'/><ID na='IA_ID' va='{1}'/>".format(refWfAct.ExecInfo.M_ID, refWfAct.ExecInfo.I_ID) +
                    "<PARAM na='STATUS' va='{0}'/><DataField></DataField></WorkflowOption></List>".format(sStatus)
                );
                if (mh.execute(null, false) === false) {
                    console.log("Error>> Process_RefreshStatus Failed!!");
                    return;
                }

                var sRes = mh.returncontent;
                // <List><Process>
                //          <ExecInfo><ProcessExec/><ActivityExec/></ExecInfo>
                //          <DataFields><ProcessData/><ActivityData/></DataFields>
                // </Process></List>
                var xDoc = ozw_GetParsedXDoc(sRes);
                var xRoot = xDoc.documentElement;
                if (ozw_GetAttrValue(xRoot, "errorcode").length > 0) {
                    alert("상태를 변경할 수 없습니다.") + ozw_GetAttrValue(xRoot, "errormessage");
                } else {
                    refWfAct.ExecInfo.Status = sStatus;
                    alert("작업이 등록되었습니다.");
                    refBuilder.RefreshStatus();
                }
            }

        }
        //switch (sStatus) {
        //case "Cut": diagram.commandHandler.cutSelection(); break;
        //case "Copy": diagram.commandHandler.copySelection(); break;
        //case "Paste": diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint); break;
        //case "Delete": diagram.commandHandler.deleteSelection(); break;
        //}
        diagram.currentTool.stopTool();
    }


//=== ozbuilderp==========E=======================================================//

    //===Node Base Shape
    go.Shape.defineFigureGenerator("RoundedBottomRectangle", function (shape, w, h) {
        // this figure takes one parameter, the size of the corner
        var p1 = 5;  // default corner size
        if (shape !== null) {
            var param1 = shape.parameter1;
            if (!isNaN(param1) && param1 >= 0) p1 = param1;  // can't be negative or NaN
        }
        p1 = Math.min(p1, w / 2);
        p1 = Math.min(p1, h / 2);  // limit by whole height or by half height?
        var geo = new go.Geometry();
        // a single figure consisting of straight lines and quarter-circle arcs
        geo.add(new go.PathFigure(0, 0)
            .add(new go.PathSegment(go.PathSegment.Line, w, 0))
            .add(new go.PathSegment(go.PathSegment.Line, w, h - p1))
            .add(new go.PathSegment(go.PathSegment.Arc, 0, 90, w - p1, h - p1, p1, p1))
            .add(new go.PathSegment(go.PathSegment.Line, p1, h))
            .add(new go.PathSegment(go.PathSegment.Arc, 90, 90, p1, h - p1, p1, p1).close()));
        // don't intersect with two bottom corners when used in an "Auto" Panel
        geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0);
        geo.spot2 = new go.Spot(1, 1, -0.3 * p1, -0.3 * p1);
        return geo;
    });
