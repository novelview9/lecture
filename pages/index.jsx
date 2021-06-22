import _ from "lodash";
import React from "react";
import shortid from "shortid";
import styled, { css } from "styled-components";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

import Controller from "../components/Controller";
import NewContent from "../components/NewContent";
import Video from "../components/Video";
import activityAtom from "../activityAtom";
import input from "../example_input.json";

const ControllerLine = ({ content, duration }) => {
    const startTimes = _.map(content, "end_time");
    if (!duration) {
        return <p></p>;
    }

    return (
        <Line>
            {startTimes.map((time) => {
                return <LinePoint value={(time / duration) * 100} key={() => shortid.generate()} />;
            })}
        </Line>
    );
};
const LinePoint = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => props.value}%;
    height: 20px;
    border-right: 2px solid #45b945;
`;
const Line = styled.div`
    pointer-events: none;
    display: flex;
    width: 100%;
    height: 20px;
    position: absolute;
    z-index: 200;
    overflow: hidden;
    top: 0;
`;

const Main = () => {
    const content = input.content;

    const [percent, setPercent] = useState(0);
    const [currentTime, setCurrentTime] = useState("00:00");
    const [key, setKey] = useState(shortid.generate());
    const resetKey = () => {
        setKey(shortid.generate());
    };
    const [activity, setActivity] = useAtom(activityAtom);
    const videoRef = useRef(null);

    const [withFrame, setWithFrame] = useState(false);

    const [withVideo, setWithVideo] = useState(true);

    const togglePlay = () => {
        const video = videoRef.current;
        const method = video.paused ? "play" : "pause";
        video[method]();
    };

    const toggleFrame = () => {
        setWithFrame(!withFrame);
    };

    const sourcePath = "/example_input1_source/";
    const videoSource = sourcePath + input.video.source;

    const toggleVideo = () => {
        setWithVideo(!withVideo);
    };

    const onTimeEvent = () => {
        const video = videoRef.current;
        const time = video.currentTime;
        const slide = _.findLastIndex(input.content, (obj) => obj.start_time < time);
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

    const jumpToPlay = (e) => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            video.pause();
        }
        const percentPoint = e.nativeEvent.offsetX / barRef.current.offsetWidth;
        setPercent(percentPoint * 100);
        const time = percentPoint * video.duration;
        video.currentTime = time;
        const slide = _.findLastIndex(input.content, (obj) => obj.start_time < time);
        const action = "jump";
        setActivity({ slide, action, time });
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        const stringMin = minutes.toString().padStart(2, "0");
        setCurrentTime(`${minutes}:${seconds}`);
    };
    // useEffect(() => {
    //     setTimeout(function () {
    //         const video = videoRef.current;
    //         video.paused = "start";
    //     }, 100);
    // }, []);

    const [duration, setDuration] = useState("");
    return (
        <Container className="node">
            <InnerContainer isFull={!withVideo} withFrame={withFrame} key={key}>
                {content.map((data, index) => {
                    return <NewContent key={index} data={data} index={index} withFrame={withFrame} />;
                })}
            </InnerContainer>
            <Video src={videoSource} videoRef={videoRef} onTimeEvent={onTimeEvent} withVideo={withVideo} setDuration={setDuration} />
            <ControllerContainer>
                <Controller
                    togglePlay={togglePlay}
                    toggleVideo={toggleVideo}
                    jumpToPlay={jumpToPlay}
                    barRef={barRef}
                    reset={resetKey}
                    toggleFrame={toggleFrame}
                    percent={percent}
                    currentTime={currentTime}
                />
                <ControllerLine content={content} duration={duration} />
            </ControllerContainer>
        </Container>
    );
};
const ControllerContainer = styled.div`
    width: 100%;
    position: relative;
`;
const InnerContainer = styled.div`
    flex: 1;
    box-sizing: border-box;
    width: 80%;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    ${(props) =>
        props.withFrame &&
        css`
            padding-top: 4%;
            padding-bottom: 3%;
            background-image: url("/bg_video5_5_1_shot11.jpg");
            background-size: 100% 100%;
            background-repeat: no-repeat;
        `};
    ${(props) =>
        props.isFull &&
        css`
            width: 100%;
        `};
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    position: relative;
    @supports (-webkit-touch-callout: none) {
        height: -webkit-fill-available;
    }
`;

export default Main;
