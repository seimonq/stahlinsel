<?php 
//only logged-in users are allowed
	session_start();

	if(isset($_SESSION["loggedIn"]) && $_SESSION["loggedIn"] == true) {
	//fine -> display page
	}
	else {
	//redirect to login page
		$url = "login.html";
		header('Location: '.$url);
	}
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title> Edit - Stahlinsel 0.0.1 </title>
	
	<link rel="stylesheet" type="text/css" href="../dependencies/bootstrap-3.3.7-dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="../styleScripts/style.css">
	


</head>

<body class="body">
		<!-- few basic style values-->
<div id="edit-container" class="container-fluid">
	
<!-- page banner-->
	<div class="row">
			<div class= "col-md-2 banner">
					<h2>STAHLINSEL</h2>
					<hr style="border-color:black;"></hr>
					<a href="index.html" class="btn btn-custom" role="button">Hauptmenu</a></br></br>
			</div>	
			<div id="imgBox" class="col-md-8 nopadding"><img src="../pictures/header2.png" width="100%"></div>
			<div class="banner col-md-2">
				<span id="display-operation-mode">#def: display-operation-mode</span>
				<hr style="border-color:black;"></hr>
				<button type="button" id="switch-operation-mode" class="btn btn-custom margin-bottom"> #default: switch-operation-mode </button>
				<button type="button" id="display-graph" class="btn btn-custom">#default: display-graph</button>
			</div>
	</div>

<!-- menu for chapter -->
	<div id="menu-chapter" class="row margin-bottom">
			<div class="col-md-2">
			</div>
			<div class="chapter-menu-box col-md-5">
				<form class="form-inline">
					<select id="chapter-selector" class="chapter-index form-control">
						<option>#default: chapter-index</option>
					</select>
				</form>
			</div>
			<div class="chapter-menu-box-right col-md-3">
					<button type="button" id="menu-create-chapter" class="btn btn-custom">Erstelle neues Kapitel</button>
					<button type="button" id="menu-delete-chapter" class="btn btn-custom-danger">Lösche Kapitel</button>
			</div>
			<div class="col-md-2"></div>
	</div>

<!-- menu for node -->
	<div id="menu-node" class="row margin-bottom">
			<div class="col-md-2">
			</div>
			<div class="node-menu-box col-md-3">
				<form class="form-inline">
					<select id="chapter-selector-for-nodes" class="chapter-index form-control">
						<option>#default: node-index</option>
					</select>
					<select id="node-selector" class="node-index form-control">
						<option>#default: node-index</option>
					</select>
				</form>
			</div>
			<div class="node-menu-box-right col-md-5">
					<button type="button" id="menu-crud-state" class="btn btn-custom">Bearbeite Items</button>
					<button type="button" id="menu-create-node" class="btn btn-custom">Erstelle neuen Knoten</button>
					<button type="button" id="menu-delete-node" class="btn btn-custom-danger">Lösche Knoten</button>
			</div>
			<div class="col-md-2">
				Aktuell gewähltes Kapitel: <br> 
				<span id="current-chapter"> Kein Kapitel gewählt</span>
			</div>
	</div>	
<!-- kapitel ########################################################### -->
<!-- kapitel erstellen -->  
	<div id="create-chapter-space">
	<div class="row margin-bottom">
		<div class="col-md-2"></div>
		<div id="create-chapter-parent-box" class="col-md-8 chapter-relation-box">
			<h3>Vorgängerkapitel auswählen</h3>
		</div>
		<div class="col-md-2"></div>
	</div>
	
	<div class="row margin-bottom">
			<div class="col-md-2"></div>
			<div id="create-chapter-box" class="col-md-8">
				<h2>Erstelle ein neues Kapitel </h2>
					Kapitelname<br>
					<input id="chapter-title-create" type="text" placeholder="Kapitelname"><br>
					Zusammenfassung<br>
					<textarea id="chapter-summary-create" placeholder="Beschreibung" cols="50" rows="4"></textarea><br>
					<input id="save-chapter" type="button" value="Kapitel anlegen" class="btn btn-custom">
			</div>
			<div class="col-md-2"></div>
	</div>

	<div class="row margin-bottom">
		<div class="col-md-2"></div>
		<div id="create-chapter-child-box" class="col-md-8 chapter-relation-box">
			<h3>Folgekapitel auswählen</h3>
		</div>
		<div class="col-md-2"></div>
	</div>
	</div>
	
<!-- kapitel bearbeiten -->
	<div id="edit-chapter-space">
	<div class="row margin-bottom">
		<div class="col-md-2"></div>
		<div id="edit-chapter-parent-box" class="col-md-8 chapter-relation-box">
			<h3>Vorgängerkapitel auswählen</h3>
		</div>
		<div class="col-md-2"></div>
	</div>
	
	<div class="row margin-bottom">
			<div class="col-md-2"></div>
			<div id="edit-chapter-box" class="col-md-8">
				<h2>Bearbeite Kapitel </h2>
					Kapitelname<br>
					<input id="chapter-title-edit" type="text" placeholder="Kapitelname"><br>
					Zusammenfassung<br>
					<textarea id="chapter-summary-edit" placeholder="Beschreibung" cols="50" rows="4"></textarea><br>
					<input id="save-edited-chapter" type="button" value="Kapitel ändern" class="btn btn-custom">
			</div>
			<div class="col-md-2"></div>
	</div>

	<div class="row margin-bottom">
		<div class="col-md-2"></div>
		<div id="edit-chapter-child-box" class="col-md-8 chapter-relation-box">
			<h3>Folgekapitel auswählen</h3>
		</div>
		<div class="col-md-2"></div>
	</div>
	</div>

<!-- kapitel löschen -->
	<div id="delete-chapter-row" class="row margin-bottom">
			<div class="col-md-2"></div>
			<div id="delete-chapter-box" class="col-md-8">
				<h2>Lösche ein Kapitel </h2>
				<form class="form-inline">
					<select id="delete-chapter-select" class="chapter-index form-control">
					<option>#def: delete-chapter-select</option>

					</select>
					<button type="button" id="delete-chapter" class="btn btn-custom-danger">Löschen</button>
				</form>
			</div>
			<div class="col-md-2"></div>
	</div>

	
<!-- knoten bearbeiten/erstellen ###########################################################  -->
<!-- knoten schreiben -->
	<div id="create-node-space">
	<div class="row margin-bottom">
		<div class="col-md-2"></div>
		<div id="create-node-parent-box" class="col-md-8 node-relation-box">
			<h3>Vorgängerknoten auswählen</h3>
				<form class="form-inline">
					<b> Knoten auswählen </b>
					<select id="create-node-parent-select" class="node-index form-control">
						<option>#def: delete-chapter-select</option>
					</select></br>
				<div id="create-node-parent-form"></div>
				</form>
		</div>
		<div class="col-md-2"></div>
	</div>	
	<div class="row margin-bottom">
			<div class="col-md-2"></div>
			<div id="create-node-box" class="col-md-5">
				<h2>Erstelle einen neuen Knoten </h2>
					<input id="create-node-name" type="text" placeholder="Knoten Name" width="45"><br><br>
					<textarea id="create-node-text" cols="50" rows="5">Text</textarea>
						<!-- state an knoten legen -->

					<input id="create-save-node" type="button" value="Knoten anlegen" class="btn btn-custom btn-lg">
				</form>
			</div>
			<div id="create-node-state-box" class="col-md-3">
					<form class="form-inline">
						Wähle erhältenes Item: 
						<select id="create-state-node-relation-select" class="state-index form-control">
							<option value="0"> #def: state-index</option>
						</select>
						<div id="create-node-state-relation-container"></div>
						<input id="create-delete-state-node-relation-button" type="button" value="Alle Bedingungen löschen" class="btn btn-custom-danger btn-xs"><br><br>
					</form>
			</div>
			<div class="col-md-2"></div>
	</div>
	</div>

<!-- knoten bearbeiten -->
	<div id="edit-node-space">
		<!-- append parent nodes -->
	<div class="row margin-bottom">
		<div class="col-md-2"></div>
		<div id="edit-node-parent-box" class="col-md-8 node-relation-box">
			<h3>Vorgänger auswählen</h3>
				<form class="form-inline">
					<b> Knoten auswählen </b>
					<select id="edit-node-parent-select" class="node-index form-control">
						<option>#def: delete-chapter-select</option>
					</select></br>
				<div id="edit-node-parent-form"></div>
				</form>
		</div>
		<div class="col-md-2"></div>
	</div>
		<!-- focused node currently -->
	<div class="row margin-bottom">
			<div class="col-md-2"></div>
			<div id="edit-node-box" class="col-md-5">
				<h2>Bearbeite Knoten </h2>
					<input id="edit-node-index" type="hidden" value="">
					<input id="edit-node-chapter" type="hidden" value="">
					
					<input id="edit-node-name" type="text" placeholder="Knoten Name" width="45"><br><br>
					<textarea id="edit-node-text" cols="50" rows="5" placeholder="Gebe den Text für den Knoten hier ein">	</textarea>
					<input id="edit-save-node" type="button" value="Knoten ändern" class="btn btn-custom btn-lg">
				</form>
			</div>
			<!-- state an knoten legen -->
			<div id="edit-node-state-box" class="col-md-3">
					<form class="form-inline">
						Wähle erhaltenes Item: 
						<select id="edit-state-node-relation-select" class="state-index form-control">
							<option value="0"> #def: state-index</option>
						</select>
						<div id="edit-node-state-relation-container"></div>
						<input id="edit-delete-state-node-relation-button" type="button" value="Alle Bedingungen löschen" class="btn btn-custom-danger btn-xs"><br><br>
					</form>
			
			</div>
			<div class="col-md-2"></div>
	</div>
		<!-- append child nodes -->
	<div class="row margin-bottom">
		<div class="col-md-2"></div>
		<div id="edit-node-child-box" class="col-md-8 node-relation-box">
			<h3>Folgeknoten auswählen</h3>
				<form class="form-inline">
					<b> Knoten auswählen </b>
					<select id="edit-node-child-select" class="node-index form-control">
						<option>#def: delete-chapter-select</option>
					</select></br>
				<div id="edit-node-child-form"></div>
				</form>
		</div>
		<div class="col-md-2"></div>
	</div>
	
<!-- knoten löschen --> 
	<div id="delete-node-row" class="row margin-bottom">
			<div class="col-md-2"></div>
			<div id="delete-node-box" class="col-md-8">
				<h2>Lösche ein Kapitel </h2>
				<form class="form-inline">
					<select id="delete-node-select" class="node-index form-control">
					<option>#def: delete-chapter-select</option>

					</select>
					<button type="button" id="delete-node" class="btn btn-custom-danger">Löschen</button>
				</form>
			</div>
			<div class="col-md-2"></div>
	</div>
	</div>
<!-- state erstellen -->
	<div id="crud-state-space">
	<div class="row margin-bottom">
			<div class="col-md-2"></div>
			<div id="crud-state-box" class="col-md-8">
				<h3> Ein Item bearbeiten </h3>
				<form class="form-inline">
				<select id="edit-state-select" class="state-index form-control">
					<option> #def state-index </option>
				</select>
				<input id="edit-state-button" type="button" class="btn btn-custom" value="Bearbeiten">
				<input id="delete-state-button" type="button" class="btn btn-custom-danger" value="Löschen">
				
				</form>
				<br>------------------------------------------<br>
				<br>
				<h3>Erstelle ein neues Item </h3>
				<i> Ein Item kann eine Information, ein Gegenstand oder ein Zustand des Characters 
					oder von etwas anderem sein, dass den weiteren Verlauf der Geschichte beeinflusst.</i>
					<br><input id="create-state-name" type="text" placeholder="Name des Items" width="50">
					<form class="form-inline">
						Typ des Items: 
						<select id="create-state-type-select" class="form-control">
							<option> Information </option>
							<option> Gegenstand  </option>
							<option> Zustand     </option>
						</select>
					</form>
					<input id="save-state-button" type="button" value="Item anlegen" class="btn btn-custom">
					<br><br> Die Verknüpfung des Items mit den Erzählknoten kann direkt bei der Erstellung der Knoten erfolgen.
			</div>
			<div class="col-md-2"></div>
	</div>
	</div>
	
	
<!-- sonstige  ########################################################### -->
	
	<div id="graphic-space">
		<div class="play-banner col-md-2" id="svg-con">
			&nbsp;&nbsp;
			<button type="button" id="next-foto" class="btn btn-custom" onclick="nextFoto()">nächster</button><div style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;</div>
			<button type="button" id="hide-album" class="btn btn-custom" onclick="hideAlbum()">aus</button><div style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;</div>
			<div id="banner-info"></div>
		</div>
		<div id="svg-div">
			<svg id="svg-graph-box" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" 
		</div>
	</div>
	
	
<!-- default row template -->
	<div class="row margin-bottom">
		<div class="col-md-2"></div>
		<div class="col-md-8"></div>
		<div class="col-md-2"></div>
	</div>
	
</div>

	<script src="../dependencies/jquery-3.1.0.min.js"></script>

	<script src="../clientScripts/helperClass.js"></script> 
	<script src="../clientScripts/chapterClass.js"></script> 
	<script src="../clientScripts/check.js"></script> 
	<script src="../clientScripts/nodeClass.js"></script> 
	<script src="../clientScripts/stateClass.js"></script> 
	
	<script src="../clientScripts/graphClass.js"></script> 
	<script src="../clientScripts/graf/graf.js"></script> 
	<script src="../clientScripts/graf/fotoGraf.js"></script> 
	<script src="../clientScripts/graf/pfeil.js"></script> 
	<script src="../clientScripts/graf/fotoBeLane.js"></script> 
	<script src="../clientScripts/graf/fotobeOdd.js"></script> 
	<script src="../clientScripts/graf/fotoControl.js"></script> 
	<script src="../clientScripts/graf/node.js"></script> 
	<script src="../clientScripts/graf/kante.js"></script> 
	
	<script src="../clientScripts/logClass.js"></script>
	<script src="../clientScripts/edit.js"></script>
</body>
</html>
