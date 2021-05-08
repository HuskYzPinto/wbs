import {hasAlt1} from '@alt1/base';
import ChatboxReader from '@alt1/chatbox';
import {logCampLine} from './store/actions';
import type createStore from "./store/store";

const CHAT_REGEX = /\[\]/;

export default function readChatbox(store: ReturnType<typeof createStore>): void {
    if (!hasAlt1) {
        console.log('Alt1 not detected');
        return;
    }

    let reader = new ChatboxReader();
    setInterval(() => {
        if (!reader.pos) {
            try {
                reader.find();
            }catch(e){
                console.warn(e);
                return;
            }
        }

        let lines = reader.read();
        if (!lines) {
            return;
        }

        outer: for (let line of lines) {
            if(!line.fragments.find((frag) => frag.text === 'FC')){
                return;
            }
            let text = line.fragments[line.fragments.length-1].text.trimLeft();
            console.log('Alt1', text);
            store.dispatch(logCampLine(text));
        }
    }, alt1.captureInterval);
}
