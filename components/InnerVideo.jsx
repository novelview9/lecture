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
        if (action.time > startTime && playing) {
            setOnPlay(true);
        }
    }, [action.time]);
    useEffect(() => {
        if (fixed) {
            return;
        }
        if (action.time < startTime) {
            setOnPlay(false);
            ref.current.currentTime = 0;
            return;
        }
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

        if (action.action === "flip") {
            ref.current.currentTime = action.time - startTime;
        }
        if (playing) {
            setOnPlay(true);
            return;
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
        const { top, right, bottom, left, width, height, x, y } = e.currentTarget.getBoundingClientRect();
        addFixedData({
            label: "VIDEO",
            src: url,
            startTime: startTime,
            style: _.pick(window.getComputedStyle(e.currentTarget), ["font-size", "padding", "color", "background-color"]),
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
        <Container fixed={fixed}>
            <Video src={url} draggable="false" ref={ref} playsInline muted={true} playsInline onClick={onClick} />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-basis: 0;
    overflow: hidden;
    visibility: ${(props) => (props.fixed ? "hidden" : "visible")};
`;
const Video = styled.video`
    margin: 0 auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: fill;
`;

export default React.memo(InnerVideo);
