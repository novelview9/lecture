import _ from "lodash";
import toStyle from "css-to-style";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { useState } from "react";

function Text({ content }) {
    const [isDrag, setIsDrag] = useState(false);
    const [state, setState] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [nodeStyle, setNodeStyle] = useState({});
    const onDrag = (e) => {
        setIsDrag(true);
        const { x, y, width, height } = e.target.getBoundingClientRect();
        setState({ x, y, width, height });
        const { background, color, font } = window.getComputedStyle(e.target);
        setNodeStyle({
            font,
            background,
            color,
        });
    };
    if (!isDrag) {
        return (
            <Container>
                <TextEl onClick={onDrag}>{content}</TextEl>
            </Container>
        );
    }
    return (
        <Rnd
            style={{ ...nodeStyle }}
            size={{ width: state.width, height: state.height }}
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
            <RndP>{content}</RndP>
        </Rnd>
    );
}

const RndP = styled.p``;
const Container = styled.div`
    width: 100%;
    cursor: pointer;
    min-height: 20px; ;
`;
const TextEl = styled.p`
    font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
    max-width: 100%;
    z-index: 200;
    @media only screen and (max-width: 900px) {
        font-size: 15px;
    }
`;

export default Text;
