
/*
 * methods in Helper all classes can and will use
 * */

var Helper = {

//+++++++++++++++++++++++++++++++++++++++++++++COMPOSE VARIABLES
//
	onSuccessBox : function(message) {
		if(message) {
			alert(message);
		}
			//default
		else {
			alert("AJAX call successfully commited.");
			}
},
//
	composeErrorLog : function(message) {
		if (message) {
			return "An unspecified error occured";
		}
		return message;
},
//
	composeNoParamRequestTO : function(request) {
		var requestNoparam = new Object();
		requestNoparam.req = request;
		
		return requestNoparam;
},
//
	composeRequestTO : function(request, key) {
		var requestDataTO = new Object();
		requestDataTO.req = request;
		requestDataTO.payload = new Object();
		requestDataTO.payload.key = key;
		
		return requestDataTO;
},
//
	composeSaveTO : function(request, saveData) {
		var requestDataTO = new Object();
		requestDataTO.req = request;
		requestDataTO.payload = saveData;
		
		return requestDataTO;
},

//+++++++++++++++++++++++++++++++++++++++++++++CALLBACK

	callbackDeleteOrSaveData : function( responseData , onSuccessMsg ) {

			global.helper.onSuccessBox(onSuccessMsg);

				//reload indexes	
			global.chapter.getChapterIndex();
			global.state.getStateIndex();

			var chapterId = $("#current-chapter").attr("chapterId");
			if(chapterId) {
				global.node.getNodeIndexByChapter(chapterId);
			}
				
			global.helper.resetWebsite();	
},

//+++++++++++++++++++++++++++++++++++++++++++++MISC

	//TODO überarbeite! 
	varifyActionByUser : function() {
		//alert("<button type='button' id='user-confirm-ok' value='Löschen ok?'>");
		alert("Die Resource wird gelöscht.");
		//var confirmed = false;
		var confirmed = true;
		$("#user-confirm-ok").click(function(){
				confirmed = true;
			});
		return confirmed;
},
//
		//general method used to communicate with the server
		//in this webapp http-get is used for all CRUD operations
	requestEditWithGetJson : function(requestData,successCallBack, onSuccessMsg, onErrorMsg) {

	return	$.getJSON(global.serverUrl,{data:JSON.stringify(requestData)
				}).done(function(data){
					console.log(requestData.req+" response: "+data.toSource());
					successCallBack(data,onSuccessMsg);
				}).fail(function() {
					var errorMsg = global.helper.composeErrorLog(onErrorMsg);
					console.log(errorMsg);
				});
},
//	
	resetWebsite : function() {
		
		global.chapter.hideAndUnbindAll();			
		global.node.hideAndUnbindAll();
		global.state.hideAndUnbindAll();
		global.graph.hideAndUnbindAll();
		
	}

}
