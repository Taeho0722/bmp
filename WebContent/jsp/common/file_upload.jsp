<%@page import="java.io.File"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="java.io.IOException"%>
<%@page import="java.net.SocketException"%>
<%@page import="java.util.Enumeration"%>
<%@page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy"%>
<%@page import="com.oreilly.servlet.MultipartRequest"%>
<%@page import="org.apache.commons.net.ftp.*" %>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


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
    String uploadPath = XSScheck(request.getParameter("server_path")) ;
    String uploadPath2 = XSScheck(request.getParameter("server_path")) ;
    
    String formName = XSScheck(request.getParameter("form_name")) ;
    String uploadTempPath = "";
    String ftpPath = "";
    
    //uploadPath = "/sw/eCubeStudioServer/repository/"+uploadPath;//운영
    //uploadPath = "/home/ecubeems/was/upload/"+uploadPath;//운영
    //uploadPath = "C:/test/upload/"+uploadPath;//테스트
    //uploadTempPath = "C:\\test\\upload\\temp\\07\\lottegf7";//테스트
    //ftpPath = "/home/ecubeems/was/upload/"+uploadPath;//운영
    //uploadTempPath = "/home/ecubeems/was/upload/temp/"+uploadPath;//운영
    uploadPath = "\\10.253.21.252/home/ecubeems/was/upload/test";
    uploadPath2 = "\\10.253.21.252/home/ecubeems/was/upload/test2";
    
    
    int maxSize =300*1024;// 한번에 올릴 수 있는 파일 용량 : 300kb로 제한
     
    String fileName1 ="";// 중복처리된 이름
    String originalName1 ="";// 중복 처리전 실제 원본 이름
    String fileName2 ="";// 중복처리된 이름
    String originalName2 ="";// 중복 처리전 실제 원본 이름
    long fileSize =0;// 파일 사이즈
    String fileType ="";// 파일 타입
    String fileType2 ="";// 파일 타입
    MultipartRequest multi =null;
    MultipartRequest multi2 =null;
    String flag = "N";
    String flag2 = "N";
    String msg = "";
    String msg2 = "";
    
    try{
      
      
        //폴더 생성 및 기존 파일 삭제 시작-------------------------------------
        File folder = new File(uploadPath);
      
        //폴더 생성
        if(!folder.exists()){
          try{
            folder.mkdirs();
            msg = "1번째 폴더 생성";
          }catch(Exception e){
            msg = e.getMessage();
          }
        }else{
          msg = "1번째 폴더 존재";
          File[] folder_list = folder.listFiles(); //파일리스트 얻어오기
  				/*
      		for (int j = 0; j < folder_list.length; j++) {
      			folder_list[j].delete(); //파일 삭제 
      		  System.out.println("file delete : "+folder_list[j]);
          }
          */
      	}
        
        
        
        File folder2 = new File(uploadPath);
        
        //폴더 생성
        if(!folder2.exists()){
          try{
            folder2.mkdirs();
            msg2 = "2번째 폴더 생성";
          }catch(Exception e){
            msg2 = e.getMessage();
          }
        }else{
          msg2 = "2번째 폴더 존재";
          File[] folder_list = folder.listFiles(); //파일리스트 얻어오기
  				/*
      		for (int j = 0; j < folder_list.length; j++) {
      			folder_list[j].delete(); //파일 삭제 
      		  System.out.println("file delete : "+folder_list[j]);
          }
          */
      	}
        
        
        /*
        File ftpFolder = new File(ftpPath);
        
        //폴더 생성
        if(!ftpFolder.exists()){
          try{
            ftpFolder.mkdirs();
            msg = "FTP 폴더 생성";
          }catch(Exception e){
            msg = e.getMessage();
          }
        }else{
          msg = "FTP 폴더 존재";
        }
        */
        //폴더 생성 및 기존 파일 삭제 종료-------------------------------------
        
        
        String fileId1 = "";
        String fileId2 = "";
        
        
        //모바일DM
        if("fileForm".equals(formName)){
          fileId1 =  "file_input1";
          fileId2 =  "file_input2";
        }
        
        
        //MMS
        if("fileForm2".equals(formName)){
          fileId1 =  "file_input3";
          fileId2 =  "file_input4";
        }
        
        
        
        //1번째 파일 생성 시작----------------------------------------------
        // request,파일저장경로,용량,인코딩타입,중복파일명에 대한 기본 정책
        multi =new MultipartRequest(request,uploadPath,maxSize,"utf-8",new DefaultFileRenamePolicy());
        
        fileName1 = multi.getFilesystemName(fileId1);
        originalName1 = multi.getOriginalFileName(fileId1);
        
        fileName2 = multi.getFilesystemName(fileId2);
        originalName2 = multi.getOriginalFileName(fileId2);
        
        fileType = multi.getContentType(fileId1);
        fileType2 = multi.getContentType(fileId2);
        
        flag = "Y"; 
       //파일 생성 종료----------------------------------------------
       
       
       
        //1번째 파일 생성 시작----------------------------------------------
        // request,파일저장경로,용량,인코딩타입,중복파일명에 대한 기본 정책
        multi2 =new MultipartRequest(request,uploadPath2,maxSize,"utf-8",new DefaultFileRenamePolicy());
        
        fileName1 = multi2.getFilesystemName(fileId1);
        originalName1 = multi2.getOriginalFileName(fileId1);
        
        fileName2 = multi2.getFilesystemName(fileId2);
        originalName2 = multi2.getOriginalFileName(fileId2);
        
        fileType = multi2.getContentType(fileId1);
        fileType2 = multi2.getContentType(fileId2);
        
        flag2 = "Y"; 
       //파일 생성 종료----------------------------------------------
       
    }catch(Exception e){
       flag = e.getMessage();
    }
    
    
    
    try{
        File folder2 = new File(uploadPath2);
        
        //폴더 생성
        if(!folder2.exists()){
          try{
            folder2.mkdirs();
            msg2 = "2번째 폴더 생성";
          }catch(Exception e){
            msg2 = e.getMessage();
          }
        }else{
          msg2 = "2번째 폴더 존재";
          File[] folder_list = folder2.listFiles(); //파일리스트 얻어오기
  				/*
      		for (int j = 0; j < folder_list.length; j++) {
      			folder_list[j].delete(); //파일 삭제 
      		  System.out.println("file delete : "+folder_list[j]);
          }
          */
      	}
        
        String fileId1 = "";
        String fileId2 = "";
        
        
        //모바일DM
        if("fileForm".equals(formName)){
          fileId1 =  "file_input1";
          fileId2 =  "file_input2";
        }
        
        
        //MMS
        if("fileForm2".equals(formName)){
          fileId1 =  "file_input3";
          fileId2 =  "file_input4";
        }
        
        
       
        //2번째 파일 생성 시작----------------------------------------------
        // request,파일저장경로,용량,인코딩타입,중복파일명에 대한 기본 정책
        multi2 =new MultipartRequest(request,uploadPath2,maxSize,"utf-8",new DefaultFileRenamePolicy());
        
        fileName1 = multi2.getFilesystemName(fileId1);
        originalName1 = multi2.getOriginalFileName(fileId1);
        
        fileName2 = multi2.getFilesystemName(fileId2);
        originalName2 = multi2.getOriginalFileName(fileId2);
        
        fileType = multi2.getContentType(fileId1);
        fileType2 = multi2.getContentType(fileId2);
        
        flag2 = "Y"; 
       //파일 생성 종료----------------------------------------------
       
    }catch(Exception e){
       flag2 = e.getMessage();
    }
%>


<%
/*
FTPClient ftp = null;

try
{
 String FilePath="";
 FilePath=request.getParameter("FilePath");

    ftp = new FTPClient();
    ftp.setControlEncoding("UTF-8");
    ftp.connect("10.253.21.252");
    ftp.login("ecube", "@Scrmadin1");
   
    ftp.changeWorkingDirectory(ftpPath);
   
    File uploadFile = new File(FilePath);
    FileInputStream fis = null;
   
    try
    {
        fis = new FileInputStream(uploadFile);
        boolean isSuccess = ftp.storeFile(uploadFile.getName(), fis);
        if (isSuccess)
        {
            System.out.println("Upload Success");
        }
    } catch (IOException ex)
    {
        System.out.println(ex.getMessage());
    } finally
    {
        if (fis != null)
            try
            {
                fis.close();
            } catch (IOException ex) {}
    }
    ftp.logout();
} catch (SocketException e)
{
    System.out.println("Socket:" + e.getMessage());
} catch (IOException e)
{
    System.out.println("IO:" + e.getMessage());
} finally
{
    if (ftp != null && ftp.isConnected())
    {
        try
        {
            ftp.disconnect();
        } catch (IOException e)
        {
        }
    }
}
*/
%>


<script type="text/javascript" src="../../js/jquery-2.1.4.min.js"></script>
<script src="../../js/oz.agent.js"></script>
<script src="../../js/oz.framework.js"></script>
<script src="../../js/oz.controls.js"></script>
<script type="text/javascript" src="../../js/web/jquery-ui.min.js"></script>
<script type="text/javascript" src="../../js/web/web_controller.js"></script>
<script type="text/javascript" src="../../js/web/web_function.js"></script>

<script type="text/javascript">
console.log("============파일 업로드 실행================");
console.log("flag="+"<%=flag%>");
console.log("fileName1="+"<%=fileName1%>");
console.log("originalName1="+"<%=originalName1%>");
console.log("fileType="+"<%=fileType%>");
console.log("fileName2="+"<%=fileName2%>");
console.log("originalName2="+"<%=originalName2%>");
console.log("fileType2="+"<%=fileType2%>");
console.log("msg="+"<%=msg%>");
console.log("msg2="+"<%=msg2%>");


if("<%=flag%>" == "Y"){
	//cmdMessage(0,"파일 전송 완료");
	
	//$("#act_id",parent).val(act_id);
	parent.msgProcess();
}else{
	cmdMessage(0,"파일 전송 실패\n\n"+"<%=flag%>");
}


if("<%=flag2%>" == "Y"){
	//cmdMessage(0,"파일 전송 완료");
	
	//$("#act_id",parent).val(act_id);
	//parent.msgProcess();
}else{
	cmdMessage(0,"파일 전송 실패\n\n"+"<%=flag2%>");
}

</script>
