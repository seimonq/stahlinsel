
var Node = {
//+++++++++++++++++++++++++++++++++++++++++++++VAR

//+++++++++++++++++++++++++++++++++++++++++++++BASIC

	getNodeIndexByChapter : function() {

		var chapterId = $("#current-chapter").attr('chapterId');
		var requestDataTO = global.helper.composeRequestTO("selectNodeIndexByChapter",chapterId);
		global.helper.requestEditWithGetJson(requestDataTO, global.node.callbackSelectNodeIndexByChapter);
			
},
//
//this function selects for a given node a child node and presents it with the option to append states
//states can be deleted as well and a teaser can be written for the new relation between parent and child node
	selectNodeAsRelative : function(nodeIndex,type,relation) {
		
		var requestData = global.helper.composeRequestTO("selectNode",nodeIndex);
	
		return $.getJSON(global.serverUrl,{data:JSON.stringify(requestData)
				}).done(function(data){
					console.log(requestData.req+" response: "+data.toSource());
					global.node.callbackSelectNodeAsRelative(data,type,relation);
				}).fail(function() {
					var errorMsg = global.helper.composeErrorLog("");
					console.log(errorMsg);
				});
},
//
	selectNode : function(nodeIndex) {
	
		var requestData = global.helper.composeRequestTO("selectNode",nodeIndex);
		global.helper.requestEditWithGetJson(requestData,global.node.callbackSelectNode);
	
},
//
//+++++++++++++++++++++++++++++++++++++++++++++BINDING

	bindNodeCreateEventlistener : function() {

			//bind some more
		global.node.bindStateNodeRelationEventlistener("create");

				//display event for child node relation	
		$("#create-node-parent-select").change(function(event){
			event.stopPropagation();
			
			var nodeIndex = $("#create-node-parent-select option:selected").val();
			if(nodeIndex > 0) 
				global.node.selectNodeAsRelative(nodeIndex,"create","parent");
			});	
			
			//save event to put everything into database
		$('#create-save-node').click(function(event) {
			event.stopPropagation();

			var saveData = global.node.prepareSaveNodeData('create');
			var saveDataTO = global.helper.composeSaveTO('saveNode',saveData);
			global.helper.requestEditWithGetJson(saveDataTO,global.helper.callbackDeleteOrSaveData);
		});	
},
//
	bindNodeEditEventlistener : function() {
		
				//bind some more
		global.node.bindStateNodeRelationEventlistener("edit");
		
				//display event for parent node relation	
		$("#edit-node-parent-select").change(function(){
			var nodeIndex = $("#edit-node-parent-select option:selected").val();
			if(nodeIndex > 0) global.node.selectNodeAsRelative(nodeIndex,"edit","parent");
			});	
				//display event for child node relation	
		$("#edit-node-child-select").change(function(){
			var nodeIndex = $("#edit-node-child-select option:selected").val();
			if(nodeIndex > 0) global.node.selectNodeAsRelative(nodeIndex,"edit","child");
			});	
		
			//finalize and save node with all its edges and states
		$("#edit-save-node").click(function() {
			var sendData = global.node.prepareSaveNodeData('edit');

			var nodeId = $("#edit-node-index").val();
			var deleteDataTO = global.helper.composeRequestTO("deleteNode",nodeId);
			global.helper.requestEditWithGetJson(deleteDataTO,global.node.callbackEditNode);
		});
	
},
//
	bindStateNodeRelationEventlistener : function(type) {
	
			//erstelle neue State relations
		$("#"+type+"-state-node-relation-select").change(function(event){
			event.stopPropagation();
			var stateName = $("#"+type+"-state-node-relation-select option:selected").text();
			var stateId   = $("#"+type+"-state-node-relation-select option:selected").val();
			if(!($("#"+type+"-node-state-relation-container").has("[stateId='"+stateId+"']").length) && stateId != 0)
				$("#"+type+"-node-state-relation-container").append("<div stateId='"+stateId+"' style='color: #28385a; font-weight:bold'>"+stateName+"</div>");
			});

			//lösche alle bisher angehängten states
		$("#"+type+"-delete-state-node-relation-button").click(function(event) {
			event.stopPropagation();
			$("#"+type+"-node-state-relation-container").html("");
			})
},

	bindEditNodeedgeEventlistener : function(responseData, type, relation) {

			//event to select states to the given new node relation
		$("#"+type+"-state-nodeedge-relation-select-"+responseData.index).change(function() {
		
			var stateName = $("#"+type+"-state-nodeedge-relation-select-"+responseData.index+" option:selected").text();
			var stateId   = $("#"+type+"-state-nodeedge-relation-select-"+responseData.index+" option:selected").val();
				//check if already exists or append new state
			if(!($("#"+type+"-state-nodeedge-container-"+responseData.index).has("#"+type+"-state-name-is-"+responseData.index+"-"+stateId).length) && stateId != 0)
				{
				$("#"+type+"-state-nodeedge-container-"+responseData.index).
					append("<div id='"+type+"-state-name-is-"+responseData.index+"-"+stateId+"' state-id='"+stateId+"' style='color: #28385a; font-weight:bold'>"+stateName+"</div>");
				}

			});
		
			//delete the whole childnode
		$("#"+type+"-delete-node-"+relation+"-button-"+responseData.index).click(function() {
			$("#"+type+"-"+relation+"-node-form-"+responseData.index).remove();
			});
			//delete all appended states so far
		$("#"+type+"-delete-all-state-nodeedge-relation-button-"+responseData.index).click(function() {
			$("#"+type+"-state-nodeedge-container-"+responseData.index).html("");
			});
			
			//switch to node
		$(".button-jump-to-node").click(function(event) {
			//event.stopPropagation();
			event.stopImmediatePropagation();
			global.helper.resetWebsite();
			$("#edit-node-space").show();
			var nodeId = $(this).attr('nodeId');
			global.node.selectNode(nodeId);
			global.node.bindNodeEditEventlistener();
		});
	
},
//
	bindNodeDeleteEventlistener : function() {
		
		$('#delete-node').click(function() {
			var nodeId = $("#delete-node-select").val(); 
			var deleteDataTO = global.helper.composeRequestTO("deleteNode",nodeId);
			global.helper.requestEditWithGetJson(deleteDataTO,global.helper.callbackDeleteOrSaveData);
			});
},
//
//+++++++++++++++++++++++++++++++++++++++++++++CALLBACK

	callbackSelectNodeAsRelative : function(responseData, type, relation, msg) {

			//update state index
		global.state.getStateIndex();
		
			//check if child is already attached
		var currentNodeName = $('#'+type+'-node-name').val();
		if($("#"+type+"-"+relation+"-node-"+responseData.index).length || responseData.name == currentNodeName) { 
			//do not do anything! 
			alert("Den Knoten gibt es schon oder ist der fokussierte Knoten.")
		}
			//append new child relation
		else {	
			$("#"+type+"-node-"+relation+"-form").append(global.node.htmlTemplateNodeRelationForm(responseData,type,relation));
			global.node.bindEditNodeedgeEventlistener(responseData, type, relation);
		}
},
//
	callbackSelectNode(responseData, onSuccessMsg) {

				//display basic node info
		$("#edit-node-index").val(responseData.index);
		$("#edit-node-chapter").val(responseData.chapter);
		$("#edit-node-name").val(htmlDecode(responseData.name));
		$("#edit-node-text").val(htmlDecode(responseData.text));
		
			//display existing state-node-relations
		responseData.states.forEach(function(element,key) {
			$("#edit-node-state-relation-container").
				append("<div stateId='"+element[0].index+"' style='color: #28385a; font-weight:bold'>"+element[0].name+"</div>");
		});
		
			//display existing parent nodes with states
		if(responseData.hasOwnProperty('parentList') && responseData.parentList.length) {
		responseData.parentList.forEach(function(element,key) {
				//get node as a relative
			$.when(global.node.selectNodeAsRelative(element.parent_id,"edit","parent")).done(function() {
				global.node.addParentNodeedgeInfo(key,element);

				});
			});
		}
			//display existing child nodes with states
		if(responseData.hasOwnProperty('childList') && responseData.childList.length) {
		responseData.childList.forEach(function(element,key) {
			$.when(global.node.selectNodeAsRelative(element.child_id,"edit","child")).done(function() {;
					global.node.addChildNodeedgeInfo(key,element);
				});
			});
		}	
		
},
//

	callbackSelectNodeIndexByChapter : function(requestData, onSuccessMsg) {
		
		var options = "<option value='0'>-- select --</option>";
			
		if(requestData !== null) {
			$.each( requestData, function( key, val ) {
				var option = val.name.substring(0,40);
				if(option.length >= 40) option += "..";
				options += "<option value='"+val.index+"' fullText='"+val.text+"'>" + option  + "</option>";
			}); 
		}
		else { 
			console.log("data is null in getNodeByChapFunc"); 
		}
		
			//fill into all option forms		
		$(".node-index").html(options);	
},
	callbackEditNode : function(responseData,onSuccessMsg) {

			//in this callback function a second AJAX is send to save the data after deletion = update
		var saveData = global.node.prepareSaveNodeData('edit');
		var saveDataTO = global.helper.composeSaveTO('saveNode',saveData);
		global.helper.requestEditWithGetJson(saveDataTO,global.helper.callbackDeleteOrSaveData);
		
},
//
//+++++++++++++++++++++++++++++++++++++++++++++MISC

	addParentNodeedgeInfo : function(key, element) {
		
		$("#edit-parent-node-"+element.parent_id).val(element.teaser);
		if(element.hasOwnProperty('stateNodeedges') && element.stateNodeedges != null && element.stateNodeedges.length) {	
		element.stateNodeedges.forEach(function(nodeedge,key) {
			$("#edit-state-nodeedge-container-"+element.parent_id).
				append("<div id='edit-state-name-is-"+element.parent_id+"-"+
					nodeedge.state_id+"' state-id='"+nodeedge.state_id+"' style='color: blue; font-weight:bold'>"+
						nodeedge.name+"</div>");
			});
		}
},
	addChildNodeedgeInfo : function(key, element) {
			$("#edit-child-node-"+element.child_id).val(element.teaser);

		if(element.hasOwnProperty('stateNodeedges') && element.stateNodeedges != null && element.stateNodeedges.length) {	
		element.stateNodeedges.forEach(function(nodeedge,key) {
			$("#edit-state-nodeedge-container-"+element.child_id).
				append("<div id='edit-state-name-is-"+element.child_id+"-"+
					nodeedge.state_id+"' state-id='"+nodeedge.state_id+"' style='color: blue; font-weight:bold'>"+
						nodeedge.name+"</div>");
			});
		}	
},
//
	prepareSaveNodeData : function(type) {
	
		var sendData = new Object();
			//kapitel name + summary
		sendData.nodeName = $('#'+type+'-node-name').val();
		sendData.nodeText = $('#'+type+'-node-text').val();
		sendData.chapterId = $("#current-chapter").attr("chapterId");
			
			//kind verknüpfung
		sendData.nodeChildRelationList	 = [];
		$("[relation='"+type+"-child-node']").each(function() {
			var nodeChild = new Object();
			nodeChild.teaser = $(this).val();
			nodeChild.dbIndex = $(this).attr('dbIndex');
			
			nodeChild.stateList = [];
			$("#"+type+"-state-nodeedge-container-"+nodeChild.dbIndex).children().each(function() {
				nodeChild.stateList.push($(this).attr('state-id'));
				});

			sendData.nodeChildRelationList.push(nodeChild);
			});
		sendData.nodeParentRelationList  = [];
		$("[relation='"+type+"-parent-node']").each(function() {
				var nodeParent = new Object();
				nodeParent.teaser = $(this).val();
				nodeParent.dbIndex = $(this).attr('dbIndex');
				
				nodeParent.stateList = [];
				$("#"+type+"-state-nodeedge-container-"+nodeParent.dbIndex).children().each(function() {
					nodeParent.stateList.push($(this).attr('state-id'));
					});

				sendData.nodeParentRelationList.push(nodeParent);
				});

			//state knoten verknüpfung
		sendData.stateNodeRelation = [];

		$("#"+type+"-node-state-relation-container").children().each(function() {
			sendData.stateNodeRelation.push($(this).attr('stateId'));
			});
			
		return sendData;
},
//

	htmlTemplateNodeRelationForm : function(data,type,relation) {
	
	var html = " \
			<form id='"+type+"-"+relation+"-node-form-"+data.index+"' class='form-inline' style='margin: 4px; background-color: #inherit; padding: 3px; border: 1px dashed #28385a;'> \
				<button type='button' class=' btn btn-info button-jump-to-node' nodeId='"+data.index+"' title='focus this node'>"+data.name+"</button>\
				<button id='"+type+"-delete-node-"+relation+"-button-"+data.index+"' type='button' class='btn btn-danger btn-xs' title='Entfernen'>\
					Verknüpfung löschen </button><br><br>\
				<textarea relation='"+type+"-"+relation+"-node' dbIndex ='"+data.index+"' id='"+type+"-"+relation+"-node-"+data.index+"'\
					placeholder='Teaser eingeben' cols='40' rows='2'></textarea>\
				<br>\
				Bedingungen auswählen:\
				<select id='"+type+"-state-nodeedge-relation-select-"+data.index+"' class='state-index form-control'>\
					<option>#def: state-index</option>\
				</select>\
				<input id='"+type+"-delete-all-state-nodeedge-relation-button-"+data.index+"'\
				type='button' value='Alle Bedingungen löschen' class='btn btn-danger btn-xs'>\
				<div id='"+type+"-state-nodeedge-container-"+data.index+"'>\
				</div>\
			</form>";
	
	return html;
	
},
//
	hideAndUnbindAll : function() {

			//hide
		$("#create-node-space").hide();
		$("#edit-node-space").hide();
		$("#delete-node-row").hide();
			
		$("#create-node-parent-form").html("");	//delete hopefully form and all its click events
		$("#edit-node-child-form").html("");	//delete hopefully form and all its click events
		$("#edit-node-parent-form").html("");	//delete hopefully form and all its click events

		$("#edit-node-state-relation-container").html("");

			//unbind 
		$("#create-save-node").off();
		$("#edit-save-node").off();

		$("#create-node-parent-select").off();
		$("#edit-node-parent-select").off();
		$("#edit-node-child-select").off();


		$("#save-edited-node").off();
		$('#delete-node').off();

		$('.button-jump-to-node').off();
	}

}



