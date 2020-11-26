var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var cloud;
var mountain;
var tree;
var collectable;
var canyon;
var game_score;
var flagpole;
var lives;
var Platform;

var enemies;
function setup()
{
	createCanvas(1024, 576);
    
    lives = 6; 
    startGame();
      
    	
}


function startGame(){
    
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	 game_score =0;
    
        gameChar_world_x = gameChar_x - scrollPos;
    
    
    // Boolean variables to control the movement of the game character.
        isLeft = false;
        isRight = false;
        isFalling = false;
        isPlummeting = false;
    
    // Initialise arrays of scenery objects.

        // Initialise arrays of scenery objects.
    tree_x =[130,870,645,400,4379,2137];
    
    
    cloud=[{cloudPos_x : 140,cloudPos_y : 120, cloud_size:0 },
         
           {cloudPos_x : 730,cloudPos_y : 200, cloud_size:10 },
          {cloudPos_x : 1000,cloudPos_y : 140, cloud_size:20 },
          
          {cloudPos_x : 800,cloudPos_y : 140, cloud_size:10 },
         
          {cloudPos_x : 1024,cloudPos_y : 130, cloud_size:20 }];
    
    
   mountain = [{mountainPos_x: -100,mountainPos_y :floorPos_y,mountain_width :0},
        
               {mountainPos_x: 1000,mountainPos_y :floorPos_y,mountain_width :0}
               
              ];
    
    canyon =[{canyonPos_x :200, canyon_width:100},
             {canyonPos_x :750, canyon_width:100},
            ];
    
    collectable =[{ itemPos_x: 100,itemPos_y:420,item_size: 50,isFound:false },
                  { itemPos_x: 450,itemPos_y:350,item_size: 50,isFound:false },
                 { itemPos_x: 950,itemPos_y:400,item_size: 50,isFound:false },
                  { itemPos_x: 1000,itemPos_y:370,item_size: 50,isFound:false },
                 { itemPos_x: 1200,itemPos_y:400,item_size: 50,isFound:false }];


flagpole={x_Pos:2500,isReached:false,height:300};

        lives-=1;
        
        Platform= [];
        
        Platform.push(createPlatform(25,floorPos_y-70,80));
       Platform.push(createPlatform(130,floorPos_y-30,80));
       Platform.push(createPlatform(600,floorPos_y-80,100));
       
        
        enemies=[];
        
        enemies.push(new Enemy(0,floorPos_y,150));
        enemies.push(new Enemy(300,floorPos_y,100));
        enemies.push(new Enemy(690,floorPos_y,80));
        enemies.push(new Enemy(900,floorPos_y,150));
        enemies.push(new Enemy(1250,floorPos_y,200));
    
     
 }



function draw()
{

	background(135,206,235); // fill the sky blue
    

	noStroke();
//	fill(0,155,0);
    fill(191,170,170);
	rect(0, floorPos_y, width, height/4); // draw some green ground  
    

    push();
    translate(scrollPos,0);
    drawClouds();
    drawMountains();
    drawTrees();
    
     
    
    for(var i =0; i < collectable.length; i++)
        {
            if(!collectable[i].isFound)
                {
                    drawCollectable(collectable[i]);
                    checkCollectable(collectable[i]);
                }
        }
    
    
    for (var i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
        
    }
    
    if(!checkFlagpole.isReached)
        {
            checkFlagpole(flagpole);
        }
    
    RenderFlagpole(flagpole);
    
    
    
   for (var i = 0; i < Platform.length; i++)
   {
       Platform[i].draw();
   }
    
    
    
    for (var i = 0; i < enemies.length; i++)
   {
       enemies[i].update();
       enemies[i].draw();
       if(enemies[i].isContact(gameChar_world_x,gameChar_y))
           {
               startGame();
               break;
           }
   }
    
    
    pop();
    
	// Draw game character.
    drawGameChar();
    
    
    fill(0,0,255);
    noStroke();
    text("score:" + game_score,40,40);
    text("lives:" + lives,40,60);
    
   
    if(lives <= 0)
        {
            text("Game over - press space to continue", 
                width/2-100,height/2);
            return;
        }
    
    else if(flagpole.isReached)
    {
   text("level complete - press space to continue",
                width/2 - 100, height/2);
            return; 
    }
    
    
    if(gameChar_y > height )
    { 
        if(lives > 0) startGame();
    }
	
    

	// Logic to make the game character move or the background scroll.
    
   if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 4;
		}
		else
		{
			scrollPos += 4;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}

	}



	// Logic to make the game character rise and fall.
    
    if(gameChar_y < floorPos_y)
    {
        var isContact= false;
        
       for(var i = 0 ; i < Platform.length; i++)
            {
               if(
                   Platform[i].checkContact(gameChar_world_x, gameChar_y)== true
               )
                   {
                       isContact = true;
                       break;
                   }
            }
        if(isContact == false)
           {
            gameChar_y += 2;
            isFalling = true;
           }
           else
           {
            isFalling = false;
           }
    }
    else
    {
            isFalling = false;
    }

           
    if(isPlummeting)
    {
        
    gameChar_y += 5;
        
    }
    
     // Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
}


// ---------------------
// Key control functions
// ---------------------

   function keyPressed()

{
    if(flagpole.isReached && key == '')
        {
            nextLevel();
        }
       else if(lives == 0 && key == '')
         {
                returnToStart();
          }
            
	if(key == 'A' || keyCode == 37)
	{
		isLeft = true;
	}

	if(key == 'D' || keyCode == 39)
	{
		isRight = true;
	}
    
    if(key == ' ' || key == 'w')
	{
		if(!isFalling)
            {
                gameChar_y-=100;
            }
	}
    
     

}

function keyReleased()
{
	if(key == 'A' || keyCode == 37)
	{
		isLeft = false;
	}

	if(key == 'D' || keyCode == 39)
	{
		isRight = false;
	}
}
    
    // ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
         //HAIR
    fill(254, 187, 244);
    ellipse(gameChar_x + 2,gameChar_y - 55,5,5);
    ellipse(gameChar_x + 6,gameChar_y - 55,5,5);
    ellipse(gameChar_x -2,gameChar_y - 55,5,5);
    
    //Feathers
    fill(120, 35, 107);
     ellipse(gameChar_x +15,gameChar_y - 34,7,3);
     ellipse(gameChar_x +15,gameChar_y - 37,15,4);
     ellipse(gameChar_x +15,gameChar_y - 40,10,5);
    
    
    //FACE
    noStroke();
    fill(254, 187, 244);
    ellipse(gameChar_x -2,gameChar_y - 40,30,30);
    fill(250, 219, 216);
    ellipse(gameChar_x -12,gameChar_y - 38,8,15);
    
    //EYES
    fill(255);
    ellipse(gameChar_x - 10,gameChar_y - 45,8,8);
     fill(0);
   ellipse(gameChar_x - 12,gameChar_y - 44,4,5);
   
    
    //MOUTH
    fill(217, 110, 202);
    triangle(gameChar_x -16,gameChar_y - 46 ,
             gameChar_x-20, gameChar_y-42,
            gameChar_x -16, gameChar_y - 35);    

    
//    //Arms
    
    ellipse(gameChar_x ,gameChar_y - 45,8,13);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //HAIR
    fill(254, 187, 244);
    ellipse(gameChar_x + 2,gameChar_y - 55,5,5);
    ellipse(gameChar_x + 6,gameChar_y - 55,5,5);
    ellipse(gameChar_x -2,gameChar_y - 55,5,5);
    
    //Feathers
    fill(120, 35, 107);
     ellipse(gameChar_x -15,gameChar_y - 34,7,3);
     ellipse(gameChar_x -15,gameChar_y - 37,15,4);
     ellipse(gameChar_x -15,gameChar_y - 40,10,5);
    
    
    //FACE
    noStroke();
    fill(254, 187, 244);
    ellipse(gameChar_x +2,gameChar_y - 40,30,30);
    fill(250, 219, 216);
    ellipse(gameChar_x +12,gameChar_y - 38,8,15);
    
    //EYES
    fill(255);
    ellipse(gameChar_x + 10,gameChar_y - 45,8,8);
     fill(0);
   ellipse(gameChar_x + 12,gameChar_y - 44,4,5);
   
    
    //MOUTH
    fill(217, 110, 202);
    triangle(gameChar_x +16,gameChar_y - 46 ,
             gameChar_x+20, gameChar_y-42,
            gameChar_x +16, gameChar_y - 35);    

    
//    //Arms
    ellipse(gameChar_x ,gameChar_y - 45,8,13);
    

	}
	else if(isLeft)
	{
		// add your walking left code
        //HAIR
    fill(254, 187, 244);
    ellipse(gameChar_x + 2,gameChar_y - 55,5,5);
    ellipse(gameChar_x + 6,gameChar_y - 55,5,5);
    ellipse(gameChar_x -2,gameChar_y - 55,5,5);
    
    //Feathers
    fill(120, 35, 107);
     ellipse(gameChar_x +15,gameChar_y - 34,7,3);
     ellipse(gameChar_x +15,gameChar_y - 37,15,4);
     ellipse(gameChar_x +15,gameChar_y - 40,10,5);
    
    
    //FACE
    noStroke();
    fill(254, 187, 244);
    ellipse(gameChar_x -2,gameChar_y - 40,30,30);
    fill(250, 219, 216);
    ellipse(gameChar_x -12,gameChar_y - 38,8,15);
    
    //EYES
    fill(255);
    ellipse(gameChar_x - 10,gameChar_y - 45,8,8);
     fill(0);
   ellipse(gameChar_x - 12,gameChar_y - 44,4,5);
   
    
    //MOUTH
    fill(217, 110, 202);
    triangle(gameChar_x -16,gameChar_y - 46 ,
             gameChar_x-20, gameChar_y-42,
            gameChar_x -16, gameChar_y - 35);    

    
//    //Arms
    ellipse(gameChar_x ,gameChar_y - 37,8,13);

    

	}
	else if(isRight)
	{
		// add your walking right code
         //HAIR
    fill(254, 187, 244);
    ellipse(gameChar_x + 2,gameChar_y - 55,5,5);
    ellipse(gameChar_x + 6,gameChar_y - 55,5,5);
    ellipse(gameChar_x -2,gameChar_y - 55,5,5);
    
    //Feathers
    fill(120, 35, 107);
     ellipse(gameChar_x -15,gameChar_y - 34,7,3);
     ellipse(gameChar_x -15,gameChar_y - 37,15,4);
     ellipse(gameChar_x -15,gameChar_y - 40,10,5);
    
    
    //FACE
    noStroke();
    fill(254, 187, 244);
    ellipse(gameChar_x +2,gameChar_y - 40,30,30);
    fill(250, 219, 216);
    ellipse(gameChar_x +12,gameChar_y - 38,8,15);
    
    //EYES
    fill(255);
    ellipse(gameChar_x + 10,gameChar_y - 45,8,8);
     fill(0);
   ellipse(gameChar_x + 12,gameChar_y - 44,4,5);
   
    
    //MOUTH
    fill(217, 110, 202);
    triangle(gameChar_x +16,gameChar_y - 46 ,
             gameChar_x+20, gameChar_y-42,
            gameChar_x +16, gameChar_y - 35);    

    
//    //Arms
    
    ellipse(gameChar_x ,gameChar_y - 37,8,13);
    
    

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
       //HAIR
    fill(254, 187, 244);
    ellipse(gameChar_x + 2,gameChar_y - 55,5,5);
    ellipse(gameChar_x + 6,gameChar_y - 55,5,5);
    ellipse(gameChar_x -2,gameChar_y - 55,5,5);
    
    //Feathers
    fill(120, 35, 107);
     ellipse(gameChar_x -15,gameChar_y - 34,7,3);
     ellipse(gameChar_x -15,gameChar_y - 37,15,4);
     ellipse(gameChar_x -15,gameChar_y - 40,10,5);
    
    
    //FACE
    noStroke();
    fill(254, 187, 244);
    ellipse(gameChar_x + 2,gameChar_y - 40,30,30);
    fill(250, 219, 216);
    ellipse(gameChar_x + 2,gameChar_y - 34,15,18);
    
    
    
    //EYES
    fill(255);
    ellipse(gameChar_x - 2,gameChar_y - 45,8,8);
    ellipse(gameChar_x + 7,gameChar_y - 45,8,8);

    fill(0);
    ellipse(gameChar_x - 2,gameChar_y - 44,4,5);
    ellipse(gameChar_x + 7,gameChar_y - 44,4,5);
    
    
    //MOUTH
    fill(217, 110, 202);
    triangle(gameChar_x -3,gameChar_y - 42 ,
             gameChar_x+5, gameChar_y-42,
            gameChar_x, gameChar_y - 35);

    
    //Arms
    ellipse(gameChar_x +15,gameChar_y - 45,8,13);
    ellipse(gameChar_x - 10,gameChar_y - 45,8,13);
    
   
	
	}
	else
	{
		// add your standing front facing code
        //HAIR
    fill(254, 187, 244);
    ellipse(gameChar_x + 2,gameChar_y - 55,5,5);
    ellipse(gameChar_x + 6,gameChar_y - 55,5,5);
    ellipse(gameChar_x -2,gameChar_y - 55,5,5);
    
    //Feathers
    fill(120, 35, 107);
     ellipse(gameChar_x -15,gameChar_y - 34,7,3);
     ellipse(gameChar_x -15,gameChar_y - 37,15,4);
     ellipse(gameChar_x -15,gameChar_y - 40,10,5);
    
    
    //FACE
    noStroke();
    fill(254, 187, 244);
    ellipse(gameChar_x + 2,gameChar_y - 40,30,30);
    fill(250, 219, 216);
    ellipse(gameChar_x + 2,gameChar_y - 34,15,18);
    
    
    
    //EYES
    fill(255);
    ellipse(gameChar_x - 2,gameChar_y - 45,8,8);
    ellipse(gameChar_x + 7,gameChar_y - 45,8,8);

    fill(0);
    ellipse(gameChar_x - 2,gameChar_y - 44,4,5);
    ellipse(gameChar_x + 7,gameChar_y - 44,4,5);
    
    
    //MOUTH
    fill(217, 110, 202);
    triangle(gameChar_x -3,gameChar_y - 42 ,
             gameChar_x+5, gameChar_y-42,
            gameChar_x, gameChar_y - 35);

    
    //Arms
    ellipse(gameChar_x +15,gameChar_y - 37,8,13);
    ellipse(gameChar_x - 10,gameChar_y - 37,8,13);



    }
}
   

// ---------------------------
// Background render functions
// ---------------------------

// Draw clouds
function drawClouds(){
    // Draw clouds.
    fill(255,255,255,50);
    noStroke();
    for (var i =0 ; i <cloud.length; i++){
    ellipse(cloud[i].cloudPos_x- 25, cloud[i].cloudPos_y , cloud[i].cloud_size + 30 ,cloud[i].cloud_size + 33);
    ellipse(cloud[i].cloudPos_x - 0, cloud[i].cloudPos_y, cloud[i].cloud_size + 40,cloud[i].cloud_size + 40);
    ellipse(cloud[i].cloudPos_x  + 30, cloud[i].cloudPos_y, cloud[i].cloud_size + 40,cloud[i].cloud_size + 40);
    ellipse(cloud[i].cloudPos_x  + 60, cloud[i].cloudPos_y, cloud[i].cloud_size + 30,cloud[i].cloud_size + 25);
   
    }
    
    
}
// Function to draw mountains objects.

function drawMountains(){
    

    for (var i =0 ; i <mountain.length; i++){
    
	 fill(131, 66, 121);//Brown Color
    
    triangle(mountain[i].mountainPos_x - 300,mountain[i].mountainPos_y- 0 , 
             mountain[i].mountainPos_x -200,mountain[i].mountainPos_y - 250, 
             mountain[i].mountainPos_x , mountain[i].mountainPos_y -0);
    
    triangle(mountain[i].mountainPos_x - 270,mountain[i].mountainPos_y- 0 , 
             mountain[i].mountainPos_x + 100,mountain[i].mountainPos_y - 200, 
             mountain[i].mountainPos_x + 350, mountain[i].mountainPos_y -0);

    }
    
    
    
    
    
}
// Function to draw trees objects.

function drawTrees(){
    
    for (var i =0 ; i <tree_x.length; i++){
    
    fill(139,69,19);
	rect(tree_x[i] , floorPos_y - 45, 15, 50);//390
    
    fill(80, 130, 100);
    ellipse( tree_x[i],floorPos_y - 70,40,40);//365
    ellipse(tree_x[i]-10,floorPos_y - 45,40,40);
    ellipse(tree_x[i] - 20 ,floorPos_y - 65,40,40);
    ellipse(tree_x[i] + 15,floorPos_y - 65,40,40);
    ellipse(tree_x[i] + 20,floorPos_y - 45,40,40);
    
        
        fill(139,69,19);
    rect( tree_x[i] + 343 , floorPos_y - 42, 10, 50);
        
    fill(80, 130, 100);
    ellipse( tree_x[i] + 348,floorPos_y - 82,40,40);
    ellipse( tree_x[i] + 333,floorPos_y - 62,40,40);
    ellipse( tree_x[i] + 348,floorPos_y - 57,40,40);
    ellipse( tree_x[i] + 333,floorPos_y - 72,40,40);
    ellipse( tree_x[i] + 363,floorPos_y - 72,40,40);
     ellipse( tree_x[i] + 363,floorPos_y - 57,40,40);
    }   
    
    
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon){
   
    fill(133, 216, 250);
    fill(235, 244, 250);
    rect(t_canyon.canyonPos_x , floorPos_y,t_canyon.canyon_width,150);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
 
    if(gameChar_world_x > t_canyon.canyonPos_x && gameChar_world_x < t_canyon.canyon_width + t_canyon.canyonPos_x && gameChar_y >= floorPos_y)
        {
         
        isPlummeting = true;
            
        }

    


}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
  
function drawCollectable(t_collectable){
    

    
   if(t_collectable.isFound == false)

        fill(241, 174, 250);
    ellipse (t_collectable.itemPos_x - 50,t_collectable.itemPos_y - 20,t_collectable.item_size - 25,t_collectable.item_size - 20);
        
    fill(247, 220, 111);   
    rect(t_collectable.itemPos_x - 65,t_collectable.itemPos_y - 25,t_collectable.item_size - 21,t_collectable.item_size - 47);
    rect(t_collectable.itemPos_x - 65,t_collectable.itemPos_y - 20,t_collectable.item_size - 21,t_collectable.item_size - 47);
    
    

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    
var d = dist(gameChar_x,gameChar_y, t_collectable.itemPos_x,t_collectable.itemPos_y);
    

  if(d <  20)
        {
            t_collectable.isFound = true;
        }
        



}

function RenderFlagpole()
    {
        push();
        strokeWeight(5);
        stroke(150);

        line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y - flagpole.height);
         pop();

        if(flagpole.isReached)
        {

            fill(113,115,238);
            rect(flagpole.x_Pos,floorPos_y - flagpole.height,50,40);

        }
   
   }


    function checkFlagpole()
    {
   
    var d =abs(gameChar_world_x - flagpole.x_Pos)
    
    if(d < 20)
        {
            flagpole.isReached = true;
        }
    }
   

function createPlatform(x,y,length)
{

    var p ={
        x:x,
        y:y,
        length:length,
        draw: function(){
        fill(219,112,147);
        noStroke(0);
        rect(this.x,this.y,this.length,10);
        },
        
        checkContact: function(gc_x,gc_y)
        {
            
        
            if(gc_x > this.x && gc_x < this.x + this.length)
                {
                     var d =  this.y - gc_y;
                    if (d >= 0 && d < 5)
                    {
                    return true;
                    }
                
                }
       
            
            return false;
            
        }  
    
    }

    return p; 
}




function Enemy(x,y,range)
{
this.x = x;
this.y = y;
this.Range = range;
this.incr = 1;
this.current_x = x;
  
this.draw = function()
{
    
    
    fill(255, 219, 88);
    ellipse(this.current_x,this.y - 20,50);
    //eyes
    fill(255);
    ellipse(this.current_x - 5,this.y - 40,15);
    ellipse(this.current_x + 5,this.y - 40,15);
    fill(0);
    ellipse(this.current_x - 5,this.y - 40,5);
    ellipse(this.current_x + 5,this.y - 40,5);
    //nose
    ellipse(this.current_x -2,this.y - 22,3);
    ellipse(this.current_x + 5,this.y - 22,3);
    //mouth
    fill(255,105,180);
    ellipse(this.current_x ,this.y - 13,10);
    
    
    
   
   
    
}
  this.update = function() 
  {
      this.current_x += this.incr ;
      
      if(this.current_x < this.x)
          {
              this.incr =1;
          }
         else if(this.current_x > this.x + this.Range)
             
        {
            this.incr = -1
        }
  }
  
  this.isContact = function(gc_x,gc_y)
  {
      
      var d= dist(gc_x,gc_y,this.current_x, this.y);
      
      if(d < 25)
          {
              return true;
          }
      return false;
  }
    
}

