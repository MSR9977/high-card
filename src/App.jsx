import "./App.css";
import { makeShuffledDeck } from "./utils.jsx";
import { useState } from "react";
import PlayingCard from "./components/PlayingCard.jsx";

/**
 * App component
 * Main game component that manages deck, rounds, scoring, and UI.
 */
function App(props) {
  // Set default value of card deck to new shuffled deck
  const [cardDeck, setCardDeck] = useState(makeShuffledDeck());
  // currCards holds the cards from the current round for player1 and player2
  const [currCards, setCurrCards] = useState([]);
  // Track wins for player 1 and player 2
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  // Track whether the game is over (deck exhausted)
  const [gameOver, setGameOver] = useState(false);
  // Trigger animation state for sequential player card flips
  const [isDealing, setIsDealing] = useState(false);

  /**
   * dealCards
   * Draw two cards from the deck and decide the round winner.
   */
  const dealCards = () => {
    if (gameOver) return;

    // If not enough cards to deal, mark game over
    if (cardDeck.length < 2) {
      setGameOver(true);
      return;
    }

    // Start the sequential flip animation for this deal
    setIsDealing(true);

    const nextDeck = [...cardDeck];
    const card1 = nextDeck.pop();
    const card2 = nextDeck.pop();
    setCurrCards([card1, card2]);

    // Determine round winner by comparing rank
    if (card1.rank > card2.rank) {
      setScores((s) => ({ ...s, p1: s.p1 + 1 }));
    } else if (card2.rank > card1.rank) {
      setScores((s) => ({ ...s, p2: s.p2 + 1 }));
    }

    // Update the deck state after dealing cards
    setCardDeck(nextDeck);

    // End animation after the deal sequence finishes
    window.setTimeout(() => setIsDealing(false), 900);

    // If deck runs out after this deal, mark game over
    if (nextDeck.length < 2) {
      setGameOver(true);
    }
  };

  /**
   * restartGame
   * Reset the game: new shuffled deck, clear scores and round cards.
   */
  const restartGame = () => {
    setCardDeck(makeShuffledDeck());
    setCurrCards([]);
    setScores({ p1: 0, p2: 0 });
    setGameOver(false);
    setIsDealing(false);
  };

  // Create elements for current round cards (player 1 and player 2)
  const currCardElems = (
    <div className={`table ${isDealing ? "deal-active" : ""}`}>
      <div className="player">
        <div className="player-label">Player 1</div>
        <PlayingCard
          card={currCards[0]}
          slot={0}
          animating={isDealing}
          alt={currCards[0] ? `${currCards[0].name} of ${currCards[0].suit}` : "card back"}
        />
      </div>
      <div className="player">
        <div className="player-label">Player 2</div>
        <PlayingCard
          card={currCards[1]}
          slot={1}
          animating={isDealing}
          alt={currCards[1] ? `${currCards[1].name} of ${currCards[1].suit}` : "card back"}
        />
      </div>
    </div>
  );

  // Determine overall game winner when gameOver is true
  const gameWinner = gameOver
    ? scores.p1 > scores.p2
      ? "Player 1"
      : scores.p2 > scores.p1
      ? "Player 2"
      : "Tie"
    : null;

  return (
    <div className="app-root">
      <div className="play-area">
        <div className="card">
          <h2 className="card-title">High Card ♠️ </h2>

          <div className="scoreboard">
          <div>Player 1: <strong>{scores.p1}</strong></div>
          <div>Player 2: <strong>{scores.p2}</strong></div>
          <div>Cards left: <strong>{cardDeck.length}</strong></div>
        </div>

        {currCardElems}

        <div className="controls">
          <button className="btn-deal" onClick={dealCards} disabled={gameOver || cardDeck.length < 2}>
            Deal
          </button>
          <button className="btn-restart" onClick={restartGame}>
            Restart Game
          </button>
        </div>

        {gameOver && (
          <div className="game-over">
            <h3>Game Over</h3>
            <p>Winner: {gameWinner}</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default App;
