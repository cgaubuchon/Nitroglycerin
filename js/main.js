var original_image = new Image(),
	canvas = document.getElementById('nitro'), //canvas element
	canvas_context = canvas.getContext('2d'), //2d context
	image_data = [], //pixel data of image in array form
	block_size = 40, //block size, for now, even square
	width = canvas.width, //total width
	height = canvas.height, //total height
	individual_blocks = [];

//Set load handler and image source
original_image.onload = imageLoaded;
original_image.src = "img/abarth.jpg";
//original_image.src = "img/abarth_test.jpg"; //Test Image with numbers for correct grid placement

//Helper function to normalize value passed
function normalize(value){
	return value / 255;
}

//On image load draw image to canvas
function imageLoaded(ev){
	if (canvas.getContext){
		original_image = ev.target; // the image, assumed to be 200x200

		//Position original image on canvas
		canvas_context.drawImage(original_image, 0, 0);
		parseImage('multiply');
	}else{
		console.log('!!! Canvas not supported !!!');
	}
}

//Parse the provided image into block sizes defined by "block_size"
function parseImage(mode){
	var image_data = canvas_context.getImageData(0, 0, width, height),
		x = 0,
		y = 0,
		start_x = 0,
		start_y = 0,
		index = 0;

	//Get blocks of pixels based on block size. Canvas (width*4)*height
	for(x = 0; x < width; x++){
		if(x%block_size === 0){
			start_x = x; //Account for 4 values per pixel (r,g,b,a)
			for(y = 0; y < height; y++){
				if(y%block_size === 0){
					start_y = y;
					//console.log(index, start_x, start_y ,canvas_context.getImageData(start_x, start_y, block_size, block_size));
					individual_blocks[index++] = canvas_context.getImageData(start_x, start_y, block_size, block_size);
				}
			}
		}
	}


	applyStyle(mode);
}

//Randomly apply the styles needed for each block in grid system
function applyStyle(mode){
	var x = 0,
		i = 0,
		has_style = false;

	for (x = 0; x < individual_blocks.length; x++){
		//Generate random number
		if(Math.floor(Math.random() * (1 - 0 + 1)) + 0){
			has_style = true;
		}else{
			has_style = false;
		}

		console.log(has_style);

		for(i = 0; i < individual_blocks[x].data.length; i++){
			var current_image_edit = individual_blocks[x],
				inital_position = i * 4,
				output_position = inital_position,
				r = current_image_edit.data[inital_position++], //red
				g = current_image_edit.data[inital_position++], //green
				b = current_image_edit.data[inital_position++], //blue
				a = current_image_edit.data[inital_position++]; //alpha

			if(has_style === true){
				switch(mode){
					case 'multiply':
						r = (r*r) / 0xff;//red
						g = (g*g) / 0xff;//green
						b = (b*b) / 0xff;//blue
					break;
					case 'colorBurn':
						r = (r*r) / 0xff;//red
						g = (g*g) / 0xff;//green
						b = (b*b) / 0xff;//blue
					break;
				}
			}

			current_image_edit.data[output_position++] = r;
			current_image_edit.data[output_position++] = g;
			current_image_edit.data[output_position++] = b;
			current_image_edit.data[output_position++] = a;

			individual_blocks[x].data = current_image_edit.data;
		}
	}

	writeToCanvas();
}

//Re-assemble the grid with applied styles and write to page
function writeToCanvas(){
	//Create off-screen canvas
	var temp_canvas = document.createElement('canvas'),
		temp_canvas_context = temp_canvas.getContext('2d'),
		write_y = 0,
		write_x = 0;
	
	temp_canvas.width = width;
	temp_canvas.height = height;
	
	// put pixel data on canvas
	for (x = 0; x < individual_blocks.length; x++){
		//reset to create a new row of blocks
		if(write_y * block_size > height - block_size){
			write_y = 0;
			write_x++;
		}
		//Write to temp canvas
		temp_canvas_context.putImageData(individual_blocks[x], write_x*block_size, write_y*block_size);
		//Increment row count
		write_y++;
	}

	//Write to final canvas fully rendered effects
	canvas_context.drawImage(temp_canvas, 0, 0);
	
}
