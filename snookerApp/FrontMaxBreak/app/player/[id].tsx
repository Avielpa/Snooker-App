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
            padding: 16,
            backgroundColor: 'transparent',
        },
        headerContainer: { // סגנון חדש עבור ה- View שמכיל את החץ ואת השם
            flexDirection: 'row', // הגדרת כיוון השורה
            alignItems: 'center', // יישור אנכי של האלמנטים במרכז
            marginBottom: 16, // הוספת מרווח מתחת לשורה
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginLeft: 40, 
            color: 'white', 
            textAlign:'center'
        },
        detailItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: '#ccc',
        },
        label: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
        },
        value: {
            fontSize: 16,
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
        backButton: {
            position: 'relative', // שינוי ל-relative כדי שה-title יתמקם נכון
            top: 0,
            left: 0,
            zIndex: 10,
        },
    });