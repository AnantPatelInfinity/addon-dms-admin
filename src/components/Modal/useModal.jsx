import { useState, useCallback } from "react";

export default function useModal() {
    const [isShown, setIsShown] = useState(false);

    const show = useCallback(() => setIsShown(true), []);
    const hide = useCallback(() => setIsShown(false), []);

    return {
        isShown,
        show,
        hide,
    };
}
