class kante{

	constructor(num,payload){
		this.id=payload.edges[num].index;
		this.parent_id=payload.edges[num].parent_id;
		this.child_id=payload.edges[num].child_id;
		this.gruppe=-1;
	}
}