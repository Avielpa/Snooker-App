import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { getSeasonEvents } from '../services/matchServices';
import { SafeAreaView } from 'react-native-safe-area-context';

const CalendarScreen = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const data = await getSeasonEvents();
      setTournaments(data);
      setFilteredTournaments(data);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
    }
  };

  const getStatus = (tournament: any) => {
    const now = new Date();
    const start = new Date(tournament.StartDate);
    const end = new Date(tournament.EndDate);
    if (end < now) return 'past';
    if (start <= now && now <= end) return 'active';
    return 'upcoming';
  };

  const filterAndGroupTournaments = () => {
    let data = [...tournaments];

    // Filter by search
    if (search) {
      data = data.filter((t) =>
        t.Name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== 'All') {
      data = data.filter((t) =>
        t.StartDate.startsWith(selectedYear)
      );
    }

    // Group by status
    const grouped: { active: Tournament[]; upcoming: Tournament[]; past: Tournament[] } = {
      active: [],
      upcoming: [],
      past: [],
    };

    data.forEach((tournament) => {
      const status = getStatus(tournament);
      grouped[status].push(tournament);
    });

    return grouped;
  };

  const years = ['All', ...new Set(tournaments.map((t: any) => t.StartDate.slice(0, 4)))];

  const groupedTournaments = filterAndGroupTournaments();

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search tournaments..."
        placeholderTextColor="#ccc"
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView horizontal style={styles.yearFilter}>
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            style={[
              styles.yearButton,
              selectedYear === year && styles.selectedYearButton,
            ]}
            onPress={() => setSelectedYear(year)}
          >
            <Text
              style={[
                styles.yearButtonText,
                selectedYear === year && styles.selectedYearText,
              ]}
            >
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {groupedTournaments.active.map((tournament) => (
          <TournamentCard
            key={tournament.ID}
            tournament={tournament}
            status="active"
          />
        ))}

        {groupedTournaments.upcoming.length > 0 && (
          <Text style={styles.sectionHeader}>Upcoming Tournaments</Text>
        )}
        {groupedTournaments.upcoming.map((tournament) => (
          <TournamentCard
            key={tournament.ID}
            tournament={tournament}
            status="upcoming"
          />
        ))}

        {groupedTournaments.past.length > 0 && (
          <Text style={styles.sectionHeader}>Past Tournaments</Text>
        )}
        {groupedTournaments.past.map((tournament) => (
          <TournamentCard
            key={tournament.ID}
            tournament={tournament}
            status="past"
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

interface Tournament {
  ID: string;
  Name: string;
  StartDate: string;
  EndDate: string;
}

const TournamentCard = ({ tournament, status }: { tournament: Tournament; status: string }) => (
  <TouchableOpacity style={[styles.card, getCardStyle(status)]}>
    <View style={styles.cardContent}>
      <Text style={styles.icon}>{getIcon(status)}</Text>
      <View style={styles.textContainer}>
        <Text style={[styles.name, getTextStyle(status)]}>{tournament.Name}</Text>
        <Text style={[styles.date, getTextStyle(status)]}>
          {tournament.StartDate} - {tournament.EndDate}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const getCardStyle = (status: string) => {
  switch (status) {
    case 'past':
      return styles.pastCard;
    case 'active':
      return styles.activeCard;
    case 'upcoming':
      return styles.upcomingCard;
    default:
      return styles.card;
  }
};

const getTextStyle = (status: string) => {
  switch (status) {
    case 'past':
      return styles.pastText;
    case 'active':
      return styles.activeText;
    case 'upcoming':
      return styles.upcomingText;
    default:
      return styles.text;
  }
};

const getIcon = (status: string) => {
  switch (status) {
    case 'past':
      return '✅';
    case 'active':
      return '🔥';
    case 'upcoming':
      return '📅';
    default:
      return '❓';
  }
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  yearFilter: {
    marginBottom: 12,
  },
  yearButton: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedYearButton: {
    backgroundColor: '#007bff',
  },
  yearButtonText: {
    color: '#333',
  },
  selectedYearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cardContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
    marginLeft: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
  },
  date: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'right',
  },
  pastCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderLeftWidth: 4,
    borderLeftColor: '#999',
  },
  pastText: {
    color: 'white',
    textDecorationLine: 'line-through',
  },
  activeCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderLeftWidth: 4,
    borderLeftColor: 'green',
  },
  activeText: {
    color: 'green',
    fontWeight: 'bold',
  },
  upcomingCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  upcomingText: {
    color: 'white',
  },
});

export default CalendarScreen;
