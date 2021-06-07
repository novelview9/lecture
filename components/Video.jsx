import styled, { css } from "styled-components";

function Video({ videoRef, src, onTimeEvent, withVideo }) {
    return (
        <Container>
            <VideoEl src={src} onTimeUpdate={onTimeEvent} ref={videoRef} active={withVideo} />
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    max-height: 100%;
    width: 100%;
`;

const VideoEl = styled.video`
    margin-left: auto;
    display: block;
    opacity: 0;
    width: 40%;
    height: inherit;
    max-width: 500px;
    ${(props) =>
        props.active &&
        css`
            opacity: 1;
        `}
`;

export default Video;
