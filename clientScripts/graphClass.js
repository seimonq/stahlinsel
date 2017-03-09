var Graph = {


//+++++++++++++++++++++++++++++++++++++++++++++BASIC
//
		openGraphicSpace : function() {
		
		global.helper.resetWebsite();
//		$("#graphic-space").show();

			var requestData = new Object();
			if(global.operation_mode == "node") {
				var chapterId = $("#current-chapter").attr('chapterId'); 
				requestData = global.helper.composeRequestTO("showNodeGraph",chapterId);
			}
			else if(global.operation_mode == "chapter") {
				requestData = global.helper.composeNoParamRequestTO("showChapterGraph");
			}
			
			global.helper.requestEditWithGetJson(requestData,global.graph.callbackShowGraph);
			
				
			global.graph.bindGraphEventlistener();
			$("#graphic-space").show();
					
},
//

//+++++++++++++++++++++++++++++++++++++++++++++BINDING
	bindGraphEventlistener : function() {
		
			//click event
/*		$("#graphic-space").click(function(event){
			$("#graphic-space").hide();
		});
*/		
},
//
//+++++++++++++++++++++++++++++++++++++++++++++CALLBACK
		
	callbackShowGraph : function(responseData, message) {
			
//		alert(responseData.toSource());
//		$("#graphic-space").html(responseData.toSource());
		
		graf.parse(responseData);
//		alert(graf.list());
		fotoGraf.ieren();
		nextFoto();
},
//
//+++++++++++++++++++++++++++++++++++++++++++++MISC

	hideAndUnbindAll : function() {
			//hide
		$("#graphic-space").hide();
		$("#svg-graph-box").hide();

			//unbind
		$("#graphic-space").off();
		
		
}

}
