define('tinymce/inlite/core/Actions',['tinymce/inlite/alien/Uuid','tinymce/inlite/alien/Unlink'],function(U,a){var c=function(l,r){var x,y,m;m='<table data-mce-id="mce" style="width: 100%">';m+='<tbody>';for(y=0;y<r;y++){m+='<tr>';for(x=0;x<l;x++){m+='<td><br></td>';}m+='</tr>';}m+='</tbody>';m+='</table>';return m;};var g=function(l){var m=l.dom.select('*[data-mce-id]');return m[0];};var i=function(l,m,r){l.undoManager.transact(function(){var t,n;l.insertContent(c(m,r));t=g(l);t.removeAttribute('data-mce-id');n=l.dom.select('td,th',t);l.selection.setCursorLocation(n[0],0);});};var f=function(l,m){l.execCommand('FormatBlock',false,m);};var b=function(l,m,n){var o,p;o=l.editorUpload.blobCache;p=o.create(U.uuid('mceu'),n,m);o.add(p);l.insertContent(l.dom.createHTML('img',{src:p.blobUri()}));};var d=function(l){l.selection.collapse(false);};var u=function(l){l.focus();a.unlinkSelection(l);d(l);};var e=function(l,m,n){l.focus();l.dom.setAttrib(m,'href',n);d(l);};var h=function(l,m){l.execCommand('mceInsertLink',false,{href:m});d(l);};var j=function(l,m){var n=l.dom.getParent(l.selection.getStart(),'a[href]');n?e(l,n,m):h(l,m);};var k=function(l,m){m.trim().length===0?u(l):j(l,m);};return{insertTable:i,formatBlock:f,insertBlob:b,createLink:k,unlink:u};});