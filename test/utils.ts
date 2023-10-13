import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import type { JSONObject, Live2DModelEvents, Live2DModelOptions, ModelSettings } from "../src";
import { Live2DModel, MotionPreloadStrategy } from "../src";
import { Application } from "@pixi/app";

export const BASE_PATH = "../../../test/";

export function remoteRequire(path) {
    return remote.require(resolve(BASE_PATH, path));
}

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
    });
}

export function readArrayBuffer(url: string) {
    const buffer = fs.readFileSync(resolve(process.cwd() + "/test/", url));

    // convert the Buffer to ArrayBuffer
    // https://stackoverflow.com/a/31394257/13237325
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

export function readText(url) {
    return fs.readFileSync(resolve(process.cwd() + "/test/", url), "utf-8");
}

export function readJSON(url) {
    return JSON.parse(readText(url));
}

export function createApp({ class: clazz }: { class?: typeof Application } = {}) {
    clazz ||= Application;

    const visible = !__HEADLESS__;

    const app = new clazz({
        width: innerWidth,
        height: 1000,
        autoStart: false,
        autoDensity: true,
        antialias: visible,
        resizeTo: window,
    });

    if (visible) {
        document.body.appendChild(app.view as HTMLCanvasElement);
    }

    return app;
}

export function addBackground(model) {
    const foreground = Sprite.from(Texture.WHITE);
    foreground.width = model.internalModel.width;
    foreground.height = model.internalModel.height;
    foreground.alpha = 0.2;
    model.addChild(foreground);
}

export function draggable(model) {
    model.on("pointerdown", (e) => {
        model.dragging = true;
        model._dragX = e.data.global.x;
        model._dragY = e.data.global.y;
    });
    model.on("pointermove", (e) => {
        if (model.dragging) {
            model.position.x += e.data.global.x - model._dragX;
            model.position.y += e.data.global.y - model._dragY;
            model._dragX = e.data.global.x;
            model._dragY = e.data.global.y;
        }
    });
    model.on("pointerupoutside", () => (model.dragging = false));
    model.on("pointerup", () => (model.dragging = false));
}

export function callBefore(obj, method, fn) {
    const originalMethod = obj[method];

    obj[method] = function () {
        fn.apply(this, arguments);
        originalMethod.apply(this, arguments);
    };
}

// TODO: make a public API for this
export function createModel(
    src: string | JSONObject | ModelSettings,
    options: Live2DModelOptions & {
        listeners?: {
            [K in keyof Live2DModelEvents]?: (
                this: Live2DModel,
                ...args: Live2DModelEvents[K]
            ) => void;
        };
    } = {},
): Promise<Live2DModel> {
    const model = Live2DModel.fromSync(src, {
        ...options,
        motionPreload: options.motionPreload ?? MotionPreloadStrategy.NONE,
    });

    if (options.listeners)
        Object.entries(options.listeners).forEach(([key, value]) => {
            if (typeof value === "function") model.on(key, value);
        });

    return new Promise((resolve) => {
        model.on("load", () => resolve(model));
    });
}
