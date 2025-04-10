import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getRanking, getPlayerDetails } from '../services/matchServices';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

interface RankingItem {
  ID: number;
  Position: number;
  PlayerID: number;
  Season: number;
  Sum: number;
  Type: string;
}

const rankingTypes = [
  'MoneyRankings',
  'MoneySeedings',
  'OneYearMoneyRankings',
  'QTRankings',
  'WomensRankings',
];

export default function Ranking() {
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);
  const [playerNames, setPlayerNames] = useState<{ [playerId: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('MoneyRankings');
  const router = useRouter();

  useEffect(() => {
    loadRankingData(selectedType);
  }, [selectedType]);

  const loadRankingData = useCallback(async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRanking(type);
      if (data && Array.isArray(data)) {
        setRankingData(data);
        await loadPlayerNames(data);  
      } else {
        setError('No ranking data found.');
      }
    } catch (error) {
      console.error('Failed to load ranking data:', error);
      setError('Failed to load ranking data');
    } finally {
      setLoading(false);
    }
  }, []);  // הסרנו את התלות ב-rankingData.length

  // טוען את שמות השחקנים על בסיס הנתונים שהתקבלו
  const loadPlayerNames = useCallback(async (rankingData: RankingItem[]) => {
    try {
      const names: { [playerId: number]: string } = {};
      const playerIds = rankingData.map((item) => item.PlayerID);
      const uniqueIds = [...new Set(playerIds)];
      const promises = uniqueIds.map(async (playerId) => {
        try {
          const playerData = await getPlayerDetails(playerId);
          return {
            playerId,
            name: playerData
              ? `${playerData?.FirstName || ''} ${playerData?.MiddleName || ''} ${playerData?.LastName || ''}`.trim()
              : 'Unknown Player',
          };
        } catch {
          return { playerId, name: 'Unknown Player' };
        }
      });

      const results = await Promise.all(promises);
      results.forEach(result => {
        names[result.playerId] = result.name;
      });

      setPlayerNames(names);
    } catch (error) {
      setError('Failed to load player names');
    }
  }, []);

  return (
    <SafeAreaView style={styles.overlay}>
      <Text style={styles.title}>Player Rankings</Text>

      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue)}
        style={styles.picker}
        dropdownIconColor="#000"
      >
        {rankingTypes.map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={rankingData}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={({ item }) => (
            <RankingItemComponent item={item} playerNames={playerNames} router={router} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const RankingItemComponent = React.memo(({ item, playerNames, router }: {
  item: RankingItem;
  playerNames: { [playerId: number]: string };
  router: any;
}) => {
  const playerName = playerNames[item.PlayerID] || 'Unknown Player';

  return (
    <TouchableOpacity onPress={() => router.push(`/player/${item.PlayerID}`)}>
      <View style={styles.card}>
        <Text style={styles.position}>{item.Position}.</Text>
        <Text style={styles.name}>{playerName}</Text>
        <Text style={styles.money}>${item.Sum.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
});

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 10,
//     color: '#1c1c1c',
//   },
//   picker: {
//     backgroundColor: '#ffffff',
//     marginVertical: 10,
//     borderRadius: 10,
//     color: '#000',
//   },
//   card: {
//     backgroundColor: '#ffffffee',
//     borderRadius: 12,
//     padding: 12,
//     marginVertical: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   position: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#444',
//     width: 30,
//   },
//   name: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 10,
//   },
//   money: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2e8b57',
//   },
//   errorText: {
//     textAlign: 'center',
//     color: 'red',
//     marginTop: 20,
//   },
// });

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(243, 244, 246, 0.95)', // Tailwind gray-100
  },
  title: {
    fontSize: 28,
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
    marginVertical: 14,
    color: '#1f2937', // Tailwind gray-800
  },
  picker: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    fontFamily: 'PoppinsRegular',
    color: '#111827',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  position: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    color: '#4b5563',
    width: 36,
    textAlign: 'center',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: '#1f2937',
    marginLeft: 10,
  },
  money: {
    fontSize: 16,
    fontFamily: 'PoppinsSemiBold',
    color: '#10b981',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontFamily: 'PoppinsRegular',
    marginTop: 20,
  },
});
