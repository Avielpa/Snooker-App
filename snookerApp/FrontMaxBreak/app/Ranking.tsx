import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getRanking, getPlayerDetails } from '../services/matchServices';

interface RankingItem {
    ID: number;
    Position: number;
    PlayerID: number;
    Season: number;
    Sum: number;
    Type: string;
}

export default function Ranking() {
    const [rankingData, setRankingData] = useState<RankingItem[]>([]);
    const [playerNames, setPlayerNames] = useState<{ [playerId: number]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRankingData();
    }, []);

    const loadRankingData = async () => {
        try {
            const data = await getRanking();
            setRankingData(data);
            await loadPlayerNames(data);
        } catch (error) {
            console.error('Failed to load ranking data:', error);
            setError('Failed to load ranking data');
        } finally {
            setLoading(false);
        }
    };

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const loadPlayerNames = async (rankingData: RankingItem[]) => {
        try {
            const names: { [playerId: number]: string } = {};
            const playerIds = rankingData.map((item) => item.PlayerID);
    
            for (const playerId of playerIds) {
                try {
                    const playerData = await getPlayerDetails(playerId);
                    if (Array.isArray(playerData) && playerData.length > 0) {
                        names[playerId] = `${playerData[0]?.FirstName || ''} ${playerData[0]?.MiddleName || ''} ${playerData[0]?.LastName || ''}`.trim();
                    } else {
                        console.error(`Invalid player data for ID ${playerId}:`, playerData);
                        names[playerId] = 'Unknown Player';
                    }
                } catch (error: any) {
                    if (error.response && error.response.status === 500) {
                        console.error(`Error 500 fetching player details for ID ${playerId}:`, error);
                        names[playerId] = 'Unknown Player';
                    } else {
                        throw error;
                    }
                }
                await delay(500); // הוספת השהייה של 500 מילישניות
            }
            setPlayerNames(names);
        } catch (error) {
            console.error('Failed to load player names:', error);
            setError('Failed to load player names');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading ranking...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={rankingData}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item }) => (
                    <View style={styles.matchItem}>
                        <Text style={styles.playerName}>
                            {item.Position}. {playerNames[item.PlayerID] || 'Unknown Player'}, earn this year: ${item.Sum}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'transparent',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        marginTop: 20,
    },
    matchItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
});