

var pie_dataSource = [{ // 샘플 데이터소스
    country: "Russia",
    area: 3
}, {
    country: "Canada",
    area: 13
}
];


$(function(){
	
	/*
	var tmh = new oza_TMHandler('com.obzen.bmpanly.ColEvtSaleRate', 'selectEvtAmt', '0', '!*%');
	tmh.execute(null, false);

	var tmResult = tmh.getResult();
	var tmResult_json = JSON.parse(tmResult);

	for(var i = 0; i < tmResult_json.length; i++){
		tmResult_json[i].AMT = parseFloat(tmResult_json[i].AMT);
	}

	$("#titl_amt")[0].innerHTML = tmResult_json[2].EVT_DIV_NM;
	$("#tot_amt")[0].innerHTML = tmResult_json[2].AMT+ "<span class='unit_01'>억원</span>" ;
	
	/*
	var pie_dataSource = [{
		EVT_DIV_NM: tmResult_json[0].EVT_DIV_NM,
		AMT: tmResult_json[0].AMT
	}, {
		EVT_DIV_NM: tmResult_json[1].EVT_DIV_NM,
		AMT: tmResult_json[1].AMT
	}
	];
	*/
	
    $("#pie").dxPieChart({  //  id=pie 태그에 차트 생
        size: {
            width: 233,
            height: 262

        },
        palette: ["#4590EB", "#E1E6ED"],  // 색상 두가지 지정
        dataSource: pie_dataSource, // 데이터소스 지정
        //dataSource: tmResult_json, // 데이터소스 지정
        legend:{  // 범례
          horizontalAlignment: "center",
          verticalAlignment: "bottom"
        },
        series: [
            {
                argumentField: "country", // argument 지정
                valueField: "area", // value 지정
                //argumentField: "EVT_DIV_NM", // argument 지정
                //valueField: "AMT", // value 지정
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1
                    },
                    position : "columns",
                    customizeText : function(arg){
                    	return arg.valueText + "(" + arg.percentText +")";
                    }
                }
            }
        ],

    });

});
