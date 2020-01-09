/*
 *  obzen Rule Container Control
 */
var order = "";
var ParaItems = "";

function ozrulecontainer(id) {
	var RCID = '#' + id;
	var inst = this;
	
	this.dispose = function(){
		
	}
	
	/**
    * 초기화
    */
    this.init = function () {
    	$(RCID).append("<div id='RuleContainerArea'><div id=RuleContainer><div id='RuleArea'><div id='RuleViewContainer'></div></div><div id='RuleParaArea'></div></div></div>");
    	
    	
    	$("#RuleViewContainer").sortable({
    		axis: "y",
    		containment: "parent",
    		update: function (event, ui) {
    			order = $(this).sortable('toArray', {
    				attribute: 'data-order'
    			});
    			inst.Set_Para();
    		}
    	});
    	
    	$("#RuleArea").css('right', 0);
    	$("#RuleParaArea").hide();
    }
    
    /**
     * Add Rule
     */
    this.AddRule = function(ID, NAME, TYPE, isSetPara) {
    	if(isSetPara === undefined) { 
    		isSetPara = true;
    	}
    	
    	//Dup Check
    	order = $("#RuleViewContainer").sortable('toArray', {
    		attribute: 'data-order'
    	});
    	
    	if(order.length == 0){
    	}else{
        	for(var i = 0; i < order.length; i++){
        		if (order[i].equals(ID)){
        			ozf_MsgBox(ozf_getresource('m_NotRuleNmCheck',"이미 존재하는 Rule입니다."));
        			return;
        		}
        	}
    	}
    	
    	
    	//Rule Draw
    	var RuleView = "";
    	RuleView += "<div class='container' data-order='" + ID + "' id=''> ";
    	RuleView += "<div class='header'><img class='ViewToggleImage' src='../image/icon/BRMS/16_Reduce.png' /></div><div class='middle'>";
    	if (TYPE.equals("BR_EasySheet")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_EasySheet.png' />"
    	}else if (TYPE.equals("BR_Condition")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_Condition.png' />"
    	}else if (TYPE.equals("BR_DecisionTable")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_DecisionTable.png' />"
    	}else if (TYPE.equals("BR_DBSQL")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_DBSQL.png' />"
    	}else if (TYPE.equals("BR_RuleSet")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_RuleSet.png' />"
    	}else if (TYPE.equals("BR_ScoreCard")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_ScoreCard.png' />"
    	}else if (TYPE.equals("BR_BulkRuleSet")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_BulkRuleSet.png' />"
    	}else if (TYPE.equals("BR_Filter")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_Filter.png' />"
    	}else if (TYPE.equals("BR_Formula")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_Formula.png' />"
    	}else if (TYPE.equals("BR_Matrix")) {
    		RuleView += "<img class='RuleImage' src='../image/icon/BRMS/Icon_BR_Matrix.png' />"
    	}else{
    		return;
    	}
    	RuleView += "&nbsp;&nbsp;" + NAME;
    	RuleView += "</div><div class='footer'><img class='DeleteImage' src='../image/icon/BRMS/tab_close_off.png' onclick='DelClick(this)'/></div></div>";
    	
    	$("#RuleViewContainer").append(RuleView);
    	if(isSetPara){
    		inst.Set_Para();
    	}
    }
    
    //DrawPara
    this.Set_Para = function () {
    	order = $("#RuleViewContainer").sortable('toArray', {
    		attribute: 'data-order'
    	});
    	//alert(order);
    	
    	var tmh = new oza_TMHandler('com.obzen.ruleWeb.Doc_0001', 'GetRulePara_Multi', '1', '^*%');
    	tmh.setAddDataField('NODE_ID', order.join(","));
    	tmh.returnlist('ITEM_NM;ITEM_TYPE;ITEM_VAL;DSPL_NM;INPT_KIND;FRAME_PATH;NODE_ID;OPRTR_CD;NODE_TYPE');
    	tmh.execute(null, false);

    	var ITEM_NM = tmh.ElementValue('ITEM_NM').split(";");
    	var ITEM_TYPE = tmh.ElementValue('ITEM_TYPE').split(";");
    	var ITEM_VAL = tmh.ElementValue('ITEM_VAL').split(";");
    	var DSPL_NM = tmh.ElementValue('DSPL_NM').split(";");
    	var INPT_KIND = tmh.ElementValue('INPT_KIND').split(";");
    	var FRAME_PATH = tmh.ElementValue('FRAME_PATH').split(";");
    	var NODE_ID = tmh.ElementValue('NODE_ID').split(";");
    	var OPRTR_CD = tmh.ElementValue('OPRTR_CD').split(";");
    	var NODE_TYPE = tmh.ElementValue('NODE_TYPE').split(";");
    	tmh.clear();
    	
    	ParaItems = "";
    	
    	if(ITEM_NM[0] == ""){
    		$("#RuleArea").css('right', 0);
        	$("#RuleParaArea").hide();
        	$("#RuleParaChild").remove();
    	}else{
    		$("#RuleParaChild").remove();
	    	//ParaGrid
	    	var ParaScript = "<div id='RuleParaChild'>";
	    	for ( var i in ITEM_NM ) {
	    		if (i != "Item"){
	    			ParaItems += ","+ITEM_NM[i];
		    		ParaScript += "<P></P>" + DSPL_NM[i] + "<br>";
		    		if (INPT_KIND[i].equals("TEXT")) {
		    			if (ITEM_TYPE[i].equals("STRING")) {
		    				ParaScript += "<input class='paradata' type='text' value='" + ITEM_VAL[i] + "'>";
		    				if (FRAME_PATH[i] != ""){
		    					ParaScript += "<img class='Search' src='../image/icon/BRMS/Search3.png' onclick='SearchClick(this)' data-frame='" + FRAME_PATH[i] + "' data-item='" + ITEM_NM[i] + "' data-type='" + ITEM_TYPE[i] + "' />";
		    				}
		    			}else if (ITEM_TYPE[i].equals("NUMERIC")) {
		    				ParaScript += "<input class='paradata' type='text' value='" + ITEM_VAL[i] + "' onkeydown='return showKeyCode(event)'>";
		    				if (FRAME_PATH[i] != ""){
		    					ParaScript += "<img class='Search' src='../image/icon/BRMS/Search3.png' onclick='SearchClick(this)' data-frame='" + FRAME_PATH[i] + "' data-item='" + ITEM_NM[i] + "' data-type='" + ITEM_TYPE[i] + "' />"
		    				}
		    			}else{    				
		    				ParaScript += "<input class='paradata' type='text' value='" + ITEM_VAL[i] + "'>";
		    				if (FRAME_PATH[i] != ""){
		    					ParaScript += "<img class='Search' src='../image/icon/BRMS/Search3.png' onclick='SearchClick(this)' data-frame='" + FRAME_PATH[i] + "' data-item='" + ITEM_NM[i] + "' data-type='" + ITEM_TYPE[i] + "' />"
		    				}
		    			}
		    		}else if (INPT_KIND[i].equals("AREA")) {
		    			ParaScript += "<textarea class='paradata' cols='18' rows='3' style='resize:none;'>" + ITEM_VAL[i] + "</textarea>";
		    			if (FRAME_PATH[i] != ""){
							ParaScript += "<img class='Search' src='../image/icon/BRMS/Search3.png' onclick='SearchClick(this)' data-frame='" + FRAME_PATH[i] + "' data-item='" + ITEM_NM[i] + "' data-type='" + ITEM_TYPE[i] + "' />"
						}
		    		}else{
		    			ParaScript += "<input class='paradata' type='text' value='" + ITEM_VAL[i] + "'>";
		    			if (FRAME_PATH[i] != ""){
							ParaScript += "<img class='Search' src='../image/icon/BRMS/Search3.png' onclick='SearchClick(this)' data-frame='" + FRAME_PATH[i] + "' data-item='" + ITEM_NM[i] + "' data-type='" + ITEM_TYPE[i] + "' />"
						}
		    		}
	    		}
	    	}
	    	ParaScript += "</div>";
	    	
	    	ParaItems = ParaItems.substring(1);
	    	$("#RuleParaArea").append(ParaScript);
	    	
	    	$("#RuleArea").css('right', 210);
	    	$("#RuleParaArea").show();
    	}
    }
    /* functions */
    this.GetNodeIdList = function(Dmt) {
    	order = $("#RuleViewContainer").sortable('toArray', {
    		attribute: 'data-order'
    	});
    	
    	return order.toString().replace(/,/g , Dmt); //LYH 수정
    }
    
    this.GetItemList = function(Dmt) {
    	return ParaItems.replace(/,/g , Dmt); //LYH 수정
    }
    
    this.DicClear = function() {
    	
    }
    
    this.SetSelector = function(Dummy) {
    	
    }
    
    this.GetValList = function(Dmt) {
    	var ParaInputdata = "";
    	$('.paradata').each(function() {
    		if(this.tagName.equals("INPUT")){
    			ParaInputdata += "," + this.value;
    		}else if(this.tagName.equals("TEXTAREA")){
    			ParaInputdata += "," + this.value;
    		}
        });
    	
    	if(ParaInputdata.length > 1){
    		ParaInputdata = ParaInputdata.substring(1);
    	}
    	
    	return ParaInputdata.replace(/,/g , Dmt); //LYH 수정
    }
    
    //RuleID로 RuleContainer Draw
    this.GetRuleList = function(Rule_Use_ID){
    	var tmh = new oza_TMHandler('com.obzen.ruleWeb.Doc_0001', 'GetAppUseRules', '1', '^*%');
    	tmh.setAddDataField('RULE_USE_ID', Rule_Use_ID);
    	tmh.returnlist('NODE_ID;NODE_TYPE;NODE_NM');
    	tmh.execute(null, false);

    	var NODE_ID = tmh.ElementValue('NODE_ID').split(";");
    	var NODE_TYPE = tmh.ElementValue('NODE_TYPE').split(";");
    	var NODE_NM = tmh.ElementValue('NODE_NM').split(";");
    	tmh.clear();
    	
    	if(NODE_ID[0] == ""){
    		
    	}else{
    		for ( var i in NODE_ID ) {
    			if (i != "Item"){
    				inst.AddRule(NODE_ID[i],NODE_NM[i],NODE_TYPE[i],false)
    			}
        	}
        	inst.Set_Para();
    	}
    }
    
    
    
    
    /*---------------------------------------------------------------------------*/
    /* RuleSet Click시 RuleSet Flow */
    this.SelectRuleSetFlowXml = function(){
    	
    }
    
    
    
    /*---------------------------------------------------------------------------*/
    
    
    
    
    /* object */
    this.SearchTextBox = new Object({
    	text:"",
    	inputvalue:null
    });
    
    /* Set seleted value - End popup*/
    this.SetTextFromSearch = function(itemvalue){
    	inst.SearchTextBox.inputvalue.value = itemvalue;
    }
    
    /* Property */
    var SearchItemNM = "";
    Object.defineProperty(this, 'SearchItemNM', {
        get: function () {
            return SearchItemNM;
        },
        set: function (val) {
        	SearchItemNM = val;
        }
    });
    
    var InputKind = "";
    Object.defineProperty(this, 'InputKind', {
        get: function () {
            return InputKind;
        },
        set: function (val) {
        	InputKind = val;
        }
    });
    
    var Pathval = "";
    Object.defineProperty(this, 'Pathval', {
        get: function () {
            return Pathval;
        },
        set: function (val) {
        	Pathval = val;
        }
    });
    
	/* event */
	this.promptsearch = function (e) { }
	if (!ozrulecontainer.prototype.addEventListener) {
		ozrulecontainer.prototype.addEventListener = function (e, f) {
	        if (e === "promptsearch") {
	        	this.promptsearch = f;
	        }
	    }
	}
    
    /*---------------------------Dummy Function---------------------------*/
	this.rulesetimageclick = function (e) { }
}

function showKeyCode(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if( ( keyID >=48 && keyID <= 57 ) || ( keyID >=96 && keyID <= 105 ) )
	{
		return;
	}
	else
	{
		return false;
	}
}

function DelClick(item)
{
	var Ctl = getCtl($(item).parents('#RuleContainerArea').parent()[0].id);
   	$(item).parents('.container').remove(); //delete self
   	Ctl.Set_Para();	//지우고나서
}

function SearchClick(item)
{
	var Ctl = getCtl($(item).parents('#RuleContainerArea').parent()[0].id);
	Ctl.SearchItemNM = $(item).data("item");
	Ctl.InputKind = $(item).data("type");
	Ctl.SearchTextBox.text = $(item)[0].previousSibling.value;
	Ctl.SearchTextBox.inputvalue = $(item)[0].previousSibling
	Ctl.Pathval = $(item).data("frame");
	Ctl.promptsearch();
}
