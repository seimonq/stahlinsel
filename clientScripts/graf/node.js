class node{

	constructor(num,payload){
		this.id=payload.dots[num].index;
		this.name=payload.dots[num].name;
		this.gruppe=-1;
		this.lev=-1;
		this.col=-1;
		this.x=0.5;
		this.y=0.5;
	}
}