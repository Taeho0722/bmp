<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<!DOCTYPE html>
<html lang="ko">
 <head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <link rel="stylesheet" href="css/style.css">
  <title>혜택보기</title>
  <%@ include file="./common/common_util.jsp" %><!-- Web 전용 컨트롤 -->
  <script type="text/javascript">
  
  
  
  /**========================================================================================
  * 검색(팝업 닫기)
  ========================================================================================*/
  function popupClose() {
  	 window.opener.popupImageRemove();
  	 window.close();
  }

  
  </script>
  </head>
  <body onbeforeunload="javascript:popupClose();">
    <div id="layer_benefit" class="layer_window" style="display:block">
      <p class="tit">등급별 혜택<a href="javascript:popupClose();" class="btn_close">닫기</a></p>
      <div class="benefit_cnt">
        <table class="benefitTb">
          <tbody>
            <tr>
              <td class="bor0" colspan="2">혜택</td>
              <td colspan="3"><img src="../../img/web/icon/level5_1.png" alt="LEVEL5max"></td>
              <td colspan="3"><img src="../../img/web/icon/level4_1.png" alt="LEVEL4"></td>
              <td colspan="3"><img src="../../img/web/icon/level3_1.png" alt="LEVEL3"></td>
              <td colspan="3"><img src="../../img/web/icon/level2_1.png" alt="LEVEL2"></td>
              <td colspan="2"><img src="../../img/web/icon/level1_1.png" alt="LEVEL1"></td>
            </tr>
            <tr>
              <td class="bor0" rowspan="2"><div class="benefit1">할인쿠폰</div></td>
              <td>정률</td>
              
              <!-- 레벨5 -->
              <td>
                <p class="coupon1">5%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">7%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">10%</p>
                <span>최대할인액 70,000원</span>
              </td>
              
              
              <!-- 레벨4 -->
              <td>
                <p class="coupon1">5%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">7%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">10%</p>
                <span>최대할인액 50,000원</span>
              </td>
              
              
              <!-- 레벨3 -->
              <td>
                <p class="coupon1">5%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">7%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">10%</p>
                <span>최대할인액 50,000원</span>
              </td>
              
              
              <!-- 레벨2 -->
              <td>
                <p class="coupon1">3%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">5%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">7%</p>
                <span>최대할인액 50,000원</span>
              </td>
              
              
              <!-- 레벨1 -->
              <td>
                <p class="coupon1">3%</p>
                <span>최대할인액 50,000원</span>
              </td>
              <td>
                <p class="coupon1">5%</p>
                <span>최대할인액 50,000원</span>
              </td>
              
              
              
            </tr>
            <tr>
              <td>정액</td>
              
              <!-- 레벨5 -->
              <td>
                <p class="coupon2">5,000원</p>
                <span>최소구매액 50,000원</span>
              </td>
              <td>
                <p class="coupon2">10,000원</p>
                <span>최소구매액 50,000원</span>
              </td>
              <td>
                <p class="coupon2">20,000원</p>
                <span>최소구매액 100,000원</span>
              </td>
              
              
              <!-- 레벨4 -->
              <td>
                <p class="coupon2">5,000원</p>
                <span>최소구매액 50,000원</span>
              </td>
              <td>
                <p class="coupon2">10,000원</p>
                <span>최소구매액 50,000원</span>
              </td>
              <td>
                <p class="coupon2">20,000원</p>
                <span>최소구매액 100,000원</span>
              </td>
              
              
              <!-- 레벨3 -->
              <td>
                <p class="coupon2">5,000원</p>
                <span>최소구매액 50,000원</span>
              </td>
              <td>
                <p class="coupon2">10,000원</p>
                <span>최소구매액 50,000원</span>
              </td>
              <td>
                <p class="coupon2">20,000원</p>
                <span>최소구매액 150,000원</span>
              </td>
              
              
              <!-- 레벨2 -->
              <td>
                <p class="coupon2">2,000원</p>
                <span>최소구매액 20,000원</span>
              </td>
              <td>
                <p class="coupon2">3,000원</p>
                <span>최소구매액 30,000원</span>
              </td>
              <td>
                <p class="coupon2">5,000원</p>
                <span>최소구매액 50,000원</span>
              </td>
              
              
              <!-- 레벨1 -->
              <td>
                <p class="coupon2">2,000원</p>
                <span>최소구매액 20,000원</span>
              </td>
              <td>
                <p class="coupon2">3,000원</p>
                <span>최소구매액 30,000원</span>
              </td>
              
              
            </tr>
            <tr>
              <td class="bor0" rowspan="2"><div class="benefit2">사은행사</div></td>
              <td>증정률</td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">7%</p></td>
                      <td><p class="coupon3">5%</p></td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="33.333%">
                    <col width="33.333%">
                    <col width="33.333%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>  
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="50%">
                    <col width="50%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td><p class="coupon3">5%</p></td>
                      <td><p class="coupon3">5%</p></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>구간대</td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>20/40/60/100만원</td>
                      <td>30/60/100만원</td>
                      <td>30/60/100만원</td>
                      <td>30/60/100/200/300/500/1,000만원</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>20/40/60/100만원</td>
                      <td>30/60/100만원</td>
                      <td>30/60/100만원</td>
                      <td>30/60/100/200/300/500/1,000만원</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                    <col width="25%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>10/20만원</td>
                      <td>20/40/60/100만원</td>
                      <td>30/60/100만원</td>
                      <td>100/200/300/500/1,000만원</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="33.333%">
                    <col width="33.333%">
                    <col width="33.333%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>10/20만원</td>
                      <td>20/40만원</td>
                      <td>20/40/60/100만원</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colspan="3" class="pd0">
                <table>
                  <colgroup>
                    <col width="50%">
                    <col width="50%">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>20/40만원</td>
                      <td>30/60/100만원</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td class="bor0" rowspan="2"><div class="benefit3">세일리지</div></td>
              <td>할인율</td>
              <td colspan="3">7%정상</td>
              <td colspan="3">7%정상</td>
              <td colspan="3">5%정상</td>
              <td colspan="3">5%정상</td>
              <td colspan="3">5%정상</td>
            </tr>
            <tr>
              <td>한도</td>
              <td colspan="3">100만원</td>
              <td colspan="3">50만원</td>
              <td colspan="3">100만원</td>
              <td colspan="3">50만원</td>
              <td colspan="3">50만원</td>
            </tr>
            <tr>
              <td class="bor0" rowspan="2"><div class="benefit4">마일리지</div></td>
              <td>증정율</td>
              <td colspan="3">7%</td>
              <td colspan="3">7%</td>
              <td colspan="3">5%</td>
              <td colspan="3">5%</td>
              <td colspan="3">5%</td>
            </tr>
            <tr>
              <td>증정기준</td>
              <td colspan="3">100만원</td>
              <td colspan="3">500만원</td>
              <td colspan="3">300만원</td>
              <td colspan="3">500만원</td>
              <td colspan="3">500만원</td>
            </tr>
            <tr>
              <td class="bor0" rowspan="2"><div class="benefit5">멤버스바</div></td>
              <td>횟수</td>
              <td colspan="3">3회</td>
              <td colspan="3">2회</td>
              <td colspan="3">2회</td>
              <td colspan="3">1회</td>
              <td colspan="3">1회</td>
            </tr>
            <tr>
              <td>잔수<span>(동반인포함)</span></td>
              <td colspan="3">2잔</td>
              <td colspan="3">2잔</td>
              <td colspan="3">2잔</td>
              <td colspan="3">2잔</td>
              <td colspan="3">2잔</td>
            </tr>
            <tr>
              <td class="bor0" rowspan="2"><div class="benefit6">주차권</div></td>
              <td>횟수</td>
              <td colspan="3">1회</td>
              <td colspan="3">1회</td>
              <td colspan="3">1회</td>
              <td colspan="3">1회</td>
              <td colspan="3">1회</td>
            </tr>
            <tr>
              <td>시간</td>
              <td colspan="3">3시간</td>
              <td colspan="3">3시간</td>
              <td colspan="3">3시간</td>
              <td colspan="3">3시간</td>
              <td colspan="3">3시간</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pop_btn">
        <a href="javascript:popupClose();" class="btn_cancel">닫기</a>
      </div>
     </div>
  </body>
</html>
