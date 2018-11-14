sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("ClinicalTrials.ClinicalTrials.controller.Main", {

        onInit: function(evt) {
            var oModelMenuTiles = this.getOwnerComponent().getModel("MenuTilesModel");
            this.getView().byId("menutilescontainerAS").setModel(oModelMenuTiles);	
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

        handlePress: function(oEvent) {
            var sPath = oEvent.getSource().getBindingContext().getPath();
			var oModel = this.getView().byId("menutilescontainerAS").getModel();
			var oContext = oModel.getProperty(sPath);

			var this_ = this;

			this.onCheckCert(function(returnValue) {
				console.log(returnValue);
				if(returnValue == 'success') {

					if(oContext.contenttext == "Search Condition")
						this_.onNavToFeedback();

					if(oContext.contenttext == "Favorites")
						this_.onNavToFavorite();

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

		onNavToFeedback: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("feedback", true);
		},
		
		onNavToFavorite: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("favorite", true);
		},
    });
});