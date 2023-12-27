import { addOwner, encodeObject } from "../util.js";
import { del, get, post, put } from "./api.js";
import { filterRelation } from "../util.js";

const endpoints = {
    'rooms': `/classes/Room?where=${encodeObject({openForBooking: true})}&include=owner`,
    'roomsPromo': `/classes/Room?where=${encodeObject({openForBooking: true, promo: true})}&include=owner`,
    'roomsWithUser': (userId) => `/classes/Room?where=${encodeObject({ $or: [{ openForBooking: true }, filterRelation('owner', '_User', userId)] })}&include=owner`,
    'roomById': '/classes/Room/',
    'query': (query) => `/classes/Room?where=${encodeObject({ name: { $regex: query, $options: 'i' } })}`,
    'amenities': (whereClause) => `/classes/Room?where=${encodeObject(whereClause)}&include=owner`
}

export async function getAll(userId) {
    if (userId) {
        return get(endpoints.roomsWithUser(userId))
    } else {
        return get(endpoints.rooms);
    }
}

export async function getById(id) {
    return get(endpoints.roomById + id)
}

export async function create(roomData, userId) {
    return post(endpoints.rooms, addOwner(roomData, userId));
}

export async function update(id, roomData, userId) {
    return put(endpoints.roomById + id, addOwner(roomData, userId));
}

export async function deleteById(id) {
    return del(endpoints.roomById + id);
}

export async function searchQuery(query){
    return get(endpoints.query(query));
}

export async function getPromo(){
    return get(endpoints.roomsPromo)
}

export async function getByAmenities(amenities) {
    if(amenities.length == 0){
        return get(endpoints.rooms);
    }
    const whereClause = {
        openForBooking: true,
        features: { $all: amenities }
    };

    return get(endpoints.amenities(whereClause));
}