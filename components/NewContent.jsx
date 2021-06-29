import shortid from "shortid";
import toStyle from "css-to-style";
import useFitText from "use-fit-text";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { useAtom } from "jotai";
import { useState } from "react";

import Image from "./Image";
import InnerVideo from "./InnerVideo";
import RndVideo from "./RndVideo";
import Text from "./Text";
import activityAtom from "../activityAtom";

const ChunkedData = React.memo(({ data, addFixedData, index, sourcePath }) => {
    const sortedData = _.orderBy(data, "order");
    return (
        <InnerColumn>
            {sortedData.map((obj) => {
                if (obj.label === "text_box") {
                    return <Text obj={obj} addFixedData={addFixedData} key={shortid.generate()} />;
                } else if (obj.label === "video") {
                    return (
                        <InnerVideo
                            url={`${sourcePath}${obj.path}`}
                            addFixedData={addFixedData}
                            startTime={obj.start_time}
                            endTime={obj.end_time}
                            index={index}
                            key={shortid.generate()}
                            index={index}
                        />
                    );
                } else {
                    return <Image url={`${sourcePath}${obj.path}`} addFixedData={addFixedData} key={shortid.generate()} />;
                }
            })}
        </InnerColumn>
    );
});

const checkOnlyData = (prev, next) => prev.data === next.data;

const MemoedChunkedData = React.memo(ChunkedData, checkOnlyData);

const FixedElement = ({ data, clicked, keyValue, isActive }) => {
    const [state, setState] = useState({ x: data.x, y: data.y, width: data.width, height: data.height });
    const { fontSize, ref } = useFitText({ maxFontSize: 1000, resolution: 1 });
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
                bounds={"window"}
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
    if (data.label === "VIDEO") {
        return (
            <CustomRnd
                onDragStart={run}
                onResizeStart={run}
                bounds={"window"}
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
                <RndVideo url={data.src} startTime={data.startTime} />
                {isActive && <Clear onClick={clear}>confirm</Clear>}
            </CustomRnd>
        );
    }
    if (data.label === "P") {
        return (
            <CustomRnd
                onDragStart={run}
                onResizeStart={run}
                bounds={"window"}
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

function Content({ data, index, withFrame, sourcePath, frameInfo }) {
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

    const titleObj = _.find(data.learning_material, (o) => o.label === "title");
    const [nodeEl, setNodeEl] = useState();
    const clicked = (key) => {
        setNodeEl(key);
    };

    return (
        <Container isActive={isActive}>
            <Inner>
                <Frame src={frameInfo.topBg} withFrame={withFrame} height={frameInfo.topHeight} isActive={withFrame} />
                {titleObj && (
                    <TitleContainer>
                        <TitleImg src={`${sourcePath}${titleObj.path}`} />
                    </TitleContainer>
                )}
                <ColumnContainer>
                    {_.times(state.column, (i) => {
                        return <MemoedChunkedData data={state.chunkedData[i + 1]} key={i} addFixedData={addFixedData} index={index} sourcePath={sourcePath} />;
                    })}
                </ColumnContainer>
                <Frame src={frameInfo.bottomBg} withFrame={withFrame} height={frameInfo.bottomHeight} isActive={withFrame} />
            </Inner>
            {Object.entries(fixedData).map((value) => (
                <FixedElement data={value[1]} key={value[0]} clicked={clicked} isActive={nodeEl === value[0]} keyValue={value[0]} />
            ))}
        </Container>
    );
}
const Frame = styled.img`
    flex-basis: ${(props) => props.height}%;
    object-fit: fill;
    display: ${(props) => (props.isActive ? "block" : "none")};
`;

const Inner = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: stretch;
`;
const ColumnContainer = styled.div`
    flex: 1;
    display: flex;
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
            z-index: 10;
            outline: 3px solid yellow;
        `};
`;
const RndImg = styled.img`
    width: inherit;
    height: inherit;
`;
const InnerColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    display: ${(props) => (props.isActive ? "flex" : "none")};
    flex: 1;
    align-items: stretch;
`;

export default React.memo(Content);
