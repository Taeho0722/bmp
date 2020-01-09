/**
* 1. JS Name		: base64init.js
* 2. Content		: TODO aes 공통 부분 정리
* 3. Table			:	
* 4. JAVA & JSP	: 
* 5. Author			: @author kimch 2015.10.19
* 6. mail 			: hujj@khu.ac.kr
*/ 

var Base64init = function(){
	var enc64List, dec64List;
};
Base64init.prototype = {
		encode64:function (str) {
		   this.enc64List = new Array();
		   this.dec64List = new Array();
		   var i;
		   for (i = 0; i < 26; i++) {
		      this.enc64List[this.enc64List.length] = String.fromCharCode(65 + i);
		   }
		   for (i = 0; i < 26; i++) {
		      this.enc64List[this.enc64List.length] = String.fromCharCode(97 + i);
		   }
		   for (i = 0; i < 10; i++) {
		      this.enc64List[this.enc64List.length] = String.fromCharCode(48 + i);
		   }
		   this.enc64List[this.enc64List.length] = "+";
		   this.enc64List[this.enc64List.length] = "/";
		   for (i = 0; i < 128; i++) {
		      this.dec64List[this.dec64List.length] = -1;
		   }
		   for (i = 0; i < 64; i++) {
		      this.dec64List[this.enc64List[i].charCodeAt(0)] = i;
		   }
		   var c, d, e, end = 0;
		   var u, v, w, x;
		   var ptr = -1;
		   var input = str.split("");
		   var output = "";
		   while(end == 0) {
		      c = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
		         ((end = 1) ? 0 : 0);
		      d = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
		         ((end += 1) ? 0 : 0);
		      e = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
		         ((end += 1) ? 0 : 0);
		      u = this.enc64List[c >> 2];
		      v = this.enc64List[(0x00000003 & c) << 4 | d >> 4];
		      w = this.enc64List[(0x0000000F & d) << 2 | e >> 6];
		      x = this.enc64List[e & 0x0000003F];
		      if (end >= 1) {x = "=";}
		      if (end == 2) {w = "=";}
		      if (end < 3) {output += u + v + w + x;}
		   }
		   return output;
		},
		decode64:function(str) {
				this.enc64List = new Array();
		   this.dec64List = new Array();
		   var i;
		   for (i = 0; i < 26; i++) {
		      this.enc64List[this.enc64List.length] = String.fromCharCode(65 + i);
		   }
		   for (i = 0; i < 26; i++) {
		      this.enc64List[this.enc64List.length] = String.fromCharCode(97 + i);
		   }
		   for (i = 0; i < 10; i++) {
		      this.enc64List[this.enc64List.length] = String.fromCharCode(48 + i);
		   }
		   this.enc64List[this.enc64List.length] = "+";
		   this.enc64List[this.enc64List.length] = "/";
		   for (i = 0; i < 128; i++) {
		      this.dec64List[this.dec64List.length] = -1;
		   }
		   for (i = 0; i < 64; i++) {
		      this.dec64List[this.enc64List[i].charCodeAt(0)] = i;
		   }
		   
		   var c=0, d=0, e=0, f=0, i=0, n=0;
		   var input = str.split("");
		   var output = "";
		   var ptr = 0;
		   do {
		      f = input[ptr++].charCodeAt(0);
		      i = this.dec64List[f];
		      if ( f >= 0 && f < 128 && i != -1 ) {
		         if ( n % 4 == 0 ) {
		            c = i << 2;
		         } else if ( n % 4 == 1 ) {
		            c = c | ( i >> 4 );
		            d = ( i & 0x0000000F ) << 4;
		         } else if ( n % 4 == 2 ) {
		            d = d | ( i >> 2 );
		            e = ( i & 0x00000003 ) << 6;
		         } else {
		            e = e | i;
		         }
		         n++;
		         if ( n % 4 == 0 ) {
		            output += String.fromCharCode(c) +
		                           String.fromCharCode(d) +
		                           String.fromCharCode(e);
		         }
		      }
		   }
		   while (typeof input[ptr] != "undefined");
		   output += (n % 4 == 3) ? String.fromCharCode(c) + String.fromCharCode(d) :
		                  ((n % 4 == 2) ? String.fromCharCode(c) : "");
		   return output;
	}
};
	