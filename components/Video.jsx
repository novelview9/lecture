import _ from "lodash";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useAtom } from "jotai";

import { activityAtom, currentAtom, currentTimeAtom, durationAtom, durationTimeAtom, jumpAtom, percentAtom, playingAtom, withVideoAtom } from "../atom";

function Video({ src, content, videoLocation }, ref) {
    const [fixed, setFixed] = useState();
    const [positionState, setPositionState] = useState({});
    const [initialPosition, setInitialPosition] = useState({});
    const [withVideo] = useAtom(withVideoAtom);
    const [activity, setActivity] = useAtom(activityAtom);
    const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
    const [durationTime, setDurationTime] = useAtom(durationTimeAtom);
    const [duration, setDuration] = useAtom(durationAtom);
    const [percent, setPercent] = useAtom(percentAtom);
    const [current, setCurrent] = useAtom(currentAtom);
    const [jump] = useAtom(jumpAtom);
    const [nodeVideoLocation, setNodeVideoLocation] = useState();

    const [play, setPlay] = useAtom(playingAtom);
    const videoRef = useRef();
    useImperativeHandle(
        ref,
        () => ({
            toggle: () => {
                if (play) {
                    videoRef.current.pause();
                    setPlay(false);
                } else {
                    videoRef.current.play();
                    setPlay(true);
                }
            },
            jump: (percentPoint) => {
                const time = percentPoint * duration;
                videoRef.current.currentTime = time;
                const slide = _.findLastIndex(content, (obj) => obj.start_time < time);
                const action = "jump";
                setActivity({ slide, action, time });
            },
        }),
        [videoRef.current, play]
    );

    const onTimeEvent = () => {
        const video = videoRef.current;
        const time = video.currentTime;
        const slide = _.findLastIndex(content, (obj) => obj.start_time < time);
        const vl = _.findLast(videoLocation, (obj) => obj.start_time < time);
        if (vl.box_info) {
            setNodeVideoLocation(true);
        } else {
            setNodeVideoLocation(false);
        }
        const action = activity.slide === slide ? "playing" : "flip";
        setActivity({ slide, action, time });
        const percentPoint = time / video.duration;
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        setCurrentTime(`${minutes}:${seconds}`);
        setPercent(percentPoint * 100);
    };

    const fixing = (e) => {
        const { top, right, bottom, left, width, height, x, y } = videoRef.current.getBoundingClientRect();
        setInitialPosition({
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
        setPositionState({
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
    const loaded = (e) => {
        if (fixed) {
            videoRef.current.currentTime = activity.time;
        }
        const targetDue = e.currentTarget.duration;
        setDuration(targetDue);
        const minutes = Math.floor(targetDue / 60);
        const seconds = Math.floor(targetDue - 60 * minutes)
            .toString()
            .padStart(2, "0");
        setDurationTime(`${minutes}:${seconds}`);
    };
    useEffect(() => {
        if (videoRef.current && fixed) {
            videoRef.current.currentTime = activity.time;
            videoRef.current.pause();
            setPlay(false);
        }
    }, [videoRef, fixed]);

    // if (fixed) {
    //     return (
    //         <CustomRnd
    //             size={{ width: positionState.width, height: positionState.height, background: "red" }}
    //             position={{ x: positionState.x, y: positionState.y }}
    //             bounds={".frame"}
    //             onDragStop={(e, d) => {
    //                 setPositionState((prevState) => {
    //                     return { ...prevState, x: d.x, y: d.y };
    //                 });
    //             }}
    //             onResizeStop={(e, direction, ref, delta, position) => {
    //                 setPositionState({
    //                     width: ref.style.width,
    //                     height: ref.style.height,
    //                     ...position,
    //                 });
    //             }}
    //         >
    //             <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} playsInline draggable="false" isDrag={true} onLoadedMetadata={loaded} autoplay />
    //         </CustomRnd>
    //     );
    // }
    return (
        <Container visiable={nodeVideoLocation}>
            <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} playsInline onLoadedMetadata={loaded} autoplay />
        </Container>
    );
}

const CustomRnd = styled(Rnd)`
    box-sizing: border-box;
    z-index: 100;
`;

const Container = styled.div`
    position: absolute;
    z-index: 100;
    right: 0;
    bottom: 0;
    max-height: 100%;
    width: 20%;
    visibility: ${(props) => (props.visiable ? "visiable" : "hidden")};
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
