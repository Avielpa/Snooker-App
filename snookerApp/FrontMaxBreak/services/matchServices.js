import axios from "axios";
import { api, apiDataBase, snookerArg } from "./api";
import getStatus  from '../app/CalendarScreen';

export const getSeasonEvents = async () => {
    try {
        const response = await api.get('events/');
        return response.data;
    } catch (error) {
        console.error("Error fetching season events:", error);
        throw error;
    }
};

export const getPlayerFromInternalAPI = async (player_id) => {
    try {
        const response = await api.get(`player_by_id/${player_id}/`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
        } else {
            console.error(`Error fetching player ${player_id} from internal API:`, error.message);
        }
        return null;
    }
};

const externalAPIRequestQueue = [];
let processingQueue = false;
const MAX_REQUESTS_PER_MINUTE = 10;
const REQUEST_INTERVAL = 60000 / MAX_REQUESTS_PER_MINUTE; 

export const getPlayerFromExternalAPI = async (player_id) => {
    return new Promise((resolve) => {
        externalAPIRequestQueue.push({
            player_id,
            resolve
        });
        
        if (!processingQueue) {
            processExternalAPIQueue();
        }
    });
};

const processExternalAPIQueue = async () => {
    processingQueue = true;
    
    while (externalAPIRequestQueue.length > 0) {
        const request = externalAPIRequestQueue.shift();
        
        try {
            const url = `https://api.snooker.org/?p=${request.player_id}`;            
            const snookerResponse = await axios.get(url, {
                headers: {
                    'X-Requested-By': 'FahimaApp128',
                },
            });
            
            request.resolve(snookerResponse.data);
        } catch (error) {
            console.error(`Error fetching from external API for player ${request.player_id}:`, error.message);
            if (error.response) {
                console.error(`External API returned status: ${error.response.status}`);
            }
            request.resolve(null); // פתרון הבטחה עם null במקרה של שגיאה
        }
        
        // המתנה בין בקשות כדי לא לעבור את המגבלה
        if (externalAPIRequestQueue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL));
        }
    }
    
    processingQueue = false;
};

export const getPlayerDetails = async (player_id) => {
    const internalData = await getPlayerFromInternalAPI(player_id);
    
    if (internalData) {
        return internalData;
    }
    
    return await getPlayerFromExternalAPI(player_id);
};

export const getRanking = async (string) => {
    try {
        const response = await api.get('ranking/');
        return response.data;
    } catch (error) {
        console.error("Error fetching ranking:", error);
        throw error;
    }
};



export const getUpcomingMatches = async (page = 1) => {
    try {
        const response = await api.get(`matches/upcoming/?page=${page}`);
        const matches = response.data;

        // סדר את המשחקים לפי ScheduledDate
        matches.sort((a, b) => {
            const dateA = new Date(a.ScheduledDate);
            const dateB = new Date(b.ScheduledDate);
            return dateA - dateB;
        });

        return matches;
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


export const getCurrentTour = async () => {
    try {
        const tours = await getSeasonEvents(); // קבלת רשימת הטורנירים
        const now = new Date(); // קבלת התאריך והשעה הנוכחיים

        // מציאת הטורניר הפעיל
        const activeTour = tours.find((tournament) => {
            const start = new Date(tournament.StartDate);
            const end = new Date(tournament.EndDate);
            return start <= now && now <= end;
        });

        // החזרת רשימת המשחקים של הטורניר הפעיל (אם קיים)
        if (activeTour) {
            const response = await api.get(`curr_tour_matches/upcoming/?event_id=${activeTour.ID}`);
            return response.data; // החזרת רשימת המשחקים
        } else {
            console.log("No active tour found.");
            return null; // החזרת null אם לא נמצא טורניר פעיל
        }
    } catch (error) {
        console.error('Error fetching tour', error);
        throw error;
    }
};