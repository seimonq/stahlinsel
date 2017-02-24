
var State = {

//+++++++++++++++++++++++++++++++++++++++++++++BASIC

	getStateIndex : function() {
		var requestData = global.helper.composeNoParamRequestTO("selectStateIndex");
		global.helper.requestEditWithGetJson(requestData, global.state.callbackSelectStateIndex);
},
//
//+++++++++++++++++++++++++++++++++++++++++++++BINDING

	bindStateEventListeners : function() {
		
		$('#save-state-button').click(function() {
			var sendData = global.state.prepareStateData();
			var saveDataTO = global.helper.composeSaveTO("saveState", sendData);
			global.helper.requestEditWithGetJson(saveDataTO, global.helper.callbackDeleteOrSaveData, global.log.saveStateSuccess);
		});
		$('#edit-state-button').click(function() {
			var editStateId = $('#edit-state-select option:selected').val();
			var requestDataTO = global.helper.composeRequestTO("selectState",editStateId);
			global.helper.requestEditWithGetJson(requestDataTO,global.state.callbackGetState,"selectState response: ");	
		});
		$('#delete-state-button').click(function() {
			if(global.helper.varifyActionByUser()) {
				var delStateId = $('#edit-state-select option:selected').val();
				var deleteDataTO = global.helper.composeRequestTO("deleteState", delStateId);
				global.helper.requestEditWithGetJson(deleteDataTO,global.helper.callbackDeleteOrSaveData, 
					global.log.deleteStateSuccess, global.log.deleteStateFail);
			}
		});
},
//
//+++++++++++++++++++++++++++++++++++++++++++++CALLBACK

	callbackSelectStateIndex : function(responseData,msg) {

		var options = "<option value='0'>-- select --</option>";
		var buttons = "";
		$.each( responseData, function( key, val ) {
			var option = val.name.substring(0,20);
			if(option.length >= 20) option += "..";
			options += "<option value='"+val.index+"' fullName='"+val.name+"'>" + option  + "</option>";
		});
			//fill into all option forms		
		$(".state-index").html(options);
},
//
	callbackGetState : function(responseData,onSuccessMsg) {

			$("#create-state-name").val(htmlDecode(responseData.name));
			$("#create-state-type-select").val(htmlDecode(responseData.type));
			
},
//
//+++++++++++++++++++++++++++++++++++++++++++++MISC
//
	prepareStateData : function() {
	
	var sendData = new Object();

	sendData.stateName = $('#create-state-name').val();
	sendData.stateType = $('#create-state-type-select option:selected').val();

	return sendData;
},
//
	hideAndUnbindAll : function() {
		
			//hide
		$("#crud-state-space").hide();
		
			//unbind 
		$("#save-state-button").off();
		$("#edit-state-button").off();
		$("#delete-state-button").off();
}

 
}
