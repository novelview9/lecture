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
    bottom: 0;
    max-height: 100%;
`;

const VideoEl = styled.video`
    margin-left: auto;
    display: block;
    opacity: 0;
    height: inherit;
    max-width: 300px;
    ${(props) =>
        props.active &&
        css`
            opacity: 1;
        `}
`;

export default Video;
