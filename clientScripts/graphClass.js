var Graph = {


//+++++++++++++++++++++++++++++++++++++++++++++BASIC
//
		openGraphicSpace : function() {
		
		global.helper.resetWebsite();
		$("#graphic-space").show();

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
					
},
//

//+++++++++++++++++++++++++++++++++++++++++++++BINDING
	bindGraphEventlistener : function() {
		
			//click event
		$("#graphic-space").click(function(event){
			$("#graphic-space").hide();
		});
		
			//more click events
			
		//////
},
//
//+++++++++++++++++++++++++++++++++++++++++++++CALLBACK
		
	callbackShowGraph : function(responseData, message) {
			
//		alert(responseData.toSource());
//		$("#graphic-space").html(responseData.toSource());
		
		graf.parse(responseData);
//		alert(graf.list());
		fotoGraf.ieren();
		$("#graphic-space").html(fotoGraf.album[1].tab);

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
