import styled, { css } from "styled-components";
import { DarkMode } from "@styled-icons/material-sharp";
import { Layout } from "@styled-icons/feather";
import { Lock as LockIcon } from "@styled-icons/entypo";
import { Pause, Play } from "@styled-icons/boxicons-regular";
import { PersonLinesFill } from "@styled-icons/bootstrap";
import { Revision } from "@styled-icons/boxicons-regular";
import { ZoomIn } from "@styled-icons/feather";
import { useAtom } from "jotai";

import ProgressBar from "./ProgressBar";
import { darkModeAtom, lockAtom, mobileModeAtom, playingAtom, withFrameAtom, withVideoAtom } from "../activityAtom";

function Controller({ jumpToPlay, togglePlay, percent, barRef, reset, currentTime, duration }) {
    const [play] = useAtom(playingAtom);
    const [withFrame, setWithFrame] = useAtom(withFrameAtom);
    const [darkMode, setDarkMode] = useAtom(darkModeAtom);
    const [mobileMode, setMobileMode] = useAtom(mobileModeAtom);

    const [lock, setLock] = useAtom(lockAtom);
    const [withVideo, setWithVideo] = useAtom(withVideoAtom);
    const toggleLock = () => {
        setLock(!lock);
    };
    const toggleFrame = () => {
        reset();
        setWithFrame(!withFrame);
    };

    const toggleDarkMode = () => {
        reset();
        setDarkMode(!darkMode);
    };

    const toggleMobileMode = () => {
        reset();
        setMobileMode(!mobileMode);
    };

    const toggleVideo = () => {
        setWithVideo(!withVideo);
    };

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration - 60 * minutes)
        .toString()
        .padStart(2, "0");
    const stringDue = `${minutes}:${seconds}`;
    return (
        <Container>
            <ProgressBar jumpToPlay={jumpToPlay} percent={percent} barRef={barRef} />
            <Buttons>
                <div>
                    <ButtonFull onClick={togglePlay}>{play ? <Pause /> : <Play />}</ButtonFull>
                    <Time>
                        <p>
                            {currentTime}/{stringDue}
                        </p>
                    </Time>
                    <Button onClick={toggleMobileMode} isActive={mobileMode}>
                        <ZoomIn />
                    </Button>
                    <Button onClick={toggleDarkMode} isActive={darkMode}>
                        <DarkMode />
                    </Button>
                    <Button onClick={toggleLock} isActive={lock}>
                        <LockIcon />
                    </Button>
                    <Button onClick={reset}>
                        <Revision />
                    </Button>
                </div>
                <div>
                    <ToggleButton onClick={toggleFrame} isActive={withFrame}>
                        <p>템플릿</p>
                    </ToggleButton>
                    <ToggleButton onClick={toggleVideo} isActive={withVideo}>
                        <p>강의자</p>
                    </ToggleButton>
                </div>
            </Buttons>
        </Container>
    );
}

const ToggleButton = styled.div`
    cursor: pointer;
    border: 1px solid gray;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    > p {
        font-size: 15px;
    }

    ${(props) =>
        props.isActive
            ? css`
                  color: white;
                  background-color: #5ca6d5;
                  border-right: 8px solid gray;
              `
            : css`
                  color: #7d7d7d;
                  background-color: #e9eaeb;
                  border-left: 8px solid gray;
              `};
`;

const Time = styled.div`
    display: flex;
    color: white;
    width: 50px;
    justify-content: center;
    align-items: center;
    > p {
        font-size: 15px;
    }
    padding-top: 4px;
    margin-right: 10px;
`;
const Container = styled.div`
    * {
        font-size: 9px;
    }
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    padding-bottom: 30px;
`;
const Buttons = styled.div`
    display: flex;
    height: 30px;
    flex-direction: row;
    justify-content: space-between;
    > div {
        display: flex;
    }
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
    border-radius: 4px;
    margin-left: 5px;
    margin-right: 5px;

    ${(props) =>
        props.isActive
            ? css`
                  background-color: #5ca6d5;
                  > svg {
                      color: white;
                  }
              `
            : css`
                  background-color: #c1c1c1;
                  > svg {
                      color: #717171;
                  }
              `};
`;

export default Controller;
