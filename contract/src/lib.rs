/*
 * Example smart contract written in RUST
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://near-docs.io/develop/Contract
 *
 */

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};

use std::collections::HashMap;

type RoomId = String;
type CheckInDate = String;

#[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub enum UsageStatus {
    // 空室
    Available,
    // 滞在中
    Stay { check_in_date: CheckInDate },
}

#[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct RegisteredRoom {
    name: String,
    image: String,
    beds: u8,
    description: String,
    location: String,
    price: U128,
    status: UsageStatus,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Room {
    name: String,
    owner_id: AccountId,
    image: String,
    beds: u8,
    description: String,
    location: String,
    price: U128,
    status: UsageStatus,
    booked_info: HashMap<CheckInDate, AccountId>,
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Contract {
    rooms_per_owner: LookupMap<AccountId, Vec<RoomId>>,
    rooms_by_id: HashMap<RoomId, Room>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            rooms_per_owner: LookupMap::new(b"m"),
            rooms_by_id: HashMap::new(),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn add_room_to_owner(
        &mut self,
        name: String,
        image: String,
        beds: u8,
        description: String,
        location: String,
        price: U128,
    ) {
        let owner_id = env::signer_account_id();
        let room_id = format!("{}{}", owner_id, name);
        let new_room = Room {
            owner_id: owner_id.clone(),
            name,
            image,
            beds,
            description,
            location,
            price,
            status: UsageStatus::Available,
            booked_info: HashMap::new(),
        };

        self.rooms_by_id.insert(room_id.clone(), new_room);

        match self.rooms_per_owner.get(&owner_id) {
            Some(mut rooms) => {
                rooms.push(room_id.clone());
                self.rooms_per_owner.insert(&owner_id, &rooms);
            }
            None => {
                let new_rooms = vec![room_id];
                self.rooms_per_owner.insert(&owner_id, &new_rooms);
            }
        }
    }

    pub fn exists(&self, owner_id: AccountId, room_name: String) -> bool {
        let room_id = format!("{}{}", owner_id, room_name);
        self.rooms_by_id.contains_key(&room_id)
    }

    pub fn get_rooms_registered_by_owner(&self, owner_id: AccountId) -> Vec<RegisteredRoom> {
        let mut registered_rooms = vec![];

        match self.rooms_per_owner.get(&owner_id) {
            Some(rooms) => {
                for room_id in rooms {
                    let room = self.rooms_by_id.get(&room_id).expect("ERR_NOT_FOUND_ROOM");
                    let room_status: UsageStatus;
                    match &room.status {
                        UsageStatus::Available => room_status = UsageStatus::Available,
                        UsageStatus::Stay { check_in_date } => {
                            room_status = UsageStatus::Stay {
                                check_in_date: check_in_date.clone(),
                            }
                        }
                    }

                    let registered_room = RegisteredRoom {
                        name: room.name.clone(),
                        beds: room.beds,
                        image: room.image.clone(),
                        description: room.description.clone(),
                        location: room.location.clone(),
                        price: room.price,
                        status: room_status,
                    };

                    registered_rooms.push(registered_room);
                }
                registered_rooms
            }
            None => registered_rooms,
        }
    }
}
