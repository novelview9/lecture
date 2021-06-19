import styled, { css } from "styled-components";

function Video({ videoRef, src, onTimeEvent, withVideo }) {
    return (
        <Container>
            <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} playsInline />
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    right: 0;
    bottom: 10px;
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
`;

export default Video;
