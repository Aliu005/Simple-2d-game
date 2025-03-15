const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        // Player object
        const player = {
            x: 100,           // Fixed x-position
            y: 500,           // Starting y-position (ground level)
            width: 40,
            height: 40,
            velocityY: 0,     // Vertical speed
            jumpPower: -15,   // Negative because up is negative in canvas
            gravity: 0.6,     // Pulls player down
            isJumping: false  // Track jump state
        };

        const groundY = 500; // Ground level
        let score = 0;
        let stars = [];
        let asteroids = [];
        let scrollSpeed = 3; // Initial background scrolling speed
        let gameTime = 0;   // Track time in seconds

        // Keyboard controls
        let keys = {};
        window.addEventListener("keydown", (e) => {
            if (e.key === " " && !player.isJumping) { // Spacebar to jump
                player.velocityY = player.jumpPower;
                player.isJumping = true;
            }
        });

        // Spawn stars and asteroids
        function spawnStar() {
            stars.push({
                x: canvas.width,
                y: Math.random() * (groundY - 200) + 100, // Between 100 and 400
                width: 10,
                height: 10
            });
        }

        function spawnAsteroid() {
            asteroids.push({
                x: canvas.width,
                y: groundY, // On the ground
                width: 40,
                height: 40,
                speed: scrollSpeed
            });
        }

        // Collision detection
        function checkCollision(obj1, obj2) {
            return obj1.x < obj2.x + obj2.width &&
                   obj1.x + obj1.width > obj2.x &&
                   obj1.y < obj2.y + obj2.height &&
                   obj1.y + obj1.height > obj2.y;
        }

        // Update game state
        function update() {
            // Apply gravity
            player.velocityY += player.gravity;
            player.y += player.velocityY;

            // Ground collision
            if (player.y > groundY) {
                player.y = groundY;
                player.velocityY = 0;
                player.isJumping = false;
            }

            // Update stars
            stars.forEach((star, index) => {
                star.x -= scrollSpeed;
                if (star.x < -star.width) {
                    stars.splice(index, 1);
                } else if (checkCollision(player, star)) {
                    score += 10;
                    stars.splice(index, 1);
                }
            });

            // Update asteroids
            asteroids.forEach((asteroid, index) => {
                asteroid.x -= asteroid.speed;
                if (asteroid.x < -asteroid.width) {
                    asteroids.splice(index, 1);
                } else if (checkCollision(player, asteroid)) {
                    alert(`Game Over! Score: ${score}`);
                    score = 0;
                    stars = [];
                    asteroids = [];
                    player.y = groundY;
                    player.velocityY = 0;
                    scrollSpeed = 3; // Reset speed
                    gameTime = 0;    // Reset time
                }
            });

            // Update game time (assuming 60 FPS)
            gameTime += 1 / 60;
            if (gameTime >= 5) {
                scrollSpeed += 1; // Increase speed every 20 seconds
                gameTime = 0;     // Reset timer
                // Update asteroid speeds to match new scrollSpeed
                asteroids.forEach(asteroid => asteroid.speed = scrollSpeed);
            }
        }

        // Draw everything
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw ground
            ctx.fillStyle = "#333";
            ctx.fillRect(0, groundY + player.height, canvas.width, canvas.height - groundY - player.height);

            // Draw player
            ctx.fillStyle = "white";
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Draw stars
            ctx.fillStyle = "yellow";
            stars.forEach(star => ctx.fillRect(star.x, star.y, star.width, star.height));

            // Draw asteroids
            ctx.fillStyle = "gray";
            asteroids.forEach(asteroid => ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height));

            // Draw score (moved lower, just above ground)
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText(`Score: ${score}`, 10, groundY + 30);
        }

        // Game loop
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }

        // Start spawning objects
        setInterval(spawnStar, 1200); // Spawn a star every 1.2 seconds
        setInterval(spawnAsteroid, 2000); // Spawn an asteroid every 2 seconds

        // Start the game
        gameLoop();