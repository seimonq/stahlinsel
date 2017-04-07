class graf{

//	graf.N;
//	graf.ic;
//  graf.db;
//  graf.knoten;	
//  graf.knotenLength;
//  graf.index_of_Node;	
//  graf.kanten;
//  graf.kantenLength;
//	graf.notType;
//	graf.al;


	static list(){		//	-------------------------------------------------------------------------------
		
		var curGraf;
		var curNode;
		var curKante;
		var curMem;
		var re='{ grafen: { n: '+graf.N+' Teilgrafen gefunden, grafenArray: [';
		
		for(curGraf=0;curGraf<graf.N;curGraf++){
			re+='\n{ graf nr: '+(curGraf+1)+', id: '+graf.ic[curGraf].id
				+',\t\tanzKnoten: '+graf.ic[curGraf].nNot+', knoten: [\n ';
			for(curNode=0;curNode<graf.ic[curGraf].nNot;curNode++){
				re+='{ nr: '+(curNode+1)+', id: '
					+graf.ic[curGraf].not[curNode].id+', name: "'
					+graf.ic[curGraf].not[curNode].name+'", x: '
					+Math.round(graf.ic[curGraf].not[curNode].x*100)+'%, y: '
					+Math.round(graf.ic[curGraf].not[curNode].y*100)+'%, lev: '
					+graf.ic[curGraf].not[curNode].lev+', col: '
					+graf.ic[curGraf].not[curNode].col+', nFa: '
					+graf.ic[curGraf].not[curNode].nFa+', fa: [ ';
					for(curMem=0;curMem<graf.ic[curGraf].not[curNode].nFa;curMem++){
						re+=graf.ic[curGraf].not[curNode].fa[curMem]+', '
					}
					re=re.substr(0,re.length-2)+'], nCh: '
						+graf.ic[curGraf].not[curNode].nCh+', ch: [ ';
					for(curMem=0;curMem<graf.ic[curGraf].not[curNode].nCh;curMem++){
						re+=graf.ic[curGraf].not[curNode].ch[curMem]+', '
					}
					re=re.substr(0,re.length-2)+'] },\n ';
			}
			re=re.substr(0,re.length-3)+' ],\nanzKanten: '+graf.ic[curGraf].nKant+', kanten: [\n ';
			for(curKante=0;curKante<graf.ic[curGraf].nKant;curKante++){
				re+='{ nr: '+(curKante+1)+', id: '+graf.ic[curGraf].kant[curKante].id
					+',\tparent: '+graf.ic[curGraf].kant[curKante].parent_id+', name: '	
					+graf.knoten[graf.ic[curGraf].kant[curKante].parent_id].name
					+',\tchild: '+graf.ic[curGraf].kant[curKante].child_id+', name: '
					+graf.knoten[graf.ic[curGraf].kant[curKante].child_id].name+'},\n ';
			}
			re=re.substr(0,re.length-3)+'] },\n';
		}
		re=re.substr(0,re.length-2)+'\n] }\n';
		return re;
//		alert(graf.ic.toSource());
	}
	
	static parse(data){		//	-------------------------------------------------------------------------------
		
		
		graf.db=data;
		graf.index_of_Node=[];
	
		var NONE=-1;
		var curNode;
		var curKante;
		var secKante;
		var curGraf;
		var realGraf;
		var key;

		graf.knoten=[];
		graf.knotenLength=0;
		graf.al='';
		
		for(curNode=0;curNode<graf.db.dots.length;curNode++){
			
			graf.index_of_Node[graf.knotenLength]=graf.db.dots[curNode].index;
			
			graf.knoten[graf.db.dots[curNode].index] =
				new node(graf.knotenLength,curNode,graf.db);
			graf.knotenLength++;
		}
		
		graf.kanten=[];
		graf.kantenLength=0;
		for(curKante=0;curKante<graf.db.edges.length;curKante++){
			var dup=false;
			for(secKante=0;secKante<graf.kantenLength;secKante++){
				if(graf.kanten[secKante].id==graf.db.edges[curKante].index){
					dup=true; break;
				}
			}
			if(!dup){
				graf.kanten[graf.kantenLength]=new kante(curKante,graf.db);
				graf.kantenLength++;
			}
		}	
		graf.ic=[];
		graf.N=0;
		
		for(curKante=0;curKante<graf.kantenLength;curKante++){
			if(graf.kanten[curKante].gruppe==NONE) {
				while(true){ 
					key='g'+Math.round(Math.random()*9999)+1; 
					for(curGraf=0;curGraf<graf.N;curGraf++){
						if(graf.ic[curGraf].id==key)break;
					}	
					if(curGraf==graf.N)break;
				}
				graf.kanten[curKante].gruppe=key;
				realGraf=new graf(key,curKante);
				if(!realGraf.circle)	// graf.knoten u .kanten sind mit gruppe belegt
					graf.ic[graf.N++]=realGraf;	// nur in graf.ic kein Eintrag
			}
		}

	}

	constructor(id,kante1){		//	================================================================

		var curNode;
		var faNot;
		
		this.id=id;
		this.nKant=0;
		this.kant=[];	
		this.nNot=0;
		this.not=[];
		this.nRoot=0;
		this.root=[];
		this.nBoot=0;
		this.boot=[];
		this.circle=false; // bei beChild auf circle prüfen

		this.kant[this.nKant++]=graf.kanten[kante1];
		
		this.beKannte(graf.kanten[kante1].parent_id);  			
		this.beKannte(graf.kanten[kante1].child_id);

		this.beRoot();

		this.checkCircle();
		
		for(curNode=0;curNode<this.nRoot;curNode++){	//						Kinder Suche ab roots
			faNot=this.roots[curNode];
			faNot.lev=0;
			this.beChild(faNot);
			if(this.circle)break;
		}
		
		if(!this.cirlce){
			for(curNode=0,this.nLev=0;curNode<this.nNot;curNode++){	//				nLev
				if(this.not[curNode].lev>this.nLev)
					this.nLev=this.not[curNode].lev;
			}
			this.nLev++;
			this.nCols=this.beX();
		}
		
	}	//										===============================================================

	
	
	checkCircle(){
		
		var curNode;
		var curKante;
		var curRoot;
		
		graf.al='graf: \n'+'\nkanten:\n';
		for(curKante=0;curKante<this.nKant;curKante++){
			graf.al+=graf.knoten[this.kant[curKante].child_id].name+' -> '
					+graf.knoten[this.kant[curKante].parent_id].name+'\n';
		}
		graf.al+='\nknoten:\n';
		for(curNode=0;curNode<this.nNot;curNode++){
			graf.al+='nr: '+(curNode+1)+': '+this.not[curNode].name+'\n';
		}
		
		for(curRoot=0;curRoot<this.nNot;curRoot++){
			for(curNode=0;curNode<this.nNot;curNode++){
				this.not[curNode].chain=[];
				this.not[curNode].chainLen=0;
			}
			this.not[curRoot].chain=[];
			this.not[curRoot].chain[0]=this.not[curRoot].id;
			this.not[curRoot].chainLen=1;
			if(!this.add2Chain(this.not[curRoot]))break;
		}
		
	}
	
	add2Chain(whichNode){
		
		var curCh;
		var curLnk;
		var secLnk;
		var trueCh;
		
		for(curCh=0;curCh<whichNode.nCh;curCh++){
			trueCh=graf.knoten[whichNode.ch[curCh]];
			for(curLnk=0;curLnk<whichNode.chainLen;curLnk++){
				if(trueCh.id==whichNode.chain[curLnk]){
					this.circle=true;
					graf.al+='\nNachkomme '+trueCh.name
						+' von '+whichNode.name+' verboten'
						+'\n -> graph aussortiert';
					alert(graf.al);
					return false;
				}
				trueCh.chain[curLnk]=
					whichNode.chain[curLnk];
			}
			trueCh.chainLen=whichNode.chainLen;
			for(secLnk=0;secLnk<trueCh.chainLen;secLnk++){
				if(trueCh.chain[secLnk]==trueCh.id)break;
			}
			if(secLnk==trueCh.chainLen){
				trueCh.chain[secLnk]=trueCh.id;
				trueCh.chainLen++;
			}
			if(!this.add2Chain(trueCh)){
				return false;
			}
		}
		return true;
	}

	beKannte(whichNode){
		
		var NONE=-1;
		var curKante;
		var secKante;
		var realNode=graf.knoten[whichNode];
		
		if(realNode.gruppe==NONE){
			realNode.gruppe=this.id;
			this.not[this.nNot++]=realNode;

			for(curKante=0;curKante<graf.kantenLength;curKante++){
//				if(graf.kanten[curKante].gruppe==NONE){
					if(graf.kanten[curKante].parent_id==whichNode){
						realNode.ch[realNode.nCh++]=
							graf.kanten[curKante].child_id;
						graf.kanten[curKante].gruppe=this.id;
						for(secKante=0;secKante<this.nKant;secKante++){
							if(this.kant[secKante]==graf.kanten[curKante])
								break;
						}
						if(secKante==this.nKant)
							this.kant[this.nKant++]=graf.kanten[curKante];
						this.beKannte(graf.kanten[curKante].child_id);
					}
					if(graf.kanten[curKante].child_id==whichNode){
						realNode.fa[realNode.nFa++]=
							graf.kanten[curKante].parent_id;
						graf.kanten[curKante].gruppe=this.id;
						for(secKante=0;secKante<this.nKant;secKante++){
							if(this.kant[secKante]==graf.kanten[curKante])
								break;
						}
						if(secKante==this.nKant)
							this.kant[this.nKant++]=graf.kanten[curKante];
						this.beKannte(graf.kanten[curKante].parent_id);
					}
//				}
			}
		}
	}
	
	beRoot(){	//	-------------------------------------------------------------------------------
		
		var curKante;	//		pointer
		var curNode;	//
		var splitter;
		var ROOT=0;
		var BOOT=1;

		splitter=[this.nNot];
		for(curNode=0;curNode<this.nNot;curNode++){
			splitter[curNode]=[2];
			splitter[curNode][ROOT]=true;
			splitter[curNode][BOOT]=true;
		}
			
		for(curKante=0;curKante<this.nKant;curKante++){
			for(curNode=0;curNode<this.nNot;curNode++)
				if(this.not[curNode].id==this.kant[curKante].parent_id)
				{	splitter[curNode][BOOT]=false;break; }
			for(curNode=0;curNode<this.nNot;curNode++)
				if(this.not[curNode].id==this.kant[curKante].child_id)
				{	splitter[curNode][ROOT]=false;break; }
		}
		
		this.nRoot=0;
		this.roots=[this.nNot];
		this.nBoot=0;
		this.boots=[this.nNot];
		
		for(curNode=0;curNode<this.nNot;curNode++){
			if(splitter[curNode][ROOT])
				this.roots[this.nRoot++]=this.not[curNode];
			else if(splitter[curNode][BOOT])
				this.boots[this.nBoot++]=this.not[curNode];
		}
		
	}
	
	beChild(whichNode){		//	-------------------------------------------------------------------------------
		if(this.circle)return false;
		
		var curKante;
		var trueCh;
		var noGoArr=[];
		var noLen;
		var curNo;
		var secNo;
		
		whichNode.nCh=0; whichNode.ch=[this.nNot]; 
		whichNode.nFa=0; whichNode.fa=[this.nNot];
		
		for(curKante=0;curKante<this.nKant;curKante++){
			if(this.kant[curKante].child_id==whichNode.id){	//								isChild
				whichNode.fa[whichNode.nFa++]=this.kant[curKante].parent_id;	//			add fa (id)
			}
			if (this.kant[curKante].parent_id==whichNode.id){	//							isFa
				for(curNo=0;curNo<whichNode.noS;curNo++){
					if(whichNode.noGos[curNo]==this.kant[curKante].child_id){ //		======================= >>> illegal child
						this.circle=true;
					alert('circle '+whichNode.name+' -> '
						+graf.knoten[this.kant[curKante].child_id].name
						+'\nnoGos: '+whichNode.noGos.toSource()); 
						return false;
					}
				}
				whichNode.ch[whichNode.nCh]=this.kant[curKante].child_id;	//				add ch (id)
				trueCh=graf.knoten[whichNode.ch[whichNode.nCh]];
				for(curNo=0;curNo<whichNode.noS;curNo++){
					noGoArr[curNo]=whichNode.noGos[curNo]; //								(add par noGos to ch)
				} noLen=curNo;
				for(curNo=0;curNo<trueCh.noS;curNo++){
					for(secNo=0;secNo<noLen;secNo++)
						if(trueCh.noGos[curNo]==noGoArr[secNo])break;
					if(secNo==noLen)noGoArr[noLen++]=trueCh.noGos[curNo];
				}
				trueCh.noGos=noGoArr; trueCh.noS=noLen;
				whichNode.nCh++;
				if(trueCh.lev<=whichNode.lev){
					trueCh.lev=whichNode.lev+1; //											grafted
					this.beChild(trueCh);	// 		  									& 	reGrafted
				}
			}
		}
		return true;
		
	}
	
	beX(){		//	-------------------------------------------------------------------------------
		
		var curNode;
		var curLev;
		var breite;
		var rang;
		var nCols=-1;
		
		for(curNode=0;curNode<this.nNot;curNode++){
			this.not[curNode].y=(this.not[curNode].lev+1)/(this.nLev+1);
		}
		
		breite=[this.nLev];
		rang=0;
		
		for(curLev=0;curLev<this.nLev;curLev++){
			
			breite[curLev]=0;
			for(curNode=0;curNode<this.nNot;curNode++){
			   if(this.not[curNode].lev==curLev){
				   this.not[curNode].col=breite[curLev]++;
				   this.not[curNode].rang=rang++;
			   } 
			}
			
			if(breite[curLev]>nCols)nCols=breite[curLev];
			
			for(curNode=0;curNode<this.nNot;curNode++){
				if(this.not[curNode].lev==curLev){
					if(breite[curLev]==1)
						this.not[curNode].x=0.5;
					else
						this.not[curNode].x=this.not[curNode].col/(breite[curLev]-1);
				}
			}
		}
		
		return nCols;
		
	}














}