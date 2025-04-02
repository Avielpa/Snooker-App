import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getRanking, getPlayerDetails } from '../services/matchServices';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    const router = useRouter();

    useEffect(() => {
        loadRankingData();
    }, []);

    const loadRankingData = useCallback(async () => {
        try {
            const data = await getRanking();
            if (data && Array.isArray(data)) {
                setRankingData(data);
                await loadPlayerNames(data);
            } else {
                setError('No ranking data found.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Failed to load ranking data:', error);
            setError('Failed to load ranking data');
            setLoading(false);
        }
    }, []);

    const loadPlayerNames = useCallback(async (rankingData: RankingItem[]) => {
        try {
            const names: { [playerId: number]: string } = {};
            const playerIds = rankingData.map((item) => item.PlayerID);

            const playerDetailsPromises = playerIds.map(async (playerId) => {
                try {
                    const playerData = await getPlayerDetails(playerId);
                    return {
                        playerId,
                        name: playerData
                            ? `${playerData?.FirstName || ''} ${playerData?.MiddleName || ''} ${playerData?.LastName || ''}`.trim()
                            : 'Unknown Player',
                    };
                } catch (error: any) {
                    console.error(`Failed to load player details for ID ${playerId}:`, error);
                    return { playerId, name: 'Unknown Player' };
                }
            });

            const results = await Promise.all(playerDetailsPromises);
            results.forEach(result => {
                names[result.playerId] = result.name;
            });

            setPlayerNames(names);
        } catch (error) {
            console.error('Failed to load player names:', error);
            setError('Failed to load player names');
        } finally {
            setLoading(false);
        }
    }, []);

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
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Ranking</Text>
            <FlatList
                data={rankingData}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item }) => (
                    <RankingItemComponent item={item} playerNames={playerNames} router={router} />
                )}
            />
        </SafeAreaView>
    );
}

const RankingItemComponent = React.memo(({ item, playerNames, router }: { item: RankingItem; playerNames: { [playerId: number]: string }; router: any }) => {
    const playerName = playerNames[item.PlayerID] || 'Unknown Player';
    

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => router.push(`/player/${item.PlayerID}`)}>
                <View style={styles.rankingItem}>
                        <Text style={styles.position}>{item.Position}.</Text>
                        <Text style={styles.playerName}>{playerName}</Text>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${item.Sum}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </SafeAreaView>

    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: 'white',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        marginTop: 20,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'red',
        marginTop: 20,
    },
    rankingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
        justifyContent: 'space-between',
    },
    position: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        width: 30,
        textAlign: 'left',
        color: 'white',
    },
    playerName: {
        fontSize: 16,
        color: 'white',
        flex: 1,
        marginRight: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        color: 'white',
        marginRight: 5,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});