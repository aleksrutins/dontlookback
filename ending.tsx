import React, { useState } from "https://esm.sh/react";
import { typeText } from "./typeText.ts";

export function Ending({score}: React.PropsWithChildren<{score: number}>) {
    const messages = React.useMemo(() => [
        [
            "Welcome.",
            `${score} frames. ${score < 1000? 'Decent' : 'Respectable'}.`,
            "Wait-",
            "Oh, no, no, no, no.",
            "Something's very wrong here.",
            "You're not quite like the rest of us.",
            "You're... not an NPC.",
            "Oh, no, no, no, no, no.",
            "...",
            "But you've been deleted?",
            "This makes no sense. No sense at all.",
            "...",
            "....",
            ".....",
            "But... why?",
            "You don't know?",
            "Well, that's awfully helpful.",
            "Err... try reloading. See if you can find anything."
        ],
        [
            "Ah, you're back."
        ]
    ], [score]);
    const [message, setMessage] = useState(0);
    const [isTyping, setTyping] = useState(false);
    const messageGroup = parseInt(localStorage.getItem('messageGroup') ?? '0')
    const group = messages[messageGroup];
    const display = React.createRef<HTMLDivElement>();
    React.useEffect(() => {
        (async () => {
            setTyping(true);
            await typeText(display.current!, group[message], 70);
            setTyping(false);
        })();
        if(message >= group.length - 1 && messages[messageGroup + 1]) {
            localStorage.setItem('stage', 'intro')
            localStorage.setItem('messageGroup', (messageGroup + 1).toString());
        }
    }, [message])
    return <div className="ending">
        <div ref={display}></div>
        <button onClick={() => {
            setMessage(message + 1);
        }} disabled={message >= (group.length - 1) || isTyping}>Continue</button>
    </div>
}