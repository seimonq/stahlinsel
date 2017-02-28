//	'inner' class für graf.construct pfeil

function pfeil(farbe,rot,xOben,yOben,xUnten,yUnten,xRechts,yRechts,xLinks,yLinks,levO,levU){
	
	this.farbe=farbe; //		knoten.von.key -> show 
	this.rot=rot;	//			rotation rechts= - , links = +
	this.xOben=xOben; //		schaft
	this.yOben=yOben;
	this.xUnten=xUnten;
	this.yUnten=yUnten
	this.xRechts=xRechts; //	spitze
	this.yRechts=yRechts;
	this.xLinks=xLinks;
	this.yLinks=yLinks;
	this.levO=levO;	//			level
	this.levU=levU;
	
	this.h0=-1;	//				beOdd norm heigt-0 		none
	this.plusX=0;	// 			beLane, beOdd, x-shift	none
	this.plusY=0;	// 			beLane, beOdd, x-shift	none
}

