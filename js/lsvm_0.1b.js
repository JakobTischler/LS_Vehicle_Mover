/*
 * @author: Jakob Tischler
 * @date: 15 September 2012
 * @version: 0.1 beta
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
			
		avg = new Array(0, 0, 0);
		newAvg = new Array(0, 0, 0);
		
		components.each(function() {
			var e = $(this),
				pos = e.attr('position').split(' '),
				posX = pos[0],
				posY = pos[1],
				posZ = pos[2];
			
			for (i in avg) {
				avg[i] = avg[i] + parseFloat(pos[i]);
			};
			
			newPosX = parseFloat(posX) + parseFloat(moveXVal);
			newPosY = parseFloat(posY) + parseFloat(moveYVal);
			newPosZ = parseFloat(posZ) + parseFloat(moveZVal);
			
			newAvg[0] = newAvg[0] + newPosX;
			newAvg[1] = newAvg[1] + newPosY;
			newAvg[2] = newAvg[2] + newPosZ;
			
			e.attr('position', newPosX.toString() + " " + newPosY.toString() + " " + newPosZ.toString());
		});
		
		for (i in avg) {
			avg[i] = avg[i]/numComponents;
		};
		for (i in newAvg) {
			newAvg[i] = newAvg[i]/numComponents;
		};
		$('#origAvg').text('origAvg: X '+avg[0]+' / Y '+avg[1]+' / Z '+avg[2]);
		$('#newAvg').text('newAvg: X '+newAvg[0]+' / Y '+newAvg[1]+' / Z '+newAvg[2]);
		
		/* MAP */
		map.show().css('background-image', 'url(' + $('#mapurl').val() + ')');
		var tmpImg = $('#tmpMapImg');
		
		tmpImg.attr('src', $('#mapurl').val());
		mapHeightRatio = tmpImg.height() / map.height();
		mapWidthRatio = tmpImg.width() / map.width();
		
		console.log(mapHeightRatio + " / " + mapWidthRatio);

		var mapCenterX = map.width() / 2, 
			mapCenterY = map.height() / 2;
		$('#origPos').css({
			left: mapCenterX + avg[0] / 2,
			top: mapCenterY + avg[2] / 2
		}).attr('data-title', vehNameTitle).attr('title', "X: "+avg[0]+" / Z: "+avg[2]);
		
		$('#newPos').css({
			left: mapCenterX + newAvg[0] / 2,
			top: mapCenterY + newAvg[2] / 2
		}).attr('data-title', vehNameTitle).attr('title', "X: "+newAvg[0]+" / Z: "+newAvg[2]);
		
		
		outputContent = vehicleData.outerHTML();
		outputContentArray = outputContent.split('\n');
		
		for (i=1; i <= numComponents; i++) {
			outputContent = outputContent.replace("></component" + i.toString() + ">", " />");
		};
		
		
		
		$('#output').empty().text(outputContent);
			
	});
		
	
});
