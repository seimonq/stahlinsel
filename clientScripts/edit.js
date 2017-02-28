

	//set global namespace
var global = new Object();

global.chapter  = Chapter;
global.node 	= Node;
global.state 	= State;
global.graph 	= Graph;

global.helper 	= Helper;
global.log 		= Log;

	//global config

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
function carryOverSelectedChapter(selectionValue, selectionName) {
	
			if( selectionValue > 0) {
				$("#current-chapter").text(selectionName);
				$("#current-chapter").attr('chapterId',selectionValue);
				global.node.getNodeIndexByChapter(selectionValue);
				$( "#chapter-selector-for-nodes option[value*='"+selectionValue+"']").
					prop('selected', true);
			}
			else {
				$("#current-chapter").html("<span style='color:purple'>Kein Kapitel gewählt</span>");
				$("#current-chapter").attr('chapterId',0);

			}
	}

function switchBetweenChapterAndNodeLogic() {
	
	if(global.operation_mode == "chapter") {
		$("#menu-chapter").show();
		$("#switch-operation-mode").text("Manipuliere Knoten");	
		$("#display-operation-mode").html("<h2>EDIT CHAPTERS</h2>");	
		global.chapter.getChapterIndex();
	}	
	
	$("#switch-operation-mode").click(function() {
		global.helper.resetWebsite();
		$("#menu-chapter").toggle();	
		$("#menu-node").toggle();
		if(global.operation_mode == "chapter") {
			global.operation_mode = "node";
			$("#switch-operation-mode").text("Manipuliere Kapitel");	
			$("#display-operation-mode").html("<h2>EDIT NODES</h2>");	
				
				//updates current-chapter 
				var chapterId   = $("#chapter-selector option:selected").attr('value');
				var chapterName = $("#chapter-selector option:selected").text();
			carryOverSelectedChapter(chapterId,chapterName);
			//alert($("#current-chapter").text());
			//if("#current-chapter").val() > 0) 
			global.state.getStateIndex();
		}
		else {
			global.operation_mode = "chapter";
			$("#switch-operation-mode").text("Manipuliere Knoten");	
			$("#display-operation-mode").html("<h2>EDIT CHAPTERS</h2>");	
			global.chapter.getChapterIndex();
		}
	});
	
}

//##############################################################################################
//##############################################################################################
// main 



window.onload = function() {
	
	switchBetweenChapterAndNodeLogic();
	
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ chapter event section $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	$("#menu-delete-chapter").click(function(event){
		event.stopPropagation();
		global.helper.resetWebsite();
		
		$("#delete-chapter-row").show();
		global.chapter.bindChapterDeleteEventlistener();
	});
//
	$("#menu-create-chapter").click(function(event){
		event.stopPropagation();
		global.helper.resetWebsite();
		
		$("#create-chapter-space").show();
		global.chapter.bindChapterCreateEventlistener();
	});
//
	$("#menu-edit-chapter").click(function(event){
		event.stopPropagation();
		global.helper.resetWebsite();

		$("#edit-chapter-space").show();
		
		var chapterId = $("#chapter-selector").val();
		global.chapter.selectChapter(chapterId);
		global.chapter.selectChapterRelation(chapterId);
		
		global.chapter.bindChapterEditEventlistener(chapterId);
	});



//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ node event section $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	$("#chapter-select-for-nodes-button").click(function() {
		var chapterId = $("#chapter-selector-for-nodes").val();
		var chapterName = $("#chapter-selector-for-nodes option:selected").attr('fullName');
		//alert(chapterId+" and "+chapterName);
		$("#current-chapter").text(chapterName);
		$("#current-chapter").attr("chapterId",chapterId);
		
		global.node.getNodeIndexByChapter();
		});
		
	//create a new node
	$("#menu-create-node").click(function(event) {
		event.stopPropagation();
		global.helper.resetWebsite();

		$("#create-node-space").show();
		global.node.bindNodeCreateEventlistener();
	 });
	 
	 //edit a node
	$("#menu-edit-node").click(function(event){
		event.stopPropagation();
		global.helper.resetWebsite();

		$("#edit-node-space").show();
		var nodeId = $("#node-selector option:selected").val();
		global.node.selectNode(nodeId);
		global.node.bindNodeEditEventlistener();

	});
	
	//delete a node
	$("#menu-delete-node").click(function(event){
		event.stopPropagation();
		global.helper.resetWebsite();
		
		$("#delete-node-row").show();
		global.node.bindNodeDeleteEventlistener();
	});

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ state event section $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$	
	
	$("#menu-crud-state").click(function(event){
		event.stopPropagation();
		global.helper.resetWebsite();
		
		$("#crud-state-space").show();
		global.state.bindStateEventListeners();
		
	});
	

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ graph event section $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

//	graphic schalten =============================================
	
	$("#display-graph").click(function(event){
		event.stopPropagation();
		global.graph.openGraphicSpace();
	
	});
	
	
};

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ misc event section $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//closing event
	$('#imgBox').click(function() {
		global.helper.resetWebsite();
	});



