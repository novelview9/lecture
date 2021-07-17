import _ from "lodash";
import React from "react";
import shortid from "shortid";
import styled, { css } from "styled-components";
import { createBreakpoint } from "react-use";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

import Content from "../components/Content";
import Controller from "../components/Controller";
import Video from "../components/Video";
import input from "../input1.json";
import activityAtom, { darkModeAtom, mobileModeAtom, playingAtom, withVideoAtom } from "../activityAtom";

const ControllerLine = ({ content, duration }) => {
    const startTimes = _.map(content, "end_time");
    if (!duration) {
        return <p key={shortid.generate()}></p>;
    }

    return (
        <Line>
            {startTimes.map((time) => {
                return (
                    <LinePoint value={(time / duration) * 100} key={shortid.generate()}>
                        <Circle />
                    </LinePoint>
                );
            })}
        </Line>
    );
};

const Circle = styled.div`
    width: 10px;
    height: 10px;
    position: absolute;
    left: 100%;
    z-index: 999;
    border-radius: 45%;
    background-color: yellow;
`;
const LinePoint = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 5px;
    width: ${(props) => props.value}%;
    height: 10px;
`;
const Line = styled.div`
    margin-top: 10px;
    pointer-events: none;
    display: flex;
    width: 100%;
    height: 20px;
    position: absolute;
    z-index: 200;
    overflow: hidden;
    top: 0;
    > div:last-child {
        visibility: hidden;
    }
`;

const modeSelector = ({ mobile, dark }) => {
    if (mobile === false && dark === false) {
        return "original";
    }

    if (mobile === false && dark === true) {
        return "original_dark";
    }

    if (mobile === true && dark === false) {
        return "restructure";
    }

    if (mobile === true && dark === true) {
        return "restructure_dark";
    }
};
const imageSelector = ({ location, dark }) => {
    if ((location === "top") & (dark === false)) {
        return "top_img";
    }
    if ((location === "top") & (dark === true)) {
        return "top_img_dark";
    }

    if ((location === "bottom") & (dark === false)) {
        return "bottom_img";
    }
    if ((location === "bottom") & (dark === true)) {
        return "bottom_img_dark";
    }
};

const Main = () => {
    const [dark] = useAtom(darkModeAtom);
    const [mobile] = useAtom(mobileModeAtom);
    // // const content = input.content[modeSelector({ mobile, dark })];
    const [content, setContent] = useState(input.content.original);
    useEffect(() => {
        reset();
        setContent(input.content[modeSelector({ mobile, dark })]);
    }, [dark, mobile]);

    const [percent, setPercent] = useState(0);
    const [currentTime, setCurrentTime] = useState("00:00");
    const [key, setKey] = useState(shortid.generate());

    const childRef = useRef();
    const reset = () => {
        childRef.current.resetHandle();
        setKey(() => shortid.generate());
    };
    const [activity, setActivity] = useAtom(activityAtom);
    const videoRef = useRef(null);

    const [withVideo] = useAtom(withVideoAtom);
    const [playing, setPlaying] = useAtom(playingAtom);

    const togglePlay = () => {
        const video = videoRef.current;
        const method = video.paused ? "play" : "pause";
        video[method]();
        setPlaying(!video.paused);
    };

    const videoSource = input.sourcePath + input.video.source;

    const onTimeEvent = () => {
        const video = videoRef.current;
        const time = video.currentTime;
        const slide = _.findLastIndex(content, (obj) => obj.start_time < time);
        const action = activity.slide === slide ? "playing" : "flip";
        setActivity({ slide, action, time });
        const percentPoint = time / video.duration;
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        const stringMin = minutes.toString().padStart(2, "0");
        setCurrentTime(`${minutes}:${seconds}`);
        setPercent(percentPoint * 100);
    };

    const barRef = useRef(null);
    const [duration, setDuration] = useState("00:00");

    const jumpToPlay = (e) => {
        const video = videoRef.current;
        setPlaying(!video.paused);
        if (video.paused) {
            video.play();
            video.pause();
        }
        const percentPoint = e.nativeEvent.offsetX / barRef.current.offsetWidth;
        setPercent(percentPoint * 100);
        const time = percentPoint * video.duration;
        video.currentTime = time;
        const slide = _.findLastIndex(content, (obj) => obj.start_time < time);
        const action = "jump";
        setActivity({ slide, action, time });
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        const stringMin = minutes.toString().padStart(2, "0");
        setCurrentTime(`${minutes}:${seconds}`);
    };
    useEffect(() => {
        setTimeout(() => {
            const video = videoRef.current;
            video.method = "start";
        }, 100);
    }, []);
    const frameInfo = {
        topBg: input.sourcePath + input.template[imageSelector({ location: "top", dark })],
        bottomBg: input.sourcePath + input.template[imageSelector({ location: "bottom", dark })],
        topHeight: (input.template.top_padding / input.template.height) * 100,
        bottomHeight: (input.template.bottom_padding / input.template.height) * 100,
    };
    return (
        <Container className="node">
            <InnerContainer isFull={!withVideo} key={key}>
                {content.map((data, index) => {
                    return <Content key={index} data={data} index={index} sourcePath={input.sourcePath} frameInfo={frameInfo} isFull={!withVideo} template={input.template} />;
                })}
            </InnerContainer>
            <Video src={videoSource} videoRef={videoRef} onTimeEvent={onTimeEvent} setDuration={setDuration} ref={childRef} />
            <ControllerContainer>
                <Controller togglePlay={togglePlay} jumpToPlay={jumpToPlay} barRef={barRef} reset={reset} percent={percent} currentTime={currentTime} duration={duration} />
                <ControllerLine content={content} duration={duration} />
            </ControllerContainer>
        </Container>
    );
};
const ControllerContainer = styled.div`
    width: 100%;
    position: relative;
    background-color: black;
`;
const InnerContainer = styled.div.attrs({ className: "frame" })`
    flex: 1;
    display: flex;
    align-items: stretch;
    padding-right: 100px;
    ${(props) =>
        props.isFull &&
        css`
            padding-right: 0;
        `};
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
    align-items: stretch;
    position: relative;
    @supports (-webkit-touch-callout: none) {
        height: -webkit-fill-available;
    }
`;

export default Main;
