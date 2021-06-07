window.onload = function() {
    ImageGrid(options);
}

var options = {
    imgSrc : "https://i.pinimg.com/originals/fe/aa/43/feaa43fac4f2d45adafb4a44467295e9.jpg",
    containerName : ".placeholder",
    rows: 3,
    columns: 3,
    margin: 3,
    animTime: 10
  }
  
  function ImageGrid(defaults)
  {
    var r = defaults.rows;
    var c = defaults.columns;
    var margin = defaults.margin;
    var placeholder = $(".placeholder");

    var container = document.createElement('div');
    container.className = "gridContainer";
    placeholder.append(container); 
      
    var gridTile;  
  
    var w = (container.offsetWidth / c) -margin;
    var h = (container.offsetHeight / r) -margin;
    var arr = [];
      
    for (var i=0, l=r*c; i < l; i++)
    {    
      gridTile = document.createElement('div');
      gridTile.className = "gridTile";
      gridTile.style.backgroundImage = "url("+defaults.imgSrc+")";
      
         
      arr = [(w+margin)*(i%c), (h+margin)*Math.floor(i/c), ((w+margin)*(i%c)+w-margin), (h+margin)*Math.floor(i/c), ((w+margin)*(i%c)+w-margin), ((h+margin)*Math.floor(i/c) + h-margin), (w+margin)*(i%c), ((h+margin)*Math.floor(i/c) + h-margin)];
          
     // console.log(i + " ====>>> " + arr + " ||||| " + i%c  + " |||||| " + i/c);  
      
          
      TweenMax.set(gridTile, {webkitClipPath:'polygon('+arr[0]+'px '+ arr[1]+'px,'+arr[2]+'px '+arr[3]+'px, '+arr[4]+'px '+ arr[5] +'px, '+arr[6]+'px '+ arr[7] +'px)', clipPath:'polygon('+arr[0]+'px '+ arr[1]+'px,'+arr[2]+'px '+arr[3]+'px, '+arr[4]+'px '+ arr[5] +'px, '+arr[6]+'px '+ arr[7] +'px)'});
         
      container.appendChild(gridTile);    
      
      fixTilePosition(gridTile, i);
    }
    
    placeholder.on('mouseover', function (e) {
      var allTiles = e.currentTarget.querySelectorAll(".gridTile");
      for (var t=0, le = allTiles.length; t < le; t++)
        {
          TweenMax.to(allTiles[t], defaults.animTime, {css:{backgroundPosition:"0px 0px"}, ease:Power1.easeOut});
        }
    })
                               
    placeholder.on('mouseleave', function (e) {
      var allTiles = e.currentTarget.querySelectorAll(".gridTile");
      for (var ti=0, len = allTiles.length; ti < len; ti++)
        {
          fixTilePosition(allTiles[ti], ti, defaults.animTime);
        }
    })
    
    function fixTilePosition(tile, ind, time)
    {
      if(time==null)time=0;
      var centr, centrCol, centrRow, offsetW, offsetH, left, top;
      
      centr = Math.floor(c * r / 2);
      centrCol = Math.ceil(centr/c);
      centrRow = Math.ceil(centr/r);
          
      offsetW = w/centrCol;
      offsetH = h/centrRow;
      
      left = (Math.round((ind % c - centrCol + 1) * offsetW));
      top = (Math.round((Math.floor(ind/c) - centrRow + 1) * offsetH));
      
      //console.log(left, top)
      
      TweenMax.to(tile, time, {css:{backgroundPosition:left+"px "+top+"px"}, ease:Power1.easeOut});
    }
  }
  
