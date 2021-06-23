import styled from "styled-components";

import ProgressBar from "./ProgressBar";

function Controller({ jumpToPlay, togglePlay, toggleFrame, toggleVideo, percent, barRef, reset, currentTime }) {
    return (
        <Container>
            <ProgressBar jumpToPlay={jumpToPlay} percent={percent} barRef={barRef} />
            <Buttons>
                <Button onClick={togglePlay}>play/pause</Button>
                <Button onClick={toggleFrame}>background on/off</Button>
                <Button onClick={toggleVideo}>video on/off</Button>
                <Button onClick={reset}>reset</Button>
                <Time>
                    <p>{currentTime}</p>
                </Time>
            </Buttons>
        </Container>
    );
}

const Time = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 10px;
`;
const Container = styled.div`
    * {
        font-size: 10px;
    }
    display: flex;
    flex-direction: column;
`;
const Buttons = styled.div`
    display: flex;
    height: 30px;
`;

const Button = styled.button``;

export default Controller;
