'use strict';

const { db, utils } = require('./nodebb');

const Helpers = {};

const createMedalKey = uuid => (`nodebb-plugin-medals:medal:${uuid}`);
const createUserMedalsKey = uid => (`nodebb-plugin-medals:user-medals:${uid}`);
const createAssignedMedalsListKey = uuid => `nodebb-plugin-medals:medal-users:${uuid}`;
const MEDALS_SET_KEY = 'nodebb-plugin-medals:medals';

Helpers.isValidMedalsObject = (medal) => {
	if (!medal.name ||
        !medal.description ||
        !medal.icon ||
        !medal.addedByUid) {
		return false;
	}
	return true;
};

Helpers.createMedalsObject = async ({
	name,
	description,
	className,
	icon,
	iconColor,
	medalColor,
	addedByUid,
	uuid,
	timestamp,
}) => ({
	name,
	description,
	className,
	icon,
	iconColor,
	medalColor,
	addedByUid,
	uuid: uuid || utils.generateUUID(),
	timestamp: timestamp || Date.now(),
});

Helpers.assignMedalToUser = async (uuid, uid) => {
	if (!uid || !uuid) throw new Error('User id or medal id not provided');

	const userMedalsKey = createUserMedalsKey(uid);
	const userMedals = await db.getSortedSetRange(userMedalsKey, 0, -1);
	if (userMedals.indexOf(uuid) > -1) throw new Error(`User with id ${uid} has already been assigned medal ${uuid}.`);

	const medalUsersListKey = createAssignedMedalsListKey(uuid);
	const userList = await db.getSortedSetRange(medalUsersListKey, 0, -1);
	if (userList.indexOf(uid) > -1) throw new Error(`User with id ${uid} has already been assigned medal ${uuid}.`);

	// Add medal uuid to users list
	db.sortedSetAdd(userMedalsKey, Date.now(), uuid);
	// Add user to medals assignees list
	db.sortedSetAdd(medalUsersListKey, Date.now(), uid);
};

Helpers.saveMedals = async (medalsData) => {
	const medalObjects = await Promise.all(medalsData.map(medalData => Helpers.saveMedal(medalData)));
	return medalObjects;
};

Helpers.saveMedal = async (medalData) => {
	const medalObject = await Helpers.createMedalsObject(medalData);
	if (!Helpers.isValidMedalsObject(medalObject)) throw new Error('Not all needed data provided.');

	const medal = await db.getObject(createMedalKey(medalData.uuid));

	if (!medal) {
		await db.sortedSetAdd(MEDALS_SET_KEY, medalObject.timestamp, medalObject.uuid);
	}

	await db.setObject(createMedalKey(medalObject.uuid), medalObject);

	return medalObject;
};

Helpers.getMedals = async () => {
	const uuids = await db.getSortedSetRange(MEDALS_SET_KEY, 0, -1);

	const medals = await Promise.all(uuids.map(uuid => db.getObject(createMedalKey(uuid))));

	return medals;
};

Helpers.deleteMedal = async (uuid) => {
	await db.delete(createMedalKey(uuid));
	await db.sortedSetRemove(MEDALS_SET_KEY, uuid);
	// TODO - remove medal owner list
	// TODO - remove medal uuid from users medal lists
};

module.exports = Helpers;
