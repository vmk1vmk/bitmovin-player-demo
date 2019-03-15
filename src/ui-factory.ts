import { PlayerAPI, UIConfig } from 'bitmovin-player';

import { AdMessageLabel } from 'bitmovin-player-ui/dist/js/framework/components/admessagelabel';
import { Container } from 'bitmovin-player-ui/dist/js/framework/components/container';
import { ControlBar } from 'bitmovin-player-ui/dist/js/framework/components/controlbar';
import { FullscreenToggleButton } from 'bitmovin-player-ui/dist/js/framework/components/fullscreentogglebutton';
import { PlaybackTimeLabel, PlaybackTimeLabelMode } from 'bitmovin-player-ui/dist/js/framework/components/playbacktimelabel';
import { PlaybackToggleButton } from 'bitmovin-player-ui/dist/js/framework/components/playbacktogglebutton';
import { PlaybackToggleOverlay } from 'bitmovin-player-ui/dist/js/framework/components/playbacktoggleoverlay';
import { SeekBar } from 'bitmovin-player-ui/dist/js/framework/components/seekbar';
import { Spacer } from 'bitmovin-player-ui/dist/js/framework/components/spacer';
import { TitleBar } from 'bitmovin-player-ui/dist/js/framework/components/titlebar';
import { UIContainer } from 'bitmovin-player-ui/dist/js/framework/components/uicontainer';
import { UIManager } from 'bitmovin-player-ui/dist/js/framework/uimanager';
import { VolumeControlButton } from 'bitmovin-player-ui/dist/js/framework/components/volumecontrolbutton';
import { VolumeToggleButton } from 'bitmovin-player-ui/dist/js/framework/components/volumetogglebutton';
import { VRToggleButton } from 'bitmovin-player-ui/dist/js/framework/components/vrtogglebutton';

import { UIConditionContext, UIVariant } from 'bitmovin-player-ui/dist/js/framework/uimanager';

export class UIFactory {
    public static buildUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
        const conditionList: UIVariant[] = [
            {
                ui: UIFactory.getAdUI(),
                condition: (context: UIConditionContext) => {
                    return context.isAd;
                }
            },
            {
                ui: UIFactory.getContentUI(true, true),
                condition: (context: UIConditionContext): boolean => {
                    return context.isMobile && !isFinite(player.getDuration());
                }
            },
            {
                ui: UIFactory.getContentUI(false, true),
                condition: (context: UIConditionContext) => {
                    return context.isMobile;
                }
            },
            {
                ui: UIFactory.getContentUI(true, false),
                condition: () => !isFinite(player.getDuration())
            },
            {
                ui: UIFactory.getContentUI(false, false),
                condition: () => isFinite(player.getDuration())
            }
        ];

        return new UIManager(player, conditionList, config);
    }

    private static getAdUI(): UIContainer {
        return new UIContainer({
            hideDelay: -1,
            components: [
                new ControlBar({
                    components: [
                        new Container({
                            components: [
                                new PlaybackToggleButton(),
                                new AdMessageLabel({
                                    text: 'Werbung endet in {remainingTime} Sekunden',
                                    cssClasses: ['ad-message-label']
                                }),
                                new Spacer(),
                                new VolumeControlButton(),
                                new FullscreenToggleButton()
                            ],
                            cssClasses: ['controlbar-top']
                        })
                    ]
                })
            ]
        });
    }

    private static getContentUI(isLive: boolean, isMobile: boolean): UIContainer {
        return new UIContainer({
            components: [
                new PlaybackToggleOverlay(),
                UIFactory.getTitleBar(),
                UIFactory.getControlBar(isLive, isMobile)
            ]
        });
    }

    private static getTitleBar(): TitleBar {
        return new TitleBar({
            components: [new Spacer(), new VRToggleButton()]
        });
    }

    private static getControlBar(isLive: boolean, isMobile: boolean): ControlBar {
        return new ControlBar({
            components: [
                new Container({
                    components: [
                        new PlaybackToggleButton(),
                        new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.CurrentTime }),
                        ...(isLive
                            ? [new Spacer()]
                            : [new SeekBar(), new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.TotalTime })]),
                        ...(isMobile ? [new VolumeToggleButton()] : [new VolumeControlButton()]),
                        new FullscreenToggleButton()
                    ],
                    cssClasses: ['controlbar-top']
                })
            ]
        });
    }
}
