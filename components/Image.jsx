import _ from "lodash";
import styled from "styled-components";
import toStyle from "css-to-style";
import { Rnd } from "react-rnd";
import { useState } from "react";

function Image({ url, style, xy }) {
    const styleData = toStyle(style);
    const filteredStyle = _.omit(styleData, ["width", "max-width", "height"]);
    const width = _.get(styleData, "width");
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
                <Img src={url} style={{ ...filteredStyle }} left={xy[0]} top={xy[1]} maxWidth={width} />;
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
            <RndImg src={url} />
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
`;
const Img = styled.img`
    width: inherit;
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
    object-fit: contain;
    @media only screen and (max-width: 900px) {
        max-width: 50%;
    }
`;

export default Image;
