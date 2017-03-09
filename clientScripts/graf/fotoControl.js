function nextFoto(){
	
	fotoGraf.ie++;
	
	if(fotoGraf.ieN>0){
		
		if(fotoGraf.ie>=fotoGraf.ieN) fotoGraf.ie=0;
		$('#next-foto').html('fotoGraf.ie: '+(fotoGraf.ie+1)+' / '+fotoGraf.ieN+' -> '+((fotoGraf.ie+1)<fotoGraf.ieN?(fotoGraf.ie+2):1));
		
		$('#banner-info').html(
			' Anzahl Knoten: '+fotoGraf.album[fotoGraf.ie].nNot
			+', Anzahl Kanten: '+fotoGraf.album[fotoGraf.ie].nKant
			+', Anzahl Ebenen: '+fotoGraf.album[fotoGraf.ie].nLev
			+', Max Breite: '+fotoGraf.album[fotoGraf.ie].nCols
			+', Root Knoten: '+graf.ic[fotoGraf.ie].nRoot
			+', End Knoten: '+graf.ic[fotoGraf.ie].nBoot
			+'<br> (farb palette aufgeräumt, noch kein daten check, "NN" = ohne Knoten) '
			);	
		$('#svg-div').html(fotoGraf.album[fotoGraf.ie].tab);

	}
	else{
		$('#banner-info').html(' keine Knoten vorhanden s. NN ');
		$('#next-foto').html(" falsches Kapitel ");
	}
	
}

function hideAlbum(){
		//hide
	$("#graphic-space").hide();
	$("#svg-graph-box").hide();

		//unbind
	$("#graphic-space").off();
}
