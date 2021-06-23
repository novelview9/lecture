import _ from "lodash";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

function Video({ videoRef, src, onTimeEvent, withVideo, setDuration }, ref) {
    const [fixed, setFixed] = useState();
    const [data, setData] = useState();
    const [state, setState] = useState({});
    const [initial, setInitial] = useState({});
    const [nodeStatus, setNodeStatus] = useState({});
    useImperativeHandle(ref, () => ({
        resetHandle() {
            if (fixed) {
                setState(initial);
            }
        },
    }));
    const fixing = (e) => {
        setNodeStatus({
            time: videoRef.current.currentTime,
            isPlaying: !videoRef.current.paused,
        });
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
            setTimeout(() => fixing(), 50);
            videoRef.current.play();
            videoRef.current.pause();
        }
    }, [parentRef]);
    const loaded = (e) => {
        setDuration(e.currentTarget.duration);
    };
    useEffect(() => {
        if (fixed) {
            setTimeout(() => {
                videoRef.current.play();
                videoRef.current.pause();
            }, 50);
        }
    }, [fixed]);
    if (fixed) {
        return (
            <CustomRnd
                size={{ width: state.width, height: state.height, background: "red" }}
                position={{ x: state.x, y: state.y }}
                onDragStop={(e, d) => {
                    setState({ ...state, x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setState({
                        width: ref.style.width,
                        height: ref.style.height,
                        ...position,
                    });
                }}
            >
                <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} playsInline draggable="false" isDrag={true} />
            </CustomRnd>
        );
    }
    return (
        <Container ref={parentRef}>
            <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} playsInline onClick={fixing} onLoadedMetadata={loaded} />
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
    bottom: 40px;
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
