import { HitAreaFrames } from "@/tools/HitAreaFrames";
import { Application } from "@pixi/app";
import { Ticker } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import { Ticker, TickerPlugin } from "@pixi/core";
import { merge } from "lodash-es";
import { TEST_MODEL2, TEST_MODEL4, testEachModel } from "../env";
import {
    addBackground,
    callBefore,
    createApp,
    createModel,
    createModel,
    draggable,
} from "../utils";
import { expect, test } from "vitest";
import { Cubism4ModelSettings, Live2DModel } from "../../src";
import type { Cubism2Spec } from "../../src/types/Cubism2Spec";

let app;

before(async function () {
    window.app = app = createApp(Application);
    app.stage.sortableChildren = true;
    // app.stage.on('pointerup', e => console.log(e.data.global.x, e.data.global.y));

    let modelLayer = 0;

    await runtimes.each(async (runtime) => {
        runtime.model1 = await createModel(runtime.definition, { app, zIndex: modelLayer-- });
        runtime.model2 = await createModel(runtime.definition, {
            app,
            zIndex: runtime.model1.zIndex + 1,
        });
    });
});

after(function () {
    runtimes.each((runtime) => {
        runtime.model1.scale.set(0.5, 0.5);
        runtime.model2.scale.set(0.125, 0.125);

        runtime.model2.anchor.set(1, 0);
        runtime.model2.rotation = (Math.PI * 3) / 2;

        [runtime.model1, runtime.model2].forEach((model) => {
            addBackground(model);
            draggable(model);
            model.addChild(new HitAreaFrames());

            model.interaction = runtime.definition.interaction;

            // free to play!
            model.on("hit", function (hitAreas) {
                hitAreas.includes(this.interaction.exp) &&
                    this.internalModel.motionManager.expressionManager?.setRandomExpression();
                Object.keys(this.interaction.motion).forEach(
                    (area) =>
                        hitAreas.includes(area) &&
                        this.internalModel.motionManager.startRandomMotion(
                            this.interaction.motion[area],
                        ),
                );
            });
        });
    });

    runtimes.cubism4.model1.x = 550;
    runtimes.cubism4.model2.x = runtimes.cubism2.model1.width;

    app.start();
});

test("should handle GCed textures", function () {
    app.render();

    // all textures would be destroyed
    app.renderer.textureGC.count = 100000;
    app.renderer.textureGC.run();

    app.render();
});

await import("./compat.test");
