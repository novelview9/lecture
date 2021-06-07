import styled from "styled-components";

import ProgressBar from "./ProgressBar";

function Controller({ jumpToPlay, togglePlay, toggleFrame, toggleVideo, percent, barRef }) {
    return (
        <Container>
            <ProgressBar jumpToPlay={jumpToPlay} percent={percent} barRef={barRef} />
            <Buttons>
                <Button onClick={togglePlay}>play/pause</Button>
                <Button onClick={toggleFrame}>background on/off</Button>
                <Button onClick={toggleVideo}>video on/off</Button>
            </Buttons>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;
const Buttons = styled.div``;

const Button = styled.button``;

export default Controller;
