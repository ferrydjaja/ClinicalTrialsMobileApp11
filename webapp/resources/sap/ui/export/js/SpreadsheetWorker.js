var spreadsheet;var request;var origin=self.origin||"";importScripts(origin+'libs/uri.all.min.js');importScripts(origin+'XLSXBuilder.js');importScripts(origin+'XLSXExportUtils.js');importScripts(origin+'libs/jszip.min.js');if(!self.Promise){importScripts(origin+'libs/es6-promise.js');ES6Promise.polyfill();}onmessage=function(e){if(e.data.cancel){if(request){request.cancel();}close();return;}cancelled=false;var s=e.data;spreadsheet=new XLSXBuilder(s.workbook.columns,s.workbook.context,s.workbook.hierarchyLevel);request=XLSXExportUtils.oData.fetch(s,processCallback);};
function processCallback(m){if(m.rows){spreadsheet.append(m.rows);}if(m.error){postMessage({error:m.error});close();}if(m.progress){postMessage({status:m.progress});}m.finished&&spreadsheet.build().then(saveSpreadsheet);}
function saveSpreadsheet(a){postMessage(a,[a]);close();}
