/** @jsx jsx */
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {css, jsx, SerializedStyles} from '@emotion/react'

const fiveMinStyle = css`
    color: #999;
`;
const twoMinStyle = css`
    color: #666;
`;

export interface Props {
    time: dayjs.Dayjs
}

export default function Timer(props: Props) {
    let compute = () => {
        return props.time.diff(dayjs(), 's', false);
    }
    let [duration, setDuration] = useState(compute());

    useEffect(() => {
        let timer = setInterval(() => setDuration(compute()), 500);
        return () => clearInterval(timer);
    });

    let text = '0:00';
    if (duration > 0) {
        let min = Math.floor(duration / 60);
        let sec = (duration - (min * 60)).toString();

        if (sec.length === 1) {
            sec = '0' + sec;
        }
        text = `${min}:${sec}`;
    }

    let style: SerializedStyles|null = null;
    if (duration < 2 * 60) {
        style = twoMinStyle;
    } else if (duration < 5 * 60) {
        style = fiveMinStyle;
    }

    return <span css={style}>{text}</span>;
}
