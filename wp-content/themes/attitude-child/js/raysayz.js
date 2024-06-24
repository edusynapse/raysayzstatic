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

jQuery.fn.randomize = function(selector){
    (selector ? this.find(selector) : this).parent().each(function(){
        jQuery(this).children(selector).sort(function(){
            return Math.random() - 0.5;
        }).detach().appendTo(this);
    });

    return this;
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
	if (jQuery("#customgallery").length) {	  
	
		jQuery('<div id="showlightbox"><i class="fa fa-picture-o" aria-hidden="true"></i></div>' ).appendTo( "body" );
		jQuery('<div id="showexif"><i class="fa fa-camera-retro cameraicon" aria-hidden="true"></i></div>' ).appendTo( "body" );
		jQuery('<div id="fullscreen"><i class="fa fa-arrows-alt" aria-hidden="true"></i></div>' ).appendTo( "body" );
		jQuery('<div id="playpause"><i class="fa fa-play play" aria-hidden="true"></i><i class="fa fa-pause pause" aria-hidden="true"></i></div>' ).appendTo( "body" );
		jQuery('div.a2a_default_style').addClass("floatingshare");
		jQuery('.commentbox').hide();
		jQuery('header#branding').addClass("headeroverlay");
		jQuery('header#branding').addClass('toggled-on');
		jQuery('.menu-toggle').hide();

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
			fullscreenDoubleTap : false
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
					this.play(2200);
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
				jQuery("#requestoriginallink").remove();
				jQuery(".commentsicon").remove();
				jQuery(".commentbox").hide();
				jQuery(".commentbox").removeClass("commentboxshow");
				jQuery('#' + finalimage ).addClass("commentboxshow");
				jQuery(".commentbox.commentboxshow").show();
				jQuery('<a id="requestoriginallink" target="_blank" href="/request-original-images/?photoname='
									+ finalimage 
									+'&urldisplayencoded='
									+ urldisplayencoded 
									+'"><i class="fa fa-download" aria-hidden="true"></i></a>' 
					).insertBefore('.commentboxshow');
				jQuery('<i class="fa fa-comments commentsicon" aria-hidden="true"></i>').prependTo('.commentboxshow');
				//make sure the bookmark url points to right image
				var bookmarkurl = baseurl + '?urldisplayencoded='+ urldisplayencoded;
				//add to any update
				jQuery('.a2a_kit').attr("data-a2a-url",bookmarkurl);
				jQuery('.a2a_kit').attr("data-a2a-title",jQuery(document).find("title").text());
				//console.log(bookmarkurl);
				//console.log(jQuery(document).find("title").text());
				
				
				var img = this.getActiveImage();
				EXIF.getData(img, function() {
					//var allMetaData = EXIF.getAllTags(this);
					//console.log( allMetaData);					
					jQuery('.cameradetails').remove();
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
						
						var cameraDetailsHTML = '<div class="cameradetails">' 	+ imageexifdata['make'] 
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
						jQuery(cameraDetailsHTML).appendTo( "#showexif" );
						
						//var allMetaDataSpan = document.getElementById("allMetaDataSpan");
						//allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
						jQuery('#showexif').show();						
						jQuery('#showexif i.fa').removeClass('fa-lightbulb-o')
												.removeClass('fa-camera-retro')
												.removeClass('cameraicon')
												.addClass('cameraicon')
												.addClass('fa-camera-retro');
					} else {		
						var koan = jQuery('pre.'+finalimage).clone();									
						if ( koan != null) {
							jQuery('#showexif pre').remove();
							jQuery('#showexif i.fa').removeClass('fa-camera-retro')
													.removeClass('cameraicon')
													.removeClass('fa-lightbulb-o')
													.addClass('fa-lightbulb-o');
							koan.appendTo('#showexif');				
							jQuery('#showexif').show();		
							jQuery('#showexif').addClass('shaker'); 
							setTimeout(function(){
								jQuery('#showexif').removeClass('shaker'); 
							   },500000);
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
				if (lighboximageindex >=0 ) 	{
					this.show(lighboximageindex);				
				}				
				if (lightboxgalleryplaystatus) {
					this.play(2200) ;
					lightboxgalleryplaystatus = false;
				}					
			}); 
			this.bind("lightbox_open", function(e) {		
				jQuery('.a2a_kit').hide();		
				jQuery('.commentboxshow').hide();	
				jQuery("#requestoriginallink").hide();	
				jQuery("#showlightbox").hide();	
				jQuery("header#branding").hide();	
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
				gallery.play(2200) ;
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
			if (galleryplaystatus) {
				gallery.pause() ;
				commenthoveroutgalleryplaystatus = true;
			}	
		});
		jQuery('.commentbox').on("mouseout", function() {
			if (commenthoveroutgalleryplaystatus) {
				gallery.play(2200) ;
				commenthoveroutgalleryplaystatus = false;
			}	
		});
		jQuery('#showexif').on("mouseover", function() {
			if (galleryplaystatus) {
				gallery.pause() ;
				showexifhoveroutgalleryplaystatus = true;
			}			
		});
		jQuery('#showexif').on("mouseout", function() {
			if (showexifhoveroutgalleryplaystatus) {
				gallery.play(2200) ;
				showexifhoveroutgalleryplaystatus = false;
			}				
		});
		jQuery('.floatingshare').on("mouseover", function() {
			if (galleryplaystatus) {
				gallery.pause() ;
				sharebuttonhoveroutgalleryplaystatus = true;
			}				
		});
		jQuery('.floatingshare').on("mouseout", function() {
			if (sharebuttonhoveroutgalleryplaystatus) {
				gallery.play(2200) ;
				sharebuttonhoveroutgalleryplaystatus = false;
			}				
		});
		jQuery('.headeroverlay').on("mouseover", function() {
			if (galleryplaystatus) {
				gallery.pause() ;
				headerhovergalleryplaystatus = true;
			}	
		});
		jQuery('.headeroverlay').on("mouseout", function() {
			if (headerhovergalleryplaystatus) {
				gallery.play(2200) ;
				headerhovergalleryplaystatus = false;
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
		gallery.play(2200) ;
		
		
	}
});

jQuery.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null) {
		return null;
	}
	return decodeURI(results[1]) || 0;
}