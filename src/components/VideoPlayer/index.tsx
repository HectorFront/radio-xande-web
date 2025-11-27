import {StyleHTMLAttributes, VideoHTMLAttributes} from "react";
import 'video.js/dist/video-js.min.css';
import '@videojs/themes/dist/fantasy/index.css';
import './index.css';
import {
    useRef,
    useEffect,
    useReducer,
    MutableRefObject,
    memo,
    useState,
    useMemo
} from "react";
import VideoJS from 'video.js';
import Hls from "hls.js";
import '@theonlyducks/videojs-zoom/styles';
import '@theonlyducks/videojs-zoom';
import clsx from "clsx";
import { Icon, Render } from "@/components";
import { renderToStaticMarkup } from "react-dom/server";

interface VideoPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
    translates?: {
        live?: string;
        realTime?: string;
        recording?: string;
        connecting?: string;
        youAreWatching?: string;
    },
    srcThumbnail?: string;
    srcWaterMark?: string;
    classNameVideo?: string;
    classNameContainer?: string;
    positionWaterMark?: "top_left" | "top_right" | "bottom_left" | "bottom_right";
    styleVideo?: StyleHTMLAttributes<HTMLVideoElement>;
    styleContainer?: StyleHTMLAttributes<HTMLDivElement>;
    rate?: number;
    muted?: boolean;
    srcVideo: string | MediaStream;
    typeSrcVideo?: string;
    blurAmbilight?: number;
    saturateAmbilight?: number;
    informationHover?: {
        title?: string;
        subtitle?: string;
        description?: string;
        googleIconSubtitle?: string;
        googleIconDescription?: string;
    };
    preload?: string;
    controls?: boolean;
    autoPlay?: boolean;
    isLive?: boolean;
    supportHlsMediaType?: boolean;
    ambilight?: boolean;
    shadowAmbilight?: boolean;
    isWebRTCMediaStream?: boolean;
    innerRef?: (event) => void;
    innerNode?: (event) => void;
    captions?: {
        start: string;
        end: string | number;
        description: string;
    }[];
    disabledPause?: boolean;
    onAmbilightEvent?: (event) => void;
    onSetRateEvent?: (event) => void;
    onPlayEvent?: (event) => void;
    onPlayingEvent?: (event) => void;
    onZoomEvent?: (event) => void;
    onPauseEvent?: (event) => void;
    onEndedEvent?: (event) => void;
    onErrorEvent?: (event) => void;
    onBackSeconds?: (event) => void;
    onNextSeconds?: (event) => void;
    onScreenshot?: (event) => void;
    onClickToLive?: (event) => void;
    backSeconds?: boolean;
    nextSeconds?: boolean;
    onTimeUpdateEvent?: (event) => void;
    onWaitingEvent?: (event) => void;
    onLoadedDataEvent?: (event) => void;
    onShowControlBar?: (event) => void;
    onHiddenControlBar?: (event) => void;
    playbackRates?: Array<number>;
    resetPlaybackRateChangedSrc?: boolean;
    hideProgressControl?: boolean;
    zoomOptions?: {
        zoom?: number,
        moveX?: number,
        moveY?: number,
        flip?: string,
        rotate?: number
    };
    renderButtonsControlBar?: {
        show: string;
        title: string;
        className: string;
        googleIcon: string;
        onClick: (event) => void;
    }[];
    controlBar?: {
        zoom?: boolean;
        screenshot?: boolean;
        playToggle?: boolean;
        skipBackward?: boolean;
        skipForward?: boolean;
        volumePanel?: boolean;
        navigateLive?: boolean;
        currentTimeDisplay?: boolean;
        timeDivider?: boolean;
        durationDisplay?: boolean;
        progressControl?: boolean;
        liveDisplay?: boolean;
        seekToLive?: boolean;
        remainingTimeDisplay?: boolean;
        customControlSpacer?: boolean;
        chaptersButton?: boolean;
        descriptionsButton?: boolean;
        subsCapsButton?: boolean;
        audioTrackButton?: boolean;
        pictureInPictureToggle?: boolean;
        fullscreenToggle?: boolean;
    };
}

type StateProps = {
    loadedData: boolean;
    isLoading: boolean;
    oldSrcVideo: null | string | MediaStream;
    showInformationHover: boolean;
}

type ActionState = {
    type: string;
    values: any;
};

const INITIAL_STATE: StateProps = {
    loadedData: false,
    isLoading: false,
    oldSrcVideo: null,
    showInformationHover: false
};

const CSS_NAMESPACE_WATER_MARK = Object.freeze({
    "top_left": 'top-0 left-0',
    "top_right": 'top-0 right-0',
    "bottom_left": 'bottom-0 left-0',
    "bottom_right": 'bottom-0 right-0'
});

interface VideoJSZoomProps {
    zoom(value): void;
    rotate(value): void;
    move(x, y): void;
    toggle(): void;
    flip(signal): void;
    enablePlugin(): void
    disablePlugin(): void
}

function callbackFnProps(fn: Function | any, payload: any) {
    typeof fn === "function" && fn(payload);
}

function reducerState(state: StateProps, action: ActionState): any {
    if (action.type === 'set') {
        return {...state, ...action.values};
    }
    throw Error('Unknown action.');
}

const CUSTOM_CONTROL_BAR = ['zoom', 'screenshot', 'navigateLive'];
const CSS_NAMESPACES_VIDEOJS = {
    play: 'vjs-play-control',
    ambilight: 'vjs-ambilight',
    screenshot: 'vjs-screenshot',
    controlBar: 'vjs-control-bar',
    navigateLive: 'vjs-navigate-live',
    volumePanel: 'vjs-volume-panel',
    playbackRate: 'vjs-playback-rate',
    keyboardRightTime: 'keyboard-right-time',
    keyboardLeftTime: 'keyboard-left-time',
    pictureInPicture: 'vjs-picture-in-picture-control'
};

let timeoutControlBar: any;
let isWaiting: boolean = true;
let timeoutInformationHover: any;
let timeoutKeyboardLeftEvent: any;
let timeoutKeyboardRightEvent: any;
let resetPlaybackRate: boolean = true;

export const VideoPlayer = memo((props: VideoPlayerProps) => {

    const idPlayer = useMemo(() => `player-${parseInt(Math.random() * 100)}`, []);
    const idContainerPlayer = useMemo(() => `container-player-${parseInt(Math.random() * 100)}`, []);

    let intervalAmbilight: any;
    let intervalEndedStreamHLS: any;

    const HLSVideo = new Hls();

    const {
        translates = {
            live: "Ao vivo",
            realTime: "Real-Time",
            recording: "Gravação",
            connecting: "Conectando",
            seconds: "Segundos",
            youAreWatching: "Você está assistindo"
        },
        srcThumbnail = null,
        srcWaterMark = '',
        classNameVideo = '',
        classNameContainer = '',
        positionWaterMark = 'top_right',
        styleVideo = {},
        styleContainer = {},
        rate = 1,
        muted = true,
        srcVideo = null,
        typeSrcVideo = null,
        blurAmbilight = 15,
        saturateAmbilight = 300,
        informationHover = {
            title: null,
            subtitle: null,
            description: null,
            googleIconSubtitle: null,
            googleIconDescription: null
        },
        preload = 'auto',
        controls = true,
        autoPlay = false,
        isLive = false,
        supportHlsMediaType = false,
        ambilight = false,
        shadowAmbilight = false,
        playbackRates = [],
        zoomOptions = {},
        renderButtonsControlBar = [],
        isWebRTCMediaStream = false,
        innerRef = null,
        innerNode = null,
        captions = [],
        disabledPause = false,
        onAmbilightEvent = null,
        onPlayEvent = null,
        onPlayingEvent = null,
        onPauseEvent = null,
        onErrorEvent = null,
        onBackSeconds = null,
        onNextSeconds = null,
        onScreenshot = null,
        onClickToLive = null,
        backSeconds = true,
        nextSeconds = true,
        onTimeUpdateEvent = null,
        onEndedEvent = null,
        onZoomEvent = null,
        onSetRateEvent = null,
        onWaitingEvent = null,
        onLoadedDataEvent = null,
        onShowControlBar = null,
        onHiddenControlBar = null,
        resetPlaybackRateChangedSrc = true,
        hideProgressControl = false,
        controlBar = {
            screenshot: false,
            zoom: false
        },
        ...restProps
    } = props;

    const OPTIONS_VIDEO_JS = {
        controlBar,
        rate: rate,
        muted: muted,
        preload: preload,
        autoplay: autoPlay,
        controls: controls,
        playbackRates: playbackRates,
        userActions: { doubleClick: false }
    };

    const [videoPlayer, setVideoPlayer] = useState<object | any>(null);
    const [playControl, setPlayControl] = useState<HTMLDivElement | any>(null);

    const videoNode: MutableRefObject<HTMLVideoElement | any> = useRef();
    const containerVideo: MutableRefObject<HTMLDivElement | any> = useRef();
    const canvasAmbilighNode: MutableRefObject<HTMLCanvasElement | any> = useRef();
    const canvasScreenshotNode: MutableRefObject<HTMLCanvasElement | any> = useRef();

    const [state, dispatchState] = useReducer(reducerState, INITIAL_STATE);
    const [zoomPlayer, setZoomPlayer] = useState<VideoJSZoomProps | null>(null);
    const [showAmbilight, setShowAmbilight] = useState<boolean>(shadowAmbilight);
    const [_buttonsPlayer, setButtonsPlayer] = useState<HTMLButtonElement[]>([]);
    const [_currentPlaybackRate, setCurrentPlaybackRate] = useState<number>(OPTIONS_VIDEO_JS.rate || 1);

    const handleEnded = event => {
        if(isLive) {
            dispatchState({
                type: 'set',
                values: {
                    loadedData: false
                }
            });
            if(intervalEndedStreamHLS) clearInterval(intervalEndedStreamHLS);
            intervalEndedStreamHLS = setInterval(() => {
                if(state.loadedData) {
                    console.log(`[Player: ${idPlayer}] = Connected`);
                    clearInterval(intervalEndedStreamHLS);
                    intervalEndedStreamHLS = null;
                } else {
                    console.log(`[Player: ${idPlayer}] = Connecting...`);
                    setSources();
                }
            }, 3e3);
        } else {
            callbackFnProps(onEndedEvent, event);
            setShowInformationEventHover(false);
        }
    };

    const listenersPlayWebRTC = () => {
        if (videoNode.current.paused()) {
            videoNode.current.play();
        } else {
            videoNode.current.pause();
        }
        playControl?.removeEventListener('click', listenersPlayWebRTC);
        videoNode.current.removeEventListener('click', listenersPlayWebRTC);
    };

    const handlePause = () => {
        if (videoPlayer.paused() && disabledPause) {
            return videoPlayer.play();
        }
        if (isLive && isWebRTCMediaStream && !disabledPause) {
            playControl?.addEventListener('click', listenersPlayWebRTC);
            videoNode.current.addEventListener('click', listenersPlayWebRTC);
        }
    };

    const handleError = (err: any) => {
        videoPlayer.error(null);
        callbackFnProps(onErrorEvent, err);
    };

    const handleLoadedData = (event: EventTarget) => {
        if (!isLive && !resetPlaybackRateChangedSrc) {
            const playerPlaybackRate = videoPlayer.playbackRate();
            setCurrentPlaybackRate(currentPlaybackRate => {
                if (playerPlaybackRate !== currentPlaybackRate) {
                    videoPlayer.playbackRate(currentPlaybackRate);
                    callbackFnProps(onSetRateEvent, currentPlaybackRate);
                    syncPlaybackRate(currentPlaybackRate);
                }
                return currentPlaybackRate;
            });
            resetPlaybackRate = true;
        }
        dispatchState({
            type: 'set',
            values: {
                isLoading: false,
                loadedData: true
            }
        });
        callbackFnProps(onLoadedDataEvent, event);
    };

    const handleTimeUpdate = () => {
        callbackFnProps(onTimeUpdateEvent, videoPlayer.currentTime());
    };

    const handlePlayEvent = (event: EventTarget) => {
        callbackFnProps(onPlayEvent, event);
    };

    const handlePauseEvent = (event: EventTarget) => {
        callbackFnProps(onPauseEvent, event);
    };

    const handleUserActivePlayer = (event: EventTarget) => {
        callbackFnProps(onShowControlBar, event);
    };

    const handleUserInactivePlayer = (event: EventTarget) => {
        callbackFnProps(onHiddenControlBar, event);
    };
    
    const disableListeners = () => {
        document.removeEventListener('keyup', backAndForth);
        playControl?.removeEventListener('click', handlePause);
        videoPlayer.off('waiting', handleWaiting);
        videoPlayer.off('playing', handlePlaying);
        videoPlayer.off('error', handleError);
        videoPlayer.off("ratechange", onChangeRate);
        videoPlayer.off('loadeddata', handleLoadedData);
        videoPlayer.off('timeupdate', handleTimeUpdate);
        videoPlayer.off('useractive', handleUserActivePlayer);
        videoPlayer.off('userinactive', handleUserInactivePlayer);
        videoPlayer.off('play', handlePlayEvent);
        videoPlayer.off('pause', handlePauseEvent);
        const playbackRateButton = videoPlayer.controlBar.getChild('playbackRateMenuButton');
        if (playbackRateButton && OPTIONS_VIDEO_JS.playbackRates.length) {
            playbackRateButton.off('click', handleClickPlaybackRateCycling);
        }
    };

    const disposePlayer = () => {
        [intervalAmbilight, intervalEndedStreamHLS].forEach(id => id && clearInterval(id));
        [timeoutKeyboardLeftEvent, timeoutKeyboardRightEvent, timeoutInformationHover, timeoutControlBar].forEach(id => id && clearTimeout(id));
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {});
        }
        if (videoPlayer && !videoPlayer.isDisposed()) {
            clearButtonsControlBar();
            disableListeners();
            videoPlayer.off();
            videoPlayer.dispose();
        }
        if (HLSVideo && typeof HLSVideo.destroy === 'function') {
            try { HLSVideo.destroy(); } catch {}
        }
        if (videoNode.current) {
            videoNode.current.src = '';
            videoNode.current.removeAttribute('src');
            videoNode.current.load();
        }
        videoNode.current = null;
        setVideoPlayer(null);
        setPlayControl(null);
        const container = document.getElementById(idContainerPlayer);
        if (container) container.innerHTML = '';
        console.log('[Clear] => Video.js removed from DOM and memory');
    };

    const clearButtonsControlBar = (callback = () => {}) => {
        const controlBar = videoPlayer.controlBar;
        setButtonsPlayer(prevButtons => {
            prevButtons.forEach(button => button.remove());
            return [];
        });
        controlBar.children().forEach(child => {
            if (child instanceof VideoJS.getComponent('Button')) {
                controlBar.removeChild(child);
                child.dispose();
            }
        });
        callback();
    };

    const removeButtonControlBar = ({ className }) => {
        document.querySelectorAll(`#${idContainerPlayer} .${className}`).forEach(el => el.remove());
        const controlBar = videoPlayer.controlBar;
        const buttonComponent = controlBar.children().find(child => {
            const el = child?.el?.();
            return el && el.classList.contains(className);
        });
        if (buttonComponent) {
            controlBar.removeChild(buttonComponent);
            buttonComponent.dispose();
        }
    };

    const hideElement = ({ className, hidden }: { className: string, hidden: boolean }) => {
        const elements = document.querySelectorAll(`#${idContainerPlayer} .${className}`);
        elements.forEach(el => el.style.display = hidden ? 'none' : 'block');
    };

    const createButtonControlBar = ({ className = '', onClick = (e) => {}, googleIcon = '', ...restProps }) => {
        if (document.querySelector(`#${idContainerPlayer} .${CSS_NAMESPACES_VIDEOJS.controlBar} .${className}`)) return;
        const button = videoPlayer.controlBar.addChild('button', {});
        const buttonDOM = button.el();
        setButtonsPlayer(buttons => {
            buttons.push(buttonDOM);
            return buttons;
        });
        button.addClass(className);
        button.on('click', onClick);
        buttonDOM.innerHTML = renderToStaticMarkup(
            <Icon
                staticMarkup
                name={googleIcon}
                className={className}
                style={{ fontSize: 22 }}
                {...restProps}
            />
        );
    };

    const createButtonControlBarCustom = ({ className = '', onClick = (e) => {}, googleIcon = '', ...restProps }) => {
        if (document.querySelector(`#${idContainerPlayer} .${CSS_NAMESPACES_VIDEOJS.controlBar} .${className}`)) return;
        const volumePanel = videoPlayer.controlBar.getChild('volumePanel');
        const button = videoPlayer.controlBar.addChild('button', {});
        const buttonDOM = button.el();
        if (volumePanel) {
            const volumePanelEl = volumePanel.el();
            volumePanelEl.parentNode.insertBefore(buttonDOM, volumePanelEl.nextSibling);
        }
        setButtonsPlayer(buttons => {
            buttons.push(buttonDOM);
            return buttons;
        });
        button.addClass(className);
        button.on('click', onClick);
        buttonDOM.innerHTML = renderToStaticMarkup(
            <Icon
                staticMarkup
                name={googleIcon}
                className={className}
                style={{ fontSize: 22 }}
                {...restProps}
            />
        );
    };

    const createButtonLiveControlBar = ({ className = '', onClick = (e) => {}, ...restProps }) => {
        const existingButton = document.querySelector(`#${idContainerPlayer} .${CSS_NAMESPACES_VIDEOJS.controlBar} .${className}`);
        if (existingButton) {
            const textLiveStatus = existingButton.querySelector(".text-live-status");
            const dotStatus = existingButton.querySelector(".dot-status");
            textLiveStatus.innerText = isWebRTCMediaStream ? translates.realTime : translates.live;
            if (isLive) {
                existingButton.style.cursor = "default";
                existingButton.setAttribute('disabled', "true");
                dotStatus?.classList.remove("!bg-neutral-400");
                dotStatus?.classList.add("!bg-red-500");
                dotStatus?.classList.add("live-status");
            } else {
                existingButton.style.cursor = "pointer";
                existingButton.removeAttribute('disabled');
                dotStatus?.classList.remove("!bg-red-500");
                dotStatus?.classList.add("!bg-neutral-400");
                dotStatus?.classList.remove("live-status");
            }
            return;
        }
        const volumePanel = videoPlayer.controlBar.getChild('volumePanel');
        const button = videoPlayer.controlBar.addChild('button', {});
        const buttonDOM = button.el();
        if (volumePanel) {
            const volumePanelEl = volumePanel.el();
            volumePanelEl.parentNode.insertBefore(buttonDOM, volumePanelEl.nextSibling);
        }
        setButtonsPlayer(buttons => {
            buttons.push(buttonDOM);
            return buttons;
        });
        button.addClass(className);
        button.on('click', onClick);
        buttonDOM.disabled = isLive;
        buttonDOM.style.cursor = isLive ? "default" : "pointer";
        buttonDOM.innerHTML = renderToStaticMarkup(
            <div className='flex flex-row items-center gap-1'>
                <div
                    style={{ height: 9, width: 9 }}
                    className={`dot-status rounded-full !bg-opacity-80 ${isLive ? "!bg-red-500 live-status" : "!bg-neutral-400"}`}
                />
                <span className='text-live-status'>{translates.live}</span>
            </div>
        );
    };

    const screenshotVideo = () => {
        const currentDate = new Date();
        const canvas = canvasScreenshotNode.current;
        canvas.width = videoNode.current.offsetWidth;
        canvas.height = videoNode.current.offsetHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoNode.current, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/jpeg', 1);
        const link = document.createElement('a');
        link.download = `[Screenshot] ${informationHover.title ? `${informationHover.title} - ${currentDate}` : currentDate}.jpeg`;
        link.href = image;
        link.click();
        link.remove();
        callbackFnProps(onScreenshot, image);
    };

    const backAndForth = (event) => {
        event.stopPropagation();
        if (!isLive && !isWaiting && !videoPlayer.paused()) {
            if (event.code === "ArrowLeft" && backSeconds) {
                if (timeoutKeyboardLeftEvent) {
                    clearTimeout(timeoutKeyboardLeftEvent);
                    timeoutKeyboardLeftEvent = null;
                }
                if (onBackSeconds) {
                    callbackFnProps(onBackSeconds, { type: 'back', seconds: 10, videoPlayer });
                } else {
                    if (videoPlayer.currentTime() <= 10) {
                        const backSecond = videoPlayer.duration() - 10; // 50 seconds
                        videoPlayer.currentTime(backSecond + videoPlayer.currentTime()) // + diff seconds
                    } else {
                        videoPlayer.currentTime(videoPlayer.currentTime() - 10);
                    }
                }
                const display = document.querySelectorAll(`#${idContainerPlayer} .${CSS_NAMESPACES_VIDEOJS.keyboardLeftTime}`);
                display.forEach(arrow => {
                    arrow?.classList.remove("invisible");
                    timeoutKeyboardLeftEvent = setTimeout(() => {
                        arrow?.classList.add("invisible");
                    }, 5e2);
                });
            }
            if (event.code === "ArrowRight" && nextSeconds) {
                if (timeoutKeyboardRightEvent) {
                    clearTimeout(timeoutKeyboardRightEvent);
                    timeoutKeyboardRightEvent = null;
                }
                if (onNextSeconds) {
                    callbackFnProps(onNextSeconds, { type: 'next', seconds: 10, videoPlayer });
                } else {
                    const nextSecond = videoPlayer.currentTime() + 10;
                    if (nextSecond >= videoPlayer.duration()) {
                        videoPlayer.currentTime(0);
                    } else {
                        videoPlayer.currentTime(videoPlayer.currentTime() + 10);
                    }
                }
                const display = document.querySelectorAll(`#${idContainerPlayer} .${CSS_NAMESPACES_VIDEOJS.keyboardRightTime}`);
                display.forEach(arrow => {
                    arrow?.classList.remove("invisible");
                    timeoutKeyboardRightEvent = setTimeout(() => {
                        arrow?.classList.add("invisible");
                    }, 5e2);
                });
            }
        }
    };

    const hiddenControlBar = (hidden: boolean) => {
        const controlBar: HTMLDivElement | any = videoNode.current.offsetParent.querySelector(".vjs-control-bar");
        controlBar.style.visibility = hidden ? 'hidden' : 'visible';
    };

    const setRefs = () => {
        callbackFnProps(innerRef, videoPlayer);
        callbackFnProps(innerNode, videoNode);
    };

    const setButtons = () => {
        hiddenControlBar(true);
        // custom control bar
        renderButtonsControlBar
            .forEach(({ show = false, title, googleIcon, className, onClick = (e) => {} }) => {
                if (show) {
                    createButtonControlBarCustom({
                        title,
                        onClick,
                        className,
                        googleIcon
                    });
                } else {
                    removeButtonControlBar({ className });
                }
        });
        // ambilight
        if (ambilight) {
            createButtonControlBar({
                title: "Ambilight",
                onClick: () => setShowAmbilight(show => {
                    const value = !show;
                    callbackFnProps(onAmbilightEvent, value);
                    return value;
                }),
                className: CSS_NAMESPACES_VIDEOJS.ambilight,
                googleIcon: 'fluorescent'
            })
        }
        // screenshot
        if (controlBar.hasOwnProperty("screenshot")) {
            if (controlBar.screenshot) {
                createButtonControlBar({
                    title: "Screenshot",
                    onClick: screenshotVideo,
                    className: CSS_NAMESPACES_VIDEOJS.screenshot,
                    googleIcon: 'photo_size_select_small'
                });
            } else {
                removeButtonControlBar({ className: CSS_NAMESPACES_VIDEOJS.screenshot });
            }
        }
        // zoom
        if (controlBar.hasOwnProperty("zoom")) {
            if (controlBar.zoom) {
                setZoomPlayer(instanceZoomPlayer => {
                    if (!instanceZoomPlayer) {
                        const zoom = videoPlayer.zoomPlugin({
                            showZoom: true,
                            showMove: true,
                            showRotate: true,
                            gestureHandler: true
                        });
                        zoom.listen("change", event => callbackFnProps(onZoomEvent, event));
                        zoom.enablePlugin();
                        return zoom;
                    }
                    return instanceZoomPlayer;
                });
            } else {
                setZoomPlayer(instanceZoomPlayer => {
                    if (instanceZoomPlayer) {
                        instanceZoomPlayer?.disablePlugin();
                        return null;
                    }
                    return instanceZoomPlayer;
                });
            }
        }
        // navigateLive
        if (controlBar.hasOwnProperty("navigateLive")) {
            if (controlBar.navigateLive) {
                createButtonLiveControlBar({
                    title: "Live",
                    onClick: () => callbackFnProps(onClickToLive, { click: "navigateLive" }),
                    className: CSS_NAMESPACES_VIDEOJS.navigateLive
                });
            } else {
                removeButtonControlBar({ className: CSS_NAMESPACES_VIDEOJS.navigateLive });
            }
        }
        // pictureInPicture
        if (!isLive) {
            if (document.pictureInPictureElement) document.exitPictureInPicture().then(() => {});
        }
        hideElement({
            hidden: !isLive,
            className: CSS_NAMESPACES_VIDEOJS.pictureInPicture
        });
    };

    const onChangeRate = () => {
        if (resetPlaybackRate) {
            callbackFnProps(onSetRateEvent, videoPlayer.playbackRate());
        }
    };

    const handleWaiting = (event) => {
        isWaiting = true;
        callbackFnProps(onWaitingEvent, event)
    };

    const handlePlaying = (event) => {
        isWaiting = false;
        callbackFnProps(onPlayingEvent, event);
    };

    const setListeners = () => {
        disableListeners();
        videoPlayer.on('error', handleError);
        videoPlayer.on('waiting', handleWaiting);
        videoPlayer.on('playing', handlePlaying);
        videoPlayer.on("ratechange", onChangeRate);
        videoPlayer.on('loadeddata', handleLoadedData);
        videoPlayer.on('timeupdate', handleTimeUpdate);
        videoPlayer.on('useractive', handleUserActivePlayer);
        videoPlayer.on('userinactive', handleUserInactivePlayer);
        videoPlayer.on('play', handlePlayEvent);
        videoPlayer.on('pause', handlePause);
        playControl?.addEventListener('click', handlePause);
        document.addEventListener('keyup', backAndForth);
        const playbackRateButton = videoPlayer.controlBar.getChild('playbackRateMenuButton');
        if (playbackRateButton && OPTIONS_VIDEO_JS.playbackRates.length) {
            playbackRateButton.on('click', handleClickPlaybackRateCycling);
        }
    };

    const setShowInformationEventHover = (toggle: boolean) => {
        hiddenControlBar(false);
        if (timeoutInformationHover) {
            clearTimeout(timeoutInformationHover);
            timeoutInformationHover = null;
        }
        dispatchState({
            type: 'set',
            values: {
                showInformationHover: toggle
            }
        });
        if (toggle) {
            timeoutInformationHover = setTimeout(() => {
                if (!videoPlayer.paused()) {
                    dispatchState({
                        type: 'set',
                        values: {
                            showInformationHover: false
                        }
                    });
                    hiddenControlBar(true);
                }
            }, 3e3);
        }
    };

    const resetSources = () => {
        if (videoNode.current) {
            videoNode.current.src = null;
            videoNode.current.srcObject = null;
        }
    };

    const loadSource = async (src: string | any) => {
        if (supportHlsMediaType) {
            HLSVideo.loadSource(src);
            HLSVideo.attachMedia(videoNode.current);
        } else {
            if (typeSrcVideo) {
                await videoPlayer.src({ type: typeSrcVideo, src });
            } else {
                await videoPlayer.src(src);
            }
        }
        if (OPTIONS_VIDEO_JS.autoplay) await videoPlayer.play();
    };

    const loadSourceWebRTC = async (src: MediaStream | any) => {
        videoNode.current.srcObject = src;
        if (OPTIONS_VIDEO_JS.autoplay) await videoNode.current.play();
    };

    const flashAmbilightCanvas = () => {
        if (ambilight) {
            intervalAmbilight = setInterval(() => {
                const canvas = canvasAmbilighNode.current;
                if (canvas) {
                    canvas.width = videoNode.current.offsetWidth;
                    canvas.height = videoNode.current.offsetHeight;
                    const ctx = canvas.getContext('2d');
                    const styleTransformVideo = videoNode.current.style.transform;
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    if (styleTransformVideo && styleTransformVideo !== 'none') {
                        // let translateX = 0;
                        // let translateY = 0;
                        // let scaleY = 1;
                        // let rotation = 0;
                        // const translateMatch = styleTransformVideo.match(/translate\(([^,]+), ([^)]+)\)/);
                        // if (translateMatch) {
                        //     translateX = parseFloat(translateMatch[1]);
                        //     translateY = parseFloat(translateMatch[2]);
                        // }
                        // const rotateMatch = styleTransformVideo.match(/rotate\(([^)]+)\)/);
                        // if (rotateMatch) {
                        //     rotation = parseFloat(rotateMatch[1]) * Math.PI / 180;
                        // }
                        // ctx.rotate(rotation);
                        // ctx.translate(translateX, translateY);
                        let scaleX = 1;
                        const scaleMatch = styleTransformVideo.match(/scale\(([^,]+), ([^)]+)\)/);
                        if (scaleMatch) {
                            scaleX = parseFloat(scaleMatch[1]);
                            // scaleY = parseFloat(scaleMatch[2]);
                        }
                        ctx.scale(scaleX, 1);
                    }
                    ctx.drawImage(videoNode.current, 0, 0, canvas.width, canvas.height);
                } else {
                    clearInterval(intervalAmbilight);
                    intervalAmbilight = null;
                }
            }, 100);
        }
    };

    const syncPlaybackRate = (currentRate) => {
        const playbackRateButton = videoPlayer.controlBar.getChild('playbackRateMenuButton');
        if (playbackRateButton && !playbackRateButton?.isDisposed_) {
            const menuEl = playbackRateButton.el_.querySelector('.vjs-menu-content');
            if (menuEl) {
                const menuItems = menuEl.querySelectorAll('.vjs-menu-item');
                menuItems.forEach((item) => {
                    if (item.textContent.trim() === `${currentRate}x`) {
                        item.classList.add('vjs-selected');
                    } else {
                        item.classList.remove('vjs-selected');
                    }
                });
            }
            const labelEl = playbackRateButton.labelEl_;
            if (labelEl) {
                labelEl.textContent = `${currentRate}x`;
            }
        }
    };

    const forceControlBarVisible = () => {
        if (OPTIONS_VIDEO_JS.controls) {
            if (timeoutControlBar) {
                clearTimeout(timeoutControlBar);
                timeoutControlBar = null;
            }
            videoPlayer.controlBar.show();
            const controlBars = document.querySelectorAll('.video-js .vjs-control-bar');
            controlBars.forEach(controlBar => controlBar.classList.add('force-visible'));
            timeoutControlBar = setTimeout(() => controlBars.forEach(controlBar => controlBar.classList.remove('force-visible')), 5000);
        }
    };

    const handleClickPlaybackRateCycling = () => {
        if (timeoutControlBar) clearTimeout(timeoutControlBar);
        setCurrentPlaybackRate(currentPlaybackRate => {
            const nextRate = OPTIONS_VIDEO_JS.playbackRates[(OPTIONS_VIDEO_JS.playbackRates.indexOf(currentPlaybackRate) + 1) % OPTIONS_VIDEO_JS.playbackRates.length];
            videoPlayer.playbackRate(nextRate);
            forceControlBarVisible();
            return currentPlaybackRate;
        });
    };

    const isEquivalentMediaStream = (src1, src2) => {
        return src1?.id === src2?.id;
    }

    const setSources = async () => {
        const srcIsDiff = isWebRTCMediaStream && isLive
            ? !isEquivalentMediaStream(srcVideo, state.oldSrcVideo)
            : srcVideo !== state.oldSrcVideo;
        if (srcIsDiff) {
            isWaiting = true;
            if (videoPlayer.userActive()) {
                forceControlBarVisible();
            }
            if (!isLive && !resetPlaybackRateChangedSrc) {
                resetPlaybackRate = false;
            }
            resetSources(); // trigger on change rate for 1
            if (!isLive || !isWebRTCMediaStream) {
                await loadSource(srcVideo);
            }
            if (isWebRTCMediaStream && srcVideo instanceof MediaStream) {
                await loadSourceWebRTC(srcVideo);
            }
            dispatchState({
                type: 'set',
                values: {
                    oldSrcVideo: srcVideo
                }
            });
        }
    };

    const updateOptions = () => {
        // Por favor, matem o video.js, os cara simplesmente não aceitam nova renderização com um object!!!
        Object.keys(OPTIONS_VIDEO_JS.controlBar).forEach(key => {
            if (!CUSTOM_CONTROL_BAR.includes(key)) {
                const control = videoPlayer.controlBar.getChild(key);
                if (control) {
                    control[OPTIONS_VIDEO_JS.controlBar[key] ? 'show' : 'hide']();
                }
                if (OPTIONS_VIDEO_JS.controlBar[key]) {
                    videoPlayer.controlBar.addChild(key);
                }
            }
        });
        videoPlayer.muted(OPTIONS_VIDEO_JS.muted);
        videoPlayer.controls(OPTIONS_VIDEO_JS.controls);
        videoPlayer.autoplay(OPTIONS_VIDEO_JS.autoplay);
        videoPlayer.playbackRate(OPTIONS_VIDEO_JS.rate);
        setCurrentPlaybackRate(OPTIONS_VIDEO_JS.rate);
        OPTIONS_VIDEO_JS.autoplay ? videoPlayer.play() : videoPlayer.pause();
        if (OPTIONS_VIDEO_JS.playbackRates.length) {
            hideElement({
                hidden: isLive,
                className: CSS_NAMESPACES_VIDEOJS.playbackRate
            });
        }
    };

    const convertTimeInSeconds = (time: string | any = "00:00:00") => {
        if (typeof time === "string") {
            const hourSeconds = Number(time.split(":")[0]) * 3600;
            const minuteSeconds = Number(time.split(":")[1]) * 60;
            const seconds = Number(time.split(":")[2]);
            return hourSeconds + minuteSeconds + seconds;
        }
        if (time === Infinity) {
            const hoursDay = 24, hourSeconds = 3600, limitDays = 365;
            return (limitDays * hourSeconds) * hoursDay; // 1 year in seconds
        }
        return 0;
    };

    useEffect(() => {
        const player = VideoJS(videoNode.current, OPTIONS_VIDEO_JS);
        const play = document.querySelector(`#${idContainerPlayer} .${CSS_NAMESPACES_VIDEOJS.play}`);
        setVideoPlayer(player);
        setPlayControl(play);
    }, []);

    useEffect(() => {
        if (videoPlayer) {
            flashAmbilightCanvas();
        }
        return () => {
            if (videoPlayer) {
                disposePlayer();
            }
        }
    }, [videoPlayer]);

    useEffect(() => {
        if (videoPlayer) {
            setListeners();
        }
    }, [videoPlayer, isLive]);

    useEffect(() => {
        if (videoPlayer) {
            setRefs();
            setSources().then(() => {
                if (captions.length) {
                    let track = videoNode.current.addTextTrack("captions", "Captions", "en");
                    track.mode = "showing";
                    captions.forEach(itemCaptions => {
                        track.addCue(new VTTCue(
                            convertTimeInSeconds(itemCaptions.start),
                            convertTimeInSeconds(itemCaptions.end),
                            itemCaptions.description
                        ));
                    });
                }
            });
            setButtons();
            updateOptions();
        }
    }, [JSON.stringify({...props, zoomOptions: undefined }), videoPlayer]);

    useEffect(() => {
        if (Object.keys(zoomOptions).length && zoomPlayer) {
            if (zoomOptions.hasOwnProperty("flip")) zoomPlayer?.flip(zoomOptions.flip);
            if (zoomOptions.hasOwnProperty("zoom")) zoomPlayer?.zoom(zoomOptions.zoom);
            if (zoomOptions.hasOwnProperty("rotate")) zoomPlayer?.rotate(zoomOptions.rotate);
            if (zoomOptions.hasOwnProperty("moveX") && zoomOptions.hasOwnProperty("moveY")) zoomPlayer?.move(zoomOptions.moveX, zoomOptions.moveY);
        }
    }, [zoomOptions, zoomPlayer]);

    useEffect(() => {
        if (videoPlayer && disabledPause) {
            videoPlayer.userActive(false);
            const videoEl = videoNode.current;
            const blockPause = (e) => {
                e.stopImmediatePropagation();
                e.preventDefault();
                if (videoPlayer.paused()) {
                    videoPlayer.play().catch(() => {});
                }
            };
            const preventEvents = ['pause', 'click', 'touchstart'];
            preventEvents.forEach((ev) => {
                videoEl.addEventListener(ev, blockPause, true);
            });
            const preventKeyboard = (e) => {
                if ([' ', 'k'].includes(e.key.toLowerCase())) e.preventDefault();
            };
            document.addEventListener('keydown', preventKeyboard);
            const checkPlaying = setInterval(() => {
                if (videoPlayer.paused()) videoPlayer.play().catch(() => {});
            }, 500);
            return () => {
                preventEvents.forEach((ev) =>
                    videoEl.removeEventListener(ev, blockPause, true)
                );
                document.removeEventListener('keydown', preventKeyboard);
                clearInterval(checkPlaying);
            };
        }
    }, [videoPlayer, disabledPause]);

    const isConnecting = !state.loadedData && isLive;
    const showBlurAmbilight = ambilight && showAmbilight && state.loadedData;
    return (
        <div
            ref={containerVideo}
            id={idContainerPlayer}
            style={styleContainer}
            onMouseMove={() => setShowInformationEventHover(true)}
            className={clsx('bg-black aspect-video h-full w-full relative rounded-player', classNameContainer, { "hide-progress-control": hideProgressControl })}
        >
            <canvas
                ref={canvasAmbilighNode}
                className="canvas-ambilight"
                style={{ opacity: showBlurAmbilight ? 1 : 0, filter: `blur(${blurAmbilight}px) saturate(${saturateAmbilight}%)`}}
            />
            <div data-vjs-player="" className="relative rounded-player">
                <Render test={isConnecting}>
                    <div
                        className="rounded-player w-full h-full flex items-end justify-center absolute pointer-events-none">
                        <span className="text-2xl pulse-effect-animate mb-20">
                            {translates.connecting}...
                        </span>
                    </div>
                </Render>
                <Render test={state.isLoading && isWebRTCMediaStream}>
                    <div
                        className="rounded-player w-full h-full flex items-center justify-center absolute pointer-events-none">
                        <Icon
                            name="progress_activity"
                            className="text-white text-6xl xl:text-9xl rotate-infinite"
                        />
                    </div>
                </Render>
                <video
                    playsInline
                    preload="auto"
                    id={idPlayer}
                    muted={muted}
                    ref={videoNode}
                    style={styleVideo}
                    poster={srcThumbnail}
                    onEnded={handleEnded}
                    crossOrigin="anonymous"
                    onPause={event => {
                        if (!disabledPause) handlePause(event);
                    }}
                    className={clsx("video-js rounded-player vjs-theme-fantasy cursor-pointer !h-full !w-full", classNameVideo)}
                    {...restProps}
                />
                <Render test={controlBar?.screenshot}>
                    <canvas ref={canvasScreenshotNode} className="absolute w-0 h-0 hidden"/>
                </Render>
                <Render test={srcWaterMark}>
                    <img
                        alt="Water Mark"
                        src={srcWaterMark}
                        className={clsx("absolute m-5 w-16 sm:w-20 lg:w-32", { "z-10": positionWaterMark !== "top_left" }, CSS_NAMESPACE_WATER_MARK[positionWaterMark])}
                    />
                </Render>
                <Render test={informationHover.title && state.showInformationHover}>
                    <div
                        className='fade-in-animate rounded-player absolute w-full h-full bg-gradient-to-b from-black pointer-events-none top-0'>
                        <div className="flex justify-start flex-col py-14 px-14 gap-2">
                            <div className="text-sm lg:text-lg xl:text-xl flex flex-row items-center gap-4">
                                {translates.youAreWatching}&nbsp;
                                <span className="flex flex-row items-center font-extrabold">
                                    <Render test={isLive}>
                                        <Icon
                                            filled
                                            name="circle"
                                            className="text-sm lg:text-lg text-red-500"
                                        />
                                        &nbsp;{translates[isWebRTCMediaStream ? 'realTime' : 'live']}
                                    </Render>
                                    <Render test={!isLive}>
                                        <Icon
                                            filled
                                            name="movie"
                                            className="text-xl lg:text-2xl"
                                        />
                                        &nbsp;{translates.recording}
                                    </Render>
                                </span>
                            </div>
                            <h1 className="font-extrabold text-xl lg:text-2xl xl:text-5xl flex items-center flex-row">
                                <Render test={isLive}>
                                    <Icon
                                        name="cast"
                                        className="text-2xl lg:text-4xl xl:text-7xl"
                                    />
                                </Render>
                                <Render test={!isLive}>
                                    <Icon
                                        name="hangout_video"
                                        className="text-2xl lg:text-4xl xl:text-7xl"
                                    />
                                    &nbsp;
                                </Render>
                                <span className="line-clamp-2">{informationHover.title}</span>
                            </h1>
                            <Render test={informationHover.subtitle}>
                                <span className="text-sm lg:text-lg flex items-center flex-row">
                                    <Render test={informationHover.googleIconSubtitle}>
                                        <Icon
                                            filled
                                            className="text-xl lg:text-2xl"
                                            name={String(informationHover.googleIconSubtitle)}
                                        />
                                        &nbsp;
                                    </Render>
                                    <span className="line-clamp-2">{informationHover.subtitle}</span>
                                </span>
                            </Render>
                            <Render test={informationHover.description}>
                                <span className="text-sm lg:text-lg w-8/12 flex items-center flex-row">
                                    <Render test={informationHover.googleIconDescription}>
                                        <Icon
                                            filled
                                            className="text-xl lg:text-2xl"
                                            name={String(informationHover.googleIconDescription)}
                                        />
                                        &nbsp;
                                    </Render>
                                    <span className="line-clamp-4">{informationHover.description}</span>
                                </span>
                            </Render>
                        </div>
                    </div>
                </Render>
            </div>
            <div className={`${CSS_NAMESPACES_VIDEOJS.keyboardLeftTime} invisible font-bold select-none pulse-effect-animate`} style={{right: '85%'}}>
                <Icon style={{ height: 45 }} name="keyboard_arrow_left" className="text-6xl"/>
                <p className="text-xl">10</p>
            </div>
            <div className={`${CSS_NAMESPACES_VIDEOJS.keyboardRightTime} invisible font-bold select-none pulse-effect-animate`} style={{left: '85%'}}>
                <Icon style={{ height: 45 }} name="keyboard_arrow_right" className="text-6xl"/>
                <p className="text-xl">10</p>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});