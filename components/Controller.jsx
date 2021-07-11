import styled from "styled-components";
import { DarkMode } from "@styled-icons/material-sharp";
import { Layout } from "@styled-icons/feather";
import { LockAlt } from "@styled-icons/boxicons-regular";
import { PersonLinesFill } from "@styled-icons/bootstrap";
import { Play } from "@styled-icons/boxicons-regular";
import { Revision } from "@styled-icons/boxicons-regular";
import { ZoomIn } from "@styled-icons/feather";

import ProgressBar from "./ProgressBar";

function Controller({ jumpToPlay, togglePlay, toggleFrame, toggleVideo, percent, barRef, reset, currentTime, duration }) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration - 60 * minutes)
        .toString()
        .padStart(2, "0");
    const stringDue = `${minutes}:${seconds}`;
    return (
        <Container>
            <ProgressBar jumpToPlay={jumpToPlay} percent={percent} barRef={barRef} />
            <Buttons>
                <ButtonFull onClick={togglePlay}>
                    <Play />
                </ButtonFull>
                <Time>
                    <p>
                        {currentTime}/{stringDue}
                    </p>
                </Time>
                <Button>
                    <ZoomIn />
                </Button>
                <Button>
                    <DarkMode />
                </Button>
                <Button onClick={toggleFrame}>
                    <Layout />
                </Button>
                <Button onClick={toggleVideo}>
                    <PersonLinesFill />
                </Button>
                <Button>
                    <LockAlt />
                </Button>
                <Button onClick={reset}>
                    <Revision />
                </Button>
            </Buttons>
        </Container>
    );
}

const Time = styled.div`
    display: flex;
    color: white;
    width: 50px;
    justify-content: center;
    align-items: center;
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

const ButtonFull = styled.button`
    cursor: pointer;
    width: 35px;
    border: none;
    background-color: transparent;
    > svg {
        color: white;
    }
`;

const Button = styled.button`
    cursor: pointer;
    width: 40px;
    padding: 5px 10px;
    border: 1px solid gray;
    background-color: transparent;
    border-radius: 4px;
    margin-left: 10px;
    background-color: #c7c1c1;
    > svg {
        color: #717171;
    }
`;

export default Controller;
