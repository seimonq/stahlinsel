/*
 * all methods concerning Chapter are here
 * 
 * */

var Chapter = {

//+++++++++++++++++++++++++++++++++++++++++++++BASIC
//getChapterIndex
	getChapterIndex : function (waitFunction = function(){}) {
	global.chapterIndexResponded = false;
	
	var requestData = global.helper.composeNoParamRequestTO("selectChapterIndex");
	global.helper.requestEditWithGetJson(requestData,global.chapter.callbackGetChapterIndex, null, global.log.getChapterIndexFail);
    
		var waitChapterIndexResponse = setInterval(function(){ 
			if(global.chapterIndexResponded == true) {
				waitFunction();
				clearInterval(waitChapterIndexResponse);
			}
		}, 1000);
			//save anchor to end loop
		setTimeout(function(){	
			clearInterval(waitChapterIndexResponse);
		}, 25000);
	
},
//
	selectChapter : function (chapterId) {

		var requestData = global.helper.composeRequestTO("selectChapter",chapterId);
		global.helper.requestEditWithGetJson(requestData,global.chapter.callbackSelectChapter);
},
//
	selectChapterRelation : function(chapterId) {
			
			//hide currently selected chapter
		$("#edit-chapter-parent-box").find("[chapterId='"+chapterId+"']").remove();
		$("#edit-chapter-child-box").find("[chapterId='"+chapterId+"']").remove();
			//set selected chapter again
		$("#chapter-selector option[value="+chapterId+"]").
			prop('selected', true);
			//highlight already attached chapters
		var requestData = global.helper.composeRequestTO("selectChapterRelation",chapterId);
		global.helper.requestEditWithGetJson(requestData,global.chapter.callbackSelectChapterRelation);
		
},
//
//+++++++++++++++++++++++++++++++++++++++++++++BINDING
	bindChapterCreateEventlistener : function() {
		
		global.chapter.bindChapterRelationButtonEventlistener('create'); 
		
		$('#save-chapter').click(function() {
			var saveData = global.chapter.prepareSaveChapterData('create');
			var saveDataTO = global.helper.composeSaveTO('saveChapter',saveData);
			global.helper.requestEditWithGetJson(saveDataTO,global.helper.callbackDeleteOrSaveData,
				global.log.saveChapterSuccess, global.log.saveChapterFail);
			});		
},
//
	bindChapterEditEventlistener : function(chapterId) {
		
		global.chapter.bindChapterRelationButtonEventlistener('edit'); 

		$("#save-edited-chapter").click(function() {
				//first the data has to be deleted -> the saveCall is within the callback
			var deleteDataTO = global.helper.composeRequestTO('deleteChapter',chapterId);
			console.log("deleteDataTO: "+deleteDataTO.toSource());
			global.helper.requestEditWithGetJson(deleteDataTO,global.chapter.callbackEditChapter,"DELETE CHAPTER FAILED");
		});
},
//
	bindChapterDeleteEventlistener : function() {
		
		$('#delete-chapter').click(function() {
			if(global.helper.varifyActionByUser) {

				var chapterId = $("#delete-chapter-select").val(); 
				var deleteDataTO = global.helper.composeRequestTO('deleteChapter',chapterId);
				
				global.helper.requestEditWithGetJson(deleteDataTO,global.helper.callbackDeleteOrSaveData,
					global.log.deleteChapterSuccess);
				}
			});
		
},
//
//change color and set attr "relation" on buttons which connect chapters
	bindChapterRelationButtonEventlistener : function(type) {
	
	$(".chapter-relation-button").click(function(event) {
		var relation;
		if($(this).parent("#"+type+"-chapter-parent-box").length) relation = "parent-"+type;
		else relation = "child-"+type;
		
		if($(this).hasClass('relation-chapter-button-selected')){
			$(this).removeClass('relation-chapter-button-selected');
			$(this).attr('relation','none');
		}
		else{
			$(this).addClass('relation-chapter-button-selected');
			$(this).attr('relation',relation);
		}
	});
},
//
//+++++++++++++++++++++++++++++++++++++++++++++CALLBACK
	callbackEditChapter : function(responseData,onSuccessMsg) {
			//in this callback function a second AJAX is send to save the data after deletion = update
		console.log("responseData from DeleteChapter: "+responseData.toSource());
		var saveData = global.chapter.prepareSaveChapterData('edit',responseData.key);
		var saveDataTO = global.helper.composeSaveTO('saveChapter',saveData);
		global.helper.requestEditWithGetJson(saveDataTO,global.helper.callbackDeleteOrSaveData,
			global.log.editChapterSuccess, global.log.editChapterFail);
		
},
//
	callbackSelectChapter : function(responseData, msg) {

		$("#chapter-title-edit").val(htmlDecode(responseData.name));
		$("#chapter-summary-edit").val(htmlDecode(responseData.summary));
		console.log("callbackSelectChapter data: "+responseData.toSource());
		
},
//	
	callbackSelectChapterRelation : function(responseData,msg) {

			//reset buttons first
		$(".chapter-relation-button").attr('class','chapter-relation-button btn btn-default');
		$(".chapter-relation-button").attr('relation','none');

			//now all parents different color which were found in database
		if(responseData.hasOwnProperty('parent') && responseData.parent.length) {

			$.each(responseData.parent, function(key,value) {
				console.log(value);
				$("#edit-chapter-parent-box").find("[chapterId='"+value+"']")
				.addClass('relation-chapter-button-selected').attr('relation','parent-edit');
				});
			}
			//now all children different color which were found in database
		if(responseData.hasOwnProperty('child') && responseData.child.length) {
			$.each(responseData.child, function(key,value) {
				console.log(value);
				$("#edit-chapter-child-box").find("[chapterId='"+value+"']")
				.addClass('relation-chapter-button-selected').attr('relation','child-edit');
				});
			}
},
//
	callbackGetChapterIndex : function(responseData,msg) {
		
		var options = "<option value='0'>-- select --</option>";
		var buttons = "";
		$.each( responseData, function( key, val ) {
			var option = val.name.substring(0,20);
			if(option.length >= 20) option += "..";
			options += "<option value='"+val.index+"' fullName='"+val.name+"'>" + option  + "</option>";
			buttons += "<button type='button' relation='none' \
				class='chapter-relation-button btn btn-default' chapterId='"+val.index+"'>"+option+"</button>";
		});
			//fill into all option forms		
		$(".chapter-index").html(options);
		$(".chapter-relation-box").html("<h5>Vor- und Nachgänger Kapitel verknüpfen</h5>"+buttons);
		
		global.chapterIndexResponded = true;
},
//++++++++++++++++++++++++++++++++++++++++++++WAIT
//get exectuded after index comes back for editing a chapter
	waitIndexBounces : function(chapterId) {
		
		global.chapter.selectChapter(chapterId);
		global.chapter.selectChapterRelation(chapterId);
		
		global.chapter.bindChapterEditEventlistener(chapterId);
	
},
//
//+++++++++++++++++++++++++++++++++++++++++++++MISC
	prepareSaveChapterData : function(type, currentIndex = 0) {
	
	var sendData = new Object();
	
	sendData.chapIndex = currentIndex;
		//kapitel name + summary
	sendData.chapTitle = $('#chapter-title-'+type).val();
	sendData.chapSum = $('#chapter-summary-'+type).val();
		//elter verknüpfung
	var parentList = [];
	sendData.chapParentList = [];
	$("[relation='parent-"+type+"']").each(function() {
		sendData.chapParentList.push($(this).attr('chapterId'));
		});
		//kind verknüpfung
	sendData.chapChildList = [];
	$("[relation='child-"+type+"']").each(function() {
		sendData.chapChildList.push($(this).attr('chapterId'));
		});
	console.log("Gesendete Daten für Kapitel speichern: "+sendData.toSource());
	return sendData;
},
//
	hideAndUnbindAll : function() {
		
			//hide
		$("#create-chapter-space").hide();
		$("#edit-chapter-space").hide();
		$("#delete-chapter-row").hide();
		
			//unbind
		$("#save-edited-chapter").off();
		$('#delete-chapter').off();
		$('#save-chapter').off();
		$(".chapter-relation-button").off();


}

}
