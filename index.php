<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>LS Vehicle Mover</title>
	<link href="css/reset.css" rel="stylesheet" media="all" />
	<link href="css/style.css" rel="stylesheet" media="screen">
</head>

<body>

<header>
	<h1>LS Vehicle Mover</h1>
	<div id="version" rel="version"></div>
</header>

<noscript>You need to have Javascript enabled to proceed.</noscript>

<section id="main">
	<form>
		<fieldset>
			<label class="mainLabel" for="mapurl">PDA Map URL</label> 
			<input id="mapurl" type="url" value="https://i.minus.com/iQ9FCWGeSELE4.jpg" />
		</fieldset>
		<fieldset id="mapsize_set">
			<label class="mainLabel">Map Size</label><br />
			<input id="size2048" name="mapsize" type="radio" value="2048" checked />
			<label class="optionLabel" for="size2048">2048</label>
			<input id="size4096" name="mapsize" type="radio" value="4096" />
			<label class="optionLabel" for="size4096">4096</label>
		</fieldset>
		<fieldset>
			<!--
		<vehicle filename="$moddir$Traecker_IHC_7250_Magnum_v4_Frontlader/Quicke.xml" isAbsolute="true">
		   <component1 position="463.73937988281 86.743011474609 -366.86907958984" rotation="3.1028444766998 0.43292719125748 -3.0927770137787" />
		   <component2 position="464.17687988281 90.057571411133 -368.16381835938" rotation="2.8908975124359 0.43279185891151 -3.0929403305054" />
		</vehicle>
			-->
			<label class="mainLabel" for="vehicleInput">Vehicle code</label>
			<textarea id="vehicleInput" placeholder='<vehicle filename="$moddir$Traecker_IHC_7250_Magnum_v4_Frontlader/Quicke.xml" isAbsolute="true">
		   <component1 position="463.73937988281 86.743011474609 -366.86907958984" rotation="3.1028444766998 0.43292719125748 -3.0927770137787" />
		   <component2 position="464.17687988281 90.057571411133 -368.16381835938" rotation="2.8908975124359 0.43279185891151 -3.0929403305054" />
		</vehicle>'></textarea>
		</fieldset>
		<!--
		<fieldset>
			<label for="moveX">move X</label>
			<input id="moveX" name="move[]" type="number" value="-100" />
			<label for="moveY">move Y</label>
			<input id="moveY" name="move[]" type="number" value="0" />
			<label for="moveZ">move Z</label>
			<input id="moveZ" name="move[]" type="number" value="-100" />
		</fieldset>
		-->
		<fieldset>
			<input id="debugActive" name="debugActive" type="checkbox" />
			<label class="optionLabel" for="debugActive">Show debug information</label>
		</fieldset>
		<button type="submit">Move it!</button>
	</form>
	
	<div id="debug">
		<p id="origAvgPx"></p>
		<p id="origAvgLS"></p>
		<p id="newAvgPx"></p>
		<p id="newAvgLS"></p>
	</div>
	
	<div id="map">
		<img id="tmpMapImg" />
		<div id="origPos" class="pos"></div>
		<!--<div id="newPos" class="pos newpos"></div>-->
	</div>
	<pre id="output"></pre>
	<pre id="tmpOutputClean"></pre>
	<pre id="tmpOutput"></pre>
</section>

<footer>
	<span id="footerContent"><span rel="version"></span> &copy; Jakob Tischler, 2012. All Rights Reserved.</span> <div aria-hidden="true" data-icon="&#x63;"></div> <a href="mailto:jakob.tischler@gmail.com?subject=LS Vehicle Mover" title="Send me a postcard">Contact me</a>
</footer>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script> 
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
<script src="js/lsvm_0.3b.js"></script>

</body>
</html>