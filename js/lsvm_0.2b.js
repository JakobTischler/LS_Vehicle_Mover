/*
 * @author: Jakob Tischler
 * @date: 15 September 2012
 * @version: 0.2 beta
 * @contact: jakob -dot- tischler -ätt- gmail -dot- com
 */

$(document).ready(function () {
	$.fn.outerHTML = function() {
		return $('<div>').append( this.eq(0).clone() ).html();
	};

	var form = $('form'),
		vehInput = $('textarea'),
		moveX = $('#moveX'),
		moveY = $('#moveY'),
		moveZ = $('#moveZ');
		
	$('button').on('click', function(event) {
		event.preventDefault();
		var vehicleData = vehInput.val(),
			vehicleData = $($.trim(vehicleData)),
			moveXVal = moveX.val(),
			moveYVal = moveY.val(),
			moveZVal = moveZ.val(),
			map = $('#map');
			
		/** VEHICLE DATA **/
		var vehName = vehicleData.attr('filename'),
			vehNameLength = vehName.length,
			lastSlash = vehName.lastIndexOf('/'),
			vehName = vehName.substr(lastSlash + 1),
			vehNameTitle = vehName.substr(0, vehName.length - 4);
			components = vehicleData.find('*'),
			numComponents = components.length;
			
		origAvgAr = new Array(0, 0, 0);
		newAvgAr = new Array(0, 0, 0);
		
		components.each(function(i) {
			var e = $(this),
				pos = e.attr('position').split(' '),
				posX = pos[0],
				posY = pos[1],
				posZ = pos[2];
			
			for (a in origAvgAr) {
				origAvgAr[a] = origAvgAr[a] + parseFloat(pos[a]);
			};
			
			newPosX = parseFloat(posX) + parseFloat(moveXVal);
			newPosY = parseFloat(posY) + parseFloat(moveYVal);
			newPosZ = parseFloat(posZ) + parseFloat(moveZVal);
			
			//console.log("Component"+(parseFloat(i)+1)+": X "+newPosX+" // Y "+newPosY+" // Z "+newPosZ)
			
			newAvgAr[0] = newAvgAr[0] + newPosX;
			newAvgAr[1] = newAvgAr[1] + newPosY;
			newAvgAr[2] = newAvgAr[2] + newPosZ;

			//console.log("Component"+(parseFloat(i)+1)+" new avg: X "+newAvgAr[0]+" // Y "+newAvgAr[1]+" // Z "+newAvgAr[2])
			
			e.attr('position', newPosX.toString() + " " + newPosY.toString() + " " + newPosZ.toString());
		});
		
		for (i in origAvgAr) {
			origAvgAr[i] = origAvgAr[i]/numComponents;
		};
		for (i in newAvgAr) {
			newAvgAr[i] = newAvgAr[i]/numComponents;
		};

		var origAvg = { x: origAvgAr[0], y: origAvgAr[1], z: origAvgAr[2] },
			newAvg = { x: newAvgAr[0], y: newAvgAr[1], z: newAvgAr[2] };
			
		$('#origAvg').text('origAvg: X '+origAvg.x+' / Y '+origAvg.y+' / Z '+origAvg.z);
		$('#newAvg').text('newAvg: X '+newAvg.x+' / Y '+newAvg.y+' / Z '+newAvg.z);

		
		/* MAP */
		map.show().css('background-image', 'url(' + $('#mapurl').val() + ')');
		/*
		var tmpImg = $('#tmpMapImg');
		
		tmpImg.attr('src', $('#mapurl').val());
		mapHeightRatio = tmpImg.height() / map.height();
		mapWidthRatio = tmpImg.width() / map.width();
		
		console.log(mapHeightRatio + " / " + mapWidthRatio);
		*/

		var mapCenterX = map.width() / 2, 
			mapCenterY = map.height() / 2;
			
		$('#origPos').css({ //map is 2048*2048, hence dividing by 2
			left: mapCenterX + origAvg.x / 2, 
			top: mapCenterY + origAvg.z / 2
		})
			.attr('data-title', vehNameTitle)
			.attr('title', "X: "+origAvg.x+" / Z: "+origAvg.z)
			.attr('data-origPosX', origAvg.x)
			.attr('data-origPosZ', origAvg.z)
			.on('click', function() {
				var e = $(this),
					title = e.attr('data-title');
				
				if ( $('.newpos[data-title="'+title+'"]').length < 1 ) {
					e.clone()
						.attr('id', 'newPos')
						.addClass('newpos')
						.appendTo(map)
						.draggable({
							containment: "parent",
							drag: function(event, ui) {
								var newE = $('#newPos'),
									newPosItemX = (parseFloat(newE.css('left')) - mapCenterX) * 2,
									newPosItemZ = (parseFloat(newE.css('top')) - mapCenterY) * 2;
									//xDelta = newPosItemX - origAvg.x,
									//zDelta = newPosItemZ - origAvg.z;
								newE.attr('title', 'X: '+newPosItemX + ' // Z: ' + newPosItemZ);
								$('#newAvgDrag').text('X: '+newPosItemX + ' // Z: ' + newPosItemZ);
							},
							stop: function(event, ui) {
								var newE = $('#newPos'),
									newPosItemX = (parseFloat(newE.css('left')) - mapCenterX) * 2,
									newPosItemZ = (parseFloat(newE.css('top')) - mapCenterY) * 2,
									xDelta = newPosItemX - origAvg.x,
									zDelta = newPosItemZ - origAvg.z;
								console.log("xDelta: " + xDelta + " // zDelta:" + zDelta);

								components.each(function(i) {
									var e = $(this),
										pos = e.attr('position').split(' '),
										oldPosX = pos[0],
										oldPosY = pos[1],
										oldPosZ = pos[2];
									
									newNewPosX = parseFloat(oldPosX) + parseFloat(xDelta);
									//newPosY = parseFloat(posY) + parseFloat(moveYVal);
									newNewPosZ = parseFloat(oldPosZ) + parseFloat(zDelta);
									
									e.attr('position', newNewPosX.toString() + " " + oldPosY + " " + newNewPosZ.toString());

									outputContent = vehicleData.outerHTML();
									outputContentArray = outputContent.split('\n');
									
									for (i=1; i <= numComponents; i++) {
										outputContent = outputContent.replace("></component" + i.toString() + ">", " />");
									};
									
									
									
									$('#output').empty().text(outputContent);
								});
						
							}
					 	});
					/*
					var newPosItem = $('#newPos'),
						newPosItemX = (parseFloat(newPosItem.css('left')) - mapCenterX) * 2,
						newPosItemY = (parseFloat(newPosItem.css('top')) - mapCenterY) * 2;
					
					newPosItem.attr('title', 'X: '+newPosItemX + ' // Z: ' + newPosItemZ);
					*/
				};
			});

		
		/*
		outputContent = vehicleData.outerHTML();
		outputContentArray = outputContent.split('\n');
		
		for (i=1; i <= numComponents; i++) {
			outputContent = outputContent.replace("></component" + i.toString() + ">", " />");
		};
		
		
		
		$('#output').empty().text(outputContent);
		*/
	});
		
	
});
