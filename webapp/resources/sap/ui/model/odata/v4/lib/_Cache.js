/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/SyncPromise","./_GroupLock","./_Helper","./_Requestor"],function(q,S,_,a,b){"use strict";var r=/^([^(]*)(\(.*\))$/;function c(m,p,h,D){if(h.$count!==undefined){s(m,p,h,h.$count+D);}}function g(h){return h.$count!==undefined?h.$count:Infinity;}function d(R,p){return p===""||R===p||R.indexOf(p+"/")===0;}function s(m,p,h,v){if(typeof v==="string"){v=parseInt(v,10);}a.updateCache(m,p,h,{$count:v});}function C(R,h,Q,i){this.bActive=true;this.mChangeListeners={};this.sMetaPath=a.getMetaPath("/"+h);this.mPatchRequests={};this.mPostRequests={};this.oRequestor=R;this.bSortExpandSelect=i;this.sResourcePath=h;this.bSentReadRequest=false;this.oTypePromise=undefined;this.setQueryOptions(Q);}C.prototype._delete=function(G,E,p,h){var i=p.split("/"),D=i.pop(),j=i.join("/"),t=this;return this.fetchValue(_.$cached,j).then(function(v){var o=D?v[D]:v,H,T=a.getPrivateAnnotation(o,"transient");if(T===true){throw new Error("No 'delete' allowed while waiting for server response");}if(T){G.unlock();t.oRequestor.removePost(T,o);return Promise.resolve();}if(o["$ui5.deleting"]){throw new Error("Must not delete twice: "+E);}o["$ui5.deleting"]=true;H={"If-Match":o["@odata.etag"]};E+=t.oRequestor.buildQueryString(t.sMetaPath,t.mQueryOptions,true);return t.oRequestor.request("DELETE",E,G,H)["catch"](function(k){if(k.status!==404){delete o["$ui5.deleting"];throw k;}}).then(function(){var k;if(Array.isArray(v)){if(v[D]!==o){D=v.indexOf(o);}if(D==="-1"){delete v[-1];}else{k=a.getPrivateAnnotation(o,"predicate");if(k){delete v.$byPredicate[k];}v.splice(D,1);}c(t.mChangeListeners,j,v,-1);t.iLimit-=1;h(Number(D),v);}else{if(D){a.updateCache(t.mChangeListeners,j,v,C.makeUpdateData([D],null));}else{o["$ui5.deleted"]=true;}h();}});});};C.prototype.addByPath=function(m,p,i){if(i){if(!m[p]){m[p]=[i];}else if(m[p].indexOf(i)<0){m[p].push(i);}}};C.prototype.calculateKeyPredicates=function(R,t,h){function v(I,m){var i,k,p;I.$byPredicate={};for(i=0;i<I.length;i++){k=I[i];j(k,m);p=a.getPrivateAnnotation(k,"predicate");if(p){I.$byPredicate[p]=k;}}}function j(i,m){var T=t[m];if(typeof i!=="object"){return;}if(T&&T.$Key){a.setPrivateAnnotation(i,"predicate",a.getKeyPredicate(i,m,t));}Object.keys(i).forEach(function(p){var k=i[p],l=m+"/"+p;if(Array.isArray(k)){v(k,l);}else if(k&&typeof k==="object"){j(k,l);}});}j(R,h||this.sMetaPath);};C.prototype.checkActive=function(){var E;if(!this.bActive){E=new Error("Response discarded: cache is inactive");E.canceled=true;throw E;}};C.prototype.create=function(G,p,h,E,i,j){var k,t=this;function l(){t.removeByPath(t.mPostRequests,h,E);delete k[-1];i();}function m(){a.setPrivateAnnotation(E,"transient",true);}function n(o,u){var v=u.getGroupId();a.setPrivateAnnotation(E,"transient",v);t.addByPath(t.mPostRequests,h,E);return t.oRequestor.request("POST",o,u,null,E,m,l).then(function(R){a.deletePrivateAnnotation(E,"transient");c(t.mChangeListeners,h,k,1);t.removeByPath(t.mPostRequests,h,E);a.updateCacheAfterPost(t.mChangeListeners,a.buildPath(h,"-1"),E,R,a.getSelectForPath(t.mQueryOptions,h));t.fetchTypes().then(function(T){a.setPrivateAnnotation(E,"predicate",a.getKeyPredicate(E,a.getMetaPath(a.buildPath(t.sMetaPath,h)),T));});},function(w){if(w.canceled){throw w;}if(j){j(w);}return n(o,new _(t.oRequestor.getGroupSubmitMode(v)==="API"?v:"$parked."+v));});}E=q.extend(true,{},E);E=b.cleanPayload(E);k=this.fetchValue(_.$cached,h).getResult();if(!Array.isArray(k)){throw new Error("Create is only supported for collections; '"+h+"' does not reference a collection");}k[-1]=E;return S.resolve(p).then(function(o){o+=t.oRequestor.buildQueryString(t.sMetaPath,t.mQueryOptions,true);return n(o,G);});};C.prototype.deregisterChange=function(p,l){this.removeByPath(this.mChangeListeners,p,l);};C.prototype.drillDown=function(D,p){var t=this;function h(i){q.sap.log.error("Failed to drill-down into "+p+", invalid segment: "+i,t.toString(),"sap.ui.model.odata.v4.lib._Cache");return undefined;}function m(v,i,j){var k="",l,R,n;if(p[0]!=='('){k+="/";}k+=p.split("/").slice(0,j).join("/");l=t.oRequestor.fetchTypeForPath(t.sMetaPath+a.getMetaPath(k),true).getResult();if(l==="Edm.Stream"){R=v[i+"@odata.mediaReadLink"];n=t.oRequestor.getServiceUrl();if(R){return a.makeAbsolute(R,n);}return n+t.sResourcePath+k;}return h(i);}if(!p){return D;}return p.split("/").reduce(function(v,j,i){var M,o;if(j==="$count"){return Array.isArray(v)?v.$count:h(j);}if(v===undefined||v===null){return undefined;}if(typeof v!=="object"||j==="@$ui5._"){return h(j);}o=v;M=r.exec(j);if(M){if(M[1]){v=v[M[1]];}if(v){v=v.$byPredicate[M[2]];}}else{v=v[j];}return v===undefined&&j[0]!=="#"?m(o,j,i+1):v;},D);};C.prototype.fetchTypes=function(){var p,t,h=this;function i(B,Q){if(Q&&Q.$expand){Object.keys(Q.$expand).forEach(function(n){var m=B;n.split("/").forEach(function(k){m+="/"+k;j(m);});i(m,Q.$expand[n]);});}}function j(m){p.push(h.oRequestor.fetchTypeForPath(m).then(function(T){t[m]=T;if(T&&T.$Key){T.$Key.forEach(function(k){var I,K;if(typeof k!=="string"){K=k[Object.keys(k)[0]];I=K.lastIndexOf("/");if(I>=0){j(m+"/"+K.slice(0,I));}}});}}));}if(!this.oTypePromise){p=[];t={};j(this.sMetaPath);if(this.bFetchOperationReturnType){j(this.sMetaPath+"/$Type");}i(this.sMetaPath,this.mQueryOptions);this.oTypePromise=S.all(p).then(function(){return t;});}return this.oTypePromise;};C.prototype.hasPendingChangesForPath=function(p){return Object.keys(this.mPatchRequests).some(function(R){return d(R,p);})||Object.keys(this.mPostRequests).some(function(R){return d(R,p);});};C.prototype.registerChange=function(p,l){this.addByPath(this.mChangeListeners,p,l);};C.prototype.removeByPath=function(m,p,i){var I=m[p],h;if(I){h=I.indexOf(i);if(h>=0){if(I.length===1){delete m[p];}else{I.splice(h,1);}}}};C.prototype.resetChangesForPath=function(p){var t=this;Object.keys(this.mPatchRequests).forEach(function(R){var i,h;if(d(R,p)){h=t.mPatchRequests[R];for(i=h.length-1;i>=0;i--){t.oRequestor.removePatch(h[i]);}delete t.mPatchRequests[R];}});Object.keys(this.mPostRequests).forEach(function(R){var E,i,T;if(d(R,p)){E=t.mPostRequests[R];for(i=E.length-1;i>=0;i--){T=a.getPrivateAnnotation(E[i],"transient");t.oRequestor.removePost(T,E[i]);}delete t.mPostRequests[R];}});};C.prototype.setActive=function(A){this.bActive=A;if(!A){this.mChangeListeners={};}};C.prototype.setQueryOptions=function(Q){if(this.bSentReadRequest){throw new Error("Cannot set query options: Cache has already sent a read request");}this.mQueryOptions=Q;this.sQueryString=this.oRequestor.buildQueryString(this.sMetaPath,Q,false,this.bSortExpandSelect);};C.prototype.toString=function(){return this.oRequestor.getServiceUrl()+this.sResourcePath+this.sQueryString;};C.prototype.update=function(G,p,v,E,h,i,u){var j=p.split("/"),U,t=this;return this.fetchValue(G.getUnlockedCopy(),i).then(function(o){var F=a.buildPath(i,p),k=G.getGroupId(),O,l,m,T,n,w=C.makeUpdateData(j,v);function x(){t.removeByPath(t.mPatchRequests,F,l);a.updateCache(t.mChangeListeners,i,o,C.makeUpdateData(j,O));}function y(z){l=t.oRequestor.request("PATCH",h,z,{"If-Match":o["@odata.etag"]},w,undefined,x);t.addByPath(t.mPatchRequests,F,l);return l.then(function(A){t.removeByPath(t.mPatchRequests,F,l);a.updateCache(t.mChangeListeners,i,o,A);return A;},function(A){t.removeByPath(t.mPatchRequests,F,l);if(!A.canceled){E(A);if(t.oRequestor.getGroupSubmitMode(k)==="API"){return y(z.getUnlockedCopy());}}throw A;});}if(!o){throw new Error("Cannot update '"+p+"': '"+i+"' does not exist");}T=a.getPrivateAnnotation(o,"transient");if(T){if(T===true){throw new Error("No 'update' allowed while waiting for server response");}if(T.indexOf("$parked.")===0){m=T;T=T.slice(8);}if(T!==k){throw new Error("The entity will be created via group '"+T+"'. Cannot patch via group '"+k+"'");}}O=a.drillDown(o,j);a.updateCache(t.mChangeListeners,i,o,w);if(u){U=u.split("/");n=a.drillDown(o,U);if(n===undefined){q.sap.log.debug("Missing value for unit of measure "+a.buildPath(i,u)+" when updating "+F,t.toString(),"sap.ui.model.odata.v4.lib._Cache");}else{q.extend(true,w,C.makeUpdateData(U,n));}}if(T){if(m){a.setPrivateAnnotation(o,"transient",T);t.oRequestor.relocate(m,o,T);}G.unlock();return Promise.resolve({});}h+=t.oRequestor.buildQueryString(t.sMetaPath,t.mQueryOptions,true);return y(G);});};function e(R,h,Q,i){C.apply(this,arguments);this.sContext=undefined;this.aElements=[];this.aElements.$byPredicate={};this.aElements.$count=undefined;this.aElements.$tail=undefined;this.iLimit=Infinity;this.oSyncPromiseAll=undefined;}e.prototype=Object.create(C.prototype);e.prototype.fetchValue=function(G,p,D,l){var E,t=this;G.unlock();if(!this.oSyncPromiseAll){E=this.aElements.$tail?this.aElements.concat(this.aElements.$tail):this.aElements;this.oSyncPromiseAll=S.all(E);}return this.oSyncPromiseAll.then(function(){t.checkActive();t.registerChange(p,l);return t.drillDown(t.aElements,p);});};e.prototype.fill=function(p,h,E){var i,n=Math.max(this.aElements.length,1024);if(E>n){if(this.aElements.$tail&&p){throw new Error("Cannot fill from "+h+" to "+E+", $tail already in use, # of elements is "+this.aElements.length);}this.aElements.$tail=p;E=this.aElements.length;}for(i=h;i<E;i++){this.aElements[i]=p;}this.oSyncPromiseAll=undefined;};e.prototype.getReadRange=function(h,l,p){var E=this.aElements;function j(h,k){var i;for(i=h;i<k;i+=1){if(E[i]===undefined){return true;}}return false;}if(j(h+l,h+l+p/2)){l+=p;}if(j(Math.max(h-p/2,0),h)){l+=p;h-=p;if(h<0){l+=h;if(isNaN(l)){l=Infinity;}h=0;}}return{length:l,start:h};};e.prototype.getResourcePath=function(i,E){var D=this.sQueryString?"&":"?",h=E-i,R=this.sResourcePath+this.sQueryString;if(i>0||h<Infinity){R+=D+"$skip="+i;}if(h<Infinity){R+="&$top="+h;}return R;};e.prototype.handleResponse=function(h,E,R,t){var j,k,o,i,p,l=R.value.length;this.sContext=R["@odata.context"];k=R["@odata.count"];if(k){this.iLimit=parseInt(k,10);s(this.mChangeListeners,"",this.aElements,this.iLimit);}for(i=0;i<l;i++){o=R.value[i];this.aElements[h+i]=o;C.computeCount(o);this.calculateKeyPredicates(o,t);p=a.getPrivateAnnotation(o,"predicate");if(p){this.aElements.$byPredicate[p]=o;}}if(l<E-h){j=Math.min(g(this.aElements),h+l);this.aElements.length=j;if(!k&&j>0&&!this.aElements[j-1]){j=undefined;}s(this.mChangeListeners,"",this.aElements,j);this.iLimit=j;}};e.prototype.read=function(I,l,p,G,D){var i,n,E,h,j=-1,L=this.aElements[-1]?-1:0,R,k=Math.max(I,0),t=this;if(I<L){throw new Error("Illegal index "+I+", must be >= "+L);}if(l<0){throw new Error("Illegal length "+l+", must be >= 0");}if(this.aElements.$tail){return this.aElements.$tail.then(function(){return t.read(I,l,p,G,D);});}R=this.getReadRange(I,l,p);h=Math.min(R.start+R.length,this.iLimit);n=Math.min(h,Math.max(R.start,this.aElements.length)+1);for(i=R.start;i<n;i++){if(this.aElements[i]!==undefined){if(j>=0){this.requestElements(j,i,G.getUnlockedCopy(),D);D=undefined;j=-1;}}else if(j<0){j=i;}}if(j>=0){this.requestElements(j,h,G.getUnlockedCopy(),D);}G.unlock();E=this.aElements.slice(k,h);if(this.aElements.$tail){E.push(this.aElements.$tail);}return S.all(E).then(function(){var o;t.checkActive();o={"@odata.context":t.sContext,value:t.aElements.slice(k,h)};o.value.$count=t.aElements.$count;if(I===-1){o.value.unshift(t.aElements[-1]);}return o;});};e.prototype.requestElements=function(i,E,G,D){var p,t=this;p=S.all([this.oRequestor.request("GET",this.getResourcePath(i,E),G,undefined,undefined,D),this.fetchTypes()]).then(function(R){if(t.aElements.$tail===p){t.aElements.$tail=undefined;}t.handleResponse(i,E,R[0],R[1]);})["catch"](function(o){t.fill(undefined,i,E);throw o;});this.bSentReadRequest=true;this.fill(p,i,E);};e.prototype.refreshSingle=function(G,i,D){var p=a.getPrivateAnnotation(this.aElements[i],"predicate"),o,R=this.sResourcePath+p,Q=q.extend({},this.mQueryOptions),t=this;delete Q["$count"];delete Q["$filter"];delete Q["$orderby"];R+=this.oRequestor.buildQueryString(this.sMetaPath,Q,false,this.bSortExpandSelect);o=S.all([this.oRequestor.request("GET",R,G,undefined,undefined,D),this.fetchTypes()]).then(function(h){var E=h[0];t.aElements[i]=t.aElements.$byPredicate[p]=E;t.calculateKeyPredicates(E,h[1]);C.computeCount(E);});this.bSentReadRequest=true;return o;};e.prototype.refreshSingleWithRemove=function(G,i,D,o){var t=this;return this.fetchTypes().then(function(T){var k,K=[],E=t.aElements[i],m=a.getKeyProperties(E,"/"+t.sResourcePath,T),p=a.getPrivateAnnotation(E,"predicate"),Q=q.extend({},t.mQueryOptions),F=Q["$filter"],R=t.sResourcePath;for(k in m){K.push(k+" eq "+m[k]);}Q["$filter"]=(F?"("+F+") and ":"")+K.join(" and ");R+=t.oRequestor.buildQueryString(t.sMetaPath,Q,false,t.bSortExpandSelect);t.bSentReadRequest=true;return t.oRequestor.request("GET",R,G,undefined,undefined,D).then(function(h){if(t.aElements[i]!==E){i=t.aElements.indexOf(E);}if(h.value.length>1){throw new Error("Unexpected server response, more than one entity returned.");}else if(h.value.length===0){if(i===-1){delete t.aElements[-1];}else{t.aElements.splice(i,1);}delete t.aElements.$byPredicate[p];c(t.mChangeListeners,"",t.aElements,-1);t.iLimit-=1;o(i);}else{h=h.value[0];t.aElements[i]=t.aElements.$byPredicate[p]=h;t.calculateKeyPredicates(h,T);C.computeCount(h);}});});};function P(R,h,Q){C.call(this,R,h,Q);this.oPromise=null;}P.prototype=Object.create(C.prototype);P.prototype._delete=function(){throw new Error("Unsupported");};P.prototype.create=function(){throw new Error("Unsupported");};P.prototype.fetchValue=function(G,p,D,l){var t=this;t.registerChange("",l);if(!this.oPromise){this.oPromise=S.resolve(this.oRequestor.request("GET",this.sResourcePath+this.sQueryString,G,undefined,undefined,D,undefined,this.sMetaPath));this.bSentReadRequest=true;}else{G.unlock();}return this.oPromise.then(function(R){t.checkActive();return R.value;});};P.prototype.update=function(){throw new Error("Unsupported");};function f(R,h,Q,i,p,m,F){C.apply(this,arguments);this.bFetchOperationReturnType=F;this.sMetaPath=m||this.sMetaPath;this.bPost=p;this.bPosting=false;this.oPromise=null;}f.prototype=Object.create(C.prototype);f.prototype.fetchValue=function(G,p,D,l){var R=this.sResourcePath+this.sQueryString,t=this;this.registerChange(p,l);if(!this.oPromise){if(this.bPost){throw new Error("Cannot fetch a value before the POST request");}this.oPromise=S.all([this.oRequestor.request("GET",R,G,undefined,undefined,D,undefined,this.sMetaPath),this.fetchTypes()]).then(function(h){t.calculateKeyPredicates(h[0],h[1],t.bFetchOperationReturnType?t.sMetaPath+"/$Type":undefined);C.computeCount(h[0]);return h[0];});this.bSentReadRequest=true;}else{G.unlock();}return this.oPromise.then(function(o){t.checkActive();if(o["$ui5.deleted"]){throw new Error("Cannot read a deleted entity");}return t.drillDown(o,p);});};f.prototype.post=function(G,D,E){var h="POST",p,t=this;if(!this.bPost){throw new Error("POST request not allowed");}if(this.bPosting){throw new Error("Parallel POST requests not allowed");}if(D){h=D["X-HTTP-Method"]||h;delete D["X-HTTP-Method"];if(this.oRequestor.isActionBodyOptional()&&!Object.keys(D).length){D=undefined;}}p=[this.oRequestor.request(h,this.sResourcePath+this.sQueryString,G,{"If-Match":E},D)];if(this.bFetchOperationReturnType){p.push(this.fetchTypes());}this.oPromise=S.all(p).then(function(R){t.bPosting=false;if(t.bFetchOperationReturnType){t.calculateKeyPredicates(R[0],R[1],t.sMetaPath+"/$Type");}return R[0];},function(o){t.bPosting=false;throw o;});this.bPosting=true;return this.oPromise;};C.create=function(R,h,Q,i){return new e(R,h,Q,i);};C.createProperty=function(R,h,Q){return new P(R,h,Q);};C.createSingle=function(R,h,Q,i,p,m,F){return new f(R,h,Q,i,p,m,F);};C.computeCount=function(R){if(R&&typeof R==="object"){Object.keys(R).forEach(function(k){var h,v=R[k];if(Array.isArray(v)){v.$count=undefined;h=R[k+"@odata.count"];if(h){s({},"",v,h);}else if(!R[k+"@odata.nextLink"]){s({},"",v,v.length);}v.forEach(C.computeCount);}else{C.computeCount(v);}});}};C.makeUpdateData=function(p,v){return p.reduceRight(function(V,h){var R={};R[h]=V;return R;},v);};return C;},false);