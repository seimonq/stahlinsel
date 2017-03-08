

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
	
function callbackSelectPlayNode(responseData, onSuccessMsg) {
	
	reset_play_website();
	alert(responseData.toSource());
	
	$("#focused-node-text").html(htmlDecode(responseData.text));
	
	$("#parent-node-box").html("");
	if(responseData.hasOwnProperty('parentList') && responseData.parentList.length) {
		responseData.parentList.forEach(function(element,key) {
			var parentId = element.parent_id;
			//
			$("#parent-node-box").append('<button type="button" id="parent-'+parentId+'"\
				class="margin-bottom btn btn-info" title="nodeIndex:'+parentId+'">'+element.relatedNodeName+'</button>\
				Teaser: '+element.teaser+'<br><br>');
			//
			displayStatesForNodeedges(element,responseData.name,"parent");
			//event
			$("#parent-"+parentId).click(function(e) {
				$("#select-play-node-by-chapter option[value="+parentId+"]").
					prop('selected', true);
				selectNode(parentId);
			});
		});
	}
		
	$("#child-node-box").html("");
	if(responseData.hasOwnProperty('childList') && responseData.childList.length) {
		responseData.childList.forEach(function(element, key) {
			var childId = element.child_id;
			//
			$("#child-node-box").append('<button type="button" id="child-'+childId+'"\
				class="margin-bottom btn btn-info" title="nodeIndex:'+childId+'">'+element.relatedNodeName+'</button>\
				Teaser: '+element.teaser+'<br><br>');
			//
			displayStatesForNodeedges(element,responseData.name,"child");
			//event
			$("#child-"+childId).click(function() {
				$( "#select-play-node-by-chapter option[value='"+childId+"']").
					prop('selected', true);
				selectNode(childId);
			});
		});
	}
}
//
function displayStatesForNodeedges(element,focusedNodeName,relation) {
	if(element.stateNodeedges.length > 0) {
		$("#"+relation+"-node-info-box").append('Bedingung für '+
			element.relatedNodeName+'<->'+focusedNodeName+' : ');
		element.stateNodeedges.forEach(function(stateElement, stateKey) {
			$("#"+relation+"-node-info-box").append(" <b>"+stateElement.name+"</b> ");
		});
	}
}
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




