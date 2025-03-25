

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getUpcomingMatches, getTourDetails, getPlayerDetails } from '../services/matchServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Match {
    ID: number;
    EventID: string;
    Player1ID: number;
    Player2ID: number;
    Score1: number | null;
    Score2: number | null;
    Note: string | null;
    ScheduledDate: string | null;
}

const MatchItem = React.memo(({ item, tourNames, playerNames, navigation, isLoggedIn }: any) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const player1Name = playerNames[item.Player1ID] || 'Unknown Player';
    const player2Name = playerNames[item.Player2ID] || 'Unknown Player';
    const tourName = tourNames[item.EventID] || 'Unknown Tour';
    const scoreDisplay = item.Score1 !== null && item.Score2 !== null ? `${item.Score1} - ${item.Score2}` : 'vs';
    const scheduledDate = item.ScheduledDate ? formatDate(item.ScheduledDate) : 'TBD';

    const handlePlayerPress = (playerId: number) => {
        if (isLoggedIn) {
            navigation.push(`/player/${playerId}`);
        }
    };

    const handleMatchPress = (matchId: number) => {
        if (isLoggedIn) {
            navigation.push(`/match/${matchId}`);
        }
    };

    return (
        <TouchableOpacity
            style={styles.matchItem}
            onPress={() => isLoggedIn && handleMatchPress(item.ID)}
            activeOpacity={isLoggedIn ? 0.7 : 1}
        >
            <View style={styles.playerRow}>
                <Text style={[styles.playerName, { textAlign: 'left' }]} onPress={() => isLoggedIn && handlePlayerPress(item.Player1ID)}>
                    {player1Name}
                </Text>
                <Text style={styles.score}>{scoreDisplay}</Text>
                <Text style={[styles.playerName, { textAlign: 'right' }]} onPress={() => isLoggedIn && handlePlayerPress(item.Player2ID)}>
                    {player2Name}
                </Text>
            </View>
            <View style={styles.detailsRow}>
                <Text style={styles.scheduledDate}>{scheduledDate}</Text>
                <Text style={styles.eventDetails}>{tourName}</Text>
            </View>
            {item.Note && <Text style={styles.note}>{item.Note}</Text>}
        </TouchableOpacity>
    );
});

export default function index() {
    const [matchesData, setMatchesData] = useState<Match[]>([]);
    const [tourNames, setTourNames] = useState<{ [eventId: string]: string }>({});
    const [playerNames, setPlayerNames] = useState<{ [playerId: number]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigation = useRouter();
    

    useEffect(() => {
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem('userToken');
            setIsLoggedIn(!!token);
        };

        checkLogin();
        const fetchData = async () => {
            try {
                const matches = await getUpcomingMatches();
                setMatchesData(matches);
                await loadTourAndPlayerNames(matches);
            } catch (err) {
                console.error('Error loading matches:', err);
                setError('Failed to load matches');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const loadTourAndPlayerNames = useCallback(async (matches: Match[]) => {
        const eventIds = [...new Set(matches.map(match => match.EventID))];
        const playerIds = new Set<number>();
        matches.forEach(match => {
            playerIds.add(match.Player1ID);
            playerIds.add(match.Player2ID);
        });

        const tourNamesMap = await loadTourNames(eventIds);
        const playerNamesMap = await loadPlayerNames(Array.from(playerIds));

        setTourNames(tourNamesMap);
        setPlayerNames(playerNamesMap);
    }, []);

    const loadTourNames = useCallback(async (eventIds: string[]) => {
        const tourNamesMap: { [eventId: string]: string } = {};

        await Promise.all(eventIds.map(async (eventId) => {
            try {
                const tourDetails = await getTourDetails(eventId);
                tourNamesMap[eventId] = tourDetails[0]?.Name || 'Unknown Tour';
            } catch (err) {
                console.error(`Error loading tour name for ${eventId}:`, err);
                tourNamesMap[eventId] = 'Unknown Tour';
            }
        }));

        return tourNamesMap;
    }, []);

    const loadPlayerNames = useCallback(async (playerIds: number[]) => {
        const playerNamesMap: { [playerId: number]: string } = {};

        await Promise.all(playerIds.map(async (playerId) => {
            try {
                const playerDetails = await getPlayerDetails(playerId);
                playerNamesMap[playerId] = `${playerDetails[0]?.FirstName || ''} ${playerDetails[0]?.MiddleName || ''} ${playerDetails[0]?.LastName || ''}`.trim();
            } catch (err) {
                console.error(`Error loading player name for ${playerId}:`, err);
                playerNamesMap[playerId] = 'Unknown Player';
            }
        }));

        return playerNamesMap;
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading matches...</Text>
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
                data={matchesData}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item }) => (
                    <MatchItem
                        item={item}
                        tourNames={tourNames}
                        playerNames={playerNames}
                        navigation={navigation}
                        isLoggedIn={isLoggedIn}
                    />
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
        alignItems: 'center',
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 5,
    },
    playerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        flex: 1,
    },
    score: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
        minWidth: 40,
    },
    eventDetails: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
    },
    scheduledDate: {
        fontSize: 14,
        color: '#666',
        textAlign: 'left',
    },
    note: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});