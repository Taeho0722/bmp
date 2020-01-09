<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
	String test = request.getParameter("test");
	String test1 = request.getParameter("test1");
	String test2 = request.getParameter("test2");
	
	System.out.println("test = "+test);
	System.out.println("test1 = "+test1);
	System.out.println("test2 = "+test2);

%>

<p class="tit">타이틀</p>
<a href="javascript:popupClose();" class="close_btn">닫기</a>
<div id="testValue" class="test1">팝업 자식 한글 값</div>
<div id="testValue2">1213</div>