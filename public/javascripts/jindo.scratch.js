/**
 * @author nhn
 */
var Scratch = $Class({
	_elCanvas : null,
	_oCtx : null,
	_nWidth : 210,
	_nHeight : 100,
	_nPixels : null,
	_sColor : "ff0000",
	_sImagePath : "",
	_nCursorSize : 10,
	_bScratch : false,
	_bSupportTouch : false,
	_nDefaultPercentage : 70,
	_nPixels : null,
	$init : function(htOption) {
		console.log("scratch init");
		this._assignElements();
		this._createImage();		
		this._setBackGroundImage("/images/slide1.jpg");
		this._drawImage();
		this._setEvents();
	},
	_assignElements : function() {
		console.log("_assignElements");
		this._welScratchPad = jindo.$Element("scratchpad");
		this._elCanvas = document.createElement('canvas');		
		this._welCanvas = jindo.$Element(this._elCanvas);
		this._oCtx = this._elCanvas.getContext('2d');
	},
	_setEvents : function() {
		console.log("_setEvents");

		if(this._hasTouch()) {
			//Touch Event            
			this._wfTouchStart = jindo.$Fn(this._onTouchStart, this);
			this._wfTouchMove = jindo.$Fn(this._onTouchMove, this);
			this._wfTouchEnd = jindo.$Fn(this._onTouchEnd, this);

			this._wfTouchStart.attach(this._elCanvas, "touchstart");
			this._wfTouchMove.attach(this._elCanvas, "touchmove");
			this._wfTouchEnd.attach(this._elCanvas, "touchend");
		} else {
			//Mouse Event            
			this._wfMouseDown = jindo.$Fn(this._onMouseDown, this);
			this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
			this._wfMouseUp = jindo.$Fn(this._onMouseUp, this);

			this._wfMouseDown.attach(this._elCanvas, "mousedown");
			this._wfMouseMove.attach(this._elCanvas, "mousemove");
			this._wfMouseUp.attach(this._elCanvas, "mouseup");
		}
	},
	_hasTouch : function() {
		console.log("_hasTouch");
		return !!('ontouchstart' in window);
	},
	_setBackGroundImage : function(sImagePath) {
		console.log("_setBackGroundImage");
		this._welScratchPad.css({
			backgroundImage : 'url(' + sImagePath + ')'
		});
	},
	_createImage : function(){
		this._welCanvas.attr({
			"width" : this._nWidth,
			"height" : this._nHeight			
		});
		
		this._welScratchPad.append(this._welCanvas);
		
		this._nPixels = this._nWidth * this._nHeight; 
	},
	_drawImage : function() {
		console.log("_drawImage");
		this._oCtx.fillStyle = this._sColor;
		this._oCtx.beginPath();
		this._oCtx.rect(0, 0, this._nWidth, this._nHeight);
		this._oCtx.fill();
	},
	_onTouchStart : function(oEvent) {
		console.log("_onTouchStart");
		oEvent.stop($Event.CANCEL_ALL);
		this._bScratch = true;
		this._onScratchDown(oEvent);		
		this._overScratchPercentage(this._getScratchPercentage());
	},
	_onTouchMove : function(oEvent) {
		console.log("_onTouchMove");
		if(this._bScratch){
			this._onScratchMove(oEvent);
			this._overScratchPercentage(this._getScratchPercentage());
		}
	},
	_onTouchEnd : function(oEvent) {
		console.log("_onTouchEnd");
		if(this._bScratch){
			this._onScratchUp(oEvent);
			this._bScratch = false;
			this._overScratchPercentage(this._getScratchPercentage());
		}
	},
	_onMouseDown : function(oEvent) {
		//_bScratch		
		console.log("_onMouseDown");
		//oEvent.stop($Event.CANCEL_DEFAULT);
		oEvent.stop($Event.CANCEL_ALL);
		this._bScratch = true;
		this._onScratchDown(oEvent);		
		this._overScratchPercentage(this._getScratchPercentage());
	},
	_onMouseMove : function(oEvent) {
		console.log("_onMouseMove");
		if(this._bScratch){
			this._onScratchMove(oEvent);
			this._overScratchPercentage(this._getScratchPercentage());
		}
	},
	_onMouseUp : function(oEvent) {
		console.log("_onMouseUp");
		if(this._bScratch){
			this._onScratchUp(oEvent);
			this._bScratch = false;
			this._overScratchPercentage(this._getScratchPercentage());
		}
	},
	_onScratchDown : function(oEvent){
		console.log("_onScratchDown");
		var oPos = oEvent.pos();  
		console.log("oPos.pageX: " + oPos.pageX + "oPos.pageY" + oPos.pageY);
		
		this._oCtx.globalCompositeOperation = 'destination-out';
		this._oCtx.lineJoin = "round";
		this._oCtx.lineCap = "round";
		this._oCtx.strokeStyle = this._sColor;
		this._oCtx.lineWidth = this._nCursorSize;

		this._oCtx.beginPath();
		this._oCtx.arc(oPos.pageX, oPos.pageY, this._nCursorSize / 2, 0, Math.PI * 2, true);
		this._oCtx.closePath();
		this._oCtx.fill();

		this._oCtx.beginPath();
		this._oCtx.moveTo(oPos.pageX, oPos.pageY);
	},
	_onScratchMove : function(oEvent){
		console.log("_onScratchMove");
		var oPos = oEvent.pos();  
		this._oCtx.lineTo(oPos.pageX, oPos.pageY);
		this._oCtx.stroke();
	},
	_onScratchUp : function(oEvent){
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
	_overScratchPercentage : function(nPercentage){
		if(this._nDefaultPercentage <= nPercentage){
			alert("다긁었다..");
			this._bScratch = false;
		}
	}
});
