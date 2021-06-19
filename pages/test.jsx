import shortid from "shortid";
import styled, { css } from "styled-components";
import { useAtom } from "jotai";
import { useRef, useState } from "react";

import Controller from "../components/Controller";
import NewContent from "../components/NewContent";
import Video from "../components/Video";
import activityAtom from "../activityAtom";
import input from "../example_input.json";

const Main = () => {
    const content = input.content;
    const [key, setKey] = useState(shortid.generate());
    const resetKey = () => {
        setKey(shortid.generate());
    };
    const [activity, setActivity] = useAtom(activityAtom);
    const videoRef = useRef(null);

    const [withVideo, setWithVideo] = useState(true);

    const togglePlay = () => {
        const video = videoRef.current;
        const method = video.paused ? "play" : "pause";
        video[method]();
    };

    const sourcePath = "/example_input1_source/";
    const videoSource = sourcePath + input.video.source;

    const toggleVideo = () => {
        setWithVideo(!withVideo);
    };

    const onTimeEvent = () => {
        const time = videoRef.current.currentTime;
        const slide = _.findLastIndex(input.content, (obj) => obj.start_time < time);
        const action = activity.slide === slide ? "playing" : "flip";
        setActivity({ slide, action, time });
    };

    const barRef = useRef(null);

    const jumpToPlay = (e) => {
        const video = videoRef.current;
        const percentPoint = e.nativeEvent.offsetX / barRef.current.offsetWidth;
        const time = percentPoint * video.duration;
        video.currentTime = time;
        const slide = _.findLastIndex(input.content, (obj) => obj.start_time < time);
        const action = "jump";
        setActivity({ slide, action, time });
    };
    return (
        <Container key={key}>
            <InnerContainer isFull={!withVideo}>
                {content.map((data, index) => {
                    return <NewContent key={index} data={data} index={index} />;
                })}
            </InnerContainer>

            <Controller togglePlay={togglePlay} toggleVideo={toggleVideo} jumpToPlay={jumpToPlay} barRef={barRef} reset={resetKey} />
            <Video src={videoSource} videoRef={videoRef} onTimeEvent={onTimeEvent} withVideo={withVideo} />
        </Container>
    );
};
const InnerContainer = styled.div`
    height: 500px;
    width: 80%;
    ${(props) =>
        props.isFull &&
        css`
            width: 100%;
        `};
`;
const Container = styled.div`
    width: 100%;
    height: 500px;
    background-color: red;
    padding: 10px;
    position: relative;
`;

export default Main;
