import { addOwner, createPointer, encodeDate } from "../util.js";
import { encodeObject, filterRelation } from "../util.js ";
import { get, post, put } from "./api.js";

const endpoints = {
    'reservationsByHost': (ownerId) => `/classes/Reservation?where=${encodeObject({ host: { __type: 'Pointer', className: '_User', objectId: ownerId } })}` + '&include=owner',
    'reservationsByOwner': (ownerId) => `/classes/Reservation?where=${encodeObject({ owner: { __type: 'Pointer', className: '_User', objectId: ownerId } })}` + '&include=owner',
   
    'reservationByRoomId': (roomId) => `/classes/Reservation?where=` + encodeObject(filterRelation('room', 'Room', roomId)) + '&include=owner',
    'reservations': '/classes/Reservation',
    'reservationsUpdate': '/classes/Reservation/',
}

export async function getByRoomId(roomId){
    const data = await get(endpoints.reservationByRoomId(roomId));
    data.results.forEach( r => {
        r.startDate = new Date(r.startDate.iso);
        r.endDate = new Date(r.endDate.iso);
    });
    return data;
}

export async function create(roomData, userId, status = "waiting") {
    roomData = addOwner(roomData, userId);
    roomData.startDate = encodeDate(roomData.startDate);
    roomData.endDate = encodeDate(roomData.endDate);
    roomData.room = createPointer('Room', roomData.room);
    roomData.host = createPointer('_User', roomData.host);
    roomData.status = status;

    return post(endpoints.reservations, addOwner(roomData, userId));

}

export async function update(id, status) {
    const updateData = { status };
    return put(endpoints.reservationsUpdate + id, updateData);
}

export async function getByHost(ownerId){
    return get(endpoints.reservationsByHost(ownerId));
}

export async function getByOwner(ownerId){
    return get(endpoints.reservationsByOwner(ownerId));
}