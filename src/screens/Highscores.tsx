import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import { formatFocusTime } from "@/game/format";
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
			<Text style={text} numberOfLines={1}>
				{entry.displayName.substring(0, 20)}
			</Text>
			<Text style={[text, styles.score]}>{formatFocusTime(entry.highscore)}</Text>
		</View>
	);
}

export default function HighscoresScreen() {
	const entries = useLeaderboardStore((s) => s.entries);
	const loaded = useLeaderboardStore((s) => s.loaded);
	const error = useLeaderboardStore((s) => s.error);
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: Math.max(50, insets.top + 10) }]}>
			<FlatList
				data={entries}
				keyExtractor={(e) => e.uid}
				renderItem={({ item, index }) => <Row entry={item} index={index} />}
				ListHeaderComponent={<Header>Slow Down Times</Header>}
				ListEmptyComponent={
					!loaded ? (
						<ActivityIndicator color={Colors.fontColor} style={styles.empty} />
					) : (
						<Text style={styles.empty}>{error ?? "No times yet."}</Text>
					)
				}
				contentContainerStyle={{ paddingBottom: 100 }}
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
	row: {
		flexDirection: "row",
		alignItems: "flex-end",
		paddingVertical: 10,
		borderBottomColor: "#FFF",
		borderBottomWidth: 1,
	},
	score: {
		flex: 1,
		textAlign: "right",
	},
	empty: {
		color: Colors.grayColor,
		textAlign: "center",
		marginTop: 40,
	},
});
