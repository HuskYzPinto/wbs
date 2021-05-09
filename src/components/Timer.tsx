import dayjs from "dayjs";
import {useEffect, useState} from "react";

export interface Props {
    time: dayjs.Dayjs
}

export default function Timer(props: Props) {
    let compute = () => {
        let duration = props.time.diff(dayjs(), 's', false);
        if (duration < 0) {
            return '0:00';
        }

        let min = Math.floor(duration / 60);
        let sec = (duration - (min * 60)).toString();

        if (sec.length === 1) {
            sec = '0' + sec;
        }
        return `${min}:${sec}`;
    }
    let [value, setValue] = useState(compute());

    useEffect(() => {
        let timer = setInterval(() => setValue(compute()), 500);
        return () => clearInterval(timer);
    });

    return <span>{value}</span>;
}
