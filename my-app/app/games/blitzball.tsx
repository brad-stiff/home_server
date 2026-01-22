import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Player = {
    id: number;
    name: string;
    hp: number;
    sp: number;
    en: number;
    at: number;
    pa: number;
    bl: number;
    sh: number;
    ca: number;
}

type Team = {
    id: number;
    name: string;
    color_primary: string;
    color_secondary: string;
    players: Player[];
    player_positions: { [key: string]: {
      id: number
      x: number
      y: number
      rotation: number // in radians, 0 = right, π/2 = down, π = left, 3π/2 = up
      hasBall?: boolean // Whether the player in this position has the ball
    } };
}

const player_position_display_order = ["lf", "rf", "mf", "ld", "rd", "gl"];

export default function GameBlitzball() {
  const cell_size = 175;
  const circle_radius = 220;
  const rect_gap = 5;
  const rect_width = 10;
  const rect_height = 50;
  const canvas_height = 500;
  const canvas_width = 750;
  const canvas_ref = useRef<HTMLCanvasElement>(null);


  const team_a: Team = {
    id: 1,
    name: "Besaid Aurochs",
    color_primary: "#FFCA00",
    color_secondary: "#000000",
    players: [
      { id: 1, name: "Tidus", hp: 132, sp: 60, en: 10, at: 3, pa: 3, bl: 2, sh: 10, ca: 1 },
      { id: 2, name: "Datto", hp: 90, sp: 60, en: 12, at: 2, pa: 4, bl: 2, sh: 8, ca: 1 },
      { id: 3, name: "Letty", hp: 95, sp: 60, en: 7, at: 5, pa: 10, bl: 5, sh: 4, ca: 1 },
      { id: 4, name: "Jassu", hp: 100, sp: 63, en: 7, at: 10, pa: 7, bl: 5, sh: 1, ca: 1 },
      { id: 5, name: "Botta", hp: 105, sp: 60, en: 3, at: 10, pa: 6, bl: 5, sh: 1, ca: 1 },
      { id: 6, name: "Keepa", hp: 90, sp: 54, en: 4, at: 2, pa: 2, bl: 4, sh: 1, ca: 5 },
    ],
    player_positions: {
      "lf": { id: 1, x: 270, y: 180, rotation: 0, hasBall: false },
      "rf": { id: 2, x: 360, y: 180, rotation: 0, hasBall: false },
      "mf": { id: 3, x: 315, y: 250, rotation: 0, hasBall: false },
      "ld": { id: 4, x: 270, y: 320, rotation: 0, hasBall: false },
      "rd": { id: 5, x: 360, y: 320, rotation: 0, hasBall: false },
      "gl": { id: 6, x: 140, y: 250, rotation: 0, hasBall: false },
    },
  }

  const team_b: Team = {
    id: 2,
    name: "Luca Goers",
    color_primary: "#F2A5E3",
    color_secondary: "grey",
    players: [
      { id: 7, name: "Bickson", hp: 140, sp: 60, en: 12, at: 3, pa: 5, bl: 2, sh: 12, ca: 1 },
      { id: 8, name: "Abus", hp: 130, sp: 60, en: 9, at: 3, pa: 4, bl: 1, sh: 13, ca: 1 },
      { id: 9, name: "Graav", hp: 207, sp: 60, en: 9, at: 8, pa: 13, bl: 8, sh: 8, ca: 2 },
      { id: 10, name: "Doram", hp: 142, sp: 60, en: 3, at: 9, pa: 7, bl: 5, sh: 1, ca: 1 },
      { id: 11, name: "Balgerda", hp: 141, sp: 60, en: 5, at: 9, pa: 9, bl: 8, sh: 1, ca: 1 },
      { id: 12, name: "Raudy", hp: 142, sp: 60, en: 4, at: 2, pa: 2, bl: 4, sh: 1, ca: 8 }
    ],
    player_positions: {
      "lf": { id: 7, x: 390, y: 180, rotation: Math.PI, hasBall: false },
      "rf": { id: 8, x: 480, y: 180, rotation: Math.PI, hasBall: false },
      "mf": { id: 9, x: 435, y: 250, rotation: Math.PI, hasBall: false },
      "ld": { id: 10, x: 390, y: 320, rotation: Math.PI, hasBall: false },
      "rd": { id: 11, x: 480, y: 320, rotation: Math.PI, hasBall: false },
      "gl": { id: 12, x: 610, y: 250, rotation: Math.PI, hasBall: false },
    },
  }

  const gameState = useRef({
    // Blitzball game state
    currentHalf: 1, // 1 or 2
    timeRemaining: 300, // seconds (5 minutes = 300 seconds)
    scoreTeamA: 0,
    scoreTeamB: 0,
    ballPossession: null as number | null, // Player ID who has the ball
    gamePhase: 'normal', // 'normal', 'tackling', 'scoring'
    halfTime: false,
    lastScoringTeam: null as number | null, // Team ID that was last scored on
  });

  /*

    Besaid Aurochs – Oceanic & Bright
    Primary Blue: #1E4E8C
    Accent Yellow: #FFD23F
    Light Blue Trim: #3A7BD5

    Luca Goers – Regal & Bold
    Royal Purple: #4B2E83
    Gold: #FFD700
    Deep Red Accent: #8B0000

    Kilika Beasts – Fiery & Tropical
    Flame Orange: #E25822
    Deep Red: #A52A2A
    Warm Yellow: #FFB347

    Al Bhed Psyches – Techy & Vibrant
    Neon Green: #39FF14
    Dark Olive: #556B2F
    Metallic Gray: #A9A9A9

    Ronso Fangs – Icy & Strong
    Ice Blue: #87CEFA
    Deep Navy: #001F3F
    Frost White: #F0F8FF

    Guado Glories – Elegant & Mysterious
    Teal: #008080
    Dark Cyan: #005F5F
    Pale Gold: #E6BE8A
  */

  //goalies wont get drawn on the canvas
  //players are drawn as a triangle
  //player with the ball has a white circle drawn around them
  //if an opponent touches the player with ball, they must break through their tackles or pass or shoot before they can move again

  //players can move in any direction, but they cannot move through each other
  //players can move diagonally

  //player positions
  //lf
  //rf
  //mf
  //ld
  //rd
  //gl

  const initializeGame = () => {
    // Reset game state
    gameState.current = {
      currentHalf: 1,
      timeRemaining: 300,
      scoreTeamA: 0,
      scoreTeamB: 0,
      ballPossession: null,
      gamePhase: 'normal',
      halfTime: false,
      lastScoringTeam: null,
    };

    // Give ball to random team's midfielder (mf) for first half
    const randomTeam = Math.random() < 0.5 ? team_a : team_b;
    const mfPlayer = randomTeam.players.find(p => p.id === randomTeam.player_positions["mf"].id);
    console.log('Initializing game - random team:', randomTeam.name, 'mf player:', mfPlayer?.name);
    if (mfPlayer) {
      gameState.current.ballPossession = mfPlayer.id;
      randomTeam.player_positions["mf"].hasBall = true;
      console.log('Ball possession set to:', mfPlayer.name, 'ID:', mfPlayer.id);
    }
  };

  useEffect(() => {
    initializeGame();
    const canvas = canvas_ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // Function to clamp a point to stay within the circle
    const clampToCircle = (x: number, y: number, centerX: number, centerY: number, radius: number): {x: number, y: number} => {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= radius) {
        return { x, y }; // Already inside
      }

      // Move point to edge of circle
      const ratio = radius / distance;
      return {
        x: centerX + dx * ratio,
        y: centerY + dy * ratio
      };
    };

    // Animation loop
    const animate = () => {
      // Clear previous drawings
      ctx.clearRect(0, 0, canvas_width, canvas_height);

      // Draw blue circle
      ctx.beginPath();
      ctx.arc(canvas_width / 2, canvas_height / 2, circle_radius, 0, Math.PI * 2);
      ctx.fillStyle = "#4E818E";
      ctx.fill();

      // Draw goal rectangles
      ctx.fillStyle = "#4E818E";
      ctx.fillRect(canvas_width / 2 - circle_radius - rect_gap - rect_width, canvas_height / 2 - rect_height / 2, rect_width, rect_height);
      ctx.fillRect(canvas_width / 2 + circle_radius + rect_gap, canvas_height / 2 - rect_height / 2, rect_width, rect_height);

      // Draw grid
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      const gridOffsetX = (canvas_width % cell_size) / 2;
      const gridOffsetY = (canvas_height % cell_size) / 2;

      for (let x = gridOffsetX; x <= canvas_width; x += cell_size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas_height);
        ctx.stroke();
      }

      for (let y = gridOffsetY; y <= canvas_height; y += cell_size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas_width, y);
        ctx.stroke();
      }

      // Function to check if a point is inside the main circle
    const isPointInCircle = (x: number, y: number, centerX: number, centerY: number, radius: number): boolean => {
      const dx = x - centerX;
      const dy = y - centerY;
      return (dx * dx + dy * dy) <= (radius * radius);
    };

    // Function to clamp a point to stay within the circle
    const clampToCircle = (x: number, y: number, centerX: number, centerY: number, radius: number): {x: number, y: number} => {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= radius) {
        return { x, y }; // Already inside
      }

      // Move point to edge of circle
      const ratio = radius / distance;
      return {
        x: centerX + dx * ratio,
        y: centerY + dy * ratio
      };
    };

    // Helper function to move player toward target
    function movePlayerTowardTarget(position: any, target: {x: number, y: number}, speed: number) {
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) { // Only move if not close to target
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        // Check if move would go outside circle
        const newX = position.x + moveX;
        const newY = position.y + moveY;
        const clampedPos = clampToCircle(newX, newY, canvas_width / 2, canvas_height / 2, circle_radius);

        position.x = clampedPos.x;
        position.y = clampedPos.y;
      }
    }

    // Function to draw a player triangle with team colors
    const drawPlayerTriangle = (player: Player, team: Team, size: number = 12) => {
      if (player.name.includes("GK") || player.name.includes("goalkeeper")) return; // Skip goalies

      // Find the player's position data
      const positionKey = Object.keys(team.player_positions).find(key => team.player_positions[key].id === player.id);
      if (!positionKey) return;

      const position = team.player_positions[positionKey];

      // Ensure player stays within the main circle
      const centerX = canvas_width / 2;
      const centerY = canvas_height / 2;
      const clampedPos = clampToCircle(position.x, position.y, centerX, centerY, circle_radius);

      ctx.save();
      ctx.translate(clampedPos.x, clampedPos.y);
      ctx.rotate(position.rotation);

      // Fill with primary color
      ctx.fillStyle = team.color_primary;
      ctx.strokeStyle = team.color_secondary;
      ctx.lineWidth = 2;

      ctx.beginPath();
      // Triangle pointing to the right (before rotation)
      // Top point: (size, 0)
      // Bottom left: (-size/2, -size/2)
      // Bottom right: (-size/2, size/2)
      ctx.moveTo(size, 0);
      ctx.lineTo(-size/2, -size/2);
      ctx.lineTo(-size/2, size/2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw white circle around player with ball
      if (position.hasBall) {
        // Don't save/restore context - we're already translated to the player position
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, size + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas_width, canvas_height);

    // === Draw Blue Circle in Center ===
    const centerX = canvas_width / 2;
    const centerY = canvas_height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, circle_radius, 0, Math.PI * 2);
    ctx.fillStyle = "#4E818E";
    ctx.fill();

    // === Draw Rectangles to Left & Right ===
    ctx.fillStyle = "#4E818E"; // rectangle color

    // Left rectangle
    ctx.fillRect(
      centerX - circle_radius - rect_gap - rect_width,
      centerY - rect_height / 2,
      rect_width,
      rect_height
    );

    // Right rectangle
    ctx.fillRect(
      centerX + circle_radius + rect_gap,
      centerY - rect_height / 2,
      rect_width,
      rect_height
    );

    ctx.strokeStyle = "#ccc"; // Grid line color
    ctx.lineWidth = 1;

    // Calculate offsets to center the grid
    const offsetX = (canvas_width % cell_size) / 2;
    const offsetY = (canvas_height % cell_size) / 2;

    // Draw vertical lines
    for (let x = offsetX; x <= canvas_width; x += cell_size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas_height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = offsetY; y <= canvas_height; y += cell_size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas_width, y);
      ctx.stroke();
    }

      // Draw all players in their dice-5 formations (excluding goalies)
      player_position_display_order.forEach((position) => {
        if (position !== "gl") { // Skip goalie
          const playerA = team_a.players.find(p => p.id === team_a.player_positions[position].id);
          if (playerA) {
            drawPlayerTriangle(playerA, team_a);
          }
          const playerB = team_b.players.find(p => p.id === team_b.player_positions[position].id);
          if (playerB) {
            drawPlayerTriangle(playerB, team_b);
          }
        }
      });

      // Update game logic
      updateGameLogic();

      // Continue animation loop
      animationId = requestAnimationFrame(animate);
    };

    // AI Movement and Game Logic (called each frame)
    const updateGameLogic = () => {

      // AI Movement Logic
      if (gameState.current.gamePhase === 'normal') {
        const ballCarrierTeam = gameState.current.ballPossession ?
          (team_a.players.some(p => p.id === gameState.current.ballPossession) ? team_a : team_b) : null;
        const defensiveTeam = ballCarrierTeam === team_a ? team_b : team_a;

        console.log('AI Movement - Ball carrier team:', ballCarrierTeam?.name, 'Defensive team:', defensiveTeam?.name);

        // Move players toward their targets
        Object.keys(team_a.player_positions).forEach(posKey => {
          if (posKey !== "gl") { // Don't move goalie
            const position = team_a.player_positions[posKey];
            const target = ballCarrierTeam === team_a ?
              { x: canvas_width - 50, y: canvas_height / 2 } : // Team A attacking right goal
              getBallCarrierPosition(); // Team A defending

            movePlayerTowardTarget(position, target, 3); // Even faster movement
          }
        });

        Object.keys(team_b.player_positions).forEach(posKey => {
          if (posKey !== "gl") { // Don't move goalie
            const position = team_b.player_positions[posKey];
            const target = ballCarrierTeam === team_b ?
              { x: 50, y: canvas_height / 2 } : // Team B attacking left goal
              getBallCarrierPosition(); // Team B defending

            movePlayerTowardTarget(position, target, 3); // Even faster movement
          }
        });
      }

      // Goal scoring detection
      if (gameState.current.ballPossession && gameState.current.gamePhase === 'normal') {
        const ballCarrier = [...team_a.players, ...team_b.players].find(p => p.id === gameState.current.ballPossession);
        const ballCarrierPosition = Object.values({...team_a.player_positions, ...team_b.player_positions}).find(pos => pos.id === gameState.current.ballPossession);

        if (ballCarrier && ballCarrierPosition) {
          const ballCarrierTeam = team_a.players.some(p => p.id === ballCarrier.id) ? team_a : team_b;

          // Check if ball carrier reached their target goal
          let scored = false;
          if (ballCarrierTeam === team_a && ballCarrierPosition.x >= canvas_width - 60) {
            // Team A scored in right goal
            gameState.current.scoreTeamA++;
            scored = true;
          } else if (ballCarrierTeam === team_b && ballCarrierPosition.x <= 60) {
            // Team B scored in left goal
            gameState.current.scoreTeamB++;
            scored = true;
          }

          if (scored) {
            console.log(`Goal! ${ballCarrierTeam.name} scored. Score: ${gameState.current.scoreTeamA}-${gameState.current.scoreTeamB}`);

            // Reset positions and give ball to other team
            Object.values(team_a.player_positions).forEach(pos => pos.hasBall = false);
            Object.values(team_b.player_positions).forEach(pos => pos.hasBall = false);

            const otherTeam = ballCarrierTeam === team_a ? team_b : team_a;
            const mfPlayer = otherTeam.players.find(p => p.id === otherTeam.player_positions["mf"].id);
            if (mfPlayer) {
              gameState.current.ballPossession = mfPlayer.id;
              otherTeam.player_positions["mf"].hasBall = true;
            }
          }
        }
      }

      // Collision detection and tackle mechanics
      if (gameState.current.ballPossession && gameState.current.gamePhase === 'normal') {
        const ballCarrier = [...team_a.players, ...team_b.players].find(p => p.id === gameState.current.ballPossession);
        const ballCarrierPosition = Object.values({...team_a.player_positions, ...team_b.player_positions}).find(pos => pos.id === gameState.current.ballPossession);

        if (ballCarrier && ballCarrierPosition && ballCarrierPosition.hasBall) {
          // Check collision with all other players
          const allPlayers = [...team_a.players, ...team_b.players];
          const allPositions = {...team_a.player_positions, ...team_b.player_positions};

          for (const player of allPlayers) {
            if (player.id === ballCarrier.id) continue; // Skip self

            const playerPos = Object.values(allPositions).find(pos => pos.id === player.id);
            if (!playerPos) continue;

            // Simple circle collision detection (using triangle size + some buffer)
            const dx = ballCarrierPosition.x - playerPos.x;
            const dy = ballCarrierPosition.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const collisionDistance = 24; // Triangle size (12) * 2

            if (distance < collisionDistance) {
              // Collision detected! Enter tackling phase
              gameState.current.gamePhase = 'tackling';
              console.log(`Tackle! ${ballCarrier.name} collided with ${player.name}`);
              // TODO: Implement tackle resolution mechanics
              break;
            }
          }
        }
      }
    };

    // Start animation loop
    animate();

    // Helper function to move player toward target
    function movePlayerTowardTarget(position: any, target: {x: number, y: number}, speed: number) {
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) { // Only move if not close to target
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        // Check if move would go outside circle
        const newX = position.x + moveX;
        const newY = position.y + moveY;
        const clampedPos = clampToCircle(newX, newY, canvas_width / 2, canvas_height / 2, circle_radius);

        position.x = clampedPos.x;
        position.y = clampedPos.y;
      }
    }

    // Helper function to get ball carrier position
    function getBallCarrierPosition() {
      if (!gameState.current.ballPossession) return { x: canvas_width / 2, y: canvas_height / 2 };

      // Find ball carrier position across both teams
      for (const team of [team_a, team_b]) {
        const posEntry = Object.entries(team.player_positions).find(([key, pos]) => pos.id === gameState.current.ballPossession);
        if (posEntry) {
          return { x: posEntry[1].x, y: posEntry[1].y };
        }
      }
      return { x: canvas_width / 2, y: canvas_height / 2 };
    }

      // AI Movement Logic
      if (gameState.current.gamePhase === 'normal') {
        const ballCarrierTeam = gameState.current.ballPossession ?
          (team_a.players.some(p => p.id === gameState.current.ballPossession) ? team_a : team_b) : null;
        const defensiveTeam = ballCarrierTeam === team_a ? team_b : team_a;

        console.log('AI Movement - Ball carrier team:', ballCarrierTeam?.name, 'Defensive team:', defensiveTeam?.name);

        // Move players toward their targets
        Object.keys(team_a.player_positions).forEach(posKey => {
          if (posKey !== "gl") { // Don't move goalie
            const position = team_a.player_positions[posKey];
            const target = ballCarrierTeam === team_a ?
              { x: canvas_width - 50, y: canvas_height / 2 } : // Team A attacking right goal
              getBallCarrierPosition(); // Team A defending

            movePlayerTowardTarget(position, target, 3); // Even faster movement
          }
        });

        Object.keys(team_b.player_positions).forEach(posKey => {
          if (posKey !== "gl") { // Don't move goalie
            const position = team_b.player_positions[posKey];
            const target = ballCarrierTeam === team_b ?
              { x: 50, y: canvas_height / 2 } : // Team B attacking left goal
              getBallCarrierPosition(); // Team B defending

            movePlayerTowardTarget(position, target, 3); // Even faster movement
          }
        });
      }

      // Goal scoring detection
      if (gameState.current.ballPossession && gameState.current.gamePhase === 'normal') {
        const ballCarrier = [...team_a.players, ...team_b.players].find(p => p.id === gameState.current.ballPossession);
        const ballCarrierPosition = Object.values({...team_a.player_positions, ...team_b.player_positions}).find(pos => pos.id === gameState.current.ballPossession);

        if (ballCarrier && ballCarrierPosition) {
          const ballCarrierTeam = team_a.players.some(p => p.id === ballCarrier.id) ? team_a : team_b;

          // Check if ball carrier reached their target goal
          let scored = false;
          if (ballCarrierTeam === team_a && ballCarrierPosition.x >= canvas_width - 60) {
            // Team A scored in right goal
            gameState.current.scoreTeamA++;
            scored = true;
          } else if (ballCarrierTeam === team_b && ballCarrierPosition.x <= 60) {
            // Team B scored in left goal
            gameState.current.scoreTeamB++;
            scored = true;
          }

          if (scored) {
            console.log(`Goal! ${ballCarrierTeam.name} scored. Score: ${gameState.current.scoreTeamA}-${gameState.current.scoreTeamB}`);

            // Reset positions and give ball to other team
            Object.values(team_a.player_positions).forEach(pos => pos.hasBall = false);
            Object.values(team_b.player_positions).forEach(pos => pos.hasBall = false);

            const otherTeam = ballCarrierTeam === team_a ? team_b : team_a;
            const mfPlayer = otherTeam.players.find(p => p.id === otherTeam.player_positions["mf"].id);
            if (mfPlayer) {
              gameState.current.ballPossession = mfPlayer.id;
              otherTeam.player_positions["mf"].hasBall = true;
            }
          }
        }
      }

      // Collision detection and tackle mechanics
      if (gameState.current.ballPossession && gameState.current.gamePhase === 'normal') {
        const ballCarrier = [...team_a.players, ...team_b.players].find(p => p.id === gameState.current.ballPossession);
        const ballCarrierPosition = Object.values({...team_a.player_positions, ...team_b.player_positions}).find(pos => pos.id === gameState.current.ballPossession);

        if (ballCarrier && ballCarrierPosition && ballCarrierPosition.hasBall) {
          // Check collision with all other players
          const allPlayers = [...team_a.players, ...team_b.players];
          const allPositions = {...team_a.player_positions, ...team_b.player_positions};

          for (const player of allPlayers) {
            if (player.id === ballCarrier.id) continue; // Skip self

            const playerPos = Object.values(allPositions).find(pos => pos.id === player.id);
            if (!playerPos) continue;

            // Simple circle collision detection (using triangle size + some buffer)
            const dx = ballCarrierPosition.x - playerPos.x;
            const dy = ballCarrierPosition.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const collisionDistance = 24; // Triangle size (12) * 2

            if (distance < collisionDistance) {
              // Collision detected! Enter tackling phase
              gameState.current.gamePhase = 'tackling';
              console.log(`Tackle! ${ballCarrier.name} collided with ${player.name}`);
              // TODO: Implement tackle resolution mechanics
              break;
            }
          }
        }
      }


    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [canvas_width, canvas_height, cell_size, circle_radius, rect_gap, rect_width, rect_height]);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState.current.timeRemaining > 0) {
        gameState.current.timeRemaining--;
      } else if (gameState.current.currentHalf === 1) {
        // End of first half
        gameState.current.halfTime = true;
        gameState.current.currentHalf = 2;
        gameState.current.timeRemaining = 300;

        // Switch ball possession for second half
        const firstHalfTeam = gameState.current.ballPossession ? (team_a.players.some(p => p.id === gameState.current.ballPossession) ? team_a : team_b) : team_a;
        const secondHalfTeam = firstHalfTeam === team_a ? team_b : team_a;

        // Clear current ball possession
        Object.values(team_a.player_positions).forEach(pos => pos.hasBall = false);
        Object.values(team_b.player_positions).forEach(pos => pos.hasBall = false);

        // Give ball to other team's midfielder (mf)
        const mfPlayer = secondHalfTeam.players.find(p => p.id === secondHalfTeam.player_positions["mf"].id);
        if (mfPlayer) {
          gameState.current.ballPossession = mfPlayer.id;
          secondHalfTeam.player_positions["mf"].hasBall = true;
        }
      } else {
        // Game over - highest score wins
        gameState.current.gamePhase = 'gameOver';
      }
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <canvas ref={canvas_ref} id='game_screen' height={canvas_height} width={canvas_width} style={{ border: '1px solid white' }}/>

      <div style={{ display: "flex", height: "180px", fontFamily: "Arial, sans-serif" }}>
        {/* TEAM A COLUMN (400px) */}
        <div style={{ width: "400px", padding: "5px", boxSizing: "border-box" }}>
          <h2 style={{ textAlign: "center", color: team_a.color_primary, marginBottom: "5px", marginTop: "0", fontSize: "16px" }}>{team_a.name}</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f0f8ff", fontSize: "12px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>Pos</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>HP</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>SP</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>EN</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>AT</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>PA</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>BL</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>SH</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#e0f0ff", fontWeight: "bold" }}>CA</th>
              </tr>
            </thead>
            <tbody>
              {player_position_display_order.map((position, index) => {
                const player = team_a.players.find(p => p.id === team_a.player_positions[position].id);
                return player ? (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{position.toUpperCase()}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.name}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.hp}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.sp}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.en}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.at}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.pa}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.bl}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.sh}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.ca}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>

        {/* MIDDLE COLUMN (150px) - TIME AND SCROLLING */}
        <div style={{ width: "150px", padding: "5px", boxSizing: "border-box", borderLeft: "2px solid #ccc", borderRight: "2px solid #ccc" }}>
          {/* Game Info */}
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "white", textAlign: "center", marginBottom: "5px" }}>
            Half {gameState.current.currentHalf} - {Math.floor(gameState.current.timeRemaining / 60)}:{(gameState.current.timeRemaining % 60).toString().padStart(2, '0')}
          </div>
          <div style={{ fontSize: "12px", color: "white", textAlign: "center", marginBottom: "5px" }}>
            {team_a.name}: {gameState.current.scoreTeamA} | {team_b.name}: {gameState.current.scoreTeamB}
          </div>

          {/* Scrollable Section */}
          <div
            style={{
              width: "100%",
              height: "130px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "3px",
              background: "#f9f9f9",
              fontSize: "11px"
            }}
          >
            {/* Example scrollable content */}
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} style={{ marginBottom: "3px" }}>Log #{i + 1}</div>
            ))}
          </div>
        </div>

        {/* TEAM B COLUMN (400px) */}
        <div style={{ width: "400px", padding: "5px", boxSizing: "border-box" }}>
          <h2 style={{ textAlign: "center", color: team_b.color_primary, marginBottom: "5px", marginTop: "0", fontSize: "16px" }}>{team_b.name}</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff0f0", fontSize: "12px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>Pos</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>HP</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>SP</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>EN</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>AT</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>PA</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>BL</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>SH</th>
                <th style={{ border: "1px solid #ddd", padding: "3px 4px", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>CA</th>
              </tr>
            </thead>
            <tbody>
              {player_position_display_order.map((position, index) => {
                const player = team_b.players.find(p => p.id === team_b.player_positions[position].id);
                return player ? (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{position.toUpperCase()}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.name}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.hp}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.sp}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.en}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.at}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.pa}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.bl}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.sh}</td>
                    <td style={{ border: "1px solid #ddd", padding: "3px 4px", textAlign: "center" }}>{player.ca}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
