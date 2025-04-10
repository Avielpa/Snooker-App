import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getPlayerDetails } from '../../services/matchServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PlayerDetails() {
    const { id } = useLocalSearchParams();
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const playerData = await getPlayerDetails(Number(id));
                setPlayer(playerData);
                setLoading(false);
            } catch (err) {
                console.error('Error loading player details:', err);
                setError('Failed to load player details');
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading player details...</Text>
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

    if (!player) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Player not found.</Text>
            </View>
        );
    }
    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>{player.FirstName} {player.LastName}</Text>
            </View>
    
            <View style={styles.detailItem}>
                <Text style={styles.label}>Nationality:</Text>
                <Text style={styles.value}>{player.Nationality}</Text>
            </View>
            <View style={styles.detailItem}>
                <Text style={styles.label}>Born:</Text>
                <Text style={styles.value}>{player.Born}</Text>
            </View>
            <View style={styles.detailItem}>
                <Text style={styles.label}>First Season as Pro:</Text>
                <Text style={styles.value}>{player.FirstSeasonAsPro}</Text>
            </View>
            <View style={styles.detailItem}>
                <Text style={styles.label}>Ranking Titles:</Text>
                <Text style={styles.value}>{player.NumRankingTitles}</Text>
            </View>
            <View style={styles.detailItem}>
                <Text style={styles.label}>Maximums:</Text>
                <Text style={styles.value}>{player.NumMaximums}</Text>
            </View>
            {player.BioPage && (
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Bio Page:</Text>
                    <Text style={styles.value}>{player.BioPage}</Text>
                </View>
            )}
        </ScrollView>
    );
    }
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 20,
          backgroundColor: '#0f172a', // Tailwind slate-900
        },
        headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        },
        title: {
          fontSize: 26,
          fontFamily: 'PoppinsBold',
          color: '#f1f5f9',
          textAlign: 'center',
          flex: 1,
        },
        backButton: {
          position: 'absolute',
          left: 0,
          zIndex: 10,
        },
        detailItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderColor: '#334155',
        },
        label: {
          fontSize: 16,
          fontFamily: 'PoppinsSemiBold',
          color: '#cbd5e1',
        },
        value: {
          fontSize: 16,
          fontFamily: 'PoppinsRegular',
          color: '#f8fafc',
        },
        loadingText: {
          textAlign: 'center',
          fontSize: 18,
          fontFamily: 'PoppinsRegular',
          color: '#fff',
          marginTop: 20,
        },
        errorText: {
          textAlign: 'center',
          fontSize: 18,
          fontFamily: 'PoppinsRegular',
          color: 'red',
          marginTop: 20,
        },
      });
      