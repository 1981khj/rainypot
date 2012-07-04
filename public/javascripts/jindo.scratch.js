Pos.pageX, oPos.pageY, this._nCursorSize / 2, 0, Math.PI * 2, true);
		this._oCtx.closePath();
		this._oCtx.fill();

		this._oCtx.beginPath();
		this._oCtx.moveTo(oPos.pageX, oPos.pageY);
	},
	_onScratchMove : function(oEvent){
		console.log("_onScratchMove");
		var oPos = this._getScratchPosition(oEvent.pageX, oEvent.pageY);  
		this._oCtx.lineTo(oPos.pageX, oPos.pageY);
		this._oCtx.stroke();
	},
	_onScratchUp : function(){
		console.log("_onScratchUp");
		this._oCtx.closePath();
	},
	_getScratchPercentage : function(){
		console.log("_getScratchPercentage");
		var nHits = 0;				
		var htImageData = this._oCtx.getImageData(0, 0, this._nWidth, this._nHeight);

		for(var i = 0, nLength = htImageData.data.length; i < nLength; i = i + 4) {
			if(htImageData.data[i] == 0 && htImageData.data[i + 1] == 0 && htImageData.data[i + 2] == 0 && htImageData.data[i + 3] == 0){
				nHits++;
			}	
		}
		
		return (nHits / this._nPixels) * 100;
	},
	_getEventPosition : function(oEvent){
		if (oEvent.targetTouches){
			oEvent = oEvent.targetTouches[0];
		}
			
        if (oEvent.pageX != null && oEvent.pageY != null){
        	return {pageX: oEvent.pageX, pageY: oEvent.pageY};
        } 
	},
	_getScratchPosition : function(oPositionX, oPositionY){
		var htPosition = {
			//"pageX" : Math.floor(oPosition.pageX - this._htCanvasOffset.left),
			//"pageY" : Math.floor(oPosition.pageY - this._htCanvasOffset.top)
			"pageX" : Math.floor(oPositionX - this._htCanvasOffset.left),
			"pageY" : Math.floor(oPositionY - this._htCanvasOffset.top)
		};
		
		this._drawLog(htPosition);
		
		return htPosition
	},
	_overScratchPercentage : function(nPercentage){
		if(this._nDefaultPercentage <= nPercentage){
			alert("다긁었다..");
			this._bScratch = false;
		}
	},
	_drawLog : function(htLog){
		var elLog = $("<div>"+htLog.pageX+" : "+htLog.pageY+"</div>");  
		this._welScratchLog.append(elLog);
	}
});
