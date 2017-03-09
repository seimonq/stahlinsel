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
		this.nChild=0;
		this.ch=[];
		this.nFa=0;
		this.fa=[];
		this.noGos=[];
		this.noGos[0]=this.id;
		this.noS=1;
	}
}