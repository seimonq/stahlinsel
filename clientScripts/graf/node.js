class node{

	constructor(ord,num,payload){
		this.id=payload.dots[num].index;
		this.name=payload.dots[num].name;
		this.gruppe=-1;
		this.lev=-1;
		this.col=-1;
		this.x=0.5;
		this.y=0.5;
		this.ord=ord;
		this.nCh=0;
		this.ch=[];
		this.nFa=0;
		this.fa=[];
		this.chain=[];
		this.chainLen=0;
	}
}