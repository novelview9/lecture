import shortid from "shortid";
import toStyle from "css-to-style";
import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useAtom } from "jotai";
import { useState } from "react";

import Image from "./Image";
import Text from "./Text";
import activityAtom from "../activityAtom";

const sourcePath = "/example_input1_source/";

const ChunkedData = React.memo(({ data }) => {
    console.log("gg");
    return (
        <>
            {data.map((obj) => {
                if (obj.label === "text_box") {
                    return <Text content={obj.text_content} key={shortid.generate()} />;
                } else if (obj.label === "video") {
                    return <Text key={shortid.generate()}>{obj.text_content}</Text>;
                } else {
                    return <Image url={`${sourcePath}${obj.path}`} key={shortid.generate()} />;
                }
            })}
        </>
    );
});

function Content({ data, withVideo, index }) {
    const chunkedData = _.groupBy(data.learning_material, "in_column");
    const [activity] = useAtom(activityAtom);
    const isActive = activity.slide === index;
    const [state] = useState({ chunkedData, column: data.column });
    return (
        <Container isFull={!withVideo} isActive={isActive}>
            {_.times(state.column, (i) => {
                return (
                    <Column key={i}>
                        <ChunkedData data={state.chunkedData[i + 1]} key={i} />
                    </Column>
                );
            })}
        </Container>
    );
}
const Info = styled.p`
    font-size: 200px;
`;
const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const Container = styled.div`
    background-color: gray;
    > div {
        padding: 20px;
    }
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    position: relative;
    display: ${(props) => (props.isActive ? "default" : "none")};
    @media only screen and (max-width: 900px) {
        > div {
            padding: 2px;
        }
    }

    width: 80%
        ${(props) =>
            props.isFull &&
            css`
                width: 100%;
            `};
`;

export default React.memo(Content);
