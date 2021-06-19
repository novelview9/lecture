import shortid from "shortid";
import toStyle from "css-to-style";
import useFitText from "use-fit-text";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { useAtom } from "jotai";
import { useState } from "react";

import Image from "./Image";
import Text from "./Text";
import activityAtom from "../activityAtom";

const sourcePath = "/example_input1_source/";

const ChunkedData = React.memo(({ data, addFixedData }) => {
    const [goal, setGoal] = useState(200);
    return (
        <Column>
            {data.map((obj) => {
                if (obj.label === "text_box") {
                    return <Text content={obj.text_content} key={shortid.generate()} addFixedData={addFixedData} goal={goal} />;
                } else if (obj.label === "video") {
                    return (
                        <Text key={shortid.generate()} addFixedData={addFixedData} goal={goal}>
                            {obj.text_content}
                        </Text>
                    );
                } else {
                    return <Image url={`${sourcePath}${obj.path}`} key={shortid.generate()} addFixedData={addFixedData} />;
                }
            })}
        </Column>
    );
});

const checkOnlyData = (prev, next) => prev.data === next.data;

const MemoedChunkedData = React.memo(ChunkedData, checkOnlyData);

const FixedElement = ({ data, clicked, keyValue, isActive }) => {
    const [state, setState] = useState({ x: data.x, y: data.y, width: data.width, height: data.height });
    const { fontSize, ref } = useFitText();
    const run = () => {
        clicked(keyValue);
    };
    const clear = () => {
        clicked("");
    };
    if (data.label === "IMG") {
        return (
            <CustomRnd
                onDragStart={run}
                onResizeStart={run}
                isActive={isActive}
                size={{ width: state.width, height: state.height, background: "red" }}
                position={{ x: state.x, y: state.y }}
                onDragStop={(e, d) => {
                    setState({ ...state, x: d.x, y: d.y });
                }}
                style={data.style}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setState({
                        width: ref.style.width,
                        height: ref.style.height,
                        ...position,
                    });
                }}
            >
                <RndImg src={data.src} draggable="false" />
                {isActive && <Clear onClick={clear}>confirm</Clear>}
            </CustomRnd>
        );
    }
    if (data.label === "P") {
        return (
            <CustomRnd
                onDragStart={run}
                onResizeStart={run}
                isActive={isActive}
                size={{ width: state.width, height: state.height, background: "red" }}
                position={{ x: state.x, y: state.y }}
                onDragStop={(e, d) => {
                    setState({ ...state, x: d.x, y: d.y });
                }}
                style={data.style}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setState({
                        width: ref.style.width,
                        height: ref.style.height,
                        ...position,
                    });
                }}
            >
                <PCon ref={ref} style={{ fontSize }}>
                    {data.text}
                </PCon>
                {isActive && <Clear onClick={clear}>confirm</Clear>}
            </CustomRnd>
        );
    }
};
const Clear = styled.button`
    position: absolute;
    right: 0;
    top: -20px;
    @media only screen and (max-width: 900px) {
        display: none;
    }
`;

function Content({ data, index }) {
    const chunkedData = _.groupBy(data.learning_material, "in_column");
    const [activity] = useAtom(activityAtom);
    const isActive = activity.slide === index;
    const [state] = useState({ chunkedData, column: data.column });
    const [fixedData, setFixedData] = useState({});
    const addFixedData = useCallback((data) => {
        const newKey = shortid.generate();
        setFixedData((prevState) => {
            setNodeEl(newKey);
            return { ...prevState, [newKey]: { ...data } };
        });
    });
    const ref1 = useRef();
    const ref2 = useRef();

    const titleObj = _.find(data.learning_material, (o) => o.label === "title");
    const sourcePath = "/example_input1_source/";
    const [nodeEl, setNodeEl] = useState();
    const clicked = (key) => {
        setNodeEl(key);
    };

    return (
        <Container isActive={isActive}>
            {titleObj && (
                <TitleContainer>
                    <TitleImg src={`${sourcePath}${titleObj.path}`} />
                </TitleContainer>
            )}
            <ColumnContainer>
                {_.times(state.column, (i) => {
                    return <MemoedChunkedData data={state.chunkedData[i + 1]} key={i} addFixedData={addFixedData} />;
                })}
            </ColumnContainer>
            {Object.entries(fixedData).map((value) => (
                <FixedElement data={value[1]} key={value[0]} clicked={clicked} isActive={nodeEl === value[0]} keyValue={value[0]} />
            ))}
        </Container>
    );
}

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
`;
const TitleImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: left top;
`;
const TitleContainer = styled.div`
    height: 10%;
    width: 100%;
    padding: 0 20px 0 !important;
    @media only screen and (max-width: 900px) {
        height: 20px;
    }
`;
const PCon = styled.div`
    width: 100%;
    height: 100%;
`;
const CustomRnd = styled(Rnd)`
    box-sizing: border-box;
    ${(props) =>
        props.isActive &&
        css`
            outline: 3px solid yellow;
        `};
`;
const RndImg = styled.img`
    object-fit: contain;
    width: inherit;
    height: inherit;
`;
const Column = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: stretch;
`;

const Container = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.isActive ? "flex" : "none")};
    flex-direction: column;
    position: relative;
    align-items: stretch;
    width: 100%;
    padding-bottom: 2vh;
`;

export default React.memo(Content);
