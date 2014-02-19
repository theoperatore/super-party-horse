/******************************************************************************

Handles loading stationary images such as backgrounds, backdrops,
and foreground elements.

******************************************************************************/
/******************************************************************************

Loads in one image from the filepath

******************************************************************************/
exports.loadImg = function(path, callback) {
	var img = new Image();

	img.addEventListener('load', function(ev) {
		console.log("image loaded", path, ev);


		if (typeof callback === 'function') {
			callback(img);
		}

	});

	img.src = path;
}

/******************************************************************************

Loads all images and calls the callback once all have been loaded.

Right now paths must be an array. Object batchLoad will come later

******************************************************************************/
exports.batchLoad = function(paths, callback) {

	//holds all loaded images
	var out = [];

	for (var i = 0; i < paths.length; i++) {
		var tmpImg = new Image();

		tmpImg.addEventListner('load', function(ev) {
			out.push(tmpImg);

			if (out.length === paths.length) {

				if (typeof callback === 'function') {
					callback(out);
				}
				else {
					console.log('images loaded but callback not specified!');
				}
			}

		});

		tmpImg.src = paths[i];
	}
}