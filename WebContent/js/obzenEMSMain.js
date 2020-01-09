    //-***************************************************************************************************************************
	 // Dependency
    //-***************************************************************************************************************************
	 //- obzenEMSBase.js	clsMenu clsDict
    //-***************************************************************************************************************************

    //-***************************************************************************************************************************
    // Var
    //-***************************************************************************************************************************
    var gCatMenuList = "";              // String - CategoryMenu name list seperated by comma ("즐겨찾기,D3F,Targeting,Campaign,REBM")
    var gCatMenus = [];                 // Array for CategoryMenuList
    var gItemMenus = new clsDict();     // Collection for All Menu Items by ozid Key
    var gCurIdxOfCatMenu = 0;           // Selected index(base 0) of catMenu 
    var gCurTabUI;
    //-------------------------------------//
    var gDicTempCon = new clsDict();       //Temporary Variables
    var gPopOwner = {};                    //Popup
    var gPopTag = "";
    //--------------------------------------//
    var gWho = "admin";                     //findCurUserInfo
    var gUserName = "", myAuth = "",
        gGroupName = "", gGroupDesc = "",   
    	gStoreCd = "", gStoreNm = "", 
    	gBrandNm = "", gUserCaption= "";	//fillUserInfo
    //--------------------------------------//
    var gMyFavCat = null;                   //pClsMCat;_favorites. fetchMenu에서 값 지정되고 fetchMyMenu에서 사용
    //--------------------------------------//
    var gIcons = new clsDict();             //Icon PathData (Key: Image ID)
    var gIconsInfo = new clsDict();         //Icon viewbox value (Key: Image ID)
    //-***************************************************************************************************************************
    // Options
    //-***************************************************************************************************************************
    var gOptExpandOnlyOne = true;       //true: Only One GroupMenu is expanded at any time.
    //-***************************************************************************************************************************
    // Constant
    //-***************************************************************************************************************************
    //  Config Name
    var constConfig = ".sys.MyMenu.CMS7";
    //  이미지 Path ( - )
    var constIPathMin = "M 20,20L 56,20L 56,56L 20,56L 20,20 Z M 24,24L 24,52L 52,52L 52,24L 24,24 Z M 31,36L 45,36L 45,40L 31,40L 31,36 Z";
    //  이미지 Path ( + )
    var constIPathMax = "M 20,20L 56,20L 56,56L 20,56L 20,20 Z M 24,24L 24,52L 52,52L 52,24L 24,24 Z M 31,36L 36,36L 36,31L 40,31L 40,36L 45,36L 45,40L 40,40L 40,45L 36,45L 36,40L 31,40L 31,36 Z";
    
    //-***************************************************************************************************************************


    //-***************************************************************************************************************************
    // Loading
    //-***************************************************************************************************************************
    $(document).ready(function () {
        initEMS();
        if(sessionStorage.getItem("SYSDIV") == 1 || sessionStorage.getItem("SYSDIV") == 3){ //EDI사용자 / SmartHub 공시사항 출력
        	parent.OpenPage("브랜드 프로필","/ManageBaseServer/Frames/Campaign/BMP/CampPlan/web_brandprofile_main","");//탭 열기
        	//parent.OpenPage("공지사항","/ManageBaseServer/Frames/Campaign/BMP/CampPlan/web_brandnotice_main","");//탭 열기
        }else{
        	parent.OpenPage("FIT 행사현황","/ManageBaseServer/Frames/Campaign/BMP/CampPlan/web_chart_campprogressinfo_main","");//탭 열기
        	//parent.OpenPage("FIT 행사현황","/ManageBaseServer/Frames/Campaign/BMP/CampPlan/web_chart_campprogressinfo_main","");//탭 열기
        }
        
        
        //공지 팝업 호출 시작----------------------------------------------
		var url = "../jsp/web_notice_pop.jsp";
		var name = "web_notice_pop";
		var option = "location=no,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no";
		
		//공지사항 목록
		var url2 = "../jsp/web_notice_pop2.jsp";
		var name2 = "web_notice_pop2";
		var option2 = "location=no,menubar=no,resizable=no,scrollbars=no,titlebar=no,toolbar=no";
		
		//해상도 계산하여 위치 조절
		//var popupX = (document.body.offsetWidth / 2) - (200 / 2);
		//var popupY = (document.body.offsetHeight / 2) - (300 / 2);
		
		var popupX = (screen.width / 2) - 350;
		var popupY = (screen.height / 2) - 300;
		
		
		option += ",top="+popupY+",left="+popupX+",height=539,width=670";
		option2 += ",top="+popupY+",left="+popupX+",height=490,width=975";
		 
		if(sessionStorage.getItem("SYSDIV") == 1 || sessionStorage.getItem("SYSDIV") == 3){ //EDI사용자 / SmartHub 공지 팝업 호출
			window.open(url, name, option);
			window.open(url2, name2, option2);
		}
		
		//공지 팝업 호출 종료----------------------------------------------
		
	    
        //로그인 정보 추가
        var today = new Date();
        var m = today.getMonth()+1;
    	var d = today.getDate();
    	var h = today.getHours();
    	var i = today.getMinutes();
    	var s = today.getSeconds();
        var date = today.getFullYear()+''+(m>9?m:'0'+m)+''+(d>9?d:'0'+d);
        var time = (h>9?h:'0'+h)+''+(i>9?i:'0'+i)+''+(s>9?s:'0'+s);
        
        var instLoginLog = new oza_TMHandler('com.obzen.bmp.DocBMPComm', 'insertLoginLog', '1', '\@#%');
        instLoginLog.setAddDataField('SYS_USE_DT', date);
        instLoginLog.setAddDataField('SYS_USE_TIME', time);
        instLoginLog.setAddDataField('SYS_USE_USER_ID', gWho);
        instLoginLog.setAddDataField('MD_CD', sessionStorage.getItem("MD_CD"));
        instLoginLog.execute(null, false);
        instLoginLog.clear();
        
        $(".clsLiMRun").hover(function(){
        	$(this).children("div").html("· &nbsp;&nbsp;&nbsp;" + $(this).children("div").html());
        	  }, function(){
        		  $(this).children("div").html($(this).children("div").html().replace("· &nbsp;&nbsp;&nbsp;",""));
        });

    });

    //-***************************************************************************************************************************
    // Main Internal
    //-***************************************************************************************************************************
    function initEMS() {
        //window.document.title = "오브젠::캠페인시스템 - [접속정보 : " + server.value + "]";
        initEnv();

        
        //Button Handler
        $("#actLogOut").click(function () {
            sessionStorage.clear();
            window.location.replace("../obzenEMS.html");
        });
        $("#actMinMax").click(function () {
            if ($(this).attr("data-state") == "+") {
                $("#divSubMenu").css("visibility", "visible");
                //$("#divSubMenu").animate({ visibility: "visible" });
                $("#divMenu").animate({ width: "272px" });
                $("#divContent").animate({left: "273px"});
                $(this).attr("data-state", "-");
                $("#pthMinMax").attr("d", constIPathMin);
            }
            else {
                $("#divSubMenu").css("visibility", "hidden");
                //$("#divMenu").css("width", "80px");
                //$("#divContent").css("left", "81px");
                //$("#divSubMenu").animate({ visibility: "hidden" });
                $("#divMenu").animate({ width: "62px" });
                $("#divContent").animate({ left: "63px" });
                $(this).attr("data-state", "+");
                $("#pthMinMax").attr("d", constIPathMax);
            }
        });
        $("#actCloseAll").click(function () {
        		fireCloseAllTabClick();
        });
        $("#actMark").click(function () {
                fireAddMark();
        });
        //$("clsmcatimg").on('error').error(function () { setDefaultImg($(this)); });


        //Select first menu
        $("#ulCatMenu li:first-child").trigger("click");


    }
    function initEnv() {
        initIcons();
        findCurUserInfo();
        //alert(gWho);
        fillUserInfo(gWho);
        //document.getElementById("pLogInfo").textContent = "'" + gUserName + "(" + gWho + ")'님 환영합니다. ";
        $("#pLogInfo").text("'" + gWho + "'님 환영합니다. ");

        
        //Menu Initialization
        //gCatMenuList = "즐겨찾기,Visualization,D3F,Targeting,Campaign,REBM,BRMS,Survey,SFA,분석정보관리,운영관리,쿠폰관리,test";
        gCatMenuList = "즐겨찾기,D3F,Targeting,Campaign,REBM,BRMS,Survey,SFA,분석정보관리,운영관리,쿠폰관리,test";
        //gCatMenuList = "**CMSWeb";
        gCatMenuList = "★CMSWeb";
        initMenuInfo(gCatMenuList);

    }
    function findCurUserInfo() {
    	var u = window.location.href;
        //after code
        gWho = sessionStorage.getItem("USERID"); 
    	
        
        //before code
        //alert(u);
        // 	var path = "", query="", params;
	    //  if(u.indexOf("#") > 0){
	    //      hash = u.substr(u.indexOf("#") + 1);
	    //      u = u.substr(0 , u.indexOf("#"));
	    //  }
	    //  if(u.indexOf("?") > 0){
	    //      //path = u.substr(0 , u.indexOf("?"));        
	    //      query = u.substr(u.indexOf("?") + 1);
	    //      if (query.length > 0) {
	    //      	params= query.split('&');
				// var pair = params[0].split('=');

				// if (pair.length > 0) {					
	    //              gWho = pair[1];
	    //          }

	    //  	} //else
	    //    //  path = u;
	  	// }
}
    	
    function fillUserInfo(userid) {
        var metah = new oza_MetaHandler("UserGroupContent", "<List><Item address='/Users/{0}'/></List>".format(userid), "<List><User option='all'/></List>")
	    metah.execute(null, false);
	    if (oza_CheckMetaReturn(metah.returncontent) == false) {
	        return "";
	    }	
	    var parser, xmlDoc;
	    if (window.DOMParser) {
	        parser = new DOMParser();
	        xmlDoc = parser.parseFromString(metah.returncontent, "text/xml");
	    }
	    else // Internet Explorer
	    {
	        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	        xmlDoc.async = false;
	        xmlDoc.loadXML(metah.returncontent);
	    }
	
	    if (oza_IsParseError(xmlDoc)) {
	        return "";
	    }
	    
	    var xUsers = xmlDoc.documentElement.childNodes[0];
	    if (xUsers != null) {
	        var xUser = xUsers.childNodes[1];
	        
	        gUserName = xUser.attributes.getNamedItem("username").value;
	        //userozid = xUser.attributes.getNamedItem("ozid").value;
	        gGroupName = xUser.attributes.getNamedItem("groupname").value;
	        gGroupDesc = xUser.attributes.getNamedItem("groupdescription").value;
	        myAuth =  xUser.attributes.getNamedItem("userauth").value + ";" + xUser.attributes.getNamedItem("groupauth").value;
	    }
	    
	    //브랜드코드, 브랜드명, 점포코드, 점포명 얻기
	    var userInfo = new oza_TMHandler('com.obzen.bmpanly.DocCommMng', 'selectUserInfo', '1', '\@#%');
	    userInfo.setAddDataField('MD_CD', sessionStorage.getItem("MD_CD"));
	    userInfo.setAddDataField('USER_ID', userid);
	    userInfo.setAddDataField('SYSDIV', sessionStorage.getItem("SYSDIV"));
	    userInfo.returnlist('INTG_BRAN_CD'+//통합브랜코드
	    									';INTG_BRAN_NM'+//통합브랜드명
	    									';STORE_CD'+//점포코드
	    									';STORE_NM'//점포명
	    									);
	    userInfo.execute(null, false);
	    
	    gStoreCd = userInfo.ElementValue('STORE_CD');
		gStoreNm = userInfo.ElementValue('STORE_NM'); 
    	gBrandCd = userInfo.ElementValue('INTG_BRAN_CD');
    	var BrandNm = userInfo.ElementValue('INTG_BRAN_NM');
	    sessionStorage.setItem("BRAND_NM", BrandNm);
	    
	    //화면 오른쪽 상단 캡션 설정
	    if(gStoreNm != "")  gUserCaption = gStoreNm +" / ";
	    if(BrandNm != "") gUserCaption = gUserCaption + BrandNm + " / ";
	    if(sessionStorage.getItem("MD_CD") != "") gUserCaption = gUserCaption + sessionStorage.getItem("MD_CD") + " / ";
	    gUserCaption = gUserCaption + "임의 외부 반출을 금지합니다." ;
	}
    //gIcons(as clsDic)에 Icon을 위한 path 값 초기화
    function initMenuInfo(sCatMenuTop) {
        // Read Menu Info--------------------------------------------------------------//
        var i, j;
        if (sCatMenuTop.startsWith("★") == true) {
            var sAddr = "<List><Item address='/ManageBaseServer/Admin/CommonProperty/ApplicationMenus/" + sCatMenuTop + "'/></List>";
            var sOpt = "<List><Info option='all' address='show'/></List>";
            var metah = new oza_MetaHandler("Content", sAddr, sOpt);
            metah.execute(null, false);
            if (oza_CheckMetaReturn(metah.returncontent) == false) {
                return "";
            }
            var xmlDoc = getParsedDom(metah.returncontent);
            if (oza_IsParseError(xmlDoc)) {
                return "";
            }
            var xTop, xCat;
            if (xmlDoc.documentElement.getElementsByTagName("Menus").length == 0) {
                return "";
            }
            xTop = xmlDoc.documentElement.getElementsByTagName("Menus")[0];
            for (i = xTop.childNodes.length - 1, leni = 0; i > leni; i--) {
                xCat = xTop.childNodes[i];
                if (xCat.nodeType !== 1) continue;
                ///ManageBaseServer/Admin/CommonProperty/ApplicationMenus/" + sCatMenuTop + "/"
                if (fetchMenu("<List><Item address='" + xCat.attributes.getNamedItem("ozid").value + "'/></List>", sOpt, 0, false) == false) {

                }
            }
        } else {
            var aryMenusCats = sCatMenuTop.split(",");
            for (j = 0; j < aryMenusCats.length; j++) {
                if (aryMenusCats[j].startsWith("**") == true) {
                    var sAddr = "<List><Item address='/ManageBaseServer/Admin/CommonProperty/ApplicationMenus/" + aryMenusCats[j] + "'/></List>";
                    var sOpt = "<List><Info option='all' address='show'/></List>";
                    var metah = new oza_MetaHandler("Content", sAddr, sOpt);
                    metah.execute(null, false);
                    if (oza_CheckMetaReturn(metah.returncontent) == false) {
                        return "";
                    }
                    var xmlDoc = getParsedDom(metah.returncontent);
                    if (oza_IsParseError(xmlDoc)) {
                        return "";
                    }
                    var xTop, xCat;
                    if (xmlDoc.documentElement.getElementsByTagName("Menus").length == 0) {
                        return "";
                    }
                    xTop = xmlDoc.documentElement.getElementsByTagName("Menus")[0];
                    for (i = 0, leni = xTop.childNodes.length; i < leni; i++) {
                        xCat = xTop.childNodes[i];
                        if (xCat.nodeType !== 1) continue;
                        ///ManageBaseServer/Admin/CommonProperty/ApplicationMenus/" + sCatMenuTop + "/"
                        if (fetchMenu("<List><Item address='" + xCat.attributes.getNamedItem("ozid").value + "'/></List>", sOpt, 0, false) == false) {

                        }
                    }
                } else {
                    if (fetchMenu("<List><Item address='/ManageBaseServer/Admin/CommonProperty/ApplicationMenus/" + aryMenusCats[j] + "'/></List>", "<List><Info option='all' address='show'/></List>", 0) == false) {

                    }
                }
            }
        }

        fetchMyMenu();
        // Create UI of Category Menu List---------------------------------------------//
        //var ulCatMenu = document.getElementById("ulCatMenu");
        //clear previous
        //$("#ulCatMenu").empty();
        //ulCatMenu.innerHTML = "";
        //for (var i = ulCatMenu.childNodes.length - 1; i >= 0; i--) {
        //    ulCatMenu.removeChild(ulCatMenu.childNodes[i]);
        //}
        //style은 #catmenu 연관으로 css에서 정의
        var pClsM, sHtml = "", sVB = "", sPath = "";
        for (var i = 0, len = gCatMenus.length; i < len; i++) {
            pClsM = gCatMenus[i];
            //sHtml += '<li class=""><a href="#"><img src="../img/main/menu/' + pClsM.img + '.png" onerror="setDefaultImg(this)"/><span>' + pClsM.caption + '</span></a></li>';
            sVB = gIconsInfo.item(pClsM.img.toLowerCase());
            if (sVB == "") sVB = "0 0 72 72";
            sPath = gIcons.item(pClsM.img.toLowerCase());
            if (sPath == "") {
                sPath = gIcons.item("default");
                sVB = gIconsInfo.item("default");
            }
            sHtml += '<li class=""><span class="clscaticonpnl"><svg viewBox="' + sVB + '"><path d="' + sPath + '"/></svg></span><span class="clscattextpnl">' + pClsM.caption + '</span></li>';
            //sHtml += '<li class=""><a href="#"><span class="clscaticonpnl"><svg viewBox="' + sVB + '"><path d="' + sPath + '"/></svg></span><span class="clscattextpnl">' + pClsM.caption + '</span></a></li>';
            //sHtml += '<dt><a href="#"><span class="clscaticonpnl"><svg viewBox="' + sVB + '"><path d="' + sPath + '"/></svg></span><span class="clscattextpnl">' + pClsM.caption + '</span></a></li>';
        }
        $("#ulCatMenu").html(sHtml);

        //Menu Handler
        activateMenuHandler1();
	}

    //--------------------------------------------------------------
    //  Read Menu Info -> gCatMenus, gItemMenus
    function fetchMenu(sAddr, sOpt, iLev, bMode) {
        if (typeof (bMode) === "undefined") {
            bMode = false;
        }
        
        var metah = new oza_MetaHandler("Content", sAddr, sOpt);
        metah.execute(null, false);

        if (oza_CheckMetaReturn(metah.returncontent) == false) {
            return "";
        }
        
        var xmlDoc = getParsedDom(metah.returncontent);
        if (oza_IsParseError(xmlDoc)) {
            return "";
        }

        var xParent, ozid, pClsMCat, pClsMParent, collSub;
        var sSubAddrXML = "", sSubContXML = "";
        for (var i = 0, leni = xmlDoc.documentElement.childNodes.length; i < leni; i++) {
            xParent = xmlDoc.documentElement.childNodes[i];
            if (xParent.nodeType !== 1) continue;
            ozid = xParent.attributes.getNamedItem("ozid").value;
            if (iLev == 0) {
                pClsMCat = new clsMenu(ozid, true);
                pClsMCat.order = xParent.attributes.getNamedItem("name").value;
                pClsMCat.caption = xParent.attributes.getNamedItem("description").value;
                pClsMCat.img = pClsMCat.caption;
                var sTmp = xParent.attributes.getNamedItem("etc").value;
                if (sTmp.length >= 0) {
                    if (sTmp == "_favorites") {
                        sTmp = "modelgenerate";
                        gMyFavCat = pClsMCat;
                    }
                    pClsMCat.img = sTmp;
                }
                if (pClsMCat.img.length == 0) pClsMCat.img = "default";
                pClsMCat.desc = xParent.attributes.getNamedItem("etc").value;
                gCatMenus.push(pClsMCat);
                gItemMenus.add(pClsMCat.ozid, pClsMCat);
                pClsMParent = pClsMCat;
                collSub = pClsMCat.SubMenus;
            } else {
                pClsMParent = gItemMenus.item(ozid);
                if (pClsMParent != "") {
                    collSub = pClsMParent.SubMenus;
                } else {
                    ShowMsg(xParent.attributes.getNamedItem("description").value + " 항목을 찾을 수 없어 하위 메뉴를 추가할 수 없습니다.");
                    return false;
                }
            }
            var xElm, pClsM;
            for (var j = 0, lenj = xParent.childNodes.length; j < lenj; j++) {
                xElm = xParent.childNodes[j];
            	  if (xElm.nodeType !== 1) continue;
            	  //alert((new XMLSerializer()).serializeToString(xElm));
                if (xElm.nodeName == "Menus") {
                    pClsM = new clsMenu(xElm.attributes.getNamedItem("ozid").value, true);
                    if (bMode) {
                        pClsM.caption = xElm.attributes.getNamedItem("name").value;
                        pClsM.caption = pClsM.caption.replace(/\\/g, "/" ); //메타정보 내의 backslash를 slash로 치환
                    } else {
                        pClsM.order = Number(xElm.attributes.getNamedItem("name").value);
                        pClsM.caption = xElm.attributes.getNamedItem("description").value;
                    }
                    var sTmp = xElm.attributes.getNamedItem("etc").value;
                    if (sTmp.length >= 0) {
                        pClsM.img = sTmp;
                    }
                    //pClsM.img = pClsMParent.img; //현재 해당 이미지를 다 변환하지 못하여 임시로.
                    if (pClsM.img.length == 0) pClsM.img = pClsMParent.img; //"default";
                    sSubAddrXML += "<Item address='" + pClsM.ozid + "'/>";
                    sSubContXML += "<Info option='all'/>";
                } else {
                    pClsM = new clsMenu(xElm.attributes.getNamedItem("ozid").value, false);
                    if (bMode) {
                        pClsM.caption = xElm.attributes.getNamedItem("name").value;
                    } else {
                        pClsM.order = Number(xElm.attributes.getNamedItem("name").value);
                        pClsM.caption = xElm.attributes.getNamedItem("description").value;
                    }
                                        
                    //★★★★ 권한관리 여기서 2019.10.10 배광열
                    //권한별  Active 판별 
                    if(xElm.attributes.getNamedItem("activeauth").value.equals("active")){ //권한걸려있는 메뉴
                    	if(!checkAuthMenu(xElm.attributes.getNamedItem("ozid").value, gUser())){ //유저별 권한 체크
                    		continue; //flase 리턴시 메뉴 감춤
                    	}
                    }
                    //pClsM.frameaddr = xElm.attributes.getNamedItem("etc").value.Replace("@selector", gSelector).Replace("@userid", gUser);
                    pClsM.frameaddr = xElm.attributes.getNamedItem("etc").value.replace("@userid", gUser());
                    pClsM.parent = pClsMParent;
                }
                pClsM.parent = pClsMParent;
                collSub.push(pClsM);
                gItemMenus.add(pClsM.ozid, pClsM);
            }
            if (bMode == false) collSub.sort(function (a, b) {return a.order-b.order})
        }
        if (sSubAddrXML.length > 0) {
                if (fetchMenu("<List>" + sSubAddrXML + "</List>", "<List>" + sSubContXML + "</List>", iLev + 1, bMode) == false) {
                    return false;
                }
        }
        return true;
    }
    function fetchMyMenu() {
        var sAddr = "<List><Item address='/PrivateBaseServer/" + gUser() + "/Configuration/" + constConfig + "'/></List>";
        var sOpt = "<List><Info option='standard'/></List>";
        var metah = new oza_MetaHandler("Content", sAddr, sOpt);
        metah.execute(null, false);

        var sResult;
        if (oza_CheckMetaReturn(metah.returncontent) == false) {
            sResult = "<List><Config name='" + constConfig + "'/></List>";
        } else {
            sResult = metah.returncontent;
        }
        var xmlDoc = getParsedDom(sResult);
        if (oza_IsParseError(xmlDoc)) {
            return "";
        }
        var xParent = xmlDoc.documentElement.firstElementChild;
        var xElm, ozid, pClsM, refClsMFav;
        pClsMFav = null;
        if (gMyFavCat != null) {
            refClsMFav = gMyFavCat.SubMenus[0];
        }
        if (refClsMFav != null) {
            for (var i = 0, leni = xParent.childNodes.length; i < leni; i++) {
                xElm = xParent.childNodes[i];
                if (xElm.nodeType !== 1) continue;
                if (xElm.nodeName != "MenuReserved") {
                    ozid = xElm.attributes.getNamedItem("ozid").value;
                    pClsM = gItemMenus.item(ozid);
                    if (pClsM == "") break;

                    if (pClsM.isFolder == false) {
                        refClsMFav.addChild(pClsM);
                    }
                }
            }
        }
    }

    //유저별 메뉴권한 체크 추가 2019.10.10 배광열
    function checkAuthMenu(menuOzid, userid){
    	var menuDuty, hiddenOpt;
        
        //AppManager 권한 , admin 메뉴 모두 출력
        if(myAuth.indexOf("AppManager") > 0 || userid.equals("admin")) return true; 
        
    	//메뉴 권한 정보
    	var mPurpose = "NodeAuthorityContent";
    	var mAddr = "<List><Item address='" + menuOzid + "'/></List>"
    	var mOpt = "<List><NodeAuthority ozid='" + menuOzid + "' option='all'/></List>"
    	var xParaent, xElm;
    	
    	var menuMeta = new oza_MetaHandler(mPurpose, mAddr, mOpt);
    	menuMeta.execute(null, false);
        
    	var mResult;
        if (oza_CheckMetaReturn(menuMeta.returncontent) == false) {
        	return false; //에러시 종료
        } else {
        	mResult = menuMeta.returncontent;
        }
        
        var mXmlDoc = getParsedDom(mResult);
        if (oza_IsParseError(mXmlDoc)) {
            return false;
        }
        
        for (var i = 0; i < mXmlDoc.documentElement.childNodes.length; i++) {
        	xParent = mXmlDoc.documentElement.childNodes[i];
            if (xParent.nodeType !== 1) continue;
            if (xParent.nodeName == "NodeAuthority"){
            	menuDuty = xParent.attributes.getNamedItem("nodeauth").value.split(";");
            	hiddenOpt = xParent.attributes.getNamedItem("nodehiden").value;
        	}
        }
		
        for (var i = 0; i < menuDuty.length; i++) {
        	if(menuDuty[i].indexOf("_") >= 0 && myAuth.indexOf(menuDuty[i]) >= 0 ){ //메뉴에 권한 설정 되어있는 경우
        		if(hiddenOpt.equals("true")){  //숨김목록이면 메뉴 감춤
        			return false;
        		}else{ //그외는 메뉴 출력
        			return  true;
        		}
        	}
        }
        
    	return true;
    }
    
    function activateMenuHandler1() {
        $("#ulCatMenu li").on({
            mouseenter: function () {
                $("#ulCatMenu li:nth-child(" + ($(this).index() + 1) + ")").addClass("hovercatmenu");
                //$("#ulCatMenu li:nth-child(" + ($(this).index() + 1) + ")").attr("color", "white");
            },
            mouseleave: function () {
                $("#ulCatMenu li:nth-child(" + ($(this).index() + 1) + ")").removeClass("hovercatmenu");
                //$("#ulCatMenu li:nth-child(" + ($(this).index() + 1) + ")").attr("color", "gray");
            },
            click: function () {
                catMenuClick($(this).index());
            }
        });
        //$("#ulCatMenu li").off("click").click(function () {
        //    catMenuClick($(this).index());
        //});
        //$(".clsmcat").off("click").click(function () {
        //    catMenuClick($(this).index());
        //});
        //$("img").off('error').error(function () {
        //    $(this).css("display", "none")
        //})
        //$("clsmcatimg").off('error').error(setDefaultImg($(this)));
        //$("clsmcatimg").on('error').error(function () { setDefaultImg($(this)); });

    }
    function activateMenuHandler2() {

        //$(".clsMGrpBtn").off("click").click(function () {
        //    $(this).parent().next().slideToggle();
        //    $(this).prev().toggleClass("clsDivRotate"); //rotate(90);
        //});
        $(".clsLiMGrp").on("click").click(function () {
            //Collapse Others
            if (gOptExpandOnlyOne == true) {
                var idxOfThis = $(this).index();
                var cntList = $(this).parent().children("li").length;
                var pLI;
                for (var i = 0; i < cntList; i += 2) {
                    if (i == idxOfThis) {
                    } else {
                        $(this).parent().children("li").eq(i).children("div").removeClass("clsDivRotate");
                        $(this).parent().children("li").eq(i + 1).slideUp();
                    }
                }
            }
            $(this).next().slideToggle();
            $(this).children("div").toggleClass("clsDivRotate"); //rotate(90);
        });
        $(".clsLiMRun").on("click").click(function () {
            //fireShowPage($(this).attr("data-id"), $(this).parent().parent().prev().attr("data-id"));
            fireShowPage($(this).index(), ($(this).parent().parent().prev().index()) / 2);
        });

        //$("img").off('error').error(function () {
        //    $(this).css("display", "none")
        //})
        //$("clsmcatimg").off('error').error(setDefaultImg($(this)));
        // $("clsmcatimg").on('error').error(function () { setDefaultImg($(this)); });

    }
    function fireRefresh(iSel) {
        //document.getElementById("divPages").getElementsByTagName("DIV")[iSel].getElementsByTagName("IFRAME")[0].contentWindow.do_RefreshPage();
        $("#divPages").children("div").eq(iSel).children("iframe")[0].contentWindow.do_RefreshPage();
        //$("#divPages").children("div").eq(iSel).children("iframe").eq(0).contentWindow.RefreshPage();
	}

    function setDefaultImg(tgtImg) {
        tgtImg.onerror = '';
        tgtImg.src = "../img/main/menu/default.png";
        //var pClsM = gCatMenus[$(this).index()];
        //pClsM.img = "default";
    }

    //-**************************************************************
    // Event Handler
    //-**************************************************************
    // Category Menu is selected. Show all the submenus of selected category menu.
    function catMenuClick(catMidx) {
        if (gCurIdxOfCatMenu >= 0) {
            $("#ulCatMenu li:nth-child(" + (gCurIdxOfCatMenu + 1) + ")").removeClass("activecatmenu");
            $("#ulCatMenu li:nth-child(" + (gCurIdxOfCatMenu + 1) + ") a img").attr("src","../img/main/menu/" + gCatMenus[gCurIdxOfCatMenu].img + ".png");
        }
        gCurIdxOfCatMenu = catMidx;
        var pClsMCat = gCatMenus[catMidx];
        //$("#dtTitle").text(pClsMCat.caption);
        $("#ddTitle").text(pClsMCat.desc);
        //var ulTreeMenu = document.getElementById("ulTreeMenu");
        //clear previous
        //$("#ulTreeMenu").empty();
        //ulTreeMenu.innerHTML = "";
        var pClsMGrp, pClsM, sHtml = "", sPath="", sVB = "0 0 56 56";
        var leni, lenj;
        for (var i = 0, leni = pClsMCat.SubMenus.length; i < leni; i++) {
            pClsMGrp = pClsMCat.SubMenus[i];
            lenj = pClsMGrp.SubMenus.length;
            sVB = gIconsInfo.item(pClsMGrp.img.toLowerCase());
            if (sVB == "") sVB = "0 0 72 72";
            sPath = gIcons.item(pClsMGrp.img.toLowerCase());
            if (sPath == "") {
                sPath = gIcons.item("default");
                sVB = gIconsInfo.item("default");
            }
            /* 메뉴수정 2019.12.11
            sHtml += '<li class="clsLiMGrp"><span><svg viewBox="' + sVB +
                '" ><path d="' + sPath + '"/></svg></span><span style="vertical-align:top">' + pClsMGrp.caption +
                '</span>' + '<div';
            //sHtml += '<li class="clsLiMGrp"><img src="../img/main/menu/' + pClsMCat.img + '_16.png" /><span>' + pclsMGrp.caption + '</span>' + '<div';
            if (i == 0) {
                sHtml += ' class="clsDivRotate"';
            }
            sHtml += '><img src="../img/common/snb_arrow.png"/></div><span class="clsMGrpBtn">' + lenj.toString() + '</span></li>';
            if (i == 0) {
                sHtml += '<li><ul>';
            } else {
                sHtml += '<li style="display: none;"><ul>';
            }
            for (var j = 0; j < lenj; j++) {
                pClsM = pClsMGrp.SubMenus[j];
                sHtml += '<li class="clsLiMRun"><div>' + pClsM.caption + '<div></li>';
            }
            sHtml += '</ul></li>';
             */
            
            sHtml += '<li class="clsLiMGrp"><span style="vertical-align:top">' + pClsMGrp.caption +
                '</span>' + '<div';
            //sHtml += '<li class="clsLiMGrp"><img src="../img/main/menu/' + pClsMCat.img + '_16.png" /><span>' + pclsMGrp.caption + '</span>' + '<div';
            if (i == 0) {
                sHtml += ' class="clsDivRotate"';
            }
            sHtml += '><img src="../img/common/menu_arr_N.png"/></div></li>';
            if (i == 0) {
                sHtml += '<li><ul>';
            } else {
                sHtml += '<li style="display: none;"><ul>';
            }
            for (var j = 0; j < lenj; j++) {
                pClsM = pClsMGrp.SubMenus[j];
                sHtml += '<li class="clsLiMRun"><div>' + pClsM.caption + '<div></li>';
            }
            sHtml += '</ul></li>';
            
        }
        //ulTreeMenu.innerHTML = sHtml;
        $("#ulTreeMenu").html(sHtml);
        //$("#ulTreeMenu").css("list-style-image", "../img/main/menu/" + pClsMGrp.img + ".png");
        activateMenuHandler2();
        $("#ulCatMenu li:nth-child(" + (catMidx + 1) + ")").addClass("activecatmenu");
        //$("#ulCatMenu li:nth-child(" + (catMidx + 1) + ") a img").attr("src","../img/main/menu/" + pClsMCat.img + "_on.png");
    }

    function delegateFireShowPage(a, b) {
        return function () {
            fireShowPage(a, b)
        }
    }
    function fireShowPage(runidx, grpidx) {
        var conTabs = document.getElementById("ulTabs");
        var iTabCount = conTabs.childElementCount; 
        var pClsM = gCatMenus[gCurIdxOfCatMenu].SubMenus[grpidx].SubMenus[runidx];
        var sMenuPath = getMenuPath(gCurIdxOfCatMenu, grpidx, runidx);
        var addr = pClsM.getInfo(3);
        //hide all tabs. checkexist
        var iSel = -1;
        var aTabHead;
        var conPages = document.getElementById("divPages");
        //for (aTabHead in $("#ulTabs").children("LI")) {
        //    if (addr == aTabHead.getAttribute("data-id")) {
        //        iSel = i;
        //        conPages.getElementsByTagName("DIV")[i].style.display = "block";
        //        aTabHead.className = "clsLiTabSel";
        //        changeTitleFromTab(aTabHead);
        //    } else {
        //        conPages.getElementsByTagName("DIV")[i].style.display = "none";
        //        aTabHead.className = "clsLiTab";
        //    }
        //}
        for (var i = 0; i < iTabCount; i++) {
            aTabHead = conTabs.getElementsByTagName("LI")[i]; 
            if (addr == aTabHead.getAttribute("data-id")) {
                iSel = i;
                //conPages.getElementsByTagName("DIV")[i].style.display = "block";
                conPages.getElementsByTagName("DIV")[i].style.zIndex = "1";
                aTabHead.className = "clsLiTabSel";
                changeTitleFromTab(aTabHead);
            } else {
                //conPages.getElementsByTagName("DIV")[i].style.display = "none";
                conPages.getElementsByTagName("DIV")[i].style.zIndex = "0";
                aTabHead.className = "clsLiTab";
            }
        }
        if (iSel >= 0) {
            //refresh
            fireRefresh(iSel);
            return;
        }

        var fname = getLastToken(addr, "/").toLowerCase();

        createTabPage(addr, pClsM.getInfo(0), pClsM.getInfo(4), sMenuPath, "", fname, "");
        gSelTabID = sMenuPath;

        //Title
        divContent.style.display = "block";
        changeTitleFromMenu(pClsM.getInfo(0), sMenuPath)
    }

    function fireAddMark() {
        //alert("Favorite clicked!");
        var conTabs = document.getElementById("ulTabs");
        var iTabCount = conTabs.childElementCount;
        if (iTabCount == 0) {
            return;
        }
        var aTab = null;
        for (var i = 0; i < iTabCount; i++) {
            aTab = conTabs.getElementsByTagName("LI")[i];
            if (aTab.className == "clsLiTabSel") {
                break;
            }
        }
        if (aTab != null) {
            var menuid = "";
            menuid = aTab.getAttribute("data-menuid");
            if (menuid == "") {
                ShowMsg("즐겨찾기로 등록할 수 없는 화면입니다.");
                return;
            } else {
                var pClsM = gItemMenus.item(menuid);
                if (pClsM == "") {
                    ShowMsg("연결된 메뉴를 찾을 수 없습니다.");
                    return;
                };

                if (pClsM.isFolder == false) {
                    var pClsItemM;
                    for (var j = 0; j < gMyFavCat.SubMenus[0].SubMenus.length; j++) {
                        pClsItemM = gMyFavCat.SubMenus[0].SubMenus[j];
                        if (pClsItemM.ozid == menuid) {
                            ShowMsg("이미 등록되어 있습니다.");
                            return;
                        }
                    }
                    gMyFavCat.SubMenus[0].addChild(pClsM);
                    //doSaveMenuFavContent();
                }
            }
        }
    }
    function doSaveMenuFavContent() {
        var sAddr = "<List><Item address='/PrivateBaseServer/" + gUser() + "/Configuration/" + constConfig + "'/></List>";
        var sOpt = "<List><Info option='standard'/></List>";
        var metah = new oza_MetaHandler("Content", sAddr, sOpt);
        metah.execute(null, false);

        var sResult;
        if (oza_CheckMetaReturn(metah.returncontent) == false) {
            sResult = "<List><Config name='" + constConfig + "'/></List>";
        } else {
            sResult = metah.returncontent;
        }

        //makeMenuFavContentXML();
        var xWrt = new ozf_XMLWriter();
        xWrt.WriteStartDocument();
        xWrt.WriteStartElement("List");
        xWrt.WriteStartElement("Config");
        xWrt.WriteAttributeString("name", constConfig)
        var pClsItemM;
        for (var j = 0; j < gMyFavCat.SubMenus[0].SubMenus.length; j++) {
            pClsItemM = gMyFavCat.SubMenus[0].SubMenus[j];
            if (pClsItemM.ozid == menuid) {
                ShowMsg("이미 등록되어 있습니다.");
                return;
            }
            xWrt.WriteStartElement("Menu");
            xWrt.WriteAttributeString("header", pClsItemM.caption);
            xWrt.WriteAttributeString("pathid", pClsItemM.img);
            xWrt.WriteAttributeString("ozid", pClsItemM.ozid);
            //정보가 부족함
            //xWrt.WriteAttributeString("backcolor", pClsItemM.caption);
            //xWrt.WriteAttributeString("forecolor", pClsItemM.caption);
            //xWrt.WriteAttributeString("isflowbreak", pClsItemM.caption);
            //xWrt.WriteAttributeString("tilesize", pClsItemM.caption);
            xWrt.WriteEndElement();
        }
        xWrt.WriteEndElement();
        xWrt.WriteEndElement();
        xWrt.WriteEndDocument()

        var sCont = xWrt.flush();
        xWrt.close();
        metah = new oza_MetaHandler("UpdateContent", sAddr, sCont);
        metah.execute(null, false);
        sResult = metah.returncontent;
        if (oza_CheckMetaReturn(metah.returncontent) == false) {
            ShowMsg("내 즐겨찾기 변경사항을 저장하지 못했습니다.");
            return false;
        }
        return true;
    }

    // Tab
    function fireCloseAllTabClick() {
        var conTabs = document.getElementById("ulTabs");
        var iTabCount = conTabs.childElementCount; 
        if (iTabCount == 0) {
            return;
        }
        var conPages = document.getElementById("divPages");
        var aTabHead;
        for (var i = iTabCount - 1; i >= 0; i--) {
            aTabHead = conTabs.getElementsByTagName("LI")[i];
            aTabHead.getElementsByTagName("img")[0].removeEventListener("click", delegatefireDelTabClick(aTabHead))
            aTabHead.removeEventListener("click", delegatefireTabClick(aTabHead));
	        conPages.removeChild(conPages.getElementsByTagName("DIV")[i]); 
            conTabs.removeChild(aTabHead); 
        }
        divContent.style.display = "none";        
    }
    function delegatefireDelTabClick(srctab) {
        return function () {
            fireDelTabClick(srctab)
        }
    }
    function fireDelTabClick(srctab) {
    	  var parenttabid =  srctab.getAttribute("data-parent")
        var conTabs = document.getElementById("ulTabs");
        var iTabCount = conTabs.childElementCount; 
        if (iTabCount == 0) {
            return;
        }
        var idx;
        for (var i = 0; i < iTabCount; i++) {
            if (conTabs.getElementsByTagName("LI")[i] == srctab) {
                idx = i;
            }
        }
        var conPages = document.getElementById("divPages");
        var bSelDel = (srctab.className == "clsLiTabSel");
        var aTabHead = conTabs.getElementsByTagName("LI")[idx];
        aTabHead.getElementsByTagName("img")[0].removeEventListener("click", delegatefireDelTabClick(aTabHead))
        aTabHead.removeEventListener("click", delegatefireTabClick(aTabHead));
        //delete tab
        conPages.removeChild(conPages.getElementsByTagName("DIV")[idx]); //childNodes[idx]);
        conTabs.removeChild(aTabHead); //.childNodes[idx]);
        
        // 탭 닫을 때 GroupFramelocal TempContent 삭제
        gDicTempCon.clearGroup("GroupFramelocal");

        if (iTabCount <= 1) {
            divContent.style.display = "none";
            return;
        }
        if (bSelDel == false) return;
        //select other tab
        if (parenttabid != "") {
            var conTabs = document.getElementById("ulTabs");
            var iTabCount = conTabs.childElementCount; 
            for (var i = 0; i < iTabCount; i++) {
                aTabHead = conTabs.getElementsByTagName("LI")[i];
                if (parenttabid == aTabHead.getAttribute("data-id")) {
                    //conPages.getElementsByTagName("DIV")[i].style.display = "block";
                    conPages.getElementsByTagName("DIV")[i].style.zIndex = "1";
                    aTabHead.className = "clsLiTabSel";
                    //Title
                    changeTitleFromTab(aTabHead)
                    return; //
                } else {
                    //conPages.getElementsByTagName("DIV")[i].style.display = "none";
                    conPages.getElementsByTagName("DIV")[i].style.zIndex = "0";
                    aTabHead.className = "clsLiTab";
                }
            }
        }
        
        if (idx == iTabCount - 1) {
            //conPages.getElementsByTagName("DIV")[idx - 1].style.display = "block";
            conPages.getElementsByTagName("DIV")[idx - 1].style.zIndex = "1";
            conTabs.getElementsByTagName("LI")[idx - 1].className = "clsLiTabSel";
            changeTitleFromTab(conTabs.getElementsByTagName("LI")[idx - 1])
        } else {
            //conPages.getElementsByTagName("DIV")[idx].style.display = "block";
            conPages.getElementsByTagName("DIV")[idx].style.zIndex = "1";
            conTabs.getElementsByTagName("LI")[idx].className = "clsLiTab";
            changeTitleFromTab(conTabs.getElementsByTagName("LI")[idx])
        }


    }
    function delegatefireTabClick(srctab) {
        return function () {
            fireTabClick(srctab)
        }
    }
    function fireTabClick(srctab) {
        var conTabs = document.getElementById("ulTabs");
        var iTabCount = conTabs.childElementCount; //.childNodes.length;
        if (iTabCount == 0) {
            return;
        }
        var idx = -1;
        for (var i = 0; i < iTabCount; i++) {
            if (conTabs.getElementsByTagName("LI")[i] == srctab) {
                idx = i;
            }
        }
        if (idx < 0) return;
        //hide all tabs
        var conPages = document.getElementById("divPages");
        for (var j = 0; j < iTabCount; j++) {
            //conPages.getElementsByTagName("DIV")[j].style.display = "none";
            conPages.getElementsByTagName("DIV")[j].style.zIndex = "0";
            conTabs.getElementsByTagName("LI")[j].className = "clsLiTab";
        }
        //show current tab
        //conPages.getElementsByTagName("DIV")[idx].style.display = "block";
        conPages.getElementsByTagName("DIV")[idx].style.zIndex = "1";
        conTabs.getElementsByTagName("LI")[idx].className = "clsLiTabSel";
        //Title
        changeTitleFromTab(conTabs.getElementsByTagName("LI")[idx])
    }


    //-**************************************************************
    // Internal
    //-**************************************************************
    function changeTitleFromTab(aTabHead) {
        $("#hTitle").text(aTabHead.getAttribute("data-title"));
        $("#hLoc").text(gWho + " / " + getDateTime() + " / " +  gUserCaption);
        //$("#hLoc").text(aTabHead.getAttribute("data-menupath"));
    }
    function changeTitleFromMenu(title, path) {
        $("#hTitle").text(title);
        $("#hLoc").text(gWho + " / " + getDateTime() + " / " +  gUserCaption);
        //$("#hLoc").text(path); 
    }
    // Create Physical TabPage
    function createTabPage(id, caption, menuid, menupath, parentid, framename, frameargs) {
        var conTabs = document.getElementById("ulTabs");
        var conPages = document.getElementById("divPages");
        
        /*
        console.log("id="+id);
        console.log("caption="+caption);
        console.log("parentid="+parentid);
        console.log("framename="+framename);
        console.log("frameargs="+frameargs);
        */
        
        //add new tabbutton
        //alert("showpage" + grpidx + ":" + runidx);
        var aTabHead = document.createElement("li");
        aTabHead.className = "clsLiTabSel"
        aTabHead.setAttribute("data-id", id)
        aTabHead.setAttribute("data-title", caption)
        aTabHead.setAttribute("data-menuid", menuid)
        aTabHead.setAttribute("data-menupath", menupath)
        aTabHead.setAttribute("data-parent", parentid)
        aTabHead.appendChild(document.createTextNode(caption));
        var imgClose = document.createElement("img");
        imgClose.src = "../img/main/del.png";
        imgClose.className = "clsImgClosebutton"
        imgClose.title = "Close me.";
        imgClose.addEventListener("click", delegatefireDelTabClick(aTabHead), false);
        aTabHead.appendChild(imgClose)
        aTabHead.addEventListener("click", delegatefireTabClick(aTabHead), false);
        conTabs.appendChild(aTabHead);

        //add new page
        var aPage = document.createElement("iframe");
        aPage.className = "clsIFramePage";
        aPage.frameborder = 0;
        
        
        //aPage.scrolling = "no";
        
        /*=====================================================================
         * 2019.09.04
         * 김태호
         * jsp 추가로 인한 메뉴 페이지 링크 수정 
         =====================================================================*/
        var linkUrl = "./" + framename + ".html"; // + frameargs;
        
        if(framename.substring(0,4) == "web_"){
        	linkUrl = "../jsp/"+framename+".jsp"+ frameargs;
        }
        
        aPage.src = linkUrl;
        //=====================================================================
        
        
        var aDiv = document.createElement("div");
        aDiv.className = "clsDivPage"
        conPages.appendChild(aDiv);
        aDiv.appendChild(aPage);
        
    }

    //-**************************************************************
    // Utility
    //-**************************************************************
    function getMenuPath(catidx, grpidx, runidx) {
        return gCatMenus[catidx].getInfo(0) + " / " + gCatMenus[catidx].SubMenus[grpidx].getInfo(0) + " / " + gCatMenus[catidx].SubMenus[grpidx].SubMenus[runidx].getInfo(0);
    }

    function getLastToken(src, delim) {
            var tokens = src.split(delim);
            return tokens[tokens.length - 1];
    }

    function getParsedDom(sResultCont) {
        var parser, xmlDoc;
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(sResultCont, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(sResultCont);
        }
        return xmlDoc;
    }

    function trim(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    //-***************************************************************************************************************************
    // API
    //-***************************************************************************************************************************
    //UserInfo
    //--------------------------------------------------------------
    function GetUserInfo() {
	    return "{0};{1};{2}".format(gUserName, gGroupName, gGroupDesc);
	}
    //-**************************************************************
    //TemporaryContent
    //--------------------------------------------------------------
    function GetTemp(tempName, deleteAfter, groupName) {
        return gDicTempCon.getData(tempName, deleteAfter, groupName);
    }
    function SetTemp(tempName, tempContent, groupName) {
        return gDicTempCon.setData(tempName, tempContent, groupName);
    }
    //-**************************************************************
    //기존 화면에서 새 탭화면으로 열기
    //--------------------------------------------------------------
    function OpenPage(caption, frameaddr, args) {
        var framename = getLastToken(frameaddr, "/").toLowerCase();
        var parentid = "";

        var conTabs = document.getElementById("ulTabs");
        var iTabCount = conTabs.childElementCount; //.childNodes.length;
        var aTabHead;
        //var pclsm = gCatMenus[gCurIdxOfCatMenu].SubMenus[grpidx].SubMenus[runidx];
        var id = frameaddr; //getMenuPath(gCurIdxOfCatMenu, grpidx, runidx);
        var conPages = document.getElementById("divPages");
        var iSel = -1;
        //hide all tabs. checkexist
        for (var i = 0; i < iTabCount; i++) {
            aTabHead = conTabs.getElementsByTagName("LI")[i];
            if (aTabHead.className == "clsLiTabSel") {
                parentid = aTabHead.getAttribute("data-id");
            }
            if (id == aTabHead.getAttribute("data-id")) {
                iSel = i;
                //conPages.getElementsByTagName("DIV")[i].style.display = "block";
                conPages.getElementsByTagName("DIV")[i].style.zIndex = "1";
                aTabHead.className = "clsLiTabSel";
                changeTitleFromTab(aTabHead);
            } else {
                //conPages.getElementsByTagName("DIV")[i].style.display = "none";
                conPages.getElementsByTagName("DIV")[i].style.zIndex = "0";
                aTabHead.className = "clsLiTab";
            }
        }
        if (iSel >= 0) {
            //refresh
            fireRefresh(iSel);
            //conPages.children[iSel].children[0].contentWindow.RefreshPage();
            return;
        }

        createTabPage(id, caption, "", "", parentid, framename, args);
        gSelTabID = id;

        //Title
        divContent.style.display = "block";
        changeTitleFromMenu(caption, "");
        
    }
    //-**************************************************************

    function ClosePage(frameaddr) {
        var conTabs = document.getElementById("ulTabs");
        var iTabCount = conTabs.childElementCount; //.childNodes.length;
        var aTabHead;
        var id = frameaddr;
        var iSel = -1;
        for (var idx = 0; idx < iTabCount; idx++) {
            aTabHead = conTabs.getElementsByTagName("LI")[idx]; //childNodes[idx];
            if (id == aTabHead.getAttribute("data-id")) {
                var conPages = document.getElementById("divPages");
                conPages.removeChild(conPages.getElementsByTagName("DIV")[idx]);
                conTabs.removeChild(aTabHead); //conTabs.getElementsByTagName("LI")[idx]);
                if (aTabHead.className == "clsLiTabSel") {
                    if (idx == 0) {
                        if (iTabCount > 1) {
                            iSel = 0; //현재 탭이 지워진 후이므로
                        }
                    }
                    else {
                        iSel = idx - 1;
                    }                    
                }
                aTabHead.getElementsByTagName("img")[0].removeEventListener("click", delegatefireDelTabClick(aTabHead))
                aTabHead.removeEventListener("click", delegatefireTabClick(aTabHead));
                break;
            }
        }
        if (iSel >= 0) {
            //show current tab
            //conPages.getElementsByTagName("DIV")[iSel].style.display = "block";
            conPages.getElementsByTagName("DIV")[iSel].style.zindex = "1";
            conTabs.getElementsByTagName("LI")[iSel].className = "clsLiTabSel";
            //Title
            changeTitleFromTab(conTabs.getElementsByTagName("LI")[iSel])
            
            //수정자: 김태호
            //수정일 : 2019.11.13.수
            //내용 : tab 닫기 후 다음 tab 리플레시 기능 동작 주석 처리 
            //refresh
            //fireRefresh(iSel);
        }
    }

    function GetLogInfo() {
        return gWho;
    }
    function gUser() {
        return gWho;
    }
   
	//Messagebox
	function ShowMsg(msg, caption, callback) {
		if (caption == null) caption = "알림";
	    DevExpress.ui.dialog.alert(msg, caption).done(function () {
	        if (callback != null) {
	            if (typeof callback === "function") {
	                callback();
	            }
	        }
	    });
	}
	
	//현재시간 얻기
	function getDateTime() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        if(month.toString().length == 1) {
             month = '0'+month;
        }
        if(day.toString().length == 1) {
             day = '0'+day;
        }   
        if(hour.toString().length == 1) {
             hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
             minute = '0'+minute;
        }
        if(second.toString().length == 1) {
             second = '0'+second;
        }   
        var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute;   
        return dateTime;
    }
	
	
	
    function initIcons() {
        //eCubeUX
        gIcons.add("default", "M 14.932,0L 1.068,0C 0.478667,0 0,0.478667 0,1.068L 0,14.932C 0,15.5213 0.478667,16 1.068,16L 14.932,16C 15.5213,16 16,15.5213 16,14.932L 16,1.068C 16,0.478667 15.5213,0 14.932,0 Z M 14.932,14.932L 1.068,14.932L 1.068,1.068L 14.932,1.068M 3.73467,8.53067L 12.2653,8.53067C 12.5627,8.53067 12.8027,8.292 12.8027,8C 12.8027,7.70267 12.5627,7.46933 12.2653,7.46933L 3.73467,7.46933C 3.43733,7.46933 3.19733,7.70267 3.19733,8C 3.19733,8.292 3.43733,8.53067 3.73467,8.53067 Z M 3.73467,5.33333L 12.2653,5.33333C 12.5627,5.33333 12.8027,5.09333 12.8027,4.80267C 12.8027,4.50533 12.5627,4.26534 12.2653,4.26534L 3.73467,4.26534C 3.43733,4.26534 3.19733,4.50533 3.19733,4.80267C 3.19733,5.09333 3.43733,5.33333 3.73467,5.33333 Z M 3.73467,11.7347L 12.2653,11.7347C 12.5627,11.7347 12.8027,11.4947 12.8027,11.1973C 12.8027,10.9067 12.5627,10.6667 12.2653,10.6667L 3.73467,10.6667C 3.43733,10.6667 3.19733,10.9067 3.19733,11.1973C 3.19733,11.4947 3.43733,11.7347 3.73467,11.7347 Z ");
        gIconsInfo.add("default", "-4 -4 24 24");
        gIcons.add("favorite", "M17.4167,32.25L32.9107,32.25 38,18 43.0893,32.25 58.5833,32.25 45.6798,41.4944 51.4583,56 38,48.0833 26.125,56 30.5979,41.7104 17.4167,32.25z");
        gIconsInfo.add("favorite", "10 10 60 60");
        gIcons.add("favoritelist", "M36.5,45L46.2857,45 49.5,36 52.7143,45 62.5,45 54.3504,50.8386 58,60 49.5,55 42,60 44.825,50.975 36.5,45z M19,23L27,23 27,31 19,31 19,23z M19,34L27,34 27,42 19,42 19,34z M31,23L57,23 57,31 31,31 31,23z M19,45L27,45 27,53 19,53 19,45z M31,34L49.1456,34 46.0384,42 31,42 31,34z M57,34L57,42 52.9615,42 49.8544,34 57,34z M31,45L34.7861,45 43.6365,51.6404 42.7892,53 31,53 31,45z");
        gIconsInfo.add("favoritelist", "10 10 65 65");
        gIcons.add("ecubeux", "M 33,33L 43,33L 43,43L 33,43L 33,33 Z M 33,20L 43,20L 43,30L 33,30L 33,20 Z M 20,20L 30,20L 30,30L 20,30L 20,20 Z M 20,33L 30,33L 30,43L 20,43L 20,33 Z M 46,33L 56,33L 56,43L 46,43L 46,33 Z M 46,20L 56,20L 56,30L 46,30L 46,20 Z M 20,46L 30,46L 30,56L 20,56L 20,46 Z M 33,46L 43,46L 43,56L 33,56L 33,46 Z M 46,46L 56,46L 56,56L 46,56L 46,46 Z ");
        gIconsInfo.add("ecubeux", "10 10 56 56");
        gIcons.add("olap", "M 526.193,432.816C 526.193,437.107 522.684,440.62 518.389,440.62L 513.466,440.62C 509.174,440.62 505.665,437.107 505.665,432.816L 505.665,396.522C 505.665,392.23 509.174,388.718 513.466,388.718L 518.389,388.718C 522.684,388.718 526.193,392.23 526.193,396.522L 526.193,432.816 Z M 559.471,432.816C 559.471,437.107 555.963,440.62 551.669,440.62L 546.743,440.62C 542.45,440.62 538.939,437.107 538.939,432.816L 538.939,374.688C 538.939,370.397 542.45,366.884 546.743,366.884L 551.669,366.884C 555.963,366.884 559.471,370.397 559.471,374.688L 559.471,432.816 Z M 492.918,432.816C 492.918,437.107 489.406,440.62 485.114,440.62L 480.189,440.62C 475.897,440.62 472.387,437.107 472.387,432.816L 472.387,415.949C 472.387,411.657 475.897,408.147 480.189,408.147L 485.114,408.147C 489.406,408.147 492.918,411.657 492.918,415.949L 492.918,432.816 Z M 567.792,330.919L 559.146,353.891C 558.236,356.299 556.157,356.644 554.521,354.655L 552.296,351.947C 550.662,349.957 547.749,349.727 545.821,351.436L 517.47,376.579C 515.542,378.286 512.476,378.195 510.653,376.374L 501.126,366.848C 499.305,365.027 496.3,365.001 494.444,366.788L 464.138,396.033C 462.282,397.823 459.308,397.767 457.514,395.915C 455.726,394.061 455.78,391.083 457.633,389.294L 494.564,353.661C 496.417,351.874 499.421,351.898 501.244,353.723L 511.04,363.518C 512.858,365.34 515.926,365.43 517.852,363.721L 539.873,344.199C 541.796,342.49 542.04,339.464 540.401,337.475L 537.512,333.958C 535.877,331.968 536.632,330.111 539.194,329.833L 564.792,327.044C 567.35,326.766 568.7,328.508 567.792,330.919 Z ");
        gIconsInfo.add("olap", "500 300 600 400");
        gIcons.add("dashboard", "M 19,57L 19,34L 26,34L 26,57L 19,57 Z M 19,19L 33,19L 33,22L 19,22.0001L 19,19 Z M 55,19L 55,22L 41,22.0001L 41,19L 55,19 Z M 19,24L 38,24L 38,27L 19,27.0001L 19,24 Z M 49,24L 48.9999,27.0001L 41,27.0001L 41,24L 49,24 Z M 19,29L 35,29L 35,32L 19,32.0001L 19,29 Z M 53,29L 52.9999,32.0001L 41,32.0001L 41,29L 53,29 Z M 27,57L 27,39L 34,39L 34,57L 27,57 Z M 35,57L 35,48L 42,48L 42,57L 35,57 Z M 43,57L 43,52L 50,52L 50,57L 43,57 Z M 51,57L 51,54L 57,54L 57,57L 51,57 Z ");
        gIconsInfo.add("dashboard", "19 19 57 57");

        //'Survey
        gIcons.add("survey", "M 38.9167,15C 41.1028,15 43.25,16.9805 43.25,19.1667L 43,20.1667L 55,20.1667L 55,56.1667L 23,56.1666L 23,20.1667L 35,20.1667L 34.75,19.1667C 34.75,16.9805 36.7305,15 38.9167,15 Z M 52,23.1667L 46.5,23.1667L 48.5,27.1667L 29.5,27.1667L 31.5,23.1667L 26,23.1667L 26,53.1667L 52,53.1667L 52,23.1667 Z M 38.9166,17.375C 38.0422,17.375 37,18.0422 37,18.9167C 37,19.2051 37.3653,19.9338 37.5,20.1667L 40.5,20.1667C 40.6347,19.9338 41,19.2051 41,18.9167C 41,18.0422 39.7911,17.375 38.9166,17.375 Z ");
        gIconsInfo.add("survey", "14 14 50 50");
        gIcons.add("surveydefine", "M 22.3908,33.9299L 34.0851,45.6243L 29.7767,49.9327L 18.0823,38.2384L 22.3908,33.9299 Z M 17.1591,37.3152L 14.6971,35.3402C 13.9076,34.5507 14.2153,32.873 15.0049,32.0835L 16.2359,30.8525C 17.0254,30.063 18.5238,29.7552 19.3133,30.5447L 21.4675,33.0067L 17.1591,37.3152 Z M 35.9418,52.3947L 30.6999,50.856L 35.0084,46.5475L 36.4473,51.8893L 35.9418,52.3947 Z M 39.9167,15.8333C 42.1028,15.8333 44.25,17.8139 44.25,20L 44,21L 56,21L 56,57L 24,57L 24,47.75L 27,50.75L 27,54L 53,54L 53,24L 47.5,24L 49.5,28L 30.5,28L 32.5,24L 27,24L 27,35.5L 24,32L 24,21L 36,21L 35.75,20C 35.75,17.8139 37.7305,15.8333 39.9167,15.8333 Z M 39.9166,18.2084C 39.0422,18.2084 38,18.8756 38,19.75C 38,20.0384 38.3653,20.7671 38.5,21L 41.5,21C 41.6347,20.7671 42,20.0384 42,19.75C 42,18.8756 40.7911,18.2084 39.9166,18.2084 Z ");
        gIconsInfo.add("surveydefine", "13 14 52 54");
        gIcons.add("surveymonitoring", "M 38.7337,23.2523C 39.6902,23.2523 40.6296,24.1102 40.6296,25.0573L 40.5202,25.4904L 45.7702,25.4905L 45.7702,41.0856L 31.7702,41.0856L 31.7702,25.4904L 37.0202,25.4904L 36.9108,25.0573C 36.9108,24.1102 37.7773,23.2523 38.7337,23.2523 Z M 44.4577,26.7901L 42.0514,26.7901L 42.9264,28.5228L 34.6139,28.5228L 35.4889,26.7901L 33.0827,26.7901L 33.0827,39.786L 44.4577,39.786L 44.4577,26.7901 Z M 38.7337,24.2811C 38.3511,24.2811 37.8952,24.5701 37.8952,24.949C 37.8952,25.0739 38.055,25.3896 38.1139,25.4905L 39.4264,25.4905C 39.4854,25.3896 39.6452,25.0739 39.6452,24.949C 39.6452,24.5701 39.1163,24.2811 38.7337,24.2811 Z M 21,20.0002L 56.9998,20.0002C 58.1044,20.0002 58.9998,20.8956 58.9998,22.0002L 58.9999,43C 58.9999,44.1046 58.1045,45.0001 56.9999,45.0001L 42,45L 42,50L 46,50C 47.1046,50 48,50.8954 48,52L 48,54L 30,54L 30,52C 30,50.8954 30.8955,50 32,50L 36,50L 36,45L 21,45.0001C 19.8954,45.0001 19,44.1046 19,43L 19,22.0002C 19,20.8956 19.8954,20.0002 21,20.0002 Z M 22,23.0002L 22,42L 55.9999,42L 55.9998,23.0002L 22,23.0002 Z ");
        gIconsInfo.add("surveymonitoring", "10 10 60 60");
        gIcons.add("surveyanalysis", "M 23,54L 23,26C 23,24.3432 24.3431,23 26,23L 30.5001,22.9999C 30.5001,22.9999 31.4999,22.8807 31.4999,21.5C 31.4999,20.1193 33.1191,19 34.4998,19L 41.5001,19C 42.8809,19 44.5001,20.1193 44.5001,21.5C 44.5001,22.8807 45.4999,22.9999 45.4999,22.9999L 50,23.0001C 51.6569,23.0001 53,24.3432 53,26.0001L 53,54.0001C 53,55.6569 51.6568,57 50,57.0001L 26,57C 24.3431,57 23,55.6569 23,54 Z M 35.9997,22.0003C 34.619,22.0003 33.4997,23.1195 33.4997,24.5003C 33.4997,25.881 32.4999,27.0002 32.4999,27.0002L 43.4999,27.0002C 43.4999,27.0002 42.5002,25.881 42.5002,24.5003C 42.5002,23.1196 41.3809,22.0003 40.0002,22.0003L 35.9997,22.0003 Z M 28.4999,30.0001L 29.9999,26.0001L 26,26.0001L 25.9999,54.0001L 49.9999,54.0001L 49.9999,26.0001L 45.9999,26.0001L 47.4999,30.0002L 28.4999,30.0001 Z M 40.1887,50.0227C 40.1887,50.7184 39.5761,51.2879 38.8264,51.2879L 37.9671,51.2879C 37.2179,51.2879 36.6053,50.7184 36.6053,50.0227L 36.6053,44.1388C 36.6053,43.443 37.2179,42.8735 37.9671,42.8735L 38.8264,42.8735C 39.5761,42.8735 40.1887,43.443 40.1887,44.1388L 40.1887,50.0227 Z M 45.9978,50.0227C 45.9978,50.7184 45.3855,51.2879 44.6358,51.2879L 43.776,51.2879C 43.0266,51.2879 42.4138,50.7184 42.4138,50.0227L 42.4138,40.5989C 42.4138,39.9033 43.0266,39.3337 43.776,39.3337L 44.6358,39.3337C 45.3855,39.3337 45.9978,39.9033 45.9978,40.5989L 45.9978,50.0227 Z M 34.3803,50.0227C 34.3803,50.7184 33.7672,51.2879 33.018,51.2879L 32.1582,51.2879C 31.409,51.2879 30.7964,50.7184 30.7964,50.0227L 30.7964,47.2883C 30.7964,46.5925 31.409,46.0233 32.1582,46.0233L 33.018,46.0233C 33.7672,46.0233 34.3803,46.5925 34.3803,47.2883L 34.3803,50.0227 Z M 47.4502,33.5031L 45.9411,37.2273C 45.7821,37.6178 45.4193,37.6737 45.1337,37.3512L 44.7452,36.9121C 44.4601,36.5896 43.9516,36.5522 43.615,36.8294L 38.6661,40.9055C 38.3296,41.1824 37.7942,41.1675 37.4761,40.8724L 35.8131,39.3279C 35.4952,39.0327 34.9705,39.0286 34.6466,39.3182L 29.3564,44.0595C 29.0325,44.3496 28.5132,44.3406 28.2002,44.0403C 27.888,43.7397 27.8974,43.2569 28.2209,42.9669L 34.6675,37.1902C 34.991,36.9004 35.5154,36.9043 35.8336,37.2001L 37.5436,38.788C 37.861,39.0835 38.3966,39.0981 38.7327,38.821L 42.5767,35.656C 42.9124,35.379 42.9549,34.8885 42.6689,34.5659L 42.1645,33.9959C 41.8792,33.6732 42.0109,33.3721 42.4583,33.3272L 46.9265,32.875C 47.3732,32.8298 47.6087,33.1122 47.4502,33.5031 Z ");
        gIconsInfo.add("surveyanalysis", "14 14 50 50");

        //'Targeting
        gIcons.add("targeting", "M 38,17C 40.9455,17 43.3333,19.3878 43.3333,22.3333C 43.3333,25.2788 40.9455,27.6667 38,27.6667C 35.0545,27.6667 32.6667,25.2788 32.6667,22.3333C 32.6667,19.3878 35.0545,17 38,17 Z M 32.6666,34.3834C 31.9555,34.7389 30.7833,37.8333 31.4262,38.2501L 27.964,37.6132C 30.3193,36.76 30.7911,35.3344 30.9823,32.7335L 30.8009,31.1163C 31.5744,30.4725 32.7185,29.0501 33.7333,29.0502L 42.2666,29.0502C 43.3037,29.0501 44.2149,29.4913 44.9999,30.1593L 45.4999,32.0001C 45.4999,34.1736 47.1556,34.8271 48.886,35.8798L 46.4666,35.8292C 45.8376,35.8068 45.2551,35.9483 44.7188,36.2059C 44.2645,35.4252 43.7029,34.5682 43.3333,34.3834L 43.4534,37.0835C 41.1956,39.1569 40.0666,43.0679 40.0666,43.0679L 39.6764,45.0053L 38.5333,45.05C 37.7661,45.05 37.0129,44.99 36.2782,44.8745C 35.6933,43.3208 34.4183,40.5162 32.4533,39.2079L 32.6666,34.3834 Z M 24.7333,26.95C 27.6789,26.95 30.0667,29.3378 30.0667,32.2833C 30.0667,35.2288 27.6789,37.6167 24.7333,37.6167C 21.7878,37.6167 19.4,35.2288 19.4,32.2833C 19.4,29.3378 21.7878,26.95 24.7333,26.95 Z M 19.4,44.3333C 18.6889,44.6889 17.2667,47.5333 17.2667,47.5333C 17.2667,47.5333 16.5556,48.6 16.2,52.8666L 13,51.8L 14.0667,46.4667C 14.0667,46.4667 16.2,39 20.4666,39.0001L 28.9999,39.0001C 33.2667,39 35.4,46.4667 35.4,46.4667L 36.4666,51.8L 33.2667,52.8667C 32.9111,48.6 32.2001,47.5333 32.2001,47.5333C 32.2001,47.5333 30.7778,44.6889 30.0667,44.3333L 30.4976,54.0204C 28.8762,54.6529 27.112,55 25.2667,55C 23.0173,55 20.8884,54.4843 18.9918,53.5646L 19.4,44.3333 Z M 51.7333,24.931C 54.6788,25.0359 57.0667,27.5087 57.0667,30.4542C 57.0667,33.3997 54.6788,35.7025 51.7333,35.5977C 48.7878,35.4928 46.4,33.02 46.4,30.0745C 46.4,27.129 48.7878,24.8262 51.7333,24.931 Z M 46.4,42.1245C 45.6889,42.4547 44.2667,45.2485 44.2667,45.2485C 44.2667,45.2485 43.5556,46.2898 43.2,50.5438L 40,49.3632L 41.0667,44.0679C 41.0667,44.0679 43.2,36.6772 47.4666,36.8292L 55.9999,37.133C 60.2667,37.2848 62.4,44.8274 62.4,44.8274L 63.4666,50.1988L 60.2667,51.1515C 59.9111,46.8722 59.2001,45.7802 59.2001,45.7802C 59.2001,45.7802 57.7778,42.8851 57.0667,42.5042L 57.4976,52.2067C 55.8762,52.7814 54.112,53.0657 52.2667,53C 50.0173,52.9199 47.8884,52.3284 45.9918,51.3412L 46.4,42.1245 Z ");
        gIconsInfo.add("targeting", "15 12 54 56");
        gIcons.add("easyanalysis", "M 44.26,-18.3C 39.912,-18.5347 36.776,-14.6027 36.5573,-10.5973C 36.7133,-7.73867 38.0213,-5.70667 39.812,-4.49333C 38.0733,-1.88933 36.3387,0.72 34.604,3.324C 33.6307,2.81867 32.5467,2.512 31.4587,2.45467C 29.9213,2.37067 28.5573,2.892 27.4587,3.76133C 25.4733,1.54267 23.484,-0.681334 21.4947,-2.9C 21.8387,-3.61333 22.052,-4.38933 22.0933,-5.176C 22.2547,-8.16533 19.5467,-10.332 16.792,-10.4773C 13.8027,-10.6387 11.64,-7.93067 11.4893,-5.176C 11.536,-4.348 11.7453,-3.59733 12.068,-2.92C 10.4373,-1.02933 8.80267,0.866666 7.16667,2.75733C 6.448,2.24667 5.56267,1.93333 4.56267,1.88133C 1.99467,1.74133 0.136,4.06933 0.00533333,6.43867C -0.130667,9.00667 2.19733,10.8707 4.56267,10.996C 7.136,11.1373 8.99467,8.804 9.12533,6.43867C 9.07867,5.57467 8.82267,4.804 8.432,4.14267C 9.67733,2.7 10.9213,1.25733 12.1667,-0.186666C 12.5053,-0.581333 12.8493,-0.977333 13.188,-1.37333C 14.1093,-0.498667 15.3493,0.0426664 16.792,0.121333C 18.2347,0.2 19.4787,-0.389334 20.4013,-1.332C 22.3227,0.818667 24.2453,2.96533 26.1667,5.116C 25.3027,6.29867 24.7707,7.75733 24.688,9.22533C 24.896,13.0533 27.6307,15.7827 31.4587,15.9907C 35.276,16.2 38.036,12.7413 38.224,9.22533C 38.3333,7.26667 37.4693,5.59067 36.136,4.392C 37.9173,1.71467 39.6973,-0.966667 41.484,-3.644C 45.864,-2.06133 51.6253,-4.37867 51.9587,-10.5973C 52.1933,-14.9467 48.26,-18.0867 44.26,-18.3 Z ");
        gIconsInfo.add("easyanalysis", "0 -20 72 50");
        gIcons.add("customergroupmanagement", "M 25.3333,42.75C 26.5189,42.75 27.6436,43.0106 28.6533,43.4777L 34.9459,37.185L 32.5825,34.8217L 30.3433,37.0609L 28.1042,34.8217L 29.0343,33.8915C 27.1425,33.1521 25.7233,31.6492 23.4735,29.3994C 18.836,24.7619 16.1846,19.8945 18.0395,18.0396C 19.8945,16.1846 23.9702,18.0444 28.6077,22.6819C 30.8575,24.9317 33.1521,27.1425 33.8915,29.0344L 34.8217,28.1042L 37.0608,30.3433L 34.8217,32.5825L 37.185,34.9459L 43.4777,28.6533C 43.0106,27.6436 42.75,26.5189 42.75,25.3333C 42.75,20.9611 46.2944,17.4167 50.6667,17.4167C 51.6877,17.4167 52.6636,17.61 53.5597,17.9619L 47.5,24.0216L 51.9783,28.5L 58.0381,22.4403C 58.39,23.3364 58.5833,24.3123 58.5833,25.3333C 58.5833,29.7056 55.0389,33.25 50.6667,33.25C 49.8136,33.25 48.9921,33.1151 48.2222,32.8654L 41.6634,39.4242L 50.8787,48.6395L 51.4384,48.0797L 56.8841,53.5253L 53.5253,56.8841L 48.0797,51.4384L 48.6395,50.8787L 39.4242,41.6634L 32.8654,48.2222C 33.1151,48.9921 33.25,49.8136 33.25,50.6667C 33.25,55.0389 29.7056,58.5833 25.3333,58.5833C 24.3123,58.5833 23.3364,58.39 22.4403,58.0381L 28.5,51.9783L 24.0217,47.5L 17.9619,53.5597C 17.61,52.6636 17.4167,51.6877 17.4167,50.6667C 17.4167,46.2944 20.9611,42.75 25.3333,42.75 Z ");
        gIconsInfo.add("customergroupmanagement", "8 8 64 64");
        gIcons.add("customergroupgenerate", "M 26.9167,38L 31.6667,38L 31.6667,45.9167L 39.5833,45.9167L 39.5833,50.6667L 31.6667,50.6667L 31.6667,58.5833L 26.9167,58.5833L 26.9167,50.6667L 19,50.6667L 19,45.9167L 26.9167,45.9167L 26.9167,38 Z M 38,19C 43.5417,19 45.9167,22.1667 45.1174,28.8134C 45.8315,29.2229 46.3125,29.9928 46.3125,30.875C 46.3125,31.9545 45.5923,32.8658 44.6061,33.1546C 44.1941,34.623 43.5543,35.9229 42.75,36.9628L 42.75,41.9583C 45.3889,42.4861 47.5,42.75 50.6667,44.3333C 53.8333,45.9167 54.8889,47.3681 57,49.4792L 57,57L 33.25,57L 33.25,52.25L 41.1667,52.25L 41.1666,44.3333L 33.25,44.3333L 33.25,36.9628L 33.25,36.4167L 32.8586,36.4167C 32.237,35.4811 31.7366,34.3762 31.3939,33.1546C 30.4077,32.8658 29.6875,31.9545 29.6875,30.875C 29.6875,29.9928 30.1685,29.2229 30.8826,28.8134C 30.0833,22.1667 32.4583,19 38,19 Z M 19,57L 19,52.25L 25.3333,52.25L 25.3333,57L 19,57 Z ");
        gIconsInfo.add("customergroupgenerate", "10 10 60 60");
        gIcons.add("customergroupexpert", "M 38,19C 43.5417,19 45.9167,22.1667 45.1174,28.8134C 45.8315,29.2229 46.3125,29.9928 46.3125,30.875C 46.3125,31.9545 45.5923,32.8658 44.6061,33.1546C 44.1941,34.623 43.5543,35.9229 42.75,36.9628L 42.75,41.9583C 45.3889,42.4861 47.5,42.75 50.6667,44.3333C 53.8333,45.9167 54.8889,47.3681 57,49.4792L 57,57L 19,57L 19,49.4792C 21.1111,47.3681 22.1667,45.9167 25.3333,44.3333C 28.5,42.75 30.6111,42.4861 33.25,41.9583L 33.25,36.9628C 32.4457,35.9229 31.8059,34.623 31.3939,33.1546C 30.4077,32.8658 29.6875,31.9545 29.6875,30.875C 29.6875,29.9928 30.1685,29.2229 30.8826,28.8134C 30.0833,22.1667 32.4583,19 38,19 Z M 35.2292,44.3333L 36.8125,47.5L 39.1875,47.5L 40.7708,44.3333L 35.2292,44.3333 Z M 36.4167,49.0833L 38,55.4167L 39.5833,49.0833L 36.4167,49.0833 Z ");
        gIcons.add("customergroupexplorer", "M 413.698,334.751L 421.627,326.824C 420.603,325.003 420.394,322.89 420.394,320.636C 420.394,313.793 425.416,308.246 432.076,308.246C 438.736,308.246 444.135,313.793 444.135,320.636C 444.135,327.478 438.736,332.638 432.076,332.638C 429.995,332.638 428.037,332.484 426.328,331.53L 418.338,339.518C 417.161,340.728 414.875,340.728 413.698,339.518C 412.521,338.309 412.521,335.96 413.698,334.751 Z M 432.076,312.892C 427.914,312.892 424.539,316.359 424.539,320.636C 424.539,324.913 427.914,328.379 432.076,328.379C 436.238,328.379 439.613,324.913 439.613,320.636C 439.613,316.359 436.238,312.892 432.076,312.892 Z M 408.117,272.849C 414.964,272.849 420.515,278.551 420.515,285.586C 420.515,292.621 414.964,298.324 408.117,298.324C 401.27,298.324 395.72,292.621 395.72,285.586C 395.72,278.551 401.27,272.849 408.117,272.849 Z M 395.72,316.157C 394.067,317.006 390.761,323.799 390.761,323.799C 390.761,323.799 389.108,326.347 388.281,336.537L 380.843,333.99L 383.323,321.252C 383.323,321.252 388.281,303.419 398.199,303.419L 418.035,303.419C 421.108,303.419 423.706,305.132 425.827,307.495C 421.349,309.921 418.296,314.751 418.296,320.313C 418.296,322.243 418.663,324.084 419.33,325.768L 412.569,332.714C 410.429,334.913 410.429,339.283 412.569,341.483C 413.107,342.035 411.341,341.632 409.357,341.632C 404.128,341.632 399.18,340.401 394.771,338.204L 395.72,316.157 Z M 429.934,313.598L 434.169,313.598L 434.169,318.323L 437.968,318.323L 437.968,322.651L 434.169,322.651L 434.169,326.931L 429.934,326.931L 429.934,322.651L 426.135,322.651L 426.135,318.323L 429.934,318.323L 429.934,313.598 Z ");
        gIconsInfo.add("customergroupexplorer", "370 260 100 100");
        gIcons.add("strategytree", "M 46.2574,50.0858L 49.5858,53.4142L 55.7426,47.2573L 58.0711,49.5858L 49.5858,58.0711L 43.9289,52.4142L 46.2574,50.0858 Z M 54.75,46L 51.75,49L 43,49L 43,59L 53,59L 53,57.4286L 56,54L 56,62L 40,62L 40,46L 54.75,46 Z M 36,15.1667C 40.3723,15.1667 43.9167,18.7111 43.9167,23.0833C 43.9167,27.4556 40.3723,31 36,31C 31.6278,31 28.0833,27.4556 28.0833,23.0833C 28.0833,18.7111 31.6278,15.1667 36,15.1667 Z M 28.0833,42.0834C 27.0278,42.6111 24.9167,46.8333 24.9167,46.8333C 24.9167,46.8333 23.8611,48.4166 23.3333,54.7499L 18.5833,53.1666L 20.1667,45.25C 20.1667,45.25 23.3333,34.1667 29.6666,34.1668L 42.3332,34.1668C 48.1003,34.1667 51.2417,43.3565 51.7574,45L 46.0953,45C 45.4022,43.7894 44.4989,42.3744 43.9167,42.0833L 44.0464,45L 39,45L 39,57.804L 36.7917,57.9167C 33.4528,57.9167 30.2927,57.1511 27.4774,55.786L 28.0833,42.0834 Z ");
        gIcons.add("d3fdatasource", "M 19,42L 19,34L 27,34L 27,42L 19,42 Z M 30.9999,42L 30.9999,34L 56.9999,34L 56.9999,42L 30.9999,42 Z M 31,45L 57,45L 57,53L 31,53L 31,45 Z M 32,46L 32,52L 56,52L 56,46L 32,46 Z M 21,44L 25,44L 25,47L 28,47L 28,51L 25,51L 25,54L 21,54L 21,51L 18,51L 18,47L 21,47L 21,44 Z M 22,45L 22,48L 19,48L 19,50L 22,50L 22,53L 24,53L 24,50L 27,50L 27,48L 24,48L 24,45L 22,45 Z M 19.0001,31L 19.0001,23L 27.0001,23L 27.0001,31L 19.0001,31 Z M 31.0001,31L 31.0001,23L 57,23L 57,31L 31.0001,31 Z ");
        gIcons.add("d3fprocess", "M 51.3993,40.6839L 55.3313,37.3116C 56.0694,37.6255 56.7703,38.0098 57.4255,38.4563L 56.7193,43.5857L 61.8843,43.9815C 62.1797,44.7122 62.4064,45.478 62.5566,46.271L 58.4292,49.3994L 61.8015,53.3313C 61.4877,54.0694 61.1033,54.7703 60.6568,55.4255L 55.5274,54.7193L 55.1317,59.8843C 54.4009,60.1797 53.6351,60.4064 52.8421,60.5566L 49.7138,56.4292L 45.7818,59.8015C 45.0437,59.4877 44.3428,59.1033 43.6876,58.6568L 44.3938,53.5274L 39.2288,53.1317C 38.9334,52.4009 38.7067,51.6351 38.5566,50.8421L 42.6839,47.7138L 39.3116,43.7818C 39.6255,43.0437 40.0098,42.3428 40.4563,41.6876L 45.5857,42.3938L 45.9815,37.2289C 46.7122,36.9334 47.478,36.7067 48.271,36.5566L 51.3993,40.6839 Z M 50.5565,43.6712C 47.8584,43.6712 45.6711,45.8584 45.6711,48.5566C 45.6711,51.2547 47.8584,53.442 50.5565,53.442C 53.2547,53.442 55.4419,51.2547 55.4419,48.5566C 55.4419,45.8584 53.2547,43.6712 50.5565,43.6712 Z M 17,21L 25,21L 25,29L 17,29L 17,21 Z M 17,32L 25,32L 25,40L 17,40L 17,32 Z M 29,21L 55,21L 55,29L 29,29L 29,21 Z M 17,43L 25,43L 25,51L 17,51L 17,43 Z M 29,32L 55,32L 55,36.1321L 51.5534,38.9092L 48.3929,35L 45.0311,36.3404L 44.3091,40L 42.75,40L 38.3746,39.4138L 37.9945,40L 29,40L 29,32 Z M 29,43L 37.2744,43L 40.4092,47.4465L 36.2778,51L 29,51L 29,43 Z M 50.5,45C 52.433,45 54,46.567 54,48.5C 54,50.433 52.433,52 50.5,52C 48.567,52 47,50.433 47,48.5C 47,46.567 48.567,45 50.5,45 Z ");
        gIconsInfo.add("d3fprocess", "12 12 58 58");
        gIcons.add("d3fjobflow", "M 19,31L 27,31L 27,23L 19,23L 19,31 Z M 31,31L 56.9999,31L 56.9999,23L 31,23L 31,31 Z M 31,34L 31,42L 35,42L 35,40.9999L 32,41L 32,35L 41,34.9999L 41,34L 31,34 Z M 56.9999,42L 56.9999,34L 46.9999,34L 46.9999,34.9999L 55.9999,35L 55.9999,41L 52.9999,40.9999L 52.9999,42L 56.9999,42 Z M 36,37.75L 36,43.25L 44,51.25L 52,43.25L 52,37.75L 46,43.75L 46,34L 42,34L 42,43.75L 36,37.75 Z M 31,53L 56.9999,53L 56.9999,45L 52.2499,45L 51.2499,46L 56,46L 56,52L 32,52L 32,46L 36.75,46L 35.75,45L 31,45L 31,53 Z M 19,53L 27,53L 27,45L 19,45L 19,53 Z M 20,52L 20,46L 26,46L 26,52L 20,52 Z M 19,42L 27,42L 27,34L 19,34L 19,42 Z M 26,41L 20,41L 20,35L 26,35L 26,41 Z ");
        gIcons.add("d3fmanagement", "M 57.2976,94.5135L 55.2804,93.7072C 55.4399,92.1119 55.3901,90.4866 55.1137,88.8682L 57.0575,87.8964C 58.2754,87.2891 58.8064,85.7209 58.2464,84.3986L 57.11,81.7236C 56.5509,80.4023 55.1073,79.8218 53.893,80.4328L 51.9456,81.4044C 50.9932,80.1248 49.8895,79.0259 48.6679,78.1188L 49.411,75.9366C 49.875,74.572 49.2308,73.054 47.9774,72.5502L 45.4291,71.528C 44.2149,71.0443 42.7605,71.7701 42.3137,73.0845L 41.5706,75.2715C 40.1017,75.1026 38.6043,75.1604 37.114,75.4555L 36.2187,73.3463C 35.6592,72.0239 34.2151,71.4478 33.0008,72.0544L 30.5332,73.2842C 29.3198,73.8951 28.7852,75.4634 29.3443,76.7817L 30.2396,78.8921C 29.0643,79.929 28.0485,81.1287 27.2129,82.4545L 25.203,81.6468C 23.9887,81.1549 22.5334,81.882 22.0839,83.2032L 21.146,85.9708C 20.9194,86.632 20.9475,87.3462 21.2167,87.9848C 21.4894,88.6222 21.9743,89.1102 22.5796,89.3522L 24.5977,90.16C 24.4346,91.7548 24.4871,93.384 24.7635,94.9985L 22.817,95.9705C 21.6027,96.5776 21.0717,98.1458 21.6272,99.4641L 22.7672,102.142C 23.3263,103.464 24.7671,104.041 25.9814,103.434L 27.9316,102.462C 28.884,103.741 29.9886,104.841 31.2065,105.747L 30.4625,107.93C 30.236,108.591 30.2641,109.306 30.5369,109.944C 30.806,110.585 31.2908,111.073 31.8998,111.316L 34.4489,112.339C 35.0542,112.581 35.7121,112.553 36.3039,112.261C 36.8911,111.966 37.3371,111.439 37.5636,110.778L 38.3065,108.591C 39.7764,108.764 41.2734,108.706 42.7632,108.41L 43.6594,110.521C 44.2185,111.839 45.663,112.419 46.8764,111.811L 49.3441,110.579C 50.5582,109.971 51.0928,108.403 50.5302,107.085L 49.6339,104.971C 50.8129,103.938 51.8251,102.738 52.6606,101.412L 54.6751,102.223C 55.2839,102.465 55.9419,102.438 56.5337,102.142C 57.1173,101.847 57.5667,101.32 57.7897,100.662L 58.7321,97.8959C 59.1952,96.5357 58.5509,95.0172 57.2976,94.5135 Z M 43.953,101.393C 42.6822,102.031 41.3332,102.35 39.9424,102.35C 36.2078,102.35 32.7851,99.9708 31.2237,96.2932C 29.0117,91.074 31.1214,84.8757 35.9251,82.4733C 37.1956,81.8358 38.544,81.516 39.9313,81.516C 43.6667,81.516 47.0894,83.8919 48.6534,87.5735C 50.8662,92.7917 48.7567,98.9909 43.953,101.393 Z M 81.2944,102.054L 80.1726,101.604C 80.2605,100.717 80.2324,99.8095 80.0765,98.9102L 81.1603,98.3681C 81.84,98.0307 82.1336,97.158 81.8218,96.4241L 81.192,94.9322C 80.8767,94.1943 80.0765,93.872 79.4005,94.2144L 78.314,94.7565C 77.783,94.0415 77.1704,93.4305 76.4907,92.9265L 76.9049,91.7088C 77.1631,90.951 76.8025,90.1062 76.1047,89.8256L 74.6856,89.2568C 74.0096,88.9833 73.2022,89.3867 72.9511,90.1216L 72.537,91.3398C 71.7196,91.2428 70.8841,91.2774 70.0559,91.4429L 69.5564,90.2672C 69.2448,89.5333 68.441,89.2107 67.765,89.5489L 66.3921,90.2367C 65.7161,90.5752 65.418,91.4468 65.7297,92.1808L 66.229,93.3575C 65.5738,93.934 65.0075,94.602 64.5444,95.3399L 63.4216,94.8903C 62.7492,94.6178 61.9391,95.0211 61.6872,95.759L 61.1634,97.2997C 61.0393,97.6657 61.0538,98.0651 61.2024,98.4223C 61.3546,98.7755 61.6237,99.049 61.9636,99.1838L 63.0854,99.6334C 62.9975,100.521 63.0256,101.424 63.1779,102.327L 62.0941,102.869C 61.418,103.207 61.1208,104.079 61.4325,104.813L 62.066,106.305C 62.3777,107.039 63.1815,107.361 63.8575,107.023L 64.9404,106.481C 65.4714,107.196 66.0877,107.807 66.7673,108.311L 66.3532,109.525C 66.229,109.894 66.2435,110.293 66.3921,110.651C 66.5444,111.005 66.8126,111.277 67.1533,111.412L 68.5688,111.981C 68.9086,112.115 69.2765,112.1 69.6028,111.938C 69.9317,111.773 70.1827,111.482 70.3069,111.116L 70.7174,109.894C 71.5384,109.994 72.3703,109.96 73.2022,109.794L 73.7015,110.97C 74.0096,111.704 74.817,112.027 75.4894,111.688L 76.8659,111.001C 77.5419,110.662 77.8391,109.791 77.5283,109.057L 77.029,107.876C 77.6842,107.303 78.2469,106.635 78.71,105.897L 79.8328,106.347C 80.1726,106.485 80.5405,106.466 80.8658,106.305C 81.1957,106.139 81.4431,105.847 81.5708,105.478L 82.091,103.938C 82.3493,103.18 81.9913,102.335 81.2944,102.054 Z M 73.8646,105.886C 73.1559,106.239 72.4056,106.42 71.6308,106.42C 69.5529,106.42 67.6445,105.094 66.7773,103.045C 65.5423,100.14 66.7175,96.6885 69.3936,95.3517C 70.1012,94.9985 70.8524,94.8175 71.6236,94.8175C 73.7051,94.8175 75.6099,96.1437 76.4799,98.192C 77.7121,101.097 76.5369,104.549 73.8646,105.886 Z M 106.731,55.6902L 103.344,54.3345C 103.613,51.6515 103.524,48.9194 103.06,46.1981L 106.332,44.5649C 108.374,43.5467 109.269,40.906 108.328,38.6845L 106.42,34.1845C 105.478,31.9669 103.054,30.9909 101.011,32.0131L 97.7373,33.6542C 96.1333,31.5025 94.2747,29.6539 92.2285,28.1279L 93.4782,24.4533C 94.2539,22.1629 93.1737,19.6118 91.0641,18.7657L 86.7814,17.044C 84.7389,16.2294 82.2958,17.4513 81.5418,19.665L 80.2931,23.3435C 77.8219,23.0553 75.3054,23.1507 72.7989,23.6505L 71.291,20.1037C 70.3531,17.8822 67.9245,16.9102 65.8821,17.9324L 61.7334,20.0034C 59.6908,21.0256 58.7954,23.6623 59.7334,25.8799L 61.245,29.4305C 59.2658,31.1719 57.5604,33.1888 56.1549,35.4182L 52.7739,34.0575C 50.7313,33.2351 48.2892,34.457 47.5317,36.6746L 45.953,41.3291C 45.5742,42.4399 45.6168,43.6421 46.0735,44.7145C 46.5302,45.7908 47.3476,46.6094 48.3635,47.0127L 51.7508,48.3734C 51.4826,51.0524 51.5705,53.7925 52.0381,56.5097L 48.764,58.1429C 46.7214,59.1651 45.8252,61.8008 46.7671,64.0145L 48.6752,68.5224C 49.6167,70.736 52.0453,71.713 54.0879,70.6908L 57.3583,69.0537C 58.9614,71.2053 60.82,73.054 62.8698,74.5761L 61.6201,78.2496C 61.2413,79.3604 61.2839,80.5636 61.7405,81.6389C 62.1936,82.7113 63.0111,83.5296 64.0306,83.9411L 68.3142,85.6589C 69.3373,86.0662 70.4446,86.021 71.4325,85.5291C 72.4237,85.0333 73.1777,84.1487 73.5529,83.0377L 74.8061,79.3604C 77.2728,79.6529 79.7938,79.5562 82.2994,79.0534L 83.8037,82.6044C 84.7461,84.8219 87.1738,85.7976 89.2164,84.7754L 93.3613,82.7005C 95.4075,81.6782 96.3001,79.0455 95.3576,76.8244L 93.8533,73.2734C 95.8325,71.532 97.5388,69.5181 98.9407,67.2926L 102.324,68.6533C 103.348,69.0606 104.456,69.0143 105.446,68.5195C 106.434,68.0236 107.188,67.1391 107.563,66.0323L 109.145,61.3787C 109.925,59.0923 108.841,56.5363 106.731,55.6902 Z M 84.2994,67.2621C 82.158,68.3266 79.8926,68.8687 77.5564,68.8687C 71.2765,68.8687 65.5249,64.8724 62.8979,58.6811C 59.1779,49.9101 62.7211,39.4883 70.7989,35.4487C 72.933,34.3802 75.2021,33.8391 77.5383,33.8391C 83.8182,33.8391 89.5743,37.8355 92.2005,44.0229C 95.9177,52.8007 92.3744,63.2195 84.2994,67.2621 Z ");

        //'Campaign
        gIcons.add("campaign", "M 319.526,248.786L 323.328,244.608C 323.947,243.927 325.007,243.878 325.687,244.496L 339.268,256.853C 339.947,257.47 341.007,257.421 341.625,256.741L 348.559,249.118C 349.179,248.439 349.13,247.379 348.45,246.76L 334.87,234.404C 334.19,233.785 334.14,232.724 334.758,232.046L 338.562,227.866C 339.179,227.186 338.935,226.655 338.018,226.684L 318.643,227.293C 317.726,227.32 317.023,228.092 317.078,229.01L 318.296,248.355C 318.354,249.271 318.908,249.466 319.526,248.786 Z M 361.116,261.048C 361.114,262.168 360.231,262.956 359.395,262.956L 296.865,262.956C 296.028,262.956 295.143,262.163 295.14,261.048L 295.14,219.677C 295.343,219.703 295.547,219.74 295.758,219.74L 361.116,219.74M 288.856,211.997L 288.856,241.448L 280.608,241.448C 279.774,241.448 278.886,240.655 278.883,239.54L 278.883,198.168C 279.086,198.197 279.288,198.23 279.499,198.23L 344.862,198.23L 344.862,203.805L 296.865,203.805C 292.348,203.833 288.859,207.559 288.856,211.997 Z M 333.099,189.513L 337.55,189.513L 337.55,193.518L 333.099,193.518M 339.706,189.513L 344.154,189.513L 344.154,193.518L 339.706,193.518M 349.354,211.022L 353.807,211.022L 353.807,215.026L 349.354,215.026M 355.96,211.022L 360.411,211.022L 360.411,215.026L 355.96,215.026M 359.395,203.805L 351.143,203.805L 351.143,190.488C 351.14,186.053 347.656,182.326 343.138,182.297L 280.608,182.297C 276.091,182.326 272.604,186.051 272.602,190.488L 272.602,239.54C 272.604,243.974 276.091,247.702 280.608,247.728L 288.856,247.728L 288.856,261.048C 288.859,265.482 292.348,269.212 296.865,269.237L 359.395,269.237C 363.914,269.212 367.395,265.482 367.398,261.048L 367.398,211.997C 367.395,207.563 363.914,203.833 359.395,203.805 Z ");
        gIconsInfo.add("campaign", "260 165 120 120");
        gIcons.add("campaignnstrategy", "M 361.116,261.06L 361.116,219.751L 295.757,219.751L 295.14,219.689L 295.14,261.06C 295.142,262.174 296.028,262.967 296.864,262.967L 359.394,262.967C 360.23,262.967 361.113,262.18 361.116,261.06 Z M 288.856,212.01C 288.858,207.572 292.348,203.846 296.864,203.818L 344.861,203.818L 344.861,198.243L 279.498,198.243L 278.882,198.181L 278.882,239.553C 278.885,240.668 279.773,241.461 280.608,241.461L 288.856,241.461L 288.856,212.01 Z M 333.098,189.526L 333.098,193.531L 337.549,193.531L 337.549,189.526L 333.098,189.526 Z M 339.705,189.526L 339.705,193.531L 344.153,193.531L 344.153,189.526L 339.705,189.526 Z M 349.353,211.035L 349.353,215.039L 353.806,215.039L 353.806,211.035L 349.353,211.035 Z M 355.96,211.035L 355.96,215.039L 360.41,215.039L 360.41,211.035L 355.96,211.035 Z M 359.394,203.818C 363.913,203.846 367.394,207.576 367.397,212.01L 367.397,261.061C 367.394,265.495 363.913,269.225 359.394,269.25L 296.864,269.25C 292.348,269.225 288.858,265.495 288.856,261.061L 288.856,247.741L 280.608,247.741C 276.09,247.715 272.604,243.987 272.601,239.553L 272.601,190.501C 272.604,186.064 276.09,182.339 280.608,182.31L 343.137,182.31C 347.656,182.339 351.14,186.066 351.142,190.501L 351.142,203.818L 359.394,203.818 Z M 350.27,256.007L 345.59,251.356L 341.693,255.034L 346.374,259.685C 343.269,261.093 339.459,260.536 336.931,258.024C 334.451,255.56 333.946,251.951 335.373,249.011L 332.687,246.341L 321.759,259.82C 320.546,261.316 317.817,261.049 315.695,259.227C 313.573,257.404 312.987,254.824 314.394,253.494L 327.455,241.143L 323.771,237.481C 320.699,238.787 316.986,238.205 314.508,235.741C 311.98,233.23 311.503,229.526 313.035,226.555L 317.716,231.207L 321.614,227.528L 316.933,222.877C 320.037,221.47 323.848,222.027 326.375,224.539C 328.822,226.97 329.348,230.517 327.99,233.437L 331.703,237.126L 332.147,236.706C 333.219,235.692 334.741,235.334 335.961,235.7L 341.015,230.181L 339.679,229.008L 345.788,222.48L 349.533,225.767L 343.424,232.294L 342.702,231.66L 337.667,237.156C 338.193,238.284 337.998,239.788 337.069,240.935L 336.385,241.779L 339.656,245.029C 342.703,243.79 346.353,244.39 348.798,246.822C 351.327,249.334 351.803,253.037 350.27,256.007 Z ");
        gIconsInfo.add("campaignnstrategy", "270 180 120 120");
        gIcons.add("campaigndefine", "M 361.116,261.06L 361.116,219.751L 295.757,219.751L 295.14,219.689L 295.14,261.06C 295.142,262.174 296.028,262.967 296.864,262.967L 359.394,262.967C 360.23,262.967 361.113,262.18 361.116,261.06 Z M 288.856,212.01C 288.858,207.572 292.348,203.846 296.864,203.818L 344.861,203.818L 344.861,198.243L 279.498,198.243L 278.882,198.181L 278.882,239.553C 278.885,240.668 279.773,241.461 280.608,241.461L 288.856,241.461L 288.856,212.01 Z M 333.098,189.526L 333.098,193.531L 337.549,193.531L 337.549,189.526L 333.098,189.526 Z M 339.705,189.526L 339.705,193.531L 344.153,193.531L 344.153,189.526L 339.705,189.526 Z M 349.353,211.035L 349.353,215.039L 353.806,215.039L 353.806,211.035L 349.353,211.035 Z M 355.96,211.035L 355.96,215.039L 360.41,215.039L 360.41,211.035L 355.96,211.035 Z M 359.394,203.818C 363.913,203.846 367.394,207.576 367.397,212.01L 367.397,261.061C 367.394,265.495 363.913,269.225 359.394,269.25L 296.864,269.25C 292.348,269.225 288.858,265.495 288.856,261.061L 288.856,247.741L 280.608,247.741C 276.09,247.715 272.604,243.987 272.601,239.553L 272.601,190.501C 272.604,186.064 276.09,182.339 280.608,182.31L 343.137,182.31C 347.656,182.339 351.14,186.066 351.142,190.501L 351.142,203.818L 359.394,203.818 Z M 333.324,246.895C 332.933,246.607 332.696,246.156 332.727,245.68L 332.775,245.42L 332.786,245.362C 332.787,245.284 332.77,245.201 332.45,245.155L 332.308,245.156L 332.077,245.155C 331.386,245.111 330.774,244.61 330.75,243.903C 330.727,243.609 330.627,243.579 330.59,243.578L 330.497,243.597L 330.027,243.672C 329.751,243.653 329.51,243.522 329.334,243.325L 328.421,247.549L 328.403,247.674C 328.412,247.979 328.464,248.011 328.681,248.052L 328.926,248.026L 333.279,246.907L 333.324,246.895 Z M 315.8,254.702L 337.442,254.456L 337.301,244.239L 334.833,246.908L 334.759,246.964C 334.676,247.129 334.516,247.285 334.3,247.386L 333.933,247.485L 333.477,247.65L 329.123,248.77L 328.784,248.816L 327.803,249.937C 327.508,250.251 327.022,250.28 326.72,250.005C 326.419,249.73 326.411,249.247 326.705,248.934L 327.632,247.874L 327.625,247.619L 327.659,247.388L 328.62,242.936C 328.705,242.584 328.756,242.366 328.931,242.153L 329.136,241.852L 337.148,233.189L 337.042,225.532L 321.321,225.711L 321.399,231.023L 315.549,231.089L 315.8,254.702 Z M 343.247,226.595L 348.943,231.651L 339.568,241.788L 339.769,256.364L 313.522,256.664L 313.246,230.214L 319.481,223.795L 339.316,223.569L 339.415,230.739L 343.247,226.595 Z M 351.19,226.502C 351.936,227.162 352.027,228.273 351.392,228.969L 350.072,230.415L 344.376,225.358L 345.695,223.913C 346.331,223.217 347.461,223.188 348.207,223.851L 351.19,226.502 Z ");
        gIconsInfo.add("campaigndefine", "270 180 120 120");
        gIcons.add("sitecampaigndefine", "M 52.0838,44.9293C 51.9144,44.8052 51.8116,44.6102 51.8248,44.4048L 51.8457,44.2922L 51.7049,44.1777L 51.6431,44.1783L 51.5432,44.1779C 51.2434,44.1588 50.9782,43.9424 50.9677,43.637C 50.9575,43.5098 50.9144,43.4969 50.8984,43.4964L 50.8579,43.5048L 50.6545,43.5369C 50.5346,43.5286 50.43,43.4721 50.3536,43.3871L 49.9586,45.2115L 49.9506,45.2655C 49.9547,45.3971 49.9771,45.411 50.0714,45.4289L 50.1774,45.4176L 52.0642,44.9346L 52.0838,44.9293 Z M 44.4885,48.3001L 53.8697,48.196L 53.8074,43.7827L 52.7378,44.9354L 52.7058,44.9596L 52.5069,45.1418L 52.3476,45.1846L 52.1503,45.2556L 50.263,45.7389L 50.1161,45.7589L 49.6911,46.243C 49.5632,46.3787 49.3523,46.3911 49.2213,46.2721C 49.0909,46.1532 49.0875,45.9447 49.215,45.8098L 49.6167,45.352L 49.6137,45.2415L 49.6283,45.1416L 50.0444,43.2188L 50.179,42.8807L 50.2678,42.7506L 53.7398,39.0097L 53.6931,35.7022L 46.8784,35.7777L 46.913,38.0723L 44.3772,38.1002L 44.4885,48.3001 Z M 56.383,36.1619L 58.8526,38.3464L 54.7897,42.7241L 54.8787,49.0204L 43.5011,49.1471L 43.3789,37.7216L 46.0809,34.9499L 54.6786,34.8545L 54.7224,37.9513L 56.383,36.1619 Z M 59.826,36.1224C 60.1496,36.4079 60.1891,36.8875 59.9139,37.1882L 59.3419,37.8125L 56.8721,35.6277L 57.4439,35.0038C 57.7193,34.703 58.2091,34.6907 58.5325,34.977L 59.826,36.1224 Z M 32.65,25.9167C 35.3277,25.9167 37.4985,27.9065 37.4985,30.3611C 37.4985,32.8157 35.3277,34.8056 32.65,34.8056C 29.9722,34.8056 27.8015,32.8157 27.8015,30.3611C 27.8015,27.9065 29.9722,25.9167 32.65,25.9167 Z M 27.8015,41.0278C 27.155,41.3241 25.8621,43.6944 25.8621,43.6944C 25.8621,43.6944 25.2156,44.5833 24.8924,48.1388L 21.9833,47.25L 22.953,42.8056C 22.953,42.8056 24.8924,36.5833 28.7712,36.5834L 36.5287,36.5834C 40.4076,36.5833 42.3469,42.8056 42.3469,42.8056L 43.3166,47.25L 40.4075,48.1389C 40.0843,44.5833 39.4379,43.6944 39.4379,43.6944C 39.4379,43.6944 38.1449,41.3241 37.4985,41.0278L 37.8903,49.1004C 36.4162,49.6274 34.8124,49.9167 33.1348,49.9167C 31.09,49.9167 29.1546,49.4869 27.4304,48.7205L 27.8015,41.0278 Z ");
        gIconsInfo.add("sitecampaigndefine", "14 18 52 48");
        gIcons.add("offerscriptmanagement", "M 320.757,211.206L 381.761,211.206L 376.569,206.366L 305.181,206.366L 305.181,356.426L 320.757,356.426L 320.757,211.206 Z M 420.699,211.206L 486.895,272.925L 486.895,361.624C 487.026,361.655 487.156,361.688 487.285,361.723L 505.589,343.656L 500.749,339.818L 522.874,318.449L 536.435,329.21L 514.311,350.574L 511.695,348.499L 493.463,366.491C 495.365,370.181 494.662,375.106 491.298,378.862L 488.821,381.624L 500.665,392.263C 511.7,388.205 524.918,390.171 533.775,398.13C 542.932,406.352 544.655,418.475 539.107,428.199L 522.158,412.973L 508.042,425.014L 524.997,440.238C 513.751,444.846 499.952,443.022 490.798,434.801C 481.817,426.736 479.988,414.921 485.156,405.296L 479.25,399.992L 472.344,399.992L 435.849,440.679C 431.457,445.576 421.573,444.701 413.888,438.739C 406.204,432.77 404.081,424.325 409.178,419.973L 432.554,399.992L 320.757,399.992L 320.757,375.789L 284.414,375.789L 284.414,187.003L 384.357,187.003L 410.316,211.206L 420.699,211.206 Z M 341.524,230.569L 341.524,380.63L 455.207,380.63L 456.48,379.542L 443.137,367.554C 432.01,371.828 418.565,369.923 409.59,361.857C 400.433,353.638 398.707,341.512 404.255,331.789L 421.21,347.015L 435.323,334.973L 418.37,319.747C 429.614,315.143 443.414,316.966 452.568,325.189C 461.429,333.145 463.335,344.758 458.416,354.314L 466.128,361.242L 466.128,293.498L 398.634,293.498L 398.634,230.569L 341.524,230.569 Z M 419.401,236.62L 419.401,274.135L 459.638,274.135L 419.401,236.62 Z ");
        gIconsInfo.add("offerscriptmanagement", "300 160 230 340");
        gIcons.add("campaignmonitoring", "M 16.7436,16.1667L 59.381,16.1667C 60.6893,16.1667 61.7498,17.2191 61.7498,18.5172L 61.7498,43.1973C 61.7498,44.4955 60.6893,45.5478 59.3811,45.5478L 41.6156,45.5478L 41.6156,51.424L 46.3531,51.424C 47.6613,51.424 48.7218,52.4764 48.7218,53.7745L 48.7218,56.125L 27.403,56.125L 27.4031,53.7745C 27.4031,52.4764 28.4636,51.424 29.7718,51.424L 34.5093,51.424L 34.5093,45.5478L 16.7436,45.5478C 15.4354,45.5478 14.3749,44.4955 14.3749,43.1973L 14.3748,18.5172C 14.3748,17.2191 15.4354,16.1667 16.7436,16.1667 Z M 17.928,19.6925L 17.928,42.0221L 58.1967,42.0221L 58.1966,19.6925L 17.928,19.6925 Z M 37.8145,34.9352C 37.6668,35.0661 37.534,35.0285 37.5203,34.8522L 37.2286,31.1252C 37.2155,30.9482 37.3837,30.7995 37.6033,30.7943L 42.2406,30.6769C 42.4602,30.6714 42.5186,30.7738 42.3708,30.9046L 41.4603,31.71C 41.3126,31.8407 41.3244,32.0451 41.4871,32.1642L 44.7375,34.5449C 44.9003,34.6641 44.9121,34.8682 44.7637,34.9992L 43.1039,36.4678C 42.9561,36.5986 42.7024,36.6082 42.54,36.4893L 39.2893,34.1086C 39.1265,33.9894 38.8728,33.999 38.7247,34.1302L 37.8145,34.9352 Z M 47.7693,37.2975L 47.7693,29.339L 32.1256,29.339L 31.9779,29.327L 31.9779,37.2975C 31.9785,37.5122 32.1904,37.665 32.3905,37.665L 47.3573,37.665C 47.5574,37.665 47.7687,37.5133 47.7693,37.2975 Z M 30.4738,27.8473C 30.4744,26.9922 31.3096,26.2746 32.3905,26.269L 43.8788,26.269L 43.8788,25.1952L 28.2341,25.1952L 28.0866,25.1831L 28.0866,33.1538C 28.0873,33.3687 28.2998,33.5213 28.4996,33.5213L 30.4738,33.5213L 30.4738,27.8473 Z M 41.0633,23.5156L 41.0633,24.2873L 42.1286,24.2873L 42.1286,23.5156L 41.0633,23.5156 Z M 42.6446,23.5156L 42.6446,24.2873L 43.7093,24.2873L 43.7093,23.5156L 42.6446,23.5156 Z M 44.9539,27.6595L 44.9539,28.431L 46.0198,28.431L 46.0198,27.6595L 44.9539,27.6595 Z M 46.5352,27.6595L 46.5352,28.431L 47.6005,28.431L 47.6005,27.6595L 46.5352,27.6595 Z M 47.3573,26.269C 48.4389,26.2746 49.2722,26.993 49.2728,27.8473L 49.2728,37.2975C 49.2722,38.1517 48.4389,38.8704 47.3573,38.8752L 32.3905,38.8752C 31.3096,38.8704 30.4744,38.1517 30.4738,37.2975L 30.4738,34.7313L 28.4996,34.7313C 27.4184,34.7262 26.5838,34.008 26.5832,33.1538L 26.5832,23.7035C 26.5838,22.8485 27.4184,22.1309 28.4996,22.1253L 43.4661,22.1253C 44.5477,22.1309 45.3816,22.849 45.3822,23.7035L 45.3822,26.269L 47.3573,26.269 Z ");
        gIconsInfo.add("campaignmonitoring", "6 6 70 70");
        gIcons.add("campaignanalysis", "M 16.7436,16.1667L 59.381,16.1667C 60.6893,16.1667 61.7498,17.2191 61.7498,18.5172L 61.7498,43.1973C 61.7498,44.4955 60.6893,45.5478 59.3811,45.5478L 41.6156,45.5478L 41.6156,51.424L 46.3531,51.424C 47.6613,51.424 48.7218,52.4764 48.7218,53.7745L 48.7218,56.125L 27.403,56.125L 27.4031,53.7745C 27.4031,52.4764 28.4636,51.424 29.7718,51.424L 34.5093,51.424L 34.5093,45.5478L 16.7436,45.5478C 15.4354,45.5478 14.3749,44.4955 14.3749,43.1973L 14.3748,18.5172C 14.3748,17.2191 15.4354,16.1667 16.7436,16.1667 Z M 17.928,19.6925L 17.928,42.0221L 58.1967,42.0221L 58.1966,19.6925L 17.928,19.6925 Z M 26.9582,22.0626L 28.476,22.0626L 28.476,37.26L 48.2082,37.26L 48.2082,38.5626L 26.9582,38.5626L 26.9582,22.0626 Z M 29.4879,36.3915L 29.4879,34.329L 34.5475,29.8784L 41.1248,32.8093L 47.1963,24.6679L 48.2082,25.5363L 41.6308,34.6547L 34.6739,31.6152L 29.4879,36.3915 Z ");
        gIconsInfo.add("campaignanalysis", "6 6 70 70");
        gIcons.add("customermanagement", "M 370.662,437.686L 392.312,318.801C 397.437,290.661 421.135,272.698 445.244,278.68C 461.956,282.826 474.479,297.388 478.883,315.307L 519.286,384.948L 581.386,420.175C 592.471,426.463 597.089,442.048 591.702,454.985C 586.315,467.922 572.962,473.312 561.878,467.025L 498.63,431.146C 494.854,429.004 491.829,425.783 489.693,421.955C 486.769,420.038 484.171,417.319 482.162,413.856L 470.053,392.986L 457.968,459.345L 370.662,437.686 Z M 451.999,158.073C 476.108,164.054 491.498,191.714 486.374,219.853C 481.249,247.992 457.551,265.955 433.442,259.974C 409.333,253.993 393.943,226.333 399.068,198.193C 404.192,170.054 427.89,152.092 451.999,158.073 Z M 349.224,186.354C 363.907,186.354 375.809,199.964 375.809,216.752C 375.809,233.541 363.907,247.151 349.224,247.151L 260.608,247.151C 245.926,247.151 234.023,233.541 234.023,216.752C 234.023,199.964 245.926,186.354 260.608,186.354L 349.224,186.354 Z M 334.6,277.367C 347.418,277.367 357.809,290.077 357.809,305.756C 357.809,321.435 347.418,334.145 334.6,334.145L 257.233,334.145C 244.415,334.145 234.023,321.435 234.023,305.756C 234.023,290.077 244.415,277.367 257.233,277.367L 334.6,277.367 Z M 315.1,363.645C 325.433,363.645 333.81,377.747 333.81,395.143C 333.81,412.538 325.433,426.64 315.1,426.64L 252.733,426.64C 242.4,426.64 234.023,412.538 234.023,395.143C 234.023,377.747 242.4,363.645 252.733,363.645L 315.1,363.645 Z ");

        //'EBM
        gIcons.add("ebm", "M 487.902,339.193L 472.264,332.405C 471.032,331.874 470.466,330.436 471,329.202C 471.536,327.967 472.972,327.4 474.207,327.934L 489.844,334.724C 491.078,335.257 491.643,336.694 491.107,337.928C 490.711,338.846 489.814,339.395 488.874,339.395C 488.548,339.395 488.22,339.331 487.902,339.193 Z M 513.238,330.477C 512.065,329.819 511.645,328.332 512.306,327.158L 519.775,313.856C 520.437,312.681 521.922,312.266 523.097,312.923C 524.267,313.586 524.687,315.069 524.029,316.245L 516.555,329.548C 516.109,330.343 515.281,330.789 514.43,330.789C 514.025,330.789 513.614,330.689 513.238,330.477 Z M 498.51,330.968L 493.602,316.39C 493.173,315.114 493.861,313.728 495.135,313.301C 496.41,312.871 497.793,313.555 498.223,314.832L 503.133,329.409C 503.562,330.686 502.877,332.069 501.599,332.496C 501.341,332.585 501.079,332.627 500.821,332.627C 499.803,332.627 498.853,331.983 498.51,330.968 Z M 486.625,349.894C 486.376,351.734 485.068,353.345 483.167,353.886L 473.45,356.653L 476.215,366.37L 476.219,366.37C 476.757,368.271 476.078,370.23 474.646,371.412L 479.662,389.036C 481.503,389.283 483.111,390.59 483.654,392.491L 486.421,402.207L 496.137,399.44C 498.06,398.891 500.043,399.593 501.22,401.061L 537.368,390.768C 537.595,388.9 538.912,387.258 540.835,386.71L 550.555,383.944L 547.789,374.228C 547.251,372.337 547.918,370.39 549.333,369.208L 544.308,351.565C 542.472,351.313 540.868,350.007 540.329,348.111L 537.561,338.393L 527.845,341.163C 525.944,341.702 523.984,341.024 522.803,339.592L 486.625,349.894 Z M 470.939,372.466C 469.096,372.217 467.487,370.91 466.947,369.012L 464.043,358.794C 463.804,357.968 463.687,357.126 463.687,356.293C 463.69,352.311 466.284,348.684 470.303,347.529L 480.527,344.616C 482.428,344.075 484.388,344.755 485.57,346.19L 521.748,335.886C 521.997,334.044 523.304,332.434 525.205,331.892L 535.398,328.994C 536.249,328.741 537.098,328.632 537.917,328.632C 541.899,328.639 545.523,331.229 546.685,335.25L 549.598,345.47C 550.139,347.375 549.458,349.337 548.019,350.518L 553.033,368.128C 554.887,368.365 556.512,369.675 557.057,371.587L 559.971,381.815C 560.202,382.637 560.317,383.473 560.313,384.301C 560.309,388.285 557.717,391.901 553.702,393.069L 543.474,395.979C 543.033,396.106 542.589,396.165 542.154,396.165C 540.731,396.165 539.384,395.531 538.477,394.461L 502.224,404.783C 501.952,406.594 500.654,408.17 498.775,408.706L 488.517,411.628C 487.722,411.848 486.895,411.965 486.062,411.965C 482.086,411.962 478.455,409.371 477.295,405.353L 474.383,395.129L 474.387,395.129C 473.846,393.228 474.523,391.27 475.957,390.09L 470.939,372.466 Z M 518.618,346.49L 514.232,362.106C 513.841,362.978 514.377,363.788 515.42,363.907L 525.54,365.651C 526.585,365.769 526.941,366.507 526.336,367.289L 504.961,394.855C 504.354,395.637 504.14,395.553 504.485,394.668L 512.282,375.326C 512.627,374.442 512.059,373.602 511.023,373.462L 501.751,372.588C 500.713,372.446 500.375,371.7 501.001,370.928L 518.188,346.306C 518.813,345.535 519.008,345.617 518.618,346.49 Z ");
        gIconsInfo.add("ebm", "460 330 100 100");
        gIcons.add("eventdefine", "M 99.5806,69.7678C 97.7427,69.2455 95.814,68.9637 93.825,68.9637C 93.5821,68.9637 93.3437,68.9743 93.1044,68.982C 81.2377,69.384 71.7146,79.6937 71.5247,92.4298C 71.5211,92.5579 71.514,92.6858 71.514,92.8176C 71.514,95.3678 71.8936,97.8219 72.5854,100.124C 75.474,109.72 83.8871,116.667 93.825,116.667C 106.145,116.667 116.136,105.99 116.136,92.8176C 116.136,81.7712 109.111,72.4839 99.5806,69.7678 Z M 93.825,108.589C 85.6755,108.589 79.0688,101.526 79.0688,92.8176C 79.0688,84.1045 85.6755,77.0408 93.825,77.0408C 101.974,77.0408 108.577,84.1045 108.577,92.8176C 108.577,101.526 101.974,108.589 93.825,108.589 Z M 95.9822,82.0415L 90.9471,82.0415L 90.9471,90.5062L 83.0298,90.5062L 83.0298,95.8944L 90.9471,95.8944L 90.9471,104.359L 95.9822,104.359L 95.9822,95.8944L 103.9,95.8944L 103.9,90.5062L 95.9822,90.5062M 43.4473,36.2621C 44.8351,36.2621 45.9671,35.0522 45.9671,33.5681L 45.9671,20.8731C 45.9671,19.3891 44.8351,18.1791 43.4473,18.1791L 41.2855,18.1791C 39.8975,18.1791 38.7703,19.3891 38.7703,20.8731L 38.7703,33.5681C 38.7703,35.0522 39.8975,36.2621 41.2855,36.2621M 83.0298,36.2621C 84.4178,36.2621 85.5495,35.0522 85.5495,33.5681L 85.5495,20.8731C 85.5495,19.3891 84.4178,18.1791 83.0298,18.1791L 80.868,18.1791C 79.4799,18.1791 78.3527,19.3891 78.3527,20.8731L 78.3527,33.5681C 78.3527,35.0522 79.4799,36.2621 80.868,36.2621M 65.7583,97.818C 65.4066,95.9502 65.2203,94.0228 65.2203,92.0472C 65.2203,91.4004 65.2446,90.7583 65.2833,90.1236L 35.5299,90.1236C 33.1441,90.1236 31.2109,88.0566 31.2109,85.5059L 31.2109,48.5743L 93.1044,48.5743L 93.1044,62.8466C 93.5821,62.8203 94.0598,62.8052 94.5456,62.8052C 96.2638,62.8052 97.947,62.9861 99.5806,63.3131L 99.5806,33.1853C 99.5806,29.7843 97.0051,27.0268 93.825,27.0268L 89.1479,27.0268L 89.1479,33.5681C 89.1479,37.1749 86.4033,40.1094 83.0298,40.1094L 80.868,40.1094C 77.4981,40.1094 74.7543,37.1749 74.7543,33.5681L 74.7543,27.0268L 49.5655,27.0268L 49.5655,33.5681C 49.5655,37.1749 46.8208,40.1094 43.4473,40.1094L 41.2855,40.1094C 37.9156,40.1094 35.1718,37.1749 35.1718,33.5681L 35.1718,27.0268L 30.4903,27.0268C 27.3138,27.0268 24.7347,29.7843 24.7347,33.1853L 24.7347,91.6596C 24.7347,95.0605 27.3138,97.818 30.4903,97.818M 50.735,60.116C 50.735,63.4852 48.177,66.2205 45.0216,66.2205C 41.8658,66.2205 39.3073,63.4852 39.3073,60.116C 39.3073,56.742 41.8658,54.0066 45.0216,54.0066C 48.177,54.0066 50.735,56.742 50.735,60.116 Z M 67.8697,60.116C 67.8697,63.4852 65.3112,66.2205 62.1599,66.2205C 59.0041,66.2205 56.4456,63.4852 56.4456,60.116C 56.4456,56.742 59.0041,54.0066 62.1599,54.0066C 65.3112,54.0066 67.8697,56.742 67.8697,60.116 Z M 85.008,60.116C 85.008,63.4852 82.4495,66.2205 79.2937,66.2205C 76.1388,66.2205 73.5839,63.4852 73.5839,60.116C 73.5839,56.742 76.1388,54.0066 79.2937,54.0066C 82.4495,54.0066 85.008,56.742 85.008,60.116 Z M 67.8697,78.5818C 67.8697,81.9559 65.3112,84.6903 62.1599,84.6903C 59.0041,84.6903 56.4456,81.9559 56.4456,78.5818C 56.4456,75.2078 59.0041,72.4722 62.1599,72.4722C 65.3112,72.4722 67.8697,75.2078 67.8697,78.5818 Z M 50.735,78.5818C 50.735,81.9559 48.177,84.6903 45.0216,84.6903C 41.8658,84.6903 39.3073,81.9559 39.3073,78.5818C 39.3073,75.2078 41.8658,72.4722 45.0216,72.4722C 48.177,72.4722 50.735,75.2078 50.735,78.5818 Z ");
        gIcons.add("timegapmanagement", "M 536.182,415.417C 536.182,434.517 520.919,450 502.091,450C 483.263,450 468,434.517 468,415.417C 468,397.484 481.454,382.739 498.682,381.004L 498.682,377.375L 488.454,377.375L 488.454,367L 515.727,367L 515.727,377.375L 505.5,377.375L 505.5,381.004C 512.356,381.695 518.615,384.446 523.666,388.639L 526.126,386.144L 521.305,381.253L 528.536,373.917L 543,388.589L 535.768,395.925L 530.947,391.035L 528.487,393.53C 533.296,399.492 536.182,407.112 536.182,415.417 Z M 476.748,411.958L 485.045,411.958L 485.045,418.875L 476.748,418.875C 478.266,430.434 487.288,439.586 498.682,441.126L 498.682,432.708L 505.5,432.708L 505.5,441.126C 516.894,439.586 525.916,430.434 527.434,418.875L 519.136,418.875L 519.136,411.958L 527.434,411.958C 525.915,400.4 516.894,391.248 505.5,389.708L 505.5,398.125L 498.682,398.125L 498.682,389.708C 487.288,391.248 478.266,400.4 476.748,411.958 Z M 502.091,408.5C 505.856,408.5 508.909,411.597 508.909,415.417C 508.909,419.237 505.856,422.333 502.091,422.333L 488.454,432.708L 495.273,415.417C 495.273,411.597 498.325,408.5 502.091,408.5 Z M 466.274,293C 476.91,293 485.533,301.86 485.533,312.789C 485.533,323.719 476.91,332.579 466.274,332.579C 455.638,332.579 447.016,323.719 447.016,312.789C 447.016,301.86 455.638,293 466.274,293 Z M 496.847,362.866C 494.576,362.783 492.472,363.308 490.536,364.264C 488.895,361.367 486.867,358.187 485.533,357.501L 485.966,367.52C 477.813,375.213 473.737,389.725 473.737,389.725L 472.328,396.914L 468.2,397.08C 465.43,397.08 462.71,396.858 460.057,396.429C 457.945,390.664 453.341,380.257 446.245,375.402L 447.016,357.501C 444.448,358.82 440.215,370.302 442.537,371.849L 430.035,369.486C 438.539,366.32 440.243,361.03 440.934,351.379L 440.279,345.379C 443.072,342.99 447.203,337.712 450.867,337.712L 481.681,337.712C 485.426,337.712 488.716,339.349 491.551,341.827L 493.356,348.658L 496.847,362.866 Z M 418.369,329.919C 429.005,329.919 437.627,338.779 437.627,349.709C 437.627,360.638 429.005,369.498 418.369,369.498C 407.733,369.498 399.11,360.638 399.11,349.709C 399.11,338.779 407.733,329.919 418.369,329.919 Z M 399.11,394.421C 396.542,395.74 391.407,406.294 391.407,406.294C 391.407,406.294 388.839,410.252 387.555,426.084L 376,422.126L 379.852,402.337C 379.852,402.337 387.555,374.631 402.962,374.632L 433.775,374.632C 449.182,374.631 456.886,402.337 456.886,402.337L 460.737,422.126L 449.182,426.084C 447.898,410.252 445.331,406.295 445.331,406.295C 445.331,406.295 440.195,395.74 437.627,394.421L 439.183,430.365C 433.329,432.712 426.958,434 420.295,434C 412.172,434 404.485,432.086 397.636,428.674L 399.11,394.421 Z ");
        gIcons.add("eventmanagement", "M 20.7782,5.79201L 18.5715,5.79201L 18.5715,7.39287L 15.6277,7.39287L 15.6277,5.79201L 9.73554,5.79201L 9.73554,7.39287L 6.79174,7.39287L 6.79174,5.79201L 4.58505,5.79201C 4.14242,5.79201 3.84794,6.11259 3.84794,6.59232L 3.84794,8.99397C 3.84794,9.4697 4.14242,9.78952 4.58505,9.78952L 4.58505,22.5833L 20.7782,22.5833L 20.7782,9.78952C 21.2209,9.78952 21.5153,9.4697 21.5153,8.99397L 21.5153,6.59232C 21.5153,6.11259 21.2209,5.79201 20.7782,5.79201 Z M 19.3086,20.9872L 6.05464,20.9872L 6.05464,9.78952L 19.3086,9.78952M 9.00304,6.59232L 7.52884,6.59232L 7.52884,3.39511L 9.00304,3.39511M 17.8344,6.59232L 16.3648,6.59232L 16.3648,3.39511L 17.8344,3.39511M 9.00304,12.9917L 7.52884,12.9917L 7.52884,11.3906L 9.00304,11.3906M 11.9468,12.9917L 10.4726,12.9917L 10.4726,11.3906L 11.9468,11.3906M 14.8906,12.9917L 13.4164,12.9917L 13.4164,11.3906L 14.8906,11.3906M 17.8344,12.9917L 16.3648,12.9917L 16.3648,11.3906L 17.8344,11.3906M 9.00304,16.1889L 7.52884,16.1889L 7.52884,14.5878L 9.00304,14.5878M 11.9468,16.1889L 10.4726,16.1889L 10.4726,14.5878L 11.9468,14.5878M 15.6277,16.9895L 12.6839,16.9895L 12.6839,13.7873L 15.6277,13.7873M 17.8344,16.1889L 16.3648,16.1889L 16.3648,14.5878L 17.8344,14.5878M 9.00304,19.3861L 7.52884,19.3861L 7.52884,17.785L 9.00304,17.785M 11.9468,19.3861L 10.4726,19.3861L 10.4726,17.785L 11.9468,17.785M 13.4164,17.785L 14.8906,17.785L 14.8906,19.3861L 13.4164,19.3861M 17.8344,19.3861L 16.3648,19.3861L 16.3648,17.785L 17.8344,17.785");
        gIcons.add("eventmonitoring", "M 12.5083,13.625L 64.4082,13.625C 66.0007,13.625 67.2916,15.0335 67.2916,16.7709L 67.2917,49.8021C 67.2917,51.5395 66.0008,52.9479 64.4083,52.9479L 42.7834,52.9478L 42.7834,60.8125L 48.5501,60.8125C 50.1426,60.8125 51.4335,62.2209 51.4335,63.9583L 51.4334,67.1042L 25.4834,67.1042L 25.4835,63.9583C 25.4835,62.2209 26.7744,60.8125 28.3668,60.8125L 34.1334,60.8125L 34.1334,52.9478L 12.5084,52.9479C 10.9159,52.9479 9.62502,51.5395 9.62502,49.8021L 9.625,16.7709C 9.625,15.0335 10.9159,13.625 12.5083,13.625 Z M 13.95,18.3439L 13.95,48.2292L 62.9666,48.2292L 62.9665,18.3439L 13.95,18.3439 Z M 31.0114,26.6475L 26.5642,24.9138C 26.2139,24.778 26.0527,24.4109 26.2048,24.0957C 26.3572,23.7803 26.7656,23.6355 27.1167,23.7719L 31.5638,25.5062C 31.9146,25.6423 32.0754,26.0095 31.9229,26.3246C 31.8103,26.5593 31.5551,26.6993 31.2878,26.6993L 31.0114,26.6475 Z M 38.2169,24.4213C 37.8832,24.2533 37.7637,23.8734 37.9518,23.5736L 40.076,20.1758C 40.2641,19.8757 40.6865,19.7696 41.0206,19.9375C 41.3535,20.1068 41.4729,20.4857 41.2856,20.7862L 39.1603,24.184C 39.0333,24.3871 38.7978,24.501 38.5559,24.501L 38.2169,24.4213 Z M 34.0284,24.5466L 32.6326,20.823C 32.5105,20.4971 32.7062,20.1433 33.0687,20.0339C 33.4312,19.9242 33.8244,20.099 33.9469,20.4252L 35.343,24.1485C 35.4651,24.4746 35.2702,24.8282 34.907,24.9372L 34.6855,24.9704C 34.3962,24.9704 34.1258,24.806 34.0284,24.5466 Z M 30.6483,29.3809C 30.5775,29.8511 30.2056,30.2625 29.6649,30.4007L 26.9014,31.1074L 27.6878,33.5895L 27.689,33.5895C 27.8421,34.0752 27.6488,34.5755 27.2416,34.8773L 28.6681,39.3789C 29.1916,39.4423 29.6491,39.7761 29.8034,40.2617L 30.5903,42.7435L 33.3534,42.0368C 33.9004,41.8967 34.4644,42.0758 34.7991,42.4508L 45.0793,39.8214C 45.1438,39.3443 45.5182,38.9247 46.0653,38.7848L 48.8295,38.0785L 48.0427,35.5967C 47.8899,35.1136 48.0796,34.6164 48.4818,34.3145L 47.053,29.808C 46.5306,29.7437 46.0747,29.4101 45.9212,28.9255L 45.134,26.4434L 42.3708,27.1507C 41.8303,27.2885 41.2729,27.1154 40.937,26.7495L 30.6483,29.3809 Z M 26.1875,35.1465C 25.6633,35.0828 25.2058,34.749 25.0521,34.2643L 24.2262,31.6546L 24.125,31.0157C 24.1257,29.9984 24.8636,29.072 26.0065,28.777L 28.9141,28.0329C 29.4549,27.8949 30.0123,28.0685 30.3483,28.4348L 40.6371,25.803C 40.7078,25.3324 41.0795,24.9212 41.62,24.7829L 44.5189,24.0423L 45.2352,23.9499C 46.3678,23.9518 47.3985,24.6136 47.7288,25.6406L 48.5573,28.251C 48.7113,28.7375 48.5174,29.2387 48.1081,29.5404L 49.5341,34.0386C 50.0615,34.0992 50.5236,34.4338 50.6785,34.9222L 51.5074,37.5348L 51.6045,38.1696C 51.6033,39.1875 50.8662,40.111 49.7244,40.4092L 46.8157,41.1527L 46.4403,41.2002C 46.0356,41.2002 45.6525,41.0381 45.3944,40.7649L 35.0845,43.4014C 35.0071,43.864 34.6381,44.2665 34.1038,44.4033L 31.1864,45.1497L 30.4883,45.236C 29.3575,45.2354 28.325,44.5732 27.9951,43.5469L 27.167,40.9356L 27.1681,40.9356C 27.014,40.4499 27.2068,39.9498 27.6144,39.6484L 26.1875,35.1465 Z M 39.5091,28.4546L 38.4591,32.554C 38.3656,32.783 38.4937,32.9956 38.7434,33.0269L 41.1662,33.4849C 41.4163,33.5158 41.5017,33.7095 41.3567,33.9147L 36.2396,41.1514C 36.0944,41.3568 36.043,41.3348 36.1258,41.1025L 37.9922,36.0247C 38.0749,35.7925 37.9389,35.5721 37.6908,35.5353L 35.4711,35.3057C 35.2227,35.2687 35.1417,35.0726 35.2917,34.8701L 39.4061,28.4063C 39.5558,28.2038 39.6023,28.2253 39.5091,28.4546 Z ");
        gIcons.add("eventanalysis", "M 450.449,304.622L 417.87,293.958C 415.303,293.122 414.123,290.865 415.237,288.924C 416.353,286.984 419.345,286.094 421.917,286.932L 454.497,297.602C 457.066,298.438 458.244,300.695 457.127,302.635C 456.302,304.078 454.433,304.94 452.474,304.94C 451.797,304.94 451.113,304.839 450.449,304.622 Z M 503.236,290.928C 500.791,289.894 499.916,287.558 501.294,285.714L 516.856,264.813C 518.234,262.967 521.328,262.316 523.776,263.347C 526.215,264.388 527.09,266.719 525.717,268.566L 510.147,289.469C 509.217,290.717 507.492,291.42 505.719,291.42C 504.875,291.42 504.019,291.261 503.236,290.928 Z M 472.551,291.698L 462.326,268.795C 461.431,266.789 462.865,264.612 465.52,263.941C 468.176,263.266 471.057,264.339 471.954,266.347L 482.182,289.25C 483.077,291.258 481.649,293.43 478.988,294.102C 478.449,294.24 477.904,294.305 477.365,294.305C 475.246,294.305 473.265,293.295 472.551,291.698 Z M 447.79,321.435C 447.271,324.328 444.547,326.86 440.585,327.709L 420.34,332.055L 426.101,347.323L 426.109,347.323C 427.231,350.311 425.815,353.39 422.833,355.247L 433.283,382.937C 437.118,383.327 440.469,385.38 441.6,388.367L 447.364,403.633L 467.607,399.284C 471.614,398.423 475.746,399.526 478.198,401.833L 553.51,385.66C 553.981,382.724 556.725,380.143 560.733,379.281L 580.984,374.938L 575.22,359.672C 574.1,356.699 575.49,353.64 578.436,351.784L 567.969,324.063C 564.142,323.668 560.802,321.615 559.677,318.636L 553.91,303.367L 533.668,307.719C 529.708,308.566 525.626,307.501 523.165,305.25L 447.79,321.435 Z M 415.11,356.904C 411.27,356.512 407.918,354.457 406.792,351.474L 400.741,335.422C 400.244,334.123 400,332.8 400,331.49C 400.005,325.235 405.411,319.534 413.784,317.722L 435.085,313.144C 439.045,312.295 443.129,313.363 445.591,315.616L 520.966,299.427C 521.484,296.533 524.207,294.003 528.167,293.151L 549.404,288.597C 551.177,288.201 552.946,288.029 554.652,288.029C 562.95,288.042 570.5,292.11 572.919,298.427L 578.989,314.485C 580.117,317.478 578.697,320.562 575.699,322.416L 586.146,350.087C 590.009,350.459 593.394,352.518 594.529,355.521L 600.601,371.591C 601.082,372.883 601.321,374.196 601.313,375.498C 601.304,381.758 595.904,387.44 587.54,389.274L 566.23,393.847C 565.311,394.044 564.386,394.141 563.48,394.141C 560.515,394.141 557.709,393.143 555.818,391.462L 480.289,407.678C 479.723,410.525 477.019,413.001 473.104,413.844L 451.731,418.435C 450.075,418.779 448.353,418.964 446.617,418.964C 438.333,418.961 430.769,414.888 428.352,408.576L 422.285,392.511L 422.293,392.511C 421.165,389.525 422.577,386.448 425.563,384.594L 415.11,356.904 Z M 514.318,381.709C 514.994,384.063 513.155,386.477 510.227,387.074L 506.872,387.758C 503.946,388.355 501,386.916 500.325,384.562L 494.609,364.656C 493.934,362.302 495.773,359.888 498.699,359.292L 502.054,358.607C 504.982,358.01 507.927,359.449 508.603,361.803L 514.318,381.709 Z M 537.004,377.083C 537.68,379.437 535.842,381.851 532.914,382.448L 529.557,383.133C 526.63,383.729 523.684,382.291 523.008,379.937L 513.854,348.055C 513.179,345.702 515.019,343.287 517.945,342.69L 521.303,342.006C 524.231,341.409 527.175,342.848 527.851,345.201L 537.004,377.083 Z M 491.635,386.334C 492.311,388.688 490.47,391.102 487.544,391.699L 484.187,392.384C 481.261,392.98 478.315,391.541 477.64,389.188L 474.984,379.937C 474.308,377.582 476.147,375.169 479.073,374.573L 482.431,373.888C 485.357,373.291 488.304,374.729 488.979,377.083L 491.635,386.334 Z M 526.63,320.039L 524.354,333.84C 524.113,335.287 522.75,335.766 521.322,334.902L 519.378,333.726C 517.952,332.862 515.929,333.14 514.884,334.346L 499.517,352.077C 498.472,353.281 496.366,353.657 494.837,352.912L 486.843,349.011C 485.314,348.266 483.262,348.669 482.278,349.907L 466.224,370.16C 465.241,371.399 463.204,371.783 461.69,371.016C 460.179,370.248 459.747,368.606 460.728,367.368L 480.293,342.691C 481.275,341.453 483.326,341.049 484.856,341.796L 493.076,345.807C 494.603,346.553 496.709,346.176 497.752,344.972L 509.69,331.203C 510.731,329.998 510.421,328.305 508.991,327.441L 506.467,325.914C 505.04,325.05 505.262,323.926 506.965,323.418L 523.975,318.331C 525.676,317.822 526.87,318.59 526.63,320.039 Z ");
        gIcons.add("realtimeeventdefine", "M 28.7703,37.2988C 29.6383,37.2988 30.4105,36.9128 30.9576,36.3028L 35.2883,36.3028C 36.4049,36.3028 37.3071,35.3695 37.3071,34.2238C 37.3071,33.0743 36.401,32.1409 35.2883,32.1409L 30.9576,32.1409C 30.4947,31.6248 29.8634,31.282 29.1529,31.1883L 25.2954,25.5928C 24.6493,24.6554 23.3875,24.4346 22.4773,25.1039C 21.5721,25.7662 21.3577,27.0655 22.0037,28.002L 25.8499,33.5823C 25.8076,33.791 25.7847,34.0037 25.7847,34.2238C 25.7847,35.9248 27.1227,37.2988 28.7703,37.2988 Z M 34.1491,13.5592L 34.6277,14.0159C 35.0935,14.4654 35.3646,15.0995 35.3646,15.7607C 35.3646,16.4179 35.0974,17.052 34.6277,17.5005L 33.0755,18.9894C 39.1041,20.8129 43.6188,26.2897 44.1727,32.9362L 42.3612,32.9362C 41.6194,32.9362 41.0155,33.5541 41.0155,34.3222C 41.0155,35.0863 41.6194,35.7082 42.3612,35.7082L 44.1806,35.7082C 43.5767,42.8903 38.3466,48.7095 31.5879,50.0209L 31.5879,47.0211C 31.5879,46.6229 31.3589,46.2651 31.0065,46.1068C 30.6513,45.9496 30.2422,46.0201 29.9594,46.2923L 23.9003,52.1075C 23.705,52.297 23.594,52.5611 23.594,52.8403C 23.594,53.1155 23.705,53.3796 23.9003,53.5691L 29.9594,59.3843C 30.2422,59.6524 30.6513,59.727 31.0065,59.5698C 31.3589,59.4085 31.5879,59.0496 31.5879,58.6565L 31.6535,55.6516C 41.8141,54.1789 49.6289,45.1936 49.6289,34.3222C 49.6289,24.3642 43.0569,16.0289 34.1491,13.5592 Z M 22.2444,52.8484C 22.2444,52.1911 22.5126,51.5571 22.9823,51.1075L 24.5345,49.6197C 18.5098,47.7962 13.9912,42.3197 13.4363,35.6728L 15.2488,35.6728C 15.9906,35.6728 16.5945,35.055 16.5945,34.2868C 16.5945,33.5188 15.9906,32.9008 15.2488,32.9008L 13.4285,32.9008C 14.0333,25.7188 19.2624,19.8986 26.026,18.5882L 26.026,21.588C 26.026,21.9862 26.2511,22.344 26.6025,22.5013C 26.9587,22.6595 27.3674,22.5839 27.6506,22.3168L 33.7097,16.5006C 33.9044,16.3121 34.016,16.0482 34.016,15.7688C 34.016,15.4926 33.9044,15.2295 33.7097,15.0402L 27.6506,9.2248C 27.3674,8.95263 26.9587,8.88207 26.6025,9.03932C 26.2511,9.19657 26.026,9.55945 26.026,9.95257L 25.9565,12.9574C 15.7988,14.4301 7.98111,23.4196 7.98111,34.2868C 7.98111,44.241 14.549,52.5802 23.4599,55.0489L 22.9823,54.5922C 22.5126,54.1437 22.2444,53.5056 22.2444,52.8484 Z ");
        gIcons.add("realtimeeventmanagement", "M 659.988,525.652C 659.988,536.586 668.143,545.443 678.131,545.443L 678.131,548.798C 656.538,551.83 636.118,560.288 618.198,573.454L 609.752,564.278C 608.063,562.443 605.785,561.484 603.508,561.484C 601.23,561.484 599.029,562.443 597.268,564.278L 570.604,593.245C 567.154,596.998 567.154,602.983 570.604,606.731L 579.272,616.149C 564.435,640.646 556.503,669.293 556.503,699.3C 556.503,739.839 571.045,777.982 597.411,806.629C 623.781,835.281 658.887,851.081 696.199,851.081C 733.51,851.081 768.839,835.44 795.206,806.711C 821.571,778.064 836.114,739.917 836.114,699.379C 836.114,658.843 821.571,620.696 795.206,592.049C 773.172,568.109 745.041,553.107 714.636,548.876L 714.636,545.524C 724.696,545.443 732.776,536.586 732.776,525.734C 732.776,514.801 724.624,505.944 714.561,505.944L 678.278,505.944C 668.215,505.862 659.988,514.722 659.988,525.652 Z M 696.421,580.398C 756.94,580.398 805.928,633.703 805.928,699.379C 805.928,765.135 756.868,818.362 696.421,818.362C 635.971,818.362 586.911,765.053 586.911,699.379C 586.911,633.703 635.899,580.398 696.421,580.398 Z M 704.132,803.36C 752.901,798.334 791.092,753.723 791.092,699.46C 791.092,645.193 752.901,600.508 704.132,595.559C 700.531,595.158 697.3,597.313 695.833,600.587C 695.317,601.783 695.022,603.06 695.022,604.498L 695.022,794.344C 695.022,795.7 695.317,797.055 695.833,798.252C 697.228,801.525 700.531,803.68 704.132,803.36 Z M 200.579,640.089L 332.342,640.089L 332.342,799.129C 332.342,825.465 352.027,846.849 376.263,846.849C 400.503,846.849 420.184,825.465 420.184,799.129L 420.184,592.368C 420.184,566.032 400.503,544.647 376.263,544.647L 246.336,544.647C 251.698,476.097 278.358,394.142 327.787,348.257L 364.659,431.649L 364.734,431.567C 369.582,442.022 379.348,449.207 390.806,449.207L 537.186,449.207C 553.343,449.207 566.49,434.922 566.49,417.365C 566.49,399.807 553.343,385.526 537.186,385.526L 422.831,385.526C 409.978,356.638 397.196,327.671 384.343,298.782C 378.541,285.694 373.839,269.415 364.881,258.402C 356.654,248.268 344.683,242.36 332.27,242.36C 325.22,242.36 318.606,244.356 312.732,247.552L 312.661,247.391C 212.037,302.051 156.658,424.546 156.658,592.208C 156.658,618.701 176.343,640.089 200.579,640.089 Z M 494.295,196.156C 494.295,234.766 465.487,266.063 429.954,266.063C 394.421,266.063 365.616,234.766 365.616,196.156C 365.616,157.55 394.421,126.253 429.954,126.253C 465.487,126.253 494.295,157.55 494.295,196.156 Z M 637.517,376.269L 600.205,482.643L 486.804,482.643C 476.665,482.643 468.442,491.577 468.442,502.593C 468.442,513.604 476.665,522.543 486.804,522.543L 612.911,522.543C 620.55,522.543 627.378,517.435 630.097,509.692L 671.887,390.471C 675.488,380.177 670.715,368.686 661.24,364.696C 651.765,360.787 641.114,365.973 637.517,376.269 Z ");
        gIconsInfo.add("realtimeeventmanagement", "80 80 960 960");
        gIcons.add("realtimeeventmonitoring", "M 43.072,37.38L 50.1174,42.6588L 43.072,47.9375L 43.072,37.38 Z M 48.9432,33.541C 48.9432,35.1451 48.4617,36.6574 47.6103,37.9864L 45.3146,36.3445C 45.6148,35.7648 45.8247,35.1463 45.9299,34.5007L 43.0719,34.5007L 43.0719,32.5812L 45.9299,32.5812C 45.407,29.3734 42.2995,26.8335 38.375,26.4061L 38.375,28.7421L 36.0265,28.7421L 36.0265,26.4061C 32.1019,26.8335 28.9944,29.3734 28.4715,32.5812L 31.3295,32.5812L 31.3295,34.5007L 28.4715,34.5007C 28.9944,37.7085 32.1019,40.2484 36.0265,40.6758L 36.0265,38.3398L 38.375,38.3398L 38.375,40.6758C 39.1993,40.586 40.2812,40.4031 41.017,40.1403L 41.017,42.6993C 39.905,42.9848 38.4281,43.1387 37.2007,43.1387C 30.7156,43.1387 25.4583,38.8416 25.4583,33.541C 25.4583,28.5642 30.0927,24.4722 36.0265,23.9906L 36.0265,22.9835L 32.5038,22.9835L 32.5038,20.1042L 41.8977,20.1042L 41.8977,22.9835L 38.375,22.9835L 38.375,23.9906C 40.7367,24.1823 42.8925,24.9459 44.6322,26.1095L 45.4794,25.417L 43.8188,24.0597L 46.3098,22.0237L 51.2917,26.0957L 48.8007,28.1317L 47.1401,26.7743L 46.2928,27.4668C 47.9493,29.1214 48.9432,31.2363 48.9432,33.541 Z M 37.2007,31.6214C 38.4977,31.6214 39.5492,32.4809 39.5492,33.541C 39.5492,34.6011 38.4977,35.4605 37.2007,35.4605L 32.5038,38.3398L 34.8522,33.541C 34.8522,32.4809 35.9037,31.6214 37.2007,31.6214 Z M 12.5083,13.625L 64.4082,13.625C 66.0007,13.625 67.2916,15.0335 67.2916,16.7709L 67.2917,49.8021C 67.2917,51.5395 66.0007,52.9479 64.4083,52.9479L 42.7834,52.9478L 42.7834,60.8125L 48.5501,60.8125C 50.1426,60.8125 51.4335,62.2209 51.4335,63.9583L 51.4334,67.1042L 25.4834,67.1042L 25.4835,63.9583C 25.4835,62.2209 26.7744,60.8125 28.3668,60.8125L 34.1334,60.8125L 34.1334,52.9478L 12.5084,52.9479C 10.9159,52.9479 9.62502,51.5395 9.62502,49.8021L 9.625,16.7709C 9.625,15.0335 10.9159,13.625 12.5083,13.625 Z M 13.95,18.3438L 13.95,48.2292L 62.9667,48.2292L 62.9666,18.3438L 13.95,18.3438 Z ");
        gIconsInfo.add("realtimeeventmonitoring", "10 10 80 80");

        //'AnalysisInformationManagement
        gIcons.add("analysisinformationmanagement", "M 551.49,409.6L 551.49,409.747L 550.44,414.064C 548.768,417.473 545.266,419.82 541.214,419.828L 479.414,419.836L 479.92,419.76L 479.262,419.836L 479.244,419.836L 479.239,419.836L 479.234,419.836L 478.738,419.836L 478.692,419.819C 473.271,419.525 468.968,415.046 468.958,409.553L 468.953,365.255C 468.963,359.579 473.558,354.983 479.234,354.969L 501.292,354.969L 501.668,354.966C 504.13,354.992 506.402,355.591 508.274,356.747C 510.112,357.872 511.799,359.822 511.872,362.514C 511.939,362.613 512.132,362.829 512.487,363.046C 513.183,363.492 514.46,363.893 515.902,363.885L 521.221,363.885L 536.374,343.021L 547.146,350.958L 537.754,363.883L 541.208,363.883C 546.88,363.893 551.475,368.486 551.487,374.164L 551.49,409.542L 551.49,409.547L 551.49,409.6 Z M 515.902,370.119C 513.399,370.111 511.094,369.508 509.19,368.336C 507.356,367.211 505.67,365.263 505.594,362.57C 505.531,362.47 505.334,362.254 504.983,362.039C 504.307,361.605 503.086,361.215 501.703,361.202L 479.236,361.204C 477.03,361.208 475.187,363.048 475.184,365.255L 475.187,409.553C 475.192,411.741 477.003,413.565 479.239,413.6L 479.33,413.604L 541.214,413.596C 543.37,413.594 545.18,411.824 545.256,409.678L 545.258,409.329L 545.254,374.164C 545.252,371.958 543.411,370.119 541.208,370.115L 533.225,370.116L 519.918,388.427L 518.046,391.02C 517.505,391.766 516.381,393.165 516.084,393.409L 515.542,393.853L 515.326,394.001L 513.708,394.734L 502.622,399.672C 501.778,400.048 501.312,399.633 501.581,398.75L 505.076,387.387L 505.57,385.789L 506.07,384.816L 507.346,382.984L 508.933,380.805L 516.694,370.118L 515.902,370.119 Z M 552.416,332.491C 555.378,334.71 556.001,338.917 553.817,341.887L 551.678,344.797L 540.906,336.865L 543.114,333.854C 545.304,330.883 549.462,330.273 552.416,332.491 Z ");
        gIconsInfo.add("analysisinformationmanagement", "460 330 110 110");
        gIcons.add("codemanagement", "M 23,54L 23,26C 23,24.3432 24.3431,23 26,23L 30.0001,22.9999C 30.0001,22.9999 30.9999,22.8807 30.9999,21.5C 30.9999,20.1192 32.6191,19 33.9999,19L 41.9998,19.0001C 43.3798,19.0001 44.9988,20.6176 45,21.9978L 44.9998,21.5024C 45.0009,22.8809 46,23 46,23L 50,23C 51.6569,23 53,24.3432 53,26L 52.9999,54C 52.9999,55.6568 51.6568,57 49.9999,57L 26,57C 24.3431,57 23,55.6569 23,54 Z M 32,27L 44,27C 44,27 42.9998,25.8809 42.9998,24.5001C 42.9998,23.1194 41.8805,22.0001 40.4998,22.0001L 35.4998,22.0001C 34.1191,22.0001 32.9998,23.1194 32.9998,24.5001C 32.9998,25.8809 32,27 32,27 Z M 42.7017,48.4733C 41.595,49.0778 40.1572,49.38 38.3883,49.38C 36.1305,49.38 34.3294,48.69 32.985,47.31C 31.6405,45.93 30.9683,44.0922 30.9683,41.7967C 30.9683,39.39 31.7183,37.4211 33.2183,35.89C 34.7183,34.3589 36.6428,33.5933 38.9917,33.5933C 40.4694,33.5933 41.7061,33.7533 42.7017,34.0733L 42.7017,37.06C 41.675,36.4556 40.5128,36.1533 39.215,36.1533C 37.6905,36.1533 36.4683,36.6556 35.5483,37.66C 34.6283,38.6645 34.1683,39.9745 34.1683,41.59C 34.1683,43.1767 34.6061,44.445 35.4817,45.395C 36.3572,46.345 37.5228,46.82 38.9783,46.82C 40.3539,46.82 41.595,46.4467 42.7017,45.7L 42.7017,48.4733 Z ");
        gIconsInfo.add("codemanagement", "14 14 50 50");
        gIcons.add("tagetingmanagement", "M 23,54L 23,26C 23,24.3432 24.3431,23 26,23L 30.0001,22.9999C 30.0001,22.9999 30.9999,22.8807 30.9999,21.5C 30.9999,20.1192 32.6191,19 33.9999,19L 41.9998,19.0001C 43.3798,19.0001 44.9988,20.6176 45,21.9978L 44.9998,21.5024C 45.0009,22.8809 46,23 46,23L 50,23C 51.6569,23 53,24.3432 53,26L 52.9999,54C 52.9999,55.6568 51.6568,57 49.9999,57L 26,57C 24.3431,57 23,55.6569 23,54 Z M 32,27L 44,27C 44,27 42.9998,25.8809 42.9998,24.5001C 42.9998,23.1194 41.8805,22.0001 40.4998,22.0001L 35.4998,22.0001C 34.1191,22.0001 32.9998,23.1194 32.9998,24.5001C 32.9998,25.8809 32,27 32,27 Z M 43.915,36.1533L 39.435,36.1533L 39.435,49.1667L 36.4483,49.1667L 36.4483,36.1533L 31.9683,36.1533L 31.9683,33.8067L 43.915,33.8067L 43.915,36.1533 Z ");
        gIconsInfo.add("tagetingmanagement", "14 14 60 60");
        gIcons.add("explorermanagement", "M 23,54L 23,26C 23,24.3432 24.3431,23 26,23L 30.0001,22.9999C 30.0001,22.9999 30.9999,22.8807 30.9999,21.5C 30.9999,20.1192 32.6191,19 33.9999,19L 41.9998,19.0001C 43.3798,19.0001 44.9988,20.6176 45,21.9978L 44.9998,21.5024C 45.0009,22.8809 46,23 46,23L 50,23C 51.6569,23 53,24.3432 53,26L 52.9999,54C 52.9999,55.6568 51.6568,57 49.9999,57L 26,57C 24.3431,57 23,55.6569 23,54 Z M 32,27L 44,27C 44,27 42.9998,25.8809 42.9998,24.5001C 42.9998,23.1194 41.8805,22.0001 40.4998,22.0001L 35.4998,22.0001C 34.1191,22.0001 32.9998,23.1194 32.9998,24.5001C 32.9998,25.8809 32,27 32,27 Z M 43.0617,49.1667L 34.1017,49.1667L 34.1017,33.8067L 42.635,33.8067L 42.635,36.1533L 37.0883,36.1533L 37.0883,40.2067L 42.4217,40.2067L 42.4217,42.5533L 37.0883,42.5533L 37.0883,46.82L 43.0617,46.82L 43.0617,49.1667 Z ");
        gIconsInfo.add("explorermanagement", "14 14 60 60");
        gIcons.add("profilemanagement", "M 23,54L 23,26C 23,24.3432 24.3431,23 26,23L 30.0001,22.9999C 30.0001,22.9999 30.9999,22.8807 30.9999,21.5C 30.9999,20.1192 32.6191,19 33.9999,19L 41.9998,19.0001C 43.3798,19.0001 44.9988,20.6176 45,21.9978L 44.9998,21.5024C 45.0009,22.8809 46,23 46,23L 50,23C 51.6569,23 53,24.3432 53,26L 52.9999,54C 52.9999,55.6568 51.6568,57 49.9999,57L 26,57C 24.3431,57 23,55.6569 23,54 Z M 32,27L 44,27C 44,27 42.9998,25.8809 42.9998,24.5001C 42.9998,23.1194 41.8805,22.0001 40.4998,22.0001L 35.4998,22.0001C 34.1191,22.0001 32.9998,23.1194 32.9998,24.5001C 32.9998,25.8809 32,27 32,27 Z M 36.3417,43.8333L 36.3417,49.1667L 33.355,49.1667L 33.355,33.8067L 38.4183,33.8067C 42.1539,33.8067 44.0217,35.4289 44.0217,38.6733C 44.0217,40.2422 43.4589,41.5045 42.3333,42.46C 41.2078,43.4156 39.7928,43.8733 38.0883,43.8333L 36.3417,43.8333 Z M 36.3417,36.1533L 36.3417,41.4867L 37.8183,41.4867C 39.8205,41.4867 40.8217,40.58 40.8217,38.7667C 40.8217,37.0245 39.8405,36.1533 37.8783,36.1533L 36.3417,36.1533 Z ");
        gIconsInfo.add("profilemanagement", "14 14 60 60");

        //'operationmanagement
        gIcons.add("operationmanagement", "M 447.373,333.842C 445.855,339.425 440.097,342.72 434.516,341.201C 428.937,339.682 425.639,333.928 427.164,328.345C 428.677,322.765 434.433,319.471 440.013,320.985C 445.596,322.507 448.891,328.262 447.373,333.842 Z M 392.605,311.826C 385.472,318.957 373.909,318.956 366.777,311.824C 359.649,304.695 359.647,293.13 366.776,286.001C 373.909,278.867 385.472,278.869 392.605,285.997C 399.735,293.13 399.736,304.695 392.605,311.826 Z M 463.833,339.027L 460.321,336.936C 461.299,333.265 461.392,329.363 460.504,325.568L 463.752,323.705C 465.933,322.457 466.693,319.653 465.448,317.475L 463.473,314.028C 462.228,311.846 459.419,311.085 457.24,312.332L 454.088,314.139C 451.209,311.307 447.685,309.308 443.904,308.255C 443.907,308.205 443.92,308.158 443.919,308.111L 443.872,304.141C 443.839,301.626 441.761,299.597 439.245,299.63L 435.275,299.678C 432.764,299.708 430.735,301.79 430.764,304.304L 430.828,308.388C 429.151,308.896 427.507,309.589 425.92,310.495C 425.492,310.741 425.108,311.032 424.701,311.298L 419.813,308.579C 419.685,308.51 419.545,308.475 419.415,308.41C 420.248,305.157 420.691,301.751 420.691,298.238C 420.691,295.056 420.319,291.961 419.632,288.986C 419.697,288.952 419.769,288.933 419.837,288.897L 425.875,285.512C 429.699,283.372 431.076,278.492 428.935,274.671L 425.549,268.632C 423.409,264.812 418.528,263.436 414.707,265.577L 408.669,268.96C 408.604,268.994 408.563,269.042 408.501,269.077C 403.792,264.424 397.963,260.908 391.452,258.961L 391.452,252.434C 391.452,248.053 387.869,244.471 383.487,244.471L 376.565,244.471C 372.184,244.471 368.601,248.053 368.601,252.434L 368.601,258.77C 361.82,260.673 355.752,264.265 350.881,269.077C 350.807,269.035 350.751,268.975 350.676,268.932L 344.625,265.57C 340.796,263.441 335.92,264.832 333.793,268.66L 330.429,274.708C 328.297,278.537 329.688,283.411 333.515,285.54L 339.568,288.904C 339.629,288.938 339.693,288.953 339.753,288.984C 339.068,291.96 338.692,295.056 338.692,298.238C 338.692,301.751 339.133,305.154 339.963,308.406C 339.825,308.475 339.68,308.513 339.543,308.59L 333.507,311.972C 329.684,314.115 328.309,318.993 330.451,322.814L 333.836,328.852C 335.976,332.674 340.853,334.049 344.675,331.908L 350.716,328.523C 350.997,328.367 351.235,328.167 351.488,327.981C 356.271,332.52 362.141,335.911 368.675,337.73C 368.652,337.977 368.601,338.214 368.601,338.466L 368.601,345.389C 368.601,349.77 372.184,353.354 376.565,353.354L 383.487,353.354C 387.869,353.354 391.452,349.77 391.452,345.389L 391.452,338.466C 391.452,338.15 391.4,337.85 391.359,337.544C 397.632,335.688 403.271,332.368 407.893,327.985C 408.161,328.18 408.413,328.388 408.707,328.551L 414.107,331.553C 414.152,333.264 414.373,334.98 414.805,336.672C 414.677,336.732 414.541,336.773 414.417,336.844L 410.972,338.817C 408.792,340.066 408.029,342.87 409.276,345.05L 411.247,348.497C 412.499,350.677 415.305,351.439 417.484,350.191L 420.929,348.22C 421.085,348.129 421.22,348.016 421.361,347.91C 424.071,350.503 427.332,352.364 430.831,353.415C 430.809,353.604 430.777,353.789 430.783,353.982L 430.831,357.952C 430.859,360.466 432.94,362.495 435.456,362.465L 439.423,362.417C 441.936,362.383 443.967,360.305 443.936,357.792L 443.887,353.821C 443.884,353.736 443.863,353.659 443.857,353.576C 445.713,353.061 447.532,352.313 449.285,351.312C 450.869,350.402 452.301,349.336 453.692,348.225L 457.096,350.266C 459.249,351.559 462.069,350.853 463.363,348.697L 465.403,345.292C 466.696,343.14 465.992,340.317 463.833,339.027 Z ");
        gIconsInfo.add("operationmanagement", "320 230 160 160");
        gIcons.add("systemoperationmanagement", "M 405.554,285.635C 402.351,288.839 397.153,288.839 393.949,285.634C 390.749,282.431 390.749,277.236 393.947,274.035C 397.153,270.829 402.351,270.829 405.554,274.031C 408.758,277.236 408.758,282.431 405.554,285.635 Z M 420.494,285.689L 417.778,284.177C 417.715,284.145 417.657,284.13 417.597,284.1C 417.971,282.638 418.17,281.109 418.17,279.533C 418.17,278.1 417.999,276.712 417.783,275.335L 420.498,273.814C 422.214,272.854 422.833,270.66 421.87,268.944L 420.353,266.23C 419.39,264.516 417.198,263.898 415.482,264.859L 412.694,266.432C 410.579,264.341 407.962,262.763 405.034,261.888L 405.034,258.954C 405.034,256.988 403.423,255.378 401.459,255.378L 398.349,255.378C 396.381,255.378 394.77,256.988 394.77,258.954L 394.77,261.803C 391.725,262.658 388.997,264.271 386.717,266.367L 383.998,264.857C 382.278,263.9 380.09,264.525 379.134,266.245L 377.622,268.962C 376.666,270.681 377.291,272.871 379.011,273.827L 381.81,275.374C 381.503,276.711 381.334,278.1 381.334,279.533C 381.334,281.109 381.535,282.638 381.906,284.099C 381.845,284.13 381.777,284.147 381.719,284.18L 379.003,285.701C 377.287,286.663 376.67,288.855 377.633,290.57L 379.151,293.283C 380.113,295.001 382.303,295.618 384.022,294.656L 386.734,293.135C 386.859,293.066 386.969,292.977 387.082,292.892C 389.229,294.93 391.869,296.454 394.803,297.271C 394.795,297.384 394.77,297.49 394.77,297.602L 394.77,300.711C 394.77,302.68 396.381,304.29 398.349,304.29L 401.459,304.29C 403.423,304.29 405.034,302.68 405.034,300.711L 405.034,297.602C 405.034,297.461 405.007,297.326 404.993,297.189C 407.81,296.354 410.343,294.862 412.419,292.893C 412.537,292.98 412.653,293.076 412.786,293.148L 415.503,294.66C 417.223,295.617 419.414,294.991 420.369,293.273L 421.881,290.555C 422.835,288.836 422.211,286.646 420.494,285.689 Z M 432.734,333.217L 427.733,333.217L 427.733,328.715L 432.734,328.715M 425.311,333.217L 420.309,333.217L 420.309,328.715L 425.311,328.715M 437.079,323.28L 362.427,323.28C 359.562,323.28 357.215,325.625 357.215,328.49L 357.215,332.358C 357.215,335.223 359.562,337.566 362.427,337.566L 437.079,337.566C 439.945,337.566 442.29,335.223 442.29,332.358L 442.29,328.49C 442.29,325.625 439.945,323.28 437.079,323.28 Z M 436.303,307.233C 436.303,308.077 435.627,308.598 435.149,308.598L 364.858,308.598C 364.37,308.598 363.699,308.077 363.695,307.233L 363.695,252.092C 363.699,251.245 364.37,250.727 364.858,250.723L 435.149,250.723C 435.627,250.727 436.303,251.242 436.303,252.092M 435.149,242.104L 364.858,242.104C 359.323,242.139 355.077,246.693 355.077,252.092L 355.077,307.233C 355.077,312.63 359.323,317.184 364.858,317.217L 435.149,317.217C 440.683,317.184 444.923,312.628 444.923,307.233L 444.923,252.092C 444.923,246.695 440.683,242.139 435.149,242.104 Z ");
        gIconsInfo.add("systemoperationmanagement", "340 230 130 130");
        gIcons.add("campaignoperationmanagement", "M 361.116,261.06L 361.116,219.751L 295.757,219.751L 295.14,219.689L 295.14,261.06C 295.142,262.174 296.028,262.967 296.864,262.967L 359.394,262.967C 360.23,262.967 361.113,262.18 361.116,261.06 Z M 288.854,212.034C 288.857,207.866 291.934,204.327 296.048,203.887L 296.061,203.783L 359.393,203.841C 363.911,203.87 367.393,207.599 367.395,212.034L 367.395,261.085C 367.393,265.518 363.911,269.249 359.393,269.273L 296.862,269.273C 292.428,269.249 288.983,265.651 288.858,261.324L 288.811,261.656L 288.854,212.034 Z M 349.352,211.059L 349.352,215.063L 353.805,215.063L 353.805,211.059L 349.352,211.059 Z M 355.958,211.059L 355.958,215.063L 360.409,215.063L 360.409,211.059L 355.958,211.059 Z M 318.53,225.643L 324.012,223.202L 325.761,227.131C 327.668,226.707 329.603,226.67 331.466,226.983L 333.007,222.967L 338.609,225.117L 337.067,229.133C 338.66,230.147 340.074,231.469 341.208,233.06L 345.136,231.311L 347.577,236.793L 343.648,238.542C 344.072,240.449 344.109,242.384 343.796,244.247L 347.812,245.788L 345.662,251.39L 341.646,249.848C 340.632,251.441 339.31,252.855 337.719,253.989L 339.468,257.917L 333.986,260.358L 332.237,256.429C 330.33,256.853 328.395,256.89 326.532,256.577L 324.991,260.593L 319.389,258.443L 320.931,254.427C 319.338,253.413 317.924,252.091 316.79,250.5L 312.862,252.249L 310.421,246.767L 314.35,245.018C 313.926,243.111 313.889,241.176 314.202,239.313L 310.186,237.772L 312.336,232.17L 316.352,233.712C 317.366,232.119 318.688,230.705 320.279,229.571L 318.53,225.643 Z M 325.338,233.558C 320.797,235.58 318.755,240.9 320.777,245.441C 322.799,249.981 328.119,252.024 332.66,250.002C 337.2,247.98 339.243,242.66 337.221,238.119C 335.199,233.579 329.879,231.536 325.338,233.558 Z ");
        gIconsInfo.add("campaignoperationmanagement", "280 190 110 110");
        gIcons.add("channeloperationmanagement", "M 461.57,300.266C 461.57,300.266 470.414,309.798 463.578,324.555C 463.578,324.555 445.928,359.386 406.842,363.365C 406.842,363.365 394.918,364.027 388.024,352.835C 388.024,352.835 383.296,346.657 389.525,343.102L 398.149,337.882C 398.149,337.882 405.616,332.895 408.961,339.397L 412.232,345.289C 412.232,345.289 415.05,349.305 419.509,347.469C 419.509,347.469 441.288,335.493 444.646,327.994C 444.646,327.994 446.756,323.063 443.406,319.718C 443.406,319.718 435.892,312.224 441.578,307.688L 451.813,297.277C 451.813,297.277 457.654,294.35 461.57,300.266 Z M 345.957,271.884C 345.96,280.452 350.513,288.426 358.533,294.524C 366.525,300.589 377.881,304.496 390.514,304.488C 392.314,304.564 392.985,305.087 393.675,305.439C 394.327,305.827 394.863,306.234 395.418,306.684C 396.513,307.58 397.654,308.661 398.873,309.859L 403.182,314.22C 402.881,312.502 402.622,310.767 402.61,309.031C 402.622,308.071 402.662,307.083 403.11,305.815C 403.485,304.613 404.818,302.759 406.889,302.199C 415.391,299.729 422.547,295.382 427.458,290.055C 432.381,284.708 435.073,278.511 435.078,271.884C 435.078,263.318 430.526,255.343 422.504,249.244C 414.509,243.183 403.149,239.271 390.514,239.281C 377.881,239.271 366.525,243.18 358.533,249.244C 350.513,255.343 345.96,263.318 345.957,271.884 Z M 392.002,315.986C 390.987,314.979 390.005,314.114 389.445,313.664C 375.355,313.447 362.545,309.064 352.987,301.847C 343.221,294.483 336.772,283.861 336.772,271.884C 336.772,259.907 343.221,249.285 352.987,241.921C 362.786,234.52 376.004,230.105 390.514,230.098C 405.026,230.105 418.247,234.52 428.045,241.921C 437.813,249.285 444.266,259.907 444.264,271.884C 444.271,281.091 440.425,289.574 434.203,296.288C 428.485,302.468 420.774,307.273 411.875,310.258C 412.006,311.395 412.271,312.973 412.573,314.564C 412.995,316.932 413.487,319.327 413.506,321.731C 413.501,322.497 413.461,323.286 413.225,324.225C 412.982,325.132 412.518,326.355 411.271,327.428C 410.455,328.132 409.315,328.599 408.23,328.707L 407.727,328.731C 405.961,328.658 405.271,328.148 404.575,327.798C 403.911,327.407 403.37,326.999 402.807,326.548C 401.701,325.648 400.55,324.566 399.326,323.363C 396.894,320.974 394.19,318.114 392.002,315.986 Z M 377.861,248.675L 385.465,245.289L 387.871,250.691C 390.515,250.099 393.196,250.04 395.775,250.462L 397.929,244.924L 405.679,247.86L 403.526,253.397C 405.728,254.787 407.68,256.601 409.244,258.788L 414.694,256.361L 418.05,263.899L 412.6,266.326C 413.179,268.951 413.221,271.616 412.78,274.182L 418.336,276.287L 415.332,284.011L 409.775,281.906C 408.363,284.105 406.525,286.058 404.315,287.627L 406.721,293.029L 399.116,296.415L 396.711,291.013C 394.066,291.605 391.385,291.664 388.806,291.243L 386.652,296.78L 378.902,293.844L 381.056,288.307C 378.853,286.917 376.901,285.103 375.337,282.916L 369.887,285.343L 366.531,277.805L 371.981,275.378C 371.402,272.753 371.36,270.088 371.802,267.522L 366.245,265.417L 369.25,257.693L 374.806,259.798C 376.218,257.599 378.056,255.646 380.266,254.077L 377.861,248.675 Z M 387.256,259.545C 380.956,262.35 378.103,269.686 380.883,275.931C 383.664,282.175 391.025,284.964 397.325,282.159C 403.625,279.354 406.478,272.018 403.698,265.773C 400.917,259.529 393.556,256.74 387.256,259.545 Z ");
        gIconsInfo.add("channeloperationmanagement", "310 220 190 190");
        gIcons.add("siteinvcampaignmanagement", "M 39.7163,17C 42.864,17 45.4158,19.6733 45.4158,22.971C 45.4158,26.2687 42.864,28.9421 39.7163,28.9421C 36.5686,28.9421 34.0168,26.2687 34.0168,22.971C 34.0168,19.6733 36.5686,17 39.7163,17 Z M 34.0168,36.4619C 33.2568,36.8599 32.0042,40.3243 32.6912,40.791L 28.9913,40.0779C 31.5083,39.1227 32.0124,37.5266 32.2168,34.6147L 32.023,32.8042C 32.8495,32.0834 34.0722,30.491 35.1566,30.491L 44.2757,30.491C 45.3841,30.491 46.3578,30.9849 47.1968,31.7327L 47.731,33.7937C 47.731,36.227 49.5004,36.9586 51.3496,38.1372L 48.7641,38.0806C 48.092,38.0555 47.4694,38.2139 46.8963,38.5023C 46.4109,37.6283 45.8106,36.6688 45.4157,36.4619L 45.5441,39.4848C 43.1312,41.8061 41.9248,46.1848 41.9248,46.1848L 41.512,48.443L 41.512,49.2127C 41.875,49.3199 42.2202,49.4674 42.5424,49.6501L 42.9935,47.3044C 42.9935,47.3044 45.2733,39.03 49.8328,39.2001L 58.9519,39.5403C 63.5116,39.7102 65.7913,48.1547 65.7913,48.1547L 66.9312,54.1683L 63.5116,55.2349C 63.1316,50.4439 62.3717,49.2214 62.3717,49.2214C 62.3717,49.2214 60.8518,45.9801 60.0919,45.5537L 60.5524,56.4163C 58.8197,57.0597 56.9343,57.378 54.9623,57.3044C 53.3804,57.2454 51.8542,56.9384 50.4178,56.4204C 50.4044,56.5926 50.308,56.7559 50.1454,56.8477L 49.7576,57.0675C 49.8636,57.515 49.8525,57.9752 49.7358,58.408L 50.1551,58.6546C 50.4129,58.8068 50.497,59.1396 50.3425,59.3934L 50.0989,59.795C 49.9445,60.0492 49.6078,60.1325 49.3506,59.9801L 48.9441,59.7393L 48.4179,60.1034L 47.7698,60.3703L 47.7733,60.3993L 47.7792,60.8675C 47.7828,61.1639 47.5404,61.409 47.2402,61.413L 46.7666,61.4186C 46.4661,61.4222 46.2176,61.1829 46.2143,60.8864L 46.2085,60.4183L 46.2143,60.3513C 45.7965,60.2275 45.407,60.0079 45.0835,59.7022L 45.0319,59.7388L 44.6205,59.9712C 44.3604,60.1184 44.0252,60.0285 43.8757,59.7714L 43.6404,59.3649C 43.4915,59.1079 43.5826,58.7772 43.8429,58.6299L 44.2543,58.3972L 44.3007,58.3769L 44.2172,57.7733L 43.5724,57.4193L 43.4753,57.3525C 42.9233,57.8694 42.25,58.2608 41.5009,58.4797L 41.512,58.5885L 41.512,59.4049C 41.512,59.9216 41.0842,60.3442 40.5609,60.3442L 39.7344,60.3442C 39.2112,60.3442 38.7834,59.9216 38.7834,59.4049L 38.7834,58.5885L 38.7922,58.5017C 38.012,58.2873 37.311,57.8872 36.7399,57.3521L 36.6477,57.416L 35.9263,57.8151C 35.47,58.0675 34.8876,57.9055 34.6321,57.4547L 34.2278,56.7428C 33.9904,56.3243 34.115,55.7984 34.4994,55.523C 34.0995,52.0977 33.5182,51.1841 33.5182,51.1841C 33.5182,51.1841 31.9982,47.9996 31.2383,47.6015L 31.6989,58.4469C 29.9661,59.155 28.0808,59.5436 26.1088,59.5436C 23.705,59.5436 21.43,58.9662 19.4031,57.9365L 19.8394,47.6015C 19.0794,47.9996 17.5596,51.1841 17.5596,51.1841C 17.5596,51.1841 16.7996,52.3783 16.4197,57.1551L 13,55.9609L 14.1399,49.9899C 14.1399,49.9899 16.4197,41.6305 20.9792,41.6306L 30.0983,41.6306C 34.658,41.6305 36.9378,49.9899 36.9378,49.9899L 36.9659,50.1375C 37.4898,49.7042 38.1069,49.3777 38.7834,49.1902L 38.7905,48.3287C 38.483,48.2977 38.1782,48.2571 37.8762,48.2074C 37.2512,46.4679 35.8887,43.3279 33.7888,41.8632L 34.0168,36.4619 Z M 25.5388,28.1397C 28.6866,28.1397 31.2383,30.813 31.2383,34.1107C 31.2383,37.4084 28.6866,40.0818 25.5388,40.0818C 22.3911,40.0818 19.8394,37.4084 19.8394,34.1107C 19.8394,30.813 22.3911,28.1397 25.5388,28.1397 Z M 54.3924,25.8793C 57.5401,25.9967 60.0919,28.7652 60.0919,32.0629C 60.0919,35.3606 57.5401,37.9388 54.3924,37.8214C 51.2447,37.704 48.6929,34.9355 48.6929,31.6378C 48.6929,28.3401 51.2447,25.7619 54.3924,25.8793 Z M 48.6929,45.1286C 47.933,45.4983 46.4132,48.6261 46.4132,48.6261C 46.4132,48.6261 46.1019,49.1036 45.7782,50.6959L 45.9879,51.0653C 46.2436,51.5159 46.0791,52.0914 45.6225,52.3438L 45.4959,52.4138C 45.4144,53.0303 45.3383,53.7398 45.2733,54.5546L 44.967,54.4362C 44.9414,54.6432 44.9024,54.846 44.8511,55.0441L 44.8987,55.064L 45.4823,55.3847L 45.6279,55.29L 46.2139,55.0415L 46.2063,54.5599C 46.2028,54.2634 46.4451,54.0178 46.7449,54.0144L 47.2191,54.0087C 47.5195,54.0048 47.7676,54.2441 47.7715,54.5407L 47.7771,55.0088L 47.7753,55.0257C 47.9442,55.0722 48.1088,55.1343 48.2666,55.2112L 48.6929,45.1286 Z M 41.8536,53.2328L 41.9441,52.7617C 41.8611,52.6339 41.7629,52.5128 41.6497,52.401C 40.798,51.5604 39.4172,51.5601 38.5654,52.4015C 37.7141,53.2422 37.7144,54.606 38.5656,55.4466C 39.4172,56.2877 40.798,56.2878 41.6497,55.4469C 42.2186,54.8851 42.4074,54.0898 42.2161,53.373L 41.8536,53.2328 Z M 48.1896,58.0432C 48.3708,57.3852 47.9774,56.7065 47.3108,56.527C 46.6445,56.3484 45.9571,56.7369 45.7764,57.3949C 45.5943,58.0533 45.9882,58.7319 46.6543,58.9111C 47.3208,59.0902 48.0083,58.7016 48.1896,58.0432 Z ");
        gIconsInfo.add("siteinvcampaignmanagement", "10 10 68 68");
        gIcons.add("timegapebmoperationmanagement", "M 42.1258,30.1447L 36.2883,30.1447C 35.5719,29.2408 34.5017,28.6444 33.2837,28.5767L 28.0288,21.0956C 27.2024,19.9193 25.5889,19.6465 24.4255,20.4824C 23.2669,21.3171 22.9929,22.9463 23.8192,24.1227L 29.0742,31.6069C 28.9685,31.9741 28.8929,32.3576 28.8929,32.7584C 28.8929,35.0812 30.755,36.9646 33.0518,36.9646C 34.3669,36.9646 35.5255,36.3335 36.2883,35.3704L 42.1258,35.3704C 43.5541,35.3704 44.7085,34.2028 44.7085,32.7584C 44.7085,31.3177 43.5541,30.1447 42.1258,30.1447 Z M 57.6586,27.7365L 56.8916,27.7365C 56.268,24.6801 55.0716,21.8376 53.4404,19.3105L 53.9842,18.7605C 54.3715,18.3677 54.5905,17.8352 54.5905,17.2765C 54.5905,16.7189 54.3715,16.1853 53.9842,15.7892L 49.8577,11.6166C 49.4661,11.2238 48.9396,11.0023 48.3872,11.0023C 47.836,11.0023 47.3084,11.2238 46.9168,11.6166L 46.3815,12.1622C 43.8821,10.5036 41.0717,9.28911 38.0457,8.65021L 38.0457,7.90005C 38.05,6.74065 37.1189,5.79844 35.9689,5.79844L 30.136,5.79844C 28.9855,5.79844 28.0579,6.74065 28.0579,7.90005L 28.0579,8.65021C 25.0329,9.28911 22.2215,10.4992 19.723,12.1582L 19.1879,11.6166C 18.7962,11.2238 18.2687,11.0023 17.7174,11.0023C 17.1651,11.0023 16.6386,11.2238 16.2459,11.6166L 12.1205,15.7892C 11.7332,16.181 11.5142,16.7189 11.5142,17.2765C 11.5142,17.8352 11.7332,18.3677 12.1205,18.7605L 12.6642,19.3105C 11.033,21.8376 9.83663,24.6769 9.21308,27.7365L 8.44604,27.7365C 7.29924,27.7365 6.36822,28.6793 6.36822,29.8381L 6.36822,35.737C 6.36822,36.8969 7.29924,37.8391 8.44604,37.8391L 9.22494,37.8391C 9.85713,40.8863 11.0546,43.7211 12.689,46.2396L 12.1205,46.8114C 11.3114,47.6341 11.3114,48.9632 12.1205,49.7859L 16.2459,53.9596C 16.6386,54.3514 17.1651,54.5729 17.7174,54.5729C 18.2687,54.5729 18.7962,54.3514 19.1879,53.9553L 19.7564,53.3791C 22.2474,55.0246 25.0448,56.2315 28.0579,56.8665L 28.0579,57.6718C 28.0579,58.835 28.9855,59.7778 30.136,59.7778L 35.9689,59.7778C 37.1189,59.7778 38.05,58.835 38.05,57.6718L 38.05,56.8665C 41.0588,56.2315 43.8573,55.0246 46.3483,53.3791L 46.9168,53.9553C 47.3084,54.3514 47.836,54.5729 48.3872,54.5729C 48.9396,54.5729 49.4661,54.3514 49.8577,53.9596L 53.9842,49.7859C 54.7976,48.9632 54.7976,47.6341 53.9842,46.8114L 53.4189,46.2396C 55.0544,43.7211 56.2465,40.8863 56.8786,37.8391L 57.6586,37.8391C 58.8087,37.8391 59.7364,36.8969 59.7364,35.737L 59.7364,29.8381C 59.7364,28.6793 58.8043,27.7365 57.6586,27.7365 Z M 34.7757,50.3315L 34.7757,48.8311C 34.7757,47.8676 34.0044,47.0885 33.0518,47.0885C 32.1003,47.0885 31.3332,47.8676 31.3332,48.8311L 31.3332,50.3315C 23.0727,49.5087 16.4908,42.8515 15.6774,34.5006L 17.1608,34.5006C 18.1134,34.5006 18.8847,33.7216 18.8847,32.7584C 18.8847,31.7946 18.1134,31.014 17.1608,31.014L 15.6774,31.014C 16.4908,22.6647 23.0727,16.0064 31.3332,15.1836L 31.3332,16.684C 31.3332,17.6475 32.1003,18.4277 33.0518,18.4277C 34.0044,18.4277 34.7757,17.6475 34.7757,16.684L 34.7757,15.1836C 43.0309,16.0064 49.6139,22.6647 50.4271,31.014L 48.9437,31.014C 47.9913,31.014 47.22,31.7993 47.22,32.7584C 47.22,33.7216 47.9913,34.5006 48.9437,34.5006L 50.4271,34.5006C 49.6139,42.8515 43.0309,49.5087 34.7757,50.3315 Z ");
        gIcons.add("realtimeebmoperationmanagement", "M 681.18,500.853C 669.078,627.164 570.345,728.686 448.404,740.298C 304.259,754.026 181.344,644.172 167.088,501.382L 141.684,501.382C 126.237,501.382 116.584,484.05 124.311,470.186L 181.124,368.199C 188.847,354.338 208.151,354.338 215.874,368.202L 272.676,470.19C 280.4,484.05 270.749,501.382 255.304,501.382L 233.188,501.382C 247.555,607.991 343.303,687.943 453.083,671.266C 534.315,658.927 600.209,592.49 614.018,508.595C 634.683,383.03 541.468,273.746 424.093,273.746C 386.033,273.746 349.297,285.192 317.737,306.872C 303.091,316.932 282.789,314.942 272.045,300.533C 260.347,284.841 263.999,262.446 279.599,251.525C 313.458,227.817 351.841,213.002 392.056,207.842L 392.056,169.184L 365.734,169.184C 356.679,169.184 349.337,161.575 349.337,152.188L 349.337,135.062C 349.337,125.675 356.679,118.066 365.734,118.066L 487.793,118.066C 496.849,118.066 504.189,125.675 504.189,135.062L 504.189,152.188C 504.189,161.575 496.849,169.184 487.793,169.184L 458.802,169.184L 458.802,208.245C 593.283,227.052 695.304,353.429 681.18,500.853 Z M 689.673,243.623L 640.23,196.256C 633.582,189.883 623.205,190.305 617.061,197.2L 603.982,211.867C 597.834,218.758 598.242,229.515 604.893,235.884L 654.332,283.255C 660.984,289.628 671.357,289.206 677.505,282.311L 690.584,267.643C 696.731,260.749 696.321,249.996 689.673,243.623 Z M 423.319,308.687L 423.319,474.922L 582.084,474.922C 582.084,373.685 507.989,308.687 423.319,308.687 Z ");
        gIconsInfo.add("realtimeebmoperationmanagement", "100 100 900 900");

        //'predictiveanalysis
        gIcons.add("predictiveanalysis", "M 472.455,403.933L 472.455,402.305L 472.455,400.676L 551.546,400.676C 553.743,400.676 555.434,398.975 555.436,397.07L 555.436,339.255C 555.434,337.346 553.743,335.65 551.546,335.648L 472.455,335.648C 470.258,335.65 468.567,337.349 468.563,339.255L 468.563,397.07C 468.567,398.975 470.258,400.676 472.455,400.676L 472.455,402.305L 472.455,403.933C 468.578,403.925 465.326,400.921 465.307,397.07L 465.307,339.255C 465.326,335.401 468.578,332.401 472.455,332.393L 551.546,332.393C 555.423,332.401 558.675,335.401 558.691,339.255L 558.691,397.07C 558.675,400.921 555.426,403.925 551.546,403.933L 472.455,403.933 Z M 542.081,431.001L 481.92,431.001L 481.92,418.209L 542.081,418.209M 459.632,406.673L 459.632,329.652C 459.635,328.356 460.745,327.245 462.048,327.243L 561.957,327.243C 563.253,327.245 564.364,328.354 564.367,329.652L 564.367,406.673C 564.364,407.972 563.253,409.083 561.957,409.085L 462.048,409.085C 460.748,409.083 459.635,407.969 459.632,406.673 Z M 561.957,418.208C 568.329,418.191 573.472,413.046 573.491,406.673L 573.491,329.652C 573.472,323.28 568.329,318.135 561.957,318.118L 462.048,318.118C 455.672,318.135 450.527,323.277 450.509,329.652L 450.509,406.673C 450.527,413.048 455.672,418.191 462.048,418.208L 470.439,418.208L 470.439,431.001L 456.939,431.001C 453.891,431.001 451.423,433.345 451.423,436.24C 451.423,439.135 453.891,441.48 456.939,441.48L 567.06,441.48C 570.107,441.48 572.579,439.135 572.579,436.24C 572.579,433.345 570.107,431.001 567.06,431.001L 553.561,431.001L 553.561,418.208L 561.957,418.208 Z M 518.193,387.729C 518.193,389.503 516.322,390.954 514.032,390.954L 511.407,390.954C 509.118,390.954 507.247,389.503 507.247,387.729L 507.247,372.724C 507.247,370.95 509.118,369.497 511.407,369.497L 514.032,369.497C 516.322,369.497 518.193,370.95 518.193,372.724L 518.193,387.729 Z M 535.938,387.729C 535.938,389.503 534.068,390.954 531.778,390.954L 529.151,390.954C 526.862,390.954 524.99,389.503 524.99,387.729L 524.99,363.697C 524.99,361.923 526.862,360.471 529.151,360.471L 531.778,360.471C 534.068,360.471 535.938,361.923 535.938,363.697L 535.938,387.729 Z M 500.45,387.729C 500.45,389.503 498.577,390.954 496.289,390.954L 493.662,390.954C 491.374,390.954 489.502,389.503 489.502,387.729L 489.502,380.755C 489.502,378.981 491.374,377.53 493.662,377.53L 496.289,377.53C 498.577,377.53 500.45,378.981 500.45,380.755L 500.45,387.729 Z M 540.375,345.603C 540.859,344.605 540.14,343.885 538.775,344.001L 525.126,345.154C 523.759,345.268 523.357,346.036 524.229,346.859L 525.769,348.313C 526.643,349.135 526.513,350.386 525.488,351.092L 513.745,359.164C 512.719,359.87 511.083,359.833 510.113,359.079L 504.889,355.03C 503.918,354.276 502.316,354.266 501.327,355.005L 481.635,369.736C 480.646,370.475 480.618,371.707 481.571,372.473C 482.528,373.238 484.114,373.262 485.104,372.522L 501.263,360.431C 502.253,359.693 503.856,359.703 504.827,360.456L 509.907,364.395C 510.879,365.147 512.514,365.185 513.542,364.479L 528.659,354.085C 529.688,353.378 531.241,353.473 532.112,354.296L 533.299,355.415C 534.171,356.238 535.279,356.095 535.765,355.099L 540.375,345.603 Z ");
        gIcons.add("modelgenerate", "M 18,40L 36,40L 36,58L 18,58L 18,40 Z M 40,58L 40,40L 58,40L 58,58L 40,58 Z M 40,36L 40,18L 58,18L 58,36L 40,36 Z M 29,36L 25,36L 25,29L 18,29L 18,25L 25,25L 25,18L 29,18L 29,25L 36,25L 36,29L 29,29L 29,36 Z ");
        gIcons.add("predictiveanalysisperformance", "M 244.16,367.993L 346.945,367.993C 348.288,367.993 349.486,367.529 350.378,366.792L 350.378,364.803L 351.504,365.439C 351.823,364.854 352,364.208 352.001,363.541L 352.001,292.14C 351.998,289.784 349.801,287.689 346.945,287.686L 244.16,287.686C 241.305,287.689 239.108,289.787 239.102,292.14L 239.102,363.541C 239.108,365.893 241.305,367.993 244.16,367.993 Z M 244.16,372.016C 239.121,372.007 234.895,368.296 234.871,363.541L 234.871,292.14C 234.895,287.382 239.121,283.677 244.16,283.666L 346.945,283.666C 351.984,283.677 356.21,287.382 356.231,292.14L 356.231,363.541C 356.224,364.98 355.833,366.323 355.151,367.497L 363.607,372.268L 363.607,280.28C 363.603,278.677 362.16,277.309 360.476,277.305L 230.636,277.305C 228.943,277.309 227.499,278.68 227.496,280.28L 227.496,375.399C 227.499,377 228.946,378.375 230.636,378.378L 350.378,378.378L 350.378,371.41C 349.311,371.799 348.151,372.014 346.945,372.016L 244.16,372.016 Z M 334.645,405.443L 334.645,389.646L 256.461,389.646L 256.461,405.443L 334.645,405.443 Z M 349.564,389.644L 349.564,405.443L 350.378,405.443L 350.378,389.644L 349.564,389.644 Z M 223.996,418.384C 220.035,418.384 216.827,415.488 216.827,411.914C 216.827,408.338 220.035,405.443 223.996,405.443L 241.54,405.443L 241.54,389.644L 230.636,389.644C 222.349,389.623 215.663,383.272 215.64,375.399L 215.64,280.28C 215.663,272.408 222.349,266.057 230.636,266.037L 360.476,266.037C 368.757,266.057 375.44,272.412 375.464,280.28L 375.464,375.399C 375.461,376.544 375.316,377.658 375.046,378.724L 405.881,396.124L 405.881,398.533L 350.378,429.051L 350.378,418.384L 223.996,418.384 Z M 303.747,353.239C 303.747,355.536 301.479,357.415 298.703,357.415L 295.521,357.415C 292.746,357.415 290.478,355.536 290.478,353.239L 290.478,333.814C 290.478,331.516 292.746,329.636 295.521,329.636L 298.703,329.636C 301.479,329.636 303.747,331.516 303.747,333.814L 303.747,353.239 Z M 325.258,353.239C 325.258,355.536 322.99,357.415 320.214,357.415L 317.03,357.415C 314.255,357.415 311.986,355.536 311.986,353.239L 311.986,322.127C 311.986,319.831 314.255,317.95 317.03,317.95L 320.214,317.95C 322.99,317.95 325.258,319.831 325.258,322.127L 325.258,353.239 Z M 282.239,353.239C 282.239,355.536 279.969,357.415 277.195,357.415L 274.011,357.415C 271.237,357.415 268.968,355.536 268.968,353.239L 268.968,344.211C 268.968,341.914 271.237,340.035 274.011,340.035L 277.195,340.035C 279.969,340.035 282.239,341.914 282.239,344.211L 282.239,353.239 Z M 330.636,298.701L 325.048,310.996C 324.459,312.285 323.115,312.47 322.058,311.405L 320.619,309.956C 319.564,308.891 317.681,308.768 316.434,309.683L 298.109,323.139C 296.863,324.053 294.881,324.004 293.702,323.03L 287.545,317.931C 286.367,316.956 284.425,316.943 283.225,317.899L 263.636,333.552C 262.437,334.51 260.514,334.48 259.355,333.488C 258.199,332.496 258.234,330.902 259.432,329.945L 283.303,310.874C 284.501,309.917 286.442,309.93 287.621,310.906L 293.952,316.149C 295.128,317.124 297.111,317.173 298.356,316.258L 312.59,305.809C 313.832,304.894 313.99,303.275 312.931,302.21L 311.063,300.328C 310.007,299.263 310.495,298.269 312.151,298.12L 328.697,296.628C 330.35,296.479 331.223,297.411 330.636,298.701 Z ");
        gIcons.add("ddma1", "M 366.365,337.828C 366.255,336.389 364.903,335.305 363.359,335.426L 350.309,336.42C 348.765,336.539 347.592,337.814 347.703,339.255C 347.813,340.699 349.167,341.779 350.709,341.661L 363.757,340.665C 365.303,340.546 366.476,339.272 366.365,337.828 Z M 361.616,311.126C 363.16,311.005 364.333,309.731 364.223,308.288C 364.113,306.85 362.76,305.766 361.216,305.885L 348.168,306.88C 346.624,306.999 345.451,308.272 345.56,309.715C 345.671,311.158 347.024,312.239 348.568,312.122M 359.305,280.78C 360.852,280.66 362.023,279.385 361.912,277.941C 361.805,276.504 360.452,275.419 358.905,275.54L 345.86,276.535C 344.312,276.654 343.143,277.928 343.253,279.37C 343.364,280.812 344.712,281.893 346.26,281.776M 437.36,326.676L 431.975,325.86L 427.007,260.828C 426.616,255.695 422.092,251.816 416.959,252.208L 390.219,254.251L 392.219,241.048L 433.483,247.3L 431.327,261.443L 446.683,263.768M 380.259,287.119L 378.855,268.738L 416.979,265.826L 418.383,284.207M 456.643,260.594L 456.697,260.228L 456.337,260.173L 441.263,239.412L 441.329,238.976L 384.331,230.344L 380.597,254.987L 355.781,256.883C 350.648,257.276 346.767,261.796 347.16,266.931L 347.673,273.669L 356.717,272.979C 358.135,271.131 360.271,269.856 362.78,269.665C 367.487,269.305 371.589,272.826 371.949,277.527C 372.311,282.234 368.787,286.339 364.084,286.697C 361.58,286.889 359.265,285.959 357.585,284.35L 348.541,285.04L 349.963,303.628L 359.005,302.938C 360.423,301.092 362.561,299.816 365.072,299.624C 369.776,299.266 373.881,302.784 374.239,307.488C 374.599,312.191 371.079,316.298 366.372,316.658C 363.868,316.848 361.555,315.916 359.873,314.305L 350.831,314.996L 352.255,333.587L 361.295,332.898C 362.712,331.049 364.851,329.775 367.36,329.58C 372.064,329.223 376.169,332.743 376.531,337.445C 376.888,342.15 373.367,346.255 368.66,346.615C 366.157,346.808 363.845,345.878 362.165,344.264L 353.121,344.959L 353.72,352.812C 354.113,357.945 358.635,361.826 363.768,361.431L 424.947,356.759C 430.083,356.365 433.96,351.844 433.567,346.707L 432.709,335.482L 445.279,337.384L 456.62,260.743L 456.747,260.738L 456.643,260.594 Z ");
        gIcons.add("datasimulation", "M 30.6982,3.32733L 17.7598,3.32733L 17.7598,11.9067L 30.694,11.9067L 30.694,3.32733M 29.7163,10.9593L 18.7417,10.9593L 18.7417,4.27369L 29.7163,4.27369M 26.3552,5.0978L 29.0194,5.0978L 29.0194,5.57149L 26.3552,5.57149L 26.3552,5.0978 Z M 26.3386,5.88218L 29.0021,5.88218L 29.0021,6.35587L 26.3386,6.35587L 26.3386,5.88218 Z M 26.3597,6.72973L 29.0279,6.72973L 29.0279,7.20341L 26.3597,7.20341L 26.3597,6.72973 Z M 20.0943,7.19119L 20.1154,7.19934L 20.1977,7.38169L 20.1893,7.40206C 19.9454,7.93075 19.9581,7.94705 20.0035,7.98677L 20.3825,8.31275C 20.3994,8.31275 20.4533,8.31275 20.9358,8.10596L 20.9527,8.09374L 21.1501,8.17422L 21.1586,8.1895C 21.3856,8.72736 21.4059,8.72736 21.4637,8.72736L 21.9219,8.72736C 21.979,8.72736 21.9998,8.72736 22.2102,8.1895L 22.2186,8.17014L 22.4161,8.09374L 22.433,8.10189C 22.7582,8.2333 22.944,8.30155 23.0515,8.2771L 23.3811,7.97048C 23.4192,7.93075 23.435,7.91547 23.1795,7.39798L 23.171,7.37761L 23.2536,7.19526L 23.2703,7.18711C 23.8434,6.97217 23.8434,6.9518 23.8434,6.89679L 23.8434,6.46283C 23.8434,6.40681 23.8434,6.38338 23.2703,6.18779L 23.2492,6.18066L 23.171,5.9973L 23.1795,5.97692C 23.4227,5.44415 23.4065,5.42785 23.3653,5.3922L 22.9852,5.06622C 22.9651,5.06622 22.9113,5.06622 22.433,5.27301L 22.4119,5.28116L 22.2144,5.20578L 22.206,5.1854C 21.9832,4.64856 21.9589,4.64856 21.9051,4.64856L 21.4468,4.64856C 21.3898,4.64856 21.3645,4.64856 21.1543,5.18948L 21.1461,5.20578L 20.9527,5.28524L 20.9316,5.27709C 20.6095,5.1416 20.4205,5.07844 20.3128,5.0978L 19.9876,5.40442C 19.9454,5.44415 19.9296,5.46045 20.1851,5.981L 20.1935,6.00137L 20.1154,6.18371L 20.0943,6.19187C 19.5252,6.40681 19.5252,6.42718 19.5252,6.48219L 19.5252,6.91207C 19.5252,6.96809 19.5252,6.99153 20.0943,7.19119 Z M 21.6823,5.98507C 22.0909,5.98507 22.4245,6.30392 22.4245,6.69C 22.4245,7.07506 22.0909,7.38983 21.6823,7.38983C 21.2739,7.38983 20.9398,7.07506 20.9398,6.69C 20.9398,6.30392 21.2739,5.98507 21.6823,5.98507 Z M 23.7816,8.52362L 23.6747,8.56335L 23.6662,8.5603C 23.4888,8.48797 23.3856,8.45231 23.3283,8.46454L 23.1505,8.6316L 23.2578,8.94535L 23.2618,8.95758L 23.2164,9.05741L 22.8948,9.21632L 22.8948,9.4547L 23.208,9.60648L 23.2206,9.61055L 23.2618,9.70936L 23.1588,10.0404L 23.3653,10.2187L 23.6662,10.1036L 23.6785,10.0995L 23.7857,10.1393L 23.9545,10.4459L 24.2064,10.4459L 24.3631,10.1515L 24.3673,10.1393L 24.475,10.0954L 24.4866,10.1036C 24.664,10.1749 24.7673,10.2116 24.8256,10.1994L 25.0029,10.0323L 24.891,9.71752L 24.8868,9.70631L 24.9322,9.60648L 25.2542,9.44349L 25.2542,9.20818L 24.9406,9.05741L 24.9322,9.05334L 24.8868,8.95351L 24.9903,8.62345L 24.7833,8.44417C 24.7759,8.44417 24.7426,8.44417 24.4824,8.55622L 24.475,8.56335L 24.3673,8.51955L 24.1942,8.21802L 23.9471,8.21802C 23.9136,8.21802 23.9017,8.21802 23.7857,8.51242M 24.0744,8.94943C 24.3008,8.94943 24.4786,9.12057 24.4786,9.33143C 24.4786,9.5423 24.2976,9.71344 24.0744,9.71344C 23.8521,9.71344 23.6704,9.5423 23.6704,9.33143C 23.6704,9.12057 23.8521,8.94943 24.0744,8.94943 Z M 24.2184,7.50494L 24.2269,7.50494L 24.2554,7.56912L 24.1857,7.77999L 24.3177,7.8951L 24.512,7.82379L 24.5194,7.81971L 24.5859,7.84722L 24.6967,8.03873L 24.8541,8.03873L 24.9575,7.85129L 24.9575,7.84315L 25.0272,7.81971L 25.0354,7.81971C 25.1465,7.86759 25.213,7.89102 25.25,7.88287L 25.3609,7.77591L 25.2912,7.57727L 25.2912,7.56912L 25.3155,7.50494L 25.5224,7.40206L 25.5224,7.25027L 25.3239,7.15554L 25.3155,7.15554L 25.2912,7.08728L 25.3566,6.87642L 25.2247,6.76538L 25.0313,6.83669L 25.0272,6.84076L 24.9575,6.81326L 24.8498,6.62175L 24.6893,6.62175L 24.5901,6.80511L 24.5859,6.81326L 24.5162,6.84076L 24.512,6.83669C 24.3958,6.79288 24.3304,6.76945 24.2976,6.77761L 24.1816,6.88457L 24.2522,7.08321L 24.2554,7.09136L 24.2269,7.15554L 24.021,7.25842L 24.021,7.41021L 24.2184,7.50494 Z M 24.7714,7.08728C 24.9153,7.08728 25.0313,7.19526 25.0313,7.32973C 25.0313,7.46522 24.9153,7.57319 24.7714,7.57319C 24.6313,7.57319 24.512,7.46522 24.512,7.32973C 24.512,7.19526 24.6313,7.08728 24.7714,7.08728 Z M 3.68734,21.25L 16.6258,21.25L 16.6258,12.6747L 3.68734,12.6747M 4.66928,13.6211L 15.6438,13.6211L 15.6438,20.3067L 4.66928,20.3067M 12.283,14.6357L 14.947,14.6357L 14.947,15.1094L 12.283,15.1094L 12.283,14.6357 Z M 12.2662,15.4201L 14.9343,15.4201L 14.9343,15.8938L 12.2662,15.8938L 12.2662,15.4201 Z M 12.2904,16.2717L 14.9544,16.2717L 14.9544,16.7454L 12.2904,16.7454L 12.2904,16.2717 Z M 5.4031,15.6625L 10.9833,15.6625L 10.9833,16.5498L 5.4031,16.5498L 5.4031,15.6625 Z M 5.4031,17.0072L 9.66348,17.0072L 9.66348,17.8945L 5.4031,17.8945L 5.4031,17.0072 Z M 5.4031,18.3529L 13.8045,18.3529L 13.8045,19.2401L 5.4031,19.2401L 5.4031,18.3529 Z M 17.7809,12.6421L 17.7809,21.2215L 30.7193,21.2215L 30.7193,12.6421M 29.7374,20.2751L 18.7618,20.2751L 18.7618,13.5895L 29.7374,13.5895M 26.3755,14.3698L 29.0395,14.3698L 29.0395,14.8435L 26.3755,14.8435L 26.3755,14.3698 Z M 26.3597,15.1532L 29.0236,15.1532L 29.0236,15.6269L 26.3597,15.6269L 26.3597,15.1532 Z M 26.3798,16.0048L 29.0479,16.0048L 29.0479,16.4785L 26.3798,16.4785L 26.3798,16.0048 Z M 23.1588,19.0333C 23.3695,18.8306 23.699,17.7834 23.699,17.7834C 23.699,17.7834 22.6146,18.1064 22.4076,18.305C 22.1978,18.5077 22.1978,18.8337 22.4076,19.0333C 22.6146,19.232 22.9525,19.232 23.1588,19.0333 Z M 19.4713,19.8055L 26.1243,19.8055L 26.1243,19.3553L 26.1327,19.3196C 26.1327,19.2717 26.1369,18.8306 26.1369,18.7828C 26.1369,17.2028 24.9694,16.3389 24.9694,16.3389C 24.3874,15.8581 23.6293,15.5637 22.8004,15.5637C 20.9601,15.5637 19.4671,17.0041 19.4671,18.7828C 19.4671,18.8306 19.4713,19.2758 19.4755,19.3196L 19.4755,19.8055M 20.2759,18.8337L 20.9601,18.8337L 20.9601,18.6228L 20.3255,18.6228L 20.2759,18.6228C 20.3044,18.0697 20.5229,17.5165 20.9316,17.0836L 20.9527,17.0673L 20.9812,17.0917L 21.4384,17.5288L 21.5788,17.3933L 21.0963,16.9237C 21.5334,16.5386 22.0909,16.3196 22.6843,16.2951L 22.7298,16.3033L 22.7298,16.9522L 22.9113,16.9522L 22.9113,16.2951C 23.0021,16.2951 23.0929,16.3074 23.1835,16.3196C 23.6905,16.3868 24.1656,16.5977 24.5447,16.9359L 24.0622,17.4014L 24.1984,17.5288L 24.6598,17.0836L 24.6893,17.0632L 24.7096,17.0917C 25.1096,17.5135 25.3408,18.0503 25.3654,18.6228L 24.6809,18.6228L 24.6809,18.8337L 25.3695,18.8337L 25.3654,19.3196L 20.2759,19.3196C 20.2759,19.2921 20.2801,18.8663 20.2759,18.8337 Z M 28.6319,19.0048C 28.6319,19.4113 28.2898,19.7413 27.8643,19.7413C 27.4441,19.7413 27.102,19.4113 27.102,19.0048C 27.102,18.5953 27.4441,18.2653 27.8643,18.2653C 28.2898,18.2653 28.6319,18.5953 28.6319,19.0048 Z M 20.9068,14.4177C 20.9068,14.704 20.6676,14.9342 20.3709,14.9342C 20.0742,14.9342 19.8345,14.704 19.8345,14.4177C 19.8345,14.1345 20.0742,13.9002 20.3709,13.9002C 20.6676,13.9002 20.9068,14.1345 20.9068,14.4177 Z M 22.6473,14.4208C 22.6473,14.704 22.4076,14.9383 22.1109,14.9383C 21.8143,14.9383 21.575,14.704 21.575,14.4208C 21.575,14.1345 21.8143,13.9002 22.1109,13.9002C 22.4076,13.9002 22.6473,14.1345 22.6473,14.4208 Z M 24.3874,14.4208C 24.3874,14.704 24.1445,14.9383 23.8521,14.9383C 23.5547,14.9383 23.3155,14.704 23.3155,14.4208C 23.3155,14.1345 23.5547,13.9002 23.8521,13.9002C 24.1445,13.9002 24.3874,14.1345 24.3874,14.4208 Z M 3.71585,11.9342L 16.6543,11.9342L 16.6543,3.35484L 3.71585,3.35484M 4.69779,4.30221L 15.6734,4.30221L 15.6734,10.9868L 4.69779,10.9868M 9.06586,5.30052L 8.61607,6.6462C 9.02046,6.76538 9.31293,7.12701 9.31293,7.55689C 9.31293,7.76776 9.23903,7.9664 9.11549,8.12634L 10.2695,8.98916C 10.5874,8.5878 10.7732,8.09374 10.7732,7.55689C 10.7732,6.50256 10.0552,5.60714 9.06586,5.30052 Z M 8.08814,8.56742C 7.54332,8.56742 7.10197,8.13754 7.10197,7.61292C 7.10197,7.09136 7.54332,6.66147 8.08814,6.66147C 8.18739,6.66147 8.28559,6.67777 8.38061,6.70528L 8.83041,5.36469C 8.59495,5.28931 8.34366,5.25264 8.08814,5.25264C 6.73559,5.25264 5.63856,6.31105 5.63856,7.61292C 5.63856,8.91785 6.73559,9.97626 8.08814,9.97626C 8.88003,9.97626 9.58534,9.61055 10.0351,9.04519L 8.87581,8.18542C 8.6942,8.41666 8.41018,8.56742 8.08814,8.56742 Z M 12.3116,5.32089L 14.9797,5.32089L 14.9797,5.7905L 12.3116,5.7905L 12.3116,5.32089 Z M 12.2947,6.10018L 14.9628,6.10018L 14.9628,6.57387L 12.2947,6.57387L 12.2947,6.10018 Z M 12.32,6.9518L 14.9882,6.9518L 14.9882,7.42549L 12.32,7.42549L 12.32,6.9518 Z M 13.5163,7.9664L 13.5163,8.66318C 13.776,8.67133 13.9861,8.87812 13.9861,9.13279C 13.9861,9.39154 13.7676,9.60648 13.4994,9.60648C 13.2312,9.60648 13.0084,9.39154 13.0126,9.1165L 12.2873,9.1165L 12.2873,9.13279C 12.2873,9.77762 12.831,10.3022 13.4994,10.3022C 14.1678,10.3022 14.7115,9.77762 14.7115,9.13279C 14.7115,8.49611 14.1762,7.97456 13.5163,7.9664 Z ");
        gIcons.add("customergroupgeneratevariableanalysis", "M 55.4167,44.3333L 60.9583,51.4583L 55.4167,58.5833L 49.0833,58.5833L 53.1736,53.8333L 45.9167,53.8333L 45.9167,49.0833L 53.1736,49.0833L 49.0833,44.3333L 55.4167,44.3333 Z M 33.25,15.8333C 37.6222,15.8333 41.1667,19.3778 41.1667,23.75C 41.1667,28.1223 37.6222,31.6667 33.25,31.6667C 28.8777,31.6667 25.3333,28.1223 25.3333,23.75C 25.3333,19.3778 28.8778,15.8333 33.25,15.8333 Z M 25.3333,42.75C 24.2778,43.2778 22.1667,47.4999 22.1667,47.4999C 22.1667,47.4999 21.1111,49.0833 20.5833,55.4166L 15.8333,53.8333L 17.4167,45.9167C 17.4167,45.9167 20.5833,34.8333 26.9166,34.8335L 39.5832,34.8335C 43.8014,34.8334 46.6149,39.7498 48.0237,43.0338L 44.3334,47.5C 44.3334,47.5 42.2222,43.2778 41.1666,42.75L 41.8064,57.1293C 39.3996,58.0681 36.7808,58.5833 34.0416,58.5833C 30.7028,58.5833 27.5427,57.8178 24.7274,56.4526L 25.3333,42.75 Z M 45.9166,55.4167L 45.8809,55.004L 46.0833,55.3611L 45.9166,55.4167 Z ");
        gIconsInfo.add("d3fprocess", "10 10 60 60");
        gIcons.add("simulatoroperationmanagement", "M 28.0194,6.13147L 18.0968,6.13147L 18.0968,5.06622L 15.4659,5.06622L 15.4659,6.13147L 5.37178,6.13147L 5.37178,7.41618L 6.04167,7.41618L 6.04167,20.0792L 15.7421,20.0792L 15.7421,22.4393L 10.3904,28.1647L 12.311,28.1647L 15.9248,24.2949L 15.9248,28.1647L 17.0324,28.1647L 17.0324,24.2986L 20.6387,28.1647L 22.5924,28.1647L 17.2076,22.4393L 17.2076,20.0792L 28.0194,20.0792L 28.0194,7.41618L 28.4424,7.41618L 28.4424,6.13147M 27.0724,19.1353L 6.98868,19.1353L 6.98868,7.41618L 27.0724,7.41618M 13.136,12.6089L 13.136,12.716L 13.1434,16.0419L 13.6095,16.2387L 14.7961,15.6373L 14.7961,15.0294L 14.7924,10.7089L 13.4196,10.2198L 12.1642,10.7089L 12.1642,12.2582L 13.036,12.5695M 14.9429,10.6021L 14.9429,10.7089L 14.9502,15.0944L 15.4155,15.2866L 16.602,14.6861L 16.5983,8.99234L 15.2255,8.50331L 13.9748,8.99234L 13.9748,10.2552L 14.8419,10.5667M 11.3182,15.0257L 11.3218,15.1328L 11.3255,16.9674L 11.8027,17.1679L 12.9892,16.5674L 12.9819,12.716L 12.1642,12.423L 11.6127,12.2224L 10.3583,12.7123L 10.3583,14.6787L 11.2181,14.9864M 11.1713,17.4508L 11.1713,16.9034L 11.1677,15.1328L 9.79485,14.6394L 8.5441,15.1301L 8.5441,17.4508L 9.98481,18.0477M 18.8787,9.03574L 25.9902,9.03574L 25.9902,9.67895L 18.8787,9.67895L 18.8787,9.03574 Z M 18.8787,10.48L 25.9902,10.48L 25.9902,11.1203L 18.8787,11.1203L 18.8787,10.48 Z M 18.8787,11.8929L 25.9902,11.8929L 25.9902,12.5329L 18.8787,12.5329L 18.8787,11.8929 Z M 18.8787,13.3346L 25.9902,13.3346L 25.9902,13.9784L 18.8787,13.9784L 18.8787,13.3346 Z M 23.1696,14.7538L 25.9902,14.7538L 25.9902,15.3937L 23.1696,15.3937L 23.1696,14.7538 Z M 23.1696,16.1957L 25.9902,16.1957L 25.9902,16.8356L 23.1696,16.8356L 23.1696,16.1957 Z M 18.8787,14.7538L 22.5961,14.7538L 22.5961,16.8384L 18.8787,16.8384L 18.8787,14.7538 Z ");

        //'BRMS
        gIcons.add("brmsruledefine", "M 29.864,16.3747L 29.864,10.6667L 27.7347,10.6667L 27.7347,8.53067L 29.864,8.53067L 29.864,0L 0,0L 0,8.53067L 2.136,8.53067L 2.136,10.6667L 0,10.6667L 0,19.1973L 2.136,19.1973L 2.136,21.3333L 0,21.3333L 0,29.864L 16.3747,29.864C 18.0213,31.1973 20.12,32 22.4013,32C 27.7027,32 32,27.7027 32,22.4013C 32,20.1147 31.1973,18.0213 29.864,16.3747 Z M 12.864,21.3333L 4.26533,21.3333L 4.26533,19.1973L 13.36,19.1973C 13.1147,19.88 12.9427,20.5933 12.864,21.3333 Z M 25.5987,10.6667L 4.26533,10.6667L 4.26533,8.53067L 25.5987,8.53067M 2.136,4.26533L 6.40134,4.26533L 6.40134,6.40133L 2.136,6.40133M 2.136,14.932L 6.40134,14.932L 6.40134,17.068L 2.136,17.068M 6.40134,27.7347L 2.136,27.7347L 2.136,25.5987L 6.40134,25.5987M 22.4013,29.74C 18.344,29.7347 15.068,26.4533 15.0573,22.4013C 15.068,18.344 18.344,15.068 22.4013,15.0573C 26.4531,15.068 29.7347,18.344 29.74,22.4013C 29.7347,26.4533 26.4531,29.7347 22.4013,29.74 Z M 21.3333,26.6667L 18.136,26.6667L 18.136,23.4693M 27.7347,20.2653L 22.4013,25.5987L 19.1973,22.4013L 24.5307,17.068");
        gIconsInfo.add("brmsruledefine", "-2 -2 38 38");
        gIcons.add("brmsruleoperation", "M 29.864,16.3747L 29.864,10.6667L 27.7347,10.6667L 27.7347,8.53067L 29.864,8.53067L 29.864,0L 0,0L 0,8.53067L 2.136,8.53067L 2.136,10.6667L 0,10.6667L 0,19.1973L 2.136,19.1973L 2.136,21.3333L 0,21.3333L 0,29.864L 16.3747,29.864C 18.0213,31.1973 20.12,32 22.4013,32C 27.7027,32 32,27.7027 32,22.4013C 32,20.1147 31.1973,18.0213 29.864,16.3747 Z M 2.136,4.26533L 6.40134,4.26533L 6.40134,6.40133L 2.136,6.40133M 25.5987,8.53067L 25.5987,10.6667L 4.26533,10.6667L 4.26533,8.53067M 2.136,14.932L 6.40134,14.932L 6.40134,17.068L 2.136,17.068M 6.40134,27.7347L 2.136,27.7347L 2.136,25.5987L 6.40134,25.5987M 12.864,21.3333L 4.26533,21.3333L 4.26533,19.1973L 13.36,19.1973C 13.1147,19.88 12.9427,20.5933 12.864,21.3333 Z M 22.4013,29.74C 18.344,29.7347 15.068,26.4533 15.0573,22.4013C 15.068,18.344 18.344,15.068 22.4013,15.0573C 26.4531,15.068 29.7347,18.344 29.74,22.4013C 29.7347,26.4533 26.4531,29.7347 22.4013,29.74 Z M 21.3333,26.6667L 25.5987,22.4013L 21.3333,18.136");
        gIconsInfo.add("brmsruleoperation", "-2 -2 38 38");
        gIcons.add("brmsrulemanagement", "M 29.864,16.3747L 29.864,10.6667L 27.7347,10.6667L 27.7347,8.53067L 29.864,8.53067L 29.864,0L 0,0L 0,8.53067L 2.136,8.53067L 2.136,10.6667L 0,10.6667L 0,19.1973L 2.136,19.1973L 2.136,21.3333L 0,21.3333L 0,29.864L 16.3747,29.864C 18.0213,31.1973 20.12,32 22.4013,32C 27.7027,32 32,27.7027 32,22.4013C 32,20.1147 31.1973,18.0213 29.864,16.3747 Z M 2.136,4.26533L 6.40134,4.26533L 6.40134,6.40133L 2.136,6.40133M 25.5987,8.53067L 25.5987,10.6667L 4.26533,10.6667L 4.26533,8.53067M 2.136,14.932L 6.40134,14.932L 6.40134,17.068L 2.136,17.068M 6.40134,27.7347L 2.136,27.7347L 2.136,25.5987L 6.40134,25.5987M 12.864,21.3333L 4.26533,21.3333L 4.26533,19.1973L 13.36,19.1973C 13.1147,19.88 12.9427,20.5933 12.864,21.3333 Z M 22.4013,29.74C 18.344,29.7347 15.068,26.4533 15.0573,22.4013C 15.068,18.344 18.344,15.068 22.4013,15.0573C 26.4531,15.068 29.7347,18.344 29.74,22.4013C 29.7347,26.4533 26.4531,29.7347 22.4013,29.74 Z M 25.6973,20.688L 26.964,19.4213L 25.4531,17.912L 24.2135,19.156C 23.9787,19.0213 23.7293,18.9173 23.4693,18.8387L 23.4693,17.068L 21.3333,17.068L 21.3333,18.8387C 21.0933,18.912 20.86,19.0107 20.64,19.1253L 19.4213,17.912L 17.912,19.4213L 19.1307,20.636C 19.0107,20.86 18.912,21.088 18.8387,21.3333L 17.068,21.3333L 17.068,23.4693L 18.8387,23.4693C 18.9173,23.7293 19.0213,23.9787 19.156,24.2133L 17.912,25.4533L 19.416,26.964L 20.688,25.6933C 20.8907,25.8027 21.1093,25.8907 21.3333,25.9587L 21.3333,27.7347L 23.4693,27.7347L 23.4693,25.9587C 23.7083,25.8853 23.9427,25.7867 24.1613,25.6667L 25.4531,26.964L 26.964,25.4533L 25.6667,24.1613C 25.7865,23.9427 25.8802,23.708 25.9583,23.4693L 27.7347,23.4693L 27.7347,21.3333L 25.9583,21.3333C 25.8907,21.104 25.8027,20.8907 25.6973,20.688 Z M 22.4013,24C 21.516,23.9947 20.8027,23.2813 20.7973,22.4013C 20.8027,21.516 21.516,20.8027 22.4013,20.7973C 23.2813,20.8027 23.9947,21.516 24,22.4013C 23.9947,23.2813 23.2813,23.9947 22.4013,24 Z ");
        gIconsInfo.add("brmsrulemanagement", "-2 -2 38 38");
    }