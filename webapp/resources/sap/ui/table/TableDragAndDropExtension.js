/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./TableExtension","sap/ui/table/TableUtils","sap/ui/core/dnd/DropPosition"],function(T,a,D){"use strict";var S="sap.ui.table";var E={getSessionData:function(d,k){return d.getComplexData(S+(k==null?"":"-"+k));},setSessionData:function(d,s,k){d.setComplexData(S+(k==null?"":"-"+k),s);},getInstanceSessionData:function(d,t){return this.getSessionData(d,t.getId());},setInstanceSessionData:function(d,t,s){this.setSessionData(d,s,t.getId());}};var b={ondragstart:function(e){var d=e.dragSession;if(!d||!d.getDragControl()){return;}var o=d.getDragControl();var s={};if(a.isInstanceOf(o,"sap/ui/table/Row")){var f=this.getContextByIndex(o.getIndex());var g=o.getDomRef();if(!f||g.classList.contains("sapUiTableGroupHeader")||g.classList.contains("sapUiAnalyticalTableSum")){e.preventDefault();return;}else{s.draggedRowContext=f;}}E.setInstanceSessionData(d,this,s);},ondragenter:function(e){var d=e.dragSession;if(!d||!d.getDropControl()){return;}var s=E.getInstanceSessionData(d,this);var o=d.getDragControl();var f=d.getDropControl();if(!s){s={};}if(a.isInstanceOf(f,"sap/ui/table/Row")){var g=s.draggedRowContext;var h=this.getContextByIndex(f.getIndex());var i=f.getDomRef();var j=d.getDropInfo().getDropPosition();if((!h&&j===D.On&&a.hasData(this))||(g&&g===h)||i.classList.contains("sapUiTableGroupHeader")||i.classList.contains("sapUiAnalyticalTableSum")){e.setMarked("NonDroppable");}else{if(!h){var l=this.getRows()[a.getNonEmptyVisibleRowCount(this)-1];d.setDropControl(l||this);}if(d.getDropControl()!==this){var v=this._getScrollExtension().isVerticalScrollbarVisible();var t=this.getDomRef("sapUiTableCnt").getBoundingClientRect();d.setIndicatorConfig({width:t.width-(v?16:0),left:t.left+(this._bRtlMode&&v?16:0)});}}}else if(o===f){e.setMarked("NonDroppable");}if(!s.verticalScrollEdge){var p=window.pageYOffset;var V=this.getDomRef("table").getBoundingClientRect();s.verticalScrollEdge={bottom:V.bottom+p,top:V.top+p};}var P=window.pageXOffset;var H=this.getDomRef("sapUiTableCtrlScr").getBoundingClientRect();s.horizontalScrollEdge={left:H.left+P,right:H.right+P};E.setInstanceSessionData(d,this,s);},ondragover:function(e){var d=e.dragSession;if(!d){return;}var s=E.getInstanceSessionData(d,this);if(!s){return;}var i=32;var t=50;var o=d.getDropControl();var f=this._getScrollExtension();var v=f.getVerticalScrollbar();var h=f.getHorizontalScrollbar();var V=s.verticalScrollEdge;var H=s.horizontalScrollEdge;if(V&&v&&o!==this){var p=e.pageY;if(p>=V.top-t&&p<=V.top+t){v.scrollTop-=i;}else if(p<=V.bottom+t&&p>=V.bottom-t){v.scrollTop+=i;}}if(H&&h&&o!==this){var P=e.pageX;if(P>=H.left-t&&P<=H.left+t){h.scrollLeft-=i;}else if(P<=H.right+t&&P>=H.right-t){h.scrollLeft+=i;}}},onlongdragover:function(e){var d=e.dragSession;if(!d){return;}var C=a.getCell(this,e.target);var r=a.getCellInfo(C).rowIndex;var R=r==null?null:this.getRows()[r];var o=d.getDropControl();if(R&&(o==R||!o)){a.Grouping.toggleGroupHeader(this,R.getIndex(),true);}}};var c=T.extend("sap.ui.table.TableDragAndDropExtension",{_init:function(t,s,m){this._oDelegate=b;t.addEventDelegate(this._oDelegate,t);return"DragAndDropExtension";},_debug:function(){this._ExtensionDelegate=b;},destroy:function(){var t=this.getTable();if(t){t.removeEventDelegate(this._oDelegate);}this._oDelegate=null;T.prototype.destroy.apply(this,arguments);}});return c;});
