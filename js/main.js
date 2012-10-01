var original_image = new Image(),
	canvas = document.getElementById('nitro'), //canvas element
	canvas_context = canvas.getContext('2d'), //2d context
	image_data = [], //pixel data of image in array form
	block_size = 40, //block size, for now, even square
	individual_blocks = [], 
	width = canvas.width, //total width
	height = canvas.height;//total height


//Set load handler and image source
original_image.onload = imageLoaded;
original_image.src = "img/abarth.jpg";


//On image load draw image to canvas
function imageLoaded(ev){
	if (canvas.getContext){
		original_image = ev.target; // the image, assumed to be 200x200

		//Position original image on canvas
		canvas_context.drawImage(original_image, 0, 0);
		parseImage();
	}else{
		console.log('!!! Canvas not supported !!!');
	}
}


function parseImage(){
	var image_data = canvas_context.getImageData(0, 0, width, height),
		x = 0,
		y = 0,
		start_x = 0,
		start_y = 0;

	//Get blocks of pixels based on block size. Canvas (width*4)*height
	for(x = 0; x < width; x++){
		if(x%block_size === 0){
			start_x = x*4; //Account for 4 values per pixel (r,g,b,a)
			for(y = 0; y < height; y++){
				if(y%block_size === 0){
					start_y = y;
					console.log(canvas_context.getImageData(start_x, start_y, block_size, block_size));
					individual_blocks.push(canvas_context.getImageData(start_x, start_y, block_size, block_size));
				}
			}
		}
	}

	//should be 280
	console.log("total blocks", individual_blocks.length, individual_blocks);


		// for (x = 0; x < width; x++){

		// 	var r = image_data.data[inital_position++] * 5, //red
		// 		g = image_data.data[inital_position++], //green
		// 		b = Math.min(255, image_data.data[inital_position++]), //blue
		// 		a = image_data.data[inital_position++]; //alpha

		// 	image_data.data[output_position++] = r;
		// 	image_data.data[output_position++] = g;
		// 	image_data.data[output_position++] = b;
		// 	image_data.data[output_position++] = a;
		// }

	//}

	// put pixel data on canvas
	canvas_context.putImageData(individual_blocks[197], 0, 0);

}

