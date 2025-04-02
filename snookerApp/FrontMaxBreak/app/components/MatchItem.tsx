import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MatchItem = ({ item, tourNames, playerNames, navigation, isLoggedIn }: any) => {
    const formatDate = (dateString : any) => new Date(dateString).toLocaleString('he-IL', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    const player1Name = playerNames[item.Player1ID] || 'טוען...';
    const player2Name = playerNames[item.Player2ID] || 'טוען...';
    const tourName = tourNames[item.EventID] || 'טוען...';
    const scoreDisplay = item.Score1 !== null && item.Score2 !== null ? `${item.Score1} - ${item.Score2}` : 'vs';
    const scheduledDate = item.ScheduledDate ? formatDate(item.ScheduledDate) : 'TBD';

    return (
        <TouchableOpacity style={styles.matchItem} onPress={() => isLoggedIn && navigation.push(`/match/${item.ID}`)} activeOpacity={isLoggedIn ? 0.7 : 1}>
            <SafeAreaView style={styles.playerRow}>
                <Text style={[styles.playerName, { textAlign: 'left' }]}>{player1Name}</Text>
                <Text style={styles.score}>{scoreDisplay}</Text>
                <Text style={[styles.playerName, { textAlign: 'right' }]}>{player2Name}</Text>
            </SafeAreaView>
            <SafeAreaView style={styles.detailsRow}>
                <Text style={styles.scheduledDate}>{scheduledDate}</Text>
                <Text style={styles.eventDetails}>{tourName}</Text>
            </SafeAreaView>
            {item.Note && <Text style={styles.note}>{item.Note}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    matchItem: { backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 15, marginVertical: 8, borderRadius: 8, alignItems: 'center' },
    playerRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 5 },
    playerName: { fontSize: 14, fontWeight: 'bold', color: '#333', flex: 1 },
    score: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', minWidth: 40 },
    eventDetails: { fontSize: 14, color: '#666', textAlign: 'right' },
    scheduledDate: { fontSize: 14, color: '#666', textAlign: 'left' },
    note: { fontSize: 12, color: '#666', textAlign: 'center' }
});

export default React.memo(MatchItem);
