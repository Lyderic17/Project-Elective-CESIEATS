class User {
    user_ID; // Changed from user_ID
    name; // Changed from username
    lastname; // No change
    mail; // Changed from mail
    password; // No change
    phone; // Newly added field
    referer; // Newly added field
    nb_referer; // Newly added field
    role; // No change
    rating; // Newly added field
    address; // No change
    crea_date; // Newly added field
    // Removed usertype, address, billing, restaurantId as they're not in the new DB schema

    toJson = function() {
        const json = {};

        json["user_ID"] = this.id;
        json["name"] = this.name;
        json["lastname"] = this.lastname;
        json["email"] = this.email;
        json["password"] = this.password;
        json["phone"] = this.phone;
        json["referer"] = this.referer;
        json["nb_referer"] = this.nb_referer;
        json["role"] = this.role;
        json["rating"] = this.rating;
        json["address"] = this.address;
        json["crea_date"] = this.crea_date;
        
        return json;
    }
}

module.exports = User;
