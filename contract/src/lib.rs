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
