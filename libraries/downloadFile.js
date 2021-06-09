/****************************Note**********************************/
/**
 * The exportData Function is used to download data in the format specified as the first parameter(exportType) and the data to be downloaded is passed as the second parameter(inputData).
 * Sample call to the function:
 *         exportData(format as string, data as object);
 * example:
 *         sampleData=[{firstname: "Al",
 *                          lastname: "Dente"
 *                      },{firstname: "Andy",
 *                          lastname: "Friese"
 *                      },{firstname: "Anita",
 *                          lastname: "Mann"
 *                      },{firstname: "Doris",
 *                          lastname: "Schutt"
 *                      },{firstname: "Kenya",
 *                          lastname: "Dewit"
 *                      }];
 *          exportData("excel",sampleData);
 */
/****************************Note**********************************/

function exportData(exportType, inputData) {
	if (exportType == "csv") {
		jQuery.sap.require("sap.ui.core.util.Export");
		jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
		jQuery.sap.require("sap.m.TablePersoController");

		var oModel = new sap.ui.model.json.JSONModel(inputData);

		// get name of all the columns
		var columnsTitle = [];
		var arr = Object.keys(inputData[0]);
		for (var i = 0; i < arr.length; i++) {
			var columnName = {
				name: arr[i],
				template: {
					content: {
						path: arr[i]
					}
				}
			};
			columnsTitle.push(columnName);
		}

		var oExport = new sap.ui.core.util.Export({
			// Type that will be used to generate the content. Own ExportType's can be created to support other formats
			exportType: new sap.ui.core.util.ExportTypeCSV({
				separatorChar: ","
			}),
			// Pass in the model created above
			models: oModel,
			rows: {
				path: "/"
			},
			columns: columnsTitle
		});

		// download exported file
		oExport.saveFile().always(function() {
			this.destroy();
		});

	} else if (exportType == "image") {
		jQuery.sap.require("sap.ui.core.util.File");

		var ExportTypeJPG = sap.ui.core.util.File.save({
			sData: inputData,
			sFileName: "download",
			sFileExtension: ".png",
			sMimeType: "image/png"
		});
	}
}