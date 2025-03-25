import api from './api';

export const getSeasonEvents = async () => {
    try {
        const response = await api.get('events/');
        return response.data;
    } catch (error) {
        console.error("Error fetching season events:", error);
        throw error;
    }
};

export const getPlayersM = async () => {
    try {
        const response = await api.get('players/men/');
        return response.data;
    } catch (error) {
        console.error("Error fetching men players:", error);
        throw error;
    }
};

export const getPlayersW = async () => {
    try {
        const response = await api.get('players/women/');
        return response.data;
    } catch (error) {
        console.error("Error fetching women players:", error);
        throw error;
    }
};

export const getPlayerDetails = async (player_id) => {
    try {
        const response = await api.get(`players/${player_id}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching player details for ID ${player_id}:`, error);
        throw error;
    }
};

export const getRanking = async () => {
    try {
        const response = await api.get('ranking/');
        return response.data;
    } catch (error) {
        console.error("Error fetching ranking:", error);
        throw error;
    }
};

export const getUpcomingMatches = async () => {
    try {
        const response = await api.get('matches/upcoming/');
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        throw error;
    }
};

export const getTourDetails = async (event_id) => {
    try {
        const response = await api.get(`tours/${event_id}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tour details for event ID ${event_id}:`, error);
        throw error;
    }
};