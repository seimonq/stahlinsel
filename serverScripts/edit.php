<?php 

header('Content-type: text/plain; charset=utf-8');

include('model.php');
ini_set("error_reporting", E_ALL);
ini_set("display_errors",1);

class edit {
	
	function __construct($req = "",$data = array()) {

			//chapters
		if     ($req == "selectChapterIndex") $this->response = $this->selectIndex("Chapter");
		elseif ($req == "selectChapter") $this->response = $this->selectChapter($data);
		elseif ($req == "selectChapterRelation") $this->response = $this->selectChapterRelation($data);
		elseif ($req == "saveChapter") $this->response = $this->saveChapter($data);
		elseif ($req == "deleteChapter") $this->response = $this->deleteChapter($data);
			//nodes
		elseif ($req == "selectNode") $this->response = $this->selectNode($data);
		elseif ($req == "selectNodeIndexByChapter") $this->response = $this->selectIndex("Node",$data["key"]);
		elseif ($req == "saveNode") $this->response = $this->saveNode($data);
		elseif ($req == "deleteNode") $this->response = $this->deleteNode($data);
			//states		
		elseif ($req == "saveState") $this->response = $this->saveState($data);
		elseif ($req == "selectStateIndex") $this->response = $this->selectIndex("State");
		elseif ($req == "selectState") $this->response = $this->selectState($data);
		elseif ($req == "deleteState") $this->response = $this->deleteState($data);
			//graf
		elseif ($req == "showChapterGraph") $this->response= $this->showChapterGraf();
		elseif ($req == "showNodeGraph") $this->response = $this->showNodeGraf($data);
		else { 			
			$this->response = "The following request: ".$req." failed, dude.";
			}
		}
	
//************************************************************************************************************************
//chapter methods	
	private function selectIndex($type,$chapKey = "") {


		if($type == "Chapter") $sql = "SELECT `index`, `name` FROM `chapter`";
		elseif($type == "Node") $sql = "SELECT `index`, `text`, `name` FROM storynode WHERE `chapter` = ".$chapKey;
		elseif($type == "State") $sql = "SELECT `index`, `name` FROM `state`";
		$db = new model();
		
		return $db->selectArray($sql);
	}
	
	private function selectChapter($data = array()) {
		$sql = "SELECT * FROM `chapter` WHERE `index` = ".$data["key"];
		
		$db = new model();
		return $db->selectSingle($sql);
		} 
	
	private function selectChapterRelation($data = array()) {
		$returnData = array();
		$db = new model();

		$sql = "SELECT `child_id` FROM `chapter_edges` WHERE `parent_id` = ".$data["key"];
		$childList = $db->selectArray($sql);
		$sql = "SELECT `parent_id` FROM `chapter_edges` WHERE `child_id` = ".$data["key"];
		$parentList = $db->selectArray($sql);

		if(!empty($childList)) {	
		foreach( $childList as $key => $value) {
			$returnData["child"][$key] = $value["child_id"];
		}}
		if(!empty($parentList)) {	
		foreach( $parentList as $key => $value) {
			$returnData["parent"][$key] = $value["parent_id"];
		}}
		if(empty($returnData)) return "No chapter Relations were found";
		else return $returnData;
	} 
	
	private function saveChapter($data = array()) {
			//input chapter
		
		$chapterTitle = $this->cleanStringInputData($data["chapTitle"],ENT_QUOTES, true);
		$chapterSummary = $this->cleanStringInputData($data["chapSum"],ENT_QUOTES, false);
			
			//when a chapter gets updated - just use the old index and do not generate new
		if($data["chapIndex"] != 0) {
			$chapterIndex = $data["chapIndex"];
			
			$sql = "chapter (`index`,`name`, `summary`, `owner`)
						VALUES (".$chapterIndex.",'".$chapterTitle."','".$chapterSummary."','Donald Traum')";
			$db = new model();
			$db->save($sql);		

			$chapterId = $chapterIndex;
		}
			//generate new index
		else {
			$sql = "chapter (`name`, `summary`, `owner`)
				VALUES ('".$chapterTitle."','".$chapterSummary."','arsch')";
			$db = new model();
			$db->save($sql);		
			//get index of created chapter
			$sql = "SELECT  max(`index`) as `index` FROM chapter";
			$max = $db->selectSingle($sql);
			$chapterId = $max['index'];
		}
		
			//input chapter relations
		foreach ( $data["chapParentList"] as $value ) {
			$sql = "chapter_edges (`parent_id`,`child_id`) VALUES (".$value.",".$chapterId.")";
			$db->save($sql);
		}
		foreach ( $data["chapChildList"] as $value ) {
			$sql = "chapter_edges (`parent_id`,`child_id`) VALUES (".$chapterId.",".$value.")";
			$db->save($sql);
		}
		return "Chapter with all relations saved";	
	}
	
	private function deleteChapter($data = array()) {
		$db = new model();
		
		$sql = "chapter WHERE `index` = ".$data["key"];
		$db->delete($sql);		

		$sql = "chapter_edges WHERE `parent_id` = ".$data["key"];
		$db->delete($sql);		
		
		$sql = "chapter_edges WHERE `child_id` = ".$data["key"];
		$db->delete($sql);		
		
		$response = array();
		$response["msg"] = "Chapter and all relations with ID".$data["key"]." deleted";
		$response["key"] = $data["key"]; 
		return $response;
	}
//*****************************************************************************************************************
// node methods	
	private function selectNode($data = array()) {
		$db = new model();
		$stateIds = [];
		$stateList = [];
		
		$nodeId = $data["key"];	
		$sql = "SELECT * FROM storynode WHERE `index` = ".$nodeId;
		$nodeData = $db->selectSingle($sql);
		
			
		//nodeData -> states
		$sql = "SELECT `state_id` FROM state_node_relation WHERE `node_id`= ".$nodeId;
		$stateIds = $db->selectArray($sql);


		if(!empty($stateIds)) {
		foreach( $stateIds as $key => $value) {
			$sql = "SELECT `index`,`name` FROM state WHERE `index` = ".$value["state_id"];
			array_push($stateList,$db->selectArray($sql));
		}}

		$nodeData["states"] = $stateList;
		
		//nodeParent
		$sql = "SELECT * FROM node_edges WHERE `child_id` = ".$nodeId;
		$parentList = $db->selectArray($sql);
		
		if(!empty($parentList)) {
		foreach ($parentList as $key => $nodeedge) {
				$parentList[$key]["stateNodeedges"] = $this->selectStateByNodeedge($nodeedge["index"]); 
			}
		$nodeData["parentList"] = $parentList;
		}

		//nodeChild
		$sql = "SELECT * FROM node_edges WHERE `parent_id` = ".$nodeId;
		$childList = $db->selectArray($sql);
		
		if(!empty($childList)) {
		foreach ($childList as $key => $nodeedge) {
				$childList[$key]["stateNodeedges"] = $this->selectStateByNodeedge($nodeedge["index"]); 
			}
		$nodeData["childList"] = $childList;
		}	
		
		return $nodeData;

	} 
	
	private function selectStateByNodeedge($nodeedgeId) {
	
	$db = new model();
	$sql = "SELECT `index`,`state_id` FROM state_nodeedge_relation WHERE `nodeedge_id` = ".$nodeedgeId;
	$stateNodeedgeData = $db->selectArray($sql);
	if(!empty($stateNodeedgeData)) {
		foreach($stateNodeedgeData as $key => $value) {
			$sql = "SELECT `name` FROM state WHERE `index` = ".$value["state_id"];
			$stateInfo = $db->selectSingle($sql);
			$stateNodeedgeData[$key]["name"] = $stateInfo["name"]; 
		}}
	return $stateNodeedgeData;
	}
	
	private function saveNode($data = array()) {

		$name = $this->cleanStringInputData($data["nodeName"],true);
			//avoid spaces
		$name = preg_replace('/\s+/','_',$name);
		
		$nodeText = $this->cleanStringInputData($data["nodeText"],false);
		
		$sql = "storynode (`name`, `text`, `chapter`, `owner`)
					VALUES ('".$name ."','".
					$nodeText."',".$data["chapterId"].",'Donald Trump')";
		$db = new model();
		$db->save($sql);		
		
			//get index of created node
		$sql = "SELECT  max(`index`) as `index` FROM storynode";
		$max = $db->selectSingle($sql);
		$nodeId = $max['index'];
		

			//input chapter relations parents
		foreach ( $data["nodeParentRelationList"] as $value ) {
			
			$teaser = $this->cleanStringInputData($value["teaser"],false);	

			$sql = "node_edges (`parent_id`,`child_id`, `teaser`) VALUES (".$value["dbIndex"].",".
						$nodeId.",'".$teaser."')";
			$db->save($sql);

					//get index of created nodeedge
			$sql = "SELECT  max(`index`) as `index` FROM `node_edges`";
			$max = $db->selectSingle($sql);
			$nodeEdgeId = $max['index'];
			
				//input state nodeedge relations
			foreach( $value["stateList"] as $state) {
				$sql = "state_nodeedge_relation (`state_id`,`nodeedge_id`) VALUES (".$state.",".$nodeEdgeId.")";
				$db->save($sql);
				}
		}
		
			//input chapter relations children
		foreach ( $data["nodeChildRelationList"] as $value ) {
			
			$teaser = $this->cleanStringInputData($value["teaser"],false);	

			$sql = "node_edges (`parent_id`,`child_id`, `teaser`) VALUES (".$nodeId.",".
						$value["dbIndex"].",'".$teaser."')";
			$db->save($sql);

					//get index of created nodeedge
			$sql = "SELECT  max(`index`) as `index` FROM `node_edges`";
			$max = $db->selectSingle($sql);
			$nodeEdgeId = $max['index'];
			
			
				//input state nodeedge relations
			foreach( $value["stateList"] as $state) {
				$sql = "state_nodeedge_relation (`state_id`,`nodeedge_id`) VALUES (".$state.",".$nodeEdgeId.")";
				$db->save($sql);
				}
		}
		
			//input node state relation
		foreach ($data["stateNodeRelation"] as $state) {
			$sql = "state_node_relation (`state_id`,`node_id`) VALUES (".$state.",".$nodeId.")";
			$db->save($sql);
		}

		return "Node with all relations saved";	
	}
	
	private function deleteNode($data = array()) {
		$db = new model();
		
		$sql = "storynode WHERE `index` = ".$data["key"];
		$db->delete($sql);		
		
			//states related to node
		$sql = "state_node_relation WHERE `node_id` =".$data["key"];
		$db->delete($sql);		
		
			//states related to nodeedges
		$sql = "SELECT `index` FROM node_edges WHERE `parent_id` = ".$data["key"]." OR `child_id` = ".$data["key"];
		$nodeedgeIds = $db->selectArray($sql);	
		
		if(!empty($nodeedgeIds)) {
		foreach($nodeedgeIds as $key => $value) {
				//all state-nodeedge relations
			$sql = "state_nodeedge_relation WHERE `nodeedge_id` = ".$value["index"];
			$db->delete($sql);

				//the nodeedge itself
			$sql = "node_edges WHERE `index` = ".$value["index"];
			$db->delete($sql);
			}}
		return "Node and all relations with ID".$data["key"]." deleted";
	}
//*****************************************************************************************************************
// state methods
	private function saveState($data = array()) {
		
		$stateName = $this->cleanStringInputData($data["stateName"],true);
		$stateType = $this->cleanStringInputData($data["stateType"],true);
		
		$db = new model();
		$sql = "SELECT `name` FROM state WHERE `name` = '".$stateName."'";
		if(!empty($db->selectSingle($sql))) {
			$sql = "state SET `type` = '".$stateType."' WHERE `name` = '".$stateName."'";
			return $db->update($sql);
			}
		else {
			$sql = "state (`name`,`type`) VALUES ('".$stateName."','".$stateType."')";
			return $db->save($sql);
		}
		
	}
	private function selectState($data = array()) {

		$sql = "SELECT `name`, `type` FROM `state` WHERE `index` = ".$data["key"]; 
		$db = new model();
		return $db->selectSingle($sql);
		
	}
	private function deleteState($data = array()) {
		$db = new model();
		
		$sql = "state WHERE `index` = ".$data["key"];
		$db->delete($sql);		

		$sql = "state_node_relation WHERE `state_id` = ".$data["key"];
		$db->delete($sql);		
		
		$sql = "state_nodeedge_relation WHERE `state_id` = ".$data["key"];
		$db->delete($sql);		

		return "State and all relations with ID".$data["key"]." deleted";
		
		}
//******************************************************************************************************************
//graf method

	private function showChapterGraf(){
		
		$returnData=array();
					
		$sql = "SELECT * FROM `chapter` ";
		$db = new model();
		$returnData["dots"] = $db->selectArray($sql);

		$sql = "SELECT * FROM `chapter_edges` ";
		$returnData["edges"] = $db->selectArray($sql); 		

		return $returnData;

	}
	private function showNodeGraf($data = array()) {
		
		
		$returnData=array();
		$dots  = [];
		$edges = [];

		$sql = "SELECT * FROM `storynode` WHERE chapter = ".$data["key"];
		$db = new model();
		$dots=$db->selectArray($sql);
		

		foreach ($dots as $item) {
			
			$sql = "SELECT * FROM `node_edges` WHERE child_id = ".$item["index"]." || parent_id = ".$item["index"];
			$db = new model();
			foreach ($db->selectArray($sql) as $receivedItem) {
				array_push($edges,$receivedItem);
			}
		}
	
		$returnData["dots"] =$dots;
		$returnData["edges"]=$edges;
		
		return $returnData;	
		
	}
//******************************************************************************************************************
// common methods
	private function cleanStringInputData($string,$deleteSpecialChar) {
	
	$string = htmlspecialchars($string,ENT_QUOTES);
	
	if($deleteSpecialChar)
		$string = preg_replace("/&#?[a-z0-9]+;/i","",$string);
	
	return $string; 
	}
}

//main space -- will be executed on startup -------------------------------------------------------------------
$params = json_decode($_REQUEST["data"], TRUE);

if(array_key_exists('payload',$params)) {
	$do = new edit($params["req"],$params["payload"]);
	}
else { 
	$do = new edit($params["req"]); 
	}

echo json_encode($do->response, JSON_UNESCAPED_UNICODE);


//  useful for debugging
//	exit(json_encode("pinged"));

?>
