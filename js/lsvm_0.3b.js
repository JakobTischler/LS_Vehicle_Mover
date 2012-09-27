/*
 * @author: Jakob Tischler
 * @date: 15 September 2012
 * @version: 0.3 beta
 * @contact: jakob -dot- tischler -ätt- gmail -dot- com
 */

$(document).ready(function () {
	$.fn.outerHTML = function() {
		return $('<div>').append( this.eq(0).clone() ).html();
	};
	

	var main = $('#main'),
		currentVersion = '0.3 beta',
		versionDisplay = $('[rel="version"]'),
		form = $('form'),
		vehInput = $('textarea'),
		debug = $('#debug'),
		tmpOutputClean = $('#tmpOutputClean'),
		tmpOutput = $('#tmpOutput');
		
	versionDisplay.text('v' + currentVersion);
	main.show(); debug.hide();
	if (!vehInput.val()) {
		vehInput.val(vehInput.attr('placeholder'));
	}
		
	$('textarea, input[type="url"]').on("blur", function() {
		if ($(this).val() !== '') { 
			$(this).addClass("blur"); 
		}
	}).on("focus", function() {
		$(this).removeClass("blur");
	});
	
	$('#debugActive').on('change', function() {
		/*
		if ($(this).is(':checked')) {
			debug.show();
		} else {
			debug.hide();
		};
		*/

		$(this).is(':checked') ? debug.show() : debug.hide();
	});
	
	$('button').on('click', function(event) {
		event.preventDefault();
		
		//clean previous runthrough
		$('#output').empty(); tmpOutput.empty(); tmpOutputClean.empty(); $('.pos').empty();
		
		var vehicleData = vehInput.val(),
			vehicleData = $($.trim(vehicleData)),
			components = vehicleData.find('*'),
			mapUrl = $('#mapurl').val(),
			mapSize = $('input[name="mapsize"]:checked').val(),
			map = $('#map');

		tmpOutputClean.append(vehicleData);
		vehicleData.clone().appendTo(tmpOutput);
		var vehicleDataClean = tmpOutputClean.find('vehicle');
			
		/** TEMP VEHICLE DATA **/
		var tmpVehicleData = tmpOutput.find('vehicle'),
			vehName = tmpVehicleData.attr('filename'),
			lastSlash = vehName.lastIndexOf('/'),
			vehName = vehName.substr(lastSlash + 1),
			vehNameTitle = vehName.substr(0, vehName.length - 4);
			tmpComponents = tmpVehicleData.find('*'),
			numComponents = tmpComponents.length;
			
		origAvgAr = new Array(0, 0, 0);
		newAvgAr = new Array(0, 0, 0);
		
		tmpComponents.each(function(i) {
			var e = $(this),
				pos = e.attr('position').split(' '),
				posX = pos[0],
				posY = pos[1],
				posZ = pos[2];
				
			e.attr('data-origPosX', posX)
			 .attr('data-origPosY', posY)
			 .attr('data-origPosZ', posZ);
			
			for (a in origAvgAr) {
				origAvgAr[a] = origAvgAr[a] + parseFloat(pos[a]);
			};
		}); // end tmpComponents each
		for (i in origAvgAr) {
			origAvgAr[i] = origAvgAr[i]/numComponents;
		};
		var origAvg = { 
			x: origAvgAr[0], 
			xRounded: Math.round(origAvgAr[0]*100)/100, 
			y: origAvgAr[1], 
			z: origAvgAr[2], 
			zRounded: Math.round(origAvgAr[2]*100)/100 
		};

		/* MAP */
		map.show().css('background-image', 'url(' + mapUrl + ')');

		var mapCenterX = map.width() / 2, 
			mapCenterY = map.height() / 2,
			mapRatio = mapSize / map.width();
			
		$('#origPos').css({
			left: mapCenterX + origAvg.x / mapRatio, 
			top: mapCenterY + origAvg.z / mapRatio
		})
			.attr('data-title', vehNameTitle)
			.attr('data-vehicleName', vehNameTitle)
			.attr('title', "X: "+origAvg.xRounded+" / Z: "+origAvg.zRounded)
			.attr('data-origPosX', origAvg.x)
			.attr('data-origPosY', origAvg.y)
			.attr('data-origPosZ', origAvg.z)
			.on('click', function() {
				var e = $(this),
					title = e.attr('data-title');
				
				if ( $('.newpos[data-title="'+title+'"]').length < 1 && e.hasClass('isCloned') == false) {
					e.addClass('isCloned')
						.clone()
						.attr('id', 'newPos')
						.addClass('newpos')
						.removeClass('isCloned')
						.appendTo(map)
						.draggable({
							containment: "parent",
							drag: function(event, ui) {
								var newE = $('#newPos'),
									newPosItemX = (parseFloat(newE.css('left')) - mapCenterX) * mapRatio,
									newPosItemZ = (parseFloat(newE.css('top')) - mapCenterY) * mapRatio,
									xRounded = Math.round(newPosItemX*100)/100,
									zRounded = Math.round(newPosItemZ*100)/100;
									
								newE.attr('title', 'X: '+xRounded + ' // Z: ' + zRounded)
									.attr('data-newPosX', newPosItemX)
									.attr('data-newPosZ', newPosItemZ);

								//newE.attr('data-title', newE.attr('data-vehicleName') + '\a' + newE.attr('title'));
								$('#newAvgPx').text('newAvg (px): X: '+newE.css('left') + ' / Z: ' + newE.css('top'));
								$('#newAvgLS').text('newAvg (LS): X: '+newPosItemX + ' / Z: ' + newPosItemZ);
							},
							stop: function(event, ui) {
								var newE = $('#newPos'),
									newPosItemX = (parseFloat(newE.css('left')) - mapCenterX) * mapRatio,
									newPosItemZ = (parseFloat(newE.css('top')) - mapCenterY) * mapRatio,
									xDelta = newPosItemX - origAvg.x,
									zDelta = newPosItemZ - origAvg.z;
								//console.log("xDelta: " + xDelta + " // zDelta:" + zDelta);

								tmpComponents.each(function(i) {
									var e = $(this),
										oldPosX = e.attr('data-origPosX'),
										oldPosY = e.attr('data-origPosY'),
										oldPosZ = e.attr('data-origPosZ'),
										curComponentNum = parseFloat(i+1);
									
									newPosX = parseFloat(oldPosX) + parseFloat(xDelta);
									//newPosY = parseFloat(posY) + parseFloat(moveYVal);
									newPosZ = parseFloat(oldPosZ) + parseFloat(zDelta);
									
									e.attr('position', newPosX.toString() + " " + oldPosY + " " + newPosZ.toString());

									//console.log(vehicleDataClean.find('component'+curComponentNum));
									vehicleDataClean.find('component'+curComponentNum).attr('position', newPosX.toString() + " " + oldPosY + " " + newPosZ.toString());

								}); //end tmpComponents each
								
								
									
								outputContent = vehicleDataClean.outerHTML();

								for (i=1; i <= numComponents; i++) {
									outputContent = outputContent.replace("></component" + i.toString() + ">", " />");
								};
								
								var camelCaseAttr = [
									"isAbsolute",
									"fillLevel",
									"fillType",
									"fuelFillLevel",
									"grainTankFillLevel",
									"grainTankFruitType",
									"dirtLevel",
									"lastDirection",
									"limiterValues",
									"totalHectars",
									"operatingTime",
									"runningTime",
									"distanceDriven",
									"curW",
									"varTip.activeTipIdx",
									"varTip.isMaster",
									"varTip.trailerNr",
									"varTip.trailerCount",
									"varTip.activeTrailerIdx",
									"varBody.activeIdx",
									"varBody.activeSubIdx",
									"OffsetX",
									"OffsetZ",
									"AbortWork",
									"waitTime",
									"mowers1.setTurnedOn",
									"mowers1.setTransport",
									"mowers1.isWorking",
									"mowers1.isTransport",
									"mowers1.setLiftUp",
									"mowers1.isLiftUp",
									"mowers1.isLiftDown",
									"mowers1.setCllctr",
									"mowers1.isCllctrDown",
									"mowers1.isCllctrUp",
									"mowers1.jnt1.rotL",
									"mowers1.jnt2.rotL",
									"mowers1.jnt3.rotL",
									"mowers2.setTurnedOn",
									"mowers2.setTransport",
									"mowers2.isWorking",
									"mowers2.isTransport",
									"mowers2.setLiftUp",
									"mowers2.isLiftUp",
									"mowers2.isLiftDown",
									"mowers2.setCllctr",
									"mowers2.isCllctrDown",
									"mowers2.isCllctrUp",
									"mowers2.jnt1.rotL",
									"mowers2.jnt2.rotL",
									"mowers2.jnt3.rotL",
									"mowers3.setTurnedOn",
									"mowers3.setTransport",
									"mowers3.isWorking",
									"mowers3.isTransport",
									"mowers3.setLiftUp",
									"mowers3.isLiftUp",
									"mowers3.isLiftDown",
									"mowers3.setCllctr",
									"mowers3.isCllctrDown",
									"mowers3.isCllctrUp",
									"alpMot.setTurnedOn",
									"alpMot.setTransport",
									"alpMot.isWorking",
									"alpMot.isTransport",
									"alpMot.setLiftUp",
									"alpMot.isLiftUp",
									"alpMot.isLiftDown",
									"alpMot.comp1.jointNodeY",
									"typeOnTrailer",
									"ulMode",
									"autoLoad",
									"displayHUD",
									"numBales"
								];
								
								for (i in camelCaseAttr) {
									var cur = camelCaseAttr[i];
									outputContent = outputContent.replace(cur.toLowerCase(), cur);
								};


								$('#output').empty().text(outputContent).show();
						
							} //end stop
					 	}); //end draggable
				}; //end if
			}); //end #origPos on click
			
		$('#origAvgPx').text('origAvg (px): X ' + $('#origPos').css('left') + ' / Z ' + $('#origPos').css('top'));
		$('#origAvgLS').text('origAvg (LS): X ' + origAvg.x + ' / Z ' + origAvg.z);
			
	}); //end button on click
		
	
});
