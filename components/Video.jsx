import _ from "lodash";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useAtom } from "jotai";

import { activityAtom, currentAtom, currentTimeAtom, durationAtom, durationTimeAtom, lockAtom, percentAtom, playingAtom, withVideoAtom } from "../atom";

function Video({ src, content, videoLocation }, ref) {
    const [positionState, setPositionState] = useState({
        width: "auto",
        height: "auto",
        x: 100,
        y: 100,
    });
    const [withVideo] = useAtom(withVideoAtom);
    const [activity, setActivity] = useAtom(activityAtom);
    const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
    const [durationTime, setDurationTime] = useAtom(durationTimeAtom);
    const [duration, setDuration] = useAtom(durationAtom);
    const [percent, setPercent] = useAtom(percentAtom);
    const [current, setCurrent] = useAtom(currentAtom);
    const [nodeVideoLocation, setNodeVideoLocation] = useState();
    const [lock] = useAtom(lockAtom);

    const [play, setPlay] = useAtom(playingAtom);
    const videoRef = useRef();
    useImperativeHandle(
        ref,
        () => ({
            move: () => {
                videoRef.current.play();
                setTimeout(() => {
                    if (!play) {
                        videoRef.current.pause();
                        setPlay(false);
                    }
                }, 100);
            },
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
                setPercent(percentPoint);
                videoRef.current.currentTime = time;
                videoRef.current.play();
                setTimeout(() => {
                    if (!play) {
                        videoRef.current.pause();
                        setPlay(false);
                    }
                }, 100);
                const slide = _.findLastIndex(content, (obj) => obj.start_time < time);
                const action = "jump";
                setActivity({ slide, action, time, play });
            },
        }),
        [videoRef.current, play, duration]
    );

    const onTimeEvent = () => {
        const video = videoRef.current;
        const time = video.currentTime;
        const slide = _.findLastIndex(content, (obj) => obj.start_time < time);
        const vl = _.findLast(videoLocation, (obj) => obj.start_time < time);
        if (vl && vl.box_info) {
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

    const loaded = (e) => {
        const targetDue = e.currentTarget.duration;
        setDuration(targetDue);
        const { videoWidth, videoHeight } = e.currentTarget;
        const targetWidth = window.innerWidth * 0.2;
        const targetHeight = (targetWidth / videoWidth) * videoHeight;
        setPositionState((prev) => ({ width: `${targetWidth}px`, height: `${targetHeight}px`, x: window.innerWidth - targetWidth, y: window.innerHeight - targetHeight - 100 }));
        const minutes = Math.floor(targetDue / 60);
        const seconds = Math.floor(targetDue - 60 * minutes)
            .toString()
            .padStart(2, "0");
        setDurationTime(`${minutes}:${seconds}`);
    };
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = activity.time;
            videoRef.current.pause();
            setPlay(false);
        }
    }, [videoRef]);

    return (
        <CustomRnd
            visiable={nodeVideoLocation}
            size={{ width: positionState.width, height: positionState.height, background: "red" }}
            position={{ x: positionState.x, y: positionState.y }}
            bounds={".frame"}
            enableResizing={!lock}
            disableDragging={lock}
            onDragStop={(e, d) => {
                setPositionState({ ...positionState, x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setPositionState({
                    width: ref.style.width,
                    height: ref.style.height,
                    ...position,
                });
            }}
        >
            <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} playsInline isDrag={true} onLoadedMetadata={loaded} />
        </CustomRnd>
    );
}

const CustomRnd = styled(Rnd)`
    box-sizing: border-box;
    z-index: 100;
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
