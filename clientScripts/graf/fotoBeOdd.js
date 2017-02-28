fotoGraf.prototype.beOdd=function (pfeile,stroke){	// graf innerFunction	korrektur sich überdeckender schräger pfeile

//	einziger Unterschied zu beOdd() ist die Anzahl der Pfeile	
//  if(this.nKant==undefined)this.nKant=this.nKant;
//	this.nOdds statt in info in fotoGraf	

	var odds;	//			ungerade pfeile
	var splotter;	//		odds - nicht odds, trackR - nicht trackR, trackH ..
	var curKante;	//		pfeil.properties
	var curOdd;	//			pointer
	
	var	nTraxR;	//			anz tracks by .rot
	var trackiesR;	//		gleiche rotation					[r-track][lanes-r]
	var curTrack;	//		pointer
	var rotz;	//			(wie xXs, die pfeil.rot[])
	var nLanesR;	//		gleich schräge typen				trackiesR.length
	var trackRot;	//		cur rotation in grad (trackX)
	var curOdd;	//			in ord
	var secOdd;
	var nConflicts; //		summe trackRotn in diversen r-tracks
	var merkeConfl;
	var lanesR;	//			r-track.length
	var	curLane;
	var bakRot;	//			reset pfeile.rot
	
	var trackiesH;	//		gleiche höhe						[h-track][lanes-h]
	var lanesH;		//		.length								[h-track].length
	var nTrackH;	//		counter
	var nLanesH;	//		counter
	var pf;			//		pfeil
	var pf2;		//		secPfeil
	var	h0;			//		höhe bei svg.x0 trackH-key
	
	var curPlus;	//		verschiebung in stufen
	
	odds=[this.nOdds];
	rotz=[this.nOdds];
	nConflicts=this.nOdds;
	lanesR=[this.nOdds];
	bakRot=[this.nOdds];
	splotter=[this.nOdds];
	
	//		--------------------------------------------		select pfeile where  odd	
	
	curOdd=0;
	for(curKante=0;curKante<this.nKant;curKante++){	//							adr in odds speichern
		if(pfeile[curKante].rot!=0){
			odds[curOdd]=curKante;
			bakRot[curOdd]=Math.round(pfeile[odds[curOdd]].rot); //				.rot kopie
			splotter[curOdd]=-1;
			curOdd++;
		}
	}		//		end  select odd
	
	for(curOdd=0;curOdd<this.nOdds;curOdd++){	//				 ------------		norm-höhe
		pf=pfeile[odds[curOdd]];
		if(pf.rot>0)
			pf.h0=Math.round(pf.yOben-(this.width-pf.xOben)*Math.tan((90-pf.rot)/180*Math.PI));
		else
			pf.h0=Math.round(pf.yOben-(pf.xOben)*Math.tan((90+pf.rot)/180*Math.PI));
	}
	
	nTraxR=0;	//																
	for(curOdd=0;curOdd<this.nOdds;curOdd++){	// --------------------------		r-tracks
	
		nLanesR=0;	//															leerer Track
		if(bakRot[curOdd]!=0){ //												valid Odd.id -> track
			trackRot=bakRot[curOdd];	//			 							-> cur trackRot
			bakRot[curOdd]=0; //												remove odd by switch .rot
			splotter[curOdd]=nTraxR;
			nLanesR++; //														lane++
			for(secOdd=curOdd+1;secOdd<this.nOdds;secOdd++){
				if(bakRot[secOdd]==trackRot){
					bakRot[secOdd]=0; //										remove pfeil (.rot)
					splotter[secOdd]=nTraxR;
					nLanesR++; //												lane++
				}
			}
			if(nLanesR>1){
				lanesR[nTraxR++]=nLanesR;	//									nLanesR pro track[]
			}
			else{
				nConflicts--; //												count down conflicts
				splotter[curOdd]=-3;
			}
		}
	}
	
	//																			fill r-tracks
	trackiesR=[nTraxR];

	for(curTrack=0;curTrack<nTraxR;curTrack++){	//								[r-track]
		trackiesR[curTrack]=[lanesR[curTrack]];	//								[lanesR]
	}
	
	for(curTrack=0;curTrack<nTraxR;curTrack++){ //unsauber 
		curLane=0;		//	(curLane nicht gegen nTraxR geprüft)
		for(curOdd=0;curOdd<this.nOdds;curOdd++){
			if(splotter[curOdd]==curTrack){ //									alOdd r-fitting odd
				trackiesR[curTrack][curLane++]=odds[curOdd];//					add (new) pfeil to trackiesR
			}	//																on curlane
		}
	}
	merkeConfl=nConflicts;
	
	trackiesH=[nConflicts];	//													max splitable
	lanesH=[nConflicts];	//													max lanes dazu ('.length')
	
	nTrackH=0;	//																new track-h
	for(curTrack=0;curTrack<nTraxR;curTrack++){	//								empty
	
		trackiesH[nTrackH]=[lanesR[curTrack]];	//								new [track-h][lanes]
		nLanesH=0; //															new lane-h
		lanesH[nTrackH]=0;
		
		splotter=[lanesR[curTrack]];	//										new splotter
		for(curLane=0;curLane<lanesR[curTrack];curLane++){	//					empty
			splotter[curLane]=-1;
		}
		for(curLane=0;curLane<lanesR[curTrack];curLane++){	//
			if(splotter[curLane]!=-1)continue;
			splotter[curLane]=-4;	//											track-lane in check		
			pf=pfeile[trackiesR[curTrack][curLane]];
			h0=pf.h0;
			trackiesH[nTrackH][nLanesH++]=trackiesR[curTrack][curLane]; //		cur lane-r 
			lanesH[nTrackH]=nLanesH; //											new -> lane-h
			for(secLane=curLane+1;secLane<lanesR[curTrack];secLane++){
				if(splotter[secLane]!=-1)continue;
				pf2=pfeile[trackiesR[curTrack][secLane]];
				if(pf2.h0==h0){
					splotter[secLane]=nTrackH;	//								remove from r-track
					trackiesH[nTrackH][nLanesH++]=	//							
						trackiesR[curTrack][secLane]; //		 sec			to -> track-h.lane-h
					lanesH[nTrackH]=nLanesH; //									new lane-h
				}
			}
			if(lanesH[nTrackH]>1){
				splotter[curLane]=nTrackH;
				nTrackH++;
				trackiesH[nTrackH]=[lanesR[curTrack]];	//						new [track-h][lanes]
				nLanesH=0; //													new lane-h
				lanesH[nTrackH]=0;
			}
			else{
				nLanesH=0; //													del lane-h
				lanesH[nTrackH]=0;
				splotter[curLane]=-3;	//
				nConflicts--;
			}
		}
	}
	
	//							---------------------------------------			verschieben der lanes
	for(curTrack=0;curTrack<nTrackH;curTrack++){	//							modify pfeile
		var ODD=1;
		
		curLane=0;	if(lanesH[curTrack]%2==ODD)curLane++;
		
		dx=Math.cos(pfeile[trackiesH[curTrack][0]].rot/180*Math.PI);
		dy=Math.sin(pfeile[trackiesH[curTrack][0]].rot/180*Math.PI);
		
		for( curPlus=1;curLane<lanesH[curTrack];curLane+=2,curPlus++){
			
			pf=pfeile[trackiesH[curTrack][curLane]];
			pf2=pfeile[trackiesH[curTrack][curLane+1]];
			pf.plusX=Math.round(curPlus*dx*100)/100;
			pf.plusY=Math.round(curPlus*dy*100)/100;
			pf2.plusX=-Math.round(curPlus*dx*100)/100;
			pf2.plusY=-Math.round(curPlus*dy*100)/100;
		}
	}
	
	return 'fotoBeOdd done';
}














