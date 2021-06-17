import _ from "lodash";
import styled, { css } from "styled-components";
import { useEffect, useRef, useState } from "react";

import Content from "../components/Content";
import Controller from "../components/Controller";
import Video from "../components/Video";
import data from "../example_input.json";

function Home() {
    const [withFrame, setWithFrame] = useState(false);
    const videoRef = useRef(null);
    const [percent, setPercent] = useState(0);
    const [nodeData, setNodeData] = useState([]);
    const [withVideo, setWithVideo] = useState(true);
    const toggleFrame = () => {
        setWithFrame(!withFrame);
    };
    const toggleVideo = () => {
        setWithVideo(!withVideo);
    };
    const togglePlay = () => {
        const video = videoRef.current;
        const method = video.paused ? "play" : "pause";
        video[method]();
    };
    const onResetData = (currentTime) => {
        const video = videoRef.current;
        const nodeIndex = _.findLastIndex(data.content, (obj) => obj.start_time < currentTime);
        const percentPoint = (currentTime / video.duration) * 100;
        setPercent(percentPoint);
        if (_.isUndefined(nodeIndex)) {
            return;
        }
        setNodeData(data.content[nodeIndex]);
    };

    const onTimeEvent = () => {
        onResetData(videoRef.current.currentTime);
    };
    const barRef = useRef(null);
    const jumpToPlay = (e) => {
        const video = videoRef.current;
        const percentPoint = e.nativeEvent.offsetX / barRef.current.offsetWidth;
        const currentTime = percentPoint * video.duration;
        video.currentTime = currentTime;
        onResetData(currentTime);
    };
    const sourcePath = "/example_input1_source/";
    const videoSource = sourcePath + data.video.source;
    return (
        <Container>
            <Wrapper bg={withFrame}>
                <Content data={nodeData} withVideo={withVideo} />
                <Video src={videoSource} videoRef={videoRef} onTimeEvent={onTimeEvent} withVideo={withVideo} />
            </Wrapper>
            <Controller toggleFrame={toggleFrame} togglePlay={togglePlay} toggleVideo={toggleVideo} jumpToPlay={jumpToPlay} percent={percent} barRef={barRef} />
        </Container>
    );
}
const Container = styled.div`
    width: 100vw;
    height: 100vh;
    max-height: 46vw;
    display: flex;
    flex-direction: column;
    /* height: 768px;
    max-height: 100vh;
    position: relative;
    border: 1px solid black;
    min-width: 500px;
    box-sizing: border-box;
    padding-bottom: 40px; */
`;

const Wrapper = styled.div`
    width: 100vw;
    box-sizing: border-box;
    flex: 1;
    position: relative;
    ${(props) =>
        props.bg &&
        css`
            padding-top: 5%;
            padding-bottom: 3%;
            padding-left: 2%;
            padding-right: 2%;
            background-image: url("/bg_video5_5_1_shot11.jpg");
            background-size: contain;
            background-repeat: no-repeat;
        `};
`;

export default Home;
