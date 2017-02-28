fotoGraf.prototype.beLane=function(pfeile,stroke){	// view		inner function zu graf.construct 

//	einziger Unterschied zu beLane() ist die Anzahl der Pfeile	
//	this.nOdds statt in info.nOdds	
	
	var curKante;	//	local pointer										trackiesX
	var nLot;	//		anz lotrechte pfeile
	var lote;	//		die selben
	var curLot;	//		pointer
	var secLot;	//		ebenso
	var nConflicts; //	summe lote in x-tracks
	var merkeConfl; //	x .. y conflicts
	var trackiesX; //	track same x
	var nTraX; //		anz x-tracks, pointer trackiesY
	var curTrack; //	pointer track-x (auch y,l)
	var trackX;	//		x koordinaten
	var xSs;	//		[tracks] x koordinaten
	var nLanesX;	//	anz pfeile in track
	var lanesX;	//		pro track[]	lanes
	var	curLane;//		pointer lane
	
	var trackiesY; //	different y											trackiesY
	var nTraxY; //		anz y-tracks
	var loteInX;	//	noch nicht auf Y-track
	var lanesY; //		pro y-track
	var laneWidth;	//	Verschiebung auf Track
	var curPlus; //		lane Verschiebung z.Z 1.5 stroke
	var yOben;	//		pfeil
	var yUnten;
	var curSplit; //	pointer
	var splitter; //	tracks vertical aufgespalten
	var nSplit;	//		each x-track.x-lane
	var newSplitN; //	each y-track.y-lane
	var nLanesY; //		y-track[anz y-lanes]
	
	var curLev;	//		freie lanes im track-y								trackiesL
	var splitLev; //	freie lanes
	var trOben;	//		level track-y for gap
	var trUnten;
	var curHeight; //	sort:  pfeil.height bzw y-lane.height 
	var secHeight; //	sort:  comparing with curHeight
	var tmpPfeil; //	sort:  swap pfeil
	var nTrLevs; //		level im track-y
	var secLane; //		pointer y-Lane (comparing with curLane)
	var trackiesL; //	y-track[y-lanes] -> l-track[gruppen][l-lanes]
	var nTrackL; //		anz l-tracks
	var gruppenL; //	anz gruppen pro track
	var	nGrup; //		anz gruppen pro track-l, auch next (activ) gruppe
	var curGrup; //		pointer gruppe
	var lanesG; //		gruppe (innerhalb eines y-tracks, jetzt l-track) von lanes auf gleichem x
	var nLanesG; //		counter, pointer anz g-lanes in gruppe
	var freeOben; //	gap oben (level)
	var unterFree; //	unter gap (level)
	
	var curPlus; //		pfeile rechtsRuck
	
// lote = select ord from pfeile where lot=true	------------------------------------------------------
	
	nLot=0;
	for(curKante=0;curKante<this.nKant;curKante++)	// 								lote zählen
		if(pfeile[curKante].rot==0)nLot++;
	
	this.nOdds=this.nKant-nLot;
	
	nConflicts=nLot;
	
	if(nLot<2) return 'beLane: keine bösen Lote';
	
	lote=[nLot];	//	lotrechte pfeile		vorsicht ar[zahl]==ar[]
	
	splitter=[nLot];
	xSs=[nLot];	// 		zu groß max [nLot] wenn keine lanesX = keine tracksX(über 1 lane)
	lanesX=[nLot];	//	auch dies max, anz lanesX pro x-track
	curLot=0;
	
	for(curKante=0;curKante<this.nKant;curKante++){	//							adr in lote speichern
		if(pfeile[curKante].rot==0){
			lote[curLot]=curKante;
			splitter[curLot]=curKante;
			curLot++;
		}
	}
	
// ende select

//								--------------------------------------------------
	nTraX=0;	//																tracks zählen
	for(curLot=0;curLot<nLot;curLot++){
		nLanesX=0;	//															leerer Track
		if(pfeile[lote[curLot]].rot==0){ //										valid track
			pfeile[lote[curLot]].rot=1; //										remove lot by switch .rot
			trackX=pfeile[lote[curLot]].xOben;	//			 					-> trackX
			xSs[nTraX]=trackX;	//												x-koordinate[] track
			nLanesX++; //														lane++
			for(secLot=0;secLot<nLot;secLot++){	
				if((pfeile[lote[secLot]].rot==0)
				&(pfeile[lote[secLot]].xOben==trackX)){
					pfeile[lote[secLot]].rot=1; //								remove pfeil (.rot)
					nLanesX++; //												lane++
				}
			}
			if(nLanesX>1){ 
				lanesX[nTraX]=nLanesX;	//										nLanesX pro track[]
				nTraX++;	//													count track if lanesX
			}
			else{
				nConflicts--; //												count down conflicts
				splitter[curLot]=-3;
			}
		}
	}
	
	for(curLot=0;curLot<nLot;curLot++)	//										reset for beOdd()
		pfeile[lote[curLot]].rot=0; 
	
	merkeConfl=nConflicts;

//																				fill x-tracks

	trackiesX=[nTraX];	//	vorsicht: trackiesX=[]								each trackX
	trackiesY=[nTraX*this.nLev];	//	vorsicht: trackiesY=[]							max splitable
	lanesY=[nTraX*this.nLev];	//													max lanes dazu ('.length')

	for(curTrack=0;curTrack<nTraX;curTrack++)
		trackiesX[curTrack]=[lanesX[curTrack]];	//								[lanesX]
	
	for(curTrack=0;curTrack<nTraX;curTrack++){ //unsauber 
		curLane=0;		//	(curLane nicht gegen nTraX geprüft)
		for(curLot=0;curLot<nLot;curLot++){
			if(pfeile[lote[curLot]].xOben==xSs[curTrack]){ //					all x-fitting lot
				trackiesX[curTrack][curLane++]=lote[curLot];//					add (new) pfeil to trackiesX
			}	//																on curlane
		}
	}
	
	if(nTraX==0) return 'beLane: keine bösen x-tracks';
	
//					-----------------------------------------------------		vertical split (in each xTrack)
	nTraxY=0; // next bzw cur y-track
	for(curTrack=0;curTrack<nTraX;curTrack++){	

		loteInX=true;
		
		nSplit=lanesX[curTrack]; //												split[lanesX] ->trackY[lanesY]
		splitter=[nSplit]; //  vorsicht splitter=[]								-2 = no split
		for(curSplit=0;curSplit<nSplit;curSplit++){ //							-1 = unchecked
			splitter[curSplit]=-1;
		}
			
		curSplit=0;
		
		while(loteInX){
		
			yOben=pfeile[trackiesX[curTrack][curSplit]].yOben;	//				set split oben,unten
			yUnten=pfeile[trackiesX[curTrack][curSplit]].yUnten;
			
			for(curSplit=0;curSplit<nSplit;curSplit++){	//						modify oben,unten
			
				if( (splitter[curSplit]==-1)
				  &&(pfeile[trackiesX[curTrack][curSplit]].yOben<yUnten)	//	as max min
				  &&(pfeile[trackiesX[curTrack][curSplit]].yUnten>yOben))
				{
					if(pfeile[trackiesX[curTrack][curSplit]].yOben<yOben){
						yOben=pfeile[trackiesX[curTrack][curSplit]].yOben;
					}
					if(pfeile[trackiesX[curTrack][curSplit]].yUnten>yUnten){
						yUnten=pfeile[trackiesX[curTrack][curSplit]].yUnten;
					}
				}
			}

			curSplit=0;
			newSplitN=0;
			for(curSplit=0;curSplit<nSplit;curSplit++){	//						checking oben,unten
				if((splitter[curSplit]==-1)
				  &&(pfeile[trackiesX[curTrack][curSplit]].yOben<yUnten)
				  &&(pfeile[trackiesX[curTrack][curSplit]].yUnten>yOben))	//	count lanesY (.length)
				{	
					splitter[curSplit]=nTraxY; //								matrix y-split (gruppe)
					newSplitN++; //												count y-lanes
				}
			}
			lanesY[nTraxY]=newSplitN; // trackiesY[curTrack].length
				
			if(newSplitN>1){
				trackiesY[nTraxY]=[newSplitN];	//	trackiesY[nTraxY]=[]		new trackY[lanesY]
				curLane=0;
				for(curSplit=0;curSplit<nSplit;curSplit++){
					if(splitter[curSplit]==nTraxY)
					{
						trackiesY[nTraxY][curLane++]
								=trackiesX[curTrack][curSplit]; // 				new laneY
					}
				}
				nTraxY++;
			}
			else{
				for(curSplit=0;curSplit<nSplit;curSplit++){
					if(splitter[curSplit]==nTraxY){
						splitter[curSplit]=-2; //								kein Track
						nConflicts--;
						break;
					}	
				}
			}
			
			loteInX=false; // 													noch lote in X?	
			for(curSplit=0;curSplit<nSplit;curSplit++){
				if(splitter[curSplit]==-1){
					loteInX=true;
					break;
				}
			}
			
		}	// 	while loteInX				next split
		
	} // next Track
	
	if(nTraxY==0){
		return 'belane: keine bösen y-tracks';
	}

//			--------------------------------------------------------	groupe y-Track.lanes - > trackiesL
				
	
  	nTrackL=-1;	//																trackiesY -> trackiesL
	trackiesL=[nTraxY];	//														trackiesL [exact each trackY]
	gruppenL=[nTraxY];	//														new counter gruppen pro track
	for(curTrack=0;curTrack<nTraxY;curTrack++) //									empty
		gruppenL[curTrack]=0; //												
	
	lanesG=[nTraxY];	//														count [track][gruppen]lanes
	
	for(curTrack=0;curTrack<nTraxY;curTrack++){ // --------------- each track
	
		nLanesY=lanesY[curTrack]; //											split[lanesY] -> trackiL[lanesY]
		trackiesL[++nTrackL]=[nLanesY];	//										new trackL [gruppen]
		lanesG[curTrack]=[nLanesY];	//											new counter track.gruppen.nlanes 
		for(curLane=0;curLane<nLanesY;curLane++){
			lanesG[curTrack][curLane]=0; //										empty column
		}
		nGrup=-1;
		
		for(curLane=0;curLane<nLanesY;curLane++){	//				---------	sort by height bzw size
			for(secLane=curLane+1;secLane<nLanesY;secLane++){	//	  sort
				curHeight=pfeile[trackiesY[curTrack][curLane]].levU
						 -pfeile[trackiesY[curTrack][curLane]].levO;
				secHeight=pfeile[trackiesY[curTrack][secLane]].levU
						 -pfeile[trackiesY[curTrack][secLane]].levO;
				if(curHeight<secHeight){
					tmpPfeil=pfeile[trackiesY[curTrack][curLane]];
					pfeile[trackiesY[curTrack][curLane]]=
							pfeile[trackiesY[curTrack][secLane]];
					pfeile[trackiesY[curTrack][secLane]]=tmpPfeil;
				}
			}
		}
		
		splitter=[nLanesY]; //  									splitter	-2 = valid split
		for(curLane=0;curLane<nLanesY;curLane++){ //							-1 = unchecked
			splitter[curLane]=-1;	//											-3 = deletet
		}
		
		trOben=this.nLev; trUnten=-1;	//											track-y height (as levels)
	
		for(curLane=0;curLane<nLanesY;curLane++){ //							max u min height
			if(pfeile[trackiesY[curTrack][curLane]].levO<trOben)
				trOben=pfeile[trackiesY[curTrack][curLane]].levO;
			if(pfeile[trackiesY[curTrack][curLane]].levU>trUnten)
				trUnten=pfeile[trackiesY[curTrack][curLane]].levU;
		}
		nTrLevs=trUnten-trOben;
		splitLev=[nTrLevs];	//													new split Levels
		
		for(curLev=0;curLev<nTrLevs;curLev++){
			splitLev[curLev]=[nLanesY]; // 										new split Lanes
			for(curLane=0;curLane<nLanesY;curLane++)	//						empty (-1)
				splitLev[curLev][curLane]=-1;	//									   -2 = noFit
		}
		for(curLane=0;curLane<nLanesY;curLane++){	//							matrix lev * lane
			
			for(curLev=pfeile[trackiesY[curTrack][curLane]].levO-trOben;
				curLev<pfeile[trackiesY[curTrack][curLane]].levU-trOben;curLev++)
			{
				splitLev[curLev][curLane]=curLane;	//							next.levO = pfeil.levU							
			}
		} //														---------
		
		for(curLane=0;curLane<nLanesY;curLane++){	//					---------	Gruppierung 
			
			if( splitter[curLane]==-1){

				nLanesG=-1;
				trackiesL[nTrackL][++nGrup]=[nLanesY]; //							new gruppe [lanes]
				gruppenL[nTrackL]++; //												count (1.)gruppe
				splitter[curLane]=-4; // 											(re)move from lanes-y 				
				trackiesL[nTrackL][nGrup][++nLanesG]=	//		    				to (new) (re/main)lane-g
						trackiesY[curTrack][curLane];
	
				lanesG[nTrackL][nGrup]++;  //										count lanes-g [0](0->1)
	
				while(true){ //								==========  GAP  	    search (from scratch)
				
					freeOben=-1; unterFree=-1;	//						seek gap	new (cur) lücke	
					for(curLev=0;curLev<nTrLevs;curLev++){	//						lücke oben
						if(splitLev[curLev][curLane]==-1){
							freeOben=curLev;
							break;
						}
					}
					
					if(curLev==nTrLevs)break; // 	no oben				noGaps   =====>	BREAK
					
					for(;curLev<nTrLevs;curLev++){ 
					   if(!(splitLev[curLev][curLane]==-1))break; //				unter lücke
					} 
					unterFree=curLev;
					
					for(secLane=curLane+1;	//							-------		(cur) gap
						secLane<nLanesY;secLane++) 		
					{	// 												seek fill	(secLane)
						if(splitter[secLane]==-1){
						
							if((pfeile[trackiesY[curTrack][secLane]]
								.levO>=(freeOben+trOben))
							 &&(pfeile[trackiesY[curTrack][secLane]]
								.levU<=(unterFree+trOben)))
							{	//											  (found)
								splitter[secLane]=-3;	//								remove .y-lane
								for(curLev =
									(pfeile[trackiesY[curTrack][secLane]].levO-trOben);
									curLev <
									(pfeile[trackiesY[curTrack][secLane]].levU-trOben);
									curLev++)	//											(off matrix)
								{
									splitLev[curLev][curLane]=  //						copy-paste
													splitLev[curLev][secLane]; //			(to matrix)
									splitLev[curLev][secLane]=-1;	//					del				
								} 
								
								trackiesL[nTrackL][nGrup][++nLanesG]=	//					(to .gruppe) 
									trackiesY[curTrack][secLane]; //				    new g-lane
								lanesG[nTrackL][nGrup]++;	//							count group members
								break; // 												found and done
							}
						}
					}
					
					if(secLane==nLanesY){ // 						  (not found)	not found
					
						for(curLev=freeOben;curLev<unterFree;curLev++){	
							splitLev[curLev][curLane]=-2; // noFit
						}
					}	//															but done
					//										  			gap done	(cur)
				} // while												==========	new gap search
				
				splitter[curLane]=-2;	//											gruppe done
				
			}	// 	if										done (re) main-lane 	(+ gruppe.sub-lanes)
		
		} // each lane-y (bzw manche lane-y)
		//   (die dann als track-gruppe die andere lane-y's einsammeln darf)
		
	}
	
	nTrackL++;	// 																n(ext)TrackL -> (le)nTrackL
	merkeConfl=nConflicts;
	nConflicts=0;
	for(curTrack=0;curTrack<nTrackL;curTrack++)
		nConflicts+=lanesG[curTrack];
	
	laneWidth=2*stroke;
	
	for(curTrack=0;curTrack<nTrackL;curTrack++){	//							modify pfeile
		var ODD=1;//															s graf rechtsRuck
		
		curGrup=0;
		if(gruppenL[curTrack]%2==ODD)curGrup++;	//								mittel lane   | if odd
		//																					  v
		for(curPlus=1;curGrup<gruppenL[curTrack];curGrup+=2,curPlus++){	//		+ paare

			for(curLane=0;curLane<lanesG[curTrack][curGrup];curLane++){ //  	grup-lane 	   -> | rechts
				//																				  v
				pfeile[trackiesL[curTrack][curGrup][curLane]].plusX=curPlus;
			}
			
			for(curLane=0;curLane<lanesG[curTrack][curGrup+1];curLane++){ //	 grup-lane |  <- links
				//																	 	   v
				pfeile[trackiesL[curTrack][curGrup+1][curLane]].plusX=-curPlus;
			}
		}
	}
	
	return 'fotoBeLane done';
	
}