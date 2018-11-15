sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("ClinicalTrials.ClinicalTrials.controller.App", {
    	
    	onInit: function() {
			var showmsg = false;

			this.checkGPS();
			document.addEventListener("online", this.appOnline.bind(this),false);

    		var options = { enableHighAccuracy: true };

			var watchID = null;
			document.addEventListener("deviceready", onDeviceReady, false);
			function onDeviceReady() {

				if (navigator.geolocation) {
					if(window.navigator.onLine)
						watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
				}
				
				document.addEventListener("pause", onPause, false);
				document.addEventListener("resume", onResume, false);
			}
     
			function onSuccess(position) {
				if(!showmsg) {
					showmsg = true;
					sap.m.MessageToast.show('GPS signal is available now', {
					});
				}

				console.log(position.coords.latitude + ';' + position.coords.longitude);
				window.sessionStorage.setItem("pos", position.coords.latitude + ';' + position.coords.longitude);				
			}

			function onError(error) {
				showmsg = false;
				console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
			}			
						
			function onPause() {
				showmsg = false;
			    if (navigator.geolocation) {
					if (watchID != null) {
						navigator.geolocation.clearWatch(watchID);
						watchID = null;
					}
				}
			}
			

			function onResume() {
				showmsg = false;
				if (navigator.geolocation) {	
					
					if(window.navigator.onLine) {
						watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

						if (window.sessionStorage.getItem("pos") == null) {

							 var geo_options = {
								enableHighAccuracy : true
							};

							navigator.geolocation.getCurrentPosition(onSuccess, onError, geo_options);
						} 
					}
				}
			}
			
    	},
    	
    	appOnline: function() {
			
			this.onCheckCert(function(returnValue) {
				console.log(returnValue);
				if(returnValue == 'success') {
				} else if(returnValue == 'notsecure') {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(jQuery.sap.resources({
						url: "i18n/i18n.properties"
					}).getText("NOT_SECURE"), {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: "{i18n>WELCOME_TITLE}",
						actions: sap.m.MessageBox.Action.OK,
						onClose: null,
						//styleClass: ""                        
					});
				} else if(returnValue == 'confailed') {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(jQuery.sap.resources({
						url: "i18n/i18n.properties"
					}).getText("CONN_FAILED"), {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: "{i18n>WELCOME_TITLE}",
						actions: sap.m.MessageBox.Action.OK,
						onClose: null,
						//styleClass: ""                        
					});
				}
			});
			
		},
		
		checkGPS: function() {

			cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
				 if (!enabled) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(jQuery.sap.resources({
						url: "i18n/i18n.properties"
					}).getText("LOC_FAILED"), {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: "Location Services is disabled",
						actions: ["No, Thanks", "Go to Settings"],
						onClose:  function(sAction) {
							console.log("Action selected: " + sAction);
							
							if(sAction == "Go to Settings") {
								cordova.plugins.diagnostic.switchToLocationSettings();
							}
						},
						//styleClass: ""                        
					});
				 } 
			});
		},

		onCheckCert: function(callback) {			
			var oModelScr = this.getOwnerComponent().getModel("ScrModel");
			var connfp = CryptoJS.AES.decrypt(oModelScr.oData[0].connfp, "pfect");
			connfp = connfp.toString(CryptoJS.enc.Utf8);
			var fp = CryptoJS.AES.decrypt(oModelScr.oData[0].fp, "pfect");
			fp = fp.toString(CryptoJS.enc.Utf8);

			var server = connfp;
			var fingerprint = fp;			
			
			
			window.plugins.sslCertificateChecker.check(
				successCallback,
				errorCallback,
				server,
				fingerprint
			);

			function successCallback(message) {
				callback("success");
				// Message is always: CONNECTION_SECURE.
				// Now do something with the trusted server.
			};

			function errorCallback(message) {
				if (message === "CONNECTION_NOT_SECURE") {
					callback("notsecure");
					// There is likely a man in the middle attack going on, be careful!
				} else if (message.indexOf("CONNECTION_FAILED") >- 1) {
					callback("confailed");
				// There was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.
				}
			};
			
			//callback('success');
			
		},

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ClinicalTrials.ClinicalTrials.view.App
         */
        //	onInit: function() {
        //
        //	},

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf ClinicalTrials.ClinicalTrials.view.App
         */
        //	onBeforeRendering: function() {
        //
        //	},

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf ClinicalTrials.ClinicalTrials.view.App
         */
        //	onAfterRendering: function() {
        //
        //	},

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf ClinicalTrials.ClinicalTrials.view.App
         */
        //	onExit: function() {
        //
        //	}

    });

});
