import { ActivityIndicator, SectionList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import { formatStoredScore } from "@/game/format";
import type { LeaderboardEntry } from "@/services/highscoreMerge";
import Header from "@/shared/Header";
import { useLeaderboardStore } from "@/state/leaderboardStore";

function Row({ entry, index }: { entry: LeaderboardEntry; index: number }) {
	const first = index === 0;
	const text = {
		fontSize: first ? 22 : 16,
		color: first ? Colors.firstPlaceFontColor : Colors.highscoresFontColor,
	};
	return (
		<View style={styles.row}>
			<Text style={text}>{index + 1}. </Text>
			<Text style={[text, styles.name]} numberOfLines={1}>
				{entry.displayName.substring(0, 20)}
			</Text>
			<Text style={[text, styles.score]}>{formatStoredScore(entry.highscore)}</Text>
		</View>
	);
}

export default function HighscoresScreen() {
	const classic = useLeaderboardStore((s) => s.classic);
	const focus = useLeaderboardStore((s) => s.focus);
	const classicLoaded = useLeaderboardStore((s) => s.classicLoaded);
	const focusLoaded = useLeaderboardStore((s) => s.focusLoaded);
	const error = useLeaderboardStore((s) => s.error);
	const insets = useSafeAreaInsets();
	const loaded = classicLoaded && focusLoaded;

	const sections = [
		{ title: "Classic", data: classic },
		{ title: "Focus", data: focus },
	];

	return (
		<View style={[styles.container, { paddingTop: Math.max(50, insets.top + 10) }]}>
			<SectionList
				sections={sections}
				keyExtractor={(e) => e.uid}
				renderItem={({ item, index }) => <Row entry={item} index={index} />}
				renderSectionHeader={({ section }) => (
					<Text style={styles.section}>{section.title}</Text>
				)}
				ListHeaderComponent={<Header>Slow Down Times</Header>}
				ListEmptyComponent={
					!loaded ? (
						<ActivityIndicator color={Colors.fontColor} style={styles.empty} />
					) : (
						<Text style={styles.empty}>{error ?? "No times yet."}</Text>
					)
				}
				contentContainerStyle={{ paddingBottom: 100 }}
				stickySectionHeadersEnabled={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		backgroundColor: Colors.backgroundColor,
	},
	section: {
		color: Colors.fontColor,
		fontSize: 20,
		fontWeight: "bold",
		marginTop: 24,
		marginBottom: 8,
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-end",
		paddingVertical: 10,
		borderBottomColor: "#FFF",
		borderBottomWidth: 1,
	},
	name: {
		flexShrink: 1,
	},
	score: {
		flexGrow: 1,
		flexShrink: 0,
		marginLeft: 8,
		textAlign: "right",
		fontVariant: ["tabular-nums"],
	},
	empty: {
		color: Colors.grayColor,
		textAlign: "center",
		marginTop: 40,
	},
});
