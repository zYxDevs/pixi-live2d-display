import haruJson from "./assets/haru/haru_greeter_t03.model3.json";
import haruJsonUrl from "./assets/haru/haru_greeter_t03.model3.json?url";
import shizukuJson from "./assets/shizuku/shizuku.model.json";
import shizukuJsonUrl from "./assets/shizuku/shizuku.model.json?url";
import type { Awaitable } from "vitest";
import { test } from "vitest";

if ("layout" in shizukuJson) {
    throw new Error("Test model should not have a layout, but found in shizuku");
}
if ("Layout" in haruJson) {
    throw new Error("Test model should not have a layout, but found in haru");
}

const shizuku = Object.freeze({
    name: "shizuku",
    cubismVersion: 2,
    modelJson: shizukuJson,
    modelJsonUrl: shizukuJsonUrl,
    mocData: await fetch(shizukuJson.model).then((res) => res.arrayBuffer()),
    width: 1280,
    height: 1380,
    layout: {
        center_x: 0,
        y: 1.2,
        width: 2.4,
    },
    hitTests: [
        { x: 620, y: 200, hitArea: ["head"] },
        { x: 620, y: 350, hitArea: ["head", "mouth"] },
        { x: 750, y: 700, hitArea: ["body"] },
    ],
    interaction: {
        exp: "head",
        motion: {
            body: "tap_body",
        },
    },
});

const haru = Object.freeze({
    name: "haru",
    cubismVersion: 4,
    modelJson: haruJson,
    modelJsonUrl: haruJsonUrl,
    mocData: await fetch(haruJson.FileReferences.Moc).then((res) => res.arrayBuffer()),
    width: 2400,
    height: 4500,
    layout: {
        Width: 1.8,
        X: 0.9,
    },
    hitTests: [
        { x: 1166, y: 834, hitArea: ["Head"] },
        { x: 910, y: 981, hitArea: ["Body"] },
    ],
    interaction: {
        exp: "Head",
        motion: {
            Body: "Tap",
        },
    },
});

export const TEST_MODEL2 = shizuku;
export const TEST_MODEL4 = haru;

type TestModel = typeof shizuku | typeof haru;

export function testEachModel(name: string, fn: (model: TestModel) => Awaitable<void>) {
    test.each(
        [TEST_MODEL2, TEST_MODEL4].map((model) => ({
            name: model.name,
            model,
        })),
    )(name + " ($name)", ({ model }) => fn(model));
}
