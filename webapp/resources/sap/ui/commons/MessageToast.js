/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/thirdparty/jqueryui/jquery-ui-core',"./MessageToastRenderer"],function(q,l,C,j,M){"use strict";var a=C.extend("sap.ui.commons.MessageToast",{metadata:{deprecated:true,library:"sap.ui.commons",properties:{anchorId:{type:"string",group:"Misc",defaultValue:null}},events:{next:{}}}});a.prototype.init=function(){this.oMessage=null;this.sAnchorId="";this.bIdle=true;this.sLeftOffset="";this.oPopup=new sap.ui.core.Popup(this,false,false,false);this.oPopup.attachClosed(this.next,this);};a.prototype.exit=function(){if(!this.bIdle){this.close();}this.oPopup.destroy();this.oPopup=null;};a.prototype.onAfterRendering=function(){var r=sap.ui.getCore().getConfiguration().getRTL();var i=q.sap.byId(this.sAnchorId);var b=i.position();var B=q.sap.byId(this.getAnchorId());var c=B.outerWidth();if(b){var t=r?b.left+i.outerWidth():c-b.left;var T=this.$();var d=T.width();var e=Math.max(d,c);var f=c-d;if(f>0){T.css('minWidth',c);}var m=r?(e-t+2)+"px":(e-t-2)+"px";if(e>=t){var A=q.sap.byId(this.getId()+"Arrow");if(sap.ui.getCore().getConfiguration().getRTL()){A.css('marginRight',m);}else{A.css('marginLeft',m);}this.sLeftOffset="0";}}};a.prototype.next=function(){this.bIdle=true;this.fireNext();};a.prototype.open=function(d){if(!this.bIdle){this.oPopup.close(0);}this.bIdle=false;var r=sap.ui.getCore().getConfiguration().getRTL();var p=r?sap.ui.core.Popup.Dock.LeftBottom:sap.ui.core.Popup.Dock.RightBottom;var b=r?sap.ui.core.Popup.Dock.LeftTop:sap.ui.core.Popup.Dock.RightTop;var c=this.sLeftOffset+" 5";var e=null;var f=this.getAnchorId();if(f){e=q.sap.domById(f);}if(!e){e=document.body;}this.oPopup.open(d,p,b,e,c);};a.prototype.close=function(d){this.oPopup.close(d);};a.prototype.getClasses=function(){var c="sapUiMsgToast";if(this.oMessage&&this.oMessage.getType()){c+=" sapUiMsgT"+this.oMessage.getType();}return c;};a.prototype.toast=function(m,A){this.oMessage=m;this.sAnchorId=A;sap.ui.getCore().getRenderManager().render(this,sap.ui.getCore().getStaticAreaRef(),true);this.open(750);this.close(2250);return this;};a.prototype.isIdle=function(){return this.bIdle;};return a;},true);