import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  color: string;
};

// Brick configuration
const BRICK_ROWS = 4;
const BRICK_COLS = 10;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 4;
const BRICK_TOP_OFFSET = 50;

const BRICK_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];

export default function GameBreakout() {
  const canvas_height = 500;
  const canvas_width = 750;
  const canvas_ref = useRef<HTMLCanvasElement>(null);
  const animation_ref = useRef<number>(0);

  const bricks = useRef<Brick[]>([]);

  const ball = useRef({
    x: 30,
    dx: 4,
    y: 50,
    dy: 4,
    radius: 10
  });

  const paddle = useRef({
    width: 100,
    height: 12,
    x: 0, // will be centered on init
    speed: 8
  });

  const keys = useRef({
    left: false,
    right: false
  });

  const gameState = useRef({
    waiting: true, // Ball starts on paddle, waiting for launch
    gameOver: false,
    lives: 3
  });

  const score = useRef(0);

  const resetGame = () => {
    const canvas = canvas_ref.current;
    if (!canvas) return;

    const paddleY = canvas.height - 25 - paddle.current.height;

    // Reset game state
    gameState.current.waiting = true;
    gameState.current.gameOver = false;
    gameState.current.lives = 3;

    // Reset score
    score.current = 0;

    // Center paddle
    paddle.current.x = (canvas.width - paddle.current.width) / 2;

    // Position ball on paddle
    const b = ball.current;
    const p = paddle.current;
    b.x = p.x + p.width / 2;
    b.y = paddleY - b.radius;
    b.dx = 0;
    b.dy = 0;

    // Reset bricks
    const brickWidth = (canvas.width - BRICK_PADDING * (BRICK_COLS + 1)) / BRICK_COLS;
    bricks.current = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.current.push({
          x: BRICK_PADDING + col * (brickWidth + BRICK_PADDING),
          y: BRICK_TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_PADDING),
          width: brickWidth,
          height: BRICK_HEIGHT,
          visible: true,
          color: BRICK_COLORS[row % BRICK_COLORS.length],
        });
      }
    }
  };

  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) return;

    // Initialize game state
    gameState.current.waiting = true;
    gameState.current.gameOver = false;
    gameState.current.lives = 3;

    const paddleY = canvas.height - 25 - paddle.current.height;

    // Center paddle initially
    paddle.current.x = (canvas.width - paddle.current.width) / 2;

    // Position ball on paddle initially
    const b = ball.current;
    const p = paddle.current;
    b.x = p.x + p.width / 2;
    b.y = paddleY - b.radius;

    // Initialize bricks
    const brickWidth = (canvas.width - BRICK_PADDING * (BRICK_COLS + 1)) / BRICK_COLS;
    bricks.current = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.current.push({
          x: BRICK_PADDING + col * (brickWidth + BRICK_PADDING),
          y: BRICK_TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_PADDING),
          width: brickWidth,
          height: BRICK_HEIGHT,
          visible: true,
          color: BRICK_COLORS[row % BRICK_COLORS.length],
        });
      }
    }

    // Launch ball at random upward angle
    const launchBall = () => {
      if (!gameState.current.waiting) return;

      const speed = 5;
      // Random angle between -60 and 60 degrees from vertical (upward)
      const angle = (Math.random() * 120 - 60) * (Math.PI / 180);
      ball.current.dx = speed * Math.sin(angle);
      ball.current.dy = -speed * Math.cos(angle);
      gameState.current.waiting = false;
    };

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = true;
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState.current.gameOver) {
          resetGame();
        } else {
          launchBall();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function render() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const b = ball.current;
      const p = paddle.current;
      const k = keys.current;
      const paddleY = canvas.height - 25 - p.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score.current}`, 10, 30);

      // Draw lives
      ctx.textAlign = 'right';
      ctx.fillText(`Lives: ${gameState.current.lives}`, canvas.width - 10, 30);

      // Update paddle position (only if game not over)
      if (!gameState.current.gameOver) {
        if (k.left) p.x -= p.speed;
        if (k.right) p.x += p.speed;
      }

      // Keep paddle in bounds
      if (p.x < 0) p.x = 0;
      if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

      // Update ball position (only if game not over)
      if (!gameState.current.gameOver) {
        // If waiting, ball sticks to paddle
        if (gameState.current.waiting) {
          b.x = p.x + p.width / 2;
          b.y = paddleY - b.radius;
        } else {
          // Update ball position
          b.x += b.dx;
          b.y += b.dy;
        }
      }

      // Draw ball
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();

      // Draw paddle
      ctx.fillStyle = '#fff';
      ctx.fillRect(p.x, paddleY, p.width, p.height);

      // Draw bricks
      bricks.current.forEach((brick) => {
        if (brick.visible) {
          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
      });

      // Draw game messages
      if (gameState.current.gameOver) {
        ctx.fillStyle = '#ff4444';
        ctx.font = '32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '20px sans-serif';
        ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText(`Final Score: ${score.current}`, canvas.width / 2, canvas.height / 2 + 50);
      } else if (gameState.current.waiting) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to launch', canvas.width / 2, canvas.height / 2);
      }

      // Physics and collision detection (only if game not over)
      if (!gameState.current.gameOver) {
        // Bounce off top wall
        if (b.y - b.radius <= 0) {
          b.dy *= -1;
        }

        // Bounce off side walls
        if (b.x + b.radius >= canvas.width || b.x - b.radius <= 0) {
          b.dx *= -1;
        }

        // Brick collision detection
        bricks.current.forEach((brick) => {
          if (!brick.visible) return;

          // Check if ball overlaps brick
          if (
            b.x + b.radius > brick.x &&
            b.x - b.radius < brick.x + brick.width &&
            b.y + b.radius > brick.y &&
            b.y - b.radius < brick.y + brick.height
          ) {
            brick.visible = false;
            score.current += 10; // Add 10 points for each brick destroyed

            // Determine bounce direction based on collision side
            const overlapLeft = b.x + b.radius - brick.x;
            const overlapRight = brick.x + brick.width - (b.x - b.radius);
            const overlapTop = b.y + b.radius - brick.y;
            const overlapBottom = brick.y + brick.height - (b.y - b.radius);

            const minOverlapX = Math.min(overlapLeft, overlapRight);
            const minOverlapY = Math.min(overlapTop, overlapBottom);

            if (minOverlapX < minOverlapY) {
              b.dx *= -1; // Hit from side
            } else {
              b.dy *= -1; // Hit from top/bottom
            }
          }
        });

        // Bounce off paddle
        if (
          !gameState.current.waiting &&
          b.y + b.radius >= paddleY &&
          b.y - b.radius <= paddleY + p.height &&
          b.x >= p.x &&
          b.x <= p.x + p.width
        ) {
          b.dy = -Math.abs(b.dy);
          b.y = paddleY - b.radius;
        }

        // Ball falls past paddle - lose a life
        if (b.y + b.radius >= canvas.height) {
          gameState.current.lives--;

          if (gameState.current.lives <= 0) {
            // Game over
            gameState.current.gameOver = true;
            gameState.current.waiting = true;
            b.dx = 0;
            b.dy = 0;
          } else {
            // Reset ball position but keep playing
            gameState.current.waiting = true;
            b.x = p.x + p.width / 2;
            b.y = paddleY - b.radius;
            b.dx = 0;
            b.dy = 0;
          }
        }
      }

      animation_ref.current = requestAnimationFrame(render);
    }

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animation_ref.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <View style={styles.container}>
      <canvas ref={canvas_ref} id='game_screen' height={canvas_height} width={canvas_width} style={{ border: '1px solid white' }}/>
      <View style={styles.controlsContainer}>
        <Text style={styles.controlsTitle}>Controls</Text>
        <View style={styles.controlsRow}>
          <Text style={styles.key}>←</Text>
          <Text style={styles.controlText}>or</Text>
          <Text style={styles.key}>A</Text>
          <Text style={styles.controlText}>Move Left</Text>
        </View>
        <View style={styles.controlsRow}>
          <Text style={styles.key}>→</Text>
          <Text style={styles.controlText}>or</Text>
          <Text style={styles.key}>D</Text>
          <Text style={styles.controlText}>Move Right</Text>
        </View>
        <View style={styles.controlsRow}>
          <Text style={styles.keyWide}>SPACE</Text>
          <Text style={styles.controlText}>Launch Ball / Restart Game</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  controlsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  controlsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  key: {
    color: '#fff',
    backgroundColor: '#555',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 36,
    textAlign: 'center',
  },
  keyWide: {
    color: '#fff',
    backgroundColor: '#555',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  controlText: {
    color: '#aaa',
    fontSize: 14,
  },
});
