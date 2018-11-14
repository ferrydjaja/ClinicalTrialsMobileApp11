/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2018 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var Q=function(m){this._iMaxLength=m;this._aQueue=[];this._aEventHandlerRegistry=[];};Q.prototype._attachEvent=function(e,f){if(typeof f!=="function"){throw new Error("Event handler must be a function");}this._aEventHandlerRegistry.push({event:e,handler:f});};Q.prototype._detachEvent=function(e,f){for(var i=this._aEventHandlerRegistry.length;i--;){if(this._aEventHandlerRegistry[i].handler===f&&this._aEventHandlerRegistry[i].event===e){this._aEventHandlerRegistry.splice(i,1);}}};Q.prototype._fireEvent=function(e,E){for(var i=0;i<this._aEventHandlerRegistry.length;i++){if(this._aEventHandlerRegistry[i].event===e){this._aEventHandlerRegistry[i].handler(E);}}};Q.prototype._execNext=function(){var n,t=this;setTimeout(function(){t._aQueue.shift();n=t._aQueue[0];if(n){t._exec(n);}else{t._fireEvent('onQueueCompleted');}});};Q.prototype._exec=function(i){var t=this,s=function(){t._execNext();};this._fireEvent('beforeQueueItemProcess',i.eventParameters);i.jqdeferred.resolve();i.wait.then(function(){i.wait.then(s);},q.proxy(t._cancel,t));};Q.prototype.enqueue=function(f,e){var i={fn:f,eventParameters:e};i.jqdeferred=q.Deferred();i.defer=new Promise(function(a,r){i.jqdeferred.then(a,r);});i.wait=i.defer.then(f);if(!(this._iMaxLength===undefined)&&this._aQueue.length>=this._iMaxLength){i.jqdeferred.reject(new Error("Queue overflow: "+this._aQueue.length));}else{this._aQueue.push(i);if(this._aQueue.length===1){this._exec(i);}}return i.wait.then();};Q.prototype._cancel=function(){var I,i,l=this._aQueue.length;for(i=0;i<l;i++){I=this._aQueue[i];I.jqdeferred.reject(new Error("Queue cancellation"));}this._fireEvent('onQueueFailed');this._aQueue=[];};Q.prototype.destroy=function(){this._aQueue=[];};return Q;},true);
