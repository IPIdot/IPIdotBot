const {Model, DataTypes} = require("sequelize");
const { DB } = require("../../globals")

// ############### User Model ###############

class User extends  Model {

	get discordId () { return this.m_discordId; }

	set discordId (_value) {
		this.m_discordId = _value;
		return this;
	}

	get lastname () { return this.m_lastname; }

	set lastname (_value) {
		this.m_lastname = _value;
		return this;
	}

	get firstname () { return this.m_firstname; }

	set firstname (_value) {
		this.m_firstname = _value;
		return this;
	}

	/**
	 *  Verify if an user already use a discord id
	 * @param {string} _userId
	 * @return {Promise<boolean>} true if exist in database
	 */
	static async isExist(_userId) {
		return await User.findByDiscordId(_userId) !== null;
	}

	/**
	 * Find a user by it's unique discord id
	 * @param {string} _userId
	 * @return {Promise<User|null>}
	 */
	static async findByDiscordId(_userId) {
		return await User.findOne({ where: { discordId: _userId } });
	}

	/**
	 * Perform deletion of the user with return
	 * @return {Promise<boolean>} true if deletion work, else false
	 */
	async delete() {
		return await User.destroy({ where: { discordId: this.m_discordId }}) > 0;
	}
}

User.init({
	m_discordId: {
		field: "discordId",
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	m_firstname: {
		field: "firstname",
		type: DataTypes.STRING,
		allowNull: false
	},
	m_lastname: {
		field: "lastname",
		type: DataTypes.STRING,
		allowNull: false
	}}, {
	sequelize: DB,
	modelName: "User",
	paranoid: false
});

// ############### END ###############

// ############### User utils ###############
// ############### END ###############


// ############### Module Exports area #############

module.exports.User = User;

// ############### END ###############

