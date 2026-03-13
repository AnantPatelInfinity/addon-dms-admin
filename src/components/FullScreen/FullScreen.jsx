import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router'

const FullScreen = () => {
    const fullscreenBtnRef = useRef(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document?.documentElement?.requestFullscreen()?.catch((err) => {
                console.error("Failed to enable fullscreen:", err);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const btn = fullscreenBtnRef.current;
        if (btn) {
            btn.addEventListener('click', toggleFullscreen);
        }
        return () => {
            if (btn) {
                btn.removeEventListener('click', toggleFullscreen);
            }
        };
    }, []);

    return (
        <li>
            <div>
                <Link
                    // to="#"
                    className="btn btn-icon border btn-menubar btnFullscreen"
                    ref={fullscreenBtnRef}
                >
                    <i className="ti ti-maximize" />
                </Link>
            </div>
        </li>
    )
}

export default FullScreen