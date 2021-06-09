/*-----------------------------------------------------------------------------------------------------------------*
 * Automation Tool: C-FCT - Capgemini Fiori Configuration Tool
 * Description: The tool helps to validate and configure SAP Fiori apps automatically
 *-----------------------------------------------------------------------------------------------------------------*
 * BU/Region: SAP APAC India
 * Author:
 *            Solution Architect/ Solution Lead - Tapas Sadhukhan/ Prasanna Bhangale
 *            Fiori Specialist - Ashikesh Hate/ Soumya Mishra
 *            ABAP Specialist - Sachin Mahajan/ Amol Nikam
 * Version: v1.0
 * Release Date: 16-March-2020
 * Transport: S47K901014
 *-----------------------------------------------------------------------------------------------------------------*
 * BU/Region:
 * Author:
 * Version:
 * Release Date:
 * Transport:\&nbsp;
 *-----------------------------------------------------------------------------------------------------------------*/

var that;
var configAllModel;
var oTable;
var oODataModel;
var oIcfModel;
var oAliasModel;
var oNoteModel;
var oCompModel;
var oCompModel1;
var keyConfigCols;
var baseServices;
var oModelAliasAH;
var releaseId;
var fioriIds;
var IcfData;
var oOData;
var cataLogData;
var ids;
var oDataTableData;
var icfTableData;
var aliasTableData;
var noteTableData;
var compTableData;
var compTableData1;
var oFioriId;
var oFioriName;
var oOdataName;
var oOdataVerison;
var iFioriId;
var iFioriName;
var iIcfName;
var catagfioriId;
var techCatalog1;
var aliasCatalog1;
var totalFioriLibFail;
var totalNotesFioriLibFail;
var totalApps;
var totalUI5Apps;
var totalAppsLOB;
var GUIAppCount;
var gvPackageLS, gvWBTRLS, gvCTRLS;
var gvPackage, gvWBTR, gvCTR;

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"../formatter/formatterNew",
	"sap/m/MessageToast"
], function(Controller, MessageBox, formatter, MessageToast) {
	"use strict";

	return Controller.extend("com.apac.toolZ_FIORI_AUTO_CONFIG.controller.home", {
		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.cg.at.AT_VALIDATE_SICF.view.home
		 */
		onInit: function() {
			that = this;

			fioriIds = "'";
			ids = [];
			oDataTableData = [];
			icfTableData = [];
			aliasTableData = [];
			noteTableData = [];
			compTableData = [];
			compTableData1 = [];
			oFioriId = [];
			oFioriName = [];
			oOdataName = [];
			oOdataVerison = [];
			iFioriId = [];
			iFioriName = [];
			iIcfName = [];
			catagfioriId = [];
			techCatalog1 = [];
			aliasCatalog1 = [];
			totalFioriLibFail = 0;
			totalNotesFioriLibFail = 0;
			totalApps = 0;
			totalUI5Apps = 0;
			totalAppsLOB = 0;
			GUIAppCount = 0;

			that._busyDialog = new sap.m.BusyDialog({
				text: "Loading"
			});

			that._busyValidate = new sap.m.BusyDialog({
				text: "Validation step is in progress"
			});

			that._busyActivate = new sap.m.BusyDialog({
				text: "Activation step is in progress"
			});

			that._oModel = new sap.ui.model.odata.ODataModel(sServiceURL);

			keyConfigCols = ["fioriId", "AppName", "PrimaryODataServiceName", "BusinessCatalogName", "TechnicalCatalogName",
				"PrimaryODataServiceVersion", "BSPApplicationURL", "AdditionalODataServices", "AdditionalODataServicesVersions", "LineofBusiness",
				"UITechnology", "WDAConfiguration", "NoteCollection", "FrontendSoftwareComponent", "BackendSoftwareComponentVersions"
			];

			baseServices = ["/sap/bc/ui5_ui5/sap/fin_acc_userpar", "/sap/bc/ui5_ui5/sap/fin_lib", "/sap/bc/ui5_ui5/sap/hcmfab_common"];

			configAllModel = new sap.ui.model.json.JSONModel();
			configAllModel.loadData("JSON/configAll.json", null, false);
			oTable = new sap.ui.table.Table({
				id: "idConfigAll",
				visibleRowCount: 3,
				enableSelectAll: false,
				selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly
			});

			var oToolbar = new sap.m.Toolbar({
				content: [new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						id: "id-btnValidateMain",
						text: "Validate",
						enabled: true,
						press: function() {
							var key = that.getView().byId("idIconTabBar").getProperty("selectedKey");
							switch (key) {
								case "LS":
									that._validateConf("LS");
									// that._validateConf("LS1");

									break;

								case "":
									that._validateConf("LS");
									// that._validateConf("LS1");

									break;

								case "GI":
									that._validateConf("GI");
									break;

								case "ES":
									that._validateConf("ES");
									break;

								case "BW":
									that._validateConfBW("BW");
									break;
							}

						},
						icon: "sap-icon://survey"
					}), new sap.m.Button({
						id: "id-btnActiveMain",
						text: "Activate",
						press: function() {
							// var LSData = ["/UI2/PAGE_BUILDER_CONF", "/UI2/PAGE_BUILDER_CUST", "/UI2/PAGE_BUILDER_PERS", "/UI2/INTEROP",
							// 	"/UI2/TRANSPORT"
							// ];
							// var LSData1 = ["/sap/bc/ui5_ui5/sap/ar_srvc_launch", "/sap/bc/ui5_ui5/sap/ar_srvc_news",
							// 	"/sap/bc/ui5_ui5/sap/arsrvc_upb_admn", "/sap/bc/ui5_ui5/ui2/ushell",
							// 	"/sap/bc/ui2/nwbc", "/sap/bc/ui2/start_up", "/sap/public/bc/icf/logoff", "/sap/public/bc/ui2",
							// 	"/sap/public/bc/ui5_ui5"
							// ];
							var GIData = ["/sap/bc/gui/sap/its/webgui"];

							var key = that.getView().byId("idIconTabBar").getProperty("selectedKey");
							switch (key) {
								case "LS":
									that._getTRBatch("LSActivate");
									// that.activateServicesODataConf(LSData, "LS");
									// that.activateServicesSICFConf(LSData1, "LS");

									break;

								case "":
									that._getTRBatch("LSActivate");
									// that.activateServicesODataConf(LSData, "LS");
									// that.activateServicesSICFConf(LSData1, "LS");

									break;

								case "GI":
									that.activateServicesSICFConf(GIData, "GI");
									break;
							}

						},
						icon: "sap-icon://activate"
					})
				]
			});

			oTable.addExtension(oToolbar);

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				rows: configAllModel.getData().rowData,
				columns: configAllModel.getData().columnData
			});

			oTable.setModel(oModel);

			oTable.bindColumns("/columns", function(sID, oContext) {
				var columnName = oContext.getObject().columnName;
				if (columnName === "Status") {
					return new sap.ui.table.Column({
						label: columnName,
						hAlign: sap.ui.core.HorizontalAlign.Center,
						template: new sap.ui.core.Icon({
							src: {
								path: columnName,
								formatter: that.formatter.serviceStatus
							},
							color: {
								path: columnName,
								formatter: that.formatter.colorStatus
							}
						})
					});

				} else {
					return new sap.ui.table.Column({
						label: columnName,
						template: columnName
					});
				}
			});

			oTable.getColumns()[2].setVisible(false);
			oTable.getColumns()[3].setVisible(false);
			oTable.bindRows("/rows");
			that.byId("idIconTabBar").insertContent(oTable);
			// that._validateConf();
			// that._activate2ndStep();
			that._getAllComponents("init");
			that.activateServicesSICFConf(baseServices, "BS");
		},

		_activate2ndStep: function() {
			var data = sap.ui.getCore().byId("idConfigAll").getModel().getData().rows;

			var result = data.filter(function(row) {
				if (that._S4Version === "1909") {
					if (row.SubType !== "ES2") {
						return row.Status === "E" || row.Status === "W" || row.Status === "";
					}
				} else {
					return row.Status === "E" || row.Status === "W" || row.Status === "";
				}
			});

			if (result.length) {
				that.getView().byId("id-btnStep1").setEnabled(false); //false
			} else {
				that.getView().byId("id-btnStep1").setEnabled(true);
			}
		},

		_validateConf: function(from) {
			var batchChanges = [];
			// that._busyDialog.open();
			that._busyValidate.open();
			that._oModel.clearBatch();
			batchChanges = [];

			var oData = ["/UI2/PAGE_BUILDER_CONF", "/UI2/PAGE_BUILDER_CUST", "/UI2/PAGE_BUILDER_PERS", "/UI2/INTEROP", "/UI2/TRANSPORT"];
			var oSICF = ["/default_host/sap/bc/ui5_ui5/sap/ar_srvc_launch", "/default_host/sap/bc/ui5_ui5/sap/ar_srvc_news",
				"/default_host/sap/bc/ui5_ui5/sap/arsrvc_upb_admn",
				"/default_host/sap/bc/ui5_ui5/ui2/ushell", "/default_host/sap/bc/ui2/nwbc",
				"/default_host/sap/bc/ui2/start_up", "/default_host/sap/public/bc/icf/logoff", "/default_host/sap/public/bc/ui2",
				"/default_host/sap/public/bc/ui5_ui5"
			];

			var oSICFGI = ["/default_host/sap/bc/gui/sap/its/webgui"];
			var oESH = ["Search Category", "Search Connector"];
			var oEsH1 = ["/default_host/sap/bc/webdynpro/sap/ESH_ADMIN_UI_COMPONENT", "/default_host/sap/bc/webdynpro/sap/esh_eng_modelling",
				"/default_host/sap/bc/webdynpro/sap/esh_eng_wizard", "/default_host/sap/bc/webdynpro/sap/esh_search_results_ui",
				"/default_host/sap/bc/webdynpro/sap/wdhc_help_center",
				"/default_host/sap/es/cockpit", "/default_host/sap/es/saplink", "/default_host/sap/es/search", "/default_host/sap/es/ina"
			];

			if (from === "LS") {
				var data;
				var oEntry = [];
				var i = 0;

				oEntry.fioriId = "";
				oEntry.NAVSERVICEDTLS = [];

				for (i = 0; i < oData.length; i++) {
					data = {};
					data.fioriId = "";
					data.AppName = "";
					data.PrimaryODataServiceName = oData[i];
					data.PrimaryODataServiceVersion = "";
					data.Status = "";
					// data1 = "";
					data.Message = "";
					oEntry.NAVSERVICEDTLS.push(data);
				}

				batchChanges = [];
				batchChanges.push(that._oModel.createBatchOperation('/ETHeaderSet', "POST", oEntry));
				that._oModel.addBatchChangeOperations(batchChanges);

				// that._oModel.create('/ETHeaderSet', oEntry, null, function(oResponse, oError) {
				// 	var result = oResponse.NAVSERVICEDTLS.results.filter(function(data) {
				// 		return data.Status === "E" || data.Status === "W";
				// 	});

				data = {};
				oEntry = [];
				oEntry.fioriId = "";
				oEntry.NAVSICFDTLS = [];
				// batchChanges = [];

				i = 0;
				for (i = 0; i < oSICF.length; i++) {
					data = {};
					data.fioriId = "";
					data.AppName = "";
					data.BSPApplicationURL = oSICF[i];
					data.Type = "";
					data.Status = "";
					data.Message = "";
					oEntry.NAVSICFDTLS.push(data);
				}

				batchChanges = [];
				batchChanges.push(that._oModel.createBatchOperation('/ETSicfHdrSet', "POST", oEntry));
				that._oModel.addBatchChangeOperations(batchChanges);

				that._oModel.submitBatch(function(oResult, oResponse) {
						var result = [];
						result = oResult.__batchResponses[0].__changeResponses[0].data.NAVSERVICEDTLS.results.filter(function(data) {
							return data.Status === "E" || data.Status === "W";
						});

						if (result.length) {
							configAllModel.getData().rowData[0].Status = "E";
							sap.ui.getCore().byId("id-btnActiveMain").setEnabled(true);
						} else {
							configAllModel.getData().rowData[0].Status = "S";
						}

						result = [];
						result = oResult.__batchResponses[1].__changeResponses[0].data.NAVSICFDTLS.results.filter(function(data) {
							return data.Status === "E" || data.Status === "W";
						});

						if (result.length) {
							configAllModel.getData().rowData[1].Status = "E";

							sap.ui.getCore().byId("id-btnActiveMain").setEnabled(true);
						} else {
							configAllModel.getData().rowData[1].Status = "S";
						}

						sap.ui.getCore().byId("idConfigAll").getModel().refresh();
						sap.ui.getCore().byId("id-btnValidateMain").setEnabled(false);
						that._activate2ndStep();

						that._busyValidate.close();

					},
					function(oError) {
						MessageToast.show("Error occured.Please contact system administrator");
						that._busyValidate.close();
					});
			}

			if (from === "LS1" || from === "GI") {
				var data1;
				var oEntry1 = [];
				oEntry1.fioriId = "";
				oEntry1.NAVSICFDTLS = [];

				if (from === "GI") {
					oSICF = oSICFGI;
				}

				for (var i = 0; i < oSICF.length; i++) {
					data1 = {};
					data1.fioriId = "";
					data1.AppName = "";
					data1.BSPApplicationURL = oSICF[i];
					data1.Type = "";
					data1.Status = "";
					data1.Message = "";
					oEntry1.NAVSICFDTLS.push(data1);
				}

				batchChanges.push(that._oModel.createBatchOperation('/ETSicfHdrSet', "POST", oEntry1));
				that._oModel.addBatchChangeOperations(batchChanges);

				// that._oModel.create('/ETSicfHdrSet', oEntry1, null, function(oResponse, oError) {
				// 	var result = oResponse.NAVSICFDTLS.results.filter(function(data) {
				// 		return data.Status === "E" || data.Status === "W";
				// 	});

				that._oModel.submitBatch(function(oResult, oResponse) {
					var result = oResult.__batchResponses[0].__changeResponses[0].data.NAVSICFDTLS.results.filter(function(data) {
						return data.Status === "E" || data.Status === "W";
					});

					if (result.length) {
						if (from === "GI") {
							configAllModel.getData().rowData[4].Status = "E";
						} else {
							configAllModel.getData().rowData[1].Status = "E";
						}

						sap.ui.getCore().byId("id-btnActiveMain").setEnabled(true);
					} else {
						if (from === "GI") {
							configAllModel.getData().rowData[4].Status = "S";
						} else {
							configAllModel.getData().rowData[1].Status = "S";
						}
					}

					sap.ui.getCore().byId("idConfigAll").getModel().refresh();

					sap.ui.getCore().byId("id-btnValidateMain").setEnabled(false);
					that._activate2ndStep();

					that._busyValidate.close();
				}, function() {
					MessageToast.show("Error occured. Please contact system administrator");
					that._busyValidate.close();
				});
			}

			if (from === "ES") {
				var data3;
				var oEntry3 = [];
				oEntry3.fioriId = "";
				oEntry3.NAVSICFDTLS = [];
				batchChanges = [];
				that._oModel.clearBatch();

				for (var i = 0; i < oEsH1.length; i++) {
					data3 = {};
					data3.fioriId = "";
					data3.AppName = "";
					data3.BSPApplicationURL = oEsH1[i];
					data3.Type = "";
					data3.Status = "";
					data3.Message = "";
					oEntry3.NAVSICFDTLS.push(data3);
				}

				batchChanges = [];
				batchChanges.push(that._oModel.createBatchOperation('/ETSicfHdrSet', "POST", oEntry3));
				that._oModel.addBatchChangeOperations(batchChanges);

				var data2;
				var oEntry2 = [];
				oEntry2.Rowtype = "";
				oEntry2.NAVEHSDTLS = [];

				for (var i = 0; i < oESH.length; i++) {
					data2 = {};
					data2.Rowtype = "";
					data2.Scname = oESH[i];
					data2.Status = "";
					if (oESH[i] === "Search Category") {
						data2.ObjectType = "ESH_CATEGORY";
					} else if (oESH[i] === "Search Connector") {
						data2.ObjectType = "ESH_CONNECTOR";
					}
					oEntry2.NAVEHSDTLS.push(data2);
				}

				batchChanges = [];
				batchChanges.push(that._oModel.createBatchOperation('/ETEhsHdrSet', "POST", oEntry2));
				that._oModel.addBatchChangeOperations(batchChanges);

				// that._oModel.create('/ETSicfHdrSet', oEntry3, null, function(oResponse, oError) {
				// 	var result = oResponse.NAVSICFDTLS.results.filter(function(data) {
				// 		return data.Status === "E" || data.Status === "W";
				// 	});

				that._oModel.submitBatch(function(oResult, oResponse) {
						var result = [];
						result = oResult.__batchResponses[0].__changeResponses[0].data.NAVSICFDTLS.results.filter(function(data) {
							return data.Status === "E" || data.Status === "W";
						});

						if (result.length) {
							configAllModel.getData().rowData[2].Status = "E";
						} else {
							configAllModel.getData().rowData[2].Status = "S";
						}

						result = [];
						result = oResult.__batchResponses[1].__changeResponses[0].data.NAVEHSDTLS.results.filter(function(data) {
							return data.Status === "E" || data.Status === "W";
						});

						if (result.length) {
							configAllModel.getData().rowData[3].Status = "E";
						} else {
							configAllModel.getData().rowData[3].Status = "S";
						}

						sap.ui.getCore().byId("idConfigAll").getModel().refresh();
						sap.ui.getCore().byId("id-btnValidateMain").setEnabled(false);
						that._activate2ndStep();

						that._busyValidate.close();
					},
					function() {
						MessageToast.show("Error occured. Please contact system administrator");
						that._busyValidate.close();
					});

			}

			// sap.ui.getCore().byId("id-btnValidateMain").setEnabled(false);
			// that._activate2ndStep();
		},

		_validateConfBW: function() {
			var batchChanges = [];
			var data;
			var oEntry = [];
			var url = "";
			var oData = ["RSAO_ODATA_SRV"];
			var oSICF = ["/default_host/sap/bw/ina", "/default_host/sap/bw/Mime"];

			that._busyValidate.open();
			that._oModel.clearBatch();

			url = "/ETBWDtlsSet('')";
			batchChanges.push(that._oModel.createBatchOperation(url, "GET"));
			that._oModel.addBatchReadOperations(batchChanges);

			batchChanges = [];
			oEntry = [];
			oEntry.fioriId = "";
			oEntry.NAVSERVICEDTLS = [];

			for (var i = 0; i < oData.length; i++) {
				data = {};
				data.fioriId = "";
				data.AppName = "";
				data.PrimaryODataServiceName = oData[i];
				data.PrimaryODataServiceVersion = "";
				data.Status = "";
				data.Message = "";
				oEntry.NAVSERVICEDTLS.push(data);
			}

			url = "/ETHeaderSet";
			batchChanges.push(that._oModel.createBatchOperation(url, "POST", oEntry));
			that._oModel.addBatchChangeOperations(batchChanges);

			batchChanges = [];
			oEntry = [];
			oEntry.fioriId = "";
			oEntry.NAVSICFDTLS = [];

			for (var j = 0; j < oSICF.length; j++) {
				data = {};
				data.fioriId = "";
				data.AppName = "";
				data.BSPApplicationURL = oSICF[j];
				data.Type = "";
				data.Status = "";
				data.Message = "";
				oEntry.NAVSICFDTLS.push(data);
			}
			url = "/ETSicfHdrSet";
			batchChanges.push(that._oModel.createBatchOperation(url, "POST", oEntry));
			that._oModel.addBatchChangeOperations(batchChanges);

			that._oModel.submitBatch(function(oResponse) {
					var TSA = [];
					var result = [];

					configAllModel.getData().rowData[5].Status = oResponse.__batchResponses[0].data.Status; //Response of BW Client
					configAllModel.getData().rowData[6].Status = oResponse.__batchResponses[0].data.BIContentStatus; //Response of BI Content Activation

					/*Start Response of Technical Service Activation*/
					TSA = [oResponse.__batchResponses[1].__changeResponses[0].data.NAVSERVICEDTLS.results[0].Status, oResponse.__batchResponses[
							2].__changeResponses[0].data.NAVSICFDTLS.results[0].Status, oResponse.__batchResponses[2].__changeResponses[0].data.NAVSICFDTLS
						.results[1].Status
					];

					result = TSA.filter(function(data) {
						return data === "E";
					});

					if (result.length) {
						configAllModel.getData().rowData[7].Status = "E";
					} else {
						configAllModel.getData().rowData[7].Status = "S";
					}
					/*End Response of Technical Service Activation*/

					sap.ui.getCore().byId("idConfigAll").getModel().refresh();
					that._busyValidate.close();

					sap.ui.getCore().byId("id-btnValidateMain").setEnabled(false);
					that._activate2ndStep();
				},
				function(oError) {
					MessageToast.show("Error occured. Please contact system administrator");
					that._busyValidate.close();
				},
				true);

			// that._oModel.read("/ETBWDtlsSet('')", null, null, false, function(oResponse, oError) {
			//   configAllModel.getData().rowData[5].Status = oResponse.Status;
			//   sap.ui.getCore().byId("idConfigAll").getModel().refresh();

			//   var data;
			//   var oData = ["RSAO_ODATA_SRV"];
			//   var oEntry = [];
			//   oEntry.fioriId = "";
			//   oEntry.NAVSERVICEDTLS = [];

			//   for (var i = 0; i < oData.length; i++) {
			//     data = {};
			//     data.fioriId = "";
			//     data.AppName = "";
			//     data.PrimaryODataServiceName = oData[i];
			//     data.PrimaryODataServiceVersion = "";
			//     data.Status = "";
			//     data.Message = "";
			//     oEntry.NAVSERVICEDTLS.push(data);
			//   }

			//   that._oModel.create('/ETHeaderSet', oEntry, null, function(oResponse, oError) {
			//     var result = oResponse.NAVSERVICEDTLS.results.filter(function(data) {
			//       return data.Status === "E" || data.Status === "W";
			//     });

			//     if (result.length) {
			//       configAllModel.getData().rowData[6].Status = "E";
			//       sap.ui.getCore().byId("id-btnActiveMain").setEnabled(true);
			//     } else {
			//       // var data;
			//       var oSICF = ["/default_host/sap/bw/ina", "/default_host//sap/bw/Mime"];
			//       oEntry = [];
			//       // var oEntry3 = [];
			//       oEntry.fioriId = "";
			//       oEntry.NAVSICFDTLS = [];

			//       for (var j = 0; j < oSICF.length; j++) {
			//         data = {};
			//         data.fioriId = "";
			//         data.AppName = "";
			//         data.BSPApplicationURL = oSICF[j];
			//         data.Type = "";
			//         data.Status = "";
			//         data.Message = "";
			//         oEntry.NAVSICFDTLS.push(data);
			//       }

			//       that._oModel.create('/ETSicfHdrSet', oEntry, null, function(oResponse, oError) {
			//         var result = oResponse.NAVSICFDTLS.results.filter(function(data) {
			//           return data.Status === "E" || data.Status === "W";
			//         });

			//         if (result.length) {
			//           configAllModel.getData().rowData[6].Status = "E";
			//         } else {
			//           configAllModel.getData().rowData[6].Status = "S";
			//         }

			//         sap.ui.getCore().byId("idConfigAll").getModel().refresh();
			//         that._busyDialog.close();

			//       }, function() {
			//         MessageToast.show("Error occured. Please contact system administrator");
			//         that._busyDialog.close();
			//       });
			//     }

			//     sap.ui.getCore().byId("idConfigAll").getModel().refresh();
			//     that._busyDialog.close();
			//   }, function() {
			//     MessageToast.show("Error occured.Please contact system administrator");
			//     that._busyDialog.close();
			//   });

			//   that._busyDialog.close();

			// }, function() {
			//   MessageToast.show("Error occured.Please contact system administrator");
			//   that._busyDialog.close();
			// });

			// sap.ui.getCore().byId("id-btnValidateMain").setEnabled(false);
			// that._activate2ndStep();
		},

		handleIconTabBarSelect: function(oEvent) {
			sap.ui.getCore().byId("id-btnActiveMain").setEnabled(false);
			sap.ui.getCore().byId("id-btnValidateMain").setEnabled(true);

			var oBinding = oTable.getBinding("rows");
			var selectedKey;

			if (oEvent) {
				selectedKey = oEvent.getParameters("selectedKey").selectedKey;
			} else {
				selectedKey = "LS";
			}

			var filter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, selectedKey);
			oBinding.filter(filter);

			var result = oBinding.aIndices.filter(function(data) {
				return oBinding.oList[data].Status === "";
			});

			var result1 = oBinding.aIndices.filter(function(data) {
				return oBinding.oList[data].Status === "E" || oBinding.oList[data].Status === "W";
			});

			if (result.length) {
				sap.ui.getCore().byId("id-btnValidateMain").setEnabled(true);
				sap.ui.getCore().byId("id-btnActiveMain").setEnabled(false);
			} else {
				sap.ui.getCore().byId("id-btnValidateMain").setEnabled(false);

				if (selectedKey === "ES" || selectedKey === "BW") {
					sap.ui.getCore().byId("id-btnActiveMain").setEnabled(false);
				} else {
					if (result1.length) {
						sap.ui.getCore().byId("id-btnActiveMain").setEnabled(true);
					} else {
						sap.ui.getCore().byId("id-btnActiveMain").setEnabled(false);
					}
				}
			}
		},

		nextStep: function(oEvent) {
			var id;
			if (oEvent.getSource().getId() === "__xmlview0--id-btnStep1") {
				id = "id-btnStep1";
			}
			if (oEvent.getSource().getId() === "__xmlview0--id-btnStep2") {
				id = "id-btnStep2";
			}

			that.getView().byId("_idSteps1").nextStep();
			that.getView().byId(id).setVisible(false);
		},

		validateServicesOData: function() {
			that._busyValidate.open();
			that._oModel.clearBatch();
			var batchChanges = [];
			var oData = oODataModel.getData();
			var data;
			var oEntry = [];
			oEntry.fioriId = "";
			oEntry.NAVSERVICEDTLS = [];

			for (var i = 0; i < oData.length; i++) {
				data = {};
				data.fioriId = oData[i].fioriId;
				data.AppName = oData[i].AppName;
				data.PrimaryODataServiceName = oData[i].PrimaryODataServiceName;
				data.PrimaryODataServiceVersion = oData[i].PrimaryODataServiceVersion;
				data.Status = "";
				data.Alias = oData[i].Alias;
				data.Message = "";
				oEntry.NAVSERVICEDTLS.push(data);
			}

			batchChanges.push(that._oModel.createBatchOperation('/ETHeaderSet', "POST", oEntry));
			that._oModel.addBatchChangeOperations(batchChanges);

			that._oModel.submitBatch(function(oResult, oResponse) {
				oODataModel.setData(oResult.__batchResponses[0].__changeResponses[0].data.NAVSERVICEDTLS.results);
				oODataModel.refresh();

				var oDataTable = that.getView().byId("id-OdataTable");
				oDataTable.unbindRows();
				oDataTable.setModel(oODataModel);
				oDataTable.bindRows("/");

				that.getView().byId("btnValidateOData").setEnabled(false);
				that._enableAnalyzer();
				MessageToast.show("Validation step is completed. Please check the status against each app.");
				that._busyValidate.close();

			}, function(oError) {
				MessageToast.show("Error during validation step. Please contact system administrator");
				that._busyValidate.close();
			});

			that._oModel.clearBatch();
			// that._busyDialog.open();
			// that._oModel.create('/ETHeaderSet', oEntry, null, function(oResponse, oError) {
			// 	that._busyDialog.close();
			// 	oODataModel.setData(oResponse.NAVSERVICEDTLS.results);
			// 	oODataModel.refresh();

			// 	var oDataTable = that.getView().byId("id-OdataTable");
			// 	oDataTable.unbindRows();
			// 	oDataTable.setModel(oODataModel);
			// 	oDataTable.bindRows("/");

			// 	that.getView().byId("btnValidateOData").setEnabled(false);
			// 	that._enableAnalyzer();
			// 	MessageToast.show("Validation step is completed. Please check the status against each app.");

			// }, function() {
			// 	MessageToast.show("Error during validation step. Please contact system administrator");
			// 	that._busyDialog.close();
			// });
		},

		validateServicesSICF: function() {
			that._busyValidate.open();
			var batchChanges = [];
			that._oModel.clearBatch();
			var oData = oIcfModel.getData();

			var data;
			var oEntry = [];
			oEntry.fioriId = "";
			oEntry.NAVSICFDTLS = [];

			for (var i = 0; i < oData.length; i++) {
				data = {};
				data.fioriId = oData[i].fioriId;
				data.AppName = oData[i].AppName;
				data.BSPApplicationURL = oData[i].BSPApplicationURL;
				data.Type = oData[i].Type;
				data.Status = "";
				data.Message = "";
				oEntry.NAVSICFDTLS.push(data);
			}

			batchChanges.push(that._oModel.createBatchOperation('/ETSicfHdrSet', "POST", oEntry));
			that._oModel.addBatchChangeOperations(batchChanges);

			that._oModel.submitBatch(function(oResult, oResponse) {
				oIcfModel.setData(oResult.__batchResponses[0].__changeResponses[0].data.NAVSICFDTLS.results);
				oIcfModel.refresh();

				var IcfTable = that.getView().byId("id-IcfNodesTable");
				IcfTable.unbindRows();
				IcfTable.setModel(oIcfModel);
				IcfTable.bindRows("/");

				that.getView().byId("btnValidateSICF").setEnabled(false);
				that._enableAnalyzer();
				MessageToast.show("Validation step is completed. Please check the status against each app.");
				that._busyValidate.close();

			}, function(oError) {
				MessageToast.show("Error during validation step. Please contact system administrator");
				that._busyValidate.close();
			});

			that._oModel.clearBatch();
			// that._oModel.create('/ETSicfHdrSet', oEntry, null, function(oResponse, oError) {
			// 	oIcfModel.setData(oResponse.NAVSICFDTLS.results);
			// 	oIcfModel.refresh();

			// 	var IcfTable = that.getView().byId("id-IcfNodesTable");
			// 	IcfTable.unbindRows();
			// 	IcfTable.setModel(oIcfModel);
			// 	IcfTable.bindRows("/");

			// 	that.getView().byId("btnValidateSICF").setEnabled(false);
			// 	that._enableAnalyzer();
			// 	MessageToast.show("Validation step is completed. Please check the status against each app.");
			// 	that._busyDialog.close();
			// }, function() {
			// 	MessageToast.show("Error during validation step. Please contact system administrator");
			// 	that._busyDialog.close();
			// });
		},

		validateAlias: function() {
			that._busyValidate.open();
			var batchChanges = [];
			var oData = oAliasModel.getData();
			var data;
			var oEntry = [];

			oEntry.fioriId = "";
			oEntry.NAVALIAS = [];

			for (var i = 0; i < oData.length; i++) {
				data = {};
				data.fioriId = oData[i].fioriId;
				data.Alias = oData[i].Alias;
				data.TechnicalCatalogName = oData[i].TechnicalCatalogName;
				data.Status = "";
				oEntry.NAVALIAS.push(data);
			}

			that._oModel.clearBatch();
			batchChanges.push(that._oModel.createBatchOperation('/ETAliasHdrSet', "POST", oEntry));
			that._oModel.addBatchChangeOperations(batchChanges);

			that._oModel.submitBatch(function(oResult, oResponse) {
				oAliasModel.setData(oResult.__batchResponses[0].__changeResponses[0].data.NAVALIAS.results);
				oAliasModel.refresh();

				var AliasTable = that.getView().byId("id-AliasTable");
				AliasTable.unbindRows();
				AliasTable.setModel(oAliasModel);
				AliasTable.bindRows("/");
				that.getView().byId("btnValidateAlias").setEnabled(false);
				that._enableAnalyzer();
				MessageToast.show("Validation step is completed. Please check the status against each app.");
				that._busyValidate.close();

			}, function(oError) {
				MessageToast.show("Error during validation step. Please contact system administrator");
				that._busyValidate.close();
			});

			that._oModel.clearBatch();
			// that._oModel.create('/ETAliasHdrSet', oEntry, null, function(oResponse, oError) {
			// 	oAliasModel.setData(oResponse.NAVALIAS.results);
			// 	oAliasModel.refresh();

			// 	var AliasTable = that.getView().byId("id-AliasTable");
			// 	AliasTable.unbindRows();
			// 	AliasTable.setModel(oAliasModel);
			// 	AliasTable.bindRows("/");
			// 	that.getView().byId("btnValidateAlias").setEnabled(false);
			// 	that._enableAnalyzer();
			// 	MessageToast.show("Validation step is completed. Please check the status against each app.");
			// 	that._busyDialog.close();
			// }, function() {
			// 	MessageToast.show("Error during validation step. Please contact system administrator");
			// 	that._busyDialog.close();
			// });
		},

		validateNote: function() {
			that._busyValidate.open();

			var batchChanges = [];
			var oData = oNoteModel.getData();
			var oEntry = [];
			oEntry.fioriId = "";
			oEntry.NAVSAPNOTEHDRITM = [];
			oEntry.NAVSAPNOTEHDRITM = oData;

			that._oModel.clearBatch();
			batchChanges.push(that._oModel.createBatchOperation('/ETSapNoteHdrSet', "POST", oEntry));
			that._oModel.addBatchChangeOperations(batchChanges);

			that._oModel.submitBatch(function(oResult, oResponse) {
				var results = [];
				var finalData = [];
				var obj = {};

				results = oResult.__batchResponses[0].__changeResponses[0].data.NAVSAPNOTEHDRITM.results;
				for (var i = 0; i < results.length; i++) {
					obj = {};
					obj.fioriId = results[i].fioriId;
					obj.NoteNo = results[i].NoteNo;
					obj.Status = results[i].Status;
					obj.StatusText = "";
					finalData.push(obj);

					obj = {};
				}

				var NoteTable = that.getView().byId("id-NoteTable");
				NoteTable.unbindRows();
				oNoteModel.setData(finalData);
				oNoteModel.refresh();
				NoteTable.setModel(oNoteModel);
				NoteTable.bindRows("/");
				that.getView().byId("btnValidateNote").setEnabled(false);
				that._enableAnalyzer();
				MessageToast.show("Validation step is completed. Please check the status against each app.");
				that._busyValidate.close();

			}, function(oError) {
				MessageToast.show("Error during validation step. Please contact system administrator");
				that._busyValidate.close();
			});

			that._oModel.clearBatch();

			// that._oModel.create('/ETSapNoteHdrSet', oEntry, null, function(oResponse, oError) {
			// 	var results = [];
			// 	var finalData = [];
			// 	var obj = {};

			// 	results = oResponse.NAVSAPNOTEHDRITM.results;
			// 	for (var i = 0; i < results.length; i++) {
			// 		obj = {};
			// 		obj.fioriId = results[i].fioriId;
			// 		obj.NoteNo = results[i].NoteNo;
			// 		obj.Status = results[i].Status;
			// 		obj.StatusText = "";
			// 		finalData.push(obj);

			// 		obj = {};
			// 	}

			// 	var NoteTable = that.getView().byId("id-NoteTable");
			// 	NoteTable.unbindRows();
			// 	oNoteModel.setData(finalData);
			// 	oNoteModel.refresh();
			// 	NoteTable.setModel(oNoteModel);
			// 	NoteTable.bindRows("/");
			// 	that.getView().byId("btnValidateNote").setEnabled(false);
			// 	that._enableAnalyzer();
			// 	MessageToast.show("Validation step is completed. Please check the status against each app.");
			// 	that._busyDialog.close();
			// }, function() {
			// 	MessageToast.show("Error during validation step. Please contact system administrator");
			// 	that._busyDialog.close();
			// });
		},

		activateServicesODataConf: function(oData) {
			var data;
			var oEntry = [];
			// oEntry.fioriId = "";
			// oEntry.NAVODTASERVDTLS = [];

			oEntry.fioriId = "";
			oEntry.Package = gvPackageLS;
			oEntry.WorkTR = gvWBTRLS;
			oEntry.CustTR = gvCTRLS;
			oEntry.NAVODTASERVDTLS = [];

			for (var i = 0; i < oData.length; i++) {
				data = {};
				data.fioriId = "";
				data.AppName = "";
				data.PrimaryODataServiceName = oData[i];
				data.PrimaryODataServiceVersion = "0001";
				data.Status = "";
				data.Alias = "LOCAL";
				data.Message = "";
				oEntry.NAVODTASERVDTLS.push(data);
			}

			that._busyDialog.open();
			that._oModel.create('/ETHeaderOdataSet', oEntry, null, function(oResponse, oError) {
				for (var i = 0; i < oResponse.NAVODTASERVDTLS.results.length; i++) {
					if (oResponse.NAVODTASERVDTLS.results[i].Status === "E" || oResponse.NAVODTASERVDTLS.results[i].Status === "W") {
						configAllModel.getData().rowData[0].Status = oResponse.NAVODTASERVDTLS.results[i].Status;
						configAllModel.refresh();
						break;
					} else {
						configAllModel.getData().rowData[0].Status = oResponse.NAVODTASERVDTLS.results[i].Status;
						configAllModel.refresh();
					}
				}

				oTable.getModel().refresh();

				MessageToast.show("Activation step is completed. Please check the status.");
				that._activate2ndStep();
				that._busyDialog.close();

			}, function() {
				MessageToast.show("Error during activation step. Please contact system administrator");
				that._busyDialog.close();
			});

			sap.ui.getCore().byId("id-btnActiveMain").setEnabled(false);
		},

		activateServicesSICFConf: function(oData, from) {
			var data;
			var oEntry = [];
			oEntry.fioriId = "";
			oEntry.NAVSICFSERVDTLS = [];

			for (var i = 0; i < oData.length; i++) {
				data = {};
				data.fioriId = "";
				data.AppName = "";
				data.BSPApplicationURL = oData[i];
				data.Type = "";
				data.Status = "";
				data.Message = "";
				oEntry.NAVSICFSERVDTLS.push(data);
			}

			that._busyDialog.open();
			that._oModel.create('/ETHeaderSicfSet', oEntry, null, function(oResponse, oError) {
				if (from !== "BS") {
					for (var i = 0; i < oResponse.NAVSICFSERVDTLS.results.length; i++) {
						if (oResponse.NAVSICFSERVDTLS.results[i].Status === "E" || oResponse.NAVSICFSERVDTLS.results[i].Status === "W") {
							if (from === "LS" || from === "") {
								configAllModel.getData().rowData[1].Status = oResponse.NAVSICFSERVDTLS.results[i].Status;
							} else if (from === "GI") {
								configAllModel.getData().rowData[4].Status = oResponse.NAVSICFSERVDTLS.results[i].Status;
							}
							configAllModel.refresh();
							break;
						} else {
							if (from === "LS" || from === "") {
								configAllModel.getData().rowData[1].Status = oResponse.NAVSICFSERVDTLS.results[i].Status;
							} else if (from === "GI") {
								configAllModel.getData().rowData[4].Status = oResponse.NAVSICFSERVDTLS.results[i].Status;
							}
							configAllModel.refresh();
						}
					}

					oTable.getModel().refresh();
					MessageToast.show("Activation step is completed. Please check the status.");
					that._activate2ndStep();
				}
				that._busyDialog.close();

			}, function() {
				MessageToast.show("Error during Activation step. Please contact system administrator");
				that._busyDialog.close();
			});

			sap.ui.getCore().byId("id-btnActiveMain").setEnabled(false);
		},

		activateServicesOData: function() {
			that._busyActivate.open();
			var batchChanges = [];
			that._oModel.clearBatch();
			var data;
			var oEntry = [];

			oEntry.fioriId = "";
			oEntry.Package = gvPackage;
			oEntry.WorkTR = gvWBTR;
			oEntry.CustTR = gvCTR;
			oEntry.NAVODTASERVDTLS = [];

			var oData = that.getView().byId("id-OdataTable1").getModel().getData();

			for (var i = 0; i < oData.length; i++) {
				data = {};
				data.fioriId = oData[i].fioriId;
				data.AppName = oData[i].AppName;
				data.PrimaryODataServiceName = oData[i].PrimaryODataServiceName;
				data.PrimaryODataServiceVersion = oData[i].PrimaryODataServiceVersion;
				data.Status = oData[i].Status;
				data.Alias = oData[i].Alias;
				data.Message = "";
				oEntry.NAVODTASERVDTLS.push(data);
			}

			batchChanges.push(that._oModel.createBatchOperation('/ETHeaderOdataSet', "POST", oEntry));
			that._oModel.addBatchChangeOperations(batchChanges);

			that._oModel.submitBatch(function(oResult, oResponse) {
				that.getView().byId("id-OdataTable1").getModel().setData(oResult.__batchResponses[0].__changeResponses[0].data.NAVODTASERVDTLS
					.results);
				that.getView().byId("id-OdataTable1").getModel().refresh();
				that.getView().byId("btnActivateOData").setEnabled(false);
				that.getView().byId("btnDownloadOData").setEnabled(true);
				MessageToast.show("Activation step is completed. Please check the status against each app.");

				that._enableFinalSummary();
				that._busyActivate.close();

			}, function(oError) {
				MessageToast.show("Error during activation step. Please contact system administrator");
				that._busyActivate.close();
			});

			// that._oModel.create('/ETHeaderOdataSet', oEntry, null, function(oResponse, oError) {
			// 	that.getView().byId("id-OdataTable1").getModel().setData(oResponse.NAVODTASERVDTLS.results);
			// 	that.getView().byId("id-OdataTable1").getModel().refresh();
			// 	that.getView().byId("btnActivateOData").setEnabled(false);
			// 	that.getView().byId("btnDownloadOData").setEnabled(true);
			// 	MessageToast.show("Activation step is completed. Please check the status against each app.");

			// 	that._enableFinalSummary();
			// }, function(oError) {
			// 	MessageToast.show("Error during activation step. Please contact system administrator");
			// });

			// that._busyDialog.close();
		},

		downloadOData: function() {
			var oData = [];
			that.getView().byId("id-OdataTable1").getModel().getData().forEach(function(data) {
				var obj = {};
				if (data.Status === "S") {
					if (data.PrimaryODataServiceName.charAt(0) === "/") {
						obj.ActivatedService = "/sap/opu/odata/sap" + data.PrimaryODataServiceName;
					} else {
						obj.ActivatedService = "/sap/opu/odata/sap/" + data.PrimaryODataServiceName;
					}

					oData.push(obj);
					obj = {};
				}
			});

			exportData("csv", oData);
			oData.length = 0;
		},

		activateServicesSICF: function() {
			that._busyActivate.open();
			var batchChanges = [];
			that._oModel.clearBatch();
			var data;
			var oEntry = [];
			var oData;
			oEntry.fioriId = "";
			oEntry.NAVSICFSERVDTLS = [];
			oData = that.getView().byId("id-IcfNodesTable1").getModel().getData();

			for (var i = 0; i < oData.length; i++) {
				data = {};
				data.fioriId = oData[i].fioriId;
				data.AppName = oData[i].AppName;
				data.BSPApplicationURL = oData[i].BSPApplicationURL;
				data.Type = oData[i].Type;
				data.Status = oData[i].Status;
				data.Message = "";
				oEntry.NAVSICFSERVDTLS.push(data);
			}

			batchChanges.push(that._oModel.createBatchOperation('/ETHeaderSicfSet', "POST", oEntry));
			that._oModel.addBatchChangeOperations(batchChanges);

			that._oModel.submitBatch(function(oResult, oResponse) {
				that.getView().byId("id-IcfNodesTable1").getModel().setData(oResult.__batchResponses[0].__changeResponses[0].data.NAVSICFSERVDTLS
					.results);
				that.getView().byId("id-IcfNodesTable1").getModel().refresh();
				that.getView().byId("btnActivateSICF").setEnabled(false);
				that.getView().byId("btnDownloadSICF").setEnabled(true);

				MessageToast.show("Activation step is completed. Please check the status against each app.");
				that._enableFinalSummary();
				that._busyActivate.close();

			}, function(oError) {
				MessageToast.show("Error during activation step. Please contact system administrator");
				that._busyActivate.close();
			});

			// that._oModel.create('/ETHeaderSicfSet', oEntry, null, function(oResponse, oError) {
			// 	that.getView().byId("id-IcfNodesTable1").getModel().setData(oResponse.NAVSICFSERVDTLS.results);
			// 	that.getView().byId("id-IcfNodesTable1").getModel().refresh();
			// 	that.getView().byId("btnActivateSICF").setEnabled(false);
			// 	that.getView().byId("btnDownloadSICF").setEnabled(true);

			// 	MessageToast.show("Activation step is completed. Please check the status against each app.");
			// 	that._enableFinalSummary();
			// }, function() {
			// 	MessageToast.show("Error during activation step. Please contact system administrator");
			// });

			// that._busyDialog.close();
		},

		downloadSICF: function() {
			var oData = [];
			that.getView().byId("id-IcfNodesTable1").getModel().getData().forEach(function(data) {
				var obj = {};
				if (data.Status === "S") {
					obj.ActivatedService = data.BSPApplicationURL;
					oData.push(obj);

					obj = {};
				}
			});

			exportData("csv", oData);
			oData.length = 0;
		},

		_enableAnalyzer: function() {
			if (that.getView().byId("btnValidateOData").getEnabled() === false && that.getView().byId("btnValidateSICF").getEnabled() ===
				false && that.getView().byId("btnValidateAlias").getEnabled() === false && that.getView().byId("btnValidateNote").getEnabled() ===
				false && that.getView().byId("btnValidateComp").getEnabled() === false && that.getView().byId("btnValidateComp1").getEnabled() ===
				false) {

				that.getView().byId("id-btnStep3").setEnabled(true);
			} else {
				that.getView().byId("id-btnStep3").setEnabled(false);
			}
		},

		_enableFinalSummary: function() {
			if (that.getView().byId("btnActivateOData").getEnabled() === false && that.getView().byId("btnActivateSICF").getEnabled() ===
				false) {

				that.getView().byId("id-btnStep5").setEnabled(true);
			} else {
				that.getView().byId("id-btnStep5").setEnabled(false);
			}
		},

		goToAutoConfig: function() {
			var oDataAuto = oODataModel.getData();
			var SICFAuto = oIcfModel.getData();
			var AliasAuto = oAliasModel.getData();

			var oDataAutoModel = new sap.ui.model.json.JSONModel();
			var SICFAutoModel = new sap.ui.model.json.JSONModel();
			var AliasAutoModel = new sap.ui.model.json.JSONModel();

			var oDataAuto1 = [];
			var SICFAuto1 = [];
			var AliasAuto1 = [];

			if (oDataAuto.length > 0) {
				oDataAuto1 = oDataAuto.filter(function(data) {
					return data.Status === "E" || data.Status === "W";
				});
				oDataAutoModel.setData(oDataAuto1);
				if (oDataAuto1.length) {
					that.getView().byId("btnActivateOData").setEnabled(true);
				}
			}

			if (SICFAuto.length > 0) {
				SICFAuto1 = SICFAuto.filter(function(data) {
					return data.Status === "E" || data.Status === "W";
				});
				SICFAutoModel.setData(SICFAuto1);
				if (SICFAuto1.length) {
					that.getView().byId("btnActivateSICF").setEnabled(true);
				}
			}

			if (AliasAuto.length > 0) {
				AliasAuto1 = AliasAuto.filter(function(data) {
					return data.Status === "E" || data.Status === "W";
				});
				AliasAutoModel.setData(AliasAuto1);
			}

			that._enableFinalSummary();

			var oDataTable1 = this.getView().byId("id-OdataTable1");
			var IcfTable1 = this.getView().byId("id-IcfNodesTable1");
			var AliasTable1 = this.getView().byId("id-AliasTable1");

			oDataTable1.setModel(oDataAutoModel);
			IcfTable1.setModel(SICFAutoModel);
			AliasTable1.setModel(AliasAutoModel);

			oDataTable1.bindRows("/");
			IcfTable1.bindRows("/");
			AliasTable1.bindRows("/");

			that.getView().byId("id-CBAlias").setModel(oModelAliasAH);

			that.getView().byId("_idSteps1").nextStep();
			that.getView().byId("id-btnStep4").setVisible(false);

			if (oDataAuto1.length || SICFAuto1.length) {
				that._getTRBatch("ASODataActivate");
			}

			oDataAuto = [];
			SICFAuto = [];
			AliasAuto = [];
		},

		changeCBAlias: function(oEvent) {
			var cbAlias = oEvent.getSource();
			var oModel = that.getView().byId("id-OdataTable1").getModel();

			if (!cbAlias.getSelectedKey()) {
				cbAlias.setValueState("Error");
			} else {
				cbAlias.setValueState("None");
				that.getView().byId("id-CBAlias").setEnabled(false);
				for (var i = 0; i < oModel.getData().length; i++) {
					if (!oModel.getData()[i].Alias) {
						oModel.getData()[i].Alias = oEvent.getParameter("newValue");
					}
				}
			}

			oModel.refresh();
		},

		pressInactivateOData: function() {
			that.getView().byId("btnActivateOData").setEnabled(true);
		},

		pressAllOData: function() {
			that.getView().byId("btnActivateOData").setEnabled(false);
		},

		_searchColumn: function(column) {
			return keyConfigCols.includes(column);
		},

		_processApps: function(data) {
			var notesData = [];
			var allNotes = [];
			var allComp = [];
			var obj = {};

			var rbIndex = that.getView().byId("rbg1").getProperty("selectedIndex");
			GUIAppCount = 0;
			var oTableData = data.filter(function(row) {
				if (row.ApplicationType === "SAP GUI") {
					GUIAppCount++;
				} else {
					return (row.fioriId);
				}
			});

			totalUI5Apps = oTableData.length;
			var addtnOdataService = [];
			var addtnOdataVersion = [];
			var addnId = [];
			var addnApp = [];
			var techCatalog = [];
			var fioriId = [];
			var aliasCatalog = [];
			var technologyType = [];

			var oDataTable = this.getView().byId("id-OdataTable");
			var IcfTable = this.getView().byId("id-IcfNodesTable");
			var AliasTable = this.getView().byId("id-AliasTable");

			oDataTable.unbindRows();
			IcfTable.unbindRows();
			AliasTable.unbindRows();

			var a = [];
			var b = [];
			var c = [];

			for (var i = 0; i < oTableData.length; i++) {
				if (rbIndex === 0) {
					a = oTableData[i].LineofBusiness.split(",");
					b = b.concat(a);
					a.length = 0;
				} else {
					a = oTableData[i].GTMLoBName.split(",");
					b = b.concat(a);
					a.length = 0;
				}

				a = oTableData[i].ApplicationType.split(",");
				c = c.concat(a);
				a.length = 0;

				if (oTableData[i].UITechnology === "Web Dynpro") {
					var WDAName = "";
					var index = 0;

					if (oTableData[i].BSPApplicationURL) {
						iIcfName.push(oTableData[i].BSPApplicationURL);
					} else {
						if (rbIndex === 0) {
							WDAName = oTableData[i].WDAConfiguration;
						} else {
							if (oTableData[i].WDAConfiguration) {
								WDAName = oTableData[i].WDAConfiguration;
							} else {
								WDAName = oTableData[i].LeadingTransactionCodes;
							}

							index = WDAName.indexOf("(");
							if (index > 0) {
								WDAName = WDAName.slice(0, index).trimEnd();
							}
							if (WDAName.charAt(0) === "/") {
								iIcfName.push("/sap/bc/webdynpro" + WDAName);
							} else {
								iIcfName.push("/sap/bc/webdynpro/sap/" + WDAName);
							}
						}
					}

					iFioriId.push(oTableData[i].fioriId);
					iFioriName.push(oTableData[i].AppName);
					// iIcfName.push("/default_host/sap/bc/webdynpro/sap" + oTableData[i].fioriId);
					technologyType.push(oTableData[i].UITechnology);
				} else if (oTableData[i].BSPApplicationURL) {
					iFioriId.push(oTableData[i].fioriId);
					iFioriName.push(oTableData[i].AppName);
					iIcfName.push(oTableData[i].BSPApplicationURL);
					technologyType.push(oTableData[i].UITechnology);
				}

				if (oTableData[i].PrimaryODataServiceName) {
					oFioriId.push(oTableData[i].fioriId);
					oFioriName.push(oTableData[i].AppName);
					oOdataName.push(oTableData[i].PrimaryODataServiceName);
					oOdataVerison.push(oTableData[i].PrimaryODataServiceVersion);

				}

				if (oTableData[i].AdditionalODataServices) {
					if ((oTableData[i].AdditionalODataServices).search(",") !== -1) {
						var temp = (oTableData[i].AdditionalODataServices).split(",");
						var tempVer = (oTableData[i].AdditionalODataServicesVersions).split(",");
						for (var t = 0; t < temp.length; t++) {
							addtnOdataService.push(temp[t].trimStart());
							addtnOdataVersion.push(tempVer[t].trimStart());
							addnId.push(oTableData[i].fioriId);
							addnApp.push(oTableData[i].AppName);
						}
					} else {
						addtnOdataService.push(oTableData[i].AdditionalODataServices);
						addtnOdataVersion.push(oTableData[i].AdditionalODataServicesVersions);
						addnId.push(oTableData[i].fioriId);
						addnApp.push(oTableData[i].AppName);
					}
				}

				if ((oTableData[i].TechnicalCatalogName).search(":") !== -1) {
					techCatalog.push(oTableData[i].TechnicalCatalogName);
					fioriId.push(oTableData[i].fioriId);
				}

				//Start Notes
				if (oTableData[i].NoteCollection) {
					var results = [];
					obj = {};
					results = oTableData[i].NoteCollection.split(",");
					for (var note = 0; note < results.length; note++) {
						obj = {};
						var result = results[note].split("-");
						obj.fioriId = oTableData[i].fioriId;
						obj.NoteNo = result[0].trimEnd().trimStart();
						allNotes.push(obj);

						obj = {};
					}
				}
				//End Notes

				//Start Comp
				if (oTableData[i].FrontendSoftwareComponent) { // || oTableData[i].BackendSoftwareComponentVersions) {
					var results = [];
					obj = {};

					var FCData = oTableData[i].FrontendSoftwareComponent.split(",");
					var BCData = oTableData[i].BackendSoftwareComponentVersions.split(",");

					if (FCData.length > BCData.length) {
						results = FCData;
					} else {
						results = BCData;
					}
					for (var comp = 0; comp < results.length; comp++) {
						obj = {};
						obj.fioriId = oTableData[i].fioriId;

						if (comp < FCData.length) {
							obj.frontComp = FCData[comp].trimEnd().trimStart();
						} else {
							obj.frontComp = "";
						}
						obj.FStatus = "";

						if (comp < BCData.length) {
							obj.backComp = BCData[comp].trimEnd().trimStart();
						} else {
							obj.backComp = "";
						}
						obj.BStatus = "";

						allComp.push(obj);

						obj = {};
					}
				}
				//End Comp
			}

			obj = {};
			for (var y = 0; y < oOdataName.length; y++) {
				obj.fioriId = oFioriId[y];
				obj.Status = "";
				obj.AppName = oFioriName[y];
				obj.PrimaryODataServiceName = oOdataName[y];
				obj.PrimaryODataServiceVersion = oOdataVerison[y];

				oDataTableData.push(obj);
				obj = {};
			}

			obj = {};
			for (x = 0; x < addtnOdataService.length; x++) {
				obj.fioriId = addnId[x];
				obj.AppName = addnApp[x];
				obj.PrimaryODataServiceName = addtnOdataService[x];
				obj.PrimaryODataServiceVersion = addtnOdataVersion[x];
				obj.Status = "";

				oDataTableData.push(obj);
				obj = {};
			}

			obj = {};
			for (var y = 0; y < iIcfName.length; y++) {
				obj.fioriId = iFioriId[y];
				obj.Status = "";
				obj.AppName = iFioriName[y];
				obj.BSPApplicationURL = iIcfName[y];

				if (((technologyType[y]).search("Web Dynpro")) !== -1) {
					obj.Type = "Web Dynpro App";
				} else {
					obj.Type = "UI App";
				}

				icfTableData.push(obj);
				obj = {};
			}

			for (var x = 0; x < techCatalog.length; x++) {
				if ((techCatalog[x].includes("|")) === true) {
					if ((techCatalog[x].indexOf("|")) > (techCatalog[x].indexOf(":"))) {
						aliasCatalog.push(techCatalog[x].substring((techCatalog[x].search(":")) + 1, (techCatalog[x].indexOf("|"))));
					} else {
						aliasCatalog.push(techCatalog[x].substring((techCatalog[x].search(":")) + 1, techCatalog[x].length));
					}
				} else {
					aliasCatalog.push(techCatalog[x].substring((techCatalog[x].search(":")) + 1, techCatalog[x].length));
				}
			}

			for (var k = aliasCatalog.length; k > 0; k--) {
				for (var y = 0; y < k; y++) {
					if (aliasCatalog[k] === aliasCatalog[y]) {
						aliasCatalog.splice(y, 1);
						fioriId[k] = fioriId[k] + ", " + fioriId[y];
						fioriId.splice(y, 1);
					}
				}
			}

			for (var z = 0; z < aliasCatalog.length; z++) {
				obj = {};
				obj.fioriId = fioriId[z];
				obj.Alias = aliasCatalog[z];
				obj.Status = "";
				aliasTableData.push(obj);
				obj = {};
			}

			/*Start added to include SAP GUI's Alias which are ignored above*/
			var oTableDataSG = [];
			var techCatalogSG = [];
			var fioriIdSG = [];
			var aliasCatalogSG = [];
			oTableDataSG = data.filter(function(row) {
				return row.ApplicationType === "SAP GUI";
			});

			for (var i = 0; i < oTableDataSG.length; i++) {
				if ((oTableDataSG[i].TechnicalCatalogName).search(":") !== -1) {
					techCatalogSG.push(oTableDataSG[i].TechnicalCatalogName);
					fioriIdSG.push(oTableDataSG[i].fioriId);
				}
			}

			for (var x = 0; x < techCatalogSG.length; x++) {
				if ((techCatalogSG[x].includes("|")) === true) {
					if ((techCatalogSG[x].indexOf("|")) > (techCatalogSG[x].indexOf(":"))) {
						aliasCatalogSG.push(techCatalogSG[x].substring((techCatalogSG[x].search(":")) + 1, (techCatalogSG[x].indexOf("|"))));
					} else {
						aliasCatalogSG.push(techCatalogSG[x].substring((techCatalogSG[x].search(":")) + 1, techCatalogSG[x].length));
					}
				} else {
					aliasCatalogSG.push(techCatalogSG[x].substring((techCatalogSG[x].search(":")) + 1, techCatalogSG[x].length));
				}
			}

			for (var k = aliasCatalogSG.length; k > 0; k--) {
				for (var y = 0; y < k; y++) {
					if (aliasCatalogSG[k] === aliasCatalogSG[y]) {
						aliasCatalogSG.splice(y, 1);
						fioriIdSG[k] = fioriIdSG[k] + ", " + fioriIdSG[y];
						fioriIdSG.splice(y, 1);
					}
				}
			}

			for (var z = 0; z < aliasCatalogSG.length; z++) {
				obj = {};
				obj.fioriId = fioriIdSG[z];
				obj.Alias = aliasCatalogSG[z];
				obj.Status = "";
				aliasTableData.push(obj);
				obj = {};
			}

			oTableDataSG = [];
			techCatalogSG = [];
			fioriIdSG = [];
			aliasCatalogSG = [];
			/*End added to include SAP GUI's Alias which are ignored above*/

			that._processNotes(allNotes);
			that._processComps(allComp);

			oODataModel = new sap.ui.model.json.JSONModel();
			oIcfModel = new sap.ui.model.json.JSONModel();
			oAliasModel = new sap.ui.model.json.JSONModel();

			oODataModel.setData(oDataTableData);
			oIcfModel.setData(icfTableData);
			oAliasModel.setData(aliasTableData);
			oDataTable.setModel(oODataModel);
			IcfTable.setModel(oIcfModel);
			AliasTable.setModel(oAliasModel);
			oDataTable.bindRows("/");
			IcfTable.bindRows("/");
			AliasTable.unbindRows("/");
			AliasTable.bindRows("/");

			if (oDataTableData.length === 0) {
				that.getView().byId("btnValidateOData").setEnabled(false);
			}

			if (icfTableData.length === 0) {
				that.getView().byId("btnValidateSICF").setEnabled(false);
			}

			if (aliasTableData.length === 0) {
				that.getView().byId("btnValidateAlias").setEnabled(false);
			}

			oModelAliasAH = new sap.ui.model.json.JSONModel();
			that._oModel.read('/ETSysAliasSet', null, null, false, function(oResponse, oError) {
				oModelAliasAH.setData(oResponse.results);

			}, function() {});

			that._buildBarConfInit(b, "bar");
			that._buildBarConfInit(c, "donut");
			that.getView().byId("_idFileUploader").setEnabled(false);
			that.getView().byId("id-overStat").setVisible(true);
			that.getView().byId("id-overStatForm").setVisible(true);
			that.getView().byId("id-overStat1").setVisible(true);
			that.getView().byId("id-btnStep2").setVisible(true);

			if (GUIAppCount > 0) {
				var message = GUIAppCount + " SAP GUI applications does not require a configuration, hence ignored";
				MessageToast.show(message);
			}

			this.getView().byId("id-overStatForm").getContent()[1].setText(totalApps); //Total apps
			this.getView().byId("id-overStatForm").getContent()[3].setText(totalUI5Apps); //UI apps
			this.getView().byId("id-overStatForm").getContent()[5].setText(GUIAppCount); //GUI apps
			// this.getView().byId("id-overStatForm").getContent()[7].setText(totalAppsLOB); //Total LOB apps
			// this.getView().byId("id-overStatForm").getContent()[9].setText(totalFioriLibFail); //Total apps failed to fetch details from FIORI library
		},

		_createBatch: function() {
			that._busyDialog.open();
			var rId = that.getView().byId("id-relIDCombo").getSelectedKey();
			var surl = "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/services/SingleApp.xsodata";
			// var path = "/Details(fioriId='" + ids[0] + "',releaseId='" + rId + "')";
			var oModel = new sap.ui.model.odata.ODataModel(surl, true);
			var batchChanges = [];

			for (var i = 0; i < ids.length; i++) {
				if (ids[i][0]) {
					// var url =
					var enURL = encodeURI("/Details(fioriId='" + ids[i] + "',releaseId='" + rId + "')");
					batchChanges.push(oModel.createBatchOperation(enURL, "GET"));
				}
			}

			totalApps = batchChanges.length;
			oModel.addBatchReadOperations(batchChanges);

			oModel.submitBatch(function(oResponse) {
				that._buildAppIds(oResponse, "allApp");
				that._busyDialog.close();
			}, function(err) {
				MessageToast.show("Error occurred.");
				that._busyDialog.close();
			});
		},

		_buildAppIds: function(oResponse, from) {
			var oData = [];
			if (from === "allApp") {
				for (var i = 0; i < oResponse.__batchResponses.length; i++) {
					if (oResponse.__batchResponses[i].statusCode === "200") {
						var data = JSON.parse(oResponse.__batchResponses[i].body);
						oData.push(data.d);
					} else {
						if (oResponse.__batchResponses[i].message === "HTTP request failed") {
							totalFioriLibFail++;
						}
					}
				}

				that._processApps(oData);

			} else if (from === "allNotes") {
				for (var i = 0; i < oResponse.__batchResponses.length; i++) {
					if (oResponse.__batchResponses[i].statusCode === "200") {
						var data = JSON.parse(oResponse.__batchResponses[i].body);
						oData.push(data.d);
					} else {
						if (oResponse.__batchResponses[i].message === "HTTP request failed") {
							totalNotesFioriLibFail++;
						}
					}
				}

				that._processNotes(oData);
			}

		},

		/*Start added - get all the {required Components*/
		_getAllComponents: function(from) {
			that._oModel.read("/ETSapCompSet",
				null,
				null,
				false,
				function(oData, oResponse) {
					if (from === "init") {
						that._allComp = oData.results;

						if (oData.results.length) {
							var release = oData.results.find(function(data) {
								return data.COMPONENT === "S4CORE";
							});

							if (release) {
								switch (release.RELEASE) {
									case '101':
										that._S4Version = '1610';
										break;

									case '102':
										that._S4Version = '1709';
										break;

									case '103':
										that._S4Version = '1809';
										break;

									case '104':
										that._S4Version = '1909';
										break;

									default:
										that._S4Version = undefined;
								}
							}

							that._activate2ndStep();
						}
						// that._getCatalogId(oData.results);
					}
				},
				function(oError) {
					var a;
					a = oError;
				});
		},

		_processComps: function(oData) {
			var FComp = that._getUniqueFComp(oData);
			var BComp = that._getUniqueBComp(oData);
			var FCompData = [];
			var BCompData = [];
			var results = [];
			var obj = {};
			var fioriIdString = "";

			for (var f = 0; f < FComp.length; f++) {
				obj = {};
				results = [];
				results = oData.filter(function(data) {
					return data.frontComp === FComp[f].frontComp && data.frontComp !== "";
				});

				if (results.length) {
					obj.frontComp = FComp[f].frontComp;
					for (var r = 0; r < results.length; r++) {
						if (!fioriIdString) {
							fioriIdString = results[r].fioriId;
						} else {
							fioriIdString = fioriIdString + ", " + results[r].fioriId;
						}
					}
					obj.FfioriId = fioriIdString;
					obj.FStatus = "";
					FCompData.push(obj);
					obj = {};
					fioriIdString = "";
				}
			}

			results = [];
			fioriIdString = "";
			for (var b = 0; b < BComp.length; b++) {
				obj = {};
				results = [];
				results = oData.filter(function(data) {
					return data.backComp === BComp[b].backComp && data.backComp !== "";
				});

				if (results.length) {
					obj.backComp = BComp[b].backComp;
					for (var r = 0; r < results.length; r++) {
						if (!fioriIdString) {
							fioriIdString = results[r].fioriId;
						} else {
							fioriIdString = fioriIdString + ", " + results[r].fioriId;
						}
					}

					obj.BfioriId = fioriIdString;
					obj.BStatus = "";
					BCompData.push(obj);
					obj = {};
					fioriIdString = "";
				}
			}

			var length = 0;
			var comp = 0;
			if (FCompData.length > BCompData.length) {
				length = FCompData.length;
			} else {
				length = BCompData.length;
			}

			compTableData = [];
			compTableData1 = [];
			while (comp < length) {
				obj = {};
				if (comp < FCompData.length) {
					obj.frontComp = FCompData[comp].frontComp;
					obj.FfioriId = FCompData[comp].FfioriId;
				} else {
					obj.frontComp = "";
					obj.FfioriId = "";
				}
				obj.FStatus = "";

				compTableData.push(obj);
				obj = {};

				if (comp < BCompData.length) {
					obj.backComp = BCompData[comp].backComp;
					obj.BfioriId = BCompData[comp].BfioriId;
				} else {
					obj.backComp = "";
					obj.BfioriId = "";
				}
				obj.BStatus = "";

				compTableData1.push(obj);
				obj = {};

				comp++;
			}

			var CompTable = this.getView().byId("id-CompTable");
			oCompModel = new sap.ui.model.json.JSONModel();
			oCompModel.setData(compTableData);

			CompTable.unbindRows();
			CompTable.setModel(oCompModel);
			CompTable.bindRows("/");

			if (compTableData.length === 0) {
				that.getView().byId("btnValidateComp").setEnabled(false);
			}

			var CompTable1 = this.getView().byId("id-CompTable1");
			oCompModel1 = new sap.ui.model.json.JSONModel();
			oCompModel1.setData(compTableData1);

			CompTable1.unbindRows();
			CompTable1.setModel(oCompModel1);
			CompTable1.bindRows("/");

			if (compTableData1.length === 0) {
				that.getView().byId("btnValidateComp1").setEnabled(false);
			}
		},

		validateComp: function(oEvent) {
			var btnPress = oEvent.getParameters().id;

			that._busyValidate.open();
			// that._oModel.read("/ETSapCompSet",
			// 	null,
			// 	null,
			// 	true,
			// 	function(oData, oResponse) {
			// if (oData.results.length) {
			// that._allComp = oData.results;

			if (that._allComp.length) {
				var results = [];
				var compData = "";
				if (btnPress === "__xmlview0--btnValidateComp") {
					for (var i = 0; i < compTableData.length; i++) {
						if (compTableData[i].frontComp) {
							results = compTableData[i].frontComp.split(" "); // IF value in table then always have 2 values in results
							if (results.length) {
								compData = that._allComp.find(function(result) {
									return result.COMPONENT === results[0] && result.RELEASE === results[1];
								});

								if (compData) {
									compTableData[i].FStatus = "S";
								} else {
									compTableData[i].FStatus = "E";
								}
							}
						}

						results = [];
						compData = "";
					}

					var CompTable = that.getView().byId("id-CompTable");
					CompTable.unbindRows();
					oCompModel.setData(compTableData);
					oCompModel.refresh();
					CompTable.setModel(oCompModel);
					CompTable.bindRows("/");
					that.getView().byId("btnValidateComp").setEnabled(false);
					that._enableAnalyzer();
					MessageToast.show("Validation step is completed. Please check the status against each app.");
				}

				if (btnPress === "__xmlview0--btnValidateComp1") {
					for (var i = 0; i < compTableData1.length; i++) {
						if (compTableData1[i].backComp) {
							results = compTableData1[i].backComp.split(" ");
							if (results.length) {
								compData = that._allComp.find(function(result) {
									return result.COMPONENT === results[0] && result.RELEASE === results[1];
								});

								if (compData) {
									compTableData1[i].BStatus = "S";
								} else {
									compTableData1[i].BStatus = "E";
								}
							}
						}

						results = [];
						compData = "";
					}

					var CompTable1 = that.getView().byId("id-CompTable1");
					CompTable1.unbindRows();
					oCompModel1.setData(compTableData1);
					oCompModel1.refresh();
					CompTable1.setModel(oCompModel1);
					CompTable1.bindRows("/");
					that.getView().byId("btnValidateComp1").setEnabled(false);
					that._enableAnalyzer();
					MessageToast.show("Validation step is completed. Please check the status against each app.");
				}

			}

			that._busyValidate.close();
			// },
			// function(oError) {
			// 	that._busyValidate.close();
			// });
		},

		_getUniqueFComp: function(oData) {
			function hash(o) {
				return o.frontComp;
			}

			var uniqueNotesDum = oData;

			uniqueNotesDum.sort(function(a, b) {
				return (a.frontComp < b.frontComp) ? -1 : (a.frontComp > b.frontComp) ? 1 : 0;
			});

			var hashesFound = {};

			uniqueNotesDum.forEach(function(o) {
				hashesFound[hash(o)] = o;
			});

			var uniqueNotes = Object.keys(hashesFound).map(function(k) {
				return hashesFound[k];
			});

			return uniqueNotes;
		},

		_getUniqueBComp: function(oData) {
			function hash(o) {
				return o.backComp;
			}

			var uniqueNotesDum = oData;

			uniqueNotesDum.sort(function(a, b) {
				return (a.backComp < b.backComp) ? -1 : (a.backComp > b.backComp) ? 1 : 0;
			});

			var hashesFound = {};

			uniqueNotesDum.forEach(function(o) {
				hashesFound[hash(o)] = o;
			});

			var uniqueNotes = Object.keys(hashesFound).map(function(k) {
				return hashesFound[k];
			});

			return uniqueNotes;
		},

		/*End added - get all the required Components*/

		/*Start added - get all the required notes*/
		_processNotes: function(oData) {
			var NoteTable = this.getView().byId("id-NoteTable");
			var AllNotes = [];
			var results = [];
			var obj = {};

			if (oData.length) {
				oData.forEach(function(data) {
					obj = {};
					if (!AllNotes.length) {
						obj.NoteNo = data.NoteNo;
						obj.fioriId = data.fioriId;
						obj.Status = "";
						obj.StatusText = "";

						AllNotes.push(obj);
					} else {
						results = AllNotes.find(function(result) {
							return result.fioriId === data.fioriId && result.NoteNo === data.NoteNo;
						});

						if (!results) {
							obj.NoteNo = data.NoteNo;
							obj.fioriId = data.fioriId;
							obj.Status = "";
							obj.StatusText = "";

							AllNotes.push(obj);
						}
					}

					obj = {};
				});

				var uniqueNotes = that._getUniqueNotes(AllNotes);

				for (var i = 0; i < uniqueNotes.length; i++) {
					results = [];

					obj = {};
					obj.NoteNo = uniqueNotes[i].NoteNo;
					obj.fioriId = "";
					obj.Status = "";
					obj.StatusText = "";

					results = AllNotes.filter(function(data) {
						return data.NoteNo === uniqueNotes[i].NoteNo;
					});

					if (results.length) {
						for (var j = 0; j < results.length; j++) {
							if (obj.fioriId) {
								obj.fioriId = obj.fioriId + "," + results[j].fioriId;
							} else {
								obj.fioriId = results[j].fioriId;
							}
						}

						if (obj.fioriId) {
							noteTableData.push(obj);
						}
					}

					obj = {};
				}
			}

			oNoteModel = new sap.ui.model.json.JSONModel();
			oNoteModel.setData(noteTableData);

			NoteTable.unbindRows();
			NoteTable.setModel(oNoteModel);
			NoteTable.bindRows("/");

			if (noteTableData.length === 0) {
				that.getView().byId("btnValidateNote").setEnabled(false);
			}
		},

		_getUniqueNotes: function(oData) {
			function hash(o) {
				return o.NoteNo;
			}

			var uniqueNotesDum = oData;

			uniqueNotesDum.sort(function(a, b) {
				return (a.NoteNo < b.NoteNo) ? -1 : (a.NoteNo > b.NoteNo) ? 1 : 0;
			});

			var hashesFound = {};

			uniqueNotesDum.forEach(function(o) {
				hashesFound[hash(o)] = o;
			});

			var uniqueNotes = Object.keys(hashesFound).map(function(k) {
				return hashesFound[k];
			});

			return uniqueNotes;
		},

		// _createNoteBatch: function() {
		//   that._busyDialog.open();
		//   var rId = that.getView().byId("id-relIDCombo").getSelectedKey();
		//   var surl = "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/services/SingleApp.xsodata";
		//   // var path = "/Details(fioriId='" + ids[0] + "',releaseId='" + rId + "')";
		//   var oModel = new sap.ui.model.odata.ODataModel(surl, true);
		//   var batchChanges = [];

		//   for (var i = 0; i < ids.length; i++) {
		//     if (ids[i][0]) {
		//       // var url =
		//       var enURL = encodeURI("/Details(fioriId='" + ids[i] + "',releaseId='" + rId + "')/Notes");
		//       batchChanges.push(oModel.createBatchOperation(enURL, "GET"));
		//     }
		//   }

		//   totalApps = batchChanges.length;
		//   oModel.addBatchReadOperations(batchChanges);

		//   oModel.submitBatch(function(oResponse) {
		//     that._buildAppIds(oResponse, "allNotes");
		//     that._busyDialog.close();
		//   }, function(err) {
		//     MessageToast.show("Error occurred.");
		//     that._busyDialog.close();
		//   });
		// },

		// _processNotes1: function(oData) {
		//   var AllNotes = [];
		//   var results = [];
		//   var obj = {};

		//   for (var i = 0; i < oData.length; i++) {
		//     for (var j = 0; j < oData[i].results.length; j++) {
		//       obj = {};
		//       obj.fioriId = oData[i].results[j].fioriId;
		//       obj.NoteNumber = oData[i].results[j].NoteNumber;
		//       AllNotes.push(obj);
		//       obj = {};
		//     }
		//   }

		//   if (AllNotes.length) {
		//     var uniqueNotes = that._getUniqueNotes(AllNotes);

		//     for (var i = 0; i < uniqueNotes.length; i++) {
		//       obj = {};
		//       obj.NoteNo = uniqueNotes[i].NoteNumber;
		//       obj.fioriId = "";
		//       obj.Status = "";
		//       obj.StatusText = "";

		//       results = AllNotes.filter(function(data) {
		//         return data.NoteNumber === uniqueNotes[i].NoteNumber;
		//       });

		//       if (results.length) {
		//         for (var j = 0; j < results.length; j++) {
		//           if (obj.fioriId) {
		//             obj.fioriId = obj.fioriId + "," + results[j].fioriId;
		//           } else {
		//             obj.fioriId = results[j].fioriId;
		//           }
		//         }

		//         if (obj.fioriId) {
		//           noteTableData.push(obj);
		//         }
		//       }

		//       obj = {};
		//     }

		//     var NoteTable = this.getView().byId("id-NoteTable");
		//     oNoteModel = new sap.ui.model.json.JSONModel();
		//     oNoteModel.setData(noteTableData);

		//     NoteTable.unbindRows();
		//     NoteTable.setModel(oNoteModel);
		//     NoteTable.bindRows("/");

		//     if (noteTableData.length === 0) {
		//       that.getView().byId("btnValidateNote").setEnabled(false);
		//     }
		//   }
		// },
		/*End added - get all the required notes*/

		_getReleaseids: function() {
			var releaseUrl =
				"https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/services/SingleApp.xsodata/Releases?$format=json&$select=releaseId,releaseName,releaseType&$orderby=releaseRank desc";

			$.ajax({
				type: "GET",
				url: releaseUrl,
				dataType: "json",
				async: "false",
				success: function(data) {
					var odata = data.d.results;
					var releaseModel = new sap.ui.model.json.JSONModel();
					releaseModel.setData(odata);
					that.getView().byId("id-relIDCombo").setModel(releaseModel);
					that.getView().byId("id-relIDCombo").setEnabled(true);
				},
				error: function(XMLHttpRequest, textStatus) {
					that.getView().byId("id-relIDCombo").setEnabled(false);
					sap.m.MessageBox.show(
						"Something went wrong. Please contact system administrator", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Dear User",
							styleClass: "sapUiSizeCompact"
						}
					);
				}
			});
		},

		selectRelease: function() {
			that._createBatch();
			// that._createNoteBatch();
			that.getView().byId("id-relIDCombo").setEnabled(false);
		},

		handleChange: function(oEvent) {
			if (oEvent.getParameter("newValue").split('.').pop() !== "csv") {
				MessageToast.show("File type must be .csv");
				return;
			}

			var columns;
			var oFiletoRead = oEvent.getParameters().files["0"];
			var reader = new FileReader();

			var oDataTable = this.getView().byId("id-OdataTable");
			var IcfTable = this.getView().byId("id-IcfNodesTable");
			var AliasTable = this.getView().byId("id-AliasTable");

			oDataTable.unbindRows();
			IcfTable.unbindRows();
			AliasTable.unbindRows();

			function processData(csv, colss) {
				var rbIndex = that.getView().byId("rbg1").getProperty("selectedIndex");
				var counter = 0;
				var allTextLines = Papa.parse(csv).data;
				columns = allTextLines[0];
				var cll = [];
				var oTableData = [];

				if (rbIndex === 0) {
					for (var i = 0; i < columns.length; i++) {
						var isFound = that._searchColumn(columns[i]);
						if (isFound === true) {
							counter = counter + 1;
							cll.push(columns[i]);
						}
					}
					if (counter === keyConfigCols.length) {
						for (var i = 1; i < allTextLines.length - 1; i++) {
							var data = allTextLines[i];
							var obj = {};

							for (var j = 0; j < data.length; j++) {
								obj[columns[j]] = data[j];
							}

							oTableData.push(obj);
							obj = {};
						}

						totalApps = oTableData.length;
						that._processApps(oTableData);

					} else {
						MessageBox.show("One or more  key configuration columns are missing", "ERROR",
							"Error");
						that._busyDialog.close();
						return;
					}
				} else if (rbIndex === 1) {
					that.getView().byId("_idFileUploader").setEnabled(false);
					that._getReleaseids();

					for (var i = 1; i < allTextLines.length; i++) {
						data = allTextLines[i];
						ids.push(data);
					}

					for (var y = 0; y < ids.length; y++) {
						if (y === ids.length - 1) {
							fioriIds = fioriIds + "\'" + "\'" + ids[y] + "\'" + "\'" + "'";
						} else {
							fioriIds = fioriIds + "\'" + "\'" + ids[y] + "\'" + "\'" + ",";
						}
					}
				}
			}

			function loadHandler(event) {
				var csv = event.target.result;
				that._busyDialog.open();
				processData(csv, null);
				that.getView().byId("rbg1").setEnabled(false);
				that._busyDialog.close();
			}

			reader.readAsText(oFiletoRead);
			reader.onload = loadHandler;
		},

		_buildBarConfInit: function(oBar, chart) {
			var oBarDum = oBar;
			var busArea;
			var obj = {};
			var data = [];

			oBarDum.sort();
			for (var i = 0; i < oBarDum.length;) {
				busArea = oBarDum[i].trimStart();
				busArea = busArea.trimEnd();
				// busArea = oBarDum[i];

				var result = oBarDum.filter(function(data) {
					var value1 = data.trimStart();
					value1 = value1.trimEnd();

					return busArea === value1;
				});

				if (result.length) {
					if (busArea) {
						obj.Measure = busArea;
					} else {
						obj.Measure = "Others";
					}
					obj.Type = "No. of applications";
					obj.Count = result.length;

					data.push(obj);
					obj = {};

					if (chart === "bar") {
						totalAppsLOB = totalAppsLOB + result.length;
					}
				}

				for (var j = 0; j < oBarDum.length;) {
					var value = oBarDum[j].trimStart();
					value = value.trimEnd();

					if (busArea === value) {
						oBarDum.splice(j, 1);
					} else {
						j++;
					}
				}
			}

			that._buildBarInit(data, chart);
		},

		_buildBarInit: function(array, chart) {
			var oVizFrame;
			var oPopOver;

			if (chart === "bar") {
				oVizFrame = this.getView().byId("idVizFrameInit");
				oPopOver = this.getView().byId("idPopOverInit");
			} else {
				oVizFrame = this.getView().byId("idVizFrameInitDonut");
				oPopOver = this.getView().byId("idPopOverInitDonut");
			}

			oVizFrame.setVizProperties({
				legend: {
					title: {
						visible: false
					}
				},
				title: {
					visible: false
				}
			});

			var pieModel = new sap.ui.model.json.JSONModel();
			pieModel.setData(array);
			oVizFrame.setModel(pieModel);
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					}
				}
			});

			oPopOver.connect(oVizFrame.getVizUid());
		},

		handleValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			that.inputId = oEvent.getSource().getId();

			// create value help dialog
			if (!that._valueHelpDialog) {
				that._valueHelpDialog = sap.ui.xmlfragment(
					"com.apac.toolZ_FIORI_AUTO_CONFIG.fragment.aliasHelp", that
				);
				this.getView().addDependent(that._valueHelpDialog);
				that._valueHelpDialog.setModel(oModelAliasAH);
			}

			// create a filter for the binding
			that._valueHelpDialog.getBinding("items").filter([new sap.ui.model.Filter("SYSALIAS", sap.ui.model.FilterOperator.Contains,
				sInputValue)]);

			// open value help dialog filtered by the input value
			that._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter("SYSALIAS", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				that.getView().byId(that.inputId).setValue(oSelectedItem.getProperty("title"));
			}
			evt.getSource().getBinding("items").filter([]);
		},

		enableReportAnlyzer: function() {
			var data_bar = [];
			var data_donut = [];
			var obj;
			var tableMeta = [{
				"ID": "id-OdataTable1",
				"type": "oData",
				"status": "E"
			}, {
				"ID": "id-OdataTable1",
				"type": "oData",
				"status": "S"
			}, {
				"ID": "id-IcfNodesTable1",
				"type": "SICF",
				"status": "E"
			}, {
				"ID": "id-IcfNodesTable1",
				"type": "SICF",
				"status": "S"
			}];

			var tableMetaOld = [{
				"ID": "id-OdataTable",
				"type": "oData",
				"status": "S"
			}, {
				"ID": "id-IcfNodesTable",
				"type": "SICF",
				"status": "S"
			}];

			for (var i = 0; i < tableMeta.length; i++) {
				obj = that._buildBarConf(tableMeta[i].ID, tableMeta[i].type, tableMeta[i].status);
				if (obj) {
					data_bar.push(obj);
				}
			}

			for (var i = 0; i < tableMetaOld.length; i++) {
				obj = that._buildBarConf(tableMetaOld[i].ID, tableMetaOld[i].type, tableMetaOld[i].status);
				if (obj) {
					switch (i) {
						case 0:
							data_bar[1].Count = data_bar[1].Count + obj.Count;
							break;

						case 1:
							data_bar[3].Count = data_bar[3].Count + obj.Count;
							break;
					}
				}
			}

			that._buildBar(data_bar, "activate");

			for (var i = 0; i < tableMeta.length; i++) {
				obj = that._buildDonutConf(tableMeta[i].ID, tableMeta[i].type, tableMeta[i].status);
				if (obj) {
					data_donut.push(obj);
				}
			}

			for (var i = 0; i < tableMetaOld.length; i++) {
				obj = that._buildDonutConf(tableMetaOld[i].ID, tableMetaOld[i].type, tableMetaOld[i].status);
				if (obj) {
					switch (i) {
						case 0:
							data_donut[1].Count = data_donut[1].Count + obj.Count;
							break;

						case 1:
							data_donut[3].Count = data_donut[3].Count + obj.Count;
							break;
					}
				}
			}

			that._buildDonut(data_donut, "activate");

			that.getView().byId("_idSteps1").nextStep();
			that._comparData();
			that.getView().byId("id-btnStep5").setVisible(false);
			that._openGuideMessageDialog();
			// sap.m.MessageBox.show(
			//   "Please ensure to download the activated oData and ICF node services for configuration in further servers", {
			//     icon: sap.m.MessageBox.Icon.INFORMATION,
			//     title: "Information",
			//     styleClass: "sapUiSizeCompact"
			//   }
			// );
		},

		_openGuideMessageDialog: function() {
			if (!that._guideMessageDialog) {
				that._guideMessageDialog = sap.ui.xmlfragment(
					"com.apac.toolZ_FIORI_AUTO_CONFIG.fragment.guideSTC", that
				);
				that.getView().addDependent(that._guideMessageDialog);
			}

			that._guideMessageDialog.open();
		},

		closeGuideMessageDialog: function() {
			that._guideMessageDialog.close();
		},

		handleLinkPress: function() {
			var data_bar = [];
			var data_donut = [];
			var obj;
			var tableMeta = [{
					"ID": "id-OdataTable",
					"type": "oData",
					"status": "E"
				}, {
					"ID": "id-OdataTable",
					"type": "oData",
					"status": "S"
				}, {
					"ID": "id-IcfNodesTable",
					"type": "SICF",
					"status": "E"
				}, {
					"ID": "id-IcfNodesTable",
					"type": "SICF",
					"status": "S"
				}, {
					"ID": "id-AliasTable",
					"type": "Alias",
					"status": "E"
				}, {
					"ID": "id-AliasTable",
					"type": "Alias",
					"status": "S"
				}, {
					"ID": "id-NoteTable",
					"type": "Note",
					"status": "E"
				}, {
					"ID": "id-NoteTable",
					"type": "Note",
					"status": "S"
				}
				// , {
				//   "ID": "id-CompTable",
				//   "type": "Comp",
				//   "status": "E"
				// }, {
				//   "ID": "id-CompTable",
				//   "type": "Comp",
				//   "status": "S"
				// }
				// , {
				//   "ID": "id-CompTable",
				//   "type": "Comp1",
				//   "status": "E"
				// }, {
				//   "ID": "id-CompTable",
				//   "type": "Comp1",
				//   "status": "S"
				// }
			];

			for (var i = 0; i < tableMeta.length; i++) {
				obj = that._buildBarConf(tableMeta[i].ID, tableMeta[i].type, tableMeta[i].status);
				if (obj) {
					data_bar.push(obj);
				}
			}

			for (var i = 0; i < tableMeta.length; i++) {
				obj = that._buildDonutConf(tableMeta[i].ID, tableMeta[i].type, tableMeta[i].status);
				if (obj) {
					data_donut.push(obj);
				}
			}

			/*Start add data for s/w and h/w backend compoenents*/
			var oFTableS = [];
			var oFTableE = [];
			var oBTableS = [];
			var oBTableE = [];

			oFTableS = compTableData.filter(function(data) {
				return data.FStatus === "S";
			});
			oFTableE = compTableData.filter(function(data) {
				return data.FStatus === "E";
			});
			oBTableS = compTableData1.filter(function(data) {
				return data.BStatus === "S";
			});
			oBTableE = compTableData1.filter(function(data) {
				return data.BStatus === "E";
			});

			var inComp = oFTableS.length + oBTableS.length;
			var unComp = oFTableE.length + oBTableE.length;

			obj = {};
			obj.Type = "Comp";
			obj.Status = "E";
			obj.Count = unComp;
			data_bar.push(obj);
			data_donut.push(obj);

			obj = {};
			obj.Type = "Comp";
			obj.Status = "S";
			obj.Count = inComp;
			data_bar.push(obj);
			data_donut.push(obj);

			obj = {};
			/*End add data for s/w and h/w backend compoenents*/

			that._buildBar(data_bar, "validate");
			that._buildDonut(data_donut, "validate");

			that.getView().byId("_idSteps1").nextStep();
			that.getView().byId("id-btnStep3").setVisible(false);

			that._openConfMessageDialog();
		},

		_openConfMessageDialog: function() {
			if (!that._confMessageDialog) {
				that._confMessageDialog = sap.ui.xmlfragment(
					"com.apac.toolZ_FIORI_AUTO_CONFIG.fragment.manualConfMessage", that
				);
				that.getView().addDependent(that._confMessageDialog);
			}

			that._confMessageDialog.open();
		},

		closeConfMessageDialog: function() {
			that._confMessageDialog.close();
		},

		_comparData: function() {
			var data_bar = [];
			var data_donut = [];
			var obj;
			var tableMeta = [{
				"ID": "id-OdataTable",
				"type": "oDataOld",
				"status": "E"
			}, {
				"ID": "id-OdataTable",
				"type": "oDataOld",
				"status": "S"
			}, {
				"ID": "id-OdataTable1",
				"type": "oDataNew",
				"status": "E"
			}, {
				"ID": "id-OdataTable1",
				"type": "oDataNew",
				"status": "S"
			}, {
				"ID": "id-IcfNodesTable",
				"type": "SICFOld",
				"status": "E"
			}, {
				"ID": "id-IcfNodesTable",
				"type": "SICFOld",
				"status": "S"
			}, {
				"ID": "id-IcfNodesTable1",
				"type": "SICFNew",
				"status": "E"
			}, {
				"ID": "id-IcfNodesTable1",
				"type": "SICFNew",
				"status": "S"
			}];

			for (var i = 0; i < tableMeta.length; i++) {
				obj = that._buildBarConf(tableMeta[i].ID, tableMeta[i].type, tableMeta[i].status);
				if (obj) {
					data_bar.push(obj);
				}
			}

			data_bar[3].Count = data_bar[3].Count + data_bar[1].Count;
			data_bar[7].Count = data_bar[7].Count + data_bar[5].Count;

			that._buildBar(data_bar, "compare");
			that.getView().byId("_idSteps1").nextStep();
		},

		_buildBarConf: function(tableID, type, status) {
			var obj = {};
			var oTable = that.getView().byId(tableID).getModel().getData();

			if (oTable.length > 0) {
				if (tableID === "id-CompTable") {
					if (type === "Comp") {
						var oTableDum = oTable.filter(function(data) {
							if (status === "E") {
								return data.FStatus === "E" || data.FStatus === "W";
							} else {
								return data.FStatus === status;
							}
						});
					} else {
						var oTableDum = oTable.filter(function(data) {
							if (status === "E") {
								return data.BStatus === "E" || data.BStatus === "W";
							} else {
								return data.BStatus === status;
							}
						});
					}
					obj.Type = type;
					obj.Status = status;
					obj.Count = oTableDum.length;
				} else {
					var oTableDum = oTable.filter(function(data) {
						if (status === "E") {
							return data.Status === "E" || data.Status === "W";
						} else {
							return data.Status === status;
						}
					});

					obj.Type = type;
					obj.Status = status;
					obj.Count = oTableDum.length;
				}
			} else {}

			return obj;
		},

		_buildBar: function(array, valAct) {
			var oVizFrame;
			if (valAct === "validate") {
				oVizFrame = this.getView().byId("idVizFrame");
			} else if (valAct === "activate") {
				oVizFrame = this.getView().byId("idVizFrameReport");
			} else if (valAct === "compare") {
				oVizFrame = this.getView().byId("idVizFrameCompare");
			}

			oVizFrame.setVizProperties({
				legend: {
					title: {
						visible: false
					}
				},
				title: {
					visible: false
				}
			});

			var data = [];
			for (var i = 0; i < array.length; i++) {
				var obj = {};
				if (valAct === "compare") {
					if ((array[i].Type === "oDataOld" || array[i].Type === "oDataNew") && array[i].Status === "E") {
						if (array[i].Type === "oDataOld") {
							obj.Measure = "oData Services Before";
						}

						if (array[i].Type === "oDataNew") {
							obj.Measure = "oData Services After";
						}

						obj.Type = "Misconfigured OData services";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if ((array[i].Type === "oDataOld" || array[i].Type === "oDataNew") && array[i].Status === "S") {
						if (array[i].Type === "oDataOld") {
							obj.Measure = "oData Services Before";
						}

						if (array[i].Type === "oDataNew") {
							obj.Measure = "oData Services After";
						}

						obj.Type = "Configured OData services";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if ((array[i].Type === "SICFOld" || array[i].Type === "SICFNew") && array[i].Status === "E") {
						if (array[i].Type === "SICFOld") {
							obj.Measure = "SICF Services Before";
						}
						if (array[i].Type === "SICFNew") {
							obj.Measure = "SICF Services After";
						}

						obj.Type = "Inactive ICF services";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if ((array[i].Type === "SICFOld" || array[i].Type === "SICFNew") && array[i].Status === "S") {
						if (array[i].Type === "SICFOld") {
							obj.Measure = "SICF Services Before";
						}
						if (array[i].Type === "SICFNew") {
							obj.Measure = "SICF Services After";
						}

						obj.Type = "Active ICF services";
						obj.Count = array[i].Count;
						data.push(obj);
					}
				} else {
					if (array[i].Type === "oData" && array[i].Status === "E") {
						obj.Measure = "oData Services";
						obj.Type = "Misconfigured OData services";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "oData" && array[i].Status === "S") {
						obj.Measure = "oData Services";
						obj.Type = "Configured OData services";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "SICF" && array[i].Status === "E") {
						obj.Measure = "SICF Services";
						obj.Type = "Inactive ICF services";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "SICF" && array[i].Status === "S") {
						obj.Measure = "SICF Services";
						obj.Type = "Active ICF services";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "Alias" && array[i].Status === "E") {
						obj.Measure = "System Alias";
						obj.Type = "Missing System Alias";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "Alias" && array[i].Status === "S") {
						obj.Measure = "System Alias";
						obj.Type = "Configured System Alias";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "Note" && array[i].Status === "E") {
						obj.Measure = "Notes";
						obj.Type = "Missing Notes";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "Note" && array[i].Status === "S") {
						obj.Measure = "Notes";
						obj.Type = "Implemented Notes";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "Comp" && array[i].Status === "E") {
						obj.Measure = "Components";
						obj.Type = "Missing Components";
						obj.Count = array[i].Count;
						data.push(obj);
					} else if (array[i].Type === "Comp" && array[i].Status === "S") {
						obj.Measure = "Components";
						obj.Type = "Installed Components";
						obj.Count = array[i].Count;
						data.push(obj);
					}
					// else if (array[i].Type === "Comp1" && array[i].Status === "E") {
					//   obj.Measure = "Components";
					//   obj.Type = "Missing Backend s/w Components";
					//   obj.Count = array[i].Count;
					//   data.push(obj);
					// } else if (array[i].Type === "Comp1" && array[i].Status === "S") {
					//   obj.Measure = "Components";
					//   obj.Type = "Installed Backend s/w Components";
					//   obj.Count = array[i].Count;
					//   data.push(obj);
					// }
				}
			}

			var color = [];
			if (valAct === "compare") {
				color[0] = "#ff944d";
				color[1] = "#66d9ff";
				color[2] = "#ff8566";
				color[3] = "#53c653";
				color[4] = "#ad5590";
				color[5] = "#89cdd9";
				// color[6] = '#f79ead';
				// color[7] = '#b3eef5';
				// color[8] = '#cc2939';
				// color[9] = '#1f824a';
			}

			for (var i = 0; i < data.length; i++) {
				if (valAct === "compare") {

				} else {
					if (data[i].Measure === "oData Services" && data[i].Type === "Misconfigured OData services") {
						color[i] = "#ff944d";
					}
					if (data[i].Measure === "oData Services" && data[i].Type === "Configured OData services") {
						color[i] = "#66d9ff";
					}
					if (data[i].Measure === "SICF Services" && data[i].Type === "Inactive ICF services") {
						color[i] = "#ff8566";
					}
					if (data[i].Measure === "SICF Services" && data[i].Type === "Active ICF services") {
						color[i] = "#53c653";
					}
					if (data[i].Measure === "System Alias" && data[i].Type === "Missing System Alias") {
						color[i] = "#ff80df";
					}
					if (data[i].Measure === "System Alias" && data[i].Type === "Configured System Alias") {
						color[i] = "#0077b3";
					}
					if (data[i].Measure === "Notes" && data[i].Type === "Missing Notes") {
						color[i] = "#ad5590";
					}
					if (data[i].Measure === "Notes" && data[i].Type === "Implemented Notes") {
						color[i] = "#89cdd9";
					}
					if (data[i].Measure === "Components" && data[i].Type === "Missing Components") {
						color[i] = "#f79ead";
					}
					if (data[i].Measure === "Components" && data[i].Type === "Installed Components") {
						color[i] = "#b3eef5";
					}
					// if (data[i].Measure === "Components" && data[i].Type === "Missing Backend s/w Components") {
					//   color[i] = "#cc2939";
					// }
					// if (data[i].Measure === "Components" && data[i].Type === "Installed Backend s/w Components") {
					//   color[i] = "#1f824a";
					// }
				}
			}

			var pieModel = new sap.ui.model.json.JSONModel();
			pieModel.setData(data);
			oVizFrame.setModel(pieModel);
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					},
					colorPalette: color
				}
			});

			var oPopOver;
			if (valAct === "validate") {
				oPopOver = this.getView().byId("idPopOver");
			} else if (valAct === "activate") {
				oPopOver = this.getView().byId("idPopOverReport");
			} else if (valAct === "compare") {
				oPopOver = this.getView().byId("idPopOverCompare");
			}

			oPopOver.connect(oVizFrame.getVizUid());

		},

		_buildDonutConf: function(tableID, type, status) {
			var oTableDum1;
			var oDataBar = [];
			var obj = {};
			var oTable = that.getView().byId(tableID).getModel().getData();

			if (oTable.length > 0) {
				if (tableID === "id-CompTable") {
					if (type === "Comp") {
						var oTableDum = oTable.filter(function(data) {
							if (status === "E") {
								return data.FStatus === "E" || data.FStatus === "W";
							} else {
								return data.FStatus === status;
							}
						});
					} else {
						var oTableDum = oTable.filter(function(data) {
							if (status === "E") {
								return data.BStatus === "E" || data.BStatus === "W";
							} else {
								return data.BStatus === status;
							}
						});
					}
					obj.Type = type;
					obj.Status = status;
					obj.Count = oTableDum.length;
				} else {

					var oTableDum = oTable.filter(function(data) {
						if (status === "E") {
							return data.Status === "E" || data.Status === "W";
						} else {
							return data.Status === status;
						}
					});

					obj = {};
					obj.Type = type;
					obj.Status = status;
					obj.Count = oTableDum.length;
				}
			} else {}
			return obj;
		},

		_buildDonut: function(array, valAct) {
			var oVizFrameDonut;
			if (valAct === "validate") {
				oVizFrameDonut = this.getView().byId("idVizFrameDonut");
			} else if (valAct === "activate") {
				oVizFrameDonut = this.getView().byId("idVizFrameDonutReport");
			}

			oVizFrameDonut.setVizProperties({
				legend: {
					title: {
						visible: false
					}
				},
				title: {
					visible: false
				}
			});

			var data = [];
			for (var i = 0; i < array.length; i++) {
				var obj = {};
				if (array[i].Type === "oData" && array[i].Status === "E") {
					obj.Type = "Misconfigured OData services";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "oData" && array[i].Status === "S") {
					obj.Type = "Configured OData services";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "SICF" && array[i].Status === "E") {
					obj.Type = "Inactive ICF services";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "SICF" && array[i].Status === "S") {
					obj.Type = "Active ICF services";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "Alias" && array[i].Status === "E") {
					obj.Type = "Missing System Alias";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "Alias" && array[i].Status === "S") {
					obj.Type = "Configured System Alias";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "Note" && array[i].Status === "E") {
					obj.Type = "Missing Notes";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "Note" && array[i].Status === "S") {
					obj.Type = "Implemented Notes";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "Comp" && array[i].Status === "E") {
					obj.Measure = "Components";
					obj.Type = "Missing Components";
					obj.Count = array[i].Count;
					data.push(obj);
				} else if (array[i].Type === "Comp" && array[i].Status === "S") {
					obj.Measure = "Components";
					obj.Type = "Installed Components";
					obj.Count = array[i].Count;
					data.push(obj);
				}
				// else if (array[i].Type === "Comp1" && array[i].Status === "E") {
				//   obj.Measure = "Components";
				//   obj.Type = "Missing Backend s/w Components";
				//   obj.Count = array[i].Count;
				//   data.push(obj);
				// } else if (array[i].Type === "Comp1" && array[i].Status === "S") {
				//   obj.Measure = "Components";
				//   obj.Type = "Installed Backend s/w Components";
				//   obj.Count = array[i].Count;
				//   data.push(obj);
				// }
			}

			var color = [];
			for (var i = 0; i < data.length; i++) {
				if (data[i].Type === "Misconfigured OData services") {
					color[i] = "#ff944d";
				}
				if (data[i].Type === "Configured OData services") {
					color[i] = "#66d9ff";
				}
				if (data[i].Type === "Inactive ICF services") {
					color[i] = "#ff8566";
				}
				if (data[i].Type === "Active ICF services") {
					color[i] = "#53c653";
				}
				if (data[i].Type === "Missing System Alias") {
					color[i] = "#ff80df";
				}
				if (data[i].Type === "Configured System Alias") {
					color[i] = "#0077b3";
				}
				if (data[i].Type === "Missing Notes") {
					color[i] = "#ad5590";
				}
				if (data[i].Type === "Implemented Notes") {
					color[i] = "#89cdd9";
				}
				if (data[i].Measure === "Components" && data[i].Type === "Missing Components") {
					color[i] = "#f79ead";
				}
				if (data[i].Measure === "Components" && data[i].Type === "Installed Components") {
					color[i] = "#b3eef5";
				}
				// if (data[i].Measure === "Components" && data[i].Type === "Missing Backend s/w Components") {
				//   color[i] = "#cc2939";
				// }
				// if (data[i].Measure === "Components" && data[i].Type === "Installed Backend s/w Components") {
				//   color[i] = "#1f824a";
				// }
			}

			var pieModel = new sap.ui.model.json.JSONModel();
			pieModel.setData(data);
			oVizFrameDonut.setModel(pieModel);
			oVizFrameDonut.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					},
					colorPalette: color
				}
			});

			var oPopOverDonut;
			if (valAct === "validate") {
				oPopOverDonut = this.getView().byId("idPopOverDonut");
			} else if (valAct === "activate") {
				oPopOverDonut = this.getView().byId("idPopOverDonutReport");
			}
			oPopOverDonut.connect(oVizFrameDonut.getVizUid());
		},

		onRGB1: function(oEvent) {
			if (oEvent.getParameter("selectedIndex") === 0) {
				that.getView().byId("step2").setTitle("Application Configuration Information - Metadata Summary");
				that.getView().byId("id-relIDCombo").setVisible(false);
			} else if (oEvent.getParameter("selectedIndex") === 1) {
				that.getView().byId("step2").setTitle("Application Auto Configuration");
				that.getView().byId("id-relIDCombo").setVisible(true);
			}

		},

		onRGB2: function(oEvent) {
			if (oEvent.getParameter("selectedIndex") === 0) {
				that.getView().byId("btnActivateOData").setEnabled(false);
			} else if (oEvent.getParameter("selectedIndex") === 1) {
				that.getView().byId("btnActivateOData").setEnabled(true);
			}
		},

		onRGB3: function(oEvent) {
			if (oEvent.getParameter("selectedIndex") === 0) {
				that.getView().byId("btnActivateSICF").setEnabled(false);
			} else if (oEvent.getParameter("selectedIndex") === 1) {
				that.getView().byId("btnActivateSICF").setEnabled(true);
			}
		},

		onRGB4: function(oEvent) {
			if (oEvent.getParameter("selectedIndex") === 0) {
				that.getView().byId("btnActivateAlias").setEnabled(false);
			} else if (oEvent.getParameter("selectedIndex") === 1) {
				that.getView().byId("btnActivateAlias").setEnabled(true);
			}
		},

		_getTRBatch: function(from) {
			if (from === "LSActivate") {
				that._LSTRFragment = "X";
			} else {
				that._LSTRFragment = "";
			}

			that._busyDialog.open();
			that._openTRDialog();

			var PkgModel = new sap.ui.model.json.JSONModel();
			var WBTRModel = new sap.ui.model.json.JSONModel();
			var CTRModel = new sap.ui.model.json.JSONModel();

			var trType = ["/Packages", "/WorkbenchRequests", "/CustomizingRequests"];
			var surl = "/sap/opu/odata/UI2/TRANSPORT";
			var oModel = new sap.ui.model.odata.ODataModel(surl, true);
			var batchChanges = [];

			for (var i = 0; i < trType.length; i++) {
				var enURL = encodeURI(trType[i]);
				batchChanges.push(oModel.createBatchOperation(enURL, "GET"));
			}

			oModel.addBatchReadOperations(batchChanges);
			oModel.submitBatch(function(oResponse) {
				// if (oResponse.__batchResponses[0].data.results.length) {
				//   var BWSelKey = oResponse.__batchResponses[0].data.results.find(function(data) {
				//     data.isDefaultRequest = true;
				//   });

				//   sap.ui.getCore().byId("id_WBTR").setSelectedKey(BWSelKey);
				// }

				PkgModel.setData(oResponse.__batchResponses[0].data);
				sap.ui.getCore().byId("id_Pkg").setModel(PkgModel);

				WBTRModel.setData(oResponse.__batchResponses[1].data);
				sap.ui.getCore().byId("id_WBTR").setModel(WBTRModel);

				// if (oResponse.__batchResponses[1].data.results.length) {
				//   var CSelKey = oResponse.__batchResponses[1].data.results.find(function(data) {
				//     data.isDefaultRequest = true;
				//   });

				//   sap.ui.getCore().byId("id_CTR").setSelectedKey(CSelKey);
				// }

				CTRModel.setData(oResponse.__batchResponses[2].data);
				sap.ui.getCore().byId("id_CTR").setModel(CTRModel);

				that._busyDialog.close();
			}, function(err) {
				MessageToast.show("Error occurred.");
				that._busyDialog.close();
			});
		},

		_openTRDialog: function() {
			if (!that._trDialog) {
				that._trDialog = sap.ui.xmlfragment(
					"com.apac.toolZ_FIORI_AUTO_CONFIG.fragment.assignTRPackage", that
				);
				that.getView().addDependent(that._trDialog);
			}

			that._trDialog.open();
		},

		selectTR: function(oEvent) {
			if (oEvent.getParameter("selected")) {
				sap.ui.getCore().byId("id_vbTR").setVisible(true);
			} else {
				sap.ui.getCore().byId("id_vbTR").setVisible(false);
			}

			gvPackage = gvWBTR = gvCTR = undefined;
			gvPackageLS = gvWBTRLS = gvCTRLS = undefined;

			sap.ui.getCore().byId("id_Pkg").setSelectedKey(undefined);
			sap.ui.getCore().byId("id_WBTR").setSelectedKey(undefined);
			sap.ui.getCore().byId("id_CTR").setSelectedKey(undefined);

		},

		okTR: function() {
			if (sap.ui.getCore().byId("id_cbTR").getProperty("selected") === true && (!sap.ui.getCore().byId("id_Pkg").getSelectedKey() || !
					sap
					.ui.getCore().byId("id_WBTR").getSelectedKey() || !sap.ui.getCore().byId("id_CTR").getSelectedKey())) {

				MessageBox.error("Please enter mandatory fields");

				return;
			} else {
				MessageBox.warning("The transport settings you have entered cannot be changed later. Do you want to continue?", {
					title: "Confirm the Transport Settings",
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function(sAction) {
						if (sAction === "OK") {
							if (that._LSTRFragment === "X") {
								var LSData = ["/UI2/PAGE_BUILDER_CONF", "/UI2/PAGE_BUILDER_CUST", "/UI2/PAGE_BUILDER_PERS", "/UI2/INTEROP",
									"/UI2/TRANSPORT"
								];
								var LSData1 = ["/sap/bc/ui5_ui5/sap/ar_srvc_launch", "/sap/bc/ui5_ui5/sap/ar_srvc_news",
									"/sap/bc/ui5_ui5/sap/arsrvc_upb_admn", "/sap/bc/ui5_ui5/ui2/ushell",
									"/sap/bc/ui2/nwbc", "/sap/bc/ui2/start_up", "/sap/public/bc/icf/logoff", "/sap/public/bc/ui2",
									"/sap/public/bc/ui5_ui5"
								];

								gvPackageLS = sap.ui.getCore().byId("id_Pkg").getSelectedKey();
								gvWBTRLS = sap.ui.getCore().byId("id_WBTR").getSelectedKey();
								gvCTRLS = sap.ui.getCore().byId("id_CTR").getSelectedKey();

								that.activateServicesODataConf(LSData, "LS");
								that.activateServicesSICFConf(LSData1, "LS");
							} else {
								gvPackage = sap.ui.getCore().byId("id_Pkg").getSelectedKey();
								gvWBTR = sap.ui.getCore().byId("id_WBTR").getSelectedKey();
								gvCTR = sap.ui.getCore().byId("id_CTR").getSelectedKey();
							}

							sap.ui.getCore().byId("id_Pkg").setSelectedKey(undefined);
							sap.ui.getCore().byId("id_WBTR").setSelectedKey(undefined);
							sap.ui.getCore().byId("id_CTR").setSelectedKey(undefined);

							that._trDialog.close();
						}
					}
				});
			}
		},

		_buildReport: function(from) {
			var obj = {};
			var data = [];

			if (from === "btnReport") {
				var oDataReport = this.getView().byId("id-OdataTable1").getModel().getData();
				var IcfTableReport = this.getView().byId("id-IcfNodesTable1").getModel().getData();

				for (var i = 0; i < oDataReport.length; i++) {
					obj.ServiceType = "oData";
					obj.fioriId = oDataReport[i].fioriId;
					obj.AppName = oDataReport[i].AppName;
					obj.oDataServiceName = oDataReport[i].PrimaryODataServiceName;
					obj.oDataVersion = oDataReport[i].PrimaryODataServiceVersion;
					obj.Alias = oDataReport[i].Alias;
					obj.BSPApplicationURL = "";
					obj.Status = oDataReport[i].Status;
					if (obj.Status === "E") {
						obj.TransactionToCheck = "/IWFND/ERROR_LOG";
					} else {
						obj.TransactionToCheck = "";
					}

					data.push(obj);
					obj = {};
				}

				obj = {};
				for (var i = 0; i < IcfTableReport.length; i++) {
					obj.ServiceType = "SICF";
					obj.fioriId = IcfTableReport[i].fioriId;
					obj.AppName = IcfTableReport[i].AppName;
					obj.oDataServiceName = "";
					obj.oDataVersion = "";
					obj.Alias = "";
					obj.BSPApplicationURL = IcfTableReport[i].BSPApplicationURL;
					obj.Status = IcfTableReport[i].Status;
					if (obj.Status === "E") {
						obj.TransactionToCheck = "/IWBEP/ERROR_LOG";
					} else {
						obj.TransactionToCheck = "";
					}

					data.push(obj);
					obj = {};
				}
			} else if (from === "btnReportMCA") {
				var aliasReport = this.getView().byId("id-AliasTable").getModel().getData();
				var noteReport = this.getView().byId("id-NoteTable").getModel().getData();
				var compReportF = this.getView().byId("id-CompTable").getModel().getData();
				var compReportB = this.getView().byId("id-CompTable1").getModel().getData();

				var reportData = [];
				var srno = 0;

				reportData = aliasReport.filter(function(data) {
					return data.Status === "E" || data.Status === "W";
				});

				obj = {};
				for (var i = 0; i < reportData.length; i++) {
					obj.SrNo = srno = srno + 1;
					obj.ConfigurationItemType = "Alias";
					obj.Name = reportData[i].Alias;
					obj.TransactionToCheck = "SM30";

					data.push(obj);
					obj = {};
				}

				reportData = [];
				reportData = noteReport.filter(function(data) {
					return data.Status === "E" || data.Status === "W";
				});

				obj = {};
				for (var i = 0; i < reportData.length; i++) {
					obj.SrNo = srno = srno + 1;
					obj.ConfigurationItemType = "Note";
					obj.Name = reportData[i].NoteNo;
					obj.TransactionToCheck = "SNOTE";

					data.push(obj);
					obj = {};
				}

				reportData = [];
				reportData = compReportF.filter(function(data) {
					return data.FStatus === "E" || data.FStatus === "W";
				});

				obj = {};
				if (reportData.length > 1) {
					srno = srno + 1;
				}

				for (var i = 0; i < reportData.length; i++) {
					obj.SrNo = srno = srno + 1;
					obj.ConfigurationItemType = "Frontend Software Component";
					obj.Name = reportData[i].frontComp;
					obj.TransactionToCheck = "N/A";

					data.push(obj);
					obj = {};
				}

				reportData = [];
				reportData = compReportB.filter(function(data) {
					return data.BStatus === "E" || data.BStatus === "W";
				});

				obj = {};
				if (reportData.length > 1) {
					srno = srno + 1;
				}

				for (var i = 0; i < reportData.length; i++) {
					obj.SrNo = srno = srno + 1;
					obj.ConfigurationItemType = "Backend Software Component";
					obj.Name = reportData[i].backComp;
					obj.TransactionToCheck = "N/A";

					data.push(obj);
					obj = {};
				}

			}

			return data;

		},

		openEmailDialog: function() {
			if (!that._emailDialog) {
				that._emailDialog = sap.ui.xmlfragment(
					"com.apac.toolZ_FIORI_AUTO_CONFIG.fragment.sendEmail", that
				);
				that.getView().addDependent(that._emailDialog);
			}

			that._emailDialog.open();
		},

		sendEmail: function() {
			that._busyDialog.open();
			var oEntry = {};
			var data = that._buildReport("btnReport");

			if (!sap.ui.getCore().byId("id-inpEmail").getValue()) {
				MessageToast.show("Please enter email");
				return;
			}

			oEntry.Email = sap.ui.getCore().byId("id-inpEmail").getValue();
			sap.ui.getCore().byId("id-inpEmail").setValue("");
			oEntry.NAVREPORT = data;

			that._oModel.create('/ETReportHdrSet', oEntry, null, function(oResponse, oError) {
				that._emailDialog.close();
				MessageToast.show("Email sent");
			}, function() {
				MessageToast.show("Error occured");
			});

			that._busyDialog.close();
		},

		closeEmail: function() {
			that._emailDialog.close();
		},

		downloadReport: function(oEvent) {
			var from = "";
			if (oEvent.getSource().getId() === "__xmlview0--id-btnReport") {
				from = "btnReport";
			} else if (oEvent.getSource().getId() === "__xmlview0--id-btnReportMCA") {
				from = "btnReportMCA";
			}

			var data = that._buildReport(from);
			if (data.length) {
				exportData("csv", data);
			}
		},

		onAfterRendering: function() {
			that.handleIconTabBarSelect();
			// that._getTRBatch();
		}
	});
});