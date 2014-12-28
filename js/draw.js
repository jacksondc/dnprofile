
    var profileOrHeader = '#ProfilePicture'; //'.PixelCoverPhoto';
    var cells = $(profileOrHeader + ' .Cell');

    cells.each(function(b){
         var a = 0;
         while(this.style.backgroundColor!='rgb(255, 255, 255)') {
             $(this).trigger('mousedown').trigger('mouseup');

         }
        for(var i = 0; i < newImage[b]; i++) {
             $(this).trigger('mousedown').trigger('mouseup')
         }
    });
