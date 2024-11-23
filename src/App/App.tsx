import { Button, Col, Container, Row } from "react-bootstrap";
import store from "../store/store";
import { drawCard, resetDeck, undoDraw, useDeck } from "../store/deck";

export const App = () => {
  const deck = useDeck() || {};
  console.log(deck)
  const { currentCard } = deck;

  return (
    <Container style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Row style={{ flexShrink: 1 }}>
        <Col>
          <Button style={{
            width: "100%",
          }} variant="danger" onClick={() => store.dispatch(resetDeck(""))}>End Game</Button>
        </Col>
        <Col>
          <Button style={{
            width: "100%",
          }} variant="light" onClick={() => store.dispatch(undoDraw(""))}>Undo</Button>
        </Col>
      </Row>

      {/* Current Card Row showing the current card */}
      <Row style={{ flexGrow: 1 }}>
        <Col style={{ alignContent: "center" }}>
          <a style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          href="" onClick={(e) => {
            e.preventDefault();
            store.dispatch(drawCard(""));
          }}>
            <h1>{currentCard || "Draw a card"}</h1>
          </a>
        </Col>
      </Row>
    </Container>
  )
}

export default App
