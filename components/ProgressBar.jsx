import styled from "styled-components";

function Control({ percent, jumpToPlay, barRef }) {
    return (
        <ProgressBarLine onClick={jumpToPlay} ref={barRef}>
            <ProgressBarFilled percent={percent} />
        </ProgressBarLine>
    );
}

const ProgressBarLine = styled.div`
    display: flex;
    width: 100%;
    height: 20px;
    display: flex;
    background-color: #c9d5ff;
    cursor: pointer;
`;
const ProgressBarFilled = styled.div`
    color: white;
    flex-basis: ${(props) => props.percent}%;
    background-color: #4568e2;
    z-index: 150;
`;

export default Control;
