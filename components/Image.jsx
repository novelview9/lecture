import _ from "lodash";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import { useState } from "react";

function Image({ url }) {
    const [state, setState] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isDrag, setIsDrag] = useState(false);
    const onDrag = (e) => {
        setIsDrag(true);
        const { x, y, width, height } = e.target.getBoundingClientRect();
        setState({ x, y, width, height });
    };
    if (!isDrag) {
        return (
            <Container onClick={onDrag}>
                <Img src={url} draggable="false" />;
            </Container>
        );
    }
    return (
        <Rnd
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
            <RndImg src={url} draggable="false" />
        </Rnd>
    );
}

const RndImg = styled.img`
    object-fit: contain;
    width: inherit;
    height: inherit;
`;

const Container = styled.div`
    width: 100%;
    max-height: 200px;
`;
const Img = styled.img`
    width: inherit;
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
    object-fit: contain;
    height: inherit;
    max-height: inherit;
    @media only screen and (max-width: 900px) {
        max-width: 50%;
    }
`;

export default Image;
