
var propertys=['type','name','mergecol','txtalign','width'];
function ozganttchart(ctrid) {
		var evtclicked =null;
		this.getxmldata = "";
		this.columninfo="";
		var xmlprops=[];
		var campid="";
		var selectedrow=null;
		this.call1=0;
		this.call1clone=copyval(this.call1);
		this.id=ctrid;
		var styyyymm;
		var etyyyymm;
		this.colstr="";
		
		this.SetXml=function (reslt){
			this.call1=this.call1+1;
			this.getxmldata=JSON.parse(reslt);
			if(  this.call1== (this.call1clone+2)   ){ // after all functions executed//
				var monthlengths=0;
				var strcut=(this.colstr).split(";");
				var colinformations;
				monthlengths=yearmontharray( new Date(  slicedt(this.StartYYYYMM)  ) , new Date( slicedt(this.EndYYYYMM) )    );
				if( (strcut.length % 5) == 0){
					colinformations=columninfobinding(this.colstr,this.getxmldata);
					this.call1clone=copyval(this.call1);
					DrawTable(monthlengths, this.getxmldata,colinformations , this.id);
				}
			}
		}
		Object.defineProperty(this, 'Clicked',{
			get:function(){
				return evtclicked ;

			},
			set:function(val){
				evtclicked=val;
			}
		} );
		this.SelectedItem=function(val){
			var Karrays=[];
			if(selectedrow == null){ //val=selected row(몇번째 줄)
				return null;
			}
			else if(selectedrow != null){
				
				if(val ==null){
					val=0;
					return val;
				}
				else {
					if(  (this.getxmldata).length != 0){
						for(var tt in (this.getxmldata)[0]){
							Karrays.push(tt);
						}
						return (this.getxmldata)[selectedrow][Karrays[val]];
					}
				}
			}

		}
		this.SetColumnInfo=	function (string){ //mergecol, width,text-align,등의 column별  table 부분 td정보
			var infoarray=[];
			var columnobj={};
			var jj=0;
			this.colstr="";
			this.colstr=string;
			this.call1=this.call1+1;
			this.callbool2=true;
			var stringasarray=string.split(';');
			if(  this.call1==(this.call1clone+2)    ){ // after all functions executed//
				var monthlengths=0;
				var strcut=(this.colstr).split(";");
				var colinformations;
				monthlengths=yearmontharray( new Date(  slicedt(this.StartYYYYMM)  ) , new Date( slicedt(this.EndYYYYMM) )    );
				if( (strcut.length % 5) == 0){ //컬럼정보문자열의 길이가  5의 배수이어야만 한다.
					colinformations=columninfobinding(this.colstr,this.getxmldata); //컬럼정보(width,merge,textalign etc
					this.call1clone=copyval(this.call1); //함수 몇번 호출했나?
					DrawTable(monthlengths, this.getxmldata,colinformations , this.id);
				}
			}
		}
	
		Object.defineProperty(this, 'StartYYYYMM',{
			get:function(){
				return styyyymm;

			},
			set:function(val){
				styyyymm=val;
			}
		});
		Object.defineProperty(this,'EndYYYYMM',{
			get:function(){
				return etyyyymm;
			},
			set:function(val){
				etyyyymm=val;
			}

		});
		if(!ozganttchart.prototype.addEventListener){
			ozganttchart.prototype.addEventListener=function(e,f){
				if(e === "clicked"){
					this.Clicked=f;
				}

			}
		}
		function yyyymm(dt1){
			var month="";
			var year=dt1.getFullYear(); 
			var Date=dt1.getDate();
			var str="";
			if(dt1.getMonth()+1<10){ 
			    month="0"+(dt1.getMonth()+1); //currentmonth<10 즉 달이 한자리수일때 (9월일떄까지) month를 나타내는 숫자 앞에 0을 붙인다.//
			}
			else{
			     month=dt1.getMonth()+1;
			}
			str=""+year+""+month+"" ; 
			return str;
		}
		function slicedt(datestr){
			return datestr.slice(0,4)+"-"+datestr.slice(4,6);
		}
		function columninfobinding(str,reslt){    //matching string to tm(for set startdate and enddate)
			var infoarr=[];
			var columnobj={};
			var jj=0;
			
			var key;
			var strs=str.split(";");
			var keyarrays=[];
			var init="";
			var close="";
			var stringmap=0;
			if(reslt.length != 0){
				for(key in reslt[0] ){
					keyarrays.push(key);
				}
			}
			for(var ii=0;ii<strs.length;ii++){ //property ->global variable
				if( ((ii+1) % 5 == 0)&& ( ii>0) ){
						// columnobj[]
						stringmap=stringmap+1;
				}

			}
				//-------------------------calllist and columninhfo binding-----------------------------//
			for(var ii=0;ii<strs.length;ii++){ //property ->global
					columnobj[""+propertys[jj]+""]=strs[ii];
					columnobj["Name"]="";	
					if( ((ii+1) % 5 == 0)&& ( ii>0) ){  //컬럼정보 string을 5단위씩 끊기 때문이므로
						columnobj["colInfo"]=keyarrays[((ii+1)/5)-1];
						//	
						columnobj["type"]=columnobj[""+propertys[0]+""];
						if( ii==9 ){ //tmresult json 1번째 property
							columnobj["Name"]="id";
						}
						else if( keyarrays[((ii+1)/5)-1]==keyarrays[ stringmap-2]    ){ //tmresult json 4번째 property
							columnobj["type"]="S";
						}
						else if(  keyarrays[((ii+1)/5)-1]==keyarrays[ stringmap-1]   ){ //tmresult json 5번째  property
							columnobj["type"]="E";
						}
						infoarr.push(columnobj);
						columnobj={};
						jj = -1;
					}
					jj=jj+1;
			}
			
			return infoarr;
		}

	function yearmontharray(sttd,entd){ //calendar table counts->조회시작날짜와 년월과 조회 끝날짜의 년월//
		var YearMonthsArray2=[];
		var dateobj={};
		var monthlength=0;
		var objYear=dateobj['year']=sttd.getFullYear();
		var objMonth=dateobj['month']=sttd.getMonth();
		var j=0;
		YearMonthsArray2.push(dateobj);		
				
		for( j=0; new Date(objYear,(objMonth+1) ) < new Date(entd.getFullYear(), (entd.getMonth()+1)  ); j=j+1    ){										
			dateobj={};
			objMonth=objMonth+1;
			if(objMonth>11){//next year
				objYear=objYear+1;
				objMonth=0;
			}
			dateobj['year']=objYear;
			dateobj['month']=objMonth;
			YearMonthsArray2.push(dateobj);
		}//for loop//
			
		return YearMonthsArray2;	
	}	

	function copyval(val){
		var clone=val;
		return clone;
	}

	function DrawTable(YearMonthsArray,EventTables,colInfos,tableid){
			var sundayleft=0;
			var tabletxt="";
			var calendartabletxt="";
			var columnnumbers=1;
			var tablebody=$('.bdtable');
			var bighead= $('.bigtableheader');
			var keyarrays=[];
			var tablewidth=0;
			var Sdt=""; //row 별 startdate
       		var Edt="";//row 별 enddate
       		var calendarwidth="";
			
			$("#"+tableid+"").children("*").remove();
			if(EventTables.length != 0){
				for(key in EventTables[0] ){
					keyarrays.push(key); 
				}
			}
			xmlprops=keyarrays;
			//<!---------------------------------MAKE TABLE HEADER-------------------------------------->
			tabletxt=tabletxt+"<div class='bigtableheader' style=''>";
			tabletxt=tabletxt+"<table class='hdtable' style=''>";
			tabletxt=tabletxt+"<colgroup>";
			for(var ii=0;ii<colInfos.length;ii++){
					if( (colInfos[ii])["type"] =="S"    ){
       			 		Sdt=(colInfos[ii])["colInfo"]; //조회 시작날짜//
					}
					else if( (colInfos[ii])["type"] =="E"   ){ //조회 끝 날짜//
       			 		Edt=(colInfos[ii])["colInfo"];
					}
					if( (colInfos[ii])['txtalign']=="L"){ //textalign center align,left align,right align
						(colInfos[ii])['txtalign']="left";
					}
					else if( (colInfos[ii])['txtalign']=="C"     ){ //textalign center align,left align,right align
						(colInfos[ii])['txtalign']="center";
					}
					else if( (colInfos[ii])['txtalign']=="R"     ){//textalign center align,left align,right align
						(colInfos[ii])['txtalign']="right";
					}
					else {
						(colInfos[ii])['txtalign']="";
					}
					
					if(   (colInfos[ii])['mergecol']==""){ //mergecol 값이 없으면
						colInfos[ii]['mergecol']="F";
					}
					if(  (colInfos[ii])['type'] =='H'){ //컬럼정보에서 type H일때
					 	hide=(colInfos[ii])['colInfo'];
					}
					if(  (colInfos[ii])['Name'] =="id"){
					 	id=(colInfos[ii])['colInfo'];
					}
					if( (colInfos[ii])['width']==""){ //width 값이 없으면 width=0
						colInfos[ii]['width']=0;
					}
					(colInfos[ii])['width']= parseInt( (colInfos[ii])['width']);
					if(   (colInfos[ii])['type']!='H'){
						tabletxt=tabletxt+"<col    style='width:"+(colInfos[ii])['width']+"px;'>";//column header info//
						columnnumbers=columnnumbers+1;
					}
					tablewidth=tablewidth+(colInfos[ii])['width'];
			}
			var tablewidth=tablewidth+columnnumbers;
			var sundaycounteachmonth=0;
			var yearEach=0;
			var monthEach=0;
			var numberdt=0;
			var numberdates=0;
			var sundaydetect= new Date();
			var campdatedetect=new Date();
			tabletxt=tabletxt+"</colgroup>";
			tabletxt=tabletxt+"<thead>";
			tabletxt=tabletxt+"<tr>";
			//make grid thead//
			for(var ii=0;ii<colInfos.length;ii++){
				if(   (colInfos[ii])['type']!='H'){
						//grid th//
					tabletxt=tabletxt+"<th  class= 'tooltip1'   style='width:"+(colInfos[ii])['width']+"px;min-width:"+(colInfos[ii])['width']+"px; max-width:"+(colInfos[ii])['width']+"px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;'  class='gridhead'>"+colInfos[ii]['name']+"</th>";//column header info//
				}
			}
			tabletxt=tabletxt+"<th class='containheader' style='width:calc(100% - "+tablewidth+"px);'>";
			tabletxt=tabletxt+"<table class='tableincontainheader' style=''><thead>";
			for(var mt=0;mt<YearMonthsArray.length;mt++){ //Month//
				 sundaycounteachmonth=0;
				 yearEach= (YearMonthsArray[mt])['year'];
       		 	 monthEach=(YearMonthsArray[mt])['month'];
     			 numberdt= new Date( yearEach , monthEach+1 ,   0) ;
     			 numberdates=numberdt.getDate(); //count of dates of each month//
     			 sundaydetect= new Date();
     			 sundaydetect.setFullYear(yearEach);
     			 sundaydetect.setMonth(monthEach);
     			 sundaydetect.setDate(3);
     			 sundayleft=0;
     			 tabletxt=tabletxt+"<th class='bigtableth' style='width:"+(100/YearMonthsArray.length)+"%;background-color:#374961;'>";
				 tabletxt=tabletxt+"<div class='bigtablethchild' style=''>";
				 tabletxt=tabletxt+"<table style='' class='calendar'>";
					
					
				tabletxt=tabletxt+"<thead class='fixed' style=''><tr class='headertr' style='width:100%;'><td colspan="+numberdates+" class='bigtd'>"+(monthEach+1)+"월</td></tr>";
     			//-------------------make th------------------------------
				tabletxt=tabletxt+"<tr class='firsttr' style='' >";
				for(var dt=1;dt<=numberdates;dt++){	 //DATES// 
							sundaydetect.setDate(dt);
						if(YearMonthsArray.length == 1){ //조회한 게 1달밖에 없을 떄
						
							if( sundaydetect.getDay()==0){ //일요일 때만 빨간색 표시
								tabletxt=tabletxt+"<th class='headth' style='color:red;min-width:12px;position:relative;'>"
								tabletxt=tabletxt+"<span class='datetext' style='overflow:visible!important;'>"+dt+"</span></th>";
							}
							else if(sundaydetect.getDay()==6){ //토요일 때는 파란색 표시
								tabletxt=tabletxt+"<th class='headth' style='color:#0099ff;min-width:12px;postion:relative'>"
								tabletxt=tabletxt+"<span class='datetext' style='overflow:visible!important;'>"+dt+"</span></th>";
							}
							else{ //다른 평일//
								tabletxt=tabletxt+"<th class='headth' style='color:white;min-width:12px;position:relative;'>"
								tabletxt=tabletxt+"<span class='datetext' style='overflow:visible!important;'>"+dt+"</span></th>";
							}

						}
						else if(YearMonthsArray.length != 1){ //조회한 게 여러 달일때 //
							if( sundaydetect.getDay()==0){ //일요일 때만 표시
					
								if( (dt - 1) < 7){ //firstweek sunday
										tabletxt=tabletxt+"<th class='headth' style='text-align:right;letter-spacing:-1px;width:"+( (100 / numberdates) * dt )+"%;left:"+sundayleft+"% ; '  >";
										tabletxt=tabletxt+"<span class='datetext' style='overflow:visible!important;position:relative;left:-1.5px;'>"+dt+"</span></th>"; //css
										sundayleft=sundayleft+( (100 / numberdates) * dt );
								}//firstweek sunday
								else if( (numberdates - dt) < 7  ) { //last week sunday
										tabletxt=tabletxt+"<th class='headth' style='text-align:right;letter-spacing:-1px;left:"+sundayleft+"% ;width:"+( (100 / numberdates) * 7 )+"%; '  >";
										tabletxt=tabletxt+"<span class='datetext' style='overflow:visible!important;position:relative;left:-1.5px;'>"+dt+"</span></th>";//css
										
									 if( (numberdates - dt) > 0    ){
									 		sundayleft=sundayleft+( (100 / numberdates) * 7 );
											tabletxt=tabletxt+"<th class='headth' style='text-align:right;letter-spacing:-1px;width:"+(100 / numberdates) *  (numberdates - dt)+"%;left:"+sundayleft+"% ; '  >";
								  		tabletxt=tabletxt+"</th>";
								  	}
										
								}//lastweek sunday
								else {
									tabletxt=tabletxt+"<th class='headth' style='text-align:right;letter-spacing:-1px;left:"+sundayleft+"% ;width:"+( (100 / numberdates) * 7 )+"%; '  >";
									tabletxt=tabletxt+"<span class='datetext' style='overflow:visible!important;position:relative;left:-1.5px;'>"+dt+"</span></th>";//css
									sundayleft=sundayleft+( (100 / numberdates) * 7 );
								}
						
							}
							
						}

				}//numberdates
				
			
				tabletxt=tabletxt+"</tr></thead>";
				tabletxt=tabletxt+"</table>";
				tabletxt=tabletxt+"</div>";
				tabletxt=tabletxt+"</th>";//bigtableth//
				//------calendar thead--------//
			
			}//yearmonthsarray// month
			tabletxt=tabletxt+"</tr></thead></table></th>"; //table class- container containheader//
			tabletxt=tabletxt+"</tr>";
			tabletxt=tabletxt+"</table>";//hdtable//
			tabletxt=tabletxt+"</div>";//bigtableheader//
			//<!---------------------------------MAKE TABLE HEADER-------------------------------------->
			
			//<!---------------------------------MAKE TABLE BODY-------------------------------------->
			
			tabletxt=tabletxt+"<div class='bigtablebody' style=''><table class='bdtable' style='' >";     //add javascript
			tabletxt=tabletxt+"<tbody style='position:relative;'>";
			tabletxt=tabletxt+"<colgroup>";
			for(var ii=0;ii<colInfos.length;ii++){ //colinfoarr+yearmonthsarray//
				
				if(   (colInfos[ii])['type'] != 'H'){
					tabletxt=tabletxt+"<col    style='width:"+(colInfos[ii])['width']+"px;'>";//column header info//
						
				}
			}
			tabletxt=tabletxt+"</colgroup>";
			
			for(var rowct=0;rowct<EventTables.length;rowct++){
				tabletxt=tabletxt+"<tr  class='Row"+rowct+"'>";
				var startmt=0;
				var startX;
				var endX;
				var endmt=0;
				var endxbreak=0;
				var grbarwidth=0;
				var detectendpos=1;
				campdatedetect= new Date();
				//----------------------draw   grid about event------------------------------//
				for(var tdlist=0;tdlist<colInfos.length;tdlist++) { //jsoncolumninfo//
							var Rowspan=1; 
							if(   ( (colInfos[tdlist]) ['colInfo'] != ""  )&&( (colInfos[tdlist]) ['colInfo'] != hide)  ){
								if( (colInfos[tdlist]) ['mergecol'] =='T' ){ //camp name or event name :column merge 여부

									if(rowct != 0){
										if( (EventTables[rowct])[  (colInfos[tdlist])["colInfo"]  ] !=  (EventTables[rowct-1])[ (colInfos[tdlist])["colInfo"]     ] ){
																	
											for(var span=rowct;span<EventTables.length-1;span++){
												if(   ( EventTables[span])[(colInfos[tdlist])["colInfo"]] == ( EventTables[span+1])[ (colInfos[tdlist])["colInfo"]  ] ){
													Rowspan=Rowspan+1; //td rowspan 증가, 밑에 줄이 연쇄적으로 같은 내용이면 ㄱmergecol =true 인 경우  rowspan을 그 라인 수 만큼 준다.//
												}
												else if( ( EventTables[span])[(colInfos[tdlist])["colInfo"] ] != ( EventTables[span+1])[ (colInfos[tdlist])["colInfo"]  ]  ){
													break;
												}
											}							
										
											if((colInfos[tdlist])['txtalign'] =='left'){
												
												tabletxt=tabletxt+"<td  rowspan='"+Rowspan+"'  class ='tooltip1' title='"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]]+"'  style='width:"+ (colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+"; max-width:"+(colInfos[tdlist])['width']+"px; min-width:"+ (colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+"; test-overflow:ellipsis;overflow:hidden;' ><span class='txtspan' >"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]] +"</span></td>";
											}
											else{
												tabletxt=tabletxt+"<td  rowspan='"+Rowspan+"'  class ='tooltip1' title='"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]]+"'  style='width:"+(colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+"; max-width:"+ (colInfos[tdlist])['width']+"px; min-width:"+ (colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+"; test-overflow:ellipsis;overflow:hidden;' >"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]] +"</td>";
											}											
										}
									
									} 		
								
									else{

											for(var span=rowct;span<EventTables.length-1;span++){
												if(   ( EventTables[span])[ (colInfos[tdlist])["colInfo"]  ] == ( EventTables[span+1])[(colInfos[tdlist])["colInfo"] ]    ){
													Rowspan=Rowspan+1; //td rowspan 증가//밑에 줄이 연쇄적으로 같은 내용이면 ㄱmergecol =true 인 경우  rowspan을 그 라인 수 만큼 준다.//
												}
												else if( ( EventTables[span])[ (colInfos[tdlist])["colInfo"] ] != ( EventTables[span+1])[(colInfos[tdlist])["colInfo"] ]  ){
													break;
												}
																								
											}
										
											if((colInfos[tdlist])['txtalign'] =='left'){
												tabletxt=tabletxt+"<td  rowspan='"+Rowspan+"'  class ='tooltip1' title='"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]]+"'  style='width:"+ (colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+"; max-width:"+ (colInfos[tdlist])['width']+"px; min-width:"+ (colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+"; test-overflow:ellipsis;overflow:hidden;' ><span class='txtspan' >"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]] +"</span></td>";
											}
											else{
												tabletxt=tabletxt+"<td  rowspan='"+Rowspan+"'  class ='tooltip1' title='"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]]+"'  style='width:"+ (colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+"; max-width:"+ (colInfos[tdlist])['width']+"px; min-width:"+ (colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+"; test-overflow:ellipsis;overflow:hidden;' >"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]] +"</td>";
											}										
									
									}
																	
								
								}
								else if ((colInfos[tdlist]) ['mergecol'] =='F'  ) { // 그 column을  merge안 시킬 경우//
									tabletxt=tabletxt+"<td  rowspan='"+Rowspan+"' class='tooltip1' title='"+(EventTables[rowct])[(colInfos[tdlist])["colInfo"]]+" '    style='width:"+(colInfos[tdlist])['width']+"px;text-align:"+(colInfos[tdlist])['txtalign']+";min-width:"+(colInfos[tdlist])['width']+"px; max-width:"+(colInfos[tdlist])['width']+"px;text-overflow:ellipsis;overflow:hidden;'>"+(EventTables[rowct])[ (colInfos[tdlist])["colInfo"] ]+"</td>";
									
								}
								
							}			
							
						}//td //inside row
						//<!-----------------------------------calendars----------------------------------->
						//calendars//
						var yyyymmarray=[]
						for( var  mt=0;mt<YearMonthsArray.length;mt++){
								yyyymmarray.push(0);
						}
						tabletxt=tabletxt+"<td class='containbody' style=''>";
						tabletxt=tabletxt+"<table class='tableincontainbody' style=''><tr>";
						var indx=0;
	     				var partstr="";
	     	  		    var clickids=EventTables[rowct][keyarrays[1]];
	     				//이벤트 시작일 에 있는 'yyyy-mm-dd'형식 문자를 parse한다//
	    				for(var ii=0;ii<( (EventTables[rowct])[Sdt] ).length;ii++ ){
	     						partstr=partstr+( (EventTables[rowct])[Sdt] )[ii];
	     						if( ( (EventTables[rowct])[Sdt] )[ii]=='-'){
	     							indx=indx+1;
	     							if(indx==1){
	     								var cmpstryear=parseInt(partstr); //이벤트 시작연도
	     							}
	     							else if(indx==2){
	     								var cmpstrmonth=parseInt(partstr); //이벤트 시작 개월
	     							}
	     							
	     							partstr="";
	     						}
	     						if(ii ==( (EventTables[rowct])[Sdt] ).length-1){
	     							var cmpstrdate=parseInt(partstr); // 이벤트시작날짜//
	     						}
	    				}
	     				//enddate
	     				//이벤트 종료일 에 있는 'yyyy-mm-dd'형식 문자를  parse한다.//
		    			indx=0;
		    			partstr="";
	     				for(var ii=0;ii<((EventTables[rowct])[Edt] ).length;ii++ ){
	     						partstr=partstr+((EventTables[rowct])[Edt] )[ii];
	     						if( ((EventTables[rowct])[Edt] )[ii]=='-'){
	     							indx=indx+1;
	     							if(indx==1){
	     								var cmpendyear=parseInt(partstr); //이벤트 종료연도
	     							}
	     							else if(indx==2){
	     								var cmpendmonth=parseInt(partstr); //이벤트 종료개월
	     							}
	     							partstr="";
	     						}
	     						if(ii ==( (EventTables[rowct])[Edt] ) .length-1){
	     							var cmpenddate=parseInt(partstr);// 이벤트 종료날짜//
	     						}

	     				}	
	     		
	     			if( (new Date( (YearMonthsArray[0])['year'],(YearMonthsArray[0])['month'],1)).getTime() > (new Date(cmpstryear,cmpstrmonth-1,cmpstrdate )).getTime() ){
	     				startX=0;
	     				startmt=0;
	     			}
	     			//if enddate range outside yearmontharray//
	     			if( (new Date( (YearMonthsArray[YearMonthsArray.length-1])['year'],(YearMonthsArray[YearMonthsArray.length-1])['month'],new Date( (YearMonthsArray[YearMonthsArray.length-1])['year']  , (YearMonthsArray[YearMonthsArray.length-1])['month'] +1 ,   0).getDate()       )).getTime() <= (new Date(cmpendyear,cmpendmonth-1,cmpenddate )).getTime() ){
	     				endX=new Date( (YearMonthsArray[YearMonthsArray.length-1])['year']  , (YearMonthsArray[YearMonthsArray.length-1])['month'] +1 ,   0).getDate()  ;
	     				endmt=YearMonthsArray.length-1;
						detectendpos=0;
					}
					sundaydetect= new Date();
					for( mt=0;mt<YearMonthsArray.length;mt++){ //month array//
								
							 yearEach= (YearMonthsArray[mt])['year'];
							 monthEach=(YearMonthsArray[mt])['month'];
							 numberdt= new Date( yearEach , monthEach+1 ,   0) ;
							 numberdates=numberdt.getDate(); //count of dates of each month//
							 sundaydetect=new Date();
							 sundaydetect.setFullYear(yearEach);
							 sundaydetect.setMonth(monthEach);
     			 	  		 sundaydetect.setDate(3);
							 tabletxt=tabletxt+"<td class='schedulertd' style=''>";
							if(mt==0){
								yyyymmarray[mt-1]=0; 
							}	
							tabletxt=tabletxt+"<table class='tableintd' style=''>";
							tabletxt=tabletxt+"<tbody><tr>"; 
							//make tableintd td//
						    		
	     					//-----------table td--------------
	     					for(var dt=1;dt<=numberdates;dt++){ //월별 날짜수//
								sundaydetect.setDate(dt);
	     						if( YearMonthsArray.length == 1){
	     							if(dt==numberdates){
	     								tabletxt=tabletxt+"<td  class='dates' style='width:"+(100/numberdates)+"%;'>"; 
	     								//각 칸에 해당하는 년월일이 각 줄에 에벤트 시작일 이벤트 종료일 사이일떄 그안에  gantt 막댈를 그린다.//
		     							if(  ( (new Date(yearEach,monthEach,dt)).getTime() >= (new Date(cmpstryear,cmpstrmonth-1,cmpstrdate )).getTime()  ) && (  (new Date(yearEach,monthEach,dt)).getTime() <= (new Date(cmpendyear,cmpendmonth-1,cmpenddate)).getTime() ) ){
		     								tabletxt=tabletxt+"<div class='tooltip' value='"+rowct+"'  ><span class='tooltiptext'>"+ ( (EventTables[rowct])[Sdt] )   +" "+" "+"~"+" "+" "+  ((EventTables[rowct])[Edt] )+"</span></div>";
		     								$("#"+dt+"").css('border-right',0);
		     							}
									
	     							}

	     							else{
		     							tabletxt=tabletxt+"<td   class='sunday' style='width:"+(100/numberdates)+"%;'>";
		     							//각 칸에 해당하는 년월일이 각 줄에 에벤트 시작일 이벤트 종료일일때 그안에  gantt 막댈를 그린다.//
		     							if( ( (new Date(yearEach,monthEach,dt)).getTime() >= (new Date(cmpstryear,cmpstrmonth-1,cmpstrdate )).getTime()  ) &&(  (new Date(yearEach,monthEach,dt)).getTime() <= (new Date(cmpendyear,cmpendmonth-1,cmpenddate )).getTime() ) ){
		     								tabletxt=tabletxt+"<div class='tooltip'  value='"+rowct+"' ><span class='tooltiptext'>"+  ( (EventTables[rowct])[Sdt] ) +" "+" "+"~"+" "+" "+((EventTables[rowct])[Edt] )+"</span></div>";
		     								$("#"+dt+"").css('border-right',0);
		     							}
									
	     							}
	     						}	     						
	     						else if(YearMonthsArray.length != 1){ //조회가 여러 달일때
	     						
										if(  (new Date(yearEach,monthEach,dt)).getTime() == (new Date(cmpstryear,cmpstrmonth-1,cmpstrdate )).getTime()     ){
		     						  		startX=yyyymmarray[mt];//이벤트  시작 날짜의 date
											startmt=mt;//이벤트 시작 날짜의 month
		     						  	}
		     						    if( (new Date(yearEach,monthEach,dt)).getTime() == (new Date(cmpendyear,cmpendmonth-1,cmpenddate )).getTime() ){
											yyyymmarray[mt]=yyyymmarray[mt]+1; //끝날짜인 경우 right position을 고려해 하나를 더하고 그것을 endX(끝좌표)라고 한다.//
											endX=yyyymmarray[mt]; //이벤트  끝 날짜의 date
											endmt=mt;	 //이벤트 끝 날짜의 month
										}
					     			 	if( (new Date(yearEach,monthEach,dt)).getDay()==0){ //일요일 때만 표시 //make td cell//
														//-----------------ㅁ막대가 들어갈 td칸만든다.---------------------------------------
														if( (dt - 1) < 7){ //firstweek sunday
																tabletxt=tabletxt+"<td class='sunday' style='width:"+( (100 / numberdates) * dt )+"%; '  >";
																tabletxt=tabletxt+"</td>";
														}//firstweek sunday
														else if( (numberdates - dt) < 7  ) { //last week sunday
																tabletxt=tabletxt+"<td class='sunday' style='width:"+( (100 / numberdates) * 7 )+"%; '  >";
																tabletxt=tabletxt+"</td>";
															
																if( (numberdates - dt) > 0    ){
																	tabletxt=tabletxt+"<td class='dates' style='width:"+( (100 / numberdates) *  (numberdates - dt) )+"%; '  >";
														  			tabletxt=tabletxt+"</td>";
																}
																
														}//lastweek sunday
														else {
															  tabletxt=tabletxt+"<td class='sunday' style='width:"+( (100 / numberdates) * 7 )+"%; '  >";
																tabletxt=tabletxt+"</td>";
														}
									
													//-----------------ㅁ막대가 들어갈 td칸만든다.---------------------------------------
										}
							
									}
									
									yyyymmarray[mt]=yyyymmarray[mt]+1;  // if not break the loop//
									
							} //1-30일//numberdates lrngth
							//make tableintd td//
							tabletxt=tabletxt+"</tr></tbody>";
							tabletxt=tabletxt+"</table>"; //tableintd//
							tabletxt=tabletxt+"</td>"; //schedulertd
					}//YearMonthsArray//

					if(YearMonthsArray.length != 1){
						//startdate x axis
						  var startxpercent=0;
						  var endxpercent=0;
						 	for(var mtindx=0 ; mtindx <= startmt ; mtindx++){
									if( mtindx < startmt){ //시작날짜에 해당하는 달의 이전 달 (month)
											startxpercent=startxpercent+ (100 / YearMonthsArray.length);
									}
									else if(mtindx == startmt)	{ //시작날짜에 해당하는 달//
											var astart=( new Date( (YearMonthsArray[startmt])['year']  , (YearMonthsArray[startmt])['month'] +1 ,   0).getDate()  );  //이벤트 시작일 해당 개월 날짜수//
											startxpercent=startxpercent+( 100 / YearMonthsArray.length / astart*(startX)    ); //gantt 막대의 left좌표계산//
									}		
							}
						//enddate x axis
							for(var mtindx=0 ; mtindx <= endmt ; mtindx++){
								if( mtindx < endmt){//조회 끝 날짜에 해당하는 달의 이전 달 (month)
									endxpercent=endxpercent+ (100 / YearMonthsArray.length);
								}
								else if(mtindx == endmt)	{ //조회 끝 날짜에 해당하는 달//
									var aend=( new Date( (YearMonthsArray[endmt])['year']  , (YearMonthsArray[endmt])['month'] +1 ,   0).getDate()  )  ; //이벤트 종료일 해당 개월의 날짜수//
									endxpercent=endxpercent+( 100 / YearMonthsArray.length / aend*(endX)    ); //gantt 막대의 right좌표계산//
									if(detectendpos==0){
										endxpercent=0;
									}
								}		
							}
					
							if(endxpercent != 0){
								endxpercent= 100 - endxpercent;
							}
							var flag1=true;
							var flag2=true;
							//못그리는 조건1.이벤트 시작일이 조회 끝 마지막 달 마지막 날짜 이후일때
							if( (new Date( (YearMonthsArray[YearMonthsArray.length-1])['year'],(YearMonthsArray[YearMonthsArray.length-1])['month'],new Date( (YearMonthsArray[YearMonthsArray.length-1])['year']  , (YearMonthsArray[YearMonthsArray.length-1])['month'] +1 ,   0).getDate()       )).getTime() < (new Date(cmpstryear,cmpstrmonth-1,cmpstrdate )).getTime() ){
	     			
	     						flag1=false;
	     					}
		     				//못 그리는 조건2.이벤트 종료일이 조회 시작 첫 달 첫 날짜 이전일때
		     				if( (new Date( (YearMonthsArray[0])['year'],(YearMonthsArray[0])['month'],1)).getTime() > (new Date(cmpendyear,cmpendmonth-1,cmpenddate )).getTime() ){
		     		
		     			    	flag2=false;
		     				}	
		     				//못 그리는 조건 1,2 모두 아닐 때//
		     				if( (flag1 == true) &&(flag2 == true)){ //bar in startdate, enddate range////top,position->css
		     					//draw ganttchart bar//
								tabletxt=tabletxt+"<div class='tooltip2' value='"+rowct+"' style='position:absolute;left:"+startxpercent+"%;right:"+endxpercent+"%; top:5px;'><span class='tooltiptext'>"+ ( (EventTables[rowct])[Sdt] )   +" "+" "+"~"+" "+" "+  ((EventTables[rowct])[Edt] )+"</span></div>";		
							}
					}
					tabletxt=tabletxt+"</tr></table>";
				
					tabletxt=tabletxt+"</td>"//td  .containbody ;
					
					tabletxt=tabletxt+"</tr>";
				 
			}//rowct/eventtables//
			tabletxt=tabletxt+"</tbody>";
			tabletxt=tabletxt+"</table></div>"; //bigtablebody
			//<!---------------------------------MAKE TABLE BODY-------------------------------------->
			 
			var $tableid=$("#"+tableid+"");
			$tableid.append(tabletxt);
			$tableid.css("width","100%");
			$tableid.css("height","calc(100% - 50px");
			$tableid.css("outline","1px solid #aaaaaa");
			$tableid.css("overflow-x","hidden");
			$tableid.css("overflow-y","hidden");
			var  $bigtablebody=$('.bigtablebody');
			$("body").css("overflow-y","hidden"); //css
			var sundaycountwidth=0;
			var winwidth = $('.bigtablethchild').width();
			sundaydetect=new Date();
			var calcolumn=$('.calendar colgroup');
			var calcolumncol;
		
			var padd=$('.headertr').height()+$('.firsttr').height()+1; //calendar 부분 header 높이//
			$("th.tooltip").css("height",$('.headertr').height()+$('.firsttr').height()+"px");
			$("div.tooltip").css("width","100%"); //css
			$bigtablebody.wrap("<div class='scrollview'></div>"); 
			//$bigtablebody.css("top", "0%");//css
			//-----------dxscrollbar -----------
			var scrollViewWidget = $(".scrollview").dxScrollView({
				scrollByContent: true,
				showScrollbar: "onScroll"
			}).dxScrollView("instance");
			
			scrollViewWidget.option("scrollByContent", true);
			 //-----------dxscrollbar -----------
			$('.bdtable').css("top","0px"); //css
			$("div.tooltip2").click(function(){
		  		if (evtclicked != null){
		  			selectedrow=parseInt( $(this).attr("value") );
		  			evtclicked();
		  		}		 	
			});
			var headth=$('.headth');
			var bigtd=$('.bigtd');
			var firsttr=$('.firsttr');
			var datetext=$('.datetext');
			var containbody = $('.containbody');
			var tableincontainbody=$('.tableincontainbody');
			if(YearMonthsArray.length != 1){
				headth.css('position', 'absolute');
				headth.css('top' , 'calc(100% - '+datetext.height()+'px )');
			}
			headth.css('top' , 'calc(100% - '+datetext.height()+'px )');
			//firsttr.css("height", 14+"px"); //css
			$(window).resize(function(){
				var datetext=$('.datetext');
				if(YearMonthsArray.length != 1){
					headth.css('top' ,'calc(100% - '+datetext.height()+'px )' );
				}
			});
			function searchtimestamp(){
				console.log(new Date());
			}
		
	}//draetable
}//ozganttchart//



