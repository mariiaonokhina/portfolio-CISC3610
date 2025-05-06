window.onload = async function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const skyBackground = new Image();
    skyBackground.src = "assets/sky.jpg";

    skyBackground.onload = function() {
      ctx.drawImage(skyBackground, 0, 0, canvas.width, canvas.height);

      const airBalloon1 = new Image();
      airBalloon1.src = "assets/airBalloon1.png";

      airBalloon1.onload  = function() {
        ctx.drawImage(airBalloon1, 200, 100, 150, 200);
      };

      const airBalloon2 = new Image();
      airBalloon2.src = "assets/airBalloon2.png";

      airBalloon2.onload  = function() {
        ctx.drawImage(airBalloon2, 800, 200, 200, 200);
      };

      const airplane = new Image();
      airplane.src = "assets/airplane.png";

      airplane.onload  = function() {
        ctx.filter = "blur(1px)";
        ctx.drawImage(airplane, 550, 50, 200, 100);
        ctx.filter = "none";
      };

      ctx.font = "40px Arial";  // Font size and style
      ctx.fillStyle = "darkblue";  // Text color
      ctx.textAlign = "center"; // Text alignment
      ctx.fillText("Soaring above the clouds...", 300, canvas.height - 50); // Position
    };
};