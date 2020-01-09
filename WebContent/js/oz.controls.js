var gVarLogParaDelimiterAction = "[@]";
var gVarLogParaDelimiterPara = "[#]";
var gVarLogParaDelimiterValue  = "[!]";
var gVarDialogHeaderHeight = 60;
/*--------------------------------------------------
  현재 페이지의 기본 정보
----------------------------------------------------*/
/**
 * @description 화면의 컨트롤을 관리하고 부가 정보를 제공하는 컨트롤이다.
 */
function oz_frame() {    
    this.ExitEvent; //액션(Execute_Script)에서 여러 스크립트를 수행 할 경우 경우에 따라 더 이상 스크립트를 수행하지 않고 액션을 종료 할 경우 True로 설정 하면 된다.        
    this.CancelClosing; //화면 닫을 지 여부를 스크립트에서 지정 한다. True일 경우 화면을 닫지 않는다.    
    this.FocusCtlName; //스크립트 종료 후 포커스를 설정할 컨트롤 이름을 지정한다.    
    this.ServerDate; //서버 날짜시간(yyyyMMddHHmmss) 을 반환한다.
    this.Addr; //화면 주소

    this.CultureInfo = '@System.Globalization.CultureInfo.CurrentCulture.Name';
    this.UserID = ""; //접속자 정보
    this.UserName = "";
    this.GroupName;
    this.GroupDescription;
    this.FrameName;
    this.FrameDesc;
    this.FrameInstanceOZID;
    this.ParentKey;
    this.DialogReturnKey;
    this.isdialog;
    this.ResizableDialogFrame;
    this.timerInterval = 5000; //timer event 수행 주기
    this.ParentFramePlayer = null;
    this.systemLogParameterInfo = null;
    this.systemLogElapsedTimeInfo = null;
    this.selector = ""; //서버 식별자
    this.localtemppath = ''; //로컬 Temporary 경로 (가능 할까?)

 	this.controlsplashmode = false;  //control에서 스플레시 제어 여부
 		
    this.defaultwidth; //기본 너비
    this.defaultheight; //기본 높이

    this.LogParaDelimiterAction = gVarLogParaDelimiterAction;
    this.LogParaDelimiterPara = gVarLogParaDelimiterPara;
    this.LogParaDelimiterValue = gVarLogParaDelimiterValue;

    this.Ctllist = []; //컨트롤 목록
    this.varCtllist = new ozf_Collection(); //컨트롤 중 데이터 소스를 지정한 목록
    this.varVarlist = new ozf_Collection(); //변수 중 데이터 소스를 지정한 목록
   
    this.bodyFrame; //프레임을 div 객체
    this.isWeb = true;
    var winobj;
    var mVarAsyncCount;
    var mVarMsgTitle;
    var mVarRaiseEventControl;
    var mVarRaiseEventName; 
    
    //이벤트 발생 컨트롤
    Object.defineProperty(this, 'RaiseEventControl', {
        get: function () {
            return mVarRaiseEventControl;
        },
        set: function (val) {
            mVarRaiseEventControl = val;
        }
    });

    //이벤트 이름
    Object.defineProperty(this, 'RaiseEventName', {
        get: function () {
            return mVarRaiseEventName;
        },
        set: function (val) {
            mVarRaiseEventName = val;
        }
    });

    //TM 호출시 Async mode로 수행하는 작업 수( StartAsync EndAsync 사이에 존재하는 작업 개수)
    Object.defineProperty(this, 'AsyncCount', {
        get: function () {
            return mVarAsyncCount;
        },
        set: function (val) {
            mVarAsyncCount = val;
        }
    });

    //메세지 박스 타이틀
    Object.defineProperty(this, 'messageTitle', {
        get: function () {
            return mVarMsgTitle;
        },
        set: function (val) {
            mVarMsgTitle = val;
        }
    });

    //프레임 객체의 높이
    Object.defineProperty(this, 'Height', {
        get: function () {
            this.bodyFrame.css('height');
            //return $('#ozbodyframe').css('height');
        },
        set: function (val) {
            this.bodyFrame.css('height', val);
            //$('#ozbodyframe').css('height', val);
        }
    });
    
    this.hideFrame = function (isembed) {
        this.bodyFrame.css('opacity', '0');
    }
    this.showFrame = function () {
        this.bodyFrame.css('opacity', '1');
    }

    /*--------------------------------------------------
    기능   : 기본 정보 초기화
    참고 : 서버 날짜와 시간 가져오기
               EMS 메인을 찾아서 접속자 정보 초기화
   ----------------------------------------------------*/
    this.Init = function Init(win) {
    	
    	
        //Get Server Date-Time
        var sDate = ozf_GetServerDateTimeHMS();
        sDate = ozf_ReplaceString(sDate, "-", "");
        sDate = ozf_ReplaceString(sDate, ":", "");
        sDate = ozf_ReplaceString(sDate, " ", "");
        this.ServerDate = sDate;

        if (this.Addr != '') {
            this.FrameName = ozf_GetNameFromAddr(this.Addr);
        }

        //Find Root EMS Main
        if (this.ParentFramePlayer != null) { //Dialog or embeded
            winobj = this.ParentFramePlayer.getRefMain();
            this.UserID = winobj.gUser();
            var info = winobj.GetUserInfo();
            if (info != "") {
                var list = info.split(";");
                this.UserName = list[0];
                this.GroupName = list[1];
                this.GroupDescription = list[2];
            }
        } else if (win != undefined) {
            winobj = gRefMain(win);
            this.UserID = winobj.gUser();
            var info = winobj.GetUserInfo();
            if (info != "") {
                var list = info.split(";");
                this.UserName = list[0];
                this.GroupName = list[1];
                this.GroupDescription = list[2];
            }
        }
    }

   /*--------------------------------------------------
    기능   : EMS 메인을 찾아서 접속자 정보 초기화
    참고 : OpenDialog 인 경우에 외부에서 부모 html을 설정 하고 호출되는 함수
   ----------------------------------------------------*/    
    this.refreshParent = function () {
        if (this.ParentFramePlayer != null) {
            winobj = this.ParentFramePlayer.getRefMain();
            this.UserID = winobj.gUser();
            var info = winobj.GetUserInfo();
            if (info != "") {
                var list = info.split(";");
                this.UserName = list[0];
                this.GroupName = list[1];
                this.GroupDescription = list[2];
            }
        } else if (win != undefined) {
            winobj = gRefMain(win);
            this.UserID = winobj.gUser();
            var info = winobj.GetUserInfo();
            if (info != "") {
                var list = info.split(";");
                this.UserName = list[0];
                this.GroupName = list[1];
                this.GroupDescription = list[2];
            }
        }
    }

    /*--------------------------------------------------
    기능   : 윈도우 객체 반환
    ----------------------------------------------------*/
    this.getRefMain = function () {
        return winobj;
    }

        

    this.checkAuthority = function (auth) {

    }

    /*--------------------------------------------------
    기능 :  모든 자원 반납
    ----------------------------------------------------*/
    this.dispose = function () {
        this.FocusCtlName = null;
        this.ServerDate = null;
        this.Addr = null;

        this.CultureInfo = null;
        this.UserID = null;
        this.UserName = null;
        this.GroupName = null;
        this.GroupDescription = null;
        this.FrameName = null;
        this.FrameDesc = null;
        this.FrameInstanceOZID = null;
        this.ParentKey = null;
        this.DialogReturnKey = null;
        this.ParentFramePlayer = null;
        this.systemLogParameterInfo = null;
        this.systemLogElapsedTimeInfo = null;
        this.selector = null;
        this.localtemppath = null; 
        
        this.LogParaDelimiterAction = null;
        this.LogParaDelimiterPara = null;
        this.LogParaDelimiterValue = null;

        this.Ctllist = [];

        var i;
        var ctl;
        var cnt = this.varCtllist.Count();
        for (i = 0; i < cnt; i++) {
            ctl = this.varCtllist.ItemByIndex(i);
            if (typeof ctl.dispose === "function") {
                ctl.dispose();
            }
        }

        this.varCtllist.clear();
        this.varVarlist.clear();
    }

   /*--------------------------------------------------
    기능   : 다이얼로그 리턴 값 전달
    INPUT  : para: 파라미터
             varreturn: 리턴 목록(통상적으로 배열)
    RETURN : 
    ----------------------------------------------------*/
    this.setValueToReturn = function (para, varreturn) {
        if (para.id == "$parentkey$") {
            return;
        }
        var j,
            id,
            ctl,
            retitem;
        var retcnt = varreturn.length;
        var valcnt = this.varVarlist.Values.length;
        var ctlcnt = this.Ctllist.length;
        //retitem.id : (Variable, control), retitem.value : 객체 명
        for (j=0; j < retcnt; j++) {
            retitem = varreturn[j];
            if (retitem.id == "variable") {
                var i;
                var item;
                for (i = 0; i < valcnt; i++) {
                    item = this.varVarlist.Values[i];
                    if (item.source == retitem.value) { //리턴 목록에 있는 변수만
                        if (item.source == para.id) {
                            item.value = para.value;
                            item.code = para.code;
                        }
                    }
                }
            } else {               
                //컨트롤 전달
                for (i = 0; i < ctlcnt; i++) {
                    item = this.Ctllist[i];
                    if (item.id == para.id) {
                        id = item.value;
                        if (this.varCtllist.containsKey(id)) {
                            ctl = this.getControl(id);
                            ctl.setValue(para.value);
                        }
                        else {
                            id = "#" + item.value;
                            $(id).val(para.value);
                        }
                    }
                }

                //id = retitem.value;
                //if (this.varCtllist.containsKey(id)) {

                //    ctl = this.getControl(id);
                //    ctl.setValue(para.value);
                //}
                //else {
                //    id = "#" + retitem.value;
                //    $(id).val(para.value);
                //}
            }
        }
    }

   /*--------------------------------------------------
    기능   : 파리미터별 값 전달
    INPUT  : para: 파라미터 객체
    RETURN : 
    ----------------------------------------------------*/
    this.setValue = function (para) {
        if (para.id == "$parentkey$") {
            this.ParentKey = para.value;
            return;
        }
        if (para.id == "$dialogreturnkey$") {
            //this.isdialog = true;
            this.DialogReturnKey = para.value;
            return;
        }
        var i;
        var item;
        var valcnt = this.varVarlist.Values.length;
        //변수 전달
        for (i = 0; i < valcnt; i++) {
            item = this.varVarlist.Values[i];
            if (item.source == para.id) {
                item.value = para.value;
                item.code = para.code;
            }
        }

        var id;
        var ctl;
        var ctlcnt = this.Ctllist.length;
        //컨트롤 전달
        for (i = 0; i < ctlcnt; i++) {
            item = this.Ctllist[i];            
            if (item.id == para.id) {
                id =  item.value;
                if (this.varCtllist.containsKey(id)) {
                    ctl = this.getControl(id);
                    ctl.setValue(para.value);
                }
                else {
                    id = "#" + item.value;
                    $(id).val(para.value);
                }
            }
        }
    }
} //oz_frame

 /*--------------------------------------------------
    기능   : 메타 정보를 가져오기
    INPUT  : purpose : 작업 내용
                     address :  주소
                     content : 
    RETURN : 
    ----------------------------------------------------*/
//메타 정보를 가져온다.
if (!oz_frame.prototype.getMetaData) {
    oz_frame.prototype.getMetaData = function (purpose, address, content) {
        var meta1 = new oza_MetaHandler(purpose, address, content);
        meta1.execute(this, false);
        return meta1.returncontent;
    }
}
 /*--------------------------------------------------
    기능   : 메타 정보를 설정 하기
    INPUT  : purpose : 작업 내용
                     address :  주소
                     content : 
    RETURN : 
    ----------------------------------------------------*/
if (!oz_frame.prototype.setMetaData) {
    oz_frame.prototype.setMetaData = function (purpose, address, content) {
        var meta1 = new oza_MetaHandler(purpose, address, content);
        meta1.execute(this, false,true);
        return meta1.returncontent;
    }
}
 /*--------------------------------------------------
    기능   : 컨트롤 객체 등록
    INPUT  : instance : 컨트롤
                     id : 컨트롤 아이디
                     isgrid : 그리드 여부
    ----------------------------------------------------*/
if (!oz_frame.prototype.registerControl) {
    oz_frame.prototype.registerControl = function (instance, id) {
        //var tmpid = id;
        //if (isgrid) {
        //    tmpid = 'div' + tmpid;
        //}
        ////tmpid = '#' + tmpid;
        ////$(tmpid).addClass('oz-item');

        //var ctl;
        //ctl = document.getElementById(tmpid);
        //if (ctl !== null) {
        //    ctl.classList.add('oz-item');
        //}
        if(this.varCtllist.containsKey(id)) {
            this.varCtllist.remove(id);
        }    
        this.varCtllist.Add(instance, id);
    }
}
 /*--------------------------------------------------
    기능   : 컨트롤 객체 찾기
    INPUT  : id : 컨트롤 아이디
    RETURN : 컨트롤 
                         null(not found)
    ----------------------------------------------------*/
if (!oz_frame.prototype.getControl) {
    oz_frame.prototype.getControl = function (id) {
        try {
            return this.varCtllist.Item(id);
        } catch (e) {
            return null;
        }
    }
}
/*--------------------------------------------------
    기능   : 변수 객체 등록
    INPUT  : instance : 변수
                     id : 변수 아이디
    ----------------------------------------------------*/
if (!oz_frame.prototype.registerVariable) {
    oz_frame.prototype.registerVariable = function (instance, id) {
        this.varVarlist.Add(instance, id.toUpperCase());
    }
}
 /*--------------------------------------------------
    기능   : 변수 객체 찾기
    INPUT  : id : 변수 아이디
    RETURN : 변수
                         null(not found)
    ----------------------------------------------------*/
if (!oz_frame.prototype.getVariable) {
    oz_frame.prototype.getVariable = function (id) {
        if (this.varVarlist.containsKey(id.toUpperCase())) {
            return this.varVarlist.Item(id.toUpperCase());
        }
        else {
            return null;
        }
    }
}

 /*-------------------------------------------------------------
    기능   : 서버 날짜시간 정보 가져오기
    RETURN :
    참고 : 호출 한 뒤 ozController.ServerDate 구문을 호출 해야 정보를 참고 할 수 있다.
    -------------------------------------------------------------*/
//서버 날짜 정보를 가져온다.
if (!oz_frame.prototype.GetServerDate) {
    oz_frame.prototype.GetServerDate = function () {
        this.ServerDate = ozf_GetServerDateTime();
    }
}
/*--------------------------------------------------
  기능 : 프레임 변수
  INPUT : value
                 code
                 source 
                 usecode : code 사용여부
----------------------------------------------------*/
function oz_var(value, code, source, usecode) {
    this.code = code;
    this.value = value;
    this.source = source;
    this.usecode = usecode;
}
/*--------------------------------------------------
  기능 : 변수 값 가져오기
  RETURN : value
                     usecode = true 일 경우 code 반환(단, code값이 '' 읽 경우 value 반환)
----------------------------------------------------*/
if (!oz_var.prototype.getvalue) {
    oz_var.prototype.getvalue = function () {
        if (this.usecode == 'true') {
            if (this.code == '') {
                return this.value;
            }
            else {
                return this.code;
            }
        }
        else {
            return this.value;
        }
    }
}

/*--------------------------------------------------
  Page Paremeter Setting
  INPUT : inout
          id
          value 
          code 
----------------------------------------------------*/
function oz_para(inout, id, value, code) {
    this.id = id;
    this.code = code;
    this.value = value;
    this.inout = inout;
}

/*--------------------------------------------------
  Item Setting
  INPUT : id
          value
----------------------------------------------------*/
function oz_ItemValue(id, value) {
    this.id = id;
    this.value = value
}

/*--------------------------------------------------
   Progress Bar
----------------------------------------------------*/
function oz_progressBar(id) {
    this.id = '#' + id;
    //생성자
    this.init = function () {
        $(this.id).dxProgressBar(
            {
                min: 0,
                max: 100,
                width: "90%"
                }
        );
        this.ctl = $(this.id).dxProgressBar('instance');
        return this.ctl
    }
    Object.defineProperty(this, 'Maximum', {
        get: function () {
            return this.ctl.option('max');
        },
        set: function (val) {
            this.ctl.option('max', val)
        }
    });
    Object.defineProperty(this, 'Minimum', {
        get: function () {
            return this.ctl.option('min');
        },
        set: function (val) {
            this.ctl.option('min', val)
        }
    });
}

/*--------------------------------------------------
   숫자 입력 컨트롤
----------------------------------------------------*/
function oz_numbertext(id) {
    this.id = '#' + id;
    this.ctl;
    this.formatString = '';
    this.monetaryUnit = '';
    this.noFormatValue = false;
    this.removeMinus = false;
    this.defaultLeftValue = '';

    this.dispose = function () {
        $(this.id).remove();
        this.ctl = null;
    }

    //생성자
    this.init = function () {
        $(this.id).dxNumberBox(
            {
                onKeyPress: function (e) {
                    var event = e.jQueryEvent,
                        str = event.key || String.fromCharCode(event.which);
                    if (!$.isNumeric(str)) {
                        if (!IsAllowKey(str)){
                            event.preventDefault();
                            return;
                        }
                    } 
                    //if (/^[\.\,e]$/.test(str))
                    //    event.preventDefault();
                }
            }
        );
        this.ctl = $(this.id).dxNumberBox('instance');
        return this.ctl
    }

    function IsAllowKey(str) {
        if (str == "Backspace") {            
            return true;
        }
        if (str == "ArrowLeft") {
            return true;
        }
        if (str == "ArrowRight") {
            return true;
        }
        if (str == "ArrowUp") {
            return true;
        }
        if (str == "ArrowDown") {
            return true;
        }
        if (str == "Delete") {
            return true;
        }
        return false;
    }

    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });

    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });

    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
}
//사이즈 설정
if (!oz_numbertext.prototype.setSize) {
    oz_numbertext.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//디자인 속성 추가
if (!oz_numbertext.prototype.setAttr) {
    oz_numbertext.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);        
    }
}
//활성화 여부 반환
if (!oz_numbertext.prototype.getEnabled) {
    oz_numbertext.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_numbertext.prototype.setEnabled) {
    oz_numbertext.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_numbertext.prototype.getVisible) {
    oz_numbertext.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_numbertext.prototype.setVisible) {
    oz_numbertext.prototype.setVisible = function (val) {      
        this.ctl.option('visible', val);
    }
}
//값 반환
if (!oz_numbertext.prototype.getValue) {
    oz_numbertext.prototype.getValue = function () {
        var val;
        val = this.ctl.option('value');
        if (this.monetaryUnit != '') {
            val = parseFloat(val) * parseFloat(this.monetaryUnit)
        }

        if (this.defaultLeftValue != '') {
            val = this.defaultLeftValue + val.toString();
        }
        return val;
    }
}
//값 설정
if (!oz_numbertext.prototype.setValue) {
    oz_numbertext.prototype.setValue = function (val) {
        this.ctl.option('value', val);
    }
}
//최대값 반환
if (!oz_numbertext.prototype.getMax) {
    oz_numbertext.prototype.getMax = function () {
        return this.ctl.option('max');
    }
}
//최대값 설정
if (!oz_numbertext.prototype.setMax) {
    oz_numbertext.prototype.setMax = function (val) {
        this.ctl.option('max', val);
    }
}
//최소값 반환
if (!oz_numbertext.prototype.getMin) {
    oz_numbertext.prototype.getMin = function () {
        return this.ctl.option('min');
    }
}
//최소값 설정
if (!oz_numbertext.prototype.setMin) {
    oz_numbertext.prototype.setMin = function (val) {
        this.ctl.option('min', val);
    }
}



/*--------------------------------------------------
 입력 컨트롤
----------------------------------------------------*/
function oz_textbox(id) {
    var displayFormat = "";
    var onEnterKey = null
    this.id = '#' + id;
    this.ctl;

    this.dispose = function () {
        onEnterKey = null;        
        this.ctl = null;
        $(this.id).remove();
    }

    //생성자
    this.init = function () {
        $(this.id).dxTextBox({
            format: 'time'
        });
        this.ctl = $(this.id).dxTextBox('instance');
        this.ctl.on("enterKey",
           function (e) {
               if (onEnterKey != null) {
                   onEnterKey();
               }
           });
        this.ctl.on("focusIn",
            function (e) {
                e.element.find('input').select();
            });
        return this.ctl
    }  
    Object.defineProperty(this, 'Name', {
        get: function() {
            return this.id.replace('\#', '');
        },
        set: function(val) {
        }
    });
    Object.defineProperty(this, 'maxLength', {
        get: function () {
            return this.ctl.option('maxLength');
        },
        set: function (val) {
            this.ctl.option('maxLength', val);
        }
    });
    Object.defineProperty(this, 'selectionStart', {
        get: function () {
            return this.ctl[0].selectionStart;
        },
        set: function (val) {
            this.ctl[0].selectionStart = val;
        }
    });
    Object.defineProperty(this, 'selectionLength', {
        get: function () {
            return parseInt(this.ctl[0].selectionEnd - this.ctl[0].selectionStart);
        },
        set: function (val) {
            //this.ctl[0].selectionLength = val;
        }
    });
    Object.defineProperty(this, 'onEnterKey', {
        get: function() {
            return onEnterKey;
        },
        set: function(val) {
            onEnterKey = val;
        }
    });
    Object.defineProperty(this, 'textAlign', {  //########################
        get: function () {
            return $(this.id + " .dx-texteditor-input").css("text-align");
        },
        set: function (val) {
            $(this.id + " .dx-texteditor-input").css("text-align", val.toLowerCase());
        }
    });
    //활성화 여부 반환
    this.getEnabled = function () {     
        return !this.ctl.option('disabled');
    }
    //활성와 여부 설정
    this.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
    //Visible 여부 반환
    this.getVisible = function () {
        return this.ctl.option('visible');
    }
    //Visible 여부 설정
    this.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
    this.clear = function () {
        this.ctl.option('value', '');
    }
    //값 반환
    this.getValue = function () {
        var val;
        val = this.ctl.option('value');
        if (this.formatString != "") {
            val = val.replace(/,/g, "");
        }        
        return val;
    }
    this.select = function (start, end) {
        this.ctl[0].setSelectionRange(start,end);
    }
    //값 설정
    this.setValue = function (val) {
        if (this.formatString != "") {
            val = ozf_FormatString(val, this.formatString);
        }
        this.ctl.option('value', val);
    }

    Object.defineProperty(this, 'formatString', {
        get: function () {
            return displayFormat;
        },
        set: function (val) {
            displayFormat = val;
        }
    });

    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
             this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
             this.ctl.option('height', val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
}
//이벤트 리스너 추가
if (!oz_textbox.prototype.addEventListener) {
    oz_textbox.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onEnterKey": 
                this.onEnterKey = f;
                break;
        }
    }
}
//사이즈 설정
if (!oz_textbox.prototype.setSize) {
    oz_textbox.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//디자인 속성 추가
if (!oz_textbox.prototype.setAttr) {
    oz_textbox.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/*--------------------------------------------------
  콤보 컨트롤
----------------------------------------------------*/
function oz_combo(id) {
    var inst = this;
    this.id = '#' + id;
    this.cbdatasource=[];
    this.valuelist = "";
    this.codelist ='';
    this.arrcodelist = [];
    this.valuelistcount = 0;
    this.delimiter = ";";
    this.userdefined = false;
    this.ctl;
    this.unSelectedItemName = "";
    this.unSelectedItemCode = "-1";
    this.setValueFlag = false;
    this.onValueChanged = null;

    this.dispose = function () {
        this.cbdatasource = [];
        this.valuelist = '';
        this.codelist = '';
        this.arrcodelist = [];
        onValueChanged = null;        
        this.ctl = null;
        $(this.id).remove();
        inst = null;
    }

    //생성자
    this.init = function () {
        $(this.id).dxSelectBox({
            dataSource: this.cbdatasource,
            displayExpr: "Caption",
            valueExpr: "Code",
            placeholder: "선택",
            onValueChanged: function (e) {
                if (inst.setValueFlag == false) {
                    if (inst.onValueChanged != null) {
                        inst.onValueChanged();
                    }                    
                }                
            }
        });
        this.ctl = $(this.id).dxSelectBox('instance');
        return this.ctl;
    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });

    Object.defineProperty(this, 'CodeList', {
        get: function () {
            if(this.codelist == "" && this.cbdatasource.length > 0) {
                var vals = "";
                var del = this.delimiter;
                this.cbdatasource.forEach(function(v, i){
                    vals += v.Code + del;
                });

                return vals.substr(0, vals.length - 1);
            }
            return this.codelist;
        },
        set: function (val) {
            this.codelist = val;
            this.setCodeList(this.codelist);
        }
    });

    Object.defineProperty(this, 'ValueList', {
        get: function () {
            if(this.valuelist == "" && this.cbdatasource.length > 0) {
                var vals = "";
                var del = this.delimiter;
                this.cbdatasource.forEach(function(v, i){
                    vals += v.Caption + del;
                });

                return vals.substr(0, vals.length - 1);
            }
            return this.valuelist;
        },
        set: function (val) {
            this.valuelist = val;
            this.setValueList(this.valuelist);
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
}

//이벤트 리스너 추가
if (!oz_combo.prototype.addEventListener) {
    oz_combo.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onValueChanged":
                this.onValueChanged = f;
                break;
        }
    }
}
//사이즈 설정
if (!oz_combo.prototype.setData) {
    oz_combo.prototype.setData = function (purpose, address,content) {
        if (purpose === "begininit") {
            this.setValueFlag = true;
        } else if(purpose === "endinit") {
            this.setValueFlag = false;
        }

    }
}
//사이즈 설정
if (!oz_combo.prototype.setSize) {
    oz_combo.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//콤보 데이터 추가
if (!oz_combo.prototype.addItem) {
    oz_combo.prototype.addItem = function (caption, code, dorefresh) {
        if (typeof (dorefresh) === "undefined") {
            dorefresh = true;
        }
        var item;
        item = {};
        item['Code'] = code;
        item['Caption'] = caption;
        this.cbdatasource.push(item);
        if (ozf_StringIsEmpty(code) != true) {
            this.arrcodelist.push(code);
            this.setValueFlag = true;
            this.ctl.option('value', caption);
            this.setValueFlag = false;
        }
        if (dorefresh == true) {
            this.refresh();
        }
    }
}
//코드로 콤보 데이터 삭제
if (!oz_combo.prototype.removeItemByCode) {
    oz_combo.prototype.removeItemByCode = function(code) {       
        if (ozf_StringIsEmpty(code) == true) {
            return ;
        }
        var i, item;
        var findIndex = -1;
        var cnt = this.arrcodelist.length;
        for (i = 0; i < cnt; i++) {
            if (this.arrcodelist[i] == code) {
                findIndex = i;
                break;
            }
        }
        if (findIndex > -1) {
            this.arrcodelist.splice(findIndex, 1);
            this.cbdatasource.splice(findIndex, 1);
        }        
       this.refresh();       
    }
}
//캡션으로 콤보 데이터 삭제
if (!oz_combo.prototype.removeItemByValue) {
    oz_combo.prototype.removeItemByValue = function (val, caseSensitive) {
        if (ozf_StringIsEmpty(val) == true) {
            return ;
        }
        if (typeof (caseSensitive) === "undefined") {
            caseSensitive = false;
        }
        var i, item;
        var findIndex = -1;
        var cnt = this.cbdatasource.length;
        for (i = 0; i < cnt; i++) {
            item = this.cbdatasource[i];
            if (caseSensitive == true) {
                if (item['Caption'] == val) {
                    findIndex = i;
                    break;
                }
            } else {
                if (item['Caption'].toLowerString() == val.toLowerString()) {
                    findIndex = i;
                    break;
                }
            }            
        }
        if (findIndex > -1) {
            this.arrcodelist.splice(findIndex, 1);
            this.cbdatasource.splice(findIndex, 1);
        }
        this.refresh();
    }
}
//활성화 여부 반환
if (!oz_combo.prototype.getEnabled) {
    oz_combo.prototype.getEnabled = function (val) {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_combo.prototype.setEnabled) {
    oz_combo.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_combo.prototype.getVisible) {
    oz_combo.prototype.getVisible = function (val) {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_combo.prototype.setVisible) {
    oz_combo.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//구분자 설정
if (!oz_combo.prototype.setListDelimiter) {
    oz_combo.prototype.setListDelimiter = function (val) {
        this.delimiter = val;
        this.setValueList(this.valuelist);
        this.setCodeList(this.codelist);
    }
}
//콤보에 캡션값 넣기
if (!oz_combo.prototype.setValueList) {
    oz_combo.prototype.setValueList = function (val) {
        this.valuelist = val;
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        if (ozf_StringIsEmpty(this.valuelist) == true) {
            return;
        }
        if (ozf_StringIsEmpty(this.UnSelectedItemName) != true) {
            this.valuelist = this.UnSelectedItemName + this.delimiter + this.valuelist;
            if (ozf_StringIsEmpty(this.UnSelectedItemName) != true) {
                this.codelist = this.UnSelectedItemCode + this.delimiter + this.codelist;
            }
            this.valuelistcount = this.valuelistcount + 1;
        }

        var prevvalue;
        prevvalue = this.getValue();
        this.internalclear();

        this.valuelist = val;
        if (this.valuelist == "") {
            return;
        }
        if (this.delimiter == "") {
            ozf_MsgBox("구분자를 지정 하세요.");
            return;
        }

        var valuelist1 = '';
        var codelist1 = '';
        valuelist1 = ozf_RemoveLastDelimiter(this.valuelist, this.delimiter);
        if (this.codelist != "") {
            codelist1 = ozf_RemoveLastDelimiter(this.codelist, this.delimiter);
        }

        var arrvalue = valuelist1.split(this.delimiter);
        var arrcode;
        var existcode;
        if (codelist1 != "") {
            arrcode = codelist1.split(this.delimiter);
            if (arrvalue.length != arrcode.length) {
                ozf_MsgBox("코드와 값 목록 수가 다릅니다.");
                return;
            }
            existcode = true;
        }

        var i;
        var item;
        var cnt = arrvalue.length;
        for (i = 0; i < cnt; i++) {
            item = {};
            if (existcode == true) {
                item['Code'] = arrcode[i];
            }
            else {
                item['Code'] = arrvalue[i];
            }
            item['Caption'] = arrvalue[i];
            this.cbdatasource.push(item);
        }
        this.refresh();
        if (ozf_StringIsEmpty(prevvalue) != false) {
            this.setValue(prevvalue);
        }
    }
}
//콤보에 코드값 넣기
if (!oz_combo.prototype.setCodeList) {
    oz_combo.prototype.setCodeList = function (val) {
        this.codelist = val;
        if (!ozf_StringIsEmpty(val)) {
            this.arrcodelist = val.split(this.delimiter);
        }
    }
}
//캡션값 개수 설정
if (!oz_combo.prototype.setValueListCount) {
    oz_combo.prototype.setValueListCount = function (val) {
        this.valuelistcount = val;
        this.setValueList(this.valuelist);
    }
}
if (!oz_combo.prototype.listCount) {
    oz_combo.prototype.listCount = function () {
        return this.cbdatasource.length;
    }
}
//콤보의 선택된 값의 코드 반환
if (!oz_combo.prototype.getCode) {
    oz_combo.prototype.getCode = function () {
        var index;
        index = this.getSelectedIndex();
        if (index == -1) {
            return ""
        }
        else {
            if (this.arrcodelist.length === 0) {
                return "";
            }
            
            if(this.getValue() == this.unSelectedItemName) {
                return "";
            } else {
                return this.arrcodelist[index];
            }
        }
    }
}

if (!oz_combo.prototype.getTMValue) {
    oz_combo.prototype.getTMValue = function () {     
        var val = this.getCode();
        if (ozf_StringIsEmpty(val)) {
            return this.getValue();
        } else {
            return val;
        }
    }
}

//코드값로 콤보 값 선택
if (!oz_combo.prototype.setCode) {
    oz_combo.prototype.setCode = function (val) {
        var_value = val;
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        if (this.arrcodelist.length > 0) {
            var i, founded;
            var cnt = this.arrcodelist.length;
            for (i = 0; i < cnt; i++) {
                if (val == this.arrcodelist[i]) {
                    founded = true;
                    break;
                }
            }
            if (founded == true) {
                this.setSelectedIndex(i);
            }
        }
    }
}
//콤보의 선택된 값의 캡션 반환
if (!oz_combo.prototype.getValue) {
    oz_combo.prototype.getValue = function () {
        var index;
        var val;
        index = this.getSelectedIndex()
        if (index == -1) {
            return "";
        }
        val = this.cbdatasource[index]['Caption'];
        if (val == this.UnSelectedItemName) {
            return "";
        }
        else {
            return val;
        }
    }
}
//캡션값으로 콤보 값 선택
if (!oz_combo.prototype.setValue) {
    oz_combo.prototype.setValue = function (val) {
        var_value = val;
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        var item, i;
        var cnt = this.cbdatasource.length ;
        for (i = 0; i < cnt; i++) {
            item = this.cbdatasource[i];
            if (item['Caption'] == val) {
                this.setValueFlag = true;
                //this.ctl.option('value', val);
                this.ctl.option('value', item['Code']);
                this.setValueFlag = false;
                return;
            }
        }
    }
}
//캡션값으로 콤보 값 선택
if (!oz_combo.prototype.setValueRaiseEvent) {
    oz_combo.prototype.setValueRaiseEvent = function (val) {
        var_value = val;
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        var item, i;
        var cnt = this.cbdatasource.length;
        for (i = 0; i < cnt; i++) {
            item = this.cbdatasource[i];
            if (item['Caption'] == val) {
                this.setValueFlag = true;
                this.ctl.option('value', item['Code']);
                this.setValueFlag = false;
                if (this.onValueChanged != null) {
                    this.onValueChanged();
                }                  
                return;
            }
        }
    }
}
//캡션값으로 콤보 값 선택
if (!oz_combo.prototype.setValueLower) {
    oz_combo.prototype.setValueLower = function (val) {        
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        val = val.toLowerCase();
        var item, i;
        var cnt = this.cbdatasource.length;
        for (i = 0; i < cnt; i++) {
            item = this.cbdatasource[i];
            if (item['Caption'].toLowerCase() === val) {
                this.setValueFlag = true;
                this.ctl.option('value', item['Code']);
                this.setValueFlag = false;
                return;
            }
        }
    }
}
//선택된 콤보값의 인덱스 반환
if (!oz_combo.prototype.getSelectedIndex) {
    oz_combo.prototype.getSelectedIndex = function () {
        var i;
        var item;
        var curval = this.ctl.option('value');
        var cnt = this.cbdatasource.length;
        for (i = 0; i < cnt; i++) {
            item = this.cbdatasource[i];
            if (item['Code'] == curval) {
                return i
            }
        }
        return -1;
    }
}
//콤보값 인덱스로 선택
if (!oz_combo.prototype.setSelectedIndex) {
    oz_combo.prototype.setSelectedIndex = function (index) {
        if (index < 0) {
            return;
        }
        if (index >= this.cbdatasource.length) {
            return;
        }
        if (index == this.getSelectedIndex()) {
            return;
        }
        var selval = this.cbdatasource[index];
        this.setValueFlag = true;
        this.ctl.option('value', selval['Code']);
        this.setValueFlag = false;
    }
}
//콤보 초기화
if (!oz_combo.prototype.clear) {
    oz_combo.prototype.clear = function () {
        this.ctl.option('dataSource', []);
        this.cbdatasource = [];
        this.arrcodelist = [];
        this.codelist = '';
        this.valuelist = '';
        this.ctl.repaint();
    }
}
//콤보 데이터 초기화
if (!oz_combo.prototype.internalclear) {
    oz_combo.prototype.internalclear = function () {
        this.ctl.option('dataSource', []);
        this.cbdatasource = [];
        this.ctl.repaint();
    }
}
//콤보 Refresh
if (!oz_combo.prototype.refresh) {
    oz_combo.prototype.refresh = function () {
        var selindex;
        selindex = this.getSelectedIndex();
        this.ctl.option('dataSource', []);
        //this.ctl.repaint();
        this.ctl.option('dataSource', this.cbdatasource);
        this.ctl.repaint();
        if (selindex >= 0) {
            try {
                this.setSelectedIndex(selindex);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}
//디자인 속성 추가
if (!oz_combo.prototype.setAttr) {
    oz_combo.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/*--------------------------------------------------
  라디오 컨트롤
----------------------------------------------------*/
function oz_radio(id) {
    var var_codelist = [];
    var var_value = '';
    var var_code = '';
    var onValueChanged = null;
    this.cbdatasource = [];
    this.id = '#' + id;
    this.valuelist = "";
    this.codelist = "";
    this.valuelistcount = 0;
    this.delimiter = "";
    this.userdefined = false;
    this.ctl;
    
    var setValueFlag = false;

    this.dispose = function () {
        onValueChanged = null;
        var_codelist = [];
        var_value = '';
        var_code = '';
        this.valuelist = "";
        this.codelist = "";
        this.cbdatasource = [];        
        this.ctl = null;
        $(this.id).remove();
    }

    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });

    Object.defineProperty(this, 'setValueFlag', {
        get: function () {
            return setValueFlag;
        },
        set: function (val) {
            setValueFlag = val;
        }
    });

    Object.defineProperty(this, 'onValueChanged', {
        get: function () {
            return onValueChanged;
        },
        set: function (val) {
            onValueChanged = val;
        }
    });

    this.layout = function (val) {
        if (val == "vertical") {
            this.ctl.option('layout', 'vertical');
        }
        else {
            this.ctl.option('layout', 'horizontal');
        }
    }

    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });

    Object.defineProperty(this, 'CodeList', {
        get: function () {
            return this.codelist;
        },
        set: function (val) {
            this.codelist = val;
            this.setCodeList(this.codelist);
        }
    });

    Object.defineProperty(this, 'ListCount', {
        get: function () {
            return this.cbdatasource.length;
        },
        set: function (val) {
            this.setValueListCount(val);
        }
    });

    Object.defineProperty(this, 'ValueList', {
        get: function () {
            return this.valuelist;
        },
        set: function (val) {
            this.valuelist = val;
            this.setValueList(this.valuelist);
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'FlowDirection', {
        get: function () {
            if (this.ctl.option('layout') === 'vertical') {
                return '1';
            } else {
                return '0';
            }
        },
        set: function (val) {
            if (val === '1') {
                this.ctl.option('layout', 'vertical')
            } else {
                this.ctl.option('layout', 'horizontal')
            }            
        }
    });
    //생성자
    this.init = function () {
        $(this.id).dxRadioGroup({
            dataSource: this.cbdatasource,
            displayExpr: "Caption",
            valueExpr: "Code",
            layout: 'horizontal',
            onValueChanged: function (e) {
                if (setValueFlag == false) {
                    if (onValueChanged != null) {
                        onValueChanged();
                    }
                }
            }
        });
        this.ctl = $(this.id).dxRadioGroup('instance');
        return this.ctl;
    }
    //라디오버튼 데이터 추가
    this.addItem = function (caption, code, dorefresh) {
        if (typeof (dorefresh) === "undefined") {
            dorefresh = true;
        }
        var item;
        item = {};
        item['Code'] = code;
        item['Caption'] = caption;
        this.cbdatasource.push(item);
        if (ozf_StringIsEmpty(code) != true) {
            this.arrcodelist.push(code);
        }
        if (dorefresh == true) {
            this.refresh();
        }
    }

    //구분자 설정
    this.setListDelimiter = function (val) {
        this.delimiter = val;
        this.setValueList(this.valuelist);
        this.setCodeList(this.codelist);
    }
    //라디오 데이터 추가
    this.setValueList = function (val) {
        this.valuelist = val;
        if (ozf_StringIsEmpty(this.valuelist) == true) {
            return;
        }
        if (ozf_StringIsEmpty(this.delimiter) == true) {
            return;
        }
        var prevvalue;
        prevvalue = this.getValue();
        this.internalclear();
        
        var existcode = false;

        this.valuelist = val;
        var arrvalue = this.valuelist.split(this.delimiter);

        if (var_codelist.length > 0)  {
            existcode = true;
        }
    
        //if (existcode == true) {
        //    if (var_codelist.length != arrvalue.length) {
        //        ozf_MsgBox("코드와 값 목록 수가 다릅니다.");
        //        return;
        //    }
        //}

        var i;
        var item;
        var cnt =  arrvalue.length;
        for (i = 0; i < cnt; i++) {
            item = {};
            if (existcode == true) {
                if (i < var_codelist.length) {
                    item['Code'] = var_codelist[i];
                }                
            }
            else {
                item['Code'] = arrvalue[i];
            }
            item['Caption'] = arrvalue[i];
            this.cbdatasource.push(item);
        }
        this.refresh();
        if (ozf_StringIsEmpty(prevvalue) != false) {
            this.setValue(prevvalue);
        }        
    }
    //라디오버튼 초기화
    this.clear = function () {
        this.codelist = [];
        this.ctl.option('dataSource', []);
        this.cbdatasource = [];
        this.ctl.repaint();
    }
    //라디오버튼 데이터 초기화
    this.internalclear = function () {
        this.ctl.option('dataSource', []);
        this.cbdatasource = [];
        this.ctl.repaint();
    }
    //라디오버튼 Refresh
    this.refresh = function () {
        var selindex;
        selindex = this.getSelectedIndex();
        this.ctl.option('dataSource', []);
        //this.ctl.repaint();
        this.ctl.option('dataSource', this.cbdatasource);
        this.ctl.repaint();
        this.setSelectedIndex(selindex);
    }
    //라디오버튼 코드 설정
    this.setCodeList = function (val) {
        var arrcode = val.split(this.delimiter);
        var_codelist = [];
        var cnt = arrcode.length;
        for (i = 0; i < cnt; i++) {           
            var_codelist.push( arrcode[i].rtrim());
        }        
    }
    //라디오버튼 값 개수 설정
    this.setValueListCount = function (val) {
        this.valuelistcount = val;
        this.setValueList(this.valuelist);
    }
    //라디오버튼 선택된 값의 코드 반환
    this.getCode = function () {
        var index;
        index = this.getSelectedIndex();
        if (index == -1) {
            return ""
        }
        else {
            return var_codelist[index];
        }
    }
    //코드값으로 라디오버튼 값 선택
    this.setCode = function (val) {
        var_value = val;
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        if (var_codelist.length > 0) {
            var i, founded;
            var cnt = var_codelist.length;
            for (i = 0; i < cnt; i++) {
                if (val == var_codelist[i]) {
                    founded = true;
                    break;
                }
            }
            if (founded == true) {
                this.setSelectedIndex(i);
            }
        }
    }
    //라디오버튼 선택된 값의 캡션 반환
    this.getValue = function () {
        var index;
        var val;
        index = this.getSelectedIndex()
        if (index == -1) {
            return "";
        }

        val = this.cbdatasource[index]['Caption'];
        if (val == this.UnSelectedItemName) {
            return "";
        }
        else {
            return val;
            //return this.ctl.option('value');
        }
    }
    //캡션값으로 라디오버튼 값 선택
    this.setValue = function (val) {
        var_value = val;
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        var item, i;
        var cnt = this.cbdatasource.length;
        for (i = 0; i <  cnt; i++) {
            item = this.cbdatasource[i];
            if (item['Caption'] == val) {
                this.setValueFlag = true;
                this.ctl.option('value', item['Code']);
                this.setValueFlag = false;
                return;
            }
        }
    }
    //라디오버튼의 선택된 값의 인덱스 반환
    this.getSelectedIndex = function () {
        var i;
        var item;
        var curval = this.ctl.option('value');
        var cnt = this.cbdatasource.length;
        for (i = 0; i < cnt; i++) {
            item = this.cbdatasource[i];
            if (item['Code'] == curval) {
                return i
            }
        }
        return -1;
    }
    //인덱스로 라디오버튼 값 선택
    this.setSelectedIndex = function (index) {
        if (index < 0) {
            return;
        }
        if (index >= this.cbdatasource.length) {
            return;
        }
        if (index == this.getSelectedIndex()) {
            return;
        }
        var selval = this.cbdatasource[index];
        this.setValueFlag = true;
        this.ctl.option('value', selval['Code']);
        this.setValueFlag = false;
    }
}
if (!oz_radio.prototype.getTMValue) {
    oz_radio.prototype.getTMValue = function () {
        var val = this.getCode();
        if (ozf_StringIsEmpty(val)) {
            return this.getValue();
        } else {
            return val;
        }
    }
}
//라디오버튼 이벤트리스너 추가
if (!oz_radio.prototype.addEventListener) {
    oz_radio.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onValueChanged":
                this.onValueChanged = f;
                break;
        }
    }
}
//활성화 여부 반환
if (!oz_radio.prototype.getEnabled) {
    oz_radio.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_radio.prototype.setEnabled) {
    oz_radio.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_radio.prototype.getVisible) {
    oz_radio.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_radio.prototype.setVisible) {
    oz_radio.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//사이즈 설정
if (!oz_radio.prototype.setSize) {
    oz_radio.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//라디오버튼 선택값 모두 해제
oz_radio.prototype.allUnCheck = function(){
    this.ctl.option('value', '');
}
//디자인 속성 추가
if (!oz_radio.prototype.setAttr) {
    oz_radio.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/*--------------------------------------------------
  Loading Panel
----------------------------------------------------*/
function oz_LoadPanel(id) {
    this.ctl;
    this.id = '#' + id;
    this.dispose = function () {
        this.ctl = null;
        $(this.id).remove();        
    }
    //로드패널 생성
    this.init = function (bodyid) {
        if (bodyid === undefined) {
            bodyid = '#ozbodyframe';
        }
        $(this.id).dxLoadPanel({
            shadingColor: 'rgba(0,0,0,0.01)',
            position: {
                of:  bodyid
            },
            visible: false,
            showIndicator: true,
            showPane: true,
            shading: false,
            closeOnOutsideClick: false
        });
        this.ctl = $(this.id).dxLoadPanel('instance');
        return this.ctl;
    }
    //this.message = function (val) {
    //    this.ctl.option('message', val);
    //}
}
//문구 변경
if (!oz_LoadPanel.prototype.message) {
    oz_LoadPanel.prototype.message = function (val) {
        this.ctl.option('message', val);
    }
}

/*--------------------------------------------------
  Tooltip
----------------------------------------------------*/
function oz_ToolTip(id) {
    this.ctl;
    this.id = '#' + id;
    this.dispose = function () {
        this.ctl = null;
        $(this.id).remove();        
    }
    //툴팁 생성
    this.init = function () {
        this.ctl = $(this.id).dxTooltip({
            target: '#ozbodyframe'
        });
        this.ctl = $(this.id).dxTooltip('instance');
        return this.ctl;
    }
}

/*--------------------------------------------------
  체크 컨트롤
----------------------------------------------------*/
function oz_check(id) {
    this.id = '#' + id;
    this.codeYes ='1';
    this.codeNo = '0';
    this.ctl;
    var setValueFlag = false;
    var onValueChanged = null;

    this.dispose = function () {
        onValueChanged = null;
        this.ctl = null;
        $(this.id).remove();        
    }

    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });

    Object.defineProperty(this, 'onValueChanged', {
        get: function () {
            return onValueChanged;
        },
        set: function (val) {
            onValueChanged = val;
        }
    });

    Object.defineProperty(this, 'setValueFlag', {
        get: function () {
            return setValueFlag;
        },
        set: function (val) {
            setValueFlag = val;
        }
    });
    //체크박스 생성
    this.init = function () {
        $(this.id).dxCheckBox({ format: 'date' });
        this.ctl = $(this.id).dxCheckBox('instance');
        this.ctl.on("valueChanged",
          function (e) {
              if (setValueFlag == false) {
                  if (onValueChanged != null) {
                      onValueChanged();
                  }
              }
          });
        return this.ctl;
    }

    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
}
//활성화 여부 반환
if (!oz_check.prototype.getEnabled) {
    oz_check.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_check.prototype.setEnabled) {
    oz_check.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_check.prototype.getVisible) {
    oz_check.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_check.prototype.setVisible) {
    oz_check.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//line-height 값 설정
if (!oz_check.prototype.autoSize) {
    oz_check.prototype.autoSize = function (h) {
        $(this.id + ' .dx-checkbox-text').css('line-height', h + 'px');
    }
}
//사이즈 설정
if (!oz_check.prototype.setSize) {
    oz_check.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//체크박스 값 반환 ('0'/'1')
if (!oz_check.prototype.getValue) {
    oz_check.prototype.getValue = function () {
        var val;
        if (this.ctl.option('value') == true) {
            return this.codeYes;
        }
        else {
            return this.codeNo;
        }
    }
}
//체크박스 값 설정 ('0'/'1')
if (!oz_check.prototype.setValue) {
    oz_check.prototype.setValue = function (val) {
        if (val == this.codeYes) {
            this.ctl.option('value', true);
        }
        else {
            this.ctl.option('value', false);
        }
    }
}
//체크박스 텍스트 반환
if (!oz_check.prototype.getText) {
    oz_check.prototype.getText = function () {
        return this.ctl.option('text');
    }
}
//체크박스 텍스트 설정
if (!oz_check.prototype.setText) {
    oz_check.prototype.setText = function (val) {
        this.setValueFlag = true;
        this.ctl.option('text', val);
        this.setValueFlag = false;
    }
}
//체크박스 값 반환 (true/false)
if (!oz_check.prototype.getCheck) {
    oz_check.prototype.getCheck = function () {
        return this.ctl.option('value');
    }
}
//체크박스 값 설정 (true/false)
if (!oz_check.prototype.setCheck) {
    oz_check.prototype.setCheck = function (val) {
        this.ctl.option('value', val);
    }
}
//디자인 속성 추가
if (!oz_check.prototype.setAttr) {
    oz_check.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}
//체크박스 이벤트리스너 추가
if (!oz_check.prototype.addEventListener) {
    oz_check.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onValueChanged":
                this.onValueChanged = f;
                break;
        }
    }
}
/*--------------------------------------------------
  이미지 컨트롤
----------------------------------------------------*/
function oz_image(id) {
    this.id = '#' + id;
    this.ctl;
    this.dispose = function () {
        this.ctl = null;
    }
    //생성자
    this.init = function () {        
        this.ctl = $(this.id)[0];
        
        return this.ctl;
    }

    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
}
//Visible 여부 반환
if (!oz_image.prototype.getVisible) {
    oz_image.prototype.getVisible = function () {
        if ($(this.id).prop('style').display == 'none') {
            return false;
        }
        else {
            return true;
        }
    }
}
//Visible 여부 설정
if (!oz_image.prototype.setVisible) {
    oz_image.prototype.setVisible = function (val) {
        if (val == true) {
            $(this.id).prop('style').display = 'inline-block';
        }
        else {
            $(this.id).prop('style').display = 'none';
        }
    }
}
//이미지 경로 반환
if (!oz_image.prototype.getImagePath) {
    oz_image.prototype.getImagePath = function () {
        return $(this.id).prop('src');
    }
}
//이미지 경로 설정
if (!oz_image.prototype.setImagePath) {
    oz_image.prototype.setImagePath = function (val) {
        $(this.id).prop('src', val);
    }
}
//활성화 여부 반환
if (!oz_image.prototype.getEnabled) {
    oz_image.prototype.getEnabled = function () {
        return !$(this.id).prop('disabled');
    }
}
//활성화 여부 설정
if (!oz_image.prototype.setEnabled) {
    oz_image.prototype.setEnabled = function (val) {
        $(this.id).prop('disabled', !val);
    }
}
//디자인 속성 추가
if (!oz_image.prototype.setAttr) {
    oz_image.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}
/*--------------------------------------------------
  버튼 컨트롤
----------------------------------------------------*/
function oz_button(id) {
    var onClick = null;
    this.id = '#' + id;
    this.ctl;
    this.dispose = function () {
        onClick = null;
        this.ctl = null;
        $(this.id).remove();        
    }

    Object.defineProperty(this, 'onClick', {
        get: function () {
            return onClick;
        },
        set: function (val) {
            onClick = val;
        }
    });
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    //생성자
    this.init = function () {
        $(this.id).dxButton({ type: 'normal' });
        this.ctl = $(this.id).dxButton('instance');
        this.ctl.option('text', ' ');
        this.ctl.on("click",
           function(e) {
               if (onClick != null) {
                   onClick();
               }
           });
        return this.ctl;
    }
    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
}
//버튼 이벤트리스너 추가
if (!oz_button.prototype.addEventListener) {
    oz_button.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onClick":
                this.onClick = f;
                break;
        }
    }
}
//버튼 사이즈 설정
if (!oz_button.prototype.setSize) {
    oz_button.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//활성화 여부 반환
if (!oz_button.prototype.getEnabled) {
    oz_button.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_button.prototype.setEnabled) {
    oz_button.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_button.prototype.getVisible) {
    oz_button.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_button.prototype.setVisible) {
    oz_button.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//버튼 텍스트 반환
if (!oz_button.prototype.getValue) {
    oz_button.prototype.getValue = function () {
        return this.ctl.option('text');
    }
}
//버튼 텍스트 설정
if (!oz_button.prototype.setValue) {
    oz_button.prototype.setValue = function (val) {
        this.ctl.option('text', val);
    }
}
//버튼 아이콘 설정
if (!oz_button.prototype.setIcon) {
    oz_button.prototype.setIcon = function (val) {
        this.ctl.option('icon', val);
        if (this.ctl.option('text').trim() == '') {
            $(this.id + " .dx-icon").css('margin-right', '0px');
        }
    }
}
//디자인 속성 추가
if (!oz_button.prototype.setAttr) {
    oz_button.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}
/*--------------------------------------------------
  달력 컨트롤
----------------------------------------------------*/
function oz_date(id) {
    this.id = '#' + id;
    this.addDate = "0";
    this.addMonth = "0";
    this.ctl;
    var onChange = null;
    this.dispose = function () {
        onChange = null;
        this.ctl = null;
        $(this.id).remove();        
    }
    Object.defineProperty(this, 'onChange', {
        get: function () {
            return onChange;
        },
        set: function (val) {
            onChange = val;
        }
    });

    //날짜 컨트롤 생성
    this.init = function () {
        $(this.id).dxDateBox({ type: 'date', displayFormat: "yyyy-MM-dd" });
        this.ctl = $(this.id).dxDateBox('instance');
        this.ctl.on("valueChanged",
            function (e) {
                if (onChange != null) {
                    onChange();
                }
            });
        return this.ctl;
    }
    //활성화 여부 반환
    this.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
    //활성화 여부 설정
    this.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
    var dateDelimiter = '';
    Object.defineProperty(this, 'dateDelimiter', {
        get: function () {
            return dateDelimiter;
        },
        set: function (val) {
            dateDelimiter = val;
        }
    });

    Object.defineProperty(this, 'customFormat', {
        get: function () {
            return this.ctl.option('displayFormat');
        },
        set: function (val) {            
            this.ctl.option('displayFormat', val);
        }
    });
    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });
    //Visible 여부 반환
    this.getVisible = function () {
        return this.ctl.option('visible');
    }
    //Visible 여부 설정
    this.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
    //Month 증가값 설정
    this.setAddMonth = function (val) {
        this.addMonth = val;
        var curval = this.ctl.option('value');
        curval = ozf_GetDateInterval(curval, val + 'm');
        this.ctl.option('value', curval);
    }
    //Month 증가값 반환
    this.getAddMonth = function () {
        this.addMonth;
    }
    //Date 증가값 설정
    this.setAddDate = function (val) {
        this.addDate = val;
        var curval = this.ctl.option('value');
        curval = ozf_GetDateInterval(curval, val + 'd');
        this.ctl.option('value', curval);
    }
    //Date 증가값 반환
    this.getAddDate = function () {
        this.addDate;
    }
}
//사이즈 설정
if (!oz_date.prototype.setSize) {
    oz_date.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//날짜 컨트롤 값 반환
oz_date.prototype.getValue = function () {
    var dateval;
    dateval = ozf_ToShortDateString(new Date(this.ctl.option('value')));
    return ozf_ReplaceString(dateval, "-", this.dateDelimiter);
}
//날짜 컨트롤 값 설정
oz_date.prototype.setValue = function (val) {
    var dateval;
    if (ozf_StringIsEmpty(val) == true) { return; }
    if (typeof (val) === "object") {
        val = ozf_ToShortDateString(val);
    }
    else {        
        val = val.toString();
    }

    val = ozf_GetDate(val, "-");
    dateval = ozf_ConvertDateToString(val);
    if (this.addDate != "" && this.addDate != "0") {
        dateval = ozf_GetDateInterval(dateval, this.addDate + 'd')
    }
    if (this.addMonth != "" && this.addMonth != "0") {
        dateval = ozf_GetDateInterval(dateval, this.addMonth + 'm')
    }
    this.ctl.option('value', dateval);
}
//디자인 속성 추가
if (!oz_date.prototype.setAttr) {
    oz_date.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}
//버튼 이벤트리스너 추가
if (!oz_date.prototype.addEventListener) {
    oz_date.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "change":
                this.onChange = f;
                break;
        }
    }
}

/*--------------------------------------------------
  시간 컨트롤
----------------------------------------------------*/
function oz_datetime(id) {
    this.id = '#' + id;
    this.ctl;
    var datedelimiter = "";
    var onChange = null;
    //자원 반환
    this.dispose = function () {
        onChange = null;
        this.ctl = null;
        $(this.id).remove();        
    }
    Object.defineProperty(this, 'onChange', {
        get: function () {
            return onChange;
        },
        set: function (val) {
            onChange = val;
        }
    });
    //생성자
    this.init = function () {
        $(this.id).dxDateBox({ type: 'time', showClearButton: false });
        this.ctl = $(this.id).dxDateBox('instance');
        this.ctl.on("valueChanged",
            function (e) {
                if (onChange != null) {
                    onChange();
                }
            });
        return this.ctl;
    }
    //활성화 여부 반환
    this.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
    //활성화 여부 설정
    this.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    Object.defineProperty(this, 'customFormat', {
        get: function () {
            return this.ctl.option('displayFormat');
        },
        set: function (val) {
            this.ctl.option('displayFormat', val);
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
    Object.defineProperty(this, 'dateDelimiter', {
        get: function () {
            return datedelimiter;
        },
        set: function (val) {
            datedelimiter = val;
        }
    });
    //Visible 여부 반환
    this.getVisible = function () {
        return this.ctl.option('visible');
    }
    //Visible 여부 설정
    this.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });
}
//사이즈 설정
if (!oz_datetime.prototype.setSize) {
    oz_datetime.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//날짜 시간 컨트롤 값 반환
oz_datetime.prototype.getValue = function () {
    // var dateval;
    // dateval =ozf_ToShortDateString(this.ctl.option('value'));
    // return ozf_ReplaceString(dateval, "-", this.dateDelimiter);
    var h, m, s, result;
    var d = this.ctl.option('value');

    h = d.getHours();
    m = d.getMinutes();
    s = d.getSeconds();

    h = h < 10 ? "0"+h : h.toString();
    m = m < 10 ? "0"+m : m.toString();
    s = s < 10 ? "0"+s : s.toString();

    return h + m + s;
}
//날짜 시간 컨트롤 값 설정
oz_datetime.prototype.setValue = function (val) {
    var dateval;
    if (ozf_StringIsEmpty(val) == true) {
        return;
    }
    if (val.length == 6) {
        this.ctl.option('value', new Date(0000,00,00,val.substr(0,2), val.substr(2,2), val.substr(4,2)));
    } else {
        dateval = ozf_GetDate(val, "-");
        this.ctl.option('value', dateval);
    }    
}
//디자인 속성 추가
if (!oz_datetime.prototype.setAttr) {
    oz_datetime.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}
//버튼 이벤트리스너 추가
if (!oz_datetime.prototype.addEventListener) {
    oz_datetime.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "change":
                this.onChange = f;
                break;
        }
    }
}

/*--------------------------------------------------
  패널 컨트롤
----------------------------------------------------*/
function oz_panel(id) {    
    var colchildenable;
    var mvarctllist;
    this.id = '#' + id;
    this.ctl;

    this.dispose = function () {
        colchildenable = null;
        this.ctl = null;
    }
    //생성자
    this.init = function () {
        this.ctl = $(this.id);
        return this.ctl;
    }
    //활성화 여부 반환
    this.getEnabled = function () {
        return !this.ctl.prop('disabled');
    }
    
    //활성화 여부 설정
    this.setEnabled = function (val) {
       this.ctl.prop('disabled', !val);

       var children = $(this.id + " .oz-item");
       var cnt = children.length;
       for (var i = 0; i < cnt; i++) {
           if (children[i].className.indexOf("ozgrid") >= 0) {
               if (getCtl(children[i].id.replace('div', '')) != null) getCtl(children[i].id.replace('div', '')).setEnabled(val);
           } else {
               if (getCtl(children[i].id) != null) getCtl(children[i].id).setEnabled(val);
           }
       }
    }
    
    // this.setEnabled = function (val) {
    //     this.ctl.prop('disabled', !val);
                
    //     var children = $(this.id + " .oz-item");
    //     var cnt = children.length;
    //     var id;
    //     var enablevalue;

    //     if (val) {
    //         for (var i = 0; i < cnt; i++) {
    //             id = children[i].id;
    //             //보관된 Enable 값으로 재 지정한다.
    //             if (colchildenable != null) {
    //                 if (colchildenable.containsKey(id)) {
    //                     enablevalue = colchildenable.get(id);
    //                 } else {
    //                     enablevalue = val;
    //                 }                    
    //             } else {
    //                 enablevalue = val;
    //             }

    //             if (children[i].className.includes("ozgrid")) {
    //                 if (getCtl(children[i].id.replace('div', '')) != null) getCtl(children[i].id.replace('div', '')).setEnabled(enablevalue);
    //             } else {
    //                 if (getCtl(children[i].id) != null) getCtl(children[i].id).setEnabled(enablevalue);
    //             }
    //         }
    //     } else {
    //         //하위 항목의 Enable 값을 보관한다.
    //         if (colchildenable == null) colchildenable = new ozf_Collection()
    //         colchildenable.clear();            
    //         for (var i = 0; i < cnt; i++) {
    //             id = children[i].id;
    //             if (children[i].className.includes("ozgrid")) {
    //                 if (getCtl(children[i].id.replace('div', '')) != null) enablevalue = getCtl(children[i].id.replace('div', '')).getEnabled();
    //             } else {
    //                 if (getCtl(children[i].id) != null) enablevalue = getCtl(children[i].id).getEnabled();
    //             }
    //             colchildenable.put(id, enablevalue);

    //             if (children[i].className.includes("ozgrid")) {
    //                 if (getCtl(children[i].id.replace('div', '')) != null) getCtl(children[i].id.replace('div', '')).setEnabled(val);
    //             } else {
    //                 if (getCtl(children[i].id) != null) getCtl(children[i].id).setEnabled(val);
    //             }
    //         }
    //     }
    // }

    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    Object.defineProperty(this, 'childControlList', {
        get: function () {
            return mvarctllist;
        },
        set: function (val) {
            mvarctllist = val;
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
    //Visible 여부 반환
    this.getVisible = function () {
        if (ozf_getCtlVisible(this.ctl.css('display'))) {
            return true;
        } else {
            return false;
        }
    }
    //Visible 여부 설정
    this.setVisible = function (val) {
        if (val == true) {
            this.ctl.css('display', '');
            var i;
            var id;
            var list = $(this.id).find(".ozgrid");            
            for (i = 0; i < list.length; i++) {
                id = list[i].id;
                id=id.replace('div', '')
                getCtl(id).refresh();
            }
        }
        else {
            this.ctl.css('display', 'none');
        }
    }
}
//디자인 속성 추가
if (!oz_panel.prototype.setAttr) {
    oz_panel.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/*--------------------------------------------------
  라벨 컨트롤
----------------------------------------------------*/
function oz_label(id) {
    var inst = this;
    var var_textalign;
    this.id = '#' + id;
    this.ctl;
    this.onClick = null;
    //자원 반환
    this.dispose = function () {
        this.onClick = null;
        this.ctl = null;
        inst = null;
    }
    //라벨 생성
    this.init = function () {
        this.ctl = $(this.id);
        $(this.id).on('click', function (event) {
            if (inst.onClick != null) {
                inst.onClick();
            }
        });
        return this.ctl;
    }
    Object.defineProperty(this, 'text', {
        get: function () {
            return this.getValue();
        },
        set: function (val) {
            this.setValue(val);
        }
    });
    Object.defineProperty(this, 'Cursor', {        
        set: function (val) {
            if (val === 'hand') {
                this.ctl.css('cursor', 'pointer'); 
            } else {
                this.ctl.css('cursor', 'default'); 
            }
        }
    });
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    var mvalueFormat;
    Object.defineProperty(this, 'valueFormat', {
        get: function () {
            return mvalueFormat;
        },
        set: function (val) {
            mvalueFormat = val;
        }
    });
    Object.defineProperty(this, 'textAlign', {
        get: function () {
            return var_textalign;
        },
        set: function (val) {
            var_textalign = val;

            var halfheight = this.height / 2;

            var lineheight;
            var textalign;
            switch (val){
                case 1: //topleft
                    textalign = 'left';
                    lineheight = this.height - halfheight;
                    //lineheight = '120%'; 
                    break;
                case 2: //topcenter
                    textalign = 'center';
                    lineheight = this.height - halfheight;
                    //lineheight = '120%';  this.height - halfheight;
                    break;
                case 4: //topright
                    textalign = 'right';
                    lineheight = this.height - halfheight;
                    //lineheight = '120%'; 
                    break;

                case 16: //middleleft
                    textalign = 'left';
                    lineheight = this.height;
                    //lineheight = '200%';
                    break;
                case 32: //middlecenter
                    textalign = 'center';
                    lineheight =  this.height;
                    //lineheight = '200%';
                    break;
                case 64: //middleright
                    textalign = 'right';
                    lineheight = this.height;
                    //lineheight = '200%'; 
                    break;

                case 256: //bottomleft
                    textalign = 'left';
                    lineheight = this.height + halfheight;
                    //lineheight = '280%'; 
                    break;
                case 512: //bottomcenter
                    textalign = 'center';
                    lineheight = this.height + halfheight;
                    //lineheight = '280%'; 
                    break;
                case 1024: //bottomright
                    textalign = 'right';
                    lineheight = this.height + halfheight;
                    //lineheight = '280%'; 
                    break;
            }
            if ($(this.id).css('display') != 'none') {
                $(this.id).css('display', 'block');               
            }
            $(this.id).css('line-height', lineheight + 'px');
            $(this.id).css('text-align', textalign);
        }
    });

    Object.defineProperty(this, 'width', {
        get: function () {
            return $(this.id).width();
        },
        set: function (val) {
            $(this.id).width(val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return $(this.id).height();
        },
        set: function (val) {
            $(this.id).height(val);
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
}
//사이즈 설정
if (!oz_label.prototype.setSize) {
    oz_label.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//활성화 여부 반환
if (!oz_label.prototype.getEnabled) {
    oz_label.prototype.getEnabled = function () {
        return !this.ctl.prop('disabled');
    }
}
//활성화 여부 설정
if (!oz_label.prototype.setEnabled) {
    oz_label.prototype.setEnabled = function (val) {
        this.ctl.prop('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_label.prototype.getVisible) {
    oz_label.prototype.getVisible = function () {
        if (ozf_getCtlVisible(this.ctl.css('display'))) {
            return true;
        } else {
            return false;
        }
    }
}
//Visible 여부 설정
if (!oz_label.prototype.setVisible) {
    oz_label.prototype.setVisible = function (val) {
        if (val == true) {
            this.ctl.css('display', 'block');
        }
        else {
            this.ctl.css('display', 'none');
        }
    }
}
//라벨 값 반환
if (!oz_label.prototype.getValue) {
    oz_label.prototype.getValue = function () {
        var val = $(this.id).html();
        val = val.replace(/<br ?\/?>/g, "\n");
        val = val.replace(/&nbsp;/g, " ");
        if (this.valueFormat != "") {
            val = val.replace(/,/g, "");
        } 
        return val;
    }
}
//라벨 값 설정
if (!oz_label.prototype.setValue) {
    oz_label.prototype.setValue = function (val) {
        if (this.valueFormat != "") {
            val = ozf_FormatString(val, this.valueFormat);
        }
        val = val.replace(/\n/g, "<br/>");
        val = val.replace(/\s/g, "&nbsp;");        
        $(this.id).html(val);
    }
}
//디자인 속성 추가
if (!oz_label.prototype.setAttr) {
    oz_label.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}
//이벤트리스너 추가
if (!oz_label.prototype.addEventListener) {
    oz_label.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onClick":
                this.onClick = f;
                break;
        }
    }
}

/*--------------------------------------------------
  FramePlayer Control
----------------------------------------------------*/
function oz_framePlayer(id) {
    var timerid;
    var pid;
    var pobj;
    var inst = this;
    var autoExecute = true;
    this.id = '#' + id;
    this.ctl;

    //자원 반환
    this.dispose = function () {
        this.ctl = null;
        inst = null;        
    }
    
    //FramePlayer 생성
    this.init = function () {
        var id = this.id.replace('\#', '');

        if (ozf_isIE()) {
            $(this.id).append("<iframe id='" + id + "_player' class='ozeframe oz-item' />");
        } else {
            $(this.id).append("<object id='" + id + "_player' class='ozeframe oz-item' />");
        }
        this.id = this.id + "_player";

        this.ctl = $(this.id);
        return this.ctl;
    }
    Object.defineProperty(this, 'AutoExecuteCreatedInFrame', {
        get: function () {
            return autoExecute;
        },
        set: function (val) {
            autoExecute = val;
        }
    });
    //FramePlayer 로드할때 실행
    this.loadFrame = function (url, pid, pobj) {
        pid = pid;
        pobj = pobj;
        url = url.toLowerCase();

        if (ozf_isIE()) {
            this.ctl.prop('src', url);
        } else {
            this.ctl.prop('data', url);
        }

        var orgid = inst.id.replace("_player", "");

        timerid = setInterval(function () {
            if ($(inst.id).length >= 1) {
                if ($(inst.id)[0].contentDocument != undefined) {
                    //완전히 로드 된 후 실행
                    if (($(inst.id)[0].contentDocument.defaultView.document.readyState == "complete") && ($(inst.id)[0].contentDocument.defaultView.do_loadFrame != undefined)) {
                        clearInterval(timerid);
                        if (this.AutoExecuteCreatedInFrame === false) {
                            return;
                        }
                        setTimeout(function () {
                            $(inst.id)[0].contentDocument.defaultView.do_loadFrame(pid, pobj);
                            if (inst.AutoExecuteCreatedInFrame === true) {
                                $(inst.id)[0].contentDocument.defaultView.do_RunScreen(true);
                            }
                            $(inst.id)[0].contentDocument.defaultView.add_FrameAction(frame_action);
                            frame_completed(orgid);
                        }, 100);
                    }
                }
            }
        }, 100);
    }
    //this.loadFrame = function (url, pid, pobj) {
    //    pid = pid;
    //    pobj = pobj;
    //    url = url.toLowerCase();
    //    this.ctl.prop('data', url);
      
    //    timerid = setInterval(function () {
    //        if ($(inst.id).length >= 1) {
    //            if ($(inst.id)[0].contentDocument != undefined) {
    //                //완전히 로드 된 후 실행
    //                if (($(inst.id)[0].contentDocument.defaultView.document.readyState == "complete") && ($(inst.id)[0].contentDocument.defaultView.do_loadFrame != undefined)) {
    //                    clearInterval(timerid);
    //                    if (this.AutoExecuteCreatedInFrame === false) {
    //                        return;
    //                    }
    //                    setTimeout(function () {
    //                        $(inst.id)[0].contentDocument.defaultView.do_loadFrame(pid, pobj);
    //                        if (this.AutoExecuteCreatedInFrame === true) {
    //                            $(inst.id)[0].contentDocument.defaultView.do_RunScreen(true);
    //                        }                            
    //                        $(inst.id)[0].contentDocument.defaultView.add_FrameAction(frame_action);
    //                        frame_completed(inst.id);
    //                    }, 100);
    //                }
    //            }
    //        }
    //    }, 100);        
    //}

    this.play = function (addr, isrun, pobj, callback) {
        var framename;
        filename = ozf_GetFrameNameFromXML(addr);

        if (ozf_StringIsEmpty(filename)) {
            ozf_MsgBox("화면 정보를 찾을 수 없습니다.");
            return;
        }

        filename = filename.toLowerCase();
        filename = filename + ".html?embed:true;autostart:false";
        // pid = this.id;
        pobj = pobj;

        if (ozf_isIE()) {
            this.ctl.prop('src', filename);
        } else {
            this.ctl.prop('data', filename);
        }

        var orgid = inst.id.replace("_player", "");

        timerid = setInterval(function () {
            if ($(inst.id).length >= 1) {
                if ($(inst.id)[0].contentDocument != undefined) {
                    //완전히 로드 된 후 실행
                    if (($(inst.id)[0].contentDocument.defaultView.document.readyState == "complete") && ($(inst.id)[0].contentDocument.defaultView.do_loadFrame != undefined)) {
                        clearInterval(timerid);
                        setTimeout(function () {
                            // $(inst.id)[0].contentDocument.defaultView.do_loadFrame(pid, pobj);
                            $(inst.id)[0].contentDocument.defaultView.do_loadFrame(orgid, pobj);
                            if (isrun === true) {
                                $(inst.id)[0].contentDocument.defaultView.do_RunScreen(true);
                            }                            
                            $(inst.id)[0].contentDocument.defaultView.add_FrameAction(frame_action);
                            frame_completed(orgid);
                            if (callback != null) {
                                if (typeof callback === "function") {
                                    callback();
                                }
                            };
                        }, 100);
                    }
                }
            }
        }, 100);        
    }
    //컨트롤의 값 반환
    this.frameGetControlValue = function (id, isCode) {
        return $(inst.id)[0].contentDocument.defaultView.do_frameGetControlValue(id, isCode);
    }
    //컨트롤의 값과 코드 설정
    this.frameSetControlValue = function (id, val, code) {
        $(inst.id)[0].contentDocument.defaultView.do_frameSetControlValue(id, val, code);
    }
    //변수의 값 반환
    this.frameGetVariableValue = function (id, isCode) {
        return $(inst.id)[0].contentDocument.defaultView.do_frameGetVariableValue(id, isCode);
    }
    //변수의 값 설정
    this.frameSetVariableValue = function (id, val, code) {
        $(inst.id)[0].contentDocument.defaultView.do_frameSetVariableValue(id, val, code);
    }
    //프레임의 스크립트 실행 (메세지 출력)
    this.frameExecuteScript = function (val) {
        $(inst.id)[0].contentDocument.defaultView.do_frameExecuteScript(val);
    }
    //프레임의 스크립트 실행 (메세지 출력 안함)
    this.frameExecuteScriptNoMessage = function (val) {
        $(inst.id)[0].contentDocument.defaultView.do_frameExecuteScriptNoMessage(val);
    }
    //FrmaePlayer 액션 수행
    this.frameExecuteAction = function (ctlname, eventname) {
        $(inst.id)[0].contentDocument.defaultView.do_frameExecuteAction(ctlname, eventname);
    }
    Object.defineProperty(this, 'dock', {
        get: function () {
            return this.getEnabled;
        },
        set: function (val) {
            ozf_ControlDock(this.id, val, true);
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
}
//디자인 속성 추가
if (!oz_framePlayer.prototype.setAttr) {
    oz_framePlayer.prototype.setAttr = function (attr, val) {
        $(this.id).parent().css(attr, val);
    }
}
//Frame 주소 반환
if (!oz_frame.prototype.getAddress) {
    oz_framePlayer.prototype.getAddress = function () {
        if (ozf_isIE()) {
             return this.ctl.prop('src');
        } else {
             return this.ctl.prop('data');
        }

        // return !this.ctl.prop('data');
    }
}
//활성화 여부 반환
if (!oz_framePlayer.prototype.getEnabled) {
    oz_framePlayer.prototype.getEnabled = function () {
        return !this.ctl.parent().prop('disabled');
    }
}
//활성화 여부 설정
if (!oz_framePlayer.prototype.setEnabled) {
    oz_framePlayer.prototype.setEnabled = function (val) {
        this.ctl.parent().prop('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_framePlayer.prototype.getVisible) {
    oz_framePlayer.prototype.getVisible = function () {
        if (ozf_getCtlVisible(this.ctl.parent().css('display'))) {
            return true;
        } else {
            return false;
        }
    }
}
//Visible 여부 설정
if (!oz_framePlayer.prototype.setVisible) {
    oz_framePlayer.prototype.setVisible = function (val) {
        if (val == true) {
            // 20180410!!!
            //$(this.id).parent().css('display', 'inline-block !important');
            $(this.id).parent().css('opacity', '1');
        } else {
            // 20180410!!!
            //$(this.id).parent().css('display', 'none !important');
            $(this.id).parent().css('opacity', '0');
        }       
    }
}


/*--------------------------------------------------
 TextArea Control
----------------------------------------------------*/
function oz_textarea(id) {
    this.id = '#' + id;
    this.ctl;
    this.datatype;
    this.delimiter = '';
    this.convertlinefeed = false;
    var mVarmaxlength = 0;
    var onChanged = null;
    var mvardontbytecheck = false;
    var byteCheckMessage = '';

    //자원 반환
    this.dispose = function () {
        byteCheckMessage = '';
        onChanged = null;
        this.ctl = null;
        $(this.id).remove();        
    }

    //TextArea 생성
    this.init = function () {
        $(this.id).dxTextArea({
            valueChangeEvent: "keyup",
            onValueChanged: function (e) {
                if (e.value) {
                    if (mvardontbytecheck === false) {
                        if (mVarmaxlength > 0) {
                            ChkByte(this, this.option('maxLength'));
                        }                        
                    }
                }
                if (onChanged != null) {
                    onChanged();
                }
            }
        });
        this.ctl = $(this.id).dxTextArea('instance');        
        return this.ctl;
    }
    Object.defineProperty(this, 'onChanged', {
        get: function () {
            return onChanged;
        },
        set: function (val) {
            onChanged = val;
        }
    });    
    Object.defineProperty(this, 'dontbytecheck', {
        get: function () {
            return mvardontbytecheck;
        },
        set: function (val) {
            mvardontbytecheck = val;
        }
    });    
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });
    Object.defineProperty(this, 'selectionStart', {
        get: function () {
            return $(this.id+" textarea")[0].selectionStart;
        },
        set: function (val) {
            $(this.id+" textarea")[0].selectionStart = val;
        }
    });
    Object.defineProperty(this, 'selectionLength', {
        get: function () {
            var txt = $(this.id+" textarea")[0];
            return parseInt(txt.selectionEnd - txt.selectionStart);
        },
        set: function (val) {
            //this.ctl[0].selectionLength = val;
        }
    });
    this.select = function (start, end) {
        this.ctl[0].setSelectionRange(start, end);
    }
    Object.defineProperty(this, 'maxLength', {
        get: function () {
            return this.ctl.option('maxLength');
        },
        set: function (val) {
            mVarmaxlength = val;
            this.ctl.option('maxLength', val);
        }
    });
    //TextArea Byte 체크 여부
    this.setDontByteCheck = function (msg) {
        this.dontbytecheck = true;
        byteCheckMessage= msg        
    }
    //활성화 여부 반환
    this.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
    //활성화 여부 설정
    this.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
    //Visible 여부 반환
    this.getVisible = function () {
        return this.ctl.option('visible');
    }
    //Visible 여부 설정
    this.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
    //값 지우기
    this.clear = function () {
        this.ctl.option('value', '');
    }
    //TextArea 값 반환
    this.getValue = function () {
        var val;
        val = this.ctl.option('value');

        if (ozf_StringIsEmpty(this.delimiter) == false) {
            val = val.replace(/\r\n/gi, this.delimiter);
        }
        else {
            val = val.replace(/\r\n/gi, '%@n%@');
        }
        return val;
    }
    //TextArea 값 설정
    this.setValue = function (val) {
        if (ozf_StringIsEmpty(val) == true) {
            this.ctl.option('value', '');
            return;
        }
        if (ozf_StringIsEmpty(this.delimiter) == false) {
            val = val.replace(/\r\n/gi, this.delimiter);
        }
        else {            
            if (this.convertlinefeed == true) {
                val = val.replace(/\r\n/gi, '\r\n');
            } else {
                val = val.replace(/%@n%@/gi, '\r\n');
            }
        }
        this.ctl.option('value', val);
    }

    /**
     * @description : 입력한 문자열의 바이트 수 계산
     * @returns
     */
    this.lenH = function () {
        var str = this.ctl.option('value');
        var str_len = str.length;
        var msg = byteCheckMessage;
        var rbyte = 0;
        var one_char = "";
        var str2 = "";

        for (var i = 0; i < str_len; i++) {
            one_char = str.charAt(i);
            if (escape(one_char).length > 4) {
                rbyte += 2;                                         //한글2Byte
            } else {
                rbyte++;                                            //영문 등 나머지 1Byte
            }
        }
        return rbyte;
    }

    //Byte수 체크
    function ChkByte(obj, maxByte) {
       var str = obj.option('value');
       var str_len = str.length;
       var msg = byteCheckMessage;
       var rbyte = 0;
       var rlen = 0;
       var one_char = "";
       var str2 = "";

       for (var i = 0; i < str_len; i++) {
           one_char = str.charAt(i);
           if (escape(one_char).length > 4) {
               rbyte += 2;                                         //한글2Byte
           } else {
               rbyte++;                                            //영문 등 나머지 1Byte
           }

           if (rbyte <= maxByte) {
               rlen = i + 1;                                          //return할 문자열 갯수
           }
       }

       if (rbyte > maxByte) {
           if (ozf_StringIsEmpty(msg) == true) {
               alert("한글 " + (maxByte / 2) + "자 / 영문 " + maxByte + "자를 초과 입력할 수 없습니다.");
           }
           else {
               alert(msg);
           }

           str2 = str.substr(0, rlen);                                  //문자열 자르기
           obj.option('value', str2);
           //fnChkByte(obj, maxByte);
       }
   }
}
//사이즈 설정
if (!oz_textarea.prototype.setSize) {
    oz_textarea.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//디자인 속성 추가
if (!oz_textarea.prototype.setAttr) {
    oz_textarea.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}
//이벤트 리스너 추가
if (!oz_textarea.prototype.addEventListener) {
    oz_textarea.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onChanged":
                this.onChanged = f;
                break;
        }
    }
}
/*--------------------------------------------------
 Ratio Panel (SplitContainer)
----------------------------------------------------*/
function oz_ratioPanel(id) {
    var inst = this;
    var panel1collapsed = false;
    var panel2collapsed = false;
    this.id = '#' + id;
    this.ctl;
    this.orientation = 'row';
    this.defaultwidth;
    this.defaultheight;
    this.panel1;
    this.panel2;
    this.collapsed = false;
    //자원 반환
    this.dispose = function () {
        this.ctl = null;
        $(this.id).remove();        
        inst = null;        
    }
    this.init = function () {
        $(this.id).dxBox({
            direction: this.orientation
        });        
        this.ctl = $(this.id).dxBox('instance');
        var p = $(this.id);
        this.panel1 = p.children()[0];
        this.panel2 = p.children()[1];
        adjust_splitterDistance();
    }
    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });

    Object.defineProperty(this, 'panel1Collapsed', {
        get: function () {
            return panel1collapsed;
        },
        set: function (val) {
            panel1collapsed = val;
        }
    });

    Object.defineProperty(this, 'panel2Collapsed', {
        get: function () {
            return panel2collapsed;
        },
        set: function (val) {
            panel2collapsed =  val;
        }
    });
    
    var vsplitterDistance;
    Object.defineProperty(this, 'splitterDistance', {
        get: function () {
            return vsplitterDistance;
        },
        set: function (val) {
            vsplitterDistance = val;
            adjust_splitterDistance();
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });

    this.setHeight = function (val) {
        this.ctl.option('height', val);
    }

    function adjust_splitterDistance() {
        if (inst.ctl === undefined) {
            return 
        }
        var size;
        var newratio;
        var splitdist = 0;

        if (inst.ctl.option('direction') === 'col') {
            size = $(inst.id).height();
            if (size === 0) {
                size = inst.defaultheight;
            }            
        } else {
            size = $(inst.id).width();
            if (size === 0) {
                size = inst.defaultwidth;
            }
        }

        if (panel1collapsed) { splitdist = 0; }
        else if (panel2collapsed) { splitdist = size; }
        else { splitdist = vsplitterDistance; }

        newratio = Math.round(splitdist / size * 100);
        inst.panel1.style['flex-grow'] = newratio;
        inst.panel2.style['flex-grow'] = 100 - newratio;

        inst.panel1.style['width'] = splitdist;
        inst.panel2.style['width'] = size - splitdist;
    }
}
//새로고침
if (!oz_ratioPanel.prototype.refresh) {
    oz_ratioPanel.prototype.refresh = function () {

    }
}
//사이즈 설정
if (!oz_ratioPanel.prototype.setSize) {
    oz_ratioPanel.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//활성화 여부 반환
if (!oz_ratioPanel.prototype.getEnabled) {
    oz_ratioPanel.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_ratioPanel.prototype.setEnabled) {
    oz_ratioPanel.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_ratioPanel.prototype.getVisible) {
    oz_ratioPanel.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_ratioPanel.prototype.setVisible) {
    oz_ratioPanel.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//디자인 속성 추가
if (!oz_ratioPanel.prototype.setAttr) {
    oz_ratioPanel.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/*--------------------------------------------------
 Tab Control
----------------------------------------------------*/
function oz_Tabs(id) {
    var pages = [];
    this.tabChangeCallfunc = [];
    var inst = this;
    this.id = id;
    this.ctl;
    this.initheaders = [];
    this.SelectedIndexChanged = function(e) {  }
    //자원 반환
    this.dispose = function () {
        initheaders = [];
        pages = [];
        var id = '#' + this.id + '_header';
        this.ctl = null;
        $(id).remove();        
    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id;
        },
        set: function (val) {
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
    //Tab 생성
    this.init = function (tabs, index) {
        var cnt  = tabs.length;
        for (var j = 0; j < cnt; j++) {
            this.initheaders.push(tabs[j]);
        }
        var id = '#' + this.id + '_header';
        for (var i = 0; i < cnt; i++) {
            pages.push(tabs[i]);
        }
        
        $(id).dxTabs({
            dataSource: tabs,
            selectedIndex: index,
            onSelectionChanged: function (data) { 
            	inst.tabchangeevt(data); 
            	}
        });
        this.ctl = $(id).dxTabs('instance');
        $(id).css('width', 'auto');
        return this.ctl;
    }

    //tab changed event
    this.tabchangeevt = function(e) {
        var loc;
        for (loc = 0; loc < this.tabChangeCallfunc.length; loc++) {
            this.tabChangeCallfunc[loc](e);
        }
    }

    //해당 인덱스의 Tabpage 이름 반환
    this.getTabPage = function (idx) {
        var id = '#' + this.id + '_container';
        var tabs = $(id).children();
        return tabs[idx].id.substr(2, tabs[idx].id.length);
    }
    //해당 인덱스의 탭 헤더 반환
    this.getTabPageHeader = function (idx) {
        return this.ctl.option('dataSource')[idx].text;
    }
    //선택된 Tabpage 인덱스 반환
    this.getSelectedIndex = function () {
        return this.ctl.option('selectedIndex');
    }
    //Tabpage 활성화 여부 설정
    this.setEnabledTabPage = function (index, val) {
        ozf_CtlEnabled(ozController, $('#' + $('#' + this.id + '_container').children()[index].id), val);
    }
    //tabcontrol 활성화 여부 설정
    this.setEnabled = function (val) {      
        var id = '#' + this.id + '_container';
        var tabs = $(id).children();  
        var cnt = tabs.length;
        for (var i = 0; i < cnt; i++) {
            ozf_CtlEnabled(ozController, $('#' + $('#' + this.id + '_container').children()[i].id), val);
        }        
    }

    //Tabpage 활성화 여부 반환
    this.getEnabledTabPage = function (index) {
        return $('#' + this.id + '_container').children()[index].id.enabled();
    }
    //인덱스로 Tabpage 선택
    this.setSelectedIndex = function (val) {
        this.ctl.option('selectedIndex', val);
        this.ctl.repaint();
    }
    //페이지 이름에 해당하는 Tabpage 찾아 숨김
    this.hideTabPage = function (pagename) {
        var findidx = -1;
        var id = '#' + this.id + '_container';
        var tabs = $(id).children();
        var headers = this.ctl.option('dataSource');
        var curIndex = this.getSelectedIndex();
        pagename = 'c_' + pagename;
        var cnt = tabs.length;
        for (var i = 0; i < cnt; i++) {
            if (tabs[i].id == pagename) {
                break;
            }
        }
        cnt = headers.length;
        for (var j = 0; j < cnt; j++) {
            if (headers[j].id == i) {
                findidx = j;
            }
        }

        if (findidx > -1) {
            this.ctl.option('dataSource').splice(findidx, 1);
            this.ctl.option('dataSource', this.ctl.option('dataSource'));
            if (findidx == curIndex) {
                this.initheaders[i].icon = 'menu';
                this.setSelectedIndex(0);
            }
        }
    }
    //페이지 이름으로 탭페이지 찾아 해당 인덱스에 보임
    this.showTabPage = function (idx, pagename) {
        var id = '#' + this.id + '_container';
        var tabs = $(id).children();
        var header = this.ctl.option('dataSource');
        var newdata = [];
        var cnt = tabs.length;
        pagename = 'c_' + pagename;
        pageidx = -1;
        for (var i = 0; i < cnt; i++) {
            if (tabs[i].id == pagename) {
                pageidx = i;
                break;
            }
        }

        if (pageidx == -1) { // 존재하지 않는 TabPage
            return;
        } else {
            cnt = header.length;
            for (var j = 0; j < cnt; j++) {
                if (this.initheaders[pageidx].id == header[j].id) {   // dataSource에 이미 존재하는 Page면 Return
                    return;
                }
            }
        }
        header.splice(idx, 0, this.initheaders[pageidx]);
        this.ctl.option('dataSource', header);
    }
    //해당 페이지 선택 여부 반환
    this.isSelectedTabPage = function (pagename) {
        var id = '#' + this.id + '_container';
        var tabs = $(id).children();
        var idx = this.getSelectedIndex();
        pagename = 'c_' + pagename;
        if (tabs[idx].id == pagename) {
            return true;
        }
        return false;
    }
    //선택된 Tabpage 이름 반환
    this.getSelectedTabPage = function () {
        var id = '#' + this.id + '_container';
        var tabs = $(id).children();
        var curidx = this.ctl.option('dataSource')[this.getSelectedIndex()].id;
        return tabs[curidx].id.substr(2, tabs[curidx].id.length);
    }
}
//Visible 여부 반환
if (!oz_Tabs.prototype.getVisible) {
    oz_Tabs.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_Tabs.prototype.setVisible) {
    oz_Tabs.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
        //var id = '#' + this.id + '_container';
        var id = '#' + this.id;
        if (val == true) {
            $(id).prop('style').display = 'inline-block';
        }
        else {
            $(id).prop('style').display = 'none';
        }
    }
}
if (!oz_Tabs.prototype.addEventListener) {
    oz_Tabs.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onSelectedIndexChanged":
            case "SelectedIndexChanged":
            case "onSelectionChanged":
                this.tabChangeCallfunc.push(f);
                //this.SelectedIndexChanged = f;
                break;            
        }
    }
}
//디자인 속성 추가
if (!oz_Tabs.prototype.setAttr) {
    oz_Tabs.prototype.setAttr = function (attr, val) {
        var id = '#' + this.id;
        $(id).css(attr, val);
    }
}
//선택된 탭페이지가 변환됐을때 호출되는 함수
function tab_changed(e) {
    var tabid;
    var tabcontentid;
    // var id = '#' + e.itemData.content;
    // tabid = e.itemData.id;
    var id = '#' + e.addedItems[0].content;
    tabid = e.addedItems[0].id;

    e.component._options.items.forEach(
        function (item) {
            item.icon = 'menu';
        }
    );

    e.addedItems[0].icon = 'check';
    //tab body
    tablist = $(id).children();
    var cnt = tablist.length;
    for (i = 0; i < cnt; i++) {
        if (i == tabid) {
            tablist[i].style.display = 'block';
            tabcontentid = tablist[i].id;
        } else {
            tablist[i].style.display = 'none';
        }
    }
    e.component.repaint();
    var Timer = setTimeout(function () {
        refresh_innercontrol(tabcontentid);
    }, 100);
}

//refresh tabpage control
function refresh_innercontrol(tabpage) {
    var ctlSelctor = '#' + tabpage;
    var ctllist, id, ctl;    
    ctllist = $(ctlSelctor).find('.wj-control.wj-flexgrid.wj-content');
    var cnt = ctllist.length;
    for (i = 0; i < cnt; i++) {
        id = ctllist[i].id;
        id = id.replace(/div/gi, '');
        ctl = getCtl(id);
        ctl.refresh();
    }
}

/*--------------------------------------------------
    AttachFile Control
----------------------------------------------------*/
function oz_attachfile(id) {
    var inst = this;
    var selectedfile;
    this.onFileSelected = null;
    this.readlinefunc = null;
    this.id = '#' + id;
    var txtid = this.id + " .attachtxtFileName";
    var attachid = this.id + " .attachselectFile";    
    this.ctl;
    this.isFileOpenWhenSelect = false;

    var fileReader = null;
    var arrLine = [];

    //자원 반환
    this.dispose = function () {
        onFileSelected = null;
        this.ctl = null;
        this.close_File();
        $(attachid).remove();        
    }


    //FileUploader 생성
    this.init = function () {
        var htmltag;
        htmltag = "<div class='input-container'>";
        htmltag = htmltag + "<input type='text' class='attachtxtFileName' readonly='readonly'/></div > ";
        htmltag = htmltag + "<div class='attachselectFile' id='selectFile'></div>";

        $(this.id).append(htmltag);
        
        $(attachid).dxFileUploader({
            multiple : false ,
            height : '55px',
            labelText: '',
            selectButtonText : '찾아보기',
            uploadMode: 'usebuttons'
        });
        
        this.ctl = $(attachid).dxFileUploader('instance');
        this.ctl.on("valueChanged",
            function (e) {
                selectedfile = null;
                var files = e.value;
                if (files.length > 0) {
                    selectedfile = files[0];
                    $(txtid).val(selectedfile.name);

                    if(inst.isFileOpenWhenSelect) {
                        inst.close_File();
                        fileReader = new FileReader();

                        fileReader.onload = function(e) {
                            arrLine = e.target.result.split("\r\n");
                            
                            if (inst.onFileSelected != null) {
                                inst.onFileSelected();
                            }
                        }

                        fileReader.readAsText(selectedfile);
                    }
                }
            });
        return this.ctl;
    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });
    Object.defineProperty(this, 'buttonCaption', {
        get: function () {
            return this.ctl.option('selectButtonText');
        },
        set: function (val) {
            return this.ctl.option('selectButtonText', val);
        }
    });
    Object.defineProperty(this, 'width', {
        get: function () {
            return this.ctl.option('width');
        },
        set: function (val) {
            this.ctl.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return this.ctl.option('height');
        },
        set: function (val) {
            this.ctl.option('height', val);
        }
    });
    Object.defineProperty(this, 'value', {
        get: function () {
            return this.getValue();
        },
        set: function (val) {
            this.setValue( val);
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });

    this.readLine = function () {
        if(!this.isFileOpenWhenSelect) return;

        if (arrLine.length > 0) {
            var lineVal;        
            lineVal = arrLine[0];
            arrLine.splice(0,1);
            return lineVal;
        } else {
            return "";
        }
    }

    this.isEOF = function() {
        if(!this.isFileOpenWhenSelect) return;

        if (arrLine.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    this.close_File = function() {
        if(!this.isFileOpenWhenSelect) return;

        arrLine = null;
        fileReader = null;
    }

    //값 반환
    this.getValue = function () {
        var newfilename = '';
        if(selectedfile != null) {        
            newfilename = selectedfile.name;
        }
        if (newfilename == undefined) newfilename = "";
        return newfilename;
    }
    //값 설정
    this.setValue = function (val) {
        selectedfile = {};
        selectedfile.name = val;
        $(txtid).val(val);
    }

    //선택한 파일 포인터
    this.selectedFilePtr = function () {
        return selectedfile;
    }
    /**
     * @Description : 선택한 파일 이름.
     * @param ext : 확장자 명
     */
    this.fileName = function (ext) {
        if (typeof (ext) === "undefined") ext = null;
        
        var newfilename = '';
        if (selectedfile != null) {
            if (ext != null) {
                newfilename = selectedfile.name + "." + ext;
            } else {
                newfilename = selectedfile.name;
            }            
        }
        return newfilename;
    }
    
    this.clear = function() {
        selectedfile = null;
        $(txtid).val('');
    }

    //this.uploadFile = function () {
    //    if (selectedfile != null) {
    //        this.ctl.
    //    }
    //}

    //활성화 여부 반환
    this.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
    //활성화 여부 설정
    this.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
    //Visible 여부 반환
    this.getVisible = function () {
        return this.ctl.option('visible');
    }
    //Visible 여부 설정
    this.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//사이즈 설정
if (!oz_attachfile.prototype.setSize) {
    oz_attachfile.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    }
}
//디자인 속성 추가
if (!oz_attachfile.prototype.setAttr) {
    oz_attachfile.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}
//버튼 이벤트리스너 추가
if (!oz_attachfile.prototype.addEventListener) {
    oz_attachfile.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "fileselected":
                this.onFileSelected = f;
                break;
            case "readline":
                this.readlinefunc = f;
                break;
        }
    }
}

/*--------------------------------------------------
    Chart Control
----------------------------------------------------*/
function oz_chart(id) {
    this.id = "#" + id;
    this.ctl;
    this.seriesCnt;
    this.datasource = [];
    this.seriesNamelist = [];
    this.charttype = 'bar';
    this.legendEnabled = true;
    this.legendInside = true;
    this.drawTMResultByColumn = true;
    this.myPalette = DevExpress.viz.getPalette('Ocean', { type: 'simpleSet' });
    this.showLegendForOneSeriesFlag = false;
    this.labelText = "#YValue";
    this.DataPointClick = function (e) { };
    // this.selectedDataPoint = null;
    this.selectedxLabel = "";
    this.selectedXValue = "";
    this.selectedYValue = "";

    var inst = this;
    var _handleDataPointEvent = false;

    //자원 반환
    this.dispose = function () {
        this.datasource = [];
        this.seriesNamelist = [];
        this.myPalette = null;

        
        this.ctl = null;
        $(this.id).remove();
        inst = null;
    }

    this.defaultLabelOption = new Object({
        visible: true,
        backgroundColor: "transparent",
        position: "outside",
        rotationAngle: 0,
        format: "fixedPoint",
        font: {
            size: 12,
            color: "#555"
        },
        customizeText: function (arg) {
            var fromlabel = [/#AxisXLabel/g, /#Percentage/g, /#Series/g, /#Sum/g, /#XValue/g, /#YValue/g, /#ZValue/g, /\\n/g];
            var customizeLabel = inst.labelText;
            var replacelabel = [arg.argument, arg.percentText, arg.seriesName, arg.totalText, arg.argument, arg.valueText, arg.sizeText, '\n'];

            if (arg.percent == undefined) {
                replacelabel[1] = '';
                customizeLabel = customizeLabel.replace(/%/g, '');
            } else {
                replacelabel[1] = (arg.percent * 100).toFixed(2);
            }

            var cnt = fromlabel.length
            for (var i = 0; i < cnt; i++) {
                customizeLabel = customizeLabel.replace(fromlabel[i], replacelabel[i]);
            }
            return customizeLabel.trim();
        }
    });
    this.defaultLegendOption = new Object({
        visible: true,
        orientation: "horizontal",
        paddingLeftRight: 7,
        paddingTopBottom: 9,
        position: "outside",
        horizontalAlignment: "center",
        verticalAlignment: "bottom",
        border: { visible: true, color: "#ccc", width: 1, cornerRadius: 2 }
    });
    this.defaultBorderOption = new Object({
        visible: true,
        color: "#444",
        width: 0
    });
    this.defaultPointOption = new Object({ size: 7 });

    var seriesArray = new Array();

    this.init = function () {
        var render = this.convertcharttype(this.charttype);
        //switch (render) {
        switch (this.charttype) {
            case "doughnut":
            case "pie":
                $(this.id).dxPieChart({ dataSource: [], series: [] });
                this.ctl = $(this.id).dxPieChart('instance');
                this.labelText = "#XValue, #YValue";
                break;
            case "radar":
                $(this.id).dxPolarChart({ dataSource: [], series: [], useSpiderWeb: true });
                this.ctl = $(this.id).dxPolarChart('instance');
                break;
            default:
                $(this.id).dxChart({ dataSource: [], series: [] });
                this.ctl = $(this.id).dxChart('instance');
                break;
        }

        this.ctl.option('tooltip', {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.argument + " : " + arg.valueText
                };
            }
        });
        this.ctl.option("legend", ozf_objectCopy(this.defaultLegendOption));
        this.ctl.option("valueAxis", { label: { format: "fixedPoint" } });
        this.ctl.option("onPointClick", function (e) {
            var point = e.target;
            //inst.selectedDataPoint = new Object({ selectedXLabel: point.argument, selectedXValue: point.argument, selectedYValue: point.value });
            inst.selectedxLabel = point.argument;
            inst.selectedXValue = point.argument;
            inst.selectedYValue = point.value;
            if(inst.HandleDataPointEvent) inst.DataPointClick();
        });

        return this.ctl;
    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });

    Object.defineProperty(this, 'titleText', {
        get: function () {
            return this.ctl.option("title")["text"];
        },
        set: function (val) {
            this.ctl.option("title")["text"] = val;
        }
    });

    Object.defineProperty(this, 'chartBackcolor', {
        get: function () {
            return $(this.id).css("background-color");
        },
        set: function (val) {
            $(this.id).css("background-color", val);
        }
    });

    Object.defineProperty(this, 'legendVisible', {
        get: function () {
            return this.ctl.option("legend")["visible"];
        },
        set: function (val) {
            this.ctl.option("legend")["visible"] = val;
        }
    });
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });
    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });
    Object.defineProperty(this, 'HandleDataPointEvent', {
        get: function () {
            return _handleDataPointEvent;
        },
        set: function (val) {
            _handleDataPointEvent = val;

            if (_handleDataPointEvent) {
                this.ctl.option("onDrawn", function (e) {
                    $(inst.id + " .dxc-markers, " + inst.id + " .dxc-labels").children().css("cursor", "pointer");
                });
            } else {
                this.ctl.option("onDrawn", function (e) { });
                this.DataPointClick = function (e) { }
            }
        }
    });
}

oz_chart.prototype.setPaletteInfo = function(name, colors) {
    var palette = new Array();
    for(var i=0; i<colors.Count(); i++) {
        palette.push(colors.Item(i));
    }
    this.ctl.option("palette", palette);
    this.myPalette = palette;
}

// //범례 활성화 여부
// oz_chart.prototype.setLegendVisible = function (val) {
//     //this.legendEnabled = val;
//     this.ctl.option("legend")["visible"] = val;
// }
//범례를 차트 안에 위치할지 여부
oz_chart.prototype.legendDockInsidePlotArea = function (val) {
    //this.legendInside = val;
    var position = val ? "inside" : "outside";
    this.ctl.option("legend")["position"] = position;
}

//범례 위치 지정 (Vertical은 center 지원 X)
oz_chart.prototype.legendPosition = function (h, v) {
    this.ctl.option("legend")["horizontalAlignment"] = h.toLowerCase();
    if (v.toLowerCase() == "center") {
        return;
    }
    this.ctl.option("legend")["verticalAlignment"] = v.toLowerCase();
}

oz_chart.prototype.showLegendForOneSeries = function () {
    // if(this.ctl.option("series").length == 1) {
    //     this.ctl.option("legend")["visible"] = false;
    // }
    this.showLegendForOneSeriesFlag = true;
    this.ctl.option("legend")["visible"] = true;
}

//차트 데이터 반환
oz_chart.prototype.dataSource = function () {
    return JSON.stringify(this.datasource);
}

//계열 이름 설정
oz_chart.prototype.seriesNames = function (val, delimiter) {
    this.seriesNamelist = ozf_SplitString(val, delimiter)
}
//계열 추가 (INPUT: 차트타입 / 계열이름)
oz_chart.prototype.createNewSeries = function (render, sname) {
    var labelopt = new Object();
    var borderopt = new Object();
    var pointopt = new Object();
    var i = this.ctl.option('series').length;
    var converted = this.convertcharttype(render);

    var seriesInfo = {};
    seriesInfo.valueField = "y" + i;
    seriesInfo.argumentField = "x";
    seriesInfo.rangeValue1Field = 'r1' + i;
    seriesInfo.rangeValue2Field = 'r2' + i;
    seriesInfo.label = ozf_objectCopy(this.defaultLabelOption);
    if (render == "column") {
        seriesInfo.label.rotationAngle = -90;
    }
    seriesInfo.border = ozf_objectCopy(this.defaultBorderOption);
    seriesInfo.point = ozf_objectCopy(this.defaultPointOption);
    seriesInfo.name = sname;
    if (converted != "pie") {
        seriesInfo.type = converted;
    }
    this.ctl.option('series').push(seriesInfo);
    seriesArray.push(seriesInfo);

    // if (converted != "pie") {
    //     this.ctl.option('commonSeriesSettings', { type: converted });
    // }
    if(render == "bar") {
        this.ctl.option('rotated', true);    
    }
    this.ctl.option('palette', this.myPalette);

    this.seriesCnt = this.ctl.option('series').length;

    return this.ctl.getSeriesByPos(this.ctl.option('series').length - 1);
}

oz_chart.prototype.getSeriesIndex = function (name) {
    name = name.trim();
    var cnt = seriesArray.length;
    for (var i = 0; i < cnt; i++) {
        if (seriesArray[i].name == name) return i;
    }
    return -1;
}

oz_chart.prototype.seriesLabelEnabled = function (seriesidx, val) {
    this.ctl.option("series")[seriesidx]["label"]["visible"] = val;
}

oz_chart.prototype.seriesLabelStyle = function (seriesidx, val) {
    val = val.toLowerCase();
    if (!val.equals("inside") && !val.equals("outside")) return;
    this.ctl.option("series")[seriesidx]["label"]["position"] = val;
}

oz_chart.prototype.seriesLabelFontColor = function (seriesidx, val) {
    this.ctl.option("series")[seriesidx]["label"]["font"]["color"] = val;
}

oz_chart.prototype.seriesColor = function (seriesidx, val) {
    this.ctl.option("series")[seriesidx]["color"] = val;
}

oz_chart.prototype.seriesBorderThickness = function (seriesidx, val) {
    this.ctl.option("series")[seriesidx]["border"]["width"] = parseFloat(val);
}

oz_chart.prototype.seriesBorderColor = function (seriesidx, val) {
    this.ctl.option("series")[seriesidx]["border"]["color"] = val;
}

oz_chart.prototype.yValueInterval = function (val) {
    var interval = parseFloat(val);
    this.ctl.option("valueAxis", { tickInterval: interval, label: { format: "fixedPoint" } });
}
oz_chart.prototype.seriesMarkEnabled = function (index, val) {
}

oz_chart.prototype.seriesLabelText = function (seriesidx, str) {
    //var fromlabel    = [/#AxisXLabel/g, /#Percentage/g, /#Series/g, /#Sum/g, /#XValue/g, /#YValue/g, /#ZValue/g, /\\n/g];

    this.labelText = str;

    // this.ctl.option("series")[seriesidx]["customizeText"] = function(arg){
    //     var customizeLabel = str;
    //     var replacelabel = [arg.argument, arg.percentText, arg.seriesName, arg.totalText, arg.argument, arg.valueText, arg.sizeText, '\n'];

    //     if(arg.percent == undefined){
    //         replacelabel[1] = '';
    //         customizeLabel = customizeLabel.replace(/%/g, '');
    //     } else {
    //         replacelabel[1] = (arg.percent*100).toFixed(2);
    //     }

    //     for(var i=0; i<fromlabel.length; i++){
    //         customizeLabel = customizeLabel.replace(fromlabel[i], replacelabel[i]);
    //     }
    //     return customizeLabel.trim();
    // }
}

//차트 데이터 추가
oz_chart.prototype.createDataPoint = function (index, label, y, z) {
    var item = {};
    y = parseFloat(y);
    if (z != '' && z != undefined) {
        z = parseFloat(z);
    }

    if (this.ctl.option('dataSource').length == 0) {
        var data = [];
        item = {};
        item['x'] = label;
        item['y' + index] = y;
        item['z' + index] = z;
        data.push(item);
        this.ctl.option('dataSource', data);
        this.datasource = data;
    }
    else {
        var found = false;
        // for (item in this.ctl.option('dataSource')){
        //     if (item['x'] == label) {
        //         item['y' + index] = y;
        //         item['z' + index] = z;
        //         found = true;
        //         break;
        //     }                
        // }
        var cnt = this.ctl.option('dataSource').length;
        for (var i = 0; i < cnt; i++) {
            item = this.ctl.option('dataSource')[i];
            if (item['x'] == label) {
                item['y' + index] = y;
                item['z' + index] = z;
                found = true;
                break;
            }
        }
        if (found != true) {
            item = {};
            item['x'] = label;
            item['y' + index] = y;
            item['z' + index] = z;
            this.ctl.option('dataSource').push(item);
        }
    }
}

oz_chart.prototype.getDataPointIndex = function (seriesidx, xLabel) {
    var cnt = this.datasource.length
    for (var i = 0; i < cnt; i++) {
        if (xLabel == this.datasource[i]["x"]) return i;
    }
    return -1;
}

oz_chart.prototype.getDataPointYValue = function (seriesidx, dpidx) {
    return this.datasource[dpidx]["y" + seriesidx];
}

oz_chart.prototype.changeDataPoint = function (seriesidx, dpidx, xval, yval) {
    yval = parseFloat(yval);
    var datas = this.datasource[dpidx];
    datas["x"] = xval
    datas["y" + seriesidx] = yval;
    this.ctl.option("dataSource", this.datasource);
    return this.ctl.option("dataSource");
}

oz_chart.prototype.removeDataPoint = function (seriesidx, dpidx) {
    // var datas = this.datasource[seriesidx];
    // var data = datas[dpidx];
    // var _.reject(arr, function(d){
    //     if(d.name == data.name) return d;
    // });

    var datas = this.datasource[dpidx];
    delete datas["y" + seriesidx];
    this.ctl.option("dataSource", this.datasource);
    return this.ctl.option("dataSource");
}

oz_chart.prototype.clearDataPoint = function () {
    this.datasource = new Array();
    this.ctl.option("dataSource", []);
    return this.ctl.option("dataSource");
}

oz_chart.prototype.getEnumHelper = function (type, val) {
    switch (type) {
        case "seriestype": return val;
        default: return;
    }
}

//차트 UI가 바뀌는것을 방지 (데이터 업데이트 시작)
oz_chart.prototype.beginChartInit = function () {
    this.ctl.beginUpdate();
}
//차트 UI가 바뀌는것을 허용 (데이터 업데이트 끝)
oz_chart.prototype.endChartInit = function () {
    if (this.seriesCnt == 1) {
        this.ctl.option('legend', { visible: this.showLegendForOneSeriesFlag });
    } else {
        this.ctl.option('legend', { visible: true });
    }

    this.ctl.endUpdate();
    //this.ctl.option('valueAxis', { label: { format: 'numeric' } });
    this.ctl.option('commonSeriesSettings', this.ctl.option('commonSeriesSettings'));
}

//차트 기본 스타일 적용
if (!oz_chart.prototype.applyDefaultStyle) {
    oz_chart.prototype.applyDefaultStyle = function () {

    }
}

//차트 그리기(TM결과)
oz_chart.prototype.draw = function () {
    var rot, labelFormat, ct, cOption;

    //label
    if (this.charttype == "bar") {
        rot = true;
        labelFormat = "numeric"
    } else if (this.charttype == "fullstack") {
        rot = false;
        labelFormat = "percent"
    } else {
        rot = false;
        labelFormat = "numeric"
    }

    //Chart Type
    switch (this.charttype) {
        case "column":
            cOption = "bar";
            rot = false;
            ct = 1;
            break;
        case "bar":
            cOption = "bar";
            ct = 1;
            break;
        case "stack":
            cOption = "stackedBar";
            ct = 1;
            break;
        case "fullstack":
            cOption = "fullStackedBar";
            ct = 1;
            break;
        case "area":
            cOption = "area";
            ct = 1;
            break;
        case "line":
            cOption = "line";
            ct = 1;
            break;
        case "linestep":
            cOption = "stepline";
            ct = 1;
            break;
        case "scatter":
            cOption = "scatter";
            ct = 1;
            break;
        case "bubble":
            cOption = "bubble";
            ct = 1;
            break;
        case "pie":
            cOption = "pie";
            ct = 2;
            break;
        case "doughnut":
            cOption = "doughnut";
            ct = 2;
            break;
        case "radar":
            cOption = "area";
            ct = 3;
            break;
    }

    //Legend Position
    // var lDInside;
    // if (this.legendInside == true) {
    //     lDInside = "inside";
    // } else {
    //     lDInside = "outside";
    // }

    this.ctl.option('dataSource', this.datasource);
    this.ctl.option('rotated', rot);
    // this.ctl.option('useSpiderWeb', true);
    if (cOption != "pie") {
        this.ctl.option('commonSeriesSettings', { type: cOption });
    }
    this.ctl.option('panes', { border: { visible: true } });
    this.ctl.option('series', seriesArray);
    //this.ctl.option('valueAxis', { min: 0, label: { format: labelFormat } });
    this.ctl.option('palette', this.myPalette);
    if (this.seriesCnt == 1) {
        this.ctl.option('legend', { visible: this.showLegendForOneSeriesFlag });
    } else {
        this.ctl.option('legend', { visible: true });
    }
    // this.ctl.option('onPointClick', function (e) {
    //     var targetLabel = e.target.getLabel();                  // point targetLabelInfo
    // });
}

oz_chart.prototype.makeDataSourceByTM = function (tmhandler) {
    var vrow, vcol;
    var datalist;
    var i, j;
    var value, id;
    var keyslist = [];
    var item;

    this.seriesClear();
    datalist = JSON.parse(tmhandler.getResult());
    vrow = datalist.length;
    for (var key in datalist[0]) {
        keyslist.push(key)
    }
    vcol = keyslist.length;

    if (this.drawTMResultByColumn == true) {
        this.seriesCnt = vcol - 1;
        for (i = 0; i < vrow; i++) {
            item = {};
            for (j = 0; j < vcol; j++) {
                value = datalist[i][keyslist[j]];
                if (j == 0) {
                    id = "x";
                    item[id] = value;
                }
                else {
                    id = "y" + (j - 1).toString();
                    item[id] = parseFloat(value);
                }
            }
            this.datasource.push(item);
        }
    }
    else {
        if (this.charttype == "pie" || this.charttype == "dought") {
            //var xlabel;
            this.seriesCnt = vcol - 1;
            for (i = 0; i < vrow; i++) {

                for (j = 0; j < vcol; j++) {
                    value = datalist[i][keyslist[j]];
                    if (j == 0) {
                        //id = "x";
                        //xlabel = value;
                        //item[id] = value;
                    }
                    else {
                        item = {};
                        item['x'] = keyslist[j];
                        id = "y0";
                        item[id] = parseFloat(value);
                        this.datasource.push(item);
                    }
                }
            }
        } else {
            this.seriesCnt = vrow;
            for (i = 0; i < vrow; i++) {
                item = {};
                for (j = 0; j < vcol; j++) {
                    value = datalist[i][keyslist[j]];
                    if (j == 0) {
                        //value = keyslist[j - 1];
                        id = "x";
                        item[id] = value;
                    }
                    else {
                        //value = datalist[i][keyslist[j]];
                        id = "y" + (j - 1).toString();
                        item[id] = parseFloat(value);
                    }
                }
                this.datasource.push(item);
            }
        }
    }

    //Make Series
    seriesArray = new Array();
    var cnt = this.seriesCnt;
    for (i = 0; i < cnt; i++) {
        var seriesInfo = new Object();
        seriesInfo.valueField = "y" + i;
        seriesInfo.argumentField = "x";
        if (i < this.seriesNamelist.length) {
            seriesInfo.name = this.seriesNamelist[i];
        }
        else {
            //seriesInfo.name = tmhandler.getColumnList[i];
            seriesInfo.name = keyslist[i + 1];
        }
        if (this.convertcharttype(this.charttype) != "pie") {
            seriesInfo.type = this.convertcharttype(this.charttype);
        }
        seriesArray.push(seriesInfo);
    }
}

oz_chart.prototype.makeDataSourceByReport = function (parser) {
    this.seriesCnt = parser.ColumnCount;
    var rowcnt = parser.RowLevelCount;
    var dataSource = new Array();
    var rowInfo, xvalue;
    var cnt = parser.RecordCount
    var colcnt;
    for (var i = 0; i < cnt; i++) {
        rowInfo = new Object();
        xvalue = '';

        for (k = 0; k < rowcnt; k++) {
            xvalue = xvalue + parser.MatrixRowLabels[i][k];
            if (k < rowcnt) {
                xvalue = xvalue + ' ';

                if (k == rowcnt - 1) {
                    xvalue = xvalue.substr(0, xvalue.length - 1);
                }
            }
        }
        rowInfo["x"] = xvalue;
        colcnt = parser.ColumnCount;
        for (var j = 0; j < colcnt; j++) {
            id = "y" + j.toString();
            rowInfo[id] = parseFloat(parser.MatrixValues[i][j]);
        }
        this.datasource.push(rowInfo);
    }

    //Make Series
    seriesArray = new Array();
    var cnt = this.seriesCnt;
    for (var i = 0; i < cnt; i++) {
        var seriesInfo = new Object();
        seriesInfo.valueField = "y" + i;
        seriesInfo.argumentField = "x";
        if (i < this.seriesNamelist.length) {
            seriesInfo.name = this.seriesNamelist[i];
        }
        else {
            //seriesInfo.name = tmhandler.getColumnList[i];
            seriesInfo.name = this.datasource[0]["x"];
        }
        if (this.convertcharttype(this.charttype) != "pie") {
            seriesInfo.type = this.convertcharttype(this.charttype);
        }
        seriesArray.push(seriesInfo);
    }
}

//차트 타입 바꾸기
if (!oz_chart.prototype.convertcharttype) {
    oz_chart.prototype.convertcharttype = function (val) {
        //Chart Type
        switch (val.toLowerCase()) {
            case "column":
                return "bar";
                break;
            case "bar":
                return "bar";
                break;
            case "stack":
                return "stackedBar";
                break;
            case "fullstack":
                return "fullStackedBar";
                break;
            case "area":
                return "area";
                break;
            case "line":
                return "line";
                break;
            case "spline":
                return "spline";
                break;
            case "linestep":
                return "stepline";
                break;
            case "scatter":
                return "scatter";
                break;
            case "bubble":
                return "bubble";
                break;
            case "pie":
                return "pie";
                break;
            case "doughnut":
                return "doughnut";
                break;
            case "radar":
                return "area";
                break;
        }
    }
}
//계열 초기화
if (!oz_chart.prototype.seriesClear) {
    oz_chart.prototype.seriesClear = function () {
        this.datasource = [];
        this.ctl.option('dataSource', []);
        seriesArray = new Array();
        this.ctl.option('series', []);
    }
}
//차트 초기화
if (!oz_chart.prototype.clear) {
    oz_chart.prototype.clear = function () {
        this.datasource = new Array();
        seriesArray = new Array();
        this.ctl.option('dataSource', []);
        this.ctl.option('series', []);
    }
}
//차트 애니메이션 여부 설정
if (!oz_chart.prototype.setChartAnimation) {
    oz_chart.prototype.setChartAnimation = function (val) {
        this.ctl.option('animation', { enabled: val });
    }
}
//차트 애니메이션 여부 반환
if (!oz_chart.prototype.getChartAnimation) {
    oz_chart.prototype.getChartAnimation = function (val) {
        return this.ctl.option('animation')['enabled'];
    }
}
//새로고침
if (!oz_chart.prototype.refresh) {
    oz_chart.prototype.refresh = function () {

    }
}
// //사이즈 설정
// if (!oz_chart.prototype.setSize) {
//     oz_chart.prototype.setSize = function (w, h) {
//         this.width = w;
//         this.height = h;
//     }
// }
//활성화 여부 반환
if (!oz_chart.prototype.getEnabled) {
    oz_chart.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_chart.prototype.setEnabled) {
    oz_chart.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_chart.prototype.getVisible) {
    oz_chart.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_chart.prototype.setVisible) {
    oz_chart.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//디자인 속성 추가
if (!oz_chart.prototype.setAttr) {
    oz_chart.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

//차트 이벤트리스너 추가
if (!oz_chart.prototype.addEventListener) {
    oz_chart.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "datapointclicked":
                this.DataPointClick = f;
                break;
        }
    }
}

/*--------------------------------------------------
    Circular Gauge
----------------------------------------------------*/
function oz_circularGauge(id) {
    this.id =  id;
    this.ctl;

    this.startAngle = 360;
    this.endAngle = 0;
    this.startValue = 0;
    this.endValue = 150;
    this.tickInterval = 10;
    this.palette = 'pastel';
    this.rangeCount = 3;
    this.columns = 1;
    this.gaugelist = [];
    this.datasource = [];
    this.fontsize = 16;
    this.callback; //Event Callback
    this.valueindicatortype = 'rectangleNeedle';
    this.valueindicatorcolor = '#f05b41';
    this.subvaluecolor = '#f05b41';

    //자원 반환
    this.dispose = function () {
        this.gaugelist = [];
        this.datasource = [];
        this.ctl = null;
        $('#' + this.id).remove();        
    }

    //Column
    this.setColumn = function (val) {
        this.columns = val;
    }
    this.getColumn = function () {
        return this.columns;
    }

    this.init = function () {

    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id;
        },
        set: function (val) {
        }
    });
    //Gauge 초기화
    this.clear = function () {
        this.internalclear();
        this.datasource = [];
    }
    //Gauge 리스트 초기화
    this.internalclear = function () {
        if ($(this.id).length > 0) {
            $(this.id).empty();
        }
        this.gaugelist = [];
    }
    //Gauge Clear
    this.beginInit = function () {
        this.clear();
    }

    //Add New Gauge
    this.addItem = function (title, value) {
        var item;
        item = {};
        item['id'] = this.id + this.datasource.length;
        item['title'] = title;
        item['value'] = value;
        this.datasource.push(item);
    }

    //Draw Gauge
    this.endInit = function () {
        this.internalclear();

        var i, ratio, hratio;
        var isStart;
        var isNewLine;
        var htmlTag = '';
        var gTag = ''

        //determine Width Ratio
        ratio = parseInt(100 / this.columns);
        ratio = ratio - 1;
        i = 0;
        var item;

        var rows = 0;
        var cnt = this.datasource.length;
        //find Rows
        for (var j = 0 ; j < cnt ; j++) {
            if (j % this.columns == 0) {
                rows = rows + 1;
            }
        }

        //determine Height Ratio
        hratio = parseInt(100 / rows);
        hratio = hratio - 1;

        for (var j = 0 ; j < cnt; j++) {
            item = this.datasource[j];

            if (i % this.columns == 0) {
                isNewLine = true;
            }
            else {
                isNewLine = false;
            }

            if (isNewLine == true) {
                if (isStart == true) {
                    htmlTag = htmlTag + "</div>";
                }
                isStart = true;
                htmlTag = htmlTag + "<div style='height:" + hratio + "%'>";
            }

            gTag = "<div id='" + item['id'];
            gTag = gTag + "' data-select = false style = 'display: inline-block; minWdith:200px; minHeight:200px; height:100%;width:" + ratio.toString();
            gTag = gTag + "%; position: relative'><div id='c" + item['id'] + "' style='z-index: 9999; height:100%; width:100%; position: absolute'></div></div>";
            htmlTag = htmlTag + gTag;
            i = i + 1;
        }

        //Last
        if (isNewLine == true) {
            htmlTag = htmlTag + "</div>";
        }

        //Make Div Table
        $('#' + this.id).append(htmlTag);

        var gid, cgid;
        var gctl;

        var rangearr = [];

        //range
        if (this.rangeCount > 0) {
            var range, gap, curValue;
            gap = parseInt((this.endValue - this.startValue) / this.rangeCount);
            curValue = this.startValue;
            var cnt = this.rangeCount;
            for (i = 0; i < cnt; i++) {
                range = {};
                range['startValue'] = curValue
                if (i == this.rangeCount - 1) {
                    range['endValue'] = this.endValue;
                }
                else {
                    curValue = curValue + gap;
                    range['endValue'] = curValue;
                }
                curValue = curValue + 1;
                rangearr.push(range);
            }
        }

        //Shape
        var geoShape = {};
        geoShape['startAngle'] = this.startAngle;
        geoShape['endAngle'] = this.endAngle;

        var parent = this;
        var cnt = this.datasource.length;
        //Create Gauge
        for (var j = 0 ; j < cnt; j++) {
            item = this.datasource[j];
            gid = '#' + item['id'];

            //Must be subeValue
            $(gid).dxCircularGauge({ subvalues: item['value'], subvalueIndicator: { type: 'textCloud', color: this.subvaluecolor, text: { font: { size: 10 } } } });

            gctl = $(gid).dxCircularGauge('instance');
            gctl.option('geometry', geoShape);
            gctl.option('scale', {
                startValue: parseFloat(this.startValue), endValue: parseFloat(this.endValue), tickInterval: parseFloat(this.tickInterval), label: {
                    useRangeColors: true,
                    customizeText: function (arg) {
                        return numFormat(arg.valueText);
                    }
                }
            });
            gctl.option('rangeContainer', { palette: this.palette, ranges: rangearr });
            gctl.option('title', { text: item['title'], font: { size: this.fontsize } });
            gctl.option('valueIndicator', { type: this.valueindicatortype, color: this.valueindicatorcolor });
            gctl.option('value', item['value']);

            cgid = '#c' + item['id'];
            $(cgid).on("click", function (data) {
                var id = data.target.parentElement.id;
                if (id != 'undefined' && id != "") {
                    for (var i = 0; i < parent.gaugelist.length; i++) {
                        //if ($('#' + id).data('select') == true) {
                        if ($('#' + parent.gaugelist[i]._$element[0].id).data('select') == true) {
                            $('#c' + parent.gaugelist[i]._$element[0].id).css('background-color', 'rgba(0,0,0,0)');
                        }
                    }
                    $('#' + id).data('select', true);
                    $('#' + this.id).css('background-color', 'rgba(0,0,0,0.1)');

                    id = id.replace('/' + this.id + '/gi', '');
                    if (parent.callback != undefined) {
                        parent.callback(parent.datasource[id]);
                    }
                }
            });
            this.gaugelist.push(gctl);
        }       
    }
    //포멧팅된 숫자 반환
    function numFormat(n) {
        var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
        n += '';                          // 숫자를 문자열로 변환
        while (reg.test(n))
            n = n.replace(reg, '$1' + ',' + '$2');

        return n;
    }
    //Gauge 데이터 추가
    this.setItemsSource = function (tmhandler) {
        var vrow, vcol;
        var datalist;
        var i, j;
        var value, id;
        var keyslist = [];
        var item;

        this.clear();
        datalist = JSON.parse(tmhandler.getResult());
        vrow = datalist.length;
        for (var key in datalist[0]) {
            keyslist.push(key)
        }

        vcol = keyslist.length;
        this.seriesCnt = vcol - 1;
        for (i = 0; i < vrow; i++) {
            
            for (j = 0; j < vcol; j++) {
                value = datalist[i][keyslist[j]];
                if (j == 0) {
                    item = {};
                    item['id'] = this.id + this.datasource.length;
                    item['title'] = value;
                }
                else {                    
                    item['value'] = parseFloat(value);
                }
            }
            this.datasource.push(item);
        }
        this.endInit();
    }
    //Gauge 제목 설정
    this.setTitle = function (val) {
        this.ctl.option('title', { text: val, font: { size: this.ctl.option('title').font.size } });
    }
    //Gauge 제목 크기 설정
    this.setTitleFontSize = function (val) {
        this.ctl.option('title', { text: this.ctl.option('title').text, font: { size: val } });
    }
    //Gauge 값 설정
    this.setValue = function (val) {
        this.ctl.option('value', val);
    }
}
//활성화 여부 반환
if (!oz_circularGauge.prototype.getEnabled) {
    oz_circularGauge.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_circularGauge.prototype.setEnabled) {
    oz_circularGauge.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_circularGauge.prototype.getVisible) {
    oz_circularGauge.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_circularGauge.prototype.setVisible) {
    oz_circularGauge.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//디자인 속성 추가
if (!oz_circularGauge.prototype.setAttr) {
    oz_circularGauge.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/*--------------------------------------------------
    Linear Gauge
----------------------------------------------------*/
function oz_linearGauge(id) {
    this.id = id;
    this.ctl;

    this.startAngle = 360;
    this.endAngle = 0;
    this.orientation = 'vertical';
    this.startValue = 0;
    this.endValue = 3000;
    this.tickInterval = 10;
    this.palette = 'pastel';
    this.rangeCount = 3;
    this.columns = 1;
    this.gaugelist = [];
    this.datasource = [];
    this.fontsize = 16;
    this.callback; //Event Callback
    this.valueindicatortype = 'rectangleNeedle';
    this.valueindicatorcolor = '#CF3333';
    this.subvaluecolor = '#CF3333';

    //자원 반환
    this.dispose = function () {
        this.gaugelist = [];
        this.datasource = [];
        this.ctl = null;
        $('#' + this.id).remove();        
    }

    this.init = function () {

    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id;
        },
        set: function (val) {
        }
    });
    //Column
    this.setColumn = function (val) {
        this.columns = val;
    }
    this.getColumn = function () {
        return this.columns;
    }

    //Gauge 초기화
    this.clear = function () {
        this.internalclear();
        this.datasource = [];
    }
    //Gauge 리스트 초기화
    this.internalclear = function () {
        if ($(this.id).length > 0) {
            $(this.id).empty();
        }
        this.gaugelist = [];
    }
    //Gauge 초기화
    this.beginInit = function () {
        this.clear();
    }
    //Add New Gauge
    this.addItem = function (title, value) {
        var item;
        item = {};
        item['id'] =this.id + this.datasource.length;
        item['title'] = title;
        item['value'] = value;
        this.datasource.push(item);
    }

    //Draw Gauge
    this.endInit = function () {
        this.internalclear();

        var i, ratio, hratio;
        var isStart;
        var isNewLine;
        var htmlTag = '';
        var gTag = ''

        //determine Width Ratio
        ratio = parseInt(100 / this.columns);
        ratio = ratio - 1;
        i = 0;
        var item;

        var rows = 0;

        //find Rows
        for (var j = 0 ; j < this.datasource.length; j++) {
            if (j % this.columns == 0) {
                rows = rows + 1;
            }
        }

        //determine Height Ratio
        hratio = parseInt(100 / rows);
        hratio = hratio - 1;

        for (var j = 0 ; j < this.datasource.length; j++) {
            item = this.datasource[j];

            if (i % this.columns == 0) {
                isNewLine = true;
            }
            else {
                isNewLine = false;
            }

            if (isNewLine == true) {
                if (isStart == true) {
                    htmlTag = htmlTag + "</div>";
                }
                isStart = true;
                htmlTag = htmlTag + "<div style='height:" + hratio + "%'>";
            }

            gTag = "<div id='" + item['id'];
            gTag = gTag + "' data-select = false style = 'display: inline-block; minWdith:200px; minHeight:200px; height:100%;width:" + ratio.toString();
            gTag = gTag + "%; position: relative'><div id='c" + item['id'] + "' style='z-index: 9999; height:100%; width:100%; position: absolute'></div></div>";
            htmlTag = htmlTag + gTag;
            i = i + 1;
        }

        //Last
        if (isNewLine == true) {
            htmlTag = htmlTag + "</div>";
        }

        //Make Div Table
        $('#' + this.id).append(htmlTag);

        var gid, cgid;
        var gctl;

        var rangearr = [];

        //range
        if (this.rangeCount > 0) {
            var range, gap, curValue;
            gap = parseInt((this.endValue - this.startValue) / this.rangeCount);
            curValue = this.startValue;

            for (i = 0; i < this.rangeCount ; i++) {
                range ={};
                range['startValue'] = curValue
                if (i == this.rangeCount - 1) {
                    range['endValue'] = this.endValue;
                }
                else {
                    curValue = curValue + gap;
                    range['endValue'] = curValue;
                }
                curValue = curValue + 1;
                rangearr.push(range);
            }
        }

        //Shape
        var geoShape = {};
        geoShape['startAngle'] = this.startAngle;
        geoShape['endAngle'] = this.endAngle;
        geoShape['orientation'] = this.orientation;

        var parent = this;
        //Create Gauge
        for (var j = 0 ; j < this.datasource.length; j++) {
            item = this.datasource[j];
            gid = '#' + item['id'];

            //Must be subeValue
            $(gid).dxLinearGauge({ subvalues: item['value'], subvalueIndicator: { type: 'textCloud', color: this.subvaluecolor, text: { font: { size: 10 } } } });

            gctl = $(gid).dxLinearGauge('instance');
            gctl.option('geometry', geoShape);
            gctl.option('scale', {
                startValue: parseFloat(this.startValue), endValue: parseFloat(this.endValue), tickInterval: parseFloat(this.tickInterval), label: {
                    useRangeColors: true,
                    customizeText: function (arg) {
                        return numFormat(arg.valueText);
                    }
                }
            });
            gctl.option('rangeContainer', { palette: this.palette, ranges: rangearr });
            gctl.option('title', { text: item['title'], font: { size: this.fontsize } });
            gctl.option('valueIndicator', { type: this.valueindicatortype, color: this.valueindicatorcolor });
            gctl.option('value', item['value']);

            cgid = '#c' + item['id'];
            $(cgid).on("click", function (data) {
                var id = data.target.parentElement.id;
                if (id != 'undefined' && id != "") {
                    for (var i = 0; i < parent.gaugelist.length; i++) {
                        //if ($('#' + id).data('select') == true) {
                        if ($('#' + parent.gaugelist[i]._$element[0].id).data('select') == true) {
                            $('#c' + parent.gaugelist[i]._$element[0].id).css('background-color', 'rgba(0,0,0,0)');
                        }
                    }
                    $('#' + id).data('select', true);
                    $('#' + this.id).css('background-color', 'rgba(0,0,0,0.1)');

                    id = id.replace('/' + this.id + '/gi', '');
                    if (parent.callback != undefined) {
                        parent.callback(parent.datasource[id]);
                    }
                }
            });
            this.gaugelist.push(gctl);
        }
    }

    function numFormat(n) {
        var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
        n += '';                          // 숫자를 문자열로 변환

        while (reg.test(n))
            n = n.replace(reg, '$1' + ',' + '$2');

        return n;
    }
    //Gauge 데이터 추가
    this.setItemsSource = function (tmhandler) {
        var vrow, vcol;
        var datalist;
        var i, j;
        var value, id;
        var keyslist = [];
        var item;

        this.clear();
        datalist = JSON.parse(tmhandler.getResult());
        vrow = datalist.length;
        for (var key in datalist[0]) {
            keyslist.push(key)
        }

        vcol = keyslist.length;
        this.seriesCnt = vcol - 1;
        for (i = 0; i < vrow; i++) {

            for (j = 0; j < vcol; j++) {
                value = datalist[i][keyslist[j]];
                if (j == 0) {
                    item ={};
                    item['id'] = this.id + this.datasource.length;
                    item['title'] = value;
                }
                else {
                    item['value'] = parseFloat(value);
                }
            }
            this.datasource.push(item);
        }
        this.endInit();
    }
    //Gauge 제목 설정
    this.setTitle = function (val) {
        this.ctl.option('title', { text: val, font: { size: this.ctl.option('title').font.size } });
    }
    //Gauge 제목 크기 설정
    this.setTitleFontSize = function (val) {
        this.ctl.option('title', { text: this.ctl.option('title').text, font: { size: val } });
    }
    //Gauge 값 설정
    this.setValue = function (val) {
        this.ctl.option('value', val);
    }
}
//활성화 여부 반환
if (!oz_linearGauge.prototype.getEnabled) {
    oz_linearGauge.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 설정
if (!oz_linearGauge.prototype.setEnabled) {
    oz_linearGauge.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 반환
if (!oz_linearGauge.prototype.getVisible) {
    oz_linearGauge.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 설정
if (!oz_linearGauge.prototype.setVisible) {
    oz_linearGauge.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//디자인 속성
if (!oz_linearGauge.prototype.setAttr) {
    oz_linearGauge.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/*--------------------------------------------------
    Bar Gauge
----------------------------------------------------*/
function oz_barGauge(id) {
    this.id = id;
    this.ctl;

    this.startAngle = 90;
    this.endAngle = 0;
    this.startValue = 0;
    this.endValue = 150;
    this.palette = 'pastel';
    this.columns = 1;
    this.gaugelist = [];
    this.datasource = [];
    this.fontsize = 16;
    this.indent = 15;
    this.precision = 1;
    this.labelformat = 'fixedPoint';
    this.callback; //Event Callback
    this.labelindex = 0;
    this.labelslist = [];

    //자원 반환
    this.dispose = function () {
        this.gaugelist = [];
        this.datasource = [];
        this.labelslist = [];
        this.ctl = null;
        $('#' + this.id).remove();        
    }

    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id;
        },
        set: function (val) {
        }
    });

    //Column
    this.setColumn = function (val) {
        this.columns = val;
    }
    this.getColumn = function () {
        return this.columns;
    }

    this.init = function () {

    }
    //Gauge List Clear
    this.clear = function () {
        $(this.id).empty();
        this.gaugelist = [];
    }
    //Gauge Clear
    this.beginInit = function () {
        this.labelslist = [];
        this.labelindex = -1;
        this.clear();
    }

    //Add New Gauge
    this.addItem = function (title, labels, values) {
        var item;
        item = {};
        item['id'] = this.id + this.datasource.length;
        item['title'] = title;
        //item['labels'] = labels;
        for (var i = 0; i < labels.length; i++) {
            this.labelslist.push(labels[i]);
        }
        item['values'] = values;
        this.datasource.push(item);
    }

    //Draw Gauge
    this.endInit = function () {
        this.clear();

        var i, ratio, hratio;
        var isStart;
        var isNewLine;
        var htmlTag = '';
        var gTag = ''

        //determine Width Ratio
        ratio = parseInt(100 / this.columns);
        ratio = ratio - 5;
        i = 0;
        var item;

        var rows = 0;

        //find Rows
        for (var j = 0 ; j < this.datasource.length; j++) {
            if (j % this.columns == 0) {
                rows = rows + 1;
            }
        }

        //determine Height Ratio
        hratio = parseInt(100 / rows);
        hratio = hratio - 5;

        for (var j = 0 ; j < this.datasource.length; j++) {
            item = this.datasource[j];

            if (i % this.columns == 0) {
                isNewLine = true;
            }
            else {
                isNewLine = false;
            }

            if (isNewLine == true) {
                if (isStart == true) {
                    htmlTag = htmlTag + "</div>";
                }
                isStart = true;
                htmlTag = htmlTag + "<div style='height:" + hratio + "%; margin: 0px 0px 15px 20px;'>";
            }

            gTag = "<div id='" + item['id'];
            gTag = gTag + "' data-select = false style = 'display: inline-block; minWdith:200px; minHeight:200px; height:100%;width:" + ratio.toString();
            gTag = gTag + "%; position: relative; margin: 10px;'><div id='c" + item['id'] + "' style='z-index: 9999; height:100%; width:100%; position: absolute'></div></div>";
            htmlTag = htmlTag + gTag;
            i = i + 1;
        }

        //Last
        if (isNewLine == true) {
            htmlTag = htmlTag + "</div>";
        }

        //Make Div Table
        $('#' + this.id).append(htmlTag);

        var gid, cgid;
        var gctl;

        var rangearr = [];
        var inst = this;
        //range
        if (this.rangeCount > 0) {
            var range, gap, curValue;
            gap = parseInt((this.endValue - this.startValue) / this.rangeCount);
            curValue = this.startValue;

            for (i = 0; i < this.rangeCount ; i++) {
                range ={};
                range['startValue'] = curValue
                if (i == this.rangeCount - 1) {
                    range['endValue'] = this.endValue;
                }
                else {
                    curValue = curValue + gap;
                    range['endValue'] = curValue;
                }
                curValue = curValue + 1;
                rangearr.push(range);
            }
        }

        //Shape
        var geoShape = {};
        geoShape['startAngle'] = this.startAngle;
        geoShape['endAngle'] = this.endAngle;

        var parent = this;
        //Create Gauge
        for (var j = 0 ; j < this.datasource.length; j++) {
            item = this.datasource[j];
            gid = '#' + item['id'];

            //Must be subeValue
            $(gid).dxBarGauge();

            gctl = $(gid).dxBarGauge('instance');
            gctl.option('geometry', geoShape);
            gctl.option('startValue', parseFloat(this.startValue));
            gctl.option('endValue', parseFloat(this.endValue));
            gctl.option('palette', this.palette);
            gctl.option('title', { text: item['title'], font: { size: this.fontsize } });
            gctl.option('labels', item['labels']);
            gctl.option('values', item['values']);
            gctl.option('label', {
                indent: this.indent, format: this.labelformat, precision: this.precision, font: { size: 12 },
                customizeText: function (arg) {
                    if (arg.index == undefined) {
                        return;
                    };
                    inst.labelindex = inst.labelindex + 1;
                    returnValue = inst.labelslist[inst.labelindex] + " - " + arg.valueText + ' %'
                    if (inst.labelindex == inst.labelslist.length - 1) inst.labelindex = -1;
                    return returnValue;
                }
            });

            cgid = '#c' + item['id'];
            $(cgid).on("click", function (data) {
                var id = data.target.parentElement.id;
                if (id != 'undefined' && id != "") {
                    for (var i = 0; i < parent.gaugelist.length; i++) {
                        if ($('#' + parent.gaugelist[i]._$element[0].id).data('select') == true) {
                            $('#c' + parent.gaugelist[i]._$element[0].id).css('background-color', 'rgba(0,0,0,0)');
                        }
                    }
                    $('#' + id).data('select', true);
                    $('#' + this.id).css('background-color', 'rgba(0,0,0,0.1)');

                    id = id.replace('/' + this.id + '/gi', '');
                    if (parent.callback != undefined) {
                        parent.callback(parent.datasource[id]);
                    }

                }
            });
            this.gaugelist.push(gctl);
        }
    }
    //Gauge 데이터 추가
    this.setItemsSource = function (tm) {
        var vrow, vcol;
        var datalist;
        var i, j;
        var value, id;
        var keyslist = [];
        var item;

        this.clear();
        datalist = JSON.parse(tm.getResult());
        vrow = datalist.length;
        for (var key in datalist[0]) {
            keyslist.push(key)
        }

        vcol = keyslist.length;

        var valuelist =[];
        var xlabellist =[];
        for (i = 0; i < vrow; i++) {
            xlabellist.push(datalist[i][keyslist[0]]);
        }
        
        for (j = 1; j < vcol; j++) {
            item = {};
            item['id'] = this.id + this.datasource.length;
            item['labels'] = xlabellist;
            item['title'] = keyslist[j];
            valuelist = [];
            for (i = 0; i < vrow; i++) {
                valuelist.push( parseFloat(datalist[i][keyslist[j]]));
            }
            item['values'] = valuelist;
            this.datasource.push(item);
        }

        for (var i = 0; i < xlabellist.length; i++) {
            this.labelslist.push(xlabellist[i]);
        }

        this.endInit();
    }
    //Gauge 제목 설정
    this.setTitle = function (val) {
        this.ctl.option('title', { text: val, font: { size: this.ctl.option('title').font.size } });
    }
    //Gauge 제목 크기 설정
    this.setTitleFontSize = function (val) {
        this.ctl.option('title', { text: this.ctl.option('title').text, font: { size: val } });
    }
    //Gauge 값 설정
    this.setValues = function (val) {
        this.ctl.option('value', val);
    }
}
//활성화 여부 설정
if (!oz_barGauge.prototype.getEnabled) {
    oz_barGauge.prototype.getEnabled = function () {
        return !this.ctl.option('disabled');
    }
}
//활성화 여부 반환
if (!oz_barGauge.prototype.setEnabled) {
    oz_barGauge.prototype.setEnabled = function (val) {
        this.ctl.option('disabled', !val);
    }
}
//Visible 여부 설정
if (!oz_barGauge.prototype.getVisible) {
    oz_barGauge.prototype.getVisible = function () {
        return this.ctl.option('visible');
    }
}
//Visible 여부 반환
if (!oz_barGauge.prototype.setVisible) {
    oz_barGauge.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
//디자인 속성 추가
if (!oz_barGauge.prototype.setAttr) {
    oz_barGauge.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/**
 * @description obzenGroupHeader컨트롤
 * @param id
 */
function oz_groupheader(id) {
    this.id = '#' + id;
    this.init = function () {
    }
    //자원 반환
    this.dispose = function () {
    }
}

//Visible 여부 반환
if (!oz_groupheader.prototype.getVisible) {
    oz_groupheader.prototype.getVisible = function () {
        if ($(this.id).prop('style').display == 'none') {
            return false;
        }
        else {
            return true;
        }
    }
}
//Visible 여부 설정
if (!oz_groupheader.prototype.setVisible) {
    oz_groupheader.prototype.setVisible = function (val) {
        if (val == true) {
            $(this.id).prop('style').display = 'inline-block';
        }
        else {
            $(this.id).prop('style').display = 'none';
        }
    }
}
//활성화 여부 반환
if (!oz_groupheader.prototype.getEnabled) {
    oz_groupheader.prototype.getEnabled = function () {
        return !$(this.id).prop('disabled');
    }
}
//활성화 여부 설정
if (!oz_groupheader.prototype.setEnabled) {
    oz_groupheader.prototype.setEnabled = function (val) {
        $(this.id).prop('disabled', !val);
    }
}


/**
* @description : 트리 컨트롤
* @param id 
*/
function oz_tree(id) {
    var keyName;
    var gridinfo = [];
    var treedata = [];
    var nodelist = [];
    var selnode = null;
    var ctltree;
    var onClick;
    var orgDataSource;

    this.id = '#' + id;

    //자원 반환
    this.dispose = function () {
        onClick = null;
        $(this.id).remove();
        gridinfo = [];
        treedata = [];
        nodelist = [];
        ctltree = null;
        orgDataSource = null;
    }

    this.init = function () {
        $(this.id).dxTreeView({
            dataSource: treedata,
            noDataText: '',
            expandedExpr: "expanded",
            expandNodesRecursive: false,
            onItemClick: function (e) {
                var item = e.itemData;
                selnode = null;
                if (item.isLeaf === true) {
                    selnode = item;
                    if (onClick != null) {
                        onClick();
                    }
                }

            }
        });
        ctltree = $(this.id).dxTreeView('instance');
        $(this.id).css("border", "1px solid #D0D0D0");
        return ctltree;
    }

    //Click Event
    Object.defineProperty(this, 'onClick', {
        get: function () {
            return onClick;
        },
        set: function (val) {
            onClick = val;
        }
    });
    Object.defineProperty(this, 'GridInformation', {
        get: function () {
            return gridinfo;
        },
        set: function (val) {
            gridinfo = val;
        }
    });

    Object.defineProperty(this, 'width', {
        get: function () {
            return ctltree.option('width');
        },
        set: function (val) {
            ctltree.option('width', val);
        }
    });

    Object.defineProperty(this, 'height', {
        get: function () {
            return ctltree.option('height');
        },
        set: function (val) {
            ctltree.option('height', val);
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return !ctltree.option('disabled');
        },
        set: function (val) {
            ctltree.option('disabled', !val);
        }
    });

    Object.defineProperty(this, 'visible', {
        get: function () {
            return ctltree.option('visible');
        },
        set: function (val) {
            ctltree.option('visible', val);
        }
    });

    this.init_control = function(gridCampInfocolinfo){
        gridinfo = gridCampInfocolinfo;
    }

    //현재 선택된 노드의 Key값을 반환한다.
    this.getNodeKeyValue = function () {
        if (selnode === null) {
            return '';
        } else {
            var i;
            for (i = 0; i < orgDataSource.length; i++) {
                if (orgDataSource[i].nodeid === selnode.id) {
                    return orgDataSource[i][keyName];
                }
            }
        }
    }

    //Draw Tree
    this.setItemsSource = function (resultArr) {
        var i = -1;
        var j;
        var nodeid;
        var keylist = [];
        var hiddenlist = new ozf_Collection();
        var cnt;

        treedata = [];
        nodelist = [];

        if (resultArr.length === 0) {
            ctltree.option('items', treedata);
            return;
        }

        ctltree.beginUpdate();
        ctltree.option('items', treedata);
        
        //get Key List and hidden list
        for (key in resultArr[0]) {
            keylist.push(key);
            i = i + 1;
            cnt = gridinfo.length;
            for (j = 0; j < cnt; j++) {
                if (gridinfo[i].binding === key) {
                    if (gridinfo[i].isHide === true) {
                        hiddenlist.put(i.toString(), i.toString())
                    }
                }
            }
        }

        //find key col
        cnt = gridinfo.length;
        for (i = 0; i < cnt; i++) {
            if (gridinfo[i].isKey === true) {
                keyName = gridinfo[i].binding;
                break;
            }
        }

        var key;
        var nodedata;
        var keycnt;
        cnt = resultArr.length;
        for (i = 0; i < cnt; i++) {
            nodedata = [];
            keycnt = keylist.length;
            for (j = 0; j < keycnt; j++) {
                if (!hiddenlist.containsKey(j)) {
                    key = keylist[j];
                    nodedata.push(resultArr[i][key]);
                }
            }
            nodeid = make_Node(nodedata)
            resultArr[i].nodeid = nodeid;
        }

        ctltree.option('items', treedata);
        ctltree.endUpdate();
        ctltree.repaint();
        orgDataSource = resultArr;
    }

    function make_Node(nodeData) {
        var i;
        var level = 0;
        var pNode = null;
        var cNode;
        var leafNodeId;
        var cnt = nodeData.length;

        for (i = 0; i < cnt ; i++) {
            cNode = find_Node(pNode, nodeData[i], level);
            if (cNode == null) {
                pNode = add_Node(pNode, nodeData[i], level)
            } else {
                pNode = cNode;
            }
            level = level + 1;
            if (i === nodeData.length - 1) {
                leafNodeId = pNode.id;
                pNode.isLeaf = true;
            }
        }
        return leafNodeId;
    }

    //Add Node
    function add_Node(pNode, nodeText, level) {
        var newNodeItem = make_NodeData(nodeText, level);
        if (pNode !== null) {
            pNode.items.push(newNodeItem);
        } else {
            treedata.push(newNodeItem);
        }
        nodelist.push(newNodeItem);
        return newNodeItem;
    }

    //Node Data
    function make_NodeData(nodeText, level) {
        var nodeitem = new Object()
        nodeitem.id = nodelist.length + 1;
        nodeitem.level = level;
        nodeitem.text = nodeText;
        nodeitem.expanded = true;
        nodeitem.items = [];
        nodeitem.isLeaf = false;
        return nodeitem;
    }

    //Find Node
    function find_Node(pNode, nodetext, level) {
        var i;
        var cnt;
        if (pNode !== null) {
            cnt = pNode.items.length;
            for (i = 0; i < cnt; i++) {
                if (pNode.items[i].text === nodetext) {
                    return pNode.items[i];
                }
            }
        } else {
            cnt = nodelist.length;
            for (i = 0; i < cnt; i++) {
                if (nodelist[i].text === nodetext) {
                    if (nodelist[i].level === level) {
                        return nodelist[i]
                    }
                }
            }
        }
        return null;
    }


}
//버튼 이벤트리스너 추가
if (!oz_tree.prototype.addEventListener) {
    oz_tree.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onClick":
                this.onClick = f;
                break;
        }
    }
}


/**
 * @description obzenListbox
 * @param id
 */
function oz_listbox(id) {
    var inst = this;
    var listbox;
    var dataSource = [];
    var dataSourceCode = [];
    var onClick;
    var valuelist = '';
    var codelist = '';
    var delimiter = ";";
    var userdefined = false;
    this.id = '#' + id;

    //자원 반환
    this.dispose = function () {
        onEnterKey = null;
        dataSource = [];
        dataSourceCode = [];
        $(this.id).remove();
        listbox = null;
        inst = null;
    }

    //생성자
    this.init = function () {
        $(this.id).dxList({
            dataSource: dataSource,
            allowItemDeleting: false,
            selectionMode: "multiple",
            showSelectionControls: true,
            itemTemplate: function (data) { return $("<div>").text(data.Name); },
            noDataText: '',
            onSelectionChanged: function (e) {
                var selectedItems = e.component.option("selectedItems")
                if (onClick != null) {
                    onClick();
                }
            }
        });
        listbox = $(this.id).dxList('instance');
        return listbox;
    }

    //Click Event
    Object.defineProperty(this, 'onValueChanged', {
        get: function () {
            return onClick;
        },
        set: function (val) {
            onClick = val;
        }
    });

    Object.defineProperty(this, 'ctl', {
        get: function () {
            return listbox;
        },
        set: function (val) {
            //listbox = val;
        }
    });
    Object.defineProperty(this, 'delimiter', {
        get: function () {
            return delimiter;
        },
        set: function (val) {
            delimiter = val;
        }
    });
    Object.defineProperty(this, 'multiSelectmode', {
        get: function () {            
            if (listbox.option('selectionMode') === 'multiple'){
                return true;
            } else {
                    return false;
            }
        },
        set: function (val) {
            if (val) {
                listbox.option('selectionMode', 'multiple')
            } else {
                listbox.option('selectionMode', 'single')
            }
        }
    });
    Object.defineProperty(this, 'header', {
        get: function () {
            //return delimiter;
        },
        set: function (val) {
            //delimiter = val;
        }
    });
    Object.defineProperty(this, 'userdefined', {
        get: function () {
            return userdefined;
        },
        set: function (val) {
            userdefined = val;
        }
    });
    Object.defineProperty(this, 'dataSource', {
        get: function () {
            return dataSource;
        },
        set: function (val) {
            dataSource = val;
        }
    });
    Object.defineProperty(this, 'CodeList', {
        get: function () {
            return this.codelist;
        },
        set: function (val) {
            this.codelist = val;
            this.setCodeList(this.codelist);
        }
    });

    Object.defineProperty(this, 'ValueList', {
        get: function () {
            return this.valuelist;
        },
        set: function (val) {
            this.valuelist = val;
            this.setValueList(this.valuelist);
        }
    });

    Object.defineProperty(this, 'listCount', {
        get: function () {
            return dataSource.length;
        },
        set: function (val) {
            
        }
    });


    this.getValue = function () {
        return this.Value;
    }

    Object.defineProperty(this, 'Value', {
        get: function () {
            var selectedItems = listbox.option("selectedItems");
            var i;
            var buf = '';
            var cnt = selectedItems.length;
            for (i = 0; i < cnt; i++) {
                buf = buf + selectedItems[i].Name + this.delimiter;
            }
            buf = ozf_RemoveLastDelimiter(buf, this.delimiter);
            return buf;
        },
        set: function (val) {
            if (ozf_StringIsEmpty(val)) {
                return;
            }
            var valuelist1 = '';
            valuelist1 = ozf_RemoveLastDelimiter(val, this.delimiter);

            var i;
            var j;
            var selectkeys = [];
            var arrvalue = valuelist1.split(this.delimiter);
            var itemlist = listbox.option('dataSource').items();
            var cnt = arrvalue.length;
            var cnt1 = itemlist.length;
            for (i = 0; i < cnt; i++) {
                for (j = 0; j < cnt1; j++) {
                    if (itemlist[j].Name === arrvalue[i]) {
                        listbox.selectItem(j);
                        break;
                    }
                }
            }
            //listbox.option("selectedItemKeys", selectkeys);
            //listbox.option("selectedItems", arrvalue);
        }
    });

    Object.defineProperty(this, 'Code', {
        get: function () {
            if (dataSourceCode.length === 0) {
                return '';
            }

            var selectedItemKeys = listbox.option("selectedItemKeys");
            var i;
            var index;
            var buf = '';
            var cnt = selectedItemKeys.length;
            var cnt1 = dataSourceCode.length;
            for (i = 0; i < cnt; i++) {
                index = selectedItemKeys[i].Code;
                if (index < cnt1) {
                    buf = buf + dataSourceCode[index] + this.delimiter;
                }
            }
            buf = ozf_RemoveLastDelimiter(buf, this.delimiter);
            return buf;
        },
        set: function (val) {
            if(ozf_StringIsEmpty(val)) {
                return;
            }
            if (dataSourceCode.length === 0) {
                return;
            }
            var i;
            var j;
            var selectedItemKeys = [];
            var valuelist1 = '';
            valuelist1 = ozf_RemoveLastDelimiter(val, this.delimiter);
            var arrvalue = valuelist1.split(this.delimiter);
            var cnt = arrvalue.length;
            var cnt1 = dataSourceCode.length;
            for (i = 0; i < cnt; i++) {
                for (j = 0; j < cnt1; j++) {
                    if (arrvalue[i] === dataSourceCode[j]) {
                        listbox.selectItem(j);
                        break;
                    }
                }
            }
            //listbox.option("selectedItemKeys", selectedItemKeys);
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return !listbox.option('disabled');
        },
        set: function (val) {
            listbox.option('disabled', !val);
        }
    });

    Object.defineProperty(this, 'visible', {
        get: function () {
            return listbox.option('visible');
        },
        set: function (val) {
            listbox.option('visible', val);
        }
    });

    this.getCode = function () {
        return this.Code;
    }

    this.setCode = function (val) {
        this.Code = val;
    }

    //Draw Tree
    this.setItemsSource = function (resultArr) {
        dataSource = [];
        dataSourceCode = [];

        if (resultArr.length === 0) {
            //grid.clear();
            return;
        }
        
        //get Key List and hidden list
        for (key in resultArr[0]) {
            keylist.push(key);            
        }

        var i;
        var j;
        var item;
        var cnt = resultArr.length;
        var cnt1 = keylist.length;
        for (i = 0; i < cnt; i++) {
            for (j = 0; j < cnt1; j++) {
                if (j = 0) {
                    item = {};
                    item.Name = resultArr[i][keylist[j]];
                    item.Code = i;
                    dataSource.push(item);
                } else {
                    dataSourceCode.push(resultArr[i][keylist[j]]);
                }
            }
        }
    }

    this.clear = function () {
        dataSource = [];
        dataSourceCode = [];
    }

    this.setValueList = function (val) {
        this.valuelist = val;
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        if (this.delimiter == "") {
            ozf_MsgBox("구분자를 지정 하세요.");
            return;
        }

        var valuelist1 = '';
        valuelist1 = ozf_RemoveLastDelimiter(this.valuelist, this.delimiter);

        var arrvalue = valuelist1.split(this.delimiter);
        var item;
        var cnt = arrvalue.length;
        dataSource = [];
        for (i = 0; i < cnt; i++) {
            item = {};
            item.Name = arrvalue[i];
            item.Code = i;
            dataSource.push(item);
        }
    }

    this.setCodeList = function (val) {
        this.codelist = val;
        if (ozf_StringIsEmpty(val) == true) {
            return;
        }
        if (this.delimiter == "") {
            ozf_MsgBox("구분자를 지정 하세요.");
            return;
        }
        
        var valuelist1 = '';
        valuelist1 = ozf_RemoveLastDelimiter(this.codelist, this.delimiter);

        var arrvalue = valuelist1.split(this.delimiter);
        var cnt = arrvalue.length;
        dataSourceCode = [];
        for (i = 0; i < cnt; i++) {           
            dataSourceCode.push(arrvalue[i]);
        }   
    }
}

//구분자 설정
if (!oz_listbox.prototype.setListDelimiter) {
    oz_listbox.prototype.setListDelimiter = function (val) {
        this.delimiter = val;
        //this.setValueList(this.valuelist);
        //this.setCodeList(this.codelist);
    }
}
//콤보에 코드값 넣기
if (!oz_listbox.prototype.setCodeList) {
    oz_listbox.prototype.setCodeList = function (val) {
        this.setCodeList(val);
    }
}
//캡션값 개수 설정
if (!oz_listbox.prototype.setValueListCount) {
    oz_listbox.prototype.setValueListCount = function (val) {
        this.setValueList(this.valuelist);
    }
}

if (!oz_listbox.prototype.listCount) {
    oz_listbox.prototype.listCount = function () {
        return this.dataSource.length;
    }
}

if (!oz_listbox.prototype.refresh) {
    oz_listbox.prototype.refresh = function () {
        var data = new DevExpress.data.DataSource({
            store: this.dataSource,
            searchOperation: "contains",
            searchExpr: "Name"
        });
        this.ctl.option('dataSource', []);
        this.ctl.option('dataSource', data);
        this.ctl.repaint();
    }
}

//이벤트 리스너 추가
if (!oz_listbox.prototype.addEventListener) {
    oz_listbox.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "onClick":
                this.onValueChanged = f;
                break;
        }
    }
}
//Visible 여부 설정
if (!oz_listbox.prototype.setVisible) {
    oz_listbox.prototype.setVisible = function (val) {
        this.ctl.option('visible', val);
    }
}
if (!oz_listbox.prototype.setData) {
    oz_listbox.prototype.setData = function (purpose, address, content) {
        if (purpose === "begininit") {
            //this.setValueFlag = true;
        } else if (purpose === "endinit") {
            //this.setValueFlag = false;
        }

    }
}    


function oz_tablelayout(id) {
    this.id = '#' + id;
    this.ctl;
    //생성자
    this.init = function () {
        this.ctl = $(this.id)[0];

        return this.ctl;
    }
    //자원 반환
    this.dispose = function () {
       
    }
    Object.defineProperty(this, 'Name', {
        get: function () {
            return this.id.replace('\#', '');
        },
        set: function (val) {
        }
    });

    Object.defineProperty(this, 'visible', {
        get: function () {
            return this.getVisible();
        },
        set: function (val) {
            this.setVisible(val);
        }
    });

    Object.defineProperty(this, 'enabled', {
        get: function () {
            return !this.getEnabled();
        },
        set: function (val) {
            this.setEnabled(val);
        }
    });

    this.rowStyleSizeType = function (index, type) {
        var findid = this.id + ' tr';
        var h = $(findid)[index].style.height;
        h = parseInt(h);
        if (type === 2) {
            h = h + '%';
        } else {
            h = h + 'px';
        }
        $(findid)[index].style.height = h;
    }

    this.rowStyleHeight = function (index, size) {
        var findid = this.id + ' tr';
        var h = $(findid)[index].style.height;
        if (h.endsWith('%')) {
            h = '%';
        }
        else {
            h = 'px';
        }
        h = size + h;
        $(findid)[index].style.height = h;
    }
}
//Visible 여부 반환
if (!oz_tablelayout.prototype.getVisible) {
    oz_tablelayout.prototype.getVisible = function () {
        if ($(this.id).prop('style').display == 'none') {
            return false;
        }
        else {
            return true;
        }
    }
}
//Visible 여부 설정
if (!oz_tablelayout.prototype.setVisible) {
    oz_tablelayout.prototype.setVisible = function (val) {
        if (val == true) {
            $(this.id).prop('style').display = 'inline-block';
        }
        else {
            $(this.id).prop('style').display = 'none';
        }
    }
}
//이미지 경로 반환
if (!oz_tablelayout.prototype.getImagePath) {
    oz_tablelayout.prototype.getImagePath = function () {
        return $(this.id).prop('src');
    }
}
//이미지 경로 설정
if (!oz_tablelayout.prototype.setImagePath) {
    oz_tablelayout.prototype.setImagePath = function (val) {
        $(this.id).prop('src', val);
    }
}
//활성화 여부 반환
if (!oz_tablelayout.prototype.getEnabled) {
    oz_tablelayout.prototype.getEnabled = function () {
        return !$(this.id).prop('disabled');
    }
}
//활성화 여부 설정
if (!oz_tablelayout.prototype.setEnabled) {
    oz_tablelayout.prototype.setEnabled = function (val) {
        $(this.id).prop('disabled', !val);
    }
}
//디자인 속성 추가
if (!oz_tablelayout.prototype.setAttr) {
    oz_tablelayout.prototype.setAttr = function (attr, val) {
        $(this.id).css(attr, val);
    }
}

/*--------------------------------------------------
      Filter Explorer Control
    ----------------------------------------------------*/
    var mVarFilterExpID;    // valuelist 조회 할 아이템의 filterexplorer ID
    var mVarMaxValueCount = 20;
    function oz_filterExplorer(id) {
        this.id = '#' + id;
        this.datalist = [];
        this.Auto_ValueListMode = true;
        this.items = [];
        this.visible = true;
        this.enable = true;
        this.groups;
        this.isInitValue;

        var inst = this;
        var _address = "";
        var _itemMaxHeight;
        var _groupStyle = true;
        var _searchVisible = true;
        var retcnt = 0;
        var allretcnt = 0;

        //valuelist popup
        this._selitem = new Object();
        this._selindex = new Array();
        this._preselindex = new Array();
        this._valuelist = '';
        this._codelist = '';
        this.valuelistpopup = new oz_valuelistPopup();

    
        Object.defineProperty(this, 'Address', {
            get: function () {
                return _address.join(";");
            },
            set: function (val) {
                val = val.replace(/\s/g, "");
                _address = val.split(";");
            }
        });

        Object.defineProperty(this, 'DisplayOrderList', {
            get: function () {
                return '';
            },
            set: function (val) {
                //todo;
            }
        });

        Object.defineProperty(this, 'UseLinkName', {
            get: function () {
                return '';
            },
            set: function (val) {
                //todo
            }
        });

        Object.defineProperty(this, 'ItemMaxHeight', {
            get: function () {
                return _itemMaxHeight;
            },
            set: function (val) {
                _itemMaxHeight = val;
            }
        });

        Object.defineProperty(this, 'enabled', {
            get: function () {
                return this.getEnabled();
            },
            set: function (val) {
                this.setEnabled(val);
            }
        });

        Object.defineProperty(this, 'FilterXML', {
            get: function () {
                return this.getFilterXML();
            },
            set: function (val) {
                this.Apply_FilterXML(val);
            }
        });

        // Object.defineProperty(this, 'visible', {
        //     get: function () {
        //         return this.getVisible();
        //     },
        //     set: function (val) {
        //         this.setVisible(val);
        //     }
        // });

        Object.defineProperty(this, 'groupStyle', {
            get: function () {
                return _groupStyle;
            },
            set: function (val) {
                if(_groupStyle == val) return;

                _groupStyle = val;

                if(_groupStyle) {
                    //groupStyle: true
                    this.items = _.sortBy(this.items, function(data){ 
                        if(data.islayer)    //DimensionLayer일 경우
                            return [data.group.path, data.layername, data.layeridx];
                        else 
                            return [data.group.path, data.layername];
                    });
                } else {
                    //groupStyle: false
                    this.items = _.sortBy(this.items, function(data){
                        return [data.layername, data.layeridx];
                    });
                }
                //Table 새로고침
                this.tableRefresh();
            }
        });

        Object.defineProperty(this, 'SearchVisible', {
            get: function () {
                return _searchVisible;
            },
            set: function (val) {
                _searchVisible = val;

                if(_searchVisible) {
                    //searchVisible: true
                    $(this.id+" .expSearch-container").show();
                    $(this.id+" .expTable-container").css("top", "33px");
                } else {
                    //searchVisible: false
                    $(this.id+" .txt-searchexp").dxTextBox("instance").option("value", "");
                    $(this.id+" .expSearch-container").hide();
                    $(this.id+" .expTable-container").css("top", "0px");
                }
            }
        });
    
        //메타 주소 저장
        this.init = function () {
            $(this.id).addClass("ozfilterexplorer");
        }
    
        //Item들 정보 불러오기
        this.Initialize = function () {
            this.items = [];
            this.groups = [];
            var group;
            for(var i=0; i<_address.length; i++) {
                group = new Object();
                group.idx = i;
                group.isopen = true;
                group.path = _address[i];
                group.name = _address[i].substr(_address[i].lastIndexOf("/")+1, _address[i].length);
                this.groups.push(group);
            }

            var result = [];
            var folderresult = [];
            var layerresult = [];
            var layers = [];
            var xmldoc, layerxmldoc, resultxmldoc, resultstr;
            var i, j, k;
            for(i=0; i<_address.length; i++) {
                var metah;
                metah = new oza_MetaHandler("content", "<List><Item address='"+_address[i]+"' region=''/></List>", "<List><Info option='standard'/></List>");
                metah.execute(null, false);
    
                result = [];
                layerresult = [];
                flag_getMeta = true;
                xmldoc = ozf_getXMLDoc(metah.returncontent.replace(/\n/g,""));

                for(var n=0 ; flag_getMeta; n++) {
                    if(n) {
                        resultstr = this.getMetaData(folderresult);
                        xmldoc = ozf_getXMLDoc(resultstr.replace(/\n/g,""));
                    }

                    folderresult = [];
                    for(k=0; k<xmldoc.childNodes[0].childNodes.length; k++) {
                        resultxmldoc = xmldoc.childNodes[0].childNodes[k];
                        for(j=0; j<resultxmldoc.getElementsByTagName("Dimensions").length; j++) {
                            folderresult.push(resultxmldoc.getElementsByTagName("Dimensions")[j]);
                        }
                        for(j=0; j<resultxmldoc.getElementsByTagName("Facts").length; j++) {
                            folderresult.push(resultxmldoc.getElementsByTagName("Facts")[j]);
                        }
                        for(j=0; j<resultxmldoc.getElementsByTagName("Measures").length; j++) {
                            folderresult.push(resultxmldoc.getElementsByTagName("Measures")[j]);
                        }
                            
                        flag_getMeta = (folderresult.length ? true : false);
    
                        for(j=0; j<resultxmldoc.getElementsByTagName("Dimension").length; j++) {
                            result.push(resultxmldoc.getElementsByTagName("Dimension")[j]);
                        }
                        for(j=0; j<resultxmldoc.getElementsByTagName("Fact").length; j++) {
                            result.push(resultxmldoc.getElementsByTagName("Fact")[j]);
                        }
                        for(j=0; j<resultxmldoc.getElementsByTagName("Measure").length; j++) {
                            result.push(resultxmldoc.getElementsByTagName("Measure")[j]);
                        }
                        for(j=0; j<resultxmldoc.getElementsByTagName("CustomDimension").length; j++) {
                            result.push(resultxmldoc.getElementsByTagName("CustomDimension")[j]);
                        }
                        for(j=0; j<resultxmldoc.getElementsByTagName("ConditionDimension").length; j++) {
                            result.push(resultxmldoc.getElementsByTagName("ConditionDimension")[j]);
                        }
                        for(j=0; j<resultxmldoc.getElementsByTagName("DimensionLayer").length; j++) {
                            layerresult.push(resultxmldoc.getElementsByTagName("DimensionLayer")[j]);
                        }
                    }
                }

                //get Layer Contents
                if(layerresult.length) {
                    resultstr = this.getMetaData(layerresult);
                    layerxmldoc = ozf_getXMLDoc(resultstr.replace(/\n/g,"")).childNodes[0];
                    layers = [];
                    for(j=0; j<layerxmldoc.getElementsByTagName("DimensionLayer").length; j++) {
                        resultstr = this.getMetaData(layerxmldoc.getElementsByTagName("DimensionLayer")[j].getElementsByTagName("RefItem"));
                        resultxmldoc = ozf_getXMLDoc(resultstr.replace(/\n/g,""));
                        layers = resultxmldoc.childNodes[0].childNodes;
        
                        var nextlayer, expitem;
                        for(k=0; k<layers.length; k++) {
                            if(k < layers.length-1) {
                                nextlayer = [];
                                for(var m=k+1; m<layers.length; m++) {
                                    nextlayer.push(layers[m].getAttribute("ozid"));
                                }
                            } else {
                                nextlayer = [];
                            }
                            if(!this.checkDup(layerxmldoc.getElementsByTagName("DimensionLayer")[j])) {
                                expitem = new oz_expItem();
                                expitem.init(layers[k], layerxmldoc.getElementsByTagName("DimensionLayer")[j].getAttribute("name"), k+1, nextlayer);
                                //@@##
                                if(expitem.ctltype != "") {
                                    expitem.group = this.groups[i];
                                    this.items.push(expitem);
                                }
                            }
                        }
                    }
        
                }
                    
                resultstr = this.getMetaData(result);
                resultxmldoc = ozf_getXMLDoc(resultstr.replace(/\n/g,""));
                result = resultxmldoc.childNodes[0].childNodes;
                for(j=0; j<result.length; j++) {
                    if(!this.checkDup(result[j])) {
                        expitem = new oz_expItem();
                        expitem.init(result[j], "", null, false);
                        //@@##
                        if(expitem.ctltype != "") {
                            expitem.group = this.groups[i];
                            this.items.push(expitem);
                        }
                    }
                }
            }
    
            //Group Style 적용
            if(this.groupStyle){
                this.items = _.sortBy(this.items, function(data){ 
                    if(data.islayer)    //DimensionLayer일 경우
                        return [data.group.path, data.layername, data.layeridx];
                    else 
                        return [data.group.path, data.layername];
                });
            }
            else {
                this.items = _.sortBy(this.items, function(data){
                    return [data.layername, data.layeridx];
                });
            }
    
            this.drawControls();
    
            if(this.Auto_ValueListMode == true) {
                this.Get_AllValueList();
            }
        }
    
        this.Get_CodeTableOZIDList = function() {
            var items = this.items;
            var ozids = "";
            for(var i=0; i<items.length; i++) {
                if (items[i].codetableozid != "") {
                    if (i==0) ozids += items[i].codetableozid;
                    else ozids += ","+items[i].codetableozid;
                }
            }
            return ozids;
            //return this.getItemNameList();
        }

        // //Item들 이름 리스트 반환
        // this.getItemNameList = function () {
        //     var items = this.items;
        //     var names = "";
        //     for(var i=0; i<items.length; i++) {
        //         if(i==0) names += items[i].name;
        //         else names += ","+items[i].name;
        //     }
        //     return names;
        // }

        this.Set_CodeTableValueList = function (itemnm, itemvals, itemcds, delm) {
            this.setItemValueList(itemnm, itemvals, itemcds, delm);
        }
    
        //값 코드 리스트 넣기 (TM)
        this.setItemValueList = function (itemnm, itemvals, itemcds, delm) {
            if((itemcds.length != 0)&&(itemvals.split(delm).length != itemcds.split(delm).length)) {
                alert("\""+itemnm+"\"의 값과 코드의 개수가 다릅니다!");
            } else {
                //var items = _.where(this.items, {"name": itemnm});
                var items = _.where(this.items, {"codetableozid": itemnm});
                for(var i=0; i<items.length; i++) {
                    this.setValueToCtl(items[i], itemvals, itemcds, delm);
                }
                
                this.setControlSize(items, true);
                //retcnt += 1;    //@@##
            }
        }
    
        //값 코드 리스트 넣기 (OLAP예정)
        this.Get_AllValueList = function () {
            var ctlInst;
            //olaphandler로 값 가져오기
            var item, items;
            var olapcode, olapvalue;
            var id;
    
            items = this.items;
    
            showSplash("값 목록을 불러오는 중입니다.");
            ozController.controlsplashmode = true;

            allretcnt = items.length;   //@@##
            for(var i=0; i<items.length; i++) {
                item = items[i];

                if(item.itemtype.match("Dimension$") && (item.ctltype != "date" && item.ctltype != "text")) {
                    //@@##
                    if(item.layeridx > 1 && item.layeridx != null) {
                        allretcnt -= 1;
                    }

                    if(item.layeridx == null || item.layeridx == 1) {
                        if (!item.valuelist.length) {
                            var addr = "<List><Item address='" + item.id + "' region='manage' cubeozid='" + item.cubeid + "' querytype='sync'/></List>";
                            var cont = "<List><Info option='standard'/></List>";
                            var olaph = new oza_olaphandler('ValueList', addr, cont);
                            olaph.execute(ret_ValueList, item, true, false);
                        } else {
                            // 사용자디멘전인데  CodeTableOZID가 있을 경우 (2019-01-04 교보)
                            //if (item.codetableozid == "") {
                                allretcnt -= 1; //@@##
                                this.setValueToCtl(item, item.valuelist.join(item.delimiter), item.codelist.join(item.delimiter), item.delimiter);
                                this.setControlSize(item, false);
                            //} else {
                            //    allretcnt -= 1;
                            //}
                        }
                    }
                } else {
                    allretcnt -= 1;
                }
            }
            if(allretcnt == 0) {
                ozController.controlsplashmode = false;
                hideSplash();
            }
        }

        //값 코드 리스트 넣기 (OLAP예정)
        this.Get_LayerValueList = function (ozid) {
            var ctlInst;
            //olaphandler로 값 가져오기
            var item, items;
            var olapcode, olapvalue;
            var id;
    
            if(ozid == undefined) {
                return;
            } else {
                items = _.where(this.items, {"id": ozid});
            }
    
            showSplash("값 목록을 불러오는 중입니다.");
            ozController.controlsplashmode = true;

            allretcnt = items.length;   //@@##
            for(var i=0; i<items.length; i++) {
                item = items[i];

                var addr = "<List><Item address='" + item.id + "' region='manage' cubeozid='" + item.cubeid + "' querytype='sync'/></List>";

                var layers = _.where(this.items, {"layername" : item.layername});
                var cont = this.getLayerCondition( layers.splice(0, item.layeridx-1) );

                if (cont == false) {
                    ozController.controlsplashmode = false;
                    hideSplash();
                    retcnt = 0;
                    // console.log("hide");
                    return;
                }

                var olaph = new oza_olaphandler('ValueList', addr, cont);
                olaph.execute(ret_ValueList, item, true, false);
            }
            if(allretcnt == 0) {
                ozController.controlsplashmode = false;
                hideSplash();
            }
        }

        function ret_ValueList(item, returncontent, iserror, handler) {
            retcnt += 1;
            // console.log(item.name + " - " + retcnt);
            if (!iserror) {
                var parser = new oz_ValueListParser();
                parser.parse(returncontent);
                
                if (parser.ListCount > 0) {
                    inst.setValueToCtl(item, parser.CaptionList, parser.CodeList, parser.delimiter);
                    inst.setControlSize(item, false);
                }
            }
            if (retcnt == allretcnt) {  //@@##
            //if (retcnt == inst.items.length) {
                ozController.controlsplashmode = false;
                hideSplash();
                retcnt = 0;
                // console.log("hide");
            }
        }
    
        //체크박스 라디오버튼 일정 너비 적용
        this.setControlSize = function (items, isarr) {
            if(!this.visible) return;

            var item, ctls, max = 0, arr = [];
            if(isarr) arr = items;
            else arr.push(items);

            for(var i=0; i<arr.length; i++){
                item = arr[i];
                ctls = item.ctls;
                max = 0;
                if(item.ctltype == "checkgroup" || item.ctltype == "check") {
                    var len;
                    if (ctls.length > mVarMaxValueCount) {
                        len = mVarMaxValueCount;
                    } else {
                        len = ctls.length;
                    }

                    for(var j=0; j<len; j++){
                       if($("#"+ctls[j]).width() > max) max = $("#"+ctls[j]).width();
                       if (max > 110) break;
                    }

                    if(max < 50) {  // 너비 올림
                        max = 50;
                    } else {
                        max += 2;
                    }

                    //$("#"+item.id+"_1 .dx-checkbox").width(max);
                    $("#"+item.id+"_1 .dx-checkbox-text").css("padding-left", "20px");  //IE 1px 부족문제
                    //$("#"+item.id+"_1 .dx-checkbox").show();

                    if (item.allowAll) {
                        len -= 1;
                        document.getElementById("chk_"+item.id).style.width = max + "px";
                    }

                    for(var j=0; j<len; j++){
                        //$("#"+item.id+"_1 #chk_"+item.id+"_"+j).width(max);
                        document.getElementById("chk_"+item.id+"_"+j).style.width = max + "px";
                        //$("#"+item.id+"_1 #chk_"+item.id+"_"+j).show();
                    }

                    var container = $("#tr_"+item.id).find(".cond-container");
                    if (container.height() > 56) {
                        var btn = $("#more_"+item.id).dxButton("instance");
                        if (ctls.length > mVarMaxValueCount) {
                            btn.option('hint', "값 목록이 많아 모두 표시할 수 없습니다.");
                        } else {
                            btn.option('hint', "펼치기");
                        }
                        $("#more_"+item.id).css("display", "block");
                        container.css("max-height", "56px");
                    }
                } 
                else if(item.ctltype == "radiogroup") {
                    for(var j=0; j<ctls.length; j++){
                        radiobuttons = $("#"+ctls[j]+" .dx-radiobutton");
                        radiobuttons.show();
                        for(var k=0; k<radiobuttons.length; k++){
                          if(radiobuttons[k].clientWidth > max) max = radiobuttons[k].clientWidth;
                        }
                        if(max < 55) max = 55;
                        radiobuttons.width(max);
                    }

                    var container = $("#tr_"+item.id).find(".cond-container");
                    if (container.height() > 56) {
                        $("#more_"+item.id).css("display", "block");
                        container.css("max-height", "56px");
                    }
                }
            }
        }

        //Draw Controls
        this.drawControls = function () {
            $(this.id).html("");
            var tbodyelm, item, ctlInst, len, i, j;
            
            //Search Visible 적용
            $(this.id).append("<div class='expSearch-container' parentctl='"+this.id+"'><div id='txt_searchExpItem' class='txt-searchexp'></div><div id='btn_searchExpItem' class='btn-searchexp'></div></div>");
            
            //검색 TextBox
            ctlInst = $(this.id+" .txt-searchexp").dxTextBox({
                format: 'time',
                placeholder: '검색어를 입력하세요.'
            }).dxTextBox("instance");
            //검색 TextBox Event
            ctlInst.on("enterKey", function(e) {
                var search_word = e.component.option("text");
                if(search_word == "") return;
                var parentctl = getCtl(e.element[0].parentElement.getAttribute("parentctl").slice(1));
                var items = parentctl.items;

                for(var i=0; i<items.length; i++) {
                    if(items[i].name.indexOf(search_word) > -1) {
                        if(items[i].ctls.length) {
                            if(!items[i].group.isopen) {
                                var groupidx;
                                for(var j=0; j<parentctl.groups.length; j++) {
                                    if(parentctl.groups[j].path == items[i].group.path) {
                                        groupidx = j;
                                        break;
                                    }
                                }
                                $(parentctl.id+" #groupbtn_"+groupidx).click();
                            }
                            getCtl(items[i].ctls[0]).ctl.focus();
                            return;
                        }
                    }
                }
            });
            ctlInst.on("focusIn", function (e) {
                e.element.find('input').select();
            });

            //검색 Button
            ctlInst = $(this.id+" .btn-searchexp").dxButton({
                type: 'normal', 
                icon: "search", 
                text: "" 
            }).dxButton("instance");
            //검색 Button Event
            ctlInst.on("click", function(e) {
                var search_word = $("#"+e.element[0].previousSibling.id).dxTextBox("instance").option("value");
                if(search_word == "") return;
                var parentctl = getCtl(e.element[0].parentElement.getAttribute("parentctl").slice(1));
                var items = parentctl.items;

                for(var i=0; i<items.length; i++) {
                    if(items[i].name.indexOf(search_word) > -1) {
                        if(items[i].ctls.length) {
                            if(!items[i].group.isopen) {
                                var groupidx;
                                for(var j=0; j<parentctl.groups.length; j++) {
                                    if(parentctl.groups[j].path == items[i].group.path) {
                                        groupidx = j;
                                        break;
                                    }
                                }
                                $(parentctl.id+" #groupbtn_"+groupidx).click();
                            }
                            getCtl(items[i].ctls[0]).ctl.focus();
                            return;
                        }
                    }
                }
            });

            //Explorer Table 그리기
            $(this.id).append("<div class='expTable-container'><table><tbody></tbody></table></div>");
            tbodyelm = $(this.id + " tbody");
    
            var beforegroup;
            for(i=0; i<this.items.length; i++) {
                item = this.items[i];

                //Group Style 적용
                if(this.groupStyle) {
                    if(beforegroup != item.group.path) {
                        beforegroup = item.group.path;
                        var groupidx;
                        for(j=0; j<this.groups.length; j++) {
                            if(this.groups[j].idx == item.group.idx) {
                                groupidx = j;
                                break;
                            }
                        }
                        //Add group header <tr>
                        tbodyelm.append("<tr id='tr_group_"+ groupidx +"' class='tr-group'><td colspan='3' class='td_grouptitle'>"+ item.group.name +"<div id='groupbtn_"+groupidx+"' class='groupbtn' groupidx='"+groupidx+"' parentctl='"+this.id+"' style='position:absolute;right:6px;height:20px;margin-top:-3px;width:28px;'></div></td></tr>");
                        ctlInst = $(this.id+" #groupbtn_"+groupidx).dxButton({
                                      type: 'normal', 
                                      icon: "chevrondown", 
                                      text: ""
                                  }).dxButton("instance");
                        ctlInst.on("click", function(e){
                            var parentctl = getCtl(e.element[0].getAttribute("parentctl").slice(1));
                            var groupidx = e.element[0].getAttribute("groupidx");
                            var groupitems = [];
                            for(var i=0; i<parentctl.items.length; i++){
                               if(parentctl.items[i].group.path == parentctl.groups[groupidx].path) {
                                  groupitems.push(parentctl.items[i]);
                               }
                            }

                            if(parentctl.groups[groupidx].isopen) {         // OPEN
                                for(var i=0; i<groupitems.length; i++){
                                    $("#tr_"+groupitems[i].id).css("display", "none");
                                }
                                $(parentctl.id+" #groupbtn_"+groupidx).dxButton("instance").option("icon", "chevronnext");
                            }
                            else {                                          // CLOSE
                                for(var i=0; i<groupitems.length; i++){
                                    $("#tr_"+groupitems[i].id).css("display", "");
                                }
                                $(parentctl.id+" #groupbtn_"+groupidx).dxButton("instance").option("icon", "chevrondown");    
                            }

                            parentctl.groups[groupidx].isopen = !parentctl.groups[groupidx].isopen;
                        });
                    }
                }

                //UI 정보 유무 확인
                if(item.ctltype.length) {
                    tbodyelm.append("<tr id='tr_"+ item.id +"' class='tr-item'><td class='td_title'>"+ item.name +"</td><td class='td_cond'><div class='cond-container'></div></td><td class='td_more'><div id='pop_"+item.id+"' class='btn-pop' style='visibility:hidden;'></div><div id='more_"+item.id+"' class='btn-more' style='display:none;'></div></td></tr>");
                    
                    //valuelist popup 버튼 만들기
                    ctlInst = $("#tr_"+item.id+" .btn-pop").dxButton({
                                      type: 'normal', 
                                      icon: "search", 
                                      text: "",
                                      hint: "값 선택"
                                  }).dxButton("instance");

                    ctlInst.on("click", function(e){
                        mVarFilterExpID = $(e.element).parents(".ozfilterexplorer")[0].id;
                        var ozid = ($(e.element).parents("tr")[0].id).replace("tr_", "");
                        _selitem = _.where(inst.items, {id : ozid})[0];

                        _selindex = new Array();
                        if ((_selitem.ctltype == "checkgroup") || (_selitem.ctltype == "check")) {
                            var ctls = _selitem.ctls;
                            var i = _selitem.allowAll ? 1 : 0;
                            var idx;
                            for ( ; i<ctls.length; i++){
                                if (getCtl(ctls[i]).getCheck()) {
                                    idx = _selitem.allowAll ? i - 1 : i;
                                    _selindex.push(idx);
                                }
                            }
                        } else if (_selitem.ctltype == "combo") {
                            if ((_selitem.allowAll && getCtl(_selitem.ctls[0]).getSelectedIndex() != 0) || (!(_selitem.allowAll) && getCtl(_selitem.ctls[0]).getSelectedIndex() != -1)) {
                                _selindex[0] = _selitem.allowAll ? (getCtl(_selitem.ctls[0]).getSelectedIndex()) - 1 : (getCtl(_selitem.ctls[0]).getSelectedIndex());
                            }
                        } else {
                            var ctl = getCtl(_selitem.ctls[0]);
                            if((_selitem.allowAll && ctl.getCode() != "%") && (ctl.getCode() != "")){
                                _selindex[0] = _selitem.codelist.indexOf(ctl.getCode());
                            }
                        }

                        _valuelist = _selitem.valuelist.join(";");
                        _codelist = _selitem.codelist.join(";");

                        inst.valuelistpopup.openValueListPopup();
                    });

                    //valuelist 더보기 버튼 만들기
                    ctlInst = $("#tr_"+item.id+" .btn-more").dxButton({
                                      type: 'normal', 
                                      icon: "overflow", 
                                      text: "",
                                      hint: "펼치기"
                                  }).dxButton("instance");

                    ctlInst.on("click", function(e){
                        if ((e.component.option("hint") == "값 목록이 많아 모두 표시할 수 없습니다.")) return;

                        var ele =  $(e.element).parents("tr").find(".cond-container");
                        var h = ele.css("max-height") == "none" ? "56px" : "none" ;
                        ele.css("max-height", h);
                        e.component.option("hint", (h == "none" ? "접기" : "펼치기"));
                    });

                    //조건 컨트롤 DIV 만들기
                    if((item.optr == "BETWEEN") && (item.ctltype != "radiogroup")) {
                        len = 2;
                        $("#tr_"+item.id+" .cond-container").append("<div id='"+ item.id+"_1' data-parentctl='"+this.id+"' nextlayer='"+item.nextlayer+"' style='position:absolute;left:0px;right:53%;'></div><label class='oz-item' style='position:absolute;left:46%;right:46%;text-align:center;'>~</label><div id='"+ item.id+"_2' data-parentctl='"+this.id+"' nextlayer='"+item.nextlayer+"' style='position:absolute;left:53%;right:0px;'></div>");
                    } else {
                        len = 1;
                        $("#tr_"+item.id+" .cond-container").append("<div id='"+ item.id+"_1' data-parentctl='"+this.id+"' nextlayer='"+item.nextlayer+"' style='width:100%;'></div>");
                    }

                    var id;
                    for(j=1; j<=len; j++) {
                        id = item.id+"_"+j;
                        // ctltype : date check combo checkgroup radiogroup numeric
                        switch(item.ctltype) {
                            case "date":        var ctlid = "chk_"+item.id+"_"+j;
                                                $("#"+id).append("<div id='"+ctlid+"' style='position:absolute;top:3px;'></div>");
                                                ctlInst = new oz_check(ctlid);
                                                registerControl(ctlInst, ctlid, true, true);
                                                item.ctls.push(ctlid);
                                                ctlInst.ctl.on("valueChanged", function(e) {
                                                    var datectl = getCtl(e.element[0].id.replace(/chk/, "date"));
                                                    datectl.setEnabled(e.value);
                                                });
    
                                                ctlid = "date_"+item.id+"_"+j;
                                                $("#"+id).append("<div id='"+ctlid+"' style='position:absolute;left:20px;right:0px;'></div>");
                                                ctlInst = new oz_date(ctlid);
                                                registerControl(ctlInst, ctlid, true, true);
                                                ctlInst.height = 25;
                                                ctlInst.width = "auto";
                                                ctlInst.setValue(ozController.ServerDate);
                                                ctlInst.setEnabled(false);
                                                break;
                            case "combo":   ctlInst = new oz_combo(id);
                                            registerControl(ctlInst, id, true, true); 
                                            ctlInst.height = 25;
                                            item.ctls.push(id);
                                                    
                                            //Dimension Layer일 경우
                                            if(item.islayer) {
                                                // ctlInst.ctl.on("itemClick", function(e){
                                                ctlInst.ctl.on("selectionChanged", function(e){
                                                    var ctl = getCtl(e.element[0].getAttribute("data-parentctl").slice(1));
                                                    if(ctl.isInitValue) return;    //@@##

                                                    if(e.element[0].getAttribute("nextlayer") == "") return;//@@##
                                                    var nextlayers = e.element[0].getAttribute("nextlayer").split(",");

                                                    //@@## allowAll Check
                                                    var itemid = $(e.element[0]).parents(".tr-item")[0].id.replace("tr_", "");
                                                    var fitem = _.where(inst.items, {"id" : itemid});
                                                    if(fitem.length < 1) { return; }

                                                    //선택된 값이 없으면 모든 레이어 초기화
                                                    if(fitem[0].allowAll && getCtl(e.element[0].id).getSelectedIndex() == 0){
                                                        ctl.initializeLayers(nextlayers, true);   //@@##
                                                        // for(var i=0; i<nextlayers.length; i++) {
                                                        //     // getCtl(nextlayers[i]+"_1").ctl.reset();  //@@##
                                                        //     getCtl(nextlayers[i]+"_1").clear();
                                                        //     getCtl(nextlayers[i]+"_1").setSelectedIndex(0);
                                                        //     getCtl(nextlayers[i]+"_1").setEnabled(false);
                                                        // }
                                                        return;
                                                    }
    
                                                    //다음 레이어 값 가져오기 @@##
                                                    // getCtl(nextlayers[0]+"_1").setEnabled(true);
                                                    ctl.Get_LayerValueList(nextlayers[0]);
    
                                                    // //@@##        
                                                    // //그 다음 레이어들 초기화
                                                    // for(var i=1; i<nextlayers.length; i++) {
                                                    //     getCtl(nextlayers[i]+"_1").ctl.reset();
                                                    //     getCtl(nextlayers[i]+"_1").setSelectedIndex(0);
                                                    //     getCtl(nextlayers[i]+"_1").setEnabled(false);
                                                    // }
                                                    ctl.initializeLayers(nextlayers, false);
                                                });
                                                if(item.layeridx != 1) {
                                                    ctlInst.setEnabled(false);
                                                }
                                            }
    
                                            if(item.allowAll) {
                                                ctlInst.addItem(item.allCaption, '%');
                                                ctlInst.setSelectedIndex(0);
                                            }
                                            break;
                            case "check":       
                            case "checkgroup":  break;
                            case "radiogroup":  ctlInst = new oz_radio(id);
                                                registerControl(ctlInst, id, true, true);
                                                item.ctls.push(id);
    
                                                if(item.islayer) {
                                                    ctlInst.ctl.on("valueChanged", function(e){
                                                        var ctl = getCtl(e.element[0].getAttribute("data-parentctl").slice(1));
                                                        if(ctl.isInitValue) return;    //@@##

                                                        if(e.element[0].getAttribute("nextlayer") == "") return;//@@##
                                                        var nextlayers = e.element[0].getAttribute("nextlayer").split(",");
    
                                                        if(!getCtl(e.element[0].id).ctl.option("dataSource").length) return;
    
                                                        //전체 값을 선택했을때 하위 모든 layer 초기화
                                                        if(getCtl(e.element[0].id).getCode() == "%"){
                                                            ctl.initializeLayers(nextlayers, true);   //@@##
                                                            // for(var i=0; i<nextlayers.length; i++) {
                                                            //     getCtl(nextlayers[i]+"_1").clear();
                                                            // }
                                                            return;
                                                        }
    
                                                        //다음 레이어 값 가져오기 @@##
                                                        getCtl(nextlayers[0]+"_1").ctl.reset();
                                                        ctl.Get_LayerValueList(nextlayers[0]);
    
                                                        // //@@##    
                                                        // //그 다음 레이어들 초기화
                                                        // for(var i=1; i<nextlayers.length; i++) {
                                                        //     getCtl(nextlayers[i]+"_1").clear();
                                                        // }
                                                        ctl.initializeLayers(nextlayers, false);
                                                    });
                                                }
                                                break;
                            case "text":                    
                            case "numeric":     ctlInst = new oz_textbox(id);
                                                registerControl(ctlInst, id, true, true);
                                                ctlInst.height = 25;
                                                item.ctls.push(id);
                                                break;
                        }
                    }
                } else {
                    // //UI정보가 없는 경우
                    // tbodyelm.append("<tr id='tr_"+ item.id +"' class='tr-item'><td class='td_title'>"+ item.name +"</td><td class='td_cond'><div class='cond-container'></div></td></tr>");
                 //    $("#tr_"+item.id+" .cond-container").append("<div id='"+ item.id +"' style='line-height:20px;'>UI 정보가 없습니다.</div>");
                }
                this.SearchVisible = this.SearchVisible;
            }

            // valuelist popup 만들기
            this.valuelistpopup.init();
        }

        this.setSelectedValuelist = function() {
            if (_selitem.islayer && _selitem.layeridx != 1) {
                if (_selitem.ctltype == "checkgroup" || _selitem.ctltype == "check") {
                    var ctls = _selitem.ctls;
                    for(var i=0; i<ctls.length; i++) {
                            getCtl(ctls[i]).setCheck(false);
                    }
                } else if(_selitem.ctltype == "combo"){
                    getCtl(_selitem.id+"_1").setSelectedIndex(0);
                } else {
                    getCtl(_selitem.id+"_1").setValue(-1);
                }
                
            } else {
                this.Init_Value(_selitem.id);
            }

            if (_selitem.ctltype == "checkgroup" || _selitem.ctltype == "check") {
                for (var i=0; i<_selindex.length; i++) {
                    //&& var ctl = $(".ozfilterexplorer #chk_"+_selitem.id+"_"+_selindex[i]).dxCheckBox("instance");
                    var ctl = getCtl("chk_"+_selitem.id+"_"+_selindex[i]);
                    //&& ctl.option("value", true);
                    ctl.setCheck(true); 
                }
                // 계층일 경우 다음 계층 valuelist 가져오기
                if (_selitem.islayer) {
                    this.Get_LayerValueList(_selitem.nextlayer[0]);
                }
            } else if(_selitem.ctltype == "combo"){
                var idx = _selitem.allowAll ? _selindex[0]+1 : _selindex[0];
                getCtl(_selitem.id+"_1").setSelectedIndex(idx);
            } else {
                getCtl(_selitem.id+"_1").setCode(_selitem.codelist[_selindex[0]]);
            }
            
            _selindex = new Array();
            _selitem = new Object();
            _preselindex = new Array();
            _valuelist = '';
            _codelist = '';
        }

        //@@##
        this.initializeLayers = function(layers, noselect){
            for(var i=0; i<layers.length; i++) {
                var fitem = _.where(inst.items, {"id" : layers[i]});
                if(fitem.length > 0) {
                    fitem = fitem[0];
                    for(var j=0; j<fitem.ctls.length; j++){
                        if(i == 0 && !noselect) {
                            if(fitem.ctltype == "combo") getCtl(fitem.ctls[j]).setEnabled(true);
                        } else {
                            if(getCtl(fitem.ctls[j]) != null) {
                                switch(fitem.ctltype) {
                                    case "combo" :  // getCtl(fitem.ctls[j]).ctl.reset();   //@@##
                                                    getCtl(layers[i]+"_1").clear();
                                                    getCtl(fitem.ctls[j]).setSelectedIndex(0);
                                                    getCtl(fitem.ctls[j]).setEnabled(false);
                                                    break;
                                    case "radio" : 
                                    case "radiogroup" : getCtl(fitem.ctls[j]).clear();
                                                        break;
                                    case "check" :
                                    case "checkgroup" : $("#"+fitem.ctls[j]).remove();
                                                        break;
                                    case "text":
                                    case "numeric" : getCtl(fitem.ctls[j]).setEnabled(false);
                                                     break;
                                }
                            }
                        }
                    }
                }
            }
        }

        // //@@##
        // this.initializeLayers = function(layers){
        //     for(var i=0; i<layers.length; i++) {
        //         var fitem = _.where(inst.items, {"id" : layers[i]});
        //         if(fitem.length > 0) {
        //             for(var j=0; j<fitem.ctls.length; j++){
        //                 if(i == 0) {
        //                     if(fitem[0].ctltype == "combo") getCtl(layers[i]+"_"+j).setEnabled(true);
        //                 } else {
        //                     if(getCtl(layers[i]+"_1") != null) {
        //                         switch(fitem[0].ctltype) {
        //                             case "combo" :  getCtl(layers[i]+"_1").ctl.reset();
        //                                             getCtl(layers[i]+"_1").setSelectedIndex(0);
        //                                             getCtl(layers[i]+"_1").setEnabled(false);
        //                                             break;
        //                             case "radio" : 
        //                             case "radiogroup" :
        //                             case "check" :
        //                             case "checkgroup" : getCtl(layers[i]+"_1").clear();
        //                                                 break;
        //                             case "text":
        //                             case "numeric" : getCtl(layers[i]+"_1").setEnabled(false);
        //                                              break;
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        //Filter XML 반환
        this.getFilterXML = function () {
            var filters = this.checkFilter(this.items);
            var filterXML = new ozf_stringbuilder();
    
            filterXML.append('<LogicOperator isnot="F" operator="AND">');
    
            var item, v, c;
            for(var i=0; i<filters.length; i++){
                item = this.items[filters[i].idx];
    
                if((item.ctltype == "date" || item.ctltype == "numeric" || item.ctltype == "text" || item.ctltype == "combo") && item.optr == "BETWEEN") {
                    switch(filters[i].checkidx) {
                        case "1":   filterXML.append('<Condition edittype="Editor" iscustom="F" isnot="F" operator="&gt;="><Editor>');
                                    break;
                        case "2":   filterXML.append('<Condition edittype="Editor" iscustom="F" isnot="F" operator="&lt;="><Editor>');
                                    break;
                        default :   filterXML.append('<Condition edittype="Editor" iscustom="F" isnot="F" operator="'+item.optr+'"><Editor>');
                                    break;
                    }
                } else {
                    filterXML.append('<Condition edittype="Editor" iscustom="F" isnot="F" operator="'+item.optr+'"><Editor>');
                }
    
                filterXML.append('<RefItem Inneroperator="" Leftoperator="" Rightoperator="" itemtype="'+item.itemtype+'" name="'+item.name+'" ozid="'+item.id+'"/></Editor><Values>');
    
                c = filters[i].c;
                v = filters[i].v;
    
                for(var j=0; j<v.length; j++) {
                    filterXML.append('<ValueItem valuetype="codevalue"><Value>'+v[j]+'</Value><Code>'+c[j]+'</Code></ValueItem>');
                }
    
                filterXML.append('</Values></Condition>');
            }
    
            filterXML.append('</LogicOperator>');

            return filterXML.toString();
        }

        //상위 Layer Filter XML 반환
        this.getLayerCondition = function (layers) {
            var filters = this.checkFilter(layers);

            if ((_selindex.length != 0) && (filters[layers.length - 1].v.length != _selindex.length)) { return false; }

            var filterXML = new ozf_stringbuilder();
            filterXML.append("<List><Filter><LogicOperator isnot='F' operator='AND'>");
    
            var item, v, c;
            for(var i=0; i<filters.length; i++){
                item = layers[filters[i].idx];
    
                if((item.ctltype == "date" || item.ctltype == "numeric" || item.ctltype == "text" || item.ctltype == "combo") && item.optr == "BETWEEN") {
                    switch(filters[i].checkidx) {
                        case "1":   filterXML.append("<Condition edittype='Editor' iscustom='F' isnot='F' operator='&gt;='><Editor>");
                                    break;
                        case "2":   filterXML.append("<Condition edittype='Editor' iscustom='F' isnot='F' operator='&lt;='><Editor>");
                                    break;
                        default :   filterXML.append("<Condition edittype='Editor' iscustom='F' isnot='F' operator='"+item.optr+"'><Editor>");
                                    break;
                    }
                } else {
                    filterXML.append("<Condition edittype='Editor' iscustom='F' isnot='F' operator='"+item.optr+"'><Editor>");
                }
    
                filterXML.append("<RefItem Inneroperator='' Leftoperator='' Rightoperator='' itemtype='"+item.itemtype+"' name='"+item.name+"' ozid='"+item.id+"'/></Editor><Values>");
    
                c = filters[i].c;
                v = filters[i].v;
    
                for(var j=0; j<v.length; j++) {
                    filterXML.append("<ValueItem valuetype='codevalue'><Value>"+v[j]+"</Value><Code>"+c[j]+"</Code></ValueItem>");
                }
    
                filterXML.append("</Values></Condition>");
            }
    
            filterXML.append("</LogicOperator></Filter></List>");

            return filterXML.toString();
        }
    
        //Filter XML 적용
        this.Apply_FilterXML = function (xmldata) {
            this.Init_Value();

            if(xmldata == "") {
                //교보 180425
                //alert("FilterXML 내용이 없습니다.");
                return;
            }

            var xmldoc = ozf_getXMLDoc(xmldata.replace(/\n/g,""));
            var conditions = xmldoc.getElementsByTagName("Condition");
            var itemvalues = [];
            var itemcodes = [];
    
            var item;
            for(var i=0; i<conditions.length; i++) {
                item = _.where(this.items, {"id":conditions[i].getElementsByTagName("RefItem")[0].getAttribute("ozid")})[0];

                if(item == undefined) return false;

                if (item.islayer && item.layeridx != 1) return true;

                if(!item.group.isopen) {
                    $(this.id+" #groupbtn_"+item.group.idx).click();
                }

                itemvalues = [], itemcodes = [];
                for(var j=0; j<conditions[i].getElementsByTagName("ValueItem").length; j++) {
                    itemvalues.push(conditions[i].getElementsByTagName("ValueItem")[j].getElementsByTagName("Value")[0].textContent);
                    itemcodes.push(conditions[i].getElementsByTagName("ValueItem")[j].getElementsByTagName("Code")[0].textContent);
                }
    
                switch(item.ctltype) {
                    case "radiogroup":  getCtl(item.id+"_1").setValue(itemvalues[0]);
                                        break;
                    case "check":
                    case "checkgroup":  for(var j=0; j<itemvalues.length; j++){ 
                                            for(var k=0;k<item.ctls.length; k++){
                                                if(itemvalues[j] == getCtl(item.ctls[k]).getText()) {
                                                    getCtl(item.ctls[k]).setCheck(true);
                                                    break;
                                                }
                                            }
                                        }
                                        // 계층일 경우 다음 계층 valuelist 가져오기
                                        if (item.islayer) {
                                            this.Get_LayerValueList(item.nextlayer[0]);
                                        }
                                        break;
                    case "combo":   var ctls = [];
                                    if(item.optr == "BETWEEN") {
                                        switch(conditions[i].getAttribute("operator")) {
                                            case ">=":  ctls.push(item.ctls[0]);
                                                        break;
                                            case "<=":  ctls.push(item.ctls[1]);
                                                        break;
                                            default  :  ctls = item.ctls;
                                                        break;
                                        }
                                    } else {
                                        ctls = item.ctls;
                                    }
                                    for(var j=0; j<ctls.length; j++){
                                        getCtl(ctls[j]).setValue(itemvalues[j]);
                                    }
                                    break;
                    case "text":
                    case "numeric": var ctls = [];
                                    if(item.optr == "BETWEEN") {
                                        switch(conditions[i].getAttribute("operator")) {
                                            case ">=":  ctls.push(item.ctls[0]);
                                                        break;
                                            case "<=":  ctls.push(item.ctls[1]);
                                                        break;
                                            default  :  ctls = item.ctls;
                                                        break;
                                        }
                                    } else {
                                        ctls = item.ctls;
                                    }
                                    for(var j=0; j<ctls.length; j++){
                                        getCtl(ctls[j]).setValue(itemvalues[j]);
                                    }
                                    break;
                    case "date":    var ctls = [];
                                    if(item.optr == "BETWEEN") {
                                        switch(conditions[i].getAttribute("operator")) {
                                            case ">=":  ctls.push(item.ctls[0]);
                                                        break;
                                            case "<=":  ctls.push(item.ctls[1]);
                                                        break;
                                            default  :  ctls = item.ctls;
                                                        break;
                                        }
                                    } else {
                                        ctls = item.ctls;
                                    }
                                    for(var j=0; j<ctls.length; j++){
                                        getCtl(ctls[j]).setCheck(true);
                                        getCtl(ctls[j].replace(/chk/, "date")).setValue(itemvalues[j]);
                                    }
                                    break;
                }
            }
            return true;
        }
    
        //Explorer 값 초기화
        this.Init_Value = function (ozid) {
            var items;
            if (ozid == undefined) {
                this.isInitValue = true;
                var items = this.items;
            } else {
                items = _.where(this.items, {id: ozid});
            }

            var ctls;
            for(var i=0; i<items.length; i++) {
                ctls = items[i].ctls;
                    
                switch(items[i].ctltype) {
                    case "radiogroup":  for(var j=0; j<ctls.length; j++) {
                                            if(items[i].islayer && items[i].layeridx != 1) {
                                                getCtl(ctls[j]).clear();
                                            } else {
                                                getCtl(ctls[j]).ctl.reset();
                                            }
                                        }
                                        break;
                    case "check":
                    case "checkgroup":  for(var j=0; j<ctls.length; j++) {
                                            if(items[i].islayer && items[i].layeridx != 1) {
                                                $("#"+ctls[j]).html("");
                                            } else {
                                                getCtl(ctls[j]).setCheck(false);
                                            }
                                        }
                                        break;
                    case "combo":   for(var j=0; j<ctls.length; j++) {
                                        if(items[i].islayer && items[i].layeridx != 1) {
                                            //getCtl(ctls[j]).ctl.reset();  //@@##
                                            getCtl(ctls[j]).clear();
                                            getCtl(ctls[j]).setEnabled(false);
                                        }
                                        //@@##
                                        if(items[i].allowAll) getCtl(ctls[j]).setSelectedIndex(0);
                                        else getCtl(ctls[j]).setSelectedIndex(-1);
                                    }
                                    break;
                    case "text":
                    case "numeric": for(var j=0; j<ctls.length; j++) {
                                        getCtl(ctls[j]).ctl.reset();
                                    }
                                    break;
                    case "date":    for(var j=0; j<ctls.length; j++) {
                                        getCtl(ctls[j]).ctl.reset();
                                        getCtl(ctls[j].replace(/chk/, "date")).setEnabled(false);
                                        getCtl(ctls[j].replace(/chk/, "date")).setValue(ozController.ServerDate);
                                    }
                                    break;
                }
            }
            this.isInitValue = false;
        }

        //Explorer Table 다시 그리기
        this.tableRefresh = function() {
            var tbodyelm = $(this.id + " tbody");

            var rows;
            var afterrows = new Array();

            if(this.groupStyle) {
                tbodyelm.find(".tr-group").show();

                var beforegroup;
                for(var i=0; i<this.items.length; i++) {
                    if(beforegroup != this.items[i].group.idx) {
                        beforegroup = this.items[i].group.idx;
                        afterrows.push( new Object({ id: "group_"+this.items[i].group.idx }) );
                    }
                    // //UI정보가 없는 경우 표시 O
                    // afterrows.push(this.items[i]);
                    
                    //UI정보가 없는 경우 표시 X
                    if(this.items[i].ctltype != "") {
                        afterrows.push(this.items[i]);
                    }
                }

                for(var i=0; i<afterrows.length; i++) {
                    rows = tbodyelm.children();

                    for(var j=0; j<rows.length; j++) {
                        if("tr_"+afterrows[i].id == rows[j].id) {
                            rows[i].after(rows[j]);
                            break;
                        }
                    }
                }
            } else {
                tbodyelm.find(".tr-group").hide();

                for(var i=0; i<this.groups.length; i++) {
                    if(!this.groups[i].isopen) {
                        $(this.id+" #groupbtn_"+this.groups[i].idx).click();
                    }
                }

                for(var i=0; i<this.items.length; i++) {
                    // //UI정보가 없는 경우 표시 O
                    // afterrows.push(this.items[i]);

                    //UI정보가 없는 경우 표시 X
                    if(this.items[i].ctltype != "") {
                        afterrows.push(this.items[i]);
                    }
                }

                for(var i=0; i<afterrows.length; i++) {
                    rows = tbodyelm.find(".tr-item");

                    for(var j=0; j<rows.length; j++) {
                        if("tr_"+afterrows[i].id == rows[j].id) {
                            rows[i].after(rows[j]);
                            break;
                        }
                    }
                }
            }
        }
    }

    //메타 정보를 가져옴
    if (!oz_filterExplorer.prototype.getMetaData) {
        oz_filterExplorer.prototype.getMetaData = function (items) {
            var addr = "<List>";
            var opt = "<List>";
            for(i=0; i<items.length; i++){
                if(items[i].getAttribute("ozid") != null){
                    addr += "<Item address='" + items[i].getAttribute("ozid") + "' region='manage'/>";
                    opt += "<Item option='standard' error='ignore'/>";
                }
            }
            addr += "</List>";
            opt += "</List>";
    
            metah = new oza_MetaHandler("cachestorecontent", addr, opt);
            metah.execute(null, false);
    
            return metah.returncontent;
        }
    }
    
    //Filter XML의 값을 컨트롤에 넣음
    if (!oz_filterExplorer.prototype.checkFilter) {
        oz_filterExplorer.prototype.checkFilter = function (items) {
            var filters = [];
            var i, j, item, values, codes;
    
            for(i=0; i<items.length; i++) {
                item = items[i];
                codes = [];
                values = [];
                switch(item.ctltype) {
                    case "date":        var checkidx = "";
                                        for(var j=0; j<item.ctls.length; j++) {
                                            var ctl = getCtl(item.ctls[j]);
                                            if(ctl.getCheck()){
                                                ctl = getCtl(item.ctls[j].replace(/chk/, "date"));
                                                codes.push(ctl.getValue());     //date타입은 코드가 값과 같음
                                                values.push(ctl.getValue());
                                                checkidx = checkidx + (j+1);
                                            }
                                        }
                                        if(values.length){
                                            filters.push(new Object({ "idx":i, "name":item.name, "v":values, "c":codes, "checkidx":checkidx }));
                                        }
                                        break;
                    case "combo":       checkidx = "";
                                        for(var j=0; j<item.ctls.length; j++) {
                                            var ctl = getCtl(item.ctls[j]);
                                            //if((item.allowAll && ctl.getSelectedIndex() != 0) || (!item.allowAll && ctl.getSelectedIndex() != -1)){ @@##
                                            if((item.allowAll && ctl.getSelectedIndex() > 0) || (!item.allowAll && ctl.getSelectedIndex() != -1)){
                                                codes.push(ctl.getCode());
                                                values.push(ctl.getValue());
                                                checkidx = checkidx + (j+1);
                                            }
                                        }    
                                        if(values.length){
                                            filters.push(new Object({ "idx":i, "name":item.name, "v":values, "c":codes, "checkidx":checkidx }));
                                        } 
                                        break;
                    case "check":       
                    case "checkgroup":  var j = item.allowAll ? 1 : 0;
                                        for(; j<item.ctls.length; j++) {
                                            if((item.allowAll && j!=0) || (!item.allowAll)) {
                                                var ctl = getCtl(item.ctls[j]);
                                                if(ctl.getCheck()){
                                                    codes.push(ctl.codeYes);
                                                    values.push(ctl.getText());
                                                }
                                            }
                                        }
                                        if(values.length){
                                            filters.push(new Object({ "idx":i, "name":item.name, "v":values, "c":codes }));
                                        }
                                        break;
                    case "radiogroup":  for(var j=0; j<item.ctls.length; j++) {
                                            var ctl = getCtl(item.ctls[j]);
                                            if((item.allowAll && ctl.getCode() != "%") && (ctl.getCode())){
                                                codes.push(ctl.getCode());
                                                values.push(_.where(ctl.cbdatasource, {Code:ctl.getCode()})[0].Caption);
                                            }
                                        }
                                        if(values.length){
                                            filters.push(new Object({ "idx":i, "name":item.name, "v":values, "c":codes }));
                                        }
                                        break;
                    case "text":                    
                    case "numeric":     checkidx = "";
                                        for(var j=0; j<item.ctls.length; j++) {
                                            var ctl = getCtl(item.ctls[j]);
                                            if(ctl.getValue()){
                                                codes.push(ctl.getValue());     //numeric타입은 코드가 값과 같음
                                                values.push(ctl.getValue());
                                                checkidx = checkidx + (j+1);
                                            }
                                        }
                                        if(values.length){
                                            filters.push(new Object({ "idx":i, "name":item.name, "v":values, "c":codes, "checkidx":checkidx }));
                                        }
                                        break;
                }
            }
            return filters;
        }
    }
    
    //컨트롤에 값과 코드 리스트를 넣음
    if(!oz_filterExplorer.prototype.setValueToCtl) {
        oz_filterExplorer.prototype.setValueToCtl = function (item, itemvals, itemcds, delm) {
            // 코드테이블이 매핑된 경우 코드로 정렬 (2019-06-11 교보)
            var codetableExist;
            if (item.codetableozid == "") {
                codetableExist = false;
            }
            else {
                codetableExist = true;
            }

            //Sorting Value & Code List
            var result = this.sortValueCodeList(itemvals, itemcds, delm, codetableExist);
            itemvals = result.valuelist;
            itemcds  = result.codelist;
    
            switch(item.ctltype) {  // Type : date check combo checkgroup radiogroup numeric
                case "text":
                case "numeric":     break;
                case "combo":       for(var j=1; j<=item.ctls.length; j++) {
                                        getCtl(item.id+"_"+j).internalclear();
                                        if(item.allowAll){
                                            getCtl(item.id+"_"+j).arrcodelist = [];
                                            getCtl(item.id+"_"+j).addItem(item.allCaption, "%", false);
                                        }
                                        if(itemvals == "") {
                                            item.codelist = [];
                                            item.valuelist = [];
                                        } else {
                                            item.codelist = itemcds.split(delm);
                                            item.valuelist = itemvals.split(delm);
                                        }
                                        for(var k=0; k<item.valuelist.length; k++){
                                            getCtl(item.id+"_"+j).addItem(item.valuelist[k], item.codelist[k], false);
                                        }
                                    
                                        getCtl(item.id+"_"+j).refresh();
                                        if(item.allowAll) { getCtl(item.id+"_"+j).setSelectedIndex(0); }
                                    }
                                    if (!(item.optr == "BETWEEN")) { 
                                        $("#pop_"+item.id).css("visibility", "visible");
                                    }
                                    break;
                case "check":
                case "checkgroup":  if(itemvals == "") {
                                        itemcds  = [];
                                        itemvals = [];
                                        item.codelist = [];
                                        item.valuelist = [];
                                    } else {
                                        itemcds = itemcds.split(delm);
                                        itemvals = itemvals.split(delm);
                                        item.codelist = itemcds;
                                        item.valuelist = itemvals;
                                    }

                                    //Debug!!
                                    console.log("## TM 결과 개수 : " + item.name + " /// " + itemcds.length + " ##");

                                    var chk = $("#"+item.id+"_1");
                                    chk.html("");
                                    item.ctls =[];
                                    if(item.allowAll) {
                                        id = "chk_"+item.id;
                                        chk.append("<div id='"+id+"' class='all-check expcheck'></div>");
                                        ctlInst = new oz_expcheck(id);
                                        registerControl(ctlInst, id, true, true);
                                        ctlInst.setText(item.allCaption);
                                        item.ctls.push(id);
                                        //전체 Checkbox Event
                                        ctlInst.ctl.onclick =  function(e){
                                            if(getCtl(e.currentTarget.id).getCheck()) {
                                                var checks = $("#"+e.currentTarget.parentElement.id+" .expcheck");
                                                for(var i=1; i<checks.length; i++) {
                                                    getCtl(checks[i].id).setCheck(false);
                                                }
                                            }
                                        }
                                        //&& $("#"+id).hide();
                                    }

                                    var appendstr = new ozf_stringbuilder();
                                    var chkids = new Array();

                                    var chkidslen = itemcds.length;
                                    for(var j=0; j<chkidslen; j++){
                                        id = "chk_"+item.id+"_"+j;
                                        appendstr.append("<div id='"+id+"' class='expcheck'></div>");
                                        chkids.push(id);
                                    }

                                    chk.append(appendstr.toString());

                                    for(var j=0; j<chkidslen; j++){
                                        id = chkids[j];
                                        ctlInst = new oz_expcheck(id);
                                        registerControl(ctlInst, id, true, true);
                                        ctlInst.setText(itemvals[j]);
                                        ctlInst.codeYes = itemcds[j];
                                        //&& ctlInst.ctl.option("hint", itemvals[j]);
                                        ctlInst.ctl.title = itemvals[j];
                                        item.ctls.push(id);
                                        //&& $("#"+id).hide();

                                        ctlInst.ctl.onclick = function(e) {
                                            var curchk = e.currentTarget;
                                            var ctl = getCtl(curchk.parentElement.getAttribute("data-parentctl").slice(1));
                                            if(ctl.isInitValue) return; 


                                            if(getCtl(curchk.id).getCheck()) {
                                                var pid = curchk.parentElement.id;
                                                if($("#"+ pid +" .all-check").length > 0) {
                                                    getCtl($("#"+ pid +" .all-check")[0].id).setCheck(false);
                                                }
                                            }
                                            var nlayers = curchk.parentElement.getAttribute("nextlayer"); 
                                            if(nlayers == "") return;

                                            var nextlayers = nlayers.split(",");

                                            var ischk = false;
                                            var len = curchk.parentElement.childElementCount;
                                            var child;
                                            for(i=1; i<len; i++) {
                                                child = getCtl(curchk.parentElement.childNodes[i].id);

                                                if(child.getCheck()) {
                                                    ischk = true;
                                                    break;
                                                }
                                            }
                                            //선택된 값이 없으면 모든 레이어 초기화
                                            if(!ischk) {

                                                ctl.initializeLayers(nextlayers, true);   //@@##
                                                // for(var i=0; i<nextlayers.length; i++) {
                                                //     $("#"+nextlayers[i]+"_1").html("");
                                                // }
                                                return;
                                            }

                                            //다음 레이어 값 가져오기 @@##
                                            ctl.Get_LayerValueList(nextlayers[0]);
                                            
                                            // //@@##
                                            // //그 다음 레이어들 초기화
                                            // for(var i=1; i<nextlayers.length; i++) {
                                            //     $("#"+nextlayers[i]+"_1").html("");
                                            // }
                                            ctl.initializeLayers(nextlayers, false);
                                        }

                                    }

                                    if (!(item.optr == "BETWEEN")) { 
                                        $("#pop_"+item.id).css("visibility", "visible");
                                    }
                                    break;
                case "radiogroup":  item.codelist = itemcds.split(delm);
                                    item.valuelist = itemvals.split(delm);
                                    if(item.allowAll) {
                                        itemcds = "%"+delm+itemcds;
                                        itemvals = item.allCaption+delm+itemvals;
                                    }
                                    ctlInst = getCtl(item.id+"_1");
                                    ctlInst.UserDefined = true;
                                    ctlInst.delimiter = delm;
                                    ctlInst.setCodeList(itemcds);
                                    ctlInst.setValueList(itemvals);
                                    $("#"+item.id+"_1 .dx-radiobutton").hide();
                                    if (!(item.optr == "BETWEEN")) { 
                                        $("#pop_"+item.id).css("visibility", "visible");
                                    }
                                    break;
            }
        }
    }

    //값의 오름차순으로 값/코드 리스트 정렬
    if(!oz_filterExplorer.prototype.sortValueCodeList) {
        oz_filterExplorer.prototype.sortValueCodeList = function (valuelist, codelist, delm, codetableExist) {
            var data = [], result;
            var vals = [], cds = [];
            if(typeof(valuelist) == "string") {
                vals = valuelist.split(delm);
                cds  = codelist.split(delm);
            } else {
                vals = valuelist;
                cds  = codelist;
            }
    
            var obj;
            for(var i=0; i<vals.length; i++) {
                obj = new Object();
                obj.value = vals[i];
                obj.code  = cds[i];
                data.push(obj);
            }
                
            // 코드테이블이 매핑된 경우 코드로 정렬 (2019-06-11 교보)
            if (codetableExist) {
                result = _.sortBy(data, function(d){ return d.code; });
            } else {
                result = data; // value로도 정렬 X?
                //result = _.sortBy(data, function(d){ return d.value; });
            }
    
            vals = "";
            cds  = "";
            for(var i=0; i<result.length; i++) {
                if(i==0) {
                    vals += result[i].value;
                    cds  += result[i].code; 
                } else {
                    vals += delm + result[i].value;
                    cds  += delm + result[i].code;
                }
            }
            result = new Object();
            result.valuelist = vals;
            result.codelist  = cds;
    
            return result;
        }
    }

    //ID/Name 중복 체크 (중복: true 반환)
    if(!oz_filterExplorer.prototype.checkDup) {
        oz_filterExplorer.prototype.checkDup = function (item) {
            var idnum = _.where(this.items, {"id":item.getAttribute('ozid')}).length;
            var nmnum = _.where(this.items, {"name":item.getAttribute('name')}).length;
            return  (idnum + nmnum) ? true : false;
        }
    }

    //활성화 여부 반환
    if (!oz_filterExplorer.prototype.getEnabled) {
        oz_filterExplorer.prototype.getEnabled = function () {
            return this.enable;
        }
    }
    //활성화 여부 설정
    if (!oz_filterExplorer.prototype.setEnabled) {
        oz_filterExplorer.prototype.setEnabled = function (val) {
            this.enable = val;
            var item, ctls;
            for(var i=0; i<this.items.length; i++){
                item = this.items[i];
                ctls = item.ctls;
                for(var j=0; j<ctls.length; j++){
                    getCtl(ctls[j]).setEnabled(val);
                }
            }
        }
    }
    //Visible 여부 반환
    if (!oz_filterExplorer.prototype.getVisible) {
        oz_filterExplorer.prototype.getVisible = function () {
            return this.visible;
        }
    }
    //Visible 여부 설정
    if (!oz_filterExplorer.prototype.setVisible) {
        oz_filterExplorer.prototype.setVisible = function (val) {
            if(val) {
                $(this.id).show();
                this.visible = true; 
                this.setControlSize(this.items, true);
            }
            else {
                $(this.id).hide();
                this.visible = false;
            }
        }
    }
    //디자인 속성 추가
    if (!oz_filterExplorer.prototype.setAttr) {
        oz_filterExplorer.prototype.setAttr = function (attr, val) {
            $(this.id).css(attr, val);
        }
    }

    // valuelist popup 객체
    function oz_valuelistPopup() {
        this.init = function() {
            _selindex = new Array();
            _selitem = new Object();
            _preselindex = new Array();
            _valuelist = '';
            _codelist = '';

            makeValuelistPopup();
        }

        // valuelist popup 객체 생성 및 이벤트 정의
        function makeValuelistPopup() {
            if ($("#ozbodyframe .valuelist-container").length < 1) {
                $("#ozbodyframe").append("<div class='valuelist-container' style='visibility:collapse; width:600px; height:410px; padding:10px; background:white;'><div id='ozbodyframe' style='opacity:1;'><div id='pnlHeader' class='ozpanel oz-item Normal_Panel' style='position:absolute;left:8px;width:584px;top:3px;height:43px;z-index:995;' tabindex='5'><div id='chkAll1' class='ozcheck oz-item' style='position:absolute;left:9px;width:50px;top:8px;height:29px;z-index:992;' tabindex='8'></div><div id='txtSearch' class='oztextbox oz-item' style='position:absolute;left:69px;width:175px;top:8px;height:30px;z-index:991;' tabindex='9'></div><div id='btnSearch' class='ozbutton oz-item' style='position:absolute;left:248px;width:25px;top:7px;height:30px;z-index:993;' tabindex='7' data-tooltip='검색 초기화'></div><div id='chkAll2' class='ozcheck oz-item' style='position:absolute;left:338px;width:50px;top:8px;height:29px;z-index:994;' tabindex='6'></div></div><div id='pnlList1' class='ozpanel oz-item' style='position:absolute;left:14px;width:260px;top:52px;height:311px;z-index:989;' tabindex='11'></div><div id='btnAddValueList' class='ozbutton oz-item' style='position:absolute;left:283px;width:52px;top:157px;height:32px;z-index:996;' tabindex='4'></div><div id='btnRemoveValueList' class='ozbutton oz-item' style='position:absolute;left:283px;width:52px;top:195px;height:32px;z-index:997;' tabindex='3'></div><div id='pnlList2' class='ozpanel oz-item' style='position:absolute;left:344px;width:260px;top:52px;height:311px;z-index:990;' tabindex='10'></div><div id='btnOK' class='ozbutton oz-item' style='position:absolute;width:80px;right:100px;height:30px;bottom:19px;z-index:998;' tabindex='2'></div><div id='btnCancel' class='ozbutton oz-item' style='position:absolute;width:80px;right:14px;height:30px;bottom:19px;z-index:999;' tabindex='1'></div></div></div>");
                
                //컨트롤 생성
                var ctlInst;
                ctlInst = new oz_button('btnCancel');
                ctlInst.init();
                ctlInst.setValue(ozf_EscapeStringExceptQuot('닫기'));
                ctlInst.addEventListener('onClick', function (data) {
                    _selindex = new Array();
                    _selitem = new Object();
                    _preselindex = new Array();
                    _valuelist = '';
                    _codelist = '';
                    $(".valuelist-container #txtSearch").dxTextBox("instance").reset();
                    $(".valuelist-container #chkAll1").dxCheckBox("instance").reset();
                    $(".valuelist-container #chkAll2").dxCheckBox("instance").reset();

                    $("#ozbodyframe .valuelist-container").css("visibility", "collapse");
                    $(".valuelist-container #pnlList1").html("");
                    $(".valuelist-container #pnlList2").html("");
                });

                ctlInst = new oz_button('btnOK');
                ctlInst.init();
                ctlInst.setValue(ozf_EscapeStringExceptQuot('확인'));
                ctlInst.addEventListener('onClick', function (data) {
                    $(".valuelist-container #txtSearch").dxTextBox("instance").reset();
                    $(".valuelist-container #chkAll1").dxCheckBox("instance").reset();
                    $(".valuelist-container #chkAll2").dxCheckBox("instance").reset();
                    $(".valuelist-container #pnlList1").html("");
                    $(".valuelist-container #pnlList2").html("");
                    $("#ozbodyframe .valuelist-container").css("visibility", "collapse");
                    getCtl(mVarFilterExpID).setSelectedValuelist()
                });

                ctlInst = new oz_button('btnRemoveValueList');
                ctlInst.init();
                ctlInst.setValue(ozf_EscapeStringExceptQuot('삭제'));
                ctlInst.addEventListener('onClick', function (data) {
                    var list2 = $(".valuelist-container #pnlList2");
                    switch(_selitem.ctltype) {  // Type : date check combo checkgroup radiogroup numeric
                        case "text":
                        case "numeric":     break;
                        case "check":
                        case "checkgroup":  var len = list2.children().length;
                                            var removeIds = new Array();
                                            for(var i=0; i<len; i++) {
                                                var id = list2.children()[i].id;
                                                var idx = parseInt(id.replace("selitem_", ""));
                                                //&& var chk = $("#pnlList2 #"+id);
                                                chk = getCtl(id);
                                                if(chk.getCheck()) {
                                                    removeIds.push(idx)
                                                }
                                            }

                                            for(var i=0; i<removeIds.length; i++){
                                                // 선택항목에서 제거한 아이템의 체크 해제
                                                //&& $(".valuelist-container #item_"+removeIds[i]).dxCheckBox("instance").option("value", false);
                                                getCtl("item_"+removeIds[i]).setCheck(false);
                                                _preselindex.splice(_preselindex.indexOf(removeIds[i].toString()), 1);
                                                id = "selitem_"+removeIds[i];
                                                _selindex.splice(_selindex.indexOf(removeIds[i].toString()), 1);
                                                $(".valuelist-container #"+id).remove();
                                            }
                                            break;
                        case "combo":
                        case "radiogroup":  _selindex = new Array();
                                            list2.children("#selitem_0").dxRadioGroup("instance").option("dataSource", []);
                                            break;
                    }
                });

                ctlInst = new oz_button('btnAddValueList');
                ctlInst.init();
                ctlInst.setValue(ozf_EscapeStringExceptQuot('추가'));
                ctlInst.addEventListener('onClick', function (data) {
                    var list1 = $(".valuelist-container #pnlList1");
                    var list2 = $(".valuelist-container #pnlList2");

                    switch(_selitem.ctltype) {  // Type : date check combo checkgroup radiogroup numeric
                        case "text":
                        case "numeric":     break;
                        case "check":
                        case "checkgroup":  var len = _preselindex.length;
                                            var ids = new Array();
                                            var chk, id;

                                            for(var i=0; i<_preselindex.length; i++) {
                                                idx = _preselindex[i];
                                                //var id = "item_"+i;
                                                //&& var chk = $("#pnlList1 #"+id).dxCheckBox("instance");
                                                chk = getCtl("item_"+idx);
                                                //var chk = document.getElementById("pnlList1").getElementById(id);
                                                if(_selindex.indexOf(idx) < 0) {
                                                    _selindex.push(idx);

                                                    id = "selitem_"+idx;
                                                    list2.append("<div id='"+id+"' style='display:block; margin:7px;'></div>");
                                                    ctlInst = new oz_expcheck(id);
                                                    registerControl(ctlInst, id, true, true);
                                                    //ctlInst.init();
                                                    ctlInst.setText(chk.getText());
                                                    ctlInst.codeYes = _codelist.split(";")[idx];
                                                }
                                            }
                                            break;
                        case "combo":
                        case "radiogroup":  var rdo = $(".valuelist-container #item_0").dxRadioGroup("instance");
                                            var selrdo = $('.valuelist-container #selitem_0').dxRadioGroup("instance");
                                            _selindex[0] = _codelist.split(";").indexOf(rdo.option("value")["value"]);
                                            selrdo.option("dataSource", [{'text': rdo.option("value")["text"], 'value':rdo.option("value")["value"]}]);
                                            selrdo.option("value", selrdo.option("dataSource")[0]);
                                            break;
                    }
                });

                ctlInst = new oz_panel('pnlHeader');
                ctlInst.init();

                ctlInst = new oz_check('chkAll2');
                ctlInst.init();
                ctlInst.setText('전체');
                ctlInst.autoSize(29);
                ctlInst.addEventListener('onValueChanged', function (data) {
                    var ischecked = $(".valuelist-container #chkAll2").dxCheckBox("instance").option("value");
                    var children = $(".valuelist-container #pnlList2").children();
                    var chk;
                    for (var i=0; i<children.length; i++) {
                        //&& ctl = $(children[i]);
                        chk = getCtl(children[i].id);
                        if (!(chk.ctl.style.display == "none")) {
                            //&& ctl.dxCheckBox("instance").option("value", ischecked);
                            chk.setCheck(ischecked);
                        }
                    }
                });


                ctlInst = new oz_button('btnSearch');
                ctlInst.init();
                ctlInst.ctl.option("icon", "search");
                ctlInst.addEventListener('onClick', function (data) {
                    var tb = $(".valuelist-container #txtSearch").dxTextBox("instance");
                    searchValueList(tb.option("text"));
                });

                ctlInst = new oz_check('chkAll1');
                ctlInst.init();
                ctlInst.setText('전체');
                ctlInst.autoSize(29);
                ctlInst.addEventListener('onValueChanged', function (data) {
                    var ischecked = $(".valuelist-container #chkAll1").dxCheckBox("instance").option("value");
                    var children = $(".valuelist-container #pnlList1").children();
                    var chk;
                    for (var i=0; i<children.length; i++) {
                        chk = getCtl(children[i].id);
                        if (!(chk.ctl.style.display == "none")) {
                            //&& ctl.dxCheckBox("instance").option("value", ischecked);
                            chk.setCheck(ischecked);

                            var idx = chk.id.replace("item_", "");
                            if(chk.getCheck()) {
                                if(_preselindex.indexOf(idx) < 0) {
                                    _preselindex.push(idx);
                                }
                            } else {
                                if(_preselindex.indexOf(idx) > 0) {
                                    _preselindex.splice(_preselindex.indexOf(idx), 1);
                                }
                            }
                        }
                    }
                });

                ctlInst = new oz_textbox('txtSearch');
                ctlInst.init();
                ctlInst.textAlign = 'Left';
                ctlInst.ctl.option("placeholder", "검색어를 입력하세요.")
                ctlInst.ctl.option('onEnterKey', function (data) {
                    var tb = $(".valuelist-container #txtSearch").dxTextBox("instance");
                    searchValueList(tb.option("text"));
                });

                ctlInst = new oz_panel('pnlList2');
                ctlInst.init();

                ctlInst = new oz_panel('pnlList1');
                ctlInst.init();

                //컨트롤 스타일 지정
                $("#btnCancel").css("color","#ffffff").css("background-color","#a0a0a0").css("font-size","13px");
                $("#btnOK").css("color","#ffffff").css("background-color","#1588c4").css("font-size","13px");
                $("#btnRemoveValueList").css("color","#ffffff").css("background-color","#a0a0a0").css("font-size","13px");
                $("#btnAddValueList").css("color","#ffffff").css("background-color","#1588c4").css("font-size","13px");
                $("#pnlHeader").css("color","#373a3d").css("background-color","#ffffff");
                $("#chkAll2").css("color","#3d3d3d").css("font-size","13px");
                $("#btnSearch").css("color","#a9a9a9").css("background","#ffffff").css("font-weight","bold").css("border","0px solid");
                $(".ozfilterexplorer #btnSearch .dx-icon").css("color", "#a9a9a9");
                $("#chkAll1").css("color","#3d3d3d").css("font-size","13px");
                $("#txtSearch").css("color","#464646").css("font-size","13px");
                $("#pnlList2").css("color","#373a3d").css("background-color","#ffffff").css("border","1px solid #dddddd").css("overflow", "auto");
                $("#pnlList1").css("color","#373a3d").css("background-color","#ffffff").css("border","1px solid #dddddd").css("overflow", "auto");

            }
        }

        // valuelist popup 열릴 때 화면 셋팅
        this.openValueListPopup = function(expEle) {
            $(".valuelist-container").css("visibility", "visible");

            if (_valuelist == "") return;

            var vals = _valuelist.split(";");
            var codes = _codelist.split(";");

            var list1 = $("#pnlList1");
            var list2 = $("#pnlList2");

            switch(_selitem.ctltype) {  // Type : date check combo checkgroup radiogroup numeric
                case "text":
                case "numeric":     break;
                case "check":
                case "checkgroup":  $(".valuelist-container #chkAll1").dxCheckBox("instance").option("disabled", false);
                                    $(".valuelist-container #chkAll2").dxCheckBox("instance").option("disabled", false);

                                    var appendstr = new ozf_stringbuilder();

                                    var codelen = codes.length;

                                    //Debug!!
                                    console.log("@@ 팝업에 띄울 코드 수 : " + _selitem.name + " /// " + codelen +" @@");

                                    for(var j=0; j<codelen; j++){
                                        id = "item_"+j;
                                        appendstr.append("<div id='"+id+"' class='valuelist-check'></div>");
                                    }

                                    list1.append(appendstr.toString());

                                    for(var j=0; j<codelen; j++){
                                        id = "item_"+j;
                                        //list1.append("<div id='"+id+"' class='valuelist-check'></div>");
                                        ctlInst = new oz_expcheck(id);
                                        registerControl(ctlInst, id, true, true);
                                        //&& ctlInst.init();
                                        ctlInst.setText(vals[j]);
                                        ctlInst.codeYes = codes[j];
                                        ctlInst.ctl.onclick = function(e) {
                                            var curchk = e.currentTarget;
                                            var idx = curchk.id.replace("item_", "");

                                            if(getCtl(curchk.id).getCheck()) {
                                                if(_preselindex.indexOf(idx) < 0) {
                                                    _preselindex.push(idx);
                                                }
                                            } else {
                                                if(_preselindex.indexOf(idx) > 0) {
                                                    _preselindex.splice(_preselindex.indexOf(idx), 1);
                                                }
                                            }
                                        }
                                    }
                                    break;
                case "combo":
                case "radiogroup":  $(".valuelist-container #chkAll1").dxCheckBox("instance").option("disabled", true);
                                    $(".valuelist-container #chkAll2").dxCheckBox("instance").option("disabled", true);

                                    list1.append("<div id='item_0' style='margin: 7px;'></div>");
                                    list2.append("<div id='selitem_0' style='margin: 7px;'></div>");

                                    var data, datas = new Array();
                                    for(var i=0; i<vals.length; i++) {
                                        data = new Object();
                                        data["text"] = vals[i];
                                        data["value"] = codes[i];
                                        datas.push(data);
                                    }

                                    $(".valuelist-container #item_0").dxRadioGroup({
                                        dataSource : datas,
                                        layout: "vertical"
                                    }).dxRadioGroup("instance");

                                    $(".valuelist-container #selitem_0").dxRadioGroup({
                                        layout: "vertical"
                                    }).dxRadioGroup("instance");
                                    break;
            }

            if (_selindex.length > 0) {
                initSelectedValue();
            }
        }

        // 기존의 선택된 값 화면 열리자마자 표시
        function initSelectedValue() {
            var list1 = $(".valuelist-container #pnlList1");
            var list2 = $(".valuelist-container #pnlList2");

            switch(_selitem.ctltype) {  // Type : date check combo checkgroup radiogroup numeric
                case "text":
                case "numeric":     break;
                case "check":
                case "checkgroup":  for(var i=0; i<_selindex.length; i++){
                                        var id = "item_"+_selindex[i];
                                        //&& var chk = $("#pnlList1 #"+id).dxCheckBox("instance");
                                        var chk = getCtl(id);

                                        list2.append("<div id='sel"+id+"' style='display:block; margin:7px;'></div>");
                                        ctlInst = new oz_expcheck("sel"+id);
                                        registerControl(ctlInst, "sel"+id, true, true);
                                        //&& ctlInst.init();
                                        ctlInst.setText(chk.getText());
                                        ctlInst.codeYes = _codelist.split(";")[i];
                                    }
                                    break;
                case "combo":
                case "radiogroup":  var rdo = $(".valuelist-container #item_0").dxRadioGroup("instance");
                                    var selrdo = $('.valuelist-container #selitem_0').dxRadioGroup("instance");
                                    selrdo.option("dataSource", [{'text': _valuelist.split(";")[_selindex[0]], 'value':_codelist.split(";")[_selindex[0]]}]);
                                    selrdo.option("value", selrdo.option("dataSource")[0]);
                                    break;
            }
        }

        // valuelist 검색
        function searchValueList(searchstr) {
            var list1 = $(".valuelist-container #pnlList1");
            var list1_ch = list1.children(); 
            var len;
            var ctl;
            var exp;
            
            if (searchstr == "") {
                if (_selitem.ctltype == "checkgroup" || _selitem.ctltype == "check") {
                    len = list1_ch.length;
                    for (var i=0; i<len; i++) {
                        getCtl(list1_ch[i].id).ctl.style.display = "block";
                    } 
                } else {
                    // radio / combo
                    var rds = list1_ch.find(".dx-item.dx-radiobutton");
                    len = rds.length;
                    for (var i=0; i<len; i++) {
                        $(rds[i]).css("display", "table");
                    }
                }
            } else {
                if (_selitem.ctltype == "checkgroup" || _selitem.ctltype == "check") {
                    len = list1_ch.length;
                    exp = new RegExp(searchstr);
                    var ids = new Array();

                    // 모든 체크 감추기
                    $(".valuelist-check").css("display", "none");

                    // 보여질 체크의 인덱스 저장
                    for (var i=0; i<len; i++) {
                        ctl = getCtl(list1_ch[i].id);
                        if (exp.test(ctl.getText())) {
                            ids.push(i);
                        }
                    }

                    // 보여질 체크의 display 속성 block으로 바꾸기
                    len = ids.length;
                    for (var i=0; i<len; i++) {
                        ctl = getCtl("item_"+ids[i]);
                        ctl.ctl.style.display = "block";
                    }
                } else {
                    // radio / combo
                    var rds = list1_ch.find(".dx-item.dx-radiobutton");
                    len = rds.length;
                    for (var i=0; i<len; i++) {
                        var txt = $(rds[i]).children(".dx-item-content")[0].textContent;
                        if (txt.indexOf(searchstr) > -1) {
                            $(rds[i]).css("display", "table");
                        } else {
                            $(rds[i]).css("display", "none");
                        }
                    }
                }
            }
        }
    }
    
    /*--------------------------------------------------
      Filter Explorer Item
    ----------------------------------------------------*/
    function oz_expItem() {
        //Common
        this.id;
        this.cubeozid = "";
        this.codetableozid = "";
        this.name = "";
        this.itemtype = "";
        this.ctltype = "";
        this.optr = "";
        this.showLabel = true;
        this.errormessage = "";
        this.ctls = [];
        this.group;
    
        //Dimension
        this.allowAll = true;
        this.allCaption = "";
        this.delimiter = "";
        this.valuelist = [];
        this.codelist = [];
    
        //Fact
        this.maxLength = 0;
        this.min = 0;
        this.max = 0;
        this.format = "";
    
        //Measure
        this.olapItems = [];
        this.content = "";
    
        //Dimension Layer
        this.islayer = false;
        this.layername = "";
        this.layeridx = null;
        this.nextlayer = [];

        this.init = function (xmldata, layername, layeridx, nextlayer) {
            var xmlUI;
            this.id = xmldata.getAttribute("ozid");
            this.cubeid = xmldata.getAttribute("cubeozid");
            this.codetableozid = xmldata.getAttribute("codetableozid") == undefined ? "" : xmldata.getAttribute("codetableozid");
            this.name = xmldata.getAttribute("name");
            this.itemtype = xmldata.tagName;

            if(layeridx != null) {
                this.islayer = true;
                this.layername = layername;
                this.layeridx = layeridx;
                this.nextlayer = nextlayer;
            } else {
                this.layername = this.name;
            }
    
            if(this.itemtype.match("Measure$")){
                var olapitems = xmldata.getElementsByTagName("OlapItems");
                if (olapitems.length > 0) {
                    var olapitem = xmldata.getElementsByTagName("OlapItems")[0].getElementsByTagName("RefItem");
                    /* Used OLAP Items */
                    for(var i=0; i<olapitem.length; i++) {
                        var item = new Object();
                        item.id = olapitem[i].getAttribute("ozid");
                        item.name = olapitem[i].getAttribute("name");
                        item.type = olapitem[i].getAttribute("itemtype");
                        this.olapItems.push(item);
                    }
                }
                this.content = xmldata.getElementsByTagName("Content")[0].textContent;
            }
    
            if(xmldata.getElementsByTagName("UI").length) {
                xmlUI = xmldata.getElementsByTagName("UI")[0];
                this.ctltype = xmlUI.getElementsByTagName("Type")[0].textContent.toLowerCase();
                if(this.ctltype == "checkgroup") {
                    this.optr = "IN";
                } else {
                    switch(xmlUI.getElementsByTagName("Operator")[0].textContent.toUpperCase()) {
                        case ">=" :     this.optr = "&gt;=";
                                        break;
                        case "<=" :     this.optr = "&lt;=";
                                        break;
                        case "<>" :     this.optr = "&lt;&gt;";
                                        break;
                        default   :     this.optr = xmlUI.getElementsByTagName("Operator")[0].textContent.toUpperCase();
                                        break;
                    }
                }
                this.showLabel = (xmlUI.getElementsByTagName("ShowLabel")[0].textContent.toLowerCase() == "true");
    
                switch(this.ctltype) {  // date check combo checkgroup radiogroup numeric
                    case "text":
                    case "combo":
                    case "check":
                    case "checkgroup":
                    case "radiogroup":  if(xmlUI.getElementsByTagName("AllowAll")[0] == undefined) this.allowAll = false;
                                        else {
                                            this.allowAll = (xmlUI.getElementsByTagName("AllowAll")[0].textContent.toLowerCase() == "true");
                                            if(this.allowAll) { 
                                                this.allCaption = xmlUI.getElementsByTagName("AllCaption")[0].textContent; 
                                            }
                                        }
                                        
                                        if(xmlUI.getElementsByTagName("UserItems")[0] != undefined) {
                                            var useritem = xmlUI.getElementsByTagName("UserItems")[0];
                                            this.delimiter = useritem.getAttribute("Delimiter");
                                            if(useritem.getElementsByTagName("ValueList")[0].textContent.length){
                                                this.valuelist = useritem.getElementsByTagName("ValueList")[0].textContent.split(this.delimiter);
                                            }
                                            if(useritem.getElementsByTagName("CodeList")[0].textContent.length){
                                                this.codelist = useritem.getElementsByTagName("CodeList")[0].textContent.split(this.delimiter);
                                            }
                                        }
                                        break;
                    case "numeric":     this.min = xmlUI.getElementsByTagName("Min")[0].textContent;
                                        this.max = xmlUI.getElementsByTagName("Max")[0].textContent;
                                        this.maxLength = xmlUI.getElementsByTagName("MaxLength")[0].textContent;
                                        this.format = xmlUI.getElementsByTagName("Format")[0].textContent;
                                        if(this.format.indexOf(".")) {
                                                this.min = parseFloat(this.min);
                                        this.max = parseFloat(this.max);
                                        this.maxLength = parseFloat(this.maxLength);
                                        } else {
                                            this.min = parseInt(this.min);
                                            this.max = parseInt(this.max);
                                            this.maxLength = parseInt(this.maxLength);
                                        }
                                        break;
                }
            } else {
                this.errormessage = "UI 정보가 없습니다.";
                this.ctltype = "";
            }
        }
    }

/**
 *  @description : ValueList Parser
 */
function oz_ValueListParser() {
    var codelist;
    var captionlist;
    var delimiter;
    var listcount;

    Object.defineProperty(this, 'CodeList', {
        get: function () {
            return codelist;
        },
        set: function (val) {
            codelist = val;
        }
    });

    Object.defineProperty(this, 'CaptionList', {
        get: function () {
            return captionlist;
        },
        set: function (val) {
            captionlist = val;
        }
    });
    Object.defineProperty(this, 'Delimiter', {
        get: function () {
            return delimiter;
        },
        set: function (val) {
            delimiter = val;
        }
    });
    Object.defineProperty(this, 'ListCount', {
        get: function () {
            return listcount;
        },
        set: function (val) {
            listcount = val;
        }
    });

    this.parse = function (val) {
        this.CodeList = '';
        this.CaptionList = '';
        this.ListCount = 0;

        var xmlDoc = ozf_getXMLDoc(val);
        var xroot = xmlDoc.documentElement.childNodes[0];
        if (xroot === null) {
            return;
        }
        var delim = ozf_GetAttributeValue(xroot, "cdatadelimiter");
        this.delimiter = delim;
        var recordcount = parseInt(ozf_GetAttributeValue(xroot, "recordcount", "-1"));;
        if (recordcount === -1) {
            recordcount = parseInt(ozf_GetAttributeValue(xroot, "recordCount", "-1"));;
            if (recordcount === -1) {
                recordcount = parseInt(ozf_GetAttributeValue(xroot, "rowlabelcount", "-1"));;
            }
        }

        if (recordcount === 0) {
            return;
        }

        var xCDat = xroot.getElementsByTagName("DataList")[0].childNodes[0];
        var datalist = ozf_SplitToArray(xCDat.wholeText.trim(), delim);

        if (datalist.length === 0) {
            return;
        }

        var iscode;        
        if (ozf_GetAttributeValue(xroot, "olapitemcodesizelist", delim) === delim) {
            iscode = false;
        } else {
            iscode = true
        }

        var issort;
        if (ozf_GetAttributeValue(xroot, "olapitemsortsizelist", delim) === delim) {
            issort = false;
        } else {
            issort = true
        }

        var i;        
        var captionbuilder = new ozf_stringbuilder();
        var codebuilder = new ozf_stringbuilder();
        var cnt;
        if (issort === false && iscode === false) {
            cnt = datalist.length;
            for (i = 0; i < cnt; i++) {
                captionbuilder.append(datalist[i]);
                captionbuilder.append(delim);
            }
        } 

        if (issort === true && iscode === true) {
            cnt = datalist.length;
            for (i = 0; i < cnt; i++) {
                if (i % 3 === 0) {
                    captionbuilder.append(datalist[i]);
                    captionbuilder.append(delim);
                } else if (i % 3 === 2) {
                    codebuilder.append(datalist[i]);
                    codebuilder.append(delim);
                }
            }
        }

        if (issort === false && iscode === true) {
            cnt = datalist.length;
            for (i = 0; i < cnt; i++) {
                if (i % 2 === 0) {
                    captionbuilder.append(datalist[i]);
                    captionbuilder.append(delim);
                } else if (i % 2 === 1) {
                    codebuilder.append(datalist[i]);
                    codebuilder.append(delim);
                }
            }
        }

        this.ListCount = recordcount;
        this.CaptionList = captionbuilder.toString();
        this.CodeList = codebuilder.toString();
        this.CaptionList = ozf_RemoveLastDelimiter(this.CaptionList, this.delimiter);
        this.CodeList = ozf_RemoveLastDelimiter(this.CodeList, this.delimiter);
    }
}

function oz_expcheck(id) {
    this.id = id;
    this.codeYes ='1';
    this.codeNo = '0';
    this.ctl;
    var onValueChanged = null;

    this.dispose = function () {
        onValueChanged = null;
        this.ctl = null;
        $(this.id).remove();        
    }

    // Object.defineProperty(this, 'Name', {
    //     get: function () {
    //         return this.id.replace('\#', '');
    //     },
    //     set: function (val) {
    //     }
    // });

    // Object.defineProperty(this, 'onValueChanged', {
    //     get: function () {
    //         return onValueChanged;
    //     },
    //     set: function (val) {
    //         onValueChanged = val;
    //     }
    // });

    //체크박스 생성
    this.init = function () {
        //&& var chk = $(this.id)
        //&& chk.dxCheckBox({ format: 'date' });
        //&& var temp = document.createElement('div');
        //&& temp.innerHTML = ;
        var chk = document.getElementById(id);
        chk.innerHTML = "<input id='c"+this.id+"' type='checkbox'/><label id='l"+this.id+"'' class='checkbox-text' for='c"+this.id+"'></label>";
        //&& this.ctl = chk.dxCheckBox('instance');
        this.ctl = chk;

        return this.ctl;
    }
}

//체크박스 값 반환 ('0'/'1')
if (!oz_expcheck.prototype.getValue) {
    oz_expcheck.prototype.getValue = function () {
        var val;
        var chk = this.ctl.getElementsByTagName("input")[0];
        if (chk.checked == true) {
            return this.codeYes;
        } else {
            return this.codeNo;
        }

        //&&
        // if (this.ctl.option('value') == true) {
        //     return this.codeYes;
        // }
        // else {
        //     return this.codeNo;
        // }
    }
}
//체크박스 값 설정 ('0'/'1')
if (!oz_expcheck.prototype.setValue) {
    oz_expcheck.prototype.setValue = function (val) {
        var chk = this.ctl.getElementsByTagName("input")[0];
        if (val == this.codeYes) {
            chk.checked = true;
        }
        else {
            chk.checked = false;
        }

        //&&
        // if (val == this.codeYes) {
        //     this.ctl.option('value', true);
        // }
        // else {
        //     this.ctl.option('value', false);
        // }
    }
}
//체크박스 텍스트 반환
if (!oz_expcheck.prototype.getText) {
    oz_expcheck.prototype.getText = function () {
        var lb = this.ctl.getElementsByTagName("label")[0];
        return lb.innerText; 
        //&& return this.ctl.option('text');
    }
}
//체크박스 텍스트 설정
if (!oz_expcheck.prototype.setText) {
    oz_expcheck.prototype.setText = function (val) {
        this.setValueFlag = true;
        var lb = this.ctl.getElementsByTagName("label")[0];
        lb.innerText = val;
        //&& this.ctl.option('text', val);
        this.setValueFlag = false;
    }
}
//체크박스 값 반환 (true/false)
if (!oz_expcheck.prototype.getCheck) {
    oz_expcheck.prototype.getCheck = function () {
        var chk = this.ctl.getElementsByTagName("input")[0];
        return chk.checked; 
        //&& return this.ctl.option('value');
    }
}
//체크박스 값 설정 (true/false)
if (!oz_expcheck.prototype.setCheck) {
    oz_expcheck.prototype.setCheck = function (val) {
        var chk = this.ctl.getElementsByTagName("input")[0];
        chk.checked = val
        //&& this.ctl.option('value', val);
    }
}
// //체크박스 이벤트리스너 추가
// if (!oz_expcheck.prototype.addEventListener) {
//     oz_expcheck.prototype.addEventListener = function (e, f) {
//         switch (e) {
//             case "onValueChanged":
//                 this.onValueChanged = f;
//                 break;
//         }
//     }
// }