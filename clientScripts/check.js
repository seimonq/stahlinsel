class check{

	constructor(data){
		
		var curDot;
		var curEdge;
		this.startCh=data["child"];	  // mem für button-clicks
		this.startPar=data["parent"]; //
		this.dots=[];	// dots[id]
		this.dotte=[]; // index[1..n]
		
		//		alle dots und edges in verlinkbare Objekte überführen
		
		for(curDot=0;curDot<data["dots"].length;curDot++){
			this.dotte[curDot]=new dotClass(data["dots"][curDot]);
			this.dots[data["dots"][curDot].index]=this.dotte[curDot];
		}
		this.nDots=curDot;
		
		this.edges=[];
		for(curEdge=0;curEdge<data["edges"].length;curEdge++){
			this.edges[curEdge]=
				new edgeClass(data["edges"][curEdge]);
		}
		this.nEdges=curEdge;
		
		//	vorfahren als dot.fa[], nachfahren als dot.ch[] für dot[key] erstellen
		//  conflicting edges deaktivieren
		this.ch=[]; this.nCh=0;	this.ch[this.nCh++]=data["key"];  		// ini up
		this.fa=[]; this.nFa=0; this.fa[this.nFa++]=data["key"];	 	// ini down
		while(!this.chain(data["key"],"up"));							// chain up
		while(!this.chain(data["key"],"down"));							// chain down
	
	}
	
	chain(key,dir){
		
		var curEdge;
		var curDot;
		var realDot=this.dots[key];
		var realCh;
		var realFa;
		
		if(dir=="up"){
			for(curEdge=0;curEdge<this.nEdges;curEdge++){
				if(this.edges[curEdge]==null)continue;
				if(this.edges[curEdge].child_id==key){
					realFa=this.dots[this.edges[curEdge].parent_id];
					for(curDot=0;curDot<this.nCh;curDot++){		// prüfe ob Vorfahr ein Nachkomme ist
						if(this.ch[curDot]==realFa.id){
							alert("kante: "+realFa.name
							+' -> '+this.dots[key].name
							+' unzulässig');
							this.edges[curEdge]=null;
							return false;
						}
					}
					for(curDot=0;curDot<this.nFa;curDot++)		// übernehme (once) father
						if(this.fa[curDot]==realFa.id)break;	// in Ahnenreihe
					if(curDot==this.nFa)
						this.fa[this.nFa++]=realFa.id;
					this.chain(realFa.id,dir);					// und verkette ihn aufwärts			
				}
			}
		}
		if(dir=="down"){
			for(curEdge=0;curEdge<this.nEdges;curEdge++){
				if(this.edges[curEdge]==null)continue;
				if(this.edges[curEdge].parent_id==key){
					realCh=this.dots[this.edges[curEdge].child_id];
					for(curDot=0;curDot<this.nFa;curDot++){     // prüfe ob Nachkomme ein Vorfahr ist
						if(this.fa[curDot]==realCh.id){
							alert("kante: "+this.dots[key].name
							+' -> '+realCh.name
							+' unzulässig');
							this.edges[curEdge]=null;
							return false;
						}
					}
					for(curDot=0;curDot<this.nCh;curDot++)		// übernehme (once) child
						if(this.ch[curDot]==realCh.id)break;	// in Nachkommen
					if(curDot==this.nCh)
						this.ch[this.nCh++]=realCh.id;
//					alert(this.ch.toSource()+'\nchildren '+(this.nCh)+' '+realCh.name);
					this.chain(realCh.id,dir);					// und verkette es abwärts			
				}
			}
		}
		return true;
	}

}

class dotClass{
	
	constructor(dotData){
		this.id=dotData["index"];
		this.name=dotData["name"];
	}
}

class edgeClass{
	
	constructor(edgeData){
		this.id=edgeData["index"];
		this.parent_id=edgeData["parent_id"];
		this.child_id=edgeData["child_id"];
		this.state="ok";
	}
}

















