<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ page import="java.io.*"%>
<%@ page import="java.text.*" %>
<%@ page import="java.lang.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.net.*" %>

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
    request.setCharacterEncoding("UTF-8");
 
 
    // 파일 업로드된 경로
    //String root = "C:/test/";
	  String root = "/home/ecubeems/was/";
    
    
    //String savePath = root + "upload";
    String savePath = XSScheck(request.getParameter("file_path")) ;
    
   
 
    // 서버에 실제 저장된 파일명
    String filename = XSScheck(request.getParameter("file_name")) ;
    
    
     
    // 실제 내보낼 파일명
    String orgfilename = filename;
      
 
    InputStream in = null;
    OutputStream os = null;
    File file = null;
    boolean skip = false;
    String client = "";
 
 
    try{
         
 
        // 파일을 읽어 스트림에 담기
        try{
            file = new File(savePath, filename);
            in = new FileInputStream(file);
        }catch(FileNotFoundException fe){
            skip = true;
        }
 
 
 
         
        client = request.getHeader("User-Agent");
 
        // 파일 다운로드 헤더 지정
        response.reset() ;
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Description", "JSP Generated Data");
 
 
        if(!skip){
 
            // IE
            if(client.indexOf("MSIE") != -1 || client.indexOf("Trident") != -1){
                response.setHeader ("Content-Disposition", "attachment; filename="+new String(orgfilename.getBytes("KSC5601"),"ISO8859_1"));
 
            }else{
                // 한글 파일명 처리
                orgfilename = new String(orgfilename.getBytes("utf-8"),"iso-8859-1");
 
                response.setHeader("Content-Disposition", "attachment; filename=\"" + orgfilename + "\"");
                response.setHeader("Content-Type", "application/octet-stream; charset=utf-8");
            } 
            
            response.setHeader ("Content-Length", ""+file.length() );
 
 
            out.clear();
            out = pageContext.pushBody();
            
            os = response.getOutputStream();
            byte b[] = new byte[(int)file.length()];
            int leng = 0;
             
            while( (leng = in.read(b)) > 0 ){
                os.write(b,0,leng);
            }
            
            

 
        }else{
            response.setContentType("text/html;charset=UTF-8");
            out.println("<script language='javascript'>alert('파일을 찾을 수 없습니다');history.back();</script>");
 
        }
         
        in.close();
        os.close();
        
        
        if( file.exists() ){
          
          if(file.delete()){ 
            System.out.println("Excel Delete Success!!"); 
          }else{ 
            System.out.println("Excel Delete Fail!!");
          } 
          
        }else{ 
          System.out.println("The file does not exist.");
        } 
        
%>

<script type="text/javascript">
//TM Start =================================================================================================
//var deleteTm = new oza_TMHandler('com.obzen.bmpanly.DocCommMng', 'deleteTempFile', '1', '\@#%');
//deleteTm.setAddDataField('SERVER_FILE_PATH', '<%=savePath%>');
//deleteTm.setAddDataField('FILENM', '<%=filename%>');
//deleteTm.execute(null, false);
//deleteTm.clear();

//screenLog("파일삭제", "file_download", "임시파일 삭제");//화면 로그(공통)
//cmdMessage(0,msg);
//TM End ===================================================================================================
</script>

<%        
 
    }catch(Exception e){
      System.out.println("다운로드 오류 : "+ e.getMessage());
    }
%>