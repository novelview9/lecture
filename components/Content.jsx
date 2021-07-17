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
import activityAtom, { withFrameAtom } from "../activityAtom";
import { lockAtom } from "../activityAtom";

const ChunkedData = React.memo(({ data, addFixedData, index, sourcePath, isFull }) => {
    const sortedData = _.orderBy(data, "order");
    return (
        <InnerColumn>
            {sortedData.map((obj) => {
                if (obj.label === "text_box") {
                    return <Text obj={obj} addFixedData={addFixedData} key={shortid.generate()} isFull={isFull} />;
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
const PositionedData = React.memo(({ data, addFixedData, index, sourcePath, isFull, template }) => {
    console.log(data.box_info_original);
    const [x, y, width, height] = data.box_info_original;
    const startXRatio = (x / template.width) * 100;
    const startYRatio = (y / template.height) * 100;
    const widthRatio = (width / template.width) * 100;
    const heightRatio = (height / template.height) * 100;
    if (data.label === "text_box") {
        return (
            <PositionedDataContainer x={startXRatio} y={startYRatio} width={widthRatio} height={heightRatio}>
                <Text obj={data} addFixedData={addFixedData} key={shortid.generate()} isFull={isFull} />
            </PositionedDataContainer>
        );
    }
    if (data.label === "video") {
        return (
            <PositionedDataContainer x={startXRatio} y={startYRatio} width={widthRatio} height={heightRatio}>
                <InnerVideo url={`${sourcePath}${obj.path}`} addFixedData={addFixedData} startTime={obj.start_time} endTime={obj.end_time} index={index} key={shortid.generate()} index={index} />
            </PositionedDataContainer>
        );
    }
    return (
        <PositionedDataContainer x={startXRatio} y={startYRatio} width={widthRatio} height={heightRatio}>
            <Image url={`${sourcePath}${data.path}`} addFixedData={addFixedData} key={shortid.generate()} />
        </PositionedDataContainer>
    );
});
const PositionedDataContainer = styled.div`
    width: ${(props) => props.width}%;
    height: ${(props) => props.height}%;
    top: ${(props) => props.y}%;
    left: ${(props) => props.x}%;
    position: absolute;
    display: flex;
`;

const checkOnlyData = (prev, next) => {
    return prev.data === next.data && prev.isFull === next.isFull;
};

const MemoedChunkedData = React.memo(ChunkedData, checkOnlyData);
const MemoedPositionedData = React.memo(PositionedData, checkOnlyData);

const FixedElement = ({ data, clicked, keyValue, isActive }) => {
    const [state, setState] = useState({ x: data.x, y: data.y, width: data.width, height: data.height });
    const { fontSize, ref } = useFitText({ maxFontSize: 1000, resolution: 1 });
    const [lock] = useAtom(lockAtom);
    const run = () => {
        clicked(keyValue);
    };
    const clear = () => {
        clicked("");
    };

    if (data.label === "IMG") {
        return (
            <CustomRnd
                enableResizing={!lock}
                disableDragging={lock}
                onDragStart={run}
                onResizeStart={run}
                bounds={".frame"}
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
                enableResizing={!lock}
                disableDragging={lock}
                onDragStart={run}
                onResizeStart={run}
                bounds={".frame"}
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
                enableResizing={!lock}
                disableDragging={lock}
                onDragStart={run}
                onResizeStart={run}
                bounds={".frame"}
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

function Content({ data, index, sourcePath, frameInfo, isFull, template }) {
    const chunkedData = _.groupBy(data.learning_material, "in_column");
    const [activity] = useAtom(activityAtom);
    const [withFrame] = useAtom(withFrameAtom);
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
    const frameRatio = template.width / template.height;
    if (data.column === 0) {
        return (
            <Container isActive={isActive} bg={`${sourcePath}${data.bg_image}`}>
                <Inner>
                    <Frame src={frameInfo.topBg} height={frameInfo.topHeight} isActive={withFrame} />
                    {titleObj && (
                        <TitleContainer>
                            <TitleImg src={`${sourcePath}${titleObj.path}`} />
                        </TitleContainer>
                    )}
                    <PositionedContainer>
                        <PositionedCanvas ratio={frameRatio}>
                            {state.chunkedData[0].map((obj, index) => {
                                return <MemoedPositionedData data={obj} key={index} template={template} addFixedData={addFixedData} index={index} sourcePath={sourcePath} isFull={isFull} />;
                            })}
                        </PositionedCanvas>
                    </PositionedContainer>
                    <Frame src={frameInfo.bottomBg} height={frameInfo.bottomHeight} isActive={withFrame} />
                </Inner>
                {Object.entries(fixedData).map((value) => (
                    <FixedElement data={value[1]} key={value[0]} clicked={clicked} isActive={nodeEl === value[0]} keyValue={value[0]} />
                ))}
            </Container>
        );
    }
    return (
        <Container isActive={isActive} bg={`${sourcePath}${data.bg_image}`}>
            <Inner>
                <Frame src={frameInfo.topBg} height={frameInfo.topHeight} isActive={withFrame} />
                {titleObj && (
                    <TitleContainer>
                        <TitleImg src={`${sourcePath}${titleObj.path}`} />
                    </TitleContainer>
                )}
                <ColumnContainer>
                    {_.times(state.column, (i) => {
                        return <MemoedChunkedData data={state.chunkedData[i + 1]} key={i} addFixedData={addFixedData} index={index} sourcePath={sourcePath} isFull={isFull} />;
                    })}
                </ColumnContainer>
                <Frame src={frameInfo.bottomBg} height={frameInfo.bottomHeight} isActive={withFrame} />
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

const PositionedCanvas = styled.div`
    --current-height: calc(100vh - 50px);
    width: calc(var(--current-height) * ${(props) => props.ratio});
    height: 100%;
    margin: 0 auto;
    position: relative;
`;

const PositionedContainer = styled.div`
    display: flex;
    flex: 1;
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
    line-height: 150%;
    letter-spacing: 0.12em;
    white-space: pre-wrap;
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
    padding: 10px;
`;

const Container = styled.div`
    padding-top: 20px;
    display: ${(props) => (props.isActive ? "flex" : "none")};
    /* background-image: url(${(props) => props.bg}); */
    flex: 1;
    align-items: stretch;
`;

export default React.memo(Content);
