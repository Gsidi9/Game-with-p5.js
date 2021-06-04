/*

The Game Project 5 - Bring it all together

*/

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
    
    lives = 4; 
    startGame();
      
    	
}


 function startGame()

 {
       floorPos_y = height * 3/4;
	   gameChar_x = width/2;
	   gameChar_y = floorPos_y;
    
        game_score =0;
        
         scrollPos = 0;
        // Variable to store the real position of the gameChar in the game
        // world. Needed for collision detection.
        gameChar_world_x = gameChar_x - scrollPos;

        // Boolean variables to control the movement of the game character.
        isLeft = false;
        isRight = false;
        isFalling = false;
        isPlummeting = false;

        // Initialise arrays of scenery objects.

        tree_x =[120,1990,847,8348,4773,1273];


        cloud= [
              {cloudPos_x : 150,cloudPos_y : 100, cloud_size:30 },
              {cloudPos_x : 600,cloudPos_y : 150, cloud_size:10 },
              {cloudPos_x : 620,cloudPos_y : 150, cloud_size:10 },
              {cloudPos_x : 1000,cloudPos_y : 140, cloud_size:20 },
              {cloudPos_x : 1600,cloudPos_y : 100, cloud_size:20 },
              {cloudPos_x : 1300,cloudPos_y : 140, cloud_size:10 },
              {cloudPos_x : 1320,cloudPos_y : 140, cloud_size:10 },
              {cloudPos_x : 2000,cloudPos_y : 130, cloud_size:20 }
        ];


        mountain = [
                   {mountainPos_x: -100,mountainPos_y :floorPos_y,mountain_width :0},
                   {mountainPos_x: 400,mountainPos_y :floorPos_y,mountain_width :0},
                   {mountainPos_x: 1000,mountainPos_y :floorPos_y,mountain_width :0},
                   {mountainPos_x: 1500,mountainPos_y :floorPos_y,mountain_width :0}
        ];


        canyon =[
                   {canyonPos_x :100, canyon_width:100},
                 {canyonPos_x :600, canyon_width:100},
                 {canyonPos_x :900, canyon_width:100},
        ];




        collectable = [
            { itemPos_x: 90,itemPos_y:350,item_size: 50,isFound:false },
            {itemPos_x: 50,itemPos_y:350,item_size: 50,isFound:false },
                      { itemPos_x: 350,itemPos_y:350,item_size: 50,isFound:false },
                      { itemPos_x: 450,itemPos_y:200,item_size: 50,isFound:false },
                      { itemPos_x: 450,itemPos_y:420,item_size: 50,isFound:false },
                      { itemPos_x: 760,itemPos_y:420,item_size: 50,isFound:false },
                      
        ];




        flagpole={x_Pos:2500,isReached:false,height:300};

        lives-=1;
        
        Platform= [];
        
        Platform.push(createPlatform(0,floorPos_y-70,100));
       Platform.push(createPlatform(300,floorPos_y-70,80));
       Platform.push(createPlatform(400,floorPos_y-150,100));
       
        
        enemies=[];
        
        enemies.push(new Enemy(0,floorPos_y,100));
        enemies.push(new Enemy(350,floorPos_y,100));
        enemies.push(new Enemy(700,floorPos_y,100));
        enemies.push(new Enemy(1000,floorPos_y,100));
        enemies.push(new Enemy(1300,floorPos_y,100));
 
 }





function draw()
{

	background(253, 179, 83); // fill the sky blue
    

	noStroke();
	fill(0,155,0);
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
    
    
    fill(255,0,0);
    noStroke();
    text("score:" + game_score,20,40);
    text("lives:" + lives,20,60);
    
   
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
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
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

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
   //FACE
    noStroke();
    fill(157,195,230);
    rect(gameChar_x - 10,gameChar_y - 57,15,20);
    
    //BODY
    fill(237,158,98);
    rect(gameChar_x -10,gameChar_y - 37,15,20);
     stroke(0);
    fill(57,52,151);
    rect(gameChar_x - 10,gameChar_y - 17,15,5);
    rect(gameChar_x - 5,gameChar_y - 10,5,8);//legs
    
    //SHOES
    fill(0);
    rect(gameChar_x +2 ,gameChar_y - 4,5,2);
    
    //HAIR
    noStroke(0);
    fill(32,56,100);
    ellipse(gameChar_x - 2,gameChar_y - 60,20,20);
    ellipse(gameChar_x +3,gameChar_y - 45,20,20);
    
    //ARM
    fill(157,195,230);
    rect(gameChar_x,gameChar_y - 50,5,20);//Arms

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //FACE
    noStroke();
    fill(157,195,230);
    rect(gameChar_x - 10,gameChar_y - 57,15,20);
    
    //BODY
   fill(237,158,98);
    rect(gameChar_x -10,gameChar_y - 37,15,20);
     stroke(0);
    fill(57,52,151);
    rect(gameChar_x - 10,gameChar_y - 17,15,5);
    rect(gameChar_x - 5,gameChar_y - 10,5,8);//legs
    
    //SHOES
    fill(0);
    rect(gameChar_x -10,gameChar_y - 4,5,2);
    
    //HAIR
    noStroke(0);
    fill(32,56,100);
    ellipse(gameChar_x - 5,gameChar_y - 60,20,20);
    ellipse(gameChar_x - 8,gameChar_y - 45,20,20);
    
    //ARM
    fill(157,195,230);
    rect(gameChar_x - 10,gameChar_y - 50,5,20);//Arms
    

	}
	else if(isLeft)
	{
		// add your walking left code
        //FACE
    noStroke();
    fill(157,195,230);
    rect(gameChar_x - 10,gameChar_y - 57,15,20);
    
    //BODY
   fill(237,158,98);
    rect(gameChar_x -10,gameChar_y - 37,15,20);
    stroke(0);
    fill(57,52,151);
    rect(gameChar_x - 10,gameChar_y - 17,15,5);//Trouses
    rect(gameChar_x - 5,gameChar_y - 10,5,10);//legs
    
    //SHOES
    fill(0);
    rect(gameChar_x -5,gameChar_y - 4,5,2);
    
    //HAIR
    noStroke(0);
    fill(32,56,100);
    ellipse(gameChar_x - 2,gameChar_y - 60,20,20);
    ellipse(gameChar_x +3,gameChar_y - 45,20,20);
    
    //ARM
    fill(157,195,230);
    rect(gameChar_x,gameChar_y - 37,5,20);//Arms
    

	}
	else if(isRight)
	{
		// add your walking right code
        //FACE
    noStroke();
    fill(157,195,230);
    rect(gameChar_x - 10,gameChar_y - 57,15,20);
    
    //BODY
   fill(237,158,98);
    rect(gameChar_x -10,gameChar_y - 37,15,20);
     stroke(0);
    fill(57,52,151);
    rect(gameChar_x - 10,gameChar_y - 17,15,5);
    rect(gameChar_x - 5,gameChar_y - 10,5,10);//legs
    
    //SHOES
    fill(0);
    rect(gameChar_x -5,gameChar_y - 4,5,2);

    //HAIR
    noStroke(0);
    fill(32,56,100);
    ellipse(gameChar_x - 5,gameChar_y - 60,20,20);
    ellipse(gameChar_x - 8,gameChar_y - 45,20,20);
    
    //ARM
    fill(157,195,230);
    rect(gameChar_x - 10,gameChar_y - 37,5,20);//Arms
    

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        //HAIR
    stroke(0);
    strokeWeight(2);
    fill(32,56,100);
    ellipse(gameChar_x - 10,gameChar_y - 54,20,20);
    ellipse(gameChar_x,gameChar_y - 65,20,20);
    ellipse(gameChar_x + 10,gameChar_y - 54,20,20);
    noStroke();
    rect(gameChar_x - 10,gameChar_y - 64,20,20);
    
    //FACE
    noStroke();
    fill(157,195,230);
    rect(gameChar_x - 10,gameChar_y - 57,20,20);
    
    //EYES
    fill(255);
    ellipse(gameChar_x + 2,gameChar_y - 49,5,10);
    ellipse(gameChar_x - 4,gameChar_y - 49,5,10);
    fill(0);
    ellipse(gameChar_x + 1,gameChar_y - 48,2,4);
    ellipse(gameChar_x - 2,gameChar_y - 48,2,4);
    
     //MOUTH
    fill(255,149,158);
    ellipse(gameChar_x + 2,gameChar_y - 41,8,5);
    
    //NOSE
    fill(157,195,230);
    //ellipse(gameChar_x,gameChar_y - 52,15,2);
    ellipse(gameChar_x,gameChar_y - 44,10,5);
    
    //ARMS
    rect(gameChar_x - 16,gameChar_y - 50,5,20);//Arms
    rect(gameChar_x + 11,gameChar_y - 50,5,20);//Arms
    
   //BODY
   fill(237,158,98);
    rect(gameChar_x -10,gameChar_y - 37,20,20);
    stroke(0);
    fill(57,52,151);
    rect(gameChar_x - 10,gameChar_y - 17,20,5);
    rect(gameChar_x - 5,gameChar_y - 10,5,7);//legs
    rect(gameChar_x,gameChar_y - 10,5,7);//legs

   
	
	}
	else
	{
		// add your standing front facing code
        //HAIR
    stroke(0);
    strokeWeight(2);
    fill(32,56,100);
    ellipse(gameChar_x - 10,gameChar_y - 54,20,20);
    ellipse(gameChar_x,gameChar_y - 65,20,20);
    ellipse(gameChar_x + 10,gameChar_y - 54,20,20);
    noStroke();
    rect(gameChar_x - 10,gameChar_y - 64,20,20);
    
    //FACE
    noStroke();
    fill(157,195,230);
    rect(gameChar_x - 10,gameChar_y - 57,20,20);
    
    //EYES
    fill(255);
    ellipse(gameChar_x + 2,gameChar_y - 49,5,10);
    ellipse(gameChar_x - 4,gameChar_y - 49,5,10);
    fill(0);
    ellipse(gameChar_x + 1,gameChar_y - 48,2,4);
    ellipse(gameChar_x - 2,gameChar_y - 48,2,4);
    
    //MOUTH
    fill(255,149,158);
    ellipse(gameChar_x ,gameChar_y - 41,8,3);
    
    //NOSE
     fill(157,195,230);
     ellipse(gameChar_x,gameChar_y - 52,15,2);
     ellipse(gameChar_x,gameChar_y - 44,10,5);
    
    //Arms
    rect(gameChar_x - 16,gameChar_y - 37,5,20);//Arms
    rect(gameChar_x + 11,gameChar_y - 37,5,20);//Arms
    
    //BODY
    fill(237,158,98);
    rect(gameChar_x -10,gameChar_y - 37,20,20);
    stroke(0);
    fill(57,52,151);
    rect(gameChar_x - 10,gameChar_y - 17,20,5);
    rect(gameChar_x - 5,gameChar_y - 10,5,10);//legs
    rect(gameChar_x,gameChar_y - 10,5,10);//legs
    
    //SHOES
    fill(0);
    rect(gameChar_x -5,gameChar_y - 4,5,2);
    rect(gameChar_x,gameChar_y - 4,5,2);


    }
}
   




// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
    function drawClouds()
    {
    
        for (var i =0 ; i <cloud.length; i++)
        {
            fill(255,255,255,50);
            noStroke();
            ellipse(cloud[i].cloudPos_x- 30, cloud[i].cloudPos_y , cloud[i].cloud_size + 33 ,cloud[i].cloud_size + 33);
            ellipse(cloud[i].cloudPos_x - 0, cloud[i].cloudPos_y, cloud[i].cloud_size + 55,cloud[i].cloud_size + 55);
            ellipse(cloud[i].cloudPos_x  + 30, cloud[i].cloudPos_y, cloud[i].cloud_size + 55,cloud[i].cloud_size + 55);
            ellipse(cloud[i].cloudPos_x  + 60, cloud[i].cloudPos_y, cloud[i].cloud_size + 33,cloud[i].cloud_size + 33);

        } 
    
    }



// Function to draw mountains objects.
    function drawMountains()
    {
        for (var i =0 ; i < mountain.length; i++)
        {
            fill(128,128,128);
            triangle(mountain[i].mountainPos_x - 130,mountain[i].mountainPos_y- 0 , 
            mountain[i].mountainPos_x + 70,mountain[i].mountainPos_y - 280, 
            mountain[i].mountainPos_x + 300, mountain[i].mountainPos_y -0);

        }
    
    }
// Function to draw trees objects.

    function drawTrees()
    {
         for (var i =0 ; i <tree_x.length; i++)
         {

            fill(139,69,19);
            noStroke();
            rect(tree_x[i] , floorPos_y - 95, 15, 100);//390

            fill(80, 130, 100);
            ellipse( tree_x[i],floorPos_y - 140,40,40);//365
            ellipse(tree_x[i]-10,floorPos_y - 95,40,40);
            ellipse(tree_x[i] - 20 ,floorPos_y - 115,40,40);
            ellipse(tree_x[i] + 15,floorPos_y - 115,40,40);
            ellipse(tree_x[i] + 20,floorPos_y - 95,40,40);

        }   
    
    }


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
     function drawCanyon(t_canyon)
    {
    
        fill(52, 152, 219);
        noStroke();
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
  
    function drawCollectable(t_collectable)
    {
    
   //if(t_collectable.isFound == false)
       //{
    
    
        fill(255, 182, 193);
        stroke(0);
        triangle( t_collectable.itemPos_x - 10,t_collectable.itemPos_y -35, 
                  t_collectable.itemPos_x - 5,t_collectable.itemPos_y -20, 
                  t_collectable.itemPos_x ,t_collectable.itemPos_y -35);

        triangle( t_collectable.itemPos_x - 15,t_collectable.itemPos_y  -20,
                  t_collectable.itemPos_x - 10,t_collectable.itemPos_y -35,
                  t_collectable.itemPos_x - 5,t_collectable.itemPos_y -20);

        triangle( t_collectable.itemPos_x - 5,t_collectable.itemPos_y  -20,
                  t_collectable.itemPos_x ,t_collectable.itemPos_y -35,
                  t_collectable.itemPos_x + 5,t_collectable.itemPos_y -20);

        triangle( t_collectable.itemPos_x ,t_collectable.itemPos_y -35, 
                  t_collectable.itemPos_x + 5,t_collectable.itemPos_y -20, 
                  t_collectable.itemPos_x + 10,t_collectable.itemPos_y -35);

        triangle( t_collectable.itemPos_x + 5,t_collectable.itemPos_y -20,
                  t_collectable.itemPos_x + 10,t_collectable.itemPos_y -35,
                  t_collectable.itemPos_x + 15,t_collectable.itemPos_y -20);

        triangle( t_collectable.itemPos_x  - 15 ,t_collectable.itemPos_y -20, 
                  t_collectable.itemPos_x ,t_collectable.itemPos_y + 5, 
                  t_collectable.itemPos_x - 5,t_collectable.itemPos_y -20);


        triangle( t_collectable.itemPos_x + 15,t_collectable.itemPos_y  - 20, 
                  t_collectable.itemPos_x ,t_collectable.itemPos_y + 5, 
                  t_collectable.itemPos_x - 5,t_collectable.itemPos_y - 20);

        triangle( t_collectable.itemPos_x  + 5,t_collectable.itemPos_y - 20, 
                  t_collectable.itemPos_x ,t_collectable.itemPos_y + 5, 
                  t_collectable.itemPos_x  -5,t_collectable.itemPos_y - 20);

    
      // }

    }

// Function to check character has collected an item.

    function checkCollectable(t_collectable)
    {
    
        var d = dist(gameChar_x,gameChar_y, t_collectable.itemPos_x,t_collectable.itemPos_y);

        if(d <  20)
        {
            t_collectable.isFound = true;
            game_score+=10;
        }
        
        
//        if(dist(gameChar_world_x,gameChar_y,t_collectable.itemPos_x,t_collectable.itemPos_y)< t_collectable.item_size)
//            {
//                 t_collectable.isFound = true;
//            game_score+=10;
//            }

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

            fill(200,50,0);
            rect(flagpole.x_Pos,floorPos_y - flagpole.height,40,30);

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
        fill(255,255,0);
        noStroke(0);
        rect(this.x,this.y,this.length,20);
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
    
    fill(50,205,50);
     rect(this.current_x - 10,this.y - 25, 8, 30);
    rect(this.current_x ,this.y - 25, 8, 30);
    fill(255,0,29);
    rect(this.current_x -10 ,this.y - 35, 20, 30);
    fill(50,205,50);
    ellipse(this.current_x,this.y - 40,50);
    fill(255);
    ellipse(this.current_x - 5,this.y - 25,10);
    ellipse(this.current_x + 5,this.y - 25,10);
    fill(0);
    ellipse(this.current_x - 5,this.y - 25,5);
     ellipse(this.current_x + 5,this.y - 25,5);
    
   
   
    //add more details to your enemy
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




