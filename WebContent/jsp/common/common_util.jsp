<%!
private String XSScheck(String strParam){
	String str = strParam;
	
  if(str == null || "".equals(str)){
    str = "";
  }else{
    str = str.replaceAll("(?i)<script[^>]*>[\\w|\\t|\\r|\\W]*</script>","");
  	str = str.replaceAll("(?i)<html[^>]*>[\\w|\\t|\\r|\\W]*</html>","");
  	str = str.replaceAll("(?i)<head[^>]*>[\\w|\\t|\\r|\\W]*</head>","");
  	str = str.replaceAll("(?i)<body[^>]*>[\\w|\\t|\\r|\\W]*</body>","");
  	str = str.replaceAll("(?i)<embed[^>]*>[\\w|\\t|\\r|\\W]*</embed>","");
  	str = str.replaceAll("(?i)<iframe[^>]*>[\\w|\\t|\\r|\\W]*</iframe>","");
  	str = str.replaceAll("(?i)<div[^>]*>[\\w|\\t|\\r|\\W]*</div>","");
  	str = str.replaceAll("(?i)<meta[^>]*>[\\w|\\t|\\r|\\W]*</meta>","");
  	str = str.replaceAll("(?i)<object[^>]*>[\\w|\\t|\\r|\\W]*</object>","");
  	str = str.replaceAll("(?i)<applet[^>]*>[\\w|\\t|\\r|\\W]*</applet>","");
  	str = str.replaceAll("(?i)<frameset[^>]*>[\\w|\\t|\\r|\\W]*</frameset>","");
  	str = str.replaceAll("(?i)<img[^>]*>[\\w|\\t|\\r|\\W]*</img>","");
  	str = str.replaceAll("(?i)<input[^>]*>[\\w|\\t|\\r|\\W]*</input>","");
  	str = str.replaceAll("(?i)<table[^>]*>[\\w|\\t|\\r|\\W]*</table>","");
  	str = str.replaceAll("(?i)<style[^>]*>[\\w|\\t|\\r|\\W]*</style>","");
  	str = str.replaceAll("(?i)<link[^>]*>[\\w|\\t|\\r|\\W]*</link>","");
  	str = str.replaceAll("(?i)<base[^>]*>[\\w|\\t|\\r|\\W]*</base>","");
  	str = str.replaceAll("(?i)alert([^>]*>[\\w|\\t|\\r|\\W]*)","");
  	str = str.replaceAll("&","&amp");
  	str = str.replaceAll("<","&lt");
  	str = str.replaceAll(">","&gt");
  	str = str.replaceAll("\\(","&#40;");
  	str = str.replaceAll("\\)","&#41;");
  	str = str.replaceAll("\"","&quot;");
  	str = str.replaceAll("\'","&apos");  
  }

	return str;
}
%>

<%
String ip = request.getHeader("X-Forwarded-For");
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
    ip = request.getHeader("Proxy-Client-IP"); 
} 
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
    ip = request.getHeader("WL-Proxy-Client-IP"); 
} 
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
    ip = request.getHeader("HTTP_CLIENT_IP"); 
} 
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
    ip = request.getHeader("HTTP_X_FORWARDED_FOR"); 
} 
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
    ip = request.getHeader("X-Real-IP"); 
} 
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
    ip = request.getHeader("X-RealIP"); 
} 
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
    ip = request.getRemoteAddr(); 
}
%>

<!-- obzen -->
<link rel="stylesheet" type="text/css" href="../css/dx.common.css" />
<link rel="stylesheet" type="text/css" href="../css/dx.light.compact.css" />   
<link rel="stylesheet" href="../css/grid/wijmo.min.css" />
<link rel="stylesheet" type="text/css" href="../css/oz.common.css"/>
<script type="text/javascript" src="../js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="../js/underscore.js"></script>
<script type="text/javascript" src="../js/globalize.min.js"></script>
<script src="../js/dx.viz-web.js"></script>
<script src="../js/oz.agent.js"></script>
<script src="../js/oz.framework.js"></script>
<script src="../js/oz.controls.js"></script>
<script src="../js/grid/wijmo.min.js" type="text/javascript"></script>
<script src="../js/grid/wijmo.grid.min.js" type="text/javascript"></script>
<script src="../js/grid/wijmo.input.min.js" type="text/javascript"></script>
<script src="../js/oz.grid.js" type="text/javascript"></script>
<script src="../js/FrameSystemLog.js" type="text/javascript"></script>
<script src="../js/FrameSystemSecurity.js" type="text/javascript"></script>

<!-- WEB -->
<link rel="stylesheet" type="text/css" href="../css/web/style.css"/>
<link rel="stylesheet" type="text/css" href="../css/web/jquery-ui.css"/>
<script type="text/javascript" src="../js/web/jquery-ui.min.js"></script>
<script type="text/javascript" src="../js/web/spin.js"></script>
<script type="text/javascript" src="../js/web/web_controller.js"></script>
<script type="text/javascript" src="../js/web/web_function.js"></script>


<!-- Client IP -->
<script type="text/javascript">
var get_client_ip = "";
get_client_ip = "<%=ip%>";
</script>
