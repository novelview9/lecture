import _ from "lodash";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useAtom } from "jotai";

import { withVideoAtom } from "../activityAtom";

function Video({ videoRef, src, onTimeEvent, setDuration }, ref) {
    const [fixed, setFixed] = useState();
    const [data, setData] = useState();
    const [state, setState] = useState({});
    const [initial, setInitial] = useState({});
    const [nodeStatus, setNodeStatus] = useState({});
    const [withVideo] = useAtom(withVideoAtom);
    useImperativeHandle(ref, () => ({
        resetHandle() {
            setState(initial);
        },
    }));
    const fixing = (e) => {
        const { top, right, bottom, left, width, height, x, y } = parentRef.current.getBoundingClientRect();
        setInitial({
            src: src,
            style: _.pick(window.getComputedStyle(videoRef.current), ["font-size", "padding", "color", "background-color"]),
            top,
            right,
            bottom,
            left,
            width,
            height,
            x,
            y,
        });
        setState({
            src: src,
            style: _.pick(window.getComputedStyle(videoRef.current), ["font-size", "padding", "color", "background-color"]),
            top,
            right,
            bottom,
            left,
            width,
            height,
            x,
            y,
        });
        setFixed(true);
    };
    const parentRef = useRef();
    useEffect(() => {
        if (parentRef.current) {
            if (fixed) {
                videoRef.current.play();
                setTimeout(() => {
                    videoRef.current.pause();
                }, 100);
            }
            setTimeout(() => {
                fixing();
            }, 100);
        }
    }, [parentRef]);
    const loaded = (e) => {
        setDuration(e.currentTarget.duration);
    };
    useEffect(() => {
        if (fixed) {
            videoRef.current.play();
            setTimeout(() => {
                videoRef.current.pause();
            }, 100);
        }
    }, [fixed]);
    if (fixed) {
        return (
            <CustomRnd
                size={{ width: state.width, height: state.height, background: "red" }}
                position={{ x: state.x, y: state.y }}
                bounds={".frame"}
                onDragStop={(e, d) => {
                    setState((prevState) => {
                        return { ...prevState, x: d.x, y: d.y };
                    });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setState({
                        width: ref.style.width,
                        height: ref.style.height,
                        ...position,
                    });
                }}
            >
                <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} playsInline draggable="false" isDrag={true} onLoadedMetadata={loaded} />
            </CustomRnd>
        );
    }
    return (
        <Container ref={parentRef}>
            <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} playsInline onClick={fixing} />
        </Container>
    );
}

const CustomRnd = styled(Rnd)`
    box-sizing: border-box;
    /* ${(props) =>
        props.isActive &&
        css`
            outline: 3px solid yellow;
        `}; */
`;

const Container = styled.div`
    position: absolute;
    right: 0;
    bottom: 55px;
    max-height: 100%;
    width: 20%;
`;

const VideoEl = styled.video`
    margin-left: auto;
    display: block;
    opacity: 0;
    height: inherit;
    max-width: 100%;
    ${(props) =>
        props.active &&
        css`
            opacity: 1;
        `}

    ${(props) =>
        props.isDrag &&
        css`
            height: 100%;
            width: 100%;
            object-fit: fill;
        `}
`;
export default forwardRef(Video);
