imageFile = null;
isProfile = null;
profileOrHeaderSelector = null;

Dropzone.options.image = {
  uploadMultiple: false,
  acceptedFiles: 'image/*',
  dictDefaultMessage: 'Upload an image',
  dictRemoveFile: 'Remove',
  dictMaxFilesExceeded: '',
  maxFiles: 1,
  thumbnailHeight: "100",
  previewTemplate: '<div class="dz-preview dz-file-preview">' +
          '<div class="dz-details">' +
            '<img class="dz-thumbnail" data-dz-thumbnail />' +
          '</div>' +
          '<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>' +
        '</div>',
  init: function() {
    var context = this;
    context.on("addedfile", function() {
      if (this.files[1]!=null){
        this.removeFile(this.files[0]);
      }
    });
    context.on('sending', function(file) {
      imageFile = file;
      //don't remove because that will
      //disable the image preview
      //context.removeFile(file);
    });
  }
};

window.onload = function() {
  var inputs = [document.getElementById('getColorsCode'), document.getElementById('writeCode')];
  for(var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('click', function() {
      this.select();
    });
  }
}

var colors = [];

function drawImage(imageObj) {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var imageWidth;
    var imageHeight;

    if(isProfile) {
      imageWidth = 20;
      imageHeight = 20;
    } else {
      imageWidth = 62;
      imageHeight = 29;
    }

    context.drawImage(imageObj, 0, 0, imageWidth, imageHeight);

    var imageData = context.getImageData(0,0, imageWidth, imageHeight);
    var data = imageData.data;

    image = [];

    // iterate over all pixels
    for(var i = 0; i < data.length; i += 4) {
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        var alpha = data[i + 3];

        matchFound = false;
        differences = [];
        for(var e = 0; e < colors.length; e++) {
          diffR = Math.abs(colors[e][0] - red);
          diffG = Math.abs(colors[e][1] - green);
          diffB = Math.abs(colors[e][2] - blue);
          differences.push(diffR + diffG + diffB);
        }
        min = 256*3;
        minIndex = -1;
        for(var e = 0; e < differences.length; e++) {
          if(differences[e] < min) {
            min = differences[e];
            minIndex = e;
          }
        }
        image.push('0123456789abcdefghijklmnopqrstuvwxyz'.charAt(minIndex));
    }

    imageString = image.join('');

    document.getElementById('writeCode').value = 'var newImage="' + imageString + '",cells=$("' + profileOrHeaderSelector + ' .Cell");cells.each(function(e){for(;"rgb(255, 255, 255)"!=this.style.backgroundColor;)$(this).trigger("mousedown").trigger("mouseup");for(var r=0;r<newImage[e];r++)$(this).trigger("mousedown").trigger("mouseup")});';
}

document.getElementById('submitStep1').addEventListener('click', function() {
  var somethingChecked = true;
  if(document.getElementById('profile').checked) {
    isProfile = true;
    profileOrHeaderSelector = '#ProfilePicture';
    document.getElementById('dimensions').innerHTML = '20 by 20';
  } else if(document.getElementById('cover').checked) {
    isProfile = false;
    profileOrHeaderSelector = '#CoverPicture';
    document.getElementById('dimensions').innerHTML = '62 by 29';
  } else {
    showModal('Pick something!');
    somethingChecked = false;
  }
  if(somethingChecked) {
    document.getElementById('step1').className = 'offscreen';
    document.getElementById('step2').className = '';
  }
});

document.getElementById('submitStep2').addEventListener('click', function() {
  var rawColors = document.getElementById('colorsCodeOutput').value.trim();
  if(/^((\d+,){2}\d+;?)+$/.test(rawColors)) {
    colors = rawColors.split(';');
    for(var i = 0; i < colors.length; i++) {
      colors[i] = colors[i].split(',');
    }
    showColors();

    document.getElementById('step2').className = 'offscreen';
    document.getElementById('step3').className = '';
  } else {
    showModal('Those colors don\'t look right.');
  }
});

function showColors() {
  var list = document.getElementById('colorsList');
  list.innerHTML = '';
  for(var i = 0; i < colors.length; i++) {
    list.innerHTML += '<li><div class="color-box" style="background-color:rgb(' + colors[i].join(',') + ')"></div>' + rgbToHex(colors[i][0], colors[i][1], colors[i][2]) + '</li>';
  }
}

document.getElementById('submitStep3').addEventListener('click', function() {
  //imageFile = document.getElementById('image').files[0];
  if ( imageFile ) {
      var fr = new FileReader();
      fr.onload = function(e) {
         var img = new Image();
         img.onload = function() {
           drawImage(this);
         };
         img.src = e.target.result;
      };
      fr.readAsDataURL( imageFile );

      //move to next screen
      document.getElementById('step3').className = 'offscreen';
      document.getElementById('step4').className = '';
  } else {
    showModal('That doesn\'t look like an image.');
  }
  console.log(imageFile);
});

document.getElementById('previousStep2').addEventListener('click', function() {
  document.getElementById('step2').className = 'offscreen';
  document.getElementById('step1').className = '';
});

document.getElementById('previousStep3').addEventListener('click', function() {
  document.getElementById('step3').className = 'offscreen';
  document.getElementById('step2').className = '';
});

document.getElementById('previousStep4').addEventListener('click', function() {
  document.getElementById('step4').className = 'offscreen';
  document.getElementById('step3').className = '';
});

function componentToHex(c) {
    //convert to number first just in case
    var hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
}

function showModal(message) {
  document.body.insertAdjacentHTML('beforeend', '<div id="modal-overlay" class="modal-overlay"></div><div id="modal" class="modal"><p>' + message + '</p><button id="modal-close" class="modal-close">Close</button></div>');
  document.getElementById('modal-close').addEventListener('click', removeModal);
  document.getElementById('modal-overlay').addEventListener('click', removeModal);
}

function removeModal() {
  document.body.removeChild(document.getElementById('modal'));
  document.body.removeChild(document.getElementById('modal-overlay'));
}