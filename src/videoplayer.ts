import { Player, PlayerAPI } from "bitmovin-player/modules/bitmovinplayer-core";
import {
  PlayerConfig,
  SourceConfig
} from "bitmovin-player/types/core/PlayerConfigAPI";
import AbrModule from "bitmovin-player/modules/bitmovinplayer-abr";
import Mp4Module from "bitmovin-player/modules/bitmovinplayer-container-mp4";
import ContainerTsModule from "bitmovin-player/modules/bitmovinplayer-container-ts";
import EngineBitmovin from "bitmovin-player/modules/bitmovinplayer-engine-bitmovin";
import EngineNative from "bitmovin-player/modules/bitmovinplayer-engine-native";
import MseRendererModule from "bitmovin-player/modules/bitmovinplayer-mserenderer";
import StyleModule from "bitmovin-player/modules/bitmovinplayer-style";

import { UIFactory } from "./ui-factory";

const VIDEO_ELEMENT_ID: string = "demo-player";

(function playerSetup(): void {
  const domElement: HTMLElement | null = document.getElementById(
    VIDEO_ELEMENT_ID
  );

  if (!domElement) {
    throw new Error(`No Element with id ${VIDEO_ELEMENT_ID} was found.`);
  }

  const playerConfig: PlayerConfig = {
    key: process.env.BITMOVIN_API_KEY || "",
    playback: {
      muted: true
    }
  };

  const sourceConfig: SourceConfig = {
    title: "Invalid Source example",
    progressive:
      "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/MI201109210084_mpeg-4_hd_high_1080p25_10mbits.mp4" // source: https://bitmovin.com/demos/stream-test
  };

  [
    EngineBitmovin,
    EngineNative,
    MseRendererModule,
    AbrModule,
    Mp4Module,
    ContainerTsModule,
    StyleModule
  ].forEach(Player.addModule);

  const videoPlayer: PlayerAPI = new Player(domElement, playerConfig);

  UIFactory.buildUI(videoPlayer, playerConfig);

  videoPlayer
    .load(sourceConfig)
    .catch((error: Error) =>
      console.log(`Error during source loading -> ${error.message}`)
    );
})();
