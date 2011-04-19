/**
 * Copyright (c) 2007-2010, Kaazing Corporation. All rights reserved.
 * 
 * Licensed under the Kaazing Corporation Developer Agreement (2010-02-22), see:
 * 
 *   http://www.kaazing.com/license
 */

var browser=null;
if(typeof (ActiveXObject)!="undefined"){
browser="ie";
}else{
if(Object.prototype.toString.call(window.opera)=="[object Opera]"){
browser="opera";
}else{
if(navigator.vendor.indexOf("Apple")!=-1){
browser="safari";
}else{
if(navigator.vendor.indexOf("Google")!=-1){
browser="chrome";
}else{
if(navigator.product=="Gecko"&&window.find&&!navigator.savePreferences){
browser="firefox";
}else{
throw new Error("couldn't detect browser");
}
}
}
}
}
switch(browser){
case "ie":
(function(){
if(document.createEvent===undefined){
var _1=function(){
};
_1.prototype.initEvent=function(_2,_3,_4){
this.type=_2;
this.bubbles=_3;
this.cancelable=_4;
};
document.createEvent=function(_5){
if(_5!="Events"){
throw new Error("Unsupported event name: "+_5);
}
return new _1();
};
}
document._w_3_c_d_o_m_e_v_e_n_t_s_createElement=document.createElement;
document.createElement=function(_6){
var _7=this._w_3_c_d_o_m_e_v_e_n_t_s_createElement(_6);
if(_7.addEventListener===undefined){
var _8={};
_7.addEventListener=function(_9,_a,_b){
return addEventListener(_8,_9,_a,_b);
};
_7.removeEventListener=function(_c,_d,_e){
return removeEventListener(_8,_c,_d,_e);
};
_7.dispatchEvent=function(_f){
return dispatchEvent(_8,_f);
};
}
return _7;
};
if(window.addEventListener===undefined){
var _10=document.createElement("div");
var _11=(typeof (postMessage)==="undefined");
window.addEventListener=function(_12,_13,_14){
if(_11&&_12=="message"){
_10.addEventListener(_12,_13,_14);
}else{
window.attachEvent("on"+_12,_13);
}
};
window.removeEventListener=function(_15,_16,_17){
if(_11&&_15=="message"){
_10.removeEventListener(_15,_16,_17);
}else{
window.detachEvent("on"+_15,_16);
}
};
window.dispatchEvent=function(_18){
if(_11&&_18.type=="message"){
_10.dispatchEvent(_18);
}else{
window.fireEvent("on"+_18.type,_18);
}
};
}
function addEventListener(_19,_1a,_1b,_1c){
if(_1c){
throw new Error("Not implemented");
}
var _1d=_19[_1a]||{};
_19[_1a]=_1d;
_1d[_1b]=_1b;
};
function removeEventListener(_1e,_1f,_20,_21){
if(_21){
throw new Error("Not implemented");
}
var _22=_1e[_1f]||{};
delete _22[_20];
};
function dispatchEvent(_23,_24){
var _25=_24.type;
var _26=_23[_25]||{};
for(var key in _26){
if(typeof (_26[key])=="function"){
try{
_26[key](_24);
}
catch(e){
}
}
}
};
})();
break;
case "chrome":
case "safari":
if(typeof (window.postMessage)==="undefined"&&typeof (window.dispatchEvent)==="undefined"&&typeof (document.dispatchEvent)==="function"){
window.dispatchEvent=function(_28){
document.dispatchEvent(_28);
};
var addEventListener0=window.addEventListener;
window.addEventListener=function(_29,_2a,_2b){
if(_29==="message"){
document.addEventListener(_29,_2a,_2b);
}else{
addEventListener0.call(window,_29,_2a,_2b);
}
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_2c,_2d,_2e){
if(_2c==="message"){
document.removeEventListener(_2c,_2d,_2e);
}else{
removeEventListener0.call(window,_2c,_2d,_2e);
}
};
}
break;
case "opera":
var addEventListener0=window.addEventListener;
window.addEventListener=function(_2f,_30,_31){
var _32=_30;
if(_2f==="message"){
_32=function(_33){
if(_33.origin===undefined&&_33.uri!==undefined){
var uri=new URI(_33.uri);
delete uri.path;
delete uri.query;
delete uri.fragment;
_33.origin=uri.toString();
}
return _30(_33);
};
_30._$=_32;
}
addEventListener0.call(window,_2f,_32,_31);
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_35,_36,_37){
var _38=_36;
if(_35==="message"){
_38=_36._$;
}
removeEventListener0.call(window,_35,_38,_37);
};
break;
}
function URI(str){
str=str||"";
var _3a=0;
var _3b=str.indexOf("://");
if(_3b!=-1){
this.scheme=str.slice(0,_3b);
_3a=_3b+3;
var _3c=str.indexOf("/",_3a);
if(_3c==-1){
_3c=str.length;
str+="/";
}
var _3d=str.slice(_3a,_3c);
this.authority=_3d;
_3a=_3c;
this.host=_3d;
var _3e=_3d.indexOf(":");
if(_3e!=-1){
this.host=_3d.slice(0,_3e);
this.port=parseInt(_3d.slice(_3e+1),10);
if(isNaN(this.port)){
throw new Error("Invalid URI syntax");
}
}
}
var _3f=str.indexOf("?",_3a);
if(_3f!=-1){
this.path=str.slice(_3a,_3f);
_3a=_3f+1;
}
var _40=str.indexOf("#",_3a);
if(_40!=-1){
if(_3f!=-1){
this.query=str.slice(_3a,_40);
}else{
this.path=str.slice(_3a,_40);
}
_3a=_40+1;
this.fragment=str.slice(_3a);
}else{
if(_3f!=-1){
this.query=str.slice(_3a);
}else{
this.path=str.slice(_3a);
}
}
};
(function(){
var _41=URI.prototype;
_41.toString=function(){
var sb=[];
var _43=this.scheme;
if(_43!==undefined){
sb.push(_43);
sb.push("://");
sb.push(this.host);
var _44=this.port;
if(_44!==undefined){
sb.push(":");
sb.push(_44.toString());
}
}
if(this.path!==undefined){
sb.push(this.path);
}
if(this.query!==undefined){
sb.push("?");
sb.push(this.query);
}
if(this.fragment!==undefined){
sb.push("#");
sb.push(this.fragment);
}
return sb.join("");
};
var _45={"http":80,"ws":80,"https":443,"wss":443};
})();
(function(){
Base64={};
Base64.encode=function(_46){
var _47=[];
var _48;
var _49;
var _4a;
while(_46.length){
switch(_46.length){
case 1:
_48=_46.shift();
_47.push(_4b[(_48>>2)&63]);
_47.push(_4b[((_48<<4)&48)]);
_47.push("=");
_47.push("=");
break;
case 2:
_48=_46.shift();
_49=_46.shift();
_47.push(_4b[(_48>>2)&63]);
_47.push(_4b[((_48<<4)&48)|((_49>>4)&15)]);
_47.push(_4b[(_49<<2)&60]);
_47.push("=");
break;
default:
_48=_46.shift();
_49=_46.shift();
_4a=_46.shift();
_47.push(_4b[(_48>>2)&63]);
_47.push(_4b[((_48<<4)&48)|((_49>>4)&15)]);
_47.push(_4b[((_49<<2)&60)|((_4a>>6)&3)]);
_47.push(_4b[_4a&63]);
break;
}
}
return _47.join("");
};
Base64.decode=function(_4c){
if(_4c.length===0){
return [];
}
if(_4c.length%4!==0){
throw new Error("Invalid base64 string (must be quads)");
}
var _4d=[];
for(var i=0;i<_4c.length;i+=4){
var _4f=_4c.charAt(i);
var _50=_4c.charAt(i+1);
var _51=_4c.charAt(i+2);
var _52=_4c.charAt(i+3);
var _53=_54[_4f];
var _55=_54[_50];
var _56=_54[_51];
var _57=_54[_52];
_4d.push(((_53<<2)&252)|((_55>>4)&3));
if(_51!="="){
_4d.push(((_55<<4)&240)|((_56>>2)&15));
if(_52!="="){
_4d.push(((_56<<6)&192)|(_57&63));
}
}
}
return _4d;
};
var _4b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var _54={"=":0};
for(var i=0;i<_4b.length;i++){
_54[_4b[i]]=i;
}
if(typeof (window.btoa)==="undefined"){
window.btoa=function(s){
var _5a=s.split("");
for(var i=0;i<_5a.length;i++){
_5a[i]=(_5a[i]).charCodeAt();
}
return Base64.encode(_5a);
};
window.atob=function(_5c){
var _5d=Base64.decode(_5c);
for(var i=0;i<_5d.length;i++){
_5d[i]=String.fromCharCode(_5d[i]);
}
return _5d.join("");
};
}
})();
var postMessage0=(function(){
var _5f=new URI((browser=="ie")?document.URL:location.href);
var _60={"http":80,"https":443};
if(_5f.port==null){
_5f.port=_60[_5f.scheme];
_5f.authority=_5f.host+":"+_5f.port;
}
var _61=_5f.scheme+"://"+_5f.authority;
var _62="/.kr";
if(typeof (postMessage)!=="undefined"){
return function(_63,_64,_65){
if(typeof (_64)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
switch(browser){
case "ie":
case "opera":
case "firefox":
setTimeout(function(){
_63.postMessage(_64,_65);
},0);
break;
default:
_63.postMessage(_64,_65);
break;
}
};
}else{
function MessagePipe(_66){
this.sourceToken=toPaddedHex(Math.floor(Math.random()*(Math.pow(2,32)-1)),8);
this.iframe=_66;
this.bridged=false;
this.lastWrite=0;
this.lastRead=0;
this.lastReadIndex=2;
this.lastSyn=0;
this.lastAck=0;
this.queue=[];
this.escapedFragments=[];
};
var _67=MessagePipe.prototype;
_67.attach=function(_68,_69,_6a,_6b,_6c,_6d){
this.target=_68;
this.targetOrigin=_69;
this.targetToken=_6a;
this.reader=_6b;
this.writer=_6c;
this.writerURL=_6d;
try{
this._lastHash=_6b.location.hash;
this.poll=pollLocationHash;
}
catch(permissionDenied){
this._lastDocumentURL=_6b.document.URL;
this.poll=pollDocumentURL;
}
if(_68==parent){
dequeue(this,true);
}
};
_67.detach=function(){
this.poll=function(){
};
delete this.target;
delete this.targetOrigin;
delete this.reader;
delete this.lastFragment;
delete this.writer;
delete this.writerURL;
};
_67.poll=function(){
};
function pollLocationHash(){
var _6e=this.reader.location.hash;
if(this._lastHash!=_6e){
process(this,_6e.substring(1));
this._lastHash=_6e;
}
};
function pollDocumentURL(){
var _6f=this.reader.document.URL;
if(this._lastDocumentURL!=_6f){
var _70=_6f.indexOf("#");
if(_70!=-1){
process(this,_6f.substring(_70+1));
this._lastDocumentURL=_6f;
}
}
};
_67.post=function(_71,_72,_73){
bridgeIfNecessary(this,_71);
var _74=1000;
var _75=escape(_72);
var _76=[];
while(_75.length>_74){
var _77=_75.substring(0,_74);
_75=_75.substring(_74);
_76.push(_77);
}
_76.push(_75);
this.queue.push([_73,_76]);
if(this.writer!=null&&this.lastAck>=this.lastSyn){
dequeue(this,false);
}
};
function bridgeIfNecessary(_78,_79){
if(_78.lastWrite<1&&!_78.bridged){
if(_79.parent==window){
var src=_78.iframe.src;
var _7b=src.split("#");
var _7c=null;
var _7d=document.getElementsByTagName("meta");
for(var i=0;i<_7d.length;i++){
if(_7d[i].name=="kaazing:resources"){
alert("kaazing:resources is no longer supported. Please refer to the Administrator's Guide section entitled \"Configuring a Web Server to Integrate with Kaazing Gateway\"");
}
}
var _7f=_61;
var _80=_7f.toString()+_62+"?.kr=xsp&.kv=10.05";
if(_7c){
var _81=new URI(_7f.toString());
var _7b=_7c.split(":");
_81.host=_7b.shift();
if(_7b.length){
_81.port=_7b.shift();
}
_80=_81.toString()+_62+"?.kr=xsp&.kv=10.05";
}
for(var i=0;i<_7d.length;i++){
if(_7d[i].name=="kaazing:postMessageBridgeURL"){
var _82=_7d[i].content;
var _83=new URI(_82);
var _84=new URI(location.toString());
if(!_83.authority){
_83.host=_84.host;
_83.port=_84.port;
_83.scheme=_84.scheme;
if(_82.indexOf("/")!=0){
var _85=_84.path.split("/");
_85.pop();
_85.push(_82);
_83.path=_85.join("/");
}
}
postMessage0.BridgeURL=_83.toString();
}
}
if(postMessage0.BridgeURL){
_80=postMessage0.BridgeURL;
}
var _86=["I",_7f,_78.sourceToken,escape(_80)];
if(_7b.length>1){
var _87=_7b[1];
_86.push(escape(_87));
}
_7b[1]=_86.join("!");
setTimeout(function(){
_79.location.replace(_7b.join("#"));
},200);
_78.bridged=true;
}
}
};
function flush(_88,_89){
var _8a=_88.writerURL+"#"+_89;
_88.writer.location.replace(_8a);
};
function fromHex(_8b){
return parseInt(_8b,16);
};
function toPaddedHex(_8c,_8d){
var hex=_8c.toString(16);
var _8f=[];
_8d-=hex.length;
while(_8d-->0){
_8f.push("0");
}
_8f.push(hex);
return _8f.join("");
};
function dequeue(_90,_91){
var _92=_90.queue;
var _93=_90.lastRead;
if((_92.length>0||_91)&&_90.lastSyn>_90.lastAck){
var _94=_90.lastFrames;
var _95=_90.lastReadIndex;
if(fromHex(_94[_95])!=_93){
_94[_95]=toPaddedHex(_93,8);
flush(_90,_94.join(""));
}
}else{
if(_92.length>0){
var _96=_92.shift();
var _97=_96[0];
if(_97=="*"||_97==_90.targetOrigin){
_90.lastWrite++;
var _98=_96[1];
var _99=_98.shift();
var _9a=3;
var _94=[_90.targetToken,toPaddedHex(_90.lastWrite,8),toPaddedHex(_93,8),"F",toPaddedHex(_99.length,4),_99];
var _95=2;
if(_98.length>0){
_94[_9a]="f";
_90.queue.unshift(_96);
}
if(_90.resendAck){
var _9b=[_90.targetToken,toPaddedHex(_90.lastWrite-1,8),toPaddedHex(_93,8),"a"];
_94=_9b.concat(_94);
_95+=_9b.length;
}
flush(_90,_94.join(""));
_90.lastFrames=_94;
_90.lastReadIndex=_95;
_90.lastSyn=_90.lastWrite;
_90.resendAck=false;
}
}else{
if(_91){
_90.lastWrite++;
var _94=[_90.targetToken,toPaddedHex(_90.lastWrite,8),toPaddedHex(_93,8),"a"];
var _95=2;
if(_90.resendAck){
var _9b=[_90.targetToken,toPaddedHex(_90.lastWrite-1,8),toPaddedHex(_93,8),"a"];
_94=_9b.concat(_94);
_95+=_9b.length;
}
flush(_90,_94.join(""));
_90.lastFrames=_94;
_90.lastReadIndex=_95;
_90.resendAck=true;
}
}
}
};
function process(_9c,_9d){
var _9e=_9d.substring(0,8);
var _9f=fromHex(_9d.substring(8,16));
var _a0=fromHex(_9d.substring(16,24));
var _a1=_9d.charAt(24);
if(_9e!=_9c.sourceToken){
throw new Error("postMessage emulation tampering detected");
}
var _a2=_9c.lastRead;
var _a3=_a2+1;
if(_9f==_a3){
_9c.lastRead=_a3;
}
if(_9f==_a3||_9f==_a2){
_9c.lastAck=_a0;
}
if(_9f==_a3||(_9f==_a2&&_a1=="a")){
switch(_a1){
case "f":
var _a4=_9d.substr(29,fromHex(_9d.substring(25,29)));
_9c.escapedFragments.push(_a4);
dequeue(_9c,true);
break;
case "F":
var _a5=_9d.substr(29,fromHex(_9d.substring(25,29)));
if(_9c.escapedFragments!==undefined){
_9c.escapedFragments.push(_a5);
_a5=_9c.escapedFragments.join("");
_9c.escapedFragments=[];
}
var _a6=unescape(_a5);
dispatch(_a6,_9c.target,_9c.targetOrigin);
dequeue(_9c,true);
break;
case "a":
if(_9d.length>25){
process(_9c,_9d.substring(25));
}else{
dequeue(_9c,false);
}
break;
default:
throw new Error("unknown postMessage emulation payload type: "+_a1);
}
}
};
function dispatch(_a7,_a8,_a9){
var _aa=document.createEvent("Events");
_aa.initEvent("message",false,true);
_aa.data=_a7;
_aa.origin=_a9;
_aa.source=_a8;
dispatchEvent(_aa);
};
var _ab={};
var _ac=[];
function pollReaders(){
for(var i=0,len=_ac.length;i<len;i++){
var _af=_ac[i];
_af.poll();
}
setTimeout(pollReaders,20);
};
function findMessagePipe(_b0){
if(_b0==parent){
return _ab["parent"];
}else{
if(_b0.parent==window){
var _b1=document.getElementsByTagName("iframe");
for(var i=0;i<_b1.length;i++){
var _b3=_b1[i];
if(_b0==_b3.contentWindow){
return supplyIFrameMessagePipe(_b3);
}
}
}else{
throw new Error("Generic peer postMessage not yet implemented");
}
}
};
function supplyIFrameMessagePipe(_b4){
var _b5=_b4._name;
if(_b5===undefined){
_b5="iframe$"+String(Math.random()).substring(2);
_b4._name=_b5;
}
var _b6=_ab[_b5];
if(_b6===undefined){
_b6=new MessagePipe(_b4);
_ab[_b5]=_b6;
}
return _b6;
};
function postMessage0(_b7,_b8,_b9){
if(typeof (_b8)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_b7==window){
if(_b9=="*"||_b9==_61){
dispatch(_b8,window,_61);
}
}else{
var _ba=findMessagePipe(_b7);
_ba.post(_b7,_b8,_b9);
}
};
postMessage0.attach=function(_bb,_bc,_bd,_be,_bf,_c0){
var _c1=findMessagePipe(_bb);
_c1.attach(_bb,_bc,_bd,_be,_bf,_c0);
_ac.push(_c1);
};
var _c2=function(_c3){
var _c4=new URI((browser=="ie")?document.URL:location.href);
var _c5;
var _c6={"http":80,"https":443};
if(_c4.port==null){
_c4.port=_c6[_c4.scheme];
_c4.authority=_c4.host+":"+_c4.port;
}
var _c7=unescape(_c4.fragment||"");
if(_c7.length>0){
var _c8=_c7.split(",");
var _c9=_c8.shift();
var _ca=_c8.shift();
var _cb=_c8.shift();
var _cc=_c4.scheme+"://"+document.domain+":"+_c4.port;
var _cd=_c4.scheme+"://"+_c4.authority;
var _ce=_c9+"/.kr?.kr=xsc&.kv=10.05";
var _cf=document.location.toString().split("#")[0];
var _d0=_ce+"#"+escape([_cc,_ca,escape(_cf)].join(","));
if(typeof (ActiveXObject)!="undefined"){
_c5=new ActiveXObject("htmlfile");
_c5.open();
try{
_c5.parentWindow.opener=window;
}
catch(domainError){
if(_c3){
_c5.domain=_c3;
}
_c5.parentWindow.opener=window;
}
_c5.write("<html>");
_c5.write("<body>");
if(_c3){
_c5.write("<script>CollectGarbage();document.domain='"+_c3+"';</"+"script>");
}
_c5.write("<iframe src=\""+_ce+"\"></iframe>");
_c5.write("</body>");
_c5.write("</html>");
_c5.close();
var _d1=_c5.body.lastChild;
var _d2=_c5.parentWindow;
var _d3=parent;
var _d4=_d3.parent.postMessage0;
if(typeof (_d4)!="undefined"){
_d1.onload=function(){
var _d5=_d1.contentWindow;
_d5.location.replace(_d0);
_d4.attach(_d3,_c9,_cb,_d2,_d5,_ce);
};
}
}else{
var _d1=document.createElement("iframe");
_d1.src=_d0;
document.body.appendChild(_d1);
var _d2=window;
var _d6=_d1.contentWindow;
var _d3=parent;
var _d4=_d3.parent.postMessage0;
if(typeof (_d4)!="undefined"){
_d4.attach(_d3,_c9,_cb,_d2,_d6,_ce);
}
}
}
window.onunload=function(){
try{
var _d7=window.parent.parent.postMessage0;
if(typeof (_d7)!="undefined"){
_d7.detach(_d3);
}
}
catch(permissionDenied){
}
if(typeof (_c5)!=="undefined"){
_c5.parentWindow.opener=null;
_c5.open();
_c5.close();
_c5=null;
CollectGarbage();
}
};
};
postMessage0.__init__=function(_d8,_d9){
var _da=_c2.toString();
_d8.URI=URI;
_d8.browser=browser;
if(!_d9){
_d9="";
}
_d8.setTimeout("("+_da+")('"+_d9+"')",0);
};
postMessage0.bridgeURL=false;
postMessage0.detach=function(_db){
var _dc=findMessagePipe(_db);
for(var i=0;i<_ac.length;i++){
if(_ac[i]==_dc){
_ac.splice(i,1);
}
}
_dc.detach();
};
if(window!=top){
_ab["parent"]=new MessagePipe();
function initializeAsTargetIfNecessary(){
var _de=new URI((browser=="ie")?document.URL:location.href);
var _df=_de.fragment||"";
if(document.body!=null&&_df.length>0&&_df.charAt(0)=="I"){
var _e0=unescape(_df);
var _e1=_e0.split("!");
if(_e1.shift()=="I"){
var _e2=_e1.shift();
var _e3=_e1.shift();
var _e4=unescape(_e1.shift());
var _e5=_61;
if(_e2==_e5){
try{
parent.location.hash;
}
catch(permissionDenied){
document.domain=document.domain;
}
}
var _e6=_e1.shift()||"";
switch(browser){
case "firefox":
location.replace([location.href.split("#")[0],_e6].join("#"));
break;
default:
location.hash=_e6;
break;
}
var _e7=findMessagePipe(parent);
_e7.targetToken=_e3;
var _e8=_e7.sourceToken;
var _e9=_e4+"#"+escape([_e5,_e3,_e8].join(","));
var _ea;
_ea=document.createElement("iframe");
_ea.src=_e9;
_ea.style.position="absolute";
_ea.style.left="-10px";
_ea.style.top="10px";
_ea.style.visibility="hidden";
_ea.style.width="0px";
_ea.style.height="0px";
document.body.appendChild(_ea);
return;
}
}
setTimeout(initializeAsTargetIfNecessary,20);
};
initializeAsTargetIfNecessary();
}
var _eb=document.getElementsByTagName("meta");
for(var i=0;i<_eb.length;i++){
if(_eb[i].name==="kaazing:postMessage"){
if("immediate"==_eb[i].content){
var _ed=function(){
var _ee=document.getElementsByTagName("iframe");
for(var i=0;i<_ee.length;i++){
var _f0=_ee[i];
if(_f0.style["KaaPostMessage"]=="immediate"){
_f0.style["KaaPostMessage"]="none";
var _f1=supplyIFrameMessagePipe(_f0);
bridgeIfNecessary(_f1,_f0.contentWindow);
}
}
setTimeout(_ed,20);
};
setTimeout(_ed,20);
}
break;
}
}
for(var i=0;i<_eb.length;i++){
if(_eb[i].name==="kaazing:postMessagePrefix"){
var _f2=_eb[i].content;
if(_f2!=null&&_f2.length>0){
if(_f2.charAt(0)!="/"){
_f2="/"+_f2;
}
_62=_f2;
}
}
}
setTimeout(pollReaders,20);
return postMessage0;
}
})();
var XMLHttpRequest0=(function(){
var _f3=new URI((browser=="ie")?document.URL:location.href);
var _f4={"http":80,"https":443};
if(_f3.port==null){
_f3.port=_f4[_f3.scheme];
_f3.authority=_f3.host+":"+_f3.port;
}
var _f5={};
var _f6={};
var _f7=0;
function XMLHttpRequest0(){
if(browser=="firefox"&&typeof (Object.getPrototypeOf)=="function"){
var xhr=new XMLHttpRequest();
xhr.withCredentials=true;
return xhr;
}
};
var _f9=XMLHttpRequest0.prototype;
_f9.readyState=0;
_f9.responseText="";
_f9.status=0;
_f9.statusText="";
_f9.timeout=0;
_f9.onreadystatechange;
_f9.onerror;
_f9.onload;
_f9.onprogress;
_f9.open=function(_fa,_fb,_fc){
if(!_fc){
throw new Error("Asynchronous is required for cross-origin XMLHttpRequest emulation");
}
switch(this.readyState){
case 0:
case 4:
break;
default:
throw new Error("Invalid ready state");
}
if(_fb.indexOf(".kv=")==-1){
_fb+=((_fb.indexOf("?")==-1)?"?":"&")+".kv=10.05";
}else{
_fb=_fb.replace(/\.kv=[^&]*(.*)/,".kv=10.05$1");
}
var id=register(this);
var _fe=supplyPipe(this,_fb);
_fe.attach(id);
this._pipe=_fe;
this._requestHeaders=[];
this._method=_fa;
this._location=_fb;
this._responseHeaders=null;
this.readyState=1;
this.status=0;
this.statusText="";
this.responseText="";
var _ff=this;
setTimeout(function(){
_ff.readyState=1;
onreadystatechange(_ff);
},0);
};
_f9.setRequestHeader=function(_100,_101){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
this._requestHeaders.push([_100,_101]);
};
_f9.send=function(_102){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
var _103=this;
setTimeout(function(){
_103.readyState=2;
onreadystatechange(_103);
},0);
doSend(this,_102);
};
_f9.abort=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
};
_f9.getResponseHeader=function(_105){
if(this.status==0){
throw new Error("Invalid ready state");
}
var _106=this._responseHeaders;
return _106[_105];
};
_f9.getAllResponseHeaders=function(){
if(this.status==0){
throw new Error("Invalid ready state");
}
return null;
};
function onreadystatechange(_107){
if(typeof (_107.onreadystatechange)!=="undefined"){
_107.onreadystatechange();
}
switch(_107.readyState){
case 3:
if(typeof (_107.onprogress)!=="undefined"){
_107.onprogress();
}
break;
case 4:
switch(Math.floor(_107.status/100)){
case 0:
case 5:
if(typeof (_107.onerror)!=="undefined"){
_107.onerror();
}
break;
default:
if(typeof (_107.onprogress)!=="undefined"){
_107.onprogress();
}
if(typeof (_107.onload)!=="undefined"){
_107.onload();
}
break;
}
break;
}
};
function register(_108){
var id=toPaddedHex(_f7++,8);
_f6[id]=_108;
_108._id=id;
return id;
};
function doSend(_10a,_10b){
if(typeof (_10b)!=="string"){
_10b="";
}
var _10c=_10a._method.substring(0,10);
var _10d=_10a._location;
var _10e=_10a._requestHeaders;
var _10f=toPaddedHex(_10a.timeout,4);
var _110=(_10a.onprogress!==undefined)?"t":"f";
var _111=["s",_10a._id,_10c.length,_10c,toPaddedHex(_10d.length,4),_10d,toPaddedHex(_10e.length,4)];
for(var i=0;i<_10e.length;i++){
var _113=_10e[i];
_111.push(toPaddedHex(_113[0].length,4));
_111.push(_113[0]);
_111.push(toPaddedHex(_113[1].length,4));
_111.push(_113[1]);
}
_111.push(toPaddedHex(_10b.length,8),_10b,toPaddedHex(_10f,4),_110);
_10a._pipe.post(_111.join(""));
};
function supplyPipe(_114,_115){
var uri=new URI(_115);
var _117=(uri.scheme!=null&&uri.authority!=null);
var _118=_117?uri.scheme:_f3.scheme;
var _119=_117?uri.authority:_f3.authority;
if(_119!=null&&uri.port==null){
_119=uri.host+":"+_f4[_118];
}
var _11a=_118+"://"+_119;
var pipe=_f5[_11a];
if(pipe===undefined){
var _11c=document.createElement("iframe");
_11c.style.position="absolute";
_11c.style.left="-10px";
_11c.style.top="10px";
_11c.style.visibility="hidden";
_11c.style.width="0px";
_11c.style.height="0px";
var _11d=new URI(_11a);
_11d.query=".kr=xs&.kv=10.05";
_11d.path="/";
_11c.src=_11d.toString();
function post(_11e){
this.buffer.push(_11e);
};
function attach(id){
var _120=this.attached[id];
if(_120===undefined){
_120={};
this.attached[id]=_120;
}
if(_120.timerID!==undefined){
clearTimeout(_120.timerID);
delete _120.timerID;
}
};
function detach(id){
var _122=this.attached[id];
if(_122!==undefined&&_122.timerID===undefined){
var _123=this;
_122.timerID=setTimeout(function(){
delete _123.attached[id];
var xhr=_f6[id];
if(xhr._pipe==pipe){
delete _f6[id];
delete xhr._id;
delete xhr._pipe;
}
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},10000);
}
};
pipe={"targetOrigin":_11a,"iframe":_11c,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_f5[_11a]=pipe;
function sendInitWhenReady(){
var _125=_11c.contentWindow;
if(!_125){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_125,"I",_11a);
}
};
pipe.handshakeID=setTimeout(function(){
_f5[_11a]=undefined;
pipe.post=function(_126){
_114.readyState=4;
_114.status=0;
onreadystatechange(_114);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_11c);
sendInitWhenReady();
}
return pipe;
};
function onmessage(_127){
var _128=_127.origin;
var _129={"http":":80","https":":443"};
var _12a=_128.split(":");
if(_12a.length===2){
_128+=_129[_12a[0]];
}
var pipe=_f5[_128];
if(pipe!==undefined&&pipe.iframe!==undefined&&_127.source==pipe.iframe.contentWindow){
if(_127.data=="I"){
clearTimeout(pipe.handshakeID);
var _12c;
while((_12c=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_12c,pipe.targetOrigin);
}
pipe.post=function(_12d){
postMessage0(pipe.iframe.contentWindow,_12d,pipe.targetOrigin);
};
}else{
var _12c=_127.data;
if(_12c.length>=9){
var _12e=0;
var type=_12c.substring(_12e,_12e+=1);
var id=_12c.substring(_12e,_12e+=8);
var _131=_f6[id];
if(_131!==undefined){
switch(type){
case "r":
var _132={};
var _133=fromHex(_12c.substring(_12e,_12e+=2));
for(var i=0;i<_133;i++){
var _135=fromHex(_12c.substring(_12e,_12e+=4));
var _136=_12c.substring(_12e,_12e+=_135);
var _137=fromHex(_12c.substring(_12e,_12e+=4));
var _138=_12c.substring(_12e,_12e+=_137);
_132[_136]=_138;
}
var _139=fromHex(_12c.substring(_12e,_12e+=4));
var _13a=fromHex(_12c.substring(_12e,_12e+=2));
var _13b=_12c.substring(_12e,_12e+=_13a);
switch(_139){
case 301:
case 302:
case 307:
var _13c=_132["Location"];
var id=register(_131);
var pipe=supplyPipe(_131,_13c);
pipe.attach(id);
_131._pipe=pipe;
_131._method="GET";
_131._location=_13c;
_131._redirect=true;
break;
default:
_131._responseHeaders=_132;
_131.status=_139;
_131.statusText=_13b;
break;
}
break;
case "p":
var _13d=parseInt(_12c.substring(_12e,_12e+=1));
if(_131._id===id){
_131.readyState=_13d;
var _13e=fromHex(_12c.substring(_12e,_12e+=8));
var _13f=_12c.substring(_12e,_12e+=_13e);
if(_13f.length>0){
_131.responseText+=_13f;
}
onreadystatechange(_131);
}else{
if(_131._redirect){
_131._redirect=false;
doSend(_131,"");
}
}
if(_13d==4){
pipe.detach(id);
}
break;
case "e":
if(_131._id===id){
_131.status=0;
_131.statusText="";
_131.readyState=4;
onreadystatechange(_131);
}
pipe.detach(id);
break;
case "t":
if(_131._id===id){
_131.status=0;
_131.statusText="";
_131.readyState=4;
if(typeof (_131.ontimeout)!=="undefined"){
_131.ontimeout();
}
}
pipe.detach(id);
break;
}
}
}
}
}else{
}
};
function fromHex(_140){
return parseInt(_140,16);
};
function toPaddedHex(_141,_142){
var hex=_141.toString(16);
var _144=[];
_142-=hex.length;
while(_142-->0){
_144.push("0");
}
_144.push(hex);
return _144.join("");
};
window.addEventListener("message",onmessage,false);
return XMLHttpRequest0;
})();
ByteOrder=function(){
};
(function(){
var _145=ByteOrder.prototype;
_145.toString=function(){
throw new Error("Abstract");
};
var _146=function(v){
return (v&255);
};
var _148=function(_149){
return (_149&128)?(_149|-256):_149;
};
var _14a=function(v){
return [((v>>8)&255),(v&255)];
};
var _14c=function(_14d,_14e){
return (_148(_14d)<<8)|(_14e&255);
};
var _14f=function(_150,_151){
return ((_150&255)<<8)|(_151&255);
};
var _152=function(v){
return [((v>>16)&255),((v>>8)&255),(v&255)];
};
var _154=function(_155,_156,_157){
return ((_155&255)<<16)|((_156&255)<<8)|(_157&255);
};
var _158=function(v){
return [((v>>24)&255),((v>>16)&255),((v>>8)&255),(v&255)];
};
var _15a=function(_15b,_15c,_15d,_15e){
return (_148(_15b)<<24)|((_15c&255)<<16)|((_15d&255)<<8)|(_15e&255);
};
var _15f=function(_160,_161,_162,_163){
var _164=_14f(_160,_161);
var _165=_14f(_162,_163);
return (_164*65536+_165);
};
var _166=function(v){
var v1=Math.floor(v/4294967296);
var v0=v%4294967296;
var a1=_158(v1);
var a2=_158(v0);
return a1.concat(a2);
};
var _16c=function(_16d,_16e,_16f,_170,_171,_172,_173,_174){
var v1=_15a(_16d,_16e,_16f,_170);
var v0=_15f(_171,_172,_173,_174);
return (v1*4294967296+v0);
};
ByteOrder.BIG_ENDIAN=(function(){
var _177=function(){
};
_177.prototype=new ByteOrder();
var _178=_177.prototype;
_178._toUnsignedByte=_146;
_178._toByte=_148;
_178._fromShort=_14a;
_178._toShort=_14c;
_178._toUnsignedShort=_14f;
_178._fromMediumInt=_152;
_178._toMediumInt=_154;
_178._fromInt=_158;
_178._toInt=_15a;
_178._toUnsignedInt=_15f;
_178._fromLong=_166;
_178._toLong=_16c;
_178.toString=function(){
return "<ByteOrder.BIG_ENDIAN>";
};
return new _177();
})();
ByteOrder.LITTLE_ENDIAN=(function(){
var _179=function(){
};
_179.prototype=new ByteOrder();
var _17a=_179.prototype;
_17a._toByte=_148;
_17a._toUnsignedByte=_146;
_17a._fromShort=function(v){
return _14a(v).reverse();
};
_17a._toShort=function(_17c,_17d){
return _14c(_17d,_17c);
};
_17a._toUnsignedShort=function(_17e,_17f){
return _14f(_17f,_17e);
};
_17a._fromMediumInt=function(v){
return _152(v).reverse();
};
_17a._toMediumInt=function(_181,_182,_183,_184,_185,_186){
return _154(_186,_185,_184,_183,_182,_181);
};
_17a._fromInt=function(v){
return _158(v).reverse();
};
_17a._toInt=function(_188,_189,_18a,_18b){
return _15a(_18b,_18a,_189,_188);
};
_17a._toUnsignedInt=function(_18c,_18d,_18e,_18f){
return _15f(_18f,_18e,_18d,_18c);
};
_17a._fromLong=function(v){
return _166(v).reverse();
};
_17a._toLong=function(_191,_192,_193,_194,_195,_196,_197,_198){
return _16c(_198,_197,_196,_195,_194,_193,_192,_191);
};
_17a.toString=function(){
return "<ByteOrder.LITTLE_ENDIAN>";
};
return new _179();
})();
})();
function ByteBuffer(_199){
this.array=_199||[];
this._mark=-1;
this.limit=this.capacity=this.array.length;
this.order=ByteOrder.BIG_ENDIAN;
};
(function(){
ByteBuffer.allocate=function(_19a){
var buf=new ByteBuffer();
buf.capacity=_19a;
return buf;
};
ByteBuffer.wrap=function(_19c){
return new ByteBuffer(_19c);
};
var _19d=ByteBuffer.prototype;
_19d.autoExpand=true;
_19d.capacity=0;
_19d.position=0;
_19d.limit=0;
_19d.order=ByteOrder.BIG_ENDIAN;
_19d.array=[];
_19d.mark=function(){
this._mark=this.position;
return this;
};
_19d.reset=function(){
var m=this._mark;
if(m<0){
throw new Error("Invalid mark");
}
this.position=m;
return this;
};
_19d.compact=function(){
this.array.splice(0,this.position);
this.limit-=this.position;
this.position=0;
return this;
};
_19d.duplicate=function(){
var buf=new ByteBuffer(this.array);
buf.position=this.position;
buf.limit=this.limit;
buf.capacity=this.capacity;
return buf;
};
_19d.fill=function(size){
_autoExpand(this,size);
while(size-->0){
this.put(0);
}
return this;
};
_19d.fillWith=function(b,size){
_autoExpand(this,size);
while(size-->0){
this.put(b);
}
return this;
};
_19d.indexOf=function(b){
var _1a4=this.limit;
var _1a5=this.array;
for(var i=this.position;i<_1a4;i++){
if(_1a5[i]==b){
return i;
}
}
return -1;
};
_19d.put=function(v){
_autoExpand(this,1);
this.putAt(this.position++,v);
return this;
};
_19d.putAt=function(i,v){
_checkIndex(this,i);
this.array[i]=this.order._toUnsignedByte(v);
return this;
};
_19d.putShort=function(v){
_autoExpand(this,2);
this.putShortAt(this.position,v);
this.position+=2;
return this;
};
_19d.putShortAt=function(i,v){
this.putBytesAt(i,this.order._fromShort(v));
return this;
};
_19d.putMediumInt=function(v){
_autoExpand(this,3);
this.putMediumIntAt(this.position,v);
this.position+=3;
return this;
};
_19d.putMediumIntAt=function(i,v){
this.putBytesAt(i,this.order._fromMediumInt(v));
return this;
};
_19d.putInt=function(v){
_autoExpand(this,4);
this.putIntAt(this.position,v);
this.position+=4;
return this;
};
_19d.putIntAt=function(i,v){
this.putBytesAt(i,this.order._fromInt(v));
return this;
};
_19d.putLong=function(v){
_autoExpand(this,8);
this.putLongAt(this.position,v);
this.position+=8;
return this;
};
_19d.putLongAt=function(i,v){
this.putBytesAt(i,this.order._fromLong(v));
return this;
};
_19d.putString=function(v,cs){
cs.encode(v,this);
return this;
};
_19d.putPrefixedString=function(_1b8,v,cs){
if(typeof (cs)==="undefined"||typeof (cs.encode)==="undefined"){
throw new Error("ByteBuffer.putPrefixedString: character set parameter missing");
}
if(_1b8===0){
return this;
}
_autoExpand(this,_1b8);
var len=v.length;
switch(_1b8){
case 1:
this.put(len);
break;
case 2:
this.putShort(len);
break;
case 4:
this.putInt(len);
break;
}
cs.encode(v,this);
return this;
};
_19d.putBytes=function(v){
_autoExpand(this,v.length);
this.putBytesAt(this.position,v);
this.position+=v.length;
return this;
};
_19d.putBytesAt=function(i,v){
for(var j=0,k=i,len=v.length;j<len;j++,k++){
this.putAt(k,v[j]);
}
return this;
};
_19d.putBuffer=function(v){
this.putBytes(v.array.slice(v.position,v.limit));
return this;
};
_19d.putBufferAt=function(i,v){
this.putBytesAt(i,v.array.slice(v.position,v.limit));
return this;
};
_19d.get=function(){
return this.getAt(this.position++);
};
_19d.getAt=function(i){
return this.order._toByte(this.array[i]);
};
_19d.getShort=function(){
var val=this.getShortAt(this.position);
this.position+=2;
return val;
};
_19d.getShortAt=function(i){
var _1c8=this.array;
return this.order._toShort(_1c8[i++],_1c8[i++]);
};
_19d.getMediumInt=function(){
var val=this.getMediumIntAt(this.position);
this.position+=3;
return val;
};
_19d.getMediumIntAt=function(i){
var _1cb=this.array;
return this.order._toMediumInt(_1cb[i++],_1cb[i++],_1cb[i++]);
};
_19d.getInt=function(){
var val=this.getIntAt(this.position);
this.position+=4;
return val;
};
_19d.getIntAt=function(i){
var _1ce=this.array;
return this.order._toInt(_1ce[i++],_1ce[i++],_1ce[i++],_1ce[i++]);
};
_19d.getLong=function(){
var val=this.getLongAt(this.position);
this.position+=8;
return val;
};
_19d.getLongAt=function(i){
var _1d1=this.array;
return this.order._toLong(_1d1[i++],_1d1[i++],_1d1[i++],_1d1[i++],_1d1[i++],_1d1[i++],_1d1[i++],_1d1[i++]);
};
_19d.getUnsigned=function(){
return this.order._toUnsignedByte(this.array[this.position++]);
};
_19d.getUnsignedShort=function(){
var _1d2=this.array;
return this.order._toUnsignedShort(_1d2[this.position++],_1d2[this.position++]);
};
_19d.getUnsignedMediumInt=function(){
var _1d3=this.array;
return this.order._toUnsignedMediumInt(_1d3[this.position++],_1d3[this.position++],_1d3[this.position++]);
};
_19d.getUnsignedInt=function(){
var _1d4=this.array;
return this.order._toUnsignedInt(_1d4[this.position++],_1d4[this.position++],_1d4[this.position++],_1d4[this.position++]);
return val;
};
_19d.getPrefixedString=function(_1d5,cs){
var len=0;
switch(_1d5||2){
case 1:
len=this.getUnsigned();
break;
case 2:
len=this.getUnsignedShort();
break;
case 4:
len=this.getInt();
break;
}
if(len===0){
return "";
}
var _1d8=this.limit;
try{
this.limit=this.position+len;
return cs.decode(this);
}
finally{
this.limit=_1d8;
}
};
_19d.getString=function(cs){
var _1da=this.position;
var _1db=this.limit;
var _1dc=this.array;
while(_1da<_1db&&_1dc[_1da]!==0){
_1da++;
}
try{
this.limit=_1da;
return cs.decode(this);
}
finally{
if(_1da!=_1db){
this.limit=_1db;
this.position=_1da+1;
}
}
};
_19d.slice=function(){
return new ByteBuffer(this.array.slice(this.position,this.limit));
};
_19d.flip=function(){
this.limit=this.position;
this.position=0;
this._mark=-1;
return this;
};
_19d.rewind=function(){
this.position=0;
this._mark=-1;
return this;
};
_19d.clear=function(){
this.position=0;
this.limit=this.capacity;
this._mark=-1;
return this;
};
_19d.remaining=function(){
return (this.limit-this.position);
};
_19d.hasRemaining=function(){
return (this.limit>this.position);
};
_19d.skip=function(size){
this.position+=size;
return this;
};
_19d.getHexDump=function(){
var _1de=this.array;
var pos=this.position;
var _1e0=this.limit;
if(pos==_1e0){
return "empty";
}
var _1e1=[];
for(var i=pos;i<_1e0;i++){
var hex=(_1de[i]||0).toString(16);
if(hex.length==1){
hex="0"+hex;
}
_1e1.push(hex);
}
return _1e1.join(" ");
};
_19d.toString=_19d.getHexDump;
_19d.expand=function(_1e4){
return this.expandAt(this.position,_1e4);
};
_19d.expandAt=function(i,_1e6){
var end=i+_1e6;
if(end>this.capacity){
this.capacity=end;
}
if(end>this.limit){
this.limit=end;
}
return this;
};
function _autoExpand(_1e8,_1e9){
if(_1e8.autoExpand){
_1e8.expand(_1e9);
}
return this;
};
function _checkIndex(_1ea,_1eb){
if(_1eb<0||_1eb>_1ea.capacity){
throw new Error("Index out of bounds");
}
return this;
};
})();
function Charset(){
};
(function(){
var _1ec=Charset.prototype;
_1ec.decode=function(buf){
};
_1ec.encode=function(text){
};
Charset.UTF8=(function(){
function UTF8(){
};
UTF8.prototype=new Charset();
var _1ef=UTF8.prototype;
_1ef.decode=function(buf){
var _1f1=[];
while(buf.hasRemaining()){
var _1f2=buf.remaining();
var _1f3=buf.getUnsigned();
var _1f4=charByteCount(_1f3);
if(_1f2<_1f4){
buf.skip(-1);
break;
}
var _1f5=null;
switch(_1f4){
case 1:
_1f5=_1f3;
break;
case 2:
_1f5=((_1f3&31)<<6)|(buf.getUnsigned()&63);
break;
case 3:
_1f5=((_1f3&15)<<12)|((buf.getUnsigned()&63)<<6)|(buf.getUnsigned()&63);
break;
case 4:
_1f5=((_1f3&7)<<18)|((buf.getUnsigned()&63)<<12)|((buf.getUnsigned()&63)<<6)|(buf.getUnsigned()&63);
break;
}
_1f1.push(_1f5);
}
return String.fromCharCode.apply(null,_1f1);
};
_1ef.encode=function(str,buf){
for(var i=0;i<str.length;i++){
var _1f9=str.charCodeAt(i);
if(_1f9<128){
buf.put(_1f9);
}else{
if(_1f9<2048){
buf.put((_1f9>>6)|192);
buf.put((_1f9&63)|128);
}else{
if(_1f9<65536){
buf.put((_1f9>>12)|224);
buf.put(((_1f9>>6)&63)|128);
buf.put((_1f9&63)|128);
}else{
if(_1f9<1114112){
buf.put((_1f9>>18)|240);
buf.put(((_1f9>>12)&63)|128);
buf.put(((_1f9>>6)&63)|128);
buf.put((_1f9&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
};
function charByteCount(b){
if((b&128)===0){
return 1;
}
if((b&32)===0){
return 2;
}
if((b&16)===0){
return 3;
}
if((b&8)===0){
return 4;
}
throw new Error("Invalid UTF-8 bytes");
};
return new UTF8();
})();
})();
(function(){
var _1fb="WebSocket";
var _1fc=function(name){
this._name=name;
this._level=_1fc.Level.INFO;
};
(function(){
_1fc.Level={OFF:8,SEVERE:7,WARNING:6,INFO:5,CONFIG:4,FINE:3,FINER:2,FINEST:1,ALL:0};
var _1fe;
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:logging"){
_1fe=tags[i].content;
break;
}
}
_1fc._logConf={};
if(_1fe){
var _201=_1fe.split(",");
for(var i=0;i<_201.length;i++){
var _202=_201[i].split("=");
_1fc._logConf[_202[0]]=_202[1];
}
}
var _203={};
_1fc.getLogger=function(name){
var _205=_203[name];
if(_205===undefined){
_205=new _1fc(name);
_203[name]=_205;
}
return _205;
};
var _206=_1fc.prototype;
_206.setLevel=function(_207){
if(_207&&_207>=_1fc.Level.ALL&&_207<=_1fc.Level.OFF){
this._level=_207;
}
};
_206.isLoggable=function(_208){
for(var _209 in _1fc._logConf){
if(this._name.match(_209)){
var _20a=_1fc._logConf[_209];
if(_20a){
return (_1fc.Level[_20a]<=_208);
}
}
}
return (this._level<=_208);
};
var noop=function(){
};
var _20c={};
_20c[_1fc.Level.OFF]=noop;
_20c[_1fc.Level.SEVERE]=(window.console)?(console.error||console.log||noop):noop;
_20c[_1fc.Level.WARNING]=(window.console)?(console.warn||console.log||noop):noop;
_20c[_1fc.Level.INFO]=(window.console)?(console.info||console.log||noop):noop;
_20c[_1fc.Level.CONFIG]=(window.console)?(console.info||console.log||noop):noop;
_20c[_1fc.Level.FINE]=(window.console)?(console.debug||console.log||noop):noop;
_20c[_1fc.Level.FINER]=(window.console)?(console.debug||console.log||noop):noop;
_20c[_1fc.Level.FINEST]=(window.console)?(console.debug||console.log||noop):noop;
_20c[_1fc.Level.ALL]=(window.console)?(console.log||noop):noop;
_206.config=function(_20d,_20e){
this.log(_1fc.Level.CONFIG,_20d,_20e);
};
_206.entering=function(_20f,name,_211){
if(this.isLoggable(_1fc.Level.FINER)){
if(browser=="chrome"||browser=="safari"){
_20f=console;
}
var _212=_20c[_1fc.Level.FINER];
if(_211){
if(typeof (_212)=="object"){
_212("ENTRY "+name,_211);
}else{
_212.call(_20f,"ENTRY "+name,_211);
}
}else{
if(typeof (_212)=="object"){
_212("ENTRY "+name);
}else{
_212.call(_20f,"ENTRY "+name);
}
}
}
};
_206.exiting=function(_213,name,_215){
if(this.isLoggable(_1fc.Level.FINER)){
var _216=_20c[_1fc.Level.FINER];
if(browser=="chrome"||browser=="safari"){
_213=console;
}
if(_215){
if(typeof (_216)=="object"){
_216("RETURN "+name,_215);
}else{
_216.call(_213,"RETURN "+name,_215);
}
}else{
if(typeof (_216)=="object"){
_216("RETURN "+name);
}else{
_216.call(_213,"RETURN "+name);
}
}
}
};
_206.fine=function(_217,_218){
this.log(_1fc.Level.FINE,_217,_218);
};
_206.finer=function(_219,_21a){
this.log(_1fc.Level.FINER,_219,_21a);
};
_206.finest=function(_21b,_21c){
this.log(_1fc.Level.FINEST,_21b,_21c);
};
_206.info=function(_21d,_21e){
this.log(_1fc.Level.INFO,_21d,_21e);
};
_206.log=function(_21f,_220,_221){
if(this.isLoggable(_21f)){
var _222=_20c[_21f];
if(browser=="chrome"||browser=="safari"){
_220=console;
}
if(typeof (_222)=="object"){
_222(_221);
}else{
_222.call(_220,_221);
}
}
};
_206.severe=function(_223,_224){
this.log(_1fc.Level.SEVERE,_223,_224);
};
_206.warning=function(_225,_226){
this.log(_1fc.Level.WARNING,_225,_226);
};
})();
var _227=function(key){
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name===key){
var v=tags[i].content;
return v;
}
}
};
var _22c=function(_22d){
var _22e=[];
for(var i=0;i<_22d.length;i++){
_22e.push(_22d[i]);
}
return _22e;
};
var _230=function(_231,_232){
var _233=[];
for(var i=0;i<_231.length;i++){
var elt=_231[i];
if(_232(elt)){
_233.push(_231[i]);
}
}
return _233;
};
var _236=function(_237,_238){
for(var i=0;i<_237.length;i++){
if(_237[i]==_238){
return i;
}
}
return -1;
};
var _23a=function(s){
var a=[];
for(var i=0;i<s.length;i++){
a.push(s.charCodeAt(i)&255);
}
var buf=new ByteBuffer(a);
var v=buf.getString(Charset.UTF8);
return v;
};
var _240=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _242="\n";
var _243=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(n);
switch(chr){
case _240:
a.push(_240);
a.push(_240);
break;
case NULL:
a.push(_240);
a.push("0");
break;
case _242:
a.push(_240);
a.push("n");
break;
default:
a.push(chr);
}
}
var v=a.join("");
return v;
};
var _249=function(buf,_24b){
if(_24b){
return _243(buf);
}else{
var _24c=[];
while(buf.remaining()){
var n=buf.getUnsigned();
_24c.push(String.fromCharCode(n));
}
var _24e=_24c.join("");
return _24e;
}
};
var _24f=window.WebSocket;
var _250=function(_251,_252){
if(typeof (_24f)==="undefined"){
doError(this);
return;
}
if(_251.indexOf("javascript:")==0){
_251=_251.substr("javascript:".length);
}
var _253=_251.indexOf("?");
if(_253!=-1){
_251+="&.kl=Y";
}else{
_251+="?.kl=Y";
}
this._balanced=false;
this._sendQueue=[];
try{
if(_252){
this._delegate=new _24f(_251,_252);
}else{
this._delegate=new _24f(_251);
}
}
catch(e){
doError(this);
return;
}
bindHandlers(this);
};
var _254=_250.prototype;
_254.onerror=function(){
};
_254.onmessage=function(){
};
_254.onopen=function(){
};
_254.onclose=function(){
};
_254.close=function(){
this._delegate.close();
};
_254.send=function(_255){
if(this._balanced==true){
doSend(this,_255);
}else{
this._sendQueue.push(_255);
}
};
function doSend(_256,_257){
if(typeof (_257)=="string"){
_256._delegate.send(_257);
}else{
if(_257.constructor==ByteBuffer){
var _258=_249(_257);
_256._delegate.send(_258);
}else{
throw new Error("Cannot call send() with that type");
}
}
};
function doError(_259,e){
setTimeout(function(){
if(_259.onerror){
_259.onerror(e);
}
},0);
};
function messageHandler(_25b,e){
if(_25b._balanced==true){
_25b.onmessage(e);
}else{
if(e.data.match("^\uf0ff")=="\uf0ff"){
var rest=e.data.substring(1);
if(rest.match("^R")=="R"){
var _25e=rest.substring(1);
if(_25e&&_25e!=""){
var _25f=_25e.indexOf("?");
if(_25f!=-1){
_25e+="&.kl=Y";
}else{
_25e+="?.kl=Y";
}
unbindHandlers(_25b);
_25b.close();
_25b._delegate=new _24f(_25e);
bindHandlers(_25b);
}else{
_25b.close();
}
}else{
if(rest.match("^N$")=="N"){
_25b._balanced=true;
var _260;
while(_260=_25b._sendQueue.shift()){
doSend(_25b,_260);
}
}else{
_25b._balanced=true;
_25b.onmessage(e);
}
}
}else{
_25b._balanced=true;
_25b.onmessage(e);
}
}
};
function closeHandler(_261,e){
if(_261.readyState==0){
doError(_261,e);
}else{
_261.onclose(e);
}
};
function errorHandler(_263,e){
if(_263.readyState==0){
doError(_263,e);
}else{
_263.onclose(e);
}
};
function openHandler(_265,e){
_265.onopen(e);
};
function bindHandlers(_267){
var _268=_267._delegate;
_268.onopen=function(e){
openHandler(_267,e);
};
_268.onmessage=function(e){
messageHandler(_267,e);
};
_268.onclose=function(e){
closeHandler(_267,e);
};
_268.onerror=function(e){
errorHandler(_267,e);
};
};
function unbindHandlers(_26d){
var _26e=_26d._delegate;
_26e.onmessage=undefined;
_26e.onclose=undefined;
_26e.onopen=undefined;
};
var _26f=(function(){
var _270=function(_271){
this.URL=_271;
var _272=this;
try{
_273(_272,_271);
}
catch(e){
doError(_272,e);
}
this.constructor=_270;
};
var _274=_270.prototype;
_270._flashBridge={};
_270._flashBridge.readyWaitQueue=[];
_270._flashBridge.failWaitQueue=[];
_270._flashBridge.flashHasLoaded=false;
_270._flashBridge.flashHasFailed=false;
_274.URL="";
_274.readyState=0;
_274.bufferedAmount=0;
_274.onopen=function(){
};
_274.onmessage=function(_275){
};
_274.onclose=function(){
};
_274.onerror=function(){
};
_274.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_270._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _277;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _277=a.join("");
_270._flashBridge.sendByteString(this._instanceId,_277);
return;
}else{
throw new Error("Invalid type");
}
}
_27a(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_274.close=function(){
switch(this.readyState){
case 1:
case 2:
_270._flashBridge.disconnect(this._instanceId);
break;
}
};
_274.disconnect=_274.close;
var _27a=function(_27b){
_27b.bufferedAmount=_270._flashBridge.getBufferedAmount(_27b._instanceId);
if(_27b.bufferedAmount!=0){
setTimeout(function(){
_27a(_27b);
},1000);
}
};
var _273=function(_27c,_27d){
var _27e=function(key,_280){
_280[key]=_27c;
_27c._instanceId=key;
};
var _281=function(){
doError(_27c);
};
_270._flashBridge.registerWebSocketEmulated(_27d,_27e,_281);
};
function doError(_282,e){
setTimeout(function(){
if(_282.onerror){
_282.onerror(e);
}
},0);
};
return _270;
})();
var _284=(function(){
var _285=function(_286){
this.URL=_286;
var _287=this;
try{
_288(_287,_286);
}
catch(e){
doError(_287,e);
}
this.constructor=_285;
};
var _289=_285.prototype;
_26f._flashBridge={};
_26f._flashBridge.readyWaitQueue=[];
_26f._flashBridge.failWaitQueue=[];
_26f._flashBridge.flashHasLoaded=false;
_26f._flashBridge.flashHasFailed=false;
_289.URL="";
_289.readyState=0;
_289.bufferedAmount=0;
_289.onopen=function(){
};
_289.onmessage=function(_28a){
};
_289.onclose=function(){
};
_289.onerror=function(){
};
_289.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_26f._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _28c;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _28c=a.join("");
_26f._flashBridge.sendByteString(this._instanceId,_28c);
return;
}else{
throw new Error("Invalid type");
}
}
_28f(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_289.close=function(){
switch(this.readyState){
case 1:
case 2:
_26f._flashBridge.disconnect(this._instanceId);
break;
}
};
_289.disconnect=_289.close;
var _28f=function(_290){
_290.bufferedAmount=_26f._flashBridge.getBufferedAmount(_290._instanceId);
if(_290.bufferedAmount!=0){
setTimeout(function(){
_28f(_290);
},1000);
}
};
var _288=function(_291,_292){
var _293=function(key,_295){
_295[key]=_291;
_291._instanceId=key;
};
var _296=function(){
doError(_291);
};
_26f._flashBridge.registerWebSocketNative(_292,_293,_296);
};
function doError(_297,e){
setTimeout(function(){
if(_297.onerror){
_297.onerror(e);
}
},0);
};
return _285;
})();
(function(){
var _299={};
_26f._flashBridge.registerWebSocketEmulated=function(_29a,_29b,_29c){
var _29d=function(){
var key=_26f._flashBridge.doRegisterWebSocketEmulated(_29a);
_29b(key,_299);
};
if(_26f._flashBridge.flashHasLoaded){
if(_26f._flashBridge.flashHasFailed){
_29c();
}else{
_29d();
}
}else{
this.readyWaitQueue.push(_29d);
this.failWaitQueue.push(_29c);
}
};
_26f._flashBridge.doRegisterWebSocketEmulated=function(_29f,_2a0){
var key=_26f._flashBridge.elt.registerWebSocketEmulated(_29f,_2a0);
return key;
};
_26f._flashBridge.registerWebSocketNative=function(_2a2,_2a3,_2a4){
var _2a5=function(){
var key=_26f._flashBridge.doRegisterWebSocketNative(_2a2);
_2a3(key,_299);
};
if(_26f._flashBridge.flashHasLoaded){
if(_26f._flashBridge.flashHasFailed){
_2a4();
}else{
_2a5();
}
}else{
this.readyWaitQueue.push(_2a5);
this.failWaitQueue.push(_2a4);
}
};
_26f._flashBridge.doRegisterWebSocketNative=function(_2a7,_2a8){
var key=_26f._flashBridge.elt.registerWebSocketNative(_2a7,_2a8);
return key;
};
_26f._flashBridge.onready=function(){
var _2aa=_26f._flashBridge.readyWaitQueue;
for(var i=0;i<_2aa.length;i++){
var _2ac=_2aa[i];
_2ac();
}
};
_26f._flashBridge.onfail=function(){
var _2ad=_26f._flashBridge.failWaitQueue;
for(var i=0;i<_2ad.length;i++){
var _2af=_2ad[i];
_2af();
}
};
_26f._flashBridge.doOpen=function(key){
_299[key].readyState=1;
_299[key].onopen();
_2b1();
};
_26f._flashBridge.doClose=function(key){
_299[key].readyState=2;
_299[key].onclose();
};
_26f._flashBridge.doError=function(key){
_299[key].onerror();
};
_26f._flashBridge.doMessage=function(key,data){
var _2b6=_299[key];
if(_2b6.readyState==1){
var e;
try{
e=document.createEvent("Events");
e.initEvent("message",true,true);
}
catch(ie){
e={type:"message",bubbles:true,cancelable:true};
}
e.data=unescape(data);
e.decoder=_23a;
e.origin=document.domain;
e.source=null;
_2b6.onmessage(e);
}
};
var _2b1=function(){
if(browser==="firefox"){
var e=document.createElement("iframe");
e.style.display="none";
document.body.appendChild(e);
document.body.removeChild(e);
}
};
_26f._flashBridge.sendText=function(key,_2ba){
this.elt.wsSend(key,escape(_2ba));
setTimeout(_2b1,200);
};
_26f._flashBridge.sendByteString=function(key,_2bc){
this.elt.wsSendByteString(key,escape(_2bc));
setTimeout(_2b1,200);
};
_26f._flashBridge.disconnect=function(key){
this.elt.wsDisconnect(key);
};
_26f._flashBridge.getBufferedAmount=function(key){
var v=this.elt.getBufferedAmount(key);
return v;
};
})();
(function(){
var _2c0=function(_2c1){
var self=this;
var _2c3=300;
var ID="Loader";
var ie=false;
var _2c6=-1;
self.elt=null;
var _2c7=function(){
var exp=new RegExp(".*"+_2c1+".*.js$");
var _2c9=document.getElementsByTagName("script");
for(var i=0;i<_2c9.length;i++){
if(_2c9[i].src){
var name=(_2c9[i].src).match(exp);
if(name){
name=name.pop();
var _2cc=name.split("/");
_2cc.pop();
var s=_2cc.join("/")+"/";
return s;
}
}
}
};
var _2ce=_2c7();
var _2cf=_2ce+"Loader.swf?.kv=10.05";
self.loader=function(){
var _2d0="flash";
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:upgrade"){
_2d0=tags[i].content;
}
}
if(_2d0!="flash"||!_2d3([9,0,115])){
_2d4();
}else{
_2c6=setTimeout(_2d4,_2c3);
_2d5();
}
};
self.clearFlashTimer=function(){
clearTimeout(_2c6);
_2c6="cleared";
setTimeout(function(){
_2d6(self.elt.handshake(_2c1));
},0);
};
var _2d6=function(_2d7){
if(_2d7){
_26f._flashBridge.flashHasLoaded=true;
_26f._flashBridge.elt=self.elt;
_26f._flashBridge.onready();
}else{
_2d4();
}
window.___Loader=undefined;
};
var _2d4=function(){
_26f._flashBridge.flashHasLoaded=true;
_26f._flashBridge.flashHasFailed=true;
_26f._flashBridge.onfail();
};
var _2d8=function(){
var _2d9=null;
if(typeof (ActiveXObject)!="undefined"){
try{
ie=true;
var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
var _2db=swf.GetVariable("$version");
var _2dc=_2db.split(" ")[1].split(",");
_2d9=[];
for(var i=0;i<_2dc.length;i++){
_2d9[i]=parseInt(_2dc[i]);
}
}
catch(e){
ie=false;
}
}
if(typeof navigator.plugins!="undefined"){
if(typeof navigator.plugins["Shockwave Flash"]!="undefined"){
var _2db=navigator.plugins["Shockwave Flash"].description;
_2db=_2db.replace(/\s*r/g,".");
var _2dc=_2db.split(" ")[2].split(".");
_2d9=[];
for(var i=0;i<_2dc.length;i++){
_2d9[i]=parseInt(_2dc[i]);
}
}
}
var _2de=navigator.userAgent;
if(_2d9!==null&&_2d9[0]===10&&_2de.indexOf("Windows NT 6.0")!==-1){
_2d9=null;
}
return _2d9;
};
var _2d3=function(_2df){
var _2e0=_2d8();
if(_2e0==null){
return false;
}
for(var i=0;i<Math.max(_2e0.length,_2df.length);i++){
var _2e2=_2e0[i]-_2df[i];
if(_2e2!=0){
return (_2e2>0)?true:false;
}
}
return true;
};
var _2d5=function(){
if(ie){
var elt=document.createElement("div");
document.body.appendChild(elt);
elt.outerHTML="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" height=\"0\" width=\"0\" id=\""+ID+"\"><param name=\"movie\" value=\""+_2cf+"\"></param></object>";
self.elt=document.getElementById(ID);
}else{
var elt=document.createElement("object");
elt.setAttribute("type","application/x-shockwave-flash");
elt.setAttribute("width",0);
elt.setAttribute("height",0);
elt.setAttribute("id",ID);
elt.setAttribute("data",_2cf);
document.body.appendChild(elt);
self.elt=elt;
}
};
self.attachToOnload=function(_2e4){
if(window.addEventListener){
window.addEventListener("load",_2e4,true);
}else{
if(window.attachEvent){
window.attachEvent("onload",_2e4);
}else{
onload=_2e4;
}
}
};
self.attachToOnload(self.loader);
};
var _2e5={};
(function(){
var _2e6={8364:128,129:129,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,141:141,381:142,143:143,144:144,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,157:157,382:158,376:159};
var _2e7={128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376};
_2e5.toCharCode=function(n){
if(n<128||(n>159&&n<256)){
return n;
}else{
var _2e9=_2e7[n];
if(typeof (_2e9)=="undefined"){
throw new Error("could not find: "+n);
}
return _2e9;
}
};
_2e5.fromCharCode=function(code){
if(code<128||(code>159&&code<256)){
return code;
}else{
var _2eb=_2e6[code];
if(typeof (_2eb)=="undefined"){
throw new Error("could not find: "+code);
}
return _2eb;
}
};
var _2ec=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _2ee="\n";
var _2ef=function(s){
var a=[];
for(var i=0;i<s.length;i++){
var code=_2e5.fromCharCode(s.charCodeAt(i));
if(code==127){
i++;
if(i==s.length){
a.hasRemainder=true;
break;
}
var _2f4=_2e5.fromCharCode(s.charCodeAt(i));
switch(_2f4){
case 127:
a.push(127);
break;
case 48:
a.push(0);
break;
case 110:
a.push(10);
break;
default:
throw new Error("Escaping format error");
}
}else{
a.push(code);
}
}
return a;
};
var _2f5=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(_2e5.toCharCode(n));
switch(chr){
case _2ec:
a.push(_2ec);
a.push(_2ec);
break;
case NULL:
a.push(_2ec);
a.push("0");
break;
case _2ee:
a.push(_2ec);
a.push("n");
break;
default:
a.push(chr);
}
}
return a.join("");
};
_2e5.toArray=function(s,_2fb){
if(_2fb){
return _2ef(s);
}else{
var a=[];
for(var i=0;i<s.length;i++){
a.push(_2e5.fromCharCode(s.charCodeAt(i)));
}
return a;
}
};
_2e5.toByteString=function(buf,_2ff){
if(_2ff){
return _2f5(buf);
}else{
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
a.push(String.fromCharCode(_2e5.toCharCode(n)));
}
return a.join("");
}
};
})();
var _302=(function(){
var _303=function(_304){
this.immediate=false;
this.retry=3000;
if(browser=="opera"||browser=="ie"){
this.requiresEscaping=true;
}
if(_304.indexOf(".kv="==-1)){
_304+=((_304.indexOf("?")==-1)?"?":"&")+".kv=10.05";
}else{
_304=_304.replace(/\.kv=[^&]*(.*)/,".kv=10.05$1");
}
var _305=new URI(_304);
var _306={"http":80,"https":443};
if(_305.port==null){
_305.port=_306[_305.scheme];
_305.authority=_305.host+":"+_305.port;
}
this.origin=_305.scheme+"://"+_305.authority;
this.location=_304;
this.xhr=null;
this.reconnectTimer=null;
var _307=this;
setTimeout(function(){
connect(_307,false);
},0);
};
_254=_303.prototype;
var _308=0;
var _309=255;
var _30a=1;
var _30b=128;
var _30c=127;
var _30d=3000;
_254.readyState=0;
function connect(_30e){
if(_30e.reconnectTimer!==null){
_30e.reconnectTimer=null;
}
_30e.buf=new ByteBuffer();
var _30f=new URI(_30e.location);
var _310=[];
if(_30e.location.indexOf("&.kb=")===-1&&_30e.location.indexOf("?.kb=")===-1){
_310.push(".kb=512");
}
switch(browser){
case "ie":
_310.push(".kns=1");
break;
case "safari":
_310.push(".kp=256");
break;
case "firefox":
_310.push(".kp=1025");
_310.push(String(Math.random()).substring(2));
break;
}
_310.push(".kc=text/plain;charset=windows-1252");
if(_310.length>0){
if(_30f.query===undefined){
_30f.query=_310.join("&");
}else{
_30f.query+="&"+_310.join("&");
}
}
var xhr=_30e.xhr=new XMLHttpRequest0();
var _312={"xhr":xhr,"position":0};
_30e.nextMessageAt=0;
if(_30e.location.indexOf(".ki=p")==-1||_30e.location.indexOf("https://")==0){
xhr.onprogress=function(){
setTimeout(function(){
_process(_30e,_312);
},0);
};
}
xhr.onload=function(){
_process(_30e,_312);
if(_30e.xhr==_312.xhr&&_30e.readyState!=2){
_reconnect(_30e);
}
};
xhr.onreadystatechange=function(){
if(!_30e.immediate&&xhr.readyStateChange>3){
_30e.readyState=1;
doOpen(_30e);
xhr.onreadystatechange=function(){
};
}
};
xhr.ontimeout=function(){
if(_30e.readyState!=2){
_30e.disconnect();
doError(_30e);
}
};
xhr.onerror=xhr.ontimeout;
xhr.open("GET",_30f.toString(),true);
xhr.send("");
if(_30e.location.indexOf("&.ki=p")==-1){
setTimeout(function(){
if(xhr.readyState<3&&_30e.readyState<2){
_30e.location+="&.ki=p";
connect(_30e,false);
}
},_30d);
}
};
_254.disconnect=function(){
if(this.readyState!==2){
_disconnect(this);
}
};
function _reconnect(_313){
if(_313.immediate){
_313.immediate=false;
connect(_313);
}else{
doError(_313);
}
};
function _disconnect(_314){
if(_314.reconnectTimer!==null){
clearTimeout(_314.reconnectTimer);
_314.reconnectTimer=null;
}
if(_314.xhr!==null){
_314.xhr.onprogress=function(){
};
_314.xhr.onload=function(){
};
_314.xhr.onerror=function(){
};
_314.xhr.abort();
}
_314.lineQueue=[];
_314.lastEventId=null;
_314.location=null;
_314.readyState=2;
};
function _process(_315,_316){
var _317=_316.xhr.responseText;
var _318=_317.slice(_316.position);
_316.position=_317.length;
var buf=_315.buf;
var _31a=_2e5.toArray(_318,_315.requiresEscaping);
if(_31a.hasRemainder){
_316.position--;
}
buf.position=buf.limit;
buf.putBuffer(new ByteBuffer(_31a));
buf.position=_315.nextMessageAt;
buf.mark();
parse:
while(true){
if(!buf.hasRemaining()){
break;
}
var type=buf.getUnsigned();
switch(type&128){
case _308:
var data=buf.slice();
var _31d=data.indexOf(_309);
if(_31d==-1){
break parse;
}
data.limit=_31d;
var _31e=data.remaining();
buf.skip(_31e+1);
buf.mark();
if(type==_30a){
handleCommandFrame(_315,data);
}else{
dispatchText(_315,data);
}
break;
case _30b:
var _31f=0;
var _320=false;
while(buf.hasRemaining()){
var b=buf.getUnsigned();
_31f=_31f<<7;
_31f|=(b&127);
if((b&128)!=128){
_320=true;
break;
}
}
if(!_320){
break parse;
}
if(buf.remaining()<_31f){
break parse;
}
var _322=buf.slice();
_322.limit=_31f;
buf.skip(_31f);
buf.mark();
dispatchBytes(_315,_322);
break;
default:
throw new Error("Emulation protocol error. Unknown frame type: "+type);
}
}
buf.reset();
buf.compact();
nextMessageAt=buf.position;
};
function handleCommandFrame(_323,data){
while(data.remaining()){
var _325=String.fromCharCode(data.getUnsigned());
switch(_325){
case "0":
break;
case "1":
_323.immediate=true;
break;
default:
throw new Error("Protocol decode error. Unknown command: "+_325);
}
}
};
function dispatchBytes(_326,buf){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_326.lastEventId;
e.data=_249(buf);
e.decoder=_23a;
e.origin=_326.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_326.onmessage)==="function"){
_326.onmessage(e);
}
};
function dispatchText(data){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=$this.lastEventId;
e.data=data;
e.origin=$this.origin;
if(e.source!==null){
e.source=null;
}
if(typeof ($this.onmessage)==="function"){
$this.onmessage(e);
}
};
function doOpen(_32b){
if(typeof (_32b.onopen)==="function"){
_32b.onopen();
}
};
function doError(_32c){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_32c.onerror)==="function"){
_32c.onerror(e);
}
};
return _303;
})();
var _32e=(function(){
var _32f=function(_330,_331){
this.URL=_330;
if(_330.indexOf(".kv=")==-1){
_330+=((_330.indexOf("?")==-1)?"?":"&")+".kv=10.05";
}else{
_330=_330.replace(/\.kv=[^&]*(.*)/,".kv=10.05$1");
}
if(browser=="opera"||browser=="ie"){
this.requiresEscaping=true;
}
this._sendQueue=[];
_332(this);
};
_254=_32f.prototype;
_254.readyState=0;
_254.bufferedAmount=0;
_254.URL="";
_254.onopen=function(){
};
_254.onerror=function(){
};
_254.onmessage=function(_333){
};
_254.onclose=function(){
};
var _334=128;
var _335=0;
var _336=255;
var _337=1;
var _338=[_337,48,49,_336];
var _339=[_337,48,50,_336];
_254.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
throw new Error("data is null");
}
var buf=new ByteBuffer();
if(typeof data=="string"){
buf.put(_335);
buf.putString(data,Charset.UTF8);
buf.put(_336);
}else{
if(data.constructor==ByteBuffer){
buf.put(_334);
_33c(buf,data.remaining());
buf.putBuffer(data);
}else{
throw new Error("Invalid type for send");
}
}
buf.flip();
doSend(this,buf);
return true;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_254.close=function(){
switch(this.readyState){
case 1:
doSend(this,new ByteBuffer(_339));
_33d(this);
break;
}
};
function doSend(_33e,buf){
_33e.bufferedAmount+=buf.remaining();
_33e._sendQueue.push(buf);
if(!_33e._writeSuspended){
doFlush(_33e);
}
};
function doFlush(_340){
var _341=_340._sendQueue;
var _342=_341.length;
_340._writeSuspended=(_342>0);
if(_342>0){
var xhr=new XMLHttpRequest0();
xhr.open("POST",_340._upstream,true);
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
switch(xhr.status){
case 200:
setTimeout(function(){
doFlush(_340);
},0);
break;
default:
_33d(_340);
break;
}
}
};
var out=new ByteBuffer();
while(_341.length){
out.putBuffer(_341.shift());
}
out.putBytes(_338);
out.flip();
if(xhr.sendAsBinary){
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.sendAsBinary(_249(out));
}else{
xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
xhr.send(_249(out,_340.requiresEscaping));
}
}
_340.bufferedAmount=0;
};
var _332=function(_345){
var url=new URI(_345.URL);
url.scheme=url.scheme.replace("ws","http");
var _347=_345.requiresEscaping?"/;e/cte":"/;e/ct";
url.path=url.path.replace(/[\/]?$/,_347);
var _348=url.toString();
var _349=_348.indexOf("?");
if(_349==-1){
_348+="?";
}else{
_348+="&";
}
_348+=".kn="+String(Math.random()).substring(2);
var _34a=new XMLHttpRequest0();
_34a.open("GET",_348,true);
_34a.onreadystatechange=function(){
if(_34a.readyState==4){
switch(_34a.status){
case 201:
var _34b=_34a.responseText.split("\n");
_345._upstream=_34b[0];
var _34c=_34b[1];
_345._downstream=new _302(_34c);
_34d(_345,_345._downstream);
_34e(_345);
break;
default:
_34f(_345);
break;
}
}
};
_34a.send(null);
};
var _34d=function(_350,_351){
_351.onmessage=function(_352){
switch(_352.type){
case "message":
if(_350.readyState==1){
_350.onmessage(_352);
}
break;
}
};
_351.onerror=function(){
_351.disconnect();
_33d(_350);
};
};
var _33c=function(buf,_354){
var _355=0;
var _356=0;
do{
_356<<=8;
_356|=(_354&127);
_354>>=7;
_355++;
}while(_354>0);
do{
var _357=_356&255;
_356>>=8;
if(_355!=1){
_357|=128;
}
buf.put(_357);
}while(--_355>0);
};
var _34e=function(_358){
_358.readyState=1;
_358.onopen();
};
var _34f=function(_359){
_359.readyState=2;
_359.onerror();
};
var _33d=function(_35a){
switch(_35a.readyState){
case 0:
case 2:
break;
case 1:
_35a.readyState=2;
_35a.onclose();
break;
default:
}
};
return _32f;
})();
(function(){
var _35b={"javascript:ws":_250,"javascript:wse":_32e,"flash:ws":_284,"flash:wse":_26f,"javascript:wss":_250,"javascript:wse+ssl":_32e,"flash:wss":_284,"flash:wse+ssl":_26f};
window.WebSocket=function(url,_35d){
this.URL=url;
this.readyState=0;
this._subprotocol=_35d;
var _35e=splitScheme(url);
var _35f=_35e.shift();
this._urlRemainder=_35e.shift();
if(_35f=="ws"||_35f=="wse"||_35f=="wss"||_35f=="wse+ssl"){
var _360=_227("kaazing:WebSocketConnectionStrategies");
if(_360){
var _361=_360.split(" ");
}
if(!_361){
if(_35f=="ws"||_35f=="wss"){
this._connectionStrategies=_22c(WebSocket.connectionStrategies);
}else{
if(_35f.match("wse")){
var _362=function(s){
return s.match("wse");
};
this._connectionStrategies=_230(WebSocket.connectionStrategies,_362);
}
}
}
}else{
if(_236(WebSocket.connectionStrategies,_35f)!=-1){
this._connectionStrategies=[_35f];
}else{
throw new Error("Unsupported composite scheme: "+_35f);
}
}
this.URL=url.replace("flash:","").replace("javascript:","").replace("wse+ssl:","wss:").replace("wse:","ws:");
fallbackNext(this);
};
window.WebSocket.connectionStrategies=["javascript:ws","flash:ws","flash:wse","javascript:wse","javascript:wss","flash:wss","flash:wse+ssl","javascript:wse+ssl"];
window.WebSocket.__impls__=_35b;
var _364=WebSocket.prototype;
function splitScheme(url){
var _366=url.split("://");
var _367=_366.shift();
var _368=_366.shift();
return [_367,_368];
};
_364.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
this._delegate.send(data);
_36a(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
var _36a=function(_36b){
_36b.bufferedAmount=_36b._delegate.bufferedAmount;
if(_36b.bufferedAmount!=0){
setTimeout(function(){
_36a(_36b);
},1000);
}
};
_364.postMessage=_364.send;
_364.disconnect=_364.close;
_364.close=function(){
switch(this.readyState){
case 1:
case 2:
this._delegate.close();
break;
}
};
function initDelegate(_36c,_36d){
if(typeof (_36c._subprotocol)!=="undefined"){
_36c._delegate=new _36d(_36c.URL,_36c._subprotocol);
}else{
_36c._delegate=new _36d(_36c.URL);
}
bindHandlers(_36c);
};
function fallbackNext(_36e){
var _36f=_36e._connectionStrategies.shift();
var _370=_35b[_36f];
var _371=[_36f,"://",_36e._urlRemainder].join("");
if(_370){
initDelegate(_36e,_370);
}else{
doClose(_36e);
}
};
function doClose(_372){
if(typeof (_372.onclose)!=="undefined"){
_372.onclose();
}
};
function errorHandler(_373,e){
unbindHandlers(_373);
fallbackNext(_373);
};
function openHandler(_375,e){
switch(_375.readyState){
case 0:
_375.readyState=1;
_375.onopen(e);
break;
case 1:
case 2:
throw new Error("Invalid readyState for open event from "+e.target);
break;
default:
throw new Error("Socket has invalid readyState: "+_375.readyState);
}
};
function closeHandler(_377,e){
switch(_377.readyState){
case 0:
unbindHandlers(_377);
doClose(_377);
break;
case 1:
_377.readyState=2;
setTimeout(function(){
if(typeof (_377.onclose)!=="undefined"){
_377.onclose();
}
},0);
break;
case 2:
throw new Error("Invalid readyState for close event from "+e.target);
break;
default:
throw new Error("Socket has invalid readyState: "+_377.readyState);
}
};
function bindHandlers(_379){
var _37a=_379._delegate;
_37a.onmessage=function(e){
if(e.decoder){
var e2;
try{
e2=document.createEvent("Events");
e2.initEvent("message",true,true);
}
catch(ie){
e2={type:"message",bubbles:true,cancelable:true};
}
e2.data=e.decoder(e.data);
e2.origin=e.origin;
e2.source=_379;
_379.onmessage(e2);
}else{
_379.onmessage(e);
}
};
_37a.onclose=function(e){
closeHandler(_379,e);
};
_37a.onopen=function(e){
openHandler(_379,e);
};
_37a.onerror=function(e){
errorHandler(_379,e);
};
};
function unbindHandlers(_380){
var _381=_380._delegate;
if(_381){
_381.onerror=undefined;
_381.onmessage=undefined;
_381.onclose=undefined;
_381.onopen=undefined;
}
};
}());
window.___Loader=new _2c0(_1fb);
})();
})();
