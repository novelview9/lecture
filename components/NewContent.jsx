import shortid from "shortid";
import toStyle from "css-to-style";
import useFitText from "use-fit-text";
import React, { useCallback, useEffect } from "react";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { useAtom } from "jotai";
import { useState } from "react";

import Image from "./Image";
import Text from "./Text";
import activityAtom from "../activityAtom";

const sourcePath = "/example_input1_source/";

const ChunkedData = React.memo(({ data, addFixedData }) => {
    return (
        <>
            {data.map((obj) => {
                if (obj.label === "text_box") {
                    return <Text content={obj.text_content} key={shortid.generate()} addFixedData={addFixedData} />;
                } else if (obj.label === "video") {
                    return (
                        <Text key={shortid.generate()} addFixedData={addFixedData}>
                            {obj.text_content}
                        </Text>
                    );
                } else {
                    return <Image url={`${sourcePath}${obj.path}`} key={shortid.generate()} addFixedData={addFixedData} />;
                }
            })}
        </>
    );
});

const checkOnlyData = (prev, next) => prev.data === next.data;

const MemoedChunkedData = React.memo(ChunkedData, checkOnlyData);

const FixedElement = ({ data }) => {
    const [state, setState] = useState({ x: data.x, y: data.y, width: data.width, height: data.height });
    const { fontSize, ref } = useFitText();
    if (data.label === "IMG") {
        return (
            <CustomRnd
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
            </CustomRnd>
        );
    }
    if (data.label === "P") {
        return (
            <CustomRnd
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
            </CustomRnd>
        );
    }
};

function Content({ data, index }) {
    const chunkedData = _.groupBy(data.learning_material, "in_column");
    const [activity] = useAtom(activityAtom);
    const isActive = activity.slide === index;
    const [state] = useState({ chunkedData, column: data.column });
    const [fixedData, setFixedData] = useState({});
    const addFixedData = useCallback((data) => {
        const newKey = shortid.generate();
        setFixedData((prevState) => {
            return { ...prevState, [newKey]: { ...data } };
        });
    });

    return (
        <Container isActive={isActive}>
            {_.times(state.column, (i) => {
                return (
                    <Column key={i}>
                        <MemoedChunkedData data={state.chunkedData[i + 1]} key={i} addFixedData={addFixedData} />
                    </Column>
                );
            })}
            {Object.entries(fixedData).map((value) => (
                <FixedElement data={value[1]} key={value[0]} />
            ))}
        </Container>
    );
}

const PCon = styled.div`
    width: 100%;
    height: 100%;
`;
const CustomRnd = styled(Rnd)`
    box-sizing: border-box;
    :hover {
        border: 2px solid yellow;
        background-color: green;
    }
`;
const RndP = styled.p``;
const RndImg = styled.img`
    object-fit: contain;
    width: inherit;
    height: inherit;
`;
const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const Container = styled.div`
    > div {
        padding: 20px;
    }
    flex: 1;
    display: flex;
    overflow: auto;
    flex-wrap: wrap;
    height: 100%;
    position: relative;
    display: ${(props) => (props.isActive ? "default" : "none")};
`;

export default React.memo(Content);
