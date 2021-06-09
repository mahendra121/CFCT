var sServiceURL;
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/apac/toolZ_FIORI_AUTO_CONFIG/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.apac.toolZ_FIORI_AUTO_CONFIG.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			sServiceURL = this.getMetadata().getManifestEntry("sap.app").dataSources["Z_FIORI_AUTO_CONFIG_SRV"].uri;
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

		}
	});
});