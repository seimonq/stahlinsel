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
	<title> Demo Play - Stahlinsel 0.0.1 </title>

	<link rel="stylesheet" type="text/css" href="../dependencies/bootstrap-3.3.7-dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="../styleScripts/style.css">
</head>

<body class="body">
<div class="container-fluid">
	<!-- row -->
	<div class="row margin-bottom">
			<div class="banner col-md-2">
				<h2>STAHLINSEL</h2>
				<a href="index.html" class="btn btn-custom" role="button">Hauptmenu</a>
			</div>
			<div class="col-md-8 nopadding"><img src="../pictures/header2.png" width="100%"></div>
			<div class="banner col-md-2">
				<h2>DEMO PLAY</h2>
				<br><br>
				Aktuell gewähltes Kapitel: <br> 
				<span id="current-chapter"> Kein Kapitel gewählt</span>
			</div>
	</div>
	<!-- row -->
	<div class="row margin-bottom">
			<div class="col-md-2"></div>
			<div class="col-md-8">

				<form class="form-inline">
					Spiele von hier: 
					<select id="select-play-chapter" class="form-control chapter-index">
						<option> #def: Kapitel-Wahl </option>
					</select>
					<select id="select-play-node-by-chapter" class="form-control node-index" id="knoten_liste" >
						<option> #def: Kapitel-Wahl </option>
					</select>
				</form>
			</div>
			<div class="col-md-2"></div>
	</div>
	<!-- parent row -->
	<div class="row margin-bottom">
		<div class="col-md-2" >
			<span class='info-heading'> Bedingungen: </span><br>
			<div id="parent-node-info-box">
				#def: Zusatz-Info Vorgängerknoten 
			</div>
		</div>
		<div class="col-md-8" id="parent-node-box">
				<button type="button" id="node-id" class="margin-bottom btn btn-custom">#def: Teaser to Click</button>
		</div>
		<div class="col-md-2"></div>
	</div>
	
	<!-- focused row -->
	<div class="row margin-bottom">
		<div class="col-md-2" >
			<span class='info-heading'> Erhaltene Items: </span><br>
			<div id="focused-node-info-box">
				#def: Zusatz-Info ausgewählter Knoten 
			</div>
		</div>
		<div class="text-container col-md-8" id="focused-node-box">
			#def: Knoten-Text
		</div>
		<div class="col-md-2"><img src="../pictures/arbeiter.jpg" height="100%" width="100%"></div>
	</div>	
	
	<!-- child row -->
	<div class="row margin-bottom">
		<div class="col-md-2" >
			<span class='info-heading'> Bedingungen: </span><br>
			<div id="child-node-info-box">
				#def: Zusatz-Info Folgeknoten 
			</div>
		</div>
		<div class="col-md-8" id="child-node-box">
				<button type="button" id="node-id" class="margin-bottom btn btn-custom">#def: Teaser to Click</button>
		</div>
		<div class="col-md-2"></div>
	</div>
</div>

	<script src="../dependencies/jquery-3.1.0.min.js"></script>
	
	<script src="../clientScripts/helperClass.js"></script> 
	<script src="../clientScripts/chapterClass.js"></script> 
	<script src="../clientScripts/nodeClass.js"></script> 
	<script src="../clientScripts/stateClass.js"></script> 
	<script src="../clientScripts/graphClass.js"></script> 

	<script src="../clientScripts/logClass.js"></script>
	<script src="../clientScripts/play.js"></script> 

</body>
</html>
