import { parseNearAmount } from "near-api-js/lib/utils/format";

export class Contract {
  wallet;

  constructor({ wallet }) {
    this.wallet = wallet;
  }

  async get_available_rooms(check_in_date) {
    let availableRooms = await this.wallet.viewMethod({
      method: "get_available_rooms",
      args: { check_in_date: check_in_date },
    });
    return availableRooms;
  }

  async get_rooms_registered_by_owner(owner_id) {
    let registeredRooms = await this.wallet.viewMethod({
      method: "get_rooms_registered_by_owner",
      args: {
        owner_id: owner_id,
      },
    });
    return registeredRooms;
  }

  async get_booking_info_for_owner(owner_id) {
    let bookedRooms = await this.wallet.viewMethod({
      method: "get_booking_info_for_owner",
      args: {
        owner_id: owner_id,
      },
    });
    return bookedRooms;
  }

  async get_booking_info_for_guest(guest_id) {
    let guestBookedRooms = await this.wallet.viewMethod({
      method: "get_booking_info_for_guest",
      args: {
        guest_id: guest_id,
      },
    });
    return guestBookedRooms;
  }

  async exists(owner_id, room_name) {
    let ret = await this.wallet.viewMethod({
      method: "exists",
      args: {
        owner_id: owner_id,
        room_name: room_name,
      },
    });
    return ret;
  }

  async is_available(room_id) {
    let ret = await this.wallet.viewMethod({
      method: "is_available",
      args: {
        room_id: room_id,
      },
    });
    return ret;
  }

  async add_room_to_owner(room) {
    // NEAR -> yoctoNEARに変換
    room.price = parseNearAmount(room.price);

    await this.wallet.callMethod({
      method: "add_room_to_owner",
      args: {
        name: room.name,
        image: room.image,
        beds: Number(room.beds),
        description: room.description,
        location: room.location,
        price: room.price,
      },
    });
  }

  async book_room({ room_id, date, price }) {
    await this.wallet.callMethod({
      method: "book_room",
      args: {
        room_id: room_id,
        check_in_date: date,
      },
      deposit: price,
    });
  }

  async change_status_to_available(room_id, check_in_date, guest_id) {
    await this.wallet.callMethod({
      method: "change_status_to_available",
      args: {
        room_id: room_id,
        check_in_date: check_in_date,
        guest_id: guest_id,
      },
    });
  }

  async change_status_to_stay(room_id, check_in_date) {
    await this.wallet.callMethod({
      method: "change_status_to_stay",
      args: {
        room_id: room_id,
        check_in_date: check_in_date,
      },
    });
  }
}
