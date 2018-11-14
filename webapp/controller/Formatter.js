sap.ui.define(function() {
    "use strict";

	var oRootPath = jQuery.sap.getModulePath("ClinicalTrials.ClinicalTrials");

    var Formatter = {
        status: function(sStatus) {

            if (sStatus === "Completed") {
                return "Error";
            } else if (sStatus === "Terminated") {
                return "Error";
            } else if (sStatus === "Withdrawn") {
                return "Error";
            } else if (sStatus === "Suspended") {
                return "Error";
            } else if (sStatus === "Active, not recruiting") {
                return "Error";
            } else if (sStatus === "Recruiting") {
                return "Success";
            } else if (sStatus === "Not yet recruiting") {
                return "Success";
            } else if (sStatus === "Unknown status") {
                return "Warning";
            } else {
                return "None";
            }
        },

        intro: function(sStatus) {

            var d1 = new Date(sStatus);
            var d2 = new Date();

            var diff = Math.abs(d1.getTime() - d2.getTime());
            var diff = diff / (1000 * 60 * 60 * 24);
            if (diff <= 30)
                return oRootPath + "/images/new.png";
            else
                return "";
        },

		gender: function(sStatus) {
			
            if (sStatus == "All")
                return oRootPath + "/images/malefemale.png";
            else if (sStatus == "Male")
				return oRootPath + "/images/male.png";
            else if (sStatus == "Female")
				return oRootPath + "/images/female.png";
        },

		sponsor: function(sStatus) {
            if (sStatus.toLowerCase() == "pfizer")
                return oRootPath + "/images/pfizersmall.png";
            else 
				return "";
        },

		marker: function(sStatus) {
			jQuery.sap.require("jquery.sap.storage");
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

			 var storage = oStorage.get('NCTID');
			 if (storage == null)
				return null;
			 else {
				 var nctnumbers = storage.split(',');
				  for (var k = 0, len = nctnumbers.length; k < len; k++) {
					  if(sStatus == nctnumbers[k]) {
						  return "Favorite";
					  }
				  }

				  return null;
			 }
        },
		
    };

    return Formatter;
}, /* bExport= */ true);