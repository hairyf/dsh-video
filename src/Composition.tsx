import { Composition, Folder } from "remotion";
import { FILM_FRAMES, OPENING_FRAMES, Film } from "./Film";
import { Demo } from "./Simulation";
import { DEMOS, DEMO_HEIGHT, DEMO_WIDTH } from "./demo-timeline";
import type { DemoName } from "./demo-timeline";

// 样片跟随片头安装与蒙太奇的实际长度，和完整片共用时钟。
export const MyComposition = () => {
  return (
    <>
      <Composition id="Film" component={Film} durationInFrames={FILM_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="Opening" component={Film} durationInFrames={OPENING_FRAMES} fps={30} width={1920} height={1080} />
      <Folder name="Simulated-recordings">
        {(Object.keys(DEMOS) as DemoName[]).map((name) => (
          <Composition key={name} id={`Demo-${name}`} component={Demo} durationInFrames={DEMOS[name].duration} fps={30} width={DEMO_WIDTH} height={DEMO_HEIGHT} defaultProps={{ name, pointer: false }} />
        ))}
      </Folder>
    </>
  );
};
