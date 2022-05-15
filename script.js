window.onload = function (){
    /* je crée les variables du canvas où je dit que le width est egal à 900px et la hauteur égal à 600px */
    let canvasWidth = 900;
    let canvasHeight = 600;
    /* je crée des blocs */
    let blockSize = 30;
    let ctx;
    let delay = 100;
    let snakee;
    let applee;
    /* je convertis la langueur du canvas en blocs */
    let widthInblocks = canvasWidth/blockSize;
    let heightInblocks = canvasHeight/blockSize;
    let score;
    let timeout;
    
    init();
    
    
    function init(){
        /* je crée le canvas */
    let canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    /* j'affiche le canvas dns le html */
    document.body.appendChild(canvas);
    /* pour pouvoir "dessiner dans le canvas, je dois préciser le context. ici le canvas est en 2D" */
    ctx = canvas.getContext('2d');
    /* je place mon serpent et ma pomme (classes crées plus bas)*/
    snakee = new Snake([[6,4], [5,4], [4,4]], "right");
    applee = new Apple([10,10]) ;
    score = 0;
    refreshcanvas();
    
    }   
    
    function refreshcanvas() {
    snakee.advance();
        /* si le serpent touche un mur ou lui meme */
        if(snakee.checkCollision()) {
                gameOver();
            }
        else {
            /* si le serpent mange la pomme */
              if(snakee.isEatingApple(applee))    {
                  /* on gagne un point */
                      score++;
                      snakee.ateApple = true;
                      do  {
                          /* la pomme apparait  un nouvel endroit */
                          applee.setNewPosition();                      
                      }
                      /* si le serpent mange la pomme */
                      while(applee.isOnSnake(snakee))
                  }
                  /* j'efface les dessins presents sur le canvas */
              ctx.clearRect(0,0,canvasWidth, canvasHeight);   
              /* et j'affiche le nouveau score, le serpent et la pomme */ 
              drawScore();       
              snakee.draw();
              applee.draw();                                
              timeout = setTimeout(refreshcanvas,delay); 
            }
        
    }
        
    function gameOver() {
        /* jaffiche un message lors du game over */
            ctx.save();
            ctx.font = "bold 70px sans-serif"
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            let centerX = canvasWidth / 2;
            let centerY = canvasHeight / 2;
            ctx.strokeText("PERDU", centerX, centerY - 180);
            ctx.fillText("PERDU", centerX, centerY - 180);
            
            ctx.font = "bold 30px sans-serif"
            ctx.strokeText("appuie sur espace pour recommencer", centerX, centerY - 120)
            ctx.fillText("appuie sur espace pour recommencer", centerX, centerY - 120);
            ctx.restore();
        }
    function restart(){
        /* a chaque restart, je replace mes lements et reinitialise mon score */
            snakee = new Snake([[6,4], [5,4], [4,4]], "right");
            applee = new Apple([10,10]) ;
            score = 0;
            clearTimeout(timeout);
            refreshcanvas();
        }
    function drawScore(){
        /* affichage du score */
            ctx.save();
            ctx.font = "bold 200px sans-serif"
            ctx.fillStyle = "gray";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            let centerX = canvasWidth / 2;
            let centerY = canvasHeight / 2;
            /* j'affiche l'incrémentation du score avec tostring */
            ctx.fillText(score.toString(), centerX, centerY);
            ctx.restore();
        }
    /* je crée une fonction pour ajouter les blocs a mon serpent */
    function drawBlock(ctx, position) {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
    
    /* creation de mon serpent */
    function Snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(let i = 0; i<this.body.length; i++) {
                drawBlock(ctx,this.body[i])
                }
                ctx.restore();
               
        };
        this.advance = function()  {
            /* je fais grandir mon serpent mon serpent */
            let nextPosition = this.body[0].slice();
            switch(this.direction)   {
                    case "left":
                        nextPosition[0] -= 1;
                        break;
                    case "right":
                        nextPosition[0] += 1;
                        break;
                    case "down":
                        nextPosition[1] += 1;
                        break;
                    case "up":
                        nextPosition[1] -= 1;
                        break;
                     default:
                        throw("invalide Direction");   
                    
                                               
                }
                /* j'ajoute un bloc au serpent */
            this.body.unshift(nextPosition);
            if(!this.ateApple)
            /* si je mange pas de pomme, je retire le dernier bloc du serpent (le serpent fait la meme taille) */
                 this.body.pop();
            else
            /* sinon le serpent grandit */
                this.ateApple = false;
        };
        /* je declare les deplacement possibles */
        this.setDirection = function(newDirection)  {
            let allowedDirection;
            switch(this.direction)  
            /* si mon serpent se déplace a gauche ou a droite, je ne peut aller qu'en haut ou en bas */   {
                    case "left":              
                    case "right":
                        allowedDirection = ["up", "down"];
                        break;
            /* si mon serpent se déplace en haut ou en bas, je ne peut aller qu'a gauche ou a droite */
                    case "down":
                    case "up":
                        allowedDirection = ["left", "right"];
                        break;
                     default:
                        throw("invalide Direction");   
                }
            if(allowedDirection.indexOf(newDirection) > -1)    {
                   this.direction = newDirection; 
                }
        };
        /* je crée les collisions */
       this.checkCollision = function()   {
            let wallCollision = false;
            let snakeCollision = false;
            /* je déclare la position de mes elements */
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakex = head[0];
            let snakey = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInblocks - 1;
            let maxY = heightInblocks - 1;
            let isNotBetweenHorizontalWalls = snakex < minX || snakex > maxX;
            let isNotBetweenVerticalWalls = snakey < minY || snakey > maxY;
            /* si le serpent touche les murs */
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)          {
                    wallCollision = true;
                }
            /* si le serpent se touche */
            for(let i = 0; i < rest.length ; i++)          {
                    if(snakex === rest[i][0] && snakey === rest[i][1])                 {
                            snakeCollision = true;
                        }
                }
            
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat)  {
            /* lorsque le serpent touche la pomme */
         let head = this.body[0]; 
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        };
    }
    
    /* creation de la pomme */
    function Apple(position)   {
        this.position = position;
        this.draw = function()   {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            let radius = blockSize/2;
            let x = this.position[0]*blockSize + radius;
            let y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        /* creation d'un nouvel emplacement a chaque appel */
        this.setNewPosition = function()   {
            let newX = Math.round(Math.random() * (widthInblocks - 1));
            let newY = Math.round(Math.random() * (heightInblocks - 1));
            this.position = [newX, newY];
        };
        /* permet d'appeler une nouvelle pomme que lorsque le serpent le mange */
        this.isOnSnake = function(snakeToCheck)  {
          let isOnSnake = false;
            
            for(let i = 0 ; i < snakeToCheck.body.length; i++)        {
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])               {
                            inOnSnake = true;
                        }
                
                }
                  return isOnSnake;
                };
    }
    
    /* j'utilise les touches du clavier pour me déplacer */
 document.onkeydown  = function handleKeyDown(e){
     let key = e.keyCode;
     let newDirection;
     switch(key)      {
            case 37:
                 newDirection = "left";
                 break;
            case 38:
                 newDirection = "up";
                 break;
             case 39:
                 newDirection = "right";
                 break;
             case 40:
                 newDirection = "down";
                 break;
             case 32:
                 restart()
                 return;
             default:
                 return;    
                            
         }
     snakee.setDirection(newDirection);
     
 }
    
    
    
    
    
}
    