import {skinName} from "@alt1/base";

const allowedStyles = ['darkscape', 'default', 'legacy', 'smooth'];

export default function Alt1Style() {
    let skin = skinName;
    if (!allowedStyles.includes(skin)) {
        skin = 'default';
    }
    return <link rel="stylesheet" href={`styles/${skin}/skinstyle.css`} />
}
