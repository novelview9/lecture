import styled from "styled-components";
import _, { set } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { useAtom } from "jotai";

import activityAtom, { playingAtom } from "../activityAtom";

function InnerVideo({ url, startTime, endTime, addFixedData, index }) {
    const [fixed, setFixed] = useState();
    const [onPlay, setOnPlay] = useState(false);
    const [action] = useAtom(activityAtom);
    const [playing] = useAtom(playingAtom);
    const ref = useRef(null);
    useEffect(() => {
        if (!index == action.slide) {
            setOnPlay(false);
            return;
        }
        if (!playing) {
            setOnPlay(false);
        }
        if (action.action === "jump") {
            ref.current.currentTime = action.time - startTime;
        }
        if (playing) {
            setOnPlay(true);
        }
    }, [action.action, playing, index]);
    useEffect(() => {
        if (!ref.current) {
            return;
        }
        if (onPlay) {
            ref.current.play();
        } else {
            ref.current.pause();
        }
    }, [onPlay]);
    const onClick = (e) => {
        setFixed(true);
        const { top, right, bottom, left, width, height, x, y } = e.currentTarget.firstChild.getBoundingClientRect();
        addFixedData({
            label: e.target.tagName,
            text: e.target.InnerHTML,
            src: e.target.src,
            startTime: startTime,
            style: _.pick(window.getComputedStyle(e.currentTarget.firstChild), ["font-size", "padding", "color", "background-color"]),
            top,
            right,
            bottom,
            left,
            width,
            height,
            x,
            y,
        });
    };
    return (
        <Container fixed={fixed} onClick={onClick}>
            <Video src={url} draggable="false" ref={ref} playsInline muted={true} />
        </Container>
    );
}

const Container = styled.div`
    flex: 1 1 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: inline-flex;
    visibility: ${(props) => (props.fixed ? "hidden" : "visible")};
`;
const Video = styled.video`
    max-width: 100%;
    height: auto;
    margin: 0 auto;
`;

export default React.memo(InnerVideo);
