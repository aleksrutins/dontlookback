export function typeText(target: Element, text: string, intervalTime = 300) {
    target.textContent = ""
    return new Promise<void>((res, _rej) => {
        let char = 0;
        const interval = setInterval(() => {
            target.textContent += text[char] ?? '';
            char++;
            if(char > text.length) {
                clearInterval(interval);
                res();
            }
        }, intervalTime)
    })
}