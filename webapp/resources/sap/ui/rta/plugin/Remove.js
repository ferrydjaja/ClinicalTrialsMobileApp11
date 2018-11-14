/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/rta/plugin/Plugin','sap/ui/rta/Utils','sap/ui/rta/command/CompositeCommand','sap/ui/dt/OverlayRegistry'],function(P,U,C,O){"use strict";var R=P.extend("sap.ui.rta.plugin.Remove",{metadata:{library:"sap.ui.rta",properties:{},associations:{},events:{}}});R.prototype.registerElementOverlay=function(o){if(this.isEnabled(o)){o.attachBrowserEvent("keydown",this._onKeyDown,this);}P.prototype.registerElementOverlay.apply(this,arguments);};R.prototype._isEditable=function(o){var e=false;var E=o.getElement();var r=this.getAction(o);if(r&&r.changeType){if(r.changeOnRelevantContainer){E=o.getRelevantContainer();}e=this.hasChangeHandler(r.changeType,E);}if(e){return this.hasStableId(o);}return e;};R.prototype.isEnabled=function(o){var a=this.getAction(o);var i=false;if(!a){return i;}if(typeof a.isEnabled!=="undefined"){if(typeof a.isEnabled==="function"){i=a.isEnabled(o.getElement());}else{i=a.isEnabled;}}else{i=true;}return i&&this._canBeRemovedFromAggregation(o);};R.prototype._canBeRemovedFromAggregation=function(o){var e=o.getElement();var p=e.getParent();if(!p){return false;}var E=p.getAggregation(e.sParentAggregationName);if(!Array.isArray(E)){return true;}if(E.length===1){return false;}var n=this.getNumberOfSelectedOverlays()||1;var i=E.filter(function(e){var a=O.getOverlay(e);return!(a&&a.getElementVisibility());});return!(i.length===(E.length-n));};R.prototype._getConfirmationText=function(o){var a=this.getAction(o);if(a&&a.getConfirmationText){return a.getConfirmationText(o.getElement());}};R.prototype.deregisterElementOverlay=function(o){if(this.isEnabled(o)){o.detachBrowserEvent("keydown",this._onKeyDown,this);}P.prototype.deregisterElementOverlay.apply(this,arguments);};R.prototype._onKeyDown=function(e){if(e.keyCode===jQuery.sap.KeyCodes.DELETE){e.stopPropagation();this.removeElement();}};R.prototype.removeElement=function(o){var s;if(o){s=o;}else{s=this.getSelectedOverlays();}s=s.filter(this.isEnabled,this);if(s.length>0){this.handler(s);}};R.prototype._getRemoveCommand=function(r,d,v){return this.getCommandFactory().getCommandFor(r,"Remove",{removedElement:r},d,v);};R.prototype._fireElementModified=function(c){if(c.getCommands().length){this.fireElementModified({"command":c});}};R.prototype.handler=function(s){var p=[];var c=new C();var S=function(o){o.setSelected(true);setTimeout(function(){o.focus();},0);};var n=R._getElementToFocus(s);s.forEach(function(o){var a;var r=o.getElement();var d=o.getDesignTimeMetadata();var b=this.getAction(o);var v=this.getVariantManagementReference(o,b);var e=this._getConfirmationText(o);if(e){p.push(U.openRemoveConfirmationDialog(r,e).then(function(f){if(f){a=this._getRemoveCommand(r,d,v);c.addCommand(a);}}.bind(this)));}else{a=this._getRemoveCommand(r,d,v);c.addCommand(a);}o.setSelected(false);},this);if(p.length){Promise.all(p).then(function(){this._fireElementModified(c);S(n);}.bind(this));}else{this._fireElementModified(c);S(n);}};R._getElementToFocus=function(s){var n;if(s.length===1){var o=s[0];var S=o.getParent().getAggregation(o.sParentAggregationName);if(S.length>1){var i=S.indexOf(o);var c=S.slice(i+1);if(i!==0){c=c.concat(S.slice(0,i).reverse());}n=c.filter(function(a){return a.getElement().getVisible();}).shift();}}if(!n){n=O.getOverlay(s[0].getRelevantContainer());}return n;};R.prototype.getMenuItems=function(o){return this._getMenuItems(o,{pluginId:"CTX_REMOVE",rank:60,icon:"sap-icon://hide"});};R.prototype.getActionName=function(){return"remove";};return R;},true);
