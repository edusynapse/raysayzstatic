var galleriainstance;
var gallery ;
const baseurl = window.location.origin + window.location.pathname
var lighboximageindex = 0;
var galleryplaystatus = true;
var commenthoveroutgalleryplaystatus = false;
var showexifhoveroutgalleryplaystatus = false;
var sharebuttonhoveroutgalleryplaystatus = false;
var lightboxgalleryplaystatus = false;
var headerhovergalleryplaystatus = false;
var gallerypicturepausemilliseconds = 2200;
var buttonsvisibile = false; 

jQuery.fn.randomize = function(selector){
    (selector ? this.find(selector) : this).parent().each(function(){
        jQuery(this).children(selector).sort(function(){
            return Math.random() - 0.5;
        }).detach().appendTo(this);
    });

    return this;
}

jQuery.fn.hideuibuttons = function(){
    jQuery('.galleryuibutton').css('opacity','0');
    this.css('opacity','1');
}
jQuery.fn.showuibuttons = function(){
    jQuery('.galleryuibutton').css('opacity','0.7');
    jQuery('.galleryuibutton:hover').css('opacity','1');
}




function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


jQuery(document).ready(function() {
	jQuery('#site-description').css('opacity','0');
	var sitedescription = jQuery('#site-description').text();
	var sitedescription_length = sitedescription.length;
	var animation_timeout;
	var sitedescription_type_substring_index = 1;
	var fadeinopacity = 0.1;
	var fadein_opacityincrement = 1/sitedescription_length;
	(function animationMaker() { 
		animation_timeout = setTimeout(function() {
			sitedescription_type_substring_index++;
			var type = sitedescription.substring(0, sitedescription_type_substring_index);
			jQuery('#site-description').text(type);
			jQuery('#site-description').css('opacity',fadeinopacity);
			fadeinopacity = fadeinopacity + fadein_opacityincrement;
			animationMaker();
			if (sitedescription_type_substring_index == sitedescription_length) {
				clearTimeout(animation_timeout);
			}
		}, 100);
	}());
});
jQuery(document).ready(function() {
	if (jQuery("#customgallery").length) {	  
	
		jQuery('<div id="showlightbox" class="galleryuibutton"><i class="fa fa-picture-o" aria-hidden="true"></i></div>' ).appendTo( "body" );
		jQuery('<div id="fullscreen" class="galleryuibutton"><i class="fa fa-arrows-alt" aria-hidden="true"></i></div>' ).appendTo( "body" );
		jQuery('<div id="playpause" class="galleryuibutton"><i class="fa fa-play play" aria-hidden="true"></i><i class="fa fa-pause pause" aria-hidden="true"></i></div>' ).appendTo( "body" );
		jQuery('div.a2a_default_style').addClass("floatingshare").addClass("galleryuibutton");
		jQuery('<a id="requestoriginallink"  class="galleryuibutton" target="_blank" href=""><i class="fa fa-download" aria-hidden="true"></i></a>' 
).appendTo( "body" );
		jQuery('<div id="showexif"  class="galleryuibutton"></div>' ).appendTo( "body" );
		//mute the buttons till everything loaded
		jQuery('#showlightbox').css('opacity','0');
		jQuery('#fullscreen').css('opacity','0');
		jQuery('#playpause').css('opacity','0');
		jQuery('div.a2a_default_style').css('opacity','0');		
		jQuery('<img id="logoimage" class="logoimage" src="/wp-content/uploads/2024/06/raysayz.png" />' ).prependTo( "header#branding" );
		
		jQuery('<i class="fa fa-comments commentsicon" aria-hidden="true"></i>').prependTo('.commentbox');
		jQuery('.commentbox').hide();
		jQuery('#showexif').hide();
		jQuery('header#branding').addClass("headeroverlay").addClass("galleryuibutton").addClass('toggled-on');
		jQuery('.menu-toggle').hide();
		jQuery('pre').css('height','0px');
		
		
		jQuery('.galleria-stage').hammer().on("doubletap", function(){window.toggleFullScreen() ;}); 
		
		Galleria.run('#customgallery', {
			height : 600,
			wait: true,
			dataSort: 'random',
			transition :'fade',
			transitionSpeed : 1000,
			lightbox:false,
			trueFullscreen:true,
			lightboxTransitionSpeed:0,
			lightboxFadeSpeed:0,
			imagePan : true,
			autoplay : true,
			fullscreenDoubleTap : false,
			carouselSpeed : gallerypicturepausemilliseconds
		});
		
			
		Galleria.ready(function() {
			gallery = this;
			// keyboard navigation 
			this.attachKeyboard({
				right: this.next,
				left: this.prev,
				down: function() {
					// custom up action
					this.pause();
				},
				up: function() {
					// custom up action
					this.play(gallerypicturepausemilliseconds);
				},
				13: function() {
					// start playing when return (keyCode 13) is pressed:
					this.playToggle();
				}
			});

			this.bind("image", function(e) {
				imagename = e.imageTarget.currentSrc;
				lighboximageindex = e.index;
				//console.log(e);
				let url = imagename;
				let urlKey = url.replace(/\/\s*$/, "").split('/').pop();
				let image = urlKey.split('.').shift();
				var finalimage = '';
				if (image.indexOf('_') > -1)	{
				  finalimage = urlKey.split('_').shift();
				} else {
				  finalimage = image;
				}
				//console.log(finalimage)
				let urldisplay = e.imageTarget.currentSrc;
				let urldisplayencoded = encodeURIComponent(urldisplay);
				jQuery(".commentbox").hide();
				jQuery(".commentbox").removeClass("commentboxshow");
				jQuery('#' + finalimage ).addClass("commentboxshow").addClass("galleryuibutton");
				jQuery(".commentbox.commentboxshow").show();				
				jQuery("#requestoriginallink").attr('href', '/request-original-images/?photoname='
									+ finalimage 
									+'&urldisplayencoded='
									+ urldisplayencoded);
				//make sure the bookmark url points to right image
				var bookmarkurl = baseurl + '?urldisplayencoded='+ urldisplayencoded;
				//add to any update
				jQuery('.a2a_kit').attr("data-a2a-url",bookmarkurl);
				jQuery('.a2a_kit').attr("data-a2a-title",jQuery(document).find("title").text());
				//console.log(bookmarkurl);
				//console.log(jQuery(document).find("title").text());
				
				if (!buttonsvisibile) {
					jQuery('#showlightbox').css('opacity','0.7');
					jQuery('#fullscreen').css('opacity','0.7');
					jQuery('#playpause').css('opacity','0.7');
					jQuery('div.a2a_default_style').css('opacity','0.7');
		
					buttonsvisibile = true;
				}
				
				
				var img = this.getActiveImage();
				EXIF.getData(img, function() {
					//var allMetaData = EXIF.getAllTags(this);
					//console.log( allMetaData);		
					var imageexifdata = {};
					imageexifdata['make'] = EXIF.getTag(this, "Make");
					if ( imageexifdata['make'] != null) {
						imageexifdata['model']  = EXIF.getTag(this, "Model");
						imageexifdata['fnumber']  = 'F'+EXIF.getTag(this, "FNumber");
						imageexifdata['focallength']  = EXIF.getTag(this, "FocalLength") + 'mm';
						imageexifdata['iso']  = 'ISO-' + EXIF.getTag(this, "ISOSpeedRatings");
						imageexifdata['whitebalance']  = EXIF.getTag(this, "WhiteBalance");
						imageexifdata['shutterspeed']  = 'Shutter : 1/' + Math.round(1/(EXIF.getTag(this, "ExposureTime"))) + ' s';
						//console.log( imageexifdata);
						
						var cameraDetailsHTML = '<div class="cameradetails">' 	
										+ imageexifdata['make'] 
										+ ' <i class="fa fa-circle" aria-hidden="true"></i> ' 
										+ imageexifdata['model'] + '<br/>';
						cameraDetailsHTML = cameraDetailsHTML + imageexifdata['shutterspeed'] + '<br/>';
						cameraDetailsHTML = cameraDetailsHTML 
											+ imageexifdata['fnumber'] 
											+ ' <i class="fa fa-circle" aria-hidden="true"></i> ' 
											+ imageexifdata['focallength'] 
											+ ' <i class="fa fa-circle" aria-hidden="true"></i> ' 
											+ imageexifdata['iso'] + '<br/>';
						cameraDetailsHTML = cameraDetailsHTML + imageexifdata['whitebalance'] + '<br/>' + '</div>';
						var exifHTML = JSON
								.stringify(imageexifdata, null, 6)
								.replace(/\n( *)/g, function (match, p1) {
									 return '<br>' + ' '.repeat(p1.length);
								     });
						//console.log(cameraDetailsHTML);		
						jQuery("#showexif").children('i').remove();				
						jQuery("#showexif").children('.cameradetails').remove();			
						jQuery("#showexif").children('.koandetails').remove();
						jQuery('<i class="fa fa-camera-retro cameraicon" aria-hidden="true"></i></div>' ).appendTo( "#showexif" );
						jQuery(cameraDetailsHTML).appendTo( "#showexif" );
						jQuery('#showexif').show();
					} else {		
						var koan = jQuery('pre.'+finalimage).clone();
						koan.addClass('koandetails');
						//console.log(koan);
						if ( koan.length > 0 ) {				
							koan.css('height','auto');			
							jQuery("#showexif").children('i').remove();				
							jQuery("#showexif").children('.cameradetails').remove();			
							jQuery("#showexif").children('.koandetails').remove();						
							jQuery('<i class="fa fa-lightbulb-o" aria-hidden="true"></i></div>' ).appendTo( "#showexif" );
							koan.appendTo('#showexif');	
							jQuery('#showexif').addClass('shaker'); 
							setTimeout(function(){
								jQuery('#showexif').removeClass('shaker'); 
							   },700);
							gallerypicturepausemilliseconds = 5000;	
							jQuery('#showexif').show();
						} else jQuery('#showexif').hide();
						
					}
				});
		
			}); 
			this.bind("lightbox_image", function(e) {
				var imgurl  = e.imageTarget.currentSrc;
				//console.log(imgurl);
				jQuery.each(galleriainstance, function(index){
					//console.log(this.big);
					var checkequal = this.big.search(imgurl);
					if (checkequal >=0) lighboximageindex = index;
				});
				//console.log(lighboximageindex);
				let urlKey = imgurl.replace(/\/\s*$/, "").split('/').pop();
				let image = urlKey.split('.').shift();
				var finalimage = '';
				if (image.indexOf('_') > -1)	{
				  finalimage = urlKey.split('_').shift();
				} else {
				  finalimage = image;
				}
				//console.log(finalimage)
				let urldisplayencoded = encodeURIComponent(imgurl);
				var urldisplay = baseurl + '?urldisplayencoded=' + urldisplayencoded;
				jQuery.ajax({
					url: "https://plausible.io/api/event",
					method: "POST", // First change type to method here    
					dataType : "json",
					contentType: "application/json; charset=utf-8",
					data: '{"name":"image-max-view","url":"'+urldisplay+'","domain":"raysayz.com"}',
					success: function(response) {
					    console.log("ok");
					},
					error: function(error) {
					    console.log("error" + error);
					}
				}); 	
							}); 
			this.bind("lightbox_close", function(e) {	
				jQuery('.a2a_kit').show();		
				jQuery('.commentboxshow').show();	
				jQuery("#requestoriginallink").show();	
				jQuery("#showlightbox").show();	
				jQuery("header#branding").show();
				jQuery("#fullscreen").show();	
				jQuery("#showexif").show();	
				if (lighboximageindex >=0 ) 	{
					this.show(lighboximageindex);				
				}				
				if (lightboxgalleryplaystatus) {
					this.play(gallerypicturepausemilliseconds) ;
					lightboxgalleryplaystatus = false;
				}					
			}); 
			this.bind("lightbox_open", function(e) {		
				jQuery('.a2a_kit').hide();		
				jQuery('.commentboxshow').hide();	
				jQuery("#requestoriginallink").hide();	
				jQuery("#showlightbox").hide();	
				jQuery("header#branding").hide();	
				jQuery("#fullscreen").hide();	
				jQuery("#showexif").hide();	
				jQuery(".galleria-lightbox-close").html('<i class="fa fa-times-circle" aria-hidden="true"></i>');		
				if (galleryplaystatus) {
					this.pause() ;
					lightboxgalleryplaystatus = true;
				}			
			}); 
			this.bind("pause", function(e) {
				galleryplaystatus = false;	
				jQuery('#playpause .play').show();
				jQuery('#playpause .pause').hide();							
			}); 
			this.bind("play", function(e) {		
				galleryplaystatus = true;	
				jQuery('#playpause .play').hide();
				jQuery('#playpause .pause').show();				
			}); 
			
		});
		    
		//jQuery("div.a2a_default_style").css("bottom", "90px");		
		jQuery('#showlightbox').click(function(e) {	
			var currentIndex = gallery.getIndex();
			//console.log(currentIndex) ;
			gallery.openLightbox(currentIndex);
			//return false;
		});

		jQuery('#fullscreen').click(function(e) {	
			window.toggleFullScreen() ;
			//return false;
		});
		
		
		jQuery('#playpause .play').hide();
				
		jQuery('#playpause').click(function(e) {			
			if (jQuery('.play').is(":visible")) {
				gallery.play(gallerypicturepausemilliseconds) ;
				gallery.next();
			} else {
				gallery.pause() ;				
			}
			//return false;
		});

/**
		jQuery('.commentboxshow').on("mouseover", function() {
			jQuery('.commentboxshow:hover').css("height", jQuery('.commentboxshow iframe').contents().height());	
		});

**/
		jQuery('.commentbox').on("mouseover", function() {
			jQuery('.commentbox').hideuibuttons();	
			if (galleryplaystatus) {
				gallery.pause() ;
				commenthoveroutgalleryplaystatus = true;
			}	
		});
		jQuery('.commentbox').on("mouseout", function() {
			jQuery('.commentbox').showuibuttons();	
			if (commenthoveroutgalleryplaystatus) {
				gallery.play(gallerypicturepausemilliseconds) ;
				commenthoveroutgalleryplaystatus = false;
			}	
		});
		jQuery('.floatingshare').on("mouseover", function() {
			jQuery('.floatingshare').hideuibuttons();	
			if (galleryplaystatus) {
				gallery.pause() ;
				sharebuttonhoveroutgalleryplaystatus = true;
			}				
		});
		jQuery('.floatingshare').on("mouseout", function() {
			jQuery('.floatingshare').showuibuttons();	
			if (sharebuttonhoveroutgalleryplaystatus) {
				gallery.play(gallerypicturepausemilliseconds) ;
				sharebuttonhoveroutgalleryplaystatus = false;
			}				
		});
		jQuery('.headeroverlay').on("mouseover", function() {
			jQuery('.headeroverlay').hideuibuttons();	
			if (galleryplaystatus) {
				gallery.pause() ;
				headerhovergalleryplaystatus = true;
			}	
		});
		jQuery('.headeroverlay').on("mouseout", function() {
			jQuery('.headeroverlay').showuibuttons();	
			if (headerhovergalleryplaystatus) {
				gallery.play(gallerypicturepausemilliseconds) ;
				headerhovergalleryplaystatus = false;
			}	
		});
		
		jQuery('#showexif').on("mouseover", function() {
			console.log("hello");
			jQuery('#showexif').hideuibuttons();	
			if (galleryplaystatus) {
				gallery.pause() ;
				showexifhoveroutgalleryplaystatus = true;
			}		
		});
		jQuery('#showexif').on("mouseout", function() {
			jQuery('#showexif').showuibuttons();	
			if (showexifhoveroutgalleryplaystatus) {
				gallery.play(gallerypicturepausemilliseconds) ;
				showexifhoveroutgalleryplaystatus = false;
			}				
		});				
		//console.log(Galleria.get('stage')[0]['_original']['data']) ;		
		var imageurl=decodeURIComponent(jQuery.urlParam('urldisplayencoded'));	
		//console.log(imageurl) ;
		
		//console.log( Galleria.get('img')) ;
		var bookmarkedimageindex = -1;
		galleriainstance = Galleria.get('stage')[0]['_original']['data'];
		jQuery.each(galleriainstance, function(index){
			//console.log(this.big);
			var checkequal = this.big.search(imageurl);
			if (checkequal >=0) bookmarkedimageindex = index;
		});
		//console.log(bookmarkedimageindex) ;
		if (bookmarkedimageindex >=0 ) 	{
			Galleria.configure({
				show : bookmarkedimageindex
			});
			Galleria.run();
		}
		gallery.pause() ;
		gallery.play(gallerypicturepausemilliseconds) ;
		
		
	}
});


jQuery.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null) {
		return null;
	}
	return decodeURI(results[1]) || 0;
}