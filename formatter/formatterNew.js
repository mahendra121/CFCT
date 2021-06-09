sap.ui.define([], function() {
	"use strict";
	return {
		serviceStatus: function(sStatus) {
			switch (sStatus) {
				case "S":
					// return "sap-icon://status-completed";
					return "sap-icon://message-success";
				case "W":
					// return "sap-icon://status-in-process";
					return "sap-icon://message-warning";
				case "E":
					return "sap-icon://status-error";
					// return "sap-icon://error";
				case "":
					return "sap-icon://question-mark";
			}
			// switch (sStatus) {
			// case "S":
			// 	return "../webapp/images/green1.jpg";
			// case "W":
			// 	return "../webapp/images/yellow.jpg";
			// case "E":
			// 	return "../webapp/images/red.jpg";
			// default:
			// 	return "../webapp/images/red.jpg";
			// }
		},

		colorStatus: function(sStatus) {
			switch (sStatus) {
				case "S":
					return "#008000";
				case "W":
					return "#FFFF00";
				case "E":
					return "#FF0000";
				default:
					return "#A9A9A9";
					
					// case "S":
					// 	return "Green";
					// case "W":
					// 	return "#e6e600";
					// case "E":
					// 	return "Red";
					// default:
					// 	return "Gray";
			}
			// switch (sStatus) {
			// case "S":
			// 	return "../webapp/images/green1.jpg";
			// case "W":
			// 	return "../webapp/images/yellow.jpg";
			// case "E":
			// 	return "../webapp/images/red.jpg";
			// default:
			// 	return "../webapp/images/red.jpg";
			// }
		}
	};
});