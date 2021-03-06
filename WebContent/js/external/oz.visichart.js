/*
 * oz.visichart.js
 * obzen VisifireChart Control
 *
 *
 *
 *
 *
 *
 *
 */




////////////////////////////////////////////////////////////////////////////////////////////////////
// oz_visichart ////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
function oz_visichart(id) {
    this.id = '#' + id;


    var g_visichart_id = 'ozvisiChart';

    var refPDiv = document.getElementById(id);
    refPDiv.innerHTML =
        "<div id='" + g_visichart_id + "' style='position:absolute;left:5px;top:5px;right:5px;bottom:10px; border-style:solid; border-color:#0000ff' ></div>";



    //Tooltip
    this.CellTip = new wijmo.Tooltip();
    this.TipContent = "";
    this.TipRng;


    this.init = function () {
        var htmltag;
        htmltag  = "<div id='tabctl' style='position:absolute;left:0px;top:0px;width:269px;bottom:10px; border-style:dotted; border-color:#ff0000'>";
        htmltag += "  <div id='tabctl_header' class='oztabs-container' style='position:absolute;height:30px'></div>";
        htmltag += "  <div id='tabctl_container' class='oztabs-content' style='position:absolute;left:0px;top:31px;right:0px;bottom:0px;' >";
        htmltag += "    <div id= 'c_TabPage1' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px' >";
        htmltag += "      <div id='divmetatree' style='position:absolute;left:0px;top:0px;right:0px;bottom:0px'></div>";
        htmltag += "    </div>";
        htmltag += "  </div>";
        htmltag += "</div>";
        htmltag += "<div id='" + g_visichart_id + "' style='position:absolute;left:271px;top:0px;width:70%;height:70%; border-style:solid; border-color:#00ff00' ></div>";
    }


}
////////////////////////////////////////////////////////////////////////////////////////////////////
// Eof oz_visichart ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////




if (!oz_visichart.prototype.addEventListener) {
    oz_visichart.prototype.addEventListener = function (e, f) {
        switch (e) {
            case "requestdrillreport":
                this.requestdrillreport = f;
                break;

            case "onCheckClick":
                //this.fgObj.onCellEditEnded = f;
                this.onCheckClickHandler = f;
                break;

            case "onHyperClick":
                this.onHyperClick = f;
                break;

        }
    }
}


