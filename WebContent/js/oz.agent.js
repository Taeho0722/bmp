var baseurl = document.location.protocol + "//" + document.location.host;

var urls = baseurl + "/rest/service";
var urlLogon = baseurl + "/rest/logon";

var tmerrorname = "__ERROR__";
var tmitemerrorcode = "__ECODE__";
var tmerrormessagename = "__ERRORMESSAGE__";
var tmitemmessagename = "__MESSAGE__";
var maipage = "../obzenEMS.html";

var sessionCloseCnt = 0;

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}

// Set Urls For Logon & Service
function oza_InitConfiguration(url) {
    baseurl = url;
    urls = baseurl + "/rest/service";
    urlLogon = baseurl + "/rest/logon";
}

//Goto Main
function oza_goToHomePage(){
    sessionStorage.clear();
    window.top.location.replace(maipage); 
}

/*=================================================
  Logon Handler
==================================================*/
function oza_LogonHandler(id, pass) {
    var self = this;
    var Inst = this;
    var ReturnInfo = "";
    var IsError = false, Errorcode = "", Errormessage = "", ErrorDesc = "", Message = "";
    var data_id = id;
    var data_pass = pass;
    //Get Property
    this.getErrorcode = function () { return Errorcode; }
    this.getErrormessage = function () { return Errormessage; }
    this.getErrorDesc = function () { return ErrorDesc; }
    this.getMessage = function () { return Message; }
    /** * @constructor*/
    this.getIsError = function () { return IsError; }
    /** * @constructor*/
    this.execute = function doExecute() {
        var info;
        info = '[{"service":"ecube"}, {"method":"logon"},';
        info = info + '{"userid":"' + data_id + '"},';
        info = info + '{"password":"' + data_pass + '"}]';

        $.ajax({
            type: 'POST',
            url: urlLogon,
            data: info,
            async: false,
            success: function (data, status) {
                oza_LogonResult(data);
            },
            error: function (x, e) {
                IsError = true;
                Errormessage = ajaxError(x, e);
                alert(Errormessage);
            }
        });
    }

    // Logon Ajax Callback When Success
    function oza_LogonResult(content) {
        console.log(content);
        ResultData = "";

        var jobj = JSON.parse(content);
        if (jobj.success == true) {
            IsError = false;
        } else {
            IsError = true;
            Errorcode = jobj['errorcode'];
            Errormessage = jobj['errormessage'];
            return ""
        }
    }
}


/*=================================================
   File Upload
==================================================*/
function oza_fileuploadhandler(progressid) {
    //var fileslist = new Array;
    var inst = this;
    var Callbackfunc;
    var errorFlag;

    //파일 추가
    //  this.AddFile = function (file) {
    //      fileslist.push(file);
    //}

    this.isError = function () { return errorFlag; }
    //업로드
    this.execute = function doexecute(caller, asyncF, serverFileName, clientfileInfo) {
        Callbackfunc = caller;
        if (asyncF == null) {
            asyncF = true;
        }

        // 성공 : {"success":true, "result":""}
        // 에러 : {"success":false, "errorcode":"", "errormessage":""}
        var uploadFiles = new FormData();
        uploadFiles.append("fileData", clientfileInfo);
        uploadFiles.append("UploadFileName", serverFileName);
        uploadFiles.append("eCubeServerPath", "repository");
        uploadFiles.append("UploadFileDelete", "enable");

        $.ajax({
            type: 'POST',
            url: urls + "/upload",
            data: uploadFiles,
            async: asyncF,
            dataType: 'json',
            processData: false,
            contentType: false,
            progressall: function (e, data) {
                if (progressid != null) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    var bar = "#" & progressid & " .bar";
                    $(bar).css(
	                    'width', progress + '%'
	                );
                }
            },
            success: function (e, data) {
                errorFlag = false;
                if (Callbackfunc != null) {
                    if (typeof Callbackfunc === "function") {
                        Callbackfunc(inst);
                    }
                };
            },
            error: function (x, e) {
                errorFlag = true;
                alert(ajaxError(x, e));
            }
        });
    }

}

/*=================================================
   OLAP Handler
==================================================*/
function oza_olaphandler(purpose, address, content) {
    var instme = this;
    this.callinst = null;
    this.cfunc = null;
    this.iserror = false;
    this.returncontent = "";
    this.Errormessage = "";
    //this.resultcontent = function () { return returncontent; }

    this.execute = function doExecute(caller, inst, asyncF, isset) {
        this.callinst = inst;
        if (purpose == null) {
            alert("purpose not defined")
            return false;
        }
        if (address == null) {
            alert("address not defined")
            return false;
        }
        if (content == null) {
            alert("content not defined")
            return false;
        }
        if (asyncF == null) { asyncF = false; }
        
        this.cfunc = caller;
        if (isset == true) {
            info = this.setparam(purpose.toLowerCase(), address, content);
        } else {
            info = this.param(purpose.toLowerCase(), address, content);
        }

        if(sessionStorage.getItem("issecure") == "true"){
            info = AESEncrypt(info);
        }

        $.ajax({
            type: 'POST',
            url: urls,
            data: info,
            async: asyncF,
            headers: { "securetoken": sessionStorage.getItem("secure_token") },
            success: function (data, status) { oza_ReceiveResult(instme, data); },
            error: function (x, e) {
                instme.iserror = true;
                instme.Errormessage = ajaxError(x, e);
                alert(instme.Errormessage);
            }
        });
    }
}

//Make Parameter When Getting Data
oza_olaphandler.prototype.param = function (p, a, c) {
    var ResultData;
    ResultData = '[{"service":"olap"}, {"method":"getdata"},';
    ResultData = ResultData + '{"purpose":"' + p + '"},';
    ResultData = ResultData + '{"address":"' + a + '"},';
    ResultData = ResultData + '{"content":"' + c + '"}]';
    return ResultData;
}
//Make Parameter When Setting Data
oza_olaphandler.prototype.setparam = function (p, a, c) {
    var ResultData;
    ResultData = '[{"service":"olap"}, {"method":"setdata"},';
    ResultData = ResultData + '{"purpose":"' + p + '"},';
    ResultData = ResultData + '{"address":"' + a + '"},';
    ResultData = ResultData + '{"content":"' + c + '"}]';
    return ResultData;
}


/*=================================================
   Agent Helper Handler
==================================================*/
function oza_Helperhandler(purpose, address, content) {
    var instme = this;
    this.callinst = null;
    this.cfunc = null;
    this.iserror = false;
    this.returncontent = "";
    this.Errormessage = "";
    //this.resultcontent = function () { return returncontent; }

    this.execute = function doExecute(caller, inst, asyncF, isset) {
        this.callinst = inst;
        if (purpose == null) {
            alert("purpose not defined")
            return false;
        }
        if (address == null) {
            alert("address not defined")
            return false;
        }
        if (content == null) {
            alert("content not defined")
            return false;
        }
        if (asyncF == null) { asyncF = false; }

        this.cfunc = caller;      
        info = this.param(purpose.toLowerCase(), address, content);

        if (sessionStorage.getItem("issecure") == "true") {
            info = AESEncrypt(info);
        }

        $.ajax({
            type: 'POST',
            url: urls,
            data: info,
            async: asyncF,
            headers: { "securetoken": sessionStorage.getItem("secure_token") },
            success: function (data, status) { oza_helperReceiveResult(instme, data); },
            error: function (x, e) {
                instme.iserror = true;
                instme.Errormessage = ajaxError(x, e);
                alert(instme.Errormessage);
            }
        });

        function oza_helperReceiveResult(inst, content) {
            inst.returncontent = oza_GetReceiveContent(content);
            if (!ozf_StringIsEmpty(inst.returncontent)) {
                inst.iserror = true;
            }
            else {
                inst.iserror = false;
            }
            if (inst.cfunc != null) {
                if (typeof inst.cfunc === "function") {
                    inst.cfunc(inst.callinst, inst.returncontent, inst.iserror, inst);
                }
            }
        }
    }
}

//Make Parameter When Getting Data
oza_Helperhandler.prototype.param = function (p, a, c) {
    var ResultData;
    ResultData = '[{"service":"olap"}, {"method":"getdata"},';
    ResultData = ResultData + '{"purpose":"' + p + '"},';
    ResultData = ResultData + '{"address":"' + a + '"},';
    ResultData = ResultData + '{"content":"' + c + '"}]';
    return ResultData;
}

/**
 * @description  Meta Handler
 * @param {string} purpose
 * @param address
 * @param content
 * @author
 * @fileOverview
 * @
 */
function oza_MetaHandler(purpose, address, content) {
    //var cfunc, IsError;
    //var resultcontent;
    //var Inst = this;
    
    var instme = this;
    var errormessage = '';

    this.callinst = null;
    this.cfunc = null;
    this.iserror = false;
    this.returncontent = "";    

    this.getErrormessage = function () { return errormessage; }
   
    // Execute Ajax
    this.execute = function doExecute(caller, asyncF, isSet) {
        if (purpose == null) {
            alert("purpose not defined")
            return false;
        }
        if (address == null) {
            alert("address not defined")
            return false;
        }
        if (content == null) {
            alert("content not defined")
            return false;
        }
        if (asyncF == null) {
            asyncF = false;
        }
        if (isSet == null) {
            isSet = false;
        }

        this.callinst = caller;
        if (isSet) {
            info = oza_GetServiceContentSet(purpose.toLowerCase(), address, content);
        } else {
            info = oza_GetServiceContent(purpose.toLowerCase(), address, content);
        }

        if(sessionStorage.getItem("issecure") == "true"){
            info = AESEncrypt(info);
        }

        $.ajax({
            type: 'POST',
            url: urls,
            data: info,
            async: asyncF,
            headers: { "securetoken": sessionStorage.getItem("secure_token") },
            success: function (data, status) {
                oza_ReceiveResult(instme, data);
                if (instme.iserror === true) {
                    errormessage = oza_GetErrorContent(data);
                }
            },
            error: function (x, e) {
                instme.iserror = true;
                alert(ajaxError(x, e));
            }
        });
    }
}

/*=================================================
   Collection Parser
==================================================*/
function oza_CollectionParser() {
    var resultJSON;

    this.init = function (resultdata) {
        resultJSON = JSON.parse(resultdata);
    }

    Object.defineProperty(this, 'RecordCount', {
        get: function () {
            return resultJSON.length - 1;
        },
        set: function (val) {
           
        }
    });
    this.CellData = function (header, index) {
        var value;
        value = resultJSON[index][header];
        if (ozf_StringIsEmpty(value) != true) {
            return value.trim()
        } else {
            return '';
        }        
    }
}

/*=================================================
   TransactionModel Handler For Frame (스크립트에서 TM 호출할 경우)
==================================================*/
function oza_TMHandlerFrame(ozController) {
    var tmhandler = null;
    var DataFieldlist = new Array;
    var collectionParser;
    var ozController1 = ozController;

    this.package;
    this.classname;
    this.methodname;
    this.tmtype;
    this.delimiter = "!%^";

    this.TimeOut;
    this.maxrows;
    this.returnlist;

    this.ElementValue = function (id) {
        return tmhandler.ElementValue(id);
    }
    Object.defineProperty(this, 'Get_CollectionParser', {
        get: function () {
            return collectionParser;
        },
        set: function (val) {

        }
    });
    Object.defineProperty(this, 'errorDesc', {
        get: function () {
            return tmhandler.getErrorDesc();
        }
    });
    //Get Property
    this.errorCode = function () {
        return tmhandler.getErrorcode();
    }
    this.isError = function () {
        return tmhandler.getIsError()
    }
    this.errorMessage = function () {
        return tmhandler.getErrormessage();
    }
    this.Message = function () {
        return tmhandler.getMessage();
    }
    this.getResult = function () {
        return tmhandler.getResult();
    }
    //DataField 추가
    this.addDataField = function (name, value) {
        var field;
        field = new oza_ItemValue(name, value);
        DataFieldlist.push(field);
    }
    //Execute
    this.execute = function () {
        var classnm = this.package + "." + this.classname;
        var tmtype;
        if (this.tmtype == 0) {
            tmtype = "1";
        } else {
            tmtype = "0";
        }
        tmhandler = new oza_TMHandler(classnm, this.methodname, tmtype, this.delimiter, ozController1);
        tmhandler.returnlist(this.returnlist);
        for (var i = 0; i < DataFieldlist.length; i++) {
            tmhandler.setAddDataField(DataFieldlist[i].id, DataFieldlist[i].value);
        }
        tmhandler.execute(null, false);
        if (this.tmtype === 1) {
            collectionParser = new oza_CollectionParser();
            collectionParser.init(tmhandler.getResult());
        }  
    }
}


/*=================================================
   Report Handler
==================================================*/
function oza_ReportHandler() {
    var msql;
    var mfilterxml;
    var mdbname;
    var mcubename;
    var mreportinstance;
    var mreportozid;
    var merrormsg;    

    this.Create_ReportInstance = function (reportnm, reportozid, cubeozid) {
    }
    this.Create_ReportInstanceByPath = function (reportpath) {
        var reportozid;
        var cubeozid;

        reportozid = ozf_MetaTranslate(reportpath);
        if (ozf_StringIsEmpty(reportozid)) { return false; }

        cubeozid = get_CubeOZID(reportozid);
        if (ozf_StringIsEmpty(cubeozid)) { return false; }

        mreportinstance = get_ReportInstance(reportozid, cubeozid);
        if (mreportinstance === null) { return false; }
        mreportinstance.cubeozid = cubeozid;
        if (report_reference(mreportinstance, true) === false){
            return false;
        }
        return true;
    }

    //Get Cube OZID
    function get_CubeOZID(addr) {
        if (addr == "") { return; }
        addr = ozf_AddressXML(addr);        
        var metahandler1 = new oza_MetaHandler("Content", addr, "<List><Info option='standard'/></List>", true);
        if (oza_CheckMetaReturn(metahandler1.returncontent) == true) {
            var xmlDoc;
            xmlDoc = ozf_getXMLDoc(metahandler1.returncontent);
            var xele = xmlDoc.documentElement.childNodes[0];
            var cubeozid = xele.attributes.getNamedItem("cubeozid").value;
            return cubeozid;
        } else {           
            return "";
        }
    }
    //Get Report Instance
    function get_ReportInstance(reportOZID, cubeOZID) {
        var addr = ozf_AddressXML(reportOZID);        
        ret = ozf_OLAPHandler("ReportInstance", addr, "<List><ReportInstance/></List>")
        if (ozf_StringIsEmpty(ret)) { return null; }

        var xmlDoc;
        xmlDoc = ozf_getXMLDoc(ret);
        var xele = xmlDoc.documentElement.childNodes[0];
        var rinstance = new Object();
        rinstance.instanceid = xele.attributes.getNamedItem("instanceid").value;
        rinstance.reportozid = reportOZID;

        return instanceid;
    }
    //report reference
    function report_reference(rinstance, isincrease) {
        var option;
        if (isincrease) {
            option = "<List><Option increase='T'/></List>"
        } else {
            option = "<List><Option increase='F'/></List>"
        }
        var addr = ozf_AddressXMLWithInstanceID(rinstance.reportozid, rinstance.instanceid, rinstance.cubeozid);
        ret = ozf_OLAPHandler("ReportReference", addr, option)
        if (ozf_StringIsEmpty(ret)) { return false }
        return true;
    }

    this.Register_ReportInstance = function (reportaddr) {
    }
    this.UpdateReport = function (filterxml) {
    }
    this.PivotReport = function (pivotxml) {
        var addr = "<List><Item address='{0}' ozid='{0}' instanceid = '{1}' type='pivot'/></List>".format(mreportinstance.reportozid, mreportinstance.instanceid);
        ret = ozf_OLAPHandler("PivotContent", addr, pivotxml, true);
        if (ozf_StringIsEmpty(ret)) {
            return false;
        } else {
            return true;
        }        
    }
    this.Execute = function () {        
        var addr = ozf_AddressXMLWithInstanceID(mreportinstance.reportozid, mreportinstance.instanceid, mreportinstance.cubeozid);
        ret = ozf_OLAPHandler("ReportContent", addr, "<List><Option informationonly='T'/></List>", true);
        if (ozf_StringIsEmpty(ret)) {
            return false;
        } 
        var xmlDoc;
        xmlDoc = ozf_getXMLDoc(ret);
        var xele = xmlDoc.documentElement.childNodes[0];
        this.DBServerName = xele.attributes.getNamedItem("dbname").value;
        this.CubeName = xele.attributes.getNamedItem("dbname").value;

        var xsql = ozf_getSelectedSingleNode(xele, "ExecutionItems/Sql");
        if (xsql.childNodes.length > 0) {
            this.SQL = ozf_getInnerHTML(xsql.childNodes[0]);
        }        
        return true;
    }

    this.Execute_ReportContent = function () {
    }
    this.Get_ResultRecordCount = function () {
    }
    this.Report_ReferenceDown = function () {
        if (report_reference(mreportinstance, false) === false) {
            return false;
        }
        return true;
    }
    this.Report_Destory = function () {
        if (report_reference(mreportinstance, false) === false) {
            return false;
        }
        return true;
    }
    Object.defineProperty(this, 'SQL', {
        get: function () { return msql }
    });    
    Object.defineProperty(this, 'FilterXML', {
        get: function () { return mfilterxml }
    });    
    Object.defineProperty(this, 'DBServerName', {
        get: function () { return mdbname }
    });    
    Object.defineProperty(this, 'CubeName', {
        get: function () { return mdbname }
    });    
    Object.defineProperty(this, 'ReportInstanceID', {
        get: function () { return mreportinstanceid }
    });    
    Object.defineProperty(this, 'ErrorMessage', {
        get: function () { return merrormsg }
    });    
    Object.defineProperty(this, 'ReportOZID', {
        get: function () { return mreportozid }
    });    
}
/*=================================================
   TransactionModel Handler
==================================================*/
function oza_TMHandler(Classnm, Methodnm, TMType, Delim, ozController) {
    var Timeout = 0, MaxRows = -1;
    var ReturnInfo = "", culture = "ko-KR";
    var IsError = false, Errorcode = "", Errormessage = "", ErrorDesc = "", Message = "";
    var listelement = new Array;
    var DataFieldlist = new Array;
    var vColumnList = "", ResultData = "", Replacecolumnlist = "";
    var ResultDataXML = "";   //----- <List><Result ....   ></List>
    var ResultArray;
    var Inst = this;
    var Callbackfunc;
    var stopwatch = new ozf_Stopwatch();
    var ozController1 = ozController;
    this.ElementValue = function (id) {
        if (listelement.length == 0) { return ""; }
        for (var i = 0; i < listelement.length; i++) {
            if (listelement[i].id == id) {
                return listelement[i].value
            }
        }
        return "";
    }

    this.classname = function (val) { Classnm = val; }
    this.method = function (val) { Methodnm = val; }
    this.returnlist = function (val) { ReturnInfo = val; }
    this.delimiter = Delim;
    //Get Property
    this.getResultXML = function () { return ResultDataXML; }
    this.getResult = function () { return ResultData; }
    this.getResultArray = function () { return ResultArray; }
    this.getErrorcode = function () { return Errorcode; }
    this.getErrormessage = function () { return Errormessage; }
    this.getErrorDesc = function () { return ErrorDesc; }
    this.getMessage = function () { return Message; }
    this.getIsError = function () { return IsError; }
    this.getColumnList = function () { return vColumnList; }
    this.message='';
    //Set Property
    //0:Collection, 1:Element
    this.setTMType = function (val) { TMType = val; }
    this.getctlobj = function (inst) { return inst.ctlobj; }
    this.ctlobj;

    //Set Data Field
    this.setAddDataField = function (name, value) {
        var field;
        field = new oza_ItemValue(name, value);
        DataFieldlist.push(field);
    }

    //Replace Column Header
    this.setReplaceColumnList = function (collist, delim) {
        if (collist != null && delim != null) {
            Replacecolumnlist = collist.split(delim);
        }
    }
    
    //Initialize
    this.clear = function () {
        listelement = new Array();
        DataFieldlist = new Array();
        ResultArray = "";
        ReturnInfo = "";
        IsError = false;
        Errorcode = "";
        Errormessage = "";
        ErrorDesc = "";
        Message = "";
        ResultData = "";
        ResultDataXML = "";
        Inst = null;
        stopwatch = null;
        ozController1 = null;
        Callbackfunc = null;
        this.ctlobj = null;
    }

    //Check Inputs
    function checkInput() {
        if (Classnm == null) {
            alert("Class Name is Null")
            return false;
        }
        if (Methodnm == null) {
            alert("Method Name is Null")
            return false;
        }
        if (Delim == null) {
            alert("Delimiter is Null")
            return false;
        }
        return true;
    }

    this.TMOptionXML = function () {
        return TMOption();
    }

    // Make TMOption XML
    function TMOption() {
        var info = "";
        var logPara = "";
        info = info.concat("<List>");
        info = info.concat("<WorkflowOption servername='' grpname=''>");
        info = info.concat("<Type va='TransactionModel' returnencode='false' />");
        if (TMType == 0) {
            info = info.concat("<BeanInfo class='{0}' type='COLLECTION' methodname='{1}' from='' to='' maxrows='0' errormsg='1' culture='{2}' language='{2}'/>".format(Classnm, Methodnm, culture));
        }
        else {
            info = info.concat("<BeanInfo class='{0}' type='ELEMENT' methodname='{1}' from='' to='' maxrows='0' errormsg='1' culture='{2}' language='{2}'/>".format(Classnm, Methodnm, culture));
        }
        logPara =logPara.concat("{0}.{1}". format(Classnm, Methodnm));

        info = info.concat("<DataField>");

        if (DataFieldlist.length > 0) {
            for (var i = 0; i < DataFieldlist.length; i++) {
                info = info.concat("<Item na='{0}'><![CDATA[{1}]]></Item>".format(DataFieldlist[i].id, DataFieldlist[i].value));
                logPara = logPara.concat("{0}{1}{2}{3}".format(gVarLogParaDelimiterPara , DataFieldlist[i].id , gVarLogParaDelimiterValue , DataFieldlist[i].value));
            }
        }
        info = info.concat("<Item na='OBZDELIMITER'><![CDATA[{0}]]></Item>".format(Delim));
        info = info.concat("<Item na='TIMELIMIT'><![CDATA[{0}]]></Item>".format(Timeout));
        info = info.concat("<Item na='RETURN'><![CDATA[{0}]]></Item>".format(ReturnInfo));

        info = info.concat("</DataField>");

        info = info.concat("</WorkflowOption>");
        info = info.concat("</List>");

        if (ozController1 != null) {
            if (ozf_StringIsEmpty(ozController1.systemLogParameterInfo) == true) {
                ozController1.systemLogParameterInfo = ozController1.systemLogParameterInfo.concat(logPara);
            } else {
                ozController1.systemLogParameterInfo = ozController1.systemLogParameterInfo.concat(gVarLogParaDelimiterAction);
                ozController1.systemLogParameterInfo = ozController1.systemLogParameterInfo.concat(logPara);
            }
        }        
        return info;
    }
    //Execute
    this.execute = function doExecute(caller, asyncF) {
        if (checkInput() == false) { return; }
        if (asyncF == null) { asyncF = true; }
        Callbackfunc = caller;

        var info;
        info = TMOption();
        info = info.replace(/"/gi, '\\"');
        info = oza_GetServiceContent("workflow", "<List><Item address=''/></List>", info);

        if(sessionStorage.getItem("issecure") == "true"){
            info = AESEncrypt(info);
        }
        
        stopwatch.start();
        $.ajax({
            type: 'POST',
            url: urls,
            data: info,
            async: asyncF,
            headers: { "securetoken": sessionStorage.getItem("secure_token") },
            success: function (data, status) {
                stopwatch.stop();
                if (ozController1 != null) {
                    if (ozf_StringIsEmpty(ozController1.systemLogElapsedTimeInfo) == true) {
                        ozController1.systemLogElapsedTimeInfo = ozController1.systemLogElapsedTimeInfo.concat(stopwatch.time());
                    } else {
                        ozController1.systemLogElapsedTimeInfo = ozController1.systemLogElapsedTimeInfo.concat(gVarLogParaDelimiterAction);
                        ozController1.systemLogElapsedTimeInfo = ozController1.systemLogElapsedTimeInfo.concat(stopwatch.time());
                    }
                }
                oza_TMReceiveResult(data);
            },
            error: function (x, e) {
                stopwatch.stop();
                if (ozController1 != null) {
                    if (ozf_StringIsEmpty(ozController1.systemLogElapsedTimeInfo) == true) {
                        ozController1.systemLogElapsedTimeInfo = stopwatch.time();
                    } else {
                        ozController1.systemLogElapsedTimeInfo = ozController1.systemLogElapsedTimeInfo.concat(gVarLogParaDelimiterAction);
                        ozController1.systemLogElapsedTimeInfo = ozController1.systemLogElapsedTimeInfo.concat(stopwatch.time());
                    }
                }
                IsError = true;
                Errormessage = ajaxError(x, e);
                alert(Errormessage);
            }
        });
    }

    //Receive Result
    function oza_TMReceiveResult(content) {
        ResultData = "";

        var receivecontent;
        receivecontent = oza_GetReceiveContent(content);

        if (receivecontent.length == 0) {
            IsError = true;
        }
        else {
            IsError = false;
        }
        ResultData = receivecontent;

        if (IsError == true) {
            Errormessage = "";
            Errormessage = oza_GetErrorContent(receivecontent, Inst);
        }
        else {
            if (TMType == "0") {    //Collection
                if (Inst != undefined) {
                    if (Inst.getctlobj(Inst) != null) { //Have a CtlObj (Combo or Radio)
                        ResultArray = ParseArray(receivecontent);
                        Inst.ctlobj = null;
                    } else {
                        ResultData = ParseCollection(receivecontent);
                    }
                } else {
                    ResultData = ParseCollection(receivecontent);
                }
            }
            else {                  //Element
                listelement = ParseElement(receivecontent, Inst);
            }
        }
        if (Callbackfunc != null) {
            if (typeof Callbackfunc === "function") {
                Callbackfunc(Inst);
            }
        }
    }
}

//DataField
function oza_ItemValue(id, value) {
    this.id = id;
    this.value = value
}
/*=================================================
   Workflow Handler
==================================================*/
function oza_WorkFlowHandler() {
    var IsError = false;
    var DataFieldlist = new Array;

    var mVarIPExNum = "";
    var mVarExternal = "";
    var mVarMPAppID = "";
    var mVarIPAppID = "";
    var mVarProcessResourceName = "";
    var mVarResourceName = "";
    var mVarWorkFlowExec = "App";
    var mVarWorkFlowType = "";
    var mVarMAAppID = "";
    var mVarIAAppID = "";
    var mVarStatus = "";
    var mVarreceivecontent;

    this.getResult = function () { return mVarreceivecontent; }

    //Get Property
    Object.defineProperty(this, 'IPExNum', {
        get: function () { return mVarIPExNum },
        set: function (val) { mVarIPExNum = val; }
    });
    Object.defineProperty(this, 'External', {
        get: function () { return mVarExternal },
        set: function (val) { mVarExternal = val; }
    });
    Object.defineProperty(this, 'MPAppID', {
        get: function () { return mVarMPAppID },
        set: function (val) { mVarMPAppID = val; }
    });
    Object.defineProperty(this, 'IPAppID', {
        get: function () { return mVarIPAppID },
        set: function (val) { mVarIPAppID = val; }
    });
    Object.defineProperty(this, 'ProcessResourceName', {
        get: function () { return mVarProcessResourceName },
        set: function (val) { mVarProcessResourceName = val; }
    });
    Object.defineProperty(this, 'ResourceName', {
        get: function () { return mVarResourceName },
        set: function (val) { mVarResourceName = val; }
    });
    Object.defineProperty(this, 'WorkFlowExec', {
        get: function () { return mVarWorkFlowExec },
        set: function (val) { mVarWorkFlowExec = val; }
    });
    Object.defineProperty(this, 'WorkFlowType', {
        get: function () { return mVarWorkFlowType },
        set: function (val) { mVarWorkFlowType = val; }
    });
    Object.defineProperty(this, 'MAAppID', {
        get: function () { return mVarMAAppID },
        set: function (val) { mVarMAAppID = val; }
    });
    Object.defineProperty(this, 'IAAppID', {
        get: function () { return mVarIAAppID },
        set: function (val) { mVarIAAppID = val; }
    });
    Object.defineProperty(this, 'Status', {
        get: function () { return mVarStatus },
        set: function (val) { mVarStatus = val; }
    });
    //this.IPExNum = function (val) { mVarIPExNum = val; };
    //this.External = function (val) { mVarExternal = val; };
    //this.MPAppID = function (val) { mVarMPAppID = val; };
    //this.IPAppID = function (val) { mVarIPAppID = val; };
    //this.ProcessResourceName = function (val) { mVarProcessResourceName = val; };
    //this.ResourceName = function (val) { mVarResourceName = val; };
    //this.WorkFlowType = function (val) { mVarWorkFlowType = val; };
    //this.MAAppID = function (val) { mVarMAAppID = val; };
    //this.IAAppID = function (val) { mVarIAAppID = val; };
    //this.Status = function (val) { mVarStatus = val; };

    this.getIsError = function () {
        return IsError;
    }

    // Add Data Field
    this.Add_DataField = function (name, value) {
        var field;
        field = new oza_ItemValue(name, value);
        DataFieldlist.push(field);
    }

    // Check Input
    function checkInput() {
        //if (mVarMAAppID == "") {
        //    alert("MAAppID is Null")
        //    return false;
        //}
        if (mVarProcessResourceName == "") {
            alert("ProcessResourceName is Null")
            return false;
        }
        if (mVarStatus == "") {
            alert("Status is Null")
            return false;
        }
    }
    //Make TM XML
    function TMOption() {
        var info = "";
        info = info.concat("<List>");
        //info = info.concat("<Request method='getdata' purpose='workflow' tasktype='perform'>");
        //info = info.concat("<List><Item address=''/></List>");
        info = info.concat("<WorkflowOption>");
        info = info.concat("<Type va='WorkflowHandle'/>");
        info = info.concat("<WorkflowInfo exec='{0}' type='{1}'/>".format(mVarWorkFlowExec, mVarWorkFlowType));

        info = info.concat("<ID na='ProcessResource' va='{0}'/>".format(mVarProcessResourceName));
        info = info.concat("<ID na='MPAppID' va='{0}'/>".format(mVarMPAppID));
        info = info.concat("<ID na='IPAppID' va='{0}'/>".format(mVarIPAppID));

        if (mVarResourceName != "") {
            info = info.concat("<ID na='ResourceName' va='{0}'/>".format(mVarResourceName));
        }

        if (mVarMAAppID != "") {
            info = info.concat("<ID na='MAAppID' va='{0}'/>".format(mVarMAAppID));
        }
        if (mVarIAAppID != "") {
            info = info.concat("<ID na='IAAppID' va='{0}'/>".format(mVarIAAppID));
        }
        if (mVarIPExNum != "") {
            info = info.concat("<ID na='IPExNum' va='{0}'/>".format(mVarIPExNum));
        }
        if (mVarExternal != "") {
            info = info.concat("<ID na='External' va='{0}'/>".format(mVarExternal));
        }
        info = info.concat("<PARAM na='STATUS' va='{0}'/>".format(mVarStatus));

        info = info.concat("<DataField>");
        if (DataFieldlist.length > 0) {
            for (var i = 0; i < DataFieldlist.length; i++) {
                info = info.concat("<Item na='{0}'><![CDATA[{1}]]></Item>".format(DataFieldlist[i].id, DataFieldlist[i].value));
            }
        }
        info = info.concat("</DataField>");

        info = info.concat("</WorkflowOption>");
        //info = info.concat("</Request>");
        info = info.concat("</List>");

        return info;
    }

    //Execute    
    this.execute = function doExecute(caller, asyncF) {
        if (checkInput() == false) {
            return;
        }
        if (asyncF == null) {
            asyncF = true;
        }

        var info;
        info = TMOption();
        info = oza_GetServiceContent("workflow", "<List><Item address=''/></List>", info);
        console.log(info);

        if (sessionStorage.getItem("issecure") == "true") {
            info = AESEncrypt(info);
        }

        $.ajax({
            type: 'POST',
            url: urls,
            data: info,
            async: asyncF,
            headers: { "securetoken": sessionStorage.getItem("secure_token") },
            success: function (data, status) {
                mVarreceivecontent = "";
                oza_ReceiveResult(data);
            },
            error: function (x, e) {
                IsError = true;
                alert(ajaxError(x, e));
            }
        });
    }

    //Receive result
    function oza_ReceiveResult(content) {
        console.log(content);        
        mVarreceivecontent = oza_GetReceiveContent(content);
        if (oza_CheckReturn(mVarreceivecontent) == false) {
            IsError = true;
        }
        else {
            IsError = false;
        }
    }
}

/*=================================================
  WorkBoard Handler
==================================================*/
function oza_WbHandler() {
    var callinst = null; //Call Instance
    var cfunc = null;
    var returncontent = "";

    this.iserror = false;
    this.resultcontent = function () {
        return returncontent;
    }

    //Job
    this.purpose = null;
    this.address = null;
    this.content = null;

    // Execute Ajax
    this.execute = function doExecute(inst, caller, asyncF) {
        callinst = inst;
        if (this.purpose == null) {
            alert("purpose not defined")
            return false;
        }
        if (this.address == null) {
            alert("address not defined")
            return false;
        }
        if (this.content == null) {
            alert("content not defined")
            return false;
        }
        if (asyncF == null) {
            asyncF = false;
        }
        cfunc = caller;
        info = this.param(this.purpose.toLowerCase(), this.address, this.content);
        console.log(info);

        if(sessionStorage.getItem("issecure") == "true"){
            info = AESEncrypt(info);
        }

        //$.ajaxSetup({ async:false });
        $.ajax({
            type: 'POST',
            url: urls,
            data: info,
            async: asyncF,
            headers: { "securetoken": sessionStorage.getItem("secure_token") },
            success: function (data, status) {
                receiveresult(data);
            },
            error: function (x, e) {
                this.iserror = true;
                alert(ajaxError(x, e));
            }
        });
        //$.ajaxSetup({ async:true });
    }

    //Receive Result
    function receiveresult(content) {
        if (content == null) {
            returncontent = "";
        } else {
            if(sessionStorage.getItem("issecure") == "true") {
                if(!ozf_isJson(content)){
                    content = AESDecrypt(content);
                }
            }

            var jobj = JSON.parse(content);
            // if (jobj.status == "success" && jobj.resulttype == "xml") {
            if (jobj.success == true) {
                returncontent = jobj.result;
            }
            else {
                oza_Check_Connect(jobj['errorcode']);                
                returncontent = "";
            }
        }
        if (!oza_checkresult(returncontent)) {
            this.iserror = true;
        }
        else {
            this.iserror = false;
        }

        if (cfunc != null) {
            if (typeof cfunc === "function") {
                cfunc(callinst, returncontent, this.iserror);
            }
        }
    }
}

// Parse Result (Combo or Radio's Data)
function ParseArray(result) {
    var resultobj = JSON.parse(result)
    var vrow, vcol;
    var keyslist = [];
    var i, j, k, idx = 0;

    var datalist = resultobj['datalist'];

    vrow = datalist.length;
    for (var key in datalist[0]) {
        keyslist.push(key)
    }

    vcol = keyslist.length;

    var ResultArray = [];

    //배열 초기화
    for (j = 0; j < vcol; j++) {
        ResultArray[j] = [];
    }

    for (i = 0; i < vrow; i++) {
        for (j = 0; j < vcol; j++) {
            if (vcol == 1) {
                k = 0;
            } else {
                k = j;
            }
            ResultArray[k][i] = datalist[i][keyslist[j]];  //값, 코드 순으로
        }
    }
    return ResultArray;
}

// Parse Result When Type is 1 [Element]
function ParseElement(result, caller) {
    var resultobj = JSON.parse(result)
    var vrow, vcol;
    var keyslist = [];
    var i, j, idx = 0;
    var id, value;
    var field;
    var listelement = [];
    vrow = resultobj.item.length;
    for (var key in resultobj.item[0]) {
        keyslist.push(key)
    }
    vcol = keyslist.length;
    ResultArray = [];
    for (i = 0; i < vrow; i++) {
        id = resultobj.item[i][keyslist[0]];
        value = resultobj.item[i][keyslist[1]];

        switch (id) {
            case tmerrorname:
                caller.ErrorDesc = value;
                break;
            case tmitemerrorcode:
                caller.Errorcode = value;
                break;
            case tmitemmessagename:
                caller.Message = value;
                break;
            case tmerrormessagename:
                caller.Errormessage = value;
                break;
            default :
                field = new oza_ItemValue(id, value);
                listelement.push(field);
        }        
    }
    return listelement;
}

// Parse Result When Type is 0 [Collection]
function ParseCollection(xmlstr) {
    var resultobj = JSON.parse(xmlstr)
    return JSON.stringify(resultobj['datalist']);
}

//Get Service Content
function oza_GetServiceContent(purpose, address, content) {
    var ResultData;
    ResultData = '[{"service":"ecube"}, {"method":"getdata"},';
    ResultData = ResultData + '{"purpose":"' + purpose + '"},';
    ResultData = ResultData + '{"address":"' + address + '"},';
    ResultData = ResultData + '{"content":"' + content + '"}]';
    return ResultData;
}

function oza_GetServiceContentSet(purpose, address, content) {
    var ResultData;
    ResultData = '[{"service":"ecube"}, {"method":"setdata"},';
    ResultData = ResultData + '{"purpose":"' + purpose + '"},';
    ResultData = ResultData + '{"address":"' + address + '"},';
    ResultData = ResultData + '{"content":"' + content + '"}]';
    return ResultData;
}

//Get Content From Receive Message
function oza_GetReceiveContent(content) {
    if (content == null || content == "") {
        return "";
    }

    if(sessionStorage.getItem("issecure") == "true") {
        if(!ozf_isJson(content)){
            content = AESDecrypt(content);
        }
    }

    var jobj = JSON.parse(content);
    if (jobj['success'] == true) {
        return jobj['result'];
    }
    else {
        oza_Check_Connect(jobj['errorcode']);      
        return "";
    }
}
//Check Error
function oza_CheckReturn(content) {
    if (content == null) {
        return false;
    }
    var parser, xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(content, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlstr);
    }

    if (oza_IsParseError(xmlDoc)) {
        return false;
    }

    if (xmlDoc.documentElement.hasAttribute("errorcode")) {
        return false;
    }
    else {
        var i, found;
        var xerror;

        for (i = 0; i < xmlDoc.documentElement.childNodes.length; i++) {
            xerror = xmlDoc.documentElement.childNodes[i];
            if (xerror.attributes.getNamedItem("name") != null) {
                if (xerror.attributes.getNamedItem("name").value == tmerrorname) {
                    found = true;
                    break;
                }
            }
        } //next

        if (found == true) {
            if (xerror.innerText == null) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
}

//Get Error Message
function oza_GetErrorContent(content, caller) {
    if (content == null || content == "") {
        return "";
    }

    var parser, xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(content, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(content);
    }

    if (xmlDoc.documentElement.hasAttribute("errorcode")) {
        if (caller != null) {
            caller.Errormessage = xmlDoc.documentElement.attributes.getNamedItem("errormessage").value;
        }
        return xmlDoc.documentElement.attributes.getNamedItem("errormessage").value;
    }

    else {
        var i, found, isdecode;
        var xerror, info, erromessage;
        erromessage = "";

        for (i = 0; i < xmlDoc.documentElement.childNodes.length; i++) {
            xerror = xmlDoc.documentElement.childNodes[i];
            if (xerror.attributes.getNamedItem("name") != null) {
                if (xerror.attributes.getNamedItem("name").value == tmitemerrorcode) {
                    isdecode = true;
                    break;
                }
            }
        } //next

        for (i = 0; i < xmlDoc.documentElement.childNodes.length; i++) {
            xerror = xmlDoc.documentElement.childNodes[i];
            info = xerror.innerText;

            if (xerror.attributes.getNamedItem("name") != null) {
                switch (xerror.attributes.getNamedItem("name").value) {
                    case tmerrorname:
                        caller.ErrorDesc = info;
                        break;

                    case tmitemerrorcode:
                        caller.Errorcode = info;
                        break;

                    case tmitemmessagename:
                        erromessage = info;
                        caller.Message = info;
                        break;

                    case tmerrormessagename:
                        caller.Errormessage = info;
                        break;
                }
            }
        } //next
        return erromessage;
    }
}
//Check Result has Error
function oza_checkresult(content) {
    if (content == null) {
        return false;
    }
    var parser, xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(content, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(content);
    }

    if (oza_IsParseError(xmlDoc)) {
        return false;
    }

    if (xmlDoc.documentElement.hasAttribute("errorcode")) {
        return false;
    }
    else {
        return true;
    }
}

//Check XML Parse Error
function oza_IsParseError(parsedDocument) {
    return parsedDocument.getElementsByTagName("parsererror").length > 0;
};

//Receive Meta Result
function oza_CheckMetaReturn(XML) {
    if (XML == null) {
        return false;
    }
    if (XML == '') {
        return false;
    }
    var parser, xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(XML, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(XML);
    }

    if (oza_IsParseError(xmlDoc)) {
        return false;
    }

    if (xmlDoc.documentElement.hasAttribute("errorcode")) {
        return false;
    }
    else {
        return true;
    }
}

//Parse List Result XML
function oza_ParseListResult(xmlstr) {
    var xmlDoc, parser;
    var vDelim, vRow = 0, vCol = 0;
    var vColumnInfo;

    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlstr, "text/xml");
    }
    else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlstr);
    }

    var xResult = xmlDoc.documentElement.childNodes[0];

    if (xResult == null) {
        alert("Not Found Result XMLNode");
        return;
    }

    vDelim = xResult.attributes.getNamedItem("cdatadelimiter").value;
    vRow = xResult.attributes.getNamedItem("rowlabelcount").value;
    vCol = xResult.attributes.getNamedItem("columnlabelcount").value;
    if ((vRow + vCol) == 0) {
        alert("조회된 결과가 없습니다.");
    }

    var xColumnlabel;
    xColumnlabel = xResult.getElementsByTagName("ColumnLabelList")[0];
    vColumnInfo = xColumnlabel.textContent;
    vColumnInfo = oza_RemoveLastDelimiter(vColumnInfo, vDelim);

    var vColumnList;
    vColumnList = vColumnInfo.split(vDelim);
    if (vColumnList.length != vCol) {
        alert("조회된 결과의 칼럼 정보가 불일치 합니다.");
    }

    var xDataList, vDatalist;
    xDataList = xResult.getElementsByTagName("DataList")[0];
    vDatalist = xDataList.textContent;
    vDatalist = oza_RemoveLastDelimiter(vDatalist, vDelim);

    var ArrayData;
    ArrayData = vDatalist.split(vDelim);

    var i, j, idx = 0;
    var list = new Array();
    var item, Cname;

    for (i = 0; i < vRow; i++) {
        item = new Object();
        for (j = 0; j < vCol; j++) {
            Cname = vColumnList[j];
            item[Cname] = ArrayData[idx];
            idx = idx + 1;
        }
        list.push(item);
    }

    var myJsonString = JSON.stringify(list);
    return myJsonString;
}

//Remove Last Delimeter
function oza_RemoveLastDelimiter(liststr, delimiter) {
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

//Make Parameter
oza_WbHandler.prototype.param = function (p, a, c) {
    var ResultData;
    ResultData = '[{"service":"olap"}, {"method":"workboard"},';
    ResultData = ResultData + '{"purpose":"' + p + '"},';
    ResultData = ResultData + '{"address":"' + a + '"},';
    ResultData = ResultData + '{"content":"' + c + '"}]';
    return ResultData;
}
//Receive Result
function oza_ReceiveResult(inst, content) {
    inst.returncontent = oza_GetReceiveContent(content);
    if (!oza_checkresult(inst.returncontent)) {
        inst.iserror = true;
    }
    else {
        inst.iserror = false;
    }
    if (inst.cfunc != null) {
        if (typeof inst.cfunc === "function") {
            inst.cfunc(inst.callinst, inst.returncontent, inst.iserror, inst);
        }
    }
}

function ajaxError(x, e) {
    if (x.status === 0) {
        return 'Not connect. Please check your network.';
    } else if (x.status === 401) {
        return 'Session Request Error.' + x.status + " " + x.responseText;
    } else if (x.status == 404) {
        return 'Requested page not found. [404]';
    } else if (x.status == 500) {
        return 'Internal Server Error [500].';
    } else if (e === 'parsererror') {
        return 'Parsing JSON Request failed.';
    } else if (e === 'timeout') {
        return 'Request Time out.';
    } else if (e === 'abort') {
        return 'Ajax request aborted.';
    } else {
        location.href = baseurl + "dptest/dp/obzenDP.html";
        return "Unknow Error: " + x.status + " " + x.responseText;
    }
}

/*=================================================
* Security
==================================================*/
/*--------------------------------------------------
  Secure Server Connect
----------------------------------------------------*/
//Get Secure Mode
function secureConnector() {
    var secure_yn = false;
    var error_yn = false;
    var securetoken = "";
    var publicKeyModulus = "";
    var publicKeyExponent = "";
    var __config;
    var service = "";
    var method = "";
    var item_names = "";
    var item_values = "";
    var arrItems;
    var arrValues;
    var e_message = "";
    var message = "";

    this.secure_yn = false;
    this.securetoken = "";
    this.publicKeyModulus = "";
    this.publicKeyExponent = "";

    this.synchronize = function () {
        var info = this.getConfigRequest();
        $.ajax({
            type: 'POST',
            url: baseurl + "/rest/securetoken",
            data: info,
            async: false,
            success: function (result, status) {
                setSynchronizeConfig(result);
            },
            error: function (x, e) {
                error_yn = true;
                if (x.status === 0) {
                    console.log('Not connect. Please check your network.');
                    console.log(x.status + " - " + x.responseText);
                } else if (x.status == 404) {
                    console.log('Requested page not found. [404]');
                    console.log(x.status + " - " + x.responseText);
                } else if (x.status == 500) {
                    console.log('Internal Server Error [500].');
                    console.log(x.status + " - " + x.responseText);
                } else if (e === 'parsererror') {
                    console.log('Parsing JSON Request failed.');
                    console.log(x.status + " - " + x.responseText);
                } else if (e === 'timeout') {
                    console.log('Request Time out.');
                    console.log(x.status + " - " + x.responseText);
                } else if (e === 'abort') {
                    console.log('Ajax request aborted.');
                    console.log(x.status + " - " + x.responseText);
                } else {
                    console.log("Unknow Error: " + x.status + " " + x.responseText);
                    console.log(x.status + " - " + x.responseText);
                }
            }
        });
        //Set Secure Token & Key
        function setSynchronizeConfig(result) {
            var rsa = new RSAFacade();
            rsa.setPubKey(sessionStorage.getItem("pub"), sessionStorage.getItem("exp"));
            rsa.setPriKey(sessionStorage.getItem("pri"));
            sessionStorage.removeItem("pub");
            sessionStorage.removeItem("pri");
            sessionStorage.removeItem("exp");
            var data = JSON.parse(result);
            if (data.success == true) {
                if(data.securetoken == "inactive") {
                    return;
                }
                securetoken = rsa.decrypt(data.securetoken);
                publicKeyModulus = data.publicKeyModulus;
                publicKeyExponent = rsa.decrypt(data.publicKeyExponent);
                if (securetoken != "" && securetoken != undefined) {
                    secure_yn = true;
                }
            } else {
                if(jobj['errorcode'] == "8a040000"){
                    alert("로그인에 실패했습니다. 다시 시도해주십시오.");
                } else {
                    alert("로그인에 실패했습니다. 관리자에게 문의해주십시오.\nErrorCode : " + jobj['errorcode']);
                }
                return;
                //alert("warring status:" + data.success);
            }
        }
    }
    //Make Json to Get Secure Keys & SecureToken
    this.getConfigRequest = function(){
        return '[{"service":"ecube"}, {"method":"create"}, {"key":"'+ sessionStorage.getItem("pub") +'"}, {"exp":"'+ sessionStorage.getItem("exp").toString() +'"}]';
    }
    //Get Secure Mode
    this.isSecure =function(){
        return secure_yn;
    }
    //Get Configuration
    this.config = function(){
        return config_private;
    }
    //Set Service
    this.setService  = function(service){
        this.service = service;
    }
    //Set Method
    this.setMethod =function(method){
        this.method = method;
    }
    //Add Item
    this.additem = function(name,value){
        if(this.item_names!=""){
            this.item_names = this.item_names +"@@$"+name;
            this.item_values = this.item_values +"@@$"+value;
        }else{
            this.item_names = name;
            this.item_values = value;
        }
    }
    //Logon When Secure Mode Is True
    this.commit =function(){
        //1. 전문생성
        var createtext = '[{"service":"'+this.service+'"}, {"method":"'+this.method+'"}';
        arrItems = this.item_names.split("@@$");
        arrValues = this.item_values.split("@@$");
        for(var i = 0;i<arrItems.length;i++){
            if(arrItems[i]==undefined ||arrItems[i]==null || arrItems[i]=="undefined"){
            }else{
                createtext = createtext + ',{"'+arrItems[i]+'":"' + arrValues[i] + '"}'
            }
        }
        createtext = createtext + "]";
        //2. 전문실행
        $.ajax({
            type: 'POST',
            url: urlLogon,
            headers : {"securetoken" : securetoken},
            data: createtext,
            async: false,
            success: function (data, status) {
                //3. 결과저장
                message=data;
                error_yn = false;
            },
            error: function (x, e) {
                error_yn = true;
                if (x.status === 0) {
                    e_message = 'Not connect. Please check your network.';
                } else if (x.status == 404) {
                    e_message = 'Requested page not found. [404]';
                } else if (x.status == 500) {
                    e_message = 'Internal Server Error [500].';
                } else if (e === 'parsererror') {
                    e_message = 'Parsing JSON Request failed.';
                } else if (e === 'timeout') {
                    e_message = 'Request Time out.';
                } else if (e === 'abort') {
                    e_message = 'Ajax request aborted.';
                } else {
                    e_message = "Unknow Error: " + x.status + " " + x.responseText;
                }
            }
        });
    }
    //Get Message
    this.getMessage = function(){
        return message;
    }
    //Get Error_YN
    this.isError =function(){
        return error_yn;
    }
    //Get Error Message
    this.getErrorMessage = function(){
        return e_message;
    }

    /*--------------------------------------------------
      Configuration
    ----------------------------------------------------*/
    var __config = function(){
};
__config.prototype = {
        getPKeyM : function(){
            return publicKeyModulus;
        },
        getPKeyE : function(){
            return publicKeyExponent;
        },
        getToken : function(){
            return securetoken;
        },
        isSecure:function(){
            return secure_yn;
        },
        setPKeyM : function(Key){
            publicKeyModulus = Key;
        },
        setPKeyE : function(Key){
            publicKeyExponent = Key;
        },
        setSecure : function(bool){
            secure_yn = bool;
        }

};
var config_private = new __config();
}

/*--------------------------------------------------
  AES-facade
----------------------------------------------------*/
var AESFacade = function () {
    var SecretKey = "";//
    var SecretKey64 = "";//
    var __data = "";
    var ciphertext = ""; //enc
    var decrypted = ""; //dec   
    var isCustomKey = false;
    var __bit = "";
};
AESFacade.prototype = {
    setKey: function (_SecretKey) {
        this.SecretKey = _SecretKey;
        this.SecretKey64 = CryptoJS.enc.Base64.parse(_SecretKey);
    },
    encrypt: function (data) {
        var ctext = CryptoJS.AES.encrypt(data, this.SecretKey64, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        //console.log("ctext.ciphertext==>"+ctext.ciphertext);  
        this.ciphertext = CryptoJS.enc.Base64.stringify(ctext.ciphertext);
        return this.ciphertext;
    },
    decrypt: function (data, encodetype) {
        var words = CryptoJS.AES.decrypt(data, this.SecretKey64, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        if (encodetype == "utf-8") {
            //decrypted=words.toString(CryptoJS.enc.Utf8)); 
            this.decrypted = CryptoJS.enc.Utf8.stringify(words);
        } else if (encodetype == "utf-16") {
            this.decrypted = CryptoJS.enc.Utf16.stringify(words);
        } else if (encodetype == "hex") {
            this.decrypted = CryptoJS.enc.Hex.stringify(words);
        } else if (encodetype == "Base64") {
            this.decrypted = CryptoJS.enc.Base64.stringify(words);
        } else if (encodetype == "lt") {
            this.decrypted = CryptoJS.enc.Latin1.stringify(words);
        } else {
            this.decrypted = words.toString(CryptoJS.enc.Utf8);
        }
        return this.decrypted;
    },
    getKey: function () {
        return this.SecretKey;
    },
    getKey64: function () {
        return this.SecretKey64;
    }
};

/*--------------------------------------------------
  RSA-facade
----------------------------------------------------*/
var RSAFacade = function () {
    var PubKeyM = "";//Moudulus(hex)
    var PubKeyE = "";//Public exponent (ehx,F4==0x10001)
    var PriKey = "";//Private exponent(hex)

    var P = "";//P(hex)
    var Q = "";//1(hex)
    var DP = "";//D mod (P-1) (hex)
    var DQ = "";//D mod (Q-1) P(hex)
    var QM = "";//1/Q mod P(hex)

    var __data = "";
    var ciphertext = ""; //enc
    var decrypted = ""; //dec   
    var isCustomKey = false;
    var __bit = "";
};
RSAFacade.prototype = {
    generate: function (bit, publicKeyExpoent) {
        var before = new Date();
        var rsa = new RSAKey();
        this.timelog("Generating RSA Key...");
        this.__bit = bit;
        rsa.generate(bit, publicKeyExpoent);

        this.PubKeyM = rsa.n.toString(16);
        this.PubKeyE = publicKeyExpoent;
        this.PriKey = rsa.d.toString(16);
        this.P = rsa.p.toString(16);
        this.Q = rsa.q.toString(16);
        this.DP = rsa.dmp1.toString(16);
        this.DQ = rsa.dmq1.toString(16);
        this.QM = rsa.coeff.toString(16);
        var after = new Date();
        this.isCustomKey = false;
        this.timelog("Key Generation Time: " + (after - before) + "ms");
    },

    encrypt: function (data) {
        __data = data;
        var before = new Date();
        var rsa = new RSAKey();
        rsa.setPublic(this.PubKeyM, this.PubKeyE);
        var res = rsa.encrypt(data);
        var after = new Date();
        if (res) {
            //ciphertext = linebrk(res, 64);
            this.ciphertext = res;
            this.timelog("ciphertext==>" + this.ciphertext);
            this.decrypted = "";
            this.timelog("Encryption Time: " + (after - before) + "ms");
        } else {
            this.timelog("Encryption Fail==>" + this.ciphertext);
        }
        return this.ciphertext;
    },
    setPubKey: function (PKeyM_Item, PKeyE_Item) {
        this.isCustomKey = true;
        this.PubKeyM = PKeyM_Item;
        this.PubKeyE = PKeyE_Item;
    },
    setPriKey: function (PriKey_Item) {
        this.isCustomKey = true;
        this.PriKey = PriKey_Item;
    },
    setKey: function (PKeyM_Item, PKeyE_Item, PriKey_Item) {
        this.isCustomKey = true;
        this.PubKeyM = PKeyM_Item;
        this.PubKeyE = PKeyE_Item;
        this.PriKey = PriKey_Item;
    },


    decrypt: function (data) {
        this.timelog("Decrypting...");
        var before = new Date();
        var rsa = new RSAKey();

        if (this.isCustomKey) {
            rsa.setPrivate(this.PubKeyM, this.PubKeyE, this.PriKey);
        } else {
            rsa.setPrivateEx(this.PubKeyM, this.PubKeyE, this.PriKey, this.P, this.Q, this.DP, this.DQ, this.QM);
        }

        var res = rsa.decrypt(data);
        var after = new Date();
        if (res == null) {
            this.decrypted = "*** Invalid Ciphertext ***";
            this.timelog("Decryption failed");
        }
        else {
            this.decrypted = res;
            this.timelog("Decryption Time: " + (after - before) + "ms");
        }
        return this.decrypted;
    },
    getPubKeyM: function () {
        return this.PubKeyM;
    },
    getPubKeyE: function () {
        return this.PubKeyE;
    },
    getPriKey: function () {
        return this.PriKey;
    },

    timelog: function (logtext) {
        //console.log(logtext);
    },
    set_512e3: function () {
        this.PubKeyM = "BC86E3DC782C446EE756B874ACECF2A115E613021EAF1ED5EF295BEC2BED899D26FE2EC896BF9DE84FE381AF67A7B7CBB48D85235E72AB595ABF8FE840D5F8DB";
        this.PubKeyE = "3";
        this.PriKey = "7daf4292fac82d9f44e47af87348a1c0b9440cac1474bf394a1b929d729e5bbcf402f29a9300e11b478c091f7e5dacd3f8edae2effe3164d7e0eeada87ee817b";
        this.P = "ef3fc61e21867a900e01ee4b1ba69f5403274ed27656da03ed88d7902cce693f";
        this.Q = "c9b9fcc298b7d1af568f85b50e749539bc01b10a68472fe1302058104821cd65";
        this.DP = "9f7fd9696baefc6009569edcbd19bf8d576f89e1a439e6ad4905e50ac8899b7f";
        this.DQ = "867bfdd7107a8bca39b503ce09a30e267d567606f02f7540cac03ab5856bde43";
        this.QM = "412d6b551d93ee1bd7dccafc63d7a6d031fc66035ecc630ddf75f949a378cd9d";
    },
    set_512f4: function () {
        this.PubKeyM = "C4E3F7212602E1E396C0B6623CF11D26204ACE3E7D26685E037AD2507DCE82FC28F2D5F8A67FC3AFAB89A6D818D1F4C28CFA548418BD9F8E7426789A67E73E41";
        this.PubKeyE = "10001";
        this.PriKey = "7cd1745aec69096129b1f42da52ac9eae0afebbe0bc2ec89253598dcf454960e3e5e4ec9f8c87202b986601dd167253ee3fb3fa047e14f1dfd5ccd37e931b29d";
        this.P = "f0e4dd1eac5622bd3932860fc749bbc48662edabdf3d2826059acc0251ac0d3b";
        this.Q = "d13cb38fbcd06ee9bca330b4000b3dae5dae12b27e5173e4d888c325cda61ab3";
        this.DP = "b3d5571197fc31b0eb6b4153b425e24c033b054d22b9c8282254fe69d8c8c593";
        this.DQ = "968ffe89e50d7b72585a79b65cfdb9c1da0963cceb56c3759e57334de5a0ac3f";
        this.QM = "d9bc4f420e93adad9f007d0e5744c2fe051c9ed9d3c9b65f439a18e13d6e3908";
    },
    set_1024e3: function () {
        this.PubKeyM = "ABC30681295774F7CECA691EC17F4E762DA6DE70F198EAEE3CCE3A435FC006B971DC24E55904F1D2705758C041C2B0B18E8BFAE2C9CD96B50082D7D8C7342CBAB7F6E0622DA53B8B56DBDB24174F00173263CFECAE604795CDA2A037BC3A69B7C0090AA2DE1568998BCD6D70CC2E0574755B9F7986AE01CE8714A26144279CDB";
        this.PubKeyE = "3"
        this.PriKey = "728204561b8fa34fdf319b69d654def973c4944b4bbb47497dded1823fd559d0f692c34390adf68c4ae4e5d5812c75cbb45d51ec86890f2355ac8fe5da22c87b62449e2aa754422bc43d3ca32efa866227ad58178e7803897d074f1312740aa761cfc7ed753bb829d7a2ab091289d1676809bfd61276b43bb3a395714f167beb";
        this.P = "e200731c6e934a0fdc1d5ce5f66d08ba9478280f46e9cbed777029dd4811a7cd4aa66ad8365c5aa67b06b97e54ee8fec03adb2134f7359a427c7ffc468ef0231";
        this.Q = "c28f8005c4138e39d462a3495a6a2dc96267a3ba11c2765a1aa77fbdd87ab1ef62aaf3e677df79b44d52b364db70bb6d559f4da51b8899d0d1d74272e496e0cb";
        this.DP = "96aaf76849b786b53d68e8994ef35b270da5700a2f4687f3a4f5713e300bc53387199c90243d91c452047ba98df45ff2ad1e76b78a4ce66d6fdaaa82f09f56cb";
        this.DQ = "81b50003d80d097be2ec6cdb919c1e86419a6d26b681a43c11c4ffd3e5a7214a41c74d444fea5122de3722433cf5d248e3bf8918bd05bbe08be4d6f7430f4087";
        this.QM = "a318fb95d3b10d6cfb0096fc3a3173377cf0952bf5d50fd3ccf678dd636ca1a1aeed8da416c8fba4395b00dc3e22823d1b2add8a4e1222d562af11bd6c78ad94";
    },
    set_1024f4: function () {
        this.PubKeyM = "a5261939975948bb7a58dffe5ff54e65f0498f9175f5a09288810b8975871e99af3b5dd94057b0fc07535f5f97444504fa35169d461d0d30cf0192e307727c065168c788771c561a9400fb49175e9e6aa4e23fe11af69e9412dd23b0cb6684c4c2429bce139e848ab26d0829073351f4acd36074eafd036a5eb83359d2a698d3";
        this.PubKeyE = "10001";
        this.PriKey = "8e9912f6d3645894e8d38cb58c0db81ff516cf4c7e5a14c7f1eddb1459d2cded4d8d293fc97aee6aefb861859c8b6a3d1dfe710463e1f9ddc72048c09751971c4a580aa51eb523357a3cc48d31cfad1d4a165066ed92d4748fb6571211da5cb14bc11b6e2df7c1a559e6d5ac1cd5c94703a22891464fba23d0d965086277a161";
        this.P = "d090ce58a92c75233a6486cb0a9209bf3583b64f540c76f5294bb97d285eed33aec220bde14b2417951178ac152ceab6da7090905b478195498b352048f15e7d";
        this.Q = "cab575dc652bb66df15a0359609d51d1db184750c00c6698b90ef3465c99655103edbf0d54c56aec0ce3c4d22592338092a126a0cc49f65a4a30d222b411e58f";
        this.DP = "1a24bca8e273df2f0e47c199bbf678604e7df7215480c77c8db39f49b000ce2cf7500038acfff5433b7d582a01f1826e6f4d42e1c57f5e1fef7b12aabc59fd25";
        this.DQ = "3d06982efbbe47339e1f6d36b1216b8a741d410b0c662f54f7118b27b9a4ec9d914337eb39841d8666f3034408cf94f5b62f11c402fc994fe15a05493150d9fd";
        this.QM = "3a3e731acd8960b7ff9eb81a7ff93bd1cfa74cbd56987db58b4594fb09c09084db1734c8143f98b602b981aaa9243ca28deb69b5b280ee8dcee0fd2625e53250";
    },
    generateL: function (bit, publicKeyExpoent) {
        var before = new Date();
        this.timelog("Light Generating RSA Key...");
        this.__bit = bit;

        if (bit == 512) {
            this.PubKeyM = "C4E3F7212602E1E396C0B6623CF11D26204ACE3E7D26685E037AD2507DCE82FC28F2D5F8A67FC3AFAB89A6D818D1F4C28CFA548418BD9F8E7426789A67E73E41";
            this.PubKeyE = publicKeyExpoent;
            this.PriKey = "7cd1745aec69096129b1f42da52ac9eae0afebbe0bc2ec89253598dcf454960e3e5e4ec9f8c87202b986601dd167253ee3fb3fa047e14f1dfd5ccd37e931b29d";
            this.P = "f0e4dd1eac5622bd3932860fc749bbc48662edabdf3d2826059acc0251ac0d3b";
            this.Q = "d13cb38fbcd06ee9bca330b4000b3dae5dae12b27e5173e4d888c325cda61ab3";
            this.DP = "b3d5571197fc31b0eb6b4153b425e24c033b054d22b9c8282254fe69d8c8c593";
            this.DQ = "968ffe89e50d7b72585a79b65cfdb9c1da0963cceb56c3759e57334de5a0ac3f";
            this.QM = "d9bc4f420e93adad9f007d0e5744c2fe051c9ed9d3c9b65f439a18e13d6e3908";
        } else if (bit == 1024) {
            this.PubKeyM = "a5261939975948bb7a58dffe5ff54e65f0498f9175f5a09288810b8975871e99af3b5dd94057b0fc07535f5f97444504fa35169d461d0d30cf0192e307727c065168c788771c561a9400fb49175e9e6aa4e23fe11af69e9412dd23b0cb6684c4c2429bce139e848ab26d0829073351f4acd36074eafd036a5eb83359d2a698d3";
            this.PubKeyE = publicKeyExpoent;
            this.PriKey = "8e9912f6d3645894e8d38cb58c0db81ff516cf4c7e5a14c7f1eddb1459d2cded4d8d293fc97aee6aefb861859c8b6a3d1dfe710463e1f9ddc72048c09751971c4a580aa51eb523357a3cc48d31cfad1d4a165066ed92d4748fb6571211da5cb14bc11b6e2df7c1a559e6d5ac1cd5c94703a22891464fba23d0d965086277a161";
            this.P = "d090ce58a92c75233a6486cb0a9209bf3583b64f540c76f5294bb97d285eed33aec220bde14b2417951178ac152ceab6da7090905b478195498b352048f15e7d";
            this.Q = "cab575dc652bb66df15a0359609d51d1db184750c00c6698b90ef3465c99655103edbf0d54c56aec0ce3c4d22592338092a126a0cc49f65a4a30d222b411e58f";
            this.DP = "1a24bca8e273df2f0e47c199bbf678604e7df7215480c77c8db39f49b000ce2cf7500038acfff5433b7d582a01f1826e6f4d42e1c57f5e1fef7b12aabc59fd25";
            this.DQ = "3d06982efbbe47339e1f6d36b1216b8a741d410b0c662f54f7118b27b9a4ec9d914337eb39841d8666f3034408cf94f5b62f11c402fc994fe15a05493150d9fd";
            this.QM = "3a3e731acd8960b7ff9eb81a7ff93bd1cfa74cbd56987db58b4594fb09c09084db1734c8143f98b602b981aaa9243ca28deb69b5b280ee8dcee0fd2625e53250";
        }
        var after = new Date();
        this.isCustomKey = false;
        this.timelog("Light Generating RSA Key Generation Time: " + (after - before) + "ms");
    }
};

//AES 암호화
function AESEncrypt(info){
    var aes = new AESFacade();
    aes.setKey(sessionStorage.getItem("secret_key"));
    return aes.encrypt(info);
}

//AES 복호화
function AESDecrypt(content){
    var aes = new AESFacade();
    aes.setKey(sessionStorage.getItem("secret_key"));
    var de =  aes.decrypt(content);
    return de;
}


/**
 * @description Check Connection Status
 * @param errorcode
 * @returns
 */
function oza_Check_Connect(errorcode) {
    if (errorcode == "8a040002") {
        if(sessionCloseCnt == 1) alert("세션이 만료되었습니다. 다시 로그인 해주십시오.");
        window.open('about:blank','_parent').self.close();
        sessionCloseCnt++;
        return true;
    } else if (errorcode == "8a040001") {
        alert("로그인이 되어 있지 않습니다. 다시 로그인 해주십시오.");
        window.open('about:blank','_parent').self.close();
        return true;
    }
    return false;
}

