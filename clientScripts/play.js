

		//set global namespace
	var global = new Object();

	global.chapter  = Chapter;
	global.node 	= Node;
	global.state 	= State;
//	global.graph 	= Graph;

	global.helper 	= Helper;
	global.log 		= Log;

		// global config
	global.serverUrl = "../serverScripts/edit.php";
	global.operation_mode = "chapter";

// #################### util ####################################################

function htmlEncode(value){
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}

//############################################################################################## SOME LOGIC



//##############################################################################################
//##############################################################################################
// main 



window.onload = function() {
	
		global.chapter.getChapterIndex();
		$("#select-play-node-by-chapter").html("<option> -- no option -- </option>");
		
		
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ play event section $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	$("#select-play-chapter").click(function(event){
		event.stopPropagation();
		
		var chapterIndex = $("#select-play-chapter option:selected").val();
		var chapterName  = $("#select-play-chapter option:selected").text();
		if( chapterIndex > 0) {
			$("#current-chapter").attr("chapterId",chapterIndex);
			$("#current-chapter").text(chapterName);
			global.node.getNodeIndexByChapter();
		}
		else {
			$("#current-chapter").attr("chapterId",0);
			$("#current-chapter").text("Kein Kapitel gewählt");
			$("#select-play-node-by-chapter").html("<option> -- no option -- </option>");
		}
	});
//

	
};




