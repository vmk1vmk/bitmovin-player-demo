import { Player, PlayerAPI } from 'bitmovin-player/modules/bitmovinplayer-core';
import { PlayerConfig, SourceConfig } from 'bitmovin-player/types/core/PlayerConfigAPI';
import AbrModule from 'bitmovin-player/modules/bitmovinplayer-abr';
import Mp4Module from 'bitmovin-player/modules/bitmovinplayer-container-mp4';
import ContainerTsModule from 'bitmovin-player/modules/bitmovinplayer-container-ts';
import EngineBitmovin from 'bitmovin-player/modules/bitmovinplayer-engine-bitmovin';
import EngineNative from 'bitmovin-player/modules/bitmovinplayer-engine-native';
import HlsModule from 'bitmovin-player/modules/bitmovinplayer-hls';
import MseRendererModule from 'bitmovin-player/modules/bitmovinplayer-mserenderer';
import StyleModule from 'bitmovin-player/modules/bitmovinplayer-style';

import { UIFactory } from './ui-factory';

const videoElementId: string = 'demo-player';
const domElement: HTMLElement | null = document.getElementById(videoElementId);

if (!domElement) {
    throw new Error(`No Element with id ${videoElementId} was found.`);
}

const playerConfig: PlayerConfig = {
    key: process.env.BITMOVIN_API_KEY || ''
};

const sourceConfig: SourceConfig = {
    title: 'Invalid Source example',
    description: 'An invalid source is loaded and the ui structure is duplicated',
    progressive: '/non-existent-video.mp4'
};

[
    EngineBitmovin,
    EngineNative,
    MseRendererModule,
    HlsModule,
    AbrModule,
    Mp4Module,
    ContainerTsModule,
    StyleModule
].forEach(Player.addModule);

const videoPlayer: PlayerAPI = new Player(domElement, playerConfig);

UIFactory.buildUI(videoPlayer, playerConfig);

videoPlayer.load(sourceConfig).catch(
    (error: Error) => console.log(`Error during source loading -> ${error.message}`)
);