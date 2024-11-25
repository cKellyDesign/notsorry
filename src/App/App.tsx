import { Button, Col, Container, Dropdown, Row } from "react-bootstrap";
import store from "../store/store";
import { drawCard, resetDeck, undoDraw, useCurrentCard, useDeck } from "../store/deck";
import { useEffect, useState } from "react";
import { addPlayer, lastTurn, nextTurn, Player, removePlayer, resetPlayers, setPlayerColor, useCurrentPlayerIndex, usePlayers } from "../store/players";

export const App = () => {
  const deck = useDeck() || {};
  const currentCard = useCurrentCard();
  const players = usePlayers();
  const activePlayer = useCurrentPlayerIndex();
  const playerColors = players.map((player:Player) => player.color);

  const [isUndo, setIsUndo] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDrawing(false);
    }, 125);
    
    // Skip updating the player if the current card is a 2
    const skipUpdatePlayer = (isUndo ? currentCard : deck.drawnCards[deck.drawnCards.length - 1])?.type === "2"
    if (skipUpdatePlayer) {
      return;
    }

    if (isUndo) {
      store.dispatch(lastTurn(""));
    } else {
      store.dispatch(nextTurn(""));
    }

    setIsUndo(false);
  }, [currentCard]);

  return (
    <Container style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* End Game and Undo Row */}
      <Row style={{ flexShrink: 1 }}>
        <Col>
          <Button style={{
            width: "100%",
          }} variant="danger" onClick={() => {
            store.dispatch(resetDeck(""));
            store.dispatch(resetPlayers(""));
          }}>End Game</Button>
        </Col>

        <Col>
          <Button
            disabled={deck.drawnCards.length === 0}
            style={{
              width: "100%",
            }} variant="light" onClick={() => {
              setDrawing(true);
              setIsUndo(true);
              setTimeout(() => {
                store.dispatch(undoDraw(""));
              }, 125);
            }}>Undo</Button>
        </Col>
      </Row>

      {/* Current Card Row showing the current card */}
      <Row style={{ flexGrow: 1 }}>
        <Col style={{ alignContent: "center" }}>
          <a style={({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            height: "100%",
            transition: "opacity 0.125s",
            opacity: drawing ? 0.1 : 1,
          } as any)}
            href="" onClick={(e) => {
              e.preventDefault();
              setDrawing(true);
              setTimeout(() => {
                store.dispatch(drawCard(""));
              }, 125);
            }}>
            <h1 style={{ textAlign: "center", fontSize: "8rem", lineHeight: "0.8" }}>{currentCard ? currentCard.type : "Draw a card!"}</h1>
            {currentCard && <p style={{ textAlign: "center" }}>{currentCard.text}</p>}
          </a>
        </Col>
      </Row>

      {/* Draw and Discard Pile Row showing the number of cards in each pile */}
      <Row style={{ flexShrink: 1 }}>
        <Col>
          <p style={{ textAlign: "center" }}>Draw Pile: {deck.cards.length}</p>
        </Col>
        <Col>
          <p style={{ textAlign: "center" }}>Discard Pile: {deck.drawnCards.length}</p>
        </Col>
      </Row>

      {/* Player Color Row showing the players */}
      <Row style={{ flexShrink: 1 }}>
        {players.map((player: Player, index:number) => (
          <Col key={index} style={{ flexGrow: 1 }}>
            <Dropdown style={{
              width: "100%",
              backgroundColor: activePlayer === index ? player.color : "white",
              border: `3px solid ${player.color}`,
              opacity: activePlayer === index ? "1" : "0.5",
              borderRadius: "10px",
            }} >
              <Dropdown.Toggle>{`Player ${index + 1}`}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  disabled={playerColors.includes("red")}
                  onClick={() => store.dispatch(setPlayerColor({color: "red", index}))}
                >Red</Dropdown.Item>
                <Dropdown.Item
                  disabled={playerColors.includes("blue")}
                  onClick={() => store.dispatch(setPlayerColor({color: "blue", index}))}
                >Blue</Dropdown.Item>
                <Dropdown.Item
                  disabled={playerColors.includes("green")}
                  onClick={() => store.dispatch(setPlayerColor({color: "green", index}))}
                >Green</Dropdown.Item>
                <Dropdown.Item
                  disabled={playerColors.includes("yellow")}
                  onClick={() => store.dispatch(setPlayerColor({color: "yellow", index}))}
                >Yellow</Dropdown.Item>
                <Dropdown.Item onClick={() => store.dispatch(removePlayer({color: player.color}))}
                >Remove</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        ))}
        <Col style={{ flexShrink: 1 }}>
          <Button
            style={{
              width: "100%",
              opacity: "50%",
              border: "3px solid #0d6efd",
            }}
            onClick={() => {
              if (playerColors.length < 4) {
                store.dispatch(addPlayer(""))
              }
            }}
          >Add Player</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default App
