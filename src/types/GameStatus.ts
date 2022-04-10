/** GENERATED */
interface GameStatus {
	ServerGameVersion: string;
	gameClientVersion: string;
	gameCodePath: string;
	gameLibPath: string;
	maintenance: boolean;
	maintenanceMessage: number;
	prodigyGameFlags: {
		QIFetchStudentData: boolean;
		allOutAttackDisabled: boolean;
		autoAttackDisabled: boolean;
		classCodePromptCurriculumBlacklist: {};
		coOpTitanDisabled: boolean;
		debugPassword: string;
		disableMembershipVideoAdDuringSchoolHours: boolean;
		disableParentAttach5: boolean;
		disableTrialMembership: boolean;
		enableMembershipVideoAd: boolean;
		enableVerboseAnalytics: boolean;
		enableVerboseGameServer: boolean;
		enableYouTubeAd: boolean;
		enableYouTubeTimeCheck: boolean;
		enabledEvents: {
			PVP: boolean;
			anonymous_game_complete_v3: boolean;
			anonymous_game_discovery: boolean;
			"battle-start-type": boolean;
			"conversion-funnel-event": boolean;
			"create-character": boolean;
			education_lesson_encounter_v3: boolean;
			education_question_interface_v3: boolean;
			epicAttacks: boolean;
			game_avatar: boolean;
			game_avatar_v3: boolean;
			game_battle_v3: boolean;
			game_complete: boolean;
			game_complete_v3: boolean;
			game_discovery_v3: boolean;
			game_level_up: boolean;
			game_mod: boolean;
			game_question_v3: boolean;
			game_session_start: boolean;
			game_session_start_v3: boolean;
			game_sink: boolean;
			game_sink_v3: boolean;
			game_social: boolean;
			game_social_v3: boolean;
			game_source: boolean;
			game_source_v3: boolean;
			"item-change-event": boolean;
			login: boolean;
			"member-ad": boolean;
			"new-member": boolean;
			"pvp-season-reward": boolean;
			"survey-results": boolean;
			"toy-event": boolean;
			"zone-event": boolean;
		};
		experimentLE2: boolean;
		experimentLE3LaneB: boolean;
		experimentLE3LaneC: boolean;
		gameDataPath: string;
		gameDataVersion: number;
		gameServerRollout: number;
		googleLoginSettings: {
			amazon: boolean;
			google: boolean;
		};
		"loader-allowedIps": string[];
		"loader-allowedOverrideIps": boolean;
		"loader-gameClientOverride": boolean;
		"loader-gameCodePathOverride": string;
		"loader-gameDataVersionOverride": number;
		"loader-phaserPIXI": boolean;
		"loader-pixiCanary": number;
		"loader-pixiClientVersion": string;
		"loader-pixiDataVersion": number;
		"loader-windowVarBlacklist": string[];
		lockoutTrial: {
			endDate: string;
			startDate: string;
			trialLengthDays: number;
		};
		multiplayerClusterLocations: {
			ID: number;
			path: string;
			url: string;
		};
		parentAttachTrial: {
			endDate: string;
			exclusionLanes: {};
			startDate: string;
			trialLengthDays: number;
		};
		recordingFeatures: {
			"archives-run": boolean;
			"post-tutorial": boolean;
		};
		removeAssets: boolean;
		sentrySampleRate: number;
		setFest: number;
		splashScreen: string;
		surveyCheckIntervalMinutes: number;
		useServerTimeForVideoLockout: boolean;
		videoLessonInstantWin: boolean;
	};
}
