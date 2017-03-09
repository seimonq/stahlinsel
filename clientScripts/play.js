

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

function selectNode(nodeIndex) {
		var requestData = global.helper.composeRequestTO("selectNode",nodeIndex);
		global.helper.requestEditWithGetJson(requestData,callbackSelectPlayNode);
}
//select a node callback function
function callbackSelectPlayNode(responseData, onSuccessMsg) {
	
	reset_play_website();
	alert(responseData.toSource());
	
	//attach text for node
	$("#focused-node-box").html(htmlDecode(responseData.text));
	
	//attach received states
	if(responseData.states.length > 0) {
		responseData.states.forEach(function(stateElement, stateKey) {
			$("#focused-node-info-box").append(" <b>"+stateElement.name+"</b> ("+stateElement.type+") <br>");
		});
	}
	
	//attach parent nodes
	$("#parent-node-box").html("");
	if(responseData.hasOwnProperty('parentList') && responseData.parentList.length) {
		responseData.parentList.forEach(function(element,key) {
			displayRelatedNodes(responseData.name,"parent",element);
		});
	}
	
	//attach child nodes
	$("#child-node-box").html("");
	if(responseData.hasOwnProperty('childList') && responseData.childList.length) {
		responseData.childList.forEach(function(element, key) {
			displayRelatedNodes(responseData.name,"child",element);
		});
	}
}
//is used for child and parent nodes
function displayRelatedNodes(nodeName,type,element) {
	
	if(type == "parent") var relNodeId     = element.parent_id;
	else if(type == "child") var relNodeId = element.child_id; 

	//attach Buttons and Teaser
	$("#"+type+"-node-box").append('<button type="button" id="'+type+'-'+relNodeId+'"\
		class="margin-bottom btn btn-info" title="nodeIndex:'+relNodeId+'">'+element.relatedNodeName+'</button>\
		Teaser: '+element.teaser+'<br><br>');
	
	//attach States for nodeedges 
	displayStatesForNodeedges(element,nodeName,type);
	
	//event for related node buttons 
	$("#"+type+"-"+relNodeId).click(function(e) {
		$("#select-play-node-by-chapter option[value="+relNodeId+"]").
			prop('selected', true);
		selectNode(relNodeId);
	});
	
}
//show state conditions for nodeedges
function displayStatesForNodeedges(element,focusedNodeName,relation) {
	
	if(element.stateNodeedges.length > 0) {
		
		$("#"+relation+"-node-info-box").append('---<br>'+element.relatedNodeName+'<->'+focusedNodeName+' : ');
		
		element.stateNodeedges.forEach(function(stateElement, stateKey) {
			$("#"+relation+"-node-info-box").append(" <b>"+stateElement.name+"</b> ");
		});
	}
}
//
function reset_play_website() {
		
		$("#parent-node-box").html("");
		$("#parent-node-info-box").html("");
		
		$("#focused-node-box").html("");
		$("#focused-node-info-box").html("");

		$("#child-node-box").html("");
		$("#child-node-info-box").html("");
		
}

//##############################################################################################
//##############################################################################################
// main 



window.onload = function() {
	
		reset_play_website();

		global.chapter.getChapterIndex();
		$("#select-play-node-by-chapter").html("<option> -- no option -- </option>");
		
		
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ play event section $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	$("#select-play-chapter").change(function(event){
		event.stopPropagation();
		reset_play_website();
		
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
	
	$("#select-play-node-by-chapter").change(function(event) {
		
		var nodeIndex = $("#select-play-node-by-chapter option:selected").val();  
		selectNode(nodeIndex);
		});
//

	
};




