/**
 * @description
 */
function ozcampflow(id) {
    var vid = id; //div 태그 아이디
    var vCampID = "";  //캠페인ID
    var vRegProcID = "";  //프로세스 ID
    var vRegProcKind = "";  //프로세스 타입 C:캠페인, S:설문
    var vStat = ""; //현재상태
    var CampStat = "";  // 캠페인 현재 상태
    var inst = this;

    var ProcTmData = "";  //프로세스정보 JSON
    var CampHistList = new Array();  //캠페인History Array
    var CampStatList = new Array();
    var vFrameChangeIng = false;  //화면전환중인지아닌지

    this.ShowFrameFnc = function (e) { } //화면 이동하려고 이벤트 발생

    var vLoadServerSelector = "";
    /**
     *LoadServerSelector 설정
     * 사용하지 않음
     */
    this.LoadServerSelector = function(val){
     	vLoadServerSelector = val;
    }

    /**
    * 칼라 설정 CSS에서 직접 수정하여야함
    * 사용하지 않음
    */
    var vBasicColor = "";
    var vPossibleColor = "";
    var vStayColor = "";
    var vStayCntBasicColor = "";
    var vStayCntPossibleColor = "";
    var vStayCntStayColor = "";
    var vStayNameColor = "";
    var vFlowBackColor = "";
    var vCheckCompleteColor = "";

    /**
    *BasicColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'BasicColor', {
        get: function () {
            return vBasicColor;
        },
        set: function (val) {
            vBasicColor = val;
        }
    });

    /**
    *PossibleColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'PossibleColor', {
        get: function () {
            return vPossibleColor;
        },
        set: function (val) {
            vPossibleColor = val;
        }
    });

    /**
    *StayColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'StayColor', {
        get: function () {
            return vStayColor;
        },
        set: function (val) {
            vStayColor = val;
        }
    });

    /**
    *StayCntBasicColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'StayCntBasicColor', {
        get: function () {
            return vStayCntBasicColor;
        },
        set: function (val) {
            vStayCntBasicColor = val;
        }
    });

    /**
    *StayCntPossibleColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'StayCntPossibleColor', {
        get: function () {
            return vStayCntPossibleColor;
        },
        set: function (val) {
            vStayCntPossibleColor = val;
        }
    });

    /**
    *StayCntStayColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'StayCntStayColor', {
        get: function () {
            return vStayCntStayColor;
        },
        set: function (val) {
            vStayCntStayColor = val;
        }
    });

    /**
    *StayNameColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'StayNameColor', {
        get: function () {
            return vStayNameColor;
        },
        set: function (val) {
            vStayNameColor = val;
        }
    });

    /**
    *FlowBackColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'FlowBackColor', {
        get: function () {
            return vFlowBackColor;
        },
        set: function (val) {
            vFlowBackColor = val;
        }
    });

    /**
    *CheckCompleteColor 설정
    * 사용하지 않음
    */
    Object.defineProperty(this, 'CheckCompleteColor', {
        get: function () {
            return vCheckCompleteColor;
        },
        set: function (val) {
            vCheckCompleteColor = val;
        }
    });




    /**
    *CampID 설정
    */
    Object.defineProperty(this, 'CampID', {
        get: function () {
            return vCampID;
        },
        set: function (val) {
            vCampID = val;
        }
    });


    /**
    *현재 상태
    */
    Object.defineProperty(this, 'NowStat', {
        get: function () {
            return vStat;
        },
        set: function (val) {
            vStat = val;
        }
    });


    /**
    *프로세스 타입
    * C : 캠페인
    * S : 설문
    */
    Object.defineProperty(this, 'RegProcKind', {
        get: function () {
            return vRegProcKind;
        },
        set: function (val) {
            vRegProcKind = val;
        }
    });


    /**
    * PROCID
    */
    Object.defineProperty(this, 'REG_PROC_ID', {
        get: function () {
            return vRegProcID;
        },
        set: function (val) {
            vRegProcID = val;
        }
    });


    /**
    *프레임 주소
    *현재선택되어있는 프레임 주소
    */
    Object.defineProperty(this, 'FrameAdd', {
        get: function () {
            var vFrameAdd = this.GetNowStatFrameAdd();
            return vFrameAdd;
        }
    });



    /**
    * 화면 전환중 변수
    **/
    Object.defineProperty(this, 'FrameChangeIng', {
        get: function () {
            return vFrameChangeIng;
        },
        set: function (val) {
            vFrameChangeIng = val;
        }
    });


    /**
     * 초기화
     */
    this.Initialize = function () {
        var vvCampID = this.CampID;
        var vvRegProcID = this.REG_PROC_ID;
        this.SetProcBasicDataSearch();  //기초정보 조회
        this.SetFlow();
        this.Refresh(this.CampID);
        this.NowStat = CampStatList[0];
        this.SetBaseInfo();
    }



    /**
     *기본설정
     */
    this.SetBaseInfo = function () {
        //클릭 이벤트  Circle, Bar, Name, Number
        $("div[id^='Flow']").each(function () {
            $(this).click(function () {
                //alert(this.id);
                if (inst.FrameChangeIng === true) {
                    return;
                } else {
                    inst.itemClick(this);
                }                
            });
        });
    }



    /**
     * 상태 클릭시 이벤트
     * @param {any} item
     */
    this.itemClick = function (item) {
        if (typeof (item) === "undefined") item = '';

        var StateCode = "";
        var StateName = "";
        var StateNecessayYn = "";
        var StateDesc = "";
        var ClickStay = "";
        var vNextStatCd = "";
        var Pid = $('#' + item.id).parent("td")[0];

        ClickStay = $('#' + Pid.id).attr('stay');
        StateCode = $('#' + Pid.id).attr('statcd');
        StateNecessayYn = $('#' + Pid.id).attr('ncssyn');

        if (ClickStay.equals("Basic")) { //기본일경우 클릭되지 않음

        } else if ((ClickStay.equals("Possible")) || (ClickStay.equals("Stay"))) {  //클릭가능한 화면일경우 이벤트 발생 현재 보여주는 화면도 같이
            this.NowStat = StateCode;
            vNextStatCd = this.NextNecessaryStatCd(CampStat);
            this.ContColorChange(StateCode, vNextStatCd);

            // 이벤트 발생 프레임 바뀌도록
            inst.ShowFrameFnc();
        }
    }




    /**
     * 현재 선택된 프레임 주소
     */
    this.GetNowStatFrameAdd = function () {
        var vFrameAdd = "";
        var ProcInfo = "";    //프로세스 정보
        var CampStatCd = "";   //상태코드
        var CampStatNm = "";   //상태명
        var NcssYn = "";       //필수여부
        var FramePath = "";    //프레임주소
        var ObjDesc = "";      //설명

        for (var i = 0; i < ProcTmData.length; i++) {
            FlowInfo = "";
            FlowCnt = i + 1;
            ProcInfo = ProcTmData[i];
            for (var name in ProcInfo) {
                //alert(name + " ::::: " + ProcInfo[name]);
                if (name.equals("CAMP_STAT_CD")) {
                    CampStatCd = ProcInfo[name];
                } else if (name.equals("CAMP_STAT_NM")) {
                    CampStatNm = ProcInfo[name];
                } else if (name.equals("NCSS_YN")) {
                    NcssYn = ProcInfo[name];
                } else if (name.equals("FRAME_PATH")) {
                    FramePath = ProcInfo[name];
                } else if (name.equals("OBJ_DESC")) {
                    ObjDesc = ProcInfo[name];
                }
            }

            if (CampStatCd.equals(this.NowStat)) {
                vFrameAdd = FramePath;
                break;
            }
        }
        return vFrameAdd;
    }


    /**
     * Proc정보 조회
     */
    
    this.SetProcBasicDataSearch = function (vID) {
        if (typeof (vID) === "undefined") vID = '';
        CampStatList = new Array();

        var tmhandler = new oza_TMHandler('com.obzen.ecampaign.ColCampFlow', 'selectCampRegProc', '0', '@#%');
        tmhandler.setAddDataField('REG_PROC_ID', this.REG_PROC_ID);  //TargetReg : 타겟 캠페인, MassReg : Mass캠페인, BatchReg : 주기성 캠페인, ...
        tmhandler.setAddDataField('CAMP_ID', this.CampID);
        tmhandler.execute(null, false);
        if (tmhandler.getIsError()) {
            ozf_MsgBox('조회 중 다음과 같은 오류가 발생했습니다.\n' + tmhandler.getErrormessage(), function () {
                return;
            });
        }
        var TMResult = tmhandler.getResult();
        ProcTmData = JSON.parse(TMResult);
        tmhandler = "";

        var ProcInfo = "";    //프로세스 정보
        var CampStatCd = "";   //상태코드
        var CampStatNm = "";   //상태명
        var NcssYn = "";       //필수여부
        var FramePath = "";    //프레임주소
        var ObjDesc = "";      //설명

        var Flowtr = document.getElementById('Flowtr');
        var FlowInfo = "";   //HTML Flow 정보
        var FlowCnt = "";
        for (var i = 0; i < ProcTmData.length; i++) {
            FlowInfo = "";
            FlowCnt = i + 1;
            ProcInfo = ProcTmData[i];
            for (var name in ProcInfo) {
                //alert(name + " ::::: " + ProcInfo[name]);
                if (name.equals("CAMP_STAT_CD")) {
                    CampStatCd = ProcInfo[name];
                } else if (name.equals("CAMP_STAT_NM")) {
                    CampStatNm = ProcInfo[name];
                } else if (name.equals("NCSS_YN")) {
                    NcssYn = ProcInfo[name];
                } else if (name.equals("FRAME_PATH")) {
                    FramePath = ProcInfo[name];
                } else if (name.equals("OBJ_DESC")) {
                    ObjDesc = ProcInfo[name];
                }
            }
            CampStatList.push(CampStatCd);
        }
    }


    /**
     * 캠페인 Stat 조회
     */
    this.SelCampStat = function () {
        var tmhandler = new oza_TMHandler('com.obzen.ecampaign.ColCampFlow', 'selectCampStat', '0', '@#%');
        tmhandler.setAddDataField('CAMP_ID', this.CampID);
        tmhandler.setAddDataField('REG_PROC_KIND', this.RegProcKind);
        tmhandler.execute(null, false);
        if (tmhandler.getIsError()) {
            ozf_MsgBox('조회 중 다음과 같은 오류가 발생했습니다.\n' + tmhandler.getErrormessage(), function () {
                return;
            });
        }
        var TMResult = tmhandler.getResult();
        var StatTmData = JSON.parse(TMResult);
        var statData = "";
        var vCampStat = "";
        for (var i = 0; i < StatTmData.length; i++) {
            statData = StatTmData[i];
            vCampStat = statData['CAMP_STAT'];
        }
        tmhandler = "";
        return vCampStat;
    }

    /**
     * 화면 Flow 설정 화면 그리기
     */
    this.SetFlow = function () {
        var ProcInfo = "";    //프로세스 정보
        var CampStatCd = "";   //상태코드
        var CampStatNm = "";   //상태명
        var NcssYn = "";       //필수여부
        var FramePath = "";    //프레임주소
        var ObjDesc = "";      //설명

        var rootid = '#' + vid;

        $('.FlowTable').remove();  //기본정보 삭제

        var FlowTable = "";
        FlowTable += "<table id='FlowTable' class='FlowTable'> ";
        FlowTable += "   <tr id='Flowtr' class='FlowTr' />     ";
        FlowTable += "</table>                                 ";    
                        
        $(rootid).append(FlowTable);

        var Flowtr = document.getElementById('Flowtr');
        var FlowInfo = "";   //HTML Flow 정보
        var FlowCnt = "";
        for (var i = 0; i < ProcTmData.length; i++) {
            FlowInfo = "";
            FlowCnt = i + 1;
            ProcInfo = ProcTmData[i];
            for (var name in ProcInfo) {
                //alert(name + " ::::: " + ProcInfo[name]);
                if (name.equals("CAMP_STAT_CD")) {
                    CampStatCd = ProcInfo[name];
                } else if (name.equals("CAMP_STAT_NM")) {
                    CampStatNm = ProcInfo[name];
                } else if (name.equals("NCSS_YN")) {
                    NcssYn = ProcInfo[name];
                } else if (name.equals("FRAME_PATH")) {
                    FramePath = ProcInfo[name];
                } else if (name.equals("OBJ_DESC")) {
                    ObjDesc = ProcInfo[name];
                }
            }

            if (NcssYn.equals("1")) {  //필수항목 * 표시
                CampStatNm += "*";
            }

            FlowInfo += " <td class='FlowTd' id='Flow_" + CampStatCd + "' StatCd='" + CampStatCd + "' frameadd='" + FramePath + "' ncssYn='" + NcssYn + "' stay='Basic'> ";
            FlowInfo += "    <div class='FlowBasicBar' id='FlowBar_" + FlowCnt + "' />      ";
            FlowInfo += "    <div class='FlowLabelNm' id='FlowLabelNm_" + FlowCnt + "'>  ";
            FlowInfo += "      <label> " + CampStatNm + " </label>                         ";
            FlowInfo += "   </div>                                                         ";
            FlowInfo += "   <div class='FlowCheck_Hidden' id='FlowCheck_" + FlowCnt + "' /> ";
            FlowInfo += "   <div class='FlowBasicCircle' id='FlowCircle_" + FlowCnt + "' /> ";
            FlowInfo += "    <div class='FlowBasicNumber' id='FlowNumber_" + FlowCnt + "'> ";
            FlowInfo += "       <label>" + FlowCnt + "</label>                             ";
            FlowInfo += "    </div>                                                        ";
            FlowInfo += " </td>                                                            ";

            //alert("Flow INFO :::: " + FlowInfo);
            $("#Flowtr").append(FlowInfo);  //Flow 그리기
        }

    }

    /**
     * 새로고침
     */
    this.Refresh = function (vCampID, vNowStat) {
        if (typeof (vCampID) === "undefined") vCampID = '';
        if (typeof (vNowStat) === "undefined") vNowStat = '';

        //alert("start refresh");
        if (typeof (vCampID) === "undefined") vCampID = '';
        if (typeof (vNowStat) === "undefined") vNowStat = '';
        this.CampID = vCampID
        this.ReFreshColor();
        if (this.CampID.equals("")) {  //CampID Null 
            this.NowStat = "";
            CampStat = "";
        } else {
            CampStat = this.SelCampStat(); //캠페인 상태 조회
        }
        var StateCode = CampStatList[0];
        var vNextStatCd = this.NextNecessaryStatCd(CampStat);

        this.ContColorChange(StateCode, vNextStatCd);

        if (!vNowStat.equals("")) {
            this.NowStat = vNowStat;
            vNextStatCd = this.NextNecessaryStatCd(CampStat);
            this.ContColorChange(this.NowStat, vNextStatCd);
        }
        this.CompleteCheck();
    }



    /**
     * 완료된 항목 체크
     */
    this.CompleteCheck = function () {
        this.GetCampHIst();

        var NewStat = "";
        var StateCode = "";
        var mode = "";
        var Exist = "0";

        var Flowtd = $('[class^=FlowTd]');
        var cnt = Flowtd.length;

        for (var i = 0; i < cnt; i++) {
            NewStat = Flowtd[i];
            StateCode = $('#' + NewStat.id).attr('statcd');

            for (var j = 0; j < CampHistList.length; j++) {
                if ((StateCode.equals(CampHistList[j])) && (StateCode <= CampStat)) {
                    Exist = "1";
                    break;
                }
            }
            if (Exist.equals("1")) {
                mode = "Complete";
            } else {
                mode = "Basic";
            }
            this.SetCheckStat(NewStat, mode);
            Exist = "0";
        }
    }


    /**
     * 체크 설정
     * @param {any} NewStay
     * @param {any} mode
     */
    this.SetCheckStat = function (NewStay, mode) {
        if (typeof (NewStay) === "undefined") NewStay = '';
        if (typeof (mode) === "undefined") mode = '';

        var vFlow = $("#" + NewStay.id + " div[id^='FlowCheck']");
        var vid = "";
        var vmode = "";
        if (mode.equals("Complete")) {
            vmode = "FlowCheck";
        } else if (mode.equals("Basic")) {
            vmode = "FlowCheck_Hidden";
        }

        for (var i = 0; i < vFlow.length; i++) {
            vid = vFlow[i].id;
            $('#' + vid).attr('class', vmode);
        }
    }

    /**
     * 캠페인 History조회
     */
    this.GetCampHIst = function () {
        CampHistList = new Array();  //array 초기화
        if (this.CampID.equals("")) {  //캠페인ID가없을경우 그냥 끝나기
            return;
        }

        var HistList = "";
        var tmhandler = new oza_TMHandler('com.obzen.ecampaign.ColCampFlow', 'selectCampHist', '0', '@#%');
        tmhandler.setAddDataField('CAMP_ID', this.CampID);
        tmhandler.setAddDataField('REG_PROC_KIND', this.RegProcKind);
        tmhandler.execute(null, false);
        if (tmhandler.getIsError()) {
            ozf_MsgBox('조회 중 다음과 같은 오류가 발생했습니다.\n' + tmhandler.getErrormessage(), function () {
                return;
            });
        }
        var TMResult = tmhandler.getResult();
        var HistTmData = JSON.parse(TMResult);
        var hist_data = "";
        var vhist = "";

        for (var i = 0; i < HistTmData.length; i++) {
            hist_data = HistTmData[i];
            vhist = hist_data['HM_CAMP_STAT'];
            CampHistList.push(vhist);
        }
        tmhandler = "";
    }


    /**
     * 다음 필수 항목이 무엇인지 조회
     * @param {any} Statcd
     */
    this.NextNecessaryStatCd = function (Statcd) {
        if (typeof (Statcd) === "undefined") Statcd = '';

        var vNextStatCd = "";
        var ProcInfo = "";    //프로세스 정보
        var CampStatCd = "";   //상태코드
        var CampStatNm = "";   //상태명
        var NcssYn = "";       //필수여부
        var FramePath = "";    //프레임주소
        var ObjDesc = "";      //설명

        if (Statcd.equals("")) {
            Statcd = "0";
        }

        for (var i = 0; i < ProcTmData.length; i++) {
            FlowInfo = "";
            FlowCnt = i + 1;
            ProcInfo = ProcTmData[i];
            for (var name in ProcInfo) {
                //alert(name + " ::::: " + ProcInfo[name]);
                if (name.equals("CAMP_STAT_CD")) {
                    CampStatCd = ProcInfo[name];
                } else if (name.equals("CAMP_STAT_NM")) {
                    CampStatNm = ProcInfo[name];
                } else if (name.equals("NCSS_YN")) {
                    NcssYn = ProcInfo[name];
                } else if (name.equals("FRAME_PATH")) {
                    FramePath = ProcInfo[name];
                } else if (name.equals("OBJ_DESC")) {
                    ObjDesc = ProcInfo[name];
                }
            }

            if ((Statcd < CampStatCd) && (NcssYn.equals("1"))) {
                vNextStatCd = CampStatCd;
                break;
            }
        }

        if (vNextStatCd.equals("")) {
            vNextStatCd = this.NextStatCd(CampStat);
        }
        if (vNextStatCd.equals("")) {
            vNextStatCd = CampStat;
        }
        return vNextStatCd;
    }


    /**
     * 색 변경
     * @param {any} ClickStatcd 클릭한상태
     * @param {any} NextStatCd  다음상태
     */
    this.ContColorChange = function (ClickStatcd, NextStatCd) {
        if (typeof (ClickStatcd) === "undefined") ClickStatcd = '';
        if (typeof (NextStatCd) === "undefined") NextStatCd = '';

        var Flowtd = $('[class^=FlowTd]');
        var cnt = Flowtd.length;
        var NewStay = "";
        var StateCode = "";
        var StateNecessayYn = "";
        var mode = "";
        for (var i = 0; i < cnt; i++) {
            NewStay = Flowtd[i];
            StateCode = $('#' + NewStay.id).attr('statcd');

            if (StateCode.equals(ClickStatcd)) {  //선택한 항목일경우 변경
                mode = "Stay";
            } else if ((!NextStatCd.equals("")) && (StateCode <= NextStatCd)) {  //선택할수있는 항목일경우
                mode = "Possible";
            } else {  //나머지 선택 불가
                mode = "Basic";
            }
            this.ModeChange(NewStay, mode);
        }
    }

    /**
     * 모드변경
     * @param {any} NewStay
     * @param {any} mode
     */
    this.ModeChange = function (NewStay, mode) {
        if (typeof (NewStay) === "undefined") NewStay = '';
        if (typeof (mode) === "undefined") mode = '';

        var vBarMode = "";
        var vCircleMode = "";
        var vNumberMode = "";

        if (mode.equals("Stay")) {
            vBarMode = "FlowStayBar";
            vCircleMode = "FlowStayCircle";
            vNumberMode = "FlowStayNumber";
        } else if (mode.equals("Possible")) {
            vBarMode = "FlowPossibleBar";
            vCircleMode = "FlowPossibleCircle";
            vNumberMode = "FlowPossibleNumber";
        } else if (mode.equals("Basic")) {
            vBarMode = "FlowBasicBar";
            vCircleMode = "FlowBasicCircle";
            vNumberMode = "FlowBasicNumber";
        }

        var vFlow = $("#" + NewStay.id + " div[id^='Flow']");
        var vid = "";
        var vTemp = "";
        var vType = "";
        $('#' + NewStay.id).attr('stay', mode);

        for (var i = 0; i < vFlow.length; i++) {
            vid = vFlow[i].id;
            vTemp = vid.split("_");
            vType = vTemp[0];

            if (vType.equals("FlowBar")) {
                $('#' + vid).attr('class', vBarMode);
            } else if (vType.equals("FlowCircle")) {
                $('#' + vid).attr('class', vCircleMode);
            } else if (vType.equals("FlowNumber")) {
                $('#' + vid).attr('class', vNumberMode);
            }
        }
    }



    /**
     * 다음 항목이 무엇인지 조회
     * @param {any} Statcd
     */
    this.NextStatCd = function (Statcd) {
        if (typeof (Statcd) === "undefined") Statcd = '';

        var vNextStatCode = "";
        var ProcInfo = "";    //프로세스 정보
        var CampStatCd = "";   //상태코드
        var CampStatNm = "";   //상태명
        var NcssYn = "";       //필수여부
        var FramePath = "";    //프레임주소
        var ObjDesc = "";      //설명
        if (Statcd.equals("")) {
            Statcd = 0;
        }

        for (var i = 0; i < ProcTmData.length; i++) {
            ProcInfo = ProcTmData[i];
            for (var name in ProcInfo) {
                if (name.equals("CAMP_STAT_CD")) {
                    CampStatCd = ProcInfo[name];
                } else if (name.equals("CAMP_STAT_NM")) {
                    CampStatNm = ProcInfo[name];
                } else if (name.equals("NCSS_YN")) {
                    NcssYn = ProcInfo[name];
                } else if (name.equals("FRAME_PATH")) {
                    FramePath = ProcInfo[name];
                } else if (name.equals("OBJ_DESC")) {
                    ObjDesc = ProcInfo[name];
                }
            }

            if (Statcd < CampStatCd) {
                vNextStatCode = CampStatCd;
                break;
            }
        }
        return vNextStatCode;
    }



    /**
     * 칼라 초기화
     */
    this.ReFreshColor = function () {
        //Bar 기본색으로 변경
        $('#FlowTable .FlowStayBar').each(function () {  //FlowStayBar를 FlowBasicBar
            $(this).attr('class', 'FlowBasicBar');
        });
        $('#FlowTable .FlowPossibleBar').each(function () {  //FlowPossibleBar를 FlowBasicBar
            $(this).attr('class', 'FlowBasicBar');
        });

        //Circle 기본색으로 변경
        $('#FlowTable .FlowStayCircle').each(function () {  //FlowStayCircle를 FlowBasicCircle
            $(this).attr('class', 'FlowBasicCircle');
        });
        $('#FlowTable .FlowPossibleCircle').each(function () {  //FlowPossibleCircle를 FlowBasicCircle
            $(this).attr('class', 'FlowBasicCircle');
        });


        //Number을 기본색으로
        $('#FlowTable .FlowStayNumber').each(function () {  //FlowStayNumber 를 FlowBasicNumber
            $(this).attr('class', 'FlowBasicNumber');
        });
        $('#FlowTable .FlowPossibleNumber').each(function () {  //FlowPossibleNumber 를 FlowBasicNumber
            $(this).attr('class', 'FlowBasicNumber');
        });


        //체크 해제
        $('#FlowTable .FlowCheck').each(function () {  //FlowCheck 를 FlowCheck_Hidden
            $(this).attr('class', 'FlowCheck_Hidden');
        });
    }

    /**
     * 다음 항목으로 이동
     * @param {any} vNowStat
     */
    this.GoNextStep = function (vNowStat) {
        if (typeof (vNowStat) === "undefined") vNowStat = '';

        this.Refresh(this.CampID);
        var NextStat = this.NextStatCd(vNowStat);
        var NextNecessayStat = this.NextNecessaryStatCd(CampStat);

        this.ContColorChange(NextStat, NextNecessayStat);
        this.CompleteCheck();
        this.NowStat = NextStat;
    }

    /**
     * 프로세스 데이터 다시 조회  캠페인의 특정 조건에 따른 필수조건 변경을 위하여 다시 조회 하도록
     * @param {any} vCampID
     */
    this.ReSetProcBasicData = function (vCamp_ID) {
        if (typeof (vCamp_ID) === "undefined") vCamp_ID = '';
        this.SetProcBasicDataSearch(vCampID);
    }

}

/**
* 클릭시 이벤트 발생
*/
if (!ozcampflow.prototype.addEventListener) {
    ozcampflow.prototype.addEventListener = function (e, f) {
        if (e === "showframe") {
            this.ShowFrameFnc = f;
        }
    }
}
