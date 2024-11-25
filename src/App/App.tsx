import { Button, Col, Container, Dropdown, Row } from "react-bootstrap";
import store from "../store/store";
import { drawCard, resetDeck, undoDraw, useDeck } from "../store/deck";
import { useEffect, useState } from "react";

export const colors = ["red", "blue", "green", "yellow"];

export const getNewColors = (playerColors: string[], newColor: string, index: number) => {
  const newColors: string[] = [...playerColors];
  newColors[index] = newColor;
  return newColors;
}

export const App = () => {
  const deck = useDeck() || {};
  const { currentCard } = deck;

  const [playerColors, setPlayerColors] = useState(["red", "blue"]);
  const [activePlayer, setActivePlayer] = useState(Math.floor(Math.random() * playerColors.length));
  const [isUndo, setIsUndo] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const skipUpdatePlayer = (isUndo ? currentCard : deck.drawnCards[deck.drawnCards.length - 1]) === "2"
    setTimeout(() => {
      setDrawing(false);
    }, 125);
    if (skipUpdatePlayer) {
      return;
    }
    if (activePlayer > 0) {
      setActivePlayer(activePlayer - 1);
    } else {
      setActivePlayer(playerColors.length - 1);
    }
    setIsUndo(false);
  }, [currentCard]);

  return (
    <Container style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Row style={{ flexShrink: 1 }}>
        <Col>
          <Button style={{
            width: "100%",
          }} variant="danger" onClick={() => {
            store.dispatch(resetDeck(""));
            setActivePlayer(Math.floor(Math.random() * playerColors.length));
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
            justifyContent: "center",
            alignItems: "center",
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
            <h1>{currentCard || "Draw a card!"}</h1>
          </a>
        </Col>
      </Row>
      <Row style={{ flexShrink: 1 }}>
        <Col>
            <p style={{ textAlign: "center" }}>Draw Pile: {deck.cards.length}</p>
        </Col>
        <Col>
            <p style={{ textAlign: "center" }}>Discard Pile: {deck.drawnCards.length}</p>
        </Col>
      </Row>
      <Row style={{ flexShrink: 1 }}>
        {playerColors.map((color, index) => (
          <Col key={index} style={{ flexGrow: 1 }}>
            <Dropdown style={{
              width: "100%",
              backgroundColor: activePlayer === index ? color : "white",
              border: `3px solid ${color}`,
              opacity: activePlayer === index ? "1" : "0.5",
              borderRadius: "10px",
            }} >
              <Dropdown.Toggle>{`Player ${index + 1}`}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  disabled={playerColors.includes("red")}
                  onClick={() => setPlayerColors(getNewColors(playerColors, "red", index))}
                >Red</Dropdown.Item>
                <Dropdown.Item
                  disabled={playerColors.includes("blue")}
                  onClick={() => setPlayerColors(getNewColors(playerColors, "blue", index))}
                >Blue</Dropdown.Item>
                <Dropdown.Item
                  disabled={playerColors.includes("green")}
                  onClick={() => setPlayerColors(getNewColors(playerColors, "green", index))}
                >Green</Dropdown.Item>
                <Dropdown.Item
                  disabled={playerColors.includes("yellow")}
                  onClick={() => setPlayerColors(getNewColors(playerColors, "yellow", index))}
                >Yellow</Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  const newPlayers = [...playerColors];
                  newPlayers.splice(index, 1);
                  setPlayerColors(newPlayers);
                }} >Remove</Dropdown.Item>
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
                setPlayerColors([...playerColors, colors.find(color => !playerColors.includes(color)) || "red"]);
              }
            }}
          >Add Player</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default App
