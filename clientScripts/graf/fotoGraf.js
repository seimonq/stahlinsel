class fotoGraf{ 	//		build mit unNoeti u. unTaten

//	fotoGraf.ie;
//	fotoGraf.ieN;
// 	fotoGraf.pal;
//	fotoGraf.palSize;
//	fotoGraf.album;
//	fotoGraf.run;

static ieren(){
	
	fotoGraf.pal=new Array('crimson','chartreuse','darkred','gold','fuchsia'
				,'greenyellow','indigo','deeppink','lawngreen','navy'
				,'red','yellow','green','pink','orangered'
				,'darkblue','springgreen','black','lightcoral','deepskyblue');
	fotoGraf.palSize=fotoGraf.pal.length;

	
	fotoGraf.ieN=graf.N;
	fotoGraf.album=[fotoGraf.ieN];
	for(fotoGraf.ie=0;fotoGraf.ie<fotoGraf.ieN;fotoGraf.ie++)
		fotoGraf.album[fotoGraf.ie]=new fotoGraf();
	fotoGraf.ie=-2;
	fotoGraf.run=0;

}

	constructor(){		//			======================================================================
		
		var curCol; //		view graf
		var curKante; //

		var	x0; 	//		linker circle mitte
		var xE;		//		rechter
		var x1;		//		oben
		var y1;
		var x2;		//		unten
		var y2;
		var x3;		//		unten pereferie
		var y3;
		var cx;		//		circle
		var cy;
		var pfLen; 	//		pfeil länge mitte circle.von .. mitte circle.nach
		var pfRot; 	//		rotation vom lot aus
		var pfX; 	//		dx mitte circle.von .. mitte circle.nach
		var pfY; 	//		dy
		var perX; 	//		dx pereferie.nach .. circle mitte.nach
		var perY; 	//		dy
		var pfSin; 	//		aux sin
		var pfCos; 	//			cos
		var gamma;	//		aux
		var	delta;	
		var beta;
		var l1;		//		dx pfeilspitze oben senkrecht
		var h1		//		dy
		var hy;
		var l2;		//		dx pfeilspitze rechts oben
		var	h2;		//		dy
		var l3;		//		dx pfeilspitze links oben
		var	h3;		//		dy
		var width;	//		innerWidth linker knoten .. rechter knoten
		var farbe; 	//		knoten u pfeil farbe
		var r;		//		knoten-clircle radius
		var stroke;	//		rand u pfeil dicke
		var padd;	//		padding links u rechts im svg
		var pfeile;	//		pfeile als obj für laning
		var rechtsRuck; //	beLane(lote) u beOdd(odds) ermitteln pfeil.plus
		var abSack; //		beLane(lote) u beOdd(odds) ermitteln pfeil.plus
		//					für svg.pfeil.x(px)+rechtsRuck(px)
		
		var jack=graf.ic[fotoGraf.ie];
		this.ord=fotoGraf.ie;
		this.id=jack.id;
		
		var realVon;
		var realNach;
		var curLev;
		var curNode;
		
		this.tab;	//		svg
		this.width;	//		svg.width
		this.height;
		this.nCols=jack.nCols;
		this.nLev=jack.nLev;
		this.nKant=jack.nKant;
		this.nNot=jack.nNot;
		
//	Weite fix Bildschirmbreite könnte nach nCols verbreitert werden
//	wie Tiefe (nach nLev)		
		this.width=document.body.clientWidth*0.95;
		r=0.078125*this.width;	//			80 v 1024 px
		stroke=0.0048828125*this.width;;	//		5 px	
		padd=r/6;
		x0=r+padd;
		xE=this.width-x0;
		width=this.width-2*r-2*padd;
		this.height=this.width/3.5*this.nLev;
		
		this.tab='<svg id="svg-graph-box" style="width:'+this.width
				+'px;height:'+this.height
				+'px;background-color:#0ff;" xmlns="http://www.w3.org/2000/svg" >';
				  
		for(curCol=0;curCol<this.nCols;curCol++){ //										grid x für this.nCols (max Col)
			x1=(this.nCols==1?0.5:curCol/(this.nCols-1))*width+x0; x2=x1;
			y1=0;y2=this.height;
			this.tab+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2
						+'" style="stroke:#00f;stroke-width:2;stroke-dasharray:2;"/>';
		}					
		for(curLev=0;curLev<this.nLev;curLev++){
				x1=0;x2=this.width;y1=(curLev+1)/(this.nLev+1)*this.height;y2=y1;
				this.tab+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'
				+y2+'" style="stroke:#00f;stroke-width:2;stroke-dasharray:2;"/>';
		}
		
		
		pfeile=[this.nKant]; //																pfeile grundform obj
		h1=30; l1=10; hy=Math.sqrt(h1*h1+l1*l1); //											pfeilspitzen länge als hypotenuse dx dy
		
		for(curKante=0;curKante<this.nKant;curKante++){
			
			realVon=graf.knoten[jack.kant[curKante].parent_id];
			realNach=graf.knoten[jack.kant[curKante].child_id];
			
			x1=realVon.x*width+x0;//						kanten xy
			y1=realVon.y*this.height;
			x2=realNach.x*width+x0;
			y2=realNach.y*this.height;

			
			pfX=x1-x2; pfY=y1-y2;
			pfLen=Math.sqrt(pfX*pfX+pfY*pfY); // 			pfeil länge
			pfSin=pfX/pfLen; pfCos=pfY/pfLen;
			pfRot=Math.asin(pfSin)/Math.PI*180;
			perX=(r+stroke)*pfSin; perY=(r+stroke)*pfCos;
			x3=x2+perX; y3=y2+perY; // pereferie xy
			
			beta=Math.asin(l1/hy)/Math.PI*180;
			gamma=90+beta-pfRot;
			h2=Math.sin(gamma/180*Math.PI)*hy;
			l2=Math.cos(gamma/180*Math.PI)*hy;
			delta=90-beta-pfRot;
			h3=Math.sin(delta/180*Math.PI)*hy;
			l3=Math.cos(delta/180*Math.PI)*hy;
			
			farbe=fotoGraf.pal[realVon.ord%fotoGraf.palSize];
			
			pfeile[curKante]=new pfeil(farbe,pfRot,
							x1,y1,x3,y3,(x3+l3),(y3-h3),(x3+l2),(y3-h2),
							realVon.lev,
							realNach.lev);
		}
		
		this.nOdds; //	wird von beLane gesetzt
		this.beLane(pfeile,stroke);	// auch alert( beLane )
		
		this.beOdd(pfeile,stroke);	//	bzw alert( beOdd )
		
		for(curKante=0;curKante<this.nKant;curKante++){	//										pfeile htm
			
			rechtsRuck=pfeile[curKante].plusX*2*stroke;
			abSack=pfeile[curKante].plusY*2*stroke;
			this.tab+='<g><title>'
					+' nr: '+(curKante+1)
					+(pfeile[curKante].rot!=0?
					 ' rot: '+Math.round(pfeile[curKante].rot)
					 +' h0: '+Math.round(pfeile[curKante].h0):'')
					+' plus: ('+pfeile[curKante].plusX
					+', '+pfeile[curKante].plusY+')'
					+' </title>'
					+'<line'
					+'  x1="'+(pfeile[curKante].xOben+rechtsRuck)
					+'" y1="'+(pfeile[curKante].yOben+abSack)
					+'" x2="'+(pfeile[curKante].xUnten+rechtsRuck)
					+'" y2="'+(pfeile[curKante].yUnten+abSack) 
					+'" style="stroke:'+pfeile[curKante].farbe
					+';stroke-width:'+stroke+';"/>'
					+'<line'
					+'  x1="'+(pfeile[curKante].xUnten+rechtsRuck)
					+'" y1="'+(pfeile[curKante].yUnten+abSack)
					+'" x2="'+(pfeile[curKante].xRechts+rechtsRuck)
					+'" y2="'+(pfeile[curKante].yRechts+abSack)
					+'" style="stroke:'+pfeile[curKante].farbe
					+';stroke-width:'+stroke+';"/>'
					+'<line'
					+'  x1="'+(pfeile[curKante].xUnten+rechtsRuck)
					+'" y1="'+(pfeile[curKante].yUnten+abSack)
					+'" x2="'+(pfeile[curKante].xLinks+rechtsRuck)
					+'" y2="'+(pfeile[curKante].yLinks+abSack)
					+'" style="stroke:'+pfeile[curKante].farbe
					+';stroke-width:'+stroke+';"/>'
					+'</g>';
		}
		
		for(curNode=0;curNode<this.nNot;curNode++){
			cx=jack.not[curNode].x*width+x0; cy=jack.not[curNode].y*this.height;//				circle xy
			x1=cx-0.55*r; y1=cy-0.2*r;x2=cx-0.65*r;y2=cy+0.2*r;	//								lable xy
			
			farbe=fotoGraf.pal[curNode%fotoGraf.palSize];
			
			this.tab+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="stroke:'
						+farbe+'; stroke-width:'+stroke+'; fill:#0af;"/>'
						+'<text x="'+x1+'" y="'+y1+'" fill="black">Nr '
						+(jack.not[curNode].ord+1)+'. Platz '
						+(jack.not[curNode].rang+1)+'</text>'
						+'<text x="'+x2+'" y="'+y2+'" fill="black">'
						+jack.not[curNode].name+'</text>';
		}
		this.tab+='</svg>';
		
	}	//		========================================================================================
	
	beLane(pfeile,stroke){};		//				s. fotoBeLane
	beOdd(pfeile,stroke){};		//					s. fotoBeLane
	
}



















