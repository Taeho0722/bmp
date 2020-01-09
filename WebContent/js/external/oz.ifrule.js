function ozifrule(id) {
	var RCID = '#' + id;
	var inst = this;
	var varActionTag = "";
	var getxmltoggle = false; //최초 호출 때 xml은 다르다
	//var IDDic = {};
	//var TypeDic = {};
	
	
	var Log = false;
	this.L = function(value){
		if(Log){
			console.log(value);
		}
	}
	
	this.dispose = function(){
		RCID = null;
		inst = null;
		varActionTag = null;
		IDDic = {};
		TypeDic = {};
		Code = null;
		Caption = null;
		Seq = null;
		OptrNMCD = null;
		RACT_NM = null;
		RACT_CD = null;
		dmt = null;
		Getxml = null;
		Setxml = null;
		Setxmltag = null;
		MasterLogicOptr = null;
		ClearDic();
	}
	
	this.makeCombo_Setxml = function(value) {		
		inst.L("makeCombo_Setxml  :  " + value);
		var optrCombotag = "<div class='optr'><select class='optrCombo' name='operators'>";
		switch (value) {
		  case "="    : optrCombotag += "<option value='=' selected='selected' >=</option>" +
			"<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
		               break;
		  case "<&gt;"   : optrCombotag += "<option value='=' >=</option>" +
		  "<option value='<&gt;' selected='selected' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
		               break;
		  case "<"  : optrCombotag += "<option value='=' >=</option>" +
		  "<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' selected='selected' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
		               break;
		  case "<=" : optrCombotag += "<option value='=' >=</option>" +
		  "<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' selected='selected' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
          				break;
		  case "&gt;"  : optrCombotag += "<option value='=' >=</option>" +
		  "<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' selected='selected' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
          				break;
		  case "&gt;=" : optrCombotag += "<option value='=' >=</option>" +
		  "<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' selected='selected' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
          				break;
		  case "IN"    : optrCombotag += "<option value='=' >=</option>" +
		  "<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' selected='selected' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
		  				break;
		  case "NOT IN" : optrCombotag += "<option value='=' >=</option>" +
		  "<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' selected='selected' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
          				break;
		  case "LIKE"  : optrCombotag += "<option value='=' >=</option>" +
		  "<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' selected='selected' >LIKE</option>";
          				break;
		  default    : optrCombotag += "<option value='=' selected='selected' >=</option>" +
		  "<option value='<&gt;' >&lt;&gt;</option>" +
			"<option value='<' >&lt;</option>" +
			"<option value='<=' >&lt;=</option>" +
			"<option value='&gt;' >&gt;</option>" +
			"<option value='&gt;=' >&gt;=</option>" +
			"<option value='IN' >IN</option>" +
			"<option value='NOT IN' >NOT IN</option>" +
			"<option value='LIKE' >LIKE</option>";
		               break;
		}
		optrCombotag += "</select></div>";
		
		return optrCombotag;
	}
	
	this.GetInitElement = function(){
		var element1 = "<div class='IFelement' ><div id='DragTag'></div>" +
			"<div class='Ifformula' data-order='D10001'>" +
			"<div class='formula'><input class='formulainput' type='text' value=''></div>";
		var element2 = "<div class='formula'>" +
			"<input class='formulainput' type='text' value=''></div>" +
			"<div class='elementDel'><img class='DeleteImage' src='../image/icon/BRMS/tab_close_off.png' onclick='DelClick(this)'/></div></div>" +
			"<div class='LogicOpt'>" +
			"<input class='logic' style='left: 3px; display: inline; font-weight: 700; background: rgb(221, 221, 221) none repeat scroll 0% 0%; color: black;' value='AND' onclick='ANDOR(this)' type='submit'>" +
			"<input class='logic' style='left: 5px; display: none;' value='OR' onclick='ANDOR(this)' type='submit'>" +
			"</div></div>";

		return "<div class='IFelements'>" + element1 + this.makeCombo_Setxml('=') + element2 + "</div>";
	}
	
	this.init = function(){
		$(RCID).css('overflow', 'auto');
		$(RCID).css('margin-left', '10px');
		
		var IFF = "<div class='ifmaster' id='ifmasterid' style='margin-left:10px'><div id='masterlabel' style='margin-bottom:3px'><font size='4px' color='silver' style='float:left;'>IF</font></div>";
		
		var inithtml = IFF + "<div class ='IFRuleArea' id = 'temp'>" + this.GetInitElement();
		
		$(RCID).append(inithtml);
		
		
		//MouseHover
		$(RCID).on("mouseenter", ".IFelement",
				function () { 
					$(this).css('border-color', 'silver');
				}).on("mouseleave", ".IFelement", 
						function() {
					$(this).css('border-color', 'transparent');
				});
		
		$(RCID).on("mouseenter", "#DragTag",
				function () { 
					$(this).css('background-color', 'silver');
				}).on("mouseleave", "#DragTag", 
						function() {
					$(this).css('background-color', 'transparent');
				});
		
		this.SetSortable();
	}
	
	var Enabled = true;
	this.setEnabled = function(value) {
		if(value == false){
			Enabled = value;
		}
	}
	
	this.SetSortable = function(){
		var id_idx = 0;
		$(RCID).children().each(function (idx) {
			var optrtext = $(this).children('#masterlabel').text();
			if($(this).attr('class') == 'ifmaster'){
				if(optrtext != "ELSE"){
					$(this).children('.IFRuleArea').each(function (idx){
						id_idx += 1;
						var AreaID = "IFRuleArea" + id_idx;
						
						$(this).attr("id", AreaID);
						$(this).children('.IFelements').each(function (idx){							
							$(this).sortable({
				    			  containment : '#' + AreaID,
				    		      revert: true,
				    		      connectWith: '.IFelements',
				    		      placeholder: 'ui-state-highlight',
				    		      activate: function( event, ui ) {
				    		    	  $(this).parents('.IFRuleArea').find('.logicsingle').hide();
				    		      },
				    		      stop : function(){
									  $(this).parents('.IFRuleArea').children().each(function(idx){
										  var SubOptr = $(this).children('.logicsingle').attr("value");
					    		    	  if(SubOptr == undefined){
					    		    		  SubOptr = "AND";
					    		    	  }else if(SubOptr == "OR"){
					    		    		  SubOptr = "OR";
					    		    	  }else{
					    		    		  SubOptr = "AND";
					    		    	  }
										  var element_cnt = $(this).children().length;
				    		    		  if( element_cnt == 0){
				    		    			  $(this).remove();
				    		    		  }else{
				    		    			  var elements = $(this);
				    		    			  $(this).children('.logicsingle').remove();
				    		    			  $(this).children('.IFelement').each(function(idx){
			    		    					  $(this).after("<input class='logicsingle' value='"+ SubOptr + "' onclick='ANDOR_Single(this)' type='submit'>");  
					    		    		  });  
				    		    			  elements.children().last().remove();
				    		    		  }
				    		    	  });
									  inst.AllLogicOperatorSet();
				    		      },
				    		      deactivate : function( event, ui ) {
				    		    	  $(this).parents('.IFRuleArea').find('.logicsingle').show();
				    		      }
				    		});
						});
					});
				}
			}
		});
	}
	
	this.ElseAreaVisibility = function (VisibleYN) {
		
	}
	
	this.setVisible = function(VisibleYN) {
		
	}
	
	this.SetProjectItem  = function(ItemProjectIDDic, ItemProjectTypeDic) {
		SetDic(ItemProjectIDDic, ItemProjectTypeDic);
	}
	
	var Code = "";
	var Caption = "";
	var Seq = "";
	var OptrNMCD = "";
	var RACT_NM = "";
	var RACT_CD = "";
	var dmt = "@#%";
	
	this.GetCode = function(){
		return Code;
	}
	
	this.GetCaption = function(){
		
		return Caption;
	}
	this.GetAction = function(){
			
		return RACT_CD;
	}
	this.GetAction_NM = function(){
		
		return RACT_NM;
	}
	this.GetCondSeq = function(){
		
		return Seq;
	}
	this.GetCondOptr = function(){
		
		return OptrNMCD;
	}
	this.GetCondOptr_CD = function(){
		
		return OptrNMCD;
	}
	/*--------------------------------------------------------------------Set Action----------------------------------------*/
	this.SetActionMode = function(MultiYN, ValueList, CodeList, Delimiter){
		var ActionTag = "<div id='Action'><font size='4px' color='silver'>Then</font>";
		
		var ChanList_Val = ValueList.split(Delimiter);
		var ChanList_Code = CodeList.split(Delimiter);
		
		if(ChanList_Val[0] == ""){
			ActionTag += "<input type='checkbox' name='chk_group[]' value='SMS' style='margin-left:15px' /><font size='3px'>SMS</font>";
			ActionTag += "<input type='checkbox' name='chk_group[]' value='LMS' style='margin-left:15px'/><font size='3px'>LMS</font>";
			ActionTag += "<input type='checkbox' name='chk_group[]' value='TM'  style='margin-left:15px'/><font size='3px'>TM</font></div>";
		}else {
			for ( var i in ChanList_Val ) {
				if(i != "Item") {
					ActionTag += "<input class='checkfamily' type='checkbox' name='chk_group[]' value='"+ChanList_Code[i]+"' style='margin-left:15px' /><font size='2px'>"+ChanList_Val[i]+"</font>";
				}
			}
			ActionTag += "</div>";
		}
		
		varActionTag = ActionTag;
		$(RCID).append(ActionTag);
		
		inst.MasterSet();
	}
	/*--------------------------------------------------------------------Get Xml----------------------------------------*/
	var Getxml = "";
	Object.defineProperty(this, 'getxml', {
		get: function () {
			inst.MakeXml();
			return Getxml;
        },
        set: function (val) {
        	Getxml = val;
        }
	});
	
	this.MakeXml = function(){
		
		Code = "";
		Caption = "";
		var SeqNum = 0;
		Seq = "";
		OptrNMCD = "";
		RACT_NM = "";
		RACT_CD = "";
		
		inst.L("getxml-----------");
		ClearDic();
		var goon = true;
		Getxml = "<List><Array><text><![CDATA[]]></text><item><![CDATA[]]></item></Array><Info multiyn='0' NullExType='0' /><FormulaInfo><![CDATA[]]></FormulaInfo><IFRuleSet index='1'>";
		
		$(RCID).children().each(function (idx) {
			if($(this).attr('class') == 'ifmaster'){
				var optrtext = $(this).children('#masterlabel').text();
				Getxml += "<IFRule operator='" + optrtext + "'>";
				
				SeqNum = SeqNum + 1;
				Seq += String(SeqNum) + dmt;
				if(optrtext == "IF"){
					OptrNMCD += "if"+ dmt;
				}else if(optrtext == "ELSEIF"){
					OptrNMCD += "else if"+ dmt;
				}else{
					OptrNMCD += "else"+ dmt;
				}
				
				if(optrtext != "ELSE"){
				
					var ElementsCnt = $(this).find('.IFelements').children('.IFelement').length;//$(this).children('.IFRuleArea').children().length;
					var MLoptr = $(this).find('.LogicOpt').children().first()[0].value;
					Getxml += "<LogicOperator operator='" + MLoptr + "' isgroup='F'>";
					
					$(this).children('.IFRuleArea').children().each(function (idx) {
						
						if(idx != 0){
							Caption += " " + MLoptr + " ";
							if (MLoptr == "AND"){
								Code += " && ";
							}else{
								Code += " || ";
							}
						}
						
						var Ifelementlength = $(this).find('.IFelement').length;
						var SubOptr = "";
						var Tyn = false;
						inst.L(Getxml);
						if(Ifelementlength >= 2){
							SubOptr = $(this).find('.logicsingle')[0].value;
							Getxml += "<LogicOperator operator='" + SubOptr + "' isgroup='T'>";
							Tyn = true;
							Caption += "(";
							Code += "(";
						}else{
							
						}
						
						var formulaCnt = $(this).children('.IFelement').length;
						$(this).find('.Ifformula').each(function (idx) {
							var eq = $(this).children('.formula').children()[0].value;
							var va = $(this).children('.formula').children()[1].value;
							var optr = $(this).children('.optr').children('.optrCombo').val();
							
							if(ErrChk && (eq == "" || va == "" )){
								ozf_MsgBox(ozf_getresource('m_Needvalue', '입력되지 않은 영역이 있습니다. 값을 입력해 주세요.'));
								ozController.ExitEvent = true;
								goon = false;
								return false;
							}else if(ErrChk){
								var eqtype = getType(eq, "in");
								var vatype = getType(va, "in");
								inst.L("eq : " + eq + "   eqtype : " + eqtype);
								inst.L("va : " + eq + "   vatype : " + eqtype);
								if(eqtype == false){
									ozf_MsgBox(ozf_getresource('m_Notype', eq + '의 Type을 알 수 없습니다.'));
									ozController.ExitEvent = true;
									goon = false;
									return false;
								}else if(vatype == false){
									ozf_MsgBox(ozf_getresource('m_Notype', va + '의 Type을 알 수 없습니다.'));
									ozController.ExitEvent = true;
									goon = false;
									return false;
								}else if(eqtype != false && vatype != false && vatype != eqtype){
									ozf_MsgBox(ozf_getresource('m_NothingType', '입력된 값 [' + eq + ']와 [' + va + ']의 Type이 서로 다릅니다.'));
									Getxml ="";
									ozController.ExitEvent = true;
									goon = false;
									return false;
								}
								
								var subcode = CreateJavaCode(eq, optr, va, "in");
								inst.L("text : " + eq + optr + va + "   code : " + subcode);
								if(Tyn && (formulaCnt - 1 != idx)){
									Caption += eq.replace("{","").replace("}","") + optr + va.replace("{","").replace("}","") + " " + SubOptr + " ";
									
									if (SubOptr == "AND"){
										Code += subcode + " && ";
									}else{
										Code += subcode + " || ";
									}
								}else{
									Caption += eq.replace("{","").replace("}","") + optr + va.replace("{","").replace("}","");
									Code += subcode;
								}
							}
							if(optr != null){
								optr = optr.replace(">", "&amp;gt;").replace("<", "&lt;");
							}
							
							inst.L("optr : " + optr);
							Getxml += "<Condition operator='" + optr + "'><Inputlist></Inputlist>";
							Getxml += "<equation><![CDATA[" + $(this).children('.formula').children()[0].value + "]]></equation>";
							Getxml += "<valuation type='item'><![CDATA[" + $(this).children('.formula').children()[1].value + "]]></valuation>";
							Getxml += "<value><![CDATA[]]></value></Condition>";
						});
						if(goon == false){
							return false;
						}else if($(this).find('.IFelement').length >= 2){
							Getxml += "</LogicOperator>";
							Caption += ")";
							Code += ")";
						}
					});
	
					Getxml += "</LogicOperator>";
					Caption += dmt;
					Code += dmt;
				}
			}else if($(this)[0].id == 'Action'){
				Getxml += "<RuleThen type='check'>";
				if(ErrChk && $(this).find('input:checked').length == 0){
					ozf_MsgBox(ozf_getresource('m_NeedChannel', 'Then영역의 Channel목록을 선택해 주세요.'));
					ozController.ExitEvent = true;
					goon = false;
					return false;;
				}
				
				$(this).find('input:checked').each(function (idx) {
					Getxml += "<Condition><Inputlist /><equation /><valuation code='" + $(this)[0].value + "'><![CDATA[" + $(this).next().text() + "]]></valuation></Condition>";
					RACT_NM += $(this).next().text() + ",";
					RACT_CD += $(this)[0].value + ",";
				});
				
				RACT_NM = RACT_NM.slice(0, -1) + dmt;
				RACT_CD = RACT_CD.slice(0, -1) + dmt;
				
				Getxml += "</RuleThen></IFRule>";
			}
		});
		if(goon==false){
			return false;;
		}
		
		Getxml += "</IFRuleSet></List>";
		
		if(ErrChk){
			Seq = Seq.slice(0,Seq.length - dmt.length);
			Caption = Caption.slice(0,Caption.length - dmt.length).replace(/@#%/g, '#%');
			Code = Code.slice(0,Code.length - dmt.length).replace(/@#%/g, '#%');
			OptrNMCD = OptrNMCD.slice(0, OptrNMCD.length - dmt.length);
			RACT_NM = RACT_NM.slice(0,RACT_NM.length - dmt.length);
			RACT_CD = RACT_CD.slice(0,RACT_CD.length - dmt.length);
			
			inst.L("Seq : " + Seq);
			inst.L("Caption : " + Caption);
			inst.L("Code : " + Code);
			inst.L("OptrNMCD : " + OptrNMCD);
			inst.L("RACT_NM : " + RACT_NM);
			inst.L("RACT_CD : " + RACT_CD);
		}
		
		inst.L(Getxml);
		return Getxml;
	}
	
	/*--------------------------------------------------------------------Set Xml----------------------------------------*/
	var Setxml = "";
	var Setxmltag = "";
	var MasterLogicOptr = "";
	Object.defineProperty(this, 'Setxml', {
        get: function () {
            return Setxml;
        },
        set: function (val) {
        	$(RCID).children().remove();
        	
        	Setxml = val;
        	inst.L("Setxml : " + Setxml);
        	var xmlDoc = $.parseXML(Setxml);
            var $xml = $(xmlDoc);
            var CheckGroupID = 1;
            
            $xml.find('IFRule').each(function (idx) {
            	Setxmltag = "<div class='ifmaster' id='ifmasterid' >";
            	if($(this).attr("operator") == "IF"){
            		Setxmltag += "<div id='masterlabel' style='margin-bottom:3px'><font style='display:liline' size='4px' color='silver'>"+ $(this).attr("operator") +"</font></div>";
            		AllowElse = 0;
            	}else{
            		Setxmltag += "<div id='masterlabel' style='margin-bottom:3px'><font size='4px' color='silver' style='float:left;'>"+ $(this).attr("operator") +"</font>" + 
            		"<img style='opacity:0.3;cursor:pointer;' src='../image/icon/BRMS/tab_close_off.png'	onclick='MasterDelClick(this)'></div>";
            	}
        		Setxmltag += "<div class='IFRuleArea' id = 'temp'>";
        		if($(this).children('LogicOperator').size()){
        			MasterLogicOptr = $(this).children('LogicOperator').attr("operator");
                	inst.LogicOperator($(this).children('LogicOperator'), $(this).children('LogicOperator').attr("isgroup"));
                	Setxmltag += "</div>";
        		}
        		
        		$(RCID).append(Setxmltag);
                $(RCID).append(varActionTag.replace(/checkfamily/gi,'checkfamily' + CheckGroupID.toString()));
                
            	$(this).children('RuleThen').children().each(function(){
        			if($(this).prop("tagName") == "Condition"){
        				var Code = $(this).find('valuation').attr("code");
        				$(RCID+' .checkfamily'+ CheckGroupID.toString()).each(function () {
        					if($(this).val().equals(Code)){
        						this.checked = true;
        					}
	       	            });
        			}
            	});
                
                CheckGroupID += 1;
            });
            
            inst.AllLogicOperatorSet();
            inst.MasterSet();
            inst.SetSortable();
            
            if(Enabled == false){
            	$(RCID).find('*').attr("disabled", true);
            }
            
           //$(RCID).append("<input class='logic' type='submit' style='left:5px' value='GetXml' onclick='MakeXmlDummy(this)'>");
        }
    });
	
	this.LogicOperator = function($xml, isgroup) {
		
		var logicOptr = $xml.attr("operator");
		var singlelogicoptr = "";
		
		var element1 = "<div class='IFelement' ><div id='DragTag'></div>" +
		"<div class='Ifformula' data-order='D10001'>" +
		"<div class='formula'><input class='formulainput' type='text' value='VVVVVV1'></div>";
		/*ComboTag*/
		var element2 = "<div class='formula'>" +
		"<input class='formulainput' type='text' value='VVVVVV2'></div><div class='elementDel'><img class='DeleteImage' src='../image/icon/BRMS/tab_close_off.png' onclick='DelClick(this)'/></div></div>";
		
		var element3 = "<div class='LogicOpt'>";
		var L_AND_5 = "<input class='logic' type='submit' style='left:5px' value='AND' onclick='ANDOR(this)'>";
		var L_AND_3 = "<input class='logic' type='submit' style='left:3px' value='AND' onclick='ANDOR(this)'>";
		
		var L_OR_5  = "<input class='logic' type='submit' style='left:5px' value='OR' onclick='ANDOR(this)'>";
		var L_OR_3  = "<input class='logic' type='submit' style='left:3px' value='OR' onclick='ANDOR(this)'>";
		
		var element4 = "</div></div>";
		
		var SingleLogic = "<input class='logicsingle' type='submit' value='LLLLLL1' onclick='ANDOR_Single(this)'>";
		var IsnextLogic = false;
		
		$xml.children().each(function(){
			if($(this).prop("tagName") == "LogicOperator"){
				IsnextLogic = true;
				inst.LogicOperator($(this), $(this).attr("isgroup"));
			}
	    });
		
		if(isgroup == "T" && $xml.children('Condition').size() > 0 ){
			Setxmltag += "<div class='IFelements' >";
		}
		var lastNode = $xml.find('Condition').last();
		$xml.children().each(function(){
			if($(this).prop("tagName") == "Condition"){
				
				if(isgroup == "F"){
					Setxmltag += "<div class='IFelements'>";
				}
				
				Setxmltag += element1.replace("VVVVVV1", $(this).find('equation').text()) + 
				inst.makeCombo_Setxml($(this).attr("operator")) + element2.replace("VVVVVV2",$(this).find('valuation').text());
	
				Setxmltag += element3;
				if (MasterLogicOptr == "AND"){
					Setxmltag += L_AND_3 + L_OR_5 + element4;
				}else{
					Setxmltag += L_OR_3 + L_AND_5 + element4;
				}
				if(isgroup == "T") {
					if ($xml.children('condition').last()[0] == $(this)[0]){}else{Setxmltag += SingleLogic.replace("LLLLLL1",logicOptr);}
				}else{
					Setxmltag += "</div>";
				}
			}
		});
		if(isgroup == "T" && $xml.children('Condition').size() > 0 ){
			Setxmltag += "</div>";
		}
	}
	/*--------------------------------------------------------------------전체 Logic UI Update----------------------------------------*/
	this.AllLogicOperatorSet = function() {
		$(RCID).children('.ifmaster').each(function(index){
			var masteridx = index;
			$(this).children('.IFRuleArea').each(function(index){
				var Areaidx = index;
				var elementssize = $(this).children('.IFelements').size();
				$(this).children('.IFelements').each(function(index){
					var elementsidx = index;
					
					$(this).children('.IFelement').each(function(index){
						if(index == 0){
							if((elementssize -1) == elementsidx){
								$(this).children('.LogicOpt').children().first().css('display','inline');
								$(this).children('.LogicOpt').children().first().css('font-weight','700');
								$(this).children('.LogicOpt').children().first().css('background','#DDDDDD');
								$(this).children('.LogicOpt').children().first().css('color','black');
								
								$(this).children('.LogicOpt').children().last().css('display','none');
							}else{
								$(this).children('.LogicOpt').children().first().css('display','inline');
								$(this).children('.LogicOpt').children().last().css('display','inline');
								
								$(this).children('.LogicOpt').children().first().css('font-weight','700');
								$(this).children('.LogicOpt').children().first().css('background','#DDDDDD');
								$(this).children('.LogicOpt').children().first().css('color','black');
								
								$(this).children('.LogicOpt').children().last().css('font-weight','');
								$(this).children('.LogicOpt').children().last().css('background','');
								$(this).children('.LogicOpt').children().last().css('color','');
							}
						}else{
							$(this).children('.LogicOpt').children().first().css('display','none');
							$(this).children('.LogicOpt').children().last().css('display','none');
						}
					});
				});
			});
		});
	}
	
	this.MasterSet = function() {
		var AllowElse = 0;
		var AddIf = "";
		
		$(RCID).children('.ifmaster').children('#masterlabel').children().each(function(index){
			if ($(this).text() == 'IF'){
				AllowElse = 0;
			}else if ($(this).text() == 'ELSEIF'){
				AllowElse = 0;
			}else if ($(this).text() == 'ELSE'){
				AllowElse = 2;
			}
		});
		
		if(AllowElse == 0){
			AddIf += "<div id='AddIF'>" + 
			"<input id='AddEIF' class='AddIFSub' value='ELSEIF' type='submit' onclick='MasterAddClick(this)' >" + 
			"<input id='AddEIF' class='AddIFSub' value='ELSE' style='margin-left: 5px'  type='submit' onclick='MasterAddClick(this)' ></div>";
		}else {
			AddIf += "<div id='AddIF'></div>";
		}
		
		$(RCID).children('#AddIF').remove();
		$(RCID).append(AddIf);
	}
	
	/*------------------------------------------------------------------------------------------------------------*/
	/*** Property ***/
	this.ErrChk = false;
	this.ROUTEMode = false;
	
	Object.defineProperty(this, 'ErrChk', {
        get: function () {
            return ErrChk;
        },
        set: function (val) {
        	ErrChk = val;
        }
    });
	Object.defineProperty(this, 'ROUTEMode', {
        get: function () {
            return ROUTEMode;
        },
        set: function (val) {
        	ROUTEMode = val;
        }
    });
	
	
	
}
/*--------------------------------------------------------------------Ex Function----------------------------------------*/
function DelClick(item)
{
	var ctrl = getCtl($(item).parents('.ifmaster').parent()[0].id);
	var Elements = $(item).parents('.IFelements');
	var Elementitem = $(item).parents('.IFelement');
	var Element_cnt = $(item).parents('.IFelements').children('.IFelement').size();
	var RuleArea = $(item).parents('.IFRuleArea');
	var isFirst = false;
	var masterLogic = "";
	//First Element
	if(Element_cnt == 1 && $(item).parents('.IFRuleArea').children('.IFelements').size() == 1){
		ozf_MsgBox(ozf_getresource('m_DonotDelEle',"요소가 하나일 경우에는 삭제 할 수 없습니다."));
		return
	}else if(Elements.children().first()[0] == Elementitem[0] && Element_cnt == 1){
		Elements[0].remove();
	}else if(Elements.children().first()[0] == Elementitem[0] && Element_cnt > 1){
		if(Elementitem.children('.LogicOpt').children('.logic').css('font-weight') == '700'){
			masterLogic = "AND";
		}else{
			masterLogic = "OR";
		}
		Elementitem.next()[0].remove();
		Elementitem[0].remove();
		isFirst = true;
	}else{
		Elementitem.prev()[0].remove();
		Elementitem[0].remove();
	}
	
	ctrl.AllLogicOperatorSet();
}

function MasterAddClick(item){
	var ctrl = getCtl($(item).parent().parent()[0].id);
	var SelType =  $(item)[0].value;   //  IF/ELSEIF/ELSE
	
	$(item).parent().parent().children().last().before($(item).parent().parent().children('.ifmaster').last()[0].outerHTML);
	$(item).parent().parent().children().last().before($(item).parent().parent().children('#Action').last()[0].outerHTML);
	$(item).parent().parent().children('.ifmaster').last().children('#masterlabel').children().text(SelType);

	
	if(SelType == 'ELSE') {
		$(item).parent().parent().children('.ifmaster').last().children('.IFRuleArea').remove();
	}
	
	if($(item).parent().parent().children('.ifmaster').length == 2){	//IF만 있었을 때
		$(item).parent().parent().children('.ifmaster').last().children('#masterlabel').append("<img style='opacity:0.3;cursor:pointer;' src='../image/icon/BRMS/tab_close_off.png'	onclick='MasterDelClick(this)'></div>");
	}
	ctrl.MasterSet();
	ctrl.SetSortable();
}

function MasterDelClick(item){
	var ctrl = getCtl($(item).parents('.ifmaster').parent()[0].id);
	
	var master = $(item).parents('.ifmaster');
	var action = $(item).parents('.ifmaster').next();
	
	master[0].remove();
	action[0].remove();
	
	ctrl.MasterSet();
}

function ANDOR(item){
	var ctrl = getCtl($(item).parents('.ifmaster').parent()[0].id);
	var i = 0;
	var SelectedValue = $(item).context.value;
	
	if($(item).parents('.IFRuleArea').children().last()[0] == $(item).parents('.IFelements')[0]){		//Click Last Logic 
		$(item).parents('.IFRuleArea').append(ctrl.GetInitElement());
	}
	
	$(item).parents('.IFRuleArea').find('.logic').each(function(){
		if(i % 2 == 0){	//First
			$(this)[0].value = SelectedValue;
		}else{
			if(SelectedValue == 'AND'){
				$(this)[0].value = 'OR';
			}else{
				$(this)[0].value = 'AND';
			}
		}
		i++;
	});
	ctrl.AllLogicOperatorSet();
	ctrl.SetSortable();
}

function ANDOR_Single(item){
	var SelectedValue = $(item).context.value;
	$(item).parents('.IFelements').find('.logicsingle').each(function(){
		if(SelectedValue == 'AND'){
			$(this)[0].value = 'OR';
		}else{
			$(this)[0].value = 'AND';
		}
	});
}

function MakeXmlDummy(item){
	var ctrl = getCtl($(item).parent()[0].id);
	ctrl.MakeXml();
}
